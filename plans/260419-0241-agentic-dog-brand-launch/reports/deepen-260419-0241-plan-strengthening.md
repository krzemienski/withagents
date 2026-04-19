# Plan Strengthening Package — withagents.dev Brand Launch

**Produced by:** deepen-prompt-plan skill
**Date:** 2026-04-19 03:40
**Plan under review:** `/Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/`
**Paired with:** `reports/critic-260419-0241-red-team-review.md` (REVISE verdict, 5 show-stoppers, 15 questions)

Surgical edit package. Do NOT replace the plan — apply these redlines and absorb the injected sections.

---

## <resolution_matrix>

Which red-team findings are addressable in Mode 1 (before Phase 01 spawns) vs Mode 1 user Q&A vs deferred.

| # | Show-stopper | Path to resolve | Status |
|---|---|---|---|
| 1 | No metrics / baselines | Inject Phase 00 below + Mode 1 user Q&A for targets | **blocking Phase 01** |
| 2 | LinkedIn article = manual, not automated | Redline phase-05 + add manual-time budget to phase-06 | addressable in Mode 1 edit |
| 3 | hack.ski as clone = lazy duplication | **Mode 1 user Q&A** (pick: differentiate / redirect landing / drop) | **blocking Phase 01** |
| 4 | Pre-draft 90 pieces is impossible | Replace with streaming-publish rhythm + effort table below | addressable in Mode 1 edit |
| 5 | devlog-publisher-website plan overlap unresolved | **Mode 1 user Q&A** (pick: retire / complete first / absorb) | **blocking Phase 01** |

**Three decisions block Phase 01 spawn. Do not launch audit agents until resolved.**

</resolution_matrix>

---

## <phase_00_insertion id="Phase 00 — Baseline Capture" priority="block_phase_01">

Inject as new file `phase-00-baseline-capture.md`. Runs before Phase 01. Zero-day snapshot for measurement honesty.

### Required captures (before any Phase 01 agent spawns)

```xml
<baseline_snapshot captured_at="YYYY-MM-DD HH:MM">
  <github>
    <followers_krzemienski>N</followers_krzemienski>
    <stars_per_flagship>
      validationforge=1, sessionforge=5, ils-ios=1, code-tales=0, code-tales-platform=1,
      auto-claude-worktrees=0, claude-code-skills-factory=0, multi-agent-consensus=0,
      shannon-framework=2, ralph-loop-patterns=0, agentic-development-guide=1,
      claude-ios-streaming-bridge=0, claude-sdk-bridge=0, claude-prompt-stack=0,
      stitch-design-to-code=0
    </stars_per_flagship>
    <stars_sum_flagship_total>N</stars_sum_flagship_total>
    <stars_sum_61_companion_repos>N</stars_sum_61_companion_repos>
    <public_repo_count>N</public_repo_count>
  </github>
  <linkedin>
    <followers>N</followers>
    <posts_last_30d>N</posts_last_30d>
    <avg_engagement_per_post>N</avg_engagement_per_post>
  </linkedin>
  <x_twitter>
    <followers>N</followers>
    <posts_last_30d>N</posts_last_30d>
    <impressions_last_30d>N</impressions_last_30d>
  </x_twitter>
  <web>
    <agentic_development_guide_site>
      <traffic_30d>N uniques</traffic_30d>
      <top_referrer>source</top_referrer>
    </agentic_development_guide_site>
  </web>
  <inbound>
    <consulting_inquiries_last_90d>N</consulting_inquiries_last_90d>
    <funnel_source>nowhere defined today</funnel_source>
  </inbound>
</baseline_snapshot>
```

### Collection commands (actual, runnable)

