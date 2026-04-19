#!/usr/bin/env node
/**
 * Scheduled-post publisher.
 *
 * Reads `scheduled_posts` from Supabase where status='pending' and
 * scheduled_for <= now(), then publishes each one to its target platform.
 *
 * Designed to be triggered by launchd every 5-15 min.
 *
 * Env required:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   X_API_KEY, X_API_SECRET                  (X consumer creds; user tokens come from DB)
 *   LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET (only needed for token refresh)
 *
 * Args:
 *   --limit N       max rows to process this run (default 5)
 *   --dry-run       print what would happen, don't post
 *   --post-id UUID  process only one row by id (testing)
 */

const path = require("node:path");
const fs = require("node:fs");
const { TwitterApi } = require(path.resolve(__dirname, "..", "site", "node_modules", "twitter-api-v2"));
const { createClient } = require(path.resolve(__dirname, "..", "site", "node_modules", "@supabase/supabase-js"));

// ---- args -----------------------------------------------------------------

function arg(name, fallback = null) {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  return next && !next.startsWith("--") ? next : true;
}

const LIMIT = Number(arg("limit", "5"));
const DRY_RUN = arg("dry-run", false) === true;
const ONLY_ID = arg("post-id", null);

// ---- env ------------------------------------------------------------------

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  X_API_KEY,
  X_API_SECRET,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---- helpers --------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, "..");
const SITE_BASE = "https://site-rho-pied.vercel.app";

function buildUtmUrl(slug, source, medium) {
  const qs = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: "blog-series-ai",
    utm_content: slug,
  });
  return `${SITE_BASE}/posts/${slug}?${qs}`;
}

function repoUrlForSlug(slug) {
  // Pull from posts/<slug>/post.md frontmatter
  const md = fs.readFileSync(path.join(REPO_ROOT, "posts", slug, "post.md"), "utf-8");
  const m = md.match(/^github_repo:\s*"?([^"\n]+)"?/m);
  return m ? m[1].trim() : "";
}

function utmMediumForPlatform(platform) {
  if (platform === "x") return "thread";
  if (platform === "linkedin") return "essay";
  if (platform === "linkedin-article") return "article";
  return "unknown";
}

function utmSourceForPlatform(platform) {
  return platform === "x" ? "x" : "linkedin";
}

function readContent(contentRef) {
  const abs = path.isAbsolute(contentRef) ? contentRef : path.join(REPO_ROOT, contentRef);
  return fs.readFileSync(abs, "utf-8");
}

// ---- token loaders --------------------------------------------------------

async function getToken(platform, accountLabel) {
  const { data, error } = await supabase
    .from("social_auth_tokens")
    .select("*")
    .eq("platform", platform)
    .eq("account_label", accountLabel)
    .maybeSingle();
  if (error) throw new Error(`Token fetch failed: ${error.message}`);
  if (!data) throw new Error(`No token for ${platform}/${accountLabel}`);
  return data;
}

// ---- X publishing ---------------------------------------------------------

function parseThreadMarkdown(md) {
  const parts = md.split(/^---\s*$/m);
  const main = parts[0] ?? "";
  const reply = parts.slice(1).join("\n---\n");

  const extract = (text, prefix) => {
    const re = new RegExp(`^\\*\\*${prefix}\\s*\\d+[^*]*\\*\\*\\s*`);
    const blocks = [];
    let cur = null;
    for (const line of text.split("\n")) {
      const m = line.match(re);
      if (m) {
        if (cur) blocks.push(cur.join("\n").trim());
        const rest = line.slice(m[0].length).trim();
        cur = rest ? [rest] : [];
      } else if (cur !== null) {
        cur.push(line);
      }
    }
    if (cur) blocks.push(cur.join("\n").trim());
    return blocks.filter((b) => b.length > 0);
  };

  return { tweets: extract(main, "Tweet"), replies: extract(reply, "Reply") };
}

function substitute(text, map) {
  return text.replace(/\{\{(\w+)\}\}/g, (full, k) => map[k] ?? full);
}

async function publishX(row, token) {
  const md = readContent(row.content_ref);
  const { tweets, replies } = parseThreadMarkdown(md);
  if (tweets.length === 0) throw new Error("No tweets parsed");

  const placeholders = {
    POST_URL: buildUtmUrl(row.post_slug, "x", "thread"),
    REPO_URL: repoUrlForSlug(row.post_slug),
  };

  const bodies = tweets.map((t, i) => {
    const body = substitute(t, placeholders);
    if (body.length > 280) throw new Error(`Tweet ${i + 1} > 280 chars (${body.length})`);
    return body;
  });
  const replyBodies = replies.map((r, i) => {
    const body = substitute(r, placeholders);
    if (body.length > 280) throw new Error(`Reply ${i + 1} > 280 chars`);
    return body;
  });

  if (!X_API_KEY || !X_API_SECRET) throw new Error("X_API_KEY/X_API_SECRET not set");

  const client = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: token.access_token,
    accessSecret: token.access_token_secret,
  });

  let mediaIds;
  if (row.image_ref) {
    const imagePath = path.isAbsolute(row.image_ref)
      ? row.image_ref
      : path.join(REPO_ROOT, row.image_ref);
    if (fs.existsSync(imagePath)) {
      const id = await client.v1.uploadMedia(imagePath);
      mediaIds = [id];
    }
  }

  const tweetIds = [];
  let prev;
  for (let i = 0; i < bodies.length; i++) {
    const payload = i === 0
      ? { text: bodies[i], ...(mediaIds ? { media: { media_ids: mediaIds } } : {}) }
      : { text: bodies[i], reply: { in_reply_to_tweet_id: prev } };
    const res = await client.v2.tweet(payload);
    prev = res.data.id;
    tweetIds.push(res.data.id);
  }
  const replyIds = [];
  for (const body of replyBodies) {
    const res = await client.v2.tweet({ text: body, reply: { in_reply_to_tweet_id: prev } });
    prev = res.data.id;
    replyIds.push(res.data.id);
  }

  const url = `https://x.com/i/status/${tweetIds[0]}`;
  return { url, response: { tweet_ids: tweetIds, reply_ids: replyIds } };
}

