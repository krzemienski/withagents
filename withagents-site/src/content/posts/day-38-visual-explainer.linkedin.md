# The skill that refuses to render an ASCII table

I was about to print a nine-column ASCII table.

The work was a validation matrix comparing eighteen blog post repositories across three social channels. The result would have been unreadable on any terminal narrower than the Brooklyn Bridge.

`visual-explainer` intercepted. The skill generated an HTML file, opened it in my browser, and told me the path. I have not printed an ASCII table of that density since.

## Proactive by default

The skill lives at `~/.claude/plugins/cache/visual-explainer-marketplace/visual-explainer/0.6.3/SKILL.md` (author: nicobailon).

The frontmatter has a clause that rewires the default: "Use proactively when you are about to render a complex ASCII table (4+ rows or 3+ columns) — present it as a styled HTML page instead."

The skill does not wait to be invoked. If the current work would produce a table of that density, it triggers on its own and redirects the output to HTML.

## The session that changed my deliverable

2026-04-11. Blog-series consolidation audit.

Nine columns, eighteen rows: post slug, GitHub remote, post.md status, LinkedIn status, X status, newsletter status, README state, assets, deployment.

I started typing a markdown table. The skill intercepted and wrote `~/.agent/diagrams/blog-series-migration-matrix.html`. Sticky header, alternating rows, styled status indicators (green for complete, amber for partial, red for missing).

The matrix caught three issues I would have missed in ASCII:
- Two repos had the wrong GitHub remote URL.
- One newsletter file described a completely different post.
- One README still read "61 Lessons / 8,481 Sessions" while every other surface said "18 Lessons / 23,479 Sessions."

I opened the HTML version three times that week. The ASCII version I would have read once.

## Anti-patterns it forbids

The SKILL.md has an "AI Slop" section longer than most skills' entire body. Forbidden:

- **Fonts**: Inter, Roboto, Arial, Helvetica as primary `--font-body`.
- **Colors**: Indigo-500/violet-500, Tailwind's default purple, cyan+magenta+pink neon gradients.
- **Layout**: perfectly centered everything, identical cards, gradient meshes with pink/purple/cyan blobs, three-dot window chrome on code blocks, emoji icons in section headers.

The Slop Test from the SKILL.md: "If two or more are present, the page is slop. Regenerate with a different aesthetic direction."

I have had the skill regenerate pages. The first pass on a recent architecture diagram came back with Inter + indigo + gradient text. The slop test flagged it. The second pass used Instrument Serif + JetBrains Mono + terracotta/sage. That page shipped.

## Six aesthetic directions

The skill forces a commitment at Step 1. Six constrained aesthetics:

1. **Blueprint** — technical drawing, subtle grid, deep slate/blue, monospace labels.
2. **Editorial** — serif headlines, generous whitespace, muted earth tones.
3. **Paper/ink** — warm cream background, terracotta/sage accents.
4. **Monochrome terminal** — green/amber on near-black, monospace everything.
5. **IDE-inspired** — a real named palette (Dracula, Nord, Catppuccin, Solarized, Gruvbox).
6. **Data-dense** — small type, tight spacing, muted colors.

"Neon Dashboard" is explicitly banned: "always produces AI slop." Tested. True.

## Mermaid opinions

The skill has opinions about Mermaid. Partial list:

- Always use `theme: 'base'` with custom `themeVariables`.
- Never use bare `<pre class="mermaid">` — no zoom/pan.
- Always use the `diagram-shell` pattern with click-to-expand.
- Prefer `flowchart TD` over `flowchart LR` for complex diagrams.
- Never define `.node` as a page-level CSS class (collides with Mermaid's positioning transforms).
- For C4: use `graph TD` + `subgraph`, never native `C4Context`.

Each rule is scar tissue from a broken diagram.

## What it cannot do

It cannot make a bad diagram clear. Fifteen nodes with no obvious hierarchy? The skill's own guidance is "use the hybrid pattern" — a simple Mermaid overview plus CSS Grid cards. The architectural thinking still has to happen.

It also cannot make the writing good. The skill transforms format. Content is my problem.

## Mode bet

Interactive. The skill runs inside my Claude Code environment, reacts to what I'm about to do, and redirects to HTML when the signal matches. I do not write SDK code. I type a markdown table and the skill intercepts before my terminal does.

ASCII tables are now an exception in my output. HTML pages with sticky headers, real typography, and Mermaid zoom controls are the baseline.

---

Full breakdown with the anti-pattern list and the six aesthetic directions:
https://withagents.dev/writing/day-38-visual-explainer
