import {ForestGame} from './engine.js';
import {UPGRADES,GROUPS,TREE_COLORS,tierOf,fmt,W,H,STAGES} from './data.js';
const $=id=>document.getElementById(id);
const canvas=$('field'),ctx=canvas.getContext('2d',{alpha:false});
const STORAGE='world-breaker-forest-alpha-v1';
let game,activeTab='work',last=performance.now(),accum=0,lastUI=0,lastSave=0,frameCount=0,fps=60,fpsLast=performance.now();
let isDragging=false,sawTap=false,modalMode='settings',paused=false,saveBlocked=false,upgradeKey='',upgradeRows=[];
function loadGame(){
 try{const raw=localStorage.getItem(STORAGE);if(raw)return ForestGame.fromJSON(JSON.parse(raw));}
 catch(err){
  try{const backup=localStorage.getItem(STORAGE+'-backup');if(backup){const restored=ForestGame.fromJSON(JSON.parse(backup));restored.notify('주 저장 손상: 백업 저장에서 복구했습니다.');return restored;}}catch{}
  saveBlocked=true;$('save-status').textContent='저장 읽기 실패 · 자동 덮어쓰기 중지';
 }
 return new ForestGame();
}
game=loadGame();
function save(){if(saveBlocked)return false;try{
 const previous=localStorage.getItem(STORAGE);
 if(previous){try{ForestGame.fromJSON(JSON.parse(previous));localStorage.setItem(STORAGE+'-backup',previous);}catch{}}
 localStorage.setItem(STORAGE,JSON.stringify(game.toJSON()));$('save-status').textContent='저장 완료 · '+new Date().toLocaleTimeString('ko-KR');return true;
 }catch(err){$('save-status').textContent='저장 불가 · 설정에서 JSON 내보내기';return false;}}
function setTarget(ev){const r=canvas.getBoundingClientRect();game.setTarget((ev.clientX-r.left)/r.width,(ev.clientY-r.top)/r.height);if(!sawTap){sawTap=true;$('field-notice').style.opacity='0';}}
canvas.addEventListener('pointerdown',ev=>{if(game.finished)return;isDragging=true;canvas.setPointerCapture?.(ev.pointerId);setTarget(ev);});
canvas.addEventListener('pointermove',ev=>{if(game.finished)return;if(ev.pointerType==='mouse'||isDragging)setTarget(ev);});
canvas.addEventListener('pointerup',()=>isDragging=false);canvas.addEventListener('pointercancel',()=>isDragging=false);
canvas.addEventListener('keydown',ev=>{const moves={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.05],ArrowDown:[0,.05]};if(moves[ev.key]){ev.preventDefault();const [x,y]=moves[ev.key];game.setTarget(game.selected.x+x,game.selected.y+y);}});
function renderTabs(){const el=$('tabs');el.replaceChildren();for(const group of GROUPS){const b=document.createElement('button');b.textContent=group.name;b.className=group.id===activeTab?'active':'';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(group.id===activeTab));b.onclick=()=>{activeTab=group.id;renderTabs();renderUpgrades();};el.append(b);}}
function renderUpgrades(){
 const defs=UPGRADES.filter(x=>x.group===activeTab&&x.stage<=game.stage);
 const key=game.stage+activeTab+JSON.stringify(game.upgrades);
 if(key!==upgradeKey){upgradeKey=key;upgradeRows=[];const parent=$('upgrade-list');parent.replaceChildren();
 for(const def of defs){
  const el=document.createElement('div');el.className='upgrade';
  const info=document.createElement('div');info.className='info';
  const name=document.createElement('div');name.className='name';
  const desc=document.createElement('div');desc.className='desc';desc.textContent=def.desc;
  const progress=document.createElement('div');progress.className='rank';
  const b=document.createElement('button');b.onclick=()=>{if(game.buy(def.id)){renderUI();save();}};
  info.append(name,desc,progress);el.append(info,b);parent.append(el);upgradeRows.push({def,el,name,progress,b});
 }}
 for(const {def,el,name,progress,b} of upgradeRows){const rank=game.rank(def.id),unlocked=game.unlocked(def),complete=rank>=def.max,cost=game.cost(def);
 el.className='upgrade'+(!unlocked?' locked':'')+(complete?' complete':'');name.textContent=(unlocked?'':'🔒 ')+def.name;
 const requirement=def.requires&&!game.rank(def.requires)?UPGRADES.find(d=>d.id===def.requires).name+' 필요':`${def.min}회 강화 필요`;
 progress.textContent=`${rank}/${def.max}`+(!unlocked?' · '+requirement:'');
 b.textContent=complete?'MAX':unlocked?fmt(cost)+' ◈':'잠김';b.disabled=!(unlocked&&!complete&&game.wood>=cost);
 }}
