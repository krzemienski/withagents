# Phase B2 — Pre-Push Infrastructure (9 items)

**Owner:** Sonnet executor (parallelizable where noted) + user for DNS/billing gates
**Effort:** 12h
**Status:** pending
**Window:** Day -5 → Day -1
**Blocks:** B3 (daily runbook — nothing fires on Day 1 until every B2 item is green)
**BlockedBy:** A1 (code blockers), A2 (content verification), A3 (functional validation), A4 (beehiiv setup), A5 (Wave-1b polish), B1 (decisions locked)

## Context

Every piece of provisioning between "code compiles" and "Day 1 cron fires" lives here. R3 §1–§2 lists 5 env vars, 4 DNS records, and a CLI deploy sequence; R1 §2 Day -2 lists Supabase schema apply + Plausible site registration + Slack channel. B2 executes those in order and runs the full R3 §3 18-item smoke against the real prod alias before signing off.

Prerequisite: `DECISIONS-LOCKED.md` (B1) committed so this phase knows which Beehiiv domain + X tool to wire.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Work Items

### B2.1 — DNS records for `withagents.dev` (user action, requires registrar access)

**Source:** R3 §1.2.

**Fix:** at DNS registrar (Cloudflare / Namecheap / wherever `withagents.dev` is hosted), create:

| Host | Type | Value | Notes |
|---|---|---|---|
| `@` | A | `76.76.21.21` | Vercel apex |
| `www` | CNAME | `cname.vercel-dns.com.` | 308 → apex |
| `@` | CAA | `0 issue "letsencrypt.org"` | SSL issuance |
| `_vercel` | TXT | (provided by Vercel at attach) | domain verification |

Beehiiv newsletter sending (REQUIRED if newsletter sends from `@withagents.dev` — DMARC compliance):

