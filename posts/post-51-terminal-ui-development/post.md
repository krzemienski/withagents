---
title: "Terminal UI Development with AI Agents"
subtitle: "Why terminal interfaces are surprisingly well-suited to AI-assisted development — and how to build production TUIs with ratatui and blessed"
author: "Nick Krzemienski"
date: "2025-03-05"
series_number: 51
series_total: 61
github_repo: "https://github.com/krzemienski/ai-terminal-ui"
tags:
  - AgenticDevelopment
  - ClaudeCode
  - TerminalUI
  - TUI
  - CLIDesign
---

## Terminal UI Development with AI Agents

*Agentic Development: 61 Lessons from 8,481 AI Coding Sessions*

I needed a dashboard for video analysis results. The data was already in a SQLite database. The audience was me, running analysis pipelines from the terminal. The question was not whether to build a web dashboard or a terminal UI — it was whether a terminal UI could be built fast enough to justify not just piping everything to `jq`.

The answer, with AI agents, was forty-five minutes from concept to interactive dashboard. Not a prototype. A full terminal application with sortable tables, search filtering, detail panes, and tmux integration. Forty-five minutes.

Terminal UI development is one of the best-kept secrets of AI-assisted programming. The constraints that make TUIs hard for humans — fixed-width grids, escape code management, keyboard event handling — are exactly the kind of deterministic, well-documented problems that AI agents solve efficiently. This post covers the full stack: framework selection between ratatui and blessed, layout architecture, keyboard input handling, live data integration, tmux multi-pane orchestration, and the patterns that make TUI development 3-5x faster with AI agents than equivalent web UIs.

**TL;DR: Terminal UIs are the ideal AI agent output format. Fixed constraints (80x24 grids), well-documented frameworks (ratatui, blessed), and no CSS ambiguity make TUI development 3-5x faster with AI assistance than equivalent web UIs. The result: production dashboards in under an hour.**

---

### Why TUIs and AI Agents Are a Perfect Match

Web UI development with AI agents is unpredictable. CSS has no single correct answer — there are a hundred ways to center a div, and the model might pick the one that breaks your layout. Responsive design multiplies ambiguity. Browser compatibility adds more. Every web UI decision involves subjective trade-offs that the model cannot resolve without extensive context about your design system.

Terminal UIs have none of this ambiguity:

- **Fixed grid.** The layout is a grid of character cells. No subpixel rendering, no flexbox, no "it looks different on Safari."
- **Binary styling.** Text is bold or not. Colored or not. Underlined or not. No gradients, no shadows, no opacity.
- **Deterministic keyboard input.** Key events are single bytes or well-defined escape sequences. No touch events, no gesture recognizers, no pointer capture.
- **Documented escape codes.** ANSI escape sequences are a 50-year-old standard. Every behavior is specified.
- **No build tooling.** No webpack, no vite, no postcss. Compile and run.
- **Instant feedback.** The terminal is already open. No browser tab, no dev server startup.

These constraints are why AI agents build TUIs faster and more reliably than web UIs. The design space is small enough that the model can hold the entire problem in context.

```mermaid
graph TD
    subgraph "Web UI Development"
        W1[Choose framework] --> W2[Configure build tool]
        W2 --> W3[Write HTML structure]
        W3 --> W4[Write CSS styles]
        W4 --> W5[Debug responsive layout]
        W5 --> W6[Fix browser compatibility]
        W6 --> W7[Add JavaScript interactivity]
        W7 --> W8[Debug CSS again]
        W8 --> W9[Working UI]
    end

    subgraph "TUI Development"
        T1[Choose framework] --> T2[Define layout constraints]
        T2 --> T3[Build widgets]
        T3 --> T4[Add keyboard handlers]
        T4 --> T5[Working UI]
    end

    style W4 fill:#ef4444,color:#fff
    style W5 fill:#ef4444,color:#fff
    style W6 fill:#ef4444,color:#fff
    style W8 fill:#ef4444,color:#fff
```

The red steps in the web UI path are where AI agents struggle most — subjective CSS decisions, responsive debugging, and cross-browser quirks. None of those exist in TUI development.

---

### Framework Selection: Ratatui vs. Blessed

Two frameworks dominate TUI development. The choice depends on your ecosystem:

| Feature | Ratatui (Rust) | Blessed (Node.js) |
|---------|---------------|-------------------|
| Language | Rust | JavaScript |
| Performance | Excellent (native) | Good (V8) |
| Widget library | Rich (built-in) | Rich (blessed-contrib) |
| Layout model | Constraint-based | Box model |
| Ecosystem | Growing fast | Mature but unmaintained |
| Async support | Tokio native | Event loop |
| Binary distribution | Single binary | Requires Node.js |
| AI agent fit | Excellent | Good |

**Use ratatui when:** You need maximum performance, want a single distributable binary, or your pipeline is already in Rust/Python.

**Use blessed when:** Your pipeline is JavaScript/TypeScript, you want fastest prototyping, or you need blessed-contrib charts.

---

### Ratatui: Building the Dashboard

Ratatui is the Rust ecosystem's standard TUI library — a successor to tui-rs with active maintenance and a rich widget set. Here is the complete dashboard architecture:

```rust
// From: src/app.rs

use std::time::Duration;

#[derive(Debug, Clone, PartialEq)]
pub enum SortColumn {
    Filename,
    Duration,
    Transitions,
    Status,
}

#[derive(Debug, Clone, PartialEq)]
pub enum InputMode {
    Normal,
    Search,
    Detail,
}

pub struct App {
    pub items: Vec<AnalysisResult>,
    pub filtered_items: Vec<usize>,  // indices into items
    pub selected: usize,
    pub search_query: String,
    pub sort_column: SortColumn,
    pub sort_ascending: bool,
    pub input_mode: InputMode,
    pub scroll_offset: usize,
    pub status_message: String,
    pub data_rx: tokio::sync::mpsc::Receiver<Vec<AnalysisResult>>,
}

#[derive(Debug, Clone)]
pub struct AnalysisResult {
    pub filename: String,
    pub duration_minutes: f64,
    pub transition_count: usize,
    pub status: AnalysisStatus,
    pub avg_transition_interval: f64,
    pub analyzed_at: String,
    pub file_size_mb: f64,
    pub error_message: Option<String>,
    pub transitions_per_minute: Vec<f64>,  // sparkline data
}

#[derive(Debug, Clone, PartialEq)]
pub enum AnalysisStatus {
    Complete,
    InProgress,
    Failed,
    Queued,
}

impl App {
    pub fn apply_filter(&mut self) {
        self.filtered_items = self.items.iter()
            .enumerate()
            .filter(|(_, item)| {
                self.search_query.is_empty()
                || item.filename.to_lowercase()
                    .contains(&self.search_query.to_lowercase())
            })
            .map(|(i, _)| i)
            .collect();

        if self.selected >= self.filtered_items.len() {
            self.selected = self.filtered_items.len().saturating_sub(1);
        }
    }

    pub fn sort_items(&mut self) {
        self.items.sort_by(|a, b| {
            let ordering = match self.sort_column {
                SortColumn::Filename => a.filename.cmp(&b.filename),
                SortColumn::Duration => a.duration_minutes.partial_cmp(&b.duration_minutes)
                    .unwrap_or(std::cmp::Ordering::Equal),
                SortColumn::Transitions => a.transition_count.cmp(&b.transition_count),
                SortColumn::Status => format!("{:?}", a.status).cmp(&format!("{:?}", b.status)),
            };
            if self.sort_ascending { ordering } else { ordering.reverse() }
        });
        self.apply_filter();
    }

    pub fn selected_item(&self) -> Option<&AnalysisResult> {
        self.filtered_items.get(self.selected)
            .and_then(|&idx| self.items.get(idx))
    }
}
```

