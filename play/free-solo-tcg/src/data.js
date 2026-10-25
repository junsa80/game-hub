// 카드·규칙 데이터 (로직 없음). 밸런스/카드 추가는 이 파일만 고치면 됩니다.
// 카드 필드: id, name, cost(마나), atk, hp, rarity('common'|'rare'), tag
// tag 효과는 TAGS 참고 (현재 효과가 있는 태그: 수호 = 도발)

export const CARDS = [
  // 기존 8장 (초기 커밋 그대로)
  { id: 'imp', name: '임프', cost: 1, atk: 2, hp: 1, rarity: 'common', tag: '화염' },
  { id: 'golem', name: '골렘', cost: 2, atk: 1, hp: 4, rarity: 'common', tag: '수호' },
  { id: 'wolf', name: '늑대', cost: 2, atk: 3, hp: 1, rarity: 'common', tag: '야생' },
  { id: 'vamp', name: '흡혈', cost: 3, atk: 3, hp: 2, rarity: 'rare', tag: '암흑' },
  { id: 'drake', name: '드레이크', cost: 4, atk: 4, hp: 3, rarity: 'rare', tag: '기계' },
  { id: 'guardian', name: '가디언', cost: 3, atk: 2, hp: 4, rarity: 'common', tag: '수호' },
  { id: 'blaze', name: '폭염', cost: 3, atk: 4, hp: 2, rarity: 'rare', tag: '화염' },
  { id: 'spirit', name: '정령', cost: 1, atk: 1, hp: 2, rarity: 'common', tag: '야생' },
  // GrokBot 추가 4장: 마나 4~6 구간을 채우기 위함
  { id: 'archer', name: '궁수', cost: 2, atk: 2, hp: 2, rarity: 'common', tag: '야생' },
  { id: 'knight', name: '기사', cost: 4, atk: 3, hp: 5, rarity: 'common', tag: '수호' },
  { id: 'ogre', name: '오우거', cost: 5, atk: 5, hp: 5, rarity: 'rare', tag: '야생' },
  { id: 'phoenix', name: '불사조', cost: 6, atk: 6, hp: 5, rarity: 'rare', tag: '화염' }
];

export const TAGS = {
  '화염': { icon: '🔥', color: '#b8432f', text: '' },
  '수호': { icon: '🛡️', color: '#3d6fa8', text: '수호: 상대는 수호 유닛부터 공격해야 합니다.' },
  '야생': { icon: '🐾', color: '#3f8a4a', text: '' },
  '암흑': { icon: '🌑', color: '#5b3f8a', text: '' },
  '기계': { icon: '⚙️', color: '#7a6a45', text: '' }
};

// 중복(보유 상한 초과) 카드 1장당 포인트 — 초기 커밋 값 유지
export const POINT_VALUES = { common: 10, rare: 30 };

// 포인트로 원하는 카드 1장 구매 비용
export const BUY_COST = { common: 30, rare: 90 };

export const RULES = {
  deckSize: 16,       // 덱 장수 (정확히)
  maxCopies: 3,       // 덱·보유 모두 카드당 최대 3장. 보유 3장 초과분은 포인트로 전환
  startHp: 16,       // 폰에서 한 판 5분 안쪽이 되도록 20→16
  startHand: 4,
  handMax: 7,
  maxMana: 6,         // 턴마다 최대 마나 +1 (1→6)
  fieldSlots: 3,
  fatigue: 2,         // 덱이 비었을 때 드로우마다 받는 피해
  packSize: 3,
  rareChance: 0.25,   // 팩 1장이 레어일 확률
  lossPoints: 5,      // 패배해도 받는 위로 포인트
  winPoints: 0
};

// 시작 보유 카드 (18장 → 16장 덱을 고를 여지가 있음)
export const STARTER = {
  imp: 3, golem: 3, wolf: 3, guardian: 3, spirit: 3, archer: 2, vamp: 1
};

// AI 덱: 승수에 따라 단계 상승 (tier = min(floor(wins / 2), 마지막))
export const AI_DECKS = [
  { name: '견습 소환사', deck: { imp: 3, spirit: 3, wolf: 3, golem: 3, archer: 2, guardian: 2 } },
  { name: '숲의 수호자', deck: { imp: 2, spirit: 2, wolf: 3, archer: 3, golem: 2, guardian: 3, knight: 1 } },
  { name: '화염 술사', deck: { imp: 3, wolf: 2, archer: 2, blaze: 3, guardian: 2, drake: 2, knight: 1, phoenix: 1 } },
  { name: '용의 군주', deck: { imp: 2, wolf: 2, golem: 2, blaze: 2, vamp: 2, drake: 2, ogre: 2, phoenix: 2 } }
];
