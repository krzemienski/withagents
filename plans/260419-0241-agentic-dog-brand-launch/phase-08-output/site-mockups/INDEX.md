# WithAgents Site Mockups — INDEX

**Source:** User-generated Stitch export bundle, `/Users/nick/Desktop/blog-series/stitch_withagents_brand_system/` (pre-generated 2026-04-19 by user, integrated here 06:55)

**Design system spec:** `DESIGN.md` (The Technical Curator) — deeper than BRIEF.md on 8 specific rules (No-Line Rule, Ghost Border, Tonal Layering, Ambient Shadows, Glass Rule, button/input/card/chip specs). Treat DESIGN.md as authoritative for Phase 09 implementation; BRIEF.md §4-§7 remains the token source.

**Brand strategy:** `brand-strategy.md` — aligned with BRIEF.md §1-§3, condensed.

---

## Pages

| Slug | Path | Content focus | Verified |
|---|---|---|---|
| home | `home/{code.html,screen.png}` | Hero "Applied Agent Design." + Core Infrastructure (Runbooks/Memory Layer/Operator UI) + Systems-First Writing + Active Deployments ticker + Applied Systems quiet CTA | ✓ visually confirmed |
| products-index | `products-index/{code.html,screen.png}` | 3 product pillars expanded + feature grids | ✓ visually confirmed |
| writing-index | `writing-index/{code.html,screen.png}` | Essays / field notes index with filters | ✓ files present |
| article-detail | `article-detail/{code.html,screen.png}` | "The layer between chat & automation" full article | ✓ files present |
| opensource-index | `opensource-index/{code.html,screen.png}` | agent-contracts / trace-timeline / context-layers repo cards | ✓ files present |
| about | `about/{code.html,screen.png}` | Applied Systems positioning + quiet collaboration path | ✓ files present |
| brand-identity-exploration | `brand-identity-exploration/{code.html,screen.png}` | Interactive brand system viewer — 5 branding modes, 4 accents, typography hierarchy, tonal architecture, interface config mock | ✓ visually confirmed |

## Known gap
- **product-detail** (e.g. `/products/runbooks`) — NOT in bundle. Phase 09 derives this from the products-index card pattern + editorial rhythm. Estimated 1 Stitch credit if needed as a reference render before Phase 09 build.

## Design system (from DESIGN.md, condensed)

### Hyper-black palette (LOCKED)
- Canvas: `#040404`
- Primary panel: `#0A0A0D`
- Secondary surface: `#111116`
- Tertiary surface: `#15151C`

### Accent signals (surgical — never decorative)
- **Ultraviolet `#8B5CF6`** / Orchid `#9333EA` — primary actions + high-level logic flow
- **Lime Signal `#A3E635`** — real-time status, "Active" indicators, success
- **Plasma `#EC4899`** — error / critical alerts
- **Mono Hyper `#D4D4D8`** — secondary metadata, structural accents

### Typography (three-face system)
- Display: **Sora** (geometric-warm, tight -2% letter-spacing)
- Body: **Inter** (workhorse for long-form + UI)
- Technical: **IBM Plex Mono** (metadata, labels, code, chips)

### 5 hard rules from DESIGN.md
1. **No 1px solid borders for sectioning.** Boundaries come from background color shifts, not lines.
2. **Tonal Layering.** `surface-container-lowest` card on `surface-container-low` section creates natural lift — never box-shadow for structure.
3. **Ghost Border (accessibility fallback).** If a border is required, use `outline-variant` at 15% opacity; forbid full-opacity borders.
4. **Sharp over Soft.** Max radius `md (0.375rem / 6px)` except circular avatars.
5. **No AI tropes.** No sparkle icons, no blue/purple mesh gradients, no rounded pill buttons.

## Phase 09 usage

These mockups are **pixel-perfect reference** for Astro template implementation. Per the Claude Design README: "recreate in whatever technology makes sense for the target codebase."

- Map each `code.html` → equivalent `.astro` page under `src/pages/`
- Extract repeating components (Card, NavLink, MetricChip, SectionNumber, ActiveDeploymentRow, etc.) → `src/components/*.astro`
- Replace inline styles → Tailwind v4 tokens scoped to DESIGN.md surfaces/accents
- Keep sample content from mockups as placeholder in Phase 09; real content sourced from Keystatic collections in Phase 10

## Hybrid decision (from RECONCILIATION.md 2026-04-19 06:53)

Per user choice Option C:
- These 7 mockups → **core site surfaces** (`/`, `/products`, `/writing`, `/opensource`, `/about`)
- Separate `reference-site/project/index.html` → **`/hyper`** stylized marketing variant (Claude Design Fraunces-serif cyberpunk iteration)
- Shared chrome (primary nav, footer, OG image, favicon, wordmark) stays Ultraviolet restrained on both surfaces

## File sizes

```
about/:                          11,968 bytes code · 206,500 bytes png
article-detail/:                 14,681 bytes code · 341,591 bytes png
brand-identity-exploration/:     21,234 bytes code · 151,699 bytes png
home/:                           16,572 bytes code · 148,346 bytes png
opensource-index/:               14,691 bytes code · 232,490 bytes png
products-index/:                 17,804 bytes code · 213,483 bytes png
writing-index/:                  12,133 bytes code · 263,703 bytes png
```
