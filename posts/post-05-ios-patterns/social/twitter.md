# X Thread — Post 5

**Tweet 1:** Our iOS app was eating 847MB of memory on a device with 3GB available.

An agent found and fixed it in twelve minutes. A human dev had spent three days the week before.

The difference wasn't intelligence. It was approach.

**Tweet 2:** 4,241 sessions on ils-ios. 252 on code-tales-ios. 104 on amplifier-ios. 4.6GB of session logs. The single largest project in my dataset.

Five Swift patterns survived. State management. Memory profiling. iCloud sync. Keychain. Multi-simulator validation.

**Tweet 3:** Memory crisis, three root causes in twelve minutes:

1. UIImage cache with no countLimit. 200 images × 1170×2532 RGBA = 2.37GB resident.
2. Network tasks never cancelled on viewDidDisappear.
3. ObservableObject reference cycles invisible to code review, obvious in Instruments.

Before: 847MB. After: 312MB.

**Tweet 4:** State pattern census from the actual codebase:

@State: 6,254 uses
@MainActor: 207
@Observable: 120
@Environment: 112
@Published: 67
ObservableObject: 56

Migration in progress. The boundary between old and new observation systems is where most bugs lived.

**Tweet 5:** One product list screen: 340 view rebuilds per scroll gesture.

Root cause: `@ObservedObject` at the list level triggering full invalidation.

Fix: granular `@Observable` + `Equatable` conformance on row views.

After: 12 rebuilds per scroll. 96% fewer render cycles.

**Tweet 6:** Ten NEVER rules emerged from session `5713bfed`. Each cost hours of debugging.

Rule 9: NEVER follow the compiler's `nonisolated` suggestion on @Observable @MainActor classes. Use `nonisolated(unsafe)`.

Rule 4: NEVER batch more than 5 fixes before building.

Rule 10: NEVER claim PASS without reading every screenshot.

**Tweet 7:** CloudKit conflict resolution war story.

User edits on iPhone over the weekend. iPad powered off. Monday: 47 conflicts from two days of divergence.

Last-write-wins would've silently dropped half the changes. Field-level merge on CKRecord tokens preserved all of them. User never saw a dialog.

**Tweet 8:** OAuth tokens in UserDefaults. Any app extension in the same group can read it. Jailbroken device? Any process.

Actor-based Keychain wrapper. `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. Delete-before-save to dodge `errSecDuplicateItem`.

Four methods: save, load, delete, exists. That's the entire API.

**Tweet 9:** The Friday bug that shipped for three days: primary CTA button clipped by 18 points on iPhone SE (375pt). Fine on iPhone 15 (393pt). Untappable.

New item creation dropped 40% from SE users before anyone noticed.

Eighteen points. That's what separated "works" from "doesn't work."

**Tweet 10:** Multi-simulator validation now runs the minimum matrix: iPhone SE, iPhone 15, iPad Air. Parallel boot via `SimulatorOrchestrator`. Tap by accessibility label, not coordinates.

2,620 idb_taps and 2,165 screenshots across the dataset. Agents live inside simulators.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
