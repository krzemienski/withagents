# Blog Series Consolidation Proposal

**61 posts → 18 posts**
**Status:** AWAITING USER APPROVAL — No writing until approved

## Decision Framework

### How Topics Were Chosen

1. **Session evidence density** — Topics backed by the most real session data (4,496 files, 1.75M lines across 20 projects)
2. **Real GitHub repo match** — Every post maps to one of the 18 existing public repos
3. **Practical utility** — Companion repos must be installable tools, plugins, or frameworks — not documentation stubs
4. **User directives** — Skills, plugins, SDK vs CLI, "the skill that builds this blog" explicitly requested
5. **Deduplication** — 61 posts had massive overlap (6 validation posts, 5 Ralph posts, 5 worktree posts, etc.)

### What Got Cut and Why

| Cut Topics | Reason |
|-----------|--------|
| Ralph Rust platform / RoboShare | Not Nick's project — user directive |
| Ground truth labeling (Post 22) | Too niche, yt-transition-shorts-detector specific |
| Mermaid editor (Post 44) | Feature detail, not a pattern |
| Checkmark progress (Post 52) | Absorbed into spec-driven development |
| Terminal UI (Post 51) | Too narrow |
| Gap analysis (Post 58) | Merged into spec-driven |
| TDD orchestration (Post 57) | Merged into Ralph loops |
| API limit recovery (Post 50) | Debugging anecdote, not pattern |
| Electron to native (Post 26) | Auto-Claude specific, not broadly useful |

### Repo Mapping Strategy

18 posts → 18 real GitHub repos. Every repo gets enhanced to be genuinely useful:
- **Tier 1 repos** (4): Installable Claude Code plugin or `pip install`/`npm install` tool
- **Tier 2 repos** (6): Working CLI or framework with README quickstart
- **Tier 3 repos** (5): Reference implementation with real code
- **Tier 4 repos** (3): Developer guides with decision frameworks

---

## The 18 Posts

### Post 1: "4,500 AI Coding Sessions: What Actually Works"

**Theme:** Series overview — what patterns survive at scale, what doesn't work
**Source posts:** 1, 11
**Companion repo:** `claude-code-builder` (Python, 20★) — the most-starred repo, the tool that started it all
**Repo enhancement:** Add a "lessons learned" section to README mapping to each blog post

**Why this topic:** The deep-mine shows 23,934 JSONL session files across 20 projects spanning 365+ days. That's the hook. The overview connects everything.

**Session evidence:**
- 4,496 files >1KB, 1,753,828 total lines of session data
- 20 distinct projects from ils-ios (2.7GB) to zenflow worktrees
- Tool distribution: Bash (8,346), Read (5,068), Edit (1,476) across all projects

**Source material quality:** Post 1 (6,332 words, original deep content), Post 11 (14,715 words, comprehensive systems overview)

---

### Post 2: "3 Agents Found the Bug 1 Agent Missed"

**Theme:** Multi-agent consensus — when one agent is unreliable, use three
**Source posts:** 2, 43, 60
**Companion repo:** `enhanced-claude-code` (Python, 14★) — multi-agent orchestration in practice
**Repo enhancement:** Extract the consensus voting logic into a standalone CLI tool within the repo

**Why this topic:** Multi-agent patterns appear across EVERY major project. ils-ios spawned 39 agents. ralph-orchestrator used 21. sessionforge ran 80. This isn't theoretical.

**Session evidence:**
- ils-ios: Task(484), TaskCreate(243), TaskUpdate(227) — massive agent coordination
- ralph-orchestrator: Task(116), TaskCreate(50) — hat-based agent dispatch
- sessionforge: Agent(80) — parallel exploration agents

**Source material quality:** Post 2 (6,071 words, original), Post 43 (7,351 words, file ownership), Post 60 (7,326 words, ralplan consensus)

---

### Post 3: "I Banned Unit Tests and Shipped Faster"

**Theme:** Functional validation — no mocks, no stubs, build and run the real system
**Source posts:** 3, 12, 27, 42, 48, 53
**Companion repo:** `claude-code-skills-factory` (Python, 0★) → **ENHANCE into Claude Code validation plugin**
**Repo enhancement:** Transform into installable Claude Code plugin with:
- `skills/functional-validation/SKILL.md`
- `skills/gate-validation-discipline/SKILL.md`
- `skills/no-mocking-validation-gates/SKILL.md`
- `hooks/block-test-files.js` (PreToolUse hook)
- `hooks/evidence-gate-reminder.js`
- `plugin.json` manifest
- Goal: `claude plugin install functional-validation-framework`

