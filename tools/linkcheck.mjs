#!/usr/bin/env node
// Checks every external link in the syllabus and the app's authored files. Writes
// docs/testing/link-report.md. A link "passes" on HTTP 2xx/3xx; 401/403/429 are reported as
// "blocked by the site to automated checks" (open them in a browser to confirm).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['Intro-Global-Capital-Markets-Syllabus.md', ...readdirSync(join(ROOT, 'web/content/overlays')).map((f) => `web/content/overlays/${f}`), 'web/js/views/about.js', 'web/js/widgets/index.js', 'web/js/widgets/python.js'];
const urls = new Map();
for (const f of files) {
  const text = readFileSync(join(ROOT, f), 'utf8');
  // Markdown autolinks <https://…> may contain apostrophes; bare URLs stop at quotes.
  const found = [...text.matchAll(/<(https?:\/\/[^>\s]+)>/g)].map((m) => m[1]).concat([...text.matchAll(/https?:\/\/[^\s<>)"'`\]]+/g)].map((m) => m[0]));
  for (const raw of found) {
    const u = raw.replace(/[.,;]+$/, '');
    if (/\.\.\.|\/\.\.\/?$/.test(u) || [...urls.keys()].some((k) => k.startsWith(u) && k !== u)) continue;
    if (/localhost|example\.|\$\{|…/.test(u)) continue;
    if (!urls.has(u)) urls.set(u, new Set());
    urls.get(u).add(f);
  }
}
const UA = 'Mozilla/5.0 (GCM-101 link check; +https://github.com/amyataza/gcm101)';
async function check(u) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(u, { method, redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
      if (res.ok || method === 'GET') return { status: res.status, final: res.url };
    } catch (e) {
      if (method === 'GET') return { status: 0, error: e.cause?.code || e.name };
    }
  }
}
const rows = [];
const list = [...urls.keys()];
for (let i = 0; i < list.length; i += 6) {
  const batch = await Promise.all(list.slice(i, i + 6).map(async (u) => ({ u, ...(await check(u)) })));
  rows.push(...batch);
}
const verdict = (r) => (r.status >= 200 && r.status < 400 ? 'ok' : [401, 403, 429].includes(r.status) ? 'blocked' : 'broken');
let md = `# Link report\n\nRun ${new Date().toISOString().slice(0, 10)} with \`npm run linkcheck\`. ${rows.length} unique external links.\n\n`;
const counts = { ok: 0, blocked: 0, broken: 0 };
rows.forEach((r) => counts[verdict(r)]++);
md += `**${counts.ok} ok · ${counts.blocked} blocked to automated checks (check by hand) · ${counts.broken} broken or unreachable**\n\n| Result | Status | URL | Used in |\n|---|--:|---|---|\n`;
for (const r of rows.sort((a, b) => verdict(b).localeCompare(verdict(a)))) {
  md += `| ${{ ok: '✅', blocked: '⚠️', broken: '❌' }[verdict(r)]} | ${r.status || r.error} | ${r.u}${r.final && r.final !== r.u ? ` → ${r.final}` : ''} | ${[...urls.get(r.u)].join(', ')} |\n`;
}
writeFileSync(join(ROOT, 'docs/testing/link-report.md'), md);
console.log(counts);
for (const r of rows.filter((x) => verdict(x) !== 'ok')) console.log(verdict(r), r.status || r.error, r.u);
