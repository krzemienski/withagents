# Workstream C — Desktop Product Scan

## Summary

Scanned 300 entries under `~/Desktop/` + 108 entries under `~/` (home-level, non-Desktop).
Of 408 total: **192 git repos on Desktop** (22 ACTIVE ≤30d, 33 STALE 30-90d, 203 ABANDONED >90d),
**125 SCRATCH** (no git / exploratory dirs), **33 MISSING** (files misclassified as dirs or
already-pruned paths). GitHub catalog (`/tmp/gh-repos-raw.json`) holds 300 repos under
`krzemienski`; 53 of those have clones on disk. **3 krzemienski remotes exist on disk but
NOT in the GitHub catalog** (renamed/archived). **17 local git repos have no remote at
all** — the highest-priority brand-candidates among these are `blog-series`, `nexus`,
`prd-creator`, `capture-analyzer`. The 30-day mine data (`mine-30d-data.json`) lists 59
projects with activity, closely matching the 22 ACTIVE filesystem dirs. Numerous stacked
throwaway scratch dirs exist (`ccb-*`, `djs-*`, `claude-code-builder-*`, `shannon-*`) that
can be mass-archived without brand impact.

## Active Products (activity ≤30 days)

| Dir | Local path | GitHub repo | Last commit | Notes |
|---|---|---|---|---|
| blog-series | `~/Desktop/blog-series` | (no remote) | 2026-04-19 | Current working repo — withagents.dev launch lives here; needs push |
| validationforge | `~/Desktop/validationforge` | krzemienski/validationforge | 2026-04-18 | VALIDATE engine, brand core |
| sessionforge | `~/Desktop/sessionforge` | krzemienski/sessionforge | 2026-04-18 | v0.1.0-alpha regen |
| remodex | `~/Desktop/remodex` | krzemienski/remodex | 2026-04-17 | bridge work |
| yt-transition-shorts-detector | `~/Desktop/yt-transition-shorts-detector` | krzemienski/yt-transition-shorts-detector | 2026-04-07 | v1.7.1 validation refresh |
| ils-ios | `~/Desktop/ils-ios` | krzemienski/ils-ios | 2026-03-23 | SCRN-01/19 gap plan |
| autonomous-coder | `~/Desktop/autonomous-coder` | krzemienski/autonomous-coder | 2026-03-21 | v3 Claude Agent SDK migration |
| claude-code-builder-agents-sdk | `~/Desktop/claude-code-builder-agents-sdk` | krzemienski/autonomous-claude-code-builder | 2026-03-20 | Active CCB continuation |
| ai-digest | `~/Desktop/ai-digest` | krzemienski/ai-digest | 2026-03-20 | auto-claude merges |
| nexus | `~/Desktop/nexus` + `~/nexus` | (no remote on either) | 2026-03-20 | Both copies active; needs push |
| claude-code-source-build | `~/Desktop/claude-code-source-build` | andrew-kramer-inno/claude-code-source-build | 2026-04-01 | External fork |
| claudekit-engineer | `~/Desktop/claudekit-engineer` | claudekit/claudekit-engineer | 2026-04-03 | External |
| claw-code | `~/Desktop/claw-code` | ultraworkers/claw-code | 2026-04-08 | External |
| Auto-Claude | `~/Desktop/Auto-Claude` | AndyMik90/Aperant | 2026-03-23 | External (remote renamed) |
| cc-setup | `~/cc-setup` | krzemienski/cc-setup | 2026-03-20 | Setup tooling |
| ralph-orchestrator | `~/ralph-orchestrator` | mikeyobrien/ralph-orchestrator | 2026-03-27 | External reference |
| Auto-claude-code-research-in-sleep | `~/Auto-claude-code-research-in-sleep` | wanshuiyin/… | 2026-03-23 | External |
| claude-code | `~/claude-code` | claude-code-best/claude-code | 2026-04-08 | External mirror |
| cliproxyapi-dashboard | `~/cliproxyapi-dashboard` | itsmylife44/… | 2026-04-08 | External |
| dpcode | `~/dpcode` | Emanuele-web04/dpcode | 2026-04-09 | External |
| t3code | `~/t3code` | pingdotgg/t3code | 2026-04-09 | External |