**Why this topic:** This is the #1 user priority. The NO MOCKS philosophy originated in `ccb-ai-instructions.md` (May 2025) and propagated to every project. Shannon Framework's 4-layer enforcement, the GSD framework's verification gates, the hooks system — all trace back to this principle.

**Session evidence:**
- ccb-ai-instructions.md: "no unit tests, no mocks, validate by running the actual tool" — genesis document
- ils-ios: idb_tap(76), simulator_screenshot(62), idb_describe(44) — real device validation
- awesome-site: browser_navigate(11), browser_take_screenshot(9) — Playwright validation
- sessionforge: browser_click(38), browser_navigate(37), browser_take_screenshot(28)

**Source material quality:** Post 3 (10,431 words, original deep content — strongest post), Post 27 (7,174 words), Post 42 (6,498 words), Post 48 (11,522 words), Post 53 (8,174 words), Post 12 (2,084 words)

---

### Post 4: "Building a Native iOS Client for Claude Code"

**Theme:** iOS streaming bridge + native app development with AI agents
**Source posts:** 4, 5, 23, 33
**Companion repo:** `claude-code-ios-ui` (Swift, 6★) — real working iOS app
**Repo enhancement:** Add multi-simulator validation scripts, document the 5-layer SSE bridge

**Why this topic:** The ils-ios project is the LARGEST in the entire corpus — 974 files, 768,412 lines, 2,751MB. It demonstrates iOS development with AI agents at a scale nobody else has documented.

**Session evidence:**
- ils-ios: 974 files, 768K lines, 2.7GB of session data
- MCP tools: idb_tap(76), simulator_screenshot(62), idb_describe(44), idb_input(7)
- Tasks: SSH terminal implementation, custom themes, keychain storage, iCloud sync
- claude-code-ios-ui: 6★, real Swift package

**Source material quality:** Post 4 (10,721 words, original), Post 5 (10,867 words, original), Post 23 (8,621 words, pbxproj), Post 33 (8,972 words, SSH terminal)

---

### Post 5: "982 Sessions of iOS: State, Sync, and Performance"

**Theme:** iOS patterns compendium — SwiftUI state, iCloud, Keychain, performance
**Source posts:** 30, 32, 34, 39, 40
**Companion repo:** `claude-code-ios` (Roff, 1★) → **ENHANCE with organized Swift examples**
**Repo enhancement:** Collect patterns from all iOS posts into organized Swift examples:
- `patterns/swiftui-state/` — Observable, @State, @Binding patterns
- `patterns/icloud-sync/` — CloudKit container setup, conflict resolution
- `patterns/keychain/` — Keychain wrapper, credential storage
- `patterns/performance/` — instrument-driven optimization, memory profiling
- `patterns/multi-simulator/` — parallel validation across device types

**Why this topic:** Beyond the streaming bridge, there's a massive iOS patterns story. The ils-ios project touched every iOS concern.

**Session evidence:**
- ils-ios tasks: 007-icloud-sync, 003-keychain-credential-storage, 012-performance-optimization-suite, 002-custom-themes-creator
- 39 agents spawned for iOS development tasks
- Simulator commands throughout: `xcrun simctl`, `idb ui describe`, `xcodebuild`

**Source material quality:** Post 32 (6,141 words), Post 34 (7,934 words), Post 39 (7,502 words), Post 40 (6,644 words), Post 30 (6,156 words)

---

### Post 6: "194 Parallel Agents, Zero Merge Conflicts"

**Theme:** Git worktrees as agent isolation — parallel execution at scale
**Source posts:** 6, 16, 37
**Companion repo:** `autonomous-claude-code-builder` (Python, 2★) — uses worktree factory pattern
**Repo enhancement:** Add worktree factory CLI, named convention system, task.yaml batch executor

**Why this topic:** Worktree-based parallelism appears in EVERY major project. It's the enabling pattern for everything else.

