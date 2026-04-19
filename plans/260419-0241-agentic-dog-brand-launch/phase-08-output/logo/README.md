# WithAgents — Logo System

Phase 08 · V1 output for the WithAgents rebrand. Replaces the archived `agentic.dog` identity. All assets on hyper-black (`#040404`) with Ultraviolet accent (`#8B5CF6`), rendered in the Space Grotesk / Inter / IBM Plex Mono stack.

## Mode recommendation

| Mode | Role | Status |
|---|---|---|
| **B. Index** | Umbrella default | **Primary** |
| **C. Command** | CLI docs, technical surfaces | **Secondary** (promoted) |
| **E. Frame** | Enterprise / About / press | **Secondary** (promoted) |
| A. Nexus | — | Rejected |
| D. Glyph | — | Rejected |

### Design rationale (≤150 words)

**Index wins for the umbrella** because the lowercase wordmark reads as an editorial publication rather than a product pitch, which is exactly what `withagents.dev` needs to be — a home for applied agent design, not another SaaS landing page. The single Ultraviolet `i` is a restrained accent that a templated builder would never choose; it does the job of a logomark without adding illustration. **Command was promoted** because the editorial Index voice fails inside `README.md` banners and CLI screenshots — the expanded uppercase lockup sits convincingly in technical contexts where lowercase would look underdressed. **Frame was promoted** because the About page and any enterprise-adjacent surface (press kit, partner deck, conference slide) need institutional weight without cliché — the thin Ultraviolet rules carry that without drifting into corporate-blue parody.

### Rejected directions

- **Nexus** — the hex container reads as generic SaaS/crypto and collides with the brief's explicit "no gradient-SaaS parody" guardrail (§2).
- **Glyph** — an icon-led direction commits too early to a symbol, drifts into "generic AI logo" space, and fights the editorial tone; a mark can always be added to Index later without committing the brand to it now.

---

## Usage by surface

| Surface | Asset |
|---|---|
| Site nav / header | `wordmark-index-dark.svg` |
| Favicon, browser tab | `favicon.svg` (+ `build-favicons.sh` raster set) |
| App / PWA icon | `logo-mark-index-dark.svg` → `android-chrome-192.png` / `android-chrome-512.png` |
| iOS home-screen | `apple-touch-icon-180.png` |
| GitHub repo social preview | `logo-mark-index-dark.svg` (1200×630 composite in Phase 09) |
| GitHub `README.md` banner for CLI repos | `wordmark-command-dark.svg` |
| Terminal docs, CLI reference, technical screenshots | `wordmark-command-dark.svg` or `logo-mark-command-dark.svg` |
| About page hero | `wordmark-frame-dark.svg` |
| Press kit header | `wordmark-frame-dark.svg` + `logo-mark-frame-dark.svg` |
| Print, debossing, stamps, single-ink merch | any `-mono.svg` |
| Light-surface collateral (printed docs, slide decks with white background) | any `-light.svg` |

---

## Asset inventory

### Exploration
- `exploration.html` — one-page visual comparison of all 5 branding modes at equivalent scale. Readers pick one. Index is flagged as recommended; Command and Frame as promoted secondary. Opens standalone in any browser.

### Primary (Index)
- `wordmark-index-dark.svg` (512×120) — for hyper-black backgrounds
- `wordmark-index-light.svg` (512×120) — for light backgrounds
- `wordmark-index-mono.svg` (512×120, uses `currentColor`) — for single-ink print/stamp
- `logo-mark-index-dark.svg` (256×256) — the `w/` avatar
- `logo-mark-index-light.svg` (256×256)
- `logo-mark-index-mono.svg` (256×256, uses `currentColor`)

### Secondary (Command — CLI / technical)
- `wordmark-command-dark.svg` (640×120)
- `wordmark-command-light.svg` (640×120)
- `wordmark-command-mono.svg` (640×120, `currentColor`)
- `logo-mark-command-dark.svg` (256×256)

### Secondary (Frame — enterprise / About)
- `wordmark-frame-dark.svg` (560×160)
- `wordmark-frame-light.svg` (560×160)
- `wordmark-frame-mono.svg` (560×160, `currentColor`)
- `logo-mark-frame-dark.svg` (256×256)

