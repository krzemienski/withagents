# consultant-pipeline

Infrastructure for the withagents.dev `/work` consulting funnel.

## What this does

Inquiry submitted on `/work` → POST `/api/consult` → Supabase row inserted →
Resend notification email sent → 302 redirect to Calendly booking page.

UTM params (`utm_source`, `utm_medium`, `utm_campaign`) are captured from the
inbound URL and stored on every row for attribution reporting.

---

## Required environment variables

Set these in `.env.local` (local dev) and as Vercel project environment
variables (production). **Never commit these values.**

| Variable              | Description                                                        | Example                                    |
|-----------------------|--------------------------------------------------------------------|--------------------------------------------|
| `SUPABASE_URL`        | Supabase project API URL                                           | `https://xyzxyz.supabase.co`               |
| `SUPABASE_SERVICE_KEY`| Service-role key (bypasses RLS). Keep server-side only.            | `eyJhbG...`                                |
| `RESEND_API_KEY`      | Resend API key from resend.com dashboard                           | `re_abc123...`                             |
| `NICK_INQUIRY_EMAIL`  | Destination for inquiry notification emails                        | `nick@withagents.dev`                      |
| `CALENDLY_URL`        | Full Calendly booking URL; users are redirected here after submit  | `https://calendly.com/nickk/30min`         |

`.env.local` template:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
RESEND_API_KEY=re_YOUR_KEY
NICK_INQUIRY_EMAIL=nick@withagents.dev
CALENDLY_URL=https://calendly.com/nickk/30min
```

---

## Supabase migration run order

1. **Enable pgcrypto** (if not already active in your project):

   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

   In Supabase Dashboard → Database → Extensions → search "pgcrypto" → Enable.
   Most Supabase projects have this on by default.

2. **Run the schema** via Supabase SQL Editor or psql:

   ```bash
   psql "$SUPABASE_DB_URL" -f scripts/consultant-pipeline/schema.sql
   ```

   The file is idempotent (`IF NOT EXISTS` / `CREATE OR REPLACE`) — safe to
   re-run after edits.

3. **Verify**:

   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'consultant_inquiries'
   ORDER BY ordinal_position;
   ```

   Expected columns: `id`, `name`, `email`, `company`, `use_case`,
   `utm_source`, `utm_medium`, `utm_campaign`, `created_at`, `responded_at`.

4. **Row-level security** is enabled with no public policies. The server
   endpoint uses the service-role key which bypasses RLS. If you ever need an
   anon-insert path, add an explicit policy (see comments in `schema.sql`).

---

## Resend setup

1. Create account at [resend.com](https://resend.com).
2. Add and verify `withagents.dev` as a sending domain (DNS → MX/SPF/DKIM).
3. Generate an API key with **"Sending access"** scope.
4. Set `RESEND_API_KEY` and `NICK_INQUIRY_EMAIL`.
5. The `from` address is hardcoded as `noreply@withagents.dev` in
   `src/pages/api/consult.ts`. Update if your verified domain differs.

---

## Calendly URL config

1. Create a 30-min event type at [calendly.com](https://calendly.com).
2. Copy the booking URL (e.g. `https://calendly.com/nickk/30min`).
3. Set `CALENDLY_URL` in env.

The `/work` page also renders a direct Calendly link as a fallback for users
who prefer to skip the form. Both paths use `CALENDLY_URL`.

---

## UTM attribution

Every form submission stores the UTM triple from the inbound URL. To query
attribution in Supabase:

```sql
-- Inquiries by source
SELECT utm_source, COUNT(*) AS inquiries
FROM consultant_inquiries
GROUP BY utm_source
ORDER BY inquiries DESC;

-- Full campaign breakdown
SELECT utm_source, utm_medium, utm_campaign, COUNT(*) AS inquiries
FROM consultant_inquiries
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY inquiries DESC;
```

UTM values are preserved via:
1. Server-side: `Astro.url.searchParams` → props → hidden form fields (initial render).
2. Client-side JS: `window.location.search` → hidden fields on page load (handles
   cases where user navigates to `/work?utm_*=...` directly in browser).

---

## TODO (Phase 11 credential handoff)

- [ ] Provision Supabase project and run `schema.sql`
- [ ] Add `withagents.dev` as Resend verified domain
- [ ] Generate Resend API key → set `RESEND_API_KEY`
- [ ] Set `NICK_INQUIRY_EMAIL`
- [ ] Create Calendly event type → set `CALENDLY_URL`
- [ ] Set `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
- [ ] Add all vars to Vercel project environment (Production + Preview)
- [ ] Remove the `TODO(phase-11-credentials)` comment from `work.astro` Calendly fallback link
- [ ] Test end-to-end: submit form → check Supabase row → check email → verify Calendly redirect
- [ ] Verify UTM params round-trip: `/work?utm_source=linkedin` → row has `utm_source='linkedin'`
