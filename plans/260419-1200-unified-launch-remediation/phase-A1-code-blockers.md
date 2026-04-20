# Phase A1 — Code Blockers (10 items)

**Owner:** Sonnet executor (single session, sequential edits)
**Effort:** 15–19h
**Status:** pending
**Blocks:** A3 (functional validation), B2 (pre-push infra), all of Track B, C1 (B1.8), C3 (B1.10)

## Context

Reflexion (`plans/reports/remediation-260419-1146-final-push.md`) + R1 (Phase 12 mechanics) + R3 (deploy) surfaced 7 code-level blockers. All must land before any Vercel preview deploy is smoke-tested.

Source files:
- `scripts/syndication/scheduler/runner.ts`
- `withagents-site/keystatic.config.ts`
- `withagents-site/src/pages/api/og.png.ts`
- `withagents-site/src/layouts/BaseLayout.astro`
- `withagents-site/src/pages/404.astro` (MISSING — create)
- `withagents-site/src/pages/rss.xml.ts`

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Blockers

### B1.1 — X channel never publishes (runner.ts:254–304)

**Defect:** X dispatch path returns `ok` after confirming `.x.md` file exists. Never calls `postThread()`. No thread posts.

**Decision:** per locked decision #1, X API Basic tier not viable. **Remove the X channel from runner.ts entirely** and document manual/Typefully flow. Simpler than wiring + paying $200/mo.

**Fix:**
- Delete X dispatch block `runner.ts:254–304`.
- In `dispatchDay()`, skip X with reason `"manual_channel"` logged to Supabase.
- Add to `scripts/syndication/README.md`: "X threads are posted manually or via Typefully; runner does not dispatch."

**Verification:** `pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run` reports `x: skipped (manual_channel)`, no code paths invoke twitter-api-v2.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>pnpm installed; `scripts/syndication/scheduler/runner.ts` present; `.env` with `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` or dry-run compatible defaults; repo at `/Users/nick/Desktop/blog-series`.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run 2>&1 | tee evidence/phase-A1/vg-1-runner-x-skip.log</execute>
  <capture>evidence/phase-A1/vg-1-runner-x-skip.log</capture>
  <pass_criteria>Exit code = 0 AND log contains literal string `x: skipped (manual_channel)` AND `grep -c 'twitter-api-v2' evidence/phase-A1/vg-1-runner-x-skip.log` = 0 AND `grep -c 'postThread' scripts/syndication/scheduler/runner.ts` = 0.</pass_criteria>
  <review>`cat evidence/phase-A1/vg-1-runner-x-skip.log` then `grep -n 'x: skipped' evidence/phase-A1/vg-1-runner-x-skip.log` and `grep -n 'postThread\|twitter-api-v2' scripts/syndication/scheduler/runner.ts`.</review>
  <verdict>PASS → proceed to VG-2 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to stub the X dispatch path with a fake `ok` response instead of deleting the block → STOP → delete real code.</mock_guard>
</validation_gate>

### B1.2 — Supabase channel-name CHECK mismatch (runner.ts:387–395)

**Defect:** INSERTs pass raw `"linkedin"|"x"|"readme"`; schema CHECK requires `"linkedin_article"|"x_thread"|"readme_patch"`. Every row fails.

**Fix:** add mapper helper in `runner.ts`:
```ts
const CHANNEL_DB_NAME: Record<string, string> = {
  linkedin: 'linkedin_article',
  x: 'x_thread',
  readme: 'readme_patch',
};
const STATUS_DB_NAME: Record<string, string> = {
  ok: 'posted',
  error: 'error',
  skipped: 'skipped',
};
```
Use these at every Supabase insert site.

**X-row cascade fix (HS-3 mitigation):** even though A1.1 removes `postThread()`, runner.ts MUST still INSERT an `x_thread` row per publishing day with `status='skipped', error_message='manual_channel'`. This preserves referential integrity for B3.7 manual UPDATE path and B5 metrics aggregation. Insert at `dispatchDay()` after the skip branch fires.

