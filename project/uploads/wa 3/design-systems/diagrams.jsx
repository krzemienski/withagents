/* =====================================================================
   WITHAGENTS DESIGN SYSTEMS · DIAGRAM PRIMITIVES
   The same diagram (the Consensus Gate from Post 02) rendered five ways.
   Each system supplies its own grammar of nodes, decisions, arrows,
   edge labels, and lane containers — so any chart inherits the personality.
   ===================================================================== */

const WA_DIAGRAM_STYLES = {
  journal: {
    nodeBg: 'rgba(255,255,255,0.04)', nodeBorder: 'rgba(255,255,255,0.16)',
    nodeRadius: 12, nodeBorderW: 1,
    nodeShadow: '0 6px 24px -8px rgba(0,0,0,0.5)',
    nodeFont: "'Inter', sans-serif", nodeWeight: 600, nodeCase: 'none',
    nodeLetterSpacing: '0',
    arrowColor: 'rgba(244,243,238,0.42)', arrowHead: 'classic',
    edgeLabelBg: '#0c0c0e', edgeLabelFont: "'JetBrains Mono', mono",
    edgeLabelCase: 'lowercase', decisionShape: 'diamond', laneStyle: 'soft',
    bg: '#08080a',
  },
  terminal: {
    nodeBg: 'transparent', nodeBorder: 'rgba(232,232,224,0.45)',
    nodeRadius: 0, nodeBorderW: 1, nodeShadow: 'none',
    nodeFont: "'IBM Plex Mono', monospace", nodeWeight: 500, nodeCase: 'uppercase',
    nodeLetterSpacing: '0.06em',
    arrowColor: '__accent__', arrowHead: 'ascii',
    edgeLabelBg: '#000', edgeLabelFont: "'IBM Plex Mono', mono",
    edgeLabelCase: 'uppercase', decisionShape: 'bracketed', laneStyle: 'ascii',
    bg: '#000',
  },
  paper: {
    nodeBg: 'rgba(248,247,242,0.04)', nodeBorder: 'rgba(248,247,242,0.28)',
    nodeRadius: 4, nodeBorderW: 1, nodeShadow: 'none',
    nodeFont: "'IBM Plex Serif', serif", nodeWeight: 500, nodeCase: 'none',
    nodeLetterSpacing: '0',
    arrowColor: 'rgba(248,247,242,0.5)', arrowHead: 'thin',
    edgeLabelBg: '#0a0a0c', edgeLabelFont: "'IBM Plex Mono', mono",
    edgeLabelCase: 'none', decisionShape: 'minimal', laneStyle: 'hairline',
    bg: '#0a0a0c',
  },
  console: {
    nodeBg: 'rgba(255,255,255,0.05)', nodeBorder: 'rgba(255,255,255,0.18)',
    nodeRadius: 4, nodeBorderW: 1,
    nodeShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.4)',
    nodeFont: "'Geist','Inter',sans-serif", nodeWeight: 500, nodeCase: 'none',
    nodeLetterSpacing: '-0.01em',
    arrowColor: 'rgba(255,255,255,0.55)', arrowHead: 'thin',
    edgeLabelBg: '#000', edgeLabelFont: "'JetBrains Mono', mono",
    edgeLabelCase: 'none', decisionShape: 'rounded', laneStyle: 'soft',
    bg: '#000',
  },
  brutal: {
    nodeBg: '#000', nodeBorder: '#f5f5f0',
    nodeRadius: 0, nodeBorderW: 2,
    nodeShadow: '4px 4px 0 0 #f5f5f0',
    nodeFont: "'Space Grotesk', sans-serif", nodeWeight: 600, nodeCase: 'uppercase',
    nodeLetterSpacing: '0.04em',
    arrowColor: '#f5f5f0', arrowHead: 'block',
    edgeLabelBg: '__accent__', edgeLabelFont: "'JetBrains Mono', mono",
    edgeLabelCase: 'uppercase', decisionShape: 'square', laneStyle: 'hard',
    bg: '#000',
  },
};

