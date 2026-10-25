/* Optional dev verification: use an installed Playwright, no product dependency/build chain. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const contract=JSON.parse(fs.readFileSync(path.join(root,'design-contract.json'),'utf8'));
const base=process.env.PORTAL_TEST_URL||'http://127.0.0.1:8127';
const output=path.join(root,'test-results','portal');
fs.mkdirSync(output,{recursive:true});
const report={checks:[],errors:[],layouts:[],links:[],screenshots:[]};
function check(name,value){assert.ok(value,name);report.checks.push(name)}
function contrast(a,b){const luminance=rgb=>{const values=rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return values[0]*.2126+values[1]*.7152+values[2]*.0722};const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const context=await browser.newContext({acceptDownloads:true});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`)});
 // Defaults and legacy browser state are tested in an isolated browser context.
 await page.goto(base+'/');
 check('Dark is the default',await page.getAttribute('html','data-theme')==='dark');
 await page.goto(base+'/admin/');
 await page.evaluate(()=>localStorage.setItem('it-portal-aurora-mock-v2',JSON.stringify({tasks:window.IT_MOCK.tasks,notes:{'IT-2401':[{text:'Legacy browser note',by:'Demo',at:'Sample'}]},role:'IT Staff',legacyMarker:'preserved'})));
 for(const theme of ['dark','light']){
  await page.evaluate(t=>localStorage.setItem('it-portal-theme-v1',t),theme);
  for(const width of [390,900,1440,1728]){
   await page.setViewportSize({width,height:1000});
   for(const file of contract.htmlPages){
    const response=await page.goto(base+'/'+file);
    check(`${theme}/${width}/${file}: HTTP and render`,response.status()===200&&await page.locator('h1').count()===1);
    check(`${theme}/${width}/${file}: theme`,await page.getAttribute('html','data-theme')===theme);
    const primaryColors=await page.locator('.btn-primary').evaluateAll(buttons=>buttons.map(b=>{const s=getComputedStyle(b);return [s.color,s.backgroundColor]}));
    check(`${theme}/${width}/${file}: primary text contrast`,primaryColors.every(([fg,bg])=>contrast(fg,bg)>=4.5));
    const geometry=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,title:document.title}));
    report.layouts.push({theme,width,file,...geometry});
    check(`${theme}/${width}/${file}: no page overflow`,geometry.width<=width+1);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>null)})));
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src));
    check(`${theme}/${width}/${file}: images`,broken.length===0);
    if(['index.html','portal.html','duty.html','admin/index.html','admin/login.html','admin/settings.html'].includes(file)){
     const image=`${file.replaceAll('/','_').replace('.html','')}-${theme}-${width}.png`;
     await page.screenshot({path:path.join(output,image),fullPage:true});report.screenshots.push(image);
    }
    if(theme==='dark'&&width===1440){
     report.links.push(...await page.locator('a[href]').evaluateAll(links=>links.map(a=>({label:a.textContent.trim(),url:a.href}))));
    }
   }
  }
  console.log(`Rendered ${theme}: 24 pages x 4 widths`);
 }
 const urls=[...new Set(report.links.map(x=>x.url))].filter(u=>u.startsWith(base));
 for(const url of urls){const response=await context.request.get(url);check(`Local link: ${url}`,response.status()===200)}
 for(const [legacy,target] of Object.entries(contract.compatibilityRedirects)){
  await page.goto(`${base}/${legacy}?id=IT-2401&demo=1#record`);
  await page.waitForURL(`${base}/${target}?id=IT-2401&demo=1#record`);
  check(`Legacy redirect: ${legacy}`,page.url().endsWith(`${target}?id=IT-2401&demo=1#record`));
 }
 await page.goto(base+'/admin/task-detail.html?id=IT-2401');
 check('Legacy note retained',await page.getByText('Legacy browser note',{exact:true}).count()===1);
 check('Legacy browser fields retained',await page.evaluate(()=>JSON.parse(localStorage.getItem('it-portal-aurora-mock-v2')).legacyMarker==='preserved'));
 // Public search, category and modal focus behavior.
 await page.goto(base+'/portal.html');
 await page.locator('#publicSearch').fill('ZZZ-no-match');
 check('Search empty state',await page.getByRole('heading',{name:'ไม่พบรายการที่ค้นหา'}).count()===1);
 await page.locator('[data-public-reset]').click();
 check('Search reset',await page.locator('[data-public-detail]').count()===6);
 await page.locator('#publicCategory').selectOption('การเรียนรู้');
 check('Category filter',await page.locator('[data-public-detail]').count()===2);
 const opener=page.locator('[data-public-detail]').first();await opener.click();
 check('Detail dialog opens',await page.getByRole('dialog').isVisible());
 const focusable=page.getByRole('dialog').locator('a,button,input,select,textarea');
 await focusable.last().focus();await page.keyboard.press('Tab');
 check('Dialog Tab wraps',await focusable.first().evaluate(el=>el===document.activeElement));
 await focusable.first().focus();await page.keyboard.press('Shift+Tab');
 check('Dialog Shift+Tab wraps',await focusable.last().evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');
 check('Dialog closes and focus returns',await page.getByRole('dialog').count()===0&&await opener.evaluate(el=>el===document.activeElement));
 for(const file of ['announcements.html','guide.html','e-learning.html','hait.html','digital-policy.html']){
  await page.goto(base+'/'+file);await page.locator('#publicSearch').fill('ZZZ-no-match');
  check(`${file}: empty`,await page.locator('[data-public-reset]').count()===1);await page.locator('[data-public-reset]').click();
  await page.locator('[data-public-detail]').first().click();check(`${file}: detail`,await page.getByRole('dialog').isVisible());await page.keyboard.press('Escape');
 }
 await page.goto(base+'/duty.html');await page.locator('#dutyMonth').fill('2028-02');
 check('Leap month renders 29 days',await page.locator('[data-duty-day]').count()===29);
 await page.locator('[data-duty-day="29"]').click();check('Duty detail month',await page.getByRole('dialog').innerText().then(t=>t.includes('2571')));await page.keyboard.press('Escape');
 await page.locator('#dutyMonth').fill('2026-11');check('Month updates to 30 days',await page.locator('[data-duty-day]').count()===30);
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/');
 const menu=page.locator('[data-public-menu]');await menu.click();check('Mobile menu opens',await page.locator('#publicNav').isVisible());await page.keyboard.press('Escape');check('Mobile menu Escape',await menu.getAttribute('aria-expanded')==='false'&&!await page.locator('#publicNav').isVisible());
 const toggle=page.locator('[data-action="toggle-theme"]');await toggle.focus();await page.keyboard.press('Enter');
 const chosen=await page.getAttribute('html','data-theme');await page.goto(base+'/admin/settings.html');check('Theme persists public to admin',await page.getAttribute('html','data-theme')===chosen);
 const fullGallery=page.locator('[data-gallery-variant="full"]');
 await fullGallery.locator('summary').click();
 await fullGallery.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
 check('All ten full reactions in Settings',await fullGallery.locator('.mascot-gallery-grid img').count()===10);
 const halfGallery=page.locator('[data-gallery-variant="half-body"]');
 await halfGallery.locator('summary').click();
 await halfGallery.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode()})));
 check('All ten half-body reactions in Settings',await halfGallery.locator('.mascot-gallery-grid img').count()===10);
 await page.screenshot({path:path.join(output,'mascot-gallery-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(output,'mascot-gallery-desktop.png'),fullPage:true});
 // Existing core workflows continue to operate in the new directory.
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/admin/login.html');
 const loginToggle=page.locator('[data-action="toggle-theme"]');
 check('Mobile Login theme control visible',await loginToggle.isVisible());await loginToggle.focus();await page.keyboard.press('Enter');await page.keyboard.press('Enter');
 check('Mobile Login theme keyboard works',await page.getAttribute('html','data-theme')===chosen);
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('form[data-form="login"] button[type="submit"]').click();await page.waitForURL(base+'/admin/index.html');check('Demo Login enters admin dashboard',page.url().endsWith('/admin/index.html'));
 await page.locator('[data-action="new-task"]').first().click();
 await page.locator('form[data-form="new-task"] button[type="submit"]').click();
 check('Required task title validation',await page.locator('#newTaskTitle').evaluate(el=>!el.validity.valid));
 await page.locator('#newTaskTitle').fill('Browser regression sample');await page.locator('form[data-form="new-task"] button[type="submit"]').click();
 check('Create task persists',await page.evaluate(()=>JSON.parse(localStorage.getItem('it-portal-aurora-mock-v2')).tasks.some(t=>t.title==='Browser regression sample')));
 await page.goto(base+'/admin/my-work.html');await page.locator('[data-filter-search]').fill('Browser regression sample');check('Task search',await page.getByText('Browser regression sample',{exact:true}).count()===1);
 await page.getByText('Browser regression sample',{exact:true}).click();check('Task detail stays admin',new URL(page.url()).pathname==='/admin/task-detail.html');
 await page.goto(base+'/admin/team-board.html');const status=page.locator('[data-status-change]').first();check('Kanban keyboard status control exists',await status.count()===1);await status.selectOption('Completed');
 await page.goto(base+'/admin/projects.html');const projectLink=page.locator('a[href^="project-detail.html"]').first();await projectLink.click();check('Project detail stays admin',new URL(page.url()).pathname==='/admin/project-detail.html');
 await page.goto(base+'/admin/reports.html');const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="export-report"]').click();const download=await downloadPromise;check('Report CSV export',download.suggestedFilename().endsWith('.csv'));await download.saveAs(path.join(output,'report.csv'));
 await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(output,'report-print-dark.png'),fullPage:true});check('Dark report print background is white',await page.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgb(255, 255, 255)'));await page.emulateMedia({media:'screen'});
 for(const printTheme of ['light','dark']){await page.evaluate(t=>localStorage.setItem('it-portal-theme-v1',t),printTheme);for(const printPage of ['index.html','admin/reports.html']){await page.goto(base+'/'+printPage);await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(output,`${printPage.replaceAll('/','_')}-print-${printTheme}.png`),fullPage:true});check(`Print white background ${printPage}/${printTheme}`,await page.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgb(255, 255, 255)'));check(`Print readable body text ${printPage}/${printTheme}`,await page.locator('#page-content p').evaluateAll(items=>items.every(el=>getComputedStyle(el).color==='rgb(36, 32, 41)')));await page.emulateMedia({media:'screen'});}}
 await page.evaluate(t=>localStorage.setItem('it-portal-theme-v1',t),chosen);
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');check('Reduced motion content available',await page.locator('h1').isVisible());await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto(base+'/admin/settings.html');page.once('dialog',d=>d.accept());await page.locator('[data-action="reset-data"]').first().click();check('Reset mock retains theme',await page.evaluate(t=>localStorage.getItem('it-portal-theme-v1')===t,chosen));
 check('No JS/console/HTTP errors',report.errors.length===0);
 report.screenshots=fs.readdirSync(output).filter(x=>x.endsWith('.png'));
 console.log(`PORTAL BROWSER PASSED: ${report.checks.length} checks; ${report.layouts.length} rendered states; ${report.screenshots.length} screenshots`);
 }finally{await browser.close();fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2))}
})().catch(e=>{console.error(e);process.exitCode=1});
