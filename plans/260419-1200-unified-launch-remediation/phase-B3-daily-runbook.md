# Phase B3 — Daily Runbook (45–60 days × ~30 min/day)

**Owner:** User (Nick) as operator, Sonnet coordinator on-call for runner errors
**Effort:** ~30h total (≈30 min × 45–60 days, flagship days ~60 min)
**Status:** pending
**Window:** Day 1 → Day 45 (or Day 60 if extension taken)
**Blocks:** nothing (concurrent with B4, B5, Track C)
**BlockedBy:** B2 (all infra green)

## Context

Phase 11 code covers ~70% of Phase 12 execution (R1 §7). The remaining 30% is human operator time: LinkedIn Article manual paste, X thread manual or Typefully, per-day evidence capture. This phase documents the exact per-day loop.

Locked decisions that shape this runbook:
- Locked #1: runner.ts does NOT auto-post to X (A1.1 removed that path) → manual or Typefully (B1.5)
- Locked #6: LinkedIn Articles capped 3–4/week → runner LinkedIn channel skips on non-Article days
- B1.1: launch date Tue/Wed
- B1.5: X tool (typefully_pro | manual)

Source: R1 §3 per-day playbook, R3 §6 daily regression cadence, `scripts/syndication/scheduler/runner.ts`.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Daily Loop (Day N, every publishing day)

### B3.1 — 9:00 AM PT: sanity dry-run

**Fix:**
```bash
cd /Users/nick/Desktop/blog-series
source ~/.syndication.env
pnpm tsx scripts/syndication/scheduler/runner.ts --day $N --dry-run
```

Expected stdout: calendar row for day N printed with `publish`, `repoReadme`, `dayType`; channels `linkedin`, `x`, `readme` each reporting planned action. Zero errors. If `x: skipped (manual_channel)` appears, that is correct (A1.1).

**Abort condition:** any non-zero exit OR calendar row missing OR `.syndication-state.json` corruption warning → STOP, page coordinator via Slack `#launch`, do not proceed to B3.2.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`~/.syndication.env` sourced; `.launch-date` file present; `.syndication-paused` sentinel absent (if present, VG applies B4.6 short-circuit and exits 0); `scripts/syndication/scheduler/runner.ts` compiles.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && source ~/.syndication.env && mkdir -p plans/phase-12-evidence/day-$N && pnpm tsx scripts/syndication/scheduler/runner.ts --day $N --dry-run 2>&1 | tee plans/phase-12-evidence/day-$N/vg-1-dryrun.log</execute>
  <capture>plans/phase-12-evidence/day-$N/vg-1-dryrun.log (full runner stdout + exit code)</capture>
  <pass_criteria>Runner exits 0 (verify `echo $?` = 0 immediately after). Log contains a calendar row for Day N with non-empty `publish`, `repoReadme`, `dayType` fields. Log contains three channel lines: `linkedin: <planned action>`, `x: skipped (manual_channel)`, `readme: <planned action>`. Zero lines matching `ERROR|CORRUPTION|.syndication-state.json: invalid`.</pass_criteria>
  <review>`cat plans/phase-12-evidence/day-$N/vg-1-dryrun.log | grep -E 'day-|linkedin:|x:|readme:'` — confirm all four row markers present and x channel is `skipped (manual_channel)`.</review>
  <verdict>PASS → proceed | FAIL → page `#launch`, do NOT proceed to VG-2</verdict>
  <mock_guard>IF tempted to add `--skip-state-check` or mock `.syndication-state.json` → STOP → runner must read real state file.</mock_guard>
</validation_gate>

### B3.2 — 9:10 AM PT: MDX live-sanity

**Fix:**
```bash
SLUG=$(pnpm tsx scripts/syndication/scheduler/runner.ts --day $N --dry-run 2>&1 | grep -oE 'day-[0-9]+-[a-z0-9-]+' | head -1)
curl -sI "https://withagents.dev/writing/$SLUG/" | head -1
curl -s "https://withagents.dev/writing/$SLUG/" | grep -c "<article"
```

Expected: `HTTP/2 200`, `<article` count ≥1.

**Abort condition:** 404 or 500 → slug drift vs prod. Check `git log posts/$SLUG/` + `withagents-site/src/content/posts/$SLUG.mdx`; re-deploy if mismatch. Do not post LinkedIn pointing at a 404.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>VG-1 PASS; slug extractable from dry-run output; `withagents.dev` responding (VG-7 of B2 still green).</prerequisites>
  <execute>SLUG=$(grep -oE 'day-[0-9]+-[a-z0-9-]+' plans/phase-12-evidence/day-$N/vg-1-dryrun.log | head -1) && echo "SLUG=$SLUG" | tee plans/phase-12-evidence/day-$N/vg-2-slug.txt && curl -sI "https://withagents.dev/writing/$SLUG/" | tee plans/phase-12-evidence/day-$N/vg-2-headers.txt && curl -s "https://withagents.dev/writing/$SLUG/" | grep -c "<article" | tee plans/phase-12-evidence/day-$N/vg-2-article-count.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/vg-2-slug.txt (resolved slug), vg-2-headers.txt (HTTP headers), vg-2-article-count.txt (numeric count)</capture>
  <pass_criteria>First line of `vg-2-headers.txt` contains `HTTP/2 200` (NOT 404, NOT 500, NOT 3xx redirect loop). `vg-2-article-count.txt` contains an integer ≥ 1. Slug value in `vg-2-slug.txt` matches a file in `withagents-site/src/content/posts/`.</pass_criteria>
  <review>`head -1 plans/phase-12-evidence/day-$N/vg-2-headers.txt && cat plans/phase-12-evidence/day-$N/vg-2-article-count.txt` — confirm 200 + count ≥ 1; cross-check slug exists via `ls withagents-site/src/content/posts/$(cat plans/phase-12-evidence/day-$N/vg-2-slug.txt | cut -d= -f2).mdx`.</review>
  <verdict>PASS → proceed | FAIL → do NOT post LinkedIn pointing at a 404; fix slug/deploy first</verdict>
  <mock_guard>IF tempted to curl a preview URL or a cached fixture instead of the real prod alias → STOP → LinkedIn will fetch the real prod URL.</mock_guard>
