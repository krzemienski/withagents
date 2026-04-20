---
title: "Unified Launch Remediation — Track A (pre-launch fixes) + Track B (Phase 12 execution) + Track C (amplification)"
description: "Pre-launch code/content remediation, 45–60 day Phase 12 runbook, multi-channel amplification playbook"
status: proposed (deep mode, red-team REVISE addressed 2026-04-19, deepened 2026-04-19, pending validate)
priority: P1
effort: 205-245h remaining (Track A ~45-62h, Track B ~45-68h, Track C ~115-125h)
branch: master
tags: [launch, phase-12, amplification, remediation, withagents]
blockedBy: [260419-0241-agentic-dog-brand-launch]
blocks: []
mode: deep
created: 2026-04-19
deepened: 2026-04-19
---

# Unified Launch Remediation

Pre-launch remediation (A) + Phase-12 execution (B) + amplification (C). Track A must complete before Track B Day −1. Tracks B + C run concurrently Day 1 → Day 45/60.

## Track summary

| Track | Scope | Effort | Output |
|---|---|---|---|
| **A. Pre-launch remediation** | 10 code blockers (A1) + 6 reflexion polish items (A5) + Beehiiv setup (A4) + audit spot-verify (A2) + P10 date-root-cause + arc-date helper (A6) + content resonance gate (A7) | 45–62h | Green smoke-suite, shipped Beehiiv, fixed content, single-source arc-date, 3 flagships passed resonance gate |
| **B. Phase-12 execution** | Day −10 decisions → Day 60 daily runbook + kill-switch + metrics + operator-down protocol + Day-1 minute-by-minute | 45–68h across 45–60d | 42–52 posts live with evidence |
| **C. Amplification** | LinkedIn Articles (3–4/wk cap, 16–18 total), X threads (45), Beehiiv RSS, PH/HN flagships; Reddit + carousels + Boosts + Company page + segmentation deferred to C7 | ~115–125h across 45–60d | ≥12 inquiries, +15% LI followers, ≥300 newsletter subs |

## Dependency graph

```
Track A ──┬─ A1 code blockers (10 items — incl. B1.8 article-prep, B1.9 audit scripts, B1.10 /consulting/) ──┐
          ├─ A2 content verify + P10 root-cause                                                             │
          ├─ A3 functional val                                                                              │
          ├─ A4 beehiiv setup                                                                               │
          ├─ A5 wave1b polish (imports arc-date from A6)                                                    │
          ├─ A6 arc-date helper (single source) ◄── B1.1 writes .launch-date, all callers import            ├─► B1 pre-push decisions ─► B2 pre-push infra ─► B3 daily runbook
          └─ A7 content resonance gate (5 readers × 3 flagships, full-arc audit) ──────────────────────────┘                                                       │
                                                                                                                                                                   ├─► B4 kill-switch
                                                                                                                                                                   └─► B5 metrics

                                                            Day 1 ►  C1 LinkedIn (16–18 Articles, Mon-Thu) ─┐
                                                                     C2 X                                  ├─ concurrent with B3
                                                                     C6 Beehiiv                            │
                                                                     C3 PH ─ Day 1 + Day 35 (gated by B1.10 /consulting/)
                                                                     C4 HN ─ Day 1, Day 22*, Day 50 (flagships only; C4.2 gate = repo-liveness.sh)
                                                                     C5 [DEFERRED → C7]
                                                                     C7 deferred items (post-Day-60 review)
```

<critical_path>
A1 → A3 → B2.8 smoke → B2.7 prod-alias swap → B3.1 Day-1 dry-run is the single-point-of-failure chain.
A7 resonance gate runs parallel to A1–A6 but blocks B3 Day 1 directly — slippage here pushes launch.
B1.1 launch-date constraint enforces ≥10 calendar days between decision commit and Day 1; that is the floor on A→B elapsed time.
</critical_path>

Key dependencies added by red-team remediation:
- A6 blocks A5 (A5.5 now imports from A6) and is in turn unblocked by B1.1 (.launch-date)
- A7 blocks B3 (runbook cannot start until 3 flagships pass resonance gate)
- A1 blockers B1.8 → unblocks C1/B3.4 (LinkedIn article-prep.ts)
- A1 blockers B1.9 → unblocks A5.2/A5.4 (audit scripts)
- A1 blockers B1.10 → unblocks C3.2 PH Launch #2 (/consulting/ page)

