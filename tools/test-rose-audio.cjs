const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(process.argv[2]||'play/rose-spire/game.js','utf8'),block=source.slice(source.indexOf('function tone('),source.indexOf('function setupProgress('));
const listeners={},clips=[];let rejectPlay=false,contexts=0;
class Clip{constructor(){this.handlers={};this.paused=false;clips.push(this)}addEventListener(k,f){this.handlers[k]=f}play(){if(rejectPlay)return new Promise((_,reject)=>{this.reject=reject});return Promise.resolve()}pause(){this.paused=true}}
class AC{constructor(){contexts++;this.currentTime=0;this.destination={};this.state='running'}resume(){this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}createGain(){return {connect(){},disconnect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}}}createOscillator(){return {frequency:{},connect(){},disconnect(){},start(){},stop(){}}}}
const doc={hidden:false,addEventListener(k,f){listeners[k]=f}},win={AudioContext:AC,addEventListener(k,f){listeners[k]=f}};
const ctx=vm.createContext({document:doc,window:win,Audio:Clip,console});vm.runInContext('let sound=true,audio=null;'+block,ctx);
const flush=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 rejectPlay=true;vm.runInContext('tone()',ctx);doc.hidden=true;listeners.visibilitychange?.();clips[0].reject(Error('delayed decode failure'));await flush();assert.equal(contexts,0,'hidden delayed failure must not start fallback audio');
 doc.hidden=false;rejectPlay=false;vm.runInContext('tone()',ctx);const current=clips.at(-1);doc.hidden=true;listeners.visibilitychange?.();assert.equal(current.paused,true,'hide stops playing sample');doc.hidden=false;
 vm.runInContext('tone()',ctx);listeners.pagehide?.();assert.equal(clips.at(-1).paused,true,'pagehide stops sample');const count=clips.length;vm.runInContext('tone()',ctx);assert.equal(clips.length,count,'pagehide blocks new audio');listeners.pageshow?.();
 rejectPlay=true;vm.runInContext('tone()',ctx);clips.at(-1).reject(Error('decode failure'));await flush();assert.equal(contexts,1,'visible sample failure uses fallback');doc.hidden=true;listeners.visibilitychange?.();assert.equal(vm.runInContext('audio.state',ctx),'suspended');doc.hidden=false;
 vm.runInContext('sound=false;stopSound()',ctx);const before=clips.length;vm.runInContext('tone()',ctx);assert.equal(clips.length,before);
 rejectPlay=false;vm.runInContext('sound=true;tone()',ctx);const ended=clips.at(-1);ended.handlers.ended?.();vm.runInContext('stopSound()',ctx);assert.equal(ended.paused,false,'ended sample removed from tracking');
 assert.ok(source.includes('sound=!sound;if(!sound)stopSound();'),'mute action stops in-flight audio');
 console.log('PASS delayed failure hidden guard, visibility/pagehide stop, pageshow/new-action resume, mute stop, visible fallback, ended cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});
