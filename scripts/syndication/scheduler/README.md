# scheduler

Calendar-driven daily dispatch for the withagents.dev 45-day syndication push.
Reads `synthesis/calendar-45day.md`, determines which channels fire for a given
day, and dispatches them — with full re-entrancy so running twice is a no-op.

## Quick start

```bash
# Dispatch today's channels (derives day from .launch-date in repo root)
npx tsx runner.ts --today

# Dispatch a specific day (useful for backfill or manual trigger)
npx tsx runner.ts --day 1

# Dry-run: show what would happen without making any API calls or git pushes
npx tsx runner.ts --day 1 --dry-run

# Dry-run a specific channel only
npx tsx runner.ts --day 10 --channel readme --dry-run
```

## --dry-run

Dry-run mode is safe to run at any time:

- No API calls made (LinkedIn, X, GitHub)
- No Supabase rows written
- State file not modified
- Prints exactly what each channel would do, including the README block that
  would be injected

Example output:

```
[runner] day=1 topic="ValidationForge GA" type=FLAGSHIP dry-run=true
[runner] dispatching day=1 channel=linkedin
  [linkedin] DRY-RUN: would output article body for manual paste
  [linkedin] topic: ValidationForge GA
[runner] day=1 channel=linkedin → dry-run (dry-run)
[runner] dispatching day=1 channel=x
  [x] DRY-RUN: would queue X thread for day 1: ValidationForge GA
[runner] day=1 channel=x → dry-run (dry-run)
[runner] dispatching day=1 channel=readme
  [readme] DRY-RUN: would inject block into validationforge README
[runner] day=1 channel=readme → dry-run (dry-run)
[runner] DRY-RUN: would write state → .syndication-state.json
```

## --day=N

Dispatch a specific calendar day by number (1–60). Use for:

- Manual triggers when the cron fires at the wrong time
- Backfilling a missed day
- Testing a future day's content before its scheduled date

```bash
npx tsx runner.ts --day 22 --dry-run   # Preview Ralph Orchestrator flagship day
npx tsx runner.ts --day 35             # Dispatch skills package launch day
```

## Re-entrancy

The runner writes dispatch state to `.syndication-state.json` in the repo root.
Any channel recorded as `"ok"` is skipped on subsequent runs for the same day.
`"error"` and `"skipped"` channels are retried.

```bash
# First run: dispatches all 3 channels
npx tsx runner.ts --day 5

# Second run (same day): all channels already "ok", nothing dispatched
npx tsx runner.ts --day 5
# Output: day=5 channel=linkedin already done — skip
#         day=5 channel=x already done — skip
#         day=5 channel=readme already done — skip
```

To force re-dispatch a completed channel, remove its entry from
`.syndication-state.json` manually, or delete the file to reset all state.

## All flags

| Flag | Default | Description |
|------|---------|-------------|
| `--day N` | — | Dispatch calendar day N (**required** unless `--today`) |
| `--today` | false | Derive day from today's date + `.launch-date` file |
| `--launch-date YYYY-MM-DD` | reads `.launch-date` | Override launch date |
| `--calendar <path>` | auto-resolved | Path to `calendar-45day.md` |
| `--dry-run` | false | Preview only, no side effects |
| `--channel <ch>` | all | Only dispatch one channel: `linkedin`, `x`, `readme` |
| `--state-file <path>` | `.syndication-state.json` | Override state file path |
| `--owner <handle>` | `krzemienski` | GitHub owner for README patches |

## Cron schedule install

The file `cron.schedule` contains a ready-to-paste crontab fragment that fires
the runner at 08:00 local time every day.

```bash
# Edit your crontab
crontab -e

# Paste the contents of cron.schedule (after editing REPO_ROOT to your path)
```

Before installing:

1. Set `REPO_ROOT` in `cron.schedule` to your checkout path
2. Create `~/.syndication.env` with your credentials:

```bash
cat > ~/.syndication.env << 'EOF'
export SUPABASE_URL=https://xxxx.supabase.co
export SUPABASE_SERVICE_KEY=service_role_key_here
export X_API_KEY=your_x_api_key
export X_API_SECRET=your_x_api_secret
export GH_OWNER=krzemienski
EOF
chmod 600 ~/.syndication.env
```

3. Create `.launch-date` in the repo root:

```bash
echo "2026-05-01" > /path/to/blog-series/.launch-date
```

4. Verify `gh` is authenticated:

```bash
gh auth status
```

## Channel behavior

### LinkedIn (`--channel linkedin`)

LinkedIn Articles must be published manually via the UI (the public REST API
does not support native Article creation). The runner:

1. Locates the pre-generated `day-NN-*.linkedin.md` file in
   `withagents-site/src/content/posts/`
2. Outputs the full article body to stdout with paste instructions
3. Records `"ok"` in state so it won't repeat on next run

Manual step: open LinkedIn → Write Article → paste the output.

### X thread (`--channel x`)

Confirms the `.x.md` content file exists for the day, then verifies a
`scheduled_posts` queue row is present in Supabase. Actual posting is executed
by `publish-scheduled.js` (the existing Supabase-queue publisher). The runner's
job is content readiness confirmation, not direct API posting.

### Repo README (`--channel readme`)

Calls `readme-patcher/patcher.ts` which:

1. Looks up `day-NN-*.readme-patch.md` in `withagents-site/src/content/posts/`
2. Clones the target repo via `gh CLI`
3. Injects (or replaces) the `## Featured in` block between marker comments
4. Commits with message `docs: add withagents.dev "Featured in" section`
5. Pushes to the default branch

See `readme-patcher/README.md` for the full marker contract.

## State file format

`.syndication-state.json` example after day 1 dispatch:

```json
{
  "launchDate": "2026-05-01",
  "days": {
    "1": {
      "day": 1,
      "topic": "ValidationForge GA",
      "startedAt": "2026-05-01T08:00:12.345Z",
      "channels": {
        "linkedin": { "status": "ok", "message": "article body output for manual paste: day-01-validationforge-ga.linkedin.md", "completedAt": "2026-05-01T08:00:13.100Z" },
        "x":        { "status": "ok", "message": "x thread content confirmed: day-01-validationforge-ga.x.md", "completedAt": "2026-05-01T08:00:13.200Z" },
        "readme":   { "status": "ok", "message": "pushed validationforge (a3b1c2d)", "completedAt": "2026-05-01T08:00:45.000Z" }
      }
    }
  }
}
```

## Calendar loader

`calendar-loader.ts` parses `calendar-45day.md` rows into typed `CalendarDay`
objects. Import it separately if you need read-only access to the calendar:

```typescript
import { loadCalendar } from "./calendar-loader.js";
const days = loadCalendar("plans/260419-0241-agentic-dog-brand-launch/synthesis/calendar-45day.md");
// days[0].day       → 1
// days[0].topic     → "ValidationForge GA"
// days[0].isFlagship → true
// days[0].repoReadme → "validationforge"
// days[5].isOff     → true  (day 6 = off-day)
```
