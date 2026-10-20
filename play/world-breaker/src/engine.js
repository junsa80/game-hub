import {UPGRADES,W,H,VERSION,STAGES} from './data.js';

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class ForestGame {
 constructor(seed=20261018){
  this.seed=seed;this.rng=seed||1;this.random=()=>{let x=this.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;this.rng=x;return (x>>>0)/4294967296;};this.stage=1;this.stageHarvest=0;this.stageKills=0;this.stageStart=0;this.shield=100;this.combatFirst=true;this.hitClock=0;this.time=0;this.wood=0;this.essence=0;this.harvested=0;this.kills=0;
  this.upgrades={};this.selected={x:.5,y:.5};this.fx=[];this.particles=[];
  this.cells=Array.from({length:W*H},(_,id)=>({id,x:id%W,y:Math.floor(id/W),mass:0,fertility:.5+this.random(),bias:this.random()}));
  // Abundant but bounded initial forest. Every cell is a compressed resource ledger, not an individual physics body.
  for(const c of this.cells)c.mass=Math.round(720+this.random()*630);
  this.initialMass=this.totalMass();this.bugs=[];this.bugClock=0;this.pulseClock=0;this.frenzyUntil=0;
  this.stability=0;this.boss=null;this.bossComplete=false;this.finished=false;this.messages=[];
  this.manualRemoval=0;this.autoRemoval=0;this.growthActual=0;this.statsClock=0;this.spawnedTotal=0;
  this.hint='필드에서 자동 벌목할 위치를 터치해 봐!';this.notify('숲이 증식하고 있습니다. 벌목을 시작하세요!');
 }
 rank(id){return this.upgrades[id]||0;}
 nodes(){return Object.values(this.upgrades).reduce((s,n)=>s+n,0);}
 distinctNodes(){return Object.keys(this.upgrades).length;}
 cost(def){return Math.round(7*def.base*Math.pow(def.scale,this.rank(def.id)));}
 unlocked(def){return def.stage<=this.stage && this.nodes()>=def.min && (!def.requires || this.rank(def.requires)>0);}
 buy(id){const def=UPGRADES.find(x=>x.id===id);if(!def||!this.unlocked(def)||this.rank(id)>=def.max)return false;
  const cost=this.cost(def);if(this.wood+1e-6<cost)return false;this.wood-=cost;this.upgrades[id]=this.rank(id)+1;this.effectCache={};
  this.notify(`${def.name} 강화! ${this.rank(id)}/${def.max}`);return true;
 }
 setTarget(x,y){this.selected={x:clamp(x,0,1),y:clamp(y,0,1)};}
 totalMass(){return this.cells.reduce((s,c)=>s+c.mass,0);}
 effect(key){this.effectCache??={};return this.effectCache[key]??=UPGRADES.filter(d=>d.effect===key).reduce((n,d)=>n+this.rank(d.id),0);}
 stageData(){return STAGES[this.stage-1];}
 growthRate(){return (this.stage===2?110:40)*(1+Math.min(2,(this.time-this.stageStart)/1200))*(1+.22*this.rank('fertile'))*(this.boss?1.1:1);}
 manualPower(){return 16*(1+.18*this.effect('drill'))*(1+.3*this.rank('axe')+.22*this.rank('speed'))*(this.rank('twin')?1.6:1)*(1+.18*this.rank('precise'))*(this.rank('research')?1.35:1)*(this.rank('frenzy')&&this.frenzyUntil>this.time?1.65:1);}
 autoPower(){return (this.rank('helper')*4+this.rank('drone')*8+12*this.effect('crew'))*(this.rank('swarm')?1.5:1)*(this.rank('research')?1.35:1);}
 radius(){return .115 + this.rank('range')*.018;}
 woodValue(){return (1+.2*this.effect('trade'))*(1+.35*this.rank('value'))*(1+.45*this.rank('fertile'))*(1+.16*this.rank('luck'));}
 notify(message){this.messages.unshift({message,time:this.time});this.messages.length=Math.min(this.messages.length,6);}
 // Time-based game state is framerate-independent, with work and growth batched by tile.
 tick(dt){
  if(this.finished)return;
  dt=clamp(dt,0,.2);this.time+=dt;
  const growth=this.growthRate()*dt;this.growthActual+=growth;
  let sumFertility=0;for(const c of this.cells)sumFertility+=c.fertility;
  for(const c of this.cells)c.mass+=growth*c.fertility/sumFertility;
  this.spawnedTotal+=growth;
  this.shield=Math.min(100+15*this.effect('ward'),this.shield+dt*2);
  this.bugClock+=dt;
  if(this.bugClock>22 && this.bugs.length<5 && !this.boss){this.bugClock=0;this.spawnBug();}
  this.advanceBugs(dt);
  this.performWork(dt);
  if(this.rank('shock')){this.pulseClock+=dt;if(this.pulseClock>=5){this.pulseClock-=5;const loss=this.damageArea(this.selected,.22,4+this.manualPower()*.4*(1+.35*this.rank('shockPower')),'shock');if(loss>0)this.fx.push({x:this.selected.x,y:this.selected.y,t:0,type:'pulse'});}}
  const ratio=this.manualPower()+this.autoPower();
  if(!this.boss && this.totalMass()<this.initialMass*.12 && this.stageHarvest>=this.stageData().goal && ratio>this.growthRate()*1.1){this.stability+=dt;
   if(this.stability>=5){this.spawnBoss();this.stability=0;}}
  else if(!this.boss)this.stability=Math.max(0,this.stability-dt*.5);
  if(this.boss && this.boss.hp<=0){this.bossComplete=true;this.finished=true;this.notify(`${this.stageData().boss} 정화! ${this.stage}스테이지 클리어!`);}
  for(const f of this.fx)f.t+=dt;this.fx=this.fx.filter(f=>f.t<.8).slice(-70);
 }
 spawnBug(){const hp=(this.stage===2?180:48)+Math.min(800,this.stageKills*4);const bug={x:.08+this.random()*.84,y:.08+this.random()*.84,hp,maxHp:hp,attack:0};this.bugs.push(bug);this.notify(this.stage===2?'장갑 수정충 출현! 분홍 테두리가 붉어지면 공격합니다.':'숲의 벌레 출현! 붉은 테두리가 공격 예고입니다.');}
 advanceBugs(dt){
  for(const b of this.bugs){b.attack=(b.attack||0)+dt;
   if(b.attack>=6){b.attack=0;this.receiveHit(this.stage===2?15:8);this.fx.push({x:b.x,y:b.y,t:0,type:'warning'});}
  }
  if(this.boss){this.hitClock+=dt;if(this.hitClock>=7){this.hitClock=0;this.receiveHit(this.stage===2?24:14);}}
 }
 receiveHit(damage){this.shield-=damage*(1-.08*this.effect('ward'));if(this.shield<=0){this.shield=100+15*this.effect('ward');this.wood*=.95;this.notify('보호막 재생! 보유 자원의 5%를 사용했습니다. 강화·진행은 유지됩니다.');}}
 combatMultiplier(){return this.stage===2?(this.weakOpen()?1.5+.25*this.effect('weak'):.45+.12*this.effect('armor')):1;}
 weakOpen(){return this.time%9>=6;}
 nextStage(){if(!this.finished||this.stage!==1)return false;
  this.stage=2;this.stageStart=this.time;this.stageHarvest=0;this.stageKills=0;this.boss=null;this.bugs=[];
  this.bossComplete=false;this.finished=false;this.stability=0;this.bugClock=0;this.hitClock=0;this.shield=100;this.fx=[];
  for(const c of this.cells)c.mass=4200+this.random()*1800;
  this.initialMass=this.totalMass();this.notify('공명 광산: 장갑은 9초마다 3초간 약해집니다. 광맥을 끝까지 깨면 연쇄 폭발!');return true;
 }
 performWork(dt){
  const near=this.bugs.filter(b=>Math.hypot((b.x-this.selected.x)*1.3,b.y-this.selected.y)<this.radius());
  if(this.boss&&Math.hypot(this.selected.x-this.boss.x,this.selected.y-this.boss.y)<this.radius()+.08){
   this.boss.hp=Math.max(0,this.boss.hp-this.manualPower()*dt*.8*this.combatMultiplier());
  } else if(near.length&&this.combatFirst){
   const b=near[0];b.hp-=this.manualPower()*dt*this.combatMultiplier()*(this.rank('burn')?1.45:1);
   if(b.hp<=0)this.killBug(b);
  } else this.damageArea(this.selected,this.radius(),this.manualPower()*dt*(this.rank('burn')?1.08:1),'manual');
  // Auto workers spread their throughput across all trees. This needs no per-tree AI.
  const auto=this.autoPower()*dt;
  if(auto>0){const candidates=this.cells.filter(c=>c.mass>.001).sort((a,b)=>this.rank('target')?b.mass-a.mass:a.id-b.id);
   const top=candidates.slice(0,12);const each=auto/Math.max(1,top.length);
   for(const c of top)this.removeMass(c,each,'auto');}
  const combat=this.rank('guard')*10+18*this.effect('turret');
  if(combat&&this.boss)this.boss.hp=Math.max(0,this.boss.hp-combat*dt*this.combatMultiplier());
  if(combat&&this.bugs.length){for(const b of [...this.bugs]){b.hp-=combat*dt*this.combatMultiplier()/this.bugs.length;if(b.hp<=0)this.killBug(b);}}
 }
 damageArea(p,r,power,source){let candidates=this.cells.filter(c=>c.mass>.0001&&Math.hypot(((c.x+.5)/W-p.x)*1.3,(c.y+.5)/H-p.y)<r);
  if(!candidates.length)return 0;
  candidates.sort((a,b)=>Math.hypot((a.x+.5)/W-p.x,(a.y+.5)/H-p.y)-Math.hypot((b.x+.5)/W-p.x,(b.y+.5)/H-p.y));
  // Distribute damage over at most 12 tree clusters; rate remains predictable while range expands.
  candidates=candidates.slice(0,12);let remaining=power,actual=0;
  for(const c of candidates){if(remaining<=0)break;const dealt=this.removeMass(c,remaining/(candidates.length*.55),source);actual+=dealt;remaining-=dealt;}
  if(remaining>.0001){for(const c of candidates){if(remaining<=0)break;const dealt=this.removeMass(c,remaining,source);actual+=dealt;remaining-=dealt;}}
  return actual;
 }
 removeMass(c,damage,source){const resistance=this.stage===2&&!this.weakOpen()?Math.min(1,.5+.12*this.effect('armor')):1;const used=Math.min(c.mass,Math.max(0,damage)*resistance);if(!used)return 0;
  c.mass-=used;this.harvested+=used;this.stageHarvest+=used;
  let reward=used*this.woodValue()*(this.rank('compress')&&c.mass+used>=10?1.25:1);if(source==='auto')reward*=1+.25*this.rank('recycle');
  this.wood+=reward;
  if(source==='manual')this.manualRemoval+=used;else this.autoRemoval+=used;
  if(this.rank('lightning')&&Math.floor(this.harvested/250)>Math.floor((this.harvested-used)/250)){
   const other=this.cells.filter(x=>x.mass>1).sort((a,b)=>b.mass-a.mass)[0];if(other&&other!==c){const z=Math.min(other.mass,12+this.manualPower()*.25);other.mass-=z;this.wood+=z*this.woodValue();this.harvested+=z;this.stageHarvest+=z;this.fx.push({x:(other.x+.5)/W,y:(other.y+.5)/H,t:0,type:'lightning'});}}
  if(this.rank('chain')&&source==='manual'&&this.random()<.14){const near=this.cells.find(x=>Math.abs(c.x-x.x)<=1&&Math.abs(c.y-x.y)<=1&&x.id!==c.id&&x.mass>0);if(near){const z=Math.min(near.mass,used*.15*this.rank('chain')*(this.rank('forest')?2:1));near.mass-=z;this.harvested+=z;this.stageHarvest+=z;this.wood+=z*this.woodValue();}}
  
  if(source==='manual'&&used>.2&&this.random()<.12)this.fx.push({x:(c.x+.5)/W,y:(c.y+.5)/H,t:0,type:'chip'});
  if(this.stage===2&&c.mass===0&&this.effect('blast')&&source!=='blast'){
   this.fx.push({x:(c.x+.5)/W,y:(c.y+.5)/H,t:0,type:'blast'});
   for(const n of this.cells.filter(n=>n.id!==c.id&&Math.abs(n.x-c.x)<=1&&Math.abs(n.y-c.y)<=1))this.removeMass(n,used*.2*this.effect('blast'),'blast');
  }
  return used;
 }
 killBug(b){this.bugs=this.bugs.filter(x=>x!==b);this.kills++;this.stageKills++;this.essence+=(this.rank('essence')?2:1);this.wood+=75+this.kills*10;this.frenzyUntil=this.time+8;this.fx.push({x:b.x,y:b.y,t:0,type:'kill'});this.notify('몬스터 처치! 자원 보너스와 정수 획득');}
 spawnBoss(){this.boss={x:.5,y:.42,hp:this.stageData().bossHp,maxHp:this.stageData().bossHp};this.notify(`${this.stageData().boss} 등장! 중앙을 공격하세요.`);}
 getStats(){return {mass:this.totalMass(),growth:this.growthRate(),manual:this.manualPower(),auto:this.autoPower(),nodes:this.nodes(),distinctNodes:this.distinctNodes(),progress:Math.min(clamp(1-this.totalMass()/this.initialMass,0,1),clamp(this.stageHarvest/this.stageData().goal,0,1)),stable:this.stability,stage:this.stage};}
 toJSON(){return {version:VERSION,stage:this.stage,rng:this.rng,initialMass:this.initialMass,stageHarvest:this.stageHarvest,stageKills:this.stageKills,stageStart:this.stageStart,shield:this.shield,combatFirst:this.combatFirst,hitClock:this.hitClock,seed:this.seed,time:this.time,wood:this.wood,essence:this.essence,harvested:this.harvested,kills:this.kills,upgrades:this.upgrades,selected:this.selected,cells:this.cells.map(c=>c.mass),bugs:this.bugs,boss:this.boss,bossComplete:this.bossComplete,finished:this.finished,stability:this.stability,spawnedTotal:this.spawnedTotal,bugClock:this.bugClock,pulseClock:this.pulseClock,frenzyUntil:this.frenzyUntil};}
 static fromJSON(raw){if(!raw||!['0.1.0',VERSION].includes(raw.version)||!Array.isArray(raw.cells)||raw.cells.length!==W*H)throw new Error('저장 데이터 버전 또는 구조가 맞지 않습니다.');
  for(const key of ['wood','time','essence','harvested','kills'])if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 숫자: '+key);
  if(raw.cells.some(n=>!Number.isFinite(n)||n<0))throw new Error('손상된 필드');
  const g=new ForestGame(Number(raw.seed)||20261018);
  if(raw.version===VERSION&&![1,2].includes(raw.stage))throw new Error('지원하지 않는 스테이지');
  g.stage=raw.stage||1;
  for(const key of ['initialMass','stageHarvest','stageKills','stageStart','shield','hitClock'])if(raw[key]!==undefined){if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 진행 데이터');g[key]=raw[key];}
  if(raw.version==='0.1.0'){g.initialMass=Math.max(1,raw.cells.reduce((a,b)=>a+b,0)+raw.harvested-(Number(raw.spawnedTotal)||0));g.stageHarvest=raw.harvested;}
  if(g.initialMass<=0)throw new Error('손상된 초기 자원량');
  g.combatFirst=raw.combatFirst!==false;g.rng=Number.isInteger(raw.rng)?raw.rng:g.rng;g.time=clamp(Number(raw.time)||0,0,1e10);g.wood=clamp(Number(raw.wood)||0,0,1e25);g.essence=clamp(Number(raw.essence)||0,0,1e15);
  g.harvested=clamp(Number(raw.harvested)||0,0,1e25);g.kills=clamp(Number(raw.kills)||0,0,1e9);
  g.upgrades={};for(const def of UPGRADES){const val=Number(raw.upgrades?.[def.id]);if(def.stage<=g.stage&&Number.isInteger(val)&&val>0)g.upgrades[def.id]=clamp(val,0,def.max);}
  g.selected={x:clamp(Number(raw.selected?.x)===0?0:(Number(raw.selected?.x)||.5),0,1),y:clamp(Number(raw.selected?.y)===0?0:(Number(raw.selected?.y)||.5),0,1)};
  g.cells.forEach((c,i)=>c.mass=clamp(Number(raw.cells[i])||0,0,1e18));
  g.bugs=Array.isArray(raw.bugs)?raw.bugs.slice(0,8).filter(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.hp)).map(b=>({...b,x:clamp(b.x,0,1),y:clamp(b.y,0,1),hp:clamp(b.hp,0,1e9),maxHp:Math.max(1,Number.isFinite(b.maxHp)?b.maxHp:b.hp),attack:clamp(Number(b.attack)||0,0,6)})):[];
  g.boss=raw.boss&&Number.isFinite(raw.boss.hp)?{x:.5,y:.42,hp:clamp(raw.version==='0.1.0'?raw.boss.hp/750*g.stageData().bossHp:raw.boss.hp,0,g.stageData().bossHp),maxHp:g.stageData().bossHp}:null;
  g.bossComplete=Boolean(raw.bossComplete);g.finished=Boolean(raw.finished)&&g.bossComplete;g.stability=clamp(Number(raw.stability)||0,0,5);
  g.spawnedTotal=clamp(Number(raw.spawnedTotal)||0,0,1e25);g.bugClock=clamp(Number(raw.bugClock)||0,0,22);g.pulseClock=clamp(Number(raw.pulseClock)||0,0,5);g.frenzyUntil=Number(raw.frenzyUntil)||0;
  return g;
 }
}
