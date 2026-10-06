# Calculation verification

Generated 2026-10-06 by `node tools/report-calcs.mjs`. Source of the expected values: the worked examples of GCM-101 v1.0. Each value is recomputed with `web/js/calc.js` (the same code the app’s calculators and quiz generators use) and compared at the precision the syllabus displays. The unit test `tests/unit/calc.test.mjs` runs the same table and also checks that each displayed value appears verbatim in the extracted content.

| Module | Example | Quantity | Syllabus shows | Recomputed | Result |
|---|---|---|--:|--:|:-:|
| M0 | we-0.1 | Percentage-point change | 0.75 percentage points | 0.75 | ✅ |
| M0 | we-0.1 | Basis points | 75 bp | 75 | ✅ |
| M0 | we-0.1 | Relative change | 10% | 10 | ✅ |
| M0 | we-0.2 | Up 10% then down 10% | 99 | 99 | ✅ |
| M0 | we-0.3 | Mean return | 1% | 1 | ✅ |
| M0 | we-0.3 | Sample variance (%²) | 2.5 | 2.5 | ✅ |
| M0 | we-0.3 | Sample standard deviation | 1.58% | 1.581139 | ✅ |
| M1 | case-1.1 | Non-US equity (US$ tn) | 88.8 trillion | 88.8414 | ✅ |
| M1 | case-1.1 | Non-US bonds (US$ tn) | 99.5 trillion | 99.4733 | ✅ |
| M3 | we-3.1 | Real interest rate | 4.76% | 4.761905 | ✅ |
| M4 | we-4.1 | Growth factor 1.08^5 | 1.469328 | 1.469328 | ✅ |
| M4 | we-4.1 | Future value | 14,693.28 | 14693.280768 | ✅ |
| M4 | we-4.2 | 1.06^3 | 1.191016 | 1.191016 | ✅ |
| M4 | we-4.2 | Present value | 839.62 | 839.619283 | ✅ |
| M4 | we-4.3 | Effective annual rate | 12.68% | 12.682503 | ✅ |
| M4 | we-4.4 | 1.07^−5 | 0.712986 | 0.712986 | ✅ |
| M4 | we-4.4 | Annuity factor | 4.100197 | 4.100197 | ✅ |
| M4 | we-4.4 | Annuity PV | 4,100.20 | 4100.197436 | ✅ |
| M4 | we-4.5 | Perpetuity | 625 | 625 | ✅ |
| M4 | we-4.6 | PV year 1 | 2,727.27 | 2727.272727 | ✅ |
| M4 | we-4.6 | PV year 2 | 3,305.79 | 3305.785124 | ✅ |
| M4 | we-4.6 | PV year 3 | 3,756.57 | 3756.574005 | ✅ |
| M4 | we-4.6 | NPV at 10% | 210.37 | 210.368144 | ✅ |
| M4 | we-4.6 | NPV at 8% | 176.29 | 176.294264 | ✅ |
| M4 | we-4.6 | IRR | 8.90% | 8.896339 | ✅ |
| M4 | we-4.7 | Rule of 72 | 9 years | 9 | ✅ |
| M4 | we-4.7 | Exact doubling time | 9.01 years | 9.006468 | ✅ |
| M5 | we-5.1 | Price factor | 0.989889 | 0.989889 | ✅ |
| M5 | we-5.1 | T-bill price | 9,898.89 | 9898.888889 | ✅ |
| M5 | we-5.1 | 91-day return | 1.0214% | 1.021439 | ✅ |
| M5 | we-5.1 | Money-market yield | 4.04% | 4.040858 | ✅ |
| M5 | we-5.1 | Bond-equivalent yield | 4.10% | 4.096981 | ✅ |
| M5 | we-5.1 | TBILLPRICE per 100 | 98.98889 | 98.988889 | ✅ |
| M5 | we-5.2 | Repo interest | 13,424.66 | 13424.657534 | ✅ |
| M5 | we-5.2 | Repurchase price | 10,013,424.66 | 10013424.657534 | ✅ |
| M5 | we-5.2 | Haircut | 1.96% | 1.960784 | ✅ |
| M6 | we-6.2 | Current yield | 6.32% | 6.315789 | ✅ |
| M7 | we-7.1 | Market cap (R billion) | R20 billion | 20 | ✅ |
| M7 | we-7.1 | Dividend yield | 5% | 5 | ✅ |
| M7 | we-7.2 | TERP | 48 | 48 | ✅ |
| M7 | we-7.2 | Value of a right | 8 | 8 | ✅ |
| M7 | we-7.2 | Holder check | 200 | 200 | ✅ |
| M7 | we-7.3 | Value after split | 8,000 | 8000 | ✅ |
| M7 | we-7.4 | Price-weighted | 5.29% | 5.294118 | ✅ |
| M7 | we-7.4 | Cap-weighted | 1.43% | 1.428571 | ✅ |
| M7 | we-7.4 | Equal-weighted | 1.67% | 1.666667 | ✅ |
| M8 | we-8.1 | Buy US$10,000 | 180,050 | 180050 | ✅ |
| M8 | we-8.1 | Sell US$10,000 | 179,950 | 179950 | ✅ |
| M8 | we-8.1 | Round-trip cost | R100 | 100 | ✅ |
| M8 | we-8.2 | EUR/ZAR cross | 19.8000 | 19.8 | ✅ |
| M8 | we-8.3 | Forward rate | 18.6058 | 18.605769 | ✅ |
| M8 | we-8.3 | Forward points | 6,058 pips | 6057.692308 | ✅ |
| M8 | we-8.4 | USD return | 4.21% | 4.210526 | ✅ |
| M9 | we-9.1 | Hedged rand cost | R18,605,800 | 18605800 | ✅ |
| M9 | we-9.2 | Day 1 balance | 58,000 | 58000 | ✅ |
| M9 | we-9.2 | Day 2 balance | 40,000 | 40000 | ✅ |
| M9 | we-9.2 | Day 3 balance | 36,000 | 36000 | ✅ |
| M9 | we-9.2 | Day 3 margin call | 14,000 | 14000 | ✅ |
| M9 | we-9.2 | Day 4 balance | 66,000 | 66000 | ✅ |
| M9 | we-9.2 | Total gain | 2,000 | 2000 | ✅ |
| M9 | we-9.3 | Call profit at 80 | −5 | -5 | ✅ |
| M9 | we-9.3 | Put profit at 80 | +16 | 16 | ✅ |
| M9 | we-9.3 | Call profit at 90 | −5 | -5 | ✅ |
| M9 | we-9.3 | Put profit at 90 | +6 | 6 | ✅ |
| M9 | we-9.3 | Call profit at 110 | +5 | 5 | ✅ |
| M9 | we-9.3 | Put profit at 110 | −4 | -4 | ✅ |
| M9 | we-9.3 | Call profit at 120 | +15 | 15 | ✅ |
| M9 | we-9.3 | Put profit at 120 | −4 | -4 | ✅ |
| M9 | we-9.3 | Call break-even | 105 | 105 | ✅ |
| M9 | we-9.3 | Put break-even | 96 | 96 | ✅ |
| M9 | we-9.4 | All-in cost at 6% | 9% | 9 | ✅ |
| M9 | we-9.4 | All-in cost at 8% | 9% | 9 | ✅ |
| M9 | we-9.5 | CDS premium | 150,000 | 150000 | ✅ |
| M9 | we-9.5 | CDS payout | 6,000,000 | 6000000 | ✅ |
| M10 | we-10.1 | NAV per unit | 10.00 | 10 | ✅ |
| M10 | we-10.2 | Discount | 8% | 8 | ✅ |
| M10 | we-10.3 | Fund A | 37,275.64 | 37275.635287 | ✅ |
| M10 | we-10.3 | Fund B | 29,177.57 | 29177.574906 | ✅ |
| M10 | we-10.3 | Difference | 8,098.06 | 8098.060381 | ✅ |
| M11 | we-11.1 | Gross proceeds (R million) | 1,000 million | 1000 | ✅ |
| M11 | we-11.1 | Fees (R million) | 30 million | 30 | ✅ |
| M11 | we-11.1 | Net proceeds (R million) | 970 million | 970 | ✅ |
| M11 | we-11.1 | First-day return | 15% | 15 | ✅ |
| M11 | we-11.1 | Money left on the table (R million) | 150 million | 150 | ✅ |
| M11 | we-11.2 | Pro-rata fill at clearing yield | 60% | 60 | ✅ |
| M11 | we-11.2 | Clearing yield | 7.30% | 7.3 | ✅ |
| M11 | we-11.2 | Bid-to-cover | 1.4 | 1.4 | ✅ |
| M12 | we-12.1 | Spread | 0.10 | 0.1 | ✅ |
| M12 | we-12.1 | Spread in bp (≈) | 20 basis points | 19.98002 | ✅ |
| M12 | we-12.1 | Market buy cost | 200,500 | 200500 | ✅ |
| M12 | we-12.1 | Average price | 50.125 | 50.125 | ✅ |
| M12 | we-12.1 | Cost vs mid (≈ bp) | 15 basis points | 14.985015 | ✅ |
| M12 | we-12.2 | Short-sale gain | 8,000 | 8000 | ✅ |
| M12 | we-12.2 | Lending fee | 75 | 75 | ✅ |
| M12 | we-12.2 | Profit | 7,925 | 7925 | ✅ |
| M12 | we-12.2 | Loss if price rises to 75 | 15,075 | 15075 | ✅ |
| M12 | we-12.3 | Equity ratio at 40 | 37.5% | 37.5 | ✅ |
| M12 | we-12.3 | Margin-call price | 35.71 | 35.714286 | ✅ |
| M12 | we-12.4 | Gross shares | 2,400 | 2400 | ✅ |
| M12 | we-12.4 | Net shares moved | 400 | 400 | ✅ |
| M12 | we-12.4 | Reduction | 83% | 83.333333 | ✅ |
| M12 | we-12.5 | T+1 settlement | 9 October | 9 | ✅ |
| M12 | we-12.5 | T+3 settlement | 13 October | 13 | ✅ |
| M12 | we-12.5 | T+3 with Monday holiday | 14 October | 14 | ✅ |
| M13 | we-13.1 | Annuity factor at 10% | 3.790787 | 3.790787 | ✅ |
| M13 | we-13.1 | PV of coupons | 303.26 | 303.262942 | ✅ |
| M13 | we-13.1 | PV of face | 620.92 | 620.921323 | ✅ |
| M13 | we-13.1 | Price | 924.18 | 924.184265 | ✅ |
| M13 | we-13.1 | Price per 100 | 92.418 | 92.418426 | ✅ |
| M13 | we-13.2 | Annuity factor (2.5%, 6) | 5.508125 | 5.508125 | ✅ |
| M13 | we-13.2 | PV of coupons | 16.52 | 16.524376 | ✅ |
| M13 | we-13.2 | PV of face | 86.23 | 86.229687 | ✅ |
| M13 | we-13.2 | Price | 102.75 | 102.754063 | ✅ |
| M13 | we-13.3 | Price at 6% | 96.53 | 96.534894 | ✅ |
| M13 | we-13.3 | Price at 7% | 93.23 | 93.225577 | ✅ |
| M13 | we-13.3 | Interpolated yield | 6.46% | 6.46381 | ✅ |
| M13 | we-13.3 | Exact YTM | 6.458% | 6.458124 | ✅ |
| M13 | we-13.4 | Zero-coupon price | 50.83 | 50.834929 | ✅ |
| M13 | we-13.5 | Accrued interest | 0.99 | 0.989011 | ✅ |
| M13 | we-13.5 | Dirty price | 103.74 | 103.739011 | ✅ |
| M13 | we-13.6 | PV year 1 | 72.73 | 72.727273 | ✅ |
| M13 | we-13.6 | PV year 2 | 66.12 | 66.115702 | ✅ |
| M13 | we-13.6 | PV year 3 | 60.11 | 60.105184 | ✅ |
| M13 | we-13.6 | PV year 4 | 54.64 | 54.641076 | ✅ |
| M13 | we-13.6 | PV year 5 | 670.60 | 670.595029 | ✅ |
| M13 | we-13.6 | t × PV year 1 | 72.73 | 72.727273 | ✅ |
| M13 | we-13.6 | t × PV year 2 | 132.23 | 132.231405 | ✅ |
| M13 | we-13.6 | t × PV year 3 | 180.32 | 180.315552 | ✅ |
| M13 | we-13.6 | t × PV year 4 | 218.56 | 218.564306 | ✅ |
| M13 | we-13.6 | t × PV year 5 | 3,352.98 | 3352.975145 | ✅ |
| M13 | we-13.6 | Σ t × PV | 3,956.81 | 3956.81368 | ✅ |
| M13 | we-13.6 | Macaulay duration | 4.28 years | 4.281412 | ✅ |
| M13 | we-13.6 | Modified duration | 3.89 | 3.892193 | ✅ |
| M13 | we-13.6 | DV01 | 0.36 | 0.35971 | ✅ |
| M13 | we-13.6 | Duration estimate +1% | 35.97 | 35.971033 | ✅ |
| M13 | we-13.6 | Price at 11% | 889.12 | 889.123089 | ✅ |
| M13 | we-13.6 | Actual change +1% | 35.06 | 35.061175 | ✅ |
| M13 | we-13.6 | Actual change −1% | 36.92 | 36.919223 | ✅ |
| M13 | we-13.6 | Convexity | 20.10 | 20.097315 | ✅ |
| M13 | we-13.6 | Duration + convexity estimate | 35.04 | 35.042228 | ✅ |
| M13 | we-13.7 | Implied forward rate | 7.00% | 7.002358 | ✅ |
| M13 | we-13.8 | Credit spread | 120 bp | 120 | ✅ |
| M13 | we-13.8 | Implied annual default probability | 2% | 2 | ✅ |
| M13 | case-13.1 | Duration loss estimate | 18% | 18 | ✅ |
| M14 | we-14.1 | EPS | 2.70 | 2.7 | ✅ |
| M14 | we-14.1 | Dividend per share | 1.62 | 1.62 | ✅ |
| M14 | we-14.1 | Payout | 60% | 60 | ✅ |
| M14 | we-14.1 | ROE | 15% | 15 | ✅ |
| M14 | we-14.1 | Sustainable growth | 6% | 6 | ✅ |
| M14 | we-14.1 | P/E | 12.0 | 12 | ✅ |
| M14 | we-14.1 | Book value per share | 18.00 | 18 | ✅ |
| M14 | we-14.1 | P/B | 1.8 | 1.8 | ✅ |
| M14 | we-14.1 | EBITDA | 240 | 240 | ✅ |
| M14 | we-14.1 | Market cap | 1,620 | 1620 | ✅ |
| M14 | we-14.1 | EV | 1,820 | 1820 | ✅ |
| M14 | we-14.1 | EV/EBITDA | 7.6 | 7.583333 | ✅ |
| M14 | we-14.1 | Net income from statement | 135 | 135 | ✅ |
| M14 | we-14.2 | CAPM cost of equity | 15.2% | 15.2 | ✅ |
| M14 | we-14.3 | D1 | 2.10 | 2.1 | ✅ |
| M14 | we-14.3 | Gordon value | 35.00 | 35 | ✅ |
| M14 | we-14.3 | Company Z DDM value | 18.67 | 18.665217 | ✅ |
| M14 | we-14.3 | Implied growth | 9.7% | 9.714286 | ✅ |
| M14 | we-14.4 | k=10% g=4% | 34.67 | 34.666667 | ✅ |
| M14 | we-14.4 | k=10% g=5% | 42.00 | 42 | ✅ |
| M14 | we-14.4 | k=10% g=6% | 53.00 | 53 | ✅ |
| M14 | we-14.4 | k=11% g=4% | 29.71 | 29.714286 | ✅ |
| M14 | we-14.4 | k=11% g=5% | 35.00 | 35 | ✅ |
| M14 | we-14.4 | k=11% g=6% | 42.40 | 42.4 | ✅ |
| M14 | we-14.4 | k=12% g=4% | 26.00 | 26 | ✅ |
| M14 | we-14.4 | k=12% g=5% | 30.00 | 30 | ✅ |
| M14 | we-14.4 | k=12% g=6% | 35.33 | 35.333333 | ✅ |
| M14 | we-14.5 | D2 | 1.3225 | 1.3225 | ✅ |
| M14 | we-14.5 | D3 | 1.5209 | 1.520875 | ✅ |
| M14 | we-14.5 | PV of stage-1 dividends | 3.1636 | 3.163603 | ✅ |
| M14 | we-14.5 | D4 | 1.5969 | 1.596919 | ✅ |
| M14 | we-14.5 | Terminal value at year 3 | 22.8131 | 22.813125 | ✅ |
| M14 | we-14.5 | PV of terminal value | 16.2379 | 16.237932 | ✅ |
| M14 | we-14.5 | Share value | 19.40 | 19.401535 | ✅ |
| M14 | we-14.5 | Terminal share of value | 84% | 83.694056 | ✅ |
| M14 | we-14.6 | PV year 1 | 44.25 | 44.247788 | ✅ |
| M14 | we-14.6 | PV year 2 | 43.07 | 43.073068 | ✅ |
| M14 | we-14.6 | PV year 3 | 41.58 | 41.58301 | ✅ |
| M14 | we-14.6 | PV year 4 | 39.25 | 39.252399 | ✅ |
| M14 | we-14.6 | PV year 5 | 36.36 | 36.364916 | ✅ |
| M14 | we-14.6 | Sum of PVs | 204.52 | 204.521179 | ✅ |
| M14 | we-14.6 | Terminal value | 879.38 | 879.375 | ✅ |
| M14 | we-14.6 | PV of terminal value | 477.29 | 477.289519 | ✅ |
| M14 | we-14.6 | Equity value (millions) | 681.81 million | 681.810698 | ✅ |
| M14 | we-14.6 | Value per share | 6.82 per share | 6.818107 | ✅ |
| M14 | we-14.7 | Median peer P/E | 12 | 12 | ✅ |
| M14 | we-14.7 | Relative value | 48 | 48 | ✅ |
| M14 | we-14.7 | Implied P/B | 1.6 | 1.6 | ✅ |
| M15 | we-15.1 | Fair forward | 106 | 106 | ✅ |
| M15 | we-15.1 | Arbitrage profit | 2 | 2 | ✅ |
| M15 | we-15.1 | Forward with 2% income | 103.92 | 103.921569 | ✅ |
| M15 | we-15.2 | Delta | 0.5 | 0.5 | ✅ |
| M15 | we-15.2 | Amount borrowed | 42.86 | 42.857143 | ✅ |
| M15 | we-15.2 | Call value | 7.14 | 7.142857 | ✅ |
| M15 | we-15.2 | Risk-neutral probability | 0.75 | 0.75 | ✅ |
| M15 | we-15.2 | Put value | 2.38 | 2.380952 | ✅ |
| M15 | we-15.2 | Parity check | 4.76 | 4.761905 | ✅ |
| M15 | we-15.3 | d1 | 0.35 | 0.35 | ✅ |
| M15 | we-15.3 | d2 | 0.15 | 0.15 | ✅ |
| M15 | we-15.3 | N(d1) | 0.6368 | 0.636831 | ✅ |
| M15 | we-15.3 | N(d2) | 0.5596 | 0.559618 | ✅ |
| M15 | we-15.3 | PV of strike | 95.12 | 95.122942 | ✅ |
| M15 | we-15.3 | Call | 10.45 | 10.450583 | ✅ |
| M15 | we-15.3 | Put | 5.57 | 5.573526 | ✅ |
| M15 | we-15.3 | Parity | 4.88 | 4.877058 | ✅ |
| M15 | we-15.5 | DF 1 | 0.943396 | 0.943396 | ✅ |
| M15 | we-15.5 | DF 2 | 0.881659 | 0.881659 | ✅ |
| M15 | we-15.5 | DF 3 | 0.816298 | 0.816298 | ✅ |
| M15 | we-15.5 | Sum of DFs | 2.641353 | 2.641353 | ✅ |
| M15 | we-15.5 | Par swap rate | 6.955% | 6.954848 | ✅ |
| M15 | we-15.5 | Value to 7% payer (≈) | 11,926 | 11926.139162 | ✅ |
| M16 | we-16.1 | Holding-period return | 14% | 14 | ✅ |
| M16 | we-16.1 | Geometric average | 13.4% | 13.39746 | ✅ |
| M16 | we-16.2 | Portfolio expected return | 8.4% | 8.4 | ✅ |
| M16 | we-16.2 | Portfolio variance | 0.010276 | 0.010276 | ✅ |
| M16 | we-16.2 | Portfolio standard deviation | 10.14% | 10.137061 | ✅ |
| M16 | we-16.2 | Weighted-average SD (ρ = +1) | 12.2% | 12.2 | ✅ |
| M16 | we-16.2 | Sharpe ratio | 0.43 | 0.434051 | ✅ |
| M16 | we-16.2 | SD with ρ = 0 | 9.55% | 9.551963 | ✅ |
| M16 | we-16.2 | SD with ρ = −1 | 5.8% | 5.8 | ✅ |
| M16 | we-16.3 | Covariance | 0.00068 | 0.00068 | ✅ |
| M16 | we-16.3 | Market variance | 0.00044 | 0.00044 | ✅ |
| M16 | we-16.3 | Beta | 1.55 | 1.545455 | ✅ |
| M16 | we-16.3 | Required return | 15.3% | 15.272727 | ✅ |
| M16 | we-16.3 | Correlation | 0.99 | 0.992586 | ✅ |
| M16 | we-16.4 | Fund Sharpe | 0.47 | 0.466667 | ✅ |
| M16 | we-16.4 | Benchmark Sharpe | 0.42 | 0.416667 | ✅ |
| M16 | we-16.4 | Jensen's alpha | 1.5% | 1.5 | ✅ |
| M17 | we-17.1 | 1-day 95% VaR | 197,400 | 197400 | ✅ |
| M17 | we-17.1 | 1-day 99% VaR | 279,120 | 279120 | ✅ |
| M17 | we-17.1 | 10-day 95% VaR | 624,234 | 624233.610117 | ✅ |
| M17 | we-17.2 | Historical VaR | 21,000 | 21000 | ✅ |
| M17 | we-17.2 | Expected shortfall | 25,500 | 25500 | ✅ |
| M17 | we-17.3 | Expected loss | 9,000 | 9000 | ✅ |
| M17 | we-17.3 | Net counterparty exposure | 800,000 | 800000 | ✅ |
| M17 | we-17.4 | Repo capacity | 47,500,000 | 47500000 | ✅ |
| M17 | we-17.4 | Available today | 57,500,000 | 57500000 | ✅ |
| M17 | we-17.4 | Stressed capacity | 30,000,000 | 30000000 | ✅ |
| M17 | we-17.4 | Stressed total | 40,000,000 | 40000000 | ✅ |
| M19 | we-19.1 | Turnover ratio | 5% | 5 | ✅ |

**244 of 244 values match exactly; 0 differ.**

## Errata found

| Module | Example | Syllabus shows | Correct | Note |
|---|---|--:|--:|---|
| M13 | we-13.3 | 96.54 | 96.53 (exact 96.5349) | Recomputing the 4-year, 5% annual-coupon bond at a 6% yield gives 96.5349, which rounds to 96.53 (the syllabus shows 96.54). The interpolated yield (≈ 6.46%) and the exact yield (6.458%) are unaffected. |

The three figures named in the brief are confirmed: future value **14,693.28** (WE 4.1), bond price **924.18** (WE 13.1) and Black-Scholes call **10.45** (WE 15.3).
