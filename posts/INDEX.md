# Agentic Development: 10 Lessons from 8,481 AI Coding Sessions -- Series Index

**Author:** Nick Krzemienski
**Scope:** 8,481 AI coding sessions | 90 days | 5.5 GB interaction data | 10 companion repositories | 11 posts | 22,489 words
**Series Repo:** [github.com/krzemienski/agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)

---

## 1. Series Overview

### What This Series Covers

Over 90 days, Nick Krzemienski built real products -- a native iOS client for Claude Code, a Rust orchestration platform, an audio story generator, a design-to-code pipeline -- almost entirely with AI coding agents. The series documents every pattern, failure, and architecture decision from that period. The 11 posts total 22,489 words, backed by 33 Mermaid diagrams, 10 data visualizations, and code from 10 companion repositories that all passed a four-phase publication audit (structural review, functional validation, documentation completeness, SDK compliance). 12 bugs were found and fixed across those repos before publication.

### Key Numbers

| Metric | Value |
|--------|-------|
| Total AI coding sessions | 8,481 |
| Worktree sessions (parallel) | 3,066 |
| Specialized agent types | 25 |
| Composable subsystems | 6 |
| Companion repositories | 10 |
| Evidence screenshots | 470 |
| Peak parallel worktrees | 194 |
| Commits on Code Tales | 636 |
| Words across 10 technical posts | 22,489 |
| Mermaid diagrams | 33 |
| Bugs found in publication audit | 12 |

### Target Audiences

**Practitioners** -- Engineers already using Copilot, Cursor, or Claude Code daily who have hit the ceiling of single-session productivity. They benefit most from Posts 2, 7, 5, and 11 (consensus gates, prompt engineering, functional validation, operating system design).

**Builders** -- Engineers and managers building products with AI agents who need to see the methodology applied end-to-end. They benefit most from Posts 4, 5, 6, and 9 (iOS client, SDK bridge, worktrees, Code Tales).

**Architects** -- Researchers and tooling developers designing the next generation of AI development infrastructure. They benefit most from Posts 8 and 11 (Ralph Orchestrator, AI Dev OS).

### Design System

The series uses a premium dark developer-focused aesthetic called **Midnight Observatory**:

- **Background:** Void Navy (#0f172a), Slate Abyss (#1e293b)
- **Accents:** Indigo Pulse (#6366f1), Cyan Signal (#22d3ee), Emerald Confirm (#059669)
- **Text:** Cloud Text (#f1f5f9), Slate Prose (#cbd5e1), Mist Caption (#94a3b8)
- **Typography:** System font stack, bold 800 headers, monospace code blocks (SF Mono / Fira Code)
- **Components:** 1200x630px hero cards, pill-shaped tags, dot grid overlays, gradient glow orbs
- **Social Cards:** Twitter 1200x628px, LinkedIn 1200x627px, matching dark gradient treatment

---

## 2. Post-by-Post Breakdown

---

### Post 1: 8,481 AI Coding Sessions. 90 Days. Here Is What I Learned.

**Purpose:** The series launch and orientation post. It introduces the entire 90-day journey, provides reading paths for different experience levels, summarizes all 10 technical topics, and presents the session distribution data, economics, and companion repo index. It is the front door to everything else.

**Core Narrative:** What started as using Claude Code for small tasks evolved into operating 25 specialized agent types across parallel worktrees, consensus gates, and persistent loops. The post traces that evolution from "faster autocomplete" to "an operating system for AI development I had not planned to build," and provides three reading paths (Practitioner, Builder, Architect) through the remaining 10 posts.

**Key Takeaway:** The ceiling of single-agent AI coding is real, but it is a ceiling of organization, not capability -- the same organizational principles that make human engineering teams effective (role specialization, independent review, evidence-based verification) make AI agent teams effective.

**Target Audience:** All three -- this is the entry point.

**Companion Repo:** `github.com/krzemienski/agentic-development-guide` (Markdown, meta-repo)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post1-journey-timeline.mermaid`, `assets/post1-series-roadmap.mermaid`
- SVG renders: `assets/post1-journey-timeline.svg`, `assets/post1-series-roadmap.svg`, `assets/review-comparison.svg`, `assets/series-stats.svg`, `assets/validation-comparison.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: LinkedIn** -- The professional audience here is ideal for a series launch. The "8,481 sessions" number in the headline is a strong hook for engineering leaders evaluating AI adoption. Use the full title as-is.
- **Secondary: Dev.to** -- Cross-post the full article. Dev.to's developer audience will appreciate the technical depth and companion repos. Tags: `ai`, `productivity`, `devops`, `programming`.
- **Secondary: Twitter/X** -- Publish as a long thread (15-20 tweets) summarizing the 10 lessons with one key stat per tweet. Pin the thread.
- **Hacker News** -- Submit with the title "8,481 AI Coding Sessions in 90 Days: What I Learned." HN rewards data-driven personal narratives. Best submitted Tuesday-Thursday, 9-11am ET.

**SEO Keywords:** AI coding sessions, agentic development, Claude Code, AI software engineering, multi-agent coding, AI developer tools, AI-assisted development at scale

**Pull Quotes:**
1. "Not the 'ask ChatGPT to write a function' kind of AI-assisted development. The 'coordinate 30 specialized agents working in parallel across a shared codebase, with hard consensus gates that block shipping until three independent reviewers agree' kind."
2. "The agent's context window is not just a limitation to manage -- it is an architecture boundary to design around."
3. "The total cost for the ILS iOS client -- 763 sessions over three months -- was approximately $380 in API costs. That is the cost of a junior developer for roughly half a day."

**Importance Score:** 9/10 -- Essential as the series anchor. Sets up the entire narrative, provides orientation, and contains the most shareable statistics.

---

### Post 2: A Single AI Agent Said "Looks Correct." Three Agents Found the P2 Bug.

**Purpose:** Introduces the multi-agent consensus pattern -- a framework where three specialized AI reviewers independently audit code and must reach unanimous agreement before changes ship. Demonstrates why single-agent review is structurally insufficient and provides a pip-installable implementation.

**Core Narrative:** A single agent reviewed streaming code in ChatViewModel.swift and said "looks correct." Three agents running a structured consensus audit caught a P2 bug on line 926 in the first pass: `+=` where it should have been `=` (one character). The bug would have shipped visible text duplication to users. The three-role pattern (Lead/Alpha/Bravo) with independent voting and unanimity gates catches bugs that single-agent review systematically misses.

**Key Takeaway:** When the same entity writes code and reviews it, the review has no epistemic value -- multi-agent consensus with role specialization and unanimity gates provides genuinely independent verification at $0.15 per gate.

**Target Audience:** Practitioner

**Companion Repo:** `github.com/krzemienski/multi-agent-consensus` (Python, Pydantic, Click CLI)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post2-consensus-gate.mermaid`, `assets/post2-role-perspectives.mermaid`
- SVG renders: `assets/post2-consensus-gate.svg`, `assets/post2-role-perspectives.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- The bug story is a perfect HN narrative: concrete, surprising, data-backed. Title: "A Single AI Agent Said 'Looks Correct.' Three Agents Found the P2 Bug." Submit Tuesday-Thursday, 9-11am ET.
- **Secondary: Reddit r/programming** -- Bug stories perform well. Same title.
- **Secondary: Dev.to** -- Full cross-post. Tags: `ai`, `codequality`, `codereview`, `programming`.
- **Twitter/X** -- Thread format: the bug, the three roles, the cost ($0.15), the ROI.

**SEO Keywords:** AI code review, multi-agent consensus, code quality AI, automated code review, Claude Code review, AI bug detection, consensus gate

**Pull Quotes:**
1. "A single AI agent reviewed my streaming code and said 'looks correct.' Three agents found a P2 bug on line 926."
2. "At $0.15 per gate and 10 gates per project, the total cost for comprehensive multi-agent review is $1.50. The bug it caught would have required a hotfix release and an App Store review cycle."
3. "The += appended to already-accumulated content. The = treats each event as authoritative. One character."

**Importance Score:** 10/10 -- The most viral-ready post in the series. Concrete bug story, surprising result, low cost, high ROI. This is the post that should lead the publishing sequence.

---

### Post 3: I Banned Unit Tests From My AI Workflow

**Purpose:** Presents the philosophical and practical case for replacing AI-generated unit tests with functional validation -- building real systems, running them, screenshotting them, and verifying against specs. Provides a framework, a CLI, and a migration guide.

**Core Narrative:** When an AI agent writes both the implementation and the unit tests, passing tests are not independent evidence of correctness -- they are a mirror reflecting itself. The replacement is functional validation: 470 evidence screenshots, 37+ validation gates, and four bug categories that unit tests systematically miss (visual rendering, integration boundary failures, second-interaction state bugs, platform-specific issues). The companion repo ships a Click CLI with gate YAML configurations.

**Key Takeaway:** AI-generated tests validate the agent's model of the problem, which is exactly the thing that might be wrong -- functional validation with real systems and screenshot evidence provides the independent signal that AI-generated test suites cannot.

**Target Audience:** Practitioner

**Companion Repo:** `github.com/krzemienski/functional-validation-framework` (Python, Click CLI, Playwright, httpx)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post3-evidence-flow.mermaid`, `assets/post3-evidence-pipeline.mermaid`, `assets/post3-test-vs-validation.mermaid`
- SVG renders: `assets/post3-evidence-flow.svg`, `assets/post3-evidence-pipeline.svg`, `assets/post3-test-vs-validation.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- Deliberately controversial title guarantees engagement. "I Banned Unit Tests From My AI Workflow" will generate debate. Submit with clarification in the first comment: "The argument is not that unit tests are bad. The argument is that when AI writes both code and tests, the tests are not an independent signal."
- **Secondary: Reddit r/ExperiencedDevs** -- This audience will appreciate the nuance and the migration guide.
- **Secondary: Medium** -- The controversial angle drives reads on Medium. Use the "Programming" and "Software Engineering" tags.
- **Dev.to** -- Full cross-post. Tags: `testing`, `ai`, `programming`, `softwareengineering`.

**SEO Keywords:** AI unit testing, functional validation, AI code testing, screenshot testing, evidence-based validation, AI testing framework, test-driven development AI

**Pull Quotes:**
1. "I said it out loud in a team meeting and watched the room go quiet: 'I don't write unit tests anymore. I banned them.'"
2. "When AI writes both the implementation AND the tests, passing tests are not independent evidence of correctness. They are a mirror reflecting itself."
3. "A passing test suite is an assertion. A timestamped screenshot is evidence."

**Importance Score:** 9/10 -- The most controversial post. Guaranteed to generate discussion. The "banned unit tests" framing is polarizing by design but the argument is rigorous.

---

### Post 4: The 5-Layer SSE Bridge: Building a Native iOS Client for Claude Code

**Purpose:** Documents the complete architecture of ILS, a native SwiftUI iOS/macOS client for Claude Code, with deep focus on the 5-layer streaming bridge that carries each token from the Anthropic API to the user's screen. Teaches polyglot streaming architecture and SSE client implementation.

**Core Narrative:** Every token Claude generates traverses five layers: SwiftUI view, Vapor backend, Python SDK wrapper, Claude CLI, Anthropic API. Ten hops per token, each one a place where the stream can break. The post walks through each layer's implementation, the SSEClient with UTF-8 buffer parsing and exponential backoff reconnection, and the two-character bug that caused text duplication. The companion repo extracts the bridge as a standalone Swift package.

**Key Takeaway:** Ten hops per token sounds like over-engineering, but each layer does exactly one translation with exactly one failure mode -- the 5-layer architecture is simpler than any of the "simpler" approaches because the translation boundaries are Unix pipes, the lowest common denominator every runtime understands.

**Target Audience:** Builder

**Companion Repo:** `github.com/krzemienski/claude-ios-streaming-bridge` (Swift, SSEClient, Stream types)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post4-5layer-architecture.mermaid`, `assets/post4-connection-states.mermaid`, `assets/post4-message-flow.mermaid`, `assets/post4-timeout-timeline.mermaid`
- SVG renders: `assets/post4-5layer-architecture.svg`, `assets/post4-connection-states.svg`, `assets/post4-message-flow.svg`, `assets/post4-timeout-timeline.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Dev.to** -- The iOS/Swift community on Dev.to will appreciate the detailed architecture walkthrough. Tags: `swift`, `ios`, `ai`, `sse`.
- **Secondary: Medium** -- Good for reaching the broader mobile development audience. Publication: "Better Programming" or "The Startup."
- **Secondary: Reddit r/iOSProgramming** -- Niche but highly engaged audience.
- **Twitter/X** -- Architecture diagram tweet + thread about the 5 layers.

**SEO Keywords:** iOS Claude Code, SSE streaming Swift, SwiftUI streaming, Vapor SSE, Claude API iOS, native AI client iOS, Server-Sent Events Swift

**Pull Quotes:**
1. "Every token Claude generates on your behalf traverses five layers before it appears on your iPhone screen."
2. "Ten hops per token. Each one a place where the stream can break, stall, duplicate, or silently disappear."
3. "The most surprising finding from 763 sessions of iOS development with AI agents is that the Swift compiler is the best validation tool in the ecosystem."

**Importance Score:** 7/10 -- Niche audience (iOS/Swift developers) but deeply technical and unique. No one else has documented building a native Claude Code client.

---

### Post 5: 5 Layers to Call an API

**Purpose:** A debugging war story documenting four failed attempts to connect an iOS app to Claude Code before the fifth worked. Teaches impedance mismatch diagnosis in polyglot architectures and the specific environment variable stripping logic that makes the Python bridge work inside active Claude Code sessions.

**Core Narrative:** Direct API (no OAuth token), JavaScript SDK via Node subprocess (NIO/RunLoop incompatibility), Swift ClaudeCodeSDK in Vapor (FileHandle.readabilityHandler needs RunLoop), Direct CLI invocation (nesting detection blocks it) -- four failures, each with a different class of root cause. The fifth attempt worked: a Python subprocess bridge with NDJSON stdout and environment variable stripping. The broader lesson is about concurrency model impedance mismatches and why Unix pipes are the universal translator.

**Key Takeaway:** The 5-layer bridge works because each layer translates between exactly two concurrency models, and the translation boundary is a Unix pipe -- the lowest common denominator that every runtime understands.

**Target Audience:** Builder / Architect

**Companion Repo:** `github.com/krzemienski/claude-sdk-bridge` (Python/Swift, 4 failed attempts + working bridge)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post5-5layer-serialization.mermaid`, `assets/post5-bridge-dataflow.mermaid`, `assets/post5-failure-timeline.mermaid`, `assets/post5-impedance-mismatch.mermaid`
- SVG renders: `assets/post5-5layer-serialization.svg`, `assets/post5-bridge-dataflow.svg`, `assets/post5-failure-timeline.svg`, `assets/post5-impedance-mismatch.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- Debugging war stories with "4 failed attempts" framing perform well. Title: "5 Layers to Call an API: 4 Failed Attempts, 30 Hours of Debugging." HN loves failure stories with lessons.
- **Secondary: Dev.to** -- Full cross-post. Tags: `python`, `swift`, `debugging`, `architecture`.
- **Secondary: Reddit r/programming** -- The failure narrative is universally relatable.

**SEO Keywords:** Claude Code SDK, API integration debugging, polyglot architecture, impedance mismatch, Python Swift bridge, subprocess NDJSON, Claude CLI environment variables

**Pull Quotes:**
1. "I needed to call one API. It took five layers, four failed attempts, and thirty hours of debugging to get there."
2. "Every layer exists because I tried to remove it and failed."
3. "Swift's concurrency model and Python's and Node's are not interchangeable. The 5-layer bridge works because each layer translates between exactly two concurrency models."

**Importance Score:** 8/10 -- The failure narrative is compelling and the lessons about polyglot impedance mismatches are broadly applicable beyond AI tooling.

---

### Post 6: 194 Parallel AI Worktrees

**Purpose:** Documents the factory-scale parallel development pipeline using git worktrees -- 194 isolated copies of a codebase, each with its own AI agent, connected by a 5-stage pipeline (ideation, specs, worktree factory, QA review, merge queue). Demonstrates that the QA pipeline matters more than the execution agents.

**Core Narrative:** 194 tasks ideated, 91 specs generated, 71 worktrees executed in parallel, 71 QA reports produced, 3,066 sessions consumed. The 23% first-pass QA rejection rate correlated directly with spec precision. Narrow well-defined tasks (type annotations, docs) succeeded at ~90%. Creative tasks (new features, UI) succeeded at under 50%. The merge queue's topological sort prevented cascading conflicts. The overnight run produced 60 working implementations -- equivalent to two weeks of focused engineering work -- for approximately $380 in API costs.

**Key Takeaway:** The QA pipeline matters more than the agents themselves -- the rejection-and-fix cycle between independent QA agents and executors is where the real quality comes from, and spec quality determines everything.

**Target Audience:** Builder / Architect

**Companion Repo:** `github.com/krzemienski/auto-claude-worktrees` (Python, Click CLI, pip-installable)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post6-merge-queue.mermaid`, `assets/post6-qa-cycle.mermaid`, `assets/post6-worktree-pipeline.mermaid`
- SVG renders: `assets/post6-merge-queue.svg`, `assets/post6-qa-cycle.svg`, `assets/post6-worktree-pipeline.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- The numbers (194 worktrees, $380, 60 tasks overnight) are inherently shareable. Title: "194 Parallel AI Worktrees: Factory-Scale AI Development with Git."
- **Secondary: Reddit r/programming** -- The git worktree angle is novel.
- **Secondary: LinkedIn** -- Engineering managers evaluating AI adoption will find the cost analysis compelling.
- **Dev.to** -- Full cross-post. Tags: `git`, `ai`, `devops`, `automation`.

**SEO Keywords:** git worktrees AI, parallel AI development, AI coding pipeline, automated code generation, AI QA pipeline, factory-scale AI, auto-claude worktrees

**Pull Quotes:**
1. "I gave an AI 194 tasks, 194 isolated copies of a codebase, and told it to build. The execution agents were not the hard part. The QA pipeline was."
2. "Sixty working implementations. The equivalent of two weeks of focused engineering work -- generated, reviewed, and integrated while I slept."
3. "Spec quality determines everything. Tasks with five or more concrete acceptance criteria had a 12% rejection rate. Tasks with two vague criteria had a 38% rejection rate."

**Importance Score:** 9/10 -- The most impressive scale demonstration in the series. The numbers are jaw-dropping and the companion repo is immediately usable.

---

### Post 7: The 7-Layer Prompt Engineering Stack -- Defense-in-Depth for AI Agents

**Purpose:** Documents the complete 7-layer prompt engineering architecture that makes AI agents reliable: global CLAUDE.md, project CLAUDE.md, .claude/rules/ files, auto-build hooks, pre-commit security scans, skills, and persistent memory. The most immediately transferable pattern in the series -- you can start with Layer 1 today.

**Core Narrative:** The initial prompt is maybe 10% of what determines agent reliability. The other 90% is the invisible system of rules, hooks, skills, and memory that surrounds every interaction. Each of the 7 layers catches failures that slip through the layers above: if the agent forgets the build command (Layer 1 failure), the auto-build hook catches it (Layer 4). If the agent tries to commit an API key (any layer failure), the pre-commit hook blocks it (Layer 5). Redundancy is the design principle, not efficiency.

**Key Takeaway:** Prompt engineering for AI coding agents is not about writing better instructions -- it is about building a defense-in-depth system where no single layer failure can cause a catastrophic outcome.

**Target Audience:** Practitioner

**Companion Repo:** `github.com/krzemienski/claude-prompt-stack` (YAML/Python, 7-layer config examples, hook scripts)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post7-7layer-stack.mermaid`, `assets/post7-layer-interactions.mermaid`, `assets/post7-override-hierarchy.mermaid`, `assets/post7-security-decisions.mermaid`
- SVG renders: `assets/post7-7layer-stack.svg`, `assets/post7-layer-interactions.svg`, `assets/post7-override-hierarchy.svg`, `assets/post7-security-decisions.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Dev.to** -- Practical, immediately actionable content performs best here. Tags: `ai`, `promptengineering`, `devops`, `productivity`.
- **Secondary: LinkedIn** -- Framed as "The invisible system behind reliable AI coding agents." Good for engineering leadership audience.
- **Secondary: Medium** -- Publication: "Towards Data Science" or "Better Programming."
- **Twitter/X** -- Thread format: one tweet per layer with a concrete example.

**SEO Keywords:** prompt engineering AI agents, CLAUDE.md, AI coding hooks, defense-in-depth AI, Claude Code prompt stack, AI agent configuration, prompt engineering stack

**Pull Quotes:**
1. "The initial prompt is maybe 10% of what determines whether an agent produces reliable code. The other 90% is the invisible system of rules, hooks, skills, and memory."
2. "That single rule -- six lines of text -- changed the character of every AI session."
3. "Each pitfall in that list cost at least 30 minutes to discover the first time. Encoding these pitfalls in Layer 2 means the agent has the answer before it encounters the problem."

**Importance Score:** 9/10 -- The most immediately actionable post. Any developer can start with Layer 1 (a CLAUDE.md file) today and build incrementally. High practical value.

---

### Post 8: Ralph Orchestrator -- A Rust Platform for AI Agent Fleets

**Purpose:** Documents Ralph, a Rust-based orchestration platform for coordinating 30+ AI agents simultaneously. Introduces the "hat" system (role-based agent configuration), event-sourced merge queues, backpressure gates, a Telegram control plane, and persistent loops that survive session boundaries. The most architecturally ambitious component in the series.

**Core Narrative:** It was 1:47 AM. The author typed `/guidance Wrap the existing code, don't replace it` from bed via Telegram, and 28 of 30 tasks were complete by morning. Ralph treats AI agents the way Kubernetes treats containers: isolated environments, clear objectives, structured handoffs, and a persistent control loop. The hat system constrains what each agent can see and do -- a reviewer hat disables all write tools, a planner hat disables file access entirely. The hardest problems were not technical; they were trust calibration.

**Key Takeaway:** An agent's effectiveness is determined more by what it cannot see than by what it can -- constraining the tool surface through the hat system preserves role purity and prevents agents from stepping outside their expertise.

**Target Audience:** Architect

**Companion Repo:** `github.com/krzemienski/ralph-orchestrator-guide` (Rust, 10 crates, TOML configs)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post8-hat-system.mermaid`, `assets/post8-iteration-loop.mermaid`, `assets/post8-ralph-architecture.mermaid`, `assets/post8-recovery-flow.mermaid`
- SVG renders: `assets/post8-hat-system.svg`, `assets/post8-iteration-loop.svg`, `assets/post8-ralph-architecture.svg`, `assets/post8-recovery-flow.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- Rust + AI orchestration + the 2 AM Telegram story is a strong hook. Title: "Ralph Orchestrator: A Rust Platform for AI Agent Fleets."
- **Secondary: Reddit r/rust** -- The Rust community will appreciate the 10-crate architecture.
- **Secondary: Reddit r/programming** -- The hat system concept is broadly interesting.
- **LinkedIn** -- Framed around the trust calibration angle for engineering leadership.

**SEO Keywords:** AI agent orchestration, Rust AI platform, multi-agent coordination, hat system AI, event-sourced merge queue, AI backpressure, Ralph orchestrator, AI fleet management

**Pull Quotes:**
1. "It was 1:47 AM on a Wednesday. I typed /guidance from under the covers, rolled over, and went back to sleep. The agent continued working."
2. "An agent's effectiveness is determined more by what it cannot see than by what it can."
3. "The hardest problems were not technical -- they were trust calibration: when should an agent ask a human, when should it proceed autonomously."

**Importance Score:** 8/10 -- Architecturally dense and novel. The hat system is a genuinely new pattern. Niche audience (Rust + AI infrastructure) but high impact within that niche.

---

### Post 9: From GitHub Repos to Audio Stories

**Purpose:** Documents Code Tales, a platform that clones a repository, analyzes its architecture with Claude, generates a narrative script in one of 9 styles, and synthesizes speech with ElevenLabs. Also serves as the most complete demonstration of the full agentic development methodology -- 636 commits, 90 worktree branches, 37 validation gates.

**Core Narrative:** The idea came while stuck in traffic: what if you could listen to a codebase? Code Tales takes a GitHub URL, picks one of 9 narrative styles (documentary, podcast, fiction, debate, interview, executive, tutorial, storytelling, technical), and produces a fully synthesized audio story. The four-stage pipeline (clone, analyze, narrate, synthesize) is simple, but the engineering lives at the boundaries -- where repository metadata becomes a prompt, where a prompt becomes spoken text, and where voice synthesis parameters create different audio experiences from the same data.

**Key Takeaway:** The same repository analyzed in "documentary" style and "podcast" style produces fundamentally different audio experiences -- the 9 narrative styles demonstrate that AI-generated content quality depends not on the model but on the constraints and structure you give it.

**Target Audience:** Builder

**Companion Repo:** `github.com/krzemienski/code-tales` (Python, ElevenLabs, Claude, Click CLI)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post9-audio-generation.mermaid`, `assets/post9-codetales-pipeline.mermaid`, `assets/post9-full-pipeline.mermaid`, `assets/post9-style-selection.mermaid`
- SVG renders: `assets/post9-audio-generation.svg`, `assets/post9-codetales-pipeline.svg`, `assets/post9-full-pipeline.svg`, `assets/post9-style-selection.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- Novel product concept + open source. Title: "Code Tales: Turn Any GitHub Repo Into a Narrated Audio Story." Strong Show HN candidate.
- **Secondary: Reddit r/programming** -- The "listen to a codebase" concept is novel enough to generate discussion.
- **Secondary: Twitter/X** -- Demo video or audio clip tweet would go viral. Include 30-second audio samples in different styles.
- **Product Hunt** -- Code Tales is a standalone product. Consider a separate Product Hunt launch.

**SEO Keywords:** code to audio, GitHub audio story, code narration AI, ElevenLabs code, repository audio, AI podcast generator, code tales, text-to-speech code

**Pull Quotes:**
1. "What if I could listen to a codebase? Not read documentation. Not scan source files. Listen -- like a podcast episode about FastAPI's architecture."
2. "Same data. Same repository. Three completely different experiences. The documentary makes you feel like you are watching a nature film. The podcast makes you feel like you are chatting with a friend."
3. "636 commits, 90 worktree branches, 91 specs, 37 validation gates. The audio debugging saga required nine commits to fix race conditions."

**Importance Score:** 8/10 -- Unique product concept with broad appeal. The "listen to a codebase" hook is immediately understandable and shareable. Strong Show HN potential.

---

### Post 10: 21 AI-Generated Screens, Zero Figma Files

**Purpose:** Documents a design-to-code pipeline using Stitch MCP where text descriptions and a 47-token design system produce 21 production screens with 5 component primitives and 107 Puppeteer validation checks. Demonstrates token-driven development where changing one value updates all 21 screens.

**Core Narrative:** The traditional flow -- sketch in Figma, pick colors, agonize over border radius, export specs, translate to Tailwind, build React, tweak -- takes two weeks for 21 screens. The Stitch MCP approach took one afternoon. But the speed is not the interesting part. What is interesting is that the quality held: every screen used the same palette, every button had the same hover glow, every font was JetBrains Mono. The design system was computationally verified as consistent by 107 Puppeteer actions checking every screen against the token spec. The brutalist-cyberpunk aesthetic (all `borderRadius: 0px`, JetBrains Mono everywhere, hot pink + cyan accents on pure black) was a deliberate test of whether AI could maintain a strong design language across 21 screens.

**Key Takeaway:** AI can execute a design system with perfect fidelity if you give it the right constraints -- 47 design tokens in a single JSON file, repeated verbatim in every prompt, validated automatically by Puppeteer against the token spec.

**Target Audience:** Builder / Practitioner

**Companion Repo:** `github.com/krzemienski/stitch-design-to-code` (TypeScript, React, Tailwind, Puppeteer)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post10-generation-pipeline.mermaid`, `assets/post10-stitch-workflow.mermaid`, `assets/post10-token-hierarchy.mermaid`, `assets/post10-validation-loop.mermaid`
- SVG renders: `assets/post10-generation-pipeline.svg`, `assets/post10-stitch-workflow.svg`, `assets/post10-token-hierarchy.svg`, `assets/post10-validation-loop.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Twitter/X** -- Visual content. Post screenshots of the 21 screens with the brutalist-cyberpunk aesthetic. "21 screens. Zero Figma. One afternoon." is inherently shareable.
- **Secondary: Dev.to** -- The design token + Tailwind + CVA approach appeals to frontend developers. Tags: `react`, `design`, `tailwindcss`, `ai`.
- **Secondary: Reddit r/webdev** -- Designers and frontend developers will debate this.
- **Dribbble / Behance** -- Post the visual output as a design case study.

**SEO Keywords:** AI design to code, Stitch MCP, design tokens AI, Figma alternative AI, React AI generation, Puppeteer validation, brutalist design system, AI-generated UI

**Pull Quotes:**
1. "I described an entire web application in plain English. The AI generated 21 production screens in a single session. No Figma. No hand-written CSS. No designer in the loop."
2. "The design system was not approximately consistent -- it was computationally verified as consistent, by a Puppeteer suite that checked every single screen against the token spec."
3. "Change one primitive value and the change propagates through all three layers automatically. Zero manual intervention between 'change the color' and 'verify all 21 screens.'"

**Importance Score:** 8/10 -- Visually dramatic and broadly appealing. The "no Figma" angle will generate strong reactions from both design and development communities.

---

### Post 11: The AI Development Operating System

**Purpose:** The capstone post. Synthesizes all 10 lessons into a composable meta-system with 6 subsystems: OMC (25-agent catalog), Ralph Loop (persistent execution), Specum (spec-driven development), RALPLAN (adversarial planning), GSD (project lifecycle), and Team Pipeline (multi-agent coordination). Maps each lesson to its subsystem implementation.

**Core Narrative:** The author did not set out to build an operating system. Over 90 days, each recurring failure mode produced a small prevention system. The Amnesia Problem led to Ralph Loop. The Confidence Problem led to RALPLAN. The Completion Theater Problem led to GSD's evidence gates. The Staffing Problem led to OMC's model routing (5.5x cost reduction). The Coordination Problem led to Team Pipeline. The thesis: the models are capable enough; what they need is a system. The same organizational principles that make human teams effective -- role specialization, independent review, evidence-based verification -- make AI agent teams effective.

**Key Takeaway:** "Operating system" is not a metaphor -- the 6 subsystems compose the same way Unix utilities compose: each does one thing, they communicate through well-defined interfaces, and you chain them together for complex workflows.

**Target Audience:** Architect

**Companion Repo:** `github.com/krzemienski/ai-dev-operating-system` (Python, Click CLI, 25-agent catalog, 6 subsystems)

**Assets Inventory:**
- Hero image: `assets/stitch-hero.png`
- Hero HTML: `assets/hero-card.html`
- Twitter card: `assets/twitter-card.html`
- LinkedIn card: `assets/linkedin-card.html`
- Mermaid diagrams: `assets/post11-aidevos-architecture.mermaid`, `assets/post11-composition-flow.mermaid`, `assets/post11-ralplan-sequence.mermaid`, `assets/post11-team-pipeline-state.mermaid`
- SVG renders: `assets/post11-aidevos-architecture.svg`, `assets/post11-composition-flow.svg`, `assets/post11-ralplan-sequence.svg`, `assets/post11-team-pipeline-state.svg`
- Stitch hero HTML: `assets/stitch-hero.html`
- Rendered page: `index.html`
- PDF: `post.pdf`

**Recommended Publishing Platforms:**
- **Primary: Hacker News** -- The "AI Development Operating System" framing is bold enough for HN. Title: "The AI Development Operating System: 6 Composable Subsystems from 8,481 Sessions."
- **Secondary: LinkedIn** -- Position as the culmination of the series. Tag all previous posts.
- **Secondary: Dev.to** -- Full cross-post. Tags: `ai`, `architecture`, `devops`, `programming`.
- **Reddit r/ExperiencedDevs** -- The organizational principles angle resonates with senior engineers.

**SEO Keywords:** AI development operating system, AI agent orchestration, composable AI systems, OMC agent catalog, RALPLAN adversarial planning, model routing AI, AI development infrastructure

**Pull Quotes:**
1. "I did not set out to build an operating system."
2. "The models are capable enough. What they need is a system."
3. "'Operating system' is not a metaphor. The 6 subsystems compose the same way Unix utilities compose: each does one thing, they communicate through well-defined interfaces, and you chain them together for complex workflows."

**Importance Score:** 9/10 -- The intellectual capstone. Ties everything together. Should be published last to maximize the payoff of having read the earlier posts.

---

## 3. Publishing Strategy

### Recommended Publishing Order

The posts should NOT be published in numerical order. Lead with the most viral, self-contained posts and build toward the capstone.

| Week | Day | Post | Rationale |
|------|-----|------|-----------|
| 1 | Mon | **Post 2:** Three Agents Found the P2 Bug | Lead with the most viral story. Concrete bug, surprising result, $0.15 cost. Self-contained narrative that hooks readers into the series. |
| 1 | Thu | **Post 3:** I Banned Unit Tests | Follow the controversy momentum. The "banned unit tests" title generates debate that drives traffic back to Post 2. |
| 2 | Mon | **Post 1:** Series Launch (8,481 Sessions) | Now that Posts 2 and 3 have established credibility, release the full overview. Readers who discovered the series from Posts 2/3 will read Post 1 for the complete picture. |
| 2 | Thu | **Post 7:** 7-Layer Prompt Stack | The most actionable post. Readers hooked by the first three posts are now ready for practical implementation. |
| 3 | Mon | **Post 5:** 5 Layers to Call an API | Debugging war story. Maintains momentum with another failure narrative. |
| 3 | Thu | **Post 6:** 194 Parallel Worktrees | The scale story. Jaw-dropping numbers ($380 for 60 tasks overnight). |
| 4 | Mon | **Post 9:** Code Tales (GitHub to Audio) | Product showcase. Show HN potential. Lighter tone than the infrastructure posts. |
| 4 | Thu | **Post 4:** iOS Streaming Bridge | Niche but deep. Serves the iOS/Swift audience that discovered the series from earlier posts. |
| 5 | Mon | **Post 10:** 21 Screens, Zero Figma | Visual post. Screenshots of the brutalist-cyberpunk design system drive social engagement. |
| 5 | Thu | **Post 8:** Ralph Orchestrator | Architecturally dense. By this point, the audience is invested enough for the deep dive. |
| 6 | Mon | **Post 11:** The AI Dev OS (Capstone) | Grand finale. Ties everything together. Maximum impact after readers have absorbed the earlier posts. |

### Publishing Cadence

**2x/week (Monday + Thursday) for 5.5 weeks.** Monday catches the start-of-week professional reading window. Thursday catches the end-of-week "I should learn something new" window. The gap between posts gives time for discussion to build on each post before the next one drops.

### Cross-Promotion Strategy

- Every post should include a "Series Navigation" footer linking to all other posts
- When publishing Post N, tweet/share a "Previously in the series" link to Post N-1
- Post 1 (the overview) should be updated with links to each post as they publish
- The companion repo README should link to every published post
- Each LinkedIn post should tag the previous post to create a visible chain

---

## 4. Series-Level SEO Strategy

### Primary Keywords for the Series

1. agentic development
2. AI coding sessions
3. Claude Code workflow
4. multi-agent AI development
5. AI software engineering
6. AI-assisted development at scale
7. AI agent orchestration
8. AI development methodology

### Internal Linking Strategy

- Every post links to the series overview (Post 1) and the companion repo
- Posts that reference concepts from other posts include inline links (e.g., "the consensus gate pattern from Post 2")
- The series overview links to every post with 2-sentence summaries
- Companion repo READMEs link back to their associated post

### Suggested Series Landing Page Structure

```
Hero: "Agentic Development: 10 Lessons from 8,481 AI Coding Sessions"
Stats bar: 8,481 sessions | 90 days | 10 repos | 25 agent types
Author card: Nick Krzemienski + bio
Reading paths: Practitioner | Builder | Architect (3 cards)
Post grid: 11 cards with hero images, titles, 1-sentence summaries
Companion repos: 10-row table with language, description, install command
Newsletter signup / follow CTA
```

---

## 5. Social Distribution Plan

### Twitter/X Thread Strategy

**Best thread candidates (self-contained narratives with visual appeal):**

1. **Post 2 (Bug Story):** 8-tweet thread. Setup, the single-agent "looks correct," the three roles, the bug reveal, the cost ($0.15), the framework, the link. Include the consensus gate Mermaid diagram as an image.

2. **Post 3 (No Unit Tests):** 10-tweet thread. The controversial claim, the mirror problem, the 4 bug categories unit tests miss, the 470 screenshots, the framework, the CTA. This will be the highest-engagement thread due to controversy.

3. **Post 6 (194 Worktrees):** 6-tweet thread. The overnight run, 194 tasks, 60 completed, $380, the QA rejection rate, the link. Include the pipeline diagram.

4. **Post 10 (21 Screens):** Visual thread. Screenshot of each screen category. "21 screens. Zero Figma. One afternoon." Include 4-6 screenshots of the brutalist-cyberpunk UI.

**Thread cadence:** One thread per post on publication day. Pin the Post 2 thread to profile for the duration of the series.

### LinkedIn Article Strategy

- Publish Posts 1, 2, 3, 6, 7, and 11 as full LinkedIn articles (these have the broadest professional appeal)
- Posts 4, 5, 8, 9, 10 can be shared as shorter LinkedIn posts with links to the full articles on Dev.to/Medium
- Use the hero card HTML rendered as images for each LinkedIn post
- Tag relevant hashtags: #AgenticDevelopment #AIEngineering #SoftwareEngineering #ClaudeCode #DeveloperTools

### Reddit Submission Strategy

| Subreddit | Best Posts | Timing |
|-----------|-----------|--------|
| r/programming | Posts 2, 3, 5, 6 | Tuesday-Thursday, 10am ET |
| r/ExperiencedDevs | Posts 3, 7, 11 | Wednesday, 11am ET |
| r/rust | Post 8 | Any weekday, 10am ET |
| r/iOSProgramming | Post 4 | Any weekday |
| r/webdev | Post 10 | Tuesday-Thursday |
| r/MachineLearning | Posts 2, 11 | Monday, 10am ET |

**Important:** Do not submit more than 1 post per subreddit per week. Space submissions across the 5.5-week publishing window.

### Dev.to / Medium Cross-Posting

- Cross-post ALL 11 posts to Dev.to (canonical URL should point to your primary publication)
- Cross-post Posts 1, 2, 3, 7, 11 to Medium (highest general appeal)
- Dev.to tags per post are listed in each post's publishing section above
- Medium publications to target: "Better Programming," "Towards Data Science," "The Startup"

### Newsletter / Email Strategy

- If you have an existing newsletter, send a "series launch" email with Post 1 on Week 2 Monday
- Send a "best of the series" recap email after Post 11 publishes (Week 6)
- Include 3 key stats + 3 post links in each newsletter mention
- Consider creating a Substack specifically for the series if you want to build a subscriber base

---

## 6. Assets Summary Table

| Post | Hero PNG | Hero HTML | Twitter HTML | LinkedIn HTML | Stitch HTML | Mermaid Files | SVG Files | PDF | HTML Page |
|------|----------|-----------|-------------|---------------|-------------|---------------|-----------|-----|-----------|
| 01 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post1-journey-timeline.mermaid`, `post1-series-roadmap.mermaid` | `post1-journey-timeline.svg`, `post1-series-roadmap.svg`, `review-comparison.svg`, `series-stats.svg`, `validation-comparison.svg` | `post.pdf` | `index.html` |
| 02 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post2-consensus-gate.mermaid`, `post2-role-perspectives.mermaid` | `post2-consensus-gate.svg`, `post2-role-perspectives.svg` | `post.pdf` | `index.html` |
| 03 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post3-evidence-flow.mermaid`, `post3-evidence-pipeline.mermaid`, `post3-test-vs-validation.mermaid` | `post3-evidence-flow.svg`, `post3-evidence-pipeline.svg`, `post3-test-vs-validation.svg` | `post.pdf` | `index.html` |
| 04 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post4-5layer-architecture.mermaid`, `post4-connection-states.mermaid`, `post4-message-flow.mermaid`, `post4-timeout-timeline.mermaid` | `post4-5layer-architecture.svg`, `post4-connection-states.svg`, `post4-message-flow.svg`, `post4-timeout-timeline.svg` | `post.pdf` | `index.html` |
| 05 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post5-5layer-serialization.mermaid`, `post5-bridge-dataflow.mermaid`, `post5-failure-timeline.mermaid`, `post5-impedance-mismatch.mermaid` | `post5-5layer-serialization.svg`, `post5-bridge-dataflow.svg`, `post5-failure-timeline.svg`, `post5-impedance-mismatch.svg` | `post.pdf` | `index.html` |
| 06 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post6-merge-queue.mermaid`, `post6-qa-cycle.mermaid`, `post6-worktree-pipeline.mermaid` | `post6-merge-queue.svg`, `post6-qa-cycle.svg`, `post6-worktree-pipeline.svg` | `post.pdf` | `index.html` |
| 07 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post7-7layer-stack.mermaid`, `post7-layer-interactions.mermaid`, `post7-override-hierarchy.mermaid`, `post7-security-decisions.mermaid` | `post7-7layer-stack.svg`, `post7-layer-interactions.svg`, `post7-override-hierarchy.svg`, `post7-security-decisions.svg` | `post.pdf` | `index.html` |
| 08 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post8-hat-system.mermaid`, `post8-iteration-loop.mermaid`, `post8-ralph-architecture.mermaid`, `post8-recovery-flow.mermaid` | `post8-hat-system.svg`, `post8-iteration-loop.svg`, `post8-ralph-architecture.svg`, `post8-recovery-flow.svg` | `post.pdf` | `index.html` |
| 09 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post9-audio-generation.mermaid`, `post9-codetales-pipeline.mermaid`, `post9-full-pipeline.mermaid`, `post9-style-selection.mermaid` | `post9-audio-generation.svg`, `post9-codetales-pipeline.svg`, `post9-full-pipeline.svg`, `post9-style-selection.svg` | `post.pdf` | `index.html` |
| 10 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post10-generation-pipeline.mermaid`, `post10-stitch-workflow.mermaid`, `post10-token-hierarchy.mermaid`, `post10-validation-loop.mermaid` | `post10-generation-pipeline.svg`, `post10-stitch-workflow.svg`, `post10-token-hierarchy.svg`, `post10-validation-loop.svg` | `post.pdf` | `index.html` |
| 11 | `stitch-hero.png` | `hero-card.html` | `twitter-card.html` | `linkedin-card.html` | `stitch-hero.html` | `post11-aidevos-architecture.mermaid`, `post11-composition-flow.mermaid`, `post11-ralplan-sequence.mermaid`, `post11-team-pipeline-state.mermaid` | `post11-aidevos-architecture.svg`, `post11-composition-flow.svg`, `post11-ralplan-sequence.svg`, `post11-team-pipeline-state.svg` | `post.pdf` | `index.html` |

### Asset Totals

| Asset Type | Count |
|------------|-------|
| Stitch Hero PNGs | 11 |
| Hero Card HTMLs | 11 |
| Twitter Card HTMLs | 11 |
| LinkedIn Card HTMLs | 11 |
| Stitch Hero HTMLs | 11 |
| Mermaid Diagram Files | 35 |
| SVG Renders | 38 |
| PDFs | 11 |
| Rendered HTML Pages | 11 |
| **Total Assets** | **150** |

---

## Appendix: Companion Repository Quick Reference

| # | Repository | Language/Tech | Post | Install |
|---|-----------|---------------|------|---------|
| 1 | `claude-ios-streaming-bridge` | Swift | Post 4 | Swift Package |
| 2 | `multi-agent-consensus` | Python (Pydantic, Click) | Post 2 | `pip install -e .` |
| 3 | `functional-validation-framework` | Python (Playwright, httpx) | Post 3 | `pip install -e .` |
| 4 | `claude-sdk-bridge` | Python / Swift | Post 5 | `pip install -e .` |
| 5 | `claude-prompt-stack` | YAML / Python / Bash | Post 7 | Config files (copy) |
| 6 | `auto-claude-worktrees` | Python (Click) | Post 6 | `pip install -e .` |
| 7 | `ralph-orchestrator-guide` | Rust (10 crates) | Post 8 | `cargo build` |
| 8 | `code-tales` | Python (ElevenLabs, Claude) | Post 9 | `pip install -e .` |
| 9 | `stitch-design-to-code` | TypeScript (React, Tailwind) | Post 10 | `npm install` |
| 10 | `ai-dev-operating-system` | Python (Click) | Post 11 | `pip install -e .` |

All Python repos are pip-installable. All have `--help` on their CLI entry points. All passed the four-phase publication audit.
