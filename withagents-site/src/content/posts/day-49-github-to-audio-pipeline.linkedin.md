# Five stages, two circuit breakers, $0.12 per run

94 seconds per repo, down to 31 seconds in batch. $0.12 per run, end to end.

That is `github-to-audio-pipeline`, the audio-content stack that turns a GitHub URL into a 30-minute playable narrative.

Five stages:

```
Extraction → Enrichment → Generation → Rendering → Distribution
  clone      Claude        script       TTS        CDN
  + analyze  analysis      writing      synthesis  upload
```

Each arrow is a typed JSON intermediate. `extraction.json` flows into Enrichment. `enrichment.json` into Generation. No stage calls the next one directly. Every stage is independently retriable, cacheable, replaceable.

---

Production timing:

| Stage | Median | P95 | Failure rate | Cost |
|---|---|---|---|---|
| Extraction | 8.2s | 14.1s | 0.3% | ~$0.00 |
| Enrichment | 22.4s | 38.7s | 2.8% | ~$0.05 |
| Generation | 12.1s | 19.3s | 1.1% | ~$0.02 |
| Rendering | 31.6s | 52.4s | 1.9% | ~$0.04 |
| Distribution | 4.8s | 9.2s | 0.4% | ~$0.01 |
| **Total** | **79.1s** | **133.7s** | — | **~$0.12** |

Two expensive fragile stages (Enrichment, Rendering) talk to external providers. Both are wrapped in circuit breakers: 3-failure threshold, 60s reset.

---

I tried a single-process pipeline first. One function. 600 lines. Worked on five test repos. Broke on the sixth because the repo had a 400MB LFS file the cloner pulled, Enrichment ran out of memory mid-analysis, and the whole process died — losing 14 seconds of Extraction work.

The rewrite inverted the cost. Each stage writes its result to disk as typed JSON before the next stage reads it. An out-of-memory death in Enrichment now costs ~22 seconds of Enrichment work, not the whole run. On retry, Extraction is cached. Pipeline picks up at Enrichment and is done inside a minute.

Caching is free because the intermediate format already exists. Stage skip logic is a single file-existence check. No cache library. No invalidation strategy beyond file mtime. The typed-JSON-between-stages pattern made caching incidental rather than a separate system.

---

The circuit breaker IS the failure budget.

```python
pipeline = Pipeline(stages=[
    ExtractionStage(),
    CircuitBreaker(EnrichmentStage(), failure_threshold=3, reset_timeout=60),
    GenerationStage(),
    CircuitBreaker(RenderingStage(), failure_threshold=3, reset_timeout=60),
    DistributionStage(cdn_bucket="my-audio-bucket"),
])
```

Real world: a ~7 minute ElevenLabs regional outage tripped the breaker on run 4 of a 50-repo batch. Runs 5-12 failed fast. Runs 13-50 queued behind reset. Batch completed 39 minutes later instead of 3 hours later. No partial artifacts left behind — Distribution never runs without Rendering output.

---

Intra-stage parallelism gets the 94s → 31s batch improvement. Extraction for repo N+1 starts while Enrichment for repo N runs. The cut is only safe because the typed-JSON intermediates give you a clear boundary — the "protocol" between stages is a file on disk.

---

`agent-sdk-podcast-gen` is the Generation stage. Three Claude agents chained:

1. Research agent reads `enrichment.json`, extracts subtopics.
2. Script writer converts outline into two-speaker dialogue with timing marks.
3. Editor polishes pacing, removes filler.

A three-hat rotation. Not a 12-agent orchestra. Matches Ralph's builder/writer/reviewer pattern: each hat sees only what it needs, writes only its section, hands off via a file.

---

This is what Day 50's Code Stories finale runs on. Six repos. Each under two minutes end-to-end. No mocked audio, no stubbed content, no partial failures left on disk. The narratives playing in the demo are actual agent output against actual code against actual TTS.

The real system, or nothing.

Canonical: https://withagents.dev/posts/day-49-github-to-audio-pipeline
Repos: https://github.com/krzemienski/github-to-audio-pipeline · https://github.com/krzemienski/agent-sdk-podcast-gen
