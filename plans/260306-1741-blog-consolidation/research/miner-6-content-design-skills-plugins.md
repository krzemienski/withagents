# Miner 6: Content Pipeline, Design Generation, Skills Anatomy, Plugin Architecture

## Post 9: Content Pipeline Evidence

### SessionForge MCP Tool Usage (across sessionforge project sessions)

| Tool | Files | Total Mentions |
|------|-------|----------------|
| `get_session_summary` | 39 | 359 |
| `get_session_messages` | 37 | 342 |
| `create_insight` | 35 | 417 |
| `mine_sessions` | 9 | 55 |
| `devlog` (references) | 22 | 281 |
| `session_insight` | 1 | 2 |

### Content Generation Flow (from real session evidence)

The content pipeline follows a proven 8-phase architecture, documented in the `devlog-pipeline` skill (355 lines):

1. **Mining (parallel):** Spawn N miner agents, each assigned a cluster of projects. Each miner writes a report to `plans/reports/`.
2. **Writing (parallel):** Spawn N writer agents, each assigned 3-5 posts. Each creates post.md + social/ trifecta (twitter.md, linkedin.md, newsletter.md).
3. **Expansion (multi-wave):** Wave 1: 2-3 posts/agent. Wave 2: 1-2 posts/agent (stragglers). Wave 3: single-post agents.
4. **Visuals (parallel):** Stitch MCP for hero images (batch by 5-10). Social cards via Stitch or HTML fallback.
5. **Site Update & Deploy:** Update homepage stats, build static pages.
6. **Functional Validation:** Per-platform build/import checks (Swift, TypeScript, Python, meta repos).
7. **Site Deployment:** Sync posts to `site/posts/`, `pnpm build`, `npx vercel --prod`.
8. **GitHub Push:** Script at `scripts/push-repos-to-github.sh` with 2s rate limit delay.

**Key lesson from production run:** Direct Agent spawning with `run_in_background: true` beats Agent Teams for content at scale. Agent Teams add overhead (team config, member management, stale state). Agents expanding 3+ posts at 6,000+ words each often exhaust context -- assign fewer posts per agent in later waves.

### devlog-pipeline Skill Invocations
- In blog-series sessions: 250 mentions (heavy usage)
- In sessionforge sessions: 0 (content pipeline ran from blog-series context)
- Skill invocations via `"skill":"devlog-pipeline"`: 2 in blog-series, `"skill":"devlog-publisher"`: 6 in sessionforge

### Session Discovery Protocol
The pipeline locates session data via:
```bash
find ~/.claude/projects -name "*.jsonl" -type f -mtime -${DAYS}
```
Proven at scale: 4,597 files, 1.7M lines across 30+ projects.

### Insight Scoring System (7+3 dimensions)
Content Quality (7):
1. Novel Problem-Solving (3x weight)
2. Tool/Pattern Discovery (3x)
3. Before/After Transformation (2x)
4. Failure + Recovery (3x)
5. Reproducibility (1x)
6. Scale/Performance (1x)
7. Visual Potential (2x)

Open-Source Tool Potential (3):
8. Reusability (1-10)
9. Standalone Value (1-10)
10. Implementation Clarity (1-10)

Selection threshold: composite score > 50 AND tool potential > 7.

### devlog-publisher vs devlog-pipeline
Two distinct but related skills:
- `devlog-publisher` (203 lines): Original skill. Teammate-based architecture (Session Miner, Traction Analyst, Blog Writer, Visual Asset Creator, Social Thread Writer, LinkedIn Writer, Newsletter Writer). Default 30-day lookback, 1,500-2,500 words per post.
- `devlog-pipeline` (355 lines): Extended version. Direct agent spawning architecture. 180-day lookback default, 6,000-12,000 words per post. Includes expansion protocol (multi-wave), repo generation, publishing checklist, Stitch MCP integration.

