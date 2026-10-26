// [GrokBot] world-breaker 두 탭 덮어쓰기 확인 (헤드리스 Chrome 에뮬레이션, 실기기 아님). 허브 play 사본을 읽기만 함.
// 시나리오: 탭 A를 먼저 열어 둠 → 탭 B를 열어 강화 1개 구매(B가 즉시 저장) → B를 닫고 A로 돌아가 A가 숨김/닫힘으로 저장 → 다시 열었을 때 B의 구매가 남는지.
// 사용: PW=<playwright-core> node tools/qa/grokbot/world-breaker-multitab.cjs [URL]
const {chromium}=require(process.env.PW||'playwright-core');const URL_=process.argv[2]||'http://localhost:8960/game-hub/play/world-breaker/',KEY='world-breaker-forest-alpha-v1';
(async()=>{const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const open=async()=>{const p=await c.newPage();p.on('dialog',d=>d.accept());await p.goto(URL_);await p.waitForTimeout(1500);return p};
const saved=(p,k=KEY)=>p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k)||'null');return s&&{upgrades:s.upgrades,wood:Math.round(s.wood),time:Math.round(s.time)}},k);
const A=await open();
const B=await open();await B.bringToFront();
let bought=null;for(let i=0;i<90&&!bought;i++){bought=await B.evaluate(()=>{const btn=[...document.querySelectorAll('#upgrade-list button')].find(x=>!x.disabled);if(!btn)return null;const name=btn.closest('.upgrade').querySelector('.name').textContent;btn.click();return name});if(!bought)await B.waitForTimeout(1000);}
const afterB=await saved(B);
await B.close({runBeforeUnload:true});await A.bringToFront();await A.waitForTimeout(3000);
await A.evaluate(()=>window.dispatchEvent(new Event('pagehide')));const afterA=await saved(A);const backup=await saved(A,KEY+'-backup');
await A.close({runBeforeUnload:true});const C=await open();const reopened=await saved(C);
const sum=u=>u?Object.values(u).reduce((a,x)=>a+(+x||0),0):0;
const lost=!!bought&&sum(reopened?.upgrades)<sum(afterB?.upgrades);
console.log(JSON.stringify({bought,afterB,afterA,backup,reopened,result:!bought?'미검증(구매 못 함)':lost?'LOST: B의 구매가 A 저장으로 사라짐':'KEPT'}));await b.close()})();
