#!/usr/bin/env tsx
/**
 * LinkedIn short-post share via UGC Posts API v2.
 *
 * Posts a feed update (200-350 words) linking to a withagents.dev blog post.
 * The post text is read from a pre-generated `.linkedin.md` sidecar file
 * at `content/posts/<slug>/day-NN-<slug>.linkedin.md` (short-post variant).
 * If the sidecar does not exist, falls back to a generated teaser.
 *
 * Env vars:
 *   LINKEDIN_CLIENT_ID       — required only if token refresh is needed
 *   LINKEDIN_CLIENT_SECRET   — required only if token refresh is needed
 *   LINKEDIN_TOKEN_FILE      — override token file path (optional)
 *   SITE_BASE_URL            — defaults to https://withagents.dev
 *
 * Usage:
 *   pnpm tsx scripts/syndication/linkedin/share.ts <slug>
 *   pnpm tsx scripts/syndication/linkedin/share.ts <slug> --dry-run
 *
 * Exit codes:
 *   0 — post published (or dry-run simulated)
 *   1 — auth failure, API error, or missing input
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTokens } from "./oauth.js";
import type {
  LinkedInShareRequest,
  LinkedInShareResult,
  PostFrontmatter,
} from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const SITE_BASE_URL =
  (process.env.SITE_BASE_URL ?? "https://withagents.dev").replace(/\/$/, "");

const UGC_POSTS_URL = "https://api.linkedin.com/v2/ugcPosts";

/** LinkedIn API version header — required as of 2024 */
const LINKEDIN_API_VERSION = "202504";

// ---------------------------------------------------------------------------
// Frontmatter parser (no external deps)
// ---------------------------------------------------------------------------

function parseFrontmatter(markdown: string): {
  fm: Partial<PostFrontmatter>;
  body: string;
} {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: markdown };

  const [, yamlBlock, body] = match;
  const fm: Partial<PostFrontmatter> = {};

  for (const line of yamlBlock.split("\n")) {
    const kv = line.match(/^(\w+):\s*"?([^"]+)"?\s*$/);
    if (kv) {
      const [, key, value] = kv;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- YAML dynamic parse
      (fm as any)[key] = value.trim();
    }
    // Handle tags array (simple format only)
    const tagLine = line.match(/^\s+-\s+(.+)$/);
    if (tagLine) {
      if (!fm.tags) fm.tags = [];
      fm.tags.push(tagLine[1].trim());
    }
  }

  // Coerce numeric fields
  if (typeof fm.series_number === "string") {
    fm.series_number = parseInt(fm.series_number, 10);
  }
  if (typeof fm.series_total === "string") {
    fm.series_total = parseInt(fm.series_total, 10);
  }

  return { fm, body: body.trim() };
}

// ---------------------------------------------------------------------------
// UTM URL builder
// ---------------------------------------------------------------------------

function buildUtmUrl(slug: string): string {
  const params = new URLSearchParams({
    utm_source: "linkedin",
    utm_medium: "social",
    utm_campaign: "withagents-launch",
    utm_content: slug,
  });
  return `${SITE_BASE_URL}/posts/${slug}?${params.toString()}`;
}

function buildCanonicalUrl(slug: string): string {
  return `${SITE_BASE_URL}/posts/${slug}`;
}

// ---------------------------------------------------------------------------
// Post text loader
// ---------------------------------------------------------------------------

/**
 * Load short-post text. Priority:
 *   1. posts/<slug>/<slug>.linkedin-short.md (explicit short variant)
 *   2. posts/<slug>/post.md — auto-generate a 2-sentence teaser from subtitle + first paragraph
 */
