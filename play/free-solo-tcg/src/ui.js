// 화면(DOM) 담당. 규칙은 game.js, 데이터는 data.js, 저장은 save.js.
import { CARDS, TAGS, RULES, POINT_VALUES, AI_DECKS, FIRST_WIN_BONUS, DAILY_FIRST_WIN } from './data.js';
import * as G from './game.js';
import { loadProfile, saveProfile, SAVE_KEY } from './save.js';

const app = document.getElementById('app');
const { profile: P, status } = loadProfile();
let rng = G.makeRng(P.seed);
const ui = { screen: 'home', battle: null, sel: null, lastPack: null, lastResult: null, deckErr: [], showLog: false };

function persist() { P.seed = rng.state(); saveProfile(P); }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function cardHTML(id, unit, extra = '') {
  const c = G.CARD[id]; const t = TAGS[c.tag] || { icon: '❔', color: '#555' };
  const spell = c.type === 'spell';
  const hp = unit ? unit.hp : c.hp; const atk = unit ? unit.atk : c.atk;
  const st = spell ? `<div class="st spl">✨ 주문</div>`
    : `<div class="st"><span class="atk">${atk}</span><span class="hp${unit && hp < unit.maxHp ? ' hurt' : ''}">${hp}</span></div>`;
  return `<div class="card ${c.rarity}${spell ? ' spell' : ''}" style="--c:${t.color}" title="${esc(c.name)}">
    <span class="cost">${c.cost}</span>${extra}
    <div class="icon" aria-hidden="true">${spell ? '✨' : t.icon}</div>
    <div><div class="name">${esc(c.name)}</div><div class="tag">${esc(c.tag)}${c.rarity === 'rare' ? ' · 레어' : ''}</div></div>
    ${st}</div>`;
}
// 목록용 설명 한 줄: 주문 효과 / 카드 고유 효과 / 태그 효과
function cardDesc(id) {
  const c = G.CARD[id];
  if (c.type === 'spell') return `주문 · 비용 ${c.cost}<br>${esc(c.text)}`;
  const parts = [c.text, TAGS[c.tag]?.text].filter(Boolean).map(esc);
  return `비용 ${c.cost} · ${c.atk}/${c.hp}${parts.length ? '<br>' + parts.join('<br>') : ''}`;
}
const bonusText = b => b.kind === 'daily' ? `🌞 오늘의 첫 승: 팩 +${b.packs}` : `⭐ ${b.name} 첫 승: 팩 +${b.packs}${b.points ? ` · +${b.points}P` : ''}`;

let toastTimer;
function toast(msg) {
  let el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.append(el); }
  el.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 1800);
}

// ---------- 화면들 ----------
function home() {
  const tier = AI_DECKS[G.aiTier(P)];
  const v = G.validateDeck(P.deck, P.collection);
  const owned = Object.values(P.collection).reduce((a, b) => a + b, 0);
  return `<div class="hero-title"><div class="logo">🃏</div><h1>무료 싱글 TCG</h1>
    <p class="muted">이기면 팩 3장 · 중복은 포인트 · 포인트로 원하는 카드</p></div>
    <div class="stats"><div><b>${P.wins}</b>승</div><div><b>${P.losses}</b>패</div><div><b data-id="points">${P.points}</b>포인트</div></div>
    <p class="muted" style="text-align:center">보유 카드 ${owned}장 · 다음 상대: <b>${esc(tier.name)}</b> (단계 ${G.aiTier(P) + 1}/${AI_DECKS.length})</p>
    <div class="bonus" data-id="bonus">
      <div class="${G.dailyAvailable(P) ? 'on' : 'off'}" data-id="daily">${G.dailyAvailable(P) ? `🌞 오늘의 첫 승 보너스 가능 · 팩 +${DAILY_FIRST_WIN.packs}` : '🌞 오늘의 첫 승 보너스 받음 · 내일 다시'}</div>
      ${G.tierFirstAvailable(P) ? `<div class="on" data-id="tierbonus">⭐ ${esc(tier.name)} 첫 승 보너스 · 팩 +${FIRST_WIN_BONUS[G.aiTier(P)].packs} · +${FIRST_WIN_BONUS[G.aiTier(P)].points}P</div>` : ''}
    </div>
    <div class="stack" style="margin-top:auto">
      ${P.pendingPacks > 0 ? `<button class="primary big" data-act="openpack">🎁 미개봉 팩 ${P.pendingPacks}개 열기</button>` : ''}
      <button class="${P.pendingPacks > 0 ? '' : 'primary '}big" data-act="battle" ${v.ok ? '' : 'disabled'}>⚔️ 대전 시작</button>
      ${v.ok ? '' : '<p class="err">덱을 먼저 맞춰 주세요.</p>'}
      <div class="row"><button class="grow" data-act="go" data-to="deck">🗂️ 덱 편성 (${P.deck.length}/${RULES.deckSize})</button>
      <button class="grow" data-act="go" data-to="shop">🛒 카드 구매</button></div>
      <button class="ghost" data-act="howto">ℹ️ 규칙</button>
    </div>`;
}

