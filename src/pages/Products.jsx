// Products archive + Product detail pages
import React from 'react';
import { SERIES, PRODUCTS } from '../data/content.js';
import { hexA } from '../lib/util.js';
import { WANav, WAFooter, WAEyebrow } from '../components/ui.jsx';
import { PostCard, ProductMiniCard } from './Home.jsx';

export function ProductsPage({ accent, go }) {
  return (
    <div className="wa-page" style={{ height: '100%', overflow: 'auto' }}>
      <WANav accent={accent} route={{ page: 'products' }} go={go} />
      <section style={{ padding: '60px 40px 20px', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: -200, top: -80, width: 700, height: 700, pointerEvents: 'none',
          background: `radial-gradient(circle, ${hexA(accent, 0.14)}, transparent 60%)`, filter: 'blur(40px)',
        }} />
        <WAEyebrow accent={accent} num={2} label="PRODUCTS" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ margin: 0, fontSize: 76, fontWeight: 800, letterSpacing: -2.6, lineHeight: 1 }}>
              Products <span className="wa-display" style={{ fontStyle: 'italic', fontWeight: 400, color: accent }}>&amp; open source</span>
            </h1>
            <div style={{ marginTop: 18, fontSize: 16, color: 'rgba(244,243,238,0.6)', lineHeight: 1.55, maxWidth: 540 }}>
              Every system in the series turned into something you can install, clone, or subscribe to.
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 40px 60px' }}>
        <div className="wa-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PRODUCTS.map((p) => <ProductMiniCard key={p.slug} product={p} accent={accent} go={go} />)}
        </div>
      </section>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

