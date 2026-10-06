// Quiz engine: builds knowledge checks and exams from three banks, all traceable to the syllabus:
//   1. numeric items  — overlays/quiz-numeric.json templates, answers computed by calc.js
//   2. term items     — generated from each module's key-term table
//   3. authored items — overlays/quiz-items.json, each with a `basis` pointing to the syllabus text
// Pure logic (no DOM) so it can be unit-tested in Node.

import * as calc from '../calc.js';

// ------------------------------------------------------------------ seeded randomness
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.shuffle = (arr) => {
    const a2 = [...arr];
    for (let i = a2.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a2[i], a2[j]] = [a2[j], a2[i]];
    }
    return a2;
  };
  return next;
}
export const newSeed = () => (Math.random() * 2 ** 32) >>> 0;

// ------------------------------------------------------------------ number formatting & parsing
const MINUS = '−';
export function fmtNumber(x, dp = 2, { trim = false } = {}) {
  if (!Number.isFinite(x)) return '—';
  const neg = x < 0;
  let s = Math.abs(x).toFixed(dp);
  if (trim && s.includes('.')) s = s.replace(/\.?0+$/, '');
  const [i, f] = s.split('.');
  const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? MINUS : '') + grouped + (f ? '.' + f : '');
}
const FMT = {
  int: (v) => fmtNumber(v, 0),
  dec1: (v) => fmtNumber(v, 1),
  dec2: (v) => fmtNumber(v, 2),
  dec4: (v) => fmtNumber(v, 4),
  plain: (v) => String(v),
};
export function fmtParam(v, fmt) {
  if (typeof v !== 'number') return String(v);
  if (fmt && FMT[fmt]) return FMT[fmt](v);
  return fmtNumber(v, 4, { trim: true });
}

// Accepts "14,693.28", "14 693,28", "−5", "8.9%", "R 1,000". Comma followed by exactly three digits
// is read as a thousands separator; otherwise a lone comma is read as a decimal comma.
export function parseNumber(input) {
  if (input == null) return NaN;
  let s = String(input).trim().replace(/[−–—]/g, '-').replace(/[^\d.,\-+eE]/g, '');
  if (!s) return NaN;
  const hasDot = s.includes('.');
  const commas = (s.match(/,/g) || []).length;
  if (commas && !hasDot && commas === 1 && !/,\d{3}(?!\d)/.test(s)) s = s.replace(',', '.');
  else s = s.replace(/,/g, '');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return NaN;
  return Number(s);
}

// ------------------------------------------------------------------ numeric items
export function resolve(arg, p) {
  if (typeof arg === 'number' || typeof arg === 'boolean') return arg;
  if (Array.isArray(arg)) return arg.map((a) => resolve(a, p));
  if (arg && typeof arg === 'object') return Object.fromEntries(Object.entries(arg).map(([k, v]) => [k, resolve(v, p)]));
  if (typeof arg === 'string') {
    const m = arg.match(/^(-?)([A-Za-z_]\w*)(%?)$/);
    if (m && m[2] in p) {
      let v = p[m[2]];
      if (m[3]) v /= 100;
      return m[1] ? -v : v;
    }
    return arg; // string literal such as 'call' or 'A'
  }
  return arg;
}
const pick = (obj, path) => (path ? path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj) : obj);

function drawParams(item, r, syllabus) {
  const p = {};
  for (const [name, spec] of Object.entries(item.params)) {
    let v;
    if (spec.calc) {
      if (syllabus && spec.syllabus !== undefined) v = spec.syllabus;
      else {
        const fn = calc[spec.calc];
        if (!fn) throw new Error(`Unknown calc ${spec.calc}`);
        v = fn(...resolve(spec.args, p));
        if (spec.dp !== undefined) v = calc.round(v, spec.dp);
      }
    } else if (syllabus) v = spec.syllabus;
    else if (spec.choices) v = r.pick(spec.choices);
    else {
      const steps = Math.round((spec.max - spec.min) / spec.step);
      v = calc.round(spec.min + r.int(0, steps) * spec.step, 6);
    }
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(p, v);
    else p[name] = v;
  }
  return p;
}

function fill(template, p, fmts, extra = {}) {
  return template.replace(/\{([A-Za-z_]\w*)\}/g, (m, k) => {
    if (k in extra) return extra[k];
    if (k in p) return fmtParam(p[k], fmts[k]);
    return m;
  });
}

