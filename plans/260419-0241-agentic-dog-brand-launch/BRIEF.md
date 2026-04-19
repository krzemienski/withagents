# WithAgents — Canonical Brand Brief

**Brand string:** `withagents.dev`
**Previous name (deprecated):** `agentic.dog`
**Pivot date:** 2026-04-19
**Status:** Locked. Replaces all `agentic.dog` visual + positioning spec from the original approval-package.md. Upstream narrative + research intact (thesis, 23,479 sessions, 18-post voice corpus, flagship quintet arc, calendar structure).

---

## 1. What's replaced vs what survives

### Replaced (full pivot)
- **Name:** `agentic.dog` → `withagents.dev` (umbrella brand surface)
- **Visual motif:** hyper-terminal + hot-pink/neon-green/JetBrains Mono → **Hyper-black + Ultraviolet accent + Space Grotesk/Inter**
- **Positioning frame:** "consulting umbrella first" → **"product-first with quiet applied layer"**
- **Package rename:** `agentic-dog-skills` → `withagents-skills` (Day 35 flagship)

### Survives (neutral to rename)
- 23,479-session evidence base (research A-H)
- "Real system or nothing" thesis (narrative-spine.md)
- Flagship quintet: Day 01 VF → Day 10 CCB → Day 22 Ralph → Day 35 Skills → Day 50 SF+CS+manifesto
- 18-post voice corpus, banlist, em-dash ≤5/1k cap (voice-spec.md — banlist is rhetoric-based, brand-neutral)
- Calendar structure (synthesis/calendar-45day.md — copy needs rename sweep, structure holds)
- Stack: Astro + Keystatic + Tailwind v4 + Satori + Vercel
- Analytics: Plausible
- Funnel: embedded form → email → Calendly, UTM-tagged
- codestories.platform + hack.ski decisions (codestories = storage only; hack.ski dropped)
- LinkedIn Articles only (no Shorts)
- Credentials just-in-time at Phase 11
- 531-714h / 18-24 weeks solo effort budget

---

## 2. Primary brand thesis

> **WithAgents** is a home for applied agent design: products, open-source work, and writing about what holds up in production.

**Feels like:**
- minimal
- crisp
- black-first
- premium
- technical but restrained
- thoughtful rather than trendy
- modern without cyberpunk parody
- credible to product teams, engineering leaders, enterprises

**Sits between:** product studio · systems publication · sophisticated open-source lab · quiet applied research brand

**Avoids:** loud AI agency · hackathon gimmick · generic gradient SaaS · crypto flash · "future" clichés

**Commercial layer:** subtle. Public impression = products + learning + open-source + thinking. Applied work implied and discoverable, never loudly sold.

---

## 3. Positioning (product-first with quiet applied layer)

### Core copy
> **WithAgents** is a home for applied agent design: products, open-source work, and writing about what holds up in production.

### Never say (loudly)
- "consultancy"
- "agency"
- "advisory"
- "services for hire"

### Say instead (quietly)
- "Applied systems"
- "Selected areas"
- "In practice"
- "Start a conversation"
- "Quiet collaboration"

### Positioning hierarchy (IA order)
1. Products (Runbooks, Memory Layer, Operator UI)
2. Writing (essays, field notes, production-hold analysis)
3. Open Source (`agent-contracts`, `trace-timeline`, `context-layers`)
4. About (applied layer embedded quietly)

---

## 4. Hyper-black surface system (LOCKED — all surfaces)

```
--bg-void:           #040404   /* page background */
--panel-1:           #0A0A0D   /* primary panel */
--panel-2:           #111116   /* secondary panel */
--panel-3:           #15151C   /* tertiary panel */
--text-primary:      #F5F5F7   /* main text */
--text-muted:        #A1A1AA   /* muted text */
```

Base surfaces are permanent. Accent themes rotate on top.

---

## 5. Accent theme system (6 rotatable palettes)

Base black stays constant. Accent is the only thing that rotates across themes.

### Ultraviolet (DEFAULT — use everywhere unless overridden)
```
--accent:            #8B5CF6
--accent-alt:        #C084FC
--accent-hot:        #E879F9
--accent-lime:       #A3E635
--border:            rgba(255,255,255,0.10)
--accent-wash:       rgba(139,92,246,0.12)
```

