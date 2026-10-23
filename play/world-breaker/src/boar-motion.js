// Four body parts plus dust, no external images. Timings also drive combat rules.
export const PHASES = {enter:.75,idle:.85,windup:.95,strike:.3,recovery:1.25,dying:.85,dead:1};
export class BoarBoss {
 constructor(hp=144){this.maxHp=this.hp=hp;this.phase='enter';this.elapsed=0;this.turn=0;this.hitstop=0;this.recoil=0;this.flash=0;this.shake=0;this.impacts=0;this.hitPlayer=false;this.evaded=false;this.damage=0;}
 get progress(){return Math.min(1,this.elapsed/PHASES[this.phase]);}
 get pattern(){return this.turn%2===0?'charge':'stomp';}
 get warning(){return this.phase==='windup';}
 get vulnerable(){return this.phase==='recovery';}
 get finished(){return this.phase==='dead';}
 attack(){
  if(this.hp<=0||this.hitstop>0||this.phase==='enter')return 0;
  const damage=this.vulnerable?24:this.phase==='windup'||this.phase==='strike'?4:12;
  this.hp=Math.max(0,this.hp-damage);this.hitstop=this.vulnerable ? .075 : .045;this.recoil=.18;this.flash=.12;this.shake=this.vulnerable ? .16 : .08;
  if(!this.hp){this.phase='dying';this.elapsed=0;this.hitstop=.11;this.shake=.24;}
  return damage;
 }
 tick(dt,dodging=false){
  this.hitPlayer=this.evaded=false;this.damage=0;
  dt=Math.max(0,Math.min(.1,dt));
  if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return 0;}
  for(const k of ['recoil','flash','shake'])this[k]=Math.max(0,this[k]-dt);
  if(this.finished)return dt;
  this.elapsed+=dt;
  if(this.elapsed+1e-9>=PHASES[this.phase]){
   const old=this.phase;this.elapsed=Math.max(0,this.elapsed-PHASES[old]);
   this.phase=({enter:'idle',idle:'windup',windup:'strike',strike:'recovery',recovery:'idle',dying:'dead'})[old];
   if(old==='recovery')this.turn++;
   if(this.phase==='strike'){this.impacts++;this.evaded=dodging;this.hitPlayer=!dodging;this.damage=this.pattern==='charge'?28:20;this.shake=.22;}
  }
  return dt;
 }
}