export function ProductPage({ slug, accent, go }) {
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const related = (product.related || []).map((n) => SERIES.find((s) => s.num === n)).filter(Boolean);
  const tone = product.statusTone === 'accent';

  return (
    <div className="wa-page" style={{ height: '100%', overflow: 'auto' }}>
      <WANav accent={accent} route={{ page: 'product' }} go={go} />

      {/* HERO */}
      <section style={{ position: 'relative', padding: '60px 40px 40px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: -200, top: -120, width: 800, height: 800, pointerEvents: 'none',
          background: `radial-gradient(circle, ${hexA(accent, 0.2)}, transparent 60%)`, filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', left: -120, top: 200, width: 700, height: 700, pointerEvents: 'none',
          background: `radial-gradient(circle, ${hexA('#7A3DFF', 0.14)}, transparent 60%)`, filter: 'blur(50px)',
        }} />

        {/* breadcrumbs */}
        <div className="wa-mono" style={{ fontSize: 11, color: 'rgba(244,243,238,0.4)', letterSpacing: 1.6, marginBottom: 18 }}>
          <a onClick={() => go({ page: 'products' })} style={{ color: 'inherit', cursor: 'pointer' }}>PRODUCTS</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: accent }}>{product.name.toUpperCase()}</span>
          <span style={{ margin: '0 10px' }}>·</span>
          <span>{product.kind.toUpperCase()}</span>
          {product.related && <>
            <span style={{ margin: '0 10px' }}>·</span>
            <span>{product.modules.slice(0, 2).join(' · ')}</span>
          </>}
        </div>

        <div className="wa-grid-2" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div className="wa-mono" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: accent, letterSpacing: 1.6, fontWeight: 700,
              padding: '5px 10px', borderRadius: 99, background: hexA(accent, 0.12), border: `1px solid ${hexA(accent, 0.3)}`,
            }}>
              <span style={{ width: 7, height: 7, background: accent, borderRadius: 4 }} /> {product.kind.toUpperCase()}
              <span style={{ color: 'rgba(244,243,238,0.5)' }}>·</span>
              <span style={{ color: 'rgba(244,243,238,0.7)' }}>{product.status}</span>
            </div>

            <h1 className="wa-page-title" style={{
              margin: '24px 0 0', fontSize: 88, fontWeight: 800, letterSpacing: -3.2, lineHeight: 0.98,
              fontFamily: '"Fraunces", Georgia, serif',
            }}>
              {product.tagline.split(',').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part.trim().split(' ').map((w, j) => {
                    const italic = /[a-z]ing\b|tempering|cooling|heating/.test(w);
                    return <span key={j} style={{
                      fontStyle: italic ? 'italic' : 'normal',
                      color: italic ? accent : '#f4f3ee',
                      fontWeight: italic ? 500 : 700,
                    }}>{w} </span>;
                  })}
                  {i < arr.length - 1 && <br/>}
                </React.Fragment>
              ))}
            </h1>

            <div style={{ marginTop: 28, fontSize: 17, color: 'rgba(244,243,238,0.72)', lineHeight: 1.55, maxWidth: 640 }}>
              {product.desc}
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button style={{
                height: 46, padding: '0 20px', borderRadius: 10,
                background: accent, color: '#0a0a0a', fontWeight: 700, fontSize: 13, letterSpacing: 0.3,
                border: 0, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>{product.cta} ↗</button>
              <button style={{
                height: 46, padding: '0 20px', borderRadius: 10,
                background: 'transparent', color: '#f4f3ee',
                border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
              }} className="wa-mono">INSTALL ↓</button>
              <button
                onClick={() => related[0] && go({ page: 'post', slug: related[0].slug })}
                style={{
                  height: 46, padding: '0 20px', borderRadius: 10,
                  background: 'transparent', color: '#f4f3ee',
                  border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                }} className="wa-mono">READ THE LAUNCH POST ↗</button>
            </div>
          </div>

          <ProductHeroArt kind={product.hero} accent={accent} />
        </div>

        {/* subnav — the sticky product subpages */}
        <div style={{
          marginTop: 48, display: 'flex', alignItems: 'center', gap: 28,
          padding: '14px 20px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          overflowX: 'auto',
        }}>
          {product.modules.map((m, i) => (
            <a key={m} className="wa-mono" style={{
              fontSize: 11.5, letterSpacing: 1.2, fontWeight: 700,
              color: i === 0 ? accent : 'rgba(244,243,238,0.6)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              textDecoration: i === 0 ? `underline 2px ${accent}` : 'none',
              textUnderlineOffset: 6,
            }}>{m.toUpperCase()}</a>
          ))}
          <span style={{ flex: 1 }} />
          <a className="wa-mono" style={{
            fontSize: 11.5, letterSpacing: 1.2, fontWeight: 700,
            color: 'rgba(244,243,238,0.6)', cursor: 'pointer',
          }}>GITHUB ↗</a>
        </div>

        {/* pitch quote block — matches the "metal gains its strength" pattern */}
        <div style={{
          marginTop: 24, padding: '28px 32px', borderRadius: 14,
          background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${hexA(accent, 0.06)})`,
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: '"Fraunces", Georgia, serif', fontSize: 22, fontStyle: 'italic',
          color: '#f4f3ee', lineHeight: 1.4,
        }}>
          {product.pitch}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '40px 40px' }}>
        <div className="wa-grid-3" style={{
          display: 'grid', gridTemplateColumns: `repeat(${product.stats.length}, 1fr)`, gap: 0,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
          overflow: 'hidden',
        }}>
          {product.stats.map((s, i) => (
            <div key={s.l} style={{
              padding: '24px 26px',
              borderRight: i < product.stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1.6, color: accent }}>{s.v}</div>
              <div className="wa-mono" style={{ marginTop: 4, fontSize: 11, color: 'rgba(244,243,238,0.55)', letterSpacing: 1.4, fontWeight: 600 }}>
                {s.l.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE / MODULES */}
      <section style={{ padding: '40px 40px' }}>
        <WAEyebrow accent={accent} num={1} label="ARCHITECTURE" />
        <h2 className="wa-section-title" style={{ margin: 0, fontSize: 48, fontWeight: 700, letterSpacing: -1.6 }}>
          Three modes, <span className="wa-display" style={{ fontStyle: 'italic', color: accent, fontWeight: 400 }}>one contract.</span>
        </h2>
        <div className="wa-grid-3" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {product.modules.slice(0, 3).map((m, i) => (
            <div key={m} style={{
              padding: '22px 22px', borderRadius: 14,
              background: i === 1 ? `linear-gradient(180deg, ${hexA(accent, 0.16)}, ${hexA(accent, 0.02)})` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 1 ? hexA(accent, 0.35) : 'rgba(255,255,255,0.07)'}`,
              minHeight: 240,
            }}>
              <div className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.6, fontWeight: 700, color: accent }}>
                MODULE {String(i+1).padStart(2,'0')}
              </div>
              <div style={{ marginTop: 10, fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>{m}</div>
              <div style={{ marginTop: 10, fontSize: 14, color: 'rgba(244,243,238,0.65)', lineHeight: 1.5 }}>
                {moduleCopy(product, m)}
              </div>
              <ModuleDiagram kind={product.hero} index={i} accent={accent} />
            </div>
          ))}
        </div>
      </section>

      {/* RELATED POSTS */}
      {related.length > 0 && (
        <section style={{ padding: '60px 40px' }}>
          <WAEyebrow accent={accent} num={2} label="READ THE SERIES" />
          <h2 className="wa-section-title" style={{ margin: '0 0 24px', fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
            The posts that shipped <span style={{ color: accent }}>{product.name}</span>
          </h2>
          <div className="wa-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {related.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} accent={accent} go={go} size="lg" />)}
          </div>
        </section>
      )}

      {/* OTHER PRODUCTS */}
      <section style={{ padding: '20px 40px' }}>
        <WAEyebrow accent={accent} num={3} label="MORE FROM WITHAGENTS" />
        <div className="wa-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3).map((p) => (
            <ProductMiniCard key={p.slug} product={p} accent={accent} go={go} />
          ))}
        </div>
      </section>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

