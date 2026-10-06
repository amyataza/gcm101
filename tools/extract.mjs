#!/usr/bin/env node
// Content pipeline: Intro-Global-Capital-Markets-Syllabus.md  ->  web/content/*.json + docs/content-audit.md
//
// The syllabus is the single source of truth. This script only restructures it; it never adds
// financial claims. Authored additions (quiz wording, interactive settings, diagram specs) live in
// web/content/overlays/ and are validated here against the extracted structure.
//
// Usage: node tools/extract.mjs [path/to/syllabus.md]

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, inline, parseTable, plain } from '../web/js/md.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(process.argv[2] || join(ROOT, 'Intro-Global-Capital-Markets-Syllabus.md'));
const OUT = join(ROOT, 'web/content');
const DOCS = join(ROOT, 'docs');

const raw = readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const contentHash = createHash('sha256').update(raw).digest('hex').slice(0, 12);

// ---------------------------------------------------------------- front matter
const fm = {};
let body = raw;
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
if (fmMatch) {
  for (const line of fmMatch[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map((x) => x.trim());
    else v = v.replace(/^"(.*)"$/, '$1');
    fm[m[1]] = v;
  }
  body = raw.slice(fmMatch[0].length);
}
const fmLineOffset = fmMatch ? fmMatch[0].split('\n').length - 1 : 0;
const lines = body.split('\n');

// ---------------------------------------------------------------- heading index
const headings = [];
{
  let inFence = false;
  lines.forEach((l, i) => {
    if (/^```/.test(l)) inFence = !inFence;
    if (inFence) return;
    const m = l.match(/^(#{1,6})\s+(.*)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: i });
  });
}
const lineNo = (i) => i + 1 + fmLineOffset; // 1-based line in the original file

function sectionLines(h) {
  const idx = headings.indexOf(h);
  let end = lines.length;
  for (let j = idx + 1; j < headings.length; j++) {
    if (headings[j].level <= h.level) { end = headings[j].line; break; }
  }
  return { start: h.line + 1, end, text: lines.slice(h.line + 1, end).join('\n') };
}
const findH = (re, level) => headings.find((h) => (!level || h.level === level) && re.test(h.text));
const childrenOf = (h, level) => {
  const { start, end } = sectionLines(h);
  return headings.filter((x) => x.line >= start && x.line < end && x.level === level);
};
const stripRules = (t) => t.replace(/\n-{3,}\s*$/g, '').replace(/^\s*-{3,}\s*\n/g, '').trim();

function tableIn(text) {
  const ls = text.split('\n');
  const start = ls.findIndex((l, i) => /^\s*\|/.test(l) && /^\s*\|?\s*:?-+/.test(ls[i + 1] || ''));
  if (start < 0) return null;
  let end = start;
  while (end < ls.length && /^\s*\|/.test(ls[end])) end++;
  return parseTable(ls.slice(start, end));
}
const tableObjects = (t) =>
  t ? t.rows.map((r) => Object.fromEntries(t.header.map((h, i) => [h, r[i] ?? '']))) : [];

const REF_RE = /\[((?:S|R|D)\d{1,2})\]/g;
const refsIn = (t) => [...new Set([...String(t).matchAll(REF_RE)].map((m) => m[1]))];
const sortRefs = (a) =>
  [...a].sort((x, y) => x[0].localeCompare(y[0]) || Number(x.slice(1)) - Number(y.slice(1)));

// ---------------------------------------------------------------- course-level parts
const titleH = headings.find((h) => h.level === 1);
const subtitleH = headings.find((h) => h.level === 3 && h.line > titleH.line);
const atAGlance = (() => {
  const t = sectionLines(subtitleH).text;
  const m = t.match(/> \[!abstract\][^\n]*\n((?:>.*\n?)+)/);
  return m ? m[1].split('\n').filter(Boolean).map((l) => l.replace(/^>\s*-\s*/, '').trim()) : [];
})();

const legendH = findH(/^How to read this document/, 2);
const legend = tableObjects(tableIn(sectionLines(legendH).text));

// Part A
const a1 = sectionLines(findH(/^A1\./, 2)).text;
const a2Text = sectionLines(findH(/^A2\./, 2)).text;
const a2 = tableIn(a2Text);
const sources = a2.rows.map((r) => {
  const link = r[1].match(/\[([^\]]+)\]\(([^)]+)\)(.*)/);
  return {
    id: r[0],
    course: link ? (link[1] + link[3]).trim() : r[1],
    url: link ? link[2] : null,
    provider: r[2],
    audience: r[3],
    effort: r[4],
    assessment: r[5],
    credibility: r[6],
    credibilityHtml: inline(r[6]),
  };
});
const dataNotes = (() => {
  const m = a2Text.match(/> \[!note\][^\n]*\n((?:>.*\n?)+)/);
  return m ? m[1].split('\n').filter(Boolean).map((l) => inline(l.replace(/^>\s*-\s*/, '').trim())) : [];
})();
const a3Text = sectionLines(findH(/^A3\./, 2)).text;
const matrix = tableIn(a3Text);
const a4 = sectionLines(findH(/^A4\./, 2)).text;
const a5 = sectionLines(findH(/^A5\./, 2)).text;
const decisions = tableObjects(tableIn(sectionLines(findH(/^A6\./, 2)).text)).map((d) => ({
  id: d.ID, text: d.Decision, html: inline(d.Decision), evidence: d.Evidence, evidenceHtml: inline(d.Evidence),
}));

// Part B
const b1 = sectionLines(findH(/^B1\./, 2)).text;
const clos = tableObjects(tableIn(sectionLines(findH(/^B2\./, 2)).text)).map((c) => ({
  id: c.ID, text: c.Outcome, level: c.Level, topics: c.Topics, modules: c['Main modules'],
}));
const b3Text = sectionLines(findH(/^B3\./, 2)).text;
const courseMap = tableIn(b3Text);
const b4Text = sectionLines(findH(/^B4\./, 2)).text;
const tracks = tableObjects(tableIn(b4Text)).map((t) => ({
  track: t.Track.replace(/\*/g, ''), id: (t.Track.match(/([ABC])\s—/) || [])[1], uses: t['What learners use'], why: t.Why, benchmark: t.Benchmark,
}));
const b5Text = sectionLines(findH(/^B5\./, 2)).text;
const assessmentRows = tableObjects(tableIn(b5Text));
const pct = (s) => Number((String(s).match(/(\d+(?:\.\d+)?)%/) || [])[1]);
const assessment = {
  components: assessmentRows.map((r) => {
    const key = /knowledge/i.test(r.Component) ? 'knowledgeChecks'
      : /applied/i.test(r.Component) ? 'appliedTasks'
      : /checkpoint/i.test(r.Component) ? 'checkpoints'
      : /final/i.test(r.Component) ? 'finalExam'
      : /capstone/i.test(r.Component) ? 'capstone' : 'other';
    return { key, component: r.Component, format: r.Format, weight: pct(r.Weight) / 100, passRule: r['Pass rule'], passMark: pct(r['Pass rule']) / 100 || null };
  }),
  completion: plain((b5Text.match(/\*\*Completion:\*\*([^\n]+)/) || [])[1] || ''),
  integrity: plain((b5Text.match(/\*\*Integrity and accessibility\.\*\*([^\n]+)/) || [])[1] || ''),
};
{
  const cp = assessmentRows.find((r) => /checkpoint/i.test(r.Component));
  const fe = assessmentRows.find((r) => /final/i.test(r.Component));
  const kc = assessmentRows.find((r) => /knowledge/i.test(r.Component));
  const num = (s, re) => Number((String(s).match(re) || [])[1]);
  assessment.checkpointSpec = { items: num(cp.Format, /(\d+)\s*items/), minutes: num(cp.Format, /(\d+)\s*minutes/), passMark: pct(cp['Pass rule']) / 100 };
  assessment.finalSpec = {
    items: num(fe.Format, /(\d+)\s*items/), minutes: num(fe.Format, /(\d+)\s*minutes/),
    conceptualShare: num(fe.Format, /(\d+)%\s*conceptual/) / 100, calculationShare: num(fe.Format, /(\d+)%\s*calculation/) / 100,
    passMark: pct(fe['Pass rule']) / 100,
  };
  const range = String(kc.Format).match(/(\d+)–(\d+)\s*auto-graded/);
  assessment.knowledgeCheckSpec = {
    minItems: range ? Number(range[1]) : 10, maxItems: range ? Number(range[2]) : 15,
    tolerance: num(kc.Format, /±(\d+(?:\.\d+)?)%/) / 100, passMark: pct(kc['Pass rule']) / 100,
  };
  const ap = assessmentRows.find((r) => /applied/i.test(r.Component));
  const rng = String(ap.Component).match(/M(\d+)–M(\d+)/);
  assessment.appliedTaskModules = rng ? { from: Number(rng[1]), to: Number(rng[2]) } : { from: 4, to: 17 };
}

// ---------------------------------------------------------------- course map & checkpoints
const parts = [];
const checkpoints = [];
const mapRows = [];
{
  let part = null;
  let lastModule = null;
  for (const r of courseMap.rows) {
    const [partCell, mod, title, core, py, closCell] = r;
    if (partCell && /^\d/.test(partCell)) {
      part = { n: Number(partCell.match(/^\d+/)[0]), short: partCell.replace(/^\d+\s*/, ''), modules: [] };
      parts.push(part);
    }
    if (/^M\d+/.test(mod)) {
      part.modules.push(mod.toLowerCase());
      lastModule = mod.toLowerCase();
      mapRows.push({ id: mod.toLowerCase(), core: Number(core), python: py === '–' ? 0 : Number(py), clos: closCell.split(',').map((x) => Number(x.trim())).filter(Boolean) });
    } else if (/Checkpoint exam/i.test(title)) {
      const n = Number(title.match(/Checkpoint exam (\d+)/i)[1]);
      const pr = title.match(/Parts? (\d+)–(\d+)/);
      checkpoints.push({ id: `cp${n}`, n, title: plain(title), afterModule: lastModule, parts: pr ? [Number(pr[1]), Number(pr[2])] : null, clos: closCell });
    } else if (/Capstone/i.test(partCell) || /Capital-raising/i.test(title)) {
      mapRows.push({ id: 'capstone', core: Number(core), python: Number(py) || 0, title: plain(title) });
    } else if (/Final/i.test(partCell)) {
      mapRows.push({ id: 'final', core: Number(core), python: 0, title: plain(title) });
    } else if (/Total/.test(title)) {
      mapRows.push({ id: 'total', core: Number(plain(core)), python: Number(plain(py)) });
    }
  }
}

// Part titles from "## PART n — ..." headings in Part C
const partHeads = headings.filter((h) => h.level === 2 && /^PART \d+ —/.test(h.text));
for (const ph of partHeads) {
  const n = Number(ph.text.match(/^PART (\d+)/)[1]);
  const p = parts.find((x) => x.n === n);
  const title = ph.text.replace(/^PART \d+ —\s*/, '');
  const intro = stripRules(sectionLines(ph).text);
  if (p) {
    p.title = title.charAt(0) + title.slice(1).toLowerCase();
    p.introHtml = intro ? render(intro) : '';
  }
}

// ---------------------------------------------------------------- modules
const levelRe = /^\*\*\[(\w+)\]\*\*\s*(.*)$/;
function parseSubtopics(text) {
  const out = [];
  const stack = [{ indent: -1, children: out }];
  for (const l of text.split('\n')) {
    const m = l.match(/^(\s*)-\s+(.*)$/);
    if (!m) continue;
    const indent = m[1].length;
    while (indent <= stack[stack.length - 1].indent) stack.pop();
    const node = { text: m[2], html: inline(m[2]), children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push({ indent, children: node.children });
  }
  return out;
}

const SEG_RE = /\*\*(Track [ABC][^*]*|Problem[^*]*|Tasks?\.|Meaning\.|Discussion[^*]*|Judgement:|Rules\.|With income\.|Answer chain\.|Formula\.)\*\*/g;
function segmentExample(md) {
  const marks = [...md.matchAll(SEG_RE)];
  const segs = [];
  const push = (type, label, text, track) => {
    const t = text.trim();
    if (!t && type === 'problem') return;
    segs.push({ type, label, track, html: render(t) });
  };
  let pos = 0;
  let cur = { type: 'problem', label: null };
  for (const m of marks) {
    if (m.index > pos || segs.length || cur.type !== 'problem') push(cur.type, cur.label, md.slice(pos, m.index), cur.track);
    const label = m[1].replace(/[.:]$/, '').trim();
    const tm = label.match(/^Track ([ABC])/);
    if (tm) cur = { type: 'track', track: tm[1], label };
    else if (/^(Problem|Tasks?)/.test(label)) cur = { type: 'problem', label };
    else cur = { type: 'note', label };
    pos = m.index + m[0].length;
  }
  push(cur.type, cur.label, md.slice(pos), cur.track);
  return segs.filter((s) => s.html);
}

function parseExample(h, moduleId) {
  const { text, start } = sectionLines(h);
  const t = h.text;
  let kind = 'Worked example';
  let num = null;
  let title = t;
  let m;
  if ((m = t.match(/^(Worked example|Case|Exercise)\s+(\d+\.\d+)\s+—\s+(.*)$/))) {
    [, kind, num, title] = m;
  } else if ((m = t.match(/^Track C\s+—\s+(.*)$/))) {
    kind = 'Track C'; title = m[1];
  }
  const md = stripRules(text);
  const code = [...md.matchAll(/```python\n([\s\S]*?)```/g)].map((x) => x[1].replace(/\n$/, ''));
  let segments = segmentExample(md);
  if (kind === 'Track C') segments = [{ type: 'track', track: 'C', label: 'Track C — Python', html: render(md) }];
  const id = num ? `${kind === 'Worked example' ? 'we' : kind === 'Case' ? 'case' : 'ex'}-${num}` : `${moduleId}-python`;
  const tracksPresent = [...new Set(segments.filter((s) => s.track).map((s) => s.track))].sort();
  const titleFlags = [];
  if (/\(illustrative[^)]*\)/i.test(title)) titleFlags.push('illustrative');
  return {
    id, kind, num, title, heading: t,
    html: render(md),
    segments, tracks: tracksPresent, code,
    trackB: [...md.matchAll(/`(=[^`]+)`/g)].map((x) => x[1]),
    refs: sortRefs(refsIn(md)),
    text: plain(md),
    flags: titleFlags,
    line: lineNo(h.line),
  };
}

function parseAssessment(text) {
  const items = [];
  for (const l of text.split('\n')) {
    const m = l.match(/^-\s+\[[ xX]\]\s+(.*)$/);
    if (!m) continue;
    const t = m[1];
    const p = plain(t);
    let kind = 'other';
    if (/^Knowledge check/i.test(p)) kind = 'knowledge-check';
    else if (/^Checkpoint exam/i.test(p)) kind = 'checkpoint';
    else if (/^Optional Python task/i.test(p)) kind = 'python-optional';
    else if (/^Applied task/i.test(p)) kind = 'applied';
    const it = { kind, text: p, html: inline(t) };
    if (kind === 'knowledge-check') {
      it.items = Number((p.match(/(\d+)\s*items/) || [])[1]) || 12;
      it.numericMin = Number((p.match(/≥\s*(\d+)\s*numeric/) || [])[1]) || 0;
    }
    if (kind === 'checkpoint') it.checkpoint = `cp${(p.match(/Checkpoint exam (\d+)/i) || [])[1]}`;
    const name = p.match(/^([^:(]+?)(?:\s*\(.*?\))?:/);
    it.name = name ? name[1].trim() : p.split(':')[0];
    items.push(it);
  }
  return items;
}

const moduleHeads = headings.filter((h) => h.level === 2 && /^M\d+ —/.test(h.text));
const modules = [];
for (const mh of moduleHeads) {
  const [, num, title] = mh.text.match(/^M(\d+) —\s+(.*)$/);
  const id = `m${num}`;
  const sec = sectionLines(mh);
  const pre = lines.slice(sec.start, (headings.find((h) => h.line > mh.line) || { line: sec.end }).line).join('\n');
  const hoursLine = (pre.match(/\*\*Hours:\*\*\s*([^\n]+)/) || [])[1] || '';
  const hm = hoursLine.match(/(\d+(?:\.\d+)?)\s*core\s*\(Learn\s*([\d.]+)\s*·\s*Practise\s*([\d.]+)\s*·\s*Assess\s*([\d.]+)\)(?:\s*\+\s*([\d.]+)\s*Python)?/);
  const hours = hm
    ? { core: Number(hm[1]), learn: Number(hm[2]), practise: Number(hm[3]), assess: Number(hm[4]), python: hm[5] ? Number(hm[5]) : 0, text: hoursLine }
    : { text: hoursLine };
  const why = (pre.match(/\*\*Why it matters\.\*\*\s*([^\n]+)/) || [])[1] || '';
  const subs = childrenOf(mh, 3);
  const get = (re) => subs.find((s) => re.test(s.text));
  const objH = get(/^Learning objectives/);
  const objectives = sectionLines(objH).text.split('\n').map((l) => l.match(/^\d+\.\s+(.*)$/)).filter(Boolean).map((m, i) => {
    const lm = m[1].match(levelRe);
    return { n: i + 1, level: lm ? lm[1] : null, text: lm ? lm[2] : m[1], html: inline(lm ? lm[2] : m[1]) };
  });
  const subH = get(/^Subtopics/);
  const subtopics = parseSubtopics(sectionLines(subH).text);
  const termsH = get(/^Key terms/);
  const terms = tableObjects(tableIn(sectionLines(termsH).text)).map((r) => ({ term: r.Term, meaning: r['Plain-English meaning'], meaningHtml: inline(r['Plain-English meaning']) }));
  const formH = get(/^Core formulas/);
  const formulas = formH ? (sectionLines(formH).text.match(/```\n?([\s\S]*?)```/) || [])[1]?.trim() ?? '' : '';
  const exH = get(/^Worked examples/);
  const examples = exH ? childrenOf(exH, 4).map((h) => parseExample(h, id)) : [];
  const asH = get(/^Assessment/);
  const asText = sectionLines(asH).text;
  const assessmentItems = parseAssessment(asText);
  const traceMatch = asText.match(/\*\*Benchmark trace:\*\*\s*([^\n]+)/);
  const trace = traceMatch ? traceMatch[1] : '';
  const partN = parts.find((p) => p.modules.includes(id))?.n;
  const mapRow = mapRows.find((r) => r.id === id);
  const allText = sec.text;
  const refs = sortRefs(refsIn(allText));
  const kc = assessmentItems.find((a) => a.kind === 'knowledge-check');
  const narration = [
    `Module ${num}. ${title}.`,
    `Why it matters. ${plain(why)}`,
    `By the end of this module you will be able to:`,
    ...objectives.map((o) => `${o.n}. ${plain(o.text)}`),
    `Key terms.`,
    ...terms.map((t) => `${plain(t.term)}: ${plain(t.meaning)}`),
  ].join('\n');
  modules.push({
    id, code: `M${num}`, n: Number(num), title, part: partN,
    hours, why, whyHtml: inline(why),
    objectives, subtopics, terms, formulas, examples,
    assessment: assessmentItems,
    knowledgeCheck: kc ? { items: kc.items, numericMin: kc.numericMin } : null,
    traceHtml: inline(trace), trace: plain(trace),
    refs, sourceCodes: refs.filter((r) => r[0] !== 'D'), decisionCodes: refs.filter((r) => r[0] === 'D'),
    clos: mapRow?.clos ?? [],
    checkpointAfter: checkpoints.find((c) => c.afterModule === id)?.id ?? null,
    audioSummary: narration,
    lines: [lineNo(mh.line), lineNo(sec.end - 1)],
  });
}

// ---------------------------------------------------------------- capstone (Part D)
const pd = findH(/^Part D —/, 1);
const pdText = sectionLines(pd).text;
const pdSubs = childrenOf(pd, 3);
const pdGet = (re) => sectionLines(pdSubs.find((s) => re.test(s.text))).text;
const capstone = {
  title: pd.text.replace(/^Part D —\s*/, ''),
  meta: plain((pdText.match(/\*\*Hours:\*\*([^\n]+)/) || [])[1] || ''),
  purposeHtml: inline((pdText.match(/\*\*Purpose\.\*\*\s*([^\n]+)/) || [])[1] || ''),
  scenarioHtml: render(pdGet(/^Scenario/)),
  deliverables: tableObjects(tableIn(pdGet(/^Deliverables/))).map((d) => ({ n: Number(d['#']), section: d.Section, modules: d['Modules drawn on'], produce: d['What to produce'], produceHtml: inline(d['What to produce']) })),
  formatHtml: inline((pdGet(/^Deliverables/).match(/\*\*Format\.\*\*\s*([^\n]+)/) || [])[1] || ''),
  milestones: pdGet(/^Milestones/).split('\n').map((l) => l.match(/^-\s+\[[ xX]\]\s+\*\*(.+?)\*\*\s*\((after M\d+)\):?\s*(.*)$/)).filter(Boolean).map((m) => ({ name: m[1], after: m[2].replace('after ', '').toLowerCase(), text: m[3] })),
  rubric: (() => {
    const t = tableIn(pdGet(/^Rubric/));
    return {
      levels: t.header.slice(2).map((h) => { const m = h.match(/^(\w+)\s*\(([^)]+)\)/); return { name: m ? m[1] : h, band: m ? m[2] : '' }; }),
      criteria: t.rows.map((r) => ({ criterion: r[0], weight: pct(r[1]) / 100, descriptors: r.slice(2) })),
    };
  })(),
  integrityHtml: inline((pdGet(/^Rubric/).match(/\*\*Integrity\.\*\*\s*([^\n]+)/) || [])[1] || ''),
  hours: mapRows.find((r) => r.id === 'capstone'),
  refs: sortRefs(refsIn(pdText)),
};
capstone.passMark = (() => { const m = capstone.meta.match(/Pass:\s*(\d+)%/); return m ? Number(m[1]) / 100 : 0.6; })();

// ---------------------------------------------------------------- resources, credentials, self-check, references
const pe = findH(/^Part E —/, 1);
const resourcesHtml = render(stripRules(sectionLines(pe).text), { headingShift: 0 });
const pf = findH(/^Part F —/, 1);
const pfText = sectionLines(pf).text;
const credentials = {
  introHtml: render(stripRules(pfText.split('\n|')[0])),
  table: tableIn(pfText),
};
const pg = findH(/^Part G —/, 1);
const pgSubs = childrenOf(pg, 3);
const selfCheck = pgSubs.map((s) => ({ heading: s.text, html: render(stripRules(sectionLines(s).text)) }));
const g3 = pgSubs.find((s) => /^G3/.test(s.text));
const claims = tableObjects(tableIn(sectionLines(g3).text)).map((c) => ({ claim: c.Claim, source: c.Source, refs: refsIn(c.Source), review: c.Review }));
const g3Text = sectionLines(g3).text;
const verificationNote = plain((g3Text.match(/\*\*Arithmetic and code\.\*\*\s*([^\n]+)/) || [])[1] || '');
const illustrativeNote = plain((g3Text.match(/\*\*Illustrative data\.\*\*\s*([^\n]+)/) || [])[1] || '');
const limitations = sectionLines(pgSubs.find((s) => /^G4/.test(s.text))).text.split('\n').map((l) => l.match(/^\d+\.\s+(.*)$/)).filter(Boolean).map((m) => ({ text: plain(m[1]), html: inline(m[1]) }));
const maintenance = plain(sectionLines(pgSubs.find((s) => /^G5/.test(s.text))).text);

const ph = findH(/^Part H —/, 1);
const references = [];
for (const l of sectionLines(ph).text.split('\n')) {
  const m = l.match(/^-\s+\*\*\[((?:S|R)\d+)\]\*\*\s+(.*)$/);
  if (!m) continue;
  const urls = [...m[2].matchAll(/<(https?:[^>]+)>/g)].map((x) => x[1]);
  references.push({ id: m[1], html: inline(m[2]), text: plain(m[2]), urls });
}
const changelogH = headings.find((h) => /^Change log/.test(h.text));
const changelog = tableObjects(tableIn(sectionLines(changelogH).text));

// ---------------------------------------------------------------- glossary
const glossaryMap = new Map();
function aliasesFor(term) {
  const out = new Set();
  const base = term.replace(/\*/g, '');
  const paren = base.match(/^(.*?)\s*\(([^)]+)\)\s*(.*)$/);
  const variants = [];
  if (paren) {
    variants.push((paren[1] + ' ' + paren[3]).trim());
    // Keep a parenthetical only when it is an abbreviation (CDS, T-bill, DeFi), not a qualifier
    // such as "(flat)" or "(government securities)".
    paren[2].split(/\/|,/).map((x) => x.trim()).filter((x) => /[A-Z]/.test(x) || /\w-\w/.test(x)).forEach((x) => variants.push(x));
  } else variants.push(base);
  for (const v of variants) {
    const parts = v.split(/\s+\/\s+/).map((x) => x.trim());
    // Split "A / B" terms only when every part is an acronym (EBIT / EBITDA). Splitting word pairs
    // such as "Bid / ask" or "Call / put" would link everyday words ("ask", "put") to finance meanings.
    if (parts.length > 1 && !parts.every((p) => /^[A-Z0-9]{2,}$/.test(p))) {
      if (!/\//.test(base)) out.add(v);
      continue;
    }
    for (const p of parts) if (p.length >= 3 || /^[A-Z]{2,}$/.test(p)) out.add(p);
  }
  return [...out].filter((a) => !/\s\/\s/.test(a));
}
for (const m of modules) {
  for (const t of m.terms) {
    const key = t.term.toLowerCase();
    if (!glossaryMap.has(key)) glossaryMap.set(key, { term: t.term, aliases: aliasesFor(t.term), defs: [] });
    glossaryMap.get(key).defs.push({ module: m.id, meaning: t.meaning, html: t.meaningHtml });
  }
}
const glossary = [...glossaryMap.values()].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

// ---------------------------------------------------------------- overlays (authored, validated here)
const overlays = {};
const ovDir = join(OUT, 'overlays');
if (existsSync(ovDir)) {
  for (const f of readdirSync(ovDir).filter((x) => x.endsWith('.json'))) {
    overlays[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(ovDir, f), 'utf8'));
  }
}

// ---------------------------------------------------------------- audit
const issues = [];
const flag = (severity, area, where, message, action) => issues.push({ severity, area, where, message, action });

// Reference integrity
const definedRefs = new Set([...references.map((r) => r.id), ...decisions.map((d) => d.id)]);
const usedRefs = sortRefs(refsIn(raw));
for (const r of usedRefs) if (!definedRefs.has(r)) flag('error', 'references', r, `Code ${r} is used but not defined.`, 'Define it in Part H or A6.');
for (const r of references) {
  if (/wikipedia/i.test(r.text)) flag('warn', 'sources', r.id, `${r.id} cites Wikipedia for a factual claim.`, 'Replace with a primary source (e.g. World Federation of Exchanges statistics or the exchange’s annual report).');
}

// Historical cases that still need a primary source (G3)
const pendingRow = claims.find((c) => /Historical cases/i.test(c.claim));
const historicalCases = [];
if (pendingRow) {
  const list = (pendingRow.claim.match(/\(([^)]+)\)/) || [])[1] || '';
  for (const item of list.split(/,\s*/)) {
    const m = item.match(/^(.*?)\s+(?:from\s+)?(\d{4})$/);
    const name = m ? m[1] : item;
    const year = m ? m[2] : null;
    const first = name.split(/\s+/)[0];
    const keys = { Reserve: ['Reserve Primary Fund'], Barings: ['Barings'], LTCM: ['Long-Term Capital Management'], GameStop: ['GameStop'], SVB: ['Silicon Valley Bank'], Archegos: ['Archegos'], UK: ['gilt', 'LDI'], FTX: ['FTX'], LIBOR: ['LIBOR'], Steinhoff: ['Steinhoff'], Zambia: ['Zambia'], Ghana: ['Ghana'], Thai: ['baht'], Nigeria: ['naira', 'Nigeria'] }[first] || [first];
    const hits = [];
    for (const mod of modules) {
      for (const ex of mod.examples) {
        if (ex.kind !== 'Case') continue;
        if (keys.some((k) => ex.text.includes(k) || ex.title.includes(k))) hits.push({ module: mod.id, example: ex.id, title: ex.title });
      }
    }
    const primary = (overlays.sources?.cases || []).find((c) => c.name === name);
    historicalCases.push({ name, year, appearsIn: hits, primarySource: primary?.primarySource ?? null });
    if (!primary?.primarySource) {
      flag('warn', 'sources', hits.map((h) => `${h.module.toUpperCase()} ${h.example}`).join(', ') || name, `Historical case "${name}${year ? ' ' + year : ''}" has no primary source attached (syllabus G3 requires one before publication).`, 'Attach a regulator, central-bank or court document in web/content/overlays/sources.json.');
    }
  }
}
// Mark the examples so the app can show a "primary source pending" badge
for (const hc of historicalCases) {
  for (const h of hc.appearsIn) {
    const ex = modules.find((m) => m.id === h.module).examples.find((e) => e.id === h.example);
    ex.historical = ex.historical || [];
    ex.historical.push({ name: hc.name, year: hc.year, primarySource: hc.primarySource });
  }
}
// Cases whose only evidence is a benchmark-course outline
for (const m of modules) {
  for (const ex of m.examples) {
    if (ex.kind === 'Case' && ex.refs.length && ex.refs.every((r) => r[0] === 'S')) {
      flag('info', 'sources', `${m.code} ${ex.id}`, `"${ex.title}" is supported only by a benchmark-course outline (${ex.refs.join(', ')}).`, 'Consider adding a primary source for any factual statement in this case.');
    }
  }
}
// Practice items mentioned but not supplied in the syllabus
const itemRe = /\b(six|eight|ten|five|three|15)\b[^.]{0,40}\b(scenarios|descriptions|institutions|investor diaries|diaries)\b/i;
for (const m of modules) {
  for (const ex of m.examples) {
    const hit = ex.text.match(itemRe);
    if (hit || /investor diaries/i.test(ex.text)) flag('info', 'practice-items', `${m.code} ${ex.id}`, `Practice items are described ("${hit ? hit[0] : 'investor diaries'}") but not supplied.`, 'Author the items, cite their basis, and add them to overlays/quiz-items.json.');
  }
  for (const a of m.assessment) {
    const hit = a.text.match(itemRe);
    if (hit) flag('info', 'practice-items', `${m.code} assessment`, `"${a.name}" needs items ("${hit[0]}") that the syllabus does not supply.`, /matching/i.test(a.name)
      ? 'The app builds the matching exercise from the module’s key-term table; review it.'
      : 'Supply the items. Until then the app treats this as a self-assessed task.');
  }
}
// Track B formulas that rely on worksheet ranges
for (const m of modules) {
  for (const ex of m.examples) {
    const ranged = ex.trackB.filter((f) => /\b[A-Z]{1,2}\$?\d+\b|range|…/.test(f));
    if (ranged.length) flag('info', 'track-b', `${m.code} ${ex.id}`, `Track B uses cell ranges (${ranged.join('; ')}); the downloadable workbook lays these out.`, 'Keep the spreadsheet pack layout in sync if the example changes.');
  }
}
// Applied tasks that need live data (offline limitation)
for (const m of modules) {
  for (const a of m.assessment) {
    if (/download|current|official sources|this month|recent|latest|today|find three real/i.test(a.text)) {
      flag('info', 'offline', `${m.code} ${a.name}`, `"${a.name}" needs live external data, so it cannot be completed fully offline.`, 'The app explains this and lets learners mark the task when they are next online.');
    }
  }
}
// Python track consistency
for (const m of modules) {
  const hasCode = m.examples.some((e) => e.code.length);
  if (hasCode && !m.hours.python) flag('info', 'python', m.code, 'Has Track C code but no Python hours in the course map.', 'Confirm whether the snippet is optional enrichment (as labelled) or should carry hours.');
  if (!hasCode && m.hours.python) flag('warn', 'python', m.code, 'Has Python hours but no Track C code.', 'Add a Track C snippet.');
}
// Hours consistency
let coreSum = 0;
let pySum = 0;
for (const m of modules) {
  const row = mapRows.find((r) => r.id === m.id);
  if (m.hours.core !== row.core) flag('error', 'hours', m.code, `Module hours (${m.hours.core}) differ from the course map (${row.core}).`, 'Fix B3 or the module header.');
  if (m.hours.python !== row.python) flag('error', 'hours', m.code, `Python hours (${m.hours.python}) differ from the course map (${row.python}).`, 'Fix B3 or the module header.');
  const split = +(m.hours.learn + m.hours.practise + m.hours.assess).toFixed(2);
  if (split !== m.hours.core) flag('error', 'hours', m.code, `Learn + Practise + Assess (${split}) ≠ core (${m.hours.core}).`, 'Fix the module header.');
  coreSum += m.hours.core;
  pySum += m.hours.python;
}
const cap = mapRows.find((r) => r.id === 'capstone');
const fin = mapRows.find((r) => r.id === 'final');
const tot = mapRows.find((r) => r.id === 'total');
const hoursCheck = { modulesCore: coreSum, capstone: cap.core, final: fin.core, totalCore: coreSum + cap.core + fin.core, statedCore: tot.core, modulesPython: pySum, capstonePython: cap.python, totalPython: pySum + cap.python, statedPython: tot.python };
if (hoursCheck.totalCore !== tot.core) flag('error', 'hours', 'B3', `Core hours add to ${hoursCheck.totalCore}, not ${tot.core}.`, 'Fix B3.');
if (hoursCheck.totalPython !== tot.python) flag('error', 'hours', 'B3', `Python hours add to ${hoursCheck.totalPython}, not ${tot.python}.`, 'Fix B3.');
// Weights
const wSum = assessment.components.reduce((s, c) => s + c.weight, 0);
if (Math.abs(wSum - 1) > 1e-9) flag('error', 'assessment', 'B5', `Weights sum to ${wSum * 100}%.`, 'Fix B5.');
// Template completeness
for (const m of modules) {
  const missing = [];
  if (!m.why) missing.push('why it matters');
  if (!m.objectives.length) missing.push('objectives');
  if (!m.subtopics.length) missing.push('subtopics');
  if (!m.terms.length) missing.push('key terms');
  if (!m.examples.length) missing.push('worked examples/cases');
  if (!m.knowledgeCheck) missing.push('knowledge check');
  if (!m.trace) missing.push('benchmark trace');
  if (m.objectives.some((o) => !o.level)) missing.push('cognitive level tag on an objective');
  if (missing.length) flag('error', 'template', m.code, `Missing: ${missing.join(', ')}.`, 'Complete the module template.');
  if (m.knowledgeCheck && (m.knowledgeCheck.items < assessment.knowledgeCheckSpec.minItems || m.knowledgeCheck.items > assessment.knowledgeCheckSpec.maxItems)) flag('warn', 'assessment', m.code, `Knowledge check has ${m.knowledgeCheck.items} items, outside B5's range.`, 'Align with B5.');
}
// Structural gaps the app must fill (not syllabus errors)
flag('info', 'learn-content', 'All modules', 'The syllabus gives outlines (objectives, subtopics, terms, examples) but no long-form readings or videos for the "Learn" phase.', 'The app presents the syllabus text as the baseline lesson. Long-form readings and captioned videos still need authoring and review against the objectives.');
flag('info', 'item-bank', 'All modules', 'Knowledge-check, checkpoint and final-exam items are specified by count and format but not supplied.', 'The app generates items from key-term tables and worked-example formulas (randomised inputs, ±0.5% tolerance) plus authored items in overlays/quiz-items.json. A subject-matter expert should review them before high-stakes use.');
flag('info', 'rubric', 'Applied tasks', 'B5 says applied tasks are self/peer-assessed "with rubric", but no applied-task rubric is given.', 'The app uses the capstone rubric’s four level bands (Excellent, Proficient, Developing, Insufficient) for self-assessment. Confirm or supply a rubric.');
if (modules.length !== 20) flag('error', 'structure', 'Part C', `Expected 20 modules, found ${modules.length}.`, 'Check headings.');
if (checkpoints.length !== 3) flag('error', 'structure', 'B3', `Expected 3 checkpoints, found ${checkpoints.length}.`, 'Check B3.');
// Claims needing time-bound updates
for (const c of claims) {
  if (/January 2027|After Oct 2027/i.test(c.review)) flag('info', 'review-schedule', c.source, `Time-bound claim: "${plain(c.claim)}" — review: ${c.review}.`, 'Schedule an update; the app shows this review date beside the claim.');
}

// Errata found by recomputation (tests/unit/syllabus-answers.mjs)
for (const e of overlays.errata?.errata || []) {
  if (e.status !== 'open') continue;
  flag('warn', 'errata', `${e.module.toUpperCase()} ${e.example}`, `Syllabus shows ${e.shown}; recomputation gives ${e.correct} (exact ${e.exact}). ${e.note}`, 'Correct the syllabus in the next version, then close the erratum.');
}

// Overlay validation
const exIds = new Set(modules.flatMap((m) => m.examples.map((e) => `${m.id}/${e.id}`)));
const modIds = new Set(modules.map((m) => m.id));
for (const [name, ov] of Object.entries(overlays)) {
  const walk = (o, path) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (o && typeof o === 'object') {
      if (o.module && !modIds.has(o.module)) flag('error', 'overlay', `${name}${path}`, `Unknown module ${o.module}.`, 'Fix overlay.');
      if (o.module && o.example && !exIds.has(`${o.module}/${o.example}`)) flag('error', 'overlay', `${name}${path}`, `Unknown example ${o.module}/${o.example}.`, 'Fix overlay.');
      for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
    }
  };
  walk(ov, '');
}