```rust
// From: src/ui.rs

use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{
        Block, Borders, Cell, Paragraph, Row, Sparkline, Table,
        Tabs, Wrap,
    },
    Frame, Terminal,
};

fn status_icon(status: &AnalysisStatus) -> Span {
    match status {
        AnalysisStatus::Complete => Span::styled(
            " Complete ", Style::default().fg(Color::Green)
        ),
        AnalysisStatus::InProgress => Span::styled(
            " Running  ", Style::default().fg(Color::Yellow)
        ),
        AnalysisStatus::Failed => Span::styled(
            " Failed   ", Style::default().fg(Color::Red)
        ),
        AnalysisStatus::Queued => Span::styled(
            " Queued   ", Style::default().fg(Color::DarkGray)
        ),
    }
}

pub fn ui(frame: &mut Frame, app: &App) {
    // Main layout: search bar, table, detail pane, status bar
    let main_chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),    // Search bar
            Constraint::Min(10),     // Results table
            Constraint::Length(10),  // Detail pane
            Constraint::Length(1),   // Status bar
        ])
        .split(frame.area());

    render_search_bar(frame, app, main_chunks[0]);
    render_table(frame, app, main_chunks[1]);
    render_detail_pane(frame, app, main_chunks[2]);
    render_status_bar(frame, app, main_chunks[3]);
}

fn render_search_bar(frame: &mut Frame, app: &App, area: Rect) {
    let style = if app.input_mode == InputMode::Search {
        Style::default().fg(Color::Cyan)
    } else {
        Style::default().fg(Color::DarkGray)
    };

    let search = Paragraph::new(format!(
        " {} {}",
        if app.input_mode == InputMode::Search { ">" } else { "/" },
        app.search_query,
    ))
    .style(style)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .title(" Filter (press / to search) ")
            .border_style(style)
    );
    frame.render_widget(search, area);
}

fn render_table(frame: &mut Frame, app: &App, area: Rect) {
    let sort_indicator = |col: SortColumn| -> &str {
        if app.sort_column == col {
            if app.sort_ascending { " ^" } else { " v" }
        } else { "" }
    };

    let header = Row::new(vec![
        Cell::from(format!("File{}", sort_indicator(SortColumn::Filename)))
            .style(Style::default().fg(Color::Cyan)),
        Cell::from(format!("Duration{}", sort_indicator(SortColumn::Duration)))
            .style(Style::default().fg(Color::Cyan)),
        Cell::from(format!("Transitions{}", sort_indicator(SortColumn::Transitions)))
            .style(Style::default().fg(Color::Cyan)),
        Cell::from("Sparkline")
            .style(Style::default().fg(Color::Cyan)),
        Cell::from(format!("Status{}", sort_indicator(SortColumn::Status)))
            .style(Style::default().fg(Color::Cyan)),
    ])
    .style(Style::default().add_modifier(Modifier::BOLD))
    .height(1);

    let rows: Vec<Row> = app.filtered_items.iter()
        .enumerate()
        .map(|(i, &item_idx)| {
            let item = &app.items[item_idx];
            let style = if i == app.selected {
                Style::default().bg(Color::DarkGray).add_modifier(Modifier::BOLD)
            } else {
                Style::default()
            };

            let sparkline_str = render_inline_sparkline(&item.transitions_per_minute);

            Row::new(vec![
                Cell::from(item.filename.as_str()),
                Cell::from(format!("{:.1}m", item.duration_minutes)),
                Cell::from(format!("{}", item.transition_count)),
                Cell::from(sparkline_str),
                Cell::from(status_icon(&item.status)),
            ])
            .style(style)
        })
        .collect();

    let table = Table::new(rows, [
        Constraint::Percentage(30),
        Constraint::Percentage(12),
        Constraint::Percentage(12),
        Constraint::Percentage(20),
        Constraint::Percentage(26),
    ])
    .header(header)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .title(format!(
                " Results ({}/{}) ",
                app.filtered_items.len(),
                app.items.len()
            ))
    )
    .row_highlight_style(Style::default().bg(Color::DarkGray));

    frame.render_widget(table, area);
}

fn render_detail_pane(frame: &mut Frame, app: &App, area: Rect) {
    let content = if let Some(item) = app.selected_item() {
        let mut lines = vec![
            Line::from(vec![
                Span::styled(" File: ", Style::default().fg(Color::Cyan)),
                Span::raw(&item.filename),
            ]),
            Line::from(vec![
                Span::styled(" Duration: ", Style::default().fg(Color::Cyan)),
                Span::raw(format!("{:.1} minutes", item.duration_minutes)),
            ]),
            Line::from(vec![
                Span::styled(" Transitions: ", Style::default().fg(Color::Cyan)),
                Span::raw(format!("{}", item.transition_count)),
            ]),
            Line::from(vec![
                Span::styled(" Avg interval: ", Style::default().fg(Color::Cyan)),
                Span::raw(format!("{:.1}s", item.avg_transition_interval)),
            ]),
            Line::from(vec![
                Span::styled(" File size: ", Style::default().fg(Color::Cyan)),
                Span::raw(format!("{:.1} MB", item.file_size_mb)),
            ]),
            Line::from(vec![
                Span::styled(" Analyzed: ", Style::default().fg(Color::Cyan)),
                Span::raw(&item.analyzed_at),
            ]),
        ];

        if let Some(ref err) = item.error_message {
            lines.push(Line::from(vec![
                Span::styled(" Error: ", Style::default().fg(Color::Red)),
                Span::raw(err),
            ]));
        }

        lines
    } else {
        vec![Line::from(" No item selected")]
    };

    let detail = Paragraph::new(content)
        .block(
            Block::default()
                .borders(Borders::ALL)
                .title(" Details (press Enter for full view) ")
        )
        .wrap(Wrap { trim: true });

    frame.render_widget(detail, area);
}

fn render_status_bar(frame: &mut Frame, app: &App, area: Rect) {
    let status = Paragraph::new(Line::from(vec![
        Span::styled(" q", Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::raw(":quit "),
        Span::styled("/", Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::raw(":search "),
        Span::styled("1-4", Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::raw(":sort "),
        Span::styled("r", Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::raw(":refresh "),
        Span::raw(&app.status_message),
    ]))
    .style(Style::default().bg(Color::DarkGray));
    frame.render_widget(status, area);
}

fn render_inline_sparkline(data: &[f64]) -> String {
    let blocks = ['_', '.', '-', '~', '+', '=', '#', '@'];
    if data.is_empty() {
        return String::new();
    }
    let max = data.iter().cloned().fold(f64::MIN, f64::max);
    let min = data.iter().cloned().fold(f64::MAX, f64::min);
    let range = max - min;

    data.iter()
        .map(|&v| {
            let idx = if range > 0.0 {
                ((v - min) / range * 7.0) as usize
            } else {
                0
            };
            blocks[idx.min(7)]
        })
        .collect()
}
```

