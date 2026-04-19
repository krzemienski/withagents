**A `+=` operator shipped to iOS production past a single reviewer agent.**

Past my manual review. Past a green CI run.

Three days on-call. One streaming endpoint accumulating state it should have reset. Every fifth user in a session saw someone else's draft.

The fix was one character. Finding it cost three days.

The gate that should have caught it cost fifteen cents.

**The setup**

```swift
func appendChunk(_ chunk: String) {
    buffer += chunk
}
```

A junior reviewer approves it. A senior reviewer reading only the diff approves it. A single reviewer agent reading it in isolation approved it.

The bug surfaces only when three questions get asked at once: is `buffer` reset between requests, is `appendChunk` ever called concurrently, does the operator match the upstream type contract.

One reviewer, one lens. Three reviewers, three lenses.

**The consensus gate**

Three agents score the same diff against three lenses. A fourth aggregates with a unanimous-PASS rule:

- **Alpha** reads for operator and type consistency.
- **Bravo** reads for state lifecycle across request boundaries.
- **Lead** reads for docstring and spec alignment.

On the streaming bug, Alpha flagged the operator inconsistency. Bravo flagged the state hazard. Lead flagged a docstring saying "resets per-request" against code that no longer reset. Three independent flags. Any one would have blocked the merge.

The single-reviewer pass caught none of them.

**The numbers**

128 TeamCreate invocations across my series data. 75 TaskCreate operations per 10-gate iOS audit run. Roughly $0.15 per gate using Haiku for Alpha/Bravo and Sonnet for Lead aggregation. Even all-Sonnet keeps the gate under a dollar.

The most expensive P2 regression I shipped ate ~14 hours of direct work plus a support backlog plus a trust cost I cannot price.

Fifteen cents versus fourteen hours is not a close call.

**Why one reviewer is not enough**

The lens a reviewer brings is the lens they were told to bring. A prompt that says "check correctness" produces a reviewer that checks whatever its training surfaces for that word. A prompt that says "check state hazards across request boundaries" produces a reviewer that catches the state bug and misses the operator bug.

Consensus gates force the lens to be declared per agent. Alpha's prompt does not overlap with Bravo's. When Lead aggregates, a single FAIL blocks the merge. Unanimous PASS is the only gate that ships.

Across the 90 days after I moved iOS reviews onto the gate, zero `+=`-style operator bugs shipped past merge. The ones that tried got logged in `plans/reports/consensus-*-review.md` with the specific reviewer that caught each.

The minimum viable version is three prompts, three CLI invocations, and a shell script that exits non-zero unless all three return PASS. I built the typed version because prompt drift across runs became its own problem.

A design review with one architect and no dissenters is not a review. Agent consensus gates give you that second voice for fifteen cents and fifteen seconds.

Full writeup + code: https://withagents.dev/posts/day-08-three-agents-one-reviewer
