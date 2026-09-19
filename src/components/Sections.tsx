import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link, useRoute } from '@/lib/router';
import { EvidenceButton, EvidenceViewer, useEvidenceViewer } from './Evidence';
import { adsLibrary, evidence, messaging, proofUi, resultCards, shots } from '@/content/proof';
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
  sites,
} from '@/content/content';
import { Button, Monogram, Reveal, SectionHead } from './ui';
import StoreDemo from './StoreDemo';
import AboutPortrait from './AboutPortrait';

/* ------------------------------------------------------------------ hero */

/**
 * The photograph carries no entrance animation on purpose: it is the largest
 * thing on the first screen, which makes it the LCP element, and an image
 * that fades up from zero does not count as painted until the fade ends.
 */
export function Hero() {
  const { t } = useLang();
  const headline = t(hero.headline).replace(/\.$/, '');

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

          <picture> WITH A `media` QUERY, not a plain srcset. The two files are
          different SHAPES — 1080x1350 upright for the phone, 1672x941 wide for
          the laptop — and the CSS reserves the matching ratio at the same
          768px line. A srcset would let the browser pick the wide file for a
          narrow high-DPR screen, which would then be cropped into the upright
          box. The media query keeps the file and the reserved box in step, and
          that is what keeps CLS at zero. */}
      <picture>
        <source media="(min-width: 768px)" srcSet={hero.photo.wide} width={1536} height={1024} />
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
          className="block w-full object-cover [aspect-ratio:941/1672] md:[aspect-ratio:1536/1024]"
        />
      </picture>

      <div className="container-page">
      <Reveal className="mt-10 md:mt-14">
        <p className="label eyebrow">{t(hero.eyebrow)}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="display mt-6 max-w-[15ch] text-balance text-[calc(clamp(2.125rem,7vw,4.25rem)*var(--display-scale))] text-ink md:mt-8">
          {headline}
          <span className="text-orange">.</span>
        </h1>
      </Reveal>

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
                  <span aria-hidden className={cn('text-orange', isRTL && 'rotate-180')}>
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
export function Results() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();

  return (
    <section className="border-t border-line bg-soft">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={results.label} title={results.title} />

        <dl className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-12">
          {results.stats.map((stat, i) => (
            <Reveal key={stat.id} delay={0.06 * (i + 1)}>
              <div className="border-t border-ink/15 pt-4">
                <dt className="display text-[calc(clamp(1.75rem,5.5vw,2.75rem)*var(--display-scale))] leading-none text-ink">
                  {/* The figure is isolated from the Arabic around it; the unit
                      sits OUTSIDE that isolate or bidi drags it to the wrong
                      side of the number. */}
                  <span className="num">{stat.value}</span>
                  {'unit' in stat && stat.unit && (
                    <span className="ms-1.5 text-[0.5em] font-medium text-ink-dim">
                      {t(stat.unit)}
                    </span>
                  )}
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

        <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resultCards.map((card, i) => {
            const cover = card.cover ? evidence[card.cover] : undefined;
            const gallery = shots(card.gallery);

            return (
              <Reveal as="li" key={card.id} delay={0.05 * (i % 2)}>
                <article className="flex h-full flex-col overflow-hidden rounded-media border border-line bg-cream">
                  <div className="p-5 md:p-6">
                    <div className="flex min-h-[1.75rem] flex-wrap items-center gap-2.5">
                      {/*
                        THE MARK STANDS IN FOR THE NAME.

                        Mahmoud does not want a client's name sitting on the
                        page as text a visitor can select, copy and search. So
                        the heading renders the brand's own logo, and the name
                        moves into the image's alt — which keeps the heading a
                        heading and keeps the card named for a screen reader
                        without printing the word.

                        It does NOT make the brand unidentifiable: the
                        dashboards below say Bloomy, Veloura, DAHAB DECOR and
                        Fkhama in their own pixels. This lowers how easy the
                        name is to lift, and that is all it does.
                      */}
                      <h3 className="flex items-center">
                        {card.logo ? (
                          <img
                            src={card.logo}
                            /* The alias, not the name: alt text is in the DOM
                               and is scrapeable, so the brand does not go in
                               it either. The card is still named for a screen
                               reader, just not with the client's name. */
                            alt={card.alias ? t(card.alias) : ''}
                            width={192}
                            height={192}
                            /* Eager: it is a 2KB mark at the top of the card
                               and it is the card's name. Deferring it leaves
                               the heading blank on a slow connection. */
                            decoding="async"
                            className="h-7 w-7 rounded-full object-contain"
                          />
                        ) : (
                          <span className="num text-sm font-semibold text-ink">{card.brand}</span>
                        )}
                      </h3>
                      {card.badge && (
                        <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-orange-ink">
                          {t(card.badge)}
                        </span>
                      )}
                      {card.status && (
                        <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium text-ink-dim">
                          {t(card.status)}
                        </span>
                      )}
                      {card.soft && (
                        <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium text-ink-dim">
                          {t(proofUi.softLabel)}
                        </span>
                      )}
                    </div>

                    <p className="display mt-4 text-[calc(clamp(1.625rem,4.6vw,2.25rem)*var(--display-scale))] leading-none text-ink">
                      <span className="num">{card.value}</span>
                    </p>
                    {/*
                      EVERY BAND ON THIS CARD RESERVES ITS TALLEST CASE.

                      The cards sit side by side, so a label that wraps to two
                      lines on one card and one line on the next pushes the
                      figures, the evidence and the buttons out of line all the
                      way down the row. Each `min-h` below is the height of the
                      longest copy that band carries; they are in `em` so they
                      follow the type rather than a fixed pixel size.

                      Change the copy and re-check these — a third line will
                      break the row again.
                    */}
                    <p className="mt-3 min-h-[3.25em] max-w-[32ch] text-sm font-medium leading-relaxed text-ink md:text-base">
                      {t(card.label)}
                    </p>
                    <p className="mt-2 min-h-[2.8em] text-xs leading-relaxed text-ink-dim">
                      {t(card.source)}
                    </p>

                    <p className="mt-4 min-h-[4.9em] border-t border-line pt-4 text-xs leading-relaxed text-ink-dim md:text-sm">
                      {t(card.did)}
                    </p>

                    <dl className="mt-4 grid min-h-[7.5rem] grid-cols-2 content-start gap-x-4 gap-y-3">
                      {card.facts.map((fact) => (
                        <div key={fact.value + t(fact.label)}>
                          <dt className="num text-base font-semibold text-ink">{fact.value}</dt>
                          <dd className="mt-0.5 text-[0.6875rem] leading-snug text-ink-dim">
                            {t(fact.label)}
                            <span className="block opacity-80">{t(fact.source)}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/*
                    The capture the headline was read from, never upscaled —
                    and only when there IS one. A card whose figures have moved
                    past every capture in the library shows none: a screenshot
                    that reports different numbers from the headline above it
                    is worse than an empty slot.
                  */}
                  {cover ? (
                  <figure className="mt-auto border-t border-line bg-soft">
                    {/* One height for every cover in the row, so the captions
                        and the buttons under them line up. `object-contain`
                        letterboxes a wide capture — it never crops it, because
                        a cropped screenshot says less than the screenshot. */}
                    <div className="flex h-36 items-center justify-center p-2.5 md:h-40">
                      <img
                        src={cover.src}
                        alt={t(cover.alt)}
                        width={cover.width}
                        height={cover.height}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </div>
                    {/*
                      ONE HEIGHT FOR THE WHOLE CAPTION BAND, set to the longest
                      caption on the page — Fakhama's, which has to spell out
                      that its figures are conversations rather than orders,
                      and Veloura's, which carries a note as well.

                      It is a min-height rather than a clamp: a caption is part
                      of the evidence, so it is never truncated to fit. If a new
                      capture needs more room, raise this — do not shorten the
                      caption.
                    */}
                    <figcaption className="min-h-[7rem] border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-dim">
                      {t(cover.caption)}
                      {card.coverNote && (
                        <span className="mt-2 block border-s-2 border-orange ps-3">
                          {t(card.coverNote)}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                  ) : (
                    <div className="mt-auto" />
                  )}

                  <div className="border-t border-line p-4">
                    <EvidenceButton
                      count={gallery.length}
                      label={t(proofUi.viewEvidence)}
                      onClick={() => viewer.open(gallery, 0)}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(results.note)}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(proofUi.softNote)}
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

/* ------------------------------------------------------------------- ads */

/**
 * A curated three from the Ads Managers, each labelled with only what the
 * capture itself shows — and a way into all of them.
 *
 * The full set is grouped the way Site 1 groups it: website purchase campaigns
 * first, messaging campaigns after. That split is not cosmetic. A messaging
 * campaign reports CONVERSATIONS, and a conversation is not an order; one
 * heading over both groups is how a reader ends up adding them together.
 */
export function Ads() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();

  const featured = shots(adsLibrary.featured);
  const all = adsLibrary.groups.flatMap((group) => shots(group.ids));

  return (
    <section className="border-t border-line">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={ads.label} title={ads.title} />

        <ul className="mt-10 space-y-5 md:mt-12">
          {featured.map((shot, i) => (
            <Reveal as="li" key={shot.id} delay={0.04 * i}>
              <figure className="overflow-hidden rounded-media border border-line bg-soft">
                <button
                  type="button"
                  onClick={() => viewer.open(all, all.findIndex((s) => s.id === shot.id))}
                  aria-label={`${t(proofUi.viewEvidence)} — ${t(shot.caption)}`}
                  className="block w-full"
                >
                  <img
                    src={shot.src}
                    alt={t(shot.alt)}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </button>
                <figcaption className="border-t border-line px-4 py-3 text-xs font-medium text-ink-dim">
                  {t(shot.caption)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.08} className="mt-8">
          <EvidenceButton
            count={all.length}
            label={t(proofUi.viewAllAds)}
            tone="dark"
            onClick={() => viewer.open(all, 0)}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
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

/* --------------------------------------------------------------- messaging */

/**
 * The message-campaign captures, lifted out of the Ads Manager list into a
 * band of their own. Same viewer, same rules — and the intro says what a
 * "messaging conversation" is before the reader sees a five-figure count and
 * reads it as orders.
 */
export function Messaging() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();
  const shown = shots(messaging.ids);

  return (
    <section className="border-t border-line bg-soft">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={messaging.label} title={messaging.title} />

        <Reveal delay={0.06}>
          <p className="lede mt-5 max-w-[54ch]">{t(messaging.intro)}</p>
        </Reveal>

        {/* The figure sits ABOVE the captures and carries its own source, so
            the reader meets the estimate and the reason it is an estimate in
            the same glance — never the number alone over a dashboard. */}
        <Reveal delay={0.1}>
          <div className="mt-9 max-w-[46ch] border-s-2 border-orange ps-5">
            <p className="display text-[calc(clamp(1.75rem,5vw,2.75rem)*var(--display-scale))] leading-none text-ink">
              <span className="num">{messaging.stat.value}</span>
            </p>
            <p className="mt-3 text-sm font-medium text-ink md:text-base">{t(messaging.stat.label)}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-dim">{t(messaging.stat.source)}</p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
          {shown.map((shot, i) => (
            <Reveal as="li" key={shot.id} delay={0.05 * i}>
              <figure className="overflow-hidden rounded-media border border-line bg-cream">
                <button
                  type="button"
                  onClick={() => viewer.open(shown, i)}
                  aria-label={`${t(proofUi.viewEvidence)} — ${t(shot.caption)}`}
                  className="block w-full"
                >
                  <img
                    src={shot.src}
                    alt={t(shot.alt)}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </button>
                <figcaption className="border-t border-line px-4 py-3 text-xs font-medium text-ink-dim">
                  {t(shot.caption)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(messaging.note)}
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
        <ol className="mt-10 grid gap-x-10 gap-y-10 md:mt-14 md:grid-cols-2">
          {growth.blocks.map((block, i) => (
            <Reveal as="li" key={block.id} delay={0.05 * (i % 2)}>
              <div className="border-t border-ink/15 pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="display num text-sm text-orange-ink">{block.n}</span>
                  <h3 className="display text-[1.125rem] text-ink md:text-xl">{t(block.name)}</h3>
                </div>

                <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-ink-dim md:text-base">
                  {t(block.lead)}
                </p>

                <ul className="mt-4 space-y-2">
                  {block.points.map((point) => (
                    <li
                      key={point.en}
                      className="flex items-start gap-2.5 text-[0.875rem] text-ink md:text-[0.9375rem]"
                    >
                      <span aria-hidden className="mt-[0.5em] block h-1 w-1 shrink-0 rounded-full bg-orange" />
                      {t(point)}
                    </li>
                  ))}
                </ul>

                {/* Not every block has one. Where it does, it is the point the
                    list was building to, so it is set apart from the bullets. */}
                {'close' in block && block.close && (
                  <p className="mt-4 max-w-[46ch] border-s-2 border-orange ps-3.5 text-[0.8125rem] leading-relaxed text-ink-dim md:text-[0.875rem]">
                    {t(block.close)}
                  </p>
                )}
              </div>
            </Reveal>
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

            <ol className="mt-6 space-y-1">
              {growth.decision.steps.map((step, i) => (
                <li key={step.en}>
                  {i > 0 && (
                    <span aria-hidden className="block py-1 text-sm leading-none text-orange">
                      ↓
                    </span>
                  )}
                  <span className="block text-[0.9375rem] leading-relaxed text-ink md:text-base">
                    {t(step)}
                  </span>
                </li>
              ))}
            </ol>
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

/* ----------------------------------------------------------------- sites */

/**
 * NOT the projects section: no figures, no role breakdown, no link inward.
 * Four live stores, each in a browser frame that opens the real thing.
 *
 * Stacked in one column rather than tiled. The phone overlaps the corner of
 * each frame, and three of those side by side on a desktop would leave every
 * frame too small to read as a storefront.
 */
export function Sites() {
  const { t } = useLang();
  return (
    <section className="border-t border-line">
      <div className="container-page py-14 md:py-20">
        <SectionHead label={sites.label} title={sites.title} />
        <Reveal delay={0.06}>
          <p className="lede mt-5 max-w-[48ch]">{t(sites.intro)}</p>
        </Reveal>

        {/* Directly under the intro, before the first storefront: someone
            scrolling a row of sites decides what this section is in about two
            seconds, and this is what it is. */}
        <Reveal delay={0.09}>
          <p className="mt-5 max-w-[58ch] border-s-2 border-orange ps-4 text-[0.8125rem] leading-[1.8] text-ink-dim md:text-sm">
            {t(sites.positioning)}
          </p>
        </Reveal>

        <ul className="mt-10 space-y-12 md:mt-14 md:space-y-16 lg:space-y-24">
          {sites.demos.map((demo, i) => (
            <Reveal as="li" key={demo.id} delay={0.04 * (i % 2)}>
              <StoreDemo demo={demo} visit={sites.visit} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[62ch] border-s-2 border-orange ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(sites.note)}
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