function moduleCopy(product, m) {
  const map = {
    Cast:   'Linear planning variant. Fast, iterative, single-pass. Best for well-defined tasks.',
    Alloy:  'Tournament planning. N plans compete; the winner advances. Catches blind spots.',
    Temper: 'Convergence planning. Three rounds of red-team critique. Paranoid by design.',
    Library: 'Curated runbooks, signed and versioned. Drop-in procedures for recurring ops.',
    Replay:  'Time-travel any run. Inspect spans, diff evidence, compare executions.',
    Evidence:'Every span carries proof. Screenshots, JSON, curl output — on disk.',
    'Observation store': 'SQLite-backed durable memory. Embeddings indexed, auto-pruned.',
    'Semantic search':   'Vector + lexical. Agents retrieve what they need in one call.',
    Pruning:             'TTL + relevance decay. Keep the signal; drop the noise.',
    Lead:  'The architect. Cross-module consistency and regression detection.',
    Alpha: 'The logician. Line-by-line semantic analysis.',
    Bravo: 'The operator. Runs the thing; files what breaks.',
    Flamechart: 'Chrome-style agent trace. Every span, every tool, one view.',
    'Diff view':'Compare two runs side-by-side. See where they diverged.',
    'Evidence sidecar': 'Click a span, see the prompt, tools, and output.',
    Queue: 'Twelve agents, twelve lanes. Prioritize, pause, reroute.',
    'Live trace': 'Stream spans as they happen. No refreshing.',
    Audit: 'Everything written to disk. Signed, searchable.',
  };
  return map[m] || 'A core module of ' + product.name + '.';
}

