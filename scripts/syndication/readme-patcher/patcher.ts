#!/usr/bin/env npx tsx
/**
 * patcher.ts
 *
 * Clones a companion repo via `gh`, injects a "Featured in" block between
 * <!-- withagents-featured-start --> / <!-- withagents-featured-end --> markers
 * in its README.md, then commits and pushes.
 *
 * IDEMPOTENT: re-running replaces the existing marker block rather than
 * appending a duplicate. Running twice on the same patch file is a no-op
 * if the content is unchanged.
 *
 * Usage:
 *   npx tsx patcher.ts --patch <path-to.readme-patch.md> [options]
 *
 * Options:
 *   --patch <file>       Path to the .readme-patch.md file (required)
 *   --owner <handle>     GitHub owner/org (default: "krzemienski")
 *   --dry-run            Print what would change; do not push
 *   --tmp-dir <dir>      Override temp directory (default: OS temp + random)
 *   --commit-msg <msg>   Override commit message
 *
 * Requirements:
 *   gh CLI must be installed and authenticated (`gh auth status`).
 *   The target repo must exist under --owner on GitHub.
 *
 * Env vars (optional overrides):
 *   GH_OWNER             GitHub owner — same as --owner flag
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execSync, ExecSyncOptionsWithStringEncoding } from "node:child_process";
import { loadReadmePatch, ReadmePatch } from "./parse-readme-patch.js";

// ---------------------------------------------------------------------------
// Marker constants — must match README.md to enable idempotent replace
// ---------------------------------------------------------------------------

export const MARKER_START = "<!-- withagents-featured-start -->";
export const MARKER_END = "<!-- withagents-featured-end -->";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function arg(name: string, fallback: string | null = null): string | null {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  return next && !next.startsWith("--") ? next : (fallback ?? "");
}

function boolArg(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

// ---------------------------------------------------------------------------
// gh CLI guard
// ---------------------------------------------------------------------------

function assertGhCli(): void {
  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch {
    throw new Error(
      "[patcher] `gh` CLI not found. Install it from https://cli.github.com/ and run `gh auth login`."
    );
  }
}

// ---------------------------------------------------------------------------
// Shell helper
// ---------------------------------------------------------------------------

function run(
  cmd: string,
  cwd: string,
  dryRun: boolean,
  label: string
): string {
  if (dryRun) {
    console.log(`  DRY-RUN [${label}]: ${cmd}`);
    return "";
  }
  const opts: ExecSyncOptionsWithStringEncoding = {
    cwd,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  };
  try {
    return execSync(cmd, opts).trim();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[patcher] Command failed (${label}): ${cmd}\n${msg}`);
  }
}

// ---------------------------------------------------------------------------
// README injection
// ---------------------------------------------------------------------------

/**
 * Inject (or replace) the featured-in block between marker comments.
 *
 * If the README already contains both markers, the content between them is
 * replaced (idempotent). If no markers exist, the block is inserted just below
 * the first H1 heading (or at the very top if no H1 found).
 *
 * Returns the new README content. Throws if README is not found.
 */
