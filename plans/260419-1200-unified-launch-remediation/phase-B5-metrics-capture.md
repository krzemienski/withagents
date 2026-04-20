# Phase B5 — Metrics Capture (per-day JSON + retros)

**Owner:** Sonnet executor (script + schema) + user (15 min/day to validate)
**Effort:** ~2h setup + 15 min/day × 45–60 days
**Status:** pending
**Window:** Day -1 (install) → Day 60 (final rollup)
**Blocks:** nothing (B4 reads output; retros consume output)
**BlockedBy:** B2 (Plausible API key, Supabase tables), B3 (daily evidence dir)

## Context

R1 §4 names the metrics dashboard requirement; R1 gap 6 documents the missing capture script. Kill-switch (B4) depends on a consistent data feed. Retros at Day 14/30/45/60 depend on a clean rollup.

Principle: one JSON file per day, schema-frozen at B5.1, never mutated after end-of-day. Rollup.csv regenerated from JSON files. Nothing computed from in-memory or verbal recall.

Source: R1 §4, R3 §6 daily cadence, approval-package §13.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake analytics data, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Schema

### B5.1 — Per-day JSON schema

**File path:** `plans/phase-12-metrics/day-NN.json` (zero-padded, e.g., `day-01.json`)

**Schema:**
```json
{
  "day": 1,
  "date": "YYYY-MM-DD",
  "slug": "day-01-validationforge-ga",
  "captured_at": "YYYY-MM-DDTHH:MM:SSZ",
  "linkedin": {
    "article_url": "https://linkedin.com/pulse/...",
    "impressions": 0,
    "reactions": 0,
    "comments": 0,
    "shares": 0,
    "click_throughs": 0,
    "follower_count_snapshot": 0
  },
  "x": {
    "thread_url": "https://x.com/.../status/...",
    "views": 0,
    "likes": 0,
    "reposts": 0,
    "bookmarks": 0,
    "replies": 0,
    "follower_count_snapshot": 0
  },
  "plausible": {
    "pageviews": 0,
    "unique_visitors": 0,
    "time_on_site_seconds": 0,
    "top_referrers": [],
    "top_pages": []
  },
  "beehiiv": {
    "delivered": 0,
    "open_rate": 0.0,
    "click_rate": 0.0,
    "unsubscribes": 0
  },
  "consult": {
    "inquiries_count": 0,
    "calendly_bookings": 0
  },
  "flagship_stars": {
    "validationforge": 0,
    "claude-code-builder": 0,
    "ralph-orchestrator": 0,
    "withagents-skills": 0,
    "sessionforge": 0,
    "code-tales": 0,
    "code-tales-platform": 0
  },
  "notes": ""
}
```

Missing data = `null`, not `0`. LinkedIn metrics are manual (no personal-profile API); user enters from LI Analytics UI end-of-day. X metrics auto-pulled if API key present, else manual. Beehiiv API key required.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`jq` installed; `plans/phase-12-metrics/` directory exists; a sample `day-NN.json` produced by the capture script (may be dry-run from B5.2 smoke).</prerequisites>
  <execute>jq -e '.day and .date and .linkedin and .x and .plausible and .beehiiv and .consult and .flagship_stars' plans/phase-12-metrics/day-01.json</execute>
  <capture>jq . plans/phase-12-metrics/day-01.json > evidence/phase-B5/vg-1-schema-check.json; echo "exit=$?" >> evidence/phase-B5/vg-1-schema-check.log</capture>
  <pass_criteria>`jq -e` returns exit 0 AND stdout is literal `true`; all 8 top-level keys present; `.day` is an integer; `.date` matches `^\d{4}-\d{2}-\d{2}$`; nested objects (linkedin, x, plausible, beehiiv, consult, flagship_stars) are non-null objects.</pass_criteria>
  <review>cat evidence/phase-B5/vg-1-schema-check.json | jq 'keys' — confirm 9 keys (8 + notes). Run `jq -e '.linkedin | has("article_url") and has("impressions")'` to confirm nested schema intact.</review>
  <verdict>PASS → proceed to VG-2 | FAIL → fix schema in daily-capture.ts (do NOT hand-edit day-NN.json to force pass) → re-run</verdict>
  <mock_guard>IF tempted to write a synthetic day-NN.json with all zeros to satisfy schema → STOP → the schema gate must run against REAL capture output from VG-2, not fabricated JSON.</mock_guard>
