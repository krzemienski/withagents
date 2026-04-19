# Agentic Development Blog Series

Technical blog series: "Agentic Development: 18 Lessons from 4,500 AI Coding Sessions" by Nick Krzemienski.

## Project Structure

```
blog-series/
├── site/                  # Next.js 15 website (App Router, TypeScript, Tailwind v4)
├── posts/                 # Blog posts (MDX with YAML frontmatter)
│   └── post-{nn}-{slug}/  # Each post directory contains:
│       ├── post.md        # Full post with frontmatter
│       ├── assets/        # Post-specific assets
│       └── index.html     # Standalone HTML version
├── DESIGN.md              # "Midnight Observatory" design system
├── SITE.md                # Stitch-loop site constitution
├── stitch.json            # Stitch MCP project ID (persisted)
├── plans/                 # Implementation plans
└── docs/                  # Project documentation
```

## Companion Repos (18 posts, 14 unique repos)

| Post | Repo | Description |
|------|------|-------------|
| 01 | `agentic-development-guide/` | Meta-repo, series overview |
| 02 | `multi-agent-consensus/` | Python, 3-agent unanimous gate voting |
| 03 | `claude-code-skills-factory/` | Skills + validation framework |
| 04 | `claude-ios-streaming-bridge/` | Swift, 5-layer SSE bridge |
| 05 | `claude-code-ios/` | Swift, iOS patterns compendium |
| 06 | `auto-claude-worktrees/` | Python, parallel worktree factory |
| 07 | `shannon-framework/` | Claude Code plugin, 4-layer enforcement |
| 08 | `ralph-loop-patterns/` | Python, hat-based execution loops |
| 09 | `session-insight-miner/` | Python, session log mining pipeline |
| 10 | `stitch-design-to-code/` | Node.js, design tokens + Stitch MCP |
| 11 | `reponexus/` | Spec execution framework |
| 12 | `claude-mem-architecture/` | Python + SQLite, observation store |
| 13 | `sequential-thinking-debugging/` | Python, 84-step root cause analysis |
| 14 | `multi-agent-merge-orchestrator/` | Python, 35-worktree conflict-free merge |
| 15 | `claude-code-skills-factory/` | Skills anatomy + devlog-pipeline |
| 16 | `shannon-framework/` | Plugin hooks + enforcement |
| 17 | `claude-code-monorepo/` | TypeScript SDK examples + CLI scripts |
| 18 | `claude-code-monorepo/` | SDK vs CLI decision framework |

## Commands

```bash
cd site && pnpm dev          # Local dev server (http://localhost:3000)
cd site && pnpm build        # Production build (SSG)
cd site && pnpm lint         # Lint check
```

## Post Format

Posts use YAML frontmatter:
```yaml
---
title: "Post Title"
subtitle: "Brief description"
author: "Nick Krzemienski"
date: "YYYY-MM-DD"
series_number: N
series_total: 18
github_repo: "https://github.com/krzemienski/repo-name"
tags:
  - AgenticDevelopment
  - ClaudeCode
---
```

Content uses standard Markdown with:
- Mermaid diagrams in fenced code blocks (render client-side with dark theme)
- SVG chart references: `![Chart](../visuals/svg/chart-name.svg)`
- Hero image references: `![Hero](../visuals/html/hero-name.html)`
- Real code snippets from production sessions (zero fabrication)

## Design System

**Theme:** Midnight Observatory (see DESIGN.md for full spec)

| Token | Hex | Role |
|-------|-----|------|
| Void Navy | #0f172a | Primary background |
| Slate Abyss | #1e293b | Cards, elevated surfaces |
| Indigo Pulse | #6366f1 | Primary accent, CTAs |
| Cyan Signal | #22d3ee | Metrics, data highlights |
| Cloud Text | #f1f5f9 | Headings, primary text |
| Slate Prose | #cbd5e1 | Body text |
| Mist Caption | #94a3b8 | Subtle text, metadata |

## Stitch MCP Integration

Stitch project ID stored in `stitch.json`. Usage patterns:
- **Hero images:** `generate_screen_from_text` with DESIGN.md Section 6 block
- **Social cards:** Generate Twitter (1200x628) and LinkedIn (1200x627) variants
- **Design exploration:** `generate_variants` with existing screens
- **Always** persist project ID after `create_project`
- **Always** include the design system prompt block from DESIGN.md Section 6

## Content Rules

- All code/output traceable to real Claude Code sessions
- No fabricated examples, no mock data
- Evidence-based claims with specific metrics
- First person, conversational but technically precise
- 1,500-2,500 words per post
