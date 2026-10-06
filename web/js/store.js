// On-device storage. Progress and settings never leave the device: IndexedDB first, localStorage as a
// fallback, memory as a last resort (private windows). No personal data is collected. Learners can
// export, import and erase everything from Settings.

const DB = 'gcm101';
const STORE = 'kv';
let dbp = null;
const mem = new Map();
let backend = 'memory';

function openDb() {
  if (dbp) return dbp;
  dbp = new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => { backend = 'indexeddb'; resolve(req.result); };
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbp;
}
function lsOk() {
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch { return false; }
}

export async function get(key, fallback = undefined) {
  const db = await openDb();
  if (db) {
    try {
      const v = await new Promise((res, rej) => {
        const r = db.transaction(STORE).objectStore(STORE).get(key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      return v === undefined ? fallback : v;
    } catch { /* fall through */ }
  }
  if (lsOk()) {
    backend = 'localstorage';
    const raw = localStorage.getItem(`${DB}:${key}`);
    return raw == null ? fallback : JSON.parse(raw);
  }
  return mem.has(key) ? structuredClone(mem.get(key)) : fallback;
}
export async function set(key, value) {
  const db = await openDb();
  if (db) {
    try {
      await new Promise((res, rej) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = res;
        tx.onerror = () => rej(tx.error);
      });
      return;
    } catch { /* fall through */ }
  }
  if (lsOk()) { backend = 'localstorage'; localStorage.setItem(`${DB}:${key}`, JSON.stringify(value)); return; }
  mem.set(key, structuredClone(value));
}
export async function keys() {
  const db = await openDb();
  if (db) {
    return new Promise((res) => {
      const r = db.transaction(STORE).objectStore(STORE).getAllKeys();
      r.onsuccess = () => res(r.result);
      r.onerror = () => res([]);
    });
  }
  if (lsOk()) return Object.keys(localStorage).filter((k) => k.startsWith(`${DB}:`)).map((k) => k.slice(DB.length + 1));
  return [...mem.keys()];
}
export async function clearAll() {
  const db = await openDb();
  if (db) await new Promise((res) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).clear(); tx.oncomplete = res; tx.onerror = res; });
  if (lsOk()) Object.keys(localStorage).filter((k) => k.startsWith(`${DB}:`)).forEach((k) => localStorage.removeItem(k));
  mem.clear();
}
export const storageBackend = () => backend;

// ------------------------------------------------------------------ typed state with defaults
export const DEFAULT_SETTINGS = {
  onboarded: false,
  theme: 'system', // system | light | dark | contrast
  textSize: 1, // multiplier of the 17px base
  spacing: 'normal', // normal | loose
  font: 'sans', // sans | serif | readable
  motion: 'system', // system | reduce
  modes: { see: true, hear: false, do: true },
  tracks: { A: true, B: true, C: false },
  voice: '',
  rate: 1,
  allowOnlineVoices: false,
  timeMultiplier: 1, // 1, 1.25, 1.5, 2, or 0 = untimed
  previewLocked: true,
  trackTime: true,
};
export const DEFAULT_PROGRESS = {
  version: 1,
  startedAt: null,
  modules: {}, // id -> { learn, practise, kc: {attempts:[], best, passed}, applied: {}, time, lastSection }
  exams: {}, // cp1..cp3, final -> { attempts: [], best, passed }
  capstone: { milestones: {}, notes: {}, rubric: {}, submittedAt: null },
  resume: null, // { route, label, at }
};

let settingsCache = null;
let progressCache = null;
const listeners = new Set();
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = (what) => listeners.forEach((fn) => fn(what));

const merge = (base, over) => {
  if (!over || typeof over !== 'object' || Array.isArray(over)) return over ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = base && typeof base[k] === 'object' && !Array.isArray(base[k]) ? merge(base[k], v) : v;
  return out;
};

export async function settings() {
  if (!settingsCache) settingsCache = merge(DEFAULT_SETTINGS, await get('settings', {}));
  return settingsCache;
}
export async function saveSettings(patch) {
  settingsCache = merge(await settings(), patch);
  await set('settings', settingsCache);
  emit('settings');
  return settingsCache;
}
export async function progress() {
  if (!progressCache) progressCache = merge(DEFAULT_PROGRESS, await get('progress', {}));
  return progressCache;
}
let saveTimer = null;
export async function saveProgress(mutator) {
  const p = await progress();
  mutator(p);
  p.startedAt ||= new Date().toISOString();
  clearTimeout(saveTimer);
  await set('progress', p);
  emit('progress');
  return p;
}
export function moduleState(p, id) {
  p.modules[id] ||= { learn: { done: false }, practise: { done: false }, kc: { attempts: [], best: 0, passed: false }, applied: {}, time: 0 };
  return p.modules[id];
}

// ------------------------------------------------------------------ export / import
export async function exportAll() {
  return {
    app: 'GCM-101',
    format: 1,
    exportedAt: new Date().toISOString(),
    note: 'Your GCM-101 progress and settings. Contains no personal data unless you typed some into notes.',
    settings: await settings(),
    progress: await progress(),
  };
}
export async function importAll(data) {
  if (!data || data.app !== 'GCM-101' || !data.progress) throw new Error('This file is not a GCM-101 progress file.');
  settingsCache = merge(DEFAULT_SETTINGS, data.settings || {});
  progressCache = merge(DEFAULT_PROGRESS, data.progress);
  await set('settings', settingsCache);
  await set('progress', progressCache);
  emit('settings');
  emit('progress');
}
export async function eraseAll() {
  await clearAll();
  settingsCache = null;
  progressCache = null;
  emit('settings');
  emit('progress');
}
