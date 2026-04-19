# The iOS Patterns Compendium: What 4,597 Sessions Taught Me About SwiftUI, State, and Survival

If you ship iOS with AI agents in the loop, here are the five patterns that survived 4,597 sessions across three apps — the state architecture, the memory trap, the iCloud conflict strategy, the Keychain rules, and the multi-simulator matrix that catches bugs before the App Store does.

Our iOS app was eating 847MB of memory on a device with 3GB available. An agent found and fixed the problem in twelve minutes. A human developer had spent three days on the same issue the previous week. The difference wasn't intelligence. It was approach. The agent started from Instruments data (what's actually leaking) rather than source code (what might be leaking).

That fix came from session logs that now span 4,241 files for ils-ios alone, plus 252 for code-tales-ios and 104 for amplifier-ios. Across 23,479 total sessions in this series, the iOS work generated the single largest project by data volume: 4.6GB of session logs, 1.5 million lines, 287 agent spawns. iOS is where agents earn their keep or crash and burn. No middle ground.

This post distills the five patterns that survived: state management, memory profiling, iCloud sync, Keychain security, multi-simulator validation. Production Swift code that emerged from watching agents make the same mistakes hundreds of times, then encoding the corrections. The companion repo at [claude-code-ios](https://github.com/krzemienski/claude-code-ios) organizes each pattern file by symptom rather than framework. When you're debugging at 11 PM, you know the symptom, not the root cause.

## The Architecture That Emerged

Building iOS apps with AI agents produces a layered architecture whether you plan for it or not. The agent needs boundaries: clear ownership of state, explicit interfaces between layers, and isolation that prevents a fix in one area from breaking three others. Here's the structure that stabilized after hundreds of sessions:

> **Diagram: Four-Layer iOS Architecture**
> - UI Layer: SwiftUI Views + view-local `@State` + Equatable rows
> - State Layer: `@Observable AppState`, `@Environment` injection, immutable updates
> - Service Layer: CloudKitSyncEngine (actor), KeychainManager (actor), PerformanceProfiler (Sendable)
> - Platform Layer: CKContainer, SecItem API, `mach_task_basic_info`, `xcrun simctl`
> - Views depend on State; State depends on Services; Services depend on Platform APIs

Four layers. Views own only their local rendering state. An `@Observable` model owns shared app state and distributes it through `@Environment`. Service-layer actors handle all I/O (CloudKit, Keychain, performance monitoring) with Swift's actor isolation guaranteeing thread safety. Platform APIs sit at the bottom, touched only through service wrappers.

This isn't an architecture astronaut diagram. It's the minimum structure required to keep agents from creating retain cycles, race conditions, and state corruption. Every layer boundary exists because removing it caused bugs in production.

## SwiftUI State: The Pattern Census

The state management taxonomy came from watching agents make the same mistakes across hundreds of sessions. Here's a census of our codebase:

| Pattern | Occurrences | Role |
|---------|-------------|------|
| `@State` | 6,254 | View-local, ephemeral |
| `@MainActor` | 207 | Thread safety |
| `@Observable` | 120 | Shared model objects |
| `@Environment` | 112 | Dependency injection |
| `@Published` | 67 | Legacy observation |
| `ObservableObject` | 56 | Legacy protocol |
| `@StateObject` | 21 | Legacy lifecycle |
| `@EnvironmentObject` | 16 | Legacy injection |

6,254 uses of `@State` versus 120 of `@Observable`. The migration from the old observation system to the new one was still in progress, and the boundary between them was where most bugs lived.

The Combine bridge complexity tells a parallel story: 360 Combine references, 36 `removeDuplicates`, 35 `sink {}` closures, 33 `weak self` captures, 33 `objectWillChange` calls, 13 `AnyCancellable` instances. Each `weak self` exists because someone got burned by a retain cycle. Each `removeDuplicates` exists because a Combine pipeline fired redundantly. Every one of these is a scar.

### Three Mistakes Agents Make Repeatedly

**Mistake 1: Using @State for shared data.** An agent declares `@State private var items: [Item] = []` in a parent view, passes it through bindings, and wonders why child views aren't updating. `@State` is view-local, view-owned. Shared data needs a shared owner:

```swift
// Wrong: @State array in parent causes full list re-render
// Right: @Observable model + Equatable rows

@Observable
final class AppState {
    var sessions: [Session] = []
    var selectedSessionID: UUID?
    var isLoading: Bool = false
    var errorMessage: String?

    var selectedSession: Session? {
        sessions.first { $0.id == selectedSessionID }
    }

    func addSession(_ session: Session) {
        sessions = sessions + [session] // Immutable append
    }

    func removeSession(id: UUID) {
        sessions = sessions.filter { $0.id != id }
    }
}
```

Notice the immutable operations: `sessions + [session]` instead of `sessions.append(session)`, `.filter` instead of `.remove(at:)`. This is deliberate. Mutation inside `@Observable` classes produces subtle ordering bugs when multiple views observe the same property. New collections every time. The compiler optimizes the copy anyway.

**Mistake 2: Creating ObservableObject instances in the view body.** Every SwiftUI render cycle calls `let viewModel = ViewModel()`, creating a fresh instance each frame. State resets on every parent re-render. The fix: `@StateObject` (legacy) or `@State` with `@Observable` so the instance survives re-renders.

**Mistake 3: Prop-drilling through six levels of hierarchy.** A theme color defined at the app root, passed through `NavigationStack`, `TabView`, `ContentView`, `DetailView`, `HeaderView`, finally used in `TitleLabel`. Six intermediate views carrying a parameter they never use. Sound familiar? Just use `@Environment` injection at the root and direct access at the leaf.

The diagnostic heuristic: if your view rebuilds when you type in an unrelated text field, your state architecture is wrong.

### View Rebuild Optimization

One concrete measurement from a product list screen: 340 view rebuilds per scroll gesture. 340! The cause was an `@ObservedObject` at the list level that triggered full-list invalidation on every item change. Moving to granular `@Observable` properties, where each item tracked its own state, dropped rebuilds to 12 per scroll. Same visual result, 96% fewer render cycles.

The key technique is `Equatable` conformance on row views:

```swift
struct SessionRow: View, Equatable {
    let session: Session

    static func == (lhs: SessionRow, rhs: SessionRow) -> Bool {
        lhs.session.id == rhs.session.id &&
        lhs.session.title == rhs.session.title &&
        lhs.session.toolCallCount == rhs.session.toolCallCount
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(session.title)
                    .font(.headline)
                Text("\(session.toolCallCount) tool calls")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text(session.createdAt, style: .relative)
                .font(.caption2)
                .foregroundStyle(.tertiary)
        }
        .padding(.vertical, 4)
    }
}
```

SwiftUI checks `Equatable` conformance before diffing the view tree. If the row hasn't changed according to your equality check, it skips the body entirely. For a list of 500 sessions, that's the difference between rendering 500 views and rendering 12.

## The Memory Crisis and Performance Profiling

The 847MB memory crisis started with a single Instruments trace. The allocation graph looked like a staircase: every navigation push added memory that never came back. Users were seeing jetsam terminations on older devices.

An agent identified three problems in twelve minutes:

1. **Retained image caches.** A `UIImage` cache with no `countLimit` or `totalCostLimit`. Every product image ever scrolled past stayed resident. The math is brutal: 200 images at 1170x2532 RGBA is `200 * 1170 * 2532 * 4 = 2.37GB`. That's your memory leak, right there in arithmetic.

2. **Un-cancelled network tasks.** Each view fired `URLSession` tasks on `viewDidAppear` but never cancelled them on `viewDidDisappear`. Navigate forward and back ten times, ten redundant fetches pile up, each holding response data in its completion closure.

3. **ObservableObject reference cycles.** A view model held a strong reference to a service, which held a strong reference to a delegate, which held a strong reference back to the view model. The agent identified it from the Instruments "Leaks" instrument, not from reading code. The code looked fine. The runtime behavior didn't.

```
Before: 847MB peak, 34 leaked objects per navigation cycle
After:  312MB peak, 0 leaked objects
Time:   12 minutes of agent work
```

The performance profiler that came out of this uses `mach_task_basic_info` for real memory readings, not the sanitized numbers from `ProcessInfo`:

```swift
public struct MemorySnapshot: Sendable {
    public let timestamp: Date
    public let residentMemoryMB: Double
    public let virtualMemoryMB: Double

    public static func capture() -> MemorySnapshot {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(
            MemoryLayout<mach_task_basic_info>.size
        ) / 4
        let result = withUnsafeMutablePointer(to: &info) { infoPtr in
            infoPtr.withMemoryRebound(
                to: integer_t.self,
                capacity: Int(count)
            ) { ptr in
                task_info(mach_task_self_,
                         task_flavor_t(MACH_TASK_BASIC_INFO),
                         ptr, &count)
            }
        }

        let residentMB = result == KERN_SUCCESS
            ? Double(info.resident_size) / 1_048_576.0
            : 0

        return MemorySnapshot(
            timestamp: Date(),
            residentMemoryMB: residentMB,
            virtualMemoryMB: Double(info.virtual_size) / 1_048_576.0
        )
    }
}
```

The profiler runs on a background queue, takes snapshots every 5 seconds, and warns when resident memory exceeds 200MB. For the performance optimization effort (40 dedicated worktree sessions) the target was app memory under 100MB. The implementation centered on a `CacheService` with LRU eviction, monitored by `mach_task_basic_info` with an 80MB warning threshold and a 60-second cooldown between alerts. For large message lists (200+ messages), we switched to `LazyVStack` to avoid keeping off-screen views in memory.

## The nonisolated Compiler Trap

This one deserves its own section because it burns every developer exactly once. The Swift compiler suggests `nonisolated` on mutable stored properties in `@Observable` classes annotated with `@MainActor`. It looks like helpful advice. It's a trap.

The `@ObservationTracked` macro generates mutable backing storage (`_property`) that inherits the `nonisolated` attribute. Using plain `nonisolated` on those properties breaks the build with errors that point to generated code you can't see. The fix is `nonisolated(unsafe)`, an escape hatch that tells the compiler "I know what I'm doing, don't enforce isolation on this property."

Ever followed a compiler suggestion only to get a worse error? That's this. And it led to one of ten rules that emerged from session `5713bfed`:

1. NEVER use `Task.detached` - loses actor context
2. NEVER replace `try?` with `try!` - use do/catch
3. NEVER fix ILSShared files without building BOTH iOS and macOS
4. NEVER batch more than 5 fixes before building
5. NEVER trust audit report blindly - always READ the file
6. NEVER fix @State/@Binding by changing default value
7. NEVER add `as! Type` to fix a type error
8. NEVER change sync to async without updating ALL callers
9. NEVER follow compiler's `nonisolated` suggestion on @Observable @MainActor classes
10. NEVER claim PASS without reading every screenshot

These aren't style preferences. Each one represents a debugging session that cost hours. Rule 4 alone ("never batch more than 5 fixes") exists because an agent once applied 23 fixes in one pass, the build broke, and the error messages pointed to interactions between fixes that were individually correct but collectively incompatible. I still don't fully understand why some of those interactions happened. The Swift compiler's error reporting when macros are involved is, let's just say, not great.

## iCloud Sync and CloudKit Conflicts

Two devices editing the same record offline, then syncing. The classic multi-device problem. The work ran across 57 dedicated worktree sessions with 12 references to `CKContainer`, 16 to `CloudKitService.swift`, and 11 to `NSUbiquitousKeyValueStore`.

Three conflict resolution strategies exist: **last-write-wins** (simple but lossy), **field-level merge** (each field tracks its own modification, so Device A's title change and Device B's description change both survive), and **operational transform** (the Google Docs approach, overkill for a typical iOS app).

We went with `CKRecord` change tokens with field-level merge on conflict:

```swift
public func saveWithConflictResolution(
    record: CKRecord,
    localFields: [String: CKRecordValueProtocol],
    maxRetries: Int = 3
) async throws -> CKRecord {
    var currentRecord = record
    var attempt = 0

    while attempt < maxRetries {
        do {
            return try await database.save(currentRecord)
        } catch let error as CKError
            where error.code == .serverRecordChanged {
            attempt += 1
            guard let serverRecord = error.serverRecord,
                  let clientRecord = error.clientRecord else {
                throw SyncError.conflictResolutionFailed(
                    reason: "Missing records in conflict"
                )
            }
            // Start from server record (correct change tag),
            // apply only our local field changes
            currentRecord = serverRecord
            for (key, value) in localFields {
                currentRecord[key] = value
            }
        }
    }
    throw SyncError.maxRetriesExceeded(attempts: maxRetries)
}
```

The critical insight: start from the server record, not the client record. The server record has the correct change tag. Apply only the fields this device explicitly changed. Everything else keeps the server's version.

Here's a real scenario that validated this. A user edited items on their iPhone over the weekend while their iPad sat powered off. Monday morning, iPad comes online, 47 conflicts from two days of divergent edits. Last-write-wins would have silently dropped half the changes. Field-level merge preserved all of them. The user never saw a conflict dialog.

## Keychain as the Credential Boundary

A security audit found OAuth tokens in `UserDefaults`. How bad is that? Any app extension with the same app group can read `UserDefaults`. On a jailbroken device, any process can. `UserDefaults` is a property list file on disk with no encryption at rest.

The actor-based Keychain wrapper solves the thread safety problem that most Keychain implementations ignore:

```swift
public actor KeychainManager {
    public let service: String
    public let accessGroup: String?

    public func save(key: String, data: Data) throws {
        // Delete existing first to avoid errSecDuplicateItem
        try? delete(key: key)

        var query = baseQuery(for: key)
        query[kSecValueData as String] = data
        query[kSecAttrAccessible as String] =
            kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.saveFailed(
                status: status, key: key
            )
        }
    }
}
```

Why an actor? Keychain operations are synchronous C calls that block the caller. Wrapping them in an actor ensures serial access (no two callers race on the same keychain item) and moves the blocking work off the main thread when called with `await`. Four methods: save, load, delete, exists. That's the entire API surface.

Three mistakes agents make with Keychain:

**Forgetting `kSecAttrAccessible` flags.** Without an explicit flag, credentials are readable when the device is unlocked, including from background processes. For OAuth tokens, `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` is correct. Biometric access uses `kSecAttrAccessControl` with `biometryCurrentSet`.

**Not handling `errSecItemNotFound` vs `errSecDuplicateItem`.** A read that finds nothing returns `errSecItemNotFound`, not `nil`. A write that collides returns `errSecDuplicateItem`, not an overwrite. The delete-before-save pattern in the code above sidesteps the duplicate issue entirely.

**Mixing Keychain access groups across targets.** The main app and its widget extension need different access groups unless you explicitly configure a shared group. An agent that adds Keychain storage to the widget without updating entitlements gets a silent `errSecMissingEntitlement`. No crash. No error dialog. Just credentials that silently fail to save. I don't want to think about how long that one took to track down.

## Multi-Simulator Validation

The Friday afternoon bug: layout broken on iPhone SE (375pt width), fine on iPhone 15 (393pt width). The primary CTA button got clipped by 18 points. Untappable. It shipped on a Thursday. Three days passed before a support ticket revealed it. During those three days, new item creation dropped 40% from SE users.

Eighteen points. That's what separated "works" from "doesn't work."

The data across all 23,479 sessions shows how much simulator work happened: 2,620 `idb_tap` calls, 2,165 `simulator_screenshot` captures, 1,239 `idb_describe` queries, 479 gestures, 128 `xcode_build` invocations. Nearly 8,000 iOS MCP interactions total. Agents were living inside simulators.

> **Diagram: Multi-Simulator Validation Flow**
> - Parallel boot of iPhone SE (375x667pt), iPhone 15 (393x852pt), iPad Air (820x1180pt)
> - `xcrun simctl install` pushes the app to each booted device
> - Scenario matrix (Login Flow, Onboarding, Settings, Dark Mode) fans out across devices
> - Evidence capture: screenshots, accessibility tree queries, memory reports

The minimum viable device matrix:

| Device | Width | Height | Why |
|--------|-------|--------|-----|
| iPhone SE | 375pt | 667pt | Smallest active screen |
| iPhone 15 | 393pt | 852pt | Modal screen size |
| iPad Air | 820pt | 1180pt | Tablet layout breakpoints |

The `SimulatorOrchestrator` boots devices in parallel using Swift's structured concurrency, distributes validation scenarios round-robin across devices, and captures screenshots as evidence:

```swift
public func runParallelValidation(
    on devices: [SimulatorDevice],
    appBundleID: String,
    scenarios: [String]
) async throws -> [ValidationResult] {
    var assignments: [(SimulatorDevice, String)] = []
    for (index, scenario) in scenarios.enumerated() {
        let device = devices[index % devices.count]
        assignments.append((device, scenario))
    }

    return try await withThrowingTaskGroup(
        of: ValidationResult.self
    ) { group in
        for (device, scenario) in assignments {
            group.addTask {
                try await self.runSingleValidation(
                    deviceID: device.id,
                    appBundleID: appBundleID,
                    scenario: scenario
                )
            }
        }
        var collected: [ValidationResult] = []
        for try await result in group {
            collected.append(result)
        }
        return collected
    }
}
```

Accessibility labels serve as device-independent tap targets. Instead of tapping coordinates (which shift between screen sizes), the validation script taps by label: `app.buttons["createItemButton"].tap()`. Same label, different coordinates, correct behavior on every device.

## The Compound Effect

These five patterns interact in ways that bite you. A retain cycle in an `@ObservedObject` causes both a memory leak and a state bug: the zombie view model responds to updates for a view that no longer exists. iCloud sync depends on correct Keychain access. If the OAuth token that authenticates CloudKit gets stored insecurely, the entire sync layer breaks. Multi-simulator validation catches failures that only emerge from interaction, like a retain cycle that only shows up on iPad because the navigation flow differs from iPhone.

The worktree distribution tells the story of where the time went: 65 sessions on the native macOS app, 57 on iCloud sync, 46 on multi-agent teams, 44 on custom themes, 43 on SSH service, 40 on performance optimization.

The session count isn't a vanity metric. It's the iteration count required to discover that iOS development with agents requires pattern libraries, not just code generation. An agent that knows Swift syntax can write a Keychain wrapper. An agent that's hit `errSecMissingEntitlement` three times before knows to check the entitlements file first. Big difference.

The [claude-code-ios](https://github.com/krzemienski/claude-code-ios) repo contains five organized Swift files:

| File | Symptom It Solves |
|------|-------------------|
| `StatePatterns.swift` | "My list re-renders 500 rows when one item changes" |
| `KeychainManager.swift` | "Race conditions saving credentials on background threads" |
| `CloudKitSync.swift` | "Device B overwrites Device A's changes" |
| `PerformanceProfiler.swift` | "Memory keeps growing and I don't know why" |
| `SimulatorOrchestrator.swift` | "I need to validate on 4 simulators at once" |

Each file is self-contained. Copy the one that matches your current bug. They're organized by symptom, not by framework, because at 11 PM, you know the symptom. The root cause is what these patterns help you find.

---

*Originally published at: https://site-rho-pied.vercel.app/posts/post-05-ios-patterns*

*One of 18 essays in "Agentic Development: 18 Lessons from 23,479 AI Coding Sessions." Companion code: github.com/krzemienski/claude-code-ios*
