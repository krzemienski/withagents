# Session Mining Team Plan

**Goal:** Mine ALL 4,503 meaningful sessions across 40 projects to extract real evidence for 18 blog posts, verify the correct session count, and update all posts with real data.

**Verified Session Count:** 4,503 top-level JSONL files >1KB across 40 unique projects (24,032 total including subagent spawns and empty files).

**Blog Title Update:** "4,500" → "4,500" (rounded from 4,503)

---

## Execution Flow

```
Step 1: Run updated deep-mine.py (2 min, script)
    ↓ produces aggregate report
Step 2: Spawn 7 researchers in parallel (~15 min each)
    ↓ each reads aggregate report + samples specific sessions
Step 3: I synthesize 7 reports → rewrite 18 posts (30 min)
    ↓
Step 4: Sync to site/, rebuild, redeploy
```

---

## Step 1: Aggregate Mining Script

Update `scripts/deep-mine.py` to:
- Scan ALL 40 projects (not just 20)
- Include worktree directories as part of their parent project
- Filter to files >1KB only
- Output per-project: file count, total size, tool distribution, topic signals
- Output grand totals for the blog title

Save to: `plans/260306-1741-blog-consolidation/research/deep-mine-full-report-v2.md`

---

## Step 2: Seven Researchers

### Why 7, not 6

The reflection identified that Researcher 2 (iOS + Worktrees) was overloaded with 259+ directories. Split into:
- Researcher 2: iOS only (ils-ios + worktrees)
- Researcher 3: Worktrees + Merge (awesome-list-site worktrees, code-story-platform worktrees, ralph worktrees)

Also, claude-mem-observer (3,200 files) needs its own researcher due to volume.

### Load Balancing

| Researcher | Posts | Projects | Est. Files | Context Risk |
|------------|-------|----------|------------|--------------|
| R1 | 1, 2 | ALL (aggregate) + agent-heavy | ~4,503 via script | Low (uses script output) |
| R2 | 4, 5 | ils-ios + 50 worktrees | ~1,119 | Medium |
| R3 | 6, 14 | awesome-site worktrees + code-story worktrees | ~210 | Low |
| R4 | 7, 8 | ralph-orchestrator + 15 worktrees | ~152 | Low |
| R5 | 3, 13 | yt-shorts-detector + validation sessions | ~268 | Medium |
| R6 | 9, 10, 15, 16 | sessionforge + ai-digest + blog-series + skill files | ~382 | Medium |
| R7 | 11, 12, 17, 18 | claude-mem-observer + Auto-Claude + misc | ~3,250 | High (needs sampling cap) |

### Sampling Strategy (All Researchers)

Each researcher uses the deep-mine.py sampling approach:
1. Sort files by size (largest = richest sessions)
2. Sample top 30 largest + 15 random middle + 10 most recent = 55 files max per project cluster
3. Per file: read first 150 lines, middle 150 lines, last 150 lines (450 lines/file)
4. Max context budget: ~25,000 lines of session data per researcher
5. If a project has <20 files, read ALL of them

### Communication Protocol

- Each researcher saves report to: `plans/260306-1741-blog-consolidation/research/miner-{N}-{topic}.md`
- Each researcher sends a summary DM to lead when done
- No broadcasts unless a critical blocker is found
- Researchers work independently — no inter-researcher communication needed

---

## Researcher Prompts

### Researcher 1: "The Numbers" — Posts 1 & 2

**Output file:** `miner-1-numbers-and-consensus.md`

**Assignment:** You are mining session data to produce verified metrics and multi-agent consensus evidence for the blog series overview post and the multi-agent consensus post.

**Step 1:** Read the aggregate report at `plans/260306-1741-blog-consolidation/research/deep-mine-full-report-v2.md`. This contains per-project tool distributions and file counts.

**Step 2:** From the aggregate report, compile these EXACT numbers for Post 1 (Overview):
- Total meaningful sessions (>1KB, top-level only)
- Total projects
- Total lines of session data
- Top 5 most-used tools across ALL projects (with exact counts)
- Top 5 projects by session volume
- Date range (earliest and latest session file timestamps)
- Total agent spawns (Task + TaskCreate counts across all projects)
- Total files read/written/edited across all projects

