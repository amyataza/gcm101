// Module overview (#/m/:id) and Check page (#/m/:id/check).
import { h, icon, fmtHours, fmtPct, fmtDate, statusChip, toast } from '../ui.js';
import * as content from '../content.js';
import * as store from '../store.js';
import * as rules from '../course.js';
import { moduleHeader, sourcesPanel, downloadButton, notAdvice, trackResume } from './shared.js';

export async function render(ctx) {
  return ctx.route.name === 'check' ? renderCheck(ctx) : renderOverview(ctx);
}

async function renderOverview({ course: c, progress: p, params, setTitle }) {
  const m = await content.module(params.id);
  const idx = c.modules.findIndex((x) => x.id === m.id);
  const status = rules.moduleStatus(c, p, m.id);
  const st = p.modules[m.id] || {};
  setTitle(`${m.code} ${m.title}`, `${m.code} · ${m.title}`);
  const prev = c.modules[idx - 1];

  const steps = [
    { key: 'learn', n: 1, title: 'Learn', desc: 'Why it matters, objectives, key ideas and terms', hours: m.hours.learn, done: st.learn?.done, href: `#/m/${m.id}/learn` },
    { key: 'practise', n: 2, title: 'Practise', desc: practiseDesc(m), hours: m.hours.practise, done: st.practise?.done, href: `#/m/${m.id}/practise` },
    { key: 'check', n: 3, title: 'Check', desc: `Knowledge check: ${m.knowledgeCheck.items} questions, pass mark ${fmtPct(c.assessment.knowledgeCheckSpec.passMark)}`, hours: m.hours.assess, done: st.kc?.passed, href: `#/m/${m.id}/check` },
  ];
  const nextStep = steps.find((s) => !s.done) || steps[2];
  const cta = status === 'passed'
    ? (c.modules[idx + 1] ? h('a', { class: 'btn primary', href: `#/m/${c.modules[idx + 1].id}` }, `Go to ${c.modules[idx + 1].code}`, icon('arrow')) : h('a', { class: 'btn primary', href: '#/exams' }, 'Go to exams', icon('arrow')))
    : h('a', { class: 'btn primary', href: nextStep.href }, status === 'locked' ? `Preview: ${nextStep.title}` : `${st.learn?.done || st.practise?.done ? 'Continue' : 'Start'}: ${nextStep.title}`, icon('arrow'));

  return h('article', {},
    moduleHeader(c, m, status),
    status === 'locked' ? h('div', { class: 'callout warn' }, h('p', { class: 'callout-title' }, icon('lock'), ' Locked until you pass the previous module'),
      h('p', {}, `Pass the ${prev.code} knowledge check (${fmtPct(c.assessment.knowledgeCheckSpec.passMark)}) to unlock this module’s knowledge check. You can still preview the reading and practice now.`),
      h('a', { class: 'btn small', href: `#/m/${prev.id}/check` }, `Go to ${prev.code} check`)) : null,
    h('p', { class: 'lead prose' }, h('strong', {}, 'Why it matters. '), h('span', { html: m.whyHtml })),
    h('h2', {}, 'Your path through this module'),
    h('ol', { class: 'steps' }, steps.map((s) => h('li', { class: s.done ? 'done' : '' }, h('a', { href: s.href },
      h('span', { class: 'n', 'aria-hidden': 'true' }, s.done ? '✓' : s.n),
      h('span', { class: 't' }, s.title, h('br'), h('span', { class: 'small muted' }, s.desc)),
      h('span', { class: 'small muted' }, s.done ? 'Done' : `≈ ${fmtHours(s.hours)}`))))),
    h('div', { class: 'next-bar' }, cta),
    h('h2', {}, 'By the end you will be able to'),
    h('ol', { class: 'objectives prose' }, m.objectives.map((o) => h('li', {}, h('span', { class: 'level' }, o.level), h('span', { html: o.html })))),
    h('div', { class: 'row', style: { marginTop: 'var(--s4)' } }, await downloadButton(m),
      h('button', { class: 'btn small quiet', onclick: () => { location.hash = `#/m/${m.id}/learn?print=1`; } }, icon('print'), 'Printable notes')),
    notAdvice(),
    await sourcesPanel(c, m));
}

