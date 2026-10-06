# Dead-end crawl

Run 2026-10-06 with `node tests/e2e/crawl.mjs`. Starting at the course map, every in-app link on every reachable page was followed, as a new learner (429 pages) and as a learner who has passed every module (448 pages); 207 distinct routes in total.

Checked on each page: it renders a heading; no error or not-found view; any `?at=` anchor exists; there is at least one link or button to continue; no link without a destination; no JavaScript error.

**No dead ends found.**
