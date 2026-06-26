// Full post bodies for posts 01 and 02 — verbatim from source manuscripts,
// rendered through a typed block model the reader knows how to display.

const POST_01_BODY = [
  { type: 'lead', text: "I averaged 559 AI coding sessions per day for 42 days straight. Not prompts. Sessions. Each one a self-contained agent with its own context window, its own task, its own tools." },
  { type: 'p', text: "23,479 total. 3,474,754 lines of interaction data across 27 projects. This series is what I learned." },
  { type: 'p', text: "Here's the short version: AI agents fail in predictable ways. They forget across sessions. They declare victory without evidence. They build features that look correct but do nothing. They pick expensive models for trivial tasks. They corrupt each other's work when they edit the same file. Every system I built over those 42 days — consensus gates, functional validation, cross-session memory, orchestration loops, enforcement hooks — exists because one of those failures hit me in production. Nineteen posts. Every claim traceable to a real session. Every system backed by a companion repo you can clone and run." },

  { type: 'h2', text: 'The Numbers' },
  { type: 'p', text: "23,479 sessions. I started 4,534 of them. The other 18,945 were agents spawning agents. An orchestrator delegates to a reviewer, the reviewer spawns a verifier, the verifier reports back up the chain. That's a 1:4.2 ratio. Every time I kicked off a session, the system spawned roughly four more on its own." },
  { type: 'p', text: "The tool leaderboard tells you what agents actually do with their time:" },
  { type: 'chart', kind: 'bars', title: 'Top 10 Tool Invocations (23,479 Sessions)',
    data: [
      { l: 'Read',       v: 87152 }, { l: 'Bash',       v: 82552 },
      { l: 'Grep',       v: 21821 }, { l: 'Edit',       v: 19979 },
      { l: 'Glob',       v: 11769 }, { l: 'Write',      v: 9066  },
      { l: 'TaskUpdate', v: 4852  }, { l: 'Task',       v: 2827  },
      { l: 'idb_tap',    v: 2620  }, { l: 'ToolSearch', v: 2366  },
    ] },
  { type: 'p', text: "Read leads everything. 87,152 file reads versus 19,979 edits, a 4.4:1 ratio. Throw in Bash (82,552, mostly commands to understand state) and Grep (21,821 searches), and the picture gets starker: agents spend roughly 80% of their tool invocations understanding code and 20% changing it." },
  { type: 'p', text: "That ratio is the thesis of this entire series. Agents that read before they write produce fewer regressions than agents that jump straight to editing. The most productive thing an AI agent does isn't writing code. It's understanding the code that already exists." },
  { type: 'pull', text: "Agents aren't generators. They're readers that occasionally write." },
  { type: 'table', title: 'Tool category breakdown', cols: ['Category', 'Tools', 'Invocations', '%'],
    rows: [
      ['Understanding', 'Read, Bash, Grep, Glob', '203,294', '79.1%'],
      ['Changing',      'Edit, Write',            '29,045',  '11.3%'],
      ['Coordinating',  'Task*, SendMessage, Agent', '13,920', '5.4%'],
      ['Validating',    'idb_*, simulator_*, browser_*', '10,053', '3.9%'],
      ['Other',         'Skill, WebSearch, TodoWrite', '5,658', '2.2%'],
    ] },
  { type: 'p', text: "The coordination column is where things get wild. 2,827 Task spawns. 4,852 TaskUpdates. 2,182 TaskCreates. 1,720 SendMessages. That's an entire organizational layer. Agents creating teams, assigning work, reporting status. None of that existed when I started. The 929 inline Agent calls are ad-hoc delegation: an agent decides mid-task that it needs a specialist and spins one up on the spot. I didn't design that behavior. It emerged." },

  { type: 'h2', text: 'Five Failure Modes' },
  { type: 'p', text: "Every system in the next eighteen posts exists because something broke. These five failure modes showed up in the first week and never stopped." },
  { type: 'failures' },
  { type: 'p', text: "Amnesia. An agent makes the same mistake in session 500 that it made in session 5. Context windows reset between sessions. I watched an agent introduce the same SwiftUI retain cycle three separate times across three weeks. Same view, same cycle, same fix. The third time, I built a cross-session memory system: an SQLite-backed observation store with semantic search and automatic pruning. That system reduced repeated mistakes by 73% across the projects where it was deployed." },
  { type: 'p', text: "Confidence without evidence. An agent reports \"feature complete\" without proof. Build passes. TypeScript shows zero errors. Victory declared. But the feature doesn't work. An empty onClick handler passed every automated check. Syntactically valid, correctly typed, properly imported. Zero functional behavior. Across all sessions, the block-test-files hook fired 642 times, preventing agents from writing tests that mirror their own assumptions instead of exercising real features through real UI." },
  { type: 'p', text: "Completion theater. Ever seen a Delete Account button with the correct icon, the correct confirmation dialog, and the correct loading spinner, where the onClick handler calls a function with the correct signature and the function body is a TODO comment? Every automated check passed. Think about that. The three-layer validation stack catches this class of failure through real interactions: 7,985 iOS simulator MCP calls (taps, gestures, accessibility queries, screenshots) and 2,068 browser automation calls (clicks, navigations, screenshots). Real buttons. Real forms. Real validation." },
  { type: 'p', text: "Wrong model for the job. Using Opus to analyze a typo. Using Haiku to design a database schema. Why would you do either? Routing by complexity (Haiku for lookups, Sonnet for implementation, Opus for architecture) cut costs by 82% with equivalent output quality. Three rules, no machine learning, no classifier." },
  { type: 'p', text: "Coordination failures. Two agents edit the same file. The merge produces valid code that serves JWT verification internals as a REST endpoint. Token payloads, signature validation state, expiry calculations, all exposed to unauthenticated callers. File ownership maps with glob patterns fixed it. That system and its 2.3x speedup over sequential execution is the subject of Post 2." },

  { type: 'h2', text: 'From Autocomplete to Operating System' },
  { type: 'p', text: "The turning point was a framing shift: stop using AI as autocomplete and start treating it as a team of specialized workers." },
  { type: 'p', text: "Autocomplete operates inside a single context window. A team operates across multiple context windows with coordination protocols between them. The context window isn't just a limitation. It's an architecture boundary. Each agent gets a fresh window, a specific role, and a defined scope. The orchestrator coordinates across those boundaries using the filesystem, not shared memory." },
  { type: 'p', text: "4,534 human-initiated sessions versus 23,479 total tells the story: 81% of all sessions were agents spawning other agents. The coordination infrastructure (2,827 Task spawns, 4,852 TaskUpdates, 2,182 TaskCreates, 1,720 SendMessages) is an organizational layer running on top of Claude Code. I didn't plan it that way. It emerged because single-agent workflows kept hitting the five failure modes above." },
  { type: 'p', text: "Here's what that looks like in practice. Session 33771457 in the ils-ios project: the orchestrator needed to consolidate five incomplete iOS specifications into one production spec. It spawned 13 different team configurations over the course of the session. First a design team, one architect and three validators. The architect drafted; the validators reviewed independently and voted. When consensus was reached, the orchestrator dissolved the team and created an implementation team: one executor, three new validators. When implementation gates passed, a final consensus checkpoint team produced the unanimous PASS/FAIL verdict. Eighty agent operations total. I typed one sentence to start it." },

  { type: 'h2', text: 'Four Patterns That Survived' },
  { type: 'p', text: "Across 23,479 sessions, four patterns survived contact with real codebases. Everything else? Good ideas that didn't hold up." },
  { type: 'patterns' },
  { type: 'p', text: "Consensus gates are best understood by watching them run. Pick a scenario below — the change gets sent to three reviewers (Lead, Alpha, Bravo) running with different system prompts. Each votes independently, then the gate computes a verdict. No reviewer can ship alone." },
  { type: 'interactiveGate' },
  { type: 'p', text: "Consensus gates (Post 2). No single agent reviews its own work. Three agents with different system prompts evaluate every change. Unanimous agreement required. Cost: $0.15 per gate. The three-agent review caught the += bug that had been hiding for three days. Alpha flagged the operator as inconsistent with the API's full-message response format. Bravo flagged the index reset as a state management hazard. Lead flagged both as violations of the streaming module's own documentation comments." },
  { type: 'p', text: "Functional validation (Post 3). No mocks, no stubs, no unit tests. Build the real system, run it, exercise it through the actual UI, capture screenshots as evidence. iOS numbers: 2,620 screen taps, 2,165 screenshots, 1,239 accessibility tree queries, all through the simulator MCP. Browser numbers: 604 clicks, 524 navigations, 465 screenshots, all through Playwright. One session alone ran 674 Playwright tool calls in a single validation pass. That session caught a stale .next cache bug that next build said didn't exist. I'm still annoyed about that one — I'd spent two hours blaming my code before the agent proved it was a build cache issue." },
  { type: 'p', text: "Fresh context over accumulated context (Posts 8, 13). Long-running sessions accumulate stale assumptions. Have you ever watched an agent confidently reference code it read 30 minutes ago that's since been rewritten by another agent? I have. The fix: short-lived agents with fresh context. Give each agent exactly the files it needs, let it do one thing, and kill it. The 327 sequential thinking invocations across the dataset show this pattern at its most disciplined — structured reasoning chains where an agent builds a mental model step by step before proposing a single change." },
  { type: 'p', text: "Filesystem as persistence layer (Posts 11, 12, 16). Agents can't share memory. They can share files. Plans, reports, validation evidence, consensus votes, all written to disk in structured formats. When an agent needs context from a previous agent's work, it reads a file, not a chat history. VG1.2 from session ad5769ce: \"EventBus emits events\" — evidence: curl emit&count=10 returns {\"emitted\":10, \"subscriberCount\":1, \"ringBufferSize\":10}. Not \"it works\" but \"here is the exact JSON proving it works.\"" },

  { type: 'h2', text: 'The Economics' },
  { type: 'p', text: "The ils-ios project is the largest in the dataset: 4,241 session files, 1,563,570 lines of data, 4.6GB. 149 Swift files, 24 screens, a macOS companion, 13 visual themes. Total Claude API cost: approximately $380." },
  { type: 'p', text: "That cost only makes sense with model routing:" },
  { type: 'economics' },
  { type: 'p', text: "82% savings. A project with 200 consensus gates costs $30 with routing versus $168 without. Three rules: lookups go to Haiku, implementation goes to Sonnet, architecture review and complex debugging go to Opus." },
  { type: 'p', text: "RALPLAN, the adversarial planning system, showed why planning consensus pays for itself. A Supabase auth migration got decomposed into 14 tasks by the Planner. Looked clean. The Architect vetoed it. Supabase Row Level Security policies reference auth.uid(), which returns Supabase's internal user ID, not a custom JWT's subject claim. Seven of the 14 tasks assumed RLS compatibility. They would've compiled. They would've passed type checks. They would've failed silently at runtime, allowing unauthorized data access. Three rounds of adversarial review caught it. Cost of those review rounds: under $2. Cost of shipping a silent auth bypass: I don't want to think about it." },

  { type: 'h2', text: 'What the Next Eighteen Posts Cover' },
  { type: 'p', text: "The posts are organized by problem, not chronology. Post 2 starts with the bug that started everything: line 926, += instead of =, and the three-agent consensus system that caught it." },
  { type: 'p', text: "Each post has a companion repo. Each repo has working code. Each claim traces back to one of 23,479 real sessions generating 3,474,754 lines of data over 42 days. No fabricated examples. No mock data. Just what actually works when you run AI agents at scale." },

  { type: 'h2', text: 'What You\'ll Walk Away With' },
  { type: 'list', items: [
    'A consensus gate framework that catches bugs single-agent reviews miss ($0.15 per gate)',
    'A functional validation protocol that replaces unit tests with real UI interaction',
    'An orchestration system that coordinates multiple agents without file conflicts',
    'A cross-session memory store that keeps agents from repeating the same mistakes',
    'A model routing strategy that cuts API costs by 82%',
    'A prompt engineering stack that composes seven layers of context',
    'Enforcement hooks that stop agents from cutting corners',
  ] },
  { type: 'p', text: "Next post starts with the bug that started everything. Line 926, += instead of =, and the three-agent consensus system that caught it." },
];

