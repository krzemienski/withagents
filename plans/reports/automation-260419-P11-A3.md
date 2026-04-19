# Phase 11 / Agent P11-A3 — Supabase Syndication Log + Webhook

**Agent:** fullstack-developer (aefd1cd89a4d5b934)
**Date:** 2026-04-19
**Plan:** plans/260419-0241-agentic-dog-brand-launch/

---

## Files Modified / Created

| File | Lines | Purpose |
|---|---|---|
| `scripts/syndication/shared/types.ts` | 131 | Cross-adapter type definitions (owned by A3) |
| `scripts/syndication/supabase/schema.sql` | 87 | `syndication_log` DDL + 4 indexes |
| `scripts/syndication/supabase/client.ts` | 63 | Singleton `getSupabaseClient()` wrapper |
| `scripts/syndication/supabase/log.ts` | 185 | `openLog` / `closeLog` / `markExhausted` / reads |
| `scripts/syndication/supabase/retry.ts` | 231 | `runRetryPass()` with backoff + exhaustion handling |
| `scripts/syndication/supabase/webhook.ts` | 212 | `triggerExhaustedAlert()` + `handleWebhookPost()` |
| `scripts/syndication/supabase/README.md` | 127 | Migration order, env contract, usage |

Total: 1,036 lines across 7 files.

---

## Schema

```sql
CREATE TABLE syndication_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        NOT NULL,
  channel       text        NOT NULL CHECK (channel IN (
                              'linkedin_short','linkedin_article','x_thread','readme_patch')),
  status        text        NOT NULL DEFAULT 'pending' CHECK (status IN (
                              'pending','in_progress','posted','failed','exhausted','skipped')),
  posted_at     timestamptz,
  response_url  text,
  error_message text,
  retry_count   int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

Indexes: `(slug)`, `(channel)`, `(status)` partial on active statuses, `(slug, channel)` composite.

Migration run order:
1. `scripts/supabase-schema.sql` — base tables (already exists)
2. `scripts/syndication/supabase/schema.sql` — syndication_log (this PR)

---

## Type Exports (shared/types.ts)

All importable by sibling adapters via `../shared/types.ts`:

- `SyndicationStatus` — union: `pending | in_progress | posted | failed | exhausted | skipped`
- `Channel` — union: `linkedin_short | linkedin_article | x_thread | readme_patch`
- `RetryPolicy` — interface: `maxAttempts`, `backoff`, `baseDelayMs`, `maxDelayMs`
- `DEFAULT_RETRY_POLICY` — const: 3 attempts, exponential, 60s base, 1h max
- `SyndicationRequest` — adapter input shape (slug, channel, paths, URLs)
- `SyndicationResult` — adapter output shape (status, responseUrl, errorMessage, attemptedAt)
- `ExhaustedAlertPayload` — webhook POST body shape
- `SyndicationLogRow` / `SyndicationLogInsert` / `SyndicationLogUpdate` — DB row shapes

---

## Webhook Behavior Spec

### triggerExhaustedAlert(payload)

- Called by `retry.ts` whenever a row flips to `exhausted` (retry_count >= maxAttempts)
- Checks `RESEND_API_KEY` env var
  - Present: sends HTML email via Resend to `ALERT_EMAIL_TO` (default: krzemienski@gmail.com)
  - Absent: logs warning to stdout, continues without throwing
- Never throws — swallows Resend errors to keep retry runner alive
- Email subject: `[withagents.dev] Syndication exhausted: {slug}/{channel}`

### handleWebhookPost(req, res)

- Express/Vercel-compatible POST handler
- Validates `x-webhook-secret` header against `SYNDICATION_WEBHOOK_SECRET` env var
  - Mismatch → 401
  - Secret not configured → 401 (endpoint disabled)
- Accepts body: `{ type: "syndication.exhausted", payload: ExhaustedAlertPayload }`
- Unknown event type → 200 noop (forward-compatible)
- Invalid payload shape → 400
- Success → 200 `{ received: true, action: "alert_sent" }`

### Resend integration status

Stubbed with a clear `TODO(resend-integration)` comment in `webhook.ts`. The stub logs the would-be email and returns `true` so the pipeline continues during development. To activate:
1. `pnpm add resend` (in scripts package.json, or site/)
2. Replace the stub body in `sendViaResend()` with the 3-line Resend SDK call shown in the comment
3. Set `RESEND_API_KEY`, `ALERT_EMAIL_TO`, `ALERT_EMAIL_FROM` in `.env`

---

## Retry Runner Design

`runRetryPass(adapters, policy)`:
1. Fetch `failed` rows where `retry_count >= policy.maxAttempts` → flip to `exhausted`, fire alert
2. Fetch `failed` rows where `retry_count < policy.maxAttempts`
3. For each row: compute backoff delay (`exponential`: `baseDelayMs * 2^(attempt-1)`, capped at `maxDelayMs`), wait, call adapter
4. On success: `closeLog(id, { status: "posted", ... })`
5. On failure: `closeLog(id, { status: "failed", ... })`, then check if new count hits ceiling → exhaust + alert
6. Returns `RetryRunSummary`: `{ attempted, succeeded, stillFailed, exhausted, errors[] }`

Adapter registry is injected by caller — `retry.ts` has zero knowledge of LinkedIn/X/README adapter internals.

---

## Env Contract

| Variable | Required | Default |
|---|---|---|
| `SUPABASE_URL` | yes | — |
| `SUPABASE_SERVICE_KEY` | yes | — |
| `RESEND_API_KEY` | no | log-only mode |
| `ALERT_EMAIL_TO` | no | `krzemienski@gmail.com` |
| `ALERT_EMAIL_FROM` | no | `alerts@withagents.dev` |
| `SYNDICATION_WEBHOOK_SECRET` | no (endpoint disabled if absent) | — |

Note: existing `seed-schedule.js` uses `SUPABASE_SERVICE_ROLE_KEY`. This module uses `SUPABASE_SERVICE_KEY`. Export both names in `.env` when running both scripts from the same shell.

---

## Type Check

```
npx tsc -p /tmp/tsconfig-syndication-check.json
(no output — zero errors)
```

All 5 TypeScript files pass strict mode with `@supabase/supabase-js` and `@types/node` resolved from `site/node_modules`.

---

## File Ownership Compliance

Only files under `scripts/syndication/supabase/**` and `scripts/syndication/shared/**` were created. No files in `linkedin/`, `x/`, `readme-patcher/`, `scheduler/`, `site/`, or `content/` were touched.

Sibling files found from other agents: `linkedin/types.ts`, `linkedin/share.ts`, `linkedin/oauth.ts`, `linkedin/article-prep.ts`, `x/types.ts`, `x/thread.ts`, `x/parser.ts`, `x/rate-limiter.ts`, `readme-patcher/patcher.ts`, `readme-patcher/parse-readme-patch.ts`, `scheduler/calendar-loader.ts` — all left untouched.

---

**Status:** DONE
**Summary:** All 7 deliverables created, strict typecheck passes with zero errors. Supabase `syndication_log` schema, singleton client, insert/update log API, retry runner with exponential backoff, and Nth-failure webhook alert (Resend-stubbed, log-only until key is set). Shared types exported for consumption by A1/A2/A4.
**Concerns:** None blocking. Resend stub is intentional per constraints (Phase 11 = code-only, no live DB).
