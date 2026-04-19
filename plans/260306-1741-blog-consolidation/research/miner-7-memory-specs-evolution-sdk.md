# Miner 7: Memory, Specs, Evolution, SDK — Session Mining Report

**Posts covered:** 11 (Spec-Driven), 12 (Memory Architecture), 17 (CCB Evolution), 18 (SDK vs CLI)
**Sources mined:** claude-mem-observer (20 sessions, 52MB largest), Auto-Claude (10 sessions), ils-ios (5 sessions, 338MB largest), yt-transition-shorts-detector (3 sessions), companion repos (5 repos)
**Date:** 2026-03-06

---

## Post 11: Spec-Driven Execution Evidence

### Specs Found
- `roadmap.json` / `ROADMAP.md` — the ILS iOS project used `.planning/ROADMAP.md` as the executable spec
- `gsd-tools.cjs` — the GSD (Get Stuff Done) framework CLI tool, located at `/Users/nick/.claude/get-shit-done/bin/gsd-tools.cjs`
- Workflow files at `/Users/nick/.claude/get-shit-done/workflows/` including `insert-phase.md`, `new-project.md`
- Templates at `/Users/nick/.claude/get-shit-done/templates/requirements.md`
- References at `/Users/nick/.claude/get-shit-done/references/questioning.md`, `ui-brand.md`

### GSD Execution Commands Found (from ils-ios sessions)
- `/gsd:insert-phase <after> <description>` — insert a phase into the roadmap
- `/gsd:quick --full` — quick task execution with full audit orchestration
- `/gsd:new-project` — initialize project with roadmap, requirements, state
- `/gsd:plan-phase 1` — plan and execute specific phase
- `gsd-tools init new-project` — CLI init command

### GSD Init Output (real session data)
```
project_exists: false (good - can create)
is_brownfield: true (existing code detected)
needs_codebase_map: true (no codebase map exists)
has_git: true
planning_exists: true (.planning/ directory exists from Quick Task 4)
```

### Phase Execution Examples
The ils-ios session (62115115, 338MB, largest session in entire project) shows a massive cross-platform audit using GSD:
- **30 validation gates** across phases
- **5 implementation streams** running in parallel
- **4 platform targets** (iPhone, iPad, Mac, macOS)
- User directive: "autonomous execution — after plan, execute; after execute, verify; after verify, move on. Always at least three teammates working on three portions at once."
- Session continued across **multiple context resets** (at least 5 compaction events visible)
- GSD planning infrastructure created: `.planning/PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`
- 3 parallel research agents launched initially
- **Result:** iOS builds PASS, macOS builds initially FAIL (pipe buffer deadlock — classic pattern)

### Companion Repo: reponexus
- `spec_parser.py` — YAML spec loader with JSON Schema validation (Draft7Validator)
- Schema defines: `name`, `version`, `components` (with `language`, `type`, `depends_on`, `acceptance_criteria`, `build_command`, `run_command`, `entry_point`)
- `AcceptanceCriterion` types: `type-check`, `contract`, `integration`, `functional`
- `phase_runner.py` — GSD phase machine: Discover → Plan → Execute → Verify → Ship
- Each phase has `entry_check`, `work` callable, `exit_gate`, `max_retries`
- Phase pipeline stops on first failure, retries configurable per phase
- `dependency_graph.py`, `agent_scheduler.py`, `gate_evaluator.py` — full execution framework

### Key Insight for Post
The GSD workflow was used across 60,870+ lines of session data for a single ILS iOS audit. The spec-driven approach enabled autonomous multi-day execution across context resets because the ROADMAP.md persisted as ground truth independent of any session's memory.

---

## Post 12: Memory Architecture Evidence

### Memory Tool Usage (across all claude-mem-observer sessions)

**MCP Tool Calls Found:**
- `mcp__plugin_claude-mem_mcp-search__search` — primary semantic search tool, used extensively in SessionForge sessions
  - Parameters: `query` (string), `limit` (int), `project` (string filter)
  - Returns: observation IDs with titles, timestamps, read-cost estimates, file context
  - Example query: `"sessionforge visualization velocity dashboard agent"` → 26 results (20 obs, 6 sessions, 0 prompts)
  - Example query: `"devlog-publisher visual generation diagram mermaid"` → 14 results (10 obs, 3 sessions, 1 prompts)

