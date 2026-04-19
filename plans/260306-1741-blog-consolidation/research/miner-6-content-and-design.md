# Miner R6: Content & Design Pipelines

Research for posts 9, 10, 15, and 16. Evidence mined from 236 SessionForge sessions, 20+ blog-series sessions, and local skill/hook files.

---

## Post 9: Code Tales / Session Mining

### SessionForge Architecture

**Stack confirmed from session `036f72de`** (initial build plan, 29MB):

> Build SessionForge: a full-stack Next.js 15 platform that mines Claude Code JSONL session history from the local filesystem, extracts technical insights via weighted AI scoring, and orchestrates multi-agent content creation using the Claude Agent SDK for TypeScript.

Tech stack from the actual build prompt:
- Next.js 15 App Router + React 19 Server Components
- Drizzle ORM + PostgreSQL (Neon)
- Tailwind CSS 4 custom theme system
- `@anthropic-ai/claude-agent-sdk` (TypeScript)
- Upstash Redis + QStash
- better-auth for authentication
- Lexical editor
- TanStack Query v5
- Turborepo + bun monorepo

**Database: 61 `pgTable` definitions, 2,356-line schema.ts** (counted from `/Users/nick/Desktop/sessionforge/packages/db/src/schema.ts`). The post claims 59 tables -- actual count is 61.

### JSONL Session Parsing Architecture

From `~/.claude/skills/devlog-publisher/references/session-parsing.md`:

```
# Primary locations for Claude Code session data:
~/.claude/projects/*/sessions/*.jsonl
~/.claude/sessions/*.jsonl
./.claude/sessions/*.jsonl
```

Each JSONL line structure:
```json
{
  "role": "human" | "assistant",
  "content": "message text or structured content",
  "timestamp": "ISO 8601 timestamp",
  "tools_used": ["tool_name"],
  "session_id": "unique session identifier"
}
```

Quality indicators for high-value sessions:
- 10+ message exchanges
- Multiple tool invocations (complex problem-solving)
- Error messages followed by successful resolution
- File creation/modification (building something tangible)
- Long assistant responses (deep technical explanation)

### Content Pipeline: scan -> analyze -> generate -> publish

From the `devlog-publisher` skill's `SKILL.md`:

> This skill turns real Claude Code session history into a high-signal content engine with publication-ready visual assets. It analyzes JSONL session logs across every project on your machine, identifies the most compelling technical patterns, breakthroughs, and problem-solving approaches, then orchestrates a multi-agent teammate pipeline to produce visually rich, publication-ready content.

5 pipeline modes:
1. **Full Pipeline** -- Analyze sessions -> Extract insights -> Generate visuals -> Create all content
2. **Session Analysis Only** -- Scan and summarize sessions, surface top insights
3. **Content From Specific Insight** -- Pipeline for a known topic
4. **Traction Research** -- Analyze trending technical content
5. **Visual Assets Only** -- Generate diagrams, charts, hero images

Workflows directory structure:
```
devlog-publisher/
  SKILL.md
  references/
    insight-scoring.md
    session-parsing.md
    traction-patterns.md
  workflows/
    full-pipeline.md
    session-analysis.md
    targeted-content.md
    traction-research.md
  templates/
    blog-post.md
    social-content.md
```

### 7-Dimension Weighted Scoring Algorithm

From `~/.claude/skills/devlog-publisher/references/insight-scoring.md` (the post says 6, actual implementation uses 7):

| Dimension | Weight | Score Range |
|-----------|--------|-------------|
| Novel Problem-Solving | 3x | 1-5 |
| Tool/Pattern Discovery | 3x | 1-5 |
| Before/After Transformation | 2x | 1-5 |
| Failure + Recovery | 3x | 1-5 |
| Reproducibility | 1x | 1-5 |
| Scale/Performance | 1x | 1-5 |
| Visual Potential | 2x | 1-5 |

