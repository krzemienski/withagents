// Shared UI primitives for WithAgents
// Robot-mark logo, global nav, footer, section eyebrow, icons, backgrounds.

function WAMark({ size = 28, accent = '#FF3D52' }) {
  // Square-ish robot head glyph inspired by the actual withagents.dev mark.
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <rect x="3" y="5" width="26" height="22" rx="5" fill={accent} />
      {/* antenna */}
      <circle cx="16" cy="3" r="1.6" fill={accent} />
      <line x1="16" y1="4" x2="16" y2="7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      {/* eyes */}
      <rect x="9" y="13" width="4" height="6" rx="1.2" fill="#0a0a0a" />
      <rect x="19" y="13" width="4" height="6" rx="1.2" fill="#0a0a0a" />
      {/* mouth */}
      <rect x="12" y="22" width="8" height="1.6" rx="0.8" fill="#0a0a0a" />
    </svg>
  );
}

function WANav({ accent, route, go, compact = false }) {
  const h = compact ? 56 : 68;
  return (
    <header className="wa-header" style={{
      position: 'sticky', top: 0, zIndex: 20,
      height: h, padding: '0 40px',
      display: 'flex', alignItems: 'center', gap: 24,
      background: 'rgba(8,8,10,0.72)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <a onClick={() => go({ page: 'home' })}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none', color: '#f4f3ee' }}>
        <WAMark size={26} accent={accent} />
        <span className="wa-mono" style={{
          fontSize: 11.5, fontWeight: 700, letterSpacing: 2.2,
        }}>WITHAGENTS</span>
      </a>
      <div style={{ flex: 1 }} />
      <nav className="wa-nav-links" style={{ display: 'flex', gap: 28, fontSize: 13, color: 'rgba(244,243,238,0.68)' }}>
        {[
          { k: 'writing',  label: 'Writing',  active: route.page === 'series' || route.page === 'post' },
          { k: 'products', label: 'Products', active: route.page === 'products' || route.page === 'product' },
          { k: 'about',    label: 'About',    active: route.page === 'about' },
          { k: 'github',   label: 'GitHub',   external: true },
        ].map((item) => (
          <a key={item.k}
            onClick={() => {
              if (item.external) return;
              if (item.k === 'writing')  go({ page: 'series' });
              if (item.k === 'products') go({ page: 'products' });
              if (item.k === 'about')    go({ page: 'about' });
            }}
            style={{
              cursor: 'pointer', textDecoration: 'none',
              color: item.active ? '#f4f3ee' : 'inherit',
              fontWeight: item.active ? 600 : 500,
              position: 'relative',
            }}>
            {item.label}{item.external ? ' ↗' : ''}
          </a>
        ))}
      </nav>
    </header>
  );
}

