// Shared helpers for the browser test scripts: start the static server, launch Chromium,
// emulate a budget Android phone, and read/write the app's IndexedDB state.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from '../../tools/browser.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export async function startServer(port = 8181) {
  const proc = spawn(process.execPath, [join(ROOT, 'tools/serve.mjs'), join(ROOT, 'web'), String(port)], { stdio: 'pipe' });
  await new Promise((resolve, reject) => {
    proc.stdout.on('data', (d) => { if (String(d).includes('Serving')) resolve(); });
    proc.on('error', reject);
    setTimeout(resolve, 1500);
  });
  return { url: `http://localhost:${port}`, stop: () => proc.kill() };
}

// A budget Android phone (360×640 CSS px, 2× DPR, touch).
export const BUDGET_PHONE = {
  viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 11; moto e) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
};

export async function newBrowser() {
  return launch({ headless: true });
}

export async function idbGet(page, key) {
  return page.evaluate((k) => new Promise((res) => {
    const r = indexedDB.open('gcm101', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => { const g = r.result.transaction('kv').objectStore('kv').get(k); g.onsuccess = () => res(g.result); g.onerror = () => res(undefined); };
  }), key);
}
export async function idbSet(page, key, value) {
  return page.evaluate(([k, v]) => new Promise((res) => {
    const r = indexedDB.open('gcm101', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => { const tx = r.result.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = () => res(true); };
  }), [key, value]);
}
// Mark the learner as onboarded so tests can open pages directly.
export async function onboard(page, base, extra = {}) {
  await page.goto(`${base}/#/welcome`);
  await page.waitForSelector('h1');
  await idbSet(page, 'settings', { onboarded: true, modes: { see: true, hear: true, do: true }, tracks: { A: true, B: true, C: true }, ...extra });
  await page.reload(); // the app caches settings in memory; reload so it reads the new state
  await page.waitForSelector('main h1');
}
export async function passModules(page, ids) {
  const p = (await idbGet(page, 'progress')) || { version: 1, modules: {}, exams: {}, capstone: { milestones: {}, notes: {}, rubric: {} } };
  for (const id of ids) p.modules[id] = { learn: { done: true }, practise: { done: true }, kc: { attempts: [{ at: new Date().toISOString(), pct: 0.9 }], best: 0.9, passed: true }, applied: {}, time: 0 };
  await idbSet(page, 'progress', p);
  await page.reload();
  await page.waitForSelector('main h1');
}
// Answer an item correctly using the stored session (tests only).
export function correctResponse(item) {
  if (item.type === 'numeric') return item.shown.replace('−', '-');
  if (item.type === 'match') return item.pairs.map((_, i) => i);
  return item.options.findIndex((o) => o.correct);
}

// Navigate (usually a hash change, which keeps the document) and wait for the NEW page to render.
export async function go(page, url) {
  await page.evaluate(() => document.querySelector('main')?.firstElementChild?.setAttribute('data-stale', '1')).catch(() => {});
  await page.goto(url);
  await page.waitForFunction(() => {
    const c = document.querySelector('main')?.firstElementChild;
    return c && !c.hasAttribute('data-stale') && document.querySelector('main h1');
  }, null, { timeout: 20000 });
}
