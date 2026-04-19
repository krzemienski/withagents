/**
 * supabase/log.ts
 *
 * Insert and update syndication_log rows.
 * Called by LinkedIn, X, and README-patcher adapters before and after
 * each attempt.
 *
 * Usage pattern:
 *   const id = await openLog(slug, channel);      // status = in_progress
 *   // ... adapter posts ...
 *   await closeLog(id, result);                    // status = posted | failed
 */

import { getSupabaseClient } from "./client.ts";
import type {
  Channel,
  SyndicationStatus,
  SyndicationResult,
  SyndicationLogRow,
  SyndicationLogInsert,
  SyndicationLogUpdate,
} from "../shared/types.ts";

// ---------------------------------------------------------------------------
// Open (insert a new in_progress row)
// ---------------------------------------------------------------------------

/**
 * Insert a new syndication_log row with status = in_progress.
 * Returns the generated UUID — callers must pass it to closeLog().
 */
export async function openLog(slug: string, channel: Channel): Promise<string> {
  const client = getSupabaseClient();

  const payload: SyndicationLogInsert = {
    slug,
    channel,
    status: "in_progress",
    posted_at: null,
    response_url: null,
    error_message: null,
    retry_count: 0,
  };

  const { data, error } = await client
    .from("syndication_log")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `[syndication/log] openLog failed for ${slug}/${channel}: ${error?.message ?? "no data returned"}`
    );
  }

  return data.id as string;
}

// ---------------------------------------------------------------------------
// Close (update existing row with result)
// ---------------------------------------------------------------------------

/**
 * Update an existing row with the adapter's result.
 * Increments retry_count by 1 regardless of outcome.
 */
export async function closeLog(
  id: string,
  result: Pick<SyndicationResult, "status" | "responseUrl" | "errorMessage">
): Promise<void> {
  const client = getSupabaseClient();

  // Fetch current retry_count so we can increment it
  const { data: existing, error: fetchError } = await client
    .from("syndication_log")
    .select("retry_count")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error(
      `[syndication/log] closeLog: cannot fetch row ${id}: ${fetchError?.message ?? "not found"}`
    );
  }

  const update: SyndicationLogUpdate = {
    status: result.status,
    response_url: result.responseUrl,
    error_message: result.errorMessage,
    retry_count: (existing.retry_count as number) + 1,
    posted_at:
      result.status === "posted" ? new Date().toISOString() : undefined,
  };

  const { error } = await client
    .from("syndication_log")
    .update(update)
    .eq("id", id);

  if (error) {
    throw new Error(
      `[syndication/log] closeLog: update failed for row ${id}: ${error.message}`
    );
  }
}

// ---------------------------------------------------------------------------
// Mark exhausted
// ---------------------------------------------------------------------------

/**
 * Flip status to 'exhausted' when retry_count has reached the policy limit.
 * The webhook handler queries for exhausted rows to send email alerts.
 */
export async function markExhausted(id: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from("syndication_log")
    .update({ status: "exhausted" } satisfies SyndicationLogUpdate)
    .eq("id", id);

  if (error) {
    throw new Error(
      `[syndication/log] markExhausted failed for row ${id}: ${error.message}`
    );
  }
}

// ---------------------------------------------------------------------------
// Convenience reads
// ---------------------------------------------------------------------------

/**
 * Fetch all rows for a given slug.
 * Used by the scheduler to check whether a channel was already posted.
 */
export async function getLogsBySlug(slug: string): Promise<SyndicationLogRow[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("syndication_log")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `[syndication/log] getLogsBySlug failed for slug "${slug}": ${error.message}`
    );
  }

  return (data ?? []) as SyndicationLogRow[];
}

/**
 * Fetch the most recent log row for a specific (slug, channel) pair.
 * Returns null if no row exists yet.
 */
export async function getLatestLog(
  slug: string,
  channel: Channel
): Promise<SyndicationLogRow | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("syndication_log")
    .select("*")
    .eq("slug", slug)
    .eq("channel", channel)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // PostgREST returns PGRST116 when no rows found — not a hard error
    if (error.code === "PGRST116") return null;
    throw new Error(
      `[syndication/log] getLatestLog failed for ${slug}/${channel}: ${error.message}`
    );
  }

  return data as SyndicationLogRow;
}
