/**
 * Parser for .x.md thread files.
 *
 * ## .x.md format spec
 *
 * Files may be named in either of two patterns:
 *   - `day-NN-{post-slug}.x.md`  — day-keyed (plan spec, schedule-driven)
 *   - `{post-slug}.x.md`         — post-keyed (parallel to .linkedin-short.md)
 *
 * When the day-NN prefix is present, `daySlug` is populated (e.g. "day-01").
 * When absent, `daySlug` is null and `postSlug` is the full filename stem.
 *
 * The file contains:
 *
 * ```markdown
 * ---
 * canonical_url: https://withagents.dev/blog/post-slug/
 * utm_campaign: validationforge-ga
 * ---
 *
 * <!-- Tweet 1 [142 chars] -->
 * I spent 4,500 sessions teaching AI to code. Here's what nobody tells you about agentic development:
 *
 * <!-- Tweet 2 [198 chars] -->
 * The first thing I learned: agents don't "think" — they pattern-match at scale...
 *
 * <!-- Tweet N [NN chars] -->
 * ...
 * ```
 *
 * Rules:
 * - Frontmatter is required (canonical_url, utm_campaign).
 * - Each tweet is introduced by a comment `<!-- Tweet N [NN chars] -->`.
 * - Tweet body is the non-empty text following the comment until the next comment or EOF.
 * - Annotated char count must match actual text length (after trimming trailing whitespace).
 * - Thread must contain 7-12 tweets.
 * - No individual tweet may exceed 280 chars.
 * - First tweet gets utmUrl appended if no URL is already in the body
 *   (parser does NOT mutate the source file — caller passes utmUrl to thread.ts for injection).
 */

import { readFileSync } from 'fs';
import { basename } from 'path';
import type { Tweet, XThread } from './types.js';

/** Matches `<!-- Tweet N [NN chars] -->` with N and char count captured. */
const TWEET_HEADER_RE = /^<!--\s*Tweet\s+(\d+)\s+\[(\d+)\s*chars?\]\s*-->$/i;

/** Matches YAML frontmatter block at top of file. */
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

/** Extracts a scalar string value from minimal YAML (key: value on one line). */
function extractYamlScalar(yaml: string, key: string): string | undefined {
  const re = new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm');
  const m = yaml.match(re);
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
}

export interface ParseError {
  file: string;
  message: string;
}

export type ParseResult =
  | { ok: true; thread: XThread }
  | { ok: false; errors: ParseError[] };

/**
 * Builds a UTM-tagged URL from the canonical URL and campaign.
 * utm_source=x, utm_medium=social, utm_campaign={campaign}.
 */
