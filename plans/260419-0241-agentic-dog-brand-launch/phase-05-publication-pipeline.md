---
phase: 05
name: publication-pipeline
status: pending
blockedBy: [phase-02-synthesis, phase-04-cms-site-architecture]
---

# Phase 05 — Multi-Channel Publication Pipeline

## Purpose

Design the canonical content flow from agentic.dog CMS → every syndication target. Define cadence for the 30-day push.

## Canonical Flow (updated per decisions 2026-04-19)

```
agentic.dog CMS (Keystatic commit)
      │
      ├─► build hook → deploy to agentic.dog
      ├─► hack.ski companion deploy (same template, AI-agnostic copy variants)
      ├─► syndication runner (scripted, Node/TS)
      │     ├─► LinkedIn article (long-form)
      │     ├─► LinkedIn short post (derived teaser + link)
      │     ├─► X thread (7-12 posts, different angle per devlog-publisher)
      │     └─► Repo README patch (blog + series cross-link)
      └─► Analytics tag injection (UTM per channel)
```

**Substack and Medium dropped** from 30-day push per user decision. Re-evaluate post-push.

## Platform-Specific Adaptation (by existing skills)

| Platform | Skill | Notes |
|---|---|---|
| LinkedIn long-form | `ck:ckm:write:good` + `copywriting` | 800-1500 words, 3-5 hashtags, canonical to agentic.dog |
| LinkedIn short | `social` + `copywriting` | 200-350 words, ≤3 hashtags, teaser + link |
| X thread | `social` + devlog-publisher `twitter_thread.md` | 7-12 posts, DIFFERENT angle from blog |
| Repo README | `docs` + manual | Add "Featured in: {post}" + series link |
| hack.ski copy | `ck:ckm:write:enhance` | Same post body, adjusted positioning (less AI jargon, more general-tech framing) |

## Syndication Runner (choice deferred to sign-off)

**Recommended: scripted runner (Node/TS) invoked from Vercel deploy hook or GitHub Action**
- Reads published frontmatter + body
- Adapts per platform using skills + LLM call
- Posts via platform APIs (LinkedIn, Substack, X; Medium = draft link, copy-paste)
- Logs to Supabase (already in MCP list)

**Alternatives:**
- n8n (self-hosted, visual) — heavier, more flexible, ops cost
- Postiz (OSS multi-channel) — fast, less customizable
- Typefully (paid, X-only) — narrow
- Publer (paid, multi) — narrow adapters

## Release-Cycle Cadence (30-day)

- **Flagship launches** (3): validationforge GA + big post, codestories.platform debut + big post, agentic-dog manifesto post
- **Product posts** (8-10): one per flagship product on rotation
- **Insight-only days** (6-8): short post/thread drawn from insight library, no repo launch
- **Devlog days** (2-3/week): daily-ish thin updates on the push itself
- **Off days** (4-6): no new content, engagement only
- **Offset rule**: LinkedIn article + Substack fire same day as blog; Medium +24h (canonical cool-down); X thread +6h (drive traffic to blog first)

## Measurement (decision required at Phase 07)

Per piece, tagged by UTM:
- Page views, scroll depth, time on page — **analytics tool: Plausible recommended** (privacy-first, lightweight, $9/mo, easy install on Astro). Alternatives: Vercel Analytics (free with Pro plan, less detailed), PostHog (feature-rich but heavier). Decide before Phase 07 sign-off.
- Link clicks to repo (GitHub referrer in analytics)
- Stars, clones, forks (via `gh api` nightly → `reports/metrics-{date}.json`)
- Consulting inquiries (UTM-tagged form on /work, logged to Supabase)
- Follower delta LinkedIn + X (manual daily check for 30 days)
- **Baseline captured in Phase 00 (`reports/baseline-2026-04-19.yaml`)** — all deltas measured against it.

## Acceptance Criteria

- [ ] Canonical flow diagram rendered (excalidraw) in `synthesis/publication-flow.excalidraw.png`
- [ ] Platform matrix table complete with skill mappings
- [ ] Syndication runner stack chosen by user at Phase 07 sign-off
- [ ] Measurement plan names exact analytics tool (not "TBD")

## Risks

- **LinkedIn API restrictions** on posting articles programmatically — public API doesn't support article publishing, only shares. Mitigation: LinkedIn articles drafted locally, manual publish via UI; shares/short posts scriptable.
- **Medium API is deprecated** — manual copy-paste with canonical tag. Mitigation: accept manual step, 2 minutes/post.
- **Substack API is email-based (send-from API)** — manageable but publish-to-web is manual. Mitigation: publish via Substack UI, body auto-generated.
