# Social Campaign — Deployment Runbook

**Campaign:** blog-series-ai
**Launch target:** Mon 2026-04-27
**Owner:** Nick Krzemienski

This is the handoff doc for shipping the automation stack the agent built. Follow
steps in order. Each block shows a command, expected result, and one verification
check. Skip only if the referenced artifact already exists.

---

## Current state (what's already done)

| Layer | Artifact | Location | Status |
|---|---|---|---|
| Content | 18 post bodies (Opus polish) | `posts/post-*/post.md` | ✅ |
| Content | 18 X threads | `posts/post-*/social/twitter.md` | ✅ |
| Content | 18 LI short essays | `posts/post-*/social/linkedin.md` | ✅ |
| Content | 18 LI Articles (long-form) | `posts/post-*/social/linkedin-article.md` | ✅ |
| Creative | 54 social-card PNGs | `assets/campaigns/260418-blog-series-ai/creatives/cards/` | ✅ |
| Code | UTM builder | `site/src/lib/utm.ts` | ✅ |
| Code | X client | `site/src/lib/social/x-client.ts` | ✅ |
| Code | LinkedIn client | `site/src/lib/social/linkedin-client.ts` | ✅ |
| Code | Analytics events | `site/src/lib/analytics.ts` | ✅ |
| Script | Social-card renderer | `scripts/render-social-cards.js` | ✅ |
| Script | X OAuth helper | `scripts/social-auth-x.js` | ✅ |
| Script | LinkedIn OAuth helper | `scripts/social-auth-linkedin.js` | ✅ |
| Script | Schedule publisher | `scripts/publish-scheduled.js` | ✅ |
| Script | Schedule seeder | `scripts/seed-schedule.js` | ✅ |
| Script | Weekly digest generator | `scripts/weekly-digest.js` | ✅ |
| Schema | Supabase tables | `scripts/supabase-schema.sql` | ✅ |
| Config | launchd plist | `scripts/launchd/com.nick.blog-social-scheduler.plist` | ✅ |
| Docs | Campaign brief | `assets/campaigns/260418-blog-series-ai/briefs/campaign-brief.md` | ✅ |
| Docs | Funnel design | `assets/campaigns/260418-blog-series-ai/briefs/funnel-design.md` | ✅ |
| Docs | Execution plan | `assets/campaigns/260418-blog-series-ai/briefs/campaign-execution.md` | ✅ |
| Docs | Brand guidelines | `assets/campaigns/260418-blog-series-ai/briefs/brand-guidelines.md` | ✅ |

## What YOU need to do

These steps require your hands on a credential UI or a sudoer's shell — the agent
can't do them.

---

## 1. Vercel — disable deployment protection (BLOCKER)

Currently `https://site-rho-pied.vercel.app` returns HTTP 402. Fix before Day 0:

1. Vercel dashboard → this project → Settings → Deployment Protection
2. Disable "Vercel Authentication" on the production alias
3. Or: configure a custom domain and disable protection there

**Verify:** `curl -I https://site-rho-pied.vercel.app/` returns 200.

---

## 2. Supabase — create project (5 min)

The scheduler queue and OAuth tokens live here. Free tier is sufficient.

1. Supabase dashboard → New project
2. Name: `blog-series-social`
3. Region: `us-east-1` (matches Vercel)
4. Note the Project Reference (looks like `abcd1234efgh5678`) and the
   Service Role key (Settings → API → `service_role` secret — NOT the anon key)

**Apply schema:**

```bash
# Option A — via psql
export SUPABASE_DB_URL=postgres://postgres.<ref>:<password>@<host>/postgres
psql "$SUPABASE_DB_URL" -f scripts/supabase-schema.sql

# Option B — via Supabase dashboard SQL editor
# Paste contents of scripts/supabase-schema.sql and run
```

**Verify:** `social_auth_tokens`, `scheduled_posts`, `post_publish_log` tables
exist in the project's public schema.

---

## 3. X / Twitter — create developer app + mint OAuth token

### 3a. Create app

