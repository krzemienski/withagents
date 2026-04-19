/**
 * supabase/retry.ts
 *
 * Fetch failed syndication_log rows and re-dispatch them with backoff.
 *
 * The retry runner is meant to be invoked:
 *   - By the scheduler after a failed primary attempt
 *   - As a standalone cron (e.g. GitHub Action on 15-min schedule)
 *
 * It does NOT contain adapter logic — it calls back to the adapter
 * registry supplied by the caller so retry.ts stays decoupled from
 * linkedin/, x/, readme-patcher/ internals.
 */

import { getSupabaseClient } from "./client.ts";
import { closeLog, markExhausted } from "./log.ts";
import { triggerExhaustedAlert } from "./webhook.ts";
import type {
  Channel,
  SyndicationLogRow,
  SyndicationResult,
  RetryPolicy,
} from "../shared/types.ts";
import { DEFAULT_RETRY_POLICY as _DEFAULT } from "../shared/types.ts";

// ---------------------------------------------------------------------------
// Adapter interface (injected by caller)
// ---------------------------------------------------------------------------

/**
 * Minimal interface every channel adapter must satisfy for the retry runner.
 * The adapter receives the log row so it has access to slug + channel,
 * and returns a SyndicationResult.
 */
export type AdapterFn = (row: SyndicationLogRow) => Promise<SyndicationResult>;

export type AdapterRegistry = Partial<Record<Channel, AdapterFn>>;

// ---------------------------------------------------------------------------
// Backoff calculation
// ---------------------------------------------------------------------------

function computeDelay(policy: RetryPolicy, attemptNumber: number): number {
  const raw =
    policy.backoff === "exponential"
      ? policy.baseDelayMs * Math.pow(2, attemptNumber - 1)
      : policy.baseDelayMs * attemptNumber;

  return Math.min(raw, policy.maxDelayMs);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Fetch rows eligible for retry
// ---------------------------------------------------------------------------

/**
 * Returns all syndication_log rows in 'failed' status where
 * retry_count < policy.maxAttempts.
 */
async function fetchRetryable(
  policy: RetryPolicy
): Promise<SyndicationLogRow[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("syndication_log")
    .select("*")
    .eq("status", "failed")
    .lt("retry_count", policy.maxAttempts)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(
      `[syndication/retry] fetchRetryable failed: ${error.message}`
    );
  }

  return (data ?? []) as SyndicationLogRow[];
}

/**
 * Returns all 'failed' rows that have hit the attempt ceiling.
 * These get flipped to 'exhausted' + alert fired.
 */
async function fetchExhausted(
  policy: RetryPolicy
): Promise<SyndicationLogRow[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("syndication_log")
    .select("*")
    .eq("status", "failed")
    .gte("retry_count", policy.maxAttempts);

  if (error) {
    throw new Error(
      `[syndication/retry] fetchExhausted failed: ${error.message}`
    );
  }

  return (data ?? []) as SyndicationLogRow[];
}

// ---------------------------------------------------------------------------
// Retry run
// ---------------------------------------------------------------------------

export interface RetryRunSummary {
  attempted: number;
  succeeded: number;
  stillFailed: number;
  exhausted: number;
  errors: Array<{ id: string; slug: string; channel: Channel; error: string }>;
}

/**
 * Run one retry pass.
 *
 * Steps:
 * 1. Flip any rows that hit the attempt ceiling to 'exhausted' + fire alert.
 * 2. Fetch retryable rows.
 * 3. For each row: wait backoff delay, re-dispatch via adapter, update log.
 *
 * @param adapters  Registry mapping Channel → adapter function.
 * @param policy    Retry policy (defaults to DEFAULT_RETRY_POLICY).
 */
export async function runRetryPass(
  adapters: AdapterRegistry,
  policy: RetryPolicy = _DEFAULT
): Promise<RetryRunSummary> {
  const summary: RetryRunSummary = {
    attempted: 0,
    succeeded: 0,
    stillFailed: 0,
    exhausted: 0,
    errors: [],
  };

  // --- Step 1: mark exhausted rows + fire alerts ---
  const exhaustedRows = await fetchExhausted(policy);
  for (const row of exhaustedRows) {
    try {
      await markExhausted(row.id);
      await triggerExhaustedAlert({
        slug: row.slug,
        channel: row.channel as Channel,
        totalAttempts: row.retry_count,
        lastError: row.error_message,
        logId: row.id,
        occurredAt: new Date().toISOString(),
      });
      summary.exhausted++;
    } catch (err) {
      summary.errors.push({
        id: row.id,
        slug: row.slug,
        channel: row.channel as Channel,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // --- Step 2: fetch retryable rows ---
  const retryable = await fetchRetryable(policy);
  if (retryable.length === 0) return summary;

  // --- Step 3: re-dispatch each row ---
  for (const row of retryable) {
    const channel = row.channel as Channel;
    const adapter = adapters[channel];

    if (!adapter) {
      // No adapter registered for this channel in this runner process — skip.
      console.warn(
        `[syndication/retry] No adapter for channel "${channel}" (slug: ${row.slug}) — skipping`
      );
      continue;
    }

    summary.attempted++;

    // Backoff: wait before re-attempting (retry_count is current number of past attempts)
    const delayMs = computeDelay(policy, row.retry_count);
    if (delayMs > 0) {
      console.log(
        `[syndication/retry] Waiting ${delayMs}ms before retrying ${row.slug}/${channel} (attempt ${row.retry_count + 1})`
      );
      await sleep(delayMs);
    }

    try {
      const result = await adapter(row);
      await closeLog(row.id, result);

      if (result.status === "posted") {
        summary.succeeded++;
      } else {
        summary.stillFailed++;

        // Check if this failure pushes us over the limit
        const newCount = row.retry_count + 1;
        if (newCount >= policy.maxAttempts) {
          await markExhausted(row.id);
          await triggerExhaustedAlert({
            slug: row.slug,
            channel,
            totalAttempts: newCount,
            lastError: result.errorMessage,
            logId: row.id,
            occurredAt: new Date().toISOString(),
          });
          summary.exhausted++;
          summary.stillFailed--;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      summary.errors.push({ id: row.id, slug: row.slug, channel, error: message });
      console.error(
        `[syndication/retry] Adapter threw for ${row.slug}/${channel}: ${message}`
      );
    }
  }

  return summary;
}
