import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../play/world-breaker/src/field-scene-preview.js',import.meta.url),'utf8');
const resolved=src.replace('./boar-motion.js',new URL('../play/world-breaker/src/boar-motion.js',import.meta.url).href);
const {FieldScene}=await import('data:text/javascript;base64,'+Buffer.from(resolved).toString('base64'));
const advance=(s,n)=>{for(let i=0;i<n;i++)s.tick(.1);};
const s=new FieldScene();advance(s,2400);
for(const k of ['wood','ore','herb'])assert.ok(s.stock[k]>0,k+' deposited at camp');
const stock=JSON.stringify(s.stock),positions=JSON.stringify(s.workers),time=s.time;
assert.equal(s.select(1),true);advance(s,50);
assert.equal(JSON.stringify(s.stock),stock);assert.equal(JSON.stringify(s.workers),positions);assert.equal(s.time,time);
s.cancel();assert.equal(s.mode,'field');assert.equal(s.selected,null);
assert.equal(s.select(1),true);assert.equal(s.start(),true);assert.equal(s.attack(),true);assert.equal(s.attack(),false);
advance(s,6);for(let i=0;i<4;i++){s.attack();advance(s,6);}
assert.equal(s.mode,'victory');assert.equal(s.stock.essence,11);s.attack();assert.equal(s.stock.essence,11);
s.leave();assert.equal(s.mode,'field');assert.ok(s.monsters[1].respawn>0);assert.equal(s.select(1),false);advance(s,200);assert.equal(s.select(1),true);
const lose=new FieldScene();lose.select(2);lose.start();advance(lose,150);assert.equal(lose.mode,'defeat');lose.leave();assert.equal(lose.mode,'field');
const evade=new FieldScene();evade.select(1);evade.start();advance(evade,23);assert.equal(evade.dodge(),true);assert.equal(evade.dodge(),false);advance(evade,4);assert.equal(evade.battle.hp,100);
console.log('FIELD PREVIEW PASS: gathering, pause/cancel, cooldown, victory, reward once, respawn, defeat return, dodge');
