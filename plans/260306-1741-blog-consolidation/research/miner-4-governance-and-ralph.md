# Research Miner R4: Governance & Ralph Orchestration

**Mined by:** Research Miner R4 (enhanced pass)
**Date:** 2026-03-06
**Sources:** 132 sessions + 3 agent sub-sessions in ralph-orchestrator, 16 worktree sessions across 18 named worktrees, 10+ sessionforge sessions, 17 hook files on disk, settings.json hook config, Shannon Framework repo, Rust source code
**Coverage:** Post 7 (Prompt Engineering Stack) and Post 8 (Ralph Orchestrator)

---

## POST 7: PROMPT ENGINEERING STACK — Evidence

### 1. The 4-Layer Enforcement Pyramid (Shannon Framework)

The Shannon Framework (`/Users/nick/Desktop/blog-series/shannon-framework/`) is a reference Claude Code plugin that codifies the enforcement architecture. Named after Claude Shannon's insight that reliable communication requires redundant encoding.

**From `shannon-framework/plugin.json`:**
```json
{
  "name": "shannon-framework",
  "version": "1.0.0",
  "description": "Reference Claude Code plugin demonstrating the 4-layer enforcement pyramid: hooks, skills, agents, commands"
}
```

**The 4 Layers (from `shannon-framework/README.md`):**
```
        ┌─────────────┐
        │  Layer 4:   │  Commands
        │  Commands   │  User-invokable actions
        ├─────────────┤
        │  Layer 3:   │  Skills
        │  Skills     │  Structured workflows with
        │             │  routing tables and gates
        ├─────────────┤
        │  Layer 2:   │  Hooks
        │  Hooks      │  Automatic enforcement that
        │             │  fires on tool use events
        ├─────────────┤
        │  Layer 1:   │  Core Methodology
        │  CLAUDE.md  │  Principles in project
        │             │  instructions
        └─────────────┘
```

**Why 4 layers? (from README.md):**
> "Because each layer catches what the previous one misses:
> 1. CLAUDE.md tells the agent what to do -- but agents forget
> 2. Hooks enforce rules automatically -- but can be too rigid for complex workflows
> 3. Skills provide structured workflows -- but require invocation
> 4. Commands give users direct control -- the final safety net"

**Shannon Framework repo structure:**
```
shannon-framework/
├── plugin.json                       # Plugin manifest
├── README.md                         # 4-layer pyramid documentation
├── hooks/
│   ├── block-test-files.js           # PreToolUse: blocks test file creation
│   ├── read-before-edit.js           # PreToolUse: read-first enforcement
│   ├── validation-not-compilation.js # PostToolUse: build != validation
│   ├── evidence-gate-reminder.js     # TaskUpdate: evidence checklist
│   └── skill-activation-check.js     # UserPromptSubmit: skill evaluation
├── skills/
│   └── functional-validation/        # Full validation protocol skill
├── agents/
│   └── code-reviewer.md              # Code review agent definition
└── core/                             # (empty -- room for future methodology)
```

**From Post 7 existing draft (lines 38-44, 52, 88, 148):**
> "Layer 1: Global Constitution -- ~/.claude/CLAUDE.md. Applies to every project. This is the constitution -- projects can add laws but cannot override it. Contains the non-negotiable mandates: functional validation only, no test files, no mocks."

> "Layer 2: Project Constitution -- ./CLAUDE.md in the project root. Project-specific rules: the build command, the tech stack, file naming conventions, known pitfalls."

> "Layer 3: Rules Directory -- .claude/rules/*.md. A 50-line focused file gets more reliable attention than 50 lines buried in a 500-line document. I split governance into nine rules files."

> "Layer 4: PreToolUse Hooks -- Code that runs before every tool call. This is where rules become enforceable. A hook can block a file write, inject a warning, or reject a tool call entirely. The agent cannot ignore a hook that returns `{ "decision": "block" }`."

> "The system works because each layer catches what the others miss. Layer 1 states the rule. Layer 3 provides detail. Layer 4 enforces it mechanically. Layer 6 catches anything that slipped through. No single layer is sufficient. All seven together produce 0.4 violations per session across 847 measured sessions."

---

### 2. Real Hook Implementations — 17 Hooks on Disk

**All hook files at `/Users/nick/.claude/hooks/`:**