**Session evidence:**
- ralph-orchestrator: 10+ named worktrees (lucky-reed, neat-elm, bright-maple, etc.)
- ils-ios: `.auto-claude/worktrees/tasks/` directory structure with numbered tasks
- awesome-list-site: auto-claude worktree tasks with PR merging
- code-story-platform: 90 worktrees (from session observations)

**Source material quality:** Post 6 (15,424 words — longest original post), Post 16 (1,874 words), Post 37 (6,318 words)

---

### Post 7: "7 Layers of AI Agent Governance"

**Theme:** Prompt engineering + constitutions + hooks + enforcement
**Source posts:** 7, 24, 28, 55
**Companion repo:** `shannon-framework` (Python, 1★) — 8D complexity, 4-layer enforcement, real plugin
**Repo enhancement:** Already a comprehensive framework. Add:
- `constitutions/` directory with project/feature/safety examples
- `hooks/` library with documented enforcement hooks
- `decision-tree.md` — when to use CLAUDE.md vs hooks vs skills vs constitutions

**Why this topic:** The governance stack evolved from `ccb-ai-instructions.md` (May 2025) through Shannon Framework v5.6.0 (Nov 2025). The 7-layer model (CLAUDE.md → hooks → skills → constitutions → MCP → agent instructions → runtime guards) is the architecture.

**Session evidence:**
- Shannon Framework: 8D complexity analysis, wave orchestration, NO MOCKS enforcement
- ils-ios: Constitution created with "no matter what" functional validation mandate
- All projects: CLAUDE.md files, hooks, skills activation patterns

**Source material quality:** Post 7 (14,122 words, original deep content), Post 24 (6,865 words), Post 28 (6,643 words), Post 55 (7,672 words)

---

### Post 8: "Hat-Based Loops: Ralph Execution Patterns"

**Theme:** Ralph loop patterns ONLY — builder/writer/reviewer rotation, hat events, iteration control
**Source posts:** 8, 35, 36, 56, 57
**Companion repo:** `shannon-cli` (Python, 1★) → **ENHANCE with loop pattern configs**
**Repo enhancement:** Add:
- `loop-configs/` — builder, writer, reviewer, thorough-reviewer hat configs
- `patterns/` — iteration control, state management, event emission
- CLI: `shannon-cli loop run --config builder.yaml --iterations 10`
- NO Rust platform code, NO RoboShare references

**Why this topic:** The Ralph loop is used across projects. The pattern of hat-based execution (Planner→Builder→Reviewer cycling) is genuinely useful.

**Session evidence:**
- ralph-orchestrator: `ralph emit "build.done"`, `ralph tools task ready`, hat state management
- ralph-orchestrator: 138 files, 152,254 lines — heavy loop execution
- GSD plugin integration: `node gsd-tools.cjs phase-plan-index "36"`
- Named worktrees in ralph: worktrees-lucky-reed through worktrees-prime-badger

**Source material quality:** Post 8 (11,817 words, original), Post 35 (7,623 words), Post 36 (7,718 words), Post 56 (7,177 words), Post 57 (6,962 words)
**NOTE:** Strip ALL RoboShare/Rust platform content per user directive

---

### Post 9: "From Session Logs to Published Content"

**Theme:** Content pipelines — mining sessions, scoring insights, generating posts
**Source posts:** 9, 19, 29, 45
**Companion repo:** `sessionforge` (TypeScript, 4★) — real content mining dashboard
**Repo enhancement:** Already a working dashboard. Ensure quickstart works on clean clone.

**Why this topic:** This blog series itself was produced by content pipelines. The devlog-pipeline skill mined 4,597 files to produce 61 posts. SessionForge is the dashboard for this.

**Session evidence:**
- sessionforge-apps-dashboard: get_session_summary(156), get_session_messages(113), create_insight(81), mine_sessions(30)
- blog-series sessions: deep-mine.py processing 4,496 files
- devlog-pipeline skill: 429,000+ words generated across 61 posts

**Source material quality:** Post 9 (8,137 words, original), Post 29 (6,181 words), Post 45 (6,988 words), Post 19 (2,376 words)

---

### Post 10: "21 AI Screens, Zero Figma: Design to Code"

