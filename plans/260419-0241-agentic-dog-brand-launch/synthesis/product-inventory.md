# Product Inventory — withagents.dev

**Author:** Synthesis Agent SY-3
**Date:** 2026-04-19
**Sources:** Workstream A, B, C, D, F + `scripts/output/mine-360d-data.json` + `scripts/output/mine-30d-data.json` + `/tmp/gh-repos-raw.json`

## Summary (≤100 words, Round 4)

<!-- round4-2026-04-19 -->
**Round 4 rescope:** ~50 products across 7 families (validation, session/narrative, iOS/bridge, orchestration, methodology, skills, meta). **Flagship quintet** (not trio): validationforge (Day 01), CCB evolution (Day 10, 21⭐), Ralph orchestrator origin (Day 22), withagents-skills package (Day 35), combined SessionForge + Code Stories + manifesto finale (Day 50). Central narrative axis: every product tags a mode-bet — **SDK vs Interactive vs Non-Interactive**. Shannon ecosystem expanded from 1→4 posts. Ralph arc expanded from 1→3 posts. Skills become a first-class content track (6 skill-of-week + meta + package launch = 8 slots). R4 adds ~18 products as dedicated posts (CCB family, awesome-list evolution, autonomous-coder, cc-setup, opencode-mobile, ai-digest, claude-mobile-expo, claude-code-prd-creator, ClaudeCodeSDK, github-to-audio pipeline, live-mermaid-editor). See `scope-expansion-patch-round4.md` for full delta.
<!-- /round4-2026-04-19 -->

**Round 3 baseline (archived):** 32 products inventoried across 6 families (validation, session/narrative, iOS/bridge, orchestration, methodology, meta/secondary). **3 flagship-ready** (validationforge, sessionforge, code-story-platform) lead the 30-day push. **3 near-ready** (ils-ios, remodex, ralph-loop-patterns) fill mid-cycle slots after 1–2 week readiness work. **8 companion re-announces** from the 50-repo cohort earn dedicated calendar slots. **12 secondary products** appear as cross-links or appendix only. **6 not-this-cycle** are catalog-only. Every row's `arc_days`, `30d_agents`, `360d_files` is mine-verified, not guessed.

## Master Table

<!-- round4-2026-04-19: mode_bet column added -->
Columns updated Round 4: `mode_bet` = SDK / Interactive / Non-Interactive / Mixed. All existing rows retain R3 data; mode_bet inferred per product. New R4 rows appended under "R4 Additions" section below.

