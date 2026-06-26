import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import { SERIES } from './data/content.js';
import { POST_BODIES } from './data/postBodies.js';
import { WANav, WAFooter, WAEyebrow } from './components/ui.jsx';
import {
  useTweaks, TweaksPanel, TweakSection, TweakColor,
} from './components/Tweaks.jsx';
import { HomePage } from './pages/Home.jsx';
import { SeriesPage, PostPage } from './pages/Series.jsx';
import { ProductsPage, ProductPage } from './pages/Products.jsx';

// Merge full post bodies (data/postBodies.js) into SERIES entries.
SERIES.forEach((p) => {
  if (POST_BODIES[p.slug]) p.body = POST_BODIES[p.slug];
});

const TWEAK_DEFAULTS = {
  accent: '#FF3D52',
  startPage: 'home',
};

const ACCENT_PRESETS = [
  { value: '#FF3D52', label: 'Crimson' },
  { value: '#EC4899', label: 'Magenta' },
  { value: '#B84DFF', label: 'Violet'  },
  { value: '#34D08C', label: 'Emerald' },
  { value: '#5EE6F2', label: 'Cyan'    },
  { value: '#FFB84D', label: 'Amber'   },
];

function App() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return { page: t.startPage || 'home' };
    const [page, slug] = hash.split('/');
    return { page: page || 'home', slug };
  });

  const go = React.useCallback((next) => {
    setRoute(next);
    const hash = next.slug ? `${next.page}/${next.slug}` : next.page;
    window.location.hash = hash;
    const scroller = document.querySelector('.wa-page');
    if (scroller) scroller.scrollTop = 0;
  }, []);

  React.useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) return setRoute({ page: 'home' });
      const [page, slug] = hash.split('/');
      setRoute({ page: page || 'home', slug });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const accent = t.accent;

  let view;
  if (route.page === 'home')          view = <HomePage     accent={accent} go={go} />;
  else if (route.page === 'series')   view = <SeriesPage   accent={accent} go={go} />;
  else if (route.page === 'post')     view = <PostPage     accent={accent} go={go} slug={route.slug} />;
  else if (route.page === 'products') view = <ProductsPage accent={accent} go={go} />;
  else if (route.page === 'product')  view = <ProductPage  accent={accent} go={go} slug={route.slug} />;
  else if (route.page === 'about')    view = <AboutPage    accent={accent} go={go} />;
  else view = <HomePage accent={accent} go={go} />;

  return (
    <>
      {view}

      <TweaksPanel title="WithAgents · Tweaks">
        <TweakSection label="Navigate">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
            {[
              { k: 'home',     label: 'Home'     },
              { k: 'series',   label: 'Series'   },
              { k: 'products', label: 'Products' },
              { k: 'post',     label: 'Post · 01', slug: 'post-01-23479-sessions' },
              { k: 'post',     label: 'Post · 02', slug: 'post-02-three-agents'    },
              { k: 'product',  label: 'Anneal',    slug: 'anneal' },
              { k: 'product',  label: 'Runbooks',  slug: 'runbooks' },
              { k: 'product',  label: 'Memory',    slug: 'memory-layer' },
            ].map((it, i) => (
              <button key={i} onClick={() => go({ page: it.k, slug: it.slug })} style={{
                height: 26, borderRadius: 5, border: '0.5px solid rgba(0,0,0,0.12)',
                background: route.page === it.k && route.slug === it.slug ? '#29261b' : '#f5f2ea',
                color: route.page === it.k && route.slug === it.slug ? '#fff' : '#29261b',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>{it.label}</button>
            ))}
          </div>
        </TweakSection>

        <TweakSection label="Accent">
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {ACCENT_PRESETS.map((p) => (
              <button key={p.value}
                title={p.label}
                onClick={() => setT('accent', p.value)}
                style={{
                  flex: 1, height: 22,
                  border: t.accent === p.value ? '2px solid #29261b' : '0.5px solid rgba(0,0,0,0.1)',
                  borderRadius: 5, background: p.value, cursor: 'pointer', padding: 0,
                }} />
            ))}
          </div>
          <TweakColor label="Custom" value={t.accent} onChange={(v) => setT('accent', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function AboutPage({ accent, go }) {
  return (
    <div className="wa-page" style={{ height: '100%', overflow: 'auto' }}>
      <WANav accent={accent} route={{ page: 'about' }} go={go} />
      <section className="wa-pad-side" style={{ padding: '120px 40px', maxWidth: 820 }}>
        <WAEyebrow accent={accent} num={3} label="ABOUT" />
        <h1 className="wa-page-title" style={{ margin: 0, fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>
          Quiet, technical — <span className="wa-display" style={{ fontWeight: 400, fontStyle: 'italic', color: accent }}>agents that hold up.</span>
        </h1>
        <p style={{ marginTop: 22, fontSize: 17, color: 'rgba(244,243,238,0.7)', lineHeight: 1.6 }}>
          WithAgents is a small lab building durable infrastructure for AI agents — runbooks,
          memory, consensus, operator tooling. Our writing documents what works across 23,479
          real sessions and 27 projects. Everything here is evidence-based and reproducible.
        </p>
      </section>
      <WAFooter accent={accent} go={go} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
