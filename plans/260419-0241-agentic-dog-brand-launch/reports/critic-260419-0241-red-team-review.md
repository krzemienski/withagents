# Red-Team Review — agentic.dog Brand Launch Plan

**Reviewer:** oh-my-claudecode:critic
**Date:** 2026-04-19 03:14
**Target:** `/Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/`
**Mode:** ADVERSARIAL (escalated — plan has 5+ CRITICAL issues at first pass)

---

## Verdict: **REVISE** (not REWORK, not SHIP)

The Mode 1 audit structure is defensible. The Mode 2 execution plan is not. The 30-day calendar, syndication pipeline, and dual-domain strategy each contain at least one show-stopper that will fail publicly if shipped as written. Fix the show-stoppers below and this is shippable — but do not advance to Phase 08 until they are explicitly resolved in the approval package.

---

## Top 5 Show-Stoppers (rank-ordered)

### 1. No success metrics, no baselines — "the push worked" is undefined
Plan defines outputs (30 posts, 3 flagship launches, 4 channels) but zero outcome targets. No inquiry volume goal. No follower delta target. No star/clone target. No baseline snapshot of LinkedIn followers, X followers, GitHub stars, mailing-list size, or agentic-development-guide referral traffic taken BEFORE day 1. **Without this, the author will declare victory regardless of actual result and learn nothing.** Phase 05 says "Measurement" but names only tools, not thresholds. Phase 14 is literally "Post-30-day analytics, post-mortem, next-30-day plan" — too late.
**Fix:** Add Phase 00 (Baseline Capture) before Phase 01. Add target numbers to Phase 07 approval package section 1. Enforce pre-mortem: "30 days in, if X<N, what did we learn?"

### 2. LinkedIn article pipeline is a lie
Phase 05 Risks quietly admits: `"LinkedIn API restrictions on posting articles programmatically — public API doesn't support article publishing, only shares. Mitigation: LinkedIn articles drafted locally, manual publish via UI"`. But the canonical flow (Phase 05 line 17-27) shows `syndication runner → LinkedIn article` as an automated branch. **For 3 flagship days + 8-10 product days, that's 11-13 manual LinkedIn UI publishes — 15+ minutes each, with image upload, tag hashtags, verify canonical link. That's ~3 hours of manual ops the plan pretends is scripted.** This is the #1 energy-collapse trigger.
**Fix:** Either (a) drop LinkedIn long-form from flagship days and use LinkedIn short only, or (b) budget the manual time explicitly in the calendar and pre-draft all articles in Phase 10 BEFORE day 1. Do not ship a canonical flow diagram that implies automation that does not exist.

### 3. hack.ski as "clone with copy differences" is brand-hostile
plan.md decision #4: `"hack.ski = clone of agentic.dog — same brand, same visual system, same template, same pipeline. Only copy differs"`. **This is lazy duplication dressed as parallel deploy.** If hack.ski is Nick's personal brand and agentic.dog is the consulting umbrella, identical visual system signals "these are the same thing with a domain A/B test" — which readers will correctly identify within one click. SEO risk: duplicate content penalty unless canonical tags are surgical (not mentioned). Brand risk: "agentic.dog" and "hack.ski" should have DIFFERENT visual identities if they represent different audiences; if they represent the same audience, one of them should not exist.
**Fix:** Either (a) differentiate the visual system of hack.ski (different accent palette, different motif — 2-3 days of Phase 03 work), or (b) make hack.ski a single landing page that redirects to agentic.dog with a personal-bio twist, or (c) drop hack.ski from this cycle entirely. The current "same codebase two deploys" plan is the worst of all three options.

