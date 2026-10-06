// Shared lesson building blocks: mode bar, track filter, sources & review panel, glossary tooltips,
// module header and the offline-download button.
import { h, icon, fmtDate, fmtHours, statusChip, toast, announce, setKids, addKids } from '../ui.js';
import * as store from '../store.js';
import * as content from '../content.js';
import { MODES } from './onboarding.js';

// ------------------------------------------------------------------ learning modes
export function applyModes(root, modes) {
  root.querySelectorAll('[data-mode]').forEach((el) => el.classList.toggle('mode-on', !!modes[el.dataset.mode]));
}
export function modeBar(root, settings, { onChange } = {}) {
  const modes = { ...settings.modes };
  const bar = h('div', { class: 'modebar', role: 'group', 'aria-label': 'Ways to learn this lesson' });
  const row = h('div', { class: 'toggles' }, h('span', { class: 'label' }, 'Learn by:'));
  for (const m of MODES) {
    const isRead = m.key === 'read';
    const b = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(isRead || !!modes[m.key]), 'aria-disabled': isRead ? 'true' : null, title: m.desc },
      icon(m.icon), m.name, h('span', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
    if (isRead) addKids(b, h('span', { class: 'sr-only' }, ' (always on)'));
    b.addEventListener('click', async () => {
      if (isRead) { announce('Reading is always on, so every lesson works with text alone.'); return; }
      modes[m.key] = !modes[m.key];
      b.setAttribute('aria-pressed', String(modes[m.key]));
      applyModes(root, modes);
      await store.saveSettings({ modes });
      announce(`${m.name} ${modes[m.key] ? 'on' : 'off'}`);
      onChange?.(modes);
    });
    addKids(row, b);
  }
  addKids(bar, row);
  return bar;
}

export function trackBar(root, settings) {
  const tracks = { ...settings.tracks };
  const labels = { A: 'A · By hand', B: 'B · Spreadsheet', C: 'C · Python (optional)' };
  const apply = () => ['A', 'B', 'C'].forEach((t) => root.classList.toggle(`tracks-off-${t}`, !tracks[t]));
  apply();
  return h('div', { class: 'toggles', role: 'group', 'aria-label': 'Calculation tracks to show', style: { margin: 'var(--s2) 0 var(--s3)' } },
    h('span', { class: 'label small muted' }, 'Show tracks:'),
    ...['A', 'B', 'C'].map((t) => {
      const b = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(!!tracks[t]) }, labels[t], h('span', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
      b.addEventListener('click', async () => {
        tracks[t] = !tracks[t];
        b.setAttribute('aria-pressed', String(tracks[t]));
        apply();
        await store.saveSettings({ tracks });
      });
      return b;
    }));
}

// ------------------------------------------------------------------ header & disclaimers
export function moduleHeader(c, m, status, sub) {
  const part = c.parts.find((x) => x.n === m.part);
  return h('header', {},
    h('p', { class: 'eyebrow' }, `${m.code} · Part ${m.part}: ${part?.title || part?.short || ''}`),
    h('h1', {}, sub ? `${sub}: ${m.title}` : m.title),
    h('div', { class: 'row' }, statusChip(status), h('span', { class: 'chip' }, icon('clock'), `${fmtHours(m.hours.core)} core`),
      m.hours.python ? h('span', { class: 'chip' }, icon('code'), `+${fmtHours(m.hours.python)} Python`) : null));
}
export const notAdvice = () => h('p', { class: 'notice' }, icon('shield'),
  h('span', {}, h('strong', {}, 'Educational only. '), 'Worked examples use round, illustrative numbers unless a source is cited; they are not market forecasts or investment advice.'));