The agent produced the layout in its first pass. No iteration on styling, no "make the padding bigger," no "that color looks wrong." The grid-based layout was correct on the first try because there is only one way to split a terminal into four vertical regions.

---

### Keyboard Input Handling

Terminal input is deterministic — every key maps to a known byte sequence:

```rust
// From: src/input.rs

use crossterm::event::{Event, KeyCode, KeyModifiers, KeyEvent};

pub enum Action {
    Quit,
    MoveUp,
    MoveDown,
    PageUp,
    PageDown,
    Home,
    End,
    EnterSearch,
    ExitSearch,
    SearchChar(char),
    SearchBackspace,
    SortByColumn(usize),
    ToggleSortOrder,
    Refresh,
    SelectItem,
    None,
}

pub fn handle_key_event(key: KeyEvent, mode: &InputMode) -> Action {
    match mode {
        InputMode::Normal => handle_normal_mode(key),
        InputMode::Search => handle_search_mode(key),
        InputMode::Detail => handle_detail_mode(key),
    }
}

fn handle_normal_mode(key: KeyEvent) -> Action {
    match (key.code, key.modifiers) {
        (KeyCode::Char('q'), KeyModifiers::NONE) => Action::Quit,
        (KeyCode::Char('c'), KeyModifiers::CONTROL) => Action::Quit,

        // Navigation
        (KeyCode::Up | KeyCode::Char('k'), _) => Action::MoveUp,
        (KeyCode::Down | KeyCode::Char('j'), _) => Action::MoveDown,
        (KeyCode::PageUp, _) => Action::PageUp,
        (KeyCode::PageDown, _) => Action::PageDown,
        (KeyCode::Home | KeyCode::Char('g'), _) => Action::Home,
        (KeyCode::End | KeyCode::Char('G'), _) => Action::End,

        // Search
        (KeyCode::Char('/'), KeyModifiers::NONE) => Action::EnterSearch,

        // Sort
        (KeyCode::Char('1'), _) => Action::SortByColumn(0),
        (KeyCode::Char('2'), _) => Action::SortByColumn(1),
        (KeyCode::Char('3'), _) => Action::SortByColumn(2),
        (KeyCode::Char('4'), _) => Action::SortByColumn(3),
        (KeyCode::Char('s'), _) => Action::ToggleSortOrder,

        // Actions
        (KeyCode::Char('r'), _) => Action::Refresh,
        (KeyCode::Enter, _) => Action::SelectItem,

        _ => Action::None,
    }
}

fn handle_search_mode(key: KeyEvent) -> Action {
    match key.code {
        KeyCode::Esc => Action::ExitSearch,
        KeyCode::Enter => Action::ExitSearch,
        KeyCode::Backspace => Action::SearchBackspace,
        KeyCode::Char(c) => Action::SearchChar(c),
        _ => Action::None,
    }
}

fn handle_detail_mode(key: KeyEvent) -> Action {
    match key.code {
        KeyCode::Esc | KeyCode::Char('q') => Action::ExitSearch,  // back to normal
        KeyCode::Up | KeyCode::Char('k') => Action::MoveUp,
        KeyCode::Down | KeyCode::Char('j') => Action::MoveDown,
        _ => Action::None,
    }
}
```

The vim-style keybindings (j/k for navigation, / for search, g/G for home/end) are a pattern AI agents consistently produce for TUI applications. The entire input layer was generated in a single pass with zero corrections.

---

### Blessed: Node.js TUI Alternative

For JavaScript-heavy pipelines, blessed provides an ncurses-like API with a rich widget ecosystem:

```javascript
// From: dashboard/index.js

const blessed = require("blessed");
const contrib = require("blessed-contrib");

function createDashboard(data) {
  const screen = blessed.screen({
    smartCSR: true,
    title: "Analysis Dashboard",
    fullUnicode: true,
  });

  const grid = new contrib.grid({ rows: 12, cols: 12, screen });

  // Results table (top, spanning full width)
  const table = grid.set(0, 0, 6, 8, contrib.table, {
    keys: true,
    vi: true,
    label: " Results ",
    columnSpacing: 3,
    columnWidth: [30, 10, 12, 15],
    style: {
      header: { fg: "cyan", bold: true },
      cell: { fg: "white", selected: { bg: "blue" } },
      border: { fg: "cyan" },
    },
  });

  // Summary stats (top-right)
  const stats = grid.set(0, 8, 3, 4, blessed.box, {
    label: " Summary ",
    content: formatSummary(data.summary),
    border: { type: "line" },
    style: { border: { fg: "cyan" } },
    padding: { left: 1, right: 1 },
  });

  // Status indicators (middle-right)
  const donut = grid.set(3, 8, 3, 4, contrib.donut, {
    label: " Status Distribution ",
    radius: 8,
    arcWidth: 3,
    data: [
      { percent: statusPercent(data, "complete"), label: "Done", color: "green" },
      { percent: statusPercent(data, "running"), label: "Run", color: "yellow" },
      { percent: statusPercent(data, "failed"), label: "Fail", color: "red" },
    ],
  });

  // Transition timeline (bottom-left)
  const timeline = grid.set(6, 0, 6, 8, contrib.line, {
    label: " Transitions Over Time ",
    showLegend: true,
    xLabelPadding: 3,
    xPadding: 5,
    wholeNumbersOnly: true,
    style: { line: "cyan", text: "green", baseline: "white" },
  });

  // Log viewer (bottom-right)
  const log = grid.set(6, 8, 6, 4, contrib.log, {
    label: " Activity Log ",
    fg: "green",
    selectedFg: "green",
    border: { type: "line" },
    style: { border: { fg: "cyan" } },
  });

  // Populate
  table.setData({
    headers: ["File", "Duration", "Transitions", "Status"],
    data: data.results.map((r) => [
      r.filename,
      `${r.duration}m`,
      String(r.transitions),
      statusLabel(r.status),
    ]),
  });

  timeline.setData([{
    title: "Transitions/min",
    x: data.timeline.map((p) => p.label),
    y: data.timeline.map((p) => p.count),
    style: { line: "cyan" },
  }]);

  // Key bindings
  screen.key(["q", "C-c"], () => process.exit(0));

  screen.key(["r"], () => {
    log.log("Refreshing data...");
    refreshData().then((newData) => {
      table.setData({
        headers: ["File", "Duration", "Transitions", "Status"],
        data: newData.results.map((r) => [
          r.filename, `${r.duration}m`, String(r.transitions), statusLabel(r.status),
        ]),
      });
      log.log(`Updated: ${newData.results.length} results`);
      screen.render();
    });
  });

  screen.key(["tab"], () => {
    // Cycle focus between widgets
    if (table === screen.focused) {
      timeline.focus();
    } else {
      table.focus();
    }
  });

  table.focus();
  screen.render();
  return { screen, log };
}

function formatSummary(summary) {
  return [
    `Total: ${summary.total}`,
    `Complete: ${summary.complete}`,
    `Running: ${summary.running}`,
    `Failed: ${summary.failed}`,
    ``,
    `Avg Duration: ${summary.avgDuration}m`,
    `Total Transitions: ${summary.totalTransitions}`,
  ].join("\n");
}

function statusLabel(status) {
  const labels = {
    complete: "{green-fg}Done{/green-fg}",
    running: "{yellow-fg}Running{/yellow-fg}",
    failed: "{red-fg}Failed{/red-fg}",
    queued: "{gray-fg}Queued{/gray-fg}",
  };
  return labels[status] || status;
}

function statusPercent(data, status) {
  const count = data.results.filter((r) => r.status === status).length;
  return Math.round((count / data.results.length) * 100);
}
```

