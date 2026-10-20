export const VERSION = '0.2.0';
export const W = 18;
export const H = 11;

const FOREST_UPGRADES = [
  {id:'axe',group:'work',name:'강철 도끼',desc:'수동 작업 위력 +30% / 단계',base:15,scale:1.55,max:8,min:0},
  {id:'speed',group:'work',name:'고속 벌목',desc:'수동 작업 위력 +22% / 단계',base:25,scale:1.7,max:7,min:1},
  {id:'range',group:'work',name:'확장 손잡이',desc:'작업 반경 +1.8%p / 단계',base:32,scale:1.9,max:6,min:1},
  {id:'twin',group:'work',name:'쌍날 도끼',desc:'수동 작업 위력 1.6배',base:110,scale:1,max:1,min:3},
  {id:'precise',group:'work',name:'정밀 타격',desc:'대상별 타격 효율 +18% / 단계',base:90,scale:2.1,max:4,min:4},
  {id:'frenzy',group:'work',name:'폭풍 손잡이',desc:'적 처치 후 8초간 수동 공격 강화',base:330,scale:1,max:1,min:8},
  {id:'chain',group:'special',name:'연쇄 벌목',desc:'피해 일부가 주변 나무에 전달',base:75,scale:2.0,max:5,min:3},
  {id:'shock',group:'special',name:'진동 도끼',desc:'주기적으로 광역 충격파 발생',base:180,scale:1,max:1,min:5},
  {id:'shockPower',group:'special',name:'충격파 강화',desc:'충격파 피해 +35% / 단계',base:200,scale:1.9,max:4,min:7,requires:'shock'},
  {id:'lightning',group:'special',name:'전격 쇄도',desc:'벌목 250그루마다 추가 낙뢰',base:350,scale:1,max:1,min:9},
  {id:'burn',group:'special',name:'불꽃 도끼',desc:'적 공격력 +45%, 나무 공격력 +8%',base:450,scale:1,max:1,min:10},
  {id:'forest',group:'special',name:'숲의 메아리',desc:'연쇄 피해 2배',base:650,scale:1,max:1,min:13,requires:'chain'},
  {id:'helper',group:'auto',name:'벌목 정령',desc:'자동 벌목 위력 +4/초 / 단계',base:65,scale:1.65,max:8,min:3},
  {id:'drone',group:'auto',name:'순찰 드론',desc:'화면 전체 자동 처리 +8/초 / 단계',base:170,scale:1.8,max:6,min:7},
  {id:'target',group:'auto',name:'목표 추적',desc:'자동 작업이 밀집한 지점을 우선',base:225,scale:1,max:1,min:8},
  {id:'guard',group:'auto',name:'방어 포탑',desc:'자동 몬스터 공격 +10/초 / 단계',base:210,scale:2.0,max:5,min:5},
  {id:'recycle',group:'auto',name:'재활용 엔진',desc:'자동 벌목 보상 +25% / 단계',base:255,scale:2.1,max:4,min:10},
  {id:'swarm',group:'auto',name:'군집 협업',desc:'자동 작업 능력 +50%',base:720,scale:1,max:1,min:15,requires:'drone'},
  {id:'value',group:'economy',name:'목재 거래',desc:'목재 가치 +35% / 단계',base:20,scale:1.6,max:8,min:0},
  {id:'luck',group:'economy',name:'희귀 벌목',desc:'자원 획득량 +16% / 단계',base:90,scale:1.85,max:6,min:5},
  {id:'fertile',group:'economy',name:'증식 촉진',desc:'나무 생성 +22%, 수확 가치 +45%',base:120,scale:2,max:4,min:6},
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
export function fmt(n){
  if(!Number.isFinite(n))return '0';
  const a=Math.abs(n),labels=['','K','M','B','T','Qa','Qi'];
  if(a<1000)return Math.floor(n).toLocaleString('ko-KR');
  const tier=Math.min(labels.length-1,Math.floor(Math.log10(a)/3));
  return `${(n/1000**tier).toFixed(a/1000**tier>=100?0:1)}${labels[tier]}`;
}
export function tierOf(mass){return Math.min(TREE_COLORS.length-1,Math.max(0,Math.floor(Math.log10(Math.max(1,mass)))));}

// The 240-node campaign budget remains fixed. Only stages 1–2 are playable in Alpha 0.2.
export const STAGES = [
 {id:1,name:'증식하는 숲',nodes:24,implemented:true,boss:'고대 나무의 심장',bossHp:18000,goal:247500,theme:'forest'},
 {id:2,name:'공명 광산',nodes:32,implemented:true,boss:'공명 골렘',bossHp:100000,goal:1200000,theme:'mine'},
 {id:3,name:'오염된 늪',nodes:38,implemented:false},
 {id:4,name:'기계도시',nodes:44,implemented:false},
 {id:5,name:'원소 폭주',nodes:48,implemented:false},
 {id:6,name:'무한 증식의 심장',nodes:54,implemented:false},
];
const MINE_FAMILIES = [
 ['drill','work','관통 드릴','광산 수동 위력 +18%',70],
 ['weak','work','균열 탐지','약점 개방 중 공격 +25%',85],
 ['blast','special','공명 폭약','광맥 파괴 시 주변 연쇄 피해 +20%',90],
 ['armor','special','장갑 분쇄','광석·몬스터 장갑 관통 +12%p',100],
 ['crew','auto','채굴 정령','자동 채굴 +12/초',75],
 ['turret','auto','수정 포탑','자동 전투 +18/초',100],
 ['trade','economy','광물 정제','광산 자원 가치 +20%',80],
 ['ward','economy','보호 공명','받는 피해 -8%, 보호막 +15',80],
];
const MINE_UPGRADES=MINE_FAMILIES.flatMap(([effect,group,name,desc,base])=>Array.from({length:4},(_,i)=>({
 id:`mine_${effect}_${i+1}`,effect,group,name:`${name} ${['I','II','III','IV'][i]}`,desc,base:base*1000*(1+i*.75),
 scale:1,max:1,min:0,stage:2,requires:i?`mine_${effect}_${i}`:undefined,
})));
export const UPGRADES=[...FOREST_UPGRADES.map(d=>({...d,stage:1})),...MINE_UPGRADES];
