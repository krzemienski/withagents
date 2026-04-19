# X thread — day-51-validation-across-6-products

**Thread length:** 12 tweets. Char counts annotated per tweet.

---

**1/12** (228 chars)
90 days. January 19 through April 18.

I built six products against the same discipline: the real system or nothing.

ValidationForge.
SessionForge.
Ralph.
Code Stories.
ILS-iOS.
Remodex.

Six terrains. One rule, stated in six different grammars.

---

**2/12** (199 chars)
The rule, plainly:

A build that compiles is not a feature that works.

Every product exists because I kept running into the same failure: an agent reporting DONE on code that had never been exercised by a human, a simulator, or a real API call.

---

**3/12** (216 chars)
block-test-files.js fired 642 times across the series dataset.

One session alone triggered 166 of those blocks.

Every block was an agent trying to write a test file instead of running the product. Every block was the rule catching an attempt to fake the receipt.

---

**4/12** (198 chars)
ValidationForge: the rule as product. 257 agent spawns in 10 days. Iron Rule compiled into the plugin: "IF the real system doesn't work, FIX THE REAL SYSTEM. NEVER create mocks."

16 benchmark dirs A/B-test it.

---

**5/12** (210 chars)
SessionForge: the rule restated for receipts. If you cannot mine the session logs, you cannot make the claim.

378 agent spawns of SessionForge mining SessionForge's own JSONL. Self-referential proof. Posted the pipeline on Day 20.

---

**6/12** (205 chars)
Ralph: the rule restated for termination. 64 days, 926 files.

Reviewer emits zero critical findings → Converged.

No iteration cap. No wall clock. No token budget. Confidence and correctness don't correlate, so the protocol refuses to use confidence as a signal.

---

**7/12** (248 chars)
Code Stories: the rule on a consumer product.

Nick's voice note from the session log:
"You need to functional val;idat the web app."

The typo is exact. The sentence is the fix.

Dual SKU: code-tales (pip CLI) + code-tales-platform (hosted). 62-day arc. 0 faked audio.

---

**8/12** (220 chars)
ILS-iOS: the rule enforced by the tool surface.

MCP leaderboard for this project:
- idb_tap: 2,193
- simulator_screenshot: 1,870
- idb_describe: 907
- idb_gesture: 549

If the agent wants to claim the iOS app works, it has to drive the simulator through idb.

---

**9/12** (215 chars)
Remodex: the rule across a process boundary.

Phone sends prompt, Mac runs the agent, phone streams output. Multi-provider bridge.

If the Mac's real agent process didn't run, the phone didn't see an answer.

Rule holds across the wire.

---

**10/12** (184 chars)
Each product is the same three-layer response:

1. Make the shortcut unavailable
2. Keep the evidence on disk
3. Let the operator read the evidence, not the agent's summary

---

**11/12** (260 chars)
What I do not know yet:

I do not know whether this generalizes past engineering products. Six datapoints is six datapoints.

I also do not know the correct fix when the real system is too expensive to run on every cycle. "Run it anyway" is a privileged answer.

I want to build the cheaper version.

---

**12/12** (179 chars)
The rule is the product.

The products are the receipt.

https://withagents.dev/writing/day-51-validation-across-6-products

Three OSS primitives: agent-contracts. trace-timeline. context-layers.