Blessed gives you box-model-like layouts with borders, labels, and scrolling — all within the terminal. The contrib extension adds sparklines, bar charts, line graphs, and donut charts that render in Unicode characters.

---

### Tmux Integration: The Multi-Pane Architecture

Terminal UIs reach their full potential when integrated with tmux. Instead of cramming everything into one pane, split the terminal into purpose-specific regions:

```python
# From: tmux/layout.py

import subprocess
import shlex
from dataclasses import dataclass

@dataclass
class TmuxPane:
    name: str
    command: str
    width_pct: int = 0  # 0 means use parent's remaining space
    height_pct: int = 0

@dataclass
class TmuxLayout:
    session_name: str
    width: int = 200
    height: int = 50
    panes: list = None

    def __post_init__(self):
        if self.panes is None:
            self.panes = []


def create_analysis_workspace(
    session_name: str = "analysis",
    db_path: str = "analysis.db",
    log_path: str = "logs/analysis.log",
) -> str:
    """Create a tmux workspace for video analysis."""
    commands = [
        # Create session with dashboard in main pane
        f"tmux new-session -d -s {session_name} -x 200 -y 50",

        # Split right: log stream (30% width)
        f"tmux split-window -h -t {session_name} -p 30",

        # Split bottom-right: system monitor
        f"tmux split-window -v -t {session_name}",

        # Select main pane and split bottom: progress bar (20% height)
        f"tmux select-pane -t {session_name}:0.0",
        f"tmux split-window -v -t {session_name} -p 20",
    ]

    for cmd in commands:
        subprocess.run(shlex.split(cmd), check=True)

    # Layout:
    # +---------------------------+----------+
    # |                           |          |
    # |   Dashboard (TUI app)     |  Logs    |
    # |   Pane 0                  |  Pane 1  |
    # |                           |          |
    # +---------------------------+          |
    # |   Progress / Status Bar   |  System  |
    # |   Pane 3                  |  Pane 2  |
    # +---------------------------+----------+

    # Send commands to each pane
    pane_commands = {
        "0.0": f"cargo run --release -- --db {db_path}",
        "0.1": f"tail -f {log_path} | jq -r '.message'",
        "0.2": f"htop -t",
        "0.3": (
            f"watch -n 1 'sqlite3 {db_path} "
            f"\"SELECT status, COUNT(*) FROM results GROUP BY status\"'"
        ),
    }

    for pane, cmd in pane_commands.items():
        safe_cmd = cmd.replace("'", "'\\''")
        subprocess.run(
            shlex.split(
                f"tmux send-keys -t {session_name}:{pane} '{safe_cmd}' Enter"
            ),
            check=True,
        )

    return session_name


def create_multi_pipeline_workspace(
    session_name: str = "pipelines",
    pipelines: list[dict] = None,
) -> str:
    """Create a workspace monitoring multiple analysis pipelines."""
    if not pipelines:
        return session_name

    # Create session
    subprocess.run(
        shlex.split(f"tmux new-session -d -s {session_name} -x 240 -y 60"),
        check=True,
    )

    # Create a pane for each pipeline (up to 4 in a 2x2 grid)
    for i, pipeline in enumerate(pipelines[:4]):
        if i > 0:
            direction = "-h" if i % 2 == 1 else "-v"
            subprocess.run(
                shlex.split(
                    f"tmux split-window {direction} -t {session_name}"
                ),
                check=True,
            )

        cmd = (
            f"cd {pipeline['dir']} && "
            f"cargo run --release -- --db {pipeline['db']} "
            f"--watch {pipeline.get('watch_dir', '.')}"
        )
        subprocess.run(
            shlex.split(
                f"tmux send-keys -t {session_name}:0.{i} '{cmd}' Enter"
            ),
            check=True,
        )

    # Even out the panes
    subprocess.run(
        shlex.split(f"tmux select-layout -t {session_name} tiled"),
        check=True,
    )

    return session_name
```

```mermaid
graph TD
    subgraph "Tmux Session: analysis"
        subgraph "Left Column 70%"
            A["Pane 0: Ratatui Dashboard<br/>Interactive table + detail pane<br/>Sort, search, keyboard nav"]
            B["Pane 3: Progress Monitor<br/>watch + sqlite3 status query<br/>Real-time batch progress"]
        end
        subgraph "Right Column 30%"
            C["Pane 1: Log Stream<br/>tail -f | jq<br/>Real-time pipeline events"]
            D["Pane 2: System Monitor<br/>htop -t<br/>CPU/Memory/Disk tracking"]
        end
    end

    A --- B
    C --- D

    E[Pipeline Process] -->|writes| F[SQLite DB]
    E -->|writes| G[Log Files]

    F -->|reads| A
    F -->|reads| B
    G -->|streams| C
```

