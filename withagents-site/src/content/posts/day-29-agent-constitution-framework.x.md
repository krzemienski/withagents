# X Thread — Day 29 — Agent Constitution Framework

Format: 10 tweets. All under 280 chars.

---

**1/10** (181 chars)
A prompt that says "don't delete files" will be wrong.

Helpful agents occasionally decide that a stale test directory is the stale test directory you meant when you said "clean up before commit."

**2/10** (201 chars)
Week three of running agent fleets full-time, I stopped believing any behavior I could express as a sentence in an instruction file would survive contact with a long task.

Sentences are not the problem. Layer is.

**3/10** (221 chars)
Agent Constitution Framework is a YAML file.

Each entry: one rule, three fields — trigger, enforcement level, consequence.

The framework installs one hook per rule at the Claude Code PreToolUse phase. Before the tool executes.

**4/10** (250 chars)
Example rule:

```
id: no-destructive-rm
trigger: { tool: Bash, args_regex: "rm -rf" }
level: block
consequence:
  exit_code: 2
  stderr: "Destructive rm blocked. Use trash or archive."
```

Every rule intercepts the tool call, not the prompt.

**5/10** (232 chars)
The 23,479-session leaderboard of things prompts do not stop:

- rm -rf against a directory the user did not intend
- git push --force to main after a perceived cleanup
- TaskUpdate completed with no evidence path
- Writes to ~/.claude/settings.json

**6/10** (206 chars)
Each can be blocked at the hook layer. None is reliably blocked at the prompt layer.

Prompts are advice. Hooks are physics.

The constitution is the file where the physics lives.

**7/10** (220 chars)
Three enforcement levels:

block — exit 2, no override without editing YAML
ask — permission prompt with reason attached
log — runs but recorded with timestamp + diff

Start new rules at log. Promote after a week.

**8/10** (238 chars)
Voice-command story behind this repo:

ils-ios session 571a63ba. Agent had been "validating" iOS by reading Swift files. No simulator, no idb, no screen.

I typed back under the covers at night. That sentence fixed the loop — for one session.

**9/10** (205 chars)
It did not stop the pattern in the next session. Or the next project. Or the next agent.

The framework is the move that says: turn every one of those sentences into a rule, install the rule as a hook.

**10/10** (203 chars)
Stop retyping the sentence.

This file has stopped 3 destructive commands and 2 completion-theater PRs this quarter. That is enough to keep running it.

https://withagents.dev/writing/day-29-agent-constitution-framework
