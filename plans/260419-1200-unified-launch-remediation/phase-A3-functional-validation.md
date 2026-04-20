# Phase A3 — Functional Validation (Playwright against Vercel preview)

**Owner:** Sonnet executor + chrome-devtools MCP fallback
**Effort:** 4–6h
**Status:** pending
**Depends on:** A1 (all 7 blockers merged)
**Blocks:** B2 (pre-push infra), B3 (Day 1)

## Context

R3 delivered an 18-item smoke-test Playwright script. Execute against a real Vercel preview deploy, capture evidence, confirm all green before Day −1.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Prerequisites

- A1 merged (X channel removed, Supabase mapper, Keystatic gate, OG fonts inlined, Plausible env-gated, 404.astro, RSS verified)
- `.launch-date` committed
- Vercel project linked (`vercel link` run once)
- Vercel env vars set: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `NICK_INQUIRY_EMAIL`, `CALENDLY_URL`, `PUBLIC_PLAUSIBLE_DOMAIN`

## Tasks

### A3.1 Preview deploy (30 min)

```bash
cd /Users/nick/Desktop/blog-series/withagents-site
vercel --no-prod    # capture preview URL e.g. https://withagents-site-xxxx.vercel.app
echo "PREVIEW=<url>" > /tmp/preview-url.env
```

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`vercel` CLI authenticated (`vercel whoami` exits 0); Vercel project linked (`cat .vercel/project.json` has `projectId`); A1 all 10 gates green.</prerequisites>
  <execute>mkdir -p evidence/phase-A3 && cd withagents-site && vercel --no-prod --yes 2>&1 | tee ../evidence/phase-A3/vg-1-deploy.log; PREVIEW=$(grep -oE 'https://[a-z0-9-]+\.vercel\.app' ../evidence/phase-A3/vg-1-deploy.log | head -1); echo "PREVIEW=$PREVIEW" | tee /tmp/preview-url.env ../evidence/phase-A3/vg-1-preview-url.env; until curl -sfI "$PREVIEW/" >/dev/null; do sleep 2; done; curl -sI "$PREVIEW/" 2>&1 | tee ../evidence/phase-A3/vg-1-preview-health.log</execute>
  <capture>evidence/phase-A3/vg-1-deploy.log, evidence/phase-A3/vg-1-preview-url.env, evidence/phase-A3/vg-1-preview-health.log</capture>
  <pass_criteria>`evidence/phase-A3/vg-1-preview-url.env` contains `PREVIEW=https://` matching `vercel.app`; health log first line matches `HTTP/[12](\.[01])? 200`; deploy log contains `Deployment complete` or `Production: <url>` or `Preview: <url>`.</pass_criteria>
  <review>`cat evidence/phase-A3/vg-1-preview-url.env` and `grep -E '^HTTP' evidence/phase-A3/vg-1-preview-health.log`.</review>
  <verdict>PASS → proceed to VG-2 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to manually type a fake preview URL into `/tmp/preview-url.env` instead of capturing from the real deploy → STOP → re-run vercel.</mock_guard>
</validation_gate>

### A3.2 Install Playwright + drop smoke script (30 min)

```bash
cd withagents-site
pnpm add -D @playwright/test
pnpm exec playwright install chromium
mkdir -p tests
# copy R3-provided test from plans/260419-1200-unified-launch-remediation/research/R3-deploy-and-functional-validation.md §4.1
# save to tests/smoke.spec.ts
```

