---
title: "Agent SDK Podcast Generation (30+ Minutes)"
subtitle: "A single client.messages call that spawns a multi-agent content pipeline producing 30-minute podcast episodes from raw research"
author: "Nick Krzemienski"
date: "2025-03-05"
series_number: 45
series_total: 61
github_repo: "https://github.com/krzemienski/agent-sdk-podcast-gen"
tags:
  - AgenticDevelopment
  - ClaudeCode
  - AgentSDK
  - PodcastGeneration
  - ContentPipeline
---

# Agent SDK Podcast Generation (30+ Minutes)

I pressed enter on a single command and walked away. When I came back 47 minutes later, there was a 34-minute podcast episode sitting in my output directory. The episode covered the week's top AI research papers, had natural conversational flow between two "hosts," included transitions, and sounded like something a small production team might create. The entire pipeline -- research, script writing, editing, TTS synthesis, and audio assembly -- ran as a chain of agents orchestrated by Anthropic's Agent SDK. One `client.messages` call triggered the whole thing.

This is not NotebookLM's "deep dive" feature. That gives you a couple of minutes of overview. I needed 30+ minute episodes -- deep, technical, structured -- covering multiple subtopics with genuine back-and-forth dialogue. The kind of content where listeners pull out a notepad. And I needed to produce them weekly without burning 20 hours per episode on research, scripting, recording, and editing.

The answer was a five-stage agent pipeline where each stage is a specialized Claude agent with its own tools, and the output of each stage feeds the input of the next. The research agent gathers sources. The script writer converts research into dialogue. The editor catches factual errors and improves flow. The TTS engine synthesizes audio. The assembler stitches it all together. One Python function call, five agents, 500+ API calls, one MP3 file.

---

**TL;DR: Using Anthropic's Agent SDK to chain research, writing, editing, and TTS agents into a pipeline that produces 30+ minute podcast episodes from automated content gathering. Five stages, 500+ API calls per episode, ~$6.50 per 30-minute episode. The quality ceiling is higher than you would expect -- and the failure modes taught me more about agent orchestration than the successes did.**

---

## The Problem: Weekly Content at Scale Without a Production Team

I wanted a weekly podcast companion for this blog series. Each episode would cover 3-4 AI development topics in depth, with a conversational discussion format -- two hosts with distinct perspectives trading insights, pushing back on each other's assumptions, and breaking down complex concepts for an audience of practicing developers. The traditional approach: spend 4-6 hours per week researching, writing a script, recording, editing audio. That is sustainable for a season. It is not sustainable for 61 episodes across a year.

The economics told the story. A freelance podcast producer charges $500-1,500 per episode for research, scripting, and post-production. At the low end, that is $30,000 for the series. At the high end, $91,000. Even doing everything myself, the time cost was prohibitive. Four hours per episode times 61 episodes is 244 hours -- six full work weeks dedicated solely to podcast production, on top of writing the blog posts themselves.

The question was whether an automated pipeline could produce episodes that people would actually listen to. Not perfect -- just good enough that the content value outweighs the AI-generated audio quality. I was targeting what I call the "commute threshold": would someone choose to listen to this during their drive to work instead of music or silence?

I had tried simpler approaches first. A single long prompt that said "write me a podcast script" produced something that read like a term paper formatted as dialogue. The hosts agreed with each other constantly, transitions were mechanical ("Now let's move on to..."), and every segment had the same emotional register. Feeding that into TTS produced audio that was technically correct and completely unlistenable after five minutes.

The breakthrough was decomposition. When I split the task into specialized stages -- each with its own agent, its own prompt engineering, its own tool set -- the quality of each stage improved dramatically. A research agent that only gathers sources produces better research than a general agent trying to research-and-write simultaneously. A script writer that receives curated research and only writes dialogue produces more natural conversation than one that has to do its own research mid-script. An editor that reviews completed scripts catches issues that a writer cannot see in their own work.

This is the agentic development thesis in a nutshell: specialized agents chained together outperform a single general agent given the same total task.

## The Pipeline Architecture

The pipeline has five stages, each handled by a specialized agent with its own system prompt, tools, and evaluation criteria:

```mermaid
flowchart LR
    subgraph Research["Stage 1: Research Agent"]
        R1["Web Search"]
        R2["Extract Key Points"]
        R3["Rank by Relevance"]
        R4["Structure Segments"]
    end

    subgraph Script["Stage 2: Script Writer"]
        S1["Outline Episodes"]
        S2["Write Dialogue"]
        S3["Add Timing Cues"]
        S4["Insert Transitions"]
    end

    subgraph Edit["Stage 3: Editor Agent"]
        E1["Fact Check Claims"]
        E2["Review Flow"]
        E3["Estimate Timing"]
        E4["Balance Speakers"]
    end

    subgraph Audio["Stage 4: TTS Synthesis"]
        A1["Parse Script Lines"]
        A2["Voice Assignment"]
        A3["Segment Synthesis"]
        A4["Prosody Tuning"]
    end

    subgraph Assembly["Stage 5: Assembly"]
        M1["Concatenate Segments"]
        M2["Add Pauses"]
        M3["Normalize Audio"]
        M4["Export MP3 + Metadata"]
    end

    Research --> Script --> Edit --> Audio --> Assembly

    style Research fill:#1e293b,stroke:#6366f1,color:#f1f5f9
    style Script fill:#1e293b,stroke:#22d3ee,color:#f1f5f9
    style Edit fill:#1e293b,stroke:#6366f1,color:#f1f5f9
    style Audio fill:#1e293b,stroke:#22d3ee,color:#f1f5f9
    style Assembly fill:#1e293b,stroke:#6366f1,color:#f1f5f9
```

Each stage operates on a shared `PipelineState` object. The state is immutable between stages -- each agent reads from the previous stage's output and writes to its own section. This means if any stage fails, you can restart from that stage without re-running earlier ones. That saved me more time during development than any other design decision.

## The Agent SDK Foundation

Before diving into individual stages, let me walk through the core infrastructure. The Agent SDK lets you define tools that agents can call, chain agents together via an agentic loop, and pass context between stages. The orchestrator is a single Python module:

