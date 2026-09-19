import type { ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link } from '@/lib/router';
import { contact, type Localized } from '@/content/content';
import { story } from '@/content/story';
import { Button, Reveal, SectionHead } from './ui';

/**
 * THE STORY PAGE — this site's own second page, not a door to another site.
 *
 * Nothing here links out to the main portfolio, and nothing here needs it to
 * be running, built or deployed. The words live in `content/story.ts`.
 *
 * WHAT IT IS FOR, and what it is not. The home page does positioning, proof,
 * services and contact. This page does the journey and what it taught him —
 * so it carries no results grid, no websites, no services and NO EVIDENCE.
 * The dashboards are published once, on the home page; a second copy here
 * would turn the story into a results page.
 *
 * SHAPE: a single column, read top to bottom, because the story is
 * chronological and a grid would invite reading stage five before stage two.
 * The rail down the side is the only piece of decoration, and it exists to
 * make the sequence legible at a glance rather than to fill space.
 *
 * MOBILE IS THE REAL CASE. It is opened from an Instagram bio. So the rail
 * collapses, the numbers stay big, the paragraphs stay short, and every
 * horizontal composition is a `md:` or `lg:` addition on top of a vertical
 * one that already works at 375px.
 */

/* --------------------------------------------------------------- pieces */

/** The small numeral that opens a stage. */
function StageNumber({ n }: { n: number }) {
  return (
    <span className="num inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-[0.8125rem] font-semibold text-ink-dim">
      {String(n).padStart(2, '0')}
    </span>
  );
}

/**
 * A sequence drawn rather than typed.
 *
 * Written inline, the arrow is a neutral character between two runs and the
 * bidi algorithm decides which side it belongs to — in Arabic it ends up
 * pointing back at the step before it and the chain reads backwards. As a
 * list, the component draws the arrow and flips it with the reading
 * direction, which is the only way this stays correct in both languages.
 */