### 4. "Pre-draft everything in Phase 10 before day 1" is physically impossible at current scope
Phase 06 Risks: `"Mitigation: pre-draft everything in Phase 10 before day 1 so execution is 'publish, don't write'"`. 30 days × ~4 channels = ~90 content pieces. Even at 1 hour/piece (fantasy for flagship posts — those are 6-8h each), that's 90 hours of pre-drafting. Phase 10 is listed as one phase with no duration estimate. Mode 2 has 7 phases (08-14) with zero time estimates anywhere. **The plan has no timeline for Mode 2 execution that can be sanity-checked.**
**Fix:** Add explicit effort estimates per Mode 2 phase to Phase 07 decision asks. Force the author to commit to "Phase 10 = 14 days of pre-drafting before day 1 of the push" or equivalent, THEN the 30-day calendar is day 15-44, not day 1-30 of the planning-start.

### 5. Workstream overlap with in-progress `260305-2119-devlog-publisher-website/` is unresolved
plan.md line 123-127 flags: `"overlapping scope: site build + new blog posts. Recommend: absorb into Phase 09 (CMS build) or complete/close before Mode 2. Flagged."` The recommendation is "absorb or close" — but the plan makes no decision. Phase 09 (blocked, in Mode 2) assumes a net-new repo at `~/Desktop/agentic-dog/`. **If the existing plan is mid-execution and shares files (`posts/`, `site/`), you have two plans writing to the same content directories.** The blog-series `posts/` directory has 42+ modified files per `gitStatus` — that work is in flight now.
**Fix:** Before Phase 01 kicks off, make an explicit decision on `260305-2119-devlog-publisher-website/`: (a) retire it (close the plan, commit or discard in-flight edits), (b) complete it first (push all 18 posts, deploy, then start this plan), or (c) absorb it (delete that plan file, this plan owns the work). Document the decision in plan.md, do not flag-and-move-on.

---

## Lens-by-Lens Findings

### Executability lens
- **Mode 2 has no timeline.** Phases 08-14 are tagged "blocked" with no week estimates. Phase 07 section 12 says "Build effort estimate — rough week-count per Mode 2 phase" — meaning the estimate is pushed into the approval package itself, so there's no current pressure-test. The author has history of optimistic scoping; without estimates now, sign-off will approve a Mode 2 nobody has scoped.
- **Energy collapse at day 14-18 is acknowledged but not engineered around.** The "mitigation" is pre-drafting — see show-stopper #4. There is no fallback for "author got sick day 10" or "two flagships miss readiness grade." No reserve of filler content, no permission-to-skip-a-day rule.
- **Daily monitoring in Phase 12 is hand-waved.** "30-day scheduled run + daily monitoring" — how long is daily monitoring? 30 min/day? 2 hours/day? This is the hidden ops burden that kills solo launches.

### Content quality lens
- **Narrative spine has vague placeholder language.** Phase 02 says the spine is `"why custom frameworks, why SDK-first, why iOS, why voice/narration, why session tooling, why validation discipline — what collective pattern emerges"`. That is a list of products, not a thesis. A real thesis names an antagonist ("the industry gets X wrong, here's the evidence"). Without one, the 30-day push is self-mythology: "here's stuff I built."
- **Insight library is likely to be 20 generic claims dressed as novel.** Phase 02 gives four examples: `"functional validation over test mocks"`, `"3-agent unanimous consensus beats single-agent"`, `"SDK-first then GUI-second"`, `"hat-based loops converge faster than prompt-only"`. Claim #1 is a year-old debate. Claims #2-4 are all observations, not insights — missing the quantitative "N sessions show Y" framing that separates insight from opinion.
- **AI-content rot signals everywhere.** Em-dashes in abundance throughout the plan (I count 40+). Voice drift is called out only in MEMORY.md as a past failure, and the plan's mitigation is `ck:ckm:write:good` + `/ckm:brand` — but those skills weren't the mitigation that failed, they ARE what drove the Sonnet voice drift on 2026-04-18 per the MEMORY.md lesson. Using the same skill stack with no additional guardrail repeats the mistake.
- **Voice guidelines decision is "lives inside a skill."** Decision #5 in plan.md: `"Voice guidelines (\"Opus 4.7 talking\") live inside /ckm:copywriting"` — but a skill is a procedure, not a specification. Voice needs a 1-page document a copywriter agent reads: tone examples, word banlist, sentence-structure patterns. Hiding it in a skill means every content generation call re-derives the voice and drift is guaranteed.