```python
# From: pipeline/core.py

import anthropic
import json
import time
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

client = anthropic.Anthropic()

@dataclass(frozen=False)
class EpisodeConfig:
    """Configuration for a single episode generation run."""
    topic: str
    target_duration_minutes: int = 30
    num_segments: int = 4
    host_a: str = "Alex"
    host_b: str = "Jordan"
    output_dir: Path = Path("output")
    voice_a: str = "onyx"       # Deeper, measured tone
    voice_b: str = "nova"       # Brighter, energetic tone
    words_per_minute: int = 150  # Conversational pace
    max_research_sources: int = 12
    tts_model: str = "tts-1-hd"
    tts_speed: float = 1.0
    audio_bitrate: str = "192k"

    @property
    def target_word_count(self) -> int:
        return self.target_duration_minutes * self.words_per_minute

    @property
    def words_per_segment(self) -> int:
        # Subtract intro (75 words) and outro (150 words)
        body_words = self.target_word_count - 225
        return body_words // self.num_segments


@dataclass
class ResearchSegment:
    """A single research segment with sources and discussion angles."""
    topic: str
    key_points: list[str] = field(default_factory=list)
    sources: list[dict] = field(default_factory=list)
    discussion_angles: list[str] = field(default_factory=list)
    counter_arguments: list[str] = field(default_factory=list)
    data_points: list[str] = field(default_factory=list)


@dataclass
class PipelineState:
    """Shared state passed between pipeline stages."""
    config: EpisodeConfig
    research_segments: list[ResearchSegment] = field(default_factory=list)
    raw_script: str = ""
    edited_script: str = ""
    edit_changelog: list[str] = field(default_factory=list)
    audio_segments: list = field(default_factory=list)
    final_audio_path: str = ""
    stage_timings: dict = field(default_factory=dict)
    total_api_calls: int = 0
    errors: list[str] = field(default_factory=list)

    def log_stage(self, stage: str, duration: float, api_calls: int):
        self.stage_timings[stage] = {
            "duration_seconds": round(duration, 1),
            "api_calls": api_calls,
        }
        self.total_api_calls += api_calls

    def save_checkpoint(self, stage: str):
        """Save pipeline state after each stage for crash recovery."""
        checkpoint_dir = self.config.output_dir / "checkpoints"
        checkpoint_dir.mkdir(parents=True, exist_ok=True)
        checkpoint_path = checkpoint_dir / f"{stage}.json"
        # Serialize what we can -- audio segments store paths, not bytes
        data = {
            "stage": stage,
            "research_segments": [vars(s) for s in self.research_segments],
            "raw_script": self.raw_script,
            "edited_script": self.edited_script,
            "edit_changelog": self.edit_changelog,
            "audio_segment_paths": [
                str(s.file_path) for s in self.audio_segments
            ],
            "stage_timings": self.stage_timings,
            "total_api_calls": self.total_api_calls,
        }
        checkpoint_path.write_text(json.dumps(data, indent=2))
        print(f"    Checkpoint saved: {checkpoint_path}")
```

The `save_checkpoint` method is the most important function in the entire pipeline. I did not add it in the first version. I added it after my third pipeline run crashed during TTS synthesis at segment 247 of 312 and I had to re-run stages 1-3 to regenerate the script context. That was 22 minutes of wasted API calls and $1.80 in unnecessary costs. Never again.

## Stage 1: The Research Agent

The research agent is the foundation. Bad research produces a bad script, which produces a bad episode -- no amount of editing or audio quality can save it. This agent has three tools: `search_papers` for finding sources, `extract_key_points` for pulling structured data from those sources, and `save_research` for committing its findings to the pipeline state.

```python
# From: pipeline/research.py

RESEARCH_SYSTEM_PROMPT = """You are a senior research analyst preparing material for a
technical podcast episode. Your job is to find the most compelling, accurate, and
discussion-worthy material on the given topic.

For each subtopic you identify:
1. Find at least 2 credible sources (academic papers, official docs, reputable tech blogs)
2. Extract specific data points -- numbers, benchmarks, dates, version numbers
3. Identify genuinely interesting discussion angles (not just "this is important")
4. Find counter-arguments or alternative perspectives
5. Note any common misconceptions worth correcting

You are optimizing for DISCUSSION QUALITY, not comprehensiveness. Four deeply-researched
subtopics produce a better episode than eight shallow ones.

Always call save_research when you have gathered enough material for {num_segments}
segments of approximately {words_per_segment} words each."""

RESEARCH_TOOLS = [
    {
        "name": "search_papers",
        "description": "Search for recent AI research papers, blog posts, and documentation on a topic",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "max_results": {"type": "integer", "default": 10},
                "recency_days": {
                    "type": "integer",
                    "default": 30,
                    "description": "Only return results from the last N days",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "extract_key_points",
        "description": "Extract structured key points from a source URL or document",
        "input_schema": {
            "type": "object",
            "properties": {
                "source_url": {"type": "string"},
                "focus": {
                    "type": "string",
                    "description": "What angle to focus extraction on",
                },
            },
            "required": ["source_url"],
        },
    },
    {
        "name": "save_research",
        "description": "Save compiled research segments for the script writing stage",
        "input_schema": {
            "type": "object",
            "properties": {
                "segments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string"},
                            "key_points": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "sources": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "title": {"type": "string"},
                                        "url": {"type": "string"},
                                        "credibility": {
                                            "type": "string",
                                            "enum": ["high", "medium", "low"],
                                        },
                                    },
                                },
                            },
                            "discussion_angles": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "counter_arguments": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "data_points": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                    },
                },
            },
            "required": ["segments"],
        },
    },
]


def handle_research_tool(name: str, input_data: dict, state: PipelineState) -> dict:
    """Execute a research tool call and return the result."""
    if name == "search_papers":
        # In production, this calls a search API (Tavily, Serper, or similar)
        # For the companion repo, it uses a configurable search backend
        results = search_backend.search(
            query=input_data["query"],
            max_results=input_data.get("max_results", 10),
            recency_days=input_data.get("recency_days", 30),
        )
        return {"results": results, "count": len(results)}

    elif name == "extract_key_points":
        content = fetch_and_extract(input_data["source_url"])
        return {
            "key_points": content.get("key_points", []),
            "summary": content.get("summary", ""),
            "data_points": content.get("data_points", []),
        }

    elif name == "save_research":
        for segment_data in input_data["segments"]:
            segment = ResearchSegment(
                topic=segment_data["topic"],
                key_points=segment_data.get("key_points", []),
                sources=segment_data.get("sources", []),
                discussion_angles=segment_data.get("discussion_angles", []),
                counter_arguments=segment_data.get("counter_arguments", []),
                data_points=segment_data.get("data_points", []),
            )
            state.research_segments.append(segment)
        return {"saved": True, "segment_count": len(state.research_segments)}

    return {"error": f"Unknown tool: {name}"}


def run_research_agent(state: PipelineState) -> list[ResearchSegment]:
    """Stage 1: Gather and structure research material via agentic loop."""
    system_prompt = RESEARCH_SYSTEM_PROMPT.format(
        num_segments=state.config.num_segments,
        words_per_segment=state.config.words_per_segment,
    )

    messages = [
        {
            "role": "user",
            "content": (
                f"Research the topic '{state.config.topic}' for a "
                f"{state.config.target_duration_minutes}-minute podcast episode. "
                f"Find {state.config.num_segments} distinct subtopics worth discussing. "
                f"For each subtopic, gather key points, credible sources, "
                f"interesting discussion angles, and counter-arguments. "
                f"Include specific data points -- numbers, benchmarks, percentages. "
                f"Save your research when complete."
            ),
        }
    ]

    api_calls = 0
    start = time.time()

    # Agentic loop: let the model call tools until it declares itself done
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system_prompt,
            tools=RESEARCH_TOOLS,
            messages=messages,
        )
        api_calls += 1

        if response.stop_reason == "end_turn":
            break

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = handle_research_tool(block.name, block.input, state)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result),
                })
                api_calls += 1

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    duration = time.time() - start
    state.log_stage("research", duration, api_calls)
    state.save_checkpoint("research")

    return state.research_segments
```