function WANode({ sysId, label, sub, x, y, w = 140, h = 56, accent, variant = 'default' }) {
  const s = WA_DIAGRAM_STYLES[sysId];
  const isAccent = variant === 'accent';
  const border = isAccent ? accent : s.nodeBorder;
  const bg = sysId === 'brutal' && isAccent ? accent
    : sysId === 'terminal' && isAccent ? `${accent}1f`
    : s.nodeBg;
  const txt = sysId === 'brutal' && isAccent ? '#000'
    : sysId === 'terminal' && isAccent ? accent
    : 'var(--text)';
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: bg, border: `${s.nodeBorderW}px solid ${border}`,
      borderRadius: s.nodeRadius,
      boxShadow: isAccent && sysId === 'brutal' ? `4px 4px 0 0 ${accent}` : s.nodeShadow,
      padding: '8px 12px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      fontFamily: s.nodeFont, fontWeight: s.nodeWeight, fontSize: 12,
      letterSpacing: s.nodeLetterSpacing, textTransform: s.nodeCase, color: txt,
    }}>
      <span>
        {sysId === 'terminal' && <span style={{ color: accent, marginRight: 4 }}>{'>'}</span>}
        {label}
      </span>
      {sub && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, fontWeight: 400, marginTop: 3,
          color: sysId === 'brutal' && isAccent ? 'rgba(0,0,0,0.7)' : 'var(--text-3)',
          letterSpacing: '0.08em',
          textTransform: sysId === 'brutal' || sysId === 'terminal' ? 'uppercase' : 'none',
        }}>{sub}</span>
      )}
    </div>
  );
}

function WADecision({ sysId, label, x, y, w = 110, h = 110, accent }) {
  const s = WA_DIAGRAM_STYLES[sysId];
  const stroke = s.nodeBorder;
  if (s.decisionShape === 'bracketed') {
    return (
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: s.nodeFont, fontSize: 11, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)',
      }}>
        <span style={{ color: accent, fontSize: 22, marginRight: 6 }}>{'<'}</span>
        <span>{label}</span>
        <span style={{ color: accent, fontSize: 22, marginLeft: 6 }}>{'?>'}</span>
      </div>
    );
  }
  if (s.decisionShape === 'square') {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
        <div style={{
          position: 'absolute', inset: 0, background: '#000',
          border: '2px solid #f5f5f0', boxShadow: '4px 4px 0 0 #f5f5f0',
          transform: 'rotate(45deg)', transformOrigin: 'center',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: s.nodeFont, fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--text)', textAlign: 'center', padding: 12,
        }}>{label}</div>
      </div>
    );
  }
  if (s.decisionShape === 'minimal' || s.decisionShape === 'rounded') {
    const round = s.decisionShape === 'rounded' ? 6 : 2;
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
          <polygon points={`${w/2},${round} ${w-round},${h/2} ${w/2},${h-round} ${round},${h/2}`}
            fill={s.nodeBg} stroke={stroke} strokeWidth={s.nodeBorderW} strokeLinejoin="round" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: s.nodeFont, fontSize: 11, fontWeight: s.nodeWeight,
          color: 'var(--text)', textAlign: 'center', padding: 14,
        }}>{label}</div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <polygon points={`${w/2},4 ${w-4},${h/2} ${w/2},${h-4} 4,${h/2}`}
          fill="rgba(255,255,255,0.04)" stroke={stroke} strokeWidth="1" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: s.nodeFont, fontSize: 11, fontWeight: 600,
        color: 'var(--text)', textAlign: 'center', padding: 14,
      }}>{label}</div>
    </div>
  );
}