## Locked decisions

Each decision carries value, rationale source, confidence, reversibility, and downstream phase impact.

<decision id="1" topic="x_scheduler" confidence="HIGH">
  <value>Typefully Pro ($15/mo) OR manual; X API Basic tier rejected.</value>
  <rationale>R1 §2 + pricing check 2026-04 — Basic tier $200/mo plus Feb 2026 new-signup freeze invalidates ROI for post-only use.</rationale>
  <reversibility>Tool swap mid-run acceptable — no data migration.</reversibility>
  <consumers>B1.5, B3.5</consumers>
</decision>

<decision id="2" topic="r_programming" confidence="HIGH">
  <value>Removed from amplification plan.</value>
  <rationale>Subreddit policy now bans all LLM-generated content (verified mod post 2026-Q1).</rationale>
  <reversibility>Irreversible unless policy reverses.</reversibility>
  <consumers>C7 (Reddit deferred)</consumers>
</decision>

<decision id="3" topic="beehiiv" confidence="MED">
  <value>Adopted (free tier, RSS import, draft-mode).</value>
  <rationale>R2 — Beehiiv free tier ≤2,500 subs + RSS auto-draft fills the newsletter gap left by Substack skip; 3–5× higher consulting conversion per R2 comparison.</rationale>
  <reversibility>Publication can be paused Day 20 if subs <50 without data loss.</reversibility>
  <consumers>A4, B1.3, B2.5, C6</consumers>
</decision>

<decision id="4" topic="product_hunt_scope" confidence="MED">
  <value>PH Day 1 = series launch; PH Day 35 = consulting-practice; VF PH deferred to V1 GA (post-Day 60).</value>
  <rationale>Maker single-day fatigue risk; 2 launches in 45d acceptable, 3 is not. Pre-GA VF launch risks a bad first impression.</rationale>
  <reversibility>VF PH can reschedule post-Day 60.</reversibility>
  <consumers>C3.1, C3.2, B1.2</consumers>
</decision>

<decision id="5" topic="hacker_news_scope" confidence="HIGH">
  <value>3 submissions max — Day 1 Show HN, Day 22 Ralph (conditional), Day 50 manifesto.</value>
  <rationale>R2 §4 — &gt;3 submissions in 45d from same author risks shadowflag; flagships only preserves signal-to-noise.</rationale>
  <reversibility>Skipping a scheduled HN day is safer than adding an unplanned one.</reversibility>
  <consumers>C4.1, C4.2, C4.3, B1.4</consumers>
</decision>

<decision id="6" topic="linkedin_article_cap" confidence="HIGH">
  <value>3–4 Articles/week cap → 16–18 total; preference Mon–Thu (relaxed from Tue/Wed only).</value>
  <rationale>R2 §1.1 — algorithm throttles authors posting &gt;4 Articles/wk for 7d. Tue/Wed-only infeasible: flagship Days 7 and 14 from Tue launch land on Monday.</rationale>
  <reversibility>Cap can tighten; cannot loosen without reach penalty.</reversibility>
  <consumers>C1.2, B3.4</consumers>
</decision>

<decision id="7" topic="iam_key_rotation" confidence="HIGH">
  <value>User-owned; flagged in B4.3 security trigger, not blocking the arc.</value>
  <rationale>Rotation frequency tied to Nick's personal security cadence, not launch schedule.</rationale>
  <reversibility>N/A</reversibility>
  <consumers>B4.3 (security trigger)</consumers>
</decision>

<decision id="8" topic="keystatic_admin" confidence="HIGH">
  <value>Gate admin route behind `KEYSTATIC_ENABLED` env var OR drop route pre-Day −1 (KISS path preferred).</value>
  <rationale>R3 — `kind: 'local'` storage breaks in Vercel serverless; GitHub-mode adds OAuth infra unneeded for 45d arc.</rationale>
  <reversibility>Can re-enable GitHub-mode post-Day 60 if CMS UI is demanded.</reversibility>
  <consumers>A1.3</consumers>
</decision>

## Scope boundaries

