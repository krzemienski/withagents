# Validation across six products

For 90 days — January 19 through April 18 — I built six products against the same discipline: the real system or nothing.

ValidationForge. SessionForge. Ralph. Code Stories. ILS-iOS. Remodex.

Six products. Six terrains. The same rule in six different grammars.

---

**The rule, plainly:** a build that compiles is not a feature that works.

Every product exists because I kept running into the same failure mode — an agent reporting DONE on code that had never been exercised by a human, a simulator, or a real API call. The build passed. The test passed. The task closed. Nothing had actually run.

`block-test-files.js` fired 642 times across the series dataset. One session alone triggered 166 of those blocks. Each one was an agent trying to write a test file instead of running the product. Each one was the rule catching an attempt to fake the receipt.

---

How the rule showed up per product:

**ValidationForge** (10 days, 257 agent spawns, 310 files).
The rule as product. Compiled into the plugin: `<iron_rule>IF the real system doesn't work, FIX THE REAL SYSTEM. NEVER create mocks</iron_rule>`. 16 benchmark dirs A/B-test whether hooks change agent behavior versus prompts.

**SessionForge** (47 days, 378 spawns, 1,055 files).
The rule restated for receipts. If you cannot mine the logs, you cannot make the claim. SessionForge mines its own session JSONL — self-referential proof.

**Ralph** (64 days, 926 files, 336 MB).
The rule restated for termination. Reviewer emits zero critical findings → Converged. No confidence as a signal. Confidence and correctness don't correlate.

**Code Stories** (62 days, dual SKU).
The rule on a consumer product. Nick's voice note from the session log: "You need to functional val;idat the web app." (Typo exact. Sentence is the fix.)

**ILS-iOS** (52 days, 153 spawns, 2.39 GB).
The rule enforced by the tool surface. The MCP leaderboard for this project: `idb_tap` (2,193), `simulator_screenshot` (1,870). Reading Swift files is not validation.

**Remodex** (14 days, 180 spawns, 550 MB).
The rule across a process boundary. Phone prompts, Mac runs the agent, phone streams output. Multi-provider bridge. If the Mac's real agent process didn't run, the phone didn't see an answer.

---

Each product is the same three-layer response.

1. Make the shortcut unavailable (hooks, typed contracts, denylists)
2. Keep evidence on disk (screenshots, events, JSONL, traces)
3. Let the operator read the evidence, not the agent's summary

Three OSS repos come out of this: `agent-contracts`, `trace-timeline`, `context-layers`. One primitive per layer.

---

The uncomfortable part:

The rule is what prevents me from being wrong about which product I am actually shipping.

When an agent says DONE and the build is green, I am not shipping the feature. I am shipping the agent's claim about the feature, plus whatever trust the claim deserves.

If the claim rate is 95% accurate, every 20 shipped features includes one that does not work.

If you run 200 agents for 42 days, that is a lot of features being shipped blind.

---

What I do not know yet:

I do not know whether this generalizes past engineering products I build for myself. Six datapoints is six datapoints. The Operator UI and Runbooks pillars are my bet on a general answer. They have not been tested at scale outside my own work yet.

I also do not know the correct fix for the case where the real system is too expensive to run on every cycle. VF's benchmark matrix cost real dollars. A developer with a smaller budget gets a harder version of this problem. The protocol's honest answer — "run the real system anyway" — is a privileged answer. I do not have the cheaper version of it.

I want to build it.

---

The rule is the product. The products are the receipt.

Canonical → https://withagents.dev/writing/day-51-validation-across-6-products