Adjust `FLAGSHIP_POST_SLUG` constant to `day-01-validationforge-ga`. Swap `BASE` via env.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>VG-1 PASSed; `withagents-site/package.json` writable; pnpm installed; `research/R3-deploy-and-functional-validation.md` readable.</prerequisites>
  <execute>cd withagents-site && pnpm add -D @playwright/test 2>&1 | tee ../evidence/phase-A3/vg-2-install.log && pnpm exec playwright install chromium 2>&1 | tee ../evidence/phase-A3/vg-2-browser-install.log && mkdir -p tests && ls tests/smoke.spec.ts 2>&1 | tee ../evidence/phase-A3/vg-2-script-present.log && grep -cE "FLAGSHIP_POST_SLUG.*day-01-validationforge-ga" tests/smoke.spec.ts > ../evidence/phase-A3/vg-2-flagship-slug.txt</execute>
  <capture>evidence/phase-A3/vg-2-install.log, evidence/phase-A3/vg-2-browser-install.log, evidence/phase-A3/vg-2-script-present.log, evidence/phase-A3/vg-2-flagship-slug.txt</capture>
  <pass_criteria>`jq -e '.devDependencies["@playwright/test"]' withagents-site/package.json` returns a non-null version string; browser-install log contains `chromium` downloaded or `up to date`; `tests/smoke.spec.ts` file exists (script-present log shows path, not "No such file"); `cat evidence/phase-A3/vg-2-flagship-slug.txt` >= 1.</pass_criteria>
  <review>`jq '.devDependencies' withagents-site/package.json | grep playwright` and `grep -n FLAGSHIP_POST_SLUG withagents-site/tests/smoke.spec.ts`.</review>
  <verdict>PASS → proceed to VG-3 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to copy an older Playwright script instead of the R3-provided 18-item matrix → STOP → copy from the actual R3 research file.</mock_guard>
</validation_gate>

### A3.3 Execute 18-item matrix (90 min)

```bash
source /tmp/preview-url.env
SMOKE_BASE=$PREVIEW pnpm exec playwright test tests/smoke.spec.ts --reporter=list 2>&1 | tee /tmp/smoke-run.log
```

Expected: ≥18/18 pass. Allowed degraded: S7 (Keystatic) may 308-redirect per A1.3 — adjust test to expect 308 or 404 not 200.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>VG-1 and VG-2 PASSed; `/tmp/preview-url.env` populated; `until curl -sfI "$(grep -oE 'https://[^ ]+' /tmp/preview-url.env)/" >/dev/null; do sleep 2; done`; Playwright installed; `tests/smoke.spec.ts` committed.</prerequisites>
  <execute>source /tmp/preview-url.env && cd withagents-site && SMOKE_BASE=$PREVIEW pnpm exec playwright test tests/smoke.spec.ts --reporter=list --reporter=html --output=../evidence/phase-A3/vg-3-playwright-output/ 2>&1 | tee ../evidence/phase-A3/vg-3-smoke-run.log; echo "playwright_exit=$?" >> ../evidence/phase-A3/vg-3-smoke-run.log; ls playwright-report/index.html 2>&1 | tee -a ../evidence/phase-A3/vg-3-smoke-run.log</execute>
  <capture>evidence/phase-A3/vg-3-smoke-run.log, evidence/phase-A3/vg-3-playwright-output/ (all screenshots, videos, traces), withagents-site/playwright-report/index.html</capture>
  <pass_criteria>Log contains exact literal `18 passed` (or `18 passed (…)`) AND `playwright_exit=0`; `withagents-site/playwright-report/index.html` exists and size > 0 bytes; zero lines in log match `failed` or `timed out` except for explicitly waived S7 (where the test asserts 308 not 200). Absolute path to HTML report: `withagents-site/playwright-report/index.html`.</pass_criteria>
  <review>`grep -E 'passed|failed|timed out' evidence/phase-A3/vg-3-smoke-run.log` then open HTML report: `open withagents-site/playwright-report/index.html` (or Read tool on `index.html`) — every row green.</review>
  <verdict>PASS → proceed to VG-4 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to mark a failing test as `test.skip()` or lower the pass bar from 18 to "majority" → STOP → fix the underlying bug in the site, re-deploy, re-run.</mock_guard>
</validation_gate>

### A3.4 Evidence capture (60 min)

