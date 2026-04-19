---
phase: 03
name: visual-system-proposal
status: pending
blockedBy: [phase-02-synthesis]
---

# Phase 03 — Visual System Proposal

## Purpose

Propose a concrete hyper-terminal visual system using tools I actually have (`tldraw`, `excalidraw`, `stitch` skill for design-to-code) — since Skitch MCP is not installed.

## Theme Spec

**Base palette:**
- `#0a0a0a` — terminal black
- `#111827` — near-black alt surface
- `#ff006e` — hot pink (primary accent, CTAs)
- `#39ff14` — neon green (success, confirmations, metric hits)
- `#faff00` — neon yellow (warnings, highlights, inline code tags)
- `#e5e7eb` — cool white text
- `#9ca3af` — muted prose

**Type:**
- Mono primary: `JetBrains Mono` (OFL, free) — preferred. `Berkeley Mono` deferred unless license confirmed and budget approved ($75/seat commercial license). **If Berkeley Mono is in, Phase 08 must ship license file alongside exports.**
- Sans secondary: `Inter` (OFL, free) for body prose
- Display: terminal-prompt ASCII pre-headers (`❯ `, `$ `, `#!`)

**Motifs:** CRT scanlines (subtle, toggleable), glow on hover, ASCII dividers, monospace tables, cursor-blink on H1.

## Component Library (to render samples for)

- Project card (title + status pill + tech badges + last-updated)
- Blog post card (title + subtitle + reading-time + series tag)
- Diagram frame (terminal-window chrome around Mermaid/excalidraw)
- OG image template (1200×630, black + hot-pink accent + neon-green metric)
- Consulting CTA block (work-with-me inline invitation)
- Release banner (horizontal announcement strip)
- Series index page skeleton

## Workflow Diagram Style (for every blog post)

- Excalidraw (hand-drawn feel) for architecture + concept diagrams
- Mermaid (`flowchart`, `sequenceDiagram`) for workflow + pipeline diagrams
- Both rendered in terminal-window-chrome frames
- Auto dark-mode via palette variables

## Tools Used (actual)

| Task | Tool |
|---|---|
| Component mockups | `tldraw` (`mcp__claude_ai_tldraw__exec`) |
| Concept diagrams | `excalidraw` (`mcp__claude_ai_Excalidraw__create_view`) |
| Design-to-code | `stitch` skill (already active in repo) |
| OG image runtime | Satori / `@vercel/og` via Next.js (selected in Phase 04) |

## Deliverables (in `visuals/`)

- `visuals/theme-tokens.json` — CSS variable export
- `visuals/component-samples/*.{png,html,excalidraw}` — 7 rendered component samples
- `visuals/og-template.html` + render preview
- `visuals/diagram-style-guide.md` — when to use mermaid vs excalidraw

## Acceptance Criteria

- [ ] Sample renders cover all 7 components
- [ ] `theme-tokens.json` directly importable into site build (Phase 09)
- [ ] Diagram style guide names one default per diagram-purpose category
- [ ] OG template renders with real post title and validates on a LinkedIn share preview tool

## Risks

- **tldraw MCP limits** on mockup fidelity vs dedicated tools like Figma. Mitigation: treat mockups as proposals, not final production assets. Production-grade exports happen in Phase 08 after approval.
- **Satori OG font-embed bundle on Vercel Edge (added 2026-04-19)** — Edge functions have a 1MB bundle ceiling; embedded custom fonts (JetBrains Mono subset + Inter subset) must fit. Mitigation: subset-embed only glyphs used in titles, verify bundle size before Phase 09 ship. Fallback: fall back to system fonts on Edge if subset exceeds budget.
- **Berkeley Mono license exposure (added 2026-04-19)** — commercial font used without license is a real risk. Default recommendation: use JetBrains Mono (free, OFL). Revisit Berkeley Mono only if user confirms license purchase.
