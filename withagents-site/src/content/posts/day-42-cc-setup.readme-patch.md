# README patch text, cc-setup

_Paste after the Quick Start block in `krzemienski/cc-setup/README.md`._

---

## Featured in WithAgents. Day 42 of 45

**The git-tracked Claude Code environment, because a setup that cannot be reproduced is not a setup.**

The long-form write-up walks through the four shell scripts that promote this from dotfiles into a reproducible environment, `backup.sh` (the one that came out of me silently overwriting 40 minutes of CLAUDE.md work and not noticing for three days), `restore.sh`, `diff.sh` (preview before install), and `health.sh` (4-second preflight: MCP pings, hook stats, rule file reads, skill metadata parses). The post also covers why the plugin-plus-install-script split exists (plugins cannot write to `~/.claude/CLAUDE.md` by design, and that boundary is correct), and the honest limitation of MCP config drift that I still do not have a great answer for.

- Send date: 2026-05-30 (Day 42 of 45: WithAgents launch push)
- Blog post: https://withagents.dev/writing/day-42-cc-setup
- LinkedIn Article: _link added on send day_
- Canonical series hub: [agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)

[![Part of WithAgents. Day 42 of 45](https://img.shields.io/badge/WithAgents-Day_42_of_45-8B5CF6?style=for-the-badge)](https://withagents.dev/writing/day-42-cc-setup)
