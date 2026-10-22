export const VERSION = '0.6.0';
export const W = 18;
export const H = 11;

const FOREST_UPGRADES = [
  {id:'axe',group:'work',name:'강철 도끼',desc:'기본 작업 위력 +65% / 단계',base:15,scale:1.55,max:8,min:0},
  {id:'speed',group:'work',name:'고속 벌목',desc:'기본 작업 위력 +45% / 단계',base:25,scale:1.7,max:7,min:1},
  {id:'range',group:'work',name:'확장 손잡이',desc:'작업 반경 +5.5%p · 공터 가로 +2칸 / 단계',base:32,scale:1.9,max:6,min:1},
  {id:'twin',group:'work',name:'쌍날 도끼',desc:'동시 도끼 +1 · 전체 수동 위력 1.6배',base:110,scale:1,max:1,min:3},
  {id:'precise',group:'work',name:'정밀 타격',desc:'대상별 타격 효율 +18% / 단계',base:90,scale:2.1,max:4,min:4},
  {id:'frenzy',group:'work',name:'폭풍 손잡이',desc:'적 처치 후 8초간 수동 공격 강화',base:330,scale:1,max:1,min:8},
  {id:'chain',group:'special',name:'연쇄 벌목',desc:'피해 일부가 주변 나무에 전달',base:75,scale:2.0,max:5,min:3},
  {id:'shock',group:'special',name:'진동 도끼',desc:'주기적으로 광역 충격파 발생',base:180,scale:1,max:1,min:5},
  {id:'shockPower',group:'special',name:'충격파 강화',desc:'충격파 피해 +35% / 단계',base:200,scale:1.9,max:4,min:7,requires:'shock'},
  {id:'lightning',group:'special',name:'전격 쇄도',desc:'벌목 250그루마다 추가 낙뢰',base:350,scale:1,max:1,min:9},
  {id:'burn',group:'special',name:'불꽃 도끼',desc:'적 공격력 +45%, 나무 공격력 +8%',base:450,scale:1,max:1,min:10},
  {id:'forest',group:'special',name:'숲의 메아리',desc:'연쇄 피해 2배',base:650,scale:1,max:1,min:13,requires:'chain'},
  {id:'helper',group:'auto',name:'벌목 정령',desc:'자동 위력 +0.4/초 · 2단계마다 작업 도끼 +1',base:65,scale:1.65,max:8,min:3},
  {id:'drone',group:'auto',name:'순찰 드론',desc:'자동 처리 위력 +0.8/초 / 단계',base:170,scale:1.8,max:6,min:7},
  {id:'target',group:'auto',name:'목표 추적',desc:'자동 작업이 밀집한 지점을 우선',base:225,scale:1,max:1,min:8},
  {id:'guard',group:'auto',name:'방어 포탑',desc:'자동 몬스터 공격 +1/초 / 단계',base:210,scale:2.0,max:5,min:5},
  {id:'recycle',group:'auto',name:'재활용 엔진',desc:'자동 벌목 보상 +25% / 단계',base:255,scale:2.1,max:4,min:10},
  {id:'swarm',group:'auto',name:'군집 협업',desc:'자동 작업 능력 +50%',base:720,scale:1,max:1,min:15,requires:'drone'},
  {id:'value',group:'economy',name:'목재 거래',desc:'목재 가치 +35% / 단계',base:20,scale:1.6,max:8,min:0},
  {id:'luck',group:'economy',name:'희귀 벌목',desc:'자원 획득량 +16% / 단계',base:90,scale:1.85,max:6,min:5},
  {id:'fertile',group:'economy',name:'공터 개척',desc:'공터 가로 +2·세로 +1칸, 수확 가치 +45%',base:120,scale:2,max:4,min:6},
  {id:'essence',group:'economy',name:'정령 정제',desc:'벌레 처치 정수 보상 2배',base:180,scale:1,max:1,min:7},
  {id:'compress',group:'economy',name:'차원 압축',desc:'압축 등급 나무 벌목 보상 +25%',base:280,scale:1,max:1,min:9},
  {id:'research',group:'economy',name:'생명의 연구',desc:'모든 작업 위력 +35%',base:1000,scale:1,max:1,min:16},
];
export const GROUPS = [
  {id:'work',name:'🪓 기본'},
  {id:'special',name:'⚡ 특수'},
  {id:'auto',name:'🤖 자동화'},
  {id:'economy',name:'💰 경제'},
];
export const TREE_COLORS=['#61c779','#59aefa','#b887f5','#f0c55c','#fa8073','#f5a9df','#ddf9f7'];
export const SKILLS=[
 {id:'sweep',name:'회전 참격',cost:30,cooldown:14,desc:'범위 내 총 피해량을 나누는 순간 참격 · 밀집 자원·적 처리'},
 {id:'stasis',name:'시간 봉인',cost:25,cooldown:18,desc:'5초간 생성·적 행동·기계 재가동 봉인 · 막판 정리용'},
 {id:'overdrive',name:'작업 폭주',cost:35,cooldown:20,desc:'6초간 작업·공격 위력 1.6배 · 지속 처리·보스용'},
];
export const MONSTERS={
 rusher:{name:'돌진 벌레',hp:.8,damage:.8,color:'#e69a68',reward:'6초 작업 가속'},
 shell:{name:'장갑 딱정벌레',hp:1.4,damage:1.2,color:'#8fabe5',reward:'제한시간 +4초 (최대 2회)'},
 bomber:{name:'폭발 반딧불',hp:.7,damage:1,color:'#f3d36e',reward:'주변 자원 연쇄 폭발'},
 shaman:{name:'증식 주술충',hp:1,damage:.6,color:'#d694db',reward:'6초 생성 정지'},
 repair:{name:'수리 드론',hp:1.1,damage:.5,color:'#75e3d3',reward:'전력 장치 하나 강제 정지'},
};
export function fmt(n){
  if(!Number.isFinite(n))return '0';
  const a=Math.abs(n),labels=['','K','M','B','T','Qa','Qi'];
  if(a<1000)return Math.floor(n).toLocaleString('ko-KR');
  const tier=Math.min(labels.length-1,Math.floor(Math.log10(a)/3));
  return `${(n/1000**tier).toFixed(a/1000**tier>=100?0:1)}${labels[tier]}`;
}
export function tierOf(mass){return Math.min(TREE_COLORS.length-1,Math.max(0,Math.floor(Math.log10(Math.max(1,mass)))));}

