// Learn page (#/m/:id/learn). Text is the baseline and always present; See, Hear and Do blocks are
// additive and controlled by the mode bar.
import { h, icon, fmtHours, fmtHoursLong, toast, setKids, addKids } from '../ui.js';
import * as content from '../content.js';
import * as store from '../store.js';
import * as rules from '../course.js';
import { Narrator, speechSupported } from '../tts.js';
import { applyModes, moduleHeader, modeBar, sourcesPanel, linkTerms, notAdvice, trackResume } from './shared.js';

export async function render({ course: c, progress: p, params, query, settings: s, setTitle }) {
  const m = await content.module(params.id);
  const status = rules.moduleStatus(c, p, m.id);
  setTitle(`Learn: ${m.code}`, `${m.code} · Learn`);
  trackResume(m, `#/m/${m.id}/learn`, 'Learn: key ideas and terms');
  const part = c.parts.find((x) => x.n === m.part);
  const isFirstOfPart = part?.modules[0] === m.id;

  const root = h('article', { class: 'lesson' });
  const body = h('div', { class: 'prose' });

  const section = (id, title, ...kids) => h('section', { class: 'section', id, 'aria-labelledby': `${id}-h` }, h('h2', { id: `${id}-h`, 'data-read': title }, title), ...kids);
  const subList = (items) => h('ul', {}, items.map((s0) => h('li', {}, h('span', { html: s0.html }), s0.children.length ? subList(s0.children) : null)));

  // Progressive rendering: the text lesson appears at once; Hear, See, Do, glossary tooltips and the
  // sources panel are attached afterwards, so slow connections show readable text first.
  const hearSlot = h('div');
  const seeSlot = h('div');
  const doSlot = h('div');
  const srcSlot = h('div');

  addKids(body, ...[
    isFirstOfPart && part.introHtml ? h('aside', { class: 'callout' }, h('p', { class: 'callout-title' }, `About Part ${part.n}`), h('div', { html: part.introHtml, 'data-read': '' })) : null,
    section('why', 'Why it matters', h('p', { html: m.whyHtml, 'data-read': '' })),
    section('objectives', 'What you will be able to do', h('ol', { class: 'objectives' }, m.objectives.map((o) => h('li', { 'data-read': `${o.level}. ${o.text}` }, h('span', { class: 'level' }, o.level), h('span', { html: o.html }))))),
    section('topics', 'What this module covers', h('div', { 'data-read': '' }, subList(m.subtopics))),
  ].filter(Boolean));
  const terms = section('terms', 'Key terms',
    h('p', { class: 'muted small' }, 'Underlined words in lessons open these meanings. All terms are also in the Glossary.'),
    h('dl', { class: 'terms' }, m.terms.map((t) => h('div', { class: 'term-card', 'data-read': `${t.term}. ${t.meaning}` }, h('dt', {}, t.term), h('dd', { html: t.meaningHtml })))));
  const formulas = m.formulas ? section('formulas', 'Core formulas', h('pre', { class: 'code', tabindex: '0', 'aria-label': 'Core formulas', 'data-read': m.formulas }, h('code', {}, m.formulas)),
    h('p', { class: 'small muted' }, 'You will use these in Practise. The same formulas appear on the exam formula sheet.')) : null;

  const st = p.modules[m.id] || {};
  const markDone = async () => { await store.saveProgress((pp) => { store.moduleState(pp, m.id).learn = { done: true, at: new Date().toISOString() }; }); };
  addKids(root, ...[
    moduleHeader(c, m, status, 'Learn'),
    modeBar(root, s),
    hearSlot,
    body,
    seeSlot,
    terms,
    formulas,
    doSlot,
    h('div', { class: 'next-bar' },
      h('button', { class: 'btn quiet hide-sm', onclick: () => window.print() }, icon('print'), 'Print notes'),
      h('a', { class: 'btn primary', href: `#/m/${m.id}/practise`, onclick: markDone }, st.learn?.done ? 'Next: Practise' : 'Done — next: Practise', icon('arrow'))),
    h('p', { class: 'muted small' }, `Suggested time for this step: about ${fmtHoursLong(m.hours.learn)}. Take breaks; your place is saved.`),
    notAdvice(),
    srcSlot].filter(Boolean));
  applyModes(root, s.modes);

  (async () => {
    const [visuals, interactives, W] = await Promise.all([content.overlay('visuals'), content.overlay('interactives'), import('../widgets/index.js')]);
    hearSlot.replaceWith(await hearPanel(root, m));
    const vis = (visuals.items || []).filter((v) => v.module === m.id && (v.place || 'learn') === 'learn');
    if (vis.length) seeSlot.replaceWith(h('div', { 'data-mode': 'see' }, h('h2', {}, icon('eye'), ' See it'), ...vis.map((v) => W.mountVisual(v))));
    const doWidgets = (interactives.items || []).filter((w) => w.module === m.id && w.place === 'learn');
    doSlot.replaceWith(h('div', { 'data-mode': 'do' }, h('h2', {}, icon('hand'), ' Try it'),
      W.mountWidget({ type: 'matching', module: m.id, title: 'Match the key terms', count: Math.min(6, m.terms.length) }, { module: m }),
      ...doWidgets.map((w) => W.mountWidget(w, { module: m }))));
    applyModes(root, (await store.settings()).modes);
    srcSlot.replaceWith(await sourcesPanel(c, m));
    await linkTerms(body, m.id);
    if (query.get('print') === '1') setTimeout(() => window.print(), 400);
  })().catch((e) => console.warn('Lesson enhancements failed', e));
  return root;
}

