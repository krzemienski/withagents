# State Example — Agent Lifecycle

Applied theme: WithAgents Hyper-black + Ultraviolet.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background":"#040404","mainBkg":"#0A0A0D","secondBkg":"#111116","primaryColor":"#0A0A0D","primaryTextColor":"#F5F5F7","primaryBorderColor":"rgba(255,255,255,0.10)","lineColor":"#8B5CF6","secondaryColor":"#111116","tertiaryColor":"#15151C","textColor":"#F5F5F7","fontFamily":"\"Space Grotesk\", Inter, ui-sans-serif, sans-serif","fontSize":"14px","transitionColor":"#8B5CF6","transitionLabelColor":"#F5F5F7","stateBkg":"#0A0A0D","stateBorder":"rgba(255,255,255,0.10)","labelColor":"#F5F5F7","altBackground":"#111116","edgeLabelBackground":"#111116"}}}%%
stateDiagram-v2
    [*] --> Pending : task submitted

    Pending --> Running : executor picks up
    Pending --> Cancelled : user withdraws

    Running --> WaitingHuman : approval required
    Running --> Completed : all steps resolved ✓
    Running --> Failed : unrecoverable error
    Running --> Blocked : upstream dependency FAIL

    WaitingHuman --> Running : operator approves
    WaitingHuman --> Cancelled : operator rejects

    Blocked --> Pending : upstream resolved
    Blocked --> Cancelled : upstream abandoned

    Failed --> Pending : retry queued
    Failed --> [*] : abandoned

    Completed --> [*]
    Cancelled --> [*]
```

**Alt text:** A state diagram showing the complete lifecycle of an agent task. From the initial state a task enters Pending. It can move to Running when picked up, or be Cancelled by the user. From Running it transitions to WaitingHuman when operator approval is needed, Completed when all steps resolve, Failed on unrecoverable error, or Blocked when an upstream dependency fails. The WaitingHuman state returns to Running on approval or goes to Cancelled on rejection. Blocked returns to Pending when the upstream is resolved. Failed can retry to Pending or be abandoned. Completed and Cancelled reach the terminal state.

**Content reference:** Operator UI and Ralph Loops product pillars. Reflects the hat-based execution model described in Post 08 (ralph-loop-patterns companion repo) and the agent lifecycle patterns from 23,479 sessions.