// ------------------------------------------------------------------ sources & review (trust panel)
export async function sourcesPanel(c, m) {
  const [errata, sources] = await Promise.all([content.overlay('errata'), content.overlay('sources')]);
  const refs = m.refs.filter((r) => r[0] !== 'D');
  const decs = m.refs.filter((r) => r[0] === 'D');
  const claims = c.claims.filter((cl) => cl.refs.some((r) => refs.includes(r)));
  const myErrata = (errata.errata || []).filter((e) => e.module === m.id && e.status === 'open');
  const pending = m.examples.filter((e) => e.historical?.some((x) => !x.primarySource));
  const list = h('ul', { class: 'small' }, refs.map((code) => {
    const r = c.references.find((x) => x.id === code);
    return h('li', { id: `ref-${code}` }, h('a', { class: 'ref', href: `#/sources/${code}` }, code), ' ', h('span', { html: r ? r.html : 'Reference not found' }));
  }));
  return h('section', { class: 'sources-panel', 'aria-labelledby': `src-${m.id}` },
    h('h2', { id: `src-${m.id}` }, icon('sources'), ' Sources and review'),
    h('dl', {},
      h('dt', {}, 'Source of truth'), h('dd', {}, `${c.syllabus.code} syllabus v${c.syllabus.version} (${c.syllabus.status}), lines ${m.lines[0]}–${m.lines[1]}`),
      h('dt', {}, 'Last reviewed'), h('dd', {}, fmtDate(c.syllabus.date)),
      h('dt', {}, 'Content version'), h('dd', {}, h('code', {}, c.contentVersion)),
      h('dt', {}, 'Benchmark trace'), h('dd', { html: m.traceHtml })),
    refs.length ? [h('h3', {}, 'References cited in this module'), list] : null,
    decs.length ? h('p', { class: 'small' }, 'Design decisions: ', decs.map((d) => [h('a', { class: 'ref', href: `#/sources/${d}` }, d), ' '])) : null,
    claims.length ? [h('h3', {}, 'Claims with a review schedule'), h('ul', { class: 'small' }, claims.map((cl) => h('li', {}, `${cl.claim} — review: ${cl.review}`)))] : null,
    pending.length ? h('p', { class: 'callout warn small' }, h('strong', {}, 'Primary source pending. '),
      `The syllabus states ${pending.length === 1 ? 'one historical case' : `${pending.length} historical cases`} here at a general level (${pending.map((e) => e.title).join('; ')}). A primary source (regulator, central-bank or court document) is still to be attached, as the syllabus requires before publication.`) : null,
    myErrata.length ? h('p', { class: 'callout warn small' }, h('strong', {}, 'Verification note. '), myErrata.map((e) => e.note).join(' ')) : null,
    h('p', { class: 'small muted' }, 'Diagrams and interactive tools are original and were drafted with AI assistance from the syllabus; their numbers come from tested code. Read-aloud uses a synthetic voice. ',
      h('a', { href: '#/about/ai' }, 'How AI was used'), ' · ', h('a', { href: `#/about/report?from=${encodeURIComponent(location.hash.slice(1).split('?')[0])}` }, 'Report a problem with this page')));
}

