# Visual Audit Report: Posts 07-12

**Date:** 2026-03-06
**Auditor:** visual-audit-07-12
**URL:** https://site-rho-pied.vercel.app

## Summary

Audited 6 posts (07-12) via Playwright browser screenshots. Found 4 rendering issues across the batch, 1 critical. Overall the site renders well -- Mermaid diagrams, code blocks, tables, and navigation all generally functional.

## Issues Found

### CRITICAL

1. **Post 11 -- Markdown headings rendered inside code blocks as giant H1 text**
   - Location: post-11-ai-dev-operating-system, mid-page Python code blocks
   - Description: Lines beginning with `#` inside fenced Python code blocks (intended as Python comments) are rendered as massive H1/H2 headings instead of monospace code. Examples:
     - `# Raises SpecValidationError with lin...` renders as a full-width giant heading
     - `# Returns AgentAssignment objects wit...` renders as a full-width giant heading
     - `{"total_components": 3, "passed": 3...` renders in enormous monospace font
   - Impact: Code blocks become unreadable; completely breaks the visual presentation of code examples
   - Root cause: MDX parser is interpreting `#` comment lines inside fenced code blocks as markdown headings. The code fence is likely not being properly respected.
   - Screenshot: `e2e-evidence/visual-audit/post-11-mid3.png`

### MEDIUM

2. **Post 10 -- Literal `\n` in Mermaid diagram node text**
   - Location: post-10-stitch-design-to-code, Stitch pipeline flowchart
   - Description: Mermaid node labels show literal `\n` text instead of line breaks. Examples:
     - "Adjust Prompt\nFix specific deviations:\nradius, color, font"
     - "Convert React\nshadcn/ui + Tailwind +\ndesign token preset"
     - "Validate\nPuppeteer 107-action suite\nStructure + interaction + screenshot"
   - Impact: Diagram labels are harder to read but still understandable
   - Root cause: Mermaid `\n` line break syntax not being interpreted, possibly escaped by the MDX preprocessor before reaching Mermaid
   - Screenshot: `e2e-evidence/visual-audit/post-10-mid1.png`

3. **Post 07 -- Orphaned list items in "Building Your Own Stack" section**
   - Location: post-07-prompt-engineering-stack, near bottom
   - Description: Two bullet points ("Objective detection..." and "Low false-positive rates...") render as standalone bold paragraphs without bullet markers, outside of any `<ul>` container. The `<li>` elements exist in the DOM but appear disconnected from a parent list.
   - Impact: Minor -- content is readable but lacks visual list formatting
   - Screenshot: `e2e-evidence/visual-audit/post-07-screenshot.png` (near bottom)

### LOW

4. **Post 08 -- Text overlap in metrics section**
   - Location: post-08-ralph-orchestrator, "Hat-scoped sessions" comparison area
   - Description: Header text "Hat-scoped sessions" appears to overlap or merge with inline metrics text ("40K tokens of focused context): 94% task completion, 2% contradiction rate"). Likely a bold/emphasis formatting issue bleeding across a line boundary.
   - Impact: Minor readability issue in one paragraph
   - Screenshot: `e2e-evidence/visual-audit/post-08-mid1.png`

## Posts Without Major Issues

- **Post 07** (prompt-engineering-stack): Mermaid diagrams (7-layer stack, CLAUDE.md inheritance chain) render correctly. Code blocks clean. Minor orphaned list items.
- **Post 09** (code-tales): Table renders correctly with 5 columns. Mermaid pipeline diagram renders correctly. Code blocks clean.
- **Post 12** (autonomous-ui-validation / cross-session-memory): Mermaid diagram (observation store architecture) renders correctly with cylinders and flow arrows. Code blocks clean. No issues found.

## Common Patterns

- **Mermaid diagrams generally render well** -- purple-bordered nodes, proper flow arrows, decision diamonds all working
- **Tables render correctly** -- Post 09's 5-column table is properly aligned
- **Code blocks mostly work** except for the critical `#` heading interpretation bug in Post 11
- **Inline code** (`pink monospace`) renders consistently across all posts
- **Navigation** (Previous/Next links) works correctly on all posts

## Screenshots Saved

All screenshots saved to: `/Users/nick/Desktop/blog-series/e2e-evidence/visual-audit/`
- post-07-screenshot.png, post-07-verified.png, post-07-viewport-top.png, post-07-mermaid1.png, post-07-code-blocks.png, post-07-mermaid2.png, post-07-bottom.png
- post-08-screenshot.png, post-08-top.png, post-08-mid1.png, post-08-mid2.png, post-08-mid3.png, post-08-bottom.png
- post-09-screenshot.png, post-09-top.png, post-09-mid1.png, post-09-mid2.png, post-09-mid3.png, post-09-bottom.png
- post-10-screenshot.png, post-10-top.png, post-10-mid1.png, post-10-mid2.png, post-10-mid3.png, post-10-bottom.png
- post-11-screenshot.png, post-11-top.png, post-11-mid1.png, post-11-mid2.png, post-11-mid3.png, post-11-bottom.png
- post-12-screenshot.png, post-12-top.png, post-12-mid1.png, post-12-mid2.png, post-12-mid3.png, post-12-bottom.png
