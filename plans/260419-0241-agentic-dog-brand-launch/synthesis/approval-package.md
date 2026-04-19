# Mode 1 Approval Package — withagents.dev Brand Launch
**Decision gate. Do not advance to Mode 2 without explicit sign-off.**

**Plan:** `plans/260419-0241-agentic-dog-brand-launch/`
**Date:** 2026-04-19
**Status:** Mode 1 complete. Pending user go/no-go.

---

## 1. One-page summary

<!-- round4-2026-04-19: rescope summary -->

**withagents.dev becomes the canonical surface for Nick Krzemienski's agentic-development work** — the consulting umbrella, the flagship product index, the long-form writing home. The discipline that defines the brand: *the real system or nothing.* No mocks, no stubs, no green checks against code nobody ran. **Central narrative axis (R4):** every post bets on one of three modes — **SDK** (writing code to steer the AI), **Interactive** (hooks/skills/environment shaping), or **Non-Interactive** (headless autonomous loops, Ralph-style). 23,479 sessions stress-tested the boundaries.

**The 45–60 day push ships five flagship launches + expanded product coverage (R4 rescope):** Day 01 ValidationForge GA, Day 10 CCB Evolution (21⭐ flagship — "eighteen generations of an agent builder"), Day 22 Ralph Orchestrator origin (anchor of 3-post arc), Day 35 withagents-skills package launch + meta-post, Day 50 SessionForge milestone + Code Stories dual-SKU + closing manifesto. **45 total posts** including 4-post Shannon ecosystem, 3-post Ralph arc, 8-slot Skills track, ~11 R4-added products. **~156–193 content pieces** across 4 channels: blog + LinkedIn **Article** (long-form, manual) + X thread + repo README. **LinkedIn Shorts removed from matrix.**

**Mode 2 requires 18–24 weeks solo (531–714 hours)** before Day 1 of the push can fire. Phase 12 (the 45–60 day push itself) is 45–60 of those days; Phases 08–11 + 13 are the runway that must land first.

**Primary risk:** 45 LinkedIn Articles × 3h each = ~135h LinkedIn alone — the biggest single-channel time sink. Secondary risk: sequential `setup_for_next` narrative chain creates dependency brittleness (miss post N → post N+1 feels orphaned). Mitigated by ~110h pre-push drafting target, 3 reserve insight posts, rest week (Days 30–33), 5 off-days.

**Status:** Mode 1 deliverables complete — 8 research reports, 4 synthesis docs + patch log, 7 phase files, red-team review, deepen redlines, **Round 4 scope expansion applied**. Ready for go/no-go **at expanded scope**.

<!-- /round4-2026-04-19 -->

**Round 3 summary (archived for audit):** 30-day push, 3 flagships (VF/SF/Code Stories), 99 pieces, 258–343h / 9–12 weeks.

---

## 2. Audit findings digest

<!-- round4-2026-04-19: R4 scope expansion note -->
**Round 4 rescope note (2026-04-19):** After Phase 02 audit completed, user directives 05:15–05:20 surfaced 3 missed product categories — full CCB family lineage (Nick's top-traction 21⭐ product was under-weighted), full Ralph arc (ralph-orchestrator wrongly tagged external-fork; 64-day arc actually Nick's code), full Shannon ecosystem (3 of 4 Shannon repos were dismissed or bundled in R3). R4 product-inventory.md patched with these additions + ~11 more dedicated product posts (see `scope-expansion-patch-round4.md` for full delta). Audit workstreams A-H themselves unchanged; research base still sound.

<!-- /round4-2026-04-19 -->

**Workstream A (Session Archaeology):** One through-line dominates five flagships — "the real system is broken, don't fake the fix." Every flagship was forged by Nick breaking a stuck agent-loop with a direct voice command. ValidationForge is the compilation of that rule into hooks + benchmarks. Link: `research/A-session-archaeology.md`.

