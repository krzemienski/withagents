# Miner 2: iOS Deep Dive — Session Evidence for Posts 4 & 5

**Source:** `~/.claude/projects/-Users-nick-Desktop-ils-ios/` (785 sessions, 334 worktree sessions)
**Date mined:** 2026-03-06

---

## Corpus Overview

| Metric | Count |
|--------|-------|
| Total iOS main sessions | 785 |
| Total worktree sessions | 334 |
| Sessions mentioning SSE/streaming | 320 |
| Sessions with idb/simulator calls | 202 |
| Sessions with xcodebuild commands | 256 |
| Sessions with SwiftUI state patterns | 296 |
| Sessions with iCloud references | 278 |
| Sessions with Keychain references | 176 |
| **Total idb/simulator tool calls** | **32,744** |
| **Total xcodebuild invocations** | **29,908** |
| BUILD SUCCEEDED count | 1,078 |
| BUILD FAILED count | 577 |
| Build success rate | ~65% |

### Top Sessions by Size

| File | Size | Date |
|------|------|------|
| `62115115-a3af-4295-9d67-1ed895321e3d.jsonl` | 338 MB | Feb 21 |
| `2a0bd3db-9261-4dbe-a811-c35d21749f04.jsonl` | 126 MB | Feb 17 |
| `c446ea21-196e-41d3-bd23-60f0090197df.jsonl` | 102 MB | Feb 16 |
| `d413cd78-f2a0-4ad4-9b31-ec82e658e663.jsonl` | 91 MB | Feb 22 |
| `5713bfed-c26f-413c-b172-008b5a65a1d0.jsonl` | 76 MB | Feb 18 |
| `33771457-38a0-470b-b05a-c441ea3b14bf.jsonl` | 73 MB | Feb 8 |

### Worktree Sessions by Task

| Worktree | Sessions | Topic |
|----------|----------|-------|
| tasks-001-native-macos-app | 65 | macOS native app |
| tasks-007-icloud-sync | 57 | iCloud sync |
| tasks-010-advanced-multi-agent-team-coordination | 46 | Multi-agent teams |
| tasks-002-custom-themes-creator | 44 | Custom themes |
| tasks-011-complete-ssh-service-implementation | 43 | SSH service |
| tasks-012-performance-optimization-suite | 40 | Performance |
| tasks-006-syntax-highlighted-code-blocks | 29 | Code blocks |
| tasks-003-keychain-credential-storage | 10 | Keychain |

---

## Post 4: iOS Streaming Bridge Evidence

### SSE Bridge Architecture

The SSE streaming bridge connects a Vapor backend to SwiftUI through a 5-layer pipeline. Evidence from session `33771457` documents the full flow:

**Layer 1 — Backend (Vapor):** `ChatController.swift` routes `POST /api/v1/chat/stream`. The `ClaudeExecutorService` actor spawns Claude CLI as a subprocess, reads stdout on a dedicated GCD queue, and yields `StreamMessage` events via `AsyncThrowingStream<StreamMessage, Error>`.

**Layer 2 — SSE Transport:** `SSEClient.swift` (280 lines) — 60s connection timeout, 45s heartbeat watchdog, 3 reconnection attempts, Last-Event-ID support. Sends `ChatStreamRequest` with `ChatOptions` as JSON body. The event types returned: `stream_event`, `system`, `result`.

**Layer 3 — Message Parsing:** `StreamMessage.swift` defines 7 cases:
- `system`, `assistant`, `user`, `result`, `streamEvent`, `permission`, `error`
- Content block sub-types: `.text(block)`, `.thinking(block)`, `.textDelta(text)`, `.thinkingDelta(thinking)`, `.toolResult(block)`
- CLI outputs snake_case NDJSON, converted to camelCase: `session_id` -> `sessionId`, `tool_use` -> `toolUse`, `total_cost_usd` -> `totalCostUSD`

**Layer 4 — ViewModel:** `ChatViewModel.swift` (498 lines) — Handles all 7 SSE event types, uses 75ms batched updates for UI performance. 233 debounce references and 39 batched-update references found across sessions.

