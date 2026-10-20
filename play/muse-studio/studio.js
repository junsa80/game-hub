'use strict';
(function(root){
const groups=[
 {name:'새로운 만남',detail:'최고 스테이지',icon:'◇',values:[10,50,100,300],value:g=>g.s.archiveBest+1},
 {name:'셔터의 기억',detail:'직접 촬영',icon:'◎',values:[100,500,2500,10000],value:g=>g.s.studio.shots},
 {name:'설레는 순간',detail:'치명타 촬영',icon:'♥',values:[25,100,500,2000],value:g=>g.s.studio.crits},
 {name:'마음의 거리',detail:'누적 호감도',icon:'♡',values:[5,60,300,1000],value:g=>(g.s.relationships?.bonds||[]).reduce((a,b)=>a+b,0)},
 {name:'특별한 화보집',detail:'스페셜 화보',icon:'✧',values:[1,5,15,30],value:g=>g.s.relationships?.unlocks.length||0},
 {name:'다시 피어나다',detail:'전생',icon:'∞',values:[1,2,4,10],value:g=>g.s.rebirths}
];
const milestones=groups.flatMap((g,group)=>g.values.map((target,tier)=>({id:group*4+tier,name:g.name+' '+['I','II','III','IV'][tier],detail:g.detail,icon:g.icon,target,value:g.value})));
function status(game){return milestones.map(m=>({...m,current:m.value(game),ready:m.value(game)>=m.target,claimed:game.s.studio.claimed.includes(m.id)}));}
function claim(game){const ready=status(game).filter(m=>m.ready&&!m.claimed);if(!game.s.relationships)return 0;game.s.studio.claimed.push(...ready.map(m=>m.id));game.s.relationships.fragments=Math.min(1e6,game.s.relationships.fragments+ready.length);return ready.length;}
function collection(game,worlds,bonuses){const muses=worlds.flatMap((w,world)=>w.muses.map(m=>({m,world}))),size=muses.length,out=[];for(const kind of ['normal','elite'])muses.forEach(({m,world},i)=>{if(i+(kind==='elite'?size:0)<=game.s.archiveBest)out.push({...m[kind],key:kind+':'+i,kind,world});});for(const id of game.s.relationships?.unlocks||[]){const b=bonuses.find(x=>x.id===id);if(b)out.push({...b,key:'bonus:'+id,kind:'bonus'});}return out;}
function recommend(game,E){const measure=g=>{const e=g.effects(),st=g.stageStats();return {auto:g.rate(),tap:g.damage(e.tap*(1+e.critChance*(e.critMult-1)))/st.hp*st.reward*e.reward};},before=measure(game),candidates=[];const copy=new E.Game(E.load(game.s));for(const kind of ['global','personal'])for(const u of game.catalog(kind)){if(!game.unlocked(kind,u)||game.levelArray(kind)[u.id]>=2000)continue;const cost=game.cost(kind,u.id),levels=copy.levelArray(kind,true);levels[u.id]++;const after=measure(copy);levels[u.id]--;const auto=Math.max(0,after.auto-before.auto),tap=Math.max(0,after.tap-before.tap),gain=auto+tap*.25,score=gain/cost;if(Number.isFinite(score)&&score>0)candidates.push({kind,id:u.id,name:u.name,cost,auto,tap,score,affordable:cost<=game.s.money});}const affordable=candidates.filter(x=>x.affordable);return (affordable.length?affordable:candidates).sort((a,b)=>b.score-a.score)[0]||null;}
function parseBackup(text,E){if(text.length>2000000)throw Error('백업 파일이 너무 큽니다.');const file=JSON.parse(text),raw=file.format==='muse-studio-backup'?file.state:file;if(!raw||raw.version!==2||!Array.isArray(raw.global)||!Array.isArray(raw.research)||!Number.isFinite(raw.stage)||!Number.isFinite(raw.money))throw Error('뮤즈 스튜디오 백업 파일을 선택해주세요.');return E.load(raw);}
const api={milestones,status,claim,collection,recommend,parseBackup};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MuseStudio=api;
})(typeof window!=='undefined'?window:globalThis);
