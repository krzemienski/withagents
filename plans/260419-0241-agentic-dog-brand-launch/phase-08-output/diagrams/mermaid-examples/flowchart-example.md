# Flowchart Example — Runbook Triage Flow

Applied theme: WithAgents Hyper-black + Ultraviolet.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","clusterBkg":"#111116","clusterBorder":"rgba(139,92,246,0.25)","edgeLabelBackground":"#111116"}}}%%
flowchart TD
    A([Alert]) --> B{Classify}
    B -->|P1 — critical| C[Enrich: pull trace + context]
    B -->|P2 — degraded| D[Enrich: pull logs only]
    B -->|P3 — noise| E[Suppress + log]
    C --> F{Route}
    D --> F
    F -->|Agent-resolvable| G[Execute: runbook agent]
    F -->|Human-required| H[Page on-call]
    G --> I{Verify}
    H --> I
    I -->|Pass| J([Resolved ✓])
    I -->|Fail| K[Escalate + capture span]
    K --> H

    style A fill:#0A0A0D,stroke:#8B5CF6,color:#F5F5F7
    style J fill:#0A0A0D,stroke:#A3E635,color:#F5F5F7
    style E fill:#111116,stroke:#1e1e27,color:#A1A1AA
    style K fill:#111116,stroke:#E879F9,color:#F5F5F7
    style B fill:#111116,stroke:#1e1e27,color:#F5F5F7
    style F fill:#111116,stroke:#1e1e27,color:#F5F5F7
    style I fill:#111116,stroke:#1e1e27,color:#F5F5F7
    style C fill:#0A0A0D,stroke:#1e1e27,color:#F5F5F7
    style D fill:#0A0A0D,stroke:#1e1e27,color:#F5F5F7
    style G fill:#0A0A0D,stroke:#8B5CF6,color:#F5F5F7
    style H fill:#15151C,stroke:#E879F9,color:#F5F5F7
```

**Alt text:** A flowchart showing a six-stage runbook triage flow. An alert enters the system and is classified as P1 critical, P2 degraded, or P3 noise. P1 and P2 alerts are enriched with trace data or logs respectively, then routed to either an agent executor (for agent-resolvable issues) or paged to an on-call human. Both paths feed a verification step: resolved alerts close with a success marker; failures escalate with a captured span and re-page the on-call responder.

**Content reference:** Runbooks product pillar (BRIEF §10) — "opinionated workflows for triage, analysis, execution across real internal systems."
