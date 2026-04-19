# Phase 4: New Blog Posts & Example Repos

**Priority:** High
**Effort:** XL (Extra Large)
**Status:** Pending
**Blocked By:** Phase 3

## Overview

Generate 10 new blog posts with companion example repositories from the insights extracted in Phase 3. Each post follows the established series format and includes full visual assets.

## Context

- Existing series: "Agentic Development: 10 Lessons from 4,500 AI Coding Sessions"
- Post format: 1,500-2,500 words, Mermaid diagrams, code snippets from real sessions
- Each post has a companion repo with working, installable code
- Visual assets: HTML hero images (1200x630), SVG charts, social cards
- Use Stitch MCP for hero images and design exploration

## Requirements

### Per Blog Post
- 1,500-2,500 words
- Hook (2-3 sentences with specific detail/metric)
- TL;DR (bolded, key metric)
- Context (1-2 paragraphs on what was built)
- Technical deep-dive with REAL code and REAL terminal output from sessions
- Mermaid architecture diagrams (dark theme)
- Results section (measurable improvements, before/after)
- Takeaway (what reader can do NOW)
- First person, conversational but technically precise

### Per Companion Repo
- Working, installable code (pip/npm/cargo install)
- README with quick start
- MIT LICENSE
- `blog/BLOG_POST.md` linking back to series
- CLI entry point or setup script
- Real implementation, not scaffolding

### Visual Assets Per Post
- Hero image: 1200x630 HTML+CSS (self-contained, Midnight Observatory theme)
- Architecture diagram(s): Mermaid (rendered with dark background)
- Performance/comparison chart: SVG
- Social cards: Twitter (1200x628), LinkedIn (1200x627)
- All generated using Stitch MCP where appropriate

## Implementation Steps

1. **Finalize topic list** from Phase 3 insight brief
   - Review top 10 insights with user
   - Confirm topic diversity (avoid clustering)
   - Assign post numbers (12-21) and working titles

2. **For each post (repeat 10x):**

   a. **Extract source material**
   - Pull full conversation from source session JSONL
   - Extract all code snippets, terminal output, errors, resolutions
   - Identify visual opportunities (architecture changes, metrics, workflows)

   b. **Build companion repo**
   - Create repo structure based on the insight's technical pattern
   - Implement working code extracted/refined from session
   - Add README, LICENSE, pyproject.toml/package.json
   - Add CLI entry point
   - Verify it builds and runs

   c. **Write blog post**
   - Follow devlog-publisher format (hook → TL;DR → context → deep-dive → results → takeaway)
   - Embed real code from companion repo
   - Include Mermaid diagrams for architecture
   - Reference session data (dates, metrics, error messages)
   - Store as `posts/{nn}-{slug}/post.md`

   d. **Generate visual assets**
   - Use Stitch MCP `generate_screen_from_text` for hero image design
   - Generate hero as self-contained HTML+CSS (1200x630)
   - Create Mermaid diagrams with dark theme
   - Create SVG chart for key metrics
   - Generate social cards (Twitter + LinkedIn variants)
   - Store in `posts/{nn}-{slug}/visuals/`

   e. **Cross-reference and validate**
   - Verify all code in post matches companion repo
   - Verify all claims traceable to source session
   - Verify Mermaid diagrams render correctly
   - Verify hero image follows DESIGN.md theme

3. **Update series index**
   - Add posts 12-21 to `posts/INDEX.md`
   - Update total word count, diagram count
   - Add new reading paths if appropriate

4. **Quality review**
   - Cross-check each post against companion repo code
   - Verify zero fabrication (all code/output from real sessions)
   - Check for angle overlap between posts
   - Verify consistent voice and formatting across all 10

## Success Criteria

- [ ] 10 new blog posts written (posts 12-21)
- [ ] 10 companion repos created with working code
- [ ] Each post has hero image, Mermaid diagrams, SVG chart
- [ ] Each post has social cards (Twitter + LinkedIn)
- [ ] All code traceable to real sessions (zero fabrication)
- [ ] All companion repos build and run successfully
- [ ] INDEX.md updated with full 21-post catalog
- [ ] No topic overlap with posts 1-11

## Risk Assessment

- **Session quality:** Not all 180 days of sessions will have publishable insights. Mitigation: Phase 3 pre-filters to score >40.
- **Repo viability:** Some insights may not lend themselves to standalone repos. Mitigation: identify repo concept during Phase 3 scoring, flag low-viability candidates early.
- **Scale:** 10 posts + 10 repos is significant. Mitigation: parallelize — 2-3 posts can be worked simultaneously by different agents.
- **Stitch rate limits:** Heavy MCP usage for 10 hero images + social cards. Mitigation: batch Stitch calls, cache results in `stitch.json`.