<in_scope>
- 45 MDX posts (Day 1 → Day 45) on withagents.dev; off-days 6/30/32/33; devlog-only Days 31/60
- LinkedIn (Articles + feed), X (threads), Beehiiv (RSS newsletter), 3 HN submissions, 2 PH launches
- Consulting-inquiry capture (Supabase `consultant_inquiries` + Resend email)
- Kill-switch automation for quantitative triggers; manual flag for LI sentiment + security
- Opus-model voice review on flagships + A7 resonance gate
</in_scope>

<out_of_scope>
- Substack or Medium cross-posting → deferred C7
- Company page activation before Day 30 (conditional trigger in C1.9)
- Reddit participation → deferred C7 (moderation risk)
- Paid ads, sponsored content, influencer partnerships
- ValidationForge PH launch — reserved for V1 GA post-Day 60
- Custom newsletter domain if launch &lt;5d from B1.3 decision (hosted subdomain fallback)
- Multi-operator arrangements — solo-operator only; illness fallback via B3 Scenarios A/B/C
</out_of_scope>

## Acceptance criteria per track

<track_acceptance id="A" label="Pre-launch remediation">
  <criterion id="A.1" evidence="scripts/audit/*.ts exit 0; pnpm build exits 0; runner.ts --dry-run exits 0">
    10 code blockers fixed (A1.1–A1.10); Supabase channel-name mapper verified via INSERT+SELECT on staging; B1.8 article-prep.ts emits title+body for day-01; B1.9 audit scripts pass; B1.10 /consulting/ returns 200.
  </criterion>
  <criterion id="A.2" evidence="plans/reports/planner-260419-1208-audit-spotverify.md + scripts/verify-post-dates.py exit 0">
    Audit-agent spot-verify report filed (1 finding per cohort confirmed against file state); P10 staging doc patched with canonical date formula; all 45 posts match `launch + (day-1)` arithmetic.
  </criterion>
  <criterion id="A.3" evidence="plans/260419-1200-unified-launch-remediation/evidence/smoke-S*.png × 18">
    R3 smoke tests ≥18/18 green against preview deploy (or documented waiver for S7 Keystatic gate); failure artifacts absent.
  </criterion>
  <criterion id="A.4" evidence="Beehiiv Sending→Domain=Verified screenshot; dig outputs for DKIM CNAME, SPF/DMARC TXT">
    Beehiiv publication live; RSS draft-mode polls `withagents.dev/rss.xml`; DMARC quarantine policy active; test email to `nick@withagents.dev` renders across Gmail + Apple Mail.
  </criterion>
  <criterion id="A.5" evidence="plans/phase-12-prelaunch/A7-synthesis-day{01,22,50}.md + ckm-260419-a7-full-arc-audit.md">
    A7 resonance gate: 3 flagships × ≥4 readers aggregate ≥3.8 across all 4 dimensions with no single dimension &lt;3.5; ≥42/45 full-arc `/ckm:write:audit` PASS (or residual-risk doc justifies FAILs shipped).
  </criterion>
  <criterion id="A.6" evidence="rg returns 0 matches for hardcoded literals outside shared/arc-date.ts">
    Arc-date helper single-source (A6): grep sweep passes; all TS callers (runner.ts, kill-switch-check.ts, daily-capture.ts, staging re-export) import from `scripts/syndication/shared/arc-date.ts`; Python side reads `.launch-date` only.
  </criterion>
</track_acceptance>

