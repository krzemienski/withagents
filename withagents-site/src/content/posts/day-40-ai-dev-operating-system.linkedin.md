# Skill of the week: ai-dev-operating-system

The last five Fridays of this launch have been skill spotlights. One skill per week, same shape: trigger, behavior, failure mode, cost.

This Friday's spotlight breaks the shape on purpose.

`ai-dev-operating-system` is not a skill. It is a meta-framework that packages six subsystems behind one CLI. I am shipping it as skill-of-the-week #6 because the shape of a well-designed skill, scaled up, converges on exactly this topology.

The subsystems are skills that learned to call each other.

---

## Six subsystems, one CLI

```
ai-dev-os catalog list                 # OMC kernel: 25 agents, routed by model tier
ai-dev-os ralph start --task "..."     # Persistence loop with stop-hook guarantee
ai-dev-os spec new --goal "..."        # Specum: REQ → DESIGN → TASKS → IMPL → VERIFY
ai-dev-os plan --consensus --deliberate # RALPLAN: planner + critic dialogue
ai-dev-os gsd new-project --name ...   # GSD: 10-phase gated lifecycle
ai-dev-os team start --task "..."      # Team pipeline: PLAN → PRD → EXEC → VERIFY → FIX
```

Each subsystem is internally a skill. The OS is the routing harness that lets them call each other.

---

## The persistence pattern worth stealing

The Ralph Loop + stop hook is the one piece I would port first if I only had room for one.

Claude Code sessions end when the model thinks it is done. Ralph makes that decision data-driven:

1. Ralph writes task list to `.omc/state/ralph-state.json` on every iteration
2. Stop hook reads that file at session exit
3. Tasks remain → emit "The boulder never stops" → session continues
4. Tasks = 0 → allow exit

Five lines on each side of the boundary plus a shell hook. Sessions that would have forgotten their task list now survive compaction.

Read-to-write ratio across 23,479 sessions: 9.6:1. Agents are readers that occasionally write. A persistence mechanism that makes the filesystem the memory layer is the single most leveraged pattern in this package.

---

## Mode-bet: Mixed

Meta-frameworks that pretend to pick one mode are lying to themselves.

- OMC + Specum + RALPLAN = Interactive (environment shaping)
- Ralph + Team Pipeline = Non-Interactive (headless iteration)
- CLI + routing table = SDK (programmatic steering)

Honest mode tag: Mixed, and here is why for each layer.

---

## What it costs

Running the full pipeline on a real feature routes three tasks through Opus (analyst, architect, planner). A single mid-sized feature cycle costs $1.50–$4.00 in API spend. The Team Pipeline's fix loops compound that; the cap is 3 attempts per failed journey.

Benefits I can measure:
- 97% context compression on long-running tasks (subsystems offload context to files)
- Completion guarantees via Ralph
- RALPLAN's critic flagged a Supabase RLS bypass in one plan for under $2. Would have shipped silently.

Limits I will not pretend around:
- 25-agent catalog is a routing table, not an ML classifier. Wrong picks still happen.
- Ralph depends on the stop hook firing. If the hook interface changes (it has, once), persistence breaks until you update the script.
- The 97% compression number is against my own baseline. Yours may differ.
- The CLI is opinionated. Start with one subsystem.

---

## Where to start

Ralph is the easiest entry. One command, one task, the persistence guarantee in action:

```
pip install ai-dev-os
ai-dev-os ralph start --task "<your real goal>" --max-iterations 20
```

If that pattern changes how your sessions end, the rest of the package is worth exploring. If it does not, the rest will not either.

Repo: github.com/krzemienski/ai-dev-operating-system
Docs: README, agent-catalog.md, architecture.md, building-your-own.md
Full post: https://withagents.dev/writing/day-40-ai-dev-operating-system
