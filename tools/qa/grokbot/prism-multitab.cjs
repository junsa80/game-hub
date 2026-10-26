// [GrokBot] prism-muse 두 탭 덮어쓰기 확인 (헤드리스 Chrome 에뮬레이션, 실기기 아님). 허브 play 사본(/game-hub/play/prism-muse/)을 읽기만 함.
// 허브 사본은 /api/save 대신 localStorage 'prism-muse-static-save'(버전 번호만 올리고 비교 없음)와 'prism-muse-backup'(상태 바뀔 때마다)에 씀. 숨김/pagehide 때 현재 탭 상태를 바로 올림.
// 시나리오: 탭 A를 먼저 열어 둠 → 탭 B에서 도전 시작(진행 중 런 생성) → B를 닫음(저장) → A로 돌아가 A가 숨김/닫힘 → 다시 열었을 때 B의 런이 남는지.
// 사용: PW=<playwright-core> [STALE_ACTION=버튼글자] node tools/qa/grokbot/prism-multitab.cjs [URL]  (STALE_ACTION: 돌아온 A에서 누를 버튼, 예: '도전 시작' — A가 무언가 바꾸는 경우)
const {chromium}=require(process.env.PW||'playwright-core');const URL_=process.argv[2]||'http://localhost:8960/game-hub/play/prism-muse/';
(async()=>{const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const open=async()=>{const p=await c.newPage();p.on('dialog',d=>d.accept());await p.goto(URL_);await p.waitForTimeout(4000);return p};
const click=async(p,t)=>{await p.evaluate(t=>{const el=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.includes(t));if(!el)throw Error('no '+t);el.click()},t);await p.waitForTimeout(900)};
const st=p=>p.evaluate(()=>{const pick=s=>s&&{run:s.run?{stage:s.run.stage,phase:s.run.phase}:null,runs:s.profile?.stats?.runs,moves:s.profile?.stats?.moves};
 const ss=JSON.parse(localStorage.getItem('prism-muse-static-save')||'null');return {server:ss&&{version:ss.version,...pick(ss.state)},backup:pick(JSON.parse(localStorage.getItem('prism-muse-backup')||'null'))}});
const A=await open();const B=await open();await B.bringToFront();
await click(B,'도전 시작');await B.waitForTimeout(2500);
// B에서 유효 매치 1회(교환형): 화면의 gem 버튼 위치·색으로 3개 연결되는 인접 교환을 찾아 두 번 클릭 → 계정 기록 moves +1
const matched=await B.evaluate(async()=>{const gems=[...document.querySelectorAll('button.gem')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return {e,x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,c:(e.className.match(/color-(\d)/)||[])[1]}});if(!gems.length)return false;
 const w=gems[0].w,xs=[...new Set(gems.map(g=>Math.round(g.x/w)))].sort((a,b)=>a-b),ys=[...new Set(gems.map(g=>Math.round(g.y/w)))].sort((a,b)=>a-b);const G={};for(const g of gems)G[xs.indexOf(Math.round(g.x/w))+','+ys.indexOf(Math.round(g.y/w))]=g;
 const col=(x,y,sw)=>{const k=x+','+y;const g=sw[k]??G[k];return g?.c};const line=(x,y,sw)=>{const c=col(x,y,sw);if(c==null)return false;for(const [dx,dy] of [[1,0],[0,1]]){let n=1;for(let i=1;col(x+dx*i,y+dy*i,sw)===c;i++)n++;for(let i=1;col(x-dx*i,y-dy*i,sw)===c;i++)n++;if(n>=3)return true}return false};
 for(let y=0;y<ys.length;y++)for(let x=0;x<xs.length;x++)for(const [dx,dy] of [[1,0],[0,1]]){const a=G[x+','+y],b=G[(x+dx)+','+(y+dy)];if(!a||!b||a.c===b.c)continue;const sw={[x+','+y]:b,[(x+dx)+','+(y+dy)]:a};if(line(x,y,sw)||line(x+dx,y+dy,sw)){a.e.click();await new Promise(r=>setTimeout(r,300));b.e.click();return true}}return false});
await B.waitForTimeout(3000);const bState=await st(B);
await B.close({runBeforeUnload:true});await new Promise(r=>setTimeout(r,800));const afterBClose=await st(A);
await A.bringToFront();await A.waitForTimeout(1500);if(process.env.STALE_ACTION){await click(A,process.env.STALE_ACTION);await A.waitForTimeout(800);}await A.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pagehide'))});await A.waitForTimeout(800);const afterA=await st(A);
await A.close({runBeforeUnload:true});const C=await open();const reopened=await st(C);
const inRun=await C.evaluate(()=>!![...document.querySelectorAll('button')].find(b=>b.offsetParent&&/포기|일시정지|메뉴로|이어/.test(b.textContent)));
const had=!!afterBClose.server?.run,kept=!!reopened.backup?.run&&(reopened.backup?.moves??0)>=(afterBClose.server?.moves??0);/* 다시 연 탭이 실제로 불러온 상태 = 불러온 직후 다시 쓰는 prism-muse-backup */
console.log(JSON.stringify({matched,bState,afterBClose,afterA,reopened,inRun,result:!had?'미검증(B 런이 저장되지 않음)':kept?'KEPT':'LOST: B의 진행(런 또는 매치 기록)이 A 저장으로 사라짐'}));await b.close()})();
