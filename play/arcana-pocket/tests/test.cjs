const assert=require('node:assert/strict'),G=require('../engine.js');
let s=G.create(G.starter,G.decks[0],()=>.5);assert.equal(s.p[0].hand.length,5);assert.equal(s.p[0].mana,1);assert.equal(s.p[1].hand.length,4);
s.p[0].hand=['scout'];assert(G.play(s,0,0));let u=s.p[0].board[0];assert(!G.attack(s,0,u.uid,'hero'));G.end(s);G.end(s);assert(G.attack(s,0,u.uid,'hero'));assert.equal(s.p[1].hp,23);assert(!G.attack(s,0,u.uid,'hero'));
s=G.create(G.starter,G.starter);s.p[0].board=[{id:'wolf',hp:2,uid:1,ready:true}];s.p[1].board=[{id:'guard',hp:4,uid:2,ready:true}];assert(!G.attack(s,0,1,'hero'));assert(G.attack(s,0,1,2));assert.equal(s.p[0].board[0].hp,1);assert.equal(s.p[1].board[0].hp,1);
s.p[0].board=[{id:'captain',hp:3,uid:3},{id:'scout',hp:1,uid:4}];assert.equal(G.power(s.p[0],s.p[0].board[1]),3);assert.equal(G.power(s.p[0],s.p[0].board[0]),2);
s=G.create(G.starter,G.starter);s.p[0].mana=8;s.p[0].hand=['spark'];s.p[0].board=[{id:'mage',hp:3,uid:1}];assert(G.play(s,0,0,'hero'));assert.equal(s.p[1].hp,21);
let outcomes=[0,0,0],turns=0;for(let i=0;i<300;i++){let b=G.create(i%3===0?G.starter:G.decks[i%2],G.decks[(i+1)%2]);let n=0;while(b.winner===null&&n++<250)G.ai(b);assert.notEqual(b.winner,null);for(let p of b.p){assert(p.board.length<=5);assert(p.hand.length<=10);assert(p.mana>=0)}outcomes[b.winner]++;turns+=n}
console.log('Rules passed: summoning, readiness, guard, simultaneous damage, aura, spell synergy. 300 full games terminated.',{outcomes,meanTurns:turns/300});

const P=require('../progression.js');
for(const d of [G.starter,...G.decks]){assert.equal(d.length,20);for(const id of new Set(d))assert(d.filter(x=>x===id).length<=2)}
const old={v:1,owned:Object.fromEntries(G.cards.map(c=>[c.id,['scout','guard','wolf','medic','spark','study'].includes(c.id)?2:0])),deck:['scout','guard','wolf','medic','spark','study'].flatMap(id=>[id,id]),points:17,packs:2,wins:0,losses:1,battle:null};
P.migrate(old);assert.equal(old.deck.length,20);assert.equal(old.points,17);assert.equal(old.progress.firstDefeat,'pending');assert.equal(old.losses,1);const before=JSON.stringify(old);P.migrate(old);assert.equal(JSON.stringify(old),before);
assert(P.claim(old,'nova'));assert.equal(old.owned.nova,2);assert(!P.claim(old,'knight'));const plan=P.plan(old,'nova');assert.equal(plan.deck.length,20);assert.equal(plan.add.length,2);assert.equal(plan.remove.length,2);assert(P.apply(old,'nova'));assert.equal(old.deck.filter(x=>x==='nova').length,2);assert.equal(old.owned.study,2);
const state={wins:0,losses:0,packs:0,points:0,progress:{firstDefeat:'locked',defeats:0,lossMeter:0}};P.complete(state,1,true);assert.equal(state.progress.firstDefeat,'locked');assert.equal(state.progress.lossMeter,0);P.complete(state,1);assert.equal(state.progress.firstDefeat,'pending');P.complete(state,1);P.complete(state,1);assert.equal(state.packs,1);assert.equal(state.progress.lossMeter,0);assert.equal(state.points,20);
console.log('20-card rules, copy limits, v1 migration/idempotence, retroactive unlock, single claim, preview/apply, loss progress, concede exclusion passed');