**Composite formula:**
```
composite = (novel x 3) + (tool_discovery x 3) + (before_after x 2) +
            (failure_recovery x 3) + (reproducibility x 1) + (scale x 1) +
            (visual_potential x 2)
```

**Maximum possible: 75** (not 65 as in the SessionForge implementation -- discrepancy noted)

Ranking tiers:
- 55-75: Exceptional -- Lead blog post + full visual campaign
- 40-54: Strong -- Solid blog with 2-3 visuals + social thread
- Below 40: Deprioritized

**SessionForge implementation uses 6 dimensions** (from actual TypeScript in session `036f72de`):
```typescript
export interface InsightScores {
  novelty: number;
  tool_discovery: number;
  before_after: number;
  failure_recovery: number;
  reproducibility: number;
  scale: number;
}

function computeComposite(scores: InsightScores): number {
  const raw =
    scores.novelty * 3 +
    scores.tool_discovery * 3 +
    scores.before_after * 2 +
    scores.failure_recovery * 3 +
    scores.reproducibility * 1 +
    scores.scale * 1;
  return Math.min(raw, 65);
}
```

The skill reference adds "Visual Potential" (weight 2x) as a 7th dimension, making max 75. SessionForge code caps at 65 (6 dimensions). Blog post should reconcile this.

### MCP Tools for Insight Management

From session `036f72de`, the actual `createInsightToolsServer` implementation:

```typescript
const sessionTools = createSdkMcpServer({
  name: "session-reader",
  version: "1.0.0",
  tools: [
    tool("get_session_messages", ...),
    tool("get_session_summary", ...),
    tool("list_sessions_by_timeframe", ...)
  ]
});
```

Insight tools MCP server:
- `get_insight_details` -- Retrieve full insight by ID
- `get_top_insights` -- Sort by composite score with optional min threshold
- `create_insight` -- Create with all 6 dimension scores
- `score_insight` -- Compute weighted composite from dimension scores

The `create_insight` tool accepts:
```typescript
{
  sessionId: z.string().optional(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  codeSnippets: z.array(z.object({
    language: z.string(),
    code: z.string(),
    context: z.string(),
  })).optional(),
  terminalOutput: z.array(z.string()).optional(),
  scores: z.object({
    novelty: z.number(),
    tool_discovery: z.number(),
    before_after: z.number(),
    failure_recovery: z.number(),
    reproducibility: z.number(),
    scale: z.number(),
  }),
}
```

### Publishing Platform Integrations

From the SessionForge worktree consolidation report (session `5368cad3`):
- Ghost CMS publishing (branch 016, merged)
- Medium publishing (branch 003, pending)
- Content templates library (branch 007, merged) with built-in types: TIL, How-I-Built, Tutorial

Additional platforms referenced in session mining prompts from `04a12e93`:
- X/Twitter threads
- LinkedIn posts
- Dev.to cross-posts
- Newsletter (400-600 words)

### War Story: The $13.69 Planning Session

From session `036f72de`, the system generated a complete blog post about a meta-recursive incident:

> A planning session for the SessionForge project... ran for 267 seconds. The bill was $13.69. The number of files modified was zero.

The user loaded 6 skills in one prompt:
```
/devlog-publisher
/technical-content-creator
/functional-validation
/e2e-testing
/gate-validation-discipline
/agent-browser
```

The insight scorer rated this session 19/100 composite -- "All scores capped at 2 per the no-code rule." This exposed a systemic bias: planning sessions that produce deferred value get systematically underscored by any system that evaluates sessions in isolation.

### Session Mining at Scale

From session `04a12e93` (blog-series session, 18MB), the actual mining run discovered:

- **23,802 JSONL files** across 421 project directories
- **12GB total session data**
- Key projects: ils-ios (4,053 sessions), claude-mem-observer (14,391 sessions), SessionForge (581 sessions)