| Host | Type | Value | Notes |
|---|---|---|---|
| `newsletter` | CNAME | (provided by Beehiiv; only if B1.3 chose custom domain) | custom newsletter domain |
| `beehiiv._domainkey` | CNAME (or TXT) | (provided by Beehiiv Sending → Domain settings) | DKIM signing |
| `@` | TXT | `v=spf1 include:_spf.beehiiv.com ~all` (merge with existing SPF if present) | SPF authorization for Beehiiv mail senders |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc@withagents.dev` | DMARC policy; start at p=none for first 7d if paranoid |

If existing SPF record already present for Resend (`RESEND_API_KEY` domain), use single merged TXT: `v=spf1 include:_spf.beehiiv.com include:amazonses.com ~all` (Resend uses SES). Verify in Beehiiv dashboard Sending → Domain status = Verified before Day 1.

**Verification:**
```bash
dig +short withagents.dev A               # expect: 76.76.21.21
dig +short www.withagents.dev CNAME       # expect: cname.vercel-dns.com.
dig +short withagents.dev CAA             # expect: 0 issue "letsencrypt.org"
dig +short _vercel.withagents.dev TXT     # expect: matches value in Vercel UI
# if custom beehiiv:
dig +short newsletter.withagents.dev CNAME
# Beehiiv mail auth (always required for newsletter sending):
dig +short beehiiv._domainkey.withagents.dev CNAME  # DKIM
dig +short withagents.dev TXT | grep -E 'spf1.*beehiiv'  # SPF
dig +short _dmarc.withagents.dev TXT                # DMARC
```

Beehiiv dashboard → Sending → Domain status MUST show "Verified" before B2 closes. If pending >24h, re-check DNS values match the exact strings Beehiiv provided.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>Registrar access authenticated; DNS records saved &gt;=15 min ago (propagation buffer); Beehiiv Sending panel accessible.</prerequisites>
  <execute>for rec in "withagents.dev A" "www.withagents.dev CNAME" "withagents.dev CAA" "_vercel.withagents.dev TXT" "newsletter.withagents.dev CNAME" "beehiiv._domainkey.withagents.dev CNAME" "withagents.dev TXT" "_dmarc.withagents.dev TXT"; do echo "=== $rec ==="; dig +short $rec; done | tee evidence/phase-B2/vg-1-dns.log</execute>
  <capture>evidence/phase-B2/vg-1-dns.log (byte-for-byte dig output, one block per record type)</capture>
  <pass_criteria>Exact string matches, byte-for-byte:
    - `withagents.dev A` → `76.76.21.21`
    - `www.withagents.dev CNAME` → `cname.vercel-dns.com.`
    - `withagents.dev CAA` → `0 issue "letsencrypt.org"`
    - `_vercel.withagents.dev TXT` → matches the exact token Vercel UI shows under Domain verification
    - `beehiiv._domainkey.withagents.dev CNAME` → non-empty, matches Beehiiv-provided target
    - `withagents.dev TXT` → contains `v=spf1` AND `include:_spf.beehiiv.com`
    - `_dmarc.withagents.dev TXT` → starts with `v=DMARC1;`
    - Beehiiv Sending → Domain status = "Verified" (screenshot capture)
    If custom newsletter CNAME chosen (B1.3), that record is also present and matches Beehiiv target.</pass_criteria>
  <review>`cat evidence/phase-B2/vg-1-dns.log` — diff each line against expected string above; open Beehiiv dashboard screenshot and confirm "Verified" text is visible.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to fake DNS via `/etc/hosts` or stub `dig` output → STOP → wait for real registrar propagation.</mock_guard>
</validation_gate>

### B2.2 — Vercel env vars (Production scope only)

**Source:** R3 §1.1 + A1.5 (Plausible gating).

**Fix:** `cd withagents-site && vercel link` then:

```bash
vercel env add PUBLIC_PLAUSIBLE_DOMAIN production   # value: withagents.dev
vercel env add SUPABASE_URL production              # https://xxxx.supabase.co
vercel env add SUPABASE_SERVICE_ROLE_KEY production # service-role JWT (NOT anon)
vercel env add RESEND_API_KEY production            # re_...
vercel env add NICK_INQUIRY_EMAIL production        # nick@withagents.dev
vercel env add CALENDLY_URL production              # https://calendly.com/nickk/30min
vercel env add BEEHIIV_API_KEY production           # Beehiiv API key (required by B5.2 metrics)
vercel env add BEEHIIV_PUBLICATION_ID production    # Beehiiv publication UUID (required by B5.2)
```

Do NOT add these to Preview scope (preview URLs must not pollute prod Plausible, must not hit prod Supabase).

**Verification:**
```bash
vercel env ls | awk '/Production/ {print $1}' | sort > /tmp/vercel-env.txt
diff <(printf 'BEEHIIV_API_KEY\nBEEHIIV_PUBLICATION_ID\nCALENDLY_URL\nNICK_INQUIRY_EMAIL\nPUBLIC_PLAUSIBLE_DOMAIN\nRESEND_API_KEY\nSUPABASE_SERVICE_ROLE_KEY\nSUPABASE_URL\n') /tmp/vercel-env.txt
# expect: no diff
```

<validation_gate id="VG-2" blocking="true">
  <prerequisites>`vercel link` completed against `withagents-site`; user logged into Vercel CLI; B1.3 domain decision locked (dictates whether Beehiiv custom domain is required).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series/withagents-site && vercel env ls > evidence/phase-B2/vg-2-vercel-env.log && vercel env ls | awk '/Production/ {print $1}' | sort > /tmp/vercel-env.txt && diff <(printf 'BEEHIIV_API_KEY\nBEEHIIV_PUBLICATION_ID\nCALENDLY_URL\nNICK_INQUIRY_EMAIL\nPUBLIC_PLAUSIBLE_DOMAIN\nRESEND_API_KEY\nSUPABASE_SERVICE_ROLE_KEY\nSUPABASE_URL\n') /tmp/vercel-env.txt | tee -a evidence/phase-B2/vg-2-vercel-env.log</execute>
  <capture>evidence/phase-B2/vg-2-vercel-env.log (full `vercel env ls` table + diff output)</capture>
  <pass_criteria>`diff` exits 0 with empty output. All 8 variables listed in Production scope: BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID, CALENDLY_URL, NICK_INQUIRY_EMAIL, PUBLIC_PLAUSIBLE_DOMAIN, RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL. None of these 8 present in Preview scope (verify by `vercel env ls | grep Preview` → zero matches for the 8 names).</pass_criteria>
  <review>`cat evidence/phase-B2/vg-2-vercel-env.log` — confirm diff block is empty and Preview column does not contain any of the 8 names.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to create `.env.local` stub or mock `process.env` in runner → STOP → env values live in Vercel production only.</mock_guard>
</validation_gate>

### B2.3 — Plausible site registration

**Source:** R3 §1.5.

**Fix:** log in to `plausible.io`, create site `withagents.dev`. Set goal "Consult form submit" → URL pattern `/work/*` with 303-redirect trigger. Generate API key (read-only) → save into `~/.syndication.env` as `PLAUSIBLE_API_KEY=...`.

**Verification:**
```bash
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/realtime/visitors?site_id=withagents.dev"
# expect: numeric response (even 0)
```

<validation_gate id="VG-3" blocking="true">
  <prerequisites>Plausible.io account logged in; site `withagents.dev` created in UI; read-only API key generated and saved into `~/.syndication.env`; `PLAUSIBLE_API_KEY` sourced in current shell.</prerequisites>
  <execute>source ~/.syndication.env && curl -s -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/stats/realtime/visitors?site_id=withagents.dev" | tee evidence/phase-B2/vg-3-plausible.json</execute>
  <capture>evidence/phase-B2/vg-3-plausible.json (raw response body + HTTP_STATUS line)</capture>
  <pass_criteria>`HTTP_STATUS:200`; body is a numeric literal (e.g. `0`, `1`, `3` — no HTML, no error JSON); site_id `withagents.dev` appears in Plausible UI site list; "Consult form submit" goal configured on URL pattern `/work/*`.</pass_criteria>
  <review>`cat evidence/phase-B2/vg-3-plausible.json` — confirm body is numeric and HTTP_STATUS=200; screenshot Plausible goals page to `evidence/phase-B2/vg-3-goals.png`.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to stub Plausible API with local fixture or mock JSON response → STOP → real API key against real Plausible tenant only.</mock_guard>
</validation_gate>

### B2.4 — Supabase schema + tables

**Source:** R1 gap 4 (`consultant_inquiries` DDL missing), R1 §2 Day -2.

**Fix:** create `scripts/syndication/supabase/consult-schema.sql` with DDL:
```sql
CREATE TABLE IF NOT EXISTS consultant_inquiries (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL, email TEXT NOT NULL, use_case TEXT NOT NULL,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  ip_hash TEXT, notified BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS consult_created_idx ON consultant_inquiries (created_at DESC);
```

Apply both: `psql "$SUPABASE_DB_URL" -f scripts/syndication/supabase/schema.sql` then `-f consult-schema.sql`.

**Verification:** `psql -c "\dt syndication_log consultant_inquiries"` shows both; test INSERT + DELETE round-trip succeeds.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>`SUPABASE_DB_URL` exported in shell; `schema.sql` and `consult-schema.sql` present on disk; `psql` CLI available.</prerequisites>
  <execute>psql "$SUPABASE_DB_URL" -f scripts/syndication/supabase/schema.sql 2>&1 | tee evidence/phase-B2/vg-4-schema.log && psql "$SUPABASE_DB_URL" -f scripts/syndication/supabase/consult-schema.sql 2>&1 | tee -a evidence/phase-B2/vg-4-schema.log && psql "$SUPABASE_DB_URL" -c "\dt syndication_log consultant_inquiries" 2>&1 | tee -a evidence/phase-B2/vg-4-schema.log && psql "$SUPABASE_DB_URL" -c "INSERT INTO consultant_inquiries (name,email,use_case) VALUES ('vg4-probe','vg4@withagents.dev','probe') RETURNING id;" | tee -a evidence/phase-B2/vg-4-schema.log && psql "$SUPABASE_DB_URL" -c "DELETE FROM consultant_inquiries WHERE email='vg4@withagents.dev' RETURNING id;" | tee -a evidence/phase-B2/vg-4-schema.log</execute>
  <capture>evidence/phase-B2/vg-4-schema.log (DDL stdout, `\dt` listing, INSERT returned id, DELETE returned id)</capture>
  <pass_criteria>Both tables `syndication_log` and `consultant_inquiries` appear in `\dt` output under schema `public`. INSERT returns a single integer `id`. Subsequent DELETE returns the same `id` (round-trip succeeds). No ERROR lines in log. Index `consult_created_idx` exists (verify via `\di consult_created_idx`).</pass_criteria>
  <review>`cat evidence/phase-B2/vg-4-schema.log | grep -E 'ERROR|syndication_log|consultant_inquiries'` — confirm no errors and both table names present; `psql "$SUPABASE_DB_URL" -c "SELECT COUNT(*) FROM consultant_inquiries WHERE email='vg4@withagents.dev';"` returns 0 (cleanup verified).</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to use SQLite :memory: or H2 for a "quick test" → STOP → must target the real Supabase production database.</mock_guard>
</validation_gate>

### B2.5 — Beehiiv RSS import end-to-end

**Source:** approval-package §13, A4 handoff, B1.3 decision.

**Fix:** in Beehiiv dashboard → Automations → RSS-to-Post. Set feed URL `https://<preview-or-prod>/rss.xml` (preview is fine pre-deploy). Set schedule = manual (not auto-publish — B3 runbook triggers per day). Save.

If B1.3 chose custom domain: attach `newsletter.withagents.dev` under Settings → Domain → point to DNS value from B2.1.

**Verification:**
```bash
# 1. RSS parseable by beehiiv
curl -s https://<preview>/rss.xml | xmllint --noout -
# expect: exit 0

# 2. Beehiiv detected items
# UI check: Beehiiv → Automations → RSS feed shows ≥5 detected items with titles matching posts/
```

Send one test import (manual action in Beehiiv UI), capture preview render, screenshot → `.audit/B2/beehiiv-test-import.png`.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>RSS feed live at `/rss.xml` on preview or prod deployment; Beehiiv account logged in; B1.3 domain decision locked.</prerequisites>
  <execute>curl -s https://withagents.dev/rss.xml | tee evidence/phase-B2/vg-5-rss.xml | xmllint --noout - && echo "XML_PARSE_OK" | tee -a evidence/phase-B2/vg-5-rss-parse.log && curl -s https://withagents.dev/rss.xml | grep -c "<item>" | tee evidence/phase-B2/vg-5-item-count.txt</execute>
  <capture>evidence/phase-B2/vg-5-rss.xml (raw feed), evidence/phase-B2/vg-5-rss-parse.log (xmllint verdict), evidence/phase-B2/vg-5-item-count.txt (numeric count), .audit/B2/beehiiv-test-import.png (UI screenshot)</capture>
  <pass_criteria>`xmllint --noout` exits 0 (feed is well-formed XML). `<item>` count ≥ 5. Beehiiv UI → Automations → RSS feed shows ≥5 detected items with titles matching files under `posts/`. One manual test-import preview rendered successfully (screenshot captured at `.audit/B2/beehiiv-test-import.png`, image opens and shows formatted post body — NOT blank page). If B1.3 custom domain chosen, Beehiiv Settings → Domain shows `newsletter.withagents.dev` = Verified.</pass_criteria>
  <review>`xmllint --noout evidence/phase-B2/vg-5-rss.xml && cat evidence/phase-B2/vg-5-item-count.txt` — confirm parse OK and count ≥5; open `.audit/B2/beehiiv-test-import.png` with Read tool; confirm rendered post is visible, not an error page.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to serve a stub `rss.xml` from localhost or hand-craft a fake feed → STOP → must be the real prod/preview feed Beehiiv polls.</mock_guard>
</validation_gate>

### B2.6 — LinkedIn accounts verified

**Source:** approval-package §9, R1 §3 (LI manual paste workflow).

**Fix:** user logs into `linkedin.com`, verifies:
- Personal profile reachable, bio updated with `withagents.dev` link
- Company page `linkedin.com/company/withagents` exists OR decision noted to launch without (B1 decision gap if not already covered — document here).

**Verification:**
```bash
curl -sI https://www.linkedin.com/in/nkrzemienski/      # expect: 200
curl -sI https://www.linkedin.com/company/withagents/   # expect: 200 or documented skip
```

<validation_gate id="VG-6" blocking="true">
  <prerequisites>LinkedIn personal profile updated with `withagents.dev` link in bio; B1 decision documented whether company page ships at launch.</prerequisites>
  <execute>curl -sI https://www.linkedin.com/in/nkrzemienski/ | tee evidence/phase-B2/vg-6-linkedin-personal.txt && curl -sI https://www.linkedin.com/company/withagents/ | tee evidence/phase-B2/vg-6-linkedin-company.txt</execute>
  <capture>evidence/phase-B2/vg-6-linkedin-personal.txt, evidence/phase-B2/vg-6-linkedin-company.txt (HTTP headers)</capture>
  <pass_criteria>Personal profile: first header line contains `HTTP/2 200` (NOT 301 to login, NOT 404, NOT 999 bot-block). Company page: either `HTTP/2 200` OR explicit skip note committed at `evidence/phase-B2/vg-6-company-skip.md` with B1 decision reference. Personal profile bio (verify via logged-in browser screenshot to `evidence/phase-B2/vg-6-bio.png`) contains visible `withagents.dev` link.</pass_criteria>
  <review>`head -1 evidence/phase-B2/vg-6-linkedin-personal.txt` — verify 200; if company URL returned non-200, confirm `evidence/phase-B2/vg-6-company-skip.md` exists and cites decision.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to stub LinkedIn responses or assert success without a real `curl` → STOP → must hit linkedin.com over real internet.</mock_guard>
</validation_gate>

### B2.7 — Preview deploy → production alias swap

**Source:** R3 §2 path A.

**Fix:**
```bash
cd /Users/nick/Desktop/blog-series/withagents-site
vercel --prod                          # capture DEPLOY_URL from stdout
vercel domains add withagents.dev      # triggers SSL issuance
vercel alias set $DEPLOY_URL withagents.dev
vercel alias set $DEPLOY_URL www.withagents.dev
```

Wait for `curl -sI https://withagents.dev/` to return 200 with valid SSL (cert issuance typically 2–10 min post-DNS-propagation).

**Verification:**
```bash
curl -sI https://withagents.dev/ | head -1
# expect: HTTP/2 200
openssl s_client -servername withagents.dev -connect withagents.dev:443 </dev/null 2>/dev/null | openssl x509 -noout -dates
# expect: notAfter date ≥ 60 days from now
```

<validation_gate id="VG-7" blocking="true">
  <prerequisites>VG-1 (DNS) PASS; VG-2 (env vars) PASS; Vercel CLI authenticated; `withagents-site` linked.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series/withagents-site && vercel --prod 2>&1 | tee evidence/phase-B2/vg-7-deploy.log && DEPLOY_URL=$(grep -oE 'https://[a-z0-9-]+\.vercel\.app' evidence/phase-B2/vg-7-deploy.log | head -1) && vercel alias set $DEPLOY_URL withagents.dev && vercel alias set $DEPLOY_URL www.withagents.dev && sleep 120 && curl -sI https://withagents.dev/ | tee evidence/phase-B2/vg-7-apex-headers.txt && openssl s_client -servername withagents.dev -connect withagents.dev:443 </dev/null 2>/dev/null | openssl x509 -noout -dates | tee evidence/phase-B2/vg-7-cert.txt && echo $DEPLOY_URL > .audit/B2/last-known-good.txt</execute>
  <capture>evidence/phase-B2/vg-7-deploy.log (full deploy output), evidence/phase-B2/vg-7-apex-headers.txt (HTTP headers), evidence/phase-B2/vg-7-cert.txt (notBefore/notAfter dates), .audit/B2/last-known-good.txt (rollback target)</capture>
  <pass_criteria>First line of `vg-7-apex-headers.txt` is exactly `HTTP/2 200`. Response headers include `strict-transport-security` (HSTS live). `notAfter=` date parses to ≥ 60 days from today (verified via `date -d` or manual compare). `.audit/B2/last-known-good.txt` contains a `*.vercel.app` URL for rollback.</pass_criteria>
  <review>`head -1 evidence/phase-B2/vg-7-apex-headers.txt` and `grep notAfter evidence/phase-B2/vg-7-cert.txt` — confirm 200 + cert validity window ≥60 days.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to assert success from the deploy log alone without hitting the apex over HTTPS → STOP → real 200 + real SSL cert dates required.</mock_guard>
</validation_gate>

### B2.8 — Full 18-item smoke matrix against prod alias

**Source:** R3 §3 + §4.1 Playwright script.

**Fix:** run the Playwright smoke once the prod alias is live.

```bash
cd /Users/nick/Desktop/blog-series/withagents-site
pnpm add -D @playwright/test
pnpm exec playwright install chromium
SMOKE_BASE=https://withagents.dev pnpm exec playwright test tests/smoke.spec.ts --reporter=list
```

Save HTML report → `.audit/B2/smoke-playwright-report/`. Screenshot any failures. Every S1–S18 must pass. If one fails: fix via A-track (revert to A3), re-run, do NOT proceed to B3 with any red.

**Verification:** Playwright exits 0. `.audit/B2/smoke-report.txt` contains `18 passed`.

<validation_gate id="VG-8" blocking="true">
  <prerequisites>VG-7 (prod alias) PASS; Playwright installed via `pnpm add -D @playwright/test`; Chromium downloaded via `pnpm exec playwright install chromium`; `tests/smoke.spec.ts` present with exactly 18 S1–S18 cases. NOTE: This is a PROTECTED gate — functional smoke against the real production domain. No stubs allowed.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series/withagents-site && SMOKE_BASE=https://withagents.dev pnpm exec playwright test tests/smoke.spec.ts --reporter=list 2>&1 | tee evidence/phase-B2/vg-8-smoke.log && pnpm exec playwright show-report --host 0.0.0.0 &>/dev/null & cp -r playwright-report .audit/B2/smoke-playwright-report/</execute>
  <capture>evidence/phase-B2/vg-8-smoke.log (full stdout with per-test PASS/FAIL lines), .audit/B2/smoke-playwright-report/ (HTML report directory)</capture>
  <pass_criteria>Stdout contains the exact string `18 passed` (derived from Playwright list reporter summary line, e.g. `  18 passed (45s)`). Zero occurrences of `failed`, `flaky`, or `timed out` in the summary. Playwright process exit code is 0 (verify with `$?` immediately after run). HTML report at `.audit/B2/smoke-playwright-report/index.html` exists and opens.</pass_criteria>
  <review>`grep -E '([0-9]+) passed' evidence/phase-B2/vg-8-smoke.log | tail -1` must return a line with `18 passed`; `grep -cE 'failed|timed out|flaky' evidence/phase-B2/vg-8-smoke.log` must return 0.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run (revert via A3 if a smoke case fails; do NOT mark B2 closed with any red).</verdict>
  <mock_guard>IF tempted to mock the Playwright runner, set `SMOKE_BASE` to a local dev server, or hand-edit `vg-8-smoke.log` to show "18 passed" → STOP → the smoke MUST execute against `https://withagents.dev` and produce the "18 passed" string organically.</mock_guard>
</validation_gate>

### B2.9 — Slack `#launch` channel + webhook (if B1.6 chose slack)

**Source:** B1.6 decision.

**Fix:** create channel `#launch` in `withagents` Slack workspace. Add incoming-webhook integration → copy URL → save to `~/.syndication.env` as `SLACK_WEBHOOK_URL=...`. Invite `krzemienski@gmail.com` account.

**Verification:**
```bash
source ~/.syndication.env
curl -sS -X POST -H 'Content-Type: application/json' \
  -d '{"text":"B2.9 #launch channel wired — ready for Day 1"}' "$SLACK_WEBHOOK_URL"
# expect: ok
```

Message appears in `#launch` within 5 seconds.

<validation_gate id="VG-9" blocking="true">
  <prerequisites>B1.6 decision = slack (if other, mark this gate N/A and document in `evidence/phase-B2/vg-9-na.md`); `#launch` channel created in `withagents` workspace; incoming-webhook integration added; `SLACK_WEBHOOK_URL` saved in `~/.syndication.env` (chmod 600).</prerequisites>
  <execute>source ~/.syndication.env && curl -sS -X POST -H 'Content-Type: application/json' -d '{"text":"B2.9 #launch channel wired — ready for Day 1"}' "$SLACK_WEBHOOK_URL" | tee evidence/phase-B2/vg-9-slack-response.txt</execute>
  <capture>evidence/phase-B2/vg-9-slack-response.txt (raw Slack webhook response body), evidence/phase-B2/vg-9-slack-screenshot.png (UI screenshot showing the message in #launch with timestamp)</capture>
  <pass_criteria>`vg-9-slack-response.txt` contains exactly the 2-character string `ok` (Slack's webhook ACK — NOT `200`, NOT a JSON blob, NOT empty). Screenshot captured within 5 seconds of curl shows the message "B2.9 #launch channel wired — ready for Day 1" posted by the webhook integration, visible in the `#launch` channel timeline.</pass_criteria>
  <review>`cat evidence/phase-B2/vg-9-slack-response.txt` must print `ok`; open `evidence/phase-B2/vg-9-slack-screenshot.png` with Read tool and confirm the message is visible in the Slack UI.</review>
  <verdict>PASS → proceed | FAIL → fix real system → re-run</verdict>
  <mock_guard>IF tempted to simulate Slack via a local echo server, or treat HTTP 200 alone as success → STOP → Slack returns literal `ok` on webhook success; capture that string as real evidence.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| DNS records @ registrar | B2 user action | none |
| Vercel env vars (Production scope) | B2 | none |
| `scripts/syndication/supabase/consult-schema.sql` (NEW) | B2 | none |
| `~/.syndication.env` (local, gitignored) | B2 | read by B3 daily runbook |
| `.audit/B2/*` | B2 | verification artifacts only |
| Beehiiv dashboard config | B2 user action | none |
| Slack workspace config | B2 user action | none |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DNS propagation >48h → launch-date slip | MED | HIGH | B2.1 executed Day -5; 4 full days for prop. If still red Day -1, push launch +1 week |
| Vercel env var added to wrong scope (Preview) | MED | HIGH | verification diff at B2.2 catches it; fix = `vercel env rm` + re-add |
| Supabase service-role key leaks into git | LOW | CRITICAL | key only in Vercel UI + `~/.syndication.env` (gitignored); pre-commit hook greps `eyJ` pattern |
| Beehiiv custom-domain CNAME mis-set | MED | MED | fall back to hosted subdomain (B1.3 alt); Beehiiv UI shows verification status |
| Playwright smoke fails on 1+ item | MED | HIGH | revert to A3 owner (executor), fix root cause, re-run; do NOT skip failed items |
| SSL cert stuck issuing | LOW | HIGH | contact Vercel support via dashboard; parallel plan = keep preview URL + redirect |
| Slack webhook URL leaks via log capture | LOW | MED | webhook URL treated as secret; never echo in `set -x` contexts |

## Acceptance criteria

- [ ] All 4 DNS records verified via `dig` (+ 1 beehiiv CNAME if custom)
- [ ] Beehiiv DKIM CNAME + SPF TXT + DMARC TXT verified; Beehiiv dashboard Sending → Domain = Verified
- [ ] All 8 Vercel env vars present in Production scope (incl. BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID), absent from Preview
- [ ] `withagents.dev` registered in Plausible, realtime API returns 200
- [ ] `syndication_log` + `consultant_inquiries` tables live, test insert + delete round-trips
- [ ] Beehiiv RSS feed subscribed to `https://withagents.dev/rss.xml`, one manual test-import screenshotted
- [ ] LinkedIn personal profile reachable; company page reachable or explicit skip documented
- [ ] Prod alias `https://withagents.dev/` returns 200 with valid SSL
- [ ] Playwright smoke: 18 passed, 0 failed
- [ ] If Slack: webhook round-trip `ok`, message appears in `#launch`
- [ ] `~/.syndication.env` contains all required vars (chmod 600)

## Verification steps

Day -1 pre-go/no-go green-light check (exit 0 on success):
```bash
set -e
cat /Users/nick/Desktop/blog-series/.launch-date
for r in "withagents.dev A" "www.withagents.dev CNAME" "withagents.dev CAA" "_vercel.withagents.dev TXT"; do dig +short $r; done
curl -sI https://withagents.dev/ | head -1
cd /Users/nick/Desktop/blog-series/withagents-site && vercel env ls | grep Production
psql "$SUPABASE_DB_URL" -c "\dt syndication_log consultant_inquiries"
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/stats/realtime/visitors?site_id=withagents.dev"
SMOKE_BASE=https://withagents.dev pnpm exec playwright test tests/smoke.spec.ts --reporter=list
curl -sS -X POST -H 'Content-Type: application/json' -d '{"text":"B2 green-light"}' "$SLACK_WEBHOOK_URL"
```

## Rollback

- DNS: revert via registrar UI; propagation 5–60 min.
- Vercel env: `vercel env rm <NAME> production`.
- Supabase: `DROP TABLE consultant_inquiries` (syndication_log keep — referenced by history).
- Prod alias: `vercel alias rm withagents.dev` → reverts to last stable deployment URL; users hit 404 on apex until re-aliased. Keep prior deploy URL pinned in `.audit/B2/last-known-good.txt` for instant `vercel alias set $LKG withagents.dev`.
- Beehiiv: delete RSS automation; subscribers remain.
- Slack: archive `#launch` channel (reversible).

<gate_manifest>
  <total_gates>9</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7 → VG-8 → VG-9</sequence>
  <policy>All gates BLOCKING.</policy>
  <evidence_dir>evidence/phase-B2/</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix; no skip-forward.</regression>
</gate_manifest>
