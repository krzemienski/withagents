# README patch — claude-code-skills-factory

Paste target: `claude-code-skills-factory/README.md`, "Featured in" section (append if exists, create if absent).

---

### Featured in

**[Day 38 — The skill that refuses to render an ASCII table](https://withagents.dev/writing/day-38-visual-explainer)** (2026-05-26)

A walkthrough of `visual-explainer` (author: nicobailon, version 0.6.3), documenting the proactive-rendering rule in its SKILL.md: "Use proactively when you are about to render a complex ASCII table (4+ rows or 3+ columns) — present it as a styled HTML page instead." The skill does not wait to be invoked; it intercepts by default.

The post traces the 2026-04-11 blog-series consolidation audit session where the skill auto-generated `~/.agent/diagrams/blog-series-migration-matrix.html` — a 9-column, 18-row repository status matrix with sticky headers, styled status indicators, and a responsive overflow wrapper. The HTML version caught three issues that would have been invisible in ASCII: two wrong GitHub remote URLs, a newsletter file describing the wrong post, and a README still titled "61 Lessons / 8,481 Sessions" while every other surface said "18 Lessons / 23,479 Sessions."

Also covered:
- The 8-command table (`generate-web-diagram`, `generate-visual-plan`, `generate-slides`, `diff-review`, `plan-review`, `project-recap`, `fact-check`, `share`).
- The six constrained aesthetic directions (Blueprint, Editorial, Paper/ink, Monochrome terminal, IDE-inspired, Data-dense) — and the explicit ban on "Neon Dashboard."
- The anti-pattern list (forbidden fonts, colors, and layouts) and the Slop Test regeneration protocol.
- The Mermaid opinions (no bare `<pre class="mermaid">`, always `theme: 'base'`, never define `.node` as page-level CSS, `flowchart TD` over `LR` for complex diagrams).

If you are building a visualization skill that has to survive its own defaults, this is the reference.
