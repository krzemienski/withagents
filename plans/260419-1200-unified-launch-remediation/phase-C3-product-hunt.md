# Phase C3 — Product Hunt (2 launches)

**Owner:** Nick (launch-day driver) + Sonnet helper (asset prep, comment-response drafts)
**Effort:** ~15h across 2 launches
**Status:** pending
**Blocks:** none
**Blocked by:** B2 (site live, OG images working per A1.4); A3 (functional validation passed)

## Context

Product Hunt = concentrated same-day traffic + social proof artifact (top-5 badge). Two launches scheduled:

1. **Day 1 — withagents.dev** (the series + site as "product")
2. **Day 35–40 — Consulting practice** (separate PH submission as a service offering)

**Locked decision (parent plan.md #47):** VF V1 is **NOT** a Track C PH launch. Reserve for post-GA. Attempting to launch VF beta on PH burns the one-shot introduction.

Source: R2 §3.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Fabricating social-platform screenshots, fake analytics → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Work items

### C3.1 — Launch #1: withagents.dev (Day 1)

**Fix:** Submit as the canonical launch of the series + site. Product name: `withagents.dev`. Tagline: `45-day field report on agentic development — by Nick Krzemienski`. Category: Developer Tools → Dev Resources.

**Submission timing:** submit at **00:01 PT** (12:01 AM Pacific) on Day 1. PH day runs 24h PT → submitting earliest maximizes the 24h voting window. Source: R2 §3.2.

**Assets (prepared Day -3):**
- **Thumbnail (240×240):** withagents.dev logo on Void Navy. File: `withagents-site/public/assets/ph/thumbnail.png`
- **Gallery (1270×760, 4 images):**
  1. Home hero screenshot
  2. Day 1 essay opening + chart
  3. Writing archive grid
  4. Footer newsletter signup
- **Tagline variants (A/B tested in PH preview tool):** above vs `4,534 Claude Code sessions, distilled into 45 days`
- **Description (260 char cap):** direct, metric-forward, no emoji. Draft in `plans/reports/ph-submission-day1.md`.

**First comment (maker note, posted by Nick within 5 min of go-live):**
```
Hi PH — I'm Nick. withagents.dev is the public trace of ~23k Claude Code
sessions I've run since January. 45 essays, 14 companion repos, all code
real. Happy to answer questions about the agentic workflows, the tooling
stack, or the 4 times I nearly broke prod. Full archive: <link>
```

**Verification:** PH submission page live at `producthunt.com/products/withagents-dev` by 00:05 PT Day 1. `posts/post-01/evidence/ph-submission-day1.png` screenshot captured.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>withagents.dev production DNS resolving; A3 smoke PASSED; PH maker account active (`curl -sI https://www.producthunt.com/@<nick-handle>` returns 200); Day 1 assets uploaded to `withagents-site/public/assets/ph/`</prerequisites>
  <execute>curl -sI https://www.producthunt.com/products/withagents-dev && curl -sL https://www.producthunt.com/products/withagents-dev | grep -oE 'datetime="[^"]+"' | head -1</execute>
  <capture>evidence/phase-C3/vg-1-ph-day1-submission.log</capture>
  <pass_criteria>HTTP 200 on product page; `datetime=` extracted within 00:01–00:05 PT window Day 1; ≥5 assets present (`ls withagents-site/public/assets/ph/ | wc -l` ≥ 5); maker first-comment file exists with ≥4 non-empty lines</pass_criteria>
  <review>READ vg-1-ph-day1-submission.log: confirm HTTP/2 200, datetime within window, asset count matches, first-comment grep returns author signature line</review>
  <verdict>PASS → proceed | FAIL → fix real system (re-upload assets, re-verify submission URL) → re-run</verdict>
  <mock_guard>IF tempted to paste a PH URL without curl-verifying it returns 200 OR tempted to claim "submission shipped" based on operator's screenshot alone → STOP → curl the canonical URL</mock_guard>
</validation_gate>

### C3.2 — Launch #2: Consulting practice (Day 35–40)

**Fix:** Separate PH submission for the consulting offering. Product name: `Agentic Dev Consulting — Nick Krzemienski`. Tagline: `Senior agentic-dev consulting for teams shipping with Claude Code`. Category: Business → Consulting.

**Timing decision:** pick Day 35–40 based on Day 30 retro momentum. If Day 30 newsletter ≥ 200 subs and LinkedIn connects ≥ +400, fire on Day 35. Otherwise, hold for Day 40 to coast on the mid-series traffic bump. Launch 00:01 PT.

**Assets:** reuse site template, gallery shows consulting landing page (`withagents.dev/consulting/` — must exist, ties to `posts/post-18` or separate content task). If consulting page is not yet built by Day 30 retro, **skip this launch entirely** — do not PH-submit a placeholder.

**Verification:** consulting landing page returns 200 on production domain by Day 34. PH submission captured to `plans/reports/ph-submission-day35.md` with screenshot.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>Day 30 retro decision recorded (fire OR skip) in `plans/reports/ph-launch-decisions.md`; if firing — consulting landing page exists at withagents.dev/consulting/ and returns 200</prerequisites>
  <execute>curl -o /dev/null -s -w "%{http_code}\n" https://withagents.dev/consulting/ && curl -sI https://www.producthunt.com/products/agentic-dev-consulting-nick-krzemienski 2>/dev/null || echo "SKIP: launch #2 deferred"</execute>
  <capture>evidence/phase-C3/vg-2-ph-day35-decision.log</capture>
  <pass_criteria>Either (a) consulting page returns 200 AND PH submission URL returns 200 AND decision doc contains `fire` on Day 35–40; OR (b) decision doc contains explicit `skip` entry with metric basis (Day 30 newsletter subs + LinkedIn connects cited)</pass_criteria>
  <review>READ vg-2-ph-day35-decision.log + grep `plans/reports/ph-launch-decisions.md` for `fire|skip` and metric numbers. NO placeholder text allowed.</review>
  <verdict>PASS → proceed | FAIL → fix real system (build consulting page OR record skip with metrics) → re-run</verdict>
  <mock_guard>IF tempted to submit a PH launch with a placeholder consulting page → STOP → either ship the real page or record skip</mock_guard>
</validation_gate>

### C3.3 — Hunter selection (decide Day -6)

**Fix:** PH "hunter" = account that submits the product. Options:
- **Solo (Nick posts own product):** full control, lower reach — his PH follower count is unknown
- **Invited hunter:** reach out to a top-100 hunter active in dev-tools. Asking-to-hunt = mild social cost.

**Decision protocol:**
1. Day -6: Nick pulls his PH follower count. If ≥ 200, go solo.
2. If < 200: DM 3 candidate hunters (e.g., Chris Messina, Kevin William David) with a 2-sentence ask + link to Day 0 draft.
3. First to accept = hunter. If none respond within 48h (Day -4 deadline), go solo.

**Verification:** decision logged in `plans/reports/ph-launch-decisions.md` by Day -4.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>Nick's PH follower count captured with timestamp; if invited-hunter path taken, DM log captured; Day -4 deadline reached</prerequisites>
  <execute>grep -E "hunter: (solo|<handle>)" plans/reports/ph-launch-decisions.md && curl -sI "https://www.producthunt.com/@$(grep -oE 'hunter: [a-z0-9_-]+' plans/reports/ph-launch-decisions.md | awk '{print $2}')" 2>/dev/null</execute>
  <capture>evidence/phase-C3/vg-3-hunter-decision.log</capture>
  <pass_criteria>Decision doc contains `hunter: solo` OR `hunter: <handle>` with the handle's PH profile returning HTTP 200; decision timestamp ≤ Day -4</pass_criteria>
  <review>READ vg-3-hunter-decision.log: confirm one of the two branches resolved, not TBD; if invited-hunter, verify profile curl returned 200</review>
  <verdict>PASS → proceed | FAIL → fix real system (resolve decision before Day -4) → re-run</verdict>
  <mock_guard>IF tempted to leave hunter as TBD past Day -4 → STOP → default to solo and log it</mock_guard>
</validation_gate>

### C3.4 — Upvote-seeding ethics note (no manipulation)

**Fix:** PH actively polices vote manipulation. **Strict rules:**
- Do NOT ask for upvotes on LinkedIn, X, newsletter — ask for "support" or "feedback" (PH's guideline phrasing)
- Do NOT create secondary accounts
- Do NOT trade upvotes in launch groups
- DO post the PH link to your own networks asking for genuine reaction

**Allowed language template (LinkedIn, X, newsletter Day 1 morning):**
```
I'm sharing withagents.dev on Product Hunt today — if it's been useful
to you, a note in the comments means more than a vote. Link: <PH URL>
```

**Verification:** `grep -l "upvote" posts/post-01/day-01.*.md` returns zero files. All CTAs use "note in the comments" or "support".

<validation_gate id="VG-4" blocking="true">
  <prerequisites>Day 1 social copy drafts exist at `posts/post-01/day-01.{linkedin,x,newsletter}.md`</prerequisites>
  <execute>grep -ril 'upvote' posts/post-01/day-01.*.md plans/reports/ph-*.md; echo "exit=$?"</execute>
  <capture>evidence/phase-C3/vg-4-upvote-audit.log</capture>
  <pass_criteria>grep returns zero matches (exit=1); files contain "note in the comments" OR "support" phrasing (positive match required: `grep -l "note in the comments\|support" posts/post-01/day-01.*.md` returns ≥1 file)</pass_criteria>
  <review>READ vg-4-upvote-audit.log: confirm zero "upvote" hits AND at least one file has approved phrasing</review>
  <verdict>PASS → proceed | FAIL → fix real system (rewrite CTAs, re-grep) → re-run</verdict>
  <mock_guard>IF tempted to leave "upvote" in any Day 1 copy because "it's faster to ship" → STOP → PH rule violation kills the launch</mock_guard>
</validation_gate>

### C3.5 — Maker comment cadence (launch day)

**Fix:** Nick commits 4h of live engagement on Day 1 (09:00–13:00 ET, corresponds to 06:00–10:00 PT — prime PH voting hours). Reply to every comment within 15 min. Post 2 scheduled updates during the day:
- ~10:00 PT (3h in): a technical detail not in the essay ("one thing people are asking — the parallel-worktree orchestrator post coming Day 6")
- ~16:00 PT (peak US engagement): a screenshot of a "most-asked question" + answer

**Verification:** PH product page comment timestamps show ≥ 15 maker responses spread across 4h. Screenshot → `posts/post-01/evidence/ph-maker-comments.png`.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>VG-1 PASSED (product live); Nick available for 09:00–13:00 ET window Day 1</prerequisites>
  <execute>curl -sL "https://www.producthunt.com/products/withagents-dev" | grep -oE 'comment-[0-9]+' | wc -l && ls -la posts/post-01/evidence/ph-maker-comments.png</execute>
  <capture>evidence/phase-C3/vg-5-maker-comments.log</capture>
  <pass_criteria>Screenshot file exists and is >0 bytes; comment-count extraction shows ≥15 author-attributed replies; log records timestamps spread across ≥4h window</pass_criteria>
  <review>READ vg-5-maker-comments.log: verify ≥15 response markers + screenshot file byte-size > 0; inspect screenshot visually for author-tag density</review>
  <verdict>PASS → proceed | FAIL → fix real system (more replies, recapture) → re-run</verdict>
  <mock_guard>IF tempted to count maker comments by trusting a summary without the PH page rendering → STOP → curl and count or screenshot-verify</mock_guard>
</validation_gate>

### C3.6 — Post-launch thank-you

**Fix:** Day 2 morning LinkedIn post thanking supporters with final PH metric (top-N rank). No X post (avoids bragging optics on that channel). Newsletter next Sunday digest (C6) references the launch in the weekly rollup.

**Template (LinkedIn, Day 2):**
```
Thanks to everyone who read, commented, and supported withagents.dev
on Product Hunt yesterday. We finished #<rank> in Developer Tools.

The archive is here: <link> — and Day 2 just dropped: <Day 2 post URL>
```

**Verification:** Day 2 LinkedIn post published, `syndication_log` has `day_number=2` row with `linkedin_article` channel and an explicit PH-thanks tag in a custom field (runner emits `{"meta":{"ph_thanks":true}}`).

<validation_gate id="VG-6" blocking="true">
  <prerequisites>VG-1 PASSED; Day 2 morning window reached</prerequisites>
  <execute>psql "$SUPABASE_URL" -c "SELECT day_number, channel, meta FROM syndication_log WHERE day_number=2 AND channel='linkedin_article' AND meta->>'ph_thanks'='true';" && ls posts/post-01/day-02.linkedin.md</execute>
  <capture>evidence/phase-C3/vg-6-day2-thanks.log</capture>
  <pass_criteria>SQL returns ≥1 row with `ph_thanks=true`; Day 2 LinkedIn markdown file exists; X channel for Day 2 has NO PH-thanks row (`SELECT ... WHERE channel='x' AND meta->>'ph_thanks'='true'` returns 0 rows)</pass_criteria>
  <review>READ vg-6-day2-thanks.log: confirm exactly one linkedin_article row with ph_thanks meta; confirm zero X rows</review>
  <verdict>PASS → proceed | FAIL → fix real system (post Day 2 thanks, emit correct meta) → re-run</verdict>
  <mock_guard>IF tempted to cross-post thank-you to X → STOP → LinkedIn only per phase rule</mock_guard>
</validation_gate>

### C3.7 — VF V1 reservation (NOT launched)

**Fix:** Document that VF V1 PH launch is **reserved for V1 GA**, not part of Track C. Note in `plans/reports/ph-launch-decisions.md` so Day 50 retro doesn't accidentally re-scope.

**Trigger for eventual VF PH launch (post-Track C):** VF V1 feature-complete, 3+ external user case studies, pricing tier defined. Not before.

**Verification:** `grep -r "VF V1" plans/reports/ph-*.md` returns the reservation note and no launch submission.

<validation_gate id="VG-7" blocking="true">
  <prerequisites>`plans/reports/ph-launch-decisions.md` exists</prerequisites>
  <execute>grep -c "VF V1.*reserved\|VF V1.*post-GA\|VF V1.*NOT launched" plans/reports/ph-launch-decisions.md && curl -sI "https://www.producthunt.com/products/validationforge" 2>&1 | head -1</execute>
  <capture>evidence/phase-C3/vg-7-vf-reservation.log</capture>
  <pass_criteria>grep count ≥1 for VF V1 reservation phrase; PH curl returns 404 or equivalent "not found" (i.e. VF is NOT on PH during Track C window); trigger criteria (feature-complete + 3 case studies + pricing tier) listed verbatim</pass_criteria>
  <review>READ vg-7-vf-reservation.log: confirm reservation note present, confirm VF PH URL is NOT live</review>
  <verdict>PASS → proceed | FAIL → fix real system (add reservation note; if someone accidentally launched VF, contact PH to archive) → re-run</verdict>
  <mock_guard>IF tempted to "just soft-launch VF quietly on PH" during Track C → STOP → this burns the one-shot introduction per parent plan.md #47</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `withagents-site/public/assets/ph/thumbnail.png` (NEW) | C3 | none |
| `withagents-site/public/assets/ph/gallery-{1..4}.png` (NEW) | C3 | none |
| `plans/reports/ph-submission-day1.md` (NEW) | C3 | none |
| `plans/reports/ph-submission-day35.md` (NEW) | C3 | none |
| `plans/reports/ph-launch-decisions.md` (NEW) | C3 | none |
| `posts/post-01/evidence/ph-*.png` (NEW) | C3 | none |
| `posts/post-01/day-01.linkedin.md` | B2 | append thanks-variant for Day 2 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| PH site traffic spike crashes withagents.dev | LOW | HIGH | Vercel auto-scales; pre-launch load-test in A3; Plausible alert at 100 concurrent |
| Product gets <50 upvotes, finishes below #20 | MED | MED | PH placement isn't the win — launch doubles as SEO artifact + newsletter signup funnel |
| Invited hunter ghosts mid-day | LOW | LOW | go-solo fallback pre-decided Day -4 |
| Consulting landing page not built by Day 34 | MED | MED | skip Launch #2 rather than ship thin page — decision gate in C3.2 |
| Accidentally launching VF instead of consulting | LOW | HIGH | C3.7 explicit reservation note; Day 30 retro checklist item |

## Acceptance criteria

- [ ] withagents.dev submitted 00:01 PT Day 1, maker comment posted within 5 min
- [ ] Gallery has 4 1270×760 assets matching Midnight Observatory theme
- [ ] Zero upvote-asks in public copy (grep audit passes)
- [ ] ≥15 maker comment responses on launch day
- [ ] Day 2 LinkedIn thank-you post published, not crossposted to X
- [ ] Launch #2 decision (fire on Day 35–40 OR skip) recorded in `ph-launch-decisions.md`
- [ ] VF V1 launch reservation documented

## Verification steps

```bash
# Asset existence
ls withagents-site/public/assets/ph/ | wc -l  # expect 5 (thumbnail + 4 gallery)

# Upvote-ask audit
grep -rli 'upvote' posts/post-01/day-01.*.md plans/reports/ph-*.md && \
  echo "VIOLATION" || echo "clean"

# Submission timestamp (manual — PH shows posted_at on product page)
curl -sL https://www.producthunt.com/products/withagents-dev | \
  grep -oE 'datetime="[^"]+"' | head -1

# Domain load-test readiness (A3 pre-req)
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" https://withagents.dev/

# Launch #2 decision gate
grep -E 'fire|skip' plans/reports/ph-launch-decisions.md
```

## Rollback

PH submissions cannot be deleted once live — they can be "archived" by the maker. If Launch #1 assets contain a critical error (wrong link, broken image), edit the PH product page within the first hour (edits allowed during launch day). After 24h the listing is locked; a bad launch lives as a permanent artifact — mitigate via pre-launch A3 smoke.

<gate_manifest>
  <total_gates>7</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7</sequence>
  <policy>All gates BLOCKING unless explicitly marked blocking="false" (deferrals/review-points).</policy>
  <evidence_dir>evidence/phase-C3/</evidence_dir>
  <regression>On FAIL: fix real system → re-run; deferrals document in plans/phase-12-retro/ with trigger date.</regression>
</gate_manifest>