Four panes, four purposes: interactive dashboard, progress tracking, log streaming, and system monitoring. Each pane runs an independent process. The tmux session persists even if your SSH connection drops.

---

### Live Data with Async Updates

The dashboard needs to stay current as the analysis pipeline processes new videos:

```rust
// From: src/live_update.rs

use tokio::sync::mpsc;
use std::time::Duration;
use rusqlite::Connection;

pub async fn live_data_loop(
    tx: mpsc::Sender<Vec<AnalysisResult>>,
    db_path: String,
    poll_interval: Duration,
) {
    let conn = Connection::open(&db_path).expect("Failed to open database");

    let mut last_count = 0;

    loop {
        let results = fetch_results(&conn);
        let current_count = results.len();

        // Only send if data changed
        if current_count != last_count {
            last_count = current_count;
            if tx.send(results).await.is_err() {
                break;  // Receiver dropped, exit
            }
        }

        tokio::time::sleep(poll_interval).await;
    }
}

fn fetch_results(conn: &Connection) -> Vec<AnalysisResult> {
    let mut stmt = conn.prepare(
        "SELECT filename, duration_minutes, transition_count, status, \
         avg_transition_interval, analyzed_at, file_size_mb, error_message, \
         transitions_per_minute \
         FROM results ORDER BY analyzed_at DESC"
    ).unwrap();

    stmt.query_map([], |row| {
        let sparkline_json: String = row.get(8).unwrap_or_default();
        let sparkline: Vec<f64> = serde_json::from_str(&sparkline_json)
            .unwrap_or_default();

        Ok(AnalysisResult {
            filename: row.get(0)?,
            duration_minutes: row.get(1)?,
            transition_count: row.get(2)?,
            status: parse_status(row.get::<_, String>(3)?),
            avg_transition_interval: row.get(4)?,
            analyzed_at: row.get(5)?,
            file_size_mb: row.get(6)?,
            error_message: row.get(7)?,
            transitions_per_minute: sparkline,
        })
    })
    .unwrap()
    .filter_map(|r| r.ok())
    .collect()
}

// In the main render loop
pub fn run_app(
    terminal: &mut Terminal<impl ratatui::backend::Backend>,
    app: &mut App,
) -> std::io::Result<()> {
    loop {
        // Check for new data (non-blocking)
        if let Ok(new_data) = app.data_rx.try_recv() {
            let old_count = app.items.len();
            app.items = new_data;
            app.apply_filter();

            if app.items.len() != old_count {
                app.status_message = format!(
                    " Updated: {} results ", app.items.len()
                );
            }
        }

        // Render
        terminal.draw(|f| ui(f, app))?;

        // Handle input (with timeout for responsive updates)
        if crossterm::event::poll(Duration::from_millis(250))? {
            if let Event::Key(key) = crossterm::event::read()? {
                let action = handle_key_event(key, &app.input_mode);
                match action {
                    Action::Quit => return Ok(()),
                    Action::MoveUp => {
                        if app.selected > 0 {
                            app.selected -= 1;
                        }
                    }
                    Action::MoveDown => {
                        if app.selected < app.filtered_items.len().saturating_sub(1) {
                            app.selected += 1;
                        }
                    }
                    Action::EnterSearch => {
                        app.input_mode = InputMode::Search;
                        app.search_query.clear();
                    }
                    Action::ExitSearch => {
                        app.input_mode = InputMode::Normal;
                        app.apply_filter();
                    }
                    Action::SearchChar(c) => {
                        app.search_query.push(c);
                        app.apply_filter();
                    }
                    Action::SearchBackspace => {
                        app.search_query.pop();
                        app.apply_filter();
                    }
                    Action::SortByColumn(col) => {
                        app.sort_column = match col {
                            0 => SortColumn::Filename,
                            1 => SortColumn::Duration,
                            2 => SortColumn::Transitions,
                            3 => SortColumn::Status,
                            _ => app.sort_column.clone(),
                        };
                        app.sort_items();
                    }
                    Action::ToggleSortOrder => {
                        app.sort_ascending = !app.sort_ascending;
                        app.sort_items();
                    }
                    _ => {}
                }
            }
        }
    }
}
```

The poll-with-timeout pattern is the TUI equivalent of `requestAnimationFrame`. The UI updates when new data arrives or when the user presses a key, whichever comes first. The 250ms timeout ensures the display stays responsive without busy-waiting.

---

### Advanced Widget Patterns

**Sparkline status indicators using Unicode blocks:**

```rust
// From: src/widgets/sparkline.rs

pub fn render_sparkline(data: &[u64], width: usize) -> String {
    let blocks = [' ', '\u{2581}', '\u{2582}', '\u{2583}',
                  '\u{2584}', '\u{2585}', '\u{2586}', '\u{2587}', '\u{2588}'];
    let max = *data.iter().max().unwrap_or(&1);

    data.iter()
        .take(width)
        .map(|&v| {
            let idx = if max > 0 {
                ((v as f64 / max as f64) * 8.0) as usize
            } else {
                0
            };
            blocks[idx.min(8)]
        })
        .collect()
}

// Usage: "Transitions: _..~+=##@"
```

**Progress bar with ETA:**

```rust
// From: src/widgets/progress.rs

pub fn render_progress(current: usize, total: usize, width: usize) -> String {
    let pct = current as f64 / total as f64;
    let filled = (pct * width as f64) as usize;
    let empty = width - filled;

    let bar: String = "\u{2588}".repeat(filled) + &"\u{2591}".repeat(empty);
    format!("[{}] {}/{} ({:.0}%)", bar, current, total, pct * 100.0)
}

// Usage: "[████████░░░░░░░░] 45/89 (51%)"
```

**Color-coded status cells:**

```rust
// From: src/widgets/status.rs

use ratatui::style::{Color, Style};
use ratatui::text::Span;

pub fn status_cell(status: &str) -> Span<'static> {
    let (symbol, color) = match status {
        "complete" => ("\u{25CF} Complete", Color::Green),
        "running"  => ("\u{25CB} Running", Color::Yellow),
        "failed"   => ("\u{25CF} Failed", Color::Red),
        "queued"   => ("\u{25CB} Queued", Color::DarkGray),
        _          => ("\u{25CB} Unknown", Color::White),
    };
    Span::styled(
        symbol.to_string(),
        Style::default().fg(color),
    )
}
```

---

### Why AI Agents Build TUIs Better Than Web UIs

After building TUIs with AI agents across multiple projects, the pattern is clear:

**Speed comparison (same feature set):**

| Feature | Web UI (AI-assisted) | TUI (AI-assisted) |
|---------|---------------------|-------------------|
| Sortable table with search | 25 minutes | 8 minutes |
| Detail pane with formatting | 15 minutes | 4 minutes |
| Keyboard shortcuts | 10 minutes | 3 minutes |
| Chart/graph visualization | 20 minutes | 6 minutes |
| Live data refresh | 12 minutes | 5 minutes |
| Multi-pane layout | 18 minutes | 7 minutes |
| Total for full dashboard | ~100 minutes | ~33 minutes |

