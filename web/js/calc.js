// GCM-101 calculation library. Pure functions, no DOM. Shared by the app (calculators, quiz
// generators, diagrams) and by the verification tests that check every worked-example answer
// in the syllabus. Rates are decimals (0.08 = 8%) unless a parameter name says "pct".

// ------------------------------------------------------------------ numeracy (M0)
export const ppChange = (from, to) => to - from; // percentage points
export const toBp = (points) => points * 100;
export const pctChange = (from, to) => (to - from) / from;
export const compound = (start, ...changes) => changes.reduce((v, c) => v * (1 + c), start);
export const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
export function variance(xs, sample = true) {
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - (sample ? 1 : 0));
}
export const stdev = (xs, sample = true) => Math.sqrt(variance(xs, sample));
export function covariance(xs, ys, sample = true) {
  const mx = mean(xs);
  const my = mean(ys);
  return xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / (xs.length - (sample ? 1 : 0));
}
export const correlation = (xs, ys) => covariance(xs, ys) / (stdev(xs) * stdev(ys));

// ------------------------------------------------------------------ economy (M3)
export const realRate = (nominal, inflation) => (1 + nominal) / (1 + inflation) - 1;

// ------------------------------------------------------------------ time value of money (M4)
export const fv = (pv, r, n) => pv * (1 + r) ** n;
export const pv = (fvAmount, r, n) => fvAmount / (1 + r) ** n;
export const discountFactor = (r, n) => 1 / (1 + r) ** n;
export const ear = (nominal, m) => (1 + nominal / m) ** m - 1;
export const annuityFactor = (r, n) => (1 - (1 + r) ** -n) / r;
export const annuityPv = (pmt, r, n) => pmt * annuityFactor(r, n);
export const perpetuity = (pmt, r) => pmt / r;
export const npv = (rate, cashflows) => cashflows.reduce((s, cf, t) => s + cf / (1 + rate) ** t, 0);
export const rule72 = (ratePct) => 72 / ratePct;
export const doublingTime = (r) => Math.log(2) / Math.log(1 + r);

// Robust root finder (bisection with a final secant polish); f(lo) and f(hi) must differ in sign.
export function solve(f, lo, hi, tol = 1e-12, maxIter = 300) {
  let flo = f(lo);
  let fhi = f(hi);
  if (flo === 0) return lo;
  if (fhi === 0) return hi;
  if (flo * fhi > 0) throw new RangeError('Root not bracketed');
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < tol || (hi - lo) / 2 < tol) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}
export const irr = (cashflows) => solve((r) => npv(r, cashflows), -0.99, 1.0);

// ------------------------------------------------------------------ money markets (M5)
export const tbillPrice = (face, discount, days, basis = 360) => face * (1 - (discount * days) / basis);
export const moneyMarketYield = (face, price, days, basis = 360) => (face / price - 1) * (basis / days);
export const holdingReturn = (face, price) => face / price - 1;
export const repoInterest = (cash, rate, days, basis = 365) => (cash * rate * days) / basis;
export const repoHaircut = (collateral, cash) => (collateral - cash) / collateral;

// ------------------------------------------------------------------ bonds (M6, M13)
export const currentYield = (annualCoupon, price) => annualCoupon / price;
export function bondPrice(face, couponRate, ytm, years, freq = 1) {
  const c = (face * couponRate) / freq;
  const y = ytm / freq;
  const n = Math.round(years * freq);
  let p = 0;
  for (let k = 1; k <= n; k++) p += c / (1 + y) ** k;
  return p + face / (1 + y) ** n;
}
export const bondYtm = (price, face, couponRate, years, freq = 1) =>
  solve((y) => bondPrice(face, couponRate, y, years, freq) - price, 1e-9, 1.0);
