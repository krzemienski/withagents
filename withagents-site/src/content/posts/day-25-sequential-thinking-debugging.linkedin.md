**Two days. Four engineers. Nobody found the bug.**

Then an 84-step sequential thinking chain traced it through four system layers to a single integer division that skipped a 44-byte WAV header.

One line. That was it.

**The bug nobody could find**

Audio corruption affecting exactly 1 in 8 playbacks. Not "sometimes." Exactly 12.5%.

That precision became the anchor constraint that cracked the case.

The standard playbook ate two days. Four engineers checked the audio encoder, CDN config, React player, PostgreSQL metadata store. Everyone found something suspicious. Nobody found the bug.

**Constraint first**

I fed the problem to Claude Code's sequential thinking MCP tool with one rule: "The failure rate is exactly 12.5%, which is 1/8. The root cause must produce exactly this ratio."

**Phase 1 (steps 1-22): establishing the constraint.** What creates an 8-state cycle? CDN has 8 edge servers. Audio chunking splits files into 8 segments. DB connection pool has 8 connections. Three sources of "8."

**Phase 2 (steps 23-46): category elimination.** Step 23 killed *all* race condition theories at once. Race conditions produce variable rates. Fixed 1/8 ratio means fixed cause. One step, dozens of hypotheses gone. Encoding bugs affect all plays, not 12.5%. Player bugs would show in debug output. Client category eliminated.

**Phase 3 (steps 47-67): the trap of "unusual."** Step 47 found an unusual CDN byte-range caching policy. "Unusual" felt like "root cause." Most engineers would have stopped. Step 48 was the revision: unusual is not root cause. The CDN response was correct given the offset it received. Wrong question. Tracing backward.

**Phase 4 (steps 68-84): the root cause.**

```python
# BEFORE, the bug
offset = file_size // 8
```

WAV files have a 44-byte header. Chunk 0 started at offset 0. Client got 44 bytes of header bytes decoded as audio samples. Garbled. With 8 chunks, exactly 1 in 8 requests hit chunk 0. Exactly 12.5%.

```python
# AFTER, skip the header
offset = (file_size - WAV_HEADER_SIZE) // 8 + WAV_HEADER_SIZE
```

One line. The fix took seconds. Finding it took 84 steps across four layers.

**The methodology**

Hypothesize. Test. Eliminate or revise.

"The CDN is misconfigured" is not a hypothesis. "One of 8 CDN nodes returns incorrect Content-Range headers, causing 12.5% of requests to receive garbled audio" is.

Specific enough to test. Specific enough to eliminate.

Constraint-based debugging eliminates *categories*, not individual hypotheses. That is the multiplier.

**When not to think**

Not every bug needs 84 steps. Some need zero steps and a server restart.

A Next.js 404 that burned 34 minutes of sophisticated debugging got fixed in 2 seconds of `Ctrl+C` and `pnpm dev`. HMR cache. New route file not in in-memory route table.

Before reaching for sequential thinking: restart the process, clear caches, verify runtime matches source.

**The number**

327 sequential thinking invocations across 23,479 sessions. 1.4% of the time.

That is the right number. Precision instrument, not daily driver. For the 1.4% where the bug spans multiple layers and a quantitative constraint is in play, nothing else comes close.

The four engineers who spent two days were not less skilled. They were less structured. Sequential thinking found the bug because it forced all four layers into a single chain of reasoning.

Full writeup + working framework: https://withagents.dev/posts/day-25-sequential-thinking-debugging
