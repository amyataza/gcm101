// Loads course content at runtime from /content (generated from the syllabus). The app code never
// embeds course text, so updating the syllabus and re-running `npm run content` updates the app
// without touching any JavaScript. Module files carry a content hash in the URL so caches refresh.

const cache = new Map();
let coursePromise = null;

async function fetchJson(url) {
  let res;
  try {
    // Default cache mode: the service worker revalidates content, and hosts send revalidation headers.
    res = await fetch(url);
  } catch (e) {
    throw Object.assign(new Error(`Could not load ${url} (no connection)`), { offline: true });
  }
  // The service worker answers 503 when a file is neither cached nor reachable.
  if (res.status === 503) throw Object.assign(new Error(`Not saved for offline use: ${url}`), { offline: true });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return res.json();
}

export function course() {
  coursePromise ||= fetchJson('content/course.json').catch((e) => { coursePromise = null; throw e; });
  return coursePromise;
}
export async function module(id) {
  const c = await course();
  const entry = c.modules.find((m) => m.id === id);
  if (!entry) throw new Error(`Unknown module ${id}`);
  const url = `content/modules/${id}.json?v=${entry.hash}`;
  if (!cache.has(url)) cache.set(url, fetchJson(url).catch((e) => { cache.delete(url); throw e; }));
  return cache.get(url);
}
function once(key, url) {
  if (!cache.has(key)) cache.set(key, fetchJson(url).catch((e) => { cache.delete(key); throw e; }));
  return cache.get(key);
}
export const glossary = () => once('glossary', 'content/glossary.json');
export const about = () => once('about', 'content/about.json');
export const audit = () => once('audit', 'content/audit.json');
export const overlay = (name) => once(`ov:${name}`, `content/overlays/${name}.json`).catch(() => ({}));

export async function moduleUrls(id) {
  const c = await course();
  const entry = c.modules.find((m) => m.id === id);
  const urls = [`content/modules/${id}.json?v=${entry.hash}`];
  const audio = await overlay('audio');
  const a = audio.files?.[id];
  if (a) urls.push(`content/audio/${a.file}`);
  return urls;
}

export function refLookup(c, code) {
  if (code.startsWith('D')) return c.decisions.find((d) => d.id === code);
  return c.references.find((r) => r.id === code);
}
