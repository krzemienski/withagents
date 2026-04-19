#!/usr/bin/env node
/**
 * One-time LinkedIn OAuth 2.0 (Authorization Code) helper.
 *
 * Prereqs:
 *   - Create a LinkedIn app at linkedin.com/developers
 *   - Enable products: "Share on LinkedIn", "Sign In with LinkedIn using OpenID Connect"
 *     and (if approved) "Community Management API" for article publishing
 *   - Add redirect URL: http://localhost:4174/callback
 *   - Export client ID + secret
 *
 * Usage:
 *   export LINKEDIN_CLIENT_ID=...
 *   export LINKEDIN_CLIENT_SECRET=...
 *   export SUPABASE_URL=https://<ref>.supabase.co
 *   export SUPABASE_SERVICE_ROLE_KEY=...
 *   node scripts/social-auth-linkedin.js --label nick-personal
 *
 * Scope: requests w_member_social (post to personal profile) + openid/profile (for member URN)
 */

const http = require("node:http");
const { URL } = require("node:url");
const { execSync } = require("node:child_process");
const crypto = require("node:crypto");
const { createClient } = require(require("node:path").resolve(
  __dirname, "..", "site", "node_modules", "@supabase/supabase-js"
));

function arg(name, fallback = null) {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
}

async function main() {
  const label = arg("label", "nick-personal");
  const port = Number(arg("port", "4174"));

  const {
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env;

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    console.error("ERROR: set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET");
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERROR: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const redirectUri = `http://localhost:${port}/callback`;
  const state = crypto.randomBytes(16).toString("hex");
  const scopes = "openid profile w_member_social";

  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", LINKEDIN_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", scopes);

  console.log(`\nAuthorize in the browser:\n  ${authUrl.toString()}\n`);
  try { execSync(`open "${authUrl.toString()}"`, { stdio: "ignore" }); } catch {}

  // Catch callback
  const { code, returnedState } = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${port}`);
      if (u.pathname !== "/callback") {
        res.writeHead(404); res.end("Not found"); return;
      }
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("LinkedIn auth complete — you may close this tab.");
      server.close();
      resolve({
        code: u.searchParams.get("code"),
        returnedState: u.searchParams.get("state"),
      });
    });
    server.listen(port, () => console.log(`Listening for callback on :${port}…`));
    setTimeout(() => reject(new Error("timeout waiting for callback")), 300_000);
  });

  if (returnedState !== state) throw new Error("state mismatch — possible CSRF");
  if (!code) throw new Error("no code in callback");

  // Exchange code for access token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Token exchange failed ${tokenRes.status}: ${await tokenRes.text()}`);
  }
  const tokenJson = await tokenRes.json();
  const { access_token, refresh_token, expires_in } = tokenJson;
  const expiresAt = new Date(Date.now() + expires_in * 1000);

  // Fetch user's member URN via /userinfo (OIDC endpoint)
  const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    throw new Error(`Userinfo failed ${userRes.status}: ${await userRes.text()}`);
  }
  const userInfo = await userRes.json();
  const authorUrn = `urn:li:person:${userInfo.sub}`;
  console.log(`\nAuthenticated as ${userInfo.name} (${authorUrn})`);

  // Upsert into Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase
    .from("social_auth_tokens")
    .upsert({
      platform: "linkedin",
      account_label: label,
      access_token,
      refresh_token: refresh_token ?? null,
      author_urn: authorUrn,
      expires_at: expiresAt.toISOString(),
    }, { onConflict: "platform,account_label" });

  if (error) {
    console.error("Supabase upsert failed:", error);
    process.exit(1);
  }

  console.log(`\n✔ Stored LinkedIn tokens in Supabase for label: ${label}`);
  console.log(`  Expires: ${expiresAt.toISOString()}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