function Chain({ steps, tone = 'quiet' }: { steps: Localized[]; tone?: 'quiet' | 'loud' }) {
  const { t, isRTL } = useLang();

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {steps.map((step, i) => (
        <li key={step.en} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className={cn('text-orange', isRTL && 'rotate-180')}>
              →
            </span>
          )}
          <span
            className={cn(
              'rounded-full border px-3.5 py-1.5 font-medium',
              tone === 'loud'
                ? 'border-line bg-cream text-[0.8125rem] text-ink md:text-sm'
                : 'border-line bg-soft text-[0.75rem] text-ink-dim md:text-[0.8125rem]',
            )}
          >
            {t(step)}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The arrow points back along the reading direction, whichever that is. */
function BackArrow() {
  const { isRTL } = useLang();
  return (
    <span aria-hidden className={isRTL ? 'rotate-180' : undefined}>
      ←
    </span>
  );
}

function Section({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('border-t border-line', className)}>
      <div className="container-page py-14 md:py-20">{children}</div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */

export default function StoryPage() {
  const { t } = useLang();

  return (
    <main id="main">
      {/* ------------------------------------------------------------ hero */}
      <section className="container-page pb-12 pt-8 md:pb-16 md:pt-12">
        <Reveal>
          <Link
            to="home"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-dim transition-colors duration-300 hover:text-ink md:text-sm"
          >
            <BackArrow />
            {t(story.back)}
          </Link>
        </Reveal>

        <SectionHead label={story.label} className="mt-10 md:mt-14" />

        <Reveal delay={0.06}>
          <h1 className="display mt-5 max-w-[17ch] text-balance text-[calc(clamp(2rem,6.4vw,3.5rem)*var(--display-scale))] text-ink">
            {t(story.title)}
          </h1>
        </Reveal>

        {/* Compact on purpose: the hero introduces the journey, it does not
            tell it. The timeline below is where the story happens. */}
        <Reveal delay={0.12}>
          <p className="lede mt-6 max-w-[44ch] md:mt-8">{t(story.lead)}</p>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- timeline */}
      <Section className="bg-soft">
        <ol className="relative">
          {/* The rail. It starts and stops inside the list rather than running
              the full height, so it reads as a spine and not a page border.
              Hidden on a phone, where the numbers alone carry the sequence
              and a rail would only eat the gutter. */}
          <span
            aria-hidden
            className="absolute inset-y-6 start-[1.0625rem] hidden w-px bg-line md:block"
          />

          {story.stages.map((stage, i) => (
            <Reveal as="li" key={stage.id} delay={0.04}>
              <article className={cn('relative flex gap-4 md:gap-6', i > 0 && 'pt-12 md:pt-16')}>
                <div className="relative z-10 shrink-0">
                  <StageNumber n={i + 1} />
                </div>

                {/*
                  A STAGE WITH A PICTURE SHOWS IT BESIDE THE WORDS ON A LAPTOP
                  AND NOWHERE ELSE.

                  Mahmoud's call: these are illustrations, and six of them
                  stacked between six blocks of text is what a phone would
                  make of them — the reader would scroll past a picture to
                  reach the next sentence, six times. `hidden` on the img is
                  not just visual: the browser never requests a file it is
                  told not to display, so a phone does not pay for them.
                */}
                <div
                  className={cn(
                    'min-w-0 flex-1 pb-2',
                    stage.art && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-10',
                  )}
                >
                  <div className="min-w-0">
                  <h2 className="display max-w-[24ch] text-[calc(clamp(1.25rem,3.6vw,1.875rem)*var(--display-scale))] text-ink">
                    {t(stage.name)}
                  </h2>

                  <div className="mt-4 max-w-[54ch] space-y-3.5">
                    {t(stage.body).map((paragraph) => (
                      <p key={paragraph} className="text-[0.9375rem] leading-[1.85] text-ink-dim md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {stage.stats && (
                    <div className="mt-6">
                      <ul className="flex flex-wrap gap-3">
                        {stage.stats.map((stat) => {
                          const quiet = 'quiet' in stat && stat.quiet;

                          return (
                          <li
                            key={stat.value}
                            /* The label can be a whole sentence — the EGP 6.5M
                               one has to be — so a chip wraps rather than
                               truncates. */
                            className="max-w-full rounded-card border border-line bg-cream px-4 py-3"
                          >
                            {/* A `quiet` figure is set smaller and dimmer: it
                                is a number that is not his, and the sentence
                                under it is the part that matters. */}
                            <p
                              className={cn(
                                'display leading-none',
                                quiet
                                  ? 'text-[calc(clamp(1rem,2.6vw,1.1875rem)*var(--display-scale))] text-ink-dim'
                                  : 'text-[calc(clamp(1.25rem,4vw,1.625rem)*var(--display-scale))] text-ink',
                              )}
                            >
                              <span className="num">{stat.value}</span>
                            </p>
                            <p
                              className={cn(
                                'mt-2 max-w-[30ch] leading-relaxed',
                                quiet ? 'text-[0.8125rem] text-ink' : 'text-xs text-ink-dim',
                              )}
                            >
                              {t(stat.label)}
                            </p>
                          </li>
                          );
                        })}
                      </ul>

                      {/* These three figures are the only ones on the site with
                          no dashboard behind them. The line says so, every
                          time they appear. */}
                      <p className="mt-2.5 text-[0.6875rem] text-ink-dim">{t(story.statsNote)}</p>
                    </div>
                  )}
                  </div>

                  {stage.art && (
                    <img
                      src={stage.art.src}
                      alt={t(stage.art.alt)}
                      width={stage.art.width}
                      height={stage.art.height}
                      loading="lazy"
                      decoding="async"
                      className="hidden h-auto w-full rounded-media border border-line lg:block"
                    />
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        {/* The conclusion, out of the numbered list: it is what the six steps
            added up to, not a seventh thing that happened to him. */}
        <Reveal delay={0.06}>
          <p className="display mt-14 max-w-[30ch] border-s-2 border-orange ps-5 text-[calc(clamp(1.375rem,4.4vw,2.25rem)*var(--display-scale))] leading-[var(--statement-leading)] text-ink md:mt-20">
            {t(story.closing)}
          </p>
        </Reveal>

        {/* The one diagram on the page, as the visual summary of all of it. */}
        <Reveal delay={0.1} className="mt-10 md:mt-12">
          <Chain steps={story.flow} tone="loud" />
        </Reveal>
      </Section>

      {/* --------------------------------------------------------- learned */}
      <Section>
        <SectionHead label={story.learned.label} title={story.learned.title} />

        <div className="mt-7 max-w-[56ch] space-y-4">
          {t(story.learned.body).map((paragraph, i) => (
            <Reveal key={paragraph} delay={0.04 * i}>
              <p className="text-[1.0625rem] leading-[1.8] text-ink-dim md:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- takeaway */}
      {/* The home page's own hero line, on purpose: the story ends where the
          landing began, so the reader arrives back at the positioning. */}
      <Section>
        <Reveal>
          <p className="display max-w-[16ch] text-balance text-[calc(clamp(1.875rem,6.4vw,3.25rem)*var(--display-scale))] text-ink">
            {t(story.takeaway.lead)}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="lede mt-6 max-w-[46ch] md:mt-8">{t(story.takeaway.body)}</p>
        </Reveal>

        <Reveal delay={0.14} className="mt-10 flex flex-wrap gap-3 md:mt-12">
          {/* Back into this site, never out of it. */}
          <Link
            to="home"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-colors duration-300 ease-out hover:bg-orange hover:text-on-orange md:text-base"
          >
            <BackArrow />
            {t(story.back)}
          </Link>

          <Button href={contact.whatsapp.href} tone="quiet">
            {t(contact.whatsapp.label)}
          </Button>
        </Reveal>
      </Section>
    </main>
  );
}