**Layer 5 — SwiftUI:** `ChatView` with `@State private var viewModel = ChatViewModel()` consumes the stream. Status banner shows `SSEClient.ConnectionState` with `ProgressView` animations. Token count and elapsed seconds displayed during streaming.

**Flow path (from session evidence):**
```
SSEClient.performStream() -> POST /api/v1/chat/stream -> ChatController -> ExecutionOptions(from: input.options) -> executor.execute() -> buildCommand() with 32+ CLI flags
```

### SSE Bridge File References

| File | Lines | Role | Mention Count |
|------|-------|------|---------------|
| SSEClient.swift | 280 | SSE transport, reconnection | 42 |
| ChatViewModel.swift | 498 | Stream consumption, batched updates | 42 |
| StreamMessage.swift | ~200 | 7-case enum, snake_case conversion | 50 |
| ChatController.swift | ~300 | Route handlers, 4 endpoints | 42 |
| APIClient.swift | ~150 | HTTP client, actor-based | 51 |
| ConnectionManager.swift | ~200 | @Observable @MainActor state | 88 |

### Real Build Errors Encountered

**Error 1: @Observable vs ObservableObject migration mismatch**
- File: `ILSMacApp.swift:123`
- Error: `value of type 'ConnectionManager' has no member '$showOnboarding'`
- Cause: ConnectionManager migrated from ObservableObject to @Observable, but macOS AppState still used Combine publishers (`cm.$showOnboarding.removeDuplicates().sink`)
- Fix: Removed Combine import, replaced with `didSet` bidirectional sync
- Impact: 4 occurrences of this exact error, 2 for `objectWillChange`

**Error 2: @Observable conformance cascade** (10 occurrences)
- Error: `instance method 'environment' requires that 'AppState' conform to 'Observable'`
- Error: `instance method 'environmentObject' requires that 'ThemeManager' conform to 'ObservableObject'` (6 occurrences)
- Error: `generic struct 'StateObject' requires that 'SettingsViewModel' conform to 'ObservableObject'` (2 occurrences)
- Cause: Mixed usage of @Observable (iOS) and ObservableObject (macOS) across shared module
- Fix: Systematic migration: `@EnvironmentObject var x: T` -> `@Environment(T.self) var x`, `@StateObject var x = T()` -> `@State var x = T()`, `.environmentObject(x)` -> `.environment(x)`

**Error 3: `no exact matches in call to initializer`** (18 occurrences in session c446ea21)
- Common Swift type inference failure during large refactors

**Error 4: FleetHost Content conformance** (4 occurrences)
- Error: `referencing instance method 'post(_:use:)' on 'APIResponse' requires that 'FleetHost' conform to 'Content'`
- Backend model missing Vapor Content protocol conformance

### War Story 1: Bidirectional @Published Infinite Recursion

**Session:** `33771457-38a0-470b-b05a-c441ea3b14bf.jsonl` (28 references to `infinite recursion`)
**Error:** `Thread stack size exceeded due to excessive recursion`
**Root cause:** Classic bidirectional @Published sync infinite recursion. `AppState.showOnboarding` setter triggers a Combine subscription that sets `ConnectionManager.showOnboarding`, which triggers another subscription that sets `AppState.showOnboarding` again — infinite loop until stack overflow.
**Fix:** Add `removeDuplicates()` guards on Combine subscriptions:
```swift
cm.$showOnboarding.removeDuplicates().sink { [weak self] (value: Bool) in
    self?.showOnboarding = value
}.store(in: &cancellables)

$showOnboarding.dropFirst().removeDuplicates().sink { [weak cm] (value: Bool) in
    cm?.showOnboarding = value
}.store(in: &cancellables)
```
**Lesson:** `@Published` emits on `willSet` before storage updates, so property-read guards are unreliable — use stream dedup instead.

### War Story 2: Actor Deadlock in SystemMetricsService

