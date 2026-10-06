#!/usr/bin/env node
// Automated accessibility audit with axe-core (WCAG 2.0, 2.1 and 2.2, levels A and AA) on the key
// screens, in light, dark and high-contrast themes, at phone and desktop sizes.
// Writes docs/testing/accessibility-report.md. Automated checks cover only part of WCAG; the manual
// checklist in the report covers the rest.
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, startServer, newBrowser, BUDGET_PHONE, onboard, passModules, go } from './helpers.mjs';

const pages = [
  ['Welcome (onboarding)', '/welcome'], ['Course map', '/'], ['Module overview', '/m/m4'], ['Learn (all modes on)', '/m/m4/learn'],
  ['Practise (tracks, widgets)', '/m/m13/practise'], ['Check & applied tasks', '/m/m4/check'], ['Knowledge check question', '/quiz/m0'],
  ['Exam intro', '/exam/cp1'], ['Glossary', '/glossary'], ['Tools', '/tools'], ['Tool: option payoff', '/tools/m9-payoff'],
  ['Tool: order book', '/tools/m12-book'], ['Capstone', '/capstone'], ['Progress', '/progress'], ['Settings', '/settings'],
  ['About', '/about'], ['Privacy', '/about/privacy'], ['Methodology', '/methodology'], ['Credentials', '/credentials'], ['References', '/sources'],
];
const themes = ['light', 'dark', 'contrast'];
const server = await startServer(8183);
const browser = await newBrowser();
const rows = [];
const all = new Map();
for (const [size, opts] of [['phone', BUDGET_PHONE], ['desktop', { viewport: { width: 1280, height: 900 } }]]) {
  for (const theme of size === 'phone' ? themes : ['light']) {
    const ctx = await browser.newContext({ ...opts, colorScheme: theme === 'dark' ? 'dark' : 'light' });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { localStorage.setItem('gcm101:dev-nosw', '1'); } catch {} });
    await onboard(page, server.url, { theme });
    await passModules(page, ['m0', 'm1', 'm2', 'm3']);
    for (const [name, route] of pages) {
      if (route === '/welcome') { await page.goto(`${server.url}/#/welcome`); await page.waitForSelector('main h1'); } else await go(page, `${server.url}/#${route}`);
      await page.waitForLoadState('networkidle');
      if (/\/m\/m\d+\/(learn|practise)$/.test(route)) await page.waitForSelector('.sources-panel');
      await page.waitForTimeout(250);
      // Open every <details> so hidden text alternatives are audited too.
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const v = res.violations;
      rows.push({ size, theme, name, route, violations: v.length, nodes: v.reduce((s, x) => s + x.nodes.length, 0), passes: res.passes.length });
      for (const x of v) {
        const key = `${x.id}`;
        const e = all.get(key) || { id: x.id, impact: x.impact, help: x.help, url: x.helpUrl, where: new Set(), example: x.nodes[0]?.target?.join(' ') };
        e.where.add(`${name} (${size}/${theme})`);
        all.set(key, e);
      }
    }
    await ctx.close();
  }
}
await browser.close();
server.stop();