| File | Size | Last Modified | Hook Event | Matcher |
|------|------|--------------|------------|---------|
| `block-test-files.js` | 2,054B | Mar 3 | PreToolUse | Write\|Edit\|MultiEdit |
| `read-before-edit.js` | 1,499B | Mar 3 | PreToolUse | Edit\|MultiEdit |
| `plan-before-execute.js` | 2,001B | Mar 4 | PreToolUse | Write\|Edit\|MultiEdit |
| `subagent-context-enforcer.js` | 2,377B | Mar 3 | PreToolUse | Agent |
| `sdk-auth-subagent-enforcer.js` | 1,856B | Mar 4 | PreToolUse | Agent |
| `block-api-key-references.js` | 3,481B | Mar 4 | PreToolUse | Write\|Edit\|MultiEdit |
| `evidence-gate-reminder.js` | 1,425B | Mar 3 | PreToolUse | TaskUpdate |
| `validation-not-compilation.js` | 2,186B | Mar 3 | PostToolUse | Bash |
| `completion-claim-validator.js` | 1,687B | Mar 4 | PostToolUse | Bash |
| `dev-server-restart-reminder.js` | 1,408B | Mar 4 | PostToolUse | Edit\|Write\|MultiEdit |
| `skill-invocation-tracker.js` | 1,823B | Mar 4 | PostToolUse | Edit\|Write\|MultiEdit |
| `documentation-context-check.js` | 2,482B | Mar 4 | UserPromptSubmit | * |
| `skill-activation-forced-eval.js` | 2,272B | Mar 4 | UserPromptSubmit | * |
| `session-sdk-context.js` | 1,186B | Mar 4 | SessionStart | startup\|resume\|clear\|compact |
| `gsd-context-monitor.js` | 4,262B | Feb 28 | PostToolUse | Bash\|Edit\|Write\|MultiEdit |
| `gsd-statusline.js` | 4,040B | Feb 28 | PostToolUse | * |
| `gsd-check-update.js` | 2,079B | Feb 28 | SessionStart | * |

---

### 3. `block-test-files.js` — The Blocking Hook (Full Source)

**Real code from `/Users/nick/.claude/hooks/block-test-files.js`:**

```javascript
#!/usr/bin/env node
// PreToolUse hook: Block creation of test files, mock files, and stub files.
// Enforces the functional-validation mandate -- no test frameworks, no mocks.
//
// Matches: Write, Edit, MultiEdit
// Blocks if file_path matches test/mock/stub patterns.

const TEST_PATTERNS = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /_test\.go$/,
  /test_[^/]+\.py$/,
  /Tests?\.swift$/,
  /\.test\.py$/,
  /\/__tests__\//,
  /\/test\/.*\.(ts|js|tsx|jsx|py|go|swift)$/,
  /\.mock\.[jt]sx?$/,
  /\.stub\.[jt]sx?$/,
  /\/mocks\//,
  /\/stubs\//,
  /\/fixtures\//,
  /\/test-utils\//,
  /\.stories\.[jt]sx?$/,  // Storybook used as test substitute
];

// Allowlist -- paths that look like tests but aren't
const ALLOWLIST = [
  /e2e-evidence/,
  /validation-evidence/,
  /\.claude\//,
];
```

**The blocking response pattern:**
```javascript
const output = {
  decision: "block",
  reason: `BLOCKED: "${filePath}" matches a test/mock/stub file pattern.\n\n` +
    `FUNCTIONAL VALIDATION MANDATE: Never create test files, mock files, or stub files.\n` +
    `Instead: Build and run the real system. Validate through actual user interfaces.\n` +
    `Use skill: functional-validation for the correct protocol.`
};
```

**Hook firing statistics (single session `5368cad3` in sessionforge, 36MB):**
- `block-test-files.js`: fired **143 times**
- `read-before-edit.js`: fired **132 times**
- `validation-not-compilation.js`: fired **339 times**
- `plan-before-execute.js`: fired **143 times**
- `completion-claim-validator.js`: fired **339 times**
- `dev-server-restart-reminder.js`: fired **142 times**
- `subagent-context-enforcer.js`: fired **18 times**
- **Total hook firings in one session: 1,256+**

---

### 4. `read-before-edit.js` — Full Source

```javascript
#!/usr/bin/env node
// PreToolUse hook: When editing files, remind to read the FULL file first.
// Prevents skimming -- you must understand the complete file before modifying it.

const skipPatterns = [
  /package\.json$/,
  /\.lock$/,
  /\.json$/,
  /\.claude\//,
  /\.omc\//,
  /node_modules/,
];

const message =
  `Editing ${filePath}. Ensure you have:\n` +
  '- Read the FULL file (not just a snippet) -- use Read without offset/limit\n' +
  '- Understood the surrounding context and how this code connects to other modules\n' +
  '- Never skim -- if the file is large, read it in sections but read ALL of it';
```

---

### 5. `validation-not-compilation.js` — Full Source

