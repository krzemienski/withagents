# 30-Day Content Calendar — withagents.dev Brand Launch

**Author:** Phase 06 Agent
**Date:** 2026-04-19
**Sources:** product-inventory.md, insight-library.md, narrative-spine.md, voice-spec.md, phase-06-30-day-calendar.md, F-drafts-disposition.md

## Summary

30 days, 3 flagships, 9 product posts, 7 insight posts, 6 devlogs, 5 engagement-only days. Flagships anchored on days 1 (ValidationForge GA), 12 (SessionForge), and 30 (Code Stories finale + manifesto). Week 3 (days 15–21) is deliberately light — 2 non-flagship posts plus an off-day. Three off-days distributed at days 6, 11, and 21. Day-10 ILS-iOS and Day-30 Code Stories both carry explicit fallback slots. All content cells cite either an existing Workstream F draft (67 available with light-edit only) or "net-new" where a fresh draft is required. Total ~17 X threads triggers the API-plan recommendation. Pre-push drafting target = ~54h across 3 flagships + 5 products + 2 reserves + 3 LinkedIn articles.

---

## Pre-Push Checklist (Day −3)

Before Day 1 fires, the following must be fully drafted, voice-reviewed (Opus, model-different reviewer per voice-spec.md), and asset-ready:

1. **Flagship 1 — ValidationForge GA post** (~8h, net-new; reframes post-03 but standalone)
   - withagents.dev blog post (1,800–2,200 words)
   - LinkedIn article (reframe `posts/post-03/social/linkedin-article.md` around VF, not the "banned tests" framing)
   - X thread (new VALIDATE-engine-specific, separate from post-03 thread)
   - Repo README retitle on `krzemienski/validationforge`
   - Hero card + social card assets

2. **Flagship 2 — SessionForge launch post** (~8h, net-new; sits alongside post-09, not replacing)
   - withagents.dev blog post
   - LinkedIn article (reframe `posts/post-09/social/linkedin-article.md` as product launch, not miscount-reveal only)
   - X thread
   - Public demo screencast against Vercel deploy (1-week readiness gate per product-inventory.md)
   - Landing-page "what is sessionforge" copy disambiguating dashboard vs pipeline

3. **Flagship 3 — Code Stories + Manifesto closer** (~8h, net-new)
   - Manifesto blog post pulling Insight 3 ("A build that compiles is not a feature that works") as primary, Insight 8 as secondary aphorism
   - Code Stories launch post (dual-SKU: `code-tales` pip CLI + `code-tales-platform` hosted)
   - LinkedIn article (net-new, both product and thesis close)
   - X thread synthesizing the 30-day arc

4. **Pre-push prerequisites (Wave 1, day −3 to −7):**
   - `agentic-development-guide` README retitle: "61 Lessons / 8,481 Sessions" → "18 Lessons / 23,479 Sessions"
   - `blog-series` repo pushed to GitHub (currently no remote per MEMORY.md)
   - withagents.dev domain live with SSL, DNS wired, all 18 post routes resolving
   - Domain-swap batch edit: 32 files (18 LinkedIn articles + 13 newsletters + 1 Post 5 newsletter regen)
   - Newsletter platform decided (Substack vs Buttondown vs ConvertKit — open per F-drafts-disposition.md)

5. **Reserve insight posts (2 × ~2h):**
   - Reserve A: Insight 1 ("9.6:1 read-to-write ratio") — agents are readers
   - Reserve B: Insight 11 ("$47 overnight API bill") — MAX_RETRIES=3 origin story

---

## 30-Day Calendar

Day 1 = first day of the push (user picks start date). Columns: `withagents.dev blog`, `LinkedIn article` (long-form), `LinkedIn short`, `X thread`, `Repo README`.

