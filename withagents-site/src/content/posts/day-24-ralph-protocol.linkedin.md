# The RALPH protocol

The first time I wrote "the RALPH protocol" into a file, it was a six-line README in `ralph-loop-patterns/PROTOCOL.md`.

I wrote it on the Brooklyn-bound train at 11:40 PM, from a phone.

It was less a specification than a private apology — the things I had been doing implicitly, written down, because iOS had stopped letting me get away with them.

---

Day 22 was the origin. Day 23 was the iOS forcing function. This post is what was left over: five invariants, small enough to print on an index card.

---

**1. Every hat has exactly one exit event.**

A hat's `emit_event` field is the only way it terminates. If the session exits without the event, the orchestrator treats the session as failed and restarts with the same inputs.

The protocol punishes silent success identically to silent failure.

**2. Events are append-only. Facts are on disk.**

`.ralph/events/` is a directory of numbered JSON files, never deleted. Any hat, at any time, in any order, can reconstruct the state of the world from disk alone.

**3. Every transition is gated by an event, not a heuristic.**

`plan.complete` → Builder. `build.complete` → Reviewer. `review.verdict(issues>0)` → Fixer. The router is deterministic.

**4. The operator speaks in typed directives, not prose.**

`hat:`, `scope:`, `guidance:` (≤240 chars), `priority:`. Prose that does not parse is rejected at the bridge.

The laptop-side orchestrator accepts the same grammar the phone does, because removing typing on the laptop let me cheat, and cheating was the thing iOS took away.

**5. Convergence terminates the loop. Nothing else does.**

Reviewer emits zero critical findings → Converged. No iteration cap, no wall clock, no token budget. `max_iterations` is a safety rail, not a stopping rule.

---

What changed from the pre-iOS version:

**Pre-iOS:** when a review.verdict landed with two issues, I would sometimes intervene and route to Writer instead of Fixer because I had a hunch it was a docs issue. Worked when I was at the desk. Made the log non-deterministic for anyone else reading it.

**Post-iOS:** the hunch is illegal. If I want the route to go to Writer, I send `hat:writer scope:docs guidance:<why>` as a typed directive. The directive lands in the event log next to the verdict. Future-me can read exactly why the routing deviated.

The cost: I no longer get to cheat.

The benefit: the run is legible without me in the room.

---

Three things the protocol deliberately does not solve:

- **Consent races.** Last-write-wins on the event log if a phone directive and a laptop verdict land the same millisecond. Wants to be a lock on the hat, not a race on the log. Not built yet.
- **Offline reconciliation.** Phone rehydrates from disk when SSE reconnects. Good enough for now. Not good under spotty connectivity for long cycles.
- **Cross-project topology.** One `.ralph/` per task. Three Ralph loops in three worktrees have three event logs. If they ever need to coordinate, it is a different protocol.

---

Why this is a product, not just a post:

`agent-contracts` (OSS) is the extractable version — five invariants, one envelope, a schema validator at the event-write point, typed directive grammar, convergence predicate.

The product is the constraint. What the operator cannot do.

I have been running this for three weeks. Two operators other than me have used it on their own runs without asking what anything means.

That is the metric I care about.

---

Canonical post → https://withagents.dev/writing/day-24-ralph-protocol

The boulder never stops. The protocol is what keeps the boulder on the road.
