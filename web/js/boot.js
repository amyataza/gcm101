// Applies saved appearance before first paint (no flash of the wrong theme or text size).
// Classic script on purpose: it must run before the module graph loads.
(function () {
  var r = document.documentElement;
  r.style.fontSize = '17px';
  try {
    var s = JSON.parse(localStorage.getItem('gcm101:appearance') || '{}');
    if (s.theme && s.theme !== 'system') r.dataset.theme = s.theme;
    if (s.textSize) r.style.fontSize = 17 * s.textSize + 'px';
    if (s.font && s.font !== 'sans') r.dataset.font = s.font;
    if (s.spacing === 'loose') r.dataset.spacing = 'loose';
    if (s.motion === 'reduce') r.dataset.motion = 'reduce';
  } catch (e) { /* storage blocked: defaults apply */ }
})();

// Recovery from a version mismatch (old and new files mixed after a deploy). Module link errors
// surface as window errors; we reload once, which fetches a consistent set. If that has already
// happened in the last 30 seconds, we clear this app's caches and service worker, then reload.
(function () {
  var MISMATCH = /export named|binding name|import not found|indirect export|dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload/i;
  function recover() {
    var k = 'gcm101:recover', now = Date.now(), last = 0;
    try { last = Number(sessionStorage.getItem(k)) || 0; sessionStorage.setItem(k, String(now)); } catch (e) { /* ignore */ }
    if (now - last > 30000) { location.reload(); return; }
    var done = function () { location.reload(); };
    try {
      Promise.all([
        window.caches ? caches.keys().then(function (ks) { return Promise.all(ks.filter(function (x) { return x.indexOf('gcm101-shell-') === 0; }).map(function (x) { return caches.delete(x); })); }) : null,
        navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }) : null,
      ]).then(done, done);
    } catch (e) { done(); }
  }
  window.__gcmRecover = recover;
  window.__gcmIsMismatch = function (m) { return MISMATCH.test(String(m || '')); };
  window.addEventListener('error', function (e) { if (MISMATCH.test(e && e.message)) recover(); }, true);
  window.addEventListener('unhandledrejection', function (e) { if (MISMATCH.test(e && e.reason && e.reason.message)) recover(); });
  // If the app never starts (e.g. a script failed to load), offer a way out instead of a blank page.
  setTimeout(function () {
    if (window.__gcmBooted) return;
    var b = document.getElementById('boot');
    if (!b) return;
    b.textContent = 'The course is taking a long time to start. ';
    var btn = document.createElement('button');
    btn.className = 'btn small';
    btn.textContent = 'Reload';
    btn.addEventListener('click', recover);
    b.appendChild(btn);
  }, 15000);
})();