**.linkedin-article-log.md / .x-capture-log.md hook:** add a post-hoc capture hook — when Nick pastes a published X URL into `plans/phase-12-evidence/day-$N/x-url.txt`, a helper `scripts/syndication/capture-x-url.sh day-N` runs `UPSERT ON CONFLICT (slug, channel)` against `syndication_log` to fill the `response_url` and flip `status='posted'` on the pre-existing skipped row. Never INSERT a second row for same (slug, channel) pair.

**Verification:** `psql $SUPABASE_URL -c "SELECT channel, status FROM syndication_log ORDER BY posted_at DESC LIMIT 5"` returns only schema-valid enums. Every publishing day has exactly 1 row per channel (linkedin_article|x_thread|readme_patch) with X default status='skipped' pre-capture and 'posted' post-capture.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>Supabase reachable: `pg_isready -d "$SUPABASE_URL" -q || exit 1`; `syndication_log` table exists; runner mapper shipped; `capture-x-url.sh` present.</prerequisites>
  <execute>psql "$SUPABASE_URL" -c "SELECT channel, status FROM syndication_log ORDER BY posted_at DESC LIMIT 5" 2>&1 | tee evidence/phase-A1/vg-2-channel-enums.log && bash scripts/syndication/capture-x-url.sh day-1 2>&1 | tee evidence/phase-A1/vg-2-capture-x.log</execute>
  <capture>evidence/phase-A1/vg-2-channel-enums.log, evidence/phase-A1/vg-2-capture-x.log</capture>
  <pass_criteria>All returned `channel` values match regex `^(linkedin_article|x_thread|readme_patch)$` AND all `status` values match `^(posted|error|skipped)$` AND no row has raw `linkedin|x|readme` AND duplicate check `psql "$SUPABASE_URL" -c "SELECT slug, channel, COUNT(*) FROM syndication_log GROUP BY 1,2 HAVING COUNT(*) > 1"` returns 0 rows.</pass_criteria>
  <review>`cat evidence/phase-A1/vg-2-channel-enums.log` and verify each row visually against the enum list; run the GROUP BY duplicate query and confirm empty result set.</review>
  <verdict>PASS → proceed to VG-3 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to hand-edit `syndication_log` rows to match the enum instead of fixing the runner mapper → STOP → fix runner.ts.</mock_guard>
</validation_gate>

### B1.3 — Keystatic local-mode breaks in serverless (keystatic.config.ts:4)

**Defect:** `storage: { kind: 'local' }` writes to ephemeral serverless FS. Edits lost on cold start.

**Fix (KISS path — recommended):** gate the admin route.
```astro
// src/pages/keystatic/[...params].astro
export const prerender = false;
// top of frontmatter:
if (import.meta.env.PROD && !import.meta.env.KEYSTATIC_ENABLED) {
  return Astro.redirect('/', 308);
}
```
Edit MDX via git commits; reintroduce GitHub-mode later if CMS UI is needed.

**Fallback (GitHub-mode):** if user chooses, swap to `kind: 'github'` with `repo: { owner: 'krzemienski', name: 'withagents' }`, install Keystatic GitHub App, add `KEYSTATIC_GITHUB_CLIENT_ID/SECRET/KEYSTATIC_SECRET` env vars on Vercel.

**Verification:** `curl -I https://<preview-url>/keystatic/` → 308 to `/` in prod; admin loads locally.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>Vercel preview URL captured to `$PREVIEW` env var; `until curl -sfI "$PREVIEW/" >/dev/null; do sleep 2; done` succeeds; local dev server spawnable with `pnpm dev`.</prerequisites>
  <execute>curl -sI "$PREVIEW/keystatic/" 2>&1 | tee evidence/phase-A1/vg-3-keystatic-prod.log && (pnpm --dir withagents-site dev &) && sleep 5 && curl -sI http://localhost:4321/keystatic/ 2>&1 | tee evidence/phase-A1/vg-3-keystatic-local.log</execute>
  <capture>evidence/phase-A1/vg-3-keystatic-prod.log, evidence/phase-A1/vg-3-keystatic-local.log</capture>
  <pass_criteria>Prod log first line matches `HTTP/[12](\.[01])? 308` AND contains `location: /` (or `Location: /`); local log first line matches `HTTP/[12](\.[01])? 200`.</pass_criteria>
  <review>`grep -E '^HTTP|^location|^Location' evidence/phase-A1/vg-3-keystatic-*.log`</review>
  <verdict>PASS → proceed to VG-4 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to disable the admin route entirely instead of gating it → STOP → fix the env-gated redirect.</mock_guard>
