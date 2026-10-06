// First-run onboarding: three short, skippable steps. No account, no data collected.
// Step 2 offers ways to start — never labels the learner as a "type".
import { h, icon } from '../ui.js';
import * as store from '../store.js';

export const MODES = [
  { key: 'read', icon: 'book', name: 'Read', desc: 'Clear text, terms explained, printable notes. Always on.' },
  { key: 'see', icon: 'eye', name: 'See', desc: 'Diagrams, charts and step-by-step animations, each with a text description.' },
  { key: 'hear', icon: 'ear', name: 'Hear', desc: 'Lessons read aloud with speed control, plus audio summaries with transcripts.' },
  { key: 'do', icon: 'hand', name: 'Do', desc: 'Sliders, calculators, matching games, simulations, spreadsheet and Python exercises.' },
];

export async function render({ query, setTitle, course: c }) {
  const step = Number(query.get('step') || 1);
  const s = await store.settings();
  setTitle('Welcome', 'Welcome');
  const dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, [1, 2, 3].map((n) => h('span', { 'aria-current': n === step ? 'step' : null })));
  const stepLabel = h('p', { class: 'eyebrow' }, `Step ${step} of 3`);

  if (step === 1) {
    return h('section', { class: 'onboard stack' }, stepLabel,
      h('h1', {}, 'Learn how the world’s capital markets work — from zero'),
      h('p', { class: 'lead' }, `${c.modules.length} modules, ${c.checkpoints.length} checkpoint exams, a final exam and a capstone. About ${c.hours.statedCore} hours, at your own pace.`),
      h('ul', { class: 'prose' },
        h('li', {}, h('strong', {}, 'Free and private. '), 'No account, no ads, no tracking. Your progress is saved only on this device.'),
        h('li', {}, h('strong', {}, 'Works offline. '), 'Download modules once and study without data.'),
        h('li', {}, h('strong', {}, 'Every claim is sourced. '), 'Each lesson shows its references and when it was last reviewed.'),
        h('li', {}, h('strong', {}, 'Educational only. '), 'This course explains how markets work. It is not investment advice and does not recommend any investment.'),
        h('li', {}, h('strong', {}, 'Public beta. '), 'Practice questions and activities are awaiting expert review. ', h('a', { href: '#/about/beta' }, 'What this means'), '.')),
      dots,
      h('div', { class: 'row' },
        h('a', { class: 'btn primary', href: '#/welcome?step=2' }, 'Start', icon('arrow')),
        h('a', { class: 'btn quiet', href: '#/settings?at=data' }, 'I have a progress file to import')));
  }

  if (step === 2) {
    const chosen = { ...s.modes };
    const cards = MODES.map((m) => {
      const isRead = m.key === 'read';
      const b = h('button', { class: 'mode-card', type: 'button', 'aria-pressed': String(isRead || !!chosen[m.key]), 'aria-disabled': isRead ? 'true' : null },
        icon(m.icon), h('strong', {}, m.name), h('span', {}, m.desc));
      b.addEventListener('click', () => {
        if (isRead) return;
        chosen[m.key] = !chosen[m.key];
        b.setAttribute('aria-pressed', String(chosen[m.key]));
      });
      return b;
    });
    return h('section', { class: 'onboard stack' }, stepLabel,
      h('h1', {}, 'How would you like to start?'),
      h('p', { class: 'lead' }, 'Pick any mix. Everyone learns in more than one way, and you can switch at any time from the bar at the top of each lesson.'),
      h('div', { class: 'mode-grid', role: 'group', 'aria-label': 'Ways to learn' }, cards),
      dots,
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', onclick: async () => { await store.saveSettings({ modes: { see: !!chosen.see, hear: !!chosen.hear, do: !!chosen.do } }); location.hash = '#/welcome?step=3'; } }, 'Next', icon('arrow')),
        h('a', { class: 'btn quiet', href: '#/welcome?step=3' }, 'Skip')));
  }

  // Step 3: comfort settings
  const sizeOut = h('output', { id: 'size-out' }, `${Math.round(s.textSize * 100)}%`);
  const size = h('input', { type: 'range', id: 'size', min: '0.85', max: '1.6', step: '0.05', value: String(s.textSize), 'aria-describedby': 'size-help' });
  size.addEventListener('input', async () => { sizeOut.textContent = `${Math.round(size.value * 100)}%`; await store.saveSettings({ textSize: Number(size.value) }); });
  const themes = [['system', 'Match my device'], ['light', 'Light'], ['dark', 'Dark'], ['contrast', 'High contrast']];
  const themeGroup = h('div', { class: 'toggles', role: 'radiogroup', 'aria-label': 'Colour theme' }, themes.map(([v, label]) => {
    const b = h('button', { class: 'toggle', type: 'button', role: 'radio', 'aria-checked': String(s.theme === v) }, label);
    b.addEventListener('click', async () => {
      await store.saveSettings({ theme: v });
      b.parentElement.querySelectorAll('[role=radio]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    });
    return b;
  }));
  return h('section', { class: 'onboard stack' }, stepLabel,
    h('h1', {}, 'Make it comfortable'),
    h('div', { class: 'field' }, h('label', { for: 'size' }, 'Text size', sizeOut), size, h('p', { id: 'size-help', class: 'muted small' }, 'Drag to make all text bigger or smaller.')),
    h('fieldset', { class: 'field', style: { border: 0, padding: 0 } }, h('legend', { style: { fontWeight: 600, marginBottom: 'var(--s2)' } }, 'Colours'), themeGroup),
    h('p', { class: 'muted small' }, 'You can change these, the voice and the exam timer later in Settings.'),
    dots,
    h('div', { class: 'row' },
      h('button', { class: 'btn primary', onclick: async () => { await store.saveSettings({ onboarded: true }); location.hash = '#/m/m0'; } }, 'Go to Module 0', icon('arrow')),
      h('button', { class: 'btn quiet', onclick: async () => { await store.saveSettings({ onboarded: true }); location.hash = '#/'; } }, 'See the course map first')));
}
