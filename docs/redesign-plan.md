# Redesign plan — Mahmoud Elzaqla portfolio

Phase 1 (analysis) is done. This file is the hand-off to Phase 2 (design + code).
Reference: Dribbble "Videaste" (Adhiari Subekti). Read it as a *language*, not a layout to copy.

## What the reference actually does (observed, not remembered)

- Display type is a heavy grotesque, set enormous and tight, on a near-white field. The
  headline is the composition: two stacked lines taller than the portrait beside them.
- The portrait sits in a **rounded-square card** (~2.5rem radius) on a saturated tint, and
  it **overlaps the headline** instead of sitting next to it.
- Small round **dark icon buttons** (globe, arrow) pinned to card corners.
- A pair of **avatar chips with an arrow button** — a "more" affordance, not decoration.
- A **stats row** under the headline: big figure, one-line caption, two of them.
- Black panels with **crosshair marks** at the corners; **bento** image grid in squircles.
- A hand-drawn signature accent over the type.
- Tiny, quiet navigation: the type does the talking.

## HERO DIRECTION — supersedes the Videaste hero (Mahmoud, "Matthew" shot)

Reference: Dribbble "Matthew - Personal Portfolio Website Animation" (Muhammad Aseif). What it does:

- The NAME is the headline: one ultra-condensed black grotesque word-pair, edge to edge,
  taller than the viewport's lower half.
- The portrait is a **transparent cut-out standing IN FRONT of the type** — head above the
  letters, shoulders and body covering part of them. Depth is the whole effect.
- Rounded white nav pill on top. A role label ("Freelance Designer & Developer") top-left.
- A circular outlined "GET IN TOUCH" button with arc lines. Dotted rules. "Scroll down ↓".

How it maps here:

| Reference | This site |
|---|---|
| Light grey field, black type | Dark default: near-white type on `#0A0A0A`. Light theme: ink type on `#FAFAFA` |
| Circular outlined button | A lime SLAB circle with near-black text — the one place the raw lime is allowed |
| Giant name | H1 stays the name (it is what people search); the existing statement becomes the line under it |
| Role label | "E-commerce Growth Specialist · Egypt" (the live role) |

Layering: type (z0) → cut-out portrait (z1) → a second clipped copy of the lower letters
(z2) only if the body must cover them; GSAP parallax between layers at different rates;
the name enters by letter in Latin and by WORD in Arabic (cursive).

**Resolved (2026-11-11):**

1. The cut-out exists. Mahmoud supplied the striped-polo shot on a clean white ground
   (`C:\1\Progects\portfolio\personal\Smiling Young Man in Striped Polo.png`, 1334x1179, RGB).
   It was cut out locally with PIL: flood-fill of the white from the border, then a soft,
   de-fringed band on the silhouette. No model, no download, nothing uploaded. Only the
   background changes; every subject pixel is an original pixel.
   Master: `C:\1\مخرجات كلود\محمود عاطف\صور\محمود-مقصوص-شفاف.png`, with `cutout.py` beside it.
   Known to tidy at implementation: a few isolated light strands at the top right and a faint light
   rim on the left curls, both visible only on the dark theme. The torso is cropped at the bottom
   edge and the shoulders reach both sides, so it must bleed off the bottom of the hero.
2. The giant type is **MAHMOUD ELZAQLA** (the domain and the tab).
   **Still open:** the exact Arabic spelling to set on `/ar`.

Arabic has no ultra-condensed black equivalent, so the effect is kept (layered, edge to edge)
and the face is a heavy Kufi-style display (Lalezar / Cairo 900) tested at 375 and 1440.

## Non-negotiables (carry over unchanged)

| What | Why |
|---|---|
| Palette: `#CCFF00` lime, `#0A0A0A` ink, `#FAFAFA`, neutral greys. Tokens in `src/styles/tokens.css` | "Preserve exact brand colours." It is Akai's sampled palette; 17 pairs verified AA |
| **The lime rule**: raw lime only as a SLAB with near-black on it, or as text/marks on DARK. On light, marks use `--c-orange-ink` | 1.13:1 on light — a lime dot or rule there does not exist |
| Default **English + dark**; AR/EN and dark/light switches working; real RTL | brief |
| Routes `/ /ar /story /ar/story`; four prerendered static pages (`scripts/prerender.mjs`) | the site was 0 visible chars to non-JS crawlers before; do not regress it |
| CSP in `vercel.json` (no inline handlers; inline scripts are hashed — rerun `make_headers` after touching them) | an inline `onload` silently stopped the fonts once |
| Evidence rules: results = dashboard e-commerce only (Shopify, Odoo ERP, Meta, TikTok); no messaging, no reach, no reported figures | Mahmoud's rule, 2026-11-04 |
| His own Arabic ("who I am" lead + body) is not edited | the code says so; it is his words |
| "Following production", never "Production" alone | he followed production, he did not run it |
| Never: web developer, manufacturer, Google Ads expert (he is "expanding into" it), invented clients/testimonials/numbers | standing rules |
| Animate Arabic by WORD, never by character | cursive: per-char spans break the joins |
| Every tween inside `gsap.matchMedia()` for reduced motion; `fromTo` with both ends written; never `opacity:0` in CSS | the page used to ship invisible |