## Stale (30-90 days)

33 dirs; notable krzemienski-owned: `awesome-list-site` (2026-02-06), `awesome-site`
(2026-02-09), `ralph-orchestrator` Desktop clone (2026-03-05, duplicate of `~/ralph-orchestrator`
that's active), `yt-transition-shorts-detector` home-level clone (2026-02-22, duplicate of
active Desktop clone), `code-story-platform` (2026-01-26). External stales:
`claude-agent-sdk-demos` (2026-03-13), `claude-cookbooks` (2026-03-18), `skills`
(2026-03-04, Anthropic), `bore`, `pytorch`, `superset`, `graphiti`, `ralph-tui`,
`ralph-wiggum-marketer`, `multi-agent-ralph-loop`, `dotai`, `stitch-skills`, `hive`,
`happy`, `frontend-slides`, `compound-product`, `everything-claude-code`,
`oh-my-claudecode`, `DeepSeek-OCR-2`, `craft-agents-oss`, `Aperant`.

## Abandoned (>90 days)

203 dirs. krzemienski-owned abandoned repos (likely candidates for GitHub archive or
deletion):

- **Shipped/snapshots, safe to archive**: `alm`, `awesome-list-manager`,
  `awesome-list-site-generator`, `awesome-researcher`, `awesome-video`,
  `awesome-list-site-generator`, `ott_device_matrix`, `abr-manifest-viewer-chrome` (2020),
  `hyper-term-theme` (2019), `stack-server`, `scdl_threaded`.
- **CCB iteration graveyard**: `claude-code-builder`, `claude-code-builder-final`,
  `claude-code-skills-factory`, `claude-code-sync`, `claude-code-web-server`,
  `claude-mobile-expo`, `claude-quickstarts`, `CodeAgentsMobile`, `CodeAgentsMobileold`,
  `claudia`, `enhanced-claude-code` — all superseded by active `autonomous-coder` +
  `claude-code-builder-agents-sdk`.
- **Shannon family dead**: `shannon-cli`, `shannon-framework`, `shannon-mcp` + many
  SCRATCH siblings. Previously noted in 18-post series as blog topic; recommend
  archive-with-note on GitHub.
- **Code-story/Code-tales**: `code-story` (2026-01-01, close), `CodeNexus`,
  `dark-video-portfolio`, `video-mosaic-dreamscape`, `vivid-design-playground`.
- **Deep-job family**: `deep-job-apply`, `deep-job-harvester`, `deep-job-search` —
  outside withagents.dev brand scope, archive candidates.
- **Playback/shorts precursors**: `playback-cut`, `playback-detection`,
  `playback-segment-analyzer`, `yt-shorts-progress` — superseded by active
  `yt-transition-shorts-detector`.
- **Nexus precursors**: `repo-nexus`, `reponexus`, `reponexus-vc` — if the active
  `~/Desktop/nexus` replaces them, archive.
- **Other**: `flacjacket`, `get-fit`, `headspin`, `hls-dash-dev-chrome-extension`,
  `jit-transcoder-packager`, `lashon-next`, `react-developer-portfolio`,
  `developerFolio`, `djso3`, `silicon-recon`, `test-video-assets`, `vqa`,
  `ccflare`/`better-ccflare`, `claude-code-marketplace`, `ralph-orchestrator-ski`,
  `dotai`, `scdl`.

## Local-Only (no GitHub counterpart)

17 git repos with **no remote** — these cannot be rebased onto brand narrative until
pushed. High-priority:

1. **`~/Desktop/blog-series`** — the repo *launching* withagents.dev; no remote set. MUST
   be pushed.
2. **`~/Desktop/nexus` + `~/nexus`** — both active, 2026-03-20. Dual copies risk drift.
   Pick one, push, delete other.
3. **`~/Desktop/capture-analyzer`**, **`~/Desktop/prd-creator`**, **`~/Desktop/claudecodeios`**,
   **`~/Desktop/claude-code-builder-final`**, **`~/Desktop/opcode-mobile-real`**,
   **`~/Desktop/automation-job-apply`** — abandoned local-only; evaluate brand-fit
   before push/archive.
