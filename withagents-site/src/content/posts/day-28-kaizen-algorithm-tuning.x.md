# X Thread — Day 28 — Kaizen Algorithm Tuning

Format: 9 tweets. All under 280 chars.

---

**1/9** (199 chars)
The YT Shorts detector regressed overnight and I spent two hours theorizing about why.

No prints, no traces, no frame dumps. Just reading motion_analyzer.py top to bottom arguing with myself about which branch produced the boundary.

**2/9** (179 chars)
I gave up. Added a 5-line TRACE_APPEND instrumentation. Fix took ten minutes. Root cause was three functions away from the one I had been staring at.

That is why kaizen-algorithm-tuning exists.

**3/9** (233 chars)
Four Kaizen primitives installed as Claude Code skills:

1. Five Whys — name symptom, ask why 5x, each answer a measurable claim
2. Fishbone — 6 cause categories, populate before touching code
3. PDCA — one change per cycle
4. A3 — one-page artifact

**4/9** (211 chars)
Kaizen is not new. 1980s Toyota manufacturing discipline.

The move: bind it to how Claude Code agents already want to work. Checklist-driven. File-first. Step-numbered.

The skills do not teach discipline. They make it the default path.

**5/9** (249 chars)
Before the repo: a regression triggered 3 parallel edits. Lower threshold here, add a guard there, tighten a filter somewhere else. The regression went away. I did not know which edit fixed it. Six days later the same regression was back.

**6/9** (238 chars)
After the repo: PDCA enforces one edit per cycle.

Run the suite. Write the hypothesis. Make one change. Run it again. The Check file captures the diff in behavior. The Act decision (keep/revert/escalate) is a field the skill will not let you skip.

**7/9** (199 chars)
Two failed PDCA cycles on the same hypothesis stops the loop.

The skill will not let you retry the same theory a third time.

One hypothesis, one change, one measurement. No ML. No classifier.

**8/9** (258 chars)
Where the discipline earns its keep: the second regression.

The first regression is solved by whoever was paying attention. The second, three weeks later, is where failed-approaches.md matters. Someone picks it up and reads what did not work before touching code.

**9/9** (216 chars)
Kaizen is upstream of validation.

Playwright tells you the button did not render. VF tells you the build passed but the feature did not. Kaizen tells you here is the discipline for investigating why.

https://withagents.dev/writing/day-28-kaizen-algorithm-tuning
