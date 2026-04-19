/**
 * supabase/webhook.ts
 *
 * Nth-failure alert system for the syndication runner.
 *
 * Two entry points:
 *
 * 1. triggerExhaustedAlert(payload)
 *    Called internally by retry.ts when a row flips to 'exhausted'.
 *    Sends an email via Resend (or logs to stdout when RESEND_API_KEY is absent).
 *
 * 2. handleWebhookPost(req, res) — Express-compatible handler
 *    Exposes a POST /syndication/webhook endpoint that external triggers
 *    (e.g. Supabase DB webhook on status='exhausted') can call.
 *    Validates the shared secret, then fires the same alert path.
 *
 * Env vars:
 *   RESEND_API_KEY           — Resend API key (omit to log-only mode)
 *   ALERT_EMAIL_TO           — recipient address, e.g. krzemienski@gmail.com
 *   ALERT_EMAIL_FROM         — sender address verified in Resend, e.g. alerts@withagents.dev
 *   SYNDICATION_WEBHOOK_SECRET — shared secret for inbound POST verification
 *
 * TODO(resend-integration): swap the stub sendViaResend() body for the real
 * Resend SDK call once `resend` package is added to package.json.
 * Track: https://resend.com/docs/send-with-nodejs
 */

import type { ExhaustedAlertPayload, Channel } from "../shared/types.ts";

// ---------------------------------------------------------------------------
// Internal: email delivery
// ---------------------------------------------------------------------------

/**
 * Stub Resend integration.
 * Replace the body of this function with the real Resend SDK call.
 * Signature must not change — callers depend on it.
 *
 * @returns true on success, false on failure
 */
async function sendViaResend(
  to: string,
  from: string,
  subject: string,
  html: string,
  apiKey: string
): Promise<boolean> {
  // TODO(resend-integration): replace stub with real SDK call:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(apiKey);
  //   const { error } = await resend.emails.send({ from, to, subject, html });
  //   return !error;
  //
  // Stub behaviour: log the would-be email and return true so the
  // rest of the pipeline continues during development.
  console.log(
    `[syndication/webhook] [STUB] Would send email via Resend:\n` +
    `  to:      ${to}\n` +
    `  from:    ${from}\n` +
    `  subject: ${subject}\n` +
    `  apiKey:  ${apiKey.slice(0, 8)}...`
  );
  void html; // suppress unused-var lint until real impl
  return true;
}

function buildAlertHtml(payload: ExhaustedAlertPayload): string {
  return `
<h2>Syndication failure — action required</h2>
<table>
  <tr><td><strong>Post slug</strong></td><td>${payload.slug}</td></tr>
  <tr><td><strong>Channel</strong></td><td>${payload.channel}</td></tr>
  <tr><td><strong>Attempts</strong></td><td>${payload.totalAttempts}</td></tr>
  <tr><td><strong>Last error</strong></td><td>${payload.lastError ?? "(none)"}</td></tr>
  <tr><td><strong>Log row ID</strong></td><td>${payload.logId}</td></tr>
  <tr><td><strong>Time</strong></td><td>${payload.occurredAt}</td></tr>
</table>
<p>The syndication runner has given up on this row. Investigate via Supabase
dashboard → syndication_log, filter by id = '${payload.logId}'.</p>
`.trim();
}

// ---------------------------------------------------------------------------
// Public: fire alert
// ---------------------------------------------------------------------------

/**
 * Send an exhausted-row alert.
 * If RESEND_API_KEY is not set, the alert is logged to stdout only.
 * Never throws — failures are caught and logged so the retry runner
 * can continue processing other rows.
 */
export async function triggerExhaustedAlert(
  payload: ExhaustedAlertPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const to = process.env.ALERT_EMAIL_TO ?? "krzemienski@gmail.com";
  const from = process.env.ALERT_EMAIL_FROM ?? "alerts@withagents.dev";
  const subject = `[withagents.dev] Syndication exhausted: ${payload.slug}/${payload.channel}`;

  if (!apiKey) {
    console.warn(
      `[syndication/webhook] RESEND_API_KEY not set — alert not emailed.\n` +
      `  Exhausted: ${payload.slug}/${payload.channel} after ${payload.totalAttempts} attempts.\n` +
      `  Last error: ${payload.lastError ?? "(none)"}`
    );
    return;
  }

  try {
    const html = buildAlertHtml(payload);
    const ok = await sendViaResend(to, from, subject, html, apiKey);
    if (!ok) {
      console.error(
        `[syndication/webhook] Resend returned failure for alert: ${payload.logId}`
      );
    } else {
      console.log(
        `[syndication/webhook] Alert sent to ${to} for ${payload.slug}/${payload.channel}`
      );
    }
  } catch (err) {
    // Non-fatal: log and continue. Losing an email alert is bad but not
    // worth crashing the retry runner over.
    console.error(
      `[syndication/webhook] Alert delivery threw: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

// ---------------------------------------------------------------------------
// Public: inbound webhook handler (Express-compatible)
// ---------------------------------------------------------------------------

interface WebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

interface WebhookResponse {
  status(code: number): WebhookResponse;
  json(body: unknown): void;
}

/**
 * POST /syndication/webhook
 *
 * Validates x-webhook-secret header, then fires triggerExhaustedAlert.
 * Suitable for use as an Express route handler or a Vercel API route.
 *
 * Expected body shape:
 * {
 *   type: "syndication.exhausted",
 *   payload: ExhaustedAlertPayload
 * }
 */
export async function handleWebhookPost(
  req: WebhookRequest,
  res: WebhookResponse
): Promise<void> {
  // --- Secret verification ---
  const secret = process.env.SYNDICATION_WEBHOOK_SECRET ?? "";
  if (!secret) {
    console.warn(
      "[syndication/webhook] SYNDICATION_WEBHOOK_SECRET is not set — all inbound requests will be rejected."
    );
    res.status(401).json({ error: "Webhook endpoint not configured" });
    return;
  }

  const incoming =
    req.headers["x-webhook-secret"] ??
    req.headers["X-Webhook-Secret"] ??
    "";
  const incomingStr = Array.isArray(incoming) ? incoming[0] : incoming;

  if (incomingStr !== secret) {
    res.status(401).json({ error: "Invalid webhook secret" });
    return;
  }

  // --- Parse body ---
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ error: "Missing or malformed body" });
    return;
  }

  const body = req.body as Record<string, unknown>;

  if (body.type !== "syndication.exhausted") {
    // Unknown event type — acknowledge but do nothing
    res.status(200).json({ received: true, action: "noop" });
    return;
  }

  const payload = body.payload as ExhaustedAlertPayload | undefined;
  if (
    !payload ||
    typeof payload.slug !== "string" ||
    typeof payload.channel !== "string" ||
    typeof payload.logId !== "string"
  ) {
    res.status(400).json({ error: "Invalid payload shape" });
    return;
  }

  // --- Fire alert ---
  await triggerExhaustedAlert(payload);

  res.status(200).json({ received: true, action: "alert_sent" });
}