function WAFooter({ accent, go }) {
  return (
    <footer style={{
      marginTop: 120, padding: '60px 40px 40px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40,
      color: 'rgba(244,243,238,0.6)', fontSize: 13,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WAMark size={28} accent={accent} />
          <span className="wa-mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.2, color: '#f4f3ee' }}>WITHAGENTS</span>
        </div>
        <div style={{ marginTop: 18, maxWidth: 340, lineHeight: 1.55 }}>
          A field journal for people building real agent systems. 19 lessons. Evidence-based. No fluff.
        </div>
        <div className="wa-mono" style={{ marginTop: 22, fontSize: 10.5, color: 'rgba(244,243,238,0.3)', letterSpacing: 1.4 }}>
          © 2026 WITHAGENTS · V.2026.04 · ALL SYSTEMS NOMINAL
        </div>
      </div>
      {[
        { h: 'Writing',  items: [
          { label: 'The Series', go: () => go({ page: 'series' }) },
          { label: 'Latest',     go: () => go({ page: 'post', slug: SERIES[0].slug }) },
          { label: 'RSS' },
        ] },
        { h: 'Products', items: [
          { label: 'All products', go: () => go({ page: 'products' }) },
          { label: 'Anneal',       go: () => go({ page: 'product', slug: 'anneal' }) },
          { label: 'Runbooks',     go: () => go({ page: 'product', slug: 'runbooks' }) },
          { label: 'Memory Layer', go: () => go({ page: 'product', slug: 'memory-layer' }) },
        ] },
        { h: 'Connect',  items: [
          { label: 'GitHub ↗' }, { label: 'X ↗' }, { label: 'Email ↗' },
        ] },
      ].map((col) => (
        <div key={col.h}>
          <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.35)', letterSpacing: 1.4, fontWeight: 600, marginBottom: 14 }}>
            {col.h.toUpperCase()}
          </div>
          {col.items.map((it) => (
            <div key={it.label} style={{ marginBottom: 10 }}>
              <a onClick={it.go} style={{ cursor: it.go ? 'pointer' : 'default', color: 'inherit', textDecoration: 'none' }}>
                {it.label}
              </a>
            </div>
          ))}
        </div>
      ))}
    </footer>
  );
}

function WAEyebrow({ accent, num, label }) {
  return (
    <div className="wa-mono" style={{
      fontSize: 11, color: accent, letterSpacing: 2.4, fontWeight: 600,
      marginBottom: 16,
    }}>
      {String(num).padStart(2, '0')}. {label}
    </div>
  );
}

function WAStatusPill({ accent, children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 26, padding: '0 12px', borderRadius: 999,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: 10.5, color: 'rgba(244,243,238,0.75)', letterSpacing: 1.6,
      fontFamily: '"JetBrains Mono",ui-monospace,monospace', fontWeight: 600,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4, background: accent,
        boxShadow: `0 0 10px ${accent}`,
      }} />
      {children}
    </div>
  );
}

// Parallax aurora — the "background video" for the home hero.
function ParallaxAurora({ accent, scrollY = 0 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* far layer — slow, purple-magenta blob */}
      <div style={{
        position: 'absolute',
        right: '-10%', top: `${-120 + scrollY * -0.12}px`,
        width: 900, height: 900, borderRadius: '50%',
        background: `radial-gradient(circle at 40% 40%, ${hexA(accent, 0.28)} 0%, ${hexA(accent, 0.08)} 30%, transparent 60%)`,
        filter: 'blur(40px)',
        animation: 'wa-float-a 22s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        left: '-15%', top: `${280 + scrollY * -0.2}px`,
        width: 780, height: 780, borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%, ${hexA('#7A3DFF', 0.28)}, transparent 60%)`,
        filter: 'blur(50px)',
        animation: 'wa-float-b 28s ease-in-out infinite',
      }} />
      {/* near layer — crisp grid that moves faster */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${scrollY * 0.08}px)`,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 100% 60% at 50% 20%, #000 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 60% at 50% 20%, #000 40%, transparent 80%)',
      }} />
      {/* drifting streams — a csv of tokens that "plays" */}
      <LiveStream accent={accent} scrollY={scrollY} />
      {/* grain */}
      <div style={{
        position: 'absolute', inset: -40,
        opacity: 0.12,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>")`,
        animation: 'wa-grain 1.8s steps(5) infinite',
        mixBlendMode: 'overlay',
      }} />
    </div>
  );
}

