# X Thread — Day 47: live-mermaid-editor

**1/9 (252)**
300ms debounce.
Syntax validator before renderer.
WebSocket pushes validated state back.

The editor never crashes on invalid input. The render never flashes stale diagrams. The file you export is the exact SVG the last valid keystroke produced.

That is the entire live-mermaid-editor.

**2/9 (257)**
One rule, enforced in four places:

A diagram is a spec, not a decoration.

If a diagram goes into a PRD, runbook, or post, it has to be correct before it renders. Correct = Mermaid parsed cleanly in validator, renderer got a tree it could draw.

**3/9 (258)**
Obvious implementation: render on every keystroke.

That crashes the browser in 30 seconds on a 200-node ER diagram. Mermaid's layout engine re-runs on every char.

300ms debounce is the cheapest fix that works. Buffer quiet for 300ms → ship to server → validate → render → push SVG.

**4/9 (252)**
The right pane only updates on a valid render.

Invalid Mermaid sits in the editor with a single-line error bar.

That sequence is why the editor does not flash the last-valid diagram while you're mid-typing the next one.

**5/9 (228)**
Seven templates bundled at launch:
flowchart · sequence · classDiagram · stateDiagram-v2 · gantt · erDiagram · pie

Blank canvas kills diagrams. A template is a correct starting point you edit into your structure.

The seven I use most.

**6/9 (266)**
Honest note: the WebSocket is not load-bearing yet.

A plain POST would work for single-user editing, which is 100% of today's use.

WebSocket is there because next thing I want is multi-party editing (one op drafts a runbook, second watches read-only). That hasn't shipped.

**7/9 (258)**
I built infrastructure for a feature that does not exist yet.

Watch me for this failure mode in future posts — I slip into it and it costs sessions.

Here: extra cost was small, optionality is real, multi-party is on the calendar.

If you see me doing this on a bigger slice, call it out.

**8/9 (279)**
Export is where the tool earns its keep.

SVG = exact DOM the renderer produced. PNG = rasterized at 2x. Neither path re-parses the source.

Lots of Mermaid editors re-parse at export. That's a gap — preview and export can use different library versions. The live editor pins one path.

**9/9 (206)**
You ship what you saw.

Interactive tools win when the environment enforces the rule you cared about when you started.

The rule: the diagram is a spec. Everything else is plumbing to protect the rule.

https://withagents.dev/posts/day-47-live-mermaid-editor
