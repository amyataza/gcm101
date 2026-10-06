// Knowledge checks (#/quiz/:module) and exams (#/exam/:id).
// Knowledge checks: one question per screen, immediate feedback with the worked answer, unlimited attempts.
// Exams: question navigator, flags, formula sheet, calculator, adjustable/extendable timer (WCAG 2.2.1),
// results with full review. Sessions persist on the device, so a refresh or flat battery loses nothing.
import { h, icon, fmtPct, fmtDate, toast, confirmDialog, announce, statusChip, setKids } from '../ui.js';
import * as content from '../content.js';
import * as store from '../store.js';
import * as rules from '../course.js';
import * as Q from '../quiz/engine.js';
import { notAdvice } from './shared.js';

export async function render(ctx) {
  return ctx.route.name === 'exam' ? renderExam(ctx) : renderKC(ctx);
}

async function banks() {
  const [numeric, authored] = await Promise.all([content.overlay('quiz-numeric'), content.overlay('quiz-items')]);
  return { numeric: numeric.items || [], authored: authored.items || [], tolerance: numeric.tolerance ?? 0.005 };
}

// ================================================================== knowledge check
async function renderKC({ course: c, params, setTitle, rerender }) {
  const m = await content.module(params.id);
  const p = await store.progress();
  setTitle(`Knowledge check: ${m.code}`, `${m.code} · Knowledge check`);
  if (rules.moduleStatus(c, p, m.id) === 'locked') {
    return h('section', {}, h('h1', {}, `${m.code} knowledge check is locked`), h('p', {}, 'Pass the previous module’s knowledge check first.'), h('a', { class: 'btn primary', href: `#/m/${m.id}` }, 'Back to the module'));
  }
  const b = await banks();
  const key = `session:kc:${m.id}`;
  let session = await store.get(key);
  if (!session || session.contentVersion !== c.contentVersion) {
    const seed = Q.newSeed();
    const kc = Q.buildKnowledgeCheck(m, b, seed);
    session = { contentVersion: c.contentVersion, seed, items: kc.items, responses: {}, checked: {}, i: 0, startedAt: new Date().toISOString() };
    await store.set(key, session);
  }
  const passMark = c.assessment.knowledgeCheckSpec.passMark;
  const root = h('section', { class: 'qcard' });
  const save = () => store.set(key, session);

  const draw = () => {
    const n = session.items.length;
    if (session.done) return drawResults();
    const it = session.items[session.i];
    const checked = session.checked[session.i];
    const resp = session.responses[session.i];
    const answerUi = itemInput(it, resp, (v) => { session.responses[session.i] = v; save(); }, !!checked);
    const fb = checked ? feedback(it, Q.grade(it, resp, b.tolerance), c) : null;
    const checkBtn = h('button', { class: 'btn primary', type: 'button' }, 'Check answer');
    checkBtn.addEventListener('click', () => {
      if (session.responses[session.i] === undefined || session.responses[session.i] === '') { toast('Choose or type an answer first.'); return; }
      session.checked[session.i] = true;
      save();
      draw();
      root.querySelector('.feedback')?.focus();
    });
    const nextBtn = h('button', { class: 'btn primary', type: 'button' }, session.i === n - 1 ? 'See my result' : 'Next question', icon('arrow'));
    nextBtn.addEventListener('click', async () => {
      if (session.i === n - 1) { await finish(); return; }
      session.i++;
      await save();
      draw();
      root.querySelector('h1')?.focus();
    });
    setKids(root, 
      h('p', { class: 'eyebrow' }, `${m.code} knowledge check · question ${session.i + 1} of ${n}`),
      h('div', { class: 'progress', 'aria-hidden': 'true' }, h('span', { style: { width: `${((session.i + (checked ? 1 : 0)) / n) * 100}%` } })),
      h('h1', { class: 'qprompt', tabindex: '-1' }, it.prompt),
      it.type === 'numeric' ? h('p', { class: 'small muted' }, 'Numbers are randomised and illustrative. Answers within ±0.5% are accepted.') : null,
      answerUi,
      fb,
      h('div', { class: 'row', style: { marginTop: 'var(--s3)' } }, checked ? nextBtn : checkBtn, calcButton(), h('a', { class: 'btn quiet', href: `#/m/${m.id}/check` }, 'Save and leave')));
  };

  const finish = async () => {
    const s = Q.score(session.items, session.responses, b.tolerance);
    session.done = true;
    session.result = { pct: s.pct, points: s.points, total: s.total };
    await save();
    const passed = s.pct >= passMark;
    await store.saveProgress((pp) => {
      const st = store.moduleState(pp, m.id);
      st.kc.attempts.push({ at: new Date().toISOString(), pct: s.pct, seed: session.seed });
      st.kc.best = Math.max(st.kc.best || 0, s.pct);
      if (passed) st.kc.passed = true;
      pp.resume = null;
    });
    draw();
  };

  const drawResults = () => {
    const r = session.result;
    const passed = r.pct >= passMark;
    const idx = c.modules.findIndex((x) => x.id === m.id);
    const nextMod = c.modules[idx + 1];
    const again = h('button', { class: passed ? 'btn' : 'btn primary', type: 'button' }, 'Try again with new questions');
    again.addEventListener('click', async () => { await store.set(key, null); rerender(); });
    setKids(root, 
      h('p', { class: 'eyebrow' }, `${m.code} knowledge check · result`),
      h('h1', { tabindex: '-1' }, passed ? `Passed: ${fmtPct(r.pct)}` : `${fmtPct(r.pct)} — not passed yet`),
      h('p', {}, statusChip(passed ? 'passed' : 'failed'), ` ${r.points} of ${r.total} correct. Pass mark ${fmtPct(passMark)}.`),
      passed ? h('p', { class: 'callout ok' }, nextMod ? `${nextMod.code} is now unlocked.` : 'You have passed the last module. The final exam is unlocked.') : h('p', { class: 'callout' }, 'Review the questions below, revisit the lesson, then try again. The questions and numbers will change.'),
      h('div', { class: 'row' },
        passed && nextMod ? h('a', { class: 'btn primary', href: `#/m/${nextMod.id}` }, `Go to ${nextMod.code}`, icon('arrow')) : null,
        passed && !nextMod ? h('a', { class: 'btn primary', href: '#/exams' }, 'Go to exams', icon('arrow')) : null,
        m.checkpointAfter && passed ? h('a', { class: 'btn', href: `#/exam/${m.checkpointAfter}` }, 'Take the checkpoint exam') : null,
        again, h('a', { class: 'btn quiet', href: `#/m/${m.id}/learn` }, 'Review the lesson')),
      review(session.items, session.responses, b.tolerance, c));
  };
  draw();
  return h('div', {}, root, notAdvice());
}