**Step 3:** For Post 2 (Multi-Agent Consensus), sample sessions from these specific projects:
- `~/.claude/projects/-Users-nick-Desktop-ils-ios/` — sort by size, read top 10 largest. Look for: Task(), TaskCreate(), TaskUpdate() patterns, agent coordination, consensus voting, multi-agent error recovery
- `~/.claude/projects/-Users-nick-Desktop-ralph-orchestrator/` — top 10 largest. Look for: hat-based dispatch, agent spawning, result synthesis
- `~/.claude/projects/-Users-nick-Desktop-sessionforge/` — top 5 largest. Look for: Agent() spawns, parallel exploration

**Per-file sampling:** First 150 lines + middle 150 lines + last 150 lines.

**What to extract per sampled session:**
- Tool call counts (grep for `"type":"tool_use"` or `"tool_name"`)
- Agent spawn commands (grep for `Task(` or `Agent(` or `TaskCreate`)
- Any multi-agent coordination dialogue
- Error messages and how they were resolved
- Real terminal output (bash commands and their results)

**Report format:**
```
## Post 1: Verified Metrics
- Sessions: [exact number]
- Projects: [exact number]
- Date range: [earliest] to [latest]
- Top tools: [tool: count] x5
- Top projects: [name: count] x5
- Total agent spawns: [number]
- Total files touched: [number]

## Post 2: Multi-Agent Evidence
### War Story 1: [title]
- Project: [name]
- Session file: [filename]
- What happened: [2-3 sentences]
- Real output: [actual terminal/tool output from session]
- Agents involved: [count and types]

### War Story 2: [title]
[same structure]

### Quotable Metrics
- Largest multi-agent session: [X agents in one session]
- Total Task() calls across corpus: [number]
- Projects with >10 agent spawns: [list]
```

---

### Researcher 2: "iOS Deep Dive" — Posts 4 & 5

**Output file:** `miner-2-ios-development.md`

**Assignment:** Mine the ils-ios project (largest in the corpus at 4.8GB) and its worktrees for iOS development patterns, SSE streaming bridge evidence, and SwiftUI/iCloud/Keychain/performance war stories.

