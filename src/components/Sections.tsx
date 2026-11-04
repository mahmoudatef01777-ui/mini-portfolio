import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link, useRoute } from '@/lib/router';
import { EvidenceViewer, useEvidenceViewer } from './Evidence';
import { evidence, notAResult, proofUi, resultCards, sourceLabel } from '@/content/proof';
import { story } from '@/content/story';
import {
  about,
  ads,
  closing,
  contact,
  cta,
  fullStory,
  growth,
  hero,
  results,
} from '@/content/content';
import { Button, Monogram, Reveal, SectionHead, Stagger } from './ui';
import { useCardIntro, useSplitHeadline } from '@/lib/reveal';
import Carousel from './Carousel';
import AboutPortrait from './AboutPortrait';

/* ------------------------------------------------------------------ hero */

/**
 * The photograph carries no entrance animation on purpose: it is the largest
 * thing on the first screen, which makes it the LCP element, and an image
 * that fades up from zero does not count as painted until the fade ends.
 */
export function Hero() {
  const { t, lang } = useLang();
  const headline = t(hero.headline).replace(/\.$/, '');
  /* The one headline that arrives a word at a time. `lang` is the key, so
     switching language re-splits against the new sentence instead of
     animating the spans of the one that just left. */
  const headlineRef = useSplitHeadline<HTMLHeadingElement>(lang);

  return (
    <section className="pb-14 md:pb-20">
      {/* THE PHOTOGRAPH COMES FIRST, and carries no entrance animation.
          Mahmoud's call: a visitor arriving from an Instagram bio should meet
          the picture before the sentence. It is also the largest thing on the
          first screen, which makes it the LCP element — and an image that
          fades up from zero does not count as painted until the fade ends.

          FULL BLEED since 2026-09-17: it sits outside `container-page` and
          carries no corner radius, so it runs edge to edge on a phone and on a
          laptop instead of sitting in a boxed frame. Only the copy below it is
          in the container.

          <picture> WITH `media` QUERIES, not a plain srcset. The three files
          are different SHAPES — 1080x1440 upright for the phone, 1600x1067
          for the tablet, 2000x1125 for the laptop — and the CSS reserves the
          matching ratio at the same two breakpoints. A srcset would let the
          browser pick the wide file for a narrow high-DPR screen, which would
          then be cropped into the upright box. The media queries keep the
          file and the reserved box in step, and that is what keeps CLS at
          zero. Change one and change the other.

          WHY THREE AND NOT TWO. The ratio that fills a phone is 843px tall on
          a 1280 laptop — the entire first screen is the photograph and the
          headline is below the fold. The wider the screen, the shallower the
          band. `max-h-[78svh]` then catches the case the ratios cannot: a
          wide, short window, where even 16:9 would be taller than the screen.
          `svh`, not `vh`, so a phone's collapsing address bar does not resize
          the hero mid-scroll. */}
      <picture>
        {/* AVIF first at each width, then the WebP the <img> falls back to.
            A browser picks the first <source> it can decode, so the order is
            the whole mechanism. */}
        <source media="(min-width: 1280px)" srcSet={hero.photo.wideAvif} type="image/avif" width={2000} height={1125} />
        <source media="(min-width: 1280px)" srcSet={hero.photo.wide} width={2000} height={1125} />
        <source media="(min-width: 768px)" srcSet={hero.photo.tabletAvif} type="image/avif" width={1600} height={1067} />
        <source media="(min-width: 768px)" srcSet={hero.photo.tablet} width={1600} height={1067} />
        <source srcSet={hero.photo.srcAvif} type="image/avif" width={1080} height={1440} />
        <img
          src={hero.photo.src}
          sizes="100vw"
          alt={t(hero.photo.alt)}
          width={hero.photo.width}
          height={hero.photo.height}
          decoding="async"
          // React 18 does not map camelCase `fetchPriority` to the DOM
          // attribute and warns about it; spread emits the real lowercase
          // one. React 19 handles the camelCase spelling directly.
          {...{ fetchpriority: 'high' }}
          className="block max-h-[78svh] w-full object-cover object-top [aspect-ratio:1080/1440] md:[aspect-ratio:1600/1067] xl:[aspect-ratio:2000/1125]"
        />
      </picture>

      <div className="container-page">
      <Reveal className="mt-10 md:mt-14">
        <p className="label eyebrow">{t(hero.eyebrow)}</p>
      </Reveal>

      {/* No <Reveal> on this one: it has its own entrance, and a fade on
          the wrapper would run against the word stagger inside it. */}
      <h1
        ref={headlineRef}
        key={lang}
        className="display mt-6 max-w-[15ch] text-balance text-[calc(clamp(2.125rem,7vw,4.25rem)*var(--display-scale))] text-ink md:mt-8"
      >
        {headline}
        <span className="text-orange-ink">.</span>
      </h1>

      <Reveal delay={0.12}>
        <p className="lede mt-6 max-w-[46ch] md:mt-8">{t(hero.subline)}</p>
      </Reveal>

      <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-3 md:mt-10">
        <Button href={contact.whatsapp.href} tone="whatsapp">
          {t(contact.whatsapp.label)}
        </Button>
        <Link
          to="story"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 ease-out hover:border-ink md:text-base"
        >
          {t(fullStory.cta)}
        </Link>
      </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- about */

export function About() {
  const { t, isRTL } = useLang();
  return (
    <section id="main" className="border-t border-line">
      {/* Two columns from `lg` up — the words, and the portrait that used to
          be empty space beside them. Below `lg` the portrait does not render
          at all, so this is a single column exactly as it was. */}
      <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14 xl:gap-16">
        <div>
        <SectionHead label={about.label} />
        {/* The opening is the claim; it carries the weight. */}
        <Reveal delay={0.06}>
          <p className="display mt-7 max-w-[34ch] text-[calc(clamp(1.25rem,3.2vw,1.875rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink">
            {t(about.lead)}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-7 max-w-[56ch] space-y-5">
            {t(about.body).map((paragraph) => (
              <p key={paragraph} className="text-[1.0625rem] leading-[1.8] text-ink-dim md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-9 max-w-[52ch] text-[0.9375rem] font-medium leading-relaxed text-ink md:text-base">
            {t(about.chainLead)}
          </p>
        </Reveal>

        {/*
          The chain, drawn rather than typed. The arrow is an element the
          component owns and rotates with the reading direction, so it points
          FORWARD in Arabic and in English. Typed into the sentence it would be
          a neutral character between two runs, and bidi would turn it around.
        */}
        <Reveal delay={0.18}>
          <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
            {about.chain.map((step, i) => (
              <li key={step.en} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className={cn('text-orange-ink', isRTL && 'rotate-180')}>
                    →
                  </span>
                )}
                <span className="rounded-full border border-line bg-soft px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink md:text-sm">
                  {t(step)}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
        </div>

        <Reveal delay={0.12}>
          <AboutPortrait />
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- results */

/**
 * NUMBER -> REAL SCREENSHOT -> CONTEXT, and the rest of the evidence one tap
 * away.
 *
 * Three aggregate figures open the section. Under them is a card per funded
 * case, each carrying its own headline figure, the facts behind it with their
 * source and period, and the capture that figure was read from. Everything
 * else — the full library in `content/proof.ts` — sits behind "شوف الدليل"
 * rather than on the page, because a landing opened from an Instagram bio
 * cannot be a dashboard and still be read in a minute.
 *
 * NO CLIENT LOGOS in this section, on Mahmoud's instruction. A row of marks
 * turns proof into a carousel; the proof here is the figure, its context and
 * its screenshot.
 *
 * An approximate or business-reported figure carries a visible chip. It never
 * sits unmarked beside a dashboard read — that is the difference between this
 * section and a claim.
 */
/**
 * ONE CARD PER CAPTURE, not one card per client.
 *
 * The rail used to carry five cards, one a brand, each hiding five or six
 * dashboards behind a button nobody pressed. Mahmoud asked for the opposite:
 * every screen that carries a result is its own card, and every card says
 * underneath it what it is. So this flattens the five galleries into the
 * captures themselves, in the order the cards were in.
 *
 * THE FIGURES DO NOT GET LOST IN THE FLATTENING. A brand's headline and its
 * four facts belong to ONE of its captures — the `cover`, which is the shot
 * they were read off — so they ride on that capture's card and on no other.
 * A supporting capture carries its caption and nothing else, because
 * attaching a figure to a screen it cannot be read from is the one thing
 * this whole section exists not to do.
 *
 * Deduplicated: a capture that appears in two galleries is still one screen.
 */
function resultShots() {
  const seen = new Set<string>();

  return resultCards.flatMap((card) => {
    // A reported figure is not a dashboard reading, so the whole card goes.
    if (card.soft) return [];

    return card.gallery.flatMap((id) => {
      // Still in the gallery and still in the viewer — just not a result.
      if (seen.has(id) || notAResult.includes(id)) return [];
      seen.add(id);
      return [{ card, shot: evidence[id], lead: id === card.cover }];
    });
  });
}

/**
 * THE WHOLE PROOF, IN ONE SECTION.
 *
 * There were two rails four sections apart — the stores and the ERP here,
 * the Ads Manager captures further down — and they drew from the same
 * library, so four screens appeared on both. Mahmoud asked for one carousel,
 * and one is also the honest shape: every card is the same thing, a reading
 * off a dashboard, and splitting them by which tool took the screenshot was
 * a distinction the reader was never making.
 */
export function Results() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();

  const cards = resultShots();

  return (
    <section className="border-t border-line bg-soft">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={results.label} title={results.title} />

        {/* Two now, not three — the "~6 months" figure came off on
            2026-11-04. The column count follows the content. */}
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12">
          {results.stats.map((stat, i) => (
            <Reveal key={stat.id} delay={0.06 * (i + 1)}>
              <div className="border-t border-ink/15 pt-4">
                <dt className="display text-[calc(clamp(1.75rem,5.5vw,2.75rem)*var(--display-scale))] leading-none text-ink">
                  {/* The figure is isolated from the Arabic around it; the unit
                      sits OUTSIDE that isolate or bidi drags it to the wrong
                      side of the number. */}
                  {/* No unit branch any more: the only stat that carried one
                      was "~6 months", and it is gone. If a unit comes back,
                      it goes in its own span OUTSIDE this isolate — inside
                      it, bidi drags the word to the wrong side of the
                      number and "~6 شهور" renders as "شهور 6~". */}
                  <span className="num">{stat.value}</span>
                </dt>
                <dd className="mt-3 text-sm font-medium text-ink md:text-base">{t(stat.label)}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.2} className="mt-14 md:mt-16">
          <p className="label eyebrow">{t(proofUi.resultsLabel)}</p>
          <p className="lede mt-4 max-w-[50ch]">{t(proofUi.resultsIntro)}</p>
        </Reveal>

        {/*
          NO BLOCK OF FIGURES ABOVE THE RAIL. There was one, briefly, on
          2026-11-04 — three columns carrying the headline figure and the
          four facts for each brand — and Mahmoud took all three off the
          same afternoon. The figures live where they are checkable: on the
          dashboards in the rail below, which is the whole argument of this
          section. The two figures that stay at the top of the section are
          the career totals, not a brand's.
        */}
        <Reveal delay={0.24} className="mt-8">
          <Carousel
            label={t(proofUi.resultsLabel)}
            /* 23rem on a laptop and as close to it as a phone allows. The
               90vw cap is what keeps a sliver of the next card showing at
               375px — without it the card fills the screen edge to edge and
               stops looking like something you can swipe. */
            itemClassName="w-[min(90vw,23rem)]"
          >
            {cards.map(({ shot }) => (
              <article
                key={shot.id}
                className="flex h-full w-full flex-col overflow-hidden rounded-media border border-line bg-cream"
              >
                {/*
                  THE CAPTURE IS THE CARD, so it opens the untouched file at
                  full size rather than sitting there as decoration.

                  `object-contain`, and that is not a style preference: every
                  capture here is a wide table — up to four to one — and
                  cropping one to a card-shaped box throws away columns. The
                  reader would be looking at a dashboard with its figures cut
                  out of it. Letterboxed, the whole table is there.
                */}
                <button
                  type="button"
                  onClick={() => viewer.open([shot], 0)}
                  aria-label={`${t(proofUi.viewEvidence)} — ${t(shot.caption)}`}
                  className="flex h-44 w-full shrink-0 items-center justify-center border-b border-line bg-soft p-3 transition-opacity duration-300 hover:opacity-90"
                >
                  <img
                    src={shot.src}
                    alt={t(shot.alt)}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                </button>

                <div className="flex flex-1 flex-col p-5">
                  {/* Which tool the screen is from — the first thing that
                      makes a screenshot checkable. */}
                  <span className="self-start rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium text-ink-dim">
                    {t(sourceLabel[shot.source])}
                  </span>

                  {/*
                    THE LINE THAT SAYS WHAT THE SCREEN IS. It is the capture's
                    own caption — the same sentence the evidence viewer prints
                    under the full-size image — so the explanation on the card
                    and the explanation on the evidence can never drift apart.
                    `mt-auto` holds it to the bottom, which lines the captions
                    up across the rail even when one of them runs long.
                  */}
                  <p className="mt-auto pt-4 text-xs leading-relaxed text-ink-dim">
                    {t(shot.caption)}
                  </p>
                </div>
              </article>
            ))}
          </Carousel>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(results.note)}
          </p>
          {/* Came down from the Ads Manager section when the two rails
              became one. It is about how to read a capture's date range,
              which is now true of every card on the rail. */}
          <p className="mt-4 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(ads.note)}
          </p>
        </Reveal>
      </div>

      <EvidenceViewer
        state={viewer.state}
        onClose={viewer.close}
        onIndex={(index) => viewer.setState((current) => (current ? { ...current, index } : current))}
      />
    </section>
  );
}

/* ------------------------------------------------------------- help with */

/**
 * The order he works in, as four numbered stages. Not a services grid — the
 * platforms sit inside stage three, where they belong.
 */
/**
 * One stage of the framework, and the smallest component on this page with
 * a ref of its own — which is the point: a hook cannot be called inside a
 * `.map()`, so each card has to BE a component to animate independently.
 *
 * The `data-` attributes are what the timeline in `useCardIntro` reaches
 * for. They are not styling hooks; do not reuse them.
 */
function GrowthBlock({ block }: { block: (typeof growth.blocks)[number] }) {
  const { t, isRTL } = useLang();
  const ref = useCardIntro<HTMLLIElement>(isRTL);

  return (
    <li ref={ref}>
      {/* A <span> rather than a `border-t`, because a border cannot be
          scaled on its own — the rule has to be an element to draw. */}
      <span data-rule aria-hidden className="block h-px w-full bg-ink/15" />

      <div className="pt-5">
        <div className="flex items-baseline gap-3">
          <span data-num className="display num text-sm text-orange-ink">
            {block.n}
          </span>
          <h3 data-head className="display text-[1.125rem] text-ink md:text-xl">
            {t(block.name)}
          </h3>
        </div>

        <p
          data-lead
          className="mt-3 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-ink-dim md:text-base"
        >
          {t(block.lead)}
        </p>

        <ul className="mt-4 space-y-2">
          {block.points.map((point) => (
            <li
              key={point.en}
              data-point
              className="flex items-start gap-2.5 text-[0.875rem] text-ink md:text-[0.9375rem]"
            >
              <span aria-hidden className="mt-[0.5em] block h-1 w-1 shrink-0 rounded-full bg-orange" />
              {t(point)}
            </li>
          ))}
        </ul>

        {/* Not every block has one. Where it does, it is the point the list
            was building to, so it is set apart from the bullets. */}
        {'close' in block && block.close && (
          <p
            data-point
            className="mt-4 max-w-[46ch] border-s-2 border-orange ps-3.5 text-[0.8125rem] leading-relaxed text-ink-dim md:text-[0.875rem]"
          >
            {t(block.close)}
          </p>
        )}
      </div>
    </li>
  );
}

export function Growth() {
  const { t } = useLang();

  return (
    <section className="border-t border-line bg-soft">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={growth.label} title={growth.title} />
        <Reveal delay={0.06}>
          <p className="lede mt-5 max-w-[52ch]">{t(growth.intro)}</p>
        </Reveal>

        {/* Six blocks, two across from `md` up — the same card shape the four
            stages used, so the section reads as a longer version of what was
            here rather than as a different page. */}
        {/* Each card assembles itself on its own trigger — see GrowthBlock
            below and `useCardIntro` in lib/reveal.ts. */}
        <ol className="mt-10 grid gap-x-10 gap-y-10 md:mt-14 md:grid-cols-2">
          {growth.blocks.map((block) => (
            <GrowthBlock key={block.id} block={block} />
          ))}
        </ol>

        {/*
          THE DECISION, FULL WIDTH AND VERTICAL.

          The arrow here is "↓", and it is the one arrow on the site that needs
          no direction flip: down means down in Arabic and in English. The
          horizontal chains elsewhere have to rotate; this one must not.
        */}
        <Reveal delay={0.08} className="mt-14 md:mt-20">
          <div className="max-w-[34rem] rounded-media border border-line bg-cream p-6 md:p-8">
            <p className="display text-[calc(clamp(1.0625rem,2.8vw,1.375rem)*var(--display-scale))] text-ink">
              {t(growth.decision.title)}
            </p>

            <Stagger as="ol" each={0.09} className="mt-6 space-y-1">
              {growth.decision.steps.map((step, i) => (
                <li key={step.en}>
                  {i > 0 && (
                    <span aria-hidden className="block py-1 text-sm leading-none text-orange-ink">
                      ↓
                    </span>
                  )}
                  <span className="block text-[0.9375rem] leading-relaxed text-ink md:text-base">
                    {t(step)}
                  </span>
                </li>
              ))}
            </Stagger>
          </div>
        </Reveal>

        {/* The conclusion of the whole framework. */}
        <Reveal delay={0.12}>
          <p className="display mt-12 max-w-[32ch] text-[calc(clamp(1.25rem,4vw,2rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink md:mt-16">
            {t(growth.statement)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ full story */

/** The one deliberate exit on the page. */
export function FullStory() {
  const { t, isRTL } = useLang();
  return (
    <section className="border-t border-line bg-soft">
      <div className="container-page py-16 md:py-20">
        <SectionHead label={fullStory.label} title={fullStory.title} />
        <Reveal delay={0.06}>
          <p className="lede mt-5 max-w-[52ch]">{t(fullStory.body)}</p>
        </Reveal>
        <Reveal delay={0.12} className="mt-8">
          <Link
            to="story"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-colors duration-300 ease-out hover:bg-orange hover:text-on-orange md:text-base"
          >
            {t(fullStory.cta)}
            <span aria-hidden className={isRTL ? 'rotate-180' : undefined}>
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */

export function Closing() {
  const { t } = useLang();
  return (
    <section className="border-t border-line">
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <p className="display max-w-[24ch] text-[calc(clamp(1.75rem,5vw,3rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink">
            {t(closing.lead)}
            <br />
            <span className="text-ink-dim">{t(closing.body)}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

/** The dark call, which is also the footer. */
export function Contact() {
  const { t } = useLang();
  const { route } = useRoute();
  return (
    <footer className="bg-black text-on-dark">
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <p className="label eyebrow text-on-dark/70">{t(cta.label)}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="display mt-6 max-w-[16ch] text-[calc(clamp(1.875rem,6vw,3.25rem)*var(--display-scale))] text-on-dark">
            {t(cta.title)}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[50ch] text-[1.0625rem] leading-[1.7] text-on-dark/75 md:text-lg">
            {t(cta.body)}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={contact.whatsapp.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2.5 rounded-full bg-on-dark px-6 py-3.5 text-sm font-semibold text-black transition-colors duration-300 ease-out hover:bg-[#25D366] md:text-base"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
            </svg>
            {t(contact.whatsapp.label)}
          </a>

          <a
            href={contact.linkedin.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2.5 rounded-full border border-on-dark/25 px-6 py-3.5 text-sm font-semibold text-on-dark transition-colors duration-300 ease-out hover:border-[#0A66C2] md:text-base"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden className="transition-colors duration-300 group-hover:text-[#0A66C2]">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {t(contact.linkedin.label)}
          </a>
        </Reveal>

        <Reveal delay={0.24}>
          <a
            href={contact.email.href}
            className="mt-7 inline-block text-sm text-on-dark/70 underline-offset-4 transition-colors hover:text-on-dark hover:underline"
          >
            {contact.email.display}
          </a>
        </Reveal>

        <div className="mt-14 flex flex-col gap-5 border-t border-on-dark/15 pt-7 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2.5 text-xs text-on-dark/60">
            <Monogram className="h-3.5" />
            mahmoudelzaqla
          </p>
          {/* On the story page this link would point at the page the reader is
              already on, so it turns around and offers the way back instead. */}
          <Link
            to={route === 'story' ? 'home' : 'story'}
            className="text-xs text-on-dark/70 underline-offset-4 transition-colors hover:text-on-dark hover:underline"
          >
            {t(route === 'story' ? story.back : fullStory.cta)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
