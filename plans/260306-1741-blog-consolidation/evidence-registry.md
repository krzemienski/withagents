# Evidence Registry: 18-Post Blog Consolidation

Synthesized from 7 miner reports. Each post lists verified evidence with source references.

---

## Post 1: "4,500 Sessions: What Actually Works"
**Source:** Miner R1 (numbers-and-consensus)

### Verified Metrics
| Metric | Value | Source |
|--------|-------|--------|
| Total JSONL files | 5,248 | deep-mine-full-report-v2 |
| Meaningful sessions (>1KB) | 4,510 | deep-mine-full-report-v2 |
| Human-initiated sessions | 1,817 | deep-mine-full-report-v2 |
| Total projects | 20 (aggregated from 40 raw dirs) | deep-mine-full-report-v2 |
| Total lines across all sessions | 1,762,452 | deep-mine-full-report-v2 |
| Date range | Feb 4 – Mar 6, 2026 (31 days) | deep-mine-full-report-v2 |
| Agent-related operations | 7,844 | R1 report |

### Tool Leaderboard (for "what the sessions actually did")
| Tool | Count |
|------|-------|
| Bash | 35,216 |
| Read | 26,303 |
| Edit | 8,118 |
| Grep | 5,392 |
| Write | 3,148 |
| TaskUpdate | 2,871 |
| Task (Agent) | 2,825 |
| Glob | 2,576 |
| SendMessage | 1,038 |

### Project Distribution
| Project | Sessions | % |
|---------|----------|---|
| awesome-list-site | ~1,200+ | 26% |
| ils-ios | 785 | 17% |
| ralph-orchestrator | 500+ | 11% |
| sessionforge | 400+ | 9% |
| blog-series | 350+ | 8% |
| Other (15 projects) | ~1,275 | 28% |

### Five Failure Modes (evidence)
- **Amnesia:** Same SwiftUI retain cycle introduced 3x across 3 weeks (post narrative)
- **Confidence:** Empty onClick handler passed all automated checks (post narrative)
- **Completion Theater:** Delete Account button with empty function body (post narrative)
- **Staffing:** All-Opus ($8.40/26 invocations) vs Routed ($1.52) — 82% savings (post narrative)
- **Coordination:** JWT verification internals served as REST endpoint (post narrative)

---

## Post 2: "Why One Reviewer Is Never Enough"
**Source:** Miner R1 (numbers-and-consensus)

### Consensus Gate Evidence
- **75-TaskCreate iOS audit session:** Session `33771457` — Lead/Alpha/Bravo agents on separate simulators with 10-gate consensus validation
- **Real gate voting output:** Lead/Alpha/Bravo give unanimous PASS/FAIL verdicts per gate
- **3-validator teams:** Each validator independently examines evidence, votes PASS or FAIL
- **Total agent operations:** 7,844 across all sessions (Task: 2,825, TaskUpdate: 2,871, SendMessage: 1,038, TeamCreate: 247)

### War Story: The Triple-Verification Build Team
- Session with 13 TeamCreate operations — a full design consensus workflow
- Each team member independently reviewed, then consensus was required before proceeding
- Real voting output shows structured gate format with criteria-by-criteria assessment

### Cost Data
- Cost per consensus gate: $0.15 (from post 1 narrative, validated by model routing math)
- 3-agent review catches bugs single-agent misses (the `+=` vs `=` one-character bug story)

---

## Post 3: "What Replaces Unit Tests When AI Writes the Code"
**Source:** Miner R5 (validation-and-debugging)

### iOS Validation Tool Counts
| Tool | Total Calls |
|------|-------------|
| idb_describe | 16,367 |
| idb_tap | 15,320 |
| simulator_screenshot | 8,483 |
| simulator_boot | 1,247 |
| simulator_launch_app | 892 |

### Web Validation Tool Counts
| Tool | Total Calls |
|------|-------------|
| browser_click | 4,522 |
| browser_snapshot | 3,891 |
| browser_navigate | 3,423 |
| browser_take_screenshot | 2,962 |
| browser_type | 1,847 |
| browser_fill_form | 1,234 |

### block-test-files Hook
- **642 total firings** across all sessions
- Blocks creation of any file matching test/mock/stub patterns
- Listed in hook table: `block-test-files.js | PreToolUse Write/Edit | BLOCKS creation of test/mock/stub files`

### War Story: 140-Step Browser Validation Sequence
- Session `f6213b2f` (SessionForge): 674 total Playwright tool calls
- Full click-by-click validation of every UI element
- Pattern: navigate → snapshot → click → verify → screenshot → next element

### War Story: 2,290 idb_describe in Single Session
- Session `c446ea21` (ils-ios): 2,290 accessibility tree queries in one session
- Agent methodically verified every UI element on every screen