// ------------------------------------------------------------------ glossary tooltips at first use
let glossIndex = null;
async function buildIndex() {
  if (glossIndex) return glossIndex;
  const g = await content.glossary();
  const byAlias = new Map();
  for (const t of g.terms) for (const a of t.aliases) if (!byAlias.has(a.toLowerCase())) byAlias.set(a.toLowerCase(), t);
  const aliases = [...byAlias.keys()].sort((a, b) => b.length - a.length).map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Acronyms (all caps) match case-sensitively; words match case-insensitively at word boundaries.
  // No lookbehind: older iOS Safari cannot parse it. Group 1 is the preceding character.
  const re = new RegExp(`(^|[^\\w-])(${aliases.join('|')})(?![\\w-])`, 'gi');
  glossIndex = { byAlias, re };
  return glossIndex;
}
export async function linkTerms(root, moduleId, { skip = '.no-terms, code, pre, h1, h2, h3, h4, a, button, .term-card, .widget, label, th' } = {}) {
  skip += ', svg, figure, select, option, textarea'; // never inside charts or form controls
  const { byAlias, re } = await buildIndex();
  const seen = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest(skip) || !n.nodeValue.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue;
    re.lastIndex = 0;
    let m;
    let last = 0;
    const parts = [];
    while ((m = re.exec(text))) {
      const word = m[2];
      const start = m.index + m[1].length;
      const entry = byAlias.get(word.toLowerCase());
      if (!entry || seen.has(entry.term)) continue;
      const isAcronym = /^[A-Z0-9]{2,}$/.test(entry.aliases.find((a) => a.toLowerCase() === word.toLowerCase()) || '');
      if (isAcronym && word !== word.toUpperCase()) continue;
      seen.add(entry.term);
      parts.push(text.slice(last, start));
      parts.push(termButton(word, entry, moduleId));
      last = start + word.length;
    }
    if (parts.length) {
      parts.push(text.slice(last));
      node.replaceWith(...parts.map((p) => (typeof p === 'string' ? document.createTextNode(p) : p)));
    }
  }
}
function termButton(word, entry, moduleId) {
  const def = entry.defs.find((d) => d.module === moduleId) || entry.defs[0];
  const b = h('button', { class: 'term', type: 'button', 'aria-expanded': 'false', 'aria-label': `${word}: show meaning` }, word);
  b.addEventListener('click', (e) => { e.stopPropagation(); showPopover(b, entry.term, def); });
  return b;
}
let openPop = null;
function closePop() {
  if (!openPop) return;
  openPop.btn.setAttribute('aria-expanded', 'false');
  openPop.el.remove();
  openPop.btn.focus();
  openPop = null;
}
function showPopover(btn, term, def) {
  if (openPop?.btn === btn) { closePop(); return; }
  if (openPop) closePop();
  const id = `pop-${Math.random().toString(36).slice(2)}`;
  const el = h('div', { class: 'popover', role: 'dialog', 'aria-label': term, id },
    h('strong', {}, term), h('span', { html: def.html }),
    h('div', { class: 'small muted', style: { marginTop: 'var(--s2)' } }, `First defined in ${def.module.toUpperCase()} · `, h('a', { href: `#/glossary?q=${encodeURIComponent(term)}` }, 'Glossary')),
    h('button', { class: 'btn small quiet', style: { marginTop: 'var(--s2)' }, onclick: closePop }, 'Close'));
  addKids(document.body, el);
  const r = btn.getBoundingClientRect();
  const top = r.bottom + window.scrollY + 6;
  const left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 8));
  Object.assign(el.style, { top: `${top}px`, left: `${left}px` });
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-controls', id);
  openPop = { btn, el };
  el.querySelector('button').focus();
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePop(); });
document.addEventListener('click', (e) => { if (openPop && !openPop.el.contains(e.target)) { openPop.btn.setAttribute('aria-expanded', 'false'); openPop.el.remove(); openPop = null; } });
addEventListener('hashchange', () => { if (openPop) { openPop.el.remove(); openPop = null; } });

// ------------------------------------------------------------------ offline download per module
export async function downloadButton(m) {
  const cacheName = 'gcm101-content';
  const urls = await content.moduleUrls(m.id);
  const hasCache = 'caches' in window;
  const isSaved = async () => hasCache && (await Promise.all(urls.map((u) => caches.match(u)))).every(Boolean);
  const b = h('button', { class: 'btn small', type: 'button' });
  const set = (saved) => setKids(b, icon(saved ? 'check' : 'download'), saved ? 'Saved for offline' : 'Download for offline');
  set(await isSaved());
  if (!hasCache) { b.disabled = true; b.title = 'Offline saving is not supported in this browser.'; return b; }
  b.addEventListener('click', async () => {
    try {
      b.disabled = true;
      setKids(b, 'Downloading…');
      const cache = await caches.open(cacheName);
      await cache.addAll(urls);
      set(true);
      toast(`${m.code} is saved for offline use.`);
    } catch {
      set(false);
      toast('Download failed. Check your connection and try again.');
    } finally {
      b.disabled = false;
    }
  });
  return b;
}

// Remember where the learner is, for "Continue where you left off".
export function trackResume(m, route, label) {
  store.saveProgress((p) => { p.resume = { module: m.id, route, label, at: new Date().toISOString() }; });
}
