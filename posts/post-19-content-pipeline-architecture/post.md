---
title: "The Five-Stage Pattern: Architecting AI Content Pipelines That Actually Ship"
subtitle: "How stage isolation, intermediate formats, and circuit breakers turn fragile AI chains into production content systems"
author: "Nick Krzemienski"
date: "2025-03-01"
series_number: 19
series_total: 61
github_repo: "https://github.com/krzemienski/github-to-audio-pipeline"
tags:
  - PipelineArchitecture
  - ContentGeneration
  - SystemDesign
  - AgenticDevelopment
  - Production
---

Every AI content pipeline I built before session 4,200 was a straight line. Input goes in one end, Claude processes it, output comes out the other end. And every single one broke the same way: one stage fails, the entire pipeline collapses, and you're staring at a partial result that's useless to retry because you can't tell where it went wrong.

The fix wasn't better prompts or a more reliable model. The fix was an architecture pattern borrowed from data engineering that I should have adopted from day one: stage isolation with typed intermediate formats.

## TL;DR

Production AI content pipelines need five isolated stages — Extraction, Enrichment, Generation, Rendering, Distribution — connected by JSON intermediate formats, not direct function calls. Each stage reads a schema, writes a schema, and knows nothing about its neighbors. Circuit breakers prevent cascade failures. Batching and parallel execution within stages cut latency by 60-70%. The intermediate formats matter more than the stages themselves, because they're what make retry, debugging, and stage replacement possible.

---

## The Straight-Line Pipeline Problem

Here's what the naive version looks like. I know because I built it three times before learning:

```python
def generate_content(source_url: str) -> AudioFile:
    repo = clone_repo(source_url)
    analysis = claude_analyze(repo)
    script = claude_write_script(analysis)
    audio = elevenlabs_synthesize(script)
    return upload_to_cdn(audio)
```

Five function calls. Clean, readable, obviously correct. And catastrophically fragile.

When `claude_write_script` fails on step 3 — and it will, because LLM calls fail about 2-3% of the time in production — you lose everything. The clone is gone. The analysis is gone. You have to restart from scratch. For a pipeline that takes 90 seconds end to end, that's 60 seconds of wasted compute to redo stages that already succeeded.

Worse, you can't tell *why* it failed. Was the analysis malformed? Did the script generation prompt hit a token limit? Was the repo too large for the context window? The straight-line pipeline gives you one error message and zero diagnostic context.

After 62 sessions on the code-tales-ios project, I extracted a pattern that solved all of this. The pattern isn't specific to audio generation — I've since applied it to documentation pipelines, changelog generators, and a commit-to-newsletter system. The architecture is the same every time.

---

## Five Stages, Five Boundaries

```mermaid
graph LR
    E[Extraction] -->|extraction.json| EN[Enrichment]
    EN -->|enrichment.json| G[Generation]
    G -->|generation.json| R[Rendering]
    R -->|rendering.json| D[Distribution]

    style E fill:#6366f1,color:#fff
    style EN fill:#6366f1,color:#fff
    style G fill:#6366f1,color:#fff
    style R fill:#6366f1,color:#fff
    style D fill:#6366f1,color:#fff
```

**Extraction** pulls raw material from the source. For a GitHub-to-audio pipeline, that's cloning a repo and collecting file contents, commit history, README, and dependency metadata. For a documentation pipeline, it might be scraping API endpoints. The stage knows how to get data. It knows nothing about what happens to that data afterward.

**Enrichment** is where AI enters. Claude analyzes the extracted material — identifies architectural patterns, summarizes key decisions, flags interesting code. This is the most failure-prone stage because it depends on an external LLM API. It's also the most expensive. Isolating it means you never pay for it twice when a downstream stage fails.

**Generation** transforms enriched data into the target format. A narrative script for audio. Markdown for documentation. HTML for a newsletter. This stage is deterministic given its input — same enrichment data produces the same output. That determinism is a feature.

**Rendering** converts the generated format into its final medium. Text-to-speech synthesis. Markdown-to-PDF conversion. HTML-to-email formatting. Often involves a third-party API (ElevenLabs, Pandoc, a mail service).

**Distribution** delivers the rendered artifact. CDN upload, RSS feed update, email send, webhook notification. The last mile.

The names don't matter. What matters is the principle: each stage reads a typed intermediate format and writes a typed intermediate format. No stage calls another stage directly. No stage knows what produced its input or what consumes its output.

---

## The Intermediate Format Is the Architecture

Here's the insight that took me embarrassingly long to internalize: **the schemas between stages are more important than the stages themselves.**

Stages are replaceable. You can swap Claude for GPT for the enrichment stage. You can swap ElevenLabs for a local TTS model in rendering. But the intermediate format is the contract that makes the whole pipeline composable.