export const zeroPrice = (face, y, years) => face / (1 + y) ** years;
export const accruedInterest = (couponPerPeriod, daysSince, daysInPeriod) => (couponPerPeriod * daysSince) / daysInPeriod;
export function bondRisk(face, couponRate, ytm, years) {
  // annual coupons
  let price = 0;
  let tw = 0;
  let cx = 0;
  const rows = [];
  for (let t = 1; t <= years; t++) {
    const cf = face * couponRate + (t === years ? face : 0);
    const df = 1 / (1 + ytm) ** t;
    const v = cf * df;
    rows.push({ t, cf, df, pv: v, tpv: t * v });
    price += v;
    tw += t * v;
    cx += t * (t + 1) * v;
  }
  const macaulay = tw / price;
  const modified = macaulay / (1 + ytm);
  const convexity = cx / (price * (1 + ytm) ** 2);
  return { price, macaulay, modified, convexity, dv01: modified * price * 0.0001, rows };
}
export const durationEstimate = (modified, price, dy, convexity = 0) =>
  (-modified * dy + 0.5 * convexity * dy * dy) * price;
export const forwardRate = (s1, s2) => (1 + s2) ** 2 / (1 + s1) - 1;
export const impliedDefault = (spread, lgd) => spread / lgd;

// ------------------------------------------------------------------ equities (M7)
export const marketCap = (shares, price) => shares * price;
export const dividendYield = (dividend, price) => dividend / price;
export function rightsIssue(held, price, newShares, subPrice) {
  const terp = (held * price + newShares * subPrice) / (held + newShares);
  return { terp, rightValue: terp - subPrice, check: held * terp + (terp - subPrice) * newShares };
}
export const splitPrice = (price, ratio) => price / ratio;
export function indexReturns(stocks) {
  // stocks: [{before, after, shares}]
  const sum = (f) => stocks.reduce((s, x) => s + f(x), 0);
  return {
    priceWeighted: sum((s) => s.after) / sum((s) => s.before) - 1,
    capWeighted: sum((s) => s.after * s.shares) / sum((s) => s.before * s.shares) - 1,
    equalWeighted: sum((s) => s.after / s.before - 1) / stocks.length,
  };
}

// ------------------------------------------------------------------ foreign exchange (M8)
export function fxRoundTrip(amount, bid, ask) {
  return { buyCost: amount * ask, sellProceeds: amount * bid, roundTrip: amount * (ask - bid) };
}
export const crossRate = (aPerB, bPerC) => aPerB * bPerC;
export const fxForward = (spot, rQuote, rBase, years = 1) => (spot * (1 + rQuote * years)) / (1 + rBase * years);
export const forwardPoints = (forward, spot, pip = 0.0001) => (forward - spot) / pip;
export const foreignReturn = (localReturn, fxStart, fxEnd) => ((1 + localReturn) * fxStart) / fxEnd - 1;

// ------------------------------------------------------------------ derivatives (M9)
export function futuresMargin(settles, contracts, multiplier, initialPer, maintenancePer) {
  const initial = initialPer * contracts;
  const maintenance = maintenancePer * contracts;
  let balance = initial;
  const rows = [{ day: 0, settle: settles[0], change: null, pnl: null, balance, call: 0 }];
  let totalCalls = 0;
  for (let d = 1; d < settles.length; d++) {
    const change = settles[d] - settles[d - 1];
    const pnl = change * multiplier * contracts;
    balance += pnl;
    const call = balance < maintenance ? initial - balance : 0;
    rows.push({ day: d, settle: settles[d], change, pnl, balance, call });
    totalCalls += call;
    balance += call;
  }
  const total = (settles[settles.length - 1] - settles[0]) * multiplier * contracts;
  return { rows, total, totalCalls, initial, maintenance };
}
export const callPayoff = (s, k) => Math.max(s - k, 0);
export const putPayoff = (s, k) => Math.max(k - s, 0);
export const optionProfit = (s, k, premium, type = 'call', position = 'long') => {
  const p = (type === 'call' ? callPayoff(s, k) : putPayoff(s, k)) - premium;
  return position === 'long' ? p : -p;
};
export const breakEven = (k, premium, type = 'call') => (type === 'call' ? k + premium : k - premium);
export const swapAllIn = (ref, loanMargin, fixedPaid) => ref + loanMargin - ref + fixedPaid;
export const cds = (notional, spreadBp, recovery) => ({ premium: (notional * spreadBp) / 10000, payout: notional * (1 - recovery) });

