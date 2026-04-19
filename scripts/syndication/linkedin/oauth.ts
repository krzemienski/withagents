#!/usr/bin/env tsx
/**
 * LinkedIn OAuth2 token management.
 *
 * Reads the token file at TOKEN_FILE_PATH (defaults to repo-root/.env.linkedin-tokens.json).
 * If the access token is expired or within REFRESH_MARGIN_MS of expiry, attempts a
 * refresh-token rotation. Writes the updated token file back on success.
 *
 * Env vars read:
 *   LINKEDIN_CLIENT_ID       — LinkedIn app client ID        (required for refresh)
 *   LINKEDIN_CLIENT_SECRET   — LinkedIn app client secret    (required for refresh)
 *   LINKEDIN_TOKEN_FILE      — override token file path      (optional)
 *
 * LinkedIn's standard (non-partner) apps receive short-lived access tokens (~60 days)
 * and a refresh token valid for ~365 days. The refresh_token_expires_in field is NOT
 * returned by the standard token endpoint — only partner apps get it. We treat the
 * refresh token as valid until a 401/invalid_grant error proves otherwise.
 *
 * Exit codes:
 *   0 — tokens loaded (fresh or successfully refreshed)
 *   1 — unrecoverable error (missing creds, refresh failed, no token file)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  LinkedInTokenFile,
  LinkedInTokens,
  TokenRefreshResult,
} from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/** Refresh if token expires within 30 minutes */
const REFRESH_MARGIN_MS = 30 * 60 * 1000;

const TOKEN_FILE_PATH =
  process.env.LINKEDIN_TOKEN_FILE ??
  path.join(REPO_ROOT, ".env.linkedin-tokens.json");

const LINKEDIN_TOKEN_ENDPOINT =
  "https://www.linkedin.com/oauth/v2/accessToken";

// ---------------------------------------------------------------------------
// Token file I/O
// ---------------------------------------------------------------------------

function readTokenFile(): LinkedInTokenFile {
  if (!fs.existsSync(TOKEN_FILE_PATH)) {
    throw new Error(
      `LinkedIn token file not found: ${TOKEN_FILE_PATH}\n` +
        `Run: node scripts/linkedin-auth-local.js to obtain tokens first.`
    );
  }
  const raw = fs.readFileSync(TOKEN_FILE_PATH, "utf-8");
  const parsed: unknown = JSON.parse(raw);

  // Minimal structural validation — never log field values
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("access_token" in parsed) ||
    !("author_urn" in parsed) ||
    !("expires_at" in parsed)
  ) {
    throw new Error(
      "LinkedIn token file is malformed — missing required fields. " +
        "Re-run the auth script."
    );
  }
  return parsed as LinkedInTokenFile;
}

function writeTokenFile(
  existing: LinkedInTokenFile,
  refreshed: TokenRefreshResult
): LinkedInTokenFile {
  const updated: LinkedInTokenFile = {
    platform: "linkedin",
    access_token: refreshed.accessToken,
    refresh_token: refreshed.refreshToken ?? existing.refresh_token,
    author_urn: existing.author_urn,
    expires_in: refreshed.expiresIn,
    expires_at: refreshed.expiresAt.toISOString(),
    fetched_at: new Date().toISOString(),
  };
  fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(updated, null, 2) + "\n");
  return updated;
}

// ---------------------------------------------------------------------------
// Refresh logic
// ---------------------------------------------------------------------------

async function refreshAccessToken(
  refreshToken: string
): Promise<TokenRefreshResult> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set to refresh tokens.\n" +
        "Export them before running."
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(LINKEDIN_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "(unreadable)");
    if (res.status === 400 || res.status === 401) {
      throw new Error(
        `LinkedIn refresh token rejected (${res.status}). ` +
          `Re-run the auth script to obtain a new token pair.\nDetail: ${detail}`
      );
    }
    throw new Error(
      `LinkedIn token refresh failed (${res.status}): ${detail}`
    );
  }

  const json = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new Error(
      "LinkedIn token refresh response missing access_token or expires_in"
    );
  }

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? null,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
    expiresIn: json.expires_in,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Load LinkedIn tokens, refreshing if needed.
 *
 * Always call this before making any API request. It:
 *   1. Reads the token file
 *   2. Checks expiry (with 30-min margin)
 *   3. Rotates via refresh_token if needed, writes updated file
 *   4. Returns live tokens ready for Authorization header use
 *
 * Throws on any unrecoverable error. Callers should propagate and exit(1).
 */
export async function loadTokens(): Promise<LinkedInTokens> {
  const file = readTokenFile();
  const expiresAt = new Date(file.expires_at);
  const isExpiringSoon = Date.now() + REFRESH_MARGIN_MS >= expiresAt.getTime();

  if (!isExpiringSoon) {
    return {
      accessToken: file.access_token,
      refreshToken: file.refresh_token,
      authorUrn: file.author_urn,
      expiresAt,
    };
  }

  // Token expired or expiring soon — refresh
  if (!file.refresh_token) {
    throw new Error(
      "LinkedIn access token has expired and no refresh_token is stored. " +
        "Re-run scripts/linkedin-auth-local.js to obtain a new token pair."
    );
  }

  console.error(
    `[linkedin/oauth] Access token expires at ${expiresAt.toISOString()} — refreshing…`
  );

  const refreshed = await refreshAccessToken(file.refresh_token);
  const updated = writeTokenFile(file, refreshed);

  console.error(
    `[linkedin/oauth] Token refreshed. New expiry: ${updated.expires_at}`
  );

  return {
    accessToken: updated.access_token,
    refreshToken: updated.refresh_token,
    authorUrn: updated.author_urn,
    expiresAt: new Date(updated.expires_at),
  };
}

/**
 * Return a pre-built Authorization header value.
 * Convenience wrapper around loadTokens().
 */
export async function getBearerHeader(): Promise<string> {
  const tokens = await loadTokens();
  return `Bearer ${tokens.accessToken}`;
}

// ---------------------------------------------------------------------------
// CLI entrypoint — `pnpm tsx scripts/syndication/linkedin/oauth.ts`
// ---------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadTokens()
    .then((t) => {
      console.log(`[linkedin/oauth] Tokens loaded OK.`);
      console.log(`  author_urn : ${t.authorUrn}`);
      console.log(`  expires_at : ${t.expiresAt.toISOString()}`);
    })
    .catch((err: Error) => {
      console.error(`[linkedin/oauth] ERROR: ${err.message}`);
      process.exit(1);
    });
}
