#!/usr/bin/env node
/**
 * One-time X / Twitter OAuth 1.0a helper.
 *
 * Prereqs:
 *   - Create an X Developer app at developer.x.com
 *   - Set callback URL to: http://localhost:4173/callback
 *   - Export to env: X_API_KEY (consumer key), X_API_SECRET (consumer secret)
 *
 * Usage:
 *   export X_API_KEY=...
 *   export X_API_SECRET=...
 *   export SUPABASE_URL=https://<ref>.supabase.co
 *   export SUPABASE_SERVICE_ROLE_KEY=...         # service role, NOT anon
 *   node scripts/social-auth-x.js --label nick-personal
 *
 * Flow:
 *   1. Request token from X
 *   2. Opens browser to X authorize page
 *   3. Local server on :4173 catches the callback with oauth_verifier
 *   4. Exchanges verifier for user access_token + secret
 *   5. Upserts into Supabase social_auth_tokens table
 */

const http = require("node:http");
const { URL } = require("node:url");
const { execSync } = require("node:child_process");
const { TwitterApi } = require(require("node:path").resolve(
  __dirname, "..", "site", "node_modules", "twitter-api-v2"
));
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
  const port = Number(arg("port", "4173"));

  const { X_API_KEY, X_API_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!X_API_KEY || !X_API_SECRET) {
    console.error("ERROR: set X_API_KEY and X_API_SECRET");
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERROR: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const client = new TwitterApi({ appKey: X_API_KEY, appSecret: X_API_SECRET });

  // Step 1 — request token
  const callbackUrl = `http://localhost:${port}/callback`;
  const authLink = await client.generateAuthLink(callbackUrl, { linkMode: "authorize" });
  console.log(`\nAuthorize this app in the browser:\n  ${authLink.url}\n`);
  try {
    execSync(`open "${authLink.url}"`, { stdio: "ignore" });
  } catch {
    // Fall through — user opens manually
  }

  // Step 2 — listen for callback
  const { oauth_token, oauth_verifier } = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${port}`);
      if (u.pathname !== "/callback") {
        res.writeHead(404); res.end("Not found"); return;
      }
      const oauth_token = u.searchParams.get("oauth_token");
      const oauth_verifier = u.searchParams.get("oauth_verifier");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("X auth complete — you may close this tab.");
      server.close();
      if (oauth_token && oauth_verifier) resolve({ oauth_token, oauth_verifier });
      else reject(new Error("missing oauth_token or oauth_verifier"));
    });
    server.listen(port, () => console.log(`Listening for callback on :${port}…`));
    setTimeout(() => reject(new Error("timeout waiting for callback")), 300_000);
  });

  if (oauth_token !== authLink.oauth_token) {
    throw new Error("oauth_token mismatch — possible CSRF");
  }

  // Step 3 — exchange for access token
  const loginClient = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: oauth_token,
    accessSecret: authLink.oauth_token_secret,
  });
  const { accessToken, accessSecret, userId, screenName } = await loginClient.login(oauth_verifier);
  console.log(`\nAuthenticated as @${screenName} (${userId})`);

  // Step 4 — upsert to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase
    .from("social_auth_tokens")
    .upsert({
      platform: "x",
      account_label: label,
      access_token: accessToken,
      access_token_secret: accessSecret,
      author_urn: `urn:x:user:${userId}`,
    }, { onConflict: "platform,account_label" });

  if (error) {
    console.error("Supabase upsert failed:", error);
    process.exit(1);
  }

  console.log(`\n✔ Stored X tokens in Supabase for label: ${label}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
