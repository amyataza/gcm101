// Every numeric answer printed in the syllabus's worked examples, recomputed with web/js/calc.js.
// Each entry: module, example id, what is checked, the value exactly as displayed in the syllabus,
// a function computing it, and a scale (100 when the display is a percentage).
// `display` must appear verbatim in the extracted example text, so a syllabus edit that changes a
// number makes the test fail until this table (and any quiz generator using it) is reviewed.

import * as c from '../../web/js/calc.js';

const zFirmTable = { 0.95: 1.645, 0.99: 2.326 }; // syllabus uses table z-values
const Z = { name: 'Company Z', netIncome: 135, dividends: 81, equity: 900, netDebt: 200, shares: 50, price: 32.4, ebit: 200, depreciation: 40 };
const zr = c.ratios(Z);
const br = c.bondRisk(1000, 0.08, 0.1, 5);
const fm = c.futuresMargin([70000, 70400, 69500, 69300, 70100], 2, 10, 25000, 20000);
const auc = c.auction([{ yield: 7.2, amount: 300 }, { yield: 7.25, amount: 400 }, { yield: 7.3, amount: 500 }, { yield: 7.35, amount: 200 }], 1000);
const asks = [{ price: 50.1, qty: 2000 }, { price: 50.15, qty: 3000 }, { price: 50.25, qty: 5000 }];
const book = c.walkBook(asks, 4000);
const net = c.netting([{ buyer: 'A', seller: 'B', qty: 1000 }, { buyer: 'B', seller: 'C', qty: 800 }, { buyer: 'C', seller: 'A', qty: 600 }]);
const ts = c.twoStage(1.0, 0.15, 3, 0.05, 0.12);
const dcf = c.dcfEquity([50, 55, 60, 64, 67], 0.13, 0.05);
const bin = c.binomialOneStep(100, 100, 1.1, 0.9, 1.05);
const binPut = c.binomialOneStep(100, 100, 1.1, 0.9, 1.05, 'put');
const bs = c.blackScholes(100, 100, 1, 0.05, 0.2);
const ps = c.parSwap([0.06, 0.065, 0.07]);
const hv = c.historicalVar([-2.1, 0.4, 1.2, -0.8, 0.3, -1.5, 0.9, 0.2, -0.4, 1.1, -3.0, 0.6, 0.1, -0.9, 0.7, -1.2, 0.5, 0.8, -0.3, 1.0], 0.9, 1_000_000);
const mkt = [0.02, -0.01, 0.03, -0.02, 0.01, 0.03];
const shr = [0.03, -0.02, 0.04, -0.03, 0.01, 0.05];
const betaEst = c.beta(shr, mkt);
const idx = c.indexReturns([{ before: 100, after: 110, shares: 10e6 }, { before: 20, after: 19, shares: 200e6 }, { before: 50, after: 50, shares: 40e6 }]);
const interp = 0.06 + ((c.bondPrice(100, 0.05, 0.06, 4) - 95) / (c.bondPrice(100, 0.05, 0.06, 4) - c.bondPrice(100, 0.05, 0.07, 4))) * 0.01;
const d = (s) => new Date(`${s}T00:00:00Z`);

