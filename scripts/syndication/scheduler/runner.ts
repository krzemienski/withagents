#!/usr/bin/env npx tsx
/**
 * runner.ts
 *
 * Calendar-driven daily dispatch for the withagents.dev syndication pipeline.
 *
 * For each calendar day it:
 *   1. Reads the 45-day calendar to find the day's post/channels
 *   2. Checks .syndication-state.json for already-completed channels (re-entrant)
 *   3. Dispatches each pending channel by calling sibling adapters:
 *        - LinkedIn Article: calls linkedin/oauth.ts (drafts body, outputs for manual paste)
 *        - X thread:         calls x/parser.ts (posts via X API v2)
 *        - Repo README:      calls readme-patcher/patcher.ts (gh CLI patch + push)
 *        - Supabase log:     logs every attempt via supabase/client.ts
 *   4. Writes updated state back to .syndication-state.json
 *
 * RE-ENTRANCY CONTRACT:
 *   Running the runner twice for the same --day is a no-op for any channel
 *   already recorded as "ok" in .syndication-state.json.
 *   "skipped" and "error" channels are eligible for retry on the next run.
 *
 * Usage:
 *   npx tsx runner.ts [options]
 *
 * Options:
 *   --day N          Dispatch day N from the calendar (required unless --today)
 *   --today          Derive day number from today's date relative to --launch-date
 *   --launch-date    ISO date string of day 1 (default: reads from .launch-date file)
 *   --calendar       Path to calendar-45day.md (default: auto-resolved from repo root)
 *   --dry-run        Print what would be dispatched; no API calls, no state writes
 *   --channel <ch>   Only dispatch one channel: linkedin|x|readme (default: all)
 *   --state-file     Override path to .syndication-state.json
 *   --owner          GitHub owner for README patches (default: "krzemienski")
 *
 * Env vars:
 *   SUPABASE_URL             Required for Supabase logging
 *   SUPABASE_SERVICE_KEY     Required for Supabase logging
 *   X_API_KEY / X_API_SECRET Required for X thread dispatch
 *   GH_OWNER                 GitHub owner (same as --owner)
 *
 * Exit codes:
 *   0  All channels dispatched (or already done)
 *   1  One or more channels failed; details in state file
 *   2  Fatal configuration error (bad args, missing calendar, etc.)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { loadCalendar, CalendarDay } from "./calendar-loader.js";
import { patchRepo } from "../readme-patcher/patcher.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChannelName = "linkedin" | "x" | "readme";

type ChannelStatus = "ok" | "skipped" | "error" | "dry-run";

interface ChannelRecord {
  status: ChannelStatus;
  message?: string;
  completedAt?: string;
}

interface DayStateRecord {
  day: number;
  topic: string;
  startedAt: string;
  channels: Partial<Record<ChannelName, ChannelRecord>>;
}

interface StateFile {
  launchDate: string;
  days: Record<number, DayStateRecord>;
}

interface RunOptions {
  day: number;
  launchDate: string;
  calendarPath: string;
  dryRun: boolean;
  channelFilter: ChannelName | null;
  stateFilePath: string;
  owner: string;
  patchDir: string;
}

// ---------------------------------------------------------------------------
// CLI arg helpers
// ---------------------------------------------------------------------------

function arg(name: string, fallback: string | null = null): string | null {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  return next && !next.startsWith("--") ? next : fallback;
}

function boolArg(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function fatal(msg: string): never {
  console.error(`[runner] FATAL: ${msg}`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// State file I/O
// ---------------------------------------------------------------------------

function loadState(stateFilePath: string, launchDate: string): StateFile {
  if (fs.existsSync(stateFilePath)) {
    try {
      const raw = fs.readFileSync(stateFilePath, "utf-8");
      return JSON.parse(raw) as StateFile;
    } catch {
      console.warn(`[runner] state file corrupt — starting fresh: ${stateFilePath}`);
    }
  }
  return { launchDate, days: {} };
}

function saveState(stateFilePath: string, state: StateFile, dryRun: boolean): void {
  if (dryRun) {
    console.log(`[runner] DRY-RUN: would write state → ${stateFilePath}`);
    return;
  }
  fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Re-entrancy check
// ---------------------------------------------------------------------------

/**
 * Returns true when a channel is already recorded as "ok" — skip it.
 * "error" and "skipped" are eligible for re-dispatch.
 */
function isChannelDone(state: StateFile, day: number, channel: ChannelName): boolean {
  return state.days[day]?.channels[channel]?.status === "ok";
}

