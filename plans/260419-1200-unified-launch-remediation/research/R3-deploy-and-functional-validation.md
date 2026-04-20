# R3 — Deploy + Functional-Validation Runbook (Day −1)

**Stack:** Astro v6.1.8 (`output: 'static'`) + `@astrojs/vercel` v10.0.4 + `@vercel/og` v0.11 + Keystatic v5 + Plausible · Target: `withagents.dev`
**Source verified:** `withagents-site/{astro.config.mjs, package.json, vercel.json, keystatic.config.ts, src/pages/api/{og.png.ts, consult.ts}, src/layouts/BaseLayout.astro}` · Phase 09 GATE 2026-04-19.

---

## 1. Pre-deploy Day −1 checklist

### 1.1 Environment variables (Vercel Project → Settings → Environment Variables)

All `import.meta.env.*` refs found in `src/pages/api/consult.ts`. None yet configured.

| Var | Scope | Purpose | Secret? |
|---|---|---|---|
| `SUPABASE_URL` | Production | `consultant_inquiries` insert target | No (URL) |
| `SUPABASE_SERVICE_KEY` | Production | service-role key (NOT anon) | **Yes** |
| `RESEND_API_KEY` | Production | inquiry email dispatch | **Yes** |
| `NICK_INQUIRY_EMAIL` | Production | recipient of inquiry notifications | No |
| `CALENDLY_URL` | Production | 303 redirect destination post-insert | No |

Implicit/Astro-managed:
- `PUBLIC_SITE_URL` — not used directly; `astro.config.mjs` hard-codes `site: 'https://withagents.dev'`. If previewing on a `vercel.app` preview URL, OG tag absolute URLs will still point at prod — acceptable for Day −1 but note for PR-preview deploys.
- `NODE_VERSION` — Vercel reads `engines.node >=22.12.0` and `volta.node=24`. Vercel will pin Node 22 or 24 depending on project settings. Verify "Node.js Version" in Project → Settings → General matches 22.x.

Preview/Dev scope (optional): mirror the above but point `CALENDLY_URL` to a sandbox slot and use Supabase staging project. Do **not** put the service key in Preview if PR branches are untrusted.

### 1.2 DNS records for `withagents.dev`

Per Vercel's apex-domain guidance (docs: "Add a domain" v2026) and the `site: 'https://withagents.dev'` declaration:

| Host | Type | Value | Notes |
|---|---|---|---|
| `@` (apex) | `A` | `76.76.21.21` | Vercel standard apex |
| `www` | `CNAME` | `cname.vercel-dns.com.` | redirects to apex |
| `@` | `CAA` | `0 issue "letsencrypt.org"` | allows Vercel SSL issuance |
| `_vercel` | `TXT` | (provided by Vercel at attach time) | domain-verification token |

Canonical is apex (`withagents.dev`); set `www → 308 → apex` in Vercel's domain UI.

### 1.3 Secrets file (`~/.env.production-only`, gitignored, local use only)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
RESEND_API_KEY=re_...
NICK_INQUIRY_EMAIL=nick@withagents.dev
CALENDLY_URL=https://calendly.com/nickk/30min
VERCEL_TOKEN=...        # used by CLI for non-interactive deploys
```

Import into Vercel: `vercel env pull ~/.env.production-only` after setting them in the dashboard, OR push via `vercel env add <name> production < value.txt`.

### 1.4 Keystatic storage swap (CRITICAL)

`keystatic.config.ts:4` currently ships `storage: { kind: 'local' }`. Deploying this to Vercel will serve a functional admin UI that writes to the **serverless filesystem** (ephemeral, non-persistent). Every cold start discards edits.

**Required before first prod deploy:**

```ts
storage: {
  kind: 'github',
  repo: { owner: 'krzemienski', name: 'withagents' },
  branchPrefix: 'keystatic/',  // optional
}
```

Prerequisites:
- GitHub repo `krzemienski/withagents` must exist (P09 GATE follow-up: "blog-series NO-REMOTE blocker"). **This is a hard blocker for Day −1 if CMS is needed.**
- Keystatic GitHub App installed on the repo (`https://github.com/apps/keystatic`).
- Add env vars `KEYSTATIC_GITHUB_CLIENT_ID` + `KEYSTATIC_GITHUB_CLIENT_SECRET` + `KEYSTATIC_SECRET` (per Keystatic v5 GitHub-mode docs).