</validation_gate>

### B1.4 — OG endpoint font self-fetch bootstrap (og.png.ts)

**Defect:** edge function fetches `https://withagents.dev/fonts/*` at cold start. On first deploy the domain isn't resolvable → 500.

**Fix:** inline fonts as base64 ArrayBuffer.
```ts
// src/lib/og-fonts.ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const FONTS_DIR = fileURLToPath(new URL('../../public/fonts', import.meta.url));
export const SPACE_GROTESK_BOLD = readFileSync(`${FONTS_DIR}/SpaceGrotesk-Bold.ttf`);
export const JETBRAINS_MONO = readFileSync(`${FONTS_DIR}/JetBrainsMono-Regular.ttf`);
```
Import into `og.png.ts`; pass to Satori's `fonts[]` directly. Verify bundle size <1MB (Vercel Edge cap).

**Verification:** `curl -I "<preview>/api/og.png?title=Smoke&kind=essay"` → 200, `Content-Type: image/png`, `file -b /tmp/og.png` shows `1200 x 630`.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>`$PREVIEW` set; OG endpoint deployed; `until curl -sfI "$PREVIEW/" >/dev/null; do sleep 2; done`; `withagents-site/src/lib/og-fonts.ts` committed; bundle size check `du -k withagents-site/.vercel/output/functions/api/og.png.func/ 2>/dev/null | tail -1`.</prerequisites>
  <execute>curl -sI "$PREVIEW/api/og.png?title=Smoke&kind=essay" 2>&1 | tee evidence/phase-A1/vg-4-og-headers.log && curl -sL "$PREVIEW/api/og.png?title=Smoke&kind=essay" -o evidence/phase-A1/vg-4-og.png && file -b evidence/phase-A1/vg-4-og.png | tee evidence/phase-A1/vg-4-og-file.log</execute>
  <capture>evidence/phase-A1/vg-4-og-headers.log, evidence/phase-A1/vg-4-og.png, evidence/phase-A1/vg-4-og-file.log</capture>
  <pass_criteria>Header log contains `HTTP/[12](\.[01])? 200` AND `content-type: image/png` (case-insensitive); file log contains `PNG image data` AND `1200 x 630`; `evidence/phase-A1/vg-4-og.png` size > 10000 bytes.</pass_criteria>
  <review>`grep -iE '^HTTP|content-type' evidence/phase-A1/vg-4-og-headers.log` then `cat evidence/phase-A1/vg-4-og-file.log` and open `vg-4-og.png` via Read tool.</review>
  <verdict>PASS → proceed to VG-5 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to replace the image with a hardcoded placeholder PNG instead of fixing the font-inline bootstrap → STOP → fix og-fonts.ts.</mock_guard>
</validation_gate>

### B1.5 — Plausible hardcoded domain (BaseLayout.astro:71)

**Defect:** `data-domain="withagents.dev"` fires even on preview URLs → pollutes prod stats.

**Fix:**
```astro
---
const plausibleDomain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN;
const vercelEnv = import.meta.env.VERCEL_ENV ?? 'development';
const enablePlausible = import.meta.env.PROD && vercelEnv === 'production' && plausibleDomain;
---
{enablePlausible && (
  <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
)}
```
Set `PUBLIC_PLAUSIBLE_DOMAIN=withagents.dev` only on Production scope in Vercel.

