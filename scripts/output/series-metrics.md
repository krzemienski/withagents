# Series Metrics Reference (Full Mine: 23,479 Sessions)

## Headline Numbers
- **Total sessions:** 23,479 (4,534 human-initiated + 18,945 agent-spawned)
- **Total lines of session data:** 3,474,754
- **Total size:** 11.6GB
- **Total projects:** 27 with significant activity
- **Date range:** January 24 – March 6, 2026 (42 days)
- **Average sessions/day:** ~559

## Tool Leaderboard (All Sessions)
| Rank | Tool | Count |
|------|------|-------|
| 1 | Read | 87,152 |
| 2 | Bash | 82,552 |
| 3 | Grep | 21,821 |
| 4 | Edit | 19,979 |
| 5 | Glob | 11,769 |
| 6 | Write | 9,066 |
| 7 | TaskUpdate | 4,852 |
| 8 | Task (subagent spawn) | 2,827 |
| 9 | idb_tap (iOS sim) | 2,620 |
| 10 | ToolSearch | 2,366 |
| 11 | TaskCreate | 2,182 |
| 12 | simulator_screenshot | 2,165 |
| 13 | TaskList | 1,838 |
| 14 | SendMessage | 1,720 |
| 15 | TaskOutput | 1,471 |
| 16 | Skill | 1,370 |
| 17 | idb_describe | 1,239 |
| 18 | WebSearch | 1,224 |
| 19 | Agent | 929 |
| 20 | TodoWrite | 698 |

## MCP Tool Highlights
- **iOS Simulator:** idb_tap(2,620), simulator_screenshot(2,165), idb_describe(1,239), idb_gesture(479), idb_find_element(443), idb_input(253), simulator_openurl(131), simulator_launch_app(128), xcode_build(128)
- **Browser Automation:** browser_click(604), browser_navigate(524), browser_take_screenshot(465), browser_wait_for(210), browser_snapshot(152), browser_run_code(113)
- **Sequential Thinking:** sequentialthinking(327)
- **Stitch Design:** generate_screen_from_text(269), list_screens(87)
- **Episodic Memory:** episodic_memory_search(159)
- **Python REPL:** python_repl(101)
- **Puppeteer:** puppeteer_evaluate(91), puppeteer_screenshot(87)

## Top Projects by Size
| Project | Files | Lines | Size | Agent Spawns |
|---------|-------|-------|------|-------------|
| ils-ios | 4,241 | 1,563,570 | 4.6GB | 287 |
| claude-mem-observer | 14,119 | 421,577 | 2.8GB | 0 |
| yt-transition-shorts | 1,228 | 286,613 | 1.4GB | 0 |
| ralph-orchestrator | 1,045 | 335,290 | 911MB | 57 |
| sessionforge | 617 | 267,236 | 780MB | 215 |
| awesome-site | 477 | 168,522 | 331MB | 0 |
| blog-series | 306 | 156,799 | 257MB | 358 |
| ai-digest | 279 | 113,263 | 247MB | 0 |
| code-tales-ios | 252 | 41,198 | 123MB | 0 |
| ils | 165 | 39,006 | 95MB | 0 |

## Per-Post Metric Corrections
- **Posts citing "4,510 sessions":** Posts 1, 9, 12, 13, 16, 17, 18 → change to **23,479**
- **Posts citing "4,500 sessions":** Post 12 → change to **23,479**
- **Posts citing "8,481 sessions":** Post 1 title → change to **23,479**
- **Tool counts in Post 1 & 18:** Old (Bash:35,216, Read:26,303, Edit:8,118) → New (Read:87,152, Bash:82,552, Edit:19,979)
- **Post 9 "4,597 session files":** → change to **23,479**
- **Post 13 "2,267 sequentialthinking":** → verify against 327 actual calls

## Companion Repos (18 posts, 14 unique)
| Post | Repo | Type |
|------|------|------|
| 01 | agentic-development-guide | Meta/docs |
| 02 | multi-agent-consensus | Python |
| 03 | claude-code-skills-factory | Python/Skills |
| 04 | claude-ios-streaming-bridge | Swift |
| 05 | claude-code-ios | Swift |
| 06 | auto-claude-worktrees | Python |
| 07 | shannon-framework | CC Plugin |
| 08 | ralph-loop-patterns | Python |
| 09 | session-insight-miner | Python |
| 10 | stitch-design-to-code | Node.js |
| 11 | reponexus | Spec framework |
| 12 | claude-mem-architecture | Python+SQLite |
| 13 | sequential-thinking-debugging | Python |
| 14 | multi-agent-merge-orchestrator | Python |
| 15 | claude-code-skills-factory | Skills anatomy |
| 16 | shannon-framework | Plugin hooks |
| 17 | claude-code-monorepo | TypeScript |
| 18 | claude-code-monorepo | SDK vs CLI |

## Key Ratios
- **Read:Write ratio:** 9.6:1 (agents read ~10x more than they write)
- **Human:Agent session ratio:** 1:4.2 (each human session spawns ~4 agent sessions)
- **iOS interactions:** 7,985 total MCP calls (idb_* + simulator_* + xcode_*)
- **Browser automation:** 2,068 total (playwright + puppeteer)
- **Team operations:** TeamCreate(128), SendMessage(1,720), TaskCreate(2,182)
