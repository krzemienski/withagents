# P08 Independent Verification — 2026-04-19 07:44

## Verdict
PASS-WITH-CONCERNS

Phase 08 is substantively complete. All deliverables exist, the SVG and JSON assets are structurally valid, bundle sizes are within spec, and the brand architecture is coherent. However, four findings diverge from the prior gate's claims in ways that affect Phase 09 planning accuracy. None individually blocks advancement, but taken together they constitute concerns the Phase 09 implementer must be told about before writing production code.

---

## Evidence per deliverable

### logo/

- files: 25 total (15 SVGs + 7 raster PNGs + favicon.ico + build-favicons.sh + exploration.html + README.md)
- xmllint: 15/15 SVGs OK (all parse cleanly)
- palette in SVGs only: #040404, #0A0A0D, #8B5CF6, #F5F5F7 — 4 tokens, all BRIEF §4 surface or §5 Ultraviolet accent. PASS.
- palette note: the full grep against the logo/ directory returned 13 tokens because README.md contains a swapping cheat sheet listing all 6 accent theme primaries (#7C3AED, #9333EA, #A855F7, #C084FC, #E879F9, #A3E635) as documentation text. These do not appear in any rendered SVG. The prior gate claimed "4 BRIEF tokens only" — this is accurate for rendered assets, but the methodology (grepping the directory rather than SVG files only) would have surfaced the discrepancy. Audit methodology gap, not a product defect.
- branding modes explored: yes — all 5 modes shown in exploration.html. Index recommended primary: yes. Command and Frame promoted as secondary. Nexus and Glyph rejected with rationale. Matches BRIEF §6.
- favicons: 16/32/48/180/192/512px present. favicon.ico is multi-resolution (16/32/48). apple-touch-icon-180.png and android-chrome-192/512.png present. PASS.
- wordmark variants: dark/light/mono for Index, Command, and Frame modes. PASS.
- logomarks: dark/light/mono for Index; dark only for Command and Frame. README documents this split with usage rationale.
- BRIEF §15 requirement ("primary + 2 secondary lockups") met.

### components/

- files: 20 total (9 primary HTML + 9 states HTML + README.md + a11y-audit.md). PASS.
- palette grep (all 20 files): confirms BRIEF §4-§5 tokens plus syntax-highlighting extensions. Syntax-coloring tokens confirmed to code-block.html only: #34D399, #7DD3FC, #86EFAC, #F472B6, #F87171, #FB7185, #FCA5A5, #FCD34D, #FDBA74, #fff. These are semantic status/error/success colors used as token-highlight foregrounds in code samples. Acceptable per prior gate ruling.
- xmllint spot-check (card.html, nav.html, code-block.html): all three exit OK per xmllint --html. xmllint reports HTML parser "errors" on SVG child elements and unescaped & in Google Fonts URLs — these are known HTML5 parser quirks for SVG-in-HTML5 and are not structural failures. All three files render correctly in browsers.
- a11y-audit: 42 pass / 2 warnings / 0 fails reported.

FINDING 1 — Contrast ratio discrepancy (WARNING):
The a11y-audit.md claims the known warning pair (#52525B on #111116) is "~2.8:1." Independent calculation (WCAG relative luminance formula): 2.44:1. The audit overstates the ratio by ~0.36. This does not change the AA/AAA status (both figures fail AA normal text at 4.5:1 and fail AA large text at 3:1), but the documented figure is inaccurate.

FINDING 2 — Proposed fix does not reach AA (WARNING):
The a11y-audit.md states that lightening --tok-comment to #71717A will reach "~4.1:1 AA." Independent calculation: #71717A on #111116 = 3.89:1. This passes AA for large text (3:1 threshold) but does NOT pass AA for normal text (4.5:1 threshold). Since code comments render at 13px regular weight, they are classified as normal text. The proposed fix falls 0.6 short of AA compliance for normal text. The minimum grey value that reaches 4.5:1 AA normal text on #111116 is approximately #7C7C84 (4.55:1). Phase 09 must use #7C7C84 or lighter, not #71717A.

- inline onclick: present in 2 files. nav.html (hamburger toggle, 1 instance) and code-block.html (copy button, 1 instance). The prior gate flagged only nav.html. code-block.html also has an inline onclick. Both are documented as Phase 09 carry items. CONCERN: prior gate claim of "should be only nav.html" is incorrect.

### og-template/

- files: 19 total (recursive). Prior gate claimed 12. The discrepancy is explained by font-raw/ directory containing 6 raw/source font files (the subset inputs) plus a space-grotesk.zip. The gate was counting by top-level entries. Not a defect — the font-raw files are build inputs that should logically be present. Recursive count 19 is accurate.
- bundle-size.txt: total estimate 165.2 KB of 1024 KB ceiling. 16.1% used, 858.8 KB margin. PASS. Estimate includes Satori runtime overhead (~50 KB conservative). Actual in-production measurement deferred to Phase 09 per README.
- font-subsets/: 4 TTF files present (SpaceGrotesk-Bold, Inter-Regular, Inter-Medium, IBMPlexMono-Regular) + glyphs.txt. All three BRIEF §7 default fonts subsetted. PASS.
- og-template.tsx palette: #040404, #0A0A0D, #8B5CF6, #A1A1AA, #C084FC, #F5F5F7. All 6 are BRIEF §4 surface or §5 Ultraviolet tokens. PASS.
- preview renders: 5 HTML previews (home, about, writing, opensource, product-runbooks). Prior gate claimed "5 previews at 1200x630" — previews are HTML files, not PNG/JPG renders. No raster preview images exist. These are in-browser HTML simulations of the OG output, not pre-rendered bitmaps. The prior gate's characterization as "5 previews at 1200×630" is imprecise — they are HTML mockup wrappers, not verified raster outputs at that resolution.

### diagrams/

- files: 11 total (recursive). 5 top-level entries; mermaid-examples/ has 6 files; diagram-frame/ has 2 files. Matches claimed 11. PASS.
- mermaid-theme.json: valid JSON. PASS.
- excalidraw-style-preset.json: valid JSON. PASS.
- diagram type coverage: flowchart, sequence, er, state, class, gantt — 6 types. BRIEF §15 requires "6 example diagrams." PASS.
- palette in diagram JSON files: #040404, #0A0A0D, #111116, #15151C, #7C3AED, #8B5CF6, #9333EA, #A1A1AA, #A3E635, #A855F7, #C084FC, #D946EF, #E879F9, #F472B6, #F5F5F7, #FB7185. All tokens trace to BRIEF §4 surface system or one of the 6 accent themes in §5. #D946EF is the Orchid theme's accent-hot; #F472B6 is the Plasma theme's accent-alt. Both are in BRIEF §5. PASS.
- diagram-style-guide.md: documents dark-theme enforcement (Section 1, 8), accessibility/alt-text requirement (Section 6 — mandatory, per-diagram, prose description), sizing guidance (Section 7 — frame wrapper for OG contexts). Alt-text rule is detailed and mandatory. Size guidance references ≥1200px via frame wrapper context. PASS.

### site-mockups/

FINDING 3 — Palette contamination (FAIL for strict BRIEF §4-§16 compliance):
The site-mockup HTML files use Tailwind CDN with an embedded Material Design 3 color scheme injected into tailwind.config. The home/code.html and products-index/code.html files (and by extension all 7 mockups, which share the same head structure) contain approximately 40 non-BRIEF hex tokens in the Tailwind color extension block. Examples: #23005c (on-primary-fixed), #690005 (on-error), #ffb4ab (error), #d0bcff (primary), #e9ddff (primary-fixed), #0e0e0e (surface-container-lowest), and similar Material You palette values.

These tokens are defined in the Tailwind config block but do not appear to be applied to visible rendered elements — the body uses background-color: #040404 and color: #F5F5F7, and actual rendered content uses BRIEF-compliant tokens. The Material tokens appear to be Stitch scaffold boilerplate carried over from the generation framework. They do not contaminate the visual rendering, but they do exist in the output and create ambiguity for Phase 09 engineers who may reference these files as token sources.

The prior gate stated "Ultraviolet accents surgical, mono chips… no gradients" and assessed this as passing palette fidelity. The gate did not report the Material Design token contamination in the Tailwind config block.

- files: 7 page directories + 4 loose files (DESIGN.md, INDEX.md, brand-strategy.md, stitch-project.json) = 11 top-level entries. Each page directory contains code.html + screen.png (7 dirs × 2 files = 14 files + 4 loose = 18 total files). Prior gate reported "17 files + 7 page dirs." Slight variance in counting method but content is consistent.
- DESIGN.md rule summary: "The Technical Curator" philosophy — no-line sectioning (color shift only), tonal layering for elevation, accent as surgical strikes, Sora as display font, Inter as body, IBM Plex Mono for metadata/labels, sharp edges (2px radius max for non-circular), ghost borders at 15% opacity only when accessibility requires, ambient shadows at 40-60px blur 8% opacity, input fields with bottom-border only.

FINDING 4 — DESIGN.md substitutes Sora for Space Grotesk as display font (CONCERN):
BRIEF §7 specifies Space Grotesk as the default display/headlines font. DESIGN.md (the "Technical Curator" specification authored by V5) substitutes Sora as the display font, listing Space Grotesk nowhere. The site-mockup HTML files confirm this: they load Sora via Google Fonts and inject "headline": ["Sora", "sans-serif"] into the Tailwind config. Space Grotesk is not referenced in any site-mockup HTML file.

BRIEF §7 explicitly permits Sora as an "alternate (swappable per section if needed)" — it is not a banned choice. However, DESIGN.md presents Sora as the definitive display font without acknowledging it is an alternate from the brief's default. This creates a fork: V1 logo, V2 components, and V3 OG template all use Space Grotesk; V5 site-mockups use Sora. Phase 09 must make an explicit decision about which display font governs the production Astro templates. The prior gate noted "V5 adds Sora as alternate display per BRIEF §7 allowed-alternates" — this framing is accurate about BRIEF permissions but understates the practical divergence: Sora is the exclusive display font in all 7 mockups, not an alternate used in select sections.

- spot-check palette on 2 files: confirmed BRIEF surface tokens used on rendered elements (#040404 bg, #F5F5F7 text). Non-BRIEF tokens confirmed confined to Tailwind config definition block. Rendered output is visually compliant.

### reference-site/

- RECONCILIATION.md: present. PASS.
- Option C decision: confirmed. Document contains explicit "DECISION — LOCKED 2026-04-19 06:53 America/New_York — User picked Option (C) — Hybrid." Core site surfaces use BRIEF §4-§7 + tokens.css Ultraviolet. /hyper route preserves cyberpunk variant (Fraunces + hot-pink + scanlines). PASS.
- tokens.css confirmed present in reference-site/project/css/. index.html is 1592 lines, self-contained.
- BRIEF §21 content matches RECONCILIATION.md content exactly. The hybrid decision is consistently documented in both places. PASS.

---

## Divergences from prior gate

1. Gate claimed "4 BRIEF tokens only" in logo/ — accurate for SVG assets but the logo/ directory grep returns 13 tokens due to README.md documentation text. Methodology gap in the gate, not a defect, but the claim is technically imprecise.

2. Gate claimed "xmllint 15/15" for SVGs — verified. However gate also said the component HTML check "palette grep (BRIEF + syntax-highlighting extensions only)" — this is true but the gate did not detect the Material Design token contamination in site-mockups, which uses the same grep methodology.

3. Gate claimed "inline onclick should be only nav.html" — incorrect. code-block.html also has an inline onclick on the copy button. Two files, not one.

4. Gate said a11y audit shows "42 pass / 2 warnings / 0 fails" — confirmed in audit file. However the contrast ratio for the known warning is documented as "~2.8:1" in the audit; independent calculation yields 2.44:1. The proposed Phase 09 fix (#71717A) reaches 3.89:1 — passes AA large text but does NOT pass AA normal text (4.5:1 required at 13px regular weight). The gate accepted this as a "Phase 09 fix" without verifying the fix value actually reaches AA.

5. Gate claimed "5 previews at 1200×630" for og-template — these are HTML simulation files, not verified raster renders at that resolution.

6. Gate's V5 assessment noted "V5 adds Sora as alternate display per BRIEF §7 allowed-alternates" — understates the divergence. Sora is the exclusive display font in all 7 mockups with no Space Grotesk reference. Phase 09 must resolve the Space Grotesk vs Sora fork before writing production typography CSS.

7. Gate file count for og-template was "12" — actual recursive count is 19 (includes font-raw/ source files). Count difference is explained, not a defect, but the gate figure was undercounted.

---

## Recommendations before Phase 10 content sprint

The following items must be resolved during Phase 09 implementation. None blocks starting Phase 09, but all must be closed before any content sprint that produces production typography or accessibility-governed copy.

1. MUST-FIX — code-block contrast fix target: Use #7C7C84 (or any value at or above 4.55:1 on #111116) for --tok-comment, not #71717A. The #71717A value documented in the a11y-audit reaches only 3.89:1 — passes AA large text only, not AA normal text. Code comments at 13px regular weight require 4.5:1.

2. MUST-DECIDE — display font: Phase 09 must pick one display font and apply it consistently across all Astro templates. Options are Space Grotesk (BRIEF §7 default, used in V1 logo + V2 components + V3 OG template) or Sora (BRIEF §7 allowed alternate, used in all 7 V5 Stitch mockups). The V5 mockups are the closest visual reference for the site, so Sora may be the better Phase 09 choice — but this must be an explicit user decision, not left as an implicit fork between deliverables. The OG template currently uses Space Grotesk subsets; if Sora is chosen for production, the OG template font subsets need updating.

3. MUST-FIX — site-mockup HTML files as Phase 09 reference: Strip or ignore the Tailwind config color extension block (approximately lines 15-70 in code.html files) when using these as token references. The Material Design palette in that block is Stitch scaffold boilerplate and does not represent the brand token system. The only authoritative token sources for Phase 09 are BRIEF.md §4-§5, reference-site/project/css/tokens.css, and V2 components CSS.

4. SHOULD-FIX — code-block copy button: Replace inline onclick in code-block.html with Astro client:load island pattern in Phase 09, same as nav.html hamburger. Two inline scripts exist (nav + code-block), not one.

5. INFO — OG preview renders: The 5 HTML preview files in og-template/preview/ are browser-rendered simulations, not validated raster exports. Phase 09 should run the actual Satori/Vercel OG endpoint and capture real PNG outputs to confirm layout before launch.

6. INFO — mark license: The CC BY-NC provisional status in logo/README.md requires user sign-off before any external publication per that file's explicit note. Flag for Phase 09 milestone review.
