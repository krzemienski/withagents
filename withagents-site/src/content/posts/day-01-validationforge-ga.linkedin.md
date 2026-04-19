# ValidationForge is live today. Here is what it actually is.

257 agent spawns in 10 days produced a plugin whose entire job is to make "build passed, task complete" physically impossible to claim when nobody has run the real system.

Not a framework. Not a methodology post. A plugin.

Across my last 23,479 Claude Code sessions, one hook alone — `block-test-files.js` — fired 642 times. Every fire caught an agent about to write a test-mirror: code that checks whether the agent's own function was called, not whether the feature works. One session accounted for 166 of those fires on its own.

I stopped trying to retrain that behavior through better prompts. It doesn't retrain. Confident wrongness is not a prompt bug, it is an incentive bug. The agent gets rewarded when the CI turns green. The CI turns green when the tests pass. The tests pass when the agent writes tests that assert the agent's function was called. The loop closes without the product ever being exercised.

ValidationForge closes a different loop.

The Iron Rule is in the PRD, verbatim, where I can see it every time I open the repo:

IF the real system doesn't work, FIX THE REAL SYSTEM. NEVER create mocks, stubs, or test doubles. NEVER write unit tests. NEVER use test frameworks. Build the real thing, run it, capture evidence.

Five lines. Everything in the plugin enforces them.

Honest labels, because today is a validation launch and overclaiming would be grotesque:

VALIDATE engine — beta. Hooks, skills, waves, evidence directories, 16 A/B benchmark cells. Shipping today.

CONSENSUS engine — planned. Unanimous N-agent gate voting. Scoped, not shipped.

FORGE engine — planned. Full validate-to-ship pipeline. Scoped, not shipped.

If you expected all three engines under "GA," I would rather write this paragraph than ship on a lie.

The piece that makes VALIDATE interesting is not the hooks. Hooks are load-bearing but boring. The interesting part is the verdict-writer skill — an agent whose only job is to read every evidence file in a directory and cite specific files for every PASS or FAIL claim. It refuses to issue PASS if any evidence file is 0 bytes. That single rule caught 14 would-be passing sessions during benchmark runs. Empty evidence inventory was the bug I was hunting.

If you're building agent products, I would push on this question: what is the smallest change you can make so that your agent cannot claim completion without leaving behind an artifact a human can inspect without running anything?

The answer for my work was a plugin. The answer for your work might be a pull request template. The pattern is the same. Completion has to be something you can read on disk, not a string the agent emitted.

Install:

```
claude plugin install validationforge
```

Run:

```
/validate-sweep
```

Repo, PRD, and roadmap: github.com/krzemienski/validationforge

Launch post with the full engineering spec: https://withagents.dev/writing/day-01-validationforge-ga