</validation_gate>

### B3.3 — 9:20 AM PT: trigger runner (readme patch + LinkedIn prep)

**Fix:**
```bash
pnpm tsx scripts/syndication/scheduler/runner.ts --day $N
```

Runner will:
- Patch companion repo README (if `repoReadme` non-empty for row) via `patcher.ts` → pushes commit
- Write LinkedIn prep file `withagents-site/src/content/posts/day-NN-<slug>.linkedin-article-prep.md`
- Log rows to Supabase `syndication_log` with schema-mapped channel names (A1.2 fix)
- Skip X with `status=skipped, error_message=manual_channel` (A1.1)

**Expected duration:** 60–120 sec.

**Capture:** stdout → `plans/phase-12-evidence/day-$N/runner.log`.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>VG-1 + VG-2 PASS; Supabase reachable; GitHub token for companion repo push present in env; not in paused state.</prerequisites>
  <execute>pnpm tsx scripts/syndication/scheduler/runner.ts --day $N 2>&1 | tee plans/phase-12-evidence/day-$N/runner.log && psql "$SUPABASE_DB_URL" -c "SELECT channel, status FROM syndication_log WHERE slug LIKE 'day-$N-%' ORDER BY created_at;" | tee plans/phase-12-evidence/day-$N/vg-3-supabase.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/runner.log (full runner stdout, 60–120s run), plans/phase-12-evidence/day-$N/vg-3-supabase.txt (Supabase rows immediately post-run)</capture>
  <pass_criteria>Runner exit code 0. `runner.log` contains a GitHub commit URL matching `https://github.com/.*/commit/[a-f0-9]{7,}` (unless calendar `repoReadme=—`). A LinkedIn prep file `withagents-site/src/content/posts/day-$N-*.linkedin-article-prep.md` exists post-run (`ls` returns path). `vg-3-supabase.txt` shows `x_thread | skipped` AND (`linkedin_article | posted` OR `linkedin_short | posted`) AND (`readme_patch | posted` OR `readme_patch | skipped` if off-day). Zero lines matching `Error:` or `FATAL`.</pass_criteria>
  <review>`grep -cE 'ERROR|FATAL' plans/phase-12-evidence/day-$N/runner.log` = 0; `grep -E 'channel|status' plans/phase-12-evidence/day-$N/vg-3-supabase.txt` — confirm each channel appears with correct status.</review>
  <verdict>PASS → proceed | FAIL → diagnose runner error, fix real system, re-run</verdict>
  <mock_guard>IF tempted to set `DRY_RUN=1` env var or comment out the `patcher.ts` git push → STOP → the real commit must land on the real companion repo.</mock_guard>
</validation_gate>

### B3.4 — 9:30 AM PT: LinkedIn Article manual publish

**Context:** locked decision #6 caps Articles at 3–4/week. Check calendar — is this a LinkedIn Article day?

**If Article day (from calendar `linkedin_type=article`):**
```bash
pnpm tsx scripts/syndication/linkedin/article-prep.ts day-$N-<slug>
# opens browser to linkedin.com/pulse/new-article/?title=...
# Opens prep file in $EDITOR for copy
```

User manually:
1. Copy title from prep file → paste into LI editor
2. Copy body → paste into editor
3. Attach OG preview (LI auto-fetches from `/api/og.png?title=...&kind=essay` via the canonical URL)
4. Click Publish
5. Copy published URL from address bar
6. Paste URL into `plans/phase-12-evidence/day-$N/linkedin-url.txt`