function renderUI(){const s=game.getStats();document.body.dataset.stage=game.stage;$('world-title').textContent=`STAGE 0${game.stage} · ${game.stageData().name}`;$('shield').textContent=`보호막 ${Math.ceil(game.shield)} · ${game.combatFirst?'전투 우선':'채집 우선'}`;$('next-stage').hidden=!game.finished||game.stage!==1;$('campaign').textContent=STAGES.map(d=>`${d.id}. ${d.name} (${d.nodes})${d.implemented?'':' · 개발 예정'}`).join(' / ');$('wood').textContent=fmt(game.wood);$('essence').textContent=fmt(game.essence);$('power').textContent=fmt(s.manual+s.auto);$('growth').textContent=fmt(s.growth);
 $('upgrades-owned').textContent=`${s.distinctNodes} / ${game.stage===1?24:56}`;$('field-stats').textContent=`잔량 ${fmt(s.mass)} · 목표 ${fmt(game.stageHarvest)}/${fmt(game.stageData().goal)}`;
 $('hint').textContent=game.messages[0]?.message||game.hint;
 if(game.finished){$('stage-label').textContent=`🏆 STAGE 0${game.stage} · 클리어!`;$('stage-progress').textContent='COMPLETE';$('progress-fill').style.width='100%';}
 else if(game.boss){$('stage-label').textContent=`${game.stageData().boss} · ${game.stage===2?(game.weakOpen()?'약점 개방!':'장갑 보호 중'): '중앙 공격!'}`;$('stage-progress').textContent=`${Math.ceil(100*game.boss.hp/game.boss.maxHp)}% HP`;$('progress-fill').style.width=`${100*(1-game.boss.hp/game.boss.maxHp)}%`;}
 else {$('stage-label').textContent=s.stable>0?'🔓 고대 나무 봉인 해제 중…':`${game.stageData().name} · 잔량 12% + 수확 목표 달성${game.stage===2?' · '+(game.weakOpen()?'약점 개방!':'장갑 보호'):''}`;$('stage-progress').textContent=`${Math.floor(s.progress*100)}% 정리`;$('progress-fill').style.width=`${Math.min(100,s.progress*100)}%`;}
 renderUpgrades();}
function pathRoundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function tree(x,y,size,mass,seed){
 if(game.stage===2){ore(x,y,size,mass);return;}const tier=tierOf(mass),color=TREE_COLORS[tier];ctx.save();ctx.translate(x,y);
 // Ground shadow + simple, entirely original procedural vector artwork.
 ctx.fillStyle='#0b2722a8';ctx.beginPath();ctx.ellipse(0,size*.31,size*.48,size*.23,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#744b33';ctx.lineWidth=Math.max(2,size*.13);ctx.beginPath();ctx.moveTo(0,size*.08);ctx.lineTo(0,size*.34);ctx.stroke();
 const crown=size*(1+(seed%7)*.025);ctx.fillStyle=color;ctx.strokeStyle='#102a2b';ctx.lineWidth=1.8;
 for(let k=0;k<3;k++){const rad=crown*(.4-k*.065);ctx.beginPath();ctx.arc((k-1)*crown*.17,-k*crown*.18,rad,0,Math.PI*2);ctx.fill();ctx.stroke();}
 ctx.fillStyle='#ffffff5c';ctx.beginPath();ctx.ellipse(-crown*.17,-crown*.23,crown*.1,crown*.045,-.5,0,Math.PI*2);ctx.fill();
 if(mass>=10){ctx.fillStyle='#0b1a22b8';pathRoundRect(-size*.4,size*.3,size*.8,size*.27,4);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font=`${Math.max(8,size*.22)}px system-ui`;const n=Math.floor(Math.log10(mass));ctx.fillText('×'+(10**n),0,size*.5);}
 ctx.restore();}
function ore(x,y,size,mass){ctx.save();ctx.translate(x,y);const tier=tierOf(mass);ctx.fillStyle=game.weakOpen()?'#95e9f7':TREE_COLORS[Math.max(1,tier)];ctx.strokeStyle='#10162a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-size*.5,size*.3);ctx.lineTo(-size*.35,-size*.3);ctx.lineTo(0,-size*.6);ctx.lineTo(size*.5,-size*.2);ctx.lineTo(size*.4,size*.35);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#ffffff88';ctx.beginPath();ctx.moveTo(0,-size*.6);ctx.lineTo(-size*.1,size*.25);ctx.lineTo(size*.5,-size*.2);ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('×'+(10**tier),0,size*.6);ctx.restore();}
function drawField(){const w=canvas.width,h=canvas.height;ctx.fillStyle=game.stage===2?'#211f39':'#1b3f3b';ctx.fillRect(0,0,w,h);
 const tileW=w/W,tileH=h/H;
 for(const c of game.cells){const px=c.x*tileW,py=c.y*tileH;ctx.fillStyle=game.stage===2?((c.x+c.y)%2?'#292e49':'#303451'):((c.x+c.y)%2?'#245047':'#285549');ctx.fillRect(px,py,tileW+.5,tileH+.5);
  ctx.fillStyle='#ffffff0b';ctx.fillRect(px+2,py+3,2,3);
  if(c.mass>.035){const amount=c.mass, visualSize=Math.min(tileW*.69,tileH*.72);const pX=px+tileW*(.42+(.13*c.bias)),pY=py+tileH*(.43+(.17*c.fertility));
   if(amount>7){tree(pX+tileW*.27,pY-tileH*.15,visualSize*.65,amount*.13,c.id+4);}
   tree(pX,pY,visualSize,amount,c.id);
  }
 }
 if(!game.finished){const x=game.selected.x*w,y=game.selected.y*h,r=game.radius()*h;
  ctx.fillStyle='#a2e6ab10';ctx.strokeStyle='#9fffc8';ctx.lineWidth=2;ctx.setLineDash([8,7]);ctx.beginPath();ctx.ellipse(x,y,game.radius()*w/1.3,game.radius()*h,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle='#d5ffd7';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.moveTo(x-17,y);ctx.lineTo(x-8,y);ctx.moveTo(x+8,y);ctx.lineTo(x+17,y);ctx.moveTo(x,y-17);ctx.lineTo(x,y-8);ctx.moveTo(x,y+8);ctx.lineTo(x,y+17);ctx.stroke();
 }
 for(const b of game.bugs){const x=b.x*w,y=b.y*h;ctx.fillStyle=game.stage===2?'#4d4c8b':'#572344';ctx.strokeStyle=(b.attack||0)>4.5?'#ff684a':'#ffaed2';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,17,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(x-7,y-4,4,4);ctx.fillRect(x+3,y-4,4,4);
  ctx.fillStyle='#171d2b';ctx.fillRect(x-20,y-25,40,5);ctx.fillStyle='#e36d9a';ctx.fillRect(x-20,y-25,40*Math.max(0,b.hp/b.maxHp),5);
 }
 if(game.boss){const b=game.boss,x=b.x*w,y=b.y*h;const pulse=1+Math.sin(game.time*5)*.05;
  ctx.save();ctx.translate(x,y);ctx.scale(pulse,pulse);ctx.fillStyle='#291d36';ctx.beginPath();ctx.arc(0,0,51,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffbd88';ctx.lineWidth=7;ctx.stroke();ctx.fillStyle='#f9d99a';ctx.font='bold 45px system-ui';ctx.textAlign='center';ctx.fillText(game.stage===2?'◆':'♠',0,16);ctx.restore();
  ctx.fillStyle='#171a29';ctx.fillRect(x-85,y-73,170,12);ctx.fillStyle='#ff9873';ctx.fillRect(x-85,y-73,170*b.hp/b.maxHp,12);
 }
 for(const f of game.fx){const x=f.x*w,y=f.y*h;ctx.globalAlpha=Math.max(0,1-f.t/.8);ctx.strokeStyle=f.type==='lightning'?'#c6eaff':f.type==='kill'?'#ffa6e5':f.type==='blast'?'#8feeff':'#ffdeaa';ctx.lineWidth=f.type==='chip'?2:4;
  ctx.beginPath();
  if(f.type==='lightning'){ctx.moveTo(x-18,y-60);ctx.lineTo(x+8,y-25);ctx.lineTo(x-9,y-25);ctx.lineTo(x+15,y+12);}
  else if(f.type==='chip'||f.type==='kill'){for(let k=0;k<6;k++){const a=k*Math.PI/3,r=8+f.t*45;ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7));}}
  else ctx.arc(x,y,15+f.t*85,0,Math.PI*2);
  ctx.stroke();ctx.globalAlpha=1;}

 if(game.finished){ctx.fillStyle='#0b1723df';ctx.fillRect(0,0,w,h);ctx.textAlign='center';ctx.fillStyle='#ffefaa';ctx.font='bold 46px system-ui';ctx.fillText(`STAGE 0${game.stage} CLEAR!`,w/2,h*.4);ctx.fillStyle='#e5f3f1';ctx.font='22px system-ui';ctx.fillText(`${game.stageData().boss} 정화 완료`,w/2,h*.52);ctx.font='16px system-ui';ctx.fillText(game.stage===1?'아래 버튼으로 공명 광산에 진입하세요':'Alpha 0.2 완료 · 늪과 이후 본편은 개발 예정',w/2,h*.61);}
}
function loop(now){const dt=Math.min(.12,(now-last)/1000);last=now;if(!document.hidden&&!paused){accum=Math.min(.25,accum+dt);let steps=0;while(accum>=.05&&steps<5){game.tick(.05);accum-=.05;steps++;}drawField();if(now-lastUI>250){renderUI();lastUI=now;}if(now-lastSave>30000){save();lastSave=now;}}
 frameCount++;if(now-fpsLast>2000){fps=Math.round(frameCount*1000/(now-fpsLast));frameCount=0;fpsLast=now;$('fps').textContent=`${fps} FPS`;}
 requestAnimationFrame(loop);}
function openModal(mode='settings'){modalMode=mode;paused=true;$('modal-backdrop').classList.remove('hidden');$('modal-error').textContent='';$('modal-title').textContent=mode==='finish'?'🏆 첫 번째 스테이지 클리어!':'⚙ 설정';$('modal-subtitle').textContent=mode==='finish'?'알파 0.1은 첫 스테이지까지 실제 플레이 가능합니다. 이후 스테이지는 개발 예정입니다.':'설정을 여는 동안 일시정지됩니다. 브라우저 저장 + 이전 저장 백업. 다른 기기에서는 JSON을 가져오세요.';}
$('settings-button').onclick=()=>openModal();function closeModal(){paused=false;last=performance.now();$('modal-backdrop').classList.add('hidden');}
$('close-modal').onclick=closeModal;
$('modal-backdrop').addEventListener('click',e=>{if(e.target===$('modal-backdrop'))closeModal();});
$('save-button').onclick=()=>{$('modal-error').textContent=save()?'저장했습니다.':'저장에 실패했습니다.';};
$('export-button').onclick=()=>{const data=new Blob([JSON.stringify(game.toJSON(),null,2)],{type:'application/json'});const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=`world-breaker-save-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);};
$('import-file').onchange=async(e)=>{try{const f=e.target.files?.[0];if(!f)return;if(f.size>1_000_000)throw new Error('파일 크기는 1MB를 넘을 수 없습니다.');const raw=JSON.parse(await f.text());const loaded=ForestGame.fromJSON(raw);game=loaded;saveBlocked=false;save();renderUI();$('modal-error').textContent='저장 파일을 불러왔습니다.';}catch(err){$('modal-error').textContent='가져오기 실패: '+err.message;}finally{e.target.value='';}};
$('reset-button').onclick=()=>{if(confirm('현재 게임을 초기화할까요? 저장 파일을 내보내지 않았다면 복구할 수 없습니다.')){game=new ForestGame();saveBlocked=false;save();renderUI();closeModal();}};
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden)save();});window.addEventListener('pagehide',save);
$('next-stage').onclick=()=>{if(game.nextStage()){renderUI();save();}};
$('combat-toggle').onclick=()=>{game.combatFirst=!game.combatFirst;renderUI();save();};
renderTabs();renderUI();requestAnimationFrame(loop);