**Verification:** `curl -s https://withagents.dev/ | grep plausible` → 1 match; `curl -s <preview-url>/ | grep plausible` → 0 matches.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>`$PREVIEW` set; prod alias `https://withagents.dev/` live; `until curl -sf "$PREVIEW/" >/dev/null; do sleep 2; done` AND `until curl -sf https://withagents.dev/ >/dev/null; do sleep 2; done`; Vercel env var `PUBLIC_PLAUSIBLE_DOMAIN` scoped to Production only.</prerequisites>
  <execute>curl -s https://withagents.dev/ > evidence/phase-A1/vg-5-prod.html && curl -s "$PREVIEW/" > evidence/phase-A1/vg-5-preview.html && grep -c 'plausible' evidence/phase-A1/vg-5-prod.html > evidence/phase-A1/vg-5-prod-count.txt && grep -c 'plausible' evidence/phase-A1/vg-5-preview.html > evidence/phase-A1/vg-5-preview-count.txt</execute>
  <capture>evidence/phase-A1/vg-5-prod.html, evidence/phase-A1/vg-5-preview.html, evidence/phase-A1/vg-5-prod-count.txt, evidence/phase-A1/vg-5-preview-count.txt</capture>
  <pass_criteria>`cat evidence/phase-A1/vg-5-prod-count.txt` >= 1 AND `cat evidence/phase-A1/vg-5-preview-count.txt` = 0.</pass_criteria>
  <review>`cat evidence/phase-A1/vg-5-*-count.txt` then `grep -n plausible evidence/phase-A1/vg-5-prod.html` confirms one tag, `grep -n plausible evidence/phase-A1/vg-5-preview.html` returns nothing.</review>
  <verdict>PASS → proceed to VG-6 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to delete the Plausible tag entirely to force zero matches on preview → STOP → fix the env-gated render condition.</mock_guard>
</validation_gate>

### B1.6 — Missing 404.astro

**Defect:** no `src/pages/404.astro`. Unknown routes fall back to Vercel default.

**Fix:** minimal branded 404.
```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Not found — withagents.dev" description="This page does not exist.">
  <main class="mx-auto max-w-2xl px-6 py-24 text-slate-200">
    <h1 class="text-5xl font-semibold">404</h1>
    <p class="mt-4 text-lg">The page you're looking for isn't here.</p>
    <a href="/" class="mt-6 inline-block text-indigo-400 underline">Back to home</a>
    <a href="/writing/" class="mt-2 inline-block text-indigo-400 underline">Browse the writing archive</a>
  </main>
</BaseLayout>
```

**Verification:** `curl -I https://<preview>/writing/nonexistent-slug/` → 404 + HTML contains "404".

<validation_gate id="VG-6" blocking="true">
  <prerequisites>`$PREVIEW` set; `until curl -sfI "$PREVIEW/" >/dev/null; do sleep 2; done`; `withagents-site/src/pages/404.astro` committed; build completed without errors.</prerequisites>
  <execute>curl -sI "$PREVIEW/writing/nonexistent-slug/" 2>&1 | tee evidence/phase-A1/vg-6-404-headers.log && curl -s "$PREVIEW/writing/nonexistent-slug/" > evidence/phase-A1/vg-6-404-body.html</execute>
  <capture>evidence/phase-A1/vg-6-404-headers.log, evidence/phase-A1/vg-6-404-body.html</capture>
  <pass_criteria>Headers first line matches `HTTP/[12](\.[01])? 404`; body contains literal `404` AND contains `Back to home` (branded template marker); body references `BaseLayout` structural elements (e.g., `<main`) via `grep -c '<main' evidence/phase-A1/vg-6-404-body.html` >= 1.</pass_criteria>
  <review>`grep -E '^HTTP' evidence/phase-A1/vg-6-404-headers.log` and `grep -E '404|Back to home|<main' evidence/phase-A1/vg-6-404-body.html`.</review>
  <verdict>PASS → proceed to VG-7 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to add a static redirect or a Vercel rewrite rule instead of creating `404.astro` → STOP → ship the real page component.</mock_guard>
