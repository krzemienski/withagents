# Phase 1: Project Foundation

**Priority:** Critical
**Effort:** S (Small)
**Status:** Pending
**Blocks:** All other phases

## Overview

Establish project configuration, write CLAUDE.md, initialize the Next.js project structure, and configure Stitch MCP integration.

## Context

- Existing content: 11 posts in `posts/`, 10 repos, `DESIGN.md`
- No `package.json`, no framework, no CLAUDE.md
- Skills available: `stitch-loop`, `devlog-publisher`
- Stitch MCP tools: `create_project`, `generate_screen_from_text`, `get_screen`, `edit_screens`, `generate_variants`

## Requirements

### Functional
- CLAUDE.md with full project context, build commands, Stitch MCP usage patterns
- Next.js 15 project initialized with App Router, TypeScript, Tailwind CSS v4
- MDX configured for rendering existing Markdown posts
- Stitch project created and `stitch.json` persisted
- SITE.md created per stitch-loop skill requirements

### Non-Functional
- Project builds cleanly with `pnpm dev` / `pnpm build`
- All existing posts parseable as MDX without errors

## Implementation Steps

1. **Write CLAUDE.md** for the blog-series project
   - Project description, tech stack, directory structure
   - Build/dev/deploy commands
   - Content conventions (post format, frontmatter schema)
   - Stitch MCP usage: when/how to use for hero images, social cards
   - Link to DESIGN.md for visual specifications
   - Reference stitch-loop and devlog-publisher skill workflows

2. **Initialize Next.js 15 project**
   - `pnpm create next-app@latest site --typescript --tailwind --app --src-dir`
   - Install dependencies: `@next/mdx`, `next-mdx-remote`, `gray-matter`, `reading-time`
   - Configure `next.config.ts` for MDX, static export
   - Configure Tailwind with Midnight Observatory color tokens from DESIGN.md

3. **Set up content pipeline**
   - Create `site/src/lib/posts.ts` — reads `posts/*/post.md`, parses frontmatter, returns sorted list
   - Create MDX component mappings (Mermaid renderer, code blocks, callouts)
   - Validate all 11 existing posts parse without errors

4. **Initialize Stitch project**
   - Call `mcp__stitch__create_project` with title "Agentic Development Blog"
   - Persist project ID to `stitch.json`
   - Create SITE.md with sitemap, vision, and roadmap per stitch-loop conventions

5. **Verify foundation**
   - `pnpm build` succeeds
   - `pnpm dev` serves locally
   - At least one post renders correctly at `/posts/{slug}`

## Related Files

**Create:**
- `CLAUDE.md` — project instructions
- `site/` — Next.js project root
- `site/src/lib/posts.ts` — content loader
- `stitch.json` — Stitch project ID
- `SITE.md` — stitch-loop site constitution

**Read:**
- `DESIGN.md` — color tokens, typography, component specs
- `posts/INDEX.md` — post catalog
- `posts/01-series-launch/post.md` — validate format

## Success Criteria

- [ ] CLAUDE.md exists with comprehensive project context
- [ ] `pnpm build` in `site/` exits 0
- [ ] `pnpm dev` renders homepage with post list
- [ ] Stitch project created, ID persisted in `stitch.json`
- [ ] SITE.md written with sitemap of all 11 posts

## Risk Assessment

- **MDX parsing failures:** Some posts may use non-standard Markdown. Mitigation: test each post individually, fix syntax issues.
- **Mermaid rendering:** Client-side Mermaid rendering can be heavy. Mitigation: use `mermaid` package with dynamic import, or pre-render to SVG at build time.