```javascript
const BUILD_PATTERNS = [
  /\bnpm run build\b/, /\bbun run build\b/, /\byarn build\b/,
  /\bnext build\b/, /\btsc\b/, /\bgo build\b/, /\bcargo build\b/,
  /\bswift build\b/, /\bxcodebuild\b/, /\bmake\b/, /\bgcc\b/,
  /\bg\+\+\b/, /\bpython.*setup\.py\b/, /\bpip install\b/,
  /\bnpx tsc/, /\bbunx tsc/,
];

// Commands that ARE validation (don't warn on these)
const VALIDATION_PATTERNS = [
  /\bcurl\b/, /\bplaywright\b/, /\bxcrun simctl/,
  /\bnext dev\b/, /\bnpm run dev\b/, /\bbun run dev\b/,
  /localhost/, /screenshot/,
];

const message =
  'REMINDER: Compilation/build success is NOT functional validation. ' +
  'A successful build only proves the code compiles -- it does NOT prove the feature works. ' +
  'You MUST exercise the feature through the actual UI (Playwright MCP, curl, simulator) ' +
  'and capture evidence before claiming any task is complete.';
```

---

### 6. Skill Activation Hooks

**`skill-activation-forced-eval.js` (UserPromptSubmit):**

Fires on every user message except slash commands, greetings, git ops, and continuations. Injects:
```
SKILL CHECK: Before implementing, scan available skills.
Invoke any that match (even 1% chance).
Key: functional-validation, gate-validation-discipline, create-validation-plan, security-scan.
```

**`documentation-context-check.js` (UserPromptSubmit):**

Detects action-oriented messages (40+ action verbs matched) with 3+ words. Injects:
```
BEFORE IMPLEMENTING: (1) Think through the request step by step.
(2) If using a library/API, check Context7 MCP for current docs.
(3) Read full files before editing -- never skim.
```

**`plan-before-execute.js` (PreToolUse on Write/Edit/MultiEdit):**

Checks conversation context for planning signals: `/ralplan`, `/plan`, `planner.*agent`, `implementation plan`, `phase \d`. If no planning detected:
```
PLANNING CHECK: No planning phase detected in this session.
Consider /ralplan or /plan before writing source code.
Jumping to execution without planning is a recurring violation.
```

---

### 7. Evidence Gate Enforcement

**`evidence-gate-reminder.js` (PreToolUse on TaskUpdate status=completed):**
```
GATE VALIDATION CHECKPOINT -- Before marking this task complete, verify:
[ ] Did you PERSONALLY examine the evidence (not just receive a report)?
[ ] Did you VIEW screenshots and confirm their CONTENT (not just existence)?
[ ] Did you EXAMINE command output (not just exit codes)?
[ ] Can you CITE specific evidence for each validation criterion?
[ ] Would a skeptical reviewer agree this is complete?
```

**`completion-claim-validator.js` (PostToolUse on Bash):**

Detects build success output (`compiled successfully`, `build succeeded`, `exit code 0`, `Ready`) and checks conversation for Playwright/screenshot/browser evidence. If none:
```
BUILD SUCCESS ≠ VALIDATION. The code compiles, but has it been
exercised through the real UI?
```

**`subagent-context-enforcer.js` (PreToolUse on Agent):**

Checks if subagent prompt has file paths, code context, or is >30 words. Skips explore/plan agents. If lacking context:
```
SUBAGENT CONTEXT CHECK: This agent prompt appears to lack sufficient context.
Before delegating work to a subagent, ensure you have:
1. EXPLORED the relevant codebase area
2. PROVIDED specific file paths, function names, or code snippets
3. DESCRIBED the full context -- what exists, what needs to change, and why
```

---

### 8. Context Window Monitoring (GSD Hooks)

**`gsd-context-monitor.js`** — PostToolUse hook that reads context metrics from a bridge file:

```javascript
const WARNING_THRESHOLD = 35;  // remaining_percentage <= 35%
const CRITICAL_THRESHOLD = 25; // remaining_percentage <= 25%
const STALE_SECONDS = 60;      // ignore metrics older than 60s
const DEBOUNCE_CALLS = 5;      // min tool uses between warnings
```

Messages injected:
- WARNING: "Begin wrapping up current task. Do not start new complex work."
- CRITICAL: "STOP new work immediately. Save state NOW and inform the user that context is nearly exhausted. If using GSD, run /gsd:pause-work to save execution state."

**`gsd-statusline.js`** — Writes context metrics to `/tmp/claude-ctx-{session_id}.json` bridge file. Renders terminal progress bar:
```
████████░░ 80%   (orange - approaching limit)
██████░░░░ 60%   (yellow - caution)
████░░░░░░ 40%   (green - plenty of context)
💀 ██████████ 100%  (blinking red skull - critical)
```

Scales context display: 80% real usage = 100% displayed (because Claude Code enforces 80% context limit).

---

### 9. The `settings.json` Hook Configuration (Real)

**From `~/.claude/settings.json` — 8 hook event types, 21 total hooks:**