**If short-feed day (`linkedin_type=short`):** manually compose a 1–3 paragraph post in the LI feed composer (runner does NOT dispatch — locked #6). Save URL same way.

**Time budget:** 5–8 min for Article, 2 min for short.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>VG-3 PASS; LinkedIn tab authenticated; prep file exists at `withagents-site/src/content/posts/day-$N-<slug>.linkedin-article-prep.md`; OG endpoint `/api/og.png` returning 200 on the canonical URL.</prerequisites>
  <execute>test -s plans/phase-12-evidence/day-$N/linkedin-url.txt && LI_URL=$(cat plans/phase-12-evidence/day-$N/linkedin-url.txt) && echo "Captured URL: $LI_URL" && curl -sI -L "$LI_URL" | tee plans/phase-12-evidence/day-$N/vg-4-linkedin-headers.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/linkedin-url.txt (URL written by operator post-publish), plans/phase-12-evidence/day-$N/vg-4-linkedin-headers.txt (HTTP headers from `curl -sI -L` against that URL)</capture>
  <pass_criteria>`linkedin-url.txt` is non-empty AND contains a URL matching `^https://(www\.)?linkedin\.com/(pulse|posts|feed/update)/`. `curl -sI -L` against that URL returns final `HTTP/2 200` on `vg-4-linkedin-headers.txt` first or last header block (LinkedIn may redirect before resolving — follow redirects via `-L`). If short-feed day, URL matches `linkedin.com/feed/update/` pattern and still returns 200. The URL must NOT be the `linkedin.com/pulse/new-article/` composer (that's pre-publish).</pass_criteria>
  <review>`cat plans/phase-12-evidence/day-$N/linkedin-url.txt` — is it a post URL not a composer URL?; `grep -E '^HTTP' plans/phase-12-evidence/day-$N/vg-4-linkedin-headers.txt | tail -1` must include `200`.</review>
  <verdict>PASS → proceed | FAIL → republish, capture real post URL, re-run curl</verdict>
  <mock_guard>IF tempted to write a placeholder URL like "linkedin.com/pending" or skip the curl validation → STOP → URL must resolve to a real live post.</mock_guard>
</validation_gate>

### B3.5 — 9:45 AM PT: X thread publish

**If B1.5 decided `typefully_pro`:**
1. Runner already wrote the thread body to stdout + `day-$N-<slug>.x.md`
2. Open Typefully → New Thread → paste from `.x.md`
3. Typefully auto-splits at `<!-- Tweet N [NN chars] -->` markers? NO — manual paste each tweet into Typefully's split UI
4. Schedule for immediate OR +15 min
5. Copy first-tweet URL → `plans/phase-12-evidence/day-$N/x-url.txt`

**If B1.5 decided `manual`:**
1. Open `withagents-site/src/content/posts/day-$N-<slug>.x.md`
2. Paste tweet 1 into x.com composer, publish
3. Click Reply on tweet 1, paste tweet 2, publish
4. Repeat through tweet N (7–12 per thread)
5. Copy first-tweet URL → same evidence file

**Time budget:** 3 min Typefully, 8–12 min manual.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>VG-4 PASS; X account logged in (or Typefully workspace authenticated per B1.5); `.x.md` sidecar file present for the day.</prerequisites>
  <execute>test -s plans/phase-12-evidence/day-$N/x-url.txt && X_URL=$(cat plans/phase-12-evidence/day-$N/x-url.txt) && echo "Captured URL: $X_URL" && curl -sI -L -A 'Mozilla/5.0' "$X_URL" | tee plans/phase-12-evidence/day-$N/vg-5-x-headers.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/x-url.txt (first-tweet URL written post-publish), plans/phase-12-evidence/day-$N/vg-5-x-headers.txt (HTTP headers from `curl -sI -L` against that URL)</capture>
  <pass_criteria>`x-url.txt` is non-empty AND matches `^https://(x|twitter)\.com/[A-Za-z0-9_]+/status/[0-9]+`. `curl -sI -L` against that URL returns `HTTP/2 200` (x.com enforces user-agent — use `-A 'Mozilla/5.0'`). Tweet ID portion (numeric suffix) must be ≥ 18 digits (real snowflake). If day explicitly skips X thread (documented in `plans/phase-12-evidence/day-$N/X-SKIPPED.md` with reason), that file must exist and gate is N/A.</pass_criteria>
  <review>`cat plans/phase-12-evidence/day-$N/x-url.txt` — URL must be a status URL not a compose URL; `grep -E '^HTTP' plans/phase-12-evidence/day-$N/vg-5-x-headers.txt | tail -1` must include `200`.</review>
  <verdict>PASS → proceed | FAIL → republish thread, capture real first-tweet URL, re-run curl</verdict>
  <mock_guard>IF tempted to write a fake status URL or mock 200 response → STOP → URL must resolve to a real live tweet.</mock_guard>
</validation_gate>

### B3.6 — 10:00 AM PT: 4-URL evidence capture

Required files, all non-empty, under `plans/phase-12-evidence/day-$N/`:
- `blog-url.txt` — echo `https://withagents.dev/writing/$SLUG/`
- `linkedin-url.txt` — written by B3.4
- `x-url.txt` — written by B3.5
- `readme-commit-url.txt` — grep runner.log for `https://github.com/.*/commit/[a-f0-9]+` (skip if calendar `repoReadme=—`)
- `runner.log` — full stdout from B3.3

<validation_gate id="VG-6" blocking="true">
  <prerequisites>VG-3 + VG-4 + VG-5 PASS (or documented skip); day directory `plans/phase-12-evidence/day-$N/` exists.</prerequisites>
  <execute>DIR=plans/phase-12-evidence/day-$N && echo "https://withagents.dev/writing/$(cat $DIR/vg-2-slug.txt | cut -d= -f2)/" > $DIR/blog-url.txt && grep -oE 'https://github\.com/[^ ]+/commit/[a-f0-9]+' $DIR/runner.log | head -1 > $DIR/readme-commit-url.txt && ls -la $DIR | tee $DIR/vg-6-inventory.txt && for f in blog-url.txt linkedin-url.txt x-url.txt runner.log readme-commit-url.txt; do test -s "$DIR/$f" && echo "OK $f ($(wc -c < $DIR/$f) bytes)" || echo "MISSING $f"; done | tee -a $DIR/vg-6-inventory.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/vg-6-inventory.txt (ls output + per-file size check), plus the 5 artifact files</capture>
  <pass_criteria>All 5 required files exist with size > 0 bytes (`wc -c` > 0): `blog-url.txt`, `linkedin-url.txt`, `x-url.txt`, `runner.log`, `readme-commit-url.txt`. Exception: `readme-commit-url.txt` MAY be 0 bytes only if calendar `repoReadme=—` for this day (document in `$DIR/README-SKIPPED.md`). Inventory log shows `OK` for each file with byte count.</pass_criteria>
  <review>`grep -c OK plans/phase-12-evidence/day-$N/vg-6-inventory.txt` returns 5 (or 4 + skip marker); `grep MISSING` returns 0 matches.</review>
  <verdict>PASS → proceed | FAIL → capture missing artifact, re-run inventory</verdict>
  <mock_guard>IF tempted to `touch` empty placeholder files to pass the check → STOP → every evidence file must contain real content.</mock_guard>
</validation_gate>

### B3.7 — 10:15 AM PT: Supabase verification + post-hoc fill

```bash
psql "$SUPABASE_DB_URL" -c "SELECT channel, status, response_url FROM syndication_log WHERE slug='day-$N-<slug>';"
```

Expected: `linkedin_article|linkedin_short` posted, `x_thread` skipped (manual_channel), `readme_patch` posted.

Manual fill-in (X + LI URL capture):
```bash
psql "$SUPABASE_DB_URL" -c "UPDATE syndication_log SET status='posted', response_url='$(cat $DIR/x-url.txt)' WHERE slug='day-$N-<slug>' AND channel='x_thread';"
psql "$SUPABASE_DB_URL" -c "UPDATE syndication_log SET response_url='$(cat $DIR/linkedin-url.txt)' WHERE slug='day-$N-<slug>' AND channel LIKE 'linkedin%';"
```

<validation_gate id="VG-7" blocking="true">
  <prerequisites>VG-6 PASS; `SUPABASE_DB_URL` in env; `blog-url.txt`, `linkedin-url.txt`, `x-url.txt` non-empty.</prerequisites>
  <execute>DIR=plans/phase-12-evidence/day-$N && SLUG=$(cat $DIR/vg-2-slug.txt | cut -d= -f2) && psql "$SUPABASE_DB_URL" -c "UPDATE syndication_log SET status='posted', response_url=trim('$(cat $DIR/x-url.txt)') WHERE slug='$SLUG' AND channel='x_thread';" && psql "$SUPABASE_DB_URL" -c "UPDATE syndication_log SET response_url=trim('$(cat $DIR/linkedin-url.txt)') WHERE slug='$SLUG' AND channel LIKE 'linkedin%';" && psql "$SUPABASE_DB_URL" -c "SELECT channel, status, response_url FROM syndication_log WHERE slug='$SLUG';" | tee $DIR/vg-7-supabase-final.txt</execute>
  <capture>plans/phase-12-evidence/day-$N/vg-7-supabase-final.txt (final row state per channel)</capture>
  <pass_criteria>For the slug, Supabase returns: one row per expected channel (`linkedin_article` OR `linkedin_short`, `x_thread`, `readme_patch`). Every row's `status` is `posted` (except `readme_patch` on off-days which may be `skipped`). Every row's `response_url` is non-NULL and non-empty. The `x_thread` row's `response_url` contains `x.com/` or `twitter.com/`; the `linkedin_*` row's `response_url` contains `linkedin.com/`.</pass_criteria>
  <review>`psql "$SUPABASE_DB_URL" -c "SELECT channel, status, response_url IS NOT NULL AS has_url FROM syndication_log WHERE slug='$SLUG';"` — every `has_url` must be `t`; every `status` must be `posted`.</review>
  <verdict>PASS → proceed | FAIL → re-run UPDATE with corrected URL escaping</verdict>
  <mock_guard>IF tempted to run the UPDATE against a staging/local Postgres → STOP → production Supabase is the single source of truth for syndication_log.</mock_guard>
</validation_gate>

### B3.8 — 10:30 AM PT: Plausible glance + Beehiiv trigger

```bash
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&period=day&metrics=visitors,pageviews" \
  > $DIR/plausible-0930.json
```

Beehiiv: if manual-trigger mode (B2.5), log in → find draft → publish to list. If auto-schedule, skip.

<validation_gate id="VG-8" blocking="true">
  <prerequisites>VG-7 PASS; `PLAUSIBLE_API_KEY` in env; Plausible site `withagents.dev` receiving traffic.</prerequisites>
  <execute>DIR=plans/phase-12-evidence/day-$N && curl -s -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&period=day&metrics=visitors,pageviews" | tee $DIR/plausible-0930.json</execute>
  <capture>plans/phase-12-evidence/day-$N/plausible-0930.json (raw Plausible response + HTTP_STATUS footer)</capture>
  <pass_criteria>`HTTP_STATUS:200` on last line of the file. JSON body parses (`jq -e . < plausible-0930.json` returns 0). Body contains both `visitors` and `pageviews` keys with numeric values (both ≥ 0 is valid; ≥ 0 means API responded with real data). File size ≥ 50 bytes (empty `{}` would be under 10 bytes and fail this check).</pass_criteria>
  <review>`jq -e '.results.visitors.value, .results.pageviews.value' plans/phase-12-evidence/day-$N/plausible-0930.json` must print two numbers without error; `tail -1 plans/phase-12-evidence/day-$N/plausible-0930.json` must contain `HTTP_STATUS:200`.</review>
  <verdict>PASS → proceed | FAIL → check Plausible site is live and API key valid, re-run</verdict>
  <mock_guard>IF tempted to write a hand-crafted `{"visitors":0}` JSON to skip the curl → STOP → capture real Plausible API response only.</mock_guard>
</validation_gate>

### B3.9 — End-of-day: metrics capture (hand off to B5)

**Fix:** B5 metrics script consumes this day's evidence. Run:
```bash
pnpm tsx scripts/metrics/daily-capture.ts --day $N
```

Produces `plans/phase-12-metrics/day-$N.json`. See B5 for schema.

<validation_gate id="VG-9" blocking="true">
  <prerequisites>VG-1 through VG-8 all PASS; `scripts/metrics/daily-capture.ts` compiled and present.</prerequisites>
  <execute>pnpm tsx scripts/metrics/daily-capture.ts --day $N 2>&1 | tee plans/phase-12-evidence/day-$N/vg-9-metrics.log && test -s plans/phase-12-metrics/day-$N.json && jq -e 'has("day") and has("blog_url") and has("linkedin_url") and has("x_url")' plans/phase-12-metrics/day-$N.json | tee plans/phase-12-evidence/day-$N/vg-9-schema-check.txt</execute>
  <capture>plans/phase-12-metrics/day-$N.json (canonical metrics file for B5 consumption), plans/phase-12-evidence/day-$N/vg-9-metrics.log, plans/phase-12-evidence/day-$N/vg-9-schema-check.txt</capture>
  <pass_criteria>`day-$N.json` exists and size > 0. `jq -e` schema check returns `true` (all four required keys present: `day`, `blog_url`, `linkedin_url`, `x_url`). `day` value equals $N. URL values in the JSON match the URLs captured in `linkedin-url.txt` and `x-url.txt` (verify via `jq -r '.linkedin_url' plans/phase-12-metrics/day-$N.json` equals `$(cat plans/phase-12-evidence/day-$N/linkedin-url.txt)`). Script exits 0.</pass_criteria>
  <review>`jq . plans/phase-12-metrics/day-$N.json` prints a populated object; cross-check URLs match the evidence-directory text files byte-for-byte.</review>
  <verdict>PASS → day-N loop closes | FAIL → fix daily-capture.ts or missing upstream evidence, re-run</verdict>
  <mock_guard>IF tempted to hand-write `day-$N.json` or stub the script → STOP → script must read real evidence files and write real metrics.</mock_guard>
</validation_gate>

## Flagship Day Special Steps

### Day 1 (Launch)

After B3.1–B3.8:
- 10:30 AM PT: Post ValidationForge launch to Product Hunt (per B1.2 makers list)
- 11:00 AM PT: Slack `#launch` announcement + DM core network (20-person list per approval-package §9)
- 12:00 PM PT: Monitor HN front page (do NOT submit — Day 22 decision)
- 2:00 PM PT: Mid-day metrics pull → `plans/phase-12-evidence/day-1/midday-plausible.json`
- 5:00 PM PT: Respond to every LI comment + X reply
- 9:00 PM PT: End-of-day retro → `plans/phase-12-evidence/day-1/launch-retro.md` (5–10 bullets)

### Day 22 (Ralph flagship)

Per B1.4 decision:
- If `hn_day22_strategy=primary`: 9:00 AM ET submit to HN with Ralph + CCB-origin angle; monitor comments
- If `conditional_day23`: skip HN Day 22; check Day 22 EOD LI reactions; if ≥threshold, submit Day 23 9am ET
- If `hold`: no HN

Reddit sub-submit (`r/programming`, `r/MachineLearning`): only if CCB angle validated via Day 10 CCB-flagship engagement data.

### Day 50 (Finale / Code Stories + manifesto)

3-in-1 day per R1 §3. Expect Article + thread + 3 README patches. Budget 90 min operator time. Per R1 §3 Day 50 Risk Gate: if Day 48 voice review flagged overload, split SF → Day 49, CS → Day 51, manifesto-only Day 50.

## Operator-down protocol

Solo-operator plan. No backup operator named. Protocol for illness/emergency/off-grid travel, so a bad day doesn't cascade into kill-switch B4.6 (B4.6 fires on 2 consecutive missed publish days).

### Silently-skippable activity classes (NO cascade)

These can lapse without triggering B4 or damaging the arc's coherence:
- X authority replies (C2.4 opportunistic — already deferred to opportunistic-only per C7 D11)
- Reddit engagement (already deferred, C7 D1)
- LinkedIn comment replies beyond top-3 by engagement
- Daily Plausible snapshot (caught up weekly in C6)
- HN thread replies after hour 4 (Day 1 only high-stakes; Day 22/50 lower)
- Same-day metric capture (can run 1-3 days later against cached API data)

### Cascade-triggering activity classes (must execute OR invoke pause)

These missed 2+ days in a row triggers B4 kill-switch:
- **Flagship publish (D1, D7, D14, D22, D30, D45, D50)** — cannot skip; invoke pause protocol if unable
- **Non-flagship daily publish** — 1 day slip OK, 2 days = B4.6 auto-fire
- **Newsletter go-live (Beehiiv weekly)** — subscribers expect Sun 10am
- **B3.3 runner.ts runner** (readme patch + Supabase logging)

### Scenario A — illness 1-3 days

1. Hour 0: Nick DMs Slack `#launch`: `ops-down: illness, expected back <YYYY-MM-DD>`
2. If Day N is NOT a flagship and Day N+1 is not a flagship: skip B3.4/B3.5 only (keep B3.3 runner — it's 2 min; readme patch preserves arc). Evidence gap documented `plans/phase-12-evidence/day-$N/SKIPPED.md`.
3. Day N+1 morning: if still down, invoke B4.6 pause. Resume from Day N+2.
4. Day N+2 resume: catch-up is NOT 3-posts-in-1-day; use reserve-post swap mechanic (below) to consolidate / skip.

### Scenario B — illness >3 days OR family emergency

1. Hour 0: Same Slack message, expected return uncertain.
2. Immediately invoke B4.6 pause (`.syndication-paused` sentinel written, cron disabled).
3. Broadcast: "Launch paused (personal). Back <date>." to LI + X + Beehiiv subscribers via 1 short post — *not* a flagship announcement, just honesty.
4. On return: post-mortem in `plans/phase-12-retro/ops-down-$DATE.md`. Do NOT attempt calendar catch-up — shift all remaining days forward by pause duration. If pause >7d, consider collapsing the 45-day arc to remaining-days-only; kill-darlings 2–3 non-flagship Articles to fit.
5. Resume with Day 1 energy not Day-7 exhaustion: next publish is low-stakes feed-post to re-enter cadence, not an immediate Article.

### Scenario C — planned travel 5-7 days (off-grid / conference)

1. Plan ≥5 days ahead. Pre-draft the traveling-week's LinkedIn/X content.
2. If Typefully is chosen (B1.5): schedule week's X threads in advance.
3. Batch LinkedIn feed-post content to `scripts/syndication/travel-queue/week-$N.md`; user posts ONE per day from phone via LinkedIn mobile (30s each).
4. Skip Articles that week — feed-only acceptable if no flagship in window.
5. README patches: defer or pre-execute via `runner --day N --channel readme` ahead of travel (most companion repos don't care about exact commit date).
6. DO NOT plan travel across a flagship day. If unavoidable: execute flagship before departure via `--day N --date-override` flag (document publish-date mismatch in that day's retro).

### Catch-up protocol (post-pause)

- NEVER attempt >1 missed day in a single catch-up day; readers can't absorb 3 posts in 24h.
- Use reserve-post swap mechanic to drop lowest-value non-flagship days.
- If ≥3 days missed, extend the arc end-date rather than compress the middle.
- Update `plan.md` acceptance criteria with new effective end-date.

## Day 1 minute-by-minute schedule (PT-unified, timezone-resolved)

Day 1 has the most stacked collisions per architect HS-7. All times PT (Pacific) to eliminate PT/ET ambiguity. Conversion: ET = PT + 3h.

| PT time | Activity | Phase | Notes / collision handling |
|---|---|---|---|
| 05:00 | Wake. Coffee. No email yet. | — | Circadian buffer. |
| 06:00 | Pre-flight: `cat .launch-date`, `.syndication-paused` check, Slack #launch morning ping. | B3.1 pre | 5 min. |
| 06:10 | **B3.1 dry-run** `runner --day 1 --dry-run` | B3.1 | 5 min. |
| 06:15 | **B3.2 MDX live-sanity** `curl` + `<article>` grep | B3.2 | 10 min. |
| 06:30 | **B3.3 runner Day 1** — patch readme, stage LinkedIn prep | B3.3 | 5 min. Log to `runner.log`. |
| 06:40 | **C4.1 HN Day 1 Show HN submit** — 09:40 ET window within HN 08:00–10:00 ET prime. | C4.1 | PRIORITIZED over Product Hunt (HN is highest-value audience, zero-tolerance for delay). |
| 06:45 | **C4.5 HN first comment** (within 60s of submit) | C4.5 | 5 min. |
| 06:50 | **C3.1 Product Hunt launch post** — 09:50 ET / 06:50 PT | C3 | PH doesn't enforce a submit window like HN; 06:50 PT is fine. PH co-makers notified via group DM. |
| 07:15 | **B3.4 LinkedIn Article manual publish** via `article-prep.ts` | B3.4 / C1 | 8 min for flagship Article. |
| 07:30 | **B3.5 X thread publish** (Typefully or manual) | B3.5 / C2 | 10 min. |
| 07:45 | **C1.5 LinkedIn reply sprint** | C1.5 | 30 min. |
| 08:15 | **C6.1 Beehiiv newsletter go-live** — subscribers expect morning delivery | C6 | 5 min trigger. |
| 08:20 | **B3.6 evidence capture** (4 URLs + runner.log) | B3.6 | 10 min. |
| 08:30 | **B3.7 Supabase verification + UPDATE** (X URL, LI URL) | B3.7 | 10 min. |
| 08:40 | **C4.7 HN author-reply loop** — high-intensity for first 4h of thread | C4 | Block 08:40–12:40. Every top-level comment gets a reply within 15 min. Deprioritize everything else during this window. |
| 12:40 | **Lunch + buffer** (first mandatory break) | — | 45 min. |
| 13:25 | **B3.8 Plausible glance** + mid-day metrics pull → `midday-plausible.json` | B3.8 / B5 | 10 min. |
| 13:35 | **Slack #launch status post** (metrics + highlights + any red flags) | — | 10 min. |
| 13:45 | **C1/C2 comment reply loop** — LI + X comments since 07:15 | C1/C2 | 60 min. Prioritize LI (higher-value audience) over X. |
| 14:45 | **C2.3 X thread author replies** | C2 | 30 min. |
| 15:15 | **HN thread replies** (continuing, lower intensity) | C4 | 60 min. |
| 16:15 | **DM sprint to 20-person core network** | — | 30 min — skippable if HN/LI on fire. |
| 16:45 | **Second mandatory break** | — | 30 min. |
| 17:15 | **C1.5 reply sprint round 2** | C1.5 | 30 min. |
| 17:45 | **B3.9 EOD metrics capture** `daily-capture.ts --day 1` | B5 | 10 min. |
| 17:55 | **EOD retro** — `plans/phase-12-evidence/day-1/launch-retro.md` (5-10 bullets: what worked, what felt off, any kill-switch warnings) | B3 | 30 min. |
| 18:25 | **Soft stop.** Comments after this point can go to Day-2 morning. | — | — |
| 18:30+ | Dinner. Done. No more work. | — | — |

**Collision resolution (deprioritized if day is overrun):**
- Drop in this order under pressure: core-network DM sprint → X thread replies beyond 15min → LI reply round 2 → mid-day Slack status post.
- PROTECT at all cost: HN first-comment, HN first-4h reply window, LI Article publish, B3.6 evidence capture, B3.7 Supabase UPDATE, EOD retro.

**Total Day-1 operator hours: ~11h engaged (06:00 – 18:30 with two breaks = 11.5h elapsed, ~10.5h working).** Architect HS-7 flagged ~12h zero-buffer; this schedule builds 75 min of breaks and ranks deprioritization explicitly.

<validation_gate id="VG-10" blocking="true">
  <prerequisites>Day-1 executed; all VG-1…VG-9 PASSED for Day 1; user has completed the 17:55 PT EOD retro writeup.</prerequisites>
  <execute>RETRO=plans/phase-12-evidence/day-1/launch-retro.md && test -s $RETRO && BULLETS=$(grep -cE '^[*\-] ' $RETRO) && WORKED=$(grep -ciE 'what.?worked|worked[:\)]|win' $RETRO) && OFF=$(grep -ciE 'what.?felt.?off|felt off|concern|friction|red flag' $RETRO) && echo "BULLETS=$BULLETS WORKED=$WORKED FELT_OFF=$OFF" | tee plans/phase-12-evidence/day-1/vg-10-retro-check.txt</execute>
  <capture>plans/phase-12-evidence/day-1/launch-retro.md (operator-written retro), plans/phase-12-evidence/day-1/vg-10-retro-check.txt (bullet+keyword tally)</capture>
  <pass_criteria>`launch-retro.md` exists and size > 0. Bullet count (`^[*-] ` at line start) ≥ 5. At least 1 bullet matches "what worked" / "worked:" / "win" (case-insensitive). At least 1 bullet matches "what felt off" / "felt off" / "concern" / "friction" / "red flag" (case-insensitive). Retro is stored under `plans/phase-12-evidence/day-1/` (not elsewhere).</pass_criteria>
  <review>`cat plans/phase-12-evidence/day-1/vg-10-retro-check.txt` must show `BULLETS>=5`, `WORKED>=1`, `FELT_OFF>=1`; `cat plans/phase-12-evidence/day-1/launch-retro.md` — confirm prose is substantive, not placeholder text.</review>
  <verdict>PASS → Day 1 fully closed, proceed to Day 2 | FAIL → operator completes retro to meet threshold, re-run</verdict>
  <mock_guard>IF tempted to auto-generate retro content from templates or pad bullets to reach 5 → STOP → retro must be operator's real lived observations from Day 1.</mock_guard>
</validation_gate>

## Off-days and devlog-only days

- Days 6, 30, 32, 33 (off-days): runner short-circuits on `isOff`. No action needed. Reply to comments 15 min end-of-day.
- Day 31, Day 60 (devlog-only): `runner --day N --channel linkedin` only. Manual X thread "mid-push shipping diary".

## Reserve-post swap mechanic

If a calendar row fails (e.g., `ils-ios` not landed by Day 56): overwrite sidecars at `withagents-site/src/content/posts/day-56-*.{linkedin,x}.md` with reserve content from `reserve-c-*.md`; delete day entry from `.syndication-state.json` via `jq`; re-run `runner --day 56`. Log swap reason → `$DIR/reserve-swap.md`.

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/phase-12-evidence/day-NN/*` | B3 | B5 reads for metrics rollup |
| `.syndication-state.json` | runner.ts (auto) | B3 reset-ops only on reserve swaps |
| Supabase `syndication_log` | runner.ts writes, B3 UPDATEs | B4, B5 read |
| Vercel deploy | untouched by B3 | A-track only |
| `posts/<slug>/*.linkedin.md` `.x.md` `.readme-patch.md` | A2 owns, B3 read-only | B3 overwrites only on reserve swap |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Missed 9am window → post lands off-peak LI algorithm | MED | MED | calendar reminder; +1h grace is fine; skip only if >4h slip |
| `patcher.ts` push rejected (branch protection) | MED | MED | `.readme-patch.md` kept; manual `cd /tmp/readme-patch-*; git push` OR PR flow |
| LI UI changes break `?title=` prefill | LOW | LOW | fallback: paste title manually from prep file |
| X manual posting mis-threaded (forgot reply) | MED | LOW | Typefully eliminates; manual: delete thread + repost |
| Supabase row stays `skipped` for X (forgot UPDATE) | HIGH | LOW | B5 metrics sweep catches; weekly batch UPDATE script |
| 2-consecutive missed publish days → kill-switch | LOW | HIGH | B4 auto-detects; user-facing Slack alert fires |
| Reserve-swap mis-targeted day N | LOW | MED | state-file backup to Supabase (R1 open item 7); manual restore |
| Calendar parser eats non-pipe annotations | LOW | MED | R1 Day -2 smoke covers; B3.1 dry-run re-catches |
| Beehiiv auto-publish surprises (sends immediately) | MED | LOW | default config = manual-trigger in B2.5; verify Day -1 |

## Acceptance criteria (per day)

- [ ] B3.1 dry-run exits 0
- [ ] B3.2 blog URL returns 200
- [ ] B3.3 runner.log written, no errors
- [ ] B3.4 `linkedin-url.txt` non-empty with valid linkedin.com URL
- [ ] B3.5 `x-url.txt` non-empty with valid x.com URL (unless thread skipped with documented reason)
- [ ] B3.6 all 4 evidence files present in `plans/phase-12-evidence/day-$N/`
- [ ] B3.7 Supabase row for each channel present with final `response_url` filled
- [ ] B3.8 Plausible snapshot captured
- [ ] B3.9 `day-$N.json` metrics file written
- [ ] Operator-down protocol documented in this file (Scenarios A/B/C) and referenced by B4.6 pause
- [ ] Day-1 minute-by-minute schedule (PT-unified) present with explicit deprioritization ranking

## Verification steps

End-of-run audit (Day 45 or Day 60):
```bash
# All publishing days have complete evidence
cd /Users/nick/Desktop/blog-series
for N in $(seq 1 45); do
  DIR=plans/phase-12-evidence/day-$N
  [ -d "$DIR" ] || { echo "MISSING day-$N"; continue; }
  for f in blog-url.txt linkedin-url.txt x-url.txt runner.log; do
    [ -s "$DIR/$f" ] || echo "day-$N MISSING $f"
  done
done
# expect: output only "MISSING day-$N" for off-days (6, 30, 32, 33)

# Supabase row completeness
psql "$SUPABASE_DB_URL" -c \
  "SELECT DATE(posted_at) AS d, COUNT(*) FROM syndication_log WHERE status='posted' GROUP BY d ORDER BY d;"
# expect: one row per publishing day, count ≥2 (LI + readme, X if captured)
```

## Rollback

Per-day rollback: `vercel rollback <prior>` reverts site; `DELETE FROM syndication_log WHERE slug='day-N-...'` clears DB row; LinkedIn Article → UI delete; X thread → UI delete each tweet; README patch → `git revert <sha>` on companion repo.

Cross-day rollback (multi-day regret): stop runner cron (`crontab -e` comment the line), set kill-switch (B4), pause indefinitely, resume by un-commenting + `runner --today`.

<gate_manifest>
  <total_gates>10</total_gates>
  <sequence>VG-1 (dry-run) → VG-2 (MDX 200) → VG-3 (runner + Supabase) → VG-4 (LinkedIn URL live 200) → VG-5 (X URL live 200) → VG-6 (4-URL evidence) → VG-7 (Supabase UPDATE) → VG-8 (Plausible snapshot) → VG-9 (daily metrics JSON) → VG-10 (Day-1 EOD retro ≥5 bullets)</sequence>
  <policy>All gates BLOCKING. VG-1…VG-9 repeat per publishing day. VG-10 fires exactly once (Day 1). Operator-down playbooks (Scenarios A/B/C) are prose, not gates — pause-sentinel round-trip is covered by B4 VG-6.</policy>
  <evidence_dir>plans/phase-12-evidence/day-$N/ (daily) + plans/phase-12-metrics/day-$N.json (B5 handoff)</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix; no skip-forward. 2 consecutive FAIL on VG-3 runner = auto-page B4.6 pause.</regression>
</gate_manifest>
