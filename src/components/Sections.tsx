import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link, useRoute } from '@/lib/router';
import { EvidenceButton, EvidenceViewer, useEvidenceViewer } from './Evidence';
import { evidence, notAResult, proofUi, resultCards, sourceLabel, type ResultCard } from '@/content/proof';
import { story } from '@/content/story';
import { about, ads, closing, contact, cta, fullStory, growth, results, type Localized } from '@/content/content';
import { footer, footerUi, giant, heroExtra, nav, processUi, services, work, workUi } from '@/content/redesign';
import { Monogram, Reveal, Stagger } from './ui';
import { useCardIntro, useCountUp } from '@/lib/reveal';
import { useClipReveal, useFollowCursor, useGiantTitle, useMagnetic, useScrubWords } from '@/lib/motion';
import Carousel from './Carousel';
import AboutPortrait from './AboutPortrait';

/* -------------------------------------------------------------- shared */

const TOTAL = '05';

/**
 * The head every numbered section opens with, after the reference's
 * "/ABOUT": the label and "01/05" on one line, then the label again, huge,
 * behind a slash, rising out of its own line as it is scrolled to. The
 * sentence under it is the section's real <h2>.
 */
function GiantHead({
  index,
  label,
  word,
  title,
  className,
}: {
  index: string;
  label: Localized;
  word: Localized;
  title?: Localized;
  className?: string;
}) {
  const { t, lang } = useLang();
  const ref = useGiantTitle<HTMLDivElement>(lang);
  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-3 text-ink-dim">
        <span className="label">{t(label)}</span>
        <span aria-hidden className="rule-dots flex-1 text-line" />
        <span className="section-index">{`${index}/${TOTAL}`}</span>
      </div>
      <p aria-hidden className="giant-clip mt-4 md:mt-6">
        <span data-giant className="giant block text-ink">
          <span className="giant-slash">/</span>
          {t(word)}
        </span>
      </p>
      {title && (
        <Reveal delay={0.05}>
          <h2 className="section-title mt-6 max-w-[20ch] md:mt-8">{t(title)}</h2>
        </Reveal>
      )}
    </div>
  );
}