### Magenta
```
--accent: #A855F7 · --accent-alt: #F472B6 · --accent-hot: #FB7185
--accent-lime: #A3E635 · --border: rgba(244,114,182,0.14) · --accent-wash: rgba(168,85,247,0.16)
```

### Lime Signal
```
--accent: #7C3AED · --accent-alt: #A3E635 · --accent-hot: #D946EF
--accent-lime: #A3E635 · --border: rgba(163,230,53,0.14) · --accent-wash: rgba(124,58,237,0.12)
```

### Orchid
```
--accent: #9333EA · --accent-alt: #DDD6FE · --accent-hot: #E879F9
--accent-lime: #84CC16 · --border: rgba(255,255,255,0.08) · --accent-wash: rgba(147,51,234,0.10)
```

### Plasma
```
--accent: #9333EA · --accent-alt: #EC4899 · --accent-hot: #F472B6
--accent-lime: #A3E635 · --border: rgba(236,72,153,0.12) · --accent-wash: rgba(147,51,234,0.13)
```

### Mono Hyper
```
--accent: #7C3AED · --accent-alt: #D4D4D8 · --accent-hot: #C084FC
--accent-lime: #84CC16 · --border: rgba(255,255,255,0.08) · --accent-wash: rgba(124,58,237,0.09)
```

**Ultraviolet is the default.** Every component ships Ultraviolet tokens inline and documents how to swap for the other 5.

---

## 6. Branding modes (5 explorations under one umbrella)

### A. Nexus (stable product brand)
- Wordmark: `WithAgents`
- Tracking: slightly tight
- Clean monogram / hex-like mark

### B. Index ⭐ (DEFAULT for umbrella site)
- Wordmark: `withagents` (lowercase)
- Tracking: tighter, refined
- Editorial/publication feel — matches "home for applied agent design"

### C. Command (systems-first)
- Wordmark: `WITHAGENTS`
- Expanded letterspacing
- Directional, assertive — reserved for technical docs / CLI surfaces

### D. Glyph (icon-led)
- Wordmark: `WithAgents`
- Distinctive symbol + thoughtful mark

### E. Frame (enterprise-minimal)
- Wordmark: `WithAgents`
- Reserved, polished, highly credible — reserved for About page / enterprise sections

**Recommended default:** Index (lowercase). Explore all 5 in the logo deliverable, ship one primary + secondary lockups.

---

## 7. Typography system

### Recommended default pairing
- **Display/Headlines:** Space Grotesk — technical, structured, distinctive, "systems edge"
- **Body:** Inter — neutral, product-first, highly legible
- **Mono (code, tags, technical chips):** IBM Plex Mono — editorial, thoughtful

### Alternates (swappable per section if needed)
- Sora (geometric, forward-leaning)
- Manrope (clean premium restraint)
- IBM Plex Sans (editorial body alternative to Inter)

Font loading: Google Fonts `<link>` in Phase 09 (no self-hosting unless Satori OG bundle forces it — see §11).

---

## 8. Design taste bar (Claude Design sensibilities)

- disciplined spacing
- refined hierarchy
- product-grade layout judgment
- understated motion
- clear interaction states
- minimal ornamental noise
- strong readability
- premium restraint
- excellent visual rhythm

**Do NOT:** templated Dribbble feel · generic AI gradients · over-rounded cartoon cards · noisy backgrounds · stock icon overload · excessive glow · gimmicky "future" tropes.

**DO:** favor typography, layout, spacing, and precise accent use over decoration.

---

## 9. Information architecture (site pages)

Top-level sections (5):
1. **Home** — hero + featured products + latest writing + open-source index + subtle "Start a conversation" path
2. **Products** — product pillars: Runbooks, Memory Layer, Operator UI (index + detail pages)
3. **Writing** — essays, field notes, production analysis (index + article detail)
4. **Open Source** — `agent-contracts`, `trace-timeline`, `context-layers` (index + detail)
5. **About** — positioning + quiet applied layer + collaboration path

