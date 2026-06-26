// HeroScenes.jsx — AMBIENT scenes for hero background.
//
// Design rules (these scenes must NEVER fight the headline):
//   • All scene content is positioned at the perimeter — top strip, bottom
//     strip, and far-left/far-right rails. The center 60% of the canvas
//     stays clear for the title + CTAs.
//   • Each scene is wrapped in a content-window mask that fades out hard
//     toward the middle, guaranteeing the title always reads.
//   • Global opacity is held low (0.22–0.32). These are atmospherics, not
//     focal elements.
//   • Color is intentionally desaturated. Highlights only on motion accents.
import React from 'react';
import { hexA } from '../lib/util.js';

const SCENE_OPACITY = 0.28;

// Mask used by every scene — keeps content away from the center where the
// title sits. The center vertical slab + horizontal slab are wiped out.
const SCENE_MASK = {
  maskImage:
    'radial-gradient(ellipse 56% 48% at 50% 46%, transparent 0%, transparent 30%, #000 78%)',
  WebkitMaskImage:
    'radial-gradient(ellipse 56% 48% at 50% 46%, transparent 0%, transparent 30%, #000 78%)',
};

// =============================================================================
// SCENE 1 · STREAM — log lanes flowing right→left at the very top and bottom
// only. Title zone stays clear. Lanes are short and faint.
// =============================================================================
export function SceneStream({ accent }) {
  // Two top lanes + two bottom lanes. Nothing in the middle.
  const lanes = [
    { y: '8%',  label: 'alpha',  color: accent,
      items: ['read("auth.ts:920")', 'assert(delta===full)', 'fix(+=→=)', 'rerun(test_42)', '✓ delta_ok', 'commit 7a9c'] },
    { y: '17%', label: 'lead',   color: '#7A3DFF',
      items: ['scan(SDK,CLI)', 'compare.paths', 'verdict:hybrid', 'sign-off', 'merge'] },

    { y: '82%', label: 'memory', color: '#5EE6F2',
      items: ['get("session_42")', 'cache.miss', 'embed(1024d)', 'index.append', 'persist✓', 'recall.hit'] },
    { y: '91%', label: 'orch',   color: '#34D08C',
      items: ['spawn(reviewer)', 'spawn(verifier)', 'await(3)', 'consensus✓', 'gate.pass', 'fanout(5)'] },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: SCENE_OPACITY, ...SCENE_MASK }}>
      {lanes.map((lane, idx) => {
        const dur = 60 + (idx % 3) * 12;
        const reverse = idx % 2 === 1;
        const items = [...lane.items, ...lane.items, ...lane.items];
        return (
          <div key={lane.label} style={{
            position: 'absolute', left: 0, right: 0, top: lane.y, height: 18,
            display: 'flex', alignItems: 'center',
          }}>
            <span className="wa-mono" style={{
              flexShrink: 0, padding: '0 28px',
              fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700,
              color: lane.color, opacity: 0.85,
            }}>{lane.label.toUpperCase()}</span>
            <div style={{
              flex: 1, overflow: 'hidden',
              maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
              WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
            }}>
              <div style={{
                display: 'flex', gap: 36, whiteSpace: 'nowrap',
                animation: 'wa-lane-' + (idx % 3) + ' ' + dur + 's linear infinite ' + (reverse ? 'reverse' : 'normal'),
                width: '300%',
              }}>
                {items.map((t, i) => (
                  <span key={i} className="wa-mono" style={{
                    fontSize: 11.5, letterSpacing: 0.2,
                    color: 'rgba(244,243,238,0.7)',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// SCENE 2 · SWARM — pushed to the corners. A faint constellation of agent
// nodes orbits the title; edges fade hard before reaching center.
// =============================================================================
export function SceneSwarm({ accent }) {
  // Nodes only at extreme top/bottom and far edges. The title's vertical band
  // (35%–55% Y, 25%–75% X) is empty.
  const nodes = [
    { id: 'planner', x: 12, y: 14, role: 'PLAN',     hub: false },
    { id: 'builder', x: 88, y: 14, role: 'BUILD',    hub: false },
    { id: 'lead',    x: 50, y: 8,  role: 'LEAD',     hub: true  },

    { id: 'memory',  x: 8,  y: 78, role: 'MEMORY',   hub: false },
    { id: 'router',  x: 92, y: 78, role: 'ROUTER',   hub: false },
    { id: 'review',  x: 30, y: 90, role: 'REVIEW',   hub: false },
    { id: 'verify',  x: 70, y: 90, role: 'VERIFY',   hub: false },
    { id: 'consensus', x: 50, y: 94, role: 'CONSENSUS', hub: true  },
  ];
  // Edges only across the perimeter — never crossing the center.
  const edges = [
    ['lead', 'planner'], ['lead', 'builder'], ['planner', 'builder'],
    ['consensus', 'review'], ['consensus', 'verify'], ['consensus', 'memory'],
    ['consensus', 'router'], ['review', 'verify'], ['memory', 'router'],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: SCENE_OPACITY + 0.04, ...SCENE_MASK }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible',
      }}>
        {edges.map(([a, b], i) => {
          const A = byId[a], B = byId[b];
          return (
            <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="rgba(244,243,238,0.16)" strokeWidth="0.16" />
          );
        })}
      </svg>

      {nodes.map((n, i) => (
        <div key={n.id} style={{
          position: 'absolute',
          left: 'calc(' + n.x + '% - ' + (n.hub ? 26 : 20) + 'px)',
          top:  'calc(' + n.y + '% - ' + (n.hub ? 26 : 20) + 'px)',
          width: n.hub ? 52 : 40, height: n.hub ? 52 : 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, ' + hexA(accent, n.hub ? 0.20 : 0.10) + ' 0%, transparent 70%)',
          border: '1px solid ' + hexA(accent, n.hub ? 0.45 : 0.26),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'wa-node-pulse ' + (4 + (i % 3) * 0.9) + 's ease-in-out infinite',
          animationDelay: (i * 0.32) + 's',
        }}>
          <span className="wa-mono" style={{
            fontSize: n.hub ? 9 : 8, fontWeight: 700,
            letterSpacing: 1, color: n.hub ? accent : 'rgba(244,243,238,0.7)',
          }}>{n.role}</span>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// SCENE 3 · PIPELINE — moved to a single, faint bottom-strip ribbon. A
// horizontal flow that runs across the very bottom only; nothing near the CTA.
// =============================================================================
export function ScenePipeline({ accent }) {
  // Consistent tone — all stages render in the accent at varying weights
  // (instead of a rainbow per stage). Keeps the hero palette unified.
  const stages = [
    { l: 'plan',   c: accent, alpha: 0.55 },
    { l: 'spawn',  c: accent, alpha: 0.70 },
    { l: 'review', c: accent, alpha: 0.85 },
    { l: 'gate',   c: accent, alpha: 0.95 },
    { l: 'merge',  c: accent, alpha: 1.00 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: SCENE_OPACITY + 0.02 }}>
      {/* top label strip */}
      <div style={{
        position: 'absolute', top: 38, left: 0, right: 0,
        textAlign: 'center',
      }}>
        <span className="wa-mono" style={{
          fontSize: 10, letterSpacing: 2.4, fontWeight: 700,
          color: 'rgba(244,243,238,0.32)',
        }}>
          PARALLEL TASK PIPELINE · 5 STAGES · 23,479 SESSIONS
        </span>
      </div>

      {/* the pipeline ribbon — only at the very bottom */}
      <div style={{
        position: 'absolute', bottom: 70, left: '6%', right: '6%',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14,
          marginBottom: 10,
        }}>
          {stages.map((s, i) => (
            <div key={s.l}>
              <div className="wa-mono" style={{
                fontSize: 9.5, letterSpacing: 1.4, fontWeight: 700,
                color: hexA(s.c, s.alpha),
              }}>
                {String(i + 1).padStart(2, '0')} · {s.l.toUpperCase()}
              </div>
              <div style={{
                marginTop: 4, height: 2, borderRadius: 1, background: hexA(s.c, s.alpha * 0.7),
                boxShadow: '0 0 6px ' + hexA(s.c, s.alpha * 0.5),
              }} />
            </div>
          ))}
        </div>

        {/* a single moving chip across all stages */}
        <div style={{
          position: 'relative', height: 22,
        }}>
          <div className="wa-mono" style={{
            position: 'absolute', top: 0, left: 0,
            height: 22, padding: '0 12px', borderRadius: 4,
            display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
            fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, color: '#0a0a0a',
            background: accent,
            boxShadow: '0 0 12px ' + hexA(accent, 0.4),
            animation: 'wa-pipeline-task 14s ease-in-out infinite',
          }}>streaming.fix</div>
        </div>
      </div>

      {/* faint timestamp ticks at the very bottom */}
      <div style={{
        position: 'absolute', bottom: 30, left: '6%', right: '6%',
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14,
      }}>
        {['t+0.0s', 't+1.3s', 't+3.4s', 't+3.6s', 't+4.8s'].map((t) => (
          <div key={t} className="wa-mono" style={{
            fontSize: 9.5, letterSpacing: 1, color: 'rgba(244,243,238,0.4)',
          }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SCENE 4 · DIFF — pushed to a side rail rather than centered. The diff
// floats on the left at small scale, hands raised; never crosses center.
// =============================================================================
export function SceneDiff({ accent }) {
  const lines = [
    { t: 'message.text += textBlock.text', state: 'minus' },
    { t: 'message.text = textBlock.text',  state: 'plus' },
    { t: 'await commit(...)' },
    { t: 'emit("delta", message.text)' },
    { t: 'verify(consensus="3/3")', state: 'plus' },
    { t: 'persist(memory.session)', state: 'plus' },
  ];

  // The card sits low on the right side, small and faint.
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: SCENE_OPACITY + 0.02 }}>
      <div style={{
        position: 'absolute', left: 32, bottom: 90,
        width: 320, maxWidth: '32%',
        background: 'rgba(8,8,10,0.55)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, overflow: 'hidden',
        backdropFilter: 'blur(4px)',
      }}>
        <div className="wa-mono" style={{
          padding: '8px 12px', fontSize: 9.5, letterSpacing: 1.4, fontWeight: 700,
          color: 'rgba(244,243,238,0.55)',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>line 926 · streaming.ts</span>
          <span style={{ color: '#34D08C' }}>3/3</span>
        </div>
        <pre className="wa-mono" style={{ margin: 0, padding: '8px 0', fontSize: 11, lineHeight: 1.6 }}>
          {lines.map((ln, i) => {
            const isMinus = ln.state === 'minus';
            const isPlus  = ln.state === 'plus';
            return (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '1px 12px',
                background: isMinus ? 'rgba(255,107,126,0.10)'
                          : isPlus  ? 'rgba(52,208,140,0.10)'
                                    : 'transparent',
                borderLeft: isMinus ? '2px solid #FF6B7E'
                          : isPlus  ? '2px solid #34D08C'
                                    : '2px solid transparent',
                color: isMinus ? '#FFB0BA' : isPlus ? '#9AE6BF' : 'rgba(244,243,238,0.65)',
              }}>
                <span style={{ width: 10, color: isMinus ? '#FF6B7E' : isPlus ? '#34D08C' : 'rgba(244,243,238,0.25)', flexShrink: 0 }}>
                  {isMinus ? '-' : isPlus ? '+' : ' '}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ln.t}</span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* counterpart on the right — a small consensus tally */}
      <div style={{
        position: 'absolute', right: 32, bottom: 90,
        width: 220, maxWidth: '24%',
        background: 'rgba(8,8,10,0.5)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: 14,
        backdropFilter: 'blur(4px)',
      }}>
        <div className="wa-mono" style={{
          fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700,
          color: 'rgba(244,243,238,0.5)',
        }}>
          CONSENSUS GATE
        </div>
        {[
          { r: 'lead',  v: 'PASS' },
          { r: 'alpha', v: 'PASS' },
          { r: 'bravo', v: 'PASS' },
        ].map((row) => (
          <div key={row.r} style={{
            marginTop: 8, display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: 'rgba(244,243,238,0.7)',
          }}>
            <span className="wa-mono">{row.r}</span>
            <span className="wa-mono" style={{ color: '#34D08C', fontWeight: 700 }}>{row.v}</span>
          </div>
        ))}
        <div style={{
          marginTop: 12, padding: '6px 0',
          textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11, color: '#34D08C', fontWeight: 700, letterSpacing: 1,
        }} className="wa-mono">
          ✓ UNANIMOUS · MERGE
        </div>
      </div>
    </div>
  );
}
