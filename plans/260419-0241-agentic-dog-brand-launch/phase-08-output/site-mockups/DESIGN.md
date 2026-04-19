# Design System Specification: The Technical Curator

## 1. Overview & Creative North Star
This design system is built on the philosophy of **"The Technical Curator."** It moves away from the bubbly, rounded "friendly AI" tropes in favor of a sophisticated, high-fidelity environment that feels like a precision instrument. 

The Creative North Star is a marriage of **High-End Editorial** (asymmetric layouts, generous negative space) and **Technical Brutalism** (monospaced accents, sharp edges, and a hyper-black palette). We achieve a premium feel not through decoration, but through "Premium Restraint"—every pixel must earn its place. We break the "template" look by using intentional typographic scale shifts and layered tonal depth rather than traditional containment lines.

---

## 2. Colors & Surface Logic

### The Hyper-Black Palette
The core of this system is the "Hyper-black" scale. We do not use "off-black" or "charcoal"; we use depths of obsidian to create a sense of infinite space.

*   **Background (Canvas):** `#040404` — The absolute floor.
*   **Primary Panel:** `#0A0A0D` — Main UI containers.
*   **Secondary Surface:** `#111116` — Nested elements or sidebars.
*   **Tertiary Surface:** `#15151C` — Hover states or high-contrast utility blocks.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background provides enough contrast for the human eye to perceive structure without the visual "noise" of a line.

### Accent Signals
Accents are used as surgical strikes of color to guide the eye, never as decorative washes.
*   **Ultraviolet (#8B5CF6) & Orchid (#9333EA):** Primary brand actions and high-level logic flow.
*   **Lime Signal (#A3E635):** Real-time status, "Active" indicators, and success states.
*   **Plasma (#EC4899):** Error states or critical alerts (replaces traditional red for a premium feel).
*   **Mono Hyper (#D4D4D8):** Secondary metadata and structural accents.

---

## 3. Typography: The Editorial Voice
We use a three-typeface system to balance modern aesthetics with technical authority.

*   **Display & Headlines (Sora):** Used for large, expressive titles. Sora’s geometric but warm nature provides the "Modern" feel. 
    *   *Usage:* `display-lg` to `headline-sm`. Tight letter spacing (-2%).
*   **Body & UI (Inter):** The workhorse. Used for all functional UI and long-form reading.
    *   *Usage:* `title-md` down to `body-sm`. 
*   **Technical/Captions (IBM Plex Mono):** This is our "Editorial Signal." Used for metadata, labels, code snippets, and small supporting text to ground the system in a "technical" reality.
    *   *Usage:* All `label` tiers.

---

## 4. Elevation & Depth

### Tonal Layering
Depth is achieved by "stacking" the surface-container tiers. Instead of shadows, we use the natural progression of our black values. 
*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "lift" that feels integrated into the architecture rather than floating on top of it.

### Ambient Shadows & Glassmorphism
*   **The Shadow Rule:** If a "floating" effect is required (e.g., a dropdown or modal), shadows must be extra-diffused. Use a blur of 40px-60px at 8% opacity. The shadow color should be `#000000`.
*   **The Glass Rule:** For overlays, use a semi-transparent version of `#0A0A0D` with a `backdrop-filter: blur(12px)`. This allows the hyper-black background to bleed through, maintaining the "obsidian" feel while providing clear hierarchy.
*   **The Ghost Border:** If accessibility requires a border, use the `outline-variant` token at 15% opacity. Full-opacity borders are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** Sharp edges (`radius: 2px`). Background: `Ultraviolet`. Text: `Main (#F5F5F7)`. No gradients.
*   **Secondary:** Ghost style. No background, `Mono Hyper` text, and a `Ghost Border` (15% opacity) that becomes 40% on hover.
*   **States:** Hover states should utilize a subtle glow effect (`box-shadow: 0 0 15px rgba(139, 92, 246, 0.3)`) rather than a color change.

### Input Fields
*   **Style:** Minimalist. No background fill on default. A single bottom-border using `outline-variant` at 20% opacity. 
*   **Focus:** The bottom border transitions to `Lime Signal` with a 2px height. Labels must use `IBM Plex Mono` in `label-sm`.

### Cards & Lists
*   **Strict Rule:** No divider lines between list items. Use vertical whitespace (16px/24px from the spacing scale) or a subtle background shift on hover (`#111116`) to separate content.
*   **Cards:** Use `Secondary Surface (#111116)` with 0px or 4px corner radius. Content should be asymmetrically aligned to create an editorial feel.

### Terminal Chips
*   Used for tags and categories. Always use `IBM Plex Mono` in uppercase. Background: `Tertiary Surface (#15151C)`. No border.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place text off-center or use varying column widths to break the "Bootstrap" grid feel.
*   **Lean into Mono:** Use `IBM Plex Mono` for things like dates, versions, and "Step 01" labels.
*   **Embrace the Dark:** Trust the high contrast between `#040404` and `#F5F5F7`. You don't need grey backgrounds to make white text readable.

### Don’t:
*   **No AI Tropes:** Avoid "sparkle" icons, purple/blue mesh gradients, or rounded "pill" buttons. 
*   **No Generic Gradients:** Avoid "Top-to-bottom" linear gradients. If a gradient is needed for a CTA, use a subtle radial glow to mimic a physical light source.
*   **No Soft Corners:** This system favors "Sharp over Soft." Avoid any radius larger than `md (0.375rem)` unless it is a circular element like an avatar.
*   **No Standard Dividers:** If you feel the urge to draw a line to separate content, try adding 24px of padding instead. Only use lines as a last resort for complex data tables.