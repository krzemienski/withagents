# Workstream B — GitHub 300-Repo Catalog

## Summary (≤100 words)

Of 300 public repos on `krzemienski`, **15 flagships** define the withagents.dev product surface — split across validation (validationforge, multi-agent-consensus), session/content (sessionforge, code-tales, code-tales-platform), iOS/bridge (ils-ios, claude-ios-streaming-bridge, claude-sdk-bridge), orchestration (auto-claude-worktrees, ralph-loop-patterns, shannon-framework), and tooling (claude-code-skills-factory, claude-prompt-stack, stitch-design-to-code, agentic-development-guide). **50 "Agentic Development #N" companion repos** exist (posts #12–#61); all are reachable but most are minimal skeletons — recommend selective re-announce of ~8 with real substance. **36 repos pushed in last 30d**; 14 non-flagship actives worth narrative mention.

## Flagships Table (15 rows)

| Repo | Stars | Lang | Last Push | Description | Readiness |
|---|---|---|---|---|---|
| agentic-development-guide | 1 | HTML | 2026-04-18 | Series hub: "61 Lessons from 8,481 AI Coding Sessions" — 61 companion repos, 429K words | **SHIP** — hub exists; needs retitle to 18 lessons / 23,479 sessions per new canon |
| validationforge | 1 | MDX | 2026-04-18 | No-mock functional validation platform for Claude Code + OpenCode. 52 skills, 19 commands, 7 hooks, 7 agents. Self-validated PASS. | **SHIP** — flagship product; most polished README; dual-platform |
| sessionforge | 5 | TypeScript | 2026-04-18 | JSONL session ingestion → blog/thread/LinkedIn/changelog/newsletter via 6-dim scoring + multi-agent pipeline. Calendar + Kanban views. | **SHIP** — highest star count of true flagships; production SaaS-shaped |
| ils-ios | 1 | Swift | 2026-03-22 | Native Swift client for Claude Code. 607+ Swift files. iOS + macOS + Vapor backend. 22K sessions, 370+ projects, 1,300+ procs, 23 hooks. | **SHIP** — most ambitious code surface; needs TestFlight-ready story |
| code-tales | 0 | Python | 2026-04-18 | PyPI lib: GitHub → Claude narration → ElevenLabs TTS → audio story. 9 narrative styles. | **SHIP** — CLI installable today |
| code-tales-platform | 1 | TypeScript | 2026-03-23 | Web platform version of code-tales. Vercel one-click deploy. Dashboard + Discover + Story Player. | **SHIP** — hosted counterpart to CLI |
| auto-claude-worktrees | 0 | Python | 2026-04-18 | CLI: ideate → spec → worktree per spec → QA → priority merge. Built from 194 parallel worktrees, 3,066 sessions. | **SHIP** — real tool, clear pipeline |
| multi-agent-consensus | 0 | Python | 2026-04-18 | Lead/Alpha/Bravo unanimous gate voting framework. Origin story: caught P2 streaming bug a single reviewer approved. | **SHIP** — pattern library, strong narrative |
| shannon-framework | 2 | Python | 2026-03-10 | v5.6.0 Claude Code plugin, 4-layer enforcement (Commands/Skills/Hooks/Core). Quantitative 8D complexity scoring for mission-critical domains. | **SHIP** — mature versioned plugin |
| ralph-loop-patterns | 0 | Python | 2026-03-06 | `pip install -e .` CLI for builder/writer/reviewer hat rotation with convergence detection. | **SHIP** — installable, clean scope |
| claude-prompt-stack | 0 | Shell | 2026-04-18 | 7-layer defense-in-depth prompt engineering template repo. Hooks enforce build verify, block secrets, persist lessons. | **SHIP** — template repo, clone-and-go |
| claude-ios-streaming-bridge | 0 | Swift | 2026-04-18 | Swift Package: iOS/macOS ↔ Claude Code via SSE. Extracted from ils-ios. 5-layer architecture. | **SHIP** — reusable Swift Package |
| claude-sdk-bridge | 0 | Swift | 2026-04-18 | Polyglot SDK bridge: iOS + Python + Node → Claude via one layer. 4 documented failure modes. | **SHIP** — reference implementation with failure case studies |
| stitch-design-to-code | 0 | TypeScript | 2026-04-18 | Template for Stitch MCP + React + Puppeteer visual validation. 21 screens, 107 validation actions. | **SHIP** — workflow template |
| claude-code-skills-factory | 0 | Python | 2026-04-18 | Factory pattern for authoring/evaluating/shipping Claude Skills + Agents. Interactive builder, slash commands. | **SHIP** — meta-tooling for skills ecosystem |

## 50 "Agentic Development #N" Companion Repos

All 50 repos found via description match on `"Agentic Development #"` are **reachable** (returned by authenticated `gh` listing; all pushed same window 2026-03-06). None archived. None dead-link. All show 0 stars, no description beyond the auto-generated "Companion repo for Agentic Development #NN" template — indicates bulk-generation, not organic substance.

Repos #12 – #61 inclusive (50 rows). Notable by name: `ui-validation-at-scale` (#12), `kaizen-algorithm-tuning` (#13), `spec-driven-implementation` (#14), `claude-mem-architecture` (#15), `multi-agent-merge-orchestrator` (#16), `sequential-thinking-debugging` (#17), `full-stack-orchestrator` (#18), `github-to-audio-pipeline` (#19), `design-token-automation` (#20), `session-observability` (#21), `vision-ground-truth-labeler` (#22), `pbxproj-agent-toolkit` (#23), `agent-constitution-framework` (#24), `spec-driven-execution` (#25), `electron-to-native-specgen` (#26), `playwright-validation-pipeline` (#27), `claude-code-discipline-hooks` (#28), `session-insight-miner` (#29), `multi-simulator-orchestrator` (#30), `build-cache-guardian` (#31), `swiftui-state-patterns` (#32), `ios-ssh-terminal` (#33), `ios-icloud-sync-agent` (#34), `hat-event-orchestrator` (#35), `ralph-cli-toolkit` (#36), `named-worktree-factory` (#37), `auto-claude-task-factory` (#38), `ios-perf-optimizer` (#39), `ios-keychain-patterns` (#40), `runtime-theme-engine` (#41), `three-layer-validation-stack` (#42), `multi-agent-dev-teams` (#43), `live-mermaid-editor` (#44), `agent-sdk-podcast-gen` (#45), `supabase-auth-migration` (#46), `cdp-automation-toolkit` (#47), `automated-app-auditor` (#48), `session-observer-framework` (#49), `api-limit-recovery` (#50), `ai-terminal-ui` (#51), `checkmark-progress-tracker` (#52), `admin-e2e-validator` (#53), `spec-rebuild-framework` (#54), `constitution-enforcer` (#55), `ralph-loop-patterns` (#56 — flagship overlap!), `orchestrated-tdd` (#57), `gap-analysis-tool` (#58), `gsd-framework` (#59), `ralplan-consensus` (#60), `docs-lookup-pipeline` (#61 — 5 stars, highest of cohort).

### Recommended Top-8 for Selective Re-Announce

Blog series was consolidated from 61 → 18 posts (per MEMORY.md 2026-03-06). Do **not** re-announce all 50 — most are thin. Re-announce these 8 for the withagents.dev brand (they have real conceptual weight or tie to Wave-1 18-post roadmap):

1. **docs-lookup-pipeline (#61)** — only companion with traction (5 stars); doc-lookup + caching is universal pain
2. **sequential-thinking-debugging (#17)** — 84-step root cause narrative maps to debugging post
3. **multi-agent-merge-orchestrator (#16)** — 35-worktree conflict-free story is vivid
4. **claude-mem-architecture (#15)** — cross-session observation store ties to memory post
5. **session-insight-miner (#29)** — JSONL miner complements sessionforge flagship
6. **playwright-validation-pipeline (#27)** — functional validation support repo
7. **kaizen-algorithm-tuning (#13)** — PDCA loops — shows methodology rigor
8. **agent-constitution-framework (#24)** — YAML constitution enforcement — brand-aligned

Rationale: these 8 map to distinct 18-post topics. Remaining 42 should stay published but not be re-announced — treat as appendix / "see also" footnotes.

## Active-30d Repos Not In Flagship List

From 36 repos pushed since 2026-03-20 (cross-ref with 30d mine), these are the non-flagship actives worth considering for narrative cross-links:

| Repo | Stars | Lang | Last Push | What it is |
|---|---|---|---|---|
| awesome-from-stars | 17 | Python | 2026-04-19 | Top-starred recent repo. No description. Likely star-backed awesome-list generator. Brand-worthy if fit. |
| awesome-list-site | 1 | TypeScript | 2026-03-23 | Pairs with awesome-from-stars. Dashboard builder for GitHub awesome lists. AI-powered search. |
| ralph-orchestrator-guide | 0 | Mermaid | 2026-04-18 | Getting-started guide for Rust agent fleet "Ralph" — self-referential loop platform. Complements ralph-loop-patterns. |
| shannon-cli | 1 | Python | 2026-03-25 | CLI companion to shannon-framework. No README excerpt captured. |
| yt-transition-shorts-detector | 1 | Python | 2026-04-09 | Detection engine + agent system (per CLAUDE.md project config). Niche, not brand-core. |
| autonomous-coder | 0 | Python | 2026-03-23 | TUI multi-agent orchestration on Claude Code SDK (Python). Overlaps scope with auto-claude-worktrees. |
| claude-skill-aso-appstore-screenshots | 1 | Python | 2026-03-30 | App Store screenshot automation via Claude skill. Niche but tangible utility. |
| cc-setup | 0 | JavaScript | 2026-03-20 | Claude Code setup helper. No description. Thin. |

**Other active-30d noise** (skip for brand): `t3code`, `opencode`, `dpcode`, `archon`, `moshi-skill`, `claude-code-leaked`, `neon-marketer-site`, `remodex`, `claw-code`, `claude-md`, `claude-code-analysis`, `claude-code`, `Understand-Anything`, `happy`, `anvil`. Several look like forks, AI-generated clones, or unrelated side-experiments. Flag `claude-code-leaked` and `claw-code` as potentially brand-hostile (descriptions mention "leaked" / "50K stars in 2 hours" — possible scraper/fork).

## Product → Repo Mapping

| Product | Primary Repo | Related (for cross-links) |
|---|---|---|
| **Validation platform** | validationforge | multi-agent-consensus, three-layer-validation-stack (#42), playwright-validation-pipeline (#27), admin-e2e-validator (#53), orchestrated-tdd (#57) |
| **Session intelligence / content** | sessionforge | session-insight-miner (#29), session-observability (#21), session-observer-framework (#49), claude-mem-architecture (#15) |
| **Code narration / audio** | code-tales, code-tales-platform | github-to-audio-pipeline (#19), agent-sdk-podcast-gen (#45) |
| **iOS client + bridges** | ils-ios | claude-ios-streaming-bridge, claude-sdk-bridge, ios-keychain-patterns (#40), ios-perf-optimizer (#39), ios-icloud-sync-agent (#34), ios-ssh-terminal (#33), swiftui-state-patterns (#32), multi-simulator-orchestrator (#30) |
| **Orchestration / loops** | auto-claude-worktrees, ralph-loop-patterns | multi-agent-merge-orchestrator (#16), named-worktree-factory (#37), auto-claude-task-factory (#38), hat-event-orchestrator (#35), ralph-cli-toolkit (#36), ralph-orchestrator-guide, autonomous-coder |
| **Methodology framework** | shannon-framework | shannon-cli, agent-constitution-framework (#24), constitution-enforcer (#55), spec-driven-execution (#25), spec-driven-implementation (#14), spec-rebuild-framework (#54), gsd-framework (#59), ralplan-consensus (#60) |
| **Skills + prompts infra** | claude-code-skills-factory, claude-prompt-stack | claude-code-discipline-hooks (#28), api-limit-recovery (#50) |
| **Design-to-code** | stitch-design-to-code | design-token-automation (#20), live-mermaid-editor (#44) |
| **Series hub** | agentic-development-guide | (all 50 companions) |

## Ownership Anomalies

- **ralph-loop-patterns is both a flagship AND companion #56** — need canonical billing in launch copy. Recommend treating as flagship; strike the #56 framing.
- **agentic-development-guide README still says "61 Lessons from 8,481 AI Coding Sessions"** — MEMORY.md shows canonical state is **18 lessons / 23,479 sessions**. README update is a Wave-1 prerequisite.
- **shannon-framework + shannon-cli split** — CLI repo has no description. Either consolidate or document the split.
- **code-tales (CLI, pip) + code-tales-platform (web, Next.js)** — dual-SKU story. Needs explicit "CLI vs Platform" framing in launch copy to avoid confusion.
- **Series post counts on flagship READMEs drift** — claude-ios-streaming-bridge says "Part 1", claude-sdk-bridge says "Part 2", claude-prompt-stack says "Part 5", stitch-design-to-code says "Part 9". These post numbers pre-date the 61→18 consolidation and will mislead readers. Needs normalized update.
- **awesome-video (1,853 stars, 2025-04-12)** is krzemienski's top repo by a huge margin but is video-streaming tooling, unrelated to agentic brand. Do not pull into brand narrative; acknowledge as "other work" if asked.
- **claude-code-builder (21 stars)**, **enhanced-claude-code (14 stars)**, **claude-code-ios-ui (6 stars)** — older (July–Nov 2025) but higher stargazer counts than most flagships. Possible brand heritage worth crediting as "predecessors."
- Several repos (**opencode, archon, dpcode, t3code, happy, anvil, claude-code-leaked, claw-code, claude-md, claude-code-analysis, Understand-Anything, moshi-skill, remodex**) appear to be forks or downloads of third-party projects pushed to this account on 2026-03-31 / 2026-04-06 / 2026-04-09 — **audit whether these should be in the `krzemienski` org at all** before launch. They dilute product inventory signal.

## Unresolved Questions

1. Is the series-size canon "18 posts / 23,479 sessions" or still "61 posts / 8,481 sessions"? Flagship READMEs and MEMORY.md disagree — one must win before Wave-1 copy.
2. Should the 50 companion repos (#12–#61) be formally deprecated, consolidated, or left as-is with an appendix pointer?
3. Are `opencode`, `claude-code-leaked`, `claw-code`, etc. intentional forks for study, or accidental pushes? They affect brand perception of the account.
4. Brand slug for withagents.dev: does the 18 vs 61 decision cascade into a rename of `agentic-development-guide` (e.g., to `withagents-guide`)?
5. Is there a public link target for `ai.hack.ski/blog/<slug>` placeholders in READMEs, or will that domain be retired in favor of `withagents.dev`?
6. sessionforge has 5 stars — the only flagship with traction. Is it already soft-launched, or is that incidental? Launch messaging depends on this.
7. Does `shannon-cli` need its own README + readiness tag, or is it bundled under shannon-framework for announce?
