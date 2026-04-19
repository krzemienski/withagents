# X Thread — Post 2

**Tweet 1:** A single AI agent reviewed my streaming code and said "looks correct."

Three agents found a P2 bug on line 926 that'd been hiding for three days.

One character: `+=` instead of `=`. Every streamed message was doubling itself.

**Tweet 2:** The bug in context:

```swift
message.text += textBlock.text
```

Should've been `=`. The API sends the full accumulated message each chunk, not a delta. So `+=` doubled everything.

"Hello" rendered as "HHeHelHello" in under a second of streaming.

**Tweet 3:** Solo agent review: pass. Code was syntactically valid. Types correct. Protocol conformance complete.

Three agents with different review mandates: three independent FAIL votes, each from a different angle.

Same code. Same reviewer model. Different roles.

**Tweet 4:** Alpha does line-by-line logic. Found the `+=` because the API docs say each block is cumulative.

Bravo thinks about runtime. Found the stream-end handler resetting the index to zero, replaying every message.

Lead does architecture. Noticed both SDK and CLI paths shared the bug.

**Tweet 5:** Unanimous voting. Not majority. Any agent raises a concern, the gate blocks.

False positive rate: ~8%. Cost: $0.15 per gate, re-review adds minutes.
False negative cost: three days of corrupted messages and trust you can't buy back.

Asymmetric penalty means conservative wins.

**Tweet 6:** Then there was the Frankenstein merge.

Agent A built JWT verification internals. Agent B built the REST endpoint layer. Neither knew the other existed.

The merge compiled clean. Shipped JWT signature validation state as a public REST endpoint. Unauthenticated.

**Tweet 7:** File ownership maps fixed that class of bug before it happened:

```python
ownership = {
  "auth-agent": ["src/auth/*"],
  "api-agent":  ["src/routes/*"],
}
```

Two agents literally cannot edit the same file. The filesystem enforces what prompts can't.

**Tweet 8:** One iOS audit session ran 10 consensus gates across 6 phases. 75 TaskCreate operations in a single validation pass.

Alpha ran 18 cURL tests. Bravo captured 23 screenshots. Lead cross-checked SDK and CLI paths. All parallel. Wall clock = slowest agent.

**Tweet 9:** Ralplan extended this to planning. A Supabase auth migration came back from the Planner with 14 clean tasks.

The Architect vetoed 7 of them. RLS policies use `auth.uid()`, not custom JWT claims. Would've compiled, would've silently leaked user data.

**Tweet 10:** Three rounds of adversarial review cost under $2.

Shipping a silent auth bypass cost whatever a data breach costs. I don't want to think about the number.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
