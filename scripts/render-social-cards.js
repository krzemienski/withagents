#!/usr/bin/env node
/**
 * Social Card Renderer
 *
 * Renders the per-post HTML card templates (hero, twitter, linkedin) to PNG
 * using headless Chromium via Puppeteer. Outputs to:
 *   assets/campaigns/260418-blog-series-ai/creatives/cards/post-NN-slug/{hero,twitter,linkedin}.png
 *
 * Usage:
 *   node scripts/render-social-cards.js                      # render all 18 posts
 *   node scripts/render-social-cards.js post-01-series-launch  # render one post
 *   node scripts/render-social-cards.js --dry-run            # list what would render
 */

const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(REPO_ROOT, "posts");
const OUT_DIR = path.join(
  REPO_ROOT,
  "assets/campaigns/260418-blog-series-ai/creatives/cards"
);

const CARDS = [
  { name: "hero", file: "hero-card.html", w: 1200, h: 630 },
  { name: "twitter", file: "twitter-card.html", w: 1200, h: 628 },
  { name: "linkedin", file: "linkedin-card.html", w: 1200, h: 627 },
];

async function render({ dryRun = false, only = null } = {}) {
  const allPostDirs = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("post-"))
    .map((d) => d.name)
    .sort();

  const targets = only ? allPostDirs.filter((s) => s === only) : allPostDirs;

  if (targets.length === 0) {
    console.error(`No posts matched. Available: ${allPostDirs.join(", ")}`);
    process.exit(1);
  }

  if (dryRun) {
    targets.forEach((slug) => {
      CARDS.forEach((c) => {
        const src = path.join(POSTS_DIR, slug, "assets", c.file);
        const exists = fs.existsSync(src) ? "EXISTS" : "MISSING";
        console.log(`${exists}  ${slug}/${c.name}.png  ←  ${c.file}`);
      });
    });
    return;
  }

  // Lazy require so --dry-run doesn't need puppeteer installed
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({ headless: "new" });

  let rendered = 0;
  let skipped = 0;

  for (const slug of targets) {
    const outDir = path.join(OUT_DIR, slug);
    fs.mkdirSync(outDir, { recursive: true });

    for (const c of CARDS) {
      const src = path.join(POSTS_DIR, slug, "assets", c.file);
      if (!fs.existsSync(src)) {
        console.warn(`SKIP  ${slug}/${c.name}: source ${c.file} missing`);
        skipped++;
        continue;
      }

      const out = path.join(outDir, `${c.name}.png`);
      const page = await browser.newPage();
      await page.setViewport({
        width: c.w,
        height: c.h,
        deviceScaleFactor: 2, // retina render
      });
      await page.goto(`file://${src}`, { waitUntil: "networkidle0" });
      await page.screenshot({ path: out, type: "png", omitBackground: false });
      await page.close();

      const sizeKb = Math.round(fs.statSync(out).size / 1024);
      console.log(`OK    ${slug}/${c.name}.png  (${sizeKb}KB)`);
      rendered++;
    }
  }

  await browser.close();
  console.log(`\nDone. Rendered ${rendered}, skipped ${skipped}.`);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const only = args.find((a) => a.startsWith("post-"));

render({ dryRun, only }).catch((err) => {
  console.error(err);
  process.exit(1);
});
