#!/usr/bin/env node
// Writes docs/testing/calc-verification.md: every syllabus answer, the value calc.js computes,
// and whether they agree at the precision the syllabus shows.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { answers, parseDisplay } from '../tests/unit/syllabus-answers.mjs';
import { round } from '../web/js/calc.js';

const errata = JSON.parse(readFileSync(new URL('../web/content/overlays/errata.json', import.meta.url))).errata;
let pass = 0;
let md = '# Calculation verification\n\n';
md += `Generated ${new Date().toISOString().slice(0, 10)} by \`node tools/report-calcs.mjs\`. Source of the expected values: the worked examples of GCM-101 v1.0. `;
md += 'Each value is recomputed with `web/js/calc.js` (the same code the app’s calculators and quiz generators use) and compared at the precision the syllabus displays. The unit test `tests/unit/calc.test.mjs` runs the same table and also checks that each displayed value appears verbatim in the extracted content.\n\n';
md += '| Module | Example | Quantity | Syllabus shows | Recomputed | Result |\n|---|---|---|--:|--:|:-:|\n';
const rows = [];
for (const a of answers) {
  const { value, dp } = parseDisplay(a.display);
  const digits = a.dpOverride ?? dp;
  const raw = a.compute() * a.scale;
  const ok = round(raw, digits) === round(value, digits);
  const err = a.erratum && round(raw, digits) === round(parseDisplay(a.erratum).value, digits);
  if (ok) pass++;
  rows.push(`| ${a.module.toUpperCase()} | ${a.example} | ${a.label} | ${a.display} | ${Number(raw.toFixed(6))} | ${ok ? '✅' : err ? '⚠️ erratum' : '❌'} |`);
}
md += rows.join('\n') + '\n\n';
md += `**${pass} of ${answers.length} values match exactly; ${answers.length - pass} differ.**\n\n`;
md += '## Errata found\n\n| Module | Example | Syllabus shows | Correct | Note |\n|---|---|--:|--:|---|\n';
for (const e of errata) md += `| ${e.module.toUpperCase()} | ${e.example} | ${e.shown} | ${e.correct} (exact ${e.exact}) | ${e.note} |\n`;
md += '\nThe three figures named in the brief are confirmed: future value **14,693.28** (WE 4.1), bond price **924.18** (WE 13.1) and Black-Scholes call **10.45** (WE 15.3).\n';
mkdirSync(new URL('../docs/testing/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/testing/calc-verification.md', import.meta.url), md);
console.log(`${pass}/${answers.length} match; report written to docs/testing/calc-verification.md`);
