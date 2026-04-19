# Phase 2: Website Build & Deploy

**Priority:** Critical
**Effort:** L (Large)
**Status:** Pending
**Blocked By:** Phase 1
**Blocks:** Phase 5

## Overview

Build the full blog website with the Midnight Observatory design system, deploy to Vercel, and integrate analytics. Use Stitch MCP for hero image and page design exploration.

## Context

- DESIGN.md defines: Void Navy (#0f172a), Indigo Pulse (#6366f1), Cyan Signal (#22d3ee)
- 11 posts with embedded Mermaid diagrams, SVG charts, HTML hero images
- Posts have `visuals/html/` and `visuals/svg/` subdirectories
- Each post is 1,500-2,500 words with frontmatter

## Requirements

### Functional
- Homepage with post grid (cards showing hero, title, reading time, tags)
- Individual post pages with full MDX rendering
- Series navigation (prev/next, reading paths from INDEX.md)
- About/methodology page
- RSS feed (`/feed.xml`)
- Sitemap (`/sitemap.xml`)
- OG meta tags with hero images for social sharing
- Analytics dashboard (page views, read time, scroll depth)

### Non-Functional
- Lighthouse score >90 on all categories
- First Contentful Paint <1.5s
- Full static generation (SSG) — no server runtime needed
- Mobile-responsive (posts readable on phone)
- Dark mode by default (Midnight Observatory theme)

## Architecture

```
site/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts, analytics
│   │   ├── page.tsx            # Homepage — post grid
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual post page
│   │   ├── about/
│   │   │   └── page.tsx        # About/methodology
│   │   ├── feed.xml/
│   │   │   └── route.ts        # RSS feed generation
│   │   └── sitemap.ts          # Dynamic sitemap
│   ├── components/
│   │   ├── post-card.tsx       # Homepage card component
│   │   ├── post-layout.tsx     # Post page wrapper
│   │   ├── mermaid-diagram.tsx # Client-side Mermaid renderer
│   │   ├── code-block.tsx      # Syntax-highlighted code
│   │   ├── hero-image.tsx      # Hero image with fallback
│   │   ├── reading-progress.tsx# Scroll progress bar
│   │   ├── series-nav.tsx      # Prev/next navigation
│   │   ├── toc.tsx             # Table of contents sidebar
│   │   └── analytics-provider.tsx
│   ├── lib/
│   │   ├── posts.ts            # Content loader (from Phase 1)
│   │   ├── mdx-components.ts   # MDX → React component map
│   │   └── analytics.ts        # Analytics utilities
│   └── styles/
│       └── globals.css         # Tailwind + Midnight Observatory tokens
├── public/
│   └── og/                     # Pre-generated OG images
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Implementation Steps

1. **Design system setup**
   - Configure Tailwind with Midnight Observatory tokens from DESIGN.md
   - Set up CSS variables: `--void-navy`, `--indigo-pulse`, `--cyan-signal`, `--soft-silver`
   - Typography: system font stack, heading weights, body line-height
   - Component primitives: cards (8-12px radius), buttons, code blocks

2. **Use Stitch MCP for design exploration**
   - Generate homepage layout with `generate_screen_from_text`
   - Generate post page layout
   - Use `generate_variants` to explore 3 design directions
   - Extract best patterns into React components
   - Generate/refine hero images for any posts missing them

3. **Build homepage**
   - Post grid with cards (hero thumbnail, title, excerpt, reading time, tags)
   - Sort by post number (series order)
   - 4 reading paths from INDEX.md (Practitioner, Builder, Architect, Experience-level)
   - Series statistics (22,489 words, 33 diagrams, 4,500 sessions)

4. **Build post pages**
   - MDX rendering with custom components
   - Mermaid diagram rendering (dynamic import, dark theme)
   - Syntax-highlighted code blocks (Void Navy background)
   - Hero image at top
   - Table of contents sidebar (generated from headings)
   - Reading progress bar
   - Prev/next navigation
   - Related posts
   - Estimated reading time

5. **Build supporting pages**
   - About page: methodology, author bio, series motivation
   - RSS feed at `/feed.xml`
   - Sitemap at `/sitemap.xml`
   - 404 page with series navigation

6. **Analytics integration**
   - Vercel Analytics (built-in, zero config)
   - Plausible script tag (privacy-friendly, custom events)
   - Custom events: scroll depth milestones (25%, 50%, 75%, 100%), time on page, outbound repo clicks
   - Reading time tracking

7. **SEO optimization**
   - OG meta tags per post (title, description, image)
   - Twitter card meta tags
   - Structured data (JSON-LD: BlogPosting schema)
   - Canonical URLs
   - Pre-generate OG images from existing hero HTML files

8. **Deploy to Vercel**
   - Connect GitHub repo to Vercel
   - Configure `vercel.json` if needed (redirects, headers)
   - Set up custom domain (if available)
   - Verify preview deploys work on PRs
   - Verify production build and deployment

9. **Functional validation**
   - Navigate to every post, verify rendering
   - Check Mermaid diagrams render correctly
   - Verify mobile responsiveness
   - Verify OG images load on social share previews
   - Verify analytics events fire
   - Run Lighthouse audit

## Related Files

**Create:**
- All files in `site/src/` architecture above
- `vercel.json` (if needed)
- `public/og/*.png` — pre-generated OG images

**Read:**
- `DESIGN.md` — all color/typography/component tokens
- `posts/*/post.md` — all 11 posts for content rendering
- `posts/*/visuals/` — hero images and diagrams

## Success Criteria

- [ ] Homepage renders all 11 posts as cards with heroes
- [ ] Each post page renders full MDX with Mermaid diagrams
- [ ] Lighthouse >90 on Performance, Accessibility, SEO, Best Practices
- [ ] Analytics tracking page views and scroll depth
- [ ] RSS feed validates at W3C Feed Validation Service
- [ ] OG images display correctly when sharing links
- [ ] Site deployed and accessible on Vercel URL
- [ ] Mobile-responsive (readable on 375px width)

## Risk Assessment

- **Mermaid rendering performance:** 33 diagrams across posts could slow client-side rendering. Mitigation: lazy-load Mermaid, or pre-render to SVG at build time.
- **Hero image sizes:** HTML-based heroes may be large. Mitigation: screenshot hero HTML to PNG at build, serve optimized images.
- **MDX compatibility:** Existing posts may have edge-case Markdown that MDX rejects. Mitigation: test each post individually in Phase 1, fix syntax.
