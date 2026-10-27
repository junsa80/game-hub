import {FieldArt} from './art.js?v=20261027-paint';
import {GameAudio} from './audio.js?v=20261027-paint';
import {ForestGame} from './engine.js';
import {TrialGame,TRIAL_CARDS,TRIAL_STYLES,TRIAL_RELICS,TRIAL_BOONS,TRIAL_LEVELS,trialProfile,unlockedRelics,unlockedCards,buildCost,recordTrial} from './trials.js';
import {UPGRADES,GROUPS,fmt,W,H,STAGES,SKILLS,MONSTERS} from './data.js';
const $=id=>document.getElementById(id);
const canvas=$('field'),ctx=canvas.getContext('2d',{alpha:false});
const fieldArt=new FieldArt();let artTime=0;
const audio=new GameAudio();let lastAudioKill=0,lastAudioTime=0,lastAudioOutcome='',lastPurified=0,lastAttackFX=null,lastShutdowns=0,lastWorkFX=null;
const STORAGE='world-breaker-forest-alpha-v1';
const FILTER_STORAGE=STORAGE+'-upgrade-filter';
let upgradeFilter='all';
try{if(localStorage.getItem(FILTER_STORAGE)==='available')upgradeFilter='available';}catch{}
let game,activeTab='work',last=performance.now(),accum=0,lastUI=0,lastSave=0,frameCount=0,fps=60,fpsLast=performance.now();
let isDragging=false,sawTap=false,modalMode='settings',paused=false,saveBlocked=false,upgradeKey='',upgradeRows=[],tabKey='';
const TRIAL_STORAGE=STORAGE+'-research-v1';
let trialMode=false,trialMenu=false,campaignGame=null,trialStore={version:1,profile:trialProfile(),run:null},trialSaveBlocked=false,trialDraft={stage:1,level:1,style:'cutter',build:{power:2,crew:2},relics:['ember','lens'],skills:['sweep','overdrive']};
function loadGame(){
 try{const raw=localStorage.getItem(STORAGE);if(raw)return ForestGame.fromJSON(JSON.parse(raw));}
 catch(err){
  try{const backup=localStorage.getItem(STORAGE+'-backup');if(backup){const restored=ForestGame.fromJSON(JSON.parse(backup));restored.notify('주 저장 손상: 백업 저장에서 복구했습니다.');return restored;}}catch{}
  saveBlocked=true;$('save-status').textContent='저장 읽기 실패 · 자동 덮어쓰기 중지';
 }
 return new ForestGame();
}
game=loadGame();
function save(){if(trialMode)return saveTrial();if(saveBlocked)return false;try{
 const previous=localStorage.getItem(STORAGE);
 if(previous){try{ForestGame.fromJSON(JSON.parse(previous));localStorage.setItem(STORAGE+'-backup',previous);}catch{}}
 localStorage.setItem(STORAGE,JSON.stringify(game.toJSON()));$('save-status').textContent='저장 완료 · '+new Date().toLocaleTimeString('ko-KR');return true;
 }catch(err){$('save-status').textContent='저장 불가 · 설정에서 JSON 내보내기';return false;}}
function setTarget(ev){audio.unlock();const r=canvas.getBoundingClientRect(),m=game.mapBounds();game.setTarget((m.x+(ev.clientX-r.left)/r.width*m.width)/W,(m.y+(ev.clientY-r.top)/r.height*m.height)/H);if(!sawTap){sawTap=true;$('field-notice').style.opacity='0';}}
canvas.addEventListener('pointerdown',ev=>{if(game.finished)return;isDragging=true;canvas.setPointerCapture?.(ev.pointerId);setTarget(ev);});
canvas.addEventListener('pointermove',ev=>{if(game.finished)return;if(ev.pointerType==='mouse'||isDragging)setTarget(ev);});
canvas.addEventListener('pointerup',()=>isDragging=false);canvas.addEventListener('pointercancel',()=>isDragging=false);
canvas.addEventListener('keydown',ev=>{const moves={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.05],ArrowDown:[0,.05]};if(moves[ev.key]){ev.preventDefault();const [x,y]=moves[ev.key];game.setTarget(game.selected.x+x,game.selected.y+y);}});
function renderTabs(){const groups=GROUPS.filter(group=>UPGRADES.some(d=>d.group===group.id&&game.visible(d)));if(!groups.some(g=>g.id===activeTab))activeTab=groups[0].id;const key=groups.map(g=>g.id).join()+activeTab;if(tabKey===key)return;tabKey=key;const el=$('tabs');el.replaceChildren();for(const group of groups){const b=document.createElement('button');b.textContent=group.name;b.className=group.id===activeTab?'active':'';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(group.id===activeTab));b.onclick=()=>{activeTab=group.id;renderTabs();renderUpgrades();};el.append(b);}}
function purchasable(def){return game.roundState!=='active'&&game.unlocked(def)&&game.rank(def.id)<game.cap(def)&&game.balance(def)+1e-6>=game.cost(def);}
function setUpgradeFilter(value){upgradeFilter=value;try{localStorage.setItem(FILTER_STORAGE,value);}catch{}renderUI();}
$('filter-all').onclick=()=>setUpgradeFilter('all');
$('filter-available').onclick=()=>setUpgradeFilter('available');
function renderUpgrades(){
 const available=UPGRADES.filter(d=>purchasable(d));
 const filtering=upgradeFilter==='available';
 const defs=filtering?available:UPGRADES.filter(x=>x.group===activeTab&&game.visible(x));
 $('tabs').hidden=filtering;
 $('filter-available').textContent=`구매 가능만 (${available.length})`;
 for(const [id,selected] of [['filter-all',!filtering],['filter-available',filtering]]){$(id).setAttribute('aria-pressed',String(selected));$(id).className=selected?'active':'';}
 $('upgrade-empty').hidden=defs.length>0;
 $('upgrade-empty').textContent=game.roundState==='active'?'도전이 끝나면 구매 가능한 강화를 모아 보여줘요.':'지금 구매 가능한 강화가 없어요. 전체에서 비용과 조건을 확인하세요.';
 const key=game.stage+':'+game.round+':'+game.roundState+activeTab+upgradeFilter+defs.map(d=>d.id).join(',')+JSON.stringify(game.upgrades);
 if(key!==upgradeKey){upgradeKey=key;upgradeRows=[];const parent=$('upgrade-list');parent.replaceChildren();
 for(const def of defs){
  const el=document.createElement('div');el.className='upgrade';
  const info=document.createElement('div');info.className='info';
  const name=document.createElement('div');name.className='name';
  const desc=document.createElement('div');desc.className='desc';desc.textContent=def.desc;
  const progress=document.createElement('div');progress.className='rank';
  const b=document.createElement('button');b.onclick=()=>{if(game.buy(def.id)){audio.unlock();audio.effect('upgrade');renderUI();save();}};
  info.append(name,desc,progress);el.append(info,b);parent.append(el);upgradeRows.push({def,el,name,progress,b});
 }}
 for(const {def,el,name,progress,b} of upgradeRows){const rank=game.rank(def.id),unlocked=game.unlocked(def),complete=rank>=game.cap(def),cost=game.cost(def);
 el.className='upgrade'+(!unlocked?' locked':'')+(complete?' complete':'');name.textContent=(unlocked?'':'🔒 ')+def.name;
 const requirement=def.requires&&!game.rank(def.requires)?UPGRADES.find(d=>d.id===def.requires).name+' 필요':`${def.min}회 강화 필요`;
 progress.textContent=`${rank}/${game.cap(def)}`+(!unlocked?' · '+requirement:'');
 b.textContent=complete?'MAX':unlocked?fmt(cost)+({wood:' 🪵',ore:' 💎',sap:' 🧪',gears:' ⚙️',essence:' ✨'}[game.currency(def)]):'잠김';b.disabled=game.roundState==='active'||!(unlocked&&!complete&&game.balance(def)>=cost);
 }}
