// Multimodal widgets. "See": visuals and step-through walkthroughs. "Do": explorers (sliders),
// matching, sequencing, classifying, simulations, spreadsheet pack and Python runner.
// Every widget works with keyboard, touch and screen readers; every chart has a text alternative.
import { h, icon, announce, toast, setKids, addKids } from '../ui.js';
import * as calc from '../calc.js';
import { resolve, fmtNumber, rng, newSeed } from '../quiz/engine.js';
import { lineChart, barChart } from './charts.js';

const AI_NOTE = 'Original diagram drafted with AI assistance from the syllabus text, then checked.';

// ------------------------------------------------------------------ shared helpers
function frame(title, kind, ...children) {
  return h('section', { class: 'widget', 'aria-label': title },
    h('header', {}, icon(kind === 'see' ? 'eye' : 'hand'), h('h3', {}, title)), ...children);
}
const fmtOut = (v, o = {}) => {
  if (!Number.isFinite(v)) return '—';
  const x = v * (o.scale ?? 1);
  const s = fmtNumber(x, o.dp ?? 2);
  return o.unit === '%' ? `${s}%` : o.prefix ? `${o.unit}${s}` : o.unit ? `${s} ${o.unit}` : s;
};
function dataTable(caption, head, rows) {
  return h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': caption },
    h('table', {}, h('caption', { class: 'sr-only' }, caption),
      h('thead', {}, h('tr', {}, head.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', {}, rows.map((r) => h('tr', {}, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', {}, c))))))));
}
const callFn = (name, args) => {
  const fn = calc[name];
  if (!fn) throw new Error(`calc.${name} missing`);
  return fn(...args);
};
const pick = (obj, path) => (path ? path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj) : obj);

// ------------------------------------------------------------------ visuals (See)
export function mountVisual(v) {
  let body;
  let table = null;
  try {
    if (v.type === 'flow') {
      body = h('ol', { class: `flow ${v.direction === 'vertical' ? 'vertical' : ''}`, 'aria-label': v.title },
        v.nodes.map((n, i) => h('li', {}, h('span', { class: 'node' }, n.label, n.sub ? h('small', {}, n.sub) : null), i < v.nodes.length - 1 ? h('span', { class: 'arrow', 'aria-hidden': 'true' }, v.arrow || '→') : null)));
    } else if (v.type === 'tree') {
      body = h('div', { class: 'tree' }, v.groups.map((g) => h('div', { class: 'group' }, h('h4', {}, g.title), h('ul', {}, g.items.map((it) => h('li', {}, it))))));
    } else if (v.type === 'curve') {
      const yAt = (s, x) => pick(callFn(s.calc || v.calc, resolve(s.args, { x })), s.pick ?? v.pick) * (v.y.scale ?? 1);
      const pts = (s) => {
        const out = [];
        for (let i = 0; i <= v.x.steps; i++) {
          const x = v.x.from + ((v.x.to - v.x.from) * i) / v.x.steps;
          const y = yAt(s, x);
          if (Number.isFinite(y)) out.push([x * (v.x.scale ?? 1), y]);
        }
        return out;
      };
      const series = v.series.map((s) => ({ label: s.label, points: pts(s) }));
      const markers = (v.markers || []).map((mk) => ({ x: mk.x * (v.x.scale ?? 1), y: mk.y ?? (mk.onSeries != null ? yAt(v.series[mk.onSeries], mk.x) : null), label: mk.label }));
      body = lineChart({ series, xLabel: v.x.label, yLabel: v.y.label, title: v.title, desc: v.description, markers, yZero: v.y.zero,
        xFmt: v.x.fmt === 'pct' ? (t) => `${fmtNumber(t, 0, { trim: true })}%` : null, yFmt: v.y.fmt === 'pct' ? (t) => `${fmtNumber(t, 1, { trim: true })}%` : null });
      const sample = series[0].points.filter((_, i, a) => i % Math.max(1, Math.round(a.length / 8)) === 0 || i === a.length - 1);
      table = dataTable(`${v.title} — data`, [v.x.label, ...series.map((s) => s.label || v.y.label)],
        sample.map(([x], i) => [fmtNumber(x, 2, { trim: true }), ...series.map((s) => fmtNumber((s.points.find((p) => p[0] === x) || [0, NaN])[1], v.y.dp ?? 2))]));
    } else if (v.type === 'bars' || v.type === 'cashflows') {
      const bars = (v.bars || v.flows).map((b) => {
        const value = b.calc ? pick(callFn(b.calc, b.args), b.pick) * (b.scale ?? 1) : (b.value ?? b.amount);
        const text = b.text ?? (v.dp != null ? `${fmtNumber(value, v.dp)}${v.fmt === 'pct' ? '%' : ''}` : undefined);
        return { label: b.label ?? `t = ${b.t}`, value, alt: b.alt, text };
      });
      body = barChart({ bars, title: v.title, desc: v.description, yLabel: v.yLabel || '', yFmt: v.fmt === 'pct' ? (t) => `${fmtNumber(t, 1, { trim: true })}%` : null });
      table = dataTable(`${v.title} — data`, ['Item', v.yLabel || 'Value'], bars.map((b) => [b.label, b.text ?? fmtNumber(b.value, v.dp ?? 2)]));
    } else {
      body = h('p', {}, `Unknown visual type ${v.type}`);
    }
  } catch (e) {
    body = h('p', { class: 'muted' }, `This diagram could not be drawn (${e.message}). The text description below has the same information.`);
  }
  return h('figure', { class: 'visual' },
    h('p', { class: 'eyebrow' }, icon('eye'), ' ', v.kind || 'Diagram'),
    h('h3', { style: { marginTop: 0 } }, v.title),
    body,
    h('figcaption', {}, v.caption || '', v.source ? ` Source: ${v.source}.` : ''),
    h('details', { class: 'textalt' }, h('summary', {}, 'Text description'), h('p', { class: 'prose' }, v.description), table),
    h('p', { class: 'small muted' }, h('strong', {}, 'AI-assisted. '), AI_NOTE));
}