| product_key | display_name | github_repo | local_path | family | first_session | last_session | arc_days | 30d_agents | 360d_files | mode_bet | motivation | current_state | launch_readiness | drafted_content | missing_content | planned_calendar_slot | narrative_weight | companion_repo_tag | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| validationforge | ValidationForge | https://github.com/krzemienski/validationforge | `~/Desktop/validationforge` | validation | 2026-04-08 | 2026-04-18 | 10.2 | 257 | 310 | "Agents kept reporting build passed / task complete without running the real system." — Workstream A | active | ready_now | `post-03/post.md`, `post-03/social/linkedin-article.md`, `post-03/social/linkedin.md`, `post-03/social/twitter.md`, `post-03/social/newsletter.md` | new flagship landing page copy; VALIDATE-engine-specific X thread separate from post-03 general validation angle; LinkedIn article reframed around VF (not the "I banned unit tests" framing) | day-1 (flagship hero) | HIGH | no | PRD v2.0.0 + 16 benchmark dirs; MEMORY.md says VALIDATE beta, CONSENSUS/FORGE planned — launch must honor that |
| sessionforge | SessionForge | https://github.com/krzemienski/sessionforge | `~/Desktop/sessionforge` | session/narrative | 2026-03-02 | 2026-04-18 | 47.1 | 67 | 1055 | "What happened in the 4,500 sessions I've done? Raw JSONL logs existed but were unreadable artifacts." — Workstream A | active | 1-week | `post-09/post.md`, `post-09/social/linkedin-article.md`, `post-09/social/linkedin.md`, `post-09/social/twitter.md` | (newsletter retired in F) new SF product launch post (separate from post-09 miscount-reveal narrative); public demo screencast; landing-page "what is sessionforge" copy | day-~12 (flagship mid) | HIGH | no | 5 stars — only flagship with traction. Deployed to Vercel. Self-referential: mines its own sessions. |
| code-story-platform | Code Stories | https://github.com/krzemienski/code-tales-platform | `~/Desktop/code-story-platform` (stale on disk — actual dev in Replit agent branch) | session/narrative | 2026-01-19 | 2026-03-22 | 62.1 | 4 | 197 | "You need to functional val;idat the web app" — Nick discovered the web app produced stories but didn't prove they worked end-to-end. | active | 2-week | `post-09/post.md` (tangential; post-09 now mines sessionforge narrative, not Code Stories) | full net-new post for Code Stories product launch; LinkedIn article, X thread, newsletter, hero card, social cards; landing + demo | day-30 (flagship finale) | MED | no | CLI (code-tales pip) + Platform (code-tales-platform web) dual SKU — needs disambiguation copy |
| code-tales | code-tales (CLI) | https://github.com/krzemienski/code-tales | (not on disk — pip-installable) | session/narrative | — | — | 0 | 0 | 0 | GitHub → Claude narration → ElevenLabs TTS → audio story (9 narrative styles). | done | 1-week | none | code-tales CLI README walkthrough + X thread + "install in 30 seconds" LinkedIn short | day-30 companion to Code Stories platform launch | MED | no | pip-installable today; co-launch with code-story-platform as dual-SKU |
| ils-ios | ILS for iOS | https://github.com/krzemienski/ils-ios | `~/Desktop/ils-ios` | iOS/bridge | 2026-02-01 | 2026-03-25 | 51.9 | 94 | 3596 | "When I was away from desk, no way to browse skills, tweak MCP configs, or kick off sessions." Claude Code, but iOS-native. | near | 1-month | `post-05/post.md`, `post-05/social/linkedin-article.md`, `post-05/social/linkedin.md`, `post-05/social/twitter.md` | (post-05 newsletter retired — wrong topic); TestFlight-ready story; simulator screenshots current; f-bomb failure→recovery narrative post | day-10 (ils-ios demo) | HIGH | no | Activity dropped off after 2026-03-25 — needs pickup session before public demo. Signature f-bomb moment in transcript. |
| remodex | Remodex | https://github.com/krzemienski/remodex | `~/Desktop/remodex` | iOS/bridge | 2026-04-03 | 2026-04-17 | 13.9 | 180 | 271 | "Run Codex from iPhone — phone sends prompts, Mac runs Codex, iPhone streams output." Multi-provider bridge. | active | 1-month | none (no post in 18-post canon) | full net-new bridge-architecture post + LinkedIn article + X thread + newsletter + hero; "Bridge-side multiplexing" technical deep-dive | day-18 (bridge architecture story, product ships separately) | HIGH | no | 550MB over 14 days — newest, most active flagship. Open: Claude "Connecting..." gap still unresolved. Naming: Remodex vs Transduct? |
| ralph-loop-patterns | Ralph Loop | https://github.com/krzemienski/ralph-loop-patterns | (not on disk) | orchestration | — | — | 0 | 0 | 0 | Builder/writer/reviewer hat rotation with convergence detection — `pip install -e .` | done | ready_now | `post-08/post.md`, `post-08/social/linkedin-article.md`, `post-08/social/linkedin.md`, `post-08/social/twitter.md`, `post-08/social/newsletter.md` | withagents.dev-scoped re-announce X thread (post-08 hook retained, shorter format); domain-swapped LinkedIn article | day-5 | HIGH | no | Post-08 has strong "1:47 AM" narrative hook. Catalog collision: also tagged as companion #56. Treat as flagship, strike #56 framing. |
| auto-claude-worktrees | Auto-Claude Worktrees | https://github.com/krzemienski/auto-claude-worktrees | (not on disk) | orchestration | — | — | 0 | 0 | 0 | "194 parallel worktrees, 3,066 sessions — ideate → spec → worktree per spec → QA → priority merge." | done | ready_now | `post-06/post.md`, `post-06/social/linkedin-article.md`, `post-06/social/linkedin.md`, `post-06/social/twitter.md`, `post-06/social/newsletter.md` | domain swap only | day-7 | HIGH | no | Clean tool, clear pipeline. |
| multi-agent-consensus | Multi-Agent Consensus | https://github.com/krzemienski/multi-agent-consensus | (not on disk) | validation | — | — | 0 | 0 | 0 | "Caught a P2 streaming bug that a single reviewer approved." Lead/Alpha/Bravo unanimous gate voting. | done | ready_now | `post-02/post.md`, `post-02/social/linkedin-article.md`, `post-02/social/linkedin.md`, `post-02/social/twitter.md`, `post-02/social/newsletter.md` | domain swap only | day-3 | HIGH | no | Workstream F names this the 2nd-strongest hook after post-01. Pattern library + origin story. |
| shannon-framework | Shannon Framework | https://github.com/krzemienski/shannon-framework | (not on disk) | methodology | — | — | 0 | 0 | 0 | v5.6.0 4-layer enforcement (Commands/Skills/Hooks/Core) for mission-critical domains. 8D complexity scoring. | done | ready_now | `post-07/post.md`, `post-07/social/linkedin-article.md`, `post-07/social/linkedin.md`, `post-07/social/twitter.md`, `post-07/social/newsletter.md`; also referenced in post-16 | domain swap only | day-15 | MED | no | Mature versioned plugin; also backs post-16 (plugins). |
| shannon-cli | shannon-cli | https://github.com/krzemienski/shannon-cli | (not on disk) | methodology | — | — | 0 | 0 | 0 | CLI companion to shannon-framework. | stalled | not_this_cycle | none | skip or bundle | not scheduled | LOW | no | No README excerpt captured per Workstream B. Bundle under shannon-framework announce. |
| claude-prompt-stack | Claude Prompt Stack | https://github.com/krzemienski/claude-prompt-stack | (not on disk) | methodology | — | — | 0 | 0 | 0 | 7-layer defense-in-depth prompt engineering template. Hooks enforce build verify, block secrets, persist lessons. | done | ready_now | `post-07/post.md` (shares with Shannon) | standalone clone-and-go announce LinkedIn short + X callout | day-15 companion to shannon-framework OR standalone day-20 | MED | no | Template repo. |
| claude-ios-streaming-bridge | iOS Streaming Bridge | https://github.com/krzemienski/claude-ios-streaming-bridge | (not on disk) | iOS/bridge | — | — | 0 | 0 | 0 | Swift Package: iOS/macOS ↔ Claude Code via SSE. Extracted from ils-ios. | done | ready_now | `post-04/post.md`, `post-04/social/linkedin-article.md`, `post-04/social/linkedin.md`, `post-04/social/twitter.md`, `post-04/social/newsletter.md` | domain swap + header update (stale "Part 1" / "Part 2" per WSB) | day-9 | MED | no | Reusable Swift package. |
| claude-sdk-bridge | Claude SDK Bridge | https://github.com/krzemienski/claude-sdk-bridge | (not on disk) | iOS/bridge | — | — | 0 | 0 | 0 | Polyglot SDK bridge: iOS + Python + Node → Claude via one layer. 4 documented failure modes. | done | ready_now | none directly — post-04/post-18 reference it | LinkedIn short + "4 failure modes" X thread | day-20 | MED | no | Reference implementation with failure case studies. Stale "Part 2" header per WSB. |
| stitch-design-to-code | Stitch Design-to-Code | https://github.com/krzemienski/stitch-design-to-code | (not on disk) | meta | — | — | 0 | 0 | 0 | Stitch MCP + React + Puppeteer visual validation. 21 screens, 107 validation actions. | done | ready_now | `post-10/post.md`, `post-10/social/linkedin-article.md`, `post-10/social/linkedin.md`, `post-10/social/twitter.md`, `post-10/social/newsletter.md` | domain swap + stale "Part 9" header fix | day-17 | MED | no | Template repo. |
| claude-code-skills-factory | Skills Factory | https://github.com/krzemienski/claude-code-skills-factory | (not on disk — previously in disk graveyard per WSC) | meta | — | — | 0 | 0 | 0 | Factory pattern for authoring/evaluating/shipping Claude Skills + Agents. | done | ready_now | `post-03/post.md` (repo reference), `post-15/post.md` (anatomy) | LinkedIn short re-announce | day-22 | MED | no | Backs post-03 and post-15 (two posts reference same repo). |
| agentic-development-guide | Series Hub | https://github.com/krzemienski/agentic-development-guide | (not on disk as working repo) | meta | — | — | 0 | 0 | 0 | Meta-repo for the 18-post series. | active | ready_now | `post-01/post.md` + all 18 post repos cross-link here | README update: retitle from "61 Lessons / 8,481 Sessions" to "18 Lessons / 23,479 Sessions"; add withagents.dev domain pointer | pre-day-1 prep (hub must be canonical before day-1 goes live) | HIGH | no | Wave-1 prerequisite per Workstream B. Hub flagship. |
| blog-series | withagents.dev site | (no remote) | `~/Desktop/blog-series` | meta | 2026-03-05 | 2026-04-19 | 44.2 | 17 | 507 | The repo launching withagents.dev itself. | active | ready_now | 18 posts × 4 social formats (72 drafts) + DESIGN.md + migration plan | withagents.dev domain, rebuilt IA (home/projects/writing/series/now/work), newsletter capture, project cards, logo/favicon | underpins all 30 days (site must ship day-0) | HIGH | no | Must push to GitHub before launch. No remote set. Currently at `site-rho-pied.vercel.app`. |
| docs-lookup-pipeline | docs-lookup-pipeline | https://github.com/krzemienski/docs-lookup-pipeline | (not on disk) | orchestration | — | — | 0 | 0 | 0 | Documentation lookup + caching for agents. "Universal pain." | done | 1-week | none | net-new announce post (LinkedIn short + X thread + repo README polish) | day-25 | MED | yes (#61) | 5 stars — highest of 50-companion cohort. Only companion with traction. |
| sequential-thinking-debugging | Sequential-Thinking Debugging | https://github.com/krzemienski/sequential-thinking-debugging | (not on disk) | orchestration | — | — | 0 | 0 | 0 | 84-step root cause narrative. | done | ready_now | `post-13/post.md`, `post-13/social/linkedin-article.md`, `post-13/social/linkedin.md`, `post-13/social/twitter.md`, `post-13/social/newsletter.md` | domain swap only | day-19 re-announce | MED | yes (#17) | Vivid 84-step hook. |
| multi-agent-merge-orchestrator | Multi-Agent Merge | https://github.com/krzemienski/multi-agent-merge-orchestrator | (not on disk) | orchestration | — | — | 0 | 0 | 0 | 35-worktree conflict-free merge story. | done | ready_now | `post-14/post.md`, `post-14/social/linkedin-article.md`, `post-14/social/linkedin.md`, `post-14/social/twitter.md`, `post-14/social/newsletter.md` | post-14 newsletter repo URL fix (`spec-driven-implementation` → `multi-agent-merge-orchestrator`); domain swap | day-14 re-announce | MED | yes (#16) | Vivid "35 worktrees, 12 agents, zero conflicts" hook. |
| claude-mem-architecture | claude-mem | https://github.com/krzemienski/claude-mem-architecture | (not on disk) | orchestration | — | — | 0 | 0 | 0 | Cross-session observation store — "teaching AI to remember." | done | ready_now | `post-12/post.md`, `post-12/social/linkedin-article.md`, `post-12/social/linkedin.md`, `post-12/social/twitter.md`, `post-12/social/newsletter.md` | domain swap only | day-24 re-announce | MED | yes (#15) | |
| session-insight-miner | session-insight-miner | https://github.com/krzemienski/session-insight-miner | (not on disk) | session/narrative | — | — | 0 | 0 | 0 | JSONL miner; complement to sessionforge flagship. | done | ready_now | `post-09/post.md` (references repo) | standalone LinkedIn short cross-link | day-13 (companion to sessionforge mid-flagship) | MED | yes (#29) | Pairs with sessionforge launch. |
| playwright-validation-pipeline | Playwright Validation Pipeline | https://github.com/krzemienski/playwright-validation-pipeline | (not on disk) | validation | — | — | 0 | 0 | 0 | Functional validation support repo. | done | 1-week | none | net-new LinkedIn short + X thread "pipeline-as-code" angle | day-26 (validation cluster tail) | MED | yes (#27) | Pairs with VF flagship. |
| kaizen-algorithm-tuning | kaizen-algorithm-tuning | https://github.com/krzemienski/kaizen-algorithm-tuning | (not on disk) | methodology | — | — | 0 | 0 | 0 | PDCA loops; methodology rigor. | done | 1-week | none | LinkedIn short + X thread on measurement discipline | day-27 | LOW | yes (#13) | |
| agent-constitution-framework | Agent Constitution Framework | https://github.com/krzemienski/agent-constitution-framework | (not on disk) | methodology | — | — | 0 | 0 | 0 | YAML constitution enforcement. | done | 1-week | none | LinkedIn short + X thread tying to brand governance angle | day-28 | LOW | yes (#24) | Pairs naturally with Shannon methodology cluster. |
| claude-code-monorepo | Claude Code Monorepo | https://github.com/krzemienski/claude-code-monorepo | (not on disk) | meta | — | — | 0 | 0 | 0 | TypeScript SDK examples + CLI scripts. | done | ready_now | `post-17/post.md`, `post-18/post.md`, both with linkedin-article/linkedin/twitter; post-17 newsletter retired (wrong topic) | post-17 newsletter regen (CCB evolution angle); post-18 newsletter not audited (verify next pass) | day-21 + day-30 (split — post-17 CCB Evolution, post-18 SDK vs CLI finale) | MED | no | Backs two posts. Post-17 has strong "$47 bill" hook. |
| claude-code-ios | iOS Patterns Compendium | https://github.com/krzemienski/claude-code-ios | (not on disk) | iOS/bridge | — | — | 0 | 0 | 0 | Reference patterns from ils-ios development (post-05 repo). | done | ready_now | `post-05/post.md`, `post-05/social/linkedin-article.md`, `post-05/social/linkedin.md`, `post-05/social/twitter.md` (post-05 newsletter retired) | post-05 newsletter regen from iOS-patterns hook (not SDK bridge) | day-10 companion to ils-ios flagship | MED | no | Post-05 newsletter is broken — describes post-04 content. Must regen. |
| reponexus | reponexus | https://github.com/krzemienski/reponexus | (not on disk — local graveyard) | methodology | — | — | 0 | 0 | 0 | Spec execution framework. | stalled | not_this_cycle | `post-11/post.md` + socials point here | confirm repo live on GitHub before day-16 (WSC flags reponexus as ABANDONED locally) | day-16 re-announce IF GitHub remote is live | MED | no | Dependency on verification. Post-11 is drafted; repo status is the blocker. |
| nexus | nexus | (no remote — duplicate on `~/Desktop/nexus` + `~/nexus`) | `~/Desktop/nexus` + `~/nexus` | methodology | 2026-03-20 | 2026-03-21 | 1.0 | 3 | 15 | Unclear scope — 2026-03-20 "Initial commit" + "fix: address architect review conditions" across two dirs. | stalled | not_this_cycle | none | skip this cycle — no narrative motivation captured | not scheduled | LOW | no | Workstream C: which `nexus` is canonical? Dedupe before any action. |
| code-tales-ios | code-tales-ios | https://github.com/krzemienski/code-tales-ios | (local only, paused) | session/narrative | 2026-01-22 | 2026-01-27 | 4.7 | 0 | 252 | iOS client for Code Stories. Planned but no 30d activity. | stalled | not_this_cycle | none | skip; surfaces as "coming soon" note in Code Stories launch copy only | not scheduled (mention only) | LOW | no | No 30d transcripts — paused. |
| code-story-rn | code-story-rn | (assumed deprecated) | (local stale) | session/narrative | 2026-01-26 | 2026-01-26 | 0.2 | 0 | 31 | Abandoned React Native prototype for Code Stories. | abandoned | not_this_cycle | none | N/A | not scheduled | LOW | no | Abandoned. |
| shannon-mcp | shannon-mcp | https://github.com/krzemienski/shannon-mcp (local abandoned) | (graveyard) | methodology | — | — | 0 | 0 | 0 | MCP variant of Shannon; superseded by framework + CLI. | abandoned | not_this_cycle | none | N/A | not scheduled | LOW | no | WSC: abandoned. |
| autonomous-coder | Autonomous Coder | https://github.com/krzemienski/autonomous-coder | `~/Desktop/autonomous-coder` | orchestration | 2026-03-19 | 2026-03-21 | 2.2 | 54 | 160 | v3 Claude Agent SDK migration. TUI multi-agent orchestration. Overlaps `auto-claude-worktrees` scope. | active | not_this_cycle | none | skip unless chosen as canonical CCB (WSC open question) | not scheduled (pending canonical CCB decision) | LOW | no | Overlap with auto-claude-worktrees creates confusion. |
| ralph-orchestrator | ralph-orchestrator | (external: mikeyobrien/ralph-orchestrator) | `~/ralph-orchestrator` | orchestration | 2026-01-21 | 2026-03-26 | 64.0 | 7 | 926 | External reference — Rust agent fleet "Ralph." Not Nick's code. | stalled | not_this_cycle | none | N/A | not scheduled | LOW | no | External fork. Confused with Nick's `ralph-loop-patterns`. Do NOT launch as Nick's product. `ralph-orchestrator-guide` (Nick's Mermaid guide) is separate. |
| yt-transition-shorts-detector | YT Shorts Detector | https://github.com/krzemienski/yt-transition-shorts-detector | `~/Desktop/yt-transition-shorts-detector` | other | 2026-01-19 | 2026-04-17 | 88.0 | 199 | 1467 | YouTube Shorts detection accuracy regressed. OCR stall detection. | active | not_this_cycle | post-13 already references the 84-step debugging case study from this codebase | N/A as standalone product — stays as a case-study callback in post-13 | not scheduled | LOW | no | Longest arc (88 days) but not a shippable product. Workstream A: "instrument before theorize" principle may pull forward as general rule, not product launch. |
| awesome-from-stars | awesome-from-stars | https://github.com/krzemienski/awesome-from-stars | (disk unclear) | other | — | — | 0 | 0 | 0 | No description; 17 stars. | active | not_this_cycle | none | N/A | not scheduled | LOW | no | 17 stars — highest non-flagship. Off-brand — skip for withagents.dev launch; acknowledge only if asked. |
| awesome-list-site | awesome-list-site | https://github.com/krzemienski/awesome-list-site | `~/Desktop/awesome-list-site` | other | 2026-01-24 | 2026-03-23 | 57.8 | 0 | 182 | Pairs with awesome-from-stars. AI-powered awesome-list dashboard builder. | stalled | not_this_cycle | none | N/A | not scheduled | LOW | no | Off-brand. |

