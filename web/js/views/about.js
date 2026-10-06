// About, privacy, methodology, AI use, accessibility, audit, credential mapping and references.
import { h, icon, fmtDate } from '../ui.js';
import * as content from '../content.js';

export async function render(ctx) {
  const { route } = ctx;
  if (route.name === 'sources') return sources(ctx);
  if (route.name === 'credentials') return credentials(ctx);
  if (route.name === 'methodology') return methodology(ctx);
  const page = ctx.params.page || 'index';
  const pages = { index, privacy, ai, accessibility, audit, report, disclaimer, beta };
  return (pages[page] || index)(ctx);
}

const back = () => h('p', {}, h('a', { href: '#/about' }, '‹ About'));
const navList = () => h('ul', {},
  [['#/about/beta', 'What “beta” means here'], ['#/about/disclaimer', 'Educational use only — not investment advice'], ['#/about/privacy', 'Privacy'], ['#/methodology', 'Methodology: how the course was built'], ['#/about/ai', 'Use of AI in this app'],
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
    betaCallout(),
    h('h2', {}, 'Trust at a glance'),
    h('ul', {},
      h('li', {}, `Single source of truth: the ${c.syllabus.code} syllabus v${c.syllabus.version}, dated ${fmtDate(c.syllabus.date)} (${c.syllabus.status}).`),
      h('li', {}, 'Every lesson shows its references, the syllabus lines it comes from and the review date.'),
      h('li', {}, 'Every worked-example answer is recomputed by automated tests; Python examples are executed and checked.'),
      h('li', {}, warn ? `${warn} open item(s) in the content audit need attention — ` : 'The content audit has no open warnings; its notes (for example tasks that need live data) are public — ', h('a', { href: '#/about/audit' }, 'see the transparency report'), '.'),
      h('li', {}, 'Every historical case cites a primary source (regulator, central bank, government or court document).'),
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

async function privacy({ setTitle }) {
  setTitle('Privacy');
  const site = await content.overlay('site');
  const host = site.host || 'the website host';
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Privacy'),
    h('p', { class: 'lead' }, 'Short version: the course publisher collects nothing about you. Your progress lives on your device. The website host and, if you use Python, a file server see ordinary web requests.'),
    h('h2', {}, 'What is stored, and where'),
    h('ul', {},
      h('li', {}, 'Your settings, progress, quiz attempts, notes and (if switched on) active study time are stored in your browser on this device (IndexedDB, or local storage as a fallback). The app asks the browser to keep this storage so it is not cleared when space runs low.'),
      h('li', {}, 'Downloaded lessons, audio and (if used) the Python runtime are stored in the browser cache so they work offline.'),
      h('li', {}, 'The app sends nothing to the course publisher. It sets no cookies and has no accounts, analytics, advertising or third-party trackers.')),
    h('h2', {}, 'Who can see that you visited'),
    h('ul', {},
      h('li', {}, `This site is hosted on ${host}. Like every web host, it receives your IP address, browser details and the files you request when you load pages, and may keep them in its own logs for security and operations. The course publisher does not receive these logs or any visitor statistics. `,
        site.hostPrivacyUrl ? h('a', { href: site.hostPrivacyUrl, target: '_blank', rel: 'noopener' }, `${host} privacy statement`) : null),
      h('li', {}, 'Only if you choose to run Python: the Python runtime (Pyodide) is downloaded from cdn.jsdelivr.net, which sees an ordinary file request including your IP address. Your code and answers are not sent; Python runs on your device.'),
      h('li', {}, 'Read-aloud uses on-device voices by default. If you allow online voices in Settings, the text being read is sent to the voice provider your device uses (for example Google, Apple or Microsoft).'),
      h('li', {}, 'Links to external sources (regulators, GitHub, Google Colab) open in a new tab only when you click them; those sites have their own privacy policies.')),
    h('h2', {}, 'Your control'),
    h('ul', {},
      h('li', {}, 'Back up, import or erase everything in ', h('a', { href: '#/settings?at=data' }, 'Settings → Your data'), '.'),
      h('li', {}, 'Clearing your browser’s site data also erases everything.'),
      h('li', {}, 'Exports (progress backup, study-time log) are files you control; share them only if you choose to, for example in a pilot study with informed consent.'),
      h('li', {}, 'Reporting a problem on GitHub is public and needs a GitHub account; please do not include personal information.')),
    h('p', { class: 'small muted' }, `Privacy by design: data minimisation, processing on your device, no third-party code at start-up, content security policy enforced. Last reviewed ${fmtDate(site.lastAppReview)}.`));
}

async function ai({ setTitle }) {
  setTitle('Use of AI');
  const audio = await content.overlay('audio');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'How AI was used'),
    h('p', {}, 'We want you to know exactly which parts were made or assisted by AI.'),
    h('div', { class: 'table-wrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Part'), h('th', {}, 'How it was made'), h('th', {}, 'Checks'))),
      h('tbody', {},
        h('tr', {}, h('th', {}, 'The syllabus'), h('td', {}, 'Written by the course author with AI assistance (Claude), benchmarked against 13 published programmes.'), h('td', {}, 'Every figure cites a source; worked-example answers recomputed by tests; primary sources attached to historical cases.')),
        h('tr', {}, h('th', {}, 'Lesson text, objectives, terms, examples, cases'), h('td', {}, 'Taken from the syllabus by a script, without rewording financial claims.'), h('td', {}, 'Extraction script; content audit; references shown on every page.')),
        h('tr', {}, h('th', {}, 'Read-aloud'), h('td', {}, 'Synthetic voice from your device’s text-to-speech engine.'), h('td', {}, 'Reads the on-screen text; nothing added.')),
        h('tr', {}, h('th', {}, 'Audio summaries'), h('td', {}, `AI-generated speech${audio.engine ? ` (${audio.engine.name}; voice: ${audio.engine.voice}; ${audio.engine.licence})` : ''} reading the syllabus text.`), h('td', {}, 'Transcript shown beside every file.')),
        h('tr', {}, h('th', {}, 'Diagrams, calculators, simulations, quiz wording'), h('td', {}, 'Original work drafted with AI assistance (Claude) from the syllabus.'), h('td', {}, 'Numbers come from tested code; each quiz item records the syllabus location it is based on; awaiting subject-matter expert review.')),
        h('tr', {}, h('th', {}, 'Quiz answers and calculations'), h('td', {}, 'Computed by code, never typed by hand.'), h('td', {}, 'Automated tests reproduce every worked-example answer in the syllabus.'))))),
    h('p', {}, 'No AI runs in the app itself, and nothing you type is sent to an AI service.'));
}

