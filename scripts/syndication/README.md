# Syndication scripts

Scheduler-driven dispatch for the withagents.dev launch push. See
`scheduler/README.md` for calendar/runner details.

## Channels

| Channel | Runner action | How content ships |
|---|---|---|
| `linkedin_article` | `scheduler/runner.ts --channel linkedin` outputs article body for manual paste into LinkedIn Pulse | Manual paste via `linkedin/article-prep.ts` helper |
| `x_thread` | **Manual channel.** Runner records a `skipped / manual_channel` row only. | Nick posts on X / Typefully; `capture-x-url.sh day-NN` UPSERTs the real URL onto the existing skipped row |
| `readme_patch` | `scheduler/runner.ts --channel readme` patches the target repo README and pushes | Automated via `readme-patcher/patcher.ts` |

## Why X is manual

X API v2 Basic tier is $200/month and Feb 2026 froze new signups for post-only
use cases. Maintaining a full X adapter for a 45-day push is not cost-justified.
See `plans/260419-1200-unified-launch-remediation/plan.md` locked decision #1.

## Manual X posting flow

1. Open `withagents-site/src/content/posts/day-NN-<slug>.x.md` — the thread
   source.
2. Paste into X (native compose) or Typefully.
3. After posting, copy the thread URL and save it:
   ```bash
   mkdir -p plans/phase-12-evidence/day-NN
   echo "https://x.com/krzemienski/status/..." > plans/phase-12-evidence/day-NN/x-url.txt
   ```
4. Run the capture hook to flip the Supabase row to `posted`:
   ```bash
   scripts/syndication/capture-x-url.sh day-NN
   ```

The runner will still INSERT an `x_thread` row per publishing day (with
`status=skipped`, `error_message=manual_channel`) so referential integrity
holds for `B5 metrics`. `capture-x-url.sh` PATCHes that row — never inserts a
second row.
