# Agentic Development Blog

## Core Identity
A deeply technical blog series documenting 90 days of building production software with AI coding agents. Premium dark aesthetic ("Midnight Observatory"). Evidence-based — every claim backed by real session data.

## Visual Language
See DESIGN.md for full specification. Key tokens:
- Background: #0f172a (Void Navy)
- Cards: #1e293b (Slate Abyss)
- Accent: #6366f1 (Indigo Pulse)
- Data: #22d3ee (Cyan Signal)
- Text: #f1f5f9 / #cbd5e1 / #94a3b8

## File Architecture
```
site/                     — Next.js 16 website (App Router, TypeScript, Tailwind v4)
site/posts/               — Deployed blog posts (MDX with frontmatter)
posts/                    — Blog post source (all posts, including drafts)
stitch.json               — Stitch MCP project ID (5577890677756270199)
DESIGN.md                 — Visual design system ("Midnight Observatory")
```

## Live Sitemap

| Page | Status | Route |
|------|--------|-------|
| Homepage | Deployed | `/` |
| About | Deployed | `/about` |
| Post 01–11 | Deployed | `/posts/post-01-*` through `/posts/post-11-*` |
| Post 12–21 | Deployed | `/posts/post-12-*` through `/posts/post-21-*` |
| Post 22–31 | Deployed | `/posts/post-22-*` through `/posts/post-31-*` |
| Post 32–41 | Deployed | `/posts/post-32-*` through `/posts/post-41-*` |
| Post 42–51 | Deployed | `/posts/post-42-*` through `/posts/post-51-*` |
| Post 52–61 | Deployed | `/posts/post-52-*` through `/posts/post-61-*` |
| RSS Feed | Deployed | `/feed.xml` |
| Sitemap | Deployed | `/sitemap.xml` |

## Roadmap

- [x] RSS feed (`/feed.xml`)
- [x] Sitemap (`/sitemap.xml`)
- [x] Vercel Analytics + Speed Insights
- [x] JSON-LD structured data on posts
- [x] OG meta tags
- [x] Deploy to Vercel (SSO-protected; disable in dashboard for public access)
- [x] Write posts 22-61 from session mining (40 new posts)
- [x] Social media content for all posts (twitter, linkedin, newsletter)
- [ ] Generate hero images for posts 12-61 via Stitch MCP
- [ ] Generate visual assets (social cards) for posts 12-61
- [ ] Custom domain assignment
- [ ] Package pipeline as reusable skill

## Stats
- **61** published posts
- **425,000+** words across all posts
- **21** companion repositories
- **8,481** AI coding sessions analyzed
- **90** days of production development

## Creative Freedom
- Hero images: gradient dark backgrounds with dot grid overlays, category pills
- Diagrams: Mermaid with dark theme, contained in bordered panels
- Social cards: same dark aesthetic, metric highlight boxes
- No stock photography. All visuals generated or diagrammatic.
