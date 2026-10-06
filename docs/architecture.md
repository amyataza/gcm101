# Architecture

## Goals that shaped the design

| Goal | Consequence |
|---|---|
| Budget phones, slow or intermittent data | No framework, no build step, no web fonts, no images at start-up; ES modules loaded per screen; ~35 KB gzipped first visit; service worker; per-module offline download |
| Content and code separate | Syllabus → JSON at build time; app fetches JSON at runtime; authored additions in overlay files with a syllabus `basis` |
| Every calculation correct | One maths library (`web/js/calc.js`) used by calculators, quiz generators, diagrams **and** tests |
| Trust and privacy | References and review dates on every page; on-device storage only; strict Content-Security-Policy; no third-party code at start-up |
| Accessibility | Semantic HTML first; every widget has a keyboard/touch/screen-reader path; text alternative for every visual |

## Data flow

```
Intro-Global-Capital-Markets-Syllabus.md
        │  tools/extract.mjs  (parses headings, tables, lists; md → safe HTML; validates overlays)
        ▼
web/content/course.json    index: parts, modules (+hash), checkpoints, assessment rules, capstone, references, claims
web/content/modules/mN.json  objectives, subtopics, terms, formulas, examples (segmented into problem / Track A/B/C / notes), tasks, trace, refs, narration text
web/content/glossary.json  every key term with module-specific meanings and safe aliases
web/content/about.json     methodology (benchmark tables), credential map, self-check, resources, change log
web/content/audit.json     consistency checks and gap flags (also docs/content-audit.md)
web/content/overlays/*.json   authored: quiz-numeric, quiz-items, interactives, visuals, formula-sheet, errata, sources, audio, site
        │  fetched at runtime by web/js/content.js
        ▼
views (web/js/views/*)  →  widgets (web/js/widgets/*)  →  calc.js
```

## Modules

| File | Role |
|---|---|
| `js/app.js` | Hash router (`#/m/m4/learn`), lazy view loading, focus management, appearance, time-on-task, offline indicator, service-worker registration and update prompt |
| `js/store.js` | IndexedDB key–value store (localStorage, then memory, as fallbacks); settings and progress with defaults; export/import/erase |
| `js/content.js` | Fetches content; module URLs carry the content hash (`?v=`) |
| `js/course.js` | Rules from the syllabus: gating (70% to unlock), exam unlocks, hours left, weighted score (B5 weights), completion |
| `js/calc.js` | All finance maths (TVM, bonds, FX, derivatives, BSM, portfolios, VaR…) |
| `js/quiz/engine.js` | Seeded randomness, numeric item generation from templates, term items, matching, exam assembly, grading (±0.5%), number parsing |
| `js/md.js` | Escape-first Markdown renderer (shared with the pipeline); turns `[S1]` codes into links |
| `js/tts.js` | Web Speech read-aloud with on-device voices by default, paragraph highlighting, speed |
| `js/views/*` | Screens: onboarding, home, module/check, learn, practise, quiz/exam, exams, capstone, glossary, tools, progress, settings, about |
| `js/widgets/index.js` | Visuals (flow, tree, curve, bars), explorers (sliders + chart), matching, sequencer, classifier, walkthrough, spreadsheet pack, Python runner |
| `js/widgets/sims.js` | Simulations: option payoff, futures margin, order book, T-bill auction, CCP netting, settlement dates |
| `js/widgets/charts.js` | Dependency-free SVG line and bar charts sized to the screen |
| `js/widgets/python.js` | Lazy Pyodide 0.29.3 loader with consent, scipy fallback shim, output check |
| `js/widgets/calculator.js` | Exam calculator (safe parser, no `eval`) and formula sheet |

## Offline strategy (`web/sw.js`)

| Request | Strategy | Cache |
|---|---|---|
| App shell: HTML, CSS, JS, icons, `course.json`, `glossary.json`, `about.json`, `audit.json`, overlays | Precached at install, versioned by a hash of their contents (`tools/build-sw.mjs`) | `gcm101-shell-<version>` |
| Course content (`/content/…`) | Stale-while-revalidate: instant from cache, refreshed in the background — so syllabus updates arrive without an app release | `gcm101-content` |
| Modules | Cached when opened; "Download for offline" (per module) or "Download the whole course" (Settings) | `gcm101-content` |
| Audio | Cache-first with HTTP Range support for iOS | `gcm101-content` |
| Pyodide (jsDelivr) | Cache-first after the learner opts in | `gcm101-pyodide` |
| Navigation | Network-first with 4-second timeout, falling back to the cached shell | — |

A new app version shows "A new version of the course is ready — Update"; the page reloads only when the
learner accepts (never on first install).

## Quiz engine

- **Knowledge checks** use the syllabus item count and numeric minimum per module (e.g. M4: 15 items, ≥ 8 numeric). Items come from three banks: numeric templates (randomised inputs, answers computed by `calc.js`), term items generated from the module's key-term table, and authored conceptual items (each with a `basis`). Seeded per attempt; sessions persist, so a reload resumes the same attempt.
- **Exams** draw items in proportion to module hours, targeting the final exam's 40% calculation share (B5 gives no split for checkpoints, so the final's is reused — documented in the audit). Timer: standard, +25%, +50%, double or untimed; warnings at 5 and 1 minutes with unlimited "Add 15 minutes"; 20-second grace before auto-submit.
- **Grading**: numeric answers within ±0.5% (relative) or within rounding of the shown decimals; accepts `14,693.28`, `14 693,28`, `−5`, `8.9%`.

## Security and privacy

- Content-Security-Policy: `default-src 'self'`; scripts only from self and jsDelivr (Pyodide); `wasm-unsafe-eval` for Pyodide; no `eval`; `object-src 'none'`; `form-action 'none'`.
- All content HTML is generated by the escape-first renderer from the syllabus; overlays never inject HTML except via the same renderer. Text from learners is only ever set with `textContent`.
- No cookies, analytics, accounts or remote logging. `navigator.storage.persist()` is requested so the browser does not evict progress.

## Browser support

Evergreen Chrome/Edge/Firefox/Safari and Android WebView with ES modules (Chrome 80+, Safari 14+). No regular-expression lookbehind (older Safari), fallbacks for `color-mix()`, and `structuredClone` only in the memory fallback path.