export const answers = [
  // M0
  ['m0', 'we-0.1', 'Percentage-point change', '0.75 percentage points', () => c.ppChange(7.5, 8.25)],
  ['m0', 'we-0.1', 'Basis points', '75 bp', () => c.toBp(c.ppChange(7.5, 8.25))],
  ['m0', 'we-0.1', 'Relative change', '10%', () => c.pctChange(7.5, 8.25), 100],
  ['m0', 'we-0.2', 'Up 10% then down 10%', '99', () => c.compound(100, 0.1, -0.1)],
  ['m0', 'we-0.3', 'Mean return', '1%', () => c.mean([0.02, -0.01, 0.03, 0, 0.01]), 100],
  ['m0', 'we-0.3', 'Sample variance (%²)', '2.5', () => c.variance([2, -1, 3, 0, 1])],
  ['m0', 'we-0.3', 'Sample standard deviation', '1.58%', () => c.stdev([0.02, -0.01, 0.03, 0, 0.01]), 100],
  // M1
  ['m1', 'case-1.1', 'Non-US equity (US$ tn)', '88.8 trillion', () => 157.8 * (1 - 0.437)],
  ['m1', 'case-1.1', 'Non-US bonds (US$ tn)', '99.5 trillion', () => 160.7 * (1 - 0.381)],
  // M3
  ['m3', 'we-3.1', 'Real interest rate', '4.76%', () => c.realRate(0.1, 0.05), 100],
  // M4
  ['m4', 'we-4.1', 'Growth factor 1.08^5', '1.469328', () => 1.08 ** 5],
  ['m4', 'we-4.1', 'Future value', '14,693.28', () => c.fv(10000, 0.08, 5)],
  ['m4', 'we-4.2', '1.06^3', '1.191016', () => 1.06 ** 3],
  ['m4', 'we-4.2', 'Present value', '839.62', () => c.pv(1000, 0.06, 3)],
  ['m4', 'we-4.3', 'Effective annual rate', '12.68%', () => c.ear(0.12, 12), 100],
  ['m4', 'we-4.4', '1.07^−5', '0.712986', () => 1.07 ** -5],
  ['m4', 'we-4.4', 'Annuity factor', '4.100197', () => c.annuityFactor(0.07, 5)],
  ['m4', 'we-4.4', 'Annuity PV', '4,100.20', () => c.annuityPv(1000, 0.07, 5)],
  ['m4', 'we-4.5', 'Perpetuity', '625', () => c.perpetuity(50, 0.08)],
  ['m4', 'we-4.6', 'PV year 1', '2,727.27', () => 3000 / 1.1],
  ['m4', 'we-4.6', 'PV year 2', '3,305.79', () => 4000 / 1.21],
  ['m4', 'we-4.6', 'PV year 3', '3,756.57', () => 5000 / 1.331],
  ['m4', 'we-4.6', 'NPV at 10%', '210.37', () => -c.npv(0.1, [-10000, 3000, 4000, 5000])],
  ['m4', 'we-4.6', 'NPV at 8%', '176.29', () => c.npv(0.08, [-10000, 3000, 4000, 5000])],
  ['m4', 'we-4.6', 'IRR', '8.90%', () => c.irr([-10000, 3000, 4000, 5000]), 100],
  ['m4', 'we-4.7', 'Rule of 72', '9 years', () => c.rule72(8)],
  ['m4', 'we-4.7', 'Exact doubling time', '9.01 years', () => c.doublingTime(0.08)],
  // M5
  ['m5', 'we-5.1', 'Price factor', '0.989889', () => 1 - (0.04 * 91) / 360],
  ['m5', 'we-5.1', 'T-bill price', '9,898.89', () => c.tbillPrice(10000, 0.04, 91)],
  ['m5', 'we-5.1', '91-day return', '1.0214%', () => c.holdingReturn(10000, c.tbillPrice(10000, 0.04, 91)), 100],
  ['m5', 'we-5.1', 'Money-market yield', '4.04%', () => c.moneyMarketYield(10000, c.tbillPrice(10000, 0.04, 91), 91), 100],
  ['m5', 'we-5.1', 'Bond-equivalent yield', '4.10%', () => c.moneyMarketYield(10000, c.tbillPrice(10000, 0.04, 91), 91, 365), 100],
  ['m5', 'we-5.1', 'TBILLPRICE per 100', '98.98889', () => c.tbillPrice(100, 0.04, 91)],
  ['m5', 'we-5.2', 'Repo interest', '13,424.66', () => c.repoInterest(10_000_000, 0.07, 7)],
  ['m5', 'we-5.2', 'Repurchase price', '10,013,424.66', () => 10_000_000 + c.repoInterest(10_000_000, 0.07, 7)],
  ['m5', 'we-5.2', 'Haircut', '1.96%', () => c.repoHaircut(10_200_000, 10_000_000), 100],
  // M6
  ['m6', 'we-6.2', 'Current yield', '6.32%', () => c.currentYield(6, 95), 100],
  // M7
  ['m7', 'we-7.1', 'Market cap (R billion)', 'R20 billion', () => c.marketCap(400e6, 50) / 1e9],
  ['m7', 'we-7.1', 'Dividend yield', '5%', () => c.dividendYield(2.5, 50), 100],
  ['m7', 'we-7.2', 'TERP', '48', () => c.rightsIssue(4, 50, 1, 40).terp],
  ['m7', 'we-7.2', 'Value of a right', '8', () => c.rightsIssue(4, 50, 1, 40).rightValue],
  ['m7', 'we-7.2', 'Holder check', '200', () => c.rightsIssue(4, 50, 1, 40).check],
  ['m7', 'we-7.3', 'Value after split', '8,000', () => 200 * c.splitPrice(80, 2)],
  ['m7', 'we-7.4', 'Price-weighted', '5.29%', () => idx.priceWeighted, 100],
  ['m7', 'we-7.4', 'Cap-weighted', '1.43%', () => -idx.capWeighted, 100],
  ['m7', 'we-7.4', 'Equal-weighted', '1.67%', () => idx.equalWeighted, 100],
  // M8
  ['m8', 'we-8.1', 'Buy US$10,000', '180,050', () => c.fxRoundTrip(10000, 17.995, 18.005).buyCost],
  ['m8', 'we-8.1', 'Sell US$10,000', '179,950', () => c.fxRoundTrip(10000, 17.995, 18.005).sellProceeds],
  ['m8', 'we-8.1', 'Round-trip cost', 'R100', () => c.fxRoundTrip(10000, 17.995, 18.005).roundTrip],
  ['m8', 'we-8.2', 'EUR/ZAR cross', '19.8000', () => c.crossRate(1.1, 18)],
  ['m8', 'we-8.3', 'Forward rate', '18.6058', () => c.fxForward(18, 0.075, 0.04)],
  ['m8', 'we-8.3', 'Forward points', '6,058 pips', () => c.forwardPoints(c.fxForward(18, 0.075, 0.04), 18)],
  ['m8', 'we-8.4', 'USD return', '4.21%', () => c.foreignReturn(0.1, 18, 19), 100],
  // M9
  ['m9', 'we-9.1', 'Hedged rand cost', 'R18,605,800', () => 1_000_000 * 18.6058],
  ['m9', 'we-9.2', 'Day 1 balance', '58,000', () => fm.rows[1].balance],
  ['m9', 'we-9.2', 'Day 2 balance', '40,000', () => fm.rows[2].balance],
  ['m9', 'we-9.2', 'Day 3 balance', '36,000', () => fm.rows[3].balance],
  ['m9', 'we-9.2', 'Day 3 margin call', '14,000', () => fm.rows[3].call],
  ['m9', 'we-9.2', 'Day 4 balance', '66,000', () => fm.rows[4].balance],
  ['m9', 'we-9.2', 'Total gain', '2,000', () => fm.total],
  ...[[80, '−5', '+16'], [90, '−5', '+6'], [110, '+5', '−4'], [120, '+15', '−4']].flatMap(([s, cp, pp]) => [
    ['m9', 'we-9.3', `Call profit at ${s}`, cp, () => c.optionProfit(s, 100, 5, 'call')],
    ['m9', 'we-9.3', `Put profit at ${s}`, pp, () => c.optionProfit(s, 100, 4, 'put')],
  ]),
  ['m9', 'we-9.3', 'Call break-even', '105', () => c.breakEven(100, 5, 'call')],
  ['m9', 'we-9.3', 'Put break-even', '96', () => c.breakEven(100, 4, 'put')],
  ['m9', 'we-9.4', 'All-in cost at 6%', '9%', () => c.swapAllIn(0.06, 0.02, 0.07), 100],
  ['m9', 'we-9.4', 'All-in cost at 8%', '9%', () => c.swapAllIn(0.08, 0.02, 0.07), 100],
  ['m9', 'we-9.5', 'CDS premium', '150,000', () => c.cds(10_000_000, 150, 0.4).premium],
  ['m9', 'we-9.5', 'CDS payout', '6,000,000', () => c.cds(10_000_000, 150, 0.4).payout],
  // M10
  ['m10', 'we-10.1', 'NAV per unit', '10.00', () => c.navPerUnit(105e6, 5e6, 10e6)],
  ['m10', 'we-10.2', 'Discount', '8%', () => -c.premiumDiscount(9.2, 10), 100],
  ['m10', 'we-10.3', 'Fund A', '37,275.64', () => c.growthAfterFees(10000, 0.07, 0.002, 20)],
  ['m10', 'we-10.3', 'Fund B', '29,177.57', () => c.growthAfterFees(10000, 0.07, 0.015, 20)],
  ['m10', 'we-10.3', 'Difference', '8,098.06', () => c.growthAfterFees(10000, 0.07, 0.002, 20) - c.growthAfterFees(10000, 0.07, 0.015, 20)],
  // M11
  ['m11', 'we-11.1', 'Gross proceeds (R million)', '1,000 million', () => c.ipo(50e6, 20, 0.03, 23).gross / 1e6],
  ['m11', 'we-11.1', 'Fees (R million)', '30 million', () => c.ipo(50e6, 20, 0.03, 23).fees / 1e6],
  ['m11', 'we-11.1', 'Net proceeds (R million)', '970 million', () => c.ipo(50e6, 20, 0.03, 23).net / 1e6],
  ['m11', 'we-11.1', 'First-day return', '15%', () => c.ipo(50e6, 20, 0.03, 23).firstDay, 100],
  ['m11', 'we-11.1', 'Money left on the table (R million)', '150 million', () => c.ipo(50e6, 20, 0.03, 23).leftOnTable / 1e6],
  ['m11', 'we-11.2', 'Pro-rata fill at clearing yield', '60%', () => auc.proRata, 100],
  ['m11', 'we-11.2', 'Clearing yield', '7.30%', () => auc.clearingYield],
  ['m11', 'we-11.2', 'Bid-to-cover', '1.4', () => auc.bidToCover],
  // M12
  ['m12', 'we-12.1', 'Spread', '0.10', () => 50.1 - 50.0],
  ['m12', 'we-12.1', 'Spread in bp (≈)', '20 basis points', () => c.spreadBp(50.0, 50.1), 1, 0],
  ['m12', 'we-12.1', 'Market buy cost', '200,500', () => book.cost],
  ['m12', 'we-12.1', 'Average price', '50.125', () => book.avg],
  ['m12', 'we-12.1', 'Cost vs mid (≈ bp)', '15 basis points', () => ((book.avg - 50.05) / 50.05) * 10000, 1, 0],
  ['m12', 'we-12.2', 'Short-sale gain', '8,000', () => c.shortSale(1000, 60, 52, 0.005, 3).gain],
  ['m12', 'we-12.2', 'Lending fee', '75', () => c.shortSale(1000, 60, 52, 0.005, 3).fee],
  ['m12', 'we-12.2', 'Profit', '7,925', () => c.shortSale(1000, 60, 52, 0.005, 3).profit],
  ['m12', 'we-12.2', 'Loss if price rises to 75', '15,075', () => -c.shortSale(1000, 60, 75, 0.005, 3).profit],
  ['m12', 'we-12.3', 'Equity ratio at 40', '37.5%', () => c.marginEquityRatio(1000, 40, 25000), 100],
  ['m12', 'we-12.3', 'Margin-call price', '35.71', () => c.marginCallPrice(1000, 25000, 0.3)],
  ['m12', 'we-12.4', 'Gross shares', '2,400', () => net.gross],
  ['m12', 'we-12.4', 'Net shares moved', '400', () => net.moved],
  ['m12', 'we-12.4', 'Reduction', '83%', () => net.reduction, 100],
  ['m12', 'we-12.5', 'T+1 settlement', '9 October', () => c.isoDate(c.addBusinessDays(d('2026-10-08'), 1)) === '2026-10-09' ? 9 : NaN],
  ['m12', 'we-12.5', 'T+3 settlement', '13 October', () => c.isoDate(c.addBusinessDays(d('2026-10-08'), 3)) === '2026-10-13' ? 13 : NaN],
  ['m12', 'we-12.5', 'T+3 with Monday holiday', '14 October', () => c.isoDate(c.addBusinessDays(d('2026-10-08'), 3, [d('2026-10-12')])) === '2026-10-14' ? 14 : NaN],
  // M13
  ['m13', 'we-13.1', 'Annuity factor at 10%', '3.790787', () => c.annuityFactor(0.1, 5)],
  ['m13', 'we-13.1', 'PV of coupons', '303.26', () => c.annuityPv(80, 0.1, 5)],
  ['m13', 'we-13.1', 'PV of face', '620.92', () => c.pv(1000, 0.1, 5)],
  ['m13', 'we-13.1', 'Price', '924.18', () => c.bondPrice(1000, 0.08, 0.1, 5)],
  ['m13', 'we-13.1', 'Price per 100', '92.418', () => c.bondPrice(100, 0.08, 0.1, 5)],
  ['m13', 'we-13.2', 'Annuity factor (2.5%, 6)', '5.508125', () => c.annuityFactor(0.025, 6)],
  ['m13', 'we-13.2', 'PV of coupons', '16.52', () => c.annuityPv(3, 0.025, 6)],
  ['m13', 'we-13.2', 'PV of face', '86.23', () => c.pv(100, 0.025, 6)],
  ['m13', 'we-13.2', 'Price', '102.75', () => c.bondPrice(100, 0.06, 0.05, 3, 2)],
  ['m13', 'we-13.3', 'Price at 6%', '96.54', () => c.bondPrice(100, 0.05, 0.06, 4), 1, undefined, '96.53'],
  ['m13', 'we-13.3', 'Price at 7%', '93.23', () => c.bondPrice(100, 0.05, 0.07, 4)],
  ['m13', 'we-13.3', 'Interpolated yield', '6.46%', () => interp, 100],
  ['m13', 'we-13.3', 'Exact YTM', '6.458%', () => c.bondYtm(95, 100, 0.05, 4), 100],
  ['m13', 'we-13.4', 'Zero-coupon price', '50.83', () => c.zeroPrice(100, 0.07, 10)],
  ['m13', 'we-13.5', 'Accrued interest', '0.99', () => c.accruedInterest(3, 60, 182)],
  ['m13', 'we-13.5', 'Dirty price', '103.74', () => c.round(c.bondPrice(100, 0.06, 0.05, 3, 2), 2) + c.accruedInterest(3, 60, 182)],
  ...br.rows.map((r, i) => ['m13', 'we-13.6', `PV year ${r.t}`, ['72.73', '66.12', '60.11', '54.64', '670.60'][i], () => r.pv]),
  ...br.rows.map((r, i) => ['m13', 'we-13.6', `t × PV year ${r.t}`, ['72.73', '132.23', '180.32', '218.56', '3,352.98'][i], () => r.tpv]),
  ['m13', 'we-13.6', 'Σ t × PV', '3,956.81', () => br.rows.reduce((s, r) => s + r.tpv, 0)],
  ['m13', 'we-13.6', 'Macaulay duration', '4.28 years', () => br.macaulay],
  ['m13', 'we-13.6', 'Modified duration', '3.89', () => br.modified],
  ['m13', 'we-13.6', 'DV01', '0.36', () => br.dv01],
  ['m13', 'we-13.6', 'Duration estimate +1%', '35.97', () => -c.durationEstimate(br.modified, br.price, 0.01)],
  ['m13', 'we-13.6', 'Price at 11%', '889.12', () => c.bondPrice(1000, 0.08, 0.11, 5)],
  ['m13', 'we-13.6', 'Actual change +1%', '35.06', () => br.price - c.bondPrice(1000, 0.08, 0.11, 5)],
  ['m13', 'we-13.6', 'Actual change −1%', '36.92', () => c.bondPrice(1000, 0.08, 0.09, 5) - br.price],
  ['m13', 'we-13.6', 'Convexity', '20.10', () => br.convexity],
  ['m13', 'we-13.6', 'Duration + convexity estimate', '35.04', () => -c.durationEstimate(br.modified, br.price, 0.01, c.round(br.convexity, 2))],
  ['m13', 'we-13.7', 'Implied forward rate', '7.00%', () => c.forwardRate(0.06, 0.065), 100],
  ['m13', 'we-13.8', 'Credit spread', '120 bp', () => (0.092 - 0.08) * 10000],
  ['m13', 'we-13.8', 'Implied annual default probability', '2%', () => c.impliedDefault(0.012, 0.6), 100],
  ['m13', 'case-13.1', 'Duration loss estimate', '18%', () => 6 * 0.03, 100],
  // M14
  ['m14', 'we-14.1', 'EPS', '2.70', () => zr.eps],
  ['m14', 'we-14.1', 'Dividend per share', '1.62', () => zr.dps],
  ['m14', 'we-14.1', 'Payout', '60%', () => zr.payout, 100],
  ['m14', 'we-14.1', 'ROE', '15%', () => zr.roe, 100],
  ['m14', 'we-14.1', 'Sustainable growth', '6%', () => zr.sustainableGrowth, 100],
  ['m14', 'we-14.1', 'P/E', '12.0', () => zr.pe],
  ['m14', 'we-14.1', 'Book value per share', '18.00', () => zr.bvps],
  ['m14', 'we-14.1', 'P/B', '1.8', () => zr.pb],
  ['m14', 'we-14.1', 'EBITDA', '240', () => zr.ebitda],
  ['m14', 'we-14.1', 'Market cap', '1,620', () => zr.marketCap],
  ['m14', 'we-14.1', 'EV', '1,820', () => zr.ev],
  ['m14', 'we-14.1', 'EV/EBITDA', '7.6', () => zr.evEbitda],
  ['m14', 'we-14.1', 'Net income from statement', '135', () => (1000 - 760 - 40 - 20) * (1 - 0.25)],
  ['m14', 'we-14.2', 'CAPM cost of equity', '15.2%', () => c.capm(0.08, 1.2, 0.06), 100],
  ['m14', 'we-14.3', 'D1', '2.10', () => 2 * 1.05],
  ['m14', 'we-14.3', 'Gordon value', '35.00', () => c.gordon(2, 0.05, 0.11)],
  ['m14', 'we-14.3', 'Company Z DDM value', '18.67', () => c.gordon(1.62, 0.06, 0.152)],
  ['m14', 'we-14.3', 'Implied growth', '9.7%', () => c.impliedGrowth(32.4, 0.152, 1.62), 100],
  ...[[0.1, ['34.67', '42.00', '53.00']], [0.11, ['29.71', '35.00', '42.40']], [0.12, ['26.00', '30.00', '35.33']]].flatMap(([k, vals]) =>
    [0.04, 0.05, 0.06].map((g, i) => ['m14', 'we-14.4', `k=${k * 100}% g=${g * 100}%`, vals[i], () => c.gordon(2, g, k)])),
  ['m14', 'we-14.5', 'D2', '1.3225', () => 1.15 ** 2],
  ['m14', 'we-14.5', 'D3', '1.5209', () => 1.15 ** 3],
  ['m14', 'we-14.5', 'PV of stage-1 dividends', '3.1636', () => ts.pvStage1],
  ['m14', 'we-14.5', 'D4', '1.5969', () => 1.15 ** 3 * 1.05],
  ['m14', 'we-14.5', 'Terminal value at year 3', '22.8131', () => ts.terminal],
  ['m14', 'we-14.5', 'PV of terminal value', '16.2379', () => ts.pvTerminal],
  ['m14', 'we-14.5', 'Share value', '19.40', () => ts.value],
  ['m14', 'we-14.5', 'Terminal share of value', '84%', () => ts.terminalShare, 100],
  ...dcf.pvs.map((v, i) => ['m14', 'we-14.6', `PV year ${i + 1}`, ['44.25', '43.07', '41.58', '39.25', '36.36'][i], () => v]),
  ['m14', 'we-14.6', 'Sum of PVs', '204.52', () => dcf.pvSum],
  ['m14', 'we-14.6', 'Terminal value', '879.38', () => dcf.terminal],
  ['m14', 'we-14.6', 'PV of terminal value', '477.29', () => dcf.pvTerminal],
  ['m14', 'we-14.6', 'Equity value (millions)', '681.81 million', () => dcf.value],
  ['m14', 'we-14.6', 'Value per share', '6.82 per share', () => dcf.value / 100],
  ['m14', 'we-14.7', 'Median peer P/E', '12', () => c.median([10, 11, 13, 15])],
  ['m14', 'we-14.7', 'Relative value', '48', () => 4 * c.median([10, 11, 13, 15])],
  ['m14', 'we-14.7', 'Implied P/B', '1.6', () => (4 * c.median([10, 11, 13, 15])) / 30],
  // M15
  ['m15', 'we-15.1', 'Fair forward', '106', () => c.forwardPrice(100, 0.06, 1)],
  ['m15', 'we-15.1', 'Arbitrage profit', '2', () => 108 - c.forwardPrice(100, 0.06, 1)],
  ['m15', 'we-15.1', 'Forward with 2% income', '103.92', () => c.forwardPrice(100, 0.06, 1, 0.02)],
  ['m15', 'we-15.2', 'Delta', '0.5', () => bin.delta],
  ['m15', 'we-15.2', 'Amount borrowed', '42.86', () => bin.borrow],
  ['m15', 'we-15.2', 'Call value', '7.14', () => bin.value],
  ['m15', 'we-15.2', 'Risk-neutral probability', '0.75', () => bin.p],
  ['m15', 'we-15.2', 'Put value', '2.38', () => binPut.value],
  ['m15', 'we-15.2', 'Parity check', '4.76', () => 100 - 100 / 1.05],
  ['m15', 'we-15.3', 'd1', '0.35', () => bs.d1],
  ['m15', 'we-15.3', 'd2', '0.15', () => bs.d2],
  ['m15', 'we-15.3', 'N(d1)', '0.6368', () => bs.nd1],
  ['m15', 'we-15.3', 'N(d2)', '0.5596', () => bs.nd2],
  ['m15', 'we-15.3', 'PV of strike', '95.12', () => bs.pvStrike],
  ['m15', 'we-15.3', 'Call', '10.45', () => bs.call],
  ['m15', 'we-15.3', 'Put', '5.57', () => bs.put],
  ['m15', 'we-15.3', 'Parity', '4.88', () => bs.call - bs.put],
  ['m15', 'we-15.5', 'DF 1', '0.943396', () => ps.dfs[0]],
  ['m15', 'we-15.5', 'DF 2', '0.881659', () => ps.dfs[1]],
  ['m15', 'we-15.5', 'DF 3', '0.816298', () => ps.dfs[2]],
  ['m15', 'we-15.5', 'Sum of DFs', '2.641353', () => ps.annuity],
  ['m15', 'we-15.5', 'Par swap rate', '6.955%', () => ps.rate, 100],
  ['m15', 'we-15.5', 'Value to 7% payer (≈)', '11,926', () => -c.swapValueToFixedPayer(10_000_000, 0.07, [0.06, 0.065, 0.07]), 1, 0],
  // M16
  ['m16', 'we-16.1', 'Holding-period return', '14%', () => c.hpr(50, 55, 2), 100],
  ['m16', 'we-16.1', 'Geometric average', '13.4%', () => -c.geometricMean([0.5, -0.5]), 100],
  ['m16', 'we-16.2', 'Portfolio expected return', '8.4%', () => c.portfolioReturn(0.6, 0.1, 0.06), 100],
  ['m16', 'we-16.2', 'Portfolio variance', '0.010276', () => c.portfolioSd(0.6, 0.15, 0.08, 0.2) ** 2],
  ['m16', 'we-16.2', 'Portfolio standard deviation', '10.14%', () => c.portfolioSd(0.6, 0.15, 0.08, 0.2), 100],
  ['m16', 'we-16.2', 'Weighted-average SD (ρ = +1)', '12.2%', () => c.portfolioSd(0.6, 0.15, 0.08, 1), 100],
  ['m16', 'we-16.2', 'Sharpe ratio', '0.43', () => c.sharpe(0.084, 0.04, c.portfolioSd(0.6, 0.15, 0.08, 0.2))],
  ['m16', 'we-16.2', 'SD with ρ = 0', '9.55%', () => c.portfolioSd(0.6, 0.15, 0.08, 0), 100],
  ['m16', 'we-16.2', 'SD with ρ = −1', '5.8%', () => c.portfolioSd(0.6, 0.15, 0.08, -1), 100],
  ['m16', 'we-16.3', 'Covariance', '0.00068', () => c.covariance(shr, mkt)],
  ['m16', 'we-16.3', 'Market variance', '0.00044', () => c.variance(mkt)],
  ['m16', 'we-16.3', 'Beta', '1.55', () => betaEst],
  ['m16', 'we-16.3', 'Required return', '15.3%', () => c.capm(0.06, betaEst, 0.06), 100],
  ['m16', 'we-16.3', 'Correlation', '0.99', () => c.correlation(shr, mkt)],
  ['m16', 'we-16.4', 'Fund Sharpe', '0.47', () => c.sharpe(0.12, 0.05, 0.15)],
  ['m16', 'we-16.4', 'Benchmark Sharpe', '0.42', () => c.sharpe(0.1, 0.05, 0.12)],
  ['m16', 'we-16.4', "Jensen's alpha", '1.5%', () => c.jensenAlpha(0.12, 0.05, 1.1, 0.1), 100],
  // M17
  ['m17', 'we-17.1', '1-day 95% VaR', '197,400', () => c.parametricVar(10_000_000, 0.012, zFirmTable[0.95])],
  ['m17', 'we-17.1', '1-day 99% VaR', '279,120', () => c.parametricVar(10_000_000, 0.012, zFirmTable[0.99])],
  ['m17', 'we-17.1', '10-day 95% VaR', '624,234', () => c.scaleVar(c.parametricVar(10_000_000, 0.012, 1.645), 10)],
  ['m17', 'we-17.2', 'Historical VaR', '21,000', () => hv.var],
  ['m17', 'we-17.2', 'Expected shortfall', '25,500', () => hv.es],
  ['m17', 'we-17.3', 'Expected loss', '9,000', () => c.expectedLoss(0.02, 0.45, 1_000_000)],
  ['m17', 'we-17.3', 'Net counterparty exposure', '800,000', () => c.netExposure(5_000_000, 4_200_000)],
  ['m17', 'we-17.4', 'Repo capacity', '47,500,000', () => c.repoCapacity(50_000_000, 0.05)],
  ['m17', 'we-17.4', 'Available today', '57,500,000', () => 10_000_000 + c.repoCapacity(50_000_000, 0.05)],
  ['m17', 'we-17.4', 'Stressed capacity', '30,000,000', () => c.repoCapacity(50_000_000, 0.2, 0.25)],
  ['m17', 'we-17.4', 'Stressed total', '40,000,000', () => 10_000_000 + c.repoCapacity(50_000_000, 0.2, 0.25)],
  // M19
  ['m19', 'we-19.1', 'Turnover ratio', '5%', () => c.turnoverRatio(30, 600), 100],
].map(([module, example, label, display, compute, scale = 1, dpOverride, erratum]) => ({ module, example, label, display, compute, scale, dpOverride, erratum }));
// `erratum` = the correctly rounded value where the syllabus display is off. Each one is also listed
// in web/content/overlays/errata.json so the app can show it beside the example.

// Parse the number shown in the syllabus and its number of decimals.
export function parseDisplay(display) {
  const m = String(display).replace(/−/g, '-').match(/[-+]?\d[\d,]*(?:\.\d+)?/);
  const s = m[0].replace(/,/g, '');
  const dp = (s.split('.')[1] || '').length;
  return { value: Number(s), dp };
}