// ------------------------------------------------------------------ dispatcher (Do)
export function mountWidget(w, ctx = {}) {
  try {
    switch (w.type) {
      case 'explorer': return explorer(w);
      case 'matching': return matching(w, ctx.module);
      case 'sequencer': return sequencer(w);
      case 'classifier': return classifier(w);
      default: return lazySim(w);
    }
  } catch (e) {
    console.error(e);
    return h('p', { class: 'muted' }, `This activity could not start (${e.message}).`);
  }
}
function lazySim(w) {
  const slot = h('div', {}, h('p', { class: 'muted small' }, 'Loading activity…'));
  import('./sims.js').then((S) => slot.replaceWith(S.mount(w))).catch((e) => setKids(slot, h('p', { class: 'muted' }, `Could not load (${e.message}).`)));
  return slot;
}

// ------------------------------------------------------------------ explorer: sliders + live results + chart
export function explorer(w) {
  const vals = Object.fromEntries(w.inputs.map((i) => [i.id, i.value]));
  const outs = h('div', { class: 'results', role: 'status', 'aria-live': 'polite' });
  const chartSlot = h('div');
  const fields = w.inputs.map((i) => {
    const out = h('output', { for: `${w.id}-${i.id}` }, fmtIn(i, i.value));
    const range = h('input', { type: 'range', id: `${w.id}-${i.id}`, min: i.min, max: i.max, step: i.step, value: i.value, 'aria-valuetext': fmtIn(i, i.value) });
    const num = h('input', { type: 'number', min: i.min, max: i.max, step: i.step, value: i.value, 'aria-label': `${i.label} (type a value)`, style: { maxWidth: '8rem' }, inputmode: 'decimal' });
    const update = (v, from) => {
      const x = Math.min(i.max, Math.max(i.min, Number(v)));
      if (!Number.isFinite(x)) return;
      vals[i.id] = x;
      if (from !== range) range.value = x;
      if (from !== num) num.value = x;
      out.textContent = fmtIn(i, x);
      range.setAttribute('aria-valuetext', fmtIn(i, x));
      recompute();
    };
    range.addEventListener('input', () => update(range.value, range));
    num.addEventListener('change', () => update(num.value, num));
    return h('div', { class: 'field' }, h('label', { for: `${w.id}-${i.id}` }, i.label, out), h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, range, num));
  });
  let t;
  function recompute() {
    setKids(outs, ...w.outputs.map((o) => {
      let v;
      try { v = pick(callFn(o.calc, resolve(o.args, vals)), o.pick); } catch { v = NaN; }
      return h('div', { class: 'result' }, h('div', { class: 'k' }, o.label), h('div', { class: 'v' }, fmtOut(v, o)));
    }));
    clearTimeout(t);
    t = setTimeout(drawChart, 60);
  }
  function drawChart() {
    if (!w.chart) return;
    const c = w.chart;
    const inp = w.inputs.find((i) => i.id === c.x);
    const o = w.outputs[c.output || 0];
    const pts = [];
    for (let k = 0; k <= 40; k++) {
      const x = inp.min + ((inp.max - inp.min) * k) / 40;
      let y;
      try { y = pick(callFn(o.calc, resolve(o.args, { ...vals, [c.x]: x })), o.pick) * (o.scale ?? 1); } catch { y = NaN; }
      if (Number.isFinite(y)) pts.push([x, y]);
    }
    let cur;
    try { cur = pick(callFn(o.calc, resolve(o.args, vals)), o.pick) * (o.scale ?? 1); } catch { cur = NaN; }
    setKids(chartSlot, lineChart({
      series: [{ label: o.label, points: pts }], xLabel: c.xLabel || inp.label, yLabel: c.yLabel || o.label, title: `${o.label} as ${inp.label.toLowerCase()} changes`,
      desc: `Line chart of ${o.label} against ${inp.label}; the dot marks your current setting (${fmtIn(inp, vals[c.x])} gives ${fmtOut(cur / (o.scale ?? 1), o)}).`,
      markers: Number.isFinite(cur) ? [{ x: vals[c.x], y: cur }] : [], height: 260, yZero: c.yZero,
    }));
  }
  const reset = h('button', { class: 'btn small quiet', type: 'button' }, 'Reset to the syllabus example');
  reset.addEventListener('click', () => {
    w.inputs.forEach((i) => { vals[i.id] = i.value; });
    fields.forEach((f, k) => { f.querySelector('input[type=range]').value = w.inputs[k].value; f.querySelector('input[type=number]').value = w.inputs[k].value; f.querySelector('output').textContent = fmtIn(w.inputs[k], w.inputs[k].value); });
    recompute();
    announce('Reset to the syllabus values');
  });
  recompute();
  return frame(w.title, 'do', w.intro ? h('p', { class: 'small' }, w.intro) : null, ...fields, outs, chartSlot,
    h('div', { class: 'row' }, reset), w.note ? h('p', { class: 'small muted' }, w.note) : null,
    w.example ? h('p', { class: 'small muted' }, `Starts at the values of ${w.exampleLabel || w.example}. Try changing one input at a time.`) : null);
}
function fmtIn(i, v) {
  const dp = i.dp ?? (String(i.step).split('.')[1] || '').length;
  const s = fmtNumber(Number(v), dp);
  return i.unit === '%' ? `${s}%` : i.unit ? `${s} ${i.unit}` : s;
}

