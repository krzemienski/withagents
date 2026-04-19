# Phase 5: Social Content Rewrite

**Priority:** MEDIUM — can run parallel with Phase 4
**Status:** Not started

## Goal

Rewrite all social content to be specific to each post's actual content. Current social files are template-based and generic. Each should reference specific insights, metrics, and code from the post.

## Quality Standard

### twitter.md (7-12 tweets)
- Tweet 1: Provocative stat or claim from THIS post (not generic)
- Tweets 2-6: Specific insights with real numbers/code from post
- Tweet 7: Companion repo link with specific feature highlight
- Final tweet: Blog post link + 3-4 hashtags

**Bad (generic):** "AI coding agents can do amazing things. Here's what I learned..."
**Good (specific):** "321 screenshots. 47 automated taps. 0 manual testing. Here's how we validated an iOS app entirely through idb_tap automation 🧵"

### linkedin.md (200-350 words)
- Pattern interrupt opening with specific number/claim from post
- 3 numbered insights referencing actual code/metrics
- Companion repo + blog link
- 3-5 hashtags

### newsletter.md (400-600 words)
- Curiosity-driven subject line referencing post's core insight
- 2-3 sentence hook with specific tension from the post
- 4 bullet takeaways (each referencing real metrics/code)
- 1 paragraph expanding the most surprising finding
- Companion repo + blog link

## Agent Prompt Template

```
Rewrite social content for post {N}: "{title}"

Read the FULL post at: posts/post-{NN}-{slug}/post.md

Then rewrite these 3 files with POST-SPECIFIC content:
- posts/post-{NN}-{slug}/social/twitter.md
- posts/post-{NN}-{slug}/social/linkedin.md
- posts/post-{NN}-{slug}/social/newsletter.md

Requirements:
1. Every tweet/paragraph must reference a SPECIFIC insight, metric, or code example from THIS post
2. Opening lines must be provocative and specific (never "I'm excited to share...")
3. Include the companion repo link: https://github.com/krzemienski/{repo-name}
4. Include the blog post link (use placeholder: https://agenticdevelopment.com/posts/{slug})
5. Twitter: 7-12 tweets, each self-contained
6. LinkedIn: 200-350 words, 3 numbered insights
7. Newsletter: 400-600 words, curiosity subject line, 4 bullet takeaways

Do NOT use generic phrases. Every sentence should be unique to this post.
```

## Batch Strategy

5 parallel agents, each handling ~12 posts. Same batches as Phases 1-2 for context efficiency.

## Verification

```bash
# Check all social files exist and have content
for d in posts/post-*/social/; do
  tw=$(wc -w "$d/twitter.md" 2>/dev/null | awk '{print $1}')
  li=$(wc -w "$d/linkedin.md" 2>/dev/null | awk '{print $1}')
  nl=$(wc -w "$d/newsletter.md" 2>/dev/null | awk '{print $1}')
  echo "$(dirname $d | xargs basename): tw=$tw li=$li nl=$nl"
done

# Verify no generic phrases
grep -rl "I'm excited to share\|amazing things\|Here's what I learned" posts/*/social/ && echo "GENERIC FOUND" || echo "ALL SPECIFIC"
```
