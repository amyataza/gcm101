// Course rules derived from the syllabus (B3, B5): mastery gating, statuses, time remaining,
// weighted score and completion. Thresholds and weights come from course.json, not from code.

export function passMark(c, key) {
  const comp = c.assessment.components.find((x) => x.key === key);
  if (key === 'knowledgeChecks') return c.assessment.knowledgeCheckSpec.passMark || 0.7;
  if (key === 'checkpoints') return c.assessment.checkpointSpec.passMark || 0.7;
  if (key === 'finalExam') return c.assessment.finalSpec.passMark || 0.7;
  if (key === 'capstone') return c.capstone.passMark || 0.6;
  return comp?.passMark || 0.7;
}

export function moduleStatus(c, p, id) {
  const idx = c.modules.findIndex((m) => m.id === id);
  const st = p.modules[id];
  if (st?.kc?.passed) return 'passed';
  const prev = c.modules[idx - 1];
  const unlocked = idx === 0 || p.modules[prev.id]?.kc?.passed;
  if (!unlocked) return 'locked';
  if (st && (st.learn?.done || st.practise?.done || st.kc?.attempts?.length || st.time > 30)) return 'progress';
  return 'open';
}
export const isUnlocked = (c, p, id) => moduleStatus(c, p, id) !== 'locked';

export function examModules(c, examId) {
  if (examId === 'final') return c.modules;
  const cp = c.checkpoints.find((x) => x.id === examId);
  return c.modules.filter((m) => m.part >= cp.parts[0] && m.part <= cp.parts[1]);
}
export function examUnlocked(c, p, examId) {
  if (examId === 'final') return !!p.modules[c.modules[c.modules.length - 1].id]?.kc?.passed;
  const cp = c.checkpoints.find((x) => x.id === examId);
  return !!p.modules[cp.afterModule]?.kc?.passed;
}
export function examSpec(c, examId) {
  if (examId === 'final') {
    const f = c.assessment.finalSpec;
    return { items: f.items, minutes: f.minutes, passMark: f.passMark, numericShare: f.calculationShare, title: 'Final exam' };
  }
  const s = c.assessment.checkpointSpec;
  const cp = c.checkpoints.find((x) => x.id === examId);
  // B5 gives no conceptual/calculation split for checkpoints; the final exam's split is reused.
  return { items: s.items, minutes: s.minutes, passMark: s.passMark, numericShare: c.assessment.finalSpec.calculationShare, title: cp.title };
}

export function nextModule(c, p) {
  for (const m of c.modules) if (!p.modules[m.id]?.kc?.passed) return m;
  return null;
}

// Hours left: unfinished phases of unfinished modules (+ capstone and final if not done).
export function hoursLeft(c, p) {
  let left = 0;
  for (const m of c.modules) {
    const st = p.modules[m.id];
    if (st?.kc?.passed) continue;
    left += (st?.learn?.done ? 0 : m.hours.learn) + (st?.practise?.done ? 0 : m.hours.practise) + m.hours.assess;
  }
  const cap = c.modules && c.capstone.hours?.core;
  if (!p.capstone?.passed) left += cap || 0;
  if (!p.exams?.final?.passed) left += c.hours.final || 0;
  return left;
}
export function moduleHoursLeft(m, st) {
  if (st?.kc?.passed) return 0;
  return (st?.learn?.done ? 0 : m.hours.learn) + (st?.practise?.done ? 0 : m.hours.practise) + m.hours.assess;
}

// Applied-task self-assessment uses the capstone rubric's four bands (see content audit).
export const APPLIED_LEVELS = [
  { key: 'excellent', label: 'Excellent', score: 0.925 },
  { key: 'proficient', label: 'Proficient', score: 0.77 },
  { key: 'developing', label: 'Developing', score: 0.595 },
  { key: 'insufficient', label: 'Insufficient', score: 0.25 },
];

export function capstoneScore(c, p) {
  const rub = c.capstone.rubric;
  let total = 0;
  let complete = true;
  for (const cr of rub.criteria) {
    const lvl = p.capstone?.rubric?.[cr.criterion];
    const band = APPLIED_LEVELS.find((l) => l.key === lvl);
    if (!band) { complete = false; continue; }
    total += cr.weight * band.score;
  }
  return { score: total, complete };
}

export function weightedScore(c, p) {
  const comps = Object.fromEntries(c.assessment.components.map((x) => [x.key, x.weight]));
  const kcs = c.modules.map((m) => p.modules[m.id]?.kc?.best || 0);
  const { from, to } = c.assessment.appliedTaskModules;
  const appliedMods = c.modules.filter((m) => m.n >= from && m.n <= to);
  const applied = appliedMods.map((m) => {
    const tasks = Object.values(p.modules[m.id]?.applied || {});
    const scored = tasks.filter((t) => t.level && (t.kind === 'applied' || !t.kind));
    if (!scored.length) return 0;
    return scored.reduce((s, t) => s + (APPLIED_LEVELS.find((l) => l.key === t.level)?.score || 0), 0) / scored.length;
  });
  const cps = c.checkpoints.map((cp) => p.exams?.[cp.id]?.best || 0);
  const fin = p.exams?.final?.best || 0;
  const cap = capstoneScore(c, p).score;
  const avg = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
  const parts = [
    { key: 'knowledgeChecks', label: 'Module knowledge checks', weight: comps.knowledgeChecks, score: avg(kcs) },
    { key: 'appliedTasks', label: `Applied tasks (M${from}–M${to}, self-assessed)`, weight: comps.appliedTasks, score: avg(applied) },
    { key: 'checkpoints', label: 'Checkpoint exams 1–3', weight: comps.checkpoints, score: avg(cps) },
    { key: 'finalExam', label: 'Final exam', weight: comps.finalExam, score: fin },
    { key: 'capstone', label: 'Capstone (self/peer rubric)', weight: comps.capstone, score: cap },
  ];
  const overall = parts.reduce((s, x) => s + x.weight * x.score, 0);
  const cpPassed = c.checkpoints.every((cp) => p.exams?.[cp.id]?.passed);
  const finPassed = !!p.exams?.final?.passed;
  const capPassed = cap >= passMark(c, 'capstone') && capstoneScore(c, p).complete;
  const complete = cpPassed && finPassed && capPassed && overall >= 0.7;
  return { parts, overall, complete, cpPassed, finPassed, capPassed };
}

export function modulesPassed(c, p) {
  return c.modules.filter((m) => p.modules[m.id]?.kc?.passed).length;
}