---

## 10. Content direction (no lorem ipsum)

### Product pillars (real-feeling)
- **Runbooks** — opinionated workflows for triage, analysis, execution across real internal systems
- **Memory Layer** — practical patterns for preserving context across sessions, tools, and multi-step work
- **Operator UI** — clean interfaces for inspecting runs, stepping in when needed, keeping systems legible

### Writing themes (use as sample article cards)
- "Agent workflows should read like operating systems, not demos"
- "The layer between chat and automation is where the real product work lives"
- "What to look for before trusting an agent stack in production"
- "How to design agent interfaces that remain inspectable under load"
- "Why context persistence is a product design problem, not just a retrieval problem"

### Open source (real-feeling repo presentation)
- `agent-contracts` — reusable agent-interface contracts
- `trace-timeline` — chronological execution trace viewer
- `context-layers` — context-window composition primitives

Each should feel like:
- actual repositories
- reusable building blocks
- reference patterns
- small but high-signal systems

### About / applied layer (quiet)
- internal copilots for domain-specific workflows
- operator UX for human-in-the-loop review
- agent orchestration for high-signal internal tasks
- knowledge interfaces and tool-safe automation

---

## 11. Satori OG bundle constraint (carries forward)

Vercel Edge 1MB ceiling. Subset Space Grotesk + Inter glyphs to hit the budget. Fall back to system sans (SF Pro / Segoe UI) if subset exceeds budget. Test before Phase 09 ship.

---

## 12. Interactive theme logic (Phase 09 implementation)

One black design universe with three rotatable axes:
- **Accent theme** (6 options, Ultraviolet default)
- **Branding mode** (5 options, Index default)
- **Typography system** (5 options, Space Grotesk + Inter + IBM Plex Mono default)

Implemented as Astro data attribute on `<html>` + CSS variable sets per theme. User-switchable via a subtle theme toggle in site chrome (not prominent — consistent with restrained tone).

---

## 13. Success metrics (rebrand-patch)

Metrics carry forward from approval-package.md §13 unchanged — rename only swaps `agentic.dog unique visitors` → `withagents.dev unique visitors` and `flagship repo stars` now counts withagents-scoped repos (VF + CCB family + Ralph + withagents-skills + SessionForge + Code Stories).

Numeric floors + aspirations unchanged at 45-60-day scale.

---

## 14. Voice spec carryforward

The `synthesis/voice-spec.md` banlist is brand-neutral (em-dash cap, "Think about that for a second" ban, "fundamentally different" ban, specific-number-first structural rule). All rules carry forward without change.

Minor addition: any copy that said "agentic.dog" becomes "WithAgents" (Index mode) or `withagents.dev` (URL reference). Voice tone unchanged.

---

## 15. Phase 08 deliverables (restart under this brief)

All output lands in `plans/260419-0241-agentic-dog-brand-launch/phase-08-output/`:

| Dir | Owner | Scope |
|---|---|---|
| `logo/` | V1 (Opus) | Explore 5 branding modes, recommend 1 primary + 2 secondary. Wordmarks (dark/light/mono variants), logomarks (dark/light/mono variants), favicons, README with rationale. |
| `components/` | V2 (Sonnet) | Full component library: card, button hierarchy, nav, pills/chips, CTA, code block, blockquote, metric block, footer row. All in hyper-black + Ultraviolet. Every component ships with states variant page. README + a11y audit. |
| `og-template/` | V3 (Sonnet) | Satori-ready React/JSX template, Space Grotesk + Inter subsets, <1MB bundle. README with integration for Phase 09. |
| `diagrams/` | V4 (Sonnet) | Mermaid theme + 6 example diagrams, Excalidraw style preset, diagram-style-guide.md. All hyper-black + Ultraviolet. |
| `site-mockups/` | V5 (Stitch) | 7 page mockups: Home, Products index, Product detail, Writing index, Article detail, Open Source index, About. |
| `brand-synthesis/` | V0 (Opus, optional) | Final recommended direction writeup — already locked in this brief; V0 produces presentation-grade package only if user requests it. |

---

## 16. Hard rules for every deliverable

