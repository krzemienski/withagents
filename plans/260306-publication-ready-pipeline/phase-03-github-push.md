# Phase 3: GitHub Push (61 repos)

**Priority:** HIGH — requires Phase 1 complete
**Status:** Not started

## Goal

Push all 61 companion repos to github.com/krzemienski/{name}. Each repo should be its own GitHub repository (not a subdirectory of blog-series).

## Strategy

### Pre-flight
```bash
# Verify gh CLI is authenticated
gh auth status

# Verify all repos exist locally
for repo in $(ls -d */README.md | sed 's|/README.md||'); do echo "$repo"; done | wc -l
```

### Push Script (sequential — GitHub API rate limits)

For each repo:
```bash
cd /Users/nick/Desktop/blog-series/{repo-name}

# Initialize git if needed
git init
git add -A
git commit -m "feat: initial companion repo for Agentic Development post {N}"

# Create GitHub repo (public, no wiki/projects)
gh repo create krzemienski/{repo-name} --public --description "{post-title} — Companion repo for Agentic Development #{N}" --source=. --push
```

### Existing Repos (Posts 1-11)

These 10 repos already exist locally but may not be on GitHub:
- agentic-development-guide
- multi-agent-consensus
- functional-validation-framework
- claude-ios-streaming-bridge
- claude-sdk-bridge
- auto-claude-worktrees
- claude-prompt-stack
- ralph-orchestrator-guide
- code-tales
- stitch-design-to-code
- ai-dev-operating-system

Check each: `gh repo view krzemienski/{name} 2>/dev/null || echo "NEEDS PUSH"`

### Rate Limiting

GitHub API allows ~30 repo creations per hour. With 50 new repos + 11 existing:
- Batch 1: Create repos 1-30 (30 min with delays)
- Batch 2: Create repos 31-61 (20 min with delays)
- Add 2-second delay between API calls

### Post-Push Verification

```bash
for repo_name in $(cat all-repos.txt); do
  status=$(gh repo view krzemienski/$repo_name --json url -q '.url' 2>/dev/null)
  if [ -z "$status" ]; then echo "MISSING: $repo_name"; else echo "OK: $status"; fi
done
```

## Verification

- [ ] All 61 repos visible at github.com/krzemienski/{name}
- [ ] Each repo has README, LICENSE, source code
- [ ] Each repo's description mentions "Agentic Development"
- [ ] No repos are empty/placeholder