// ================================================================== exams
async function renderExam({ course: c, params, setTitle, rerender, query }) {
  const id = params.id;
  const spec = rules.examSpec(c, id);
  const p = await store.progress();
  const s = await store.settings();
  setTitle(spec.title, spec.title);
  const key = `session:exam:${id}`;
  let session = await store.get(key);
  const unlocked = rules.examUnlocked(c, p, id);
  const mods = rules.examModules(c, id);
  const hist = p.exams?.[id];

  if (!session || session.done && query.get('new') === '1') {
    // Intro screen
    const minutes = s.timeMultiplier ? Math.round(spec.minutes * s.timeMultiplier) : null;
    const start = h('button', { class: 'btn primary', type: 'button', disabled: !unlocked }, 'Start the exam', icon('arrow'));
    start.addEventListener('click', async () => {
      const b = await banks();
      const full = await Promise.all(mods.map((x) => content.module(x.id)));
      const seed = Q.newSeed();
      const ex = Q.buildExam({ items: spec.items, numericShare: spec.numericShare }, full, b, seed);
      await store.set(key, { contentVersion: c.contentVersion, id, seed, items: ex.items, responses: {}, flags: {}, i: 0, startedAt: new Date().toISOString(), remainingMs: minutes ? minutes * 60000 : null, untimed: !minutes });
      rerender();
    });
    return h('section', { class: 'qcard' },
      h('p', { class: 'eyebrow' }, id === 'final' ? 'Final exam' : `Checkpoint · ${mods[0].code}–${mods[mods.length - 1].code}`),
      h('h1', {}, spec.title),
      h('ul', {},
        h('li', {}, `${spec.items} questions from ${mods.length === c.modules.length ? 'the whole course' : `modules ${mods[0].code}–${mods[mods.length - 1].code}`} (about ${fmtPct(spec.numericShare)} calculations).`),
        h('li', {}, minutes ? `${minutes} minutes${s.timeMultiplier !== 1 ? ` (your setting: ${s.timeMultiplier}× the standard ${spec.minutes})` : ''}. You can add time when the warning appears.` : 'Untimed (your setting).'),
        h('li', {}, 'Formula sheet and calculator allowed — both are built in.'),
        h('li', {}, `Pass mark ${fmtPct(spec.passMark)}. Answers and explanations are shown at the end.`),
        h('li', {}, 'Your answers are saved as you go, so you can close the app and come back.')),
      h('p', { class: 'small muted' }, h('a', { href: '#/settings?at=exams' }, 'Change the time limit or turn it off'), ' (for example if you need more time, use a screen reader or are on a slow device).'),
      hist?.attempts?.length ? h('p', {}, statusChip(hist.passed ? 'passed' : 'failed'), ` Best ${fmtPct(hist.best)} · ${hist.attempts.length} attempt(s), last ${fmtDate(hist.attempts.at(-1).at)}`) : null,
      unlocked ? null : h('p', { class: 'callout warn' }, icon('lock'), id === 'final' ? ' Unlocks when you pass the M19 knowledge check.' : ` Unlocks when you pass the ${c.checkpoints.find((x) => x.id === id).afterModule.toUpperCase()} knowledge check.`),
      h('div', { class: 'row' }, start, h('a', { class: 'btn quiet', href: '#/exams' }, 'All exams')),
      notAdvice());
  }
  if (session.done) return examResults(c, spec, session, key, rerender);
  return examRunner(c, spec, session, key, rerender);
}