1. **Base surfaces are fixed at the 4-panel hyper-black palette.** No drift.
2. **Ultraviolet is the accent default.** Document how to swap in others.
3. **Index branding mode is the umbrella default.** Explore others but recommend Index.
4. **Space Grotesk + Inter + IBM Plex Mono** is the default type stack.
5. **No lorem ipsum.** Use §10 real-feeling content everywhere.
6. **Commercial layer stays subtle.** Never "consultancy" / "services". Use §3 quiet copy.
7. **Claude Design taste bar** — restrained, disciplined, not trendy.
8. **Every HTML output self-contained** — no external asset deps beyond Google Fonts.
9. **A11y AA minimum** — all text/bg contrast pairs verified.
10. **Accessibility baseline** — keyboard nav, focus-visible rings, reduced-motion wrapping, semantic HTML.

---

## 17. Dependencies from upstream (still authoritative)

- `synthesis/voice-spec.md` — voice banlist + em-dash cap (brand-neutral, carries forward)
- `synthesis/narrative-spine.md` — thesis (brand-neutral)
- `synthesis/insight-library.md` — 18 insights (brand-neutral, references swap)
- `synthesis/product-inventory.md` — 45 products (rename `agentic-dog-skills` → `withagents-skills`, other names unchanged)
- `synthesis/calendar-45day.md` — 45-post schedule (rename sweep needed: agentic.dog → withagents.dev)
- `research/A-H` — evidence base (unchanged)

Rename sweep owned by V6 agent; runs in parallel with V1-V5.

---

## 18. Stitch project

- Project ID: `2918832185335861127` (see `phase-08-output/site-mockups/stitch-project.json`)
- Quota: 400/day; burned 1 on auth test; 399 remaining
- Page generations: 7 pages × 1-2 variants each ≈ 10-14 credits
- Rename in Stitch UI to "WithAgents Brand System" when convenient

---

## 19. What this brief LOCKS IN

These decisions do NOT require further user input before Phase 08 restart:
- Base surface palette (hyper-black 4-panel)
- Default accent: Ultraviolet
- Default branding mode: Index
- Default type stack: Space Grotesk / Inter / IBM Plex Mono
- Information architecture: 5 sections
- Product pillar names: Runbooks, Memory Layer, Operator UI
- Open source project names: agent-contracts, trace-timeline, context-layers

## 20. What still needs user input

- Final pick among 5 logo explorations (V1 produces all 5, recommends Index)
- Any copy edits to product pillars / writing themes before Phase 10 content sprint
- Naming confirmation for `withagents-skills` package

---

## 21. Hybrid surface decision — locked 2026-04-19 06:53

User picked Option (C) — **Hybrid** — from `phase-08-output/reference-site/RECONCILIATION.md`.

### Two concurrent surface systems
| Surface | Source | Motif | Token source |
|---|---|---|---|
| **Core site** — `/`, `/products`, `/writing`, `/opensource`, `/about` | V2 components + V3 OG + V4 diagrams + V5 Stitch mockups | Restrained, premium, hyper-black + Ultraviolet | BRIEF §4-§7 + `reference-site/project/css/tokens.css` |
| **Stylized landing** — `/hyper` (or similar opt-in route) | `reference-site/project/index.html` as-is | Hyper-terminal, Fraunces serif, hot-pink + glow + scanlines, Tweaks panel | Inline in `index.html` — different token vocabulary |

### Hard rules (§16) apply to core site only
BRIEF §16 forbids scanlines / neon / cyberpunk — those rules govern **core site surfaces**. The `/hyper` route is an explicit exception that preserves the Claude Design iteration as a marketing variant. Chrome shared across both (OG image, favicon, logo wordmark) stays restrained Ultraviolet so the brand reads coherent on social.

### Phase 09 implementation impact
- Core Astro templates use V2 component library + tokens.css Ultraviolet
- `/hyper` = single Astro page that wraps the `index.html` content in minimal Astro shell (preserve inline CSS + JS)
- Nav gets a subtle "Workshop ↗" link pointing to `/hyper`
- Primary navigation and footer chrome stay Ultraviolet on both surfaces to anchor brand identity
