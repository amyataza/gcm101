// About, privacy, methodology, AI use, accessibility, audit, credential mapping and references.
import { h, icon, fmtDate } from '../ui.js';
import * as content from '../content.js';

export async function render(ctx) {
  const { route } = ctx;
  if (route.name === 'sources') return sources(ctx);
  if (route.name === 'credentials') return credentials(ctx);
  if (route.name === 'methodology') return methodology(ctx);
  const page = ctx.params.page || 'index';
  const pages = { index, privacy, ai, accessibility, audit, report, disclaimer };
  return (pages[page] || index)(ctx);
}

const back = () => h('p', {}, h('a', { href: '#/about' }, '‹ About'));
const navList = () => h('ul', {},
  [['#/about/disclaimer', 'Educational use only — not investment advice'], ['#/about/privacy', 'Privacy'], ['#/methodology', 'Methodology: how the course was built'], ['#/about/ai', 'Use of AI in this app'],
    ['#/about/accessibility', 'Accessibility statement'], ['#/about/audit', 'Open content issues (transparency report)'], ['#/credentials', 'How GCM-101 maps to other credentials'], ['#/sources', 'All references'], ['#/about/report', 'Report a problem']]
    .map(([href, t]) => h('li', {}, h('a', { href }, t))));

async function index({ course: c, setTitle }) {
  setTitle('About', 'About');
  const site = await content.overlay('site');
  const audit = await content.audit();
  const warn = audit.issues.filter((i) => i.severity !== 'info').length;
  return h('section', { class: 'prose' },
    h('h1', {}, 'About GCM-101'),
    h('p', { class: 'lead' }, c.subtitle),
    h('ul', {}, c.atAGlance.map((a) => h('li', { html: a.html }))),
    h('div', { class: 'callout' }, h('p', { class: 'callout-title' }, icon('shield'), ' Educational only'), h('p', {}, 'GCM-101 explains how capital markets work. It does not give personalised financial, investment, legal or tax advice, and nothing in it is a recommendation to buy or sell anything. Worked examples use illustrative numbers unless a source is cited.')),
    h('h2', {}, 'Trust at a glance'),
    h('ul', {},
      h('li', {}, `Single source of truth: the ${c.syllabus.code} syllabus v${c.syllabus.version}, dated ${fmtDate(c.syllabus.date)} (${c.syllabus.status}).`),
      h('li', {}, 'Every lesson shows its references, the syllabus lines it comes from and the review date.'),
      h('li', {}, 'Every worked-example answer is recomputed by automated tests; Python examples are executed and checked.'),
      h('li', {}, `${warn} open item(s) need attention, such as historical cases still awaiting a primary source — `, h('a', { href: '#/about/audit' }, 'see the transparency report'), '.'),
      h('li', {}, 'No accounts, payments, ads, tracking or dark patterns. Progress stays on your device.')),
    h('h2', {}, 'More'),
    navList(),
    h('h2', {}, 'Licences and version'),
    h('p', { class: 'small' }, site.licenceContent || ''),
    h('p', { class: 'small muted' }, `Content version ${c.contentVersion}${site.publisher ? ` · published by ${site.publisher}` : ''}.`));
}

async function disclaimer({ setTitle }) {
  setTitle('Not investment advice');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Educational use only'),
    h('p', {}, 'This course teaches how capital markets work. It is general education. It is not financial, investment, legal or tax advice and does not take your circumstances into account.'),
    h('ul', {},
      h('li', {}, 'Worked examples use round, illustrative numbers unless a source code (such as [R1]) is given. They are not forecasts.'),
      h('li', {}, 'Calculators and simulations are learning tools. Do not use them to make real financial decisions.'),
      h('li', {}, 'Company, country and market names appear as case studies drawn from the syllabus, not as recommendations.'),
      h('li', {}, 'If you need advice, speak to a qualified, regulated adviser in your country.')),
    h('p', {}, 'Completing GCM-101 does not give you a licence, an accredited qualification or eligibility for any exam. See ', h('a', { href: '#/credentials' }, 'credential mapping'), '.'));
}

