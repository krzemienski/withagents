# X Thread — Post 1

**Tweet 1:** I averaged 559 AI coding sessions per day for 42 days straight. Not prompts. Sessions. Each one a self-contained agent with its own context window.

23,479 total. 3,474,754 lines of interaction data. 27 projects. Here's what the data actually revealed.

**Tweet 2:** 4,534 sessions started with a human prompt. The other 18,945 were agents spawning agents.

1:4.2 ratio. Every session I kicked off spawned roughly four more on its own. The coordination layer emerged without me designing it.

**Tweet 3:** Tool leaderboard from 23,479 sessions:

Read: 87,152
Bash: 82,552
Grep: 21,821
Edit: 19,979
Write: 9,066

Read-to-Write ratio: 9.6:1. Agents read ten files for every one they write. They're readers that occasionally write.

**Tweet 4:** Five failure modes showed up in week one and never stopped:

Amnesia. Confidence without evidence. Completion theater. Wrong model for the job. Coordination collisions.

Every system in the next 17 posts exists because one of these hit me in production.

**Tweet 5:** Completion theater is the worst one.

Delete Account button with the correct icon, correct dialog, correct spinner. The onClick handler calls the correct function. Function body: TODO comment.

Every automated check passed. User filed a ticket.

**Tweet 6:** Model routing cut API costs 82% on one iOS project.

Three rules. No ML. No classifier.

Haiku for lookups. Sonnet for implementation. Opus for architecture and complex debugging.

$380 total for 4,241 sessions on ils-ios.

**Tweet 7:** One iOS audit session spawned 13 different team configurations. 80 agent operations total.

I typed one sentence to start it.

Design team, validators, executor, final consensus checkpoint. Orchestrated across context windows using the filesystem as shared state.

**Tweet 8:** Four patterns survived contact with real codebases:

Consensus gates. Three agents, unanimous required. $0.15 each.
Functional validation. Real UI, real taps, screenshots as evidence.
Fresh context over accumulated context.
Filesystem as persistence layer.

**Tweet 9:** Every claim in this series traces to a real session. Every system has a companion repo you can clone and run. No fabricated examples. No mock data.

The data: 11.6GB of JSONL across 42 days. The work: 18 posts, 14 unique repos.

**Tweet 10:** The thesis in one number: 9.6:1.

Agents that read before they write produce fewer regressions than agents that jump straight to editing. The most productive thing an AI agent does isn't writing code. It's understanding the code that already exists.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