const POST_02_BODY = [
  { type: 'lead', text: 'A single AI agent reviewed my streaming code and said "looks correct." Three agents found a P2 bug on line 926 that\'d been hiding for three days.' },
  { type: 'p', text: "That gap between one confident wrong answer and three analyses converging on the real problem? It's why every code change in my system now goes through a unanimous consensus gate before it ships." },
  { type: 'p', text: "I've watched solo agents approve broken code across 929 agent spawns. Not because the agents were bad. Because reviewing your own assumptions gives you reviews that share your own blind spots. The fix isn't a better agent. It's three agents that disagree with each other until they converge." },

  { type: 'h2', text: 'The Bug on Line 926' },
  { type: 'p', text: "Line 926 of my iOS app's streaming message handler:" },
  { type: 'code', lang: 'swift', caption: 'streaming handler · line 926 · WRONG', text: 'message.text += textBlock.text' },
  { type: 'p', text: "Should've been:" },
  { type: 'code', lang: 'swift', caption: 'streaming handler · line 926 · RIGHT', text: 'message.text = textBlock.text' },
  { type: 'p', text: "One character. += instead of =. The streaming system accumulated text blocks arriving from the Claude API. Each block contained the full message up to that point, not a delta. So += appended the full accumulated text to what was already there. After three blocks, \"Hello\" became \"HHeHelHello,\" with each block doubling what came before." },
  { type: 'p', text: "The second root cause was subtler. The stream-end handler reset lastProcessedMessageIndex to zero, which replayed the entire message buffer on the next event. Combined with +=, messages grew exponentially. A five-sentence response turned into an unreadable wall of duplicated text, growing with each chunk." },
  { type: 'pull', text: "Three days. This sat in the codebase for three days." },
  { type: 'p', text: "I ran a solo agent review on the streaming module. It read top to bottom, checked types, verified function signatures matched the protocol. No issues found. Code was syntactically valid. Types correct. Protocol conformance complete. Everything a single-pass review checks came back clean." },
  { type: 'p', text: "Then I ran three agents with different review mandates. Alpha caught the +=. The API sends full messages, not deltas, so appending makes no sense. Bravo came at it from a completely different angle: what happens when one stream ends and another begins? That index reset replays the entire buffer. And Lead pointed out the module's own doc comments explicitly say text blocks are cumulative. Three reasoning paths, same conclusion." },

  { type: 'h2', text: "Why One Agent Isn't Enough" },
  { type: 'p', text: "Ever had a code review where the reviewer just... agreed with everything? That's what happens when the same entity writes and reviews code. Same assumptions, same blind spots, same reasoning that produced the bug. I've watched this play out across 929 agent spawns. It isn't theoretical." },
  { type: 'p', text: "The Frankenstein merge made it concrete. Two agents worked on the same backend service. Agent A built JWT verification: token parsing, signature validation, expiry checks. Agent B built the REST endpoint layer: routes, request handling, responses. Neither knew the other existed." },
  { type: 'p', text: "The merge produced valid code. TypeScript compiled clean. Linter passed. But the application served raw JWT verification internals as a REST endpoint. Token payloads. Signature validation state. Expiry calculations. All exposed to unauthenticated callers." },
  { type: 'p', text: "Think about that for a second. A security vulnerability that passed every static check because each agent's contribution was individually correct. The bug lived entirely in the gap between two agents' assumptions about how their code would combine. No single-agent review would've caught it, because each agent would just confirm its own work looked fine." },

  { type: 'h2', text: 'Three Roles, Not Three Copies' },
  { type: 'p', text: "The system doesn't run three identical agents. Same prompt three times just gives you three copies of the same blind spot. Each agent gets a different review mandate targeting different failure domains." },
  { type: 'roles' },
  { type: 'p', text: "Lead handles architecture and consistency. Does this change fit existing patterns? Introduce duplicate abstractions? Lead wouldn't have found the += bug. That's not an architecture issue. But Lead caught the Frankenstein merge immediately because the merged code blew right through the service's architectural boundaries." },
  { type: 'p', text: "Alpha does line-by-line logic. Alpha found the += because the API docs say each text block contains the full message so far. If message.text already holds the previous block's content, appending the current block doubles everything. Alpha's system prompt encodes this as \"THE += vs = PRINCIPLE,\" calling out the most dangerous bugs: the ones that look correct when you read them in isolation." },
  { type: 'p', text: "Bravo thinks about what happens at runtime. Will this work deployed? Race conditions? Realistic failure modes? Bravo found the index reset by reasoning through the streaming lifecycle: stream ends, next stream begins, index goes to zero, handler replays every message from the buffer. Combined with any accumulation bug, that replay compounds the damage. Bravo's prompt says it plainly: \"Alpha reads code. You RUN things.\"" },
  { type: 'p', text: "Here's the actual gate output from the streaming audit:" },
  { type: 'gate' },
  { type: 'p', text: "Lead found the scope: both SDK and CLI code paths share the flaw. Alpha found the line and the semantic error. Bravo found the user-visible symptom. None would've been enough alone. Together, complete picture." },

  { type: 'h2', text: 'The Consensus Gate Framework' },
  { type: 'p', text: "The gate itself is the simplest part. A ThreadPoolExecutor runs all three agents in parallel, then checks for unanimity:" },
  { type: 'code', lang: 'python', caption: 'gate.py · run_gate_check', text:
`def run_gate_check(phase_name, gate_number, target_path, config, ...):
    roles = [LEAD, ALPHA, BRAVO]
    votes: list[Vote] = []

    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_role = {
            executor.submit(run_agent_validation, role_def, phase_name,
                            target_path, config): role_def
            for role_def in roles
        }
        for future in as_completed(future_to_role):
            votes.append(future.result())

    return GateResult.from_votes(phase_name, gate_number, votes)` },
  { type: 'p', text: "Each agent runs as a separate claude --print subprocess with its role-specific system prompt. No shared state during evaluation. Unanimous voting. Not majority. Any agent raises a concern, the gate blocks. This is deliberately conservative, and that's the whole point. A false positive (blocking a valid change for re-review) costs a few minutes and about $0.15. A false negative (shipping the += bug) costs three days of broken messages and trust you can't buy back." },
  { type: 'p', text: "The re-validation step is critical and easy to screw up. When a gate fails and you fix the issue, ALL THREE agents re-validate, not just the one that originally failed. This catches fixes that solve one problem but introduce a new one that only a different agent's perspective would spot. Three fix cycles max. Can't reach unanimity after three rounds? Escalates to a human. In practice, most gates converge on the first or second cycle." },

  { type: 'h2', text: 'The Pipeline: Four Phases, Four Gates' },
  { type: 'p', text: "The framework isn't just one gate. It runs four phases, each with its own checkpoint." },
  { type: 'pipeline' },
  { type: 'p', text: "Explore maps the codebase. All three agents independently trace the architecture and note concerns. The gate makes sure everyone has a complete picture before the deep audit." },
  { type: 'p', text: "Audit is the deep review. This is where the += got caught. Each agent applies its specialized lens." },
  { type: 'p', text: "Fix verifies fixes actually address the findings. All three agents check independently. Catches the \"fix that creates a new bug\" pattern." },
  { type: 'p', text: "Verify is end-to-end. Does the system actually work? Bravo's biggest moment." },
  { type: 'p', text: "Lead runs on Opus for deeper architectural reasoning. Alpha and Bravo run on Sonnet, fast enough for line-level analysis and system-level checks. All three run in parallel, so wall-clock time equals the slowest agent (typically 15-30 seconds per gate). Four-gate pipeline: roughly $0.60 total." },

  { type: 'h2', text: 'Institutional Knowledge: Prompts That Learn' },
  { type: 'p', text: "Here's the part I didn't expect. Each agent's system prompt accumulates real bug patterns over time. After 200 gates, Alpha has 47 specific patterns to check. Bravo has 31. Lead has 22. Every bug the system catches becomes a permanent instruction:" },
  { type: 'code', lang: 'text', caption: 'alpha · pattern · streaming accumulation', text:
`CRITICAL PATTERN: += vs = in streaming accumulation
When processing streaming text blocks, verify whether each block
contains a delta (append) or the full message (assign). The API
documentation says "full message" but the variable name suggests
"delta." Check the actual API response format, not the variable name.` },
  { type: 'p', text: "When a bug gets caught, I extract the detection heuristic (what made it catchable) and encode it as six lines in the relevant agent's prompt. Alpha's 47 patterns cover streaming semantics, off-by-one errors in pagination, optional chaining pitfalls, async race conditions. Each one's a scar from a real incident." },
  { type: 'p', text: "Maintenance cost? Basically zero. They're version-controlled text files. When something slips through, I add a pattern. After 200 gates, the system catches things gate 1 would've missed. The prompts compound." },

  { type: 'h2', text: 'The 75-TaskCreate iOS Audit' },
  { type: 'p', text: "How far does this scale? Session f9d4b6e2 ran a 6-phase, 10-gate validation of dual-mode iOS streaming (SDK and CLI modes). Lead, Alpha, and Bravo each ran on separate iOS simulators, independently examining UI state through every gate. 75 individual TaskCreate operations for a single audit." },
  { type: 'code', lang: 'text', caption: 'gate 1 · three-agent consensus achieved', text:
`| Agent | Vote | Tests              | Key Evidence              |
|-------|------|--------------------|---------------------------|
| Lead  | PASS | 4/4 cURL + 3 sims  | gate1-lead-vote.md        |
| Alpha | PASS | 18/18 cURL         | 12 vg1-*.txt files        |
| Bravo | PASS | 23 screenshots     | bravo-01 through bravo-23 |

Result: GATE 1 — PASS with 2 findings for investigation.` },
  { type: 'p', text: "Two findings despite a PASS. Gate passed unanimously, but agents still flagged things worth investigating. That's the difference between \"approve with notes\" and \"reject.\"" },
  { type: 'p', text: "The gate blocked on Bravo during voting. Lead and Alpha had already voted PASS, but the gate couldn't advance until all three were in. Bravo was still on its 23rd screenshot, methodically checking text rendering across different message lengths and streaming speeds. The gate waited. That's unanimous voting in practice: the fastest agents wait for the most thorough one." },

  { type: 'h2', text: 'File Ownership: Preventing the Frankenstein Merge' },
  { type: 'p', text: "Multi-agent teams have a coordination problem consensus alone doesn't solve: who owns which files? The Frankenstein merge happened because two agents edited adjacent code without knowing about each other. File ownership via glob patterns prevents it:" },
  { type: 'code', lang: 'python', caption: 'ownership map', text:
`ownership = {
    "auth-agent":  ["src/auth/*", "src/middleware/auth*"],
    "api-agent":   ["src/routes/*", "src/controllers/*"],
    "data-agent":  ["src/models/*", "src/migrations/*"],
}` },
  { type: 'p', text: "Before an agent writes to a file, the orchestrator checks the ownership map. File belongs to another agent? Blocked. Two agents literally can't edit the same file." },
  { type: 'p', text: "Here's the thing. Humans notice when they're about to touch someone else's code. The directory's unfamiliar, the patterns look different, the imports are foreign. Agents don't have that spatial awareness. They'll edit whatever the prompt tells them to, regardless of who else is working in the same area. Programmatic enforcement replaces the social awareness humans take for granted." },
  { type: 'p', text: "When two agents genuinely need the same file, the lead makes the change and distributes the result. Single writer, everyone else reads." },

  { type: 'h2', text: 'When Not to Use Consensus' },
  { type: 'p', text: "It costs money. Roughly $0.15 per gate, $0.60 for a four-phase pipeline. So when is it worth it?" },
  { type: 'whenList' },
  { type: 'p', text: "The += bug cost three days of debugging. The Frankenstein merge could've exposed tokens to the internet. $0.15 to prevent either isn't even a conversation." },

  { type: 'h2', text: 'The Asymmetry That Makes It All Work' },
  { type: 'p', text: "False positive: gate blocks a valid change. Costs five minutes and $0.15 for re-review. False negative: gate ships the += bug. Costs three days of corrupted messages and user trust you can't buy back. Every design choice here leans toward the first failure mode. Unanimous voting. Distinct mandates. Institutional knowledge. File ownership. Full re-validation after fixes. All weighted the same direction." },
  { type: 'pull', text: "False positive rate runs around 8%. The bugs the other 92% catches would've shipped." },
  { type: 'p', text: "The += would've corrupted every message in the iOS app. The Frankenstein merge would've exposed JWT internals to unauthenticated callers. The Supabase RLS gap would've been a data breach." },
  { type: 'code', lang: 'bash', caption: 'multi-agent-consensus · run', text:
`pip install multi-agent-consensus

# Spawns Lead, Alpha, Bravo in parallel
consensus run --target ./your-project

# Single phase: explore, audit, fix, or verify
consensus run --target ./src/api --phase audit

# JSON output for CI
consensus run --target ./your-project --output-format json > gate-result.json` },
  { type: 'p', text: "What's next: how functional validation catches failures that even three agents reviewing source code can't see. Because reading code, no matter how many perspectives you throw at it, isn't the same as running it." },
];

