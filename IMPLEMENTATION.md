# WithAgents — production implementation

This is the real, runnable implementation of the WithAgents design handoff
(`project/` + `chats/`). The exported prototype was an in-browser
React+Babel bundle; this is a proper **Vite + React 18** app that recreates
it pixel-faithfully, component for component.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle → dist/
npm run preview    # serve the built bundle on :4173
```

## What was implemented

Focus of this pass (per the request): **the homepage**, the **hero
carousel**, and the **three hero content types**, with all animations,
pixel-faithful across **desktop / tablet / phone**, plus full functional
validation. The rest of the site (Series, Post reader, Products, Product
detail, About) is ported too so navigation never dead-ends.

### Hero carousel — three content types, reshuffled every load
`src/pages/Home.jsx` → `buildHeroSlides()` always yields **three distinct**
slots, never two of the same kind:
1. **Writing** — a random field note (Fraunces-italic title accent, field-note card visual)
2. **Product** — a flagship product (stats + module chips card visual)
3. **Wildcard** — either **Open Source** (animated terminal install card) or **By the Numbers** (4-stat grid)

Auto-advances every 7s, pauses on hover, manual dot + prev/next nav, animated
progress bar, staggered slide-entrance, replayed on each slide change.

### Animations (all ported)
- Hero background: 4 ambient scenes (stream / swarm / pipeline / diff) auto-cycle with crossfade over a consistent aurora-blob palette (`HeroSceneCanvas.jsx`, `HeroScenes.jsx`)
- Carousel: `wa-cz-rise` stagger, `wa-cz-pop` visual, `wa-cz-prog` progress, `wa-cz-blink` kicker, `wa-cz-bob` scroll cue
- Sections: `Reveal` IntersectionObserver fade-and-rise on scroll
- Film grain, parallax aurora drift, live-stream lanes

### Responsive
Breakpoints at 1100 / 900 / 820 / 720px (`src/styles.css`, ported verbatim
from the prototype). Nav collapses, grids go single-column, carousel stacks
visual-above-copy, hero type scales via `clamp()`.

## Validation

`node scripts/validate.mjs` (Playwright, pre-installed Chromium) captures
screenshots at 1440 / 900 / 390px and runs functional assertions:

- carousel has 3 distinct content-type dots · dot click switches · prev/next present · auto-advances · scene indicator present · status pill renders · series card navigates · home sections present

All 10 functional checks pass with zero app console errors. Screenshots land
in `scripts/shots/` (including one per hero content type at desktop + phone).

> Note: the reference shots of the original `project/WithAgents.html` render
> blank in this sandbox because it pulls React/Babel from a CDN the network
> policy blocks. The port is a line-for-line translation of that same source.

## Structure

```
index.html              # app shell + fonts
src/
  main.jsx              # App, hash routing, tweaks, post-body merge
  styles.css            # global + responsive CSS (ported verbatim)
  data/                 # SERIES (19 posts) + PRODUCTS (6) + full post bodies
  lib/util.js           # hexA, shuffle, pick
  components/           # ui, HeroSceneCanvas, HeroScenes, InteractiveConsensusGate, Tweaks
  pages/                # Home (carousel + hero types), Series, Products
scripts/validate.mjs    # Playwright functional + screenshot validation
```