Production metrics from pipeline run:
- 61 posts written and expanded
- 429,000+ words generated
- 183 social files (twitter + linkedin + newsletter x 61)
- 69 static pages built
- 61/61 companion repos pass functional validation

---

## Post 10: Design-to-Code Evidence

### Stitch MCP Usage (across all projects)

| Tool | Files | Total Mentions |
|------|-------|----------------|
| `generate_screen_from_text` | 146+ | 3,052+ |
| `list_screens` | 9 | 524 |
| `edit_screens` | 2 | 10 |
| `create_project` | 8 | 580 |
| `generate_variants` | 2 | 20 |
| `get_screen` | 9 | 309 |
| `get_project` | 13 | 179 |

### Stitch Usage by Project

| Project | Total Stitch Mentions |
|---------|----------------------|
| ai-digest | 1,041 |
| blog-series | 359 |
| sessionforge-apps-dashboard | 6 |

### Stitch Project IDs Referenced
6 unique numeric project IDs across sessions:
- `2303764331196051646`
- `5577890677756270199` (blog-series, stored in stitch.json)
- `16399363238610997210`
- `17803363479132642982`
- `3194299731018090728`
- `9632456382872505903`
Plus 1 string-format ID: `prj_NpsJeTZghIgzF4uK93Vjiw6IqRoc`

### Real Stitch Prompts Extracted from Sessions
Unique prompt patterns used:
1. `"Create a hero image for blog post \"..."`
2. `"Create a hero image for a blog post titled \"..."`
3. `"Hero image for blog post \"..."`
4. `"Hero image for blog \"..."`
5. `"Design a blog homepage for \"..."`
6. `"You need to generate 10 Stitch hero images for blog posts 12-21 in the \"..."`
7. `"You need to generate 8 Stitch hero images for blog posts 22-29 in the \"..."`
8. `"You need to generate 8 Stitch hero images for blog posts 30-37 in the \"..."`
9. `"You need to generate 8 Stitch hero images for blog posts 38-45 in the \"..."`

Evidence of batch generation: prompts for 8-10 hero images at a time, assigned to parallel agents.

### Design Token Usage in blog-series Sessions

| Token | Hex | Mentions |
|-------|-----|----------|
| Void Navy | #0f172a | 138 |
| Slate Abyss | #1e293b | 125 |
| Indigo Pulse | #6366f1 | 134 |
| Cyan Signal | #22d3ee | 128 |
| Cloud Text | #f1f5f9 | 100 |
| Slate Prose | #cbd5e1 | 91 |
| Mist Caption | #94a3b8 | 99 |
| "Midnight Observatory" | - | 138 |

Named token usage:
- "Void Navy": 69 mentions
- "Slate Abyss": 60 mentions
- "Indigo Pulse": 66 mentions
- "Cyan Signal": 65 mentions

### stitch-loop Skill (206 lines)
Autonomous frontend builder using a "baton" system:
1. Read task from `next-prompt.md` (YAML frontmatter with `page` field)
2. Consult `SITE.md` (sitemap, roadmap) and `DESIGN.md` (visual style)
3. Generate via `generate_screen_from_text` with design system prompt
4. Retrieve HTML + screenshot via `get_screen`
5. Integrate into site structure
6. Optional Chrome DevTools visual verification
7. Update `SITE.md` sitemap
8. Write next baton to `next-prompt.md` (keeps loop alive)

Key integration: `stitch.json` persists project ID. Design system block from `DESIGN.md` Section 6 injected into every Stitch prompt for visual consistency.

### Stitch Generation Workflow
```
DESIGN.md (Section 6) → Stitch Prompt
                      → generate_screen_from_text(projectId, prompt, deviceType)
                      → get_screen(screenId)
                      → Download htmlCode + screenshot
                      → Save to queue/{page}.html + queue/{page}.png
                      → Move to site/public/{page}.html
                      → Update SITE.md sitemap
```

---

## Post 15: Skills Anatomy Evidence