// ------------------------------------------------------------------ matching (tap-to-pair; keyboard friendly)
export function matching(w, m) {
  const box = h('div');
  const r = rng(newSeed());
  const build = () => {
    const pairs = r.shuffle(m.terms).slice(0, w.count || 5);
    const right = r.shuffle(pairs.map((_, i) => i));
    let sel = null;
    const done = new Set();
    const status = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' }, 'Select a term, then select its meaning.');
    const leftBtns = pairs.map((p, i) => h('button', { type: 'button', 'aria-pressed': 'false', 'data-i': i }, h('span', { class: 'tag' }, String.fromCharCode(65 + i)), p.term));
    const rightBtns = right.map((pi) => h('button', { type: 'button', 'data-i': pi }, pairs[pi].meaning));
    leftBtns.forEach((b) => b.addEventListener('click', () => {
      if (done.has(Number(b.dataset.i))) return;
      leftBtns.forEach((x) => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      sel = Number(b.dataset.i);
      status.textContent = `Selected “${pairs[sel].term}”. Now select its meaning.`;
    }));
    rightBtns.forEach((b) => b.addEventListener('click', () => {
      if (sel == null) { status.textContent = 'Select a term first.'; return; }
      const pi = Number(b.dataset.i);
      if (pi === sel) {
        done.add(sel);
        b.classList.add('matched');
        leftBtns[sel].classList.add('matched');
        leftBtns[sel].setAttribute('aria-pressed', 'false');
        b.prepend(h('span', { class: 'tag' }, `${String.fromCharCode(65 + sel)} ✓`));
        b.disabled = true; leftBtns[sel].disabled = true;
        status.textContent = done.size === pairs.length ? `All ${pairs.length} matched. Well done!` : `Correct: ${pairs[sel].term}. ${pairs.length - done.size} to go.`;
        sel = null;
      } else {
        b.classList.add('wrong');
        status.textContent = 'Not that one — try another meaning.';
        setTimeout(() => b.classList.remove('wrong'), 900);
      }
    }));
    setKids(box, h('div', { class: 'pairs' }, h('div', { class: 'pick', role: 'group', 'aria-label': 'Terms' }, leftBtns), h('div', { class: 'pick', role: 'group', 'aria-label': 'Meanings' }, rightBtns)), status,
      h('button', { class: 'btn small', type: 'button', onclick: build }, 'New set of terms'));
  };
  build();
  return frame(w.title || 'Match the terms', 'do', h('p', { class: 'small muted' }, 'Tap or press Enter on a term, then on its meaning. Built from this module’s key-term table.'), box);
}

// ------------------------------------------------------------------ sequencer (order steps; buttons + drag)
export function sequencer(w) {
  const r = rng(newSeed());
  let order = r.shuffle(w.steps.map((_, i) => i));
  if (order.every((v, i) => v === i)) order.reverse();
  const listEl = h('ol', { class: 'sortlist', 'aria-label': w.title });
  const status = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });
  const draw = (focusIdx) => {
    setKids(listEl, ...order.map((si, pos) => {
      const up = h('button', { type: 'button', 'aria-label': `Move “${w.steps[si]}” up`, disabled: pos === 0 }, '↑');
      const dn = h('button', { type: 'button', 'aria-label': `Move “${w.steps[si]}” down`, disabled: pos === order.length - 1 }, '↓');
      up.addEventListener('click', () => move(pos, pos - 1, 'up'));
      dn.addEventListener('click', () => move(pos, pos + 1, 'down'));
      const li = h('li', { draggable: 'true', 'data-pos': pos }, h('span', { class: 'pos' }, pos + 1), h('span', {}, w.steps[si]), h('span', { class: 'mv' }, up, dn));
      li.addEventListener('dragstart', (e) => { li.classList.add('dragging'); e.dataTransfer.setData('text/plain', String(pos)); });
      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      li.addEventListener('dragover', (e) => e.preventDefault());
      li.addEventListener('drop', (e) => { e.preventDefault(); move(Number(e.dataTransfer.getData('text/plain')), pos); });
      return li;
    }));
    if (focusIdx != null) listEl.children[focusIdx.pos]?.querySelector(`.mv button:${focusIdx.dir === 'up' ? 'first-child' : 'last-child'}`)?.focus();
  };
  const move = (from, to, dir) => {
    if (to < 0 || to >= order.length || from === to) return;
    const [x] = order.splice(from, 1);
    order.splice(to, 0, x);
    draw(dir ? { pos: to, dir } : null);
    status.textContent = `Moved to position ${to + 1}.`;
  };
  const check = h('button', { class: 'btn small primary', type: 'button' }, 'Check order');
  check.addEventListener('click', () => {
    const right = order.filter((si, pos) => si === pos).length;
    [...listEl.children].forEach((li, pos) => { li.classList.toggle('ok', order[pos] === pos); li.classList.toggle('bad', order[pos] !== pos); li.querySelector('.pos').textContent = `${pos + 1} ${order[pos] === pos ? '✓' : '✗'}`; });
    status.textContent = right === order.length ? 'All in the right order!' : `${right} of ${order.length} in the right place. Items marked ✗ need to move.`;
  });
  const show = h('button', { class: 'btn small quiet', type: 'button' }, 'Show the answer');
  show.addEventListener('click', () => { order = w.steps.map((_, i) => i); draw(); status.textContent = 'This is the order given in the syllabus.'; });
  draw();
  return frame(w.title, 'do', h('p', { class: 'small' }, w.prompt || 'Put these steps in order. Drag them, or use the arrow buttons.'), listEl, status,
    h('div', { class: 'row' }, check, show), w.basis ? h('p', { class: 'small muted' }, `Based on ${w.basis}.`) : null);
}

