import { Fragment, useRef } from 'react';
import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link } from '@/lib/router';
import { contact, fullStory, hero, identity } from '@/content/content';
import { heroExtra } from '@/content/redesign';
import { useFitName, useHeroMotion, useMagnetic } from '@/lib/motion';

/**
 * THE HERO: HIS NAME, AND HIM STANDING IN FRONT OF IT.
 *
 * Three layers, back to front:
 *   1. the name, set huge in a condensed black grotesque;
 *   2. the cut-out portrait (his own photograph, background removed only);
 *   3. the small type and the call round the edges.
 *
 * The name never runs across his face. Below `lg` the two words stack above
 * his head and his hair overlaps the bottom of the second line; from `lg` up
 * they sit on one line, pushed to the two edges, with his head in the gap.
 * Geometry lives in `.hero-stage` / `.hero-name` / `.hero-portrait` in
 * styles/index.css; the font size is fitted by `useFitName`.
 *
 * THE NAME IS LATIN IN BOTH LANGUAGES. It is the name on the domain and in
 * the tab, and its Arabic spelling has not been confirmed — a guessed
 * spelling of someone's own name does not go on their site.
 */
export default function Hero() {
  const { t, lang, isRTL } = useLang();
  const portraitRef = useRef<HTMLImageElement>(null);
  const nameRef = useFitName<HTMLHeadingElement>(portraitRef);
  const rootRef = useHeroMotion<HTMLElement>(lang);
  const headline = t(hero.headline).replace(/\.$/, '');

  return (
    <>
    <section ref={rootRef} id="top" className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[5.5rem] md:pt-28 lg:h-[100svh] lg:min-h-[40rem]">
      {/* ---- the role, the line, and the call: small, so the name leads */}
      <div className="container-page relative z-20 flex items-start justify-between gap-5">
        <div className="min-w-0 max-w-[36rem] lg:max-w-[30vw]">
          <p data-intro className="label eyebrow">
            {t(identity.role)}
          </p>
          <p data-intro className="display mt-4 text-[calc(clamp(1.5rem,2.6vw,2.5rem)*var(--display-scale))] leading-[1.04] text-ink md:mt-5">
            {headline}
            <span className="text-orange-ink">.</span>
          </p>
        </div>

        <div data-intro className="shrink-0">
          <TouchButton label={t(heroExtra.getInTouch)} isRTL={isRTL} />
        </div>
      </div>

      <div className="min-h-6 flex-1" />

      {/* ---- the stage: name behind, portrait in front */}
      <div className="hero-stage">
        <h1 ref={nameRef} data-name className="hero-name">
          {heroExtra.name.map((word, w) => (
            <Fragment key={word}>
            {/* A real space between the words, for anything that reads the
                text rather than the layout (crawlers, screen readers). A
                whitespace node in a flex box takes no room. */}
            {w > 0 && ' '}
            <span data-word className="hero-word" dir="ltr">
              {word.split('').map((letter, i) => (
                <span key={i} data-letter className="hero-letter">
                  {letter}
                </span>
              ))}
            </span>
            </Fragment>
          ))}
          <span className="sr-only"> · {t(identity.role)}</span>
        </h1>

        <picture>
          <source
            type="image/avif"
            srcSet="/img/hero-cutout-720.avif 720w, /img/hero-cutout-1334.avif 1334w"
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 84vw, 118vw"
          />
          <img
            ref={portraitRef}
            data-portrait
            src="/img/hero-cutout-1334.webp"
            srcSet="/img/hero-cutout-720.webp 720w, /img/hero-cutout-1334.webp 1334w"
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 84vw, 118vw"
            width={1334}
            height={1179}
            alt={t(heroExtra.portraitAlt)}
            decoding="async"
            {...{ fetchpriority: 'high' }}
            className="hero-portrait"
          />
        </picture>

        {/* The torso is cropped at the bottom of the photograph; this lets it
            settle into the page instead of ending on a hard line. */}
        <div aria-hidden className="hero-fade" />

        <div className="hero-meta container-page">
          <a data-intro href="#about" className="inline-flex items-center gap-2 text-xs font-medium text-ink">
            <span className="hero-scroll-dot" aria-hidden />
            {t(heroExtra.scroll)}
            <span aria-hidden>↓</span>
          </a>
          <span data-intro aria-hidden className="rule-dots hidden flex-1 text-line md:block" />
          <span data-intro className="num text-xs font-medium text-ink-dim">
            {heroExtra.platforms}
          </span>
        </div>
      </div>
    </section>

    {/* ---- what the headline means, right under the first screen */}
    <section aria-label={t(identity.role)} className="border-t border-line">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 md:py-16">
        <p className="display max-w-[40ch] text-[calc(clamp(1.125rem,2.2vw,1.75rem)*var(--display-scale))] leading-[1.35] text-ink-dim">
          {t(hero.subline)}
        </p>
        <Link to="story" className="link-line shrink-0 text-sm font-semibold text-ink md:text-base">
          {t(fullStory.cta)}
          <span aria-hidden className={cn('inline-block', isRTL && '-scale-x-100')}>
            →
          </span>
        </Link>
      </div>
    </section>
    </>
  );
}

/**
 * The call. A lime SLAB with near-black type on it — the one shape the raw
 * lime is allowed to take on every theme — inside a ring of small type that
 * turns slowly. It leans toward a fine pointer.
 */
function TouchButton({ label, isRTL }: { label: string; isRTL: boolean }) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <div className="touch relative grid place-items-center">
      <svg viewBox="0 0 200 200" aria-hidden className="touch-ring absolute inset-0 h-full w-full text-ink-dim">
        <defs>
          <path id="touch-ring-path" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
        </defs>
        <text className="fill-current text-[11.5px] font-semibold tracking-[0.2em]" direction="ltr">
          <textPath href="#touch-ring-path" textLength={536} lengthAdjust="spacing">
            {heroExtra.ring}
          </textPath>
        </text>
      </svg>
      <a
        ref={ref}
        href={contact.whatsapp.href}
        target="_blank"
        rel="noreferrer noopener"
        className="touch-btn relative grid place-items-center rounded-full bg-orange text-center text-on-orange"
      >
        <span className="flex flex-col items-center gap-1 px-2 text-[0.6875rem] font-bold uppercase leading-tight tracking-[0.08em] md:text-xs">
          <span aria-hidden className={cn('text-lg leading-none md:text-xl', isRTL && '-scale-x-100')}>
            ↗
          </span>
          {label}
        </span>
      </a>
    </div>
  );
}
