# README patch text, day-11-ccbios-enhanced

_Note: ccbios-enhanced is not on GitHub (local-only). No remote README to patch. If/when pushed, this is the "Featured in" block._

---

## Featured in the WithAgents launch series. Day 11

**The iPhone became a build machine before the laptop did.**

A scoped-down fork of claude-code-builder, written to stop the agent from claiming DONE on iOS builds that did not boot. The completion gate is a simulator screenshot over a byte threshold, not a green compiler output. 1,789 lines of orchestration in one file, plus a 352-line SDK message visualizer that exposed the repeated-read and edit-before-read failure modes that went into `read-before-edit.js` for [claude-prompt-stack](https://github.com/krzemienski/claude-prompt-stack).

- Send date: 2026-04-29 (Day 11 of 45: WithAgents launch push)
- Blog post: https://withagents.dev/writing/day-11-ccbios-enhanced
- Canonical series hub: [agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)

[![Part of WithAgents. Day 11 of 45](https://img.shields.io/badge/WithAgents-Day_11_of_45-8B5CF6?style=for-the-badge)](https://withagents.dev/writing/day-11-ccbios-enhanced)