// ------------------------------------------------------------------ classifier (assign each item to a group)
export function classifier(w) {
  const r = rng(newSeed());
  const items = r.shuffle(w.items);
  const status = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });
  const rows = items.map((it, k) => {
    const sel = h('select', { 'aria-label': `Group for: ${it.text}` }, h('option', { value: '' }, 'Choose…'), w.buckets.map((b) => h('option', { value: b }, b)));
    const mark = h('span', { class: 'small', 'aria-hidden': 'true' });
    return { it, sel, mark, el: h('div', { class: 'field', style: { gridTemplateColumns: '1fr', borderBottom: '1px solid var(--line)', paddingBottom: 'var(--s2)' } }, h('span', {}, `${k + 1}. ${it.text}`), h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, sel, mark)) };
  });
  const check = h('button', { class: 'btn small primary', type: 'button' }, 'Check');
  check.addEventListener('click', () => {
    let ok = 0;
    rows.forEach((rw) => { const good = rw.sel.value === rw.it.bucket; ok += good; rw.mark.textContent = rw.sel.value ? (good ? '✓ Correct' : `✗ It is: ${rw.it.bucket}`) : ''; rw.mark.style.color = good ? 'var(--ok)' : 'var(--bad)'; });
    status.textContent = `${ok} of ${rows.length} correct.`;
  });
  return frame(w.title, 'do', h('p', { class: 'small' }, w.prompt || 'Choose the right group for each item.'), ...rows.map((x) => x.el), status, h('div', { class: 'row' }, check),
    w.basis ? h('p', { class: 'small muted' }, `Based on ${w.basis}.`) : null);
}