**Session:** `62115115-a3af-4295-9d67-1ed895321e3d.jsonl` (46 deadlock references)
**Error:** System metrics endpoint times out, all actor calls blocked
**Root cause:** `waitUntilExit()` called before `readDataToEndOfFile()` in `SystemMetricsService.getProcesses()`. When `ps aux` output exceeds ~64KB pipe buffer, the process blocks writing while the actor is blocked waiting for exit. Since `SystemMetricsService` is an actor, this deadlock also blocks ALL subsequent actor calls (including `getMetrics()`), causing a cascading failure.
**Fix:** Read stdout data BEFORE calling `waitUntilExit()`.
**Lesson:** Never call `waitUntilExit()` before reading all pipe data on actors. The cascade blocks the entire actor.

### War Story 3: nonisolated Compiler Suggestion Trap

**Session:** `5713bfed-c26f-413c-b172-008b5a65a1d0.jsonl`
**Error:** Compiler suggests changing `nonisolated(unsafe)` to `nonisolated` on mutable stored properties in `@Observable` classes
**Root cause:** The `@ObservationTracked` macro generates a mutable backing `_property` that inherits the attribute. Using plain `nonisolated` (as the compiler suggests) breaks the build because the backing property becomes non-isolated but mutable.
**Fix:** Use `nonisolated(unsafe)` and accept the misleading compiler warning.
**Lesson:** NEVER follow the compiler's suggestion to use `nonisolated` on Task properties in `@Observable @MainActor` classes.

### Simulator Validation Evidence

**idb/simulator tool call breakdown across top 4 sessions:**

| Tool | Calls |
|------|-------|
| `idb_describe` | 3,163 |
| `simulator_screenshot` | 1,583 |
| `idb_tap` | 1,443 |
| `simulator_launch` | 493 |
| `idb_gesture` | 381 |
| `idb_find_element` | 135 |
| `idb_input` | 82 |
| `simulator_boot` | 80 |
| `idb_check_quality` | 8 |

**xcrun simctl commands across top 3 sessions:**

| Command | Count |
|---------|-------|
| `xcrun simctl create` | 7,801 |
| `xcrun simctl io` | 35 |
| `xcrun simctl status_bar` | 12 |
| `xcrun simctl openurl` | 11 |
| `xcrun simctl launch` | 11 |
| `xcrun simctl terminate` | 10 |
| `xcrun simctl install` | 10 |
| `xcrun simctl spawn` | 9 |
| `xcrun simctl list` | 8 |
| `xcrun simctl boot` | 8 |

**Dedicated simulator:** UDID `50523130-57AA-48B0-ABD0-4D59CE455F14` (iPhone 16 Pro Max, iOS 18.6)

**Actual xcodebuild commands used:**
```bash
xcodebuild -project ILSApp/ILSApp.xcodeproj -scheme ILSApp -destination 'id=50523130-57AA-48B0-ABD0-4D59CE455F14' -quiet
xcodebuild -project ILSApp/ILSApp.xcodeproj -scheme ILSMacApp -destination 'platform=macOS' -quiet
```

---

## Post 5: iOS Patterns Compendium

### SwiftUI State Patterns Found (from largest session)

| Pattern | Occurrences |
|---------|-------------|
| `@State` | 6,254 |
| `@MainActor` | 207 |
| `@Observable` | 120 |
| `@Environment(` | 112 |
| `@Published` | 67 |
| `ObservableObject` | 56 |
| `@StateObject` | 21 |
| `@EnvironmentObject` | 16 |
| `@Binding` | 4 |
| `@ObservedObject` | 3 |

**Key pattern:** The app uses modern `@Observable` (120 refs) with legacy `ObservableObject` (56 refs) still present — the migration war documented across sessions. `@State` dominates at 6,254 uses.

### Combine Bridge Complexity (from largest session)

| Pattern | Count |
|---------|-------|
| `Combine` | 360 |
| `removeDuplicates` | 36 |
| `sink {` | 35 |
| `weak self` | 33 |
| `objectWillChange` | 33 |
| `dropFirst` | 14 |
| `AnyCancellable` | 13 |

### iCloud Sync Sessions

