// InteractiveConsensusGate
//   A real interactive diagram embedded in posts. Reader can:
//     • step through 4 scenarios (correct, +=  bug, TODO body, race)
//     • watch the three reviewers (Lead/Alpha/Bravo) reach a verdict
//     • see WHY each reviewer voted what they voted
import React from 'react';
import { hexA } from '../lib/util.js';

const SCENARIOS = [
  {
    id: 'good',
    label: 'Clean change',
    code: 'message.text = textBlock.text',
    summary: 'Replace partial with full delta.',
    votes: {
      lead:  { v: 'PASS', why: 'Aligns with the streaming module spec.' },
      alpha: { v: 'PASS', why: 'Operator matches API: API returns full text, we set it.' },
      bravo: { v: 'PASS', why: 'Run: "Four." renders once, no repeat.' },
    },
  },
  {
    id: 'plus',
    label: '+= bug',
    code: 'message.text += textBlock.text',
    summary: 'Looks fine. Three days in production. Broken.',
    votes: {
      lead:  { v: 'FAIL', why: 'Both SDK and CLI paths share this flawed handler.' },
      alpha: { v: 'FAIL', why: 'Line 926: += appends, but textBlock.text is the full message.' },
      bravo: { v: 'FAIL', why: 'Run: "Four." renders as "Four.Four." on second token.' },
    },
  },
  {
    id: 'todo',
    label: 'TODO body',
    code: 'async function deleteUserAccount() {\n  // TODO: implement\n}',
    summary: 'Compiles. Lints. Ships nothing.',
    votes: {
      lead:  { v: 'FAIL', why: 'Function declared "complete" with no implementation.' },
      alpha: { v: 'FAIL', why: 'Body is a comment. Returns void without side-effects.' },
      bravo: { v: 'FAIL', why: 'UI tap → tapped → no DB write observed in logs.' },
    },
  },
  {
    id: 'race',
    label: 'Two-agent race',
    code: 'agent A edits stream.ts:920\nagent B edits stream.ts:926',
    summary: 'Two agents. Same file. Mid-flight.',
    votes: {
      lead:  { v: 'FAIL', why: 'Conflicting writes to a shared module — ownership map violated.' },
      alpha: { v: 'PASS', why: 'Each diff is locally correct.' },
      bravo: { v: 'FAIL', why: 'Merged build emits malformed JWT response on /auth.' },
    },
  },
];

