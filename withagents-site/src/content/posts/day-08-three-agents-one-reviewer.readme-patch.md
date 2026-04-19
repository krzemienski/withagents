# README patch (Day 08 / multi-agent-consensus)

## Suggested insertion (top of README)

**Featured in:** [withagents.dev, *Three agents caught a P2 bug a single reviewer approved*](https://withagents.dev/posts/day-08-three-agents-one-reviewer)

The post tells the origin story this repo was built for: a `+=` operator typo that survived a single-reviewer pass and shipped to iOS production as a state-leak between streaming requests. Three independent reviewer agents (Alpha / Bravo / Lead) flagged three separate problems in the same diff. Any one FAIL would have blocked the merge.

Gate cost: about $0.15 with Haiku for Alpha/Bravo and Sonnet for Lead aggregation. Versus roughly 14 hours of on-call work on the regression that shipped, plus support backlog, plus trust cost. Fifteen cents was never a close call.

Repo contents referenced in the post:

- `prompts/alpha.md`, `prompts/bravo.md`, `prompts/lead.md` (the three declared lenses)
- `scripts/run-gate.sh` (shell aggregator with unanimous-PASS exit rule)
- `plans/reports/consensus-*-review.md` (per-gate logs of which reviewer caught what)
