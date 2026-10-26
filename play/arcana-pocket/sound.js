/* 효과음·배경음. 저장 키와 분리 (arcana-sfx). */
(function (root) {
  var KEY = 'arcana-sfx';
  var on = true;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  var bgm = null;
  var last = {};
  function sfx(name) {
    if (!on || !name) return;
    var now = Date.now();
    if (last[name] && now - last[name] < 45) return;
    last[name] = now;
    try {
      var a = new Audio('sfx/' + name + '.wav');
      a.volume = name === 'click' ? 0.35 : 0.5;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
  function music() {
    if (!on) { if (bgm) bgm.pause(); return; }
    try {
      if (!bgm) { bgm = new Audio('sfx/bgm.wav'); bgm.loop = true; bgm.volume = 0.16; }
      if (bgm.paused) { var p = bgm.play(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }
  function toggle() {
    on = !on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    if (!on && bgm) bgm.pause(); else music();
    return on;
  }
  root.ArcanaSound = { sfx: sfx, music: music, toggle: toggle, enabled: function () { return on; } };
})(window);