```bash
# GitHub — single JSON, no API waste
gh api users/krzemienski --jq '{followers, public_repos}' > reports/baseline-github-user.json
gh api users/krzemienski/repos?per_page=100 --paginate --jq \
  '[.[] | {name, stars: .stargazers_count, forks: .forks_count, watchers: .watchers_count}]' \
  > reports/baseline-github-repos.json

# LinkedIn / X — manual snapshot, no public count-fetch API
# User must open profile and record in baseline_snapshot YAML

# Web analytics — depends on final analytics tool (see Decision 8 below)
```

### Acceptance criteria

- [ ] `reports/baseline-2026-04-19.yaml` exists with every field populated (no TBDs)
- [ ] GitHub JSON exports committed to `reports/`
- [ ] LinkedIn + X numbers hand-recorded (screenshot saved to `reports/baseline-screenshots/`)
- [ ] Snapshot signed off by user before Phase 01 spawn

**Why:** Without a baseline, no follow-up measurement has meaning. Future "the push worked" claims become unfalsifiable.

</phase_00_insertion>

---

## <metric_targets>

Inject these into plan.md as Decision 8 (new). Floors, not ceilings. Failure to hit the floor triggers kill-switch (see below).

| Metric | 30-day floor | 30-day aspiration |
|---|---|---|
| Consulting inquiries | ≥3 qualified (reply received) | ≥8 |
| LinkedIn follower delta | +15% (or +N whichever larger) | +30% |
| X follower delta | +10% | +25% |
| Flagship repo stars (total across 3: validationforge, code-tales family, manifesto companion) | +100 | +300 |
| withagents.dev unique visitors (Plausible count) | 1,000 | 5,000 |
| Blog post avg time-on-page | ≥3 min | ≥5 min |
| Non-flagship product repo stars delta | +25 across portfolio | +75 |

**Targets are placeholders — confirm with user in Mode 1 Q&A before Phase 01.**

</metric_targets>

---

## <kill_switch_rules>

Inject as Decision 9. Pre-committed tripwires; author signs on BEFORE push start so mid-push emotion doesn't override.

```xml
<kill_switch>
  <checkpoint day="10">
    <trigger>consulting_inquiries=0 AND linkedin_follower_delta<+5% AND flagship_stars_delta<+10</trigger>
    <action>24h pause. Review content quality with model-different reviewer. Cut remaining calendar by 40% or pivot.</action>
  </checkpoint>
  <checkpoint day="20">
    <trigger>consulting_inquiries<2 AND aggregate_engagement_trending_flat</trigger>
    <action>Finish current-week commitments. Skip the remaining flagship if it's the 3rd (manifesto). Redirect energy to inbound follow-up.</action>
  </checkpoint>
  <health_tripwires any_day="true">
    <trigger>2 consecutive missed publish days</trigger>
    <action>Mandatory 48h buffer pause. No catch-up double-ups (see content backlog rhythm below).</action>
  </health_tripwires>
  <public_backlash_tripwire>
    <trigger>≥1 specific, substantiated criticism of content authenticity (e.g. "this is AI-written" callout with evidence)</trigger>
    <action>Halt all publishing for 24h. Review voice drift. Patch voice guardrails before next publish.</action>
  </public_backlash_tripwire>
</kill_switch>
```

</kill_switch_rules>

---

## <mode_2_effort_estimates>

Red-team show-stopper #4 demands effort estimates exist BEFORE approval. Here they are, justified.

