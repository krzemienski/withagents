# X Thread Poster — scripts/syndication/x/

Posts `.x.md` thread files as X (Twitter) reply chains via the X API v2.

## Files

| File | Purpose |
|---|---|
| `types.ts` | Shared TypeScript types (`Tweet`, `XThread`, `PostedThread`, `RateLimitState`) |
| `parser.ts` | Parses and validates `.x.md` files, builds UTM URLs |
| `rate-limiter.ts` | Token-bucket with exponential backoff on 429 |
| `thread.ts` | Orchestrates parse → validate → post; public entry point |

---

## Environment Contract

```
X_API_KEY              Required. OAuth 1.0a API key (consumer key).
X_API_SECRET           Required. OAuth 1.0a API secret (consumer secret).
X_ACCESS_TOKEN         Required. Access token for the posting account.
X_ACCESS_TOKEN_SECRET  Required. Access token secret.
X_DAILY_TWEET_CAPACITY Optional. Integers ≥1. Default: 50 (Basic tier cap).
```

Store these in `.env.x-tokens` (gitignored via `.env*`). Never commit to source.

### Credential acquisition

1. Go to https://developer.x.com/en/portal/dashboard
2. Create an app with **Read and Write** permissions.
3. Under "Keys and Tokens" → generate Access Token + Secret **for the account that will post**.
4. Copy all four values into `.env.x-tokens`.

### Tier requirement

Write access (posting tweets) requires the **Basic tier** ($200/mo as of 2026-04).

> **Note:** The plan document references $100/mo — the X developer portal shows Basic at $200/mo.
> Verify current pricing at https://developer.x.com/en/products/twitter-api before approving spend.
> The `X_DAILY_TWEET_CAPACITY` env var defaults to 50, matching the Basic tier's 50 tweets/day cap.

---

## .x.md File Format

Files must be named `day-NN-{post-slug}.x.md` and placed in the content directory
(typically alongside the blog post or in a `social/` subdirectory).

```markdown
---
canonical_url: https://withagents.dev/blog/validationforge-ga/
utm_campaign: validationforge-ga
---

<!-- Tweet 1 [142 chars] -->
I spent 4,500 sessions teaching AI to code. Here's what nobody tells you about agentic development:

<!-- Tweet 2 [198 chars] -->
The first thing I learned: agents don't "think" — they pattern-match at scale. The difference matters more than you'd expect.

<!-- Tweet 3 [221 chars] -->
...

<!-- Tweet 7 [156 chars] -->
Read the full breakdown + the open-source tools we built along the way:
```

### Format rules

- YAML frontmatter is required (`canonical_url`, `utm_campaign`).
- Each tweet is introduced by `<!-- Tweet N [NN chars] -->`.
- Annotated char count must match actual body length (trimmed). Parser rejects mismatches.
- Individual tweet body ≤ 280 chars **before** UTM URL injection on tweet 1.
- Tweet 1 gets `\n\n{utmUrl}` appended if it contains no URL. X counts URLs as 23 chars —
  leave ≤257 chars in tweet 1 body to guarantee post-injection compliance.
- Thread length: 7–12 tweets.
- Char counts use Unicode code points (same as X's counter).

---

## Usage

### Programmatic (Node.js / TypeScript)

```typescript
import { postThread, validateThreadFile } from './thread.js';

// Dry-run: parse + validate only, no API calls.
const thread = validateThreadFile('/path/to/day-01-validationforge-ga.x.md');
console.log(`${thread.tweets.length} tweets, first: ${thread.tweets[0].text.slice(0, 60)}…`);

// Live post:
const result = await postThread('/path/to/day-01-validationforge-ga.x.md');
console.log(result.rootTweetUrl);
// → https://x.com/i/web/status/1234567890
```

### CLI (via tsx or ts-node)

```bash
# Dry-run (validate only, no post)
npx tsx scripts/syndication/x/thread.ts --validate day-01-validationforge-ga.x.md

# Post a thread
X_API_KEY=... X_API_SECRET=... X_ACCESS_TOKEN=... X_ACCESS_TOKEN_SECRET=... \
  npx tsx scripts/syndication/x/thread.ts day-01-validationforge-ga.x.md
```

> CLI entry point (arg parsing) is not included in this module — wire it in the
> syndication runner (Phase 11 / phase-11-automation-infra.md) alongside the
> Keystatic publish webhook and Supabase logging.

---

## Rate Limiting

The `RateLimiter` class uses an in-memory token bucket:

- **Capacity**: `X_DAILY_TWEET_CAPACITY` (default 50).
- **Refill**: Full refill every 24h from first use.
- **429 handling**: Exponential backoff (60s → 120s → 240s → 480s → 960s), capped at 15 min.
  If the API returns `x-rate-limit-reset`, uses that timestamp instead of exponential.
- **Max retries**: 5 per tweet before re-throwing.
- **Persistence**: In-memory only. A process restart resets the bucket.
  Supabase-backed persistence is deferred to Phase 11 (A3).

### Thread-safe posting window

A full 12-tweet thread consumes 12 tokens. With a 50/day cap, you can post ≈4 full threads
per day before hitting the ceiling. The limiter will pause and wait for the 24h refill
rather than dropping tweets — this means a 5th thread may block for hours.
Plan the calendar accordingly (≤4 threads/day on Basic tier).

---

## Error handling

All errors are thrown with descriptive messages. The key guarantee:

> If `postThread()` throws before posting tweet 1, no tweets were posted.
> If it throws after tweet 1, the partial thread is live. The error message
> includes the root tweet ID so you can manually complete or delete the thread.

Validation is run in full before any API call, so "partial thread" failures
only happen on network errors or unexpected API responses mid-chain.

---

## Dependencies

```json
"twitter-api-v2": "^1.x"
```

Add to `scripts/package.json` (or root `package.json` if scripts share deps):

```bash
npm install twitter-api-v2
# or
pnpm add twitter-api-v2
```

---

## Phase 11 integration points

When Phase 11 (automation-infra) wires the full syndication runner:

1. **Supabase logging**: After `postThread()` returns, log `PostedThread` to `syndication_log` table.
2. **Retry queue**: Persist failed attempts to `syndication_failures` table; replay on next run.
3. **Scheduler**: Invoke `postThread()` from the Keystatic publish webhook handler, offset +6h
   from blog publish time (drives traffic to blog first — per phase-05 offset rule).
4. **Shared limiter**: Instantiate one `RateLimiter` per process, not per thread post,
   so bucket state accumulates correctly across a multi-thread session.
