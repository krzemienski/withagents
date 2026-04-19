# X thread — Day 40: ai-dev-operating-system (skill of the week #6)

---

**Tweet 1 (233 chars)**
Five skill-of-the-week Fridays in.

This one breaks the shape on purpose.

ai-dev-operating-system is not a skill. It is a meta-framework that packages 6 subsystems behind one CLI.

Skills scaled up converge on exactly this topology. 👇

---

**Tweet 2 (242 chars)**
Six subsystems, one CLI:

• OMC kernel — 25 agents, model routing
• Ralph Loop — persistence across session boundaries
• Specum — REQ → DESIGN → TASKS → IMPL → VERIFY
• RALPLAN — planner + critic dialogue
• GSD — 10-phase gated lifecycle
• Team Pipeline — PLAN → EXEC → VERIFY → FIX

---

**Tweet 3 (257 chars)**
Each subsystem is internally a skill.

The OS is the routing harness that lets them call each other.

If you understood the five previous Friday spotlights (devlog-publisher, functional-validation, ck-plan, visual-explainer, deepen-prompt-plan), you already understand the scaled version.

---

**Tweet 4 (260 chars)**
The pattern worth stealing: Ralph Loop + stop hook.

1. Ralph writes task list to .omc/state/ralph-state.json
2. Stop hook reads that file at session exit
3. Tasks remain → emit "The boulder never stops" → session continues
4. Tasks = 0 → allow exit

Five lines on each side. Huge leverage.

---

**Tweet 5 (258 chars)**
Across 23,479 sessions: read-to-write ratio is 9.6:1.

Agents are readers that occasionally write. A session without a persistence mechanism forgets on exit.

Ralph makes the filesystem the memory layer. The stop hook makes exit a conditional event.

Sessions survive compaction.

---

**Tweet 6 (261 chars)**
Mode-bet: Mixed.

• OMC + Specum + RALPLAN → Interactive (environment shaping)
• Ralph + Team Pipeline → Non-Interactive (headless iteration)
• CLI + routing table → SDK (programmatic steering)

Meta-frameworks that pretend to pick one mode are lying to themselves.

---

**Tweet 7 (253 chars)**
Real costs:

Full pipeline on a mid-sized feature = $1.50–$4.00 in API spend.
Team Pipeline's fix loops cap at 3 attempts per failed journey.

Benefit I can measure: RALPLAN's critic flagged a Supabase RLS bypass for <$2. Would have shipped silently without the review.

---

**Tweet 8 (262 chars)**
Limits I will not pretend around:

• 25-agent catalog is a routing table, not a classifier. Wrong picks happen.
• Ralph depends on the stop hook firing. Hook interface has changed once.
• 97% context compression is vs MY baseline. Yours may differ.
• CLI is opinionated.

---

**Tweet 9 (219 chars)**
Start small.

```
pip install ai-dev-os
ai-dev-os ralph start \
  --task "<your real goal>" \
  --max-iterations 20
```

If the persistence pattern changes how your sessions end, the rest of the framework is worth exploring.

---

**Tweet 10 (209 chars)**
Repo: github.com/krzemienski/ai-dev-operating-system

Read docs/building-your-own.md if you want to extract one subsystem without taking the full framework.

Full post:
withagents.dev/writing/day-40-ai-dev-operating-system

---

**Tweet 11 (154 chars)**
The skill-of-the-week track started at one skill per Friday.

It closes on an OS because the shape of a well-designed skill, scaled, converges here.