| Phase | Deliverable | Hours | Calendar days | Justification |
|---|---|---|---|---|
| 08 | Visual system production (final exports, tokens, components) | 16-24h | 3-4 | Theme already spec'd in Phase 03; production exports are mostly rendering + token extraction. |
| 09 | CMS site build (Astro+Keystatic, templates, OG, DNS, Vercel) — withagents.dev | 40-56h | 7-10 | From-zero repo stand-up (8h), Keystatic schemas (6h), templates incl. series/projects/now/work (12h), OG Satori wiring (4h), DNS+Vercel+analytics (4h), content seeding (6h), QA (4h). |
| 09b | hack.ski variant (if kept as separate site) | +16-24h | +3-4 | Shared stack; work is content-model divergence, nav, copy overrides, second DNS/Vercel. **Zero if hack.ski collapses to redirect landing.** |
| 10 | Content pre-draft backlog + publish-rhythm setup | 60-90h | 10-14 | 3 flagships × 6-8h = 24h. 8-10 product posts × 3-4h = 32h. 6-8 insights × 1-2h = 12h. Voice review pass +20% = 14h overhead. See rhythm below — **not all of this pre-push; ~60% pre-push, 40% during**. |
| 11 | Automation infra (syndication runner, credentials, cron/hooks) | 60-80h | 10-14 | LinkedIn OAuth2 + X API v2 wiring (16h), Keystatic-publish webhook → runner (8h), platform adapters (24h: LinkedIn-short, X-thread, repo README patch), error handling + retry (8h), Supabase logging (4h), manual-LinkedIn-article prep tooling (6h), credential vault (4h). **Red-team "2-3 weeks" is right.** |
| 12 | 30-day scheduled launch + monitoring | 30-45h | 30 | ~1h/day monitoring + 30 min/day engagement. ~60 min/day across 30 days = 30h minimum. Flagship days +2-3h. |
| 13 | Consultant pipeline (work-with-me, inbound capture) | 16-24h | 3-4 | **Must complete BEFORE Phase 12 starts** — CTA cannot fire on day 1 if funnel is built on day 15. |
| 14 | Measurement + post-mortem + next-30-day plan | 16-24h | 2-3 | Analytics rollup + post-mortem + iteration plan. |

**Totals:**
- Solo dev path (hack.ski = redirect, not full site): **~258-343 hours ≈ 43-58 working days ≈ 9-12 weeks end-to-end.**
- Solo dev path (hack.ski = full site): **+16-24h ≈ add 1 week.**
- **30-day push window is only Phase 12.** Phases 08-11 + 13 must complete BEFORE day 1. That's ~5-7 weeks of runway.

**Redline for phase-07 section 12:** "Build effort estimate — rough week-count per Mode 2 phase" → replace with the table above. Estimate exists BEFORE approval.

</mode_2_effort_estimates>

---

## <content_backlog_rhythm>

Red-team show-stopper #4. "Pre-draft everything" is impossible. Replace with streaming rhythm.

### Redline for phase-06 Risks section

**Current:** `"Mitigation: pre-draft everything in Phase 10 before day 1 so execution is 'publish, don't write'"`

**Replace with:**

```xml
<publish_rhythm>
  <pre_push_minimum_drafts>
    <flagship_posts>3 of 3 fully drafted, voice-reviewed, assets cut</flagship_posts>
    <product_posts>5 of 8-10 drafted to ≥80% (body done, hero+diagram outlined)</product_posts>
    <insight_posts>0 — written live from library within 48h of publish slot</insight_posts>
    <linkedin_long_form>3 of 3 flagship articles fully drafted; shorts live-written</linkedin_long_form>
    <x_threads>flagship threads drafted; product/insight threads live-written</x_threads>
  </pre_push_minimum_drafts>
  <during_push_cadence>
    <week_1>3-4 posts + flagship 1 launch (validationforge). ~25h.</week_1>
    <week_2>2-3 posts + flagship 2 launch (Code Stories — GATED on domain + readiness). ~22h.</week_2>
    <week_3>2-3 posts, no flagship. Rest week. ~15h.</week_3>
    <week_4>2-3 posts + manifesto launch. ~22h.</week_4>
  </during_push_cadence>
  <buffer_rule>
    3 declared off-days distributed across weeks. Missed deliverable = 24h pause, never double-up.
  </buffer_rule>
  <reserve_content>
    Pre-drafted 2 "emergency insight" posts. Used only if health tripwire fires or two consecutive misses threaten cadence.
  </reserve_content>
</publish_rhythm>
```

### Required pre-push content (concrete backlog)