export function injectFeaturedIn(
  readmePath: string,
  featuredInBlock: string
): { newContent: string; changed: boolean } {
  if (!fs.existsSync(readmePath)) {
    throw new Error(`[patcher] README not found: ${readmePath}`);
  }
  const original = fs.readFileSync(readmePath, "utf-8");

  const injected =
    `${MARKER_START}\n${featuredInBlock}\n${MARKER_END}`;

  // -- Replace existing markers (idempotent path) ---------------------------
  const startIdx = original.indexOf(MARKER_START);
  const endIdx = original.indexOf(MARKER_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = original.slice(0, startIdx);
    const after = original.slice(endIdx + MARKER_END.length);
    const newContent = `${before}${injected}${after}`;
    const changed = newContent !== original;
    return { newContent, changed };
  }

  // -- First-time insertion: below the first H1 heading --------------------
  const h1Match = original.match(/^(#\s+.+)(\r?\n)/m);
  if (h1Match && h1Match.index !== undefined) {
    const insertAt = h1Match.index + h1Match[0].length;
    const newContent =
      original.slice(0, insertAt) +
      "\n" + injected + "\n\n" +
      original.slice(insertAt);
    return { newContent, changed: true };
  }

  // -- Fallback: prepend to top --------------------------------------------
  const newContent = injected + "\n\n" + original;
  return { newContent, changed: true };
}

// ---------------------------------------------------------------------------
// Main patch flow
// ---------------------------------------------------------------------------

export interface PatchOptions {
  patchFile: string;
  owner?: string;
  dryRun?: boolean;
  tmpDir?: string;
  commitMsg?: string;
}

export interface PatchResult {
  repoSlug: string;
  changed: boolean;
  dryRun: boolean;
  cloneDir: string;
  commitSha: string | null;
}

export async function patchRepo(opts: PatchOptions): Promise<PatchResult> {
  const {
    patchFile,
    owner = process.env["GH_OWNER"] ?? "krzemienski",
    dryRun = false,
    tmpDir,
    commitMsg,
  } = opts;

  assertGhCli();

  // 1. Parse the patch file
  const patch: ReadmePatch = loadReadmePatch(patchFile);
  const { repoSlug, featuredInBlock } = patch;

  console.log(`[patcher] repo=${owner}/${repoSlug}  dry-run=${dryRun}`);

  // 2. Create a temp directory for the clone
  const baseDir = tmpDir ?? os.tmpdir();
  const cloneDir = fs.mkdtempSync(path.join(baseDir, `readme-patch-${repoSlug}-`));

  try {
    // 3. Clone via gh CLI (shallow clone, default branch only)
    console.log(`[patcher] cloning ${owner}/${repoSlug} → ${cloneDir}`);
    run(
      `gh repo clone ${owner}/${repoSlug} . -- --depth 1 --quiet`,
      cloneDir,
      dryRun,
      "clone"
    );

    // 4. Locate README (case-insensitive fallback)
    const readmePath = resolveReadme(cloneDir, dryRun);

    // 5. Inject the block
    const { newContent, changed } = dryRun
      ? previewInjection(cloneDir, featuredInBlock)
      : injectFeaturedIn(readmePath, featuredInBlock);

    if (!changed) {
      console.log("[patcher] README already up to date — no changes needed.");
      return { repoSlug, changed: false, dryRun, cloneDir, commitSha: null };
    }

    if (!dryRun) {
      fs.writeFileSync(readmePath, newContent, "utf-8");
    } else {
      console.log(`\n--- DRY-RUN: new README content (first 800 chars) ---`);
      console.log(newContent.slice(0, 800));
      console.log("---");
    }

    // 6. Commit and push
    const msg = commitMsg ?? `docs: add withagents.dev "Featured in" section`;
    run(`git add README.md`, cloneDir, dryRun, "git-add");
    run(`git diff --cached --quiet && echo "no-diff" || echo "has-diff"`, cloneDir, false, "diff-check");

    const commitOut = run(
      `git commit -m "${msg.replace(/"/g, '\\"')}"`,
      cloneDir,
      dryRun,
      "git-commit"
    );

    const pushOut = run(`git push`, cloneDir, dryRun, "git-push");
    void pushOut;

    // Extract commit SHA from commit output (e.g. "[main abc1234]")
    const shaMatch = commitOut.match(/\[[\w/]+\s+([0-9a-f]{6,})\]/);
    const commitSha = shaMatch ? shaMatch[1] : null;

    console.log(`[patcher] OK — pushed ${repoSlug}${commitSha ? ` (${commitSha})` : ""}`);
    return { repoSlug, changed: true, dryRun, cloneDir, commitSha };
  } finally {
    // 7. Clean up clone unless dry-run (leave it for inspection)
    if (!dryRun && fs.existsSync(cloneDir)) {
      fs.rmSync(cloneDir, { recursive: true, force: true });
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find README.md in the clone dir (case-insensitive search for robustness).
 */
function resolveReadme(cloneDir: string, dryRun: boolean): string {
  const candidates = ["README.md", "Readme.md", "readme.md", "README.MD"];
  for (const name of candidates) {
    const p = path.join(cloneDir, name);
    if (dryRun || fs.existsSync(p)) return p;
  }
  // Default to README.md — will be created by injectFeaturedIn if needed
  return path.join(cloneDir, "README.md");
}

/**
 * Dry-run preview: construct what the new content would look like even without
 * a real clone on disk.
 */
function previewInjection(
  cloneDir: string,
  featuredInBlock: string
): { newContent: string; changed: boolean } {
  const readmePath = path.join(cloneDir, "README.md");
  if (fs.existsSync(readmePath)) {
    return injectFeaturedIn(readmePath, featuredInBlock);
  }
  // No README on disk (dry-run, no clone happened): show what we'd insert
  const injected = `${MARKER_START}\n${featuredInBlock}\n${MARKER_END}`;
  return { newContent: injected, changed: true };
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

if (process.argv[1] && path.basename(process.argv[1]) === "patcher.ts") {
  (async () => {
    const patchFile = arg("patch");
    if (!patchFile) {
      console.error("Usage: npx tsx patcher.ts --patch <file> [--owner <owner>] [--dry-run]");
      process.exit(1);
    }

    try {
      const result = await patchRepo({
        patchFile,
        owner: arg("owner") ?? undefined,
        dryRun: boolArg("dry-run"),
        tmpDir: arg("tmp-dir") ?? undefined,
        commitMsg: arg("commit-msg") ?? undefined,
      });

      if (result.dryRun) {
        console.log("[patcher] dry-run complete — nothing pushed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(msg);
      process.exit(1);
    }
  })();
}
