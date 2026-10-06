#!/usr/bin/env node
// Lighthouse audits (performance, accessibility, best practices, SEO) under two network profiles:
//   - "mobile": Lighthouse default mobile (simulated slow 4G, 4× CPU slowdown)
//   - "3g-budget": a budget phone on 3G (300 ms RTT, 400 kbps down, 6× CPU slowdown)
// Lighthouse 12 no longer has a PWA category; installability and offline start are tested in
// tests/e2e/run.mjs with Chrome's own installability check.
// Writes docs/testing/lighthouse/*.html and docs/testing/performance-report.md.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, startServer } from './helpers.mjs';
import { chromePath } from '../../tools/browser.mjs';

const OUT = join(ROOT, 'docs/testing/lighthouse');
mkdirSync(OUT, { recursive: true });
const server = await startServer(8184);
const chrome = await chromeLauncher.launch({ chromePath: chromePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
const profiles = {
  mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }, throttlingMethod: 'simulate' },
  '3g-budget': { formFactor: 'mobile', screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }, throttlingMethod: 'simulate', throttling: { rttMs: 300, throughputKbps: 400, cpuSlowdownMultiplier: 6, requestLatencyMs: 300 * 3.75, downloadThroughputKbps: 400, uploadThroughputKbps: 400 } },
};
const pages = [['First visit (welcome)', '/'], ['Lesson: M4 Learn', '/#/m/m4/learn'], ['Glossary', '/#/glossary']];
const rows = [];
for (const [pname, cfg] of Object.entries(profiles)) {
  for (const [name, path] of pages) {
    const res = await lighthouse(`${server.url}${path}`, { port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, { extends: 'lighthouse:default', settings: cfg });
    const lhr = res.lhr;
    const file = `${pname}-${name.replace(/\W+/g, '-').toLowerCase()}.html`;
    writeFileSync(join(OUT, file), res.report);
    const a = lhr.audits;
    rows.push({
      profile: pname, name, file,
      perf: Math.round(lhr.categories.performance.score * 100), a11y: Math.round(lhr.categories.accessibility.score * 100),
      bp: Math.round(lhr.categories['best-practices'].score * 100), seo: Math.round(lhr.categories.seo.score * 100),
      fcp: a['first-contentful-paint'].displayValue, lcp: a['largest-contentful-paint'].displayValue, tbt: a['total-blocking-time'].displayValue,
      cls: a['cumulative-layout-shift'].displayValue, weight: a['total-byte-weight'].displayValue,
    });
    console.log(pname, name, rows.at(-1).perf, rows.at(-1).a11y, rows.at(-1).bp, rows.at(-1).seo, rows.at(-1).lcp);
  }
}
await chrome.kill();
server.stop();

// Initial payload: what a first visit downloads before any lesson (gzip sizes).
const first = ['index.html', 'css/app.css', 'js/boot.js', 'js/app.js', 'js/ui.js', 'js/store.js', 'js/content.js', 'js/views/onboarding.js', 'content/course.json', 'manifest.webmanifest', 'icons/icon.svg'];
const gz = (f) => gzipSync(readFileSync(join(ROOT, 'web', f))).length;
const firstGz = first.reduce((s, f) => s + gz(f), 0);
const jsAll = [];
(function walk(d) { for (const n of readdirSync(join(ROOT, 'web', d))) { const p = `${d}/${n}`; if (statSync(join(ROOT, 'web', p)).isDirectory()) walk(p); else if (p.endsWith('.js')) jsAll.push(p.slice(1)); } })('/js');
const jsGz = jsAll.reduce((s, f) => s + gz(f), 0);

let md = `# Performance and Lighthouse report\n\nRun ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC with \`npm run audit:lighthouse\` (Lighthouse ${'12'}, headless Chromium, 360×640 phone). HTML reports are in \`docs/testing/lighthouse/\`.\n\n`;
md += '| Profile | Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |\n|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|\n';
for (const r of rows) md += `| ${r.profile} | [${r.name}](lighthouse/${r.file}) | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.fcp} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.weight} |\n`;
md += `\n**Profiles.** *mobile* = Lighthouse default (simulated slow 4G: 150 ms RTT, 1.6 Mbps, 4× CPU slowdown). *3g-budget* = 300 ms RTT, 400 kbps, 6× CPU slowdown — a budget Android phone on a congested 3G connection.\n\n`;
md += `## Payload budget\n\n| Item | Size (gzip) |\n|---|--:|\n| First visit (HTML, CSS, core JS, onboarding view, course index, manifest, icon) | ${(firstGz / 1024).toFixed(1)} KB |\n| All app JavaScript (loaded on demand per screen) | ${(jsGz / 1024).toFixed(1)} KB |\n| One module's content (largest, M12) | ${(gz('content/modules/m12.json') / 1024).toFixed(1)} KB |\n| Glossary (loaded with the first lesson) | ${(gz('content/glossary.json') / 1024).toFixed(1)} KB |\n| Audio summary per module (optional) | 0.6–1.0 MB |\n| Python runtime (optional, on first use) | ≈ 12 MB (+ ≈ 10 MB scipy) |\n\nNo web fonts, frameworks, images or third-party scripts load at start-up. Views, widgets, the calculator, simulations and Python load only when opened.\n`;
writeFileSync(join(ROOT, 'docs/testing/performance-report.md'), md);
console.log(`first visit ${(firstGz / 1024).toFixed(1)} KB gz; all JS ${(jsGz / 1024).toFixed(1)} KB gz`);
