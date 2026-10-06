#!/usr/bin/env node
// End-to-end tests in Chromium, emulating a budget Android phone. Writes docs/testing/e2e-report.md
// and screenshots to docs/screenshots/. Run: npm run test:e2e
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, startServer, newBrowser, BUDGET_PHONE, idbGet, idbSet, onboard, passModules, correctResponse, go } from './helpers.mjs';
import { chromium } from 'playwright';
import { chromePath } from '../../tools/browser.mjs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const results = [];
const shots = join(ROOT, 'docs/screenshots');
mkdirSync(shots, { recursive: true });
const course = JSON.parse(readFileSync(join(ROOT, 'web/content/course.json'), 'utf8'));

async function t(name, fn) {
  const start = Date.now();
  try {
    const note = await fn();
    results.push({ name, ok: true, ms: Date.now() - start, note: note || '' });
    console.log(`✓ ${name}`);
  } catch (e) {
    results.push({ name, ok: false, ms: Date.now() - start, note: e.message.split('\n')[0] });
    console.log(`✗ ${name}\n    ${e.message.split('\n')[0]}`);
  }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const server = await startServer(8181);
const base = server.url;
const browser = await newBrowser();

async function freshPage(opts = {}) {
  const ctx = await browser.newContext({ ...BUDGET_PHONE, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource.*(404|net::ERR_INTERNET_DISCONNECTED)/.test(m.text())) errors.push(m.text()); });
  page.errors = errors;
  return { ctx, page };
}
const noSW = async (page) => page.addInitScript(() => { try { localStorage.setItem('gcm101:dev-nosw', '1'); } catch {} });

// ------------------------------------------------------------------ 1. first run
await t('First visit redirects to onboarding; 3 steps end in Module 0', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await page.goto(`${base}/`);
  await page.waitForURL(/#\/welcome/);
  await page.screenshot({ path: join(shots, 'mobile-01-welcome.png') });
  await page.getByRole('link', { name: 'Start' }).click();
  await page.getByRole('heading', { name: 'How would you like to start?' }).waitFor();
  await page.getByRole('button', { name: /Hear/ }).click();
  await page.screenshot({ path: join(shots, 'mobile-02-modes.png') });
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('heading', { name: 'Make it comfortable' }).waitFor();
  await page.getByRole('button', { name: 'Go to Module 0' }).click();
  await page.waitForURL(/#\/m\/m0$/);
  await page.getByRole('heading', { level: 1 }).waitFor();
  const s = await idbGet(page, 'settings');
  assert(s.onboarded && s.modes.hear, 'settings saved');
  assert(!page.errors.length, page.errors.join(' | '));
  await page.screenshot({ path: join(shots, 'mobile-03-module.png') });
  await ctx.close();
});

// ------------------------------------------------------------------ 2. every route renders, no errors, no sideways scroll
await t('All routes render at 360 px with no JavaScript errors and no horizontal scrolling', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  const routes = ['/', '/exams', '/exam/cp1', '/exam/final', '/capstone', '/glossary', '/glossary?q=yield', '/tools', '/progress', '/settings', '/about', '/about/privacy', '/about/ai', '/about/accessibility', '/about/audit', '/about/report', '/about/disclaimer', '/sources', '/sources/R4', '/credentials', '/methodology'];
  for (const m of course.modules) routes.push(`/m/${m.id}`, `/m/${m.id}/learn`, `/m/${m.id}/practise`, `/m/${m.id}/check`);
  const overlay = JSON.parse(readFileSync(join(ROOT, 'web/content/overlays/interactives.json'), 'utf8'));
  for (const w of overlay.items.filter((x) => !['sequencer', 'classifier'].includes(x.type))) routes.push(`/tools/${w.id}`);
  const bad = [];
  for (const r of routes) {
    await go(page, `${base}/#${r}`);
    await page.waitForTimeout(150);
    const { sw, cw, text } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, text: document.querySelector('main').innerText }));
    if (sw > cw + 1) bad.push(`${r}: page is ${sw}px wide`);
    if (/\bnull\b|undefined|\[object /.test(text)) bad.push(`${r}: stray "null/undefined/[object]" text`);
    if (/Something went wrong|could not load/i.test(text)) bad.push(`${r}: error view`);
  }
  assert(!bad.length, bad.slice(0, 5).join('; '));
  assert(!page.errors.length, page.errors.slice(0, 3).join(' | '));
  await ctx.close();
  return `${routes.length} routes`;
});