<!-- round4-2026-04-19: R4 Additions — new products & expanded ecosystems -->

## R4 Additions — New Product Rows

Added Round 4. Column schema matches master table above (with mode_bet).

### CCB Family (flagship-tier, Day 10)

| product_key | display_name | github_repo | local_path | family | arc_days | mode_bet | current_state | launch_readiness | planned_calendar_slot | narrative_weight | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-code-builder | claude-code-builder (canonical CCB) | https://github.com/krzemienski/claude-code-builder | `~/Desktop/claude-code-builder` | orchestration | ~180d cumulative across generations | Mixed | active | ready_now | Day 10 (flagship) | HIGH | 21⭐ — Nick's top-traction agentic product. 15+ generations on Desktop (ccb, ccb-0612, ccb-0614, ccb-final, ccb-m0, ccb-mem0, ccbios, ccbios-enhanced, claude-code-builder, claude-code-builder-0614, claude-code-builder-agents-sdk, autonomous-claude-code-builder, ccb-ui). Narrative: "Eighteen generations of an agent builder." |
| ccbios-enhanced | CCBios / ccbios-enhanced (iOS CCB) | (TBD — likely `krzemienski/ccbios-enhanced`) | `~/Desktop/ccbios-enhanced` | iOS/bridge + orchestration | TBD | SDK | active | 1-week | Day 11 | HIGH | iOS version of CCB. Pairs with Day 10 flagship. |