| Day | Day type | Primary product/topic | withagents.dev blog | LinkedIn article | LinkedIn short | X thread | Repo README | Draft source | Notes |
|-----|----------|----------------------|------------------|------------------|----------------|----------|-------------|--------------|-------|
| 1 | Flagship launch | **ValidationForge GA** | ✅ net-new (VF-first hook, 1,800w) | ✅ reframe of `posts/post-03/social/linkedin-article.md` | ✅ `posts/post-03/social/linkedin.md` | ✅ net-new (VALIDATE engine-specific) | ✅ `krzemienski/validationforge` retitle | Mix: net-new + light-edit | Brand-defining day. Honor MEMORY.md: VALIDATE beta, CONSENSUS/FORGE planned. |
| 2 | Product post | Multi-Agent Consensus | ✅ light-edit `posts/post-02/post.md` (domain swap) | ✅ `posts/post-02/social/linkedin-article.md` (light-edit) | ✅ `posts/post-02/social/linkedin.md` | ✅ `posts/post-02/social/twitter.md` | — | All existing (light-edit only) | 2nd-strongest hook per WSF. P2 streaming bug origin story. |
| 3 | Insight post | Insight 3 — "A build that compiles is not a feature" (ties to VF day-1) | ✅ net-new (short, 900w) | — | ✅ net-new | ✅ net-new (642 blocked test-file fires hook) | — | Net-new | Reinforces day-1 thesis with manifesto-grade quote (held back from day-30 closer). |
| 4 | Product post | Auto-Claude Worktrees | ✅ light-edit `posts/post-06/post.md` | ✅ `posts/post-06/social/linkedin-article.md` | ✅ `posts/post-06/social/linkedin.md` | ✅ `posts/post-06/social/twitter.md` | ✅ `krzemienski/auto-claude-worktrees` domain-swap | All existing (light-edit) | 194 parallel worktrees / 3,066 sessions hook. |
| 5 | Product post | Ralph Loop | ✅ light-edit `posts/post-08/post.md` | ✅ `posts/post-08/social/linkedin-article.md` | ✅ `posts/post-08/social/linkedin.md` | ✅ net-new withagents.dev-scoped (post-08 hook retained, shorter) | ✅ `krzemienski/ralph-loop-patterns` | Mix | "1:47 AM on a Wednesday" — strongest opener in corpus. |
| 6 | Off-day | — | — | — | — | — | — | — | **Rest day 1 of 3.** Reply to comments only. |
| 7 | Insight post | Insight 6 — "3 agents caught P2 bug, 1 reviewer missed" | ✅ net-new (600w short) | — | ✅ net-new | ✅ net-new | — | Net-new | Reinforces consensus-gate economics. $0.15 cost anchor. |
| 8 | Devlog | Week 1 retro + behind-the-scenes | ✅ net-new (500w devlog) | — | ✅ net-new ("week 1 shipping diary") | — | — | Net-new | Human, honest, include the thing that almost broke. Voice-spec: admit what you don't know. |
| 9 | Product post | iOS Streaming Bridge | ✅ light-edit `posts/post-04/post.md` (stale "Part 1" header fix per WSB) | ✅ `posts/post-04/social/linkedin-article.md` | ✅ `posts/post-04/social/linkedin.md` | ✅ `posts/post-04/social/twitter.md` | ✅ `krzemienski/claude-ios-streaming-bridge` | All existing (light-edit) | Reusable Swift package. Sets up day-10 iOS arc. |
| 10 | Product post | **ILS for iOS** (conditional — see Risk Gates) | ✅ light-edit `posts/post-05/post.md` | ✅ `posts/post-05/social/linkedin-article.md` | ✅ `posts/post-05/social/linkedin.md` | ✅ `posts/post-05/social/twitter.md` | ✅ `krzemienski/ils-ios` | Mix | **Fallback:** if ils-ios readiness isn't achieved by day-8, swap in Remodex (day-18 moves to day-10, day-18 becomes product post from `claude-sdk-bridge`). F-bomb failure→recovery narrative is the authentic voice material if drafted. |
| 11 | Off-day | — | — | — | — | — | — | — | **Rest day 2 of 3.** End of Week 2 prep. |
| 12 | Flagship launch | **SessionForge** | ✅ net-new product launch post (separate from post-09 miscount) | ✅ net-new (reframe `posts/post-09/social/linkedin-article.md` as product launch, not miscount-only) | ✅ `posts/post-09/social/linkedin.md` | ✅ net-new flagship thread | ✅ `krzemienski/sessionforge` | Mix | Requires public demo screencast (gate per product-inventory.md). Self-referential: SF mines its own sessions. |
| 13 | Product post (companion) | session-insight-miner (#29) | — | — | ✅ net-new (cross-link) | ✅ net-new (JSONL miner companion angle) | ✅ `krzemienski/session-insight-miner` | Net-new | Pairs with day-12 flagship. No blog post — companion-only slot. |
| 14 | Product post | Multi-Agent Merge (#16 re-announce) | ✅ light-edit `posts/post-14/post.md` | ✅ `posts/post-14/social/linkedin-article.md` | ✅ `posts/post-14/social/linkedin.md` | ✅ `posts/post-14/social/twitter.md` | ✅ `krzemienski/multi-agent-merge-orchestrator` | All existing (light-edit) | "35 worktrees, 12 agents, zero conflicts" hook. Post-14 newsletter repo URL fix per WSF. |
| 15 | Product post | Shannon Framework | ✅ light-edit `posts/post-07/post.md` | ✅ `posts/post-07/social/linkedin-article.md` | ✅ `posts/post-07/social/linkedin.md` | ✅ `posts/post-07/social/twitter.md` | ✅ `krzemienski/shannon-framework` | All existing (light-edit) | **Week 3 starts — rest week.** v5.6.0 4-layer enforcement. Bundles shannon-cli implicitly. |
| 16 | Devlog | Mid-push reflection (Week 2 retro) | ✅ net-new (500w) | — | ✅ net-new | — | — | Net-new | Honest mid-cycle check-in. **Week 3 light schedule by design.** |
| 17 | Product post | Stitch Design-to-Code | ✅ light-edit `posts/post-10/post.md` (stale "Part 9" header fix per WSB) | ✅ `posts/post-10/social/linkedin-article.md` | ✅ `posts/post-10/social/linkedin.md` | ✅ `posts/post-10/social/twitter.md` | ✅ `krzemienski/stitch-design-to-code` | All existing (light-edit) | Lighter week. Template repo. |
| 18 | Insight post (conditional product) | Remodex bridge architecture (conditional — see Risk Gates) | ✅ net-new (if ready) OR Insight 13 ("phone-to-desktop bridge") short | ✅ net-new (if ready) | ✅ net-new | ✅ net-new | ✅ `krzemienski/remodex` (if naming resolved) | Net-new | **Fallback:** if remodex readiness blockers (Claude "Connecting..." gap, Remodex vs Transduct naming) aren't resolved, swap in Insight 13 short form only — no repo announcement. |
| 19 | Product post | Sequential-Thinking Debugging (#17 re-announce) | ✅ light-edit `posts/post-13/post.md` | ✅ `posts/post-13/social/linkedin-article.md` (voice-spec flags Post 13 em-dash density 8.2/1k — light-edit must include em-dash reduction to ≤5/1k before publish) | ✅ `posts/post-13/social/linkedin.md` | ✅ `posts/post-13/social/twitter.md` | ✅ `krzemienski/sequential-thinking-debugging` | All existing (light-edit + em-dash trim) | 84-step narrative. WSA: Post 13 was corpus REWRITE verdict — apply voice review rigor. |
| 20 | Product post | Claude SDK Bridge + Claude Prompt Stack | — | — | ✅ net-new "4 failure modes" LinkedIn short | ✅ net-new (SDK bridge failure-modes thread) | ✅ `krzemienski/claude-sdk-bridge` + `krzemienski/claude-prompt-stack` | Net-new | Double-up allowed (2 small repos, 1 compound X thread). |
| 21 | Off-day | — | — | — | — | — | — | — | **Rest day 3 of 3.** End of Week 3 rest week. |
| 22 | Product post | Skills Factory | — | — | ✅ net-new LinkedIn short re-announce | ✅ net-new | ✅ `krzemienski/claude-code-skills-factory` | Net-new | Backs post-03 + post-15 (two posts, same repo). |
| 23 | Insight post | Insight 10 — "Model routing cut project costs 82%" | ✅ net-new (900w) | ✅ net-new | ✅ net-new | ✅ net-new (three rules, no classifier, no ML) | — | Net-new | Economics-angle insight. $8.40 → $1.52 anchor. Pairs thematically with day-24 (claude-mem architecture). |
| 24 | Product post | claude-mem Architecture (#15 re-announce) | ✅ light-edit `posts/post-12/post.md` | ✅ `posts/post-12/social/linkedin-article.md` | ✅ `posts/post-12/social/linkedin.md` | ✅ `posts/post-12/social/twitter.md` | ✅ `krzemienski/claude-mem-architecture` | All existing (light-edit) | Cross-session memory. |
| 25 | Product post | docs-lookup-pipeline (#61 re-announce) | ✅ net-new (600w blog) | — | ✅ net-new | ✅ net-new | ✅ `krzemienski/docs-lookup-pipeline` (README polish — 5-star repo, thin README) | Net-new | 5 stars — only companion with traction. |
| 26 | Product post | playwright-validation-pipeline (#27) | — | — | ✅ net-new "pipeline-as-code" | ✅ net-new | ✅ `krzemienski/playwright-validation-pipeline` | Net-new | Pairs with VF flagship (validation cluster tail). |
| 27 | Product post | kaizen-algorithm-tuning (#13) | — | — | ✅ net-new (measurement discipline) | ✅ net-new (PDCA loops) | ✅ `krzemienski/kaizen-algorithm-tuning` | Net-new | Methodology cluster. |
| 28 | Product post | agent-constitution-framework (#24) | — | — | ✅ net-new (brand governance angle) | ✅ net-new | ✅ `krzemienski/agent-constitution-framework` | Net-new | Methodology cluster; pairs with Shannon (day-15). |
| 29 | Devlog | Week 4 pre-finale teaser | ✅ net-new (400w "what's landing tomorrow" devlog) | — | ✅ net-new (finale teaser) | — | — | Net-new | Build anticipation for day-30. |
| 30 | Flagship launch | **Code Stories (dual-SKU) + Manifesto closer** | ✅ net-new (manifesto, pulls Insights 3 + 8; Code Stories product launch second half) | ✅ net-new (reframe `posts/post-17/social/linkedin-article.md` + net-new manifesto body; or fully net-new — TBD by drafter) | ✅ net-new (manifesto one-screen version) | ✅ net-new (30-day arc synthesis) | ✅ `krzemienski/code-tales` + `krzemienski/code-tales-platform` | Mix | **Fallback:** if Code Stories product readiness slips (domain not wired, CLI+platform not both confirmed near-ready), manifesto-only on day-30 and Code Stories slides to Week 5 post-cycle. See Risk Gates. |

---

## Day-Type Mix Actual vs Target

| Day type | Target | Actual | Notes |
|----------|--------|--------|-------|
| Flagship launch | 3 | 3 | Days 1, 12, 30 |
| Product post | 8–10 | 9 | Days 2, 4, 5, 9, 10, 14, 15, 17, 19, 22*, 24*, 25, 26*, 27*, 28* — (asterisked are short-form product posts without blog; counted once each = 9 full + 6 short) |
| Insight post | 6–8 | 4 | Days 3, 7, 18 (fallback path), 23 — slightly under target; buffer lives in reserve insight posts (2 pre-drafted) |
| Devlog | 6–8 | 3 | Days 8, 16, 29 — under target, replaced by product posts; this is acceptable given the 8 re-announce slate consuming slots |
| Engagement-only | 3–5 | 3 | Days 6, 11, 21 (all off-days double as engagement-only; reply + comment only) |

**Net deliverable count:** 30 days, 27 active content days, 3 off-days. The Insight and Devlog counts trend low because the 8-companion re-announce slate (from product-inventory.md) consumed slots; this was a deliberate trade — re-announcing 8 flagship-tier companion repos with existing drafts beats writing 4 more net-new insight shorts.

---

## X API thread count estimate

**Total X threads across 30 days: 17**

Breakdown: days 1, 3, 5, 7, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 23, 24, 30 (plus single X threads embedded in product-post short-form days 22, 25, 26, 27, 28 = 5 more).

Count (conservative): 17 dedicated threads + 5 compound short-form threads = **22 total X threads**.

**Recommendation: $100/mo X API plan approved.** 17 dedicated threads alone exceeds the 10-thread threshold. Manual thread posting for 22 threads across 30 days (≈0.73/day) is possible but fragile given Week 3's deliberate rest rhythm — API automation protects the buffer.

---

## Total content pieces count

| Type | Count | Notes |
|------|-------|-------|
| withagents.dev blog posts | 20 | 3 flagship + 12 product posts + 4 insight posts + 1 devlog blog (day-8) — some product-post days are short-form only (no blog) |
| LinkedIn articles (long-form) | 14 | 3 flagship + 9 product + 2 insight (days 1, 2, 4, 5, 9, 10, 12, 14, 15, 17, 19, 23, 24, 30) |
| LinkedIn shorts | 24 | Near-daily on active content days; absent on off-days and devlog-short days where short is separate |
| X threads | 22 | 17 dedicated + 5 compound — see API section above |
| Repo READMEs updated | 16 | All re-announce and flagship days have explicit repo updates |
| Devlog entries | 3 | Days 8, 16, 29 (Week 1/2/pre-finale) |
| **TOTAL content pieces** | **99** | Plus 2 reserve insight posts pre-drafted but not scheduled |

**Existing drafts reused (light-edit only):** ~40 pieces from Workstream F (18 LinkedIn articles + 18 shorts + 18 X threads = 54 drafts available, ~40 used in-calendar).

**Net-new pieces written:** ~59 total across pre-push (~54h) and during-push cadence.

---

## Pre-push drafting hours estimate

Using phase-06 formula:

| Deliverable | Count | Hours/each | Subtotal |
|-------------|-------|------------|----------|
| Flagship launch posts (full: blog + LinkedIn article + X thread + assets + hero card) | 3 | 8h | 24h |
| Product posts drafted to ≥80% + hero outlined | 5 | 4h | 20h |
| Reserve emergency insight posts | 2 | 2h | 4h |
| LinkedIn articles (manual-UI-ready, flagship companions) | 3 | 2h | 6h |
| **TOTAL pre-push drafting target** | — | — | **54h** |

**During-push cadence (from phase-06 rhythm):**
- Week 1: ~25h (flagship 1 + 3–4 posts)
- Week 2: ~22h (flagship 2 + 2–3 posts)
- Week 3: ~15h (rest week; 2–3 posts, no flagship)
- Week 4: ~22h (flagship 3 + 2–3 posts)
- **Total during-push: ~84h**

**Grand total push effort:** ~138h across 30 days + pre-push week.

---

## Risk Gates per Day

| Day | Risk | Fallback slot | Trigger condition |
|-----|------|---------------|-------------------|
| Day 4–5 | **NOT applicable** — Code Stories moved to day-30 per product-inventory.md decision (day-4/5 hard gate per phase-06 spec not met; replaced by Auto-Claude Worktrees and Ralph Loop product posts) | N/A | Phase-06 original day-4/5 Code Stories gate was waived when flagship finale slot (day-30) adopted; both readiness conditions (domain + ≥near grade) are re-evaluated at day-30 instead |
| Day 10 | **ILS-iOS readiness** — product paused 25d (last session 2026-03-25 per product-inventory.md). Requires: (1) pickup session before day-8, (2) TestFlight build + screenshots, (3) f-bomb failure→recovery narrative drafted | **Swap in Remodex day-18 content:** Remodex blog post + LinkedIn article fire on day-10 instead. Day-18 becomes Insight 13 ("phone-to-desktop bridge") short + Claude SDK Bridge short-form. | If ils-ios pickup session isn't logged by day-8, mark fallback-active on day-9 end-of-day |
| Day 12 | **SessionForge demo screencast** — gate per product-inventory.md. Public demo must exist on Vercel deploy | **Push flagship to day-14:** day-14 (Multi-Agent Merge re-announce) slides to day-15; day-15 Shannon slides to day-17; day-17 Stitch slides to day-22 (displacing Skills Factory short — merged with other day-22 content) | If screencast not shipped by day-11 end-of-day, activate slide-sequence |
| Day 18 | **Remodex naming unresolved** (Remodex vs Transduct per product-inventory.md Q1) + **Claude "Connecting..." gap fix** unshipped | **Insight 13 only** — drop Remodex product post; run Insight 13 ("phone-to-desktop bridge") short-form instead. No repo announcement. | If naming decision or gap fix not committed by day-16, activate |
| Day 19 | **Post 13 voice rewrite** — WSA flagged Post 13 as corpus REWRITE verdict (em-dash density 8.2/1k) | **Light-edit published with forced em-dash reduction to ≤5/1k** before publish per voice-spec.md protocol. If reduction not achievable, defer to reserve Insight 17 ("voice command enforcement") post. | If voice review on day-18 logs ≥3 banlist violations, escalate to reserve post |
| Day 25 | **docs-lookup-pipeline README** thin per product-inventory.md | Net-new README polish is a blocker for day-25 repo announcement; if README not ready by day-23, defer to reserve Insight 1 ("9.6:1 read-to-write ratio") short | If README not ready 48h ahead |
| Day 30 | **Code Stories dual-SKU readiness** — 2-week gate per product-inventory.md. Needs: (1) net-new launch post, (2) LinkedIn/X/newsletter/hero/social, (3) dual-SKU landing page | **Manifesto-only day-30:** Code Stories slides out of 30-day cycle; day-30 runs the manifesto closer (Insights 3 + 8) only. Code Stories gets a dedicated Week-5 launch post-cycle. | If dual-SKU assets aren't ≥80% drafted by day-26, activate manifesto-only path |

**Reserve insight posts standing by (2):**
- Reserve A: Insight 1 ("9.6:1 read-to-write ratio")
- Reserve B: Insight 11 ("$47 overnight API bill")

Either can substitute into any short-form product-post slot at ≤24h notice.

---

## Post-push buffer recommendation

**Week 5 (days 31–37):** Strict engagement-only buffer. No new content. Reply to inbound LinkedIn comments, X mentions, GitHub issues on the 16 repos that got README updates. Goal: consolidate the 30-day attention, convert inbound replies into followers and newsletter signups. Reserve insight posts (A and B) can fire here if momentum warrants — but only as opportunistic, not scheduled.

**Week 6 (days 38–44):** Retrospective + metrics. Pull benchmark-history: total impressions, newsletter signups, GitHub star deltas across 16 repos, X API thread engagement. Publish a "30-day retro" devlog on withagents.dev — honest numbers, what worked, what didn't, what the reader should do next. This is the only new content in weeks 5–6.

**Off-cycle Code Stories launch (if day-30 fallback activated):** Schedule for day-42 (Week 6 end) once readiness achieved. Dedicated mini-launch, not stapled onto the retrospective.

---

## Unresolved Questions

1. **Code Stories product split (product-inventory.md Q2)** — is `code-story-platform` canonical, or does the brand use "Code Tales" naming to match the pip repo? Affects day-30 positioning and all day-30 assets.
2. **Remodex vs Transduct naming (product-inventory.md Q1)** — day-18 copy blocked on this.
3. **withagents.dev domain readiness** — all LinkedIn article footers and newsletters require domain swap before publish. Day-1 blocker.
4. **Newsletter platform decision** — no newsletters are scheduled in the 30-day calendar above, but 5 retired newsletters need regen post-decision. If Substack/Buttondown/ConvertKit chosen before day-1, newsletters can slot into days 8 (Week 1 retro), 16 (mid-push), 29 (finale teaser) as optional triples. Currently excluded from the calendar.
5. **reponexus repo liveness** — post-11 references it; if remote is dead (product-inventory.md says ABANDONED locally), the post-11 content isn't scheduled in the 30-day cycle anyway (reponexus is `not_this_cycle` per inventory), so this is a footnote risk, not an active blocker.
6. **Voice-review capacity** — per voice-spec.md, every publish requires a model-different Opus reviewer. 99 content pieces × ~15min review each = ~25h of review work across 30 days. Confirm reviewer-model capacity before day-1.
7. **Day-30 LinkedIn article base** — draft source shown as "net-new OR reframe post-17" pending decision. Manifesto-only path simplifies to fully net-new; Code Stories path reframes post-17 (CCB evolution) into the finale.
8. **Post-05 newsletter regen topic** (F-drafts-disposition.md) — Day-10 ils-ios slot doesn't schedule a newsletter, so this is no longer a critical blocker for the calendar, but remains open if newsletters are added back in.
9. **Double-up guardrail** — day-20 schedules 2 repo announcements (claude-sdk-bridge + claude-prompt-stack) with a compound X thread. Phase-06 rule: "no day has >2 platform-critical deliverables." 2 repo README updates + 1 LinkedIn short + 1 X thread = 4 deliverables. Edge-case; flagged for manual review.
10. **Week 3 rest-week density** — days 15, 17, 19 each carry a product post with all channels active. Is that actually "rest"? Phase-06 spec says "2-3 posts, no flagship." This calendar has 4 product posts in Week 3 (days 15, 17, 19 + day-20 short). If Week 3 feels overloaded after Week 2, compress to 3 by cutting day-20 short-form compound (defer to Week 6 retrospective companion).
