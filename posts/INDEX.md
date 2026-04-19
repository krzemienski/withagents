# Agentic Development: 18 Lessons from 23,479 AI Coding Sessions — Series Index

**Author:** Nick Krzemienski
**Scope:** 23,479 AI coding sessions | 42 days | 11.6 GB session data | 27 projects | 14 unique companion repositories | 18 posts | ~58,561 words
**Series Repo:** [github.com/krzemienski/agentic-development-guide](https://github.com/krzemienski/agentic-development-guide)
**Live:** [site-rho-pied.vercel.app](https://site-rho-pied.vercel.app)

---

## 1. Series Overview

### What This Series Covers

Over 42 days (Jan 24 – Mar 6, 2026), Nick averaged 559 AI coding sessions per day — 23,479 total (4,534 human-started + 18,945 agent-spawned). The work spanned 27 production projects: a native iOS client for Claude Code, an autonomous hat-based loop orchestrator, an agentic design-to-code pipeline, cross-session memory infrastructure, and more. This series is what those sessions revealed: the patterns that survived contact with production, the enforcement layers that made AI agents reliable, and the architectures that shipped. Every claim traces to real session data. Every companion repo is clonable.

### Key Numbers

| Metric | Value |
|--------|-------|
| Total AI coding sessions | 23,479 |
| Human-started sessions | 4,534 |
| Agent-spawned sessions | 18,945 |
| Session data (lines) | 3,474,754 |
| Session data (size) | 11.6 GB |
| Projects | 27 |
| Days active | 42 (Jan 24 – Mar 6, 2026) |
| Unique companion repositories | 14 |
| Posts | 18 |
| Total words | ~58,561 |
| Top tool call: Read | 87,152 |
| Top tool call: Bash | 82,552 |
| Top tool call: Grep | 21,821 |

### Target Audiences

**Practitioners** — engineers who use Copilot, Cursor, or Claude Code daily and have hit the single-session ceiling. Start with Posts 1, 3, 7, 9.

**Builders** — shipping products with AI agents end-to-end. Start with Posts 4, 5, 6, 10, 11.

**Architects** — designing the next tooling layer. Start with Posts 8, 12, 14, 16, 18.

### Design System

Premium dark, developer-focused — **Midnight Observatory**:
- **Background:** Void Navy (#0f172a), near-black surfaces (#0a0a0a)
- **Accents:** Indigo Pulse (#6366f1), Cyan Signal (#22d3ee), Hot Pink (#ec4899), Vivid Purple (#a855f7)
- **Text:** Cloud (#f1f5f9), Slate body (#a1a1aa), Mist muted (#71717a)
- **Typography:** Inter (system-ui fallback), SF Mono / Fira Code for code
- **Components:** 1200×630 hero cards, 1200×628 Twitter cards, 1200×627 LinkedIn cards, dot-grid overlays, gradient glow orbs

---

## 2. Post Index

| # | Slug | Title | Companion Repo |
|---|---|---|---|
| 1 | post-01-series-launch | 23,479 Sessions: What Actually Works in Agentic Development | [agentic-development-guide](https://github.com/krzemienski/agentic-development-guide) |
| 2 | post-02-multi-agent-consensus | 3 Agents Found the Bug 1 Agent Missed | [multi-agent-consensus](https://github.com/krzemienski/multi-agent-consensus) |
| 3 | post-03-functional-validation | I Banned Unit Tests and Shipped Faster | [claude-code-skills-factory](https://github.com/krzemienski/claude-code-skills-factory) |
| 4 | post-04-ios-streaming-bridge | The Five-Layer Streaming Bridge | [claude-ios-streaming-bridge](https://github.com/krzemienski/claude-ios-streaming-bridge) |
| 5 | post-05-ios-patterns | The iOS Patterns Compendium: What 4,597 Sessions Taught Me About SwiftUI, State, and Survival | [claude-code-ios](https://github.com/krzemienski/claude-code-ios) |
| 6 | post-06-parallel-worktrees | 194 Parallel Agents, Zero Merge Conflicts | [auto-claude-worktrees](https://github.com/krzemienski/auto-claude-worktrees) |
| 7 | post-07-prompt-engineering-stack | The 7-Layer Prompt Engineering Stack | [shannon-framework](https://github.com/krzemienski/shannon-framework) |
| 8 | post-08-ralph-orchestrator | The Self-Correcting Loop: How Ralph Turned Hat-Based Orchestration Into Autonomous Execution | [ralph-loop-patterns](https://github.com/krzemienski/ralph-loop-patterns) |
| 9 | post-09-code-tales | Mining 23,479 Sessions: What 3.4 Million Lines of AI Logs Actually Reveal | [session-insight-miner](https://github.com/krzemienski/session-insight-miner) |
| 10 | post-10-stitch-design-to-code | The Designer-Less Design Workflow: Stitch MCP and the Death of Figma Handoffs | [stitch-design-to-code](https://github.com/krzemienski/stitch-design-to-code) |
| 11 | post-11-spec-driven-development | Spec-Driven Development: Why YAML Beats Verbal Instructions for AI Agents | [reponexus](https://github.com/krzemienski/reponexus) |
| 12 | post-12-cross-session-memory | Teaching AI to Remember: Cross-Session Memory | [claude-mem-architecture](https://github.com/krzemienski/claude-mem-architecture) |
| 13 | post-13-sequential-thinking-debugging | 84 Thinking Steps to Find a One-Line Bug | [sequential-thinking-debugging](https://github.com/krzemienski/sequential-thinking-debugging) |
| 14 | post-14-multi-agent-merge | 35 Worktrees, 12 Agents, Zero Merge Conflicts | [multi-agent-merge-orchestrator](https://github.com/krzemienski/multi-agent-merge-orchestrator) |
| 15 | post-15-skills-anatomy | The Anatomy of a Skill | [claude-code-skills-factory](https://github.com/krzemienski/claude-code-skills-factory) |
| 16 | post-16-claude-code-plugins | Building Claude Code Plugins That Actually Work | [shannon-framework](https://github.com/krzemienski/shannon-framework) |
| 17 | post-17-ccb-evolution | The CCB Evolution: From Bash Script to Autonomous Builder | [claude-code-monorepo](https://github.com/krzemienski/claude-code-monorepo) |
| 18 | post-18-sdk-vs-cli | SDK vs CLI: The Decision Framework That Took 23,479 Sessions to Learn | [claude-code-monorepo](https://github.com/krzemienski/claude-code-monorepo) |

---

## 3. Topic Clusters

- **Scale & Data:** Posts 1, 9
- **Validation & Governance:** Posts 3, 7, 15, 16
- **Orchestration & Parallelism:** Posts 2, 6, 8, 14
- **Memory & Debugging:** Posts 12, 13
- **iOS & Design:** Posts 4, 5, 10
- **Spec & Framework:** Posts 11, 17, 18

## 4. Reading Paths

**Practitioner (4 posts, ~13K words):** 1 → 3 → 7 → 9
**Builder (5 posts, ~16K words):** 1 → 4 → 6 → 10 → 11
**Architect (5 posts, ~16K words):** 1 → 8 → 12 → 16 → 18
**Full series:** 18 posts in order, ~58K words total.

---

## 5. Companion Repositories (14 unique)

All repos are open-source (MIT) and passed functional validation (compile, import, README). Most are on GitHub under `github.com/krzemienski/`.

```
agentic-development-guide         Post 1 — meta-repo, series overview
multi-agent-consensus             Post 2 — 3-agent voting gate
claude-code-skills-factory        Posts 3, 15 — skills + validation
claude-ios-streaming-bridge       Post 4 — 5-layer SSE bridge
claude-code-ios                   Post 5 — iOS patterns compendium
auto-claude-worktrees             Post 6 — parallel worktree factory
shannon-framework                 Posts 7, 16 — prompt stack + plugins
ralph-loop-patterns               Post 8 — hat-based loops
session-insight-miner             Post 9 — session log mining pipeline
stitch-design-to-code             Post 10 — design tokens + Stitch MCP
reponexus                         Post 11 — spec execution framework
claude-mem-architecture           Post 12 — SQLite observation store
sequential-thinking-debugging     Post 13 — 84-step chain debugging
multi-agent-merge-orchestrator    Post 14 — 35-worktree merge orchestrator
claude-code-monorepo              Posts 17, 18 — TypeScript SDK + CLI
```

---

## 6. Audit & Provenance

- All stats regenerated from real JSONL session data (`scripts/deep-mine.py` + output at `scripts/output/full-mine-data.json`)
- Metrics reference: `scripts/output/series-metrics.md`
- Consolidated from original 61-post corpus on 2026-03-06
- Review docs (Posts 1-11): `REVIEW-POSTS-01-04.md`, `REVIEW-POSTS-05-08.md`, `REVIEW-POSTS-09-11-AND-STRATEGY.md`
- Publishing plan: `../PUBLISHING-ROADMAP.md`
- Campaign (260418): `../assets/campaigns/260418-blog-series-ai/`
