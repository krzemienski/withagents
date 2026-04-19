# Phase 1: Mermaid Diagram Rendering Fix

**Priority:** Critical
**Status:** Pending
**Effort:** Small (3 files)

## Problem

Mermaid package (`mermaid@^11.12.3`) is installed but never initialized. All `\`\`\`mermaid` fenced blocks render as raw text inside `<pre><code class="language-mermaid">`.

## Solution

Create a client component that:
1. Runs after hydration (useEffect)
2. Finds all `<code class="language-mermaid">` elements
3. Extracts the text content (mermaid syntax)
4. Replaces the `<pre>` parent with a rendered SVG via mermaid.run()

## Implementation Steps

### 1. Create MermaidRenderer client component
**File:** `site/src/components/mermaid-renderer.tsx`

```tsx
"use client";
// useEffect to find all pre > code.language-mermaid
// Extract textContent, create div.mermaid with content
// Replace the <pre> element with the new div
// Call mermaid.run() on the new elements
// Config: dark theme, colors matching new palette
```

### 2. Update post page to include MermaidRenderer
**File:** `site/src/app/posts/[slug]/page.tsx`

- Import and render `<MermaidRenderer />` after the prose div
- Component auto-discovers and renders all mermaid blocks on the page

### 3. Update CSS for rendered mermaid
**File:** `site/src/app/globals.css`

- Update `.mermaid-container` styles (already defined but unused)
- Add styles for `.mermaid` SVG containers
- Ensure diagrams are responsive (max-width: 100%, overflow-x: auto)

## Success Criteria
- [ ] Mermaid fenced blocks render as SVG diagrams, not raw text
- [ ] Diagrams use dark theme matching site palette
- [ ] No flash of unstyled mermaid text on page load
- [ ] Diagrams are responsive on mobile

## Related Files
- `site/src/app/posts/[slug]/page.tsx` (lines 155-165 — markdownToHtml code block handling)
- `site/src/app/globals.css` (lines 171-179 — existing .mermaid-container)
- `site/package.json` (line 16 — mermaid dependency)
