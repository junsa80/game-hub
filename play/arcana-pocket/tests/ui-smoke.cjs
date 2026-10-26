const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
function boot(raw=null){let stored=raw,els=new Map();const el=s=>{if(!els.has(s))els.set(s,{innerHTML:'',textContent:'',style:{},classList:{toggle(){}},close(){},showModal(){}});return els.get(s)};let c={document:{querySelector:el,querySelectorAll:()=>[],body:{classList:{toggle(){}}}},localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v},setTimeout:()=>0,clearTimeout(){},scrollTo(){}};c.window=c;vm.createContext(c);for(const f of ['engine.js','progression.js','art.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return {run:x=>vm.runInContext(x,c),el,stored:()=>stored};}
let x=boot('{broken');assert.equal(x.stored(),'{broken');assert.equal(x.run('storageOK'),false);assert.match(x.el('#app').innerHTML,/원본은 보존/);x.run('save()');assert.equal(x.stored(),'{broken');
x=boot();x.run('S.deck.pop();render()');assert.match(x.el('#app').innerHTML,/19\/20장/);assert.match(x.el('#app').innerHTML,/덱 완성하기/);
x=boot();x.run("S.lastOpponent=1;S.losses=1;render()");assert.match(x.el('#app').innerHTML,/별빛 연구회 재도전/);
x.run("S.battle=G.create(S.deck,G.decks[1]);S.battle.p[0].hand=['scout'];S.battle.p[0].mana=1;handDetail(0)");assert.match(x.el('#modalContent').innerHTML,/사용 · 1 자원/);x.el('#useCard').onclick();assert.equal(x.run('S.battle.p[0].board[0].id'),'scout');assert.equal(x.run('S.battle.p[0].mana'),0);assert.match(x.el('#app').innerHTML,/나의 손패/);
x.run('S.battle.winner=0;finish()');assert.equal(x.run('S.packs'),2);assert.match(x.el('#modalContent').innerHTML,/획득 팩 열기/);assert.match(x.el('#modalContent').innerHTML,/별빛 연구회 재도전/);
x.run("S.progress.firstDefeat='pending';S.owned.nova=2;S.deck.splice(0,2,'nova','nova');P.claim(S,'nova');previewPlan('nova')");assert.match(x.el('#modalContent').innerHTML,/이미 덱에 편성/);assert.match(x.el('#modalContent').innerHTML,/재도전/);
const y=boot(x.stored());assert.equal(y.run('S.wins'),1);assert.equal(y.run('S.packs'),2);
const G=require('../engine.js');const old={v:1,owned:Object.fromEntries(G.cards.map(c=>[c.id,['scout','guard','wolf','medic','spark','study'].includes(c.id)?2:0])),deck:['scout','guard','wolf','medic','spark','study'].flatMap(id=>[id,id]),points:17,packs:2,wins:2,losses:1,battle:G.create(G.starter,G.decks[1])};let z=boot(JSON.stringify(old));assert.equal(z.run('S.deck.length'),20);assert.equal(z.run('S.points'),17);assert.equal(JSON.stringify(z.run('S.battle')),JSON.stringify(old.battle));
console.log('UI/save regression checks passed: corrupt-save preservation, incomplete deck guidance, retry, deliberate card use, victory pack CTA, already-decked reward retry, reload, legacy migration.');

// Structurally valid JSON can still be unsafe to resume or import.
const baseline=JSON.parse(boot().stored());baseline.battle=G.create(G.starter,G.decks[0],()=>0.5);
const corruptions=[
 ['missing log',s=>delete s.battle.log],
 ['invalid mana',s=>s.battle.p[0].mana='1'],
 ['missing fatigue',s=>delete s.battle.p[0].fatigue],
 ['missing winner',s=>delete s.battle.winner],
 ['missing round',s=>delete s.battle.round],
 ['invalid uid',s=>s.battle.uid=-1],
 ['oversized board',s=>s.battle.p[0].board=Array.from({length:6},(_,i)=>({id:'scout',uid:i+1,hp:1,ready:true}))],
 ['spell on board',s=>{s.battle.uid=1;s.battle.p[0].board=[{id:'spark',uid:1,hp:1,ready:true}]}],
 ['duplicate uid',s=>{s.battle.uid=1;s.battle.p.forEach(p=>p.board=[{id:'scout',uid:1,hp:1,ready:true}])}],
 ['prototype card',s=>s.battle.p[0].hand=['toString']],
 ['invalid growth',s=>s.progress.lossMeter='2'],
 ['invalid reward',s=>s.newReward='missing'],
 ['invalid readiness',s=>{s.battle.uid=1;s.battle.p[0].board=[{id:'scout',uid:1,hp:1,ready:'yes'}]}],
 ['non-string log',s=>s.battle.log=[{}]],
];
for(const [name,mutate] of corruptions){
 const data=structuredClone(baseline);mutate(data);const raw=JSON.stringify(data);
 const recovered=boot(raw);assert.equal(recovered.stored(),raw,name+' preserves original');
 assert.equal(recovered.run('storageOK'),false,name+' recovery mode');
 assert.match(recovered.el('#app').innerHTML,/원본은 보존/,name);
 recovered.run('save()');assert.equal(recovered.stored(),raw,name+' prevents overwrite');
 const normal=boot(),before=normal.stored();
 assert.throws(()=>normal.run('validate('+raw+')'),name+' import rejected');
 assert.equal(normal.stored(),before,name+' import leaves current save intact');
}
let states=0,seed=26026;
const seeded=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(let match=0;match<20;match++){
 const data=structuredClone(baseline);data.battle=G.create(G.starter,G.decks[match%2],seeded);
 while(data.battle.winner===null&&data.battle.round<250){
  const raw=JSON.stringify(data),restored=boot(raw);
  assert.equal(restored.run('storageOK'),true);
  assert.equal(JSON.stringify(restored.run('S.battle')),JSON.stringify(data.battle));
  states++;G.ai(data.battle);
 }
}
const logSave=structuredClone(baseline);logSave.battle.log=['<img src=x onerror=alert(1)> & test'];
const safeLog=boot(JSON.stringify(logSave)).el('#app').innerHTML;
assert.ok(!safeLog.includes('<img src=x'));assert.ok(safeLog.includes('&lt;img'));
console.log('Structured-save recovery: '+corruptions.length+' corruptions rejected; '+states+' engine-generated active states preserved; imported log escaped.');
