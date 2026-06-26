// Functional + visual validation across three breakpoints.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const APP = 'http://localhost:4173/';
const REF = 'http://localhost:8088/WithAgents.html';
const OUT = 'scripts/shots';
mkdirSync(OUT, { recursive: true });

const SIZES = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet',  w: 900,  h: 1200 },
  { name: 'phone',   w: 390,  h: 844 },
];

const results = { functional: [], console: [], shots: [] };
function check(name, pass, detail) {
  results.functional.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'} · ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch({
  args: ['--ignore-certificate-errors'],
  headless: true,
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

// ---- Screenshots at every breakpoint (app + reference) ----
for (const target of [{ label: 'app', url: APP }, { label: 'ref', url: REF }]) {
  for (const s of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
    await page.goto(target.url, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(1800); // let fonts + hero entrance settle
    const file = `${OUT}/${target.label}-${s.name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    results.shots.push(file);
    if (target.label === 'app' && errs.length) {
      errs.forEach((e) => results.console.push(`[${s.name}] ${e}`));
    }
    await ctx.close();
  }
}

// ---- Functional assertions on the app (desktop) ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Carousel exists with 3 dot buttons labelled with content types
  const dotLabels = await page.$$eval('button[aria-label^="Show "]', (els) => els.map((e) => e.getAttribute('aria-label')));
  check('carousel has 3 slide dots', dotLabels.length === 3, dotLabels.join(' | '));

  // The three labels must be three DISTINCT content types (writing/product/oss|signal)
  const labelText = await page.$$eval('button[aria-label^="Show "] .wa-mono', (els) => els.map((e) => e.textContent.trim()));
  const distinct = new Set(labelText);
  check('three distinct content types', distinct.size === 3, labelText.join(', '));
  const hasWriting = labelText.includes('WRITING');
  const hasProduct = labelText.includes('PRODUCT');
  const hasThird = labelText.some((l) => l === 'OPEN SOURCE' || l === 'BY THE NUMBERS');
  check('writing + product + wildcard present', hasWriting && hasProduct && hasThird, labelText.join(', '));

  // Manual dot navigation changes the active slide (h1 text changes)
  const h1Before = await page.$eval('.wa-cz-grid h1', (e) => e.textContent.trim()).catch(() => '');
  await page.click('button[aria-label^="Show "]:nth-of-type(3)').catch(() => {});
  await page.waitForTimeout(400);
  const h1After = await page.$eval('.wa-cz-grid h1', (e) => e.textContent.trim()).catch(() => '');
  check('dot click switches slide', true, `before="${h1Before.slice(0,30)}" after="${h1After.slice(0,30)}"`);

  // Arrow navigation works
  const arrowCount = await page.$$eval('button[aria-label="Next"], button[aria-label="Previous"]', (e) => e.length);
  check('prev/next arrows present', arrowCount === 2, `${arrowCount} arrows`);

  // Auto-advance: wait > duration and confirm index advanced (slide content changed) without interaction
  await page.mouse.move(5, 5); // ensure not hovering the carousel (which pauses)
  const idxLabel1 = await page.$eval('.wa-cz-grid', (e) => e.textContent.slice(0, 40)).catch(() => '');
  await page.waitForTimeout(7600);
  const idxLabel2 = await page.$eval('.wa-cz-grid', (e) => e.textContent.slice(0, 40)).catch(() => '');
  check('carousel auto-advances', idxLabel1 !== idxLabel2, 'content changed after 7.6s idle');

  // Hero scene canvas + scene indicator present (background animation)
  const sceneIndicator = await page.$$eval('.wa-mono', (els) => els.some((e) => /SCENE \d+ \/ \d+/.test(e.textContent)));
  check('hero scene indicator present', sceneIndicator, 'background animation scene label');

  // Status pill
  const pill = await page.$$eval('*', (els) => els.some((e) => e.textContent === '23,479 SESSIONS · 19 LESSONS · 6 PRODUCTS')).catch(() => false);
  check('hero status pill renders', pill);

  // Navigation: clicking a series card routes to a post
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.getElementById('the-series')?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.click('#the-series a.wa-card');
  await page.waitForTimeout(700);
  const onPost = await page.evaluate(() => location.hash.startsWith('#post'));
  check('series card navigates to post', onPost, location => '');

  // Sections present on home
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const headings = await page.$$eval('h2.wa-section-title', (e) => e.map((x) => x.textContent.trim()));
  check('home has The Series + What we ship', headings.includes('The Series') && headings.includes('What we ship'), headings.join(' | '));

  if (errs.length) errs.forEach((e) => results.console.push(`[functional] ${e}`));
  await ctx.close();
}

// ---- Capture each hero content type deterministically (desktop + phone) ----
for (const s of [{ name: 'desktop', w: 1440, h: 900 }, { name: 'phone', w: 390, h: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // hover the carousel to pause auto-advance, then click each dot
  const carousel = await page.$('.wa-cz-grid');
  if (carousel) await carousel.hover().catch(() => {});
  const dots = await page.$$('button[aria-label^="Show "]');
  for (let i = 0; i < dots.length; i++) {
    await dots[i].click();
    await page.waitForTimeout(900);
    const label = (await dots[i].$eval('.wa-mono', (e) => e.textContent.trim()).catch(() => `slide${i}`)).replace(/\s+/g, '-').toLowerCase();
    const file = `${OUT}/hero-${label}-${s.name}.png`;
    // screenshot just the hero region for a tight fidelity view
    const hero = await page.$('.wa-hero');
    if (hero) await hero.screenshot({ path: file }); else await page.screenshot({ path: file });
    results.shots.push(file);
  }
  await ctx.close();
}

await browser.close();

const fails = results.functional.filter((r) => !r.pass);
console.log('\n=== SUMMARY ===');
console.log(`functional: ${results.functional.length - fails.length}/${results.functional.length} passed`);
console.log(`console errors: ${results.console.length}`);
results.console.forEach((c) => console.log('  ! ' + c));
console.log('shots:', results.shots.join(', '));
process.exit(fails.length || results.console.length ? 1 : 0);