### Shannon Ecosystem (4 posts, Days 15-18)

| product_key | display_name | github_repo | mode_bet | narrative_weight | planned_calendar_slot | notes |
|---|---|---|---|---|---|---|
| shannon-framework | Shannon Framework | https://github.com/krzemienski/shannon-framework | Interactive | MED | Day 15 | (existing row retained in master table above) — 2⭐ |
| shannon-cli | Shannon CLI (stand-alone) | https://github.com/krzemienski/shannon-cli | Interactive | MED | Day 16 | **R4 promotion** — previously `not_this_cycle`, now dedicated post. 1⭐. |
| shannon-mcp | Shannon MCP (MCP server integration) | https://github.com/krzemienski/shannon-mcp | Interactive | MED | Day 17 | **R4 promotion** — R3 flagged abandoned; verify GitHub state Day −7. If confirmed abandoned, collapse to 2-post Shannon arc. |
| shannon-cc | Shannon CC (cross-compiled) | (TBD — verify repo) | Interactive | MED | Day 18 | **R4 NEW** — cross-Claude-Code integration. Verify repo exists Day −7. |

### Ralph Arc (3 posts, Days 22-24)

| product_key | display_name | github_repo | mode_bet | narrative_weight | planned_calendar_slot | notes |
|---|---|---|---|---|---|---|
| ralph-orchestrator | Ralph Orchestrator (origin) | https://github.com/krzemienski/ralph-orchestrator (**verify — R3 wrongly tagged external**) | Non-Interactive | HIGH | Day 22 (flagship) | **R4 correction:** User correction says this is Nick's code, not mikeyobrien fork. 64-day arc / 336MB / 926 files started 2026-01-21. Repo liveness verification Day −7. |
| ralph-orchestrator-ios | Ralph Orchestrator iOS | (TBD — separate repo or subfolder?) | Non-Interactive | HIGH | Day 23 | **R4 NEW** — iOS version; how to communicate with Ralph from mobile. Repo separation question open. |
| ralph-loop-patterns | RALPH Protocol (canonical) | https://github.com/krzemienski/ralph-loop-patterns | Non-Interactive | HIGH | Day 24 | **R4 recontextualization:** was single post in R3; now Day 24 of 3-post arc. Protocol emerged from iOS Ralph communication need. |

