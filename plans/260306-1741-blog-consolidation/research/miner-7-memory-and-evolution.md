# Miner R7: Memory Systems and Tool Evolution

Evidence mined from Claude Code session JSONL files for posts 11, 12, 17, and 18.

---

## Post 11: Spec-Driven Development ("One YAML, Eight Agents, Complete App")

### Companion Repo: RepoNexus (`/Users/nick/Desktop/blog-series/reponexus/`)

#### YAML Spec Format (Real File)

Source: `/Users/nick/Desktop/blog-series/reponexus/examples/simple-app-spec.yaml`

```yaml
name: "task-tracker"
version: "1.0.0"
description: "A simple task tracking app to demonstrate spec-driven development"

components:
  shared-models:
    language: python
    type: library
    entry_point: "src/shared_models/__init__.py"
    build_command: "cd shared-models && pip install -e ."
    acceptance_criteria:
      - type: type-check
        description: "Type checking passes"
        command: "cd shared-models && python -m mypy src/"
      - type: contract
        description: "Model serialization round-trips"
        command: "cd shared-models && python -c 'from shared_models import Task; t = Task(title=\"test\"); assert t.to_dict()[\"title\"] == \"test\"'"

  api-service:
    language: python
    type: service
    depends_on:
      - shared-models
    run_command: "cd api-service && python -m uvicorn api_service.app:app --port 8000"
    acceptance_criteria:
      - type: integration
        description: "API health check responds 200"
        command: "curl -sf http://localhost:8000/health"
      - type: functional
        description: "Can create and retrieve a task"
        command: "curl -sf -X POST http://localhost:8000/tasks -H 'Content-Type: application/json' -d '{\"title\": \"Test task\"}' | python -c 'import sys,json; d=json.load(sys.stdin); assert d[\"title\"]==\"Test task\"'"

  web-frontend:
    language: typescript
    type: app
    depends_on:
      - api-service
    acceptance_criteria:
      - type: functional
        description: "App loads in browser without console errors"
        command: "echo 'Requires Playwright MCP validation'"

global_gates:
  - type: integration
    description: "All services communicate correctly"
  - type: functional
    description: "End-to-end user flow works"
```

#### Spec Parser (Real Code)

Source: `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/spec_parser.py`

- JSON Schema validation via `Draft7Validator`
- 5 language types: python, typescript, swift, rust, go
- 5 component types: library, service, cli, app, worker
- 4 acceptance criteria types: type-check, contract, integration, functional
- `AcceptanceCriterion` dataclass with type, description, command
- `ComponentSpec` with depends_on, build_command, run_command, entry_point
- `AppSpec` with components dict and global_gates tuple
- Dependency reference validation (catches unknown deps at parse time)
- `SpecValidationError` with JSON-path error messages

#### Dependency Graph (Real Code)

Source: `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/dependency_graph.py`

- Kahn's algorithm (topological sort) for build order
- `parallel_layers()` groups components into layers that can build simultaneously
- `CircularDependencyError` detection
- `transitive_dependencies()` for full dependency chain
- `BuildLayer` dataclass with layer_index and component tuple

#### Gate Evaluator (Real Code)

Source: `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/gate_evaluator.py`

- 4 gate types with severity levels: type-check(1), contract(2), integration(3), functional(4)
- `GateResult` with passed, output, error, duration_seconds
- `EvaluationReport` with pass_count/fail_count properties
- Commands run via `subprocess.run` with 120s timeout
- Output truncated to 2000 chars
- `evaluate_all()` produces per-component reports
- `aggregate_summary()` across all components

#### Phase Runner (GSD Framework)

Source: `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/phase_runner.py`

- 5 phases: DISCOVER -> PLAN -> EXECUTE -> VERIFY -> SHIP
- Each phase has entry_check, work, exit_gate callbacks
- max_retries per phase (default 2)
- Stops on first failure
- Context dict flows between phases

#### Session Evidence: Auto-Claude Task Factory (35+ Numbered Worktrees)

Source: Session `0ea2a1c3` in `~/.claude/projects/-Users-nick-Desktop-awesome-list-site/`