async function privacy({ setTitle, course: c }) {
  setTitle('Privacy');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Privacy'),
    h('p', { class: 'lead' }, 'Short version: we collect nothing. Your progress lives on your device.'),
    h('h2', {}, 'What is stored, and where'),
    h('ul', {},
      h('li', {}, 'Your settings, progress, quiz attempts, notes and (if switched on) active study time are stored in your browser on this device (IndexedDB, or local storage as a fallback).'),
      h('li', {}, 'Downloaded lessons and audio are stored in the browser cache so they work offline.'),
      h('li', {}, 'Nothing is sent to the course publisher. There are no accounts, cookies for tracking, analytics, advertising or third-party trackers.')),
    h('h2', {}, 'Network requests'),
    h('ul', {},
      h('li', {}, 'Course files are fetched from the same website that served the app.'),
      h('li', {}, 'Only if you choose to run Python in the browser: the Python runtime (Pyodide) is downloaded from cdn.jsdelivr.net. No personal data is sent; the CDN sees an ordinary file request.'),
      h('li', {}, 'Links to external sources (for example regulators or Google Colab) open in a new tab only when you click them.'),
      h('li', {}, 'Read-aloud uses on-device voices by default. If you allow online voices in Settings, the text being read is sent to the voice provider chosen by your device.')),
    h('h2', {}, 'Your control'),
    h('ul', {},
      h('li', {}, 'Back up, import or erase everything in ', h('a', { href: '#/settings?at=data' }, 'Settings → Your data'), '.'),
      h('li', {}, 'Clearing your browser’s site data also erases everything.'),
      h('li', {}, 'Exports (progress backup, study-time log) are files you control; share them only if you choose to, for example in a pilot study with informed consent.')),
    h('p', { class: 'small muted' }, `Privacy-by-design: data minimisation, local processing, no third-party scripts at start-up, content security policy enforced. Reviewed ${fmtDate(c.syllabus.date)}.`));
}

async function ai({ setTitle }) {
  setTitle('Use of AI');
  const audio = await content.overlay('audio');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'How AI was used'),
    h('p', {}, 'We want you to know exactly which parts were made or assisted by AI.'),
    h('div', { class: 'table-wrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Part'), h('th', {}, 'How it was made'), h('th', {}, 'Checks'))),
      h('tbody', {},
        h('tr', {}, h('th', {}, 'Lesson text, objectives, terms, examples, cases'), h('td', {}, 'Taken from the GCM-101 syllabus without rewording financial claims.'), h('td', {}, 'Extraction script; content audit; references shown on every page.')),
        h('tr', {}, h('th', {}, 'Read-aloud'), h('td', {}, 'Synthetic voice from your device’s text-to-speech engine.'), h('td', {}, 'Reads the on-screen text; nothing added.')),
        h('tr', {}, h('th', {}, 'Audio summaries'), h('td', {}, `AI-generated speech${audio.engine ? ` (${audio.engine.name}; voice: ${audio.engine.voice}; ${audio.engine.licence})` : ''} reading the syllabus text.`), h('td', {}, 'Transcript shown beside every file.')),
        h('tr', {}, h('th', {}, 'Diagrams, calculators, simulations, quiz wording'), h('td', {}, 'Original work drafted with AI assistance (Claude) from the syllabus.'), h('td', {}, 'Numbers come from tested code; each quiz item records the syllabus location it is based on; awaiting subject-matter expert review.')),
        h('tr', {}, h('th', {}, 'Quiz answers and calculations'), h('td', {}, 'Computed by code, never typed by hand.'), h('td', {}, 'Automated tests reproduce every worked-example answer in the syllabus.'))))),
    h('p', {}, 'No AI runs in the app itself, and nothing you type is sent to an AI service.'));
}

async function accessibility({ setTitle }) {
  setTitle('Accessibility');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Accessibility statement'),
    h('p', {}, 'Target: WCAG 2.2 level AA. See docs/testing for the latest audit results.'),
    h('ul', {},
      h('li', {}, 'Works with keyboard only, touch and screen readers (tested with automated axe-core checks; manual screen-reader checks are part of the pilot plan).'),
      h('li', {}, 'Light, dark and high-contrast themes; adjustable text size, font and line spacing; reduced motion.'),
      h('li', {}, 'Every lesson works with text alone. Every chart has a text description and a data table; audio has transcripts; animations have captions.'),
      h('li', {}, 'Colour is never the only signal: status uses words and icons; chart lines differ by dash pattern.'),
      h('li', {}, 'Exam time limits can be extended or switched off, and you can add time when a warning appears.'),
      h('li', {}, 'Drag-and-drop activities also work with buttons and menus.')),
    h('h2', {}, 'Known limitations'),
    h('ul', {},
      h('li', {}, 'Read-aloud quality depends on the voices installed on your device.'),
      h('li', {}, 'The in-browser Python runner needs a one-time download of about 12 MB.'),
      h('li', {}, 'Some applied tasks need current data from the internet and cannot be completed offline.')));
}

