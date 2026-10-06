---
title: "Introduction to Global Capital Markets — A Benchmarked Syllabus"
course_code: GCM-101
version: 1.0
date: 2026-10-05
status: publication-ready draft
audience: Adults with no financial background
delivery: Self-paced online
tools: [calculator, spreadsheet, python]
tags: [capital-markets, syllabus, curriculum-design, finance-education, valuation]
---

# Introduction to Global Capital Markets
### From zero to valuation — a syllabus benchmarked against 13 leading programmes

> [!abstract] At a glance
> - **Who it is for:** anyone who wants to understand how the world's capital markets work, starting with no knowledge of finance, its vocabulary or its maths.
> - **Format:** self-paced online; 20 modules in 7 parts plus a capstone project.
> - **Effort:** about **146 hours** core (≈ 12–18 weeks at 8–12 hours per week), plus an optional **15-hour Python track**.
> - **Tools:** every calculation is shown three ways — by hand with a calculator, in a spreadsheet (Excel or Google Sheets), and in Python.
> - **Scope:** global, with deliberate coverage of emerging and African markets alongside the US, UK, Europe and Asia.
> - **Evidence base:** benchmarked against 13 university, professional-body, exchange, MOOC and industry-training programmes (Part A). Every design decision is traceable to that evidence through source codes `[S1]`–`[S13]`, reference codes `[R1]`–`[R7]` and decision codes `[D1]`–`[D16]`.

---

## Contents

- **Part A — Benchmarking evidence**
  - A1 Method · A2 Source table · A3 Topic-vs-course matrix · A4 Findings · A5 Sequencing and assessment comparison · A6 Design decisions
- **Part B — The course**
  - B1 Course description · B2 Course learning outcomes · B3 Course map · B4 Tool tracks · B5 Assessment strategy
- **Part C — Modules**
  - Part 1 Foundations & market structure: M0–M4
  - Part 2 Instruments: M5–M10
  - Part 3 Issuance, trading, clearing & settlement: M11–M12
  - Part 4 Valuation: M13–M15
  - Part 5 Risk: M16–M17
  - Part 6 Regulation & ethics: M18
  - Part 7 Global context: M19
- **Part D — Capstone project**
- **Part E — Recommended resources**
- **Part F — Credential mapping**
- **Part G — Self-check: gaps, overlap and claims**
- **Part H — References**

---

## How to read this document

| Code | Meaning | Where it is defined |
|---|---|---|
| `[S1]`–`[S13]` | A benchmark course reviewed | A2 Source table |
| `[R1]`–`[R7]` | A non-course reference used for a factual claim | Part H |
| `[D1]`–`[D16]` | A design decision derived from the benchmark evidence | A6 |
| `T01`–`T33` | A topic row in the comparison matrix | A3 |
| `CLO1`–`CLO10` | A course-level learning outcome | B2 |
| ● / ◐ / – | Topic is a dedicated unit / a sub-topic / not found in the published outline | A3 |

Formulas are written in plain text (for example `PV = FV / (1 + r)^n`) so they display correctly in Obsidian, a learning management system or a plain web page.

---

# Part A — Benchmarking evidence

## A1. Method

**Question.** What does the best available introductory capital-markets education cover, in what order, to what depth, and how is it assessed?

**Search scope (October 2026).** Leading universities, professional and licensing bodies, a central-bank-linked training institute, exchanges, MOOC platforms (massive open online course platforms such as Coursera and edX) and industry training providers, across the US, UK/Europe, South Africa and India.

**Inclusion criteria.**
1. A credible, identifiable provider (university, statutory or professional body, exchange, international organisation or long-established training firm).
2. A publicly available outline, curriculum or syllabus that can be checked.
3. An introductory or foundation positioning, **or** a widely used first course that sets the depth benchmark for valuation (MIT, LSE, IMF).
4. Together, the set had to span four lenses: *academic* (universities), *licensing* (professional exams), *practitioner* (exchanges and industry training) and *open access* (MOOCs).

**Evidence used.** Only published outlines, module lists, learning objectives and exam specifications. Course materials themselves were not copied; all content in this syllabus is original synthesis.

**Limitation.** A "–" in the matrix means a topic was *not found in the published outline*, not that it is never taught. Several providers do not publish study hours.

## A2. Source table

