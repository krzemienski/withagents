/**
 * X thread poster for the withagents.dev syndication pipeline.
 *
 * Usage:
 *   import { postThread } from './thread.js';
 *   const result = await postThread('/path/to/day-01-validationforge-ga.x.md');
 *   console.log(result.rootTweetUrl);
 *
 * The function:
 *  1. Validates all env vars (fails before any API call).
 *  2. Parses and validates the .x.md file (fails before any API call).
 *  3. Injects the UTM URL into the first tweet text if no URL is already present.
 *  4. Posts tweet[0] as root, then each subsequent tweet as a reply to the previous.
 *  5. Returns { rootTweetId, rootTweetUrl, tweetIds, postedAt, thread }.
 *
 * Environment variables required (see README.md for details):
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 * Optional:
 *   X_DAILY_TWEET_CAPACITY  (default: 50, matching Basic tier)
 */

import { TwitterApi } from 'twitter-api-v2';
import { parseThreadFileOrThrow } from './parser.js';
import { RateLimiter } from './rate-limiter.js';
import type { PostedThread, XClientConfig, XEnv, XThread } from './types.js';

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

/**
 * Reads and validates all required X env vars.
 * Throws at the boundary with a clear message listing every missing variable.
 * Call once at startup; do not call per-tweet.
 */
export function loadXEnv(): XEnv {
  const missing: string[] = [];

  function require(name: string): string {
    const val = process.env[name];
    if (!val) missing.push(name);
    return val ?? '';
  }

  const apiKey = require('X_API_KEY');
  const apiSecret = require('X_API_SECRET');
  const accessToken = require('X_ACCESS_TOKEN');
  const accessTokenSecret = require('X_ACCESS_TOKEN_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((v) => `  • ${v}`).join('\n')}\n` +
        `See scripts/syndication/x/README.md for setup instructions.`
    );
  }

  const rawCapacity = process.env['X_DAILY_TWEET_CAPACITY'];
  const dailyTweetCapacity = rawCapacity ? parseInt(rawCapacity, 10) : 50;
  if (isNaN(dailyTweetCapacity) || dailyTweetCapacity < 1) {
    throw new Error(
      `X_DAILY_TWEET_CAPACITY must be a positive integer, got: "${rawCapacity}"`
    );
  }

  return { apiKey, apiSecret, accessToken, accessTokenSecret, dailyTweetCapacity };
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

function buildClient(config: XClientConfig): TwitterApi {
  return new TwitterApi({
    appKey: config.apiKey,
    appSecret: config.apiSecret,
    accessToken: config.accessToken,
    accessSecret: config.accessTokenSecret,
  });
}

// ---------------------------------------------------------------------------
// URL injection
// ---------------------------------------------------------------------------

/**
 * Returns true if the text already contains a URL (http/https).
 * Used to avoid double-appending the UTM URL to tweet[0].
 */
function hasUrl(text: string): boolean {
  return /https?:\/\/\S+/.test(text);
}

/**
 * Injects the UTM URL into the first tweet text if it doesn't already contain
 * a URL. The URL is appended on a new line.
 *
 * X URL shortening counts every URL as 23 chars regardless of length.
 * We validate the final tweet length AFTER injection.
 */
function injectUtmUrl(tweetText: string, utmUrl: string): string {
  if (hasUrl(tweetText)) return tweetText;
  return `${tweetText}\n\n${utmUrl}`;
}

/**
 * X counts every URL as 23 chars (t.co wrapping).
 * Replace all URLs with a 23-char placeholder for length checking.
 */
function twitterDisplayLength(text: string): number {
  const urlPlaceholder = 'x'.repeat(23);
  const withReplacedUrls = text.replace(/https?:\/\/\S+/g, urlPlaceholder);
  return [...withReplacedUrls].length; // Unicode-aware
}

// ---------------------------------------------------------------------------
// Core posting logic
// ---------------------------------------------------------------------------

/**
 * Posts a parsed XThread as a reply chain.
 * Returns the root tweet ID and URL.
 *
 * @param thread   Parsed and validated thread.
 * @param client   Authenticated TwitterApi client (rwv2 scope).
 * @param limiter  Rate limiter instance.
 */
