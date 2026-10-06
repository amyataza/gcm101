import { h, icon, setKids } from '../ui.js';
import * as content from '../content.js';
import { speechSupported, pickVoice, speakable } from '../tts.js';
import * as store from '../store.js';

export async function render({ query, setTitle }) {
  setTitle('Glossary', 'Glossary');
  const g = await content.glossary();
  const q0 = query.get('q') || '';
  const input = h('input', { type: 'search', id: 'gq', value: q0, placeholder: 'Search terms and meanings', autocomplete: 'off', 'aria-describedby': 'gcount' });
  const count = h('p', { id: 'gcount', class: 'small muted', role: 'status', 'aria-live': 'polite' });
  const listEl = h('div', { class: 'gloss' });
  const letters = [...new Set(g.terms.map((t) => t.term[0].toUpperCase()))].sort();
  const say = async (text) => {
    if (!speechSupported()) return;
    const v = await pickVoice();
    if (!v) return;
    const s = await store.settings();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakable(text));
    u.voice = v; u.lang = v.lang; u.rate = s.rate || 1;
    speechSynthesis.speak(u);
  };
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    const hits = g.terms.filter((t) => !q || t.term.toLowerCase().includes(q) || t.defs.some((d) => d.meaning.toLowerCase().includes(q)));
    count.textContent = `${hits.length} term${hits.length === 1 ? '' : 's'}${q ? ` matching “${input.value.trim()}”` : ''}`;
    let lastLetter = '';
    setKids(listEl, ...hits.map((t) => {
      const L = t.term[0].toUpperCase();
      const anchor = !q && L !== lastLetter ? (lastLetter = L) : null;
      return h('article', { id: anchor ? `letter-${L}` : null },
        h('h2', {}, t.term, speechSupported() ? h('button', { class: 'btn small quiet', type: 'button', 'aria-label': `Hear: ${t.term}`, onclick: () => say(`${t.term}. ${t.defs[0].meaning}`) }, icon('ear')) : null),
        t.defs.map((d) => h('p', {}, h('a', { class: 'chip brand', href: `#/m/${d.module}/learn?at=terms` }, d.module.toUpperCase()), ' ', h('span', { html: d.html }))));
    }));
  };
  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 120); });
  draw();
  return h('section', {},
    h('h1', {}, 'Glossary'),
    h('p', { class: 'lead' }, `${g.terms.length} terms from the key-term tables of all ${new Set(g.terms.flatMap((x) => x.defs.map((d) => d.module))).size} modules, in plain English. Where a term is defined in more than one module, each meaning is shown.`),
    h('div', { class: 'field' }, h('label', { for: 'gq' }, 'Search'), input), count,
    h('nav', { class: 'letters', 'aria-label': 'Jump to letter' }, letters.map((L) => h('a', { href: `#/glossary?at=letter-${L}` }, L))),
    listEl);
}