- `mcp__plugin_episodic-memory_episodic-memory__search` — cross-project episodic search
  - Parameters: `query` (array of concept strings), `limit` (int)
  - Returns: conversations matching ALL concepts with match percentages
  - Example: `["sessionforge", "dashboard features"]` → 3 conversations, -5% to -6% avg match
  - Sources from `/Users/nick/.config/superpowers/conversation-archive/` JSONL files

- `ToolSearch` — internal Claude tool discovery
  - Example: `"+claude-mem search"` → matches `mcp__plugin_claude-mem_mcp-search__search`, `smart_search`, `____IMPORTANT`
  - Reports `total_deferred_tools: 254`

**State Persistence Tools:**
- `state_write`: 48 calls across sessions
- `state_list_active`: 18 calls
- `state_read`: 15 calls
- `state_get_status`: 9 calls
- `state_clear`: 9 calls

### Observer Architecture (real session evidence)
The claude-mem-observer uses a **queue-based architecture**:
- Operations: `enqueue`, `dequeue`, `remove`
- Each queue entry contains an `<observed_from_primary_session>` XML block
- Fields: `<what_happened>`, `<occurred_at>`, `<working_directory>`, `<parameters>`, `<outcome>`
- Observer session CWD: `/Users/nick/.claude-mem/observer-sessions`
- Observer runs as separate Claude process (PID visible in lsof output, version 2.1.63)
- TCP connections to Anthropic API visible in file descriptors

### Observation XML Format (real output)
```xml
<observation>
  <type>[ bugfix | feature | refactor | change | discovery | decision ]</type>
  <!-- 6 observation types, matching ObservationType enum in companion repo -->
</observation>
```

### Claude-Mem Observer System Prompt (verbatim excerpts)
- "CRITICAL: Record what was LEARNED/BUILT/FIXED/DEPLOYED/CONFIGURED, not what you (the observer) are doing."
- "SPATIAL AWARENESS: Tool executions include the working directory (tool_cwd)"
- "Focus on deliverables and capabilities: What the system NOW DOES differently"
- Good examples: "Authentication now supports OAuth2 with PKCE flow"
- Bad examples: "Analyzed authentication implementation and stored findings"
- Skip: empty status checks, package installations, simple file listings

### Companion Repo: claude-mem-architecture
- `core.py` (331 lines) — full implementation:
  - `ObservationType` enum: DISCOVERY, ERROR, DECISION, PATTERN
  - `Observation` dataclass: id, session_id, obs_type, title, content, context, evidence, tags, created_at, referenced_by
  - `ObservationStore` class: SQLite with WAL journal mode
  - Schema: `observations` table (id, session_id, obs_type, title, content, context, evidence, tags, created_at, tokens) + `references` table (observer_id, referenced_id)
  - Indexes: `idx_obs_session`, `idx_obs_type`, `idx_obs_created`
  - **TF-IDF semantic search** — zero external dependencies, pure Python:
    - `_tokenize()` with stop word removal
    - `_term_frequency()` for TF calculation
    - `_cosine_similarity()` for vector comparison
    - Full IDF computation across corpus
    - Threshold-based filtering (default 0.1)
  - `search_by_tags()` — tag-based retrieval
  - `analyze_patterns()` — tag-based clustering with reference counting
  - `export_json()` — full corpus export
- `cli.py` (83 lines): `record`, `search`, `patterns`, `stats`, `export` commands
- README stats: 14,391 total observations, 23 recurring mistake categories, 3.2x resolution speedup, <50ms search latency, 0.7 similarity threshold, 73% precedent coverage

### Key Insight for Post
The observer is a **separate Claude process** running concurrently with the primary session, connected via queue operations. It watches tool executions in real-time and generates structured observations. The 3-layer search workflow (search → timeline → get_observations) minimizes token usage by filtering before fetching full details.

---

## Post 17: CCB Evolution Evidence

### Builder Generations Found

**Generation 1: ccb Bash Script**
- Post already contains: "47 lines of bash" growing to "955 lines"
- `cc-ccb-builder-script-old.sh` — 12 sequential phases
- `ccb-ai-instructions.md` — 389 lines, the genesis document containing "NO UNIT TESTS / NO TEST FRAMEWORKS / NO MOCKS / Only functional validation"
- No session files found for this era (pre-session-logging)

**Generation 2: Auto-Claude Electron App**
From Auto-Claude sessions (96d89106, 2.2MB, largest):
- **19 Zustand stores** in renderer:
  1. `task-store.ts` — Task/spec management and kanban board
  2. Plus 18 others covering project, terminal, settings, etc.
