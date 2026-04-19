# README patch text. ClaudeCodeSDK

_Paste near the top of `krzemienski/ClaudeCodeSDK/README.md`, beneath the existing feature bullets._

---

## Featured in WithAgents. Day 13 of 45

**The Swift wrapper that forced me to pick a backend.**

Two backends, one protocol surface, a platform decision that removed iOS from the package. The long-form write-up covers the dual-backend architecture (headless CLI vs Node Agent SDK bridge), the auto-detection fight I lost three times before shipping the `--version`-probe approach, and why dropping iOS from `Package.swift` in v2.0.0 was honesty rather than regression, the `Process` API throws at runtime inside the iOS sandbox. The SDK's typed error surface, built-in token bucket rate limiter, and `AbortController` support are covered as the three things CLI-wrapping SDKs tend to miss.

- Send date: 2026-05-01 (Day 13 of 45: WithAgents launch push)
- Blog post: https://withagents.dev/writing/day-13-claude-code-sdk
- LinkedIn Article: _link added on send day_
- Canonical series hub: [agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)

[![Part of WithAgents. Day 13 of 45](https://img.shields.io/badge/WithAgents-Day_13_of_45-8B5CF6?style=for-the-badge)](https://withagents.dev/writing/day-13-claude-code-sdk)
