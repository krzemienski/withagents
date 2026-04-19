#!/usr/bin/env node
/**
 * Seed scheduled_posts from the campaign-execution.md cluster calendar.
 *
 * Cluster schedule (from briefs/campaign-execution.md §3, anchored to user's
 * launch decision of Mon 2026-04-27):
 *
 *   Day 0 (Mon Apr 27): all 18 posts go live on the site
 *   Week 1 (Apr 28-May  3): cluster 1 — Posts 1, 2, 9
 *   Week 2 (May  4-May 10): cluster 2 — Posts 3, 7, 8, 15
 *   Week 3 (May 11-May 17): cluster 3 — Posts 4, 5, 10
 *   Week 4 (May 18-May 24): cluster 4 — Posts 6, 11, 14, 16
 *   Week 5 (May 25-May 31): cluster 5 — Posts 12, 13, 17, 18
 *
 * For each post, schedule three rows:
 *   - X thread       at 09:00 ET on the post's promo day
 *   - LinkedIn essay at 10:00 ET on the same day
 *   - LinkedIn article at 10:30 ET on the same day
 *
 * Env required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Args:
 *   --launch YYYY-MM-DD   override default launch Monday (2026-04-27)
 *   --account LABEL       account label to attach (default 'nick-personal')
 *   --dry-run             print what would be inserted, don't write
 */

const path = require("node:path");
const fs = require("node:fs");
const { createClient } = require(path.resolve(__dirname, "..", "site", "node_modules", "@supabase/supabase-js"));

function arg(name, fallback = null) {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  return next && !next.startsWith("--") ? next : true;
}

const REPO_ROOT = path.resolve(__dirname, "..");
const ACCOUNT = arg("account", "nick-personal");
const DRY_RUN = arg("dry-run", false) === true;
const LAUNCH = arg("launch", "2026-04-27");

// Cluster post numbers
const CLUSTERS = [
  { week: 1, post_numbers: [1, 2, 9] },
  { week: 2, post_numbers: [3, 7, 8, 15] },
  { week: 3, post_numbers: [4, 5, 10] },
  { week: 4, post_numbers: [6, 11, 14, 16] },
  { week: 5, post_numbers: [12, 13, 17, 18] },
];

// Promo days per cluster (Mon..Fri, post N gets day N within cluster)
function promoDay(launchDate, week, indexInCluster) {
  const launch = new Date(launchDate + "T13:00:00.000Z"); // ET = UTC-4 (DST), 09:00 ET = 13:00 UTC
  const dayOffset = (week - 1) * 7 + 1 + indexInCluster; // Tue, Wed, Thu, Fri of that week
  const promo = new Date(launch.getTime());
  promo.setUTCDate(promo.getUTCDate() + dayOffset);
  return promo;
}

// Hour offsets in ET, expressed as UTC offsets after DST math
const SLOT_OFFSETS_HOURS = {
  x: 0,            // 09:00 ET
  linkedin: 1,     // 10:00 ET
  "linkedin-article": 1.5, // 10:30 ET
};

function listPostDirs() {
  const dir = path.join(REPO_ROOT, "posts");
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^post-\d+/.test(d.name))
    .map((d) => d.name)
    .sort();
}

function dirByPostNumber(dirs) {
  const map = {};
  for (const d of dirs) {
    const m = d.match(/^post-(\d+)/);
    if (m) map[Number(m[1])] = d;
  }
  return map;
}

function imagePathFor(slug, platform) {
  const cardName = platform === "x" ? "twitter" : "linkedin";
  return path.join(
    "assets/campaigns/260418-blog-series-ai/creatives/cards",
    slug,
    `${cardName}.png`
  );
}

async function main() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const slugByNumber = dirByPostNumber(listPostDirs());

  const rows = [];
  for (const cluster of CLUSTERS) {
    cluster.post_numbers.forEach((postNum, i) => {
      const slug = slugByNumber[postNum];
      if (!slug) {
        console.warn(`Missing post directory for #${postNum}; skipping`);
        return;
      }

      const promo = promoDay(LAUNCH, cluster.week, i);

      for (const [platform, hourOffset] of Object.entries(SLOT_OFFSETS_HOURS)) {
        const scheduledFor = new Date(promo.getTime() + hourOffset * 3600 * 1000);
        const contentRef =
          platform === "x" ? `posts/${slug}/social/twitter.md`
          : platform === "linkedin" ? `posts/${slug}/social/linkedin.md`
          : `posts/${slug}/social/linkedin-article.md`;

        rows.push({
          post_slug: slug,
          platform,
          account_label: ACCOUNT,
          content_ref: contentRef,
          image_ref: imagePathFor(slug, platform),
          scheduled_for: scheduledFor.toISOString(),
          status: "pending",
          attempt_count: 0,
          max_attempts: 3,
        });
      }
    });
  }

  console.log(`Prepared ${rows.length} rows across ${CLUSTERS.length} weeks.`);

  if (DRY_RUN) {
    rows.forEach((r) => console.log(`${r.scheduled_for}  ${r.platform.padEnd(20)} ${r.post_slug}`));
    return;
  }

  // Wipe existing rows for this campaign before reseeding (safe: we don't lose
  // already-posted history because that lives in post_publish_log)
  const { error: delErr } = await supabase
    .from("scheduled_posts")
    .delete()
    .in("status", ["pending", "failed"]);
  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);

  // Batch insert
  const { error } = await supabase.from("scheduled_posts").insert(rows);
  if (error) throw new Error(`Insert failed: ${error.message}`);

  console.log(`✔ Inserted ${rows.length} scheduled_posts rows.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