/** The reference's big outlined arrow. Points forward in either script. */
function BigArrow({ className, isRTL }: { className?: string; isRTL: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={cn('block', isRTL && '-scale-x-100', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={9}
      strokeLinecap="square"
    >
      <path d="M14 86 L84 16 M30 16 H84 V70" />
    </svg>
  );
}

/* ----------------------------------------------------------------- about */

export function About() {
  const { t, isRTL } = useLang();
  return (
    <section id="about" className="panel-shell scroll-mt-16">
      <div className="panel panel-ink">
        <div className="container-page py-16 md:py-28">
          <GiantHead index="01" label={about.label} word={giant.about} />

          <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(0,24rem)] lg:gap-14">
            <Reveal className="hidden lg:block">
              <BigArrow isRTL={isRTL} className="h-32 w-32 text-ink/25" />
            </Reveal>

            <div>
              <Reveal delay={0.06}>
                <p className="display max-w-[24ch] text-[calc(clamp(1.625rem,3.4vw,2.75rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink">
                  {t(about.lead)}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8 max-w-[58ch] space-y-5">
                  {t(about.body).map((paragraph) => (
                    <p key={paragraph} className="text-[1.0625rem] leading-[1.8] text-ink-dim md:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="label mt-10 text-ink">{t(about.chainLead)}</p>
              </Reveal>
              {/* The chain: the arrow is an element, rotated with the
                  reading direction, so it points forward in both languages. */}
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

            {/* The photograph leads on a phone and follows on a laptop. */}
            <Reveal delay={0.12} className="order-first lg:order-none">
              <AboutPortrait />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- services */

export function Services() {
  const { t, isRTL } = useLang();
  return (
    <section id="services" className="scroll-mt-16">
      <div className="container-page py-20 md:py-32">
        <GiantHead index="02" label={services.label} word={giant.services} title={services.title} />
        <Reveal delay={0.06}>
          <p className="lede mt-6 max-w-[52ch]">{t(services.intro)}</p>
        </Reveal>

        <Stagger as="ol" each={0.07} className="mt-12 md:mt-16">
          {services.items.map((item) => (
            <li key={item.n} className="service-row rule-dash last:border-b last:border-dashed last:border-ink/30">
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
const galleryOf = (card: ResultCard) => card.gallery.filter((id) => !notAResult.includes(id));

/**
 * The details under an opened row: the cover capture, what he did, the
 * four figures with their sources, and the evidence.
 */
function CaseDetails({ card, onOpen }: { card: ResultCard; onOpen: (card: ResultCard) => void }) {
  const { t, isRTL } = useLang();
  const media = useClipReveal<HTMLButtonElement>(isRTL);
  const cover = card.cover ? evidence[card.cover] : undefined;

  return (
    <div className="grid gap-8 pb-10 pt-4 lg:grid-cols-12 lg:gap-12">
      {cover && (
        <button
          ref={media}
          type="button"
          onClick={() => onOpen(card)}
          aria-label={`${t(proofUi.viewEvidence)}: ${t(cover.caption)}`}
          className="case-media group relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-line bg-soft px-4 py-10 sm:p-8 lg:col-span-7"
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
        </button>
      )}

      <div className="flex flex-col lg:col-span-5">
        <p className="text-base font-medium text-ink">{t(card.label)}</p>
        <p className="mt-2 text-xs text-ink-dim">{t(card.source)}</p>
        {card.status && <p className="mt-1 text-xs text-ink-dim">{t(card.status)}</p>}

        <p className="label mt-7">{t(work.did)}</p>
        <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink">{t(card.did)}</p>

        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
          {card.facts.map((fact) => (
            <div key={fact.value + fact.label.en}>
              <p className="display text-[calc(1.375rem*var(--display-scale))] leading-tight text-ink md:text-[calc(1.625rem*var(--display-scale))]">
                <span className="num">{fact.value}</span>
              </p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-ink">{t(fact.label)}</p>
              <p className="mt-0.5 text-[0.6875rem] leading-snug text-ink-dim">{t(fact.source)}</p>
            </div>
          ))}
        </div>

        {card.coverNote && <p className="mt-5 text-xs leading-relaxed text-ink-dim">{t(card.coverNote)}</p>}

        <div className="mt-8">
          <EvidenceButton count={galleryOf(card).length} label={t(proofUi.viewEvidence)} onClick={() => onOpen(card)} />
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const { t } = useLang();
  const viewer = useEvidenceViewer();
  const listRef = useFollowCursor<HTMLDivElement>();
  const [open, setOpen] = useState<string | null>(CASES[0]?.id ?? null);
  const [hover, setHover] = useState<string | null>(null);
  const magnet = useMagnetic<HTMLAnchorElement>(0.3);

  const openCase = (card: ResultCard) => viewer.open(galleryOf(card).map((id) => evidence[id]), 0);
  const hovered = CASES.find((c) => c.id === hover);
  const hoveredCover = hovered?.cover ? evidence[hovered.cover] : undefined;

  return (
    <section id="work" className="scroll-mt-16 border-t border-line">
      <div className="container-page py-20 md:py-32">
        {/* The reference opens its work with a statement and a round call. */}
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          <Reveal>
            <p className="display max-w-[34ch] text-[calc(clamp(1.375rem,2.8vw,2.25rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink">
              {t(growth.statement)}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              ref={magnet}
              href={contact.whatsapp.href}
              target="_blank"
              rel="noreferrer noopener"
              className="grid h-36 w-36 place-items-center rounded-full border border-ink/40 text-center text-sm font-semibold uppercase leading-tight tracking-[0.06em] text-ink transition-colors duration-300 hover:border-orange hover:bg-orange hover:text-on-orange md:h-44 md:w-44 md:text-base"
            >
              {t(heroExtra.getInTouch)}
            </a>
          </Reveal>
        </div>

        <GiantHead index="03" label={work.label} word={giant.work} title={work.title} className="mt-20 md:mt-28" />

        <div ref={listRef} className="relative mt-12 md:mt-16" onPointerLeave={() => setHover(null)}>
          {/* The cover that follows the pointer over the list (desktop). */}
          <div aria-hidden data-follow className={cn('follow', hoveredCover && 'is-on')}>
            {hoveredCover && (
              <div className="snake rounded-[1.25rem]">
                <span className="snake-inner flex aspect-[16/10] items-center justify-center rounded-[calc(1.25rem-3px)] bg-soft p-3">
                  <img src={hoveredCover.src} alt="" className="max-h-full w-auto max-w-full rounded object-contain" />
                </span>
              </div>
            )}
          </div>

          <ul>
            {CASES.map((card, i) => {
              const isOpen = open === card.id;
              return (
                <li key={card.id} className="rule-dash last:border-b last:border-dashed last:border-ink/30">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`case-${card.id}`}
                    onClick={() => setOpen(isOpen ? null : card.id)}
                    onPointerEnter={() => setHover(card.id)}
                    className="work-row"
                  >
                    <span className="min-w-0">
                      <span className="section-index block">{`0${i + 1}`}</span>
                      <span className="giant-clip mt-2 block">
                        <span className="work-figure num block">{card.value}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-4 pb-1">
                      <span className="hidden text-end sm:block">
                        <span className="flex items-center justify-end gap-2">
                          {card.logo && (
                            <img
                              src={card.logo}
                              alt=""
                              width={192}
                              height={192}
                              loading="lazy"
                              decoding="async"
                              className="h-8 w-8 rounded-lg bg-paper object-contain p-0.5"
                            />
                          )}
                          <span className="text-sm font-semibold text-ink md:text-base">
                            {card.alias ? t(card.alias) : card.brand}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-ink-dim">{t(card.source)}</span>
                      </span>
                      <span
                        aria-hidden
                        className="work-toggle grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-xl text-ink"
                      >
                        +
                      </span>
                      <span className="sr-only">{t(isOpen ? workUi.less : workUi.more)}</span>
                    </span>
                  </button>
                  {/* The alias, under the figure, on a phone. */}
                  <p className="-mt-2 pb-5 text-xs text-ink-dim sm:hidden">
                    {card.alias ? t(card.alias) : card.brand} · {t(card.source)}
                  </p>
                  {/* Always in the markup, only hidden: a crawler reading the
                      prerendered page still gets every case's figures. */}
                  <div id={`case-${card.id}`} hidden={!isOpen}>
                    <CaseDetails card={card} onOpen={openCase} />
                  </div>
                </li>
              );
            })}
          </ul>
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

/** The two career figures, counted up as the reader scrolls onto them. */
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
    <section id="results" className="scroll-mt-16 border-t border-line">
      <div className="container-page py-20 md:py-32">
        <GiantHead index="04" label={proofUi.resultsLabel} word={giant.results} title={proofUi.resultsTitle} />

        <dl className="mt-12 grid gap-10 sm:grid-cols-2 md:mt-16">
          {results.stats.map((stat, i) => (
            <Reveal key={stat.id} delay={0.06 * (i + 1)}>
              <div className="border-t-2 border-orange-ink pt-5">
                <dt className="work-figure text-orange-ink">
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
      </div>

      {/* Full bleed: the rail runs edge to edge, as the reference's strips do. */}
      {/* `px-gutter` cancels the rail's own negative gutter margin, which is
          there for use inside a container; out here it would overflow. */}
      <Reveal delay={0.14} className="px-gutter">
        <Carousel label={t(proofUi.resultsLabel)} itemClassName="w-[min(86vw,24rem)]">
          {cards.map(({ shot }) => (
            /* THE CAPTURE ALONE, inside a frame a lime line runs round
               (`.snake`). The caption is not printed on the card, on
               Mahmoud's call; it is the button's accessible name and it is
               printed in the viewer. */
            <button
              key={shot.id}
              type="button"
              onClick={() => viewer.open([shot], 0)}
              aria-label={`${t(proofUi.viewEvidence)}: ${t(shot.caption)}`}
              className="snake block h-56 w-full rounded-[1.25rem] md:h-60"
            >
              <span className="snake-inner flex h-full w-full items-center justify-center rounded-[calc(1.25rem-3px)] bg-soft p-4">
                <img
                  src={shot.src}
                  alt={t(shot.alt)}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full w-auto max-w-full rounded-md object-contain"
                />
              </span>
            </button>
          ))}
        </Carousel>
      </Reveal>

      <div className="container-page pb-20 pt-10 md:pb-32">
        <Reveal delay={0.1}>
          <p className="max-w-[62ch] border-s-2 border-orange-ink ps-4 text-xs leading-relaxed text-ink-dim md:text-sm">
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

/**
 * THE PROCESS, after the reference's DEFINE / DESIGN / DELIVER card: an ink
 * panel, the six stage names stacked on the start side and held still while
 * the stages themselves scroll past on the other; the one being read is in
 * full ink. No pinning, no scroll hijack: the page scrolls as it always does.
 */
export function Process() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(listRef.current?.children ?? []);
    if (items.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(items.indexOf(e.target));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="panel-shell scroll-mt-16">
      <div className="panel panel-ink">
        <div className="container-page py-16 md:py-28">
          <GiantHead index="05" label={processUi.label} word={giant.process} title={growth.title} />
          <Reveal delay={0.06}>
            <p className="lede mt-6 max-w-[48ch]">{t(growth.intro)}</p>
          </Reveal>

          <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="hidden lg:block">
              <ol aria-hidden className="sticky top-28 space-y-1">
                {growth.blocks.map((block, i) => (
                  <li key={block.id} className={cn('step-name', i === active && 'is-active')}>
                    {t(block.name)}
                  </li>
                ))}
              </ol>
            </div>

            <ol ref={listRef} className="space-y-12 md:space-y-16">
              {growth.blocks.map((block) => (
                <GrowthBlock key={block.id} block={block} />
              ))}
            </ol>
          </div>

          <Reveal delay={0.1} className="mt-16 md:mt-24">
            <div className="max-w-[40rem] rounded-[1.5rem] border border-line bg-soft p-6 md:p-8">
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- statement */

/**
 * The line the page argues toward, lit word by word as it scrolls through.
 * Then the way into the story.
 */
export function Statement() {
  const { t, lang, isRTL } = useLang();
  const first = useScrubWords<HTMLParagraphElement>(`${lang}-1`);

  return (
    <section>
      <div className="container-page py-24 md:py-40">
        <p
          ref={first}
          key={`${lang}-a`}
          className="display max-w-[22ch] text-[calc(clamp(2.25rem,6.4vw,5.75rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink"
        >
          {t(closing.lead)} {t(closing.body)}
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

/**
 * The footer, after the reference: a pale panel, the big arrow and "Let's
 * work together", one outlined button, a rule, his name set across the full
 * width, and the small print. On every route.
 */
export function Contact() {
  const { t, isRTL } = useLang();
  const { route } = useRoute();
  const homeHash = (id: string) => (route === 'home' ? `#${id}` : `${isRTL ? '/ar' : '/'}#${id}`);

  return (
    <footer id="contact" className="panel-shell scroll-mt-16 pb-2 md:pb-3">
      <div className="panel bg-soft">
        <div className="container-page pb-8 pt-16 md:pt-24">
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
            <div className="flex items-start gap-5 md:gap-8">
              <Reveal>
                <BigArrow isRTL={isRTL} className="mt-1 h-14 w-14 text-ink md:h-24 md:w-24" />
              </Reveal>
              <div>
                <Reveal delay={0.04}>
                  <p className="label">{t(cta.label)}</p>
                </Reveal>
                <Reveal delay={0.08}>
                  <h2 className="display mt-3 max-w-[14ch] text-[calc(clamp(2.25rem,6vw,5.5rem)*var(--display-scale))] leading-[var(--display-leading)] text-ink">
                    {t(footerUi.together)}
                  </h2>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-dim md:text-lg">{t(cta.body)}</p>
                </Reveal>
              </div>
            </div>

            <Reveal delay={0.16} className="flex flex-col items-start gap-3 md:items-end">
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-xl border border-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-ink transition-colors duration-300 hover:border-orange hover:bg-orange hover:text-on-orange"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
                  <path d={WHATSAPP_PATH} />
                </svg>
                {t(footerUi.message)}
              </a>
              <a
                href={contact.linkedin.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-xl border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 hover:border-ink"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d={LINKEDIN_PATH} />
                </svg>
                {t(contact.linkedin.label)}
              </a>
              <a href={contact.email.href} className="link-line mt-1 text-sm text-ink-dim hover:text-ink">
                {contact.email.display}
              </a>
            </Reveal>
          </div>

          <div className="mt-14 border-t border-ink/15 pt-8 md:mt-20" />

          {/* His name across the full width. SVG with textLength, so it is
              exactly the column wide on every screen, with no measuring. */}
          <div aria-hidden dir="ltr" className="select-none">
            <svg viewBox="0 0 1000 118" className="footer-name block h-auto w-full">
              <text x="0" y="110" textLength="1000" lengthAdjust="spacingAndGlyphs">
                MAHMOUD ELZAQLA
              </text>
            </svg>
          </div>

          <nav aria-label="Footer" className="mt-8 flex flex-col gap-5 text-xs text-ink-dim md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-2.5">
              <Monogram className="h-3.5 text-orange-ink" />
              <span dir="ltr">© 2026 Mahmoud Elzaqla</span>
              <span aria-hidden>·</span>
              <span>{t(footerUi.rights)}</span>
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {nav.items.map((item) => (
                <li key={item.id}>
                  <a href={homeHash(item.id)} className="link-line hover:text-ink">
                    {t(item.label)}
                  </a>
                </li>
              ))}
              <li>
                <Link to={route === 'story' ? 'home' : 'story'} className="link-line hover:text-ink">
                  {t(route === 'story' ? story.back : fullStory.cta)}
                </Link>
              </li>
              <li>
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="link-line hover:text-ink"
                >
                  {t(footer.top)} <span aria-hidden>↑</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
