# Reference Site Implementation Notes

**Source:** `https://api.anthropic.com/v1/design/h/VXX5qqKddAm3ufU26wZUmA` (Claude Design export, 2026-04-19)
**Implementation action:** Bundle copied verbatim into this directory.
**Integrity:** source-vs-copy diff = 0 lines (see verification run 2026-04-19 06:51 America/New_York).

---

## What shipped here

```
reference-site/
├── README.md              — Claude Design handoff instructions
├── chats/
│   └── chat1.md           — design iteration transcript
└── project/
    ├── index.html         — 57,793 bytes, 1592 lines, self-contained
    └── css/
        └── tokens.css     — WithAgents hyper-black + Ultraviolet system
```

- **index.html** opens standalone. Inline CSS + JS. External deps = Google Fonts only (Fraunces, Instrument Serif, JetBrains Mono, Inter Tight).
- **tokens.css** matches `BRIEF.md` §4-§7 exactly: hyper-black surfaces, 6 accent themes (Ultraviolet default), 5 type themes, 5 branding modes.

---

## BRIEF.md conflict — FLAG FOR USER DECISION

There are **two divergent design systems** in this bundle:

| Aspect | `css/tokens.css` (aligned with BRIEF) | `index.html` (Claude Design chat iteration) |
|---|---|---|
| Background | `#040404` | `#000000` |
| Accent default | Ultraviolet `#8B5CF6` (restrained) | Hyper hot pink `#ff2d95` (neon) |
| Scanlines | none | CRT scanlines overlay (body::after) |
| Glow | not in base | aggressive text-shadow + box-shadow on hover |
| Themes | 6 accent × 5 type × 5 brand | 7 themes (Hyper/Synthwave/Midnight/Voltage/Toxic/Sunset/Blood) × 9 accents × 3 fonts |
| Typography | Space Grotesk + Inter + Plex Mono | Fraunces serif + Instrument Serif italic + JetBrains Mono + Inter Tight |
| Vibe | premium restraint, "technical but restrained" | editorial-terminal, neon cyberpunk, "spinning seal" motif |

**Why this matters:** `BRIEF.md` §2 and §8 explicitly FORBID:
- cyberpunk parody / hackathon gimmick / "future" clichés
- scanlines, neon overload, terminal chrome
- gradients beyond subtle accent washes

`index.html` ships most of those forbidden elements.

**The chat transcript (`chats/chat1.md`) shows the user explicitly pivoted FROM restrained editorial TO hyper-terminal hot-pink** during the Claude Design session. The latest user direction favored the cyberpunk treatment.

**BRIEF.md (locked 2026-04-19 06:28) came AFTER that chat**, reaffirming restraint.

### Open question

Does the user want:
- **(A)** The `index.html` as implemented — preserve the Claude Design cyberpunk iteration. Would require BRIEF.md §2 §8 §16 amendments to unlock neon + scanlines + serif display.
- **(B)** The `tokens.css` direction — rebuild `index.html` against the restrained hyper-black + Ultraviolet system. Keep the structural choices (nav, hero, agent roster, pricing, dispatches, footer, tweaks panel) but drop the cyberpunk ornamentation.
- **(C)** Hybrid — keep both; `tokens.css` governs agentic site surfaces (Products, Writing, About), `index.html` is a stylized landing / marketing variant at a separate route.

**Recommendation: (C) Hybrid.** The tokens.css matches BRIEF so Phase 09 site templates should use it. The index.html becomes a single marketing/landing variant accessible via a tweak (e.g. `/hyper` route or a toggle in the nav). Both systems were explicitly authored by the user in different iteration windows. Keeping both preserves optionality without forcing a re-do.

## DECISION — LOCKED 2026-04-19 06:53 America/New_York

**User picked Option (C) — Hybrid.**

### Operational split
- **Core site surfaces** (Home, Products, Writing, Open Source, About) → built in Phase 09 against `../../BRIEF.md` tokens + `tokens.css` Ultraviolet system. Restrained, premium, Space Grotesk + Inter + IBM Plex Mono. These are the 7 mockups V5 generated.
- **Stylized marketing variant** → `project/index.html` preserved as the hyper-terminal landing. Mount at `/hyper` route (or similar distinct path), linked from primary nav as "Studio" or "Workshop" so visitors can opt in. Fraunces + Instrument Serif + hot-pink Hyper palette.

### What this unlocks
- Phase 09 can proceed against BRIEF.md unchanged (no motif edits needed)
- The Claude Design cyberpunk iteration is preserved verbatim as a second-surface landing, not discarded
- Tweaks panel from `index.html` (theme/accent/type switcher) can stay on the `/hyper` surface only; core pages don't need it

### Phase 09 action items (added to backlog)
1. Port `index.html` tokens + structure into an Astro route file `/hyper.astro` (or `.mdx` + `.astro` layout split)
2. Subset the 4 Google Fonts used (Fraunces + Instrument Serif + JetBrains Mono + Inter Tight) if keeping — or drop to system fonts if Satori OG bundle margin demands
3. Core surfaces use Inter + Space Grotesk + IBM Plex Mono only (per BRIEF §7)
4. Add a subtle "Workshop ↗" link in the primary nav pointing to `/hyper`
5. `/hyper` OG image uses the restrained Ultraviolet OG template (consistent brand chrome on social shares) — do NOT create a second OG generator

---

## "Relevant aspects" applied

Per README.md handoff: "recreate pixel-perfectly in whatever technology makes sense for the target codebase." Target = Astro + Keystatic + Tailwind v4 (Phase 09).

For Phase 08, the implementation is: **bundle preserved as a reference artifact**. Phase 09 does the Astro rebuild against one of the three options above.

**Relevant aspects the Phase 09 site MUST adopt** (regardless of A/B/C pick):
1. Information architecture: nav links Home / Products / Writing / Open Source / About (matches BRIEF §9)
2. Tweaks panel pattern: theme + accent + type switcher, stored in localStorage (matches BRIEF §12 "interactive theme logic")
3. Grid system: 12-column roster layout with variable col-spans (span-4, span-6 feature, span-8 wide, span-4 tall)
4. Section head pattern: numbered section indicator, large display headline, mono kicker
5. Editorial rhythm: mono metadata strips between sections, blinking cursor dots on live-status elements

**Relevant aspects to SUPPRESS** if BRIEF.md restraint stays locked:
1. CRT scanline overlay (index.html lines 180-193)
2. `--glow: 0 0 24px ...` aggressive text-shadows and box-shadow accents
3. Serif display (Fraunces + Instrument Serif italic) — BRIEF mandates Space Grotesk as display
4. Accent-ink-on-accent button hover glow intensity
5. The spinning "studio seal" (decorative, off-tone for "applied systems" positioning)

---

## Verification evidence (2026-04-19 06:51 America/New_York)

- `wc -l index.html` → 1592
- `diff source copy` → 0 lines (bit-identical)
- `grep -cE "structural tags"` → 30
- `grep -c "fonts.googleapis"` → 2 (preconnect + stylesheet)
- HTML opens standalone (no build step required)
- All tokens are valid CSS custom properties
- Google Fonts request includes all 4 required families

---

## Next actions

1. **User decision on A/B/C above** — blocks Phase 09 template work.
2. Apply V2 component library (`../components/`) as the token-level source of truth for Phase 09 Astro components.
3. If (B) or (C): fork `index.html` → `index-hyper.html` and build a restrained version that uses `tokens.css` Ultraviolet direction.
4. Inject `withagents` wordmark from `../logo/wordmark-index-dark.svg` into nav lockup (current `index.html` uses text-only brandmark with decorative amp glyph).
