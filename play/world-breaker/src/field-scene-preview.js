import {BoarBoss, drawBoar} from './boar-motion.js';
export class FieldScene {
 constructor(){this.time=0;this.mode='field';this.selected=null;this.stock={wood:0,ore:0,herb:0,essence:0};this.events=[];this.nodes=[{x:74,y:138,type:'wood'},{x:132,y:224,type:'wood'},{x:315,y:146,type:'ore'},{x:348,y:246,type:'ore'},{x:70,y:322,type:'herb'},{x:163,y:352,type:'herb'}];this.workers=['wood','ore','herb'].map((type,i)=>({type,x:210+i*13,y:290,phase:'walk',target:i*2,clock:0,cargo:0,facing:1}));this.monsters=[{id:0,name:'가시 멧돼지',kind:'boar',x:268,y:350,hp:144,reward:18,respawn:0},{id:1,name:'그늘 늑대',kind:'wolf',x:335,y:66,hp:60,reward:11,respawn:0},{id:2,name:'이끼 수호자',kind:'guardian',x:82,y:60,hp:80,reward:16,respawn:0}];}
 emit(x,y,text,color='#f6df9b'){this.events.push({x,y,text,color,life:1.3});}
 select(id){if(this.mode!=='field')return false;const m=this.monsters.find(m=>m.id===id&&!m.respawn);if(!m)return false;this.selected=m;this.mode='confirm';return true;}
 cancel(){if(this.mode!=='confirm')return;this.mode='field';this.selected=null;}
 start(){if(this.mode!=='confirm'||!this.selected)return false;const m=this.selected;this.battle={enemy:m,hp:100,enemyHp:m.hp,clock:0,attackCd:0,dodgeCd:0,dodge:0,flash:0,enemyFlash:0,swing:0,turn:0,warning:false,boss:m.kind==='boar'?new BoarBoss(m.hp):null};this.mode='battle';return true;}
 attack(){if(this.mode!=='battle'||this.battle.attackCd>0)return false;const b=this.battle;const damage=b.boss?b.boss.attack():12;if(!damage)return false;b.attackCd=.52;b.swing=.22;b.enemyFlash=.15;b.enemyHp=b.boss?b.boss.hp:Math.max(0,b.enemyHp-damage);this.emit(300,188,'−'+damage+(b.boss?.vulnerable?' 반격!':''),'#ffe4bf');if(!b.enemyHp&&!b.boss){this.stock.essence+=b.enemy.reward;b.enemy.respawn=18;this.mode='victory';}return true;}
 dodge(){if(this.mode!=='battle'||this.battle.dodgeCd>0)return false;this.battle.dodge=.65;this.battle.dodgeCd=1.4;return true;}
 leave(){if(!['battle','victory','defeat'].includes(this.mode))return;this.mode='field';this.selected=null;this.battle=null;}
 tick(dt){dt=Math.max(0,Math.min(.1,dt));if(this.mode==='confirm')return;this.time+=dt;this.events=this.events.filter(e=>(e.life-=dt)>0);if(this.mode==='field'){for(const m of this.monsters)m.respawn=Math.max(0,m.respawn-dt);for(const w of this.workers)this.work(w,dt);}else if(this.mode==='battle'){const b=this.battle;if(b.boss){this.tickBoss(dt);return;}for(const k of ['attackCd','dodgeCd','dodge','flash','enemyFlash','swing'])b[k]=Math.max(0,b[k]-dt);b.clock+=dt;b.warning=b.clock>=1.85;if(b.clock>=2.6){b.clock-=2.6;b.warning=false;b.turn++;if(b.dodge>0)this.emit(100,210,'회피!','#a3f3dc');else{b.hp=Math.max(0,b.hp-22);b.flash=.2;this.emit(100,210,'−22','#ffac9c');if(!b.hp)this.mode='defeat';}}}}
 tickBoss(dt){
  const b=this.battle,step=b.boss.tick(dt,b.dodge>0);if(!step){this.time-=dt;return;}
  for(const k of ['attackCd','dodgeCd','dodge','flash','enemyFlash','swing'])b[k]=Math.max(0,b[k]-step);
  b.clock+=step;b.warning=b.boss.warning;b.enemyHp=b.boss.hp;
  if(b.boss.evaded)this.emit(100,210,'회피!','#a3f3dc');
  if(b.boss.hitPlayer){b.hp=Math.max(0,b.hp-b.boss.damage);b.flash=.2;this.emit(100,210,'−'+b.boss.damage,'#ffac9c');if(!b.hp)this.mode='defeat';}
  if(b.boss.finished){this.stock.essence+=b.enemy.reward;b.enemy.respawn=18;this.mode='victory';}
 }
 work(w,dt){const node=this.nodes[w.target],destination=w.phase==='return'?{x:210,y:287}:node;w.clock+=dt;if(w.phase==='work'){if(w.clock>=1.35){w.cargo=1;w.phase='return';w.clock=0;}return;}const dx=destination.x-w.x,dy=destination.y+22-w.y,d=Math.hypot(dx,dy);if(d>2){const step=Math.min(d,dt*52);w.x+=dx/d*step;w.y+=dy/d*step;if(Math.abs(dx)>1)w.facing=dx>0?1:-1;}else if(w.phase==='return'){this.stock[w.type]+=w.cargo;this.emit(w.x,w.y-22,'+1 '+({wood:'목재',ore:'광석',herb:'약초'}[w.type]));w.cargo=0;w.phase='walk';w.target=(w.target%2===0?w.target+1:w.target-1);w.clock=0;}else{w.phase='work';w.clock=0;}}
}
export function mountField(){
 const canvas=document.getElementById('scene'),ctx=canvas.getContext('2d'),model=new FieldScene(),$=id=>document.getElementById(id);let last=0,uiClock=0;
 let soundOn=false,audio=null,voices=0,seenImpacts=0,previousMode='field';
 function sound(kind){
  if(!soundOn||!audio||document.hidden||voices>=4)return;
  const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
  const f=kind==='hit'?220:kind==='impact'?85:kind==='win'?440:330;
  o.type=kind==='impact'?'triangle':'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(kind==='win'?660:Math.max(40,f*.35),t+.12);
  g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(audio.destination);voices++;o.onended=()=>{o.disconnect();g.disconnect();voices--;};o.start(t);o.stop(t+.18);
 }
 $('sound').onclick=async()=>{try{if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio=new Audio();}if(audio.state==='suspended')await audio.resume();soundOn=!soundOn;$('sound').textContent=soundOn?'효과음 끄기':'효과음 켜기';$('sound').setAttribute('aria-pressed',String(soundOn));}catch{$('sound').textContent='이 기기에서 소리 미지원';$('sound').disabled=true;}};
 const colors={wood:'#f2c179',ore:'#8ccfee',herb:'#c3b0f4'};
 function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
 function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
 function label(text,x,y,c='#e4ead2',size=16){ctx.textAlign='center';ctx.font='bold '+size+'px system-ui';ctx.lineWidth=4;ctx.strokeStyle='#142c25';ctx.strokeText(text,x,y);ctx.fillStyle=c;ctx.fillText(text,x,y);}
 function tree(x,y,t){ellipse(x,y+14,23,8,'#102c2677');rect(x-5,y-15,10,33,'#73513b');rect(x+2,y-11,4,28,'#b28152');for(let i=0;i<3;i++){const yy=y-50+i*14,ww=34+i*11;rect(x-ww/2,yy,ww,19,['#326148','#427958','#539064'][i]);rect(x-ww/2+5,yy,ww-15,5,'#75a372');}if(t)rect(x+8,y-42,4,4,'#d1b976');}
 function ore(x,y){ellipse(x,y+15,24,8,'#102c2677');const pts=[[-24,12],[-18,-12],[-5,-26],[17,-19],[26,12]];ctx.fillStyle='#647c8e';ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(x+a,y+b):ctx.moveTo(x+a,y+b));ctx.closePath();ctx.fill();rect(x-8,y-16,7,13,'#b1e0e5');rect(x+8,y-10,7,16,'#8bc6d9');rect(x-16,y+5,32,7,'#445a70');}
 function herb(x,y){ellipse(x,y+10,19,6,'#102c2677');for(let i=0;i<4;i++){const xx=x-12+i*8;rect(xx,y-13-i%2*8,4,24,'#6eb47a');rect(xx-4,y-16-i%2*8,12,7,'#c1a3e6');rect(xx,y-20-i%2*8,5,6,'#f2cfe7');}}
 function worker(w,scale=1){const motion=w.phase==='work'?Math.sin(w.clock*15):Math.sin(w.clock*10),bob=w.phase==='work'?Math.max(0,motion)*2:Math.abs(motion)*2;ctx.save();ctx.translate(w.x,w.y-bob);ctx.scale(scale,scale);ellipse(0,4,10,4,'#102c2680');ctx.scale(w.facing,1);rect(-6,-11,5,13,'#303c4e');rect(2,-11,5,13,'#303c4e');if(w.phase!=='work'){rect(-6,-2+motion*2,5,5,'#c3a080');rect(2,-2-motion*2,5,5,'#c3a080');}rect(-9,-23,18,15,colors[w.type]);rect(-7,-19,14,9,'#506579');rect(-6,-35,13,13,'#e7b48c');rect(-8,-38,16,7,w.type==='herb'?'#8d72af':'#654532');rect(-9,-32,5,9,'#654532');rect(4,-31,2,2,'#29383f');rect(-11,-21,4,12,'#e7b48c');ctx.save();ctx.translate(10,-22);if(w.phase==='work')ctx.rotate(-.7+motion*.7);rect(0,0,3,21,'#a77f50');if(w.type==='wood'){rect(2,-3,10,8,'#d9e5e2');rect(9,-4,4,10,'#91b7bf');}else if(w.type==='ore'){rect(-5,-4,17,4,'#c1dae0');rect(10,-2,3,6,'#c1dae0');}else{rect(2,10,9,10,'#a87c54');rect(4,6,6,6,'#91c98b');}ctx.restore();if(w.cargo)rect(-13,-22,7,12,'#b89760');ctx.restore();}
 function monster(m,x=m.x,y=m.y,scale=1,flash=false){ctx.save();ctx.translate(x,y+Math.sin(model.time*2+m.id)*2);ctx.scale(scale,scale);ellipse(0,13,25,7,'#0d201e88');const base=flash?'#fff4d3':m.kind==='boar'?'#9c6555':m.kind==='wolf'?'#7893ac':'#698e62';if(m.kind==='guardian'){rect(-19,-30,38,43,base);rect(-26,-19,11,28,base);rect(17,-19,11,28,base);rect(-15,10,11,9,'#435b4a');rect(6,10,11,9,'#435b4a');rect(-16,-38,31,14,'#9ac06f');rect(-20,-31,8,8,'#bbd787');rect(-9,-23,5,5,'#f4d591');rect(6,-23,5,5,'#f4d591');rect(-5,-10,10,4,'#263e36');}
 else{rect(-22,-17,38,26,base);rect(10,-24,20,23,base);rect(12,-34,6,13,base);rect(25,-32,5,13,base);rect(-18,7,7,11,'#3b4049');rect(8,7,7,11,'#3b4049');rect(23,-17,4,4,'#f6ce80');if(m.kind==='boar'){rect(24,-5,12,5,'#d9c398');for(let i=0;i<4;i++)rect(-18+i*7,-24,4,10,'#493f4b');rect(-26,-8,7,4,base);}else{rect(23,-9,14,8,'#c3d3d8');rect(-33,-17,15,9,base);rect(-38,-22,9,8,'#b5cad0');}}ctx.restore();}
 function terrain(){rect(0,0,420,430,'#24483e');for(let y=0;y<430;y+=18)for(let x=0;x<420;x+=18){const n=(x*13+y*7)%43;rect(x+4,y+5,3,2,n<20?'#385b45':'#294c3d');}ctx.strokeStyle='#766e4c';ctx.lineWidth=36;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(210,430);ctx.lineTo(210,270);ctx.lineTo(260,200);ctx.lineTo(330,55);ctx.stroke();ctx.strokeStyle='#8a8058';ctx.lineWidth=22;ctx.stroke();for(let x=0;x<420;x+=38){tree(x,-5);tree(x,454);}for(const n of model.nodes)n.type==='wood'?tree(n.x,n.y,1):n.type==='ore'?ore(n.x,n.y):herb(n.x,n.y);
 rect(183,260,55,27,'#354c55');ctx.fillStyle='#b99a6b';ctx.beginPath();ctx.moveTo(175,260);ctx.lineTo(210,219);ctx.lineTo(246,260);ctx.closePath();ctx.fill();rect(204,254,13,33,'#263a3d');rect(194,284,35,5,'#7a6144');label('야영지',210,319,'#eed5a7',16);}
 function health(x,y,value,max,color,width=130){rect(x,y,width,10,'#1c2c33');rect(x+1,y+1,(width-2)*Math.max(0,value/max),8,color);}
 function battleScene(){
  const b=model.battle,boss=b.boss;
  rect(0,0,420,430,'#233a40');const sky=ctx.createLinearGradient(0,0,0,330);sky.addColorStop(0,'#182c42');sky.addColorStop(1,'#65795f');ctx.fillStyle=sky;ctx.fillRect(0,0,420,300);
  ctx.save();if(boss?.shake>0){const amp=boss.shake*15;ctx.translate(Math.sin(model.time*105)*amp,Math.cos(model.time*87)*amp*.5);}
  for(let i=0;i<8;i++)tree(i*66-10,310);rect(0,315,420,115,'#4a5d49');ellipse(100,314,51,12,'#283d35');
  const dodgeOffset=b.dodge?Math.sin(b.dodge/.65*Math.PI)*-36:0;
  worker({x:102+dodgeOffset,y:301,type:'ore',phase:b.swing?'work':'walk',clock:b.swing?b.swing*5:model.time,facing:1,cargo:0},1.8);
  if(boss)drawBoar(ctx,boss,model.time);else monster(b.enemy,305,277,2,b.enemyFlash>0);
  if(b.warning){ellipse(102,315,48,14,'#ed6c6266');}
  if(b.swing){ctx.strokeStyle='#fff0b8';ctx.lineWidth=7;ctx.beginPath();ctx.arc(boss?205:215,260,45,-1.5,1.3);ctx.stroke();}
  ctx.restore();
  label('선발대',102,53,'#b8e3de',18);label(b.enemy.name,302,53,'#f4cfb8',18);health(32,68,b.hp,100,'#8ddcc1',138);health(236,68,b.enemyHp,b.enemy.hp,'#e8ab82',150);label(b.hp+' / 100',100,104);label(b.enemyHp+' / '+b.enemy.hp,307,104);
  let hint=b.warning?'공격 예고 · 회피!':'빈틈을 보고 공격하세요';
  if(boss){hint=({enter:'우두머리가 다가옵니다',idle:'상대의 움직임을 살피세요',windup:boss.pattern==='charge'?'몸을 낮춥니다 · 돌진 대비':'앞발을 듭니다 · 내려찍기 대비',strike:'지금 회피!',recovery:'숨 고르는 중 · 반격 피해 ×2',dying:'우두머리가 쓰러집니다',dead:'사냥 성공'})[boss.phase];
   if(boss.warning){rect(112,144,196,7,'#243535');rect(112,144,196*boss.progress,7,'#edb66f');}
   if(boss.vulnerable){label('반격 기회',300,160,'#ffe09b',21);}
  }
  label(hint,210,375,boss?.vulnerable?'#ffe09b':'#e5dfbd',17);
  if(b.flash){ctx.fillStyle='#e36c6438';ctx.fillRect(0,120,420,240);}
  if(model.mode==='victory'||model.mode==='defeat'){rect(0,142,420,140,'#152e35ed');label(model.mode==='victory'?'사냥 성공':'선발대 후퇴',210,195,'#ffe4a7',26);label(model.mode==='victory'?'정수 +'+b.enemy.reward:'정비하고 다시 도전하세요',210,239,'#e8eddf',18);}
 }
 function draw(){ctx.clearRect(0,0,420,430);if(['field','confirm'].includes(model.mode)){terrain();const actors=[...model.workers.map(w=>({y:w.y,draw:()=>worker(w)})),...model.monsters.filter(m=>!m.respawn).map(m=>({y:m.y,draw:()=>{monster(m);label(m.name,m.x,m.y+38,'#efd4b5',15);}}))];actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());}
 else battleScene();
 for(const e of model.events){ctx.globalAlpha=Math.min(1,e.life*2);label(e.text,e.x,e.y-(1.3-e.life)*26,e.color,17);ctx.globalAlpha=1;}}
 function sync(){for(const type of ['wood','ore','herb','essence'])$(type).textContent=model.stock[type];const battle=['battle','victory','defeat'].includes(model.mode);$('field-actions').hidden=battle;$('battle-actions').hidden=!battle;$('attack').disabled=model.mode!=='battle'||model.battle.attackCd>0||model.battle.boss?.hp===0||model.battle.boss?.phase==='enter';$('dodge').disabled=model.mode!=='battle'||model.battle.dodgeCd>0||model.battle.boss?.hp===0;$('dodge').textContent=model.battle?.dodgeCd>0?'회피 대기 '+model.battle.dodgeCd.toFixed(1)+'초':'회피';$('back').textContent=model.mode==='battle'?'후퇴하고 필드로':'필드로 돌아가기';$('status').textContent=model.mode==='confirm'?'상대 확인 중 · 잠시 정지':model.mode==='field'?'동료 3명이 자동 채집 중 · 몬스터를 선택하세요':model.mode==='battle'?(model.battle.boss?({enter:'우두머리가 다가옵니다',idle:'움직임을 살피세요',windup:model.battle.boss.pattern==='charge'?'돌진 준비 · 곧 회피하세요':'내려찍기 준비 · 곧 회피하세요',strike:'공격 순간!',recovery:'반격 기회 · 피해 2배',dying:'우두머리가 쓰러지는 중',dead:'사냥 성공'})[model.battle.boss.phase]:'공격 예고를 보고 회피하세요'):model.mode==='victory'?'보상 획득 · 필드로 돌아가 채집 계속':'후퇴해도 모은 자원은 유지됩니다';for(const m of model.monsters){const b=$('monster-'+m.id);b.disabled=m.respawn>0;b.textContent=m.respawn>0?m.name+' · '+Math.ceil(m.respawn)+'초':m.name+' 확인';} }
 function choose(id){if(!model.select(id))return;$('enemy-name').textContent=model.selected.name;$('enemy-info').textContent='체력 '+model.selected.hp+' · 사냥 보상 정수 '+model.selected.reward;$('encounter-note').textContent=model.selected.kind==='boar'?'몸을 낮추면 돌진, 앞발을 들면 내려찍기입니다. 공격이 끝나 숨을 고를 때 반격하면 피해가 2배입니다.':'선발대가 출전합니다. 공격 예고를 보고 회피하세요. 전투 중 채집은 잠시 쉽니다.';$('encounter').showModal();sync();}
 $('cancel').onclick=()=>{$('encounter').close();model.cancel();sync();};$('encounter').addEventListener('cancel',()=>{model.cancel();sync();});$('start').onclick=()=>{model.start();seenImpacts=0;$('encounter').close();sync();};$('attack').onclick=()=>{if(model.attack())sound('hit');sync();};$('dodge').onclick=()=>{if(model.dodge())sound('dodge');sync();};$('back').onclick=()=>{model.leave();sync();};for(const m of model.monsters)$('monster-'+m.id).onclick=()=>choose(m.id);
 canvas.addEventListener('pointerup',e=>{if(model.mode!=='field')return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*420/r.width,y=(e.clientY-r.top)*430/r.height;const m=model.monsters.filter(m=>!m.respawn).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(m&&Math.abs(m.x-x)<34&&Math.abs(m.y-y)<34)choose(m.id);});
 document.addEventListener('keydown',e=>{if(e.target instanceof HTMLAnchorElement||(e.key===' '&&e.target instanceof HTMLButtonElement))return;if(model.mode==='battle'&&!e.repeat&&[' ','d','D'].includes(e.key)){e.preventDefault();e.key===' '?model.attack():model.dodge();}});
 document.addEventListener('visibilitychange',()=>last=0);
 function frame(now){if(!document.hidden){model.tick(last?Math.min(.1,(now-last)/1000):0);if(model.battle?.boss?.impacts>seenImpacts){seenImpacts=model.battle.boss.impacts;sound('impact');}if(model.mode==='victory'&&previousMode!=='victory')sound('win');previousMode=model.mode;draw();if(now-uiClock>100){sync();uiClock=now;}}last=now;requestAnimationFrame(frame);}sync();requestAnimationFrame(frame);return model;
}
if(typeof document!=='undefined')mountField();
