# syndication/supabase

Supabase logging and retry layer for the syndication runner.

## Migration run order

Apply in this exact sequence against your Supabase project:

```
1. scripts/supabase-schema.sql          (base schema: social_auth_tokens, scheduled_posts, post_publish_log)
2. scripts/syndication/supabase/schema.sql   (this module: syndication_log + indexes)
```

Run via psql:

```bash
psql "$DATABASE_URL" -f scripts/supabase-schema.sql
psql "$DATABASE_URL" -f scripts/syndication/supabase/schema.sql
```

Or paste each file into the Supabase Dashboard SQL Editor and run.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | yes | Project URL, e.g. `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | yes | `service_role` secret key (not `anon`) |
| `RESEND_API_KEY` | no | Resend API key for exhausted-row email alerts. Omit to log-only mode. |
| `ALERT_EMAIL_TO` | no | Alert recipient. Default: `krzemienski@gmail.com` |
| `ALERT_EMAIL_FROM` | no | Verified sender in Resend. Default: `alerts@withagents.dev` |
| `SYNDICATION_WEBHOOK_SECRET` | no | Shared secret for inbound POST to `/syndication/webhook`. Required if using the webhook endpoint. |

Note: `SUPABASE_SERVICE_KEY` is the service_role key, not the anon key. The
existing `seed-schedule.js` uses `SUPABASE_SERVICE_ROLE_KEY` — both names are
present in the codebase. This module standardises on `SUPABASE_SERVICE_KEY`.
Export both in your `.env` if running both scripts from the same shell.

## Module map

```
supabase/
  schema.sql    CREATE TABLE syndication_log + indexes (apply manually)
  client.ts     getSupabaseClient() singleton — reads SUPABASE_URL + SUPABASE_SERVICE_KEY
  log.ts        openLog() / closeLog() / markExhausted() / getLogsBySlug() / getLatestLog()
  retry.ts      runRetryPass(adapters, policy) — fetches failed rows, re-dispatches with backoff
  webhook.ts    triggerExhaustedAlert(payload) + handleWebhookPost(req, res)
  README.md     this file

shared/
  types.ts      SyndicationStatus, Channel, RetryPolicy, SyndicationRequest/Result, row shapes
```

## syndication_log table

One row per attempt per `(slug, channel)`:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `slug` | text | post dir slug, e.g. `post-01-series-launch` |
| `channel` | text | `linkedin_short` \| `linkedin_article` \| `x_thread` \| `readme_patch` |
| `status` | text | `pending` → `in_progress` → `posted` \| `failed` → `exhausted` \| `skipped` |
| `posted_at` | timestamptz | set when status = `posted` |
| `response_url` | text | public URL of created post/thread/commit |
| `error_message` | text | last failure reason; overwritten on each retry |
| `retry_count` | int | number of attempts made; 0 = not yet run |
| `created_at` | timestamptz | row creation time |

Indexes: `(slug)`, `(channel)`, `(status)` partial on active statuses, `(slug, channel)` composite.

## Typical adapter call sequence

```typescript
import { openLog, closeLog } from "../supabase/log.ts";

// Before posting
const logId = await openLog(slug, "x_thread");

// After posting
await closeLog(logId, {
  status: "posted",
  responseUrl: "https://x.com/...",
  errorMessage: null,
});
```

On failure:

```typescript
await closeLog(logId, {
  status: "failed",
  responseUrl: null,
  errorMessage: err.message,
});
```

## Retry runner

```typescript
import { runRetryPass } from "../supabase/retry.ts";

const summary = await runRetryPass(
  { x_thread: xAdapter, linkedin_short: linkedinAdapter, readme_patch: readmeAdapter },
  { maxAttempts: 3, backoff: "exponential", baseDelayMs: 60_000, maxDelayMs: 3_600_000 }
);
console.log(summary);
```

The retry runner:
1. Flips any `failed` rows at the attempt ceiling to `exhausted` + fires alert.
2. Fetches remaining `failed` rows where `retry_count < maxAttempts`.
3. Applies exponential backoff delay before each attempt.
4. Calls the adapter, updates the log row.
5. If the new attempt also fails and now hits the ceiling, flips to `exhausted` + fires alert.

## Webhook alert

When a row is exhausted (all retries consumed), `triggerExhaustedAlert()` fires.
With `RESEND_API_KEY` set it sends an HTML email via Resend. Without it, it logs
to stdout and continues — no crash.

The inbound `handleWebhookPost` handler validates `x-webhook-secret` and accepts
`{ type: "syndication.exhausted", payload: ExhaustedAlertPayload }`.

Resend SDK integration is stubbed in `webhook.ts` with a clear TODO comment.
Add `resend` to `package.json` and replace the stub body before go-live.
