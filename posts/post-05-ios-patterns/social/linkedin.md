# LinkedIn — Post 5

Our iOS app was eating 847MB of memory on a device with 3GB available. An agent found and fixed the problem in twelve minutes. A human developer had spent three days on the same issue the week before.

The difference wasn't intelligence. It was approach. The agent started from Instruments data, not source code. 4,241 sessions on ils-ios, 252 on code-tales-ios, 104 on amplifier-ios. 4.6GB of session logs. The single largest project in my dataset.

**Three Root Causes in Twelve Minutes**

A `UIImage` cache with no `countLimit` or `totalCostLimit`. 200 images at 1170x2532 RGBA is 2.37GB resident. The math is brutal, and it's right there in arithmetic.

`URLSession` tasks fired on `viewDidAppear` but never cancelled on `viewDidDisappear`. Navigate forward and back ten times, ten redundant fetches pile up, each holding response data in its completion closure.

An `ObservableObject` reference cycle invisible to code review, obvious in Instruments. Before: 847MB peak, 34 leaked objects per navigation cycle. After: 312MB peak, zero leaks.

**Ten NEVER Rules From Session 5713bfed**

Each one cost hours of debugging. Rule 9: NEVER follow the compiler's `nonisolated` suggestion on `@Observable @MainActor` classes. Use `nonisolated(unsafe)`. The macro generates backing storage that inherits the attribute. Plain `nonisolated` breaks the build with errors that point to generated code you can't see.

Rule 4: NEVER batch more than 5 fixes before building. An agent once applied 23 fixes in one pass. The build broke. Error messages pointed to interactions between fixes that were individually correct but collectively incompatible.

Rule 10: NEVER claim PASS without reading every screenshot. The iOS dataset: 2,620 `idb_tap` calls, 2,165 simulator screenshots, 1,239 accessibility tree queries. Agents live inside simulators for a reason.

**The Friday Bug That Shipped for Three Days**

Primary CTA button clipped by 18 points on iPhone SE (375pt). Fine on iPhone 15 (393pt). Untappable. Shipped on a Thursday. New item creation dropped 40% from SE users before anyone noticed.

Eighteen points. That's what separated "works" from "doesn't work." The minimum viable device matrix now runs on every build.

The minimum viable device matrix now: iPhone SE, iPhone 15, iPad Air. Parallel boot via `SimulatorOrchestrator`. Tap by accessibility label, not coordinates. When layout shifts, the labels stay the same and tap coordinates update automatically.

The state pattern census from the codebase: 6,254 uses of `@State` versus 120 of `@Observable`. Migration in progress. The boundary between old and new observation systems is where most bugs lived. 360 Combine references. 36 `removeDuplicates`. Every `weak self` capture is a scar from a retain cycle someone got burned by.

One product list screen was re-rendering 340 times per scroll gesture. The cause: an `@ObservedObject` at the list level that triggered full-list invalidation on every item change. Moving to granular `@Observable` properties with `Equatable` conformance on row views dropped rebuilds to 12 per scroll. Same visual result, 96% fewer render cycles. SwiftUI checks `Equatable` before diffing the view tree. If the row hasn't changed, it skips the body entirely.

Full post + code in the comments.
