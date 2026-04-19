# readme-patcher

Patches a companion repo's `README.md` with a "Featured in" cross-link to the
corresponding withagents.dev post. Uses the `gh` CLI to clone, edit, commit,
and push — no local checkout required beyond this repo.

## Marker contract

The patcher writes content between two HTML comment markers:

```
<!-- withagents-featured-start -->
## Featured in
...block content...
<!-- withagents-featured-end -->
```

**Idempotent:** if the markers already exist in the target README, the block
between them is replaced. Running the same patch file twice produces no second
commit if the content is identical.

**First-time insertion:** if no markers exist, the block is inserted immediately
below the README's first H1 heading (or prepended if no H1 is found).

## Input format — `.readme-patch.md`

Files live in `withagents-site/src/content/posts/` with the naming pattern:

```
day-NN-{slug}.readme-patch.md
```

Required structure:

```markdown
# README patch — {repo-slug}

Optional prose instructions (ignored by the patcher).

---

## Featured in

**Post title** — short descriptor. Published DATE on withagents.dev.

→ [Read the post](https://withagents.dev/writing/day-NN-slug)

Companion series: ...

---
```

- The H1 `# README patch — {repo-slug}` provides the target repo name.
- Everything from `## Featured in` up to the first closing `---` separator
  becomes the injected block (including the heading itself).

## Usage

### Patch a single repo

```bash
npx tsx patcher.ts --patch withagents-site/src/content/posts/day-01-validationforge-ga.readme-patch.md
```

### Dry-run (print what would change, no push)

```bash
npx tsx patcher.ts \
  --patch withagents-site/src/content/posts/day-01-validationforge-ga.readme-patch.md \
  --dry-run
```

### Override GitHub owner

```bash
npx tsx patcher.ts \
  --patch day-05-auto-claude-worktrees.readme-patch.md \
  --owner my-org \
  --dry-run
```

### Override commit message

```bash
npx tsx patcher.ts \
  --patch day-10-ccb-evolution.readme-patch.md \
  --commit-msg "docs: cross-link withagents.dev CCB Evolution post"
```

## All flags

| Flag | Default | Description |
|------|---------|-------------|
| `--patch <file>` | — | Path to `.readme-patch.md` (**required**) |
| `--owner <handle>` | `krzemienski` | GitHub owner/org |
| `--dry-run` | false | Preview changes, no push |
| `--tmp-dir <dir>` | OS temp | Override clone temp directory |
| `--commit-msg <msg>` | `docs: add withagents.dev "Featured in" section` | Git commit message |

`--owner` can also be set via the `GH_OWNER` environment variable.

## Requirements

- `gh` CLI installed: https://cli.github.com/
- Authenticated: `gh auth login`
- Write access to the target repo (push to default branch)

The patcher checks for `gh` on startup and prints a friendly error if missing.

## Module API

```typescript
import { patchRepo } from "./patcher.js";
import { loadReadmePatch, parseReadmePatch } from "./parse-readme-patch.js";

// Parse a patch file
const patch = loadReadmePatch("day-01-validationforge-ga.readme-patch.md");
// patch.repoSlug       → "validationforge"
// patch.featuredInBlock → "## Featured in\n\n**ValidationForge goes GA...**"

// Run the patch (clones, edits, commits, pushes)
const result = await patchRepo({
  patchFile: "day-01-validationforge-ga.readme-patch.md",
  owner: "krzemienski",
  dryRun: false,
});
// result.changed    → true/false
// result.commitSha  → "abc1234" | null
```

## How the scheduler calls this

The scheduler (`runner.ts`) calls `patchRepo()` automatically for any calendar
day whose `Repo README` column is non-empty and a matching `.readme-patch.md`
file exists in `withagents-site/src/content/posts/`. No manual invocation
needed during the 45-day push.
