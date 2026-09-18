# Mahmoud Atef — landing page (Site 2)

The personal site for the Instagram bio. Bilingual and complete on its own:

| url | |
| --- | --- |
| `/` | English home — the default, for everyone |
| `/story` | English background |
| `/ar` | Arabic home, right-to-left |
| `/ar/story` | Arabic background |

**The url is the only thing that decides the language.** Nothing stored in the
browser changes what a link means, which is what keeps a shared link honest.
Dark is the default theme and is remembered per visitor.

**This is not the full portfolio.** That is a separate project in `../site`
and stays there. This page carries the figures and the captures behind them,
and the background it used to link out for now lives here as `/story` — so it
works with the portfolio offline, unbuilt, or gone.

React 18 · TypeScript · Vite 5 · Tailwind 3. No backend, no environment
variables, **no animation library**.

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

**http://localhost:5174** for English, **http://localhost:5174/ar** for Arabic.

Port 5174 on purpose, so this runs at the same time as the main portfolio on
5173.

| command | what it does |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | typecheck, then build into `dist/` |
| `npm run preview` | serve the built `dist/` |
| `npm run audit` | 4 routes × 9 widths × 2 themes: console errors, overflow, images, headings, labels, reveals |

The audit needs the preview running:

```bash
npm run preview -- --port 4180
```

```bash
npm run audit -- --url=http://localhost:4180
```

---

## Editing it

**Every word on this site is in `src/content/`**, and nowhere else. Each
entry is written twice, `ar` and `en`. Change both.

| file | what is in it |
| --- | --- |
| `content.ts` | the home page: hero, who I am, how I think about growth, the websites, the closing, the contact details |
| `proof.ts` | the proof library — every figure, every capture, its caption, its source and its period, keyed by id |
| `story.ts` | the `/story` page: the timeline, what it taught, the takeaway |

A figure appears in `proof.ts` once and is referenced by id from there, so the
same number can never be captioned two different ways in two places.

| I want to change… | Where |
| --- | --- |
| Home page text | `src/content/content.ts` |
| A figure, a caption, a capture | `src/content/proof.ts` |
| The `/story` page | `src/content/story.ts` |
| The order of the sections | `src/App.tsx` |
| How a section looks | `src/components/Sections.tsx` |
| The header, the toggles | `src/components/Header.tsx` |
| The evidence lightbox | `src/components/Evidence.tsx` |
| Which url means what | `src/lib/url.ts` |
| Colours | `src/styles/tokens.css` |
| Fonts | `src/styles/fonts.css` + the `<link>` in `index.html` |
| Images | `public/img/` |

### Images

`public/img/` holds only what this page uses:

```
hero-mobile.webp       the hero photograph, phone
hero-desktop.webp      the hero photograph, wide
portrait-about.webp    the portrait in "who I am", desktop only
ev-*.webp              a dashboard capture behind a figure
ads-*.webp             an Ads Manager capture
logo-*.webp            a brand mark, results cards only
site-*.webp            a website, desktop
phone-*.webp           the same website, phone
```

They are copies. Changing one here does **not** change the main portfolio,
and changing one there does not change this — deliberately, so the two sites
cannot break each other.

### The unredacted originals are not in this repository

Every `ev-*` and `ads-*` file published above is a **redacted** capture: client
brand names, ad creatives and account details are blurred out, and every figure
is left untouched. The raw captures live in `_evidence-originals/`, which
`.gitignore` excludes on purpose. **Never commit that folder** — one push would
undo every blur on the site.

---

## Why there is no animation library here

The main portfolio uses Framer Motion, and on a throttled phone its mount
cost is most of the page's blocking time. This page is opened from an
Instagram bio, on mobile data, and it exists to be read in thirty seconds —
so the reveals are one shared `IntersectionObserver` plus a CSS transition
(`src/lib/reveal.ts`, `.reveal` in `src/styles/index.css`).

The result is **164 KB of JavaScript against the portfolio's 382 KB.**

`prefers-reduced-motion` is honoured: content still appears, it simply
arrives already in place.

### One thing that observer has to get right

An `IntersectionObserver` reports what is intersecting when it happens to
check, so an element can be skipped by a fast flick, a jump to an anchor, or
the browser restoring a scroll position — and a skipped `.reveal` stays at
`opacity: 0` for the rest of the visit. `sweep()` in `reveal.ts` exists for
exactly that, and `npm run audit` fails if any reveal does not fire.

---

## Deploying

Live on Vercel, from `main` of this repository, as its **own** project — it is
a separate site, not a route on the portfolio.

Framework preset **Vite**, build `npm run build`, output `dist`, root `./`, and
no environment variables at all. `vercel.json` rewrites everything to
`index.html`, which is what lets `/ar`, `/story` and `/ar/story` survive a hard
refresh; Vercel checks the filesystem first, so real files are still served as
files.

### The origin is written down twice

`ORIGIN` in `src/lib/url.ts` and the absolute urls in `index.html` both name
the production host, and **a scraper only ever reads the ones in `index.html`**
— it does not run the app. They have to agree, and the host has to be one that
answers: a canonical pointing at a domain with no DNS record tells a search
engine not to index the page it is reading, and an `og:image` on a dead host
gives a blank card on WhatsApp. Change both together, in one commit.

---

## Ground rules for the content

Same as the portfolio, and not negotiable:

- Never invent, inflate or recalculate a number.
- Every published figure carries its source and its period.
- Sales are sales. Never profit; messaging conversations are never orders.
- He is not a developer and not a generic media buyer.
- Google Ads is something he is **expanding into**, not expertise he claims.
  The copy says so and must keep saying so.
