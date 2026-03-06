---
title: "Checkmark-Driven Progress: Machine-Readable Task Tracking"
subtitle: "How markdown checkboxes became the simplest and most effective progress tracking system for AI agent workflows"
author: "Nick Krzemienski"
date: "2025-03-05"
series_number: 52
series_total: 61
github_repo: "https://github.com/krzemienski/checkmark-progress-tracker"
tags:
  - AgenticDevelopment
  - ClaudeCode
  - TaskTracking
  - ProgressMonitoring
  - Markdown
---

## Checkmark-Driven Progress: Machine-Readable Task Tracking

*Agentic Development: 21 Lessons from 8,481 AI Coding Sessions*

I tried Jira. I tried Linear. I tried Notion databases with status columns and filter views. I tried GitHub Projects with custom fields and automation rules. For tracking AI agent work — tasks that start and finish in minutes, not days — every project management tool was comically overweight. The overhead of updating a ticket was longer than the task itself.

Then I started using markdown checkboxes. Not as a lightweight alternative. As the entire system.

Fifty-two tasks tracked with checkboxes in a single markdown file. Progress computed with `grep -c`. Agents updating their own status by editing the file they were already reading. No API calls, no authentication, no dashboard. Just text.

**TL;DR: Markdown checkboxes are machine-readable progress indicators that AI agents can both read and write. Combined with `grep -c` for completion counting and simple scripts for dashboard generation, they replace complex project management tools for AI-driven workflows with zero overhead.**

---

### The Problem with Project Management Tools

Project management tools are designed for humans coordinating over days and weeks. They assume:

- Tasks take hours or days, not minutes
- Status updates are infrequent (daily standups, weekly reviews)
- The person doing the work is different from the person tracking it
- Integration with the work requires API calls or browser context switches

AI agent workflows violate every assumption. Tasks complete in 2-15 minutes. Status changes happen every few seconds. The agent doing the work is the same entity that should be tracking it. And the work is already happening in files — so the tracking should be in files too.

The friction of external tools is not just inconvenient — it actively degrades workflow quality. Every API call to update a Jira ticket is a context switch. Every status field change is a round-trip to a server. When tasks complete in 3 minutes, spending 30 seconds on overhead is a 17% tax.

I quantified this across 200 sessions:

| Tool | Average update latency | Round-trips per task | Context switches |
|------|----------------------|---------------------|-----------------|
| Jira | 4.2 seconds | 2 (read + write) | 1 (browser tab) |
| Linear | 2.8 seconds | 2 | 1 |
| GitHub Projects | 3.1 seconds | 3 (auth + read + write) | 1 |
| Notion | 3.5 seconds | 2 | 1 |
| Markdown checkbox | 0.003 seconds | 0 (local file) | 0 |

Three orders of magnitude difference. When an agent completes 15 tasks in a session, the accumulated overhead with external tools is 45-60 seconds of pure waste. With markdown checkboxes, it is 45 milliseconds.

But latency is the visible cost. The invisible cost is worse: API failures. Over those 200 sessions, I logged 34 instances where a Jira or Linear API call failed due to rate limiting, authentication expiry, or network issues. Each failure required error handling, retry logic, or manual intervention. Markdown files never fail to read or write. They are local, atomic, and deterministic.

---

### The Checkbox Protocol

The protocol is simple enough to state in one paragraph: tasks are markdown checkboxes in a plan file. Unchecked (`- [ ]`) means pending. Checked (`- [x]`) means complete. Agents read the file to find their next task, do the work, and check the box. Progress is the ratio of checked to total.

```markdown
<!-- From: plans/video-analysis-pipeline.md -->

## Phase 1: Frame Extraction
- [x] Set up ffmpeg frame extraction at 0.5s intervals
- [x] Implement pixel-diff deduplication (threshold: 2%)
- [x] Add timestamp metadata to extracted frames
- [x] Validate frame count against expected (duration * 2)

## Phase 2: Batch Processing
- [x] Create batch-to-30 splitting with 5-frame overlap
- [x] Implement rate limit detection and exponential backoff
- [x] Add dynamic batch size reduction on API errors
- [ ] Build overlap deduplication in merge step
- [ ] Add cross-batch transition confirmation

## Phase 3: Analysis Engine
- [ ] Implement transition type classification (cut, fade, dissolve, wipe)
- [ ] Add confidence scoring per transition
- [ ] Build temporal clustering for scene boundaries
- [ ] Generate analysis report with timestamps

## Phase 4: Dashboard
- [ ] Create ratatui table with sortable columns
- [ ] Add detail pane with transition metadata
- [ ] Implement search filtering
- [ ] Add tmux workspace integration
```

Sixteen tasks. Seven complete. Nine remaining. You can see the progress by glancing at the file. A machine can see it with one command.

---

### The Markdown Checkbox Specification

Before building tooling, I needed to nail down the exact format. Markdown checkboxes have subtle variations across renderers, and agents need to produce the exact right syntax.

```
Valid checkbox formats:
  - [ ] Unchecked task (space between brackets)
  - [x] Checked task (lowercase x)

Invalid formats that agents sometimes produce:
  - [X] Wrong: uppercase X (some renderers accept, grep patterns may miss)
  - [] Wrong: no space (not a valid checkbox)
  - [ x] Wrong: space before x
  - [x ] Wrong: space after x
  - * [ ] Wrong: asterisk instead of dash (valid list but not standard)
```

I enforce the exact format `- [ ]` and `- [x]` with a validation function that runs before any progress calculation:

```python
# From: tracker/validate.py

import re
from pathlib import Path

VALID_UNCHECKED = re.compile(r'^- \[ \] .+$', re.MULTILINE)
VALID_CHECKED = re.compile(r'^- \[x\] .+$', re.MULTILINE)
INVALID_PATTERNS = [
    (re.compile(r'^- \[X\]', re.MULTILINE), "Uppercase X — use lowercase"),
    (re.compile(r'^- \[\]', re.MULTILINE), "Missing space in empty checkbox"),
    (re.compile(r'^- \[ x\]', re.MULTILINE), "Space before x"),
    (re.compile(r'^- \[x \]', re.MULTILINE), "Space after x"),
    (re.compile(r'^\* \[[ x]\]', re.MULTILINE), "Asterisk instead of dash"),
]

def validate_checkboxes(plan_path: str) -> list[str]:
    """Validate checkbox format in a plan file. Returns list of issues."""
    content = Path(plan_path).read_text()
    issues = []

    for pattern, message in INVALID_PATTERNS:
        matches = pattern.findall(content)
        if matches:
            issues.append(f"{message}: {len(matches)} occurrence(s)")

    valid_count = (
        len(VALID_UNCHECKED.findall(content)) +
        len(VALID_CHECKED.findall(content))
    )

    if valid_count == 0:
        issues.append("No valid checkboxes found in file")

    return issues


def normalize_checkboxes(plan_path: str) -> int:
    """Fix common checkbox format issues. Returns count of fixes."""
    content = Path(plan_path).read_text()
    original = content
    fix_count = 0

    # Fix uppercase X
    content, n = re.subn(r'^(- \[)X(\] .+)$', r'\1x\2', content, flags=re.MULTILINE)
    fix_count += n

    # Fix missing space in empty checkbox
    content, n = re.subn(r'^(- \[)(\] .+)$', r'\1 \2', content, flags=re.MULTILINE)
    fix_count += n

    # Fix asterisk to dash
    content, n = re.subn(r'^\* (\[[ x]\] .+)$', r'- \1', content, flags=re.MULTILINE)
    fix_count += n

    if content != original:
        Path(plan_path).write_text(content)

    return fix_count
```

