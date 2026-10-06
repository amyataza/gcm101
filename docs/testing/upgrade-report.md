# Upgrade test

Run 2026-10-06 14:12 UTC with `node tests/e2e/upgrade.mjs`. The server sends `Cache-Control: max-age=600` like GitHub Pages. In each scenario the learner has the old version open, a new version is deployed, they keep navigating (including to screens they have not opened before), reload and accept the update. A pass means no error screens or JavaScript errors at any point and the page ends on the new version.

**3 of 3 passed.**

| Result | Scenario | Ended on | Problems |
|:-:|---|:-:|---|
| ✅ | Service worker: currently deployed version → this version | A | — |
| ✅ | Service worker: this version → next version with a new export | B | — |
| ✅ | No service worker, 10-minute HTTP cache: this version → next version with a new export | B | — |