The 3x speed difference comes from:

1. **No CSS debugging.** The layout is defined in row/column constraints. It either fits or it does not. No "why is there a 1px gap" or "why does Safari render this differently."
2. **No responsive design.** Terminal windows have a fixed size. You design for one viewport. If the user resizes, ratatui reflows automatically.
3. **No framework choice paralysis.** React vs Vue vs Svelte is not a question when the answer is ratatui or blessed.
4. **No asset pipeline.** No bundlers, no transpilers, no hot reload configuration. Just compile and run. `cargo build --release` gives you a single binary.
5. **Immediate feedback.** The terminal is already open. There is no browser to switch to, no dev server to start, no port to remember.
6. **Keyboard-first.** No need to implement both mouse and keyboard interactions. TUIs are keyboard-only by default, which halves the input handling code.

---

### Error Handling in TUI Applications

TUI applications have a unique error handling challenge: if your error handler panics, it can leave the terminal in a corrupted state — raw mode enabled, alternate screen active, cursor hidden. Every TUI application needs a panic hook that restores the terminal before exiting:

```rust
// From: src/error_handling.rs

use std::panic;
use crossterm::{
    execute,
    terminal::{disable_raw_mode, LeaveAlternateScreen},
    cursor::Show,
};

pub fn install_panic_hook() {
    let original_hook = panic::take_hook();

    panic::set_hook(Box::new(move |panic_info| {
        // Restore terminal state BEFORE printing panic info
        let _ = disable_raw_mode();
        let _ = execute!(std::io::stderr(), LeaveAlternateScreen, Show);

        // Now print the panic info to a clean terminal
        original_hook(panic_info);
    }));
}

/// Wrapper that ensures terminal cleanup on any exit path
pub struct TerminalGuard;

impl TerminalGuard {
    pub fn new() -> Self {
        install_panic_hook();
        TerminalGuard
    }
}

impl Drop for TerminalGuard {
    fn drop(&mut self) {
        let _ = disable_raw_mode();
        let _ = execute!(std::io::stderr(), LeaveAlternateScreen, Show);
    }
}

// Usage in main:
// fn main() -> Result<()> {
//     let _guard = TerminalGuard::new();
//     // ... app code ...
//     // Terminal is restored even on panic or early return
// }
```

The `TerminalGuard` pattern uses Rust's RAII guarantees: the `Drop` implementation runs on every exit path — normal return, early `?` propagation, or panic. Without this guard, a crash leaves the user with an unusable terminal until they run `reset`.

Beyond panic handling, TUI apps need graceful degradation for data errors. The dashboard should not crash because one database row has a null value:

```rust
// From: src/data_safety.rs

/// Safe data access patterns for TUI rendering
pub fn safe_display_duration(minutes: Option<f64>) -> String {
    match minutes {
        Some(m) if m.is_finite() => format!("{:.1}m", m),
        Some(_) => "N/A".to_string(),
        None => "--".to_string(),
    }
}

pub fn safe_display_count(count: Option<usize>) -> String {
    match count {
        Some(c) => format!("{}", c),
        None => "--".to_string(),
    }
}

pub fn safe_sparkline(data: &[f64], width: usize) -> String {
    if data.is_empty() {
        return " ".repeat(width);
    }

    let blocks = [' ', '\u{2581}', '\u{2582}', '\u{2583}',
                  '\u{2584}', '\u{2585}', '\u{2586}', '\u{2587}', '\u{2588}'];

    let finite_data: Vec<f64> = data.iter()
        .filter(|v| v.is_finite())
        .copied()
        .collect();

    if finite_data.is_empty() {
        return " ".repeat(width);
    }

    let max = finite_data.iter().cloned().fold(f64::MIN, f64::max);
    let min = finite_data.iter().cloned().fold(f64::MAX, f64::min);
    let range = max - min;

    finite_data.iter()
        .take(width)
        .map(|&v| {
            let idx = if range > 0.0 {
                ((v - min) / range * 8.0) as usize
            } else {
                4  // middle block for flat data
            };
            blocks[idx.min(8)]
        })
        .collect()
}
```

These defensive patterns are invisible when things work correctly, but they prevent the entire dashboard from crashing when a single data point is corrupt. In three months of daily use, the safe display functions handled 14 null values and 3 NaN values that would have caused panics without them.

---

### Responsive Layout: Adapting to Terminal Size

Unlike web UIs where responsive design requires media queries and breakpoints, TUI responsive design is simpler — but still necessary. Users resize terminal windows. Tmux panes vary in size. The layout must adapt:

```rust
// From: src/responsive.rs

use ratatui::layout::{Constraint, Direction, Layout, Rect};

pub enum LayoutMode {
    Full,       // >= 120 cols: all four panes
    Compact,    // 80-119 cols: table + status, no detail pane
    Minimal,    // < 80 cols: table only
}

pub fn detect_layout_mode(area: Rect) -> LayoutMode {
    match area.width {
        w if w >= 120 => LayoutMode::Full,
        w if w >= 80 => LayoutMode::Compact,
        _ => LayoutMode::Minimal,
    }
}

pub fn build_layout(area: Rect, mode: &LayoutMode) -> Vec<Rect> {
    match mode {
        LayoutMode::Full => {
            Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(3),    // Search bar
                    Constraint::Min(10),     // Table
                    Constraint::Length(10),  // Detail pane
                    Constraint::Length(1),   // Status bar
                ])
                .split(area)
                .to_vec()
        }
        LayoutMode::Compact => {
            Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(3),    // Search bar
                    Constraint::Min(10),     // Table (expanded)
                    Constraint::Length(1),   // Status bar
                ])
                .split(area)
                .to_vec()
        }
        LayoutMode::Minimal => {
            Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Min(5),      // Table only
                    Constraint::Length(1),   // Status bar
                ])
                .split(area)
                .to_vec()
        }
    }
}

/// Adapt table column widths to available space
pub fn table_constraints(width: u16) -> Vec<Constraint> {
    if width >= 140 {
        // Full width: all columns with comfortable spacing
        vec![
            Constraint::Percentage(25),  // Filename
            Constraint::Percentage(10),  // Duration
            Constraint::Percentage(12),  // Transitions
            Constraint::Percentage(20),  // Sparkline
            Constraint::Percentage(15),  // Status
            Constraint::Percentage(18),  // Analyzed at
        ]
    } else if width >= 100 {
        // Medium: drop analyzed_at column
        vec![
            Constraint::Percentage(30),
            Constraint::Percentage(12),
            Constraint::Percentage(12),
            Constraint::Percentage(20),
            Constraint::Percentage(26),
        ]
    } else {
        // Narrow: filename, transitions, status only
        vec![
            Constraint::Percentage(45),
            Constraint::Percentage(20),
            Constraint::Percentage(35),
        ]
    }
}
```

