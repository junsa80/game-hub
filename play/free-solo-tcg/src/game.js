// 규칙·로직 (DOM 없음). 카드 수치는 src/data.js 에서만 관리합니다.
// 규칙 요약: 덱 16장, 시작 손패 4, 손패 최대 7, 마나 1→6, 필드 3칸, HP 16,
// 유닛은 소환된 턴에 공격 불가(야생=돌진 예외), 공격은 턴당 1회, 수호 유닛이 있으면 수호부터 공격,
// 화염 유닛 소환 시 상대 영웅 1 피해, 암흑 유닛 공격 시 내 영웅 +1. 주문은 필드 칸을 쓰지 않음.
// 승리 시 팩 1개(3장) + 단계 첫 승·일일 첫 승 보너스 팩, 보유 3장 초과분은 포인트로 전환, 포인트로 카드 구매.
import { CARDS, TAGS, POINT_VALUES, BUY_COST, RULES, STARTER, AI_DECKS, FIRST_WIN_BONUS, DAILY_FIRST_WIN, COLLECTION_BONUS, HARD_DAILY_BONUS } from './data.js';
import { smartTurn } from './smartai.js';

export const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
export const isSpell = id => CARD[id] && CARD[id].type === 'spell';
export const spellTarget = id => (isSpell(id) && CARD[id].target) || null; // 'enemy' | 'ally' | null

