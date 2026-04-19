# README patch — multi-agent-consensus

Add to top of `README.md` after the project description, before the installation section.

---

## Featured in

**[Three agents found the bug one agent missed](https://withagents.dev/writing/day-02-multi-agent-consensus)** (WithAgents, Day 02)

A single agent reviewed a streaming module and passed it. Three agents found a P2 bug on line 926 that had been hiding for three days:

```swift
message.text += textBlock.text   // should have been =, not +=
```

The write-up covers:

- How Lead, Alpha, and Bravo converge on the same bug through three different reasoning paths
- The Frankenstein merge: why two agents editing separate files can still ship a security vulnerability
- When consensus is worth $0.15 per gate, and when it is not
- Sample gate output from `examples/streaming-audit/`

This repo implements the gate, the three role definitions, and the fix-cycle orchestrator referenced in the post.
