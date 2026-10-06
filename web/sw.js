/* GCM-101 service worker.
   - App shell (code, styles, icons, small content index) is precached per version.
   - Course content is served stale-while-revalidate, so a syllabus update reaches learners on their
     next visit without an app release. Module files are versioned by content hash in the URL.
   - Modules a learner opens are cached automatically; "Download for offline" stores the rest.
   - Audio supports Range requests from cache (needed by Safari/iOS).
   - The optional Python runtime (Pyodide, from cdn.jsdelivr.net) is cached once the learner opts in. */
importScripts('sw-manifest.js');
const { version, shell } = self.__GCM;
const SHELL = `gcm101-shell-${version}`;
const CONTENT = 'gcm101-content';
const PYODIDE = 'gcm101-pyodide';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(shell)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('gcm101-shell-') && key !== SHELL) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', (e) => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });

const timeout = (ms, p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = (await cache.match(req)) || (await caches.match(req));
  const network = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
  return cached || (await network) || new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
}
async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') (await caches.open(cacheName)).put(req, res.clone());
  return res;
}
async function rangeFromCache(req) {
  const url = req.url.split('#')[0];
  let res = await caches.match(url, { ignoreSearch: false });
  if (!res) {
    res = await fetch(url);
    if (res.ok) (await caches.open(CONTENT)).put(url, res.clone());
  }
  const range = req.headers.get('range');
  if (!range || !res.ok) return res;
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? Number(m[1]) : 0;
  const end = m && m[2] ? Number(m[2]) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'audio/mp4', 'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' },
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === 'https://cdn.jsdelivr.net' && url.pathname.startsWith('/pyodide/')) {
    event.respondWith(cacheFirst(req, PYODIDE));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try { return await timeout(4000, fetch(req)); } catch { return (await caches.match('index.html')) || (await caches.match('./')) || Response.error(); }
    })());
    return;
  }
  const path = url.pathname;
  if (path.includes('/content/audio/')) { event.respondWith(rangeFromCache(req)); return; }
  if (path.includes('/content/')) { event.respondWith(staleWhileRevalidate(req, CONTENT)); return; }
  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try { return await fetch(req); } catch { return Response.error(); }
  })());
});