async function accessibility({ setTitle }) {
  setTitle('Accessibility');
  const site = await content.overlay('site');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Accessibility statement'),
    h('p', {}, 'Target: WCAG 2.2 level AA. ', site.repoUrl ? h('a', { href: `${site.repoUrl}/blob/main/docs/testing/accessibility-report.md`, target: '_blank', rel: 'noopener' }, 'Latest automated audit results') : 'Audit results are in docs/testing.', '.'),
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

async function report({ setTitle, query, course: c }) {
  setTitle('Report a problem');
  const site = await content.overlay('site');
  const from = query.get('from') || '';
  // Only the page route and content version go into the pre-filled text — never anything personal.
  const title = from ? `Problem on ${from}` : 'Problem report';
  const body = `**Page:** ${from || '(which module and example?)'}\n**Content version:** ${c.contentVersion}\n\n**What looks wrong?**\n\n**What did you expect?**\n\n_Please do not include personal information._`;
  const url = site.reportUrl ? `${site.reportUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=learner-report` : '';
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'Report a problem'),
    h('p', {}, 'Found an error, a broken link or something hard to use? Say which module and example (for example “M13, Worked example 13.3”) and what you expected.'),
    url ? [h('p', {}, h('a', { class: 'btn primary', href: url, target: '_blank', rel: 'noopener' }, from ? 'Report a problem with this page' : 'Open a problem report')),
      h('p', { class: 'small' }, 'Reports are filed on GitHub, are public, and need a free GitHub account. The form is pre-filled with the page and content version only.')]
      : h('p', {}, 'Tell the organisation or teacher who gave you this course.'),
    site.repoUrl ? h('p', { class: 'small' }, 'You can also see problems others have reported: ', h('a', { href: `${site.repoUrl}/issues`, target: '_blank', rel: 'noopener' }, 'open reports'), '.') : null,
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

export function betaCallout() {
  return h('div', { class: 'callout warn' }, h('p', { class: 'callout-title' }, 'Public beta'),
    h('p', {}, 'The syllabus text, its sources and every calculation have been checked. The practice questions, diagrams and activities written for this app are still awaiting review by an independent subject-matter expert, and the course has not yet been piloted with learners. ',
      h('a', { href: '#/about/beta' }, 'What this means'), ' · ', h('a', { href: '#/about/report' }, 'Report a problem')));
}

async function beta({ setTitle }) {
  setTitle('Beta');
  return h('section', { class: 'prose' }, back(),
    h('h1', {}, 'What “public beta” means here'),
    h('h2', {}, 'Checked'),
    h('ul', {},
      h('li', {}, 'The syllabus text is shown exactly as written; each lesson shows its references, line numbers and review date.'),
      h('li', {}, 'Every numeric answer in the syllabus worked examples is recomputed by automated tests, and every Python example is run.'),
      h('li', {}, 'Each historical case cites a primary source from a regulator, central bank, government or court.'),
      h('li', {}, 'The app passes automated accessibility (WCAG 2.2 AA) and offline tests.')),
    h('h2', {}, 'Not yet checked'),
    h('ul', {},
      h('li', {}, 'Practice and exam questions, diagrams and activities written for this app (with AI assistance) have not yet been reviewed by an independent subject-matter expert. Each question records the part of the syllabus it is based on.'),
      h('li', {}, 'The course has not yet been tested with learners, so study-hour estimates are the syllabus’s design targets.'),
      h('li', {}, 'Screen-reader use has been checked by automated tools, not yet by people who rely on them.')),
    h('p', {}, 'Scores and the printable learning record are for your own use while the course is in beta. If something looks wrong, please ', h('a', { href: '#/about/report' }, 'report it'), '.'));
}