// ------------------------------------------------------------------ funds (M10)
export const navPerUnit = (assets, liabilities, units) => (assets - liabilities) / units;
export const premiumDiscount = (price, nav) => (price - nav) / nav;
export const growthAfterFees = (start, gross, fee, years) => start * (1 + gross - fee) ** years;

// ------------------------------------------------------------------ primary markets (M11)
export function ipo(shares, price, feeRate, firstClose) {
  const gross = shares * price;
  const fees = gross * feeRate;
  return { gross, fees, net: gross - fees, firstDay: firstClose / price - 1, leftOnTable: shares * (firstClose - price) };
}
export function auction(bids, offered) {
  // bids: [{yield, amount}]; lowest yield (highest price) filled first
  const sorted = [...bids].sort((a, b) => a.yield - b.yield);
  let remaining = offered;
  const out = [];
  let clearing = null;
  let proRata = 1;
  const levels = [...new Set(sorted.map((b) => b.yield))];
  for (const y of levels) {
    const at = sorted.filter((b) => b.yield === y);
    const total = at.reduce((s, b) => s + b.amount, 0);
    if (remaining <= 0) { at.forEach((b) => out.push({ ...b, allotted: 0, fill: 0 })); continue; }
    const fill = Math.min(1, remaining / total);
    at.forEach((b) => out.push({ ...b, allotted: b.amount * fill, fill }));
    remaining -= total * fill;
    clearing = y;
    if (fill < 1) proRata = fill;
  }
  const totalBids = bids.reduce((s, b) => s + b.amount, 0);
  return { allocations: out, clearingYield: clearing, proRata, bidToCover: totalBids / offered };
}

// ------------------------------------------------------------------ secondary markets (M12)
export const spreadBp = (bid, ask) => ((ask - bid) / ((ask + bid) / 2)) * 10000;
export function walkBook(levels, qty) {
  // levels: [{price, qty}] best first
  let filled = 0;
  let cost = 0;
  const fills = [];
  for (const l of levels) {
    const take = Math.min(l.qty, qty - filled);
    if (take <= 0) break;
    filled += take;
    cost += take * l.price;
    fills.push({ price: l.price, qty: take });
  }
  return { filled, cost, avg: filled ? cost / filled : NaN, fills, complete: filled === qty };
}
export function shortSale(qty, sellPrice, buyPrice, feeRate, months) {
  const gain = qty * (sellPrice - buyPrice);
  const fee = qty * sellPrice * feeRate * (months / 12);
  return { gain, fee, profit: gain - fee };
}
export const marginEquityRatio = (shares, price, loan) => (shares * price - loan) / (shares * price);
export const marginCallPrice = (shares, loan, maintenance) => loan / (shares * (1 - maintenance));
export function netting(trades) {
  // trades: [{buyer, seller, qty}]
  const net = {};
  for (const t of trades) {
    net[t.buyer] = (net[t.buyer] || 0) + t.qty;
    net[t.seller] = (net[t.seller] || 0) - t.qty;
  }
  const gross = trades.reduce((s, t) => s + t.qty, 0);
  const moved = Object.values(net).filter((v) => v > 0).reduce((s, v) => s + v, 0);
  return { net, gross, moved, reduction: 1 - moved / gross };
}
export function addBusinessDays(date, n, holidays = []) {
  const hol = new Set(holidays.map((d) => isoDate(d)));
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  let added = 0;
  while (added < n) {
    d.setUTCDate(d.getUTCDate() + 1);
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6 && !hol.has(isoDate(d))) added++;
  }
  return d;
}
export const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10));

