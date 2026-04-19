# Visual Audit: Posts 13-18

**Date:** 2026-03-06
**Auditor:** visual-audit-13-18 agent
**Screenshots:** `/Users/nick/Desktop/blog-series/e2e-evidence/visual-audit/post-{13..18}-screenshot.png`

## Summary

Posts 13-16 render well overall. Post 17 has broken Mermaid diagrams. Post 18 has severe markdown rendering issues where raw markdown/code leaks into prose, broken code block boundaries, and formatting collapse in the second half.

---

## Post 13: 84 Thinking Steps to Find a One-Line Bug
**URL:** /posts/post-13-pdca-algorithm-tuning
**Status:** MINOR ISSUES

### Issues
1. **Code block renders markdown headings inside code fences** — The Python code snippet for `DebuggingChain` API contains `# Map the layers` and `# Anchor constraint` that render as H1 headings instead of code comments. The `#` at the start of lines inside fenced code blocks are being parsed as markdown headings.
2. **Mermaid diagrams render correctly** — The 4-phase debugging chain and the hypothesis-test-revise cycle diagrams both render as expected with dark theme.
3. **Table renders correctly** — The "Cache Type / Location / Cleared By / Frequency" table displays properly.
4. **Code blocks with inline code** — Some code blocks show `code [ref=eXX]` nesting in the accessibility tree, suggesting inline code markers inside fenced code blocks may cause subtle rendering issues.

---

## Post 14: 35 Worktrees, 12 Agents, Zero Merge Conflicts
**URL:** /posts/post-14-spec-driven-development
**Status:** MODERATE ISSUES

### Issues
1. **Italic/emphasis leaking into code block** — In the `OwnershipMatrix` code example, glob patterns like `"Sources/**/...` show `emphasis [ref=e52]` markers, meaning `**/` inside code is being parsed as italic/emphasis markdown. The `*/` pattern in glob strings renders as emphasis rather than literal asterisks. This affects 3 instances in the ownership matrix code block.
2. **Mermaid diagrams render correctly** — Both the file ownership flow diagram and the topological merge order diagram display properly.
3. **Code blocks generally clean** — Most Python code blocks render correctly.
4. **CLI code block renders headings inside code** — The `merge-orchestrator` CLI examples have `# Validate all files have owners` rendering as H1 headings instead of comments.

---

## Post 15: The Anatomy of a Skill
**URL:** /posts/post-15-cross-session-memory
**Status:** MODERATE ISSUES

### Issues
1. **Routing table renders as raw HTML** — The routing table section contains raw `<table><thead><tr><th>...` HTML tags visible in the rendered output instead of a formatted table. The HTML table markup for "Condition | Agent | Model | Reason" is showing through as raw text rather than rendering as a table.
2. **Code blocks with heading leakage** — CLI examples like `skills-factory validate` have `# Skill Validation: VALID` lines rendering as H1 headings instead of code comments/output.
3. **Mermaid diagrams render correctly** — The 3-layer skill architecture diagram and the skill resolution sequence diagram both display properly.
4. **Intake pattern code block** — The `<intake>` block renders correctly as a code block.
5. **Empty `code [ref=e198]`** — The "Essential Principles" section references an empty code element, suggesting a backtick-wrapped term that rendered empty.

---

## Post 16: Building Claude Code Plugins That Actually Work
**URL:** /posts/post-16-multi-agent-merge-orchestration
**Status:** MINOR ISSUES

### Issues
1. **Mermaid diagrams render correctly** — Both the hook lifecycle flow and the 4-layer enforcement pyramid diagrams display properly.
2. **Code blocks render cleanly** — The JavaScript hook code examples (block-test-files.js, read-before-edit.js, validation-not-compilation.js, evidence-gate-reminder.js, skill-activation-check.js) all render correctly with syntax highlighting.
3. **Skill SKILL.md code block** — The functional-validation skill example renders correctly.
4. **Bullet lists outside list context** — Some bullet lists (the 4-layer explanation: CLAUDE.md, Hooks, Skills, Commands) appear as `listitem` elements without a parent `list`, suggesting they may render without proper list styling/indentation.
5. **Template literal backtick rendering** — Template literals with `${filePath}` inside code blocks render correctly.

---

