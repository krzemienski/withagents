/**
 * X (Twitter) thread types for the withagents.dev syndication pipeline.
 *
 * .x.md format is defined in parser.ts — these types are the parsed output.
 */

/** A single tweet within a thread. */
export interface Tweet {
  /** 1-based position in the thread. */
  index: number;
  /** Tweet body text, exactly as it will be posted. ≤280 chars enforced by parser. */
  text: string;
  /**
   * Char count as annotated in the source .x.md file.
   * Parser cross-checks this against text.length and rejects mismatches >0.
   */
  annotatedCharCount: number;
}

/** A parsed X thread ready for posting. */
export interface XThread {
  /** Source file path (absolute), for error messages. */
  sourcePath: string;
  /**
   * Day identifier, e.g. "day-01" — extracted from filename when the
   * `day-NN-{slug}.x.md` naming pattern is used. Null for `{slug}.x.md` files.
   */
  daySlug: string | null;
  /** Post slug, e.g. "validationforge-ga" — extracted from filename. */
  postSlug: string;
  /** Canonical URL injected into tweet[0] if not already present. */
  canonicalUrl: string;
  /** UTM-tagged URL appended to first tweet. Built from canonicalUrl + utm params. */
  utmUrl: string;
  /** Ordered list of tweets. Length 7-12. */
  tweets: Tweet[];
}

/** Result of posting a thread to X. */
export interface PostedThread {
  /** ID of the first (root) tweet. */
  rootTweetId: string;
  /** Public URL of the root tweet: https://x.com/i/web/status/{rootTweetId} */
  rootTweetUrl: string;
  /** IDs of all posted tweets in order. */
  tweetIds: string[];
  /** ISO timestamp of when the first tweet was posted. */
  postedAt: string;
  /** Source thread metadata. */
  thread: Pick<XThread, 'daySlug' | 'postSlug' | 'canonicalUrl'>;
}

/** Token-bucket state (in-memory only; persistence deferred to Phase 11 Supabase). */
export interface RateLimitState {
  /** Tokens currently available. */
  tokens: number;
  /** Max tokens in the bucket (= daily tweet cap). */
  capacity: number;
  /** When the bucket last refilled (Unix ms). */
  lastRefillAt: number;
  /** How often the bucket refills in milliseconds (24h for daily cap). */
  refillIntervalMs: number;
}

/** Configuration for the X API client. */
export interface XClientConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  /**
   * Tweet capacity per 24h window.
   * Basic tier ($200/mo): 50 tweets/day.
   * Override via X_DAILY_TWEET_CAPACITY env var.
   */
  dailyTweetCapacity: number;
}

/** Validated environment variables. Throws at boundary if any are missing. */
export interface XEnv {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  dailyTweetCapacity: number;
}

/** UTM parameters appended to first-tweet canonical URL. */
export interface UtmParams {
  source: 'x';
  medium: 'social';
  campaign: string;
  content?: string;
}
