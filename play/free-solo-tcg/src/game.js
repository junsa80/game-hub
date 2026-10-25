// 규칙·로직 (DOM 없음). 카드 수치는 src/data.js 에서만 관리합니다.
// 규칙 요약: 덱 16장, 시작 손패 4, 손패 최대 7, 마나 1→6, 필드 3칸, HP 16,
// 유닛은 소환된 턴에 공격 불가(야생=돌진 예외), 공격은 턴당 1회, 수호 유닛이 있으면 수호부터 공격,
// 화염 유닛 소환 시 상대 영웅 1 피해, 암흑 유닛 공격 시 내 영웅 +1. 주문은 필드 칸을 쓰지 않음.
// 승리 시 팩 1개(3장) + 단계 첫 승·일일 첫 승 보너스 팩, 보유 3장 초과분은 포인트로 전환, 포인트로 카드 구매.
import { CARDS, POINT_VALUES, BUY_COST, RULES, STARTER, AI_DECKS, FIRST_WIN_BONUS, DAILY_FIRST_WIN } from './data.js';

export const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
export const isSpell = id => CARD[id] && CARD[id].type === 'spell';

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
  return { collection, deck: autoDeck(collection), points: 0, wins: 0, losses: 0, seed: seed >>> 0, packsOpened: 0,
    pendingPacks: 0, tierFirstWins: AI_DECKS.map(() => false), lastDailyWin: '' };
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
export function recordResult(profile, won, forfeit = false, tier = aiTier(profile), day = localDay()) {
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
    profile.wins++; profile.points += r.points;
    profile.pendingPacks = (profile.pendingPacks || 0) + r.packs;
    return r;
  }
  const pts = forfeit ? 0 : RULES.lossPoints;
  profile.losses++; profile.points += pts; return { points: pts, packs: 0, bonuses: [] };
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
  const tier = AI_DECKS[aiTier(profile)];
  const st = { turn: 0, active: 'p', winner: null, log: [], fx: [], aiName: tier.name, tier: aiTier(profile),
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
  if (!(side === 'p' && st.turn === 1)) draw(st, side);
}

function checkWin(st) {
  if (st.winner) return;
  if (st.a.hp <= 0) st.winner = 'p'; else if (st.p.hp <= 0) st.winner = 'a';
}

export function canPlay(st, side, handIdx) {
  const S = st[side]; const id = S.hand[handIdx];
  return !st.winner && st.active === side && !!id && CARD[id].cost <= S.mana && (isSpell(id) || S.field.some(f => !f));
}

export function playCard(st, side, handIdx, slot) {
  if (!canPlay(st, side, handIdx)) return false;
  const S = st[side], E = st[other(side)];
  const id = S.hand.splice(handIdx, 1)[0]; const c = CARD[id];
  S.mana -= c.cost;
  if (c.type === 'spell') { castSpell(st, side, c); checkWin(st); return true; }
  if (slot == null || S.field[slot]) slot = S.field.findIndex(f => !f);
  const rush = c.tag === '야생';
  S.field[slot] = { uid: uidSeq++, id, atk: c.atk, hp: c.hp, maxHp: c.hp, ready: rush, fresh: true };
  log(st, `${S.name}: ${c.name} 소환${rush ? ' (🐾돌진)' : ''}`);
  if (c.tag === '화염' && RULES.burnOnSummon) {
    E.hp -= RULES.burnOnSummon; fx(st, other(side), 'hero', RULES.burnOnSummon);
    log(st, `🔥 ${c.name}: ${E.name}에게 ${RULES.burnOnSummon} 피해`);
  }
  if (c.fx && c.fx.summonDraw) { for (let k = 0; k < c.fx.summonDraw && !st.winner; k++) draw(st, side); log(st, `⚙️ ${c.name}: ${c.fx.summonDraw}장 드로우`); }
  checkWin(st);
  return true;
}

// 주문 효과 (사용 후 사라짐, 필드 칸 사용 안 함)
function castSpell(st, side, c) {
  const S = st[side], E = st[other(side)]; const ef = c.effect || {};
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
  u.ready = false;
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
  startTurn(st, 'a');
  if (!st.winner) aiTurn(st, 'a');
  if (!st.winner) startTurn(st, 'p');
}

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
  }
  // 3) 공격 후 다친 유닛이 많으면 회복 주문
  if (!st.winner) castIf(ef => ef.healAll, 3);
}

// 디버그/테스트용: 상대 HP를 0으로 (UI 테스트에서만 사용)
export function debugWin(st) { st.a.hp = 0; checkWin(st); }