// Hear panel shared with Practise: read-aloud of the page and the module audio summary.
export async function hearPanel(root, m) {
  const audio = await content.overlay('audio');
  const file = audio.files?.[m.id];
  const wrap = h('section', { 'data-mode': 'hear', class: 'card flat', 'aria-labelledby': `hear-${m.id}` },
    h('h2', { id: `hear-${m.id}`, style: { marginTop: 0 } }, icon('ear'), ' Hear it'));
  // 1. Read aloud this page
  if (speechSupported()) {
    const now = h('span', { class: 'now', 'aria-live': 'polite' }, 'Read this page aloud with your device’s voice.');
    const playBtn = h('button', { class: 'btn small primary', type: 'button' }, icon('play'), 'Play');
    const prevBtn = h('button', { class: 'btn small', type: 'button', 'aria-label': 'Previous paragraph' }, '‹');
    const nextBtn = h('button', { class: 'btn small', type: 'button', 'aria-label': 'Next paragraph' }, '›');
    const stopBtn = h('button', { class: 'btn small', type: 'button' }, icon('stop'), 'Stop');
    const narr = new Narrator(root, {
      onState: (state, el, i, n) => {
        if (state === 'playing') { setKids(playBtn, icon('pause'), 'Pause'); now.textContent = `Reading ${i + 1} of ${n}`; }
        else if (state === 'paused') { setKids(playBtn, icon('play'), 'Resume'); now.textContent = `Paused at ${i + 1} of ${n}`; }
        else if (state === 'novoice') now.textContent = 'No on-device voice found. Install one in your phone’s text-to-speech settings, or allow online voices in Settings.';
        else { setKids(playBtn, icon('play'), 'Play'); now.textContent = state === 'finished' ? 'Finished.' : 'Stopped.'; }
      },
    });
    playBtn.addEventListener('click', () => (narr.state === 'playing' ? narr.pause() : narr.state === 'paused' ? narr.resume() : narr.play()));
    prevBtn.addEventListener('click', () => narr.prev());
    nextBtn.addEventListener('click', () => narr.next());
    stopBtn.addEventListener('click', () => narr.stop());
    const s = await store.settings();
    const rate = h('select', { 'aria-label': 'Reading speed' }, [0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2].map((r) => h('option', { value: r, selected: Number(s.rate) === r }, `${r}×`)));
    rate.addEventListener('change', async () => { await store.saveSettings({ rate: Number(rate.value) }); if (narr.state === 'playing') narr.play(narr.i); });
    addKids(wrap, h('div', { class: 'audiobar', role: 'group', 'aria-label': 'Read-aloud controls' }, playBtn, prevBtn, nextBtn, stopBtn, rate, now),
      h('p', { class: 'small muted' }, h('strong', {}, 'Synthetic voice. '), 'Read-aloud uses your device’s text-to-speech. The text stays on your device unless you allow online voices in Settings.'));
  } else {
    addKids(wrap, h('p', { class: 'small muted' }, 'This browser cannot read pages aloud. The audio summary below still works.'));
  }
  // 2. Audio summary (downloadable) + transcript
  if (file) {
    const src = `content/audio/${file.file}`;
    addKids(wrap, h('h3', {}, 'Audio summary'),
      h('audio', { controls: true, preload: 'none', src }),
      h('p', { class: 'small' }, `About ${Math.round(file.seconds / 60)} min · ${(file.bytes / 1e6).toFixed(1)} MB · `,
        h('a', { href: src, download: `GCM101-${m.code}-summary.m4a` }, icon('download'), ' Download'), ' · ',
        h('strong', {}, 'AI-generated voice'), ` (${audio.engine?.name || 'text-to-speech'}). Read from the syllabus text below.`));
  }
  addKids(wrap, h('details', { class: 'textalt' }, h('summary', {}, 'Transcript of the audio summary'), h('div', { class: 'prose small', style: { whiteSpace: 'pre-line' } }, m.audioSummary)));
  return wrap;
}