// ---------------------------------------------------------------- write outputs
mkdirSync(join(OUT, 'modules'), { recursive: true });
const write = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 0) + '\n');
const moduleIndex = modules.map((m) => {
  const json = JSON.stringify(m);
  return {
    id: m.id, code: m.code, n: m.n, title: m.title, part: m.part, hours: m.hours,
    objectives: m.objectives.length, terms: m.terms.length, examples: m.examples.length,
    hasPython: m.examples.some((e) => e.code.length), checkpointAfter: m.checkpointAfter,
    knowledgeCheck: m.knowledgeCheck, why: m.why,
    hash: createHash('sha256').update(json).digest('hex').slice(0, 10),
  };
});
for (const m of modules) write(join(OUT, 'modules', `${m.id}.json`), m);

const course = {
  schema: 1,
  contentVersion: `${fm.version}-${contentHash}`,
  syllabus: { file: SRC.split('/').pop(), code: fm.course_code, version: fm.version, date: fm.date, status: fm.status, title: fm.title, audience: fm.audience, delivery: fm.delivery },
  generatedAt: new Date().toISOString(),
  title: titleH.text, subtitle: subtitleH.text, atAGlance: atAGlance.map((a) => ({ text: plain(a), html: inline(a) })),
  legend,
  descriptionHtml: render(b1),
  parts, modules: moduleIndex, checkpoints, clos, tracks, assessment, capstone, hours: hoursCheck,
  claims, references, decisions: decisions.map((d) => ({ id: d.id, text: d.text })), historicalCases,
  illustrativeNote, limitations,
};
// Heavier reference material is loaded only when the learner opens About, Methodology or Credentials.
const about = {
  contentVersion: course.contentVersion,
  methodology: {
    methodHtml: render(a1, { headingShift: 1 }),
    sources, dataNotes, matrix, findingsHtml: render(a4, { headingShift: 1 }), sequencingHtml: render(a5, { headingShift: 1 }), decisions,
  },
  resourcesHtml, credentials, selfCheck, verificationNote, maintenance, changelog,
};
write(join(OUT, 'course.json'), course);
write(join(OUT, 'about.json'), about);
write(join(OUT, 'glossary.json'), { contentVersion: course.contentVersion, terms: glossary });
const audit = { contentVersion: course.contentVersion, generatedAt: course.generatedAt, counts: {}, hours: hoursCheck, issues };
audit.counts = {
  modules: modules.length, parts: parts.length, checkpoints: checkpoints.length,
  objectives: modules.reduce((s, m) => s + m.objectives.length, 0),
  keyTerms: modules.reduce((s, m) => s + m.terms.length, 0), glossaryEntries: glossary.length,
  workedExamples: modules.reduce((s, m) => s + m.examples.filter((e) => e.kind === 'Worked example').length, 0),
  cases: modules.reduce((s, m) => s + m.examples.filter((e) => e.kind === 'Case').length, 0),
  exercises: modules.reduce((s, m) => s + m.examples.filter((e) => e.kind === 'Exercise').length, 0),
  pythonSnippets: modules.reduce((s, m) => s + m.examples.reduce((t, e) => t + e.code.length, 0), 0),
  trackBFormulas: modules.reduce((s, m) => s + m.examples.reduce((t, e) => t + e.trackB.length, 0), 0),
  references: references.length, decisions: decisions.length, clos: clos.length,
};
write(join(OUT, 'audit.json'), audit);

