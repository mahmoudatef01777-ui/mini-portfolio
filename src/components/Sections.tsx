import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link, useRoute } from '@/lib/router';
import { EvidenceButton, EvidenceViewer, useEvidenceViewer } from './Evidence';
import { evidence, notAResult, proofUi, resultCards, sourceLabel, type ResultCard } from '@/content/proof';
import { story } from '@/content/story';
import { about, ads, closing, contact, cta, fullStory, growth, results, type Localized } from '@/content/content';
import { footer, heroExtra, nav, processUi, services, work } from '@/content/redesign';
import { Monogram, Reveal, Stagger } from './ui';
import { useCardIntro, useCountUp, useReveal } from '@/lib/reveal';
import { useClipReveal, useMagnetic, useScrubWords } from '@/lib/motion';
import Carousel from './Carousel';
import AboutPortrait from './AboutPortrait';

/* -------------------------------------------------------------- shared */

/**
 * The head every section opens with: "(02)" and the label on one dotted
 * line, then the title, big. The index is the section's place on the page,
 * in Latin figures in both languages.
 */
function SectionHead({
  index,
  label,
  title,
  className,
  tone = 'page',
}: {
  index: string;
  label: Localized;
  title?: Localized;
  className?: string;
  tone?: 'page' | 'dark';
}) {
  const { t } = useLang();
  return (
    <Reveal className={className}>
      <div className={cn('flex items-center gap-3', tone === 'dark' ? 'text-on-dark/60' : 'text-ink-dim')}>
        <span className="section-index text-inherit">{`(${index})`}</span>
        <span className="label text-inherit">{t(label)}</span>
        <span aria-hidden className={cn('rule-dots flex-1', tone === 'dark' ? 'text-on-dark/20' : 'text-line')} />
      </div>
      {title && (
        <h2 className={cn('section-title mt-6 max-w-[18ch] md:mt-8', tone === 'dark' && 'text-on-dark')}>{t(title)}</h2>
      )}
    </Reveal>
  );
}

/* ----------------------------------------------------------------- about */

