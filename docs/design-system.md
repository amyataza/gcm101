# Design system

Source of truth: `web/css/app.css` (tokens at the top). Screenshots: `docs/screenshots/`.

## Direction

A calm, trustworthy "field guide": warm paper background, ink text, one deep-teal brand colour and an
amber accent for references and highlights. Generous type, short line lengths, few colours, and status
always shown with words and icons. Nothing decorative that costs bytes: system fonts, inline SVG icons,
no images.

## Tokens

| Token | Light | Dark | High contrast | Use |
|---|---|---|---|---|
| `--bg` | `#fbfaf7` | `#12161c` | `#000` | Page |
| `--surface` | `#ffffff` | `#1a2028` | `#000` | Cards, inputs |
| `--surface-2` | `#f2f0ea` | `#222a34` | `#111` | Quiet fills |
| `--ink` / `--ink-2` | `#1b2430` / `#4a5462` | `#e9e7e2` / `#b4b9c1` | `#fff` / `#fff` | Text / secondary text |
| `--line` | `#d9d5cc` | `#36404c` | `#fff` | Borders |
| `--brand` | `#0d5c63` | `#6cc7c1` | `#ffd400` | Primary actions, links, active states |
| `--accent` | `#8a5a00` | `#f0c36b` | `#ffd400` | Reference codes, second chart series |
| `--ok` / `--warn` / `--bad` | `#1d6b3a` / `#8a4b00` / `#a3261b` | `#7fd49a` / `#f2b56b` / `#ff9d92` | bright equivalents | Status (always with icon + word) |
| `--focus` | `#1a5fd0` | `#8ab4ff` | `#00e5ff` | 3 px focus outline |

All text pairs meet 4.5:1 (AA) in light and dark; high contrast meets 7:1. Verified by axe-core in all
three themes (docs/testing/accessibility-report.md).

**Spacing:** 4 · 8 · 12 · 16 · 24 · 32 · 48 px (`--s1`…`--s7`). **Radii:** 6 · 10 · 16 px.
**Touch target:** 44 px minimum (`--tap`). **Motion:** 160 ms, set to 0 when reduced motion is on.

## Type

- System UI font stack; optional serif or "wide and spaced" reading fonts (no downloads).
- Base 17 px, scaled by the learner from 85% to 160% (all sizes in `rem`).
- Scale: 0.78 (eyebrow) · 0.875 (small) · 1 · 1.125 (lead) · 1.15 (h3) · 1.375 (h2) · 1.75 rem (h1).
- Line height 1.6 (1.9 with "More space"); reading measure 68 characters.

## Components

| Component | Notes |
|---|---|
| **Button** `.btn` | Outline by default; `.primary` filled for the single main action per screen; `.quiet` for tertiary; 44 px high |
| **Toggle** `.toggle[aria-pressed]` | Mode bar, track filter; tick mark appears when on (not colour alone) |
| **Chip** `.chip` + icon | Status: Not started ▷ · In progress ◔ · Passed ✓ · Not passed yet ⚠ · Locked 🔒; reference codes `a.ref` |
| **Course-map row** `.mrow` | Code · title + hours · status chip; locked rows are filled grey and still open for preview |
| **Steps** `.steps` | Learn → Practise → Check with time estimates and ✓ when done |
| **Mode bar** `.modebar` | "Learn by: Read ✓ (always on) · See · Hear · Do" — sticky on desktop, inline on phones |
| **Example card** `.example` | Kind chip, refs, a primary-source line for historical cases (or a "Primary source pending" chip if one is missing); segments: Problem, Track A/B/C (coloured *and* labelled with icons, dashed for optional C), Meaning note |
| **Erratum** `.erratum` | Amber box beside the example: syllabus value vs recomputed value |
| **Widget** `.widget` | Header with eye (See) or hand (Do) icon; sliders paired with number fields; live results region; chart; reset to syllabus values |
| **Figure** `.visual` | Title, SVG, caption with source, "Text description" disclosure with data table, AI-assisted label |
| **Quiz card** `.qcard` | One question per screen; big radio rows; numeric field with unit; feedback panel with ✓/✗, answer, working and source link |
| **Drawer** `.drawer` | Calculator and formula sheet during exams (bottom sheet on phones) |
| **Sources panel** `.sources-panel` | Source of truth + line numbers, last reviewed, content version, benchmark trace, references, review schedule, pending-source and erratum notes, AI note, report link |
| **Callout** `.callout` (`.warn`, `.ok`, `.bad`) and **notice** | Locked, passed, integrity, disclaimers |
| **Toast** | Short confirmations ("Saved on this device."), also announced to screen readers |

## Charts

- Width follows the screen (320–640 units) so 12-unit text renders at about 12 px on phones.
- Series differ by stroke pattern (solid, long dash, dotted) as well as colour; markers carry text labels.
- Every chart: `<title>`, `<desc>`, a visible "Text description" and a data table.

## Writing style (microcopy)

Plain English, second person, active voice. Explain a term at first use (glossary tooltips). One clear
next action per screen ("Done — next: Practise"). Never pressure: no streaks, badges, countdowns outside
exams, or nagging. Always say what happens to data ("Saved on this device").
