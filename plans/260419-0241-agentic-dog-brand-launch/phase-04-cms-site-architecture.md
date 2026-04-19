---
phase: 04
name: cms-site-architecture
status: pending
blockedBy: [phase-02-synthesis, phase-03-visual-system-proposal]
---

# Phase 04 — withagents.dev CMS Site Architecture

## Purpose

Propose the concrete stack + content model + IA + OG pipeline for withagents.dev. User signs off on one stack in Phase 07.

## Stack Recommendation (default; alternatives below)

**Astro 5 + Keystatic (git-based CMS) + Tailwind v4 + Satori OG + Vercel**

Why:
- Content-heavy, SEO-critical, mostly static → Astro's islands architecture wins over Next.js RSC cost
- Keystatic is git-native (no DB, no ops), writes MDX directly into repo — matches Nick's git-everywhere workflow
- Existing `blog-series/site/` is Next.js 15 — this plan introduces a NEW repo at `~/Desktop/withagents/`, so no migration tax
- Satori handles OG images; same theme tokens from Phase 03

**Alternatives (decision deferred to user sign-off):**
| Stack | Pros | Cons |
|---|---|---|
| Next.js 15 + Payload CMS (self-hosted) | Familiar, full CMS, previewing | DB ops, deployment heavier |
| Astro + Sanity (hosted) | Fast, great DX | Vendor lock-in, $$ at scale |
| Astro + TinaCMS | In-page editing | Less mature than Keystatic |
| Next.js (current blog-series) | Already running, known | Overkill for content-first site |

## Information Architecture

```
/                           Home: positioning + featured projects + latest writing + work-with-me
/projects/                  Index: filterable, status-tagged (ready/near/in-progress)
/projects/[slug]/           Individual: origin story + diagrams + repo link + related posts
/writing/                   Index: filterable by series + product
/writing/[slug]/            Post: OG metadata + diagrams + repo cross-link + series embed + CTA
/series/                    Series index (unifies long-form)
/series/[slug]/             Series page
/now/                       Currently working on
/work/                      Work with me (consulting + collaboration, NOT job-seeking)
/feed.xml, /sitemap.xml     SEO
```

## Content Model (Keystatic schemas)

```ts
Project {
  slug, title, subtitle, status (ready|near|active|archived),
  repo, website, hero_image, tech[], started, last_activity,
  origin_story (markdoc), diagrams[], related_posts[]
}
Post {
  slug, title, subtitle, series?, product?,
  published, updated, reading_time, body (markdoc),
  hero_image, diagrams[], related_projects[], cta_variant
}
Series {
  slug, title, description, posts[], cover_image
}
Insight {
  slug, claim, evidence_pointer, format, products[]
}
Diagram {
  slug, type (mermaid|excalidraw|svg), source, rendered_png
}
```

## SEO + OG Defaults

- Per-template `<title>`, description, canonical, og:image (auto)
- JSON-LD for Article, BreadcrumbList, Organization
- Satori template in `src/lib/og.tsx` using Phase 03 theme tokens
- Hero pulls from post frontmatter; fallback to series art; fallback to withagents.dev default

## Deploy

- Vercel (existing account, blog-series already deployed there)
- Preview environments per branch
- `main` → withagents.dev (prod)

## Acceptance Criteria

- [ ] Stack choice confirmed by user in Phase 07 sign-off
- [ ] Content model written as Keystatic schema (compilable) in Phase 09
- [ ] IA page-tree agreed — every URL above accounted for or explicitly deferred
- [ ] OG pipeline renders against real post data in Phase 09 preview

## Risks

- **Migration tax from Next.js blog-series** if user chooses to merge rather than net-new. Mitigation: recommend net-new; migration only if explicitly requested.
- **Keystatic maturity** — younger than Sanity. Mitigation: Keystatic + git fallback means content is always portable; lock-in risk is near-zero.
- **Keystatic content-volume stress test required (added 2026-04-19)** — before day 1 of Phase 12, publish 30 real MDX files through Keystatic, measure build time, confirm no frontmatter corruption at scale. Mitigation: run stress test during Phase 09, not during push. Named fallback: if Keystatic breaks at volume, migrate content to Astro's built-in content collections (zero admin UI, git-only editing) — portability guaranteed.
- **Vercel single-point-of-failure (added 2026-04-19)** — three domains + syndication runner all live on Vercel. Mitigation: keep static HTML exports of every post staged in git for emergency re-deploy to alt host (Cloudflare Pages, Netlify). Document cutover runbook in Phase 11.
