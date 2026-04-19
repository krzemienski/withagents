# X thread — Day 25

**1/12** (228 chars)
Two days. Four engineers. Nobody found the bug.

Then an 84-step sequential thinking chain traced it through 4 system layers to a single integer division that skipped a 44-byte WAV header.

One line. That was it.

**2/12** (234 chars)
The symptom: audio corruption affecting exactly 1 in 8 playbacks.

Not "sometimes." Exactly 12.5%.

That precision became the anchor constraint.

Random causes produce variable rates. A fixed ratio implies a fixed structural cause. The 1/8 was the clue.

**3/12** (240 chars)
4 architectural layers: React player, API gateway, CDN, PostgreSQL.

Standard playbook ate 2 days. 4 engineers checked all 4 layers. Everyone found something suspicious. Nobody found the bug.

The bug lived in the gaps between layers, not inside any one.

**4/12** (232 chars)
Fed the problem to the sequential thinking tool with one rule:

"Failure rate is exactly 12.5%. Root cause must produce exactly this ratio."

Phase 1 (steps 1-22): enumerate sources of "8" in system.
CDN has 8 edge servers. Audio chunks into 8. DB pool of 8.

**5/12** (237 chars)
Phase 2 (steps 23-46) was the breakthrough phase.

Step 23 killed *all* race condition theories at once. Not one theory. The entire category.

Race conditions produce variable rates. Fixed 1/8 = fixed cause.

Encoding bugs eliminated. Player bugs eliminated.

**6/12** (232 chars)
Phase 3 (steps 47-67): the trap of "unusual."

Step 47 found an unusual CDN byte-range caching policy. Felt like the answer. Most engineers would stop.

Step 48 revised: unusual is not root cause. CDN response is correct given its input.

Trace backward.

**7/12** (236 chars)
Phase 4 (steps 68-84): the root cause.

```
offset = file_size // 8
```

WAV files have a 44-byte header. Chunk 0 started at offset 0. Client got 44 bytes of header decoded as audio samples. Garbled.

8 chunks. 1 hit chunk 0. Exactly 12.5%.

**8/12** (228 chars)
The fix:

```
offset = (file_size - WAV_HEADER_SIZE) // 8 + WAV_HEADER_SIZE
```

One line. Seconds to write. 84 steps to find.

Almost all the work was in *finding* it. That is the shape of cross-layer bugs.

**9/12** (240 chars)
The methodology, three steps:

1. Hypothesize: specific, testable claim. "CDN is misconfigured" is not a hypothesis. "One of 8 CDN nodes returns incorrect Content-Range headers" is.
2. Test: make a prediction that would be true if it holds.
3. Revise or eliminate.

**10/12** (238 chars)
Constraint-based debugging eliminates *categories*, not individual hypotheses.

"12.5%" killed all race conditions in one step.

Stack enough constraints. Failure exactly 12.5% AND 4 layers AND audio-only. Search space collapses before you write a debugging line.

**11/12** (234 chars)
When not to think: some bugs need zero steps and a server restart.

Next.js 404. 34 minutes of sophisticated debugging. Fix: 2 seconds of Ctrl+C and `pnpm dev`. HMR cache.

Before sequential thinking: restart, clear cache, verify runtime = source.

**12/12** (238 chars)
327 sequential thinking invocations across 23,479 sessions. 1.4% of the time.

Right number. Precision instrument, not daily driver.

For the 1.4% where the bug spans layers and a quantitative constraint is in play, nothing else comes close.

https://withagents.dev/posts/day-25-sequential-thinking-debugging
