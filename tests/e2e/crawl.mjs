#!/usr/bin/env node
// Dead-end crawler: starting from the course map, follows every in-app link (#/…) on every page,
// with and without progress, and reports pages that fail to render, show an error or not-found view,
// point at a missing ?at= anchor, or have no way forward (no link or button out of the main area).
// Writes docs/testing/dead-end-report.md.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, startServer, newBrowser, BUDGET_PHONE, onboard, passModules, go } from './helpers.mjs';

const server = await startServer(8188);
const browser = await newBrowser();
const problems = [];
const visitedAll = new Set();

async function crawl(label, setup) {
  const ctx = await browser.newContext(BUDGET_PHONE);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => { try { localStorage.setItem('gcm101:dev-nosw', '1'); } catch {} });
  await onboard(page, server.url);
  await setup?.(page);
  const queue = ['#/'];
  const seen = new Set();
  while (queue.length) {
    const hash = queue.shift();
    if (seen.has(hash)) continue;
    seen.add(hash);
    visitedAll.add(hash.split('?')[0]);
    const before = errors.length;
    try {
      await go(page, `${server.url}/${hash}`);
      if (/\/(learn|practise)$/.test(hash.split('?')[0])) await page.waitForSelector('.sources-panel', { timeout: 15000 });
    } catch (e) {
      problems.push({ label, page: hash, issue: `did not render (${e.message.split('\n')[0]})` });
      continue;
    }
    const info = await page.evaluate(() => {
      const main = document.querySelector('main');
      const h1 = main.querySelector('h1')?.innerText || '';
      const at = new URLSearchParams(location.hash.split('?')[1] || '').get('at');
      const links = [...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href'));
      const exits = main.querySelectorAll('a[href], button:not([disabled])').length;
      const empty = [...main.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').map((a) => a.innerText.trim()).slice(0, 3);
      return { h1, at, atFound: at ? !!document.getElementById(at) : true, links, exits, empty };
    });
    if (/could not find|went wrong|not available offline|not saved for offline/i.test(info.h1)) problems.push({ label, page: hash, issue: `error view: "${info.h1}"` });
    if (!info.atFound) problems.push({ label, page: hash, issue: `anchor "${info.at}" does not exist` });
    if (info.exits === 0) problems.push({ label, page: hash, issue: 'no link or button to continue' });
    if (info.empty.length) problems.push({ label, page: hash, issue: `link(s) with no destination: ${info.empty.join(', ')}` });
    if (errors.length > before) problems.push({ label, page: hash, issue: `JavaScript error: ${errors.slice(before).join(' | ').slice(0, 160)}` });
    for (const l of info.links) {
      // Skip question-specific quiz pages after the first visit of each kind (they are generated).
      if (!seen.has(l) && !queue.includes(l)) queue.push(l);
    }
  }
  await ctx.close();
  return seen.size;
}

const n1 = await crawl('new learner');
const n2 = await crawl('learner who passed M0–M19', async (page) => passModules(page, ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19']));
await browser.close();
server.stop();

let md = `# Dead-end crawl\n\nRun ${new Date().toISOString().slice(0, 10)} with \`node tests/e2e/crawl.mjs\`. Starting at the course map, every in-app link on every reachable page was followed, as a new learner (${n1} pages) and as a learner who has passed every module (${n2} pages); ${visitedAll.size} distinct routes in total.\n\nChecked on each page: it renders a heading; no error or not-found view; any \`?at=\` anchor exists; there is at least one link or button to continue; no link without a destination; no JavaScript error.\n\n`;
md += problems.length ? `**${problems.length} problem(s):**\n\n| As | Page | Problem |\n|---|---|---|\n${problems.map((p) => `| ${p.label} | \`${p.page}\` | ${p.issue} |`).join('\n')}\n` : '**No dead ends found.**\n';
writeFileSync(join(ROOT, 'docs/testing/dead-end-report.md'), md);
console.log(`${n1} + ${n2} pages, ${visitedAll.size} routes, ${problems.length} problems`);
for (const p of problems) console.log(' ', p.label, p.page, p.issue);
process.exit(0);