- **IPC Architecture:** 329 `ipcMain.handle()` registrations across 20+ handler files:
  - `linear-handlers.ts`, `context-handlers.ts`, `debug-handlers.ts`, `file-handlers.ts`
  - `IPC_CHANNELS` constant file: 596 lines of channel definitions
  - Domains: project, terminal, context, debug, file, github, linear, app-update
- **Handler files found:**
  - `apps/frontend/src/main/ipc-handlers/app-update-handlers.ts`
  - `apps/frontend/src/main/ipc-handlers/context-handlers.ts`
  - `apps/frontend/src/main/ipc-handlers/debug-handlers.ts`
  - `apps/frontend/src/main/ipc-handlers/file-handlers.ts`
  - Plus ~16 more handler modules
- **XState state machines** used for complex UI workflows
- Version: v2.7.6 at time of sessions

**Generation 3: Mobile Spec Generation (Electron → Mobile)**
The Auto-Claude session shows the transition from Electron to mobile:
- 4 parallel exploration agents launched:
  1. "Explore IPC channels & handlers" — mapped all 200+ IPC channels
  2. "Explore stores & state machines" — inventoried 19 Zustand stores
  3. "Explore backend API surface" — mapped Python backend capabilities
  4. "Explore shared types & design" — shared type definitions
- **Two specifications generated in parallel:**
  - `spec-a-react-native-expo.md` — 2,870 lines (124KB), Expo SDK 52, Expo Router, Zustand + React Query
  - `spec-b-swiftui-native.md` — 5,117 lines (164KB), native SwiftUI with NavigationStack/NavigationSplitView
  - `api-gateway-design.md` — 635 lines (40KB), mapping 596 IPC channels to REST+WebSocket
- **Channel mapping:** 380 REST + 120 WebSocket + 96 Electron-only excluded
- **17 screen wireframes** per spec with ASCII wireframes, component hierarchies, gestures, accessibility
- **4 XState machine ports** to mobile
- Both specs generated by parallel `claude-opus-4-6` agents
- Total output: 8,695 lines across 4 documents

### Evolution Timeline (from sessions)
1. **ccb bash script** (May 2025) — 47→955 lines, `ccb-ai-instructions.md` genesis
2. **Auto-Claude Electron** (Jan-Feb 2026) — Full desktop app with 19 stores, 329 IPC handlers, 596 channels
3. **Mobile specs** (Mar 4, 2026) — Parallel spec generation for React Native + SwiftUI, driven by 4 codebase exploration agents
4. **Claude Code CLI** (current) — The builder itself became unnecessary as Claude Code CLI absorbed the capabilities

### Key Insight for Post
The ccb-ai-instructions.md file is the Rosetta Stone — written 10 months before the blog series, it contains the functional validation mandate that governs all current work. The evolution from bash→Electron→specs→CLI shows each generation teaching a lesson: bash taught validation rules, Electron taught IPC abstraction, specs taught executable contracts, and CLI taught that the builder should be the tool itself.

---

## Post 18: SDK vs CLI Evidence

### SDK Usage (from companion repo and sessions)

**claude-code-monorepo SDK examples:**
- `basic-agent.ts` — Direct `@anthropic-ai/sdk` import, `Anthropic.Tool[]` array, manual tool loop:
  ```typescript
  import Anthropic from "@anthropic-ai/sdk";
  const client = new Anthropic();
  // Manual while(true) loop checking stop_reason === "end_turn"
  // Manual toolUse extraction and result construction
  ```
- `multi-agent-pipeline.ts` — 3-agent sequential pipeline (planner → implementer → reviewer):
  - Each agent gets a `systemPrompt` and runs via `client.messages.create()`
  - Pipeline chains output from each stage to the next
  - Model: `claude-sonnet-4-20250514`
- `batch-processor.ts` — batch processing patterns

**SDK patterns found in yt-transition-shorts-detector sessions:**
- `bypassPermissions` mode used in session config
- `maxThinkingTokens: 31999` configured
- Version `2.1.31` of Claude Code
- Performance optimization work (branch: `perf-optimization-v2`)
- No direct `@anthropic-ai/sdk` imports found in these sessions — they used Claude Code CLI, not the SDK directly

### CLI Patterns (from companion repo)

