// Tiny SVG chart kit. Series differ by dash pattern as well as colour (colour is never the only
// signal); every chart gets <title>/<desc> plus a data table built by the caller.
import { fmtNumber } from '../quiz/engine.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, text) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
};
function niceTicks(min, max, count = 5) {
  // A flat series (e.g. the swap's fixed all-in cost) can differ only by floating-point noise.
  if (!(max - min > 1e-9 * Math.max(1, Math.abs(max)))) { const pad = Math.max(1, Math.abs(max) * 0.1); min -= pad; max += pad; }
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) || step0;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo, k = 0; v <= hi + step / 2 && k < 50; v += step, k++) ticks.push(+v.toFixed(10));
  return { lo, hi, ticks };
}
const short = (v, dp) => {
  const a = Math.abs(v);
  if (a >= 1e9) return `${fmtNumber(v / 1e9, 1, { trim: true })}bn`;
  if (a >= 1e6) return `${fmtNumber(v / 1e6, 1, { trim: true })}m`;
  if (a >= 1e4) return `${fmtNumber(v / 1e3, 0)}k`;
  return fmtNumber(v, dp ?? (a < 10 ? 2 : 0), { trim: true });
};

// Size the drawing to the screen so 12-unit text is ~12px on phones as well as desktops.
const chartWidth = () => Math.max(320, Math.min(640, (typeof window !== 'undefined' ? window.innerWidth : 640) - 56));

export function lineChart({ series, xLabel = '', yLabel = '', title = '', desc = '', xFmt, yFmt, markers = [], yZero = false, height = 320 }) {
  const W = chartWidth();
  const H = Math.round(height * Math.max(0.8, W / 640));
  const m = { l: 64, r: 18, t: 18, b: 52 };
  const xs = series.flatMap((s) => s.points.map((p) => p[0]));
  const ys = series.flatMap((s) => s.points.map((p) => p[1])).concat(markers.map((mk) => mk.y).filter((y) => y != null));
  if (yZero) ys.push(0);
  const xt = niceTicks(Math.min(...xs), Math.max(...xs), W < 480 ? 4 : 5);
  const yt = niceTicks(Math.min(...ys), Math.max(...ys), W < 480 ? 4 : 5);
  const X = (x) => m.l + ((x - xt.lo) / (xt.hi - xt.lo)) * (W - m.l - m.r);
  const Y = (y) => H - m.b - ((y - yt.lo) / (yt.hi - yt.lo)) * (H - m.t - m.b);
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-labelledby': '' });
  const tid = `t${Math.random().toString(36).slice(2)}`;
  svg.append(el('title', { id: tid }, title), el('desc', { id: `${tid}d` }, desc));
  svg.setAttribute('aria-labelledby', `${tid} ${tid}d`);
  for (const t of yt.ticks) {
    svg.append(el('line', { class: 'grid-line', x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }));
    svg.append(el('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end' }, yFmt ? yFmt(t) : short(t)));
  }
  for (const t of xt.ticks) svg.append(el('text', { x: X(t), y: H - m.b + 18, 'text-anchor': 'middle' }, xFmt ? xFmt(t) : short(t)));
  if (yt.lo < 0 && yt.hi > 0) svg.append(el('line', { class: 'zero', x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0) }));
  svg.append(el('line', { class: 'axis', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }), el('line', { class: 'axis', x1: m.l, x2: m.l, y1: m.t, y2: H - m.b }));
  svg.append(el('text', { x: (W + m.l) / 2, y: H - 8, 'text-anchor': 'middle', 'font-weight': 600 }, xLabel));
  const yl = el('text', { x: 14, y: (H - m.b + m.t) / 2, 'text-anchor': 'middle', 'font-weight': 600, transform: `rotate(-90 14 ${(H - m.b + m.t) / 2})` }, yLabel);
  svg.append(yl);
  series.forEach((s, i) => {
    const d = s.points.map((p, j) => `${j ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
    svg.append(el('path', { d, class: `s${i % 3}` }));
  });
  for (const mk of markers) {
    if (mk.y == null) { svg.append(el('line', { class: 'grid-line', x1: X(mk.x), x2: X(mk.x), y1: m.t, y2: H - m.b })); }
    else svg.append(el('circle', { class: 'marker', cx: X(mk.x), cy: Y(mk.y), r: 6 }));
    if (mk.label) {
      const right = X(mk.x) > W * 0.6;
      svg.append(el('text', { x: X(mk.x) + (right ? -8 : 8), y: (mk.y == null ? m.t + 12 : Y(mk.y) - 10), 'font-weight': 700, 'text-anchor': right ? 'end' : 'start' }, mk.label));
    }
  }
  if (series.length > 1) {
    series.forEach((s, i) => {
      const lx = m.l + 12;
      const ly = m.t + 14 + i * 20;
      svg.append(el('line', { x1: lx, x2: lx + 28, y1: ly - 4, y2: ly - 4, class: `s${i % 3}` }));
      svg.append(el('text', { x: lx + 34, y: ly }, s.label));
    });
  }
  return svg;
}

export function barChart({ bars, title = '', desc = '', yLabel = '', yFmt, height = 300 }) {
  const W = chartWidth();
  const H = Math.round(height * Math.max(0.85, W / 640));
  const m = { l: 64, r: 18, t: 18, b: 70 };
  const vals = bars.map((b) => b.value).concat(0);
  const yt = niceTicks(Math.min(...vals), Math.max(...vals));
  const Y = (y) => H - m.b - ((y - yt.lo) / (yt.hi - yt.lo)) * (H - m.t - m.b);
  const bw = (W - m.l - m.r) / bars.length;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img' });
  const tid = `t${Math.random().toString(36).slice(2)}`;
  svg.append(el('title', { id: tid }, title), el('desc', { id: `${tid}d` }, desc));
  svg.setAttribute('aria-labelledby', `${tid} ${tid}d`);
  for (const t of yt.ticks) {
    svg.append(el('line', { class: 'grid-line', x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t) }));
    svg.append(el('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end' }, yFmt ? yFmt(t) : short(t)));
  }
  bars.forEach((b, i) => {
    const x = m.l + i * bw + bw * 0.15;
    const y0 = Y(0);
    const y1 = Y(b.value);
    svg.append(el('rect', { x, y: Math.min(y0, y1), width: bw * 0.7, height: Math.max(1, Math.abs(y1 - y0)), class: b.value < 0 ? 'bar-neg' : `bar${b.alt ? 1 : 0}`, rx: 3 }));
    svg.append(el('text', { x: x + bw * 0.35, y: Math.min(y0, y1) - 6, 'text-anchor': 'middle', 'font-weight': 700 }, b.text ?? (yFmt ? yFmt(b.value) : short(b.value))));
    const words = String(b.label).split(' ');
    const lines = [];
    let cur = '';
    const maxLen = Math.max(6, Math.floor(bw / 7.5));
    for (const w of words) { if ((cur + ' ' + w).trim().length > maxLen && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    lines.push(cur);
    lines.slice(0, 3).forEach((ln, k) => svg.append(el('text', { x: x + bw * 0.35, y: H - m.b + 16 + k * 14, 'text-anchor': 'middle' }, ln)));
  });
  svg.append(el('line', { class: 'axis', x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0) }));
  svg.append(el('text', { x: 14, y: (H - m.b + m.t) / 2, 'text-anchor': 'middle', 'font-weight': 600, transform: `rotate(-90 14 ${(H - m.b + m.t) / 2})` }, yLabel));
  return svg;
}