export function About() {
  const { t, isRTL } = useLang();
  return (
    <section id="about" className="scroll-mt-16">
      <div className="container-page py-20 md:py-32">
        <SectionHead index="01" label={about.label} />

        <div className="mt-10 grid items-center gap-12 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
          <div>
            {/* The opening is the claim; it carries the weight. */}
            <Reveal delay={0.06}>
              <p className="display max-w-[22ch] text-[calc(clamp(1.75rem,4.4vw,3.5rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink">
                {t(about.lead)}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 max-w-[56ch] space-y-5 md:mt-10">
                {t(about.body).map((paragraph) => (
                  <p key={paragraph} className="text-[1.0625rem] leading-[1.8] text-ink-dim md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-10 max-w-[52ch] text-[0.9375rem] font-semibold leading-relaxed text-ink md:text-base">
                {t(about.chainLead)}
              </p>
            </Reveal>

            {/* The chain, drawn rather than typed: the arrow is an element,
                rotated with the reading direction, so it points forward in
                both languages. */}
            <Stagger as="ol" each={0.06} className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
              {about.chain.map((step, i) => (
                <li key={step.en} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className={cn('text-orange-ink', isRTL && 'rotate-180')}>
                      →
                    </span>
                  )}
                  <span
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium md:text-sm',
                      i === about.chain.length - 1
                        ? 'border-orange bg-orange text-on-orange'
                        : 'border-line bg-soft text-ink',
                    )}
                  >
                    {t(step)}
                  </span>
                </li>
              ))}
            </Stagger>
          </div>

          {/* The photograph leads on a phone and follows on a laptop; the
              DOM keeps the order a screen reader should hear. */}
          <Reveal delay={0.12} className="order-first lg:order-none">
            <AboutPortrait />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- services */

export function Services() {
  const { t, isRTL } = useLang();
  return (
    <section id="services" className="scroll-mt-16 border-t border-line">
      <div className="container-page py-20 md:py-32">
        <SectionHead index="02" label={services.label} title={services.title} />
        <Reveal delay={0.06}>
          <p className="lede mt-6 max-w-[52ch]">{t(services.intro)}</p>
        </Reveal>

        <Stagger as="ol" each={0.07} className="mt-12 border-t border-line md:mt-16">
          {services.items.map((item) => (
            <li key={item.n} className="service-row border-b border-line">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 px-1 py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,24rem)_auto] md:items-center md:gap-x-8 md:px-4 md:py-9">
                <span className="section-index pt-1.5 md:pt-0">{item.n}</span>
                <h3 className="service-name display text-[calc(clamp(1.5rem,3.6vw,2.75rem)*var(--display-scale))] text-ink">
                  {t(item.name)}
                </h3>
                <p className="col-start-2 text-[0.9375rem] leading-relaxed text-ink-dim md:col-start-auto md:text-base">
                  {t(item.body)}
                </p>
                <span
                  aria-hidden
                  className="service-arrow col-start-3 row-start-1 grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:col-start-auto md:row-start-auto md:h-12 md:w-12"
                >
                  <span className={cn(isRTL && '-scale-x-100')}>→</span>
                </span>
              </div>
            </li>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 text-sm text-ink-dim">{t(services.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ work */

/** Only the funded, dashboard-read cases; soft cards are not results. */
const CASES = resultCards.filter((card) => !card.soft);

function CaseStudy({ card, index, onOpen }: { card: ResultCard; index: number; onOpen: (card: ResultCard) => void }) {
  const { t, isRTL } = useLang();
  const media = useClipReveal<HTMLButtonElement>(isRTL);
  const cover = card.cover ? evidence[card.cover] : undefined;
  const gallery = card.gallery.filter((id) => !notAResult.includes(id));
  const flip = index % 2 === 1;

  return (
    <article className="grid gap-8 border-t border-line pt-10 md:pt-14 lg:grid-cols-12 lg:gap-12">
      {/* THE CAPTURE IS THE CARD'S PICTURE, and it opens the evidence. It is
          letterboxed, never cropped: these are wide tables, and a crop throws
          away columns. */}
      {cover && (
        <button
          ref={media}
          type="button"
          onClick={() => onOpen(card)}
          aria-label={`${t(proofUi.viewEvidence)}: ${t(cover.caption)}`}
          className={cn(
            'case-media group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-line bg-soft p-4 md:p-8 lg:col-span-7',
            flip && 'lg:order-2',
          )}
        >
          <img
            src={cover.src}
            alt={t(cover.alt)}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto max-w-full rounded-md object-contain shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
          />
          <span className="absolute bottom-4 end-4 rounded-full bg-cream/90 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink backdrop-blur">
            {t(sourceLabel[cover.source])}
          </span>
          <span
            aria-hidden
            className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-orange text-on-orange transition-transform duration-500 group-hover:rotate-45"
          >
            <span className={cn(isRTL && '-scale-x-100')}>↗</span>
          </span>
        </button>
      )}

      <div className={cn('flex flex-col lg:col-span-5', flip && 'lg:order-1')}>
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-index">{`0${index + 1}`}</span>
            {card.logo ? (
              <img
                src={card.logo}
                alt={card.alias ? t(card.alias) : card.brand}
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 rounded-xl bg-paper object-contain p-1 md:h-12 md:w-12"
              />
            ) : null}
            {card.badge && (
              <span className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-dim">
                {t(card.badge)}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm font-medium text-ink-dim">{card.alias ? t(card.alias) : card.brand}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="display mt-5 text-[calc(clamp(2.5rem,6vw,4.5rem)*var(--display-scale))] leading-none text-orange-ink">
            <span className="num">{card.value}</span>
          </p>
          <p className="mt-3 max-w-[38ch] text-base font-medium text-ink">{t(card.label)}</p>
          <p className="mt-2 text-xs text-ink-dim">{t(card.source)}</p>
          {card.status && <p className="mt-1 text-xs text-ink-dim">{t(card.status)}</p>}
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label mt-8">{t(work.did)}</p>
          <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink">{t(card.did)}</p>
        </Reveal>

        <Stagger as="div" each={0.05} className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
          {card.facts.map((fact) => (
            <div key={fact.value + fact.label.en}>
              <p className="display text-[calc(1.375rem*var(--display-scale))] leading-tight text-ink md:text-[calc(1.625rem*var(--display-scale))]">
                <span className="num">{fact.value}</span>
              </p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-ink">{t(fact.label)}</p>
              <p className="mt-0.5 text-[0.6875rem] leading-snug text-ink-dim">{t(fact.source)}</p>
            </div>
          ))}
        </Stagger>

        {card.coverNote && <p className="mt-5 text-xs leading-relaxed text-ink-dim">{t(card.coverNote)}</p>}

        <Reveal delay={0.12} className="mt-8">
          <EvidenceButton count={gallery.length} label={t(proofUi.viewEvidence)} onClick={() => onOpen(card)} />
        </Reveal>
      </div>
    </article>
  );
}

export function Work() {
  const viewer = useEvidenceViewer();
  const openCase = (card: ResultCard) =>
    viewer.open(
      card.gallery.filter((id) => !notAResult.includes(id)).map((id) => evidence[id]),
      0,
    );

  return (
    <section id="work" className="scroll-mt-16 border-t border-line">
      <div className="container-page py-20 md:py-32">
        <SectionHead index="03" label={work.label} title={work.title} />
        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {CASES.map((card, i) => (
            <CaseStudy key={card.id} card={card} index={i} onOpen={openCase} />
          ))}
        </div>
      </div>

      <EvidenceViewer
        state={viewer.state}
        onClose={viewer.close}
        onIndex={(index) => viewer.setState((current) => (current ? { ...current, index } : current))}
      />
    </section>
  );
}

/* --------------------------------------------------------------- results */

/**
 * ONE CARD PER CAPTURE, deduplicated, and only captures that carry an
 * e-commerce result read off a dashboard (Mahmoud's rule, 2026-11-04).
 */
function resultShots() {
  const seen = new Set<string>();
  return resultCards.flatMap((card) => {
    if (card.soft) return [];
    return card.gallery.flatMap((id) => {
      if (seen.has(id) || notAResult.includes(id)) return [];
      seen.add(id);
      return [{ card, shot: evidence[id] }];
    });
  });
}

/**
 * The two career figures, counted up as the reader scrolls onto them.
 * The steps and starting points are Mahmoud's; the last value is always the
 * published string, and reduced motion shows nothing else.
 */
const COUNTERS: Record<string, { from: number; to: number; step: number; format: (n: number) => string }> = {
  orders: { from: 5_000, to: 25_000, step: 5_000, format: (n) => `${n.toLocaleString('en-US')}+` },
  sales: {
    from: 1_000_000,
    to: 10_000_000,
    step: 500_000,
    format: (n) => (n >= 10_000_000 ? 'EGP 10M+' : `EGP ${(n / 1_000_000).toFixed(1)}M`),
  },
};

function CountingValue({ id, value }: { id: string; value: string }) {
  const counter = COUNTERS[id];
  const ref = useCountUp<HTMLSpanElement>(
    counter?.from ?? 0,
    counter?.to ?? 0,
    counter?.step ?? 1,
    counter?.format ?? (() => value),
  );
  if (!counter) return <span className="num">{value}</span>;
  return (
    <span ref={ref} className="num tabular-nums">
      {value}
    </span>
  );
}

export function Results() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();
  const cards = resultShots();

  return (
    <section id="results" className="scroll-mt-16 border-t border-line bg-soft">
      <div className="container-page py-20 md:py-32">
        <SectionHead index="04" label={proofUi.resultsLabel} title={proofUi.resultsTitle} />

        <dl className="mt-12 grid gap-10 sm:grid-cols-2 md:mt-16">
          {results.stats.map((stat, i) => (
            <Reveal key={stat.id} delay={0.06 * (i + 1)}>
              {/* The figure in the accent: `orange-ink` is the lime itself
                  on dark and the lime walked toward the ink on light, so it
                  reads in both themes. */}
              <div className="border-t-2 border-orange-ink pt-5">
                <dt className="display text-[calc(clamp(3rem,9vw,7.5rem)*var(--display-scale))] leading-none text-orange-ink">
                  <CountingValue id={stat.id} value={stat.value} />
                </dt>
                <dd className="mt-4 text-sm font-medium text-ink md:text-base">{t(stat.label)}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.1} className="mt-16 md:mt-20">
          <p className="label eyebrow">{t(results.evidenceLabel)}</p>
          <p className="lede mt-4 max-w-[50ch]">{t(proofUi.resultsIntro)}</p>
        </Reveal>

        <Reveal delay={0.14} className="mt-8">
          <Carousel label={t(proofUi.resultsLabel)} itemClassName="w-[min(90vw,23rem)]">
            {cards.map(({ shot }) => (
              <article key={shot.id} className="flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-cream">
                <button
                  type="button"
                  onClick={() => viewer.open([shot], 0)}
                  aria-label={`${t(proofUi.viewEvidence)}: ${t(shot.caption)}`}
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
                  <span className="self-start rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium text-ink-dim">
                    {t(sourceLabel[shot.source])}
                  </span>
                  <p className="mt-auto pt-4 text-xs leading-relaxed text-ink-dim">{t(shot.caption)}</p>
                </div>
              </article>
            ))}
          </Carousel>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[62ch] border-s-2 border-orange-ink ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
            {t(results.note)}
          </p>
          <p className="mt-4 max-w-[62ch] border-s-2 border-orange-ink ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
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

/* --------------------------------------------------------------- process */

/** One stage. The data- attributes are what `useCardIntro` animates. */
function GrowthBlock({ block }: { block: (typeof growth.blocks)[number] }) {
  const { t, isRTL } = useLang();
  const ref = useCardIntro<HTMLLIElement>(isRTL);

  return (
    <li ref={ref} className="pb-2">
      <span data-rule aria-hidden className="block h-px w-full bg-ink/15" />
      <div className="grid gap-4 pt-6 md:grid-cols-[5rem_minmax(0,1fr)] md:gap-6 md:pt-8">
        {/* A lime numeral on a near-black chip, on both themes: the chip is
            what lets the lime be the colour it actually is. */}
        <span
          data-num
          className="num inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-orange md:h-12 md:w-12"
        >
          {block.n}
        </span>
        <div>
          <h3 data-head className="display text-[calc(clamp(1.375rem,2.6vw,2rem)*var(--display-scale))] text-ink">
            {t(block.name)}
          </h3>
          <p data-lead className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-dim md:text-base">
            {t(block.lead)}
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-x-6">
            {block.points.map((point) => (
              <li key={point.en} data-point className="flex items-start gap-2.5 text-[0.875rem] text-ink md:text-[0.9375rem]">
                <span aria-hidden className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-orange-ink" />
                {t(point)}
              </li>
            ))}
          </ul>
          {'close' in block && block.close && (
            <p data-point className="mt-5 max-w-[52ch] border-s-2 border-orange-ink ps-3.5 text-[0.8125rem] leading-relaxed text-ink-dim md:text-[0.875rem]">
              {t(block.close)}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function Process() {
  const { t } = useLang();

  return (
    <section id="process" className="scroll-mt-16 border-t border-line">
      <div className="container-page grid gap-12 py-20 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* The intro holds still while the six stages pass it, on a laptop. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead index="05" label={processUi.label} title={growth.title} />
          <Reveal delay={0.06}>
            <p className="lede mt-6 max-w-[40ch]">{t(growth.intro)}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <div className="rounded-[1.5rem] border border-line bg-soft p-6 md:p-8">
              <p className="display text-[calc(clamp(1.125rem,2vw,1.375rem)*var(--display-scale))] text-ink">
                {t(growth.decision.title)}
              </p>
              <Stagger as="ol" each={0.08} className="mt-5 space-y-1">
                {growth.decision.steps.map((step, i) => (
                  <li key={step.en}>
                    {i > 0 && (
                      <span aria-hidden className="block py-0.5 text-sm leading-none text-orange-ink">
                        ↓
                      </span>
                    )}
                    <span className="block text-[0.9375rem] leading-relaxed text-ink">{t(step)}</span>
                  </li>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>

        <ol className="space-y-10 md:space-y-12">
          {growth.blocks.map((block) => (
            <GrowthBlock key={block.id} block={block} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- statement */

/**
 * The two lines the page argues toward, lit word by word as they scroll
 * through. Then the way into the story.
 */
export function Statement() {
  const { t, lang, isRTL } = useLang();
  const first = useScrubWords<HTMLParagraphElement>(`${lang}-1`);
  const second = useScrubWords<HTMLParagraphElement>(`${lang}-2`);

  return (
    <section className="border-t border-line">
      <div className="container-page py-24 md:py-40">
        <p
          ref={first}
          key={`${lang}-a`}
          className="display max-w-[22ch] text-[calc(clamp(2.25rem,6.4vw,5.75rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink"
        >
          {t(closing.lead)} {t(closing.body)}
        </p>
        <p
          ref={second}
          key={`${lang}-b`}
          className="display mt-10 max-w-[30ch] text-[calc(clamp(1.375rem,3vw,2.5rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink-dim md:mt-14"
        >
          {t(growth.statement)}
        </p>

        <Reveal className="mt-12 md:mt-16">
          <div className="flex flex-col gap-6 rounded-[1.5rem] border border-line p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="label eyebrow">{t(fullStory.label)}</p>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-dim md:text-base">{t(fullStory.body)}</p>
            </div>
            <Link
              to="story"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-colors duration-300 ease-out hover:bg-orange hover:text-on-orange md:self-auto md:text-base"
            >
              {t(fullStory.cta)}
              <span aria-hidden className={isRTL ? '-scale-x-100' : undefined}>
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z';
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

/** The dark call, which is also the footer. On every route. */
export function Contact() {
  const { t, isRTL } = useLang();
  const { route } = useRoute();
  const magnet = useMagnetic<HTMLAnchorElement>(0.3);
  const nameRef = useReveal<HTMLDivElement>(0.1);

  return (
    <footer id="contact" className="scroll-mt-16 overflow-hidden bg-black text-on-dark">
      <div className="container-page pb-10 pt-20 md:pt-32">
        <SectionHead index="06" label={cta.label} tone="dark" />

        <div className="mt-10 grid items-end gap-12 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <Reveal delay={0.06}>
              <h2 className="display max-w-[14ch] text-[calc(clamp(2.5rem,7.4vw,6.5rem)*var(--display-scale))] leading-[var(--display-leading)] text-on-dark">
                {t(cta.title)}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-[50ch] text-[1.0625rem] leading-[1.7] text-on-dark/70 md:text-lg">{t(cta.body)}</p>
            </Reveal>

            <Reveal delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-full bg-on-dark px-6 py-3.5 text-sm font-semibold text-black transition-colors duration-300 ease-out hover:bg-[#25D366] md:text-base"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                  <path d={WHATSAPP_PATH} />
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
                  <path d={LINKEDIN_PATH} />
                </svg>
                {t(contact.linkedin.label)}
              </a>
            </Reveal>

            <Reveal delay={0.22}>
              <a href={contact.email.href} className="link-line mt-7 text-sm text-on-dark/75 hover:text-on-dark md:text-base">
                {contact.email.display}
              </a>
            </Reveal>
          </div>

          {/* The big round call, a lime slab with near-black on it. */}
          <Reveal delay={0.2} className="justify-self-start lg:justify-self-end">
            <a
              ref={magnet}
              href={contact.whatsapp.href}
              target="_blank"
              rel="noreferrer noopener"
              className="grid h-40 w-40 place-items-center rounded-full bg-orange text-center text-on-orange transition-transform duration-500 hover:scale-105 md:h-52 md:w-52"
            >
              <span className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] md:text-base">
                <span aria-hidden className={cn('text-3xl leading-none', isRTL && '-scale-x-100')}>
                  ↗
                </span>
                {t(heroExtra.getInTouch)}
              </span>
            </a>
          </Reveal>
        </div>

        <nav aria-label="Footer" className="mt-20 grid gap-8 border-t border-on-dark/15 pt-8 md:mt-28 md:grid-cols-[1fr_auto] md:items-start">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-dark/70">
            {nav.items.map((item) => (
              <li key={item.id}>
                <a href={route === 'home' ? `#${item.id}` : `/${isRTL ? 'ar' : ''}#${item.id}`.replace('//', '/')} className="link-line hover:text-on-dark">
                  {t(item.label)}
                </a>
              </li>
            ))}
            <li>
              <Link to={route === 'story' ? 'home' : 'story'} className="link-line hover:text-on-dark">
                {t(route === 'story' ? story.back : fullStory.cta)}
              </Link>
            </li>
          </ul>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="link-line text-sm text-on-dark/70 hover:text-on-dark">
            {t(footer.top)} <span aria-hidden>↑</span>
          </a>
        </nav>

        <div className="mt-10 flex items-center justify-between gap-4 text-xs text-on-dark/50">
          <p className="flex items-center gap-2.5">
            <Monogram className="h-3.5 text-orange" />
            <span dir="ltr">© 2026 Mahmoud Elzaqla</span>
          </p>
          <p dir="ltr">mahmoudelzaqla.site</p>
        </div>
      </div>

      {/* The name again, outlined, as the last thing on the page. */}
      <div ref={nameRef} aria-hidden className="select-none px-gutter pb-4" dir="ltr">
        {/* SVG with textLength, so the name is exactly the column wide on
            every screen and in every fallback font, with no measuring. */}
        <svg viewBox="0 0 1000 118" className="outline-name block h-auto w-full">
          <text x="0" y="108" textLength="1000" lengthAdjust="spacingAndGlyphs">
            MAHMOUD ELZAQLA
          </text>
        </svg>
      </div>
    </footer>
  );
}