| Event Type | Hooks | Details |
|-----------|-------|---------|
| PreToolUse | 8 hooks | 6 matchers (Write/Edit, Edit, Agent, TaskUpdate, Bash/Glob/Grep/Read/Edit/Write, Write) |
| PostToolUse | 4 hooks | 3 matchers (Bash, Edit/Write/MultiEdit, Bash/Edit/Write/MultiEdit/NotebookEdit) |
| UserPromptSubmit | 4 hooks | dev-rules-reminder, usage-context-awareness, documentation-context-check, skill-activation-forced-eval |
| SessionStart | 2 hooks | session-init, session-sdk-context |
| SubagentStart | 2 hooks | subagent-init, team-context-inject |
| SubagentStop | 1 hook | cook-after-plan-reminder (Plan matcher) |
| TaskCompleted | 1 hook | task-completed-handler |
| TeammateIdle | 1 hook | teammate-idle-handler |
| Stop | 1 hook | plays `Submarine.aiff` sound on session end |

---

### 10. Rules Directory — The Nine Files

From `~/.claude/rules/`:

| File | Purpose | Key Enforcement |
|------|---------|----------------|
| `coding-style.md` | Immutability mandate, file size limits | "NEVER edit a file you haven't fully read" |
| `security.md` | No hardcoded secrets, mandatory checks | Pre-commit security checklist |
| `testing.md` | Functional validation mandate | "NEVER: write mocks, stubs, test doubles, unit tests" |
| `git-workflow.md` | Commit format, PR workflow | conventional commits, no AI references |
| `performance.md` | Model selection, sequential thinking | Haiku/Sonnet/Opus routing strategy |
| `agents.md` | Agent catalog, delegation rules | "NEVER spawn a subagent without context" |
| `patterns.md` | Explore before implementing | Repository pattern, skeleton projects |
| `hooks.md` | Complete hook documentation table | All 17 hooks documented with matchers |
| `development-workflow.md` | Feature implementation workflow | Skill-first, plan-first mandates |

---

### 11. CLAUDE.md as Living Document

**From session `5fc90d3e` — CLAUDE.md read 5 times, edited 2 times:**

Edit #1 — Backend Quick Start section update
Edit #2 — Gap Analysis Findings:
```
OLD: | Validation completion | INCOMPLETE |
     | Gate verification | NOT SYSTEMATICALLY DON...
NEW: | Validation completion | ✅ COMPLETED (Feb 4) |
     | Gate verification | ✅ ALL GATES P...
```

Agent commentary:
> "Update CLAUDE.md -- Capture the learnings"
> "The CLAUDE.md already has comprehensive gap analysis learnings. Let me add the new findings"
> "CLAUDE.md used as living learning capture document across sessions"

---

### 12. Defense in Depth Metrics

**Hook volume in largest sessions (ralph-orchestrator):**

| Session | Size | PreToolUse | PostToolUse | hook_progress | Total |
|---------|------|-----------|-------------|---------------|-------|
| `5fc90d3e` | 51MB | 2,070 | 3,712 | 6,049 | **11,831** |
| `dd20c1c1` | 42MB | 1,842 | 3,709 | — | **5,551** |
| `0a64430f` | 21MB | 2,083 | 3,381 | — | **5,464** |
| `e434de9a` | 26MB | 1,286 | 2,864 | — | **4,150** |
| `9a8663da` | 16MB | — | 2,661 | — | **2,661+** |

**Aggregate across ALL ralph-orchestrator sessions:**
- PreToolUse total: **21,437** hook events
- PostToolUse total: **42,720** hook events
- Grand total: **64,157+ hook events** across 132 sessions

**Named hook counts across all ralph-orchestrator sessions:**

| Hook | Fires | Purpose |
|------|-------|---------|
| `completion-claim-validator.js` | 105 | Catches build success without functional validation |
| `validation-not-compilation.js` | 105 | Reminds compilation != validation |
| `plan-before-execute.js` | 33 | Warns writing code without planning |
| `block-test-files.js` | 32 | BLOCKS test/mock/stub file creation |
| `read-before-edit.js` | 27 | Reminds to read full file before editing |
| `subagent-context-enforcer.js` | 8 | Context check on agent delegation |

**From post 7 draft:** "0.4 violations per session across 847 measured sessions"

---

## POST 8: RALPH ORCHESTRATOR — Evidence

### 1. ULTRAPILOT Mode — Parallel Autonomous Execution

**Real ULTRAPILOT command definition (from session `5fc90d3e`, line 13):**

```
[ULTRAPILOT ACTIVATED - PARALLEL AUTONOMOUS EXECUTION MODE]

You are now in ULTRAPILOT mode. This is a parallel autopilot that spawns
multiple workers with file ownership partitioning for maximum speed.

Your Mission:
1. Analysis      - Determine if task is parallelizable
2. Decomposition - Break into parallel-safe subtasks with file partitioning
3. Parallel Execution - Spawn up to 5 workers with exclusive file ownership
4. Integration   - Handle shared files sequentially
5. Validation    - Full system integrity check
```

