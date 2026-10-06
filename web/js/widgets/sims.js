// Hands-on simulations. Each starts from its syllabus worked example and lets the learner change
// inputs and step through events. Calculations come from calc.js.
import { h, icon, announce, setKids } from '../ui.js';
import * as calc from '../calc.js';
import { fmtNumber } from '../quiz/engine.js';
import { lineChart, barChart } from './charts.js';

const f = (x, dp = 2) => fmtNumber(x, dp);
function frame(title, ...children) {
  return h('section', { class: 'widget', 'aria-label': title }, h('header', {}, icon('hand'), h('h3', {}, title)), ...children);
}
function numField(label, value, { step = 'any', min, max, id, width = '9rem' } = {}) {
  const inp = h('input', { type: 'number', value, step, min, max, id, inputmode: 'decimal', style: { maxWidth: width } });
  return { inp, el: h('div', { class: 'field' }, h('label', { for: id }, label), inp) };
}
let uid = 0;
const nid = (p) => `${p}-${++uid}`;
function table(caption, head, rows, rowClass) {
  return h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': caption },
    h('table', {}, h('caption', { class: 'sr-only' }, caption), h('thead', {}, h('tr', {}, head.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', {}, rows.map((r, i) => h('tr', { class: rowClass?.(i) || '' }, r.map((c) => h('td', {}, c)))))));
}

export function mount(w) {
  const fn = { payoff, futures, orderbook, auction, netting, settlement }[w.type];
  return fn ? fn(w) : h('p', {}, `Unknown activity ${w.type}`);
}

// ------------------------------------------------------------------ option payoff (M9 WE 9.3)
function payoff(w) {
  const d = { k: 100, premium: 5, type: 'call', position: 'long', ...w.defaults };
  const state = { ...d };
  const kF = numField('Strike (K)', d.k, { id: nid('k'), step: 1 });
  const pF = numField('Premium', d.premium, { id: nid('p'), step: 0.5, min: 0 });
  const typeSel = h('select', { id: nid('t') }, h('option', { value: 'call' }, 'Call (right to buy)'), h('option', { value: 'put' }, 'Put (right to sell)'));
  const posSel = h('select', { id: nid('pos') }, h('option', { value: 'long' }, 'Holder (long, pays premium)'), h('option', { value: 'short' }, 'Writer (short, receives premium)'));
  typeSel.value = d.type; posSel.value = d.position;
  const out = h('div');
  const draw = () => {
    state.k = Number(kF.inp.value); state.premium = Number(pF.inp.value); state.type = typeSel.value; state.position = posSel.value;
    const lo = Math.max(0, state.k * 0.7);
    const hi = state.k * 1.3;
    const pts = [];
    for (let i = 0; i <= 60; i++) { const s = lo + ((hi - lo) * i) / 60; pts.push([s, calc.optionProfit(s, state.k, state.premium, state.type, state.position)]); }
    const be = calc.breakEven(state.k, state.premium, state.type);
    const prices = [0.8, 0.9, 0.96, 1, 1.05, 1.1, 1.2].map((x) => Math.round(state.k * x));
    setKids(out, 
      lineChart({ series: [{ label: 'Profit at expiry', points: pts }], xLabel: 'Share price at expiry', yLabel: 'Profit', title: `${state.position === 'long' ? 'Holder' : 'Writer'} of a ${state.type}, strike ${state.k}, premium ${state.premium}`,
        desc: `Profit is ${state.type === 'call' ? 'flat at −premium below the strike, then rises one-for-one' : 'rises one-for-one as the price falls below the strike, and is flat at −premium above it'}${state.position === 'short' ? ', mirrored for the writer' : ''}. Break-even at ${f(be)}.`,
        markers: [{ x: be, y: 0, label: `Break-even ${f(be)}` }], yZero: true, height: 260 }),
      table('Profit at selected expiry prices', ['Price at expiry', 'Payoff', 'Profit'], prices.map((s) => {
        const pay = state.type === 'call' ? calc.callPayoff(s, state.k) : calc.putPayoff(s, state.k);
        return [f(s, 0), f(state.position === 'long' ? pay : -pay), f(calc.optionProfit(s, state.k, state.premium, state.type, state.position))];
      })),
      h('p', { class: 'small' }, `Payoff = ${state.type === 'call' ? 'max(S − K, 0)' : 'max(K − S, 0)'}; profit = payoff − premium${state.position === 'short' ? ' (reversed for the writer)' : ''}. Break-even ${state.type === 'call' ? 'K + premium' : 'K − premium'} = ${f(be)}.`));
    announce(`Break-even ${f(be)}`);
  };
  [kF.inp, pF.inp, typeSel, posSel].forEach((x) => x.addEventListener('change', draw));
  draw();
  return frame(w.title || 'Option payoff explorer',
    h('div', { class: 'grid two' }, kF.el, pF.el, h('div', { class: 'field' }, h('label', { for: typeSel.id }, 'Option'), typeSel), h('div', { class: 'field' }, h('label', { for: posSel.id }, 'Position'), posSel)),
    out, h('p', { class: 'small muted' }, 'Starts at Worked example 9.3 (strike 100, call premium 5; the put in the example costs 4).'));
}

// ------------------------------------------------------------------ futures margining (M9 WE 9.2)
function futures(w) {
  const d = { settles: [70000, 70400, 69500, 69300, 70100], contracts: 2, multiplier: 10, initial: 25000, maintenance: 20000, ...w.defaults };
  const inputs = d.settles.map((v, i) => numField(i === 0 ? 'Entry price (day 0)' : `Settlement day ${i}`, v, { id: nid('s'), step: 50, width: '10rem' }));
  const nF = numField('Contracts', d.contracts, { id: nid('n'), step: 1, min: 1 });
  let shown = d.settles.length - 1;
  const out = h('div');
  const status = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });
  const draw = () => {
    const settles = inputs.map((x) => Number(x.inp.value));
    const r = calc.futuresMargin(settles, Number(nF.inp.value), d.multiplier, d.initial, d.maintenance);
    const rows = r.rows.slice(0, shown + 1);
    setKids(out, 
      table('Daily settlement', ['Day', 'Settlement', 'Change (points)', 'Gain/loss', 'Balance', 'Margin call'], rows.map((x) => [x.day, f(x.settle, 0), x.change == null ? '–' : f(x.change, 0), x.pnl == null ? '–' : f(x.pnl, 0), f(x.balance, 0), x.call ? f(x.call, 0) : '0']), (i) => (rows[i].call ? 'hit' : '')),
      lineChart({ series: [{ label: 'Balance after settlement', points: rows.map((x) => [x.day, x.balance]) }, { label: 'Maintenance margin', points: rows.map((x) => [x.day, r.maintenance]) }],
        xLabel: 'Day', yLabel: 'Margin account', title: 'Margin account balance', desc: `Balance by day against the maintenance level of ${f(r.maintenance, 0)}. A margin call restores the balance to the initial ${f(r.initial, 0)}.`, height: 240 }));
    const call = rows.find((x) => x.call);
    status.textContent = shown < d.settles.length - 1 ? `Day ${shown}: balance ${f(rows[shown].balance, 0)}.` : `Total gain ${f(r.total, 0)}; margin calls paid ${f(r.totalCalls, 0)}.${call ? ` The call on day ${call.day} had to be met in cash.` : ''}`;
  };
  const step = h('button', { class: 'btn small primary', type: 'button' }, 'Next day');
  const reset = h('button', { class: 'btn small', type: 'button' }, 'Start from day 0');
  step.addEventListener('click', () => { shown = Math.min(d.settles.length - 1, shown + 1); draw(); });
  reset.addEventListener('click', () => { shown = 0; draw(); });
  [...inputs.map((x) => x.inp), nF.inp].forEach((x) => x.addEventListener('change', draw));
  draw();
  return frame(w.title || 'Futures margin simulator',
    h('p', { class: 'small' }, `Multiplier ${d.multiplier} per point; initial margin ${f(d.initial, 0)} and maintenance ${f(d.maintenance, 0)} per contract. Change the prices to create your own margin call.`),
    h('div', { class: 'grid three' }, nF.el, ...inputs.map((x) => x.el)), h('div', { class: 'row' }, reset, step), status, out);
}

// ------------------------------------------------------------------ order book (M12 WE 12.1)
function orderbook(w) {
  const d = { bids: [{ price: 50.0, qty: 1500 }, { price: 49.95, qty: 4000 }, { price: 49.9, qty: 6000 }], asks: [{ price: 50.1, qty: 2000 }, { price: 50.15, qty: 3000 }, { price: 50.25, qty: 5000 }], ...w.defaults };
  const side = h('select', { id: nid('side') }, h('option', { value: 'buy' }, 'Buy (market order)'), h('option', { value: 'sell' }, 'Sell (market order)'));
  const q = numField('Quantity', 4000, { id: nid('q'), step: 500, min: 0 });
  const out = h('div');
  const draw = () => {
    const qty = Number(q.inp.value);
    const levels = side.value === 'buy' ? d.asks : d.bids;
    const r = calc.walkBook(levels, qty);
    const mid = (d.bids[0].price + d.asks[0].price) / 2;
    const cost = side.value === 'buy' ? ((r.avg - mid) / mid) * 10000 : ((mid - r.avg) / mid) * 10000;
    const hits = new Set(r.fills.map((x) => x.price));
    setKids(out, 
      h('div', { class: 'table-wrap' }, h('table', { class: 'book' }, h('caption', { class: 'sr-only' }, 'Order book'),
        h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Bid qty'), h('th', { scope: 'col' }, 'Bid price'), h('th', { scope: 'col' }, 'Ask price'), h('th', { scope: 'col' }, 'Ask qty'))),
        h('tbody', {}, d.asks.map((a, i) => {
          const b = d.bids[i];
          const bh = side.value === 'sell' && hits.has(b.price);
          const ah = side.value === 'buy' && hits.has(a.price);
          return h('tr', {}, h('td', { class: `bid ${bh ? 'hit' : ''}` }, f(b.qty, 0)), h('td', { class: `bid ${bh ? 'hit' : ''}` }, f(b.price)), h('td', { class: `ask ${ah ? 'hit' : ''}` }, f(a.price)), h('td', { class: `ask ${ah ? 'hit' : ''}` }, f(a.qty, 0)));
        })))),
      h('div', { class: 'results', role: 'status', 'aria-live': 'polite' },
        res('Spread', `${f(d.asks[0].price - d.bids[0].price)} (${f(calc.spreadBp(d.bids[0].price, d.asks[0].price), 1)} bp)`),
        res('Filled', `${f(r.filled, 0)} of ${f(qty, 0)}`),
        res('Total', f(r.cost)), res('Average price', f(r.avg, 3)), res('Cost vs mid', `${f(cost, 1)} bp`)),
      r.complete ? h('p', { class: 'small' }, `Fills: ${r.fills.map((x) => `${f(x.qty, 0)} at ${f(x.price)}`).join(', ')}. Highlighted rows were used.`) : h('p', { class: 'callout warn small' }, 'Not enough shares on this side of the book to fill the whole order.'));
  };
  [side, q.inp].forEach((x) => x.addEventListener('change', draw));
  q.inp.addEventListener('input', draw);
  draw();
  return frame(w.title || 'Walk the order book',
    h('div', { class: 'grid two' }, h('div', { class: 'field' }, h('label', { for: side.id }, 'Order'), side), q.el), out,
    h('p', { class: 'small muted' }, 'Book from Worked example 12.1. A market order takes the best prices first; bigger orders reach worse prices.'));
}
const res = (k, v) => h('div', { class: 'result' }, h('div', { class: 'k' }, k), h('div', { class: 'v' }, v));

// ------------------------------------------------------------------ T-bill auction (M11 WE 11.2)
function auction(w) {
  const d = { offered: 1000, bids: [{ yield: 7.2, amount: 300 }, { yield: 7.25, amount: 400 }, { yield: 7.3, amount: 500 }, { yield: 7.35, amount: 200 }], ...w.defaults };
  const off = numField('Amount offered (millions)', d.offered, { id: nid('off'), step: 50, min: 0 });
  const amts = d.bids.map((b) => numField(`Bids at ${f(b.yield)}% (millions)`, b.amount, { id: nid('b'), step: 50, min: 0 }));
  const out = h('div');
  const draw = () => {
    const bids = d.bids.map((b, i) => ({ yield: b.yield, amount: Number(amts[i].inp.value) }));
    const r = calc.auction(bids, Number(off.inp.value));
    setKids(out, 
      table('Allotment', ['Yield bid', 'Amount bid', 'Allotted', 'Share filled'], r.allocations.map((a) => [`${f(a.yield)}%`, f(a.amount, 0), f(a.allotted, 0), `${f(a.fill * 100, 0)}%`]), (i) => (r.allocations[i].fill > 0 && r.allocations[i].fill < 1 ? 'hit' : '')),
      h('div', { class: 'results', role: 'status', 'aria-live': 'polite' }, res('Clearing yield', r.clearingYield == null ? '—' : `${f(r.clearingYield)}%`), res('Bid-to-cover', f(r.bidToCover)), res('Pro-rata at clearing', `${f(r.proRata * 100, 0)}%`)),
      barChart({ bars: r.allocations.map((a) => ({ label: `${f(a.yield)}%`, value: a.allotted })), title: 'Amount allotted by yield bid', desc: 'Lowest-yield (highest-price) bids fill first; the clearing level is filled pro rata.', yLabel: 'Allotted (m)', height: 220 }),
      h('p', { class: 'small' }, `Uniform-price auction: every winner earns ${r.clearingYield == null ? 'the clearing yield' : `${f(r.clearingYield)}%`}. Multiple-price auction: each winner earns the yield it bid.`));
  };
  [off.inp, ...amts.map((x) => x.inp)].forEach((x) => x.addEventListener('change', draw));
  draw();
  return frame(w.title || 'Run a Treasury-bill auction', h('div', { class: 'grid two' }, off.el, ...amts.map((x) => x.el)), out,
    h('p', { class: 'small muted' }, 'Starts at Worked example 11.2. Lower yields mean higher prices, so they are filled first.'));
}

// ------------------------------------------------------------------ CCP netting (M12 WE 12.4)
function netting(w) {
  const d = { trades: [{ buyer: 'A', seller: 'B', qty: 1000 }, { buyer: 'B', seller: 'C', qty: 800 }, { buyer: 'C', seller: 'A', qty: 600 }], price: 50, ...w.defaults };
  const fields = d.trades.map((t) => numField(`${t.buyer} buys from ${t.seller} (shares)`, t.qty, { id: nid('t'), step: 100, min: 0 }));
  const out = h('div');
  const draw = () => {
    const trades = d.trades.map((t, i) => ({ ...t, qty: Number(fields[i].inp.value) }));
    const r = calc.netting(trades);
    setKids(out, 
      h('div', { class: 'results', role: 'status', 'aria-live': 'polite' }, res('Without netting', `${f(r.gross, 0)} shares`), res('With a CCP', `${f(r.moved, 0)} shares`), res('Reduction', `${f(r.reduction * 100, 0)}%`), res('Cash at ' + d.price, `${f(r.gross * d.price, 0)} → ${f(r.moved * d.price, 0)}`)),
      table('Net positions', ['Broker', 'Net shares', 'Action'], Object.entries(r.net).map(([b, v]) => [b, f(v, 0), v > 0 ? 'receives' : v < 0 ? 'delivers' : 'nothing moves'])),
      barChart({ bars: [{ label: 'Gross (no netting)', value: r.gross }, { label: 'Net (through CCP)', value: r.moved, alt: true }], title: 'Shares that must move', desc: `Netting cuts the shares to settle from ${f(r.gross, 0)} to ${f(r.moved, 0)}.`, yLabel: 'Shares', height: 220 }));
  };
  fields.forEach((x) => x.inp.addEventListener('change', draw));
  draw();
  return frame(w.title || 'See netting at work', h('div', { class: 'grid three' }, ...fields.map((x) => x.el)), out, h('p', { class: 'small muted' }, 'Starts at Worked example 12.4, with all trades at 50.'));
}

// ------------------------------------------------------------------ settlement dates (M12 WE 12.5)
function settlement(w) {
  const d = { trade: '2026-10-08', holidays: ['2026-10-12'], ...w.defaults };
  const date = h('input', { type: 'date', id: nid('d'), value: d.trade });
  const hol = h('input', { type: 'text', id: nid('h'), value: '', placeholder: 'e.g. 2026-10-12, 2026-12-25' });
  const useHol = h('input', { type: 'checkbox', id: nid('uh'), style: { width: '22px', height: '22px' } });
  const out = h('div', { role: 'status', 'aria-live': 'polite' });
  const draw = () => {
    const t = new Date(`${date.value}T00:00:00Z`);
    if (Number.isNaN(t.getTime())) return;
    const hs = [...(useHol.checked ? d.holidays : []), ...hol.value.split(/[,\s]+/).filter(Boolean)].map((x) => new Date(`${x}T00:00:00Z`)).filter((x) => !Number.isNaN(x.getTime()));
    const fmt = (dt) => dt.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    setKids(out, table('Settlement dates', ['Cycle', 'Settles on'], [1, 2, 3].map((n) => [`T+${n}`, fmt(calc.addBusinessDays(t, n, hs))])),
      h('p', { class: 'small' }, `Trade date: ${fmt(t)}. Weekends${hs.length ? ' and the listed holidays' : ''} are skipped.`));
  };
  [date, hol, useHol].forEach((x) => x.addEventListener('change', draw));
  draw();
  return frame(w.title || 'Work out settlement dates',
    h('div', { class: 'grid two' }, h('div', { class: 'field' }, h('label', { for: date.id }, 'Trade date'), date), h('div', { class: 'field' }, h('label', { for: hol.id }, 'Extra public holidays (YYYY-MM-DD)'), hol)),
    h('label', { class: 'row small', for: useHol.id }, useHol, 'Treat Monday 12 October 2026 as a holiday (as in Worked example 12.5)'), out);
}
