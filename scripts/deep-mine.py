#!/usr/bin/env python3
"""Deep-mine all Claude Code sessions for blog post topics.
Scans ALL JSONL files, extracts tool patterns, errors, and key themes.
Outputs structured summary for topic derivation."""

import json
import os
import sys
from pathlib import Path
from collections import Counter, defaultdict

PROJECTS_ROOT = Path.home() / ".claude" / "projects"

def get_project_name(dirpath):
    """Extract clean project name from directory path."""
    name = dirpath.name
    for prefix in ["-Users-nick-Desktop-", "-Users-nick-Documents-", "-Users-nick-"]:
        if name.startswith(prefix):
            name = name[len(prefix):]
            break
    if "--auto-claude-worktrees-tasks-" in name:
        base = name.split("--auto-claude-worktrees-tasks-")[0]
        task = name.split("--auto-claude-worktrees-tasks-")[1]
        return base, task
    if "--" in name:
        parts = name.split("--")
        return parts[0], "--".join(parts[1:])
    return name, ""

def mine_file(filepath):
    """Extract patterns from a single JSONL file. Reads ALL lines."""
    result = {
        "tools": Counter(),
        "errors": [],
        "bash_cmds": [],
        "mcp_tools": Counter(),
        "topics": [],
        "file_ops": Counter(),
        "agent_spawns": 0,
        "lines": 0,
    }
    try:
        with open(filepath, 'r', errors='replace') as f:
            lines = f.readlines()
        result["lines"] = len(lines)
        if not lines:
            return result

        for i in range(len(lines)):
            try:
                obj = json.loads(lines[i].strip())
                msg = obj.get("message", {})
                content = msg.get("content", [])

                if isinstance(content, list):
                    for c in content:
                        if not isinstance(c, dict):
                            continue
                        if c.get("type") == "tool_use":
                            name = c.get("name", "unknown")
                            result["tools"][name] += 1
                            inp = c.get("input", {})
                            if name == "Bash":
                                cmd = inp.get("command", "")[:300]
                                if cmd:
                                    result["bash_cmds"].append(cmd)
                            elif name == "Agent":
                                result["agent_spawns"] += 1
                                prompt = inp.get("prompt", "")[:200]
                                if prompt:
                                    result["topics"].append("[AGENT] " + prompt)
                            elif name in ("Read", "Write", "Edit"):
                                fp = inp.get("file_path", "")
                                if fp:
                                    result["file_ops"][name + ":" + fp.split("/")[-1]] += 1
                            elif name.startswith("mcp__"):
                                result["mcp_tools"][name] += 1
                        elif c.get("type") == "text":
                            text = c.get("text", "")
                            lower = text.lower()
                            if any(w in lower for w in ["error:", "failed:", "exception", "traceback", "fatal"]):
                                result["errors"].append(text[:300])
                            if any(w in lower for w in [
                                "workaround", "solution", "breakthrough", "realized",
                                "pattern", "architecture", "migration", "refactor",
                                "performance", "optimization", "pipeline", "workflow",
                                "cache", "database", "api", "auth", "deploy",
                                "docker", "kubernetes", "redis", "postgres",
                                "websocket", "streaming", "queue", "cron",
                                "schema", "index", "query"
                            ]):
                                result["topics"].append(text[:400])
                elif isinstance(content, str):
                    if "error" in content.lower():
                        result["errors"].append(content[:200])
            except (json.JSONDecodeError, KeyError):
                continue
    except Exception as e:
        result["errors"].append("FILE_READ_ERROR: " + str(e))
    return result