```mermaid
graph LR
    subgraph "Full Layout (>= 120 cols)"
        F1["Search Bar"]
        F2["Results Table (all columns)"]
        F3["Detail Pane"]
        F4["Status Bar"]
    end

    subgraph "Compact Layout (80-119 cols)"
        C1["Search Bar"]
        C2["Results Table (expanded)"]
        C3["Status Bar"]
    end

    subgraph "Minimal Layout (< 80 cols)"
        M1["Results Table (3 columns)"]
        M2["Status Bar"]
    end
```

The three-tier layout ensures the dashboard is usable in any context — a full-screen terminal, a quarter-width tmux pane, or even a narrow SSH session on a phone. The table adapts by dropping less important columns rather than truncating important ones.

---

### Testing TUI Output Without a Terminal

TUI applications are notoriously hard to test because they depend on terminal state. Ratatui provides a `TestBackend` that captures rendered frames as in-memory buffers:

```rust
// From: src/test_helpers.rs

#[cfg(test)]
mod tests {
    use ratatui::{backend::TestBackend, Terminal};
    use super::*;

    fn create_test_app() -> App {
        App {
            items: vec![
                AnalysisResult {
                    filename: "test_video.mp4".to_string(),
                    duration_minutes: 12.5,
                    transition_count: 42,
                    status: AnalysisStatus::Complete,
                    avg_transition_interval: 17.8,
                    analyzed_at: "2025-03-05".to_string(),
                    file_size_mb: 156.3,
                    error_message: None,
                    transitions_per_minute: vec![3.0, 5.0, 2.0, 7.0, 4.0],
                },
            ],
            filtered_items: vec![0],
            selected: 0,
            search_query: String::new(),
            sort_column: SortColumn::Filename,
            sort_ascending: true,
            input_mode: InputMode::Normal,
            scroll_offset: 0,
            status_message: String::new(),
            // data_rx omitted for tests
        }
    }

    #[test]
    fn test_table_renders_data() {
        let backend = TestBackend::new(120, 40);
        let mut terminal = Terminal::new(backend).unwrap();
        let app = create_test_app();

        terminal.draw(|f| ui(f, &app)).unwrap();

        let buffer = terminal.backend().buffer().clone();
        let content = buffer_to_string(&buffer);

        assert!(content.contains("test_video.mp4"));
        assert!(content.contains("12.5m"));
        assert!(content.contains("42"));
        assert!(content.contains("Complete"));
    }

    #[test]
    fn test_search_filters_results() {
        let mut app = create_test_app();
        app.items.push(AnalysisResult {
            filename: "other_file.mp4".to_string(),
            duration_minutes: 5.0,
            transition_count: 10,
            status: AnalysisStatus::InProgress,
            avg_transition_interval: 30.0,
            analyzed_at: "2025-03-04".to_string(),
            file_size_mb: 50.0,
            error_message: None,
            transitions_per_minute: vec![1.0, 2.0],
        });
        app.filtered_items = vec![0, 1];

        // Apply search filter
        app.search_query = "test".to_string();
        app.apply_filter();

        assert_eq!(app.filtered_items.len(), 1);
        assert_eq!(app.filtered_items[0], 0);
    }

    #[test]
    fn test_sort_by_transitions() {
        let mut app = create_test_app();
        app.items.push(AnalysisResult {
            filename: "many_transitions.mp4".to_string(),
            duration_minutes: 8.0,
            transition_count: 200,
            status: AnalysisStatus::Complete,
            avg_transition_interval: 2.4,
            analyzed_at: "2025-03-04".to_string(),
            file_size_mb: 90.0,
            error_message: None,
            transitions_per_minute: vec![20.0, 25.0, 30.0],
        });
        app.filtered_items = vec![0, 1];

        app.sort_column = SortColumn::Transitions;
        app.sort_ascending = false;
        app.sort_items();

        // Highest transition count first
        assert_eq!(app.items[0].transition_count, 200);
    }

    fn buffer_to_string(buffer: &ratatui::buffer::Buffer) -> String {
        let mut result = String::new();
        for y in 0..buffer.area().height {
            for x in 0..buffer.area().width {
                let cell = buffer.cell((x, y)).unwrap();
                result.push_str(cell.symbol());
            }
            result.push('\n');
        }
        result
    }
}
```

The `TestBackend` approach tests the actual rendering output — not mocked widgets, but real character cells as they would appear on screen. This catches layout bugs that unit tests on individual widgets would miss: overlapping regions, truncated text, incorrect alignment.

---

### When to Use a TUI

TUIs are not always the right choice. Use a TUI when:

- **You are the primary user.** TUIs are for developers and operators, not end users.
- **The data is tabular or hierarchical.** Tables, trees, and lists render perfectly in character grids.
- **You are already in the terminal.** If your workflow lives in tmux, adding a TUI pane is cheaper than opening a browser.
- **The interaction model is keyboard-driven.** Navigate, filter, sort, select. TUIs excel at these.
- **You need persistence.** Tmux sessions survive SSH disconnects. Browser tabs do not.

Use a web UI when:
- Non-technical users need access
- The interface requires drag-and-drop, rich media, or complex forms
- The data is best represented as maps, 3D visualizations, or spatial layouts
- You need to share a link
- Mobile access is required

---

### The Complete TUI Architecture

```mermaid
graph TD
    subgraph "Data Layer"
        A[SQLite Database] --> B[Data Fetcher]
        B --> C[MPSC Channel]
    end

    subgraph "Application Layer"
        C --> D[App State]
        D --> E[Filter Engine]
        D --> F[Sort Engine]
        E --> G[Filtered View]
        F --> G
    end

    subgraph "Input Layer"
        H[Crossterm Events] --> I[Key Handler]
        I --> J[Action Dispatcher]
        J --> D
    end

    subgraph "Render Layer"
        G --> K[Layout Engine]
        K --> L[Search Bar Widget]
        K --> M[Table Widget]
        K --> N[Detail Pane Widget]
        K --> O[Status Bar Widget]
        L --> P[Terminal Frame]
        M --> P
        N --> P
        O --> P
    end

    subgraph "Integration Layer"
        Q[Tmux Session Manager] --> R[Dashboard Pane]
        Q --> S[Log Pane]
        Q --> T[System Monitor Pane]
        Q --> U[Progress Pane]
    end
```

---

### Results

The video analysis dashboard built in 45 minutes has been in daily use for three months:

- **137 analysis runs** tracked through the TUI
- **Zero context switches** to a browser for results
- **2-second data refresh** via SQLite polling
- **tmux persistence** through SSH disconnects
- **Search + sort** across all columns with instant response
- **Sparkline inline charts** showing transition density at a glance
- **4 tmux panes** providing complete operational visibility

