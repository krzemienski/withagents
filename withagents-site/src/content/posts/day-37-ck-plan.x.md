# X thread — Day 37 / ck-plan

Thread target: 9 tweets. All under 280 chars.

---

**Tweet 1** (229)
I used to start plans by opening an editor and typing "## Phase 1."

It felt productive. It was cleaning my desk instead of writing the paper.

6 of my last 30 plans done that way had to be rewritten mid-execution.

The skill that stopped me opening the editor:

---

**Tweet 2** (184)
/ck:plan lives at ~/.claude/skills/ck-plan/SKILL.md

Invoked as /ck:plan "{task}".

Ships 5 modes:
--fast
--hard
--deep
--parallel
--two

Default --auto reads the task and picks.

---

**Tweet 3** (267)
Before any phase file is written, /ck:plan runs:

1. Scan existing plans, detect blockedBy/blocks
2. Scope challenge — 5-question interview
3. Pick mode
4. Spawn researchers
5. Codebase analysis
6. Planner subagent writes plan
7. Red team
8. Validate
9. Hydrate tasks

9 steps. 40 min.

---

**Tweet 4** (243)
2026-04-12. I wanted to add watch-mode to devlog-publisher.

Scope challenge asked: "what consumes the new insights file?"

Nothing.

Watch mode would have produced a directory of dated JSONs I'd never open.

I killed the plan at question 2. Saved a weekend.

---

**Tweet 5** (269)
Last 90 days:

8 plans hit the scope challenge.
5 I killed outright.
3 I rescoped before writing.
0 I wish I had shipped.

Scope challenge is the one feature of ck-plan I'd refuse to give up. It is a mirror. Vague prompts bounce. Specific prompts get plans.

---

**Tweet 6** (260)
/ck:plan red-team spawns 2 reviewers:

A: try to kill on production grounds
B: try to kill the scope

On the withagents-skills package plan:
A caught a 20-30h build-effort undercount.
B caught a missing CCB canonical-repo decision gate.

Both became explicit open questions.

---

**Tweet 7** (272)
/ck:plan validate runs a Socratic pass asking what the plan DOESN'T say.

Not gut checks. Specific omissions.

"Phase 3 says validate. Validate against what? Where is PASS defined? Who reads the evidence?"

Every question resolves to a sentence in the plan, or a deferral in open_questions.

---

**Tweet 8** (264)
SKILL.md says: "DO NOT implement code — only create plans."

The skill outputs a "cook command" to start execution in a FRESH session.

The planner context is full of rejected options and scope branches. The executor shouldn't carry them.

Fresh session is load-bearing.

---

**Tweet 9** (222)
Mode bet: Mixed.

Planner subagent = Interactive.
Red team + validate = SDK-adjacent (Task orchestration).
Output = Non-Interactive filesystem contract.

ck-plan made most of my work feel boring. Boring is the point.

withagents.dev/writing/day-37-ck-plan

---

Char counts: 229 / 184 / 267 / 243 / 269 / 260 / 272 / 264 / 222. All under 280.
