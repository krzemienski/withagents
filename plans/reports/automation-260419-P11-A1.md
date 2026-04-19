# Phase 11 / Agent P11-A1 — LinkedIn Syndication Adapter

**Date:** 2026-04-19
**Agent:** automation / P11-A1
**Plan:** /Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/

---

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `scripts/syndication/linkedin/types.ts` | 79 | Shared TypeScript interfaces |
| `scripts/syndication/linkedin/oauth.ts` | 232 | Token load + refresh-token rotation |
| `scripts/syndication/linkedin/share.ts` | 250 | Short UGC feed post via API |
| `scripts/syndication/linkedin/article-prep.ts` | 282 | Long-form article prep + browser open |
| `scripts/syndication/linkedin/README.md` | 169 | Usage, sidecar conventions, Phase 12 TODO |

All files in `scripts/syndication/linkedin/` — no other files touched.

---

## Exported Functions / Entrypoints

### `oauth.ts`
- `loadTokens(): Promise<LinkedInTokens>` — reads `.env.linkedin-tokens.json`, refreshes if expiring within 30 min, writes updated file. Throws on unrecoverable error.
- `getBearerHeader(): Promise<string>` — convenience wrapper returning `"Bearer <token>"`.
- CLI: `pnpm tsx scripts/syndication/linkedin/oauth.ts` — prints `author_urn` + `expires_at`, exits non-zero on failure.

### `share.ts`
- CLI only: `pnpm tsx scripts/syndication/linkedin/share.ts <slug> [--dry-run]`
- Reads post text from `posts/<slug>/<slug>.linkedin-short.md` sidecar or auto-generates a teaser from `post.md` frontmatter + first paragraph.
- Posts to `https://api.linkedin.com/v2/ugcPosts` with UTM-tagged link card.
- Prints `postUrn` + `postUrl` on success.

### `article-prep.ts`
- CLI only: `pnpm tsx scripts/syndication/linkedin/article-prep.ts <slug> [--no-browser]`
- Reads body from `posts/<slug>/<slug>.linkedin.md` sidecar or strips `post.md` body.
- Writes `posts/<slug>/<slug>.linkedin-article-prep.md` (paste-ready).
- Opens `https://www.linkedin.com/pulse/new-article/?title=<encoded>` in browser.
- `NO_BROWSER=1` or `--no-browser` skips browser open (CI-safe).

### `types.ts`
Exports: `LinkedInTokenFile`, `LinkedInTokens`, `TokenRefreshResult`, `LinkedInVisibility`, `LinkedInShareRequest`, `LinkedInShareResult`, `ArticlePrepPayload`, `PostFrontmatter`.

---

## Env-Var Contract

| Variable | Required | When | Default |
|----------|----------|------|---------|
| `LINKEDIN_CLIENT_ID` | Yes | Token refresh only | — |
| `LINKEDIN_CLIENT_SECRET` | Yes | Token refresh only | — |
| `LINKEDIN_TOKEN_FILE` | No | Always | `.env.linkedin-tokens.json` |
| `SITE_BASE_URL` | No | Always | `https://withagents.dev` |
| `NO_BROWSER` | No | article-prep | — |

Token file path: `<repo-root>/.env.linkedin-tokens.json` (gitignored via `.env*`).
Token shape: `{ platform, access_token, refresh_token, author_urn, expires_in, expires_at, fetched_at }`.

---

## Manual-Article UX Flow

LinkedIn's API v2 prohibits programmatic Article publishing. The adapter bridges this with a 5-minute manual path:

1. **Run:** `pnpm tsx scripts/syndication/linkedin/article-prep.ts <slug>`
2. Script prints article title to stdout and opens LinkedIn Article editor at:
   `https://www.linkedin.com/pulse/new-article/?title=<encoded-title>`
3. Paste body from `posts/<slug>/<slug>.linkedin-article-prep.md`
4. Upload cover image listed in the prep file
5. Click Publish

The prep file includes the full title, subtitle, body (MDX/JSX stripped, Mermaid replaced with notes), canonical URL, UTM URL, and cover image path.

---

## Validation Evidence

All three CLI entrypoints exercised with real data (post-01-series-launch):

**oauth.ts** — token loaded from `.env.linkedin-tokens.json`:
```
[linkedin/oauth] Tokens loaded OK.
  author_urn : urn:li:person:VUL7zN-Xg2
  expires_at : 2026-06-17T14:23:48.151Z
```

**share.ts --dry-run** — full UGC payload built and printed:
```
[linkedin/share] Posting short update for: post-01-series-launch
  UTM URL : https://withagents.dev/posts/post-01-series-launch?utm_source=linkedin&...
[linkedin/share] DRY RUN — would POST to https://api.linkedin.com/v2/ugcPosts
[linkedin/share] Published!
  URN : urn:li:ugcPost:DRY_RUN
```

**article-prep.ts --no-browser** — prep file written:
```
[article-prep] Prep file written: posts/post-01-series-launch/post-01-series-launch.linkedin-article-prep.md
ARTICLE TITLE: 23,479 Sessions: What Actually Works in Agentic Development
LinkedIn Article Editor: https://www.linkedin.com/pulse/new-article/?title=23%2C479+Sessions%3A...
```

**Type check:** `tsc --noEmit --strict --module ESNext --moduleResolution bundler` — zero errors.

---

## Design Decisions

- **No SDK deps** — uses `fetch` (Node 22 native) only. Zero new npm installs.
- **Token refresh margin** — 30 min before expiry, not on-expiry, to avoid race conditions in cron/webhook contexts.
- **Refresh token null handling** — standard LinkedIn apps may not receive a refresh token. If missing and token expired, exits with clear re-auth instructions rather than silently failing.
- **Frontmatter parser** — hand-rolled regex (no `gray-matter` import) to keep scripts free of site/ dependency coupling. Matches the existing pattern in `publish-scheduled.js`.
- **`any` usages** — two explicit `(fm as any)[key]` in YAML dynamic-key loops, both commented.
- **LinkedIn API version header** — `LinkedIn-Version: 202504` included per 2024+ API requirements.
- **Article body cleaning** — strips MDX imports, JSX components, and Mermaid blocks since LinkedIn's editor doesn't render them. Replaces diagrams with `[Diagram: see original post]` note.

---

## Phase 12 TODO (Kickoff Checklist)

- [ ] Confirm `pnpm tsx` available in execution environment (`pnpm add -D tsx` if not)
- [ ] Run `oauth.ts` to verify token file valid before day 1
- [ ] Pre-write `<slug>.linkedin-short.md` sidecars for all 3 flagship posts
- [ ] Pre-write `<slug>.linkedin.md` sidecars for 3 flagship LinkedIn Articles
- [ ] Test `share.ts --dry-run` for each flagship slug
- [ ] Wire `share.ts` into Keystatic publish webhook handler
- [ ] Add Supabase logging of `postUrn` + timestamp after each successful share
- [ ] Set `SITE_BASE_URL=https://withagents.dev` in webhook environment
- [ ] Run `article-prep.ts` for flagship 1 as smoke test (NO_BROWSER=1)
- [ ] Confirm `.env.linkedin-tokens.json` is present in execution environment (not just dev machine)

---

**Status:** DONE
**Summary:** LinkedIn syndication adapter fully implemented — OAuth2 refresh-token rotation, short UGC post API, manual-article prep tool, typed interfaces, README. All three CLI entrypoints validated with real post data. Zero type errors. No external dependencies added.