function WAArrow({ sysId, from, to, label, accent, curve = 0 }) {
  const s = WA_DIAGRAM_STYLES[sysId];
  const stroke = s.arrowColor === '__accent__' ? accent : s.arrowColor;
  const sw = sysId === 'brutal' ? 2 : sysId === 'paper' ? 0.75 : 1;
  const id = `wa-arr-${sysId}-${from.x}-${from.y}-${to.x}-${to.y}`.replace(/\./g, '_');
  let path;
  if (curve !== 0) {
    const mx = (from.x + to.x)/2, my = (from.y + to.y)/2;
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(-dy, dx) || 1;
    const cx = mx + (-dy/len) * curve, cy = my + (dx/len) * curve;
    path = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  } else {
    path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  let marker = null;
  if (s.arrowHead === 'classic') marker = (<marker id={id} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 Z" fill={stroke} /></marker>);
  else if (s.arrowHead === 'thin') marker = (<marker id={id} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></marker>);
  else if (s.arrowHead === 'block') marker = (<marker id={id} markerWidth="14" markerHeight="14" refX="13" refY="7" orient="auto"><polygon points="0,0 14,7 0,14" fill={stroke} /></marker>);
  const lx = (from.x + to.x) / 2, ly = (from.y + to.y) / 2;
  return (
    <>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>{marker}</defs>
        <path d={path} fill="none" stroke={stroke} strokeWidth={sw} markerEnd={marker ? `url(#${id})` : undefined} />
      </svg>
      {s.arrowHead === 'ascii' && (
        <div style={{ position: 'absolute', left: to.x - 8, top: to.y - 9, fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: stroke, fontWeight: 600, lineHeight: 1, pointerEvents: 'none' }}>▶</div>
      )}
      {label && (
        <div style={{
          position: 'absolute', left: lx, top: ly,
          transform: 'translate(-50%, -50%)',
          background: s.edgeLabelBg === '__accent__' ? accent : s.edgeLabelBg,
          color: s.edgeLabelBg === '__accent__' ? '#000' : 'var(--text-2)',
          padding: '2px 7px', fontFamily: s.edgeLabelFont, fontSize: 9.5,
          fontWeight: s.edgeLabelBg === '__accent__' ? 700 : 500,
          letterSpacing: '0.06em', textTransform: s.edgeLabelCase,
          border: sysId === 'brutal' ? '1.5px solid #f5f5f0' : sysId === 'paper' ? '1px solid var(--border)' : 'none',
          borderRadius: sysId === 'brutal' || sysId === 'terminal' ? 0 : 4,
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
    </>
  );
}

function WALane({ sysId, label, x, y, w, h }) {
  const s = WA_DIAGRAM_STYLES[sysId];
  if (sysId === 'terminal') return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, pointerEvents: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'rgba(232,232,224,0.5)', letterSpacing: '0.14em' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed rgba(232,232,224,0.22)', textAlign: 'center' }}>
        <span style={{ background: '#000', padding: '0 8px', position: 'relative', top: -7 }}>── {label} ──</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderBottom: '1px dashed rgba(232,232,224,0.22)' }} />
    </div>
  );
  if (sysId === 'brutal') return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, border: '2px solid #f5f5f0', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: -12, left: 12, background: '#000', padding: '0 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f5f5f0' }}>{label}</div>
    </div>
  );
  if (sysId === 'paper') return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 6, left: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--text-3)' }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, border: `1px ${sysId === 'journal' ? 'solid' : 'dashed'} rgba(255,255,255,0.1)`, borderRadius: s.nodeRadius, background: sysId === 'journal' ? 'rgba(244,243,238,0.012)' : 'transparent', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: -9, left: 14, background: s.bg, padding: '0 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{label}</div>
    </div>
  );
}

