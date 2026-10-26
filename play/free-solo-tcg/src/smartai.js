// 사람 근사 AI (GrokBot 5차): 1수 앞보기 탐욕 탐색 + 판 평가 함수. DOM 없음, 규칙은 game.js 함수만 사용.
// 용도: 시뮬 측정용 플레이어(tests/sim.mjs "새 AI") + AI_DECKS에 ai:'smart'인 상대(5단계 하드).
// 방식: 지금 할 수 있는 모든 행동(카드 내기 × 칸/대상, 공격 × 대상)을 복제 상태에 해 보고
//       평가값이 가장 오르는 행동을 실제로 함 → 더 오르는 행동이 없으면 턴 종료.
import { CARD, isSpell, spellTarget, spellTargets, canPlay, playCard, legalTargets, attack, frame } from './game.js';

const other = s => (s === 'p' ? 'a' : 'p');
function clone(st) {
  const { frames, recording, log, fx, ...rest } = st;
  const c = JSON.parse(JSON.stringify(rest)); c.log = []; c.fx = null; return c;
}

// 판 평가 (side 입장, 클수록 좋음). 가중치는 HANDOFF "사람 근사 AI" 참고
export const W = { hero: 1.0, low: 1.2, atk: 1.0, hp: 0.7, taunt: 1.2, hand: 0.9, cost: 0.25, spell: 0.35, lethal: 6, danger: 8 };
function unitVal(u) {
  const c = CARD[u.id];
  return u.atk * W.atk + u.hp * W.hp + (c.tag === '수호' ? W.taunt : 0) + (c.tag === '암흑' ? 0.4 : 0) - (u.buff || 0) * W.atk;
}
const heroVal = h => h * W.hero - Math.max(0, 6 - h) * W.low; // 체력이 낮을수록 1점이 더 귀함
function handVal(id) { const c = CARD[id]; return isSpell(id) ? c.power * W.spell : W.hand + c.cost * W.cost; }
export function evaluate(st, side) {
  if (st.winner) return st.winner === side ? 1e6 : -1e6;
  const S = st[side], E = st[other(side)];
  let v = heroVal(S.hp) - heroVal(E.hp);
  for (const u of S.field) if (u) v += unitVal(u);
  for (const u of E.field) if (u) v -= unitVal(u) * 1.05;
  for (const id of S.hand) v += handVal(id);
  // 다음 턴 위협: 내 필드 공격력 합 ≥ 상대 HP(상대 수호 없음) → 가산, 상대 공격력 합 ≥ 내 HP(내 수호 없음) → 감산
  const atkSum = X => X.field.reduce((a, u) => a + (u ? u.atk - (u.buff || 0) : 0), 0);
  const taunt = X => X.field.some(u => u && CARD[u.id].tag === '수호');
  if (!taunt(E) && atkSum(S) >= E.hp) v += W.lethal;
  if (!taunt(S) && atkSum(E) >= S.hp) v -= W.danger;
  return v;
}

function actions(st, side) {
  const S = st[side]; const out = [];
  S.hand.forEach((id, i) => {
    if (!canPlay(st, side, i)) return;
    if (spellTarget(id)) for (const t of spellTargets(st, side, id)) out.push(['play', i, t]);
    else if (isSpell(id)) out.push(['play', i, null]);
    else out.push(['play', i, S.field.findIndex(f => !f)]);
  });
  S.field.forEach((u, from) => { if (u) for (const t of legalTargets(st, side, from)) out.push(['atk', from, t]); });
  return out;
}
const apply = (st, side, a) => (a[0] === 'play' ? playCard(st, side, a[1], a[2]) : attack(st, side, a[1], a[2]));

export function smartTurn(st, side) {
  for (let step = 0; step < 24 && !st.winner && st.active === side; step++) {
    const base = evaluate(st, side);
    let best = null, bestV = base + 0.05;
    for (const a of actions(st, side)) {
      const c = clone(st);
      if (!apply(c, side, a)) continue;
      const v = evaluate(c, side);
      if (v > bestV) { bestV = v; best = a; }
    }
    if (!best) break;
    apply(st, side, best);
    if (best[0] === 'atk') frame(st); // AI 턴 단계별 보기 (카드 내기는 playCard가 기록)
  }
}