function LiveStream({ accent, scrollY }) {
  const lanes = [
    { y: 42, label: 'alpha',  color: accent, items: ['read(line:920..940)', 'assert(delta===full)', '>> FAIL', 'fix(+=→=)'] },
    { y: 55, label: 'bravo',  color: '#7A3DFF', items: ['run(app)', 'stream("Four.")', '>> FAIL', 'replay.reset(0)'] },
    { y: 68, label: 'lead',   color: '#5EE6F2', items: ['scan(SDK,CLI)', 'compare.paths', '>> FAIL', 'unanimous=false'] },
  ];
  return (
    <div style={{
      position: 'absolute', left: 40, right: 40, bottom: 32,
      transform: `translateY(${scrollY * 0.18}px)`,
      display: 'flex', flexDirection: 'column', gap: 6,
      pointerEvents: 'none', opacity: 0.55,
    }}>
      {lanes.map((lane, i) => (
        <div key={i} className="wa-mono" style={{
          display: 'flex', alignItems: 'center', gap: 14,
          fontSize: 10.5, color: 'rgba(244,243,238,0.35)',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          <span style={{
            width: 54, color: lane.color, letterSpacing: 1.4, fontWeight: 700,
          }}>{lane.label.toUpperCase()}</span>
          <div style={{
            flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${hexA(lane.color, 0.25)}, transparent)`,
          }} />
          <div style={{
            display: 'flex', gap: 28,
            animation: `wa-lane-${i} ${16 + i * 4}s linear infinite`,
          }}>
            {[...lane.items, ...lane.items, ...lane.items].map((t, j) => (
              <span key={j}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function hexA(c, a) {
  const r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// Icon glyphs used on post cards + product headers.
function PostGlyph({ kind, size = 22, color = 'rgba(244,243,238,0.75)' }) {
  const s = size;
  const stroke = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'rocket':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M13 2l7 7-9 9-5-5 7-11z" {...stroke}/><circle cx="15" cy="9" r="1.4" {...stroke}/><path d="M6 18l-3 3 4-1" {...stroke}/></svg>);
    case 'network':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="5" cy="6" r="2" {...stroke}/><circle cx="19" cy="6" r="2" {...stroke}/><circle cx="12" cy="18" r="2" {...stroke}/><path d="M7 7l4 10M17 7l-4 10M7 6h10" {...stroke}/></svg>);
    case 'check':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...stroke}/><path d="M8 12l3 3 5-6" {...stroke}/></svg>);
    case 'phone':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="3" {...stroke}/><path d="M10 18h4" {...stroke}/></svg>);
    case 'git':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="6" cy="6" r="2" {...stroke}/><circle cx="6" cy="18" r="2" {...stroke}/><circle cx="18" cy="13" r="2" {...stroke}/><path d="M6 8v8M8 6h4a4 4 0 014 4v1" {...stroke}/></svg>);
    case 'stack':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5z" {...stroke}/><path d="M3 13l9 5 9-5M3 17l9 5 9-5" {...stroke}/></svg>);
    case 'loop':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 12a8 8 0 1114 5" {...stroke}/><path d="M18 13v4h-4" {...stroke}/></svg>);
    case 'mine':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M3 20h18M6 20V9l6-5 6 5v11" {...stroke}/><path d="M10 20v-4h4v4" {...stroke}/></svg>);
    case 'palette':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3a9 9 0 100 18 3 3 0 003-3v-1a2 2 0 012-2h1a3 3 0 003-3 9 9 0 00-9-9z" {...stroke}/><circle cx="8" cy="10" r="1" {...stroke}/><circle cx="12" cy="7" r="1" {...stroke}/><circle cx="16" cy="10" r="1" {...stroke}/></svg>);
    case 'yaml':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" {...stroke}/><path d="M8 9h6M8 13h8M8 17h4" {...stroke}/></svg>);
    case 'memory':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" {...stroke}/><path d="M8 5v2M12 5v2M16 5v2M8 19v-2M12 19v-2M16 19v-2" {...stroke}/></svg>);
    case 'steps':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 20h4v-4H4zM10 16h4v-4h-4zM16 12h4V8h-4z" {...stroke}/></svg>);
    case 'skill':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 10l6-1z" {...stroke}/></svg>);
    case 'hook':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3v8a4 4 0 01-8 0" {...stroke}/><circle cx="12" cy="16" r="4" {...stroke}/></svg>);
    case 'term':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" {...stroke}/><path d="M7 10l3 2-3 2M12 14h5" {...stroke}/></svg>);
    case 'split':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3v18M6 7l-3 5 3 5M18 7l3 5-3 5" {...stroke}/></svg>);
    case 'anneal':
      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M7 21s-4-5-4-10a4 4 0 018 0v1a4 4 0 008 0" {...stroke}/><path d="M7 21h10" {...stroke}/></svg>);
    default:
      return <svg width={s} height={s} />;
  }
}

Object.assign(window, {
  WAMark, WANav, WAFooter, WAEyebrow, WAStatusPill,
  ParallaxAurora, PostGlyph, hexA,
});
