// 단계별 도전 과제 (GrokBot 7차). DOM 없음. 수치는 data.js CHALLENGES.
// 기록 위치: profile.records.tiers[t].challenges = { turns: bool, hp: bool } (각 1회 보상)
import { CHALLENGES } from './data.js';

export const CHALLENGE_KEYS = ['turns', 'hp'];
export function challengeList(tier) {
  const c = CHALLENGES[tier]; if (!c) return [];
  return [
    { key: 'turns', target: c.underTurns, points: c.points, text: `${c.underTurns}턴 이내 승리`, short: `⏱${c.underTurns}턴` },
    { key: 'hp', target: c.highHp, points: c.points, text: `HP ${c.highHp} 이상 남기고 승리`, short: `♥${c.highHp}+` }
  ];
}
// rec = { turns, hp } (이긴 판). 경계값 포함: turns ≤ 목표, hp ≥ 목표
export const meets = (key, target, rec) => !!rec && (key === 'turns' ? rec.turns <= target : rec.hp >= target);

export const emptyChallenges = () => ({ turns: false, hp: false });
// 이긴 판 기록으로 새로 달성한 과제를 표시하고 목록 반환 (포인트 지급은 호출하는 쪽에서 합산)
export function claimChallenges(tierRec, tier, rec) {
  tierRec.challenges = tierRec.challenges || emptyChallenges();
  const out = [];
  for (const ch of challengeList(tier)) {
    if (tierRec.challenges[ch.key] || !meets(ch.key, ch.target, rec)) continue;
    tierRec.challenges[ch.key] = true;
    out.push({ tier, key: ch.key, text: ch.text, points: ch.points });
  }
  return out;
}
export function challengeStatus(profile, tier) {
  const T = ((profile.records || {}).tiers || [])[tier] || {};
  return challengeList(tier).map(ch => ({ ...ch, done: !!(T.challenges && T.challenges[ch.key]) }));
}
