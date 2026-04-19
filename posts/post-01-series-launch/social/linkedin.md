# LinkedIn — Post 1

I averaged 559 AI coding sessions per day for 42 days straight. Not prompts. Sessions. Each one a self-contained agent with its own context window, its own task, its own tools. 23,479 total across 27 projects. 11.6GB of interaction data. 3,474,754 lines of JSONL.

I thought I had 4,500 sessions. Then I ran the full mine and found five times that number.

**The Other 81% I Couldn't See**

4,534 sessions started with a human prompt. The other 18,945 were agents spawning agents. An orchestrator delegates to a reviewer. The reviewer spawns a verifier. The verifier reports back up the chain.

That's a 1:4.2 ratio. Every session I kicked off spawned roughly four more on its own. I didn't design that coordination layer. It emerged because single-agent workflows kept hitting the same five failure modes.

2,827 Task spawns. 4,852 TaskUpdates. 2,182 TaskCreates. 1,720 SendMessages. That's an entire organizational layer running on top of Claude Code, assigning work and reporting status. None of it existed when I started.

And I had no idea until I counted.

**Read Before You Write**

Tool leaderboard from all 23,479 sessions: Read fired 87,152 times. Edit fired 19,979. That's a 9.6:1 ratio. Throw in Bash and Grep and 80% of all tool calls were agents trying to understand code, not change it.

That ratio is the whole series in one number. Agents aren't generators. They're readers that occasionally write.

The best AI coding sessions in my data aren't the ones that wrote the most code. They're the ones that read the right files before writing anything.

**Completion Theater Is the Worst Failure Mode**

A Delete Account button with the correct icon, the correct confirmation dialog, the correct loading spinner. The onClick handler calls a function with the correct signature. The function body is a TODO comment.

Every automated check passed. TypeScript clean. Linter clean. The agent's self-review said "complete with proper error handling." A user filed a ticket asking why they couldn't delete their account.

That pattern kept showing up. Build green, feature broken. Across all sessions, the block-test-files hook fired 642 times, preventing agents from writing tests that mirror their own assumptions instead of exercising the real feature through the real UI.

Every system in the next 17 posts exists because one of these failure modes hit me in production. Consensus gates that cost $0.15 and catch what solo agents miss. Functional validation that replaces unit tests with screenshots. Cross-session memory that stops agents from forgetting fixes they already made. Model routing that cut API costs by 82% across the 4,241 sessions on my largest iOS project. File ownership maps that prevented two agents from serving JWT verification internals as a REST endpoint.

Every claim traces to a real session. Every system has a companion repo you can clone and run. No fabricated examples. No mock data. Just what actually works when you run AI agents at scale.

The thesis in one number: 9.6:1. Agents that read before they write produce fewer regressions than agents that jump straight to editing.

Full post + code in the comments.