function examRunner(c, spec, session, key, rerender) {
  const root = h('section', { class: 'qcard' });
  const save = () => store.set(key, session);
  const n = session.items.length;
  let tick = null;
  let warned5 = false;
  let warned1 = false;
  const timerEl = h('span', { class: 'timer', role: 'timer', 'aria-live': 'off' });
  const extendBar = h('div', { role: 'alert' });
  const fmtT = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const extend = (mins) => { session.remainingMs += mins * 60000; warned5 = warned1 = false; extendBar.replaceChildren(); save(); announce(`${mins} minutes added.`); };
  const startTimer = () => {
    if (session.untimed) { timerEl.textContent = 'Untimed'; return; }
    let last = performance.now();
    tick = setInterval(() => {
      if (!document.body.contains(root)) { clearInterval(tick); return; }
      const now = performance.now();
      if (!document.hidden) session.remainingMs -= now - last;
      last = now;
      timerEl.textContent = `${fmtT(session.remainingMs)} left`;
      timerEl.classList.toggle('low', session.remainingMs < 5 * 60000);
      if (Math.round(session.remainingMs / 1000) % 10 === 0) save();
      const warn = (mins) => setKids(extendBar, h('div', { class: 'callout warn row' }, h('span', {}, `About ${mins} minute${mins > 1 ? 's' : ''} left.`),
        h('button', { class: 'btn small', type: 'button', onclick: () => extend(15) }, 'Add 15 minutes'), h('button', { class: 'btn small quiet', type: 'button', onclick: () => extendBar.replaceChildren() }, 'Dismiss')));
      if (!warned5 && session.remainingMs < 5 * 60000) { warned5 = true; warn(5); announce('About 5 minutes left. You can add 15 minutes.', true); }
      if (!warned1 && session.remainingMs < 60000) { warned1 = true; warn(1); announce('About 1 minute left. You can add 15 minutes.', true); }
      if (session.remainingMs <= 0) {
        clearInterval(tick);
        // Give at least 20 seconds to extend before submitting (WCAG 2.2.1).
        const grace = h('div', { class: 'callout bad row' }, h('span', {}, 'Time is up. Submitting in 20 seconds unless you add time.'), h('button', { class: 'btn small', type: 'button', onclick: () => { clearTimeout(t20); extend(15); startTimer(); } }, 'Add 15 minutes'));
        setKids(extendBar, grace);
        announce('Time is up. Submitting in 20 seconds unless you add time.', true);
        const t20 = setTimeout(() => submit(true), 20000);
      }
    }, 1000);
  };
  const submit = async (auto = false) => {
    if (!auto) {
      const unanswered = session.items.filter((_, i) => session.responses[i] === undefined || session.responses[i] === '').length;
      const ok = await confirmDialog('Submit your exam?', unanswered ? `${unanswered} ${unanswered === 1 ? 'question is' : 'questions are'} unanswered. You cannot change answers after submitting.` : 'You cannot change answers after submitting.', 'Submit', 'Keep working');
      if (!ok) return;
    }
    clearInterval(tick);
    const b = await banks();
    const s = Q.score(session.items, session.responses, b.tolerance);
    session.done = true;
    session.result = { pct: s.pct, points: s.points, total: s.total, at: new Date().toISOString() };
    await save();
    await store.saveProgress((pp) => {
      pp.exams[session.id] ||= { attempts: [], best: 0, passed: false };
      const e = pp.exams[session.id];
      e.attempts.push({ at: session.result.at, pct: s.pct });
      e.best = Math.max(e.best, s.pct);
      if (s.pct >= spec.passMark) e.passed = true;
    });
    rerender();
  };
  const draw = () => {
    const it = session.items[session.i];
    const nav = h('div', { class: 'qnav', role: 'group', 'aria-label': 'Questions' }, session.items.map((_, i) => {
      const answered = session.responses[i] !== undefined && session.responses[i] !== '';
      const btn = h('button', { type: 'button', class: `${answered ? 'answered' : ''} ${session.flags[i] ? 'flagged' : ''}`, 'aria-current': i === session.i ? 'true' : null, 'aria-label': `Question ${i + 1}${answered ? ', answered' : ''}${session.flags[i] ? ', flagged' : ''}` }, String(i + 1));
      btn.addEventListener('click', () => { session.i = i; save(); draw(); });
      return btn;
    }));
    const flag = h('button', { class: 'btn small quiet', type: 'button', 'aria-pressed': String(!!session.flags[session.i]) }, icon('flag'), session.flags[session.i] ? 'Flagged' : 'Flag for review');
    flag.addEventListener('click', () => { session.flags[session.i] = !session.flags[session.i]; save(); draw(); });
    const prev = h('button', { class: 'btn', type: 'button', disabled: session.i === 0 }, '‹ Previous');
    const next = h('button', { class: 'btn primary', type: 'button' }, session.i === n - 1 ? 'Review & submit' : 'Next ›');
    prev.addEventListener('click', () => { session.i--; save(); draw(); });
    next.addEventListener('click', () => { if (session.i === n - 1) submit(); else { session.i++; save(); draw(); } });
    setKids(root, 
      h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('p', { class: 'eyebrow', style: { margin: 0 } }, `${spec.title} · question ${session.i + 1} of ${n}`), timerEl),
      extendBar,
      h('h1', { class: 'qprompt', tabindex: '-1' }, it.prompt),
      itemInput(it, session.responses[session.i], (v) => { session.responses[session.i] = v; save(); }, false),
      h('div', { class: 'row' }, prev, next, flag),
      h('div', { class: 'row', style: { marginTop: 'var(--s3)' } }, calcButton(), formulaButton(c, session.id), h('button', { class: 'btn small quiet', type: 'button', onclick: () => submit() }, 'Submit now')),
      h('details', { style: { marginTop: 'var(--s3)' } }, h('summary', {}, 'All questions'), nav),
      h('p', { class: 'small muted' }, 'Answers are saved on this device as you go.'));
  };
  draw();
  startTimer();
  return root;
}