function deckScreen() {
  const v = G.validateDeck(P.deck, P.collection);
  const ids = CARDS.filter(c => P.collection[c.id]).map(c => c.id);
  return `<div class="bar"><h2>덱 편성</h2><span class="pill" data-id="deckcount">${P.deck.length}/${RULES.deckSize}장</span></div>
    <p class="muted">카드당 최대 ${RULES.maxCopies}장. 보유한 만큼만 넣을 수 있어요.</p>
    <div class="list">${ids.map(id => {
      const n = P.deck.filter(x => x === id).length; const c = G.CARD[id];
      return `<div class="item">${cardHTML(id)}<div class="info"><b>${esc(c.name)}</b> <span class="muted">보유 ${P.collection[id]}</span><br>${cardDesc(id)}</div>
        <div class="ctrl"><button data-act="dec" data-id="${id}" aria-label="${esc(c.name)} 빼기" ${n ? '' : 'disabled'}>−</button><span class="n">${n}</span>
        <button data-act="inc" data-id="${id}" aria-label="${esc(c.name)} 넣기" ${G.canAddToDeck(P, id) ? '' : 'disabled'}>＋</button></div></div>`;
    }).join('')}</div>
    <div class="sticky stack">${v.ok ? '' : `<p class="err">${esc(v.errors[0])}</p>`}
      <div class="row"><button class="grow" data-act="auto">자동 편성</button><button class="grow" data-act="clear">비우기</button>
      <button class="primary grow" data-act="go" data-to="home" ${v.ok ? '' : 'disabled'}>완료</button></div></div>`;
}

function shopScreen() {
  return `<div class="bar"><h2>카드 구매</h2><span class="pill" data-id="points">${P.points} 포인트</span></div>
    <p class="muted">중복(보유 ${RULES.maxCopies}장 초과) 카드는 일반 ${POINT_VALUES.common}P · 레어 ${POINT_VALUES.rare}P로 바뀝니다.</p>
    <div class="list">${CARDS.map(c => {
      const have = P.collection[c.id] || 0; const cost = G.buyCost(c.id);
      return `<div class="item">${cardHTML(c.id)}<div class="info"><b>${esc(c.name)}</b> <span class="muted">보유 ${have}/${RULES.maxCopies}</span><br>${cardDesc(c.id)}</div>
        <button data-act="buy" data-id="${c.id}" ${G.canBuy(P, c.id) ? '' : 'disabled'}>${have >= RULES.maxCopies ? '최대' : cost + 'P'}</button></div>`;
    }).join('')}</div>
    <div class="sticky"><button class="big" data-act="go" data-to="home">돌아가기</button></div>`;
}

