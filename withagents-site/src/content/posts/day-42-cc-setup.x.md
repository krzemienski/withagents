# X thread. Day 42 cc-setup

**1/ (264 chars)**
Every 6 weeks I was rebuilding the same Claude Code environment from scratch.

Rules, hooks, skills, agents, MCP configs, CLAUDE.md, settings.json.

Laptop swap. Clean install. New client project.

Half a day, each time.

The 3rd time that happened I wrote cc-setup. 🧵

**2/ (273 chars)**
cc-setup is two things fused into one repo:

1. A plugin, agents, skills, commands (via /plugin marketplace)
2. An install script, rules, hooks, global CLAUDE.md, settings, MCP

Second category matters. The plugin system cannot touch ~/.claude/CLAUDE.md. By design.

**3/ (253 chars)**
Quick start:

```
git clone <repo> ~/cc-setup
cp .env.template .env && vi .env
./install.sh
# Then in a Claude Code session:
/plugin marketplace add ~/cc-setup
/plugin install cc-setup@cc-setup-marketplace
```

Two shell steps, one in-session step.

**4/ (257 chars)**
The four shell scripts that matter:

• backup.sh: snapshot ~/.claude before install
• restore.sh: revert to a snapshot
• diff.sh: preview what install.sh would change
• health.sh: preflight the resulting environment

These are what took the longest to get right.

**5/ (278 chars)**
v1 was just install.sh. Run it, get an environment.

v2, ran it on a machine with a customized CLAUDE.md.

Silently overwrote 40 minutes of my work.

Didn't notice for 3 days. Then opened the file to add a new rule and saw the template staring back.

backup.sh came out of that.

**6/ (271 chars)**
health.sh is a separate story.

After 3 fresh installs I couldn't tell whether the environment was working until I actually started a Claude Code session.

By then I'd committed to real work. An MCP load failure is a 15-minute debug detour.

health.sh is a 4-second preflight.

**7/ (264 chars)**
What health.sh checks:

• Every MCP server gets pinged
• Every expected hook file gets stat'd
• Every rule file in ~/.claude/rules/ gets read back
• Every skill metadata line gets parsed

Failures get listed with the exact file path to inspect.

No guessing.

**8/ (253 chars)**
Why this became a product, not dotfiles:

Lots of people have ~/.claude/ dotfiles repos. I did too.

Without backup/restore/diff/health, you have a set of files.

WITH them, you have a reproducible environment.

The four scripts are the whole game.

**9/ (265 chars)**
Test I apply:

Can somebody I don't know clone this, run install.sh on a fresh machine, and have a working Claude Code setup in under 10 minutes?

Answer became yes around iteration 6.

Before that every install failed on an unexpected permission prompt or a skipped hook.

**10/ (266 chars)**
Honest limitation: cc-setup is opinionated.

Disagree with the default hook set? Fork it.

I tried an à-la-carte installer for two weeks. Every user journey ended with somebody half-configured and confused about why their agent was still writing test files.

One size of opinion.

**11/ (271 chars)**
The thing I worry about most: MCP config drift.

MCP ecosystem moves fast. `mcp/` in this repo is a snapshot, not a living document.

6 months out, half the server configs will need updates.

health.sh catches failures. Doesn't catch "still works but has a better replacement."

**12/ (260 chars)**
Mode-bet: Interactive.

cc-setup doesn't steer the agent with code. It shapes the ENVIRONMENT the agent runs inside.

Hooks, rules, skills, make certain actions easier, certain actions harder, certain actions impossible.

Reproducibility > cleverness of any one prompt.

**13/ (214 chars)**
Full post: https://withagents.dev/writing/day-42-cc-setup

Repo: github.com/krzemienski/cc-setup

Tomorrow: autonomous-coder, the SDK-mode counterpart that runs inside this environment when nobody's at the keyboard.

Part of /45.

---

_13 tweets. 214-278 chars. Day 42 of WithAgents launch push._