function loadShortPostText(slug: string): {
  text: string;
  title: string;
  subtitle: string;
} {
  const postDir = path.join(REPO_ROOT, "posts", slug);
  const shortPath = path.join(postDir, `${slug}.linkedin-short.md`);
  const mainPath = path.join(postDir, "post.md");

  if (!fs.existsSync(mainPath)) {
    throw new Error(
      `Post not found: ${mainPath}\n` +
        `Make sure the slug matches a directory under posts/`
    );
  }

  const mainRaw = fs.readFileSync(mainPath, "utf-8");
  const { fm, body } = parseFrontmatter(mainRaw);

  const title = fm.title ?? slug;
  const subtitle = fm.subtitle ?? "";

  if (fs.existsSync(shortPath)) {
    const text = fs.readFileSync(shortPath, "utf-8").trim();
    return { text, title, subtitle };
  }

  // Auto-generate teaser from first non-empty paragraph
  const firstParagraph = body
    .split(/\n{2,}/)
    .map((p) => p.replace(/^#{1,6}\s+/, "").trim())
    .find((p) => p.length > 40 && !p.startsWith("```") && !p.startsWith("!"));

  const tags = (fm.tags ?? [])
    .slice(0, 3)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const teaser = [
    title,
    "",
    subtitle || firstParagraph || "",
    "",
    "Read the full post →",
    "",
    tags,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();

  return { text: teaser, title, subtitle };
}

// ---------------------------------------------------------------------------
// LinkedIn API call
// ---------------------------------------------------------------------------

async function postShare(
  request: LinkedInShareRequest,
  authorUrn: string,
  accessToken: string,
  dryRun: boolean
): Promise<LinkedInShareResult> {
  const payload = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: request.text,
        },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            description: {
              text: request.previewDescription ?? request.text.slice(0, 200),
            },
            originalUrl: request.utmUrl,
            title: {
              text: request.previewTitle ?? "",
            },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility":
        request.visibility ?? "PUBLIC",
    },
  };

  if (dryRun) {
    console.log("[linkedin/share] DRY RUN — would POST to", UGC_POSTS_URL);
    console.log("[linkedin/share] Payload:");
    console.log(JSON.stringify(payload, null, 2));
    return {
      postUrn: "urn:li:ugcPost:DRY_RUN",
      postUrl: "https://www.linkedin.com/feed/ (dry-run)",
    };
  }

  const res = await fetch(UGC_POSTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "(unreadable)");
    if (res.status === 401) {
      throw new Error(
        `LinkedIn API returned 401 Unauthorized. ` +
          `Token may be expired — run: pnpm tsx scripts/syndication/linkedin/oauth.ts\n` +
          `Detail: ${detail}`
      );
    }
    if (res.status === 422) {
      throw new Error(
        `LinkedIn API returned 422 Unprocessable Entity. ` +
          `Check post text length (<3000 chars) and media URL validity.\n` +
          `Detail: ${detail}`
      );
    }
    throw new Error(
      `LinkedIn UGC post failed (${res.status}): ${detail}`
    );
  }

  // LinkedIn returns the post URN in the X-RestLi-Id response header
  const postUrn =
    res.headers.get("x-restli-id") ??
    res.headers.get("X-RestLi-Id") ??
    "urn:li:ugcPost:unknown";

  // Derive a guessable post URL from the URN numeric ID
  const urnParts = postUrn.split(":");
  const numericId = urnParts[urnParts.length - 1];
  const postUrl = `https://www.linkedin.com/feed/update/${postUrn}/`;

  return { postUrn, postUrl };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const slug = args.find((a) => !a.startsWith("--"));

  if (!slug) {
    console.error(
      "Usage: pnpm tsx scripts/syndication/linkedin/share.ts <slug> [--dry-run]"
    );
    process.exit(1);
  }

  // Load auth
  let tokens;
  try {
    tokens = await loadTokens();
  } catch (err) {
    console.error(`[linkedin/share] Auth error: ${(err as Error).message}`);
    process.exit(1);
  }

  // Load post
  let postData;
  try {
    postData = loadShortPostText(slug);
  } catch (err) {
    console.error(`[linkedin/share] Post load error: ${(err as Error).message}`);
    process.exit(1);
  }

  const canonicalUrl = buildCanonicalUrl(slug);
  const utmUrl = buildUtmUrl(slug);

  const request: LinkedInShareRequest = {
    text: postData.text,
    canonicalUrl,
    utmUrl,
    previewTitle: postData.title,
    previewDescription: postData.subtitle || undefined,
    visibility: "PUBLIC",
  };

  console.log(`[linkedin/share] Posting short update for: ${slug}`);
  console.log(`  UTM URL : ${utmUrl}`);
  console.log(`  Text    : ${request.text.slice(0, 80)}…`);

  let result: LinkedInShareResult;
  try {
    result = await postShare(
      request,
      tokens.authorUrn,
      tokens.accessToken,
      dryRun
    );
  } catch (err) {
    console.error(`[linkedin/share] Post failed: ${(err as Error).message}`);
    process.exit(1);
  }

  console.log(`[linkedin/share] Published!`);
  console.log(`  URN : ${result.postUrn}`);
  console.log(`  URL : ${result.postUrl}`);
}

main();
