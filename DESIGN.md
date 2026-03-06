# Design System: Agentic Development Blog Series
**Project ID:** 5577890677756270199

## 1. Visual Theme & Atmosphere
A premium, developer-focused dark aesthetic reminiscent of high-end technical documentation and dev tool landing pages. The mood is "Midnight Observatory" — deep, focused, and intellectually stimulating. Dense with information but never cluttered. The atmosphere conveys authority and technical depth while remaining approachable.

## 2. Color Palette & Roles
- **Void Navy** (#0f172a) — Primary background, creates depth and focus
- **Slate Abyss** (#1e293b) — Secondary surfaces, cards, code blocks, elevated containers
- **Indigo Pulse** (#6366f1) — Primary accent, CTAs, active states, category tags
- **Cyan Signal** (#22d3ee) — Metrics, data highlights, key statistics
- **Emerald Confirm** (#059669) — Success states, positive metrics, validation passes
- **Amber Caution** (#f59e0b) — Warnings, attention-needed states, secondary highlights
- **Crimson Alert** (#ef4444) — Errors, failures, critical bugs, danger states
- **Violet Glow** (#8b5cf6) — Decorative accents, gradients, author avatars
- **Cloud Text** (#f1f5f9) — Primary text, headings, high-emphasis content
- **Slate Prose** (#cbd5e1) — Body text, descriptions, secondary content
- **Mist Caption** (#94a3b8) — Subtitles, metadata, tertiary text
- **Shadow Label** (#64748b) — Timestamps, footnotes, lowest-emphasis text

## 3. Typography Rules
System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif. Headers use bold 800 weight with tight line-height (1.15-1.2) for impact. Body text uses regular 400 weight with generous line-height (1.8) for readability. Code uses 'SF Mono', 'Fira Code', 'Cascadia Code', monospace with 0.85em sizing. Category labels use uppercase, 600 weight, 0.5px letter-spacing for authority.

## 4. Component Stylings
* **Hero Images:** Full-width 1200x630px cards with gradient backgrounds (135deg from Void Navy through Slate Abyss), decorative dot grid overlay (40px spacing, Indigo Pulse at 15% opacity), accent glow orb (400px radial gradient), category pill tag, bold title, subtitle, and author attribution.
* **Cards/Containers:** Gently rounded corners (8-12px radius), Slate Abyss background, single-pixel Slate Abyss border, no shadows — depth through color contrast only.
* **Code Blocks:** Void Navy background, Slate Abyss border, 8px radius, 20px padding, monospace font in Cloud Text.
* **Buttons/Tags:** Pill-shaped (20px radius) with translucent accent backgrounds (20% opacity) and matching borders (40% opacity).
* **Diagrams:** Contained in Void Navy panels with Slate Abyss borders, 12px radius, 24px padding, centered SVG content.
* **Social Cards:** Twitter 1200x628px, LinkedIn 1200x627px, same dark gradient treatment with metric highlight boxes.

## 5. Layout Principles
Content max-width 780px for optimal reading. Generous vertical spacing — 48px between major sections, 32px between subsections. Hero images break to full 1200px width. Code blocks and diagrams may extend to full content width. Consistent 24px horizontal padding on mobile. Grid-based decorative elements at 40px intervals.

## 6. Design System Notes for Stitch Generation
**CRITICAL — Include this block in every Stitch prompt:**

Use a dark theme with background color #0f172a. Use #1e293b for cards and elevated surfaces. Primary accent is #6366f1 (indigo/purple). Use #22d3ee (cyan) for metrics and data highlights. Text colors: #f1f5f9 for headings, #cbd5e1 for body, #94a3b8 for subtle text. Use system-ui font stack. Rounded corners (8-12px). No heavy shadows — use color contrast for depth. Add subtle dot grid overlays and gradient glow orbs for visual interest. The overall aesthetic is premium dark developer tooling — like Vercel, Linear, or Raycast landing pages.
