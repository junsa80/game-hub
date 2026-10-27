// Sampled effects in sfx/. The procedural tones stay as a fallback if a file will not play.
export class GameAudio {
 constructor(){this.enabled=true;this.context=null;this.master=null;this.lastHit=-1;this.note=0;this.beat=0;this.musicTime=0;}
 async unlock(){
  if(!this.enabled)return false;
  try{const AudioClass=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AudioClass)return false;
   if(!this.context){this.context=new AudioClass();this.master=this.context.createGain();this.master.gain.value=.16;this.master.connect(this.context.destination);}
   if(this.context.state==='suspended')await this.context.resume();return this.context.state==='running';
  }catch{return false;}
 }
 tone(frequency,duration=.1,type='sine',volume=.3,delay=0){
  if(!this.enabled||!this.context||this.context.state!=='running')return;
  const now=this.context.currentTime+delay,osc=this.context.createOscillator(),gain=this.context.createGain();
  osc.type=type;osc.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
  osc.connect(gain);gain.connect(this.master);osc.start(now);osc.stop(now+duration+.02);
 }
 noise(duration,frequency,volume){
  if(!this.enabled||!this.context||this.context.state!=='running'||!this.context.createBuffer)return;
  const ctx=this.context,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*(1-i/samples.length);
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),now=ctx.currentTime;
  source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.8;
  gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
  source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start(now);source.stop(now+duration+.02);
 }
 effect(kind){
  if(!this.enabled)return;
  const file={upgrade:'upgrade',clear:'clear',fail:'fail',kill:'kill',fall:'fall',mine:'mine',city:'city',overload:'overload',swamp:'swamp',attack:'attack',enemy:'enemy',purify:'purify',skill:'skill'}[kind]||'hit';
  try{const a=new Audio('sfx/'+file+'.wav');a.volume=(file==='hit'||file==='mine'||file==='city'||file==='swamp')?.32:.55;const p=a.play();if(p&&p.catch)p.catch(()=>this.beep(kind));}
  catch(e){this.beep(kind);}
 }
 beep(kind){
  if(kind==='upgrade'){this.tone(523,.1,'triangle');this.tone(784,.18,'triangle',.4,.08);}
  else if(kind==='clear'){[523,659,784,1047].forEach((n,i)=>this.tone(n,.3,'triangle',.4,i*.1));}
  else if(kind==='fail'){this.tone(220,.2,'sine');this.tone(147,.3,'sine',.4,.15);}
  else if(kind==='kill'){this.tone(330,.08,'square',.12);this.tone(660,.15,'triangle',.2,.05);}
  else if(kind==='fall'){this.tone(78,.18,'triangle',.4);this.noise(.16,520,.45);}
  else if(kind==='mine'){this.tone(195,.09,'triangle',.65);this.tone(1180,.13,'sine',.3,.005);this.tone(2340,.07,'sine',.15,.018);this.noise(.07,3600,.6);}
  else if(kind==='city'){this.tone(145,.075,'sawtooth',.38);this.tone(960,.08,'triangle',.24,.012);this.noise(.06,4400,.55);}
  else if(kind==='overload'){this.tone(65,.25,'sawtooth',.4);this.noise(.25,1800,.6);this.tone(1280,.14,'sine',.2,.04);}
  else if(kind==='swamp'){this.tone(120,.12,'triangle',.5);this.tone(340,.06,'sine',.2,.025);this.noise(.1,700,.45);}
  else if(kind==='attack'){this.noise(.12,2300,.55);this.tone(120,.08,'sawtooth',.25);this.tone(460,.045,'triangle',.3,.02);}
  else if(kind==='enemy'){this.tone(85,.18,'sawtooth',.2);this.noise(.13,380,.35);}
  else if(kind==='purify'){[440,660,880].forEach((n,i)=>this.tone(n,.22,'sine',.25,i*.05));}
  else if(kind==='skill'){this.noise(.22,1800,.6);this.tone(110,.2,'triangle',.55);this.tone(740,.25,'sine',.2,.08);}
  else {this.tone(105,.1,'triangle',.65);this.tone(230,.045,'square',.18,.008);this.noise(.075,1350,.55);}
 }
 tick(dt,game){} // The independent GameScore handles BGM.
 toggle(){this.enabled=!this.enabled;if(!this.enabled&&this.master)this.master.gain.value=0;if(this.enabled&&this.master)this.master.gain.value=.16;return this.enabled;}
}
