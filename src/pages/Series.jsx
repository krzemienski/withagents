// Series archive + Article reader pages
import React from 'react';
import { SERIES } from '../data/content.js';
import { hexA } from '../lib/util.js';
import { WANav, WAFooter, WAEyebrow, PostGlyph } from '../components/ui.jsx';
import { PostCard } from './Home.jsx';
import { InteractiveConsensusGate } from '../components/InteractiveConsensusGate.jsx';

export function SeriesPage({ accent, go }) {
  return (
    <div className="wa-page" style={{ height: '100%', overflow: 'auto' }}>
      <WANav accent={accent} route={{ page: 'series' }} go={go} />
      <section style={{ padding: '60px 40px 20px', position: 'relative' }} className="wa-section">
        <div style={{
          position: 'absolute', right: -180, top: -80, width: 700, height: 700, pointerEvents: 'none',
          background: `radial-gradient(circle, ${hexA(accent, 0.15)}, transparent 60%)`,
          filter: 'blur(40px)',
        }} />
        <WAEyebrow accent={accent} num={1} label="WRITING" />
        <div className="wa-stack-md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ maxWidth: 680 }}>
            <h1 className="wa-page-title" style={{ margin: 0, fontSize: 76, fontWeight: 800, letterSpacing: -2.6, lineHeight: 1 }}>The Series</h1>
            <div style={{ marginTop: 18, fontSize: 16, color: 'rgba(244,243,238,0.6)', lineHeight: 1.55, maxWidth: 520 }}>
              19 lessons from 23,479 AI coding sessions. Deeply technical, evidence-based, no fluff.
            </div>
          </div>
          <div className="wa-mono" style={{ fontSize: 12, color: 'rgba(244,243,238,0.5)', letterSpacing: 0.6 }}>
            314 min total reading
          </div>
        </div>
      </section>

      <section className="wa-section-tail" style={{ padding: '40px 40px 60px' }}>
        <div className="wa-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {SERIES.map((p) => (
            <PostCard key={p.slug} post={p} accent={accent} go={go} size="lg" />
          ))}
        </div>
      </section>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

