# A diagram is a spec, not a decoration

300ms debounce. Syntax validator before the renderer. WebSocket pushes validated state back to the browser. The editor never crashes on invalid input, the render never flashes a stale diagram, and the file you export is the exact SVG the last valid keystroke produced.

That is the entire `live-mermaid-editor`. One rule, enforced in four places.

The rule: if a diagram is going into a PRD, a runbook, or a post, it has to be correct before it renders. Correct means the Mermaid syntax parsed cleanly in the validator pass, and the renderer received a tree it could draw.

The tool exists because I got tired of writing invalid Mermaid in a Notion block and noticing three days later that the preview had been quietly blank.

---

Left pane: CodeMirror Mermaid editor.
Right pane: rendered SVG.
Between them: a debounce + validate + render pipeline.

The obvious implementation renders on every keystroke. That crashes the browser inside of 30 seconds on real diagrams — a 200-node ER diagram re-parses and re-lays out on every character.

The 300ms debounce is the cheapest fix that works. The editor buffers keystrokes. When the buffer is quiet for 300ms, it ships the buffered code through the WebSocket to the server. Server validates syntax first (cheap), then renders (expensive), then pushes the SVG back. The right pane only updates on a valid render. Invalid Mermaid sits with a single-line error bar.

That sequence is why the editor does not flash the last-valid diagram while you're mid-typing the next one.

---

Seven templates bundled at launch — flowchart, sequence, classDiagram, stateDiagram-v2, gantt, erDiagram, pie.

A blank canvas kills diagrams. A template is a correct starting point you edit into your structure. I picked the seven shapes I use most in PRDs, runbooks, and post diagrams.

The template endpoint is a flat `GET /api/templates/:name`. No variables. No interpolation. The point is to reduce friction, not to build a templating engine.

---

Honest note on the WebSocket: it does not need to be one. A plain POST would work for single-user editing, which is 100% of today's use.

The WebSocket is there because the next thing I want to build is multi-party editing — one operator drafting a runbook diagram while a second watches in read-only mode. That feature has not shipped.

The honest version: I built infrastructure for a feature that does not exist yet. Watch me for this failure mode in future posts — I slip into it and it costs sessions. In this case the extra cost was small, the optionality is real, and multi-party is actually on the calendar. If you see me doing the same thing on a bigger slice of infrastructure, call it out.

---

Export is where the tool earns its keep. SVG export writes the exact DOM the renderer produced. PNG rasterizes at 2x. Neither path re-parses the source.

A lot of Mermaid editors re-parse at export time. That opens a gap where the diagram you see and the diagram you ship can diverge — you edit in the browser, hit export, and the export uses a different Mermaid library version than the preview. The live editor pins one library version, one render path, one export serialization.

You ship what you saw.

---

Interactive tools win when the environment enforces the rule you cared about when you started. The rule for this tool is that the diagram is a spec. Everything else is plumbing to protect the rule.

Canonical: https://withagents.dev/posts/day-47-live-mermaid-editor
Repo: https://github.com/krzemienski/live-mermaid-editor