**File Ownership Partitioning (real template):**
```
Worker 1: src/api/**     (exclusive)
Worker 2: src/ui/**      (exclusive)
Worker 3: src/db/**      (exclusive)
Worker 4: docs/**        (exclusive)
Worker 5: tests/**       (exclusive)
SHARED:   package.json, tsconfig.json (sequential)

Rule: No two workers can touch the same files
```

**Worker spawning pattern:**
```
Task(
  subagent_type="oh-my-claudecode:executor",
  model="sonnet",
  run_in_background=true,
  prompt="ULTRAPILOT WORKER [1/5]
  OWNED FILES: src/api/**
  TASK: [specific subtask]
  You have EXCLUSIVE ownership of these files.
  DO NOT touch files outside your ownership.
  Signal WORKER_COMPLETE when done."
)
```

**Mandatory delegation table:**
```
| Action           | YOU Do     | DELEGATE       |
|------------------|------------|----------------|
| Decompose task   | ✓          |                |
| Partition files  | ✓          |                |
| Spawn workers    | ✓          |                |
| Track progress   | ✓          |                |
| ANY code change  | ✗ NEVER    | executor workers |
```

**Path Exception:** "Only write to `.omc/`, `.claude/`, `CLAUDE.md`, `AGENTS.md`"

**State tracking:**
```json
{
  "active": true,
  "mode": "ultrapilot",
  "workers": [
    {"id": "w1", "status": "running", "files": ["src/api/**"], "task_id": "..."},
    {"id": "w2", "status": "complete", "files": ["src/ui/**"], "task_id": "..."}
  ],
  "shared_files": ["package.json", "tsconfig.json"],
  "phase": "parallel_execution"
}
```

**Real invocation (user voice transcript):**
> "So I'm not sure what the requirements are. You're supposed to use your memory search and go back and look at the last 10 days of work... do a gap analysis across all of them... find those gaps and then eventually come up with a plan with validation gates, again, with real evidence to actually finish this"

---

### 2. Hat-Based Execution (Rust Backend)

**Hat definition from `ralph-proto/src/hat.rs`:**

```rust
/// Unique identifier for a hat.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct HatId(String);

/// A hat (persona) that defines agent behavior.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Hat {
    pub id: HatId,
    pub name: String,
    pub description: String,
    pub subscriptions: Vec<Topic>,   // Topics this hat listens to
    pub publishes: Vec<Topic>,       // Topics this hat emits
    pub instructions: String,        // System prompt for this hat
}
```

**Hat emojis from `ralph-cli/src/display.rs`:**
```rust
pub fn hat_emoji(hat_id: &str) -> &'static str {
    match hat_id {
        "planner" => "🎯",
        "builder" => "🔨",
        "reviewer" => "🔍",
        _ => "🎩",
    }
}
```

**Iteration display with hat context:**
```
===============================================================================
 ITERATION 3 | 🔨 builder | 2m 34s elapsed | 3/10
===============================================================================
```

**Hat types observed across sessions:**

| Hat | Emoji | Evidence | Sessions |
|-----|-------|----------|----------|
| Reproducer | 🔍 | "analyze bugs, create failing tests" | smart-deer, prime-badger, smooth-rose, lucky-reed |
| Fixer | 🔨 | "Implements minimal fixes for reproduced bugs" | smart-deer, prime-badger, smooth-rose, clean-mint |
| Verifier | ✓ | `verification.passed` event emitted after fix | smart-deer, prime-badger |
| Reviewer | 🔍 | 15 mentions in clean-mint | clean-mint |
| Builder | 🔨 | "ITERATION 2 (builder hat)" | a701b909 |
| Planner | 🎯 | Hat flow coordination | 5fc90d3e, a701b909 |

**Event loop architecture (from `ralph-core/src/event_loop/mod.rs`):**
```rust
pub struct EventLoop {
    config: RalphConfig,
    registry: HatRegistry,           // All registered hats
    bus: EventBus,                   // Pub/sub messaging between hats
    state: LoopState,                // Current execution state
    instruction_builder: InstructionBuilder,
    ralph: HatlessRalph,             // The orchestrator without a hat
    skill_registry: SkillRegistry,
    robot_service: Option<Box<dyn RobotService>>,  // Human-in-the-loop
}
```

**Termination reasons showing loop self-awareness:**
```rust
pub enum TerminationReason {
    CompletionPromise,     // Task completed
    MaxIterations,         // Safety limit
    MaxRuntime,            // Time budget exceeded
    MaxCost,               // Token budget exceeded
    ConsecutiveFailures,   // Too many failures
    LoopThrashing,         // Repeated blocked events
    LoopStale,             // Same topic emitted 3+ times consecutively
}
```

**Event routing protocol (from smart-deer ACTIVE HAT document):**
- `repro.complete` -> Received by: Fixer
- `fix.complete` -> Received by: Verifier
- `verification.passed` -> Loop complete
- `verification.failed` -> Back to Reproducer (re-analyze)
- Events are "routing signals, not data transport"
- "You MUST use `ralph emit` to write events (handles JSON escaping correctly)"