export function buildUtmUrl(canonicalUrl: string, campaign: string): string {
  const url = new URL(canonicalUrl);
  url.searchParams.set('utm_source', 'x');
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

/**
 * Extracts daySlug and postSlug from filename.
 *
 * Accepts two patterns:
 *   - `day-NN-{post-slug}.x.md` → { daySlug: 'day-01', postSlug: 'some-post' }
 *   - `{post-slug}.x.md`        → { daySlug: null,     postSlug: 'some-post' }
 */
function parseFilename(filename: string): { daySlug: string | null; postSlug: string } {
  const name = filename.replace(/\.x\.md$/, '');
  const m = name.match(/^(day-\d+)-(.+)$/);
  if (m) {
    return { daySlug: m[1], postSlug: m[2] };
  }
  // No day prefix — treat full stem as post slug.
  return { daySlug: null, postSlug: name };
}

/**
 * Parses a .x.md file from disk.
 *
 * Fail-fast: collects ALL validation errors before returning so caller can
 * display the complete problem list rather than fixing one error at a time.
 */
export function parseThreadFile(filePath: string): ParseResult {
  const errors: ParseError[] = [];
  const filename = basename(filePath);

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    return {
      ok: false,
      errors: [{ file: filename, message: `Cannot read file: ${(err as Error).message}` }],
    };
  }

  // --- Frontmatter ---
  const fmMatch = raw.match(FRONTMATTER_RE);
  if (!fmMatch) {
    errors.push({ file: filename, message: 'Missing YAML frontmatter (--- block).' });
    return { ok: false, errors };
  }

  const yaml = fmMatch[1];
  const canonicalUrl = extractYamlScalar(yaml, 'canonical_url');
  const utmCampaign = extractYamlScalar(yaml, 'utm_campaign');

  if (!canonicalUrl) {
    errors.push({ file: filename, message: 'Frontmatter missing required field: canonical_url' });
  } else {
    try {
      new URL(canonicalUrl); // validate it's a real URL
    } catch {
      errors.push({
        file: filename,
        message: `canonical_url is not a valid URL: "${canonicalUrl}"`,
      });
    }
  }

  if (!utmCampaign) {
    errors.push({ file: filename, message: 'Frontmatter missing required field: utm_campaign' });
  }

  if (errors.length > 0) return { ok: false, errors };

  // At this point canonicalUrl and utmCampaign are defined (errors would have returned above)
  const url = canonicalUrl!;
  const campaign = utmCampaign!;

  // --- Filename slug extraction ---
  let daySlug: string | null;
  let postSlug: string;
  try {
    ({ daySlug, postSlug } = parseFilename(filename));
  } catch (err) {
    errors.push({ file: filename, message: (err as Error).message });
    return { ok: false, errors };
  }

  // --- Tweet block parsing ---
  const bodyAfterFrontmatter = raw.slice(fmMatch[0].length);
  const lines = bodyAfterFrontmatter.split(/\r?\n/);

  const tweets: Tweet[] = [];
  let currentIndex: number | null = null;
  let currentAnnotatedCount: number | null = null;
  let currentLines: string[] = [];

  function flushTweet(): void {
    if (currentIndex === null) return;

    const text = currentLines
      .join('\n')
      .replace(/\n+$/, '') // strip trailing newlines
      .trimEnd();

    const actualCount = [...text].length; // Unicode-aware char count

    if (actualCount === 0) {
      errors.push({
        file: filename,
        message: `Tweet ${currentIndex} has empty body.`,
      });
    } else if (actualCount > 280) {
      errors.push({
        file: filename,
        message: `Tweet ${currentIndex} exceeds 280 chars: ${actualCount} chars.`,
      });
    } else if (currentAnnotatedCount !== null && actualCount !== currentAnnotatedCount) {
      errors.push({
        file: filename,
        message: `Tweet ${currentIndex} annotated as [${currentAnnotatedCount} chars] but actual body is ${actualCount} chars.`,
      });
    }

    tweets.push({
      index: currentIndex,
      text,
      annotatedCharCount: currentAnnotatedCount ?? actualCount,
    });

    currentIndex = null;
    currentAnnotatedCount = null;
    currentLines = [];
  }

  for (const line of lines) {
    const headerMatch = line.trim().match(TWEET_HEADER_RE);
    if (headerMatch) {
      flushTweet();
      const parsedIndex = parseInt(headerMatch[1], 10);
      const parsedCount = parseInt(headerMatch[2], 10);

      // Validate sequential ordering
      if (tweets.length > 0 && parsedIndex !== tweets.length + 1) {
        errors.push({
          file: filename,
          message: `Tweet headers are out of order: expected ${tweets.length + 1}, got ${parsedIndex}.`,
        });
      }

      currentIndex = parsedIndex;
      currentAnnotatedCount = parsedCount;
    } else if (currentIndex !== null) {
      currentLines.push(line);
    }
    // Lines before the first tweet header are ignored (blank lines / comments).
  }
  flushTweet(); // flush the last tweet

  // --- Thread-level validation ---
  if (tweets.length < 7) {
    errors.push({
      file: filename,
      message: `Thread has ${tweets.length} tweet(s); minimum is 7.`,
    });
  } else if (tweets.length > 12) {
    errors.push({
      file: filename,
      message: `Thread has ${tweets.length} tweet(s); maximum is 12.`,
    });
  }

  if (errors.length > 0) return { ok: false, errors };

  const utmUrl = buildUtmUrl(url, campaign);

  return {
    ok: true,
    thread: {
      sourcePath: filePath,
      daySlug,
      postSlug,
      canonicalUrl: url,
      utmUrl,
      tweets,
    },
  };
}

/**
 * Parses a .x.md file and throws a descriptive error on any validation failure.
 * Use this for scripted invocation where you want fast-fail behavior.
 */
export function parseThreadFileOrThrow(filePath: string): XThread {
  const result = parseThreadFile(filePath);
  if (!result.ok) {
    const lines = result.errors.map((e) => `  • ${e.message}`).join('\n');
    throw new Error(`Thread file validation failed for "${filePath}":\n${lines}`);
  }
  return result.thread;
}
