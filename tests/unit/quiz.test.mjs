import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parseDisplay } from './syllabus-answers.mjs';
import * as q from '../../web/js/quiz/engine.js';
import { round } from '../../web/js/calc.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../../web/content/${p}`, import.meta.url)));
const numeric = read('overlays/quiz-numeric.json').items;
const authored = read('overlays/quiz-items.json').items;
const course = read('course.json');
const modules = Object.fromEntries(readdirSync(new URL('../../web/content/modules/', import.meta.url)).map((f) => [f.replace('.json', ''), read(`modules/${f}`)]));
const banks = { numeric, authored };

test('each numeric template reproduces its worked example with the syllabus inputs', async (t) => {
  for (const item of numeric) {
    await t.test(`${item.id} → ${item.syllabusAnswer}`, () => {
      const inst = q.makeNumeric(item, q.rng(1), { syllabus: true });
      const { value, dp } = parseDisplay(item.syllabusAnswer);
      const expected = value * (item.syllabusSign ?? 1);
      assert.equal(round(inst.answer, dp), round(expected, dp), `got ${inst.answer}`);
      const ex = modules[item.module].examples.find((e) => e.id === item.example);
      assert.ok(ex, `example ${item.example} exists in ${item.module}`);
      assert.ok(ex.text.includes(item.syllabusAnswer.replace(/^\+/, '')), `syllabus answer "${item.syllabusAnswer}" appears in ${item.example}`);
    });
  }
});

test('random instances are valid, finite and fully filled in (300 draws per template)', async (t) => {
  for (const item of numeric) {
    await t.test(item.id, () => {
      const r = q.rng(12345);
      for (let i = 0; i < 300; i++) {
        const inst = q.makeNumeric(item, r);
        assert.ok(Number.isFinite(inst.answer));
        assert.ok(!/\{\w+\}/.test(inst.prompt), `unfilled placeholder in prompt: ${inst.prompt}`);
        assert.ok(!/\{\w+\}/.test(inst.solution), `unfilled placeholder in solution: ${inst.solution}`);
        assert.ok(q.grade(inst, inst.shown).correct, `model answer ${inst.shown} must grade as correct`);
      }
    });
  }
});

test('every module except M2 and M18 has numeric templates; counts cover the syllabus minimum', () => {
  for (const m of course.modules) {
    const n = numeric.filter((x) => x.module === m.id).length;
    if (m.knowledgeCheck?.numericMin) assert.ok(n >= 1, `${m.id} needs numeric templates`);
  }
});

test('knowledge checks have the syllabus item count and numeric minimum', () => {
  for (const m of Object.values(modules)) {
    for (const seed of [1, 2, 3, 99]) {
      const kc = q.buildKnowledgeCheck(m, banks, seed);
      assert.equal(kc.items.length, m.knowledgeCheck.items, `${m.id} item count`);
      const nNum = kc.items.filter((i) => i.type === 'numeric').length;
      assert.ok(nNum >= m.knowledgeCheck.numericMin, `${m.id}: ${nNum} numeric < ${m.knowledgeCheck.numericMin}`);
      assert.equal(new Set(kc.items.map((i) => i.id)).size, kc.items.length, `${m.id} has duplicate items`);
    }
  }
});

test('checkpoint and final exams have the specified size', () => {
  const spec = course.assessment.checkpointSpec;
  for (const cp of course.checkpoints) {
    const mods = Object.values(modules).filter((m) => m.part >= cp.parts[0] && m.part <= cp.parts[1]);
    const ex = q.buildExam({ items: spec.items, numericShare: 0.4 }, mods, banks, 7);
    assert.equal(ex.items.length, spec.items, cp.id);
  }
  const fin = q.buildExam({ items: course.assessment.finalSpec.items, numericShare: course.assessment.finalSpec.calculationShare }, Object.values(modules), banks, 11);
  assert.equal(fin.items.length, 80);
  const share = fin.items.filter((i) => i.type === 'numeric').length / 80;
  assert.ok(Math.abs(share - 0.4) <= 0.05, `final calculation share ${share}`);
});

test('authored items point at real syllabus locations and have one correct answer', () => {
  for (const it of authored) {
    const m = modules[it.basis.module];
    assert.ok(m, `${it.id} basis module`);
    if (it.basis.example) assert.ok(m.examples.some((e) => e.id === it.basis.example), `${it.id} basis example ${it.basis.example}`);
    assert.ok(it.answer >= 0 && it.answer < it.options.length, `${it.id} answer index`);
    assert.equal(new Set(it.options).size, it.options.length, `${it.id} duplicate options`);
  }
});

test('number parsing accepts common learner formats', () => {
  assert.equal(q.parseNumber('14,693.28'), 14693.28);
  assert.equal(q.parseNumber('14 693,28'), 14693.28);
  assert.equal(q.parseNumber('−5'), -5);
  assert.equal(q.parseNumber('8.9%'), 8.9);
  assert.equal(q.parseNumber('R 1,000'), 1000);
  assert.equal(q.parseNumber('0,36'), 0.36);
  assert.ok(Number.isNaN(q.parseNumber('abc')));
  assert.equal(q.fmtNumber(-1234.5, 2), '−1,234.50');
});