</validation_gate>

### B1.7 — RSS route dynamic (rss.xml.ts) — verify static emission

**Defect:** route is `.ts` (dynamic endpoint). Approval-package asserts `/rss.xml` serves statically. Needs verification, not necessarily conversion.

**Fix:** Inspect. If `export const prerender = true` is present and build emits `dist/client/rss.xml`, leave as-is. If dynamic-only, add `export const prerender = true` at top of `rss.xml.ts`.

**Verification:** post-build `ls withagents-site/dist/client/rss.xml` exists, `xmllint --noout` passes, `curl -I <preview>/rss.xml` returns `Content-Type: application/rss+xml` or `application/xml`.

<validation_gate id="VG-7" blocking="true">
  <prerequisites>`$PREVIEW` set; `pnpm --dir withagents-site build` completed; `xmllint` binary available (`command -v xmllint || exit 1`); `until curl -sfI "$PREVIEW/rss.xml" >/dev/null; do sleep 2; done`.</prerequisites>
  <execute>ls -la withagents-site/dist/client/rss.xml 2>&1 | tee evidence/phase-A1/vg-7-rss-static-file.log && xmllint --noout withagents-site/dist/client/rss.xml 2>&1 | tee evidence/phase-A1/vg-7-rss-xmllint.log; echo "xmllint exit=$?" >> evidence/phase-A1/vg-7-rss-xmllint.log && curl -sI "$PREVIEW/rss.xml" 2>&1 | tee evidence/phase-A1/vg-7-rss-headers.log</execute>
  <capture>evidence/phase-A1/vg-7-rss-static-file.log, evidence/phase-A1/vg-7-rss-xmllint.log, evidence/phase-A1/vg-7-rss-headers.log</capture>
  <pass_criteria>Static file log shows non-zero size for `dist/client/rss.xml`; xmllint log contains `xmllint exit=0` AND no `parser error`; headers log matches `HTTP/[12](\.[01])? 200` AND `content-type:` matches `application/(rss\+xml|xml)` (case-insensitive).</pass_criteria>
  <review>`cat evidence/phase-A1/vg-7-rss-*.log` — confirm all three show expected outputs.</review>
  <verdict>PASS → proceed to VG-8 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to generate rss.xml offline and commit it as a static file rather than enabling `prerender = true` → STOP → fix the route export.</mock_guard>
</validation_gate>

### B1.8 — Missing `scripts/syndication/linkedin/article-prep.ts` (referenced in B3.4)

**Defect:** B3.4 runbook calls `pnpm tsx scripts/syndication/linkedin/article-prep.ts day-$N-<slug>` — file never created. B3.4 cannot execute Day 1.

**Effort:** 2h

**Fix:** create the file. Spec:

```ts
// scripts/syndication/linkedin/article-prep.ts
// Reads day-NN-<slug>.linkedin.md sidecar, emits pasteable LinkedIn Article payload.
// Usage: pnpm tsx scripts/syndication/linkedin/article-prep.ts day-NN-<slug>
//
// Output:
//   stdout: JSON { title, body, firstCommentUrl, hashtags }
//   opens browser: https://www.linkedin.com/pulse/new-article/?title=<encoded>
//   copies body to clipboard (pbcopy on macOS)
//
// Reads:
//   withagents-site/src/content/posts/<slug>.linkedin.md (frontmatter + body)
//   scripts/syndication/hashtag-map.json (tertiary tag for post)
//   .launch-date (for canonical URL UTM campaign: day$N)
//
// Produces first-comment template:
//   "Full essay + code: https://withagents.dev/writing/<slug>/?utm_source=linkedin&utm_medium=social&utm_campaign=day<NN>"
```

Strip frontmatter (YAML between `---` fences), preserve body as LinkedIn plain text (no MDX-specific syntax — flatten code fences to indent-4, strip Mermaid fenced blocks with `[diagram: see blog post]` placeholder).