async function audit({ setTitle }) {
  setTitle('Transparency report');
  const a = await content.audit();
  const by = (sev) => a.issues.filter((i) => i.severity === sev);
  const tbl = (list) => h('div', { class: 'table-wrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Where'), h('th', {}, 'Finding'), h('th', {}, 'Action'))),
    h('tbody', {}, list.map((i) => h('tr', {}, h('th', {}, i.where), h('td', {}, i.message), h('td', {}, i.action))))));
  return h('section', {}, back(),
    h('h1', {}, 'Transparency report'),
    h('p', { class: 'lead' }, `Generated from the syllabus on ${fmtDate(a.generatedAt)} (content ${a.contentVersion}). We publish what still needs work.`),
    h('div', { class: 'grid three' }, ...Object.entries({ Modules: a.counts.modules, 'Key terms': a.counts.keyTerms, 'Worked examples': a.counts.workedExamples, Cases: a.counts.cases, 'Python snippets': a.counts.pythonSnippets, References: a.counts.references })
      .map(([k, v]) => h('div', { class: 'card flat' }, h('div', { style: { fontSize: '1.4rem', fontWeight: 800 } }, v), h('div', { class: 'small muted' }, k)))),
    h('p', {}, `Hours check: modules ${a.hours.modulesCore} + capstone ${a.hours.capstone} + final ${a.hours.final} = ${a.hours.totalCore} core hours (stated ${a.hours.statedCore}); Python ${a.hours.totalPython} h (stated ${a.hours.statedPython}).`),
    h('h2', {}, `Needs attention (${by('error').length + by('warn').length})`), tbl([...by('error'), ...by('warn')]),
    h('h2', {}, `Notes (${by('info').length})`), tbl(by('info')));
}

async function report({ setTitle }) {
  setTitle('Report a problem');
  const site = await content.overlay('site');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Report a problem'),
    h('p', {}, 'Found an error, a broken link or something hard to use? Please tell us which module and example (for example “M13, Worked example 13.3”) and what you expected.'),
    site.reportUrl ? h('p', {}, h('a', { class: 'btn primary', href: site.reportUrl, target: '_blank', rel: 'noopener' }, 'Open the issue tracker')) : h('p', {}, 'Tell the organisation or teacher who gave you this course. Course publishers: add a contact link in content/overlays/site.json.'),
    h('p', { class: 'small muted' }, 'Please do not include personal information.'));
}

async function sources({ course: c, params, setTitle }) {
  setTitle('References', 'References');
  const about = await content.about();
  const code = params.code;
  const node = h('section', { class: 'prose' },
    h('h1', {}, 'References'),
    h('p', {}, 'Codes used throughout the course: ', h('strong', {}, 'S'), ' = benchmark course, ', h('strong', {}, 'R'), ' = other reference for a factual claim, ', h('strong', {}, 'D'), ' = design decision.'),
    h('h2', {}, 'Benchmark courses (S1–S13)'),
    h('dl', {}, about.methodology.sources.flatMap((s) => [h('dt', { id: s.id }, h('strong', {}, s.id), ' ', s.url ? h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.course) : s.course), h('dd', {}, `${s.provider}. Audience: ${s.audience}. Effort: ${s.effort}. Assessment: ${s.assessment}.`)])),
    h('h2', {}, 'Other references (R1–R7)'),
    h('dl', {}, c.references.filter((r) => r.id[0] === 'R').flatMap((r) => [h('dt', { id: r.id }, h('strong', {}, r.id)), h('dd', { html: r.html })])),
    h('h2', {}, 'Claims and review dates'),
    h('ul', {}, c.claims.map((cl) => h('li', {}, `${cl.claim} — ${cl.source} — review: ${cl.review}`))),
    h('h2', {}, 'Design decisions (D1–D16)'),
    h('dl', {}, about.methodology.decisions.flatMap((d) => [h('dt', { id: d.id }, h('strong', {}, d.id)), h('dd', {}, h('span', { html: d.html }), h('br'), h('span', { class: 'small muted', html: `Evidence: ${d.evidenceHtml}` }))])));
  if (code) queueMicrotask(() => node.querySelector(`#${code}`)?.scrollIntoView({ block: 'start' }));
  return node;
}