// ------------------------------------------------------------------ step-through walkthrough (See)
export function stepper(ex) {
  const tmp = document.createElement('div');
  tmp.innerHTML = ex.segments.filter((s) => s.track === 'A').map((s) => s.html).join('');
  const steps = [...tmp.querySelectorAll('ol > li')].map((li) => li.innerHTML);
  if (!steps.length) return h('span');
  const problem = ex.segments.find((s) => s.type === 'problem');
  let i = -1;
  let timer = null;
  const caption = h('div', { class: 'prose', 'aria-live': 'polite', style: { minHeight: '4.5em', fontSize: '1.1rem' } });
  const dots = h('div', { class: 'row', 'aria-hidden': 'true' }, steps.map(() => h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: 'var(--line)', display: 'inline-block' } })));
  const show = (k) => {
    i = Math.max(0, Math.min(steps.length - 1, k));
    caption.innerHTML = `<p class="eyebrow">Step ${i + 1} of ${steps.length}</p><p>${steps[i]}</p>`;
    [...dots.children].forEach((d, j) => { d.style.background = j <= i ? 'var(--brand)' : 'var(--line)'; d.style.transform = j === i ? 'scale(1.4)' : ''; d.style.transition = 'transform var(--t), background var(--t)'; });
  };
  const reduce = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = h('button', { class: 'btn small primary', type: 'button' }, icon('play'), 'Play');
  const stop = () => { clearInterval(timer); timer = null; setKids(play, icon('play'), 'Play'); };
  play.addEventListener('click', () => {
    if (timer) { stop(); return; }
    if (i >= steps.length - 1) i = -1;
    show(i + 1);
    if (reduce()) return; // reduced motion: one step per press
    setKids(play, icon('pause'), 'Pause');
    timer = setInterval(() => { if (i >= steps.length - 1) stop(); else show(i + 1); }, 4500);
  });
  const prev = h('button', { class: 'btn small', type: 'button' }, '‹ Back');
  const next = h('button', { class: 'btn small', type: 'button' }, 'Next ›');
  prev.addEventListener('click', () => { stop(); show(i - 1); });
  next.addEventListener('click', () => { stop(); show(i + 1); });
  caption.innerHTML = `<p class="muted">Press Play to walk through Track A one step at a time. Each step stays on screen until you move on${''}.</p>`;
  return h('section', { class: 'widget', 'aria-label': `Walkthrough: ${ex.title}` },
    h('header', {}, icon('eye'), h('h3', {}, `Walkthrough: ${ex.title}`)),
    problem ? h('details', { class: 'textalt' }, h('summary', {}, 'Show the problem'), h('div', { html: problem.html })) : null,
    caption, dots, h('div', { class: 'row', style: { marginTop: 'var(--s2)' } }, prev, play, next),
    h('p', { class: 'small muted' }, 'Captioned animation of the syllabus steps. Pauses automatically; respects your reduced-motion setting.'));
}