### Validation Gate Table Evidence
- 16/16 PASS criteria with specific evidence citations
- Each criterion maps to a screenshot, log output, or API response
- Format: `| Criterion | Evidence | Result |`

---

## Post 4: "Building a Native iOS Client"
**Source:** Miner R2 (ios-development)

### Corpus Stats
- 785 iOS main sessions + 334 worktree sessions
- 320 sessions mention SSE/streaming (41%)
- 29,908 total xcodebuild invocations
- Build success rate: ~65% (1,078 success / 577 fail)

### 5-Layer SSE Bridge Architecture (session 33771457)
| Layer | File | Lines | Role |
|-------|------|-------|------|
| 1. Backend | ChatController.swift | ~300 | Vapor routes, ClaudeExecutorService actor |
| 2. SSE Transport | SSEClient.swift | 280 | 60s timeout, 45s heartbeat, 3 reconnects |
| 3. Message Parsing | StreamMessage.swift | ~200 | 7-case enum, snake→camelCase conversion |
| 4. ViewModel | ChatViewModel.swift | 498 | 75ms batched updates, all 7 event types |
| 5. SwiftUI | ChatView | - | @State viewModel, status banner, ProgressView |

### StreamMessage 7 Cases
`system`, `assistant`, `user`, `result`, `streamEvent`, `permission`, `error`
Content block sub-types: `.text(block)`, `.thinking(block)`, `.textDelta(text)`, `.thinkingDelta(thinking)`, `.toolResult(block)`

### snake_case → camelCase Conversion
`session_id` → `sessionId`, `tool_use` → `toolUse`, `total_cost_usd` → `totalCostUSD`

### War Story: Bidirectional @Published Infinite Recursion
- Session `33771457` (28 references to `infinite recursion`)
- Error: `Thread stack size exceeded due to excessive recursion`
- Root cause: `AppState.showOnboarding` setter triggers Combine subscription → sets `ConnectionManager.showOnboarding` → triggers another subscription → infinite loop
- Fix: `removeDuplicates()` + `dropFirst()` guards on Combine subscriptions
- Lesson: `@Published` emits on `willSet` before storage updates — property-read guards unreliable

### War Story: Actor Deadlock in SystemMetricsService
- Session `62115115` (46 deadlock references)
- Root cause: `waitUntilExit()` before `readDataToEndOfFile()` — pipe buffer overflow (>64KB) blocks process while actor is blocked waiting
- Cascading: blocks ALL subsequent actor calls
- Fix: Read stdout data BEFORE calling `waitUntilExit()`

### Two-Tier Timeout System
- 30s initial timeout: detects stuck CLI (no stdout data)
- 5min total timeout: kills long-running processes

### Real Build Errors
- @Observable vs ObservableObject migration mismatch (4 occurrences)
- @Observable conformance cascade (10 occurrences)
- `no exact matches in call to initializer` (18 occurrences in single session)

### Simulator Validation
- Dedicated simulator: UDID `50523130-57AA-48B0-ABD0-4D59CE455F14` (iPhone 16 Pro Max, iOS 18.6)
- 32,744 total idb/simulator tool calls across iOS sessions

---

## Post 5: "iOS Patterns at Scale"
**Source:** Miner R2 (ios-development)

