## Featured in

**"Five stages, two circuit breakers, one repo becomes a narrative" — withagents.dev Day 49.**
The stage-isolation discipline behind github-to-audio-pipeline and agent-sdk-podcast-gen: typed JSON between every stage, circuit breakers on every external call, file-system-as-protocol caching, and the 94s → 31s batch improvement from intra-stage parallelism. The load-bearing infrastructure behind Day 50's Code Stories finale.

Read: https://withagents.dev/posts/day-49-github-to-audio-pipeline

- github-to-audio-pipeline: Extraction → Enrichment → Generation → Rendering → Distribution. $0.12/run. 2.8% Enrichment failure rate absorbed by circuit breaker.
- agent-sdk-podcast-gen: 3-agent Claude chain (Research → Script → Editor) for the Generation stage.
