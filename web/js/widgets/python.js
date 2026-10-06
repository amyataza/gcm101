// In-browser Python (Pyodide), loaded lazily and only after the learner agrees to the download.
// The service worker caches the runtime, so after the first run it also works offline.
// If scipy cannot be loaded (offline before it was ever cached), a tiny pure-Python stand-in for
// scipy.optimize.brentq is used and the learner is told.
import { confirmDialog } from '../ui.js';
import * as store from '../store.js';

export const PYODIDE_VERSION = '0.29.3';
const BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
let pyPromise = null;

export async function confirmDownload() {
  const s = await store.settings();
  if (s.pythonAccepted) return true;
  const saveData = navigator.connection?.saveData;
  const ok = await confirmDialog('Download Python for this device?',
    `Running code needs the Python runtime: about 12 MB the first time (plus about 10 MB more for modules that use scipy). It is then saved on this device and works offline.${saveData ? ' Your browser has Data Saver on.' : ''} You can also copy the code into Google Colab instead.`,
    'Download and run', 'Not now');
  if (ok) await store.saveSettings({ pythonAccepted: true });
  return ok;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not download Python. Check your connection.'));
    document.head.append(s);
  });
}
async function getPy(progress) {
  if (!pyPromise) {
    pyPromise = (async () => {
      progress?.('Downloading Python (first time only)…');
      await loadScript(`${BASE}pyodide.js`);
      // eslint-disable-next-line no-undef
      return loadPyodide({ indexURL: BASE });
    })().catch((e) => { pyPromise = null; throw e; });
  }
  return pyPromise;
}

const SHIM = `
import sys, types
def brentq(f, a, b, xtol=2e-12, rtol=8.9e-16, maxiter=200):
    fa, fb = f(a), f(b)
    if fa * fb > 0:
        raise ValueError("f(a) and f(b) must have different signs")
    for _ in range(maxiter):
        m = (a + b) / 2
        fm = f(m)
        if fm == 0 or (b - a) / 2 < xtol:
            return m
        if fa * fm < 0:
            b, fb = m, fm
        else:
            a, fa = m, fm
    return (a + b) / 2
scipy = types.ModuleType("scipy"); optimize = types.ModuleType("scipy.optimize")
optimize.brentq = brentq; scipy.optimize = optimize
sys.modules["scipy"] = scipy; sys.modules["scipy.optimize"] = optimize
`;

export async function run(code, progress) {
  const py = await getPy(progress);
  let notice = '';
  if (/\bimport\s+scipy|from\s+scipy/.test(code)) {
    try {
      progress?.('Loading scipy (first time only)…');
      await py.loadPackagesFromImports(code);
    } catch {
      await py.runPythonAsync(SHIM);
      notice = 'Offline: used a built-in bisection root finder instead of scipy.optimize.brentq. Results match to the precision printed.';
    }
  }
  let stdout = '';
  py.setStdout({ batched: (s) => { stdout += `${s}\n`; } });
  py.setStderr({ batched: (s) => { stdout += `${s}\n`; } });
  progress?.('Running…');
  await py.runPythonAsync(code);
  return { stdout: stdout.trimEnd(), notice };
}

// Same rule as tools/verify_python.py: every printed number must appear in the code's comments,
// as a literal in the code, or in the module's worked-example text (e.g. the futures table).
const NUM = /[-+−]?\d[\d,]*(?:\.\d+)?/g;
const norm = (t) => { let s = t.replace(/,/g, '').replace('−', '-').replace(/^[+-]/, ''); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s || '0'; };
export function compareWithComments(code, stdout, corpus = '') {
  const comments = code.split('\n').filter((l) => l.includes('#')).map((l) => l.split('#').slice(1).join('#')).join(' ');
  const literals = code.split('\n').map((l) => l.split('#')[0]).join(' ');
  const allowed = new Set([...(comments.match(NUM) || []), ...(literals.match(NUM) || []), ...(corpus.match(NUM) || [])].map(norm));
  const printed = (stdout.match(NUM) || []).map(norm);
  const unmatched = [...new Set(printed.filter((p) => !allowed.has(p)))];
  return { ok: unmatched.length === 0 && printed.length > 0, unmatched };
}
