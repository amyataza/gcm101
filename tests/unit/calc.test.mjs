import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { answers, parseDisplay } from './syllabus-answers.mjs';
import * as c from '../../web/js/calc.js';

const modules = {};
const load = (id) => (modules[id] ||= JSON.parse(readFileSync(new URL(`../../web/content/modules/${id}.json`, import.meta.url))));

test('every syllabus worked-example answer is reproduced by calc.js', async (t) => {
  for (const a of answers) {
    await t.test(`${a.module.toUpperCase()} ${a.example} — ${a.label} = ${a.display}`, () => {
      const { value, dp } = parseDisplay(a.display);
      const digits = a.dpOverride ?? dp;
      const got = c.round(a.compute() * a.scale, digits);
      const expected = a.erratum ? parseDisplay(a.erratum).value : value;
      assert.equal(got, c.round(expected, digits), `computed ${a.compute() * a.scale}`);
    });
  }
});

test('every known erratum is published in overlays/errata.json', () => {
  const errata = JSON.parse(readFileSync(new URL('../../web/content/overlays/errata.json', import.meta.url))).errata;
  for (const a of answers.filter((x) => x.erratum)) {
    const e = errata.find((x) => x.module === a.module && x.example === a.example && x.shown === a.display);
    assert.ok(e, `erratum for ${a.module} ${a.example} ${a.display} is listed`);
    assert.equal(e.correct, a.erratum);
  }
});

test('every checked answer appears verbatim in the extracted syllabus content', async (t) => {
  for (const a of answers) {
    await t.test(`${a.module} ${a.example}: "${a.display}"`, () => {
      const ex = load(a.module).examples.find((e) => e.id === a.example);
      assert.ok(ex, `example ${a.example} exists`);
      assert.ok(ex.text.includes(a.display), `"${a.display}" not found in ${a.example}`);
    });
  }
});

test('tolerance rule: ±0.5% relative, with rounding slack for the shown decimals', () => {
  assert.ok(c.withinTolerance(14693.28, 14693.28));
  assert.ok(c.withinTolerance(14700, 14693.28)); // 0.05% off
  assert.ok(!c.withinTolerance(14800, 14693.28)); // 0.73% off
  assert.ok(c.withinTolerance(0.36, 0.3597, 0.005, 2)); // DV01 rounded
  assert.ok(c.withinTolerance(1.67, 1.6667, 0.005, 2));
  assert.ok(!c.withinTolerance(NaN, 1));
});

test('root finders and normal distribution are accurate', () => {
  assert.ok(Math.abs(c.normCdf(0) - 0.5) < 1e-7);
  assert.ok(Math.abs(c.normCdf(1.96) - 0.9750021) < 1e-6);
  assert.ok(Math.abs(c.normInv(0.95) - 1.6448536) < 1e-6);
  assert.ok(Math.abs(c.normInv(0.99) - 2.3263479) < 1e-6);
  assert.ok(Math.abs(c.npv(c.irr([-100, 60, 60]), [-100, 60, 60])) < 1e-8);
  const y = c.bondYtm(c.bondPrice(100, 0.05, 0.0731, 7, 2), 100, 0.05, 7, 2);
  assert.ok(Math.abs(y - 0.0731) < 1e-9);
});
