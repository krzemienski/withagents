# The YAML file that sits between an agent and a destructive bash call

A prompt that says *don't delete files* will be wrong.

It will be wrong because the agent is helpful, and helpful agents occasionally decide that a stale test directory is the stale test directory you meant when you said *clean up before commit*. Somewhere around week three of running agent fleets full-time I stopped believing any behavior I could express as a sentence in an instruction file would survive contact with a long task.

The sentences were not the problem. The layer was the problem.

Agent Constitution Framework is the layer.

## The repo, in one file

A constitution is a YAML file. Each entry is a single rule with three fields: a trigger, an enforcement level, and a consequence. The framework reads the file at session start and installs one hook per rule. The hooks run inside the Claude Code PreToolUse phase — before the bash call, before the file write, before the tool executes.

```yaml
rules:
  - id: no-destructive-rm
    trigger: { tool: Bash, args_regex: "rm -rf" }
    level: block
    consequence:
      exit_code: 2
      stderr: "Destructive rm blocked. Use trash or archive."
  - id: no-force-push-main
    trigger: { tool: Bash, args_regex: "git push --force.* main" }
    level: block
    consequence:
      exit_code: 2
      stderr: "Force push to main refused. Open a PR."
  - id: require-evidence-on-completion
    trigger: { tool: TaskUpdate, status: completed }
    level: ask
    consequence:
      prompt: "Cite the evidence file path for this completion."
```

Three rules. Three hook installs. Every one intercepts the tool call, not the prompt that produced it. The agent cannot talk its way past a blocked rm because the rm never reaches the shell.

## Why constitution, not prompt

The 23,479-session dataset has a leaderboard of things agents do that prompts do not stop:

- `rm -rf` against a directory the user did not intend
- `git push --force` to main after a perceived cleanup
- `TaskUpdate status: completed` with no evidence path in the body
- Writes to `~/.claude/settings.json` during a session that was supposed to be read-only

Every one of these can be blocked at the hook layer. None is reliably blocked at the prompt layer, because prompts are advice and hooks are physics. The constitution is the file where the physics lives.

## Three enforcement levels

Each rule picks one:

1. **`block`** — the tool call fails. Exit 2, stderr with a reason. No override without editing the YAML.
2. **`ask`** — the tool call pauses. The user sees a permission prompt with the rule's reason. Used when the rule is right 95% of the time but needs human judgment for the last 5%.
3. **`log`** — the tool call runs. Recorded in the constitution log with a timestamp and a diff. Used for rules I want visibility on before promoting them.

Rule-of-thumb from the repo's README: start new rules at `log`. Watch for a week. Promote the ones that catch real misbehavior to `ask`. Promote the ones you would have overridden zero times to `block`.

## The voice-command story

The trigger for this repo was the ils-ios transcript. An agent had been "validating" the iOS app by reading Swift files. No simulator, no idb, no screen.

I typed back, under the covers at night: *what the fuck are You doing use action skills and Xcode skills You should be interacting WITH it that way.*

That sentence fixed the immediate loop. It did not stop the same pattern from repeating in the next session, the next project, the next agent.

Every flagship in this series has a version of that moment. The constitution framework is the move that says: turn every one of those sentences into a rule, install the rule as a hook, and stop retyping the sentence.

## What I do not know yet

How to scale this to a corporate environment where the YAML file itself becomes a political document — where every proposed rule triggers a review cycle. The repo is a solo developer's tool today. The governance story for a team of eight engineers adopting the same constitution is the next open question, and I have no receipts for it yet.

What I have is a file that has stopped three destructive commands and two completion-theater PRs this quarter. That is enough to keep running it.

---

Full post with the YAML schema, the three enforcement levels, and the ils-ios voice-command story: https://withagents.dev/writing/day-29-agent-constitution-framework