### SwiftUI State Pattern Census
| Pattern | Occurrences |
|---------|-------------|
| @State | 6,254 |
| @MainActor | 207 |
| @Observable | 120 |
| @Environment( | 112 |
| @Published | 67 |
| ObservableObject | 56 |
| @StateObject | 21 |
| @EnvironmentObject | 16 |

### Combine Bridge Complexity
| Pattern | Count |
|---------|-------|
| Combine | 360 |
| removeDuplicates | 36 |
| sink { | 35 |
| weak self | 33 |
| objectWillChange | 33 |
| AnyCancellable | 13 |

### Runtime Issue Distribution
| Issue | Mentions |
|-------|----------|
| Memory leak | 1,323 |
| Retain cycle | 1,262 |
| Deadlock | 153 |
| Race condition | 57 |
| Infinite recursion | 37 |

### iCloud Sync (57 worktree sessions)
- NSUbiquitousKeyValueStore (11 refs), CKContainer (12 refs)
- CloudKitService.swift (16 refs)
- Conflict resolution: merge logic based on modification dates (8 refs)

### Keychain (10 worktree sessions)
- kSecAttrAccessibleWhenUnlockedThisDeviceOnly, kSecClassGenericPassword
- Biometric access: kSecAttrAccessControl with biometryCurrentSet

### Performance Optimization (40 worktree sessions)
- Target: app memory under 100MB (23 refs)
- CacheService (77 refs) with LRU eviction
- Memory monitoring: mach_task_basic_info API, 80MB warning threshold, 60s cooldown
- LazyVStack for large message lists (200+ messages)

### SSH Service (43 worktree sessions)
- SSHService.swift (73 refs), Citadel library (18 refs)
- SSHTunnelRelayHandler for port forwarding (30 refs)

### 10 Hard-Won NEVER Rules (from session 5713bfed)
1. NEVER use `Task.detached` — loses actor context
2. NEVER replace `try?` with `try!` — use do/catch
3. NEVER fix ILSShared files without building BOTH iOS and macOS
4. NEVER batch more than 5 fixes before building
5. NEVER trust audit report blindly — always READ the file
6. NEVER fix @State/@Binding by changing default value
7. NEVER add `as! Type` to fix a type error
8. NEVER change sync to async without updating ALL callers
9. NEVER follow compiler's `nonisolated` suggestion on @Observable @MainActor classes
10. NEVER claim PASS without reading every screenshot

### Worktree Task Distribution
| Worktree | Sessions | Topic |
|----------|----------|-------|
| tasks-001-native-macos-app | 65 | macOS native app |
| tasks-007-icloud-sync | 57 | iCloud sync |
| tasks-010-multi-agent-team | 46 | Multi-agent teams |
| tasks-002-custom-themes | 44 | Custom themes |
| tasks-011-ssh-service | 43 | SSH service |
| tasks-012-performance | 40 | Performance |

### War Story: nonisolated Compiler Suggestion Trap
- Compiler suggests `nonisolated` on mutable stored properties in @Observable classes
- `@ObservationTracked` macro generates mutable backing `_property` that inherits attribute
- Using plain `nonisolated` breaks build; must use `nonisolated(unsafe)`

---

## Post 6: "194 Agents in Isolated Branches"
**Source:** Miner R3 (worktrees-and-merging)

### Worktree Census
| Project | Worktrees | Naming Convention |
|---------|-----------|-------------------|
| awesome-list-site | 194 | adjective-noun (e.g., bright-maple) |
| ralph-orchestrator | 118 | adjective-noun |
| ils-ios | 35 | adjective-noun |
| blog-series | 16 | adjective-noun |
| **Total** | **363** | |

### Peak Parallelism
- 35 simultaneous worktrees active at once (awesome-list-site)
- 21+ active worktrees in a single session (session `0ea2a1c3`)

### War Story: 9 PRs in Single Session
- Session `0ea2a1c3`: Created and merged PRs #8–#16
- Full 9-script automation suite: sequential foundation merge with CI gates
- Worktree deletion rule: 0 commits ahead of main = abandoned, delete with --force

### War Story: `gh pr merge` Bug Discovery
- Discovered during mass merge operations
- "Ripple rebase" pattern: rebasing cascading branches after merge

### Per-File Conflict Resolution Strategy
- Each worktree owns specific files — no overlapping edits
- Merge conflicts resolved per-file with specific strategies documented

### 47-Task Spec for Worktree Management
- Session `0ea2a1c3`: Auto-Claude cleanup spec managing 20+ worktrees across phases
- Phases tracked by index, worktrees mapped to phases

---

## Post 7: "Seven Layers from System Prompt to Tool Output"
**Source:** Miner R4 (governance-and-ralph)

### CLAUDE.md as Living Constitution
- Read 5+ times across sessions, edited 2x to capture learnings
- 1,119 total CLAUDE.md lines across 8 sessions
- Used as living learning capture document: "Update CLAUDE.md - Capture the learnings"
- Edit evidence: Gap Analysis Findings updated from `INCOMPLETE` to `COMPLETED (Feb 4)`

### Hook Enforcement Layer
- **64,157 total hook events** across ralph-orchestrator sessions
- 12 unique hooks enforced
- 2,758 hook events in a single session (`43392534`)

### Hook Event Breakdown (session 43392534)
| Hook Event | Count |
|------------|-------|
| PreToolUse:Bash | 707 |
| PostToolUse:Bash | 630 |
| PostToolUse:Read | 345 |
| PreToolUse:Read | 280 |
| PostToolUse:Edit | 200 |
| PreToolUse:Edit | 100 |
| Stop:Stop | 30 |
| SessionStart:compact | 33 |
| SessionStart:startup | 12 |
| PreToolUse:Agent | 8 |

### Specific Hook Enforcement Counts
| Hook | Fires | Effect |
|------|-------|--------|
| completion-claim-validator.js | 105 | Catches build success without functional validation |
| validation-not-compilation.js | 105 | Reminds compilation != validation |
| plan-before-execute.js | 33 | Warns writing code without planning |
| block-test-files.js | 32 | BLOCKS test/mock/stub file creation |
| read-before-edit.js | 27 | Reminds to read full file before editing |

### Skill Invocations (41 unique skills)
| Skill | Count | Category |
|-------|-------|----------|
| oh-my-claudecode:cancel | 15 | Loop termination |
| ios-validation-runner | 8 | Functional validation |
| oh-my-claudecode:ultrapilot | 5 | Autonomous execution |
| start:specification-management | 4 | Spec governance |
| oh-my-claudecode:ralplan | 3 | Consensus planning |
| reflexion:reflect | 3 | Self-reflection |
| functional-validation | 2 | Validation mandate |

---

## Post 8: "How Ralph Coordinates 30 Agent Types"
**Source:** Miner R4 (governance-and-ralph)

### Hat Types Observed
| Hat | Evidence | Sessions |
|-----|----------|----------|
| Reproducer | `ACTIVE HAT: Reproducer Instructions` — analyze bugs | smart-deer, prime-badger, smooth-rose, lucky-reed |
| Fixer | `Fixer hat to implement the fix` | smart-deer, prime-badger, smooth-rose, clean-mint |
| Verifier | `verification.passed` event emitted after fix | smart-deer, prime-badger |
| Reviewer | 15 Reviewer hat mentions | clean-mint |
| Builder | `builder hat` — "ITERATION 2 (builder hat)" | a701b909 |
| Planner | `planner hat` mentions | 5fc90d3e, a701b909 |

### Real `ralph emit` Commands (15 extracted)
```bash
# smart-deer: Full Reproducer → Fixer → Verifier cycle
ralph emit "repro.complete" "root_cause: SSE endpoint returns 404 when session exists
    in active_sessions but watcher not yet registered (race condition)"
ralph emit "fix.complete" "SSE race condition fixed. stream_events() now polls up to 3s"
ralph emit "verification.passed" "SSE race condition fix verified"
ralph emit "LOOP_COMPLETE" "SSE bug fixed and verified"
```

### Event Routing Protocol
- `repro.complete` → Received by: Fixer
- `fix.complete` → Received by: Verifier
- `verification.passed` → Loop complete
- `verification.failed` → Back to Reproducer
- Events are "routing signals, not data transport"

### Ralph Loop Stop Hook
```
[RALPH LOOP - ITERATION 6/100] Work is NOT done. Continue working.
[RALPH LOOP - ITERATION 7/100] Work is NOT done. Continue working.
...continues through ITERATION 11/100
```
- 30 stop hook fires per session

### Iteration Counts Across 10 Named Worktrees
| Worktree | Max Iteration |
|----------|---------------|
| smart-deer | 14/100 |
| smooth-rose | 13/100 |
| bright-maple | 11/100 |
| sunny-lotus | 11/100 |
| neat-elm | 11/100 |
| prime-badger | 10/100 |
| lucky-reed | 10/100 |
| sleek-sparrow | 9/100 |
| quick-lark | 8/100 |
| clean-mint | 5/100 |
**Average: ~10.2 iterations per worktree session**

### Longest Ralph Session (smart-deer, 14 iterations)
```
ITERATION 6: Reproducer hat — understand bug, locate code
ITERATION 7-8: Reproducer — document repro steps, emit repro.complete
ITERATION 9-10: Fixer hat — implement fix, emit fix.complete
ITERATION 11-12: Verifier — verify fix, emit verification.passed
ITERATION 13-14: LOOP_COMPLETE — emit final event, cancel ralph
```

### Ralph State Management
- Scratchpad: `.ralph/agent/scratchpad.md`
- Tasks: `ralph tools task add/list/ready/close`
- Memories: `.ralph/agent/memories.md`
- Decisions: `.ralph/agent/decisions.md` (confidence 0-100)

### Ralplan Consensus Planning
```
[RALPLAN ACTIVATED - ITERATIVE PLANNING CONSENSUS MODE]
Iteration 0/5: Planner creates plan
→ Critic verdict: REJECT
Iteration 2/5: Architect consulted, Planner revises
→ Critic verdict: OKAY
RALPLAN Complete - Plan Approved
```
- 3-agent loop: Planner → Critic → Architect → Planner → Critic
- Max 5 iterations, this one converged in 2

### GSD Integration (12 commands)
```bash
node gsd-tools.cjs init execute-phase "9"
node gsd-tools.cjs init quick "fix all audit findings and run ios-validation-runner"
```

---

## Post 9: "From Session Logs to Published Content"
**Source:** Miner R6 (content-design-skills-plugins)

### SessionForge MCP Tool Usage
| Tool | Sessions | Total Calls |
|------|----------|-------------|
| create_insight | 35 | 417 |
| get_session_summary | 39 | 359 |
| get_session_messages | 37 | 342 |
| devlog (references) | 22 | 281 |
| mine_sessions | 9 | 55 |

### 8-Phase Content Pipeline Architecture
1. Mining (parallel miner agents per project cluster)
2. Writing (parallel, 3-5 posts per agent)
3. Expansion (multi-wave: 2-3 → 1-2 → single-post per agent)
4. Visuals (Stitch MCP, batch 5-10 hero images)
5. Site Update & Deploy
6. Functional Validation (per-platform build checks)
7. Site Deployment (sync → build → vercel)
8. GitHub Push (2s rate limit delay)

### Insight Scoring System (7+3 Dimensions)
Content Quality (7): Novel Problem-Solving (3x), Tool/Pattern Discovery (3x), Before/After Transformation (2x), Failure + Recovery (3x), Reproducibility (1x), Scale/Performance (1x), Visual Potential (2x)
Tool Potential (3): Reusability, Standalone Value, Implementation Clarity (each 1-10)
Selection threshold: composite > 50 AND tool potential > 7

### Production Pipeline Metrics
- 61 posts written and expanded
- 429,000+ words generated
- 183 social files (twitter + linkedin + newsletter x 61)
- 61/61 companion repos pass functional validation

### Key Lesson
Direct Agent spawning with `run_in_background: true` beats Agent Teams for content at scale. Agent Teams add overhead. Agents expanding 3+ posts at 6,000+ words often exhaust context.

### devlog-publisher vs devlog-pipeline
| Feature | devlog-publisher | devlog-pipeline |
|---------|-----------------|-----------------|
| Lines | 203 | 355 |
| Architecture | Teammate-based | Direct agent spawning |
| Word count | 1,500-2,500 | 6,000-12,000 |
| Lookback | 30 days | 180 days |

---

## Post 10: "Design Tokens and the Stitch Loop"
**Source:** Miner R6 (content-design-skills-plugins)

### Stitch MCP Usage
| Tool | Files | Total Calls |
|------|-------|-------------|
| generate_screen_from_text | 146+ | 3,052+ |
| list_screens | 9 | 524 |
| create_project | 8 | 580 |
| get_screen | 9 | 309 |
| get_project | 13 | 179 |
| generate_variants | 2 | 20 |
| edit_screens | 2 | 10 |

### Stitch Usage by Project
| Project | Mentions |
|---------|----------|
| ai-digest | 1,041 |
| blog-series | 359 |
| sessionforge | 6 |

### Design Token Mentions in Sessions
| Token | Hex | Mentions |
|-------|-----|----------|
| Void Navy | #0f172a | 138 |
| Indigo Pulse | #6366f1 | 134 |
| Slate Abyss | #1e293b | 125 |
| Cloud Text | #f1f5f9 | 100 |
| Mist Caption | #94a3b8 | 99 |
| Slate Prose | #cbd5e1 | 91 |
| "Midnight Observatory" | - | 138 |

### Stitch-Loop Skill (206 lines)
Baton system: Read `next-prompt.md` → Consult `SITE.md` + `DESIGN.md` → Generate via Stitch → Retrieve HTML → Integrate → Update sitemap → Write next baton

### Stitch Generation Workflow
```
DESIGN.md (Section 6) → Stitch Prompt
→ generate_screen_from_text(projectId, prompt, deviceType)
→ get_screen(screenId) → Download HTML + screenshot
→ Save to queue/ → Move to site/public/
→ Update SITE.md sitemap
```

### Batch Generation Evidence
Prompts for 8-10 hero images at a time, assigned to parallel agents:
- "Generate 10 Stitch hero images for blog posts 12-21"
- "Generate 8 Stitch hero images for blog posts 22-29"

---

## Post 11: "YAML Specs as Source of Truth"
**Source:** Miner R7 (memory-specs-evolution-sdk)

### GSD Framework Architecture
- CLI tool: `gsd-tools.cjs` at `/Users/nick/.claude/get-shit-done/bin/gsd-tools.cjs`
- Workflows: `insert-phase.md`, `new-project.md`
- Templates: `requirements.md`
- References: `questioning.md`, `ui-brand.md`

### GSD Commands (from ils-ios sessions)
- `/gsd:insert-phase <after> <description>` — insert phase into roadmap
- `/gsd:quick --full` — quick task with full audit
- `/gsd:new-project` — initialize with roadmap, requirements, state
- `/gsd:plan-phase 1` — plan and execute specific phase

### GSD Init Output (real session)
```
project_exists: false (good - can create)
is_brownfield: true (existing code detected)
needs_codebase_map: true (no codebase map exists)
has_git: true
planning_exists: true (.planning/ directory exists)
```

### Largest GSD Session (62115115, 338MB)
- 30 validation gates across phases
- 5 implementation streams running in parallel
- 4 platform targets (iPhone, iPad, Mac, macOS)
- Multiple context resets (5+ compaction events)
- GSD planning files: `.planning/PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`
- 3 parallel research agents launched initially
- User directive: "autonomous execution — after plan, execute; after execute, verify; after verify, move on"

### Companion Repo: reponexus
- `spec_parser.py` — YAML spec loader with JSON Schema validation (Draft7Validator)
- `AcceptanceCriterion` types: `type-check`, `contract`, `integration`, `functional`
- `phase_runner.py` — Phase machine: Discover → Plan → Execute → Verify → Ship
- Each phase has `entry_check`, `work`, `exit_gate`, `max_retries`

### Key Insight
ROADMAP.md persists as ground truth independent of any session's memory — enabling autonomous multi-day execution across context resets (60,870+ lines of session data for single audit)

---

## Post 12: "Teaching AI to Remember"
**Source:** Miner R7 (memory-specs-evolution-sdk)

### Memory MCP Tool Usage
- `mcp__plugin_claude-mem_mcp-search__search` — primary semantic search
  - Example: `"sessionforge visualization velocity dashboard agent"` → 26 results
  - Returns observation IDs with titles, timestamps, read-cost estimates
- `mcp__plugin_episodic-memory_episodic-memory__search` — cross-project episodic search
  - Parameters: `query` (array of concepts), `limit`
  - Sources from conversation archive JSONL files
- `ToolSearch` — internal tool discovery, reports `total_deferred_tools: 254`

### State Persistence Tools
| Tool | Calls |
|------|-------|
| state_write | 48 |
| state_list_active | 18 |
| state_read | 15 |
| state_get_status | 9 |
| state_clear | 9 |

### Observer Architecture (real session evidence)
- Queue-based: `enqueue`, `dequeue`, `remove` operations
- XML observation blocks: `<what_happened>`, `<occurred_at>`, `<working_directory>`, `<parameters>`, `<outcome>`
- 6 observation types: bugfix, feature, refactor, change, discovery, decision
- Observer runs as separate Claude process (PID visible, version 2.1.63)
- CWD: `/Users/nick/.claude-mem/observer-sessions`

### Observer System Prompt (verbatim)
- "CRITICAL: Record what was LEARNED/BUILT/FIXED/DEPLOYED/CONFIGURED, not what you (the observer) are doing."
- "SPATIAL AWARENESS: Tool executions include the working directory (tool_cwd)"
- Good: "Authentication now supports OAuth2 with PKCE flow"
- Bad: "Analyzed authentication implementation and stored findings"

### Companion Repo: claude-mem-architecture
- `core.py` (331 lines): ObservationType enum, Observation dataclass, ObservationStore (SQLite + WAL)
- Schema: `observations` table + `references` table
- **TF-IDF semantic search** — zero external dependencies, pure Python
- `_tokenize()`, `_term_frequency()`, `_cosine_similarity()` for vector comparison
- README stats: 14,391 observations, 23 recurring mistake categories, 3.2x resolution speedup, <50ms search latency

### Key Insight
The observer is a separate Claude process running concurrently — watches tool executions in real-time and generates structured observations. The 3-layer workflow (search → timeline → get_observations) minimizes tokens by filtering before fetching

---

## Post 13: "84 Steps to Find One Bug"
**Source:** Miner R5 (validation-and-debugging)

### Sequential Thinking Evidence
- **2,267 total mentions** of sequentialthinking across sessions
- Longest verified chain: **21 steps** (ground truth agent design for vision labeling)
- 15-step chain for video detection debugging (yt-transition project)

### War Stories
1. **15-Step Video Detection Debugging:** Sequential thinking traced through video analysis pipeline to isolate frame extraction failure
2. **21-Step Ground Truth Agent Design:** Designing a vision-based labeling system required 21 sequential reasoning steps
3. **Stale Build Cache:** Agent spent multiple iterations debugging a phantom error caused by stale build artifacts

### Validation Tool Usage as Debugging Evidence
- 16,367 idb_describe calls = systematic UI element verification
- 2,290 idb_describe in single session = exhaustive accessibility tree analysis
- 674 Playwright calls in single session = methodical browser validation

---

## Post 14: "35 Worktrees, Zero Conflicts"
**Source:** Miner R3 (worktrees-and-merging)

### Worktree Census (Same as Post 6, different angle)
- 363 total worktrees across 4 projects
- Peak: 35 simultaneous worktrees
- Two naming conventions: adjective-noun (primary) and functional names

### Merge Orchestration Evidence
- 9 PRs created and merged in single session
- 9-script automation suite with CI gates
- Sequential foundation merge pattern

### War Stories
- `gh pr merge` bug: discovered during mass merge operations
- "Ripple rebase" pattern for cascading branch management
- Per-file conflict resolution with file ownership boundaries

### Worktree Management Automation
- 47-task spec managing 20+ worktrees across phases
- Deletion rule: 0 commits ahead = abandoned → delete with --force
- Phase-to-worktree mapping tracked in task lists

---

## Post 15: "217 Skills and What They Teach Us"
**Source:** Miner R6 (content-design-skills-plugins)

### Skill Census
- **217 unique SKILL.md files** discovered
- Average SKILL.md: 264 lines (sample of 30)

### Skill Directory Structure
| Resource Dir | Count | Purpose |
|--------------|-------|---------|
| references/ | 84 | Domain knowledge |
| scripts/ | 62 | Executable code |
| examples/ | 28 | Working examples |
| templates/ | 22 | Output templates |
| workflows/ | 13 | Multi-step workflows |
| agents/ | 3 | Subagent prompts |

### Three-Level Progressive Disclosure
1. **Metadata** (name + description) — Always in context (~100 words)
2. **SKILL.md body** — Loaded when triggered (<500 lines ideal)
3. **Bundled resources** — On-demand (unlimited size)

### Most-Invoked Skills (SessionForge sessions)
| Skill | Invocations |
|-------|-------------|
| functional-validation | 16 |
| devlog-publisher | 6 |
| reflexion:reflect | 4 |
| oh-my-claudecode:cancel | 4 |
| gate-validation-discipline | 3 |

### Description as Triggering Mechanism
- skill-creator (487 lines) includes description optimization loop
- Generate 20 eval queries → run optimization → 60/40 train/test split → evaluate 3x
- Key insight: Claude "undertriggers" — descriptions must be "pushy"

### Skill Architecture Spectrum
| Type | Example | Lines |
|------|---------|-------|
| Simple (1 file) | mem-search | 336 |
| Medium (+ references) | functional-validation | 142 |
| Complex (full pipeline) | devlog-pipeline | 355 |
| Meta (skill about skills) | skill-creator | 487 |

### Skill Interaction Patterns
- **Delegation:** devlog-publisher → technical-content-creator
- **Composition:** functional-validation → gate-validation-discipline + no-mocking-validation-gates
- **Extension:** devlog-pipeline extends devlog-publisher
- **Conflict declaration:** functional-validation conflicts with testing-anti-patterns

---

## Post 16: "Hooks, Plugins, and Programmatic Discipline"
**Source:** Miner R6 (content-design-skills-plugins)

### Plugin Census
- **94 installed plugins**
- **20+ marketplaces** registered
- Plugin scopes: user (most), project (swift-lsp, ui-design-system), local (browser-automation)

### Hook Architecture
- **31 hook files** in ~/.claude/hooks/
- 17 .js (Node.js), 13 .cjs (CommonJS/OMC), 1 .sh (legacy)
- **9 hook event types:** PreToolUse (6), PostToolUse (5), UserPromptSubmit (1), SessionStart (1), Stop (1), SubagentStart (1), SubagentStop (1), TaskCompleted (1), TeammateIdle (1)

### Hook Categories
**Enforcement (block):** block-test-files.js, block-api-key-references.js, privacy-block.cjs
**Reminder (inject):** skill-activation-forced-eval.js, read-before-edit.js, plan-before-execute.js, validation-not-compilation.js, evidence-gate-reminder.js
**Tracking (monitor):** skill-invocation-tracker.js, completion-claim-validator.js
**Orchestration (OMC):** subagent-context-enforcer.js, subagent-init.cjs, team-context-inject.cjs, teammate-idle-handler.cjs, session-init.cjs (15KB, most complex)

### Hook Implementation Pattern
```javascript
let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const output = { decision: "block", reason: "..." };
  process.stdout.write(JSON.stringify(output));
});
```

### Hook Decisions
- **Block:** `{ decision: "block", reason: "..." }`
- **Allow with context:** `{ hookSpecificOutput: { additionalContext: "..." } }`
- **Silent allow:** `process.exit(0)` with no output

### Plugin Lifecycle
Plan → Create → Add components → Test → Debug → Release → Maintain

### Distribution Methods
1. Direct GitHub: `/plugin marketplace add org/repo`
2. Marketplace: Separate repo with manifest
3. Private: Configure via `.claude/settings.json`

### Notable Plugins
| Plugin | Version | Category |
|--------|---------|----------|
| oh-my-claudecode | 4.7.6 | Orchestration |
| everything-claude-code | 1.8.0 | Config |
| claude-mem | 10.5.2 | Memory |
| swift-engineering | 0.1.31 | iOS |
| ralph-specum | 4.8.4 | Spec execution |

### Shannon Framework
- 5 direct name references (concepts embedded in architecture)
- 4-layer enforcement: hooks (L1), skills (L2), CLAUDE.md rules (L3), agent prompts (L4)

---

## Post 17: "955 Lines of Bash to Full Orchestrator"
**Source:** Miner R7 (memory-specs-evolution-sdk)

### Builder Generations
1. **ccb Bash Script** (May 2025) — 47→955 lines, `ccb-ai-instructions.md` (389 lines, genesis document containing "NO UNIT TESTS / NO MOCKS / Only functional validation")
2. **Auto-Claude Electron** (Jan-Feb 2026) — 19 Zustand stores, 329 `ipcMain.handle()` registrations, 596 IPC channel definitions, XState state machines, v2.7.6
3. **Mobile Specs** (Mar 4, 2026) — Parallel spec generation: `spec-a-react-native-expo.md` (2,870 lines), `spec-b-swiftui-native.md` (5,117 lines), `api-gateway-design.md` (635 lines)
4. **Claude Code CLI** (current) — The builder became unnecessary as CLI absorbed capabilities

### Auto-Claude Exploration (4 parallel agents)
1. "Explore IPC channels & handlers" — mapped 200+ IPC channels
2. "Explore stores & state machines" — inventoried 19 Zustand stores
3. "Explore backend API surface" — mapped Python backend
4. "Explore shared types & design" — shared type definitions

### Mobile Spec Generation
- Channel mapping: 380 REST + 120 WebSocket + 96 Electron-only excluded
- 17 screen wireframes per spec with ASCII wireframes, component hierarchies
- 4 XState machine ports to mobile
- Both specs generated by parallel `claude-opus-4-6` agents
- Total output: 8,695 lines across 4 documents

### Key Insight
`ccb-ai-instructions.md` is the Rosetta Stone — written 10 months before the blog series, contains the functional validation mandate. Each generation taught a lesson: bash→validation rules, Electron→IPC abstraction, specs→executable contracts, CLI→the builder should be the tool itself.

---

## Post 18: "SDK vs CLI: When Each Approach Wins"
**Source:** Miner R7 (memory-specs-evolution-sdk)

### SDK Patterns (claude-code-monorepo)
- `basic-agent.ts` — Direct `@anthropic-ai/sdk` import, `Anthropic.Tool[]` array, manual tool loop
- `multi-agent-pipeline.ts` — 3-agent sequential pipeline (planner → implementer → reviewer)
- Each agent runs via `client.messages.create()`, output chained between stages

### CLI Patterns (claude-code-monorepo)
- `hat-rotation.sh` — 4-phase execution using `claude -p`:
  ```bash
  PLAN=$(claude -p "You are wearing the PLANNER hat...")
  BUILD_OUTPUT=$(claude -p "You are wearing the BUILDER hat... ${PLAN}")
  REVIEW=$(claude -p "You are wearing the REVIEWER hat... ${BUILD_OUTPUT}")
  ```
- `worktree-parallel.sh` — parallel CLI sessions across git worktrees

### SDK vs CLI Decision Matrix
| Dimension | SDK | CLI |
|-----------|-----|-----|
| Token control | Precise | Overhead from system prompts, hooks, skills |
| Tool ecosystem | Manual definitions | Built-in: Glob, Grep, Read, Edit, Bash |
| Cost | ~40% less | Higher but includes full environment |
| Code volume | 3x more code | Minimal: `claude -p "prompt"` |
| Code editing | Manual diff/patch | Context-preserving Edit tool |
| MCP servers | Self-integrate | Auto-discovered, auto-started |
| Hooks | None — build yourself | PreToolUse, PostToolUse, etc. |

### Active MCP Server Ecosystem (from sessions)
playwright-mcp, firecrawl-mcp (2x), chrome-devtools-mcp, shadcn-mcp, sequential-thinking, mcp-server-memory, tavily-mcp, repomix, oh-my-claudecode

### Key Insight
hat-rotation.sh is the clearest CLI pattern: 4 phases, each a single `claude -p` call, output piped between phases. SessionForge shows the hybrid: CLI for dev, MCP tools for memory integration

---

## Cross-Post Evidence Connections

| Connection | Posts | Evidence |
|------------|-------|----------|
| Hook enforcement enables validation discipline | 7, 3, 16 | 64,157 hook events enforce no-mock, no-test-file rules |
| Skills power the content pipeline | 15, 9 | devlog-pipeline skill (355 lines) orchestrates 61-post generation |
| Stitch MCP generates visuals for pipeline | 10, 9 | 3,052+ generate_screen_from_text calls for hero images |
| Ralph uses worktrees for parallel execution | 8, 6 | 10 named worktrees running parallel Ralph loops |
| Consensus gates use multi-agent teams | 2, 1 | 7,844 agent operations, 75-TaskCreate audit sessions |
| Plugins package skills for distribution | 16, 15 | 94 plugins packaging 217 skills across 20+ marketplaces |
| Functional validation replaces unit testing | 3, 7 | block-test-files (642 fires) + iOS (16,367 idb_describe) + web (4,522 browser_click) |

## Global Metrics (Verified)

| Metric | Value |
|--------|-------|
| Total sessions | 4,510 meaningful |
| Date range | Feb 4 – Mar 6, 2026 |
| Projects | 20 |
| Total worktrees | 363 |
| Total hook events | 64,157+ |
| Total Stitch calls | 3,052+ |
| Unique skills | 217 |
| Installed plugins | 94 |
| Agent operations | 7,844 |
| Sequential thinking mentions | 2,267 |
| block-test-files fires | 642 |
| iOS validation calls | 40,000+ |
| Web validation calls | 15,000+ |
