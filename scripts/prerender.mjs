/**
 * PRERENDER THE FOUR ROUTES INTO STATIC HTML, after `vite build`.
 *
 * WHY THIS EXISTS. The site is a React app that builds its page in the
 * browser, so the html it ships is an empty <div id="root">. Measured on the
 * live site before this: ZERO visible characters in the body, no <h1>. A
 * browser does not care. A crawler that does not run JavaScript does — and
 * that is most of the crawlers this site wants to be read by: GPTBot,
 * ClaudeBot, PerplexityBot and the rest of the answer engines fetch the html
 * and stop, as do WhatsApp and LinkedIn when they build a link card. All the
 * work on titles, descriptions, JSON-LD and llms.txt describes a page those
 * readers could not actually see.
 *
 * WHAT IT DOES. Serves dist/, opens each route in headless Chrome, lets the
 * app render, and writes the resulting html back to dist/ as a real file:
 *
 *     /            -> dist/index.html
 *     /ar          -> dist/ar/index.html
 *     /story       -> dist/story/index.html
 *     /ar/story    -> dist/ar/story/index.html
 *
 * Vercel serves a file that exists before it applies a rewrite, so these win
 * over the `/(.*) -> /index.html` catch-all, which stays as the fallback.
 *
 * THE APP STILL BOOTS. The module script is left in. `createRoot` clears
 * #root and renders afresh — it is not `hydrateRoot`, so there is no
 * mismatch to warn about — and the snapshot's job is only to be there for
 * whoever does not run it.
 *
 * RENDERED WITH REDUCED MOTION, and that is deliberate. With it on, no GSAP
 * tween is ever created, so the snapshot holds the page in its FINAL state:
 * no inline `opacity: 0`, no half-split headline, no counter caught
 * mid-count. A snapshot taken any other way would freeze whatever frame the
 * animation was on and ship it as the page.
 *
 * NEVER BREAKS THE BUILD. If there is no Chrome — a CI image without one —
 * this logs it and exits 0, and the site ships as the client-rendered app it
 * was before. A missing prerender costs reach; a failed deploy costs the
 * site, and the first must never turn into the second.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const ROUTES = ['/', '/ar', '/story', '/ar/story'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function bail(why) {
  console.warn(`[prerender] skipped — ${why}. The site ships client-rendered, as before.`);
  process.exit(0);
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) bail('dist/index.html is missing');

/** Find a browser: an explicit path, a local install, or the serverless build. */
async function launch() {
  const { default: puppeteer } = await import('puppeteer-core');
  const local = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = local.find((p) => fs.existsSync(p));
  if (found) return puppeteer.launch({ executablePath: found, headless: true });

  // Vercel's build image has no Chrome; this package carries one that runs
  // there. It is a devDependency, so it is installed for the build.
  const { default: chromium } = await import('@sparticuz/chromium');
  return puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: 'shell',
  });
}

/** A tiny static server with the same SPA fallback Vercel applies. */
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(DIST, url);
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) file = path.join(DIST, 'index.html'); // the rewrite
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

let browser;
let server;
let failure;
try {
  server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await launch();

  // Read every route into memory BEFORE writing any file. The server falls
  // back to dist/index.html for a route with no file, and the first write is
  // dist/index.html itself — writing as we went would have the second route
  // load the first route's snapshot.
  const snapshots = {};
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    // The head follows the url from a useEffect; give it its frame.
    await new Promise((r) => setTimeout(r, 300));

    snapshots[route] = await page.evaluate(() => {
      // The rail renders its cards twice so the loop has somewhere to land.
      // The second copy is `aria-hidden` and means nothing to a reader of
      // the html — leaving it would print every capture caption twice.
      document.querySelectorAll('.marquee-item[aria-hidden="true"]').forEach((n) => n.remove());
      return '<!doctype html>\n' + document.documentElement.outerHTML;
    });

    const text = await page.evaluate(() => document.getElementById('root')?.innerText.length ?? 0);
    const h1 = await page.evaluate(() => document.querySelectorAll('h1').length);
    if (text < 200 || h1 !== 1) throw new Error(`${route} rendered ${text} chars and ${h1} <h1> — not writing it`);
    console.log(`[prerender] ${route.padEnd(10)} ${String(text).padStart(5)} chars, ${h1} <h1>`);
    await page.close();
  }

  for (const route of ROUTES) {
    const out = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, snapshots[route]);
  }
  console.log(`[prerender] wrote ${ROUTES.length} static pages`);
} catch (err) {
  failure = err instanceof Error ? err.message : String(err);
} finally {
  await browser?.close().catch(() => {});
  server?.close();
}
// After the finally, not inside the catch: process.exit() would skip the
// cleanup above and leave a headless Chrome running on the build machine.
if (failure) bail(failure);