</validation_gate>

### B5.2 — Capture script

**File:** `scripts/metrics/daily-capture.ts` (~120 lines).

Usage: `pnpm tsx scripts/metrics/daily-capture.ts --day N`. Runs at B3.9 (end-of-day). Idempotent — overwrites `day-NN.json`.

Responsibilities:
- Read `plans/phase-12-evidence/day-N/linkedin-url.txt` + `x-url.txt` → emit URL strings, leave numeric metrics `null` (filled manually per B5.3)
- Plausible API: 3 calls (aggregate pageviews+visitors+visit_duration, breakdown by referrer top 5, breakdown by page top 5) — header `Authorization: Bearer $PLAUSIBLE_API_KEY`
- Beehiiv API v2: `GET /publications/$PUBLICATION_ID/posts?limit=1` → extract `stats.email.{recipients, open_rate, click_rate, unsubscribes}`; null if key absent
- Supabase: `SELECT COUNT(*) FROM consultant_inquiries WHERE created_at >= today_start`
- Calendly: no API — parse `calendly_bookings=N` from `plans/phase-12-evidence/day-N/notes.txt`
- Flagship stars: `gh api repos/krzemienski/<repo> --jq .stargazers_count` for 7 flagship repos (see schema)
- Write `plans/phase-12-metrics/day-NN.json` with `JSON.stringify(out, null, 2)`

