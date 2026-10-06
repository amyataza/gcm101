// Checks the authored overlays against the calc library and the extracted syllabus content:
// every explorer output, curve point and computed bar is finite at its default inputs, explorer
// defaults reproduce the syllabus answers they start from, and every reference resolves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import * as calc from '../../web/js/calc.js';
import { resolve } from '../../web/js/quiz/engine.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../../web/content/${p}`, import.meta.url)));
const modules = Object.fromEntries(readdirSync(new URL('../../web/content/modules/', import.meta.url)).map((f) => [f.replace('.json', ''), read(`modules/${f}`)]));
const pick = (o, path) => (path ? path.split('.').reduce((a, k) => a?.[k], o) : o);
const interactives = read('overlays/interactives.json').items;
const visuals = read('overlays/visuals.json').items;

test('every module has at least one visual and one interactive (besides the automatic ones)', () => {
  for (const id of Object.keys(modules)) {
    assert.ok(visuals.some((v) => v.module === id), `${id} has no visual`);
    assert.ok(interactives.some((w) => w.module === id), `${id} has no interactive`);
  }
});

test('overlay references point at real modules and examples; ids are unique', () => {
  const ids = new Set();
  for (const w of [...interactives, ...visuals]) {
    assert.ok(modules[w.module], `unknown module ${w.module}`);
    if (w.example) assert.ok(modules[w.module].examples.some((e) => e.id === w.example), `${w.module} has no ${w.example}`);
    if (w.id) { assert.ok(!ids.has(w.id), `duplicate id ${w.id}`); ids.add(w.id); }
    if (w.type !== 'explorer' && !['sequencer', 'classifier', 'futures', 'payoff', 'auction', 'orderbook', 'netting', 'settlement'].includes(w.type)) assert.ok(w.description, `visual "${w.title}" needs a text description`);
  }
});

test('explorer outputs are finite at their default inputs', async (t) => {
  for (const w of interactives.filter((x) => x.type === 'explorer')) {
    await t.test(w.id, () => {
      const vals = Object.fromEntries(w.inputs.map((i) => [i.id, i.value]));
      for (const i of w.inputs) assert.ok(i.value >= i.min && i.value <= i.max, `${w.id}.${i.id} default outside range`);
      for (const o of w.outputs) {
        assert.ok(calc[o.calc], `calc.${o.calc} missing`);
        const v = pick(calc[o.calc](...resolve(o.args, vals)), o.pick);
        assert.ok(Number.isFinite(v), `${w.id} → ${o.label} = ${v}`);
      }
    });
  }
});

test('explorer defaults reproduce key syllabus answers', () => {
  const out = (id, k = 0) => {
    const w = interactives.find((x) => x.id === id);
    const vals = Object.fromEntries(w.inputs.map((i) => [i.id, i.value]));
    const o = w.outputs[k];
    return pick(calc[o.calc](...resolve(o.args, vals)), o.pick) * (o.scale ?? 1);
  };
  assert.equal(calc.round(out('m4-fv'), 2), 14693.28);
  assert.equal(calc.round(out('m13-price'), 2), 924.18);
  assert.equal(calc.round(out('m15-bsm'), 2), 10.45);
  assert.equal(calc.round(out('m15-bsm', 1), 2), 5.57);
  assert.equal(calc.round(out('m4-npv'), 2), -210.37);
  assert.equal(calc.round(out('m4-npv', 1), 2), 8.9);
  assert.equal(calc.round(out('m8-forward'), 4), 18.6058);
  assert.equal(calc.round(out('m16-div', 1), 2), 10.14);
  assert.equal(calc.round(out('m17-var'), 0), 197400);
  assert.equal(calc.round(out('m14-dcf'), 2), 6.82);
  assert.equal(calc.round(out('m7-rights'), 2), 48);
  assert.equal(calc.round(out('m12-margin', 2), 2), 35.71);
  assert.equal(calc.round(out('m17-liquidity', 1), 0), 57500000);
});

test('curves and computed bars are finite', async (t) => {
  for (const v of visuals) {
    await t.test(v.title, () => {
      if (v.type === 'curve') {
        for (const s of v.series) {
          for (const x of [v.x.from, (v.x.from + v.x.to) / 2, v.x.to]) {
            const y = pick(calc[s.calc || v.calc](...resolve(s.args, { x })), s.pick ?? v.pick);
            assert.ok(Number.isFinite(y), `${v.title}: ${s.label} at ${x}`);
          }
        }
      }
      for (const b of v.bars || v.flows || []) {
        const val = b.calc ? pick(calc[b.calc](...b.args), b.pick) : (b.value ?? b.amount);
        assert.ok(Number.isFinite(val), `${v.title}: ${b.label}`);
      }
    });
  }
});

test('sequencer and classifier items are well formed', () => {
  for (const w of interactives) {
    if (w.type === 'sequencer') assert.ok(w.steps.length >= 3 && w.basis, `${w.id} needs ≥3 steps and a basis`);
    if (w.type === 'classifier') {
      assert.ok(w.basis, `${w.id} needs a basis`);
      for (const it of w.items) assert.ok(w.buckets.includes(it.bucket), `${w.id}: bucket ${it.bucket}`);
    }
  }
});
