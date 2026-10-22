import {ForestGame} from './engine.js';
import {SKILLS} from './data.js';

export const TRIAL_CARDS=[
 {id:'power',name:'집중 절삭',cost:3,max:3,desc:'수동 작업·공격 위력 +30% / 단계'},
 {id:'crew',name:'협업 편대',cost:3,max:3,desc:'정령 +2단계 · 드론 +1단계 / 단계'},
 {id:'reach',name:'전개 범위',cost:2,max:2,desc:'반경 +3%p · 공터 가로 +2·세로 +1 / 단계'},
 {id:'guard',name:'호위 포탑',cost:2,max:3,desc:'자동 전투 위력 +1.5/초 / 단계'},
 {id:'armor',name:'충격 흡수',cost:2,max:3,desc:'받는 피해 -15% / 단계'},
 {id:'charge',name:'에너지 회수',cost:2,max:3,desc:'채집·처치 에너지 추가 회수 / 단계'},
 {id:'tempo',name:'스킬 순환',cost:3,max:2,desc:'스킬 재사용 대기 -12% / 단계'},
 {id:'chain',name:'연쇄 가공',cost:3,max:2,desc:'연쇄 벌목 +2단계 / 단계 · 광산 폭약 활성화'},
 {id:'shock',name:'진동 발생기',unlock:'첫 구간 통과 후 도전 종료',cost:3,max:2,desc:'주기적 광역 충격파 · 2단계는 위력 강화'},
 {id:'breach',name:'장갑 분쇄',cost:2,max:2,desc:'광산 장갑 관통 +12%p · 다른 지역 적·보스 피해 +15% / 단계'},
 {id:'precision',name:'약점 연구',unlock:'도전 누적 몬스터 5마리 격파',cost:3,max:2,desc:'보스 공격 직후 피해 +35% / 단계'},
];
export const TRIAL_STYLES=[
 {id:'cutter',name:'절삭 전문가',desc:'수동 위력 +25% · 기본 드론 1단계 감소'},
 {id:'swarm',name:'편대 지휘관',desc:'기본 정령 +2·드론 +1단계 · 수동 위력 -20%'},
 {id:'ritual',name:'공명 연구자',desc:'시작 에너지 +20 · 스킬 대기 -15% · 수동 위력 -10%'},
];
export const TRIAL_RELICS=[
 {id:'ember',name:'잔불 씨앗',desc:'몬스터 격파 시 주변에 수동 위력 ×3 피해',requirement:'처음부터 사용 가능'},
 {id:'hourglass',name:'균열 모래시계',desc:'봉인 +2초 · 봉인 재사용 대기 +3초',requirement:'처음부터 사용 가능'},
 {id:'lens',name:'균열 렌즈',desc:'보스 약점 피해 ×1.35 · 수동 위력 -10%',requirement:'처음부터 사용 가능'},
 {id:'conduit',name:'회수 회로',desc:'참격으로 적 격파 시 에너지 +12 · 참격 대기 -2초',requirement:'한 도전에서 첫 구간 통과'},
 {id:'hive',name:'군집 둥지',desc:'드론 +2단계 · 수동 위력 -15%',requirement:'도전 누적 몬스터 5마리 격파'},
 {id:'tide',name:'폭주의 잔향',desc:'폭주 +3초 · 폭주 재사용 대기 +4초',requirement:'어느 지역이든 도전 첫 클리어'},
 {id:'battery',name:'불안정 축전지',desc:'적·보스가 있으면 에너지 +3/초 · 받는 피해 +20%',requirement:'도전 누적 몬스터 12마리 격파'},
 {id:'comet',name:'삼중 공명석',desc:'성공한 스킬 사용 3회마다 사용 에너지 환급',requirement:'어느 지역이든 압박 난이도 클리어'},
];
export const TRIAL_BOONS=[
 {id:'edge',name:'날 재연마',desc:'이후 수동 위력 +15%'},
 {id:'crew',name:'지원 편대',desc:'이후 정령·드론 각 +1단계'},
 {id:'heal',name:'보호막 수리',desc:'보호막 35 회복 (최대 100)'},
 {id:'charge',name:'완충 배터리',desc:'이후 구간 시작 에너지 100'},
 {id:'reach',name:'탐색 지도',desc:'이후 작업 반경 +3%p'},
 {id:'clock',name:'시간 결정',desc:'이후 구간 제한시간 +8초'},
];
export const TRIAL_LEVELS=[
 {id:1,name:'탐구',budget:18,rate:1,damage:1,desc:'18점 편성 · 보호막 파괴 시 실패 · 구간 사이 자동 회복 없음'},
 {id:2,name:'압박',budget:20,rate:1.65,damage:1.25,desc:'20점 편성 · 적 출현 간격 22→14초 · 생성량 +65%'},
 {id:3,name:'극한',budget:22,rate:2.05,damage:1.5,desc:'22점 편성 · 적 12초마다 출현 · 보스 약점 외 피해 절반'},
];
const trialBossHP=(stage,level)=>Math.round([180,280,340][level-1]*(stage===4?1.6:stage===2?.85:1));
const finite=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
export function trialProfile(raw){
 if(raw===undefined)return {version:1,nextId:1,lastRecorded:0,kills:0,waves:0,wins:{},history:[]};
 if(!raw||raw.version!==1||!Number.isInteger(raw.nextId)||!finite(raw.nextId,1,1e9)||!Number.isInteger(raw.lastRecorded)||!finite(raw.lastRecorded,0,raw.nextId-1)||!Number.isInteger(raw.kills)||!finite(raw.kills,0,1e8)||!Number.isInteger(raw.waves)||!finite(raw.waves,0,3)||!raw.wins||!Array.isArray(raw.history)||raw.history.length>30)throw new Error('도전 연구 저장이 손상되었습니다.');
 const wins={};for(let stage=1;stage<=4;stage++){const n=raw.wins[stage]??0;if(!Number.isInteger(n)||!finite(n,0,3))throw new Error('손상된 난이도 기록');if(n)wins[stage]=n;}
 return {...raw,wins,history:raw.history.map(row=>{if(!row||typeof row.summary!=='string'||row.summary.length>600||!Number.isInteger(row.id)||!finite(row.id,1,raw.lastRecorded))throw new Error('손상된 도전 기록');return {id:row.id,summary:row.summary};})};
}
export function unlockedRelics(profile){return TRIAL_RELICS.filter(r=>['ember','hourglass','lens'].includes(r.id)||r.id==='conduit'&&profile.waves>=1||r.id==='hive'&&profile.kills>=5||r.id==='tide'&&Object.values(profile.wins).some(n=>n>=1)||r.id==='battery'&&profile.kills>=12||r.id==='comet'&&Object.values(profile.wins).some(n=>n>=2)).map(r=>r.id);}
export function unlockedCards(profile){return TRIAL_CARDS.filter(c=>!c.unlock||c.id==='shock'&&profile.waves>=1||c.id==='precision'&&profile.kills>=5).map(c=>c.id);}
export function buildCost(build){return TRIAL_CARDS.reduce((n,c)=>n+c.cost*(build[c.id]||0),0);}
export function validateTrialConfig(config,profile,maxStage){
 if(!config||!Number.isInteger(config.id)||!finite(config.id,1,1e9)||!Number.isInteger(config.seed)||!Number.isInteger(config.stage)||!finite(config.stage,1,Math.min(4,maxStage))||!Number.isInteger(config.level)||!finite(config.level,1,Math.min(3,(profile.wins[config.stage]||0)+1))||!TRIAL_STYLES.some(s=>s.id===config.style))throw new Error('사용할 수 없는 도전 설정입니다.');
 const allowedCards=unlockedCards(profile);const build={};for(const c of TRIAL_CARDS){const n=config.build?.[c.id]??0;if(!Number.isInteger(n)||!finite(n,0,c.max))throw new Error('강화 단계가 잘못되었습니다.');if(n&&!allowedCards.includes(c.id))throw new Error('해금되지 않은 연구 강화입니다.');if(n)build[c.id]=n;}
 if(buildCost(build)>TRIAL_LEVELS[config.level-1].budget)throw new Error('편성 예산을 초과했습니다.');
 const unlocked=unlockedRelics(profile);if(!Array.isArray(config.relics)||config.relics.length>2||new Set(config.relics).size!==config.relics.length||config.relics.some(id=>!unlocked.includes(id)))throw new Error('유물은 해금된 것 중 최대 2개를 고르세요.');
 if(!Array.isArray(config.skills)||config.skills.length!==2||new Set(config.skills).size!==2||config.skills.some(id=>!SKILLS.some(s=>s.id===id)))throw new Error('서로 다른 스킬 2개를 고르세요.');
 return {...config,build,relics:[...config.relics],skills:[...config.skills]};
}
export class TrialGame extends ForestGame {
 constructor(config,profile=trialProfile(),maxStage=4){
  super(config.seed);const c=validateTrialConfig(config,profile,maxStage);
  this.trial={...c,wave:0,boons:[],offers:[],casts:0,hits:0,dodges:0,bossAim:null};this.stage=c.stage;this.round=4;this.skills=[...c.skills];this.configure();this.startRound();
 }
 tier(id){return this.trial?.build[id]||0;}
 relic(id){return this.trial?.relics.includes(id)||false;}
 boon(id){return this.trial?.boons.filter(x=>x===id).length||0;}
 configure(){this.upgrades={axe:3,speed:2,twin:1,helper:2+this.tier('crew')*2+(this.trial.style==='swarm'?2:0)+this.boon('crew'),drone:2+this.tier('crew')+(this.trial.style==='swarm'?1:this.trial.style==='cutter'?-1:0)+(this.relic('hive')?2:0)+this.boon('crew'),range:2,guard:Math.min(5,1+this.tier('guard'))};
  if(this.tier('chain')){this.upgrades.chain=this.tier('chain')*2;if(this.stage>=2)this.upgrades.mine_blast_1=1;}
  if(this.tier('shock')){this.upgrades.shock=1;this.upgrades.shockPower=(this.tier('shock')-1)*2;}
  if(this.stage>=2){this.upgrades.mine_armor_1=1;for(let i=0;i<this.tier('breach');i++)this.upgrades['mine_armor_'+(i+2)]=1;}
  this.effectCache={};
 }
 stageHardness(){return this.trial?1:super.stageHardness();}
 manualPower(){return super.manualPower()*(this.trial?(1+.3*this.tier('power'))*(1+.15*this.boon('edge'))*(this.trial.style==='cutter'?1.25:this.trial.style==='swarm'?.8:.9)*(this.relic('lens')?.9:1)*(this.relic('hive')?.85:1):1);}
 mapBounds(){if(!this.trial)return super.mapBounds();const width=8+2*this.tier('reach'),height=5+this.tier('reach');return {x:Math.floor((18-width)/2),y:Math.floor((11-height)/2),width,height};}
 radius(){return this.trial ? .18+.03*this.tier('reach')+.03*this.boon('reach'):super.radius();}
 rules(){if(!this.trial)return super.rules();const finale=this.trial.wave===2,rate=[3,5,7][this.trial.wave]*TRIAL_LEVELS[this.trial.level-1].rate;
  return {duration:(finale?110:65)+8*this.boon('clock'),rate,goal:finale||this.stage===4?0:rate*22,initial:finale?40:9+this.trial.wave*6,finale,title:finale?'연구 보스':'연구 구간'};
 }
 startRound(){super.startRound();if(this.trial){this.energy=this.boon('charge')?100:this.trial.style==='ritual'?55:35;this.notify(`연구 도전 ${this.trial.wave+1}/3 · ${this.stage===4?'전력 장치와 잔량을 정리하세요.':'채집·전투·공격 예고에 대응하세요.'}`);}}
 initGrid(){super.initGrid();if(this.trial)for(const node of this.grid){node.hp*=1+(this.trial.level-1)*.75;node.maxHp=node.hp;}}
 clearRound(){if(this.trial&&this.stage===4&&this.grid.some(n=>n.hp>0))return;super.clearRound();if(this.trial)this.notify('구간 통과! 정비 보상 하나를 고르고 다음 구간으로 진행하세요.');}
 skillsUnlocked(){return this.trial?true:super.skillsUnlocked();}
 buy(){return false;}
 nextStage(){return false;}
 retryRound(){return false;}
 equipSkill(){return false;}
 combatMultiplier(){const weak=this.hitClock<1.5;return super.combatMultiplier()*(this.trial&&this.stage!==2?1+.15*this.tier('breach'):1)*(this.trial&&this.boss?(weak?(1+.35*this.tier('precision'))*(this.relic('lens')?1.35:1):this.trial.level===3?.5:1):1);}
 performWork(dt){super.performWork(dt);if(!this.trial)return;const extra=.5*this.tier('guard');if(this.boss)this.boss.hp=Math.max(0,this.boss.hp-extra*dt*this.combatMultiplier());for(const b of [...this.bugs]){b.hp-=extra*dt*this.enemyMultiplier(b)/Math.max(1,this.bugs.length);if(b.hp<=0)this.killBug(b);}}
 receiveHit(damage){if(!this.trial)return super.receiveHit(damage);
  const aim=this.incoming?.shift();if(aim&&Math.hypot((this.selected.x-aim.x)*1.3,this.selected.y-aim.y)>.09){this.trial.dodges++;this.notify('공격 회피! 예고 지점에서 벗어났습니다.');return;}
  this.trial.hits++;this.shield-=damage*(1-.15*this.tier('armor'))*TRIAL_LEVELS[this.trial.level-1].damage*(this.relic('battery')?1.2:1);
 }
 advanceBugs(dt){if(!this.trial)return super.advanceBugs(dt);if(this.time<this.stasisUntil)return;
  this.incoming=[];
  for(const b of this.bugs){if((b.attack||0)+dt>=4.5&&!b.aim)b.aim={...this.selected};if((b.attack||0)+dt>=6)this.incoming.push(b.aim||{...this.selected});}
  if(this.boss){if(this.hitClock+dt>=5.5&&!this.trial.bossAim)this.trial.bossAim={...this.selected};if(this.hitClock+dt>=7)this.incoming.push(this.trial.bossAim||{...this.selected});}
  super.advanceBugs(dt);for(const b of this.bugs)if(b.attack<4.5)b.aim=null;if(this.hitClock<5.5)this.trial.bossAim=null;this.incoming=[];
 }
 castSkill(id){const def=SKILLS.find(d=>d.id===id);this.casting=id;const cast=super.castSkill(id);this.casting=null;if(!cast||!this.trial)return cast;
  this.trial.casts++;const factor=(1-.12*this.tier('tempo'))*(this.trial.style==='ritual'?.85:1);
  this.skillReadyAt[id]=this.time+Math.max(0,this.skillReadyAt[id]-this.time)*factor;
  if(id==='stasis'&&this.relic('hourglass')){this.stasisUntil+=2;this.freezeUntil+=2;this.skillReadyAt[id]+=3;}
  if(id==='overdrive'&&this.relic('tide')){this.overdriveUntil+=3;this.skillReadyAt[id]+=4;}
  if(this.relic('comet')&&this.trial.casts%3===0)this.energy=Math.min(100,this.energy+def.cost);
  return true;
 }
 removeMass(c,damage,source){const before=this.energy,used=super.removeMass(c,damage,source);if(this.trial&&used>0)this.energy=Math.min(100,this.energy+Math.max(0,this.energy-before)*.35*this.tier('charge'));return used;}
 killBug(b){const exists=this.bugs.includes(b);super.killBug(b);if(!this.trial||!exists)return;
  this.energy=Math.min(100,this.energy+3*this.tier('charge'));
  if(this.casting==='sweep'&&this.relic('conduit')){this.energy=Math.min(100,this.energy+12);this.skillReadyAt.sweep=Math.max(this.time,(this.skillReadyAt.sweep||0)-2);}
  if(this.relic('ember'))this.damageArea(b,.25,this.manualPower()*3,'ember');
 }
 spawnBoss(){super.spawnBoss();if(this.trial){const hp=trialBossHP(this.stage,this.trial.level);this.boss.hp=this.boss.maxHp=hp;}}
 tick(dt){if(!this.trial)return super.tick(dt);if(this.finished||this.roundState!=='active')return;
  dt=Math.max(0,Math.min(.2,dt));const shield=this.shield;
  if(this.trial.level>1&&!this.boss)this.bugClock+=dt*(22/(this.trial.level===2?14:12)-1);
  super.tick(dt);this.shield=Math.min(shield,this.shield);
  if(this.relic('battery')&&(this.boss||this.bugs.length))this.energy=Math.min(100,this.energy+dt*3);
  if(this.shield<=0){this.shield=0;this.finished=false;this.roundState='failed';this.notify('보호막 파괴 · 편성을 바꾸거나 공격 예고 지점을 피하세요.');}
  if(this.roundState==='cleared'&&!this.finished&&!this.trial.offers.length){const pool=[...TRIAL_BOONS];for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}this.trial.offers=pool.slice(0,3).map(b=>b.id);}
 }
 nextRound(boon){if(!this.trial||this.trial.wave>=2||this.finished||this.roundState!=='cleared'||!this.trial.offers.includes(boon))return false;
  const shield=this.shield;this.trial.boons.push(boon);this.trial.offers=[];this.trial.wave++;this.round=[4,7,10][this.trial.wave];this.configure();this.startRound();this.shield=Math.min(100,shield+(boon==='heal'?35:0));return true;
 }
 toJSON(){return {...super.toJSON(),trial:this.trial?JSON.parse(JSON.stringify(this.trial)):undefined};}
 static fromJSON(raw,profile,maxStage=4){
  const t=raw?.trial;if(!t)throw new Error('도전 저장이 아닙니다.');if(t.seed!==raw.seed||t.id>=profile.nextId||!finite(raw.selected?.x,0,1)||!finite(raw.selected?.y,0,1))throw new Error('손상된 도전 저장');
  // An already started run may resume with its original unlocked configuration.
  validateTrialConfig(t,profile,maxStage);
  if(!Number.isInteger(t.wave)||!finite(t.wave,0,2)||raw.stage!==t.stage||raw.round!==[4,7,10][t.wave]||!Array.isArray(t.boons)||t.boons.length!==t.wave||t.boons.some(id=>!TRIAL_BOONS.some(b=>b.id===id))||!Array.isArray(t.offers)||t.offers.length>3||new Set(t.offers).size!==t.offers.length||t.offers.some(id=>!TRIAL_BOONS.some(b=>b.id===id)))throw new Error('손상된 도전 구간');
  for(const key of ['casts','hits','dodges'])if(!Number.isInteger(t[key])||!finite(t[key],0,1e8))throw new Error('손상된 도전 통계');
  if(t.bossAim&&(!finite(t.bossAim.x,0,1)||!finite(t.bossAim.y,0,1)))throw new Error('손상된 공격 예고');
  const maxBoss=trialBossHP(t.stage,t.level);if(raw.boss&&(!finite(raw.boss.hp,0,maxBoss)||raw.boss.maxHp!==maxBoss))throw new Error('손상된 도전 보스');
  if(raw.finished&&(t.wave!==2||raw.roundState!=='cleared'||!raw.bossComplete)||t.wave===2&&raw.roundState==='cleared'&&!raw.finished)throw new Error('손상된 도전 완료 상태');
  if(raw.roundState==='cleared'&&!raw.finished&&t.offers.length!==3)throw new Error('손상된 정비 보상');if(raw.bugs?.some(b=>b.aim&&(!finite(b.aim.x,0,1)||!finite(b.aim.y,0,1))))throw new Error('손상된 적 공격 예고');
  const g=ForestGame.fromJSON(raw);if(g.boss)g.boss.hp=raw.boss.hp;Object.setPrototypeOf(g,TrialGame.prototype);g.trial=JSON.parse(JSON.stringify(t));g.stage=t.stage;g.configure();g.skills=[...t.skills];g.setTarget(raw.selected.x,raw.selected.y);g.notify(`연구 도전 ${t.wave+1}/3 · 저장한 편성으로 이어갑니다.`);return g;
 }
}
export function recordTrial(profile,game,abandon=false){
 if(!game.trial||game.trial.id<=profile.lastRecorded||!abandon&&game.roundState!=='failed'&&!game.finished)return [];
 const before=unlockedRelics(profile);profile.lastRecorded=game.trial.id;profile.kills+=game.kills;profile.waves=Math.max(profile.waves,game.finished?3:game.trial.wave+(game.roundState==='cleared'?1:0));
 if(game.finished)profile.wins[game.stage]=Math.max(profile.wins[game.stage]||0,game.trial.level);
 const level=TRIAL_LEVELS[game.trial.level-1].name,style=TRIAL_STYLES.find(s=>s.id===game.trial.style).name;
 const choices=TRIAL_CARDS.filter(c=>game.trial.build[c.id]).map(c=>c.name+game.trial.build[c.id]).join('/');const relics=game.trial.relics.map(id=>TRIAL_RELICS.find(r=>r.id===id).name).join('+');
 const summary=`${game.stageData().name} · ${level} · ${game.finished?'클리어':abandon?'중단':'실패'} · ${game.trial.wave+1}/3구간 · ${style} · 격파 ${game.kills} · 회피 ${game.trial.dodges} · ${Math.round(game.time)}초 · 편성 ${choices||'없음'} · 유물 ${relics||'없음'} · 스킬 ${game.skills.map(id=>SKILLS.find(s=>s.id===id).name).join('+')}`;
 profile.history.unshift({id:game.trial.id,summary});profile.history.length=Math.min(30,profile.history.length);
 return unlockedRelics(profile).filter(id=>!before.includes(id));
}
