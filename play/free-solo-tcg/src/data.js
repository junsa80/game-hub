// 카드·규칙 데이터 (로직 없음). 밸런스/카드 추가는 이 파일만 고치면 됩니다.
// 유닛 카드 필드: id, name, cost(마나), atk, hp, rarity('common'|'rare'), tag, (선택) fx
// 주문 카드 필드: type:'spell', effect: { aoe: n | healAll: n | draw: n }, power(자동 편성 점수용 체감 가치), text
// 태그 효과는 유닛에만 적용 (TAGS 참고). fx.summonDraw: 소환 시 카드 n장 드로우.

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
  { id: 'phoenix', name: '불사조', cost: 6, atk: 6, hp: 5, rarity: 'rare', tag: '화염' },
  // GrokBot 2차: 태그 시너지 유닛 5장 (일반 3, 레어 2)
  { id: 'ember', name: '불씨 정령', cost: 2, atk: 2, hp: 2, rarity: 'common', tag: '화염' },
  { id: 'shade', name: '그림자 도적', cost: 2, atk: 2, hp: 3, rarity: 'common', tag: '암흑' },
  { id: 'boar', name: '멧돼지', cost: 3, atk: 3, hp: 3, rarity: 'common', tag: '야생' },
  { id: 'cogknight', kw: '드로우 1', name: '태엽 기사', cost: 4, atk: 3, hp: 4, rarity: 'rare', tag: '기계', fx: { summonDraw: 1 }, text: '소환 시 카드 1장 드로우' },
  { id: 'lich', name: '밤의 군주', cost: 5, atk: 4, hp: 6, rarity: 'rare', tag: '암흑' },
  // GrokBot 2차: 주문 3장 (필드 칸을 쓰지 않고 사용 후 사라짐)
  { id: 'fireblast', kw: '전체 2', name: '화염 폭발', type: 'spell', cost: 3, rarity: 'rare', tag: '화염', effect: { aoe: 2 }, power: 7, text: '상대 유닛 전체에 2 피해' },
  { id: 'mend', kw: '전체 +2', name: '수호 회복', type: 'spell', cost: 2, rarity: 'common', tag: '수호', effect: { healAll: 2 }, power: 4, text: '내 유닛 전체 체력 +2 (최대 체력까지)' },
  { id: 'geardraw', kw: '드로우 2', name: '기계 드로우', type: 'spell', cost: 2, rarity: 'common', tag: '기계', effect: { draw: 2 }, power: 5, text: '카드 2장 드로우' },
  // GrokBot 3차: 대상 지정 주문 2장 (레어 1, 일반 1). target: 'enemy' | 'ally' = 사용 시 유닛 1기를 골라야 함
  { id: 'darkbolt', kw: '단일 4', name: '암흑 화살', type: 'spell', cost: 2, rarity: 'rare', tag: '암흑', target: 'enemy', effect: { dmgUnit: 4 }, power: 6, text: '상대 유닛 1기에 4 피해' },
  { id: 'roar', kw: '공격 +2', name: '야성의 포효', type: 'spell', cost: 2, rarity: 'common', tag: '야생', target: 'ally', effect: { buffAtk: 2 }, power: 3, text: '내 유닛 1기 공격력 +2 (이번 턴)' },
  // Grok 5차: 컨텐츠 추가 — 기계 시너지 강화 + 화염/암흑 다양화 (일반 2, 레어 1, 주문 1)
  { id: 'geargolem', name: '기어 골렘', cost: 3, atk: 2, hp: 5, rarity: 'common', tag: '기계' },
  { id: 'flameling', name: '화염 새끼', cost: 1, atk: 1, hp: 1, rarity: 'common', tag: '화염' },
  { id: 'nightshade', name: '밤그늘 도적', cost: 3, atk: 3, hp: 3, rarity: 'rare', tag: '암흑' },
  { id: 'minorblast', kw: '전체 1', name: '소규모 폭발', type: 'spell', cost: 2, rarity: 'common', tag: '화염', effect: { aoe: 1 }, power: 4, text: '상대 유닛 전체에 1 피해' },
  // 6차(사용자 승인, GrokBot 5차 제안 반영): 1마나 기계 — 손패가 마른 후반에 내면 정비로 1장 보충. 일반 유닛이라 kw/text 없음(태그 kw '정비' 표시)
  { id: 'cogmouse', name: '태엽 쥐', cost: 1, atk: 1, hp: 2, rarity: 'common', tag: '기계' }
];

