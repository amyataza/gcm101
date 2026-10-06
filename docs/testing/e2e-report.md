# End-to-end test report

Run 2026-10-06 13:50 UTC with `npm run test:e2e` (Chromium, emulating a 360×640 Android phone unless noted).

**14 of 14 passed.**

| Result | Test | Time | Notes |
|:-:|---|--:|---|
| ✅ | First visit redirects to onboarding; 3 steps end in Module 0 | 1.2 s |  |
| ✅ | All routes render at 360 px with no JavaScript errors and no horizontal scrolling | 35.5 s | 150 routes |
| ✅ | Learning modes are additive and text stays when every mode is off | 0.6 s |  |
| ✅ | Mastery gate: a failed check keeps the next module locked; a pass (≥70%) unlocks it | 3.9 s |  |
| ✅ | Numeric answers within ±0.5% are accepted; formats like "14 693,28" work | 0.7 s | answer 7,165.92, typed "7 194,58" |
| ✅ | A knowledge check in progress survives a reload (same question, same answer) | 0.5 s |  |
| ✅ | Home shows one clear next action and resumes where the learner left off | 0.5 s |  |
| ✅ | Checkpoint exam: 40 items, time warning with "Add 15 minutes", submit and score | 4.8 s |  |
| ✅ | Untimed exams: with the time limit off there is no countdown | 0.7 s |  |
| ✅ | Offline: installable PWA; visited and downloaded modules work offline; others explain why not | 2.8 s |  |
| ✅ | Back up, erase and restore progress (no server involved) | 0.8 s |  |
| ✅ | Themes (light, dark, high contrast) and 160% text size keep the layout intact | 2.1 s |  |
| ✅ | Keyboard only: skip link, focus moves to the page heading, sequencer reorders with buttons | 0.6 s |  |
| ✅ | Desktop layout screenshots | 3.5 s |  |

Screenshots are in `docs/screenshots/`.
