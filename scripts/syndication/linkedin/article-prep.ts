#!/usr/bin/env tsx
/**
 * LinkedIn Article prep tool.
 *
 * LinkedIn's API v2 does NOT support programmatic Article publishing — only
 * short UGC posts (shares). This tool bridges the gap by:
 *
 *   1. Reading the post's `.linkedin.md` long-form sidecar
 *      (or falling back to the main post.md body)
 *   2. Building the full paste-ready article body (LinkedIn Markdown subset)
 *   3. Writing a `.linkedin-article-prep.md` file to the post directory
 *   4. Printing the article title to stdout (for copy-paste)
 *   5. Opening the LinkedIn Article editor in the browser with a pre-filled
 *      title query param (LinkedIn supports `title=` in the new-article URL)
 *
 * Env vars:
 *   SITE_BASE_URL     — defaults to https://withagents.dev
 *   NO_BROWSER        — set to "1" to skip browser open (CI-safe)
 *
 * Usage:
 *   pnpm tsx scripts/syndication/linkedin/article-prep.ts <slug>
 *   pnpm tsx scripts/syndication/linkedin/article-prep.ts <slug> --no-browser
 *
 * Output files:
 *   posts/<slug>/<slug>.linkedin-article-prep.md   — paste-ready article body
 *
 * Exit codes:
 *   0 — prep file written, browser opened (or skipped)
 *   1 — post not found or parse error
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { ArticlePrepPayload, PostFrontmatter } from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const SITE_BASE_URL =
  (process.env.SITE_BASE_URL ?? "https://withagents.dev").replace(/\/$/, "");

/** LinkedIn new Article editor — supports `title=` pre-fill */
const LINKEDIN_ARTICLE_URL =
  "https://www.linkedin.com/pulse/new-article/";

// ---------------------------------------------------------------------------
// Frontmatter parser (mirrors share.ts — no shared runtime dep to keep files independent)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- YAML dynamic key access
      (fm as any)[key] = value.trim();
    }
    const tagLine = line.match(/^\s+-\s+(.+)$/);
    if (tagLine) {
      if (!fm.tags) fm.tags = [];
      fm.tags.push(tagLine[1].trim());
    }
  }

  if (typeof fm.series_number === "string") {
    fm.series_number = parseInt(fm.series_number, 10);
  }
  if (typeof fm.series_total === "string") {
    fm.series_total = parseInt(fm.series_total, 10);
  }

  return { fm, body: body.trim() };
}

// ---------------------------------------------------------------------------
// Body builder
// ---------------------------------------------------------------------------

/**
 * Builds the LinkedIn Article body.
 *
 * LinkedIn Article editor accepts a subset of Markdown-like formatting.
 * The editor does NOT render raw Markdown — it uses a rich-text UI.
 * So we produce clean, paste-friendly plain text with minimal decorations
 * that look good when pasted into the article body.
 *
 * Structure:
 *   - Original post body (stripped of MDX/JSX syntax)
 *   - Canonical URL footer
 *   - Tag line
 */
