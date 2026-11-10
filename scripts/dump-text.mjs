/**
 * Dump the visible text of every route, per language, as JSON.
 *
 * Used for reading the copy the way a visitor meets it — after the language
 * switch, after the components have chosen what to render — rather than
 * trusting the source files, which also hold comments, dead content and the
 * words of sections that have been removed.
 *
 * Run against a preview server: `npx vite preview --port 4180`.
 */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
];
const chrome = CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) throw new Error('Chrome not found.');

const BASE = process.env.BASE ?? 'http://localhost:4180';
const ROUTES = ['/', '/ar', '/story', '/ar/story'];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const out = {};
for (const route of ROUTES) {
  const page = await browser.newPage();
  // Reduced motion so nothing is mid-animation when the text is read.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + route, { waitUntil: 'networkidle0' });
  out[route] = await page.evaluate(() => {
    const seen = new Set();
    const lines = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript,[aria-hidden="true"]')) continue;
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (!t || seen.has(t)) continue;
      seen.add(t);
      lines.push(t);
    }
    return lines;
  });
  await page.close();
}
await browser.close();
fs.writeFileSync(process.env.OUT ?? 'text-dump.json', JSON.stringify(out, null, 2));
console.log(Object.entries(out).map(([r, l]) => `${r}: ${l.length} strings`).join('\n'));
