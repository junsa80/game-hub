const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'..'),key='arcana-pocket-v1';
 const server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname;
  const f=path.join(root,name==='/'?'index.html':name);
  try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.webp')?'image/webp':'text/html');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
  for(const [width,height] of [[360,800],[390,844],[412,915]]){
   const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port);
   await page.locator('[data-start="0"]').tap();
   const saved=await page.evaluate(k=>localStorage.getItem(k),key);
   await page.reload();assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
   await page.locator('[data-hand]').first().tap();
   await page.locator('#modal').waitFor({state:'visible'});
   const rect=await page.locator('#modal').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width+1);
   await page.locator('#modal > button').tap();
   const raw=await page.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));delete s.battle.log;const raw=JSON.stringify(s);localStorage.setItem(k,raw);return raw;},key);
   await page.reload();await page.getByText('원본은 보존 중이며',{exact:false}).waitFor();
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),raw);
   await page.getByRole('button',{name:'도움말 · 저장',exact:true}).tap();
   await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await page.getByText('올바른 게임 백업 파일이 아닙니다.',{exact:true}).waitFor();
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),raw);
   page.once('dialog',d=>d.accept());
   await page.locator('#import').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(saved)});
   await page.getByText('백업 불러오기 완료',{exact:true}).waitFor();
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
   await page.getByRole('button',{name:'대전',exact:true}).tap();
   assert.ok(await page.locator('[data-hand]').count()>0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.deepEqual(errors,[]);
   console.log('PASS '+width+'x'+height+' touch details / active reload / corrupt original retained / invalid import / valid recovery / no horizontal overflow / zero page errors');
   await context.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