// ------------------------------------------------------------------ equity valuation (M14)
export function ratios({ netIncome, dividends, equity, netDebt, shares, price, ebit, depreciation }) {
  const eps = netIncome / shares;
  const dps = dividends / shares;
  const bvps = equity / shares;
  const payout = dividends / netIncome;
  const roe = netIncome / equity;
  const cap = shares * price;
  const ebitda = ebit + depreciation;
  return {
    eps, dps, payout, roe, bvps, sustainableGrowth: roe * (1 - payout),
    pe: price / eps, pb: price / bvps, dividendYield: dps / price,
    ebitda, marketCap: cap, ev: cap + netDebt, evEbitda: (cap + netDebt) / ebitda,
  };
}
export const capm = (rf, beta, erp) => rf + beta * erp;
export const gordon = (d0, g, k) => (d0 * (1 + g)) / (k - g);
export const impliedGrowth = (p0, k, d0) => (p0 * k - d0) / (p0 + d0);
export function twoStage(d0, g1, n, g2, k) {
  let d = d0;
  let pvStage1 = 0;
  for (let t = 1; t <= n; t++) {
    d *= 1 + g1;
    pvStage1 += d / (1 + k) ** t;
  }
  const terminal = (d * (1 + g2)) / (k - g2);
  const pvTerminal = terminal / (1 + k) ** n;
  return { value: pvStage1 + pvTerminal, pvStage1, terminal, pvTerminal, terminalShare: pvTerminal / (pvStage1 + pvTerminal) };
}
export function dcfEquity(fcfe, k, g) {
  const pvs = fcfe.map((cf, i) => cf / (1 + k) ** (i + 1));
  const pvSum = pvs.reduce((s, x) => s + x, 0);
  const terminal = (fcfe[fcfe.length - 1] * (1 + g)) / (k - g);
  const pvTerminal = terminal / (1 + k) ** fcfe.length;
  return { pvs, pvSum, terminal, pvTerminal, value: pvSum + pvTerminal };
}
export function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// ------------------------------------------------------------------ derivative valuation (M15)
export const forwardPrice = (spot, r, t, q = 0) => (spot * (1 + r) ** t) / (1 + q) ** t;
export function binomialOneStep(s, k, u, d, growth, type = 'call') {
  const pay = (x) => (type === 'call' ? Math.max(x - k, 0) : Math.max(k - x, 0));
  const cu = pay(s * u);
  const cd = pay(s * d);
  const p = (growth - d) / (u - d);
  const delta = (cu - cd) / (s * u - s * d);
  const borrow = (delta * s * d - cd) / growth;
  return { p, cu, cd, delta, borrow, value: (p * cu + (1 - p) * cd) / growth };
}
// Standard normal CDF via the Numerical Recipes erfc Chebyshev approximation (|error| < 1.2e-7).
export function normCdf(x) {
  const z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? 1 - r / 2 : r / 2;
}
// Inverse standard normal (Acklam's algorithm, refined with one Newton step).
export function normInv(p) {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let x;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const e = normCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}
export function blackScholes(s, k, t, r, sigma) {
  const d1 = (Math.log(s / k) + (r + (sigma * sigma) / 2) * t) / (sigma * Math.sqrt(t));
  const d2 = d1 - sigma * Math.sqrt(t);
  const disc = k * Math.exp(-r * t);
  return {
    d1, d2, nd1: normCdf(d1), nd2: normCdf(d2), pvStrike: disc,
    call: s * normCdf(d1) - disc * normCdf(d2),
    put: disc * normCdf(-d2) - s * normCdf(-d1),
  };
}
export function parSwap(spotRates) {
  const dfs = spotRates.map((z, i) => 1 / (1 + z) ** (i + 1));
  const sum = dfs.reduce((s, x) => s + x, 0);
  return { dfs, annuity: sum, rate: (1 - dfs[dfs.length - 1]) / sum };
}
export function swapValueToFixedPayer(notional, fixedRate, spotRates) {
  const { dfs, annuity } = parSwap(spotRates);
  const fixedLeg = notional * fixedRate * annuity + notional * dfs[dfs.length - 1];
  return notional - fixedLeg;
}