**Theme:** Stitch MCP + design tokens + runtime themes
**Source posts:** 10, 20, 41
**Companion repo:** `claude-mobile-expo` (Python, 2★) → **ENHANCE with Stitch MCP examples**
**Repo enhancement:** Add:
- `stitch-examples/` — Stitch MCP prompts that work
- `design-tokens/` — cross-platform token propagation
- `themes/` — runtime theme system patterns

**Why this topic:** Stitch MCP is genuinely novel. The blog site itself was designed with it. The token → component → runtime pipeline is reproducible.

**Session evidence:**
- ai-digest: generate_screen_from_text(17), list_screens(3) — Stitch MCP usage
- awesome-site: generate_screen_from_text(15) — more Stitch generation
- blog-series: Stitch project ID 5577890677756270199, hero images generated

**Source material quality:** Post 10 (5,898 words, original), Post 20 (2,887 words), Post 41 (6,572 words)

---

### Post 11: "One YAML, Eight Agents, Complete App"

**Theme:** Spec-driven development — YAML specs → multi-agent execution → complete systems
**Source posts:** 14, 25, 54, 59
**Companion repo:** `reponexus` (Python, 1★) → **ENHANCE into spec execution framework**
**Repo enhancement:** Transform into:
- YAML spec format with JSON schema validation
- Multi-agent builder: reads spec, spawns agents per component
- CLI: `reponexus build app.yaml --agents 4`
- Example specs: web app, API, iOS app
- GSD integration patterns

**Why this topic:** Spec-driven execution is the pattern that scales. GSD framework, Shannon specs, ils-ios roadmaps — all use YAML specs to drive multi-agent work.

**Session evidence:**
- ils-ios: `.auto-claude/roadmap/roadmap.json`, GSD phase execution
- awesome-site: `specs/admin-e2e-validation/`, spec-driven task tracking
- ralph-orchestrator: `.planning/phases/` directory structure
- GSD tools: `gsd-tools.cjs phase-plan-index`, `gsd-tools.cjs init execute-phase`

**Source material quality:** Post 14 (2,315 words), Post 25 (6,625 words), Post 54 (9,958 words), Post 59 (6,430 words)

---

### Post 12: "Teaching AI to Remember: Cross-Session Memory"

**Theme:** Memory architecture — observation stores, session telemetry, MCP memory servers
**Source posts:** 15, 21, 49
**Companion repo:** `shannon-mcp` (Python, 2★) — MCP server providing cross-session memory
**Repo enhancement:** Add observation store with SQLite + semantic search, session telemetry collector

**Why this topic:** The claude-mem-observer project is the SECOND largest in the corpus — 2,673 files, 367K lines, 2.1GB. Cross-session memory is infrastructure.

**Session evidence:**
- claude-mem-observer: 2,673 files, 367,293 lines, 2,103MB — massive memory system
- claude-mem-observer: 8,200 topic signals, 5,572 errors — heavy development
- claude-mem-observer: observation/discovery patterns throughout
- sessionforge: session mining with get_session_summary, create_insight

**Source material quality:** Post 15 (1,946 words — needs expansion), Post 21 (2,495 words), Post 49 (6,651 words)

---

### Post 13: "84 Steps to One-Line Bug: Debugging with Sequential Thinking"

**Theme:** Sequential thinking MCP + debugging patterns + build cache + Chrome DevTools
**Source posts:** 17, 31, 47, 50
**Companion repo:** `claude-code-sync` (Python, 0★) → **ENHANCE into debugging toolkit**
**Repo enhancement:** Transform into debugging patterns collection:
- Sequential thinking integration examples
- Build cache detection and recovery
- Chrome DevTools Protocol automation
- API error recovery patterns

**Why this topic:** Every project has debugging stories. Sequential thinking MCP is used across all major projects. Build cache issues are universal.

**Session evidence:**
- yt-transition-shorts-detector: sequentialthinking(13) — heavy use
- All projects: error patterns in deep-mine report (602 in ils-ios, 5572 in claude-mem-observer, 114 in yt-detector)
- sessionforge: browser_click(38), browser_navigate(37) — Chrome DevTools patterns

**Source material quality:** Post 17 (2,156 words — needs expansion), Post 31 (6,325 words), Post 47 (6,770 words), Post 50 (6,319 words)

---

### Post 14: "35 Worktrees, 12 Agents, Conflict-Free Merging"