function battleScreen() {
  const st = ui.battle; const me = st.p, ai = st.a;
  const targets = ui.sel != null ? G.legalTargets(st, 'p', ui.sel) : [];
  const slot = (u, i, side) => {
    if (!u) return `<div class="slot" data-fx="${side}-${i}" aria-label="빈 칸"></div>`;
    const cls = side === 'p'
      ? (ui.sel === i ? 'sel' : (u.ready && G.legalTargets(st, 'p', i).length ? 'ready' : (u.ready ? '' : 'sick')))
      : (targets.includes(i) ? 'target' : '');
    const rush = u.fresh && u.ready ? '<span class="badge">🐾돌진</span>' : '';
    return `<button class="slot ${cls}" data-fx="${side}-${i}" data-act="${side === 'p' ? 'selunit' : 'hit'}" data-i="${i}" aria-label="${esc(G.CARD[u.id].name)}">${cardHTML(u.id, u, rush)}</button>`;
  };
  let hint = '카드를 터치해 소환·주문, 초록 테두리 유닛으로 공격하세요.';
  if (ui.sel != null) hint = targets.length ? '빨간 테두리 대상을 터치해 공격' : '공격할 수 있는 대상이 없어요';
  return `<div class="battle">
    <div class="herobar ${targets.includes('hero') ? 'target' : ''}" data-fx="a-hero" data-act="hit" data-i="hero" role="button" aria-label="상대 영웅">
      <span>🤖 ${esc(ai.name)}</span><span class="hpv" data-id="aihp">♥ ${ai.hp}</span><span class="grow"></span>
      <span class="pill">손패 ${ai.hand.length}</span><span class="pill">덱 ${ai.deck.length}</span><span class="mana">💧${ai.maxMana}</span></div>
    <div class="field">${ai.field.map((u, i) => slot(u, i, 'a')).join('')}</div>
    <div class="logline" data-id="log">${st.log.slice(-2).map(l => `<div>${esc(l)}</div>`).join('')}</div>
    <div class="field">${me.field.map((u, i) => slot(u, i, 'p')).join('')}</div>
    <div class="herobar" data-fx="p-hero"><span>🙂 나</span><span class="hpv" data-id="php">♥ ${me.hp}</span><span class="grow"></span>
      <span class="pill">턴 ${st.turn}</span><span class="pill">덱 ${me.deck.length}</span><span class="mana" data-id="mana">💧${me.mana}/${me.maxMana}</span></div>
    <div class="hint">${hint}</div>
    <div class="hand">${me.hand.map((id, i) => {
      const ok = G.canPlay(st, 'p', i);
      return `<button class="${ok ? 'playable' : ''}" data-act="play" data-i="${i}" ${ok ? '' : 'disabled'} aria-label="${esc(G.CARD[id].name)} ${G.isSpell(id) ? '사용' : '소환'}">${cardHTML(id)}</button>`;
    }).join('') || '<p class="muted">손패 없음</p>'}</div>
    <div class="row"><button class="ghost" data-act="forfeit">항복</button><button class="ghost" data-act="log" aria-label="전투 기록">📜 기록</button><button class="primary grow" data-act="end">턴 종료 ▶</button></div>
  </div>${ui.showLog ? `<div class="overlay" data-act="closelog"><div class="box logbox"><h2>전투 기록</h2>
    <div class="loglist">${st.log.slice(-14).map(l => `<div>${esc(l)}</div>`).join('')}</div>
    <button class="big" data-act="closelog">닫기</button></div></div>` : ''}`;
}

function resultScreen() {
  const r = ui.lastResult;
  const bonus = r.won && r.bonuses.length ? `<div class="bonus" data-id="resbonus">${r.bonuses.map(b => `<div class="on">${esc(bonusText(b))}</div>`).join('')}</div>` : '';
  return `<div class="hero-title"><div class="logo">${r.won ? '🏆' : '💫'}</div><h1>${r.won ? '승리!' : '패배'}</h1>
    <p>${r.won ? `보상 팩 <b data-id="respacks">${r.packs}</b>개${r.points ? ` · 보너스 <b>+${r.points}P</b>` : ''}` : `${r.points ? `위로 포인트 +${r.points}. ` : ''}덱을 바꿔 다시 도전해 보세요.`}</p></div>
    ${bonus}
    <div class="stack" style="margin-top:auto">
    ${r.won ? `<button class="primary big" data-act="openpack">🎁 팩 열기 (${P.pendingPacks}개)</button>` : `<button class="primary big" data-act="battle">⚔️ 다시 대전</button>
      <div class="row"><button class="grow" data-act="go" data-to="deck">덱 편성</button><button class="grow" data-act="go" data-to="shop">카드 구매</button></div>
      <button class="ghost" data-act="go" data-to="home">홈</button>`}</div>`;
}

function packScreen() {
  const pk = ui.lastPack;
  return `<h2 style="text-align:center">팩 개봉</h2>
    <div class="pack">${pk.cards.map(r => `<div class="reveal">${cardHTML(r.id)}<div class="${r.dup ? 'dup' : 'new'}">${r.dup ? `중복 → +${r.points}P` : '획득!'}</div></div>`).join('')}</div>
    <p style="text-align:center">${pk.points ? `중복 카드가 <b>${pk.points} 포인트</b>로 바뀌었어요.` : '모두 컬렉션에 추가됐어요.'} 보유 포인트: <b data-id="points">${P.points}</b></p>
    <div class="stack" style="margin-top:auto">
      ${P.pendingPacks > 0 ? `<button class="primary big" data-act="openpack">🎁 다음 팩 열기 (${P.pendingPacks}개 남음)</button>` : '<button class="primary big" data-act="battle">⚔️ 다시 대전</button>'}
      <div class="row"><button class="grow" data-act="go" data-to="deck">덱 편성</button><button class="grow" data-act="go" data-to="shop">카드 구매</button></div>
      <button class="ghost" data-act="go" data-to="home">홈</button></div>`;
}

