# Post 9: "From Session Logs to Published Content"

## Metadata
- Target word count: 2,000
- Source posts: old 09 (code-tales/GitHub-to-audio, 8,137 words), old 19 (content pipeline architecture, 2,376 words), old 29 (session content mining, 6,181 words), old 45 (agent SDK podcast generation, 6,988 words)
- Companion repo: `sessionforge` (TypeScript, 4 stars)
- New content needed: No -- four source posts cover the full pipeline from raw session logs to published content. Needs reframing around SessionForge rather than code-tales.

## Opening (hook -- 2 sentences max)
4,597 session files became 61 blog posts. The scoring algorithm that decided which sessions were worth writing about rated its own debugging session a 0.78 on novelty.

## Narrative Arc

1. **The mining problem** -- The raw material is session logs: JSONL files recording every tool call, every file read, every error message from 4,500 Claude Code sessions. Most sessions are routine -- install a dependency, fix a typo, run a build. The challenge: finding the 5% of sessions that contain a genuine insight worth publishing. The deep-mine.py script processing 4,496 files. The surprising discovery from post 29: tool signatures beat natural language for topic extraction. Tool patterns are "precise and invariant. They do not lie about what the session actually did." K-means clustering (k=20) on tool signatures: 94% stability across re-runs vs 71% for NLP-based clustering. ~350 words

2. **The 7+3 scoring system** -- From post 29. Seven dimensions with weights: novelty (0.20), complexity (0.15), reproducibility (0.20), impact (0.15), narrative (0.10), breadth (0.10), evidence (0.10). Plus three bonus dimensions for content-specific scoring. Three concrete examples: Multi-Agent Consensus scored 0.94 (became Post 2), Hook-Based Discipline scored 0.84 (became Post 28 in old numbering), Config File Edits scored 0.16 (not publishable). The key heuristic from post 29: "Sessions with both failure signals AND resolution signals indicate a story arc." The recursive irony: the session debugging the novelty metric was later scored by the novelty metric at 0.78. ~300 words

3. **The six-stage content pipeline** -- From post 19. The naive 5-line pipeline that is "obviously correct and catastrophically fragile." The fix: typed intermediate formats between stages, each stage independently retryable, circuit breakers on every external call. The six stages: ingest, extract, score, enrich, generate, publish. The `validate_input` pattern catching 40% of stage failures caused by the previous stage's malformed output. From SessionForge session evidence: `get_session_summary` called 156 times, `mine_sessions` called 30 times -- this pipeline ran at scale. ~350 words

4. **The devlog-pipeline skill** -- The meta-level: this blog series was produced by the pipeline it describes. 429,541 words across 61 posts, generated from scored session insights, formatted by content agents, validated by reviewer agents. The three-zone sampling strategy from post 29: head (50 lines), middle (3 random windows of 30 lines), tail (50 lines) -- 48% processing time reduction with less than 3% insight loss. This is what makes the pipeline practical at 4,597 files: you do not read every line. ~250 words

5. **From text to audio** -- From posts 09 and 45. The extension of the pipeline into audio generation. Post 09's crown jewel: five bugs invisible when reading text, only manifesting as audio artifacts. Bug 1: 9 commits to arrive at two newline characters (missing pauses). Bug 3: asterisk stutter -- stray `*` becomes a glottal stop in TTS. Post 45's distinction from NotebookLM: "This is not a couple minutes of overview. I needed 30+ minute episodes." The multi-agent chain: Researcher, Scriptwriter, Editor, TTS Synthesizer, Audio Assembler. Cost per story: $0.12-$0.35. ~400 words

6. **Economics of content at scale** -- Post 19's enrichment caching by `extraction_hash`: 70% cost reduction for updates. The "multiple outputs from one enrichment" unlock -- audio, newsletter, social, and blog from the same scored insight data. Post 09's build stats: 636 commits, 90 worktree branches, 91 specs, 37 validation gates for the code-tales project alone. ~200 words

## Key Code Blocks to Include
- The InsightScore dataclass from post 29 with 7 dimensions and weights
- The `PipelineStage` interface from post 19 (4 methods: execute, validate_input, can_retry, estimated_cost)
- The three-zone sampling config (head/middle/tail line counts) -- from post 29
- The `_clean_content()` regex bridging text and audio -- from post 09

## Real Data Points
- 4,597 session files processed by deep-mine.py (session evidence)
- 429,541 words across 61 posts (devlog-pipeline)
- SessionForge: get_session_summary(156 calls), mine_sessions(30 calls)
- 94% vs 71% cluster stability: tool signatures vs NLP (post 29)
- 48% processing time reduction with three-zone sampling (post 29)
- 40% of stage failures caught by validate_input (post 19)
- 70% cost reduction from enrichment caching (post 19)
- 9 commits for 2 newline characters in audio pipeline (post 09)
- Cost per audio story: $0.12-$0.35 (post 09)
- 636 commits, 90 worktree branches on code-tales (post 09)

## Material to NOT Include
- Design token automation and Stitch MCP (that's post 10)
- Ralph loop patterns (that's post 8)
- Post 09's full pipeline orchestrator code and all stage implementations
- Post 09's full StyleRegistry and all 9 style YAML listings
- Post 19's full CircuitBreaker class implementation
- Post 19's full batch_execute() async function
- Post 29's full ToolSignature extraction code
- Post 29's full InsightScorer implementation
- Post 45's "Why Podcasts Matter" section (filler)
- Post 45's TTS API comparison section (reads like a product review)
- Post 45's voice parameter diagonal details (too granular)

## Companion Repo Tie-in
The `sessionforge` repo is the TypeScript implementation of the full content pipeline -- from session mining through scoring to content generation. It includes the 7+3 scoring system, six-stage pipeline with circuit breakers, and the devlog-pipeline skill that produced this blog series. "Point it at a directory of Claude Code session logs and it will tell you which sessions are worth writing about."
