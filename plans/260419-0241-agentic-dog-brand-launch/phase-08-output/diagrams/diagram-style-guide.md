# WithAgents Diagram Style Guide

**Version:** 1.0.0
**Brand:** withagents.dev — Hyper-black + Ultraviolet (Ultraviolet is the default accent)
**Scope:** All diagrams shipped on withagents.dev and in open-source README files.
**Dark-mode-only policy:** Diagrams ship in hyper-black theme only. Light-mode variants are out of scope for this launch.

---

## 1. Tool decision matrix

Use this matrix to pick the right tool before opening any editor.

| Diagram purpose | Tool | Format | Rationale |
|---|---|---|---|
| Agent workflow, data flow, decision tree | Mermaid `flowchart` | `.md` with fenced block | Fast to write, version-controlled, renders in GitHub |
| Actor-to-actor interaction, API handshake | Mermaid `sequenceDiagram` | `.md` | Native lifelines, activation bars |
| Data model, class hierarchy | Mermaid `classDiagram` or `erDiagram` | `.md` | Precise schema — no ambiguity |
| State machines, lifecycle | Mermaid `stateDiagram-v2` | `.md` | Explicit fork/join, terminal states |
| Timeline, phased schedule | Mermaid `gantt` | `.md` | Calendar-aligned output |
| Whiteboard sketch, freeform concept | Excalidraw | `.excalidraw` → SVG export | For early exploration; export to SVG before publishing |
| Final hand-crafted illustration | Inline SVG | `.svg` embedded in HTML/MDX | Pixel-precise; use `diagram-frame-svg.html` wrapper |
| System architecture with grouping | Mermaid `flowchart` with `subgraph` | `.md` | Cluster borders use accent-wash |

**Rule:** If a Mermaid diagram type covers the use case, use Mermaid. Reserve Excalidraw for concepts that require freeform spatial layout (e.g., whiteboard-style product architecture sketches).

---

## 2. Preferred diagram types by content category

### Writing / essays
- **Flowchart** — argument structure, decision trees, "what happens if" branching
- **Sequence** — step-by-step walkthroughs ("here is the order of events")

### Product pages (Runbooks / Memory Layer / Operator UI)
- **Flowchart** — triage flows, execution paths
- **Sequence** — human-in-the-loop interactions, API call chains
- **State** — agent lifecycle, task status transitions

### Open-source documentation (agent-contracts / trace-timeline / context-layers)
- **ER** — schema, table relationships, data contracts
- **Class** — type hierarchies, interface shapes
- **Flowchart** — install → configure → use onboarding paths

### Technical field notes
- **Gantt** — phased timelines, push schedules, milestone tracking
- **Sequence** — multi-agent coordination, tool-call sequences

---

## 3. Accent colour usage in diagrams

All colours reference the Ultraviolet palette (BRIEF §5). Never drift from these rules.

| Colour | Hex | Role in diagrams | Rule |
|---|---|---|---|
| Ultraviolet | `#8B5CF6` | Primary path, primary arrow, primary node border, active state border | Default for all significant connections and selected nodes |
| Accent-alt | `#C084FC` | Secondary accent on node fills if a visual tier is needed | Use sparingly — one tier below primary |
| Accent-hot (Magenta) | `#E879F9` | Contrast / deviation / error arrows only | Never decorative; only when a path represents an exception or failure mode |
| Accent-lime | `#A3E635` | Success / hit / true / resolved state borders only | `today` line in Gantt; terminal "Resolved ✓" node; never as a general highlight |
| Muted secondary | `rgba(255,255,255,0.30)` | Secondary connections, non-critical edges | For edges that are context, not primary path |
| Node outline | `rgba(255,255,255,0.10)` | Default border on all nodes | Applied to every node that is not a primary or success state |
| Text on nodes | `#F5F5F7` | All node labels | Always light-on-dark. Never dark-on-dark or light-on-light |
| Muted text | `#A1A1AA` | Note text, annotation text, captions | Secondary information only |

**Hard rule:** `#A3E635` (lime) appears on at most one node per diagram — the terminal success state. If a diagram has no success state, lime does not appear.

**Hard rule:** `#E879F9` (hot magenta) appears on at most two edges per diagram. If you need more than two deviation arrows, reconsider the diagram structure — it is too complex.

---

## 4. Typography in diagrams

| Element | Font | Size | Weight |
|---|---|---|---|
| Node labels, state names | Space Grotesk | 14px | 400–500 |
| Edge labels, arrow text | Space Grotesk | 13px | 400 |
| Code values, schema field names | IBM Plex Mono | 12–13px | 400 |
| Diagram titles (Mermaid `title:`) | Space Grotesk | 15px | 500 |
| Caption beneath frame | Inter | 13px | 400, italic |
| Kind-tag in frame header | IBM Plex Mono | 11px | 500, uppercase |

**Rule:** Sans (Space Grotesk) for all human-readable labels. Mono (IBM Plex Mono) only for code, data field names, schema identifiers, and the kind-tag chip. Never mix fonts within a single node label.

---

## 5. Max complexity rule

**If a diagram has 15 or more nodes, split it.**

