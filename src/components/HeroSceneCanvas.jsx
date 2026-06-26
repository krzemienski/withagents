// HeroSceneCanvas — animated background behind the hero text.
// Four scenes auto-cycle every ~9s with a slow crossfade. Each scene
// depicts a different facet of agentic work.
import React from 'react';
import { hexA } from '../lib/util.js';
import { SceneStream, SceneSwarm, ScenePipeline, SceneDiff } from './HeroScenes.jsx';

export const HERO_SCENES = ['stream', 'swarm', 'pipeline', 'diff'];
const SCENE_DURATION_MS = 9000;
const FADE_MS = 1100;

export function HeroSceneCanvas({ accent, scrollY = 0, sceneOverride = null }) {
  const [autoIdx, setAutoIdx] = React.useState(0);
  React.useEffect(() => {
    if (sceneOverride) return;
    const id = setInterval(() => setAutoIdx((i) => (i + 1) % HERO_SCENES.length), SCENE_DURATION_MS);
    return () => clearInterval(id);
  }, [sceneOverride]);

  const active = sceneOverride || HERO_SCENES[autoIdx];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <AuroraBlobs accent={accent} scrollY={scrollY} active={active} />

      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${scrollY * 0.08}px)`,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '90px 90px',
        maskImage: 'radial-gradient(ellipse 100% 70% at 50% 30%, #000 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 100% 70% at 50% 30%, #000 30%, transparent 85%)',
      }} />

      {/* vignette behind hero text so words always read */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 52% at 50% 42%, rgba(8,8,10,0.7) 0%, rgba(8,8,10,0.32) 50%, transparent 78%)',
      }} />

      {HERO_SCENES.map((s) => (
        <div key={s} style={{
          position: 'absolute', inset: 0,
          opacity: s === active ? 1 : 0,
          transition: 'opacity ' + FADE_MS + 'ms ease',
        }}>
          {s === 'stream'   && <SceneStream   accent={accent} live={s === active} />}
          {s === 'swarm'    && <SceneSwarm    accent={accent} live={s === active} />}
          {s === 'pipeline' && <ScenePipeline accent={accent} live={s === active} />}
          {s === 'diff'     && <SceneDiff     accent={accent} live={s === active} />}
        </div>
      ))}

      {/* scene indicator dots */}
      <div style={{
        position: 'absolute', left: 40, bottom: 24,
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <span className="wa-mono" style={{ fontSize: 9.5, color: 'rgba(244,243,238,0.34)', letterSpacing: 1.6, marginRight: 8 }}>
          SCENE {String(HERO_SCENES.indexOf(active) + 1).padStart(2, '0')} / {String(HERO_SCENES.length).padStart(2, '0')} · {active.toUpperCase()}
        </span>
        {HERO_SCENES.map((s) => (
          <span key={s} style={{
            width: s === active ? 22 : 4, height: 2, borderRadius: 1,
            background: s === active ? accent : 'rgba(244,243,238,0.18)',
            transition: 'all 700ms ease',
          }} />
        ))}
      </div>

      {/* film grain */}
      <div style={{
        position: 'absolute', inset: -40, opacity: 0.13,
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.7\'/></svg>")',
        animation: 'wa-grain 1.8s steps(5) infinite',
        mixBlendMode: 'overlay',
      }} />
    </div>
  );
}

function AuroraBlobs({ accent, scrollY, active }) {
  // Single, consistent palette across all scenes — atmosphere stays put while
  // the foreground scene swaps. This avoids the disorienting full-canvas color
  // shift that scene 3 (pipeline) used to cause.
  const palette = { a: accent, b: '#7A3DFF', c: '#5EE6F2' };

  return (
    <React.Fragment>
      <div style={{
        position: 'absolute',
        right: '-12%', top: (-160 + scrollY * -0.12) + 'px',
        width: 1100, height: 1100, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, ' + hexA(palette.a, 0.42) + ' 0%, ' + hexA(palette.a, 0.10) + ' 35%, transparent 65%)',
        filter: 'blur(50px)',
        animation: 'wa-float-a 22s ease-in-out infinite',
        transition: 'background 1200ms ease',
      }} />
      <div style={{
        position: 'absolute',
        left: '-18%', top: (260 + scrollY * -0.2) + 'px',
        width: 920, height: 920, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, ' + hexA(palette.b, 0.36) + ', transparent 65%)',
        filter: 'blur(60px)',
        animation: 'wa-float-b 28s ease-in-out infinite',
        transition: 'background 1200ms ease',
      }} />
      <div style={{
        position: 'absolute',
        left: '35%', top: (480 + scrollY * -0.06) + 'px',
        width: 620, height: 620, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, ' + hexA(palette.c, 0.22) + ', transparent 70%)',
        filter: 'blur(70px)',
        animation: 'wa-float-c 34s ease-in-out infinite',
        transition: 'background 1200ms ease',
      }} />
    </React.Fragment>
  );
}
