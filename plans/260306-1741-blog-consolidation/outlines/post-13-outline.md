# Post 13: Debugging with Sequential Thinking

## Metadata
- Target word count: 2,200
- Source posts: old 17 (84-step WAV bug), old 31 (stale build cache), old 50 (API image limit recovery)
- Companion repo: `sequential-thinking-debugging/`
- New content needed: No — three strong source posts provide all material

## Opening (hook — 2 sentences max)
Two days. Four engineers. Nobody could find the bug — until an 84-step sequential thinking chain traced it to a single integer division that skipped a 44-byte WAV header.

## Narrative Arc

1. **The Bug Nobody Could Find** (~500 words, from post 17)
   - The symptom: audio corruption affecting exactly 1 in 8 playbacks (12.5%)
   - The "suspiciously specific" frequency as the anchor constraint
   - Step 23: race condition theory abandoned because race conditions don't produce 1/8 probability
   - Step 47: CDN misconfiguration LOOKS like root cause — "unusual isn't root cause"
   - Step 68: breakthrough — CDN response is correct given the offset it receives
   - The four-layer trace: React player -> API gateway -> CDN -> PostgreSQL
   - The one-line fix: `offset = (file_size - WAV_HEADER_SIZE) // 8 + WAV_HEADER_SIZE`
   - "Almost all the work in finding the problem, almost none in fixing it"

2. **The 34-Minute Ghost Route** (~500 words, from post 31)
   - Agent debugging a Next.js route that returns 404 despite the file existing on disk
   - The escalation chain: checked path, verified export, renamed file, moved file, added console.log, deleted and recreated, searched docs, tried Pages Router, restructured directory, considered Express
   - Fix: restart the dev server (2 seconds)
   - The stale cache taxonomy: HMR cache, TypeScript declaration cache, module resolution cache, build output cache, package manager cache
   - Metric: 23% of debugging sessions longer than 15 minutes caused by stale caches
   - The PostToolUse hook that detects "file changed but behavior unchanged" pattern

3. **When the Pipeline Hits the Wall** (~400 words, from post 50)
   - 2,224 frames from a 74-minute video, hit "400 Bad Request: maximum 100 images per request"
   - The boundary problem: transition at frame 97 lands at batch boundary, neither batch sees both sides
   - Systematic recovery: batch-to-30 with 5-frame overlap, 94% overlap-zone transitions detected by both batches
   - Batch size tuning data: batch-10 (96% accuracy, 2.5x cost), batch-30 (94%, 1.0x), batch-100 (81%, 0.4x)
   - "The pipeline was not wrong; it was designed without knowledge of a constraint"

4. **The Debugging Pattern** (~300 words, synthesis)
   - Start with a quantitative constraint (12.5%, 23%, 100-image limit)
   - Use the constraint to eliminate hypothesis categories, not just individual hypotheses
   - Map layers before assigning blame — the bug lives in interactions, not components
   - Backward causality tracing vs forward call stack debugging
   - Cache-first checklist: before debugging anything, restart, clear, verify runtime matches source
   - Sequential thinking forces explicit hypotheses — you can't skip steps

## Key Code Blocks to Include
- The one-line WAV offset fix (before/after) from post 17
- The `dev-server-restart-reminder.js` PostToolUse hook from post 31
- The `create_batches()` with overlap window logic from post 50 (~15 lines, trimmed)

## Real Data Points
- 84 sequential thinking steps to find one bug (post 17)
- 12.5% (1/8) failure rate as the constraint anchor (post 17)
- 34 minutes debugging a stale cache problem, fix took 2 seconds (post 31)
- 23% of long debugging sessions caused by stale caches (post 31)
- 5 distinct cache types in the taxonomy (post 31)
- 2,224 frames, 100-image API limit, batch-30 sweet spot (post 50)
- Batch-100 accuracy: 81% vs batch-30: 94% — smaller batches are strictly better (post 50)

## Material to NOT Include
- Post 17's full four-layer Mermaid diagram (too detailed for a section within a broader post)
- Post 31's "Psychology of Cache Debugging" section (padding)
- Post 31's full CacheGuardian class (too long, hook is the actionable takeaway)
- Post 50's checkpoint/resume system details (belongs in content pipelines post 9, not here)
- Post 50's concurrency tuning details (tangential to debugging narrative)
- Post 50's cost analysis section (not a debugging lesson)

## Companion Repo Tie-in
The repo provides the sequential thinking debugging harness: constraint propagation engine, hypothesis tracker, and cache staleness detector. Post ends with: "Clone the repo. Feed it a bug with a quantitative constraint. Watch it eliminate hypothesis categories faster than you can type them."