## Post 17: The CCB Evolution: From Bash Script to Autonomous Builder
**URL:** /posts/post-17-sequential-thinking-debugging
**Status:** CRITICAL ISSUES

### Issues
1. **TWO BROKEN MERMAID DIAGRAMS** — Both Mermaid diagrams in this post show red error icons with "Syntax error in text" messages. The console log confirms: `Diagrams beginning with --- are not valid`. This means the Mermaid code blocks contain YAML front-matter (`---`) that Mermaid v11 cannot parse, or the diagram syntax is otherwise invalid. These are visible as prominent red error blocks in the rendered page.
2. **Code blocks with heading leakage** — The `hat-rotation.sh` code example has `# Phase 2: Builder Hat`, `# Phase 3: Reviewer Hat`, `# Phase 4: Fixer Hat (conditional)` rendering as H1 headings instead of bash comments. This is a significant visual issue — the code block is broken into multiple sections by large headings.
3. **Bash code blocks** — The `run_claude_auto()`, `save_state()`, worktree parallel, and SDK pipeline code blocks render mostly correctly aside from the heading leakage issue.
4. **Bullet lists outside list context** — Multiple bulleted lists (4-agent exploration, mobile spec list) render as `listitem` without parent `list`.

---

## Post 18: SDK vs CLI: The Decision Framework
**URL:** /posts/post-18-full-stack-orchestration
**Status:** CRITICAL ISSUES

### Issues
1. **Severe markdown rendering collapse in second half** — Starting around the "CLI: When You Need an Operating Room" section, the markdown rendering breaks down significantly:
   - Inline code backticks leak into prose: text like `` `The` `` appears as code-formatted "The" at the start of paragraphs (visible at refs e269, e319, e331, e472, e532, e538, e540-544, e551, e586)
   - Multiple paragraphs have `code [ref=eXX]` wrapping regular English words, meaning backticks are misplaced in the source markdown
2. **Code blocks swallow surrounding prose** — Several code blocks extend beyond their intended boundaries, consuming the following paragraphs of prose text. For example, after the cost comparison table, the "When the CLI wins" bold text and subsequent paragraphs appear to be inside a code block.
3. **Heading inside code block** — `## Anti-Patterns I Learned the Hard Way` (ref e536) and `## What 23,479 Sessions Taught Me` (ref e555) appear to render inside code blocks rather than as proper section headings.
4. **Broken backtick nesting** — The cost comparison paragraph has `code [ref=e262]` wrapping an entire paragraph of prose text about batch work costs, suggesting a backtick was not properly closed.
5. **Template literal rendering issues** — The SDK batch processor code example has broken template literal backticks: `` `${instruction}\n\nFile...` `` renders with fragmented code elements.
6. **Table renders correctly** — Both the tool invocation counts table and the cost comparison table render properly.
7. **Mermaid diagram renders correctly** — The decision tree flowchart and the hybrid architecture diagram both display properly.
8. **Final paragraph backtick issues** — The closing paragraph has `code [ref=e590-e593]` wrapping individual words like "and", "for", suggesting systematic backtick misalignment in the source markdown.

---

## Priority Fix List

### CRITICAL (breaks reading experience)
1. **Post 17: Fix 2 broken Mermaid diagrams** — Remove YAML front-matter or fix syntax errors in the Mermaid code blocks
2. **Post 18: Fix markdown rendering collapse** — Audit source markdown for misplaced backticks, unclosed code fences, and code block boundaries in the second half of the post (starting from "CLI: When You Need an Operating Room")

### HIGH (noticeable visual defects)
3. **Posts 13, 14, 15, 17: Fix `#` comments rendering as headings inside code blocks** — Lines starting with `#` inside fenced code blocks are being parsed as markdown headings. This may be a site-wide MDX rendering issue where code fences aren't properly escaping content.
4. **Post 14: Fix emphasis leaking into code** — Glob patterns with `**/` inside code blocks render as italic text
5. **Post 15: Fix raw HTML table** — The routing table HTML is showing as raw text instead of rendering

### MEDIUM (minor visual issues)
6. **Posts 16, 17: Bullet lists without parent list element** — Lists render as individual items without proper list container styling
7. **Post 15: Empty code element** — Fix the empty backtick reference in the Essential Principles section
