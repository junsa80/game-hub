// 규칙·로직 (DOM 없음). 카드 수치는 src/data.js 에서만 관리합니다.
// 규칙 요약: 덱 16장, 시작 손패 4, 손패 최대 7, 마나 1→6, 필드 3칸, HP 16,
// 유닛은 소환된 턴에 공격 불가, 공격은 턴당 1회, 수호 유닛이 있으면 수호부터 공격,
// 승리 시 팩 3장, 보유 3장 초과분은 포인트로 전환, 포인트로 카드 구매.
import { CARDS, POINT_VALUES, BUY_COST, RULES, STARTER, AI_DECKS } from './data.js';

export const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));

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
  return { collection, deck: autoDeck(collection), points: 0, wins: 0, losses: 0, seed: seed >>> 0, packsOpened: 0 };
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
const score = c => (c.atk + c.hp) - c.cost * 1.5 + (c.rarity === 'rare' ? 0.5 : 0);

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
  return { cards: results, points: results.reduce((a, r) => a + r.points, 0) };
}

export const buyCost = id => BUY_COST[CARD[id].rarity];
export function canBuy(profile, id) {
  return !!CARD[id] && profile.points >= buyCost(id) && (profile.collection[id] || 0) < RULES.maxCopies;
}
export function buyCard(profile, id) {
  if (!canBuy(profile, id)) return false;
  profile.points -= buyCost(id);
  profile.collection[id] = (profile.collection[id] || 0) + 1;
  return true;
}

export function aiTier(profile) { return Math.min(Math.floor(profile.wins / 2), AI_DECKS.length - 1); }

// 대전 결과 기록 (승리: 팩은 별도 openPack, 패배: 위로 포인트)
// 항복(forfeit)은 위로 포인트 없음 (포인트 파밍 방지)
export function recordResult(profile, won, forfeit = false) {
  if (won) { profile.wins++; profile.points += RULES.winPoints; return { points: RULES.winPoints }; }
  const pts = forfeit ? 0 : RULES.lossPoints;
  profile.losses++; profile.points += pts; return { points: pts };
}

// ---------- 대전 ----------
let uidSeq = 1;
function makeSide(deckIds, rng, name) {
  const deck = shuffle([...deckIds], rng);
  return { name, hp: RULES.startHp, mana: 0, maxMana: 0, deck, hand: deck.splice(0, RULES.startHand), field: Array(RULES.fieldSlots).fill(null), fatigue: 0 };
}

export function newBattle(playerDeck, profile, rng) {
  const tier = AI_DECKS[aiTier(profile)];
  const st = { turn: 0, active: 'p', winner: null, log: [], aiName: tier.name,
    p: makeSide(playerDeck, rng, '나'), a: makeSide(expand(tier.deck), rng, tier.name) };
  st.a.hand.push(...st.a.deck.splice(0, 1)); // 후공 보정: AI 1장 더
  startTurn(st, 'p');
  return st;
}

const other = s => (s === 'p' ? 'a' : 'p');
function log(st, msg) { st.log.push(msg); if (st.log.length > 30) st.log.shift(); }

function draw(st, side) {
  const S = st[side];
  if (!S.deck.length) { S.fatigue += RULES.fatigue; S.hp -= RULES.fatigue; log(st, `${S.name}: 덱이 비어 피해 ${RULES.fatigue}`); checkWin(st); return; }
  const id = S.deck.shift();
  if (S.hand.length < RULES.handMax) S.hand.push(id); else log(st, `${S.name}: 손패가 가득 차 ${CARD[id].name} 버림`);
}

function startTurn(st, side) {
  st.active = side; if (side === 'p') st.turn++;
  const S = st[side];
  S.maxMana = Math.min(S.maxMana + 1, RULES.maxMana); S.mana = S.maxMana;
  for (const u of S.field) if (u) u.ready = true;
  if (!(side === 'p' && st.turn === 1)) draw(st, side);
}

function checkWin(st) {
  if (st.winner) return;
  if (st.a.hp <= 0) st.winner = 'p'; else if (st.p.hp <= 0) st.winner = 'a';
}

export function canPlay(st, side, handIdx) {
  const S = st[side]; const id = S.hand[handIdx];
  return !st.winner && st.active === side && !!id && CARD[id].cost <= S.mana && S.field.some(f => !f);
}

export function playCard(st, side, handIdx, slot) {
  if (!canPlay(st, side, handIdx)) return false;
  const S = st[side];
  if (slot == null || S.field[slot]) slot = S.field.findIndex(f => !f);
  const id = S.hand.splice(handIdx, 1)[0]; const c = CARD[id];
  S.mana -= c.cost;
  S.field[slot] = { uid: uidSeq++, id, atk: c.atk, hp: c.hp, maxHp: c.hp, ready: false };
  log(st, `${S.name}: ${c.name} 소환`);
  return true;
}

const hasTaunt = S => S.field.some(u => u && CARD[u.id].tag === '수호');
// 공격 가능한 대상: 'hero' 또는 슬롯 번호
export function legalTargets(st, side, from) {
  const S = st[side], E = st[other(side)]; const u = S.field[from];
  if (st.winner || st.active !== side || !u || !u.ready) return [];
  const taunt = hasTaunt(E);
  const t = [];
  E.field.forEach((e, i) => { if (e && (!taunt || CARD[e.id].tag === '수호')) t.push(i); });
  if (!taunt) t.push('hero');
  return t;
}

export function attack(st, side, from, target) {
  if (!legalTargets(st, side, from).includes(target)) return false;
  const S = st[side], E = st[other(side)]; const u = S.field[from];
  u.ready = false;
  if (target === 'hero') { E.hp -= u.atk; log(st, `${CARD[u.id].name} → ${E.name} ${u.atk} 피해`); }
  else {
    const e = E.field[target];
    e.hp -= u.atk; u.hp -= e.atk;
    log(st, `${CARD[u.id].name} ⚔ ${CARD[e.id].name}`);
    if (e.hp <= 0) E.field[target] = null;
    if (u.hp <= 0) S.field[from] = null;
  }
  checkWin(st);
  return true;
}

// 플레이어 턴 종료 → AI 턴 자동 진행 → 플레이어 턴 시작
export function endTurn(st) {
  if (st.winner || st.active !== 'p') return;
  startTurn(st, 'a');
  if (!st.winner) aiTurn(st, 'a');
  if (!st.winner) startTurn(st, 'p');
}

// ---------- AI (합법적이고 무난한 수) ----------
export function aiTurn(st, side) {
  const S = st[side], E = st[other(side)];
  // 1) 소환: 낼 수 있는 가장 비싼 카드부터
  for (let guard = 0; guard < 10; guard++) {
    const idx = S.hand.map((id, i) => i).filter(i => canPlay(st, side, i))
      .sort((x, y) => CARD[S.hand[y]].cost - CARD[S.hand[x]].cost)[0];
    if (idx == null) break;
    playCard(st, side, idx);
  }
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
      else pick = units.sort((a, b) => E.field[a].hp - E.field[b].hp)[0];
    }
    attack(st, side, from, pick);
  }
}

// 디버그/테스트용: 상대 HP를 0으로 (UI 테스트에서만 사용)
export function debugWin(st) { st.a.hp = 0; checkWin(st); }
