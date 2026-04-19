# README patches — Day 50 finale

The Day 50 finale covers three repos. Each gets its own patch below. Apply them in separate commits so any single one can be reverted without disturbing the others.

---

## Patch 1 — sessionforge

Insert in `sessionforge/README.md` after the description, before Installation.

```markdown
## Featured in

**SessionForge milestones, Code Stories launches, and why I'm ending this series with the rule I started it with** — the Day 50 finale of the WithAgents 45-day series. Covers the 378-spawn / 657MB / 1,055-file milestone and the self-referential closure where SessionForge has now mined its own construction arc. Published June 7, 2026 on withagents.dev.

→ [Read the finale](https://withagents.dev/writing/day-50-sessionforge-codestories-manifesto)

Companion series: *WithAgents — applied agent design, production-grade*. SessionForge produced every quantitative claim in the series; the finale is where that self-reference becomes the structural point.
```

---

## Patch 2 — code-tales (CLI)

Insert in `code-tales/README.md` after the description, before the install block.

```markdown
## Featured in

**SessionForge milestones, Code Stories launches, and the 45-day manifesto** — the Day 50 finale that ships `code-tales` alongside its hosted sibling `code-tales-platform`. The launch post explains why the CLI is the durable artifact and the platform is the front door to it. Published June 7, 2026 on withagents.dev.

→ [Read the finale](https://withagents.dev/writing/day-50-sessionforge-codestories-manifesto)

The CLI is the artifact I'm proud of. `pip install code-tales`. Point it at a GitHub URL. Pick one of the nine narrative styles. Thirty seconds to playable audio.
```

---

## Patch 3 — code-tales-platform

Insert in `code-tales-platform/README.md` after the description, before the deployment block.

```markdown
## Featured in

**SessionForge milestones, Code Stories launches, and the 45-day manifesto** — the Day 50 finale where Code Stories ships as a dual SKU. This platform is the hosted entry point; the `code-tales` CLI is the durable local version. Same pipeline, two surfaces. Published June 7, 2026 on withagents.dev.

→ [Read the finale](https://withagents.dev/writing/day-50-sessionforge-codestories-manifesto)

Free tier is uncapped today. A paid upgrade path lands before traffic forces the issue.
```

---

Apply patches individually. Do not combine into a single commit.
