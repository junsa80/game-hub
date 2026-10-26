// 덱 코드 (GrokBot 6차): 덱 ↔ 짧은 문자열. DOM 없음.
// 형식: "FST1-" + base64url(본문) + "-" + 체크섬(base36 4자리)
//   본문 = 카드 id + 장수(1~3)를 이어 붙인 글자 (id 알파벳순), 예) "golem3imp3spirit3wolf3archer2guardian2"
//   체크섬 = 본문의 FNV-1a 32비트 해시 % 36^4. 버전(FST1)이 바뀌면 decode에 분기 추가.
// 카드 id는 data.js 순서와 무관 → 카드가 추가·재정렬돼도 기존 코드가 깨지지 않음.
import { CARD } from './game.js';
import { RULES } from './data.js';

export const CODE_PREFIX = 'FST1-';
const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const checksum = s => (fnv(s) % 1679616).toString(36).padStart(4, '0');
const b64u = s => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
const name = id => (CARD[id] ? CARD[id].name : id);

export function encodeDeck(cards) {
  const counts = {}; for (const id of cards) counts[id] = (counts[id] || 0) + 1;
  const body = Object.keys(counts).sort().map(id => id + counts[id]).join('');
  return CODE_PREFIX + b64u(body) + '-' + checksum(body);
}

// 형식·체크섬·카드 검사. 반환 { ok, cards, errors[] } — errors는 사용자에게 그대로 보여 줄 한국어 문장
export function decodeDeck(code) {
  const raw = String(code ?? '').replace(/\s+/g, '');
  if (!raw) return { ok: false, cards: [], errors: ['덱 코드를 붙여 넣어 주세요.'] };
  const m = /^FST(\d+)-([A-Za-z0-9_-]+)-([0-9a-z]{4})$/i.exec(raw);
  if (!m) return { ok: false, cards: [], errors: ['덱 코드 형식이 아니에요. "FST1-"로 시작하는 코드를 통째로 붙여 넣어 주세요.'] };
  if (m[1] !== '1') return { ok: false, cards: [], errors: [`지원하지 않는 코드 버전이에요 (FST${m[1]}). 게임을 새로고침해 최신 버전으로 열어 주세요.`] };
  let body; try { body = unb64u(m[2]); } catch (e) { return { ok: false, cards: [], errors: ['덱 코드가 손상됐어요 (글자가 빠졌거나 바뀜).'] }; }
  if (checksum(body) !== m[3].toLowerCase()) return { ok: false, cards: [], errors: ['덱 코드가 손상됐어요 (확인 글자 불일치). 코드를 다시 복사해 주세요.'] };
  const parts = body.match(/[a-z]+\d+/g) || [];
  if (parts.join('') !== body) return { ok: false, cards: [], errors: ['덱 코드 내용을 읽을 수 없어요.'] };
  const errors = []; const cards = []; const seen = new Set();
  for (const p of parts) {
    const [, id, nStr] = /^([a-z]+)(\d+)$/.exec(p); const n = Number(nStr);
    if (seen.has(id)) { errors.push(`같은 카드가 두 번 적혀 있어요: ${name(id)}`); continue; }
    seen.add(id);
    if (!CARD[id]) { errors.push(`모르는 카드가 있어요: ${id} (다른 버전에서 만든 코드일 수 있어요)`); continue; }
    if (n < 1 || n > RULES.maxCopies) { errors.push(`${name(id)} ${n}장: 카드당 최대 ${RULES.maxCopies}장이에요.`); continue; }
    for (let k = 0; k < n; k++) cards.push(id);
  }
  if (!errors.length && cards.length !== RULES.deckSize) errors.push(`덱은 정확히 ${RULES.deckSize}장이어야 해요 (코드에는 ${cards.length}장).`);
  return { ok: errors.length === 0, cards, errors };
}

// 가져오기 계획: 보유한 만큼만 넣고 모자란 카드는 missing으로 알려 줌 (덱은 미완성 → 편성 화면에서 채움)
export function planImport(cards, collection) {
  const want = {}; for (const id of cards) want[id] = (want[id] || 0) + 1;
  const got = [], missing = [];
  for (const [id, n] of Object.entries(want)) {
    const have = Math.min(n, collection[id] || 0);
    for (let k = 0; k < have; k++) got.push(id);
    if (have < n) missing.push({ id, name: name(id), need: n - have });
  }
  got.sort((a, b) => CARD[a].cost - CARD[b].cost);
  return { cards: got, missing, complete: missing.length === 0 };
}

// 프로필에 적용: slot 번호의 덱을 코드 내용(보유분)으로 바꾸고 그 슬롯을 지금 덱으로.
export function importDeckCode(profile, code, slot = profile.activeDeck) {
  const d = decodeDeck(code);
  if (!d.ok) return { ok: false, errors: d.errors };
  if (!profile.decks || !profile.decks[slot]) return { ok: false, errors: ['덱 슬롯을 찾을 수 없어요.'] };
  const plan = planImport(d.cards, profile.collection);
  if (slot !== profile.activeDeck) { profile.decks[profile.activeDeck].cards = [...profile.deck]; profile.activeDeck = slot; }
  profile.deck = plan.cards; profile.decks[slot].cards = [...plan.cards];
  return { ok: true, slot, ...plan };
}
