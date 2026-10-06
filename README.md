# GCM-101 · Introduction to Global Capital Markets — PWA

A free, installable, offline-first course app that takes a complete beginner from zero to valuation,
built from the **GCM-101 v1.0 syllabus** (`Intro-Global-Capital-Markets-Syllabus.md`), which stays the
single source of truth.

- **20 modules (M0–M19) in 7 parts**, 3 checkpoint exams, a final exam and a capstone, about 146 hours (+15 h optional Python).
- **Four ways to learn, all optional except text:** Read · See · Hear · Do — combine or switch any time.
- **Trust built in:** every lesson shows its references (`[S#]`, `[R#]`, `[D#]`), syllabus line numbers and review date; every worked-example answer is recomputed by tests; open issues (e.g. historical cases awaiting a primary source) are published in the app.
- **Private by design:** no accounts, ads, analytics or tracking. Progress lives on the device (IndexedDB) and can be backed up to a file.
- **Built for budget phones and patchy data:** no framework, no build step, no web fonts; ~25 KB gzipped first visit; modules download for offline use; audio and Python load only on request.

> Educational only — not investment advice. GCM-101 is not accredited and confers no credential (see the in-app *Credential mapping*).

## Quick start

```bash
npm install          # dev tools only (Playwright, axe-core, Lighthouse); the app has no runtime dependencies
npm run build        # syllabus → web/content/*.json, then the service-worker manifest
npm run serve        # http://localhost:8080
```

Open <http://localhost:8080> on a phone or in a mobile-sized browser window.

## Repository layout

```
Intro-Global-Capital-Markets-Syllabus.md   the source of truth (never edited by tools)
web/                                       deploy this folder to any static host
  index.html, manifest.webmanifest, sw.js  app shell, PWA manifest, service worker
  css/app.css                              design system (tokens, themes, components)
  js/                                      app code (ES modules, no build)
    app.js router · store.js on-device storage · content.js loader · course.js rules
    calc.js all finance maths (shared with tests) · md.js safe Markdown renderer
    quiz/engine.js item generation, grading, exams · tts.js read-aloud
    views/*.js screens · widgets/*.js diagrams, charts, explorers, simulations, Python, calculator
  content/                                 course content, loaded at runtime (separate from code)
    course.json, about.json, glossary.json, audit.json, modules/m*.json   ← generated from the syllabus
    overlays/*.json                        ← authored additions, each tied to a syllabus location
    audio/*.m4a                            ← generated audio summaries
tools/                                     content pipeline and build scripts
tests/unit/                                calculation, quiz and overlay tests (node:test)
tests/e2e/                                 browser tests, accessibility and Lighthouse audits
docs/                                      design, UX, specs, audit and test reports
```

## How content and code stay separate

The app never contains course text. `tools/extract.mjs` turns the syllabus into JSON in
`web/content/`, and the app fetches it at runtime. Updating the syllabus means re-running
`npm run content` and redeploying `web/content/` — no JavaScript changes. The service worker revalidates
content in the background, so learners get the update on their next visit, and module files carry a
content hash so caches refresh. Authored additions (quiz wording, diagrams, activity settings) live in
`web/content/overlays/`; the pipeline validates them against the syllabus and flags anything that no
longer matches. See **[docs/content-update-guide.md](docs/content-update-guide.md)**.

## Scripts

| Command | What it does |
|---|---|
| `npm run content` | Extract the syllabus into `web/content/`, write `docs/content-audit.md`; fails on structural errors |
| `npm run sw` | Rebuild `web/sw-manifest.js` (app-shell precache list + version) after code changes |
| `npm run build` | `content` + `sw` |
| `npm run serve` | Local static server on port 8080 |
| `npm test` | Unit tests: every syllabus answer recomputed, quiz generators, overlays (≈ 770 checks) |
| `npm run test:python` | Run all 13 Track C snippets with Python 3 + scipy and check their printed numbers |
| `npm run test:e2e` | Browser tests on an emulated budget Android phone (routes, gating, exams, offline, data) |
| `npm run audit:a11y` | axe-core WCAG 2.2 A/AA scans in light, dark and high-contrast themes |
| `npm run audit:lighthouse` | Lighthouse on mobile and on a "budget phone on 3G" profile |
| `npm run audio` | Regenerate audio summaries with Piper TTS (see `tools/build_audio.py`) |
| `npm run icons` | Rasterise `web/icons/icon.svg` into the manifest PNGs |

Playwright uses its bundled Chromium (`npx playwright install chromium`) or, if absent, `CHROME_PATH`
or any cached Playwright Chromium (`tools/browser.mjs`).

## Documentation

| Document | Contents |
|---|---|
| [docs/content-audit.md](docs/content-audit.md) | Step 1 audit: what was extracted, consistency checks, gaps and flags (generated) |
| [docs/ux/personas-and-journey.md](docs/ux/personas-and-journey.md) | Personas, journey map, usability principles |
| [docs/ux/wireframes.md](docs/ux/wireframes.md) | Wireframes of the core screens, with screenshots of the build |
| [docs/design-system.md](docs/design-system.md) | Tokens, themes, type, components, accessibility rules |
| [docs/multimodal-spec.md](docs/multimodal-spec.md) | Content set per mode for every module (generated) |
| [docs/architecture.md](docs/architecture.md) | Technical design: data flow, offline strategy, quiz engine, security |
| [docs/testing/README.md](docs/testing/README.md) | Test and audit reports index, including what still needs people |
| [docs/deployment.md](docs/deployment.md) | Static hosting on GitHub Pages, Netlify, Cloudflare Pages or any web server |
| [docs/content-update-guide.md](docs/content-update-guide.md) | How to update the syllabus, overlays, audio and reviews |
| [docs/pilot-plan.md](docs/pilot-plan.md) | Pilot to validate study hours, plus the 5-learner usability test protocol |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

## Licence

App code: MIT (`LICENSE`). Course content — syllabus, generated content, diagrams, activities and audio: CC BY 4.0 (`LICENSE-CONTENT.md`). Pyodide (MPL-2.0) loads from jsDelivr only when a learner chooses to run Python.
