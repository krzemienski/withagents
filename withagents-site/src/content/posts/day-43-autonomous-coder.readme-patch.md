# README patch text, autonomous-coder

_Paste at the top of `krzemienski/autonomous-coder/README.md`, above the "What It Does" section._

---

## Featured in WithAgents. Day 43 of 45

**Four phases, four agents, one live TUI dashboard.**

The long-form write-up covers the Research → Explore → Plan → Code pipeline (each phase a separate `query()` call with its own model, tool budget, and security constraints), the file-based handoff between phases (`research-findings.md` → `codebase-map.md` → `implementation-plan.md`), and the TUI-vs-CLI architecture split that took three refactors to get right. Also covers why this is the deliberately-small counterpart to [claude-code-builder](https://github.com/krzemienski/claude-code-builder), serial task execution, Agent SDK over subprocess CLI, target user is "solo dev who wants to watch what happens." The honest-limitation block covers the Serena MCP dependency I want to remove and approximate cost tracking under cache-hit conditions.

- Send date: 2026-05-31 (Day 43 of 45: WithAgents launch push)
- Blog post: https://withagents.dev/writing/day-43-autonomous-coder
- LinkedIn Article: _link added on send day_
- Canonical series hub: [agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)
- Pairs with: [cc-setup: Day 42](https://withagents.dev/writing/day-42-cc-setup) (the Interactive-mode environment this SDK-mode orchestrator runs inside)

[![Part of WithAgents. Day 43 of 45](https://img.shields.io/badge/WithAgents-Day_43_of_45-8B5CF6?style=for-the-badge)](https://withagents.dev/writing/day-43-autonomous-coder)