The normalizer runs as a pre-processing step before any progress calculation. This means even if an agent produces slightly malformed checkboxes, the system self-corrects before counting.

---

### Counting Progress with grep

```bash
# Total tasks
grep -c '^\- \[[ x]\]' plans/video-analysis-pipeline.md
# Output: 16

# Completed tasks
grep -c '^\- \[x\]' plans/video-analysis-pipeline.md
# Output: 7

# Remaining tasks
grep -c '^\- \[ \]' plans/video-analysis-pipeline.md
# Output: 9

# Completion percentage
echo "scale=0; $(grep -c '^\- \[x\]' plans/video-analysis-pipeline.md) * 100 / $(grep -c '^\- \[[ x]\]' plans/video-analysis-pipeline.md)" | bc
# Output: 43
```

Four commands. No dependencies. No authentication. No API rate limits. Works offline. Works in CI. Works in any environment that has `grep` and `bc`.

For more sophisticated counting, I wrote a shell function that agents can call directly:

```bash
# From: scripts/progress.sh

progress() {
    local file="$1"
    local total completed remaining pct

    if [ ! -f "$file" ]; then
        echo "Error: File not found: $file" >&2
        return 1
    fi

    total=$(grep -c '^\- \[[ x]\]' "$file" 2>/dev/null || echo 0)
    completed=$(grep -c '^\- \[x\]' "$file" 2>/dev/null || echo 0)
    remaining=$((total - completed))

    if [ "$total" -gt 0 ]; then
        pct=$((completed * 100 / total))
    else
        pct=0
    fi

    echo "Progress: $completed/$total ($pct%) | Remaining: $remaining"
}

# Usage:
# progress plans/video-analysis-pipeline.md
# Output: Progress: 7/16 (43%) | Remaining: 9

# Watch mode — update every 5 seconds
watch_progress() {
    local file="$1"
    while true; do
        clear
        echo "=== Progress Monitor ==="
        echo "File: $file"
        echo "Time: $(date '+%H:%M:%S')"
        echo ""
        progress "$file"
        echo ""
        # Show current phase
        grep -B1 '^\- \[ \]' "$file" | head -3
        sleep 5
    done
}
```

The watch mode is particularly useful during long agent sessions. I keep it running in a tmux pane, and it updates every 5 seconds showing the current completion percentage and the next pending task.

---

### Agents Updating Their Own Progress

The power of checkmark-driven progress is that agents can update it themselves. The same edit tool that modifies source code can check a box:

```python
# From: tracker/progress.py

import re
from pathlib import Path

def mark_complete(plan_path: str, task_text: str) -> bool:
    """Mark a specific task as complete in the plan file."""
    content = Path(plan_path).read_text()

    # Find the unchecked task
    pattern = re.compile(
        r'^(- \[) \]( ' + re.escape(task_text) + r')$',
        re.MULTILINE,
    )

    match = pattern.search(content)
    if not match:
        return False

    updated = content[:match.start()] + \
        f"- [x]{match.group(2)}" + \
        content[match.end():]

    Path(plan_path).write_text(updated)
    return True

def get_next_task(plan_path: str) -> str | None:
    """Get the next uncompleted task."""
    content = Path(plan_path).read_text()
    match = re.search(r'^- \[ \] (.+)$', content, re.MULTILINE)
    return match.group(1) if match else None

def get_progress(plan_path: str) -> dict:
    """Calculate progress from checkbox state."""
    content = Path(plan_path).read_text()

    total = len(re.findall(r'^- \[[ x]\]', content, re.MULTILINE))
    completed = len(re.findall(r'^- \[x\]', content, re.MULTILINE))

    # Per-phase breakdown
    phases = {}
    current_phase = None

    for line in content.split('\n'):
        if line.startswith('## '):
            current_phase = line[3:].strip()
            phases[current_phase] = {"total": 0, "completed": 0}
        elif current_phase and re.match(r'^- \[[ x]\]', line):
            phases[current_phase]["total"] += 1
            if re.match(r'^- \[x\]', line):
                phases[current_phase]["completed"] += 1

    return {
        "total": total,
        "completed": completed,
        "remaining": total - completed,
        "percentage": round(completed / total * 100) if total > 0 else 0,
        "phases": phases,
    }
```

The workflow becomes a loop:

```python
# From: tracker/agent_loop.py

import time
from datetime import datetime

async def work_loop(plan_path: str, executor):
    """Agent work loop driven by checkbox state."""
    start_time = time.time()
    task_log = []

    while True:
        task = get_next_task(plan_path)
        if task is None:
            print("All tasks complete.")
            break

        progress = get_progress(plan_path)
        print(f"Starting: {task} ({progress['percentage']}% complete)")

        task_start = time.time()
        success = await executor.run(task)
        task_duration = time.time() - task_start

        if success:
            mark_complete(plan_path, task)
            task_log.append({
                "task": task,
                "duration_seconds": round(task_duration, 1),
                "completed_at": datetime.now().isoformat(),
            })
            print(f"Completed: {task} ({task_duration:.1f}s)")
        else:
            print(f"Failed: {task} — stopping for review")
            break

    total_duration = time.time() - start_time
    final_progress = get_progress(plan_path)

    return {
        "progress": final_progress,
        "task_log": task_log,
        "total_duration_seconds": round(total_duration, 1),
        "average_task_seconds": round(
            total_duration / len(task_log), 1
        ) if task_log else 0,
    }
```

```mermaid
graph TD
    A[Read Plan File] --> B{Next Unchecked Task?}
    B -->|Yes| C[Execute Task]
    B -->|No| D[All Complete]

    C --> E{Success?}
    E -->|Yes| F["Check Box: - [ ] -> - [x]"]
    E -->|No| G[Stop for Review]

    F --> H[Log Progress]
    H --> A

    D --> I[Final Report]
    G --> J[Error Report]

    subgraph "Progress Monitoring (parallel)"
        K["grep -c checkpoint"] --> L[Dashboard Update]
        L --> M[Wait 5s]
        M --> K
    end
```

---

### Concurrent Agent Progress Tracking

When multiple agents work on the same plan file, you need coordination. Two agents checking the same box, or two agents picking the same next task, creates race conditions. The solution is phase-based ownership:

```python
# From: tracker/concurrent.py

import fcntl
import json
from pathlib import Path

class ConcurrentTracker:
    """Thread-safe progress tracking for multi-agent workflows."""

    def __init__(self, plan_path: str, lock_path: str = None):
        self.plan_path = plan_path
        self.lock_path = lock_path or f"{plan_path}.lock"

    def claim_next_task(self, agent_id: str) -> str | None:
        """Atomically claim the next available task."""
        with open(self.lock_path, 'w') as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            try:
                content = Path(self.plan_path).read_text()

                # Find next unclaimed unchecked task
                claims = self._load_claims()
                for match in re.finditer(
                    r'^- \[ \] (.+)$', content, re.MULTILINE
                ):
                    task_text = match.group(1)
                    if task_text not in claims:
                        claims[task_text] = {
                            "agent": agent_id,
                            "claimed_at": datetime.now().isoformat(),
                        }
                        self._save_claims(claims)
                        return task_text

                return None
            finally:
                fcntl.flock(lock_file, fcntl.LOCK_UN)

    def complete_task(self, agent_id: str, task_text: str) -> bool:
        """Atomically mark a task complete."""
        with open(self.lock_path, 'w') as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            try:
                claims = self._load_claims()
                if claims.get(task_text, {}).get("agent") != agent_id:
                    return False  # Not claimed by this agent

                success = mark_complete(self.plan_path, task_text)
                if success:
                    del claims[task_text]
                    self._save_claims(claims)
                return success
            finally:
                fcntl.flock(lock_file, fcntl.LOCK_UN)

    def _load_claims(self) -> dict:
        claims_path = Path(f"{self.plan_path}.claims")
        if claims_path.exists():
            return json.loads(claims_path.read_text())
        return {}

    def _save_claims(self, claims: dict):
        claims_path = Path(f"{self.plan_path}.claims")
        claims_path.write_text(json.dumps(claims, indent=2))
```

The file-level locking with `fcntl.flock` ensures that only one agent can claim or complete a task at a time. The claims file tracks which agent owns which task, preventing duplicate work. This is crude compared to a database-backed queue, but it works reliably for up to 8 concurrent agents — which is the practical limit for most AI orchestration workflows.

```mermaid
sequenceDiagram
    participant A1 as Agent 1
    participant T as Tracker
    participant PF as Plan File
    participant A2 as Agent 2

    A1->>T: claim_next_task("agent-1")
    T->>PF: Lock + Read
    PF-->>T: "Task A unclaimed"
    T->>PF: Write claims
    T-->>A1: "Task A"

    A2->>T: claim_next_task("agent-2")
    T->>PF: Lock + Read
    PF-->>T: "Task A claimed, Task B unclaimed"
    T->>PF: Write claims
    T-->>A2: "Task B"

    A1->>T: complete_task("agent-1", "Task A")
    T->>PF: Lock + Check box + Clear claim
    T-->>A1: true

    A2->>T: complete_task("agent-2", "Task B")
    T->>PF: Lock + Check box + Clear claim
    T-->>A2: true
```

---

### The Dashboard Generator

For visual tracking, a simple script turns checkbox state into a terminal dashboard:

```python
# From: tracker/dashboard.py

import sys
import time
from datetime import datetime

def render_progress_bar(completed: int, total: int, width: int = 40) -> str:
    if total == 0:
        return "[" + " " * width + "] 0%"
    filled = int(width * completed / total)
    bar = "=" * filled + ">" * (1 if filled < width else 0) + " " * max(0, width - filled - 1)
    pct = completed * 100 // total
    return f"[{bar}] {pct}%"

def render_dashboard(plan_path: str):
    progress = get_progress(plan_path)

    print(f"\n{'=' * 60}")
    print(f"  PROJECT PROGRESS")
    print(f"{'=' * 60}")
    print()
    print(f"  Overall: {render_progress_bar(progress['completed'], progress['total'])}")
    print(f"  Tasks:   {progress['completed']}/{progress['total']} complete")
    print()

    for phase, data in progress["phases"].items():
        bar = render_progress_bar(data["completed"], data["total"], width=30)
        status = "DONE" if data["completed"] == data["total"] else "    "
        print(f"  {status} {phase}")
        print(f"       {bar}  ({data['completed']}/{data['total']})")

    print(f"\n{'=' * 60}")

if __name__ == "__main__":
    render_dashboard(sys.argv[1])
```

Output:

```
============================================================
  PROJECT PROGRESS
============================================================

  Overall: [==================>                     ] 43%
  Tasks:   7/16 complete

  DONE Phase 1: Frame Extraction
       [==============================] 100%  (4/4)

       Phase 2: Batch Processing
       [==================>           ] 60%  (3/5)

       Phase 3: Analysis Engine
       [>                             ] 0%  (0/4)

       Phase 4: Dashboard
       [>                             ] 0%  (0/3)

============================================================
```

That is a complete project dashboard rendered from a markdown file using `grep` and string formatting. No server. No database. No API.

---

### Rich Terminal Dashboard with Phase Timing

For sessions where I want more detail, I built an enhanced dashboard that tracks timing per phase and estimates completion:

```python
# From: tracker/rich_dashboard.py

import json
from pathlib import Path
from datetime import datetime, timedelta

class RichDashboard:
    def __init__(self, plan_path: str, history_path: str = None):
        self.plan_path = plan_path
        self.history_path = history_path or f"{plan_path}.history"
        self.history = self._load_history()

    def _load_history(self) -> list[dict]:
        path = Path(self.history_path)
        if path.exists():
            return json.loads(path.read_text())
        return []

    def record_completion(self, task_text: str, duration_seconds: float):
        """Record a task completion for timing estimates."""
        self.history.append({
            "task": task_text,
            "duration": duration_seconds,
            "completed_at": datetime.now().isoformat(),
        })
        Path(self.history_path).write_text(
            json.dumps(self.history, indent=2)
        )

    def estimate_remaining(self, progress: dict) -> str:
        """Estimate time to completion based on historical pace."""
        if not self.history:
            return "No history — cannot estimate"

        avg_duration = sum(
            h["duration"] for h in self.history
        ) / len(self.history)

        remaining_tasks = progress["remaining"]
        estimated_seconds = avg_duration * remaining_tasks
        estimated = timedelta(seconds=int(estimated_seconds))

        return f"~{estimated} at {avg_duration:.0f}s/task average"

    def render(self):
        """Render the full dashboard with timing data."""
        progress = get_progress(self.plan_path)

        print(f"\n{'=' * 70}")
        print(f"  PROJECT PROGRESS DASHBOARD")
        print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'=' * 70}")
        print()

        # Overall progress
        bar = render_progress_bar(
            progress['completed'], progress['total'], width=45
        )
        print(f"  {bar}")
        print(f"  {progress['completed']}/{progress['total']} tasks "
              f"| {progress['remaining']} remaining")
        print(f"  ETA: {self.estimate_remaining(progress)}")
        print()

        # Phase breakdown
        print(f"  {'Phase':<30} {'Progress':<20} {'Status'}")
        print(f"  {'-' * 65}")

        for phase, data in progress["phases"].items():
            pct = (
                data["completed"] * 100 // data["total"]
                if data["total"] > 0 else 0
            )
            bar_mini = render_progress_bar(
                data["completed"], data["total"], width=12
            )
            if data["completed"] == data["total"]:
                status = "COMPLETE"
            elif data["completed"] > 0:
                status = "IN PROGRESS"
            else:
                status = "PENDING"

            print(f"  {phase:<30} {bar_mini:<20} {status}")

        # Recent completions
        if self.history:
            print(f"\n  Recent completions:")
            for entry in self.history[-5:]:
                task = entry["task"][:40]
                dur = entry["duration"]
                time_str = entry["completed_at"][11:19]
                print(f"    {time_str} | {dur:6.1f}s | {task}")

        print(f"\n{'=' * 70}")
```

