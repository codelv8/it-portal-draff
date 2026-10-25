/* Synthetic local-browser verification. Uses the existing Playwright dev runtime. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const base=process.env.PORTAL_TEST_URL||'http://127.0.0.1:8127';
const output=path.resolve(__dirname,'../test-results/quick-launch');
const key='it-portal-quick-launch-v1';
fs.mkdirSync(output,{recursive:true});
const report={checks:[],errors:[],screenshots:[],spacing:[],spacingStates:[]};
function check(name,value){assert.ok(value,name);report.checks.push(name)}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const context=await browser.newContext();const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 const open=()=>page.locator('[data-quick="open"]').click();
 const add=()=>page.locator('[data-quick="add"]').click();
 const submit=()=>page.locator('[data-quick-form] [type="submit"]').click();
 const dialog=page.locator('#modalLayer');
 await page.goto(base+'/admin/index.html');
 check('launcher exists',await page.locator('[data-quick="open"]').count()===1);
 await open();
 check('search receives focus',await page.locator('#quickSearch').evaluate(el=>el===document.activeElement));
 check('system catalog mirrors navigation',await page.locator('#quickSystem + .quick-grid .quick-card').count()===await page.locator('.nav-link').count());
 check('background is inert and locked',await page.locator('.app-shell').evaluate(el=>el.inert)&&await page.evaluate(()=>document.body.style.overflow==='hidden'));
 await page.locator('#quickSearch').fill('no-result-unique');
 check('search no results',await page.locator('#quickCount').innerText()==='พบ 0 เมนู');
 await page.locator('[data-quick="clear"]').click();await add();
 await page.locator('#quickName').fill('Test shortcut');await page.locator('#quickUrl').fill('javascript:alert(1)');await submit();
 check('unsafe URL blocked',await page.locator('#quickUrl').evaluate(el=>!el.validity.valid));
 await page.locator('#quickUrl').fill('https://example.com/tools');await page.locator('#quickDescription').fill('Synthetic tools');
 await page.locator('[name="newTab"]').check();await submit();
 check('save closes editor, keeps launcher',!(await dialog.evaluate(el=>el.classList.contains('open')))&&await page.locator('#quickLaunch').isVisible());
 check('new tab rel',await page.locator('.quick-card-link[href="https://example.com/tools"]').getAttribute('rel')==='noopener noreferrer');
 check('stored version and stable ID',await page.evaluate(key=>{const data=JSON.parse(localStorage.getItem(key));return data.version===1&&Boolean(data.items[0].id)},key));
 await page.locator('[data-quick="edit"]').click();await page.locator('#quickName').fill('Changed');
 page.once('dialog',d=>d.dismiss());await page.keyboard.press('Escape');
 check('dirty cancel retains form when declined',await dialog.locator('form').count()===1);
 page.once('dialog',d=>d.accept());await page.keyboard.press('Escape');
 check('Escape closes only editor',await page.locator('#quickLaunch').isVisible()&&await dialog.locator('form').count()===0);
 check('focus restored to edit',await page.locator('[data-quick="edit"]').evaluate(el=>el===document.activeElement));
 await page.locator('#quickSearch').fill('Test');
 await page.locator('[data-quick="edit"]').click();await page.locator('#quickName').fill('Test edited');await submit();
 check('edit retains query',await page.locator('#quickSearch').inputValue()==='Test');
 await page.reload();await open();check('reload persistence',await page.locator('.quick-card h3').filter({hasText:'Test edited'}).count()===1);
 await page.locator('[data-quick="delete"]').click();await dialog.getByRole('button',{name:'ยกเลิก',exact:true}).click();
 check('delete cancel preserves item',await page.locator('[data-quick="edit"]').count()===1);
 await page.locator('[data-quick="delete"]').click();await submit();
 check('delete saved',await page.locator('[data-quick="edit"]').count()===0);
 await page.evaluate(()=>Object.defineProperty(crypto,'randomUUID',{value:undefined,configurable:true}));
 await add();await page.locator('#quickName').fill('HTTP-compatible shortcut');await page.locator('#quickUrl').fill('/portal.html');await submit();
 check('ID generation supports non-secure HTTP browsers',await page.evaluate(key=>Boolean(JSON.parse(localStorage.getItem(key)).items[0].id),key));
 // Stress and XSS: every record must remain reachable, with no rendering cap.
 await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({version:1,items:Array.from({length:200},(_,i)=>({id:`test-${i}`,title:i===0?'<img src=x onerror="window.quickXss=1">':`Synthetic menu ${i}`,description:'Synthetic long title and detail '.repeat(5),url:`https://example.com/${i}`,icon:'layout',newTab:false}))})),key);
 await page.reload();await open();
 check('all 200 personal cards rendered',await page.locator('[data-quick="edit"]').count()===200);
 check('XSS stays text',await page.locator('.quick-card h3 img').count()===0&&await page.evaluate(()=>!window.quickXss));
 await page.locator('[data-quick="edit"]').last().scrollIntoViewIfNeeded();
 check('last card reachable',await page.locator('[data-quick="edit"]').last().isVisible());
 const scroll=await page.locator('#quickResults').evaluate(el=>el.scrollTop);
 await page.locator('[data-quick="edit"]').last().click();await page.locator('#quickName').fill('Synthetic menu 199 edited');await submit();
 check('save preserves scroll',Math.abs(await page.locator('#quickResults').evaluate(el=>el.scrollTop)-scroll)<2);
 await page.locator('#quickSearch').fill('199 edited');check('last card searchable',await page.locator('#quickCount').innerText()==='พบ 1 เมนู');
 await page.keyboard.press('Escape');check('opener restored',await page.locator('[data-quick="open"]').evaluate(el=>el===document.activeElement));
 await page.goto(base+'/admin/my-work.html');await open();check('cross-page persistence',await page.locator('[data-quick="edit"]').count()===200);
 await page.keyboard.press('Escape');page.once('dialog',d=>d.accept());
 await page.goto(base+'/admin/settings.html');await page.locator('[data-action="reset-data"]').first().click();
 check('mock reset preserves shortcuts',await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).items.length===200,key));
 await open();await page.locator('[data-quick="close"]').focus();await page.keyboard.press('Shift+Tab');
 check('reverse Tab wraps',await page.locator('[data-quick="delete"]').last().evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Tab');check('forward Tab wraps',await page.locator('[data-quick="close"]').evaluate(el=>el===document.activeElement));
 await add();await page.locator('#quickName').fill('Unsaved');await page.locator('#quickUrl').fill('/portal.html');
 await page.evaluate(()=>{window.quickSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')}});
 await submit();check('quota error retains values',await page.locator('#quickName').inputValue()==='Unsaved'&&await page.locator('[data-quick-error]').innerText()!=='');
 await page.evaluate(()=>Storage.prototype.setItem=window.quickSet);page.once('dialog',d=>d.accept());await page.keyboard.press('Escape');
 await page.evaluate(key=>localStorage.setItem(key,'{broken'),key);await page.reload();await open();
 check('corrupt storage warns without overwrite',await page.locator('#quickError').innerText()!==''&&await page.evaluate(key=>localStorage.getItem(key)==='{broken',key));
 await page.evaluate(key=>localStorage.removeItem(key),key);await page.reload();
 await page.evaluate(()=>{Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')}});await open();
 check('blocked reads warn safely',await page.locator('#quickError').innerText()!=='');
 await page.reload();
 // Matching before/after screenshots use the exact pre-change shared assets.
 const backup=process.env.QUICK_LAUNCH_BEFORE_DIR||path.join(os.tmpdir(),'it-portal-quick-launch-before');
 const hasBefore=fs.existsSync(path.join(backup,'app.js'))&&fs.existsSync(path.join(backup,'styles.css'));
 report.beforeComparison=hasBefore?'Captured from pre-change backups':'Not verified: set QUICK_LAUNCH_BEFORE_DIR to pre-change app.js and styles.css';
 for(const theme of ['dark','light'])for(const width of [390,900,1440,1728]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(t=>localStorage.setItem('it-portal-theme-v1',t),theme);
   for(const stage of hasBefore?['before','after']:['after']){
     if(stage==='before'){
       await page.route('**/assets/js/app.js',route=>route.fulfill({path:path.join(backup,'app.js'),contentType:'application/javascript'}));
       await page.route('**/assets/css/styles.css',route=>route.fulfill({path:path.join(backup,'styles.css'),contentType:'text/css'}));
     }else{await page.unroute('**/assets/js/app.js');await page.unroute('**/assets/css/styles.css')}
     await page.goto(base+'/admin/index.html');
     await page.screenshot({path:path.join(output,`${theme}-${width}-${stage}.png`)});
     report.screenshots.push(`${theme}-${width}-${stage}.png`);
   }
   await open();
   check(`${theme}/${width} no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(`${theme}/${width} fullscreen`,await page.locator('#quickLaunch').evaluate(el=>{const r=el.getBoundingClientRect();return r.width===innerWidth&&r.height===innerHeight}));
   report.spacing.push({theme,width,...await page.locator('.quick-grid').first().evaluate(el=>({gap:getComputedStyle(el).gap,columns:getComputedStyle(el).gridTemplateColumns}))});
   report.spacingStates.push(await page.evaluate(({theme,width})=>({name:`${theme}-${width}-launcher`,viewport:{width,height:innerHeight},elements:[...document.querySelectorAll('#quickLaunch,.quick-head,.quick-toolbar,.quick-grid,.quick-card-link')].map((el,i)=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {id:`quick-${i}`,tag:el.tagName.toLowerCase(),selector:el.id?'#'+el.id:'.'+el.className.split(' ')[0],rect:{x:r.x,y:r.y,width:r.width,height:r.height},clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,style:{display:s.display,rowGap:parseFloat(s.rowGap)||0,columnGap:parseFloat(s.columnGap)||0,overflowX:s.overflowX,overflowY:s.overflowY,padding:{top:parseFloat(s.paddingTop),right:parseFloat(s.paddingRight),bottom:parseFloat(s.paddingBottom),left:parseFloat(s.paddingLeft)}}}})}),{theme,width}));
   await page.screenshot({path:path.join(output,`${theme}-${width}-overlay.png`)});report.screenshots.push(`${theme}-${width}-overlay.png`);
   await add();await page.screenshot({path:path.join(output,`${theme}-${width}-editor.png`)});
   check(`${theme}/${width} editor fits`,await dialog.locator('.modal').evaluate(el=>el.getBoundingClientRect().width<=innerWidth));
   await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await open();check('reduced motion remains usable',await page.locator('#quickSearch').isVisible());
 await page.emulateMedia({media:'print'});check('launcher hidden in print',!await page.locator('#quickLaunch').isVisible()&&!await page.locator('[data-quick="open"]').isVisible());
 await page.emulateMedia({media:'screen'});
 for(const file of ['index.html','portal.html','admin/login.html']){await page.goto(base+'/'+file);check(`${file} has no launcher`,await page.locator('[data-quick="open"]').count()===0)}
 check('no browser errors',report.errors.length===0);
 console.log(`PASS ${report.checks.length} checks; ${report.screenshots.length} comparison/overlay screenshots`);
 }finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
