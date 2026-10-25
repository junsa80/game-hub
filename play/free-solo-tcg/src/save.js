// localStorage 저장 (버전 키 + 안전 로드). 키를 바꾸지 말고, 구조가 바뀌면 migrate()에 단계 추가.
import { CARD, newProfile, validateDeck, autoDeck } from './game.js';
import { RULES, STARTER, POINT_VALUES, AI_DECKS } from './data.js';

export const SAVE_KEY = 'freeSoloTcg.save.v1';
// [Grok] 단일 파일판(43441d7)이 쓰던 키. v1 저장이 없으면 여기서 컬렉션·포인트를 가져옴 (원본은 지우지 않음)
export const LEGACY_KEYS = ['fstcg'];
// v2 (GrokBot 2차): pendingPacks(미개봉 보상 팩), tierFirstWins(단계별 첫 승), lastDailyWin(YYYY-MM-DD) 추가.
// 키는 그대로 v1 이름을 씀. v1 저장은 기본값으로 채워 그대로 이어짐.
export const SAVE_VERSION = 2;

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
  p.deck = Array.isArray(raw.deck) ? raw.deck.filter(id => CARD[id]) : [];
  if (!validateDeck(p.deck, p.collection).ok) p.deck = autoDeck(p.collection);
  return p;
}

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  // v1 → v2: 이미 지나온 단계는 첫 승 보너스를 받은 것으로 처리 (소급 지급 없음, 중복 수령 방지).
  //   단계 t(0부터)의 상대는 승수 2t~2t+1에서 만나므로, 승수 ≥ 2t+1이면 그 단계를 이긴 적이 있음.
  if (!(raw.version >= 2)) {
    const wins = Number.isFinite(raw.wins) ? raw.wins : 0;
    raw = { ...raw, version: 2, pendingPacks: 0, lastDailyWin: '',
      tierFirstWins: AI_DECKS.map((_, t) => wins >= 2 * t + 1) };
  }
  return raw;
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
    const raw = migrate(JSON.parse(txt));
    const p = sanitize(raw);
    if (!p) throw new Error('bad save');
    return { profile: p, status: 'loaded' };
  } catch (e) {
    try { storage && storage.setItem(SAVE_KEY + '.broken', storage.getItem(SAVE_KEY) || ''); } catch (_) {}
    return { profile: newProfile(), status: 'reset' };
  }
}

export function saveProfile(p, storage = globalThis.localStorage) {
  try { storage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), ...p })); return true; }
  catch (e) { return false; }
}