def main():
    all_files = []
    # Recursive traversal — finds ALL JSONL files at any nesting depth
    # Includes subagent sessions for complete metrics
    for jsonl in PROJECTS_ROOT.rglob("*.jsonl"):
        try:
            size = jsonl.stat().st_size
        except OSError:
            continue
        if size > 1000:
            all_files.append((jsonl, size))

    all_files.sort(key=lambda x: -x[1])
    print(f"Found {len(all_files)} JSONL files", file=sys.stderr)

    project_data = defaultdict(lambda: {
        "files": 0, "total_lines": 0, "total_size": 0,
        "tools": Counter(), "errors": [], "bash_cmds": [],
        "mcp_tools": Counter(), "topics": [], "agent_spawns": 0,
        "tasks": [], "file_ops": Counter()
    })

    processed = 0
    for filepath, size in all_files:
        # Extract top-level project dir from path relative to PROJECTS_ROOT
        rel = filepath.relative_to(PROJECTS_ROOT)
        top_level_dir = PROJECTS_ROOT / rel.parts[0]
        project_name, task_name = get_project_name(top_level_dir)
        proj = project_data[project_name]
        proj["files"] += 1
        proj["total_size"] += size
        if task_name:
            proj["tasks"].append(task_name)
        result = mine_file(str(filepath))
        proj["total_lines"] += result["lines"]
        proj["tools"] += result["tools"]
        proj["errors"].extend(result["errors"][:10])
        proj["bash_cmds"].extend(result["bash_cmds"][:20])
        proj["mcp_tools"] += result["mcp_tools"]
        proj["topics"].extend(result["topics"][:15])
        proj["agent_spawns"] += result["agent_spawns"]
        proj["file_ops"] += result["file_ops"]
        processed += 1
        if processed % 200 == 0:
            print(f"Processed {processed}/{len(all_files)} files...", file=sys.stderr)

    total_lines = sum(p['total_lines'] for p in project_data.values())
    total_size = sum(p['total_size'] for p in project_data.values())

    # JSON output for post writers
    json_output = {
        "meta": {
            "total_files": len(all_files),
            "total_projects": len(project_data),
            "total_lines": total_lines,
            "total_size_bytes": total_size,
        },
        "global_tools": {},
        "global_mcp_tools": {},
        "global_agent_spawns": 0,
        "projects": {},
    }
    global_tools = Counter()
    global_mcp = Counter()
    global_agents = 0
    for pname, pdata in project_data.items():
        global_tools += pdata["tools"]
        global_mcp += pdata["mcp_tools"]
        global_agents += pdata["agent_spawns"]
        json_output["projects"][pname] = {
            "files": pdata["files"],
            "lines": pdata["total_lines"],
            "size_bytes": pdata["total_size"],
            "agent_spawns": pdata["agent_spawns"],
            "tools": dict(pdata["tools"].most_common(20)),
            "mcp_tools": dict(pdata["mcp_tools"].most_common(10)),
            "tasks": list(set(pdata["tasks"]))[:20],
        }
    json_output["global_tools"] = dict(global_tools.most_common(50))
    json_output["global_mcp_tools"] = dict(global_mcp.most_common(30))
    json_output["global_agent_spawns"] = global_agents

    # Write JSON if output dir exists
    output_dir = Path(__file__).parent / "output"
    output_dir.mkdir(exist_ok=True)
    with open(output_dir / "full-mine-data.json", "w") as jf:
        json.dump(json_output, jf, indent=2)
    print(f"JSON data written to {output_dir / 'full-mine-data.json'}", file=sys.stderr)

    print(f"\n# Deep Mining Summary")
    print(f"\n**Total Files:** {len(all_files)}")
    print(f"**Projects:** {len(project_data)}")
    print(f"**Total Lines:** {total_lines:,}")
    print(f"**Total Size:** {total_size / (1024*1024*1024):.1f}GB")

    ranked = sorted(
        project_data.items(),
        key=lambda x: x[1]["total_size"] * len(x[1]["tools"]),
        reverse=True
    )

    for project_name, data in ranked[:60]:
        size_mb = data["total_size"] / (1024*1024)
        print(f"\n## {project_name}")
        print(f"Files: {data['files']} | Lines: {data['total_lines']:,} | Size: {size_mb:.1f}MB | Agents: {data['agent_spawns']}")
        if data["tasks"]:
            unique_tasks = list(set(data["tasks"]))[:10]
            print(f"Tasks: {', '.join(unique_tasks)}")
        top_tools = data["tools"].most_common(10)
        if top_tools:
            print(f"Tools: {', '.join(f'{t}({n})' for t,n in top_tools)}")
        if data["mcp_tools"]:
            top_mcp = data["mcp_tools"].most_common(5)
            mcp_strs = []
            for t, n in top_mcp:
                parts = t.split("__")
                short = parts[-1] if len(parts) > 1 else t
                mcp_strs.append(f"{short}({n})")
            print(f"MCP: {', '.join(mcp_strs)}")
        if data["bash_cmds"]:
            unique_cmds = list(set(cmd[:100] for cmd in data["bash_cmds"]))[:8]
            print("Bash patterns:")
            for cmd in unique_cmds:
                print(f"  - {cmd}")
        if data["errors"]:
            unique_errors = list(set(e[:150] for e in data["errors"]))[:5]
            print(f"Errors ({len(data['errors'])} total):")
            for err in unique_errors:
                print(f"  - {err[:150]}")
        if data["topics"]:
            print(f"Topic signals ({len(data['topics'])} found):")
            seen = set()
            for t in data["topics"][:8]:
                short = t[:200]
                if short not in seen:
                    seen.add(short)
                    print(f"  - {short}")

if __name__ == "__main__":
    main()