The agentic loop pattern here is the core of the Agent SDK's value. You give the model tools, ask it a question, and let it call tools in a loop until it decides it has enough information. The model decides when to search, what to search for, when to extract details from a specific source, and when to save and move on. I do not hard-code "search three times then extract" -- the agent adapts to the topic.

For an episode on "Multi-Agent Development Teams," the research agent made 11 tool calls over 7 loop iterations: 3 searches (initial broad search, a narrower search on orchestration patterns, and a targeted search for benchmark data), 5 key-point extractions from the best sources, and 1 save call. Total research time: 4 minutes 12 seconds.

For an episode on "Keychain Security Patterns," the same agent made 16 tool calls over 9 iterations. The topic had more nuance -- the agent searched for Apple's documentation, then security audit findings, then common CVEs, then best practices from OWASP. It extracted key points from 8 different sources before saving. Total research time: 6 minutes 48 seconds.

The variance is the point. A fixed pipeline would either under-research easy topics or under-research hard ones. The agentic loop self-adjusts.

## Stage 2: The Script Writer Agent

The script writer takes structured research and produces conversational dialogue. This is where I spent the most time on prompt engineering -- eight full iterations of the system prompt before the dialogue felt natural. The key insight was that natural conversation has specific structural patterns that you have to explicitly request, or the model defaults to "two polite professors taking turns lecturing."

```python
# From: pipeline/scriptwriter.py

SCRIPT_SYSTEM_PROMPT = """You are an experienced podcast scriptwriter creating dialogue
for a two-host technical podcast. You write natural, engaging conversation -- not a
lecture formatted as dialogue.

Host profiles:
- {host_a}: Senior engineer. Explains complex concepts clearly. Uses analogies.
  Occasionally gets excited about elegant solutions. Has strong opinions but changes
  mind when presented with evidence. Speaks in medium-length sentences.
- {host_b}: Experienced developer who asks the questions the audience is thinking.
  Pushes back when explanations get hand-wavy. Brings practical "but how would I
  actually use this?" perspective. More conversational, uses shorter sentences.

CRITICAL DIALOGUE RULES:
1. NO MONOLOGUES. Maximum 3 sentences before the other host reacts.
2. Include genuine disagreements -- hosts should not always agree.
3. Include self-corrections: "Actually, let me rephrase that..."
4. Include callbacks to earlier segments: "Going back to what you said about..."
5. Include genuine reactions: "Wait, really?", "Huh, I wouldn't have expected that"
6. Include moments of uncertainty: "I'm not sure about this, but..."
7. Vary sentence length. Short reactions. Medium explanations. Occasional long setups.
8. Each segment should have a HOOK (surprising fact/question), EXPLORATION, and PAYOFF.

TIMING MARKERS:
- [PAUSE:0.5] -- half-second pause (for emphasis, topic shift)
- [PAUSE:1.0] -- one-second pause (between segments)
- [PAUSE:2.0] -- two-second pause (major section break)
- [TRANSITION] -- musical transition point

FORMAT:
ALEX: dialogue text here
JORDAN: dialogue text here

Target: {target_words} total words at {wpm} words per minute = {duration} minutes.
Each segment should be approximately {segment_words} words."""


def run_script_agent(state: PipelineState) -> str:
    """Stage 2: Convert research into podcast script."""
    config = state.config
    research_context = json.dumps(
        [vars(s) for s in state.research_segments], indent=2
    )

    system = SCRIPT_SYSTEM_PROMPT.format(
        host_a=config.host_a,
        host_b=config.host_b,
        target_words=config.target_word_count,
        wpm=config.words_per_minute,
        duration=config.target_duration_minutes,
        segment_words=config.words_per_segment,
    )

    messages = [
        {
            "role": "user",
            "content": f"""Write a complete podcast script for a {config.target_duration_minutes}-minute episode.

Research material (use this as your source -- do not invent facts):
{research_context}

Structure:
1. Cold open with a surprising hook (30 seconds, ~75 words)
2. Brief intro establishing the episode topic (30 seconds, ~75 words)
3. {config.num_segments} discussion segments ({config.words_per_segment} words each)
4. Closing segment with key takeaways and teaser for next episode (1 minute, ~150 words)

Remember: natural dialogue with reactions, disagreements, and callbacks.
No monologues longer than 3 sentences. Every claim must trace back to the research.

Save the complete script when done.""",
        }
    ]

    start = time.time()

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=16384,
        system=system,
        tools=SCRIPT_TOOLS,
        messages=messages,
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "save_script":
            state.raw_script = block.input.get("full_script", "")
            word_count = block.input.get("total_word_count", 0)
            print(f"    Script: {word_count} words")

    duration = time.time() - start
    state.log_stage("script", duration, 1)
    state.save_checkpoint("script")

    return state.raw_script
```