### Favicon set
- `favicon.svg` (32×32 tuned source)
- `favicon.ico` — multi-resolution (16 / 32 / 48)
- `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- `apple-touch-icon-180.png`
- `android-chrome-192.png`, `android-chrome-512.png`
- `build-favicons.sh` — regenerates the raster set from the two SVG sources; requires `rsvg-convert` and `magick` (ImageMagick 7+). Already run once; re-run after any change to `favicon.svg` or `logo-mark-index-dark.svg`.

---

## Minimum legible sizes

| Asset | Minimum | Notes |
|---|---|---|
| `wordmark-index-*` | 140px wide | Below this the `i` accent blurs against the `w`. |
| `wordmark-command-*` | 220px wide | Expanded tracking needs room; drop to Index wordmark at narrow widths. |
| `wordmark-frame-*` | 200px wide | Thin rules need at least 1 device pixel to survive aliasing. |
| `logo-mark-index-*` | 32px square | Slash and `w` still readable as two shapes. See `favicon-32.png`. |
| `logo-mark-command-*` | 40px square | Terminal rule underneath needs room. |
| `logo-mark-frame-*` | 48px square | Two rules plus monogram — tightest at small sizes. |
| `favicon.svg` | 16px square | Stroke widths tuned specifically for this size. |

---

## Clear-space rules

- **Wordmarks**: minimum padding equal to the cap-height (or x-height for Index lowercase) of the wordmark on all four sides.
- **Logomarks**: minimum padding equal to `¼` of the mark's longest edge on all four sides.
- Never crop the mark. Never place another logo or piece of UI inside the clear-space zone.

---

## DO

- Use the Ultraviolet accent (`#8B5CF6`) exactly as shipped. The other 5 accent themes from BRIEF §5 (Magenta, Lime Signal, Orchid, Plasma, Mono Hyper) may be swapped in by editing the single color literal in the SVG source.
- Use `-mono.svg` variants with `fill: currentColor` inheritance (the host page's color drives the ink).
- Use the `-light.svg` variant whenever the background is lighter than `#A1A1AA`.
- Keep wordmark baseline aligned to the surrounding grid; Space Grotesk's metrics assume a 12/16/24/32px baseline.

## DON'T

- Don't recolor outside the BRIEF §4–§5 palette. No pastel, no desaturated greys, no non-brand blues.
- Don't stretch, skew, or non-uniformly scale any asset.
- Don't add drop-shadow, outer glow, inner glow, or bevel to the mark itself. Glow is a component hover-state concern (Phase 08 `components/`), not a logo concern.
- Don't swap Space Grotesk for another display face. If Space Grotesk fails to load, the SVG fallback stack (`Inter → system-ui → Segoe UI → sans-serif`) takes over — that is the intended fallback, not a substitution license.
- Don't embed the wordmark inside a circle, shield, square badge, or any container that wasn't shipped here.
- Don't pair the logo with gradient backgrounds, scanlines, terminal cursors, or any retro-terminal ornament.
- Don't use the favicon source as an app icon at large sizes — stroke widths are tuned for 16–32px only; use `logo-mark-index-dark.svg` for large surfaces.

---

## Font dependency note

Wordmarks use SVG `<text>` rather than path-outlined glyphs. This keeps file size small and allows upstream Satori OG rendering (Phase 09) to substitute subset fonts. Every wordmark includes this fallback stack:

```
font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif
```

In environments where Space Grotesk is not loaded, the wordmark degrades gracefully to Inter, then to the system sans. The logomarks (`logo-mark-*.svg`) are **path-based** — no font dependency — so the avatar, favicon, and app-icon paths are font-independent by design.

Google Fonts loading (Phase 09):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Typography attribution

All three typefaces in the default stack ship under the SIL Open Font License 1.1 (no runtime royalty, bundling permitted):

- **Space Grotesk** — © 2018 The Space Grotesk Project Authors. SIL OFL 1.1.
- **Inter** — © 2016 The Inter Project Authors. SIL OFL 1.1.
- **IBM Plex Mono** — © 2017 IBM Corp. SIL OFL 1.1.

SIL OFL 1.1 permits bundling and embedding; attribution in the site's `/colophon` or `/about` footer recommended, not required.

---

## Mark license

Provisional status pending Phase 09 sign-off by the user:

- **Brand marks** (wordmarks + logomarks in this directory): provisional CC BY-NC for community reproduction (blog headers, talk slides, community fork mentions). All commercial usage retained by the mark owner. **Must be confirmed by user at Phase 09 before any external publication.**
- **Typefaces**: SIL OFL 1.1 (see above) — unaffected by the mark license.

The CC-BY-NC vs all-rights-reserved decision is flagged here for Phase 09 user review; the provisional note is **not** a unilateral license grant.

---

## Swapping accent themes

BRIEF §5 defines six accent themes. To swap Ultraviolet for another theme, change the `#8B5CF6` literal in each SVG. Cheat sheet:

| Theme | Primary accent literal |
|---|---|
| Ultraviolet (default) | `#8B5CF6` |
| Magenta | `#A855F7` |
| Lime Signal | `#7C3AED` (accent) + `#A3E635` for accent-alt highlights |
| Orchid | `#9333EA` |
| Plasma | `#9333EA` |
| Mono Hyper | `#7C3AED` |

For theme-aware runtime swapping in Astro (Phase 09), define the accent as a CSS custom property (`--accent`) and reference it inside inline SVGs; the current files ship with the Ultraviolet literal inlined so they render correctly as standalone assets without a host page.

---

## Verification evidence

- 15/15 SVGs render cleanly with `rsvg-convert`.
- Favicon raster set generated at 16 / 32 / 48 / 180 / 192 / 512 px (PNG) + multi-res `.ico`.
- Visual QA performed at 512px on primary wordmark, logomark, and favicon-32 — all three read as intended (see `build-favicons.sh` log).
- No external asset dependencies inside any SVG (no image embeds, no external href).
- Hyper-black `#040404` confirmed as the only dark surface literal.
- Ultraviolet `#8B5CF6` confirmed as the only accent literal across all 15 SVGs.

---

## File sizes

Source SVGs range 3–17 KB. The full logo system (all 15 SVGs + 7 raster files + script + exploration page + this README) fits well under 100 KB total — safe for repo inclusion without git-lfs.