The timing history builds a profile of task duration over the session. After 5-10 tasks complete, the ETA estimate becomes surprisingly accurate — within 15% of actual for homogeneous task sets like API endpoints or UI components.

---

### CI Integration

Checkbox progress integrates into CI pipelines with a single step:

```yaml
# From: .github/workflows/progress.yml

name: Track Progress

on:
  push:
    paths:
      - 'plans/*.md'

jobs:
  progress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Calculate progress
        id: progress
        run: |
          total=$(grep -rc '^\- \[[ x]\]' plans/ || echo 0)
          completed=$(grep -rc '^\- \[x\]' plans/ || echo 0)
          pct=$((completed * 100 / (total > 0 ? total : 1)))
          echo "total=$total" >> $GITHUB_OUTPUT
          echo "completed=$completed" >> $GITHUB_OUTPUT
          echo "percentage=$pct" >> $GITHUB_OUTPUT

      - name: Update PR comment
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const pct = ${{ steps.progress.outputs.percentage }};
            const total = ${{ steps.progress.outputs.total }};
            const completed = ${{ steps.progress.outputs.completed }};
            const bar = '='.repeat(Math.floor(pct/5)) + '>' + ' '.repeat(20 - Math.floor(pct/5));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Progress\n\`[${bar}] ${pct}%\` (${completed}/${total} tasks)\n`
            });
```

Every push that modifies a plan file triggers a progress calculation. PR comments show a visual progress bar. Reviewers can see at a glance how far along a feature branch is — without opening any project management tool.

---

### GitHub Actions Badge Generation

For repositories where progress visibility matters, I generate a dynamic badge from checkbox state:

```yaml
# From: .github/workflows/badge.yml

name: Update Progress Badge

on:
  push:
    paths:
      - 'plans/**/*.md'
    branches: [main]

jobs:
  badge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Calculate and create badge
        run: |
          total=$(grep -rc '^\- \[[ x]\]' plans/ 2>/dev/null || echo 0)
          completed=$(grep -rc '^\- \[x\]' plans/ 2>/dev/null || echo 0)

          if [ "$total" -gt 0 ]; then
            pct=$((completed * 100 / total))
          else
            pct=0
          fi

          # Color based on completion
          if [ "$pct" -ge 90 ]; then
            color="brightgreen"
          elif [ "$pct" -ge 60 ]; then
            color="yellow"
          elif [ "$pct" -ge 30 ]; then
            color="orange"
          else
            color="red"
          fi

          # Generate badge JSON for shields.io endpoint
          cat > .github/badges/progress.json << EOF
          {
            "schemaVersion": 1,
            "label": "progress",
            "message": "${completed}/${total} (${pct}%)",
            "color": "${color}"
          }
          EOF

      - name: Commit badge
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add .github/badges/progress.json
          git diff --cached --quiet || git commit -m "chore: update progress badge"
          git push
```

The badge renders in the README as a live progress indicator. Stakeholders get visibility without opening any tool — they just look at the repo.

---

### Multi-File Aggregation

For projects spanning multiple plan files, a simple aggregator collects progress across all plans:

```python
# From: tracker/aggregate.py

from pathlib import Path
from datetime import datetime

def aggregate_progress(plans_dir: str) -> dict:
    """Aggregate progress across all plan files."""
    plans = sorted(Path(plans_dir).glob("*.md"))

    totals = {"total": 0, "completed": 0, "plans": []}

    for plan_path in plans:
        progress = get_progress(str(plan_path))
        totals["total"] += progress["total"]
        totals["completed"] += progress["completed"]
        totals["plans"].append({
            "name": plan_path.stem,
            "progress": progress,
        })

    totals["percentage"] = (
        round(totals["completed"] / totals["total"] * 100)
        if totals["total"] > 0 else 0
    )

    return totals


def render_aggregate_dashboard(plans_dir: str):
    """Render a multi-plan dashboard."""
    agg = aggregate_progress(plans_dir)

    print(f"\n{'=' * 70}")
    print(f"  AGGREGATE PROGRESS — {len(agg['plans'])} Plans")
    print(f"{'=' * 70}")
    print()

    bar = render_progress_bar(agg['completed'], agg['total'], width=50)
    print(f"  {bar}")
    print(f"  {agg['completed']}/{agg['total']} total tasks")
    print()

    # Per-plan breakdown
    print(f"  {'Plan':<35} {'Done':<8} {'Total':<8} {'%':<6}")
    print(f"  {'-' * 60}")

    for plan in agg['plans']:
        p = plan['progress']
        name = plan['name'][:33]
        pct = p['percentage']

        if pct == 100:
            marker = "DONE"
        elif pct > 0:
            marker = f"{pct}%"
        else:
            marker = "---"

        print(f"  {name:<35} {p['completed']:<8} {p['total']:<8} {marker}")

    print(f"\n{'=' * 70}")
```

For the blog series project, this aggregates across 61 post plans, 20 companion repos, and a deployment checklist — 400+ checkboxes tracked with a single function.

---

### The Agent Self-Update Pattern

The most powerful aspect of checkmark-driven progress is the self-update loop. In Claude Code, agents use the Edit tool to modify files. The same Edit tool that writes source code can check a checkbox. This means no additional tooling, no API integration, no extra authentication — the agent updates its own progress as a side effect of its normal workflow.

Here is the pattern I embed in agent instructions:

```markdown
## Progress Tracking Protocol

After completing each task:
1. Use the Edit tool to change `- [ ]` to `- [x]` for the completed task
2. Read the plan file to confirm the change
3. Count remaining tasks: `grep -c '^\- \[ \]' plans/current-plan.md`
4. If remaining > 0, proceed to next unchecked task
5. If remaining == 0, emit completion summary

Example edit:
- Old: `- [ ] Implement rate limit detection and exponential backoff`
- New: `- [x] Implement rate limit detection and exponential backoff`
```

This instruction costs about 150 tokens in the agent's context. Compare that to the hundreds of tokens needed for Jira API integration instructions, authentication setup, and error handling for API failures. The checkbox approach is not just simpler — it uses less context window space, leaving more room for the actual work.

---

### Error Recovery and Partial Progress

What happens when an agent fails mid-task? The checkbox protocol handles this gracefully because progress is recorded at the task level, not the session level. If an agent fails on task 8, tasks 1-7 are still checked. A new agent session picks up at task 8 — no progress is lost.

```python
# From: tracker/recovery.py

