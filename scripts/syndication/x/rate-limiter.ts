/**
 * Token-bucket rate limiter for the X API.
 *
 * Design:
 * - One token = one tweet post.
 * - Bucket capacity = daily tweet cap (Basic tier: 50/day).
 * - Bucket refills fully every 24h (aligned to first tweet of the day).
 * - On HTTP 429, backs off exponentially up to MAX_BACKOFF_MS.
 * - State is in-memory only; persistence to Supabase is deferred to Phase 11/A3.
 *
 * Thread safety: Node.js is single-threaded; no locking needed.
 */

import type { RateLimitState } from './types.js';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/** Maximum backoff ceiling for 429 retries: 15 minutes. */
const MAX_BACKOFF_MS = 15 * 60 * 1000;

/** Base backoff for first retry: 60 seconds. */
const BASE_BACKOFF_MS = 60 * 1000;

/** How many times to retry a 429 before giving up. */
const MAX_RETRIES = 5;

export class RateLimiter {
  private state: RateLimitState;

  constructor(dailyCapacity: number) {
    if (dailyCapacity < 1) {
      throw new Error(`dailyCapacity must be ≥ 1, got ${dailyCapacity}`);
    }
    this.state = {
      tokens: dailyCapacity,
      capacity: dailyCapacity,
      lastRefillAt: Date.now(),
      refillIntervalMs: TWENTY_FOUR_HOURS_MS,
    };
  }

  /** Current token count (for diagnostics). */
  get availableTokens(): number {
    this.maybeRefill();
    return this.state.tokens;
  }

  /** Capacity configured at construction time. */
  get capacity(): number {
    return this.state.capacity;
  }

  /**
   * Acquires a token, waiting if necessary.
   * Throws if the bucket is empty AND the next refill is >24h away
   * (should not happen in normal operation).
   */
  async acquire(): Promise<void> {
    this.maybeRefill();

    if (this.state.tokens > 0) {
      this.state.tokens -= 1;
      return;
    }

    // Bucket empty — wait until next refill.
    const msUntilRefill = this.msUntilNextRefill();
    if (msUntilRefill <= 0) {
      // Clock skew or logic error — refill immediately.
      this.forceRefill();
      this.state.tokens -= 1;
      return;
    }

    console.warn(
      `[rate-limiter] Token bucket empty. Waiting ${Math.ceil(msUntilRefill / 1000)}s for refill.`
    );
    await sleep(msUntilRefill);
    this.forceRefill();
    this.state.tokens -= 1;
  }

  /**
   * Wraps an async API call with retry-on-429 logic.
   *
   * Acquires a token BEFORE calling `fn`. If `fn` throws a 429 error,
   * backs off exponentially and retries (re-acquiring token each time).
   * After MAX_RETRIES exhausted, re-throws the last error.
   *
   * @param fn  The async function to execute (should be idempotent).
   * @param label  Human-readable label for log messages.
   */
  async withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
    let attempt = 0;

    while (true) {
      await this.acquire();

      try {
        return await fn();
      } catch (err) {
        const { is429, resetAt } = classifyError(err);

        if (!is429 || attempt >= MAX_RETRIES) {
          throw err;
        }

        attempt += 1;
        const backoffMs = computeBackoff(attempt, resetAt);

        console.warn(
          `[rate-limiter] 429 on "${label}" (attempt ${attempt}/${MAX_RETRIES}). ` +
            `Backing off ${Math.ceil(backoffMs / 1000)}s.`
        );

        // Return the consumed token since we haven't successfully posted.
        this.returnToken();

        await sleep(backoffMs);
      }
    }
  }

  /** Snapshot of internal state (for diagnostics / logging). */
  snapshot(): Readonly<RateLimitState> {
    this.maybeRefill();
    return { ...this.state };
  }

  // --- private ---

  private maybeRefill(): void {
    const now = Date.now();
    const elapsed = now - this.state.lastRefillAt;
    if (elapsed >= this.state.refillIntervalMs) {
      this.forceRefill();
    }
  }

  private forceRefill(): void {
    this.state.tokens = this.state.capacity;
    this.state.lastRefillAt = Date.now();
  }

  private msUntilNextRefill(): number {
    const elapsed = Date.now() - this.state.lastRefillAt;
    return Math.max(0, this.state.refillIntervalMs - elapsed);
  }

  /** Returns a token to the bucket (used when a 429 means the post didn't land). */
  private returnToken(): void {
    this.state.tokens = Math.min(this.state.tokens + 1, this.state.capacity);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Inspects an error to determine if it's a 429 and extracts the reset timestamp
 * from the `x-rate-limit-reset` header value (Unix seconds) if available.
 */
function classifyError(err: unknown): { is429: boolean; resetAt: number | null } {
  if (err == null || typeof err !== 'object') {
    return { is429: false, resetAt: null };
  }

  const e = err as Record<string, unknown>;

  // twitter-api-v2 throws errors with `code` property for HTTP status codes.
  // It also sets `rateLimitError: true` and `rateLimit.reset` (Unix seconds).
  const is429 =
    e['code'] === 429 ||
    e['rateLimitError'] === true ||
    (typeof e['message'] === 'string' &&
      (e['message'] as string).toLowerCase().includes('429'));

  let resetAt: number | null = null;
  if (is429) {
    // twitter-api-v2 exposes rateLimit.reset (Unix seconds)
    const rateLimit = e['rateLimit'] as Record<string, unknown> | undefined;
    if (rateLimit && typeof rateLimit['reset'] === 'number') {
      resetAt = rateLimit['reset'] * 1000; // convert to ms
    }
    // Fallback: check headers map
    const headers = e['headers'] as Record<string, string> | undefined;
    if (!resetAt && headers) {
      const resetHeader = headers['x-rate-limit-reset'];
      if (resetHeader) {
        const parsed = parseInt(resetHeader, 10);
        if (!isNaN(parsed)) resetAt = parsed * 1000;
      }
    }
  }

  return { is429, resetAt };
}

/**
 * Computes exponential backoff with jitter.
 * Uses the API-provided reset timestamp if available (preferred).
 */
function computeBackoff(attempt: number, resetAt: number | null): number {
  if (resetAt !== null) {
    const untilReset = resetAt - Date.now();
    if (untilReset > 0) {
      // Add 2s buffer so we don't hit the window edge.
      return Math.min(untilReset + 2000, MAX_BACKOFF_MS);
    }
  }
  // Exponential: 60s, 120s, 240s, 480s, 960s — capped at MAX_BACKOFF_MS.
  const exponential = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
  // ±10% jitter to avoid thundering-herd if multiple processes retry.
  const jitter = exponential * 0.1 * (Math.random() * 2 - 1);
  return Math.min(exponential + jitter, MAX_BACKOFF_MS);
}