// ---- LinkedIn publishing -------------------------------------------------

const LI_API = "https://api.linkedin.com";
const LI_VERSION = "202403";

function essayMdToPlain(md) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, (_, t) => t.toUpperCase())
    .replace(/(^|\s)\*([^*]+)\*(?=\s|$)/g, "$1$2")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function publishLinkedInEssay(row, token) {
  const md = readContent(row.content_ref);
  const commentary = essayMdToPlain(md);

  const res = await fetch(`${LI_API}/rest/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author: token.author_urn,
      commentary,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!res.ok) throw new Error(`LinkedIn post ${res.status}: ${await res.text()}`);
  const urn = res.headers.get("x-restli-id") ?? "";

  // Drop UTM'd link in first comment so the essay itself stays unsuppressed
  const linkComment = `Full post + code: ${buildUtmUrl(row.post_slug, "linkedin", "essay")}\nCompanion repo: ${repoUrlForSlug(row.post_slug)}`;
  await fetch(`${LI_API}/rest/socialActions/${encodeURIComponent(urn)}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ actor: token.author_urn, object: urn, message: { text: linkComment } }),
  });

  return { url: `https://linkedin.com/feed/update/${urn}`, response: { urn, comment: "posted" } };
}

async function publishLinkedInArticle(row, token) {
  const md = readContent(row.content_ref);
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : row.post_slug;

  // For LinkedIn Articles via the public REST API we publish a UGC post linking to
  // the canonical URL. LI scrapes OG metadata from the source. True native Article
  // creation requires the Articles API which has separate access requirements.
  const canonicalUrl = buildUtmUrl(row.post_slug, "linkedin", "article");

  const res = await fetch(`${LI_API}/rest/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author: token.author_urn,
      commentary: `${title} — new post in the series.`,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      content: { article: { source: canonicalUrl, title, description: title } },
    }),
  });
  if (!res.ok) throw new Error(`LinkedIn article ${res.status}: ${await res.text()}`);
  const urn = res.headers.get("x-restli-id") ?? "";
  return { url: `https://linkedin.com/feed/update/${urn}`, response: { urn } };
}

// ---- main loop -----------------------------------------------------------

async function main() {
  let query = supabase
    .from("scheduled_posts")
    .select("*")
    .in("status", ["pending", "failed"])
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(LIMIT);

  if (ONLY_ID) query = supabase.from("scheduled_posts").select("*").eq("id", ONLY_ID);

  const { data: rows, error } = await query;
  if (error) throw new Error(`Queue read failed: ${error.message}`);

  if (!rows || rows.length === 0) {
    console.log(`[${new Date().toISOString()}] no pending posts.`);
    return;
  }

  console.log(`[${new Date().toISOString()}] processing ${rows.length} row(s)`);

  for (const row of rows) {
    if (row.attempt_count >= row.max_attempts) {
      console.log(`SKIP ${row.id} — max attempts reached`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`DRY ${row.platform} ${row.post_slug} ${row.scheduled_for}`);
      continue;
    }

    await supabase
      .from("scheduled_posts")
      .update({ status: "posting", attempt_count: row.attempt_count + 1 })
      .eq("id", row.id);

    try {
      const token = await getToken(row.platform === "x" ? "x" : "linkedin", row.account_label);

      let result;
      if (row.platform === "x") result = await publishX(row, token);
      else if (row.platform === "linkedin") result = await publishLinkedInEssay(row, token);
      else if (row.platform === "linkedin-article") result = await publishLinkedInArticle(row, token);
      else throw new Error(`Unknown platform: ${row.platform}`);

      await supabase
        .from("scheduled_posts")
        .update({
          status: "posted",
          posted_url: result.url,
          posted_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      await supabase.from("post_publish_log").insert({
        scheduled_post_id: row.id,
        attempt: row.attempt_count + 1,
        success: true,
        response: result.response,
      });

      console.log(`OK ${row.platform} ${row.post_slug} → ${result.url}`);
    } catch (e) {
      console.error(`FAIL ${row.platform} ${row.post_slug}:`, e.message);

      await supabase
        .from("scheduled_posts")
        .update({ status: "failed", error_message: String(e.message ?? e) })
        .eq("id", row.id);

      await supabase.from("post_publish_log").insert({
        scheduled_post_id: row.id,
        attempt: row.attempt_count + 1,
        success: false,
        error: { message: String(e.message ?? e), stack: e.stack ?? null },
      });
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