**Real `ralph emit` commands from worktree sessions:**
```bash
# smart-deer (Reproducer -> Fixer -> Verifier flow)
ralph emit "repro.complete" "root_cause: SSE endpoint returns 404 when session exists
    in active_sessions but watcher not yet registered (race condition in async watcher
    registration)"

ralph emit "fix.complete" "SSE race condition fixed. stream_events() now polls up to 3s
    for watcher registration instead of returning 404"

ralph emit "verification.passed" "SSE race condition fix verified. POST /api/sessions
    followed by immediate GET /api/sessions/{id}/events returns HTTP 200"

ralph emit "LOOP_COMPLETE" "SSE bug fixed and verified"
```

---

### 3. GSD Framework Execution

**Session `98fd7d72` — 235 GSD references (highest of any session)**

**Real GSD execution phase display:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► EXECUTING PHASE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► VERIFYING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE 1 COMPLETE ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Phase 1 verification results (real table from session):**
```
| Check                                   | Result                              |
|-----------------------------------------|-------------------------------------|
| Upstream sync (main = upstream/main)    | ✓ Empty diff, merge commit present  |
| Three-way merge (Tunnel + Completions) | ✓ Both variants in ralph-cli        |
| Cargo test (2,460 passed, 0 failed)    | ✓ Live-verified by verifier         |
| iOS build (BUILD SUCCEEDED)            | ✓ xcodebuild exit 0                |
| SYNC-01 & SYNC-02 in REQUIREMENTS.md  | ✓ Both marked complete              |
```

**Key GSD insight from session:**
> "This pattern -- research predicts, executor verifies -- is the core value of the GSD workflow."

**GSD phase navigation commands:**
```bash
/gsd:plan-phase 2    # Plan next phase
/gsd:progress        # View overall milestone progress
/gsd:verify-work 1   # Re-verify a completed phase
/gsd:pause-work      # Save state when context is low
```

**GSD vs ULTRAPILOT distinction:**
- GSD = phase-based sequential execution with verification gates
- ULTRAPILOT = parallel worker spawning with file ownership
- Both can run together: "Both required skills (Ralph + Ultrawork) are now active"

---

### 4. RALPLAN Consensus Planning — Planner + Critic Adversarial Review

**851 RALPLAN references in session `5fc90d3e` (51MB, the largest ralph session)**

**Real RALPLAN invocation:**
```
/oh-my-claudecode:ralplan You need to spawn various sub-agents and actually
plan this out accordingly and correctly so that you have all the contacts
you need to.
```

**The RALPLAN Process (observed in session):**
```
[RALPLAN ACTIVATED - ITERATIVE PLANNING CONSENSUS MODE]
[RALPLAN Iteration 0/5] Initializing new planning session...
  -> Planner creates plan
  -> [RALPLAN] Plan ready, invoking Critic for review
  -> [RALPLAN] Critic verdict: REJECT
  -> [RALPLAN Iteration 2/5] Consulting Architect before Planner revision
  -> [RALPLAN Iteration 2/5] Spawning Planner with Architect guidance
  -> [RALPLAN] Plan revised, invoking Critic for review
  -> [RALPLAN] Critic verdict: OKAY
  -> RALPLAN Complete - Plan Approved
```

**Mandatory Critic step (from assistant reasoning):**
> "The Planner has created the plan. Now I MUST invoke the Critic before any approval (this is MANDATORY per ralplan protocol)"

**RALPLAN Consensus Result #1 — Catching 3 Critical Issues:**
> "Ralplan Consensus Achieved:
> - The iterative Planner -> Critic loop caught 3 critical issues that would have caused execution failure
> - Issue #1 (server binding) would have silently failed the iOS connection
> - Issue #2 (PID persistence) is a common shell scripting pitfall -- variables don't persist across subshells
> - The Critic's role as 'ruthless reviewer' prevented wasted execution time"

**RALPLAN Consensus Result #2 — Context-First Planning:**
> "This process used sequential thinking through 12 goals to gather rich context before spawning specialists. Three parallel explore agents gathered context from iOS code, Rust backend, and validation evidence simultaneously. The Planner then received this synthesized context (not raw prompts), and the Critic verified the plan meets all requirements. This 'context-first, then plan' approach prevents the common failure of planners working with insufficient information."

**Full RALPLAN plan output (SSE validation):**

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| 1. Environment Prep | 5 min | Server on LAN with `--bind-all` |
| 2. iOS App Setup | 5 min | App configured and connected |
| 3. Start Ralph Loop | 2 min | Real events flowing |
| 4. **10-Min Recording** | **10 min** | Video >= 600s (HARD GATE) |
| 5. Frame Extraction | 5 min | 600+ frames as proof |
| 6. UI/UX Audit | 10 min | 10-point aesthetic checklist |
| 7. Streaming Verify | 5 min | Timestamp uniqueness analysis |
| 8. Tool Call Analysis | 5 min | Error detection |
| 9. Final Report | 5 min | COMPREHENSIVE-10MIN-REPORT.md |

