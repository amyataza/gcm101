import { h, icon, fmtPct, fmtHours, fmtDate, statusChip, toast, addKids } from '../ui.js';
import * as store from '../store.js';
import * as rules from '../course.js';

export async function render({ course: c, progress: p, setTitle }) {
  setTitle('My progress', 'Progress');
  const ws = rules.weightedScore(c, p);
  const passed = rules.modulesPassed(c, p);
  const totalMin = c.modules.reduce((s, m) => s + (p.modules[m.id]?.time || 0), 0) / 60;

  const scoreTable = h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': 'Course score' },
    h('table', {}, h('caption', { class: 'sr-only' }, 'Course score by component'),
      h('thead', {}, h('tr', {}, ['Component', 'Weight', 'Your score', 'Contributes'].map((x) => h('th', { scope: 'col' }, x)))),
      h('tbody', {}, ws.parts.map((x) => h('tr', {}, h('th', { scope: 'row' }, x.label), h('td', {}, fmtPct(x.weight)), h('td', {}, fmtPct(x.score)), h('td', {}, fmtPct(x.weight * x.score, 1))))),
      h('tfoot', {}, h('tr', {}, h('th', { scope: 'row' }, 'Overall'), h('td', {}, '100%'), h('td', {}), h('td', {}, h('strong', {}, fmtPct(ws.overall, 1)))))));

  const modTable = h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': 'Modules' },
    h('table', {}, h('caption', { class: 'sr-only' }, 'Progress by module'),
      h('thead', {}, h('tr', {}, ['Module', 'Status', 'Best check', 'Attempts', 'Your time', 'Syllabus estimate'].map((x) => h('th', { scope: 'col' }, x)))),
      h('tbody', {}, c.modules.map((m) => {
        const st = p.modules[m.id];
        return h('tr', {}, h('th', { scope: 'row' }, h('a', { href: `#/m/${m.id}` }, `${m.code} ${m.title}`)), h('td', {}, statusChip(rules.moduleStatus(c, p, m.id))),
          h('td', {}, st?.kc?.attempts?.length ? fmtPct(st.kc.best) : '—'), h('td', {}, st?.kc?.attempts?.length || 0),
          h('td', {}, st?.time ? fmtHours(st.time / 3600) : '—'), h('td', {}, fmtHours(m.hours.core)));
      }))));

  const exportTime = h('button', { class: 'btn small', type: 'button' }, icon('download'), 'Export my study-time log (CSV)');
  exportTime.addEventListener('click', () => {
    const rows = [['module', 'syllabus_core_hours', 'my_active_minutes', 'kc_attempts', 'kc_best_pct', 'kc_passed'], ...c.modules.map((m) => {
      const st = p.modules[m.id] || {};
      return [m.code, m.hours.core, Math.round((st.time || 0) / 60), st.kc?.attempts?.length || 0, Math.round((st.kc?.best || 0) * 100), st.kc?.passed ? 1 : 0];
    })];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\r\n')], { type: 'text/csv' }));
    const a = h('a', { href: url, download: 'GCM101-study-time.csv' });
    addKids(document.body, a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Saved. Nothing was sent anywhere — share the file only if you choose to (for example, in a pilot study).');
  });

  return h('section', {},
    h('h1', {}, 'My progress'),
    h('div', { class: 'grid three' },
      stat(`${passed} / ${c.modules.length}`, 'modules passed'),
      stat(fmtPct(ws.overall, 1), 'weighted course score'),
      stat(fmtHours(totalMin / 60) || '0 min', 'active study time on this device')),
    h('h2', {}, 'Completion'),
    h('ul', { class: 'small' },
      check(ws.cpPassed, `Pass all three checkpoint exams (${fmtPct(c.assessment.checkpointSpec.passMark)})`),
      check(ws.finPassed, `Pass the final exam (${fmtPct(c.assessment.finalSpec.passMark)})`),
      check(ws.capPassed, `Pass the capstone (${fmtPct(c.capstone.passMark)} on the rubric)`),
      check(ws.overall >= 0.7, 'Overall weighted score of at least 70%')),
    h('p', { class: 'small muted' }, c.assessment.completion),
    ws.complete ? h('div', { class: 'callout ok' }, h('p', { class: 'callout-title' }, icon('star'), ' You have completed GCM-101'),
      h('p', {}, 'Print your learning record below. It is a personal record of your own study on this device — not a certificate, credential or accredited qualification, and no organisation has verified it.'),
      h('button', { class: 'btn', type: 'button', onclick: () => window.print() }, icon('print'), 'Print my learning record')) : null,
    h('h2', {}, 'Course score'),
    h('p', { class: 'small muted' }, 'Weights from the syllabus (B5). Knowledge checks use your best attempt; applied tasks and the capstone use your own rubric ratings.'),
    scoreTable,
    h('h2', {}, 'Modules'),
    modTable,
    h('h2', {}, 'Study time'),
    h('p', { class: 'small' }, 'Active time is counted only while a module page is open and you have interacted in the last two minutes. It is stored on this device only and helps check whether the syllabus hour estimates are realistic.'),
    exportTime,
    h('p', { class: 'small muted' }, `Started ${p.startedAt ? fmtDate(p.startedAt) : '—'}. `, h('a', { href: '#/settings?at=data' }, 'Back up or move your progress')));
}
const stat = (v, k) => h('div', { class: 'card flat' }, h('div', { style: { fontSize: '1.6rem', fontWeight: 800 } }, v), h('div', { class: 'small muted' }, k));
const check = (ok, text) => h('li', {}, ok ? '✓ ' : '○ ', h('span', { class: 'sr-only' }, ok ? 'Done: ' : 'Not yet: '), text);