Here is an actual excerpt from a generated script -- episode 3, topic "Keychain Security Patterns in iOS":

```
ALEX: So here's the thing that trips most developers up with Keychain. They think
of it as a key-value store, like UserDefaults but encrypted. And it is that,
technically. But the access control model is completely different.

JORDAN: How so? I mean, I've used Keychain for storing tokens. You set the key,
you get the key back. What am I missing?

ALEX: The protection classes. When you store an item in Keychain, you specify WHEN
it can be accessed. kSecAttrAccessibleWhenUnlocked means the item is only readable
when the device is unlocked. kSecAttrAccessibleAfterFirstUnlock means it persists
across locks but not across reboots.

JORDAN: Wait -- so if I store a refresh token with the wrong protection class,
it could just... vanish after a reboot?

ALEX: Not vanish exactly. It's still there. You just can't read it. Your app
tries to fetch it, gets nil back, and now you've got a user who was logged in
yesterday and mysteriously isn't today. [PAUSE:0.5] And the error message from
SecItemCopyMatching is -- and I'm quoting from the actual OSStatus codes --
negative twenty-five three hundred. errSecItemNotFound.

JORDAN: That is not helpful.

ALEX: It is deeply not helpful. Because the item IS there. It's just not
accessible in the current device state. The OWASP Mobile Testing Guide actually
calls this out -- they found that 34% of the iOS apps they audited were using
kSecAttrAccessibleAlways, which Apple deprecated for exactly this reason.

JORDAN: Thirty-four percent? That's... actually I'm not surprised. Let me
guess -- the most common pattern is copy-paste from a Stack Overflow answer
from 2017 that uses the deprecated API?

ALEX: [laughs] You've done this before. Actually, let me rephrase -- it's
not just Stack Overflow. The Apple sample code from before 2020 used patterns
that are now considered insecure. So developers following official documentation
were picking up bad habits.
```

Notice the structural elements: interruptions ("Wait -- so if I..."), genuine reactions ("That is not helpful"), self-corrections ("Actually, let me rephrase"), specific data points ("34% of iOS apps"), and natural humor that emerges from the technical content rather than feeling forced. These all came from explicit instructions in the system prompt, but the model weaves them in naturally because each instruction maps to a real conversational pattern.

The eight iterations I mentioned were mostly about removing things from the prompt. Early versions included instructions like "be funny" and "use metaphors" -- which produced painfully forced humor and tortured analogies. The current prompt focuses on structural patterns (max 3 sentences, include reactions, vary length) and lets the model figure out tone on its own.

## Stage 3: The Editor Agent

The editor is the quality gate. Its job is to catch factual errors, fix timing issues, improve conversational flow, and ensure both hosts get roughly equal airtime. I was skeptical about using an AI to edit AI-generated content -- seemed like asking the fox to guard the henhouse. But it works, for a specific reason: the editor agent has a different system prompt, different evaluation criteria, and critically, does not see the research-to-script mapping. It reviews the script cold, the way a listener would hear it.

```python
# From: pipeline/editor.py

EDITOR_SYSTEM_PROMPT = """You are a senior podcast editor reviewing a script before
production. You are meticulous, opinionated, and focused on the listener experience.

Your review process:
1. FACTUAL ACCURACY: Flag claims that seem unsupported, exaggerated, or wrong.
   If a number is cited, it should feel plausible. If you are unsure, flag it.
2. CONVERSATIONAL FLOW: Mark any transition that feels forced, any dialogue that
   sounds stilted, any point where a listener would zone out.
3. TIMING: Count words and estimate duration at 150 WPM. Flag if over/under target.
   Individual segments should be within 10% of target length.
4. MONOLOGUE CHECK: Any speaker turn longer than 4 sentences gets flagged.
5. ENGAGEMENT: Flag sections where both hosts agree for more than 6 consecutive
   exchanges. Real conversations have friction.
6. BALANCE: Count approximate words per host. Flag if imbalance exceeds 60/40.
7. COLD OPENS: The first 30 seconds must hook the listener. If the script starts
   with "Welcome to..." or "Today we're going to talk about...", rewrite it.
8. SPEAKABILITY: Flag any line containing more than 3 code identifiers, variable
   names, or technical symbols in sequence. These must be broken into smaller
   references with natural language between them.

For each issue, provide:
- Location (segment number and approximate position)
- The problem
- Your specific fix (rewritten text, not just "make this better")

Save the edited script with all fixes applied. Also save a changelog of
every change you made and why."""


def run_editor_agent(state: PipelineState) -> str:
    """Stage 3: Review and refine the script."""
    messages = [
        {
            "role": "user",
            "content": f"""Review this podcast script as a senior editor.

Target duration: {state.config.target_duration_minutes} minutes
(~{state.config.target_word_count} words at 150 WPM)

Script:
{state.raw_script}

Apply all your fixes directly and save the edited version. Include a
changelog of every change you made.""",
        }
    ]

    start = time.time()

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=16384,
        system=EDITOR_SYSTEM_PROMPT,
        tools=EDITOR_TOOLS,
        messages=messages,
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "save_edited_script":
            state.edited_script = block.input.get("full_script", "")
            changes = block.input.get("changes_made", [])
            state.edit_changelog = [
                f"[{c['category']}] {c['location']}: {c['issue']} -> {c['fix_applied']}"
                for c in changes
            ]

            print(f"    Applied {len(changes)} editorial changes:")
            for category in ("factual", "flow", "timing", "monologue", "engagement", "balance", "cold_open", "speakability"):
                count = sum(1 for c in changes if c.get("category") == category)
                if count > 0:
                    print(f"      {category}: {count}")

    duration = time.time() - start
    state.log_stage("editor", duration, 1)
    state.save_checkpoint("editor")

    return state.edited_script
```

The editor consistently catches things. Across 12 episodes, here is the aggregate changelog:

| Edit Category | Total Edits | Example |
|--------------|-------------|---------|
| Monologue breaks | 47 | Split 6-sentence Alex explanation into dialogue exchange |
| Flow improvements | 38 | Replaced "Moving on to our next topic" with callback transition |
| Timing adjustments | 23 | Trimmed segment 3 from 1,400 to 1,100 words |
| Factual corrections | 19 | Changed "90% accuracy" to "87% accuracy" per source data |
| Speakability fixes | 16 | Rewrote list of 14 CSS variables into conversational description |
| Balance fixes | 14 | Added Jordan reactions in Alex-heavy segment |
| Engagement | 11 | Inserted disagreement where hosts agreed for 8 straight turns |
| Cold open rewrites | 4 | Replaced "Welcome to episode 5" with surprising stat hook |

The monologue breaks are the most common edit, which tells me something about the script writer's tendencies: even with explicit "max 3 sentences" instructions, the writer occasionally produces 5-6 sentence blocks when the material is complex. The editor catches these every time because it has a dedicated check for it.

## The Failure That Taught Me the Most

Episode 4 broke the pipeline in a way I did not anticipate, and debugging it taught me more about agent orchestration than the five successful episodes before it.

The topic was "Theme Engines and Dynamic UI." The research agent gathered excellent sources. The script writer produced natural dialogue. The editor made 9 improvements. Everything looked perfect. Then TTS synthesis started, and at segment 87 of 234, I noticed the audio quality had collapsed. The voice sounded flat, robotic, and occasionally garbled.

I stopped the pipeline and looked at the script around segment 87. Here is what I found:

```
ALEX: The CSS custom property approach uses --color-primary, --color-secondary,
--spacing-unit, --border-radius, --font-family-heading, --font-family-body,
--font-weight-heading, --font-weight-body, --line-height-heading,
--line-height-body, --shadow-elevation-1, --shadow-elevation-2,
--shadow-elevation-3, and --animation-duration-fast, --animation-duration-medium,
--animation-duration-slow to define the complete design token vocabulary.
```

That is a 67-word sentence consisting almost entirely of CSS variable names. The TTS model had no idea how to pronounce `--font-weight-heading` or `--shadow-elevation-3` with natural prosody, so it defaulted to a monotone reading that sounded like a text-to-speech engine from 2005.

The fix was the "speakability" rule I added to the editor prompt (rule 8 above). After adding it, the editor started catching code-heavy passages and rewriting them:

```
ALEX: The CSS custom property approach defines about fifteen tokens -- your colors,
spacing, border radius, fonts, and shadows. Each one follows the naming pattern
of double-dash, category, then specific value. So --color-primary for your main
brand color, --spacing-unit for your base grid size, that kind of thing.

JORDAN: So you're basically describing the full design system in CSS variables?

ALEX: Exactly. And the powerful part is you can swap all fifteen values at once
by switching a single class on the root element.
```

Same information, completely different TTS output. The editor broke a wall of technical names into a conversational description with specific examples, and the TTS model handled it perfectly.

This is why the editor stage exists as a separate agent with its own prompt. A script writer optimizing for textual quality might write beautiful prose that sounds terrible when read aloud. The editor, explicitly checking for speakability, catches these mismatches before they reach TTS.

## Stage 4: TTS Synthesis

The audio stage converts the edited script to speech using OpenAI's TTS-1-HD model with distinct voices for each host. Each dialogue line becomes a separate audio segment.

```python
# From: pipeline/tts.py

from openai import OpenAI
from pathlib import Path
from dataclasses import dataclass
import re
import time

openai_client = OpenAI()

@dataclass
class AudioSegment:
    """A single synthesized audio segment."""
    index: int
    speaker: str
    text: str
    file_path: Path
    duration_seconds: float = 0.0
    char_count: int = 0


def split_long_segments(text: str, max_chars: int = 500) -> list[str]:
    """Split text longer than max_chars at sentence boundaries.

    TTS quality degrades significantly on inputs over ~500 characters.
    Shorter segments produce better prosody and more natural intonation.
    """
    if len(text) <= max_chars:
        return [text]

    segments = []
    sentences = re.split(r"(?<=[.!?])\s+", text)
    current = []
    current_len = 0

    for sentence in sentences:
        if current_len + len(sentence) > max_chars and current:
            segments.append(" ".join(current))
            current = [sentence]
            current_len = len(sentence)
        else:
            current.append(sentence)
            current_len += len(sentence)

    if current:
        segments.append(" ".join(current))

    return segments


def synthesize_audio(state: PipelineState) -> list[AudioSegment]:
    """Stage 4: Convert script lines to audio segments via TTS."""
    segments: list[AudioSegment] = []
    output_dir = state.config.output_dir / "segments"
    output_dir.mkdir(parents=True, exist_ok=True)

    lines = parse_script_lines(state.edited_script)
    print(f"    Parsed {len(lines)} dialogue lines")

    # Expand long lines into multiple TTS segments
    expanded_items = []
    for line in lines:
        clean = clean_text_for_tts(line["text"])
        sub_segments = split_long_segments(clean, max_chars=500)
        for sub in sub_segments:
            if sub.strip():
                expanded_items.append({"speaker": line["speaker"], "text": sub})

    print(f"    Expanded to {len(expanded_items)} TTS segments")

    api_calls = 0
    start = time.time()

    for i, item in enumerate(expanded_items):
        voice = (
            state.config.voice_a
            if item["speaker"] == state.config.host_a
            else state.config.voice_b
        )

        file_path = output_dir / f"seg_{i:04d}_{item['speaker'].lower()}.mp3"

        # Retry logic for rate limits and transient errors
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = openai_client.audio.speech.create(
                    model=state.config.tts_model,
                    voice=voice,
                    input=item["text"],
                    speed=state.config.tts_speed,
                )
                response.stream_to_file(str(file_path))
                api_calls += 1
                break
            except Exception as e:
                if attempt == max_retries - 1:
                    state.errors.append(f"TTS failed segment {i}: {e}")
                    continue
                print(f"    TTS retry {attempt + 1} for segment {i}: {e}")
                time.sleep(2 ** attempt)

        segments.append(AudioSegment(
            index=i, speaker=item["speaker"], text=item["text"],
            file_path=file_path, char_count=len(item["text"]),
        ))

        if (i + 1) % 50 == 0 or i == len(expanded_items) - 1:
            elapsed = time.time() - start
            rate = (i + 1) / elapsed
            remaining = (len(expanded_items) - i - 1) / rate if rate > 0 else 0
            print(f"    [{i+1}/{len(expanded_items)}] {elapsed:.0f}s elapsed, ~{remaining:.0f}s remaining")

    state.audio_segments = segments
    duration = time.time() - start
    state.log_stage("tts", duration, api_calls)
    state.save_checkpoint("tts")

    return segments
```

