# Mahmoud Atef — landing page (Site 2)

The one-page personal site for the Instagram bio. Bilingual, Arabic default,
right-to-left; English at `/en`.

**This is not the portfolio.** The full portfolio — projects, case studies,
evidence — is a separate project in `../site`, and stays there. This page
carries no projects, no case studies and no project cards; it links out to
them instead.

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

**http://localhost:5174** for Arabic, **http://localhost:5174/en** for English.

Port 5174 on purpose, so this runs at the same time as the main portfolio on
5173.

| command | what it does |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | typecheck, then build into `dist/` |
| `npm run preview` | serve the built `dist/` |
| `npm run audit` | both languages × 9 widths × 2 themes: console errors, overflow, images, headings, labels, reveals |

The audit needs the preview running:

```bash
npm run preview -- --port 4180
```

```bash
npm run audit -- --url=http://localhost:4180
```

---

## Editing it

**Every word on this site is in one file:** `src/content/content.ts`.

Text, figures, the WhatsApp number, the LinkedIn url, the list of websites,
the six things you can help with — all of it. Each entry is written twice,
`ar` and `en`. Change both.

That file also holds **`PORTFOLIO_URL`**, which every "read the full story"
button points at. **Set it once the main portfolio has its domain** — until
then every one of those buttons goes to the assumed address.

| I want to change… | Where |
| --- | --- |
| Any text at all | `src/content/content.ts` |
| The order of the sections | `src/App.tsx` |
| How a section looks | `src/components/Sections.tsx` |
| The header, toggles | `src/components/Header.tsx` |
| Colours | `src/styles/tokens.css` |
| Fonts | `src/styles/fonts.css` + the `<link>` in `index.html` |
| Images | `public/img/` |

### Images

`public/img/` holds only what this page uses:

```
portrait.webp          the cut-out
hero-mobile.webp       the hero photograph, phone
hero-desktop.webp      the hero photograph, wide
site-*.webp            one screenshot per website in the "websites" section
```

They are copies. Changing one here does **not** change the main portfolio,
and changing one there does not change this — deliberately, so the two sites
cannot break each other.

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

Not deployed yet. When it is: Vercel, framework preset **Vite**, build
`npm run build`, output `dist`, no environment variables. `vercel.json`
rewrites to `index.html` so `/en` resolves on a hard refresh.

It needs **its own Vercel project and its own domain or subdomain** — it is a
separate site, not a route on the portfolio.

---

## Ground rules for the content

Same as the portfolio, and not negotiable:

- Never invent, inflate or recalculate a number.
- Every published figure carries its source and its period.
- Sales are sales. Never profit; messaging conversations are never orders.
- He is not a developer and not a generic media buyer.
- Google Ads is something he is **expanding into**, not expertise he claims.
  The copy says so and must keep saying so.
