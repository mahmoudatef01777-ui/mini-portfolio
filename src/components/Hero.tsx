import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { Link } from '@/lib/router';
import { contact, fullStory, hero, identity } from '@/content/content';
import { heroExtra } from '@/content/redesign';
import { useHeroMotion, useMagnetic } from '@/lib/motion';

/**
 * THE HERO, AFTER THE "MATTHEW" REFERENCE.
 *
 * A rounded panel; his name in a condensed black grotesque, running past
 * BEHIND him in a loop (it speeds up while the page is scrolled); the cut-out
 * portrait standing in front of it; thin drawn arcs behind both; the role
 * top-start, the round call top-end, "scroll down" at the foot.
 *
 * Because he stands in front of the type, the letters only ever pass behind
 * his head and shoulders, never across his face.
 *
 * THE NAME IS LATIN IN BOTH LANGUAGES. It is the name on the domain and in
 * the tab, and its Arabic spelling has not been confirmed.
 */
export default function Hero() {
  const { t, lang, isRTL } = useLang();
  const rootRef = useHeroMotion<HTMLElement>(`${lang}`, isRTL);
  const headline = t(hero.headline).replace(/\.$/, '');
  const name = heroExtra.name.join(' ');

  return (
    <>
      <section ref={rootRef} id="top" className="hero-shell">
        <div className="hero-panel">
          {/* ---- the drawn arcs, behind everything */}
          <svg aria-hidden className="hero-arcs" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <circle data-arc cx="230" cy="330" r="310" pathLength={1} />
            <circle data-arc cx="860" cy="560" r="230" pathLength={1} />
          </svg>

          {/* ---- the role, the line, and the call */}
          <div className="container-page relative z-20 flex items-start justify-between gap-5">
            <div className="min-w-0 max-w-[36rem] lg:max-w-[30vw]">
              <p data-intro className="label eyebrow">
                {t(identity.role)}
              </p>
              <p
                data-intro
                className="display mt-4 text-[calc(clamp(1.5rem,2.6vw,2.5rem)*var(--display-scale))] leading-[1.04] text-ink md:mt-5"
              >
                {headline}
                <span className="text-orange-ink">.</span>
              </p>
            </div>
            <div data-intro className="shrink-0">
              <TouchButton label={t(heroExtra.getInTouch)} isRTL={isRTL} />
            </div>
          </div>

          <div className="min-h-6 flex-1" />

          {/* ---- the stage: the running name behind, the portrait in front */}
          <div className="hero-stage">
            <div data-name className="hero-name">
              <div className="hero-name-clip">
                <div data-rise>
                  <div data-track className="hero-track" dir="ltr">
                    {/* The first copy is the page's <h1>; the rest are the
                        loop, hidden from assistive tech and from crawlers'
                        text so the name is read once. */}
                    <h1 className="hero-chunk">
                      {name}
                      <span className="sr-only"> · {t(identity.role)}</span>
                      <span aria-hidden className="hero-sep">/</span>
                    </h1>
                    {[1, 2, 3].map((i) => (
                      <span key={i} aria-hidden className="hero-chunk">
                        {name}
                        <span className="hero-sep">/</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <picture>
              <source
                type="image/avif"
                srcSet="/img/hero-cutout-720.avif 720w, /img/hero-cutout-1334.avif 1334w"
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 84vw, 118vw"
              />
              <img
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

            <div aria-hidden className="hero-fade" />

            <div className="hero-meta container-page">
              <a data-intro href="#results" className="inline-flex items-center gap-2 text-xs font-medium text-ink">
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
        </div>
      </section>

      {/* ---- what the headline means, right under the first screen */}
      <section aria-label={t(identity.role)}>
        <div className="container-page grid gap-8 py-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 md:py-20">
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
 * The call. A lime SLAB with near-black type on it, inside a ring of small
 * type that turns slowly. It leans toward a fine pointer.
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