```python
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

@dataclass(frozen=True)
class ExtractionResult:
    source_url: str
    extracted_at: datetime
    files: list[FileContent]
    commits: list[CommitSummary]
    readme: Optional[str]
    languages: dict[str, int]  # language -> line count
    dependencies: list[Dependency]
    metadata: dict[str, str]

@dataclass(frozen=True)
class EnrichmentResult:
    source_url: str
    enriched_at: datetime
    extraction_hash: str  # links back to extraction
    architecture_summary: str
    key_patterns: list[PatternAnalysis]
    complexity_score: float
    notable_decisions: list[str]
    suggested_narrative_angle: str
    token_usage: TokenMetrics

@dataclass(frozen=True)
class GenerationResult:
    source_url: str
    generated_at: datetime
    enrichment_hash: str
    format: str  # "script", "markdown", "html"
    content: str
    word_count: int
    estimated_duration_seconds: Optional[int]
    sections: list[SectionBreakdown]
```

Every intermediate type is frozen — immutable once created. Every type includes a timestamp and a hash linking it to its predecessor. Every type is serializable to JSON.

That hash chain is what makes retry possible. When the rendering stage fails, I can look at the `GenerationResult` on disk, verify its `enrichment_hash` matches the stored `EnrichmentResult`, and rerun just the rendering stage. No recloning. No re-enriching. Just the failed step.

The schema also serves as documentation. A new engineer reading `EnrichmentResult` immediately understands what the enrichment stage produces without reading the enrichment code. The intermediate format is the API contract between stages.

---

## Stage Interface: The One Abstraction That Matters

Every stage implements the same interface:

```python
from abc import ABC, abstractmethod
from typing import TypeVar, Generic

I = TypeVar("I")  # Input type
O = TypeVar("O")  # Output type

class PipelineStage(ABC, Generic[I, O]):
    @abstractmethod
    def execute(self, input_data: I) -> O:
        """Transform input to output. Must be idempotent."""
        ...

    @abstractmethod
    def validate_input(self, input_data: I) -> list[str]:
        """Return list of validation errors. Empty = valid."""
        ...

    def can_retry(self, error: Exception) -> bool:
        """Whether this error is retryable. Default: True for transient errors."""
        return isinstance(error, (TimeoutError, ConnectionError, RateLimitError))

    def estimated_cost(self, input_data: I) -> float:
        """Estimated cost in USD. Used for budget gates."""
        return 0.0
```

Four methods. `execute` does the work. `validate_input` catches malformed data before the stage burns compute. `can_retry` distinguishes transient failures (network timeout) from permanent ones (invalid API key). `estimated_cost` enables budget gates — if the enrichment stage estimates $0.45 for a large repo, the pipeline runner can require confirmation before proceeding.

The `validate_input` method is worth emphasizing. In 62 sessions, roughly 40% of stage failures were caused by the *previous* stage producing subtly malformed output — a summary that exceeded the next stage's context window, a dependency list with null entries, a commit history with encoding errors. Catching those at the boundary, before the expensive work starts, saves both time and money.

---

## Circuit Breakers: Graceful Degradation, Not Pipeline Collapse

The enrichment stage calls Claude. Claude's API has maybe 97-98% availability in practice. For a pipeline that runs dozens of times a day, that 2-3% failure rate means multiple failures per day. Without protection, each failure kills the entire pipeline run.

Circuit breakers solve this:

```python
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, reset_timeout: int = 60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure_time: Optional[float] = None
        self.state = "closed"  # closed = normal, open = failing, half_open = testing

    def call(self, stage: PipelineStage, input_data):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = "half_open"
            else:
                return self._fallback(stage, input_data)

        try:
            result = stage.execute(input_data)
            self._on_success()
            return result
        except Exception as e:
            if stage.can_retry(e):
                self._on_failure()
                if self.failure_count >= self.failure_threshold:
                    self.state = "open"
                    return self._fallback(stage, input_data)
                return self.call(stage, input_data)  # retry
            raise  # non-retryable errors propagate immediately

    def _fallback(self, stage, input_data):
        """Produce degraded output instead of failing entirely."""
        if isinstance(stage, EnrichmentStage):
            return EnrichmentResult(
                source_url=input_data.source_url,
                enriched_at=datetime.now(),
                extraction_hash=hash_of(input_data),
                architecture_summary="[Enrichment unavailable — using extraction summary]",
                key_patterns=[],
                complexity_score=0.0,
                notable_decisions=[],
                suggested_narrative_angle="general overview",
                token_usage=TokenMetrics.zero(),
            )
        raise StageUnavailableError(stage)
```

The key design choice: the fallback produces a *valid* `EnrichmentResult` with degraded content, not an error. Downstream stages can still run. The generated script will be less insightful — it won't have architectural analysis or pattern detection — but it will exist. A degraded audio story about a repo is better than no audio story.

This is a real tradeoff. Some pipelines should fail hard when enrichment fails — if you're generating medical documentation, a degraded enrichment might produce dangerous output. The circuit breaker pattern gives you the hook to make that decision per-stage and per-pipeline.

---

## Throughput: Batching and Parallel Execution

The naive sequential pipeline for code-tales processed one repository at a time: extract, enrich, generate, render, distribute. End-to-end latency was about 94 seconds per repo.

