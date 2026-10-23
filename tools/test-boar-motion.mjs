import assert from 'node:assert/strict';
import {BoarBoss,boarPose,drawBoar} from '../play/world-breaker/src/boar-motion.js';
import {readFileSync} from 'node:fs';
const run=(b,n,dodge=false)=>{for(let i=0;i<n;i++)b.tick(.05,dodge);};
const b=new BoarBoss();
assert.equal(b.attack(),0,'entry cannot be interrupted by attack spam');
run(b,15);assert.equal(b.phase,'idle');assert.equal(b.attack(),12);
const elapsed=b.elapsed;b.tick(.02);assert.equal(b.elapsed,elapsed,'hitstop freezes phase progression');
while(b.phase!=='windup')b.tick(.05);
assert.equal(b.attack(),4,'windup armor discourages blind repeated attack');
while(b.phase!=='strike')b.tick(.05,true);
assert.equal(b.evaded,true);assert.equal(b.impacts,1);
let repeated=0;for(let i=0;i<5;i++){b.tick(.05);if(b.hitPlayer||b.evaded)repeated++;}assert.equal(repeated,0,'an attack hits only at its impact');
while(b.phase!=='recovery')b.tick(.05);
assert.equal(b.attack(),24,'recovery is a real counterattack opportunity');
while(b.phase!=='idle')b.tick(.05);assert.equal(b.pattern,'stomp');
while(b.phase!=='strike')b.tick(.05);
assert.equal(b.hitPlayer,true);assert.equal(b.damage,20);
const dying=new BoarBoss(12);run(dying,15);assert.equal(dying.attack(),12);
assert.equal(dying.phase,'dying');assert.equal(dying.finished,false);assert.equal(dying.attack(),0);
run(dying,30);assert.equal(dying.phase,'dead');assert.equal(dying.finished,true);
for(const phase of ['enter','idle','windup','strike','recovery','dying','dead']){
 const pose=boarPose(Object.assign(new BoarBoss(),{phase,elapsed:0.2}),2);
 assert.ok(Object.values(pose).every(Number.isFinite),phase+' has finite transforms');
}
// Atlas allocation is fixed: 5 tiles x normal/hit, reused on every draw.
let allocations=0;
const ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{})});
globalThis.document={createElement(){allocations++;return {getContext:()=>ctx};}};
for(let i=0;i<120;i++)drawBoar(ctx,b,i/60);
assert.equal(allocations,10,'no new canvases per animation frame');delete globalThis.document;
// The complete encounter grants its reward only after the death animation ends.
const src=readFileSync(new URL('../play/world-breaker/src/field-scene-preview.js',import.meta.url),'utf8').replace('./boar-motion.js',new URL('../play/world-breaker/src/boar-motion.js',import.meta.url).href);
const {FieldScene}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const s=new FieldScene();s.select(0);s.start();
for(let i=0;i<1600&&s.mode==='battle';i++){
 if(s.battle.boss.warning&&s.battle.boss.progress>.7)s.dodge();
 if(s.battle.boss.vulnerable)s.attack();
 s.tick(.05);
}
assert.equal(s.mode,'victory');assert.equal(s.stock.essence,18);
for(let i=0;i<40;i++)s.tick(.05);assert.equal(s.stock.essence,18);
s.leave();assert.equal(s.mode,'field');
console.log('BOAR MOTION PASS: phases, armor/counterattack, hitstop, one impact, alternating patterns, dodge, death, atlas reuse, reward once');
