import {UPGRADES,W,H,VERSION,STAGES,ROUND_COUNT,roundRules,SKILLS,MONSTERS} from './data.js';

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class ForestGame {
 constructor(seed=20261018){
  this.stasisUntil=0;this.gears=0;this.grid=[];this.blackoutUntil=0;this.shutdowns=0;this.energy=35;this.skills=['sweep','overdrive'];this.skillReadyAt={sweep:0,stasis:0,overdrive:0};this.freezeUntil=0;this.overdriveUntil=0;this.combatClock=0;this.timeBonus=0;this.sap=0;this.spores=[];this.sporeClock=0;this.calmUntil=0;this.purified=0;this.workers=[];this.seed=seed;this.rng=seed||1;this.random=()=>{let x=this.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;this.rng=x;return (x>>>0)/4294967296;};this.stage=1;this.stageHarvest=0;this.stageKills=0;this.stageStart=0;this.shield=100;this.combatFirst=true;this.hitClock=0;this.time=0;this.wood=0;this.essence=0;this.harvested=0;this.kills=0;
  this.upgrades={};this.selected={x:.5,y:.5};this.fx=[];this.particles=[];
  this.cells=Array.from({length:W*H},(_,id)=>({id,x:id%W,y:Math.floor(id/W),mass:0,fertility:.5+this.random(),bias:this.random()}));
  // Abundant but bounded initial forest. Every cell is a compressed resource ledger, not an individual physics body.
  for(const c of this.cells)c.mass=0;
  this.initialMass=this.totalMass();this.bugs=[];this.bugClock=0;this.pulseClock=0;this.frenzyUntil=0;
  this.stability=0;this.boss=null;this.bossComplete=false;this.finished=false;this.messages=[];
  this.manualRemoval=0;this.autoRemoval=0;this.growthActual=0;this.statsClock=0;this.spawnedTotal=0;
  this.hint='공터를 터치해 위치를 고정하세요. 생성보다 빠르게 처리하면 라운드 성공!';this.round=1;this.ore=0;this.roundState='active';this.legacySnapshot=null;this.startRound();
 }
 rank(id){return this.upgrades[id]||0;}
 nodes(){return Object.values(this.upgrades).reduce((s,n)=>s+n,0);}
 distinctNodes(){return Object.keys(this.upgrades).length;}
 cost(def){
  if(def.currency==='essence')return Math.round(def.base*(2.2+def.stage*.35));
  const tier=def.stage>1?Number(def.id.at(-1))||1:1;
  return Math.max(1,Math.round([0,1.2,2,3.5,4][def.stage]*def.base*Math.pow(def.scale,this.rank(def.id))*(1+.1*this.rank(def.id))*Math.pow(1+(def.stage===2?.4:.6)*(tier-1),1.5)));
 }
 currency(def){return def.currency||(def.stage===4?'gears':def.stage===3?'sap':def.stage===2?'ore':'wood');}
 balance(def){return this[this.currency(def)];}
 gainResource(amount){this[this.stage===4?'gears':this.stage===3?'sap':this.stage===2?'ore':'wood']+=amount;}
 visible(def){return def.stage<this.stage||(def.stage===this.stage&&def.unlockRound<=this.round+(this.roundState==='cleared'?1:0));}
 unlocked(def){return this.visible(def) && (!def.requires || this.rank(def.requires)>0);}
 cap(def){return def.max;}
 buy(id){const def=UPGRADES.find(x=>x.id===id);if(this.roundState==='active'||!def||!this.unlocked(def)||this.rank(id)>=this.cap(def))return false;
  const cost=this.cost(def);if(this.balance(def)+1e-6<cost)return false;this[this.currency(def)]-=cost;this.upgrades[id]=this.rank(id)+1;this.effectCache={};
  this.notify(`${def.name} 강화! ${this.rank(id)}/${def.max}`);return true;
 }
 setTarget(x,y){const m=this.mapBounds();this.selected={x:clamp(x,m.x/W,(m.x+m.width)/W),y:clamp(y,m.y/H,(m.y+m.height)/H)};}
 totalMass(){return this.cells.reduce((s,c)=>s+c.mass,0);}
 effect(key){this.effectCache??={};return this.effectCache[key]??=UPGRADES.filter(d=>d.effect===key).reduce((n,d)=>n+this.rank(d.id),0);}
 stageData(){return STAGES[this.stage-1];}
 rules(){return roundRules(this.stage,this.round);}
 bloomActive(){return this.stage===3&&this.time>=this.calmUntil&&this.roundElapsed%(12+2*this.rank('bog_respite'))>=8+2*this.rank('bog_respite')&&this.spores.length>0;}
 growthRate(){if(this.time<this.freezeUntil||this.stage===4&&this.time<this.blackoutUntil)return 0;const factor=this.stage===4?this.gridPower():this.stage!==3?1:this.time<this.calmUntil?.65:this.bloomActive()?1.8-.12*this.effect('cleanse'):1;return this.rules().rate*factor*(this.rules().finale&&this.roundElapsed>=15?0:1);}
 boost(){return this.time<this.overdriveUntil?1.6:1;}
 stageHardness(){return this.stage===4?80:this.stage===3?40:this.stage===2?10:1;}
 swampManual(){return this.stage===3?(1+.3*this.effect('bogblade'))*(this.rank('bog_echo')&&this.time<this.calmUntil?1.4:1)*(this.rank('bog_mastery')?1.35:1):1;}
 inheritedCrew(){return .8*this.effect('crew')*(this.stage===4?.12:this.stage===3?.2:1);}
 swampAuto(){return this.stage===3?(this.rank('bog_sweep')?1.2:1)*(this.rank('bog_mastery')?1.35:1):1;}
 cityManual(){return this.stage===4?(1+.35*this.effect('cutter'))*(this.rank('city_mastery')?1.3:1):1;}
 cityAuto(){return this.stage===4&&this.rank('city_mastery')?1.3:1;}
 cityLocal(){return .75*this.effect('assembler')+.85*this.effect('bogcrew')*.12;}
 cityGlobal(){return .55*this.effect('citydrone')+.65*this.effect('bogdrone')*.12;}
 initGrid(){
  const cells=this.activeCells(),count=Math.min(6,2+Math.floor((this.round-1)/2));
  this.grid=Array.from({length:count},(_,i)=>{const kind=i%2?'capacitor':'relay',hp=(kind==='relay'?3:2.3)+this.round*.35;return {cellId:cells[Math.floor((i+.5)*cells.length/count)].id,kind,hp,maxHp:hp,offlineUntil:0,charge:0,disables:0};});
 }
 gridPower(){const relays=this.grid.filter(n=>n.kind==='relay');return relays.length ? .35+.65*relays.filter(n=>n.hp>0).length/relays.length : 1;}
 hasWork(c){return c.mass>1e-8||this.stage===4&&this.grid.some(n=>n.cellId===c.id&&n.hp>0);}
 tickGrid(dt){
  if(this.time<this.stasisUntil){for(const node of this.grid)if(node.hp<=0)node.offlineUntil+=dt;return;}
  for(const node of this.grid){
   if(node.hp<=0){if(this.time>=node.offlineUntil&&!(this.rules().finale&&this.roundElapsed>=15)){node.hp=node.maxHp;node.charge=0;this.notify('기계 재가동 · 발전기를 끊거나 충전된 축전기를 노리세요.');}}
   else node.charge=Math.min(100,node.charge+dt/8*100);
  }
 }
 damageMachine(node,power,source){
  const used=Math.min(Math.max(0,power),node.hp);if(used<=0)return 0;node.hp-=used;
  if(node.hp<=1e-8){
   node.hp=0;node.disables=(node.disables||0)+1;node.offlineUntil=this.time+8+1.5*this.effect('shutdown');this.shutdowns++;
   const repeat=node.disables===1?1:.2;this.gears+=(2+this.round*.3)*(this.rank('city_salvage')?1.5:1)*repeat;this.essence+=node.disables===1?this.rank('city_salvage'):0;this.energy=Math.min(100,this.energy+(4+this.effect('battery'))*repeat);
   if(this.rank('city_tempo')&&node.disables===1)this.skillReadyAt[this.skills[this.shutdowns%2]]=0;
   const c=this.cells[node.cellId],p={x:(c.x+.5)/W,y:(c.y+.5)/H};this.fx.push({...p,t:0,type:node.kind==='capacitor'?'overload':'shutdown'});
   if(node.kind==='capacitor'){
    const index=this.grid.indexOf(node),strength=(.4+node.charge/200+.12*this.effect('overload'))*(this.rank('city_cascade')?1.6:1);
    for(const other of [this.grid[index-1],this.grid[index+1]])if(other?.hp>0)this.damageMachine(other,other.maxHp*strength,'overload');
    this.damageArea(p,.32,8+this.manualPower()*4+3*this.effect('overload'),'overload-scrap');
   }
   if(this.grid.every(n=>n.hp<=0)){this.blackoutUntil=this.time+6;this.fx.push({...p,t:0,type:'blackout'});this.notify('전력망 연쇄 정지! 6초 생산 중단 · 지금 잔량을 쓸어내세요!');}
   else this.notify(node.kind==='capacitor'?'축전기 과부하! 연결 장치와 주변 폐기물에 연쇄 피해':'발전기 차단! 연결 생산량 감소 · 재가동 전에 정리하세요.');
  }
  return used;
 }
 manualPower(){return .45*(1+.18*this.effect('drill'))*(1+.65*this.rank('axe')+.45*this.rank('speed'))*(this.rank('twin')?1.6:1)*(1+.18*this.rank('precise'))*(this.rank('research')?1.35:1)*(this.rank('frenzy')&&this.frenzyUntil>this.time?1.65:1)*this.swampManual()*this.cityManual()*this.boost()/this.stageHardness();}
 autoPower(){return ((this.rank('helper')*.4+this.rank('drone')*.8)/this.stageHardness()+this.inheritedCrew()+(this.stage===3?.85*this.effect('bogcrew')+.65*this.effect('bogdrone'):this.stage===4?this.cityLocal()+this.cityGlobal():0))*(this.rank('swarm')?1.5:1)*(this.rank('research')?1.35:1)*this.swampAuto()*this.cityAuto()*this.boost();}
 startRound(){
  this.roundState='active';this.roundElapsed=0;this.energy=35;this.skillReadyAt={sweep:0,stasis:0,overdrive:0};this.freezeUntil=0;this.stasisUntil=0;this.overdriveUntil=0;this.combatClock=0;this.timeBonus=0;this.roundHarvest=0;this.spawnBuffer=0;this.stability=0;
  this.boss=null;this.bugs=[];this.workers=[];this.grid=[];this.blackoutUntil=0;this.spores=[];this.sporeClock=0;this.calmUntil=0;this.bugClock=0;this.hitClock=0;this.pulseClock=0;this.fx=[];
  for(const c of this.cells)c.mass=0;
  const rules=this.rules();
  if(rules.finale){for(const c of this.activeCells())c.mass=2+this.random()*2;}
  else for(let i=0;i<rules.initial;i++)this.spawnResource();
  if(this.stage===3)this.spawnSpore();if(this.stage===4)this.initGrid();
  this.initialMass=this.totalMass();this.setTarget(this.selected.x,this.selected.y);
  this.notify(rules.finale?'최종 대청소! 화면을 비우고 심장을 정화하세요.':`${this.round}/10 라운드 · ${rules.duration}초 안에 밀린 자원을 정리하세요!`);
 }
 spawnResource(){
  let pool=this.activeCells();
  const empty=pool.filter(c=>c.mass<.00001);if(empty.length)pool=empty;
  const c=pool[Math.floor(this.random()*pool.length)];c.mass+=1;
 }
 spawnSpore(){
  if(this.stage!==3||this.spores.length>=(this.rules().finale?4:2))return false;
  const pool=this.activeCells().filter(c=>c.mass>0&&!this.spores.includes(c.id));if(!pool.length)return false;
  const c=pool[Math.floor(this.random()*pool.length)];this.spores.push(c.id);return true;
 }
 resolveSpores(){
  const cleared=this.spores.filter(id=>this.cells[id].mass<1e-8);
  this.spores=this.spores.filter(id=>this.cells[id].mass>=1e-8);
  for(const id of cleared){this.purified++;this.sap+=(5+2*this.effect('rootstudy'))*(this.rank('bog_crown')?1.5:1);this.essence+=1+2*this.rank('bog_crown');this.energy=Math.min(100,this.energy+5);this.calmUntil=this.time+6+.75*this.effect('rootstudy');const c=this.cells[id];this.fx.push({x:(c.x+.5)/W,y:(c.y+.5)/H,t:0,type:'purify'});this.notify('오염 핵 정화! 생성 둔화 · 수액·정수·스킬 에너지 획득');}
 }
 skillsUnlocked(){return this.stage>1||this.round>=2||this.roundState==='cleared';}
 equipSkill(slot,id){if(this.roundState==='active'||![0,1].includes(slot)||!SKILLS.some(d=>d.id===id))return false;const other=1-slot;if(this.skills[other]===id)this.skills[other]=this.skills[slot];this.skills[slot]=id;return true;}
 castSkill(id){
  const def=SKILLS.find(d=>d.id===id);if(!this.skillsUnlocked()||this.roundState!=='active'||this.finished||!this.skills.includes(id)||!def||this.energy<def.cost||this.time<(this.skillReadyAt[id]||0))return false;
  this.energy-=def.cost;this.skillReadyAt[id]=this.time+def.cooldown;
  if(id==='stasis'){this.freezeUntil=Math.max(this.freezeUntil,this.time+5);this.stasisUntil=this.time+5;}
  if(id==='overdrive')this.overdriveUntil=this.time+6;
  if(id==='sweep'){
   const reach=this.radius()*1.5;let budget=2+this.manualPower()*6+this.autoPower()*2;
   // One finite damage budget is shared by targets: a larger map cannot multiply it.
   const near=(x,y)=>Math.hypot((x-this.selected.x)*1.3,y-this.selected.y)<reach;
   for(const b of [...this.bugs])if(budget>0&&near(b.x,b.y)){const multiplier=this.enemyMultiplier(b),used=Math.min(budget,b.hp/multiplier);b.hp-=used*multiplier;budget-=used;b.hitUntil=this.time+.18;if(b.hp<=1e-8)this.killBug(b);}
   if(this.boss&&budget>0&&near(this.boss.x,this.boss.y)){const multiplier=this.combatMultiplier()*(this.hitClock<1.5?2:1),used=Math.min(budget,this.boss.hp/multiplier);this.boss.hp=Math.max(0,this.boss.hp-used*multiplier);budget-=used;}
   const targets=this.cells.filter(c=>this.hasWork(c)&&near((c.x+.5)/W,(c.y+.5)/H)).sort((a,b)=>Math.hypot((a.x+.5)/W-this.selected.x,(a.y+.5)/H-this.selected.y)-Math.hypot((b.x+.5)/W-this.selected.x,(b.y+.5)/H-this.selected.y));
   for(const c of targets){if(budget<=1e-8)break;const used=this.removeMass(c,budget,'skill');budget=Math.max(0,budget-used);}
   if(this.stage===3)this.resolveSpores();
  }
  this.fx.push({x:this.selected.x,y:this.selected.y,t:0,type:id==='sweep'?'sweep':id==='stasis'?'freeze':'power'});this.notify(def.name+'!');return true;
 }
 nextRound(){if(this.roundState!=='cleared'||this.round>=ROUND_COUNT)return false;this.round++;this.startRound();return true;}
 retryRound(){if(this.roundState!=='failed')return false;this.startRound();return true;}
 clearRound(){this.roundState='cleared';this.essence+=this.round;const bonus=3*this.round;
  this.gainResource(bonus);
  const opened=UPGRADES.filter(d=>d.stage===this.stage&&d.unlockRound===this.round+1).map(d=>d.name);
  this.notify(`ROUND ${this.round} CLEAR! ${opened.length?'새 강화 해금: '+opened.join(' · '):'강화·자원 유지 · 다음 도전!'}`);
 }
 mapBounds(){const expansion=this.stage===1?this.rank('range')+this.rank('fertile'):this.stage===4?this.effect('conduit')+Math.floor(this.effect('scrap')/2):this.stage===3?this.effect('survey')+Math.floor(this.effect('distill')/2):this.effect('drill')+this.effect('trade');const width=Math.min(W,4+expansion*2),height=Math.min(H,3+expansion);return {x:Math.floor((W-width)/2),y:Math.floor((H-height)/2),width,height};}
 activeCells(){const m=this.mapBounds();return this.cells.filter(c=>c.x>=m.x&&c.x<m.x+m.width&&c.y>=m.y&&c.y<m.y+m.height);}
 radius(){return .16+(this.stage===1?this.rank('range')*.055:this.stage===4?this.effect('conduit')*.045+this.effect('cutter')*.02:this.stage===3?this.effect('survey')*.04+this.effect('bogblade')*.025:(this.effect('drill')+this.effect('weak'))*.035);}

 woodValue(){if(this.stage===4)return (1+.2*this.effect('scrap'))*(1+.025*this.rank('value'))*(1+.03*this.rank('luck'));if(this.stage===3)return (1+.2*this.effect('distill'))*(1+.03*this.rank('value'))*(1+.04*this.rank('luck'));if(this.stage===2)return (1+.2*this.effect('trade'))*(1+.05*this.rank('value'))*(1+.1*this.rank('luck'));return (1+.2*this.effect('trade'))*(1+.35*this.rank('value'))*(1+.45*this.rank('fertile'))*(1+.16*this.rank('luck'));}
 notify(message){this.messages.unshift({message,time:this.time});this.messages.length=Math.min(this.messages.length,6);}
 // Time-based game state is framerate-independent, with work and growth batched by tile.
 tick(dt){
  if(this.finished||this.roundState!=='active')return;
  dt=clamp(dt,0,.2);this.time+=dt;
  this.roundElapsed+=dt;if(this.stage===4)this.tickGrid(dt);
  const growth=this.growthRate()*dt;this.growthActual+=growth;this.spawnBuffer+=growth;
  while(this.spawnBuffer>=1){this.spawnResource();this.spawnBuffer--;this.spawnedTotal++;}
  this.shield=Math.min(100+15*this.effect('ward'),this.shield+dt*2);
  this.bugClock+=dt;
  if(this.round>=2&&this.bugClock>22&&this.bugs.length<3&&!this.boss){this.bugClock=0;this.spawnBug();}
  this.advanceBugs(dt);
  this.performWork(dt);
  if(this.stage===3){this.resolveSpores();this.sporeClock+=dt;if(this.sporeClock>=12&&(!this.rules().finale||this.roundElapsed<15)){this.sporeClock-=12;this.spawnSpore();}}
  if(this.rank('shock')){this.pulseClock+=dt;if(this.pulseClock>=5){this.pulseClock-=5;const loss=this.damageArea(this.selected,.22,4+this.manualPower()*.4*(1+.35*this.rank('shockPower')),'shock');if(loss>0)this.fx.push({x:this.selected.x,y:this.selected.y,t:0,type:'pulse'});}}
  const rules=this.rules();
  if(rules.finale){
   if(!this.boss&&this.roundElapsed>=15&&this.totalMass()<.01&&(this.stage!==4||this.grid.every(n=>n.hp<=0)))this.spawnBoss();
   if(this.boss&&this.boss.hp<=0){this.bossComplete=true;this.finished=true;this.roundState='cleared';this.notify(`${this.stageData().name} 완전 정화! 다음 세계에서 다시 시작합니다.`);}
  }else{
   const caughtUp=this.roundHarvest>=rules.goal&&this.totalMass()<Math.max(3,this.growthRate()*3);
   this.stability=caughtUp?this.stability+dt:0;
   if(this.stability>=2)this.clearRound();
  }
  if(!this.finished&&this.roundState==='active'&&this.roundElapsed>=rules.duration+this.timeBonus){this.roundState='failed';this.notify('시간 종료! 강화·자원은 유지됩니다. 보강하고 재도전하세요.');}
  for(const f of this.fx)f.t+=dt;this.fx=this.fx.filter(f=>f.t<.8).slice(-70);
 }
 spawnBug(){const kinds=Object.keys(MONSTERS).filter(k=>this.stage===4||k!=='repair'),kind=kinds[Math.floor(this.random()*kinds.length)],def=MONSTERS[kind];const hp=((this.stage===2?2:3)+this.round*.7)*def.hp;const cells=this.activeCells(),c=cells[Math.floor(this.random()*cells.length)];const bug={kind,x:(c.x+.5)/W,y:(c.y+.5)/H,hp,maxHp:hp,attack:0,hitUntil:0};this.bugs.push(bug);this.notify(`${def.name} 출현 · 처치: ${def.reward}`);}
 advanceBugs(dt){
  if(this.time<this.stasisUntil)return;
  for(const b of this.bugs){b.attack=(b.attack||0)+dt;
   if(b.kind==='rusher'&&b.attack<4.5){const dx=this.selected.x-b.x,dy=this.selected.y-b.y,d=Math.hypot(dx,dy);if(d>.05){b.x+=dx/d*dt*.035;b.y+=dy/d*dt*.035;const m=this.mapBounds();b.x=clamp(b.x,(m.x+.3)/W,(m.x+m.width-.3)/W);b.y=clamp(b.y,(m.y+.3)/H,(m.y+m.height-.3)/H);}}
   if(b.attack>=6){b.attack=0;const def=MONSTERS[b.kind];this.receiveHit((this.stage===4?22:this.stage===3?18:this.stage===2?15:8)*(def?.damage||1));if(this.stage===3)this.spawnSpore();if(b.kind==='repair'&&(!this.rules().finale||this.roundElapsed<15)){const node=this.grid.find(n=>n.hp<n.maxHp);if(node){node.hp=node.maxHp;node.offlineUntil=0;this.fx.push({x:this.cells[node.cellId].x/W,y:this.cells[node.cellId].y/H,t:0,type:'repair'});}}if(b.kind==='shaman'&&(!this.rules().finale||this.roundElapsed<15))for(let i=0;i<3;i++){this.spawnResource();this.spawnedTotal++;}this.fx.push({x:b.x,y:b.y,t:0,type:'warning'});}
  }
  if(this.boss){this.hitClock+=dt;if(this.hitClock>=7){this.hitClock=0;this.receiveHit(this.stage===4?32:this.stage===3?28:this.stage===2?24:14);this.fx.push({x:this.boss.x,y:this.boss.y,t:0,type:'warning'});}}
 }
 receiveHit(damage){this.shield-=damage*(1-.08*this.effect('ward'))*(this.stage===4?1-.12*this.effect('insulation'):this.stage===3?1-.1*this.effect('bogguard'):1);if(this.shield<=0){this.shield=100+15*this.effect('ward');this.wood*=.98;this.ore*=.98;this.sap*=.98;this.gears*=.98;this.notify('보호막 재생! 보유 자원의 2%를 사용했습니다. 강화·진행은 유지됩니다.');}}
 combatMultiplier(){return this.stage===4?(this.grid.some(n=>n.hp>0)?.65:1.8):this.stage===2?(this.weakOpen()?1.5+.25*this.effect('weak'):.45+.12*this.effect('armor')):1;}
 enemyMultiplier(b){return this.combatMultiplier()*(b.kind==='shell'?(b.attack<1.5?1.8:.6):1);}
 weakOpen(){return this.time%9>=6;}
 nextStage(){if(!this.finished||!STAGES[this.stage]?.implemented)return false;
  this.stage++;this.stageStart=this.time;this.stageHarvest=0;this.stageKills=0;this.boss=null;this.bugs=[];
  this.bossComplete=false;this.finished=false;this.stability=0;this.bugClock=0;this.hitClock=0;this.shield=100;this.fx=[];
  this.round=1;this.startRound();this.notify(this.stage===4?'기계도시 · 발전기를 끊고 축전기를 과부하시키세요. 전 장치 정지 시 6초 정전!':this.stage===3?'오염된 늪 · 빛나는 오염 핵을 베면 6초간 생성이 느려집니다. 포자 파동 전에 정화하세요!':'공명 광산 · 새로운 공터. 장갑으로 기존 도구 위력 1/10, 9초마다 약점 3초 개방!');return true;
 }
 performWork(dt){
  const near=this.bugs.filter(b=>Math.hypot((b.x-this.selected.x)*1.3,b.y-this.selected.y)<this.radius());
  const bossInReach=this.boss&&Math.hypot(this.selected.x-this.boss.x,this.selected.y-this.boss.y)<this.radius()+.08;
  const enemy=bossInReach?this.boss:near.length&&this.combatFirst?near[0]:null;
  if(enemy){
   this.combatClock+=dt;
   if(this.combatClock>=this.swingPeriod()){
    this.combatClock-=this.swingPeriod();const multiplier=bossInReach?this.combatMultiplier()*(this.hitClock<1.5?2:1):this.enemyMultiplier(enemy);
    enemy.hp=Math.max(0,enemy.hp-this.manualPower()*this.swingPeriod()*multiplier*(this.rank('burn')?1.45:1));enemy.hitUntil=this.time+.18;
    this.fx.push({x:enemy.x,y:enemy.y,t:0,type:'slash'});if(!bossInReach&&enemy.hp<=0)this.killBug(enemy);
   }
   for(const worker of this.workers)worker.busy=false;
  }else{this.combatClock=0;this.advanceWorkers(dt);}
  const combat=this.rank('guard')/this.stageHardness()+1.2*this.effect('turret')+(this.stage===4?1.2*this.effect('cityturret'):this.stage===3?.8*this.effect('bogguard'):0);
  if(combat&&this.boss)this.boss.hp=Math.max(0,this.boss.hp-combat*dt*this.combatMultiplier());
  if(combat&&this.bugs.length){for(const b of [...this.bugs]){b.hp-=combat*dt*this.enemyMultiplier(b)/this.bugs.length;if(b.hp<=0)this.killBug(b);}}
 }
 workerSpec(){const helpers=Math.ceil(this.rank('helper')/2)+this.effect('crew')+(this.stage===4?this.effect('assembler'):this.stage===3?this.effect('bogcrew'):0),drones=Math.ceil(this.rank('drone')/2)+(this.stage===4?this.effect('citydrone'):this.stage===3?this.effect('bogdrone')+this.rank('bog_sweep'):0);return {local:1+this.rank('twin')+helpers,global:drones};}
 swingPeriod(){return .7/(1+.14*this.rank('speed')+.08*this.rank('axe'));}
 advanceWorkers(dt){
  const spec=this.workerSpec(),count=spec.local+spec.global,period=this.swingPeriod();
  while(this.workers.length<count)this.workers.push({targetId:null,clock:0,credit:0,busy:false,global:false});
  this.workers.length=count;
  const autoMultiplier=(this.rank('swarm')?1.5:1)*(this.rank('research')?1.35:1)*this.swampAuto()*this.cityAuto()*this.boost();
  const localPower=this.manualPower()*(this.rank('burn')?1.08:1)+(this.rank('helper')*.4/this.stageHardness()+this.inheritedCrew()+(this.stage===4?this.cityLocal():this.stage===3?.85*this.effect('bogcrew'):0))*autoMultiplier;
  const dronePower=(this.rank('drone')*.8/this.stageHardness()+(this.stage===4?this.cityGlobal():this.stage===3?.65*this.effect('bogdrone'):0))*(this.rank('swarm')?1.5:1)*(this.rank('research')?1.35:1)*this.swampAuto()*this.cityAuto()*this.boost();
  const claimed=new Set();
  for(let i=0;i<count;i++){
   const worker=this.workers[i];worker.global=i>=spec.local;
   const inReach=c=>worker.global||Math.hypot(((c.x+.5)/W-this.selected.x)*1.3,(c.y+.5)/H-this.selected.y)<this.radius();
   let target=this.cells[worker.targetId];
   if(!target||!this.hasWork(target)||!inReach(target)||claimed.has(target.id)){
    target=this.cells.filter(c=>this.hasWork(c)&&inReach(c)&&!claimed.has(c.id)).sort((a,b)=>Math.hypot((a.x+.5)/W-this.selected.x,(a.y+.5)/H-this.selected.y)-Math.hypot((b.x+.5)/W-this.selected.x,(b.y+.5)/H-this.selected.y))[0];worker.clock=0;
   }
   worker.targetId=target?.id??null;worker.busy=Boolean(target);
   if(!target)continue;claimed.add(target.id);worker.clock+=dt;
   if(worker.clock>=period){worker.clock-=period;
    const power=worker.global?dronePower/Math.max(1,spec.global):localPower/spec.local;
    const requested=power*period+(worker.credit||0);const used=this.removeMass(target,requested,worker.global?'auto':'manual');worker.credit=Math.min(power*period,Math.max(0,requested-used));
    if(used>0)this.fx.push({x:(target.x+.5)/W,y:(target.y+.5)/H,t:0,type:'chop',cellId:target.id,depleted:target.mass<.005});
   }
  }
 }
 damageArea(p,r,power,source){let candidates=this.cells.filter(c=>this.hasWork(c)&&Math.hypot(((c.x+.5)/W-p.x)*1.3,(c.y+.5)/H-p.y)<r);

  candidates.sort((a,b)=>Math.hypot((a.x+.5)/W-p.x,(a.y+.5)/H-p.y)-Math.hypot((b.x+.5)/W-p.x,(b.y+.5)/H-p.y));
  // Distribute damage over at most 12 tree clusters; rate remains predictable while range expands.
  candidates=candidates.slice(0,12);let remaining=power,actual=0;
  for(const c of candidates){if(remaining<=0)break;const dealt=this.removeMass(c,remaining/(candidates.length*.55),source);actual+=dealt;remaining-=dealt;}
  if(remaining>.0001){for(const c of candidates){if(remaining<=0)break;const dealt=this.removeMass(c,remaining,source);actual+=dealt;remaining-=dealt;}}
  // Empty latched areas always retarget at 80% efficiency. Spirits restore full throughput.
  if(remaining>1e-8){
   const efficiency=this.rank('helper')?1:.8;
   const distant=this.cells.filter(c=>c.mass>1e-8&&!candidates.includes(c)).sort((a,b)=>Math.hypot((a.x+.5)/W-p.x,(a.y+.5)/H-p.y)-Math.hypot((b.x+.5)/W-p.x,(b.y+.5)/H-p.y));
   for(const c of distant){if(remaining<=1e-8)break;const dealt=this.removeMass(c,remaining*efficiency,source);actual+=dealt;remaining-=dealt/efficiency;}
  }
  return actual;
 }
 removeMass(c,damage,source){const machine=this.stage===4?this.grid.find(n=>n.cellId===c.id&&n.hp>0):null;if(machine&&source!=='overload-scrap')return this.damageMachine(machine,damage,source);const resistance=this.stage===2&&!this.weakOpen()?Math.min(1,.5+.12*this.effect('armor')):1;let used=Math.min(c.mass,Math.max(0,damage)*resistance*(this.stage===3&&this.spores.includes(c.id)&&this.rank('bog_focus')?1.6:1));if(c.mass-used<1e-8)used=c.mass;if(!used)return 0;
  c.mass-=used;this.harvested+=used;this.stageHarvest+=used;this.roundHarvest+=used;this.energy=Math.min(100,this.energy+used*.18*(this.stage===4?1+.15*this.effect('battery'):1));
  let reward=used*this.woodValue()*(this.rank('compress')&&c.mass+used>=10?1.25:1);if(source==='auto')reward*=1+.25*this.rank('recycle');
  this.gainResource(reward);
  if(source==='manual')this.manualRemoval+=used;else this.autoRemoval+=used;
  if(this.rank('lightning')&&Math.floor(this.harvested/250)>Math.floor((this.harvested-used)/250)){
   const other=this.cells.filter(x=>x.mass>1).sort((a,b)=>b.mass-a.mass)[0];if(other&&other!==c){const z=Math.min(other.mass,12+this.manualPower()*.25);other.mass-=z;this.gainResource(z*this.woodValue());this.harvested+=z;this.stageHarvest+=z;this.roundHarvest+=z;this.fx.push({x:(other.x+.5)/W,y:(other.y+.5)/H,t:0,type:'lightning'});}}
  if(this.rank('chain')&&source==='manual'&&this.random()<.14){const near=this.cells.find(x=>Math.abs(c.x-x.x)<=1&&Math.abs(c.y-x.y)<=1&&x.id!==c.id&&x.mass>0);if(near){const z=Math.min(near.mass,used*.15*this.rank('chain')*(this.rank('forest')?2:1));near.mass-=z;this.harvested+=z;this.stageHarvest+=z;this.roundHarvest+=z;this.gainResource(z*this.woodValue());}}
  
  if(source==='manual'&&used>.2&&this.random()<.12)this.fx.push({x:(c.x+.5)/W,y:(c.y+.5)/H,t:0,type:'chip'});
  if(this.stage===2&&c.mass===0&&this.effect('blast')&&source!=='blast'){
   this.fx.push({x:(c.x+.5)/W,y:(c.y+.5)/H,t:0,type:'blast'});
   for(const n of this.cells.filter(n=>n.id!==c.id&&Math.abs(n.x-c.x)<=1&&Math.abs(n.y-c.y)<=1))this.removeMass(n,used*.2*this.effect('blast'),'blast');
  }
  return used;
 }
 killBug(b){if(!this.bugs.includes(b))return;this.bugs=this.bugs.filter(x=>x!==b);
  this.energy=Math.min(100,this.energy+25);
  if(b.kind==='repair'&&this.stage===4){const node=this.grid.find(n=>n.hp>0);if(node)this.damageMachine(node,node.maxHp*4,'repair-kill');}
  if(b.kind==='rusher')this.overdriveUntil=Math.max(this.overdriveUntil,this.time+6);
  if(b.kind==='shell')this.timeBonus=Math.min(8,this.timeBonus+4);
  if(b.kind==='shaman')this.freezeUntil=Math.max(this.freezeUntil,this.time+6);
  if(b.kind==='bomber'){this.fx.push({x:b.x,y:b.y,t:0,type:'blast'});this.damageArea(b,.4,18+this.manualPower()*5,'blast');}
  if(this.random()<.2){this.skillReadyAt={sweep:0,stasis:0,overdrive:0};this.notify('행운의 공명! 스킬 재사용 대기 해제');}
  this.kills++;this.stageKills++;this.essence+=(this.rank('essence')?2:1);this.gainResource(2+this.round);this.frenzyUntil=this.time+8;this.fx.push({x:b.x,y:b.y,t:0,type:'kill'});this.notify((MONSTERS[b.kind]?.name||'몬스터')+' 격파! '+(MONSTERS[b.kind]?.reward||'자원·정수')+' · 에너지 +25');}
 spawnBoss(){const map=this.mapBounds();this.boss={x:(map.x+map.width/2)/W,y:(map.y+map.height*.6)/H,hp:this.stage===4?160:this.stage===3?150:this.stage===2?80:600,maxHp:this.stage===4?160:this.stage===3?150:this.stage===2?80:600,hitUntil:0};this.notify(`${this.stageData().boss} 등장! 중앙을 공격하세요.`);}
 getStats(){return {mass:this.totalMass(),growth:this.growthRate(),manual:this.manualPower(),auto:this.autoPower(),nodes:this.nodes(),distinctNodes:this.distinctNodes(),progress:this.rules().finale?clamp(1-this.totalMass()/this.initialMass,0,1):Math.min(clamp(this.roundHarvest/this.rules().goal,0,1),clamp(1-this.totalMass()/Math.max(1,this.rules().rate*this.rules().duration),0,1)),stable:this.stability,stage:this.stage,round:this.round,remaining:Math.max(0,this.rules().duration+this.timeBonus-this.roundElapsed)};}
 toJSON(){return {version:VERSION,stasisUntil:this.stasisUntil,gears:this.gears,grid:this.grid,blackoutUntil:this.blackoutUntil,shutdowns:this.shutdowns,energy:this.energy,skills:this.skills,skillReadyAt:this.skillReadyAt,freezeUntil:this.freezeUntil,overdriveUntil:this.overdriveUntil,combatClock:this.combatClock,timeBonus:this.timeBonus,sap:this.sap,spores:this.spores,sporeClock:this.sporeClock,calmUntil:this.calmUntil,purified:this.purified,workers:this.workers,round:this.round,roundState:this.roundState,roundElapsed:this.roundElapsed,roundHarvest:this.roundHarvest,spawnBuffer:this.spawnBuffer,ore:this.ore,legacySnapshot:this.legacySnapshot,stage:this.stage,rng:this.rng,initialMass:this.initialMass,stageHarvest:this.stageHarvest,stageKills:this.stageKills,stageStart:this.stageStart,shield:this.shield,combatFirst:this.combatFirst,hitClock:this.hitClock,seed:this.seed,time:this.time,wood:this.wood,essence:this.essence,harvested:this.harvested,kills:this.kills,upgrades:this.upgrades,selected:this.selected,cells:this.cells.map(c=>c.mass),bugs:this.bugs,boss:this.boss,bossComplete:this.bossComplete,finished:this.finished,stability:this.stability,spawnedTotal:this.spawnedTotal,bugClock:this.bugClock,pulseClock:this.pulseClock,frenzyUntil:this.frenzyUntil};}
 static fromJSON(raw){if(!raw||!['0.1.0','0.2.0','0.3.0','0.4.0','0.5.0',VERSION].includes(raw.version)||!Array.isArray(raw.cells)||raw.cells.length!==W*H)throw new Error('저장 데이터 버전 또는 구조가 맞지 않습니다.');
  for(const key of ['wood','time','essence','harvested','kills'])if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 숫자: '+key);
  if(raw.cells.some(n=>!Number.isFinite(n)||n<0))throw new Error('손상된 필드');
  const g=new ForestGame(Number(raw.seed)||20261018);
  if(![1,2,3,4].includes(raw.stage||1))throw new Error('지원하지 않는 스테이지');
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
  g.boss=raw.boss&&Number.isFinite(raw.boss.hp)?{x:Number.isFinite(raw.boss.x)?clamp(raw.boss.x,0,1):.5,y:Number.isFinite(raw.boss.y)?clamp(raw.boss.y,0,1):.42,hp:clamp(raw.version==='0.1.0'?raw.boss.hp/750*g.stageData().bossHp:raw.boss.hp,0,g.stageData().bossHp),maxHp:raw.boss.maxHp||g.stageData().bossHp,hitUntil:Number(raw.boss.hitUntil)||0}:null;
  g.bossComplete=Boolean(raw.bossComplete);g.finished=Boolean(raw.finished)&&g.bossComplete;g.stability=clamp(Number(raw.stability)||0,0,5);
  g.spawnedTotal=clamp(Number(raw.spawnedTotal)||0,0,1e25);g.bugClock=clamp(Number(raw.bugClock)||0,0,22);g.pulseClock=clamp(Number(raw.pulseClock)||0,0,5);g.frenzyUntil=Number(raw.frenzyUntil)||0;
  if(['0.3.0','0.4.0','0.5.0',VERSION].includes(raw.version)){
   if(!Number.isInteger(raw.round)||raw.round<1||raw.round>ROUND_COUNT||!['active','cleared','failed'].includes(raw.roundState))throw new Error('손상된 라운드');
   g.round=raw.round;g.roundState=raw.roundState;
   for(const key of ['roundElapsed','roundHarvest','spawnBuffer','ore']){if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 라운드 숫자');g[key]=raw[key];}
   g.legacySnapshot=raw.legacySnapshot||null;
  }else{
   // Preserve old progression and its exact snapshot; convert only the field to the new round rules.
   g.legacySnapshot=raw;g.round=g.finished?10:1;
   if(!g.finished)g.startRound();else g.roundState='cleared';
   g.notify('이전 강화·자원을 유지해 라운드 모드로 이전했습니다. 원본 저장도 내부 보관합니다.');
  }
  g.workers=Array.isArray(raw.workers)?raw.workers.slice(0,32).map(w=>({targetId:Number.isInteger(w.targetId)&&w.targetId>=0&&w.targetId<W*H?w.targetId:null,clock:clamp(Number(w.clock)||0,0,g.swingPeriod()),credit:clamp(Number(w.credit)||0,0,1e5),busy:Boolean(w.busy),global:Boolean(w.global)})):[];
  if(['0.4.0','0.5.0',VERSION].includes(raw.version)){
   for(const key of ['sap','sporeClock','calmUntil','purified','energy','freezeUntil','overdriveUntil','combatClock','timeBonus']){
    if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 추가 진행 데이터: '+key);g[key]=raw[key];
   }
   g.energy=clamp(g.energy,0,100);g.timeBonus=clamp(g.timeBonus,0,8);
   if(!Array.isArray(raw.spores)||raw.spores.some(id=>!Number.isInteger(id)||id<0||id>=W*H))throw new Error('손상된 오염 핵');
   g.spores=[...new Set(raw.spores)].slice(0,4);
   if(!Array.isArray(raw.skills)||raw.skills.length!==2||new Set(raw.skills).size!==2||raw.skills.some(id=>!SKILLS.some(d=>d.id===id)))throw new Error('손상된 스킬');
   g.skills=[...raw.skills];g.skillReadyAt={};
   for(const def of SKILLS){const value=raw.skillReadyAt?.[def.id]??0;if(!Number.isFinite(value)||value<0)throw new Error('손상된 스킬 시간');g.skillReadyAt[def.id]=value;}
  }
  if(raw.version==='0.5.0'||raw.version===VERSION){
   for(const key of ['gears','blackoutUntil','shutdowns']){if(!Number.isFinite(raw[key])||raw[key]<0)throw new Error('손상된 도시 데이터');g[key]=raw[key];}
   if(!Array.isArray(raw.grid)||raw.grid.length>6)throw new Error('손상된 전력망');
   g.grid=raw.grid.map(n=>{if(!Number.isInteger(n.cellId)||n.cellId<0||n.cellId>=W*H||!['relay','capacitor'].includes(n.kind)||!Number.isFinite(n.hp)||n.hp<0||!Number.isFinite(n.maxHp)||n.maxHp<=0||n.hp>n.maxHp||!Number.isFinite(n.offlineUntil)||n.offlineUntil<0||!Number.isFinite(n.charge)||n.charge<0||n.charge>100)throw new Error('손상된 전력 장치');return {...n,disables:Number.isInteger(n.disables)&&n.disables>=0?n.disables:0};});
   if(new Set(g.grid.map(n=>n.cellId)).size!==g.grid.length)throw new Error('중복된 전력 장치');
  }
  if(raw.version===VERSION){if(!Number.isFinite(raw.stasisUntil)||raw.stasisUntil<0)throw new Error('손상된 봉인 시간');g.stasisUntil=raw.stasisUntil;}
  g.setTarget(g.selected.x,g.selected.y);
  return g;
 }
}