## Section map — requested 9 vs what actually exists

| # | Requested | Source that exists today | Gap / decision |
|---|---|---|---|
| 1 | Hero | headline, subline, eyebrow (role · Egypt), WhatsApp + story CTAs, 3 portrait crops, counters (25,000+ / EGP 10M+) | The reference's stats row *is* the counters — move them into the hero |
| 2 | About | `about.lead/body`, the 6-step chain, circular portrait with the Shopify mark orbiting | Keep the orbit; restage |
| 3 | Services & Expertise | **No services list exists.** Closest: the 6 "how I think" blocks | Build 5 cards from facts already on the site: Shopify stores · Meta Ads · TikTok Ads · Conversion & store experience · Operations. No new claims |
| 4 | Projects / Case studies | Bloomy (own brand), Cove (organic), Veloura (live, early) + their dashboard captures | Three real cases. Veloura stays labelled early. Optional lead: Bloomy returns ~50% → ~30% (verified in about-me, **not on the site yet — needs Mahmoud's OK**) |
| 5 | Results & Achievements | counters + the 12-capture rail | Keep the rail as the evidence strip |
| 6 | My Process | the chain, the "before I say scale" steps, and the 6-stage story | Stage chips (lime on near-black) are the signature |
| 7 | Testimonials (existing only) | **None exist** (grepped) | **Do not build.** Ship nothing rather than a placeholder |
| 8 | Contact | closing CTA, WhatsApp, LinkedIn, email | |
| 9 | Footer | existing | |

## Decisions to take, with a recommendation

1. **Title.** Brief says "Digital Marketing Specialist & E-commerce Growth Strategist"; the live role is
   "E-commerce Growth Specialist" and the SEO pass was built around it. *Keep the live role.*
2. **Smooth scroll (Lenis).** *Skip.* It hijacks the scrollbar, fights the scroll-driven counters and
   the story snap, and breaks reduced-motion. Native scroll + GSAP covers every effect asked for.
3. **Display face.** The reference wants a heavy grotesque; the current Libre Bodoni is a didone.
   *Candidate:* Archivo (variable weight + width) for Latin, a heavy Arabic grotesque (Cairo 800+)
   for Arabic, Libre Bodoni Italic kept only for the signature accent. Decide by rendering both
   scripts at 375 / 1440, not on paper — Arabic display scale needs re-tuning (see `fonts.css`).
4. **Safety.** Work on branch `redesign`; Vercel builds a preview URL. Merge to `main` only after Mahmoud
   has opened the preview. A full redesign should not land straight on the live domain.

## Build order (each step: render, screenshot at 375/390/768/1024/1440 × EN/AR × dark/light, audit)

0. Foundations — type, spacing scale, squircle/chip/round-button/crosshair primitives, motion kit
   (image clip reveal, headline-by-word, parallax, magnetic button — all reduced-motion-safe)
1. Header + Hero (portrait card overlapping the headline, counters as the stats row)
2. About
3. Services
4. Projects (interactive cards)
5. Results
6. Process
7. Contact + footer
8. QA: `npm run audit` (add 390/1024 if missing — it already sweeps 320…1920), `check-prerender`,
   Lighthouse, bundle ≤ ~135 KB gz JS, CLS 0, LCP image preloaded, no horizontal scroll anywhere

## Budgets

- JS gzip ≤ ~135 KB (now 120.6). ScrollTrigger/SplitText already in; add nothing heavy.
- Images AVIF + WebP fallback, explicit width/height, lazy below the fold, hero preloaded per breakpoint.
- Keep `npm run build` fail-safe: prerender must never break the deploy.

## Status (2026-11-11)

Built on branch `redesign`: Matthew-style hero (name fitted with the width axis so both words match
and his head sits in the gap; stacked above the head below `lg`), About, Services (5, from existing
facts), Selected work (Bloomy, Cove, Veloura: non-soft cards only, notAResult captures excluded from
their galleries), Results (counters + rail), Process (the six approved growth blocks), Statement
(scroll-lit), Contact/footer. No Testimonials section: none exist. Display face is now Archivo
(variable wdth/wght) with IBM Plex Sans Arabic 700 for Arabic display; Amiri and Libre Bodoni dropped.
The giant name stays Latin on `/ar` until Mahmoud confirms the Arabic spelling.
Checks: tsc, build, prerender (4 routes), check-prerender under CSP, `npm run audit` 4x9x2 clean.
JS 126 KB gz.
