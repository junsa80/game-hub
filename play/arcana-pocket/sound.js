/* 효과음·배경음. 저장 키와 분리 (arcana-sfx). */
(function (root) {
  var KEY = 'arcana-sfx';
  var on = true;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  var bgm = null;
  var last = {};
  var voices = new Set(), pageHidden = false, resumeMusic = false;
  function hidden() { return document.hidden || pageHidden; }
  function pauseAll() {
    if (bgm && !bgm.paused) resumeMusic = on;
    if (bgm) bgm.pause();
    voices.forEach(function (a) { a.pause(); });
    voices.clear();
  }
  function restoreMusic() {
    if (!hidden() && resumeMusic && on) { resumeMusic = false; music(); }
  }
  document.addEventListener('visibilitychange', function () {
    if (hidden()) pauseAll(); else restoreMusic();
  });
  root.addEventListener('pagehide', function () { pageHidden = true; pauseAll(); });
  root.addEventListener('pageshow', function () { pageHidden = false; restoreMusic(); });
  function sfx(name) {
    if (!on || !name || hidden()) return;
    var now = Date.now();
    if (last[name] && now - last[name] < 45) return;
    last[name] = now;
    try {
      var a = new Audio('sfx/' + name + '.wav');
      a.volume = name === 'click' ? 0.35 : 0.5;
      voices.add(a);
      a.addEventListener('ended', function () { voices.delete(a); }, { once: true });
      a.addEventListener('error', function () { voices.delete(a); }, { once: true });
      var p = a.play();
      if (p && p.catch) p.catch(function () { voices.delete(a); });
    } catch (e) {}
  }
  function music() {
    if (hidden()) return;
    if (!on) { if (bgm) bgm.pause(); return; }
    try {
      if (!bgm) { bgm = new Audio('sfx/bgm.wav'); bgm.loop = true; bgm.volume = 0.16; }
      if (bgm.paused) { var p = bgm.play(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }
  function toggle() {
    on = !on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    if (!on) { pauseAll(); resumeMusic = false; } else music();
    return on;
  }
  root.ArcanaSound = { sfx: sfx, music: music, toggle: toggle, enabled: function () { return on; } };
})(window);
