# The Claude Prompt Stack: seven layers because any single layer fails

I had 14 rules in my CLAUDE.md. The agent followed 11 consistently. The other three ("never create test files," "always compile after editing," "read the full file before modifying it") failed at rates that made them decorative.

47 test files created despite a clear prohibition.
112 edits to files the agent hadn't read.
63 premature "complete" declarations.

The agent *understands* every rule. It can recite them back if you ask. Then 11 tool calls later, deep in a problem-solving loop, it creates `auth.test.ts` because that's what its training says a responsible developer does.

Writing rules is easy. Getting an AI agent to follow them under pressure is a different problem.

The solution borrows from Claude Shannon's information theory: reliable communication requires redundant encoding. Say the same thing seven different ways, through seven different mechanisms, and the message gets through.

## The repo

[claude-prompt-stack](https://github.com/krzemienski/claude-prompt-stack) is the template that compiles this idea into working files.

```bash
git clone https://github.com/krzemienski/claude-prompt-stack.git
cd claude-prompt-stack
bash setup.sh --target /path/to/your/project
```

Seven layers stood up in your project, one clone.

## The seven layers

1. **Global CLAUDE.md**, `~/.claude/CLAUDE.md`, cross-project constitution
2. **Project CLAUDE.md**, `./CLAUDE.md`, project-specific mandates
3. **Rules files**, `.claude/rules/*.md`, focused 40-50 line files per concern
4. **Hooks**, `.claude/hooks/*.js`, code that runs on every tool call
5. **Skills**, `skills/*.md`, composable validation workflows
6. **MCP tools**, external capabilities with built-in constraints
7. **Session start hooks**, inject full governance context from turn 1

Each layer reinforces the same rules through a different mechanism. No single layer is sufficient.

## What the hook layer catches

I built 23 hooks. Five survived production.

- **`block-test-files.js`**: violation rate 23% → 0%. Pattern-match filenames, block on write.
- **`read-before-edit.js`**: 31% → 4%. Warn when editing an unread file.
- **`validation-not-compilation.js`**: 41% → 9%. Catch "build succeeded = feature done" claims.
- **`evidence-gate-reminder.js`**: improves task completion quality 34%.
- **`skill-activation-check.js`**: drives 1,370 skill invocations measured in the series dataset.

The pattern is clear: **if the violation can be objectively detected from tool inputs alone, a hook works.** Filename patterns: yes. Subjective code quality: no.

## Aggregate numbers

Across 23,479 measured sessions:
- Violation rate: 3.1 per session → 0.4 (87% reduction)
- Hook overhead: 7ms per tool call
- Read-to-Write ratio: 9.6:1 (was 4:1 before `read-before-edit` shipped)
- Subagent compliance: 68% without constitution injection vs 95% with it

## The Shannon principle

An LLM context window is a noisy channel. Instructions degrade as context grows. Training priors override explicit instructions.

The seven-layer stack is an error-correcting code for agent behavior.

- CLAUDE.md alone: 60% compliance
- Hooks alone: 75%
- Skills alone: 80%
- All seven together: 95%+

The difference between 60% and 95% is the difference between an agent that creates work and an agent that saves it.

Start with three hooks, measure for a week, then add more. The hooks that survive production share two properties: objective detection and low false positives after calibration.

---

Part of WithAgents. Day 14 of 45. Canonical blog post: https://withagents.dev/writing/day-14-claude-prompt-stack
