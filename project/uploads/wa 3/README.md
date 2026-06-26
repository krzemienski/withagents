# WithAgents Design System

A field journal for people building real agent systems. This design system distills the visual + content language of the WithAgents site (a hyper-black, evidence-driven publication + product surface) into a reusable, code-first kit.

## What WithAgents is
WithAgents sits between a personal publication and a small applied lab. It pairs:
- **A 19-post series** documenting what holds up across 23,479 production AI sessions
- **Six products** — Anneal, Runbooks, Memory Layer, Multi-Agent Consensus, Trace Timeline, Operator UI
- **Open-source repos** that ship with each post

The voice is quiet, technical, evidence-first. Every claim has a number behind it. Every product is a tool somebody actually built and used.

## Source material
This system was extracted from:
- `/WithAgents.html` — the running prototype site (home, series, post, products, about)
- `/components/ui.jsx` — primitive components (mark, nav, footer, eyebrow, status pill, parallax)
- `/components/hero-scenes.jsx`, `/components/hero-scene-variations.jsx` — animated hero canvases
- `/components/interactive-diagram.jsx` — the consensus-gate live diagram
- `/data/content.jsx` — series + product data
- `/data/post-bodies.jsx` — long-form post bodies
- `/pages/{home,series,products}.jsx` — page assemblies

This is THE source of truth — Figma was not used; the site itself is the spec.

---

## Content fundamentals

### Voice
**Quiet, technical, evidence-first.** Closer to a senior engineer's field notebook than to marketing copy. Every assertion is paired with a number, a code excerpt, or a session count.

- **Person:** First-person singular ("I averaged 559 sessions per day for 42 days") for posts; second-person plural ("agents that hold up") for product. Never corporate "we."
- **Tense:** Past-tense reportage. The work has already happened; we are documenting what survived contact with reality.
- **Casing:** Sentence case for all UI labels and post titles. ALL CAPS only inside the mono "label rail" treatments (eyebrows, status pills, footer column heads, version stamps).
- **Punctuation:** Em dashes — used liberally — for parenthetical asides. Numerals kept as numerals (`23,479`, `$0.15`, `82%`) rather than spelled out.

### Tone examples
- ✅ "23,479 sessions. 3,474,754 lines of interaction data across 27 projects. This series is what I learned."
- ✅ "Three days. This sat in the codebase for three days." (one-line pull quotes drop the verb)
- ✅ "Agents aren't generators. They're readers that occasionally write."
- ❌ "Unlock the power of next-gen AI agents to revolutionize your workflow." (marketing fluff)
- ❌ "We believe the future of software is agentic." (vague, future-tense)

### Numbers as headlines
The brand earns trust through specificity. Use real numbers, even ugly ones:
- `23,479` not `~23k`
- `$0.15` not `cents`
- `92%` (catch rate), `8%` (false-positive rate) — both stated, the trade-off named
- `3` agents, `4` phases, `194` parallel — small integers given equal weight to large ones

### What we don't do
- No emoji in product copy (emoji appear ONLY as emoji in user content / sample chat data).
- No exclamation points.
- No "powered by," "revolutionary," "next-generation," "AI-powered."
- No icons that are merely decorative — every glyph maps to a concept (rocket = launch session, network = consensus, memory = store, etc).

---

## Visual foundations

### Aesthetic
**Hyper-black editorial.** A near-black base (`#08080a`) with a single accent (default crimson `#FF3D52`), 1px rule-line dividers, and a serif italic display face used surgically to soften the all-mono rigor.

### Color
- **Base:** `#08080a` (page), `#0c0c0e` (cards / rails), `#f4f3ee` (text — warm off-white, never pure white).
- **Accent:** `#FF3D52` is the canonical crimson. The site exposes 6 presets (Crimson, Magenta `#EC4899`, Violet `#B84DFF`, Emerald `#34D08C`, Cyan `#5EE6F2`, Amber `#FFB84D`) — pick ONE per surface. Never combine more than one accent in a single composition.
- **Text scale:** `f4f3ee` (primary), `rgba(244,243,238,0.72)` (secondary), `rgba(244,243,238,0.4)` (tertiary / labels), `rgba(244,243,238,0.3)` (footnote).
- **Lines:** `rgba(255,255,255,0.06)` is the default rule. `0.08` for cards, `0.12` for emphasis.
- **Page glow:** two huge radial gradients (accent at top-right, violet at bottom-left, both ~8% opacity) sit under content. Never let them touch the foreground.

### Type
Three families, used in strict roles:
- **Inter** — UI, body, headlines. 400/500/600/700/800.
- **Fraunces** — display italic, used for one or two words inside an otherwise-Inter headline (e.g. "agents that *hold up*"). Never for body. 400–700, italic preferred.
- **JetBrains Mono** — labels, eyebrows, code, status pills, footer column heads, file paths, numeric callouts. ALL CAPS with letter-spacing 1.4–2.4px.

Headline scale (large breakpoint):
- Hero: 88–120px / `letter-spacing: -3px` / weight 800
- Section: 48–72px / `-1.5px` / weight 700
- H2: 32–40px / `-0.8px` / weight 700
- H3: 22px / weight 600
- Body: 16–17px / line-height 1.6
- Mono label: 10.5–11.5px / `letter-spacing: 1.6–2.4px` / weight 600–700

### Spacing & rhythm
- Section padding: `120px 40px` (desktop) → `56px 18px` (phone).
- Inter-card gap: `12px` (rail items), `20px` (card grids), `40px` (footer columns).
- Vertical rhythm in long-form: 24px between paragraphs, 56px above an h2, 40px above an h3.

