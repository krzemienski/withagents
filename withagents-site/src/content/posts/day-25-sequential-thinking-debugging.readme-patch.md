# README patch (Day 25 / sequential-thinking-debugging)

## Suggested insertion (top of README)

**Featured in:** [withagents.dev, *84 thinking steps to find a one-line bug*](https://withagents.dev/posts/day-25-sequential-thinking-debugging)

The post walks the 84-step chain that found a cross-layer bug four engineers missed over two days. A 12.5% audio corruption traced to a single line: `offset = file_size // 8` that failed to skip the 44-byte WAV header on chunk 0.

What this repo codifies:

- `DebuggingChain` with typed steps (OBSERVATION, HYPOTHESIS, PREDICTION, TEST, ELIMINATION, CONFIRMATION, ROOT_CAUSE, REVISION)
- Constraint-based category elimination (kill all race conditions in one step, not one at a time)
- Hypothesis tracking with falsifiable predictions and evidence lists
- Four-layer mapping so the chain crosses component boundaries
- `seq-debug demo` reproduces the WAV bug chain end to end

The post also draws the decision boundary: sequential thinking is right for 1.4% of bugs, exactly the ones that span multiple system layers with a quantitative constraint. The other 98.6% get a print statement or a server restart.

Usage examples in the post map directly to the `DebuggingChain` API in this repo.