**Alternative (KISS):** leave `kind: 'local'` and don't expose `/keystatic/` in prod; edit MDX files directly via git. This dodges the whole App-install dance if CMS UI isn't needed on Day 1. Given P09 GATE note #2 (router collision on the admin route), this is the lowest-risk path.

### 1.5 Plausible script tag injection

`src/layouts/BaseLayout.astro:71` — gated on `import.meta.env.PROD`, `data-domain="withagents.dev"` hardcoded. No env var needed. Verification:

```
curl -s https://withagents.dev/ | grep -o 'plausible.io/js/script.js'
```

Expect exactly one match. If zero, build was not production; if multiple, BaseLayout leaked duplicates.

**Side action:** create the Plausible site entry at `plausible.io/sites/new?domain=withagents.dev` **before** Day 1 so visits are captured from first render. Otherwise the script 404s silently against an unknown domain and no data accrues.

### 1.6 Pre-flight build sanity

From repo root:

```
cd withagents-site
pnpm install --frozen-lockfile
pnpm run build     # exit 0 required; must say "18 routes prerendered"
ls dist/client/writing | wc -l   # expect 1 (index) + 52 slug dirs post-P10
test -s dist/client/sitemap-index.xml
test -s dist/client/rss.xml       # ← see §4.5 below: rss route currently rss.xml.ts
```

---

## 2. First-deploy procedure

The repo has **no GitHub remote yet** (P09 GATE, approval-package §14 risk 5). Two branches:

### Path A — CLI-first (lowest coupling, recommended for Day −1)

```
cd /Users/nick/Desktop/blog-series/withagents-site
vercel login                              # once
vercel link                               # creates .vercel/project.json; pick scope "nickk"
vercel env add SUPABASE_URL production    # repeat per var in §1.1
vercel env add SUPABASE_SERVICE_KEY production
vercel env add RESEND_API_KEY production
vercel env add NICK_INQUIRY_EMAIL production
vercel env add CALENDLY_URL production
vercel --prod                             # first production build
# → wait for "Production: https://withagents-site-xxxx.vercel.app"
vercel domains add withagents.dev
vercel alias set <deployment-url> withagents.dev
vercel alias set <deployment-url> www.withagents.dev
```

Wait for SSL issuance (~2–10 min post-DNS-propagation). `curl -I https://withagents.dev/` should return `HTTP/2 200` with `x-vercel-cache` header.

### Path B — GitHub-integration (required eventually for Keystatic GitHub mode)

1. `gh repo create krzemienski/withagents --private --source=. --push` from `withagents-site/` (note: this assumes the submodule situation is reconciled — see Phase-09 follow-up).
2. In Vercel → New Project → Import `krzemienski/withagents` → root dir `/` (since repo root IS `withagents-site`).
3. Framework preset: Astro (auto-detected). Build command: `pnpm run build`. Output: `dist/`.
4. Add env vars (§1.1) during import flow.
5. Attach domain → wait for SSL.

Path B is mandatory before Keystatic GitHub-mode works. Path A is sufficient for "static render + funnel endpoint" Day −1 smoke.

### 2.1 First-build verification

```
# Build output should include:
#   Serverless Function: api/og.png (edge runtime)
#   Serverless Function: api/consult (node runtime)
#   Static: 18+ HTML routes under dist/client/
```

If `/api/og.png` is bundled as Node instead of Edge: `og.png.ts` has `export const config = { runtime: 'edge' }` — confirm Vercel honored it via the Functions tab post-deploy.

