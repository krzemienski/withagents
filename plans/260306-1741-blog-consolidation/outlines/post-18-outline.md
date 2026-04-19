# Post 18: "SDK vs CLI: When Each Approach Wins"

## Metadata
- Target word count: 2,000
- Source posts: NEW
- Companion repo: `hls-dash-dev-chrome-extension`
- New content needed: Yes — entirely new. Decision framework derived from real comparison between ccb (CLI subprocess, 955 lines bash), autonomous-coder (SDK, Python claude-code-sdk), and SessionForge (hybrid, Next.js 15 + Claude sessions).

## Opening (hook — 2 sentences max)
I built the same feature twice — once with the SDK, once with the CLI. The SDK version took 3x the code and cost 40% less.

## Narrative Arc
1. **Two Ways to Run Claude Programmatically** — The Anthropic SDK (Python/TypeScript) gives you direct API access: create messages, define tools, handle responses, manage tokens. Claude Code CLI gives you a full development environment: file operations, MCP servers, skills, hooks, built-in tools (Edit, Write, Bash, Glob, Grep). They solve different problems. The SDK is a library; the CLI is a runtime. Most people pick one without understanding the trade-off. Source: real experience building with both across 4,500 sessions. ~300 words

2. **SDK Strengths: Control, Cost, Custom Tools** — Direct API means you control every token. No overhead from system prompts, hook evaluation, skill loading, or MCP server startup. You define exactly which tools the model can use via function calling. Token counting is precise — you know the cost before sending. Custom tool definitions let you create domain-specific capabilities that the CLI does not support. The ccb-ai-instructions.md pattern: the original builder used `anthropic.Anthropic()` client with custom tool definitions for SpecAnalyzer, TaskGenerator, InstructionBuilder — each agent had exactly the tools it needed, nothing more. Real cost comparison: SDK calls for simple classification tasks cost $0.002-0.01; equivalent CLI invocations cost $0.05-0.15 due to system prompt overhead. Source: ccb-ai-instructions.md agent architecture (4 agents with specific tool sets). ~400 words

3. **CLI Strengths: Ecosystem, Skills, MCP** — The CLI gives you everything built in: file operations that handle conflicts, MCP servers for external tools, skills for reusable workflows, hooks for enforcement, built-in web search, Glob/Grep for codebase exploration. The ccb bash script pattern: `claude --print --model claude-opus-4 --mcp-config .mcp.json --allowedTools "web_search,Edit,View,Write,Bash" --max-turns 30` — one command gives you a full development environment. Skills load context-specific workflows without writing tool definitions. Hooks enforce discipline without writing validation code. The CLI understands code — it knows how to read files, make edits, run builds, check diagnostics. With the SDK, you build all of that yourself. Source: cc-ccb-builder-script-old.sh run_claude_auto() function. ~400 words

4. **The Hybrid Pattern: SessionForge** — SessionForge uses Next.js 15 (App Router) + React 19 + PostgreSQL (59 tables via Drizzle ORM) for the application layer, then orchestrates Claude sessions for content generation. The application owns the UI, database, scheduling, and publishing integrations (7 platforms). Claude handles the content intelligence — session analysis, insight extraction, content generation. The boundary: structured operations (CRUD, scheduling, analytics) in application code; unstructured operations (content generation, analysis, recommendations) delegated to Claude. 6-dimension weighted scoring algorithm runs in application code; the blog post writing runs via Claude. Source: SessionForge README — real hybrid architecture with 59 database tables. ~350 words

5. **Decision Framework** — Use the SDK when: you need precise token control, you are building a product where Claude is one component, you need custom tool definitions, you are optimizing for cost at scale, you want to embed AI in an existing application. Use the CLI when: you need file operations and codebase understanding, you want skills/hooks/MCP without building them, you are automating development tasks, you need the full coding environment, the task is "do development work." Use hybrid when: your application has both structured and unstructured work, you need a UI around AI capabilities, you are building a content platform or developer tool. The anti-pattern: using the SDK to rebuild what the CLI already provides (file editing, code search, build running). The other anti-pattern: using the CLI for simple API calls that do not need a development environment. Source: synthesis from ccb (CLI), autonomous-coder (SDK), SessionForge (hybrid). ~350 words

## Key Code Blocks to Include
- The `run_claude_auto()` bash function from ccb showing CLI subprocess invocation — `claude --print --model $MODEL --mcp-config .mcp.json --allowedTools "$tools" --dangerously-skip-permissions` (~15 lines)
- An SDK agent pattern from ccb-ai-instructions.md — `anthropic.Anthropic()` client with custom tool definitions and async response handling (~15 lines)
- The decision framework as a simple flowchart/table: "Need file ops? -> CLI. Need token control? -> SDK. Need both? -> Hybrid." (~10 lines, ASCII table)

## Real Data Points
- ccb CLI approach: 955-line bash script, 12 phases, `claude --print` with --max-turns 30
- ccb SDK approach: 4 custom agents (SpecAnalyzer, TaskGenerator, InstructionBuilder, Executor) with Anthropic Python SDK
- enhanced builder: 2,081 lines, dual model routing (Opus for complex, Sonnet for simple)
- SessionForge hybrid: Next.js 15, React 19, 59 PostgreSQL tables, 7 publishing integrations, Claude for content intelligence
- autonomous-coder: Python claude-code-sdk package, 3-phase architecture
- SDK overhead: custom tool definitions, response parsing, error handling, token counting — all manual
- CLI overhead: system prompt loading, hook evaluation, MCP server startup, skill scanning — all automatic
- Cost comparison: SDK simple tasks $0.002-0.01 vs CLI equivalent $0.05-0.15 (system prompt overhead)

## Material to NOT Include
- Plugin architecture details (post 16)
- Skill writing mechanics (post 15)
- iOS streaming bridge specifics (posts 4-5)
- Full SessionForge feature list (it is the example, not the subject)
- Anthropic API reference documentation (readers can find that themselves)
- Pricing tables or model comparison (changes too fast to be useful in a blog post)
- The CCB evolution narrative (post 17 covers that — this post focuses on the SDK/CLI decision, not the history)

## Companion Repo Tie-in
The `hls-dash-dev-chrome-extension` repo demonstrates the SDK/CLI comparison in practice — a Chrome extension where the extension logic runs in TypeScript (structured, no AI needed) and the media analysis features use Claude SDK for classification and CLI for codebase-aware development tasks. Post ends with: "The SDK gives you a scalpel. The CLI gives you an operating room. SessionForge taught me that most real projects need both — structured operations in application code, unstructured intelligence delegated to Claude. Pick the tool that matches the task, not the one you learned first."