The awesome-list-site project had **35+ auto-claude worktrees** generated from specs, with numbered task names:
```
.auto-claude/worktrees/tasks/001-add-tags-admin-manager
.auto-claude/worktrees/tasks/001-batch-multi-repository-import
.auto-claude/worktrees/tasks/002-add-sharebutton-component-for-resources
.auto-claude/worktrees/tasks/003-add-bookmarks-export-feature
.auto-claude/worktrees/tasks/003-paginated-resource-browsing
...
.auto-claude/worktrees/tasks/108-analytics-usage-dashboard
.auto-claude/worktrees/tasks/113-add-rounded-corners-to-select-component-trigger
```
Task numbers go up to 113+, showing extensive automated task generation from YAML specs.

**710 references** to the `finish-auto-claude` spec in the session. Real spec task structure:
```
Spec: finish-auto-claude
Path: ./specs/finish-auto-claude/
Task index: 7

Current task from tasks.md:
- [ ] 2.2 Create generate-pr-body.sh utility
  - **Do**: 1. Create script to extract commit messages from branch...
  - **Files**: `scripts/generate-pr-body.sh`
  - **Done when**: Script generates conventional commit PR descriptions
  - **Verify**: `bash -n scripts/generate-pr-body.sh`
  - **Commit**: `feat(cleanup): add PR template generator`
```

#### ralph-specum Spec Lifecycle

The **ralph-specum skill** drove spec execution with explicit gated phases:
- `/ralph-specum:new` — Create spec from requirements
- `/ralph-specum:design` — Architecture and design
- `/ralph-specum:implement` — Execute implementation
- `/ralph-specum:review` — Code review

Each phase has a mandatory STOP gate preventing premature advancement:
```
**STOP HERE. DO NOT PROCEED TO IMPLEMENT.**
After the review is approved:
1. Display: -> Next: Run /ralph-specum:implement to start execution
2. End your response immediately
3. Wait for user to explicitly run /ralph-specum:implement
```

#### Other Session Evidence

The post references `.auto-claude/roadmap/roadmap.json` as the first real spec file, used for ILS iOS app with 8 agents building in parallel, completing in 3.2 days (down from 11 days manual).

---

## Post 12: Cross-Session Memory ("Making AI Remember")

### Production SQLite Database

Source: `/Users/nick/.claude-mem/claude-mem.db` (885 MB)

#### Corpus Statistics (Live Database)

| Metric | Value |
|--------|-------|
| Total observations | 36,563 |
| Session summaries | 1,931 |
| User prompts | 62,534 |
| Database size | 885 MB |
| Observer session files | 3,209 |
| Observer sessions total size | 2.7 GB |

#### Observations by Project

| Project | Count |
|---------|-------|
| ils-ios | 18,137 |
| ralph-orchestrator | 5,648 |
| sessionforge | 4,097 |
| yt-transition-shorts-detector | 2,220 |
| awesome-site | 1,093 |
| ai-digest | 1,074 |
| blog-series | 1,033 |
| ils | 718 |
| awesome-list-site | 594 |
| amplifier-ios | 547 |

#### Session Summaries by Project

| Project | Count |
|---------|-------|
| ils-ios | 845 |
| ralph-orchestrator | 412 |
| sessionforge | 169 |
| yt-transition-shorts-detector | 102 |
| awesome-site | 62 |

#### Production Schema (from live `claude-mem.db`)

7 tables, 3 FTS5 virtual tables, 6 triggers:

**`observations` table:**
```sql
CREATE TABLE observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_session_id TEXT NOT NULL,
    project TEXT NOT NULL,
    text TEXT,
    type TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    facts TEXT,
    narrative TEXT,
    concepts TEXT,
    files_read TEXT,
    files_modified TEXT,
    prompt_number INTEGER,
    discovery_tokens INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    created_at_epoch INTEGER NOT NULL,
    content_hash TEXT,
    FOREIGN KEY(memory_session_id) REFERENCES sdk_sessions(memory_session_id)
);
```

**`sdk_sessions` table:**
```sql
CREATE TABLE sdk_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_session_id TEXT UNIQUE NOT NULL,
    memory_session_id TEXT UNIQUE,
    project TEXT NOT NULL,
    user_prompt TEXT,
    started_at TEXT NOT NULL,
    started_at_epoch INTEGER NOT NULL,
    completed_at TEXT,
    completed_at_epoch INTEGER,
    status TEXT CHECK(status IN ('active', 'completed', 'failed')) NOT NULL DEFAULT 'active',
    worker_port INTEGER,
    prompt_counter INTEGER DEFAULT 0,
    custom_title TEXT
);
```