export function makeNumeric(item, r, { syllabus = false } = {}) {
  const fn = calc[item.calc];
  if (!fn) throw new Error(`Unknown calc function ${item.calc} in ${item.id}`);
  for (let attempt = 0; attempt < 40; attempt++) {
    let p;
    let answer;
    try {
      p = drawParams(item, r, syllabus);
      answer = pick(fn(...resolve(item.args, p)), item.pick) * (item.answer.scale ?? 1);
    } catch {
      continue;
    }
    if (!Number.isFinite(answer)) continue;
    if (!syllabus && item.answerRange && (answer < item.answerRange[0] || answer > item.answerRange[1])) continue;
    const fmts = Object.fromEntries(Object.entries(item.params).map(([k, s]) => [k, s.fmt]));
    for (const s of Object.values(item.params)) if (s.choices && typeof s.choices[0] === 'object') for (const k of Object.keys(s.choices[0])) fmts[k] = 'plain';
    const dp = item.answer.dp ?? 2;
    const shown = fmtNumber(answer, dp);
    return {
      type: 'numeric', bank: 'numeric', id: `${item.id}#${syllabus ? 'syllabus' : Math.floor(r() * 1e9)}`,
      template: item.id, module: item.module, example: item.example, level: item.level,
      prompt: fill(item.prompt, p, fmts), answer, dp, unit: item.answer.unit || '', unitPrefix: !!item.answer.prefix,
      solution: fill(item.solution || '', p, fmts, { answer: shown }), shown, params: p, syllabus,
    };
  }
  throw new Error(`Could not generate a valid instance of ${item.id}`);
}

// ------------------------------------------------------------------ term items (from key-term tables)
const mask = (meaning, term) => {
  let out = meaning;
  for (const word of term.replace(/\(.*?\)/g, '').split(/\s*\/\s*|\s+/).filter((w) => w.length > 3)) {
    out = out.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'gi'), '____');
  }
  return out;
};
export function termItems(mod, r) {
  const terms = mod.terms;
  if (terms.length < 4) return [];
  const items = [];
  terms.forEach((t, i) => {
    const others = r.shuffle(terms.filter((_, j) => j !== i)).slice(0, 3);
    if (i % 2 === 0) {
      items.push({
        type: 'mcq', bank: 'term', id: `${mod.id}.term.${i}.a`, module: mod.id, level: 'Know',
        prompt: `Which term matches this meaning? “${mask(t.meaning, t.term)}”`,
        options: r.shuffle([t, ...others]).map((o) => ({ text: o.term, correct: o === t })),
        explanation: `${t.term}: ${t.meaning}`, basis: { module: mod.id, section: 'Key terms' },
      });
    } else {
      items.push({
        type: 'mcq', bank: 'term', id: `${mod.id}.term.${i}.b`, module: mod.id, level: 'Know',
        prompt: `What does “${t.term}” mean?`,
        options: r.shuffle([t, ...others]).map((o) => ({ text: o.meaning, correct: o === t })),
        explanation: `${t.term}: ${t.meaning}`, basis: { module: mod.id, section: 'Key terms' },
      });
    }
  });
  return items;
}
export function matchingItem(mod, r, n = 4) {
  const chosen = r.shuffle(mod.terms).slice(0, n);
  return {
    type: 'match', bank: 'term', id: `${mod.id}.match.${chosen.map((c) => c.term.length).join('')}`, module: mod.id, level: 'Know',
    prompt: 'Match each term to its plain-English meaning.',
    pairs: chosen.map((c) => ({ left: c.term, right: c.meaning })),
    rightOrder: r.shuffle(chosen.map((_, i) => i)),
    explanation: chosen.map((c) => `${c.term}: ${c.meaning}`).join(' · '),
    basis: { module: mod.id, section: 'Key terms' },
  };
}

// ------------------------------------------------------------------ authored items
export function authoredItems(list, moduleId, r) {
  return list.filter((q) => q.module === moduleId).map((q) => ({
    ...q, bank: 'authored', type: q.type || 'mcq',
    options: r.shuffle(q.options.map((o, i) => ({ text: o, correct: i === q.answer }))),
  }));
}

