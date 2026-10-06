import { h, icon, fmtPct, fmtHours, toast, statusChip, addKids } from '../ui.js';
import * as store from '../store.js';
import * as rules from '../course.js';

export async function render({ course: c, progress: p, setTitle, rerender }) {
  setTitle('Capstone', 'Capstone');
  const cap = c.capstone;
  const cs = p.capstone || {};
  const sc = rules.capstoneScore(c, p);
  const save = (mut, msg) => store.saveProgress((pp) => { pp.capstone ||= { milestones: {}, notes: {}, rubric: {} }; mut(pp.capstone); }).then(() => msg && toast(msg));

  const milestones = cap.milestones.map((ms) => {
    const ready = !!p.modules[ms.after]?.kc?.passed;
    const id = `ms-${ms.name.replace(/\W+/g, '')}`;
    const cb = h('input', { type: 'checkbox', id, checked: !!cs.milestones?.[ms.name], style: { width: '22px', height: '22px' } });
    cb.addEventListener('change', () => save((x) => { x.milestones[ms.name] = cb.checked; }, cb.checked ? `${ms.name} marked done.` : null));
    return h('li', { class: 'row', style: { alignItems: 'flex-start', marginBottom: 'var(--s2)' } }, cb,
      h('label', { for: id }, h('strong', {}, ms.name), ` (after ${ms.after.toUpperCase()}): ${ms.text}`, ready ? '' : h('span', { class: 'small muted' }, ` — suggested once you pass ${ms.after.toUpperCase()}`)));
  });

  const deliverables = cap.deliverables.map((d) => {
    const id = `del-${d.n}`;
    const ta = h('textarea', { id, placeholder: 'Draft notes, figures and sources for this section (saved only on this device)' }, cs.notes?.[d.n] || '');
    ta.addEventListener('change', () => save((x) => { x.notes[d.n] = ta.value; }, 'Saved on this device.'));
    return h('details', { class: 'card flat', style: { marginTop: 'var(--s2)' } },
      h('summary', { style: { cursor: 'pointer', fontWeight: 650, minHeight: 'var(--tap)', display: 'flex', alignItems: 'center' } }, `${d.n}. ${d.section}`, cs.notes?.[d.n] ? h('span', { class: 'chip ok', style: { marginLeft: 'var(--s2)' } }, 'Has notes') : null),
      h('p', { class: 'small muted' }, `Draws on ${d.modules}`),
      h('p', { html: d.produceHtml }),
      h('div', { class: 'field' }, h('label', { for: id }, 'Your notes'), ta));
  });

  const rubric = h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': 'Capstone rubric' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Criterion'), h('th', { scope: 'col' }, 'Weight'), ...cap.rubric.levels.map((l) => h('th', { scope: 'col' }, `${l.name} (${l.band})`)), h('th', { scope: 'col' }, 'Your rating'))),
    h('tbody', {}, cap.rubric.criteria.map((cr) => {
      const sel = h('select', { 'aria-label': `Rating for ${cr.criterion}` }, h('option', { value: '' }, 'Not rated'), rules.APPLIED_LEVELS.map((l) => h('option', { value: l.key, selected: cs.rubric?.[cr.criterion] === l.key }, l.label)));
      sel.addEventListener('change', async () => { await save((x) => { x.rubric[cr.criterion] = sel.value; }); rerender(); });
      return h('tr', {}, h('th', { scope: 'row' }, cr.criterion), h('td', {}, fmtPct(cr.weight)), ...cr.descriptors.map((d) => h('td', { class: 'small' }, d)), h('td', {}, sel));
    }))));

  const template = h('button', { class: 'btn', type: 'button' }, icon('sheet'), 'Download workbook outline (CSV)');
  template.addEventListener('click', () => {
    const rows = [['Section', 'Item', 'Value', 'Formula or source', 'Notes'],
      ['3 Bond valuation', 'Price at current yield', '', '=-PV(yield,years,coupon,face)', 'M13 WE 13.1'],
      ['3 Bond valuation', 'Yield to maturity', '', '=RATE(years,coupon,-price,face)', 'M13 WE 13.3'],
      ['3 Bond valuation', 'Modified duration', '', '=MDURATION(settle,maturity,coupon,yield,freq)', 'M13 WE 13.6'],
      ['3 Bond valuation', 'DV01', '', 'modified duration × price × 0.0001', 'M13 WE 13.6'],
      ['3 Bond valuation', 'Spread over government curve', '', 'bond yield − government yield', 'M13 WE 13.8'],
      ['4 Equity valuation', 'Six ratios', '', 'EPS, P/E, P/B, dividend yield, ROE, EV/EBITDA', 'M14 WE 14.1'],
      ['4 Equity valuation', 'CAPM cost of equity', '', 'rf + beta × ERP', 'M14 WE 14.2'],
      ['4 Equity valuation', 'Intrinsic value (DDM or DCF)', '', 'D1/(k−g) or DCF', 'M14 WE 14.3–14.6'],
      ['4 Equity valuation', 'Relative valuation', '', 'median peer multiple × own metric', 'M14 WE 14.7'],
      ['4 Equity valuation', 'Implied growth', '', '(P0 × k − D0)/(P0 + D0)', 'M14 WE 14.3'],
      ['5 Hedging plan', 'FX forward', '', 'Spot × (1 + r_quote)/(1 + r_base)', 'M8 WE 8.3'],
      ['5 Hedging plan', 'Option alternative', '', 'Black-Scholes-Merton', 'M15 WE 15.3'],
      ['6 Trade & settlement', 'Settlement date', '', '=WORKDAY(trade_date,n,holidays)', 'M12 WE 12.5'],
      ['7 Risk', 'Position beta', '', '=SLOPE(stock,market)', 'M16 WE 16.3'],
      ['7 Risk', '95% one-day VaR', '', 'value × 1.645 × daily σ', 'M17 WE 17.1'],
      ['Sources', 'List every data source with date accessed', '', '', 'Use only public information']];
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const url = URL.createObjectURL(new Blob(['﻿' + rows.map((r) => r.map(q).join(',')).join('\r\n')], { type: 'text/csv' }));
    const a = h('a', { href: url, download: 'GCM101-capstone-workbook-outline.csv' });
    addKids(document.body, a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  const exportNotes = h('button', { class: 'btn', type: 'button' }, icon('download'), 'Export my draft for peer review (text)');
  exportNotes.addEventListener('click', () => {
    const txt = [`${cap.title}\n`, ...cap.deliverables.map((d) => `## ${d.n}. ${d.section}\n${cs.notes?.[d.n] || '(no notes yet)'}\n`)].join('\n');
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    const a = h('a', { href: url, download: 'GCM101-capstone-draft.txt' });
    addKids(document.body, a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  const markPassed = h('button', { class: 'btn primary', type: 'button', disabled: !(sc.complete && sc.score >= cap.passMark) }, 'Record my capstone as complete');
  markPassed.addEventListener('click', async () => { await save((x) => { x.passed = true; x.submittedAt = new Date().toISOString(); }, 'Capstone recorded as complete.'); rerender(); });

  return h('section', {},
    h('p', { class: 'eyebrow' }, 'Capstone project'),
    h('h1', {}, cap.title),
    h('div', { class: 'row' }, statusChip(cs.passed ? 'passed' : Object.keys(cs.notes || {}).length ? 'progress' : 'open'), h('span', { class: 'chip' }, icon('clock'), `${fmtHours(cap.hours.core)} + ${fmtHours(cap.hours.python)} Python (optional)`), h('span', { class: 'chip' }, `Pass: ${fmtPct(cap.passMark)} on the rubric`)),
    h('p', { class: 'prose', html: cap.purposeHtml }),
    h('h2', {}, 'Scenario'), h('div', { class: 'prose', html: cap.scenarioHtml }),
    h('div', { class: 'callout warn' }, h('p', { class: 'callout-title' }, icon('shield'), ' Integrity and safety'), h('p', { html: cap.integrityHtml })),
    h('h2', {}, 'Milestones'), h('ul', { style: { listStyle: 'none', padding: 0 } }, milestones),
    h('h2', {}, 'Deliverables'), h('p', { class: 'prose', html: cap.formatHtml }),
    h('div', { class: 'row' }, template, exportNotes),
    ...deliverables,
    h('h2', {}, 'Rubric — rate your work (or ask a peer)'),
    h('p', { class: 'small muted' }, 'Choose the band that best describes the work for each criterion. A peer can use the same table with your exported draft.'),
    rubric,
    h('p', {}, h('strong', {}, `Rubric score: ${fmtPct(sc.score, 1)}`), sc.complete ? '' : ' (rate every criterion to finish)'),
    markPassed);
}