**`session_summaries` table:**
```sql
CREATE TABLE session_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_session_id TEXT NOT NULL,
    project TEXT NOT NULL,
    request TEXT,
    investigated TEXT,
    learned TEXT,
    completed TEXT,
    next_steps TEXT,
    files_read TEXT,
    files_edited TEXT,
    notes TEXT,
    prompt_number INTEGER,
    discovery_tokens INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    created_at_epoch INTEGER NOT NULL,
    FOREIGN KEY(memory_session_id) REFERENCES sdk_sessions(memory_session_id)
);
```

**`pending_messages` table (async processing queue):**
```sql
CREATE TABLE pending_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_db_id INTEGER NOT NULL,
    content_session_id TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK(message_type IN ('observation', 'summarize')),
    tool_name TEXT,
    tool_input TEXT,
    tool_response TEXT,
    cwd TEXT,
    last_user_message TEXT,
    last_assistant_message TEXT,
    prompt_number INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'processed', 'failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    ...
);
```

**FTS5 Full-Text Search (3 virtual tables):**
- `observations_fts` — searches title, subtitle, narrative, text, facts, concepts
- `session_summaries_fts` — searches request, investigated, learned, completed, next_steps, notes
- `user_prompts_fts` — searches prompt_text

**Auto-sync triggers:** INSERT/UPDATE/DELETE on observations, session_summaries, and user_prompts automatically update corresponding FTS indexes.

#### Companion Repo Schema

Source: `/Users/nick/Desktop/blog-series/claude-mem-architecture/src/claude_mem_architecture/core.py`

Simplified schema for the open-source companion:
```sql
CREATE TABLE observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    obs_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    context TEXT DEFAULT '',
    evidence TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    created_at TEXT NOT NULL,
    tokens TEXT DEFAULT ''
);

CREATE TABLE references (
    observer_id INTEGER NOT NULL,
    referenced_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (observer_id, referenced_id)
);
```

Features:
- TF-IDF cosine similarity search (zero external deps)
- Custom tokenizer with stop word removal
- `ObservationType` enum: DISCOVERY, ERROR, DECISION, PATTERN
- `PatternCluster` for tag-based semantic grouping
- WAL mode for concurrent access
- JSON export

#### MCP Memory Tool Usage (from sessions)

Session with highest MCP memory tool count: `f8138f8d` (50 calls)
Top sessions: 50, 34, 23, 20, 18, 15, 10, 10, 10, 8 calls

#### Sample Observation Records (from live DB)

```
36565|discovery|autonomous-coder Uses claude_code_sdk with Phase-Specific MCP Server Configuration
36564|discovery|autonomous-coder: Four-Phase Claude Code SDK Agent with Research, Explorer, Planner, Coder Architecture
36563|discovery|Two More Source Projects Found: autonomous-coder Python Agent and ccbios iOS App
36562|discovery|SessionForge Dashboard: Full App Inventory -- 95 API Routes, 7 Primary Nav Sections
36561|discovery|--dangerously-skip-permissions Used 414 Times Across Claude Memory Observer Sessions
```

#### Session Observation XML Format (from JSONL)

Real observation captured automatically in session `990173f4`:
```xml
<observation>
  <type>decision</type>
  <title>Multi-Agent iOS Chat App Audit Architecture Established</title>
  <subtitle>Three-agent Claude Code team created to audit full-stack iOS chat app with dual-mode streaming validation.</subtitle>
  <facts>
    <fact>Team consists of three roles: Lead (coordinator/CLI validator), Alpha (backend/functional validator), Bravo (UI/UX visual inspector).</fact>
    <fact>Each agent operates on a dedicated iOS Simulator instance: Audit-Lead, Audit-Alpha, Audit-Bravo (all iPhone 16 Pro).</fact>
    <fact>Consensus model requires all three agents to independently vote PASS on every validation gate before advancing.</fact>
  </facts>
  <concepts>
    <concept>pattern</concept>
    <concept>how-it-works</concept>
    <concept>why-it-exists</concept>
  </concepts>
</observation>
```