<track_acceptance id="B" label="Phase-12 execution">
  <criterion id="B.1" evidence="Day −1 green-light script exits 0; .audit/B2/smoke-report.txt contains '18 passed'">
    Day −1 checklist 100% complete: DNS verified via `dig`, all 8 Vercel env vars in Production scope only, SSL `notAfter` ≥60d, Slack webhook round-trip `ok`.
  </criterion>
  <criterion id="B.2" evidence="plans/phase-12-evidence/day-NN/{blog,linkedin,x,readme}-url.txt + runner.log for each publishing day">
    Days 1 → 45 (or 60) dispatched with 4-URL evidence per day; off-days (6/30/32/33) have explicit SKIPPED.md; Supabase `syndication_log` has row-per-channel per day with final `response_url` filled.
  </criterion>
  <criterion id="B.3" evidence="plans/phase-12-retro/kill-switch-day-*.md on trigger OR .syndication-paused absent throughout run">
    Kill-switch either never fired OR every firing has a post-mortem citing Slack alert permalink, numeric resume gate met before `.syndication-paused` removed and cron re-enabled.
  </criterion>
  <criterion id="B.4" evidence="plans/phase-12-metrics/day-NN.json for every active day + rollup.csv regenerated nightly">
    Schema-valid JSON per day; no null fields persist &gt;1 day after capture; retros filed at Day 14/30/45/60 citing rollup.csv rows.
  </criterion>
  <criterion id="B.5" evidence="B3 doc Scenarios A/B/C section committed + Day-1 minute-by-minute table executed">
    Operator-down protocol referenced by B4.6 pause; Day-1 PT-unified schedule executed with ≤30min slip on any PROTECT-tier activity (HN first-comment, HN 4h reply window, LI Article publish, B3.6 evidence, B3.7 Supabase UPDATE, EOD retro).
  </criterion>
</track_acceptance>

<track_acceptance id="C" label="Amplification">
  <criterion id="C.1" evidence="scripts/syndication/linkedin-article-log.md: 16–18 entries, no ISO week &gt;4, all 6 flagship days present">
    16–18 LinkedIn Articles; 45 feed posts with ≤1 missed day; first-comment UTM on 100% of posts.
  </criterion>
  <criterion id="C.2" evidence="plans/phase-12-evidence/day-NN/x-url.txt × ≥42 files with valid x.com URLs">
    ≥42 X threads (45 minus off-days) via Typefully or manual per B1.5; no consecutive missed thread days beyond Scenario A illness.
  </criterion>
  <criterion id="C.3" evidence="Beehiiv dashboard subscriber count screenshot + rollup.csv open-rate average">
    ≥300 subs by Day 60 (aspirational floor); avg open-rate ≥35% across Day-1 → Day-45 sends.
  </criterion>
  <criterion id="C.4" evidence="news.ycombinator.com/user?id=&lt;handle&gt; submission history">
    3 flagship HN submissions: Day 1 Show HN executed; Day 22 per B1.4 (primary | hold | conditional_day23); Day 50 manifesto.
  </criterion>
  <criterion id="C.5" evidence="producthunt.com/@&lt;nick&gt;/launches page">
    2 PH launches: Day 1 series; Day 35 consulting (gated by B1.10 /consulting/ route returning 200).
  </criterion>
  <criterion id="C.6" evidence="plans/reports/c7-deferred-items.md with Day-60 re-evaluation date">
    Reddit / carousels / Boosts / Company page / segmentation / X authority sprint documented as deferred with explicit re-eval trigger.
  </criterion>
</track_acceptance>

## Cross-phase validation manifest

Plan-level gates verify track-handoff boundaries where silent failures cascade. Phase-level gates stay in their phase docs.

<validation_gate id="PG-1" blocking="true" at="A → B handoff (Day −1)">
  <prerequisites>A.1–A.6 criteria checkboxes all true; `.launch-date` committed; `DECISIONS-LOCKED.md` has all 7 B1 rows populated.</prerequisites>
  <execute>Run B2 "Day −1 pre-go/no-go green-light" block against prod alias `https://withagents.dev/`.</execute>
  <capture>stdout → `.audit/A-to-B-handoff/green-light-$(date +%s).log`; Playwright HTML report → `.audit/A-to-B-handoff/smoke-report/`.</capture>
  <pass_criteria>Every `dig` output matches expected value; `curl -sI https://withagents.dev/` returns 200 with SSL `notAfter` ≥60d; `vercel env ls | grep Production` enumerates all 8 required vars; Playwright prints `18 passed, 0 failed`; Slack webhook test returns `ok`.</pass_criteria>
  <review>READ the Playwright HTML report (not just the summary line); READ `.audit/B2/last-known-good.txt` to confirm rollback target exists; READ the green-light log verifying each command exited 0.</review>
  <verdict>PASS → Day −1 go | FAIL → slip launch +1 week; re-run the A-track phase that produced the failing artifact (do NOT patch around it).</verdict>
  <mock_guard>IF tempted to rely on Vercel UI cache instead of `dig` → STOP — real-system DNS evidence only.</mock_guard>