// The 240-node campaign budget remains fixed; stages 1–4 are playable.
export const STAGES = [
 {id:1,name:'증식하는 숲',nodes:24,implemented:true,boss:'고대 나무의 심장',bossHp:18000,goal:247500,theme:'forest'},
 {id:2,name:'공명 광산',nodes:32,implemented:true,boss:'공명 골렘',bossHp:100000,goal:1200000,theme:'mine'},
 {id:3,name:'오염된 늪',nodes:38,implemented:true,boss:'포자의 여왕',bossHp:150,theme:'swamp'},
 {id:4,name:'기계도시',nodes:44,implemented:true,boss:'중앙 제어 거신',bossHp:160,theme:'city'},
 {id:5,name:'원소 폭주',nodes:48,implemented:false},
 {id:6,name:'무한 증식의 심장',nodes:54,implemented:false},
];
const MINE_FAMILIES = [
 ['drill','work','관통 드릴','광산 수동 위력 +18%',70],
 ['weak','work','균열 탐지','약점 개방 중 공격 +25%',85],
 ['blast','special','공명 폭약','광맥 파괴 시 주변 연쇄 피해 +20%',90],
 ['armor','special','장갑 분쇄','광석·몬스터 장갑 관통 +12%p',100],
 ['crew','auto','채굴 정령','자동 채굴 +0.8/초',75],
 ['turret','auto','수정 포탑','자동 전투 +1.2/초',100],
 ['trade','economy','광물 정제','광산 자원 가치 +20%',80],
 ['ward','economy','보호 공명','받는 피해 -8%, 보호막 +15',80],
];
const MINE_UPGRADES=MINE_FAMILIES.flatMap(([effect,group,name,desc,base])=>Array.from({length:4},(_,i)=>({
 id:`mine_${effect}_${i+1}`,effect,group,name:`${name} ${['I','II','III','IV'][i]}`,desc,base:base*.7*(1+i*.75),
 scale:1,max:1,min:0,stage:2,requires:i?`mine_${effect}_${i}`:undefined,
})));
const UNLOCK_ROUND={axe:1,value:2,speed:2,range:2,helper:3,chain:3,twin:2,precise:4,guard:4,luck:4,shock:5,recycle:5,drone:6,essence:6,frenzy:6,shockPower:6,lightning:7,compress:7,burn:8,forest:8,fertile:5,swarm:9,research:9};
const MINE_UNLOCK={drill:1,armor:1,weak:2,trade:2,blast:3,crew:1,turret:4,ward:4};
const SWAMP_FAMILIES=[
 ['bogblade','work','정화 낫','늪 수동 위력 +30% · 반경 +2.5%p',30,1],
 ['cleanse','special','포자 억제','증식 파동의 추가 생성 배율 -12%p',40,2],
 ['bogcrew','auto','습지 정령','늪 자동 위력 +0.85/초 · 작업 낫 +1',38,1],
 ['bogdrone','auto','반딧불 순찰','전역 작업 위력 +0.65/초 · 전역 낫 +1',50,3],
 ['distill','economy','수액 증류','수액 수확 가치 +20% · 2단계마다 공터 확장',35,2],
 ['survey','work','습지 개척','공터 가로 +2·세로 +1칸 · 작업 반경 +4%p',40,2],
 ['rootstudy','special','핵 정화 연구','정화의 고요 +0.75초 · 핵 보상 +3 수액',45,3],
 ['bogguard','auto','정화 등불','자동 전투 +0.8/초 · 오염충 공격 피해 -10%',50,4],
];
const SWAMP_UPGRADES=SWAMP_FAMILIES.flatMap(([effect,group,name,desc,base,unlock])=>Array.from({length:4},(_,i)=>({
 id:`bog_${effect}_${i+1}`,effect,group,name:`${name} ${['I','II','III','IV'][i]}`,desc,
 base:Math.round(base*(1+i*.8)),scale:1,max:1,min:0,stage:3,unlockRound:Math.max(unlock,[1,3,6,8][i]),requires:i?`bog_${effect}_${i}`:undefined,
})));
const SWAMP_RELICS=[
 ['respite','special','숨 고르는 습지','증식 파동의 간격 +2초',8,4],
 ['echo','work','정화 공명','핵 정화 후 고요 동안 수동 위력 +40%',10,5],
 ['crown','economy','정화의 보상','오염 핵 정화 정수 +2 · 수액 보상 +50%',12,6],
 ['sweep','auto','빛의 무리','전역 낫 +1 · 늪 자동 위력 +20%',15,7],
 ['focus','work','핵 집중 타격','오염 핵에 작업 피해 +60%',10,5],
 ['mastery','special','습지의 수호자','늪 수동·자동 작업 위력 +35%',22,9],
].map(([id,group,name,desc,base,unlockRound])=>({id:`bog_${id}`,group,name,desc,base,unlockRound,currency:'essence',stage:3,scale:1,max:1,min:0}));
const CITY_FAMILIES=[
 ['cutter','work','플라스마 절단기','도시 수동 위력 +35% · 작업 반경 +2%p',32,1],
 ['assembler','auto','분해 로봇','도시 자동 위력 +0.75/초 · 작업 도구 +1',36,1],
 ['citydrone','auto','회수 드론','도시 전역 작업 위력 +0.55/초 · 전역 도구 +1',48,3],
 ['conduit','work','회로 개척','공터 가로 +2·세로 +1칸 · 작업 반경 +4.5%p',42,2],
 ['scrap','economy','부품 재활용','기계 부품 수확 가치 +20%',36,2],
 ['insulation','special','절연 코팅','도시 몬스터 피해 -12%',44,3],
 ['shutdown','special','회로 차단기','장치 정지 시간 +1.5초',42,2],
 ['overload','special','과부하 증폭','축전기 연쇄 피해 +12%p · 폭발 위력 증가',50,3],
 ['battery','economy','에너지 회수','도시 채집 에너지 충전 +15% · 장치 첫 정지 에너지 +1',40,3],
 ['cityturret','auto','전자기 포탑','도시 자동 전투 위력 +1.2/초',52,4],
];
const CITY_UPGRADES=CITY_FAMILIES.flatMap(([effect,group,name,desc,base,unlock])=>Array.from({length:4},(_,i)=>({
 id:`city_${effect}_${i+1}`,effect,group,name:`${name} ${['I','II','III','IV'][i]}`,desc,
 base:Math.round(base*(1+i*.9)),scale:1,max:1,min:0,stage:4,unlockRound:Math.max(unlock,[1,3,6,8][i]),requires:i?`city_${effect}_${i}`:undefined,
})));
const CITY_RELICS=[
 ['cascade','special','연쇄 붕괴','축전기 연결 피해 1.6배',12,5],
 ['salvage','economy','도시의 유산','장치 첫 정지 부품 보상 +50% · 정수 +1',12,6],
 ['tempo','work','회로 역류','장치 첫 정지 시 장착 스킬 하나의 대기 시간 해제',18,7],
 ['mastery','auto','기계도시 지휘권','도시 수동·자동 위력 +30%',24,9],
].map(([id,group,name,desc,base,unlockRound])=>({id:`city_${id}`,group,name,desc,base,unlockRound,currency:'essence',stage:4,scale:1,max:1,min:0}));
export const UPGRADES=[...FOREST_UPGRADES.map(d=>({...d,stage:1,unlockRound:UNLOCK_ROUND[d.id]})),...MINE_UPGRADES.map(d=>({...d,unlockRound:Math.max(MINE_UNLOCK[d.effect],[1,3,6,8][Number(d.id.at(-1))-1])})),...SWAMP_UPGRADES,...SWAMP_RELICS,...CITY_UPGRADES,...CITY_RELICS].map(d=>['mine_drill_1','mine_armor_1','bog_bogblade_1','city_cutter_1'].includes(d.id)?{...d,max:4,scale:1.65}:d);

// Each stage grows from an almost empty clearing into a finite screen-filling finale.
export const ROUND_COUNT=10;
export const ROUND_RATES=[1,1.4,2.4,3.5,4.8,6.2,8,10,13,20];
export function roundRules(stage,round){
 const finale=round===ROUND_COUNT;
 const rate=(stage===4?[1.8,2.4,3.2,4.6,5.5,6.6,7.8,9.2,9.8,13]:stage===3?[1.8,2.5,3.4,4.2,5,6,7,8,9,12]:stage===2?[1.2,1.5,1.8,2.3,2.8,3.5,4.2,5,6,8]:ROUND_RATES)[round-1];
 return {duration:finale?150:75,rate,goal:finale?0:rate*24,
  initial:finale?W*H:3+(round-1)*2,finale,
  title:finale?'최종 라운드 · 대청소':`성장 라운드 ${round}`};
}