**Theme:** Multi-agent merge orchestration — how parallel agents merge without conflicts
**Source posts:** 16, 43
**Companion repo:** `repo-nexus` (Swift, 1★) → **ENHANCE with merge strategy documentation**
**Repo enhancement:** Add merge orchestration patterns, conflict prevention strategies, PR automation

**Why this topic:** Merge orchestration is the missing link between worktree parallelism and shipping. If you can't merge, parallelism is useless.

**Session evidence:**
- awesome-list-site: `gh pr merge`, worktree PR merging workflows
- ralph-orchestrator: `git diff main...HEAD`, branch management
- code-story-platform: 90 worktrees requiring merge coordination

**Source material quality:** Post 16 (1,874 words — needs expansion), Post 43 (7,351 words)

---

### Post 15: "The Skill That Writes This Blog" (NEW)

**Theme:** How to write Claude Code skills — anatomy, triggering, testing, real examples
**Source posts:** NEW (with references to devlog-pipeline, devlog-publisher, technical-content-creator skills)
**Companion repo:** `claude-code-skills-factory` (Python, 0★) → **ENHANCE into skill development kit**
**Repo enhancement:** Transform into:
- `templates/basic-skill/SKILL.md` — minimal skill template
- `templates/validation-skill/SKILL.md` — skill with evidence gates
- `templates/orchestration-skill/SKILL.md` — skill that spawns agents
- `examples/devlog-pipeline/` — the actual skill that built this blog
- `docs/anatomy.md` — skill file structure explained
- `docs/triggering.md` — how trigger patterns work
- `docs/testing.md` — how to verify skills work

**Why this topic:** User explicitly requested. "you don't have enough stuff around skills" and "the actual skill that builds and writes this thing." Three production skills exist as evidence.

**Session evidence:**
- devlog-pipeline: 8-mode pipeline, 429K words generated, 61 posts
- devlog-publisher: 5-teammate pipeline architecture
- technical-content-creator: 6 post-type templates, 10 writing rules
- Skill(159) in ils-ios, Skill(325) in claude-mem-observer, Skill(30) in ai-digest

**Source material quality:** ENTIRELY NEW — write from scratch using real skill files as source material

---

### Post 16: "Building Claude Code Plugins That Actually Work" (NEW)

**Theme:** Plugin architecture — manifests, hooks, MCP servers, agent configs
**Source posts:** NEW (Shannon Framework IS a plugin, plus hooks system documentation)
**Companion repo:** `shannon-framework` (Python, 1★) — a real, working Claude Code plugin
**Repo enhancement:** Already a comprehensive plugin. Add:
- `docs/plugin-anatomy.md` — how plugin.json, skills/, hooks/, agents/, mcp/ work together
- `docs/from-skill-to-plugin.md` — when a skill becomes a plugin
- Annotated plugin.json with every field explained

**Why this topic:** User explicitly requested. "make a plugin for the plugin." Shannon Framework is a REAL plugin with 4-layer enforcement, wave orchestration, and 8D complexity scoring. It's the perfect case study.

**Session evidence:**
- Shannon Framework v5.6.0: Full Claude Code plugin with enforcement hooks
- shannon-mcp: MCP server component of the plugin ecosystem
- shannon-cli: CLI component
- Hook system: block-test-files.js, evidence-gate-reminder.js, etc. — all real hooks

**Source material quality:** ENTIRELY NEW — write from Shannon Framework README, plugin architecture docs, hooks system

---

### Post 17: "The CCB Evolution: From Bash Script to Autonomous Builder" (NEW)

**Theme:** The lineage of autonomous coding tools — ccb → enhanced → autonomous → skills-factory
**Source posts:** NEW (with references to Post 38 auto-claude task factory)
**Companion repo:** `claude-code-monorepo` (Swift, 1★) → **ENHANCE into project lineage documentation**
**Repo enhancement:** Document the evolution with:
- Timeline of each generation
- Architecture diagrams showing what changed
- Decision log: why each generation was created
- Lessons learned at each stage

**Why this topic:** The CCB evolution IS the story of agentic development. Four generations of autonomous builders, each learning from the last. The `ccb-ai-instructions.md` genesis document (May 2025) established NO MOCKS before anything else existed.