### Skills Track (8 slots, Days 34-40 + Day 35 flagship)

| product_key | display_name | repo | slot | notes |
|---|---|---|---|---|
| skill-of-week-1 | devlog-publisher skill spotlight | `claude-code-skills-factory` | Day 34 | Anatomy + usage guide |
| withagents-skills | **withagents-skills PACKAGE LAUNCH + meta-post** | `withagents-skills` (new — BUILD REQUIRED) | **Day 35 (flagship)** | 10-skill curated bundle + meta-post on skill design patterns. Requires software build pre-push (~20-30h not in 531-714h range). |
| skill-of-week-2 | functional-validation skill spotlight | `claude-code-skills-factory` | Day 36 | |
| skill-of-week-3 | ck-plan skill spotlight | `claude-code-skills-factory` | Day 37 | |
| skill-of-week-4 | visual-explainer skill spotlight | `claude-code-skills-factory` | Day 38 | |
| skill-of-week-5 | deepen-prompt-plan skill spotlight | `claude-code-skills-factory` | Day 39 | |
| skill-of-week-6 | ai-dev-operating-system skill spotlight | `ai-dev-operating-system` | Day 40 | OS-scale skill tier |

### R4-D5 Additional Products (~10 new dedicated posts)

| product_key | display_name | github_repo | mode_bet | planned_calendar_slot | notes |
|---|---|---|---|---|---|
| awesome-list-evolution | awesome-list evolution (combined narrative) | `awesome-list-site` + `awesome-list-site-v2` + `awesome-site` | SDK | Day 41 | **R4 reclassification** — R3 tagged off-brand/skip; R4 combines 3 repos into evolution narrative for withagents.dev launch. |
| cc-setup | cc-setup (setup automation) | (verify — likely `krzemienski/cc-setup`) | Interactive | Day 42 | 47 files / 36 agents burst. Setup automation story. |
| autonomous-coder | Autonomous Coder (promoted from not_this_cycle) | https://github.com/krzemienski/autonomous-coder | SDK | Day 43 | **R4 promotion** — R3 held pending CCB canon decision. R4 treats as distinct: v3 Agent SDK migration + TUI multi-agent orchestration. 54 agents / 160 files / 30d. |
| opencode-mobile | opencode-mobile (OSS coding agent + mobile) | (TBD verify) | SDK | Day 44 | OSS coding agent with mobile angle. |
| claude-mobile-expo | claude-mobile-expo (expo mobile client) | (TBD verify) | SDK | Day 45 | Expo-based Claude mobile client. |
| claude-code-prd-creator | claude-code-prd-creator (pre-code-access) | (TBD verify) | SDK | Day 46 | PRD creator that runs before code-access sessions. |
| live-mermaid-editor | live-mermaid-editor | (TBD verify) | Interactive | Day 47 | Live Mermaid diagram editor. |
| ai-digest-sprint | ai-digest + ai-digest-apps-worker (2-day sprint) | `ai-digest` + `ai-digest-apps-worker` | Mixed | Day 48 | Short focused Feb build story. |
| github-to-audio | github-to-audio pipeline (combined audio-from-repo) | `github-to-audio-pipeline` + `agent-sdk-podcast-gen` | SDK | Day 49 | User's "text video access asset" dictation interpreted here. |
| ClaudeCodeSDK | ClaudeCodeSDK (integration pattern repo) | `ClaudeCodeSDK` | SDK | Day 13 | Strengthens Day 12 Claude-SDK-Bridge into a 2-post arc. |
| claude-sdk-bridge-post | Claude SDK Bridge (promoted from short-slot) | https://github.com/krzemienski/claude-sdk-bridge | SDK | Day 12 | **R4 promotion** — R3 gave short-slot; R4 gives full post. 4 documented failure modes. |