| Piece | Lead time before publish slot | Hours |
|---|---|---|
| Flagship 1 (validationforge GA) | Day 1 — drafted by day -14 | 8h |
| Flagship 2 (Code Stories manifesto) | Day ~12 — drafted by day -7 | 8h |
| Flagship 3 (closing manifesto) | Day 28 — drafted by day 14 | 8h |
| 5 product posts from top-5 30d-active | Week 1-2 — drafted by day -7 | 20h |
| 3 LinkedIn long-form articles (flagships) | Same as flagships | 6h |
| 2 reserve emergency insight posts | Day -3 | 4h |
| **Pre-push total** | | **~54h** |

**Remaining ~30-40 hours of drafting happens during the push itself, 2-3h/day average on product/insight posts.** Streaming rhythm, not pre-everything.

</content_backlog_rhythm>

---

## <hack_ski_differentiation_options>

Red-team show-stopper #3. Current "clone with copy differences" is worst-of-three. Decide in Mode 1 Q&A.

```xml
<hack_ski_decision required_before="phase_01_spawn">
  <option_a name="Differentiate visually">
    <visual_delta>Different accent palette (swap neon green → cyan #00d4ff, neon yellow → magenta #ff00aa). Different motif: retro-vaporwave instead of terminal scanlines.</visual_delta>
    <content_overlap>0-25% shared posts (manifesto yes; product posts = withagents.dev only).</content_overlap>
    <effort>+16-24h visual system variant (phase-03), +16-24h build variant (phase-09b). ~4-6 days.</effort>
    <narrative>hack.ski = personal exploration; withagents.dev = professional consulting.</narrative>
  </option_a>
  <option_b name="Redirect landing">
    <visual_delta>Single-page hack.ski with bio + 4 link buttons. No CMS, no blog.</visual_delta>
    <content_overlap>0% shared posts.</content_overlap>
    <effort>2-4h. Just a static HTML page + DNS wire.</effort>
    <narrative>hack.ski = personal front door; withagents.dev = where the work lives.</narrative>
  </option_b>
  <option_c name="Drop from this cycle">
    <visual_delta>N/A. Parked domain.</visual_delta>
    <content_overlap>N/A.</content_overlap>
    <effort>0h.</effort>
    <narrative>Revisit after push if distinct-surface pull exists.</narrative>
  </option_c>
  <option_d_current name="Clone with copy differences" status="NOT_RECOMMENDED">
    <visual_delta>None.</visual_delta>
    <content_overlap>~100% (same posts, different framing).</content_overlap>
    <effort>+16-24h (build variant only).</effort>
    <narrative>Reads as domain A/B test, SEO duplicate content risk, no brand differentiation value.</narrative>
  </option_d_current>
</hack_ski_decision>
```

**Recommendation:** Option B (redirect landing) for this cycle. Cheap, signals personal brand without duplication, defer Option A until there's pull signal.

</hack_ski_differentiation_options>

---

## <devlog_publisher_website_disposition>

Red-team show-stopper #5. Current plan 260305-2119-devlog-publisher-website/ has 42+ modified files in `posts/` right now.

```xml
<disposition_decision required_before="phase_01_spawn">
  <option_a name="Complete first, then start">
    <action>Finish in-flight 260305-2119 plan — push all pending posts, deploy, close the plan. THEN start Phase 01 of this plan.</action>
    <time_impact>+1-2 weeks before Phase 01.</time_impact>
    <risk>Lose momentum on withagents.dev launch; blog-series posts may not match new voice spec.</risk>
  </option_a>
  <option_b name="Absorb into Phase 09" recommended="true">
    <action>Retire 260305-2119 as a separate plan. This plan's Phase 09 CMS build imports the 18 posts and refactors into new content model. Commit in-flight edits that are still wanted; revert the rest.</action>
    <time_impact>+4-6h in Phase 09 for content migration + voice audit.</time_impact>
    <risk>Merge conflicts on in-flight edits — resolve before Phase 01 by either committing or stashing.</risk>
  </option_b>
  <option_c name="Retire, discard in-flight work">
    <action>Archive 260305-2119 plan, `git stash` or `git checkout --` the 42 modified files. Start fresh.</action>
    <time_impact>0h. Instant.</time_impact>
    <risk>Lose uncommitted work. Interview user on what's in the 42 files first.</risk>
  </option_c>
</disposition_decision>
```

