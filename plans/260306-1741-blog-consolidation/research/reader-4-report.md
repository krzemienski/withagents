# Reader 4 Extraction Report

Posts 31-40 | 10 posts | 73,397 total words

---

## Post 31: Stale Build Cache: The Hidden Killer
**Word count:** 6,325
**Target consolidated post:** NEW 13 — Debugging

### Keep (best material)
- Opening war story: Claude Code spent 34 minutes debugging a route that didn't exist because the Next.js dev server was serving old cached bundles. "It checked the file path. It verified the export signature. It renamed the file. It moved the file. It added console.log statements. It deleted and recreated the file. It searched Next.js documentation for App Router conventions. It tried Pages Router syntax instead. It restructured the entire API directory. It considered switching to Express."
- The taxonomy of stale cache types is genuinely useful: HMR cache (dev server doesn't pick up new routes), TypeScript declaration cache (.tsbuildinfo lies about types), module resolution cache (node_modules/.cache has stale transforms), build output cache (.next/cache persists between builds), package manager cache (lock file says one version, cache serves another)
- The "ghost route" pattern: route file exists on disk, TypeScript compiles, but dev server returns 404. Agent debugs for 34 min. Fix: restart dev server (2 seconds).
- PostToolUse hook pattern that detects stale cache indicators — checking if agent modified files then got unexpected behavior without restarting
- Metric: "In our logs, 23% of all debugging sessions longer than 15 minutes were caused by stale caches"
- The "cache-first debugging checklist" concept: before debugging anything, restart the dev server, clear build caches, verify the runtime matches the source

### Cut (LLM filler)
- "This is where the detection system comes in" — 2x
- "Let's examine" — 3x
- "The beauty of this approach" — 1x
- "It's worth noting" — 2x
- "robust" — 3x
- "seamless" — 1x
- Section "The Psychology of Cache Debugging" is padding — restates the opening anecdote in abstract terms
- Section "Why This Matters for the Future" — pure filler, generic predictions about AI tooling
- "The implications extend beyond" — 1x
- Several paragraphs that restate "caches cause false debugging" in different words

### Unique Insights
- The specific 23% metric for stale-cache-caused debugging sessions
- The PostToolUse hook implementation that detects "file changed but behavior unchanged" patterns
- The taxonomy of 5 distinct cache types (HMR, TS declaration, module resolution, build output, package manager)
- The concept of a "cache invalidation waterfall" — clearing caches in dependency order

### Code Worth Keeping
- The `dev-server-restart-reminder.js` PostToolUse hook that watches for file edits followed by unchanged behavior
- The `CacheGuardian` class with `detectStaleness()` method — checks file mtimes vs. cache mtimes
- The bash script that does full cache clearing: `rm -rf .next node_modules/.cache .tsbuildinfo`

### Mermaid Diagrams Worth Keeping
- "Cache Staleness Detection Flow" — shows decision tree: file changed → behavior unchanged → check cache age → restart or clear
- "Cache Type Hierarchy" — maps the 5 cache types and their invalidation dependencies

---

## Post 32: 982 Sessions of SwiftUI: State Management at Scale
**Word count:** 6,141
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- Opening story: 2.9GB of session logs from 982 Claude Code sessions on the same iOS app. "Session 411 used @StateObject. Session 412 used @ObservedObject. Session 413 went back to @StateObject. Session 414 tried @EnvironmentObject. Each session discovered the same bug — the view wasn't updating — and each session fixed it differently."
- The core finding: "After 982 SwiftUI sessions, three patterns dominate: @Observable for new code, unidirectional data flow for complex screens, and navigation state machines for deep linking. Everything else is noise."
- The @Observable migration story — agent kept generating iOS 16 @StateObject code, had to be taught iOS 17 @Observable via CLAUDE.md directives
- "The agent generated @StateObject in 73% of sessions before we added the CLAUDE.md directive. After: 94% @Observable."
- Navigation state machine pattern — replacing NavigationPath string-based routing with enum-based type-safe navigation
- The "view model explosion" anti-pattern: agent creates a new ViewModel for every view, leading to 47 ViewModels for 23 screens
- Unidirectional data flow pattern with Action/State/Reducer architecture for complex screens
- The distinction between "agent-friendly" and "agent-hostile" patterns — @Observable is agent-friendly because it has fewer gotchas

### Cut (LLM filler)
- "Let's dive into" — 2x
- "powerful" — 4x
- "elegant" — 2x
- "seamless" — 2x
- "It's worth noting" — 3x
- "Before we begin" — 1x
- "The beauty of" — 2x
- Section "The Evolution of State Management" is a SwiftUI history lesson that adds nothing
- Section "Looking Ahead" — generic predictions about SwiftUI's future
- Multiple paragraphs restating "agents need consistent patterns" in different ways
- "robust" — 3x

### Unique Insights
- The 73% → 94% @Observable adoption rate after CLAUDE.md directive
- The "view model explosion" anti-pattern (47 ViewModels for 23 screens)
- Navigation state machines as the solution to deep linking complexity
- The concept of "agent-friendly" vs "agent-hostile" API patterns in SwiftUI
- Specific CLAUDE.md directives for SwiftUI state management

### Code Worth Keeping
- The `@Observable` class pattern with `@ObservationIgnored` for non-UI state
- The navigation state enum with associated values: `enum Route: Hashable { case serverDetail(Server), settings, addServer }`
- The `ViewStore` pattern combining Action enum + State struct + reduce function
- The CLAUDE.md directive block: "Always use @Observable (iOS 17+). Never use @StateObject or @ObservedObject for new code."

### Mermaid Diagrams Worth Keeping
- "Unidirectional Data Flow" — Action → Reducer → State → View → Action cycle
- "Navigation State Machine" — enum-based routing with transition rules

---

## Post 33: Building an SSH Terminal Inside an iOS App
**Word count:** 8,972
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- Opening: "How hard can it be? It is just an SSH connection and a text view." 669 tool calls later...
- The three-domain intersection problem: SSH transport layer + VT100 terminal protocol (1978 standard grown organically for 45 years) + iOS sandbox
- The NMSSH vs. SwiftSH vs. Shout vs. libssh2 direct binding library evaluation — agent tried 4 libraries, only libssh2 direct binding worked
- VT100 escape code parsing war story: "The agent wrote a regex parser. It handled 60% of escape sequences. Then it hit CSI sequences with parameters and the regex became unmaintainable."
- The state machine approach to terminal emulation — 14 states for VT100 parsing
- iOS sandbox restrictions: no persistent background connections, no raw socket access, BGTaskScheduler limitations
- The "TerminalView" performance optimization — switching from String concatenation to attributed string buffer, 3x rendering speed improvement
- The 669 tool calls breakdown: 234 bash (xcodebuild), 187 Read, 112 Edit, 89 Write, 47 Grep
- Key insight: "AI agents excel at protocol implementation — the VT100 spec is well-documented and deterministic. They struggle with the environmental constraints — sandbox rules, background execution limits, physical device behaviors."

### Cut (LLM filler)
- "Let's examine" — 4x
- "powerful" — 3x
- "robust" — 5x
- "elegant" — 3x
- "seamless" — 3x
- "It's worth noting" — 2x
- "The beauty of" — 1x
- Section "The History of Terminal Emulation" — academic padding, unnecessary
- Section "Future Directions" — generic (add mosh support, etc.)
- "This is where things get interesting" — 2x
- Multiple paragraphs explaining what SSH is (the audience already knows)
- Long section explaining VT100 history that isn't necessary for the patterns

### Unique Insights
- The 4-library evaluation failure chain (NMSSH → SwiftSH → Shout → libssh2 direct)
- State machine with 14 states for VT100 parsing
- iOS sandbox workarounds for persistent SSH connections (URLSessionStreamTask + Network.framework NWConnection)
- The attributed string buffer optimization for terminal rendering at 60fps
- The 669 tool calls breakdown per tool type

### Code Worth Keeping
- The VT100 parser state machine enum: `enum ParserState { case ground, escape, csiEntry, csiParam, csiIntermediate, oscString... }`
- The `SSHConnection` class using Network.framework NWConnection instead of raw sockets
- The terminal buffer ring buffer implementation for scroll-back
- The background connection keepalive using URLSessionStreamTask

### Mermaid Diagrams Worth Keeping
- "VT100 Parser State Machine" — the 14-state diagram showing transitions on escape sequences
- "SSH Connection Lifecycle on iOS" — connect → authenticate → channel → keepalive → background → reconnect

---

## Post 34: iCloud Sync with AI Agents
**Word count:** 7,934
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- The escalating session narrative is excellent: Session 1 (add container, "success"), Session 2 (missing entitlement), Session 7 (data duplicating), Session 14 (sync takes 3 min), Session 23 (edits overwrite each other), Session 38 (last-writer-wins losing data), Session 55 ("it works. I think.")
- "55+ retry sessions, 1,062 tool calls" — real metric
- The fundamental problem: "AI agents think in request-response. iCloud sync thinks in eventual consistency. These two mental models are fundamentally incompatible."
- The "silent failure" problem: CloudKit operations return success even when sync hasn't propagated. Agent declares victory, user finds data missing on second device.
- Conflict resolution evolution: last-writer-wins → field-level merge → custom merge policies with conflict UI
- The `NSPersistentCloudKitContainer` debugging nightmare: "The container logs errors to the console but does not throw them. The agent has to parse console output to detect sync failures."
- The "entitlement hell" sequence: agent adds CloudKit capability, forgets to add iCloud container identifier, then adds wrong container name, then discovers push notification entitlement is also required for silent push sync
- The two-device testing problem: agent can only test on simulator, but CloudKit sync between two simulators doesn't work the same as device-to-device
- Key insight: "Every iCloud sync implementation requires at minimum 5 distinct sessions: setup, entitlements, conflict resolution, performance tuning, and edge case handling. No agent can do it in one pass."

### Cut (LLM filler)
- "Let's dive into" — 3x
- "powerful" — 2x
- "robust" — 4x
- "seamless" — 4x (ironic for a sync article)
- "elegant" — 1x
- "It's worth noting" — 3x
- "The beauty of" — 1x
- "Before we begin" — 1x
- Section "The Promise of CloudKit" — marketing-level description of what CloudKit is
- Section "Looking Forward" — generic predictions
- Multiple paragraphs explaining what eventual consistency means (audience knows)
- "This is where X comes in" — 3x

### Unique Insights
- The 55-session evolution from "add sync" to "sync actually works"
- The silent failure mode: CloudKit returns success before sync propagates
- The entitlement dependency chain (CloudKit + container ID + push notification)
- The two-device testing gap (simulator-to-simulator vs device-to-device)
- The minimum 5-session estimate for any iCloud sync implementation
- Console-log parsing as the only way to detect sync errors from NSPersistentCloudKitContainer

### Code Worth Keeping
- The `CloudKitSyncMonitor` class that parses console logs for sync status
- The field-level merge conflict resolver with `NSMergePolicy` custom subclass
- The `SyncHealthDashboard` view that shows per-entity sync status
- The deduplication logic using `NSManagedObjectContextDidSave` notification

### Mermaid Diagrams Worth Keeping
- "iCloud Sync Session Evolution" — timeline showing the 55-session progression from naive to production-ready
- "Conflict Resolution Decision Tree" — last-writer-wins vs field-level merge vs custom merge policy

---

## Post 35: Hat-Based Event-Driven Orchestration
**Word count:** 7,623
**Target consolidated post:** NEW 8 — Ralph Loops

### Keep (best material)
- Opening war story: agent tries to plan, implement, test, and review in one session. By review phase, context window is 80% full. "It reviewed the code against criteria it had invented in the moment, not the criteria from its own plan."
- Core metric: "hat-based sessions achieved 94% task completion with a 2% contradiction rate, compared to 67% completion and 34% contradictions for monolithic sessions"
- The "one hat, one event, then stop" principle — each agent iteration wears exactly one hat
- The hat taxonomy: Planner (emits task-list), Builder (emits build-result), Reviewer (emits review-verdict), Fixer (emits fix-applied), Deployer (emits deploy-status)
- Context decay explanation: "By minute 40, the agent is operating on vibes, not on its plan"
- The event bus architecture: events are JSON files written to `.ralph/events/`. Each hat reads only the events relevant to its role.
- The "hat transition" rule: a hat never transitions to another hat. It emits an event and terminates. The orchestrator reads the event and spawns the next hat.
- The state isolation benefit: "Each hat starts with a fresh context window. No accumulated confusion. No forgotten constraints."
- Real failure mode: "The builder hat finished implementing. Instead of emitting build-result and stopping, it started reviewing its own code. Its self-review passed. The reviewer hat later found 6 issues."

### Cut (LLM filler)
- "Let's examine" — 3x
- "powerful" — 3x
- "robust" — 2x
- "elegant" — 2x
- "seamless" — 1x
- "It's worth noting" — 2x
- "The beauty of this approach" — 2x
- Section "The Philosophy of Constraint" — abstract musing on doing less
- Section "Beyond Software Development" — applying hats to non-coding tasks (padding)
- "This is where X comes in" — 2x
- Several paragraphs that restate "smaller context = better output" repeatedly

### Unique Insights
- The 94% vs 67% completion rate comparing hat-based vs monolithic sessions
- The 2% vs 34% contradiction rate — this is the key metric
- The event bus as JSON files in `.ralph/events/`
- The anti-pattern: builder reviewing its own code (self-review always passes)
- The "one hat, one event, then stop" design principle
- 505 topic signals across 696MB of Ralph logs

### Code Worth Keeping
- The `Hat` trait definition in Rust: `trait Hat { fn execute(&self, context: &EventContext) -> Event; }`
- The event emission JSON structure: `{ "hat": "builder", "event": "build-result", "status": "success", "artifacts": [...] }`
- The orchestrator loop that reads events and dispatches next hat
- The hat registry configuration YAML

### Mermaid Diagrams Worth Keeping
- "Hat Transition Flow" — Planner → (task-list event) → Builder → (build-result event) → Reviewer → (review-verdict event) → Fixer/Deployer
- "Event Bus Architecture" — shows `.ralph/events/` directory with event files, orchestrator reading them, dispatching hats

---

## Post 36: Building the Ralph CLI: Task Management + Events
**Word count:** 7,718
**Target consolidated post:** NEW 8 — Ralph Loops

### Keep (best material)
- Opening: "The Ralph orchestrator started as shell scripts. `task-add.sh` appended a line to a text file. `task-close.sh` moved a line from 'active' to 'done.' `task-list.sh` was literally `cat tasks.txt`. It worked for three tasks. It fell apart at thirty."
- The corruption incident: "Two agents tried to close the same task simultaneously. The text file corrupted — half a line from task 17 merged with the header of task 18. Three tasks disappeared entirely."
- Why Rust: "I needed two things that shell scripts could not provide: atomic file operations and structured event emission. Rust gave me both, plus a binary that starts in 3 milliseconds."
- The task lifecycle: `pending → ready → active → done` with the `ready` state being the key insight — tasks marked ready are eligible for the next agent to pick up
- The event emission system: every task state transition emits a JSON event to `.ralph/events/`
- The file-locking implementation for concurrent agent access — `flock()` on the task file
- The dependency tracking: tasks can declare dependencies, `ralph task ready` only marks a task ready if all dependencies are done
- The `ralph signal` command — emits arbitrary events that the orchestrator can react to
- Performance: "3ms startup time means agents can call ralph 200+ times per session without overhead"

### Cut (LLM filler)
- "Let's dive into" — 2x
- "powerful" — 4x
- "robust" — 3x
- "elegant" — 2x
- "seamless" — 1x
- "It's worth noting" — 3x
- "The beauty of" — 2x
- Section "Why Rust?" — partially redundant, though the 3ms startup metric is worth keeping
- Section "The Future of Agent Tooling" — generic predictions
- "This is where X comes in" — 2x
- Multiple paragraphs explaining what CLI tools are (unnecessary for audience)
- "Before we begin" — 1x

### Unique Insights
- The shell-script-to-Rust evolution driven by concurrent agent corruption
- The `ready` state in the task lifecycle — the key addition beyond typical todo lists
- `ralph signal` for arbitrary event emission
- File locking with `flock()` for concurrent agent access
- 3ms startup time metric
- The dependency graph between tasks preventing premature execution

### Code Worth Keeping
- The `ralph task add "description" --depends-on task-003` CLI syntax
- The task state machine enum: `enum TaskState { Pending, Ready, Active, Done, Failed }`
- The event JSON structure emitted on state transitions
- The `flock()` file locking pattern for concurrent writes
- The `ralph task list --ready` filter for agents to find eligible work

### Mermaid Diagrams Worth Keeping
- "Task Lifecycle State Machine" — Pending → Ready → Active → Done/Failed with dependency gates
- "Event Emission Pipeline" — task state change → event JSON → .ralph/events/ → orchestrator pickup

---

## Post 37: Named Worktrees for Parallel Agent Development
**Word count:** 6,318
**Target consolidated post:** NEW 6 — Parallel Worktrees

### Keep (best material)
- Opening git log showing 5 branches with poetic names: fresh-cedar, eager-egret, quiet-brook, calm-falcon, bright-maple — all diverging from main
- "Five branches. Five agents. Five features being developed simultaneously in five isolated directories on the same machine. No merge conflicts. No file locking. No coordination overhead."
- The naming system rationale: "When you are managing ten parallel agent sessions, `worktree-7` is meaningless. `eager-egret` is a story."
- Word list design: adjective-noun pairs, curated for memorability, pronounceability, and grep-friendliness. No ambiguous words, no homophones.
- The `worktree-factory.sh` script that creates named worktree + branch + CLAUDE.md in one command
- Agent isolation guarantee: "Each worktree has its own working directory, its own index, and its own HEAD"
- The merge strategy: worktrees merge to main one at a time in dependency order, not all at once
- The cleanup pattern: after merge, `git worktree remove` + `git branch -d` in one command
- Practical limit: "Beyond 8 worktrees on a single machine, disk I/O becomes the bottleneck. node_modules duplication is the killer — 8 copies of node_modules eats 12GB."
- The symlink optimization: shared node_modules via symlinks for read-heavy dependencies

### Cut (LLM filler)
- "Let's examine" — 2x
- "powerful" — 3x
- "robust" — 2x
- "elegant" — 2x
- "seamless" — 2x
- "It's worth noting" — 2x
- "The beauty of" — 1x
- Section "Understanding Git Worktrees" — basic git worktree tutorial (audience knows this)
- Section "The Future of Parallel Development" — generic
- "This is where X comes in" — 1x
- Several paragraphs explaining what git worktrees are at a basic level

### Unique Insights
- The poetic naming system (adjective-noun pairs) for human-memorable worktree names
- The 8-worktree practical limit due to disk I/O (12GB for 8x node_modules)
- The symlink optimization for shared dependencies
- Dependency-ordered merge strategy (not all-at-once)
- The one-command factory: worktree + branch + CLAUDE.md

### Code Worth Keeping
- The `worktree-factory.sh` script with name generation
- The word list arrays: `ADJECTIVES=(fresh eager quiet calm bright noble still swift warm keen)` and `NOUNS=(cedar egret brook falcon maple creek shore lark grove ridge)`
- The cleanup script: `git worktree remove .worktrees/$name && git branch -d $name`
- The symlink setup for shared node_modules

### Mermaid Diagrams Worth Keeping
- "Worktree Isolation Model" — shows 5 parallel worktrees each with own HEAD, index, working directory, all sharing .git
- "Merge Order Pipeline" — dependency-ordered merge sequence

---

## Post 38: The Auto-Claude Task Factory
**Word count:** 8,220
**Target consolidated post:** NEW 6 — Parallel Worktrees

### Keep (best material)
- Opening status board: 12 worktrees, 12 Claude agents, all running simultaneously. Status board showing 8 active, 3 completed, 1 queued with named worktrees and commit counts.
- "The `.auto-claude/` directory had spawned them all from a single command."
- The task queue architecture: YAML task definitions with file ownership declarations, dependency graphs, priority ordering
- The file ownership system: "Each task declares which files it owns. The factory validates ownership before spawning — no two agents can own the same file."
- The spawn lifecycle: parse task YAML → create worktree → inject CLAUDE.md with task context → spawn `claude --dangerously-skip-permissions` → monitor progress → collect results
- The monitoring dashboard: polls worktree git logs every 30 seconds, shows commit velocity per agent
- Failure recovery: "If an agent fails, its worktree is preserved. A new agent spawns with the same task and the partially-completed worktree."
- The merge orchestrator: completes tasks merge in dependency order, runs build verification after each merge
- Metric: "12 features that would have taken 3 days sequentially were completed in 4 hours with the task factory"
- The cost tracking: "12 parallel agents for 4 hours cost approximately $47 in API calls. The alternative was 3 days of my time."
- The `--dangerously-skip-permissions` flag rationale and risk mitigation

### Cut (LLM filler)
- "Let's dive into" — 3x
- "powerful" — 5x
- "robust" — 3x
- "elegant" — 2x
- "seamless" — 3x
- "It's worth noting" — 3x
- "The beauty of" — 2x
- "Before we begin" — 1x
- Section "The Philosophy of Parallel Work" — abstract padding
- Section "Future Possibilities" — generic predictions about AI agent factories
- "This is where X comes in" — 3x
- Several paragraphs that explain task queues conceptually (audience knows)
- Long section on "why parallelism matters" that is obvious

### Unique Insights
- The file ownership validation system preventing concurrent edits
- The task YAML format with `owns:` field for file glob patterns
- The spawn lifecycle with CLAUDE.md injection per task
- The 3 days → 4 hours speedup metric
- The $47 cost for 12 parallel agents over 4 hours
- Failure recovery with preserved worktrees
- The `--dangerously-skip-permissions` approach with risk mitigation
- The monitoring dashboard polling git logs every 30s

### Code Worth Keeping
- The task YAML format: `{ id: task-004, name: push-notifications, owns: ["Sources/Push/**", "Sources/NotificationService/**"], depends_on: [task-001] }`
- The spawn command: `claude --dangerously-skip-permissions -p "$(cat .auto-claude/tasks/task-004.md)" --worktree .worktrees/calm-falcon`
- The ownership validator script that checks for glob overlaps
- The merge orchestrator that topologically sorts tasks by dependencies

### Mermaid Diagrams Worth Keeping
- "Task Factory Architecture" — YAML tasks → ownership validator → worktree factory → agent spawner → monitor → merge orchestrator
- "Dependency Graph" — showing task-001 through task-012 with dependency edges and parallel execution lanes

---

## Post 39: iOS Performance Optimization with AI Agents
**Word count:** 7,502
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- Opening: "847MB peak memory, 23% CPU at idle, and a scrolling hitch every time the user opened their media library"
- "705 tool calls over a single session — profiling, diagnosing, and fixing performance issues I had been avoiding for weeks"
- The diagnostic methodology: symptom → trace → cause → fix → measure. "No guessing. No 'let me try this and see.' Pure diagnostic methodology."
- Five major fixes with before/after measurements:
  1. Full-resolution images in thumbnail grid → downsample to display size. Memory: 847MB → 312MB
  2. Synchronous image loading on main thread → async loading with placeholder. Scroll frame rate: 34fps → 58fps
  3. Retained view controllers in navigation stack → weak references. Idle memory: 234MB → 89MB
  4. String concatenation in a loop for log output → StringBuilder pattern. Log generation: 1.2s → 0.08s
  5. Timer-based polling for server status → Combine publisher with debounce. CPU at idle: 23% → 3%
- The Instruments profiling via CLI: agent runs `xctrace record` then parses the output
- The "40% memory reduction" headline metric
- Key insight: "The agent treated performance optimization as a pipeline, not a task. Each fix was a stage. Each stage had a measurement before and after."
- The agent's systematic approach: profile first, never guess, always measure impact

### Cut (LLM filler)
- "Let's dive into" — 3x
- "powerful" — 3x
- "robust" — 4x
- "elegant" — 2x
- "seamless" — 1x
- "It's worth noting" — 3x
- "The beauty of" — 2x
- Section "Understanding iOS Performance" — basic iOS perf tutorial
- Section "The Future of AI-Driven Optimization" — generic predictions
- "This is where X comes in" — 2x
- Multiple paragraphs explaining what Instruments is
- "Before we begin" — 1x
- Long explanation of why performance matters (obvious)

### Unique Insights
- The 5 specific fixes with before/after metrics (this is gold — concrete, measurable)
- The CLI-based Instruments profiling approach via `xctrace record`
- The pipeline methodology: symptom → trace → cause → fix → measure
- 847MB → 312MB memory reduction from image downsampling alone
- 23% → 3% CPU at idle from replacing polling with Combine publishers
- The agent treating performance as a pipeline of stages, not a single task

### Code Worth Keeping
- The image downsampling extension: `UIImage.downsampled(to size: CGSize, scale: CGFloat)`
- The async image loading with `actor ImageCache` and placeholder pattern
- The Combine-based server status publisher replacing Timer polling
- The `xctrace record --template "Time Profiler" --attach PID` command

### Mermaid Diagrams Worth Keeping
- "Performance Optimization Pipeline" — Profile → Diagnose → Fix → Measure → Next Symptom
- "Memory Reduction Waterfall" — showing each fix's contribution to the 847→312MB reduction

---

## Post 40: Keychain Credential Storage Patterns
**Word count:** 6,644
**Target consolidated post:** NEW 5 — iOS Patterns

### Keep (best material)
- Opening: "The agent wrote a perfectly correct Keychain wrapper on its first try. It compiled, it ran, and it stored credentials securely. Then I tested it on a real device and every single query returned `errSecItemNotFound`."
- The simulator-vs-device gap: "The simulator had been silently ignoring access group entitlements that a physical device enforces."
- Core insight: "AI agents are excellent at generating syntactically correct code from documentation. They are poor at anticipating runtime behaviors that only surface in specific environments."
- The four dimensions of Keychain behavioral differences: simulator vs device, with vs without entitlements, locked vs unlocked device, biometric vs passcode protection
- The kSecAttrAccessGroup confusion: agent sets the group name to the bundle identifier instead of the full app group prefix (TEAMID.com.app.group)
- The token refresh race condition: two background threads both detect expired token, both try to refresh, one succeeds and stores new token, other stores a different new token, overwriting the first
- The biometric prompt problem: `kSecAttrAccessControl` with `.biometryCurrentSet` causes prompts at unexpected times, and the simulator never shows biometric prompts
- The "Keychain is not UserDefaults" lesson: agents treat Keychain like a key-value store, but queries are attribute-based and can return multiple results
- Metric: "14 distinct Keychain-related bugs across our sessions, 11 of which only manifested on physical devices"
- The access control progression: no protection → kSecAttrAccessibleWhenUnlocked → kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly → biometric + passcode fallback

### Cut (LLM filler)
- "Let's examine" — 3x
- "powerful" — 2x
- "robust" — 4x
- "elegant" — 1x
- "seamless" — 2x
- "It's worth noting" — 3x
- "The beauty of" — 1x
- Section "Understanding Keychain Services" — Apple documentation rehash
- Section "The Evolution of iOS Security" — historical padding
- Section "Looking Ahead" — generic predictions
- "This is where X comes in" — 2x
- "Before we begin" — 1x
- Several paragraphs explaining what Keychain is at a basic level

### Unique Insights
- 14 Keychain bugs found, 11 only on physical devices (79% device-only failure rate)
- The token refresh race condition between background threads
- kSecAttrAccessGroup requiring TEAMID prefix (not just bundle ID)
- The "Keychain is not UserDefaults" conceptual gap for AI agents
- Biometric prompt timing issues invisible in simulator
- The access control progression from none to biometric+passcode

### Code Worth Keeping
- The `KeychainManager` class with proper error handling and OSStatus → human-readable error mapping
- The token refresh lock using `NSLock` to prevent race conditions
- The access control configuration: `SecAccessControlCreateWithFlags(nil, kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly, [.biometryCurrentSet, .or, .devicePasscode], &error)`
- The query builder that handles the attribute-based Keychain query model properly

### Mermaid Diagrams Worth Keeping
- "Keychain Access Control Progression" — shows escalating security levels from none to biometric
- "Token Refresh Race Condition" — two threads competing to refresh and store tokens

---

# Cross-Post Analysis

## Consolidation Notes by Target

### NEW 5 — iOS Patterns (Posts 32, 33, 34, 39, 40)
- **Total source words:** 37,193 (needs to compress to ~3,500-4,000)
- **Strongest material:** Post 32's @Observable migration stats, Post 34's 55-session iCloud saga, Post 39's 5 fixes with before/after metrics, Post 40's simulator-vs-device gap
- **Overlap to eliminate:** All 5 posts have sections explaining basic iOS concepts to the audience. All 5 have "looking ahead" sections that are pure filler.
- **Recommended structure:** Use Post 34's escalating-session narrative as the framing device. Cherry-pick the best specific patterns from each: @Observable (32), VT100 state machine (33), iCloud sync evolution (34), performance pipeline (39), Keychain simulator gap (40).
- **Key dedup:** Posts 33 and 40 both cover the simulator-vs-device testing gap — merge into one treatment.

### NEW 8 — Ralph Loops (Posts 35, 36)
- **Total source words:** 15,341 (needs to compress to ~3,500-4,000)
- **Strongest material:** Post 35's 94% vs 67% completion rate metric, the "one hat, one event, then stop" principle, Post 36's shell-script corruption story, the `ready` task state concept
- **Overlap to eliminate:** Both posts explain event-driven architecture from scratch. Both have lengthy philosophy sections.
- **Recommended structure:** Combine Post 35's hat concept with Post 36's CLI implementation into one narrative: the problem (context decay) → the principle (one hat) → the tool (Ralph CLI) → the results (94% completion).

### NEW 6 — Parallel Worktrees (Posts 37, 38)
- **Total source words:** 14,538 (needs to compress to ~3,500-4,000)
- **Strongest material:** Post 37's poetic naming system, the 8-worktree practical limit, Post 38's $47/4-hours metric, the file ownership validation system
- **Overlap to eliminate:** Both explain git worktrees from scratch. Both have abstract parallelism philosophy sections.
- **Recommended structure:** Start with Post 38's "12 agents, one command" opening, explain the worktree isolation (37), the naming system (37), the ownership system (38), the merge strategy (37+38), the economics (38).

### NEW 13 — Debugging (Post 31)
- **Total source words:** 6,325 (already close to target size)
- **Strongest material:** The 34-minute debugging story, the 23% metric, the cache taxonomy, the PostToolUse hook
- **Recommended approach:** Trim the filler sections, keep the war story and the concrete cache taxonomy.

## LLM Filler Pattern Counts (across all 10 posts)

| Pattern | Count |
|---------|-------|
| "powerful" | 29 |
| "robust" | 29 |
| "elegant" | 17 |
| "seamless" | 16 |
| "It's worth noting" | 26 |
| "Let's dive into" / "Let's examine" | 27 |
| "The beauty of" | 15 |
| "Before we begin" | 7 |
| "This is where X comes in" | 20 |
| Generic "Future/Looking Ahead" sections | 10 (one per post) |
| Basic concept explanations (audience already knows) | 10+ sections |