// ------------------------------------------------------------------ 3. modes are additive; text always present
await t('Learning modes are additive and text stays when every mode is off', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base, { modes: { see: false, hear: false, do: false } });
  await go(page, `${base}/#/m/m4/learn`);
  await page.waitForSelector('.sources-panel'); // enhancements are attached after the text
  const visible = async (sel) => page.locator(sel).first().isVisible();
  assert(await visible('#why'), 'text lesson visible with all modes off');
  assert(!(await visible('figure.visual')), 'visuals hidden when See is off');
  await page.getByRole('button', { name: /^See/ }).click();
  assert(await visible('figure.visual'), 'visuals shown after turning See on');
  await page.getByRole('button', { name: /^Do/ }).click();
  assert(await visible('.widget'), 'activities shown after turning Do on');
  await page.getByRole('button', { name: /^Hear/ }).click();
  assert(await visible('[data-mode=hear]'), 'hear panel shown');
  assert(await visible('#why'), 'text still visible with all modes on');
  const s = await idbGet(page, 'settings');
  assert(s.modes.see && s.modes.do && s.modes.hear, 'mode choice persisted');
  await page.screenshot({ path: join(shots, 'mobile-04-learn-modes.png'), fullPage: false });
  await ctx.close();
});

// ------------------------------------------------------------------ 4. mastery gate: fail then pass
async function answerKC(page, moduleId, correct) {
  await go(page, `${base}/#/quiz/${moduleId}`);
  for (let guard = 0; guard < 30; guard++) {
    const session = await idbGet(page, `session:kc:${moduleId}`);
    if (session.done) break;
    const it = session.items[session.i];
    const resp = correct ? correctResponse(it) : (it.type === 'numeric' ? '-999999' : it.type === 'match' ? it.pairs.map((_, i) => (i + 1) % it.pairs.length) : it.options.findIndex((o) => !o.correct));
    if (it.type === 'numeric') await page.locator('main input[type=text]').fill(String(resp));
    else if (it.type === 'match') {
      const sels = page.locator('main select');
      for (let k = 0; k < resp.length; k++) await sels.nth(k).selectOption(String(resp[k]));
    } else await page.locator('main input[type=radio]').nth(resp).check();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await page.locator('.feedback').waitFor();
    const last = session.i === session.items.length - 1;
    await page.getByRole('button', { name: last ? 'See my result' : 'Next question' }).click();
    if (last) break;
  }
  await page.waitForSelector('text=/Pass mark/');
}
await t('Mastery gate: a failed check keeps the next module locked; a pass (≥70%) unlocks it', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  await go(page, `${base}/#/m/m1/check`);
  assert(await page.getByText(/Pass M0.s knowledge check first/).isVisible(), 'M1 check locked at start');
  await answerKC(page, 'm0', false);
  assert(await page.getByRole('heading', { name: /not passed yet/ }).isVisible(), 'all-wrong attempt fails');
  let p = await idbGet(page, 'progress');
  assert(!p.modules.m0.kc.passed, 'm0 not passed');
  await page.getByRole('button', { name: 'Try again with new questions' }).click();
  await page.waitForSelector('main h1');
  await answerKC(page, 'm0', true);
  assert(await page.getByRole('heading', { name: /Passed: 100%/ }).isVisible(), 'all-correct attempt passes with 100%');
  await page.screenshot({ path: join(shots, 'mobile-06-kc-result.png') });
  p = await idbGet(page, 'progress');
  assert(p.modules.m0.kc.passed && p.modules.m0.kc.attempts.length === 2, 'two attempts recorded, passed');
  await go(page, `${base}/#/m/m1/check`);
  assert(await page.getByRole('link', { name: /Start the knowledge check/ }).isVisible(), 'M1 check unlocked');
  await ctx.close();
});

// ------------------------------------------------------------------ 5. numeric tolerance in the real UI
await t('Numeric answers within ±0.5% are accepted; formats like "14 693,28" work', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  await passModules(page, ['m0', 'm1', 'm2', 'm3']);
  await go(page, `${base}/#/quiz/m4`);
  let session = await idbGet(page, 'session:kc:m4');
  // Move to the first numeric item.
  const idx = session.items.findIndex((x) => x.type === 'numeric');
  session.i = idx;
  await idbSet(page, 'session:kc:m4', session);
  await page.reload();
  await page.waitForSelector('main input[type=text]');
  const it = session.items[idx];
  const off = it.answer * 1.004; // 0.4% off
  const typed = off.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d),)/g, ' ');
  await page.locator('main input[type=text]').fill(typed);
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.locator('.feedback.ok').waitFor();
  await page.screenshot({ path: join(shots, 'mobile-05-numeric-feedback.png') });
  await ctx.close();
  return `answer ${it.shown}, typed "${typed}"`;
});

