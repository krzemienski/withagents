# Three agents found the bug one agent missed

One agent reviewed my streaming code and said looks correct.

Three agents found a P2 bug on line 926 that had been hiding for three days.

That gap is why every code change in this system now goes through a unanimous consensus gate before it ships.

---

**The bug**

```swift
message.text += textBlock.text
```

Should have been:

```swift
message.text = textBlock.text
```

One character. The Claude streaming API sends full accumulated messages, not deltas. So `+=` doubled every block. A five-sentence response turned into a wall of duplicated text.

A solo agent reviewed the module. Read top to bottom. Checked types. Verified protocol conformance. Green.

Three agents with different mandates found it in under a minute.

---

**Three roles, not three copies**

Running three identical agents gives you three copies of the same blind spot. The real pattern is three roles, each with a different review mandate.

**Lead** — architecture and cross-component consistency. Found that both the SDK and CLI paths shared the flawed handler.

**Alpha** — line-by-line logic. Found the `+=` because the API contract says each block contains the full message so far.

**Bravo** — runtime behavior. Ran the app, sent "What is 2+2?", saw "Four.Four." render during streaming.

Lead found the scope. Alpha found the line. Bravo found the symptom. None was enough alone.

---

**The gate**

Unanimous voting. Any agent raises a concern, the gate blocks.

False positive: gate blocks a valid change. Costs five minutes and about $0.15 for re-review.

False negative: gate ships the `+=` bug. Costs three days of corrupted messages and user trust you cannot buy back.

Every design choice leans toward the first failure mode. Distinct mandates. Full re-validation after fixes. Three fix cycles before escalating to a human.

False positive rate runs around 8%. The bugs the other 92% catches would have shipped.

---

**The Frankenstein merge**

Two agents working on the same backend service. Agent A built JWT verification. Agent B built the REST endpoint layer. Neither knew the other existed.

The merge compiled clean. Linter passed. The application served raw JWT verification internals as an unauthenticated REST endpoint.

A security vulnerability that passed every static check because each contribution was individually correct. The bug lived in the gap between two agents' assumptions.

File ownership via glob patterns now prevents this. Two agents cannot edit the same file. When they genuinely need to, the lead makes the change and distributes the result.

---

**When to use consensus**

**Always**: shared state, auth, data persistence, streaming, cross-module interfaces, anything involving security or user data.

**Skip**: typo fixes, log lines, single-file changes with zero behavioral impact.

**Know the limit**: for work where no agent has relevant experience, three agents agreeing does not mean they are right. Still thinking about how to flag that.

---

**Try it**

```bash
pip install multi-agent-consensus
consensus run --target ./your-project
```

Repo + working examples: github.com/krzemienski/multi-agent-consensus

The framework is the simple part. The disagreement is the thing worth keeping.

---

Read the full write-up on withagents.dev: https://withagents.dev/writing/day-02-multi-agent-consensus
