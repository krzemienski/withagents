# Workstream D — Blog-Series Current-State Audit

**Work context:** `/Users/nick/Desktop/blog-series`
**Date:** 2026-04-19
**Author:** Workstream D (general-purpose, aa44482bd1a242e9c)

## Summary (≤100 words)

The repo today IS the current static site: a Next.js 16 (App Router, TS, Tailwind v4) project under `site/` that reads 18 MDX-ish Markdown posts from `../posts/`, renders with `next-mdx-remote` + client-side `mermaid@11`, and ships as SSG to Vercel (project `prj_X5lVzc12FKPHuXLSMDoNaAuW4Wdx`, alias `site-rho-pied.vercel.app`). All 18 posts carry consistent `Nick Krzemienski` authorship, `2026-03-06` date, `series_total: 18`, and point to 14 companion repos. Pipeline supports social cards, RSS, sitemap, admin API, Supabase, LinkedIn/Twitter auth scripts. Latest commit `928c3b7` already consolidated 61→18. Multiple infrastructure layers exist that will migrate to withagents.dev near-wholesale; some (admin, social autopost) may retire.

## Information Architecture (Current)

```
site/ (Next.js 16, App Router, SSG)
├── /                                  → post grid homepage (src/app/page.tsx)
├── /about                             → methodology / about page
├── /posts/[slug]                      → 18 MDX post renders
├── /feed.xml                          → RSS route (route.ts)
├── /sitemap.xml                       → sitemap route (route.ts)
├── /admin                             → admin UI (page.tsx)
├── /api/admin/posts                   → admin CRUD (Supabase)
└── /api/admin/posts/[slug]            → admin per-post CRUD
```

Components (only 2 — lean):
- `mermaid-renderer.tsx` — client-side Mermaid with dark theme
- `post-sidebar.tsx` — persistent sidebar navigation

Content loader (`src/lib/posts.ts`) — falls back from `../posts` (parent) → `./posts` (local copy during Vercel build, via `prebuild` script: `if [ ! -d posts ] && [ -d ../posts ]; then cp -r ../posts posts; fi`). This is the "posts must live in BOTH places" sync memory-item in practice.