Env needed: `PLAUSIBLE_API_KEY`, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `gh auth login`.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>All env keys set (`PLAUSIBLE_API_KEY`, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`); `gh auth status` returns authenticated; `plans/phase-12-evidence/day-1/` populated (linkedin-url.txt, x-url.txt, notes.txt); network reachable to plausible.io, api.beehiiv.com, <project>.supabase.co.</prerequisites>
  <execute>pnpm tsx scripts/metrics/daily-capture.ts --day 1</execute>
  <capture>pnpm tsx scripts/metrics/daily-capture.ts --day 1 2>&1 | tee evidence/phase-B5/vg-2-capture-run.log; cp plans/phase-12-metrics/day-01.json evidence/phase-B5/vg-2-day-01.json</capture>
  <pass_criteria>Script exits 0; `day-01.json` contains REAL data: `.plausible.pageviews | numbers` non-null numeric (or explicit 0 only if site truly had 0 pageviews), `.plausible.unique_visitors | numbers` non-null numeric, `.beehiiv.open_rate` is numeric (float) if `BEEHIIV_API_KEY` set else null (NOT zero), `.flagship_stars.validationforge | numbers` is integer ≥ 0, `.consult.inquiries_count | numbers` integer ≥ 0. LinkedIn article_url and x.thread_url are populated strings matching URL patterns. Zero HTTP 4xx/5xx in capture log.</pass_criteria>
  <review>jq -e '.plausible.unique_visitors | numbers' evidence/phase-B5/vg-2-day-01.json; jq -e '.flagship_stars.validationforge | numbers' evidence/phase-B5/vg-2-day-01.json; jq '.beehiiv' evidence/phase-B5/vg-2-day-01.json — confirm fields populated from real APIs. grep -iE 'error|fail|401|403|429|500' evidence/phase-B5/vg-2-capture-run.log — must be empty.</review>
  <verdict>PASS → proceed to VG-3 | FAIL → fix the real API call (auth, endpoint, env var) in daily-capture.ts → re-run</verdict>
  <mock_guard>IF tempted to stub Plausible/Beehiiv/Supabase responses with hardcoded JSON, mock `fetch`, or set default 0s when API fails → STOP → the whole phase exists to produce REAL daily data. Fix the auth/endpoint.</mock_guard>
</validation_gate>

### B5.3 — Manual fields: LinkedIn + X Analytics

Post-run (after Day N metrics snapshot), user opens LI Analytics + X Analytics UIs ~11 PM PT and manually fills fields. Update pattern:

```bash
# Open day-NN.json in editor
$EDITOR plans/phase-12-metrics/day-$(printf '%02d' $N).json
# Populate linkedin.impressions/reactions/comments/shares/click_throughs
# Populate x.views/likes/reposts/bookmarks/replies (if manual)
# Commit
git add plans/phase-12-metrics/day-*.json
git commit -m "metrics: day-$N capture"
```

Alternative: shell helper `scripts/metrics/edit-day.sh N` opens JSON in `$EDITOR`, validates schema on save via `jq`, commits.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>`day-01.json` exists with VG-2 capture output; user has filled LI + X manual fields; `scripts/metrics/edit-day.sh` is executable.</prerequisites>
  <execute>jq -e '(.linkedin.impressions | numbers) and (.linkedin.reactions | numbers) and (.linkedin.comments | numbers) and (.x.views | numbers) and (.x.likes | numbers)' plans/phase-12-metrics/day-01.json</execute>
  <capture>jq '{linkedin: .linkedin, x: .x}' plans/phase-12-metrics/day-01.json > evidence/phase-B5/vg-3-manual-fields.json</capture>
  <pass_criteria>All 5 manual numeric fields populated with integers ≥ 0 (not null). `.linkedin.impressions` ≥ `.linkedin.reactions` (sanity). `.x.views` ≥ `.x.likes`. JSON still passes `jq .` (valid syntax post-edit).</pass_criteria>
  <review>cat evidence/phase-B5/vg-3-manual-fields.json — visually confirm numbers match what user sees in LI Analytics + X Analytics UIs (sanity-screenshot those UIs in evidence/phase-B5/vg-3-li-ui.png + vg-3-x-ui.png).</review>
  <verdict>PASS → proceed to VG-4 | FAIL → user re-opens day-01.json, populates missing fields → re-run</verdict>
  <mock_guard>IF tempted to fill in round numbers (100, 500) as placeholders to clear the gate → STOP → manual fields must come from the actual LinkedIn/X Analytics UI reading for that specific post.</mock_guard>
</validation_gate>

### B5.4 — Rollup.csv generator

**File:** `scripts/metrics/rollup.ts` (~40 lines). Regenerates `plans/phase-12-metrics/rollup.csv` from all `day-NN.json` files. Idempotent.

Columns: `day,date,slug,li_impressions,li_reactions,li_comments,li_shares,x_views,x_likes,x_reposts,plausible_uniques,plausible_pv,beehiiv_open_rate,inquiries,calendly_bookings,vf_stars,ralph_stars`. Missing keys serialize as empty cell.

Run: `pnpm tsx scripts/metrics/rollup.ts` nightly after B5.2 capture.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>At least 2 REAL day-NN.json files exist in `plans/phase-12-metrics/` (e.g., day-01.json and day-02.json produced via VG-2 capture — NOT synthetic test JSONs); `scripts/metrics/rollup.ts` compiles clean.</prerequisites>
  <execute>pnpm tsx scripts/metrics/rollup.ts && head -3 plans/phase-12-metrics/rollup.csv && wc -l plans/phase-12-metrics/rollup.csv</execute>
  <capture>cp plans/phase-12-metrics/rollup.csv evidence/phase-B5/vg-4-rollup.csv; wc -l plans/phase-12-metrics/rollup.csv > evidence/phase-B5/vg-4-rollup-lines.txt</capture>
  <pass_criteria>rollup.csv exists with ≥3 lines (1 header + ≥2 data rows). Header row contains exactly the 17 columns specified in B5.4. Each data row has 17 comma-separated fields. `li_impressions` and `plausible_uniques` columns contain real integers (not all blanks). `awk -F, 'NR>1 && NF!=17 {exit 1}' rollup.csv` exits 0.</pass_criteria>
  <review>awk -F, 'NR==1 {print "cols="NF; next} {print "row "NR-1": li_imp="$4" plausible_uv="$11}' evidence/phase-B5/vg-4-rollup.csv — inspect first 2 data rows have non-empty numeric fields matching the source day-NN.json files. Confirm values match `jq .linkedin.impressions plans/phase-12-metrics/day-01.json`.</review>
  <verdict>PASS → proceed to VG-5 | FAIL → fix rollup.ts column mapping or regenerate stale day-NN.json → re-run</verdict>
  <mock_guard>IF tempted to seed `plans/phase-12-metrics/` with synthetic day-99.json files just to clear the 2-row minimum → STOP → smoke must use real captured days.</mock_guard>
</validation_gate>

### B5.5 — Retro templates

Four retros at Day 14, 30, 45, 60. File: `plans/phase-12-retro/retro-day-$N.md`.

**Template:**
```markdown
# Retro — Day N

**Window:** Day X → Day N
**Source:** plans/phase-12-metrics/rollup.csv (rows X–N)

## Quantitative summary
- Total unique visitors: <sum>
- Total pageviews: <sum>
- LI impressions (sum): <manual calc>
- LI reactions (sum): <manual>
- X views (sum): <manual>
- Inquiries: <count>
- Calendly bookings: <count>
- Flagship repo stars delta: <end - start>
- Beehiiv open-rate avg: <pct>

## Top 3 performing posts (by pageviews)
1. day-NN-<slug> — <N> pageviews, <M> inquiries
2. ...

## Bottom 3 performing posts
1. ...

## Kill-switch triggers fired this window
- <list, one per B4 event>

## Voice / content observations
- <what worked, what didn't>

## Mid-course corrections
- [ ] action 1
- [ ] action 2

## Next-window prediction
- <bet>
```

**Day 14:** first week + first flagship retrospective. Inform CCB Day-10 decision confirmed-good.
**Day 30:** midpoint; rest-week bookend; Day 35 skills-package go/no-go gate.
**Day 45:** end-of-primary-push; decide extension vs wrap.
**Day 60:** full retrospective; feed into next cycle planning.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>`plans/phase-12-retro/TEMPLATE.md` written; `plans/phase-12-retro/` directory exists.</prerequisites>
  <execute>test -s plans/phase-12-retro/TEMPLATE.md && grep -E '^## (Quantitative summary|Top 3 performing posts|Bottom 3 performing posts|Kill-switch triggers fired this window|Voice / content observations|Mid-course corrections|Next-window prediction)' plans/phase-12-retro/TEMPLATE.md | wc -l</execute>
  <capture>cp plans/phase-12-retro/TEMPLATE.md evidence/phase-B5/vg-5-retro-template.md; ls -la plans/phase-12-retro/ > evidence/phase-B5/vg-5-retro-dir.txt</capture>
  <pass_criteria>TEMPLATE.md non-empty (size > 0). All 7 required H2 sections present (grep count = 7). File contains placeholder for `**Window:** Day X → Day N` and `**Source:** plans/phase-12-metrics/rollup.csv`.</pass_criteria>
  <review>cat evidence/phase-B5/vg-5-retro-template.md | grep -c '^##' — confirm ≥8 H2 sections (title + 7 required). Confirm source reference string present via `grep 'plans/phase-12-metrics/rollup.csv' TEMPLATE.md`.</review>
  <verdict>PASS → proceed to VG-6 | FAIL → add missing H2 sections to TEMPLATE.md → re-run</verdict>
  <mock_guard>IF tempted to pre-fill template with fabricated Day 14 numbers → STOP → template is a skeleton; retros get filled from real rollup.csv on the actual retro date.</mock_guard>
</validation_gate>

### B5.6 — Kill-switch integration

B5 is B4's data source. B4.7 checker queries:
- `consult.inquiries_count` → B4.2 zero-inquiries trigger
- `plausible.unique_visitors` → B4.5 floor trigger

Trigger math lives in B4; B5 guarantees the fields populate daily. If a B5 field is `null` for >1 day, Slack alert: `⚠️ B5 metric missing day-N field=<name>`.

<validation_gate id="VG-6" blocking="true">
  <prerequisites>B4 `scripts/metrics/kill-switch-check.ts` exists; `plans/phase-12-metrics/day-01.json` populated via VG-2/VG-3.</prerequisites>
  <execute>pnpm tsx scripts/metrics/kill-switch-check.ts 2>&1 | tee evidence/phase-B5/vg-6-killswitch.log; echo "exit=$?" >> evidence/phase-B5/vg-6-killswitch.log</execute>
  <capture>evidence/phase-B5/vg-6-killswitch.log</capture>
  <pass_criteria>Script exits 0 on real day-01 data (no triggers fire). Log contains evidence that script READ `.consult.inquiries_count` and `.plausible.unique_visitors` from day-01.json (script echoes read values or a "checked field X=Y" line). No "MISSING FIELD" errors.</pass_criteria>
  <review>grep -E 'inquiries_count|unique_visitors' evidence/phase-B5/vg-6-killswitch.log — confirm checker ingests B5 field names. Confirm `exit=0` line present.</review>
  <verdict>PASS → phase complete | FAIL → fix field path alignment between B4 checker and B5 schema → re-run</verdict>
  <mock_guard>IF tempted to patch kill-switch-check.ts to swallow missing fields → STOP → missing fields are real bugs in B5 capture; fix capture, not the checker.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `scripts/metrics/daily-capture.ts` (NEW) | B5 | none |
| `scripts/metrics/rollup.ts` (NEW) | B5 | none |
| `scripts/metrics/edit-day.sh` (NEW) | B5 | none |
| `plans/phase-12-metrics/day-*.json` | B5 capture, user edits | one file per day |
| `plans/phase-12-metrics/rollup.csv` | B5 rollup script (regen) | derived, never hand-edited |
| `plans/phase-12-retro/retro-day-*.md` | B5 template; user fills at each retro | one per milestone |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LinkedIn/X manual fields never filled → CSV has holes | HIGH | MED | `edit-day.sh` prompts daily; Day 14 retro forces backfill |
| Plausible API rate-limit (100 req/h) | LOW | LOW | capture script makes 3 calls/day — well under |
| Beehiiv API key missing → field null permanently | MED | LOW | null acceptable; retro notes distribution gap |
| `gh api` rate-limit (60/h unauth) | LOW | LOW | `gh` uses authed user → 5000/h; 7 repos × 45 days = 315 calls, safe |
| Schema drift across days (added field mid-run) | MED | MED | version schema in header; rollup.ts tolerates missing keys |
| Calendly booking manual count forgotten | HIGH | LOW | `notes.txt` template includes `calendly_bookings=` line; blank = 0 |
| rollup.csv regenerated with stale JSON | LOW | LOW | script idempotent; run post-capture in B3.9 |
| User commits LI/X metrics to public repo (OK) but commits Beehiiv list size (sensitive) | LOW | MED | Beehiiv `delivered` is subscriber count — fine to commit; no PII in schema |

## Acceptance criteria

- [ ] `scripts/metrics/daily-capture.ts` compiles (`pnpm tsc --noEmit`)
- [ ] `scripts/metrics/rollup.ts` compiles
- [ ] `scripts/metrics/edit-day.sh` executable, validates JSON on save
- [ ] Smoke run: `pnpm tsx scripts/metrics/daily-capture.ts --day 0` (dry-run with synthetic evidence dir) produces valid `day-00.json`
- [ ] Schema in this doc matches script output exactly
- [ ] Rollup smoke: with 2 test JSONs in dir, `rollup.ts` produces 2-row CSV with headers
- [ ] Retro template committed at `plans/phase-12-retro/TEMPLATE.md`
- [ ] B4 checker references B5 field names (integration test: run B4.7 with synthetic B5 output → trigger fires)

## Verification steps

```bash
cd /Users/nick/Desktop/blog-series
source ~/.syndication.env

# 1. Compile
pnpm tsc --noEmit scripts/metrics/daily-capture.ts scripts/metrics/rollup.ts

# 2. Dry-run capture for a past day (assuming day-1 evidence exists)
pnpm tsx scripts/metrics/daily-capture.ts --day 1
jq . plans/phase-12-metrics/day-01.json | head -30

# 3. Schema validation
jq -e '.day and .date and .linkedin and .x and .plausible and .beehiiv and .consult and .flagship_stars' \
  plans/phase-12-metrics/day-01.json
# expect: true

# 4. Rollup
pnpm tsx scripts/metrics/rollup.ts
head -2 plans/phase-12-metrics/rollup.csv
wc -l plans/phase-12-metrics/rollup.csv

# 5. B4 integration smoke
pnpm tsx scripts/metrics/kill-switch-check.ts
# expect: exit 0 (no triggers on synthetic day-1 data)

# 6. Retro template sanity
test -s plans/phase-12-retro/TEMPLATE.md
```

## Rollback

- Metrics append-only. Delete individual `day-NN.json` if wrong; `rollup.csv` regenerates. No external side effects (read-only API). Removing `daily-capture.ts` stops automation, existing files persist. B5 additive — rollback removes visibility, not data.

<gate_manifest>
  <total_gates>6</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6</sequence>
  <policy>All gates BLOCKING.</policy>
  <evidence_dir>evidence/phase-B5/ + plans/phase-12-metrics/ (B5 daily)</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix; no skip-forward.</regression>
</gate_manifest>