Session archetypes observed:
- Deep debugging with sequential thinking
- Multi-agent builds (4-12 parallel agents with file ownership)
- UI validation marathons (300+ screenshot/tap cycles)
- Algorithm precision tuning with ground truth comparison
- Full-stack orchestration (backend + iOS + web)

Tool usage patterns extracted:
- Simulator-heavy: `idb_tap:235`, `screenshot:321`
- Playwright-heavy: `browser_click:77`, `screenshot:53`
- Sequential Thinking-heavy: 84 uses in one session
- Task/TaskUpdate-heavy: 55 TaskUpdate, 40 Task
- Stitch MCP: 26 `generate_screen_from_text`

---

## Post 10: Stitch Design-to-Code

### Midnight Observatory Design System

From `/Users/nick/Desktop/blog-series/DESIGN.md`:

12-color design token system:
| Token | Hex | Role |
|-------|-----|------|
| Void Navy | #0f172a | Primary background |
| Slate Abyss | #1e293b | Cards, elevated surfaces |
| Indigo Pulse | #6366f1 | Primary accent, CTAs |
| Cyan Signal | #22d3ee | Metrics, data highlights |
| Emerald Confirm | #059669 | Success states |
| Amber Caution | #f59e0b | Warnings |
| Crimson Alert | #ef4444 | Errors, failures |
| Violet Glow | #8b5cf6 | Decorative accents |
| Cloud Text | #f1f5f9 | Primary text, headings |
| Slate Prose | #cbd5e1 | Body text |
| Mist Caption | #94a3b8 | Subtitles, metadata |
| Shadow Label | #64748b | Timestamps, footnotes |

Typography: System font stack with 800 weight headers (line-height 1.15-1.2), 400 weight body (line-height 1.8), monospace code at 0.85em.

Component patterns: rounded corners (8-12px), Slate Abyss card backgrounds, single-pixel borders, no shadows (depth through color contrast only).

### Stitch MCP Usage Patterns

The stitch-loop skill (`~/.claude/skills/stitch-loop/SKILL.md`) defines the autonomous build loop:

```
1. Reads the current task from a baton file (next-prompt.md)
2. Generates a page using Stitch MCP tools
3. Integrates the page into the site structure
4. Writes the next task to the baton file for the next iteration
```

### Real Stitch Prompts from Sessions

From session `c7555a45` (blog-series, 11.7MB), actual `generate_screen_from_text` prompts:

**Hero card for Post 12 (Autonomous UI Validation):**
> Title: Autonomous UI Validation Hero Section
> Description of the screen: A premium desktop hero section (1440x900) titled '321 Screenshots in 24 Hours: Autonomous UI Validation at Scale'. The background is #0f172a with a subtle dot grid and atmospheric indigo and cyan glow orbs. At the top left, a category pill 'POST 12' in indigo (#6366f1). The main visual features a perspective-shifted 3D grid of iOS app screenshots, each overlaid with a small glowing green checkmark (#059669) in the corner. In the foreground, a large translucent dark card (#1e293b) displays the key metrics: '321' in massive glowing cyan (#22d3ee) with the label 'Screenshots Analyzed', and a circular progress gauge showing '97%' for 'UI Coverage'.

