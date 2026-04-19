---
phase: 00
name: baseline-capture
status: pending
blocks: [phase-01-audit-workstreams]
injected_from: strengthening-package 2026-04-19
---

# Phase 00 — Baseline Capture (must complete before Phase 01)

## Purpose

Snapshot every metric that matters **before** any withagents.dev work begins. Without a baseline, every future "the push worked" claim is unfalsifiable.

## Deliverable

Single YAML: `reports/baseline-2026-04-19.yaml`, every field populated (no TBDs).

## Required Captures

### GitHub (scripted)

```bash
gh api users/krzemienski --jq '{followers, public_repos}' > reports/baseline-github-user.json
gh api users/krzemienski/repos?per_page=100 --paginate --jq \
  '[.[] | {name, stars: .stargazers_count, forks: .forks_count, watchers: .watchers_count}]' \
  > reports/baseline-github-repos.json
```

Extracted into YAML:
- Follower count
- Stars per flagship (15 flagships enumerated in plan.md)
- Stars sum across flagship total
- Stars sum across 61 companion repos (Agentic Development #N)
- Public repo count

### LinkedIn (manual — no public API for counts)

Open profile, screenshot, record in YAML:
- Current follower count
- Posts published last 30 days
- Avg engagement per post (likes + comments / N posts)

Save screenshot to `reports/baseline-screenshots/linkedin-2026-04-19.png`.

### X / Twitter (manual)

Open profile, screenshot, record:
- Follower count
- Posts last 30 days
- Impressions last 30 days (if visible in analytics)

Save screenshot to `reports/baseline-screenshots/x-2026-04-19.png`.

### Web (depends on chosen analytics tool — decide in Mode 1 Q&A)

- Current agentic-development-guide site traffic last 30d (from Vercel Analytics or existing tool)
- Top referrer source
- Avg time on page

### Inbound funnel

- Consulting inquiries last 90 days (manual count from inbox/LinkedIn DMs)
- Current funnel mechanism (answer: "nothing formal" is honest)

## Baseline YAML Template

```yaml
captured_at: 2026-04-19T%H:%M:%S-04:00
github:
  followers_krzemienski: N
  public_repo_count: N
  stars_per_flagship:
    validationforge: N
    sessionforge: N
    ils-ios: N
    code-tales: N
    code-tales-platform: N
    auto-claude-worktrees: N
    claude-code-skills-factory: N
    multi-agent-consensus: N
    shannon-framework: N
    ralph-loop-patterns: N
    claude-prompt-stack: N
    claude-ios-streaming-bridge: N
    claude-sdk-bridge: N
    stitch-design-to-code: N
    agentic-development-guide: N
  stars_sum_flagship_total: N
  stars_sum_61_companion_repos: N
linkedin:
  followers: N
  posts_last_30d: N
  avg_engagement_per_post: N
  screenshot: reports/baseline-screenshots/linkedin-2026-04-19.png
x_twitter:
  followers: N
  posts_last_30d: N
  impressions_last_30d: N
  screenshot: reports/baseline-screenshots/x-2026-04-19.png
web:
  agentic_development_guide:
    traffic_30d_uniques: N
    top_referrer: source
    avg_time_on_page_sec: N
inbound:
  consulting_inquiries_last_90d: N
  funnel_mechanism: "nothing formal today"
```

## Acceptance Criteria

- [ ] `reports/baseline-2026-04-19.yaml` exists with every field populated
- [ ] GitHub JSON exports committed to `reports/`
- [ ] LinkedIn + X screenshots saved
- [ ] YAML reviewed and signed off by user before Phase 01 spawns

## Why This Blocks Phase 01

Every downstream metric interpretation depends on knowing where we started. If Phase 01 spawns without this, the 30-day push has no reference point and the post-mortem has no ground truth.

## Estimated Effort

2-3 hours (mostly manual LinkedIn + X captures + inbox audit).