### Skill Census
- **Total unique SKILL.md files:** 217
- **Average SKILL.md line count:** 264 lines (sample of 30)

### Skill Directory Structure Patterns

| Resource Dir | Count | Purpose |
|--------------|-------|---------|
| `references/` | 84 | Domain knowledge loaded as needed |
| `scripts/` | 62 | Executable code for deterministic tasks |
| `examples/` | 28 | Working code examples |
| `templates/` | 22 | Output templates |
| `workflows/` | 13 | Multi-step workflow definitions |
| `agents/` | 3 | Specialized subagent instructions |

### SKILL.md Anatomy (Standard Pattern)

Every SKILL.md follows this structure:
```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   │   - name: skill-name
│   │   - description: when-to-trigger text (primary matching mechanism)
│   │   - allowed-tools: tool restrictions (optional)
│   └── Markdown instructions (body)
└── Bundled Resources (optional)
    ├── scripts/    - Executable code
    ├── references/ - Docs loaded into context as needed
    ├── templates/  - Output format templates
    ├── workflows/  - Step-by-step workflow files
    ├── agents/     - Subagent prompt files
    └── examples/   - Working examples
```

### Three-Level Progressive Disclosure
1. **Metadata** (name + description) -- Always in context (~100 words). This is the triggering mechanism.
2. **SKILL.md body** -- In context when skill triggers (<500 lines ideal).
3. **Bundled resources** -- Loaded on-demand (unlimited size). Scripts can execute without loading into context.

### Most-Invoked Skills (from sessionforge project sessions)

| Skill | Invocations |
|-------|-------------|
| `functional-validation` | 16 |
| `devlog-publisher` | 6 |
| `reflexion:reflect` | 4 |
| `oh-my-claudecode:cancel` | 4 |
| `oh-my-claudecode:team` | 3 |
| `gate-validation-discipline` | 3 |
| `everything-claude-code:plan` | 3 |
| `claude-developer-platform` | 3 |
| `agent-browser` | 3 |
| `team` | 2 |
| `planning-with-files` | 2 |
| `mem-search` | 2 |

### Description as Triggering Mechanism
The `description` field in frontmatter is the primary mechanism determining whether Claude invokes a skill. The `skill-creator` skill (487 lines) includes a description optimization loop:
1. Generate 20 trigger/no-trigger eval queries
2. Run optimization via `run_loop.py` (60% train, 40% held-out test)
3. Evaluate each description 3x for reliable trigger rates
4. Select best by test score to avoid overfitting

Key insight: Claude tends to "undertrigger" skills. Descriptions should be "pushy" -- include both what the skill does AND specific contexts for when to use it.

### Skill Interaction Patterns
Skills reference other skills via `## Related Skills` sections. Common patterns:
- **Delegation:** `devlog-publisher` delegates visual generation to `technical-content-creator`
- **Composition:** `functional-validation` references `gate-validation-discipline`, `no-mocking-validation-gates`, `e2e-validate`, `create-validation-plan`
- **Extension:** `devlog-pipeline` extends `devlog-publisher` with expanded word counts and repo generation
- **Conflict declaration:** `functional-validation` declares conflicts with `testing-anti-patterns` and `testing-strategy`

### Diverse Skill Architectures Observed

**Simple (1 file):** `mem-search` (336 lines) -- single SKILL.md with tool reference docs inline
**Medium (SKILL.md + references):** `functional-validation` (142 lines) -- SKILL.md routes to platform-specific reference files (ios-validation.md, cli-validation.md, api-validation.md, web-validation.md)
**Complex (full pipeline):** `devlog-pipeline` (355 lines) -- SKILL.md with references/, templates/, and 8-mode routing table
**Meta (skill about skills):** `skill-creator` (487 lines) -- includes eval framework, viewer generation, description optimization loop, blind comparison system

---

## Post 16: Plugin Architecture Evidence