// Markdown audit report
mkdirSync(DOCS, { recursive: true });
const sevIcon = { error: '❌ error', warn: '⚠️ warning', info: 'ℹ️ info' };
let md = `# Content audit — GCM-101 v${fm.version}\n\n`;
md += `Generated by \`npm run content\` from \`${course.syllabus.file}\` (content version \`${course.contentVersion}\`). Do not edit by hand; this file is regenerated from the syllabus.\n\n`;
md += `## 1. What was extracted\n\n| Item | Count |\n|---|--:|\n`;
for (const [k, v] of Object.entries(audit.counts)) md += `| ${k.replace(/([A-Z])/g, ' $1').toLowerCase()} | ${v} |\n`;
md += `\n**Module structure (per module).**\n\n| Module | Title | Part | Core h (L·P·A) | Python h | Objectives | Key terms | Worked ex. | Cases | Exercises | Python blocks | KC items (≥ numeric) | Source codes |\n|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|\n`;
for (const m of modules) {
  const c = (k) => m.examples.filter((e) => e.kind === k).length;
  md += `| ${m.code} | ${m.title} | ${m.part} | ${m.hours.core} (${m.hours.learn}·${m.hours.practise}·${m.hours.assess}) | ${m.hours.python || '–'} | ${m.objectives.length} | ${m.terms.length} | ${c('Worked example')} | ${c('Case')} | ${c('Exercise')} | ${m.examples.reduce((t, e) => t + e.code.length, 0)} | ${m.knowledgeCheck?.items ?? '–'} (≥ ${m.knowledgeCheck?.numericMin ?? 0}) | ${m.sourceCodes.join(' ')} |\n`;
}
md += `\n## 2. Consistency checks\n\n`;
md += `- Core hours: modules ${hoursCheck.modulesCore} + capstone ${hoursCheck.capstone} + final ${hoursCheck.final} = **${hoursCheck.totalCore}** (stated ${hoursCheck.statedCore}) ${hoursCheck.totalCore === hoursCheck.statedCore ? '✅' : '❌'}\n`;
md += `- Python hours: modules ${hoursCheck.modulesPython} + capstone ${hoursCheck.capstonePython} = **${hoursCheck.totalPython}** (stated ${hoursCheck.statedPython}) ${hoursCheck.totalPython === hoursCheck.statedPython ? '✅' : '❌'}\n`;
md += `- Assessment weights sum to **${Math.round(wSum * 100)}%** ${Math.abs(wSum - 1) < 1e-9 ? '✅' : '❌'}\n`;
md += `- Reference codes used: ${usedRefs.length}; all defined ${usedRefs.every((r) => definedRefs.has(r)) ? '✅' : '❌'}\n`;
md += `- Modules: ${modules.length} in ${parts.length} parts; checkpoints after ${checkpoints.map((c) => c.afterModule.toUpperCase()).join(', ')} ✅\n`;
md += `\n## 3. Flags (gaps and items to act on)\n\n`;
const order = { error: 0, warn: 1, info: 2 };
const byArea = {};
for (const i of [...issues].sort((a, b) => order[a.severity] - order[b.severity])) (byArea[i.area] ||= []).push(i);
const areaNames = { errata: 'Errata found by recomputing the worked examples', sources: 'Sources and evidence', 'practice-items': 'Practice items described but not supplied', 'track-b': 'Track B (spreadsheet) formulas that use worksheet ranges', offline: 'Tasks that need live data (offline limitations)', python: 'Python track', hours: 'Hours', assessment: 'Assessment', template: 'Module template', 'learn-content': 'Learning content', 'item-bank': 'Item banks', rubric: 'Rubrics', 'review-schedule': 'Time-bound claims and review dates', references: 'References', structure: 'Structure', overlay: 'Overlays' };
for (const [area, list] of Object.entries(byArea)) {
  md += `### ${areaNames[area] || area} (${list.length})\n\n| Severity | Where | Finding | Action |\n|---|---|---|---|\n`;
  for (const i of list) md += `| ${sevIcon[i.severity]} | ${i.where} | ${i.message.replace(/\|/g, '\\|')} | ${i.action.replace(/\|/g, '\\|')} |\n`;
  md += '\n';
}
md += `## 4. Historical cases and primary-source status\n\nSyllabus G3 says these cases are "stated only at a general level" and that one primary source must be attached to each case page **before publication**. The app shows a visible *Primary source pending* badge on each case until \`web/content/overlays/sources.json\` supplies one.\n\n| Case | Year | Appears in | Primary source |\n|---|---|---|---|\n`;
for (const h of historicalCases) md += `| ${h.name} | ${h.year ?? ''} | ${h.appearsIn.map((a) => `${a.module.toUpperCase()} ${a.example}`).join(', ') || '—'} | ${h.primarySource ? `[link](${h.primarySource.url})` : '**Pending**'} |\n`;
md += `\n## 5. Claims and review schedule (from G3)\n\n| Claim | Source | Review |\n|---|---|---|\n`;
for (const c of claims) md += `| ${plain(c.claim)} | ${c.source} | ${plain(c.review)} |\n`;
writeFileSync(join(DOCS, 'content-audit.md'), md);

const counts = { error: 0, warn: 0, info: 0 };
issues.forEach((i) => counts[i.severity]++);
console.log(`Extracted ${modules.length} modules, ${glossary.length} glossary entries, ${references.length} references.`);
console.log(`Content version ${course.contentVersion}. Audit: ${counts.error} errors, ${counts.warn} warnings, ${counts.info} info.`);
if (counts.error) {
  for (const i of issues.filter((x) => x.severity === 'error')) console.error(`  ERROR ${i.where}: ${i.message}`);
  process.exitCode = 1;
}
