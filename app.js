const LS='gamehub.v1';let st={fav:[],recent:{}};try{Object.assign(st,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
const save=()=>localStorage.setItem(LS,JSON.stringify(st));
let games=[],filter='전체',q='';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ago(t){const m=(Date.now()-t)/60000;if(m<60)return Math.max(1,m|0)+'분 전';if(m<1440)return (m/60|0)+'시간 전';return (m/1440|0)+'일 전'}
function render(){
 const chips=['전체','플레이 가능','★ 즐겨찾기',...new Set(games.flatMap(g=>g.genre))];
 document.getElementById('chips').innerHTML=chips.map(c=>`<button class="chip${c===filter?' on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
 let list=games.filter(g=>{const playable=!!g.url;
  if(filter==='플레이 가능'&&!playable)return false;if(filter==='★ 즐겨찾기'&&!st.fav.includes(g.id))return false;
  if(!['전체','플레이 가능','★ 즐겨찾기'].includes(filter)&&!g.genre.includes(filter))return false;
  return !q||(g.title+g.desc+g.genre.join(' ')).toLowerCase().includes(q)});
 const score=g=>(g.url?4e13:0)+(st.fav.includes(g.id)?2e13:0)+(st.recent[g.id]||0);
 list.sort((a,b)=>score(b)-score(a));
 document.getElementById('grid').innerHTML=list.length?list.map(g=>{const p=!!g.url,f=st.fav.includes(g.id);
  const th=g.thumb?`style="background-image:url(${g.thumb})"`:`style="background:linear-gradient(135deg,${g.color},#1a1726)"`;
  return `<div class="card${p?'':' off'}"><div class="thumb" ${th}>${g.thumb?'':g.icon}</div>
  ${st.recent[g.id]?`<div class="last">최근 ${ago(st.recent[g.id])}</div>`:''}
  <button class="star${f?' on':''}" data-f="${g.id}" aria-label="즐겨찾기">${f?'★':'☆'}</button>
  <div class="body"><p class="t">${g.icon} ${esc(g.title)}</p><p class="d">${esc(g.desc)}</p>
  <div class="tags">${g.genre.map(x=>`<span>${esc(x)}</span>`).join('')}</div>
  ${g.saveWarn?`<p class="warn">${esc(g.saveWarn)}</p>`:''}
  ${g.src?`<dl class="meta"><dt>원본 저장소</dt><dd>${esc(g.src)}</dd><dt>반영 커밋</dt><dd><code>${esc(g.commit)}</code> · ${esc(g.commitKind)}</dd><dt>저장 방식</dt><dd>${esc(g.save)}</dd></dl>`:''}
  ${p?`${g.login==='chatgpt'?'<span class="lg">ChatGPT 로그인 필요</span>':''}<a class="play" href="${g.url}" data-p="${g.id}">▶ 바로 플레이</a>`:`<span class="badge">${g.note?'🔍 '+g.note:'🔒 비공개 · 링크 없음'}</span>`}</div></div>`}).join(''):'<div class="empty">조건에 맞는 게임이 없어요</div>';
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-c],[data-f],[data-p]');if(!t)return;
 if(t.dataset.c){filter=t.dataset.c;render()}
 else if(t.dataset.f){const i=st.fav.indexOf(t.dataset.f);i<0?st.fav.push(t.dataset.f):st.fav.splice(i,1);save();render()}
 else if(t.dataset.p){st.recent[t.dataset.p]=Date.now();save()}});
document.getElementById('q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();render()});
fetch('games.json?v=1.4.7').then(r=>r.json()).then(g=>{games=g;render()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
