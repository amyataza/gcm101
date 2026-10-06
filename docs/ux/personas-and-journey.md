# Personas, journey and usability principles

Personas are design tools built from the syllabus audience ("adults with no financial background",
self-paced, global with emerging and African markets) and common constraints in those markets. They are
assumptions to test in the pilot (docs/pilot-plan.md), not research findings.

## Personas

### 1. Amina — first-time learner on a budget Android phone (primary)
- 24, Kano, Nigeria. Customer-service job; wants to understand the shares and treasury bills she hears about. No finance background; comfortable with WhatsApp, less with spreadsheets.
- **Device and data:** 2 GB RAM Android Go phone, Chrome, 5.5" screen; prepaid data bought in small bundles; power cuts.
- **Needs:** small downloads; works offline after one download; big readable text; no sign-up; plain words; progress that survives a dead battery.
- **Risks:** abandons if the first screen is heavy or asks for an account; confused by jargon; afraid of "being sold something".
- **Design answers:** ~35 KB first visit; "Download the whole course" on Wi-Fi; on-device progress saved after every answer; glossary tooltips at first use; explicit "not investment advice" on the first screen; no ads or upsell.

### 2. Thabo — commuting listener (Hear + Read)
- 31, Soweto, South Africa. Junior bank operations clerk preparing for an internal move to the markets desk. Two hours a day on minibus taxis.
- **Needs:** listen while commuting; pick up where he stopped; short sessions; exam practice on the phone.
- **Design answers:** read-aloud with speed control and paragraph skip; downloadable 3-minute audio summaries; "Continue where you left off" card; knowledge checks with no time limit; resumable exams.

### 3. Grace — hands-on learner who wants to "see the numbers move" (Do + See)
- 19, Nairobi, Kenya. University first-year (economics), learns best by trying things. Has a laptop on campus Wi-Fi, phone elsewhere.
- **Needs:** calculators and simulations; spreadsheet and Python practice; visual explanations; checking her own working.
- **Design answers:** 66 activities (sliders that start at the syllabus example, simulations, games); spreadsheet packs; in-browser Python with "output matches the syllabus" check; step-through walkthroughs.

### 4. Ravi — career-changer who must trust the content (Read + verification)
- 42, Pune, India. Software engineer moving into fintech; sceptical of unsourced online courses.
- **Needs:** sources, dates, verifiable maths; wants the full depth (valuation, risk).
- **Design answers:** sources panel on every page with syllabus line numbers and review dates; transparency report of open issues; tests that recompute every answer; Track C code visible.

### 5. Lindiwe — learner with low vision using a screen reader (Accessibility)
- 37, Durban, South Africa. Uses TalkBack on Android and a large-text setting.
- **Needs:** works with screen reader and large text; no timed pressure without control; every chart explained in words.
- **Design answers:** semantic headings and landmarks; focus moves to the new heading; text alternatives and data tables; text size to 160% without sideways scrolling; exam time limits adjustable or off.

## Journey map

| Stage | Learner goal | What they see | One next action | Friction removed |
|---|---|---|---|---|
| 1. Arrive | "Is this for me? Is it safe?" | Welcome: what it is, free/private/offline, not advice | **Start** | No account, no cookie wall, tiny download |
| 2. Choose how to start (optional) | Learn their way | Read (always on) · See · Hear · Do cards | **Next** or Skip | No "learning style" label; can change any time |
| 3. Get comfortable (optional) | Readable on their phone | Text size slider, colours | **Go to Module 0** | Settings remembered |
| 4. Module overview | Know what's ahead | Why it matters, 3 steps with time, objectives | **Start: Learn** | Clear time estimates from the syllabus |
| 5. Learn | Understand the ideas | Text + See/Hear/Do layers; terms open meanings | **Done — next: Practise** | Mode bar at top; text always there |
| 6. Practise | Do the calculations | Worked examples in tracks; walkthroughs; tools; Python | **Done — next: Check** | Tracks filter; "Reset to syllabus values" |
| 7. Mastery gate | Prove it | Knowledge check, one question per screen, worked answer after each | **Check answer → Next** | Unlimited attempts, no timer, new questions each time |
| 8. Unlock / retry | Move on or try again | Passed → next module unlocked; or review + retry | **Continue to M(n+1)** or **Try again** | Review shows every answer and its source |
| 9. Checkpoint exams (after M10, M15, M19) | Consolidate | 40 questions, 60 min, formula sheet, calculator | **Start the exam** | Time adjustable; add time when warned; saved as you go |
| 10. Capstone (milestones after M12/M13/M15/M19) | Apply everything | Scenario, 8 deliverables with notes, rubric self/peer rating | **Record my capstone as complete** | Workbook outline download; draft export for peer review |
| 11. Final exam and completion | Finish | 80 questions, 120 min; progress page with weighted score | **Print my learning record** | Clear statement: not a certificate, not accredited |

Interruptions are normal: "Continue where you left off" appears on the home screen after any lesson,
quiz or exam; quiz and exam sessions resume after a reload, crash or flat battery.

## Usability principles (applied on every screen)

1. **One clear next action** — a single filled primary button, usually in a sticky bar at the bottom.
2. **Plain language** — terms explained at first use; no unexplained acronyms in navigation.
3. **Show time** — every step shows the syllabus time estimate; home shows hours left.
4. **Never lose work** — save after every interaction; resume everywhere.
5. **Respect the device** — small first load; heavy things (audio, Python) only on request with sizes shown.
6. **Calm, honest feedback** — explain mistakes with the worked answer; no streaks, guilt or dark patterns.
7. **Trust visible** — sources and review dates on every lesson; open issues published.