async function renderCheck({ course: c, progress: p, params, setTitle, rerender }) {
  const m = await content.module(params.id);
  const idx = c.modules.findIndex((x) => x.id === m.id);
  const status = rules.moduleStatus(c, p, m.id);
  const st = store.moduleState(p, m.id);
  setTitle(`Check: ${m.code}`, `${m.code} · Check`);
  trackResume(m, `#/m/${m.id}/check`, 'Check your understanding');
  const pass = c.assessment.knowledgeCheckSpec.passMark;
  const locked = status === 'locked';
  const last = st.kc.attempts[st.kc.attempts.length - 1];

  const kcCard = h('section', { class: 'card', 'aria-labelledby': 'kc-t' },
    h('h2', { id: 'kc-t' }, 'Knowledge check'),
    h('ul', { class: 'small' },
      h('li', {}, `${m.knowledgeCheck.items} questions${m.knowledgeCheck.numericMin ? `, at least ${m.knowledgeCheck.numericMin} with numeric answers` : ''}`),
      h('li', {}, `Pass mark ${fmtPct(pass)} — passing unlocks the next module`),
      h('li', {}, 'Unlimited attempts; questions and numbers change each time'),
      h('li', {}, `Numeric answers are accepted within ±${(c.assessment.knowledgeCheckSpec.tolerance * 100).toFixed(1)}%`),
      h('li', {}, 'No time limit. Feedback and the worked answer after each question.')),
    st.kc.attempts.length ? h('p', {}, statusChip(st.kc.passed ? 'passed' : 'failed'), ' ', `Best score ${fmtPct(st.kc.best)} · ${st.kc.attempts.length} attempt${st.kc.attempts.length === 1 ? '' : 's'}${last ? ` · last on ${fmtDate(last.at)}` : ''}`) : null,
    locked
      ? h('p', { class: 'callout warn' }, icon('lock'), ` Pass ${c.modules[idx - 1].code}’s knowledge check first.`)
      : h('a', { class: 'btn primary', href: `#/quiz/${m.id}` }, st.kc.passed ? 'Practise again' : st.kc.attempts.length ? 'Try again with new questions' : 'Start the knowledge check', icon('arrow')));

  // Applied and other tasks from the syllabus assessment checklist, self-assessed.
  const tasks = m.assessment.filter((a) => a.kind !== 'knowledge-check' && a.kind !== 'checkpoint');
  const appliedRange = c.assessment.appliedTaskModules;
  const counts = m.n >= appliedRange.from && m.n <= appliedRange.to;
  const taskCards = tasks.map((t, i) => {
    const key = `t${i}`;
    const saved = st.applied[key] || {};
    const needsData = /download|current|official sources|this month|recent|latest|today|find three real/i.test(t.text);
    const levelSel = h('select', { id: `lvl-${key}`, 'aria-describedby': `lvl-help-${key}` },
      h('option', { value: '' }, 'Not assessed yet'),
      rules.APPLIED_LEVELS.map((l) => h('option', { value: l.key, selected: saved.level === l.key }, l.label)));
    const notes = h('textarea', { id: `notes-${key}`, placeholder: 'Your notes, answers or links (saved only on this device)' }, saved.notes || '');
    const save = async () => {
      await store.saveProgress((pp) => { store.moduleState(pp, m.id).applied[key] = { level: levelSel.value, notes: notes.value, at: new Date().toISOString(), kind: t.kind }; });
      toast('Saved on this device.');
    };
    levelSel.addEventListener('change', save);
    notes.addEventListener('change', save);
    return h('section', { class: 'card flat', style: { marginTop: 'var(--s3)' } },
      h('h3', { style: { marginTop: 0 } }, t.name, t.kind === 'python-optional' ? h('span', { class: 'chip' }, 'Optional') : null),
      h('p', { class: 'prose', html: t.html }),
      needsData ? h('p', { class: 'notice' }, icon('online'), h('span', {}, 'Needs current data from the internet, so it cannot be finished fully offline. Do it when you are next online.')) : null,
      h('div', { class: 'field' }, h('label', { for: `notes-${key}` }, 'Notes'), notes),
      h('div', { class: 'field' }, h('label', { for: `lvl-${key}` }, 'Self-assessment'), levelSel,
        h('p', { id: `lvl-help-${key}`, class: 'small muted' }, 'Compare your work with the worked examples and rate it honestly using the capstone rubric’s bands: Excellent (85–100%), Proficient (70–84%), Developing (50–69%), Insufficient (under 50%).')));
  });

  const cp = m.checkpointAfter && c.checkpoints.find((x) => x.id === m.checkpointAfter);
  const nextMod = c.modules[idx + 1];
  return h('article', {},
    moduleHeader(c, m, status, 'Check'),
    kcCard,
    st.kc.passed && nextMod ? h('div', { class: 'callout ok', style: { marginTop: 'var(--s4)' } }, h('p', { class: 'callout-title' }, icon('check'), ` ${m.code} passed`), h('a', { class: 'btn primary', href: `#/m/${nextMod.id}` }, `Continue to ${nextMod.code}`, icon('arrow'))) : null,
    cp ? h('div', { class: 'callout', style: { marginTop: 'var(--s4)' } }, h('p', { class: 'callout-title' }, icon('flag'), ` ${cp.title}`),
      h('p', {}, `Comes after this module: ${c.assessment.checkpointSpec.items} questions, ${c.assessment.checkpointSpec.minutes} minutes, formula sheet and calculator allowed, pass mark ${fmtPct(c.assessment.checkpointSpec.passMark)}.`),
      h('a', { class: 'btn small', href: `#/exam/${cp.id}` }, 'Go to the checkpoint')) : null,
    tasks.length ? [h('h2', {}, 'Tasks from the syllabus'),
      h('p', { class: 'muted' }, counts
        ? `Applied tasks in M${appliedRange.from}–M${appliedRange.to} count for ${fmtPct(c.assessment.components.find((x) => x.key === 'appliedTasks').weight)} of the course score (self- or peer-assessed with a rubric). Other tasks are for practice.`
        : 'These tasks are for practice; they do not count towards the course score.'),
      taskCards] : null,
    notAdvice(),
    await sourcesPanel(c, m));
}

function practiseDesc(m) {
  const n = (k) => m.examples.filter((e) => e.kind === k).length;
  const parts = [[n('Worked example'), 'worked example'], [n('Case'), 'case'], [n('Exercise'), 'exercise']].filter(([c]) => c).map(([c, w]) => `${c} ${w}${c === 1 ? '' : 's'}`);
  return parts.join(', ').replace(/, ([^,]*)$/, ' and $1');
}