**Worktree:** `tasks-007-icloud-sync` (57 sessions)
**Key patterns found:**
- `NSUbiquitousKeyValueStore` (11 refs) — used for lightweight key-value sync
- `CKContainer(identifier:)` (12 refs) — CloudKit container configuration
- `CloudKitService.swift` — main service file (16 refs)
- `CloudKitSyncTests.swift` — validation tests (16 refs)
- `iCloudKeyValueStoreTests.swift` — KVS validation (10 refs)
- Conflict resolution: "merge logic based on modification dates" (8 refs)
- Container identifier: `iCloud.com.example.ILSApp.test`

**Build errors encountered:**
- `cannot find type 'CloudKitServiceError' in scope` (12 occurrences)
- `cannot find type 'CloudKitService' in scope` (8 occurrences)
- `cannot find 'SyncViewModel' in scope` (7 occurrences)
- `The directory .../007-icloud-sync/ILSApp/ILSApp does not contain an Xcode project` (4 occurrences — worktree path confusion)
- `'rotate' is only available in iOS 18.0 or newer` (4 occurrences)

### Keychain Sessions

**Worktree:** `tasks-003-keychain-credential-storage` (10 sessions)
**Key patterns found:**
- `KeychainService.swift` — main service file (15 refs)
- `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` (10 refs) — access policy
- `kSecClass as String: kSecClassGenericPassword` (8 refs) — generic password items
- `kSecAttrService as String: serviceName` (8 refs) — service identification
- `SecItemCopyMatching(query as CFDictionary, &result)` (4 refs) — read
- `SecItemAdd(query as CFDictionary, nil)` (2 refs) — write
- `SecItemDelete(query as CFDictionary)` (2 refs) — delete
- `errSecItemNotFound` (4 refs) — item not found handling
- `kSecAttrAccessControl with biometryCurrentSet` (2 refs) — biometric access
- "KeychainService with automatic migration" (7 refs)

**Build errors encountered:**
- `cannot find 'KeychainService' in scope` (3 occurrences — file not yet added to Xcode project)
- `'ILSApp.xcodeproj' does not exist` (4 occurrences — worktree path issue)
- `Unable to find a device matching the provided destination specifier` (2 occurrences)

### Performance Optimization

**Worktree:** `tasks-012-performance-optimization-suite` (40 sessions)
**Key patterns found:**
- `CacheService` (77 refs) — centralized caching layer
- Target: app memory under 100MB (23 refs)
- `Instruments` (22 refs), `Time Profiler` (7 refs)
- `LRU` eviction (2 refs) — cache eviction strategy
- `TipKit` (4 refs) — used alongside cache and lazy loading
- `LazyVStack` (3 refs) — for large message lists
- Memory monitoring: `mach_task_basic_info` API, warnings at 80MB threshold with 60s cooldown
- Memory pressure handling: LRU eviction, 50MB/100 image limits
- Lazy loading for large message lists (200+ messages)
- `Task.detached(priority: .background)` — background processing

**Performance plan structure (from session):**
1. Phase 1: Launch optimization
2. Phase 2: Memory usage optimization — lazy loading, cache optimization, memory-efficient data structures
3. Verification: "Open session with 100+ messages. Use Xcode Memory Graph to verify only visible messages are loaded in memory. Total app memory should be < 100MB."

### SSH Service Implementation

**Worktree:** `tasks-011-complete-ssh-service-implementation` (43 sessions)
**Key patterns found:**
- `SSHService.swift` (73 refs) — main service
- `SSHError.notConnected` (56 refs), `SSHError.portForwardingFailed` (56 refs), `SSHError.connectionFailed` (36 refs)
- `SSHClient.connect()` (36 refs) — connection establishment
- `SSHAuthenticationMethod` (32 refs) — auth protocol
- `SSHTunnelRelayHandler` (30 refs) — port forwarding relay
- SSH DirectTCPIP channel for port forwarding (27 refs)
- Citadel library for SSH implementation (18 refs)
- `SSHError.commandFailed` (18 refs) — command execution errors

### Hard-Won NEVER Rules (from session 5713bfed)

These rules were written INTO session context after painful debugging:

1. **NEVER use `Task.detached`** — it loses actor context and Sendable safety; use plain `Task` which inherits correctly
2. **NEVER replace `try?` with `try!`** — that's worse; use `do/catch` with `AppLogger.shared.error()`
3. **NEVER fix ILSShared files without building BOTH iOS and macOS** — they share the module and WILL break the other target
4. **NEVER batch more than 5 fixes before building** — Swift cascade errors make root cause diagnosis impossible beyond 5 changes
5. **NEVER trust the audit report blindly** — SyntaxHighlighter was flagged for "Array.contains" but already used `Set<String>` for all 17 grammar classes; always READ the file before fixing
6. **NEVER fix a @State/@Binding issue by changing the default value** — changing `activeScreen` default crashes the app because @EnvironmentObject isn't ready during @State init
7. **NEVER add `as! Type` to fix a type error** — masks the real problem, crashes at runtime
8. **NEVER change a function from sync to async without updating ALL callers** — the PollingManager refactor required updating 6 callers across ILSAppApp.swift AND ILSMacApp.swift; missing one = build failure
9. **NEVER follow the compiler's suggestion to use `nonisolated`** on Task properties in `@Observable @MainActor` classes — the `@ObservationTracked` macro generates mutable backing properties that conflict
10. **NEVER claim PASS without reading every screenshot** — file existence is not verification; a screenshot of a crash dialog is still a `.png` file

### Runtime Issue Distribution (across top 6 sessions)

| Issue | Total Mentions |
|-------|---------------|
| Memory leak | 1,323 |
| Retain cycle | 1,262 |
| Deadlock | 153 |
| Infinite recursion | 37 |
| Race condition | 57 |
| Infinite loop | 12 |

### Multi-Platform Build Evidence

The app targets both iOS and macOS with shared code in ILSShared module. This is evidenced by:
- Two distinct xcodebuild commands (iOS with simulator destination, macOS with `platform=macOS`)
- 65 worktree sessions dedicated to native macOS app development
- Shared module errors requiring both builds to pass

---

## Key Quotable Evidence for Blog Posts

### Post 4 Quotes

**Bridge architecture (from session 33771457):**
> `SSEClient.performStream() -> POST /api/v1/chat/stream -> ChatController -> ExecutionOptions(from: input.options) -> executor.execute() -> buildCommand() with 32+ CLI flags`

**ClaudeExecutorService documentation (from session 33771457):**
> "Two-tier timeout system: 30s initial timeout triggers if no stdout data received (detects stuck CLI); 5min total timeout kills long-running processes (prevents runaway execution)"

**SSEClient specification (from session 33771457):**
> "SSEClient.swift (280 lines) — 60s connection timeout, 45s heartbeat watchdog, 3 reconnection attempts, Last-Event-ID support"

**ChatViewModel specification (from session 33771457):**
> "ChatViewModel.swift (498 lines) — Sends ChatStreamRequest with ChatOptions, handles all 7 SSE event types (system, assistant, user, result, streamEvent, permission, error), batched updates (75ms)"

**URL coordination warning (from session 33771457):**
> "SSEClient, MetricsWebSocket, ConnectionManager, ServerSetupSheet, SystemMetricsViewModel each have their own default. Missing any one would cause a silent connection failure."

### Post 5 Quotes

**Actor deadlock insight:**
> "waitUntilExit() called before readDataToEndOfFile() in SystemMetricsService.getProcesses(). When ps aux output exceeds ~64KB pipe buffer, process blocks on write while we block on waitUntilExit(). Since SystemMetricsService is an actor, this deadlock also blocks ALL other actor calls"

**@Published recursion insight:**
> "@Published emits on willSet before storage updates, so property-read guards are unreliable — use stream dedup instead"

**Compiler trap warning:**
> "NEVER follow the compiler's suggestion to use `nonisolated` on Task properties in `@Observable @MainActor` classes — the `@ObservationTracked` macro generates mutable backing properties that conflict with `nonisolated`; use `nonisolated(unsafe)` instead"

---

## ADDENDUM: Deep Session Mining — Real Code Evidence (Miner R2)

**Mined by:** Research Miner R2 (second pass)
**Method:** Direct JSONL extraction from top 15 sessions, ~1.2GB total data analyzed
**Focus:** Actual Swift code snippets, architectural documentation, bug evidence

