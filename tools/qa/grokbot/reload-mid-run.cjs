const {chromium}=require(process.env.PW||'playwright-core');
const G={
 rose:{url:'http://localhost:8960/game-hub/play/rose-spire/',key:'rose-spire.run.v2',steps:['새 원정 시작','함께 출발','전투','베기','베기'],pick:s=>({hp:s.hp,floor:s.floor,turn:s.combat?.turn,enemyHp:s.combat?.enemies?.map(e=>e.hp),hand:s.combat?.hand?.length,energy:s.combat?.energy})},
 muse:{url:'http://localhost:8960/game-hub/play/muse-studio/',key:'muse-studio-v2',clicks:'#shoot',n:40,pick:s=>({lifetime:Math.round(s.lifetime),kills:s.totalKills,stage:s.stage,best:s.best})},
 wb:{url:'http://localhost:8960/game-hub/play/world-breaker/',key:'world-breaker-forest-alpha-v1',wait:8000,pick:s=>({harvested:Math.round(s.harvested*10)/10,round:s.round,stage:s.stage,time:Math.round(s.time)})},
};
(async()=>{const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [name,g] of Object.entries(G)){for(const [w,h] of [[360,800],[390,844],[412,915]]){const c=await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto(g.url);await p.waitForTimeout(1800);await p.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));
 for(const t of g.steps||[]){await p.evaluate(t=>{const el=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.includes(t));if(!el)throw Error('no '+t);el.click()},t);await p.waitForTimeout(700)}
 if(g.clicks)await p.evaluate(([s,n])=>{for(let i=0;i<n;i++)document.querySelector(s).click()},[g.clicks,g.n]);if(g.wait)await p.waitForTimeout(g.wait);
 await p.evaluate(()=>{window.dispatchEvent(new Event('pagehide'))});await p.waitForTimeout(200);
 const before=g.pick(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),g.key));
 await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await p.waitForTimeout(200);
 const after=g.pick(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),g.key));
 console.log(name,w,JSON.stringify({before,after,errs:errs.slice(0,2)}));await c.close();}}
await b.close()})();