4. Iteration scratch with `.git init` but never pushed: `ccb-0612`, `ccb-0614`, `ccbios`,
   `ccbios-enhanced`, `code-story-ralph-validation`, `get-fit-cards`, `opcode-mobile` —
   recommend delete.

**3 krzemienski remotes on disk but NOT in GitHub catalog** (renamed/deleted on
GitHub): `abr-manifest-viewer-chrome`, `claudia`, `ott_device_matrix`. Safe to ignore
for brand launch.

## Orphan Paths (no git, no GitHub)

125 SCRATCH dirs. Archive/delete candidates grouped:

- **ccb-* throwaways**: `ccb`, `ccb-final`, `ccb-m0`, `ccb-m0-test`, `ccb-m0-test-2`,
  `ccb-m0-test-final`, `ccb-mem0` (all on Desktop).
- **djs-* throwaways**: `djs`, `djs-agents`, `djs-bolt`, `djs-cc`, `djs-claude`,
  `djs-o3`, `djs-v41`, `djs-ws`.
- **shannon-* throwaways**: `shannon-agemt`, `shannon-cc`, `shannon-v4-enhancement-analysis`,
  `~/claude-shannon-skill`.
- **opcode throwaways**: `opcode`, `opcode-extracted`, `opcode-native`, `opcode-mobile`.
- **awesome-* throwaways**: `awesome-list-static-site`, `awesome-researcher-anthropic`,
  `awesome-video-working-static`, `~/awesome-list-site-v2`.
- **claude-code-builder sprawl**: `claude-code-builder-0614`, `claude-code-builder-autonomous`.
- **Stacked home-level scratch**: `airis`, `analysis-workspace`, `conductor`,
  `Continuous-Claude-v3`, `craft-agents-oss` (actually STALE), `Aperant`, `dotai`,
  `agent-os`, `agent-browser` precursors, `Skill_Seekers`, `pro-claude-setup`, `dotai`,
  `VibeCode`, `stitch-skills`, `superpowers`, `specWeaver`, `skill-mcp`,
  `memory`, `iboysoft-extensions`, `headspin-ai`, `lazydocker`.
- **Benchmark worktrees** (from mine-30d):
  `validationforge-benchmark-results-run-*` x 30+ entries are ephemeral workdir
  artifacts under ValidationForge — delete after benchmarking.

## Sorting by Product Family

