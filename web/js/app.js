// GCM-101 app controller: hash router, appearance settings, focus management, resume tracking,
// on-device time-on-task logging, connectivity status and service-worker registration.

import { h, icon, logo, $, $$, announce, toast } from './ui.js';
import * as store from './store.js';
import * as content from './content.js';

const routes = [
  [/^\/?$/, 'home'],
  [/^\/welcome$/, 'onboarding'],
  [/^\/m\/(m\d+)$/, 'module', ['id']],
  [/^\/m\/(m\d+)\/learn$/, 'learn', ['id']],
  [/^\/m\/(m\d+)\/practise$/, 'practise', ['id']],
  [/^\/m\/(m\d+)\/check$/, 'check', ['id']],
  [/^\/quiz\/(m\d+)$/, 'quiz', ['id']],
  [/^\/exam\/(cp\d|final)$/, 'exam', ['id']],
  [/^\/exams$/, 'exams'],
  [/^\/capstone$/, 'capstone'],
  [/^\/glossary$/, 'glossary'],
  [/^\/tools$/, 'tools'],
  [/^\/tools\/([\w.-]+)$/, 'tool', ['id']],
  [/^\/progress$/, 'progress'],
  [/^\/settings$/, 'settings'],
  [/^\/about$/, 'about'],
  [/^\/about\/(\w+)$/, 'about', ['page']],
  [/^\/sources$/, 'sources'],
  [/^\/sources\/([SRD]\d+)$/, 'sources', ['code']],
  [/^\/credentials$/, 'credentials'],
  [/^\/methodology$/, 'methodology'],
];
const loaders = {
  home: () => import('./views/home.js'),
  onboarding: () => import('./views/onboarding.js'),
  module: () => import('./views/module.js'),
  learn: () => import('./views/learn.js'),
  practise: () => import('./views/practise.js'),
  check: () => import('./views/module.js'),
  quiz: () => import('./views/quiz.js'),
  exam: () => import('./views/quiz.js'),
  exams: () => import('./views/exams.js'),
  capstone: () => import('./views/capstone.js'),
  glossary: () => import('./views/glossary.js'),
  tools: () => import('./views/tools.js'),
  tool: () => import('./views/tools.js'),
  progress: () => import('./views/progress.js'),
  settings: () => import('./views/settings.js'),
  about: () => import('./views/about.js'),
  sources: () => import('./views/about.js'),
  credentials: () => import('./views/about.js'),
  methodology: () => import('./views/about.js'),
};
const navOf = { home: 'home', module: 'home', learn: 'home', practise: 'home', check: 'home', quiz: 'home', exam: 'home', exams: 'home', capstone: 'home', glossary: 'glossary', tools: 'tools', tool: 'tools', progress: 'progress', settings: 'settings' };

function parse() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const [path, qs] = raw.split('?');
  for (const [re, name, keys = []] of routes) {
    const m = path.match(re);
    if (m) return { name, path, params: Object.fromEntries(keys.map((k, i) => [k, m[i + 1]])), query: new URLSearchParams(qs || '') };
  }
  return { name: 'notfound', path, params: {}, query: new URLSearchParams() };
}

// ------------------------------------------------------------------ appearance
export async function applyAppearance() {
  const s = await store.settings();
  const r = document.documentElement;
  if (s.theme && s.theme !== 'system') r.dataset.theme = s.theme; else delete r.dataset.theme;
  r.style.fontSize = `${17 * (s.textSize || 1)}px`;
  if (s.font !== 'sans') r.dataset.font = s.font; else delete r.dataset.font;
  if (s.spacing === 'loose') r.dataset.spacing = 'loose'; else delete r.dataset.spacing;
  if (s.motion === 'reduce') r.dataset.motion = 'reduce'; else delete r.dataset.motion;
  try { localStorage.setItem('gcm101:appearance', JSON.stringify({ theme: s.theme, textSize: s.textSize, font: s.font, spacing: s.spacing, motion: s.motion })); } catch { /* ignore */ }
}

// ------------------------------------------------------------------ time on task (on-device only)
let activeModule = null;
let lastInput = Date.now();
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) => addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true }));
setInterval(async () => {
  if (!activeModule || document.hidden || Date.now() - lastInput > 120000) return;
  const s = await store.settings();
  if (!s.trackTime) return;
  await store.saveProgress((p) => { store.moduleState(p, activeModule).time += 15; });
}, 15000);