export function InteractiveConsensusGate({ accent }) {
  const [activeId, setActiveId] = React.useState('plus');
  const [phase, setPhase]       = React.useState('input'); // input → reviewing → verdict
  const [revealed, setRevealed] = React.useState({ lead: false, alpha: false, bravo: false });

  const scenario = SCENARIOS.find((s) => s.id === activeId) || SCENARIOS[0];

  // Auto-advance: when scenario changes, re-run the review animation
  React.useEffect(() => {
    setPhase('input');
    setRevealed({ lead: false, alpha: false, bravo: false });
    const t1 = setTimeout(() => setPhase('reviewing'),                     350);
    const t2 = setTimeout(() => setRevealed((r) => ({ ...r, lead:  true })),  900);
    const t3 = setTimeout(() => setRevealed((r) => ({ ...r, alpha: true })), 1500);
    const t4 = setTimeout(() => setRevealed((r) => ({ ...r, bravo: true })), 2150);
    const t5 = setTimeout(() => setPhase('verdict'),                        2700);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [activeId]);

  const passes = ['lead','alpha','bravo'].filter((r) => revealed[r] && scenario.votes[r].v === 'PASS').length;
  const fails  = ['lead','alpha','bravo'].filter((r) => revealed[r] && scenario.votes[r].v === 'FAIL').length;
  const allRevealed = revealed.lead && revealed.alpha && revealed.bravo;
  const unanimousPass = allRevealed && fails === 0;
  const verdictColor = !allRevealed ? 'rgba(244,243,238,0.5)'
                      : unanimousPass ? '#34D08C'
                      : '#FF6B7E';

  return (
    <div style={{
      marginTop: 28, padding: '22px 22px', borderRadius: 14,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="wa-mono" style={{ fontSize: 10.5, color: accent, letterSpacing: 1.6, fontWeight: 700 }}>
            INTERACTIVE · CONSENSUS GATE
          </div>
          <div style={{ marginTop: 4, fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>
            Pick a change. Watch three reviewers vote.
          </div>
        </div>
        <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.4 }}>
          UNANIMOUS=<span style={{ color: verdictColor, fontWeight: 700 }}>
            {!allRevealed ? '…' : (unanimousPass ? 'TRUE' : 'FALSE')}
          </span>
        </div>
      </div>

      {/* scenario tabs */}
      <div style={{
        marginTop: 16, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8,
      }}>
        {SCENARIOS.map((s) => {
          const active = s.id === activeId;
          return (
            <button key={s.id} onClick={() => setActiveId(s.id)} style={{
              padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
              background: active ? hexA(accent, 0.14) : 'rgba(255,255,255,0.025)',
              border: `1px solid ${active ? hexA(accent, 0.4) : 'rgba(255,255,255,0.07)'}`,
              color: active ? '#f4f3ee' : 'rgba(244,243,238,0.7)',
              transition: 'all 160ms ease',
            }}>
              <div className="wa-mono" style={{ fontSize: 9.5, letterSpacing: 1.4, fontWeight: 700, color: active ? accent : 'rgba(244,243,238,0.45)' }}>
                {String(SCENARIOS.indexOf(s) + 1).padStart(2, '0')}
              </div>
              <div style={{ marginTop: 3, fontSize: 13, fontWeight: 600 }}>{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* the change under review */}
      <div style={{
        marginTop: 16, padding: '12px 14px', borderRadius: 8,
        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="wa-mono" style={{ fontSize: 9.5, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.4, fontWeight: 700, marginBottom: 6 }}>
          UNDER REVIEW · {scenario.summary}
        </div>
        <pre className="wa-mono" style={{
          margin: 0, fontSize: 12.5, color: '#f4f3ee',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>{scenario.code}</pre>
      </div>

      {/* review pipeline visual */}
      <div className="wa-gate-grid" style={{
        marginTop: 16,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        {['lead','alpha','bravo'].map((r, idx) => {
          const v = scenario.votes[r];
          const isRevealed = revealed[r];
          const pass = v.v === 'PASS';
          return (
            <div key={r} style={{
              padding: '14px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${isRevealed ? (pass ? 'rgba(52,208,140,0.35)' : 'rgba(255,107,126,0.35)') : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 220ms ease',
              opacity: isRevealed ? 1 : 0.55,
              transform: isRevealed ? 'translateY(0)' : 'translateY(4px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, color: 'rgba(244,243,238,0.65)' }}>
                  {r.toUpperCase()}
                </div>
                <div className="wa-mono" style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                  letterSpacing: 1,
                  background: !isRevealed ? 'rgba(255,255,255,0.05)'
                              : pass ? 'rgba(52,208,140,0.16)' : 'rgba(255,107,126,0.16)',
                  color:      !isRevealed ? 'rgba(244,243,238,0.4)'
                              : pass ? '#34D08C' : '#FF6B7E',
                }}>
                  {!isRevealed ? '…thinking' : v.v}
                </div>
              </div>
              <div style={{
                marginTop: 8, fontSize: 12.5, color: 'rgba(244,243,238,0.7)', lineHeight: 1.45,
                minHeight: 38,
              }}>
                {isRevealed ? v.why : '…'}
              </div>
            </div>
          );
        })}
      </div>

      {/* tally bar */}
      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 180, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(passes/3)*100}%`, background: '#34D08C', transition: 'width 280ms ease' }} />
          <div style={{ width: `${(fails/3)*100}%`,  background: '#FF6B7E', transition: 'width 280ms ease' }} />
        </div>
        <div className="wa-mono" style={{ fontSize: 11, color: 'rgba(244,243,238,0.6)', letterSpacing: 0.4 }}>
          {passes} PASS · {fails} FAIL
        </div>
        <div className="wa-mono" style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, letterSpacing: 1.2,
          background: !allRevealed ? 'rgba(255,255,255,0.05)'
                      : unanimousPass ? 'rgba(52,208,140,0.18)' : 'rgba(255,107,126,0.18)',
          color:      verdictColor,
        }}>
          {!allRevealed ? 'REVIEWING…' : unanimousPass ? '✓ MERGE' : '✕ BLOCK'}
        </div>
      </div>
    </div>
  );
}
