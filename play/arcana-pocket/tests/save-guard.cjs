// [GrokBot] AP-01 save guard regression: damaged-but-recoverable saves must boot, unrecoverable ones must keep the raw save verbatim.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');const G=require('../engine.js');
function boot(raw=null){let stored=raw,els=new Map();const el=s=>{if(!els.has(s))els.set(s,{innerHTML:'',textContent:'',style:{},classList:{toggle(){}},close(){},showModal(){}});return els.get(s)};
 const c={document:{querySelector:el,querySelectorAll:()=>[],body:{classList:{toggle(){}}}},localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v},setTimeout:()=>0,clearTimeout(){},scrollTo(){}};c.window=c;vm.createContext(c);
 for(const f of['engine.js','progression.js','art.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
 return{run:x=>vm.runInContext(x,c),el,stored:()=>stored}}
const base=()=>({v:1,rulesVersion:2,owned:Object.fromEntries(G.cards.map(c=>[c.id,G.starter.includes(c.id)?2:0])),deck:[...G.starter],points:3,packs:1,wins:1,losses:0,progress:{firstDefeat:'locked',defeats:0,lossMeter:0},lastOpponent:0,battle:G.create(G.starter,G.decks[0])});
const mk=f=>{const s=base();f(s);return JSON.stringify(s)};
let n=0;const ok=(name,fn)=>{fn();n++};
// 1. missing / non-array log used to throw in battleView on every boot (blank screen)
for(const raw of[mk(s=>{delete s.battle.log}),mk(s=>{s.battle.log='x'})])ok('log',()=>{const x=boot(raw);assert.equal(x.run('storageOK'),true);assert.match(x.el('#app').innerHTML,/나의 손패/);assert.equal(x.run('Array.isArray(S.battle.log)'),true);assert.equal(x.run('S.points'),3);assert.equal(x.run('S.wins'),1)});
// 2. duplicate / missing unit uids are reassigned so attacks hit the intended unit
ok('uid',()=>{const x=boot(mk(s=>{s.battle.p[0].board.push({id:'scout',hp:2,uid:1,ready:true},{id:'wolf',hp:2,uid:1,ready:true},{id:'guard',hp:4,ready:false});delete s.battle.uid}));const u=x.run('S.battle.p[0].board.map(u=>u.uid)');assert.equal(new Set(u).size,3);assert.ok(u.every(Number.isInteger));assert.ok(x.run('S.battle.uid')>=Math.max(...u))});
// 3. missing mana/max/round repaired, the battle stays playable through a full AI turn
ok('mana',()=>{const x=boot(mk(s=>{delete s.battle.p[0].max;delete s.battle.p[0].mana;delete s.battle.round}));assert.equal(x.run('S.battle.p[0].max'),1);assert.equal(x.run('S.battle.p[0].mana'),1);x.run('G.end(S.battle);G.ai(S.battle)');assert.equal(x.run('S.battle.turn'),0)});
// 4. unit without finite hp cannot be guessed: raw save is preserved verbatim (recovery mode), nothing overwritten
ok('hp',()=>{const raw=mk(s=>{s.battle.p[0].board.push({id:'scout',uid:50,ready:true})});const x=boot(raw);assert.equal(x.run('storageOK'),false);assert.match(x.el('#app').innerHTML,/원본은 보존/);x.run('save()');assert.equal(x.stored(),raw)});
// 5. bad progress / newReward normalised; home render no longer throws on unknown reward id
ok('progress',()=>{const x=boot(mk(s=>{s.battle=null;s.losses=2;s.progress={firstDefeat:'weird',lossMeter:'a'};s.newReward='zzz'}));assert.equal(x.run('S.progress.firstDefeat'),'pending');assert.equal(x.run('S.progress.lossMeter'),0);assert.equal(x.run('S.progress.defeats'),0);assert.equal(x.run('S.newReward'),null);assert.match(x.el('#app').innerHTML,/오늘의 상대/)});
ok('progressType',()=>{const x=boot(mk(s=>{s.battle=null;s.progress='x'}));assert.equal(x.run('S.progress.firstDefeat'),'locked')});
// 6. healthy current save and a legacy Alpha0.1 (12-card, no progress) save round-trip unchanged except documented migration
ok('healthy',()=>{const raw=mk(()=>{});const x=boot(raw);assert.equal(JSON.stringify(x.run('S.battle')),JSON.stringify(JSON.parse(raw).battle))});
ok('legacy',()=>{const ids=['scout','guard','wolf','medic','spark','study'];const old={v:1,owned:Object.fromEntries(G.cards.map(c=>[c.id,ids.includes(c.id)?2:0])),deck:ids.flatMap(i=>[i,i]),points:17,packs:2,wins:2,losses:1,battle:G.create(G.starter,G.decks[1])};const x=boot(JSON.stringify(old));assert.equal(x.run('S.deck.length'),20);assert.equal(x.run('S.progress.firstDefeat'),'pending');assert.equal(JSON.stringify(x.run('S.battle')),JSON.stringify(old.battle))});
// 7. imported backup goes through the same guard
ok('import',()=>{const x=boot(mk(()=>{}));const bad=mk(s=>{delete s.battle.log});const v=x.run(`validate(JSON.parse(${JSON.stringify(bad)}))`);assert.ok(Array.isArray(v.battle.log))});
console.log(`Save guard passed (${n} checks): missing/invalid log, uid repair, mana/round repair, unrecoverable hp → raw preserved, progress/newReward normalisation, healthy + legacy save unchanged, import path.`);