function WACanvas({ sysId, accent, children, height = 360 }) {
  const s = WA_DIAGRAM_STYLES[sysId];
  return (
    <div style={{
      position: 'relative', background: s.bg,
      border: sysId === 'brutal' ? '2px solid #f5f5f0' : '1px solid var(--border)',
      borderRadius: s.nodeRadius === 0 ? 0 : 'var(--radius)',
      height, overflow: 'hidden',
    }}>
      {sysId === 'terminal' && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.022) 2px, rgba(255,255,255,0.022) 3px)' }} />}
      {sysId === 'paper' && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(0deg, transparent calc(100% - 1px), rgba(248,247,242,0.04) calc(100% - 1px))', backgroundSize: '24px 24px' }} />}
      {sysId === 'journal' && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 500px 300px at 90% 10%, ${accent}14, transparent 60%)` }} />}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
}

/* ─── The shared diagram: Consensus Gate (Post 02) ───
   Change → [Lead, Alpha, Bravo] → Vote → Gate?(unanimous) → Ship / Block */
function WAConsensusGate({ sysId, accent }) {
  const W = 760, H = 340;
  const N = {
    chg:  { x: 24,  y: 142, w: 130, h: 56, label: 'Change',  sub: 'PR · diff'   },
    lead: { x: 200, y: 30,  w: 120, h: 46, label: 'Lead',    sub: 'role · arch' },
    alf:  { x: 200, y: 142, w: 120, h: 46, label: 'Alpha',   sub: 'role · prod' },
    brv:  { x: 200, y: 254, w: 120, h: 46, label: 'Bravo',   sub: 'role · adv'  },
    vote: { x: 380, y: 142, w: 120, h: 56, label: 'Tally',   sub: 'votes · 3/3' },
    gate: { x: 540, y: 130, w: 100, h: 80 },
    ship: { x: 670, y: 80,  w: 80,  h: 44, label: 'Ship',    sub: 'merge'  },
    blok: { x: 670, y: 220, w: 80,  h: 44, label: 'Block',   sub: 'review' },
  };
  const E = {
    chgOut: { x: N.chg.x + N.chg.w, y: N.chg.y + N.chg.h/2 },
    leadIn: { x: N.lead.x, y: N.lead.y + N.lead.h/2 },
    alfIn:  { x: N.alf.x,  y: N.alf.y  + N.alf.h/2  },
    brvIn:  { x: N.brv.x,  y: N.brv.y  + N.brv.h/2  },
    leadOut:{ x: N.lead.x + N.lead.w, y: N.lead.y + N.lead.h/2 },
    alfOut: { x: N.alf.x  + N.alf.w,  y: N.alf.y  + N.alf.h/2  },
    brvOut: { x: N.brv.x  + N.brv.w,  y: N.brv.y  + N.brv.h/2  },
    voteIn: { x: N.vote.x, y: N.vote.y + N.vote.h/2 },
    voteOut:{ x: N.vote.x + N.vote.w, y: N.vote.y + N.vote.h/2 },
    gateIn: { x: N.gate.x, y: N.gate.y + N.gate.h/2 },
    gateT:  { x: N.gate.x + N.gate.w, y: N.gate.y + 18 },
    gateB:  { x: N.gate.x + N.gate.w, y: N.gate.y + N.gate.h - 18 },
    shipIn: { x: N.ship.x, y: N.ship.y + N.ship.h/2 },
    blokIn: { x: N.blok.x, y: N.blok.y + N.blok.h/2 },
  };
  return (
    <WACanvas sysId={sysId} accent={accent} height={H}>
      <WALane sysId={sysId} label="CONSENSUS · 3/3 unanimous" x={186} y={6} w={328} h={H - 12} />
      <WANode sysId={sysId} {...N.chg}  accent={accent} variant="accent" />
      <WANode sysId={sysId} {...N.lead} accent={accent} />
      <WANode sysId={sysId} {...N.alf}  accent={accent} />
      <WANode sysId={sysId} {...N.brv}  accent={accent} />
      <WANode sysId={sysId} {...N.vote} accent={accent} />
      <WADecision sysId={sysId} label="all pass?" {...N.gate} accent={accent} />
      <WANode sysId={sysId} {...N.ship} accent={accent} variant="accent" />
      <WANode sysId={sysId} {...N.blok} accent={accent} />
      <WAArrow sysId={sysId} from={E.chgOut} to={E.leadIn} accent={accent} label="fan-out" curve={-30} />
      <WAArrow sysId={sysId} from={E.chgOut} to={E.alfIn}  accent={accent} />
      <WAArrow sysId={sysId} from={E.chgOut} to={E.brvIn}  accent={accent} curve={30} />
      <WAArrow sysId={sysId} from={E.leadOut} to={E.voteIn} accent={accent} curve={20} />
      <WAArrow sysId={sysId} from={E.alfOut}  to={E.voteIn} accent={accent} label="vote" />
      <WAArrow sysId={sysId} from={E.brvOut}  to={E.voteIn} accent={accent} curve={-20} />
      <WAArrow sysId={sysId} from={E.voteOut} to={E.gateIn} accent={accent} />
      <WAArrow sysId={sysId} from={E.gateT}   to={E.shipIn} accent={accent} label="yes" curve={-12} />
      <WAArrow sysId={sysId} from={E.gateB}   to={E.blokIn} accent={accent} label="no"  curve={12} />
    </WACanvas>
  );
}

window.WA_DIAGRAM_STYLES = WA_DIAGRAM_STYLES;
window.WANode = WANode;
window.WADecision = WADecision;
window.WAArrow = WAArrow;
window.WALane = WALane;
window.WACanvas = WACanvas;
window.WAConsensusGate = WAConsensusGate;