### Post 4 Addendum: Real SSEClient Code Extracted

**Source:** Session `3f41c441` line 147 (48MB, Feb 9, branch `design/v2-redesign`)

The complete SSEClient class as read by agents during the design/v2-redesign work:

```swift
import Foundation
import Combine
import ILSShared

/// Server-Sent Events client for streaming chat responses
@MainActor
class SSEClient: ObservableObject {
    @Published var messages: [StreamMessage] = []
    @Published var isStreaming: Bool = false
    @Published var error: Error?
    @Published var connectionState: ConnectionState = .disconnected

    enum ConnectionState: Equatable {
        case disconnected
        case connecting
        case connected
        case reconnecting(attempt: Int)
    }

    private var streamTask: Task<Void, Never>?
    private let baseURL: String
    private var currentRequest: ChatStreamRequest?
    private var reconnectAttempts = 0
    private let maxReconnectAttempts = 3
    private let reconnectDelay: UInt64 = 2_000_000_000 // 2 seconds in nanoseconds
    private let session: URLSession
    private var lastEventId: String?
    nonisolated private let jsonEncoder = JSONEncoder()
    nonisolated private let jsonDecoder = JSONDecoder()

    init(baseURL: String = "http://localhost:9999") {
        self.baseURL = baseURL
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 300  // 5 minutes for initial response
        config.timeoutIntervalForResource = 3600 // 1 hour for entire stream duration
        self.session = URLSession(configuration: config)
    }
}
```

Note: Earlier version in session `c08ce5dd` (Feb 6) used port 9090 and lacked `lastEventId` and `nonisolated` encoders. The evolution is visible across sessions.

### Post 4 Addendum: ClaudeExecutorService Dual-Mode Architecture

**Source:** Session `3f41c441` line 86 — The actual code documentation from `ClaudeExecutorService.swift`

This is critical evidence the blog post should reference. The production architecture evolved from the Python bridge described in the post to a dual-mode Node.js/CLI system:

```swift
/// Actor managing Claude subprocess execution with streaming JSON output.
///
/// ## Architecture
///
/// Supports two execution backends:
/// 1. **Agent SDK** (default): Spawns `node scripts/sdk-wrapper.mjs` which calls the
///    `@anthropic-ai/claude-agent-sdk` npm package. The SDK calls the Anthropic API directly
///    — no `claude` subprocess — which avoids the hang that occurs when spawning `claude -p`
///    inside an active Claude Code session.
/// 2. **CLI fallback**: Spawns `claude -p --output-format stream-json` directly. Use this
///    when running the backend outside a Claude Code session (standalone).
///
/// Both backends produce NDJSON on stdout in the same format. The stdout reading, JSON
/// parsing, and StreamMessage conversion are shared.
///
/// ### Timeout Protection
///
/// Two-tier timeout system:
/// - 30s initial timeout: triggers if no stdout data received (detects stuck CLI)
/// - 5min total timeout: kills long-running processes (prevents runaway execution)
```

**Architectural insight:** The blog post describes a Python SDK bridge, but the production code uses a Node.js Agent SDK wrapper (`sdk-wrapper.mjs`). This represents an evolution: Python bridge -> Node.js Agent SDK bridge. The key design decision was that both backends produce identical NDJSON on stdout, so the entire downstream pipeline (parsing, SSE conversion, SwiftUI rendering) is shared regardless of backend choice.

### Post 4 Addendum: ChatController SSE Endpoints

**Source:** Session `3f41c441` line 84

```swift
struct ChatController: RouteCollection {
    let executor = ClaudeExecutorService()

    func boot(routes: RoutesBuilder) throws {
        let chat = routes.grouped("chat")
        chat.post("stream", use: stream)
        chat.webSocket("ws", ":sessionId", onUpgrade: handleWebSocket)
        chat.post("permission", ":sessionId", ":requestId", use: permission)
        chat.post("cancel", ":sessionId", use: cancel)
    }
}
```

Four endpoints: SSE streaming, WebSocket bidirectional, permission approval, and cancellation. The permission endpoint is for Claude's tool_use approval flow — the iOS app renders tool permission requests and lets the user approve/deny.

