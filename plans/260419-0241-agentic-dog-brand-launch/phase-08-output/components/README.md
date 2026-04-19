# WithAgents Component Library

**Phase 08 · V2 deliverable**
Hyper-black + Ultraviolet accent · Space Grotesk / Inter / IBM Plex Mono

---

## Component catalog

| File | Description |
|------|-------------|
| `card.html` | Content card for Writing, Products, and Open Source indexes. Variants: Default, Hover, Focus-visible, Featured. Left-border writing variant, product status pill, repo stat row. |
| `card-states.html` | Card state grid: Default, Hover, Focus-visible, Active, Featured, Loading (shimmer skeleton), Empty, Disabled. |
| `button-hierarchy.html` | Full button system: Primary, Secondary, Tertiary, Ghost, Danger. All states (default/hover/focus/active/disabled). Sizes sm/md/lg. Icon buttons with ARIA labels. |
| `button-hierarchy-states.html` | State matrix table: all 5 variants × all 5 states in one grid. |
| `nav.html` | Top navigation with wordmark slot, 5 section links, "Start a conversation" CTA. Mobile breakpoint with hamburger + drawer. Sticky + backdrop-blur on scroll. |
| `nav-states.html` | Nav state panels: Default, Active page link, Hover on link, Focus-visible on link, CTA hover, Mobile open. |
| `chips-pills-tags.html` | Pill chips (topic tags), status pills (New/Beta/Stable/Deprecated), filter pills, multi-select chips, dismissible chips, inline tags. All states. |
| `chips-pills-tags-states.html` | State tables: pill chip × 4 states, filter pill × 5 states, all status pill variants. |
| `cta-block.html` | "Start a conversation" block. 4 variants: inline form, button-only, accent-wash background, minimal inline. Quiet commercial copy per BRIEF §3. |
| `cta-block-states.html` | CTA state panels: Default, Input focused, Button hover, Button focus-visible, Error, Loading (spinner), Success, Disabled. |
| `code-block.html` | Inline code, fenced blocks (TypeScript/Python/Shell/JSON). Copy button, filename slot, caption slot, line highlighting. Syntax tokens are class-based (`tok-keyword`, `tok-string`, etc.) — Prism/Shiki compatible. No JS highlighter bundled. |
| `code-block-states.html` | Code block state panels: Default, Copy hover, Copy focus-visible, Copy confirmed (transient), Highlighted line, With caption, Error output. |
| `blockquote.html` | Quote with attribution + accent bar. Pull quote (editorial). Callout variants: Info, Warning, Success, Error. |
| `blockquote-states.html` | Blockquote state panels: Default, Hover, Focus-visible, Featured, Muted. All 4 callout types. |
| `metric-block.html` | Large-number metric display. Variants: Single, Triple row, 4-up grid, Cards with delta indicator, Hero display number. |
| `metric-block-states.html` | Metric card state grid: Default, Hover, Focus-visible, Featured, Loading (shimmer), Empty. |
| `footer.html` | Full site footer: wordmark, tagline, 4 link columns (Products / Writing / Open Source / About), bottom bar with © and RSS + GitHub icon links. Responsive at 900px and 560px. |
| `footer-states.html` | Footer element state tables: wordmark, footer links, icon links (Default/Hover/Focus-visible). Full bottom bar demo. |

---

## Token usage map

All tokens are inlined at the top of every file under `:root {}`. Ultraviolet is the default. To swap accent theme, replace the 6 accent variables:

```css
/* Swap to Magenta theme */
:root {
  --accent:      #A855F7;
  --accent-alt:  #F472B6;
  --accent-hot:  #FB7185;
  --accent-lime: #A3E635;
  --border:      rgba(244,114,182,0.14);
  --accent-wash: rgba(168,85,247,0.16);
}
```

Surface tokens (`--bg-void`, `--panel-1`, `--panel-2`, `--panel-3`) are locked — do not swap.

### Token → component map

| Token | Primary uses |
|-------|-------------|
| `--bg-void` | `body` background |
| `--panel-1` | Card background, nav background, footer background, metric card |
| `--panel-2` | Card hover background, secondary button, code block body, chip default |
| `--panel-3` | Code block header, card active |
| `--text-primary` | All headings, active nav links, card titles |
| `--text-muted` | Body text, metadata, captions, inactive nav links |
| `--accent` | Primary button fill, focus rings, accent bar on blockquote, nav dot, left border on writing card |
| `--accent-alt` | CTA button label, featured eyebrow, chip selected color, footer CTA link |
| `--accent-hot` | Footer accent CTA hover |
| `--accent-lime` | Stable status pill, delta up indicator, success callout icon |
| `--border` | All card/panel borders |
| `--accent-wash` | Chip selected bg, tertiary button bg, callout info bg, CTA block bg |
| `--font-display` | All headings, nav wordmark, button labels (via font-body), metric numbers |
| `--font-body` | Body copy, buttons, nav links, filter pills |
| `--font-mono` | Code, tags, chips, status pills, captions, metadata |

