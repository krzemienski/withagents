# Sequence Example — Operator UI Stepping Into a Run

Applied theme: WithAgents Hyper-black + Ultraviolet.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","actorBkg":"#0A0A0D","actorBorder":"rgba(139,92,246,0.40)","actorLineColor":"rgba(255,255,255,0.10)","signalColor":"#8B5CF6","signalTextColor":"#F5F5F7","labelBoxBkgColor":"#111116","labelBoxBorderColor":"rgba(255,255,255,0.10)","activationBkgColor":"rgba(139,92,246,0.12)","activationBorderColor":"#8B5CF6","noteBkgColor":"#15151C","noteBorderColor":"rgba(255,255,255,0.10)","noteTextColor":"#A1A1AA","edgeLabelBackground":"#111116"}}}%%
sequenceDiagram
    participant Ag as Agent
    participant Op as Operator UI
    participant Hu as Human
    participant To as Tool

    Ag->>Op: emit span — tool_call(read_file)
    Op->>Hu: surface run state + pending action
    Hu-->>Op: approve
    Op->>Ag: resume signal
    Ag->>To: read_file("ops/runbook-triage.md")
    To-->>Ag: file contents (1,240 tokens)
    Ag->>Op: emit span — reasoning checkpoint
    Op->>Hu: display reasoning excerpt
    Note over Hu,Op: Operator reviews — looks correct
    Hu-->>Op: step-over (no intervention)
    Ag->>To: write_file("ops/incident-log.md")
    To-->>Ag: write confirmed
    Ag->>Op: emit span — run_complete
    Op->>Hu: show diff + resolution summary
```

**Alt text:** A sequence diagram showing five participants: an agent, the Operator UI, a human reviewer, and a tool layer. The agent emits a span signalling a pending file read. The Operator UI surfaces this to the human, who approves. The agent reads the file, emits a reasoning checkpoint displayed in the UI, the human steps over without intervening, the agent writes the incident log, and the run completes with a diff and resolution summary shown to the operator.

**Content reference:** Operator UI product pillar (BRIEF §10) — "clean interfaces for inspecting runs, stepping in when needed, keeping systems legible."