</validation_gate>

<validation_gate id="PG-2" blocking="true" at="Day 1 launch EOD">
  <prerequisites>B3 Day-1 minute-by-minute schedule executed; HN submission posted; PH launch posted.</prerequisites>
  <execute>Verify Day-1 evidence bundle at `plans/phase-12-evidence/day-1/` contains `{blog,linkedin,x,readme}-url.txt`, `runner.log`, `midday-plausible.json`, `launch-retro.md`.</execute>
  <capture>Bundle hash → `.audit/pg-2/day-1-bundle.sha256` via `find plans/phase-12-evidence/day-1 -type f | xargs shasum`.</capture>
  <pass_criteria>All 4 URLs return 200 via `curl -I`; Supabase `SELECT channel, status, response_url FROM syndication_log WHERE slug='day-01-...'` shows `linkedin_article|posted`, `x_thread|posted`, `readme_patch|posted`, all with non-null `response_url`; `launch-retro.md` contains ≥5 bullets with ≥1 "what worked" and ≥1 "what felt off".</pass_criteria>
  <review>READ each URL in a browser or via `curl -s`; READ `launch-retro.md` for concrete observations; READ the Supabase row output.</review>
  <verdict>PASS → Day 2 dispatch unblocks | FAIL → Day 2 delayed until bundle completed; a missing URL triggers B4.6 pause ONLY if the platform is down (not operator paste-miss — recoverable same day).</verdict>
  <mock_guard>IF tempted to mark a URL "posted" without fetching it → STOP — fetch returns 200 or it didn't ship.</mock_guard>
</validation_gate>

<validation_gate id="PG-3" blocking="false" at="Day 30 retro" blocks="C3.2 PH Launch #2">
  <prerequisites>Days 1 → 30 evidence + metrics captured; rollup.csv regenerated.</prerequisites>
  <execute>Generate retro per B5.5 template from `rollup.csv` rows 1–30.</execute>
  <capture>`plans/phase-12-retro/retro-day-30.md`.</capture>
  <pass_criteria>Retro contains: quantitative summary with ≥8 numeric fields populated (not null); top-3 and bottom-3 posts by pageviews; kill-switch trigger log (or explicit "none fired"); ≥1 mid-course correction with owner + due-day.</pass_criteria>
  <review>READ `rollup.csv` alongside the retro — every cited number must match a CSV cell.</review>
  <verdict>PASS → Day 31 devlog + Day 35 PH Launch #2 unblocked | FAIL → block C3.2 PH Launch #2 until retro completed (cannot ship consulting PH without 30d signal).</verdict>
</validation_gate>

<validation_gate id="PG-4" blocking="true" at="Day 40 extension decision">
  <prerequisites>PG-3 PASSed; 10 additional days of evidence captured.</prerequisites>
  <execute>Evaluate Day-40 numbers vs track-C targets (inquiries ≥12 by Day 60, Beehiiv subs ≥300, follower delta).</execute>
  <capture>Decision memo → `plans/phase-12-retro/day-40-extension-decision.md` with yes/no + numeric justification.</capture>
  <pass_criteria>Memo cites all four inputs: inquiries count vs target, Beehiiv subs count vs target, 1–5 self-reported energy/capacity, VF customer-discovery conflict status (per OQ-3).</pass_criteria>
  <review>READ the Day-30 retro next-window prediction — did Day 31–40 trend match the prediction? Discrepancy is signal, not noise.</review>
  <verdict>PASS (extend to Day 60) → C1.2 W7+ schedule populates | PASS (wrap Day 45) → C7 deferred-items review accelerates | FAIL (decision deferred) → escalate to user within 24h; default to Day-45 wrap if no decision by Day 42.</verdict>
</validation_gate>

