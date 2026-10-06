import { h, icon, fmtHours, statusChip } from '../ui.js';
import * as rules from '../course.js';

export async function render({ course: c, progress: p, setTitle }) {
  setTitle('Course map', 'Course map');
  const next = rules.nextModule(c, p);
  const passed = rules.modulesPassed(c, p);
  const left = rules.hoursLeft(c, p);
  const total = c.hours.statedCore;

  // One clear next action.
  let hero;
  if (p.resume && next && p.resume.module === next.id) {
    const st = p.modules[next.id];
    hero = heroCard('Continue where you left off', `${next.code} · ${next.title}`, p.resume.label,
      `About ${fmtHours(rules.moduleHoursLeft(next, st))} left in this module`, p.resume.route, 'Continue');
  } else if (next) {
    const first = passed === 0 && !p.modules[next.id];
    hero = heroCard(first ? 'Start here' : 'Up next', `${next.code} · ${next.title}`, next.why,
      `About ${fmtHours(next.hours.core)} · Learn, practise, then check`, `#/m/${next.id}`, first ? 'Start Module 0' : `Open ${next.code}`);
  } else {
    hero = heroCard('All modules passed', 'Final exam and capstone', 'You have passed every module knowledge check. Finish with the checkpoint exams, the final exam and the capstone.', '', '#/exams', 'Go to exams');
  }

  const parts = c.parts.map((part) => {
    const items = part.modules.map((id) => {
      const m = c.modules.find((x) => x.id === id);
      const status = rules.moduleStatus(c, p, id);
      const row = h('li', {}, h('a', { class: `mrow ${status === 'locked' ? 'locked' : ''}`, href: `#/m/${id}` },
        h('span', { class: 'code' }, m.code),
        h('span', {}, h('span', { class: 't' }, m.title), h('br'), h('span', { class: 'meta' }, `${fmtHours(m.hours.core)} core${m.hours.python ? ` · +${fmtHours(m.hours.python)} Python (optional)` : ''}`)),
        statusChip(status)));
      const cp = c.checkpoints.find((x) => x.afterModule === id);
      if (!cp) return row;
      const ex = p.exams?.[cp.id];
      const unlocked = rules.examUnlocked(c, p, cp.id);
      return [row, h('li', {}, h('a', { class: `mrow exam ${unlocked ? '' : 'locked'}`, href: `#/exam/${cp.id}` },
        h('span', { class: 'code' }, icon('flag')),
        h('span', {}, h('span', { class: 't' }, cp.title), h('br'), h('span', { class: 'meta' }, `${c.assessment.checkpointSpec.items} questions · ${c.assessment.checkpointSpec.minutes} minutes · formula sheet`)),
        statusChip(ex?.passed ? 'passed' : unlocked ? (ex?.attempts?.length ? 'failed' : 'open') : 'locked')))];
    });
    return h('section', { class: 'part', 'aria-labelledby': `part-${part.n}` },
      h('p', { class: 'eyebrow' }, `Part ${part.n}`),
      h('h2', { id: `part-${part.n}` }, part.title || part.short),
      h('ul', { class: 'mlist' }, items));
  });

  const finale = h('section', { class: 'part', 'aria-labelledby': 'part-end' },
    h('p', { class: 'eyebrow' }, 'Finish'),
    h('h2', { id: 'part-end' }, 'Capstone and final exam'),
    h('ul', { class: 'mlist' },
      h('li', {}, h('a', { class: 'mrow exam', href: '#/capstone' }, h('span', { class: 'code' }, icon('star')),
        h('span', {}, h('span', { class: 't' }, c.capstone.title), h('br'), h('span', { class: 'meta' }, `${fmtHours(c.capstone.hours.core)} · milestones after M12, M13, M15 and M19`)),
        statusChip(p.capstone?.passed ? 'passed' : Object.keys(p.capstone?.milestones || {}).length ? 'progress' : 'open'))),
      h('li', {}, h('a', { class: `mrow exam ${rules.examUnlocked(c, p, 'final') ? '' : 'locked'}`, href: '#/exam/final' }, h('span', { class: 'code' }, icon('flag')),
        h('span', {}, h('span', { class: 't' }, 'Final exam'), h('br'), h('span', { class: 'meta' }, `${c.assessment.finalSpec.items} questions · ${c.assessment.finalSpec.minutes} minutes · unlocks after M19`)),
        statusChip(p.exams?.final?.passed ? 'passed' : rules.examUnlocked(c, p, 'final') ? 'open' : 'locked')))));

  return h('div', {},
    h('h1', { class: 'sr-only' }, 'GCM-101 course map'),
    hero,
    h('div', { class: 'card flat', style: { marginTop: 'var(--s4)' } },
      h('div', { class: 'row', style: { justifyContent: 'space-between' } },
        h('strong', {}, `${passed} of ${c.modules.length} modules passed`),
        h('span', { class: 'muted small' }, `About ${fmtHours(left)} of ${total} h left`)),
      h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Course progress', 'aria-valuemin': 0, 'aria-valuemax': c.modules.length, 'aria-valuenow': passed, style: { marginTop: 'var(--s2)' } },
        h('span', { style: { width: `${(passed / c.modules.length) * 100}%` } }))),
    h('p', { class: 'notice', style: { marginTop: 'var(--s3)' } }, icon('info'),
      h('span', {}, 'Pass each module’s knowledge check (70%) to unlock the next. You can preview any module’s reading at any time.')),
    ...parts, finale);
}

function heroCard(eyebrow, title, body, meta, href, cta) {
  return h('section', { class: 'card hero', 'aria-labelledby': 'hero-t' },
    h('p', { class: 'eyebrow' }, eyebrow),
    h('h2', { id: 'hero-t', style: { marginTop: 0 } }, title),
    body ? h('p', { class: 'prose' }, body) : null,
    meta ? h('p', { class: 'muted small' }, icon('clock'), ' ', meta) : null,
    h('a', { class: 'btn primary', href }, cta, icon('arrow')));
}
