/**
 * shared/types.ts
 *
 * Cross-adapter type definitions for the syndication runner.
 * Imported by linkedin/, x/, readme-patcher/, scheduler/, and supabase/ adapters.
 *
 * Keep this file import-free (no runtime deps) so any adapter can pull it
 * without circular dependency risk.
 */

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type SyndicationStatus =
  | "pending"      // queued, not yet attempted
  | "in_progress"  // adapter is currently posting
  | "posted"       // successfully posted; response_url set
  | "failed"       // attempt failed; error_message set; may retry
  | "exhausted"    // retry_count >= RetryPolicy.maxAttempts; no further retries
  | "skipped";     // intentionally not posted (e.g. channel disabled)

export type Channel =
  | "linkedin_short"   // scripted share post (~200-350 words)
  | "linkedin_article" // manual UI paste — runner drafts, human publishes
  | "x_thread"         // X API v2 tweet thread (7-12 posts)
  | "readme_patch";    // gh CLI README "Featured in:" section patch

// ---------------------------------------------------------------------------
// Core request/result shapes
// ---------------------------------------------------------------------------

/**
 * Input payload the runner builds from post frontmatter before dispatching
 * to any adapter.
 */
export interface SyndicationRequest {
  /** Post directory slug, e.g. "post-01-series-launch" */
  slug: string;
  channel: Channel;
  /** Absolute path to the post's post.md */
  postPath: string;
  /** Resolved post title from frontmatter */
  title: string;
  /** Canonical URL on withagents.dev */
  canonicalUrl: string;
  /** UTM-tagged URL for this channel */
  utmUrl: string;
  /** ISO-8601 string — when the runner dispatched this attempt */
  dispatchedAt: string;
}

/**
 * Result returned by every adapter after an attempt, success or failure.
 */
export interface SyndicationResult {
  slug: string;
  channel: Channel;
  status: SyndicationStatus;
  /** Public URL of the created post/thread/commit, if available */
  responseUrl: string | null;
  /** Raw error message on failure */
  errorMessage: string | null;
  /** ISO-8601 timestamp of the attempt */
  attemptedAt: string;
}

// ---------------------------------------------------------------------------
// Retry policy
// ---------------------------------------------------------------------------

export interface RetryPolicy {
  /** Maximum total attempts (initial + retries). Default: 3 */
  maxAttempts: number;
  /**
   * Backoff strategy.
   * - "linear": wait baseDelayMs * attempt
   * - "exponential": wait baseDelayMs * 2^(attempt-1)
   */
  backoff: "linear" | "exponential";
  /** Base delay in milliseconds. Default: 60_000 (1 minute) */
  baseDelayMs: number;
  /** Hard ceiling on any single delay. Default: 3_600_000 (1 hour) */
  maxDelayMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  backoff: "exponential",
  baseDelayMs: 60_000,
  maxDelayMs: 3_600_000,
};

// ---------------------------------------------------------------------------
// Webhook / alert shapes
// ---------------------------------------------------------------------------

/**
 * Payload POSTed to the webhook endpoint when a row hits exhausted status.
 */
export interface ExhaustedAlertPayload {
  slug: string;
  channel: Channel;
  totalAttempts: number;
  lastError: string | null;
  logId: string;
  occurredAt: string;
}

// ---------------------------------------------------------------------------
// Supabase row shapes (mirroring syndication_log columns)
// Used by supabase/log.ts and callers that read back rows.
// ---------------------------------------------------------------------------

export interface SyndicationLogRow {
  id: string;
  slug: string;
  channel: Channel;
  status: SyndicationStatus;
  posted_at: string | null;
  response_url: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
}

export type SyndicationLogInsert = Omit<SyndicationLogRow, "id" | "created_at">;

export type SyndicationLogUpdate = Partial<
  Pick<SyndicationLogRow, "status" | "posted_at" | "response_url" | "error_message" | "retry_count">
>;