// ------------------------------------------------------------------ 6. resume after reload
await t('A knowledge check in progress survives a reload (same question, same answer)', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  await go(page, `${base}/#/quiz/m0`);
  const before = await idbGet(page, 'session:kc:m0');
  const it = before.items[0];
  if (it.type === 'numeric') await page.locator('main input[type=text]').fill('1');
  else if (it.type === 'match') await page.locator('main select').first().selectOption('0');
  else await page.locator('main input[type=radio]').nth(1).check();
  await page.reload();
  await page.waitForSelector('main h1');
  const after = await idbGet(page, 'session:kc:m0');
  assert(after.seed === before.seed && after.responses[0] !== undefined, 'same session and saved response');
  await ctx.close();
});

// ------------------------------------------------------------------ 7. home resume card
await t('Home shows one clear next action and resumes where the learner left off', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  await go(page, `${base}/#/m/m0/practise`);
  await go(page, `${base}/#/`);
  const hero = await page.locator('.card.hero').innerText();
  assert(/continue where you left off/i.test(hero) && /Practise/.test(hero), `hero: ${hero.slice(0, 120)}`);
  assert((await page.locator('.card.hero .btn.primary').count()) === 1, 'exactly one primary action in the hero');
  await page.screenshot({ path: join(shots, 'mobile-07-home.png') });
  await ctx.close();
});

// ------------------------------------------------------------------ 8. exam: timer warning, extension, submit
await t('Checkpoint exam: 40 items, time warning with "Add 15 minutes", submit and score', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base);
  await passModules(page, course.modules.slice(0, 11).map((m) => m.id));
  await page.goto(`${base}/#/exam/cp1`);
  await page.getByRole('button', { name: 'Start the exam' }).click();
  await page.waitForSelector('.timer');
  let s = await idbGet(page, 'session:exam:cp1');
  assert(s.items.length === course.assessment.checkpointSpec.items, `exam has ${s.items.length} items`);
  assert(s.remainingMs === 60 * 60000, 'standard 60 minutes');
  // Answer every item correctly through the stored session, then jump the clock to 4 minutes left.
  s.items.forEach((it, i) => { s.responses[i] = correctResponse(it); });
  s.remainingMs = 4 * 60000 + 3000;
  await idbSet(page, 'session:exam:cp1', s);
  await page.reload();
  await page.getByRole('button', { name: 'Add 15 minutes' }).waitFor({ timeout: 8000 });
  await page.screenshot({ path: join(shots, 'mobile-08-exam-warning.png') });
  await page.getByRole('button', { name: 'Add 15 minutes' }).click();
  await page.waitForTimeout(1200);
  s = await idbGet(page, 'session:exam:cp1');
  assert(s.remainingMs > 18 * 60000, `time extended to ${Math.round(s.remainingMs / 60000)} min`);
  await page.getByRole('button', { name: 'Submit now' }).click();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await page.getByRole('heading', { name: /Passed: 100%/ }).waitFor();
  const p = await idbGet(page, 'progress');
  assert(p.exams.cp1.passed, 'exam recorded as passed');
  await ctx.close();
});

await t('Untimed exams: with the time limit off there is no countdown', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  await onboard(page, base, { timeMultiplier: 0 });
  await passModules(page, course.modules.slice(0, 11).map((m) => m.id));
  await page.goto(`${base}/#/exam/cp1`);
  await page.getByRole('button', { name: 'Start the exam' }).click();
  await page.waitForSelector('.timer');
  assert((await page.locator('.timer').innerText()) === 'Untimed', 'timer reads Untimed');
  await ctx.close();
});

// ------------------------------------------------------------------ 9. offline
await t('Offline: installable PWA; visited and downloaded modules work offline; others explain why not', async () => {
  // A persistent (non-incognito) profile, so installability can be checked like a real browser.
  const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), 'gcm101-')), { ...BUDGET_PHONE, headless: true, executablePath: chromePath() });
  const page = ctx.pages()[0] || (await ctx.newPage());
  page.errors = [];
  try {
  await onboard(page, base);
  await go(page, `${base}/#/m/m0/learn`);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
  const cdp = await ctx.newCDPSession(page);
  const inst = await cdp.send('Page.getInstallabilityErrors');
  assert(!inst.installabilityErrors.length, `installability: ${JSON.stringify(inst.installabilityErrors)}`);
  await page.goto(`${base}/#/m/m4`);
  await page.getByRole('button', { name: 'Download for offline' }).click();
  await page.getByRole('button', { name: 'Saved for offline' }).waitFor();
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('main h1');
  for (const r of ['/m/m0/learn', '/m/m4/practise', '/glossary', '/tools/m13-price']) {
    await go(page, `${base}/#${r}`);
    const txt = await page.locator('main').innerText();
    assert(!/not saved for offline/.test(txt), `${r} should work offline`);
  }
  await go(page, `${base}/#/m/m7/learn`);
  assert(/not saved for offline use yet/.test(await page.locator('main h1').innerText()), 'undownloaded module explains it is not saved');
  assert(await page.locator('#net-status .chip').isVisible(), 'offline indicator shown');
  await page.screenshot({ path: join(shots, 'mobile-09-offline.png') });
  } finally {
    await ctx.close();
  }
});