---

## 3. Post-deploy smoke tests (15-20 items)

Classified **REAL** (browser/HTTP required) vs **CURL** (shortcut-able) vs **GREP** (static inspection of `dist/`). Prefer REAL for anything user-visible; CURL/GREP acceptable for infrastructure assertions.

| # | Test | Class | Assertion |
|---|---|---|---|
| S1 | `GET /` returns 200 with `withagents` wordmark + latest 3 articles + footer | REAL | DOM contains `text=withagents`, `article[data-latest]` count ≥ 3 |
| S2 | `/writing/` lists 52 posts in strict date-desc order | REAL | 52 `WritingRow` nodes; first `time[datetime]` > second > third (…) |
| S3 | `/writing/day-01-validationforge-ga/` renders with full MDX body + OG tag | REAL | `<article>` has ≥ 500 words visible; `meta[property="og:image"]` href matches `/api/og.png?*` |
| S4 | `/work/` loads with consulting form + Calendly fallback link | REAL | `form[action="/api/consult"][method="POST"]` present; fallback anchor with `calendly.com` href |
| S5 | Form POST → `/api/consult` returns 303 to Calendly | REAL | Submit a real form; response location header matches `CALENDLY_URL` |
| S6 | `GET /api/og.png?title=Test&kind=essay` returns 1200×630 PNG | CURL | `content-type: image/png`, width=1200, height=630 (via `file -b`) |
| S7 | `/keystatic/` renders admin UI (or 404 if local-mode dropped) | REAL | Depends on §1.4 decision. Document the chosen state |
| S8 | Plausible `<script>` present in all pages | CURL | `curl / \|\| /writing \|\| /work \|\| /about` all include the tag |
| S9 | `/rss.xml` valid RSS 2.0 with 52 `<item>` entries | CURL | `xmllint --noout`; item count matches |
| S10 | `/sitemap-index.xml` present, links 52 post URLs | CURL | `grep -c "<loc>" sitemap-0.xml` ≥ 52 |
| S11 | `/writing/nonexistent` returns custom 404 | REAL | status 404, DOM matches the custom 404 template (**see §4.6 below — 404.astro does not currently exist**) |
| S12 | Mobile 375×667 viewport on `/` + `/writing/[slug]` + `/work` | REAL | No horizontal scroll; CTA buttons ≥ 44px tap target |
| S13 | Ultraviolet palette — zero arbitrary color overrides | GREP | `grep -rE "bg-\[#\|text-\[#" dist/client/**/*.html` returns 0 (per P09 GATE §3) |
| S14 | Nav highlights "writing" on `/writing` routes | REAL | `nav a[aria-current="page"]` text = "writing" |
| S15 | `/lab/` (BrandLab island) loads framer-motion interactive | REAL | Interactive element responds to click; no console errors |
| S16 | OG image for a specific post matches its title/kind params | REAL | Twitter/LI card preview via metatag rendering |
| S17 | All 52 post URLs return 200 (no broken slugs) | CURL | loop `curl -I` across sitemap URLs; expect all 200 |
| S18 | Robots, favicon, `og:url` canonical | CURL | `/robots.txt`, `/favicon.svg` serve 200 |

REAL count = 9; CURL = 8; GREP = 1. Budget ~45 min for a manual pass; ~10 min automated.

---

## 4. Playwright / Chrome DevTools MCP runbook

Both Playwright and Chrome DevTools MCP are present in `~/.claude/settings.local.json`. CDT-MCP uses CDP (Chrome DevTools Protocol) directly and is the lighter tool; Playwright is heavier but offers multi-browser assertions. The existing site was verified via **Chrome DevTools** in Phase 09 GATE §2. Prefer **Chrome DevTools MCP** for consistency.

However, for a batch-script asserting 15+ items, Playwright is the pragmatic choice because assertions + fixtures + parallel pages are first-class. Recommendation: **Playwright for the scripted runbook; Chrome DevTools MCP for interactive debugging when a test fails.**

