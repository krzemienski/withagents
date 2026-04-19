# Phase 09 — User-provided artifact inventory

Artifacts dropped in the repo root by user during the rebrand session. Tracked here so Phase 09 agents know what exists and don't duplicate work.

## Live artifacts

| Path | Status | Action |
|---|---|---|
| `/Users/nick/Desktop/blog-series/stitch_withagents_brand_system/` | ✓ integrated as `phase-08-output/site-mockups/` (7 pages + DESIGN.md + brand-strategy.md) | None — canonical site-mockups |
| `/Users/nick/Desktop/blog-series/stitch_withagents_brand_system.zip` | zipped duplicate of above | Remove after verified (not essential) |
| `/Users/nick/Desktop/blog-series/WIthagents-handoff.zip` | ✓ integrated as `phase-08-output/reference-site/` (README + tokens.css + index.html) — bit-identical | Remove after verified (not essential) |
| `/Users/nick/Desktop/blog-series/withagents_stitch_prompt.md` | source prompt the user pasted into Stitch | Keep as reference |
| `/Users/nick/Desktop/blog-series/withagents_interactive_brand_lab.jsx` | **NOT YET INTEGRATED** — framer-motion + lucide React component | See below |

## `withagents_interactive_brand_lab.jsx` — integration plan

This is the React component source behind the `brand-identity-exploration/screen.png` mockup. Uses `framer-motion` + `lucide-react` for icons.

**Deps required (add to withagents-site/package.json in Phase 09 A1 or A7):**
- `framer-motion` (animation)
- `lucide-react` (icons)

**Integration target in Phase 09:**
- New route: `src/pages/lab.astro` — a `/lab` page that mounts `BrandLab.tsx` as a React island via `client:load`
- Component location: `src/components/BrandLab.tsx` (copy from `withagents_interactive_brand_lab.jsx`, rename extension, verify imports resolve)
- Not required for the 5 core routes — this is a BONUS interactive artifact for demonstrating the design system

**Recommendation:** Spawn P09-A7 after A1 scaffold completes. Sonnet. ~30-60 min.

## Zip cleanup (optional)

The user may want to clean up root-level zips after confirming they're integrated:
```
rm /Users/nick/Desktop/blog-series/stitch_withagents_brand_system.zip
rm /Users/nick/Desktop/blog-series/WIthagents-handoff.zip
```
Don't auto-delete — wait for user confirmation.
