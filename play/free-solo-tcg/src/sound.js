// 효과음·배경음. 게임 저장과 분리 (fstcg-sfx). 파일이 없거나 자동재생이 막혀도 던지지 않는다.
const KEY = 'fstcg-sfx';
let on = true;
try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
let bgm = null;
const last = {};

export function soundOn() { return on; }

export function sfx(name) {
  if (!on || !name) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (last[name] && now - last[name] < 45) return;
  last[name] = now;
  try {
    const a = new Audio('sfx/' + name + '.wav');
    a.volume = name === 'click' ? 0.35 : 0.5;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {}
}

export function music() {
  if (!on) { if (bgm) bgm.pause(); return; }
  try {
    if (!bgm) { bgm = new Audio('sfx/bgm.wav'); bgm.loop = true; bgm.volume = 0.18; }
    if (bgm.paused) { const p = bgm.play(); if (p && p.catch) p.catch(() => {}); }
  } catch (e) {}
}

export function toggleSound() {
  on = !on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
  if (!on && bgm) bgm.pause();
  else music();
  return on;
}