**Why the plan was rigorous (from RALPLAN summary):**
> "1. Duration Gate (Task 4.4): `exit 1` if video < 600 seconds -- prevents 53-second failure
> 2. Frame Count Math: 600 frames at 1fps = mathematical proof of 10 minutes
> 3. 5 Checkpoint Screenshots: Evidence at 2, 4, 6, 8, 10 minute marks
> 4. Previous Failures Documented: Lines 17-22 list exact durations that failed"

**User skepticism driving planning depth:**
> "I don't actually believe you. You need to actually do this... triple check and ensure that everything is properly working... go back, look at all the plans that you've written in the past... I guarantee you, I will find issues too"

---

### 5. Named Worktree Agents — 18 Adjective-Noun Worktrees

**All 18 named worktrees discovered (from `~/.claude/projects/-Users-nick-Desktop-ralph-orchestrator--worktrees-*/`):**

| # | Name | Session Size | Active |
|---|------|-------------|--------|
| 1 | brave-daisy | — | no sessions |
| 2 | **bright-maple** | 956K | 1 session |
| 3 | clean-mint | 144K | 1 session |
| 4 | **fair-fox** | 88K | 4 sessions (+ 3 agent sub-sessions) |
| 5 | fresh-cedar | — | no sessions |
| 6 | happy-finch | — | no sessions |
| 7 | jolly-pine | — | no sessions |
| 8 | **lucky-reed** | 352K | 1 session |
| 9 | **neat-elm** | 508K | 1 session |
| 10 | **prime-badger** | 404K | 1 session |
| 11 | **quick-lark** | 824K | 1 session |
| 12 | ready-iris | — | no sessions |
| 13 | **sleek-sparrow** | 532K | 1 session |
| 14 | **smart-deer** | 444K | 1 session |
| 15 | **smooth-rose** | 396K | 1 session |
| 16 | snappy-eagle | — | no sessions |
| 17 | **sunny-lotus** | 548K | 1 session |
| 18 | true-brook | — | no sessions |

**Pattern:** adjective-noun, all lowercase, hyphenated. 11 of 18 had active sessions.

**Naming convention:** Auto-generated by Claude Code worktree system. Each worktree is an isolated git checkout at `/Users/nick/Desktop/ralph-orchestrator/.worktrees/{name}/`.

**Worktree agent spawning:** Each agent received its task via a temp file:
```
Please read and execute the task in /var/folders/x9/.../T/.tmpDg6vWe
```

**Iteration counts across worktree sessions:**

| Worktree | Max Iteration | Task |
|----------|---------------|------|
| smart-deer | 14/100 | SSE race condition fix (full Reproducer->Fixer->Verifier) |
| smooth-rose | 13/100 | SSE bug reproduction |
| bright-maple | 11/100 | 6 RALPH LOOP stop hook fires |
| sunny-lotus | 11/100 | — |
| neat-elm | 11/100 | — |
| prime-badger | 10/100 | SSE race condition (parallel approach) |
| lucky-reed | 10/100 | JSON format ralph emit |
| sleek-sparrow | 9/100 | — |
| quick-lark | 8/100 | — |
| clean-mint | 5/100 | Simple hello world task |

**Average iterations per worktree session: ~10.2**

---

### 6. Ralph Loop Stop Hook Enforcement

**Actual stop hook content (from bright-maple worktree):**
```
Stop hook feedback:
[RALPH LOOP - ITERATION 6/100] Work is NOT done. Continue working.

Stop hook feedback:
[RALPH LOOP - ITERATION 7/100] Work is NOT done. Continue working.

Stop hook feedback:
[RALPH LOOP - ITERATION 8/100] Work is NOT done. Continue working.
...continues through ITERATION 11/100
```

- Stop hooks fire **30 times per session** (from `43392534` hook event counts)
- Pattern: "When FULLY complete (after Architect verification), run /oh-my-claudecode:cancel to cleanly exit ralph mode"
- Cancel invoked **15 times** across all sessions

**Ralph + Ultrawork combined mode (from `dd20c1c1`):**
> "Both required skills (Ralph + Ultrawork) are now active"
> "Ralph + Ultrawork active in both root and ios worktree"
> Clean shutdown: "All modes cancelled. Ralph (iteration 4/100) and Ultrawork cleanly shut down in both root and ios worktrees"

---

### 7. Ralph Loop Architecture

**State management per hat (from ACTIVE HAT document in smart-deer):**
- Scratchpad: `/path/.ralph/agent/scratchpad.md` -- thinking journal per objective
- Tasks: `ralph tools task add/list/ready/close` -- work items with priorities and dependencies
- Memories: `.ralph/agent/memories.md` -- persistent cross-iteration learning
- Decisions: `.ralph/agent/decisions.md` -- confidence-scored decisions (>80 proceed, 50-80 document, <50 safe default)