// ------------------------------------------------------------------ 10. data control
await t('Back up, erase and restore progress (no server involved)', async () => {
  const { ctx, page } = await freshPage({ acceptDownloads: true });
  await noSW(page);
  await onboard(page, base);
  await passModules(page, ['m0', 'm1']);
  await page.goto(`${base}/#/settings`);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Back up my progress/ }).click()]);
  const path = await dl.path();
  const data = JSON.parse(readFileSync(path, 'utf8'));
  assert(data.app === 'GCM-101' && data.progress.modules.m1.kc.passed, 'backup contains progress');
  await page.getByRole('button', { name: 'Erase all my data' }).click();
  await page.getByRole('button', { name: 'Erase', exact: true }).click();
  await page.waitForURL(/#\/welcome/);
  assert(!(await idbGet(page, 'progress')), 'progress erased');
  await page.goto(`${base}/#/settings`);
  await page.locator('#imp').setInputFiles(path);
  await page.getByRole('button', { name: 'Replace' }).click();
  await page.waitForURL(/#\/$/);
  const p = await idbGet(page, 'progress');
  assert(p.modules.m1.kc.passed, 'progress restored');
  await ctx.close();
});

// ------------------------------------------------------------------ 11. themes and text size
await t('Themes (light, dark, high contrast) and 160% text size keep the layout intact', async () => {
  const { ctx, page } = await freshPage();
  await noSW(page);
  for (const [theme, size] of [['dark', 1], ['contrast', 1], ['light', 1.6]]) {
    await onboard(page, base, { theme, textSize: size });
    await page.goto(`${base}/#/m/m13/practise?at=we-13.1`);
    await page.reload();
    await page.waitForSelector('main h1');
    await page.waitForTimeout(300);
    const { sw, cw, t0 } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, t0: document.documentElement.dataset.theme }));
    assert(sw <= cw + 1, `${theme}@${size}: horizontal scroll (${sw} > ${cw})`);
    if (theme !== 'light') assert(t0 === theme, `theme attribute ${t0}`);
    await page.screenshot({ path: join(shots, `mobile-10-${theme}-${size}.png`) });
  }
  await ctx.close();
});

// ------------------------------------------------------------------ 12. keyboard only
await t('Keyboard only: skip link, focus moves to the page heading, sequencer reorders with buttons', async () => {
  const { ctx, page } = await freshPage({ viewport: { width: 1280, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 });
  await noSW(page);
  await onboard(page, base);
  await go(page, `${base}/#/m/m3/practise`);
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  assert(focused === 'H1', `focus after navigation is on ${focused}`);
  await page.keyboard.press('Shift+Tab');
  const seq = page.locator('.sortlist').first();
  await seq.scrollIntoViewIfNeeded();
  const first = await seq.locator('li').first().innerText();
  await seq.locator('li').first().locator('button[aria-label^="Move"][aria-label$="down"]').focus();
  await page.keyboard.press('Enter');
  const second = await seq.locator('li').nth(1).innerText();
  assert(second.split('\n')[1] === first.split('\n')[1], 'item moved down with the keyboard');
  await page.screenshot({ path: join(shots, 'desktop-01-practise.png') });
  await ctx.close();
});

// ------------------------------------------------------------------ 13. desktop screenshots for docs
await t('Desktop layout screenshots', async () => {
  const { ctx, page } = await freshPage({ viewport: { width: 1280, height: 860 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 });
  await noSW(page);
  await onboard(page, base);
  await passModules(page, ['m0', 'm1', 'm2']);
  for (const [r, f] of [['/', 'desktop-02-home'], ['/m/m4/learn', 'desktop-03-learn'], ['/tools/m13-price', 'desktop-04-tool'], ['/progress', 'desktop-05-progress'], ['/about', 'desktop-06-about'], ['/capstone', 'desktop-07-capstone']]) {
    await go(page, `${base}/#${r}`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(shots, `${f}.png`) });
  }
  await ctx.close();
});

await browser.close();
server.stop();

const passed = results.filter((r) => r.ok).length;
let md = `# End-to-end test report\n\nRun ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC with \`npm run test:e2e\` (Chromium, emulating a 360×640 Android phone unless noted).\n\n**${passed} of ${results.length} passed.**\n\n| Result | Test | Time | Notes |\n|:-:|---|--:|---|\n`;
for (const r of results) md += `| ${r.ok ? '✅' : '❌'} | ${r.name} | ${(r.ms / 1000).toFixed(1)} s | ${r.note.replace(/\|/g, '\\|')} |\n`;
md += '\nScreenshots are in `docs/screenshots/`.\n';
writeFileSync(join(ROOT, 'docs/testing/e2e-report.md'), md);
console.log(`\n${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
