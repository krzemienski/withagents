# 45-Day Content Calendar — withagents.dev Brand Launch (Round 4)

**Author:** Phase 06 Agent (Round 4 rescope)
**Date:** 2026-04-19
**Supersedes:** `calendar-30day.md` (archived — do not execute the 30-day version)
**Sources:** product-inventory.md (R4), approval-package.md (R4), narrative-spine.md (unchanged), voice-spec.md (unchanged), insight-library.md (unchanged)

## Summary

45 days (active-content window inside a 45–60 day push), **45 posts**, **5 flagships** (quintet, not trio), **~180 content pieces** across 4 channels (blog + LinkedIn Article + X thread + repo README — **no LinkedIn Shorts**). Central narrative axis: every post places a mode-bet on **SDK vs Interactive vs Non-Interactive**. Flagship quintet: **Day 01 ValidationForge GA**, **Day 10 CCB Evolution (21⭐ flagship)**, **Day 22 Ralph Loops Origin**, **Day 35 withagents-skills Package Launch + Meta-post**, **Day 50 SessionForge milestone + Code Stories dual-SKU + closing manifesto**. Every row carries an explicit `setup_for_next` — no orphan posts. 5 off-days + 1 rest week (days 30–33) inside the 45-day window; if the push extends to 60 days, a second rest week slots in days 52–55. **3 reserve insight posts** pre-drafted for emergency swap-in. Pre-push drafting target: **~90–110h** (up from 54h). During-push execution: **~45–68h** across 45–60 days.

---

## Channel Matrix (updated R4)

| Channel | Format | Effort/post | Notes |
|---|---|---|---|
| withagents.dev blog | Canonical long-form (1,500–2,200w) | ~3h | Always first to publish |
| LinkedIn **Article** (manual UI paste) | Long-form 800–1,500w | ~3h | **Replaces LinkedIn Short entirely** |
| X thread | 7–12 tweets | ~1h | API v2 paid tier ($100/mo) required |
| Repo README | "Featured in: {post}" patch | ~0.5h | gh CLI automated where possible |

**LinkedIn Shorts: REMOVED from channel matrix** (R4-D8). Every LinkedIn post is now an Article. Impact: ~45 LinkedIn Articles × 3h = ~135h LinkedIn alone.

**Per-post effort (non-flagship):** ~7.5h. Flagships: ~12–16h each.

---

## Central Narrative Axis — SDK vs Interactive vs Non-Interactive

Every row tags one **Mode-bet**. Definitions (per R4-D1):
- **SDK** — writing code to steer the AI (programmatic control, TypeScript/Python SDKs, Agent SDK integrations)
- **Interactive** — investing in hooks/skills/custom setup; guiding AI through environment shaping
- **Non-Interactive** — headless autonomous loops, Ralph-style self-referential execution, CI/CD agent runs
- **Mixed** — products that deliberately cross modes (e.g. bridges, orchestrators that host all three)

The narrative question under every post: *which mode did this product bet on, and what did 23,479 sessions reveal about that bet?*

---

## Pre-Push Checklist (Days −7 to −1)

Before Day 1 fires:

1. **Flagship quintet fully drafted + voice-reviewed (Opus, model-different reviewer):**
   - Day 01 — ValidationForge GA (~12h)
   - Day 10 — CCB Evolution: "Eighteen generations of an agent builder" (~16h — flagship-tier)
   - Day 22 — Ralph Loops Origin (~14h — arcs across 3 posts days 22/23/24)
   - Day 35 — withagents-skills package launch + meta-post (~14h)
   - Day 50 — SessionForge milestone + Code Stories dual-SKU + closing manifesto (~16h)

2. **Pre-push infrastructure (R4 carry-over from R3):**
   - `agentic-development-guide` README retitle (Wave-1 prerequisite)
   - `blog-series` repo pushed to GitHub (Day-0 blocker — no remote currently)
   - withagents.dev domain live with SSL, DNS wired, all 45 post routes resolving
   - Domain-swap batch edit across ~50 files (18 existing LinkedIn articles + reframes)
   - Newsletter platform decision (still open, non-blocking since R4 drops newsletter from matrix — **re-verify**)
   - X API v2 paid tier activated (≥22 dedicated threads across 45 days)

