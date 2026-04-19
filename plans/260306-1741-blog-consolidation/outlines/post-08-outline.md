# Post 8: Ralph: An Autonomous Execution Loop

## Metadata
- Target word count: 2,300
- Source posts: 08, 35, 36, 56
- Companion repo: `ralph-loop-patterns/`
- New content needed: No — all material exists. Needs restructuring around the hat-based execution loop narrative only.

## Opening (hook — 2 sentences max)
It was 1:47 AM on a Wednesday. I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep — the agent continued working, and by morning 28 of 30 tasks were complete.

## Narrative Arc

1. **The Context Window Problem** — Post 08's origin story. Three hours on an API migration, context window filled, agent re-implemented the first endpoint in a new session because it had no memory of the previous work. "I calculated the waste: roughly 5 hours of productive agent time lost to context loss." The core insight: "the agent's work artifacts should persist on the filesystem, not in the context window." ~250 words

2. **One Hat, One Event, Then Stop** — Post 35's central principle. An agent tries to plan, implement, test, and review in one session. By the review phase, context window is 80% full. "It reviewed the code against criteria it had invented in the moment, not the criteria from its own plan." The data: hat-based sessions achieved 94% task completion with 2% contradiction rate vs 67% completion and 34% contradictions for monolithic sessions. "By minute 40, the agent is operating on vibes, not on its plan." ~350 words

3. **The Hat System** — Post 08's metaphor: "An agent's effectiveness is determined more by what it cannot see than by what it can." Five hats: Planner (emits task-list), Builder (emits build-result), Reviewer (emits review-verdict), Fixer (emits fix-applied), Deployer (emits deploy-status). Each hat starts with fresh context. A hat never transitions to another hat — it emits an event and terminates. The orchestrator reads the event and spawns the next hat. Post 35's anti-pattern story: builder finished implementing, started reviewing its own code, self-review passed, reviewer hat later found 6 issues. ~350 words

4. **Builder-Writer-Reviewer Rotation** — Post 56's novelist analogy: "asking a novelist to write a chapter, copyedit it, and write a negative review of it, all before lunch." Single-responsibility rotation. The "no edit" constraint on the Reviewer hat forces critique to be descriptive, not prescriptive. Convergence detection: when Reviewer has zero critical findings, the loop terminates. Critical distance through agent separation — different agent instance has no memory of writing the code. ~250 words

5. **The Ralph CLI** — Post 36's evolution from shell scripts. The corruption incident: two agents tried to close the same task simultaneously, text file corrupted, three tasks disappeared. Why the `ready` state matters: tasks marked ready are eligible for the next agent to pick up. `flock()` for concurrent access. 3ms startup time means agents can call ralph 200+ times per session without overhead. Task lifecycle: `pending -> ready -> active -> done`. ~300 words

6. **The Six Tenets** — Post 08's framework, compressed:
   - "The Boulder Never Stops" — stop hook checks if tasks remain
   - "The Plan Is Disposable" — $0.05 for new plan vs $0.45-$0.60 fighting a bad plan
   - Telegram as Control Plane — the `/guidance` command for real-time course correction at 1:47 AM
   - "QA Is Non-Negotiable" — backpressure gates
   - Fresh context > accumulated context: 150K tokens accumulated = lost track; 40K tokens hat-scoped = consistent quality
   - `tools.denied` list: `git push`, `rm -rf`, `DROP TABLE` blocked explicitly
   ~300 words

7. **Cost and Results** — Post 08's cost per iteration: Planner ~$0.05, Coder ~$0.02, Reviewer ~$0.05, Documenter ~$0.005. 40% cost savings with mixed models vs Opus everywhere. Post 35's 505 topic signals across 696MB of Ralph logs. Post 36's event emission system: every task state transition emits a JSON event to `.ralph/events/`. ~200 words

## Key Code Blocks to Include
- A single hat configuration example (planner hat) from post 08 — TOML format showing model routing, tools.denied, timeout
- The task state machine enum from post 36: `enum TaskState { Pending, Ready, Active, Done, Failed }`
- The event JSON structure from post 35: `{ "hat": "builder", "event": "build-result", "status": "success" }`
- The stop-hook core logic from post 08 (simplified to "if tasks remain, continue")

## Real Data Points
- 1:47 AM anecdote, 28 of 30 tasks by morning (post 08)
- 5 hours lost to context window filling (post 08)
- 94% vs 67% completion rate, 2% vs 34% contradiction rate (post 35)
- $0.05 for new plan vs $0.45-$0.60 for fighting bad plan (post 08)
- 40% cost savings with mixed model routing (post 08)
- 3ms CLI startup time (post 36)
- Two agents corrupted shared text file (post 36)
- 505 topic signals across 696MB of logs (post 35)

## Material to NOT Include
- ALL Rust platform code from post 08 — user directive, no RoboShare references
- Post 08's full TOML configuration listings for all 4 project types
- Post 08's full state-manager.py listing
- Post 08's full Telegram handler code (mention the concept, skip the implementation)
- Post 08's per-project hat topologies section
- Post 35's "Philosophy of Constraint" section (abstract filler)
- Post 35's "Beyond Software Development" section (filler)
- Post 36's "Future of Agent Tooling" section (filler)
- Post 36's full file-locking implementation (mention flock, skip the code)
- Post 56's "Psychology of Role Separation" section (filler)
- Post 56's "Historical Context" comparing to software engineering roles (padding)
- The Rust `trait Hat` definition from post 35 — keep this as a CONCEPT, not Rust code

## Companion Repo Tie-in
The `ralph-loop-patterns/` repo contains the hat rotation orchestrator, event bus, and CLI task manager. Reader can run a Builder-Writer-Reviewer loop on their own codebase to see convergence detection in action.