// 태그 효과 (유닛만). 수치는 RULES의 burnOnSummon / lifesteal 참고. kw = 카드 앞면에 보이는 한 단어 (카드에 kw가 있으면 그것 우선)
export const TAGS = {
  '화염': { kw: '점화', icon: '🔥', color: '#b8432f', text: '화염: 소환 시 상대 영웅에게 1 피해' },
  '수호': { kw: '수호', icon: '🛡️', color: '#3d6fa8', text: '수호: 상대는 수호 유닛부터 공격해야 합니다.' },
  '야생': { kw: '돌진', icon: '🐾', color: '#3f8a4a', text: '야생(돌진): 소환한 턴에도 유닛을 공격할 수 있음' },
  '암흑': { kw: '흡혈', icon: '🌑', color: '#5b3f8a', text: '암흑(흡혈): 공격할 때마다 내 영웅 체력 +1' },
  '기계': { kw: '정비', icon: '⚙️', color: '#7a6a45', text: '기계(정비): 소환 후 손패가 2장 이하면 1장 드로우' }
};

// 중복(보유 상한 초과) 카드 1장당 포인트 — 초기 커밋 값 유지
export const POINT_VALUES = { common: 10, rare: 30 };

// 포인트로 원하는 카드 1장 구매 비용
export const BUY_COST = { common: 30, rare: 90 };

export const RULES = {
  deckSize: 16,       // 덱 장수 (정확히)
  maxCopies: 3,       // 덱·보유 모두 카드당 최대 3장. 보유 3장 초과분은 포인트로 전환
  startHp: 14,        // 20→16(1차)→14(2차, 평균 경기 길이 단축)
  startHand: 4,
  handMax: 7,
  maxMana: 6,         // 턴마다 최대 마나 +1 (1→6)
  fieldSlots: 3,
  fatigue: 2,         // 덱이 비었을 때 드로우마다 받는 피해
  packSize: 3,
  rareChance: 0.25,   // 팩 1장이 레어일 확률
  lossPoints: 5,      // 패배해도 받는 위로 포인트
  winPoints: 0,
  // 태그 효과 수치
  burnOnSummon: 1,    // 화염 유닛 소환 시 상대 영웅 피해
  lifesteal: 1,       // 암흑 유닛 공격 시 내 영웅 회복 (시작 HP를 넘지 않음)
  rushHitsHero: false, // 야생 돌진: 소환한 턴에는 유닛만 공격 (true면 영웅도 가능)
  deckSlots: 3,       // GrokBot 5차: 저장 덱 슬롯 수 (기존 덱 → 슬롯 1)
  mechDrawHand: 2     // 기계(정비): 소환 후 손패가 이 값 이하면 1장 드로우. 카드 고유 fx.summonDraw가 있으면 대신 그것만 적용(중복 없음)
};

// 도감(컬렉션) 보상 — 1회씩. 완성 = CARDS 전체(주문 포함) 각 1장 이상 보유
export const COLLECTION_BONUS = {
  complete: { packs: 1 },
  tagDistinct: 3,     // 같은 태그 카드를 서로 다른 종류로 이만큼 보유하면
  tagPoints: 15       // 태그마다 1회 포인트
};