function ModuleDiagram({ kind, index, accent }) {
  // small SVG diagrams per product family
  if (kind === 'metal') {
    // three thermal curves: sharp, tempered, convergence
    const shapes = [
      'M10,70 L40,20 L70,70 L100,20 L130,70',          // cast — zigzag
      'M10,70 Q40,20 70,45 Q100,70 130,30',            // alloy — smooth
      'M10,50 Q40,70 70,30 Q100,50 115,40 Q125,35 130,35', // temper — convergence
    ];
    return (
      <svg width="100%" height="80" viewBox="0 0 140 80" style={{ marginTop: 18 }}>
        <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(255,255,255,.1)" strokeDasharray="2 3"/>
        <path d={shapes[index]} stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'consensus') {
    const positions = [[30, 30], [70, 30], [70, 70]];
    return (
      <svg width="100%" height="80" viewBox="0 0 140 80" style={{ marginTop: 18 }}>
        <circle cx="70" cy="50" r="18" fill="none" stroke="rgba(255,255,255,.12)" strokeDasharray="2 3" />
        {positions.map(([x, y], j) => (
          <circle key={j} cx={x+20} cy={y+10} r="5"
            fill={j === index ? accent : 'rgba(255,255,255,.2)'} />
        ))}
      </svg>
    );
  }
  // default — three horizontal bars, the "current" one is accent
  return (
    <svg width="100%" height="80" viewBox="0 0 140 80" style={{ marginTop: 18 }}>
      {[20, 40, 60].map((y, j) => (
        <rect key={j} x="10" y={y} width={40 + j * 30} height="6" rx="3"
          fill={j === index ? accent : 'rgba(255,255,255,.12)'} />
      ))}
    </svg>
  );
}

function ProductHeroArt({ kind, accent }) {
  // Block-style art that sits next to the hero tagline — browser-style card.
  return (
    <div style={{
      aspectRatio: '1.1 / 1',
      borderRadius: 16, overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ff5f57' }} />
        <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ffbd2e' }} />
        <span style={{ width: 9, height: 9, borderRadius: 5, background: '#28c840' }} />
        <span className="wa-mono" style={{ marginLeft: 12, fontSize: 10.5, color: 'rgba(244,243,238,0.4)' }}>
          withagents.dev/{kind === 'metal' ? 'anneal' : kind}
        </span>
      </div>
      <div style={{ position: 'relative', height: 'calc(100% - 36px)', padding: 18 }}>
        <HeroInnerArt kind={kind} accent={accent} />
      </div>
    </div>
  );
}

function HeroInnerArt({ kind, accent }) {
  if (kind === 'metal') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="heat" x1="0" x2="1">
            <stop offset="0" stopColor={accent} stopOpacity="1" />
            <stop offset="1" stopColor="#7A3DFF" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {[180, 140, 100, 60].map((y, i) => (
          <line key={i} x1="20" x2="280" y1={y} y2={y} stroke="rgba(255,255,255,.06)" strokeDasharray="2 3" />
        ))}
        <path d="M20,180 Q60,40 120,110 T220,120 L280,140" stroke="url(#heat)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="120" cy="110" r="5" fill={accent} />
        <circle cx="220" cy="120" r="5" fill={accent} />
        <text x="20" y="215" className="wa-mono" fontSize="10" fill="rgba(244,243,238,.5)" letterSpacing="1.2">HEAT → COOL → TEMPER</text>
      </svg>
    );
  }
  if (kind === 'runbook') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 240">
        {[0,1,2,3,4].map((i) => (
          <g key={i}>
            <rect x={30 + i*4} y={30 + i*8} width="200" height="40" rx="4"
              fill={i === 4 ? hexA(accent, 0.22) : 'rgba(255,255,255,0.03)'}
              stroke={i === 4 ? accent : 'rgba(255,255,255,0.1)'} />
            <rect x={42 + i*4} y={44 + i*8} width="60" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x={42 + i*4} y={54 + i*8} width="120" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'memory') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 240">
        {Array.from({length: 24}).map((_, i) => {
          const x = 30 + (i%8)*32, y = 40 + Math.floor(i/8)*52;
          const hot = i === 11 || i === 19;
          return <rect key={i} x={x} y={y} width="26" height="40" rx="3"
            fill={hot ? accent : 'rgba(255,255,255,0.06)'}
            stroke={hot ? 'transparent' : 'rgba(255,255,255,0.1)'} />;
        })}
      </svg>
    );
  }
  if (kind === 'consensus') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 240">
        {[[100, 80], [200, 80], [150, 170]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="34" fill="none" stroke="rgba(255,255,255,0.12)" />
            <circle cx={x} cy={y} r="12" fill={accent} />
            <text x={x} y={y+4} textAnchor="middle" fill="#0a0a0a" fontSize="10" fontWeight="700">
              {['LEAD','ALPHA','BRAVO'][i]}
            </text>
          </g>
        ))}
        <line x1="100" y1="80" x2="200" y2="80" stroke={hexA(accent, 0.4)} strokeWidth="1" />
        <line x1="100" y1="80" x2="150" y2="170" stroke={hexA(accent, 0.4)} strokeWidth="1" />
        <line x1="200" y1="80" x2="150" y2="170" stroke={hexA(accent, 0.4)} strokeWidth="1" />
      </svg>
    );
  }
  if (kind === 'trace') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 300 240">
        {[30, 60, 90, 120, 150, 180].map((y, i) => (
          <g key={i}>
            <line x1="20" x2="280" y1={y} y2={y} stroke="rgba(255,255,255,0.04)" />
            {Array.from({length: 3 + i%3}).map((_, j) => {
              const x = 30 + j*60 + i*10, w = 30 + j*12;
              return <rect key={j} x={x} y={y-4} width={w} height="8" rx="1"
                fill={(i+j)%4 === 0 ? accent : hexA(accent, 0.35)} />;
            })}
          </g>
        ))}
      </svg>
    );
  }
  // operator
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 240">
      <rect x="20" y="20" width="80" height="200" rx="6" fill="rgba(255,255,255,0.04)" />
      <rect x="110" y="20" width="110" height="200" rx="6" fill="rgba(255,255,255,0.02)" stroke={hexA(accent, 0.4)} />
      <rect x="230" y="20" width="50" height="200" rx="6" fill="rgba(255,255,255,0.04)" />
      {[0,1,2,3].map((i) => (
        <rect key={i} x="30" y={35 + i*40} width="60" height="28" rx="3"
          fill={i === 1 ? accent : 'rgba(255,255,255,0.08)'} />
      ))}
      <circle cx="165" cy="120" r="30" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="100 40" />
      <text x="165" y="124" textAnchor="middle" fontSize="12" fill={accent} fontWeight="700" fontFamily="monospace">12</text>
    </svg>
  );
}
