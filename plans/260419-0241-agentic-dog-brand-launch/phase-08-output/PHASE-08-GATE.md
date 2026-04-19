# Phase 08 Verification Gate — PASS

**Date:** 2026-04-19 06:55 America/New_York
**Scope:** WithAgents rebrand (pivoted from agentic.dog 2026-04-19 06:15)
**Canonical spec:** `BRIEF.md` + `phase-08-output/site-mockups/DESIGN.md` (Technical Curator)

---

## Deliverables per agent

| Agent | Dir | Files | Status | Verified by |
|---|---|---|---|---|
| V1 logo (Opus) | `logo/` | 25 | ✓ complete | xmllint 15/15 + palette grep (4 BRIEF tokens only) + viewed favicons at 32px+180px |
| V2 components (Sonnet) | `components/` | 20 | ✓ complete | ls count match + palette grep (BRIEF + syntax-highlighting extensions only) + a11y audit report present |
| V3 OG template (Sonnet) | `og-template/` | 12 | ✓ complete | palette grep (6 Ultraviolet tokens in og-template.tsx) + bundle-size.txt 165KB of 1024KB ceiling + 5 previews at 1200×630 |
| V4 diagrams (Sonnet) | `diagrams/` | 11 | ✓ complete | mermaid-theme.json + excalidraw preset both parse OK + palette = 13 canonical tokens across 6 accent themes + flowchart spot-check shows real Runbook triage content |
| V5 Stitch mockups (user pre-generated) | `site-mockups/` | 17 files + 7 page dirs + DESIGN.md | ✓ complete | viewed home + products-index + brand-identity-exploration screens — every DESIGN.md rule honored (no-line sectioning, tonal layering, Ultraviolet-only accents, mono chips, editorial section numbering) |
| V6 rename sweep (Sonnet) | plan docs + posts | 25 files touched | ✓ complete | before-grep 189 actionable hits → after-grep 0 actionable; protected folder paths preserved |
| Reference site | `reference-site/` | 4 files (bundle + RECONCILIATION.md) | ✓ complete | 0-line diff vs source bundle; BRIEF motif conflict flagged + resolved to Option C hybrid |

## Gate checks

### 1. Palette fidelity (every agent)
- V1 logo: 4 tokens (#040404, #0A0A0D, #8B5CF6, #F5F5F7) — zero drift
- V2 components: 11 BRIEF canonical + 9 syntax-highlighting extensions in code-block only
- V3 OG template: 6 Ultraviolet tokens in template; preview wrapper uses #1a1a2e for page bg only (outside OG canvas)
- V4 diagrams: 13 tokens all canonical across 6 accent themes
- V5 mockups: viewed — Ultraviolet accents surgical, mono chips for SYS_01/02/03 + "Active" status, no gradients

### 2. Bundle / size constraints
- V3 Satori bundle: **165KB of 1024KB ceiling** (16.1% used, 859KB margin) — PASS
- V1 favicons: 16→32→48→180→192→512 all generated
- V5 mockup code.html: 11-21KB each, all under 25KB ceiling

### 3. Token consistency
- Surface tokens locked: #040404 / #0A0A0D / #111116 / #15151C across all agents
- Ultraviolet default locked: #8B5CF6 primary + #C084FC alt + #E879F9 hot + #A3E635 lime
- Type stack: Space Grotesk display + Inter body + IBM Plex Mono technical (V5 adds Sora as alternate display per BRIEF §7 allowed-alternates)
- No scanlines in core surfaces (CRT scanline element explicitly isolated to `/hyper` route per Option C)

### 4. Accessibility baseline
- Contrast audit (V2): 42 pass / 2 warnings / 0 fails
- Known warning: `#52525B` code comment on `#111116` panel at 2.8:1 — documented in `components/a11y-audit.md` as Phase 09 fix (bump to `#71717A` for 4.1:1 AA normal)
- Focus-visible rings, `prefers-reduced-motion` wrapping, semantic HTML — all present

### 5. Accessibility diagram audit (V4)
- Every mermaid example includes alt-text paragraph below the diagram
- Content references BRIEF §10 real product content (Runbooks, Memory Layer, Operator UI)

### 6. Brand artifact coverage
- Logo: wordmark × 3 modes × 3 variants + logomark × 3 modes + favicon set = complete
- Components: 9 primary + 9 states = 18 HTML + README + a11y audit
- OG: 1 Satori template + 4 font subsets + 5 preview renders + bundle size report
- Diagrams: 1 theme + 6 type examples + 1 Excalidraw preset + 2 frame wrappers + style guide
- Site mockups: 6 core pages + 1 brand-identity-exploration + DESIGN.md + brand-strategy.md + INDEX.md
- Reference site: preserved cyberpunk variant for `/hyper` route

## Known gaps (Phase 09 carry)

1. **Product-detail page** (`/products/runbooks` detail) — not in Stitch bundle. Derive in Phase 09 from products-index card pattern.
2. **Path-locked wordmark glyphs** — V1 wordmarks use `<text>` with font-fallback stack, not outlined paths. One-command fix via `inkscape --export-text-to-path` when JetBrains Mono license is confirmed at Phase 09.
3. **Code comment contrast** — `#52525B → #71717A` swap in Phase 09 Astro implementation.
4. **Nav hamburger inline JS** — V2 nav.html uses inline `onclick`; Phase 09 replaces with Astro `client:load` island.
5. **Font subsetting verification** — pyftsubset command documented in OG template README; Phase 09 to run against live Vercel Edge deploy for real bundle measurement.
6. **Mark license** — CC BY-NC provisional in V1 README; needs user sign-off before external publication.
7. **Tweaks panel from /hyper route** — port from `reference-site/project/index.html` to Astro island in Phase 09.

## Cross-reference decisions

- **Brand pivot**: `MEMORY.md` + `withagents_rebrand.md` memory file
- **Hybrid surface decision (Option C)**: `BRIEF.md §21` + `reference-site/RECONCILIATION.md`
- **Design system deepening (Technical Curator)**: `site-mockups/DESIGN.md` supersedes BRIEF.md §8 taste bar with 5 specific rules

## Phase 08 status: COMPLETE — Phase 09 unblocked

Phase 09 can begin template implementation immediately with:
- BRIEF.md §4-§7 + site-mockups/DESIGN.md as token + design system source
- V2 component library as component-level reference
- V5 site-mockups as page-level reference
- V1 logo + V3 OG + V4 diagrams as asset sources
- reference-site/ as `/hyper` route variant
