# Changelog

All notable changes to the GCM-101 app. Content changes follow the syllabus version
(`Intro-Global-Capital-Markets-Syllabus.md`); app changes follow semantic versioning.

## [1.0.1] — 2026-10-06 (public beta)

Syllabus **v1.0.1**.

### Changed
- Syllabus: WE 13.3 price at 6% corrected to 96.53; R7 now cites the JSE Group's own statement instead of Wikipedia; G3 updated; status "public beta".
- Every one of the 14 historical cases now cites a verified primary source (SEC, Federal Reserve, Bank of England, FSA, FSCA, IMF, Central Bank of Nigeria, Board of Banking Supervision, National Assembly of Zambia, Ghana Ministry of Finance), shown on the case page.
- Licences: app code MIT; course content CC BY 4.0 (`LICENSE-CONTENT.md`).
- Privacy page now discloses what the website host (GitHub Pages) and jsDelivr can see, and that problem reports on GitHub are public.
- "Report a problem" opens a GitHub issue pre-filled with the page and content version only.
- Public-beta notice on the welcome screen, course map, About page and top bar, with a page explaining what has and has not been checked.
- `npm test` runs on Node 20 and Node 24.

### Added
- Dead-end crawler (`tests/e2e/crawl.mjs`) and external link checker (`tools/linkcheck.mjs`).

## [1.0.0] — 2026-10-06

First release, built from syllabus **GCM-101 v1.0 (2026-10-05)**.

### Added
- Content pipeline (`tools/extract.mjs`): 20 modules, 7 parts, 143 objectives, 359 key terms (356 glossary entries), 69 worked examples, 32 cases, 4 exercises, 13 Python snippets, 34 spreadsheet formulas, 20 references and 16 design decisions extracted to JSON; automatic content audit with consistency checks (146 core + 15 Python hours reconcile; assessment weights sum to 100%; all reference codes defined).
- PWA: installable manifest, service worker with versioned app-shell precache, stale-while-revalidate content, per-module and whole-course offline download, Range-capable audio caching, update prompt.
- Learning modes: Read (always on), See (43 original diagrams and charts with text descriptions and data tables, captioned step-through walkthroughs), Hear (on-device read-aloud with speed control; 20 downloadable AI-voice audio summaries with transcripts), Do (66 activities: slider explorers, simulations, matching, sequencing and sorting games; spreadsheet packs; in-browser Python via Pyodide 0.29.3).
- Assessment: knowledge checks at the syllabus item counts and numeric minimums, 91 numeric templates with randomised inputs and ±0.5% tolerance, 77 authored conceptual items with syllabus basis, term items; mastery gate at 70%; three checkpoint exams (40 items, 60 min) and a final exam (80 items, 120 min, ≈40% calculation) with formula sheet, calculator and adjustable/extendable timing; applied-task and capstone self/peer rubrics; B5-weighted course score and completion rule.
- Trust: sources and review panel on every lesson (syllabus line numbers, review date, references, review schedule); "Primary source pending" badges on the 14 historical cases listed in syllabus G3; verification notes for errata; transparency report; privacy, methodology, AI-use, accessibility and credential-mapping pages; persistent "not investment advice" notice.
- Accessibility: WCAG 2.2 AA target; light, dark and high-contrast themes; text size 85–160%; reading font and spacing options; reduced motion; keyboard and screen-reader support throughout.
- Tests and audits: 774 unit checks (every syllabus answer recomputed), Python snippet verification (13/13), 14 end-to-end browser tests on an emulated budget Android phone, axe-core scans (80 scans, 0 violations), Lighthouse on mobile and budget-3G profiles.
- Documentation: README, architecture, design system, personas and journey, wireframes, multimodal specification, deployment guide, content-update guide, pilot plan.

### Found while verifying the syllabus
- Erratum: Worked example 13.3 shows the 6% price as 96.54; it rounds to **96.53** (96.5349). The interpolated (≈ 6.46%) and exact (6.458%) yields are unaffected. Shown in the app beside the example; recorded in `web/content/overlays/errata.json` for correction in syllabus v1.1.

### Known gaps (see docs/content-audit.md)
- ~~14 historical cases still need a primary source~~ — resolved in 1.0.1.
- Quiz items and diagrams await subject-matter-expert review; usability test and hours pilot not yet run (docs/pilot-plan.md).
- ~~Reference R7 is Wikipedia~~ — resolved in 1.0.1.
