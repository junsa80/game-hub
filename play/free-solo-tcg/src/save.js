// localStorage 저장 (버전 키 + 안전 로드). 키를 바꾸지 말고, 구조가 바뀌면 migrate()에 단계 추가.
import { CARD, newProfile, validateDeck, autoDeck, newRecords, newDeckSlots, deckSlotName, syncDeck, DECK_NAME_MAX } from './game.js';
import { RULES, STARTER, POINT_VALUES, AI_DECKS } from './data.js';
import { claimChallenges, emptyChallenges } from './challenges.js';

export const SAVE_KEY = 'freeSoloTcg.save.v1';
// [Grok] 단일 파일판(43441d7)이 쓰던 키. v1 저장이 없으면 여기서 컬렉션·포인트를 가져옴 (원본은 지우지 않음)
export const LEGACY_KEYS = ['fstcg'];
// v2 (GrokBot 2차): pendingPacks(미개봉 보상 팩), tierFirstWins(단계별 첫 승), lastDailyWin(YYYY-MM-DD) 추가.
// 키는 그대로 v1 이름을 씀. v1 저장은 기본값으로 채워 그대로 이어짐.
// v3 (GrokBot 3차): settings{aiStep}, collectionRewards{complete, tags{}}, pickTier(재도전 상대 단계 | null) 추가.
// v4 (GrokBot 5차): records{streak, bestStreak, hardDaily, tiers[{wins, streak, bestStreak, best{turns,hp}|null}]},
//   decks[{name, cards}] (RULES.deckSlots개) + activeDeck. 기존 deck → 슬롯 1. profile.deck은 지금 쓰는 덱으로 계속 유지.
// v5 (GrokBot 7차): records.tiers[t].challenges { turns, hp } (단계별 도전 과제 1회 플래그).
//   v4 이하에서 올라올 때: 저장된 최고 기록(best)이 목표를 이미 증명하면 그 과제를 1회 소급 지급 (loadProfile → retro).
export const SAVE_VERSION = 5;
const nat = (v, d = 0) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : d);