1. [developer.x.com](https://developer.x.com) → Create Project + App
2. App permissions: **Read and write**
3. Auth settings: OAuth 1.0a **enabled**
4. Callback URL: `http://localhost:4173/callback`
5. Website URL: `https://site-rho-pied.vercel.app`
6. Copy the **API Key** (consumer key) and **API Key Secret** (consumer secret)

### 3b. Mint user token

```bash
export X_API_KEY=...
export X_API_SECRET=...
export SUPABASE_URL=https://<ref>.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=...
node scripts/social-auth-x.js --label nick-personal
```

Browser opens, you authorize, script captures the verifier and upserts the token
into Supabase.

**Verify:**
```sql
SELECT platform, account_label, length(access_token) FROM social_auth_tokens;
-- Expect one row: x | nick-personal | >20
```

---

## 4. LinkedIn — create app + mint OAuth token

### 4a. Create app

1. [linkedin.com/developers](https://linkedin.com/developers/apps) → Create app
2. Products — request: **Share on LinkedIn**, **Sign In with LinkedIn using
   OpenID Connect**. (For Articles: request **Community Management API** if
   available — may require LinkedIn approval.)
3. OAuth 2.0 settings → Redirect URL: `http://localhost:4174/callback`
4. Copy the **Client ID** and **Client Secret**

### 4b. Mint token

```bash
export LINKEDIN_CLIENT_ID=...
export LINKEDIN_CLIENT_SECRET=...
# SUPABASE_URL / SERVICE_ROLE_KEY already set
node scripts/social-auth-linkedin.js --label nick-personal
```

Browser opens, you authorize, token lands in Supabase.

**Verify:**
```sql
SELECT platform, account_label, author_urn FROM social_auth_tokens;
-- Expect: linkedin | nick-personal | urn:li:person:...
```

---

## 5. Seed the schedule

Populate `scheduled_posts` with the 54-row cluster calendar (3 platforms × 18
posts, timed per brand-guidelines.md §3):

```bash
# Dry-run to sanity-check
node scripts/seed-schedule.js --dry-run

# Real insert (overwrites pending/failed rows in scheduled_posts)
node scripts/seed-schedule.js
```

**Verify:**
```sql
SELECT COUNT(*), platform FROM scheduled_posts GROUP BY platform;
-- Expect:
--  18 | x
--  18 | linkedin
--  18 | linkedin-article
```

---

## 6. Test one publish end-to-end

Before arming the scheduler, run the publisher manually against one row:

```bash
# List upcoming pending rows
psql "$SUPABASE_DB_URL" -c "SELECT id, platform, post_slug, scheduled_for FROM scheduled_posts WHERE status='pending' ORDER BY scheduled_for LIMIT 3;"

# Pick an id, then:
node scripts/publish-scheduled.js --post-id <uuid>
```

**Verify:**
- The X thread appears on your timeline
- The LinkedIn post appears on your profile
- `scheduled_posts.status` for that id = `posted`
- `post_publish_log` has a success row

---

## 7. Install launchd scheduler

1. Copy plist:
   ```bash
   cp scripts/launchd/com.nick.blog-social-scheduler.plist ~/Library/LaunchAgents/
   ```
2. Open the plist and either fill in `EnvironmentVariables` block directly OR
   add the exports to `~/.zshrc` (launchd inherits zsh env on macOS 13+).
3. Load:
   ```bash
   launchctl load -w ~/Library/LaunchAgents/com.nick.blog-social-scheduler.plist
   ```

**Verify:**
```bash
launchctl list | grep blog-social
# Expect: com.nick.blog-social-scheduler

tail -f /tmp/blog-social-scheduler.log
# Every 5 min you should see:
# [ISO timestamp] no pending posts.   (if nothing is due)
# [ISO timestamp] processing N row(s) (when rows come due)
```

Scheduler runs every 5 min (`StartInterval: 300`). Adjust if you want tighter
cadence — but X API rate limits cap at ~300 posts/24h on Basic tier.

---

## 8. Wire analytics events (optional, post-launch)

To get `post_opened` and `scroll_*` events in Vercel Analytics, add the hook
call to the post page component at `site/src/app/posts/[slug]/page.tsx`.

The component is async (RSC). You'll need a small client boundary:

```tsx
// site/src/components/post-analytics.tsx
"use client";
import { useBlogPostAnalytics } from "@/lib/analytics";
export function PostAnalytics({ slug }: { slug: string }) {
  useBlogPostAnalytics(slug);
  return null;
}
```

Then import and render `<PostAnalytics slug={params.slug} />` somewhere in the
post page JSX.

**Verify:**
Open DevTools → Network → search for `_vercel/insights`. You should see a POST
to the insights endpoint with event name `post_opened` within 2 seconds of
page load.

---

## 9. Weekly digest

After each week completes, generate the report:

```bash
node scripts/weekly-digest.js --week 1  # Apr 28 – May 3
node scripts/weekly-digest.js --week 2  # May  4 – May 10
# …
```

Each run writes `assets/campaigns/260418-blog-series-ai/reports/week-NN.md`
listing all successful publishes, failures, and placeholder rows for manual
platform metrics (X impressions, LI reactions, etc.).

You can also cron this via a separate launchd plist — but running it manually
each Sunday is low-effort.

---

## Day-0 sanity checklist (Sun 2026-04-26 evening)

- [ ] `curl -I https://site-rho-pied.vercel.app/` → 200
- [ ] `curl -I https://site-rho-pied.vercel.app/posts/post-01-series-launch/` → 200
- [ ] `SELECT COUNT(*) FROM scheduled_posts WHERE status='pending'` → 54
- [ ] `SELECT COUNT(*) FROM social_auth_tokens` → 2 (one X, one LinkedIn)
- [ ] `launchctl list | grep blog-social` → running
- [ ] `tail /tmp/blog-social-scheduler.log` shows recent "no pending posts" lines
- [ ] Day 0 cluster 1 schedule: Posts 1, 2, 9 scheduled for Tue-Thu 2026-04-28..30

---

## Failure modes & responses

| Symptom | Cause | Fix |
|---|---|---|
| 402 on site alias | Vercel deployment protection | Step 1 |
| Token fetch error in publisher log | Wrong Supabase key (anon vs service_role) | Re-export SUPABASE_SERVICE_ROLE_KEY |
| "401 Unauthorized" from X API | Token not stored, or expired | Re-run social-auth-x.js |
| "Tweet exceeds 280 chars" thrown | Thread body has a tweet too long | Grep `posts/post-*/social/twitter.md` for long lines, edit |
| launchd `Could not find job` | plist not loaded | `launchctl load -w ...` |
| launchd runs but env missing | launchd doesn't inherit shell env on macOS 14+ | Set EnvironmentVariables in the plist directly |
| LinkedIn 403 on Article publish | Articles API not approved | Articles publish via UGC share+canonical URL (already implemented) |
| `posts/INDEX.md` has stale numbers | Someone reverted it | Re-run the manual regeneration — was correct as of 2026-04-18 |

---

## Cost profile

| Service | Tier | Monthly |
|---|---|---|
| Supabase | Free | $0 |
| Vercel | Hobby | $0 |
| X API | Free | $0 (17 posts/24h cap — sufficient for this campaign) |
| LinkedIn API | Free | $0 |
| GitHub Actions | n/a | $0 (using launchd instead) |
| Puppeteer | n/a | $0 (local) |

Paid only if you upgrade X to Basic ($200/mo, 100 posts/day) for faster posting
or Supabase Pro ($25/mo, 8GB DB) if the queue outgrows free tier.

---

## Cutting losses

If a phase of the campaign is unrecoverable:

```bash
# Stop scheduler
launchctl unload -w ~/Library/LaunchAgents/com.nick.blog-social-scheduler.plist

# Cancel all remaining pending posts
psql "$SUPABASE_DB_URL" -c "UPDATE scheduled_posts SET status='failed', error_message='manually cancelled' WHERE status='pending';"

# Or, specific platform only
psql "$SUPABASE_DB_URL" -c "UPDATE scheduled_posts SET status='failed' WHERE status='pending' AND platform='x';"
```

---

## Contacts & recovery paths

- Supabase incident? → Check project-level status in their dashboard, `SELECT NOW()` to test connectivity
- X API outage? → The scheduler retries failed posts on its next run (max 3 attempts by default)
- LinkedIn API outage? → Same retry pattern
- Content issue? → Edit `posts/post-NN-slug/social/<platform>.md`, then re-queue:
  ```sql
  UPDATE scheduled_posts SET status='pending', attempt_count=0, error_message=NULL
    WHERE id='<uuid>';
  ```
  Scheduler picks it up on the next run.

---

**Questions I left unanswered in this runbook:**

1. Custom domain purchase + DNS — user decision
2. Newsletter platform (Buttondown/ConvertKit) — not in current scope
3. HN / Reddit submissions — manual, per campaign-execution.md §6
4. ValidationForge OSS release — out of this runbook's scope, separate project