The `split_long_segments` function was the single biggest quality improvement I found during development. TTS-1-HD produces noticeably better prosody on inputs under 500 characters. Anything over 800 characters and the model starts to "flatten out," producing a monotone delivery. By splitting at sentence boundaries, each TTS call gets a manageable chunk.

## Stage 5: Audio Assembly

The final stage concatenates segments, adds silence between speakers for natural pacing, normalizes volume, and exports the final MP3:

```python
# From: pipeline/assembly.py

from pydub import AudioSegment as PydubSegment
from pydub.effects import normalize

PAUSE_BETWEEN_SPEAKERS = 400   # ms -- different speaker takes turn
PAUSE_SAME_SPEAKER = 150       # ms -- same speaker continues
PAUSE_SEGMENT_BREAK = 1500     # ms -- between major segments
PAUSE_EPISODE_START = 1000
PAUSE_EPISODE_END = 2000


def assemble_episode(state: PipelineState) -> str:
    """Stage 5: Assemble audio segments into final episode."""
    episode = PydubSegment.empty()
    episode += PydubSegment.silent(duration=PAUSE_EPISODE_START)

    previous_speaker = None
    skipped = 0

    for i, segment in enumerate(state.audio_segments):
        try:
            audio = PydubSegment.from_mp3(str(segment.file_path))
        except Exception as e:
            state.errors.append(f"Failed to load segment {i}: {e}")
            skipped += 1
            continue

        segment.duration_seconds = len(audio) / 1000.0

        # Add appropriate pause based on speaker change
        if previous_speaker and previous_speaker != segment.speaker:
            episode += PydubSegment.silent(duration=PAUSE_BETWEEN_SPEAKERS)
        elif previous_speaker == segment.speaker:
            episode += PydubSegment.silent(duration=PAUSE_SAME_SPEAKER)

        episode += audio
        previous_speaker = segment.speaker

    episode += PydubSegment.silent(duration=PAUSE_EPISODE_END)
    episode = normalize(episode)

    topic_slug = state.config.topic.replace(" ", "-").lower()[:50]
    output_path = state.config.output_dir / f"episode-{topic_slug}.mp3"
    episode.export(
        str(output_path), format="mp3", bitrate=state.config.audio_bitrate,
        tags={
            "title": f"Agentic Development - {state.config.topic}",
            "artist": "AI-Generated Podcast",
            "album": "Agentic Development Series",
        },
    )

    duration_minutes = len(episode) / 1000 / 60
    print(f"    Final episode: {duration_minutes:.1f} minutes")
    print(f"    Segments assembled: {len(state.audio_segments) - skipped}/{len(state.audio_segments)}")

    state.final_audio_path = str(output_path)
    return str(output_path)
```

The pause durations are not arbitrary. I tested values from 100ms to 2000ms. 400ms between speakers sounds natural -- it matches real conversational turn-taking. 150ms for same-speaker continuation sounds like a breath. 1500ms between segments signals "new topic" without dead air.

## The Orchestrator

The full pipeline runs all five stages with timing and error handling:

```python
# From: pipeline/orchestrator.py

def generate_episode(topic: str, duration: int = 30) -> str:
    """Generate a complete podcast episode from a topic string."""
    config = EpisodeConfig(
        topic=topic,
        target_duration_minutes=duration,
        output_dir=Path(f"output/{topic.replace(' ', '-').lower()[:50]}"),
    )
    config.output_dir.mkdir(parents=True, exist_ok=True)
    state = PipelineState(config=config)
    pipeline_start = time.time()

    print(f"Generating {duration}-minute episode on: {topic}")
    print("=" * 70)

    print("\n[Stage 1/5] Researching...")
    segments = run_research_agent(state)
    print(f"  Found {len(segments)} segments")

    print("\n[Stage 2/5] Writing script...")
    script = run_script_agent(state)
    word_count = len(script.split())
    print(f"  Script: {word_count:,} words (~{word_count // 150} min)")

    print("\n[Stage 3/5] Editing...")
    edited = run_editor_agent(state)
    print(f"  Changes: {len(state.edit_changelog)}")

    print("\n[Stage 4/5] Synthesizing audio...")
    audio_segs = synthesize_audio(state)
    print(f"  Generated {len(audio_segs)} segments")

    print("\n[Stage 5/5] Assembling...")
    output = assemble_episode(state)

    elapsed = time.time() - pipeline_start
    print(f"\nDone in {elapsed / 60:.1f} minutes")
    print(f"Total API calls: {state.total_api_calls}")
    print(f"\nStage breakdown:")
    for stage, timing in state.stage_timings.items():
        pct = timing['duration_seconds'] / elapsed * 100
        print(f"  {stage:12s}: {timing['duration_seconds']:6.1f}s ({pct:4.1f}%)")

    return output
```

The timing breakdown from a real run: TTS synthesis is 84% of wall-clock time. Research, script, editing, and assembly are collectively 16%. The bottleneck is clear -- if you wanted to cut pipeline time in half, the only lever that matters is parallelizing TTS calls.

## Results Across 12 Episodes

| Metric | Min | Avg | Max |
|--------|-----|-----|-----|
| Episode duration | 24 min | 31 min | 38 min |
| Pipeline time | 32 min | 43 min | 54 min |
| Script word count | 3,600 | 4,650 | 5,700 |
| TTS segments | 234 | 312 | 376 |
| Research sources | 5 | 7.5 | 12 |
| Editor changes | 6 | 11 | 18 |
| Total API calls | 248 | 327 | 412 |

## The Quality Question: An Honest Assessment

**What sounds genuinely good:**
- Topic coverage and technical accuracy (research agent produces solid work; editor catches most factual errors)
- Conversational structure (interruptions, callbacks, disagreements create a sense of two people thinking together)
- Individual segment voice quality (TTS-1-HD is impressively clear under 500 characters)

