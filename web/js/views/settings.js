import { h, icon, toast, confirmDialog, setKids, addKids } from '../ui.js';
import * as store from '../store.js';
import * as content from '../content.js';
import { voices, speechSupported } from '../tts.js';
import { MODES } from './onboarding.js';

export async function render({ course: c, setTitle, rerender }) {
  setTitle('Settings', 'Settings');
  const s = await store.settings();
  const save = (patch, msg) => store.saveSettings(patch).then(() => msg && toast(msg));

  const radio = (label, key, opts) => h('fieldset', { class: 'field', style: { border: 0, padding: 0 } },
    h('legend', { style: { fontWeight: 600, marginBottom: 'var(--s2)' } }, label),
    h('div', { class: 'toggles', role: 'radiogroup', 'aria-label': label }, opts.map(([v, t]) => {
      const b = h('button', { class: 'toggle', type: 'button', role: 'radio', 'aria-checked': String(String(s[key]) === String(v)) }, t);
      b.addEventListener('click', async () => {
        await save({ [key]: v });
        b.parentElement.querySelectorAll('[role=radio]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      });
      return b;
    })));
  const checkbox = (label, checked, onChange, help) => {
    const id = `cb-${Math.random().toString(36).slice(2)}`;
    const cb = h('input', { type: 'checkbox', id, checked, style: { width: '22px', height: '22px' } });
    cb.addEventListener('change', () => onChange(cb.checked));
    return h('div', { class: 'field' }, h('label', { for: id, class: 'row', style: { justifyContent: 'flex-start' } }, cb, label), help ? h('p', { class: 'small muted', style: { margin: 0 } }, help) : null);
  };

  // Text size
  const sizeOut = h('output', {}, `${Math.round(s.textSize * 100)}%`);
  const size = h('input', { type: 'range', id: 'set-size', min: '0.85', max: '1.6', step: '0.05', value: String(s.textSize) });
  size.addEventListener('input', () => { sizeOut.textContent = `${Math.round(size.value * 100)}%`; save({ textSize: Number(size.value) }); });

  // Voices
  let voiceBlock = h('p', { class: 'small muted' }, 'This browser has no built-in text-to-speech. Audio summaries still work.');
  if (speechSupported()) {
    const vs = await voices();
    const sel = h('select', { id: 'set-voice' }, h('option', { value: '' }, 'Automatic (an English on-device voice)'),
      vs.filter((v) => v.localService || s.allowOnlineVoices).map((v) => h('option', { value: v.voiceURI, selected: v.voiceURI === s.voice }, `${v.name} (${v.lang})${v.localService ? '' : ' — online'}`)));
    sel.addEventListener('change', () => save({ voice: sel.value }, 'Voice saved.'));
    const rate = h('select', { id: 'set-rate' }, [0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2].map((r) => h('option', { value: r, selected: Number(s.rate) === r }, `${r}×`)));
    rate.addEventListener('change', () => save({ rate: Number(rate.value) }));
    voiceBlock = h('div', {},
      h('div', { class: 'field' }, h('label', { for: 'set-voice' }, 'Voice'), sel),
      h('div', { class: 'field' }, h('label', { for: 'set-rate' }, 'Reading speed'), rate),
      checkbox('Allow online voices', s.allowOnlineVoices, async (v) => { await save({ allowOnlineVoices: v }); rerender(); },
        'Online voices can sound better but send the text being read to the voice provider (for example Google, Apple or Microsoft). Off by default for privacy.'),
      h('p', { class: 'small muted' }, `${vs.filter((v) => v.localService).length} on-device voice(s) found. To add voices on Android, open Settings → Accessibility → Text-to-speech.`));
  }

  // Offline
  const offlineStatus = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });
  const refreshStorage = async () => {
    if (!navigator.storage?.estimate) { offlineStatus.textContent = ''; return; }
    const e = await navigator.storage.estimate();
    let saved = 0;
    if ('caches' in window) {
      const cache = await caches.open('gcm101-content');
      for (const m of c.modules) if (await cache.match(`content/modules/${m.id}.json?v=${m.hash}`)) saved++;
    }
    offlineStatus.textContent = `${saved} of ${c.modules.length} modules saved for offline use. Using about ${(e.usage / 1e6).toFixed(1)} MB on this device${e.quota ? ` (of ${(e.quota / 1e9).toFixed(1)} GB available to this app)` : ''}.`;
  };
  const dlAll = h('button', { class: 'btn', type: 'button' }, icon('download'), 'Download the whole course');
  const withAudio = h('input', { type: 'checkbox', id: 'dl-audio', style: { width: '22px', height: '22px' } });
  dlAll.addEventListener('click', async () => {
    if (!('caches' in window)) { toast('Offline saving is not supported in this browser.'); return; }
    dlAll.disabled = true;
    try {
      const cache = await caches.open('gcm101-content');
      let n = 0;
      for (const m of c.modules) {
        const urls = (await content.moduleUrls(m.id)).filter((u) => withAudio.checked || !u.includes('/audio/'));
        await cache.addAll(urls);
        n++;
        setKids(dlAll, `Downloading… ${n}/${c.modules.length}`);
      }
      await cache.addAll(['content/glossary.json', 'content/about.json']);
      toast('The whole course is saved for offline use.');
    } catch { toast('Download stopped. Check your connection and try again — saved modules are kept.'); }
    dlAll.disabled = false;
    setKids(dlAll, icon('download'), 'Download the whole course');
    refreshStorage();
  });
  const clearOffline = h('button', { class: 'btn quiet', type: 'button' }, 'Remove downloaded content');
  clearOffline.addEventListener('click', async () => {
    if (!(await confirmDialog('Remove downloaded content?', 'Lessons will need a connection again. Your progress is not affected.', 'Remove'))) return;
    await caches.delete('gcm101-content');
    await caches.delete('gcm101-pyodide');
    toast('Downloaded content removed.');
    refreshStorage();
  });
  refreshStorage();

  // Data
  const exportBtn = h('button', { class: 'btn', type: 'button' }, icon('download'), 'Back up my progress (file)');
  exportBtn.addEventListener('click', async () => {
    const data = await store.exportAll();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = h('a', { href: url, download: `GCM101-progress-${new Date().toISOString().slice(0, 10)}.json` });
    addKids(document.body, a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Backup saved to your downloads.');
  });
  const file = h('input', { type: 'file', id: 'imp', accept: 'application/json,.json', class: 'sr-only' });
  file.addEventListener('change', async () => {
    try {
      const data = JSON.parse(await file.files[0].text());
      if (!(await confirmDialog('Replace progress on this device?', 'Your current progress and settings here will be replaced by the file.', 'Replace'))) return;
      await store.importAll(data);
      await store.saveSettings({ onboarded: true });
      toast('Progress imported.');
      location.hash = '#/';
    } catch (e) { toast(e.message || 'That file could not be read.'); }
  });
  const importBtn = h('label', { class: 'btn', for: 'imp', tabindex: 0, role: 'button' }, 'Import a backup');
  importBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
  const erase = h('button', { class: 'btn', type: 'button', style: { borderColor: 'var(--bad)', color: 'var(--bad)' } }, 'Erase all my data');
  erase.addEventListener('click', async () => {
    if (!(await confirmDialog('Erase everything?', 'This deletes your progress, notes and settings from this device. It cannot be undone unless you have a backup file.', 'Erase', 'Keep my data'))) return;
    await store.eraseAll();
    try { localStorage.removeItem('gcm101:appearance'); } catch { /* ignore */ }
    toast('All data erased from this device.');
    location.hash = '#/welcome';
  });

  return h('section', {},
    h('h1', {}, 'Settings'),
    h('h2', { id: 'appearance' }, 'Appearance'),
    radio('Colours', 'theme', [['system', 'Match my device'], ['light', 'Light'], ['dark', 'Dark'], ['contrast', 'High contrast']]),
    h('div', { class: 'field' }, h('label', { for: 'set-size' }, 'Text size', sizeOut), size),
    radio('Reading font', 'font', [['sans', 'Standard'], ['serif', 'Serif'], ['readable', 'Wide and spaced']]),
    radio('Line spacing', 'spacing', [['normal', 'Normal'], ['loose', 'More space']]),
    radio('Motion', 'motion', [['system', 'Match my device'], ['reduce', 'Reduce motion']]),
    h('h2', { id: 'modes' }, 'Ways to learn'),
    h('p', { class: 'small muted' }, 'What each lesson shows when it opens. Reading is always on; you can switch any time from the lesson bar.'),
    h('div', { class: 'toggles' }, MODES.filter((m) => m.key !== 'read').map((m) => {
      const b = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(!!s.modes[m.key]) }, icon(m.icon), m.name, h('span', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
      b.addEventListener('click', async () => { const modes = { ...(await store.settings()).modes, [m.key]: b.getAttribute('aria-pressed') !== 'true' }; b.setAttribute('aria-pressed', String(modes[m.key])); await save({ modes }); });
      return b;
    })),
    h('h3', {}, 'Calculation tracks'),
    h('div', { class: 'toggles' }, [['A', 'A · By hand'], ['B', 'B · Spreadsheet'], ['C', 'C · Python (optional)']].map(([k, t]) => {
      const b = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(!!s.tracks[k]) }, t, h('span', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
      b.addEventListener('click', async () => { const tracks = { ...(await store.settings()).tracks, [k]: b.getAttribute('aria-pressed') !== 'true' }; b.setAttribute('aria-pressed', String(tracks[k])); await save({ tracks }); });
      return b;
    })),
    h('h2', { id: 'audio' }, 'Listening'),
    voiceBlock,
    h('h2', { id: 'exams' }, 'Exams'),
    radio('Time limit', 'timeMultiplier', [[1, 'Standard'], [1.25, '+25%'], [1.5, '+50%'], [2, 'Double'], [0, 'No time limit']]),
    h('p', { class: 'small muted' }, 'The syllabus allows time limits to be extended for learners who need adjustments. You can also add time during an exam.'),
    h('h2', { id: 'offline' }, 'Offline use'),
    offlineStatus,
    h('label', { class: 'row small', for: 'dl-audio' }, withAudio, 'Include audio summaries (about 0.3–1 MB per module)'),
    h('div', { class: 'row' }, dlAll, clearOffline),
    h('h2', { id: 'data' }, 'Your data'),
    h('p', { class: 'small' }, `Everything is stored only on this device (${store.storageBackend()}). Nothing is sent to the course publisher; there are no accounts, analytics or tracking. Back up to a file to move to another phone or computer.`),
    checkbox('Record my active study time (on this device only)', s.trackTime, (v) => save({ trackTime: v }, v ? 'Study time will be recorded.' : 'Study time will not be recorded.')),
    h('div', { class: 'row' }, exportBtn, importBtn, file),
    h('div', { class: 'row', style: { marginTop: 'var(--s3)' } }, erase),
    h('h2', {}, 'About'),
    h('p', {}, h('a', { href: '#/about' }, 'About this course, privacy and methodology'), ' · ', h('a', { href: '#/about/accessibility' }, 'Accessibility'), ' · ', h('a', { href: '#/about/ai' }, 'Use of AI')),
    h('p', { class: 'small muted' }, `Content ${c.contentVersion} · syllabus ${c.syllabus.code} v${c.syllabus.version}`));
}
