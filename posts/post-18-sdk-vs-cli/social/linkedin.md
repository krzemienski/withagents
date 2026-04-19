# LinkedIn — Post 18

Last post. 23,479 sessions, 11.6GB of session data across 27 projects over 42 days. The question I get asked more than any other: should I use the Anthropic SDK, the Claude Code CLI, or the Agent SDK?

The question itself is wrong. The right question is: what does the task need?

**Three Distinct Approaches**

Anthropic SDK is a library. Direct API access. Every token that goes in and comes out passes through code you wrote. Claude Code CLI is a runtime. File operations, MCP servers, skills, hooks, built-in code search with Glob and Grep. Agent SDK is a framework. Programmatic control with built-in tool handling and multi-agent coordination.

I built the same content pipeline three times. SDK version: 3x the lines of code, roughly 40% of the API cost per invocation. CLI version: four bash commands, handled edge cases I hadn't considered. Hybrid version: shipped to production.

**Read Before Write Is the CLI's Superpower**

87,152 Read calls across 23,479 sessions. 19,979 Edit calls. The 4.4:1 Read-to-Edit ratio means agents spend 80% of their time understanding code before changing it. The CLI's built-in Glob, Grep, and Read tools make that exploration fast and context-aware.

Rebuilding that in the SDK? Weeks, minimum.

The MCP count nobody expects: 7,985 iOS simulator calls, 2,068 browser automation calls, 327 sequential thinking invocations, 269 Stitch design generations. None of that exists in the raw SDK. Rebuilding any one is days of work. I spent two days building file-editing logic with diff/patch handling before realizing I was reimplementing what `claude -p "edit this file"` does for free.

**Most Real Projects Are Hybrid**

SessionForge taught me the real answer is usually "both." Next.js 15, 59 database tables, standard CRUD application code. The AI layer handles content intelligence: session analysis, insight extraction, blog post generation. The boundary is clean. A 6-dimension weighted scoring algorithm runs in application code. A blog post draft runs through Claude.

The scoring algorithm doesn't need AI. The blog post doesn't need a database query. Why use the same tool for both?

Use the SDK when Claude is a function in your system. You call it with structured input, you get structured output, you process thousands of them. The scalpel. Batch processing. CI/CD pipelines. Classification tasks. Per-token accounting.

Use the CLI when Claude is a developer on your team. It reads the codebase, understands context, makes multi-file changes, and validates its own work. The operating room. Multi-file refactoring. Exploratory coding. Anything needing MCP servers, hooks, or skills.

Use both when your system has both needs. Most production systems do. The hybrid pattern isn't a compromise. It's the architecture that matches how real software works.

Every claim in this series traces to a real session. Every system has a companion repo you can run yourself. 11.6 GB of session data across 42 days. The frameworks emerged from the failures, not from theory. The only original insight? The tools are ready. The decision is knowing which one to pick.

Full post + code in the comments.