<gate_manifest>
  <total_plan_gates>4 plan-level (phase-level gates tracked in their respective phase docs)</total_plan_gates>
  <sequence>PG-1 (A→B handoff, Day −1) → B3 daily loop + PG-2 (Day 1 EOD) → PG-3 (Day 30 retro) → PG-4 (Day 40 extension)</sequence>
  <policy>PG-1, PG-2, PG-4 BLOCKING; PG-3 non-blocking globally but blocks C3.2 PH Launch #2 specifically.</policy>
  <evidence_dir>`.audit/pg-*/` + `plans/phase-12-evidence/` + `plans/phase-12-metrics/` + `plans/phase-12-retro/`</evidence_dir>
  <regression>
    PG-1 FAIL → re-run the source phase (A1/A2/A3/A4/A5/A6/A7) that produced the failing artifact, not a partial patch.
    PG-2 FAIL → pause Day 2 until Day-1 bundle complete.
    PG-4 unresolved by Day 42 → default to Day-45 wrap to prevent schedule drift from indecision.
  </regression>
  <mock_guard>No plan-level gate accepts "the command probably passed" — evidence file on disk or it didn't happen.</mock_guard>
</gate_manifest>

## Open questions (genuine unknowns — not deferred decisions)

Each question carries a resolution trigger, owner, default-if-unresolved-by deadline, and impact-if-wrong.

<question id="OQ-1" topic="60_day_extension">
  <statement>Extend arc to Day 60 or wrap at Day 45?</statement>
  <resolution_trigger>PG-4 Day-40 evaluation (Day 30 retro energy + inquiry count delta).</resolution_trigger>
  <owner>Nick</owner>
  <default_if_unresolved_by>Day 42</default_if_unresolved_by>
  <default>Wrap at Day 45 — no-decision = no-extend.</default>
  <impact_if_wrong>Over-extend on fatigued cadence → voice drift; under-extend → leave Day 46–60 inquiries on the table. Extension is opt-in so wrap-default is the safer failure mode.</impact_if_wrong>
</question>

<question id="OQ-2" topic="A7_reader_response_floor">
  <statement>If ≤3 of 5 readers respond per flagship, ship with n=3 or slip?</statement>
  <resolution_trigger>Day −6 reader-response deadline check on A7 feedback files.</resolution_trigger>
  <owner>Nick + Opus copywriter synthesis</owner>
  <default_if_unresolved_by>Day −5 (3 days before launch)</default_if_unresolved_by>
  <default>Slip launch +3 days max; beyond that, ship with residual-risk doc per A7.5.</default>
  <impact_if_wrong>n=3 may miss a voice-drift pattern 5 readers would catch. Residual-risk doc acknowledges this; B4.1 sensitivity tightens on Days 1/22/50 in compensation.</impact_if_wrong>
</question>

<question id="OQ-3" topic="vf_customer_discovery_conflict">
  <statement>Nick's parallel VF customer-discovery commitments — time-share vs calendar conflict?</statement>
  <resolution_trigger>Day −5 capacity estimate based on committed VF interviews.</resolution_trigger>
  <owner>Nick</owner>
  <default_if_unresolved_by>Day −4</default_if_unresolved_by>
  <default>Assume 2h/day VF carve-out; reduce C1.5 reply sprint to 15min (from 30) on non-flagship days; flagship PROTECT-tier activities unchanged.</default>
  <impact_if_wrong>Quality drop in LI reply sprints → lower algorithmic reach. Flagship Days 1/22/50 shielded by PROTECT tier.</impact_if_wrong>
</question>

<question id="OQ-4" topic="hn_karma_floor">
  <statement>If Nick's HN account has &lt;50 karma at Day −10, is a friend-account hunt acceptable?</statement>
  <resolution_trigger>Day −10 karma check via `curl -s "https://news.ycombinator.com/user?id=&lt;handle&gt;"`.</resolution_trigger>
  <owner>Nick</owner>
  <default_if_unresolved_by>Day −8</default_if_unresolved_by>
  <default>Proceed solo regardless; document karma-floor shadowflag risk in `DECISIONS-LOCKED.md` B1 extended row.</default>
  <impact_if_wrong>Low-karma Show HN may get softer ranking. Friend-hunt risks an "inauthentic" flag later if surfaced.</impact_if_wrong>
</question>

### Resolved (moved from Open Questions to DECISIONS-LOCKED.md or deferred)

- X scheduler (→ B1.5 decision)
- Beehiiv custom domain (→ B1.3 decision)
- PH maker team (→ B1.2 decision)
- HN Day 22 contingency (→ B1.4 decision + numeric thresholds)
- Day-35 HN backstop (→ C7 deferred)