### Brand positioning lens
- **Consultant CTA is undefined.** Plan says "work-with-me CTA" in multiple places but no Phase spec's the funnel: capture form? email? Calendly? What does the inbound look like when a CTO lands on agentic.dog and wants to hire? Phase 13 (blocked) is `"consultant pipeline"` — so the 30-day push runs WITHOUT a functional CTA for the first N days unless Phase 13 is reordered to land before Phase 12.
- **"Explicitly not job-seeking" is stated three times in plan.md.** This is defensive positioning that announces the opposite. Readers don't care about your employment status; stating it signals you do.
- **Re-announcing 5-10 of 61 companion repos is "stunted second launch of flopped content."** The 61 were pushed 2026-03-06, tied to the agentic-development-guide series. If that series didn't drive traffic/stars the first time, reframing 5-10 under a new brand does not change the content quality — it just adds "I also launched this already" to the honest reader's mental model. Either commit to a full repo refresh with new READMEs (not in scope) or leave them alone. Selective re-announce is worst-of-both.

### Technical lens
- **Keystatic maturity is flagged in Phase 04 Risks but the mitigation is circular.** `"Mitigation: Keystatic + git fallback means content is always portable; lock-in risk is near-zero."` Portability is not the risk. The risk is Keystatic breaks at scale or has a bug that corrupts MDX frontmatter mid-publish, and the 30-day calendar stalls. No named fallback CMS; no dry-run content volume test.
- **Satori OG at scale with custom fonts has known gotchas.** Plan doesn't address: custom font loading (`JetBrains Mono`, `Berkeley Mono`, `Inter`) requires font embedding in serverless — bundle size limit on Vercel Edge is 1MB. Berkeley Mono is commercial; license check missing. No fallback strategy if a font fails to render.
- **DNS for three domains with zero buffer time.** Decision #1 says domains are purchased. Plan assumes "Mode 2 skips purchase; does DNS + Vercel domain-attach only" — but DNS propagation can take 24-48h, Vercel domain verification can stall on CAA records or missing _vercel TXT, and cross-registrar handoff (if domains are on different registrars) multiplies risk. Day 1 deploy failure is plausible and has no fallback named.
- **Syndication runner is called "scripted (Node/TS)" in Phase 05, but there's no reference implementation.** Every platform has different auth (LinkedIn OAuth2 with product-specific scopes, X API v2 paid tier, etc.). "Reads published frontmatter → adapts per platform → posts via platform APIs" is 2-3 weeks of engineering glossed as a bullet. Not scoped.

### Measurement lens
- **No baselines anywhere.** See show-stopper #1.
- **"Pick: Plausible / Vercel Analytics / PostHog" in Phase 05** — three tools listed, no decision, implying the measurement layer is negotiable. Analytics must be installed day -1, not day 15.
- **No "what we'd have to see to kill the push early" rule.** If day 10 shows zero inquiry volume and -5 followers, does the author pivot, continue, or quit? No pre-commitment.

### Risk-concentration lens
- **Vercel is a single point of failure for three domains + the syndication runner.** Plan has no multi-region or backup strategy.
- **LinkedIn account lockout is a realistic 30-day push risk.** Programmatic posting at volume triggers rate-limit escalation. No backup account, no manual-mode switch plan.
- **Author-gets-sick has zero fallback.** No "buffer week," no "co-author on standby." Solo launches always need a 48h reserve; this has none.
- **Single reviewer on all content.** Per MEMORY.md, the copywriter Opus restart on 2026-04-18 happened because Sonnet was passing its own review. The plan's content pipeline does not enforce a model-different review pass before publish.