Design tokens live in `globals.css` + Tailwind v4 config. Font: Material Symbols (homepage uses `material-symbols` icon names per series #). Theme class names observed: `bg-surface`, `border-border`, `pink-hot`, `purple-vivid`, `cyan-data`, `text-muted` — Midnight Observatory variant.

## Post Inventory (18 posts)

| # | Slug | Title (short) | Lines | ~Words | Deploy | Voice (cursory) | Repo |
|---|------|---------------|-------|--------|--------|-----------------|------|
| 01 | post-01-series-launch | 23,479 Sessions: What Actually Works | 286 | ~2,900 | Live | Strong, data-first hook | agentic-development-guide |
| 02 | post-02-multi-agent-consensus | 3 Agents Found the Bug 1 Missed | 471 | ~4,700 | Live | Consistent | multi-agent-consensus |
| 03 | post-03-functional-validation | I Banned Unit Tests | 449 | ~4,500 | Live | Consistent | claude-code-skills-factory |
| 04 | post-04-ios-streaming-bridge | Five-Layer Streaming Bridge | 466 | ~4,600 | Live | Consistent | claude-ios-streaming-bridge |
| 05 | post-05-ios-patterns | iOS Patterns Compendium | 446 | ~4,500 | Live | Consistent | claude-code-ios |
| 06 | post-06-parallel-worktrees | 194 Parallel Agents | 413 | ~4,100 | Live | Consistent | auto-claude-worktrees |
| 07 | post-07-prompt-engineering-stack | 7-Layer Prompt Stack | 387 | ~3,900 | Live | Consistent | shannon-framework |
| 08 | post-08-ralph-orchestrator | Self-Correcting Loop | 463 | ~4,600 | Live | Strong, narrative 1:47 AM hook | ralph-loop-patterns |
| 09 | post-09-code-tales | Mining 23,479 Sessions | 376 | ~3,800 | Live | Consistent | session-insight-miner |
| 10 | post-10-stitch-design-to-code | Designer-Less Workflow | 385 | ~3,800 | Live | Consistent | stitch-design-to-code |
| 11 | post-11-spec-driven-development | YAML Beats Verbal | 416 | ~4,100 | Live | Consistent | reponexus |
| 12 | post-12-cross-session-memory | Teaching AI to Remember | 352 | ~3,500 | Live | Consistent | claude-mem-architecture |
| 13 | post-13-sequential-thinking-debugging | 84 Thinking Steps | 445 | ~4,400 | Live | Consistent | sequential-thinking-debugging |
| 14 | post-14-multi-agent-merge | 35 Worktrees, Zero Conflicts | 454 | ~4,500 | Live | Consistent | multi-agent-merge-orchestrator |
| 15 | post-15-skills-anatomy | Anatomy of a Skill | 540 | ~5,400 | Live | Longest | claude-code-skills-factory |
| 16 | post-16-claude-code-plugins | Plugins That Actually Work | 452 | ~4,500 | Live | Consistent | shannon-framework |
| 17 | post-17-ccb-evolution | CCB Evolution | 390 | ~3,900 | Live | Strong `$47 bill` hook | claude-code-monorepo |
| 18 | post-18-sdk-vs-cli | SDK vs CLI Decision | 383 | ~3,800 | Live | Consistent finale | claude-code-monorepo |

**Totals:** 7,574 lines ≈ 75,000 words (INDEX.md claims 58,561 — INDEX is stale; actual is higher since consolidation).

**Frontmatter consistency (verified):** all 18 posts = `author: "Nick Krzemienski"`, `date: "2026-03-06"`, `series_number` 1–18, `series_total: 18`. Earlier REVIEW doc's "Nick Baumann" issue has been resolved in the consolidation.

## Assets

Per-post `assets/` directory pattern (from samples):

| Asset type | Post 01 | Post 08 | Post 17 | Post 18 |
|-----------|---------|---------|---------|---------|
| `hero-card.html` | Yes | Yes | Yes | Yes |
| `twitter-card.html` | Yes | Yes | Yes | Yes |
| `linkedin-card.html` | Yes | Yes | Yes | Yes |
| `stitch-hero.html` + `.png` | Yes | Yes | **Missing** | **Missing** |
| Mermaid `.mermaid` + `.svg` diagrams | 2 pairs | 4 pairs | **None** | **None** |
| Additional SVG charts | `series-stats`, `validation-comparison`, `review-comparison` | — | — | — |
| `index.html` standalone | Yes | Yes | No | No |
| `post.pdf` | Yes | Yes | No | No |

**Gaps:** Posts 17 & 18 (and likely other later-batch posts) are missing Stitch hero images, `.mermaid`/`.svg` diagrams, `index.html`, and `post.pdf`. Posts 01–11 are asset-complete; 12–18 may be asset-light. REVIEW-POSTS-01-04, 05-08, 09-11 exist as deep-audit docs; **there is no REVIEW doc for 12–18**, so voice/fact QA is unverified for the later half.

## Deployment Pipeline

- **Build host:** Vercel (`prj_X5lVzc12FKPHuXLSMDoNaAuW4Wdx`, team `team_P4dd5GzFfduh4dNaooKMXKQl`)
- **Alias:** `site-rho-pied.vercel.app`
- **Deploy mode:** manual `npx vercel --prod` (no git remote configured on `site/`; site is a submodule)
- **Build:** `pnpm build` → `next build` (SSG). `prebuild` copies `../posts` → `./posts` if absent
- **Framework:** Next.js 16.1.6, React 19.2.3, TS 5, Tailwind v4, node-native pipeline via `unified`/`remark`/`rehype` with `remark-gfm`, `rehype-highlight`, `rehype-slug`, `rehype-autolink-headings`, `rehype-raw`
- **Analytics:** `@vercel/analytics` + `@vercel/speed-insights` installed
- **Content:** `next-mdx-remote@6`, `gray-matter`, `reading-time`, `mermaid@11`
- **CMS-ish:** `@supabase/supabase-js` + admin routes — Supabase schema in `scripts/supabase-schema.sql`; `seed-schedule.js`; `publish-scheduled.js`
- **Social autopost:** `twitter-api-v2` + LinkedIn auth scripts (`social-auth-x.js`, `social-auth-linkedin.js`) + launchd dir
- **Social cards:** Puppeteer-based `render-social-cards.js`
- **No `vercel.json`** in site; default Next.js detection used
- **Domain:** None assigned (roadmap task "Custom domain assignment" unchecked in SITE.md)

## What Migrates to withagents.dev

**Keep (verbatim):**
- All 18 `post.md` files + frontmatter (already consistent)
- `DESIGN.md` Midnight Observatory tokens (Void Navy, Indigo Pulse, Cyan Signal palette)
- `stitch.json` project ID + `scripts/render-social-cards.js` pipeline
- `src/lib/posts.ts` loader + `next-mdx-remote` + Mermaid renderer (proven working)
- RSS + sitemap route logic
- `scripts/deep-mine.py` + `scripts/output/full-mine-data.json` (source of all stats)
- Companion repo mapping (14 repos all on GitHub under `krzemienski/`)
- Per-post `assets/hero-card.html`, `twitter-card.html`, `linkedin-card.html` templates (posts 01–11 complete; 12–18 have social cards)
- Existing Mermaid diagrams for posts 01–14-ish (visual evidence)

**Migrate with restructuring:**
- `site/` app tree — rebuild with withagents.dev IA (home/projects/writing/series/now/work) but keep post rendering path under `/series/[slug]` or `/writing/[slug]`
- Admin routes — may or may not move; depends on whether new site has CMS
- Social cards + Supabase scheduling — optional keep

## What Retires

- **`REVIEW-POSTS-*.md`** — staging docs, not needed on new site
- **`site/findings.md`, `site/portfolio-analysis.md`, `site/progress.md`, `site/task_plan.md`, `site/product-concepts.md`, `site/prd-*.md`** — orphan planning artifacts in the site submodule
- **`scripts/launchd/`** — macOS-local cron jobs, environment-coupled
- **`post.pdf` files** — unclear who consumes these; retire unless withagents.dev wants download links
- **`site/e2e-evidence/`** — validation artifacts, not site content
- Stale INDEX.md word count claim (58,561) — regenerate during migration
- Homepage icon-per-series scheme (Material Symbols) may retire if withagents.dev IA splits posts across writing vs series sections

## 260305-2119-devlog-publisher-website Plan Absorption Scope

That plan had 6 phases; this audit's state against each:

| Phase | Plan Scope | Actual State (2026-04-19) | Leftover for new plan |
|-------|-----------|----------------------------|------------------------|
| 1 Project Foundation | CLAUDE.md, Stitch MCP, config | **Done** — CLAUDE.md exists, `stitch.json` persists project ID | — |
| 2 Website Build & Deploy | Next.js site, SSG, RSS/sitemap, analytics | **Done** — deployed to Vercel, all routes live | Need withagents.dev IA rebuild |
| 3 Session Mining | 180-day scan, insight extraction | **Done** — `scripts/deep-mine.py` ran; full-mine-data.json produced 23,479 sessions figure | — |
| 4 New Blog Posts (10 more) | Generate posts 12–21 | **Done then consolidated** — originally 61 posts, consolidated to 18; posts 12–18 exist but have asset gaps (no Mermaid SVGs, no stitch-hero, no REVIEW doc) | Phase 09 of new plan must: (a) verify posts 12–18 voice via Workstream H; (b) backfill Mermaid diagrams and stitch-heroes for 12–18 |
| 5 Publishing Workflow | Supabase scheduling, social autopost | **Partially done** — scripts exist, LinkedIn/Twitter auth wired; unclear if ever fired | Decision: keep, retire, or rebuild for withagents.dev |
| 6 Skill Packaging | Package `devlog-publisher` skill | **Done** — skill exists in global `~/.claude/skills/devlog-publisher/` (visible in skills catalog) | — |

**Net:** the old plan is ~85% complete. Only residual work: asset backfill on posts 12–18, voice QA on later posts, and the publishing pipeline question.

## Gaps Against New withagents.dev Requirements

Assuming phase-04-cms-site-architecture.md targets IA: **home / projects / writing / series / now / work / about**:

| Required section | Today's equivalent | Gap |
|------------------|-------------------|-----|
| Home | `/` post grid | Redesign — blog-grid-as-homepage too narrow for brand site |
| Projects | None | **Missing** — no project/portfolio section. 14 companion repos exist as data but no UI |
| Writing | `/posts/*` | Exists but conflates with series |
| Series | `/posts/*` | Exists but no dedicated series landing/roadmap page (SITE.md claims `/schedule` deployed, but no route found in src tree — possibly dead or stripped) |
| Now | None | **Missing** — no "/now" page |
| Work | `/about` (partial) | **Missing** — no consulting/availability page; `/about` is methodology only |
| About (personal) | `/about` | Exists but currently methodology-focused |
| Newsletter/subscribe | None | **Missing** — no email capture on site |
| Contact | None | **Missing** |
| Logo/favicon | `favicon.ico` only | Brand needs new mark |
| Open Graph | Set via frontmatter + hero cards | Works; likely needs per-page OG for non-post routes |

Components to build net-new: project cards, work/consulting page, now page, newsletter capture, logo/mark, potentially a home hero that isn't just the post grid.

## Unresolved Questions

1. Are Supabase admin routes and social autopost scripts actively used, or stale? (Affects retire-vs-migrate decision for `/admin`, `/api/admin/*`, `scripts/publish-scheduled.js`, LinkedIn/Twitter auth.)
2. Should posts move from `/posts/[slug]` to `/series/[slug]` or `/writing/[slug]` on withagents.dev, and is there need for URL redirects from the existing Vercel alias?
3. Are posts 12–18 asset-light because they were consolidated from 61→18 and never got visuals regenerated, or because they were spec'd without diagrams?
4. Does withagents.dev get a new Vercel project (new alias, new domain), or does `site-rho-pied` get re-aliased to withagents.dev?
5. Are companion repos (14) surfaced as a Projects section, or only as per-post repo links?
6. What happens to `/schedule` — SITE.md claims it's deployed, but `src/app/` has no `schedule/` route (dead link or removed after 61→18 consolidation).
7. Is the `post.pdf` per post actually consumed anywhere (linked from the site), or orphan output from an old pipeline?
8. Should `stitch.json` project ID persist for withagents.dev or does the brand site want a fresh Stitch project for new hero generation?
