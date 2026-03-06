# Publishing Workflow

End-to-end guide for publishing posts in the Agentic Development series.

## Pre-Publish Checklist

Run through every item before pushing to main:

### Content
- [ ] Post renders correctly in dev (`cd site && pnpm dev`)
- [ ] Frontmatter complete: title, subtitle, author, date, series_number, series_total, github_repo, tags
- [ ] Word count: 1,500-2,500 words
- [ ] First person, conversational tone — technically precise
- [ ] All code snippets traceable to real sessions (zero fabrication)
- [ ] Mermaid diagrams render correctly in dark theme
- [ ] Internal links working (prev/next navigation)
- [ ] Reading time auto-calculated

### Companion Repository
- [ ] Repo pushed to GitHub at `github.com/krzemienski/{repo-name}`
- [ ] README with setup instructions, usage examples, architecture diagram
- [ ] Code runs without errors on clean clone
- [ ] License file present (MIT)
- [ ] `github_repo` frontmatter points to correct URL

### SEO & Meta
- [ ] Title tag set (via frontmatter title)
- [ ] Meta description set (via frontmatter subtitle)
- [ ] JSON-LD structured data auto-generated (BlogPosting schema)
- [ ] Canonical URL correct: `https://agentic.dev/posts/{slug}`
- [ ] RSS feed includes new post (`/feed.xml`)
- [ ] Sitemap includes new post (`/sitemap.xml`)

### Visual Assets
- [ ] Hero image generated via Stitch MCP (saved to `posts/{slug}/assets/`)
- [ ] OG image generated (1200x630) — or auto-generated from hero
- [ ] Social cards prepared: Twitter (1200x628) and LinkedIn (1200x627)

### Social Content
- [ ] X/Twitter thread written (7-12 tweets) in `posts/{slug}/social/twitter.md`
- [ ] LinkedIn post written (200-350 words) in `posts/{slug}/social/linkedin.md`
- [ ] Newsletter blurb written (400-600 words) in `posts/{slug}/social/newsletter.md`

## Publishing Execution Flow

```
1. Author writes post → posts/{nn}-{slug}/post.md
2. Generate visuals (Stitch MCP hero + Mermaid diagrams)
3. Create companion repo on GitHub
4. Generate social content (twitter.md, linkedin.md, newsletter.md)
5. Run pre-publish checklist (all boxes checked)
6. Git commit + push to main
7. Vercel auto-deploys (~60 seconds)
8. Verify live URL renders correctly
9. Post X thread (day of publish, 11am ET)
10. Post LinkedIn article (next day, 8am ET)
11. Send newsletter (weekly Friday digest)
12. Monitor analytics for 48 hours
```

## Recommended Publishing Schedule

| Day | Time (ET) | Action |
|-----|-----------|--------|
| Tuesday | 9:00 AM | Publish blog post #1 of the week |
| Tuesday | 11:00 AM | Post X/Twitter thread |
| Wednesday | 8:00 AM | Post LinkedIn article for Tuesday's post |
| Thursday | 9:00 AM | Publish blog post #2 of the week |
| Thursday | 11:00 AM | Post X/Twitter thread |
| Friday | 8:00 AM | Post LinkedIn article for Thursday's post |
| Friday | 10:00 AM | Send weekly newsletter digest |

**Companion repo timing:** Push repo to GitHub 24 hours before blog post goes live. This builds anticipation and ensures the repo is indexed by the time readers click through.

## Social Media Templates

### X/Twitter Thread (7-12 tweets)

```
Tweet 1 (Hook):
[Provocative stat or claim from the post]

This is what I learned from [specific number] of [specific thing].

A thread: 🧵

Tweet 2 (Context):
[Brief setup — what problem were you solving?]

Tweet 3-8 (Key insights):
[One insight per tweet, each self-contained]
[Include a code snippet or metric where possible]

Tweet 9 (Companion repo):
The full implementation is open source:
github.com/krzemienski/{repo}

[Brief description of what the repo contains]

Tweet 10 (CTA):
Full post with all the details, Mermaid diagrams, and production code:
[link to blog post]
```

### LinkedIn Post (200-350 words)

```
[Pattern interrupt opening — NOT "I'm excited to share..."]

[2-3 sentences of context: what you built, the scale, the challenge]

Here's what I found after [specific number] sessions:

1. [Key insight with metric]
2. [Key insight with metric]
3. [Key insight with metric]

[1-2 sentences on why this matters for the reader's work]

The companion repo is live: [github link]
Full post: [blog link]

#AgenticDevelopment #AI #SoftwareEngineering #DeveloperTools
```

### Newsletter Blurb (400-600 words)

```
Subject: [Curiosity-driven — "The one-line fix that took 84 thinking steps"]

Hey —

[2-3 sentence hook that creates tension or curiosity]

In this week's Agentic Development post, I cover:

- [Bullet 1: specific, concrete takeaway]
- [Bullet 2: specific, concrete takeaway]
- [Bullet 3: specific, concrete takeaway]

[1 paragraph expanding on the most interesting finding]

[Link to full post]

The companion repo has everything you need to try this yourself:
[Link to GitHub repo]

— Nick
```

## Post-Publish Monitoring

### Metrics to Track (First 48 Hours)
- Page views (target: 500+ for new posts)
- Average read time vs. estimated reading time
- Scroll completion rate (target: >40%)
- Outbound clicks to companion repo
- Social engagement: likes, shares, comments, thread impressions

### Weekly Review
- Top-performing posts by views and engagement
- Which posts drive the most companion repo visits
- Social platform comparison (X vs. LinkedIn vs. newsletter)
- Reader feedback and comments to incorporate

### Signals to Act On
- High scroll abandonment at specific section → revise that section
- Low repo click-through → strengthen the CTA or repo README
- High social engagement but low blog visits → improve link placement in threads
- Newsletter open rate <30% → revise subject lines

## Quick Reference

```bash
# Local development
cd site && pnpm dev

# Build and verify
cd site && pnpm build

# Deploy (auto on push, or manual)
cd site && npx vercel --prod

# Generate social content (via devlog-publisher skill)
# /devlog-publisher social --post posts/post-{nn}-{slug}/post.md
```