**Hero card for Post 17 (Sequential Debugging):**
> Title: Sequential Debugging Hero Section
> Description: ...titled '84 Thinking Steps to Find a One-Line Bug'. The main visual features a long, winding chain of 84 small, glowing thinking nodes (#6366f1) that starts broadly at the top and narrows down into a single, bright cyan point at the bottom. This point points directly to a single line of code: 'return cachedValue ?? fetch()' highlighted in a glowing red box (#ef4444). A prominent metric card (#1e293b) displays '84 Thinking Steps -> 1 Bug' in massive glowing cyan (#22d3ee).

**Hero card for Post 16 (Multi-Agent Merge):**
> Title: Multi-Agent Merge Hero V3
> Description: ...titled '35 Worktrees, 12 Agents, Zero Merge Conflicts'. The main visual is an artistic git flow visualization: on the left, 35 thin, glowing indigo lines represent parallel worktrees. In the center, 12 circular agent icons are interspersed, acting as nodes in the flow. All lines smoothly converge into a single, thick, glowing cyan 'main' branch on the right.

**Hero card for Post 19 (Content Pipeline):**
> Title: Five-Stage AI Pipeline Hero Section
> Description: ...titled 'The Five-Stage Pattern: Architecting AI Content Pipelines That Actually Ship'. The centerpiece is a horizontal 5-stage pipeline flow: '01 Ingest', '02 Transform', '03 Enrich', '04 Validate', and '05 Publish'. Each stage is represented as a dark elevated card (#1e293b) with a prominent glowing number in indigo and a minimalist icon.

**Hero card for Post 20 (Design Token Automation):**
> Description: ...The central visual shows a 'tokens.json' file card on the left (#1e293b) with clean code syntax. Glowing indigo lines fan out from this single file into three output cards on the right: 'Web (CSS Variables)', 'iOS (Swift UIColor)', and 'Android (XML)'. Each output card shows a small snippet of its platform-specific code.

### Stitch Prompt Engineering Pattern

Every Stitch prompt follows the DESIGN.md Section 6 injection pattern:

> **CRITICAL -- Include this block in every Stitch prompt:**
> Use a dark theme with background color #0f172a. Use #1e293b for cards and elevated surfaces. Primary accent is #6366f1 (indigo/purple). Use #22d3ee (cyan) for metrics and data highlights. Text colors: #f1f5f9 for headings, #cbd5e1 for body, #94a3b8 for subtle text. Use system-ui font stack. Rounded corners (8-12px). No heavy shadows -- use color contrast for depth. Add subtle dot grid overlays and gradient glow orbs for visual interest. The overall aesthetic is premium dark developer tooling -- like Vercel, Linear, or Raycast landing pages.

### Stitch Tool Chain

Tools used in order:
1. `mcp__stitch__create_project` -- Create a Stitch project container
2. `mcp__stitch__generate_screen_from_text` -- Generate initial screen from prompt
3. `mcp__stitch__edit_screens` -- Iterate on existing screens
4. `mcp__stitch__generate_variants` -- Create design alternatives
5. `mcp__stitch__get_screen` / `mcp__stitch__list_screens` -- Retrieve generated output

Project ID persisted in `stitch.json`: `5577890677756270199`

### Baton System for Autonomous Generation

From stitch-loop SKILL.md, the `next-prompt.md` baton file format:
```markdown
---
page: about
---
A page describing how jules.top tracking works.

**DESIGN SYSTEM (REQUIRED):**
[Copy from DESIGN.md Section 6]

**Page Structure:**
1. Header with navigation
2. Explanation of tracking methodology
3. Footer with links
```

The `page` frontmatter field determines output filename. The skill reads SITE.md for sitemap (avoid recreating existing pages) and roadmap (pick next tasks).

---

## Post 15: Skills Architecture

### Skill File Structure (SKILL.md Format)

From examining actual skills on disk:

```
~/.claude/skills/{skill-name}/
  SKILL.md           # Primary skill definition
  references/        # Supporting documentation
  workflows/         # Step-by-step execution flows
  templates/         # Output templates
  examples/          # Usage examples (stitch-loop)
  resources/         # Additional resources (stitch-loop)
```

SKILL.md YAML frontmatter:
```yaml
---
name: devlog-publisher
description: Mines Claude Code session history...
---
```

Optional frontmatter fields (from stitch-loop):
```yaml
---
name: stitch-loop
description: Teaches agents to iteratively build websites...
allowed-tools: stitch*:*, chrome*:*, Read, Write, Bash
---
```

### devlog-publisher Skill Evidence

Full pipeline from SKILL.md:

> **Real Sessions, Real Insights** -- Every piece of content originates from actual Claude Code conversations. No fabricated examples. No generic advice. Your authentic development workflow IS the content.
>
> **Technical Depth Over Fluff** -- Every blog post includes real code snippets, actual terminal output, concrete architecture decisions, and measurable outcomes extracted from sessions.
>
> **Traction-Aware** -- Before writing, analyze what technical content is performing well in the current landscape (HackerNews, Dev.to, X/Twitter dev community, LinkedIn engineering).
>
> **Teammate Orchestration** -- Uses Claude Code's teammate spawning to parallelize content creation across platforms, ensuring zero overlap in angles while maintaining consistent technical accuracy.

Default parameters:
- Lookback: 30 days
- Projects: ALL on machine
- Blog length: 1,500-2,500 words
- Social platforms: X/Twitter thread, LinkedIn post, Dev.to cross-post
- Newsletter: 400-600 words
- Visuals: Hero image + at least 2 inline diagrams/charts per post

### functional-validation Skill Evidence

From `~/.claude/skills/functional-validation/SKILL.md`:

**The Iron Rule:**
```
IF the real system doesn't work, FIX THE REAL SYSTEM.
NEVER create mocks, stubs, test doubles, or test files.
ALWAYS validate through the same interfaces real users experience.
```

Platform detection and routing table:
| Indicator | Platform | Key Tool |
|-----------|----------|----------|
| `.xcodeproj` | iOS/macOS | `xcrun simctl` + screenshots |
| `Cargo.toml`, `go.mod` | CLI | Binary execution + exit codes |
| REST routes | Backend API | `curl` + response verification |
| React/Vue/Svelte | Web Frontend | Playwright + screenshots |

Mock Detection "Red Flags":
- "Let me add a mock fallback for testing" -> Fix why the real dependency isn't available
- "I'll write a quick unit test to verify" -> Run the real app, look at the real UI
- "I'll stub this database" -> Start a real database instance
- "The real system is too slow/complex" -> Fix the performance issue. That IS the work.

### Skill Activation Patterns -- Forced Evaluation Hook

From `~/.claude/hooks/skill-activation-forced-eval.js` (UserPromptSubmit hook):

```javascript
// Skip for slash commands (they ARE skill invocations)
if (/^\//.test(lowerMessage)) {
  process.exit(0);
}

// Everything else gets the skill reminder
const message =
  'SKILL CHECK: Before implementing, scan available skills. ' +
  'Invoke any that match (even 1% chance). ' +
  'Key: functional-validation, gate-validation-discipline, create-validation-plan, security-scan.';
```

This fires on **every user prompt** except slash commands, greetings, git ops, and continuation prompts. It creates a persistent background pressure to check skills before doing anything.

### Skill Invocation Tracker (PostToolUse Hook)

From `~/.claude/hooks/skill-invocation-tracker.js`:

After 5+ Edit/Write/MultiEdit tool calls without any skill invocation detected in conversation context:

```javascript
const message =
  'SKILL MANDATE WARNING: Multiple code changes made without ANY skill invocation. ' +
  'This is a documented recurring violation. Invoke /functional-validation, ' +
  '/gate-validation-discipline, or other relevant skills NOW.';
```

This is the escalation mechanism -- if the UserPromptSubmit reminder is ignored, this PostToolUse hook catches it after implementation is already underway.

### Real Skill Invocations from Sessions

From session `036f72de` (SessionForge plan), the planning prompt explicitly loaded skills:

```
| Phase | Required Skills | Purpose |
|-------|----------------|---------|
| ALL   | functional-validation | Iron Rule: real-system proof at every gate |
| ALL   | create-validation-plan | Phase structure with blocking gates |
| 2     | devlog-publisher -> session-parsing.md | JSONL discovery + parsing patterns |
| 3     | devlog-publisher -> insight-scoring.md | 6-dimension weighted scoring |
| 3     | prompt-engineering-patterns -> system-prompts.md | Agent system prompt design |
| 5     | frontend-design | Flat black theme, distinctive developer UI |
```

Skill loading protocol defined in the prompt:
> Before each phase:
> 1. List skills relevant to phase (from table above)
> 2. Read each skill's SKILL.md and relevant references/
> 3. Apply patterns from skill documentation to implementation
> 4. Do NOT skip this step -- skills contain battle-tested patterns

From session `c7555a45` (blog-series), an explicit skill exploration prompt:
> "Explore these two skills thoroughly:
> 1. /Users/nick/.claude/skills/stitch-loop/ - Read SKILL.md and all related files
> 2. /Users/nick/.claude/skills/devlog-publisher/ - Read SKILL.md and all related files
>
> I need to understand: What each skill does, How they scan sessions, How they generate blog posts, How they create example repos, What tools/MCPs they use"

---

## Post 16: Plugin/Hook Architecture

### Hook System Overview

Hooks directory: `~/.claude/hooks/` with 30+ hook files covering PreToolUse, PostToolUse, UserPromptSubmit, and SessionStart events.

### Hook Firing Statistics (Real Data)

From session `5368cad3` (SessionForge, 85MB, longest session):

**Total hook firings: 11,578 in one session**

By event type:
| Event | Count |
|-------|-------|
| PostToolUse | 6,525 |
| PreToolUse | 4,761 |
| Stop | 165 |
| SessionStart | 110 |
| PostToolUseFailure | 16 |

Top hooks by name:
| Hook | Firings |
|------|---------|
| PostToolUse:Bash | 2,712 |
| PreToolUse:Bash | 2,124 |
| PostToolUse:Edit | 1,310 |
| PreToolUse:Edit | 924 |
| PostToolUse:Read | 890 |
| PostToolUse:Grep | 605 |
| PreToolUse:Read | 534 |
| PreToolUse:Grep | 363 |
| PostToolUse:mcp__playwright__browser_navigate | 204 |
| PreToolUse:mcp__playwright__browser_navigate | 156 |
| PreToolUse:Agent | 90 |
| PreToolUse:Write | 88 |

Other sessions:
- Session `cd28b3a1`: **7,327 hook firings**
- Session `55183c98`: **6,770 hook firings**

PreToolUse:Write + PreToolUse:Edit combined in session `cd28b3a1`: **840 firings** -- every single one of those triggered the `block-test-files.js` and `read-before-edit.js` checks.

### block-test-files.js (PreToolUse: Write|Edit|MultiEdit)

Full implementation from `~/.claude/hooks/block-test-files.js`:

```javascript
const TEST_PATTERNS = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /_test\.go$/,
  /test_[^/]+\.py$/,
  /Tests?\.swift$/,
  /\.test\.py$/,
  /\/__tests__\//,
  /\/test\/.*\.(ts|js|tsx|jsx|py|go|swift)$/,
  /\.mock\.[jt]sx?$/,
  /\.stub\.[jt]sx?$/,
  /\/mocks\//,
  /\/stubs\//,
  /\/fixtures\//,
  /\/test-utils\//,
  /\.stories\.[jt]sx?$/,
];

const ALLOWLIST = [
  /e2e-evidence/,
  /validation-evidence/,
  /\.claude\//,
];
```

On match, emits:
```javascript
{
  decision: "block",
  reason: `BLOCKED: "${filePath}" matches a test/mock/stub file pattern.\n\n` +
    `FUNCTIONAL VALIDATION MANDATE: Never create test files, mock files, or stub files.\n` +
    `Instead: Build and run the real system. Validate through actual user interfaces.\n` +
    `Use skill: functional-validation for the correct protocol.`
}
```

This hook fires on every Write/Edit/MultiEdit call. With 924 Edit + 88 Write = 1,012 potential checks per session, and the block fires with `decision: "block"` and `process.exit(0)` output format that Claude Code interprets as a hard block.

### read-before-edit.js (PreToolUse: Edit|MultiEdit)

Injects context on every edit:
```javascript
const message =
  `Editing ${filePath}. Ensure you have:\n` +
  '- Read the FULL file (not just a snippet) -- use Read without offset/limit\n' +
  '- Understood the surrounding context and how this code connects to other modules\n' +
  '- Never skim -- if the file is large, read it in sections but read ALL of it';
```

Skips: package.json, lock files, JSON, .claude/, .omc/, node_modules.

### plan-before-execute.js (PreToolUse: Write|Edit|MultiEdit)

Checks conversation context for planning signals:
```javascript
const hasPlanning =
  /\/ralplan|\/plan|\/omc-plan|planner.*agent|implementation plan|phase \d|step \d.*of/i.test(conversationText) ||
  /EnterPlanMode|ExitPlanMode|plan mode/i.test(conversationText);
```

If no planning detected:
> "PLANNING CHECK: No planning phase detected in this session. Consider /ralplan or /plan before writing source code. Jumping to execution without planning is a recurring violation."

### validation-not-compilation.js (PostToolUse: Bash)

Detects build commands (`npm run build`, `tsc`, `cargo build`, `xcodebuild`, `gcc`, etc.) and reminds:

> "REMINDER: Compilation/build success is NOT functional validation. A successful build only proves the code compiles -- it does NOT prove the feature works. You MUST exercise the feature through the actual UI (Playwright MCP, curl, simulator) and capture evidence before claiming any task is complete."

Excludes validation commands: `curl`, `playwright`, `xcrun simctl`, `next dev`, `localhost`, `screenshot`.

### completion-claim-validator.js (PostToolUse: Bash)

Catches build success output (`compiled successfully`, `build succeeded`, `exit code 0`, `Ready`) without Playwright/screenshot evidence in conversation:

> "BUILD SUCCESS != VALIDATION. The code compiles, but has it been exercised through the real UI? Run /functional-validation or use Playwright MCP before claiming completion."

### Plugin Manifest Structure

From `~/.claude/plugins/marketplaces/everything-claude-code/.claude-plugin/plugin.json`:
```json
{
  "name": "everything-claude-code",
  "version": "1.8.0",
  "description": "Complete collection of battle-tested Claude Code configs...",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": ["claude-code", "agents", "skills", "hooks", ...]
}
```

Plugin directories found in `~/.claude/plugins/marketplaces/`:
- context-engineering-kit (multiple sub-plugins: kaizen, reflexion, ddd)
- thedotmack
- everything-claude-code
- And 40+ other marketplace plugins

### Hook Execution Pipeline from JSONL

From session `5368cad3`, the actual hook execution sequence visible in JSONL:

**SessionStart hooks (11 hooks, sequential):**
```json
{"type":"hook_progress","hookEvent":"SessionStart","hookName":"SessionStart:clear",
 "command":"bash ${CLAUDE_PLUGIN_ROOT}/hooks/emit-event.sh"}
{"type":"hook_progress","hookEvent":"SessionStart","hookName":"SessionStart:clear",
 "command":"node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""}
```

**PreToolUse hooks (multiple hooks per tool call):**
```json
{"hookEvent":"PreToolUse","hookName":"PreToolUse:Agent",
 "command":"node \"$HOME/.claude/hooks/subagent-context-enforcer.js\""}
{"hookEvent":"PreToolUse","hookName":"PreToolUse:Agent",
 "command":"bash ${CLAUDE_PLUGIN_ROOT}/hooks/approve-tool.sh"}
{"hookEvent":"PreToolUse","hookName":"PreToolUse:Agent",
 "command":"${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/hooks/observe.sh"}
```

**Stop hooks (11 hooks on session end):**
```json
{"subtype":"stop_hook_summary","hookCount":11,"hookInfos":[
  {"command":"...worker-service.cjs hook claude-code summarize","durationMs":187},
  {"command":"...worker-service.cjs hook claude-code session-complete","durationMs":210},
  {"command":"...hooks/emit-event.sh","durationMs":24},
  {"command":"...check-console-log.js","durationMs":102},
  {"command":"...stop-hook.sh","durationMs":24},
  {"command":"...stop-watcher.sh","durationMs":27},
  {"command":"...stop-watcher.sh","durationMs":50},
  {"command":"...index.ts Stop","durationMs":43},
  {"command":"...context-guard-stop.mjs","durationMs":136},
  {"command":"...persistent-mode.cjs","durationMs":169},
  {"command":"...code-simplifier.mjs","durationMs":142}
]}
```

**Blocked tool call example** (dev server in tmux enforcement):
```json
{"hookEvent":"PreToolUse","hookName":"PreToolUse:Bash",
 "command":"node -e \"...if(/(npm run dev|pnpm dev|yarn dev|bun run dev)/.test(cmd)){
   console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');
   console.error('[Hook] Use: tmux new-session -d -s dev \"npm run dev\"');
   process.exit(2)}...\""}
```

### Hook Architecture Summary

| Layer | Hook | Event | Behavior |
|-------|------|-------|----------|
| Block | block-test-files.js | PreToolUse:Write/Edit | Hard block on test/mock/stub files |
| Block | block-api-key-references.js | PreToolUse:Write/Edit | Hard block on API key references |
| Inject | read-before-edit.js | PreToolUse:Edit | Reminds to read full file first |
| Inject | plan-before-execute.js | PreToolUse:Write/Edit | Warns if no planning phase detected |
| Inject | skill-activation-forced-eval.js | UserPromptSubmit | Forces skill check on every prompt |
| Inject | validation-not-compilation.js | PostToolUse:Bash | Reminds build != validation |
| Inject | completion-claim-validator.js | PostToolUse:Bash | Catches premature completion claims |
| Inject | skill-invocation-tracker.js | PostToolUse:Edit/Write | Escalates after 5+ edits without skills |
| Inject | evidence-gate-reminder.js | TaskUpdate | Injects evidence checklist on task completion |
| Inject | dev-server-restart-reminder.js | PostToolUse:Edit/Write | Reminds to restart after config changes |
| Inject | subagent-context-enforcer.js | PreToolUse:Agent | Warns if subagent prompt lacks context |

---

## Source Session References

| Session ID | Project | Size | Key Evidence |
|------------|---------|------|-------------|
| `036f72de` | sessionforge | 29MB | SessionForge architecture, scoring algorithm, MCP tools, $13.69 war story |
| `5368cad3` | sessionforge | 37MB | 11,578 hook firings, hook execution pipeline, worktree consolidation |
| `cd28b3a1` | sessionforge | 12MB | 7,327 hook firings, 840 Write/Edit checks |
| `55183c98` | sessionforge | 17MB | 6,770 hook firings |
| `04a12e93` | blog-series | 18MB | Session mining at scale, Stitch hero generation, 23,802 files |
| `c7555a45` | blog-series | 11MB | Stitch prompts, stitch-loop skill exploration, design tokens |
| `fc444b36` | sessionforge | 85MB | Largest session, MCP tool usage |
| `f6213b2f` | sessionforge | 76MB | Hook enforcement, skill invocations |

## Unresolved Questions

1. The post says "6-dimension scoring" but the skill reference has 7 dimensions (Visual Potential added). SessionForge code uses 6 (max 65). Which is authoritative for the blog post?
2. The post says "59 tables via Drizzle ORM" but actual `pgTable` count is 61. Schema is 2,356 lines. Minor factual correction needed.
3. The post says "7 publishing platform integrations" -- evidence found: Ghost CMS, Medium, X/Twitter, LinkedIn, Dev.to, Newsletter, plus content templates. That's 6-7 depending on how you count templates.
4. Hook firing counts of "43-166 per session" mentioned in the task description don't match what I found. Real counts are 6,770-11,578 total hook firings per session, with individual hooks like PreToolUse:Edit firing 924 times. The 43-166 range may refer to a specific hook type in shorter sessions.
