import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const root='http://127.0.0.1:3000';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const failures=[];
const expect=(value,message)=>{if(!value)throw Error(message)};
async function checkScene(label,viewport,shot,checks){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()===404&&new URL(r.url()).hostname==='127.0.0.1')missing.push(r.url())});
  try{
    const response=await page.goto(root+'/',{waitUntil:'networkidle',timeout:30000});
    expect(response?.status()===200,label+' HTTP '+response?.status());
    await page.evaluate(()=>document.fonts.ready);
    await checks(page);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(180);
    await page.screenshot({path:'artifacts/'+shot,fullPage:true,animations:'disabled'});
  }catch(e){failures.push(label+': '+e.message)}
  if(errors.length)failures.push(label+': JS '+errors.join('/'));
  if(missing.length)failures.push(label+': missing '+missing.join('/'));
  await context.close();
}
await checkScene('Desktop',{width:1440,height:900},'home-desktop.png',async p=>{
  expect((await p.title()).includes('Dulten Richard Fromentin'),'title missing');
  expect(await p.locator('.portrait img').count()===1,'original portrait missing');
  expect(await p.locator('.practice').count()===1,'in-practice narrative missing');
  expect(await p.locator('.closing-quote').count()===1,'quote missing');
  expect(await p.locator('.project-card,.project-grid,canvas').count()===0,'old showcase leaked in');
  const portrait=await p.locator('.portrait img').evaluate(img=>{
    const s=getComputedStyle(img),r=img.getBoundingClientRect();
    return {loaded:img.complete&&img.naturalWidth>0,filter:s.filter,fit:s.objectFit,
      difference:Math.abs(r.width/r.height-img.naturalWidth/img.naturalHeight)};
  });
  expect(portrait.loaded,'portrait failed to load');
  expect(portrait.filter==='none','portrait colour filtered');
  expect(portrait.fit==='contain','portrait cropping');
  expect(portrait.difference<.035,'portrait ratio altered');
  expect(await p.locator('a[href*="linkedin.com"]').count()>=2,'LinkedIn missing');
  expect(await p.locator('a[href^="mailto:"]').count()>=1,'email missing');
  expect(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)),'horizontal overflow');
});
await checkScene('Mobile',{width:390,height:844},'home-mobile.png',async p=>{
  expect(await p.locator('h1').isVisible(),'mobile name hidden');
  const menu=p.locator('.menu-toggle');
  await menu.click();
  expect(await menu.getAttribute('aria-expanded')==='true','menu did not open');
  await p.locator('.mobile-nav').waitFor({state:'visible',timeout:1600}).catch(()=>{});
  const menuDetails=await p.locator('.mobile-nav').evaluate(el=>({
    class:el.className,inert:el.inert,visibility:getComputedStyle(el).visibility,
    display:getComputedStyle(el).display,opacity:getComputedStyle(el).opacity,
    bounds:el.getBoundingClientRect().toJSON()
  }));
  expect(await p.locator('.mobile-nav').isVisible(),'mobile navigation unavailable: '+JSON.stringify(menuDetails));
  await p.keyboard.press('Escape');
  expect(await menu.getAttribute('aria-expanded')==='false','Escape did not dismiss');
  expect(await p.locator('.portrait img').evaluate(img=>getComputedStyle(img).objectFit)==='contain','mobile portrait cropped');
  expect(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)),'horizontal overflow');
});
await checkScene('Tablet',{width:768,height:1024},'home-tablet.png',async p=>{
  expect(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)),'horizontal overflow');
  expect(await p.locator('.profile-story').isVisible(),'profile missing');
});
await checkScene('Small mobile',{width:360,height:740},'home-small-mobile.png',async p=>{
  expect(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3)),'horizontal overflow');
  expect(await p.locator('h1').isVisible(),'hero missing');
});
await browser.close();
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
else console.log('Desktop, mobile, small mobile and tablet passed with an intact portrait and working navigation.');