for(let slot=0;slot<2;slot++){
 const select=$('skill-slot-'+slot);for(const def of SKILLS){const option=document.createElement('option');option.value=def.id;option.textContent=def.name+' · '+def.desc;select.append(option);}
 select.onchange=()=>{game.equipSkill(slot,select.value);renderUI();save();};
 $('cast-'+slot).onclick=()=>{audio.unlock();if(game.castSkill(game.skills[slot])){audio.effect('skill');renderUI();save();}};
}
function renderSkills(){
 $('skill-panel').hidden=!game.skillsUnlocked();$('skill-energy').textContent=`에너지 ${Math.floor(game.energy)}/100 · 채집·처치·정화로 충전${game.time<game.stasisUntil?' · 봉인 '+Math.ceil(game.stasisUntil-game.time)+'초':game.time<game.overdriveUntil?' · 폭주 '+Math.ceil(game.overdriveUntil-game.time)+'초':''}`;
 $('skill-loadout').hidden=game.roundState==='active';
 for(let slot=0;slot<2;slot++){const def=SKILLS.find(d=>d.id===game.skills[slot]),remaining=Math.max(0,(game.skillReadyAt[def.id]||0)-game.time);$('skill-slot-'+slot).value=def.id;$('skill-slot-'+slot).disabled=game.roundState==='active';const button=$('cast-'+slot);button.textContent=`${def.name} · ${remaining>0?Math.ceil(remaining)+'초':def.cost+' 에너지'}`;button.title=def.desc;$('skill-desc-'+slot).textContent=def.desc;button.disabled=game.roundState!=='active'||game.energy<def.cost||remaining>0;}
 $('swamp-status').hidden=game.stage!==3;
 $('swamp-status').textContent=game.time<game.stasisUntil?'❄ 생성·적 행동 봉인 중':game.time<game.freezeUntil?'❄ 생성 봉인 중':game.time<game.calmUntil?`✦ 정화의 고요 ${Math.ceil(game.calmUntil-game.time)}초 · 생성 35% 감소`:game.bloomActive()?'☣ 포자 파동! 빛나는 오염 핵을 정화하세요':`🍄 오염 핵 ${game.spores.length}개 · 파동 전에 정화하면 생성 둔화`;
 $('city-status').hidden=game.stage!==4;const online=game.grid.filter(n=>n.hp>0);$('city-status').textContent=game.time<game.stasisUntil?`❄ 봉인 ${Math.ceil(game.stasisUntil-game.time)}초 · 생산·적·재가동 정지`:game.time<game.blackoutUntil?`⚡ 전체 정전 ${Math.ceil(game.blackoutUntil-game.time)}초 · 생산 정지!`: `🏭 가동 장치 ${online.length}/${game.grid.length} · 생산 ${Math.round(game.gridPower()*100)}% · 주황 발전기 차단 / 파랑 축전기 충전 후 과부하`;
 const enemy=game.bugs[0];$('enemy-guide').hidden=!enemy;$('enemy-guide').textContent=enemy?`${MONSTERS[enemy.kind]?.name||'몬스터'} · ${enemy.kind==='shell'?'공격 직후 1.5초 약점 · ':''}격파 보상: ${MONSTERS[enemy.kind]?.reward||'자원·정수'}`:'';
}
function renderUI(){globalThis.gameScore?.setScene(game.roundState==='active'?'battle':'home',game.stage);const outcome=game.stage+':'+game.round+':'+game.roundState;if(outcome!==lastAudioOutcome){if(game.roundState==='cleared')audio.effect('clear');if(game.roundState==='failed')audio.effect('fail');lastAudioOutcome=outcome;}renderTabs();const s=game.getStats();document.body.dataset.stage=game.stage;$('world-title').textContent=`STAGE 0${game.stage} · ${game.stageData().name}`;$('shield').textContent=`보호막 ${Math.ceil(game.shield)} · ${game.combatFirst?'전투 우선':'채집 우선'}`;$('next-stage').hidden=!game.finished||!STAGES[game.stage]?.implemented;$('next-stage').textContent=game.stage===1?'⛏ 공명 광산으로 →':game.stage===2?'🍄 오염된 늪으로 →':'🏭 기계도시로 →';$('content-end').hidden=!game.finished||Boolean(STAGES[game.stage]?.implemented);$('campaign').textContent=STAGES.map(d=>`${d.id}. ${d.name} (${d.nodes})${d.implemented?'':' · 개발 예정'}`).join(' / ');$('wood').textContent=fmt(game.stage===4?game.gears:game.stage===3?game.sap:game.stage===2?game.ore:game.wood);$('resource-label').textContent=game.stage===4?'⚙️ 기계 부품 (이전 자원 보존)':game.stage===3?'🧪 정화 수액 (이전 자원 보존)':game.stage===2?'💎 광석 (목재 '+fmt(game.wood)+' 보존)':'🪵 목재';$('essence').textContent=fmt(game.essence);$('power').textContent=(s.manual+s.auto).toFixed(1);$('growth').textContent=s.growth.toFixed(1);
 $('upgrades-owned').textContent=`${s.distinctNodes}종 · 현재 ${UPGRADES.filter(d=>game.visible(d)).length}종 공개`;
 $('round-next').hidden=game.finished||game.roundState!=='cleared';$('round-retry').hidden=game.roundState!=='failed';$('round-clock').textContent=`${Math.ceil(s.remaining)}초`;
 $('tempo').textContent=`생성 ${s.growth.toFixed(1)}/초 ↔ 처리 ${(s.manual+s.auto).toFixed(1)}/초${game.stage===2?' · 장갑/약점 적용 전':''}`;
 const map=game.mapBounds();const spec=game.workerSpec();$('worker-status').textContent=`작업 ${game.stage===4?'절단기':game.stage===3?'낫':game.stage===2?'곡괭이':'도끼'} ${game.workers.filter(w=>w.busy).length}/${spec.local+spec.global} · 빈 도구는 대기`;
 $('map-size').textContent=`공터 ${map.width}×${map.height} · 범위 ${(game.radius()*100).toFixed(0)}%`;
 $('upgrade-phase').textContent=game.roundState==='active'?'도전 중 · 강화는 종료 후 가능합니다':'휴식 · 지금 강화하고 다시 도전하세요';
 $('round-help').textContent=game.rules().finale?(game.stage===4?'최종 대청소 · 15초 후 생산 종료 → 모든 전력 장치·폐기물 제거 → 거신 격파':'최종 대청소 · 15초 후 생성 종료, 화면을 비우고 보스 처치'):`목표: ${Math.ceil(game.rules().goal)}개 채집 + 잔량 ${Math.max(3,game.growthRate()*3).toFixed(1)}개 미만 · 2초 유지`;
$('field-stats').textContent=`필드 ${s.mass.toFixed(1)}개 · 이번 라운드 ${fmt(game.roundHarvest)}개 채집`;
 $('hint').textContent=game.messages[0]?.message||game.hint;
 if(game.finished){$('stage-label').textContent=`🏆 STAGE 0${game.stage} · 완전 정화!`;$('stage-progress').textContent='COMPLETE';$('progress-fill').style.width='100%';}
 else if(game.roundState!=='active'){$('stage-label').textContent=game.roundState==='cleared'?`ROUND ${game.round} CLEAR · 새 강화 해금!`:`시간 종료 · 잔량 ${s.mass.toFixed(1)}개 · 강화 후 재도전`;$('stage-progress').textContent=game.roundState==='cleared'?'SUCCESS':'RETRY';$('progress-fill').style.width=game.roundState==='cleared'?'100%':'0%';}
 else {$('stage-label').textContent=`${game.stageData().name} · Lv.${game.round}/10${game.rules().finale?' 최종 대청소':''}`;$('stage-progress').textContent=game.boss?`보스 ${Math.ceil(game.boss.hp/game.boss.maxHp*100)}%${game.hitClock<1.5?' · 약점!':''}`:game.stage===2?(game.weakOpen()?'약점 개방!':'장갑 보호'):`${Math.floor(s.progress*100)}%`;$('progress-fill').style.width=`${s.progress*100}%`;}
 renderSkills();renderUpgrades();renderTrialStatus();}
function pathRoundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function tree(x,y,size,mass,seed){fieldArt.resource(ctx,game,x,y,size,mass,seed);}
function drawGrid(tileW,tileH){
 ctx.lineWidth=4;
 for(let i=1;i<game.grid.length;i++){const a=game.grid[i-1],b=game.grid[i],ca=game.cells[a.cellId],cb=game.cells[b.cellId];ctx.strokeStyle=a.hp>0&&b.hp>0?'#edb868':'#52616b';ctx.setLineDash(a.hp>0&&b.hp>0?[9,5]:[]);ctx.lineDashOffset=-game.time*18;ctx.beginPath();ctx.moveTo((ca.x+.5)*tileW,(ca.y+.5)*tileH);ctx.lineTo((cb.x+.5)*tileW,(cb.y+.5)*tileH);ctx.stroke();}ctx.setLineDash([]);ctx.lineDashOffset=0;
 for(const node of game.grid){const c=game.cells[node.cellId],x=(c.x+.5)*tileW,y=(c.y+.5)*tileH;ctx.save();ctx.translate(x,y);ctx.globalAlpha=node.hp>0?1:.45;ctx.fillStyle='#152633';ctx.strokeStyle=node.hp>0?(node.kind==='relay'?'#ffbd75':'#88eaff'):'#69818d';ctx.lineWidth=3;pathRoundRect(-18,-18,36,36,6);ctx.fill();ctx.stroke();
 if(node.kind==='relay'){ctx.save();ctx.rotate(node.hp>0?game.time*3:0);ctx.strokeStyle='#ffc77e';for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-12);ctx.lineTo(7,-7);ctx.stroke();}ctx.restore();}else{ctx.fillStyle=node.hp>0?'#77dbe9':'#64737e';ctx.fillRect(-9,9-node.charge*.18,18,node.charge*.18);ctx.strokeStyle='#d1ffff';ctx.strokeRect(-10,-10,20,20);}
 ctx.fillStyle='#12202c';ctx.fillRect(-20,-26,40,4);ctx.fillStyle=node.kind==='relay'?'#ffbf75':'#8df4ff';ctx.fillRect(-20,-26,40*node.hp/node.maxHp,4);ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillStyle='#e3f3f9';ctx.fillText(node.hp<=0?(game.rules().finale&&game.roundElapsed>=15?'정지':Math.max(0,Math.ceil(node.offlineUntil-game.time))+'초'):node.kind==='relay'?'발전기':Math.floor(node.charge)+'%',0,32);ctx.restore();}
}
function drawMonster(b,w,h){
 const def=MONSTERS[b.kind]||MONSTERS.rusher,windup=(b.attack||0)>4.5,lunging=(b.attack||0)<.3;
 const angle=Math.atan2((game.selected.y-b.y)*h,(game.selected.x-b.x)*w),shift=lunging?Math.sin((b.attack||0)/.3*Math.PI)*14:windup?-Math.sin(game.time*22)*3:0;
 const x=b.x*w+Math.cos(angle)*shift,y=b.y*h+Math.sin(angle)*shift;
 ctx.save();ctx.translate(x,y);ctx.fillStyle='#071b2399';ctx.beginPath();ctx.ellipse(0,12,22,7,0,0,Math.PI*2);ctx.fill();
 if(windup){ctx.strokeStyle=game.time<game.stasisUntil?'#93ddff':'#ff6d73';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,25+Math.sin(game.time*16)*3,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffb7a1';ctx.font='bold 18px system-ui';ctx.textAlign='center';ctx.fillText(game.time<game.stasisUntil?'❄':'!',0,-33);}
 if(fieldArt.stamp(ctx,b.kind,b.kind==='shell'?24:20)){ctx.fillStyle='#171d2b';ctx.fillRect(-22,-29,44,5);ctx.fillStyle=windup?'#ff796e':'#bdf0cf';ctx.fillRect(-22,-29,44*Math.max(0,b.hp/b.maxHp),5);ctx.restore();return;}
 ctx.strokeStyle=game.time<game.stasisUntil?'#93ddff':windup?'#ff686a':def.color;ctx.lineWidth=2.5;if(game.stage===4){ctx.fillStyle='#334f60';ctx.fillRect(-23,-11,46,22);ctx.strokeRect(-23,-11,46,22);ctx.fillStyle='#a7c8d4';for(const side of [-1,1]){ctx.fillRect(side*22-4,6,8,13);ctx.fillRect(side*22-4,-21,8,13);}}
 if(b.kind==='rusher'){for(let k=-1;k<=1;k++){const move=Math.sin(game.time*12+k)*4;ctx.beginPath();ctx.moveTo(-12,k*7);ctx.lineTo(-25,k*10+move);ctx.moveTo(12,k*7);ctx.lineTo(25,k*10-move);ctx.stroke();}}
 if(b.kind==='bomber'){ctx.fillStyle='#efffa333';for(const sign of [-1,1]){ctx.beginPath();ctx.ellipse(sign*16,-7,12,6,sign*Math.sin(game.time*24),0,Math.PI*2);ctx.fill();}}
 ctx.fillStyle=game.time<(b.hitUntil||0)?'#fff6ce':def.color;ctx.beginPath();ctx.ellipse(0,0,b.kind==='shell'?21:16,b.kind==='shaman'?20:14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
 if(b.kind==='shell'){ctx.strokeStyle='#2a4966';ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(0,14);ctx.moveTo(-17,-4);ctx.lineTo(17,4);ctx.stroke();}
 if(b.kind==='repair'){ctx.strokeStyle='#9bffdd';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-23,-15);ctx.lineTo(-9,-6);ctx.moveTo(23,-15);ctx.lineTo(9,-6);ctx.stroke();}
 if(b.kind==='shaman'){ctx.strokeStyle='#f3c1ee';ctx.beginPath();ctx.moveTo(-14,-10);ctx.lineTo(-20,-26);ctx.lineTo(-4,-17);ctx.moveTo(14,-10);ctx.lineTo(20,-26);ctx.lineTo(4,-17);ctx.stroke();}
 if(b.kind==='bomber'){ctx.fillStyle='#fff3a5';ctx.beginPath();ctx.arc(0,3,7+Math.sin(game.time*8)*2,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#15233b';ctx.fillRect(-8,-6,5,5);ctx.fillRect(3,-6,5,5);ctx.fillStyle='#fff';ctx.fillRect(-7,-6,2,2);ctx.fillRect(4,-6,2,2);
 ctx.fillStyle='#171d2b';ctx.fillRect(-22,-29,44,5);ctx.fillStyle=windup?'#ff796e':'#bdf0cf';ctx.fillRect(-22,-29,44*Math.max(0,b.hp/b.maxHp),5);ctx.restore();
}
function drawField(){
 const map=game.mapBounds(),tileW=50,tileH=50,w=W*tileW,h=H*tileH;
 // The backing bitmap and its CSS footprint both grow with the purchased map.
 // Locked land is outside the canvas, rather than a dark region of a full-size map.
 if(canvas.width!==map.width*tileW)canvas.width=map.width*tileW;
 if(canvas.height!==map.height*tileH)canvas.height=map.height*tileH;
 canvas.style.width=trialMode?'min(100%, 600px)':`clamp(160px, ${map.width/W*100}%, 100%)`;
 canvas.style.height='auto';
 ctx.save();ctx.translate(-map.x*tileW,-map.y*tileH);
 fieldArt.update(game,Math.max(0,Math.min(.25,game.time-artTime)));artTime=game.time;
 fieldArt.ground(ctx,game,map);
 for(const c of game.cells){if(c.x<map.x||c.x>=map.x+map.width||c.y<map.y||c.y>=map.y+map.height||c.mass<=.005)continue;
  const size=Math.min(tileW*.69,tileH*.72),x=(c.x+.42+.13*c.bias)*tileW,y=(c.y+.43+.17*c.fertility)*tileH;
  tree(x,y,size,c.mass,c.id);
 }
 if(!game.finished){const x=game.selected.x*w,y=game.selected.y*h,r=game.radius()*h;
  ctx.fillStyle='#a2e6ab10';ctx.strokeStyle='#9fffc8';ctx.lineWidth=2;ctx.setLineDash([8,7]);ctx.beginPath();ctx.ellipse(x,y,game.radius()*w/1.3,game.radius()*h,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle='#d5ffd7';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.moveTo(x-17,y);ctx.lineTo(x-8,y);ctx.moveTo(x+8,y);ctx.lineTo(x+17,y);ctx.moveTo(x,y-17);ctx.lineTo(x,y-8);ctx.moveTo(x,y+8);ctx.lineTo(x,y+17);ctx.stroke();
 }
 drawTrialTelegraphs(w,h);
 for(let i=0;i<game.workers.length;i++){
  const worker=game.workers[i],target=game.cells[worker.targetId];
  const x=worker.busy&&target?(target.x+.5)*tileW:(map.x+.35+i*.42)*tileW;
  const y=worker.busy&&target?(target.y+.5)*tileH:(map.y+map.height-.25)*tileH;
  const phase=worker.clock/game.swingPeriod(),angle=worker.busy?(phase<.18?1.15-phase/.18*1.5:phase<.65?-.35:-.35-(phase-.65)/.35*1.1):-.4;
  if(worker.global){
   ctx.save();ctx.translate(x,y-20+Math.sin(game.time*8+i)*3);ctx.globalAlpha=worker.busy?1:.45;
   ctx.fillStyle=game.stage===4?'#e6bb7b':'#b3ecce';ctx.beginPath();ctx.ellipse(0,0,9,6,0,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#c9f5e4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-16,-5);ctx.lineTo(16,-5);ctx.moveTo(0,-9);ctx.lineTo(0,-3);ctx.stroke();
   if(worker.busy){ctx.strokeStyle='#b7f5d866';ctx.beginPath();ctx.moveTo(0,5);ctx.lineTo(0,20);ctx.stroke();}ctx.restore();continue;
  }
  ctx.save();ctx.translate(x+8,y-5);ctx.rotate(angle);ctx.globalAlpha=worker.busy?1:.4;
  ctx.strokeStyle='#b8844e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,-13);ctx.stroke();
  ctx.fillStyle='#dbe9d6';ctx.strokeStyle='#284344';ctx.lineWidth=1.5;
  if(game.stage===2){ctx.beginPath();ctx.moveTo(-16,-9);ctx.quadraticCurveTo(0,-28,19,-11);ctx.lineTo(6,-16);ctx.lineTo(-4,-16);ctx.closePath();ctx.fill();ctx.stroke();}
  else if(game.stage===3){ctx.beginPath();ctx.moveTo(-1,-16);ctx.quadraticCurveTo(26,-28,21,0);ctx.quadraticCurveTo(17,-13,-1,-10);ctx.closePath();ctx.fill();ctx.stroke();}
  else if(game.stage===4){ctx.beginPath();for(let k=0;k<24;k++){const a=k*Math.PI/12,r=k%2?8:12;const px=Math.cos(a)*r+4,py=Math.sin(a)*r-14;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#bc9459';ctx.beginPath();ctx.arc(4,-14,3,0,Math.PI*2);ctx.fill();}
  else {ctx.beginPath();ctx.moveTo(-2,-15);ctx.lineTo(13,-20);ctx.lineTo(17,-7);ctx.lineTo(-2,-10);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();
 }
 if(game.stage===4)drawGrid(tileW,tileH);
 for(const id of game.spores){const c=game.cells[id],x=(c.x+.5)*tileW,y=(c.y+.5)*tileH;ctx.strokeStyle=game.bloomActive()?'#ffb0df':'#d8ff92';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,20+Math.sin(game.time*5)*3,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#eeffb2';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.fillText('✦',x,y-25);}
 for(const b of game.bugs)drawMonster(b,w,h);
 if(game.boss){const b=game.boss,x=b.x*w,y=b.y*h;
  fieldArt.boss(ctx,game,x,y);
  ctx.fillStyle='#171a29';ctx.fillRect(x-85,Math.max(map.y*tileH+7,y-73),170,12);ctx.fillStyle='#ff9873';ctx.fillRect(x-85,Math.max(map.y*tileH+7,y-73),170*b.hp/b.maxHp,12);
 }
 for(const f of game.fx){const x=f.x*w,y=f.y*h;ctx.globalAlpha=Math.max(0,1-f.t/.8);ctx.strokeStyle=f.type==='lightning'?'#c6eaff':f.type==='kill'?'#ffa6e5':['blast','freeze','overload'].includes(f.type)?'#8feeff':['purify','power'].includes(f.type)?'#cbff8e':'#ffdeaa';ctx.lineWidth=f.type==='chip'?2:4;
  ctx.beginPath();
  if(f.type==='slash'){const a=-1.8+f.t*7;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.strokeStyle='#b8844e';ctx.lineWidth=5;ctx.moveTo(0,20);ctx.lineTo(0,-22);ctx.stroke();ctx.fillStyle='#edfff4';ctx.fillRect(-3,-26,19,13);ctx.restore();ctx.beginPath();ctx.strokeStyle='#f3ffd4';ctx.arc(x,y,24,-2.3+f.t*3,-.2+f.t*3);}
  else if(f.type==='sweep'){ctx.lineWidth=6;ctx.arc(x,y,25+f.t*150,-2+f.t*6,2+f.t*6);}
  else if(f.type==='shutdown'||f.type==='blackout'||f.type==='overload'){for(let k=0;k<8;k++){const a=k*Math.PI/4;ctx.moveTo(x+Math.cos(a)*8,y+Math.sin(a)*8);ctx.lineTo(x+Math.cos(a)*(25+f.t*90),y+Math.sin(a)*(25+f.t*90));}}
  else if(f.type==='warning'){const dx=game.selected.x*w-x,dy=game.selected.y*h-y;ctx.moveTo(x,y);ctx.lineTo(x+dx*f.t/.8,y+dy*f.t/.8);ctx.arc(x+dx*f.t/.8,y+dy*f.t/.8,5,0,Math.PI*2);}
  else if(f.type==='lightning'){ctx.moveTo(x-18,y-60);ctx.lineTo(x+8,y-25);ctx.lineTo(x-9,y-25);ctx.lineTo(x+15,y+12);}
  else if(f.type==='chip'||f.type==='kill'||f.type==='chop'){for(let k=0;k<6;k++){const a=k*Math.PI/3,r=8+f.t*45;ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7));}}
  else ctx.arc(x,y,15+f.t*85,0,Math.PI*2);
  ctx.stroke();ctx.globalAlpha=1;}

 fieldArt.effects(ctx,game,map);
 ctx.restore();
 if(game.finished||game.roundState!=='active'){
  const cw=canvas.width,ch=canvas.height;
  ctx.fillStyle='#0b1723df';ctx.fillRect(0,0,cw,ch);ctx.textAlign='center';
  ctx.fillStyle=game.roundState==='cleared'?'#fce6a2':'#eeb5ac';ctx.font=`bold ${Math.min(46,cw*.08)}px system-ui`;
  ctx.fillText(game.finished?`STAGE 0${game.stage} CLEAR!`:game.roundState==='cleared'?`ROUND ${game.round} CLEAR!`:'TIME UP',cw/2,ch*.42);
  ctx.fillStyle='#e5f3f1';ctx.font=`${Math.min(20,cw*.055)}px system-ui`;
  ctx.fillText(game.finished?'스테이지 정화 완료':game.roundState==='cleared'?'새 강화 해금!':'강화·자원 유지',cw/2,ch*.58);
 }
}

function loop(now){const dt=Math.min(.12,(now-last)/1000);last=now;if(!document.hidden&&!paused){accum=Math.min(.25,accum+dt);let steps=0;while(accum>=.05&&steps<5){game.tick(.05);audio.tick(.05,game);if(game.kills>lastAudioKill){audio.effect('kill');lastAudioKill=game.kills;}const workFX=game.fx.findLast(f=>f.type==='chop');if(workFX&&workFX!==lastWorkFX&&game.time-lastAudioTime>.12){lastWorkFX=workFX;audio.effect(game.stage===4?'city':game.stage===3?'swamp':game.stage===2?'mine':'hit');if(workFX.depleted&&game.stage===1)audio.effect('fall');lastAudioTime=game.time;}const strike=game.fx.findLast(f=>f.type==='slash'||f.type==='warning');if(strike&&strike!==lastAttackFX){audio.effect(strike.type==='slash'?'attack':'enemy');lastAttackFX=strike;}if(game.purified>lastPurified){audio.effect('purify');lastPurified=game.purified;}if(game.shutdowns>lastShutdowns){audio.effect('overload');lastShutdowns=game.shutdowns;}accum-=.05;steps++;}drawField();if(now-lastUI>250){renderUI();lastUI=now;}if(now-lastSave>30000){save();lastSave=now;}}
 frameCount++;if(now-fpsLast>2000){fps=Math.round(frameCount*1000/(now-fpsLast));frameCount=0;fpsLast=now;$('fps').textContent=`${fps} FPS`;}
 requestAnimationFrame(loop);}
function openModal(mode='settings'){modalMode=mode;paused=true;$('modal-backdrop').classList.remove('hidden');$('modal-error').textContent='';$('modal-title').textContent=mode==='finish'?'🏆 스테이지 클리어!':'⚙ 설정';$('modal-subtitle').textContent=mode==='finish'?'현재 숲·광산·오염된 늪·기계도시까지 플레이 가능합니다. 다음 스테이지 버튼으로 진행하세요.':'설정을 여는 동안 일시정지됩니다. 브라우저 저장 + 이전 저장 백업. 다른 기기에서는 JSON을 가져오세요.';}
$('settings-button').onclick=()=>{audio.unlock();openModal();};function closeModal(){paused=trialMenu;last=performance.now();$('modal-backdrop').classList.add('hidden');}
$('close-modal').onclick=closeModal;
$('modal-backdrop').addEventListener('click',e=>{if(e.target===$('modal-backdrop'))closeModal();});
$('save-button').onclick=()=>{$('modal-error').textContent=save()?'저장했습니다.':'저장에 실패했습니다.';};
$('export-button').onclick=()=>{if(trialMode)saveTrial();const raw={format:'world-breaker-bundle-v1',campaign:(trialMode?campaignGame:game).toJSON(),research:trialStore};const data=new Blob([JSON.stringify(raw,null,2)],{type:'application/json'});const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=`world-breaker-save-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);};
$('import-file').onchange=async(e)=>{try{const f=e.target.files?.[0];if(!f)return;if(f.size>1_000_000)throw new Error('파일 크기는 1MB를 넘을 수 없습니다.');const raw=JSON.parse(await f.text());if(raw.trial)throw new Error('본편과 연구가 포함된 백업을 가져오세요.');const bundled=raw.format==='world-breaker-bundle-v1';const loaded=ForestGame.fromJSON(bundled?raw.campaign:raw);const research=bundled?validateTrialStore(raw.research,loaded.stage):null;game=loaded;campaignGame=null;trialMode=trialMenu=false;document.body.dataset.trial='';saveBlocked=false;if(research){trialStore=research;trialSaveBlocked=false;saveTrial();}save();renderUI();$('modal-error').textContent='저장 파일을 불러왔습니다.';}catch(err){$('modal-error').textContent='가져오기 실패: '+err.message;}finally{e.target.value='';}};
$('reset-button').onclick=()=>{if(trialMode){$('modal-error').textContent='도전 종료는 편성 화면의 종료 버튼을 이용하세요. 본편은 초기화하지 않습니다.';return;}if(confirm('현재 본편을 초기화할까요? 연구 도전 기록은 유지됩니다. 저장 파일을 내보내지 않았다면 복구할 수 없습니다.')){game=new ForestGame();campaignGame=null;saveBlocked=false;save();renderUI();closeModal();}};
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden)save();});window.addEventListener('pagehide',save);
$('next-stage').onclick=()=>{if(game.nextStage()){renderUI();save();}};
$('sound-toggle').onclick=()=>{const enabled=audio.toggle();if(enabled)audio.unlock();$('sound-toggle').textContent=enabled?'🔊 효과음 켜짐':'🔇 효과음 꺼짐';};
$('round-next').onclick=()=>{audio.unlock();if(game.nextRound()){renderUI();save();}};
$('round-retry').onclick=()=>{audio.unlock();if(game.retryRound()){renderUI();save();}};
$('combat-toggle').onclick=()=>{game.combatFirst=!game.combatFirst;renderUI();save();};
let trialNewUnlocks=[],trialNewCards=[];
function validateTrialStore(raw,maxStage=4){if(!raw||raw.version!==1)throw new Error('알 수 없는 연구 저장');const profile=trialProfile(raw.profile);if(raw.run){if(raw.run.trial?.id>=profile.nextId)throw new Error('손상된 도전 번호');TrialGame.fromJSON(raw.run,profile,Math.max(maxStage,raw.run.stage||1));}return {version:1,profile,run:raw.run||null};}
function saveTrial(){if(trialSaveBlocked)return false;try{if(trialMode)trialStore.run=game.toJSON();const previous=localStorage.getItem(TRIAL_STORAGE);if(previous){try{validateTrialStore(JSON.parse(previous));localStorage.setItem(TRIAL_STORAGE+'-backup',previous);}catch{}}localStorage.setItem(TRIAL_STORAGE,JSON.stringify(trialStore));$('save-status').textContent='본편·연구 분리 저장 완료';return true;}catch{$('save-status').textContent='연구 저장 불가 · 설정에서 JSON 내보내기';return false;}}
function loadTrials(){try{const raw=localStorage.getItem(TRIAL_STORAGE);if(raw)trialStore=validateTrialStore(JSON.parse(raw),game.stage);}catch{try{const backup=localStorage.getItem(TRIAL_STORAGE+'-backup');if(!backup)throw new Error();trialStore=validateTrialStore(JSON.parse(backup),game.stage);}catch{trialSaveBlocked=true;$('trial-entry-note').textContent='연구 저장 읽기 실패 · 자동 덮어쓰기 중지';}}}
function trialOption(select,value,text){const option=document.createElement('option');option.value=String(value);option.textContent=text;select.append(option);}
function refreshTrialMenu(){
 const profile=trialStore.profile,campaign=trialMode?campaignGame:game;trialDraft.stage=Math.min(trialDraft.stage,campaign.stage,4);trialDraft.level=Math.min(trialDraft.level,(profile.wins[trialDraft.stage]||0)+1,3);
 $('trial-stage').replaceChildren();for(const stage of STAGES.filter(s=>s.id<=Math.min(campaign.stage,4)))trialOption($('trial-stage'),stage.id,stage.name);
 $('trial-stage').value=String(trialDraft.stage);$('trial-level').replaceChildren();for(const level of TRIAL_LEVELS.filter(l=>l.id<=Math.min(3,(profile.wins[trialDraft.stage]||0)+1)))trialOption($('trial-level'),level.id,level.name);
 $('trial-level').value=String(trialDraft.level);$('trial-style').value=trialDraft.style;
 const level=TRIAL_LEVELS[trialDraft.level-1],used=buildCost(trialDraft.build);$('trial-budget').textContent=`편성 ${used} / ${level.budget}점 · 남은 ${level.budget-used}점`;
 $('trial-rules').textContent=level.desc+' · 다음 난이도는 이 지역 클리어로 해금';$('trial-style-help').textContent=TRIAL_STYLES.find(s=>s.id===trialDraft.style).desc;
 for(let i=0;i<2;i++)$('trial-skill-'+i).value=trialDraft.skills[i];
 $('trial-cards').replaceChildren();for(const card of TRIAL_CARDS){const open=unlockedCards(profile).includes(card.id),rank=trialDraft.build[card.id]||0,el=document.createElement('div');el.className='trial-card';const name=document.createElement('strong');name.textContent=card.name+` · ${rank}/${card.max}`;const desc=document.createElement('p');desc.textContent=open?card.desc+` · 단계당 ${card.cost}점`:`🔒 ${card.unlock}`;const actions=document.createElement('div');const minus=document.createElement('button');minus.textContent='−';minus.setAttribute('aria-label',card.name+' 감소');minus.disabled=rank===0;minus.onclick=()=>{trialDraft.build[card.id]=rank-1;refreshTrialMenu();};const plus=document.createElement('button');plus.textContent='+';plus.setAttribute('aria-label',card.name+' 증가');plus.disabled=!open||rank>=card.max||used+card.cost>level.budget;plus.onclick=()=>{trialDraft.build[card.id]=rank+1;refreshTrialMenu();};actions.append(minus,plus);el.append(name,desc,actions);$('trial-cards').append(el);}
 const unlocked=unlockedRelics(profile);$('trial-relics').replaceChildren();$('trial-research').replaceChildren();for(const relic of TRIAL_RELICS){const open=unlocked.includes(relic.id),selected=trialDraft.relics.includes(relic.id),b=document.createElement('button');b.className='trial-relic';b.textContent=(selected?'✓ ':'')+relic.name+' · '+relic.desc;b.setAttribute('aria-pressed',String(selected));b.disabled=!open||!selected&&trialDraft.relics.length>=2;b.onclick=()=>{trialDraft.relics=selected?trialDraft.relics.filter(id=>id!==relic.id):[...trialDraft.relics,relic.id];refreshTrialMenu();};if(open)$('trial-relics').append(b);const info=document.createElement('p');info.textContent=(open?'✓ ':'🔒 ')+relic.name+' · '+(open?relic.desc:relic.requirement);$('trial-research').append(info);}
 $('trial-research-count').textContent=`강화 ${unlockedCards(profile).length}/${TRIAL_CARDS.length} · 유물 ${unlocked.length}/${TRIAL_RELICS.length} 해금 · 누적 격파 ${profile.kills}`;
 $('trial-history').replaceChildren();for(const row of profile.history){const p=document.createElement('p');p.textContent=row.summary;$('trial-history').append(p);}if(!profile.history.length)$('trial-history').textContent='아직 도전 기록이 없습니다.';
 const unfinished=trialStore.run&&trialStore.run.roundState!=='failed'&&!trialStore.run.finished;$('trial-resume').hidden=!unfinished;$('trial-discard').hidden=!unfinished;$('trial-start').disabled=trialSaveBlocked||unfinished||used>level.budget;
}
function showTrialMenu(){if(!trialMode){save();campaignGame=game;}else saveTrial();trialMenu=true;paused=true;document.body.dataset.trial='menu';$('trial-menu').hidden=false;refreshTrialMenu();}
function resetViewClocks(){last=performance.now();accum=0;artTime=game.time;lastAudioKill=game.kills;lastPurified=game.purified;lastShutdowns=game.shutdowns;lastAudioTime=game.time;lastWorkFX=lastAttackFX=null;upgradeKey=tabKey='';}
function activateTrial(run){if(!trialMode)campaignGame=game;game=run;trialMode=true;trialMenu=false;paused=false;trialNewUnlocks=[];trialNewCards=[];document.body.dataset.trial='active';$('trial-menu').hidden=true;resetViewClocks();renderUI();drawField();saveTrial();}
function leaveTrial(){if(trialMode){saveTrial();game=campaignGame;trialMode=false;}trialMenu=false;paused=false;document.body.dataset.trial='';$('trial-menu').hidden=true;resetViewClocks();renderUI();drawField();}
function discardTrial(){try{const run=trialMode?game:trialStore.run?TrialGame.fromJSON(trialStore.run,trialStore.profile,4):null;if(run)recordTrial(trialStore.profile,run,!run.finished&&run.roundState!=='failed');if(trialMode){game=campaignGame;trialMode=false;}trialStore.run=null;saveTrial();trialMenu=true;paused=true;document.body.dataset.trial='menu';$('trial-menu').hidden=false;refreshTrialMenu();}catch(err){$('trial-error').textContent=err.message;}}
function renderTrialStatus(){
 $('trial-status').hidden=!trialMode;if(!trialMode)return;
 const t=game.trial;$('trial-metrics').textContent=`수동 ${game.manualPower().toFixed(1)} · 자동 ${game.autoPower().toFixed(1)} · 생성 ${game.growthRate().toFixed(1)}/초 · 보호막 ${Math.ceil(game.shield)}`;
 $('trial-heading').textContent=`${game.stageData().name} · ${TRIAL_LEVELS[t.level-1].name} · ${t.wave+1}/3구간`;
 $('trial-loadout').textContent=TRIAL_STYLES.find(s=>s.id===t.style).name+' · '+TRIAL_CARDS.filter(c=>t.build[c.id]).map(c=>c.name+' '+t.build[c.id]).join(' / ')+' · 유물 '+t.relics.map(id=>TRIAL_RELICS.find(r=>r.id===id).name).join(' + ');
 $('next-stage').hidden=$('round-next').hidden=$('round-retry').hidden=true;$('content-end').hidden=true;$('skill-loadout').hidden=true;
 $('stage-label').textContent=`연구 도전 ${t.wave+1}/3 · ${game.rules().finale?'보스 대청소':'채집과 전투'}`;$('shield').textContent=`보호막 ${Math.ceil(game.shield)}/100 · 회피 ${t.dodges} · 피격 ${t.hits}`;
 $('round-help').textContent=game.rules().finale?'15초 후 생성 종료 → 자원·장치 정리 → 보스 격파':game.stage===4?'모든 전력 장치 정지 + 잔량 정리 · 보호막 자동 회복 없음':`목표 ${Math.ceil(game.rules().goal)}개 채집 + 잔량 정리 · 보호막 자동 회복 없음`;
 const resting=game.roundState!=='active';$('trial-result').hidden=!resting;if(!resting)return;
 if(t.id>trialStore.profile.lastRecorded&&(game.finished||game.roundState==='failed')){const before=unlockedCards(trialStore.profile);trialNewUnlocks=recordTrial(trialStore.profile,game);trialNewCards=unlockedCards(trialStore.profile).filter(id=>!before.includes(id));saveTrial();}
 $('trial-unlocks').textContent=trialNewUnlocks.length||trialNewCards.length?'새 연구 해금: '+[...trialNewUnlocks.map(id=>TRIAL_RELICS.find(r=>r.id===id).name),...trialNewCards.map(id=>TRIAL_CARDS.find(c=>c.id===id).name)].join(' · '):game.finished?'클리어 기록 보존 · 이 지역의 다음 난이도와 다른 시작 특성에 도전하세요.':'연구 조건과 기록은 도전 종료 후 편성 화면에서 확인할 수 있어요.';
 const diagnosis=game.shield<=0?'보호막 파괴: 예고 지점 이탈·적 우선 격파·충격 흡수를 검토하세요.':game.boss?`보스 HP ${Math.ceil(game.boss.hp)} 남음: 공격 직후 약점·공격형 스킬 조합을 검토하세요.`:game.roundState==='failed'?`채집 ${Math.floor(game.roundHarvest)}/${Math.ceil(game.rules().goal)} · 잔량 ${Math.ceil(game.totalMass())}: 처리 위력·전개 범위·막판 봉인을 검토하세요.`:'구간 통과! 다음 구간은 더 많은 자원이 생성됩니다. 정비 보상 하나를 고르세요.';
 $('trial-analysis').textContent=(game.finished?'연구 도전 클리어! ':diagnosis)+` · 격파 ${game.kills} · 스킬 ${t.casts}회 · 피격 ${t.hits} · 회피 ${t.dodges}`;
 const key=t.id+':'+t.wave+':'+game.roundState;if($('trial-boons').dataset.key!==key){$('trial-boons').dataset.key=key;$('trial-boons').replaceChildren();if(!game.finished&&game.roundState==='cleared')for(const id of t.offers){const boon=TRIAL_BOONS.find(b=>b.id===id),b=document.createElement('button');b.textContent=boon.name+' · '+boon.desc;b.onclick=()=>{if(game.nextRound(id)){resetViewClocks();renderUI();saveTrial();}};$('trial-boons').append(b);}}
 $('trial-rebuild').hidden=!game.finished&&game.roundState!=='failed';
}
function drawTrialTelegraphs(w,h){if(!trialMode)return;const aims=game.bugs.filter(b=>b.aim).map(b=>b.aim);if(game.trial.bossAim)aims.push(game.trial.bossAim);for(const p of aims){const x=p.x*w,y=p.y*h;ctx.fillStyle='#ef6c6644';ctx.strokeStyle='#ffd290';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,.09*w/1.3,.09*h,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-8,y-8);ctx.lineTo(x+8,y+8);ctx.moveTo(x+8,y-8);ctx.lineTo(x-8,y+8);ctx.stroke();}}
loadTrials();trialDraft.stage=game.stage;if(trialStore.run){const t=trialStore.run.trial;trialDraft={stage:t.stage,level:t.level,style:t.style,build:{...t.build},relics:[...t.relics],skills:[...t.skills]};}
for(const style of TRIAL_STYLES)trialOption($('trial-style'),style.id,style.name);
for(let i=0;i<2;i++){for(const skill of SKILLS)trialOption($('trial-skill-'+i),skill.id,skill.name);$('trial-skill-'+i).onchange=()=>{const id=$('trial-skill-'+i).value,j=1-i;if(trialDraft.skills[j]===id)trialDraft.skills[j]=trialDraft.skills[i];trialDraft.skills[i]=id;refreshTrialMenu();};}
$('trial-stage').onchange=()=>{trialDraft.stage=Number($('trial-stage').value);refreshTrialMenu();};$('trial-level').onchange=()=>{trialDraft.level=Number($('trial-level').value);refreshTrialMenu();};$('trial-style').onchange=()=>{trialDraft.style=$('trial-style').value;refreshTrialMenu();};
$('trial-build-clear').onclick=()=>{trialDraft.build={};refreshTrialMenu();};$('trial-open').onclick=showTrialMenu;$('trial-back').onclick=leaveTrial;$('trial-abandon').onclick=$('trial-discard').onclick=$('trial-rebuild').onclick=discardTrial;
$('trial-start').onclick=()=>{try{if(trialSaveBlocked)throw new Error('연구 저장을 읽을 수 없어 새 도전을 중지했습니다.');if(trialStore.run&&trialStore.run.roundState!=='failed'&&!trialStore.run.finished)throw new Error('진행 도전을 이어 하거나 종료한 뒤 새로 시작하세요.');const profile=trialStore.profile,id=profile.nextId,seed=(Date.now()^id*7919)|0;const run=new TrialGame({...trialDraft,id,seed},profile,(trialMode?campaignGame:game).stage);profile.nextId++;$('trial-error').textContent='';activateTrial(run);}catch(err){$('trial-error').textContent=err.message;}};
$('trial-resume').onclick=()=>{try{activateTrial(TrialGame.fromJSON(trialStore.run,trialStore.profile,4));}catch(err){$('trial-error').textContent=err.message;}};
renderTabs();renderUI();requestAnimationFrame(loop);

// UI only: keep the field visible while browsing upgrades in a separate sheet.
const upgradeDialog=document.getElementById("upgrade-dialog");document.getElementById("open-upgrades").addEventListener("click",()=>upgradeDialog.showModal());document.getElementById("close-upgrades").addEventListener("click",()=>upgradeDialog.close());
