# Deployment

GCM-101 is a static site: deploy the **`web/`** folder to any host that serves files over HTTPS. There is
no server code, database or environment variable. HTTPS is required for the service worker (offline and
install); `localhost` also works for testing.

## Before every deployment

```bash
npm ci
npm run build          # syllabus → web/content/*.json + docs/content-audit.md; then web/sw-manifest.js
npm test               # must pass: every syllabus answer recomputed, quiz generators, overlays
npm run test:python    # optional locally (needs scipy); run in CI
npm run test:e2e       # optional locally; browser tests incl. offline and installability
```

`npm run content` exits with an error if the syllabus loses structure (for example a module without
key terms or hours that no longer add up). Fix the syllabus, then rebuild.

## Option A — GitHub Pages (free; included workflow)

1. Push the repository to GitHub.
2. *Settings → Pages → Build and deployment → Source: GitHub Actions.*
3. Push to `main`. `.github/workflows/deploy-pages.yml` builds, runs the unit and Python tests, and publishes `web/`.
4. The site appears at `https://<user>.github.io/<repo>/`. All paths in the app are relative, so it works in a sub-folder.

GitHub Pages cannot set custom headers; the Content-Security-Policy is also set in `index.html`, so the
app stays protected.

## Option B — Netlify (free tier)

1. *Add new site → Import from Git* and pick the repository. `netlify.toml` sets the build command and publishes `web/`.
2. `web/_headers` adds security and caching headers (CSP with `frame-ancestors 'none'`, no-cache for the service worker).

Manual alternative: `npm run build`, then drag the `web/` folder onto <https://app.netlify.com/drop>.

## Option C — Cloudflare Pages (free tier)

*Create project → Connect to Git.* Build command `npm ci && npm run build && npm test`; build output
directory `web`. `web/_headers` is applied automatically.

## Option D — any web server (Nginx, Apache, S3 + CDN, a school intranet)

Copy `web/` to the document root. Recommended:

- Serve `.webmanifest` as `application/manifest+json` and `.m4a` as `audio/mp4`.
- Enable gzip or Brotli for `.js`, `.css`, `.json`, `.svg`, `.webmanifest` (the performance figures in docs/testing assume compression).
- Send `Cache-Control: no-cache` for `sw.js` and `sw-manifest.js`; `max-age=0, must-revalidate` for everything else except audio and icons (a week is fine).
- Optionally mirror the headers in `web/_headers`.

Nginx example:

```nginx
location / {
  root /var/www/gcm101/web;
  gzip on; gzip_types text/css application/javascript application/json image/svg+xml application/manifest+json;
  add_header X-Content-Type-Options nosniff;
  add_header Referrer-Policy no-referrer;
  location = /sw.js { add_header Cache-Control "no-cache"; }
  location = /sw-manifest.js { add_header Cache-Control "no-cache"; }
}
types { application/manifest+json webmanifest; audio/mp4 m4a; }
```

## After deploying — smoke test (5 minutes)

1. Open the site on a phone: the welcome screen appears; finish onboarding; Module 0 opens.
2. Browser menu → *Install app* / *Add to Home screen* is offered.
3. Open M0 Learn, then switch on aeroplane mode and reload: the lesson still opens; an un-downloaded module shows "not saved for offline use yet".
4. Settings → *Back up my progress* downloads a file.
5. Open *About → Transparency report*: it lists the open items from `docs/content-audit.md`.

## Updating a live site

- **Content only** (syllabus or overlays changed): `npm run build` and redeploy. Learners receive new content on their next visit (stale-while-revalidate); no "update" prompt is needed.
- **App code changed**: `npm run build` (it regenerates `sw-manifest.js`) and redeploy. Learners see "A new version of the course is ready — Update".
- **Fill in** `web/content/overlays/site.json` (publisher, report link, repository) before the first public release.

## Privacy note for publishers

The app collects nothing. If your host adds analytics or logs by default, either switch them off or
update the in-app privacy page (`web/js/views/about.js → privacy`) so it stays accurate.