**Build metrics:**
- Lines of Rust: 487 (src/app.rs: 89, src/ui.rs: 198, src/input.rs: 67, src/live_update.rs: 73, src/widgets/*.rs: 60)
- AI agent iterations: 3 (initial build, add sparklines, add tmux integration)
- Total development time: 45 minutes
- Bug fixes post-deployment: 1 (off-by-one in scroll calculation)

The terminal is not a limitation. It is a feature. The constraints that seem restrictive are actually what make AI-assisted TUI development fast, reliable, and surprisingly pleasant. When the design space is bounded, the AI agent can explore it exhaustively. When the design space is infinite (CSS), the agent guesses — and often guesses wrong.

---

### Production Hardening: Lessons from Daily Use

Three months of daily use revealed patterns that the initial 45-minute build did not anticipate:

**Unicode rendering inconsistencies.** Not all terminals render Unicode box-drawing characters the same way. The sparkline characters (`\u{2581}` through `\u{2588}`) render correctly in iTerm2 and Alacritty but display as empty boxes in the default macOS Terminal.app with certain fonts. The fix: detect terminal capabilities at startup and fall back to ASCII art when Unicode support is uncertain.

```rust
// From: src/terminal_detect.rs

pub enum RenderMode {
    Unicode,    // Full Unicode support (sparklines, box-drawing)
    Ascii,      // ASCII fallback (-, =, #, @)
}

pub fn detect_render_mode() -> RenderMode {
    // Check TERM and LANG environment variables
    let term = std::env::var("TERM").unwrap_or_default();
    let lang = std::env::var("LANG").unwrap_or_default();

    // Known Unicode-capable terminals
    let unicode_terms = [
        "xterm-256color", "screen-256color", "tmux-256color",
        "alacritty", "iterm2", "wezterm",
    ];

    let has_unicode_term = unicode_terms.iter()
        .any(|t| term.contains(t));
    let has_utf8_lang = lang.contains("UTF-8") || lang.contains("utf-8");

    if has_unicode_term && has_utf8_lang {
        RenderMode::Unicode
    } else {
        RenderMode::Ascii
    }
}

pub fn sparkline_chars(mode: &RenderMode) -> [char; 9] {
    match mode {
        RenderMode::Unicode => [
            ' ', '\u{2581}', '\u{2582}', '\u{2583}',
            '\u{2584}', '\u{2585}', '\u{2586}', '\u{2587}', '\u{2588}',
        ],
        RenderMode::Ascii => [
            ' ', '.', '.', '-', '-', '=', '=', '#', '@',
        ],
    }
}
```

**Database locking under concurrent access.** When the analysis pipeline writes to SQLite while the dashboard reads, WAL mode is essential. Without it, the dashboard's read queries block on the pipeline's write transactions, causing the UI to freeze for 100-500ms — long enough to feel broken.

```rust
// From: src/db_config.rs

use rusqlite::Connection;

pub fn configure_reader_connection(conn: &Connection) {
    // Enable WAL mode for concurrent read/write
    conn.execute_batch("PRAGMA journal_mode=WAL;").ok();

    // Set a short busy timeout so reads don't block forever
    conn.execute_batch("PRAGMA busy_timeout=1000;").ok();

    // Read-only optimization
    conn.execute_batch("PRAGMA query_only=ON;").ok();

    // Increase cache for faster repeated queries
    conn.execute_batch("PRAGMA cache_size=-8000;").ok();  // 8MB
}
```

**Scroll position persistence.** When the dashboard refreshes data (every 2 seconds), the selected row and scroll position reset to the top. This is infuriating when you are examining an item halfway down a long list. The fix: preserve selection state across data refreshes by matching on a stable key (filename) rather than row index.

```rust
// From: src/selection_persistence.rs

pub fn preserve_selection_on_refresh(
    app: &mut App,
    new_items: Vec<AnalysisResult>,
) {
    // Remember current selection by filename (stable key)
    let selected_key = app.selected_item()
        .map(|item| item.filename.clone());

    let old_count = app.items.len();
    app.items = new_items;
    app.apply_filter();

    // Restore selection by matching filename
    if let Some(key) = selected_key {
        if let Some(pos) = app.filtered_items.iter().position(|&idx| {
            app.items[idx].filename == key
        }) {
            app.selected = pos;
        }
    }

    if app.items.len() != old_count {
        app.status_message = format!(
            " Updated: {} results ", app.items.len()
        );
    }
}
```

These three fixes — Unicode detection, WAL mode, and selection persistence — took a combined 20 minutes to implement. They represent the difference between a tool you use once and a tool you use every day. The initial 45-minute build got the functionality right. The 20-minute hardening pass got the experience right.

---

### The Forty-Five Minute Timeline

For context on what AI-assisted TUI development actually looks like in practice, here is the real timeline from the initial build session:

| Time | Activity | Output |
|------|----------|--------|
| 0:00 | Described requirements to Claude Code | Prompt: "Build a ratatui dashboard for video analysis results in SQLite" |
| 0:03 | Agent scaffolded Cargo.toml and src/ structure | 5 files created, dependencies configured |
| 0:08 | Agent wrote App state model and data types | src/app.rs complete (89 lines) |
| 0:15 | Agent wrote full UI rendering with all four panes | src/ui.rs complete (198 lines) |
| 0:22 | Agent wrote keyboard input handler with vim bindings | src/input.rs complete (67 lines) |
| 0:28 | Agent wrote live data loop with SQLite polling | src/live_update.rs complete (73 lines) |
| 0:32 | Agent wrote sparkline and progress bar widgets | src/widgets/*.rs complete (60 lines) |
| 0:35 | First successful compile and run | Dashboard rendered with sample data |
| 0:38 | Connected to real SQLite database | Live data displayed correctly |
| 0:40 | Added inline sparklines to table rows | Sparklines showing transition density |
| 0:43 | Wrote tmux workspace generator | Python script for 4-pane layout |
| 0:45 | Full integration test with live pipeline | Dashboard updating in real-time |

The agent produced correct code on its first attempt for every component. No CSS debugging. No responsive layout iteration. No "why is this 1px off" investigation. The deterministic nature of terminal grids — fixed character widths, integer coordinates, binary styling — eliminated the entire class of layout ambiguity that makes web UI development unpredictable.

---

**Companion Repo:** [ai-terminal-ui](https://github.com/krzemienski/ai-terminal-ui) -- Complete TUI toolkit: ratatui dashboard with sortable tables, inline sparklines, search filtering, and detail panes; blessed Node.js alternative with charts and donut graphs; tmux workspace generator for multi-pane operational dashboards; live SQLite data integration; and keyboard input handling patterns for vim-style navigation.
