// 카드 그림 (GrokBot 5차): 카드마다 가벼운 인라인 SVG 문양. 사람·캐릭터 얼굴 없이 상징(사물·무늬·실루엣)만.
// 구조: 태그별 배경 무늬(TAG_BG) + 카드별 문양(ART[id].d) + 카드별 강조색(ART[id].a). viewBox 0 0 48 32.
// 클래스: m = 밝은 주색, a = 강조색(--a), k = 어두운 선. 새 카드는 여기 한 줄만 추가 (없으면 태그 아이콘 문양으로 대체).
export const TAG_BG = {
  '화염': '<path class="bg" d="M0 32 8 20 12 26 18 14 24 24 30 12 36 24 42 16 48 26V32z"/>',
  '수호': '<path class="bg" d="M8 4l6 3.5v7L8 18l-6-3.5v-7zM24 4l6 3.5v7L24 18l-6-3.5v-7zM40 4l6 3.5v7L40 18l-6-3.5v-7zM16 18l6 3.5v7L16 32l-6-3.5v-7zM32 18l6 3.5v7L32 32l-6-3.5v-7z"/>',
  '야생': '<path class="bg" d="M4 30c4-8 10-10 14-10-2 6-8 10-14 10zM44 30c-4-8-10-10-14-10 2 6 8 10 14 10zM24 2c3 4 3 8 0 12-3-4-3-8 0-12z"/>',
  '암흑': '<circle class="bg" cx="6" cy="6" r="1.2"/><circle class="bg" cx="40" cy="4" r="1"/><circle class="bg" cx="44" cy="20" r="1.4"/><circle class="bg" cx="4" cy="24" r="1"/><circle class="bg" cx="16" cy="28" r=".9"/><circle class="bg" cx="34" cy="29" r="1.1"/>',
  '기계': '<path class="bg" d="M0 8h48M0 24h48M12 0v32M36 0v32" stroke-width="1.2"/><circle class="bg" cx="12" cy="8" r="1.6"/><circle class="bg" cx="36" cy="24" r="1.6"/>',
  spell: '<path class="bg" d="M24 16 0 4V0h6zM24 16 48 4V0h-6zM24 16 0 28v4h6zM24 16l24 12v4h-6z"/>'
};
const gear = (cx, cy, r, cls = 'm') => {
  let d = ''; for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; d += `M${(cx + Math.cos(t) * r * 1.35).toFixed(1)} ${(cy + Math.sin(t) * r * 1.35).toFixed(1)}L${(cx + Math.cos(t) * r * .8).toFixed(1)} ${(cy + Math.sin(t) * r * .8).toFixed(1)}`; }
  return `<path class="k" d="${d}" stroke-width="${(r * .55).toFixed(1)}" stroke-linecap="round"/><circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/><circle class="k" cx="${cx}" cy="${cy}" r="${(r * .4).toFixed(1)}"/>`;
};
const flame = (x, y, s, cls = 'm') => `<path class="${cls}" transform="translate(${x} ${y}) scale(${s})" d="M0-10c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 2-8 2 1 3 3 3 5 1-2 1-5 1-8z"/>`;
export const ART = {
  imp: { a: '#ffcf5a', d: flame(24, 18, 1.1) + '<path class="a" d="M17 9l2 5-3-1zM31 9l-2 5 3-1z"/>' },
  golem: { a: '#b9c4d6', d: '<rect class="m" x="15" y="18" width="18" height="9" rx="2"/><rect class="a" x="18" y="9" width="12" height="9" rx="2"/><rect class="k" x="21" y="12" width="2" height="2"/><rect class="k" x="25" y="12" width="2" height="2"/>' },
  wolf: { a: '#e8f1ff', d: '<path class="m" d="M14 6l6 6h8l6-6 1 11-5 8-6 3-6-3-5-8z"/><path class="k" d="M19 16h3M26 16h3M22 23l2 2 2-2"/><path class="a" d="M16 9l3 3M32 9l-3 3"/>' },
  vamp: { a: '#ff6b8a', d: '<path class="m" d="M24 12c-4-6-12-6-18-2 4 1 5 4 5 7 3-2 6-1 8 2 2-1 3-4 5-7zM24 12c4-6 12-6 18-2-4 1-5 4-5 7-3-2-6-1-8 2-2-1-3-4-5-7z"/><circle class="a" cx="24" cy="15" r="3"/>' },
  drake: { a: '#ffd166', d: '<path class="m" d="M6 22C12 10 22 6 34 8l-6 4 8 1-7 4 6 2c-8 4-18 5-29 3z"/>' + gear(36, 22, 4, 'a') },
  guardian: { a: '#ffd166', d: '<path class="m" d="M24 4l11 4v8c0 7-5 11-11 13-6-2-11-6-11-13V8z"/><path class="a" d="M22 9h4v6h5v4h-5v6h-4v-6h-5v-4h5z"/>' },
  blaze: { a: '#ffe27a', d: flame(19, 20, 1.15) + flame(29, 18, 1.35, 'a') },
  spirit: { a: '#c7ffb8', d: '<path class="m" d="M24 4c8 6 8 16 0 24-8-8-8-18 0-24z"/><path class="k" d="M24 8v18" stroke-width="1.2"/><circle class="a" cx="12" cy="10" r="2.5"/><circle class="a" cx="36" cy="22" r="2"/><circle class="a" cx="35" cy="9" r="1.5"/>' },
  archer: { a: '#ffd166', d: '<path class="k" d="M14 4c10 6 10 18 0 24" fill="none" stroke-width="3"/><path class="m" d="M14 4c10 6 10 18 0 24" fill="none" stroke-width="1.6"/><path class="m" d="M14 4v24" stroke-width=".8"/><path class="a" d="M12 16h24M36 16l-5-3v6z" stroke-width="1.6"/>' },
  knight: { a: '#9fd0ff', d: '<path class="m" d="M15 26V14c0-6 4-10 9-10s9 4 9 10v12z"/><path class="k" d="M18 14h12v3H18zM23 18h2v6h-2z"/><path class="a" d="M24 4c3-3 7-3 9-1-3 0-5 1-6 3z"/>' },
  ogre: { a: '#c98a4b', d: '<path class="a" d="M10 26l14-14 3 3-14 14z"/><path class="m" d="M22 6c5-2 10 1 11 6s-3 8-6 9l-6-6c-1-3-1-7 1-9z"/><circle class="k" cx="27" cy="9" r="1.2"/><circle class="k" cx="30" cy="14" r="1.2"/>' },
  phoenix: { a: '#ffe27a', d: '<path class="m" d="M24 12C18 4 8 4 4 8c6 0 10 4 12 8-4 0-6 2-7 4 6-1 10 0 15 4 5-4 9-5 15-4-1-2-3-4-7-4 2-4 6-8 12-8-4-4-14-4-20 4z"/><path class="a" d="M24 24l-3 6h6z"/><circle class="a" cx="24" cy="12" r="2.4"/>' },
  ember: { a: '#ffe27a', d: '<circle class="m" cx="24" cy="16" r="6"/><circle class="a" cx="24" cy="16" r="2.8"/><path class="m" d="M24 2v6M24 24v6M10 16h6M32 16h6M14 6l4 4M34 6l-4 4M14 26l4-4M34 26l-4-4" stroke-width="2"/>' },
  shade: { a: '#c9b6ff', d: '<path class="m" d="M13 27l16-18 3 1-1 3-16 17z"/><path class="a" d="M35 27L19 9l-3 1 1 3 16 17z"/><path class="k" d="M12 24l4 4M36 24l-4 4" stroke-width="2"/>' },
  boar: { a: '#fff3c4', d: '<path class="m" d="M10 20c0-8 6-12 14-12s14 4 14 12c0 4-4 7-14 7s-14-3-14-7z"/><ellipse class="k" cx="24" cy="20" rx="5" ry="3.5"/><path class="a" d="M17 22c-3 0-5-3-5-6 2 2 4 3 6 3zM31 22c3 0 5-3 5-6-2 2-4 3-6 3z"/>' },
  cogknight: { a: '#9fd0ff', d: gear(18, 18, 6) + '<path class="a" d="M33 4l2 2-1 16h-2l-1-16zM29 22h8v2h-8zM32 24h2v5h-2z"/>' },
  lich: { a: '#ffd166', d: '<path class="m" d="M30 4a12 12 0 1 0 6 22 10 10 0 0 1-6-22z"/><path class="a" d="M12 12l3-6 3 4 3-6 3 6 3-4 3 6z"/>' },
  fireblast: { a: '#ffe27a', d: '<path class="m" d="M24 2l4 8 9-3-4 8 9 3-9 3 4 8-9-3-4 8-4-8-9 3 4-8-9-3 9-3-4-8 9 3z"/><circle class="a" cx="24" cy="16" r="5"/>' },
  mend: { a: '#b6ffcf', d: '<path class="m" d="M24 28C14 21 9 16 9 11a6 6 0 0 1 15-2 6 6 0 0 1 15 2c0 5-5 10-15 17z"/><path class="a" d="M22 10h4v4h4v4h-4v4h-4v-4h-4v-4h4z"/>' },
  geardraw: { a: '#ffd166', d: '<rect class="m" x="10" y="6" width="13" height="19" rx="2" transform="rotate(-12 16 15)"/><rect class="a" x="20" y="6" width="13" height="19" rx="2" transform="rotate(10 26 15)"/>' + gear(35, 23, 3.5) },
  darkbolt: { a: '#e0c8ff', d: '<path class="m" d="M8 26L32 8l-2 6 8-2-24 16 3-6z"/><circle class="a" cx="38" cy="7" r="3"/>' },
  roar: { a: '#fff3c4', d: '<circle class="m" cx="12" cy="16" r="5"/><path class="a" d="M20 9a10 10 0 0 1 0 14M26 5a16 16 0 0 1 0 22M32 2a21 21 0 0 1 0 28" fill="none" stroke-width="2.4" stroke-linecap="round"/>' },
  geargolem: { a: '#ffd166', d: '<rect class="m" x="12" y="8" width="24" height="20" rx="3"/>' + gear(24, 18, 5, 'a') + '<rect class="k" x="16" y="4" width="16" height="4" rx="1"/>' },
  flameling: { a: '#ffe27a', d: flame(24, 20, .9) + '<circle class="a" cx="15" cy="11" r="1.6"/><circle class="a" cx="33" cy="9" r="1.2"/>' },
  nightshade: { a: '#c9b6ff', d: '<path class="m" d="M24 3c7 3 10 9 10 16 0 4-2 8-4 10H18c-2-2-4-6-4-10 0-7 3-13 10-16z"/><path class="k" d="M18 17c2-2 4-2 6 0 2-2 4-2 6 0-2 3-10 3-12 0z"/><path class="a" d="M24 22l1.5 5h-3z"/>' },
  minorblast: { a: '#ffe27a', d: '<path class="m" d="M24 6l3 6 6-2-2 6 6 3-6 2 2 6-6-2-3 6-3-6-6 2 2-6-6-2 6-3-2-6 6 2z"/><circle class="a" cx="24" cy="17" r="3"/>' },
  cogmouse: { a: '#ffd166', d: '<path class="m" d="M10 24c0-7 6-11 13-11s11 4 13 9c-6 3-18 4-26 2z"/><circle class="m" cx="17" cy="12" r="3.5"/><circle class="m" cx="25" cy="11" r="3.5"/><circle class="k" cx="13" cy="20" r="1.2"/>' + gear(38, 13, 3, 'a') + '<path class="k" d="M36 22c3 1 6 0 7-3" fill="none" stroke-width="1.4"/>' }
};
export function artSVG(id, tag, spell, fallback = '') {
  const A = ART[id];
  return `<svg class="artsvg" viewBox="0 0 48 32" aria-hidden="true" style="--a:${A ? A.a : '#fff'}">${TAG_BG[spell ? 'spell' : tag] || ''}${A ? A.d : fallback}</svg>`;
}