**Projects to mine:**
- `~/.claude/projects/-Users-nick-Desktop-ils-ios/` (785 files)
  - Sample: top 30 by size + 15 random + 10 most recent
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-001-native-macos-app/` (65 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-007-icloud-sync/` (57 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-002-custom-themes-creator/` (44 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-012-performance-optimization-suite/` (40 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-003-keychain-credential-storage/` (10 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-011-complete-ssh-service-implementation/` (43 files) — read all
- `~/.claude/projects/-Users-nick-Desktop-ils-ios--auto-claude-worktrees-tasks-006-syntax-highlighted-code-blocks/` (29 files) — read all

**Per-file sampling:** First 150 + middle 150 + last 150 lines.

**What to look for — Post 4 (iOS Streaming Bridge):**
- SSE (Server-Sent Events) implementation sessions
- `SSEClient`, `URLSession`, streaming response handling
- 5-layer bridge architecture: SSE → Parser → Buffer → ViewModel → SwiftUI
- Real Xcode build errors and how they were resolved
- `idb_tap`, `simulator_screenshot`, `idb_describe`, `idb_input` calls — these are REAL device validation
- `xcodebuild` commands and their output
- Any session where the streaming bridge was initially broken and then fixed

**What to look for — Post 5 (iOS Patterns):**
- SwiftUI state management patterns (`@State`, `@Observable`, `@Binding`, `@Environment`)
- iCloud sync: `NSUbiquitousKeyValueStore`, `CloudKit`, conflict resolution
- Keychain: `SecItemAdd`, `SecItemCopyMatching`, credential storage patterns
- Performance: Instruments usage, memory profiling, `TimelineView`, `Canvas`
- Multi-simulator validation: `xcrun simctl` commands across different devices

**Report format:**
```
## Post 4: iOS Streaming Bridge Evidence
### SSE Bridge Implementation
- Sessions where bridge was built: [list files]
- Real build errors encountered: [quote actual errors]
- Final architecture: [describe from session evidence]
- Simulator validation commands: [list actual idb_* commands seen]

### War Story: [specific debugging session]
- File: [filename]
- Error: [actual error message]
- Fix: [what was changed]
- Lines: [line numbers in session file]

## Post 5: iOS Patterns Compendium
### SwiftUI State Patterns Found
- [pattern]: [session file, line numbers]

### iCloud Sync Sessions
- Sync implementation: [file, what happened]
- Conflict resolution: [evidence]

### Performance Optimization
- Instruments usage: [commands seen]
- Memory improvements: [before/after if visible]

### Metrics
- Total iOS sessions: [count]
- Total idb_* calls: [count by type]
- Total xcodebuild invocations: [count]
- Unique simulators used: [list]
```

---

### Researcher 3: "Parallel Execution" — Posts 6 & 14

**Output file:** `miner-3-worktrees-and-merging.md`

**Assignment:** Mine the worktree-heavy projects to extract parallel execution patterns, worktree creation/management evidence, and merge orchestration war stories.

**Projects to mine:**
- `~/.claude/projects/-Users-nick-Desktop-awesome-list-site--auto-claude-worktrees-tasks-*/` (119 directories)
  - Each has 0-2 sessions. List all, sample the 20 largest files across all dirs.
- `~/.claude/projects/-Users-nick-Desktop-code-story-platform--auto-claude-worktrees-tasks-*/` (90 directories)
  - Same approach: list all, sample 20 largest files.
- `~/.claude/projects/-Users-nick-Desktop-ralph-orchestrator--worktrees-*/` (15 directories)
  - Read ALL files (only ~20 total).
- `~/.claude/projects/-Users-nick-Desktop-awesome-site/` and `~/.claude/projects/-Users-nick-Documents-awesome-site/` (43 files total)
  - Sample top 15 by size.

**What to look for — Post 6 (Parallel Worktrees):**
- `git worktree add` / `git worktree list` commands
- `.auto-claude/worktrees/tasks/` directory structures
- Task YAML files defining parallel work
- Named worktree conventions (lucky-reed, neat-elm, bright-maple, etc.)
- How many worktrees were active simultaneously
- Total unique worktrees created across ALL projects (count the directories)

**What to look for — Post 14 (Merge Orchestration):**
- `gh pr create` / `gh pr merge` commands
- `git merge` / `git rebase` commands
- Merge conflict resolution sessions
- PR review patterns
- Branch management: `git checkout`, `git branch -d`
- Any session where multiple PRs were merged in sequence

**Report format:**
```
## Post 6: Parallel Worktree Evidence
### Worktree Census
- awesome-list-site worktrees: [count] directories
- code-story-platform worktrees: [count] directories
- ralph-orchestrator worktrees: [count] directories
- ils-ios worktrees: [count from R2's project list]
- TOTAL unique worktrees: [sum]

### Named Worktree Convention
- Names found: [list all names like lucky-reed, etc.]
- Naming pattern: [adjective-noun]

### Real Commands
- [actual git worktree commands from sessions]

### War Story: [parallel execution example]
[details]

## Post 14: Merge Evidence
### PR Statistics
- Total `gh pr create` calls: [count]
- Total `gh pr merge` calls: [count]
- Merge conflicts found: [count and examples]

### War Story: [merge orchestration session]
[details]
```

---

### Researcher 4: "Governance & Loops" — Posts 7 & 8

**Output file:** `miner-4-governance-and-ralph.md`

**Assignment:** Mine ralph-orchestrator and related projects for governance stack evidence (CLAUDE.md, hooks, constitutions) and Ralph loop execution patterns (hat events, iteration control, state management).

**Projects to mine:**
- `~/.claude/projects/-Users-nick-Desktop-ralph-orchestrator/` (132 files)
  - Sample: top 30 by size + 15 random + 10 most recent
- `~/.claude/projects/-Users-nick-ralph-orchestrator/` (if exists, check)
- `~/.claude/projects/-Users-nick-Desktop-ralph-tui/` (if exists)
- `~/.claude/projects/-Users-nick-Desktop-code-tales-ios/` and eval sandboxes (251 sessions across ~7 directories)
  - These contain ralph-eval-runs — CRITICAL for Post 8
  - Sample top 20 largest across all eval dirs

**What to look for — Post 7 (Governance Stack):**
- CLAUDE.md file reads/writes (grep for `CLAUDE.md` in sessions)
- Hook mentions: `block-test-files`, `evidence-gate-reminder`, `read-before-edit`, `plan-before-execute`
- Constitution creation: any session creating rules/constraints
- Skill activation patterns: `Skill(` calls with skill names
- `state_write` / `state_read` — stateful orchestration
- "NO MOCKS" enforcement — any session where mocks were blocked or discussed

**What to look for — Post 8 (Ralph Loops):**
- `ralph emit` commands (hat events)
- `ralph tools task ready` commands
- Hat names: builder, writer, reviewer, thorough-reviewer, planner
- Iteration counts: how many loops in a single session
- State management: `.omc/state/ralph-state.json` reads/writes
- `state_write` with `mode: "ralph"` or `mode: "ultrawork"`
- Named worktree creation within ralph sessions
- GSD integration: `gsd-tools.cjs` commands

**Report format:**
```
## Post 7: Governance Evidence
### CLAUDE.md Usage
- Sessions reading CLAUDE.md: [count]
- Sessions modifying CLAUDE.md: [count]
- Example CLAUDE.md content seen: [quote]

### Hook Enforcement
- hook mentions found: [list with counts]
- Sessions where hooks blocked actions: [examples]

### Constitution Patterns
- [real constitution content from sessions]

## Post 8: Ralph Loop Evidence
### Hat Events
- Hat types seen: [list]
- ralph emit commands: [real examples]
- Average iterations per session: [estimate]

### Longest Ralph Session
- File: [name]
- Iterations: [count]
- Duration: [if visible from timestamps]
- What it built: [description]

### GSD Integration
- gsd-tools.cjs commands: [list with counts]
```

---

### Researcher 5: "Validation & Debugging" — Posts 3 & 13

**Output file:** `miner-5-validation-and-debugging.md`

**Assignment:** Mine for functional validation evidence (the NO MOCKS philosophy in action) and debugging patterns (sequential thinking, error recovery, build cache issues).

**Projects to mine:**
- `~/.claude/projects/-Users-nick-Desktop-yt-transition-shorts-detector/` (268 files)
  - Sample: top 30 + 15 random + 10 most recent
  - This project has the MOST `sequentialthinking` usage
- `~/.claude/projects/-Users-nick-Desktop-sessionforge-apps-dashboard/` (112 files)
  - Sample top 20 by size
  - Has heavy browser_* usage (functional validation)
- `~/.claude/projects/-Users-nick-Desktop-awesome-site/` (20 files) — read all
  - Has browser validation patterns

**What to look for — Post 3 (Functional Validation):**
- `idb_tap`, `idb_describe`, `simulator_screenshot` — iOS validation
- `browser_click`, `browser_navigate`, `browser_take_screenshot` — web validation
- `browser_snapshot` — accessibility tree validation
- Sessions where mocks/tests were explicitly avoided or rejected
- Real validation sequences: build → run → exercise UI → capture evidence → verify
- Hook enforcement: `block-test-files.js` mentions
- Gate validation: evidence examination before completion claims

**What to look for — Post 13 (Debugging):**
- `sequentialthinking` MCP calls — count per session, longest chain
- Error messages and stack traces (grep for `error`, `Error`, `failed`, `FAIL`)
- Build cache issues: stale builds, clean/rebuild cycles
- `chrome-devtools` or `browser_evaluate` — Chrome DevTools Protocol usage
- Debug → fix → validate loops
- Sessions with high Edit count after errors (indicates iterative fixing)

**Report format:**
```
## Post 3: Functional Validation Evidence
### Validation Tool Census
- idb_tap total: [count]
- idb_describe total: [count]
- simulator_screenshot total: [count]
- browser_click total: [count]
- browser_navigate total: [count]
- browser_take_screenshot total: [count]

### Real Validation Sequence
- Session: [file]
- Sequence: [build command] → [run command] → [UI interaction] → [screenshot] → [verification]
- Actual output: [quote]

### Mock Rejection Evidence
- [any session where test files were blocked or mocks discussed]

## Post 13: Debugging Evidence
### Sequential Thinking
- Total sequentialthinking calls: [count]
- Longest chain: [N steps in one session]
- Session file: [name]
- What was debugged: [description]

### Error Patterns
- Most common errors: [top 5 with counts]
- Build cache issues: [examples]
- Chrome DevTools usage: [commands seen]

### War Story: [specific debugging session]
[details with real error messages]
```

---

### Researcher 6: "Content & Design" — Posts 9, 10, 15, 16

**Output file:** `miner-6-content-design-skills-plugins.md`

**Assignment:** Mine for content pipeline evidence, Stitch MCP design generation, skill anatomy, and plugin architecture patterns.

**Projects to mine:**
- `~/.claude/projects/-Users-nick-Desktop-sessionforge/` (236 files) + `sessionforge-apps-dashboard` (112 files)
  - Sample top 25 from each by size
  - Content mining evidence for Post 9
- `~/.claude/projects/-Users-nick-Desktop-ai-digest/` (13 files) — read all
  - Stitch MCP usage for Post 10
- `~/.claude/projects/-Users-nick-Desktop-blog-series/` (21 files) — read all
  - Both content pipeline AND Stitch usage
- Skill files: `find ~/.claude/skills/ -name "SKILL.md"` — read all
  - Skill anatomy for Post 15

**What to look for — Post 9 (Content Pipelines):**
- `get_session_summary`, `get_session_messages`, `create_insight`, `mine_sessions` — SessionForge MCP tools
- Content generation tool chains: how sessions become blog posts
- Word count metrics across generated content
- `devlog-pipeline` skill invocations

**What to look for — Post 10 (Design to Code):**
- `generate_screen_from_text` — Stitch MCP screen generation
- `list_screens`, `get_screen`, `edit_screens` — Stitch project management
- Design token references: color hex values, spacing tokens, typography
- `create_project` calls — Stitch project creation

**What to look for — Post 15 (Skills Anatomy):**
- `Skill(` invocations with skill names — which skills are used most
- SKILL.md file structures — what patterns recur
- Skill trigger patterns in sessions
- How many unique skills exist across all projects

**What to look for — Post 16 (Plugins):**
- `plugin.json` file reads/writes
- Hook file creation/modification
- MCP server configuration
- Agent configuration files
- Shannon Framework references

**Report format:**
```
## Post 9: Content Pipeline Evidence
### SessionForge Tool Usage
- get_session_summary: [count]
- mine_sessions: [count]
- create_insight: [count]
- Total content words generated: [estimate]

## Post 10: Design Evidence
### Stitch MCP Usage
- generate_screen_from_text: [count across all projects]
- Total screens generated: [count]
- Projects using Stitch: [list]

## Post 15: Skills Evidence
### Skill Census
- Total unique SKILL.md files: [count]
- Most-invoked skills: [top 10 with counts]
- Skill trigger patterns: [examples]

## Post 16: Plugin Evidence
### Plugin Architecture
- plugin.json files found: [count]
- Hook files found: [count and names]
- MCP server configs: [count]
```

---

### Researcher 7: "Memory & Evolution" — Posts 11, 12, 17, 18

**Output file:** `miner-7-memory-specs-evolution-sdk.md`

**Assignment:** Mine claude-mem-observer (the largest project), Auto-Claude, and misc projects for memory architecture, spec-driven execution, CCB evolution, and SDK vs CLI evidence.

**CRITICAL: Context budget.** claude-mem-observer has 3,200 files. You MUST NOT read all of them. Strategy:
1. Sort all 3,200 files by size
2. Read top 20 largest files only (first/middle/last 150 lines each)
3. Read 10 random files from the middle
4. Read 5 most recent files
5. Total: 35 files max from this project

**Projects to mine:**
- `~/.claude/projects/-Users-nick--claude-mem-observer-sessions/` (3,200 files)
  - STRICT 35-file sample as above
  - Memory architecture for Post 12
- `~/.claude/projects/-Users-nick-Desktop-Auto-Claude/` (12 files) — read all
  - CCB evolution for Post 17
- `~/.claude/projects/-Users-nick-Desktop-ils-ios/` — already mined by R2, but check deep-mine report for spec/GSD evidence
  - Spec-driven execution for Post 11
- `~/.claude/projects/-Users-nick-Desktop-happy-packages-happy-cli/` — if exists, check for CLI tool patterns
- `~/.claude/projects/-Users-nick-Desktop-claryo/` — if exists, check
- `~/.claude/projects/-private-tmp-ralph-eval-*/` (4 directories) — read all files
  - Ralph eval runs for Post 17 (builder evolution)

**What to look for — Post 11 (Spec-Driven):**
- YAML spec files read/created in sessions
- `roadmap.json` or `roadmap.yaml` references
- GSD phase execution: `gsd-tools.cjs` commands
- Multi-agent builder patterns from specs
- `.planning/phases/` directory structures

**What to look for — Post 12 (Cross-Session Memory):**
- Memory MCP tool calls: `search`, `timeline`, `get_observations`, `smart_search`, `smart_unfold`
- Observation store patterns: SQLite, semantic search
- Session telemetry collection
- Memory retrieval patterns across sessions
- `state_read`/`state_write` for persistent state

**What to look for — Post 17 (CCB Evolution):**
- References to `ccb`, `claude-code-builder`, `enhanced-claude-code`, `autonomous-claude-code-builder`
- `ccb-ai-instructions.md` — the genesis document
- Builder generation comparisons
- Auto-Claude Electron app references: IPC, agent terminals

**What to look for — Post 18 (SDK vs CLI):**
- `@anthropic-ai/sdk` import references
- Claude Code subprocess spawning patterns
- Token cost discussions
- SDK vs CLI trade-off discussions in sessions
- `acli` (autonomous CLI) references

**Report format:**
```
## Post 11: Spec-Driven Evidence
### YAML Specs Found
- [spec file references from sessions]
### GSD Execution
- gsd-tools.cjs commands: [list]
- Phase execution examples: [real output]

## Post 12: Memory Architecture Evidence
### Memory Tool Usage
- search calls: [count]
- get_observations: [count]
- Observation types created: [list]
### Memory Patterns
- [real examples of memory retrieval from sessions]

## Post 17: CCB Evolution Evidence
### Builder Generations Found
- ccb references: [count and context]
- enhanced-claude-code: [count]
- autonomous-claude-code-builder: [count]
- Auto-Claude (Electron): [what sessions show]

## Post 18: SDK vs CLI Evidence
### SDK Usage
- @anthropic-ai/sdk imports: [count]
### CLI Usage
- Claude Code subprocess patterns: [count]
### Comparison Data
- [any performance/cost comparisons found]
```

---

## Step 3: Synthesis

After all 7 reports come in:
1. Read all 7 reports
2. Compile verified metrics for Post 1 title (replace "4,500" with "4,500")
3. Update `series_total: 18` in all frontmatter
4. Rewrite each post's metrics/evidence sections with real data from reports
5. Update CLAUDE.md references
6. `cp -r posts/post-* site/posts/`
7. `cd site && pnpm build`
8. `npx vercel --prod`

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Researcher hits 200K context | Strict sampling caps: 55 files max per project cluster, 450 lines per file |
| claude-mem-observer blows R7 | Hard cap at 35 files, sorted by size |
| Worktree dirs are empty | R3 lists all dirs first, filters to those with >0 JSONL files before sampling |
| Sessions have no useful content | Report "no evidence found" for that topic — better than fabricating |
| deep-mine.py is stale | Step 1 updates it before researchers run |
