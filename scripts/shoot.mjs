import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(p=>fs.existsSync(p));
const BASE = process.argv[2] || 'http://localhost:4180';
const OUT = process.argv[3] || 'shots';
fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({executablePath:chrome,args:['--no-sandbox']});
const page = await browser.newPage();
const jobs = [
  // "/" is English and "/ar" is Arabic since 2026-09-19 — these were the
  // other way round and would have shot the wrong language into every file.
  ['mobile-ar-light','/ar',390,'light'],
  ['mobile-ar-dark','/ar',390,'dark'],
  ['desktop-en-light','/',1280,'light'],
];
for (const [name,path,width,theme] of jobs) {
  await page.setViewport({width,height:900,deviceScaleFactor:2});
  await page.goto(BASE+path,{waitUntil:'networkidle2'});
  await page.evaluate(t=>{document.documentElement.setAttribute('data-theme',t);document.documentElement.style.scrollBehavior='auto';},theme);
  // Walk the page so every reveal fires, then return to the top.
  await page.evaluate(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);});
  // A fullPage capture re-renders the document at its whole height, and
  // lazy images that loaded during the walk come out blank in the stitched
  // frame. Force them eager and wait for the decode before shooting.
  await page.evaluate(async()=>{
    const imgs=[...document.querySelectorAll('img')];
    imgs.forEach(i=>{i.loading='eager';});
    await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));
  });
  await new Promise(r=>setTimeout(r,1400));
  await page.screenshot({path:`${OUT}/${name}.png`,fullPage:true});
  console.log(name);
}
await browser.close();