**Recommendation:** Option B. Absorb. But first — user must describe what the 42 in-flight files contain (fresh posts? bug fixes? social cards?). Non-negotiable Mode 1 Q&A.

</devlog_publisher_website_disposition>

---

## <syndication_runner_scope_correction>

Red-team flagged `scripted Node/TS` as a bullet hiding 2-3 weeks of engineering. Correct.

### Redline for phase-05 "Syndication Runner" section

Add breakdown:

```xml
<syndication_runner_breakdown>
  <component name="LinkedIn adapter" hours="16">
    OAuth2 flow (partner approval needed for some scopes), post-share API,
    image upload API, metadata scraping. **Long-form article = manual UI publish.**
    Adapter only posts shares, not articles.
  </component>
  <component name="X adapter" hours="12">
    API v2 basic tier ($100/mo minimum for write access), thread-posting (sequential tweets + reply chain),
    image upload, rate-limit handling.
  </component>
  <component name="Repo README patcher" hours="6">
    gh CLI wrapper, edits README with "Featured in: {post}" section, commits, pushes.
  </component>
  <component name="Keystatic publish webhook" hours="6">
    Vercel deploy hook → webhook endpoint → reads latest post frontmatter → enqueues syndication jobs.
  </component>
  <component name="Manual-mode tooling for LinkedIn articles" hours="6">
    Script that pre-generates article body + image + metadata + canonical URL template, outputs to clipboard + file
    for 5-min-or-less manual LinkedIn UI paste.
  </component>
  <component name="Supabase logging + retry" hours="8">
    Every syndication event logged (platform, post_id, status, attempts). Retry queue for transient failures.
  </component>
  <component name="Error handling + dashboards" hours="8">
    What happens when X rate-limits? LinkedIn 401s? Auto-pause, alert author, retry next day.
  </component>
  <total_hours>62</total_hours>
  <calendar_days>10-12</calendar_days>
  <prerequisites>API credentials for LinkedIn + X; Supabase project provisioned; Vercel webhook endpoint</prerequisites>
</syndication_runner_breakdown>
```

Move this into phase-11-automation-infra.md (currently blocked / not yet written — use this as its content when Mode 2 unblocks).

</syndication_runner_scope_correction>

---

## <voice_drift_guardrail>

Red-team: current plan repeats the same `/ckm:copywriting` + `/ckm:brand` stack that caused the 2026-04-18 Sonnet drift restart. Adding a model-different review pass as mitigation.

### Inject into phase-10-content-generation.md (when written)

```xml
<voice_guardrail>
  <rule name="Model-different review pass">
    Every piece drafted by model X gets reviewed by model Y before publish.
    Example: sonnet drafts → opus reviews (or haiku reviews for cheap first-pass).
    Reviewer's only job: flag AI tells (em-dash overuse, "it's not just X, it's Y" patterns,
    corporate transitions, generic empathy openers).
  </rule>
  <rule name="Voice spec as 1-page doc, not skill-derivation">
    Write `synthesis/voice-spec.md` in Phase 02 with:
    - 3 tone examples from Nick's actual past posts (not generated)
    - Banned words/phrases (em-dash count cap, corporate phrases)
    - Sentence-structure patterns to preserve
    Reviewer compares draft against voice-spec.md, not against general /ckm skills.
  </rule>
  <rule name="Publish gate — minimum 1 model-other review">
    If author reviews own content, that counts as 0 reviews.
    Every publish requires ≥1 independent model review logged to `reports/voice-review-{post-slug}.md`.
  </rule>
</voice_guardrail>
```

