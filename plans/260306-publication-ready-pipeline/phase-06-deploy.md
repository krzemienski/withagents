# Phase 6: Build, Validate, Deploy

**Priority:** FINAL — requires all other phases complete
**Status:** Not started

## Goal

Final build verification, functional validation, and production deployment.

## Pre-Deploy Checklist

### Content Integrity
```bash
# All 61 posts have frontmatter
for d in posts/post-*/; do
  grep -q '^---' "$d/post.md" || echo "MISSING FRONTMATTER: $d"
done

# All posts have consistent series_total
grep -r 'series_total:' posts/*/post.md | grep -v '61' && echo "INCONSISTENT" || echo "ALL 61"

# All github_repo URLs are valid
for d in posts/post-*/; do
  repo=$(grep 'github_repo:' "$d/post.md" | sed 's/.*"//;s/".*//')
  [ -n "$repo" ] || echo "MISSING REPO URL: $d"
done

# Word count audit
for d in posts/post-*/; do
  wc=$(wc -w "$d/post.md" | awk '{print $1}')
  [ "$wc" -ge 1500 ] || echo "SHORT: $d ($wc words)"
done
```

### Site Build
```bash
cd site
pnpm build 2>&1 | tail -20
# Expect: 69+ static pages (home, about, schedule, 61 posts, feed, sitemap, 404)
```

### GitHub Repos
```bash
# Verify all 61 repos exist on GitHub
for repo in $(grep 'github_repo:' posts/*/post.md | sed 's/.*krzemienski\///;s/".*//' | sort -u); do
  gh repo view krzemienski/$repo --json url -q '.url' 2>/dev/null || echo "MISSING: $repo"
done
```

### RSS & Sitemap
```bash
# Verify RSS feed
curl -s http://localhost:3000/feed.xml | grep '<item>' | wc -l
# Expect: 61

# Verify sitemap
curl -s http://localhost:3000/sitemap.xml | grep '<url>' | wc -l
# Expect: 64+ (home, about, schedule, 61 posts)
```

## Deploy

```bash
cd site
npx vercel --prod
```

## Post-Deploy Verification

1. Visit production URL
2. Verify homepage shows all 61 posts
3. Click into 5 random posts — verify rendering, code blocks, repo links
4. Verify /about page stats
5. Verify /schedule page
6. Verify /feed.xml returns valid RSS
7. Verify /sitemap.xml returns valid XML
8. Check Vercel Analytics dashboard

## Final Checklist

- [ ] 61 posts render correctly
- [ ] All companion repo links resolve to GitHub
- [ ] Code blocks match repo code
- [ ] Social content is post-specific
- [ ] SEO meta tags present on all pages
- [ ] RSS feed includes all 61 posts
- [ ] Sitemap includes all pages
- [ ] Publishing schedule page works
- [ ] Vercel Analytics active
- [ ] robots.txt accessible