function examResults(c, spec, session, key, rerender) {
  const r = session.result;
  const passed = r.pct >= spec.passMark;
  const again = h('button', { class: 'btn', type: 'button' }, 'Take a new version');
  again.addEventListener('click', async () => { await store.set(key, null); rerender(); });
  return h('section', { class: 'qcard' },
    h('p', { class: 'eyebrow' }, `${spec.title} · result`),
    h('h1', {}, passed ? `Passed: ${fmtPct(r.pct)}` : `${fmtPct(r.pct)} — not passed yet`),
    h('p', {}, statusChip(passed ? 'passed' : 'failed'), ` ${r.points} of ${r.total} correct. Pass mark ${fmtPct(spec.passMark)}.`),
    h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/progress' }, 'See my progress'), again),
    review(session.items, session.responses, session.tolerance ?? 0.005, c));
}

// ================================================================== shared item UI
function itemInput(it, resp, onChange, locked) {
  if (it.type === 'numeric') {
    const id = `ans-${Math.random().toString(36).slice(2)}`;
    const inp = h('input', { type: 'text', inputmode: 'decimal', id, value: resp ?? '', autocomplete: 'off', disabled: locked, 'aria-describedby': `${id}-h` });
    inp.addEventListener('input', () => onChange(inp.value));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.closest('section')?.querySelector('.btn.primary')?.click(); });
    const pre = it.unitPrefix ? h('span', { class: 'unit' }, it.unit) : null;
    const post = !it.unitPrefix && it.unit ? h('span', { class: 'unit' }, it.unit) : null;
    queueMicrotask(() => { if (!locked) inp.focus({ preventScroll: true }); });
    return h('div', { class: 'field' }, h('label', { for: id }, 'Your answer'), h('div', { class: 'numeric-input' }, pre, inp, post),
      h('p', { id: `${id}-h`, class: 'small muted' }, `Type a number${it.dp != null ? ` (to ${it.dp} decimal place${it.dp === 1 ? '' : 's'} is enough)` : ''}. Use a minus sign for negative values; commas are fine.`));
  }
  if (it.type === 'match') {
    const sels = it.pairs.map((pr, i) => {
      const s = h('select', { 'aria-label': `Meaning of ${pr.left}`, disabled: locked }, h('option', { value: '' }, 'Choose a meaning…'),
        it.rightOrder.map((ri) => h('option', { value: ri, selected: Array.isArray(resp) && resp[i] === ri }, it.pairs[ri].right)));
      s.addEventListener('change', () => { const cur = Array.isArray(resp) ? [...resp] : []; it.pairs.forEach((_, k) => { cur[k] = cur[k] ?? null; }); cur[i] = s.value === '' ? null : Number(s.value); resp = cur; onChange(cur); });
      return h('div', { class: 'field' }, h('label', {}, h('strong', {}, pr.left)), s);
    });
    return h('div', {}, sels);
  }
  const name = `q-${Math.random().toString(36).slice(2)}`;
  return h('fieldset', { class: 'options' }, h('legend', { class: 'sr-only' }, 'Choose one answer'),
    it.options.map((o, i) => {
      const input = h('input', { type: 'radio', name, value: i, checked: resp === i, disabled: locked });
      input.addEventListener('change', () => onChange(i));
      const label = h('label', { class: 'option' }, input, h('span', {}, o.text));
      if (locked && (o.correct || resp === i)) label.classList.add(o.correct ? 'correct' : 'incorrect');
      if (locked && o.correct) label.append(h('span', { class: 'sr-only' }, ' (correct answer)'));
      if (locked && !o.correct && resp === i) label.append(h('span', { class: 'sr-only' }, ' (your answer)'));
      return label;
    }));
}

