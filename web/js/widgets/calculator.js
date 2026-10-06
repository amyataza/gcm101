// Exam calculator and formula sheet (both permitted in exams per syllabus B5).
// The calculator uses a small recursive-descent parser — no eval — and supports + − × ÷ ^ ( ),
// sqrt, ln, exp, N(x) (standard normal CDF) and Ans.
import { h, icon, addKids } from '../ui.js';
import { normCdf } from '../calc.js';
import * as content from '../content.js';
import { examModules } from '../course.js';

export function evaluate(expr, ans = 0) {
  const s = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '').replace(/\s+/g, '');
  let i = 0;
  const peek = () => s[i];
  const eat = (c) => { if (s[i] === c) { i++; return true; } return false; };
  const fns = { sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp, N: normCdf, abs: Math.abs };
  function expr0() { let v = term(); for (;;) { if (eat('+')) v += term(); else if (eat('-')) v -= term(); else return v; } }
  function term() { let v = power(); for (;;) { if (eat('*')) v *= power(); else if (eat('/')) v /= power(); else return v; } }
  function power() { const b = unary(); if (eat('^')) return b ** power(); return b; }
  function unary() { if (eat('-')) return -unary(); if (eat('+')) return unary(); return postfix(); }
  function postfix() { let v = atom(); while (eat('%')) v /= 100; return v; }
  function atom() {
    if (eat('(')) { const v = expr0(); if (!eat(')')) throw new Error('Missing )'); return v; }
    if (eat('√')) return Math.sqrt(atom());
    const m = s.slice(i).match(/^(\d+\.?\d*(?:e[-+]?\d+)?|\.\d+)/i);
    if (m) { i += m[0].length; return Number(m[0]); }
    const f = s.slice(i).match(/^(sqrt|ln|log|exp|abs|N|Ans|pi|e)/);
    if (f) {
      i += f[0].length;
      if (f[0] === 'Ans') return ans;
      if (f[0] === 'pi') return Math.PI;
      if (f[0] === 'e' && peek() !== '(') return Math.E;
      if (!eat('(')) throw new Error(`${f[0]} needs (`);
      const v = expr0();
      if (!eat(')')) throw new Error('Missing )');
      return fns[f[0]](v);
    }
    throw new Error(`Unexpected "${peek() ?? 'end'}"`);
  }
  const v = expr0();
  if (i < s.length) throw new Error(`Unexpected "${s[i]}"`);
  return v;
}

let open = null;
function drawer(title, body, opener) {
  open?.close();
  const close = () => { el.remove(); open = null; opener?.focus(); };
  const el = h('div', { class: 'drawer', role: 'dialog', 'aria-modal': 'false', 'aria-label': title },
    h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('h2', { style: { margin: 0, fontSize: '1.1rem' } }, title), h('button', { class: 'btn small quiet', type: 'button', onclick: close }, icon('x'), 'Close')),
    body);
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  addKids(document.body, el);
  open = { close };
  addEventListener('hashchange', close, { once: true });
  return el;
}

export function openCalculator(opener) {
  let ans = 0;
  const input = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Calculation', placeholder: 'e.g. 10000*1.08^5', autocomplete: 'off' });
  const out = h('div', { class: 'calc-display', role: 'status', 'aria-live': 'polite' }, '0');
  const hist = h('ol', { class: 'small', reversed: true, style: { maxHeight: '8rem', overflow: 'auto' } });
  const run = () => {
    try {
      const v = evaluate(input.value, ans);
      ans = v;
      out.textContent = Number.isFinite(v) ? Number(v.toPrecision(12)).toString() : 'Error';
      hist.prepend(h('li', {}, `${input.value} = ${out.textContent}`));
      input.value = '';
    } catch (e) { out.textContent = e.message; }
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
  const keys = ['7', '8', '9', '÷', '(', '4', '5', '6', '×', ')', '1', '2', '3', '−', '^', '0', '.', '%', '+', '√', 'ln(', 'exp(', 'N(', 'Ans', 'C'];
  const grid = h('div', { class: 'calc-grid' }, keys.map((k) => {
    const b = h('button', { type: 'button', 'aria-label': { '÷': 'divide', '×': 'times', '−': 'minus', '^': 'power', '√': 'square root', 'N(': 'standard normal N of', C: 'clear' }[k] || k }, k);
    b.addEventListener('click', () => { if (k === 'C') { input.value = ''; out.textContent = '0'; } else input.value += k; input.focus(); });
    return b;
  }));
  const eq = h('button', { class: 'btn primary block', type: 'button', style: { marginTop: '6px' } }, '=');
  eq.addEventListener('click', run);
  drawer('Calculator', h('div', {}, out, input, h('div', { style: { marginTop: '6px' } }, grid, eq), h('p', { class: 'small muted' }, 'Type or tap. ^ is “to the power”, N(x) is the standard normal probability used in Black-Scholes, Ans is the last result.'), hist), opener);
  input.focus();
}

export async function openFormulaSheet(opener, c, examId) {
  const sheet = await content.overlay('formula-sheet');
  const mods = examId ? examModules(c, examId) : c.modules;
  const full = await Promise.all(mods.map((m) => content.module(m.id)));
  const body = h('div', {}, full.map((m) => {
    const lines = [...(m.formulas ? m.formulas.split('\n') : []), ...(sheet.modules?.[m.id] || [])];
    if (!lines.length) return null;
    return h('section', {}, h('h3', { style: { fontSize: '1rem' } }, `${m.code} · ${m.title}`), h('pre', { class: 'code', tabindex: '0' }, h('code', {}, lines.join('\n'))));
  }), h('p', { class: 'small muted' }, 'From the syllabus’s core formulas and the formulas used in its worked examples.'));
  drawer('Formula sheet', body, opener);
}
