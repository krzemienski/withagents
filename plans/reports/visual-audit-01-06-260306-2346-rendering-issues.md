# Visual Audit Report: Posts 01-06

**Date:** 2026-03-07
**Scope:** Posts 01 through 06 on site-rho-pied.vercel.app
**Screenshots:** `/Users/nick/Desktop/blog-series/e2e-evidence/visual-audit/`

---

## Summary

All 6 posts render and are readable. The Midnight Observatory theme displays correctly (dark backgrounds, proper typography, accent colors). Navigation works. Mermaid/SVG diagrams render as embedded visuals. However, there are **recurring markdown rendering issues** across multiple posts, primarily involving emphasis/italic leaking and raw HTML tables inside code blocks.

---

## Issues by Post

### Post 01: Series Launch
**URL:** /posts/post-01-series-launch
**Screenshot:** post-01-full.png

1. **ITALIC LEAK IN TABLE CELLS** (Medium)
   - Table row for "Coordinating" category: the cell `Task, SendMessage, Agent` renders with italic emphasis on `, SendMessage, Agent` — the underscores in `SendMessage` are being parsed as markdown emphasis delimiters.
   - Table row for "Validating" category: the cell `idb_, simulator_, browser_` renders with italic on `, browser_` — trailing underscores triggering emphasis.
   - Location: The "Category / Tools / Total Invocations / % of All" table.
   - **Root cause:** Underscores in tool names like `SendMessage` and `browser_` are interpreted as markdown emphasis markers by the MDX parser.

2. **ORPHAN TEXT OUTSIDE PARAGRAPH** (Low)
   - After the table, a block of text starting with "The coordination column is where it gets interesting..." appears to lack proper paragraph wrapping (visible in the accessibility tree as bare `text` nodes rather than `paragraph` elements).

### Post 02: Multi-Agent Consensus
**URL:** /posts/post-02-multi-agent-consensus
**Screenshot:** post-02-full.png

1. **RAW HTML TABLE IN CODE BLOCK** (High)
   - The "GATE 1: THREE-AGENT CONSENSUS ACHIEVED" block contains a raw `<table><thead>...` HTML string rendered as literal code text rather than as a formatted table.
   - Location: Section describing the 75-TaskCreate iOS audit gate output.
   - **Root cause:** The code fence contains HTML markup that should have been rendered as a table, but it's inside a fenced code block so it displays as raw HTML text.

2. **ITALIC LEAK IN CODE BLOCK** (Medium)
   - The file ownership Python dict code block has italic rendering on glob patterns: `"src/auth/*"` and similar patterns where `*` characters inside string literals trigger emphasis parsing.
   - The rendered code shows: `ownership = { "auth-agent": ["src/auth/` *then italic text* `", "src/middleware/auth` *italic* `"], ...`
   - Location: "File Ownership: Preventing the Frankenstein Merge" section.
   - **Root cause:** Asterisks in glob patterns like `src/auth/*` are parsed as markdown emphasis even within code fences.

3. **CODE BLOCK FORMATTING ISSUE** (Low)
   - Several Python code blocks render with paragraph-like breaks inside them (visible as separate `<p>` elements in the accessibility tree within `<code>` blocks). This suggests the markdown parser is splitting code blocks at blank lines.

### Post 03: Functional Validation
**URL:** /posts/post-03-functional-validation
**Screenshot:** post-03-full.png

1. **RAW HTML TABLES IN MARKDOWN CODE BLOCKS** (High)
   - The "Routing Table" section contains a `<table><thead>...` raw HTML string inside what should be a rendered markdown table. The table headers (Condition, Agent, Model, Reason) and rows are visible as raw HTML markup.
   - Location: Inside the skill definition code block showing the routing table.
   - **Root cause:** The routing table was written as HTML inside a markdown code fence, so it renders as literal HTML text.

2. **CONTENT SPILLS OUTSIDE CONTAINER** (Medium)
   - After the `wait_for_server` code block, the text "confirms the correct application is running..." appears to be orphaned outside its parent paragraph/container, rendering differently from the surrounding prose.
   - The accessibility tree shows a `generic [ref=e506]` container wrapping content that should probably be in the same flow as the paragraph above it.

3. **NUMBERED LIST FORMATTING IN CODE BLOCK** (Low)
   - The "140-step validation flow" code block mixes numbered list items (`1. browser_navigate -> /sign-in`) with regular `listitem` elements. Some items render as list items and some as plain text within the code block.

### Post 04: iOS Streaming Bridge
**URL:** /posts/post-04-ios-streaming-bridge
**Screenshot:** post-04-full.png

1. **BULLET POINTS RENDER AS LOOSE PARAGRAPHS** (Medium)
   - The "Lessons for Your Own SSE Bridge" section at the bottom has bullet points that render as separate paragraphs with extra spacing between them rather than as a compact list. Each `listitem` has extra paragraph breaks around it.
   - Location: Final section of the post.