// 반복 동기 보상
// 단계별 첫 승: 그 단계 상대를 처음 이겼을 때 1회 (index = AI 단계)
export const FIRST_WIN_BONUS = [
  { packs: 1, points: 20 },
  { packs: 1, points: 40 },
  { packs: 1, points: 60 },
  { packs: 2, points: 90 },
  { packs: 2, points: 150 }
];
// 일일 첫 승: 기기 날짜(로컬) 기준 하루 첫 승리에 팩 추가
export const DAILY_FIRST_WIN = { packs: 1 };
// GrokBot 5차: 하드(5단계, AI_DECKS의 hard) 반복 보상 — 로컬 날짜 기준 하루 1회 승리 시 (첫 승 보너스와 별개)
export const HARD_DAILY_BONUS = { packs: 1, points: 30 };
// GrokBot 7차: 단계별 도전 과제 (각 1회, index = AI 단계). underTurns = 이 턴 수 이내 승리, highHp = 남은 내 HP가 이 값 이상으로 승리.
// 목표 도출(HANDOFF "도전 과제"): sim 조건(N=300, 진행 덱)에서 새(사람 근사) AI 승리 판의 턴 하위 25% 값, 남은 HP 상위 25% 값.
export const CHALLENGES = [
  { underTurns: 10, highHp: 11, points: 10 },
  { underTurns: 7, highHp: 13, points: 15 },
  { underTurns: 6, highHp: 12, points: 20 },
  { underTurns: 7, highHp: 13, points: 25 },
  { underTurns: 6, highHp: 6, points: 30 }
];

// 시작 보유 카드 (18장 → 16장 덱을 고를 여지가 있음)
export const STARTER = {
  imp: 3, golem: 3, wolf: 3, guardian: 3, spirit: 3, archer: 2, vamp: 1
};

// AI 덱: 승수에 따라 단계 상승 (tier = min(floor(wins / 2), 마지막))
// 선택 필드: hp(상대 영웅 HP, 기본 RULES.startHp), extraCard(후공 보정 손패, 기본 1)
// 2차 조정(GrokBot): 태그 효과 도입 후 단계2>단계3 역전 해소 — 측정 조건은 HANDOFF.md "난이도 측정" 참고
export const AI_DECKS = [
  { name: '견습 소환사', hp: 13, deck: { imp: 2, spirit: 2, wolf: 2, golem: 2, archer: 3, guardian: 2, geardraw: 2, ember: 1 } },
  // 3차: 시작 덱으로 2단계 진입 완화 — 영웅 HP 14→12, 골렘 1장 → 정령·그림자 도적 (시작 덱 승률 5.0%→약 13%)
  { name: '숲의 수호자', hp: 12, deck: { imp: 3, spirit: 3, wolf: 3, archer: 1, golem: 1, guardian: 3, boar: 1, shade: 1 } },
  // 5차(GrokBot): 기계 유닛 편입(드레이크·기어 골렘) + 새 카드 반영 후 재조정 — 옛/새 시뮬 AI 모두 단조 감소
  { name: '화염 술사', deck: { imp: 3, wolf: 2, guardian: 1, drake: 2, knight: 1, fireblast: 2, boar: 1, geargolem: 1, darkbolt: 1, flameling: 1, phoenix: 1 } },
  { name: '용의 군주', hp: 22, deck: { guardian: 1, knight: 3, drake: 1, phoenix: 3, ogre: 1, geargolem: 2, ember: 1, archer: 1, lich: 1, roar: 1, minorblast: 1 } },
  // 5단계(하드): 4단계 첫 승 후 해금. 큰 수치 대신 화염 견제 + 암흑 흡혈 + 대상 주문 조합
  // GrokBot 5차: ai:'smart' = 사람 근사 AI(src/smartai.js)로 둠 (다른 단계는 기존 규칙 AI)
  { name: '심연의 마녀왕', hard: true, ai: 'smart', hp: 16, deck: { imp: 3, shade: 3, blaze: 3, darkbolt: 1, phoenix: 2, fireblast: 2, knight: 1, geargolem: 1 } }
];
