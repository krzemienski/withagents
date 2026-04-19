# The planning skill that refuses to let you start coding

I used to start plans by opening an editor and typing "## Phase 1."

It felt productive. It was the work equivalent of cleaning my desk instead of writing the paper. Six of my last thirty plans written that way had to be rewritten mid-execution.

`ck-plan` is the skill that stops me from opening the editor. It spends forty minutes refusing, and the plans that come out the other side get executed instead of rewritten.

## The five modes

The skill lives at `~/.claude/skills/ck-plan/SKILL.md`, invoked as `/ck:plan`. It ships five modes:

- `--fast` — single-file fixes, skip everything.
- `--hard` — 2 researchers, red team, optional validate.
- `--deep` — 2-3 researchers, per-phase scout, red team, validate.
- `--parallel` — parallel executor dispatch.
- `--two` — two alternative approaches, converge later.

Default is `--auto`. The skill reads the task description and picks. I override with `--hard` when I already know the work is non-trivial.

## The four steps I used to skip

`ck-plan` runs nine steps. The four I used to skip are the only four that matter:

1. **Pre-Creation Check** — scan unfinished plans in `./plans/`, detect `blockedBy`/`blocks` relationships.
2. **Scope Challenge** — a 5-question interview before any phase file is written.
3. **Red Team Review** — `/ck:plan red-team` spawns hostile reviewers who try to kill the plan.
4. **Validation Interview** — `/ck:plan validate` runs a Socratic pass asking what the plan does not say.

## The session where the scope challenge saved a weekend

2026-04-12. I wanted to add a "watch mode" to `devlog-publisher` so it would re-mine every hour.

The scope challenge asked: "What consumes the new insights file? Who reads it? Does that consumer exist?"

Nothing consumed it. I would have produced a directory full of dated insight files I would never open. I killed the plan. Saved a weekend.

Five of the last eight plans I started, I killed at the scope challenge. Three more I rescoped before writing. Zero I wish I had shipped.

## Red team takes 40 minutes

`/ck:plan red-team` spawns two reviewers. Reviewer A tries to kill the plan on production grounds. Reviewer B tries to kill the scope.

On the `withagents-skills` package launch plan, Reviewer A surfaced a 20-30h build-effort undercount. Reviewer B surfaced a missing Day -10 CCB canonical-repo decision gate. Both became explicit open questions.

Forty minutes of red-teaming. A week of schedule pressure avoided.

## Validate catches what you didn't say

`/ck:plan validate` reads the plan and asks what it omits. Not "are you sure about X" gut checks. Specific omissions: "Phase 3 says validate; validate against what? Where is the PASS criteria defined?"

Every question must resolve to a sentence in the plan or an explicit deferral in `open_questions`. No "we'll figure it out during execution."

On the Phase 10 content agent plan, validate caught three gaps: no em-dash counter in the review protocol, no handoff contract between writer and reviewer agents, no failure mode for the REWRITE verdict branch. All three added before dispatch.

## What it refuses to do

The SKILL.md says "DO NOT implement code — only create plans."

The skill writes phase files, runs red team, runs validate, hydrates tasks, and outputs a "cook command" to start execution in a fresh session.

Fresh session is load-bearing. The planner context is full of rejected options and scope-challenge branches the executor should not carry.

## What it cannot do

It cannot compensate for a bad prompt. "Build a dashboard" bounces. "Build a dashboard that shows the three metrics from `scripts/output/mine-30d-data.json` with daily refresh" gets a plan.

It also cannot tell when you are wrong about the user. Planning assumes you know what to build.

## Mode bet

Mixed. Planner subagent is Interactive. Red-team and validate are SDK-adjacent (Task-based orchestration). Output is a Non-Interactive filesystem contract the rest of the toolchain reads.

`ck-plan` has made most of my work feel boring — no mid-flight rewrites, no scope creep. Boring is the point.

---

Full breakdown with the process-flow diagram and the archive subcommand:
https://withagents.dev/writing/day-37-ck-plan
