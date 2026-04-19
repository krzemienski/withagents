# Publishing Roadmap: Agentic Development Blog Series

**Created:** 2026-03-20
**Author:** Nick Krzemienski
**Status:** Ready for execution

---

## Current State Assessment

### What Exists

**Content:** 18 polished posts (58,561 words total, avg 3,254/post), consolidated from an original 61-post corpus. All posts dated 2026-03-06, all have YAML frontmatter, assets directories, and companion GitHub repos mapped.

**Site:** Next.js 16.1.6 (App Router) + Tailwind v4, deployed to Vercel. 20 successful deployments, latest production build on ~March 9. Live at `site-rho-pied.vercel.app`. Includes RSS feed, XML sitemap, JSON-LD structured data, Vercel Analytics + Speed Insights, Mermaid diagram rendering, admin dashboard, and an about page.

**Repos:** 62 companion repositories with .git directories, all with GitHub remotes configured. 47 Python, 7 Node.js, 5 Swift, 3 polyglot. All 61 original repos passed functional validation (swift build, tsc, python import).

**Design System:** "Midnight Observatory" — premium dark theme with flat black (#000000) base, pink/purple accents, system font stack. Fully implemented in globals.css.

**Infrastructure:** Vercel project `prj_X5lVzc12FKPHuXLSMDoNaAuW4Wdx`, GitHub-connected auto-deploy from `main` branch, Stitch MCP project ID persisted.

### What's Missing

| Item | Priority | Effort |
|------|----------|--------|
| Custom domain (e.g., `agentic.dev`) | Critical | 1 hour |
| Markdown rendering fixes (italic leaks, raw HTML tables) | Critical | 4 hours |
| Posts 12-18 missing standalone `index.html` | Low | 2 hours |
| Post-repo integration (inline code links) | High | 6 hours |
| SEO internal cross-links between related posts | High | 4 hours |
| Post-specific social content (not generic templates) | Medium | 8 hours |
| Admin password security (`admin123` in plaintext) | Medium | 1 hour |
| Hard-coded `agentic.dev` domain in RSS/sitemap | Medium | 30 min |
| Publishing schedule dates need updating (planned March 10 start, now March 20) | High | 1 hour |
| OG/social card images (hero PNGs for each post) | Medium | 4 hours |
| Newsletter signup / email capture | Medium | 2 hours |
| Cross-posting to LinkedIn, Dev.to, HN, Twitter | High | Ongoing |

---

## Phase 1: Pre-Launch Fixes (Day 1-2)

**Goal:** Make the live site production-quality before any promotion.

### 1A. Custom Domain
- Purchase/configure `agentic.dev` (or chosen domain) in Vercel
- Update hard-coded domain in `feed.xml/route.ts` and `sitemap.xml/route.ts`
- Verify OG meta tags use the production domain
- Add domain to Vercel project settings

### 1B. Markdown Rendering Fixes
- Escape asterisks/underscores in prose that trigger italic/bold (glob patterns like `src/auth/*`, arithmetic like `200*1170*2532`)
- Fix raw HTML `<table>` blocks rendering as literal text
- Fix blank lines inside code fences creating unwanted `<p>` elements
- Audit all 18 posts against the visual audit reports in `plans/reports/`

### 1C. Security Hardening
- Move `ADMIN_PASSWORD` to Vercel Environment Variables (remove from `.env.local`)
- Change from `admin123` to a strong password
- Consider whether admin panel is needed at all in production (posts are all published via frontmatter)

### 1D. Update Publishing Schedule
- All 18 posts are written — adjust schedule from "Tue/Thu starting March 10" to a realistic cadence
- Option A: Publish all 18 immediately (they're ready)
- Option B: Drip 2/week starting March 25 (Tue/Thu at 9 AM ET) through May 1
- Update `/schedule` page on the site

**Deliverable:** Clean, bug-free site on custom domain.

---

## Phase 2: Content Polish & SEO (Day 3-5)

**Goal:** Maximize discoverability and cross-post readiness.

### 2A. Internal Cross-Links
- Add "Related Posts" section to each post linking 2-3 thematically connected posts
- Post 1 (series launch) should link to all others
- Create a topic cluster map:
  - **Multi-Agent cluster:** Posts 2, 6, 14, 16
  - **iOS/Mobile cluster:** Posts 4, 5
  - **Prompt/Governance cluster:** Posts 7, 8, 15, 16
  - **Validation/Testing cluster:** Posts 3, 13
  - **Infrastructure cluster:** Posts 9, 10, 11, 12
  - **SDK/CLI cluster:** Posts 17, 18

### 2B. Post-Repo Integration
- For each post, add inline GitHub links to specific files/functions referenced in the text
- Use format: `[View source →](https://github.com/krzemienski/repo/blob/main/file.py#L42)`
- Prioritize posts 2, 3, 7, 8 (most code-heavy)

### 2C. Meta & OG Tags Audit
- Verify each post has unique `description`, `og:title`, `og:description`, `og:image`
- Generate post-specific OG images using Stitch MCP (hero cards)
- Test with Twitter Card Validator and LinkedIn Post Inspector

### 2D. Sitemap & robots.txt
- Verify sitemap includes all 18 post URLs
- Ensure `robots.txt` allows all crawlers
- Submit sitemap to Google Search Console

**Deliverable:** SEO-optimized site with rich internal linking.

---

## Phase 3: Social & Distribution Content (Day 5-8)

**Goal:** Create platform-specific promotional content for launch.

### 3A. LinkedIn Content
- **Post 1 launch article:** Full LinkedIn article (~1,500 words), first-person narrative
- **Series announcement post:** "I spent 90 days building production software with AI coding agents. I'm publishing everything I learned."
- **Per-post teasers:** 18 short-form LinkedIn posts (200-300 words each) with key stat + link

### 3B. Twitter/X Content
- **Launch thread:** 15-20 tweet thread summarizing all 18 lessons (one stat per tweet)
- **Per-post tweets:** 18 individual tweets with pull quotes from INDEX.md
- **Pin tweet** linking to Post 1

### 3C. Dev.to Cross-Posts
- Cross-post full articles to Dev.to with canonical URL pointing to your domain
- Tags: `ai`, `productivity`, `devops`, `programming`, `claudecode`
- Start with Post 1, then highest-engagement posts

### 3D. Hacker News
- Submit Post 1 with title: "4,500 AI Coding Sessions in 90 Days: What I Learned"
- Best timing: Tuesday-Thursday, 9-11 AM ET
- Have Posts 2-3 ready as follow-ups if Post 1 gets traction

### 3E. Newsletter/Email
- Add email capture to the site (ConvertKit, Buttondown, or Substack)
- Create a "Subscribe for the next post" CTA on each post page
- Option: Mirror series on Substack for built-in distribution

**Deliverable:** Full social media content calendar + distribution plan.

---

## Phase 4: Launch Sequence (Day 8-10)

**Goal:** Coordinated multi-platform launch.

### Recommended Launch Calendar

| Date | Action |
|------|--------|
| Day 8 (Mon) | Publish all 18 posts on site, submit sitemap to Google |
| Day 8 (Mon) | Post LinkedIn series announcement |
| Day 8 (Mon) | Publish Twitter launch thread |
| Day 9 (Tue) | Submit Post 1 to Hacker News |
| Day 9 (Tue) | Cross-post Post 1 to Dev.to |
| Day 10 (Wed) | LinkedIn article for Post 1 |
| Day 10-onward | 2 LinkedIn teasers/week (Tue + Thu) for remaining posts |
| Day 10-onward | 2 Dev.to cross-posts/week |
| Week 2+ | Monitor analytics, double down on highest-performing posts |

### Alternative: Drip Schedule
If you prefer to build anticipation rather than launch all at once:

| Week | Posts Published | Promotion |
|------|----------------|-----------|
| Week 1 (Mar 25-28) | Posts 1-2 | HN submit, LinkedIn article, Twitter thread |
| Week 2 (Apr 1-4) | Posts 3-4 | LinkedIn teasers, Dev.to cross-posts |
| Week 3 (Apr 8-11) | Posts 5-6 | Continue LinkedIn + Dev.to cadence |
| Week 4 (Apr 15-18) | Posts 7-8 | |
| Week 5 (Apr 22-25) | Posts 9-10 | |
| Week 6 (Apr 29-May 2) | Posts 11-12 | |
| Week 7 (May 6-9) | Posts 13-14 | |
| Week 8 (May 13-16) | Posts 15-16 | |
| Week 9 (May 20-22) | Posts 17-18 | Final LinkedIn wrap-up post |

---

## Phase 5: Post-Launch Optimization (Ongoing)

### 5A. Analytics Review
- Monitor Vercel Analytics for traffic patterns
- Identify top-performing posts by pageviews and time-on-page
- Double down on distribution for top 3-5 posts

### 5B. GitHub Repo Engagement
- Add "Featured in Agentic Development Blog" badges to companion repo READMEs
- Ensure all repos have proper descriptions, topics, and links back to the blog
- Star-count tracking across the 14 unique repos

### 5C. Community Engagement
- Respond to HN/Dev.to/LinkedIn comments
- Share in relevant Discord/Slack communities (Claude Code, AI dev tooling)
- Consider r/ClaudeCode (4,200 weekly contributors per your research)

### 5D. Iteration
- Write follow-up posts based on reader questions/feedback
- Update posts with corrections or new data
- Consider podcast appearances or guest posts to amplify reach

---

## Decision Points for Nick

Before I execute any of this, I need your input on a few things:

1. **Domain:** Do you own `agentic.dev` already, or do you want to use a different domain? Should I check availability?

2. **Launch strategy:** All-at-once (Day 8 big bang) or drip (2/week over 9 weeks)? The drip approach builds more sustained engagement but delays the full series being available.

3. **Newsletter platform:** Do you want email capture on the site? If so, which platform (ConvertKit, Buttondown, Substack, or just a simple form)?

4. **The 61 → 18 consolidation:** SITE.md still references 61 posts and the site routing supports posts 1-61. Should I clean up the site to only serve the 18 consolidated posts, or keep the full 61 available?

5. **Admin panel:** Keep it (with proper auth) or remove it? Since all posts are controlled via frontmatter `published` field, the admin panel may not be needed.

6. **ValidationForge / product strategy:** The plans directory has extensive PRD work for premium products. Is that a separate initiative, or does it tie into this blog launch?

---

## Inventory Summary

| Asset | Count | Status |
|-------|-------|--------|
| Blog posts (source) | 18 | Written, frontmatted, assets complete |
| Blog posts (site) | 18 | Deployed, rendering (with markdown bugs) |
| Companion repos | 62 with .git, 14 unique for posts | All have GitHub remotes, all validated |
| Vercel deployments | 20 | All READY, production live |
| Visual audits | 3 reports | Markdown issues documented |
| Post outlines | 18 | Complete in plans/reports/outlines/ |
| Publishing plans | 5 major plans | Various stages |
| Product PRDs | 3 (ValidationForge, RalphOS, ConsensusGate) | Research complete |
| Session mining reports | 12 | Complete |
| Post review reports | 6 reader reports | Complete |
