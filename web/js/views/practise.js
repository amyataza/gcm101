// Practise page (#/m/:id/practise): worked examples, cases and exercises from the syllabus with the
// three calculation tracks, plus See (step-through), Do (linked tools) and Hear (read-aloud) layers.
// Text renders first; widgets, audio, tooltips and the sources panel are attached afterwards.
import { h, icon, fmtHours, addKids } from '../ui.js';
import * as content from '../content.js';
import * as store from '../store.js';
import * as rules from '../course.js';
import { applyModes, moduleHeader, modeBar, trackBar, sourcesPanel, linkTerms, notAdvice, trackResume } from './shared.js';
import { hearPanel } from './learn.js';

export async function render({ course: c, progress: p, params, settings: s, setTitle }) {
  const m = await content.module(params.id);
  const status = rules.moduleStatus(c, p, m.id);
  setTitle(`Practise: ${m.code}`, `${m.code} · Practise`);
  trackResume(m, `#/m/${m.id}/practise`, 'Practise: worked examples');
  const errata = await content.overlay('errata'); // tiny and precached; verification notes belong with the text

  const root = h('article', { class: 'lesson' });
  const list = h('div', { class: 'prose', style: { maxWidth: 'none' } });
  const kindLabel = { 'Worked example': 'Worked example', Case: 'Case', Exercise: 'Exercise', 'Track C': 'Python' };
  const toc = h('nav', { 'aria-label': 'Examples in this module', class: 'card flat small' }, h('strong', {}, 'In this module'),
    h('ol', { style: { margin: 'var(--s2) 0 0', paddingLeft: '1.2em' } }, m.examples.map((ex) => h('li', {}, h('a', { href: `#/m/${m.id}/practise?at=${ex.id}` }, `${ex.num ? `${ex.num} ` : ''}${ex.title}`)))));

  const slots = []; // [example, slot element] filled once the widget library has loaded
  for (const ex of m.examples) {
    const art = h('article', { class: 'example', id: ex.id, 'aria-labelledby': `${ex.id}-h` });
    const badges = [h('span', { class: `chip ${ex.kind === 'Case' ? 'brand' : ''}` }, kindLabel[ex.kind] || ex.kind)];
    if (ex.flags.includes('illustrative')) badges.push(h('span', { class: 'chip' }, 'Illustrative numbers'));
    const primary = (ex.historical || []).filter((hc) => hc.primarySource);
    for (const hc of ex.historical || []) if (!hc.primarySource) badges.push(h('span', { class: 'chip warn', title: 'The syllabus requires one primary source per historical case before publication.' }, icon('warn'), `Primary source pending: ${hc.name}`));
    ex.refs.forEach((r) => badges.push(h('a', { class: 'ref', href: `#/sources/${r}` }, r)));
    addKids(art, h('header', {}, h('h2', { id: `${ex.id}-h`, 'data-read': `${ex.kind} ${ex.num || ''}. ${ex.title}` }, `${ex.kind === 'Track C' ? '' : `${ex.kind} ${ex.num} — `}${ex.title}`), ...badges));
    for (const seg of ex.segments) {
      addKids(art, h('div', { class: `seg ${seg.type}`, 'data-track': seg.track || null, 'data-read': '' },
        seg.label ? h('p', { class: 'seg-label' }, seg.type === 'track' ? trackIcon(seg.track) : null, seg.label) : null,
        h('div', { html: seg.html })));
    }
    if (primary.length) addKids(art, h('p', { class: 'small primary-source' }, h('strong', {}, icon('sources'), primary.length > 1 ? ' Primary sources: ' : ' Primary source: '),
      primary.map((hc, k) => [k ? '; ' : '', h('a', { href: hc.primarySource.url, target: '_blank', rel: 'noopener' }, hc.primarySource.title), ` — ${hc.primarySource.publisher}`])));
    for (const e of (errata.errata || []).filter((x) => x.module === m.id && x.example === ex.id && x.status === 'open')) {
      addKids(art, h('p', { class: 'erratum', role: 'note' }, h('strong', {}, icon('warn'), ` Verification note: the syllabus shows ${e.shown}; recomputing gives ${e.correct} (exact ${e.exact}). `), e.note));
    }
    const slot = h('div');
    addKids(art, slot);
    slots.push([ex, slot]);
    addKids(list, art);
  }

  const st = p.modules[m.id] || {};
  const markDone = async () => { await store.saveProgress((pp) => { store.moduleState(pp, m.id).practise = { done: true, at: new Date().toISOString() }; }); };
  const hearSlot = h('div');
  const sheetSlot = h('div');
  const srcSlot = h('div');
  addKids(root,
    moduleHeader(c, m, status, 'Practise'),
    modeBar(root, s),
    trackBar(root, s),
    h('p', { class: 'small muted' }, 'Track A by hand and Track B in a spreadsheet are part of the course; Track C (Python) is optional.'),
    hearSlot, sheetSlot, toc, list,
    h('div', { class: 'next-bar' }, h('a', { class: 'btn primary', href: `#/m/${m.id}/check`, onclick: markDone }, st.practise?.done ? 'Next: Check' : 'Done — next: Check', icon('arrow'))),
    h('p', { class: 'muted small' }, `Suggested time for this step: about ${fmtHours(m.hours.practise)}.`),
    notAdvice(),
    srcSlot);
  applyModes(root, s.modes);

  (async () => {
    const [interactives, visuals, W] = await Promise.all([content.overlay('interactives'), content.overlay('visuals'), import('../widgets/index.js')]);
    for (const [ex, slot] of slots) {
      const kids = [];
      // See: animated step-through for Track A steps, then visuals attached to this example
      if (ex.segments.some((sg) => sg.track === 'A' && /<ol>/.test(sg.html))) kids.push(h('div', { 'data-mode': 'see' }, W.stepper(ex)));
      for (const v of (visuals.items || []).filter((x) => x.module === m.id && x.example === ex.id)) kids.push(h('div', { 'data-mode': 'see' }, W.mountVisual(v)));
      // Do: interactive tools linked to this example
      for (const w of (interactives.items || []).filter((x) => x.module === m.id && x.example === ex.id)) kids.push(h('div', { 'data-mode': 'do' }, W.mountWidget(w, { module: m })));
      // Track C runner
      ex.code.forEach((code, i) => kids.push(h('div', { class: 'seg track', 'data-track': 'C' }, W.pythonRunner(code, { id: `${ex.id}-py${i}`, module: m }))));
      slot.replaceWith(...kids);
    }
    sheetSlot.replaceWith(h('div', { 'data-mode': 'do' }, W.sheetPack(m)));
    hearSlot.replaceWith(await hearPanel(root, m));
    applyModes(root, (await store.settings()).modes);
    srcSlot.replaceWith(await sourcesPanel(c, m));
    await linkTerms(list, m.id, { skip: '.no-terms, code, pre, h1, h2, h3, h4, a, button, .widget, label, th, .seg-label, .chip' });
    // Re-apply a deep link once examples have grown with their widgets.
    const at = new URLSearchParams(location.hash.split('?')[1] || '').get('at');
    if (at) document.getElementById(at)?.scrollIntoView({ block: 'start' });
  })().catch((e) => console.warn('Practice enhancements failed', e));
  return root;
}

function trackIcon(t) {
  return icon({ A: 'calc', B: 'sheet', C: 'code' }[t]);
}
