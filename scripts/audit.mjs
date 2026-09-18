#!/usr/bin/env node
/**
 * Pre-review audit for the landing page.
 *
 *   npm run preview -- --port 4180
 *   npm run audit -- --url=http://localhost:4180
 *
 * Checks both languages at nine widths in both themes: console errors,
 * horizontal overflow, image alt text and dimensions, heading structure,
 * accessible names, and that every reveal actually reveals.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const BASE = (args.url || 'http://localhost:4180').replace(/\/$/, '');

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
];
const chrome = CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) throw new Error('Chrome not found.');

// Both pages, in both languages. `/story` arrived after this harness did;
// leaving it out meant half the site was never audited.
const PATHS = ['/', '/ar', '/story', '/ar/story'];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const THEMES = ['light', 'dark'];

const problems = { console: [], overflow: [], images: [], headings: [], labels: [], reveals: [] };
const add = (k, v) => problems[k].push(v);

const browser = await puppeteer.launch({ executablePath: chrome, args: ['--no-sandbox'] });
const page = await browser.newPage();

let current = '';
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') {
    if (!/favicon\.ico/.test(m.text())) add('console', `${current} [${m.type()}] ${m.text()}`);
  }
});
page.on('pageerror', (e) => add('console', `${current} [pageerror] ${e.message}`));
page.on('requestfailed', (r) => {
  if (r.url().startsWith(BASE)) add('console', `${current} [failed] ${r.url()}`);
});

for (const path of PATHS) {
  current = path;
  await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 600));

  // Everything must reveal even when the page is jumped, not scrolled.
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise((r) => setTimeout(r, 1500));

  const found = await page.evaluate(() => {
    const name = (el) => {
      const own = el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '';
      if (own.trim()) return own.trim();
      return [...el.querySelectorAll('img[alt]')].map((i) => i.alt).join(' ').trim();
    };
    const rev = [...document.querySelectorAll('.reveal')];
    return {
      imgs: [...document.querySelectorAll('img')].map((i) => ({
        src: i.getAttribute('src') || '',
        alt: i.getAttribute('alt'),
        dims: !!(i.getAttribute('width') && i.getAttribute('height')),
        broken: i.complete && i.naturalWidth === 0,
        hidden: i.getAttribute('aria-hidden') === 'true',
      })),
      unnamed: [...document.querySelectorAll('a, button')]
        .filter((el) => !name(el) && el.offsetParent !== null)
        .map((el) => el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 40)),
      levels: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1])),
      revealTotal: rev.length,
      revealHidden: rev.filter((e) => !e.classList.contains('is-in')).length,
    };
  });

  for (const i of found.imgs) {
    if (i.broken) add('images', `${path} BROKEN ${i.src}`);
    if (i.alt === null && !i.hidden) add('images', `${path} NO ALT ${i.src}`);
    if (!i.dims) add('images', `${path} NO W/H ${i.src}`);
  }
  for (const u of found.unnamed) add('labels', `${path} unnamed ${u}`);

  const h1 = found.levels.filter((l) => l === 1).length;
  if (h1 !== 1) add('headings', `${path} has ${h1} <h1>`);
  for (let k = 1; k < found.levels.length; k += 1) {
    if (found.levels[k] - found.levels[k - 1] > 1) {
      add('headings', `${path} h${found.levels[k - 1]} -> h${found.levels[k]}`);
      break;
    }
  }
  if (found.revealHidden) {
    add('reveals', `${path} ${found.revealHidden} of ${found.revealTotal} never revealed`);
  }

  for (const theme of THEMES) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 140));
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        const diff = de.scrollWidth - de.clientWidth;
        if (diff <= 1) return null;
        let worst = null;
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (!r.width) continue;
          const spill = Math.max(r.right - de.clientWidth, -r.left);
          if (spill > 1 && (!worst || spill > worst.spill)) {
            worst = { spill: Math.round(spill), tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50) };
          }
        }
        return { diff, worst };
      });
      if (over) {
        add('overflow', `${path} @${width} ${theme} +${over.diff}px ${over.worst ? over.worst.tag + '.' + over.worst.cls : '?'}`);
      }
    }
  }
}

await browser.close();

let failed = false;
for (const [k, list] of Object.entries(problems)) {
  const u = [...new Set(list)];
  console.log(`\n=== ${k.toUpperCase()} (${u.length}) ===`);
  if (!u.length) console.log('  clean');
  u.slice(0, 20).forEach((l) => console.log('  ' + l));
  if (u.length) failed = true;
}
console.log(`\nswept ${PATHS.length} languages x ${WIDTHS.length} widths x ${THEMES.length} themes`);
process.exit(failed ? 1 : 0);