### 4.1 Playwright smoke script (drop in `withagents-site/tests/smoke.spec.ts` — executes against prod)

```ts
// Run: pnpm exec playwright test tests/smoke.spec.ts --reporter=list
// Prereq: pnpm add -D @playwright/test && pnpm exec playwright install chromium
import { test, expect, request as pwRequest } from '@playwright/test';

const BASE = process.env.SMOKE_BASE ?? 'https://withagents.dev';
const FLAGSHIP_POST_SLUG = 'day-01-validationforge-ga'; // adjust when P10 finalizes

test.describe('withagents.dev Day-1 smoke', () => {

  test('S1 home renders', async ({ page }) => {
    const r = await page.goto(`${BASE}/`);
    expect(r?.status()).toBe(200);
    await expect(page.locator('text=withagents').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('S2 /writing lists posts in date-desc', async ({ page }) => {
    await page.goto(`${BASE}/writing/`);
    const times = await page.locator('article time[datetime]').allTextContents();
    expect(times.length).toBeGreaterThanOrEqual(1);
    const iso = await page.locator('article time[datetime]').evaluateAll(
      els => els.map(e => e.getAttribute('datetime'))
    );
    for (let i = 0; i < iso.length - 1; i++) {
      expect(new Date(iso[i]!).getTime()).toBeGreaterThanOrEqual(new Date(iso[i+1]!).getTime());
    }
  });

  test('S3 flagship post full render + OG meta', async ({ page }) => {
    const r = await page.goto(`${BASE}/writing/${FLAGSHIP_POST_SLUG}/`);
    expect(r?.status()).toBe(200);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toMatch(/\/api\/og\.png\?/);
    const body = await page.locator('article').textContent();
    expect(body!.length).toBeGreaterThan(1500);
  });

  test('S4 /work has form + calendly fallback', async ({ page }) => {
    await page.goto(`${BASE}/work/`);
    await expect(page.locator('form[action="/api/consult"][method="post" i]')).toBeVisible();
    await expect(page.locator('a[href*="calendly.com"]')).toHaveCount(1, { timeout: 5000 });
  });

  test('S5 form POST redirects 303 to Calendly', async ({ request }) => {
    const res = await request.post(`${BASE}/api/consult`, {
      form: {
        name: 'Smoke Test',
        email: 'smoke@example.com',
        use_case: 'Day -1 verification harness, delete after: this is a scripted submission.',
      },
      maxRedirects: 0,
    });
    expect([302, 303]).toContain(res.status());
    expect(res.headers().location).toMatch(/calendly\.com/);
  });

  test('S6 OG endpoint returns 1200x630 PNG', async ({ request }) => {
    const res = await request.get(`${BASE}/api/og.png?title=SmokeTest&kind=essay`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    // PNG IHDR at byte 16 = width big-endian; 20 = height
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
  });

  test('S8 Plausible snippet present on key routes', async ({ request }) => {
    for (const p of ['/', '/writing/', '/work/', '/about/']) {
      const html = await (await request.get(`${BASE}${p}`)).text();
      expect(html, p).toContain('plausible.io/js/script.js');
      expect(html, p).toContain('data-domain="withagents.dev"');
    }
  });

  test('S9 rss.xml valid + >=52 items', async ({ request }) => {
    const xml = await (await request.get(`${BASE}/rss.xml`)).text();
    expect(xml).toContain('<rss');
    const items = (xml.match(/<item>/g) ?? []).length;
    expect(items).toBeGreaterThanOrEqual(52);
  });

  test('S10 sitemap lists post URLs', async ({ request }) => {
    const idx = await (await request.get(`${BASE}/sitemap-index.xml`)).text();
    expect(idx).toContain('sitemap-0.xml');
    const sm = await (await request.get(`${BASE}/sitemap-0.xml`)).text();
    const locs = (sm.match(/<loc>/g) ?? []).length;
    expect(locs).toBeGreaterThanOrEqual(52);
  });

  test('S11 bogus slug returns 404', async ({ page }) => {
    const r = await page.goto(`${BASE}/writing/nonexistent-slug/`);
    expect(r?.status()).toBe(404);
  });

  test('S12 mobile viewport clean on home + post + work', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await ctx.newPage();
    for (const p of ['/', `/writing/${FLAGSHIP_POST_SLUG}/`, '/work/']) {
      await page.goto(`${BASE}${p}`);
      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasOverflow, `${p} horizontal overflow`).toBe(false);
    }
    await ctx.close();
  });

  test('S14 nav aria-current on /writing', async ({ page }) => {
    await page.goto(`${BASE}/writing/`);
    const cur = await page.locator('nav a[aria-current="page"]').textContent();
    expect(cur?.toLowerCase()).toContain('writing');
  });

  test('S15 /lab loads interactive component', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('pageerror', e => consoleErrors.push(e.message));
    await page.goto(`${BASE}/lab/`);
    await page.waitForLoadState('networkidle');
    // framer-motion motion components render as divs with style; minimal assertion:
    await expect(page.locator('body')).toBeVisible();
    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  });

  test('S17 all sitemap URLs return 200', async ({ request }) => {
    const sm = await (await request.get(`${BASE}/sitemap-0.xml`)).text();
    const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    for (const u of urls) {
      const r = await request.head(u);
      expect(r.status(), u).toBeLessThan(400);
    }
  });
});
```

