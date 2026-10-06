#!/usr/bin/env node
// Upgrade test: what a returning learner sees when a new version is deployed while their browser
// still holds the old one. The server mimics GitHub Pages (Cache-Control: max-age=600), which is
// what exposed the "Importing binding name … is not found" error.
//
// Three builds are made in a temp folder:
//   OLD — the last committed web/ (before module versioning), as currently deployed;
//   A   — this working tree;
//   B   — this working tree plus a NEW export in ui.js that a lazily loaded view (tools.js) imports,
//         i.e. exactly the shape of change that broke the course map.
// Each scenario loads one version, "deploys" the next by swapping files, keeps using the open
// page, reloads, accepts the update, and checks: no error views, no mismatch errors, and the
// page ends up on the new version.
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { chromePath } from '../../tools/browser.mjs';
import { ROOT, startServer, BUDGET_PHONE, idbSet } from './helpers.mjs';

const T = mkdtempSync(join(tmpdir(), 'gcm-upgrade-'));
const site = (name) => join(T, name);
// UPGRADE_BASELINE=1 builds A and B from the last commit instead (to prove the test catches the bug).
const BASELINE = process.env.UPGRADE_BASELINE === '1';
function variant(name, mutate) {
  if (BASELINE) { mkdirSync(site(name)); execSync(`git -C "${ROOT}" archive HEAD web | tar -x -C "${site(name)}" --strip-components=1`); mutate?.(site(name)); execSync(`git -C "${ROOT}" show HEAD:tools/build-sw.mjs > "${join(T, 'old-build-sw.mjs')}"`); return; }
  cpSync(join(ROOT, 'web'), site(name), { recursive: true });
  mutate?.(site(name));
  execSync(`node "${join(ROOT, 'tools/build-sw.mjs')}" "${site(name)}"`, { stdio: 'pipe' });
}
const edit = (dir, file, fn) => writeFileSync(join(dir, file), fn(readFileSync(join(dir, file), 'utf8')));
const markTools = (dir, expr) => edit(dir, 'js/views/tools.js', (s) => s.replace("  setTitle('Tools', 'Tools');", `  setTitle('Tools', 'Tools');\n  document.body.dataset.build = ${expr};`));

// OLD = last commit
mkdirSync(site('OLD'));
execSync(`git -C "${ROOT}" archive HEAD web | tar -x -C "${site('OLD')}" --strip-components=1`);
markTools(site('OLD'), "'OLD'");
variant('A', (d) => markTools(d, "'A'"));
variant('B', (d) => {
  edit(d, 'js/ui.js', (s) => `${s}\nexport const __probeB = 'B';\n`);
  edit(d, 'js/views/tools.js', (s) => s.replace("import { h, icon", "import { __probeB } from '../ui.js';\nimport { h, icon"));
  markTools(d, '__probeB');
});

const live = site('live');
const deploy = (name) => { rmSync(live, { recursive: true, force: true }); cpSync(site(name), live, { recursive: true }); };
const server = await startServer(8189, { dir: live, maxAge: 600 });
const cleanup = () => { server.stop(); rmSync(T, { recursive: true, force: true }); };
process.on('uncaughtException', (e) => { console.error(e); cleanup(); process.exit(1); });
process.on('unhandledRejection', (e) => { console.error(e); cleanup(); process.exit(1); });
const base = server.url;
const results = [];

async function scenario(title, from, to, { serviceWorker }) {
  deploy(from);
  const ctx = await chromium.launchPersistentContext(mkdtempSync(join(T, 'profile-')), { ...BUDGET_PHONE, headless: true, executablePath: chromePath() });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const problems = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  if (!serviceWorker) await page.addInitScript(() => { try { localStorage.setItem('gcm101:dev-nosw', '1'); } catch {} });
  const settle = async () => { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(400); };
  const visit = async (hash) => {
    await page.goto(`${base}/${hash}`).catch(() => {});
    await page.waitForSelector('main h1', { timeout: 20000 }).catch(() => problems.push(`no heading on ${hash}`));
    await settle();
    const h1 = await page.locator('main h1').first().innerText().catch(() => '');
    if (/went wrong|could not find|not available/i.test(h1)) problems.push(`error view on ${hash}: ${h1}`);
  };
  try {
    await page.goto(`${base}/#/welcome`);
    await page.waitForSelector('h1');
    await idbSet(page, 'settings', { onboarded: true });
    await page.reload();
    await visit('#/');
    await visit('#/m/m0/learn');
    if (serviceWorker) {
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.reload();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
      await settle();
    }
    deploy(to); // ---- new version goes live while the page is open
    // Keep using the already-open page, including views it has never loaded before.
    for (const r of ['#/tools', '#/glossary', '#/m/m4/learn', '#/settings', '#/']) await visit(r);
    // Reload, then accept the update prompt if one appears.
    await page.reload();
    await settle();
    const update = page.getByRole('button', { name: 'Update' });
    if (await update.isVisible().catch(() => false)) { await update.click(); await page.waitForTimeout(1500); await settle(); }
    await page.reload(); // second visit after the deploy
    await settle();
    for (const r of ['#/', '#/tools', '#/m/m13/practise', '#/m/m4/learn']) await visit(r);
    await visit('#/tools');
    const build = await page.evaluate(() => document.body.dataset.build);
    const mismatch = problems.filter((p) => /binding|export named|import not found|dynamically imported/i.test(p));
    const ok = build === to && !problems.length;
    results.push({ title, ok, build, problems: problems.length ? problems.slice(0, 4).join(' | ') : '', mismatch: mismatch.length });
    console.log(`${ok ? '✓' : '✗'} ${title} — ended on ${build}${problems.length ? ` — ${problems.slice(0, 3).join(' | ')}` : ''}`);
  } finally {
    await ctx.close();
  }
}

if (!BASELINE) await scenario('Service worker: currently deployed version → this version', 'OLD', 'A', { serviceWorker: true });
await scenario('Service worker: this version → next version with a new export', 'A', 'B', { serviceWorker: true });
await scenario('No service worker, 10-minute HTTP cache: this version → next version with a new export', 'A', 'B', { serviceWorker: false });

cleanup();
const passed = results.filter((r) => r.ok).length;
let md = `# Upgrade test\n\nRun ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC with \`node tests/e2e/upgrade.mjs\`. The server sends \`Cache-Control: max-age=600\` like GitHub Pages. In each scenario the learner has the old version open, a new version is deployed, they keep navigating (including to screens they have not opened before), reload and accept the update. A pass means no error screens or JavaScript errors at any point and the page ends on the new version.\n\n**${passed} of ${results.length} passed.**\n\n| Result | Scenario | Ended on | Problems |\n|:-:|---|:-:|---|\n`;
for (const r of results) md += `| ${r.ok ? '✅' : '❌'} | ${r.title} | ${r.build} | ${r.problems.replace(/\|/g, '\\|') || '—'} |\n`;
if (!BASELINE) writeFileSync(join(ROOT, 'docs/testing/upgrade-report.md'), md);
console.log(`${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
