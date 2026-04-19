# X thread — Day 08

**1/9** (234 chars)
A `+=` operator shipped to iOS production past a single reviewer agent.

Past my manual review. Past green CI.

Three days on-call. One streaming endpoint accumulating state across requests it should have reset.

The fix was one character.

**2/9** (225 chars)
```swift
func appendChunk(_ chunk: String) {
    buffer += chunk
}
```

A junior reviewer approves it.
A senior reading only the diff approves it.
A single reviewer agent in isolation approved it.

One reviewer, one lens.

**3/9** (241 chars)
The bug surfaces only when three questions get asked at once:

1. Is `buffer` reset between requests?
2. Is `appendChunk` ever called concurrently?
3. Does the operator match the upstream type contract?

No single reviewer with a single prompt catches all three.

**4/9** (237 chars)
The fix: a consensus gate.

3 agents, 3 declared lenses, 1 aggregator with a unanimous-PASS rule.

Alpha: operator + type consistency
Bravo: state lifecycle across request boundaries
Lead: docstring vs code alignment

Any one FAIL blocks the merge.

**5/9** (231 chars)
On the streaming bug:

Alpha flagged the operator inconsistency.
Bravo flagged the state hazard.
Lead flagged a docstring saying "resets per-request" against code that no longer reset.

3 independent flags. The prior single-reviewer pass caught 0.

**6/9** (228 chars)
The cost:

$0.15 per gate (Haiku for Alpha/Bravo, Sonnet for Lead).
<$1 if everything is Sonnet.
~15 seconds per run.

The P2 regression it caught the first time: 14 hours of direct work, a support backlog, and trust cost I cannot price.

**7/9** (238 chars)
Why one reviewer is not enough:

The lens a reviewer brings is the lens they were told to bring.

Prompt says "check correctness" → reviewer checks whatever training pulls up.
Prompt says "check state across requests" → reviewer catches that, misses the rest.

**8/9** (236 chars)
Across 90 days after I moved iOS reviews onto the gate: zero `+=`-style operator bugs shipped past merge.

The ones that tried got logged in `plans/reports/consensus-*-review.md` with the specific reviewer that caught each.

128 TeamCreate calls in my data.

**9/9** (230 chars)
The minimum viable version: 3 prompts, 3 CLI calls, 1 shell script that exits non-zero unless all 3 PASS.

A review with one architect and no dissenters is not a review.

Full writeup + repo: https://withagents.dev/posts/day-08-three-agents-one-reviewer