For each test, capture one screenshot to `plans/260419-1200-unified-launch-remediation/evidence/smoke-SNN-<name>.png`.
Playwright auto-captures on failure; for passes, add one explicit screenshot step or use `--screenshot=on`.

```bash
SMOKE_BASE=$PREVIEW pnpm exec playwright test --screenshot=on --output=../plans/260419-1200-unified-launch-remediation/evidence/
```

<validation_gate id="VG-4" blocking="true">
  <prerequisites>VG-3 PASSed; preview URL still live; `plans/260419-1200-unified-launch-remediation/evidence/` directory writable.</prerequisites>
  <execute>source /tmp/preview-url.env && cd withagents-site && SMOKE_BASE=$PREVIEW pnpm exec playwright test --screenshot=on --output=../plans/260419-1200-unified-launch-remediation/evidence/smoke-screenshots/ tests/smoke.spec.ts 2>&1 | tee ../evidence/phase-A3/vg-4-capture.log && ls -la ../plans/260419-1200-unified-launch-remediation/evidence/smoke-screenshots/ | tee ../evidence/phase-A3/vg-4-screenshot-inventory.txt</execute>
  <capture>evidence/phase-A3/vg-4-capture.log, evidence/phase-A3/vg-4-screenshot-inventory.txt, plans/260419-1200-unified-launch-remediation/evidence/smoke-screenshots/*.png</capture>
  <pass_criteria>`find plans/260419-1200-unified-launch-remediation/evidence/smoke-screenshots/ -name '*.png' | wc -l` >= 18; every PNG has size > 1000 bytes (`find ... -name '*.png' -size -1k | wc -l` = 0); inventory file lists at least 18 entries.</pass_criteria>
  <review>`ls -la plans/260419-1200-unified-launch-remediation/evidence/smoke-screenshots/` then open 2 sample screenshots via Read tool to confirm they show real rendered page content, not blank.</review>
  <verdict>PASS → proceed to VG-5 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to generate stock placeholder PNGs to fill the directory count → STOP → capture real Playwright screenshots.</mock_guard>
</validation_gate>

### A3.5 Real /api/consult round-trip (30 min)

S5 posts to /api/consult. Confirm:
- Supabase row inserted (query `SELECT * FROM consultant_inquiries WHERE email='smoke@example.com' ORDER BY created_at DESC LIMIT 1`)
- Resend email delivered to `NICK_INQUIRY_EMAIL` (check inbox)
- 303 redirect Location header = `CALENDLY_URL`

Clean up: `DELETE FROM consultant_inquiries WHERE email='smoke@example.com';` after test.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>VG-3 PASSed; `$SUPABASE_URL`/`$SUPABASE_SERVICE_KEY` set; Resend API key live; `$NICK_INQUIRY_EMAIL` and `$CALENDLY_URL` env vars set; Supabase reachable (`pg_isready -d "$SUPABASE_URL" -q || exit 1`); preview URL live.</prerequisites>
  <execute>source /tmp/preview-url.env && curl -siL -X POST "$PREVIEW/api/consult" -d "name=Smoke&email=smoke@example.com&project=A3%20validation" --max-redirs 0 2>&1 | tee evidence/phase-A3/vg-5-consult-response.log && psql "$SUPABASE_URL" -c "SELECT id, email, created_at FROM consultant_inquiries WHERE email='smoke@example.com' ORDER BY created_at DESC LIMIT 1;" 2>&1 | tee evidence/phase-A3/vg-5-supabase-row.log && psql "$SUPABASE_URL" -c "DELETE FROM consultant_inquiries WHERE email='smoke@example.com';" 2>&1 | tee evidence/phase-A3/vg-5-cleanup.log</execute>
  <capture>evidence/phase-A3/vg-5-consult-response.log, evidence/phase-A3/vg-5-supabase-row.log, evidence/phase-A3/vg-5-cleanup.log</capture>
  <pass_criteria>Consult response log first status line matches `HTTP/[12](\.[01])? 303` AND contains `location:` header whose value equals `$CALENDLY_URL`; Supabase log shows exactly 1 row with `email | smoke@example.com`; cleanup log shows `DELETE 1`; Resend inbox at `$NICK_INQUIRY_EMAIL` contains an email dated within the last 5 minutes (manual confirmation recorded in log via `echo "resend_inbox_confirmed=<YES|NO>" >> evidence/phase-A3/vg-5-consult-response.log`; pass requires YES).</pass_criteria>
  <review>`grep -E 'HTTP|location' evidence/phase-A3/vg-5-consult-response.log` and `cat evidence/phase-A3/vg-5-supabase-row.log`.</review>
  <verdict>PASS → proceed to VG-6 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to bypass Resend (e.g., `echo resend_inbox_confirmed=YES` without opening inbox) or mock the Supabase query → STOP → hit real services.</mock_guard>
</validation_gate>

### A3.6 Chrome DevTools MCP fallback for any failure (variable)

For each failing test, capture:
- Screenshot via `mcp call chrome-devtools.screenshot`
- Console errors via `mcp call chrome-devtools.evaluate --expression "document.title"` + watch network
- DOM snapshot via `page.content()`

Save to `evidence/failure-SNN-<name>/{screenshot.png, console.txt, dom.html}`.

<validation_gate id="VG-6" blocking="true">
  <prerequisites>VG-3 outcome known; if any failures, chrome-devtools MCP reachable; preview URL live.</prerequisites>
  <execute>FAIL_COUNT=$(grep -cE '^\s*(✘|×|failed)' evidence/phase-A3/vg-3-smoke-run.log || echo 0); mkdir -p evidence/phase-A3/vg-6-fallback; echo "fail_count=$FAIL_COUNT" | tee evidence/phase-A3/vg-6-fallback/summary.txt; if [ "$FAIL_COUNT" -gt 0 ]; then echo "Run chrome-devtools MCP captures per failed SNN; save to evidence/phase-A3/vg-6-fallback/failure-SNN-<name>/" >> evidence/phase-A3/vg-6-fallback/summary.txt; else echo "NO FAILURES — fallback not required" >> evidence/phase-A3/vg-6-fallback/summary.txt; fi; ls -la evidence/phase-A3/vg-6-fallback/ | tee evidence/phase-A3/vg-6-inventory.log</execute>
  <capture>evidence/phase-A3/vg-6-fallback/summary.txt, evidence/phase-A3/vg-6-inventory.log, plus any evidence/phase-A3/vg-6-fallback/failure-SNN-*/{screenshot.png,console.txt,dom.html} produced for real failures.</capture>
  <pass_criteria>`grep -E 'fail_count=' evidence/phase-A3/vg-6-fallback/summary.txt` exists; IF `fail_count=0` THEN summary contains `NO FAILURES — fallback not required`; IF `fail_count > 0` THEN every failing SNN has a dedicated `failure-SNN-*/` directory containing screenshot.png (>1000 bytes), console.txt (>0 bytes), dom.html (>0 bytes).</pass_criteria>
  <review>`cat evidence/phase-A3/vg-6-fallback/summary.txt` and `find evidence/phase-A3/vg-6-fallback -type f`.</review>
  <verdict>PASS → proceed to VG-7 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to synthesize fake failure artifacts to satisfy the directory structure → STOP → the directory should only be populated when real failures exist.</mock_guard>