const POST_18_BODY = [
  { type: 'lead', text: "Last post. Nineteen entries, 23,479 sessions, 11.6 GB of session data across 27 projects over 42 days. And the question I get asked more than any other is this: should I use the Anthropic SDK, the Claude Code CLI, or the Agent SDK?" },
  { type: 'p', text: "I kept arriving at the same answer. After building the same feature multiple ways. After burning money on the wrong approach. After watching agents succeed brilliantly in one mode and fail catastrophically in another. The question itself is wrong. The right question is: what does the task need?" },
  { type: 'p', text: "I built the same content analysis pipeline three times. Once with the raw Anthropic SDK, once with the Claude Code CLI, once with a hybrid. The SDK version was roughly 3x the lines of code but ran at something closer to 40% of the API cost per invocation. The CLI version was four bash commands and handled edge cases I hadn't even considered. The hybrid version shipped to production. This post is the decision framework that emerged from those experiments and the 23,479 sessions that followed." },

  { type: 'h2', text: 'Three Ways to Run Claude Programmatically' },
  { type: 'p', text: "Three distinct approaches. They solve fundamentally different problems." },
  { type: 'p', text: "The Anthropic SDK (Python and TypeScript) gives you direct API access. You create messages, define tools, handle responses, manage token counts. Every token that goes in and comes out passes through code you wrote. It's a library." },
  { type: 'p', text: "The Claude Code CLI gives you a full development environment. File operations that handle conflicts. MCP servers for external tools. Skills for reusable workflows. Hooks for enforcement. Built-in code search with Glob and Grep. Across my sessions, I ran with playwright-mcp, firecrawl-mcp, chrome-devtools-mcp, shadcn-mcp, sequential-thinking, and oh-my-claudecode simultaneously. It's a runtime." },
  { type: 'p', text: "The Agent SDK sits between them. It gives you programmatic control with built-in tool handling, multi-agent coordination, and conversation management. You write TypeScript, but the SDK handles the tool loop, the message threading, and the agent lifecycle. It's a framework." },
  { type: 'pull', text: "Library vs runtime vs framework — that distinction drives every decision about which to use." },
  { type: 'p', text: "Here's the decision tree I actually run in my head now, distilled from the last 23,479 sessions and written out as pseudocode so it survives being copied into a project README:" },
  { type: 'code', lang: 'text', caption: 'decision tree', text:
`decide(task):
  Q1: Is this a one-shot or ad-hoc developer task?
      -> YES: Claude Code CLI. Stop here.
      -> NO:  continue

  Q2: Will this run >50 times without a human in the loop?
      -> YES: Anthropic SDK. Stop here.
      -> NO:  continue

  Q3: Does any single step need codebase context (Glob, Grep, Read)?
      -> YES: CLI for that step. Revisit Q2 for the rest.
      -> NO:  continue

  Q4: Do different agents need different tools?
      -> YES: Agent SDK — tool scoping is the whole reason it exists.
      -> NO:  continue

  Q5: Is Claude's output feeding another system?
      -> YES: Anthropic SDK. Typed responses, exact token counts.
      -> NO:  Hybrid. SDK for data steps, CLI for code steps.` },
  { type: 'p', text: "Why a tree and not a matrix? Matrices let you check every box. Trees force you to answer the first question honestly. Nine times out of ten, Q1 resolves the decision. The last one of those ten is where the framework earns its keep." },

  { type: 'h2', text: 'SDK: When You Need a Scalpel' },
  { type: 'p', text: "Direct API access means you control every token. No overhead from system prompts, hook evaluation, skill loading, or MCP server startup. The message you send is the message Claude processes. Nothing prepended, nothing injected." },
  { type: 'code', lang: 'typescript', caption: 'basic-agent.ts · direct SDK with tool loop', text:
`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const tools: Anthropic.Tool[] = [{
  name: "read_file",
  description: "Read the contents of a file at the given path",
  input_schema: {
    type: "object" as const,
    properties: { path: { type: "string" } },
    required: ["path"],
  },
}];

async function runAgent(prompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock ? textBlock.text : "";
    }
    // ... handle tool calls, push results, loop
  }
}` },
  { type: 'p', text: "That's 40 lines of TypeScript to get a working agent with custom tools. You control which model runs each call, how many tokens it can use, and exactly which tools are available. The SpecAnalyzer in my ccb builder could read and search but couldn't write files or run builds. The TaskGenerator could create task definitions but not implement them. Ever tried getting that kind of granularity with the CLI? You can't." },
  { type: 'p', text: "When the SDK wins: batch processing, CI/CD pipelines, classification tasks, custom tool schemas, embedding Claude as one component in a larger system. Anywhere you need per-token accounting or per-agent tool restriction." },

  { type: 'h2', text: 'CLI: When You Need an Operating Room' },
  { type: 'p', text: "The hat-rotation.sh script from the companion repo is the clearest CLI pattern I've found. Four phases, each a single claude -p call, output piped between phases:" },
  { type: 'code', lang: 'bash', caption: 'hat-rotation.sh · 4-phase CLI execution', text:
`#!/bin/bash

PLAN=$(claude -p "You are wearing the PLANNER hat.
Analyze the codebase and create an implementation plan for: $TASK")

BUILD_OUTPUT=$(claude -p "You are wearing the BUILDER hat.
Implement this plan: \${PLAN}")

REVIEW=$(claude -p "You are wearing the REVIEWER hat.
Review this implementation for bugs and improvements: \${BUILD_OUTPUT}")

if echo "$REVIEW" | grep -qi "CRITICAL\\|HIGH"; then
  claude -p "You are wearing the FIXER hat.
  Fix ONLY the CRITICAL and HIGH severity issues: \${REVIEW}"
fi` },
  { type: 'p', text: "Four commands. Full development workflow. Each phase gets the CLI's entire ecosystem: file operations that preserve surrounding code, MCP servers for external tools, skills for reusable workflows, hooks for enforcement. With the SDK, you'd build all of that yourself." },
  { type: 'p', text: "The numbers tell the story. Across 23,479 sessions:" },
  { type: 'table', title: 'CLI tool leaderboard', cols: ['Tool', 'Invocations', 'What it means'],
    rows: [
      ['Read',    '87,152', 'Agents read 10x more than they write'],
      ['Bash',    '82,552', 'Every build, test, and verification'],
      ['Grep',    '21,821', 'Codebase search before every change'],
      ['Edit',    '19,979', 'Context-preserving edits, not raw writes'],
      ['Write',    '9,066', 'New file creation (5x less than edits)'],
      ['Task',     '2,827', 'Agent-to-agent delegation'],
      ['idb_tap',  '2,620', 'iOS simulator touch interactions'],
    ] },
  { type: 'p', text: "That Read-to-Edit ratio of 4.4:1 is the CLI's superpower. Agents spend 80% of their time understanding code before changing it. The CLI's built-in Glob, Grep, and Read tools make that exploration fast and context-aware. How long would it take you to build equivalent file-handling in the SDK? I'd estimate weeks. Minimum." },
  { type: 'p', text: "Hooks enforce discipline at the tool boundary without any custom code. My block-test-files.js hook has prevented test file creation hundreds of times across projects. validation-not-compilation.js fires after every build to remind agents that \"it compiles\" isn't \"it works.\" With the SDK, you'd have to implement these checks in your tool handlers, intercepting every write call, checking file paths against patterns, injecting reminders after builds. The hook system does it in a 75-line JavaScript file." },
  { type: 'p', text: "When the CLI wins: multi-file refactoring, exploratory coding, codebase understanding, anything that needs MCP servers, hooks, or skills. Anywhere the task is \"work in this codebase\" rather than \"process this data.\"" },

  { type: 'h2', text: 'The Hybrid Pattern: Where Real Projects Land' },
  { type: 'p', text: "SessionForge taught me that the real answer is usually \"both.\"" },
  { type: 'p', text: "SessionForge is a content platform: Next.js 15, React 19, PostgreSQL with 59 tables managed through Drizzle ORM. The app handles user accounts, session management, content scheduling, analytics, and publishing across 7 platforms. Standard web application code." },
  { type: 'p', text: "The AI layer handles content intelligence. Session analysis, insight extraction, blog post generation, social media adaptation. These operations are unstructured. They need context, creative decisions, and variable-length output." },
  { type: 'p', text: "The boundary is clean: a 6-dimension weighted scoring algorithm runs in application code (deterministic formula, fixed weights, known inputs). A blog post draft runs through Claude (narrative structure, voice consistency, natural prose). The scoring algorithm doesn't need AI. The blog post doesn't need a database query. So why would you use the same tool for both?" },

  { type: 'h2', text: 'The Decision Framework' },
  { type: 'p', text: "After 23,479 sessions across 27 projects, the decision comes down to five questions:" },
  { type: 'list', items: [
    "Is the task about data or about code? Data processing points to the SDK. Code operations point to the CLI. Most production systems do both.",
    "How many times will this run? Once: CLI. Thousands: SDK. The crossover is around 50–100 invocations.",
    "Do you need the ecosystem? MCP servers, hooks, skills, Glob/Grep/Read. If your task needs any of these, use the CLI.",
    "Do you need per-agent tool restriction? If different agents should have different capabilities, use the SDK or Agent SDK.",
    "Does the output feed another system? DB row, queue, API call → SDK. Code changes in a repo → CLI.",
  ] },

  { type: 'h2', text: 'Cost Reality' },
  { type: 'p', text: "The cost comparison isn't as simple as \"SDK is cheaper.\" It depends entirely on the task profile. The dollar ranges below are order-of-magnitude guidance from my own runs, not quoted pricing — your mix of Opus vs Sonnet, your average prompt size, and your cache hit rate will shift every number." },
  { type: 'table', title: 'cost reality', cols: ['Scenario', 'SDK Cost', 'CLI Cost', 'Winner'],
    rows: [
      ['1,000 text classifications', 'low single $', 'tens to low hundreds $', 'SDK, by an order of magnitude'],
      ['Single multi-file refactor', 'days of tool-building', 'cents to low $', 'CLI, by a wide margin'],
      ['Daily CI security scan',     'cents/run',  'low $/run',  'SDK, several times cheaper'],
      ['Feature implementation',     'tool-building dominates', 'low $', 'CLI, by a wide margin'],
      ['Hybrid content pipeline',    'SDK batch + CLI code',    'all-CLI is noticeably higher', 'Hybrid is the best floor'],
    ] },
  { type: 'p', text: "The real cost insight isn't about per-token pricing. It's about development time. The SDK version of a multi-file refactoring tool takes days to build because you're writing file reading, diff generation, conflict resolution, and codebase search from scratch. The CLI version is claude -p \"refactor X to Y\" and it already handles all of that." },

  { type: 'h2', text: 'Anti-Patterns I Learned the Hard Way' },
  { type: 'list', items: [
    "Rebuilding CLI capabilities in the SDK. If your SDK code is implementing readFile, writeFile, searchCode, runBuild, just use the CLI. Don't be me.",
    "Using the CLI for batch processing. Running 500 CLI sessions to classify documents is like driving a moving truck to the grocery store.",
    "Using AI for deterministic operations. A weighted scoring formula doesn't need Claude. A database query doesn't need Claude. Write application code for deterministic operations.",
    "Ignoring the Agent SDK middle ground. If you're writing a while(true) loop to handle tool calls, the Agent SDK already solved that problem.",
  ] },

  { type: 'h2', text: 'The Framework, Distilled' },
  { type: 'pull', text: "Use the SDK when Claude is a function in your system. Use the CLI when Claude is a developer on your team. Use both when your system has both needs." },
  { type: 'p', text: "Most production systems do. The hybrid pattern isn't a compromise. It's the architecture that matches how real software works." },
  { type: 'p', text: "I'm honestly not sure which approach will win long-term. The Agent SDK keeps absorbing CLI features, and the CLI keeps getting more programmable. Maybe the distinction collapses in a year. But right now, in March 2026, the boundary is clear and the framework holds." },
];

export const POST_BODIES = {
  'post-01-23479-sessions': POST_01_BODY,
  'post-02-three-agents':   POST_02_BODY,
  'post-18-sdk-vs-cli':     POST_18_BODY,
};