function sanitize(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const base = newProfile(Number(raw.seed) || Date.now());
  const p = { ...base };
  if (raw.collection && typeof raw.collection === 'object') {
    p.collection = {};
    for (const [id, n] of Object.entries(raw.collection)) {
      if (CARD[id] && Number.isFinite(n) && n > 0) p.collection[id] = Math.min(Math.floor(n), RULES.maxCopies);
    }
  }
  for (const k of ['points', 'wins', 'losses', 'packsOpened', 'pendingPacks']) {
    if (Number.isFinite(raw[k]) && raw[k] >= 0) p[k] = Math.floor(raw[k]);
  }
  // 보유 상한 초과분은 포인트로 (이전 판은 상한이 없었음)
  if (raw.collection && typeof raw.collection === 'object') {
    for (const [id, n] of Object.entries(raw.collection)) {
      if (CARD[id] && Number.isFinite(n) && n > RULES.maxCopies) p.points += (Math.floor(n) - RULES.maxCopies) * POINT_VALUES[CARD[id].rarity];
    }
  }
  // 덱을 못 짤 만큼 카드가 적으면 시작 카드로 채움 (진행은 잃지 않음)
  if (Object.values(p.collection).reduce((a, b) => a + b, 0) < RULES.deckSize) {
    for (const [id, n] of Object.entries(STARTER)) p.collection[id] = Math.max(p.collection[id] || 0, n);
  }
  // v2 필드: 단계 첫 승 기록 (배열 길이는 현재 AI 단계 수에 맞춤), 일일 첫 승 날짜
  p.tierFirstWins = AI_DECKS.map((_, t) => Array.isArray(raw.tierFirstWins) ? raw.tierFirstWins[t] === true : false);
  p.lastDailyWin = typeof raw.lastDailyWin === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDailyWin) ? raw.lastDailyWin : '';
  // v3 필드
  const rs = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  p.settings = { aiStep: typeof rs.aiStep === 'boolean' ? rs.aiStep : true };
  const cr = raw.collectionRewards && typeof raw.collectionRewards === 'object' ? raw.collectionRewards : {};
  p.collectionRewards = { complete: cr.complete === true, tags: {} };
  if (cr.tags && typeof cr.tags === 'object') for (const [t, v] of Object.entries(cr.tags)) if (v === true) p.collectionRewards.tags[t] = true;
  p.pickTier = Number.isInteger(raw.pickTier) && raw.pickTier >= 0 && raw.pickTier < AI_DECKS.length ? raw.pickTier : null;
  // v4 필드: 기록·연승
  const rr = raw.records && typeof raw.records === 'object' ? raw.records : {};
  p.records = newRecords();
  p.records.streak = nat(rr.streak); p.records.bestStreak = Math.max(nat(rr.bestStreak), p.records.streak);
  p.records.hardDaily = typeof rr.hardDaily === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rr.hardDaily) ? rr.hardDaily : '';
  p.records.tiers.forEach((T, t) => {
    const x = Array.isArray(rr.tiers) && rr.tiers[t] && typeof rr.tiers[t] === 'object' ? rr.tiers[t] : {};
    T.wins = nat(x.wins); T.streak = nat(x.streak); T.bestStreak = Math.max(nat(x.bestStreak), T.streak);
    const b = x.best;
    T.best = b && Number.isFinite(b.turns) && b.turns >= 1 && Number.isFinite(b.hp) && b.hp >= 0 ? { turns: Math.floor(b.turns), hp: Math.floor(b.hp) } : null;
    const c = x.challenges && typeof x.challenges === 'object' ? x.challenges : {};
    T.challenges = emptyChallenges(); for (const k of Object.keys(T.challenges)) T.challenges[k] = c[k] === true;
  });
  // 덱 슬롯: 저장된 슬롯이 없으면(v3 이하) 기존 deck을 슬롯 1로
  const legacyDeck = Array.isArray(raw.deck) ? raw.deck.filter(id => CARD[id]) : [];
  p.decks = newDeckSlots();
  p.decks.forEach((d, i) => {
    const x = Array.isArray(raw.decks) ? raw.decks[i] : null;
    if (x && typeof x === 'object') {
      d.name = typeof x.name === 'string' && x.name.trim() ? x.name.trim().slice(0, DECK_NAME_MAX) : deckSlotName(i);
      d.cards = Array.isArray(x.cards) ? x.cards.filter(id => CARD[id]).slice(0, RULES.deckSize) : [];
    }
  });
  p.activeDeck = Number.isInteger(raw.activeDeck) && raw.activeDeck >= 0 && raw.activeDeck < p.decks.length ? raw.activeDeck : 0;
  // 지금 덱 = 저장된 deck(편집 중 최신본). 없으면 활성 슬롯 내용
  p.deck = Array.isArray(raw.deck) ? legacyDeck : p.decks[p.activeDeck].cards.slice();
  if (!Array.isArray(raw.decks)) p.decks[0].cards = legacyDeck.slice();
  // 슬롯 1(또는 v3 이하)의 덱이 깨졌으면 자동 편성. 다른 슬롯은 편집 중일 수 있으니 그대로 둠 (편성 화면에서 채움, 대전은 막힘)
  if (!validateDeck(p.deck, p.collection).ok && p.activeDeck === 0) p.deck = autoDeck(p.collection);
  syncDeck(p);
  return p;
}

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  // v1 → v2: 이미 지나온 단계는 첫 승 보너스를 받은 것으로 처리 (소급 지급 없음, 중복 수령 방지).
  //   단계 t(0부터)의 상대는 승수 2t~2t+1에서 만나므로, 승수 ≥ 2t+1이면 그 단계를 이긴 적이 있음.
  if (!(raw.version >= 2)) {
    const wins = Number.isFinite(raw.wins) ? raw.wins : 0;
    raw = { ...raw, version: 2, pendingPacks: 0, lastDailyWin: '',
      tierFirstWins: AI_DECKS.map((_, t) => wins >= 2 * t + 1 && t < 4) }; // v1엔 5단계가 없었음
  }
  // v2 → v3: 설정 기본값, 도감 보상은 플래그 없이 시작 → 다음 checkCollection()에서 조건 충족분 1회 지급
  if (raw.version < 3) raw = { ...raw, version: 3, settings: { aiStep: true }, collectionRewards: { complete: false, tags: {} }, pickTier: null };
  // v3 → v4: 기록은 0부터 (과거 판은 턴 수를 몰라 소급 없음), 기존 덱 → 슬롯 1 (sanitize에서 decks 없으면 처리)
  if (raw.version < 4) { const { decks, activeDeck, records, ...rest } = raw; raw = { ...rest, version: 4 }; }
  // v4 → v5: 도전 과제 플래그 없음으로 시작 (소급 지급은 loadProfile에서 sanitize 후 retroChallenges)
  if (raw.version < 5) raw = { ...raw, version: 5 };
  return raw;
}

// v4 이하 저장: 단계별 최고 기록이 이미 목표를 만족하면 그 과제를 1회 지급 (포인트 가산, 목록 반환)
export function retroChallenges(p) {
  const out = [];
  p.records.tiers.forEach((T, t) => { if (T.best) out.push(...claimChallenges(T, t, T.best)); });
  p.points += out.reduce((a, c) => a + c.points, 0);
  return out;
}

export function loadProfile(storage = globalThis.localStorage) {
  try {
    const txt = storage && storage.getItem(SAVE_KEY);
    if (!txt) {
      for (const k of LEGACY_KEYS) {
        let legacy = null; try { legacy = JSON.parse(storage.getItem(k) || 'null'); } catch (_) {}
        if (legacy && legacy.collection) {
          const p = sanitize({ collection: legacy.collection, points: legacy.points, deck: [] });
          if (p) { saveProfile(p, storage); return { profile: p, status: 'migrated' }; }
        }
      }
      return { profile: newProfile(), status: 'new' };
    }
    const parsed = JSON.parse(txt);
    const fromV = parsed && typeof parsed === 'object' ? parsed.version : undefined;
    const p = sanitize(migrate(parsed));
    if (!p) throw new Error('bad save');
    const retro = fromV >= 5 ? [] : retroChallenges(p);
    return { profile: p, status: 'loaded', retro };
  } catch (e) {
    try { storage && storage.setItem(SAVE_KEY + '.broken', storage.getItem(SAVE_KEY) || ''); } catch (_) {}
    return { profile: newProfile(), status: 'reset' };
  }
}

export function saveProfile(p, storage = globalThis.localStorage) {
  try { syncDeck(p); storage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), ...p })); return true; }
  catch (e) { return false; }
}