### 4.2 Chrome DevTools MCP fallback (for interactive debug of a single failing test)

```
mcp call chrome-devtools.navigate --url https://withagents.dev/writing/day-01-validationforge-ga/
mcp call chrome-devtools.screenshot --output /tmp/s3-post.png
mcp call chrome-devtools.evaluate --expression "document.querySelector('meta[property=og:image]').content"
```

Use when Playwright assertion fails to capture a screenshot + DOM snapshot for the retrospective.

---

## 5. Rollback playbook

Cascade by severity:

| Trigger | Action | Cost |
|---|---|---|
| Any single test S1-S18 fails cosmetically (e.g., wrong wordmark color) | Fix locally, re-deploy via `vercel --prod` | 5–15 min |
| OG endpoint 500 (`/api/og.png`) | Check Edge function logs; if font fetch to `withagents.dev/fonts/*` fails during cold start, rewrite `og.png.ts` to read fonts from `fs` (node runtime) or inline as base64. | 30–60 min |
| `/api/consult` 500 | Tail Vercel function logs; 99% chance missing env var. Add via `vercel env add ...`, then `vercel --prod` | 10 min |
| Build broken after a late content push | `vercel rollback <prior-deployment-url>` — instant revert to previous immutable deployment | < 1 min |
| DNS misconfigured / SSL stuck | Keep old deployment as the alias target; re-verify TXT record; contact Vercel support if cert issuance >30 min | up to 60 min |
| Full site compromised / wrong content published | `vercel rollback` + immediately push a hotfix commit; do NOT touch DNS |  < 5 min |
| Catastrophic (repo corruption, credentials leaked) | 1) rotate all 5 Vercel env vars + Supabase service key + Resend API key 2) restore from `git reflog`; 3) re-deploy from known-good commit. **Static HTML exports of all posts must already be pre-staged in git** (per approval-package §12 risk 4) so a lightweight alternate-host reskin is feasible. | 2–4 hours |

Keep a **last-known-good deployment URL** pinned in a Day-1 runbook note. `vercel list --prod` shows history; the previous green deployment is one command away.

---

## 6. Post-Day-1 regression cadence

### Daily (automated, 5 min via GitHub Action or cron-triggered Playwright)

- S1 (home 200), S2 (writing index), S6 (OG endpoint), S8 (Plausible on home), S9 (rss item count), S17 (all sitemap URLs 200).

