# cc-setup: the git-tracked Claude Code environment

Every six weeks I was rebuilding the same Claude Code environment from scratch. Rules, hooks, skills, agents, MCP configuration, CLAUDE.md, settings.json.

A laptop swap, a clean OS install, a new client project, and I'd spend half a day restoring the governance layer that keeps my agent sessions from going feral.

The third time that happened, I wrote [cc-setup](https://github.com/krzemienski/cc-setup).

## What it is

Two things fused into one repo:

1. A **plugin**, agents, skills, commands. Installed via the Claude Code plugin marketplace.
2. An **install script**, rules, hooks, global CLAUDE.md, settings files, and MCP configurations that a plugin cannot touch.

That second category is the important one. The plugin system is excellent for distributing agent behaviors, but it explicitly cannot write to `~/.claude/CLAUDE.md` or your project-local `settings.json`. cc-setup respects that boundary by splitting the work into the two channels that have permission to do each thing.

## Quick start

```bash
git clone <repo> ~/cc-setup
cp .env.template .env && vi .env
./install.sh

# Then inside a Claude Code session:
/plugin marketplace add ~/cc-setup
/plugin install cc-setup@cc-setup-marketplace
```

Two shell steps, one in-session step.

## The four shell scripts that matter

```
cc-setup/
├── backup.sh    # snapshot ~/.claude before install
├── restore.sh   # revert to a snapshot
├── diff.sh      # preview what install.sh would change
└── health.sh    # preflight the resulting environment
```

These are what took the longest to get right.

The first version of cc-setup was just `install.sh`. Run it once, get an environment. That worked. The second time I ran it, on a machine with a customized CLAUDE.md, it silently overwrote 40 minutes of work. I didn't notice for three days.

`backup.sh` came out of that incident.

`health.sh` is separate. After the third fresh install I realized I couldn't tell whether the environment was working until I actually started a Claude Code session. By then I'd committed to real work, and debugging an MCP load failure is a 15-minute detour. `health.sh` pings every MCP server, stat's every expected hook, parses every skill metadata line. Failures get listed with the exact file path. Four seconds.

## Why this became a product, not dotfiles

Lots of people have `~/.claude/` dotfiles repos. I did too. The reason this got promoted into a named product is the four-script safety net.

Without those, you have a set of files. With them, you have a reproducible environment.

Test I apply: can somebody I don't know clone this, run `install.sh` on a fresh machine, and have a working Claude Code setup in under ten minutes? The answer became yes around iteration six.

## Honest limitations

cc-setup is opinionated. If you disagree with the default hook set, fork it. I tried building an à-la-carte installer for two weeks and every user journey ended with somebody half-configured and confused. One size of opinion.

MCP config drift is what I worry about most. The MCP ecosystem is moving fast. `mcp/` is a snapshot, not a living document. Six months out, half the server configs will need updates. `health.sh` catches failures. It does not catch "this still works but has a better replacement." That is a future problem.

## Mode-bet: Interactive

cc-setup does not steer the agent with code. It shapes the environment the agent runs inside. The hooks, rules, and skills installed are the Interactive-mode primitives, they make certain actions easier, certain actions harder, certain actions impossible.

The bet is that reproducibility of the environment matters more than cleverness of any individual prompt.

---

Part of the WithAgents launch. Day 42 of 45. Tomorrow: autonomous-coder, the SDK-mode counterpart that runs inside this environment when a human is not at the keyboard.

Full post: https://withagents.dev/writing/day-42-cc-setup
