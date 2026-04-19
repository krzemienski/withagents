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
| Schedule | Deployed | `/schedule` |
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
- [x] Deploy to Vercel
- [x] Write posts 22-61 from session mining (40 new posts)
- [x] Social media content for all posts (twitter, linkedin, newsletter)
- [x] Hero card images for all 61 posts
- [x] Publishing schedule page (`/schedule`)
- [x] Companion repos for all 61 posts (61/61 validated — see plans/reports/functional-validation-260306-all-repos.md)
- [x] Push all repos to GitHub (61/61 — 11 existed + 50 created)
- [ ] Post-repo integration (inline code links in posts)
- [ ] Post-specific social content rewrite
- [ ] SEO internal cross-links between related posts
- [ ] Custom domain assignment

## Stats
- **61** published posts
- **429,000+** words across all posts
- **61** companion repositories (all validated — 44 Python, 6 Swift, 6 TypeScript, 5 meta)
- **4,500** AI coding sessions analyzed
- **90** days of production development

## Publishing Schedule
- **Cadence:** Tue & Thu at 9 AM ET
- **Waves:** 6 thematic waves (see `/schedule` page)
- **Start:** March 10, 2026
- **End:** July 10, 2026

## Creative Freedom
- Hero images: gradient dark backgrounds with dot grid overlays, category pills
- Diagrams: Mermaid with dark theme, contained in bordered panels
- Social cards: same dark aesthetic, metric highlight boxes
- No stock photography. All visuals generated or diagrammatic.
