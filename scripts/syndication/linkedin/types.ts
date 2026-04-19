/**
 * Shared type definitions for the LinkedIn syndication adapter.
 *
 * Token shape mirrors .env.linkedin-tokens.json (gitignored).
 * All credential fields are read-only strings — never log them.
 */

/** Raw shape stored in .env.linkedin-tokens.json */
export interface LinkedInTokenFile {
  readonly platform: "linkedin";
  readonly access_token: string;
  readonly refresh_token: string | null;
  readonly author_urn: string; // e.g. "urn:li:person:XXXXXXXX"
  readonly expires_in: number; // seconds
  readonly expires_at: string; // ISO 8601
  readonly fetched_at: string; // ISO 8601
}

/** Live token state used at runtime (post-refresh) */
export interface LinkedInTokens {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly authorUrn: string;
  readonly expiresAt: Date;
}

/** Result of a token refresh operation */
export interface TokenRefreshResult {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly expiresAt: Date;
  readonly expiresIn: number;
}

/** LinkedIn UGC post visibility */
export type LinkedInVisibility = "PUBLIC" | "CONNECTIONS";

/** Short-post share request */
export interface LinkedInShareRequest {
  /** Rendered post text (max ~3000 chars for feed posts) */
  text: string;
  /** Canonical URL included as an article link card */
  canonicalUrl: string;
  /** UTM-tagged URL to actually link to (may differ from canonical) */
  utmUrl: string;
  /** Optional title for the link preview card */
  previewTitle?: string;
  /** Optional description for the link preview card */
  previewDescription?: string;
  visibility?: LinkedInVisibility;
}

/** Successful share response */
export interface LinkedInShareResult {
  /** LinkedIn UGC post URN e.g. "urn:li:ugcPost:XXXXXXXXXX" */
  postUrn: string;
  /** Public URL to the post */
  postUrl: string;
}

/** Article prep payload written to disk + stdout */
export interface ArticlePrepPayload {
  /** Post slug, e.g. "post-01-series-launch" */
  slug: string;
  /** Full article title for LinkedIn UI */
  title: string;
  /** Subtitle / deck line */
  subtitle: string;
  /** Canonical URL on withagents.dev */
  canonicalUrl: string;
  /** UTM-tagged URL for the cover link */
  utmUrl: string;
  /** Relative path to cover image from repo root */
  coverImagePath: string | null;
  /**
   * Article body in LinkedIn-flavored Markdown.
   * Paste into LinkedIn Article editor "Write your article…" pane.
   */
  body: string;
  /** ISO 8601 timestamp this payload was generated */
  generatedAt: string;
}

/** Parsed post frontmatter fields we care about */
export interface PostFrontmatter {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  series_number: number;
  series_total: number;
  github_repo: string;
  tags: string[];
}
