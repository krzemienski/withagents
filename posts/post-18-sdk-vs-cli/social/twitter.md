# X Thread — Post 18

**Tweet 1:** Last post. 23,479 sessions, 11.6GB of data, 27 projects over 42 days.

The question I get asked more than any other: Anthropic SDK, Claude Code CLI, or Agent SDK?

The question itself is wrong. The right question: what does the task need?

**Tweet 2:** I built the same content pipeline three times. SDK, CLI, hybrid.

SDK version: 3x the lines of code, roughly 40% of the API cost per invocation.
CLI version: four bash commands, handled edge cases I hadn't considered.
Hybrid: shipped to production.

**Tweet 3:** Three distinct approaches. Solve fundamentally different problems.

Anthropic SDK = library. Direct API access. Every token goes through code you wrote.
Claude Code CLI = runtime. File ops, MCP servers, skills, hooks.
Agent SDK = framework. Tool loop + message threading built in.

**Tweet 4:** The Read-to-Edit ratio of 4.4:1 is the CLI's superpower.

87,152 Read calls across 23,479 sessions. Agents spend 80% of time understanding code before changing it. The CLI's built-in Glob, Grep, Read tools make exploration context-aware.

Rebuild that in the SDK? Weeks. Minimum.

**Tweet 5:** The MCP count nobody expects:

7,985 iOS simulator calls (taps, screenshots, a11y queries)
2,068 browser automation calls (Playwright + Puppeteer)
327 sequential thinking invocations
269 Stitch design generations

None of that exists in the raw SDK. Rebuilding any one is days of work.

**Tweet 6:** The anti-pattern I spent two days on: rebuilding CLI capabilities in the SDK.

File reading, diff generation, conflict resolution, codebase search — all from scratch. Until I realized I was reimplementing what `claude -p "edit this file"` does for free.

Don't be me.

**Tweet 7:** When the SDK wins:

Batch processing (>50 invocations).
CI/CD pipelines.
Classification tasks.
Custom tool schemas.
Per-agent tool restriction (planner read-only, builder can write).
Embedding Claude as one component in a larger system.

Per-token accounting. Typed responses.

**Tweet 8:** When the CLI wins:

Multi-file refactoring.
Exploratory coding.
Codebase understanding.
Anything needing MCP servers, hooks, or skills.

Anywhere the task is "work in this codebase" rather than "process this data."

**Tweet 9:** Most real projects are hybrid projects.

SessionForge: Next.js 15, 59 DB tables. Standard app code for CRUD. Claude for content intelligence — session analysis, insight extraction, post generation.

The boundary is clean. Scoring algorithm in app code. Blog drafts through Claude. Neither needs the other's tool.

**Tweet 10:** Distilled to one rule after 23,479 sessions:

Use the SDK when Claude is a function in your system. The scalpel.
Use the CLI when Claude is a developer on your team. The operating room.
Use both when your system has both needs. Most do.

Every claim in this series traces to a real session. That's the bar.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
