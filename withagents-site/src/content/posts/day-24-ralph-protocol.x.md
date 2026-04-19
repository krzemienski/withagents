# X thread — day-24-ralph-protocol

**Thread length:** 12 tweets. Char counts annotated per tweet.

---

**1/12** (239 chars)
The first time I wrote "the RALPH protocol" into a file, it was a 6-line README on the Brooklyn-bound train at 11:40 PM from a phone.

Less a specification than a private apology.

The things I had been doing implicitly, written down because iOS stopped letting me cheat.

---

**2/12** (181 chars)
Five invariants, small enough to print on an index card.

Day 22 was origin.
Day 23 was the iOS forcing function.
Day 24 is what was left over.

Here they are.

---

**3/12** (213 chars)
Invariant 1.

Every hat has exactly one exit event.

If a session exits without emitting its event, the orchestrator treats it as failed and restarts with the same inputs.

The protocol punishes silent success identically to silent failure.

---

**4/12** (176 chars)
Invariant 2.

Events are append-only. Facts are on disk.

.ralph/events/ is numbered JSON, never deleted. Any hat, at any time, can reconstruct the state of the world from disk.

---

**5/12** (188 chars)
Invariant 3.

Every transition is gated by an event, not a heuristic.

plan.complete → Builder
build.complete → Reviewer
review.verdict(issues>0) → Fixer
review.verdict(issues==0) → Converged

Router is deterministic.

---

**6/12** (235 chars)
Invariant 4.

The operator speaks in typed directives, not prose.

hat: scope: guidance:(≤240 chars) priority:

Prose that does not parse is rejected at the bridge. The laptop-side orchestrator accepts the same grammar the phone does, because removing typing on the laptop let me cheat.

---

**7/12** (209 chars)
Invariant 5.

Convergence terminates the loop. Nothing else does.

Reviewer emits zero critical findings → Converged.

No iteration cap, no wall clock, no token budget. max_iterations is a safety rail, not a stopping rule.

---

**8/12** (267 chars)
What changed from pre-iOS Ralph:

Pre-iOS: I could route review.verdict to Writer on a hunch if it felt like a docs issue. Worked at my desk. Made the log non-deterministic for anyone else.

Post-iOS: that hunch is illegal. It has to become a typed directive in the event log.

---

**9/12** (234 chars)
The cost of the protocol: I no longer get to cheat.

The benefit: the run is legible without me in the room.

Schema validation at the event-write point rejects incomplete payloads. Builder with missing files_modified gets retried with stricter instructions.

---

**10/12** (214 chars)
Three things the protocol deliberately does not solve:

- Consent races (last-write-wins, wants to be a hat lock)
- Offline reconciliation (spotty connectivity + long cycles)
- Cross-project topology (multi-loop coordination)

All on the list. None in v1.

---

**11/12** (216 chars)
Why this is a product, not a post.

agent-contracts (OSS) is the extractable version. Five invariants, one envelope, schema validator, typed directive grammar, convergence predicate.

The product is the constraint. What the operator cannot do.

---

**12/12** (203 chars)
I have been running this for 3 weeks.

Two operators other than me have used it on their own runs without asking me what anything means.

That is the metric I care about.

https://withagents.dev/writing/day-24-ralph-protocol