One diagram = one concept. If you find yourself connecting 15+ nodes, you have discovered two concepts, not one. Split them and link with a prose sentence: "This flow continues in the [X diagram]."

Practical caps per diagram type:
- Flowchart: ≤ 12 nodes
- Sequence: ≤ 8 participants, ≤ 14 messages
- Class: ≤ 6 classes
- State: ≤ 10 states
- ER: ≤ 6 entities
- Gantt: ≤ 20 tasks across ≤ 6 sections

---

## 6. Accessibility — alt-text requirement

**Every diagram MUST have an alt-text paragraph immediately beneath it.**

The alt-text must be written so a screen-reader user fully understands the diagram without seeing it. It is not a caption; it is a prose description of every node, edge, and conclusion.

Format:

```md
**Alt text:** [Full prose description of the diagram — every node, every edge, every decision branch, every terminal state.]
```

Guidelines:
- Describe the diagram type in the first sentence ("A flowchart showing…", "A sequence diagram showing…").
- Name every actor/node/entity.
- Describe every directional relationship ("X connects to Y via Z", "A sends B to C which responds with D").
- State the overall conclusion or purpose in the final sentence.
- Minimum length: one short paragraph (3–5 sentences). There is no maximum.

---

## 7. Frame wrapper usage

Use `diagram-frame.html` (Mermaid) or `diagram-frame-svg.html` (SVG) as the panel chrome when embedding diagrams in site pages or standalone HTML exports.

Frame anatomy:
- **Header row:** kind-tag chip (monospace, uppercase, Ultraviolet tint) + optional diagram title
- **Body:** padded diagram area with `padding: 32px` (space-lg), horizontal scroll on mobile
- **Caption row:** italic 13px caption in `#A1A1AA` — brief description, not the full alt-text

Kind-tag vocabulary (use exactly these strings):
- `Architecture`
- `Sequence`
- `Schema`
- `Flow`
- `Lifecycle`
- `Timeline`
- `Data Model`

Do not invent new kind-tags. If none of the above fits, use `Architecture` as the default.

---

## 8. Applying the Mermaid theme

Paste the `%%{init: ...}%%` block at the top of every Mermaid fenced code block. Do not rely on the host environment to supply a theme — always inline it. This ensures diagrams render correctly in GitHub README files, Astro MDX pages, and standalone HTML exports.

The full init block to copy:

```
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","edgeLabelBackground":"#111116"}}}%%
```

For sequence diagrams, add the sequence-specific variables:
```
"actorBkg":"#0A0A0D","actorBorder":"rgba(139,92,246,0.40)","actorLineColor":"rgba(255,255,255,0.10)","signalColor":"#8B5CF6","signalTextColor":"#F5F5F7","labelBoxBkgColor":"#111116","activationBkgColor":"rgba(139,92,246,0.12)","activationBorderColor":"#8B5CF6","noteBkgColor":"#15151C","noteTextColor":"#A1A1AA"
```

For Gantt charts, add the Gantt-specific variables:
```
"sectionBkgColor":"#111116","altSectionBkgColor":"#15151C","taskBkgColor":"#8B5CF6","taskTextColor":"#F5F5F7","critBkgColor":"#E879F9","critTextColor":"#F5F5F7","todayLineColor":"#A3E635","gridColor":"rgba(255,255,255,0.06)"
```

The full set of variables is documented in `mermaid-theme.json` with inline `_section` comments.

---

## 9. Applying the Excalidraw preset

1. Open Excalidraw (excalidraw.com or desktop/plugin).
2. Open the browser console.
3. Parse `excalidraw-style-preset.json` and run: `excalidrawAPI.updateScene({ appState: preset.appState })`.
4. Your canvas switches to `viewBackgroundColor: #040404`, dark theme, Ultraviolet as the default stroke.
5. Use the `_defaultElementStyles` block in the preset as your per-shape style reference.

After drawing, export to SVG (File → Export image → SVG, embed fonts on). The SVG file is then embedded using `diagram-frame-svg.html`.

---

## 10. Accent palette swap procedure

All six diagrams and both frame files ship with the Ultraviolet accent default. To switch the accent for an alternate section or theme variant:

1. In Mermaid init blocks: replace `#8B5CF6` (lineColor, signalColor, activationBorderColor, taskBkgColor, actorBorder value) with the new accent hex.
2. In `excalidraw-style-preset.json`: replace `currentItemStrokeColor` and all `#8B5CF6` occurrences with the new hex. Use the `_accentSwap` block for ready-made replacements.
3. In frame HTML CSS: replace `--accent: #8B5CF6` and `--accent-wash: rgba(139,92,246,0.12)` with the matching values from BRIEF §5.

Base surfaces (`#040404`, `#0A0A0D`, `#111116`, `#15151C`) never change. Only accent tokens rotate.

---

## 11. What this guide does NOT cover

- Light-mode diagram variants — out of scope for this launch.
- Animated diagrams — not in scope; all diagrams are static.
- AI-generated illustrations — use Stitch (BRIEF §18) for hero images and page illustrations; diagrams are always constructed, never generated as raster images.
- Print / PDF export — not in scope.