// ------------------------------------------------------------------ risk & return (M16)
export const hpr = (p0, p1, income = 0) => (p1 - p0 + income) / p0;
export const geometricMean = (returns) => returns.reduce((g, r) => g * (1 + r), 1) ** (1 / returns.length) - 1;
export const portfolioReturn = (w, ra, rb) => w * ra + (1 - w) * rb;
export const portfolioSd = (w, sa, sb, rho) =>
  Math.sqrt(w * w * sa * sa + (1 - w) ** 2 * sb * sb + 2 * w * (1 - w) * rho * sa * sb);
export const beta = (stock, market) => covariance(stock, market) / variance(market);
export const sharpe = (rp, rf, sd) => (rp - rf) / sd;
export const jensenAlpha = (rp, rf, b, rm) => rp - (rf + b * (rm - rf));

// ------------------------------------------------------------------ risk management (M17)
export const parametricVar = (value, sd, z) => value * z * sd;
export const scaleVar = (oneDay, days) => oneDay * Math.sqrt(days);
export function historicalVar(returnsPct, confidence, value) {
  const sorted = [...returnsPct].sort((a, b) => a - b);
  const n = Math.floor((1 - confidence) * sorted.length + 1e-9);
  const tail = sorted.slice(0, n);
  const varPct = -tail[tail.length - 1];
  const esPct = -tail.reduce((s, x) => s + x, 0) / tail.length;
  return { tail, varPct, esPct, var: (varPct / 100) * value, es: (esPct / 100) * value };
}
export const expectedLoss = (pd, lgd, ead) => pd * lgd * ead;
export const netExposure = (mtm, collateral) => Math.max(mtm - collateral, 0);
export const repoCapacity = (bonds, haircut, priceFall = 0) => bonds * (1 - priceFall) * (1 - haircut);

// ------------------------------------------------------------------ global markets (M19)
export const turnoverRatio = (valueTraded, marketCapAvg) => valueTraded / marketCapAvg;

// ------------------------------------------------------------------ small composites used by quiz items
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const mul = (a, b) => a * b;
export const pctAbove = (x, p) => x * (1 + p);
export const pctBelow = (x, p) => x * (1 - p);
export const pctOf = (x, p) => x * p;
export const sustainableGrowth = (roe, payout) => roe * (1 - payout);
export const dv01 = (modified, price) => modified * price * 0.0001;
export const capmMarket = (rf, b, rm) => rf + b * (rm - rf);
export const bpChange = (fromPct, toPct) => (toPct - fromPct) * 100;
export const shareOutside = (total, share) => total * (1 - share);
export const repurchasePrice = (cash, rate, days, basis = 365) => cash + repoInterest(cash, rate, days, basis);
export const futuresPnl = (entry, exit, multiplier, contracts) => (exit - entry) * multiplier * contracts;
export const marginCall = (balance, maintenance, initial) => (balance < maintenance ? initial - balance : 0);
export const feeGap = (start, gross, feeA, feeB, years) => growthAfterFees(start, gross, feeA, years) - growthAfterFees(start, gross, feeB, years);
export const bidToCover = (totalBids, offered) => totalBids / offered;
export const dirtyPrice = (clean, couponPerPeriod, daysSince, daysInPeriod) => clean + accruedInterest(couponPerPeriod, daysSince, daysInPeriod);
export const ytmPct = (price, face, couponRate, years, freq = 1) => bondYtm(price, face, couponRate, years, freq);
export const zeroCost = (cost, cfs, r) => npv(r, [-cost, ...cfs]);
export const projectIrr = (cost, cfs) => irr([-cost, ...cfs]);
export const twoStageValue = (d0, g1, n, g2, k) => twoStage(d0, g1, n, g2, k).value;
export const dcfValuePerShare = (fcfe, k, g, shares) => dcfEquity(fcfe, k, g).value / shares;
export const relativeValue = (eps, peers) => eps * median(peers);
export const parSwapRate = (spots) => parSwap(spots).rate;
export const binomialCall = (s, k, u, d, growth) => binomialOneStep(s, k, u, d, growth, 'call').value;
export const riskNeutralP = (u, d, growth) => (growth - d) / (u - d);
export const bsCall = (s, k, t, r, sigma) => blackScholes(s, k, t, r, sigma).call;
export const bsPut = (s, k, t, r, sigma) => blackScholes(s, k, t, r, sigma).put;
export const varDays = (value, sd, z, days) => scaleVar(parametricVar(value, sd, z), days);
export const walkAvg = (levels, qty) => walkBook(levels, qty).avg;
export const nettingReduction = (trades) => netting(trades).reduction;
export const auctionProRata = (bids, offered) => auction(bids, offered).proRata;

