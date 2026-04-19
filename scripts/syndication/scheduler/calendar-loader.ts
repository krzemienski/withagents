/**
 * calendar-loader.ts
 *
 * Parses `synthesis/calendar-45day.md` markdown table into CalendarDay objects.
 *
 * The calendar table columns (in order) are:
 *   Day | Day-type | Product/topic | Mode-bet | withagents.dev blog |
 *   LinkedIn Article | X thread | Repo README | Draft source | Setup for next post
 *
 * Usage:
 *   import { loadCalendar } from "./calendar-loader.js";
 *   const days = loadCalendar("/path/to/calendar-45day.md");
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Types (local — shared/types.ts has the canonical CalendarDay export but
// we keep the full field set here for the scheduler's needs)
// ---------------------------------------------------------------------------

export type DayType =
  | "FLAGSHIP"
  | "Product"
  | "Insight"
  | "Meta"
  | "Skills-track"
  | "Devlog"
  | "Off";

export type ModeBet = "SDK" | "Interactive" | "Non-Interactive" | "Mixed" | "—";

export interface CalendarDay {
  /** 1-based day number from the calendar */
  day: number;
  dayType: DayType;
  /** Product/topic string as-written in the table */
  topic: string;
  modeBet: ModeBet;
  /** Repo README slug(s) — empty string when the cell is "—" */
  repoReadme: string;
  /** True when the day row is marked FLAGSHIP */
  isFlagship: boolean;
  /** True when this is an off-day (no content dispatch) */
  isOff: boolean;
}

// ---------------------------------------------------------------------------
// Column indices (0-based) in the parsed table row
// ---------------------------------------------------------------------------

const COL = {
  DAY: 0,
  DAY_TYPE: 1,
  TOPIC: 2,
  MODE_BET: 3,
  BLOG: 4,
  LINKEDIN: 5,
  X_THREAD: 6,
  REPO_README: 7,
  DRAFT_SOURCE: 8,
  SETUP_NEXT: 9,
} as const;

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Load and parse the calendar markdown table.
 *
 * @param calendarPath  Absolute or relative path to calendar-45day.md
 */
export function loadCalendar(calendarPath: string): CalendarDay[] {
  const abs = path.resolve(calendarPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`[calendar-loader] File not found: ${abs}`);
  }
  const content = fs.readFileSync(abs, "utf-8");
  return parseCalendarContent(content, abs);
}

/**
 * Parse raw markdown content. Exported for unit-testing without disk I/O.
 */
export function parseCalendarContent(
  content: string,
  sourcePath = "<string>"
): CalendarDay[] {
  const lines = content.split("\n");
  const days: CalendarDay[] = [];

  // Find the first line that looks like a table header containing "Day"
  let tableStarted = false;
  let headerSeen = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Detect table header row
    if (!tableStarted && /^\|\s*\*?\*?Day\*?\*?\s*\|/.test(line)) {
      tableStarted = true;
      headerSeen = false;
      continue;
    }

    // Skip the separator row (|---|---|...)
    if (tableStarted && !headerSeen && /^\|[-:| ]+\|/.test(line)) {
      headerSeen = true;
      continue;
    }

    // Parse data rows
    if (tableStarted && headerSeen && line.startsWith("|") && line.endsWith("|")) {
      const day = parseTableRow(line, sourcePath);
      if (day !== null) {
        days.push(day);
      }
      continue;
    }

    // A blank line or non-table line after the table has started ends the table
    if (tableStarted && headerSeen && !line.startsWith("|") && line !== "") {
      // Don't break — the calendar-45day.md has annotation sections between
      // the table rows. Keep scanning in case there are more rows.
    }
  }

  if (days.length === 0) {
    throw new Error(
      `[calendar-loader] ${sourcePath}: no calendar rows parsed. ` +
      `Check that the markdown table is present and formatted correctly.`
    );
  }

  return days;
}

// ---------------------------------------------------------------------------
// Row parser
// ---------------------------------------------------------------------------

function parseTableRow(line: string, sourcePath: string): CalendarDay | null {
  // Split on `|`, drop first and last empty elements
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());

  if (cells.length < COL.REPO_README + 1) return null;

  // -- Day number -----------------------------------------------------------
  // Cells may contain bold markers: **01** or plain 01
  const rawDay = cells[COL.DAY]!.replace(/\*+/g, "").trim();
  const dayNum = parseInt(rawDay, 10);
  if (isNaN(dayNum)) return null;

  // -- Day type -------------------------------------------------------------
  const rawType = cells[COL.DAY_TYPE]!.replace(/\*+/g, "").trim();
  const isFlagship = rawType.toUpperCase() === "FLAGSHIP";
  const dayType = normalizeDayType(rawType);

  // -- Off day detection ----------------------------------------------------
  const isOff = dayType === "Off";

  // -- Topic ----------------------------------------------------------------
  const topic = cells[COL.TOPIC]!.replace(/\*+/g, "").trim();

  // -- Mode bet -------------------------------------------------------------
  const modeBet = normalizeModeBet(cells[COL.MODE_BET]!);

  // -- Repo README ----------------------------------------------------------
  const rawReadme = cells[COL.REPO_README]!.replace(/`/g, "").trim();
  const repoReadme = rawReadme === "—" || rawReadme === "-" || rawReadme === "" ? "" : rawReadme;

  return {
    day: dayNum,
    dayType,
    topic,
    modeBet,
    repoReadme,
    isFlagship,
    isOff,
  };
}

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

function normalizeDayType(raw: string): DayType {
  const s = raw.toUpperCase();
  if (s === "FLAGSHIP") return "FLAGSHIP";
  if (s === "PRODUCT") return "Product";
  if (s === "INSIGHT") return "Insight";
  if (s === "META") return "Meta";
  if (s.startsWith("SKILLS")) return "Skills-track";
  if (s === "DEVLOG") return "Devlog";
  if (s === "OFF") return "Off";
  // Unknown types default to Off to prevent unintended dispatch
  return "Off";
}

function normalizeModeBet(raw: string): ModeBet {
  const s = raw.trim();
  if (s === "SDK") return "SDK";
  if (s === "Interactive") return "Interactive";
  if (s === "Non-Interactive") return "Non-Interactive";
  if (s === "Mixed" || s === "Mix") return "Mixed";
  return "—";
}
