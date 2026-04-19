/**
 * parse-readme-patch.ts
 *
 * Parses a `day-NN-{slug}.readme-patch.md` file into a structured object the
 * patcher can act on.
 *
 * File contract (based on existing day-01 and day-04 examples):
 *
 *   # README patch — {repo-slug}
 *
 *   ...optional prose instructions...
 *
 *   ---
 *
 *   ## Featured in
 *
 *   {block content — everything between the first `## Featured in` heading and
 *    the closing `---` separator, or EOF}
 *
 *   ---
 *
 * The parser extracts:
 *   - repoSlug  — from the H1 "# README patch — {slug}"
 *   - block     — the markdown block to inject between the HTML markers, including
 *                 the `## Featured in` heading itself
 *
 * Usage:
 *   import { parseReadmePatch } from "./parse-readme-patch.js";
 *   const patch = parseReadmePatch(fs.readFileSync("day-01-...readme-patch.md", "utf-8"));
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReadmePatch {
  /** Target repo slug, e.g. "validationforge" */
  repoSlug: string;
  /**
   * The full markdown block to inject between marker comments.
   * Always starts with `## Featured in` and contains the post cross-link.
   * Trimmed, no leading/trailing blank lines.
   */
  featuredInBlock: string;
  /** Source file path (informational, for error messages) */
  sourcePath: string;
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

/**
 * Parse a .readme-patch.md file content string into a ReadmePatch.
 * Throws a descriptive error if the required structure is missing.
 *
 * @param content  Raw file content
 * @param filePath Path string used in error messages (not read from disk here)
 */
export function parseReadmePatch(content: string, filePath: string): ReadmePatch {
  // -- Extract repo slug from H1 -------------------------------------------
  const h1Match = content.match(/^#\s+README\s+patch\s+[-–—]\s+(.+)$/im);
  if (!h1Match) {
    throw new Error(
      `[parse-readme-patch] ${filePath}: missing H1 "# README patch — {slug}"`
    );
  }
  const repoSlug = h1Match[1].trim();
  if (!repoSlug) {
    throw new Error(
      `[parse-readme-patch] ${filePath}: empty repo slug in H1`
    );
  }

  // -- Extract the ## Featured in block ------------------------------------
  // Strategy: find the first `## Featured in` heading, then collect everything
  // up to the next top-level `---` separator line at the start of a line, or EOF.
  const featuredInIdx = content.search(/^##\s+Featured in/im);
  if (featuredInIdx === -1) {
    throw new Error(
      `[parse-readme-patch] ${filePath}: missing "## Featured in" heading`
    );
  }

  const afterFeatured = content.slice(featuredInIdx);

  // Find a closing `---` that appears on its own line after the heading.
  // We skip the first line (the heading itself) to avoid matching a `---`
  // that might appear immediately after in the source preamble.
  const headingEnd = afterFeatured.indexOf("\n");
  const bodyAfterHeading = afterFeatured.slice(headingEnd + 1);

  // A separator line: `---` optionally surrounded by blank lines, at line start.
  const closingHrMatch = bodyAfterHeading.match(/^---\s*$/m);
  const blockBody = closingHrMatch
    ? bodyAfterHeading.slice(0, closingHrMatch.index).trimEnd()
    : bodyAfterHeading.trimEnd();

  const featuredInBlock = (
    afterFeatured.slice(0, headingEnd + 1) + blockBody
  ).trim();

  if (!featuredInBlock) {
    throw new Error(
      `[parse-readme-patch] ${filePath}: ## Featured in block is empty`
    );
  }

  return { repoSlug, featuredInBlock, sourcePath: filePath };
}

/**
 * Convenience: load a .readme-patch.md file from disk and parse it.
 */
export function loadReadmePatch(filePath: string): ReadmePatch {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`[parse-readme-patch] File not found: ${abs}`);
  }
  const content = fs.readFileSync(abs, "utf-8");
  return parseReadmePatch(content, abs);
}