**Session evidence:**
- ccb: `ccb-ai-instructions.md` (genesis), `ccb-tasks-breakdown.md`, awesome-researcher as first project
- claude-code-builder v2.3: 10-phase standard build, testing disabled globally
- enhanced-claude-code: multi-agent orchestration
- autonomous-claude-code-builder: worktree-based parallel execution
- claude-code-skills-factory: skill generation from session analysis
- Auto-Claude (third-party): Electron desktop app with IPC channels, agent terminals

**Source material quality:** ccb-ai-instructions.md (read in prior session), claude-code-builder USAGE_GUIDE.md, acli SUMMARY.md

---

### Post 18: "SDK vs CLI: When Each Approach Wins" (NEW)

**Theme:** Decision framework — Agent SDK vs Claude Code CLI for different use cases
**Source posts:** NEW
**Companion repo:** `hls-dash-dev-chrome-extension` (TypeScript, 0★) → **REPURPOSE as SDK/CLI comparison examples**
**Repo enhancement:** Transform into:
- `examples/sdk-approach/` — building with @anthropic-ai/sdk directly
- `examples/cli-approach/` — building with Claude Code subprocess
- `examples/hybrid-approach/` — when to combine both
- `decision-framework.md` — flowchart for choosing approach
- Real benchmarks: token cost, latency, flexibility tradeoffs

**Why this topic:** User explicitly requested. "SDK versus just using the regular CLI, but in reality, does the SDK even use the CLI too?" The acli project (SDK-based) vs claude-code-builder (CLI-based) provides real comparison data.

**Session evidence:**
- claude-code-builder: CLI subprocess approach, 20★
- acli (autonomous CLI): SDK-based approach, Python TUI
- SessionForge: Hybrid approach (TypeScript dashboard + Claude Code sessions)
- Real metrics from acli SUMMARY.md

**Source material quality:** ENTIRELY NEW — write from real project comparison

---

## Repo → Post Mapping Summary

| # | Post Title | Repo | Stars | Tier |
|---|-----------|------|-------|------|
| 1 | 4,500 Sessions: What Actually Works | `claude-code-builder` | 20★ | Guide |
| 2 | 3 Agents Found the Bug | `enhanced-claude-code` | 14★ | Framework |
| 3 | I Banned Unit Tests | `claude-code-skills-factory` → validation plugin | 0★ | **Plugin** |
| 4 | Native iOS Client for Claude | `claude-code-ios-ui` | 6★ | Reference |
| 5 | 982 Sessions of iOS | `claude-code-ios` | 1★ | Reference |
| 6 | 194 Parallel Agents | `autonomous-claude-code-builder` | 2★ | Framework |
| 7 | 7 Layers of Governance | `shannon-framework` | 1★ | **Plugin** |
| 8 | Hat-Based Loops | `shannon-cli` | 1★ | Framework |
| 9 | Session Logs to Content | `sessionforge` | 4★ | Framework |
| 10 | 21 AI Screens, Zero Figma | `claude-mobile-expo` | 2★ | Reference |
| 11 | One YAML, Eight Agents | `reponexus` | 1★ | Framework |
| 12 | Cross-Session Memory | `shannon-mcp` | 2★ | Framework |
| 13 | 84 Steps to One-Line Bug | `claude-code-sync` | 0★ | Reference |
| 14 | Conflict-Free Merging | `repo-nexus` | 1★ | Reference |
| 15 | The Skill That Writes This Blog | `claude-code-skills-factory` | 0★ | **Plugin** |
| 16 | Building Claude Code Plugins | `shannon-framework` | 1★ | **Plugin** |
| 17 | CCB Evolution | `claude-code-monorepo` | 1★ | Guide |
| 18 | SDK vs CLI | `hls-dash-dev-chrome-extension` | 0★ | Guide |

**Note:** Posts 3 and 15 share `claude-code-skills-factory` (validation plugin + skill dev kit — same repo, different facets). Posts 7 and 16 share `shannon-framework` (governance patterns + plugin architecture — same repo, different angles).

## Unmapped Repos

| Repo | Stars | Decision |
|------|-------|----------|
| `ai-digest` | 1★ | Could replace `claude-mobile-expo` for Post 10 if user prefers |
| `code-story` | 1★ | Could supplement Post 9 (content pipelines) |

## Source Post Absorption Map

Shows where each of the 61 posts ends up:

| Original Posts | → Consolidated Post |
|---------------|-------------------|
| 1, 11 | → Post 1 (Overview) |
| 2, 43, 60 | → Post 2 (Consensus) |
| 3, 12, 27, 42, 48, 53 | → Post 3 (Validation) |
| 4, 5, 23, 33 | → Post 4 (iOS Bridge) |
| 30, 32, 34, 39, 40 | → Post 5 (iOS Patterns) |
| 6, 16, 37 | → Post 6 (Worktrees) |
| 7, 24, 28, 55 | → Post 7 (Governance) |
| 8, 35, 36, 56, 57 | → Post 8 (Ralph Loops) |
| 9, 19, 29, 45 | → Post 9 (Content Pipelines) |
| 10, 20, 41 | → Post 10 (Design to Code) |
| 14, 25, 54, 59 | → Post 11 (Spec-Driven) |
| 15, 21, 49 | → Post 12 (Memory) |
| 17, 31, 47, 50 | → Post 13 (Debugging) |
| 16, 43 | → Post 14 (Merge) |
| NEW | → Post 15 (Skills) |
| NEW | → Post 16 (Plugins) |
| NEW + 38 | → Post 17 (CCB Evolution) |
| NEW | → Post 18 (SDK vs CLI) |

**Posts with NO absorption target (DROPPED):**
- 13 (Kaizen algorithm tuning) — too project-specific
- 18 (Three platforms full-stack) — absorbed into overview
- 22 (Ground truth labeling) — too niche
- 26 (Electron to native) — Auto-Claude specific
- 44 (Live mermaid editor) — feature detail
- 46 (Supabase auth migration) — could go in overview or be dropped
- 51 (Terminal UI) — too narrow
- 52 (Checkmark progress) — absorbed into spec-driven
- 58 (Gap analysis) — absorbed into spec-driven
- 61 (Docs lookup) — could go in debugging or be dropped

## Writing Quality Standards

Per Phase 3 rules (already approved):
- 1,500-2,500 words per post
- Zero LLM patterns ("Here is", "Let's dive in", "powerful/robust/elegant")
- First person singular, problem-first narrative
- Real terminal output, real error messages
- Mermaid diagrams where they clarify architecture
- Each post has unique structure

## Session Mining Protocol

### How to Read a Session File

1. **Sample first 150 lines** — project setup, initial instructions, skill activations
2. **Sample middle 150 lines** — core work patterns, tool usage, error recovery
3. **Sample last 150 lines** — completion state, validation evidence, lessons learned

### What to Look For

| Signal | What It Means |
|--------|--------------|
| `Task()` / `TaskCreate()` high count | Multi-agent orchestration session |
| `idb_tap` / `simulator_screenshot` | iOS device validation |
| `browser_click` / `browser_navigate` | Web app functional validation |
| `sequentialthinking` | Complex debugging or planning |
| `generate_screen_from_text` | Stitch MCP design generation |
| Error clusters | Debugging sessions — rich content |
| `git worktree` / `.auto-claude/worktrees/` | Parallel execution patterns |
| `state_write` / `state_read` | Stateful orchestration (OMC, GSD, Ralph) |

### Common Patterns

1. **Orchestration sessions** (>100 Task calls): Agent spawning, task tracking, result synthesis
2. **Build-debug loops** (high Bash + Edit): Iterative fixing, error → edit → recompile
3. **Validation sessions** (screenshot/tap heavy): Evidence collection, gate verification
4. **Planning sessions** (high Read + Grep): Codebase exploration, architecture decisions
5. **Content sessions** (high Write + Stitch): Content generation, visual creation

## Next Steps (After Approval)

1. **Phase 1:** Deep-read the source posts for each consolidated post, extract best material
2. **Phase 2:** Write detailed outlines with source mapping
3. **Phase 3:** Write all 18 posts (4 parallel writer agents)
4. **Phase 4:** Enhance companion repos (parallel per tier)
5. **Phase 5:** Update site, deploy, validate

**WAITING FOR YOUR APPROVAL ON:**
- [ ] The 18 topics — add, remove, or change any?
- [ ] The repo mappings — swap any repos?
- [ ] The dropped posts — save any?
- [ ] The tier assignments — change any repo enhancement levels?
- [ ] The 4 NEW posts (15, 16, 17, 18) — topics right?