These are cheap and catch the most likely regressions: a new post with a broken slug, an env-var expiration, a stale OG font subset.

### Weekly (manual, ~15 min)

- S3 (newest 3 posts full render + OG), S4+S5 (/work form round-trip with a real submission — use a dedicated `smoke+<date>@...` email so the Supabase row is filterable), S12 (mobile), S15 (/lab island).

### Per-content-push (whenever a new post lands)

- S2 (order correctness — most common break: wrong `date` frontmatter, duplicate slug).
- S9 (rss re-includes new item).
- S10+S17 (sitemap grows by 1; new URL returns 200).

### Most likely breakage vectors as content grows

1. **Slug collisions** — two posts dated the same day with same title generate conflicting slugs. Mitigation: CI job that runs `pnpm run build` and greps dist for duplicate directory names.
2. **OG font subsets** — a post title with a glyph outside the Space-Grotesk-Bold subset renders boxes. Mitigation: expand subsets or fall back to Inter for non-Latin.
3. **Keystatic GitHub-mode token expiration** — if an installation token is revoked, admin UI silently fails. Mitigation: monthly `/keystatic/` smoke pass.
4. **Supabase schema drift** — if `consultant_inquiries` loses a column, /api/consult starts 500-ing for silent failures. Mitigation: weekly S5 smoke hits row-count.
5. **Plausible site-config drift** — adding a subdomain without registering it in Plausible loses analytics on that subdomain. Mitigation: include subdomain in S8 test list when one is added.

---

## Concerns / unresolved

1. **`src/pages/404.astro` does not exist** — `ls src/pages` shows no 404.astro. Astro + Vercel static-adapter routes `/writing/nonexistent` to Vercel's default 404 template, not a branded one. S11 should be downgraded to "returns 404 status" OR a custom 404.astro must be added in Phase 10. Flag for the planner.
2. **Keystatic `storage: { kind: 'local' }` is broken-by-design in serverless prod.** Either remove the admin route (KISS) before Day −1 or execute §1.4 GitHub-mode swap. Not doing one of these = admin UI that silently loses edits.
3. **OG endpoint self-fetches `https://withagents.dev/fonts/*` at edge cold-start.** The first-ever deploy will likely 500 because the domain resolves only after deploy completes. Two options: (a) inline fonts as base64 in og-template.tsx; (b) use Astro's asset pipeline and import the `.ttf` files directly. Untested on this stack — flag for verification.
4. **Plausible `<script>` tag is hardcoded to `data-domain="withagents.dev"` in BaseLayout.** Preview/Vercel-PR-URL deployments will spray events into the prod site or 404 silently. Consider `data-domain={import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? 'withagents.dev'}`.
5. **RSS route is `rss.xml.ts`** (dynamic endpoint), not a static file. Verified it will emit as `/rss.xml` via Astro's file-based routing, but confirm on first prod build.
6. **`/work.astro` form structure not inspected in this pass.** S4 assertions assume standard `<form action="/api/consult" method="POST">`. If it's React-island-rendered, the assertion may need a `waitFor`.
7. **GitHub remote situation.** `blog-series` has no remote (approval §14 risk 5). If Path B is chosen in §2, this becomes a hard blocker before Day −1.
8. **Sitemap post count assumed 52.** The P09 GATE showed 5 writing slugs. Phase 10 is supposed to fill to 45–52. Verify actual count before asserting.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Delivered Day −1 checklist, CLI-based deploy procedure, 18-item smoke test matrix, runnable Playwright script, rollback cascade, and post-Day-1 cadence. Flagged 8 concrete gaps (missing 404.astro, Keystatic local-mode prod trap, OG font self-fetch bootstrap risk, Plausible domain hardcode, etc.) that must be resolved before the smoke tests will all pass.
**Concerns/Blockers:** §Concerns items 1–3 are likely blockers; items 4–8 are smaller patches.