3. **Reserve insight posts (3 × ~2h = 6h):**
   - Reserve A: Insight 1 — "9.6:1 read-to-write ratio"
   - Reserve B: Insight 11 — "$47 overnight API bill"
   - Reserve C: Insight 13 — "Phone-to-desktop bridge" (pulled out of Day 18 fallback role into standing reserve)

4. **CCB canon decision (R4-D2):** "eighteen generations of an agent builder" arc requires canonical CCB repo. Candidates: `claude-code-builder` (21⭐), `autonomous-claude-code-builder`, `claude-code-builder-agents-sdk`. Decision needed Day −10.

5. **Ralph arc canon (R4-D4):** `ralph-orchestrator` (64d / 336MB / 926 files) is Nick's code per user correction — earlier inventory tagged it external-fork, that was wrong. Verify repo liveness + rewrite product-inventory row. Decision needed Day −7.

**Pre-push drafting target: 90–110h** (up from 54h in R3).

---

## The 45-Day Calendar

> Day 1 = user-picked start date. Flagship quintet rows are marked **FLAGSHIP**. `Setup for next` is mandatory — no orphan posts.

| Day | Day-type | Product/topic | Mode-bet | withagents.dev blog | LinkedIn Article | X thread | Repo README | Draft source | Setup for next post |
|---|---|---|---|---|---|---|---|---|---|
| **01** | **FLAGSHIP** | **ValidationForge GA** | Interactive | net-new (VF-first hook, 1,800w) | net-new (reframes post-03) | net-new (VALIDATE engine-specific) | `validationforge` retitle | Mix | Iron Rule "real system or nothing" becomes Day 02's premise — *what happens if a reviewer-agent rubber-stamps without consensus?* |
| 02 | Product | Multi-Agent Consensus | Interactive | light-edit post-02 | light-edit post-02 article | light-edit post-02 twitter | `multi-agent-consensus` | Existing | Consensus caught a P2 bug; sets up Day 03: *how do we know agents are reading, not just echoing?* |
| 03 | Insight | Insight 5 — "9.6:1 read-to-write ratio" | SDK | net-new 900w | net-new | net-new | — | Net-new | If agents are mostly readers, orchestration topology matters — Day 04. |
| 04 | Meta | Orchestration Topology (new meta-post #1) | Mixed | net-new 1,400w | net-new | net-new | — | Net-new | Topology needs isolation — Day 05 worktrees. |
| 05 | Product | Auto-Claude Worktrees | Non-Interactive | light-edit post-06 | light-edit post-06 article | light-edit post-06 twitter | `auto-claude-worktrees` | Existing | Worktree isolation enables hat-rotation — Day 06. |
| 06 | Off | — | — | — | — | — | — | — | **Off-day 1/5.** Reply to comments only. |
| 07 | Product | Ralph Loop Patterns (teaser — full arc Day 22-24) | Non-Interactive | light-edit post-08 | light-edit post-08 article | net-new withagents.dev-scoped | `ralph-loop-patterns` | Mix | "1:47 AM" hook plants Ralph flag; Day 08 expands to the builder. |
| 08 | Insight | Insight 6 — "3 agents caught P2 bug, 1 reviewer missed" | Interactive | net-new 800w | net-new | net-new | — | Net-new | Consensus economics → Day 09 SDK-vs-CLI bridge. |
| 09 | Product | iOS Streaming Bridge | SDK | light-edit post-04 (fix "Part 1" header) | light-edit post-04 article | light-edit post-04 twitter | `claude-ios-streaming-bridge` | Existing | SSE bridge sets up Day 10 flagship: the agent builder that ran on Nick's phone. |
| **10** | **FLAGSHIP** | **CCB Evolution: Eighteen generations of an agent builder** | Mixed | net-new 2,200w (all 18 CCB gens narrative) | net-new | net-new | `claude-code-builder` (21⭐) | Net-new | 21⭐ flagship closes with: *if the builder evolved 18 times, what does iOS version teach us?* — Day 11. |
| 11 | Product | CCBios / ccbios-enhanced (iOS CCB) | SDK | net-new 1,200w | net-new | net-new | `ccbios` | Net-new | iOS CCB needs a polyglot bridge — Day 12. |
| 12 | Product | Claude SDK Bridge (polyglot) | SDK | light-edit + header fix "Part 2" | light-edit + reframe | net-new "4 failure modes" | `claude-sdk-bridge` | Mix | Polyglot SDK needs documented reference — Day 13. |
| 13 | Product | ClaudeCodeSDK (github repo, integration pattern) | SDK | net-new 1,100w | net-new | net-new | `ClaudeCodeSDK` | Net-new | SDK patterns set up Day 14 prompt engineering defense-in-depth. |
| 14 | Product | Claude Prompt Stack (7-layer defense) | Interactive | light-edit post-07-companion | light-edit | net-new | `claude-prompt-stack` | Mix | Prompt stack → Shannon's 4-layer enforcement — Day 15. |
| 15 | Product | Shannon Framework (v5.6.0 4-layer) | Interactive | light-edit post-07 | light-edit post-07 article | light-edit post-07 twitter | `shannon-framework` (2⭐) | Existing | Framework → CLI companion — Day 16. |
| 16 | Product | Shannon CLI (stand-alone) | Interactive | net-new 1,000w | net-new | net-new | `shannon-cli` (1⭐) | Net-new | CLI → MCP integration — Day 17. |
| 17 | Product | Shannon MCP (MCP server integration) | Interactive | net-new 1,200w | net-new | net-new | `shannon-mcp` | Net-new | MCP → cross-Claude-Code integration — Day 18. |
| 18 | Product | Shannon CC (cross-compiled) | Interactive | net-new 1,000w | net-new | net-new | `shannon-cc` | Net-new | Shannon ecosystem complete; sets up Day 19 memory question — *how do cross-CC agents share state?* |
| 19 | Product | claude-mem Architecture | Interactive | light-edit post-12 | light-edit post-12 article | light-edit post-12 twitter | `claude-mem-architecture` | Existing | Cross-session memory → Day 20 session mining. |
| 20 | Product | session-insight-miner (companion) | Non-Interactive | net-new 900w | net-new | net-new | `session-insight-miner` | Net-new | Session mining proves Day 21: the hidden 18,945 agent-spawned sessions. |
| 21 | Insight | Insight 4 — "81% of sessions are agents spawning agents" | Non-Interactive | net-new 1,100w | net-new | net-new | — | Net-new | If 81% is autonomous, we need a self-referential loop — Day 22 flagship. |
| **22** | **FLAGSHIP** | **Ralph Orchestrator — the self-referential loop origin** | Non-Interactive | net-new 2,000w (64d arc narrative) | net-new | net-new | `ralph-orchestrator` (first party) | Net-new | Ralph origin plants the "how do you talk to it?" question — Day 23 iOS Ralph. |
| 23 | Product | Ralph Orchestrator iOS | Non-Interactive | net-new 1,400w | net-new | net-new | `ralph-orchestrator-ios` | Net-new | iOS communication with Ralph forced a new protocol — Day 24 RALPH protocol. |
| 24 | Product | RALPH Protocol (how it emerged) | Non-Interactive | net-new 1,300w | net-new | net-new | `ralph-loop-patterns` (canonical) | Net-new | Protocol defined → Day 25 sequential-thinking debugging in Ralph. |
| 25 | Product | Sequential-Thinking Debugging | Non-Interactive | light-edit post-13 (em-dash trim to ≤5/1k) | light-edit post-13 article | light-edit post-13 twitter | `sequential-thinking-debugging` | Existing | 84-step debugging → Day 26 merge orchestration. |
| 26 | Product | Multi-Agent Merge Orchestrator | Non-Interactive | light-edit post-14 (repo URL fix) | light-edit post-14 article | light-edit post-14 twitter | `multi-agent-merge-orchestrator` | Existing | 35-worktree merge → Day 27 validation pipeline. |
| 27 | Product | Playwright Validation Pipeline | Interactive | net-new 900w | net-new | net-new | `playwright-validation-pipeline` | Net-new | Validation cluster → Day 28 methodology cluster. |
| 28 | Product | Kaizen Algorithm Tuning | Interactive | net-new 800w | net-new | net-new | `kaizen-algorithm-tuning` | Net-new | PDCA → Day 29 constitution enforcement. |
| 29 | Product | Agent Constitution Framework | Interactive | net-new 1,000w | net-new | net-new | `agent-constitution-framework` | Net-new | Constitution → Day 30 rest week: reflect on Week 4. |
| 30 | Off | — | — | — | — | — | — | — | **Off-day 2/5 + REST WEEK start (days 30–33).** |
| 31 | Off / Devlog | Week 4 retro devlog | Mixed | net-new 500w devlog | — | net-new "mid-push shipping diary" | — | Net-new | Devlog names what's left — sets up Day 34 skills arc. |
| 32 | Off | — | — | — | — | — | — | — | **Off-day 3/5.** |
| 33 | Off | — | — | — | — | — | — | — | Rest week end. |
| 34 | Skills-track | Skill of the Week #1 — devlog-publisher | Interactive | net-new 1,100w (skill anatomy) | net-new | net-new | `claude-code-skills-factory` | Net-new | Skills showcase → Day 35 flagship package launch. |
| **35** | **FLAGSHIP** | **withagents-skills Package Launch + Meta-post on skill design** | Interactive | net-new 2,000w (meta + 10-skill curated showcase) | net-new | net-new | `withagents-skills` (new) | Net-new | Package launched → Day 36 first of weekly skill spotlights. |
| 36 | Skills-track | Skill of the Week #2 — functional-validation | Interactive | net-new 1,000w | net-new | net-new | `claude-code-skills-factory` | Net-new | Validation skill → Day 37 planning skill. |
| 37 | Skills-track | Skill of the Week #3 — ck-plan | Mixed | net-new 900w | net-new | net-new | `claude-code-skills-factory` | Net-new | Planning skill → Day 38 visual explainer. |
| 38 | Skills-track | Skill of the Week #4 — visual-explainer | Interactive | net-new 900w | net-new | net-new | `claude-code-skills-factory` | Net-new | Visual → Day 39 deepen-prompt-plan. |
| 39 | Skills-track | Skill of the Week #5 — deepen-prompt-plan | Interactive | net-new 900w | net-new | net-new | `claude-code-skills-factory` | Net-new | Plan stress-testing → Day 40 OS-scale skill. |
| 40 | Skills-track | Skill of the Week #6 — ai-dev-operating-system | Mixed | net-new 1,100w | net-new | net-new | `ai-dev-operating-system` | Net-new | OS-scale → Day 41 awesome-list evolution. |
| 41 | Product | awesome-list evolution (awesome-list-site + v2 + awesome-site combined) | SDK | net-new 1,200w | net-new | net-new | `awesome-list-site` + `awesome-list-site-v2` | Net-new | Awesome-list → Day 42 setup automation. |
| 42 | Product | cc-setup (47 files / 36 agents burst narrative) | Interactive | net-new 1,000w | net-new | net-new | `cc-setup` | Net-new | Setup automation → Day 43 autonomous-coder. |
| 43 | Product | Autonomous Coder (v3 Agent SDK, 54 agents) | SDK | net-new 1,100w | net-new | net-new | `autonomous-coder` | Net-new | Autonomous coder → Day 44 OSS mobile. |
| 44 | Product | opencode-mobile (OSS coding agent + mobile) | SDK | net-new 1,100w | net-new | net-new | `opencode-mobile` | Net-new | OSS mobile → Day 45 expo mobile client. |
| 45 | Product | claude-mobile-expo | SDK | net-new 1,000w | net-new | net-new | `claude-mobile-expo` | Net-new | Mobile clients land → Day 46 PRD creator pre-code. |
| 46 | Product | claude-code-prd-creator (pre-code-access) | SDK | net-new 1,000w | net-new | net-new | `claude-code-prd-creator` | Net-new | PRD creator → Day 47 live mermaid editor. |
| 47 | Product | live-mermaid-editor | Interactive | net-new 900w | net-new | net-new | `live-mermaid-editor` | Net-new | Diagramming → Day 48 ai-digest sprint. |
| 48 | Product | ai-digest + ai-digest-apps-worker (2-day sprint narrative) | Mixed | net-new 900w | net-new | net-new | `ai-digest` + `ai-digest-apps-worker` | Net-new | Short sprint → Day 49 audio pipeline. |
| 49 | Product | github-to-audio pipeline (github-to-audio-pipeline + agent-sdk-podcast-gen combined) | SDK | net-new 1,200w | net-new | net-new | `github-to-audio-pipeline` + `agent-sdk-podcast-gen` | Net-new | Audio from repo → Day 50 flagship finale with Code Stories dual-SKU. |
| **50** | **FLAGSHIP** | **SessionForge milestone + Code Stories dual-SKU + Closing Manifesto** | Mixed | net-new 2,400w (3-part: SF milestone, Code Stories launch, manifesto closer pulling Insights 3+8) | net-new (manifesto-body long-form) | net-new (45-day arc synthesis thread) | `sessionforge` + `code-tales` + `code-tales-platform` | Mix | Finale plants 90-day followup arc. |
| 51 | Meta | "Validation across 6 products" meta-pattern post (new meta-post #2) | Interactive | net-new 1,400w | net-new | net-new | — | Net-new | Cross-product validation patterns → Day 52 docs lookup. |
| 52 | Product | docs-lookup-pipeline (5⭐ companion) | Interactive | net-new 900w (README polish + launch) | net-new | net-new | `docs-lookup-pipeline` | Net-new | Docs pipeline → Day 53 stitch design-to-code. |
| 53 | Product | Stitch Design-to-Code | Interactive | light-edit post-10 (fix "Part 9" header) | light-edit post-10 article | light-edit post-10 twitter | `stitch-design-to-code` | Existing | Design-to-code → Day 54 skills factory meta. |
| 54 | Product | Skills Factory | Interactive | light-edit post-15 | light-edit post-15 article | light-edit post-15 twitter | `claude-code-skills-factory` | Existing | Factory → Day 55 iOS patterns compendium. |
| 55 | Product | iOS Patterns Compendium (claude-code-ios) | SDK | light-edit post-05 | light-edit post-05 article | light-edit post-05 twitter | `claude-code-ios` | Existing | Patterns → Day 56 ils-ios demo (conditional). |
| 56 | Product | ILS for iOS (conditional — see Risk Gates) | Interactive | light-edit post-05-companion OR reserve swap-in | conditional | conditional | `ils-ios` | Mix | ILS-iOS → Day 57 remodex bridge architecture. |
| 57 | Product | Remodex (bridge architecture, conditional on naming resolution) | Mixed | net-new OR Reserve C "phone-to-desktop bridge" | net-new or reserve | net-new | `remodex` | Mix | Bridge architecture → Day 58 SDK vs CLI finale. |
| 58 | Product | SDK vs CLI decision framework (post-18 light-edit) | SDK | light-edit post-18 | light-edit post-18 article | light-edit post-18 twitter | `claude-code-monorepo` | Existing | Decision framework → Day 59 spec-driven wrap. |
| 59 | Product | Spec-Driven Development (post-11; verify reponexus repo live) | Mixed | light-edit post-11 (conditional on repo verification) | light-edit | light-edit | `reponexus` (verify) | Existing (conditional) | Spec-driven → Day 60 final devlog. |
| 60 | Devlog | 45-day retro + 90-day forward map | Mixed | net-new 1,800w (honest numbers, what worked, what didn't, what's next) | net-new | net-new | — | Net-new | Closes push; opens Week-7 engagement buffer. |

### Off-days distribution (5 total within 45-day active window, + rest week)

Off-days: **6, 30, 32, 33** (4 inside 45-day window). 5th off-day + rest week spans days **30–33**. If push extends to 60 days, second rest week slots **52–55** (optional — calendar above fills 50–60 with product content assuming straight push).

**Net deliverable count (60-day push):** 60 total days, 54 active content days, 5 off-days, rest week baked in.

---

## Flagship Quintet Annotations

### Day 01 — ValidationForge GA (unchanged from R3)
- **Why flagship:** brand-defining product. PRD v2.0.0 + 16 benchmark dirs + Iron Rule.
- **Mode-bet:** Interactive — hooks/skills making completion theater structurally impossible.
- **Risk:** Honor MEMORY.md — VALIDATE beta, CONSENSUS/FORGE planned. Do not overclaim engines.

### Day 10 — CCB Evolution (NEW R4-D2 flagship)
- **Why flagship:** `claude-code-builder` is Nick's top-traction agentic product at 21⭐. 15+ generations on Desktop (ccb, ccb-0612, ccb-0614, ccb-final, ccb-m0, ccb-mem0, ccbios, ccbios-enhanced, claude-code-builder, claude-code-builder-0614, claude-code-builder-agents-sdk, autonomous-claude-code-builder, ccb-ui) — the evolutionary arc *is* the story.
- **Mode-bet:** Mixed — CCB lineage crosses SDK, Interactive, and Non-Interactive across generations.
- **Risk:** Canonical CCB decision required Day −10. If `claude-code-builder-agents-sdk` ≠ `claude-code-builder`, disambiguation copy needed in the post.

### Day 22 — Ralph Orchestrator Origin (NEW R4-D4 flagship)
- **Why flagship:** 64-day arc, 336MB, 926 files, started 2026-01-21. **User correction: this is Nick's code, not external fork.** Prior inventory was wrong.
- **Mode-bet:** Non-Interactive — Ralph is the canonical self-referential autonomous loop.
- **Arc:** Days 22/23/24 tell the full story — origin → iOS communication → protocol emergence.

### Day 35 — withagents-skills Package Launch + Meta-post (NEW R4-D6 flagship)
- **Why flagship:** Skills are a first-class content track per R4-D6. Package launch bundles 10 curated skills + meta-post on skill design patterns.
- **Mode-bet:** Interactive — skills are the canonical interactive-mode product.
- **Dependencies:** 6 skill-of-the-week posts (days 34, 36, 37, 38, 39, 40) set up the package launch. Meta-post runs same day as launch.

### Day 50 — SessionForge + Code Stories + Closing Manifesto (COMBINED finale, R4-D9)
- **Why flagship:** Multi-product finale. SessionForge milestone (5⭐, self-referential), Code Stories dual-SKU (emotional consumer close), manifesto pulling Insights 3 + 8 as primary.
- **Mode-bet:** Mixed — SessionForge is Non-Interactive (automated mining), Code Stories is SDK+Interactive, manifesto transcends modes.
- **Risk:** 3 products in one day is dense — consider day-50 blog post as 3-part, LinkedIn Article as manifesto-only, X thread as 45-day synthesis.

---

## X API Thread Count Estimate (Round 4)

**Total X threads across 45-day active window: ~40** (every active-content day except off-days carries a thread).

**Total across 60-day push: ~48** if extended.

**Recommendation: $100/mo X API v2 paid tier — required.** 40 threads exceeds the 10-thread threshold by 4x; manual posting at this cadence is infeasible.

---

## Total Content Pieces Count (Round 4)

| Type | Count (45-day) | Count (60-day) | Notes |
|---|---|---|---|
| withagents.dev blog posts | ~42 | ~52 | 5 flagship + ~37 product/skills/insight/meta |
| LinkedIn Articles (long-form) | ~42 | ~52 | Every active post gets an Article. **No LinkedIn Shorts.** |
| X threads | ~40 | ~48 | $100/mo tier required |
| Repo READMEs updated | ~30 | ~38 | All re-announce and net-new product days |
| Devlog entries | 2 | 3 | Days 31, 60 (+1 if 60-day) |
| **TOTAL content pieces** | **~156** | **~193** | **Plus 3 reserve insight posts pre-drafted** |

R3→R4 delta: 99 pieces → ~156–193 pieces (1.6x–2.0x).

**Existing drafts reused (light-edit):** ~30 pieces from Workstream F (18 existing post repos × subset of social files).
**Net-new pieces written:** ~126–163.

---

## Pre-Push Drafting Hours Estimate (Round 4)

| Deliverable | Count | Hours/each | Subtotal |
|---|---|---|---|
| Flagship launch posts (full: blog + LinkedIn Article + X thread + assets) | 5 | ~14h (avg) | 70h |
| Product posts drafted to ≥80% + hero outlined | 8 | ~3h | 24h |
| Reserve emergency insight posts | 3 | 2h | 6h |
| LinkedIn Articles (manual-UI-ready, flagship companions) | 5 | 2h | 10h |
| **TOTAL pre-push drafting target** | — | — | **~110h** |

**During-push cadence (Round 4):**
- Week 1 (Days 1–7): ~35h (Flagship 1 + 4 posts)
- Week 2 (Days 8–14): ~35h (Flagship 2 + 5 posts)
- Week 3 (Days 15–21): ~35h (Shannon ecosystem + Insight)
- Week 4 (Days 22–29): ~45h (Flagship 3 Ralph arc + 5 methodology posts)
- Rest week (Days 30–33): ~5h (devlog only)
- Week 5 (Days 34–40): ~35h (Skills track × 6 + Flagship 4 package launch)
- Week 6 (Days 41–49): ~40h (9 product posts)
- Week 7 finale (Day 50): ~15h (Flagship 5 multi-product close)
- Week 8 (Days 51–60): ~40h (10 product/meta posts)
- **Total during-push: ~285h** across 45–60 days

**Grand total push effort:** **395–460h** across 45–60 days + pre-push week (vs R3's 138h).

*(Note: approval-package.md R4 reports 531–714h as Mode-2-inclusive total including Phases 08–11+13 infrastructure runway. The calendar-only figure above excludes that runway.)*

---

## Risk Gates per Flagship / High-Risk Day

| Day | Risk | Fallback | Trigger |
|---|---|---|---|
| Day 01 | VF engine disambiguation (beta vs planned) | publish with MEMORY.md labels intact | if copy drifts from "VALIDATE beta, CONSENSUS/FORGE planned" |
| Day 10 | CCB canonical repo undecided | pick `claude-code-builder` (21⭐); relegate SDK variant to Day 13 | if decision not committed Day −10 |
| Day 22 | `ralph-orchestrator` repo-liveness unverified | pull Ralph arc to Day 24 only (RALPH protocol); drop origin post | if repo not verified live Day −7 |
| Day 23 | `ralph-orchestrator-ios` repo doesn't exist as separate repo | fold into Day 24 RALPH protocol post as sub-section | if repo not extracted by Day −5 |
| Day 35 | `withagents-skills` package not built | manifesto-only: meta-post on skill design without package announce | if package build not ≥80% by Day 30 |
| Day 50 | 3-products-in-1-day overload | split: SessionForge milestone → Day 49, Code Stories → Day 51 product slot, manifesto-only Day 50 | if Day 48 voice review flags cognitive overload |
| Day 56 | ILS-iOS readiness (paused since 2026-03-25) | Reserve C swap-in | if pickup session not logged by Day 54 |
| Day 57 | Remodex naming unresolved + Claude "Connecting..." gap | Reserve C swap-in (if Day 56 didn't already consume it) or Insight 13 short blog | if naming + gap not committed Day 55 |

**Reserve insight posts standing by (3):** Insight 1, Insight 11, Insight 13. Any can substitute at ≤24h notice.

---

## Post-Push Buffer Recommendation (Round 4)

**Week 9–10 (post-Day 60):** Strict engagement-only buffer. No new content. Reply to LinkedIn Article comments, X mentions, GitHub issues on the ~30 repos that got README updates. Goal: consolidate 45–60 day attention, convert inbound into newsletter signups + consulting inquiries (per §13 approval-package metrics).

**Week 11:** Publish "45/60-day retro" devlog on withagents.dev — honest numbers, what worked, what didn't, what the reader should do next. Only new content in weeks 9–11.

---

## Unresolved Questions (Round 4-specific)

1. **CCB canonical repo** — `claude-code-builder` (21⭐) vs `autonomous-claude-code-builder` vs `claude-code-builder-agents-sdk` — Day −10 decision.
2. **Ralph repo liveness** — user correction flagged `ralph-orchestrator` as Nick's code; product-inventory.md row was wrong. Verify GitHub remote + rewrite inventory row by Day −7.
3. **`ralph-orchestrator-ios` separation** — is this a separate repo or a folder inside `ralph-orchestrator`? Affects Day 23 repo README slot.
4. **`withagents-skills` package scope** — which 10 skills bundle? Pull from user's list (devlog-publisher, functional-validation, ck-plan, visual-explainer, deepen-prompt-plan, ai-dev-operating-system + 4 more).
5. **Shannon ecosystem repo statuses** — `shannon-mcp` was flagged abandoned in R3 product-inventory; R4 re-scoped as active. Verify GitHub state by Day −7.
6. **Code Stories product name disambiguation** — still unresolved from R3 (Q2 in product-inventory.md). Affects Day 50 copy.
7. **User acknowledgment of 531–714h Mode 2 burden** — required before Mode 2 kickoff (see approval-package.md §15 R4 decision ask).
8. **2 ambiguous user-dictation items** — "Departed" and "text video access asset" — user said proceed-on-guesses OK; "text video access asset" interpreted as Day 49 `github-to-audio-pipeline`. "Departed" unresolved; treat as non-blocking.
9. **Newsletter platform decision** — R4 drops newsletters from channel matrix; is newsletter fully out of scope for launch, or is it opt-in Week 9+? (Approval-package.md remains silent on this.)
10. **60-day extension trigger** — if pre-push drafting slips past ~110h and Day 1 delays, does 60-day calendar collapse to 45-day or does rest week slip to week 8? Needs sign-off pre-push.