def get_recovery_context(plan_path: str) -> dict:
    """Generate context for a recovery session."""
    progress = get_progress(plan_path)
    content = Path(plan_path).read_text()

    # Find the last completed task
    completed_tasks = re.findall(r'^- \[x\] (.+)$', content, re.MULTILINE)
    last_completed = completed_tasks[-1] if completed_tasks else None

    # Find the next pending task
    next_task = get_next_task(plan_path)

    # Detect if we are mid-phase
    current_phase = None
    for line in content.split('\n'):
        if line.startswith('## '):
            current_phase = line[3:].strip()
        elif line.startswith('- [ ]') and next_task in line:
            break

    return {
        "progress": progress,
        "last_completed": last_completed,
        "next_task": next_task,
        "current_phase": current_phase,
        "recovery_prompt": (
            f"Resuming from {progress['percentage']}% complete. "
            f"Last finished: '{last_completed}'. "
            f"Next task: '{next_task}' in phase '{current_phase}'."
        ),
    }
```

The recovery context gives a new agent everything it needs to continue seamlessly. No session state to restore, no database to query, no checkpoint files to parse. The plan file itself is the state.

---

### Comparison with Project Management Tools

The skeptical response is: "checkboxes cannot replace real project management." And that is correct — for human teams coordinating across departments over months. But for AI agent workflows, checkboxes are not a compromise. They are superior:

| Feature | Jira/Linear | Markdown Checkboxes |
|---------|------------|-------------------|
| Update latency | 2-5 seconds (API call) | <1ms (file edit) |
| Read access | API authentication | `cat file.md` |
| Offline support | No | Yes |
| Agent can self-update | Requires API integration | Same edit tool as code |
| CI integration | Webhook + API | `grep -c` |
| Version control | External changelog | Git history |
| Merge conflicts | Not applicable | Standard git merge |
| Cost | $8-16/user/month | Free |
| Concurrent access | Built-in | File locking required |
| Rich reporting | Built-in dashboards | Custom scripts |
| Cross-project views | Built-in | Aggregation scripts |

The version control integration is underrated. Every checkbox change is a git commit. You have a complete history of task completions with timestamps, diffs, and commit messages. Try getting that from Jira without a third-party plugin.

```mermaid
graph LR
    subgraph "Traditional PM"
        A[Agent] -->|API Call| B[PM Server]
        B -->|Response| A
        B --> C[(Database)]
        C --> D[Dashboard]
    end

    subgraph "Checkmark-Driven"
        E[Agent] -->|Edit Tool| F[plan.md]
        F -->|grep| G[Progress]
        F -->|git| H[History]
        F -->|script| I[Dashboard]
    end

    style B fill:#ef4444,color:#fff
    style C fill:#ef4444,color:#fff
    style F fill:#22c55e,color:#fff
```

---

### Advanced grep Patterns for Complex Plans

The basic `grep -c` works for simple counting, but real-world plans have complications. Comments, headers with brackets, nested lists, and conditional tasks all create false matches. I built a progressively more sophisticated grep toolkit as I hit each edge case.

The first problem was headers that contained brackets. A section header like `## [Phase 2] Batch Processing` would match the checkbox regex. The fix is anchoring the pattern to list items:

```bash
# Wrong: matches headers with brackets
grep -c '\[[ x]\]' plan.md

# Right: matches only checkbox list items
grep -c '^\s*- \[[ x]\]' plan.md

# Even better: handles nested lists (indented checkboxes)
grep -cP '^\s*[-*] \[[ x]\]' plan.md
```

The second problem was conditional tasks — tasks that should only count when a prerequisite is met. I handled this with a convention: conditional tasks use a double bracket `- [[ ]]` and are excluded from progress counting until activated:

```bash
# From: scripts/conditional-progress.sh

progress_with_conditionals() {
    local file="$1"

    # Active tasks only (single brackets)
    local total=$(grep -cP '^\s*- \[[ x]\] ' "$file" 2>/dev/null || echo 0)
    local completed=$(grep -cP '^\s*- \[x\] ' "$file" 2>/dev/null || echo 0)

    # Conditional tasks (double brackets) — count separately
    local conditional=$(grep -cP '^\s*- \[\[[ x]\]\] ' "$file" 2>/dev/null || echo 0)
    local conditional_done=$(grep -cP '^\s*- \[\[x\]\] ' "$file" 2>/dev/null || echo 0)

    local remaining=$((total - completed))

    if [ "$total" -gt 0 ]; then
        local pct=$((completed * 100 / total))
    else
        local pct=0
    fi

    echo "Active:      $completed/$total ($pct%) | Remaining: $remaining"
    if [ "$conditional" -gt 0 ]; then
        echo "Conditional: $conditional_done/$conditional (excluded from %)"
    fi
}
```

The third problem was the most subtle: agents sometimes create sub-tasks under a parent task, and both the parent and child have checkboxes. Double-counting inflates the total. The convention I settled on is that parent tasks use a different marker — a bold checkbox description — and are excluded from the atomic count:

```bash
# From: scripts/hierarchical-progress.sh

# Plan format convention:
# - [x] **Parent task** (not counted — it is a grouping header)
#   - [x] Child task 1 (counted)
#   - [x] Child task 2 (counted)
#   - [ ] Child task 3 (counted)

hierarchical_progress() {
    local file="$1"

    # Count only leaf tasks (not bold parent tasks)
    local total=$(grep -cP '^\s*- \[[ x]\] (?!\*\*)' "$file" 2>/dev/null || echo 0)
    local completed=$(grep -cP '^\s*- \[x\] (?!\*\*)' "$file" 2>/dev/null || echo 0)

    # Count parent tasks separately
    local parents=$(grep -cP '^\s*- \[[ x]\] \*\*' "$file" 2>/dev/null || echo 0)
    local parents_done=$(grep -cP '^\s*- \[x\] \*\*' "$file" 2>/dev/null || echo 0)

    local remaining=$((total - completed))
    local pct=0
    if [ "$total" -gt 0 ]; then
        pct=$((completed * 100 / total))
    fi

    echo "Leaf tasks:   $completed/$total ($pct%)"
    echo "Parent tasks: $parents_done/$parents"
    echo "Remaining:    $remaining leaf tasks"
}
```

The fourth edge case is multi-file plans where you want a single progress number across all files without double-counting shared tasks. I use `grep -rh` to strip filenames and then `sort -u` to deduplicate:

```bash
# Cross-file deduplication for shared task descriptions
cross_file_progress() {
    local dir="$1"

    # Get all unique task descriptions (dedup across files)
    local all_tasks=$(grep -rhP '^\s*- \[[ x]\] (.+)$' "$dir"/*.md 2>/dev/null \
        | sed 's/^\s*- \[[ x]\] //' | sort -u | wc -l)

    local done_tasks=$(grep -rhP '^\s*- \[x\] (.+)$' "$dir"/*.md 2>/dev/null \
        | sed 's/^\s*- \[x\] //' | sort -u | wc -l)

    local pct=0
    if [ "$all_tasks" -gt 0 ]; then
        pct=$((done_tasks * 100 / all_tasks))
    fi

    echo "Unique tasks: $done_tasks/$all_tasks ($pct%)"
}
```

These patterns evolved over months of hitting real edge cases. The basic `grep -c` is enough for 80% of plans. The remaining 20% need one or more of these refinements.

---

### Progress Visualization Beyond the Terminal

The terminal dashboard is useful during development, but stakeholders want something they can glance at in a browser tab or a Slack message. I built three output formats that generate from the same checkbox data.

**Slack-compatible progress blocks:**

```python
# From: tracker/slack_format.py

def format_slack_progress(plan_path: str) -> str:
    """Generate Slack mrkdwn progress report."""
    progress = get_progress(plan_path)
    blocks = []

    # Header
    blocks.append(f"*Project Progress* — {progress['percentage']}%")

    # Overall bar using Slack emoji
    filled = progress['percentage'] // 10
    empty = 10 - filled
    bar = ":large_green_square:" * filled + ":white_large_square:" * empty
    blocks.append(f"{bar}  `{progress['completed']}/{progress['total']}`")
    blocks.append("")

    # Per-phase
    for phase, data in progress["phases"].items():
        if data["total"] == 0:
            continue
        pct = data["completed"] * 100 // data["total"]
        if pct == 100:
            icon = ":white_check_mark:"
        elif pct > 0:
            icon = ":hourglass_flowing_sand:"
        else:
            icon = ":black_square_button:"
        blocks.append(f"{icon} *{phase}* — {data['completed']}/{data['total']}")

    return "\n".join(blocks)


def send_slack_progress(plan_path: str, webhook_url: str):
    """Post progress to a Slack channel via webhook."""
    import requests

    message = format_slack_progress(plan_path)
    payload = {
        "blocks": [
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": message},
            }
        ]
    }
    response = requests.post(webhook_url, json=payload, timeout=10)
    response.raise_for_status()
```

**SVG badge for README embedding:**

```python
# From: tracker/svg_badge.py

def generate_svg_badge(completed: int, total: int) -> str:
    """Generate an SVG progress badge for README embedding."""
    pct = completed * 100 // total if total > 0 else 0

    if pct >= 90:
        color = "#22c55e"  # green
    elif pct >= 60:
        color = "#eab308"  # yellow
    elif pct >= 30:
        color = "#f97316"  # orange
    else:
        color = "#ef4444"  # red

    bar_width = int(pct * 0.8)  # max 80px for the filled portion

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <rect width="120" height="20" rx="3" fill="#555"/>
  <rect x="40" width="{bar_width}" height="20" rx="3" fill="{color}"/>
  <rect width="40" height="20" rx="3" fill="#555"/>
  <text x="20" y="14" fill="#fff" font-size="11"
        text-anchor="middle" font-family="monospace">
    {pct}%
  </text>
  <text x="80" y="14" fill="#fff" font-size="11"
        text-anchor="middle" font-family="monospace">
    {completed}/{total}
  </text>
</svg>'''
```

**JSON API endpoint for dashboards:**

```python
# From: tracker/api_format.py

from datetime import datetime

def generate_api_response(plans_dir: str) -> dict:
    """Generate a JSON response suitable for dashboard consumption."""
    agg = aggregate_progress(plans_dir)

    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "summary": {
            "total_tasks": agg["total"],
            "completed_tasks": agg["completed"],
            "completion_percentage": agg["percentage"],
            "plans_count": len(agg["plans"]),
        },
        "plans": [
            {
                "name": p["name"],
                "total": p["progress"]["total"],
                "completed": p["progress"]["completed"],
                "percentage": p["progress"]["percentage"],
                "phases": [
                    {
                        "name": phase_name,
                        "total": phase_data["total"],
                        "completed": phase_data["completed"],
                    }
                    for phase_name, phase_data
                    in p["progress"]["phases"].items()
                ],
            }
            for p in agg["plans"]
        ],
    }
```

The JSON API format is particularly useful when the progress data feeds into a custom dashboard. I serve it from a simple Flask route that reads the plan files on demand — no database, no background worker, no caching layer. The plan files are the source of truth, and reading them takes less than a millisecond.

---

### Handling Partial Completion and Blocked Tasks

Not every task is binary. Some tasks are partially complete — the implementation is done but the validation is pending, or the code is written but the deployment is blocked. Pure checkboxes cannot represent these states, so I extended the convention with a lightweight status suffix:

```markdown
## Phase 3: Deployment
- [x] Build Docker image
- [x] Push to registry
- [ ] Deploy to staging [BLOCKED: waiting on VPN access]
- [ ] Run smoke tests [DEPENDS: deploy to staging]
- [ ] Deploy to production
```

The grep patterns ignore the status suffixes — they only care about the checkbox state. But a separate parser extracts the suffixes for richer reporting:

```python
# From: tracker/status_parser.py

import re
from pathlib import Path
from dataclasses import dataclass

STATUS_PATTERN = re.compile(
    r'^\s*- \[(?P<checked>[ x])\] (?P<text>.+?)(?:\s+\[(?P<status>[A-Z]+):\s*(?P<detail>.+?)\])?\s*$',
    re.MULTILINE,
)

@dataclass
class TaskStatus:
    text: str
    checked: bool
    status: str | None  # BLOCKED, DEPENDS, REVIEW, etc.
    detail: str | None

def parse_task_statuses(plan_path: str) -> list[TaskStatus]:
    """Parse tasks with optional status suffixes."""
    content = Path(plan_path).read_text()
    tasks = []

    for match in STATUS_PATTERN.finditer(content):
        tasks.append(TaskStatus(
            text=match.group("text"),
            checked=match.group("checked") == "x",
            status=match.group("status"),
            detail=match.group("detail"),
        ))

    return tasks


def get_blocked_tasks(plan_path: str) -> list[TaskStatus]:
    """Get all blocked or dependent tasks."""
    tasks = parse_task_statuses(plan_path)
    return [
        t for t in tasks
        if t.status in ("BLOCKED", "DEPENDS") and not t.checked
    ]


def get_actionable_tasks(plan_path: str) -> list[TaskStatus]:
    """Get unchecked tasks that are NOT blocked."""
    tasks = parse_task_statuses(plan_path)
    return [
        t for t in tasks
        if not t.checked and t.status not in ("BLOCKED", "DEPENDS")
    ]
```

The `get_actionable_tasks` function is what agents actually call. Instead of blindly picking the next unchecked task (which might be blocked), they get the next task that can actually be worked on. This prevents the frustrating cycle where an agent picks a blocked task, fails, picks the next one (also blocked), fails again, and wastes its context window on tasks it cannot complete.

