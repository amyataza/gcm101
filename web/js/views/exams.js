import { h, icon, fmtPct, statusChip } from '../ui.js';
import * as rules from '../course.js';

export async function render({ course: c, progress: p, setTitle }) {
  setTitle('Exams', 'Exams');
  const row = (id, title, meta) => {
    const ex = p.exams?.[id];
    const unlocked = rules.examUnlocked(c, p, id);
    return h('li', {}, h('a', { class: `mrow exam ${unlocked ? '' : 'locked'}`, href: `#/exam/${id}` },
      h('span', { class: 'code' }, icon('flag')), h('span', {}, h('span', { class: 't' }, title), h('br'), h('span', { class: 'meta' }, meta)),
      statusChip(ex?.passed ? 'passed' : unlocked ? (ex?.attempts?.length ? 'failed' : 'open') : 'locked')));
  };
  const cs = c.assessment.checkpointSpec;
  const fs = c.assessment.finalSpec;
  return h('section', {},
    h('h1', {}, 'Exams'),
    h('p', { class: 'lead' }, `Three checkpoint exams and a final exam. Each needs ${fmtPct(cs.passMark)} to pass; you can retake them with new questions.`),
    h('ul', { class: 'mlist' },
      c.checkpoints.map((cp) => row(cp.id, cp.title, `${cs.items} questions · ${cs.minutes} min · after ${cp.afterModule.toUpperCase()} · ${fmtPct(c.assessment.components.find((x) => x.key === 'checkpoints').weight / 3)} of the course score`)),
      row('final', 'Final exam', `${fs.items} questions (≈${fmtPct(fs.conceptualShare)} conceptual, ${fmtPct(fs.calculationShare)} calculation) · ${fs.minutes} min · ${fmtPct(c.assessment.components.find((x) => x.key === 'finalExam').weight)} of the course score`)),
    h('p', { class: 'notice', style: { marginTop: 'var(--s4)' } }, icon('info'), h('span', {}, 'Need more time? Change the time limit, or turn it off, in ', h('a', { href: '#/settings?at=exams' }, 'Settings'), '.')));
}
