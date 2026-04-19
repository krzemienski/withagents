# Post 16: "Building Claude Code Plugins That Actually Work"

## Metadata
- Target word count: 2,300
- Source posts: NEW
- Companion repo: `shannon-framework`
- New content needed: Yes — entirely new. Plugin architecture derived from Shannon Framework v5.6.0 (a real Claude Code plugin with 4-layer enforcement pyramid). Hook mechanics derived from 17 real hook files in ~/.claude/hooks/.

## Opening (hook — 2 sentences max)
A skill tells Claude what to do. A plugin tells Claude what it cannot do — and that distinction saved more agent budget than any prompt engineering trick I have tried.

## Narrative Arc
1. **Skills Hit a Wall** — Skills guide behavior but cannot enforce it. A skill says "always read files before editing" but the agent can ignore that instruction. The gap: skills are suggestions, plugins are enforcement. The evolution: CLAUDE.md rules (always loaded, easily ignored) to skills (invocable workflows, still optional) to plugins (hooks that intercept tool calls and block violations before they execute). When a PreToolUse hook blocks test file creation, the agent never gets to make the mistake. Source: real observation — block-test-files.js has prevented hundreds of test file creations. ~300 words

2. **Plugin Architecture: What Goes Where** — A plugin is a directory with hooks/, skills/, agents/, and optionally MCP servers. Installation: plugins live in `~/.claude/plugins/` or project-local `.claude/plugins/`. Discovery: Claude Code scans plugin directories at session start. The Shannon Framework as real example — 15 slash commands (Layer 4), 18 behavioral skills (Layer 3), hooks for enforcement (Layer 2), core methodology files (Layer 1). The 4-layer enforcement pyramid: commands delegate to skills, skills reference core files, hooks enforce compliance at every layer. Source: Shannon Framework v5.6.0 README, real directory structure. ~400 words

3. **The Hook System: Four Event Types** — This is the enforcement engine. **PreToolUse** fires before any tool executes — can block, warn, or inject context. Matcher filters by tool name. Real example: block-test-files.js (75 lines) matches Write|Edit, checks if target path contains test/mock/stub patterns, returns `{ decision: "block" }` with the functional validation mandate message. Real example: read-before-edit.js matches Edit, warns if the file has not been Read in this session. **PostToolUse** fires after tool executes — can inject reminders but cannot undo. Real example: validation-not-compilation.js matches Bash, detects build success output, reminds "compilation is not validation — exercise the feature through UI." Real example: completion-claim-validator.js catches build success claims without functional validation evidence. **UserPromptSubmit** fires on every user message — inject workflow requirements. Real example: skill-activation-forced-eval.js forces skill evaluation before any implementation. **SessionStart** fires once at session init — load context. Real example: session-sdk-context.js injects auth rules from turn 1. The escalation pattern: warn (context injection) then block (prevent execution) then report (log violation). Source: 17 real hook files in ~/.claude/hooks/, each with specific matchers. ~550 words

4. **MCP Servers: Adding Custom Tools** — Plugins can bundle MCP servers that add new tools to Claude Code's toolkit. An MCP server runs as a subprocess, communicates via stdio, defines tools with JSON Schema. The oh-my-claudecode plugin bundles 30+ MCP tools (LSP hover/goto/references, AST grep search/replace, Python REPL, state management, notepad, project memory) as one installable package. When to use MCP vs hooks: hooks intercept existing tools, MCP adds new ones. Source: real OMC tool catalog visible in this session's tool list. ~350 words

5. **The Shannon Framework Walkthrough** — A real working plugin. 8D complexity scoring replaces "seems complex" with 0.72/1.00 (VERY COMPLEX). Wave orchestration replaces "need 3-4 agents" with a formula: complexity x bands = 8-15 agents. Quantified progress replaces "making progress" with 65% complete (+12% this session). NO MOCKS compliance: 100% or fail — enforced by hooks, not guidelines. The key insight: Shannon was built by observing actual LLM violations and creating explicit counters for each one. Source: Shannon Framework v5.6.0 README, real metrics. ~350 words

6. **What Breaks and How to Debug** — Hook scripts must be fast — synchronous, under 100ms, no network calls. Matcher patterns are exact — `Write` matches Write, not MultiEdit (need `Write|Edit|MultiEdit`). Plugin load order: project-local overrides global. The "hook that cried wolf" anti-pattern: too many warnings train the agent to ignore them. Silent failures: hooks that crash return no output, so the tool call proceeds as if no hook existed — always wrap in try/catch with silent exit(0) on error. Source: real debugging of block-test-files.js error handling pattern. ~250 words

## Key Code Blocks to Include
- block-test-files.js PreToolUse hook — the real 75-line implementation showing TEST_PATTERNS array, ALLOWLIST, stdin JSON parsing, decision: "block" output
- validation-not-compilation.js PostToolUse hook — the real pattern detecting build success and injecting the reminder
- Shannon's 4-layer enforcement pyramid ASCII diagram from the README
- A minimal hook template (~15 lines) showing the stdin/stdout contract: read JSON, check condition, output decision or exit(0)

## Real Data Points
- 17 hook files in ~/.claude/hooks/ — block-test-files.js, validation-not-compilation.js, evidence-gate-reminder.js, read-before-edit.js, plan-before-execute.js, skill-activation-forced-eval.js, subagent-context-enforcer.js, etc.
- block-test-files.js: 75 lines, 14 test patterns, 3 allowlist patterns
- Shannon Framework v5.6.0: 15 commands, 18 skills, 4-layer enforcement, 8D complexity scoring
- Shannon quantification: replaces "seems complex" with 0.72/1.00 scores
- oh-my-claudecode: 30+ MCP tools bundled as one plugin
- Hook enforcement: "Every agent ignored at least two rules per session" pre-hooks vs "zero violations" post-hooks

## Material to NOT Include
- Skill writing details (post 15 covers SKILL.md anatomy, intake, routing)
- Consensus patterns and multi-agent voting (post 2)
- Memory architecture and observation stores (post 12)
- Full Shannon Framework methodology (too deep — use it as a case study, not a tutorial)
- MCP server implementation internals (stdio protocol details are docs, not narrative)
- The full list of all 17 hooks (name them, don't explain each one)

## Companion Repo Tie-in
The `shannon-framework` repo IS the companion — a real working Claude Code plugin with the 4-layer enforcement pyramid, 15 commands, 18 skills, and hook-based enforcement. Post ends with: "Install Shannon. Make an intentional violation — try to create a test file, skip a planning phase, claim completion without evidence. Watch the hooks catch each one before the tool executes. That is the difference between a skill that suggests and a plugin that enforces."