**claude-code-monorepo CLI examples:**
- `hat-rotation.sh` — 4-phase hat-based execution using `claude -p`:
  ```bash
  # Phase 1: Planner Hat
  PLAN=$(claude -p "You are wearing the PLANNER hat...")
  # Phase 2: Builder Hat
  BUILD_OUTPUT=$(claude -p "You are wearing the BUILDER hat... ${PLAN}")
  # Phase 3: Reviewer Hat
  REVIEW=$(claude -p "You are wearing the REVIEWER hat... ${BUILD_OUTPUT}")
  # Phase 4: Fixer Hat (conditional)
  if echo "$REVIEW" | grep -qi "CRITICAL\|HIGH"; then...
  ```
- `worktree-parallel.sh` — parallel Claude Code CLI sessions across git worktrees

### Full-Stack Orchestrator (Post 18 companion repo)
- `core.py` — 3-platform build coordinator (Python, Swift, TypeScript)
- Parses OpenAPI YAML specs into `APIContract` (schemas + endpoints)
- `ModelGenerator` — generates platform-native types from API schemas
- `ValidationScenario` — cross-platform validation scenarios
- `OrchestratorReport` — tracks schemas_count, endpoints_count, models_generated, platforms, validation_passed, inconsistencies

### SDK vs CLI Decision Matrix (from session evidence)

| Dimension | SDK | CLI |
|-----------|-----|-----|
| **Token control** | Precise — you control every token | Overhead from system prompts, hooks, skills, MCP |
| **Tool ecosystem** | Manual — you define every tool | Built-in: Glob, Grep, Read, Edit, Write, Bash, WebSearch |
| **Cost** | 40% less (from post content) | Higher but includes full environment |
| **Code volume** | 3x more code (from post content) | Minimal — `claude -p "prompt"` |
| **Batch processing** | Natural — async, rate-limited | Not designed for batch |
| **Code editing** | Manual diff/patch | Context-preserving Edit tool |
| **MCP servers** | Must integrate yourself | Auto-discovered, auto-started |
| **Hooks/enforcement** | None — you build it | PreToolUse, PostToolUse, UserPromptSubmit |

### Key Insight for Post
The yt-transition-shorts-detector project used CLI (bypassPermissions mode, version 2.1.31) for its complex video analysis pipeline. The SessionForge project used both — CLI for the main app development, and the memory MCP tools (which are effectively SDK-level integrations exposed through MCP). The hat-rotation.sh script is the clearest CLI pattern: 4 phases, each a single `claude -p` call, output piped between phases.

---

## Cross-Post Patterns

### Session Scale
- claude-mem-observer: 2,690+ session files, largest 52MB
- ils-ios: largest single session 338MB (62115115)
- Auto-Claude: 10 sessions, 2.2MB largest
- yt-transition-shorts-detector: 119MB largest session

### MCP Tool Ecosystem (from sessions)
Active MCP servers visible in process list during SessionForge session:
- `playwright-mcp` — browser automation
- `firecrawl-mcp` (2 instances) — web scraping
- `chrome-devtools-mcp` — Chrome DevTools Protocol
- `shadcn-mcp` — UI component library
- `sequential-thinking` — structured reasoning
- `mcp-server-memory` — persistent memory
- `tavily-mcp` — web search
- `repomix` — repository analysis
- `oh-my-claudecode` MCP server + team MCP server

### Observation Types Across Systems
| System | Types |
|--------|-------|
| claude-mem companion repo | discovery, error, decision, pattern |
| claude-mem observer XML | bugfix, feature, refactor, change, discovery, decision |
| Sequential thinking companion | observation, hypothesis, prediction, test, elimination, confirmation, root_cause, revision |
| GSD phases | discover, plan, execute, verify, ship |

---

## Unresolved Questions

1. **ccb-ai-instructions.md** — file not found at `/Users/nick/Desktop/Auto-Claude/`. May have been in an earlier repo or renamed. The post already references it, but direct file content would strengthen the narrative.
2. **No ralph-eval sessions found** — `find ~/.claude/projects/-private-tmp-ralph-eval-*/ -name "*.jsonl"` returned empty. Builder evolution comparisons from eval runs are not available.
3. **SDK import evidence thin** — no direct `@anthropic-ai/sdk` imports found in actual session JSONL files. The SDK examples exist in the companion repo but weren't captured in session logs (sessions use CLI, not SDK).
4. **Memory observation counts** — the README claims 14,391 observations but this appears to be a target/aspirational number from the companion repo, not verified from the actual SQLite database.