</validation_gate>

### A3.7 Failure disposition (variable)

Any failure →
1. Classify: blocker (P1), polish (P2), false-negative (P3)
2. For P1: open a hotfix task in A1 scope, re-run A3 after fix
3. For P2: log in plan, defer to A5 polish
4. For P3: tighten assertion

<validation_gate id="VG-7" blocking="true">
  <prerequisites>VG-3 through VG-6 completed; `plans/260419-1200-unified-launch-remediation/reports/` writable.</prerequisites>
  <execute>mkdir -p plans/260419-1200-unified-launch-remediation/reports && { echo "# Smoke results — planner-260419-1208-smoke-results"; echo ""; echo "Preview: $(cat /tmp/preview-url.env)"; echo ""; echo "## Per-test verdicts"; echo "| SNN | Name | Verdict | Priority | Evidence |"; echo "|---|---|---|---|---|"; grep -E '^(✓|✘|×|passed|failed).*S[0-9]+' evidence/phase-A3/vg-3-smoke-run.log | head -20; echo ""; echo "## Failure dispositions"; cat evidence/phase-A3/vg-6-fallback/summary.txt; } | tee plans/260419-1200-unified-launch-remediation/reports/planner-260419-1208-smoke-results.md</execute>
  <capture>plans/260419-1200-unified-launch-remediation/reports/planner-260419-1208-smoke-results.md</capture>
  <pass_criteria>Report file size > 200 bytes; contains `## Per-test verdicts` heading; contains at least one line matching `S[0-9]+`; contains `Preview:` with a `vercel.app` URL; IF any failures existed in VG-3, report must classify each as P1/P2/P3.</pass_criteria>
  <review>`cat plans/260419-1200-unified-launch-remediation/reports/planner-260419-1208-smoke-results.md`.</review>
  <verdict>PASS → proceed to VG-gate-manifest | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to write "all passed" without grep-ing actual log output → STOP → derive verdicts from `vg-3-smoke-run.log`.</mock_guard>
