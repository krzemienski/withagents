# Phase 13 — Consultant Pipeline Implementation Report

**Phase:** 13 — consultant-pipeline
**Plan:** /Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/
**Status:** completed
**Date:** 2026-04-19

---

## Files Modified / Created

| File | Lines | Action |
|---|---|---|
| `withagents-site/src/pages/work.astro` | 265 | created |
| `withagents-site/src/components/ConsultForm.astro` | 313 | created |
| `withagents-site/src/pages/api/consult.ts` | 165 | created |
| `scripts/consultant-pipeline/schema.sql` | 55 | created |
| `scripts/consultant-pipeline/README.md` | 137 | created |
| `withagents-site/src/components/Nav.astro` | +2 lines | **one allowed cross-cut** |

### Nav.astro diff (the one allowed edit)

```diff
-  current?: 'products' | 'writing' | 'opensource' | 'about';
+  current?: 'products' | 'writing' | 'opensource' | 'about' | 'work';

-  { href: '/products', label: 'Products', key: 'products' },
   { href: '/writing',  label: 'Writing',  key: 'writing'  },
   { href: '/opensource', label: 'Open Source', key: 'opensource' },
   { href: '/about',    label: 'About',    key: 'about'    },
+  { href: '/work',     label: 'Work',     key: 'work'     },
```

---

## Tasks Completed

- [x] `work.astro` — hero + "what I do" (4-area grid) + "how it works" (3 engagement styles) + "what I don't do" section + `<ConsultForm />` + Calendly embed fallback + server-side UTM capture from `?utm_source=...&utm_medium=...&utm_campaign=...`
- [x] `ConsultForm.astro` — fields: name (required), email (required), company (optional), use_case (textarea, required); hidden UTM triple; dual client+server validation; error states with aria; loading spinner; submit → POST `/api/consult`; success → 302 to Calendly URL
- [x] `api/consult.ts` — `export const prerender = false` (hybrid per-route); Zod schema validation; Supabase `consultant_inquiries` insert (service-role key); Resend notification email; 302 to `env.CALENDLY_URL`; error redirect back to `/work?error=...` (never blank 500)
- [x] `schema.sql` — idempotent `CREATE TABLE IF NOT EXISTS consultant_inquiries` with all required columns, two indexes, RLS enabled
- [x] `README.md` — env vars table, Supabase migration run order, Resend setup, Calendly config, UTM attribution queries, Phase 11 TODO checklist

---

## Form Schema

```
name          text    required  1–120 chars
email         email   required  RFC5322 pattern
company       text    optional  max 120 chars
use_case      text    required  10–2000 chars
utm_source    hidden  optional  from URL / SSR
utm_medium    hidden  optional  from URL / SSR
utm_campaign  hidden  optional  from URL / SSR
```

---

## Supabase Table: `consultant_inquiries`

```sql
id            uuid        PK  DEFAULT gen_random_uuid()
name          text        NOT NULL  CHECK length 1–120
email         text        NOT NULL  CHECK ~* email regex
company       text        NULLABLE  CHECK length ≤120
use_case      text        NOT NULL  CHECK length 10–2000
utm_source    text        NULLABLE
utm_medium    text        NULLABLE
utm_campaign  text        NULLABLE
created_at    timestamptz NOT NULL  DEFAULT now()
responded_at  timestamptz NULLABLE  (set manually when Nick replies)
```

Indexes: `idx_consultant_inquiries_unresponded` (unresponded DESC), `idx_consultant_inquiries_utm`.
RLS: enabled, no public policies — service-role key only.

---

## Endpoint Behavior: POST /api/consult

1. Parse `request.formData()`
2. Zod `safeParse` — on failure: 303 redirect to `referer?error=<first_message>`
3. `createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)` → `.insert(row)` — on failure: 303 redirect to `/work?error=...`
4. `resend.emails.send(...)` — non-fatal; logs error, does not block redirect
5. `Response.redirect(CALENDLY_URL, 303)`

All redirects use 303 (POST-Redirect-GET) to prevent form resubmission on back-nav.

---

## UTM Capture Strategy

Two layers, both needed:

1. **SSR layer** — `Astro.url.searchParams` in `work.astro` → props → hidden fields at render time. Handles direct navigation to `/work?utm_source=linkedin`.
2. **Client JS layer** — `window.location.search` → hidden fields on `DOMContentLoaded`. Handles SPA-style navigation where SSR URL differs from client URL (edge cases with Astro View Transitions).

Client JS only overwrites hidden fields if they are currently empty, so SSR values take precedence.

---

## Environment Variables Required

| Variable              | When needed          |
|-----------------------|----------------------|
| `SUPABASE_URL`        | Phase 11 kickoff     |
| `SUPABASE_SERVICE_KEY`| Phase 11 kickoff     |
| `RESEND_API_KEY`      | Phase 11 kickoff     |
| `NICK_INQUIRY_EMAIL`  | Phase 11 kickoff     |
| `CALENDLY_URL`        | Phase 11 kickoff     |

All are optional at build time — missing vars throw at request time, not build time. The `requireEnv()` helper throws a descriptive error rather than a cryptic undefined-access.

---

## Type Check

```
npx tsc --noEmit --strict --ignoreDeprecations 6.0
# Zero errors in Phase 13 files.
# Pre-existing errors: keystatic.config.ts (6 errors, not Phase 13 owned).
# Pre-existing deprecation: baseUrl in tsconfig.json (TS6 warning, not an error).
```

---

## Functional Validation Status

Phase 13 constraint: "code + schema; no live API calls." Functional validation (form submit → Supabase row → email → Calendly redirect) is deferred to Phase 11 when credentials are provisioned. The Phase 11 TODO checklist in `README.md` specifies the full end-to-end test sequence.

---

## TODO List for Phase 11 Credential Handoff

- [ ] Provision Supabase project → run `scripts/consultant-pipeline/schema.sql`
- [ ] Add `withagents.dev` as Resend verified sending domain
- [ ] Generate Resend API key → set `RESEND_API_KEY` in Vercel + `.env.local`
- [ ] Set `NICK_INQUIRY_EMAIL` (destination for notifications)
- [ ] Create Calendly 30-min event type → set `CALENDLY_URL`
- [ ] Set `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` in Vercel (Production + Preview)
- [ ] E2E test: submit form → verify Supabase row with UTM values → verify email received → verify Calendly redirect lands
- [ ] Test error path: submit with invalid email → verify `/work?error=...` redirect surfaces inline
- [ ] Remove `TODO(phase-11-credentials)` placeholder comment from `work.astro` Calendly fallback `href`
- [ ] Update `from:` address in `consult.ts` if Resend verified domain differs from `withagents.dev`

---

## Issues Encountered

- `astro check` shows a pre-existing `InvalidContentEntryDataError` in `src/content/posts/day-01-validationforge-ga.linkedin.md` — content schema mismatch, not Phase 13. Not touched.
- `keystatic.config.ts` has 6 pre-existing TS errors against `FormFieldPreviewProps` — not Phase 13. Not touched.
- Hook fired "PostToolUse write failed" on `consult.ts` — false alarm, file confirmed present at 6630 bytes.

**Status:** DONE
**Summary:** All 5 owned files created, Nav.astro one-line cross-cut applied, TypeScript clean in Phase 13 scope, schema idempotent and migration-ready, README covers full Phase 11 handoff checklist.
