// localStorage 저장 (버전 키 + 안전 로드). 키를 바꾸지 말고, 구조가 바뀌면 migrate()에 단계 추가.
import { CARD, newProfile, validateDeck, autoDeck } from './game.js';
import { RULES, STARTER, POINT_VALUES } from './data.js';

export const SAVE_KEY = 'freeSoloTcg.save.v1';
// [Grok] 단일 파일판(43441d7)이 쓰던 키. v1 저장이 없으면 여기서 컬렉션·포인트를 가져옴 (원본은 지우지 않음)
export const LEGACY_KEYS = ['fstcg'];
export const SAVE_VERSION = 1;

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
  for (const k of ['points', 'wins', 'losses', 'packsOpened']) {
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
  p.deck = Array.isArray(raw.deck) ? raw.deck.filter(id => CARD[id]) : [];
  if (!validateDeck(p.deck, p.collection).ok) p.deck = autoDeck(p.collection);
  return p;
}

function migrate(raw) {
  // v1이 첫 버전. 이후 버전은 여기서 단계별로 변환.
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
