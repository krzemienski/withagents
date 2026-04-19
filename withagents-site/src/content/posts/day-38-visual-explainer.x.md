# X thread — Day 38 / visual-explainer

Thread target: 10 tweets. All under 280 chars.

---

**Tweet 1** (218)
I was about to print a nine-column ASCII table in the terminal.

Eighteen rows. Nine columns. Fingers on the keyboard typing pipes.

The result would have been unreadable on any terminal narrower than the Brooklyn Bridge.

The skill that intercepted:

---

**Tweet 2** (253)
visual-explainer lives at:
~/.claude/plugins/cache/visual-explainer-marketplace/visual-explainer/0.6.3/SKILL.md

Author: nicobailon. Version: 0.6.3.

Frontmatter has one clause that rewires the default:
"Use proactively when you're about to render a 4+ row / 3+ column table."

---

**Tweet 3** (244)
The skill does not wait to be invoked.

If the current work would produce a dense ASCII table, it triggers on its own and writes HTML instead.

Output lands in ~/.agent/diagrams/. Self-contained. No server. No external JS. Fonts from CDN.

I have 140 files in that folder.

---

**Tweet 4** (256)
2026-04-11. Blog-series consolidation.

9-column audit matrix. 18 rows of repo state across slug, remote URL, post.md, LinkedIn, X, newsletter, README, assets, deploy.

Skill wrote blog-series-migration-matrix.html.

Sticky header. Styled status dots. Responsive wrapper.

---

**Tweet 5** (247)
The matrix caught 3 issues an ASCII version would have missed:

- 2 repos with wrong GitHub remote URL
- 1 newsletter file describing a different post entirely
- 1 README still titled "61 Lessons / 8,481 Sessions" while every other surface said 18 / 23,479

---

**Tweet 6** (268)
SKILL.md ships an Anti-Patterns section longer than most skills' entire body.

Forbidden:
- Inter / Roboto / Arial as --font-body
- Indigo-500 / violet-500 accents
- Cyan+magenta+pink gradient
- Emoji section headers
- Three-dot window chrome on code blocks
- Neon Dashboard aesthetic

---

**Tweet 7** (243)
The Slop Test from the SKILL.md:

"Would a developer looking at this immediately think 'AI generated this'? If two or more signs are present, the page is slop. Regenerate."

I have had the skill regenerate pages. First pass: Inter + indigo + gradient text. Flagged. Second pass shipped.

---

**Tweet 8** (218)
Six constrained aesthetics to pick from:

Blueprint
Editorial
Paper/ink
Monochrome terminal
IDE-inspired (Dracula, Nord, Catppuccin, Solarized, Gruvbox)
Data-dense

"Neon Dashboard" explicitly banned: "always produces AI slop."

Tested. True.

---

**Tweet 9** (260)
Mermaid opinions the skill enforces:

- theme: 'base' with custom themeVariables
- Never bare <pre class="mermaid"> (no zoom)
- diagram-shell pattern with click-to-expand
- flowchart TD > flowchart LR for complex
- Never define .node as page-level CSS (collides with Mermaid transforms)

---

**Tweet 10** (215)
Mode bet: Interactive.

Skill runs in my environment, reacts to what I'm about to do, redirects to HTML when the signal matches.

ASCII tables are now the exception in my work. Styled HTML with Mermaid zoom controls is the baseline.

withagents.dev/writing/day-38-visual-explainer

---

Char counts: 218 / 253 / 244 / 256 / 247 / 268 / 243 / 218 / 260 / 215. All under 280.