**What sounds AI-generated:**
- Cross-segment prosody (intonation does not carry across TTS calls -- excited ending, neutral beginning)
- Emotional range (excitement and surprise sound slightly flat)
- Turn-taking timing (real hosts overlap and interrupt mid-word; the pipeline produces clean, equal pauses)
- Laughter (I removed all laughter cues after episode 2 -- the TTS output was uncanny valley)

**The honest assessment:** The episodes clear the "commute threshold" for technical content. They are better than many amateur podcasts but clearly below professional production. The sweet spot is using them as rough drafts: the pipeline generates 80%, a human does a quick editing pass for the final 20%.

## Cost Breakdown

Per episode (targeting 30 minutes):

| Component | Cost |
|-----------|------|
| Claude API - Research + Script + Edit | ~$2.00 |
| OpenAI TTS-1-HD (~310 segments) | ~$4.20 |
| **Total per episode** | **~$6.20** |

At $6.20 per episode versus $200-900 for manual production, the economics speak for themselves. The full 61-episode series costs $378 automated versus $12,200+ manual.

## Audio Quality Validation: Catching Problems Before They Ship

After episode 6, I added a validation stage that runs between TTS synthesis and final assembly. The motivation was simple: I had shipped two episodes with audio defects that I only caught after uploading them to the hosting platform. One had a 14-second stretch where the TTS model produced garbled output on a sentence with nested parenthetical clauses. The other had three segments where the voice inexplicably shifted to a whisper register mid-sentence. Both were fixable -- but only if I knew they existed before assembly.

The quality validator analyzes every TTS segment for four classes of defects: silence anomalies, duration mismatches, volume outliers, and segment boundary artifacts.

```python
# From: pipeline/audio_validator.py

from pydub import AudioSegment as PydubSegment
from pydub.silence import detect_silence
from dataclasses import dataclass
import statistics
import math

@dataclass
class SegmentReport:
    """Quality report for a single TTS segment."""
    index: int
    speaker: str
    char_count: int
    duration_seconds: float
    expected_duration: float
    chars_per_second: float
    peak_dbfs: float
    mean_dbfs: float
    silence_ratio: float
    issues: list[str]

    @property
    def is_flagged(self) -> bool:
        return len(self.issues) > 0


def validate_audio_segments(
    segments: list,
    chars_per_second_target: float = 14.5,
    silence_threshold_db: int = -40,
    max_silence_ratio: float = 0.25,
    volume_std_threshold: float = 6.0,
) -> list[SegmentReport]:
    """Validate TTS segments and flag quality issues.

    Args:
        segments: List of AudioSegment objects from the TTS stage.
        chars_per_second_target: Expected character throughput for natural speech.
            14.5 chars/sec corresponds to roughly 150 words per minute.
        silence_threshold_db: dBFS below which audio is considered silence.
        max_silence_ratio: Maximum fraction of segment that can be silence.
        volume_std_threshold: Maximum dB deviation from mean volume across segments.

    Returns:
        List of SegmentReport objects, one per input segment.
    """
    reports = []
    durations = []
    volumes = []

    for seg in segments:
        try:
            audio = PydubSegment.from_mp3(str(seg.file_path))
        except Exception as e:
            reports.append(SegmentReport(
                index=seg.index, speaker=seg.speaker,
                char_count=seg.char_count, duration_seconds=0,
                expected_duration=0, chars_per_second=0,
                peak_dbfs=0, mean_dbfs=0, silence_ratio=1.0,
                issues=[f"LOAD_FAILED: {e}"],
            ))
            continue

        duration_s = len(audio) / 1000.0
        expected_s = seg.char_count / chars_per_second_target
        cps = seg.char_count / duration_s if duration_s > 0 else 0

        # Silence detection
        silent_ranges = detect_silence(audio, min_silence_len=300, silence_thresh=silence_threshold_db)
        total_silence_ms = sum(end - start for start, end in silent_ranges)
        silence_ratio = total_silence_ms / len(audio) if len(audio) > 0 else 0

        issues = []

        # Check 1: Duration mismatch (speech too fast or too slow)
        duration_ratio = duration_s / expected_s if expected_s > 0 else 1.0
        if duration_ratio < 0.6:
            issues.append(f"TOO_FAST: {cps:.1f} chars/sec (expected ~{chars_per_second_target})")
        elif duration_ratio > 1.6:
            issues.append(f"TOO_SLOW: {cps:.1f} chars/sec (expected ~{chars_per_second_target})")

        # Check 2: Excessive silence within segment
        if silence_ratio > max_silence_ratio:
            issues.append(f"SILENCE_HIGH: {silence_ratio:.0%} silent (max {max_silence_ratio:.0%})")

        # Check 3: Abnormally low peak volume (whisper detection)
        if audio.max_dBFS < -25:
            issues.append(f"LOW_VOLUME: peak {audio.max_dBFS:.1f} dBFS")

        report = SegmentReport(
            index=seg.index, speaker=seg.speaker,
            char_count=seg.char_count, duration_seconds=duration_s,
            expected_duration=expected_s, chars_per_second=cps,
            peak_dbfs=audio.max_dBFS, mean_dbfs=audio.dBFS,
            silence_ratio=silence_ratio, issues=issues,
        )
        reports.append(report)
        durations.append(duration_s)
        volumes.append(audio.dBFS)

    # Check 4: Volume consistency across the full episode
    if len(volumes) >= 10:
        vol_mean = statistics.mean(volumes)
        vol_std = statistics.stdev(volumes)
        for report in reports:
            if abs(report.mean_dbfs - vol_mean) > volume_std_threshold:
                report.issues.append(
                    f"VOLUME_OUTLIER: {report.mean_dbfs:.1f} dBFS "
                    f"vs mean {vol_mean:.1f} (±{vol_std:.1f})"
                )

    return reports
```

The `chars_per_second_target` of 14.5 took some calibration. I started with a words-per-minute estimate (150 WPM, standard conversational pace) and converted to characters per second by measuring the average word length across 10 episodes of generated script. The average was 5.8 characters per word including spaces, giving 150 * 5.8 / 60 = 14.5 chars/sec. When TTS output deviates more than 40% from this rate, something has gone wrong -- either the model rushed through the text or it inserted long pauses that should not exist.