function render() {
  const views = { home, deck: deckScreen, shop: shopScreen, battle: battleScreen, result: resultScreen, pack: packScreen };
  app.dataset.screen = ui.screen;
  app.innerHTML = views[ui.screen]();
  if (ui.battle && ui.battle.fx && ui.battle.fx.length) showFx(ui.battle.fx.splice(0));
}

// 피해(빨강 −n)·회복(초록 +n) 숫자 팝업. 같은 대상의 여러 이벤트는 조금씩 늦춰 겹치지 않게.
function showFx(events) {
  const seen = {};
  for (const e of events) {
    const key = `${e.side}-${e.at}`; const el = app.querySelector(`[data-fx="${key}"]`); if (!el) continue;
    const k = seen[key] = (seen[key] || 0) + 1;
    const rc = el.getBoundingClientRect();
    const d = document.createElement('div');
    d.className = `pop ${e.kind}`; d.textContent = (e.kind === 'heal' ? '+' : '−') + e.amount;
    d.style.left = `${rc.left + rc.width / 2}px`; d.style.top = `${rc.top + rc.height / 2}px`;
    d.style.animationDelay = `${(k - 1) * 180}ms`;
    document.body.append(d); setTimeout(() => d.remove(), 1100 + k * 180);
  }
}

function finishBattle() {
  const won = ui.battle.winner === 'p';
  const r = G.recordResult(P, won, !!ui.battle.forfeit, ui.battle.tier ?? G.aiTier(P));
  ui.lastResult = { won, points: r.points, packs: r.packs, bonuses: r.bonuses };
  ui.showLog = false;
  ui.battle = null; ui.sel = null; ui.screen = 'result';
  persist();
}

// ---------- 입력 (터치/클릭 공용) ----------
app.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
  const act = el.dataset.act, id = el.dataset.id, i = el.dataset.i;
  const st = ui.battle;
  switch (act) {
    case 'go': ui.screen = el.dataset.to; break;
    case 'howto':
      toast('마나 매 턴 +1(최대 6). 유닛은 다음 턴부터 공격(🐾야생은 소환 턴에 유닛 공격). 🛡️수호부터 공격. 🔥화염 소환 시 1 피해, 🌑암흑 공격 시 체력 +1.'); return;
    case 'inc': if (G.canAddToDeck(P, id)) { P.deck.push(id); P.deck.sort((a, b) => G.CARD[a].cost - G.CARD[b].cost); persist(); } break;
    case 'dec': { const k = P.deck.indexOf(id); if (k >= 0) { P.deck.splice(k, 1); persist(); } break; }
    case 'auto': P.deck = G.autoDeck(P.collection); persist(); break;
    case 'clear': P.deck = []; persist(); break;
    case 'buy': if (G.buyCard(P, id)) { persist(); toast(`${G.CARD[id].name} 구매!`); } break;
    case 'battle':
      if (!G.validateDeck(P.deck, P.collection).ok) { ui.screen = 'deck'; break; }
      ui.battle = G.newBattle(P.deck, P, rng); ui.sel = null; ui.screen = 'battle'; persist(); break;
    case 'play': G.playCard(st, 'p', Number(i)); ui.sel = null; break;
    case 'selunit': ui.sel = ui.sel === Number(i) ? null : Number(i); break;
    case 'hit':
      if (ui.sel == null) return;
      if (G.attack(st, 'p', ui.sel, i === 'hero' ? 'hero' : Number(i))) { ui.sel = null; if (navigator.vibrate) navigator.vibrate(20); }
      break;
    case 'end': ui.sel = null; G.endTurn(st); break;
    case 'forfeit': st.forfeit = true; st.winner = 'a'; break;
    case 'openpack': { const pk = G.openPendingPack(P, rng); if (pk) { ui.lastPack = pk; ui.screen = 'pack'; persist(); } else ui.screen = 'home'; break; }
    case 'log': ui.showLog = true; break;
    case 'closelog': if (e.target.closest('.box') && el.classList.contains('overlay')) return; ui.showLog = false; break;
  }
  if (ui.battle && ui.battle.winner) finishBattle();
  render();
});

// 테스트·디버그 훅 (게임 진행에는 쓰지 않음)
window.__fst = {
  get profile() { return P; }, get ui() { return ui; }, SAVE_KEY, loadStatus: status,
  forceWin() { if (ui.battle) { G.debugWin(ui.battle); finishBattle(); render(); } },
  render
};

render();
if (status === 'reset') toast('저장 데이터를 읽지 못해 새로 시작했어요.');
if (status === 'migrated') toast('이전 버전 컬렉션과 포인트를 가져왔어요.');
