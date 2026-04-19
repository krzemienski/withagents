# X thread — day-02-multi-agent-consensus

**Tweet 1 (263 chars)**

one agent reviewed my streaming code and said looks correct.

three agents found a P2 bug on line 926 that had been hiding for three days.

that gap is why every code change in this system goes through a unanimous consensus gate now.

thread /

---

**Tweet 2 (217 chars)**

the bug:

```swift
message.text += textBlock.text
```

should have been `=`, not `+=`.

the Claude streaming API sends full messages, not deltas. so `+=` doubled every block. "Hello" became "HHeHelHello".

---

**Tweet 3 (204 chars)**

a solo agent reviewed the module.

read top to bottom. checked types. verified protocol conformance. green.

three agents with different review mandates found it in under a minute. same code. same build. different lenses.

---

**Tweet 4 (277 chars)**

three roles, not three copies.

three identical agents = three copies of the same blind spot.

• Lead: architecture + cross-component consistency
• Alpha: line-by-line logic
• Bravo: runtime behavior

Lead found the scope. Alpha found the line. Bravo ran the app and saw "Four.Four."

---

**Tweet 5 (268 chars)**

unanimous voting. any agent raises a concern, the gate blocks.

false positive: valid change blocked for re-review. ~$0.15, five minutes.
false negative: ship the += bug. three days of corrupted messages.

every design choice leans toward the first failure mode.

---

**Tweet 6 (251 chars)**

the Frankenstein merge:

two agents built separate pieces of a backend. merge compiled clean. linter passed.

the service served raw JWT verification internals as an unauthenticated REST endpoint.

each contribution was individually correct. the gap was the bug.

---

**Tweet 7 (239 chars)**

false positive rate runs around 8%.

the bugs the other 92% catches would have shipped: the += accumulation, the Frankenstein JWT exposure, a Supabase RLS gap that would have let any user read everyone else's data.

$0.15 per gate. $0.60 per pipeline.

---

**Tweet 8 (226 chars)**

when to skip it:

• typo fixes
• log lines
• single-file changes with zero behavioral impact

when to always use it:

• shared state, auth, data persistence
• streaming
• multi-agent merges
• security / user data / payments

---

**Tweet 9 (256 chars)**

the limit i don't have a clean answer for:

novel domains where no agent has relevant experience. three agents can all be confidently wrong together.

maybe a novelty detector that flags when all three seem too certain on unfamiliar territory. still thinking.

---

**Tweet 10 (218 chars)**

```bash
pip install multi-agent-consensus
consensus run --target ./your-project
```

repo + streaming-audit example that caught line 926:

github.com/krzemienski/multi-agent-consensus

the framework is simple. the disagreement is the thing worth keeping.

---

**Tweet 11 (194 chars)**

full write-up on withagents.dev with the mermaid sequence diagram, the gate JSON output, and the Supabase auth rescue:

withagents.dev/writing/day-02-multi-agent-consensus

next: functional validation, for the bugs three agents still miss.