### Borders & corners
- **Rule lines:** 1px hairlines, `rgba(255,255,255,0.06)` default. Used as dividers between sections, between rail items, between cards.
- **Cards:** 12–16px radius. 1px border at `rgba(255,255,255,0.08)`. Background `rgba(255,255,255,0.02–0.04)`.
- **Pills / chips:** 999px (capsule).
- **Inputs:** 8px radius.
- **Buttons:** 8–10px radius for filled CTAs; capsule for ghost / nav buttons.

### Shadows
Sparingly. The aesthetic is flat with depth coming from layered translucency, not drop shadows. The two real shadow uses:
- **Status-pill dot glow:** `box-shadow: 0 0 10px <accent>` — small, intentional.
- **Card hover lift:** `transform: translateY(-2px)` + brighter border. No box-shadow.

### Backgrounds
- Page: deep solid `#08080a` with two radial-gradient color washes (accent + violet) at corners.
- Hero: a "parallax aurora" — two soft blobs floating in the background, a 80px CSS grid masked by an ellipse, three drifting mono "lanes" of session log text, and an SVG noise overlay at 12% opacity blending in `overlay`.
- Sections: occasional mono "ticker" rows (animated `wa-lane-N` keyframes translating left at 16–20s).
- Grain: a turbulence-filter SVG noise tile, animated with `wa-grain` (5-step, 1.8s) for subtle film texture. Use sparingly — only on hero / primary surfaces.

### Animation
- **Easing:** `cubic-bezier(0.2, 0.6, 0.2, 1)` is the house easing — fast-out, gentle settle.
- **Durations:** 120ms (hover), 160ms (focus), 280ms (route change / reveal), 1.8s (grain), 16–28s (ambient drift).
- **Hovers:** raise `2px` + brighten border + slightly brighten background. Color stays the same.
- **Press:** no transform; brief `filter: brightness(0.95)`.
- **Reveal:** `wa-post-enter` — opacity 0→1 + 8px translateY, 280ms.
- **Pulse (status):** scale `1 ↔ 1.08` + opacity `0.85 ↔ 1` over a slow loop.

### Layering & transparency
Heavy use of **translucent fill + 1px border** to suggest cards "floating" above the page glow:
- `rgba(255,255,255,0.02)` — quietest card
- `rgba(255,255,255,0.04)` — standard card
- `rgba(255,255,255,0.05)` — hover

Backdrop blur (`backdrop-filter: blur(14px)`) is reserved for the sticky nav and the consensus-gate live overlay.

### Imagery
**There are no photographs.** Visual interest comes from:
- Animated SVG / Canvas hero scenes
- Code excerpts as imagery (caption + `<pre class="wa-mono">`)
- Bar charts, tables, and "fail/pass" diagrams as primary visual material
- The robot-mark logo as an occasional standalone graphic

If an image is ever introduced, it should be desaturated, warm-shadowed, and grain-overlaid to match the editorial vibe.

### Layout rules
- Editorial sidebar TOC (the `wa-rail`) is sticky on post pages, 280px wide, dropping to a horizontal accordion below 900px.
- Hero is full-bleed, 100vh-ish, with a generous bottom margin before the first content section.
- Long-form posts use a 720px max-width measure; UI / dashboard surfaces are full-width.
- A single piece (post page) is a "page within a page" — its own pager (prev / center / next) appears at top + bottom of the article.

---

## Iconography

The site uses a custom set of stroked outline glyphs, drawn inline in `components/ui.jsx` as the `PostGlyph` component. Each post has a glyph that maps to its concept:

| key       | concept                  |
|-----------|--------------------------|
| rocket    | launch / first session   |
| network   | consensus / multi-agent  |
| check     | validation / functional  |
| phone     | iOS / mobile             |
| git       | worktrees / parallelism  |
| stack     | layered prompts          |
| loop      | orchestration / Ralph    |
| mine      | session mining           |
| palette   | design tokens            |
| yaml      | spec files               |
| memory    | observation store        |
| steps     | sequential thinking      |
| skill     | reusable prompt module   |
| hook      | enforcement hook         |
| term      | CLI / SDK                |
| split     | SDK vs CLI               |
| anneal    | planning / red-team      |

**Style:** `viewBox="0 0 24 24"`, `stroke-width: 1.6`, `fill: none`, `stroke-linecap: round`, `stroke-linejoin: round`. Color inherits from `currentColor` or is passed explicitly.

**Substitutions:** none. The inline SVG set IS the icon system; do not pull in Lucide or Heroicons.

**Emoji:** never in chrome. Acceptable inside sample chat / message data when illustrating user content.

**Logo / mark:** `WAMark` is a square robot head — accent-filled rounded rectangle with two cut-out "eyes" and a slot mouth, antenna on top. It scales from 22px (mono) to 200px+ (hero). Always rendered on dark; never inverted on light without testing contrast.

---

## Index

| File                                           | Purpose                                                       |
|------------------------------------------------|---------------------------------------------------------------|
| `README.md`                                    | (this file) overview, content + visual foundations            |
| `colors_and_type.css`                          | CSS custom properties for all tokens                          |
| `SKILL.md`                                     | Cross-compatible Agent Skill manifest                         |
| `assets/`                                      | Logo (WAMark), thumbnail, brand SVGs                          |
| `preview/`                                     | Design-system tab cards (one HTML per token / component card) |
| `ui_kits/withagents-site/`                     | High-fidelity recreation of the live site as reusable JSX     |
| `ui_kits/withagents-site/index.html`           | Live demo of the kit                                          |
| `ui_kits/withagents-site/Components.jsx`       | Nav, footer, mark, eyebrow, status pill, post card            |
| `WithAgents.html` (in project root)            | The running prototype this system was distilled from          |
