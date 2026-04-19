# Post 17: "The CCB Evolution: From Bash Script to Autonomous Builder"

## Metadata
- Target word count: 2,000
- Source posts: NEW (references old post 38 auto-claude task factory for context)
- Companion repo: `claude-code-monorepo`
- New content needed: Yes — entirely new. Lineage traced from real repos: ccb/ (955-line bash script, May 2025), enhanced-claude-code/ (2,081-line v3.0 builder), autonomous-coder/ (3-phase skill), claude-code-skills-factory/ (meta-generator).

## Opening (hook — 2 sentences max)
The first version was 47 lines of bash. It ran Claude Code in a loop until the build passed — or until it burned $47 in API credits on a single infinite loop.

## Narrative Arc
1. **Genesis: The ccb Bash Script** — May 2025. ccb-ai-instructions.md (389 lines) established the rules: NO UNIT TESTS, NO TEST FRAMEWORKS, NO MOCKS — only functional validation by running the actual built CLI tool. The bash script (cc-ccb-builder-script-old.sh, 955 lines) ran 12 phases sequentially, each calling `claude --print --model claude-opus-4 --dangerously-skip-permissions --max-turns 30`. State saved to JSON between phases for resumable builds. MCP servers configured inline (.mcp.json created by the script itself). The key insight already present in v1: pipe the prompt to claude via stdin, capture output, check exit code, save state, move to next phase. Source: /Users/nick/Desktop/ccb/cc-ccb-builder-script-old.sh (955 lines), ccb-ai-instructions.md (389 lines). ~400 words

2. **v2: Enhanced Claude Code Builder** — The 955-line script became a 2,081-line orchestrator. Version 3.0.0-enhanced added: dual model routing (Opus for complex tasks, Sonnet for simple ones), mem0 for persistent memory across phases, Context7 for documentation lookup, research agents that check mem0 first then Context7 then web, comprehensive tool usage logging with rationale, git integration during build. The builder built a builder — it generated the claude-code-builder Python package (multi-agent system with 4 distinct agents: SpecAnalyzer, TaskGenerator, InstructionBuilder, Executor). 12 build phases with progress tracking, state persistence, and resume capability. Source: /Users/nick/Desktop/enhanced-claude-code/builder-claude-code-builder.sh (2,081 lines), CLAUDE.md describing v2.3.0. ~400 words

3. **v3: Autonomous Coder** — The builder became a skill. Three phases: Explore (deep codebase analysis via Serena MCP for semantic understanding), Plan (dependency-aware implementation plans), Code (iterative implementation with verification). No longer a bash script wrapping Claude — now a SKILL.md that Claude loads and executes internally. Progress tracked via `.autonomous-coder/progress.json`. Security sandbox with filesystem restrictions and bash hooks. The shift: from "script that runs Claude" to "skill that Claude runs." Source: /Users/nick/Desktop/autonomous-coder/ (agent.py, client.py, SKILL.md, progress.py). ~350 words

4. **v4: The Skills Factory** — The autonomous coder generated more autonomous coders. claude-code-skills-factory/ contains generated-skills/, generated-agents/, generated-hooks/, generated-commands/, and optimized-prompts/. Meta-generation: a skill that creates skills, agents that create agents, hooks that create hooks. The PROJECT_SUMMARY_OPTIMIZE_PROMPT.md and WORKFLOW_ADAPTATION_PLAN.md show the self-improvement loop. Source: /Users/nick/Desktop/claude-code-skills-factory/ directory listing. ~300 words

5. **What Each Generation Taught** — v1 (bash): the NO MOCKS principle, state persistence between phases, the $47 infinite loop that created bounded fix loops (max 3 retries then escalate to human). v2 (enhanced): dual model routing saves cost (Sonnet for simple phases, Opus for architecture), research before implementation, memory across phases. v3 (skill): the agent should own its own execution loop, not be driven by an external script. v4 (factory): skills are the unit of reuse, not scripts. The GSD framework (post 14) is the current generation — the lessons from all four compressed into a 5-phase methodology. Source: synthesis across all repos. ~350 words

## Key Code Blocks to Include
- The core `run_claude_auto()` function from ccb v1 — the bash function that pipes prompts to `claude --print` with model, MCP config, allowed tools, max-turns (~20 lines, trimmed from the 955-line script)
- The "NO MOCKS" declaration from ccb-ai-instructions.md — the genesis of the functional validation mandate (~8 lines: "NO UNIT TESTS / NO TEST FRAMEWORKS / NO MOCKS / Only functional validation by running the actual built CLI tool")
- The autonomous-coder 3-phase architecture ASCII diagram from its README
- The state persistence pattern: save_state/load_state from ccb v1 showing JSON checkpoint between phases (~15 lines)

## Real Data Points
- ccb v1: 955-line bash script, 12 phases, 389-line AI instructions file, May 2025
- enhanced v2: 2,081-line builder script, v3.0.0-enhanced, dual model routing (Opus + Sonnet)
- autonomous-coder v3: 3-phase skill (Explore/Plan/Code), uses claude-code-sdk Python package
- skills-factory v4: generates skills, agents, hooks, commands, and optimized prompts
- The $47 infinite loop incident — a single failed phase retried indefinitely until API credits ran out
- ccb-ai-instructions.md established NO MOCKS in May 2025 — 10 months before the blog series
- 12 → 12 → 3 phases: each generation compressed the phase count as patterns stabilized

## Material to NOT Include
- Ralph loops and orchestration patterns (post 8)
- iOS streaming bridge or SDK bridge details (posts 4-5)
- Design system and Stitch integration (post 10)
- Plugin architecture details (post 16 — the factory generates plugins but the plugin system is covered there)
- Detailed Python package structure of claude-code-builder (implementation detail, not narrative)
- The full 12-phase prompt text from any version (too long — show the function that executes them)

## Companion Repo Tie-in
The `claude-code-monorepo` repo packages the evolution: the original ccb bash patterns, the enhanced multi-model builder, and the autonomous skill-based approach in one reference implementation. Post ends with: "The bash script taught us that agents need bounded loops. The enhanced builder taught us that agents need memory. The autonomous coder taught us that agents should own their execution. The factory taught us that agents can build agents. Each lesson took a $47 mistake to learn."
