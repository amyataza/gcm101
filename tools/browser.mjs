// Launches Chromium for scripts and tests. Uses Playwright's bundled browser if installed
// (`npx playwright install chromium`); otherwise CHROME_PATH or any cached Playwright Chromium.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export function chromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const base = join(homedir(), 'Library/Caches/ms-playwright');
  const linux = join(homedir(), '.cache/ms-playwright');
  for (const dir of [base, linux]) {
    if (!existsSync(dir)) continue;
    const builds = readdirSync(dir).filter((d) => d.startsWith('chromium-')).sort().reverse();
    for (const b of builds) {
      for (const p of ['chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux/chrome', 'chrome-linux64/chrome']) {
        if (existsSync(join(dir, b, p))) return join(dir, b, p);
      }
    }
  }
  return undefined;
}
export async function launch(opts = {}) {
  try {
    return await chromium.launch(opts);
  } catch (e) {
    const executablePath = chromePath();
    if (!executablePath) throw e;
    return chromium.launch({ ...opts, executablePath });
  }
}
