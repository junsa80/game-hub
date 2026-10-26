const {chromium}=require(process.env.PW||'playwright-core');const URL_=process.argv[2]||'http://localhost:8960/game-hub/play/rose-spire/';
(async()=>{const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const open=async()=>{const p=await c.newPage();p.on('dialog',d=>d.accept());await p.goto(URL_);await p.waitForTimeout(1500);return p};
const click=async(p,t)=>{await p.evaluate(t=>{const el=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.includes(t));if(!el)throw Error('no '+t);el.click()},t);await p.waitForTimeout(700)};
const meta=p=>p.evaluate(()=>{const m=JSON.parse(localStorage.getItem('rose-spire.meta.v2'));return {runs:m.runs,best:m.best,cards:m.progress.cards.length,relics:m.progress.relics.length,run:!!localStorage.getItem('rose-spire.run.v2')}});
const A=await open(),B=await open();
for(const t of ['새 원정 시작','함께 출발','전투','베기','베기','베기','턴 종료'])await click(B,t);
for(let i=0;i<60;i++){const has=await B.evaluate(()=>!![...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.includes('턴 종료')));if(!has)break;await click(B,'턴 종료')}
 const afterB=await meta(B);await B.close({runBeforeUnload:true});await new Promise(r=>setTimeout(r,500));
await A.close({runBeforeUnload:true});await new Promise(r=>setTimeout(r,500)); // 오래된 탭 닫힘(pagehide 저장)
const C0=await open();const afterAclose=await meta(C0);await C0.close();
const C=await open();const reopened=await meta(C);
console.log(JSON.stringify({afterB,afterStaleTabClosed:afterAclose,reopened}));console.log(reopened.runs<afterB.runs||reopened.cards<afterB.cards?'LOST (meta progress overwritten)':'KEPT');await b.close()})();