---

## Post 17: The CCB Evolution ("From Bash Script to Autonomous Builder")

### The run_claude_auto() Function (from Post Content + Sessions)

Source: `/Users/nick/Desktop/blog-series/posts/post-17-sequential-thinking-debugging/post.md` lines 31-87

```bash
run_claude_auto() {
    local phase="$1"
    local prompt="$2"
    local model="${3:-claude-opus-4}"
    local max_turns="${4:-30}"

    echo "=== Phase: $phase ==="
    echo "Model: $model | Max turns: $max_turns"

    save_state "$phase" "in_progress"

    result=$(echo "$prompt" | claude \
        --print \
        --model "$model" \
        --mcp-config .mcp.json \
        --allowedTools "Edit,Write,Bash,Glob,Grep,Read" \
        --dangerously-skip-permissions \
        --max-turns "$max_turns" \
        2>&1)

    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        save_state "$phase" "completed"
        echo "$result"
    else
        save_state "$phase" "failed"
        echo "FAILED: $result" >&2
        return 1
    fi
}
```

### State Management Functions

```bash
save_state() {
    local phase="$1"
    local status="$2"
    echo "{\"phase\": \"$phase\", \"status\": \"$status\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
        > ".ccb-state/${phase}.json"
}

load_state() {
    local phase="$1"
    if [ -f ".ccb-state/${phase}.json" ]; then
        cat ".ccb-state/${phase}.json"
    fi
}
```

### Evolution Timeline (from post content)

| Version | Lines | Key Feature |
|---------|-------|-------------|
| Prototype | 47 | Basic loop: prompt -> build -> check -> retry |
| Production v1 (`cc-ccb-builder-script-old.sh`) | 955 | 12 sequential phases, AI instructions file (389 lines) |
| Enhanced v3.0.0 | 2,081 | Multi-model routing, learning capability |
| Autonomous Coder | N/A | Phase-specific MCP servers, self-directed execution |

### Key Insights from Post