// ------------------------------------------------------------------ assembling checks and exams
export function buildKnowledgeCheck(mod, banks, seed) {
  const r = rng(seed);
  const total = mod.knowledgeCheck?.items ?? 12;
  const numericMin = mod.knowledgeCheck?.numericMin ?? 0;
  const templates = banks.numeric.filter((t) => t.module === mod.id);
  const items = [];
  // Numeric: at least the syllabus minimum, cycling templates with fresh random inputs.
  const nNumeric = templates.length ? Math.max(numericMin, Math.min(templates.length, Math.round(total * 0.3))) : 0;
  const order = r.shuffle(templates);
  for (let i = 0; i < nNumeric; i++) items.push(makeNumeric(order[i % order.length], r));
  const authored = r.shuffle(authoredItems(banks.authored, mod.id, r));
  const terms = r.shuffle(termItems(mod, r));
  let rest = total - items.length;
  // One matching item when there is room.
  if (rest >= 6 && mod.terms.length >= 4) { items.push(matchingItem(mod, r)); rest--; }
  const nAuthored = Math.min(authored.length, Math.ceil(rest / 2));
  items.push(...authored.slice(0, nAuthored));
  rest -= nAuthored;
  items.push(...terms.slice(0, rest));
  return { seed, items: r.shuffle(items).slice(0, total) };
}

export function buildExam({ items: total, numericShare = 0.4 }, modules, banks, seed) {
  const r = rng(seed);
  const weights = modules.map((m) => m.hours?.core || 1);
  const sumW = weights.reduce((s, w) => s + w, 0);
  const quota = modules.map((m, i) => Math.max(1, Math.round((total * weights[i]) / sumW)));
  while (quota.reduce((s, q) => s + q, 0) > total) quota[quota.indexOf(Math.max(...quota))]--;
  while (quota.reduce((s, q) => s + q, 0) < total) quota[quota.indexOf(Math.min(...quota))]++;
  const numericTarget = Math.round(total * numericShare);
  const items = [];
  let numericCount = 0;
  modules.forEach((m, i) => {
    const templates = r.shuffle(banks.numeric.filter((t) => t.module === m.id));
    const share = Math.round((quota[i] * numericTarget) / total);
    const nNum = Math.min(templates.length ? share + 1 : 0, quota[i], templates.length * 2);
    for (let k = 0; k < nNum && numericCount < numericTarget; k++) {
      items.push(makeNumeric(templates[k % templates.length], r));
      numericCount++;
    }
    const need = quota[i] - items.filter((x) => x.module === m.id).length;
    const pool = r.shuffle([...authoredItems(banks.authored, m.id, r), ...termItems(m, r)]);
    items.push(...pool.slice(0, Math.max(0, need)));
  });
  // Top up from any module if a quota could not be met.
  const all = modules.flatMap((m) => termItems(m, r));
  for (const extra of r.shuffle(all)) {
    if (items.length >= total) break;
    if (!items.some((x) => x.id === extra.id)) items.push(extra);
  }
  return { seed, items: r.shuffle(items).slice(0, total), numericCount };
}

// ------------------------------------------------------------------ grading
export function grade(item, response, tolerance = 0.005) {
  if (item.type === 'numeric') {
    const given = parseNumber(response);
    const ok = calc.withinTolerance(given, item.answer, tolerance, item.dp);
    return { correct: ok, given, expected: item.shown };
  }
  if (item.type === 'mcq' || item.type === 'tf') {
    const opt = item.options[response];
    return { correct: !!opt?.correct, expected: item.options.find((o) => o.correct)?.text };
  }
  if (item.type === 'match') {
    // response: array mapping left index -> pair index chosen on the right
    const ok = Array.isArray(response) && item.pairs.every((_, i) => response[i] === i);
    const score = Array.isArray(response) ? item.pairs.filter((_, i) => response[i] === i).length / item.pairs.length : 0;
    return { correct: ok, partial: score };
  }
  return { correct: false };
}
export function score(items, responses, tolerance) {
  let points = 0;
  const results = items.map((it, i) => {
    const g = responses[i] === undefined ? { correct: false, unanswered: true } : grade(it, responses[i], tolerance);
    points += g.correct ? 1 : g.partial && it.type === 'match' ? 0 : 0;
    return g;
  });
  return { points, total: items.length, pct: items.length ? points / items.length : 0, results };
}
