# Performance and Lighthouse report

Run 2026-10-06 10:58 UTC with `npm run audit:lighthouse` (Lighthouse 12, headless Chromium, 360×640 phone). HTML reports are in `docs/testing/lighthouse/`.

| Profile | Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| mobile | [First visit (welcome)](lighthouse/mobile-first-visit-welcome-.html) | 100 | 100 | 100 | 100 | 1.1 s | 1.4 s | 0 ms | 0.002 | Total size was 48 KiB |
| mobile | [Lesson: M4 Learn](lighthouse/mobile-lesson-m4-learn.html) | 99 | 100 | 100 | 100 | 1.2 s | 2.0 s | 0 ms | 0 | Total size was 123 KiB |
| mobile | [Glossary](lighthouse/mobile-glossary.html) | 94 | 100 | 100 | 100 | 1.1 s | 1.7 s | 0 ms | 0.152 | Total size was 68 KiB |
| 3g-budget | [First visit (welcome)](lighthouse/3g-budget-first-visit-welcome-.html) | 85 | 100 | 100 | 100 | 2.4 s | 3.9 s | 0 ms | 0 | Total size was 48 KiB |
| 3g-budget | [Lesson: M4 Learn](lighthouse/3g-budget-lesson-m4-learn.html) | 67 | 100 | 100 | 100 | 2.7 s | 6.3 s | 0 ms | 0.152 | Total size was 123 KiB |
| 3g-budget | [Glossary](lighthouse/3g-budget-glossary.html) | 72 | 100 | 100 | 100 | 2.6 s | 4.8 s | 20 ms | 0.152 | Total size was 68 KiB |

**Profiles.** *mobile* = Lighthouse default (simulated slow 4G: 150 ms RTT, 1.6 Mbps, 4× CPU slowdown). *3g-budget* = 300 ms RTT, 400 kbps, 6× CPU slowdown — a budget Android phone on a congested 3G connection.

## Payload budget

| Item | Size (gzip) |
|---|--:|
| First visit (HTML, CSS, core JS, onboarding view, course index, manifest, icon) | 35.1 KB |
| All app JavaScript (loaded on demand per screen) | 90.0 KB |
| One module's content (largest, M12) | 7.6 KB |
| Glossary (loaded with the first lesson) | 16.7 KB |
| Audio summary per module (optional) | 0.6–1.0 MB |
| Python runtime (optional, on first use) | ≈ 12 MB (+ ≈ 10 MB scipy) |

No web fonts, frameworks, images or third-party scripts load at start-up. Views, widgets, the calculator, simulations and Python load only when opened.
