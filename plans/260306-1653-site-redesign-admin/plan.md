# Site Redesign: Dark Theme + Mermaid Fix + Admin Panel

**Created:** 2026-03-06
**Status:** Draft
**Priority:** High

## Summary

Three-pronged site overhaul:
1. Fix Mermaid diagram rendering (broken — package installed but never initialized)
2. Redesign to flat black + pink/purple accent palette
3. Admin panel for post publishing control (show only 10 perfected posts)

## Phases

| # | Phase | Status | Files |
|---|-------|--------|-------|
| 1 | [Mermaid Rendering Fix](phase-01-mermaid-fix.md) | Pending | 3 |
| 2 | [Dark Theme Redesign](phase-02-dark-theme.md) | Pending | 4 |
| 3 | [Admin Panel + Publishing](phase-03-admin-panel.md) | Pending | 7 |
| 4 | [10-Post Perfection](phase-04-perfect-posts.md) | Pending | 10 |
| 5 | [Deploy & Validate](phase-05-deploy-validate.md) | Pending | 2 |

## Architecture Decisions

### Mermaid
- Client-side rendering via `"use client"` component
- Detect `<pre><code class="language-mermaid">` blocks post-mount
- Replace with rendered SVG using mermaid.initialize() + mermaid.run()
- Dark theme config matching new palette

### Theme
- Flat black (#000000 / #0a0a0a) replaces Void Navy (#0f172a)
- Pink (#ec4899 / #f472b6) + Purple (#a855f7 / #8b5cf6) as primary accents
- Remove cyan as primary — keep for subtle data highlights only
- Gradient accents: pink→purple for hero, links, buttons

### Admin Panel
- Switch from `output: "export"` to standard Next.js (Vercel serverless)
- Add `/admin` route protected by `ADMIN_PASSWORD` env var
- API routes to toggle `published` field in post frontmatter
- Public site filters to `published: true` only
- Admin shows all 61 posts with toggle controls

### 10-Post Focus
- Set posts 1-10 `published: true`, posts 11-61 `published: false`
- Update series_total to 10 in published posts
- Update homepage stats/copy to reflect 10 posts
- Navigation only shows published posts

## Dependencies
- mermaid@^11.12.3 (already installed)
- No new packages needed

## Risk Assessment
- **Medium:** Switching from static export to SSR changes deployment model — Vercel handles this natively
- **Low:** Mermaid client-side rendering may flash — mitigate with loading state
- **Low:** Admin without proper auth — env var password sufficient for single-user blog
