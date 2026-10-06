# Pilot plan: validating study hours and usability

The syllabus says its hour estimates "are design targets; they should be validated with a pilot cohort
(time-on-task logging) and adjusted" (G4). The brief also requires a usability test with at least five
novice learners. Neither can be done by software alone; this plan describes how to run both. **Status:
not yet run** — the tooling (time logging, export, test scripts) is built and ready.

## Part 1 — Usability test (formative, 5–8 novices)

### Goal
Find the problems that stop a first-time learner from starting, resuming and finishing a module without
instructions, on the kind of phone they actually use.

### Participants
- 5 minimum, 8 preferred: adults with no finance background (screened: never studied finance, cannot define "bond yield").
- At least 3 on budget Android phones (≤ 3 GB RAM), at least 1 screen-reader or large-text user, at least 2 outside South Africa (e.g. Nigeria, Kenya, Ghana, India), mixed gender and age (18–60).
- Incentive: data bundle or voucher equivalent to 1 hour of local wages.

### Set-up
- Their own phone where possible; app opened from a link (not pre-installed). Throttled hotspot (≈ 3G) for at least two sessions.
- Moderator + note-taker; think-aloud; screen recording **only with written consent**; 45–60 minutes.

### Tasks (read aloud; do not show the screen first)

| # | Task | Success criterion | Measures |
|---|---|---|---|
| 1 | "You've been sent this link. Start the course." | Reaches Module 0 overview without help | time, errors, hesitations |
| 2 | "Make the text bigger and switch to a darker screen." | Changes both | success, path |
| 3 | "Find out what 'basis point' means without leaving the lesson." | Opens the term tooltip or glossary | success |
| 4 | "Listen to part of this lesson, a bit faster." | Starts read-aloud and changes speed | success |
| 5 | "Use a tool to see what happens to R10,000 at 8% over 20 years." | Uses the M4 slider explorer | success, time |
| 6 | "Do the knowledge check. Get one question wrong on purpose and tell me what the app says." | Finds and explains the feedback | success, comprehension |
| 7 | "Close the app. Open it again and carry on where you were." | Uses "Continue where you left off" | success |
| 8 | "Make Module 4 available without internet, then check it works in aeroplane mode." | Downloads and opens offline | success |
| 9 | "Where does this lesson's information come from? When was it checked?" | Finds the sources panel | success, trust rating |
| 10 | "Is this app telling you what to invest in?" | Says no / finds the disclaimer | comprehension |

### After the tasks
- System Usability Scale (10 items, translated where needed).
- Trust (1–5): "I trust the information in this app"; "I understand what happens to my data".
- Modes: "Which ways of learning did you use? Did you know you could switch?"

### Success thresholds (v1 release gate)
- ≥ 80% task success on tasks 1, 3, 6, 7 and 10 without help; SUS ≥ 68 (above average); no critical issue (blocks progress or data loss) open.
- Every issue logged with severity (critical / major / minor / cosmetic), the screen and a proposed fix; fix critical and major issues, then re-test with 2–3 new participants.

### Report template
`docs/testing/usability-YYYY-MM.md`: participants (no names), devices, task matrix (✓ / assisted / ✗), SUS per participant, issues ranked by severity, quotes, changes made.

## Part 2 — Study-hour validation (summative pilot)

### Questions
1. How long do novices actually spend on each module (active time) compared with the syllabus estimate (B3)?
2. Does time differ by device, connection, mode use or prior numeracy?
3. Where do learners drop out, and do knowledge-check attempts predict it?

### Cohort
30–50 adult novices across at least 3 countries, recruited through partner organisations (adult education centres, university outreach, employers). Self-paced over 12–18 weeks, as the syllabus intends; a light weekly check-in.

### Data (privacy-preserving by design)
- The app records **active minutes per module on the device only** (counted while a module page is open and the learner interacted in the last 2 minutes).
- Participants export *Progress → Export my study-time log (CSV)* at weeks 4, 8, 12 and at the end, and send it voluntarily. The file contains module code, syllabus hours, active minutes, attempts, best score, passed — **no names or identifiers**; the researcher assigns a participant number on receipt.
- Weekly 3-question diary: hours studied off-app (reading, spreadsheet, notebook work), what was hard, what mode helped.
- Informed consent; right to withdraw and delete; ethics approval where the partner institution requires it.

### Analysis
- Per module: median and inter-quartile range of (in-app active time + diary off-app time) vs syllabus hours.
- Flag a module if the median differs from the estimate by more than ±25%, or if completion falls by > 15 percentage points from the previous module.
- Correlate knowledge-check attempts with time; compare budget-phone/3G participants with others.

### Acting on results
- Adjust the B3/B module hours in the next syllabus version (the app shows the new estimates automatically after `npm run content`).
- Modules that run long: split Practise, add worked-example walkthroughs, or move material to optional.
- Record changes and evidence in the syllabus change log and `CHANGELOG.md`.

### Timeline (indicative)

| Week | Activity |
|---|---|
| 0–2 | Recruit usability participants; run Part 1; fix critical/major issues |
| 3 | Re-test fixes with 2–3 participants; recruit pilot cohort |
| 4–20 | Pilot cohort studies; exports at weeks 8, 12, 16, 20 |
| 21–22 | Analysis; adjust hours; publish a pilot report |

## Part 3 — Assistive-technology and device checks (alongside Part 1)

| Check | Devices | Pass criterion |
|---|---|---|
| TalkBack (Android) full module | Budget Android + Chrome | All tasks possible; headings, buttons and results announced |
| VoiceOver (iOS) | iPhone + Safari | Same; audio summary plays from cache offline |
| Keyboard only | Laptop + Chrome/Firefox | Every widget operable; focus always visible |
| 200% browser zoom and 160% in-app text | Laptop and phone | No horizontal scrolling; nothing cut off |
| Throttled 3G cold start | Budget Android | Welcome screen readable within 5 s; lesson text within 8 s |
| Offline after "Download the whole course" | Any | All modules, glossary and tools open in aeroplane mode |