| Family | Status | Recommended brand action |
|---|---|---|
| **ValidationForge / SessionForge / Remodex / Autonomous-Coder** | ACTIVE | Core brand pillars; ensure all 4 push to withagents.dev-adjacent repos |
| **CCB (`claude-code-builder-*` + `ccb*` + `autonomous-coder` + `claudia`)** | Active leader = `autonomous-coder` + `claude-code-builder-agents-sdk`; 9+ ABANDONED siblings + 8 SCRATCH | Pick one canonical repo, archive the graveyard on GitHub, delete SCRATCH siblings |
| **Code-Story / Code-Tales** (`code-story`, `code-story-platform`, `code-story-ralph-validation`, `code-story-rn`, `code-tales-ios`) | STALE leader, rest ABANDONED/SCRATCH | Low priority for brand launch; park whole family |
| **Ralph** (`ralph-orchestrator` x2, `ralph-tui` x2, `ralph-wiggum-marketer`, `ralph-mobile`, `ralph-orchestrator-ski`) | Mostly external, one ACTIVE (home) | No brand action; external reference |
| **Shannon** (`shannon-cli`, `shannon-framework`, `shannon-mcp` + 4 SCRATCH) | All ABANDONED/SCRATCH | Blog-series references shannon-framework repo (post 07, 16) — keep GitHub repo alive, archive locally |
| **Nexus** (`~/Desktop/nexus`, `~/nexus`, `repo-nexus`, `reponexus`, `reponexus-vc`, `NEXUS-Architecture`, `Nexusshell`) | 2 ACTIVE duplicates, 3 ABANDONED, 2 SCRATCH | Dedupe ACTIVE, push canonical, archive rest |
| **Opcode** (5 entries) | 2 ABANDONED, 3 SCRATCH | Archive/delete all |
| **Deep-Job** (5 entries) | Abandoned + SCRATCH | Outside withagents.dev scope — archive |
| **Awesome-** (12 entries) | 2 STALE active enough (`awesome-list-site`, `awesome-site`), rest ABANDONED/SCRATCH | Keep 2 flagship awesome-* repos on GitHub, archive rest |
| **YT-Shorts / Playback** (`yt-transition-shorts-detector` ACTIVE + 3 ABANDONED precursors + duplicates + SCRATCH worktrees) | Lead is ACTIVE | Clean worktrees + delete precursors |
| **ILS / iOS** (`ils-ios` ACTIVE, `amplifier-ios` SCRATCH, `~/ils` SCRATCH) | ACTIVE + 2 SCRATCH | Brand-aligned (iOS patterns post #5) |
| **Blog / Series** (`blog-series` ACTIVE, no remote) | Single ACTIVE leader | MUST push to GitHub before withagents.dev launch |

## Brand-launch recommendations

1. **Push `blog-series`** (no remote) and **`nexus`** to GitHub under `krzemienski/` before
   withagents.dev goes live.
2. **Dedupe duplicates** on disk: `~/nexus` vs `~/Desktop/nexus` (both active);
   `~/yt-transition-shorts-detector` (STALE) vs `~/Desktop/yt-transition-shorts-detector`
   (ACTIVE); `~/ralph-tui` (STALE) vs `~/Desktop/ralph-tui` (STALE).
3. **Mass-archive on GitHub** the ABANDONED krzemienski-owned repos that are NOT
   referenced in the 18-post blog series: awesome-list-manager, awesome-list-site-generator,
   awesome-researcher, awesome-video, deep-job-*, playback-*, claude-code-builder (dupes),
   CodeAgentsMobile*, CodeNexus, repo-nexus, reponexus, reponexus-vc, dark-video-portfolio,
   developerFolio, react-developer-portfolio, video-mosaic-dreamscape,
   vivid-design-playground, claude-mobile-expo, lashon-next, silicon-recon,
   better-ccflare/ccflare, ralph-orchestrator-ski. ~25 repos.
4. **Delete SCRATCH siblings** locally: ccb-*, djs-*, shannon-* (except referenced
   framework), opcode-*, awesome-*-working/static variants, validationforge-benchmark-results-*.
5. **Verify 14 unique blog-series companion repos** all have ACTIVE remotes before
   launch: `agentic-development-guide`, `multi-agent-consensus`, `claude-code-skills-factory`,
   `claude-ios-streaming-bridge`, `claude-code-ios`, `auto-claude-worktrees`,
   `shannon-framework`, `ralph-loop-patterns`, `session-insight-miner`,
   `stitch-design-to-code`, `reponexus`, `claude-mem-architecture`,
   `sequential-thinking-debugging`, `multi-agent-merge-orchestrator`,
   `claude-code-monorepo`. Cross-check against `/tmp/gh-repo-names.txt` shows most exist
   on GitHub except possibly `reponexus` (present but ABANDONED locally). Confirm live.

## Unresolved Questions

1. Are `~/Desktop/nexus` and `~/nexus` the same project or divergent forks? (Both dated
   2026-03-20, but one has an "Initial commit" message and the other has "fix: address
   architect review conditions" — likely separate lines.)
2. Should the `validationforge-benchmark-results-*` worktree artifacts (30+ entries in
   mine-30d data) be pruned from disk or kept for benchmark reproducibility?
3. Is `blog-series` intentionally remote-less (private-by-design) or simply not yet
   pushed? Launch plan needs confirmed publication path.
4. Does the withagents.dev brand want `autonomous-coder` OR `claude-code-builder-agents-sdk`
   as the canonical CCB product? Both are ACTIVE; pick one for marketing lead.
5. The 3 krzemienski remotes missing from GH catalog (`abr-manifest-viewer-chrome`,
   `claudia`, `ott_device_matrix`) — are these intentional deletes/renames on the GH
   side, or are the local repos pointing at renamed destinations? Confirm before any
   cleanup.