export function PostPage({ slug, accent, go }) {
  const post = SERIES.find((p) => p.slug === slug) || SERIES[0];
  const railRef = React.useRef(null);

  // Group posts into 4 editorial sections so the rail reads like a real TOC,
  // not a bulleted dump.
  const SECTIONS = [
    { label: 'Foundation',          start: 1,  end: 4  },
    { label: 'Validation',          start: 5,  end: 9  },
    { label: 'Memory & Hooks',      start: 10, end: 14 },
    { label: 'Coordination',        start: 15, end: 19 },
  ];

  // Scroll the active rail item into view when the slug changes
  React.useEffect(() => {
    if (!railRef.current) return;
    const el = railRef.current.querySelector(`[data-rail-slug="${post.slug}"]`);
    if (el && typeof el.offsetTop === 'number') {
      const target = el.offsetTop - 80;
      railRef.current.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  }, [post.slug]);

  return (
    <div className="wa-page" style={{ height: '100%', overflow: 'auto' }}>
      <WANav accent={accent} route={{ page: 'post' }} go={go} compact />

      <div style={{ display: 'flex', minHeight: 'calc(100% - 56px)', alignItems: 'stretch' }}>
        {/* Editorial sidebar TOC — always visible, grouped by section */}
        <aside className="wa-rail" ref={railRef}>
          <div className="wa-rail-header">
            <a onClick={() => go({ page: 'series' })} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'rgba(244,243,238,0.55)',
              cursor: 'pointer', textDecoration: 'none',
            }}>
              <span style={{ fontSize: 13 }}>←</span> All 19 lessons
            </a>
            <div className="wa-rail-header-label" style={{ marginTop: 14 }}>READING NOW · PART {String(post.num).padStart(2, '0')}</div>
            <div className="wa-rail-header-title">{post.title.length > 48 ? post.title.slice(0, 46) + '…' : post.title}</div>
          </div>
          <div className="wa-rail-list">
            {SECTIONS.map((section, si) => {
              const items = SERIES.filter((p) => p.num >= section.start && p.num <= section.end);
              return (
                <React.Fragment key={section.label}>
                  <div className="wa-rail-divider" style={{ marginTop: si === 0 ? 4 : 18 }}>
                    {String(si + 1).padStart(2, '0')} · {section.label}
                  </div>
                  {items.map((p) => {
                    const active = p.slug === post.slug;
                    return (
                      <a
                        key={p.slug}
                        data-rail-slug={p.slug}
                        onClick={() => go({ page: 'post', slug: p.slug })}
                        className={'wa-rail-item' + (active ? ' active' : '')}
                        style={{
                          background: active ? hexA(accent, 0.09) : undefined,
                          borderColor: active ? hexA(accent, 0.22) : undefined,
                          ['--accent']: accent,
                        }}
                      >
                        {active && (
                          <span style={{
                            position: 'absolute', left: -1, top: 14, bottom: 14,
                            width: 2, borderRadius: 1, background: accent,
                          }} />
                        )}
                        <span className="wa-rail-num" style={{ color: active ? accent : undefined }}>
                          {String(p.num).padStart(2, '0')}
                        </span>
                        <span>
                          <span className="wa-rail-title" style={{
                            color: active ? '#f4f3ee' : 'rgba(244,243,238,0.72)',
                            fontWeight: active ? 600 : 500,
                          }}>{p.title}</span>
                        </span>
                      </a>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </aside>

        {/* article — keyed by slug so each post enters with a fade */}
        <main key={post.slug} className="wa-post-main wa-post-fade" style={{ padding: '32px 64px 80px', maxWidth: 860, flex: 1, minWidth: 0 }}>
          {/* TOP PAGER — clear prev/this/next so switching never feels existential */}
          <PostPager post={post} accent={accent} go={go} />

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 26, flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 26,
              padding: '0 12px', borderRadius: 999, background: hexA(accent, 0.14),
              border: `1px solid ${hexA(accent, 0.3)}`, whiteSpace: 'nowrap',
            }}>
              <PostGlyph kind={post.icon} size={12} color={accent} />
              <span className="wa-mono" style={{ fontSize: 10.5, color: accent, letterSpacing: 1.4, fontWeight: 700 }}>
                PART {post.num} OF {SERIES.length}
              </span>
            </div>
            <span className="wa-mono" style={{ fontSize: 11.5, color: 'rgba(244,243,238,0.5)' }}>{post.read} read</span>
            <span className="wa-mono" style={{ fontSize: 11.5, color: 'rgba(244,243,238,0.5)' }}>·</span>
            <span className="wa-mono" style={{ fontSize: 11.5, color: 'rgba(244,243,238,0.5)' }}>{post.date}</span>
          </div>

          <h1 className="wa-post-h1" style={{ margin: 0, fontSize: 52, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.04 }}>
            {post.title}
          </h1>
          <div className="wa-post-sub" style={{ marginTop: 18, fontSize: 18, color: 'rgba(244,243,238,0.65)', lineHeight: 1.5 }}>
            {post.subtitle}
          </div>

          {post.repo && (
            <a href={`https://github.com/krzemienski/${post.repo}`} target="_blank" rel="noreferrer" style={{
              marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 40, padding: '0 16px', borderRadius: 10,
              background: accent, color: '#0a0a0a', textDecoration: 'none',
              fontWeight: 700, fontSize: 13,
            }}>
              <span>&lt;/&gt;</span> View companion repo ↗
            </a>
          )}

          {(post.tags || []).length > 0 && (
            <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {post.tags.map((t) => (
                <span key={t} className="wa-mono" style={{
                  fontSize: 11, padding: '5px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(244,243,238,0.7)',
                }}>{t}</span>
              ))}
            </div>
          )}

          {post.lead && (
            <p style={{ marginTop: 36, fontSize: 17, lineHeight: 1.65, color: 'rgba(244,243,238,0.88)' }}>
              {post.lead}
            </p>
          )}

          {(post.body || []).map((b, i) => <BodyBlock key={i} block={b} accent={accent} post={post} />)}

          {!post.body && (
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.7, color: 'rgba(244,243,238,0.75)' }}>
              Full post coming soon — this is the mockup for how every post in the series renders.
              The template supports headings, paragraphs, pull quotes, code blocks, bar charts, and
              inline components like the failure-modes grid and the consensus-gate diagram.
            </p>
          )}

          {/* companion stats */}
          {post.companionStats && (
            <div className="wa-companion-grid" style={{
              marginTop: 48, padding: '20px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              display: 'grid', gridTemplateColumns: `repeat(${post.companionStats.length}, 1fr)`, gap: 14,
            }}>
              {post.companionStats.map((s) => (
                <div key={s.k}>
                  <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.4)', letterSpacing: 1.4, fontWeight: 700 }}>
                    {s.k.toUpperCase()}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 26, fontWeight: 700, letterSpacing: -0.8 }}>{s.v}</div>
                </div>
              ))}
            </div>
          )}

          {/* next / prev */}
          <div className="wa-prevnext" style={{
            marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }}>
            {[-1, 1].map((dir) => {
              const next = SERIES.find((p) => p.num === post.num + dir);
              if (!next) return <div key={dir} />;
              return (
                <a key={dir} onClick={() => go({ page: 'post', slug: next.slug })} style={{
                  padding: 20, borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', textDecoration: 'none', color: '#f4f3ee',
                  textAlign: dir === -1 ? 'left' : 'right',
                }}>
                  <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.5)', letterSpacing: 1.4, fontWeight: 600 }}>
                    {dir === -1 ? '← PREVIOUS' : 'NEXT →'} · PART {String(next.num).padStart(2, '0')}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{next.title}</div>
                </a>
              );
            })}
          </div>
        </main>
      </div>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

function BodyBlock({ block, accent, post }) {
  if (block.type === 'p') {
    return <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.7, color: 'rgba(244,243,238,0.8)' }}>{block.text}</p>;
  }
  if (block.type === 'h2') {
    return <h2 style={{ marginTop: 48, marginBottom: 4, fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>{block.text}</h2>;
  }
  if (block.type === 'pull') {
    return (
      <blockquote style={{
        margin: '32px 0', padding: '22px 26px', borderRadius: 12,
        background: `linear-gradient(135deg, ${hexA(accent, 0.08)}, ${hexA('#7A3DFF', 0.05)})`,
        borderLeft: `3px solid ${accent}`,
        fontSize: 20, lineHeight: 1.4, fontStyle: 'italic', fontFamily: '"Fraunces", Georgia, serif',
        color: '#f4f3ee',
      }}>"{block.text}"</blockquote>
    );
  }
  if (block.type === 'code') {
    return (
      <div style={{
        margin: '24px 0', borderRadius: 10, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {block.caption && (
          <div className="wa-mono" style={{
            padding: '8px 14px', fontSize: 11, color: 'rgba(244,243,238,0.55)',
            background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>// {block.caption}</span>
            <span>{block.lang}</span>
          </div>
        )}
        <pre className="wa-mono" style={{
          margin: 0, padding: '16px 18px', fontSize: 13.5, color: '#f4f3ee',
          background: 'rgba(0,0,0,0.4)', overflow: 'auto',
        }}>{block.text}</pre>
      </div>
    );
  }
  if (block.type === 'chart' && block.kind === 'bars') {
    const max = Math.max(...block.data.map((d) => d.v));
    return (
      <div style={{
        margin: '32px 0', padding: '24px 26px', borderRadius: 12,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div className="wa-mono" style={{ fontSize: 11, color: accent, letterSpacing: 1.4, fontWeight: 700, marginBottom: 14 }}>
          {block.title.toUpperCase()}
        </div>
        {block.data.map((d) => (
          <div key={d.l} className="wa-bar-row" style={{ display: 'grid', gridTemplateColumns: '110px 1fr 60px', gap: 10, alignItems: 'center', marginBottom: 6 }}>
            <span className="wa-mono" style={{ fontSize: 11.5, color: 'rgba(244,243,238,0.7)' }}>{d.l}</span>
            <div style={{ height: 16, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(d.v / max) * 100}%`,
                background: `linear-gradient(90deg, ${accent}, ${hexA(accent, 0.5)})` }} />
            </div>
            <span className="wa-mono wa-bar-num" style={{ fontSize: 11, color: 'rgba(244,243,238,0.55)', textAlign: 'right' }}>
              {d.v.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'failures') {
    const items = [
      { t: 'Amnesia',                 d: 'Same bug, different session.' },
      { t: 'False Confidence',        d: 'Build passes, feature broken.' },
      { t: 'Completion Theater',      d: 'Correct structure, empty body.' },
      { t: 'Wrong Model',             d: 'Opus on a typo fix.' },
      { t: 'Coordination Collision',  d: 'Two agents, one file.' },
    ];
    return (
      <div className="wa-failures-grid" style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {items.map((it) => (
          <div key={it.t} style={{
            padding: '16px 14px', borderRadius: 10,
            background: `linear-gradient(180deg, ${hexA(accent, 0.08)}, transparent)`,
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div className="wa-mono" style={{ fontSize: 10, color: accent, letterSpacing: 1.2, fontWeight: 700 }}>FAIL</div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>{it.t}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(244,243,238,0.6)', lineHeight: 1.4 }}>{it.d}</div>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'patterns') {
    const items = [
      { t: 'Consensus Gates',   d: 'Three reviewers, unanimous vote. $0.15 per gate.' },
      { t: 'Functional Validation', d: 'No mocks. Run the real thing, screenshot evidence.' },
      { t: 'Fresh Context',     d: 'Short-lived agents with exactly the files they need.' },
      { t: 'Filesystem Persistence', d: 'Agents cannot share memory. They can share files.' },
    ];
    return (
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {items.map((it) => (
          <div key={it.t} style={{
            padding: '18px 20px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: accent }} />
              <div style={{ fontSize: 16, fontWeight: 700 }}>{it.t}</div>
            </div>
            <div style={{ marginTop: 6, fontSize: 13.5, color: 'rgba(244,243,238,0.65)', lineHeight: 1.5 }}>{it.d}</div>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'economics') {
    const rows = [
      { l: 'All Opus',                   v: '$8.40' },
      { l: 'All Sonnet',                 v: '$3.12' },
      { l: 'Routed (Haiku/Sonnet/Opus)', v: '$1.52', highlight: true },
    ];
    return (
      <div style={{ marginTop: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div className="wa-mono" style={{ padding: '12px 18px', fontSize: 11, color: 'rgba(244,243,238,0.5)', letterSpacing: 1.4, fontWeight: 700, background: 'rgba(255,255,255,0.02)' }}>
          COST PER 26 INVOCATIONS
        </div>
        {rows.map((r, i) => (
          <div key={r.l} style={{
            display: 'flex', justifyContent: 'space-between', padding: '14px 18px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: r.highlight ? hexA(accent, 0.08) : 'transparent',
            color: r.highlight ? '#f4f3ee' : 'rgba(244,243,238,0.8)',
            fontWeight: r.highlight ? 700 : 500,
          }}>
            <span>{r.l}</span>
            <span className="wa-mono">{r.v}</span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'roles') {
    const roles = [
      { t: 'Lead',  sub: 'Architecture & consistency', f: 'Cross-component coherence, pattern compliance, regression detection.' },
      { t: 'Alpha', sub: 'Logic & correctness',         f: 'Line-by-line reasoning. The +=/= principle. Semantic traps.' },
      { t: 'Bravo', sub: 'Systems & functional',        f: 'Runs the thing. Race conditions. Realistic failure modes.' },
    ];
    return (
      <div className="wa-roles-grid" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {roles.map((r) => (
          <div key={r.t} style={{
            padding: '18px 20px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{r.t}</div>
            <div className="wa-mono" style={{ marginTop: 2, fontSize: 10.5, color: accent, letterSpacing: 1.2, fontWeight: 700 }}>
              {r.sub.toUpperCase()}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(244,243,238,0.65)', lineHeight: 1.5 }}>{r.f}</div>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'interactiveGate') {
    return <InteractiveConsensusGate accent={accent} />;
  }
  if (block.type === 'gate') {
    return (
      <div style={{
        marginTop: 24, padding: '22px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div className="wa-mono" style={{ fontSize: 11, color: accent, letterSpacing: 1.4, fontWeight: 700, marginBottom: 14 }}>
          GATE 2 · AUDIT · UNANIMOUS=FALSE
        </div>
        {[
          { r: 'lead',  v: 'FAIL', why: 'Both SDK and CLI paths share flawed handler.' },
          { r: 'alpha', v: 'FAIL', why: 'Line 926: += appends, textBlock.text is full.' },
          { r: 'bravo', v: 'FAIL', why: 'Running app: "Four." renders as "Four.Four."' },
        ].map((row) => (
          <div key={row.r} style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr', gap: 12, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
            <span className="wa-mono" style={{ fontSize: 12, color: 'rgba(244,243,238,0.75)' }}>{row.r}</span>
            <span className="wa-mono" style={{
              fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
              background: hexA(accent, 0.15), color: accent, textAlign: 'center', letterSpacing: 1,
            }}>{row.v}</span>
            <span style={{ fontSize: 13, color: 'rgba(244,243,238,0.7)' }}>{row.why}</span>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'list') {
    return (
      <ul style={{ marginTop: 18, paddingLeft: 0, listStyle: 'none' }}>
        {block.items.map((it, i) => (
          <li key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
            fontSize: 15, lineHeight: 1.6, color: 'rgba(244,243,238,0.78)',
          }}>
            <span className="wa-mono" style={{
              flexShrink: 0, color: accent, fontSize: 11, fontWeight: 700,
              letterSpacing: 1, paddingTop: 4, width: 22,
            }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'whenList') {
    const groups = [
      { title: 'Always use it for', tone: 'on', items: [
        'Changes touching shared state, auth, data persistence, or streaming',
        'Multi-agent merges where code from different agents gets combined',
        'Cross-module or interface changes',
        'Anything involving security, user data, or payments',
      ] },
      { title: 'Skip it for', tone: 'off', items: [
        'String constant updates, typo fixes, adding a log line',
        'Single-file changes with zero behavioral impact',
        'One-line changes with no downstream effects',
      ] },
      { title: 'Know its limits', tone: 'edge', items: [
        'For genuinely novel work where no agent has relevant experience, consensus can produce false confidence.',
        'If three agents cannot agree in five rounds, the disagreement is real and needs a human.',
      ] },
    ];
    return (
      <div className="wa-roles-grid" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {groups.map((g) => (
          <div key={g.title} style={{
            padding: '18px 18px', borderRadius: 10,
            background: g.tone === 'on' ? hexA(accent, 0.08) : 'rgba(255,255,255,0.03)',
            border: g.tone === 'on' ? `1px solid ${hexA(accent, 0.3)}` : '1px solid rgba(255,255,255,0.07)',
          }}>
            <div className="wa-mono" style={{
              fontSize: 10.5, color: g.tone === 'on' ? accent : 'rgba(244,243,238,0.5)',
              letterSpacing: 1.4, fontWeight: 700,
            }}>{g.title.toUpperCase()}</div>
            <ul style={{ margin: '10px 0 0', paddingLeft: 0, listStyle: 'none' }}>
              {g.items.map((it, i) => (
                <li key={i} style={{
                  fontSize: 12.5, lineHeight: 1.5,
                  color: 'rgba(244,243,238,0.72)', padding: '5px 0',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                }}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'pipeline') {
    const phases = [
      { l: 'explore', d: 'map the codebase' },
      { l: 'audit',   d: 'deep review' },
      { l: 'fix',     d: 'verify the fix' },
      { l: 'verify',  d: 'end-to-end' },
    ];
    return (
      <div className="wa-pipeline" style={{ marginTop: 24, display: 'flex', alignItems: 'stretch', gap: 8, flexWrap: 'wrap' }}>
        {phases.map((p, i) => (
          <React.Fragment key={p.l}>
            <div style={{
              flex: 1, minWidth: 140, padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div className="wa-mono" style={{ fontSize: 10, color: accent, letterSpacing: 1.4, fontWeight: 700 }}>
                PHASE {i + 1}
              </div>
              <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700 }}>{p.l}</div>
              <div style={{ marginTop: 2, fontSize: 12, color: 'rgba(244,243,238,0.55)' }}>{p.d}</div>
            </div>
            {i < phases.length - 1 && (
              <div className="wa-hide-sm" style={{
                width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accent, fontSize: 16, opacity: 0.7,
              }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (block.type === 'table') {
    return (
      <div style={{
        marginTop: 24, borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {block.title && (
          <div className="wa-mono" style={{
            padding: '10px 16px', fontSize: 11, color: 'rgba(244,243,238,0.5)',
            letterSpacing: 1.4, fontWeight: 700, background: 'rgba(255,255,255,0.02)',
          }}>{block.title.toUpperCase()}</div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr>
                {block.cols.map((c, i) => (
                  <th key={i} style={{
                    textAlign: 'left', padding: '12px 16px', fontSize: 11.5,
                    fontWeight: 700, letterSpacing: 0.4,
                    color: 'rgba(244,243,238,0.6)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.02)',
                  }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '12px 16px', fontSize: 13.5,
                      color: ci === r.length - 1 ? '#f4f3ee' : 'rgba(244,243,238,0.78)',
                      fontFamily: ci === r.length - 1 ? '"JetBrains Mono", monospace' : 'inherit',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return null;
}

// =============================================================================
// PostPager — top-of-article navigator.
// =============================================================================
function PostPager({ post, accent, go }) {
  const prev = SERIES.find((p) => p.num === post.num - 1);
  const next = SERIES.find((p) => p.num === post.num + 1);
  return (
    <div className="wa-pager" style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: 14, alignItems: 'center',
      padding: '10px 14px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      marginBottom: 32,
    }}>
      {prev ? (
        <a onClick={() => go({ page: 'post', slug: prev.slug })} className="wa-pager-side" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 8,
          cursor: 'pointer', minWidth: 0,
        }}>
          <span style={{ fontSize: 18, color: 'rgba(244,243,238,0.55)', flexShrink: 0 }}>←</span>
          <span style={{ minWidth: 0 }}>
            <span className="wa-mono" style={{ display: 'block', fontSize: 10, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.4, fontWeight: 700 }}>
              PREV · {String(prev.num).padStart(2, '0')}
            </span>
            <span style={{
              display: 'block', fontSize: 13, color: 'rgba(244,243,238,0.85)',
              fontWeight: 600, lineHeight: 1.25, marginTop: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{prev.title}</span>
          </span>
        </a>
      ) : <div />}

      <a onClick={() => go({ page: 'series' })} className="wa-pager-center" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px',
        borderRadius: 99, background: hexA(accent, 0.12),
        border: `1px solid ${hexA(accent, 0.28)}`,
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        <span className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, color: accent }}>
          PART {String(post.num).padStart(2, '0')} / {String(SERIES.length).padStart(2, '0')}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(244,243,238,0.55)' }}>· all posts ↗</span>
      </a>

      {next ? (
        <a onClick={() => go({ page: 'post', slug: next.slug })} className="wa-pager-side" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 8,
          cursor: 'pointer', minWidth: 0, justifyContent: 'flex-end', textAlign: 'right',
        }}>
          <span style={{ minWidth: 0 }}>
            <span className="wa-mono" style={{ display: 'block', fontSize: 10, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.4, fontWeight: 700 }}>
              NEXT · {String(next.num).padStart(2, '0')}
            </span>
            <span style={{
              display: 'block', fontSize: 13, color: 'rgba(244,243,238,0.85)',
              fontWeight: 600, lineHeight: 1.25, marginTop: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{next.title}</span>
          </span>
          <span style={{ fontSize: 18, color: 'rgba(244,243,238,0.55)', flexShrink: 0 }}>→</span>
        </a>
      ) : <div />}
    </div>
  );
}
