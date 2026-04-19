/**
 * supabase/client.ts
 *
 * Singleton Supabase client for the syndication runner.
 * Uses the service-role key — never expose to browser or untrusted environments.
 *
 * Required env vars:
 *   SUPABASE_URL           — e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY   — service_role secret (not anon key)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[syndication/supabase] Missing required environment variable: ${name}`
    );
  }
  return value;
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _client: SupabaseClient | null = null;

/**
 * Returns the singleton Supabase client.
 * Validates env vars on first call; throws if missing.
 * Safe to call multiple times — returns the same instance.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = requireEnv("SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_KEY");

  _client = createClient(url, serviceKey, {
    auth: {
      // Service role — no browser session management needed
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return _client;
}

/**
 * Reset the singleton (test/CLI use only).
 * Not needed in normal runner execution.
 */
export function resetSupabaseClient(): void {
  _client = null;
}
