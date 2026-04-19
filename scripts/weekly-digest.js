#!/usr/bin/env node
/**
 * Weekly metrics digest for the blog-series-ai campaign.
 *
 * Pulls from:
 *   - Supabase scheduled_posts + post_publish_log — what actually shipped
 *   - post_publish_log responses — platform-specific response payloads
 * Produces a markdown report per week to:
 *   assets/campaigns/260418-blog-series-ai/reports/week-NN.md
 *
 * NOTE: Rich metrics (impressions, clicks, follows, LI reactions) require
 * separate X/LI API calls to their analytics endpoints. This first version
 * reports publish-level success and captures metric placeholders the user
 * fills in manually OR a subsequent pass enriches from platform APIs.
 *
 * Args:
 *   --week N              week number (1-5), relative to launch Apr 27
 *   --launch YYYY-MM-DD   launch date (default 2026-04-27)
 *   --dry-run             print report to stdout, don't write file
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
const LAUNCH = arg("launch", "2026-04-27");
const WEEK = Number(arg("week", "1"));
const DRY_RUN = arg("dry-run", false) === true;

function weekRange(launchDate, weekNum) {
  const launch = new Date(launchDate + "T00:00:00.000Z");
  const start = new Date(launch.getTime());
  start.setUTCDate(start.getUTCDate() + (weekNum - 1) * 7);
  const end = new Date(start.getTime() + 7 * 24 * 3600 * 1000);
  return { start, end };
}

async function main() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERROR: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { start, end } = weekRange(LAUNCH, WEEK);
  console.error(`Week ${WEEK}: ${start.toISOString()} → ${end.toISOString()}`);

  const { data: posted, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("status", "posted")
    .gte("posted_at", start.toISOString())
    .lt("posted_at", end.toISOString())
    .order("posted_at");
  if (error) throw new Error(`Query failed: ${error.message}`);

  const { data: failed } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("status", "failed")
    .gte("scheduled_for", start.toISOString())
    .lt("scheduled_for", end.toISOString())
    .order("scheduled_for");

  const byPlatform = {};
  for (const row of posted ?? []) {
    byPlatform[row.platform] = (byPlatform[row.platform] ?? 0) + 1;
  }

  const md = [
    `# Week ${WEEK} Digest — blog-series-ai`,
    "",
    `**Window:** ${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`,
    `**Posted:** ${posted?.length ?? 0} · **Failed:** ${failed?.length ?? 0}`,
    "",
    "## By platform",
    "",
    "| Platform | Posted |",
    "|---|---|",
    ...["x", "linkedin", "linkedin-article"].map(
      (p) => `| ${p} | ${byPlatform[p] ?? 0} |`
    ),
    "",
    "## Published posts (in order)",
    "",
    "| When (UTC) | Platform | Post | URL |",
    "|---|---|---|---|",
    ...(posted ?? []).map(
      (r) =>
        `| ${r.posted_at?.slice(0, 16) ?? ""} | ${r.platform} | ${r.post_slug} | ${r.posted_url ? `[link](${r.posted_url})` : "—"} |`
    ),
    "",
    "## Failed attempts",
    "",
    failed && failed.length > 0
      ? [
          "| Platform | Post | Error | Attempt |",
          "|---|---|---|---|",
          ...failed.map(
            (r) =>
              `| ${r.platform} | ${r.post_slug} | ${(r.error_message ?? "").slice(0, 100)} | ${r.attempt_count}/${r.max_attempts} |`
          ),
        ].join("\n")
      : "None.",
    "",
    "## Platform metrics (fill in manually or from API enrichment pass)",
    "",
    "- X impressions (sum over the week): _TODO_",
    "- X net new followers: _TODO_",
    "- LinkedIn post impressions: _TODO_",
    "- LinkedIn reactions total: _TODO_",
    "- GitHub stars gained on companion repos: _TODO_",
    "- Newsletter signups (if wired): _TODO_",
    "- Inbound DMs worth responding to: _TODO_",
    "",
    "## Action items for next week",
    "",
    "- _TODO — top-performer deserves a follow-up thread?_",
    "- _TODO — any failure recurring?_",
    "- _TODO — any post where the hook undersold the content?_",
    "",
    "---",
    "",
    `_Generated ${new Date().toISOString()}_`,
  ].join("\n");

  if (DRY_RUN) {
    console.log(md);
    return;
  }

  const outDir = path.join(
    REPO_ROOT,
    "assets/campaigns/260418-blog-series-ai/reports"
  );
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `week-${String(WEEK).padStart(2, "0")}.md`);
  fs.writeFileSync(outFile, md, "utf-8");
  console.log(`✔ Wrote ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