| ID | Course | Provider | Audience | Duration / effort | Assessment | Why it is credible |
|---|---|---|---|---|---|---|
| S1 | [Investment Foundations® Certificate](https://www.cfainstitute.org/sites/default/files/docs/programs/investment-foundations-certificate/investment-foundations-certificate-curriculum.pdf) (2026 curriculum) | CFA Institute (global) | People aspiring to, or in, support roles across investment and finance | 35–65 hours, self-paced; 6 courses; 12-month access | Final assessment; certificate and digital badge | Global not-for-profit body behind the CFA charter; curriculum refreshed with DeFi, FinTech and ESG content |
| S2 | [Introduction to Securities & Investment (International)](https://links.cisi.org/cisiweb2/docs/default-source/atp-portal/training-material/international-introduction-to-securities-and-investments/international-introduction-to-securities-and-investment-syllabus.pdf?sfvrsn=80562502_12), v19, effective 10 Sep 2026 | Chartered Institute for Securities & Investment (CISI, UK) | Entry-level industry staff | Not stated in syllabus | 1-hour exam, 50 multiple-choice questions; objectives graded *know / understand / be able to calculate* | Chartered professional body; explicit international version; current syllabus |
| S3 | [Securities Industry Essentials (SIE) content outline](https://www.finra.org/sites/default/files/SIE_Content_Outline.pdf) | FINRA (US self-regulatory organisation) | Prospective US securities professionals | Not stated | 75 scored + 10 unscored multiple-choice items in 1 h 45 min; four weighted sections | Mandatory entry exam for US securities registration |
| S4 | [Registered Persons Examinations](https://saifm.co.za/exams/registered-persons-examinations/): *Introduction to Financial Markets* + *Regulation and Ethics of the SA Financial Markets* | South African Institute of Financial Markets (SAIFM) | Aspiring market practitioners and interested others; no formal prerequisites | Self-study workbooks; hours not stated | 50 multiple-choice questions, 1 hour, 70% pass; formula sheet and non-programmable calculator | Licensing exams used for JSE and FSCA practitioner requirements |
| S5 | [NISM Series XII: Securities Markets Foundation](https://www.nism.ac.in/curriculum-securities-markets-foundation) | National Institute of Securities Markets (set up by SEBI, India) | New entrants and interested public | Not stated; free workbook | Certification exam | Created by India's securities regulator; emerging-market lens |
| S6 | [Financial Markets](https://www.coursera.org/learn/financial-markets-global) (Robert Shiller) | Yale University via Coursera | Beginners; no prior experience required | ~34 hours across 7 modules (Coursera estimates 3 weeks at 10 h/week) | 26 graded items incl. a 120-minute applied assignment and a final exam | Taught by a Nobel-laureate economist; over 2.4 million enrolments |
| S7 | [Global Financial Markets and Instruments](https://www.coursera.org/learn/global-financial-markets-instruments) | Rice University via Coursera | All knowledge levels | 4 modules; hours not captured | Module quizzes | First course of a university investment specialisation |
| S8 | [15.401 Finance Theory I](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/) (Andrew Lo) | MIT OpenCourseWare | Graduate (MBA) students | One semester; ~25 hours of lecture video | Midterm, final exam, case study | Core MIT Sloan finance course; the valuation-depth benchmark |
| S9 | [Financial Market Analysis (FMAx)](https://www.imf.org/en/capacity-development/training/icdtc/courses/fmax) | IMF Institute for Capacity Development (online) | Officials in central banks, finance ministries and regulators | Current offering runs May 2026–Apr 2027 | Not stated on course page; basic statistics and Excel are prerequisites | IMF policy-training standard; requires basic statistics and Excel |
| S10 | [Capital Markets Professional Certificate](https://www.nyif.com/capital-markets-professional-certificate.html) | New York Institute of Finance (NYIF) | Anyone seeking to understand capital markets | 5 days; 35 CPE credits; basic Excel prerequisite | "Desk-ready" knowledge check | Long-established practitioner training provider |
| S11 | [Capital Markets Masterclass](https://www.jse.co.za/events/capital-markets-masterclass) | Johannesburg Stock Exchange (JSE), via a training provider | Professionals | 2 days, virtual; 12 CPD points | Certificate of completion | Africa's largest exchange by market capitalisation [R7]; only benchmark centred on African market structure and market infrastructure |
| S12 | [Introduction to Capital Markets](https://www.coursera.org/learn/introduction-to-capital-markets) | Corporate Finance Institute (CFI) via Coursera | Career explorers; beginners | ~2 hours; 10 short modules | One 50-minute assessment | Industry-orientation benchmark for buy-side/sell-side roles |
| S13 | [FM250: Finance](https://www.lse.ac.uk/study-at-lse/summer-schools/summer-school/courses/finance/fm250) | London School of Economics Summer School | Students with elementary quantitative methods or introductory micro-economics | 36 h lectures + 18 h classes; 7.5 ECTS | Two examinations | Top-ranked finance department; university-level depth benchmark |

> [!note] Data notes
> - CFA Institute's 2023 launch release described 60–90 study hours; the 2026 curriculum document states 35–65 hours. This syllabus uses the current figure.
> - LSE FM250 ran in 2026 (two sessions); applications were closed at the time of review.
> - The JSE masterclass is delivered by a service provider; the JSE page carries a non-endorsement notice.

## A3. Topic-vs-course matrix

**Legend:** ● dedicated module or lesson in the published outline · ◐ covered as a sub-topic or in passing · – not found in the published outline.
The last two columns count ● and ●+◐ across the 13 sources.

| ID | Topic | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 | S13 | ● | ●+◐ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| T01 | Purpose & functions of financial markets | ● | ● | ◐ | ● | ● | ● | ● | ● | ◐ | ● | ● | ● | – | 10 | 12 |
| T02 | Participants & industry structure | ● | ● | ● | ◐ | ● | ● | ● | ◐ | – | ● | ◐ | ● | – | 8 | 11 |
| T03 | Macroeconomy, central banks & monetary policy | ● | ● | ● | ● | – | ◐ | – | – | ◐ | ● | – | – | – | 5 | 7 |
| T04 | Time value of money / financial maths | ● | ◐ | – | ● | – | ● | ● | ● | ● | ● | – | – | ◐ | 7 | 9 |
| T05 | Statistics for finance | ● | – | – | ● | – | ● | – | ◐ | ● | – | – | – | – | 4 | 5 |
| T06 | Money markets | ◐ | ● | ◐ | ● | ◐ | ◐ | ● | ◐ | ● | ● | – | – | – | 5 | 10 |
| T07 | Bonds: features & types | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ◐ | – | ● | 11 | 12 |
| T08 | Bond valuation, yields & yield curve | ● | ◐ | ◐ | ◐ | ◐ | ● | ● | ● | ● | ● | – | – | ◐ | 6 | 11 |
| T09 | Equities: features, rights, corporate actions | ● | ● | ● | ● | ● | ● | ● | ◐ | ◐ | ● | ◐ | – | ◐ | 8 | 12 |
| T10 | Equity valuation | ● | ◐ | – | ◐ | ◐ | ● | ◐ | ● | ● | ● | – | – | ◐ | 5 | 10 |
| T11 | Financial statements | ● | – | ◐ | ◐ | ◐ | – | – | – | – | ◐ | – | – | – | 1 | 5 |
| T12 | Foreign exchange | ● | ● | ◐ | ● | – | – | – | – | – | ● | – | – | – | 4 | 5 |
| T13 | Forwards & futures | ● | ● | – | ● | ● | ● | ● | ● | – | ● | ◐ | – | ● | 9 | 10 |
| T14 | Options | ● | ● | ● | ◐ | ◐ | ● | ● | ● | – | ● | – | – | ● | 8 | 10 |
| T15 | Swaps & credit derivatives | ● | ● | – | ◐ | ◐ | – | ◐ | – | – | ● | – | – | ● | 4 | 7 |
| T16 | Derivative pricing (quantitative) | – | – | – | – | – | ◐ | – | ● | – | ◐ | – | – | ◐ | 1 | 4 |
| T17 | Pooled funds (mutual funds, ETFs, closed-end) | ● | ● | ● | ◐ | ● | ● | ◐ | – | – | ● | – | – | – | 6 | 8 |
| T18 | Alternatives (hedge funds, PE, real estate, commodities) | ● | ● | ● | ◐ | ◐ | ● | ● | – | – | ● | ◐ | ◐ | – | 6 | 10 |
| T19 | Fintech, crypto-assets & DeFi | ● | ● | – | ◐ | ◐ | ◐ | ◐ | – | – | – | – | – | – | 2 | 6 |
| T20 | Primary markets, IPOs & underwriting | ● | ◐ | ● | – | ● | ● | ◐ | – | – | ● | ● | ● | – | 7 | 9 |
| T21 | Secondary markets, venues & orders | ● | ● | ● | ◐ | ● | ● | ● | – | – | ● | ● | ◐ | – | 8 | 10 |
| T22 | Clearing, settlement & market infrastructure | ● | ● | ◐ | ◐ | ● | ◐ | – | – | – | ◐ | ● | – | – | 4 | 8 |
| T23 | Risk, return & diversification | ● | ◐ | ◐ | ● | ● | ● | – | ● | ● | ◐ | – | – | ● | 7 | 10 |
| T24 | CAPM & asset-pricing models | ◐ | – | – | ◐ | – | ● | – | ● | ◐ | ◐ | – | – | ● | 3 | 7 |
| T25 | Risk management (VaR, credit, operational) | ● | ◐ | ◐ | – | ◐ | ● | – | ◐ | ● | ◐ | ◐ | – | – | 3 | 9 |
| T26 | Regulation, market abuse & financial crime | ● | ● | ● | ● | ● | ● | – | – | – | ● | ● | – | – | 8 | 8 |
| T27 | Ethics & professional conduct | ● | ● | ● | ● | ◐ | ◐ | – | – | – | – | – | – | – | 4 | 6 |
| T28 | Market efficiency & behavioural finance | ◐ | – | – | – | – | ● | – | ● | – | – | – | – | ● | 3 | 4 |
| T29 | Financial crises & history | – | – | – | – | – | ● | ◐ | – | ◐ | ● | ◐ | – | – | 2 | 5 |
| T30 | ESG & sustainable finance | ◐ | ● | – | – | – | ◐ | – | – | – | – | ● | – | – | 2 | 4 |
| T31 | Emerging / African market context | – | ◐ | – | ● | ● | ◐ | ◐ | – | ◐ | ◐ | ● | – | – | 3 | 8 |
| T32 | Careers in capital markets | ◐ | – | – | – | – | ● | – | – | – | – | – | ● | – | 2 | 3 |
| T33 | Personal finance & advice | ● | ● | ● | ◐ | ● | ◐ | – | – | – | – | – | – | – | 4 | 6 |

**Breadth by source** (●+◐ of 33 topics): CFA [S1] 30 · Yale [S6] 30 · CISI [S2] 26 · SAIFM [S4] 26 · NYIF [S10] 26 · NISM [S5] 23 · FINRA [S3] 20 · Rice [S7] 18 · MIT [S8] 16 · IMF [S9] 14 · JSE [S11] 14 · LSE [S13] 12 · CFI [S12] 6.

## A4. Findings

### A4.1 The common core (what almost everyone teaches)

Topics taught as a dedicated unit by at least 7 of 13 sources:

| Rank | Topic | ● count | Covered here in |
|---|---|:-:|---|
| 1 | T07 Bonds: features & types | 11 | M6, M13 |
| 2 | T01 Purpose & functions of markets | 10 | M1 |
| 3 | T13 Forwards & futures | 9 | M9, M15 |
| 4 | T02 Participants & structure | 8 | M2 |
| 4 | T09 Equities: features & corporate actions | 8 | M7 |
| 4 | T14 Options | 8 | M9, M15 |
| 4 | T21 Secondary markets & trading | 8 | M12 |
| 4 | T26 Regulation, market abuse & crime | 8 | M18 |
| 9 | T04 Time value of money | 7 | M4 |
| 9 | T20 Primary markets & IPOs | 7 | M11 |
| 9 | T23 Risk, return & diversification | 7 | M16 |

A wider "broad core" (●+◐ ≥ 9) adds bond valuation (T08), money markets (T06), equity valuation (T10), alternatives (T18) and risk management (T25).

### A4.2 Where the best courses differ

1. **Purpose.** Three distinct traditions exist: *theory-led* university courses (MIT, LSE, Yale) build from present value to asset-pricing models; *licensing* courses (CISI, FINRA, SAIFM, NISM) prioritise product knowledge, market rules and conduct; *practitioner* programmes (NYIF, JSE, CFI) prioritise how the industry actually runs.
2. **Valuation depth.** MIT, IMF, NYIF and Yale price instruments quantitatively. Licensing courses stop at simple measures (CISI asks only for dividend yield, flat yield, rights-issue prices, effective annual rate and a forward exchange rate). Quantitative derivative pricing is the thinnest major topic (●+◐ = 4).
3. **Jurisdiction.** Licensing courses are anchored to one rulebook (US, UK-international, South Africa, India). None offers a comparative, global regulatory frame.
4. **Sequencing.** MIT starts with present value; CFA starts with the industry; Yale starts with risk and insurance; CISI starts with the economy; NYIF moves from participants to money markets and foreign exchange before time value of money. There is no single canonical order (see A5).
5. **Assessment.** Licensing exams are timed multiple-choice tests (50–75 items, 60–105 minutes, ~70% pass). University courses use exams plus cases; the strongest MOOC (Yale) adds a two-hour applied assignment; NYIF ends with a skills check.

### A4.3 Gaps in the field

| Gap | Evidence | How this syllabus responds |
|---|---|---|
| Post-trade infrastructure (clearing, settlement, custody) is thin in MOOCs and university courses | T22: only 4 ●; none of S7, S8, S9, S12, S13 | Full module M12, informed by S1, S2, S5 and S11 `[D4]` |
| Foreign exchange, the market that links all others, is under-taught | T12: ●+◐ = 5 | Dedicated module M8 `[D7]` |
| Quantitative derivative pricing barely appears at introductory level | T16: ●+◐ = 4 | M15 introduces cost-of-carry, one-step binomial and Black-Scholes intuition `[D5]` |
| Emerging and African markets appear only in regional courses | T31: 3 ● (S4, S5, S11) | Africa/EM case thread through every Part; M19 `[D10]` |
| Financial statements, needed for equity valuation, are rarely taught | T11: 1 ● | "Statements in one hour" block inside M14 `[D5]` |
| Behavioural finance, crises, ESG and careers sit outside most outlines | T28–T30, T32 | M16, M19, M2 `[D11]`, `[D12]` |
| No course teaches computation in modern tools beyond Excel | IMF and NYIF require Excel; none uses Python | Three-tool track `[D6]` |
| Benchmark-rate reform (LIBOR, JIBAR) is absent from every outline reviewed | Not found in S1–S13 | M3 and M18 cover reference-rate reform `[D8]` |
| Most courses assume some numeracy | IMF requires statistics and Excel; LSE requires quantitative prerequisites; MIT is graduate-level | Module M0 numeracy on-ramp and glossary-first design `[D1]` |

## A5. Sequencing and assessment comparison

### A5.1 How seven benchmark courses order their content

| Source | Order (simplified) |
|---|---|
| CFA [S1] | Industry & ethics → markets, trading & vehicles → quantitative tools & instruments → economics & financial statements → clients, portfolios, risk & performance → ESG |
| CISI [S2] | Industry → economy → equities → bonds → cash, money market, property, FX → derivatives → funds → regulation → other products → advice |
| FINRA [S3] | Regulators, market structure, economics, offerings → products & risks → trading, accounts & prohibited activities → registration rules |
| SAIFM [S4] | Financial system → economy → time value of money → statistics → FX → money market → bonds → equities → commodities → derivatives → portfolio theory → costs |
| Yale [S6] | Risk, insurance & CAPM → behavioural finance → debt, equity & the corporation → real estate, crises & regulation → futures & options → investment banks, exchanges & brokers → finance and society |
| MIT [S8] | Present value → fixed income → equities → forwards & futures → options → risk & return → portfolio theory → CAPM → capital budgeting → efficient markets |
| NYIF [S10] | Participants → money markets → FX → time value of money → bonds → equity markets → regulation → indices → equity valuation → funds → derivatives → IPO process |

**What this syllabus does:** it follows the requested progression — market structure → instruments → trading and clearing → valuation → risk → regulation → global context — and places time value of money inside the foundations (as SAIFM, MIT and NYIF do) so that every instrument module can use it. Valuation is grouped after trading, as NYIF separates equity markets from equity valuation and CFA separates markets from instruments `[D2]`, `[D3]`.

### A5.2 Assessment patterns

| Pattern | Sources | Adopted here |
|---|---|---|
| Timed multiple-choice, ~70% pass | S2 (50 Q/60 min), S3 (75 Q/105 min), S4 (50 Q/60 min, 70%) | Checkpoint and final exams, 70% pass `[D13]` |
| Verb-graded objectives (know / understand / calculate) | S2 | Every objective tagged by cognitive level `[D16]` |
| Formula sheet + calculator | S4 | Formula sheet provided for all exams |
| Applied, extended assignment | S6 (120-minute housing assignment); S9 and S10 require Excel | Applied task in every module |
| Skills check / case | S8 (case), S10 (desk-ready check) | Capstone project (Part D) |

## A6. Design decisions

| ID | Decision | Evidence |
|---|---|---|
| D1 | Start with a numeracy and vocabulary on-ramp (M0); define every term at first use; glossary table in every module. | Audience has zero background; IMF [S9] needs a pre-course maths module; LSE [S13] and IMF require quantitative prerequisites; SAIFM [S4] teaches statistics early. |
| D2 | Teach time value of money in Part 1, before any instrument. | T04 is common core (7 ●); placed early by S4, S7, S8, S10; CFA [S1] opens its instruments course with it. |
| D3 | Separate "what it is and how it trades" (Parts 2–3) from "what it is worth" (Part 4). | User-specified progression; NYIF [S10] separates equity markets from equity valuation; CFA [S1] separates markets from instruments. |
| D4 | Give issuance (M11) and trading, clearing and settlement (M12) full modules, including market infrastructure. | T20, T21 core; T22 gap in MOOCs; detailed coverage in S1, S2, S5, S11; SIE [S3] gives trading 31% of its exam. |
| D5 | Value bonds, equities and basic derivatives at a depth between licensing exams and MIT. | Depth gap between S2/S3 and S8/S9; T16 thin; IMF [S9] objectives on pricing and yield curves; NYIF [S10] equity valuation tools. |
| D6 | Show every calculation by hand, in a spreadsheet and in Python. | S9 and S10 require Excel; no benchmark teaches Python; learner request. |
| D7 | Give foreign exchange its own module. | T12 thin (●+◐ = 5) yet dedicated in S1, S2, S4, S10. |
| D8 | Use international standards (IOSCO, CPMI-IOSCO) as the regulatory spine, with US, UK/EU, South Africa and India as comparison lenses; include reference-rate reform. | Licensing courses [S2–S5] are single-jurisdiction; global scope required; [R2], [R3], [R4]. |
| D9 | Treat ethics as a graded strand, not a footnote. | T27 dedicated in S1, S2, S3, S4. |
| D10 | Run an emerging-market and Africa case thread across the course and close with M19. | T31 thin; S11, S4, S5 show the value of regional context. |
| D11 | Include market efficiency, behavioural finance and crises. | Yale [S6], MIT [S8], LSE [S13] treat them as central; T28–T29 otherwise thin. |
| D12 | Include fintech, digital assets and ESG as current-practice topics. | S1 (DeFi, FinTech, ESG), S2 (crypto, ESG), S4 (crypto module), S11 (green and social bonds). |
| D13 | Assess with formative auto-graded quizzes, numeric problems, applied tasks, three checkpoint exams, a final exam at 70% and a capstone. | A5.2. |
| D14 | Keep personal finance and advice minimal (investor needs only). | Present in licensing courses (T33) but outside capital-markets scope; better served by a separate course. |
| D15 | Cover career paths briefly in M2. | Yale [S6] and CFI [S12]; helps learners place roles in the system. |
| D16 | Tag objectives by cognitive level (Know, Understand, Apply, Analyse, Evaluate). | CISI [S2] verb-graded objectives; supports item writing. |

---

# Part B — The course

## B1. Course description

**Title:** Introduction to Global Capital Markets (GCM-101)

**Description.** Capital markets are where governments, companies and other organisations raise long-term money by selling securities — tradeable claims such as shares and bonds — to savers and investors. This course explains, from first principles, why these markets exist, who takes part, which instruments are traded, how trades are executed, cleared and settled, how instruments are valued, how risk is measured and managed, how markets are regulated, and how markets differ around the world. It is built for learners with no background in finance and no comfort with financial maths; every term is explained when it first appears, and every calculation is shown step by step.

**Prerequisites.** None in finance. Learners need basic arithmetic (adding, multiplying, dividing, working with percentages). Module M0 rebuilds these skills and introduces the spreadsheet and Python tools.

**Delivery model.** Self-paced online. Each module combines short readings or videos (*Learn*), worked examples and practice problems (*Practise*), and graded checks (*Assess*). Learners progress on mastery: a module is complete when its knowledge check reaches 70%.

**Total effort.** 146 hours core; +15 hours for the optional Python track. At 8–12 hours per week, most learners finish in 12–18 weeks.

**Positioning.** Deeper than conceptual certificates (CFA Investment Foundations: 35–65 hours [S1]) because it adds valuation and computation; lighter than a university finance module (LSE FM250: 7.5 ECTS with quantitative prerequisites [S13]) because it starts from zero.

## B2. Course learning outcomes

By the end of the course, learners will be able to:

| ID | Outcome | Level | Topics | Main modules |
|---|---|---|---|---|
| CLO1 | Explain why capital markets exist and how they move money from savers to the people and organisations that use it. | Understand | T01 | M1 |
| CLO2 | Describe the roles of issuers, investors, intermediaries, market infrastructure and regulators. | Understand | T02, T22 | M2, M12 |
| CLO3 | Interpret policy interest rates, inflation, yield curves and exchange rates, and explain how they move market prices. | Analyse | T03, T12 | M3, M8 |
| CLO4 | Apply time-value-of-money techniques by hand, in a spreadsheet and in Python. | Apply | T04, T05 | M0, M4 |
| CLO5 | Compare the features, uses and risks of money-market instruments, bonds, equities, currencies, derivatives, funds, alternative and digital assets. | Analyse | T06–T19 | M5–M10 |
| CLO6 | Trace a security from issuance through execution, clearing, settlement and custody in markets with different settlement cycles. | Apply | T20–T22 | M11, M12 |
| CLO7 | Value bonds, equities and basic derivatives, and explain what drives each price. | Apply | T08, T10, T16 | M13–M15 |
| CLO8 | Measure and manage risk and return for single instruments and portfolios using diversification, CAPM, duration, VaR and expected loss. | Analyse | T23–T25 | M13, M16, M17 |
| CLO9 | Evaluate market conduct against regulatory objectives and ethical standards; recognise market abuse and financial crime. | Evaluate | T26, T27 | M18 |
| CLO10 | Compare developed and emerging (including African) markets, and draw lessons from crises, behavioural finance, ESG and financial technology. | Evaluate | T28–T31 | M19 (thread throughout) |

## B3. Course map

| Part | Module | Title | Core h | Python h | CLOs |
|---|---|---|:-:|:-:|---|
| 1 Foundations | M0 | Orientation and the numeracy toolkit | 5 | 1.0 | 4 |
| | M1 | What capital markets are and why they exist | 5 | – | 1 |
| | M2 | Who's who: participants, industry structure and careers | 5 | – | 2 |
| | M3 | The economy, interest rates and central banks | 6 | – | 3 |
| | M4 | Time value of money: the language of value | 8 | 1.5 | 4 |
| 2 Instruments | M5 | Money markets | 5 | 0.5 | 5 |
| | M6 | Bonds: features, issuers and markets | 6 | – | 5 |
| | M7 | Equities: shares, companies and corporate actions | 6 | – | 5 |
| | M8 | Foreign exchange | 5 | 0.5 | 3, 5 |
| | M9 | Derivatives: forwards, futures, options and swaps | 7 | 0.5 | 5 |
| | M10 | Funds, alternatives, commodities and digital assets | 6 | 0.5 | 5 |
| | — | **Checkpoint exam 1** (Parts 1–2) | incl. | – | 1–5 |
| 3 Trading | M11 | Primary markets: how securities are issued | 4 | – | 6 |
| | M12 | Secondary markets, trading, clearing and settlement | 8 | 1.0 | 2, 6 |
| 4 Valuation | M13 | Valuing bonds | 9 | 1.5 | 7, 8 |
| | M14 | Valuing equities | 9 | 1.5 | 7 |
| | M15 | Valuing derivatives | 8 | 1.5 | 7 |
| | — | **Checkpoint exam 2** (Parts 3–4) | incl. | – | 6–7 |
| 5 Risk | M16 | Risk, return and portfolios | 7 | 1.5 | 8 |
| | M17 | Managing financial risk | 6 | 1.0 | 8 |
| 6 Regulation | M18 | Regulation, market integrity and ethics | 7 | – | 9 |
| 7 Global | M19 | Global and emerging markets, crises and the future | 6 | – | 10 |
| | — | **Checkpoint exam 3** (Parts 5–7) | incl. | – | 8–10 |
| Capstone | — | Capital-raising and valuation brief | 14 | 2.5 | all |
| Final | — | Review and final exam | 4 | – | all |
| | | **Total** | **146** | **15** | |

Checkpoint exams are counted inside the hours of the module that precedes them.

## B4. Tool tracks

Every worked example in Parts 1, 2 and 4 is shown in three tracks. Learners must complete Track A and Track B; Track C is optional.

| Track | What learners use | Why | Benchmark |
|---|---|---|---|
| **A — By hand** | A basic or scientific calculator (non-programmable is enough) | Builds intuition: you see every step | SAIFM exams allow a non-programmable calculator [S4] |
| **B — Spreadsheet** | Microsoft Excel or Google Sheets | The industry's everyday tool; functions such as `PV`, `RATE`, `NPV`, `IRR` | Required by IMF [S9] and NYIF [S10] |
| **C — Python** | Python 3 in a free notebook (Google Colab or Jupyter), with `numpy`, `pandas` and `scipy` | Repeatable, auditable analysis; increasingly expected in data-rich finance roles | Not offered by any benchmark — gap `[D6]` |

**Python conventions used in this syllabus.** Snippets are short and self-contained; each one can be pasted into an empty notebook cell and run. Rates are written as decimals (`0.08` means 8%).

## B5. Assessment strategy

| Component | Format | Weight | Pass rule |
|---|---|:-:|---|
| Module knowledge checks (M0–M19) | 10–15 auto-graded items: multiple choice, numeric entry (±0.5% tolerance), matching; unlimited attempts from a randomised item bank | 10% | 70% to unlock next module |
| Applied tasks (M4–M17) | Spreadsheet (or Python) submission checked against an answer key and a short written interpretation | 20% | Self/peer-assessed with rubric |
| Checkpoint exams 1–3 | 40 items each, 60 minutes, formula sheet, calculator allowed | 30% (10% each) | 70% |
| Final exam | 80 items (≈60% conceptual, 40% calculation), 120 minutes, formula sheet | 15% | 70% |
| Capstone project | Written brief + valuation workbook (+ optional notebook), rubric in Part D | 25% | 60% on rubric |

**Completion:** pass every checkpoint, the final exam and the capstone, and achieve an overall weighted score of at least 70%.

**Integrity and accessibility.** Item banks are large enough for unique attempts; numeric items use randomised inputs. All videos are captioned; all charts have text descriptions; time limits can be extended for learners who need adjustments.

---

# Part C — Modules

Every module follows the same template: **why it matters → objectives (tagged by level) → subtopics → key terms → worked examples and cases → assessment checklist → hours → benchmark trace.** Worked examples use round, illustrative numbers unless a source is cited; they are not market forecasts or investment advice.

---

## PART 1 — FOUNDATIONS AND MARKET STRUCTURE

---

## M0 — Orientation and the numeracy toolkit

**Hours:** 5 core (Learn 2 · Practise 2 · Assess 1) + 1 Python setup

**Why it matters.** Finance has its own vocabulary and a small set of maths tools that appear everywhere. Getting comfortable with percentages, growth and averages now makes every later module easier.

### Learning objectives
1. **[Apply]** Convert between percentages, decimals and basis points.
2. **[Apply]** Calculate a percentage change and distinguish it from a change in percentage points.
3. **[Apply]** Compound a growth rate over several periods using powers (exponents) on a calculator.
4. **[Apply]** Calculate the mean and standard deviation of a small set of returns.
5. **[Apply]** Build a spreadsheet using cell references and built-in functions; run a Python notebook cell.
6. **[Understand]** Read financial tables and charts: units (thousands, millions, billions, trillions), axes and time periods.

### Subtopics
- How this course works: modules, mastery, tool tracks, the glossary habit
- Percentages, decimals and basis points
  - Percentage change vs percentage-point change
- Growth and compounding (a preview of M4)
  - Why +10% then −10% does not return you to the start
- Exponents and roots on a calculator
- Averages and spread
  - Mean, deviation, variance, standard deviation (formalised in M16)
- Reading financial numbers: currency symbols, "bn" and "tn", decimal places in prices
- Tool set-up
  - Spreadsheet: cells, formulas, absolute references (`$A$1`), functions
  - Python: opening a free notebook, running a cell, printing a result

### Key terms

| Term | Plain-English meaning |
|---|---|
| Percentage | A number out of 100; 8% = 8/100 = 0.08. |
| Basis point (bp) | One-hundredth of a percentage point: 1 bp = 0.01% = 0.0001. Used for small changes in rates. |
| Percentage-point change | The arithmetic difference between two percentages (7.5% → 8.25% is +0.75 points). |
| Percentage change | The change relative to the starting value ((new − old) / old). |
| Compounding | Earning growth on previous growth, so increases multiply rather than add. |
| Exponent | How many times a number is multiplied by itself: 1.08³ = 1.08 × 1.08 × 1.08. |
| Return | The gain or loss on an investment over a period, usually as a percentage of what was invested. |
| Mean | The average: the sum of values divided by how many there are. |
| Standard deviation | A measure of how spread out values are around the mean; in finance, a common measure of risk. |
| Spreadsheet function | A built-in formula, e.g. `=AVERAGE(A1:A5)`. |
| Notebook | An interactive document (e.g. Google Colab) where Python code and results sit side by side. |

### Worked examples

#### Worked example 0.1 — Points, basis points and percent
**Problem.** A central bank raises its policy rate from 7.50% to 8.25%. Describe the change three ways.

**Track A.**
1. Percentage-point change: 8.25 − 7.50 = **0.75 percentage points**.
2. Basis points: 0.75 × 100 = **75 bp**.
3. Relative (percentage) change: 0.75 / 7.50 = 0.10 = **10%**.

**Meaning.** Markets and news reports usually say "75 basis points". Saying "rates rose 10%" is technically correct but easily misread.

#### Worked example 0.2 — Why up 10% then down 10% loses money
**Problem.** A share costs 100. It rises 10%, then falls 10%. What is it worth?

**Track A.** 100 × 1.10 = 110; 110 × 0.90 = **99**. The fall is applied to a bigger base.
**Track B.** `=100*1.1*0.9` → 99.

#### Worked example 0.3 — Average and spread of returns
**Problem.** Five monthly returns: 2%, −1%, 3%, 0%, 1%. Find the mean and the (sample) standard deviation.

**Track A.**
1. Mean = (2 − 1 + 3 + 0 + 1) / 5 = 5 / 5 = **1%**.
2. Deviations from the mean: 1, −2, 2, −1, 0.
3. Squared deviations: 1, 4, 4, 1, 0 → sum = 10.
4. Sample variance = 10 / (5 − 1) = 2.5 (in %²).
5. Standard deviation = √2.5 = **1.58%**.

**Track B.** Enter returns in `A1:A5`; `=AVERAGE(A1:A5)` → 1.00%; `=STDEV.S(A1:A5)` → 1.58%.

**Track C (Python).**
```python
import statistics as st

returns = [0.02, -0.01, 0.03, 0.00, 0.01]
print(round(st.mean(returns), 4))    # 0.01  -> 1%
print(round(st.stdev(returns), 4))   # 0.0158 -> 1.58% (sample standard deviation)
```

### Assessment
- [ ] Knowledge check: 12 items (conversions, percentage vs points, compounding, reading tables)
- [ ] Practice set: 10 short calculations, answers revealed after each attempt
- [ ] Tool check: submit a screenshot of a spreadsheet and a notebook cell that both compute Worked example 0.3

**Benchmark trace:** IMF's pre-course financial-mathematics module [S9]; CFA quantitative concepts (descriptive statistics, dispersion) [S1]; SAIFM statistical concepts [S4]; numeracy assumed by S8, S9, S13 → `[D1]`, `[D6]`.

---

## M1 — What capital markets are and why they exist

**Hours:** 5 core (Learn 2.5 · Practise 1.5 · Assess 1)

**Why it matters.** Before learning any product, learners need the big picture: why societies need a place where savings meet productive uses, and what markets do that individuals cannot do alone.

### Learning objectives
1. **[Understand]** Explain the core problem markets solve: moving money across time and between people with different needs and risk appetites.
2. **[Understand]** Distinguish real assets from financial assets, and direct finance from indirect (intermediated) finance.
3. **[Know]** Name the main market segments: money vs capital; debt vs equity; primary vs secondary; exchange vs over-the-counter; spot vs derivatives.
4. **[Understand]** Describe the economic functions of markets: allocating capital, discovering prices, providing liquidity, transferring risk, producing information and disciplining management.
5. **[Analyse]** Use global market-size data to compare equity and bond markets and the concentration of market activity by country.

### Subtopics
- Savers and spenders: why the two rarely coincide in time, size or appetite for risk
- Real assets (factories, roads, software) vs financial assets (claims on future cash)
- Direct finance (buying a security) vs indirect finance (a bank deposit funding a loan)
- The map of markets
  - Money markets (under one year) and capital markets (longer)
  - Debt markets and equity markets
  - Primary (new issues) and secondary (resale) markets
  - Exchange-traded and over-the-counter (OTC)
  - Spot (cash) markets and derivatives markets
- Functions of markets and what happens when they are missing or shallow
- The global landscape
  - Size of world equity and bond markets; the weight of the US; the rest of the world
  - Local-currency capital markets and economic development (Africa and other emerging markets)

### Key terms

| Term | Plain-English meaning |
|---|---|
| Capital | Money committed for long-term productive use. |
| Capital market | The market for long-term securities, mainly bonds and shares. |
| Money market | The market for short-term borrowing and lending, typically under one year. |
| Security | A tradeable financial claim, e.g. a share or bond. |
| Issuer | The organisation that creates and sells a security to raise money. |
| Investor | A person or organisation that buys securities hoping for a return. |
| Intermediary | A firm that stands between savers and users of capital (bank, broker, fund). |
| Real asset | A physical or intangible asset that produces goods or services. |
| Financial asset | A claim on future cash flows from a real asset or from an issuer. |
| Debt | Borrowed money that must be repaid with interest. |
| Equity | Ownership in a company; a share of its profits and assets after debts are paid. |
| Primary market | Where newly created securities are sold by issuers to investors. |
| Secondary market | Where existing securities are traded between investors. |
| Exchange | A regulated marketplace with standard rules where buyers and sellers meet. |
| Over-the-counter (OTC) | Trading negotiated directly between two parties, not on an exchange. |
| Derivative | A contract whose value depends on the price of something else (the "underlying"). |
| Liquidity | How quickly and cheaply an asset can be turned into cash without moving its price much. |
| Price discovery | The process by which trading reveals what an asset is worth to the market. |
| Market capitalisation | Share price × number of shares: the market value of a company's equity. |

### Worked examples and cases

#### Case 1.1 — The scale of the system (data exercise)
According to SIFMA's 2026 Capital Markets Fact Book, at the end of 2025 global equity market capitalisation was about **US$157.8 trillion** and global fixed income (bonds) outstanding about **US$160.7 trillion**; the US accounted for **43.7%** of equity value and **38.1%** of bonds outstanding [R1].

**Tasks.**
1. Calculate the value of non-US equity markets: 157.8 × (1 − 0.437) = **US$88.8 trillion**.
2. Calculate the value of non-US bonds outstanding: 160.7 × (1 − 0.381) = **US$99.5 trillion**.
3. Discussion: why might a country want deep *local-currency* markets rather than relying on borrowing abroad? (Links to M8 and M19.)

#### Case 1.2 — One saver, one power station (illustrative)
A teacher in Nairobi contributes to a pension fund. The fund buys a 10-year bond issued by an electricity utility, which uses the money to build a solar plant. Learners draw the flow of money and the flow of promises, label each party (saver, intermediary, issuer, investor) and identify which market functions were used.

### Assessment
- [ ] Knowledge check: 12 items
- [ ] Concept map: draw the financial system with at least eight labelled participants and arrows for money and claims
- [ ] Reflection (150 words): map your own financial life (bank account, pension, insurance) onto the system

**Benchmark trace:** T01 is common core (10 ● of 13): CFA C1 M1 [S1]; CISI element 1 [S2]; NISM unit I [S5]; Yale M1 [S6]; Rice M2 "why do markets exist" [S7]; MIT part A [S8]; NYIF day 1 [S10]; JSE "why we need capital markets" and local-market development cases [S11]; CFI "defining capital markets" [S12]. Data [R1] → `[D1]`, `[D10]`.

---

## M2 — Who's who: participants, industry structure and careers

**Hours:** 5 core (Learn 2.5 · Practise 1.5 · Assess 1)

**Why it matters.** Every price and every trade is the result of decisions by specific institutions with specific incentives. Knowing who they are explains much of how markets behave.

### Learning objectives
1. **[Know]** Identify the main issuers (governments, state-owned enterprises, companies, banks, supranational institutions) and investors (retail and institutional).
2. **[Understand]** Explain the "sell side" and the "buy side" and what investment banks, brokers, dealers, market makers, asset managers and custodians do.
3. **[Understand]** Distinguish acting as an agent (broker, on the client's behalf) from acting as a principal (dealer, trading from one's own book).
4. **[Know]** Name the core market infrastructure — exchanges, central counterparties, central securities depositories, payment systems — as a preview of M12.
5. **[Know]** Distinguish statutory regulators from self-regulatory organisations, as a preview of M18.
6. **[Analyse]** Match capital-markets job families to front-, middle- and back-office functions.

### Subtopics
- Issuers: sovereigns, sub-national governments, state-owned enterprises, corporations, financial institutions, supranationals (e.g. development banks)
- Investors: households; pension funds; insurers; asset managers and mutual funds; hedge funds; private equity; sovereign wealth funds; central banks
- The sell side: investment banking (origination), sales and trading, research
- The buy side: traditional (long-only funds) and non-traditional (hedge funds, private capital)
- Agency vs principal; market makers and liquidity provision
- Infrastructure: exchanges and other trading venues; clearing houses; depositories; custodians; registrars; payment systems
- Regulators and self-regulatory organisations; international standard setters
- Careers map: front office (sales, trading, origination, portfolio management), middle office (risk, compliance, product control), back office (operations, settlements), plus technology, data and quantitative roles

### Key terms

| Term | Plain-English meaning |
|---|---|
| Retail investor | An individual investing their own money. |
| Institutional investor | An organisation investing large pools of money (pension fund, insurer, fund manager). |
| Pension fund | A fund that invests contributions to pay retirement income. |
| Asset manager | A firm that invests money on behalf of clients for a fee. |
| Sovereign wealth fund | A state-owned investment fund, often built from commodity revenues or reserves. |
| Sell side | Firms that create, market and trade securities (investment banks, brokers). |
| Buy side | Firms that buy securities to invest (asset managers, pension funds, hedge funds). |
| Investment bank | A firm that helps issuers raise capital and trades securities for clients. |
| Broker | An agent who executes orders on behalf of clients for a commission. |
| Dealer | A firm that buys and sells for its own account, earning the spread. |
| Market maker | A dealer that continuously quotes prices at which it will buy and sell. |
| Custodian | A firm that holds securities safely for investors and processes income and corporate events. |
| Registrar / transfer agent | Keeps the official record of who owns an issuer's securities. |
| Central counterparty (CCP) | A clearing house that becomes buyer to every seller and seller to every buyer. |
| Central securities depository (CSD) | The institution that holds securities electronically and moves ownership at settlement. |
| Regulator | A public authority that sets and enforces market rules. |
| Self-regulatory organisation (SRO) | An industry body with delegated power to set and enforce rules for its members. |
| Front / middle / back office | Revenue-generating roles / control and risk roles / processing and settlement roles. |

### Worked examples and cases

#### Case 2.1 — Who touches a trade? (illustrative, South Africa)
A pension fund's asset manager decides to buy shares in a company listed on the Johannesburg Stock Exchange (JSE). Learners trace the order: asset manager → broker (JSE member) → JSE trading system → clearing → Strate, South Africa's central securities depository [R5] → the fund's custodian. For each step learners state what could go wrong and who bears the cost. The same exercise is repeated in M12 with timings and settlement cycles.

#### Exercise 2.2 — Agent or principal?
Classify six short scenarios (e.g. "a bank quotes you a price to buy your bond and keeps it on its books") as agency or principal, and identify the conflict of interest each creates (links to M18).

### Assessment
- [ ] Knowledge check: 12 items
- [ ] Matching exercise: 15 institutions to 15 functions
- [ ] Career brief (200 words): choose one role, describe a typical day and which modules of this course it relies on

**Benchmark trace:** T02 (8 ●): CFA C1 M2–M3 [S1]; CISI 1.1 [S2]; FINRA SIE 1.1.4 participants and roles [S3]; NYIF day 1 [S10]; CFI sell-side/buy-side and careers [S12]; Yale careers [S6] → `[D15]`.

---

## M3 — The economy, interest rates and central banks

**Hours:** 6 core (Learn 3 · Practise 2 · Assess 1)

**Why it matters.** Interest rates are the price of money, and they move the price of almost every financial asset. Central banks set the shortest rates; markets set the rest by reacting to growth, inflation and policy.

### Learning objectives
1. **[Understand]** Explain gross domestic product (GDP), the business cycle, inflation and unemployment, and why markets track them.
2. **[Understand]** Explain how central banks set a policy rate and use open-market operations, and how this differs from fiscal policy.
3. **[Apply]** Calculate a real interest rate from a nominal rate and inflation.
4. **[Know]** Identify major central banks and today's benchmark (reference) interest rates, and explain why older benchmarks such as LIBOR and JIBAR have been replaced.
5. **[Analyse]** Predict the likely direction of bond prices, currencies and share prices after a surprise in inflation or policy.

### Subtopics
- Economic systems (market, mixed, state-directed) and the role of government
- Output and the business cycle: expansion, peak, contraction, trough
- Inflation, deflation and how inflation is measured (consumer price index)
- Monetary policy: policy rate, open-market operations, quantitative easing, inflation targeting
- Fiscal policy: taxes, spending, deficits and government borrowing
- External accounts: balance of payments and exchange rates (preview of M8)
- Interest rates
  - Nominal vs real rates; the risk-free rate idea
  - Reference rates: overnight risk-free rates (SOFR, SONIA, €STR, ZARONIA) and the retirement of LIBOR and JIBAR
- Reading the calendar: data releases and central-bank meetings; why *surprises* move prices

### Key terms

| Term | Plain-English meaning |
|---|---|
| Gross domestic product (GDP) | The total value of goods and services produced in an economy in a period. |
| Business cycle | The recurring pattern of economic expansion and contraction. |
| Recession | A significant, sustained fall in economic activity. |
| Inflation | A general rise in prices, which reduces what money can buy. |
| Consumer price index (CPI) | A measure of the average price of a basket of household goods and services. |
| Central bank | The public institution that manages money, interest rates and often bank supervision. |
| Monetary policy | Central-bank actions on interest rates and money to keep inflation and the economy stable. |
| Policy rate | The short-term interest rate a central bank sets (often called the repo rate or bank rate). |
| Open-market operations | Central-bank buying or selling of securities to steer short-term rates. |
| Quantitative easing (QE) | Large-scale central-bank purchases of bonds to lower long-term rates. |
| Fiscal policy | Government decisions on taxing and spending. |
| Budget deficit | When government spending exceeds revenue, financed by borrowing. |
| Balance of payments | A record of a country's transactions with the rest of the world. |
| Nominal interest rate | The quoted rate, not adjusted for inflation. |
| Real interest rate | The rate after removing the effect of inflation. |
| Reference (benchmark) rate | A published rate used to set payments on loans, bonds and derivatives. |
| Risk-free rate | The return on an investment with (practically) no default risk, usually short-term government debt. |

### Worked examples and cases

#### Worked example 3.1 — Real interest rate
**Problem.** A deposit pays 10% a year; inflation is 5%. What is the real return?

**Track A.** Real = (1 + nominal) / (1 + inflation) − 1 = 1.10 / 1.05 − 1 = **4.76%**. The shortcut "10 − 5 = 5%" is a close approximation only when rates are low.
**Track B.** `=(1+10%)/(1+5%)-1` → 4.76%.

#### Worked example 3.2 — From news to prices (reasoning chain)
**Problem.** Inflation is published well above expectations. Trace the likely market reaction.

**Answer chain.** Higher-than-expected inflation → markets expect the central bank to raise (or not cut) its policy rate → yields on government bonds rise → bond prices fall (explained in M13) → the currency may strengthen as higher rates attract foreign money (M8) → share prices may fall as future profits are discounted at higher rates (M14). Learners repeat the chain for a growth disappointment.

#### Case 3.1 — When a benchmark rate is retired (South Africa)
For decades, South African floating-rate loans, bonds and swaps referenced JIBAR, a rate based on banks' quoted rates. The South African Reserve Bank announced that JIBAR will cease after its final publication on 31 December 2026, named ZARONIA — a transaction-based overnight rate — as its successor, and set 1 May 2026 as the date after which new contracts should no longer reference JIBAR [R4]. Learners compare this with the earlier global replacement of LIBOR by overnight rates (SOFR in US dollars, SONIA in sterling, €STR in euros) and explain why a rate built on actual transactions is harder to manipulate (link to the LIBOR case in M18).

#### Case 3.2 — Inflation-linked money (Chile)
Yale's course uses Chile's *Unidad de Fomento*, an inflation-indexed unit of account, to show how contracts can be protected from inflation [S6]. Learners explain how pricing a loan in such a unit shifts inflation risk between borrower and lender (link to inflation-linked bonds in M6).

### Assessment
- [ ] Knowledge check: 15 items
- [ ] Data task: download one year of policy-rate and inflation data for two central banks (one developed, one emerging) and chart real rates
- [ ] Short answer: explain the reasoning chain for one real data surprise from the past month

**Benchmark trace:** T03 (5 ●): CFA C4 M2–M3 [S1]; CISI element 2 incl. central banks and data impact [S2]; FINRA SIE 1.3 economic factors [S3]; SAIFM "the economy" [S4]; NYIF central banks and business cycle [S10]; Yale inflation-indexed debt [S6]; reference-rate reform [R4] → `[D8]`, `[D10]`.

---

## M4 — Time value of money: the language of value

**Hours:** 8 core (Learn 3 · Practise 4 · Assess 1) + 1.5 Python

**Why it matters.** Every valuation in this course — bonds, shares, derivatives, projects — is a present value of future cash flows. Master this module and the rest of the course becomes one idea applied many times.

### Learning objectives
1. **[Understand]** Explain why a unit of money today is worth more than the same unit in the future (time preference, inflation, risk).
2. **[Apply]** Calculate future and present values of single sums with annual and more frequent compounding.
3. **[Apply]** Convert a quoted (nominal) rate to an effective annual rate.
4. **[Apply]** Value level annuities and perpetuities.
5. **[Apply]** Calculate net present value (NPV) and internal rate of return (IRR), and use them to accept or reject an investment.
6. **[Evaluate]** Check answers for reasonableness using the rule of 72 and sign conventions.

### Subtopics
- Simple vs compound interest
- Future value and present value; discount factors
- Compounding frequency; nominal vs effective rates
- Streams of cash: annuities (fixed payments for a fixed time) and perpetuities (forever)
- Uneven cash flows; NPV and IRR; the hurdle rate
- Spreadsheet sign conventions (money out is negative, money in is positive)
- Common mistakes: mixing annual rates with monthly periods; timing of the first cash flow

### Key terms

| Term | Plain-English meaning |
|---|---|
| Time value of money | The principle that money available now is worth more than the same amount later. |
| Interest | The price paid for borrowing money, usually a percentage per year. |
| Simple interest | Interest calculated only on the original amount. |
| Compound interest | Interest calculated on the original amount plus interest already earned. |
| Future value (FV) | What an amount today grows to at a given rate. |
| Present value (PV) | What a future amount is worth today at a given rate. |
| Discount rate | The rate used to convert future cash flows into present values; reflects time and risk. |
| Discount factor | `1 / (1 + r)^n`: the present value of one unit received in n periods. |
| Compounding frequency | How many times a year interest is added (annually, semi-annually, monthly…). |
| Nominal (quoted) rate | The stated annual rate before allowing for compounding frequency. |
| Effective annual rate (EAR) | The true annual rate once compounding is included. |
| Annuity | A series of equal payments at regular intervals for a fixed time. |
| Perpetuity | A series of equal payments that continues forever. |
| Cash flow | An amount of money paid or received at a point in time. |
| Net present value (NPV) | The sum of the present values of all cash flows, including the initial cost. |
| Internal rate of return (IRR) | The discount rate at which NPV equals zero. |
| Hurdle rate | The minimum return an investment must earn to be worth doing. |

### Core formulas
```
FV = PV × (1 + r)^n
PV = FV / (1 + r)^n
EAR = (1 + i/m)^m − 1                      (i = quoted annual rate, m = periods per year)
PV of annuity = PMT × [1 − (1 + r)^−n] / r
PV of perpetuity = PMT / r
NPV = Σ CF_t / (1 + r)^t                    (t = 0, 1, 2, …)
IRR: the r that makes NPV = 0
```

### Worked examples

#### Worked example 4.1 — Future value
**Problem.** R10,000 is invested for 5 years at 8% a year, compounded annually. What is it worth at the end?

**Track A.**
1. Growth factor: 1.08^5 = 1.469328.
2. FV = 10,000 × 1.469328 = **R14,693.28**.

**Track B.** `=FV(8%,5,0,-10000)` → 14,693.28 (the initial deposit is entered as negative: money leaves your pocket).

#### Worked example 4.2 — Present value
**Problem.** You will receive US$1,000 in 3 years. At a 6% discount rate, what is it worth today?

**Track A.** PV = 1,000 / 1.06^3 = 1,000 / 1.191016 = **US$839.62**.
**Track B.** `=PV(6%,3,0,-1000)` → 839.62.

#### Worked example 4.3 — Effective annual rate
**Problem.** A loan is quoted at 12% a year, compounded monthly. What is the effective annual rate?

**Track A.** EAR = (1 + 0.12/12)^12 − 1 = 1.01^12 − 1 = **12.68%**.
**Track B.** `=EFFECT(12%,12)` → 12.68%.
**Meaning.** Two offers with the same quoted rate but different compounding are not equal; always compare effective rates. (This is a "be able to calculate" objective in CISI [S2].)

#### Worked example 4.4 — Annuity
**Problem.** What is the value today of 1,000 received at the end of each year for 5 years, at 7%?

**Track A.**
1. Annuity factor = [1 − 1.07^−5] / 0.07 = [1 − 0.712986] / 0.07 = 4.100197.
2. PV = 1,000 × 4.100197 = **4,100.20**.

**Track B.** `=PV(7%,5,-1000)` → 4,100.20.

#### Worked example 4.5 — Perpetuity
**Problem.** A security pays 50 a year forever. At 8%, what is it worth?
**Track A.** PV = 50 / 0.08 = **625**. (This idea returns as the dividend growth model in M14.)

#### Worked example 4.6 — NPV and IRR
**Problem.** A project costs 10,000 today and returns 3,000, 4,000 and 5,000 at the end of years 1–3. Should it go ahead at a 10% hurdle rate?

**Track A.**
1. PV(year 1) = 3,000 / 1.10 = 2,727.27
2. PV(year 2) = 4,000 / 1.21 = 3,305.79
3. PV(year 3) = 5,000 / 1.331 = 3,756.57
4. NPV = −10,000 + 2,727.27 + 3,305.79 + 3,756.57 = **−210.37** → reject at 10%.
5. At 8% the NPV is +176.29, so the IRR lies between 8% and 10%; it is **8.90%**.

**Track B.** Cash flows in `B1:B4` (−10000, 3000, 4000, 5000).
- `=NPV(10%,B2:B4)+B1` → −210.37 (Excel's `NPV` assumes the first value arrives in one period, so the time-0 cost is added separately).
- `=IRR(B1:B4)` → 8.90%.

**Meaning.** The project earns 8.90% a year — less than the 10% required, so it destroys value at that hurdle.

#### Worked example 4.7 — Sanity check with the rule of 72
At 8% a year, money doubles in roughly 72 / 8 = 9 years (exact: 9.01 years). Use this to catch keying errors.

#### Track C — Python for this module
```python
from scipy.optimize import brentq

def fv(pv, r, n):            # future value of a single sum
    return pv * (1 + r) ** n

def pv(fv, r, n):            # present value of a single sum
    return fv / (1 + r) ** n

def ear(nominal, m):         # effective annual rate from a quoted rate compounded m times a year
    return (1 + nominal / m) ** m - 1

def annuity_pv(pmt, r, n):   # present value of n equal end-of-period payments
    return pmt * (1 - (1 + r) ** -n) / r

def npv(rate, cashflows):    # cashflows[0] happens today (t = 0)
    return sum(cf / (1 + rate) ** t for t, cf in enumerate(cashflows))

def irr(cashflows):          # the rate that makes NPV = 0
    return brentq(lambda r: npv(r, cashflows), -0.99, 1.0)

print(round(fv(10_000, 0.08, 5), 2))          # 14693.28
print(round(pv(1_000, 0.06, 3), 2))           # 839.62
print(round(ear(0.12, 12), 4))                # 0.1268
print(round(annuity_pv(1_000, 0.07, 5), 2))   # 4100.2
project = [-10_000, 3_000, 4_000, 5_000]
print(round(npv(0.10, project), 2))           # -210.37
print(round(irr(project), 4))                 # 0.089
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 8 numeric)
- [ ] Applied task: "Which offer is better?" — compare three savings or loan offers quoted with different compounding, and evaluate a small solar-panel investment with NPV and IRR in a spreadsheet
- [ ] Optional Python task: reproduce the applied task in a notebook

**Benchmark trace:** T04 (7 ●): CFA C3 M1 lessons on time value, PV/FV, NPV [S1]; CISI effective annual rate calculation (9.2.3) [S2]; SAIFM time value of money [S4]; Yale compound interest, annuities, consols [S6]; Rice review of finance tools [S7]; MIT present-value relations [S8]; IMF financial-mathematics module [S9]; NYIF time value of money and annuities [S10] → `[D2]`, `[D6]`.

---

## PART 2 — INSTRUMENTS

Part 2 explains *what* each instrument is, *who* uses it and *why*, and *what can go wrong*. Simple measures (yields, ratios, payoffs) appear here; full valuation follows in Part 4 `[D3]`.

---

## M5 — Money markets

**Hours:** 5 core (Learn 2 · Practise 2 · Assess 1) + 0.5 Python

**Why it matters.** Money markets are where banks, companies and governments manage day-to-day cash. They are the first link between central-bank policy and the rest of the financial system, and stress here spreads fast.

### Learning objectives
1. **[Understand]** Distinguish money-market instruments from capital-market instruments and explain who uses each.
2. **[Know]** Describe Treasury bills, commercial paper, certificates of deposit, repurchase agreements, interbank deposits, bankers' acceptances and money-market funds.
3. **[Apply]** Price a discount instrument and convert between discount yield, money-market yield and bond-equivalent yield.
4. **[Apply]** Calculate repo interest and explain collateral and haircuts.
5. **[Understand]** Explain why day-count conventions differ between markets and why they matter.
6. **[Evaluate]** Assess the risks of "cash-like" products, using a historical failure.

### Subtopics
- Purpose: liquidity management for banks, corporate treasurers and governments
- Instruments
  - Treasury bills (government, discount basis)
  - Commercial paper (unsecured, short-term company debt)
  - Negotiable certificates of deposit (bank deposits that can be sold)
  - Repurchase agreements (repos) and reverse repos; collateral and haircuts
  - Interbank lending; bankers' acceptances
  - Money-market funds
- Pricing and yield conventions; day counts (e.g. 360-day years in US-dollar money markets, 365-day years in sterling and rand markets — always check the local convention)
- Links to monetary policy: how the policy rate feeds through to money-market rates
- Risks: credit, liquidity, run risk

### Key terms

| Term | Plain-English meaning |
|---|---|
| Treasury bill (T-bill) | A short-term government IOU sold below its face value and repaid at face value. |
| Discount instrument | A security that pays no interest; the return is the gap between purchase price and face value. |
| Face (par) value | The amount repaid at maturity. |
| Maturity | The date on which the issuer repays the face value. |
| Discount yield | Return quoted as a percentage of face value, annualised on a set day basis. |
| Money-market yield | Return quoted as a percentage of the price paid, annualised. |
| Bond-equivalent yield | A money-market yield on a 365-day basis, comparable with bond yields. |
| Day-count convention | The rule for counting days and the length of the year in interest calculations. |
| Commercial paper | Short-term unsecured borrowing by large companies. |
| Certificate of deposit (CD/NCD) | A fixed-term bank deposit that can be sold to someone else before maturity. |
| Repurchase agreement (repo) | A sale of securities with an agreement to buy them back later at a higher price — economically a secured loan. |
| Collateral | Assets pledged to protect a lender if the borrower fails to repay. |
| Haircut | The percentage by which collateral value exceeds the cash lent, protecting the lender. |
| Money-market fund | A fund that invests in short-term instruments and aims to keep its unit value stable. |
| Net asset value (NAV) | A fund's assets minus liabilities, per unit or share. |

### Worked examples and case

#### Worked example 5.1 — Pricing a Treasury bill and comparing yields
**Problem.** A 91-day US Treasury bill with face value US$10,000 is quoted at a 4.00% discount yield (360-day basis). Find its price, its money-market yield and its bond-equivalent yield.

**Track A.**
1. Price = Face × (1 − d × t / 360) = 10,000 × (1 − 0.04 × 91/360) = 10,000 × 0.989889 = **US$9,898.89**.
2. Return over 91 days = 10,000 / 9,898.89 − 1 = 1.0214%.
3. Money-market yield (360) = 1.0214% × 360 / 91 = **4.04%**.
4. Bond-equivalent yield (365) = 1.0214% × 365 / 91 = **4.10%**.

**Track B.** With settlement 6 Oct 2026 and maturity 5 Jan 2027 (91 days):
- `=TBILLPRICE(DATE(2026,10,6),DATE(2027,1,5),4%)` → 98.98889 per 100 of face.
- `=TBILLEQ(DATE(2026,10,6),DATE(2027,1,5),4%)` → 4.10%.

**Meaning.** The same instrument can be quoted three ways; always compare like with like.

#### Worked example 5.2 — A repo trade
**Problem.** A bank needs cash for 7 days. It sells government bonds worth 10,200,000 to a fund for 10,000,000 and agrees to buy them back in 7 days at a repo rate of 7% (365-day basis). What is the repurchase price and the haircut?

**Track A.**
1. Repo interest = 10,000,000 × 0.07 × 7/365 = **13,424.66**.
2. Repurchase price = **10,013,424.66**.
3. Haircut = (10,200,000 − 10,000,000) / 10,200,000 = **1.96%**.

**Meaning.** The fund is a secured lender; if the bank fails, the fund keeps bonds worth more than the cash it lent.

#### Case 5.1 — "Breaking the buck" (US, 2008)
In September 2008 a large US money-market fund, the Reserve Primary Fund, saw its unit value fall below US$1.00 after losses on commercial paper issued by Lehman Brothers, triggering redemptions across the industry. **Discussion:** why did investors treat the fund as cash, and what does this teach about liquidity and run risk? (Revisited in M17 and M19.)

#### Track C — Python
```python
def tbill_price(face, discount_rate, days, basis=360):
    return face * (1 - discount_rate * days / basis)

def money_market_yield(face, price, days, basis=360):
    return (face / price - 1) * basis / days

price = tbill_price(10_000, 0.04, 91)
print(round(price, 2))                                        # 9898.89
print(round(money_market_yield(10_000, price, 91), 4))        # 0.0404
print(round(money_market_yield(10_000, price, 91, 365), 4))   # 0.041 (bond-equivalent yield)
print(round(10_000_000 * 0.07 * 7 / 365, 2))                  # 13424.66 (repo interest)
```

### Assessment
- [ ] Knowledge check: 12 items (≥ 5 numeric)
- [ ] Applied task: download current T-bill rates for two countries, convert to a common bond-equivalent basis and compare with each country's policy rate

**Benchmark trace:** T06 (5 ●; 10 ●+◐): CISI 5.1–5.2 incl. T-bills, CP, CDs, money-market funds [S2]; SAIFM money market [S4]; Rice money-market instruments [S7]; IMF module on pricing money-market instruments [S9]; NYIF money markets incl. repos and T-bill yield [S10]; FINRA SIE money-market instruments [S3] → `[D2]`, `[D6]`.

---

## M6 — Bonds: features, issuers and markets

**Hours:** 6 core (Learn 3 · Practise 2 · Assess 1)

**Why it matters.** Bonds are the largest securities market in the world [R1] and the main way governments fund themselves. Understanding their features is the base for bond valuation (M13) and for most of risk management.

### Learning objectives
1. **[Know]** Define face value, coupon, coupon frequency, maturity, issue price and yield.
2. **[Know]** Classify bonds by issuer (sovereign, sub-sovereign, state-owned, corporate, supranational) and by structure (fixed, zero-coupon, floating-rate, inflation-linked, callable, convertible, perpetual/hybrid, asset-backed, covered, sukuk).
3. **[Understand]** Explain seniority, security and covenants, and how they affect recovery after default.
4. **[Understand]** Explain the role of credit-rating agencies and the line between investment grade and non-investment grade.
5. **[Understand]** Describe domestic, foreign and Eurobond markets and the choice between local and hard currency.
6. **[Apply]** Calculate current (flat) yield and explain the inverse relationship between price and yield.
7. **[Analyse]** Identify the main risks of a bond: interest-rate, credit, inflation, liquidity, reinvestment, currency and call risk.

### Subtopics
- Anatomy of a bond; reading a bond description
- Who issues and why: budget financing, infrastructure, corporate investment, bank funding
- Bond structures
  - Fixed-rate; zero-coupon; floating-rate notes (coupon reset to a reference rate — link to M3)
  - Inflation-linked bonds
  - Embedded options: callable, putable, convertible
  - Securitised debt: asset-backed securities, mortgage-backed securities, covered bonds
  - Hybrid and perpetual bonds
  - Islamic finance: sukuk (asset-based certificates structured without interest)
  - Labelled bonds: green, social, sustainability, sustainability-linked, blue
- Seniority (senior vs subordinated), secured vs unsecured, covenants
- Credit ratings and spreads (spreads valued in M13)
- Where bonds are issued and traded: auctions, syndicates, dealer (OTC) markets, electronic platforms, exchange listings
- Retail access and innovation in emerging markets

### Key terms

| Term | Plain-English meaning |
|---|---|
| Bond | A tradeable loan: the issuer promises to pay interest and repay the face value on set dates. |
| Coupon | The interest payment on a bond, stated as a percentage of face value. |
| Coupon frequency | How often coupons are paid (annual, semi-annual, quarterly). |
| Yield | The return an investor earns if they buy the bond at today's price (refined in M13). |
| Current (flat) yield | Annual coupon ÷ current price; ignores gains or losses to maturity. |
| Zero-coupon bond | A bond with no coupons, sold at a discount and repaid at face value. |
| Floating-rate note (FRN) | A bond whose coupon resets periodically to a reference rate plus a margin. |
| Inflation-linked bond | A bond whose payments rise with an inflation index. |
| Callable bond | The issuer may repay early, usually when rates have fallen. |
| Convertible bond | Can be exchanged for the issuer's shares on set terms. |
| Asset-backed security (ABS) | A bond repaid from a pool of loans or receivables. |
| Covered bond | A bank bond backed by a ring-fenced pool of assets *and* the bank's own promise. |
| Sukuk | An Islamic finance certificate giving investors a share in an asset's returns instead of interest. |
| Seniority | The order in which creditors are repaid if the issuer fails. |
| Covenant | A promise in the bond contract that restricts what the issuer may do. |
| Credit rating | An agency's opinion of an issuer's ability to pay its debts. |
| Investment grade | Ratings considered to carry relatively low default risk. |
| Default | Failure to pay interest or principal on time. |
| Eurobond | A bond issued outside the issuer's home market, often in a foreign currency. |
| Green bond | A bond whose proceeds are used for environmental projects. |

### Worked examples and cases

#### Worked example 6.1 — Reading a bond description (illustrative)
"*Utility X 9.25% senior unsecured notes due 2033, ZAR 1,000,000 denomination, semi-annual, rated BB.*"
Learners identify: issuer, coupon (9.25% a year, paid as 4.625% every six months), currency (rand), maturity year, ranking (senior but unsecured), and rating category (non-investment grade).

#### Worked example 6.2 — Current (flat) yield
**Problem.** A bond with a 6% annual coupon trades at 95 (per 100 face). What is its current yield?
**Track A.** 6 / 95 = **6.32%**. **Track B.** `=6/95`.
**Meaning.** The current yield is above the coupon because the bond trades below face value. It ignores the 5-point gain at maturity; M13 shows the fuller yield-to-maturity measure.

#### Worked example 6.3 — Why prices fall when yields rise (intuition)
You own a bond paying 6%. New, similar bonds now pay 8%. No buyer will pay full price for your lower coupon, so your bond's price must fall until its overall return matches 8%. Learners state the reverse case.

#### Case 6.1 — A government bond on a mobile phone (Kenya)
The JSE masterclass highlights Kenya's M-Akiba, a government retail bond distributed through mobile phones, as an example of product innovation that widens access to capital markets [S11]. **Discussion:** what problems (minimum investment size, distribution cost, liquidity) does mobile distribution solve, and which risks remain?

#### Case 6.2 — Local versus hard currency
A government can borrow in its own currency at home or in US dollars or euros abroad (Eurobonds). Learners list the trade-offs: foreign borrowing may be cheaper or larger, but a weaker local currency raises the cost of repaying it. (Connects to the sovereign defaults studied in M19.)

### Assessment
- [ ] Knowledge check: 15 items
- [ ] Classification task: given ten real bond descriptions from a public listing (a government, a bank, a utility, a green bond, a sukuk…), identify issuer type, structure, ranking and main risk

**Benchmark trace:** T07 is the most widely taught topic (11 ●): CFA C3 M3 incl. seniority, bond types, embedded provisions [S1]; CISI element 4 incl. Eurobonds, ABS, covered bonds, FRNs, ratings [S2]; FINRA SIE debt instruments [S3]; SAIFM bond and long-term debt market [S4]; NISM debt securities [S5]; NYIF bond markets incl. ratings and spreads [S10]; JSE green, blue and social bonds and M-Akiba [S11]; CISI Islamic finance [S2] → `[D10]`, `[D12]`.

---

## M7 — Equities: shares, companies and corporate actions

**Hours:** 6 core (Learn 3 · Practise 2 · Assess 1)

**Why it matters.** Shares give ordinary people a stake in the profits of the world's companies. Knowing what a shareholder owns — and how corporate events change it — is essential before valuing a share in M14.

### Learning objectives
1. **[Understand]** Explain how companies are formed, limited liability, and the difference between private and public (listed) companies.
2. **[Know]** Compare ordinary (common) and preference (preferred) shares and the rights they carry.
3. **[Apply]** Calculate market capitalisation and dividend yield.
4. **[Understand]** Explain corporate actions — dividends (with key dates), share splits, consolidations, bonus issues, rights issues, buybacks and takeovers — and classify them as mandatory, voluntary or mandatory with options.
5. **[Apply]** Calculate the theoretical ex-rights price and the value of a right, and the effect of a share split.
6. **[Know]** Describe depositary receipts and dual listings.
7. **[Apply]** Explain and compute how price-weighted, market-capitalisation-weighted and equal-weighted indices behave.
8. **[Analyse]** Identify the risks of owning shares: price, liquidity, issuer and currency risk.

### Subtopics
- The company: shareholders, directors, limited liability, annual general meetings
- Private vs public companies; listing (detail in M11)
- Share classes; voting rights; pre-emption rights; residual claim
- Returns from shares: dividends and capital gains
- Corporate actions and their mechanics
- Depositary receipts (ADRs, GDRs) and cross-listings
- Stock-market indices: purpose, construction, weighting methods, free float
- Risks of equity ownership

### Key terms

| Term | Plain-English meaning |
|---|---|
| Share (stock) | A unit of ownership in a company. |
| Limited liability | Shareholders can lose no more than they invested. |
| Ordinary (common) share | Carries voting rights and a claim to profits after all others are paid. |
| Preference (preferred) share | Pays a fixed dividend before ordinary shareholders, usually without voting rights. |
| Dividend | A cash payment of profits to shareholders. |
| Ex-dividend date | From this date a buyer no longer receives the next dividend. |
| Record date | The date on which the company checks who its shareholders are for a payment. |
| Dividend yield | Annual dividend ÷ share price. |
| Capital gain | The increase in an asset's price. |
| Corporate action | An event initiated by a company that affects its securities. |
| Share split | Each share is divided into more shares; the price falls in proportion. |
| Rights issue | New shares offered to existing shareholders, usually at a discount, in proportion to their holdings. |
| Theoretical ex-rights price (TERP) | The expected share price after a rights issue. |
| Share buyback | The company purchases its own shares. |
| Depositary receipt | A certificate traded in one market representing shares of a foreign company. |
| Stock index | A number tracking the value of a defined group of shares. |
| Free float | Shares available for public trading (excludes locked-up strategic holdings). |

### Worked examples and case

#### Worked example 7.1 — Market capitalisation and dividend yield
**Problem.** A company has 400 million shares priced at R50; it pays an annual dividend of R2.50.
**Track A.** Market cap = 400m × 50 = **R20 billion**. Dividend yield = 2.50 / 50 = **5%**.
**Track B.** `=400000000*50`; `=2.5/50`.

#### Worked example 7.2 — Rights issue (TERP)
**Problem.** A share trades at 50. The company offers 1 new share for every 4 held at 40. What is the theoretical ex-rights price and the value of each right?

**Track A.**
1. Value of 4 old shares: 4 × 50 = 200.
2. Add 1 new share at 40: total 240 for 5 shares.
3. TERP = 240 / 5 = **48**.
4. Value of a right (to buy one new share) = 48 − 40 = **8**.
5. Check: a holder of 4 shares who sells the right has 4 × 48 + 8 = 200 — unchanged.

**Track B.** `=(4*50+1*40)/5` → 48.
**Meaning.** A rights issue does not make shareholders richer or poorer *if* they act; doing nothing would cost them the value of the right.

#### Worked example 7.3 — Share split
**Problem.** You own 100 shares at 80. The company does a 2-for-1 split.
**Track A.** You now own 200 shares at about 40; value stays at **8,000**. Splits change the number of slices, not the size of the cake.

#### Worked example 7.4 — How index weighting changes the answer
**Problem.** An index has three shares. Over one day A rises from 100 to 110, B falls from 20 to 19, C is unchanged at 50. Shares outstanding: A 10m, B 200m, C 40m. What is the index return under each method?

**Track A.**
1. *Price-weighted* (sum of prices): 170 → 179, return **+5.29%**. The high-priced share dominates.
2. *Market-cap-weighted*: total value 7,000m → 6,900m, return **−1.43%**. The largest company dominates.
3. *Equal-weighted*: average of +10%, −5%, 0% = **+1.67%**.

**Track C (optional).**
```python
stocks = {   # name: (price_before, price_after, shares_outstanding)
    "A": (100, 110, 10_000_000),
    "B": (20, 19, 200_000_000),
    "C": (50, 50, 40_000_000),
}
before = sum(b for b, a, n in stocks.values())
after = sum(a for b, a, n in stocks.values())
cap_before = sum(b * n for b, a, n in stocks.values())
cap_after = sum(a * n for b, a, n in stocks.values())
equal = sum(a / b - 1 for b, a, n in stocks.values()) / len(stocks)
print(f"price-weighted {after / before - 1:.2%}")          # 5.29%
print(f"cap-weighted   {cap_after / cap_before - 1:.2%}")  # -1.43%
print(f"equal-weighted {equal:.2%}")                       # 1.67%
```

#### Case 7.1 — Listing abroad
Learners compare a company listing only at home with one that also issues depositary receipts in New York or London: who gains access, what extra disclosure and currency issues arise, and why emerging-market companies often choose this route.

### Assessment
- [ ] Knowledge check: 15 items (≥ 5 numeric)
- [ ] Corporate-action log: find three real corporate actions announced on an exchange's news service this month and classify each (mandatory, voluntary, mandatory with options) with its key dates

**Benchmark trace:** T09 (8 ●): CISI element 3 incl. TERP calculations, depositary receipts, indices, corporate actions [S2]; CFA C3 M2 incl. corporate actions [S1]; FINRA SIE equity securities and corporate actions [S3]; SAIFM equity market [S4]; NISM equity [S5]; Yale shares, dividends, dilution, buybacks [S6]; NYIF common/preferred, rights, DRs and index construction [S10].

---

## M8 — Foreign exchange

**Hours:** 5 core (Learn 2 · Practise 2 · Assess 1) + 0.5 Python

**Why it matters.** Every cross-border investment, trade payment and foreign-currency loan passes through the foreign-exchange (FX) market. Exchange rates can add to or wipe out an investment's return, and currency stress sits behind many emerging-market crises.

### Learning objectives
1. **[Understand]** Read an exchange-rate quote, identifying the base and quote currency, the bid, the ask and the spread.
2. **[Understand]** Describe the structure of the FX market: over-the-counter dealing, main participants, spot and forward settlement, and settlement-risk controls.
3. **[Apply]** Convert amounts at bid and ask, and calculate cross rates.
4. **[Apply]** Calculate a forward exchange rate using covered interest-rate parity and explain forward points.
5. **[Understand]** Distinguish spot, forwards, FX swaps and cross-currency swaps.
6. **[Understand]** Compare exchange-rate regimes: free float, managed float, pegs, currency boards and currency unions, and explain exchange controls.
7. **[Analyse]** Calculate how currency moves change a foreign investor's return.

### Subtopics
- What an exchange rate is; quoting conventions; pips
- Market structure: dealers, banks, corporates, asset managers, central banks; continuous global trading
- Spot (settled two business days after trade for most currency pairs) and forwards
- Settlement risk and payment-versus-payment systems
- Interest-rate parity and forward pricing
- FX swaps (short-term funding) and cross-currency swaps (longer-term, in M9)
- What moves exchange rates: interest differentials, inflation, trade and capital flows, commodity prices, risk appetite, policy
- Regimes in practice: floating currencies, managed floats, the CFA franc zones pegged to the euro, the Common Monetary Area linking Lesotho, Namibia and Eswatini to the rand; exchange controls
- Currency risk for investors, importers, exporters and borrowers

### Key terms

| Term | Plain-English meaning |
|---|---|
| Exchange rate | The price of one currency in terms of another. |
| Base currency | The first currency in a pair; one unit of it is priced (in USD/ZAR, the dollar). |
| Quote currency | The currency in which the price is given (in USD/ZAR, the rand). |
| Bid / ask (offer) | The dealer's buying price / selling price. |
| Spread | Ask minus bid: the dealer's margin and a cost to the client. |
| Pip | The smallest standard price increment, usually 0.0001. |
| Cross rate | An exchange rate between two currencies calculated through a third, usually the US dollar. |
| Spot | A deal for near-immediate settlement (typically two business days). |
| Forward | An agreement today to exchange currencies at a fixed rate on a future date. |
| Forward points | The difference between forward and spot rates, quoted in pips. |
| Interest-rate parity | The rule that forward rates reflect the interest-rate difference between two currencies. |
| FX swap | A spot exchange combined with a reverse forward exchange; used for short-term funding. |
| Peg | A policy fixing a currency's value against another currency. |
| Currency union | Countries sharing a currency or a fixed common exchange-rate system. |
| Exchange control | Government rules limiting the movement of money across borders. |
| Settlement risk | The risk of paying one currency and not receiving the other. |

### Worked examples and cases

#### Worked example 8.1 — Bid, ask and the cost of a spread (illustrative rates)
**Problem.** A dealer quotes USD/ZAR 17.9950 / 18.0050. A client buys US$10,000 and later sells US$10,000 at the same quote.
**Track A.** Buying: 10,000 × 18.0050 = **R180,050**. Selling: 10,000 × 17.9950 = **R179,950**. Round-trip cost = **R100**.

#### Worked example 8.2 — Cross rate
**Problem.** EUR/USD = 1.1000 and USD/ZAR = 18.0000. What is EUR/ZAR?
**Track A.** 1 euro buys 1.10 dollars, each worth 18 rand: 1.10 × 18.00 = **19.8000**.

#### Worked example 8.3 — Forward rate by interest-rate parity
**Problem.** Spot USD/ZAR is 18.0000. One-year interest rates are 7.5% in rand and 4.0% in dollars. What is the one-year forward rate?

**Track A.**
1. Forward = Spot × (1 + r_quote) / (1 + r_base) = 18.0000 × 1.075 / 1.04.
2. Forward = **18.6058**; forward points = +6,058 pips.

**Track B.** `=18*(1+7.5%)/(1+4%)`.
**Meaning.** The rand trades at a forward *discount* (more rand per dollar) because rand interest rates are higher. If it did not, an investor could earn a riskless profit by borrowing in one currency and lending in the other — the arbitrage logic returns in M15.

#### Worked example 8.4 — Currency and a foreign investor's return
**Problem.** A US investor buys JSE-listed shares. The shares rise 10% in rand, but the rand weakens from 18.00 to 19.00 per dollar. What is the return in dollars?
**Track A.** (1.10 × 18.00 / 19.00) − 1 = **+4.21%**. More than half the local gain was lost to currency.

#### Case 8.1 — When a regime changes
Learners compare two episodes: Thailand's decision to float the baht in 1997, which marked the start of the Asian financial crisis (M19), and Nigeria's 2023 unification of its official exchange-rate windows, after which the naira weakened sharply. **Discussion:** who wins and who loses when a managed currency is allowed to move more freely — exporters, importers, foreign-currency borrowers, foreign investors?

#### Track C — Python
```python
spot, r_zar, r_usd, years = 18.00, 0.075, 0.04, 1
forward = spot * (1 + r_zar * years) / (1 + r_usd * years)
print(round(forward, 4), round((forward - spot) * 10_000))   # 18.6058 6058 (forward points)

usd_return = (1 + 0.10) * 18.00 / 19.00 - 1
print(f"{usd_return:.2%}")                                     # 4.21%
```

### Assessment
- [ ] Knowledge check: 12 items (≥ 6 numeric)
- [ ] Applied task: for one emerging-market and one developed-market currency against the US dollar, chart five years of spot rates alongside the interest-rate gap; explain whether forward rates would have predicted the moves

**Benchmark trace:** T12 is thin across the field (●+◐ = 5) but dedicated in CFA C4 M3 [S1]; CISI 5.4 incl. forward rate by interest-rate parity [S2]; SAIFM foreign exchange market [S4]; NYIF FX structure, cross rates and forwards [S10] → `[D7]`, `[D10]`.

---

## M9 — Derivatives: forwards, futures, options and swaps

**Hours:** 7 core (Learn 3 · Practise 3 · Assess 1) + 0.5 Python

**Why it matters.** Derivatives let firms and investors transfer risks they do not want to people willing to bear them. Misused, the same leverage can bring down institutions. This module covers how they work; M15 covers how they are priced.

### Learning objectives
1. **[Understand]** Define a derivative and its underlying, and explain hedging, speculation and arbitrage.
2. **[Understand]** Compare forwards and futures: customisation vs standardisation, OTC vs exchange, counterparty risk vs central clearing.
3. **[Apply]** Calculate daily gains and losses on a futures position, the margin account balance and any margin call.
4. **[Understand]** Define calls and puts, holder and writer, premium, strike, expiry, American and European exercise, and moneyness.
5. **[Apply]** Draw and calculate option payoffs and profits at expiry, including break-even prices.
6. **[Understand]** Explain interest-rate swaps, cross-currency swaps and credit default swaps.
7. **[Analyse]** Choose an appropriate derivative to hedge a given exposure.
8. **[Evaluate]** Assess how leverage and weak controls can turn derivatives into a source of failure.

### Subtopics
- What derivatives are; underlying assets (shares, indices, rates, currencies, commodities, credit)
- Uses: hedging, speculation, arbitrage
- Forwards; futures; contract specifications; exchanges and clearing houses; initial and variation margin
- Options: terminology; payoff diagrams; covered and naked positions; simple strategies (protective put, covered call)
- Swaps: interest-rate swaps, cross-currency swaps, credit default swaps
- OTC derivative documentation and post-2008 reforms (central clearing, trade reporting — detail in M12 and M18)
- Risks: leverage, counterparty, basis, liquidity, operational

### Key terms

| Term | Plain-English meaning |
|---|---|
| Underlying | The asset, rate or index whose price determines a derivative's value. |
| Hedging | Taking a position that offsets an existing risk. |
| Speculation | Taking risk to profit from expected price moves. |
| Arbitrage | Locking in a riskless profit from inconsistent prices. |
| Forward contract | A private agreement to buy or sell an asset at a set price on a future date. |
| Futures contract | A standardised, exchange-traded forward with daily settlement through a clearing house. |
| Long / short | Having bought (benefits if price rises) / having sold (benefits if price falls). |
| Initial margin | The deposit required to open a futures position. |
| Variation margin | Daily payments that settle gains and losses on futures. |
| Maintenance margin | The minimum balance before a margin call is made. |
| Margin call | A demand to top up the margin account. |
| Contract multiplier | The currency value of a one-point move in a futures price. |
| Option | The right, but not the obligation, to buy or sell at a set price. |
| Call / put | Right to buy / right to sell. |
| Holder / writer | Buyer of the option (pays premium) / seller (receives premium, takes the obligation). |
| Strike (exercise) price | The price at which the option can be exercised. |
| Premium | The price paid for an option. |
| In / at / out of the money | Whether exercising now would be profitable / break even / unprofitable. |
| European / American option | Exercisable only at expiry / at any time up to expiry. |
| Interest-rate swap | An exchange of fixed-rate for floating-rate interest payments on a notional amount. |
| Notional amount | The reference amount used to calculate swap payments; not itself exchanged in an interest-rate swap. |
| Credit default swap (CDS) | Insurance-like protection against the default of a borrower, paid for by a regular premium. |

### Worked examples and case

#### Worked example 9.1 — Hedging an import bill with a forward
**Problem.** A South African importer must pay US$1,000,000 in one year. It locks in the forward rate of 18.6058 from Worked example 8.3.
**Track A.** Rand cost fixed at 1,000,000 × 18.6058 = **R18,605,800**. If spot ends at 20.00, the unhedged cost would have been R20,000,000; if spot ends at 17.00, R17,000,000. The hedge removes uncertainty in both directions — it is insurance against loss, paid for by giving up possible gains.

#### Worked example 9.2 — Futures: daily settlement and a margin call
**Problem.** A trader buys 2 equity-index futures at 70,000. Multiplier: 10 per index point. Initial margin 25,000 per contract (50,000 total); maintenance margin 20,000 per contract (40,000 total). A margin call restores the balance to the initial margin. Settlement prices over four days: 70,400; 69,500; 69,300; 70,100.

**Track A.**

| Day | Settlement | Change (points) | Gain/loss (= change × 10 × 2) | Balance | Margin call |
|---|---|---|---|---|---|
| 0 | 70,000 | – | – | 50,000 | – |
| 1 | 70,400 | +400 | +8,000 | 58,000 | 0 |
| 2 | 69,500 | −900 | −18,000 | 40,000 | 0 (at, not below, maintenance) |
| 3 | 69,300 | −200 | −4,000 | 36,000 | **14,000** (restore to 50,000) |
| 4 | 70,100 | +800 | +16,000 | 66,000 | 0 |

Total gain = (70,100 − 70,000) × 10 × 2 = **+2,000**. The trader ends up only slightly ahead, but had to find 14,000 in cash on day 3 — this is how leverage creates liquidity pressure.

#### Worked example 9.3 — Option payoffs at expiry
**Problem.** A call with strike 100 costs 5; a put with strike 100 costs 4. Find the holder's profit at several expiry prices.

| Price at expiry | Call payoff | Call profit | Put payoff | Put profit |
|---|---|---|---|---|
| 80 | 0 | −5 | 20 | +16 |
| 90 | 0 | −5 | 10 | +6 |
| 96 | 0 | −5 | 4 | 0 (break-even) |
| 100 | 0 | −5 | 0 | −4 |
| 105 | 5 | 0 (break-even) | 0 | −4 |
| 110 | 10 | +5 | 0 | −4 |
| 120 | 20 | +15 | 0 | −4 |

**Rules.** Call payoff = max(S − K, 0); put payoff = max(K − S, 0); profit = payoff − premium. Break-even: call at K + premium (105); put at K − premium (96). The writer's profit is the mirror image.
**Track B.** `=MAX(A2-100,0)-5` and `=MAX(100-A2,0)-4`, filled down; chart with a line graph.

#### Worked example 9.4 — An interest-rate swap turns floating into fixed
**Problem.** A company has a 50 million floating-rate loan costing the reference rate + 2%. It enters a swap: it pays 7% fixed and receives the reference rate on 50 million. What is its all-in cost if the reference rate is 6%? If it is 8%?
**Track A.**
- At 6%: loan 8% − received 6% + paid 7% = **9%**.
- At 8%: loan 10% − received 8% + paid 7% = **9%**.
The swap converts an uncertain cost into a fixed 9% (7% swap rate + 2% loan margin). Only interest flows are exchanged; the 50 million notional never changes hands.

#### Worked example 9.5 — A credit default swap
**Problem.** An investor buys 5-year protection on 10 million of a company's bonds at 150 basis points a year. The company defaults; bondholders recover 40%.
**Track A.** Annual premium = 10,000,000 × 0.015 = **150,000**. Payout on default = 10,000,000 × (1 − 0.40) = **6,000,000**.

#### Case 9.1 — Barings Bank (1995)
Barings, a London merchant bank more than two centuries old, collapsed after a trader in Singapore built up large unauthorised positions in Japanese stock-index futures and options and hid the losses. **Discussion:** list the control failures (one person controlling both trading and settlement, weak oversight, unchecked funding requests) and match each to a control taught in M12 and M17.

#### Track C — Python
```python
settle = [70_000, 70_400, 69_500, 69_300, 70_100]   # daily settlement prices
contracts, multiplier = 2, 10
initial, maintenance = 25_000 * contracts, 20_000 * contracts
balance = initial
for day in range(1, len(settle)):
    pnl = (settle[day] - settle[day - 1]) * multiplier * contracts
    balance += pnl
    call = initial - balance if balance < maintenance else 0
    print(f"Day {day}: P&L {pnl:+,}  balance {balance:,}  margin call {call:,}")
    balance += call

for s in (80, 90, 96, 100, 105, 110, 120):
    print(s, "call profit:", max(s - 100, 0) - 5, " put profit:", max(100 - s, 0) - 4)
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 6 numeric)
- [ ] Applied task: build a payoff-diagram workbook for long and short calls and puts, a protective put and a covered call
- [ ] Hedge-choice exercise: for five scenarios (exporter, pension fund, airline fuel buyer, bond investor, floating-rate borrower), choose and justify a derivative

**Benchmark trace:** T13 (9 ●), T14 (8 ●), T15: CFA C3 M4 forwards, futures, options, swaps [S1]; CISI element 6 incl. CDS and long/short/covered/naked terminology [S2]; FINRA SIE options [S3]; SAIFM derivatives market [S4]; NISM equity futures trading, settlement and risk management [S5]; Yale forwards, futures, options and hedging [S6]; Rice derivatives [S7]; MIT forwards, futures and options [S8]; NYIF margining, swaps, payoff profiles and credit derivatives [S10]; LSE forwards, futures, options, swaps [S13].

---

## M10 — Funds, alternatives, commodities and digital assets

**Hours:** 6 core (Learn 3 · Practise 2 · Assess 1) + 0.5 Python

**Why it matters.** Most people reach capital markets through funds rather than individual securities. Professional investors increasingly use private and alternative assets, and digital assets are reshaping market infrastructure.

### Learning objectives
1. **[Understand]** Explain the benefits, costs and risks of pooled (collective) investment.
2. **[Know]** Compare open-ended funds, closed-ended funds, exchange-traded funds (ETFs) and real estate investment trusts (REITs).
3. **[Apply]** Calculate net asset value per unit, a closed-ended fund's premium or discount, and the long-run effect of fees.
4. **[Understand]** Distinguish active from passive management and physical from synthetic ETF replication.
5. **[Know]** Describe hedge funds, private equity, venture capital, private credit, real estate, infrastructure and commodities, including their liquidity and valuation challenges.
6. **[Understand]** Explain cryptocurrencies, stablecoins, tokenised securities, decentralised finance (DeFi) and central bank digital currencies (CBDCs), and how they differ from fiat money and traditional securities.
7. **[Evaluate]** Assess custody, conflict-of-interest and liquidity risks in alternative and digital-asset platforms.

### Subtopics
- Pooled investment: why it exists; regulation of funds; costs and fees
- Open-ended funds (mutual funds, unit trusts) and how units are created and redeemed at NAV
- Closed-ended funds; premiums and discounts; gearing (borrowing)
- ETFs: trading on exchange; index tracking; replication methods
- Index funds; active vs passive debate
- REITs and listed property
- Alternatives
  - Hedge funds: strategies, leverage, fees, liquidity terms
  - Private equity and venture capital: fund structure, raising capital, exiting investments
  - Private credit and infrastructure
  - Commodities: physical vs futures-based exposure
- Digital assets: blockchain basics; cryptocurrencies vs fiat; stablecoins; tokenisation; DeFi; CBDCs; crypto exchanges and custody

### Key terms

| Term | Plain-English meaning |
|---|---|
| Collective investment scheme | A fund pooling many investors' money under professional management. |
| Open-ended fund | A fund that issues and cancels units on demand at NAV. |
| Unit trust / mutual fund | Common names for open-ended funds in different countries. |
| Closed-ended fund | A fund with a fixed number of shares that trade on an exchange, often at a premium or discount to NAV. |
| Exchange-traded fund (ETF) | A fund whose shares trade on an exchange throughout the day, usually tracking an index. |
| Physical / synthetic replication | Holding the index's securities / using derivatives (often swaps) to deliver the index return. |
| Passive management | Tracking an index at low cost. |
| Active management | Selecting investments to try to beat a benchmark. |
| Total expense ratio | Annual fund costs as a percentage of assets. |
| REIT | A listed company that owns income-producing property and distributes most of its income. |
| Hedge fund | A lightly regulated private fund using flexible strategies, often with leverage and short selling. |
| Private equity | Investment in companies not listed on an exchange, often to restructure and later sell them. |
| Venture capital | Private equity for early-stage, high-growth companies. |
| Private credit | Loans made by non-bank funds directly to companies. |
| Commodity | A raw material or primary product (oil, gold, maize) traded in standard grades. |
| Fiat money | Government-issued money not backed by a physical commodity. |
| Cryptocurrency | A digital asset recorded on a blockchain, not issued by a government. |
| Stablecoin | A crypto-asset designed to hold a stable value, usually against a fiat currency. |
| Tokenisation | Representing ownership of an asset as a digital token on a distributed ledger. |
| Decentralised finance (DeFi) | Financial services run by software on blockchains, without traditional intermediaries. |
| Central bank digital currency (CBDC) | A digital form of a country's currency issued by its central bank. |
| Custody | Safekeeping of assets on behalf of their owner. |

### Worked examples and cases

#### Worked example 10.1 — Net asset value per unit
**Problem.** A fund holds assets of 105 million and owes 5 million; it has 10 million units in issue.
**Track A.** NAV per unit = (105m − 5m) / 10m = **10.00**.

#### Worked example 10.2 — Closed-ended fund discount
**Problem.** A closed-ended fund's NAV is 10.00 per share; its shares trade at 9.20.
**Track A.** (9.20 − 10.00) / 10.00 = **−8%**, an 8% discount. Investors are paying less than the value of the underlying assets — often because of fees, illiquid holdings or poor sentiment.

#### Worked example 10.3 — What fees do over 20 years
**Problem.** 10,000 is invested for 20 years in assets returning 7% a year before costs. Fund A costs 0.2% a year; fund B costs 1.5%.
**Track A.**
- Fund A: 10,000 × 1.068^20 = **37,275.64**
- Fund B: 10,000 × 1.055^20 = **29,177.57**
- Difference: **8,098.06** — over 80% of the original investment.

**Track B.** `=10000*(1+7%-0.2%)^20` and `=10000*(1+7%-1.5%)^20`.
**Track C.**
```python
gross, years, start = 0.07, 20, 10_000
for fee in (0.002, 0.015):
    print(fee, round(start * (1 + gross - fee) ** years, 2))   # 37275.64 and 29177.57
```

#### Case 10.1 — When a crypto exchange fails (2022)
In November 2022 the crypto exchange FTX collapsed and filed for bankruptcy after customers rushed to withdraw and it emerged that customer assets had been used by an affiliated trading firm. **Discussion:** compare FTX's structure with a regulated exchange, CCP, CSD and custodian (M2, M12). Which functions were combined in one firm, and which safeguards were missing?

#### Case 10.2 — Choosing a vehicle
A first-time investor in Johannesburg, Lagos or Mumbai wants broad exposure to the local share market. Learners compare a unit trust, an ETF and buying individual shares on cost, diversification, minimum investment, trading flexibility and tax treatment (with a note that tax rules are country-specific).

### Assessment
- [ ] Knowledge check: 15 items
- [ ] Applied task: compare the fact sheets of an index ETF and an actively managed fund on the same market (costs, holdings, tracking error or performance vs benchmark)
- [ ] **Checkpoint exam 1** (Parts 1–2): 40 items, 60 minutes, 70% to pass

**Benchmark trace:** T17, T18, T19: CFA C2 M3–M4 pooled vehicles, ETFs, indices, hedge funds; C3 M5 alternatives; DeFi lesson [S1]; CISI element 7 incl. ETF replication, private credit and crypto, plus 5.1.3 crypto vs fiat and 5.3 property [S2]; FINRA SIE packaged products, REITs, hedge funds, ETPs [S3]; SAIFM commodities and crypto-assets module [S4]; NISM mutual funds [S5]; Yale mutual funds and ETFs, real estate [S6]; NYIF mutual funds, hedge funds, PE and VC [S10]; JSE REITs [S11] → `[D12]`.

---

## PART 3 — ISSUANCE, TRADING, CLEARING AND SETTLEMENT

---

## M11 — Primary markets: how securities are issued

**Hours:** 4 core (Learn 2 · Practise 1.5 · Assess 0.5)

**Why it matters.** The primary market is where capital is actually raised. How securities are priced and allocated decides who bears the cost of raising capital and whether markets are open and fair.

### Learning objectives
1. **[Understand]** Explain why issuers list shares or issue bonds, and the costs and obligations that come with it.
2. **[Understand]** Distinguish public offers from private placements, and initial public offerings (IPOs) from follow-on offerings and rights issues.
3. **[Know]** Identify the participants in an issue: company management and board, bookrunners and the underwriting syndicate, lawyers, auditors, research analysts, the exchange and the regulator.
4. **[Understand]** Compare distribution methods: firm-commitment and best-efforts underwriting, bookbuilding, fixed-price offers and government-bond auctions.
5. **[Know]** Describe offering documents and post-issue mechanisms: prospectus, lock-ups, over-allotment (greenshoe) and price stabilisation.
6. **[Apply]** Calculate issue proceeds, underwriting fees and first-day returns, and allot an auction.

### Subtopics
- Why raise capital publicly; listing requirements and ongoing disclosure
- Equity issuance (equity capital markets, ECM): IPO timeline from preparation to first trading day; follow-ons; rights issues (from M7)
- Debt issuance (debt capital markets, DCM): syndicated bonds; medium-term note programmes; government auctions; primary dealers
- Underwriting risk and fees; pricing tension between issuer and investors
- Private placements and qualified (professional) investors
- Disclosure and liability: the prospectus
- After the issue: stabilisation, lock-ups, research coverage
- Market development: why some markets struggle to attract new listings; cross-listings; secondary listings

### Key terms

| Term | Plain-English meaning |
|---|---|
| Initial public offering (IPO) | A company's first sale of shares to the public, usually with a stock-exchange listing. |
| Listing | Admission of a security to trading on an exchange. |
| Follow-on offering | A further sale of shares by an already listed company. |
| Prospectus | The legal disclosure document describing the issuer, the offer and its risks. |
| Underwriting | A bank's commitment to sell (and possibly buy) an issue, for a fee. |
| Firm commitment | The underwriter buys the whole issue and resells it, taking the risk of unsold securities. |
| Best efforts | The underwriter tries to sell the issue but does not guarantee it. |
| Bookrunner (lead manager) | The bank that runs the offer and collects investor orders. |
| Syndicate | The group of banks sharing the work and risk of an issue. |
| Bookbuilding | Collecting indications of demand at different prices to set the issue price. |
| Private placement | A sale of securities to a limited number of professional investors without a full public offer. |
| Auction (government securities) | A sale in which investors submit bids and the issuer accepts the best ones. |
| Uniform-price auction | All successful bidders pay the same clearing price. |
| Multiple-price (discriminatory) auction | Each successful bidder pays the price it bid. |
| Bid-to-cover ratio | Total bids ÷ amount sold: a measure of demand. |
| Lock-up | A period during which existing shareholders agree not to sell. |
| Greenshoe (over-allotment option) | Lets underwriters sell extra shares and support the price after listing. |
| Underpricing | When the first-day trading price is well above the issue price. |

### Worked examples and cases

#### Worked example 11.1 — IPO arithmetic (illustrative)
**Problem.** A company sells 50 million new shares at R20. The underwriting fee is 3% of gross proceeds. On the first day the shares close at R23.

**Track A.**
1. Gross proceeds = 50m × 20 = **R1,000 million**.
2. Fees = 3% × 1,000m = **R30 million**; net proceeds = **R970 million**.
3. First-day return = 23 / 20 − 1 = **15%**.
4. "Money left on the table" = 50m × (23 − 20) = **R150 million** — value the company could have raised at a higher price.

**Discussion.** Why might issuers and bankers accept some underpricing?

#### Worked example 11.2 — Allotting a Treasury-bill auction
**Problem.** A government offers 1,000 million of bills. Bids (yield, amount): 7.20% — 300m; 7.25% — 400m; 7.30% — 500m; 7.35% — 200m. Lower yields mean higher prices, so they are filled first.

**Track A.**
1. Fill 7.20% (300m) and 7.25% (400m): 700m allotted.
2. 300m remains; bids at 7.30% total 500m → each receives **60%** of its bid.
3. Bids at 7.35% receive nothing. Clearing yield = **7.30%**.
4. Bid-to-cover = 1,400 / 1,000 = **1.4**.
5. In a *uniform-price* auction every winner earns 7.30%; in a *multiple-price* auction each winner earns the yield it bid.

#### Case 11.1 — The road to an IPO
Using the stages taught by NYIF [S10] — preparatory and organisational meetings, due diligence, drafting the prospectus, regulatory review, investor roadshow, bookbuilding, pricing, allocation and stabilisation — learners build a 16-week timeline for a fictional company and assign each task to a participant.

#### Case 11.2 — Why list here?
The JSE masterclass asks what makes one exchange more attractive than another and how to increase listings [S11]. Learners compare two exchanges (one developed, one emerging) on listing costs, liquidity, investor base, disclosure demands and currency, and recommend where a mid-sized African company should list.

### Assessment
- [ ] Knowledge check: 12 items (≥ 4 numeric)
- [ ] Applied task: read the summary section of a recent prospectus and extract the offer size, price range, use of proceeds, lock-up terms and the five most important risk factors

**Benchmark trace:** T20 (7 ●): CFA C2 M1 primary markets, role of issuers [S1]; FINRA SIE offerings incl. firm commitment, best efforts and prospectus [S3]; NISM primary markets incl. pricing, prospectus, rights, debt issues and private placements [S5]; Yale underwriting and IPOs [S6]; NYIF IPO participants, timing and steps; Treasury auctions and primary dealers [S10]; JSE listings and cross-listings [S11]; CFI origination, DCM and ECM [S12] → `[D4]`.

---

## M12 — Secondary markets, trading, clearing and settlement

**Hours:** 8 core (Learn 3 · Practise 4 · Assess 1) + 1 Python

**Why it matters.** Most market activity is investors trading existing securities with each other. What happens after a trade — clearing and settlement — is invisible to most investors but is where operational and systemic risk concentrate.

### Learning objectives
1. **[Understand]** Describe trading venues: exchanges, multilateral trading facilities and alternative trading systems, dark pools and dealer (OTC) markets.
2. **[Understand]** Compare order-driven markets (limit order books, auctions) with quote-driven markets (dealers and market makers).
3. **[Apply]** Read an order book; calculate the bid–ask spread and the average price and cost of a market order.
4. **[Understand]** Explain short selling, securities lending and buying on margin, and their risks.
5. **[Understand]** Explain algorithmic and high-frequency trading, payment for order flow and best execution.
6. **[Understand]** Trace the post-trade chain: confirmation, clearing (novation, netting, margin), settlement (delivery versus payment), custody and asset servicing.
7. **[Apply]** Calculate the effect of multilateral netting and work out settlement dates under different settlement cycles.
8. **[Know]** Compare settlement cycles across major and emerging markets and explain the global move to shorter cycles.
9. **[Analyse]** Measure liquidity and identify where a trade can fail and who bears the loss.

### Subtopics
- Trading venues and market models
  - Continuous trading, opening and closing auctions
  - Order-driven, quote-driven and hybrid markets
- Orders: market, limit, stop, time conditions; queue priority
- Transaction costs: commissions, spread, market impact
- Liquidity measures: spread, depth, turnover
- Short selling, securities lending, margin accounts
- Market structure debates: high-frequency trading, dark pools, payment for order flow, fragmentation
- Post-trade
  - Trade capture, confirmation and affirmation
  - Clearing: the central counterparty, novation, netting, initial and variation margin, default management
  - Settlement: central securities depositories, delivery versus payment, settlement fails
  - Holding securities: dematerialised and immobilised securities; registered and bearer
  - Custody, asset servicing, corporate-action processing
- Settlement cycles and the move from T+3/T+2 to T+1
- Financial market infrastructures and their failures

### Key terms

| Term | Plain-English meaning |
|---|---|
| Trading venue | A place or system where buy and sell orders meet. |
| Multilateral trading facility / alternative trading system | A non-exchange electronic venue that matches many buyers and sellers. |
| Dark pool | A venue where orders are not displayed before execution. |
| Order book | The list of outstanding buy (bid) and sell (ask) orders at each price. |
| Market order | An order to trade immediately at the best available prices. |
| Limit order | An order to trade only at a stated price or better. |
| Stop order | An order that becomes a market order once a trigger price is reached. |
| Bid–ask spread | The gap between the best buying and selling prices: a cost of immediacy. |
| Depth | The quantity available near the best prices. |
| Slippage (market impact) | The extra cost when a large order moves the price against the trader. |
| Short selling | Selling borrowed securities, hoping to buy them back cheaper. |
| Securities lending | Temporarily lending securities, usually for a fee and against collateral. |
| Buying on margin | Buying securities partly with money borrowed from a broker. |
| Algorithmic trading | Using computer programs to decide and place orders. |
| High-frequency trading (HFT) | Very fast algorithmic trading holding positions for seconds or less. |
| Best execution | The duty to obtain the best overall result for a client's order. |
| Trade date (T) | The day a trade is agreed. |
| Settlement date | The day securities and cash actually change hands (e.g. T+1). |
| Clearing | Confirming, matching and calculating obligations before settlement. |
| Novation | The CCP replaces the original contract with two new ones, becoming each side's counterparty. |
| Netting | Offsetting obligations so that only net amounts move. |
| Delivery versus payment (DvP) | Securities move only if cash moves, and vice versa. |
| Settlement fail | A trade that does not settle on the due date. |
| Dematerialisation | Replacing paper certificates with electronic records. |
| Straight-through processing | Handling a trade end-to-end electronically without manual steps. |

### Worked examples and cases

#### Worked example 12.1 — Reading an order book and walking it
**Problem.** A share's order book shows:

| Bids (buy orders) | Price | | Asks (sell orders) | Price |
|---|---|---|---|---|
| 1,500 | 50.00 | | 2,000 | 50.10 |
| 4,000 | 49.95 | | 3,000 | 50.15 |
| 6,000 | 49.90 | | 5,000 | 50.25 |

(a) What is the spread? (b) What does a market order to **buy 4,000** shares cost?

**Track A.**
1. Spread = 50.10 − 50.00 = **0.10**; mid-price = 50.05; spread ≈ 0.10 / 50.05 = **20 basis points**.
2. The buy order takes 2,000 at 50.10 (100,200) and 2,000 at 50.15 (100,300): total **200,500**, average **50.125**.
3. Cost versus the mid-price: (50.125 − 50.05) / 50.05 ≈ **15 basis points**.

**Meaning.** A limit order to buy at 50.00 would cost less but might never be filled. Traders trade off price against certainty.

#### Worked example 12.2 — Short selling
**Problem.** A trader borrows and sells 1,000 shares at 60, pays a lending fee of 0.5% a year for 3 months and buys back at 52.
**Track A.** Gain = 1,000 × (60 − 52) = 8,000. Fee = 60,000 × 0.005 × 3/12 = 75. Profit = **7,925**. If the price had instead risen to 75, the loss would be 15,075 — and with no ceiling on the price, the potential loss is unlimited.

#### Worked example 12.3 — Buying on margin (illustrative terms)
**Problem.** An investor buys 1,000 shares at 50, paying 25,000 and borrowing 25,000. The broker requires equity of at least 30% of the position's value.
**Track A.**
1. If the price falls to 40: position 40,000; loan 25,000; equity 15,000 = **37.5%** → no call yet.
2. Price that triggers a call: (1,000P − 25,000) / 1,000P = 0.30 → P = 25,000 / 700 = **35.71**.

#### Worked example 12.4 — How a CCP shrinks settlement through netting
**Problem.** Three brokers trade the same share at 50 on one day: A buys 1,000 from B; B buys 800 from C; C buys 600 from A.

**Track A.**
1. Without netting, 1,000 + 800 + 600 = **2,400** shares (and 120,000 in cash) must move.
2. Net positions: A +1,000 − 600 = **+400**; B −1,000 + 800 = **−200**; C −800 + 600 = **−200**.
3. With the CCP as counterparty to all, B and C each deliver 200 and A receives 400: **400** shares move (20,000 in cash) — an **83%** reduction.

#### Worked example 12.5 — Settlement dates
**Problem.** A trade is executed on Thursday 8 October 2026. When does it settle under T+1 and under T+3? What if Monday 12 October were a public holiday in that market?
**Track A.** T+1 → Friday 9 October. T+3 → count business days: Fri 9 (1), Mon 12 (2), Tue 13 (3) → **Tuesday 13 October**. With a Monday holiday → **Wednesday 14 October**.
**Track B.** `=WORKDAY(DATE(2026,10,8),3)` → 13 Oct 2026; `=WORKDAY(DATE(2026,10,8),3,DATE(2026,10,12))` → 14 Oct 2026.

#### Case 12.1 — Settlement cycles around the world

| Market | Equity settlement cycle | Source |
|---|---|---|
| United States, Canada, Mexico, Argentina | T+1 since May 2024 | [R6] |
| India | T+1 | [R6] |
| European Union, United Kingdom, Switzerland | Moving to T+1 on 11 October 2027 | [R6] |
| South Africa (JSE, settled through Strate) | T+3 since 2016 (previously T+5) | [R5] |

**Task.** A US fund sells US shares and buys JSE shares on the same day. Its US sale settles T+1, the rand it needs is bought in the FX market for spot settlement (typically T+2), and the JSE purchase settles T+3. Draw the cash timeline and identify any day on which the fund is exposed. Then explain the trade-offs of shorter cycles: less counterparty risk and margin, but tighter operational deadlines across time zones.

#### Case 12.2 — When volatility hits the plumbing (US, January 2021)
When shares in GameStop and a few other companies surged in January 2021, clearing-house deposit requirements for brokers rose sharply and some retail brokers temporarily restricted buying. **Discussion:** trace the chain from price volatility to CCP margin to broker liquidity to customers, and explain how a shorter settlement cycle reduces the period of risk the CCP must cover.

#### Case 12.3 — When a clearing house fails
The JSE masterclass reviews historical clearing-house failures in France, Kuala Lumpur and Hong Kong [S11]. Learners research one and explain how today's international standards for market infrastructure (24 principles published by CPSS-IOSCO, now CPMI-IOSCO, in 2012 [R3]) — financial resources, default management, margin — address its causes.

#### Track C — Python
```python
asks = [(50.10, 2_000), (50.15, 3_000), (50.25, 5_000)]   # (price, quantity), best first

def market_buy(book, qty):
    filled, cost = 0, 0.0
    for price, available in book:
        take = min(available, qty - filled)
        filled += take
        cost += take * price
        if filled == qty:
            break
    return cost, cost / filled

cost, avg = market_buy(asks, 4_000)
print(round(cost, 2), round(avg, 4))                 # 200500.0 50.125

trades = [("A", "B", 1_000), ("B", "C", 800), ("C", "A", 600)]   # (buyer, seller, shares)
net = {}
for buyer, seller, q in trades:
    net[buyer] = net.get(buyer, 0) + q
    net[seller] = net.get(seller, 0) - q
gross = sum(q for _, _, q in trades)
moved = sum(v for v in net.values() if v > 0)
print(net, gross, moved, f"{1 - moved / gross:.0%} reduction")   # {'A': 400, 'B': -200, 'C': -200} 2400 400 83% reduction
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 5 numeric)
- [ ] Applied task: "Follow one trade" — map a purchase of shares in two markets with different settlement cycles from order to custody, naming the real venue, CCP and CSD in each and the deadlines on each day
- [ ] Order-book simulation: place market and limit orders in a free trading simulator or a provided spreadsheet book and record costs

**Benchmark trace:** T21 (8 ●) and T22: CFA C2 M1 trading venues and market structures; C2 M2 orders, clearing and settlement, transaction costs [S1]; CISI 3.1.12–3.1.15 incl. MTFs, order- vs quote-driven markets, CCPs and settlement cycles [S2]; FINRA SIE orders and settlement time frames [S3]; NISM trade execution, clearing and settlement, risk-management systems [S5]; Yale exchanges, limit order book, HFT, payment for order flow [S6]; Rice dark pools, margin and short selling [S7]; NYIF dark pools, order execution, short selling [S10]; JSE CCPs, CSDs, settlement models, margin example and liquidity measures [S11]; [R3], [R5], [R6] → `[D4]`, `[D10]`.

---

## PART 4 — VALUATION

Part 4 turns one idea from M4 — *value is the present value of expected cash flows* — into tools for each instrument. Depth is set between the licensing exams (simple yields) and MIT/IMF-level pricing `[D5]`.

---

## M13 — Valuing bonds

**Hours:** 9 core (Learn 3 · Practise 5 · Assess 1) + 1.5 Python

**Why it matters.** A bond's price and its yield are two views of the same thing. Knowing how to move between them — and how sensitive a price is to interest rates — is the core skill in fixed income and in managing a bank's or pension fund's balance sheet.

### Learning objectives
1. **[Apply]** Price a fixed-coupon bond from its yield, with annual and semi-annual coupons.
2. **[Apply]** Calculate yield to maturity from a price by trial and error, in a spreadsheet and in Python.
3. **[Apply]** Price a zero-coupon bond and use discount factors (spot rates) to price any bond.
4. **[Apply]** Distinguish clean and dirty prices and calculate accrued interest.
5. **[Understand]** Explain why bond prices move inversely to yields, and why bonds trade at a premium, at par or at a discount.
6. **[Apply]** Calculate Macaulay duration, modified duration, DV01 and convexity, and use them to estimate price changes.
7. **[Understand]** Describe yield-curve shapes and the main theories that explain them; derive a forward rate from two spot rates.
8. **[Apply]** Measure a credit spread and relate it to default risk.
9. **[Analyse]** Assess interest-rate risk in a real balance sheet.

### Subtopics
- The bond pricing equation; premium, par and discount
- Yield measures: current yield (M6), yield to maturity, (yield to call — awareness only)
- Zero-coupon bonds, spot rates, discount factors; pricing coupon bonds from a curve
- Accrued interest, clean and dirty prices, day-count conventions
- Interest-rate risk: duration, modified duration, DV01, convexity
- Yield curves: normal, flat, inverted; expectations, liquidity-preference and market-segmentation theories; forward rates; constructing a simple curve from market prices
- Credit spreads, ratings and expected loss; liquidity premia
- Inflation-linked and floating-rate bonds: why their price behaviour differs

### Key terms

| Term | Plain-English meaning |
|---|---|
| Yield to maturity (YTM) | The single discount rate that makes the present value of a bond's cash flows equal its price; the annual return if held to maturity and coupons are reinvested at that rate. |
| Premium / par / discount | Price above / equal to / below face value. |
| Spot rate | The yield on a zero-coupon bond for a given maturity. |
| Discount factor | The present value today of one unit received at a future date. |
| Forward rate | An interest rate for a future period implied by today's spot rates. |
| Yield curve | A chart of yields against maturity for similar bonds. |
| Inverted yield curve | Short-term yields above long-term yields; often read as a signal of slower growth. |
| Accrued interest | Coupon interest earned by the seller since the last coupon date. |
| Clean price | Quoted price excluding accrued interest. |
| Dirty (full) price | Clean price plus accrued interest: what the buyer actually pays. |
| Macaulay duration | The weighted-average time (in years) until a bond's cash flows are received. |
| Modified duration | The approximate percentage price change for a one-percentage-point change in yield. |
| DV01 | The money change in price for a one-basis-point change in yield. |
| Convexity | The curvature of the price–yield relationship; improves the duration estimate for large moves. |
| Credit spread | The extra yield over a government bond of the same maturity, compensating for default and liquidity risk. |

### Core formulas
```
Price = Σ C / (1 + y/f)^k  +  F / (1 + y/f)^N        (k = 1…N coupon periods, f = coupons per year)
Macaulay duration = Σ t × PV(CF_t) / Price
Modified duration = Macaulay duration / (1 + y/f)
%ΔPrice ≈ −Modified duration × Δy  +  ½ × Convexity × (Δy)²
DV01 = Modified duration × Price × 0.0001
Forward rate (year 1→2) = (1 + s2)^2 / (1 + s1) − 1
```

### Worked examples

#### Worked example 13.1 — Price from yield (annual coupons)
**Problem.** A 5-year bond with face value 1,000 pays an 8% annual coupon (80 a year). Similar bonds yield 10%. What is its price?

**Track A.**
1. PV of coupons = 80 × [1 − 1.10^−5] / 0.10 = 80 × 3.790787 = 303.26.
2. PV of face value = 1,000 / 1.10^5 = 620.92.
3. Price = 303.26 + 620.92 = **924.18** (a discount, because the coupon is below the market yield).

**Track B.** `=-PV(10%,5,80,1000)` → 924.18; or with dates `=PRICE(DATE(2026,10,5),DATE(2031,10,5),8%,10%,100,1)` → 92.418 per 100.

#### Worked example 13.2 — Price from yield (semi-annual coupons)
**Problem.** A 3-year bond pays a 6% coupon semi-annually (3 every six months) on face value 100. The yield is 5% a year (2.5% per half-year). Price it.
**Track A.**
1. Six periods. PV of coupons = 3 × [1 − 1.025^−6] / 0.025 = 3 × 5.508125 = 16.52.
2. PV of face = 100 / 1.025^6 = 86.23.
3. Price = **102.75** — a premium, because the coupon exceeds the yield.

**Track B.** `=-PV(5%/2,6,3,100)` → 102.75.

#### Worked example 13.3 — Yield from price
**Problem.** A 4-year bond with a 5% annual coupon trades at 95. What is its yield to maturity?
**Track A (trial and error).**
1. At 6%: price = 96.54 (too high → yield must be higher).
2. At 7%: price = 93.23 (too low).
3. Interpolate: 6% + (96.54 − 95) / (96.54 − 93.23) × 1% ≈ **6.46%**.

**Track B.** `=RATE(4,5,-95,100)` → **6.458%**.
**Meaning.** The investor earns the 5% coupon *plus* the gain from 95 to 100 spread over four years.

#### Worked example 13.4 — Zero-coupon bond
**Problem.** Price a 10-year zero-coupon bond (face 100) at a 7% yield.
**Track A.** 100 / 1.07^10 = **50.83**. Half the face value buys a claim on the full amount ten years out.

#### Worked example 13.5 — Accrued interest and the dirty price
**Problem.** The bond in 13.2 (clean price 102.75) is bought 60 days into a 182-day coupon period. What does the buyer pay?
**Track A.** Accrued interest = 3 × 60/182 = **0.99**. Dirty price = 102.75 + 0.99 = **103.74** per 100. The buyer compensates the seller for interest earned but not yet paid. (Day-count rules differ by market; this example uses actual/actual.)

#### Worked example 13.6 — Duration, DV01 and convexity
**Problem.** For the bond in 13.1 (price 924.18 at a 10% yield), estimate the price change if yields rise or fall by one percentage point.

**Track A.**

| Year t | Cash flow | Discount factor (10%) | PV | t × PV |
|---|---|---|---|---|
| 1 | 80 | 0.909091 | 72.73 | 72.73 |
| 2 | 80 | 0.826446 | 66.12 | 132.23 |
| 3 | 80 | 0.751315 | 60.11 | 180.32 |
| 4 | 80 | 0.683013 | 54.64 | 218.56 |
| 5 | 1,080 | 0.620921 | 670.60 | 3,352.98 |
| **Total** | | | **924.18** | **3,956.81** |

1. Macaulay duration = 3,956.81 / 924.18 = **4.28 years**.
2. Modified duration = 4.28 / 1.10 = **3.89** → about 3.89% price change per 1 percentage point.
3. DV01 = 3.8922 × 924.18 × 0.0001 = **0.36** per 1,000 face.
4. Yields +1%: estimate −3.89% × 924.18 = **−35.97**; actual repricing at 11% gives 889.12, i.e. **−35.06**.
5. Yields −1%: estimate **+35.97**; actual **+36.92**.
6. Convexity = 20.10; adding ½ × 20.10 × 0.01² × 924.18 brings the +1% estimate to **−35.04**, almost exact.

**Track B.** `=DURATION(DATE(2026,10,5),DATE(2031,10,5),8%,10%,1)` → 4.2814; `=MDURATION(…)` → 3.8922.
**Meaning.** Prices fall less when yields rise than they gain when yields fall by the same amount — convexity works in the holder's favour.

#### Worked example 13.7 — Forward rate from spot rates
**Problem.** One-year and two-year spot rates are 6.0% and 6.5%. What one-year rate, starting in one year, do they imply?
**Track A.** (1.065^2 / 1.06) − 1 = **7.00%**. An upward-sloping curve implies higher expected future short rates (or a term premium, or both).

#### Worked example 13.8 — Credit spread and implied default risk
**Problem.** A corporate bond yields 9.20%; a government bond of the same maturity yields 8.00%. Investors expect to lose 60% of their money if the company defaults.
**Track A.** Spread = **120 bp**. A rough upper bound on the market-implied annual default probability ≈ spread / loss-given-default = 1.20% / 0.60 = **2%** a year (in practice part of the spread pays for liquidity and risk aversion, so the true expected default rate is lower).

#### Case 13.1 — A bank, a bond portfolio and a run (US, 2023)
Silicon Valley Bank failed in March 2023 after rising interest rates cut the value of its large holdings of long-dated bonds and depositors withdrew funds rapidly. **Task:** use modified duration to estimate the loss on a portfolio with a modified duration of 6 when yields rise 3 percentage points (≈ −18%), compare it with the bank's capital in a stylised balance sheet, and explain why the same loss mattered more once depositors began to leave (link to liquidity risk in M17).

#### Track C — Python
```python
from scipy.optimize import brentq

def bond_price(face, coupon_rate, ytm, years, freq=1):
    c, y, n = face * coupon_rate / freq, ytm / freq, years * freq
    return sum(c / (1 + y) ** k for k in range(1, n + 1)) + face / (1 + y) ** n

def bond_ytm(price, face, coupon_rate, years, freq=1):
    return brentq(lambda y: bond_price(face, coupon_rate, y, years, freq) - price, 1e-6, 1.0)

def durations(face, coupon_rate, ytm, years):     # annual coupons
    flows = [(t, face * coupon_rate + (face if t == years else 0)) for t in range(1, years + 1)]
    pv = [(t, cf / (1 + ytm) ** t) for t, cf in flows]
    price = sum(v for _, v in pv)
    mac = sum(t * v for t, v in pv) / price
    conv = sum(t * (t + 1) * v for t, v in pv) / (price * (1 + ytm) ** 2)
    return price, mac, mac / (1 + ytm), conv

print(round(bond_price(1_000, 0.08, 0.10, 5), 2))       # 924.18
print(round(bond_price(100, 0.06, 0.05, 3, 2), 2))      # 102.75
print(round(bond_ytm(95, 100, 0.05, 4), 5))             # 0.06458
price, mac, mod, conv = durations(1_000, 0.08, 0.10, 5)
print(round(mac, 4), round(mod, 4), round(conv, 2))     # 4.2814 3.8922 20.1
print(round(-mod * 0.01 * price, 2), round(bond_price(1_000, 0.08, 0.11, 5) - price, 2))  # -35.97 -35.06
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 8 numeric)
- [ ] Applied task: download today's government yield curve for one developed and one emerging market; price the same 5-year 8% bond on each curve, compute duration, and explain the difference
- [ ] Optional Python task: build a function that prices any annual-coupon bond from a list of spot rates

**Benchmark trace:** T08 (6 ●; 11 ●+◐): CFA C3 M3 valuation of debt securities, risks, yield curve [S1]; CISI flat-yield calculation [S2]; FINRA SIE price–yield relationship and yield to maturity [S3]; Yale discount bonds, forward rates and expectations theory [S6]; Rice bond valuation [S7]; MIT fixed-income securities I–IV [S8]; IMF yield measures and yield-curve construction [S9]; NYIF price–yield relationship, yield curves and credit spreads [S10] → `[D5]`, `[D6]`.

---

## M14 — Valuing equities

**Hours:** 9 core (Learn 3 · Practise 5 · Assess 1) + 1.5 Python

**Why it matters.** Share prices reflect investors' expectations about a company's future cash flows and risk. Valuation methods make those expectations explicit, so they can be tested and challenged.

### Learning objectives
1. **[Understand]** Read and link the three financial statements: income statement, balance sheet and cash-flow statement.
2. **[Apply]** Calculate earnings per share, dividend per share, payout ratio, return on equity, P/E, P/B, dividend yield and EV/EBITDA.
3. **[Apply]** Estimate the cost of equity with the capital asset pricing model (CAPM).
4. **[Apply]** Value a share with the constant-growth and two-stage dividend discount models.
5. **[Apply]** Value equity with a simple free-cash-flow-to-equity discounted cash flow (DCF) model and a terminal value.
6. **[Apply]** Value a share by comparison with similar companies (multiples).
7. **[Evaluate]** Test sensitivity, reverse-engineer the growth a market price implies, and judge which method fits which company.
8. **[Analyse]** Adjust valuations for emerging-market features: higher risk-free rates, inflation and currency.

### Subtopics
- **Financial statements in one hour**
  - Income statement: revenue → operating profit → profit before tax → net income
  - Balance sheet: assets = liabilities + equity
  - Cash-flow statement: operating, investing and financing cash flows; why profit ≠ cash
- Ratios and what they reveal
- Required return: risk-free rate, equity risk premium, beta (measured in M16)
- Intrinsic valuation: dividend discount models; free cash flow to equity; terminal value
- Relative valuation: choosing peers and multiples; enterprise value
- Sensitivity analysis and implied expectations
- Valuation in emerging markets: country risk, currency and inflation consistency

### Key terms

| Term | Plain-English meaning |
|---|---|
| Income statement | Shows revenue, costs and profit over a period. |
| Balance sheet | Shows what a company owns (assets), owes (liabilities) and the owners' stake (equity) at a date. |
| Cash-flow statement | Shows the cash that came in and went out over a period. |
| Revenue | Money earned from selling goods and services. |
| EBIT / EBITDA | Earnings before interest and tax / before interest, tax, depreciation and amortisation. |
| Net income (earnings) | Profit after all costs, interest and tax. |
| Earnings per share (EPS) | Net income ÷ number of shares. |
| Payout ratio | The share of earnings paid out as dividends. |
| Return on equity (ROE) | Net income ÷ shareholders' equity. |
| Book value | Equity as recorded on the balance sheet. |
| P/E ratio | Share price ÷ earnings per share. |
| P/B ratio | Share price ÷ book value per share. |
| Enterprise value (EV) | Market value of equity + net debt: the value of the whole business. |
| Cost of equity | The return shareholders require for the risk they bear. |
| Equity risk premium | The extra return investors require for holding shares instead of risk-free assets. |
| Beta | How much a share's return tends to move with the overall market. |
| Dividend discount model (DDM) | Values a share as the present value of expected future dividends. |
| Free cash flow to equity (FCFE) | Cash available to shareholders after operating costs, investment and debt flows. |
| Terminal value | The value of all cash flows beyond the explicit forecast period. |
| Intrinsic value | An estimate of value based on cash flows and risk, independent of the market price. |
| Relative valuation | Valuing a company by comparing its multiples with those of similar companies. |

### Core formulas
```
CAPM:  k = rf + β × (equity risk premium)
Gordon growth: P0 = D1 / (k − g),  where D1 = D0 × (1 + g) and k > g
Sustainable growth ≈ ROE × (1 − payout ratio)
Implied growth (Gordon): g = (P0 × k − D0) / (P0 + D0)
Equity value (DCF) = Σ FCFE_t / (1 + k)^t + [FCFE_N × (1 + g) / (k − g)] / (1 + k)^N
```

### Worked examples

#### Worked example 14.1 — Company Z: statements to ratios (figures in millions, except per share)
| Item | Value |
|---|---|
| Revenue | 1,000 |
| Operating costs (excluding depreciation) | 760 |
| Depreciation | 40 |
| **EBIT** | **200** |
| Interest | 20 |
| Profit before tax | 180 |
| Tax at 25% | 45 |
| **Net income** | **135** |
| Dividends paid | 81 |
| Shareholders' equity (book value) | 900 |
| Net debt | 200 |
| Shares in issue | 50 |
| Share price | 32.40 |

**Track A.**
1. EPS = 135 / 50 = **2.70**; dividend per share = 81 / 50 = **1.62**; payout = **60%**.
2. ROE = 135 / 900 = **15%**; sustainable growth ≈ 15% × (1 − 0.60) = **6%**.
3. P/E = 32.40 / 2.70 = **12.0**; P/B = 32.40 / 18.00 = **1.8**; dividend yield = 1.62 / 32.40 = **5%**.
4. EBITDA = 200 + 40 = 240; market cap = 50 × 32.40 = 1,620; EV = 1,620 + 200 = 1,820; EV/EBITDA = **7.6**.

#### Worked example 14.2 — Cost of equity with CAPM
**Problem.** The local government bond yields 8%, Company Z's beta is 1.2 and the equity risk premium is 6%.
**Track A.** k = 8% + 1.2 × 6% = **15.2%**.

#### Worked example 14.3 — Constant-growth DDM and what the market implies
**Problem (a).** A company just paid a dividend of 2.00, expected to grow 5% a year forever; the required return is 11%.
**Track A.** D1 = 2.00 × 1.05 = 2.10; P0 = 2.10 / (0.11 − 0.05) = **35.00**.

**Problem (b).** Apply the model to Company Z (D0 = 1.62, g = 6%, k = 15.2%), then find the growth rate implied by the market price of 32.40.
**Track A.**
1. Value = 1.62 × 1.06 / (0.152 − 0.06) = **18.67** — well below the market price.
2. Implied growth = (32.40 × 0.152 − 1.62) / (32.40 + 1.62) = **9.7%** a year forever.
3. **Judgement:** either the market expects much faster growth than the 6% the company's ROE and payout suggest, or it uses a lower required return. Learners argue which is more plausible.

#### Worked example 14.4 — Sensitivity of the growth model
Value of the share in 14.3(a) for different required returns and growth rates:

| k \ g | 4% | 5% | 6% |
|---|---|---|---|
| 10% | 34.67 | 42.00 | 53.00 |
| 11% | 29.71 | 35.00 | 42.40 |
| 12% | 26.00 | 30.00 | 35.33 |

**Meaning.** Starting from 35.00, a one-point change in either input moves the value by roughly 14–21%. Precise-looking valuations rest on uncertain assumptions.
**Track B.** Build the grid with `=2*(1+B$1)/($A2-B$1)` and fill across and down.

#### Worked example 14.5 — Two-stage dividend discount model
**Problem.** D0 = 1.00. Dividends grow 15% a year for three years, then 5% forever. Required return 12%.
**Track A.**
1. Dividends: D1 = 1.15; D2 = 1.3225; D3 = 1.5209.
2. PVs at 12%: 1.0268 + 1.0543 + 1.0825 = **3.1636**.
3. D4 = 1.5209 × 1.05 = 1.5969; value at end of year 3 = 1.5969 / (0.12 − 0.05) = 22.8131.
4. PV of that terminal value = 22.8131 / 1.12^3 = **16.2379**.
5. Share value = 3.1636 + 16.2379 = **19.40** — note that 84% of the value comes from the terminal value.

#### Worked example 14.6 — A five-year DCF (free cash flow to equity)
**Problem.** Forecast FCFE (millions): 50, 55, 60, 64, 67. Cost of equity 13%; growth after year 5: 5%; 100 million shares.

**Track A.**

| Year | FCFE | Discount factor (13%) | PV |
|---|---|---|---|
| 1 | 50 | 0.884956 | 44.25 |
| 2 | 55 | 0.783147 | 43.07 |
| 3 | 60 | 0.693050 | 41.58 |
| 4 | 64 | 0.613319 | 39.25 |
| 5 | 67 | 0.542760 | 36.36 |
| **Sum** | | | **204.52** |

1. Terminal value at year 5 = 67 × 1.05 / (0.13 − 0.05) = 879.38; PV = 879.38 × 0.542760 = **477.29**.
2. Equity value = 204.52 + 477.29 = **681.81 million** → **6.82 per share**.

**Track B.** `=NPV(13%,B2:B6)+B6*(1+5%)/(13%-5%)/(1+13%)^5`.

#### Worked example 14.7 — Relative valuation
**Problem.** A company's EPS is 4.00 and its book value per share is 30. Four listed peers trade on P/E ratios of 10, 11, 13 and 15.
**Track A.** Median peer P/E = 12 → value ≈ 4.00 × 12 = **48** (implying P/B = 1.6). Learners discuss whether the peers are truly comparable (growth, risk, accounting, country).

#### Case 14.1 — Valuing an emerging-market company consistently
Learners value the same company in local currency and in US dollars. They must use a local-currency risk-free rate and local inflation for the first, and dollar rates for the second, and show that mixing a rand risk-free rate with dollar cash flows (or the reverse) produces nonsense. Discussion: when is an extra country-risk premium justified?

#### Track C — Python
```python
def gordon(d0, g, k):
    return d0 * (1 + g) / (k - g)

def two_stage(d0, g1, n, g2, k):
    pv, d = 0.0, d0
    for t in range(1, n + 1):
        d *= 1 + g1
        pv += d / (1 + k) ** t
    terminal = d * (1 + g2) / (k - g2)
    return pv + terminal / (1 + k) ** n

def dcf_equity(fcfe, k, g):
    pv = sum(cf / (1 + k) ** t for t, cf in enumerate(fcfe, start=1))
    terminal = fcfe[-1] * (1 + g) / (k - g) / (1 + k) ** len(fcfe)
    return pv + terminal

capm = 0.08 + 1.2 * 0.06
print(round(capm, 3))                                           # 0.152
print(round(gordon(2.00, 0.05, 0.11), 2))                       # 35.0
print(round(gordon(1.62, 0.06, capm), 2))                       # 18.67
print(round((32.40 * capm - 1.62) / (32.40 + 1.62), 4))         # 0.0971 implied growth
print(round(two_stage(1.00, 0.15, 3, 0.05, 0.12), 2))           # 19.4
print(round(dcf_equity([50, 55, 60, 64, 67], 0.13, 0.05), 2))   # 681.81
for k in (0.10, 0.11, 0.12):
    print(k, [round(gordon(2.00, g, k), 2) for g in (0.04, 0.05, 0.06)])
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 8 numeric)
- [ ] Applied task: from a listed company's latest annual report, calculate six ratios, a CAPM cost of equity, a DDM or DCF value and a peer-multiple value; reconcile them with the market price in 300 words
- [ ] Optional Python task: automate the ratio calculations from a CSV of statement data

**Benchmark trace:** T10 (5 ●; 10 ●+◐) and T11: CFA C3 M2 valuation of common shares and C4 M4 financial statements [S1]; CISI dividend yield [S2]; FINRA SIE purpose of financial statements [S3]; Yale Gordon growth model and dividends as present value [S6]; MIT equities [S8]; IMF relating equity values to fundamentals [S9]; NYIF ratio analysis, DDM, comparables, EV and equity risk premium [S10]; SAIFM equity valuation (elective) [S4] → `[D5]`.

---

## M15 — Valuing derivatives

**Hours:** 8 core (Learn 3 · Practise 4 · Assess 1) + 1.5 Python

**Why it matters.** Derivative prices are not guesses about the future; they are tied to the price of the underlying by the rule that riskless profits should not exist. This idea — no arbitrage — is one of the most powerful in finance.

### Learning objectives
1. **[Understand]** Explain the no-arbitrage principle and pricing by replication.
2. **[Apply]** Calculate a forward price using cost of carry, with and without income on the underlying, and design a cash-and-carry arbitrage when a forward is mispriced.
3. **[Understand]** Relate futures prices to forward prices and the FX forward from M8 to the general model.
4. **[Understand]** Identify the factors that determine option values and the split between intrinsic and time value.
5. **[Apply]** Price a European option with a one-step binomial model using both replication and risk-neutral probabilities.
6. **[Apply]** Price European calls and puts with the Black-Scholes-Merton model and check them with put–call parity.
7. **[Apply]** Calculate a par swap rate from discount factors and value an existing swap.
8. **[Evaluate]** Explain the limits of pricing models and how model and liquidity risk can cause large losses.

### Subtopics
- No-arbitrage and replication: the law of one price
- Forwards and futures: cost of carry; income and storage; index futures fair value; FX forwards (interest-rate parity) as a special case
- Options: intrinsic value, time value; effects of price, strike, time, volatility, interest rates and dividends
- Binomial model: one step, replication, risk-neutral probability; (multi-step as extension)
- Black-Scholes-Merton: inputs, interpretation, put–call parity; implied volatility
- Swaps: discount factors, par swap rate, mark-to-market value
- Model risk: volatility smiles, fat tails, liquidity and leverage

### Key terms

| Term | Plain-English meaning |
|---|---|
| No-arbitrage principle | Prices adjust so that no one can earn a riskless profit with no investment. |
| Replication | Building a portfolio of simpler assets that produces the same payoff as a derivative. |
| Cost of carry | The net cost of holding the underlying until the forward date (financing minus income, plus storage). |
| Cash-and-carry arbitrage | Buying the underlying and selling a forward that is priced too high. |
| Intrinsic value | What an option would be worth if exercised now (never less than zero). |
| Time value | Option premium minus intrinsic value: the value of the remaining chance of a better outcome. |
| Volatility | How much an asset's price tends to fluctuate, usually measured as annualised standard deviation of returns. |
| Implied volatility | The volatility that makes a model price equal the market price. |
| Risk-neutral probability | A pricing probability under which every asset is expected to earn the risk-free rate. |
| Delta | How much an option's value changes for a small change in the underlying price; also the number of shares in the replicating portfolio. |
| Put–call parity | A no-arbitrage link between European call and put prices with the same strike and expiry. |
| Par swap rate | The fixed rate that gives a new swap zero value at inception. |
| Mark-to-market | Revaluing a position at current market prices. |
| Model risk | The risk of loss because a model is wrong or misused. |

### Core formulas
```
Forward (discrete):   F = S × (1 + r)^T                      (no income)
                      F ≈ S × (1 + r)^T / (1 + q)^T          (income yield q)
Binomial (one step):  p = (R − d) / (u − d);  C = [p × Cu + (1 − p) × Cd] / R
Black-Scholes-Merton: d1 = [ln(S/K) + (r + σ²/2)T] / (σ√T);  d2 = d1 − σ√T
                      Call = S × N(d1) − K × e^(−rT) × N(d2)
                      Put  = K × e^(−rT) × N(−d2) − S × N(−d1)
Put–call parity:      C − P = S − K × e^(−rT)
Par swap rate:        s = (1 − DF_n) / (DF_1 + DF_2 + … + DF_n)
```
(`N(x)` is the probability that a standard normal variable is below x; `ln` is the natural logarithm; `e` ≈ 2.71828.)

### Worked examples

#### Worked example 15.1 — Forward price and a cash-and-carry arbitrage
**Problem.** A non-dividend-paying share costs 100. The one-year interest rate is 6%. (a) What is the fair one-year forward price? (b) A dealer quotes 108. Exploit it.

**Track A.**
1. Fair forward = 100 × 1.06 = **106**.
2. Arbitrage at 108: borrow 100 at 6%; buy the share; sell the forward at 108.
3. In one year: deliver the share, receive 108, repay 106. Riskless profit = **2** per share.
4. Learners write the reverse trade if the forward were quoted at 103.

**With income.** If the share pays a 2% income yield, F ≈ 100 × 1.06 / 1.02 = **103.92**: income reduces the cost of carry. The FX forward in M8 is the same model, with the foreign interest rate playing the role of income.

#### Worked example 15.2 — One-step binomial option pricing
**Problem.** A share costs 100. In one period it will be worth 110 (up) or 90 (down). The risk-free growth factor for the period is 1.05. Price a call with strike 100.

**Track A — replication.**
1. Call payoff: up = 10; down = 0.
2. Shares needed (delta) = (10 − 0) / (110 − 90) = **0.5**.
3. Borrow the PV of the down-state value of those shares: 0.5 × 90 / 1.05 = **42.86**.
4. Cost of the replicating portfolio = 0.5 × 100 − 42.86 = **7.14** = the call's value.

**Track A — risk-neutral probability.**
1. p = (1.05 − 0.90) / (1.10 − 0.90) = **0.75**.
2. Call = (0.75 × 10 + 0.25 × 0) / 1.05 = **7.14** — the same answer.
3. Put with strike 100 = (0.25 × 10) / 1.05 = **2.38**; check parity: 7.14 − 2.38 = 4.76 = 100 − 100 / 1.05 ✓.

#### Worked example 15.3 — Black-Scholes-Merton
**Problem.** S = 100, K = 100, one year to expiry, continuously compounded risk-free rate 5%, volatility 20%. Price the European call and put.

**Track A.**
1. d1 = [ln(100/100) + (0.05 + 0.02) × 1] / 0.20 = 0.07 / 0.20 = **0.35**; d2 = 0.35 − 0.20 = **0.15**.
2. From normal tables: N(0.35) = 0.6368; N(0.15) = 0.5596.
3. K × e^(−0.05) = 95.12.
4. Call = 100 × 0.6368 − 95.12 × 0.5596 = **10.45**.
5. Put = 95.12 × (1 − 0.5596) − 100 × (1 − 0.6368) = **5.57**.
6. Parity: 10.45 − 5.57 = 4.88 = 100 − 95.12 ✓.

**Track B.**
- `d1: =(LN(100/100)+(5%+0.2^2/2)*1)/(0.2*SQRT(1))`
- `Call: =100*NORM.S.DIST(d1,TRUE)-100*EXP(-5%*1)*NORM.S.DIST(d2,TRUE)` → 10.45

**Meaning.** Volatility is the only input not directly observable; traders often quote options by their implied volatility rather than their price.

#### Worked example 15.4 — What moves an option's value?
Learners complete, then test in the spreadsheet model, the effect of an increase in each input (holding others constant):

| Increase in… | European call | European put |
|---|---|---|
| Underlying price | ↑ | ↓ |
| Strike price | ↓ | ↑ |
| Time to expiry | ↑ | usually ↑ |
| Volatility | ↑ | ↑ |
| Risk-free rate | ↑ | ↓ |
| Expected dividends | ↓ | ↑ |

#### Worked example 15.5 — Par swap rate and swap value
**Problem.** Zero-coupon (spot) rates are 6.0% (1 year), 6.5% (2 years) and 7.0% (3 years), annual compounding. (a) Find the fixed rate on a new 3-year annual-pay swap. (b) A company already pays 7% fixed on a 10 million, 3-year swap. What is the swap worth to it today?

**Track A.**
1. Discount factors: 1/1.06 = 0.943396; 1/1.065² = 0.881659; 1/1.07³ = 0.816298. Sum = 2.641353.
2. Par swap rate = (1 − 0.816298) / 2.641353 = **6.955%**.
3. Value to the 7% fixed payer = PV of floating leg − PV of fixed leg = 10,000,000 − (700,000 × 2.641353 + 10,000,000 × 0.816298) ≈ **−11,926**. It pays slightly more than today's market rate, so the swap is a small liability.

#### Case 15.1 — When the models met the market (1998)
Long-Term Capital Management, a hedge fund whose partners included two of the economists honoured for option-pricing theory, ran highly leveraged positions betting that price gaps between related securities would close. In 1998, after Russia defaulted on domestic debt, those gaps widened instead; the fund's losses threatened its many bank counterparties, and the Federal Reserve Bank of New York coordinated a private-sector recapitalisation. **Discussion:** separate the roles of model error, leverage, liquidity and concentration, and connect each to M17.

#### Track C — Python
```python
from math import exp, log, sqrt
from statistics import NormalDist

N = NormalDist().cdf

def forward_price(spot, r, t, q=0.0):
    return spot * (1 + r) ** t / (1 + q) ** t

def binomial_one_step(s, k, u, d, growth, call=True):
    p = (growth - d) / (u - d)
    payoff = (lambda x: max(x - k, 0)) if call else (lambda x: max(k - x, 0))
    return (p * payoff(s * u) + (1 - p) * payoff(s * d)) / growth

def black_scholes(s, k, t, r, sigma):
    d1 = (log(s / k) + (r + sigma ** 2 / 2) * t) / (sigma * sqrt(t))
    d2 = d1 - sigma * sqrt(t)
    call = s * N(d1) - k * exp(-r * t) * N(d2)
    put = k * exp(-r * t) * N(-d2) - s * N(-d1)
    return call, put

def par_swap_rate(spot_rates):
    dfs = [1 / (1 + z) ** t for t, z in enumerate(spot_rates, start=1)]
    return (1 - dfs[-1]) / sum(dfs)

print(forward_price(100, 0.06, 1), round(forward_price(100, 0.06, 1, 0.02), 2))   # 106.0 103.92
print(round(binomial_one_step(100, 100, 1.1, 0.9, 1.05), 2))                      # 7.14
call, put = black_scholes(100, 100, 1, 0.05, 0.20)
print(round(call, 2), round(put, 2))                                              # 10.45 5.57
print(round(par_swap_rate([0.06, 0.065, 0.07]), 5))                               # 0.06955
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 8 numeric)
- [ ] Applied task: build a Black-Scholes-Merton spreadsheet; chart call and put values against volatility and time; back out the implied volatility of one listed option using Goal Seek
- [ ] **Checkpoint exam 2** (Parts 3–4): 40 items, 60 minutes, 70% to pass

**Benchmark trace:** T16 is the thinnest major topic (1 ●; 4 ●+◐), taught fully only by MIT [S8], with partial treatment in Yale (fair value of futures, put–call parity) [S6], NYIF (pricing swaps, option-pricing factors) [S10] and LSE [S13]; CISI forward rate by interest-rate parity [S2]; CFA derivative key terms [S1] → `[D5]`, `[D6]`, `[D11]`.

---

## PART 5 — RISK

---

## M16 — Risk, return and portfolios

**Hours:** 7 core (Learn 3 · Practise 3 · Assess 1) + 1.5 Python

**Why it matters.** Return is only half of an investment decision; the other half is risk. Combining assets that do not move together reduces risk without necessarily reducing return — the closest thing finance has to a free lunch. This module also asks how rational markets really are.

### Learning objectives
1. **[Apply]** Calculate holding-period, annualised, arithmetic-average and geometric-average returns.
2. **[Apply]** Calculate expected return, standard deviation, covariance and correlation.
3. **[Apply]** Calculate the expected return and risk of a two-asset portfolio and show the effect of correlation.
4. **[Understand]** Distinguish systematic (market) risk from unsystematic (specific) risk and explain why only the first is rewarded.
5. **[Understand]** Explain the efficient frontier, the role of a risk-free asset and asset allocation.
6. **[Apply]** Estimate beta from data and use the CAPM security market line to judge whether a share is fairly priced.
7. **[Apply]** Evaluate performance with the Sharpe ratio and Jensen's alpha.
8. **[Understand]** Explain the efficient-market hypothesis and the main behavioural biases, and how bubbles form.
9. **[Evaluate]** Draw conclusions for active versus passive investing.

### Subtopics
- Measuring return over time; compounding and averaging pitfalls
- Measuring risk: variance, standard deviation, downside measures
- Diversification: covariance, correlation, portfolio risk; global diversification and home bias
- Portfolio construction: efficient frontier, capital allocation line, asset allocation and rebalancing
- Asset pricing: CAPM, beta, security market line; a note on multi-factor models
- Performance evaluation: Sharpe ratio, alpha, benchmarks
- Market efficiency (weak, semi-strong, strong forms)
- Behavioural finance: overconfidence, loss aversion (prospect theory), anchoring, herding, mental accounting; bubbles

### Key terms

| Term | Plain-English meaning |
|---|---|
| Holding-period return | Total gain (price change plus income) ÷ starting price, over the holding period. |
| Arithmetic average | The simple average of period returns. |
| Geometric average | The constant per-period return that gives the same ending value; the true compound rate. |
| Expected return | The probability-weighted average of possible returns. |
| Variance / standard deviation | Measures of how widely returns vary; standard deviation is the square root of variance. |
| Covariance | How two assets' returns move together, in squared units. |
| Correlation | Covariance scaled to between −1 and +1. |
| Diversification | Spreading money across assets so that individual shocks partly cancel out. |
| Systematic (market) risk | Risk that affects the whole market and cannot be diversified away. |
| Unsystematic (specific) risk | Risk specific to one company or sector; can be diversified away. |
| Efficient frontier | Portfolios giving the highest expected return for each level of risk. |
| Asset allocation | Dividing a portfolio among asset classes (shares, bonds, cash, alternatives). |
| Security market line | The CAPM line linking beta to required return. |
| Alpha | Return above what the portfolio's risk would justify. |
| Sharpe ratio | Excess return over the risk-free rate per unit of standard deviation. |
| Efficient-market hypothesis | The idea that prices fully reflect available information. |
| Behavioural finance | The study of how psychology causes systematic investor errors. |
| Loss aversion | Feeling losses more strongly than equal gains. |
| Bubble | A period when prices rise far above fundamental value, driven by expectations of further rises. |
| Home bias | Investors' tendency to over-invest in their own country's assets. |

### Core formulas
```
HPR = (P1 − P0 + Income) / P0
Portfolio return:  E(Rp) = w × E(RA) + (1 − w) × E(RB)
Portfolio variance: σp² = w²σA² + (1 − w)²σB² + 2w(1 − w) × ρAB × σA × σB
Beta = Cov(stock, market) / Var(market)
CAPM: E(R) = rf + β × [E(Rm) − rf]
Sharpe = (Rp − rf) / σp;   Jensen's alpha = Rp − [rf + β × (Rm − rf)]
```

### Worked examples

#### Worked example 16.1 — Returns over time
**Problem (a).** You buy a share at 50, receive a dividend of 2 and sell at 55. **Track A.** HPR = (55 − 50 + 2) / 50 = **14%**.

**Problem (b).** An investment returns +50% then −50%. **Track A.** Arithmetic average = **0%**; actual path 100 → 150 → 75; geometric average = (1.5 × 0.5)^0.5 − 1 = **−13.4%** a year. The geometric average tells you what really happened to your money.

#### Worked example 16.2 — Diversification in numbers
**Problem.** Asset A: expected return 10%, standard deviation 15%. Asset B: 6% and 8%. Correlation 0.2. Portfolio: 60% A, 40% B. Risk-free rate 4%.

**Track A.**
1. Expected return = 0.6 × 10% + 0.4 × 6% = **8.4%**.
2. Variance = 0.36 × 0.0225 + 0.16 × 0.0064 + 2 × 0.6 × 0.4 × 0.2 × 0.15 × 0.08 = 0.010276.
3. Standard deviation = **10.14%** — lower than the weighted average of 12.2%.
4. Sharpe ratio = (8.4% − 4%) / 10.14% = **0.43**.
5. Repeat with other correlations: ρ = +1 → 12.2%; ρ = 0 → 9.55%; ρ = −1 → 5.8%.

**Meaning.** The lower the correlation, the bigger the risk reduction for the same expected return.
**Track B.** `=SQRT(0.6^2*0.15^2+0.4^2*0.08^2+2*0.6*0.4*0.2*0.15*0.08)`.

#### Worked example 16.3 — Estimating beta and applying CAPM
**Problem.** Six monthly returns — market: 2%, −1%, 3%, −2%, 1%, 3%; share: 3%, −2%, 4%, −3%, 1%, 5%. Estimate the share's beta. If the risk-free rate is 6% and the market is expected to return 12% a year, what return should investors require?

**Track A.**
1. Covariance (share, market) = 0.00068; variance (market) = 0.00044.
2. Beta = 0.00068 / 0.00044 = **1.55**: the share tends to move about 1.5 times as much as the market.
3. Required return = 6% + 1.55 × (12% − 6%) = **15.3%**.
4. If analysts expect 18%, the share plots above the security market line (positive expected alpha); if they expect 13%, below it.

**Track B.** `=SLOPE(share_range, market_range)` → 1.55; `=CORREL(…)` → 0.99. (Six observations are far too few in practice; analysts typically use 36–60 monthly returns.)

#### Worked example 16.4 — Did the manager add value?
**Problem.** A fund returned 12% with a standard deviation of 15% and a beta of 1.1. Its benchmark returned 10% with a standard deviation of 12%. The risk-free rate was 5%.
**Track A.** Sharpe: fund (12 − 5) / 15 = **0.47**; benchmark (10 − 5) / 12 = **0.42**. Jensen's alpha = 12% − [5% + 1.1 × (10% − 5%)] = **+1.5%**. The fund beat its benchmark after adjusting for risk — learners then discuss whether one year is enough evidence.

#### Case 16.1 — Bubbles and behaviour
Yale's course pairs efficient-market theory with Shiller's work on speculative bubbles and investor psychology [S6]. Learners read a set of short (fictional) investor diaries written during a market boom and label the biases at work, then explain why, even if prices are hard to beat, they can still be wrong.

#### Case 16.2 — Home bias in an emerging market
An investor in Johannesburg holds only South African assets. Learners compare the risk of a local-only portfolio with one including global equities, discuss currency effects (M8), and note that many countries cap how much retirement savings may be invested abroad (in South Africa, through Regulation 28 of the Pension Funds Act) — a policy trade-off between diversification and domestic capital.

#### Track C — Python
```python
import statistics as st
from math import sqrt

def portfolio_sd(w, sd_a, sd_b, rho):
    return sqrt(w**2 * sd_a**2 + (1 - w)**2 * sd_b**2 + 2 * w * (1 - w) * rho * sd_a * sd_b)

print(round(portfolio_sd(0.6, 0.15, 0.08, 0.2), 4))            # 0.1014
for rho in (1, 0, -1):
    print(rho, round(portfolio_sd(0.6, 0.15, 0.08, rho), 4))   # 0.122, 0.0955, 0.058

market = [0.02, -0.01, 0.03, -0.02, 0.01, 0.03]
share = [0.03, -0.02, 0.04, -0.03, 0.01, 0.05]
beta = st.covariance(share, market) / st.variance(market)
print(round(beta, 2), round(0.06 + beta * (0.12 - 0.06), 4))  # 1.55 0.1527
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 7 numeric)
- [ ] Applied task: download five years of monthly prices for a market index and three shares (one domestic, one foreign, one from a different sector); calculate returns, standard deviations, the correlation matrix, betas and an equal-weighted portfolio's risk
- [ ] Reflection: which behavioural bias are you most prone to, and what rule would counter it?

**Benchmark trace:** T23 (7 ●), T24, T28: CFA C3 M1 statistics, C5 M2 diversification and allocation, C5 M4 performance and alpha [S1]; SAIFM statistical concepts and portfolio theory [S4]; NISM asset allocation and diversification [S5]; Yale diversification, CAPM, beta, efficient frontier, behavioural finance [S6]; MIT risk and return, portfolio theory, CAPM, efficient markets [S8]; IMF diversification and optimal portfolios [S9]; LSE risk, return, portfolio theory, efficiency, CAPM [S13] → `[D11]`.

---

## M17 — Managing financial risk

**Hours:** 6 core (Learn 2.5 · Practise 2.5 · Assess 1) + 1 Python

**Why it matters.** Firms fail not only because they take risk but because they misjudge, hide or concentrate it. This module turns the measures learned so far into a management system.

### Learning objectives
1. **[Understand]** Classify financial risks: market, credit (including counterparty and settlement), liquidity (market and funding), operational (including cyber), legal and compliance, model, concentration and systemic risk.
2. **[Understand]** Describe the risk-management process — identify, measure, limit, monitor, report — and the "three lines" model of accountability.
3. **[Apply]** Calculate parametric value at risk (VaR), scale it over time, and read historical VaR and expected shortfall from data.
4. **[Understand]** Explain stress testing and back-testing and why VaR alone is not enough.
5. **[Apply]** Calculate credit expected loss and net counterparty exposure after collateral.
6. **[Apply]** Assess funding liquidity under a margin call.
7. **[Understand]** Outline bank capital and liquidity rules at a conceptual level.
8. **[Analyse]** Diagnose risk-management failures in real cases.

### Subtopics
- Risk taxonomy and risk appetite
- Organisation: front office, risk function, compliance, internal audit (three lines); limits; segregation of duties
- Market risk: sensitivities (duration from M13, delta from M15), VaR, expected shortfall, stress tests, back-tests
- Credit risk: probability of default, loss given default, exposure at default; ratings; collateral, netting, CCP clearing
- Liquidity risk: market liquidity (from M12) and funding liquidity; margin and collateral calls
- Operational risk: process, people, systems, external events, cyber; reconciliations and controls
- Hedging with derivatives (from M9) and its residual risks
- Bank regulation in brief: capital adequacy and liquidity buffers (Basel framework)

### Key terms

| Term | Plain-English meaning |
|---|---|
| Market risk | Losses from moves in prices, rates or exchange rates. |
| Credit risk | Losses because a borrower or counterparty does not pay. |
| Counterparty risk | Credit risk on the other side of a trade or derivative. |
| Liquidity risk | Being unable to sell assets or raise cash quickly without heavy losses. |
| Operational risk | Losses from failed processes, people or systems, or external events. |
| Concentration risk | Too much exposure to one name, sector, country or factor. |
| Systemic risk | The risk that problems in one part of the financial system spread to the whole. |
| Risk appetite | The amount and type of risk an organisation is willing to take. |
| Value at risk (VaR) | A loss that should be exceeded only with a stated small probability over a stated period. |
| Expected shortfall | The average loss on the days that are worse than the VaR. |
| Stress test | Revaluing positions under a severe but plausible scenario. |
| Back-testing | Checking how often actual losses exceeded predicted VaR. |
| Probability of default (PD) | The likelihood a borrower defaults within a period. |
| Loss given default (LGD) | The share of exposure lost if default occurs. |
| Exposure at default (EAD) | The amount owed at the moment of default. |
| Expected loss | PD × LGD × EAD. |
| Three lines model | Business units own risk; risk and compliance oversee it; internal audit independently checks both. |
| Capital adequacy | Holding enough loss-absorbing capital relative to risks taken. |

### Worked examples and cases

#### Worked example 17.1 — Parametric VaR
**Problem.** A 10,000,000 portfolio has a daily return standard deviation of 1.2%. Assume returns are normally distributed with zero mean. Find 1-day 95% and 99% VaR and 10-day 95% VaR.
**Track A.**
1. 95% one-tailed z-value = 1.645 → VaR = 10,000,000 × 1.645 × 0.012 = **197,400**.
2. 99% (z = 2.326) → **279,120**.
3. 10-day 95% ≈ 197,400 × √10 = **624,234** (assumes independent days — often untrue in a crisis).

**Meaning.** "On 19 days out of 20 we expect to lose less than 197,400" — VaR says nothing about how bad the 20th day can be.

#### Worked example 17.2 — Historical VaR and expected shortfall
**Problem.** A 1,000,000 portfolio's last 20 daily returns (%) were: −2.1, 0.4, 1.2, −0.8, 0.3, −1.5, 0.9, 0.2, −0.4, 1.1, −3.0, 0.6, 0.1, −0.9, 0.7, −1.2, 0.5, 0.8, −0.3, 1.0. Estimate 90% one-day VaR and expected shortfall.
**Track A.**
1. Sort from worst: −3.0, −2.1, −1.5, −1.2, …
2. The worst 10% of 20 days = the 2 worst days. Using the convention "VaR = the smallest loss in the tail", VaR ≈ 2.1% → **21,000**.
3. Expected shortfall = average of the tail = (3.0 + 2.1) / 2 = 2.55% → **25,500**.
4. Note: conventions differ; 20 observations are only for illustration (banks typically use at least a year of data).

#### Worked example 17.3 — Credit expected loss and collateral
**Problem (a).** A bank lends 1,000,000 to a borrower with a 2% one-year probability of default and 45% loss given default. **Track A.** Expected loss = 0.02 × 0.45 × 1,000,000 = **9,000** — priced into the loan rate and covered by provisions; *unexpected* losses are covered by capital.

**Problem (b).** An OTC derivative is worth +5,000,000 to the bank, which holds collateral of 4,200,000. **Track A.** Net counterparty exposure = **800,000** — what the bank could lose if the counterparty failed today.

#### Worked example 17.4 — Can we meet the margin call?
**Problem.** A pension fund faces a 30,000,000 collateral call due today. It has 10,000,000 in cash and 50,000,000 of government bonds that can be repo'd at a 5% haircut.
**Track A.** Repo capacity = 50,000,000 × 0.95 = 47,500,000; available today = 57,500,000 → the call can be met. If the haircut rose to 20% *and* bond prices fell 25%, capacity would be 50,000,000 × 0.75 × 0.80 = 30,000,000 → only 40,000,000 in total, with less buffer for the next call. Liquidity can disappear exactly when it is needed.

#### Case 17.1 — Archegos (2021): leverage hidden in swaps
A family office, Archegos Capital Management, built large, concentrated positions in a handful of shares through total return swaps with several banks, each unaware of the full size of its positions elsewhere. When the share prices fell in March 2021 and it could not meet margin calls, the banks sold the underlying shares; some banks lost billions of dollars. **Task:** identify the failures of concentration limits, counterparty exposure measurement and information sharing, and propose controls.

#### Case 17.2 — UK pension funds and the gilt market (2022)
In September 2022 UK government bond (gilt) yields rose sharply. Pension funds using leveraged liability-driven investment (LDI) strategies faced large collateral calls; selling gilts to meet them pushed yields higher still, and the Bank of England stepped in temporarily to buy long-dated gilts. **Task:** link this case to Worked example 17.4 and to the futures margin example in M9.

#### Track C — Python
```python
from math import sqrt
from statistics import NormalDist

value, daily_sd = 10_000_000, 0.012
for conf in (0.95, 0.99):
    z = NormalDist().inv_cdf(conf)
    print(conf, round(value * z * daily_sd))          # 197382 and 279162 (exact z; tables give 197,400 and 279,120)
print(round(value * 1.645 * daily_sd * sqrt(10)))     # 624234 (10-day, table z = 1.645)

returns = [-2.1, 0.4, 1.2, -0.8, 0.3, -1.5, 0.9, 0.2, -0.4, 1.1,
           -3.0, 0.6, 0.1, -0.9, 0.7, -1.2, 0.5, 0.8, -0.3, 1.0]
tail = sorted(returns)[: int(0.10 * len(returns))]    # worst 10% of days
print(-tail[-1] / 100 * 1_000_000, -sum(tail) / len(tail) / 100 * 1_000_000)   # 21000.0 25500.0

print(round(0.02 * 0.45 * 1_000_000, 2))              # 9000.0 expected loss
```

### Assessment
- [ ] Knowledge check: 15 items (≥ 6 numeric)
- [ ] Applied task: build a one-page risk report for a small multi-asset portfolio — exposures, duration, beta, 95% VaR, one historical and one hypothetical stress scenario, and top three risks
- [ ] Case write-up (400 words): Archegos or the 2022 gilt episode

**Benchmark trace:** T25 (3 ●; 9 ●+◐): CFA C5 M3 risk management incl. operational, compliance and investment risk and VaR [S1]; FINRA SIE risk types and mitigation [S3]; Yale VaR and stress tests [S6]; IMF VaR, stressed VaR, expected shortfall, back-testing and credit risk [S9]; NYIF bond risks and Basel III [S10]; JSE CCP risk mitigation [S11]; NISM risk-management systems [S5] → `[D5]`, `[D6]`.

---

## PART 6 — REGULATION AND ETHICS

---

## M18 — Regulation, market integrity and ethics

**Hours:** 7 core (Learn 3.5 · Practise 2.5 · Assess 1)

**Why it matters.** Capital markets run on trust: investors hand over money to people they will never meet, on the strength of information they cannot fully check. Regulation and professional ethics are what make that trust reasonable.

### Learning objectives
1. **[Understand]** Explain why markets are regulated: information gaps, conflicts of interest, externalities and systemic risk.
2. **[Know]** State IOSCO's three objectives of securities regulation and outline the areas its 38 principles cover; name the standards for market infrastructure (CPMI-IOSCO) and banks (Basel Committee).
3. **[Understand]** Compare regulatory architectures — single regulator, sectoral, "twin peaks" — using the US, UK/EU, South Africa and India as lenses.
4. **[Understand]** Describe how issuers (disclosure, governance) and intermediaries (licensing, capital, conduct, client protection) are regulated.
5. **[Know]** Recognise market abuse: insider dealing, unlawful disclosure, market manipulation (including spoofing, pump-and-dump and marking the close) and front running.
6. **[Know]** Explain money laundering (placement, layering, integration), terrorist financing, sanctions, fraud and cybercrime, and firms' know-your-customer and reporting duties.
7. **[Apply]** Use an ethical decision-making framework to resolve workplace dilemmas, with reference to professional codes.
8. **[Evaluate]** Analyse a regulatory failure and propose remedies.

### Subtopics
- The purpose and limits of regulation; regulation vs supervision vs enforcement
- International standard setters: IOSCO (securities), CPMI-IOSCO (market infrastructure), Basel Committee (banks), Financial Stability Board (coordination), FATF (money laundering)
- National architectures and comparison lenses
  - United States: SEC and other agencies plus self-regulatory organisations such as FINRA
  - United Kingdom and EU: conduct and prudential regulators; EU-level authorities and harmonised rules
  - South Africa: twin-peaks model — conduct (FSCA) and prudential (Prudential Authority within the SARB) — plus exchange self-regulation
  - India: SEBI, with NISM as its education arm
- Issuer regulation: prospectus and continuous disclosure, corporate governance, takeovers
- Intermediary regulation: authorisation, fit and proper staff, capital, suitability and best interest, best execution, conflicts, client money and assets, complaints and compensation
- Market integrity: market abuse types and surveillance; benchmark regulation
- Financial crime: AML/CFT programmes, KYC, suspicious transaction reports, sanctions screening
- Ethics: trust and stakeholder duties; codes of conduct; a decision framework; whistleblowing

### Key terms

| Term | Plain-English meaning |
|---|---|
| Regulator | A public body that writes and enforces financial rules. |
| Prudential regulation | Rules keeping firms financially sound (capital, liquidity). |
| Conduct regulation | Rules on how firms treat clients and behave in markets. |
| Twin peaks | A model with separate prudential and conduct regulators. |
| Authorisation (licensing) | Permission to carry on a regulated activity. |
| Disclosure | Publishing information investors need to make decisions. |
| Fiduciary duty | A legal duty to act in another person's best interests. |
| Conflict of interest | A situation where a firm's or employee's interests could bias their service to a client. |
| Suitability / best interest | Recommendations must fit the client's needs and circumstances. |
| Inside information | Precise, non-public information that would likely move a price if made public. |
| Insider dealing | Trading on inside information. |
| Market manipulation | Actions that give false or misleading signals about price or supply and demand. |
| Spoofing | Placing orders with no intention of executing them to mislead other traders. |
| Front running | Trading ahead of a client's order to profit from its price impact. |
| Money laundering | Making criminal proceeds appear legitimate. |
| Know your customer (KYC) | Verifying clients' identity and understanding their activity. |
| Suspicious transaction report | A report to authorities about activity that may involve crime. |
| Sanctions | Legal restrictions on dealing with designated people, firms or countries. |
| Whistleblowing | Reporting wrongdoing, internally or to a regulator. |

### Worked examples and cases

#### Exercise 18.1 — Abuse or not?
Learners classify eight short scenarios as insider dealing, unlawful disclosure, manipulation, front running or legitimate activity — for example: an analyst trades the day before her firm publishes a buy recommendation; a trader places and cancels large orders to move the price; an investor buys after reading a public announcement before others.

#### Exercise 18.2 — Following dirty money
A case narrative (cash deposits split into small amounts → transfers through several companies and countries → purchase of listed shares and property) is mapped to placement, layering and integration; learners list the red flags at each stage and which institution should have noticed them.

#### Exercise 18.3 — An ethical decision framework in action
Using a four-step framework (identify the facts and stakeholders; identify duties and applicable rules; consider options and their consequences; decide, act and reflect), learners resolve two dilemmas: a lavish gift from a broker seeking your business, and pressure from a manager to soften a negative research report on a corporate-finance client.

#### Case 18.1 — Rigging a benchmark: LIBOR
From 2012, regulators in several countries fined major banks for attempting to manipulate LIBOR submissions. Learners trace how a benchmark based on bank *estimates* invited manipulation, how authorities responded with benchmark regulation and transaction-based replacement rates, and connect this to the JIBAR-to-ZARONIA transition covered in M3 [R4].

#### Case 18.2 — Accounting and governance failure: Steinhoff
In December 2017 Steinhoff, a multinational retailer with its primary listing in Frankfurt and a secondary listing on the JSE, disclosed accounting irregularities; its share price collapsed and investigations and litigation followed in several countries. Learners analyse the roles of the board, auditors, regulators, analysts and institutional investors, and propose three changes to governance or disclosure.

#### Case 18.3 — One scenario, four rulebooks (research task)
Learners take a single insider-dealing scenario and find, from official sources, which authority would investigate it and what sanctions are available in the US, the UK, South Africa and India — demonstrating that principles are global but enforcement is national.

### Assessment
- [ ] Knowledge check: 15 items
- [ ] Applied task: regulatory map — for your own country, chart the regulators, exchange(s), CCP(s), CSD and investor-compensation arrangements, with links to official sources
- [ ] Ethics task: written resolution of one dilemma using the framework (300 words)

**Benchmark trace:** T26 (8 ●) and T27: CFA C1 M5–M6 regulation, compliance failure, ethical decision framework [S1]; CISI element 8 incl. code of conduct, money laundering, market abuse [S2]; FINRA SIE AML, market manipulation, insider trading, conduct and best interest [S3]; SAIFM *Regulation and Ethics of the SA Financial Markets* [S4]; NISM regulatory framework and investor grievance redress [S5]; Yale national and international regulation [S6]; NYIF regulation, asymmetric information and Basel III [S10]; JSE legal and regulatory structure of markets and FMIs [S11]; international standards [R2], [R3] → `[D8]`, `[D9]`.

---

## PART 7 — GLOBAL CONTEXT

---

## M19 — Global and emerging markets, crises and the future

**Hours:** 6 core (Learn 3 · Practise 2 · Assess 1)

**Why it matters.** Capital markets are connected: money moves across borders in seconds, crises spread, and emerging markets — including Africa's — face different trade-offs from the US or Europe. This module draws the course together and looks ahead.

### Learning objectives
1. **[Analyse]** Compare developed, emerging and frontier markets on size, liquidity, investor base, currency and regulation, and place a market on a development path.
2. **[Understand]** Describe Africa's capital-market landscape: major national exchanges, regional exchanges, local-currency bond markets and pension-fund savings.
3. **[Understand]** Explain how currency mismatch, short-term debt and sudden stops in capital flows cause emerging-market crises, and how contagion spreads.
4. **[Analyse]** Explain the causes and transmission of the 2008 global financial crisis.
5. **[Analyse]** Evaluate recent sovereign debt distress in Africa.
6. **[Evaluate]** Assess sustainable-finance products and ESG approaches, including greenwashing risk.
7. **[Evaluate]** Assess how technology — electronic and algorithmic trading, AI, tokenisation, digital currencies and faster settlement — is changing market structure.

### Subtopics
- Classifying markets: developed, emerging, frontier; why index providers' classifications matter for capital flows
- Market development: depth, liquidity, investor base, infrastructure, legal certainty; early, middle and maturing stages
- Africa: national exchanges (e.g. Johannesburg, Lagos, Nairobi, Cairo, Casablanca); regional exchanges such as the BRVM serving the eight West African Economic and Monetary Union countries; local-currency bond markets; the role of pension funds
- Capital flows: portfolio flows, "hot money", sudden stops, contagion
- Crises as teachers: 1997 Asia; 2008 global financial crisis; the euro-area debt crisis; the March 2020 dash for cash; recent African sovereign defaults
- Sustainable finance: green, social, sustainability and sustainability-linked bonds; ESG integration, screening and engagement — benefits and criticisms
- The future: electronic trading and AI, tokenisation and digital assets, central bank digital currencies, shorter settlement cycles, data and cyber risk

### Key terms

| Term | Plain-English meaning |
|---|---|
| Developed market | A high-income economy with deep, liquid, open and well-regulated capital markets. |
| Emerging market | A middle-income economy whose capital markets are growing and opening but are less deep or liquid. |
| Frontier market | A smaller, less liquid and less accessible market at an earlier stage of development. |
| Market depth | The ability of a market to absorb large trades without large price moves. |
| Turnover ratio | Value traded in a year ÷ market capitalisation: a simple liquidity measure. |
| Capital flows | Money moving across borders to buy assets or make loans. |
| Sudden stop | An abrupt halt or reversal of foreign capital inflows. |
| Contagion | The spread of financial stress from one market or country to others. |
| Currency mismatch | Borrowing in one currency while earning income in another. |
| Rollover risk | The risk that maturing debt cannot be refinanced. |
| Sovereign default | A government's failure to pay its debt as promised. |
| Debt restructuring | Changing the terms of debt (amount, rate, maturity) after or to avoid default. |
| ESG | Environmental, social and governance factors considered in investing. |
| Greenwashing | Overstating the environmental benefits of a product or company. |
| Sustainability-linked bond | A bond whose coupon changes depending on whether the issuer meets sustainability targets. |

### Worked examples and cases

#### Worked example 19.1 — Measuring liquidity across markets
The JSE masterclass compares liquidity across emerging-market exchanges (its case uses the Philippines, Thailand and Brazil) [S11]. **Task.** Using official exchange or World Federation of Exchanges statistics, compute the turnover ratio (value traded ÷ market capitalisation) and the number of listed companies for three African exchanges and one developed exchange; rank them and explain what limits liquidity in the least liquid market.
**Formula.** Turnover ratio = annual value traded / average market capitalisation. Example: value traded 30 billion on market cap 600 billion → 5% a year.

#### Case 19.1 — The 2008 global financial crisis
Using Yale's treatment of mortgages, securitisation, bubbles and post-crisis regulation [S6], learners build a causal map: easy credit and rising house prices → securitised mortgages (M6) and leverage → falling house prices → losses in mortgage-linked securities → funding runs in money markets (M5) → failures and rescues → regulatory reforms (central clearing of OTC derivatives (M12), higher bank capital and liquidity (M17)).

#### Case 19.2 — Sovereign debt distress in Africa
Zambia missed a Eurobond interest payment in November 2020, becoming the first African sovereign to default during the pandemic era, and Ghana suspended payments on most of its external debt in December 2022. **Task.** For one of the two, gather from public sources (IMF and finance-ministry documents) the share of debt in foreign currency, the currency's depreciation and bond yields before and after; explain the roles of currency mismatch, rollover risk and investor sentiment; and summarise how restructuring talks proceeded.

#### Case 19.3 — Is it really green?
Learners compare the framework documents of two labelled bonds (one green, one sustainability-linked) — use of proceeds, targets, reporting and external review — and rate each for greenwashing risk, drawing on the advantages and disadvantages of ESG approaches taught in CISI [S2] and the sustainability products in the JSE masterclass [S11].

#### Case 19.4 — Futures workshop: markets in 2035
In small groups (or individually, for self-paced learners), learners argue for or against one proposition: "By 2035, most listed securities will be issued and settled as tokens"; "AI-driven trading makes markets more fragile"; or "African exchanges should merge into a single pan-African market". Arguments must cite at least three modules of this course and two external sources.

### Assessment
- [ ] Knowledge check: 15 items
- [ ] Applied task: market profile — a two-page profile of one emerging or African capital market (size, liquidity, main issuers and investors, infrastructure, settlement cycle, regulator, recent reforms)
- [ ] **Checkpoint exam 3** (Parts 5–7): 40 items, 60 minutes, 70% to pass

**Benchmark trace:** T29–T31 and T19: Yale crises, bubbles and the democratisation of finance [S6]; NYIF banking crises and internationalisation of markets [S10]; JSE African and global landscape, market-development stages, liquidity comparisons and sustainability products [S11]; SAIFM [S4] and NISM [S5] as regional exemplars; CISI ESG and fintech [S2]; CFA forces driving the industry and FinTech [S1]; IMF macro-financial lens [S9] → `[D10]`, `[D11]`, `[D12]`.

---

# Part D — Capstone project: capital-raising and valuation brief

**Hours:** 14 core + 2.5 Python (optional) · **Weight:** 25% · **Pass:** 60% on the rubric

**Purpose.** To integrate the whole course in one realistic piece of work, in the spirit of Yale's extended applied assignment [S6], MIT's case [S8] and NYIF's desk-ready skills check [S10] `[D13]`.

### Scenario
You are a junior analyst at an investment firm. The investment committee is considering a position in **one issuer that has both listed shares and traded bonds**. Choose either a developed-market issuer or an emerging-market/African issuer; learners are encouraged to choose the second `[D10]`. Using **only public information**, prepare a brief that a non-specialist committee member can follow.

### Deliverables

| # | Section | Modules drawn on | What to produce |
|---|---|---|---|
| 1 | Market and issuer profile | M1–M3, M11, M19 | Country, exchange, regulator, macro backdrop (policy rate, inflation, currency), issuer's business and capital structure |
| 2 | Instruments | M6, M7 | Features, rights and risks of the chosen bond and share; recent corporate actions |
| 3 | Bond valuation | M13 | Price at the current yield, yield to maturity, modified duration, DV01, spread over the government curve, a ±100 bp scenario |
| 4 | Equity valuation | M14 | Six ratios, CAPM cost of equity, one intrinsic model (DDM or DCF), one relative valuation, a sensitivity table, the growth implied by today's price |
| 5 | Hedging plan | M8, M9, M15 | For a foreign (e.g. US-dollar) investor: price an FX forward and one option-based alternative; compare costs and outcomes |
| 6 | Trade and settlement plan | M12 | Venue, order type, CCP and CSD, settlement cycle and a dated cash/securities timeline including the FX leg |
| 7 | Risk and compliance memo | M16–M18 | Position beta and 95% VaR, one stress scenario, top five risks, and regulatory/ethical points (disclosure, handling of inside information, conflicts) |
| 8 | Recommendation and reflection | All | A clear view (attractive / neutral / unattractive at today's price) with the two assumptions that would change it, and one behavioural bias you guarded against |

**Format.** A written brief (maximum 3,000 words plus tables) and a spreadsheet workbook with every calculation traceable; optional Python notebook reproducing sections 3–5 and 7.

### Milestones (self-paced)
- [ ] **Proposal** (after M12): issuer, instruments, data sources — 1 page
- [ ] **Data pack** (after M13): prices, yields, statements, curve, FX rates, sources listed
- [ ] **Draft valuation** (after M15): sections 3–5
- [ ] **Final submission** (after M19): all sections

### Rubric

| Criterion | Weight | Excellent (85–100%) | Proficient (70–84%) | Developing (50–69%) | Insufficient (<50%) |
|---|:-:|---|---|---|---|
| Accuracy of calculations | 25% | All correct, traceable, cross-checked | Minor slips that do not change conclusions | Several errors; some untraceable | Major errors or missing |
| Use of data and sources | 15% | Current, official sources; all cited | Mostly official; cited | Mixed quality; partly cited | Uncited or unreliable |
| Market and instrument understanding | 15% | Precise, uses terms correctly, links to market structure | Accurate with small gaps | Partly accurate | Misunderstandings |
| Valuation judgement | 15% | Methods triangulated; assumptions tested and defended | Sensible methods and assumptions | Mechanical; weak justification | Unsupported |
| Risk, regulation and ethics | 15% | Material risks quantified; sound compliance reasoning | Main risks identified | Generic | Absent |
| Communication | 10% | Clear for a non-specialist; strong tables | Clear | Hard to follow in places | Unclear |
| Reflection | 5% | Honest limits and bias awareness | Present | Superficial | Missing |

**Integrity.** Use only public information; never use or seek non-public information. The brief is an educational exercise, not investment advice. Peer review uses the rubric; an optional instructor review can be offered as a paid add-on.

---

# Part E — Recommended resources

### E1. Core texts (use the latest edition; one per row is enough)

| Area | Text | Why | Link to benchmarks |
|---|---|---|---|
| Overview (free) | NISM, *Securities Markets Foundation* workbook | Free, clear foundation text with an emerging-market lens | [S5] |
| Investments and valuation | Bodie, Kane & Marcus, *Investments* (McGraw-Hill) | Standard investments text | Assigned in MIT 15.401 [S8] |
| Corporate finance | Brealey, Myers & Allen, *Principles of Corporate Finance* (McGraw-Hill) | Present value, valuation, capital structure | Course text of MIT 15.401 [S8] |
| Behaviour and history | Shiller, *Irrational Exuberance*; Siegel, *Stocks for the Long Run* | Bubbles, long-run returns | Yale reading list [S6] |
| South African markets | *Understanding South African Financial Markets* (Van Schaik) | Local institutions and instruments | Cited by SAIFM [S4] |
| Derivatives (additional) | Hull, *Options, Futures, and Other Derivatives* (Pearson) | Standard derivatives reference | Supports M9, M15 |
| Fixed income (additional) | Fabozzi, *Bond Markets, Analysis, and Strategies* (Pearson) | Standard bond reference | Supports M6, M13 |

### E2. Free courses for enrichment
- Yale, *Financial Markets* (Coursera) [S6]; Open Yale Courses ECON 252 lecture series: <https://oyc.yale.edu/economics/econ-252-08>
- MIT OpenCourseWare, *15.401 Finance Theory I* [S8]
- IMF, *Financial Market Analysis (FMAx)* [S9]
- Khan Academy, *Finance and capital markets*: <https://www.khanacademy.org/economics-finance-domain/core-finance>

### E3. Data sources for tasks and the capstone
- SIFMA Capital Markets Fact Book (global market size) [R1]
- Central-bank websites (policy rates, yield curves, reference rates such as ZARONIA) and the FRED database: <https://fred.stlouisfed.org>
- Exchange websites and statistics (e.g. JSE, NGX, Nairobi Securities Exchange, NSE India, London Stock Exchange, NYSE) and the World Federation of Exchanges
- Issuer annual reports and bond prospectuses; government debt-management office auction results

### E4. Standards and outlines
- IOSCO *Objectives and Principles of Securities Regulation* [R2]
- CPMI-IOSCO *Principles for Financial Market Infrastructures* [R3]
- CISI, FINRA, SAIFM and NISM outlines [S2]–[S5] for learners preparing for a licence

### E5. Tools
- Microsoft Excel or Google Sheets
- Python 3 via Google Colab or Jupyter; packages `numpy`, `pandas`, `scipy`, `matplotlib`

---

# Part F — Credential mapping

GCM-101 is a standalone course. The table shows where its modules overlap with five entry-level credentials. **Overlap is topical only**: completing GCM-101 does not confer eligibility for any exam, and jurisdiction-specific rules (especially FINRA SIE section 4, CISI element 8 and the SAIFM regulation module) require study of the official syllabus.

| Module | CFA Investment Foundations [S1] | CISI Intro to S&I (Intl) [S2] | FINRA SIE [S3] | SAIFM RPE [S4] | NISM XII [S5] |
|---|---|---|---|---|---|
| M0 Numeracy | C3 M1 (statistics) | – | – | Statistical concepts | – |
| M1 Why markets exist | C1 M1 | E1 | 1.2 | The financial system | Unit I |
| M2 Participants | C1 M2–M3 | 1.1 | 1.1.4 | Reg. & Ethics: intermediaries | Unit I |
| M3 Economy & rates | C4 M2–M3 | E2 | 1.3 | The economy | – |
| M4 Time value of money | C3 M1 | 9.2 (EAR) | – | Time value of money | – |
| M5 Money markets | C3 M3 (partial) | 5.1–5.2 | 2.1.2 | Money market | Unit II |
| M6 Bonds | C3 M3 | E4 | 2.1.2 | Bond & long-term debt market | Unit II |
| M7 Equities | C3 M2 | E3 | 2.1.1, 3.1.4 | Equity market | Unit II |
| M8 Foreign exchange | C4 M3 | 5.4 | 1.3.3 | Foreign exchange market | – |
| M9 Derivatives | C3 M4 | E6 | 2.1.3 | Derivatives market | Unit VI |
| M10 Funds & alternatives | C2 M3–M4; C3 M5 | E7; 5.3 | 2.1.4–2.1.9 | Commodities; investment instruments | Unit V |
| M11 Primary markets | C2 M1 | 3.1.9 | 1.4 | – | Unit III |
| M12 Trading & post-trade | C2 M1–M2 | 3.1.12–3.1.15 | 1.2, 3.1 | Reg. & Ethics: SA exchanges | Unit IV |
| M13 Bond valuation | C3 M3 | 4.4.2 | 3.1.2 | Bond market (elective) | Unit II |
| M14 Equity valuation | C3 M2; C4 M4 | 3.1.3, 3.1.7 | 1.3.2 | Equity market (elective) | Unit II |
| M15 Derivative valuation | C3 M4 (concepts) | 5.4.2 | – | Derivatives market (elective) | Unit VI |
| M16 Risk & return | C3 M1; C5 M2, M4 | 7.1 | 2.2 | Portfolio theory & management | Unit II |
| M17 Risk management | C5 M3 | 3.1.4 | 2.2 | – | Units IV, VI |
| M18 Regulation & ethics | C1 M5–M6 | E8 | 3.2–3.3; Section 4 | Regulation & Ethics module | Units III–IV |
| M19 Global context | C1 M5 | 1.1.4–1.1.5 | – | (SA context throughout) | Unit I |

---

# Part G — Self-check: gaps, overlap and claims

### G1. Gap check — every benchmark topic is covered

| Topic group | Matrix rows | Covered in | Status |
|---|---|---|---|
| Common core (≥ 7 ●) | T01, T02, T04, T07, T09, T13, T14, T20, T21, T23, T26 | M1, M2, M4, M6/M13, M7, M9/M15, M11, M12, M16, M18 | ✅ All covered |
| Broad core (●+◐ ≥ 9) | T06, T08, T10, T18, T25 | M5, M13, M14, M10, M17 | ✅ |
| Thin topics strengthened | T05, T11, T12, T16, T19, T22, T24, T28–T31 | M0/M16, M14, M8, M15, M10, M12, M16, M16/M19 | ✅ Strengthened deliberately |
| Deliberately limited | T32 careers; T33 personal finance | M2 (careers brief); investor needs only | ✅ By design `[D14]`, `[D15]` |
| Gaps beyond the matrix | Python; reference-rate reform; Islamic finance (sukuk); market-data literacy | B4 / all valuation modules; M3, M18; M6; data tasks in every module | ✅ |

### G2. Overlap check — repetition is intentional "spiralling", not duplication

| Concept | First meeting | Deepened in | Rule applied |
|---|---|---|---|
| Present value | M4 | M5, M13–M15 | Taught once, then applied |
| Bonds | M6 (features, current yield) | M13 (pricing, duration) | No pricing maths in M6 |
| Equities | M7 (rights, corporate actions) | M14 (valuation) | No intrinsic valuation in M7 |
| FX forward | M8 (interest-rate parity) | M15 (general cost-of-carry) | M15 references M8 instead of re-teaching |
| Margin and leverage | M9 (futures) | M12 (CCP), M17 (liquidity) | Each adds a new layer (instrument → infrastructure → institution) |
| Regulation | M2, M3 (previews) | M18 | Previews limited to naming bodies |
| Crises | Cases in M5, M9, M12, M13, M15, M17 | M19 synthesis | Each case used for one lesson only |

### G3. Claims check — every factual claim has a source and a review date

| Claim | Source | Review |
|---|---|---|
| Global equity cap US$157.8 tn and fixed income US$160.7 tn (2025); US shares 43.7% / 38.1% | [R1] | Each August (new Fact Book) |
| JSE equities settle T+3 through Strate (since 2016; previously T+5) | [R5] | Annually |
| US, Canada, Mexico, Argentina T+1 since May 2024; India T+1; EU, UK, Switzerland T+1 on 11 Oct 2027 | [R6] | After Oct 2027 go-live |
| JIBAR ceases after 31 Dec 2026; ZARONIA successor; "no new JIBAR" from 1 May 2026 | [R4] | January 2027 (update tense) |
| IOSCO: 3 objectives, 38 principles | [R2] | When IOSCO revises |
| CPMI-IOSCO PFMI: 24 principles (2012) | [R3] | When revised |
| Benchmark course facts (hours, exam formats, versions) | [S1]–[S13] | Annually; CISI v19 effective 10 Sep 2026 |
| Historical cases (Reserve Primary Fund 2008, Barings 1995, LTCM 1998, GameStop 2021, SVB 2023, Archegos 2021, UK LDI 2022, FTX 2022, LIBOR from 2012, Steinhoff 2017, Zambia 2020, Ghana 2022, Thai baht 1997, Nigeria 2023) | Widely documented; stated only at a general level | **Before publication**, attach one primary source (regulator, central-bank or court document) to each case page |

**Arithmetic and code.** Every number in every worked example was recomputed by script, and every Python snippet in this document was executed in Python 3 (with `scipy`) on 5 October 2026 and produced the outputs shown in its comments.

**Illustrative data.** Exchange rates, interest rates, prices and company figures in worked examples are illustrative unless a source code is given; they are chosen for clean arithmetic, not as market data.

### G4. Known limitations
1. The matrix reflects **published outlines**, not full course materials; a "–" may mean "not published" rather than "not taught".
2. Study hours are unpublished for several benchmarks (S2, S3, S4, S5, S7); duration comparisons rely on CFA, Yale, NYIF, JSE, CFI and LSE.
3. The benchmark set is weighted towards English-language providers; Francophone, Lusophone and Arabic-language African programmes, and Chinese and Latin American programmes, are candidates for the next review.
4. Hour estimates are design targets; they should be validated with a pilot cohort (time-on-task logging) and adjusted.
5. Nothing in this course is legal, tax or investment advice.

### G5. Maintenance
Review annually each September (after the SIFMA Fact Book and new CISI/CFA syllabus releases), and immediately when a referenced rule, settlement cycle or benchmark rate changes. Keep a change log at the end of this file.

---

# Part H — References

### Benchmark courses
- **[S1]** CFA Institute. *Investment Foundations® Certificate — Curriculum* (2026). <https://www.cfainstitute.org/sites/default/files/docs/programs/investment-foundations-certificate/investment-foundations-certificate-curriculum.pdf>; launch release (2023): <https://www.cfainstitute.org/about/press-room/2023/investment-foundations-certificate-2023>
- **[S2]** Chartered Institute for Securities & Investment. *Introduction to Securities & Investment (International)*, syllabus version 19, effective 10 September 2026. <https://links.cisi.org/cisiweb2/docs/default-source/atp-portal/training-material/international-introduction-to-securities-and-investments/international-introduction-to-securities-and-investment-syllabus.pdf?sfvrsn=80562502_12>
- **[S3]** FINRA. *Securities Industry Essentials (SIE) Examination Content Outline* (2024). <https://www.finra.org/sites/default/files/SIE_Content_Outline.pdf>
- **[S4]** South African Institute of Financial Markets. *Registered Persons Examinations*. <https://saifm.co.za/exams/registered-persons-examinations/>
- **[S5]** National Institute of Securities Markets. *Curriculum — NISM Series XII: Securities Markets Foundation Certification Examination*. <https://www.nism.ac.in/curriculum-securities-markets-foundation>
- **[S6]** Yale University / Coursera. *Financial Markets* (Robert Shiller). <https://www.coursera.org/learn/financial-markets-global>
- **[S7]** Rice University / Coursera. *Global Financial Markets and Instruments*. <https://www.coursera.org/learn/global-financial-markets-instruments>
- **[S8]** MIT OpenCourseWare. *15.401 Finance Theory I*, Fall 2008 (Andrew Lo). <https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/>
- **[S9]** International Monetary Fund, Institute for Capacity Development. *Financial Market Analysis (FMAx)*. <https://www.imf.org/en/capacity-development/training/icdtc/courses/fmax>
- **[S10]** New York Institute of Finance. *Capital Markets Professional Certificate*. <https://www.nyif.com/capital-markets-professional-certificate.html>
- **[S11]** JSE. *Capital Markets Masterclass*. <https://www.jse.co.za/events/capital-markets-masterclass>
- **[S12]** Corporate Finance Institute / Coursera. *Introduction to Capital Markets*. <https://www.coursera.org/learn/introduction-to-capital-markets>
- **[S13]** London School of Economics Summer School. *FM250: Finance*. <https://www.lse.ac.uk/study-at-lse/summer-schools/summer-school/courses/finance/fm250>

### Other references
- **[R1]** SIFMA. *2026 Capital Markets Fact Book* (13 August 2026). <https://www.sifma.org/research/statistics/fact-book>; key findings: <https://www.sifma.org/news/blog/2026-capital-markets-fact-book-key-findings>
- **[R2]** IOSCO. *Objectives and Principles of Securities Regulation*. <https://www.iosco.org/library/resolutions/pdf/IOSCORES63.pdf>
- **[R3]** CPSS (now CPMI) and IOSCO. *Principles for Financial Market Infrastructures* (April 2012). <https://www.bis.org/cpmi/publ/d101a.pdf>
- **[R4]** South African Reserve Bank. Media release on Jibar transition (2026). <https://www.resbank.co.za/en/home/publications/publication-detail-pages/media-releases/2026/jibar-tax>; Market Practitioners Group, *"No new Jibar" recommendations* (2026). <https://www.resbank.co.za/content/dam/sarb/publications/financial-markets/committees/mpg/mpg-publications/2026/'No%20new%20Jibar'%20Recommendations.pdf>
- **[R5]** JSE Magazine. "Full speed ahead" (2026) — JSE T+3 settlement through Strate. <https://www.jsemagazine.co.za/market-place/full-speed-ahead/>
- **[R6]** SIX Group. *T+1 settlement* (2026). <https://www.six-group.com/en/products-services/securities-services/site/lp/tplusone.html>; BNP Paribas. *Navigating the transition to T+1 in Europe* (2026). <https://globalmarkets.cib.bnpparibas/the-transition-to-t1-in-europe/>
- **[R7]** *JSE Limited* — largest exchange in Africa by market capitalisation. Wikipedia, accessed October 2026. <https://en.wikipedia.org/wiki/JSE_Limited>

---

## Change log
| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-05 | First publication-ready draft: benchmarking of 13 programmes; 20 modules; capstone; credential mapping; self-check |
