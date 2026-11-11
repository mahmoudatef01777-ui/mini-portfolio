/**
 * Check the prerendered pages three ways, against the real security headers.
 *
 *   1. WITHOUT JavaScript — what GPTBot, ClaudeBot, WhatsApp and LinkedIn see.
 *   2. WITH JavaScript under the CSP — the app must take over cleanly: no
 *      console errors, no CSP violations, still exactly one <h1>.
 *   3. Language and head per route — a crawler reads them from the html.
 *
 * Expects the CSP test server (scratch `serve_csp.py`) or `vite preview` on
 * BASE. The no-JS numbers are the point: they were ZERO before prerendering.
 */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const chrome = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));
if (!chrome) throw new Error('Chrome not found.');

const BASE = process.env.BASE ?? 'http://127.0.0.1:4190';
const ROUTES = ['/', '/ar', '/story', '/ar/story'];
const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
let bad = 0;

for (const route of ROUTES) {
  // ---- 1. no JavaScript
  const raw = await browser.newPage();
  await raw.setJavaScriptEnabled(false);
  await raw.goto(BASE + route, { waitUntil: 'load' });
  const nojs = await raw.evaluate(() => ({
    chars: document.body.innerText.replace(/\s+/g, ' ').trim().length,
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    h2: document.querySelectorAll('h2').length,
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    canonical: document.querySelector('link[rel=canonical]')?.href,
    desc: document.querySelector('meta[name=description]')?.content.length,
    jsonld: !!document.querySelector('script[type="application/ld+json"]'),
  }));
  await raw.close();

  // ---- 2. with JavaScript, under the CSP
  const page = await browser.newPage();
  const problems = [];
  page.on('console', (m) => ['error'].includes(m.type()) && problems.push(m.text().slice(0, 140)));
  page.on('pageerror', (e) => problems.push('pageerror: ' + e.message.slice(0, 140)));
  await page.goto(BASE + route, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  const live = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    root: document.getElementById('root').innerText.length,
    fontcss: document.getElementById('fontcss')?.media,
  }));
  await page.close();

  const ok = nojs.chars > 1500 && nojs.h1.length === 1 && live.h1 === 1 && problems.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'BAD'} ${route}`);
  console.log(`    no-JS : ${nojs.chars} chars · h1 "${nojs.h1[0]?.slice(0, 40)}" · ${nojs.h2} h2 · lang=${nojs.lang} dir=${nojs.dir}`);
  console.log(`            title "${nojs.title}" · desc ${nojs.desc} chars · json-ld ${nojs.jsonld}`);
  console.log(`            canonical ${nojs.canonical}`);
  console.log(`    with JS: ${live.root} chars · ${live.h1} h1 · fonts ${live.fontcss} · errors ${problems.length}`);
  problems.forEach((p) => console.log('      !', p));
}
await browser.close();
process.exit(bad ? 1 : 0);