---

## Astro integration guide (Phase 09)

### Strategy: each component → `.astro` file

Each HTML file maps to one Astro component. The migration pattern:

```
card.html           → src/components/Card.astro
button-hierarchy    → src/components/Button.astro
nav.html            → src/components/Nav.astro
chips-pills-tags    → src/components/Chip.astro + StatusPill.astro + FilterPill.astro
cta-block.html      → src/components/CTABlock.astro
code-block.html     → src/components/CodeBlock.astro
blockquote.html     → src/components/Blockquote.astro + Callout.astro
metric-block.html   → src/components/MetricBlock.astro
footer.html         → src/components/Footer.astro
```

### Inline tokens vs Tailwind v4

**Recommendation: CSS custom properties (inline tokens) as the source of truth. Tailwind v4 utilities for layout and spacing.**

Rationale:
- The accent theme system requires runtime CSS variable swapping via `data-theme` attribute on `<html>`. Tailwind v4 supports `@theme` blocks but dynamic token rotation is cleaner with native CSS vars.
- Spacing (`--space-xs` through `--space-xl`) maps cleanly to Tailwind's spacing scale — use Tailwind utilities (`p-5`, `gap-3`, etc.) for layout, keep brand tokens as CSS vars for color and typography.
- Syntax highlighting tokens (`tok-*`) should remain as CSS custom properties for Shiki theme compatibility.

### Tailwind v4 theme mapping

```js
// tailwind.config.ts (v4 @theme block approach)
// In your global CSS:
@theme {
  --color-void: #040404;
  --color-panel-1: #0A0A0D;
  --color-panel-2: #111116;
  --color-panel-3: #15151C;
  --color-text-primary: #F5F5F7;
  --color-text-muted: #A1A1AA;
  --color-accent: #8B5CF6;      /* overridden per theme */
  --color-accent-alt: #C084FC;  /* overridden per theme */
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}
```

### Astro component anatomy (example: Card)

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  body: string;
  eyebrow?: string;
  href: string;
  variant?: 'default' | 'writing' | 'product' | 'oss';
  featured?: boolean;
  meta?: string;
  tags?: string[];
  status?: 'beta' | 'stable' | 'deprecated';
}
const { title, body, eyebrow, href, variant = 'default', featured, meta, tags, status } = Astro.props;
---
<article class:list={['card', variant && `card--${variant}`, featured && 'card--featured']}>
  <!-- ... inner markup from card.html ... -->
</article>
```

### Theme rotation (Phase 12)

```astro
<!-- layout/Base.astro -->
<html data-theme={Astro.locals.theme ?? 'ultraviolet'} lang="en">
```

```css
/* tokens/themes.css */
[data-theme="magenta"] {
  --accent: #A855F7;
  --accent-alt: #F472B6;
  /* ... */
}
```

---

## Known gaps / TODOs for Phase 09

1. **Animation tokens**: `prefers-reduced-motion` wrappers are in place but transition values (150ms/200ms) are inline — should be extracted to `--transition-fast` and `--transition-base` tokens.
2. **Code block JS copy**: `code-block.html` has a minimal `onclick` handler. Phase 09 should replace this with a proper Astro island (or a `<script>` block using the Clipboard API with error handling).
3. **Nav active state**: Active link detection via `aria-current="page"` is correct semantically. In Astro, compute using `Astro.url.pathname` comparison.
4. **Filter pill state**: Multi-select filter pills currently use inline `aria-pressed` attributes. Phase 09 should wire these to a URL param (`?tag=field-notes`) for SSG-friendly filtering.
5. **Metric number animation**: Large numbers (23,479) could benefit from a count-up animation on scroll. Wrap in `prefers-reduced-motion` guard. Out of scope for Phase 08.
6. **Dark-only**: All components are dark-only by design. If a light mode is ever needed, a `[data-theme="light"]` override block would override surface tokens — surfaces are the only layer that would need to change.
7. **Satori OG**: Code block and metric block styles should be duplicated into the Satori-compatible JSX template (Phase 08 V3 output) — Satori does not support `backdrop-filter`, `linear-gradient` on `border`, or `clip-path`.
8. **Font loading**: Google Fonts `<link>` tags are included in every HTML file for standalone preview. In Phase 09 Astro, move to a single `<head>` in `Base.astro` and add `font-display: swap`.
