// Small DOM toolkit: element builder, icons, live announcements, toasts, dialogs and formatting.
// Text is always set with textContent; only trusted, pre-escaped content HTML uses `html:`.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
// Null-safe versions of replaceChildren/append: conditional children (cond ? x : null) are skipped.
const clean = (children) => children.flat(Infinity).filter((c) => c != null && c !== false);
export function setKids(el, ...children) { el.replaceChildren(...clean(children)); return el; }
export function addKids(el, ...children) { el.append(...clean(children)); return el; }
export const frag = (...children) => { const f = document.createDocumentFragment(); append(f, children); return f; };
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ------------------------------------------------------------------ icons (original, stroke-based)
const P = {
  home: 'M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  ear: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2z',
  hand: 'M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5V4.5a1.5 1.5 0 0 1 3 0V12m0-5.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.6 14a1.6 1.6 0 0 1 2.6-1.8L8 14',
  tools: 'M4 20h16M6 16V9m4 7V5m4 11v-5m4 5V8',
  chart: 'M4 4v16h16M7 15l4-4 3 3 5-6',
  progress: 'M12 3a9 9 0 1 0 9 9M12 3v9h9M12 3a9 9 0 0 1 9 9',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  glossary: 'M4 4h11l5 5v11H4zM15 4v5h5M8 13h8M8 17h5',
  check: 'M4 12.5 9.5 18 20 6',
  x: 'M6 6l12 12M18 6 6 18',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
  stop: 'M6 6h12v12H6z',
  download: 'M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M4.5 19.5h15',
  offline: 'M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4.2-2.4M19 12.5a10 10 0 0 0-3.1-2M2 8.8a15 15 0 0 1 4.5-2.8M22 8.8A15 15 0 0 0 11 5M12 20h.01',
  online: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 20h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.01',
  warn: 'M12 3 2 20h20zM12 10v4.5M12 17.5v.01',
  shield: 'M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6z M8.5 12l2.5 2.5 4.5-5',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  arrow: 'M5 12h14m0 0-5-5m5 5-5 5',
  back: 'M19 12H5m0 0 5-5m-5 5 5 5',
  code: 'M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5',
  sheet: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v16',
  calc: 'M6 3h12v18H6zM8.5 6.5h7v3h-7zM9 13h.01M12 13h.01M15 13h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01',
  print: 'M7 9V3.5h10V9M7 17H4.5V10h15v7H17M7 14h10v6.5H7z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z',
  sources: 'M7 4h10v16l-5-3.5L7 20z',
  speed: 'M12 20a8 8 0 1 1 8-8M12 12l4-4',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
};
export function icon(name, label) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', 'icon');
  if (label) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label); } else svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', P[name] || P.info);
  svg.append(path);
  return svg;
}
export function logo() {
  const wrap = document.createElement('span');
  wrap.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--brand)"/><path d="M7 22l6-7 4 4 8-9" fill="none" stroke="var(--brand-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="10" r="2.5" fill="var(--brand-ink)"/></svg>';
  return wrap.firstChild;
}

// ------------------------------------------------------------------ status and announcements
let live;
export function announce(msg, assertive = false) {
  live ||= document.getElementById('live');
  if (!live) return;
  live.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  live.textContent = '';
  setTimeout(() => { live.textContent = msg; }, 30);
}
export function toast(msg, { action, onAction, timeout = 5000 } = {}) {
  document.querySelector('.toast')?.remove();
  const t = h('div', { class: 'toast', role: 'status' }, h('span', {}, msg));
  if (action) t.append(h('button', { class: 'btn small', onclick: () => { onAction?.(); t.remove(); } }, action));
  document.body.append(t);
  announce(msg);
  if (timeout) setTimeout(() => t.remove(), timeout);
  return t;
}
export function confirmDialog(title, body, okLabel = 'Confirm', cancelLabel = 'Cancel') {
  return new Promise((resolve) => {
    const d = h('dialog', { 'aria-labelledby': 'dlg-t' },
      h('h2', { id: 'dlg-t', style: { marginTop: 0 } }, title),
      h('p', {}, body),
      h('div', { class: 'row', style: { justifyContent: 'flex-end' } },
        h('button', { class: 'btn', value: 'cancel', onclick: () => d.close('cancel') }, cancelLabel),
        h('button', { class: 'btn primary', value: 'ok', onclick: () => d.close('ok') }, okLabel)));
    d.addEventListener('close', () => { resolve(d.returnValue === 'ok'); d.remove(); });
    document.body.append(d);
    d.showModal();
  });
}

// ------------------------------------------------------------------ formatting
export const fmtHours = (h0) => {
  if (h0 == null) return '';
  if (h0 < 1) return `${Math.round(h0 * 60)} min`;
  const whole = Math.floor(h0);
  const mins = Math.round((h0 - whole) * 60);
  return mins ? `${whole} h ${mins} min` : `${whole} h`;
};
// Long form for running text ("about 5 hours", "1 hour 30 minutes"); fmtHours is for chips and tables.
export const fmtHoursLong = (h0) => {
  if (h0 == null) return '';
  const total = Math.round(h0 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  const p = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  if (!hh) return p(mm, 'minute');
  return mm ? `${p(hh, 'hour')} ${p(mm, 'minute')}` : p(hh, 'hour');
};
export const fmtPct = (x, dp = 0) => `${(x * 100).toFixed(dp)}%`;
export const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; }
};
export function statusChip(status) {
  const map = {
    passed: ['ok', 'check', 'Passed'],
    progress: ['brand', 'progress', 'In progress'],
    locked: ['', 'lock', 'Locked'],
    open: ['', 'play', 'Not started'],
    failed: ['warn', 'warn', 'Not passed yet'],
  };
  const [cls, ic, label] = map[status] || map.open;
  return h('span', { class: `chip ${cls}` }, icon(ic), label);
}

// Collapse/expand helper that keeps aria-expanded in sync.
export function disclosure(label, content, { open = false, cls = '' } = {}) {
  const d = h('details', { class: cls, open }, h('summary', {}, label), content);
  return d;
}