**Guardrails:**
1. Fresh context each iteration -- save learnings to memories for next time
2. Don't assume 'not implemented' -- search first
3. Backpressure is law -- tests/typecheck/lint/audit must pass
4. Confidence protocol: score decisions 0-100
5. Commit atomically -- one logical change per commit

**Event publishing rules:**
> "You MUST publish exactly ONE event when your work is complete"
> "Publishing hands off to the next hat and starts a fresh iteration with clear context"
> "You MUST stop working after publishing an event because a new iteration will start with fresh context"
> "You MUST NOT continue with additional work after publishing"

---

### 8. Session Scale Metrics

| Metric | Value |
|--------|-------|
| Total ralph-orchestrator sessions | 132 |
| Total worktree sessions | 16 (across 18 named worktrees) |
| Agent sub-sessions | 3 (in fair-fox) |
| Largest session | 54MB (`a701b909`, Feb 21) |
| Top 5 sessions combined | 222MB of JSONL data |
| Total hook events (all sessions) | 64,157+ |
| Unique hooks enforced | 17 |
| Unique skill invocations | 41 |
| Named worktrees | 18 (adjective-noun pattern) |
| Active worktree sessions | 11 |
| Average iterations per worktree | ~10.2 |
| Max iterations (smart-deer) | 14/100 |
| RALPLAN references (top session) | 851 |
| GSD references (top session) | 235 |
| Hat types observed | 6 |
| Ralph emit commands extracted | 15 |
| Cancel invocations | 15 |

---

## WAR STORIES

### War Story: Agent Failed Silently
> "First 01-01 executor agent failed silently -- executed directly as orchestrator"
-- GSD Phase 1 execution, session `98fd7d72`. The orchestrator had to step in and do the work itself when its spawned executor agent failed without reporting back.

### War Story: Missing Project File
> "01-02 required `xcodegen generate` to create missing project.pbxproj (auto-fixed)"
-- The upstream sync changed the project structure, and the iOS build required regenerating the Xcode project file. The agent detected and auto-fixed this.

### War Story: 53-Second vs 10-Minute Test
The RALPLAN plan documented previous failures:
> "Duration Gate (Task 4.4): `exit 1` if video < 600 seconds -- prevents 53-second failure"
-- A previous validation attempt only recorded 53 seconds instead of the required 10 minutes. The RALPLAN critic caught this.

### War Story: Skeptical User Improving Plan Quality
> "I don't actually believe you... triple check and ensure that everything is properly working... go back, look at all the plans that you've written in the past... I guarantee you, I will find issues too"
-- User frustration led to the most comprehensive RALPLAN plan: 9 phases, 52 minutes, frame-count mathematical proof.

### War Story: Compile vs Runtime Distinction
> "xcodebuild proves it compiles, but doesn't prove no runtime SwiftUI crashes or API contract regressions. The upstream sync changed internal types (BTreeMap for HatId, new Ord derives) which *shouldn't* affect the API surface, but could theoretically cause serialization differences."
-- The verifier correctly distinguished compile-time from runtime validation, requiring a manual app launch.

---

## CROSS-POST CONNECTIONS

### Governance Enables Orchestration
Post 7's 4-layer enforcement stack is what makes Post 8's Ralph orchestration reliable:
- CLAUDE.md sets the rules (no mocks, validate through UI)
- Hooks enforce them mechanically (block-test-files.js prevents test creation)
- Skills provide the workflow (functional-validation, ralplan)
- The RALPLAN Critic is itself a governance mechanism -- adversarial review before execution

### Hook Volume Proves System-Level Discipline
- **11,831 hook events** in the largest ralph session
- Every file write, every bash command, every agent spawn gets inspected
- The agent cannot bypass a `decision: "block"` response

### Named Worktrees Enable Parallel Governance
- 18 named worktrees, each with isolated file ownership
- Each worktree gets its own session, its own hooks, its own enforcement
- The parent orchestrator coordinates without touching files directly

---

## UNRESOLVED QUESTIONS

1. The "89% plan survival rate with adversarial review vs 34% without" statistic was not found verbatim in session data. May be in a different project or derived from aggregated analysis across the 8,481 sessions.
2. "Plan Verifier" and "Plan Challenger" as distinct named roles were not found as exact terms. The RALPLAN process uses "Planner" and "Critic" (which functions as the challenger). The "verifier" concept appears in GSD phase verification.
3. The "119 GSD references in one session" metric: actual highest count found was **235** in session `98fd7d72` (nearly double).
4. The "57 agents spawned" count needs verification -- only 3 agent sub-session JSONL files found, though many agents were spawned via Task tool within sessions (the task tool doesn't always create separate JSONL files).
5. The exact GSD reference count of 119 may refer to a different time window or a subset count.