### Meta-Pattern Posts (2 new)

| product_key | display_name | slot | notes |
|---|---|---|---|
| meta-orchestration-topology | "Orchestration Topology" | Day 04 | Cross-product pattern post. Spans SDK, Interactive, Non-Interactive. |
| meta-validation-6-products | "Validation across 6 products" | Day 51 | Cross-product pattern post. Follows Day 50 finale. |

<!-- /round4-2026-04-19 -->

## Flagship Quintet (Round 4)

<!-- round4-2026-04-19: flagship trio → quintet -->

**Day 01 — ValidationForge (HIGH, Interactive, ready_now):** unchanged from R3 — brand-defining product. Iron Rule = voice core. PRD v2.0.0 + 16 benchmark dirs. Honor MEMORY.md engine split (VALIDATE beta, CONSENSUS/FORGE planned).

**Day 10 — CCB Evolution (HIGH, Mixed, ready_now):** **R4 NEW.** `claude-code-builder` is Nick's top-traction agentic product at 21⭐. Narrative: "Eighteen generations of an agent builder" covering 15+ Desktop generations. Canonical-CCB decision required Day −10 (prefer `claude-code-builder`; disambiguate from `-agents-sdk` variant).

**Day 22 — Ralph Orchestrator Origin (HIGH, Non-Interactive, 1-week):** **R4 NEW.** User correction: Ralph is Nick's code. 64-day arc, 336MB, 926 files, started 2026-01-21. Anchors 3-post arc (Days 22 origin → 23 iOS → 24 RALPH protocol). Repo liveness verification Day −7.