2. **CODE BLOCKS SPLIT BY PARAGRAPH ELEMENTS** (Low)
   - Several longer code blocks (Swift code examples) contain internal `<p>` tags that create visual paragraph breaks within what should be contiguous code. This makes the code harder to read.
   - Visible in: `LastActivityTracker` code block, `ClaudeExecutorService` belt-and-suspenders code block, and the `Process.waitUntilExit()` examples.

### Post 05: iOS Patterns Compendium
**URL:** /posts/post-05-sdk-bridge
**Screenshot:** post-05-full.png

1. **ITALIC LEAK IN INLINE CODE** (Medium)
   - In the memory crisis section, the arithmetic expression `200 * 1170 * 2532 * 4 = 2.37GB` renders with the middle portion `*1170*` in italic because the asterisks are parsed as emphasis markers.
   - Location: "Retained image caches" bullet point under "The Memory Crisis and Performance Profiling."
   - **Root cause:** Multiplication asterisks in `200*1170*2532*4` parsed as markdown emphasis.

2. **BULLET POINTS AS LOOSE ITEMS** (Medium)
   - The "Three problems identified" section and "Three mistakes agents make with Keychain" section render bullet items with excessive spacing (loose list formatting), similar to post 04.

3. **NEVER RULES LIST NOT IN CODE BLOCK** (Low)
   - The "10 NEVER rules" list (starting with "NEVER use Task.detached") renders as plain paragraphs/list items rather than as a formatted callout or code block. This is a content/styling choice rather than a bug, but the list items lack visual distinction from surrounding prose.

### Post 06: Parallel Worktrees
**URL:** /posts/post-06-parallel-worktrees
**Screenshot:** post-06-full.png

1. **ITALIC/BOLD LEAK FROM GLOB PATTERNS** (High)
   - In "The Ripple Rebase Problem" section, the text about file scope declarations contains: `Branch A owns src/auth/*` where everything after the glob asterisk becomes bold/italic, bleeding into the next sentence. The rendered text shows `src/auth/` followed by bold text `. Branch B owns src/cache/` — the glob asterisks are triggering emphasis that spans across sentences.
   - Location: Paragraph starting "This works because file scope was declared up front."
   - **Root cause:** Unescaped asterisks in `src/auth/*` and `src/cache/*` parsed as markdown bold/emphasis delimiters.

2. **BULLET POINTS AS LOOSE ITEMS** (Low)
   - Several bulleted lists (merge algorithm steps, worktree factory steps, QA verdicts) render with extra paragraph spacing.

3. **CODE BLOCK PARAGRAPH SPLITS** (Low)
   - The `execute_in_worktree` and merge queue code blocks contain internal paragraph elements.

---

## Recurring Issues (Cross-Post)

### 1. Asterisk/Underscore Emphasis Leak (HIGH PRIORITY)
**Affected:** Posts 01, 02, 05, 06
**Pattern:** Glob patterns (`src/auth/*`), tool names with underscores (`browser_`, `SendMessage`), and arithmetic expressions (`200*1170*2532`) trigger markdown emphasis/italic parsing when they appear in prose paragraphs or table cells.
**Fix:** Escape asterisks and underscores in markdown source: `src/auth/\*`, `browser\_`, or wrap in inline code backticks.

### 2. Raw HTML Tables in Code Blocks (HIGH PRIORITY)
**Affected:** Posts 02, 03
**Pattern:** HTML `<table>` markup appears as literal text inside fenced code blocks instead of rendering as formatted tables.
**Fix:** Move HTML tables out of code fences, or convert to markdown table syntax.

### 3. Code Block Paragraph Splitting (MEDIUM PRIORITY)
**Affected:** Posts 02, 03, 04, 05, 06
**Pattern:** Long code blocks contain blank lines that the MDX parser interprets as paragraph breaks, splitting a single code block into multiple `<code>` + `<p>` elements.
**Fix:** Ensure code fences are not broken by blank lines, or adjust the MDX parser configuration.

### 4. Loose List Formatting (LOW PRIORITY)
**Affected:** Posts 04, 05, 06
**Pattern:** Bulleted/numbered lists render with extra spacing between items (loose lists) rather than compact formatting.
**Fix:** Remove blank lines between list items in markdown source.

---

## What Renders Correctly

- Midnight Observatory theme (colors, typography, spacing)
- Navigation header and footer
- Post metadata (part number, read time, date, tags)
- Companion repo links
- Mermaid/SVG diagrams (tool leaderboard chart, failure modes diagram, series roadmap, consensus gate flow, three-layer validation stack, SSE state machine, architecture diagrams, pipeline stages, merge waves)
- Standard markdown tables (when not affected by emphasis leaks)
- Inline code formatting (backtick-wrapped code)
- Next/Previous post navigation
- Code syntax in fenced blocks (when not split by paragraphs)

---

## Recommended Fix Priority

1. **Escape asterisks/underscores** in posts 01, 02, 05, 06 — causes visible text corruption
2. **Fix raw HTML tables** in posts 02, 03 — content appears as unreadable code
3. **Fix code block splitting** across all posts — affects code readability
4. **Tighten list spacing** in posts 04, 05, 06 — cosmetic improvement