**Verification:**
```bash
pnpm tsx scripts/syndication/linkedin/article-prep.ts day-01-validationforge-ga | jq .title
# expect: string (post title)
pbpaste | head -5  # body preview copied to clipboard
```

<validation_gate id="VG-8" blocking="true">
  <prerequisites>`scripts/syndication/linkedin/article-prep.ts` committed; `withagents-site/src/content/posts/day-01-validationforge-ga.linkedin.md` exists; `jq` and `pbpaste` available (macOS); `scripts/syndication/hashtag-map.json` present.</prerequisites>
  <execute>pnpm tsx scripts/syndication/linkedin/article-prep.ts day-01-validationforge-ga > evidence/phase-A1/vg-8-article-prep.json 2> evidence/phase-A1/vg-8-article-prep.err && pbpaste > evidence/phase-A1/vg-8-clipboard.txt</execute>
  <capture>evidence/phase-A1/vg-8-article-prep.json, evidence/phase-A1/vg-8-article-prep.err, evidence/phase-A1/vg-8-clipboard.txt</capture>
  <pass_criteria>`jq -e '.title | type == "string" and length > 0' evidence/phase-A1/vg-8-article-prep.json` returns `true` AND `jq -e '.body | type == "string" and length > 100' evidence/phase-A1/vg-8-article-prep.json` returns `true` AND `jq -e '.firstCommentUrl | test("^https://withagents.dev/writing/.*utm_campaign=day01")' evidence/phase-A1/vg-8-article-prep.json` returns `true` AND `wc -c < evidence/phase-A1/vg-8-clipboard.txt` > 100.</pass_criteria>
  <review>`jq . evidence/phase-A1/vg-8-article-prep.json` and `head -20 evidence/phase-A1/vg-8-clipboard.txt`.</review>
  <verdict>PASS → proceed to VG-9 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to hardcode the title/body strings in the script rather than parsing the sidecar frontmatter → STOP → parse the real file.</mock_guard>
</validation_gate>

### B1.9 — Missing audit scripts referenced by A5.2/A5.4

**Defect:** `phase-A5.md:A5.2` runs `pnpm tsx scripts/audit/keyword-position.ts`; `A5.4` runs `pnpm tsx scripts/audit/readability.ts`. Neither script exists. A5 cannot verify.

**Effort:** 2h

**Fix:** create both:

`scripts/audit/keyword-position.ts` (~60 lines):
- Reads every `day-NN-*.mdx` frontmatter, extracts `keywords[0]` (primary).
- Strips frontmatter + code fences; counts words in body.
- Finds first position of `keywords[0]` (case-insensitive).
- FAIL if position > `--max-position` (default 100). Exit non-zero on any FAIL.

`scripts/audit/readability.ts` (~50 lines):
- Takes glob argument (e.g., `day-20-*.mdx`).
- Strips frontmatter + code fences.
- Computes Flesch Reading Ease score (classic formula: 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)).
- Syllables via simple vowel-cluster heuristic (adequate for polysyllabic-flag detection).
- Prints `<file>: Flesch=<score>`. Exit non-zero if score < 50 (default threshold).

**Verification:** run against current 45 MDX files; both scripts exit 0 after A5 polish.

<validation_gate id="VG-9" blocking="true">
  <prerequisites>`scripts/audit/keyword-position.ts` and `scripts/audit/readability.ts` committed; `withagents-site/src/content/posts/day-*.mdx` glob matches current arc (45 files expected); `pnpm tsx` available.</prerequisites>
  <execute>pnpm tsx scripts/audit/keyword-position.ts 'withagents-site/src/content/posts/day-*.mdx' --max-position 100 2>&1 | tee evidence/phase-A1/vg-9-keyword-position.log; echo "kp_exit=$?" >> evidence/phase-A1/vg-9-keyword-position.log && pnpm tsx scripts/audit/readability.ts 'withagents-site/src/content/posts/day-*.mdx' 2>&1 | tee evidence/phase-A1/vg-9-readability.log; echo "rd_exit=$?" >> evidence/phase-A1/vg-9-readability.log</execute>
  <capture>evidence/phase-A1/vg-9-keyword-position.log, evidence/phase-A1/vg-9-readability.log</capture>
  <pass_criteria>Keyword log contains `kp_exit=0`; readability log contains `rd_exit=0`; readability log contains at least 40 lines matching `Flesch=` (one per MDX file); no line in either log contains `Error:` or `Traceback`.</pass_criteria>
  <review>`tail -5 evidence/phase-A1/vg-9-*.log` then `grep -c 'Flesch=' evidence/phase-A1/vg-9-readability.log`.</review>
  <verdict>PASS → proceed to VG-10 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to lower the Flesch threshold below 50 or skip files that fail instead of rewriting the prose → STOP → revise posts until scores pass.</mock_guard>
