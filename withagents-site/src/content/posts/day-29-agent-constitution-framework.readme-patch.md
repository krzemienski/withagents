## Featured in: Day 29 of the WithAgents launch

**Agent Constitution Framework** is one YAML file, one hook per rule, installed at the Claude Code PreToolUse layer. Each rule has three fields: a trigger, an enforcement level (block/ask/log), and a consequence. The framework intercepts tool calls, not prompts.

Why the split matters: prompts are advice and hooks are physics. The constitution is the file where the physics lives. It has stopped the same three classes of agent misbehavior — destructive rm, force-push to main, completion claims without evidence paths — across every project it has been installed on this year.

Full post with the YAML schema, the three enforcement levels, and the ils-ios voice-command story behind the repo: https://withagents.dev/writing/day-29-agent-constitution-framework

Pairs with: `shannon-framework` (larger-scale layered enforcement), `validationforge` (the completion-claim-validator hook is the automated form of one constitution rule).