### Plugin Census
- **Total installed plugins:** 94
- **Unique marketplaces:** 20+
- **Plugin scopes:** user (most), project (swift-lsp, ui-design-system), local (browser-automation)

### plugin.json Structure (Standard Pattern)
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "What the plugin does",
  "author": {
    "name": "Author Name",
    "email": "optional",
    "url": "optional"
  },
  "homepage": "https://github.com/...",
  "repository": "https://github.com/...",
  "license": "MIT",
  "keywords": ["claude-code", "..."],
  "skills": "./skills/",           // optional: path to skills directory
  "mcpServers": "./.mcp.json"      // optional: MCP server config (string path or inline object)
}
```

Two forms for MCP servers:
1. **String path:** `"mcpServers": "./.mcp.json"` (oh-my-claudecode pattern)
2. **Inline object:** `"mcpServers": { "server-name": { "command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/server.js"], "env": {...} } }` (full-featured-example pattern)

### Plugin Directory Structure
```
plugin-name/
├── .claude-plugin/
│   ├── plugin.json          # Required manifest
│   └── marketplace.json     # Optional: for dev marketplace
├── skills/                  # Plugin skills
│   └── skill-name/
│       └── SKILL.md
├── hooks/                   # Plugin hooks
├── commands/                # Slash commands
├── mcp/                     # MCP server code
└── README.md
```

Critical rules:
- `.claude-plugin/` contains ONLY manifests (plugin.json, marketplace.json)
- Use `${CLAUDE_PLUGIN_ROOT}` for all paths in config files (portability)
- Use relative paths starting with `./` in plugin.json

### Notable Installed Plugins

| Plugin | Marketplace | Version | Category |
|--------|-------------|---------|----------|
| oh-my-claudecode | omc | 4.7.6 | Orchestration |
| everything-claude-code | everything-claude-code | 1.8.0 | Config collection |
| claude-mem | thedotmack | 10.5.2 | Memory/persistence |
| essentials | essentials-claude-code | 3.43.0 | Utilities |
| swift-engineering | claude-swift-engineering | 0.1.31 | iOS development |
| ralph-specum | smart-ralph | 4.8.4 | Spec execution |
| planning-with-files | planning-with-files | 2.17.0 | Planning |
| episodic-memory | superpowers-marketplace | 1.0.15 | Memory |
| xclaude-plugin | xclaude-plugin-marketplace | 0.4.0 | Xcode integration |
| compound-engineering | every-marketplace | 2.38.1 | Engineering patterns |

### Hook Architecture

**Hook event types configured:** 9
1. `PreToolUse` (6 hooks) -- Block/warn before tool execution
2. `PostToolUse` (5 hooks) -- Inject reminders after tool execution
3. `UserPromptSubmit` (1 hook) -- Inject context on every user message
4. `SessionStart` (1 hook) -- Load context at session init
5. `Stop` (1 hook) -- Session end handling
6. `SubagentStart` (1 hook) -- Inject context into subagents
7. `SubagentStop` (1 hook) -- Handle subagent completion
8. `TaskCompleted` (1 hook) -- Handle task completion
9. `TeammateIdle` (1 hook) -- Handle idle teammates

**Total hook files:** 31 (in ~/.claude/hooks/)
- `.js` files: 17 (Node.js, modern pattern)
- `.cjs` files: 13 (CommonJS, oh-my-claudecode pattern)
- `.sh` files: 1 (legacy shell)

### Hook Implementation Pattern (from block-test-files.js)
```javascript
#!/usr/bin/env node
// Read stdin as JSON
let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const toolInput = data.tool_input || {};
  // Decision logic
  const output = {
    decision: "block",  // or omit for allow
    reason: "..."
  };
  process.stdout.write(JSON.stringify(output));
});
```

Hook decisions:
- **Block:** `{ decision: "block", reason: "..." }` -- prevents tool execution
- **Allow with context:** `{ hookSpecificOutput: { hookEventName: "...", additionalContext: "..." } }` -- injects context
- **Silent allow:** `process.exit(0)` with no output

### Hook Categories by Function

**Enforcement hooks (block violations):**
- `block-test-files.js` -- Blocks creation of test/mock/stub files (regex patterns)
- `block-api-key-references.js` -- Blocks API key hardcoding
- `privacy-block.cjs` -- Blocks privacy violations

**Reminder hooks (inject context):**
- `skill-activation-forced-eval.js` -- Forces skill evaluation before implementation
- `read-before-edit.js` -- Reminds to read full files before editing
- `plan-before-execute.js` -- Warns if writing code without planning
- `validation-not-compilation.js` -- Reminds compilation is not validation
- `evidence-gate-reminder.js` -- Injects evidence checklist on task completion
- `dev-server-restart-reminder.js` -- Reminds to restart after config changes

**Tracking hooks (monitor behavior):**
- `skill-invocation-tracker.js` -- Warns if 5+ code changes without skill invocation
- `completion-claim-validator.js` -- Catches build success without functional validation

**Orchestration hooks (OMC):**
- `subagent-context-enforcer.js` -- Warns if subagent lacks context
- `subagent-init.cjs` -- Initializes subagent context
- `team-context-inject.cjs` -- Injects team coordination context
- `teammate-idle-handler.cjs` -- Handles idle teammate events
- `task-completed-handler.cjs` -- Processes task completion
- `session-init.cjs` -- Session initialization (15KB, most complex hook)

### Shannon Framework References
- 5 total mentions across sessionforge sessions (limited direct references)
- The framework's concepts are embedded in the hook/skill architecture rather than referenced by name
- The 4-layer enforcement stack maps to: hooks (layer 1), skills (layer 2), CLAUDE.md rules (layer 3), agent prompts (layer 4)

### Plugin Marketplace Architecture
- Marketplaces stored at `~/.claude/plugins/marketplaces/`
- Plugin cache at `~/.claude/plugins/cache/{marketplace}/{plugin}/{version}/`
- Blocklist at `~/.claude/plugins/blocklist.json`
- Install tracking at `~/.claude/plugins/install-counts-cache.json`
- 20+ registered marketplaces from various authors (Anthropic official, community, individual)

### Plugin Lifecycle
```
Plan → Choose pattern, review examples
Create → Make structure, write manifests (.claude-plugin/plugin.json)
Add → Build components (skills, commands, hooks, MCP servers)
Test → Install via dev marketplace (/plugin install)
Debug → Use troubleshooting patterns
Release → Version (semver), tag (git tag), distribute via marketplace
Maintain → Monitor, update, support users
```

Distribution methods:
1. **Direct GitHub:** `/plugin marketplace add org/repo`
2. **Marketplace:** Separate marketplace repo with manifest
3. **Private/team:** Configure in `.claude/settings.json` via `extraKnownMarketplaces`

---

## Cross-Post Connections

- Post 9 pipeline uses Post 10 Stitch MCP for visual generation (hero images, social cards)
- Post 15 skills are the building blocks that Post 16 plugins package and distribute
- Post 9 devlog-pipeline skill (Post 15 anatomy) generates companion repos that undergo Post 9 functional validation
- Post 16 hooks enforce the discipline patterns described across all posts (no mocks, skill-first, evidence gates)
- Design tokens from Post 10 flow through the entire pipeline: DESIGN.md -> Stitch prompt -> generated HTML -> site deployment

## Unresolved Questions
- SessionForge MCP tools (get_session_summary, create_insight) show heavy usage in sessionforge project but zero in ai-digest -- were these tools added after ai-digest development?
- Shannon Framework has only 5 direct name references despite its concepts being deeply embedded in the hook/skill architecture -- is the name used differently in practice?
- The 86 hook files found (vs 31 at top level) includes subdirectory files (lib/, tests/, notifications/, scout-block/) -- what's the canonical count?