Two optimizations cut that dramatically.

**Intra-stage parallelism.** Extraction can clone and analyze multiple repos simultaneously. Rendering can synthesize multiple audio segments in parallel. Distribution can upload multiple files concurrently. Each stage internally parallelizes its work:

```python
async def batch_execute(
    stage: PipelineStage,
    items: list,
    max_concurrency: int = 5
) -> list:
    semaphore = asyncio.Semaphore(max_concurrency)
    async def bounded_execute(item):
        async with semaphore:
            return await asyncio.to_thread(stage.execute, item)
    return await asyncio.gather(*[bounded_execute(item) for item in items])
```

**Inter-stage pipelining.** While the enrichment stage processes repo B, the extraction stage is already working on repo C. Stages overlap in time rather than waiting for the full batch to complete:

```
Time -->
Extraction:  [A][B][C][D]
Enrichment:     [A][B][C][D]
Generation:        [A][B][C][D]
Rendering:            [A][B][C][D]
```

Combined, these brought batch throughput from 94 seconds per repo (sequential) to about 31 seconds per repo when processing batches of 10. The enrichment stage remained the bottleneck — Claude API calls can't be parallelized as aggressively as file I/O — but even there, 3-5 concurrent requests were sustainable without hitting rate limits.

The cost optimization was equally important. Enrichment is by far the most expensive stage — roughly $0.03-0.08 per repo depending on size. The intermediate format made it trivial to cache: if the `extraction_hash` hasn't changed (same repo, same commit), skip enrichment entirely and reuse the previous `EnrichmentResult`. For repos that update infrequently, this cut enrichment costs by about 70%.

---

## Real Numbers from Production

After stabilizing the pipeline architecture across 62 sessions on code-tales-ios, here's what the stage timing breakdown looked like for a typical medium-sized repository (50-200 files):

| Stage | Median Latency | P95 Latency | Failure Rate | Cost/Run |
|-------|---------------|-------------|--------------|----------|
| Extraction | 8.2s | 14.1s | 0.3% | ~$0.00 |
| Enrichment | 22.4s | 38.7s | 2.8% | ~$0.05 |
| Generation | 12.1s | 19.3s | 1.1% | ~$0.02 |
| Rendering | 31.6s | 52.4s | 1.9% | ~$0.04 |
| Distribution | 4.8s | 9.2s | 0.4% | ~$0.01 |
| **Total** | **79.1s** | **133.7s** | — | **~$0.12** |

The enrichment stage has the highest failure rate and the highest cost. The rendering stage has the highest latency variance — ElevenLabs synthesis time varies significantly with script length and voice complexity. Distribution is the most reliable because CDN uploads are a solved problem.

The circuit breaker fired 14 times across about 500 pipeline runs over a three-week period. In 11 of those cases, it was a transient Claude API timeout that resolved on the next attempt. In 3 cases, the circuit opened fully and produced degraded output. Users received those degraded stories without complaint — the extraction-only narrative was less detailed but still coherent.

---

## When to Use This Pattern

Not every AI transformation needs five stages. But every AI transformation that runs more than once needs **stage isolation**.

The minimum viable version is three stages: Extract, Transform, Load. If your transform uses an LLM, add a circuit breaker. If your pipeline processes batches, add intermediate format caching.

The full five-stage pattern pays off when:
- Multiple stages involve external API calls (each is a failure point)
- You need to retry individual stages without rerunning the whole pipeline
- Different stages have different cost profiles and you want to cache expensive ones
- You're iterating on one stage (e.g., improving the generation prompt) without touching the others
- Multiple output formats share the same extraction and enrichment (audio + newsletter from the same enriched data)

That last point is the real unlock. Once enrichment data is cached in a typed intermediate format, you can build *multiple* generation stages that consume the same enrichment. One generates audio scripts. Another generates newsletter content. A third generates social media posts. The expensive AI work happens once; the downstream stages are cheap and independent.

---

## The Architectural Takeaway

The pipeline pattern I keep returning to has three rules:

**First, stages communicate only through typed intermediate formats.** No shared state, no direct function calls between stages, no "just pass the object." Serialize to JSON, validate on read. The overhead is negligible and the debuggability is transformative.

**Second, every stage must be independently retryable.** If you can't rerun stage 3 without also rerunning stages 1 and 2, your stages aren't isolated — they're functions pretending to be stages.

**Third, circuit breakers on every external call.** Not just LLM calls — any third-party API, any network request, any operation that can fail transiently. The fallback doesn't have to be good. It has to be *valid* — conforming to the output schema so downstream stages can proceed.

Build these three properties into your pipeline from the start. Retrofitting them into a straight-line pipeline is possible but painful — I know because I did it twice before learning to start with isolation.

The stages are replaceable. The intermediate formats are forever.

---

*Pipeline architecture code and examples from this post are in the [github-to-audio-pipeline](https://github.com/krzemienski/github-to-audio-pipeline) repo. The code-tales project that motivated the pattern is at [code-tales](https://github.com/krzemienski/code-tales).*