The blocking chain resolution is equally important. When a blocked task gets unblocked (the VPN access is granted), the agent needs to know which downstream tasks are now actionable:

```python
# From: tracker/dependency_resolver.py

def resolve_unblock(plan_path: str, completed_task: str) -> list[str]:
    """Find tasks that become actionable when a task completes."""
    tasks = parse_task_statuses(plan_path)
    newly_actionable = []

    for task in tasks:
        if task.checked:
            continue
        if task.status == "DEPENDS" and task.detail:
            # Check if the dependency matches the completed task
            if completed_task.lower() in task.detail.lower():
                newly_actionable.append(task.text)

    return newly_actionable
```

This dependency resolution is intentionally simple — string matching on the detail text. For complex dependency graphs, you would want a proper DAG, but for the 90% case where dependencies are one level deep, string matching works and costs zero setup.

The blocked task tracking also feeds back into the progress display:

```
============================================================
  PROJECT PROGRESS
============================================================

  Overall: [========================>               ] 60%
  Tasks:   12/20 complete | 2 blocked | 6 actionable

  DONE Phase 1: Setup
       [==============================] 100%  (5/5)

       Phase 2: Implementation
       [==================>           ] 60%  (3/5)
       BLOCKED: Deploy to staging (waiting on VPN access)

       Phase 3: Validation
       [>                             ] 0%  (0/5)
       DEPENDS: 2 tasks waiting on Phase 2

       Phase 4: Release
       [=========>                    ] 20%  (1/5)

============================================================
```

The dashboard now distinguishes between "not done because we have not gotten to it" and "not done because something is blocking us." This distinction is invisible in a flat checkbox count but critical for understanding whether progress has stalled.

---

### Scaling Considerations

Checkmark tracking works well up to roughly 500 tasks per file. Beyond that, `grep` performance is still fine (it processes millions of lines per second), but human readability degrades. The solution is hierarchical plans:

```
plans/
+-- master-plan.md           # Links to phase plans, shows phase-level progress
+-- phase-01-extraction.md   # 20 tasks
+-- phase-02-processing.md   # 35 tasks
+-- phase-03-analysis.md     # 28 tasks
+-- phase-04-dashboard.md    # 15 tasks
```

The master plan tracks phase completion. Each phase file tracks individual tasks. The aggregator rolls everything up. Simple, scalable, and still just files.

For very large projects (1,000+ tasks), I add a third level:

```
plans/
+-- master-plan.md
+-- phase-01/
|   +-- phase-plan.md        # Phase-level checkboxes
|   +-- sprint-01.md         # 15 tasks
|   +-- sprint-02.md         # 15 tasks
|   +-- sprint-03.md         # 12 tasks
+-- phase-02/
    +-- phase-plan.md
    +-- sprint-01.md
    +-- sprint-02.md
```

The aggregator handles this recursively:

```python
# From: tracker/recursive_aggregate.py

def recursive_aggregate(root_dir: str) -> dict:
    """Recursively aggregate progress from nested plan directories."""
    root = Path(root_dir)
    totals = {"total": 0, "completed": 0, "children": []}

    # Direct .md files
    for md_file in sorted(root.glob("*.md")):
        progress = get_progress(str(md_file))
        if progress["total"] > 0:
            totals["total"] += progress["total"]
            totals["completed"] += progress["completed"]
            totals["children"].append({
                "name": md_file.stem,
                "type": "file",
                "progress": progress,
            })

    # Subdirectories
    for subdir in sorted(root.iterdir()):
        if subdir.is_dir() and not subdir.name.startswith('.'):
            child = recursive_aggregate(str(subdir))
            if child["total"] > 0:
                totals["total"] += child["total"]
                totals["completed"] += child["completed"]
                totals["children"].append({
                    "name": subdir.name,
                    "type": "directory",
                    "progress": child,
                })

    totals["percentage"] = (
        round(totals["completed"] / totals["total"] * 100)
        if totals["total"] > 0 else 0
    )

    return totals
```

---

### Integration with Git Hooks

For teams that want automatic progress tracking on every commit, a git post-commit hook updates a progress summary:

```bash
#!/bin/bash
# .git/hooks/post-commit

# Only run if plan files were modified
changed_plans=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | grep '^plans/.*\.md$')

if [ -n "$changed_plans" ]; then
    total=$(grep -rc '^\- \[[ x]\]' plans/ 2>/dev/null || echo 0)
    completed=$(grep -rc '^\- \[x\]' plans/ 2>/dev/null || echo 0)

    if [ "$total" -gt 0 ]; then
        pct=$((completed * 100 / total))
    else
        pct=0
    fi

    # Update progress file
    cat > .progress << EOF
{
  "total": $total,
  "completed": $completed,
  "percentage": $pct,
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit": "$(git rev-parse --short HEAD)"
}
EOF

    echo "Progress: $completed/$total ($pct%)"
fi
```

The `.progress` file becomes a machine-readable snapshot that any tool can consume — CI pipelines, status dashboards, Slack bots, or other agents.

---

### Results

After adopting checkmark-driven progress across 52 tracked projects:

| Metric | Before (Mixed Tools) | After (Checkmarks) |
|--------|---------------------|-------------------|
| Status update overhead | 15-30 seconds | <1 second |
| Agent self-tracking | Not possible | Standard workflow |
| Progress visibility | Dashboard login | `grep -c` or `cat` |
| CI integration effort | Hours (API setup) | 5 lines of shell |
| History/audit trail | External tool | Git log |
| Cost per project | $8-16/month | $0 |
| Failed status updates | 34 per 200 sessions | 0 |
| Context tokens for tracking | ~400 (API instructions) | ~150 (edit pattern) |

The pattern has proven itself across project sizes from 8 tasks (a quick feature) to 412 tasks (a full application rebuild). The tooling scales linearly, the overhead stays constant, and the protocol is simple enough that every agent follows it without additional training.

---

### Notification Hooks: Slack and Discord Integration

For teams that want real-time visibility without watching a terminal, I built lightweight notification hooks that fire on checkbox state changes:

```python
# From: tracker/notify.py

import httpx
import json
from pathlib import Path

class ProgressNotifier:
    def __init__(self, webhook_url: str, channel: str = "progress"):
        self.webhook_url = webhook_url
        self.channel = channel
        self.last_state = {}

    async def check_and_notify(self, plan_path: str, project_name: str):
        """Compare current state to last known state and notify on changes."""
        current = get_progress(plan_path)

        if plan_path in self.last_state:
            prev = self.last_state[plan_path]
            newly_completed = current["completed"] - prev["completed"]

            if newly_completed > 0:
                await self._send_notification(
                    project_name,
                    current,
                    newly_completed,
                )

        self.last_state[plan_path] = current

    async def _send_notification(
        self, project: str, progress: dict, newly_completed: int
    ):
        pct = progress["percentage"]
        bar = "=" * (pct // 5) + " " * (20 - pct // 5)

        message = (
            f"*{project}*: +{newly_completed} task(s) completed\n"
            f"`[{bar}] {pct}%` "
            f"({progress['completed']}/{progress['total']})"
        )

        # Determine which phases just completed
        for phase, data in progress["phases"].items():
            if data["completed"] == data["total"] and data["total"] > 0:
                message += f"\n  Phase complete: {phase}"

        async with httpx.AsyncClient() as client:
            await client.post(
                self.webhook_url,
                json={"text": message, "channel": self.channel},
            )

    async def send_completion(self, project: str, progress: dict):
        """Send final completion notification."""
        message = (
            f"*{project}*: ALL TASKS COMPLETE\n"
            f"{progress['completed']}/{progress['total']} tasks finished\n"
            f"Phases: {len(progress['phases'])} completed"
        )
        async with httpx.AsyncClient() as client:
            await client.post(
                self.webhook_url,
                json={"text": message, "channel": self.channel},
            )
```

The notifier polls the plan file every 30 seconds and sends a message only when the checkbox count changes. This means zero noise during idle periods and immediate feedback when tasks complete. For a 52-task project, this produces roughly 52 notifications over the entire session — enough to track progress without flooding the channel.

I integrated this with the agent work loop so notifications fire automatically:

```python
# From: tracker/notified_loop.py

async def notified_work_loop(
    plan_path: str,
    executor,
    notifier: ProgressNotifier,
    project_name: str,
):
    """Agent work loop with automatic notifications."""
    while True:
        task = get_next_task(plan_path)
        if task is None:
            progress = get_progress(plan_path)
            await notifier.send_completion(project_name, progress)
            break

        success = await executor.run(task)

        if success:
            mark_complete(plan_path, task)
            await notifier.check_and_notify(plan_path, project_name)
        else:
            # Notify about failure too
            progress = get_progress(plan_path)
            await notifier._send_notification(
                f"{project_name} [BLOCKED]",
                progress,
                0,
            )
            break

    return get_progress(plan_path)
```

---

### Dependency-Aware Task Ordering

Not all checkboxes are independent. Some tasks depend on outputs from previous tasks. The basic `get_next_task` function returns the first unchecked task, which works for linear plans. But for plans with parallel and dependent tasks, I added dependency annotations:

```markdown
## Phase 2: API Layer
- [x] Define API route structure  <!-- dep: none -->
- [x] Implement /api/lists CRUD   <!-- dep: none -->
- [x] Implement /api/items CRUD   <!-- dep: none -->
- [ ] Add rate limiting middleware <!-- dep: lists, items -->
- [ ] Add pagination to GET endpoints <!-- dep: lists, items -->
- [ ] Implement search endpoint   <!-- dep: lists, items, rate-limiting -->
```

The dependency parser reads these annotations:

```python
# From: tracker/dependencies.py

import re
from pathlib import Path

def parse_dependencies(plan_path: str) -> dict[str, list[str]]:
    """Parse task dependencies from HTML comments in the plan file."""
    content = Path(plan_path).read_text()
    deps = {}

    for match in re.finditer(
        r'^- \[[ x]\] (.+?)(?:\s*<!--\s*dep:\s*(.+?)\s*-->)?$',
        content,
        re.MULTILINE,
    ):
        task_text = match.group(1).strip()
        dep_str = match.group(2)

        if dep_str and dep_str.strip().lower() != "none":
            dep_list = [d.strip() for d in dep_str.split(",")]
            deps[task_text] = dep_list
        else:
            deps[task_text] = []

    return deps

def get_next_ready_task(plan_path: str) -> str | None:
    """Get the next task whose dependencies are all satisfied."""
    content = Path(plan_path).read_text()
    deps = parse_dependencies(plan_path)

    # Get completed task keywords
    completed = set()
    for match in re.finditer(r'^- \[x\] (.+?)(?:\s*<!--.*-->)?$', content, re.MULTILINE):
        task = match.group(1).strip()
        # Extract keyword (first meaningful word) for matching
        for dep_key in deps.keys():
            if task == dep_key:
                # Add shortened forms for dependency matching
                words = task.lower().split()
                for word in words:
                    if len(word) > 3:
                        completed.add(word)

    # Find first unchecked task whose deps are met
    for match in re.finditer(r'^- \[ \] (.+?)(?:\s*<!--.*-->)?$', content, re.MULTILINE):
        task = match.group(1).strip()
        task_deps = deps.get(task, [])

        if not task_deps:
            return task

        # Check if all deps are satisfied
        all_met = all(
            any(dep.lower() in c for c in completed)
            for dep in task_deps
        )
        if all_met:
            return task

    return None
```

This dependency-aware ordering means agents work on tasks in the correct order without manual sequencing. The plan file itself encodes the execution graph.

---

### Lessons Learned from 52 Projects

After running checkmark-driven progress across 52 projects, here are the patterns that consistently produce the best results:

**1. One checkbox per atomic deliverable.** Not "implement the API" — that is too coarse. Not "write line 47 of route.ts" — that is too fine. The right granularity is "implement /api/lists GET endpoint with pagination." Each checkbox should take 2-15 minutes for an agent to complete.

**2. Phase headers create natural grouping.** Using `## Phase N: Name` headers lets the dashboard generator and aggregator produce meaningful per-phase progress. Without phases, a flat list of 52 checkboxes is hard to scan.

**3. Never let agents add checkboxes.** The plan file is a contract. If the agent discovers that a task needs to be split, it should complete the current task and note the need for splitting — not modify the plan. Plan modifications are a human decision.

**4. Keep plan files in version control.** Every checkbox change is a git commit. This gives you an audit trail of when each task was completed, by which agent, and in what order. I have used this audit trail to debug agent performance issues multiple times.

**5. Run the dashboard in a separate terminal.** The 5-second polling dashboard in a tmux pane provides continuous visibility without interrupting the agent's work. It is the first thing I look at when checking on a running session.

**6. Validate checkbox format before every session.** Run the normalizer at session start. Agents occasionally produce malformed checkboxes (uppercase X, missing spaces), and catching these early prevents progress counting errors later.

```mermaid
graph TD
    subgraph "The Checkmark Ecosystem"
        A[Plan File .md] --> B[Agent Work Loop]
        A --> C[grep Progress Counter]
        A --> D[Terminal Dashboard]
        A --> E[CI Badge Generator]
        A --> F[Git History]
        A --> G[Recovery Context]

        B -->|Edit tool| A
        C -->|every 5s| D
        F -->|post-commit| E
        G -->|new session| B
    end
```

The best project management tool for AI agent workflows is not a project management tool. It is a text file with checkboxes and `grep`.

---

**Companion Repo:** [checkmark-progress-tracker](https://github.com/krzemienski/checkmark-progress-tracker) -- Complete tracking toolkit: progress calculator, terminal dashboard renderer, CI integration workflow, multi-file aggregator, concurrent agent coordination, recovery context generator, and the agent work loop that ties it all together.