**Workstream B (GitHub 300-Repo Catalog):** 15 flagships identified; 50 "Agentic Development #N" companion repos exist but 42 are thin bulk-generated skeletons. Top-8 re-announce slate recommended (docs-lookup-pipeline #61 is the only companion with traction at 5 stars). Link: `research/B-github-catalog.md`.

**Workstream C (Desktop Scan):** 192 git repos on Desktop (22 active ≤30d). Critical: `blog-series` repo has **no git remote set** — blocks Day-0 deploy. `nexus` duplicated in two directories, canonical unclear. Link: `research/C-desktop-product-scan.md`.

**Workstream D (Blog-Series Audit):** Next.js 16 site at `site-rho-pied.vercel.app` renders all 18 posts. Frontmatter consistent (`series_total: 18`, Nick Krzemienski, 2026-03-06). Posts live in BOTH `posts/` and `site/posts/` (sync requirement). Migration to Astro+Keystatic is near-wholesale; admin API + Supabase layers may retire. Link: `research/D-blog-series-audit.md`.

**Workstream E (Skills Matrix):** 8 of 10 Mode 2 needs have strong primary+fallback skill coverage. Two real gaps: (1) Plausible-on-Astro installer (trivial; accept manual `<script>` tag), (2) Supabase-backed CTA form (use Supabase MCP directly, no new skill). Link: `research/E-skills-marketing-toolkit.md`.

**Workstream F (Drafts Disposition):** 76 drafts audited. **Zero publish-as-is.** 67 need light edits (domain swap `site-rho-pied.vercel.app`→`withagents.dev` and `withagents.dev`→`withagents.dev`). 5 newsletters need regen (topic drift on posts 1/5/14/16/17). Link: `research/F-drafts-disposition.md`.

**Workstream G (Brand Reconnaissance):** `withagents.dev` / `@withagents` — clean slate. `hack.ski` — already Nick's personal URL, Twitter squatter dormant since 2015. `codestories` — **brand-dense conflict zone**: active YouTube channel, Apple podcast, `@codestoryai` competitor, GitHub org dormant since 2014. Recommendation: Code Stories product uses a different consumer-facing name (`codetails.app` or alternative). "Agentic League" legacy is extinct — 0 public mentions. Link: `research/G-brand-reconnaissance.md`.

**Workstream H (Voice Audit):** 18 posts × ~60,000 words. **Verdict: 12 PUBLISH-AS-IS, 5 LIGHT-EDIT, 1 REWRITE (Post 13), 0 RETIRE.** Top AI-tells to ban: em-dash overuse (Post 13 at 8.2/1k is the outlier), "Think about that for a second," "Here's the thing," "fundamentally different." Corpus voice holds at scale. Link: `research/H-blog-series-voice-audit.md`.

---

## 3. Narrative spine (inline)

### Thesis

The industry keeps shipping agents that pass tests without running the product. For ninety days — January 19 through April 18, 2026 — I built twelve tools against the opposite discipline: **the real system or nothing**. No mocks. No stubs. No "build passed, task complete" without evidence. The antagonist is validation theater: the dashboard-green, confetti-emitting loop where an agent reports DONE on code that has never been exercised by a human, a simulator, a real API call. The evidence is 3.4 million lines of session JSONL showing what happened when I stopped accepting that lie. Each product is the same discipline in a different terrain.

### Origin → Pattern → Stake

**Origin.** The triggering moment sits in a 2026 ils-ios JSONL: an agent had been "validating" the iOS app by reading Swift files. No simulator, no `idb`, no screen. I typed back, under the covers at night, "what the fuck are You doing use action skills and Xcode skills You should be interacting WITH it that way." That sentence is the germ of everything after. The fix wasn't a better prompt — it was a skill (`/ios-validation-runner`) that made it structurally impossible to claim DONE without a simulator screenshot. Every subsequent flagship is a variation on that same intervention: make the shortcut physically unavailable.

**Pattern.** The 360-day mine ranks products by investment weight, and the shape tells the story. **ils-ios** (2.4 GB, 52 days, 3,596 files) is where the discipline was forged on iOS. **sessionforge** (657 MB, 47 days, 378 agents) made the JSONL logs themselves queryable — I couldn't stay honest about "23,479 sessions" unless I could mine them. **ralph-orchestrator** (336 MB, 64 days) was the hat-rotation loop that stopped reviewer-agents from rubber-stamping their own builder-agents. **code-story-platform** (64 MB, 62 days) proved the same rule on a consumer product with SSE streaming and ElevenLabs TTS. **remodex** (550 MB, 14 days, 180 agents) extended the rule across a process boundary. **validationforge** (159 MB, 10 days, 257 agents) is the synthesis — the Iron Rule compiled into a benchmark harness with 16 control/treatment cells. It is not the origin. It is the current receipt.

**Stake.** 2026 is the year every "agent platform" demo shows green checks against nothing. Teams will adopt these systems, ship hallucinated releases, and blame the agents. The stake is whether the discipline to run the real thing survives contact with scale. Every hour of the 90 days above was me refusing to accept a green check I hadn't watched execute. That's the only thing in this body of work worth teaching.

Link to full spine: `synthesis/narrative-spine.md` (includes full Flagship Map + 12-chapter index + Anti-Narrative section).

---

## 4. Insight library highlights (top 5)

Full library of 18 insights: `synthesis/insight-library.md`. Top 5 by evidence quality + manifesto potential:

1. **A build that compiles is not a feature that works.** 642 blocked test-file attempts in the series dataset. One session alone triggered 166 blocks. This is the through-line — every flagship exists because completion theater kept shipping. Best closer for Day 30.

2. **The 150,000-token context window isn't a luxury. It's a trap.** Hat-scoped sessions: 94% task completion, 2% contradiction rate. Monolithic sessions: 67% / 34%. One in three long-context sessions contained the agent contradicting its own earlier decision.

3. **Agents can't share memory. They can share files.** 4,237 TaskUpdate + 1,634 TaskCreate + 1,743 SendMessage invocations all coordinate through disk artifacts, not shared state. The filesystem is the only coordination protocol that scales past two agents.

4. **81% of AI coding sessions are agents spawning other agents.** 4,534 human-started + 18,945 agent-spawned = 23,479 total in 42 days. An entire organizational layer emerged. Nobody designed it.

5. **The read-to-write ratio is 9.6:1.** Agents are readers that occasionally write. 88,560 Reads vs 10,140 Writes over 360 days. Understanding-mode tooling dominates.

Evidence quality: 15 STRONG / 3 MED / 0 WEAK across the full 18.

---

## 5. Brand architecture

- **withagents.dev** — umbrella: canonical blog, project index, work-with-me CTA. Where long-form originates.
- **hack.ski** — personal brand surface. *Dropped from this cycle per user decision 2026-04-19.* Domain parked; revisit after 30-day push if pull exists.
- **codestories.platform** — **storage/repo location only, not a public website.** Consumer-facing Code Stories product domain (e.g. `codetails.app`) TBD and **out of scope for this plan.** Workstream G confirms `codestories` is a brand-dense conflict zone.

**Positioning statement:** Full-time at withagents.dev. Consulting available. Collaboration open. Explicitly not job-seeking.

**Legacy "Agentic League":** extinct. Workstream G confirms zero public mentions in posts, site, or CLAUDE.md. Only reference is an internal plan file flagging it for removal. No migration work needed.

---

## 6. Visual system

Theme tokens from Phase 03 live at `visuals/theme-tokens.css`. Visual samples: `visuals/component-blog-card.html`, `visuals/component-project-card.html`.

**Palette (Midnight Observatory, carried forward from current site):**
- Void Navy #0f172a — primary background
- Slate Abyss #1e293b — cards, elevated surfaces
- Indigo Pulse #6366f1 — primary accent, CTAs
- Cyan Signal #22d3ee — metrics, data highlights
- Cloud Text #f1f5f9 — headings
- Slate Prose #cbd5e1 — body
- Mist Caption #94a3b8 — metadata

**What ships in Phase 08:** final logo/wordmark, component library (blog card, project card, CTA block, quote pull, code block), OG image template (Satori + JetBrains Mono fallback; Berkeley Mono license check required), Mermaid dark-theme override, Excalidraw/tldraw diagram style guide.

**Satori note:** 1MB Vercel Edge bundle limit requires font subsetting; verify before Phase 09 ship.

---

## 7. Site architecture

**Stack:** Astro + Keystatic + Tailwind v4 + Satori OG + Vercel. *Locked.*

**IA tree:**
```
/                  home — hero + latest 3 posts + flagship trio
/writing           18-post archive + RSS
/writing/[slug]    individual post render (MDX + Mermaid client-side)
/projects          project cards: 15 flagships + 8 re-announces
/projects/[slug]   per-product detail
/series            "Agentic Development: 18 Lessons" hub
/now               what I'm working on this week
/work              consulting CTA → form → email → Calendly
/about             bio + withagents.dev positioning
```

**Content model:** Keystatic collections for `posts`, `projects`, `notes`. MDX frontmatter matches current (`title`, `subtitle`, `date`, `series_number`, `series_total`, `github_repo`, `tags`).

**Required stress test (Phase 09):** publish 30 MDX files, measure build time, confirm no frontmatter corruption. Named fallback if Keystatic fails: static git-commit MDX workflow (no CMS UI, but content ships).

---

## 8. Publication pipeline

**4 channels:**
1. **withagents.dev blog** — canonical, first to publish
2. **LinkedIn** — (a) long-form article **manual UI paste**, ~20 min/article × 11-13 articles ≈ 3.5h total. (b) short post scripted.
3. **X** — thread (7-12 tweets). API v2 paid tier ($100/mo) **conditional** on ≥10 threads in Phase 06 calendar count.
4. **Companion repo README** — "Featured in: {post}" patch via gh CLI.

**Substack and Medium: skipped this cycle.** (Decision #6.)

**Analytics:** Plausible ($9/mo). Install Day -1 of push in Phase 09.

**Consultant funnel:** embedded form on `/work` → email → Calendly. UTM-tagged per channel. **Phase 13 must complete BEFORE Phase 12 starts** — CTA cannot fire on Day 1 if funnel is built on Day 15.

**Syndication runner scope:** 62 hours breakdown in `reports/deepen-260419-0241-plan-strengthening.md` section `<syndication_runner_scope_correction>`. Covers LinkedIn adapter, X adapter, repo README patcher, Keystatic webhook, manual-LinkedIn-article tooling, Supabase logging, error handling. **Not a one-line bullet.**

---

## 9. 45-60-day calendar (inline week-view, R4)

<!-- round4-2026-04-19: week-view expanded 4wk → 8wk -->

> **Detail:** per-day content assignments live in `synthesis/calendar-45day.md`. R3's `calendar-30day.md` is archived. Week-view below is R4 framework.

**Week 1 (Days 1–7) — Flagship 1: ValidationForge + opening mode-axis setup.**
Day 01 VF GA → Day 02 Consensus → Day 03 Insight 5 "9.6:1 read-to-write" → Day 04 Orchestration Topology (meta) → Day 05 Auto-Claude Worktrees → Day 06 off-day → Day 07 Ralph teaser. Hours: ~35h.

**Week 2 (Days 8–14) — Flagship 2: CCB Evolution + SDK bridge arc.**
Day 08 Insight 6 → Day 09 iOS Streaming Bridge → **Day 10 CCB Evolution flagship (21⭐)** → Day 11 CCBios iOS CCB → Day 12 Claude SDK Bridge → Day 13 ClaudeCodeSDK → Day 14 Claude Prompt Stack. Hours: ~35h.

**Week 3 (Days 15–21) — Shannon ecosystem + memory/mining.**
Day 15 Shannon Framework → Day 16 Shannon CLI → Day 17 Shannon MCP → Day 18 Shannon CC → Day 19 claude-mem Architecture → Day 20 session-insight-miner → Day 21 Insight 4 "81% sessions are agents spawning agents." Hours: ~35h.

**Week 4 (Days 22–29) — Flagship 3: Ralph arc + methodology cluster.**
**Day 22 Ralph Orchestrator origin flagship** → Day 23 Ralph Orchestrator iOS → Day 24 RALPH Protocol → Day 25 Sequential-Thinking Debugging → Day 26 Multi-Agent Merge → Day 27 Playwright Validation Pipeline → Day 28 Kaizen → Day 29 Agent Constitution Framework. Hours: ~45h.

**Rest Week (Days 30–33) — REST WEEK + Devlog.**
Day 30 off → Day 31 Week 4 retro devlog → Day 32 off → Day 33 off. Hours: ~5h.

**Week 5 (Days 34–40) — Skills track + Flagship 4: package launch.**
Day 34 Skill-of-week #1 (devlog-publisher) → **Day 35 withagents-skills package launch flagship + meta-post** → Day 36 Skill #2 (functional-validation) → Day 37 Skill #3 (ck-plan) → Day 38 Skill #4 (visual-explainer) → Day 39 Skill #5 (deepen-prompt-plan) → Day 40 Skill #6 (ai-dev-operating-system). Hours: ~35h.

**Week 6 (Days 41–49) — Product cluster: awesome-list → audio pipeline.**
Day 41 Awesome-list evolution → Day 42 cc-setup → Day 43 Autonomous Coder → Day 44 opencode-mobile → Day 45 claude-mobile-expo → Day 46 claude-code-prd-creator → Day 47 live-mermaid-editor → Day 48 ai-digest sprint → Day 49 github-to-audio pipeline. Hours: ~40h.

**Week 7 finale (Day 50) — Flagship 5: combined finale.**
**Day 50 SessionForge milestone + Code Stories dual-SKU + closing manifesto** (3-part blog, manifesto-only LinkedIn Article, 45-day arc X synthesis thread). Hours: ~15h.

**Week 8 (Days 51–60, optional 60-day extension) — Cross-product patterns + legacy light-edits + retro.**
Day 51 "Validation across 6 products" meta-post → Day 52 docs-lookup-pipeline → Day 53 Stitch → Day 54 Skills Factory → Day 55 iOS Patterns → Day 56 ILS-iOS (conditional) → Day 57 Remodex (conditional) → Day 58 SDK vs CLI → Day 59 Spec-Driven (reponexus-conditional) → Day 60 45/60-day retro devlog. Hours: ~40h.

**Buffer rule:** 5 declared off-days + rest week (days 30–33). Missed deliverable = 24h pause, never double-up. 3 reserve insight posts pre-drafted.

Link for full detail: `synthesis/calendar-45day.md` (R4 canonical).

<!-- /round4-2026-04-19 -->

**Round 3 4-week view (archived for audit):** Week 1 VF + re-announces, Week 2 SessionForge + ils-ios + bridge, Week 3 rest week, Week 4 Code Stories finale. ~84h during-push.

---

## 10. Near-complete products ready for immediate launch

<!-- round4-2026-04-19: R4 near-ready rescope -->

**Flagship quintet (R4):**
- **Day 01 ValidationForge** (`ready_now`, Interactive) — PRD v2.0.0 + 16 benchmark dirs + Iron Rule skill. Honor VALIDATE beta / CONSENSUS + FORGE planned.
- **Day 10 CCB Evolution** (`ready_now`, Mixed) — **R4 NEW** — `claude-code-builder` 21⭐ top-traction product. 15+ Desktop generations. Canonical-CCB decision Day −10.
- **Day 22 Ralph Orchestrator origin** (1-week, Non-Interactive) — **R4 NEW** — user correction: Nick's code (not external fork). 64-day arc. Repo liveness verify Day −7. Anchors 3-post arc (22/23/24).
- **Day 35 withagents-skills package + meta-post** (2-week, Interactive) — **R4 NEW** — OSS package build required pre-push (~20–30h extra not in 531–714h). Anchors 6 skill-of-week spotlights.
- **Day 50 SessionForge + Code Stories + Manifesto** (2-week, Mixed) — **R4 COMBINED** — SessionForge 5⭐ (deployed Vercel; needs demo screencast + disambig copy), Code Stories dual-SKU (`code-tales` pip ready + `code-tales-platform` hosted), manifesto pulling Insights 3+8.

**R4 expanded ready-now slate (light-edit only):** multi-agent-consensus, auto-claude-worktrees, ralph-loop-patterns, claude-ios-streaming-bridge, shannon-framework, sequential-thinking-debugging, multi-agent-merge-orchestrator, claude-mem-architecture, claude-code-skills-factory, stitch-design-to-code, claude-code-ios (post-05), claude-code-monorepo (post-18), claude-sdk-bridge, claude-prompt-stack. All need domain-swap + header fix.

**R4 promotions from `not_this_cycle` → active post slots:**
- **shannon-cli** (Day 16) — R3 bundle → R4 standalone post
- **shannon-mcp** (Day 17) — R3 abandoned → R4 active (verify Day −7)
- **autonomous-coder** (Day 43) — R3 pending CCB canon → R4 distinct v3 Agent SDK post
- **awesome-list-site + v2 + awesome-site** (Day 41) — R3 off-brand → R4 combined evolution narrative
- **Ralph-orchestrator** (Day 22) — R3 "external fork, do not launch" → R4 Nick's code, flagship anchor

**R4 new-product requirements (verify repo + path Day −7):** shannon-cc, cc-setup, opencode-mobile, claude-mobile-expo, claude-code-prd-creator, live-mermaid-editor, ai-digest + ai-digest-apps-worker, github-to-audio-pipeline + agent-sdk-podcast-gen, ClaudeCodeSDK, ccbios-enhanced, ralph-orchestrator-ios.

**Still not-this-cycle (catalog-only):** code-tales-ios (paused), code-story-rn (abandoned), reponexus (verify post-11 liveness before Day 59 — now conditional), nexus (dedupe first), yt-transition-shorts-detector (case-study role Day 25 only), awesome-from-stars (off-brand), ~35 remaining thin companion repos (appendix only).

<!-- /round4-2026-04-19 -->

**Round 3 ready-now list (archived):** original 3-flagship list per R3 plan.

---

## 11. Mode 2 effort estimate (Round 4)

<!-- round4-2026-04-19: effort rescoped 258-343h → 531-714h -->

| Phase | Deliverable | R3 hours | R4 hours |
|---|---|---|---|
| 08 | Visual system production | 16-24h | 16-24h (same) |
| 09 | CMS site build (Astro+Keystatic, templates, OG, DNS, Vercel) | 40-56h | 40-56h (same) |
| 09b | hack.ski variant | 0h (dropped) | 0h (dropped) |
| **13** | Consultant pipeline — **MUST complete BEFORE Phase 12** | 16-24h | 16-24h (same) |
| 10 | Content pre-draft + publish-rhythm setup (**45 posts × 7.5h avg: blog 3h + LinkedIn Article 3h + X thread 1h + README 0.5h**) | 60-90h | **~338h** |
| 10b | **`withagents-skills` OSS package build (R4 new)** | 0h | 20-30h |
| 11 | Automation infra (syndication runner, credentials, cron) | 60-80h | 60-80h (same) |
| 12 | Scheduled launch + monitoring (R4: 45-60 days vs R3: 30 days) | 30-45h | 45-68h |
| 14 | Measurement + post-mortem + next-cycle plan | 16-24h | 16-24h (same) |
| Buffer | 10% overhead across all phases | included | ~50h |
| **TOTAL** | — | **258-343h** | **531-714h** |

**Round 4 total: 531–714 hours ≈ 88–119 working days ≈ 18–24 weeks solo** before Day 1 of push can fire.

**Runway before push:** Phases 08–11 + 13 = ~10–14 weeks (R3 was 5–7). Phase 12 is the 45–60 day push itself.

**Biggest single-item drivers of the R4 increase:**
1. Content pre-draft Phase 10: 60–90h → 338h (biggest delta, ~3x). Driven by 45 posts vs 18 posts + LinkedIn Articles replacing Shorts (3h vs 0.5h per piece).
2. `withagents-skills` package build: new 20–30h line item.
3. Push execution Phase 12: 30–45h → 45–68h (45–60 day push stretches execution window).

<!-- /round4-2026-04-19 -->

**Round 3 estimate (archived):** 258-343 hours / 9-12 weeks / 30-day push / 18 posts / 3 flagships.

---

## 12. Risk register + kill-switch

### Top 5 risks (mitigated)

1. **Energy collapse Week 2-3.** Mitigation: streaming-publish rhythm (not pre-everything), declared Week 3 rest week, 3 buffer off-days, 2 reserve emergency insight posts pre-drafted.
2. **LinkedIn manual-publish burden surprise.** Mitigation: 3.5h budgeted explicitly in calendar; pre-generation tooling in Phase 11 preps article body + image + canonical URL for ≤5 min paste.
3. **Voice drift (2026-04-18 Sonnet incident).** Mitigation: model-different review pass mandatory; all copywriter spawns `model: "opus"`; `synthesis/voice-spec.md` banlist + em-dash ≤5/1k cap; publish gate requires ≥1 independent model review logged to `reports/voice-review-{slug}.md`.
4. **Vercel single-point-of-failure.** Mitigation: static HTML exports of all posts pre-staged in git for emergency alternate-host re-deploy. Analytics and CMS decoupled.
5. **blog-series NO-REMOTE blocker.** `blog-series` repo currently has no git remote. Day-0 deploy depends on resolution. Must push to `krzemienski/withagents` (or similar) BEFORE Phase 12. *Hard blocker flagged in Decision Asks.*

### Kill-switch tripwires (pre-committed)

- **Day 10:** `inquiries=0 AND LinkedIn<+5% AND flagship_stars<+10` → 24h pause + content-quality review + cut remaining calendar 40% or pivot.
- **Day 20:** `inquiries<2 AND flat engagement` → finish current-week commitments; skip 3rd flagship if manifesto not drafted; redirect to inbound follow-up.
- **Any day:** 2 consecutive missed publish days → mandatory 48h buffer pause. No catch-up double-ups.
- **Authenticity backlash:** ≥1 specific "this is AI-written" callout with evidence → halt publishing 24h + voice-guardrail patch before next publish.

---

## 13. Success metrics

**Floors = kill-switch thresholds. Aspirations = raised bar.**

<!-- round4-2026-04-19: floors raised for 45-post scale -->

| Metric | Floor R3 (30-day) | Floor R4 (45-60 day) | Aspiration (R4 raised bar) |
|---|---|---|---|
| Consulting inquiries (qualified) | 2 by Day 20 | 3 by Day 20 / 5 by Day 45 | **≥12** |
| LinkedIn followers | +5% by Day 10 | +5% by Day 10 / +15% by Day 45 | **+50%** |
| X followers | — | +10% by Day 45 | **+40%** |
| Flagship repo stars (total: VF + CCB family + Ralph + Skills package + SessionForge + Code Stories) | +10 by Day 10 | +15 by Day 10 / +50 by Day 45 | **≥500** |
| withagents.dev unique visitors | — | ≥3,000 by Day 45 | **≥10,000** |
| Avg time-on-page | — | ≥2 min by Day 45 | **≥3.5 min** |
| Newsletter signups (if newsletter reintroduced post-launch) | — | ≥100 by Day 60 | **≥500** |

<!-- /round4-2026-04-19 -->

**Baseline reference:** Phase 00 (`reports/baseline-2026-04-19.yaml`) — **SKIPPED per user decision 2026-04-19.** Consequence: measurement will be directional, not snapshot-diff. Attribution relies on commit-log timestamps and engagement trends rather than zero-day numerical deltas. User aware and opted in to this trade.

---

## 14. Red-team and deepen resolution status

### Red-team show-stoppers (5)

| # | Issue | Status |
|---|---|---|
| 1 | No success metrics / baselines | **Resolved** — metrics table in §13; baseline skipped per explicit user decision (trade-off acknowledged). |
| 2 | LinkedIn pipeline lie (API doesn't support articles) | **Resolved** — 3.5h manual budget explicit in calendar; pre-gen tooling in Phase 11; syndication diagram updated. |
| 3 | hack.ski "clone" is brand-hostile | **Resolved (Option C)** — dropped from cycle per Decision 2026-04-19. Domain parked. |
| 4 | Pre-draft 90 pieces impossible | **Resolved** — replaced with streaming rhythm + ~54h pre-push / ~30-40h during. |
| 5 | devlog-publisher-website plan overlap | **Resolved (Option B)** — absorbed into Phase 09; in-flight edits committed in 928c3b7. |

### Deepen redlines applied

All 8 deepen-package sections surgically applied: Phase 00 inserted (then skipped by user), metric targets in Decision 3, kill-switch in Decision 4, effort estimates in Phase Index, content backlog rhythm in Phase 06, syndication runner scope in Phase 05, voice guardrail in Phase 10 (via voice-spec.md), devlog-publisher disposition in Decision 2 (Round 3).

### 15 open questions (from red-team)

**Resolved: 12.** (metrics, kill-switch, analytics tool, funnel mechanism, LinkedIn manual-publish policy, voice drift guardrail, baseline decision, devlog-publisher disposition, X API tier conditional, consultant funnel mechanism, hack.ski decision, voice spec source.)

**Open (required in §15 below): 3.** Day-1 real date, X API thread-count trigger, blog-series push-to-GitHub timing.

**Deferred (non-blocking): 4 small items** — Code Stories product domain (not this plan), 58 nested repo cleanup (Phase 09 decides), Post-05 newsletter regen topic, reponexus GitHub liveness verify before Day-16.

---

## 15. Decision asks (user signs these off)

### Required (hard blockers — do not advance to Phase 08 without these)

<!-- round4-2026-04-19: decision asks rescoped -->

- [ ] **Approve the narrative thesis?** Y / N / Y-with-edits (note edits inline). *(Unchanged — thesis holds at 45-post scale.)*
- [ ] **Approve the R4 flagship quintet order?** Day 01 ValidationForge → Day 10 CCB Evolution (21⭐) → Day 22 Ralph Orchestrator origin → Day 35 withagents-skills package + meta-post → Day 50 SessionForge + Code Stories + Manifesto. Y / N.
- [ ] **R4 SCOPE EXPANSION — confirm 531–714h Mode 2 burden acceptable?** (Up from R3's 258–343h. +106%.) Y / N. If N, specify cut: reduce to ___ posts / ___ flagships / ___ week push.
- [ ] **Approve the R4 calendar ship-date.** Day 1 = YYYY-MM-DD ________________ (must be ≥10 weeks after Mode 2 kickoff for 45-day push; ≥14 weeks for 60-day push).
- [ ] **45-day or 60-day push?** [ ] 45-day — calendar-45day.md as-written. [ ] 60-day — extend with Week 8 optional rows + second rest week.
- [ ] **X API paid tier approval.** ~40 threads across 45-day window (48 if 60-day) → **$100/mo tier required** (exceeds 10-thread threshold 4x). APPROVE / MANUAL-WITH-FALLBACK.
- [ ] **LinkedIn channel matrix confirm:** Articles only, no Shorts (R4-D8). Y / N.
- [ ] **CCB canonical repo decision (Day −10 deadline).** [ ] `claude-code-builder` (21⭐) [ ] `autonomous-claude-code-builder` [ ] `claude-code-builder-agents-sdk` [ ] other: _______
- [ ] **Ralph-orchestrator ownership + liveness (Day −7 deadline).** User correction: Nick's code (not external fork). Confirm GitHub remote state: https://github.com/krzemienski/_______ — verified live? Y / N.
- [ ] **`withagents-skills` OSS package build approval.** +20–30h pre-push build for the 10-skill bundle. APPROVE / SKIP (skip = Day 35 becomes meta-post-only, no package launch).
- [ ] **blog-series NO-REMOTE blocker.** Push to `github.com/krzemienski/____________` before Day-0? Y / N. Target repo name: ____________________.

<!-- /round4-2026-04-19 -->

**Round 3 decision asks (archived):** original 5-ask set around 3-flagship / 30-day scope — superseded by R4 asks above.

### Already locked (restated for clarity — not re-litigation)

- Stack = Astro + Keystatic + Tailwind v4 + Satori + Vercel.
- Analytics = Plausible ($9/mo).
- Funnel = embedded form → email → Calendly, UTM-tagged per channel.
- Voice = `synthesis/voice-spec.md` banlist + em-dash ≤5/1k + model-different review pass.
- Channels = blog + LinkedIn long (manual) + LinkedIn short + X thread + repo README.
- Substack + Medium = skipped this cycle.
- hack.ski = dropped this cycle.
- Phase 00 baseline = skipped per user.
- Credentials = just-in-time at Phase 11 kickoff.
- Voice corpus = all 18 existing posts.
- `linkedin-tokens.json` renamed `.env.linkedin-tokens.json` (gitignored).
- Domains = all three purchased; Mode 2 does DNS + attach only.
- 61 companions = selective re-announce of 8; remaining 42 as appendix.
- devlog-publisher-website plan = absorbed into Phase 09.

---

## 16. Post-approval next-action sequence

1. **Phase 08 start date:** immediately on approval. Kicks off visual production (16-24h over 3-4 days).
2. **Phase 09 kickoff:** after Phase 08 completes (Day +4). CMS build runs Day +4 through Day +14.
3. **Phase 13 (consultant pipeline) kickoff:** parallel with Phase 09 final days, must complete by Day +18.
4. **Phase 10 (content pre-draft) kickoff:** Day +10, overlaps with Phase 09 tail. 60% complete by Day +28.
5. **Phase 11 (automation) kickoff:** Day +14. Credential handoff at kickoff (just-in-time per Decision #8).
6. **Phase 12 Day-0:** earliest **Day +42** (6 weeks) under optimistic effort. Realistic **Day +56** (8 weeks).
7. **User sign-off window for Day-1 date:** needed at Phase 09 midpoint (Day +10) to lock calendar.

---

## 17. Appendix — links

### Research (8 workstreams)
- `research/A-session-archaeology.md` — flagship through-line + origin transcripts
- `research/B-github-catalog.md` — 300-repo inventory + top-8 re-announce slate
- `research/C-desktop-product-scan.md` — 408-dir filesystem audit + graveyard list
- `research/D-blog-series-audit.md` — current site IA + 18-post inventory + migration scope
- `research/E-skills-marketing-toolkit.md` — Mode 2 need → skill matrix + 2 gaps
- `research/F-drafts-disposition.md` — 76 drafts triaged (0 publish-as-is)
- `research/G-brand-reconnaissance.md` — handle availability + trademark + "Agentic League" extinction
- `research/H-blog-series-voice-audit.md` — 18-post voice verdicts + AI-tell patterns

### Synthesis (4 docs)
- `synthesis/narrative-spine.md` — full thesis + flagship map + chapter index
- `synthesis/insight-library.md` — 18 insights + cross-reference bundle pairs + evidence audit
- `synthesis/product-inventory.md` — 32-row master table + flagship trio + readiness gates
- `synthesis/voice-spec.md` — tone examples + banlist + review protocol

### Visuals
- `visuals/theme-tokens.css` — final token exports
- `visuals/component-blog-card.html` — blog card sample
- `visuals/component-project-card.html` — project card sample

### Phase files (7)
- `phase-00-baseline-capture.md` (SKIPPED per user)
- `phase-01-audit-workstreams.md` through `phase-07-approval-package.md`

### Reviews (2)
- `reports/critic-260419-0241-red-team-review.md` — 5 show-stoppers, REVISE verdict
- `reports/deepen-260419-0241-plan-strengthening.md` — 8-section surgical edit package

### Plan
- `plan.md` — overview, 9 locked decisions, Round-3 refinements
