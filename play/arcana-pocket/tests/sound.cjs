const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const events={},audio=[],storage=new Map();
class Audio{constructor(src){this.src=src;this.paused=true;this.plays=0;audio.push(this)}play(){this.paused=false;this.plays++;return Promise.resolve()}pause(){this.paused=true}addEventListener(){}}
const c={Audio,Date,Set,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{hidden:false,addEventListener:(n,f)=>events[n]=f},addEventListener:(n,f)=>events[n]=f};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../sound.js'),'utf8'),c);
assert.equal(audio.length,0,'no autoplay on load');
c.ArcanaSound.music();c.ArcanaSound.sfx('hit');
c.document.hidden=true;assert.equal(typeof events.visibilitychange,'function','hidden lifecycle handler exists');events.visibilitychange();
assert.ok(audio.every(a=>a.paused),'all voices pause in background');
const n=audio.length;c.ArcanaSound.music();c.ArcanaSound.sfx('spell');assert.equal(audio.length,n,'hidden AI events cannot start sounds');
c.document.hidden=false;events.visibilitychange();assert.equal(audio[0].paused,false);assert.equal(audio[1].paused,true,'one-shot effects never resume');
events.pagehide();assert.ok(audio.every(a=>a.paused));events.pageshow();assert.equal(audio[0].paused,false);
c.ArcanaSound.toggle();assert.ok(audio.every(a=>a.paused));events.visibilitychange();assert.equal(audio[0].paused,true);assert.equal(storage.get('arcana-sfx'),'off');assert.equal(storage.size,1,'game save never touched');
console.log('PASS no autoplay, hidden pause, hidden AI silence, foreground music-only resume, page lifecycle, mute persistence and game-save isolation');