</validation_gate>

### B1.10 — Missing `/consulting/` landing page (referenced by C3.2 PH Launch #2)

**Defect:** C3.2 (PH Launch #2 Day 35–40) submits `withagents.dev/consulting/` as the consulting-practice product URL. Route does not exist in `withagents-site/src/pages/`.

**Effort:** 3h

**Fix:** create `withagents-site/src/pages/consulting.astro` — single-page consulting landing. Sections:

1. **Hero:** one-line value prop ("Embedded agentic-development consulting for engineering teams"); primary CTA to Calendly.
2. **What I do:** 3 bullets (audit, pair, enable) — from `/work/` page content if it exists, otherwise written fresh; no fabrication.
3. **Evidence:** link to 3 flagship posts; Plausible-referenced metrics if available (else omit section entirely — no placeholder numbers).
4. **How to work together:** 2 engagement modes (short audit, embedded pair-week). Pricing: "by scope — book a call."
5. **Book a call:** embedded Calendly or link to `$CALENDLY_URL`.
6. **Footer:** email to `NICK_INQUIRY_EMAIL`.

Reuse `BaseLayout.astro`, Midnight Observatory tokens, `/api/og.png?title=Consulting&kind=essay` OG image.

**Verification:**
```bash
pnpm build
curl -I https://<preview>/consulting/  # expect: 200
curl -s https://<preview>/consulting/ | grep -c 'Calendly\|calendly'  # expect: >=1
```

<validation_gate id="VG-10" blocking="true">
  <prerequisites>`withagents-site/src/pages/consulting.astro` committed; `$PREVIEW` set; `pnpm --dir withagents-site build` completed; `until curl -sfI "$PREVIEW/consulting/" >/dev/null; do sleep 2; done`; `CALENDLY_URL` env var set on Vercel.</prerequisites>
  <execute>curl -sI "$PREVIEW/consulting/" 2>&1 | tee evidence/phase-A1/vg-10-consulting-headers.log && curl -s "$PREVIEW/consulting/" > evidence/phase-A1/vg-10-consulting.html && curl -sI "$PREVIEW/api/og.png?title=Consulting&kind=essay" 2>&1 | tee evidence/phase-A1/vg-10-og-headers.log</execute>
  <capture>evidence/phase-A1/vg-10-consulting-headers.log, evidence/phase-A1/vg-10-consulting.html, evidence/phase-A1/vg-10-og-headers.log</capture>
  <pass_criteria>Consulting headers first line matches `HTTP/[12](\.[01])? 200`; `grep -ciE 'calendly' evidence/phase-A1/vg-10-consulting.html` >= 1; OG headers first line matches `HTTP/[12](\.[01])? 200` AND `content-type: image/png`; body contains expected sections: `grep -cE 'What I do|Book a call|Work with' evidence/phase-A1/vg-10-consulting.html` >= 2.</pass_criteria>
  <review>`grep -E '^HTTP|content-type' evidence/phase-A1/vg-10-*-headers.log` then `grep -iE 'calendly|book a call' evidence/phase-A1/vg-10-consulting.html`.</review>
  <verdict>PASS → proceed to VG-gate-manifest | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to link to an external consulting site rather than building the `/consulting/` route in-repo → STOP → ship the real Astro page.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `scripts/syndication/scheduler/runner.ts` | A1 | none |
| `scripts/syndication/README.md` | A1 | none |
| `withagents-site/keystatic.config.ts` | A1 | none |
| `withagents-site/src/pages/keystatic/[...params].astro` | A1 | none |
| `withagents-site/src/pages/api/og.png.ts` | A1 | none |
| `withagents-site/src/lib/og-fonts.ts` (NEW) | A1 | none |
| `withagents-site/src/layouts/BaseLayout.astro` | A1 | none |
| `withagents-site/src/pages/404.astro` (NEW) | A1 | none |
| `withagents-site/src/pages/rss.xml.ts` | A1 | read-only verify |
| `scripts/syndication/linkedin/article-prep.ts` (NEW, B1.8) | A1 | B3 consumes |
| `scripts/syndication/capture-x-url.sh` (NEW, B1.2 hook) | A1 | B3 consumes |
| `scripts/audit/keyword-position.ts` (NEW, B1.9) | A1 | A5 consumes |
| `scripts/audit/readability.ts` (NEW, B1.9) | A1 | A5 consumes |
| `withagents-site/src/pages/consulting.astro` (NEW, B1.10) | A1 | C3 consumes |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Fonts bundle pushes Edge function >1MB | MED | HIGH | subset fonts (Latin-only) via `pyftsubset`; fallback to Satori default |
| Keystatic gate redirect breaks Astro routing | LOW | MED | test locally with `VERCEL_ENV=production pnpm build` before deploy |
| 404.astro template drift from BaseLayout | LOW | LOW | visual-diff during A3 smoke |
| X removal regressses a calendar day where .x.md was the only artifact | LOW | LOW | B3 runbook documents manual post fallback |

## Acceptance criteria

- [ ] `pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run` exits 0, logs `x: skipped (manual_channel)`
- [ ] Supabase syndication_log accepts schema-mapped channel names (test insert for each channel)
- [ ] `pnpm build` in `withagents-site/` exits 0, emits 404.astro → dist, rss.xml → dist, og-fonts bundled
- [ ] Preview deploy curl checks: `/` 200, `/rss.xml` 200, `/api/og.png?title=X&kind=essay` 200, `/writing/nope` 404
- [ ] Plausible tag absent on preview, present on prod alias
- [ ] `scripts/syndication/linkedin/article-prep.ts` exists, emits title+body for day-01
- [ ] `scripts/syndication/capture-x-url.sh` upserts X rows without duplication
- [ ] `scripts/audit/keyword-position.ts` and `readability.ts` exist and exit 0 on current arc
- [ ] `/consulting/` route returns 200, embeds Calendly link, OG image 200
- [ ] Every day's `syndication_log` has row-per-channel even when X is skipped

## Verification steps

```bash
# 1. Runner dry-run
cd /Users/nick/Desktop/blog-series
pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run

# 2. Build
cd withagents-site && pnpm build && ls dist/client/404.html dist/client/rss.xml

# 3. Preview deploy
vercel  # capture preview URL → $PREVIEW

# 4. Preview smoke
curl -I $PREVIEW/
curl -I $PREVIEW/rss.xml
curl -I "$PREVIEW/api/og.png?title=Smoke&kind=essay" -o /tmp/og.png
file -b /tmp/og.png  # expect: PNG image data, 1200 x 630
curl -I $PREVIEW/writing/nonexistent-slug/
curl -s $PREVIEW/ | grep -c plausible  # 0
```

## Rollback

Per-commit atomic. If any fix destabilizes build, `git revert <sha>` for that single fix; others stand.

<gate_manifest>
  <total_gates>10</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7 → VG-8 → VG-9 → VG-10</sequence>
  <policy>All gates BLOCKING. No advancement on FAIL.</policy>
  <evidence_dir>evidence/phase-A1/</evidence_dir>
  <regression>If ANY gate FAILS: fix real system → re-run from failed gate → do NOT skip forward.</regression>
</gate_manifest>
