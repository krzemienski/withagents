# Devlog Publisher Website & Content Pipeline

**Created:** 2026-03-05
**Status:** Planning
**Scope:** Standalone Vercel website + 10 new blog posts + reusable skill

## Overview

Transform the existing 11-post blog series ("Agentic Development: 10 Lessons from 8,481 AI Coding Sessions") into a production Vercel-deployed website with analytics, generate 10 new posts from 180 days of session history, and package the entire pipeline into a reusable skill.

## Current State

- 11 blog posts in `posts/` (22,489 words, 33 Mermaid diagrams, 470 evidence screenshots)
- 10 companion repos with working code (Python, Swift, Rust, JS)
- `DESIGN.md` with "Midnight Observatory" dark theme spec
- Original creation via `devlog-publisher` skill on March 1, 2026
- No website, no CLAUDE.md, no deployment infrastructure

## Phases

| # | Phase | Status | Priority | Effort |
|---|-------|--------|----------|--------|
| 1 | [Project Foundation](./phase-01-project-foundation.md) | Pending | Critical | S |
| 2 | [Website Build & Deploy](./phase-02-website-build-deploy.md) | Pending | Critical | L |
| 3 | [Session Mining & Insight Extraction](./phase-03-session-mining.md) | Pending | High | L |
| 4 | [New Blog Posts & Example Repos](./phase-04-new-blog-posts.md) | Pending | High | XL |
| 5 | [Publishing Workflow](./phase-05-publishing-workflow.md) | Pending | Medium | M |
| 6 | [Skill Packaging](./phase-06-skill-packaging.md) | Pending | Medium | L |

## Dependencies

```
Phase 1 ──→ Phase 2 ──→ Phase 5
                ↕
Phase 3 ──→ Phase 4 ──→ Phase 5 ──→ Phase 6
```

- Phase 1 unblocks everything (CLAUDE.md, project config)
- Phase 2 (website) and Phase 3 (mining) can run in parallel after Phase 1
- Phase 4 depends on Phase 3 (mined insights)
- Phase 5 depends on Phase 2 (site deployed) + Phase 4 (new content ready)
- Phase 6 depends on all prior phases (packages the proven workflow)

## Key Decisions

- **Framework:** Next.js 15 (App Router) — Vercel-native, MDX support, SSG for blog posts
- **Styling:** Tailwind CSS v4 + shadcn/ui — matches "Midnight Observatory" dark theme
- **Analytics:** Vercel Analytics + Plausible (privacy-friendly, no cookie banner needed)
- **Content Format:** MDX (existing Markdown posts + React components for Mermaid/visuals)
- **Deployment:** Vercel (automatic from GitHub, preview deploys on PR)
- **Session Scanning:** 180-day lookback across all `~/.claude/projects/` JSONL files
- **Stitch MCP:** Used for hero images, social cards, and design exploration

## Success Criteria

- [ ] CLAUDE.md written with full project context and Stitch MCP integration
- [ ] Website live on Vercel with all 11 existing posts rendered
- [ ] Analytics tracking page views, read time, scroll depth
- [ ] 10 new blog posts generated from 180-day session scan
- [ ] 10 new companion example repos created and linked
- [ ] Publishing workflow documented and executable
- [ ] Reusable skill packaged and functional
