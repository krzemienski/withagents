# Phase 2: Post-Repo Integration

**Priority:** HIGH — requires Phase 1 complete
**Status:** Not started

## Goal

Every post must reference its companion repo's actual code with GitHub hyperlinks and inline code quotes. Posts should read like the repo is the living implementation of the post's ideas.

## Integration Pattern

For each post, add/update these sections:

### 1. Companion Repository CTA (end of post)

```markdown
## Companion Repository

The complete implementation is available at [{repo-name}](https://github.com/krzemienski/{repo-name}).

**Quick start:**
\```bash
git clone https://github.com/krzemienski/{repo-name}.git
cd {repo-name}
{install-command}
{run-command}
\```
```

### 2. Inline Code References

Replace generic code blocks with repo-linked code:

**Before:**
```markdown
\```python
def validate_screenshot(path):
    # validation logic
    ...
\```
```

**After:**
```markdown
From [`src/validator.py`](https://github.com/krzemienski/ui-validation-at-scale/blob/main/src/validator.py#L42-L58):

\```python
def validate_screenshot(path: str) -> ValidationResult:
    """Validate a screenshot against ground truth."""
    image = Image.open(path)
    # ... actual implementation from repo
\```
```

### 3. Architecture Diagram Links

Where posts have Mermaid architecture diagrams, add a note:

```markdown
> See the full implementation of this architecture in the
> [companion repository](https://github.com/krzemienski/{repo-name}).
```

## Per-Post Agent Prompt

```
Integrate companion repo into blog post {N}.

Post: posts/post-{NN}-{slug}/post.md
Repo: /Users/nick/Desktop/blog-series/{repo-name}/

Tasks:
1. Read the FULL post
2. Read the repo's key source files
3. Identify 3-5 code blocks in the post that correspond to repo files
4. Replace those code blocks with GitHub-linked versions:
   - Add "From [`path/file.py`](https://github.com/krzemienski/{repo}/blob/main/path/file.py#L{start}-L{end}):" before each block
   - Ensure the code in the post MATCHES the repo code exactly
5. Add/update "Companion Repository" section at end of post with quick start
6. Add GitHub repo badge near the top (after TL;DR if present)
7. Verify the github_repo frontmatter field matches

Do NOT change the post's narrative, structure, or word count significantly.
Only add repo references and update code blocks.
```

## Batch Strategy

5 parallel agents, each handling ~10 posts (matching Phase 1 batches so the agent already knows the repo structure).

## Verification

```bash
# Every post must contain at least one GitHub link to its repo
for d in posts/post-*/; do
  repo=$(grep '^github_repo:' "$d/post.md" | sed 's/.*"//;s/".*//' | sed 's|.*/||')
  links=$(grep -c "github.com/krzemienski/$repo" "$d/post.md" 2>/dev/null)
  echo "$(basename $d): $links GitHub links"
done
```