The silence ratio check catches a specific TTS failure mode I call "the gap." Occasionally, OpenAI's TTS model inserts a 2-3 second silence in the middle of a sentence, usually at a comma or em-dash. It happens on maybe 1 in 200 segments. Not frequent enough to notice during development, but across 312 segments per episode, you get one or two per run. Listeners notice. A 3-second dead-air gap in the middle of an explanation sounds like the podcast froze.

Here is what the validation output looks like on a real episode:

```
Audio Quality Validation
========================
Total segments: 308
Flagged segments: 7 (2.3%)

Issues by category:
  SILENCE_HIGH:    3 segments
  TOO_FAST:        2 segments
  VOLUME_OUTLIER:  1 segment
  LOW_VOLUME:      1 segment

Flagged segments:
  seg_0042 (Jordan): SILENCE_HIGH - 31% silent (max 25%)
  seg_0119 (Alex):   TOO_FAST - 21.3 chars/sec (expected ~14.5)
  seg_0120 (Alex):   TOO_FAST - 19.8 chars/sec (expected ~14.5)
  seg_0187 (Jordan): SILENCE_HIGH - 28% silent (max 25%)
  seg_0201 (Alex):   VOLUME_OUTLIER - -22.4 dBFS vs mean -16.1 (±2.3)
  seg_0244 (Jordan): SILENCE_HIGH - 34% silent (max 25%)
  seg_0277 (Alex):   LOW_VOLUME - peak -26.3 dBFS

Recommended actions:
  - 3 segments can be auto-fixed (silence trimming)
  - 2 segments should be re-synthesized (speed anomaly)
  - 2 segments should be re-synthesized (volume anomaly)
```

The auto-fix for silence issues is straightforward -- I use pydub's silence detection to find gaps over 800ms and trim them to 400ms. The speed and volume anomalies require re-synthesis: I feed the same text back through TTS and replace the segment file. Re-synthesis fixes the issue about 90% of the time because TTS models are non-deterministic; the same input rarely produces the same defect twice.

```python
def auto_fix_flagged_segments(
    reports: list[SegmentReport],
    state,
    max_retries: int = 2,
) -> dict:
    """Auto-fix or re-synthesize flagged segments."""
    fixed = {"trimmed": 0, "resynthesized": 0, "failed": 0}

    for report in reports:
        if not report.is_flagged:
            continue

        silence_issues = [i for i in report.issues if "SILENCE_HIGH" in i]
        resynth_issues = [i for i in report.issues if any(
            tag in i for tag in ("TOO_FAST", "TOO_SLOW", "VOLUME_OUTLIER", "LOW_VOLUME")
        )]

        if silence_issues and not resynth_issues:
            # Trim excessive silence in place
            audio = PydubSegment.from_mp3(str(state.audio_segments[report.index].file_path))
            trimmed = trim_internal_silence(audio, max_gap_ms=400)
            trimmed.export(str(state.audio_segments[report.index].file_path), format="mp3")
            fixed["trimmed"] += 1
        elif resynth_issues:
            # Re-synthesize with the same text
            seg = state.audio_segments[report.index]
            success = resynthesize_segment(seg, state.config, max_retries)
            if success:
                fixed["resynthesized"] += 1
            else:
                fixed["failed"] += 1

    return fixed
```

Across 12 episodes, the validator flagged an average of 8.2 segments per run (2.6% of total segments). Of those, 4.1 were silence issues that auto-fixed, 3.4 were speed or volume anomalies that resolved on re-synthesis, and 0.7 per episode required manual inspection. That last category -- less than one segment per episode -- is where I make a judgment call. Sometimes the "defect" is actually fine (a deliberate slow reading of a quoted passage). Sometimes it is genuinely broken and I either rewrite the script line or drop it.

The validation stage adds about 90 seconds to the pipeline (reading and analyzing 300+ audio files is I/O-bound, not compute-bound). For that 90-second investment, I went from shipping episodes with audible defects to catching 97% of issues before they reach the assembly stage. The math is unambiguous: 90 seconds of automated validation versus 34 minutes of manual listening to find the same problems.

One non-obvious benefit: the validation metrics became my feedback loop for improving the script writer and editor prompts. When I noticed that `TOO_FAST` flags clustered around segments with three or more technical terms in sequence, I added the speakability rule to the editor. When `SILENCE_HIGH` flags concentrated on sentences with em-dashes, I updated the script writer prompt to prefer shorter sentences with periods over complex sentences with dashes. The validator does not just catch defects -- it tells me where the upstream agents are producing content that TTS handles poorly.

## Lessons Learned

**Script quality determines everything.** I spent more time on the script writer prompt (8 versions) than on all other stages combined. Bad dialogue cannot be fixed by good audio.

**Shorter TTS segments sound dramatically better.** The 500-character split was the single biggest quality improvement. Anything over 60 words and prosody degrades noticeably.

**Two distinct voices are essential.** Same voice for both hosts is unlistenable after 3 minutes. "Onyx" and "nova" provide enough contrast to follow the conversation.

**The editor catches what the writer cannot see.** Across 12 episodes, the editor caught 47 monologue violations the writer produced despite explicit instructions to avoid them.

**Checkpoints save sanity.** At 300+ API calls per episode, failures happen. Without checkpoints, a crash at segment 280 means re-running everything. With them, you restart from the failed stage.

**Speakability is not readability.** Lists of technical terms, long compound sentences, and parenthetical asides all degrade TTS quality. The editor's speakability check was an afterthought that became essential.

## Try It

```bash
git clone https://github.com/krzemienski/agent-sdk-podcast-gen
cd agent-sdk-podcast-gen
pip install -r requirements.txt

export ANTHROPIC_API_KEY=your_key
export OPENAI_API_KEY=your_key

# Generate a 30-minute episode
python generate.py --topic "AI Code Review Automation" --duration 30

# Resume from checkpoint after a failure
python generate.py --topic "AI Code Review Automation" --resume
```

The companion repo includes the full pipeline, all five agent prompts, sample output episodes, and a `--dry-run` mode that runs stages 1-3 without TTS calls.

---

*Next, we shift back to development tooling: how AI agents handle database migrations without losing data.*

**Companion repo: [agent-sdk-podcast-gen](https://github.com/krzemienski/agent-sdk-podcast-gen)** -- Multi-agent podcast pipeline using Anthropic's Agent SDK with research, script, edit, TTS, and assembly stages. Includes checkpointing, crash recovery, and sample output episodes.
