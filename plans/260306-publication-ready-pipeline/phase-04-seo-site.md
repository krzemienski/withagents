# Phase 4: SEO & Site Updates

**Priority:** MEDIUM — can start after Phase 3
**Status:** Not started

## Goal

Optimize all 61 posts for search engines, add internal cross-links, create a publishing schedule page, and update site stats.

## SEO Checklist Per Post

### Frontmatter Verification
- [ ] title: Under 60 chars, includes primary keyword
- [ ] subtitle: 150-160 chars, actionable meta description
- [ ] series_total: 61 (all posts consistent)
- [ ] github_repo: Points to valid GitHub URL
- [ ] tags: 3-5 tags, includes AgenticDevelopment

### Internal Cross-Links
Each post should link to 2-3 related posts. Groupings:

| Theme | Posts |
|-------|-------|
| iOS Development | 4, 23, 30, 32, 33, 34, 39, 40 |
| Orchestration | 8, 16, 18, 35, 36, 43, 56, 60 |
| Validation | 3, 12, 27, 42, 48, 53 |
| Debugging | 17, 31, 47, 50 |
| Content Pipeline | 9, 19, 29, 45, 61 |
| Specification | 14, 24, 25, 26, 54, 55 |
| Design & UI | 10, 20, 41, 44 |
| Memory & State | 15, 21, 49, 52 |
| Worktrees & Git | 6, 16, 37, 38 |
| TDD & Testing | 42, 48, 53, 57 |

Add a "Related Posts" section at the bottom of each post:
```markdown
## Related Posts in This Series

- [Post {N}: {Title}](/posts/{slug}) — {one-line description}
- [Post {N}: {Title}](/posts/{slug}) — {one-line description}
```

### Open Graph Tags
Verify in site layout.tsx:
- og:title = post title
- og:description = post subtitle
- og:image = hero-card.html (or screenshot)
- og:type = article
- twitter:card = summary_large_image

## Site Updates

### Homepage (page.tsx)
- Update stats: "61 posts", correct repo count, correct word count
- Verify all 61 posts appear in the post grid
- Ensure ICONS map covers posts 22-61

### About Page (about/page.tsx)
- Update stats grid:
  - Sessions: 4,500
  - Worktrees: 3,066
  - Agent Types: 25
  - Screenshots: 470
  - Words: 429,000+
  - Companion Repos: 61

### Publishing Schedule Page (NEW)
Create `site/src/app/schedule/page.tsx`:
- Calendar view of publication dates
- Tue/Thu publishing cadence
- Wave groupings by theme
- Status indicator (published/scheduled/draft)

### Schedule
| Wave | Posts | Dates | Theme |
|------|-------|-------|-------|
| 1 | 1-11 | Mar 10 - Mar 27 | Foundations |
| 2 | 12-21 | Apr 1 - Apr 17 | Core Patterns |
| 3 | 22-31 | Apr 22 - May 8 | Advanced Techniques |
| 4 | 32-41 | May 13 - May 29 | Platform Mastery |
| 5 | 42-51 | Jun 3 - Jun 19 | Scale & Production |
| 6 | 52-61 | Jun 24 - Jul 10 | Meta-Engineering |

## Verification

- [ ] All 61 posts have consistent frontmatter
- [ ] Each post links to 2-3 related posts
- [ ] Homepage shows all 61 posts
- [ ] About page stats are accurate
- [ ] Schedule page renders correctly
- [ ] `pnpm build` produces 69+ static pages
