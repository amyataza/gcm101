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