**Why:** MEMORY.md records that the author discovered Sonnet-drafted-and-self-reviewed content was off-voice only after a full Wave 1 restart. Guardrail enforces the lesson.

</voice_drift_guardrail>

---

## <phase_index_updates>

Redline for plan.md phase index table.

| # | Old | New |
|---|---|---|
| — | (none) | **00 · baseline-capture.md — MUST complete before 01** |
| 01 | audit-workstreams (7 agents) | audit-workstreams (**7 agents → 8 if Workstream H added**; Workstream G trimmed; Workstream E requires matrix-format output) |
| 11 | automation-infra (one bullet) | automation-infra (**62h, 10-12d**; see syndication runner breakdown) |
| 13 | consultant-pipeline | **MUST complete before 12**, not after. Reorder: 8 → 9 → 13 → 10 → 11 → 12 → 14. |
| 09b | (not present) | Only if hack.ski = Option A (differentiate). Skip if Option B or C. |

</phase_index_updates>

---

## <additional_decisions_for_mode_1_qa>

Append to Mode 1 user Q&A. Red-team's 15 questions filtered to the blocking set:

1. **hack.ski**: Option A / B / C? (Option B recommended.)
2. **260305-2119-devlog-publisher-website**: Option A / B / C? (Option B recommended + describe the 42 in-flight files.)
3. **Success metrics**: Confirm floors in the table above (or provide alternatives).
4. **Kill-switch checkpoints**: Sign off on day-10 and day-20 tripwires.
5. **Analytics tool**: Plausible / Vercel Analytics / PostHog — pick one now. (Plausible recommended — light, privacy-first, fits brand.)
6. **Consultant funnel mechanism**: Form embedded on /work, email direct, or Calendly? (Form → email → Calendly link recommended; UTM tagging per channel.)
7. **Voice spec source**: OK to derive from 3 existing Nick posts (which posts?) + custom banlist? Or separate doc.
8. **LinkedIn + X API credential handoff**: Who/when/where (1Password, env file, shared vault)?
9. **X API paid tier**: Budget approved for basic tier ($100/mo) for write access?

</additional_decisions_for_mode_1_qa>

---

## <final_pass_checks>

<check name="stronger_not_longer">
Plan was ~350 lines across 8 files. Strengthening adds Phase 00 (~60 lines), redlines affect ~40 existing lines, new decisions ~30 lines. Net growth ~20%. Within budget for a 1500+ word plan.
</check>

<check name="planning_boundary_intact">
No implementation code. Commands shown are acceptance-criteria evidence collectors, not implementation.
</check>

<check name="selective_not_blanket">
Deepened exactly 8 sections (measurement, risks/kill-switch, effort estimates, hack.ski, content rhythm, syndication runner, voice drift, devlog-publisher disposition). Untouched: Phase 01 workstream A-D core scope, Phase 02 synthesis goals, Phase 03 theme palette, Phase 04 IA.
</check>

<check name="originality_preserved">
Author intent preserved: 30-day multi-channel push, withagents.dev umbrella, hyper-terminal theme, flagship-anchored calendar, real-session-mined content, consultant positioning. Nothing scoped out.
</check>

<check name="validation_gates_present">
Phase 00 acceptance criteria inject measurement gates. Kill-switch provides abort gates. Content voice guardrail provides publish gates.
</check>

</final_pass_checks>

---

## <next_action>

1. User reviews this strengthening package + red-team report.
2. User answers the 9 blocking Mode 1 Q&A items above.
3. Apply redlines surgically to plan.md, phase-01, phase-05, phase-06, phase-07.
4. Create new phase-00-baseline-capture.md.
5. THEN spawn Phase 01 (Wave 1) audit agents.

Do **not** spawn Phase 01 agents until steps 1-4 complete. Three decisions (hack.ski, devlog-publisher-website, metric targets) are hard blockers — downstream reports will be wrong-scoped without them.

</next_action>
