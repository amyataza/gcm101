// Tools hub (#/tools) — every calculator and simulation in one place, grouped by module.
import { h, icon } from '../ui.js';
import * as content from '../content.js';

export async function render({ course: c, params, setTitle }) {
  const ov = await content.overlay('interactives');
  const items = (ov.items || []).filter((w) => w.type !== 'sequencer' && w.type !== 'classifier');
  const W = await import('../widgets/index.js');
  if (params.id) {
    const w = (ov.items || []).find((x) => x.id === params.id);
    if (!w) throw Object.assign(new Error('Tool not found'), { notFound: true });
    // The precached course index has the module title, so tools work offline without the module file.
    const m = c.modules.find((x) => x.id === w.module);
    setTitle(w.title, w.title);
    return h('section', {},
      h('p', { class: 'eyebrow' }, `${m.code} · ${m.title}`),
      h('h1', {}, w.title),
      W.mountWidget(w, { module: m }),
      h('div', { class: 'row' }, h('a', { class: 'btn', href: `#/m/${w.module}/practise${w.example ? `?at=${w.example}` : ''}` }, 'Open the worked example'), h('a', { class: 'btn quiet', href: '#/tools' }, 'All tools')),
      h('p', { class: 'notice' }, icon('shield'), h('span', {}, 'Learning tools with illustrative numbers. Not investment advice.')));
  }
  setTitle('Tools', 'Tools');
  const byMod = c.modules.map((m) => ({ m, list: items.filter((w) => w.module === m.id) })).filter((x) => x.list.length);
  return h('section', {},
    h('h1', {}, 'Calculators and simulations'),
    h('p', { class: 'lead' }, 'Hands-on tools from the course. Each starts at a syllabus worked example; change the inputs and watch what happens.'),
    h('p', {}, h('button', { class: 'btn small', type: 'button', onclick: async (e) => (await import('../widgets/calculator.js')).openCalculator(e.currentTarget) }, icon('calc'), 'Open the calculator')),
    byMod.map(({ m, list }) => h('section', { class: 'part' },
      h('h2', {}, `${m.code} · ${m.title}`),
      h('ul', { class: 'mlist' }, list.map((w) => h('li', {}, h('a', { class: 'mrow', href: `#/tools/${w.id}` },
        h('span', { class: 'code' }, icon(w.type === 'explorer' ? 'chart' : 'hand')),
        h('span', {}, h('span', { class: 't' }, w.title), h('br'), h('span', { class: 'meta' }, w.example ? `From ${w.example.replace('we-', 'Worked example ')}` : 'Practice tool')),
        icon('arrow'))))))));
}