// ---------- 난수 (시드 고정 가능: mulberry32) ----------
export function makeRng(seed) {
  let s = seed >>> 0;
  const rng = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.state = () => s;
  return rng;
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const countOf = (list, id) => list.filter(x => x === id).length;
export const expand = (counts) => Object.entries(counts).flatMap(([id, n]) => Array(n).fill(id));

// ---------- 컬렉션 / 덱 ----------
export function newProfile(seed = Date.now()) {
  const collection = { ...STARTER };
  const deck = autoDeck(collection);
  return { collection, deck, points: 0, wins: 0, losses: 0, seed: seed >>> 0, packsOpened: 0,
    pendingPacks: 0, tierFirstWins: AI_DECKS.map(() => false), lastDailyWin: '',
    pickTier: null, settings: { aiStep: true }, collectionRewards: { complete: false, tags: {} },
    records: newRecords(), decks: newDeckSlots(deck), activeDeck: 0 };
}
// v4: 재도전 기록 — 단계별 최고 기록(적은 턴 → 남은 HP 많은 순)·연승(현재/최고, 단계별·전체)·하드 일일 보너스 날짜
export function newRecords() {
  return { streak: 0, bestStreak: 0, hardDaily: '', tiers: AI_DECKS.map(() => ({ wins: 0, streak: 0, bestStreak: 0, best: null })) };
}
// v4: 덱 슬롯. profile.deck = 지금 쓰는 덱(편집 대상), decks[activeDeck].cards 와는 저장·전환 때 맞춤 (syncDeck)
export const deckSlotName = i => `덱 ${i + 1}`;
export function newDeckSlots(first = []) {
  return Array.from({ length: RULES.deckSlots }, (_, i) => ({ name: deckSlotName(i), cards: i === 0 ? [...first] : [] }));
}

export function validateDeck(deck, collection) {
  const errors = [];
  if (deck.length !== RULES.deckSize) errors.push(`덱은 정확히 ${RULES.deckSize}장이어야 합니다 (현재 ${deck.length}장).`);
  for (const id of new Set(deck)) {
    if (!CARD[id]) { errors.push(`알 수 없는 카드: ${id}`); continue; }
    const n = countOf(deck, id);
    if (n > RULES.maxCopies) errors.push(`${CARD[id].name}: 최대 ${RULES.maxCopies}장`);
    if (n > (collection[id] || 0)) errors.push(`${CARD[id].name}: 보유 ${collection[id] || 0}장보다 많음`);
  }
  return { ok: errors.length === 0, errors };
}

// 강한 카드(공+체 대비 비용)부터 채우는 자동 편성
export function autoDeck(collection) {
  const ids = Object.keys(collection).filter(id => CARD[id])
    .sort((a, b) => score(CARD[b]) - score(CARD[a]) || CARD[a].cost - CARD[b].cost);
  const deck = [];
  for (const id of ids) {
    const n = Math.min(collection[id], RULES.maxCopies);
    for (let i = 0; i < n && deck.length < RULES.deckSize; i++) deck.push(id);
  }
  return deck.sort((a, b) => CARD[a].cost - CARD[b].cost);
}
// 주문은 data.js의 power를 공+체 대신 사용. 태그 효과도 약간 가산.
const TAG_SCORE = { '화염': 0.5, '야생': 0.5, '암흑': 0.5 };
const score = c => (c.type === 'spell' ? c.power : c.atk + c.hp) - c.cost * 1.5 + (c.rarity === 'rare' ? 0.5 : 0)
  + (c.type === 'spell' ? 0 : (TAG_SCORE[c.tag] || 0)) + (c.fx && c.fx.summonDraw ? 1.5 * c.fx.summonDraw : 0);

export function syncDeck(profile) {
  if (!Array.isArray(profile.decks) || !profile.decks.length) profile.decks = newDeckSlots(profile.deck || []);
  const i = Number.isInteger(profile.activeDeck) && profile.decks[profile.activeDeck] ? profile.activeDeck : 0;
  profile.activeDeck = i; profile.decks[i].cards = [...(profile.deck || [])];
  return profile;
}
// 슬롯 전환: 지금 덱을 저장하고 다른 슬롯을 불러옴 (빈 슬롯이면 빈 덱 → 편성 화면에서 채우기)
export function switchDeck(profile, i) {
  syncDeck(profile);
  if (!profile.decks[i] || i === profile.activeDeck) return false;
  profile.activeDeck = i; profile.deck = profile.decks[i].cards.filter(id => CARD[id]);
  return true;
}
export const DECK_NAME_MAX = 12;
export function renameDeck(profile, i, name) {
  if (!profile.decks || !profile.decks[i]) return false;
  const n = String(name ?? '').replace(/[\u0000-\u001f<>&"']/g, '').trim().slice(0, DECK_NAME_MAX);
  profile.decks[i].name = n || deckSlotName(i);
  return true;
}

export function canAddToDeck(profile, id) {
  return profile.deck.length < RULES.deckSize && countOf(profile.deck, id) < Math.min(RULES.maxCopies, profile.collection[id] || 0);
}

// ---------- 팩 / 포인트 / 구매 ----------
// 카드를 컬렉션에 넣고, 보유 상한(3) 초과분은 포인트로 전환
export function addCard(profile, id) {
  const have = profile.collection[id] || 0;
  if (have >= RULES.maxCopies) {
    const pts = POINT_VALUES[CARD[id].rarity];
    profile.points += pts;
    return { id, dup: true, points: pts };
  }
  profile.collection[id] = have + 1;
  return { id, dup: false, points: 0 };
}

export function openPack(profile, rng) {
  const commons = CARDS.filter(c => c.rarity === 'common');
  const rares = CARDS.filter(c => c.rarity === 'rare');
  const results = [];
  for (let i = 0; i < RULES.packSize; i++) {
    const pool = rng() < RULES.rareChance ? rares : commons;
    results.push(addCard(profile, pool[Math.floor(rng() * pool.length)].id));
  }
  profile.packsOpened = (profile.packsOpened || 0) + 1;
  const pts = results.reduce((a, r) => a + r.points, 0);
  return { cards: results, points: pts, rewards: checkCollection(profile) };
}

export const buyCost = id => BUY_COST[CARD[id].rarity];
export function canBuy(profile, id) {
  return !!CARD[id] && profile.points >= buyCost(id) && (profile.collection[id] || 0) < RULES.maxCopies;
}
export function buyCard(profile, id) {
  if (!canBuy(profile, id)) return false;
  profile.points -= buyCost(id);
  profile.collection[id] = (profile.collection[id] || 0) + 1;
  profile.lastRewards = checkCollection(profile);
  return true;
}

// 도달(해금)한 최고 단계: 승수 2승마다 +1. 마지막 단계(5단계 하드)는 4단계 첫 승을 해야 열림.
export function aiTier(profile) {
  const last = AI_DECKS.length - 1;
  const cap = (profile.tierFirstWins || [])[last - 1] ? last : last - 1;
  return Math.min(Math.floor(profile.wins / 2), cap);
}
// 이번 대전 상대 단계: 재도전 선택(pickTier)이 해금 범위 안이면 그것, 아니면 최고 단계
export function battleTier(profile) {
  const max = aiTier(profile); const t = profile.pickTier;
  return Number.isInteger(t) && t >= 0 && t <= max ? t : max;
}

// ---------- 도감 보상 ----------
export function collectionStatus(profile) {
  const owned = CARDS.filter(c => (profile.collection[c.id] || 0) > 0).length;
  const tags = {};
  for (const t of Object.keys(TAGS)) {
    const all = CARDS.filter(c => c.tag === t);
    tags[t] = { have: all.filter(c => (profile.collection[c.id] || 0) > 0).length, total: all.length };
  }
  return { owned, total: CARDS.length, tags };
}
// 새로 달성한 도감 보상을 1회 지급하고 목록 반환 (플래그는 profile.collectionRewards에 저장)
export function checkCollection(profile) {
  const cr = profile.collectionRewards = profile.collectionRewards || { complete: false, tags: {} };
  cr.tags = cr.tags || {};
  const st = collectionStatus(profile); const out = [];
  for (const [t, v] of Object.entries(st.tags)) {
    if (!cr.tags[t] && v.total >= COLLECTION_BONUS.tagDistinct && v.have >= COLLECTION_BONUS.tagDistinct) {
      cr.tags[t] = true; profile.points += COLLECTION_BONUS.tagPoints;
      out.push({ kind: 'tag', tag: t, points: COLLECTION_BONUS.tagPoints, packs: 0 });
    }
  }
  if (!cr.complete && st.owned === st.total) {
    cr.complete = true; profile.pendingPacks = (profile.pendingPacks || 0) + COLLECTION_BONUS.complete.packs;
    out.push({ kind: 'complete', packs: COLLECTION_BONUS.complete.packs, points: 0 });
  }
  return out;
}

// 로컬 날짜 문자열 (일일 첫 승 판정용, 기기 시간대 기준)
export function localDay(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export const dailyAvailable = (profile, day = localDay()) => profile.lastDailyWin !== day;
export const tierFirstAvailable = (profile, tier = aiTier(profile)) => !(profile.tierFirstWins || [])[tier];

// 대전 결과 기록. 승리: 기본 팩 1개 + 보너스 팩은 pendingPacks에 쌓임(새로고침해도 유지) → openPack으로 개봉.
// 패배: 위로 포인트. 항복(forfeit)은 위로 포인트 없음 (포인트 파밍 방지).
// tier: 대전 시작 시점의 AI 단계 (승리로 승수가 올라 단계가 바뀌기 전 값)
// info: { turns, hp } = 이긴 판의 턴 수·남은 내 HP (최고 기록용, 없으면 기록 안 함)
export const hardTier = () => AI_DECKS.findIndex(d => d.hard);
export const betterRecord = (a, b) => !b || a.turns < b.turns || (a.turns === b.turns && a.hp > b.hp);
export const hardDailyAvailable = (profile, day = localDay()) => !((profile.records || {}).hardDaily === day);
export function recordResult(profile, won, forfeit = false, tier = battleTier(profile), day = localDay(), info = null) {
  const R = profile.records = profile.records || newRecords();
  while (R.tiers.length < AI_DECKS.length) R.tiers.push({ wins: 0, streak: 0, bestStreak: 0, best: null });
  const T = R.tiers[tier];
  if (won) {
    const r = { points: RULES.winPoints, packs: 1, bonuses: [] };
    if (!Array.isArray(profile.tierFirstWins)) profile.tierFirstWins = AI_DECKS.map(() => false);
    if (!profile.tierFirstWins[tier]) {
      const b = FIRST_WIN_BONUS[tier] || { packs: 0, points: 0 };
      profile.tierFirstWins[tier] = true;
      r.packs += b.packs; r.points += b.points;
      r.bonuses.push({ kind: 'tier', tier, name: AI_DECKS[tier].name, packs: b.packs, points: b.points });
    }
    if (profile.lastDailyWin !== day) {
      profile.lastDailyWin = day;
      r.packs += DAILY_FIRST_WIN.packs;
      r.bonuses.push({ kind: 'daily', packs: DAILY_FIRST_WIN.packs, points: 0 });
    }
    // 하드(5단계) 반복 보상: 로컬 날짜 기준 하루 1회
    if (tier === hardTier() && R.hardDaily !== day) {
      R.hardDaily = day;
      r.packs += HARD_DAILY_BONUS.packs; r.points += HARD_DAILY_BONUS.points;
      r.bonuses.push({ kind: 'hard', tier, packs: HARD_DAILY_BONUS.packs, points: HARD_DAILY_BONUS.points });
    }
    T.wins++; T.streak++; T.bestStreak = Math.max(T.bestStreak, T.streak);
    R.streak++; R.bestStreak = Math.max(R.bestStreak, R.streak);
    let newBest = false; const prevBest = T.best ? { ...T.best } : null;
    if (info && Number.isFinite(info.turns) && Number.isFinite(info.hp)) {
      const rec = { turns: Math.max(1, Math.floor(info.turns)), hp: Math.max(0, Math.floor(info.hp)) };
      if (betterRecord(rec, T.best)) { T.best = rec; newBest = true; }
    }
    r.record = { tier, newBest, prevBest, best: T.best, streak: R.streak, bestStreak: R.bestStreak, tierStreak: T.streak, tierBestStreak: T.bestStreak };
    profile.wins++; profile.points += r.points;
    profile.pendingPacks = (profile.pendingPacks || 0) + r.packs;
    return r;
  }
  const lost = { streak: R.streak, tierStreak: T.streak };
  T.streak = 0; R.streak = 0;
  const pts = forfeit ? 0 : RULES.lossPoints;
  profile.losses++; profile.points += pts;
  return { points: pts, packs: 0, bonuses: [], record: { tier, newBest: false, best: T.best, streak: 0, bestStreak: R.bestStreak, tierStreak: 0, tierBestStreak: T.bestStreak, lostStreak: lost.streak } };
}

// 쌓인 보상 팩 1개 개봉 (없으면 null)
export function openPendingPack(profile, rng) {
  if (!(profile.pendingPacks > 0)) return null;
  profile.pendingPacks--;
  return openPack(profile, rng);
}

// ---------- 대전 ----------
let uidSeq = 1;
function makeSide(deckIds, rng, name) {
  const deck = shuffle([...deckIds], rng);
  return { name, hp: RULES.startHp, maxHp: RULES.startHp, mana: 0, maxMana: 0, deck, hand: deck.splice(0, RULES.startHand), field: Array(RULES.fieldSlots).fill(null), fatigue: 0 };
}

export function newBattle(playerDeck, profile, rng) {
  const ti = battleTier(profile); const tier = AI_DECKS[ti];
  const st = { turn: 0, active: 'p', winner: null, log: [], fx: [], aiName: tier.name, tier: ti,
    p: makeSide(playerDeck, rng, '나'), a: makeSide(expand(tier.deck), rng, tier.name) };
  // 후공 보정: AI 손패 +extraCard장 (기본 1), 단계별 영웅 HP는 hp (기본 RULES.startHp) — data.js AI_DECKS
  st.a.hand.push(...st.a.deck.splice(0, tier.extraCard ?? 1));
  if (tier.hp) { st.a.hp = tier.hp; st.a.maxHp = tier.hp; }
  startTurn(st, 'p');
  return st;
}

const other = s => (s === 'p' ? 'a' : 'p');
function log(st, msg) { st.log.push(msg); if (st.log.length > 30) st.log.shift(); }
// 피해/회복 연출용 이벤트 (UI가 읽고 비움). at: 'hero' | 슬롯 번호
function fx(st, side, at, amount, kind = 'dmg') { if (st.fx) { st.fx.push({ side, at, amount, kind }); if (st.fx.length > 40) st.fx.shift(); } }
// AI 턴 단계별 보기: st.recording이 켜져 있으면 행동마다 화면용 스냅샷(프레임)을 남김. 규칙에는 영향 없음.
export function frame(st) {
  if (!st.recording) return;
  const { frames, recording, ...rest } = st;
  const snap = JSON.parse(JSON.stringify(rest)); snap.fx = st.fx.splice(0);
  st.frames.push(snap);
}
function heroHeal(st, side, n) {
  const S = st[side]; const before = S.hp; S.hp = Math.min(S.maxHp || RULES.startHp, S.hp + n);
  if (S.hp > before) fx(st, side, 'hero', S.hp - before, 'heal');
  return S.hp - before;
}

function draw(st, side) {
  const S = st[side];
  if (!S.deck.length) { S.fatigue += RULES.fatigue; S.hp -= RULES.fatigue; fx(st, side, 'hero', RULES.fatigue); log(st, `${S.name}: 덱이 비어 피해 ${RULES.fatigue}`); checkWin(st); return; }
  const id = S.deck.shift();
  if (S.hand.length < RULES.handMax) S.hand.push(id); else log(st, `${S.name}: 손패가 가득 차 ${CARD[id].name} 버림`);
}

function startTurn(st, side) {
  st.active = side; if (side === 'p') st.turn++;
  const S = st[side];
  S.maxMana = Math.min(S.maxMana + 1, RULES.maxMana); S.mana = S.maxMana;
  for (const u of S.field) if (u) { u.ready = true; u.fresh = false; }
  // 이번 턴 한정 버프(야성의 포효) 해제: 어느 쪽 턴이 시작되든 양쪽 모두 정리
  for (const X of [st.p, st.a]) for (const u of X.field) if (u && u.buff) { u.atk -= u.buff; u.buff = 0; }
  if (!(side === 'p' && st.turn === 1)) draw(st, side);
}

function checkWin(st) {
  if (st.winner) return;
  if (st.a.hp <= 0) st.winner = 'p'; else if (st.p.hp <= 0) st.winner = 'a';
}

export function canPlay(st, side, handIdx) {
  const S = st[side]; const id = S.hand[handIdx];
  if (st.winner || st.active !== side || !id || CARD[id].cost > S.mana) return false;
  if (!isSpell(id)) return S.field.some(f => !f);
  const tg = spellTarget(id);
  return !tg || spellTargets(st, side, id).length > 0;
}
// 대상 지정 주문의 고를 수 있는 슬롯 (수호와 무관하게 아무 유닛)
export function spellTargets(st, side, id) {
  const tg = spellTarget(id); if (!tg) return [];
  const X = tg === 'enemy' ? st[other(side)] : st[side];
  return X.field.map((u, i) => (u ? i : null)).filter(i => i != null);
}

// slot: 유닛이면 놓을 칸, 대상 지정 주문이면 대상 유닛 슬롯
export function playCard(st, side, handIdx, slot) {
  if (!canPlay(st, side, handIdx)) return false;
  const S = st[side], E = st[other(side)];
  const pid = S.hand[handIdx];
  if (spellTarget(pid) && !spellTargets(st, side, pid).includes(slot)) return false;
  const id = S.hand.splice(handIdx, 1)[0]; const c = CARD[id];
  S.mana -= c.cost;
  if (c.type === 'spell') { fx(st, side, 'board', 0, 'spell'); castSpell(st, side, c, slot); checkWin(st); frame(st); return true; }
  if (slot == null || S.field[slot]) slot = S.field.findIndex(f => !f);
  const rush = c.tag === '야생';
  S.field[slot] = { uid: uidSeq++, id, atk: c.atk, hp: c.hp, maxHp: c.hp, ready: rush, fresh: true };
  log(st, `${S.name}: ${c.name} 소환${rush ? ' (🐾돌진)' : ''}`); fx(st, side, slot, 0, 'summon');
  if (c.tag === '화염' && RULES.burnOnSummon) {
    E.hp -= RULES.burnOnSummon; fx(st, other(side), 'hero', RULES.burnOnSummon);
    log(st, `🔥 ${c.name}: ${E.name}에게 ${RULES.burnOnSummon} 피해`);
  }
  if (c.fx && c.fx.summonDraw) { for (let k = 0; k < c.fx.summonDraw && !st.winner; k++) draw(st, side); log(st, `⚙️ ${c.name}: ${c.fx.summonDraw}장 드로우`); }
  else if (c.tag === '기계' && S.hand.length <= RULES.mechDrawHand && S.deck.length) { draw(st, side); log(st, `⚙️ ${c.name} 정비: 1장 드로우`); }
  checkWin(st); frame(st);
  return true;
}

// 주문 효과 (사용 후 사라짐, 필드 칸 사용 안 함)
function castSpell(st, side, c, slot) {
  const S = st[side], E = st[other(side)]; const ef = c.effect || {};
  if (ef.dmgUnit) {
    const u = E.field[slot]; const n = CARD[u.id].name;
    u.hp -= ef.dmgUnit; fx(st, other(side), slot, ef.dmgUnit);
    const dead = u.hp <= 0; if (dead) E.field[slot] = null;
    log(st, `${S.name}: ✨${c.name} → ${n} ${ef.dmgUnit} 피해${dead ? ' (처치)' : ''}`);
  }
  if (ef.buffAtk) {
    const u = S.field[slot];
    u.atk += ef.buffAtk; u.buff = (u.buff || 0) + ef.buffAtk; fx(st, side, slot, ef.buffAtk, 'buff');
    log(st, `${S.name}: ✨${c.name} → ${CARD[u.id].name} 공격력 +${ef.buffAtk} (이번 턴)`);
  }
  if (ef.aoe) {
    let kills = 0;
    E.field.forEach((u, i) => {
      if (!u) return;
      u.hp -= ef.aoe; fx(st, other(side), i, ef.aoe);
      if (u.hp <= 0) { E.field[i] = null; kills++; }
    });
    log(st, `${S.name}: ✨${c.name} — 상대 유닛 전체 ${ef.aoe} 피해${kills ? ` (${kills}기 처치)` : ''}`);
  }
  if (ef.healAll) {
    let total = 0;
    S.field.forEach((u, i) => {
      if (!u) return;
      const h = Math.min(ef.healAll, u.maxHp - u.hp);
      if (h > 0) { u.hp += h; total += h; fx(st, side, i, h, 'heal'); }
    });
    log(st, `${S.name}: ✨${c.name} — 내 유닛 체력 +${total}`);
  }
  if (ef.draw) {
    for (let k = 0; k < ef.draw && !st.winner; k++) draw(st, side);
    log(st, `${S.name}: ✨${c.name} — ${ef.draw}장 드로우`);
  }
}

// AI용: 주문이 지금 쓸 만한가 (플레이어는 언제든 사용 가능)
export function spellValue(st, side, id) {
  const S = st[side], E = st[other(side)]; const ef = CARD[id].effect || {};
  if (ef.aoe) {
    const hit = E.field.filter(Boolean);
    const kills = hit.filter(u => u.hp <= ef.aoe).length;
    const dmg = hit.reduce((a, u) => a + Math.min(u.hp, ef.aoe), 0);
    return kills * 2 + dmg;            // 쓸 만함 기준: 4 이상
  }
  if (ef.healAll) return S.field.reduce((a, u) => a + (u ? Math.min(ef.healAll, u.maxHp - u.hp) : 0), 0); // 3 이상
  if (ef.draw) return S.hand.length <= RULES.handMax - ef.draw - 1 && S.deck.length >= ef.draw ? 4 : 0;
  return 0;
}

const hasTaunt = S => S.field.some(u => u && CARD[u.id].tag === '수호');
// 공격 가능한 대상: 'hero' 또는 슬롯 번호
export function legalTargets(st, side, from) {
  const S = st[side], E = st[other(side)]; const u = S.field[from];
  if (st.winner || st.active !== side || !u || !u.ready) return [];
  const taunt = hasTaunt(E);
  const t = [];
  E.field.forEach((e, i) => { if (e && (!taunt || CARD[e.id].tag === '수호')) t.push(i); });
  // 돌진(야생): 소환한 턴에는 유닛만 공격 (RULES.rushHitsHero로 변경 가능)
  if (!taunt && !(u.fresh && !RULES.rushHitsHero)) t.push('hero');
  return t;
}

export function attack(st, side, from, target) {
  if (!legalTargets(st, side, from).includes(target)) return false;
  const S = st[side], E = st[other(side)]; const u = S.field[from];
  u.ready = false; fx(st, side, from, 0, 'attack');
  const es = other(side), name = CARD[u.id].name;
  if (target === 'hero') { E.hp -= u.atk; fx(st, es, 'hero', u.atk); log(st, `${name} → ${E.name} ${u.atk} 피해`); }
  else {
    const e = E.field[target]; const en = CARD[e.id].name;
    e.hp -= u.atk; u.hp -= e.atk;
    fx(st, es, target, u.atk); if (e.atk > 0) fx(st, side, from, e.atk);
    const dead = [e.hp <= 0 ? en : null, u.hp <= 0 ? name : null].filter(Boolean);
    log(st, `${name} ⚔ ${en}: ${u.atk}↔${e.atk} 피해${dead.length ? ` (${dead.join('·')} 처치)` : ''}`);
    if (e.hp <= 0) E.field[target] = null;
    if (u.hp <= 0) S.field[from] = null;
  }
  if (CARD[u.id].tag === '암흑' && RULES.lifesteal) {
    const h = heroHeal(st, side, RULES.lifesteal);
    if (h) log(st, `🌑 ${name} 흡혈: ${S.name} 체력 +${h}`);
  }
  checkWin(st);
  return true;
}

// 플레이어 턴 종료 → AI 턴 자동 진행 → 플레이어 턴 시작
export function endTurn(st) {
  if (st.winner || st.active !== 'p') return;
  startTurn(st, 'a'); frame(st);
  if (!st.winner) aiBrain(st.tier)(st, 'a');
  if (!st.winner) startTurn(st, 'p');
}

// 상대 AI 선택: data.js AI_DECKS[t].ai === 'smart' 이면 사람 근사 AI(smartai.js), 아니면 기존 규칙 AI
export const aiBrain = t => ((AI_DECKS[t] || {}).ai === 'smart' ? smartTurn : aiTurn);

// ---------- AI (합법적이고 무난한 수) ----------
export function aiTurn(st, side) {
  const S = st[side], E = st[other(side)];
  const castIf = (pred, min) => {
    const idx = S.hand.findIndex((id, i) => isSpell(id) && pred(CARD[id].effect || {}) && canPlay(st, side, i) && spellValue(st, side, id) >= min);
    if (idx >= 0) { playCard(st, side, idx); return true; }
    return false;
  };
  // 0) 광역 주문: 상대 유닛을 충분히 정리할 때만
  castIf(ef => ef.aoe, 4);
  // 0-2) 단일 피해 주문: 처치 가능한 가장 비싼 유닛 (비용 2 이상), 없으면 수호 때문에 막혔을 때 수호 유닛
  aiBolt(st, side);
  // 1) 소환: 낼 수 있는 가장 비싼 유닛부터 (주문 제외)
  for (let guard = 0; guard < 10 && !st.winner; guard++) {
    const idx = S.hand.map((id, i) => i).filter(i => !isSpell(S.hand[i]) && canPlay(st, side, i))
      .sort((x, y) => CARD[S.hand[y]].cost - CARD[S.hand[x]].cost)[0];
    if (idx == null) break;
    playCard(st, side, idx);
  }
  // 1-2) 남은 마나로 드로우 주문 → 새로 뽑은 유닛도 소환
  if (!st.winner && castIf(ef => ef.draw, 1)) {
    for (let guard = 0; guard < 10 && !st.winner; guard++) {
      const idx = S.hand.map((id, i) => i).filter(i => !isSpell(S.hand[i]) && canPlay(st, side, i))
        .sort((x, y) => CARD[S.hand[y]].cost - CARD[S.hand[x]].cost)[0];
      if (idx == null) break;
      playCard(st, side, idx);
    }
  }
  if (st.winner) return;
  // 1-3) 버프 주문: 치명타가 되거나, +2로 새로 잡을 수 있는 유닛이 생길 때
  aiBuff(st, side);
  if (st.winner) return;
  // 2) 공격
  for (let from = 0; from < S.field.length; from++) {
    if (st.winner) break;
    const u = S.field[from]; if (!u) continue;
    const t = legalTargets(st, side, from); if (!t.length) continue;
    const lethal = t.includes('hero') && S.field.reduce((a, x, i) => a + (x && legalTargets(st, side, i).length ? x.atk : 0), 0) >= E.hp;
    let pick = null;
    if (lethal) pick = 'hero';
    else {
      const units = t.filter(x => x !== 'hero');
      // 살아남으며 잡을 수 있는 대상(가치 큰 순) → 맞교환 가치 있는 대상 → 영웅 → 수호 중 체력 낮은 대상
      const good = units.filter(i => E.field[i].hp <= u.atk && E.field[i].atk < u.hp)
        .sort((a, b) => E.field[b].atk - E.field[a].atk)[0];
      const trade = units.filter(i => E.field[i].hp <= u.atk && CARD[E.field[i].id].cost >= CARD[u.id].cost)[0];
      if (good != null) pick = good;
      else if (trade != null) pick = trade;
      else if (t.includes('hero')) pick = 'hero';
      else {
        // 수호에 막혔거나 돌진 중: 잡거나 살아남는 공격만 (헛된 자폭 방지)
        pick = units.filter(i => E.field[i].hp <= u.atk || E.field[i].atk < u.hp)
          .sort((a, b) => E.field[a].hp - E.field[b].hp)[0];
        if (pick == null) continue;
      }
    }
    attack(st, side, from, pick);
    frame(st);
  }
  // 3) 공격 후 다친 유닛이 많으면 회복 주문
  if (!st.winner) castIf(ef => ef.healAll, 3);
}

function aiBolt(st, side) {
  const S = st[side], E = st[other(side)];
  for (let i = 0; i < S.hand.length; i++) {
    const id = S.hand[i]; const ef = isSpell(id) && CARD[id].effect;
    if (!ef || !ef.dmgUnit || !canPlay(st, side, i)) continue;
    const opts = spellTargets(st, side, id).filter(k => E.field[k].hp <= ef.dmgUnit);
    const taunted = E.field.some(u => u && CARD[u.id].tag === '수호');
    const val = k => CARD[E.field[k].id].cost + E.field[k].atk + (taunted && CARD[E.field[k].id].tag === '수호' ? 2 : 0);
    const pick = opts.sort((a, b) => val(b) - val(a))[0];
    if (pick != null && val(pick) >= 4) { playCard(st, side, i, pick); return true; }
  }
  return false;
}

function aiBuff(st, side) {
  const S = st[side], E = st[other(side)];
  const idx = S.hand.findIndex((id, i) => isSpell(id) && (CARD[id].effect || {}).buffAtk && canPlay(st, side, i));
  if (idx < 0) return false;
  const n = CARD[S.hand[idx]].effect.buffAtk;
  const ready = S.field.map((u, i) => i).filter(i => S.field[i] && legalTargets(st, side, i).length);
  if (!ready.length) return false;
  const faceDmg = ready.filter(i => legalTargets(st, side, i).includes('hero')).reduce((a, i) => a + S.field[i].atk, 0);
  const anyFace = ready.find(i => legalTargets(st, side, i).includes('hero'));
  if (anyFace != null && faceDmg < E.hp && faceDmg + n >= E.hp) { playCard(st, side, idx, anyFace); return true; }
  for (const i of ready) {
    const u = S.field[i];
    const newKill = legalTargets(st, side, i).filter(t => t !== 'hero').find(t => {
      const e = E.field[t]; return e.hp > u.atk && e.hp <= u.atk + n && e.atk < u.hp;
    });
    if (newKill != null) { playCard(st, side, idx, i); return true; }
  }
  return false;
}

// 디버그/테스트용: 상대 HP를 0으로 (UI 테스트에서만 사용)
export function debugWin(st) { st.a.hp = 0; checkWin(st); }