### Scope-creep lens
- **hack.ski added mid-question-round is the smoking gun.** Decision #4 is dated 2026-04-19 (same day as plan). Before today, hack.ski was not in scope. That's +1 domain, +1 deploy, +1 copy-variant content track, and was absorbed as "only copy differs" with zero effort re-estimate. Expect 2-3 more additions of similar size.
- **Phase 09 ambiguity on blog-series disposition.** See show-stopper #5. The calendar's day 1 readiness (validationforge GA) depends on where the content lives and which site it publishes to. If Phase 09 absorbs the 18 existing posts from blog-series, that's a migration project with its own timeline. If it doesn't, readers navigating from agentic-development-guide to agentic.dog hit a two-site experience.
- **Code Stories platform domain "TBD, filled in later" (decision #2)** — but Phase 06 anchors Day 4-5 on `"Code Stories platform debut at codestories.platform"`. The domain isn't the site; the site needs a domain. Day 4-5 launch without a production domain is a non-launch.

### Audit-agent lens (Phase 01)
- **Workstream A sampling rule is suspect.** `"top-N sessions by agent_spawns per flagship product"` — but validationforge's 257 agent spawns likely include test runs of the same build pipeline, not distinct narrative sessions. Agent spawn count is a volume proxy, not a narrative-weight proxy. Risk: A report that says "validationforge was built through 257 CI runs" instead of "validationforge emerged from solving X problem."
- **Workstream G is partially redundant.** Decision #1 says domains are already purchased. Workstream G is still spec'd to `"web search + WHOIS for agentic.dog / codestories.platform / hack.ski availability"`. Trim Workstream G to: social-handle availability + trademark exposure only. Drop DNS/availability portion.
- **Workstream E "catalog of activatable skills for Mode 2"** with 200+ skills will produce a dump, not a matrix. Without a required format of "for each Mode 2 need (content gen, OG render, syndication, analytics, CTA capture), name the 1 best skill and 1 fallback," the report will be a list you never read.
- **Workstream D decision on devlog-publisher-website disposition is deferred to Workstream D itself.** But that plan is in-flight NOW. A research report cannot decide whether to retire an in-flight plan — only the user can. See show-stopper #5.
- **No workstream audits the CURRENT blog-series content quality.** Assumes the 18 existing posts are OK. Given MEMORY.md's voice-drift restart, this is an unsafe assumption. Add: Workstream H — blog-series content QA against new voice guidelines.

---

## Recommended Plan Edits (redlines)

### plan.md
- **Line 94-103 (Acceptance Criteria Mode 1):** Add bullet: `[ ] Baseline snapshot captured: LinkedIn followers, X followers, GitHub stars per flagship, blog traffic 30-day avg, inquiry volume`.
- **Line 105 (Decisions Locked In):** Add decision #8: `Success metrics for 30-day push: {inquiry volume target}, {follower delta target}, {star delta target}. Kill-switch trigger: {condition}`.
- **Line 116-119 (Remaining Open Items):** Escalate blog-series disposition to Decisions Locked In. Must be resolved BEFORE Phase 01 spawn.
- **Line 112 (Decision #6):** Add: `"LinkedIn long-form is manual-publish. Budget 20 min/article in calendar."`
- **Decision #4 (hack.ski):** Replace `"same visual system, only copy differs"` with an explicit choice between three options above (differentiate / redirect landing / drop).

### phase-01-audit-workstreams.md
- **Line 58-61 (Workstream G):** Trim to `"social-handle availability + trademark exposure. DNS availability dropped (domains purchased per Decision #1)."`
- **Line 48-51 (Workstream E):** Add required output format: `"Matrix: {Mode 2 need} → {1 primary skill, 1 fallback skill, gap flag}. No raw skill dumps."`
- **Line 30-36 (Workstream A):** Add: `"Narrative-weight filter: sessions with ≥20 distinct tool calls AND ≥2 user-message exchanges. Exclude test-run sessions (single-prompt + automation-exit patterns)."`
- **Add Workstream H:** Content QA of 18 existing blog-series posts against new voice spec. Owner: separate agent, read-only.

### phase-05-publication-pipeline.md
- **Line 17-27 (Canonical Flow diagram):** Mark LinkedIn long-form branch as `manual-only (no API)`. Remove from `syndication runner` automation box.
- **Line 65-71 (Measurement):** Decide analytics tool now. Do not ship approval package with three options listed.
- **Add Risks bullet:** `Vercel outage single-point-of-failure. Fallback: static HTML exports of all posts pre-staged in git for emergency re-deploy via alternate host.`

### phase-06-30-day-calendar.md
- **Line 71 (Risks):** Replace `"pre-draft everything in Phase 10"` with explicit effort: `"Phase 10 = 14 days, ~90h of drafting, must complete before day 1 of push."`
- **Add:** `"Buffer rule: 3 off-days are non-negotiable. Any deliverable missed triggers a 24h pause, not a double-up the next day."`
- **Line 41 (Day 4-5):** Gate on `"codestories.platform domain decision + Code Stories code-tales product readiness grade ≥near"` — do not hard-anchor Day 4-5 until both confirmed.

### phase-07-approval-package.md
- **Section 12 (Build effort estimate):** Move to Phase 01 Workstream output, not Phase 07. The estimate should exist BEFORE the approval conversation, not in it.
- **Section 13 Decision asks:** Add: `"Success metrics and kill-switch: confirm targets for inquiry volume, follower delta, and minimum-signal threshold to continue past day 15."`

### phase-03-visual-system-proposal.md
- **Line 25-29 (Type):** Confirm Berkeley Mono license or replace with open font. Document license in deliverables.
- **Add Risk bullet:** `Satori font embedding on Vercel Edge — 1MB bundle limit. Mitigation: verify subset-embedded font bundles fit before Phase 09 ship.`

### phase-04-cms-site-architecture.md
- **Add Risk bullet:** `Keystatic content-volume stress test required before day 1: publish 30 MDX files, measure build time, confirm no frontmatter corruption.`

---

## Questions the Plan Does Not Answer But Should

1. What is a successful 30-day push? Specific numbers.
2. What is the kill-switch? At what metric threshold on what day does the push pause/pivot?
3. What is the baseline of every metric TODAY (2026-04-19)?
4. Who reviews content before publish? If the author, what enforcement prevents self-approval drift (MEMORY.md lesson)?
5. What is the total Mode 2 week-count estimate per phase? (Must exist before approval, not in it.)
6. If Vercel fails on day 1, what is the fallback host and how fast can cutover happen?
7. What happens to the in-flight `260305-2119-devlog-publisher-website/` plan — retire, complete, or absorb?
8. What is the exact differentiation between agentic.dog and hack.ski, or should hack.ski be dropped from this cycle?
9. Does the Code Stories platform have a production domain, and if not, how does Day 4-5 launch?
10. What is the consultant inbound funnel? Form? Email? Calendly? SLA on response?
11. How is voice drift prevented given the 2026-04-18 Sonnet incident? Specific guardrail.
12. What content, if any, from the existing 18 blog-series posts needs voice-spec re-audit before migration?
13. For the 61 companion repos: which specific 5-10, what NEW framing, and what's the honest assessment of why the first launch didn't stick?
14. Which analytics tool (Plausible / Vercel / PostHog) — decide before Phase 07 sign-off?
15. Who has access to LinkedIn / X API credentials and when does handoff happen? (plan.md flags as open — resolve before Phase 01.)

---

## Realist Check Applied

Show-stoppers #1 (metrics), #2 (LinkedIn manual), #4 (pre-draft impossibility), #5 (plan overlap) all survive pressure-testing — each has direct evidence in the plan text. Show-stopper #3 (hack.ski) is downgraded from CRITICAL to MAJOR in severity: **Mitigated by** — if the author is content-first and audiences overlap fully, "two domains one codebase" is defensible as a portfolio gesture. Keeping it at show-stopper rank only because it's unresolved and represents the author's scope-creep pattern.