// ------------------------------------------------------------------ rendering
const main = () => $('#main');
let renderToken = 0;
export async function render() {
  const token = ++renderToken;
  const route = parse();
  const s = await store.settings();
  // Only the home screen sends first-time visitors to onboarding; a shared deep link (a lesson,
  // the glossary, a tool) opens directly so nobody has to click through setup to read it.
  if (!s.onboarded && route.name === 'home') {
    location.replace('#/welcome');
    return;
  }
  activeModule = route.params.id && /^m\d+$/.test(route.params.id) ? route.params.id : null;
  $$('.nav a').forEach((a) => a.toggleAttribute('aria-current', false));
  const navKey = navOf[route.name];
  if (navKey) $(`.nav a[data-nav="${navKey}"]`)?.setAttribute('aria-current', 'page');
  document.body.dataset.route = route.name;

  let node;
  try {
    if (route.name === 'notfound') throw Object.assign(new Error('Page not found'), { notFound: true });
    const mod = await loaders[route.name]();
    const c = await content.course();
    const ctx = { route, params: route.params, query: route.query, course: c, settings: s, progress: await store.progress(), setTitle, rerender: render };
    node = await mod.render(ctx);
  } catch (err) {
    console.error(err);
    node = errorView(err);
  }
  if (token !== renderToken) return; // a newer navigation won
  const m = main();
  m.replaceChildren(node);
  const h1 = m.querySelector('h1');
  if (!document.title.includes('·')) document.title = 'GCM-101';
  // Move focus to the new page heading so screen-reader and keyboard users start at the top.
  if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  const anchor = route.query.get('at');
  const target = anchor && m.querySelector(`#${CSS.escape(anchor)}`);
  if (target) target.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
  announce(document.title);
}
function setTitle(text, short) {
  document.title = text ? `${text} · GCM-101` : 'GCM-101 · Global Capital Markets';
  $('#page-title').textContent = short ?? text ?? '';
}
function errorView(err) {
  const offline = err.offline || !navigator.onLine;
  if (err.offline) { seenOffline = true; netStatus(); }
  setTitle(err.notFound ? 'Page not found' : offline ? 'Not available offline' : 'Something went wrong');
  return h('section', { class: 'stack' },
    h('h1', {}, err.notFound ? 'We could not find that page' : offline ? 'This part is not saved for offline use yet' : 'Something went wrong'),
    h('p', {}, offline
      ? 'You are offline and this page has not been downloaded. Reconnect, or download modules for offline use in Settings.'
      : err.notFound ? 'The link may be out of date.' : `The page could not load (${err.message}). Your progress is safe on this device.`),
    h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/' }, 'Go to the course map'), h('button', { class: 'btn', onclick: () => render() }, 'Try again')));
}

// ------------------------------------------------------------------ connectivity indicator
let seenOffline = false; // set when a request fails for lack of a connection (navigator.onLine can be wrong)
function netStatus() {
  const el = $('#net-status');
  const off = !navigator.onLine || seenOffline;
  el.replaceChildren(off ? h('span', { class: 'chip warn' }, icon('offline'), 'Offline') : '');
}
addEventListener('online', () => { seenOffline = false; netStatus(); toast('Back online.'); });
addEventListener('offline', () => { netStatus(); toast('You are offline. Downloaded modules still work.'); });

// ------------------------------------------------------------------ service worker
async function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  // Developers can bypass the worker while editing: localStorage['gcm101:dev-nosw'] = '1'.
  try { if (localStorage.getItem('gcm101:dev-nosw') === '1') { (await navigator.serviceWorker.getRegistrations()).forEach((r) => r.unregister()); return; } } catch { /* ignore */ }
  try {
    const reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          toast('A new version of the course is ready.', { action: 'Update', timeout: 0, onAction: () => nw.postMessage({ type: 'SKIP_WAITING' }) });
        }
      });
    });
    // Reload only when an update replaces an existing worker, never on the very first install.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  } catch (e) {
    console.warn('Service worker registration failed', e);
  }
}

// ------------------------------------------------------------------ boot
async function boot() {
  $('#logo').replaceWith(logo());
  $$('[data-icon]').forEach((el) => el.replaceWith(icon(el.dataset.icon)));
  // The skip link must not change the hash (the router owns it).
  $('.skip').addEventListener('click', (e) => { e.preventDefault(); main().focus(); });
  await applyAppearance();
  store.onChange((what) => { if (what === 'settings') applyAppearance(); });
  netStatus();
  addEventListener('hashchange', render);
  await render();
  registerSW();
  if (navigator.storage?.persist) navigator.storage.persisted().then((p) => { if (!p) navigator.storage.persist().catch(() => {}); });
}
boot();
