#!/usr/bin/env python3
"""Mine last-360-days Claude Code sessions. Wider window for narrative-arc ranking."""

import json, sys, time
from pathlib import Path
from collections import Counter, defaultdict

sys.path.insert(0, str(Path(__file__).parent))
from importlib import import_module
dm = import_module("deep-mine")

PROJECTS_ROOT = Path.home() / ".claude" / "projects"
CUTOFF = time.time() - (360 * 86400)

def main():
    all_files = []
    for jsonl in PROJECTS_ROOT.rglob("*.jsonl"):
        try:
            st = jsonl.stat()
        except OSError:
            continue
        if st.st_size > 1000 and st.st_mtime > CUTOFF:
            all_files.append((jsonl, st.st_size, st.st_mtime))
    all_files.sort(key=lambda x: -x[1])
    print(f"[360d] Found {len(all_files)} JSONL files modified in last 360 days", file=sys.stderr)

    project_data = defaultdict(lambda: {
        "files": 0, "total_lines": 0, "total_size": 0,
        "tools": Counter(), "errors": [], "bash_cmds": [],
        "mcp_tools": Counter(), "topics": [], "agent_spawns": 0,
        "tasks": [], "file_ops": Counter(), "first_ts": 1e18, "last_ts": 0,
    })
    for idx, (fp, size, mtime) in enumerate(all_files, 1):
        rel = fp.relative_to(PROJECTS_ROOT)
        top_level_dir = PROJECTS_ROOT / rel.parts[0]
        pname, task = dm.get_project_name(top_level_dir)
        p = project_data[pname]
        p["files"] += 1
        p["total_size"] += size
        p["first_ts"] = min(p["first_ts"], mtime)
        p["last_ts"] = max(p["last_ts"], mtime)
        if task:
            p["tasks"].append(task)
        r = dm.mine_file(str(fp))
        p["total_lines"] += r["lines"]
        p["tools"] += r["tools"]
        p["errors"].extend(r["errors"][:10])
        p["bash_cmds"].extend(r["bash_cmds"][:20])
        p["mcp_tools"] += r["mcp_tools"]
        p["topics"].extend(r["topics"][:15])
        p["agent_spawns"] += r["agent_spawns"]
        p["file_ops"] += r["file_ops"]
        if idx % 500 == 0:
            print(f"[360d] {idx}/{len(all_files)}", file=sys.stderr)

    out = {
        "meta": {
            "window_days": 360,
            "cutoff_ts": CUTOFF,
            "total_files": len(all_files),
            "total_projects": len(project_data),
            "total_lines": sum(p["total_lines"] for p in project_data.values()),
            "total_size_bytes": sum(p["total_size"] for p in project_data.values()),
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        },
        "global_tools": {},
        "global_mcp_tools": {},
        "global_agent_spawns": 0,
        "projects": {},
    }
    gt, gm, ga = Counter(), Counter(), 0
    for pname, pd in project_data.items():
        gt += pd["tools"]; gm += pd["mcp_tools"]; ga += pd["agent_spawns"]
        arc_days = (pd["last_ts"] - pd["first_ts"]) / 86400
        out["projects"][pname] = {
            "files": pd["files"],
            "lines": pd["total_lines"],
            "size_bytes": pd["total_size"],
            "agent_spawns": pd["agent_spawns"],
            "first_seen": time.strftime("%Y-%m-%d", time.localtime(pd["first_ts"])),
            "last_seen": time.strftime("%Y-%m-%d", time.localtime(pd["last_ts"])),
            "arc_days": round(arc_days, 1),
            "tools": dict(pd["tools"].most_common(20)),
            "mcp_tools": dict(pd["mcp_tools"].most_common(10)),
            "tasks": list(set(pd["tasks"]))[:20],
            "top_bash": list({c[:120] for c in pd["bash_cmds"]})[:15],
            "top_topics": list({t[:200] for t in pd["topics"]})[:15],
        }
    out["global_tools"] = dict(gt.most_common(50))
    out["global_mcp_tools"] = dict(gm.most_common(30))
    out["global_agent_spawns"] = ga

    outdir = Path(__file__).parent / "output"
    outdir.mkdir(exist_ok=True)
    with open(outdir / "mine-360d-data.json", "w") as f:
        json.dump(out, f, indent=2)
    print(f"[360d] wrote {outdir / 'mine-360d-data.json'}", file=sys.stderr)

if __name__ == "__main__":
    main()