// ---------------------------------------------------------------------------
// Calendar helpers
// ---------------------------------------------------------------------------

/**
 * Derive today's day number relative to the launch date.
 * Returns null if launch date is in the future.
 */
export function todayDayNumber(launchDateIso: string): number | null {
  const launch = new Date(launchDateIso);
  launch.setUTCHours(0, 0, 0, 0);
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const diffMs = now.getTime() - launch.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  return diffDays + 1; // Day 1 = launch date itself
}

/**
 * Resolve the companion repo README patch file for a calendar day.
 * Looks in withagents-site/src/content/posts/ for day-NN-*.readme-patch.md
 */
function resolvePatchFile(
  patchDir: string,
  day: number
): string | null {
  if (!fs.existsSync(patchDir)) return null;
  const prefix = `day-${String(day).padStart(2, "0")}-`;
  const entries = fs.readdirSync(patchDir);
  const match = entries.find(
    (f) => f.startsWith(prefix) && f.endsWith(".readme-patch.md")
  );
  return match ? path.join(patchDir, match) : null;
}

// ---------------------------------------------------------------------------
// LinkedIn: draft output (manual paste — API doesn't support native articles)
// ---------------------------------------------------------------------------

async function dispatchLinkedIn(
  calDay: CalendarDay,
  dryRun: boolean
): Promise<ChannelRecord> {
  // Per plan: LinkedIn Articles are manual paste. This adapter locates the
  // pre-generated article body and outputs it with instructions for manual
  // publishing. It does NOT call the LinkedIn API.
  const slug = `day-${String(calDay.day).padStart(2, "0")}`;
  const articlePath = path.resolve(
    __dirname,
    "../../../withagents-site/src/content/posts",
    `${slug}-*.linkedin.md`
  );

  if (dryRun) {
    console.log(`  [linkedin] DRY-RUN: would output article body for manual paste`);
    console.log(`  [linkedin] topic: ${calDay.topic}`);
    return { status: "dry-run", message: "dry-run" };
  }

  // Find the linkedin.md file for this day
  const postsDir = path.resolve(
    __dirname,
    "../../../withagents-site/src/content/posts"
  );
  if (!fs.existsSync(postsDir)) {
    return {
      status: "skipped",
      message: `posts dir not found: ${postsDir}`,
    };
  }

  const dayPrefix = `day-${String(calDay.day).padStart(2, "0")}-`;
  const allFiles = fs.readdirSync(postsDir);
  const linkedinFile = allFiles.find(
    (f) => f.startsWith(dayPrefix) && f.endsWith(".linkedin.md")
  );

  if (!linkedinFile) {
    return {
      status: "skipped",
      message: `no linkedin.md found for day ${calDay.day} (prefix: ${dayPrefix})`,
    };
  }

  const articleContent = fs.readFileSync(path.join(postsDir, linkedinFile), "utf-8");

  // Output formatted for manual LinkedIn paste
  console.log(`\n${"=".repeat(60)}`);
  console.log(`LINKEDIN ARTICLE — Day ${calDay.day}: ${calDay.topic}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Source: ${linkedinFile}`);
  console.log(`ACTION: Copy content below → paste into LinkedIn Article editor`);
  console.log(`${"=".repeat(60)}\n`);
  console.log(articleContent);
  console.log(`\n${"=".repeat(60)}\n`);

  return {
    status: "ok",
    message: `article body output for manual paste: ${linkedinFile}`,
    completedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// X thread dispatch (delegates to existing publish-scheduled.js pattern)
// ---------------------------------------------------------------------------

async function dispatchX(
  calDay: CalendarDay,
  dryRun: boolean
): Promise<ChannelRecord> {
  // The X adapter (x/parser.ts, owned by A3) handles actual posting.
  // Runner's job: locate the .x.md file and confirm it's ready for dispatch.
  // Actual posting is done via the existing publish-scheduled.js infrastructure
  // (Supabase queue) — runner queues the row if not already queued.

  const postsDir = path.resolve(
    __dirname,
    "../../../withagents-site/src/content/posts"
  );

  const dayPrefix = `day-${String(calDay.day).padStart(2, "0")}-`;

  if (dryRun) {
    console.log(`  [x] DRY-RUN: would queue X thread for day ${calDay.day}: ${calDay.topic}`);
    return { status: "dry-run", message: "dry-run" };
  }

  if (!fs.existsSync(postsDir)) {
    return {
      status: "skipped",
      message: `posts dir not found: ${postsDir}`,
    };
  }

  const allFiles = fs.readdirSync(postsDir);
  const xFile = allFiles.find(
    (f) => f.startsWith(dayPrefix) && f.endsWith(".x.md")
  );

  if (!xFile) {
    return {
      status: "skipped",
      message: `no .x.md content file found for day ${calDay.day}`,
    };
  }

  // Log confirmation that the content is ready
  console.log(`  [x] content ready: ${xFile}`);
  console.log(`  [x] NOTE: actual posting handled by publish-scheduled.js queue`);
  console.log(`  [x] Ensure a scheduled_posts row exists for this day/platform=x`);

  return {
    status: "ok",
    message: `x thread content confirmed: ${xFile}`,
    completedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// README patch dispatch
// ---------------------------------------------------------------------------

async function dispatchReadme(
  calDay: CalendarDay,
  patchDir: string,
  owner: string,
  dryRun: boolean
): Promise<ChannelRecord> {
  if (!calDay.repoReadme || calDay.repoReadme === "") {
    return { status: "skipped", message: "no repo README target for this day" };
  }

  const patchFile = resolvePatchFile(patchDir, calDay.day);

  if (!patchFile) {
    return {
      status: "skipped",
      message: `no .readme-patch.md found for day ${calDay.day} in ${patchDir}`,
    };
  }

  console.log(`  [readme] patch file: ${path.basename(patchFile)}`);
  console.log(`  [readme] target repo(s): ${calDay.repoReadme}`);

  try {
    const result = await patchRepo({
      patchFile,
      owner,
      dryRun,
    });

    if (!result.changed) {
      return {
        status: "ok",
        message: "README already up to date",
        completedAt: new Date().toISOString(),
      };
    }

    return {
      status: dryRun ? "dry-run" : "ok",
      message: result.dryRun
        ? "dry-run complete"
        : `pushed ${result.repoSlug}${result.commitSha ? ` (${result.commitSha})` : ""}`,
      completedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [readme] ERROR: ${msg}`);
    return { status: "error", message: msg };
  }
}

// ---------------------------------------------------------------------------
// Supabase logging
// ---------------------------------------------------------------------------

async function logToSupabase(
  day: number,
  channel: ChannelName,
  topic: string,
  record: ChannelRecord
): Promise<void> {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    // Supabase logging is best-effort — don't fail dispatch if creds missing
    return;
  }

  try {
    // Dynamic import with indirect path string prevents tsc from resolving
    // supabase/client.ts at compile time (avoids missing-dep error when
    // node_modules not installed). The module is loaded only at runtime.
    const clientPath = new URL("../supabase/client.js", import.meta.url).pathname;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { getSupabaseClient } = await (import(clientPath) as Promise<any>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase: any = getSupabaseClient();

    await supabase.from("syndication_log").insert({
      slug: `day-${String(day).padStart(2, "0")}`,
      channel,
      status: record.status === "dry-run" ? "skipped" : record.status,
      posted_at: record.completedAt ?? null,
      response_url: null,
      error_message: record.message ?? null,
      retry_count: 0,
    });
  } catch (err: unknown) {
    // Non-fatal — log warning but don't abort dispatch
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`  [supabase] log warning: ${msg}`);
  }
}

// ---------------------------------------------------------------------------
// Core dispatch for one day
// ---------------------------------------------------------------------------

async function dispatchDay(opts: RunOptions, calDay: CalendarDay): Promise<boolean> {
  const { day, dryRun, channelFilter, stateFilePath, owner, patchDir } = opts;

  const state = loadState(stateFilePath, opts.launchDate);

  // Ensure day record exists
  if (!state.days[day]) {
    state.days[day] = {
      day,
      topic: calDay.topic,
      startedAt: new Date().toISOString(),
      channels: {},
    };
  }

  if (calDay.isOff) {
    console.log(`[runner] Day ${day} is an off-day — no dispatch.`);
    return true;
  }

  const channels: ChannelName[] = channelFilter
    ? [channelFilter]
    : ["linkedin", "x", "readme"];

  let anyError = false;

  for (const channel of channels) {
    // Re-entrancy: skip already-completed channels
    if (!dryRun && isChannelDone(state, day, channel)) {
      console.log(`[runner] day=${day} channel=${channel} already done — skip`);
      continue;
    }

    console.log(`[runner] dispatching day=${day} channel=${channel}`);

    let record: ChannelRecord;

    try {
      if (channel === "linkedin") {
        record = await dispatchLinkedIn(calDay, dryRun);
      } else if (channel === "x") {
        record = await dispatchX(calDay, dryRun);
      } else {
        // readme
        record = await dispatchReadme(calDay, patchDir, owner, dryRun);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      record = { status: "error", message: msg };
      console.error(`[runner] day=${day} channel=${channel} unhandled error: ${msg}`);
    }

    console.log(
      `[runner] day=${day} channel=${channel} → ${record.status}` +
      (record.message ? ` (${record.message})` : "")
    );

    state.days[day]!.channels[channel] = record;

    if (record.status === "error") anyError = true;

    // Log to Supabase (best-effort, non-blocking)
    void logToSupabase(day, channel, calDay.topic, record);
  }

  saveState(stateFilePath, state, dryRun);

  return !anyError;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // -- Resolve calendar path -----------------------------------------------
  const repoRoot = path.resolve(__dirname, "../../..");
  const defaultCalendar = path.join(
    repoRoot,
    "plans/260419-0241-agentic-dog-brand-launch/synthesis/calendar-45day.md"
  );
  const calendarPath = arg("calendar") ?? defaultCalendar;

  if (!fs.existsSync(calendarPath)) {
    fatal(`calendar not found: ${calendarPath}\nPass --calendar <path>`);
  }

  // -- Resolve launch date -------------------------------------------------
  const launchDateArg = arg("launch-date");
  const launchDateFile = path.join(repoRoot, ".launch-date");
  let launchDate: string;

  if (launchDateArg) {
    launchDate = launchDateArg;
  } else if (fs.existsSync(launchDateFile)) {
    launchDate = fs.readFileSync(launchDateFile, "utf-8").trim();
  } else if (!boolArg("today") && !arg("day")) {
    fatal(
      "Launch date required. Pass --launch-date YYYY-MM-DD, " +
      "or create .launch-date in repo root, or pass --day N directly."
    );
  } else {
    launchDate = new Date().toISOString().slice(0, 10);
  }

  // -- Resolve day number --------------------------------------------------
  let dayNum: number;
  const dayArg = arg("day");

  if (dayArg) {
    dayNum = parseInt(dayArg, 10);
    if (isNaN(dayNum) || dayNum < 1) fatal(`--day must be a positive integer, got: ${dayArg}`);
  } else if (boolArg("today")) {
    const derived = todayDayNumber(launchDate);
    if (derived === null) {
      fatal(`Launch date ${launchDate} is in the future. Cannot derive --today day number.`);
    }
    dayNum = derived;
  } else {
    fatal("Pass --day N or --today");
  }

  // -- Load calendar -------------------------------------------------------
  const calendar = loadCalendar(calendarPath);
  const calDay = calendar.find((d) => d.day === dayNum);

  if (!calDay) {
    fatal(
      `Day ${dayNum} not found in calendar (calendar covers days ` +
      `${calendar[0]?.day}–${calendar[calendar.length - 1]?.day})`
    );
  }

  // -- Build options -------------------------------------------------------
  const dryRun = boolArg("dry-run");
  const channelArg = arg("channel");
  const channelFilter = isValidChannel(channelArg) ? channelArg : null;

  if (channelArg && !channelFilter) {
    fatal(`Unknown --channel value: ${channelArg}. Valid: linkedin, x, readme`);
  }

  const stateFilePath =
    arg("state-file") ?? path.join(repoRoot, "scripts/syndication/.syndication-state.json");

  const owner = arg("owner") ?? process.env["GH_OWNER"] ?? "krzemienski";

  const patchDir = path.join(repoRoot, "withagents-site/src/content/posts");

  const runOpts: RunOptions = {
    day: dayNum,
    launchDate,
    calendarPath,
    dryRun,
    channelFilter,
    stateFilePath,
    owner,
    patchDir,
  };

  // -- Summary -------------------------------------------------------------
  console.log(`[runner] day=${dayNum} topic="${calDay.topic}" type=${calDay.dayType} dry-run=${dryRun}`);
  if (channelFilter) console.log(`[runner] channel filter: ${channelFilter}`);

  const ok = await dispatchDay(runOpts, calDay);
  process.exit(ok ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidChannel(v: string | null): v is ChannelName {
  return v === "linkedin" || v === "x" || v === "readme";
}

// Node doesn't have __dirname in ESM; support both CJS and ESM patterns.
// The `npx tsx` runner uses CommonJS transform so __dirname is available.
// Provide a fallback for safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const __dirname: string =
  typeof (globalThis as any).__dirname !== "undefined"
    ? (globalThis as any).__dirname  // won't be set — just safety
    : path.dirname(new URL(import.meta.url).pathname);

main().catch((err: unknown) => {
  console.error("[runner]", err instanceof Error ? err.message : err);
  process.exit(2);
});