- First prototype cost $47 in one infinite loop
- The `ccb-ai-instructions.md` (389 lines) established the NO MOCKS / NO TEST FRAMEWORKS rule
- Dual model routing: Opus for complex analysis, Sonnet for implementation
- `--dangerously-skip-permissions` used 414 times across claude-mem-observer sessions (from observation #36561)
- `.ccb-state/` directory for phase resume capability

### Actual CCB Script Found

Source: `/Users/nick/Desktop/ccb/cc-ccb-builder-script-old.sh` (confirmed 955 lines)

The **actual `run_claude_auto()` function** from the real script (more flags than the post excerpt):
```bash
run_claude_auto() {
    local prompt="$1"
    local task_name="$2"

    local prompt_file=$(mktemp)
    echo "$prompt" > "$prompt_file"

    local allowed_tools="web_search,Edit,View,Write,Bash,str_replace,...,
        mcp__context7__*,mcp__memory__*,mcp__sequential-thinking__*,
        mcp__filesystem__*,mcp__git__*"

    local claude_cmd="claude"
    claude_cmd+=" --print"
    claude_cmd+=" --model $MODEL"
    claude_cmd+=" --mcp-config .mcp.json"
    claude_cmd+=" --allowedTools \"$allowed_tools\""
    claude_cmd+=" --dangerously-skip-permissions"
    claude_cmd+=" --output-format stream-json"
    claude_cmd+=" --verbose"
    claude_cmd+=" --max-turns 30"

    cat "$prompt_file" | eval $claude_cmd
}
```

Key differences from post excerpt:
- `--output-format stream-json` (machine-parseable output)
- `--verbose` flag for debugging
- `--allowedTools` includes MCP tool globs (context7, memory, sequential-thinking, filesystem, git)
- Inline MCP config setup creates `.mcp.json` with context7, memory, and sequential-thinking servers

**MCP config created inline by the bash script:**
```json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "sequential-thinking": { ... }
  }
}
```

**12 phase invocations** confirming the 12-phase architecture:
```
Phase 1:  "Initialize the Claude Code Builder Python CLI project"
Phase 2:  "/project:implement-phase Python Package Structure"
Phase 3:  "/project:implement-phase Core Models"
Phase 4:  "/project:implement-phase Logging System"
Phase 5:  "/project:implement-phase Context Management"
Phase 6:  "/project:implement-phase MCP Orchestration"
Phase 7:  "/project:implement-phase Spec Analyzer Agent"
Phase 8:  "/project:implement-phase Task and Instruction Agents"
Phase 9:  "/project:implement-phase Claude Code Executor"
Phase 10: "/project:implement-phase CLI Implementation"
Phase 11: "/project:implement-phase Functional Testing"
Phase 12: "/project:implement-phase Documentation and Finalization"
```

### Enhanced Builder (1,789 lines, Claude Code SDK)

Source: `/Users/nick/Desktop/ccbios-enhanced/claude-code-ios-builder-enhanced.py`

Uses **Claude Code SDK directly** (not CLI piping):
```python
from claude_code_sdk import query, ClaudeCodeOptions, AssistantMessage, TextBlock, UserMessage
```

Key enhancements over bash: memory integration at every step, vector database for code indexing, auto-resume with state detection, maximum turns (100) per phase, extended thinking, iPhone 16 Pro Max as default simulator.

Includes a **debug wrapper** that visualized every SDK message in real-time:
```python
async def debug_query(*args, **kwargs):
    async for msg in original_query(*args, **kwargs):
        if isinstance(msg, AssistantMessage):
            console.print(f"[bold green]Assistant Message #{message_counter}[/bold green]")
            for i, block in enumerate(msg.content):
                block_info = analyze_message_block(block, i)
                display_message_analysis(block_info)
        yield msg
```

### claude-code-builder Researcher (9,087 lines)

Source: `/Users/nick/Desktop/claude-code-builder/claude-code-builder-researcher.py`

Uses **Anthropic SDK directly** for knowledge-based research:
```python
class ResearchAgent:
    """Enhanced research agent using Anthropic SDK for knowledge-based analysis."""

    async def research(self, query, context):
        response = await self.anthropic.messages.create(
            model=self.research_model,
            max_tokens=4096,
            temperature=0.1,  # Lower temperature for factual research
            messages=[{"role": "user", "content": research_prompt}]
        )
```

**Dual model routing** in the builder:
```python
DEFAULT_ANALYZER_MODEL = "claude-opus-4-20250514"   # Complex analysis
DEFAULT_EXECUTOR_MODEL = "claude-opus-4-20250514"   # Implementation
```

Total lines across claude-code-builder: 21,814 (9,087 researcher + 1,908 functional + 453 fixes + supporting files).

### CCB Repos Found

| Path | Status |
|------|--------|
| `/Users/nick/Desktop/ccb/cc-ccb-builder-script-old.sh` | Original 955-line bash script |
| `/Users/nick/Desktop/ccb/ccb-ai-instructions.md` | 389-line AI instructions |
| `/Users/nick/Desktop/ccbios-enhanced/claude-code-ios-builder-enhanced.py` | 1,789-line SDK builder |
| `/Users/nick/Desktop/claude-code-builder/claude-code-builder-researcher.py` | 9,087-line researcher |
| `/Users/nick/.auto-claude/memories/auto_claude_memory` | 699 MB SQLite database |

### CLI Examples in Companion Repo

Source: `/Users/nick/Desktop/blog-series/claude-code-monorepo/cli-examples/`

**hat-rotation.sh** (98 lines) — 4-phase hat rotation using `claude -p`:
1. Planner Hat: `claude -p "You are wearing the PLANNER hat..."`
2. Builder Hat: `claude -p "You are wearing the BUILDER hat..."`
3. Reviewer Hat: `claude -p "You are wearing the REVIEWER hat..."`
4. Fixer Hat: conditional, only if CRITICAL/HIGH issues found

**worktree-parallel.sh** (75 lines) — Parallel CLI sessions across git worktrees:
- Creates worktree per task with `git worktree add -b`
- Spawns `claude -p` in background per worktree
- Waits for all PIDs, reports results
- Cleanup trap removes worktrees on exit

---

## Post 18: SDK vs CLI ("When Each Approach Wins")

### SDK Examples (Real Code)

Source: `/Users/nick/Desktop/blog-series/claude-code-monorepo/sdk-examples/`

**basic-agent.ts** — Direct Anthropic SDK usage:
```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "read_file",
    description: "Read the contents of a file at the given path",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Absolute file path to read" },
      },
      required: ["path"],
    },
  },
];

async function runAgent(prompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock ? textBlock.text : "";
    }
    // ... tool call handling loop
  }
}
```

**multi-agent-pipeline.ts** — 3-role pipeline (Planner -> Implementer -> Reviewer):
```typescript
const roles: AgentRole[] = [
  { name: "planner", systemPrompt: "You are a planning agent..." },
  { name: "implementer", systemPrompt: "You are an implementation agent..." },
  { name: "reviewer", systemPrompt: "You are a code review agent..." },
];

async function runPipeline(featureRequest: string): Promise<PipelineResult[]> {
  const plan = await runAgent(roles[0], featureRequest);
  const implementation = await runAgent(roles[1], `Implement the following plan:\n\n${plan}`);
  const review = await runAgent(roles[2], `Review the following implementation:\n\n${implementation}`);
  return results;
}
```

**batch-processor.ts** — Concurrent batch processing with token counting:
```typescript
async function processBatch(
  items: BatchItem[],
  instruction: string,
  concurrency: number = 5
): Promise<BatchResult[]> {
  const queue = [...items];
  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const item = queue.shift();
      const result = await processItem(item, instruction);
      results.push(result);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
}
```
- Tracks `tokensUsed` per item: `response.usage.input_tokens + response.usage.output_tokens`

### CLI Examples (Real Code)

**hat-rotation.sh** — Phase-based CLI with `claude -p`:
```bash
PLAN=$(claude -p "You are wearing the PLANNER hat. Your only job is to plan, not implement. Feature request: ${FEATURE}...")
BUILD_OUTPUT=$(claude -p "You are wearing the BUILDER hat. Your only job is to implement, not plan or review. Implementation plan: ${PLAN}...")
REVIEW=$(claude -p "You are wearing the REVIEWER hat. Your only job is to find problems, not fix them...")
```

**worktree-parallel.sh** — Parallel CLI across worktrees:
```bash
claude -p "You are working in a git worktree. Complete this task: ${task}" > "$result_file" 2>&1
```

### SessionForge Hybrid Pattern (from Session Evidence)

Source: SessionForge dashboard session `d8ef7be1` (1.9 MB)

From observation in SessionForge sessions:
- **SDK Auth Inheritance**: "When running inside a Claude Code context, the SDK spawns subprocesses that inherit `process.env`, which includes CLI auth credentials"
- **CLAUDECODE=1 Env Var Management**: `agent-env.ts` strips/manages CLAUDECODE env var for subprocess spawning
- **7-Dimension Weighted Insight Scoring**: Novelty (3x), Tool/Pattern Discovery (3x), Failure+Recovery (3x), Before/After (2x), Visual Potential (2x), Reproducibility (1x), Scale (1x). Max composite: 75. Publishing threshold >= 28.
- **InsightScores interface** (from session JSONL):
```typescript
export interface InsightScores {
  novelty: number;
  tool_discovery: number;
  before_after: number;
  failure_recovery: number;
  reproducibility: number;
  scale: number;
}

function computeComposite(scores: InsightScores): number {
  const raw =
    scores.novelty * 3 +
    scores.tool_discovery * 3 +
    scores.before_after * 2 +
    scores.failure_recovery * 3 +
    scores.reproducibility * 1 +
    scores.scale * 1;
  return Math.min(raw, 65);
}
```

### autonomous-coder: Full SDK Agent Package

Source: `/Users/nick/Desktop/autonomous-coder/`

A complete 4-phase autonomous coding agent using **claude_code_sdk** (Python SDK, not raw Anthropic API):

```python
# client.py — uses Claude Code SDK, NOT raw Anthropic API
from claude_code_sdk import ClaudeCodeOptions, query
from claude_code_sdk.types import (
    AssistantMessage, ContentBlock, ResultMessage,
    TextBlock, ToolResultBlock, ToolUseBlock,
)
```

**4-phase architecture** (different from the bash ccb phases — this is the autonomous version):
```python
class AutonomousCoderAgent:
    """
    1. Research phase: Discovers MCP servers, skills, resources via web research
    2. Explorer phase: Analyzes codebase structure and context
    3. Planner phase: Creates implementation plan with atomic tasks
    4. Coder phase: Implements each task iteratively
    """
    def __init__(self, project_path, model="claude-sonnet-4-20250514",
                 max_iterations=10, sandbox_enabled=True, auto_commit=True):
        self.client = create_client(project_path=self.project_path,
                                     model=model, sandbox_enabled=sandbox_enabled)
```

**Defense-in-depth security** with bash command allowlisting (60+ allowed commands):
```python
ALLOWED_COMMANDS = {
    "npm", "npx", "yarn", "pnpm", "bun",       # Package managers
    "pip", "pip3", "pipx", "poetry", "uv",       # Python package managers
    "git",                                         # Version control
    "make", "cmake", "ninja",                      # Build tools
    "node", "python", "python3", "swift",          # Runtimes
    "eslint", "prettier", "black", "ruff",         # Linters
    "jest", "vitest", "pytest",                    # Test runners
    ...
}
```

This is the strongest evidence for the SDK side of the decision framework:
- SDK gives **precise security control** (command allowlisting per-agent)
- SDK gives **phase-specific MCP servers** (Research gets Firecrawl+Context7, Explorer gets Serena, etc.)
- SDK gives **iteration control** (max_iterations per task)

### SDK vs CLI Decision Framework (from post content)

- SDK: "Direct API access means you control every token. No overhead from system prompts, hook evaluation, skill loading, or MCP server startup."
- CLI: "File operations that handle conflicts. MCP servers for external tools. Skills for reusable workflows. Hooks for enforcement. Built-in code search."
- "The SDK is a library. The CLI is a runtime."
- Same feature built both ways: "SDK version took 3x the code and cost 40% less"

---

## Metrics Summary

| Metric | Value | Source |
|--------|-------|--------|
| **Post 11** | | |
| RepoNexus source files | 6 Python + 1 YAML example | `/Users/nick/Desktop/blog-series/reponexus/` |
| Spec schema fields | 5 languages, 5 component types, 4 gate types | `spec_parser.py` |
| Phase runner phases | 5 (Discover -> Plan -> Execute -> Verify -> Ship) | `phase_runner.py` |
| Auto-claude worktrees | 35+ (numbered 001-113) | Session `0ea2a1c3` awesome-list-site |
| ralph-specum spec references | 710 (finish-auto-claude) | Same session |
| ralph-specum lifecycle phases | 4 (new -> design -> implement -> review) | Same session |
| **Post 12** | | |
| Production observations | 36,563 | `/Users/nick/.claude-mem/claude-mem.db` |
| Session summaries | 1,931 | claude-mem.db |
| User prompts indexed | 62,534 | claude-mem.db |
| Database size | 885 MB | claude-mem.db |
| Observer session files | 3,209 | `~/.claude/projects/-Users-nick--claude-mem-observer-sessions/` |
| Observer corpus size | 2.7 GB | same |
| Top project (observations) | ils-ios: 18,137 | claude-mem.db |
| FTS5 virtual tables | 3 (observations, summaries, prompts) | claude-mem.db schema |
| Auto-sync triggers | 6 (INSERT/UPDATE/DELETE x 2 tables) | claude-mem.db schema |
| **Post 17** | | |
| CCB v1 script | 955 lines | `cc-ccb-builder-script-old.sh` |
| CCB v3 enhanced builder | 1,789 lines | `/Users/nick/Desktop/ccbios-enhanced/claude-code-ios-builder-enhanced.py` |
| claude-code-builder researcher | 9,087 lines | `/Users/nick/Desktop/claude-code-builder/claude-code-builder-researcher.py` |
| claude-code-builder total | 21,814 lines | All files in `/Users/nick/Desktop/claude-code-builder/` |
| AI instructions file | 389 lines | `/Users/nick/Desktop/ccb/ccb-ai-instructions.md` |
| First prototype | 47 lines | Initial bash loop |
| hat-rotation.sh | 98 lines | `/Users/nick/Desktop/blog-series/claude-code-monorepo/cli-examples/` |
| worktree-parallel.sh | 75 lines | same |
| --dangerously-skip-permissions usage | 414 times | grep across observer sessions |
| auto_claude_memory DB | 699 MB | `/Users/nick/.auto-claude/memories/` |
| **Post 18** | | |
| SDK examples | 3 TypeScript files | `claude-code-monorepo/sdk-examples/` |
| CLI examples | 2 bash files | `claude-code-monorepo/cli-examples/` |
| basic-agent.ts | 81 lines | Tool-use agentic loop |
| multi-agent-pipeline.ts | 95 lines | 3-role sequential pipeline |
| batch-processor.ts | 85 lines | Concurrent batch with token tracking |
| autonomous-coder package | 5 Python files | `/Users/nick/Desktop/autonomous-coder/` |
| SessionForge sessions | 236 JSONL files, 85.7 MB largest | `~/.claude/projects/-Users-nick-Desktop-sessionforge/` |
| SDK cost per call | $0.002-0.01 | Post-18 content |
| CLI cost per call | $0.05-0.15 | Post-18 content |

---

## Key File Paths

| File | Relevance |
|------|-----------|
| `/Users/nick/.claude-mem/claude-mem.db` | Production observation store (885 MB, 36K observations) |
| `/Users/nick/Desktop/blog-series/claude-mem-architecture/src/claude_mem_architecture/core.py` | Open-source companion: ObservationStore class |
| `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/spec_parser.py` | YAML spec parser with JSON schema validation |
| `/Users/nick/Desktop/blog-series/reponexus/examples/simple-app-spec.yaml` | Example 3-component app spec |
| `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/gate_evaluator.py` | 4-type acceptance criteria evaluator |
| `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/dependency_graph.py` | Kahn's algorithm topological sort |
| `/Users/nick/Desktop/blog-series/reponexus/src/reponexus/phase_runner.py` | GSD 5-phase pipeline runner |
| `/Users/nick/Desktop/blog-series/claude-code-monorepo/sdk-examples/basic-agent.ts` | Anthropic SDK agentic loop |
| `/Users/nick/Desktop/blog-series/claude-code-monorepo/sdk-examples/multi-agent-pipeline.ts` | 3-role SDK pipeline |
| `/Users/nick/Desktop/blog-series/claude-code-monorepo/sdk-examples/batch-processor.ts` | Concurrent batch with token counting |
| `/Users/nick/Desktop/blog-series/claude-code-monorepo/cli-examples/hat-rotation.sh` | 4-hat CLI rotation pattern |
| `/Users/nick/Desktop/blog-series/claude-code-monorepo/cli-examples/worktree-parallel.sh` | Parallel CLI across worktrees |
| `/Users/nick/.claude/projects/-Users-nick--claude-mem-observer-sessions/990173f4*.jsonl` | Largest observer session (52 MB, 405 memory hits) |
| `/Users/nick/.claude/projects/-Users-nick-Desktop-sessionforge/fc444b36*.jsonl` | Largest SessionForge session (85.7 MB, 546 memory hits) |
| `/Users/nick/.claude/projects/-Users-nick-Desktop-awesome-list-site/0ea2a1c3*.jsonl` | 35 auto-claude worktrees, ralph-specum spec execution |
| `/Users/nick/.auto-claude/memories/auto_claude_memory` | CCB auto-claude memory DB (699 MB) |
| `/Users/nick/Desktop/ccb/cc-ccb-builder-script-old.sh` | Original 955-line bash ccb script |
| `/Users/nick/Desktop/ccb/ccb-ai-instructions.md` | 389-line AI instructions |
| `/Users/nick/Desktop/ccbios-enhanced/claude-code-ios-builder-enhanced.py` | 1,789-line SDK-based enhanced builder |
| `/Users/nick/Desktop/claude-code-builder/claude-code-builder-researcher.py` | 9,087-line researcher with Anthropic SDK |
| `/Users/nick/Desktop/autonomous-coder/agent.py` | 4-phase autonomous agent orchestrator |
| `/Users/nick/Desktop/autonomous-coder/client.py` | claude_code_sdk client with security config |
| `/Users/nick/Desktop/autonomous-coder/security.py` | Bash command allowlisting (60+ commands) |
| `/Users/nick/Desktop/blog-series/posts/post-17-sequential-thinking-debugging/post.md` | Post 17 with run_claude_auto() source |
| `/Users/nick/Desktop/blog-series/posts/post-18-full-stack-orchestration/post.md` | Post 18 with SDK vs CLI framework |
