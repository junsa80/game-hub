// Original Canvas artwork. Painted plates live in visual/. Cosmetic randomness is a hash, never the game's RNG.
const PAINT={};
function paint(name){
 const img=PAINT[name]||(PAINT[name]=Object.assign(new Image(),{decoding:'async',src:'visual/'+name+'.jpg'}));
 return img.complete&&img.naturalWidth?img:null;
}
const artHash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export class FieldArt {
 constructor(){this.seen=new WeakSet();this.particles=[];this.falls=[];this.impacts=new Map();this.stage=0;this.elapsed=-1;}
 ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 stamp(c,name,r){const img=paint(name);if(!img)return false;c.save();c.beginPath();c.arc(0,-r*.05,r,0,Math.PI*2);c.clip();c.drawImage(img,-r*1.05,-r*1.15,r*2.1,r*2.1);c.restore();return true;}
 polygon(c,points,fill,stroke='#183d35',width=1.5){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 update(game,dt){
  if(this.game!==game||this.stage!==game.stage||game.roundElapsed<this.elapsed){this.particles=[];this.falls=[];this.impacts.clear();this.seen=new WeakSet();}
  this.game=game;this.stage=game.stage;this.elapsed=game.roundElapsed;
  for(const p of this.particles)p.age+=dt;
  this.particles=this.particles.filter(p=>p.age<p.life);
  for(const f of this.falls)f.age+=dt;this.falls=this.falls.filter(f=>f.age<.65);
  for(const [id,t] of this.impacts)if(game.time-t>.26)this.impacts.delete(id);
  for(const f of game.fx){if(this.seen.has(f))continue;this.seen.add(f);if(f.type!=='chop')continue;
   const id=f.cellId??Math.floor(f.y*11)*18+Math.floor(f.x*18);this.impacts.set(id,game.time-f.t);
   if(f.depleted&&game.stage===1&&this.falls.length<24){const cell=game.cells[id];this.falls.push({x:(cell.x+.42+.13*cell.bias)*50,y:(cell.y+.43+.17*cell.fertility)*50+9,seed:id,age:f.t});}
   // A bounded sample represents the harvest; it never credits resources.
   for(let i=0;i<5&&this.particles.length<160;i++){
    const seed=id*31+i*7+Math.floor(game.time*20),a=artHash(seed)*Math.PI*2;
    this.particles.push({x:f.x*900,y:f.y*550,age:f.t,life:i<2?.78:.38,collect:i<2,
     vx:Math.cos(a)*(18+artHash(seed+3)*30),vy:-25-artHash(seed+5)*40,turn:artHash(seed+9)*5,stage:game.stage});
   }
  }
 }
 ground(c,game,map){
  const x=map.x*50,y=map.y*50,w=map.width*50,h=map.height*50;
  const img=paint('ground-'+game.stage);
  if(img){c.drawImage(img,x,y,w,h);c.fillStyle='#07141c66';c.fillRect(x,y,w,h);}
  else{const palettes={1:['#587d48','#65894e','#3a603b'],2:['#343f58','#3c4863','#222d43'],3:['#405c4e','#496654','#293f3c'],4:['#46555c','#4d5d64','#303e49']},p=palettes[game.stage];
  c.fillStyle=p[0];c.fillRect(x,y,w,h);
  // Broken soil patches and blades avoid a checkerboard while preserving tile positions.
  for(const cell of game.cells){if(cell.x<map.x||cell.y<map.y||cell.x>=map.x+map.width||cell.y>=map.y+map.height)continue;
   const px=cell.x*50,py=cell.y*50,r=artHash(cell.id);
   this.ellipse(c,px+16+r*18,py+25,21,13,r>.5?p[1]:p[0]);
   for(let k=0;k<4;k++){const a=artHash(cell.id*13+k),bx=px+5+a*39,by=py+7+artHash(cell.id*7+k+21)*36;
    if(game.stage===4){c.strokeStyle='#68808944';c.lineWidth=1;c.strokeRect(px+5,py+5,39,39);break;}
    c.strokeStyle=p[2];c.lineWidth=1.3;c.beginPath();c.moveTo(bx-2,by);c.lineTo(bx-3,by-3);c.moveTo(bx,by);c.lineTo(bx+2,by-4);c.stroke();
   }
  }}
  c.lineWidth=6;c.strokeStyle=game.stage===1?'#3a603b':game.stage===2?'#222d43':game.stage===3?'#293f3c':'#303e49';c.strokeRect(x+3,y+3,w-6,h-6);
  c.strokeStyle=game.stage===1?'#a4bc70':'#8fa6a2';c.lineWidth=2;c.beginPath();c.moveTo(x+5,y+h-7);c.lineTo(x+5,y+5);c.lineTo(x+w-5,y+5);c.stroke();
  c.fillStyle='#142d3055';c.fillRect(x+5,y+h-8,w-10,5);
 }
 resource(c,game,x,y,size,mass,seed){
  const hit=this.impacts.get(seed),age=hit===undefined?1:game.time-hit;
  const kick=age<.25?Math.sin(age/.25*Math.PI)*Math.exp(-age*8):0;
  const growth=.67+Math.min(1,Math.log2(1+mass)/3)*.33;
  c.save();c.translate(x,y+size*.28);c.rotate(kick*.18*(seed%2?1:-1));c.scale(growth*(1+kick*.08),growth*(1-kick*.1));
  this.ellipse(c,1,1,size*.49,size*.17,'#142e3277');
  const sprite=['','tree','rock','shroom','scrap'][game.stage];
  if(!this.stamp(c,sprite,size*.62)){
  if(game.stage===1)this.tree(c,size,seed,mass);
  else if(game.stage===2)this.rock(c,size,seed,game.weakOpen());
  else if(game.stage===3)this.mushroom(c,size,seed,game.bloomActive());
  else this.scrap(c,size,seed);
  }
  if(kick>.15){c.globalAlpha=kick*.8;this.polygon(c,[[-8,-14],[0,-23],[8,-14],[0,-7]],'#fff5bc',null);c.globalAlpha=1;}
  if(mass>=10){const tier=Math.floor(Math.log10(mass));c.fillStyle='#142e38dd';c.beginPath();c.roundRect(-14,4,28,13,4);c.fill();c.fillStyle='#f7edc8';c.font='bold 9px system-ui';c.textAlign='center';c.fillText('×'+10**tier,0,14);}
  c.restore();
 }
 tree(c,s,seed,mass){
  const variant=seed%3,tier=Math.min(3,Math.floor(Math.log10(Math.max(1,mass))));
  const colors=[['#2b6245','#448952','#82b662'],['#377b86','#5aaba9','#a4d7c3'],['#695891','#9a7fc0','#d1b2d9'],['#9f733d','#c7a854','#f1d486']][tier];
  c.fillStyle='#513f30';c.fillRect(-4,-s*.57,8,s*.57);c.fillStyle='#a37d47';c.fillRect(-2,-s*.54,3,s*.54);
  this.polygon(c,[[-8,1],[-3,-5],[4,-4],[8,1]],'#765d3a',null);
  if(variant===0){
   for(let k=0;k<3;k++){const y=-s*(.23+k*.24),r=s*(.56-k*.11);
    this.polygon(c,[[-r,y],[0,y-s*.54],[r,y],[s*.14,y+3]],colors[0]);
    this.polygon(c,[[0,y-s*.48],[r*.79,y-2],[1,y-5]],colors[1],null);
    this.polygon(c,[[-r*.57,y-7],[0,y-s*.48],[-s*.08,y-8]],colors[2],null);
   }
  }else if(variant===1){
   const clusters=[[-.28,-.55,.31],[.27,-.58,.32],[0,-.86,.38],[0,-.5,.4]];
   for(const [x,y,r] of clusters){this.ellipse(c,s*x,s*y,s*r,s*r*.84,colors[0]);c.strokeStyle='#203f35';c.lineWidth=1.6;c.stroke();this.ellipse(c,s*(x-.06),s*(y-.08),s*r*.74,s*r*.55,colors[1]);this.ellipse(c,s*(x-.14),s*(y-.16),s*r*.32,s*r*.18,colors[2]);}
  }else{
   this.polygon(c,[[-s*.43,-s*.25],[-s*.53,-s*.66],[-s*.22,-s*1.04],[s*.13,-s*1.15],[s*.45,-s*.84],[s*.5,-s*.4],[s*.2,-s*.22]],colors[0]);
   this.polygon(c,[[-s*.4,-s*.67],[-s*.17,-s*.99],[s*.12,-s*1.08],[s*.35,-s*.8],[s*.18,-s*.43],[-s*.17,-s*.42]],colors[1],null);
   this.polygon(c,[[-s*.33,-s*.72],[-s*.14,-s*.95],[s*.05,-s*1.02],[0,-s*.78]],colors[2],null);
  }
 }
 rock(c,s,seed,weak){
  this.polygon(c,[[-s*.5,-2],[-s*.43,-s*.5],[-s*.1,-s*.8],[s*.34,-s*.63],[s*.52,-s*.21],[s*.34,3]],'#586a88','#253147',2);
  this.polygon(c,[[-s*.43,-s*.5],[-s*.1,-s*.8],[s*.1,-s*.29],[-s*.5,-2]],'#8b9cac',null);
  this.polygon(c,[[s*.1,-s*.29],[s*.34,-s*.63],[s*.52,-s*.21],[s*.34,3]],'#394c6d',null);
  for(let k=0;k<3;k++){const x=(k-1)*s*.19,y=-s*(.18+k%2*.12);this.polygon(c,[[x-4,y],[x-2,y-12],[x+3,y-17],[x+6,y-3]],weak?'#b7ffff':'#6fb7d2','#3d637c',1);}
 }
 mushroom(c,s,seed,bloom){
  c.fillStyle='#d9d5a3';c.fillRect(-4,-s*.53,8,s*.53);c.fillStyle='#96976f';c.fillRect(2,-s*.5,3,s*.5);
  const color=bloom?'#e587bc':'#9b81c4';
  this.polygon(c,[[-s*.55,-s*.35],[-s*.44,-s*.67],[-s*.15,-s*.94],[s*.12,-s*.97],[s*.45,-s*.7],[s*.57,-s*.35]],color,'#413d60',2);
  this.ellipse(c,0,-s*.35,s*.55,s*.13,'#605b85');
  for(let k=0;k<4;k++)this.ellipse(c,(k-1.5)*s*.2,-s*(.57+(k%2)*.15),3,2,'#e7edbb');
  this.ellipse(c,-s*.24,-s*.69,s*.12,2,'#d8afd7');
 }
 scrap(c,s,seed){
  this.polygon(c,[[-s*.46,-2],[-s*.46,-s*.53],[s*.2,-s*.7],[s*.48,-s*.46],[s*.48,0]],'#7f959f','#243943',2);
  this.polygon(c,[[-s*.46,-s*.53],[s*.2,-s*.7],[s*.48,-s*.46],[-s*.16,-s*.32]],'#bfd0cc',null);
  c.fillStyle='#d6a96a';c.fillRect(-5,-s*.52,9,s*.45);c.fillStyle='#243943';c.fillRect(8,-14,5,5);c.fillStyle='#8ddcd9';c.fillRect(9,-14,3,3);
 }
 effects(c,game,map){
  const tx=(map.x+map.width-.35)*50,ty=(map.y+.4)*50;
  for(const f of this.falls){c.save();c.translate(f.x,f.y);this.ellipse(c,0,0,5,3,'#dbc08a');c.strokeStyle='#927043';c.lineWidth=1;c.stroke();c.globalAlpha=Math.max(0,1-f.age/.65);c.rotate((f.seed%2?1:-1)*f.age*2);c.scale(.7,.7);this.tree(c,29,f.seed,1);c.restore();}
  for(const p of this.particles){const t=p.age/p.life,fly=p.collect?Math.max(0,(t-.32)/.68):0,ease=fly*fly;
   let x=p.x+p.vx*p.age,y=p.y+p.vy*p.age+70*p.age*p.age;
   x+=(tx-x)*ease;y+=(ty-y)*ease;
   c.save();c.translate(x,y);c.rotate(p.turn+p.age*5);c.globalAlpha=1-t**3;
   if(p.collect&&p.stage===1){c.fillStyle='#755234';c.strokeStyle='#332d29';c.lineWidth=1;c.fillRect(-7,-3,14,6);c.strokeRect(-7,-3,14,6);this.ellipse(c,6,0,2.5,3,'#e4bf79');this.ellipse(c,6,0,1,1.5,'#ad8051');}
   else{this.polygon(c,[[-3,-2],[2,-3],[4,1],[-1,3]],p.stage===1?'#e0c17f':p.stage===2?'#a1e4ef':p.stage===3?'#eac8e6':'#d3e0dd',null);}
   c.restore();
  }
  // Local collection basket keeps the flight destination inside the cropped field.
  c.save();c.translate(tx,ty);c.fillStyle='#283b33';c.fillRect(-10,-7,20,15);c.fillStyle='#b58b53';c.fillRect(-9,-5,18,11);c.strokeStyle='#604b34';c.lineWidth=2;c.strokeRect(-9,-5,18,11);c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(-3,-5);c.lineTo(-3,6);c.moveTo(4,-5);c.lineTo(4,6);c.stroke();c.restore();
 }
 boss(c,game,x,y){
  c.save();c.translate(x,y);const windup=game.hitClock>5.5,weak=game.hitClock<1.5;
  const shift=windup?Math.sin(game.time*24)*3:Math.sin(game.time*3)*2;c.translate(shift,0);
  this.ellipse(c,0,28,48,13,'#12202b88');
  if(windup){c.strokeStyle='#ff9b7b';c.lineWidth=3;c.beginPath();c.arc(0,0,57,-Math.PI/2,-Math.PI/2+(game.hitClock-5.5)/1.5*Math.PI*2);c.stroke();}
  if(this.stamp(c,'boss-'+game.stage,58)){c.restore();return;}
  if(game.stage===1){
   for(const side of [-1,1])this.polygon(c,[[side*20,7],[side*47,20],[side*51,5],[side*35,-21],[side*24,-13]],'#5c6e3f','#253c32',3);
   this.polygon(c,[[-27,28],[-31,-12],[-18,-43],[15,-45],[32,-15],[27,28]],'#7c6240','#293b31',3);
   for(let k=0;k<3;k++)this.polygon(c,[[-35+k*5,-17-k*14],[0,-58-k*8],[35-k*5,-17-k*14]],k===2?'#8ca65e':'#4b7749','#293e32',2);
  }else if(game.stage===2){
   for(const side of [-1,1])this.polygon(c,[[side*18,-24],[side*47,-16],[side*50,17],[side*27,22]],'#5b7691','#263346',3);
   this.polygon(c,[[-30,25],[-34,-17],[-9,-46],[24,-32],[34,4],[22,29]],'#778b9d','#263346',3);
   for(const side of [-1,1])this.polygon(c,[[side*9,-22],[side*18,-56],[side*28,-16]],'#9cdbdf','#3e687d',2);
  }else if(game.stage===3){
   for(const side of [-1,1]){c.strokeStyle='#789d65';c.lineWidth=8;c.beginPath();c.moveTo(side*12,10);c.quadraticCurveTo(side*60,-15,side*43,28);c.stroke();}
   this.ellipse(c,0,4,29,31,'#c5cd9b');this.polygon(c,[[-49,-10],[-35,-39],[0,-57],[35,-39],[49,-10]],'#a36fa3','#50394f',3);
   for(let k=0;k<5;k++)this.ellipse(c,(k-2)*16,-22-(k%2)*11,5,3,'#e6caab');
  }else{
   for(const side of [-1,1]){c.fillStyle='#546975';c.fillRect(side*35-12,-23,24,47);c.strokeStyle='#263b4c';c.lineWidth=3;c.strokeRect(side*35-12,-23,24,47);}
   this.polygon(c,[[-29,29],[-34,-25],[-18,-42],[18,-42],[34,-25],[29,29]],'#7c949b','#263b4c',3);
   c.fillStyle='#d5b174';c.fillRect(-23,-31,46,9);this.ellipse(c,0,5,13,13,'#274858');this.ellipse(c,0,5,8,8,weak?'#effbc1':'#7eddd5');
  }
  c.fillStyle=weak?'#fff7b6':'#ffce93';c.fillRect(-14,-10,9,6);c.fillRect(5,-10,9,6);c.fillStyle='#293c40';c.fillRect(-8,6,16,4);
  c.restore();
 }
}