function buildArticleBody(
  body: string,
  fm: Partial<PostFrontmatter>,
  canonicalUrl: string
): string {
  // Strip MDX imports, JSX components, and raw HTML (not valid in LinkedIn editor)
  const cleaned = body
    .replace(/^import\s+.+$/gm, "")
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "")
    .replace(/<[A-Z][a-zA-Z]*[^>]*/g, "")
    .replace(/\/>/g, "")
    // Convert Mermaid/code blocks to a placeholder note
    .replace(
      /```mermaid[\s\S]*?```/g,
      "[Diagram: see original post at canonical URL below]"
    )
    // Strip image references that won't resolve in LinkedIn's editor
    .replace(/!\[.*?\]\(\.\.\/visuals\/.*?\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const tags = (fm.tags ?? [])
    .slice(0, 5)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const footer = [
    "---",
    "",
    `Originally published at: ${canonicalUrl}`,
    "",
    tags,
  ]
    .filter(Boolean)
    .join("\n");

  return `${cleaned}\n\n${footer}`;
}

// ---------------------------------------------------------------------------
// Cover image resolver
// ---------------------------------------------------------------------------

function findCoverImage(slug: string): string | null {
  const postDir = path.join(REPO_ROOT, "posts", slug);
  const candidates = [
    path.join(postDir, "assets", "hero.png"),
    path.join(postDir, "assets", "hero.jpg"),
    path.join(postDir, "assets", "cover.png"),
    path.join(postDir, "assets", "cover.jpg"),
    path.join(REPO_ROOT, "assets", slug, "hero.png"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return path.relative(REPO_ROOT, c);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Browser opener
// ---------------------------------------------------------------------------

function openBrowser(url: string): void {
  const platform = process.platform;
  try {
    if (platform === "darwin") {
      execSync(`open "${url}"`, { stdio: "ignore" });
    } else if (platform === "win32") {
      execSync(`start "" "${url}"`, { stdio: "ignore" });
    } else {
      execSync(`xdg-open "${url}"`, { stdio: "ignore" });
    }
  } catch {
    // Non-fatal — user can open manually
    console.error(`[article-prep] Could not open browser. Open manually:\n  ${url}`);
  }
}

// ---------------------------------------------------------------------------
// Main logic
// ---------------------------------------------------------------------------

async function prepArticle(slug: string, openBrowserFlag: boolean): Promise<void> {
  const postDir = path.join(REPO_ROOT, "posts", slug);
  const mainPostPath = path.join(postDir, "post.md");
  const longFormPath = path.join(postDir, `${slug}.linkedin.md`);
  const outputPath = path.join(postDir, `${slug}.linkedin-article-prep.md`);

  if (!fs.existsSync(mainPostPath)) {
    throw new Error(
      `Post not found: ${mainPostPath}\n` +
        `Ensure the slug matches a directory under posts/`
    );
  }

  // Load frontmatter from main post always
  const mainRaw = fs.readFileSync(mainPostPath, "utf-8");
  const { fm } = parseFrontmatter(mainRaw);

  // Body source: long-form LinkedIn sidecar > main post body
  let articleBody: string;
  if (fs.existsSync(longFormPath)) {
    const longRaw = fs.readFileSync(longFormPath, "utf-8");
    const parsed = parseFrontmatter(longRaw);
    articleBody = parsed.body;
    console.log(`[article-prep] Using long-form sidecar: ${longFormPath}`);
  } else {
    const { body } = parseFrontmatter(mainRaw);
    articleBody = body;
    console.log(`[article-prep] No sidecar found — using post.md body`);
  }

  const canonicalUrl = `${SITE_BASE_URL}/posts/${slug}`;
  const utmUrl =
    `${canonicalUrl}?utm_source=linkedin&utm_medium=article` +
    `&utm_campaign=withagents-launch&utm_content=${slug}`;

  const builtBody = buildArticleBody(articleBody, fm, canonicalUrl);
  const coverImagePath = findCoverImage(slug);

  const payload: ArticlePrepPayload = {
    slug,
    title: fm.title ?? slug,
    subtitle: fm.subtitle ?? "",
    canonicalUrl,
    utmUrl,
    coverImagePath,
    body: builtBody,
    generatedAt: new Date().toISOString(),
  };

  // Write prep file
  const prepFileContent = [
    `# LinkedIn Article — ${payload.title}`,
    ``,
    `**Generated:** ${payload.generatedAt}`,
    `**Canonical URL:** ${payload.canonicalUrl}`,
    `**UTM URL:** ${payload.utmUrl}`,
    `**Cover image:** ${payload.coverImagePath ?? "(none found — upload manually)"}`,
    ``,
    `---`,
    ``,
    `## PASTE THIS INTO LINKEDIN ARTICLE EDITOR`,
    ``,
    `### Title (copy-paste into "Headline" field):`,
    ``,
    `\`\`\``,
    payload.title,
    `\`\`\``,
    ``,
    `### Subtitle / tagline (optional "Tell your audience…" field):`,
    ``,
    `\`\`\``,
    payload.subtitle,
    `\`\`\``,
    ``,
    `### Article body (paste into the article editor body):`,
    ``,
    payload.body,
    ``,
    `---`,
    ``,
    `## MANUAL STEPS`,
    ``,
    `1. Open LinkedIn Article editor (link below or run with browser open)`,
    `2. Paste the title above into the Headline field`,
    `3. Paste the body above into the article body`,
    `4. Upload cover image: \`${payload.coverImagePath ?? "create or source a cover image"}\``,
    `5. Add canonical URL in article settings if the editor supports it`,
    `6. Preview, then Publish`,
    ``,
    `LinkedIn Article Editor: https://www.linkedin.com/pulse/new-article/`,
  ].join("\n");

  fs.writeFileSync(outputPath, prepFileContent + "\n");
  console.log(`[article-prep] Prep file written: ${outputPath}`);

  // Print key info for quick copy-paste
  console.log("\n" + "=".repeat(60));
  console.log("ARTICLE TITLE (copy this):");
  console.log(payload.title);
  console.log("=".repeat(60));
  console.log(`\nCanonical URL : ${payload.canonicalUrl}`);
  console.log(`Cover image   : ${payload.coverImagePath ?? "(none — upload manually)"}`);
  console.log(`\nPrep file saved to:\n  ${outputPath}`);

  // Build editor URL with title pre-fill
  // LinkedIn's article editor accepts ?title= — not documented but works as of 2025
  const editorUrl = new URL(LINKEDIN_ARTICLE_URL);
  editorUrl.searchParams.set("title", payload.title);
  const editorUrlStr = editorUrl.toString();

  console.log(`\nLinkedIn Article Editor:\n  ${editorUrlStr}`);

  if (openBrowserFlag) {
    console.log("\n[article-prep] Opening browser…");
    openBrowser(editorUrlStr);
  } else {
    console.log("\n[article-prep] Skipping browser open (--no-browser or NO_BROWSER=1)");
  }
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const noBrowser =
    args.includes("--no-browser") || process.env.NO_BROWSER === "1";
  const slug = args.find((a) => !a.startsWith("--"));

  if (!slug) {
    console.error(
      "Usage: pnpm tsx scripts/syndication/linkedin/article-prep.ts <slug> [--no-browser]"
    );
    process.exit(1);
  }

  try {
    await prepArticle(slug, !noBrowser);
  } catch (err) {
    console.error(`[article-prep] ERROR: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