**Day 35 — withagents-skills Package Launch + Meta-post (HIGH, Interactive, 2-week):** **R4 NEW.** Package launch bundles 10 curated skills; meta-post covers skill design patterns. Requires software build pre-push (~20–30h extra not in 531–714h estimate). Anchors Skills track (Days 34/36/37/38/39/40 spotlights).

**Day 50 — SessionForge milestone + Code Stories dual-SKU + Closing Manifesto (HIGH, Mixed, 2-week):** **R4 COMBINED finale.** Replaces R3's Day 30 Code Stories flagship. SessionForge milestone (5⭐, self-referential) + Code Stories dual-SKU (`code-tales` pip + `code-tales-platform` hosted) + manifesto pulling Insights 3 + 8. Split guidance: blog as 3-part; LinkedIn Article manifesto-only; X thread as 45-day arc synthesis.

<!-- /round4-2026-04-19 -->

### Flagship Trio (R3 archived)

**Day 1 — ValidationForge (HIGH narrative weight, ready_now):**
The brand-defining product. Every other product in this inventory exists because Nick decided that agents reporting "done" when nothing real ran was unacceptable. ValidationForge is the engine that enforces that decision. 310 files, 257 agents, 10-day arc ending 4 days before launch prep starts — most recent, most tooled. PRD v2.0.0 exists, 16 benchmark dirs exist, Iron Rule is the brand voice. Reframe post-03 ("I Banned Unit Tests") as the product launch post with a VF-first hook. Honor MEMORY.md: VALIDATE engine beta, CONSENSUS and FORGE planned.

**Day ~12 — SessionForge (HIGH narrative weight, 1-week readiness):**
Self-referential. SessionForge mines the sessions that produced SessionForge. 1055 files in 360d, deployed to Vercel, 5 GitHub stars (only flagship with traction). The narrative arc is the miscount reveal — "my subtitle said 4,500, the real number was 5x higher" — making this the most honest flagship story in the set. Post-09 already delivers the miscount hook; the product launch post is net-new work that sits alongside, not replacing, post-09.

**Day 30 — Code Stories (MED narrative weight, 2-week readiness — deliberate finale, not best-on-merits):**
Consumer-facing finale. GitHub repo → audio narrative. Dual-SKU launch: `code-tales` (pip CLI, ready today) + `code-tales-platform` (hosted Vercel one-click). Emotional close to the cycle: the technical products (VF, SF) open the month; a product a non-developer can hear opens the outside world to the work. Replaces the originally-considered ILS-iOS day-30 slot because ILS needs 1 month of readiness work and was paused 25 days ago.

## Re-announce Slate

**Dedicated 30-day calendar slots (8 of 50 companions):**

