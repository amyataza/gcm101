# Test and audit reports

Latest full run: 2026-10-06, on macOS with Node 20, Chromium (Playwright) and Python 3.13 + scipy 1.18.
Re-run everything with the commands below; each report is regenerated.

## Summary

| Area | Result | Report | Command |
|---|---|---|---|
| Every syllabus calculation recomputed | **244 of 244 values match** after syllabus v1.0.1 corrected the one rounding erratum found (WE 13.3: 96.54 → 96.53) | [calc-verification.md](calc-verification.md) | `node tools/report-calcs.mjs` |
| Unit tests (maths, quiz generators, overlays) | **774 / 774 pass** — includes each displayed answer appearing verbatim in the content, 91 quiz templates reproducing their syllabus answers, 300 random draws per template, exam sizes, explorer defaults | `tests/unit/` | `npm test` |
| Python Track C snippets | **13 / 13 pass** (executed with real Python + scipy; printed numbers match the syllabus) | [python-verification.md](python-verification.md) | `npm run test:python` |
| In-browser Python (Pyodide 0.29.3) | M15 snippet run in Chromium under the app's CSP: output `10.45 5.57` etc. matched the syllabus | manual check, 2026-10-06 | — |
| End-to-end on an emulated budget Android phone | **14 / 14 pass** — 150 routes at 360 px with no errors or sideways scroll; onboarding; additive modes; mastery gate fail→pass; ±0.5% tolerance with "14 693,28"; resume; exam timer warning + extension; untimed exams; installability (no Chrome installability errors); offline (visited/downloaded modules, glossary, tools); backup/erase/restore; themes and 160% text; keyboard | [e2e-report.md](e2e-report.md), [screenshots](../screenshots) | `npm run test:e2e` |
| Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA) | **0 violations in 80 scans** (20 screens × light/dark/high-contrast on phone + desktop) | [accessibility-report.md](accessibility-report.md) | `npm run audit:a11y` |
| Lighthouse — mobile (slow 4G, 4× CPU) | Performance **94–100**, Accessibility **100**, Best practices **100**, SEO **100**; LCP 1.4–2.0 s | [performance-report.md](performance-report.md) | `npm run audit:lighthouse` |
| Lighthouse — budget phone on 3G (300 ms, 400 kbps, 6× CPU) | Performance **67–85**; LCP 3.9 s (first visit), 6.3 s (lesson), 4.8 s (glossary); all other categories 100 | [performance-report.md](performance-report.md) | `npm run audit:lighthouse` |
| Dead-end crawl | **0 problems** — every in-app link followed from the course map as a new and a finished learner (206 routes) | [dead-end-report.md](dead-end-report.md) | `node tests/e2e/crawl.mjs` |
| External links | All resolve; JSE and BNP Paribas block automated checks but open in a browser | [link-report.md](link-report.md) | `npm run linkcheck` |
| Payload | First visit **35 KB gzipped**; all app JavaScript 90 KB gzipped, loaded per screen | [performance-report.md](performance-report.md) | — |
| Content audit | 0 errors, 0 warnings (all 14 historical cases now cite a primary source; R7 replaced; erratum fixed in v1.0.1), 35 info notes | [../content-audit.md](../content-audit.md) | `npm run content` |

## What automated testing cannot cover — still to do with people

| Required by the brief | Status | Plan |
|---|---|---|
| Usability test with ≥ 5 novice learners | **Not run** (needs participants) | Protocol, tasks, thresholds and report template in [../pilot-plan.md](../pilot-plan.md), Part 1 |
| Test on a real low-end device | **Emulated only** (360×640, 6× CPU slowdown, 400 kbps) | Pilot plan Part 3: budget Android + TalkBack, iPhone + VoiceOver |
| Full WCAG 2.2 AA conformance | Automated rules pass; manual checklist met by design (see the accessibility report) | Confirm with screen-reader users in the usability test |
| Validate study-hour estimates | Tooling ready (on-device active-time log + CSV export) | Pilot plan Part 2 (30–50 learners, 12–18 weeks) |
| Subject-matter review of authored quiz items and diagrams | Each item records its syllabus basis; marked "draft for SME review" | Review `web/content/overlays/quiz-items.json`, `visuals.json`, `interactives.json` |

## Notes on method

- Lighthouse 12 removed the PWA category; installability is checked with Chrome's own `Page.getInstallabilityErrors` in the end-to-end suite, and offline start is tested with the network switched off.
- The local test server compresses text responses with gzip, as production static hosts do; uncompressed hosting would be slower on 3G (see docs/deployment.md).
- Simulated 3G numbers are pessimistic by design (6× CPU slowdown on top of a congested link). The main cost on a cold lesson load is network round trips for the course index and module file; after the first visit the service worker serves the shell and content from the device.