### Post 4 Addendum: ChatViewModel Streaming State

**Source:** Session `425dccee` (30MB, Feb 11) — "End-to-End Streaming Chat Reliability" implementation

```swift
@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var isStreaming = false
    @Published var isLoadingHistory = false
    @Published var error: Error?
    @Published var connectionState: SSEClient.ConnectionState = .disconnected
    @Published var connectingTooLong = false
    @Published var streamTokenCount: Int = 0
    @Published var streamElapsedSeconds: Double = 0
    @Published var pendingPermissionRequest: PermissionRequest?
    private var streamStartTime: Date?

    var currentStreamingMessage: ChatMessage? {
        guard isStreaming, let lastMessage = messages.last, !lastMessage.isUser else {
            return nil
        }
        return lastMessage
    }

    var statusText: String? {
        if isLoadingHistory { return "Loading history..." }
        switch connectionState {
        case .disconnected: return nil
        case .connecting:
            return connectingTooLong ? "Taking longer than expected..." : "Connecting..."
        case .connected: return nil
        case .reconnecting(let attempt):
            return "Reconnecting (attempt \(attempt))..."
        }
    }
}
```

Real-time token counting, elapsed time tracking, and a "taking longer than expected" UX hint for slow connections.

### Post 4 Addendum: APIClient Actor

**Source:** Session `3f41c441` line 128

```swift
actor APIClient {
    let baseURL: String
    private let session: URLSession
    nonisolated private let decoder: JSONDecoder
    nonisolated private let encoder: JSONEncoder
    private var cache: [String: CacheEntry] = [:]
    private let defaultCacheTTL: TimeInterval = 30 // 30 seconds

    private struct CacheEntry {
        let data: Data
        let timestamp: Date
        func isValid(ttl: TimeInterval) -> Bool {
            Date().timeIntervalSince(timestamp) < ttl
        }
    }

    init(baseURL: String = "http://localhost:9999") {
        self.baseURL = baseURL
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        config.timeoutIntervalForResource = 30
        config.waitsForConnectivity = false
        self.session = URLSession(configuration: config)
        // ...
    }
}
```