// ------------------------------------------------------------------ spreadsheet pack (Track B)
export function sheetPack(m) {
  const rows = [];
  for (const ex of m.examples) {
    const tmp = document.createElement('div');
    tmp.innerHTML = ex.segments.filter((s) => s.track === 'B').map((s) => s.html).join(' ');
    for (const code of tmp.querySelectorAll('code')) {
      const f = code.textContent.trim();
      if (!f.startsWith('=')) continue;
      const after = (code.nextSibling?.textContent || '').match(/^\s*→\s*([−\-]?[\d.,]+%?(?:\s*per 100 of face)?)/);
      const ranged = /\b[A-Z]{1,2}\$?\d+\b|range|…/.test(f);
      rows.push([`${ex.kind} ${ex.num || ''}`.trim(), ex.title, ranged ? '' : f, ranged ? `Type your data first, then: ${f}` : '', after ? after[1] : '']);
    }
  }
  if (!rows.length) return h('span');
  const btn = h('button', { class: 'btn small', type: 'button' }, icon('sheet'), `Download the ${m.code} spreadsheet pack (CSV)`);
  btn.addEventListener('click', () => {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csv = ['Example,Title,Formula (live),Formula needing your data,Syllabus answer', ...rows.map((r) => r.map(q).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    const a = h('a', { href: url, download: `GCM101-${m.code}-track-B.csv` });
    addKids(document.body, a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Spreadsheet pack downloaded. Open it in Excel, Google Sheets or LibreOffice.');
  });
  return h('div', { class: 'card flat', style: { margin: 'var(--s3) 0' } },
    h('p', { style: { margin: 0 } }, h('strong', {}, 'Track B practice: '), `${rows.length} spreadsheet formulas from this module, ready to open. Live formulas calculate when opened; compare with the syllabus answer column.`),
    h('div', { class: 'row', style: { marginTop: 'var(--s2)' } }, btn),
    h('p', { class: 'small muted', style: { margin: 'var(--s2) 0 0' } }, 'If formulas show as text, your spreadsheet may use “;” instead of “,” between arguments — type them from the lesson instead.'));
}

// ------------------------------------------------------------------ Python runner (Track C)
export function pythonRunner(code, { id, module: m }) {
  const corpus = m ? m.examples.map((e) => e.text).join(' ') : '';
  const out = h('pre', { class: 'code', 'aria-live': 'polite', hidden: true, tabindex: 0, 'aria-label': 'Python output' });
  const verdict = h('p', { class: 'small', role: 'status' });
  const run = h('button', { class: 'btn small primary', type: 'button' }, icon('play'), 'Run in browser');
  const copy = h('button', { class: 'btn small', type: 'button' }, 'Copy code');
  const colab = h('a', { class: 'btn small quiet', href: 'https://colab.research.google.com/#create=true', target: '_blank', rel: 'noopener' }, 'Open Google Colab');
  copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code); toast('Code copied.'); } catch { toast('Copy failed — select the code and copy it manually.'); } });
  colab.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code); toast('Code copied — paste it into a new Colab cell.'); } catch { /* ignore */ } });
  run.addEventListener('click', async () => {
    const py = await import('./python.js');
    if (!(await py.confirmDownload())) return;
    run.disabled = true;
    out.hidden = false;
    out.textContent = 'Starting Python…';
    try {
      const res = await py.run(code, (msg) => { out.textContent = msg; });
      out.textContent = res.stdout || '(no output)';
      if (res.notice) out.textContent += `\n\n# ${res.notice}`;
      const v = py.compareWithComments(code, res.stdout, corpus);
      setKids(verdict, v.ok ? h('span', { class: 'chip ok' }, icon('check'), 'Output matches the syllabus comments') : h('span', { class: 'chip warn' }, icon('warn'), `Check these numbers: ${v.unmatched.join(', ')}`));
    } catch (e) {
      out.textContent = `Error: ${e.message}`;
      verdict.textContent = '';
    } finally {
      run.disabled = false;
    }
  });
  return h('div', { class: 'widget', id, 'aria-label': 'Python runner' },
    h('header', {}, icon('code'), h('h3', {}, 'Run this Python')),
    h('div', { class: 'row' }, run, copy, colab), out, verdict,
    h('p', { class: 'small muted' }, 'Runs privately in your browser with Pyodide (downloaded once on first use, then works offline). Or paste it into Google Colab or Jupyter.'));
}
