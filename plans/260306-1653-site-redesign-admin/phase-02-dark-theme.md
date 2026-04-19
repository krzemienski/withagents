# Phase 2: Flat Black + Pink/Purple Theme Redesign

**Priority:** High
**Status:** Pending
**Effort:** Medium (4 files)

## Design Direction

Replace "Midnight Observatory" navy palette with flat black base + pink/purple accents.

### New Color Palette

| Token | Old Hex | New Hex | Role |
|-------|---------|---------|------|
| base-black | #0f172a | **#000000** | Primary background |
| surface | #1e293b | **#0a0a0a** | Cards, elevated surfaces |
| surface-hover | — | **#111111** | Hover states |
| border | #334155 | **#1a1a1a** | Borders, dividers |
| border-accent | — | **#2a2a2a** | Subtle borders |
| pink-hot | — | **#ec4899** | Primary accent (CTAs, links) |
| pink-soft | — | **#f472b6** | Hover states, highlights |
| purple-vivid | #6366f1 | **#a855f7** | Secondary accent |
| purple-soft | #8b5cf6 | **#c084fc** | Decorative, gradients |
| cyan-data | #22d3ee | **#22d3ee** | Data/metrics only (keep) |
| text-primary | #f1f5f9 | **#ffffff** | Headings |
| text-body | #cbd5e1 | **#a1a1aa** | Body text (zinc-400) |
| text-muted | #94a3b8 | **#71717a** | Captions (zinc-500) |
| text-dim | #64748b | **#52525b** | Timestamps (zinc-600) |

### Gradient Accent
Primary gradient: `from-pink-hot to-purple-vivid` (#ec4899 → #a855f7)
Used for: hero title, link hovers, button backgrounds, orb glows

## Implementation Steps

### 1. Update CSS variables and @theme
**File:** `site/src/app/globals.css`

- Replace all `:root` color vars with new palette
- Replace `@theme inline` color definitions
- Update `.prose` styles for new text colors
- Update `.dot-grid` to use new subtle color
- Update `.orb-indigo` → `.orb-purple` with purple glow
- Update `.orb-cyan` → `.orb-pink` with pink glow
- Update code block colors (inline code = pink, pre = black surface)
- Update blockquote border to pink
- Update link colors: pink-hot default, purple-vivid hover

### 2. Update layout
**File:** `site/src/app/layout.tsx`

- Update body bg class
- Update nav colors (hover → pink)
- Update orb class names and colors
- Update footer text colors

### 3. Update homepage
**File:** `site/src/app/page.tsx`

- Hero gradient: pink → purple
- Stats highlight: keep cyan for data, pink for labels
- Post cards: new surface color, pink accent on hover
- Remove cyan-signal from non-data elements

### 4. Update post page
**File:** `site/src/app/posts/[slug]/page.tsx`

- Series badge: purple accent
- GitHub repo button: pink accent
- Tags: new surface styling
- Navigation cards: pink hover border

## Design Principles
- **Flat black** — no navy, no blue tints. Pure black (#000) base.
- **Pink primary** — all interactive elements default to pink
- **Purple secondary** — gradients blend pink→purple, hover states
- **Cyan reserved** — only for numeric data/metrics
- **High contrast** — white text on black, pink/purple accents pop

## Success Criteria
- [ ] Background is true black (#000000), not navy
- [ ] All accents are pink/purple, no stray indigo/cyan on non-data elements
- [ ] Text hierarchy is clear (white → zinc-400 → zinc-500 → zinc-600)
- [ ] Gradient accents visible on hero, links, buttons
- [ ] Code blocks and diagrams match new theme
- [ ] Mobile responsive maintained