Uses Swift `actor` (not @MainActor) for proper isolation. Built-in cache with 30s TTL. Separate timeouts from SSEClient (10s request vs SSEClient's 300s).

### Post 5 Addendum: Quality Remediation Scoring

**Source:** Session `2a0bd3db` (126MB, Feb 17) — "Cross-Platform Quality Remediation"

A Reflexion system scored project quality at **2.375/5.0**. Root causes identified by 3 parallel exploration agents:

1. `cleanTitle()` duplicated 6x with inconsistent logic (DRY violation)
2. iOS `try?` silently swallowing HIGH-severity failures (8 instances across 7 files)
3. macOS structural issues (ungrouped @State, duplicate data loading, hardcoded models)
4. iPad: zero validation performed
5. Axiom skill compliance: 0%

**Already fixed (confirmed by grep in-session):**
| Issue | Evidence |
|-------|----------|
| AppDelegate dead code | 20 lines remaining |
| O(n) fetch | Single endpoint |
| import AppKit | MacChatView:1 |
| try? in exports | Proper do/catch with NSAlert |
| print() in macOS | 0 matches across all macOS files |
| Hardcoded "Version 1.0.0" | No matches found |
| "Intelligent Learning System" | No matches found |

### Post 5 Addendum: 13 Visual Themes CONFIRMED

**Source:** Session `3f41c441` — File listing under `ILSApp/ILSApp/Theme/Themes/`

13 named theme files found:
1. CarbonTheme, 2. CrimsonTheme, 3. ElectricGridTheme, 4. EmberTheme, 5. GhostProtocolTheme, 6. GraphiteTheme, 7. MidnightTheme, 8. NeonNoirTheme, 9. ObsidianTheme, 10. PaperTheme, 11. SlateTheme, 12. SnowTheme, 13. AppTheme

Plus `ILSTheme.swift` (protocol/enum) and `Theme.swift` (registry).

### Post 5 Addendum: Actor Pattern Usage

**Source:** Multiple sessions

The project uses Swift actors extensively for service layer isolation:
- `actor APIClient` — HTTP with cache (10s/30s timeouts)
- `actor TunnelService` — Cloudflare tunnel management (spawns `cloudflared` subprocess)
- `actor SSHService` — Remote server operations via Citadel library
- `actor ClaudeExecutorService` — Dual-mode subprocess management
- `actor KeychainManager` — Credential storage with SecItem APIs

While ViewModels use `@MainActor class: ObservableObject` for SwiftUI integration.

### Post 5 Addendum: Project Scale from Session Evidence

**Source:** Session `c446ea21` (102MB, Feb 16) — Cross-Platform Audit Plan

Exact quote from agent exploration report:
> "64 iOS views, 7 macOS views, 15 ViewModels, 14 Services — 14 backend controllers with 70+ API endpoints — Backend running on port 9999, both iOS/iPad simulators booted, macOS app running — 40 modified + 2 untracked files (uncommitted from prior session work)"

Commit messages from git log in session:
> `feat: implement all insights recommendations — hooks, skills, scripts`
> `fix: comprehensive audit fix — 279 issues across 13 categories`

### Post 5 Addendum: LazyVStack Performance Optimization

**Source:** Session `425dccee` — Explicit task description

The session contained an explicit optimization task:
> "Ensure ChatMessageList uses lazy rendering for performance with large message counts — Ensure the message list uses LazyVStack (not VStack) for rendering messages — Tool call accordions/disclosure groups should be collapsed by default (only expand on user tap) — Add .id() modifiers on message views for efficient SwiftUI diffing — If there's a ScrollViewReader, ensure scrollTo only triggers when needed (not on every message update)"

### Post 5 Addendum: Validation Gate Protocol

**Source:** Session `33771457` — iOS Validation Gate skill embedded in CLAUDE.md

The project enforced a 3-gate validation protocol via Claude Code skills:

```
Gate 1: SIMULATOR — Screenshot + Read + Accessibility
Gate 2: BACKEND — Health + Endpoint Verification
Gate 3: ANALYSIS — Logs + Screenshot + Behavior
ALL THREE must PASS. No exceptions. No shortcuts.
```

Full validation loop written into the project constitution (CLAUDE.md):
1. Build backend: `swift build --product ILSBackend` (0 errors, 0 warnings)
2. Build iOS app: `xcodebuild -workspace ILSFullStack.xcworkspace -scheme ILSApp ... build`
3. Start backend: `PORT=9999 swift run ILSBackend`
4. Verify backend: `lsof -i :9999 -P -n`
5. Boot simulator: `xcrun simctl boot 50523130-57AA-48B0-ABD0-4D59CE455F14`
6. Install app, launch, take screenshot, verify

### Gaps Identified by R2

1. **$380 cost**: Not found as explicit figure. Session c446ea21 has 2,290 cost-related lines but aggregate likely from Anthropic dashboard.
2. **149 Swift files**: Sessions show 213+ view files. The 149 may reference an earlier snapshot or specific subset.
3. **Line 929 handleAssistantMessage**: Exact line not found; the bug pattern (overwrite vs append in streaming deltas) is confirmed architecturally.
4. **982 sessions in Post 5 title**: Current count is 785. May include original `ils` project sessions (that directory has no JSONL files now, possibly archived).

---

## Metrics Summary

| Metric | Value |
|--------|-------|
| Total iOS sessions (main) | 785 |
| Total worktree sessions | 334 |
| Total idb/simulator calls | 32,744 |
| Total xcodebuild invocations | 29,908 |
| Build success rate | ~65% (1,078 success / 577 fail) |
| SSE-related sessions | 320 (41%) |
| SwiftUI state sessions | 296 (38%) |
| iCloud sessions | 278 (35%) |
| Keychain sessions | 176 (22%) |
| Simulator validation sessions | 202 (26%) |
| Memory leak mentions | 1,323 |
| Retain cycle mentions | 1,262 |
| Deadlock mentions | 153 |
| Race condition mentions | 57 |
| Unique worktree task types | 58 (7 with sessions) |
| Largest single session | 338 MB |