// ------------------------------------------------------------------ composites used by explorers and diagrams
export const upDownChange = (u) => (1 + u) * (1 - u) - 1;
export const realApprox = (nominal, inflation) => nominal - inflation;
export function tbillYields(face, discount, days) {
  const price = tbillPrice(face, discount, days, 360);
  return { price, mmy: moneyMarketYield(face, price, days, 360), bey: moneyMarketYield(face, price, days, 365), period: holdingReturn(face, price) };
}
export function repoTrade(cash, rate, days, collateral) {
  const interest = repoInterest(cash, rate, days, 365);
  return { interest, repurchase: cash + interest, haircut: repoHaircut(collateral, cash) };
}
export function hedgeCompare(usd, forward, spotEnd) {
  return { hedged: usd * forward, unhedged: usd * spotEnd, saving: usd * (spotEnd - forward) };
}
export const durationLossPct = (modified, dy) => -modified * dy;
export function liquidityCheck(cash, bonds, haircut, priceFall, call) {
  const capacity = repoCapacity(bonds, haircut, priceFall);
  return { capacity, available: cash + capacity, buffer: cash + capacity - call };
}
export const normPdf = (x, mu = 0, sd = 1) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
export function fundPair(start, gross, feeA, feeB, years) {
  const a = growthAfterFees(start, gross, feeA, years);
  const b = growthAfterFees(start, gross, feeB, years);
  return { a, b, gap: a - b };
}
export function navCheck(assets, liabilities, units, price) {
  const nav = navPerUnit(assets, liabilities, units);
  return { nav, pd: premiumDiscount(price, nav) };
}
export function marginPosition(shares, price, loan, maintenance) {
  return { equity: shares * price - loan, ratio: marginEquityRatio(shares, price, loan), callPrice: marginCallPrice(shares, loan, maintenance) };
}
export function forwardArb(spot, r, q, quoted) {
  const fair = forwardPrice(spot, r, 1, q);
  return { fair, profit: quoted - fair };
}
export function projectNpvIrr(cost, a, b, c2, r) {
  const cfs = [-cost, a, b, c2];
  let i = NaN;
  try { i = irr(cfs); } catch { /* no root */ }
  return { npv: npv(r, cfs), irr: i };
}
export const dcfPerShare = (a, b, c2, d, e, k, g, shares) => dcfEquity([a, b, c2, d, e], k, g).value / shares;
export const parSwap3 = (z1, z2, z3) => parSwap([z1, z2, z3]).rate;
export const indexThree = (a1, b1) => indexReturns([{ before: 100, after: a1, shares: 10 }, { before: 20, after: b1, shares: 200 }, { before: 50, after: 50, shares: 40 }]);
export const arithmeticMean2 = (a, b) => (a + b) / 2;
export const geometricMean2 = (a, b) => geometricMean([a, b]);
export const ipoFigures = ipo;

// ------------------------------------------------------------------ helpers
export const round = (x, dp = 2) => {
  const f = 10 ** dp;
  return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f;
};
// Tolerance check used by the quiz engine: within ±tol (relative) of the answer, or within half a
// unit of the last decimal shown in the model answer (so a correctly rounded answer always passes).
export function withinTolerance(given, answer, tol = 0.005, decimals = 2) {
  if (!Number.isFinite(given)) return false;
  const rel = Math.abs(answer) * tol;
  const roundingSlack = 0.5 * 10 ** -decimals + 1e-12;
  return Math.abs(given - answer) <= Math.max(rel, roundingSlack);
}
