#!/usr/bin/env node
/**
 * LinkedIn OAuth 2.0 — saves tokens to local JSON file.
 */
const http = require("node:http");
const { URL } = require("node:url");
const { execSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 4174;
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const TOKEN_FILE = path.join(__dirname, "..", "linkedin-tokens.json");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("ERROR: set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET");
  process.exit(1);
}

async function main() {
  const state = crypto.randomBytes(16).toString("hex");
  const scopes = "openid profile w_member_social";

  // Build authorization URL
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", scopes);

  console.log(`\nAuthorize in the browser:\n  ${authUrl.toString()}\n`);
  try { execSync(`open "${authUrl.toString()}"`, { stdio: "ignore" }); } catch {}

  // Start local server to catch the callback
  const { code, returnedState } = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${PORT}`);
      if (u.pathname !== "/callback") {
        res.writeHead(404); res.end("Not found"); return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>LinkedIn auth complete — you may close this tab.</h2>");
      server.close();
      resolve({
        code: u.searchParams.get("code"),
        returnedState: u.searchParams.get("state"),
      });
    });
    server.listen(PORT, () => console.log(`Listening for callback on :${PORT}…`));
    setTimeout(() => reject(new Error("Timeout waiting for callback (5 min)")), 300_000);
  });

  if (returnedState !== state) throw new Error("State mismatch — possible CSRF");
  if (!code) throw new Error("No code in callback");

  // Exchange code for access token
  console.log("Exchanging code for token…");
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Token exchange failed ${tokenRes.status}: ${await tokenRes.text()}`);
  }
  const tokenJson = await tokenRes.json();
  const { access_token, refresh_token, expires_in } = tokenJson;

  // Fetch member URN via OIDC userinfo
  console.log("Fetching member profile…");
  const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    throw new Error(`Userinfo failed ${userRes.status}: ${await userRes.text()}`);
  }
  const userInfo = await userRes.json();
  const authorUrn = `urn:li:person:${userInfo.sub}`;
  console.log(`\nAuthenticated as ${userInfo.name} (${authorUrn})`);

  // Save tokens to local JSON file
  const tokenData = {
    platform: "linkedin",
    access_token,
    refresh_token: refresh_token ?? null,
    author_urn: authorUrn,
    expires_in,
    expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
    fetched_at: new Date().toISOString(),
  };

  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2) + "\n");
  console.log(`\n✔ Tokens saved to ${TOKEN_FILE}`);
  console.log(`  Expires: ${tokenData.expires_at}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
