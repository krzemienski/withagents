# Post 5: "982 Sessions of iOS: State, Sync, and Performance"

## Metadata
- Target word count: 2,500
- Source posts: old 30 (multi-simulator), old 32 (SwiftUI state), old 34 (iCloud sync), old 39 (performance), old 40 (keychain)
- Companion repo: `claude-code-ios` (Swift, 1 star)
- New content needed: No -- five source posts cover every iOS pattern. Needs consolidation into a compendium structure with a unifying thread.

## Opening (hook -- 2 sentences max)
Our iOS app was consuming 847MB of memory on a device with 3GB available. The fix took an agent twelve minutes and dropped usage to 312MB -- but finding the fix required patterns we'd learned across 982 sessions.

## Narrative Arc

1. **The memory crisis** -- From post 39. The 847MB -> 312MB fix as the opening story. What the agent found: retained image caches, un-cancelled network tasks accumulating across view lifecycle, and ObservableObject reference cycles. The twelve-minute fix versus the three days a human spent not finding it. Instruments profiling output that pinpointed the leak. This is the hook that pulls readers into the broader iOS patterns story. ~350 words

2. **SwiftUI state: Observable vs @State vs @Environment** -- From post 32. The pattern taxonomy agents learned the hard way. The three mistakes agents make repeatedly: (1) using @State for shared data that should be @Observable, (2) creating new ObservableObject instances in view body, (3) passing state through 6 levels of view hierarchy instead of using @Environment. The diagnostic pattern: "If your view rebuilds when you type in an unrelated text field, your state architecture is wrong." Real before/after showing a view that rebuilt 340 times per scroll reduced to 12. ~400 words

3. **iCloud sync and CloudKit conflicts** -- From post 34. The three conflict resolution strategies: last-write-wins (simple but lossy), field-level merge (complex but complete), operational transform (overkill for most apps). The pattern that worked for ils-ios: CKRecord change tokens with field-level merge on conflict. The Monday morning bug: two devices editing offline over a weekend, 47 conflicts on sync. The resolution: deterministic merge order based on device UUID + timestamp, with a conflict log the user never sees but the developer can audit. Task reference: 007-icloud-sync. ~400 words

4. **Keychain as the credential boundary** -- From post 40. Why UserDefaults is not security -- any app with the same app group can read it. The Keychain wrapper pattern: a thin Swift actor that abstracts kSecClassGenericPassword operations behind async/await. The three things agents get wrong: (1) forgetting kSecAttrAccessible flags (credentials readable when device locked), (2) not handling errSecItemNotFound vs errSecDuplicateItem, (3) mixing Keychain access groups across targets. Task reference: 003-keychain-credential-storage. ~350 words

5. **Multi-simulator validation** -- From post 30. The Friday afternoon bug: layout broken on iPhone SE, three days of users unable to tap the primary CTA. The minimum viable device matrix: iPhone SE (375x667), iPhone 15 (393x852), iPad Air (820x1180). Accessibility labels as device-independent tap targets. Parallel simulator boot: 45s sequential to 18s parallel. The pattern: boot all three, run the same validation script, diff the screenshots. ~350 words

6. **The compound effect** -- Tying it together. These five patterns are not independent -- memory leaks interact with state management, iCloud sync depends on correct Keychain access, and multi-simulator validation catches the failures that emerge from their interaction. The 982-session count is not a vanity metric -- it is the iteration count required to discover that iOS development with agents requires pattern libraries, not just code generation. ~250 words

## Key Code Blocks to Include
- The memory profiling output showing 847MB -> 312MB -- from post 39
- The @Observable vs @State before/after (simplified) -- from post 32
- The CKRecord conflict resolution handler (core logic) -- from post 34
- The Keychain wrapper actor interface (5-6 lines) -- from post 40
- The parallel simulator boot script (compact) -- from post 30

## Real Data Points
- 847MB -> 312MB memory reduction in 12 minutes (post 39)
- 340 view rebuilds per scroll reduced to 12 (post 32)
- 47 iCloud conflicts from weekend offline editing (post 34)
- Parallel simulator boot: 45s -> 18s (post 30)
- iPhone SE layout bug: 3 days undetected, 40% drop in new item creation (post 30)
- 982 total iOS sessions across ils-ios project
- Task references: 007-icloud-sync, 003-keychain-credential-storage, 012-performance-optimization-suite

## Material to NOT Include
- SSE streaming bridge architecture (that's post 4)
- SDK bridge and failed approaches (that's post 4)
- pbxproj merge conflicts (that's post 4)
- SSH terminal implementation (that's post 4)
- Full Instruments trace output from post 39 (too detailed)
- The complete KeychainManager implementation from post 40 (show interface only)
- The full ParallelSimulatorOrchestrator class from post 30 (too detailed)
- The SimulatorNavigator idb parsing code from post 30
- The element visibility comparison logic from post 30
- Post 32's full MVVM refactoring walkthrough (too long)
- Post 34's NSPersistentCloudKitContainer setup guide (tutorial content)

## Companion Repo Tie-in
The `claude-code-ios` repo contains organized Swift pattern files covering state management, iCloud sync, Keychain access, and performance profiling. Each pattern is a standalone file with the problem statement, the wrong approach, and the working solution. "Pick the pattern that matches your current bug. They are organized by symptom, not by framework."