const totalV = rows.reduce((s, r) => s + r.violations, 0);
let md = `# Accessibility report\n\nRun ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC with \`npm run audit:a11y\` (axe-core via Playwright, tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa). ${pages.length} screens × 3 themes on a 360×640 phone, plus light theme at 1280×900. All \`<details>\` text alternatives were expanded before each scan.\n\n`;
md += `**Result: ${totalV === 0 ? 'no automated WCAG 2.2 A/AA violations found' : `${totalV} violation(s) across ${all.size} rule(s)`}** on ${rows.length} scans.\n\n`;
if (all.size) {
  md += '## Violations\n\n| Rule | Impact | Description | Where | Example target |\n|---|---|---|---|---|\n';
  for (const e of all.values()) md += `| [${e.id}](${e.url}) | ${e.impact} | ${e.help} | ${[...e.where].slice(0, 6).join('; ')}${e.where.size > 6 ? ` (+${e.where.size - 6} more)` : ''} | \`${e.example || ''}\` |\n`;
  md += '\n';
}
md += '## Scans\n\n| Screen | Route | Size | Theme | Violations (nodes) | Rules passed |\n|---|---|---|---|--:|--:|\n';
for (const r of rows) md += `| ${r.name} | \`${r.route}\` | ${r.size} | ${r.theme} | ${r.violations ? `${r.violations} (${r.nodes})` : '0'} | ${r.passes} |\n`;
md += `\n## Manual WCAG 2.2 AA checklist (not covered by automated tools)\n\nThese were checked by inspection and with the end-to-end tests; they must be re-checked with real assistive technology in the pilot (see docs/pilot-plan.md).\n\n| Criterion | How GCM-101 meets it | Evidence |\n|---|---|---|\n`;
for (const [c, how, ev] of [
  ['1.1.1 Non-text content', 'Every chart has <title>/<desc>, a "Text description" and a data table; icons are aria-hidden or labelled.', 'widgets/index.js mountVisual; axe image-alt/svg-img-alt'],
  ['1.2.1 / 1.2.2 Audio-only, captions', 'Audio summaries have full transcripts beside the player; animations are captioned step text.', 'learn.js hearPanel; stepper()'],
  ['1.3.1 Info and relationships', 'Real headings, lists, tables with th/scope, fieldsets for radio groups, labels for every input.', 'axe'],
  ['1.4.1 Use of colour', 'Status uses icon + word; chart series differ by dash pattern; correct/incorrect use ✓/✗ and text.', 'ui.js statusChip; charts.css s0–s2'],
  ['1.4.3 / 1.4.11 Contrast', 'Token pairs ≥ 4.5:1 text, ≥ 3:1 UI; high-contrast theme ≥ 7:1.', 'axe color-contrast in 3 themes'],
  ['1.4.4 / 1.4.10 Resize and reflow', 'Text size 85–160%; no horizontal scroll at 360 px even at 160%.', 'e2e: themes & text size test'],
  ['1.4.12 Text spacing', '"More space" line-spacing and "Wide and spaced" font options; layout tolerates them.', 'settings.js'],
  ['2.1.1 Keyboard', 'All widgets operable by keyboard: tap-to-pair matching, ↑/↓ buttons in sequencers, selects in classifiers.', 'e2e: keyboard test'],
  ['2.2.1 Timing adjustable', 'Exam timer can be off, 1.25×, 1.5×, 2×; warnings at 5 and 1 minutes with "Add 15 minutes" (unlimited); 20-second grace before auto-submit.', 'quiz.js examRunner; e2e exam test'],
  ['2.2.2 Pause, stop, hide', 'Walkthroughs pause, stop and respect reduced motion; nothing auto-plays.', 'widgets/index.js stepper'],
  ['2.4.1 Bypass blocks', 'Skip-to-content link.', 'index.html'],
  ['2.4.3 / 2.4.7 Focus order and visible focus', 'Focus moves to each new page heading; 3 px focus outline.', 'app.js render; app.css :focus-visible'],
  ['2.4.11 Focus not obscured (2.2)', 'Sticky bars use scroll-margin and do not cover focused controls.', 'app.css [id] scroll-margin'],
  ['2.5.7 Dragging movements (2.2)', 'Every drag action has a single-pointer alternative (buttons/menus).', 'sequencer, matching'],
  ['2.5.8 Target size (2.2)', 'Interactive targets are at least 44×44 px (36 px for small secondary buttons, above the 24 px minimum).', 'app.css --tap'],
  ['3.1.1 Language of page', 'lang="en" on <html>.', 'index.html'],
  ['3.2.6 Consistent help (2.2)', '"Report a problem" and About are in the same place on every lesson.', 'shared.js sourcesPanel'],
  ['3.3.1 / 3.3.3 Error identification and suggestion', 'Numeric input explains accepted formats; feedback states the correct answer and working.', 'quiz.js feedback'],
  ['3.3.7 Redundant entry (2.2)', 'Answers and notes are saved automatically and never re-asked.', 'store.js'],
  ['4.1.2 Name, role, value', 'Toggle buttons use aria-pressed; radio groups use role=radiogroup/aria-checked; live regions announce results.', 'axe'],
]) md += `| ${c} | ${how} | ${ev} |\n`;
writeFileSync(join(ROOT, 'docs/testing/accessibility-report.md'), md);
console.log(`${rows.length} scans, ${totalV} violations, ${all.size} rules`);
for (const e of all.values()) console.log(`  ${e.id} (${e.impact}): ${e.help} — ${[...e.where].slice(0, 3).join('; ')} — ${e.example}`);