function feedback(it, g, c, level = 'h2') {
  const basis = it.basis || (it.example ? { module: it.module, example: it.example } : null);
  const basisLink = basis ? h('a', { href: `#/m/${basis.module}/${basis.example ? 'practise' : 'learn'}${basis.example ? `?at=${basis.example}` : ''}` }, `See ${basis.module.toUpperCase()}${basis.example ? ` · ${basis.example.replace(/^we-/, 'Worked example ').replace(/^case-/, 'Case ').replace(/^ex-/, 'Exercise ')}` : ` · ${basis.section || 'lesson'}`}`) : null;
  return h('div', { class: `feedback ${g.correct ? 'ok' : 'bad'}`, tabindex: '-1', role: 'status' },
    h(level, {}, icon(g.correct ? 'check' : 'x'), g.correct ? 'Correct' : 'Not quite'),
    it.type === 'numeric' ? h('p', {}, `Answer: ${it.unitPrefix ? it.unit : ''}${it.shown}${!it.unitPrefix && it.unit ? (it.unit === '%' ? '%' : ` ${it.unit}`) : ''}${g.correct ? '' : Number.isFinite(g.given) ? ` (you entered ${g.given})` : ''}.`) : null,
    it.type !== 'numeric' && !g.correct && g.expected ? h('p', {}, `Correct answer: ${g.expected}`) : null,
    h('p', {}, it.solution || it.explanation || ''),
    basisLink ? h('p', { class: 'small' }, 'Source: ', basisLink) : null);
}

function review(items, responses, tol, c) {
  return h('section', {}, h('h2', {}, 'Review your answers'),
    h('ol', {}, items.map((it, i) => {
      const g = responses[i] === undefined ? { correct: false } : Q.grade(it, responses[i], tol);
      const yours = it.type === 'numeric' ? (responses[i] ?? '—') : it.type === 'match' ? '' : (it.options[responses[i]]?.text ?? '—');
      return h('li', { style: { marginBottom: 'var(--s3)' } },
        h('p', { style: { margin: 0 } }, h('strong', {}, g.correct ? '✓ ' : '✗ '), it.prompt),
        it.type !== 'match' ? h('p', { class: 'small', style: { margin: 0 } }, `Your answer: ${yours}`) : null,
        feedback(it, g, c, 'h3'));
    })));
}

// ================================================================== tools: calculator & formula sheet
function calcButton() {
  const b = h('button', { class: 'btn small', type: 'button' }, icon('calc'), 'Calculator');
  b.addEventListener('click', async () => { const { openCalculator } = await import('../widgets/calculator.js'); openCalculator(b); });
  return b;
}
function formulaButton(c, examId) {
  const b = h('button', { class: 'btn small', type: 'button' }, icon('sheet'), 'Formula sheet');
  b.addEventListener('click', async () => { const { openFormulaSheet } = await import('../widgets/calculator.js'); openFormulaSheet(b, c, examId); });
  return b;
}
