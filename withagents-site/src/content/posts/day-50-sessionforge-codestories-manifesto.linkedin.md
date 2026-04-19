# The only argument in 45 days of posts I'd make again from scratch

Over the past 45 days I've written a lot about agent orchestration. Products shipped: ValidationForge, the CCB lineage recap, the Ralph Orchestrator origin, the withagents-skills package, SessionForge milestones, Code Stories.

Today is the finale, and I'm ending it the way I started it. With the one argument I would keep if I could only keep one.

A build that compiles is not a feature that works.

An agent that reports DONE without evidence on disk is lying.

The only thing in this body of work worth teaching is the refusal to accept a green check you did not watch execute.

Everything else is downstream.

Here is the data. Across the 360-day session mine (23,479 human-started sessions, 18,945 agent-spawned, 3.4 million lines of interaction JSONL) one hook alone — block-test-files.js — fired 642 times.

Every fire was an agent about to write a test-mirror: code that checks whether the agent's own function was called, not whether the feature works. One session triggered 166 of those blocks on its own.

The hook is three lines long.

It exists because without it, the agents shipped. The CI turned green. The "100% test coverage" reports were honest at the level of the test pass rate and dishonest at the level of whether the product worked.

This failure mode is not hypothetical. It happened 642 times in my data. It is happening in your data right now, whether you have instrumented for it or not.

Three things this argument is NOT, because I keep getting misread:

It is not anti-AI. The entire corpus is evidence of agents doing legitimate work once the environment is shaped to catch their failure modes. 23,479 sessions in 42 days. The discipline exists to make that volume trustworthy, not to prove the sessions shouldn't happen.

It is not anti-testing. It is anti-mirror-testing. A test the agent writes against its own code is not a test — it's a mirror. The distinction is not semantic. The first one pressures the agent to match the test. The second one pressures the code to match reality.

It is not productivity theater. The shortest flagship arc in this series is ten days. The longest is sixty-four. Every real piece of infrastructure needed direct human intervention to unblock a stuck agent loop. Humans drive agent fleets. Humans do not get replaced by them.

If you are building on agents right now and going to build nothing else this year: instrument the moment where your agent claims completion. Add a hook. Add a PR template field. Add a manual review gate. Make it so that claiming DONE requires producing an artifact a human can read without running anything.

That is the entire argument.

The repos from the series are under github.com/krzemienski. The skills are in withagents-skills. The engine that audits against the Iron Rule is validationforge. The tool that mines session data is sessionforge.

Real system or nothing.

Finale post with the SessionForge milestone, the Code Stories dual-SKU launch, and the full manifesto: https://withagents.dev/writing/day-50-sessionforge-codestories-manifesto