async function credentials({ setTitle }) {
  setTitle('Credential mapping');
  const about = await content.about();
  const t = about.credentials.table;
  const { inline } = await import('../md.js');
  return h('section', {},
    h('h1', {}, 'How GCM-101 maps to other credentials'),
    h('div', { class: 'callout warn' }, h('p', { class: 'callout-title' }, 'Overlap is topical only'), h('div', { class: 'prose', html: about.credentials.introHtml })),
    h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': 'Credential mapping' }, h('table', {},
      h('thead', {}, h('tr', {}, t.header.map((x) => h('th', { scope: 'col', html: inline(x) })))),
      h('tbody', {}, t.rows.map((r) => h('tr', {}, r.map((x, i) => (i ? h('td', { html: inline(x) }) : h('th', { scope: 'row', html: inline(x) })))))))),
    h('p', { class: 'small muted' }, 'GCM-101 is not accredited by any of these bodies and does not confer eligibility for their exams.'));
}

async function methodology({ course: c, setTitle }) {
  setTitle('Methodology', 'Methodology');
  const about = await content.about();
  const mth = about.methodology;
  const { inline } = await import('../md.js');
  const mtx = mth.matrix;
  return h('section', {},
    h('h1', {}, 'Methodology'),
    h('p', { class: 'lead' }, 'How the syllabus was built, and how this app turns it into lessons without changing its claims.'),
    h('h2', {}, 'From syllabus to app'),
    h('ol', { class: 'prose' },
      h('li', {}, 'The syllabus Markdown file is the single source of truth. A script extracts its modules, objectives, terms, examples, assessments, references and rubric into structured files, and writes a content audit.'),
      h('li', {}, 'Additions that are not in the syllabus (quiz wording, diagrams, interactive settings) live in separate overlay files. Each records the syllabus location it is based on.'),
      h('li', {}, 'Automated tests recompute every worked-example answer, run the Python examples, and check that quiz generators reproduce the syllabus answers.'),
      h('li', {}, 'Every page shows its references, syllabus line numbers and review date.')),
    h('h2', {}, 'Course description'),
    h('div', { class: 'prose', html: c.descriptionHtml }),
    h('h2', {}, 'How the syllabus was benchmarked'),
    h('div', { class: 'prose', html: mth.methodHtml }),
    h('h3', {}, 'Topic-vs-course matrix'),
    h('p', { class: 'small muted' }, '● dedicated unit · ◐ sub-topic · – not found in the published outline'),
    h('div', { class: 'table-wrap', tabindex: 0, role: 'region', 'aria-label': 'Topic matrix' }, h('table', { class: 'small' },
      h('thead', {}, h('tr', {}, mtx.header.map((x) => h('th', { scope: 'col' }, x)))),
      h('tbody', {}, mtx.rows.map((r) => h('tr', {}, r.map((x, i) => (i === 1 ? h('th', { scope: 'row' }, x) : h('td', { style: { textAlign: i > 1 ? 'center' : null }, 'aria-label': x === '●' ? 'dedicated unit' : x === '◐' ? 'sub-topic' : x === '–' ? 'not found' : null }, x)))))))),
    h('h3', {}, 'Findings'), h('div', { class: 'prose', html: mth.findingsHtml }),
    h('h3', {}, 'Sequencing and assessment'), h('div', { class: 'prose', html: mth.sequencingHtml }),
    h('h2', {}, 'Self-check and limitations'),
    about.selfCheck.map((s) => h('section', {}, h('h3', {}, s.heading), h('div', { class: 'prose', html: s.html }))),
    h('h2', {}, 'Change log'),
    h('ul', {}, about.changelog.map((x) => h('li', {}, `${x.Version} (${x.Date}): ${x.Change}`))));
}
