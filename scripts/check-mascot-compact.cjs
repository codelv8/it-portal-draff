/* Real rendered compact component checks. Uses installed Playwright; no app dependencies. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'test-results/half-body');
const base=process.env.PORTAL_TEST_URL||'http://127.0.0.1:8127';
const report={checks:[],errors:[],screenshots:[],geometry:[]};
fs.mkdirSync(path.join(out,'after'),{recursive:true});
function check(name,value){assert.ok(value,name);report.checks.push(name)}
async function decode(page){await page.locator('img').evaluateAll(items=>Promise.all(items.map(i=>{i.loading='eager';return i.decode()})))}
async function screenshot(page,file,element){const target=element||page;await target.screenshot({path:path.join(out,'after',file),fullPage:!element});report.screenshots.push(file)}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(base+'/');
 for(const theme of ['dark','light']){
  await page.evaluate(t=>localStorage.setItem('it-portal-theme-v1',t),theme);
  for(const width of [390,900,1440,1728]){
   await page.setViewportSize({width,height:1000});
   await page.goto(base+'/admin/settings.html');
   const half=page.locator('[data-gallery-variant="half-body"]');await half.locator('summary').click();await decode(page);
   check(`${theme}/${width}: two galleries`,await page.locator('.mascot-gallery').count()===2);
   check(`${theme}/${width}: half-body reactions`,await half.locator('.mascot-gallery-grid img').count()===10);
   check(`${theme}/${width}: full-body reactions`,await page.locator('[data-gallery-variant="full"] .mascot-gallery-grid img').count()===10);
   const avatar=await page.locator('.avatar').first().evaluate(el=>({image:!!el.querySelector('img'),text:el.textContent}));check(`${theme}/${width}: personnel avatars unchanged`,!avatar.image&&avatar.text.trim().length>0);
   const measurements=await half.locator('.mascot-size-samples img').evaluateAll(items=>items.filter(i=>!i.closest('.mascot-avatar')).map(i=>({className:i.className,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,fit:getComputedStyle(i).objectFit})));
   for(const [index,size] of [32,40,48,64,96].entries()){const m=measurements[index];check(`${theme}/${width}: ${size}px`,m.width===size&&m.height===size&&m.fit==='contain')}
   const avatars=await half.locator('.mascot-avatar').evaluateAll(items=>items.map(i=>{const s=getComputedStyle(i);const b=i.getBoundingClientRect();return {width:b.width,height:b.height,radius:s.borderRadius,overflow:s.overflow}}));
   check(`${theme}/${width}: circular assistant avatar`,avatars.every((a,i)=>a.width===[32,40,48][i]&&a.height===a.width&&a.radius==='50%'&&a.overflow==='hidden'));
   check(`${theme}/${width}: no gallery overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   report.geometry.push({theme,width,measurements,avatars});
   await screenshot(page,`settings-${theme}-${width}.png`);
   if(width===1440){
    await screenshot(page,`overview-${theme}.png`,half);
    await half.evaluate(el=>{const source=[...el.querySelectorAll('.mascot-gallery-grid figure')];const preview=el.querySelector('.mascot-size-preview');preview.replaceChildren();const heading=document.createElement('h3');heading.textContent='ครึ่งตัว · 32 / 40 / 48 / 64 / 96px';preview.append(heading);for(const item of source){const row=document.createElement('section');row.style.cssText='display:flex;align-items:center;gap:24px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid var(--line)';const name=document.createElement('strong');name.textContent=item.querySelector('figcaption').textContent;name.style.width='80px';row.append(name);for(const size of [32,40,48,64,96]){const image=item.querySelector('img').cloneNode(true);image.className=`mascot mascot-half-body mascot-size-${size}`;row.append(image)}preview.append(row)}});await decode(page);await screenshot(page,`size-matrix-${theme}.png`,half);
   }
   await page.goto(base+'/admin/login.html');await decode(page);
   if(width<=900)check(`${theme}/${width}: compact mobile Login`,await page.locator('.mascot-login-mobile').isVisible()&&await page.locator('.mascot-login-mobile').getAttribute('data-mascot-variant')==='half-body');
   check(`${theme}/${width}: Login overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await screenshot(page,`admin_login.html-${theme}-${width}.png`);
   await page.goto(base+'/admin/');await decode(page);check(`${theme}/${width}: sidebar compact source`,await page.locator('.mascot-sidebar').getAttribute('src').then(s=>s.includes('/half-body/typing.png')));await screenshot(page,`admin_index.html-${theme}-${width}.png`);
   await page.locator('.page-actions [data-action="new-task"]').click();await page.locator('#newTaskTitle').fill('Compact mascot smoke');await page.locator('form[data-form="new-task"] button[type="submit"]').click();
   const toast=page.locator('.toast').last();await toast.locator('img').evaluate(i=>i.decode());check(`${theme}/${width}: toast success remains readable`,(await toast.innerText()).includes('สร้างงานตัวอย่าง'));check(`${theme}/${width}: compact toast 40px`,await toast.locator('img').evaluate(i=>i.getBoundingClientRect().width===40&&i.getBoundingClientRect().height===40&&i.src.includes('/half-body/success.png')));await screenshot(page,`toast-${theme}-${width}.png`);
   await page.goto(base+'/portal.html');await page.locator('[data-public-detail]').first().click();await decode(page);const modalImage=page.locator('.mascot-detail');check(`${theme}/${width}: compact modal 96px`,await modalImage.evaluate(i=>i.getBoundingClientRect().width===96&&i.getBoundingClientRect().height===96&&i.src.includes('/half-body/guide.png')));check(`${theme}/${width}: modal fits`,await page.getByRole('dialog').evaluate(el=>{const b=el.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth}));await screenshot(page,`portal.html-${theme}-${width}.png`);await page.keyboard.press('Escape');
   await page.goto(base+'/');await decode(page);check(`${theme}/${width}: hero remains full-body`,await page.locator('.mascot-hero').getAttribute('data-mascot-variant')==='full');
  }
  console.log(`Compact ${theme}: four viewports checked`);
 }
 check('Zero page/console/HTTP errors',report.errors.length===0);console.log(`COMPACT BROWSER PASSED: ${report.checks.length} checks; ${report.screenshots.length} screenshots`);
}finally{await browser.close();fs.writeFileSync(path.join(out,'compact-report.json'),JSON.stringify(report,null,2))}})().catch(e=>{console.error(e);process.exitCode=1});
