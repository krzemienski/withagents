# ER Example — trace-timeline Schema

Applied theme: WithAgents Hyper-black + Ultraviolet.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","attributeBackgroundColorEven":"#0A0A0D","attributeBackgroundColorOdd":"#111116","entityBorder":"rgba(255,255,255,0.10)","edgeLabelBackground":"#111116"}}}%%
erDiagram
    sessions {
        text    id           PK
        text    project_id
        text    mode
        integer tool_calls
        integer token_count
        real    duration_s
        text    started_at
        text    ended_at
    }

    events {
        text    id           PK
        text    session_id   FK
        text    event_type
        text    tool_name
        text    payload
        text    ts
        integer sequence_num
    }

    spans {
        text    span_id      PK
        text    session_id   FK
        text    event_id     FK
        text    tool_name
        text    status
        real    duration_ms
        text    started_at
        text    ended_at
    }

    tools {
        text    name         PK
        text    category
        integer total_calls
        real    avg_duration_ms
        real    error_rate
    }

    sessions ||--o{ events  : "contains"
    sessions ||--o{ spans   : "records"
    events   ||--o| spans   : "generates"
    spans    }o--|| tools   : "invokes"
```

**Alt text:** An entity-relationship diagram for the trace-timeline open-source schema. The sessions table stores session metadata including mode, tool call count, token count, and duration. The events table records individual session events with type, tool name, payload, and timestamp, foreign-keyed to sessions. The spans table tracks execution spans with duration and status, foreign-keyed to both sessions and events. The tools table is a reference table for tool metadata including call counts and error rates. Sessions contain many events, sessions record many spans, events generate at most one span, and spans invoke one tool.

**Content reference:** `trace-timeline` open-source project (BRIEF §9, §10) — "chronological execution trace viewer." Schema derived from the session mining pipeline described in Post 09 (session-insight-miner, 3,474,754 lines of session data).