let atlas;
function makeAtlas(){
 if(atlas)return atlas;
 const parts={};
 const shape=(name,w,h,paint)=>{for(const bright of [false,true]){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const r=(x,y,a,b,color)=>{g.fillStyle=bright?'#fff1ca':color;g.fillRect(x,y,a,b);};paint(r);parts[name+(bright?'Hit':'')]=c;}};
 shape('body',90,58,r=>{r(8,10,73,40,'#543b3c');r(3,20,85,24,'#543b3c');r(12,5,60,39,'#875748');r(5,19,71,25,'#9f6b50');r(15,6,43,8,'#b88460');r(10,40,64,9,'#69433c');r(63,15,16,26,'#a57457');for(let i=0;i<6;i++){r(16+i*9,0,5,12,'#363a3e');r(17+i*9,0,2,7,'#747477');}r(12,22,5,11,'#b47e59');r(27,28,4,8,'#b47e59');});
 shape('head',49,55,r=>{r(9,15,30,30,'#553c3d');r(4,20,40,19,'#98644d');r(16,12,24,23,'#ae7754');r(5,2,8,19,'#704844');r(8,4,3,10,'#ce9976');r(30,1,9,18,'#704844');r(33,3,3,10,'#ce9976');r(1,29,19,13,'#bb8969');r(0,31,8,8,'#5a4140');r(3,32,2,3,'#272b31');r(18,22,8,6,'#352e34');r(18,23,5,3,'#ffc55f');r(14,38,7,12,'#e5c88c');r(10,46,8,4,'#f8e1ac');r(32,37,7,12,'#d9bb82');r(38,43,7,4,'#eed39c');});
 shape('leg',17,33,r=>{r(2,0,13,20,'#785041');r(4,4,10,18,'#a06b4d');r(3,18,11,8,'#533d3c');r(0,25,16,8,'#303740');r(2,26,4,3,'#6a6a64');});
 shape('tail',25,20,r=>{r(0,8,15,5,'#875748');r(13,4,9,5,'#875748');r(18,0,6,6,'#b88860');r(21,1,4,5,'#3d373e');});
 shape('dust',16,10,r=>{r(0,5,15,5,'#a69a72');r(3,1,9,6,'#b7a77d');r(9,0,4,5,'#d1b98c');});
 atlas=parts;return atlas;
}
export function boarPose(b,time){
 const p=b.progress,phase=b.phase,charge=b.pattern==='charge';
 let x=302,y=264,body=0,head=0,legs=Math.sin(time*3)*.04,fall=0;
 if(phase==='enter'){x=460-158*(1-(1-p)**3);legs=Math.sin(p*28)*.45;}
 if(phase==='idle'){y+=Math.sin(time*2.3)*1.3;head=Math.sin(time*1.7)*.03;}
 if(phase==='windup'){body=charge?-.1*p:.2*p;head=charge?.4*p:-.35*p;y+=charge?5*p:-12*p;x+=charge?10*p:0;legs=Math.sin(p*36)*.055;}
 if(phase==='strike'){x=charge?312-100*Math.sin(p*Math.PI/2):302;y+=charge?3:15*Math.sin(p*Math.PI/2);head=charge?.35:.15;body=charge?-.07:-.12;legs=Math.sin(p*30)*.6;}
 if(phase==='recovery'){x=charge?212+90*(1-(1-p)**2):302;head=.3*(1-p);y+=5*(1-p);legs=charge?Math.sin(p*18)*.15:0;}
 if(phase==='dying'||phase==='dead'){fall=phase==='dead'?1:p;x+=Math.sin(p*18)*(1-p)*4;y+=12*fall;head=.5*fall;}
 x+=b.recoil>0?Math.sin(b.recoil/.18*Math.PI)*7:0;
 return {x,y,body,head,legs,fall};
}
export function drawBoar(ctx,b,time){
 const a=makeAtlas(),pose=boarPose(b,time),hit=b.flash>0&&b.hp>0;
 const part=(name,x,y,angle=0)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(a[name+(hit?'Hit':'')],-a[name].width/2,0);ctx.restore();};
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#142a2c77';ctx.beginPath();ctx.ellipse(pose.x,307,78,16,0,0,Math.PI*2);ctx.fill();
 // Dust uses the same 16x10 tile with deterministic placement, no particle allocation.
 if(['enter','strike','recovery','dying'].includes(b.phase))for(let i=0;i<5;i++){ctx.globalAlpha=.22+(i%3)*.12;ctx.drawImage(a.dust,pose.x-65+i*28,301-Math.sin(time*9+i)*5,23,14);}
 ctx.globalAlpha=1;ctx.translate(pose.x,pose.y);ctx.scale(1.55,1.55);ctx.rotate(pose.fall*-1.25);
 part('leg',-24,-5,-pose.legs);part('leg',24,-5,pose.legs);
 ctx.save();ctx.rotate(pose.body);part('tail',46,-34,Math.sin(time*5)*.14);part('body',0,-47);part('head',-43,-50,pose.head);ctx.restore();
 part('leg',-31,-1,pose.legs);part('leg',20,-1,-pose.legs);
 ctx.restore();
 if(b.recoil>0){ctx.save();ctx.translate(pose.x-53,pose.y-30);ctx.strokeStyle=b.vulnerable?'#fff0a1':'#bde0dc';ctx.lineWidth=3;for(let i=0;i<7;i++){const angle=i*Math.PI*2/7,r=(.18-b.recoil)*180;ctx.beginPath();ctx.moveTo(Math.cos(angle)*r,Math.sin(angle)*r);ctx.lineTo(Math.cos(angle)*(r+8),Math.sin(angle)*(r+8));ctx.stroke();}ctx.restore();}
}