1. **docs-lookup-pipeline** (#61) — day-25 — only companion with real traction (5 stars)
2. **sequential-thinking-debugging** (#17) — day-19 — 84-step narrative, post-13 is drafted
3. **multi-agent-merge-orchestrator** (#16) — day-14 — "35 worktrees, zero conflicts" hook, post-14 drafted
4. **claude-mem-architecture** (#15) — day-24 — memory post-12 drafted
5. **session-insight-miner** (#29) — day-13 — pairs with SessionForge mid-flagship
6. **playwright-validation-pipeline** (#27) — day-26 — pairs with ValidationForge flagship
7. **kaizen-algorithm-tuning** (#13) — day-27 — methodology cluster
8. **agent-constitution-framework** (#24) — day-28 — methodology cluster

**Appendix-only (remaining 42 companions):** kept published, referenced by the series hub retitle, NOT re-announced individually. Rationale: Workstream B confirms 42 are thin bulk-generated skeletons — re-announcing them dilutes the signal from the 8 above.

## Not-this-cycle List

1. **shannon-cli** — no README, bundle under shannon-framework
2. **shannon-mcp** — abandoned; graveyard
3. **code-tales-ios** — paused since Jan 27; surfaces only as "coming soon" inside Code Stories launch
4. **code-story-rn** — abandoned RN prototype
5. **reponexus** — flagged ABANDONED locally by WSC; post-11 references it so verify repo is live before even considering a re-announce day-16 slot
6. **nexus** — two duplicate dirs, unclear canonical, no narrative motivation in session mine
7. **autonomous-coder** — overlaps with `auto-claude-worktrees`; pick canonical CCB (WSC open Q) before launching either under brand
8. **ralph-orchestrator** (external fork) — not Nick's code; must not appear in brand launch
9. **yt-transition-shorts-detector** — niche research tool, not a product; case study role in post-13 only
10. **awesome-from-stars**, **awesome-list-site** — off-brand; WSB flags as "other work"
11. **All remaining 42 companion repos** — appendix only
12. **External 30d-active forks/downloads** (opencode, dpcode, t3code, claw-code, claude-code-leaked, archon, etc.) — explicitly excluded. Workstream B flags claude-code-leaked / claw-code as potentially brand-hostile.

## Readiness Gates

Near-ready products and their specific blockers:

- **sessionforge** (1-week → ready_now by day-12 slot): needs (1) public demo screencast recorded against the Vercel deploy, (2) landing-page "what is sessionforge" copy disambiguating dashboard vs pipeline.
- **ils-ios** (1-month → targetable for day-10 only if accelerated): needs (1) one fresh pickup session to verify simulator boot + dashboard widget state (activity paused since 2026-03-25), (2) TestFlight build + screenshots, (3) f-bomb failure→recovery story drafted (has the most authentic voice material in the catalog but nothing written yet).
- **remodex** (1-month → targetable for day-18 only if Claude-provider gap closes): needs (1) "Claude Connecting..." gap fix (cited in WSA error samples), (2) Remodex vs Transduct naming decision (open WSA question), (3) bridge-architecture deep-dive post drafted from scratch.
- **code-story-platform / code-tales** (2-week → day-30): needs (1) full net-new post written (no post-09 equivalent; post-09 is about SessionForge narrative now), (2) LinkedIn article + X thread + newsletter + hero card + social cards, (3) landing page for dual-SKU framing (CLI vs Platform).
- **docs-lookup-pipeline** (1-week → day-25): needs (1) net-new announce post from scratch, (2) README polish (5-star repo but thin README), (3) LinkedIn short + X thread.
- **playwright-validation-pipeline**, **kaizen-algorithm-tuning**, **agent-constitution-framework** (1-week each → days 26–28): each needs a single net-new LinkedIn short + X thread. No flagship-scale assets.
- **agentic-development-guide** (ready_now but prerequisite): README must be retitled from "61 Lessons / 8,481 Sessions" to "18 Lessons / 23,479 Sessions" BEFORE day-1. This is a Wave-1 gating item.

<!-- round4-2026-04-19: R4 totals -->
## Round 4 Totals

- **Total products tagged in inventory:** ~50 (up from 32 in R3)
- **Products getting dedicated posts:** 45 (R4-D7 target)
- **Flagship quintet:** 5 (Days 01, 10, 22, 35, 50)
- **Skills track posts:** 8 (1 package-launch flagship + 1 meta + 6 skill-of-week spotlights)
- **Shannon ecosystem posts:** 4 (Days 15-18)
- **Ralph arc posts:** 3 (Days 22-24)
- **CCB family posts:** 2 (Days 10 + 11)
- **R4-D5 additional-product posts:** ~11 (includes meta-posts)
- **Existing light-edit posts reused:** ~15 (of 18 blog-series posts)
- **Net-new posts written for R4:** ~30
- **Mode-bet distribution (estimate):** ~15 SDK / ~15 Interactive / ~8 Non-Interactive / ~7 Mixed

See `calendar-45day.md` for per-day slotting. See `scope-expansion-patch-round4.md` for full delta from R3.

<!-- /round4-2026-04-19 -->

## Unresolved Questions

<!-- round4-2026-04-19: R4 additions prepended -->
**Round 4 additions (highest priority):**

R4.1. **CCB canonical repo** — `claude-code-builder` (21⭐) vs `autonomous-claude-code-builder` vs `claude-code-builder-agents-sdk`. Day −10 decision deadline.
R4.2. **Ralph-orchestrator ownership + liveness** — R3 tagged external fork (wrongly per user correction). Verify GitHub remote state, confirm Nick's code, Day −7.
R4.3. **`ralph-orchestrator-ios` separate-repo-or-subfolder** — affects Day 23 repo README slot.
R4.4. **Shannon ecosystem repo states** — shannon-mcp especially (R3 abandoned → R4 active assumption). Verify Day −7.
R4.5. **`withagents-skills` package scope** — which 10 skills bundle? + build effort not in 531–714h range (~20–30h extra).
R4.6. **User acknowledgment of 531–714h Mode 2 burden** — required before Mode 2 kickoff.
R4.7. **Shannon-CC repo existence** — "cross-compiled" term user-dictated; verify repo exists or fold into framework post.
R4.8. **R4-D5 repo URL verification** — opencode-mobile, claude-mobile-expo, claude-code-prd-creator, live-mermaid-editor, cc-setup — all need GitHub URL + local path verification Day −7.

**Round 3 carry-over:**

<!-- /round4-2026-04-19 -->

1. **Remodex vs Transduct naming** — WSA surfaced this; unresolved. Affects day-18 copy.
2. **Code Stories product split** — is `code-story-platform` canonical, or does the brand use "Code Tales" naming to match the pip repo? Affects day-30 positioning.
3. **Canonical CCB** — `autonomous-coder` vs `claude-code-builder-agents-sdk` vs `claude-code-monorepo` (post-17 references the monorepo). WSC open Q. Affects whether autonomous-coder stays not_this_cycle or promotes to day-21 co-slot.
4. **reponexus repo liveness on GitHub** — WSC flags local as abandoned; post-11 + socials point at this repo. If remote is dead, post-11 re-announce (day-16) is broken.
5. **Domain readiness** — every LinkedIn article footer hard-codes `site-rho-pied.vercel.app`, every newsletter hard-codes `withagents.dev` (WSF). Is withagents.dev live with SSL before domain-swap batch edits fire? Affects 32 file edits.
6. **Newsletter platform** — Substack vs Buttondown vs ConvertKit still open per WSF. 5 newsletters flagged for retire+regen are blocked until this is decided.
7. **Post-11 slug** — WSF: newsletter references stale `post-11-ai-dev-operating-system`; INDEX.md is `post-11-spec-driven-development`. Confirm canonical.
8. **Post-05 newsletter regen topic** — currently describes post-04 (iOS Streaming Bridge). Day-10 ils-ios slot depends on whether post-05 newsletter gets regen'd around iOS Patterns hook or is dropped entirely.
9. **yt-transition-shorts-detector "instrument before theorize" principle** — extract as a brand-level manifesto line (LinkedIn short) or leave inside post-13 only?
10. **blog-series push to GitHub** — WSC: repo has no remote. Day-0 site deploy depends on this being resolved (push to krzemienski/withagents or similar).
