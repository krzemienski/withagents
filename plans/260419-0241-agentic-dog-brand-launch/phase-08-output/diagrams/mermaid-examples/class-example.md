# Class Example — Memory Layer Data Model

Applied theme: WithAgents Hyper-black + Ultraviolet.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","classText":"#F5F5F7","edgeLabelBackground":"#111116"}}}%%
classDiagram
    class Session {
        +String id
        +String projectId
        +DateTime startedAt
        +DateTime endedAt
        +String mode
        +Int toolCallCount
        +fromJsonl(path) Session
        +toSummary() String
    }

    class Context {
        +String sessionId
+String layerType
        +Int tokenBudget
        +Int tokenUsed
        +Float compressionRatio
        +compose(layers) Context
        +trim(budget) Context
    }

    class Observation {
        +String id
        +String sessionId
        +String category
        +String content
        +Float confidence
        +DateTime capturedAt
        +tag(label) Observation
        +persist(store) void
    }

    class Trace {
        +String spanId
        +String sessionId
        +String toolName
        +DateTime startTs
        +DateTime endTs
        +String status
        +Map metadata
        +toTimeline() Span[]
        +annotate(note) Trace
    }

    Session "1" --> "many" Context : composes
    Session "1" --> "many" Observation : generates
    Session "1" --> "many" Trace : records
    Context "1" --> "many" Observation : draws from
```

**Alt text:** A class diagram showing four entities in the Memory Layer data model. Session has fields for id, project, timing, mode, and tool call count. Context holds session reference, layer type, token budget and usage, and compression ratio. Observation stores categorized content with a confidence score tied to a session. Trace records individual tool spans with start and end timestamps and status. Session composes many Contexts, generates many Observations, and records many Traces. Context draws from many Observations.

**Content reference:** Memory Layer product pillar (BRIEF §10) — "practical patterns for preserving context across sessions, tools, and multi-step work." Directly maps to the `claude-mem-architecture` companion repo (Post 12).