async function postThreadToApi(
  thread: XThread,
  client: TwitterApi,
  limiter: RateLimiter
): Promise<PostedThread> {
  const tweetIds: string[] = [];
  let replyToId: string | undefined;

  for (let i = 0; i < thread.tweets.length; i++) {
    const tweet = thread.tweets[i];

    // First tweet: inject UTM URL if no URL present, then validate final length.
    let text = tweet.text;
    if (i === 0) {
      text = injectUtmUrl(text, thread.utmUrl);
      const displayLen = twitterDisplayLength(text);
      if (displayLen > 280) {
        throw new Error(
          `Tweet 1 exceeds 280 chars after UTM URL injection: ${displayLen} chars.\n` +
            `Text: ${text}\n\n` +
            `Shorten tweet 1 body by ${displayLen - 280} chars to accommodate the URL.`
        );
      }
    }

    const label = `${thread.daySlug}/${thread.postSlug} tweet ${i + 1}/${thread.tweets.length}`;

    const tweetId = await limiter.withRetry(async () => {
      const payload: Parameters<typeof client.v2.tweet>[0] = { text };
      if (replyToId !== undefined) {
        payload.reply = { in_reply_to_tweet_id: replyToId };
      }
      const { data } = await client.v2.tweet(payload);
      return data.id;
    }, label);

    tweetIds.push(tweetId);
    replyToId = tweetId;

    // Brief pause between tweets to avoid burst issues (not part of rate limit,
    // just good citizenship — X occasionally rejects rapid-fire sequential posts).
    if (i < thread.tweets.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const rootTweetId = tweetIds[0];
  const rootTweetUrl = `https://x.com/i/web/status/${rootTweetId}`;

  return {
    rootTweetId,
    rootTweetUrl,
    tweetIds,
    postedAt: new Date().toISOString(),
    thread: {
      daySlug: thread.daySlug,
      postSlug: thread.postSlug,
      canonicalUrl: thread.canonicalUrl,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse a .x.md file and post it as an X thread.
 *
 * Validates everything (env vars + file content) before making any API call.
 * If validation fails, throws with a descriptive message — no partial posts.
 *
 * @param filePath  Absolute path to the .x.md file.
 * @param options   Optional overrides (useful for testing with a pre-built client).
 * @returns         PostedThread with rootTweetUrl and all tweet IDs.
 */
export async function postThread(
  filePath: string,
  options?: {
    /** Pre-built client — skips env var loading. Useful for integration testing. */
    client?: TwitterApi;
    /** Pre-built limiter — skips env var loading. */
    limiter?: RateLimiter;
  }
): Promise<PostedThread> {
  // Step 1: Validate env (unless client is injected).
  let env: XEnv | undefined;
  if (!options?.client) {
    env = loadXEnv();
  }

  // Step 2: Parse + validate the .x.md file (fail fast, before any API call).
  const thread = parseThreadFileOrThrow(filePath);

  // Step 3: Build client and limiter.
  const capacity = env?.dailyTweetCapacity ?? 50;
  const client =
    options?.client ??
    buildClient({
      apiKey: env!.apiKey,
      apiSecret: env!.apiSecret,
      accessToken: env!.accessToken,
      accessTokenSecret: env!.accessTokenSecret,
      dailyTweetCapacity: capacity,
    });
  const limiter = options?.limiter ?? new RateLimiter(capacity);

  // Step 4: Post the thread.
  const result = await postThreadToApi(thread, client, limiter);

  console.log(
    `[thread] Posted ${thread.tweets.length}-tweet thread for ${thread.daySlug}/${thread.postSlug}.\n` +
      `  Root tweet: ${result.rootTweetUrl}`
  );

  return result;
}

/**
 * Dry-run: parses and validates the .x.md file without posting anything.
 * Useful for pre-flight checks before a live posting run.
 *
 * @returns The parsed XThread (all validation passes).
 * @throws  Descriptive error if validation fails.
 */
export function validateThreadFile(filePath: string): XThread {
  return parseThreadFileOrThrow(filePath);
}
