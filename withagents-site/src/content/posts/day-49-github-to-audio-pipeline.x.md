# X Thread — Day 49: github-to-audio pipeline

**1/12 (229)**
94 seconds per repo. 31 seconds in batch.
$0.12 per run, end to end.

Five stages. Two circuit breakers. One typed JSON contract at every seam.

That's github-to-audio-pipeline — the audio stack that feeds tomorrow's Code Stories finale.

**2/12 (265)**
The five stages:

Extraction → Enrichment → Generation → Rendering → Distribution
(clone)      (Claude)     (script)     (TTS)       (CDN)

Each arrow is a typed JSON file. extraction.json → Enrichment. enrichment.json → Generation.

No stage calls the next directly. Every stage is independently retriable.

**3/12 (245)**
Production timing:

Extraction:   8.2s med / 14.1s P95 / 0.3% fail / ~$0
Enrichment:  22.4s med / 38.7s P95 / 2.8% fail / ~$0.05
Generation:  12.1s med / 19.3s P95 / 1.1% fail / ~$0.02
Rendering:   31.6s med / 52.4s P95 / 1.9% fail / ~$0.04
Distribution: 4.8s med / 9.2s P95 / 0.4% fail / ~$0.01

**4/12 (227)**
Two expensive fragile stages (Enrichment, Rendering) talk to external providers.

Both wrapped in circuit breakers: 3-failure threshold, 60s reset.

The other three are local — clone, script against enriched tree, CDN upload. Failure rates are rounding errors.

**5/12 (261)**
I tried a single-process pipeline first.

600-line function. Worked on 5 test repos. Broke on the 6th — repo had a 400MB LFS file, Enrichment OOM'd mid-analysis, whole process died.

Lost 14 seconds of Extraction work on every retry.

**6/12 (259)**
The rewrite: each stage writes its result to disk as typed JSON before the next reads it.

OOM death in Enrichment now costs ~22s of Enrichment work. Not the whole run. On retry, Extraction is cached. Pipeline resumes at Enrichment, done inside a minute.

**7/12 (238)**
Caching is free because the intermediate format already exists as durable artifact.

Stage-skip logic: single file-existence check.
No cache library. No invalidation beyond file mtime.

Typed-JSON-between-stages made caching incidental, not a system.

**8/12 (268)**
Real-world breaker test: ~7 minute ElevenLabs regional outage during a 50-repo batch.

Run 4 tripped the breaker. Runs 5-12 failed fast. Runs 13-50 queued behind reset.

Batch completed 39 minutes later. Not 3 hours. No partial artifacts left behind.

**9/12 (248)**
The 94s → 31s batch win is intra-stage parallelism.

Extraction for repo N+1 starts while Enrichment for repo N runs.

The cut is only safe because typed-JSON intermediates are a clear boundary. The "protocol" between stages is a file on disk.

**10/12 (256)**
Generation stage = agent-sdk-podcast-gen. Three chained Claude agents:

1/ Research reads enrichment.json, extracts subtopics
2/ Script writer turns outline into two-speaker dialogue with timing marks
3/ Editor polishes pacing, removes filler

Three-hat rotation. Not a 12-agent orchestra.

**11/12 (269)**
Matches Ralph's builder/writer/reviewer pattern.

Each hat sees only what it needs. Writes only its section. Hands off via a file.

Convergence checking at the script-writer stage by length + speaker-balance constraints. Editor agent downstream handles correction cheaper than a separate reviewer.

**12/12 (216)**
Day 50 Code Stories finale runs on this pipeline.

Six repos. Each under 2 minutes end-to-end. No mocked audio. No stubbed content. No partial failures on disk.

The real system, or nothing.

https://withagents.dev/posts/day-49-github-to-audio-pipeline