</validation_gate>

## File ownership

| File | Owner |
|---|---|
| `withagents-site/tests/smoke.spec.ts` (NEW) | A3 |
| `withagents-site/package.json` (devDeps only) | A3 |
| `plans/260419-1200-unified-launch-remediation/evidence/` (NEW dir) | A3 |
| `plans/260419-1200-unified-launch-remediation/reports/planner-260419-1208-smoke-results.md` (NEW) | A3 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Preview URL differs from prod (OG absolute URLs point at `withagents.dev`) | HIGH | LOW | accept; S16 adjusted to check hostname match |
| Playwright 1.x breaks with Astro 6 adapter | LOW | MED | use `@playwright/test` ≥1.46 |
| Resend API rate-limits on test email | LOW | LOW | use one-shot email per run |
| Supabase staging vs prod — test row lands in prod | MED | MED | use separate Supabase project for preview env; document in A3 report |
| Vercel free-tier preview build cold-starts and times out a test | MED | LOW | Playwright retries set to 2 |

## Acceptance criteria

- [ ] Preview deploy URL captured
- [ ] Playwright installed in `withagents-site/package.json`
- [ ] `tests/smoke.spec.ts` runs → exit 0, ≥18/18 pass (or documented waiver for S7 Keystatic)
- [ ] Evidence directory contains 18 screenshots + failure artifacts (0 expected)
- [ ] Supabase test inquiry round-trip confirmed + cleaned up
- [ ] Report `planner-260419-1208-smoke-results.md` filed with per-test verdict + evidence path

## Verification

```bash
# All in one:
cd /Users/nick/Desktop/blog-series/withagents-site
SMOKE_BASE=$(cat /tmp/preview-url) pnpm exec playwright test \
  --screenshot=on \
  --output=../plans/260419-1200-unified-launch-remediation/evidence/ \
  tests/smoke.spec.ts
# Expect: "18 passed" in final line.
```

## Rollback

Failing tests do NOT rollback the deploy. Preview is throwaway. If A3 gates fail → loop back to A1/A2 → fresh preview → re-run A3.

<gate_manifest>
  <total_gates>7</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7</sequence>
  <policy>All gates BLOCKING. No advancement on FAIL.</policy>
  <evidence_dir>evidence/phase-A3/</evidence_dir>
  <regression>If ANY gate FAILS: fix real system → re-run from failed gate → do NOT skip forward.</regression>
</gate_manifest>
