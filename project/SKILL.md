# WithAgents Design System — SKILL.md

> A skill manifest for any agent (Claude, Cursor, an editor) working on a WithAgents surface. This file captures decisions an agent would otherwise have to re-derive on every task.

## When to use this skill

Apply this skill any time you are designing or building:

- A page on the **WithAgents** publication (home, post, series archive, products, about)
- A **product surface** in the WithAgents stable (Anneal, Runbooks, Memory Layer, Multi-Agent Consensus, Trace Timeline, Operator UI)
- A **post body** — long-form, evidence-driven writing in the series voice
- An **interactive diagram** that teaches an agent-engineering concept
- Anything that needs to feel like a "field journal for people building real agent systems"

If a brief asks for "marketing site," "splash page," or "AI hype," this skill is the wrong match. WithAgents is the opposite of those things.

## Source of truth

The system was distilled from the running prototype at `/WithAgents.html`. When in doubt:

1. **Read the source.** Open `WithAgents.html` and the files it imports (`components/*.jsx`, `pages/*.jsx`, `data/*.jsx`).
2. **Check the tokens.** Every color / size / radius / duration is in `colors_and_type.css`. Use the variable, not a literal.
3. **Match the voice.** Read three or four post bodies in `data/post-bodies.jsx` before writing copy.

This system is code-first; Figma was not used.

## Core decisions (don't re-derive these)

- **Aesthetic:** hyper-black editorial. Page is `#08080a` with two corner radial-gradient washes.
- **Accent:** one accent per surface. Default is crimson `#FF3D52`. Six approved alternates exist (Magenta, Violet, Emerald, Cyan, Amber, plus default Crimson). Never combine two accents in one composition.
- **Type:** Inter for UI/body/headlines. Fraunces *italic* for one or two words inside an Inter headline. JetBrains Mono ALL CAPS with `letter-spacing: 1.4–2.4px` for eyebrows, status pills, file paths, footer column heads.
- **No emoji** in chrome. No exclamation points. No "powered by," "revolutionary," "next-gen."
- **Numbers stay numbers.** `23,479`, `$0.15`, `82%`. Never spell out, never round to a vague band.
- **Cards layer translucent fills + 1px borders.** Never use `box-shadow` for elevation.
- **Hover lifts 2px and brightens the border.** Color does not change on hover.

## What to do when…

| Situation                                  | Decision                                                                                  |
|--------------------------------------------|-------------------------------------------------------------------------------------------|
| Need an icon                               | Use the `PostGlyph` set in `components/ui.jsx`. Stroked outline, `1.6` width. No Lucide.  |
| Need a chart                               | Inline SVG / styled divs. Bar chart pattern is in `BodyBlock` for `kind: 'bars'`.         |
| Need to teach a concept                    | Build an interactive diagram (see `components/interactive-diagram.jsx` for the pattern).  |
| Need to add a tag / kicker                 | Mono · 10–11px · letter-spacing `1.4–2.4px` · color = accent.                             |
| Need to break up a long body               | Use `<pull>`, `<patterns>`, `<failures>`, `<gate>`, `<table>`, or `<chart>` blocks.       |
| Need to give a page rhythm                 | One section per concept. `120px 40px` padding. 1px hairline divider between sections.     |
| Need a CTA                                 | One primary, one ghost. Capsule or 8–10px radius. Filled = accent on `#0a0a0a` text.      |
| Need a status pill                         | Mono ALL CAPS, dot prefix, `box-shadow: 0 0 10px <accent>` on the dot only.               |
| Need to write copy                         | First-person singular for posts. Past tense. Numbers up front. Cite the session.          |
| Need to add motion                         | Use `cubic-bezier(0.2,0.6,0.2,1)`. 120ms hover, 280ms reveal, 16–28s ambient drift.       |
| Page feels empty                           | Don't add filler. The hyper-black aesthetic earns space; let it breathe.                  |
| Asked for a "hero gradient"                | The hero is built from a parallax aurora + 80px CSS grid + drifting mono lanes + grain.   |
| Asked for "more visual interest"           | Add a code excerpt, a bar chart, or a fail/pass table — not photography or illustration.  |

## File map

```
README.md                                — overview, content + visual foundations, index
SKILL.md                                  — this file (what an agent needs to act in this system)
colors_and_type.css                       — all design tokens as CSS custom properties
assets/
  wamark.svg                              — the robot mark in raw SVG
  thumbnail.png                           — system thumbnail
preview/
  colors-base.html, colors-accent.html, colors-text.html,
  colors-lines.html, colors-page-glow.html
  type-families.html, type-display.html, type-body.html, type-mono.html
  spacing-scale.html, spacing-radii.html, spacing-surfaces.html, motion.html
  components-buttons.html, components-pills.html, components-card.html,
  components-inputs.html, components-nav.html, components-section.html,
  components-stats.html, components-pullquote.html, components-code.html
  brand-logo.html, brand-icons.html
ui_kits/withagents-site/
  index.html                              — live demo of the kit
  Components.jsx                          — WAMark, WANav, WAFooter, WAEyebrow,
                                            WAStatusPill, PostCard, ProductCard, GateDiagram
WithAgents.html                           — the running prototype this system was distilled from
```

## Token quick reference

```css
/* ===== Color ===== */
--wa-bg: #08080a;            /* page */
--wa-surface: #0c0c0e;       /* cards, rails */
--wa-fg: #f4f3ee;            /* primary text */
--wa-fg-2: rgba(244,243,238,0.72);
--wa-fg-3: rgba(244,243,238,0.4);
--wa-accent: #FF3D52;        /* canonical crimson */
--wa-accent-violet: #7A3DFF; /* page-glow only, never as a primary */
--wa-line: rgba(255,255,255,0.06);
--wa-fill-2: rgba(255,255,255,0.04);

/* ===== Type ===== */
--wa-font-ui:      Inter, system-ui, -apple-system, sans-serif;
--wa-font-display: Fraunces, Georgia, serif;     /* italic only */
--wa-font-mono:    "JetBrains Mono", ui-monospace, Menlo, monospace;

/* ===== Motion ===== */
--wa-ease: cubic-bezier(0.2, 0.6, 0.2, 1);
--wa-dur-hover: 120ms;
--wa-dur-reveal: 280ms;
```

## Anti-patterns (do not ship these)

- 🚫 Photography or illustration of any kind. The visual system is editorial; imagery is code, charts, and the mark.
- 🚫 Drop shadows for card elevation.
- 🚫 Two accents in one composition. (One accent. The other accents are for retheming surfaces.)
- 🚫 Pure-white text (`#fff`). Always the warm off-white `#f4f3ee`.
- 🚫 Marketing copy patterns: "unlock," "revolutionize," "next-generation," "AI-powered," "we believe."
- 🚫 Vague numbers. `~20k sessions` is wrong. `23,479` is right.
- 🚫 Emoji in product chrome.
- 🚫 Decorative icons. Every icon must map to a concept.

## Calibration: a copy diff

> "Unlock the power of next-generation AI agents to revolutionize your development workflow." ❌
>
> "23,479 sessions. 3,474,754 lines of interaction data across 27 projects. This series is what I learned." ✅

If the copy in your draft sounds more like the first one than the second one, rewrite it.
