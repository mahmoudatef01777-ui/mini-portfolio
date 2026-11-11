import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';

/**
 * THE PROOF RAIL — the evidence sideways, and moving on its own.
 *
 * The proof sections used to stack: result cards in a grid, Ads Manager
 * captures one under the other. On a phone that is a very long scroll of
 * dashboards, and the reader meets the third capture a screen and a half
 * after they stopped caring. Here the cards travel past instead, and the one
 * after them is always already half in view.
 *
 * THE MECHANICS ARE IN CSS, not here — see `.marquee` in styles/index.css for
 * why the list is rendered twice, why the gap is a margin rather than `gap`,
 * and what happens on a touch screen and under reduced motion. This file only
 * builds the two copies and decides which way the rail travels.
 *
 * WHY `dir="ltr"` ON THE FRAME. The animation is a `translateX`, which does
 * not know about writing direction — under `rtl` the flex row lays out from
 * the right and the same translate walks the rail backwards into its own
 * empty space. So the track is laid out left-to-right in both languages and
 * Arabic simply runs the animation in reverse, which is the same motion the
 * other way round. Each card sets its own `dir` for its text.
 */
export default function Carousel({
  label,
  children,
  itemClassName,
  className,
}: {
  /** Names the rail for a screen reader — the section it belongs to. */
  label: string;
  children: ReactNode;
  /** The width of one card. Give it a viewport width so the next one peeks. */
  itemClassName?: string;
  className?: string;
}) {
  const { isRTL } = useLang();
  const frameRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

/*
    NO STOP BUTTON. There was one — hover and focus-within pause the rail
    but neither is a control, and a reader on a touch screen has no hover
    at all. Mahmoud took it off on 2026-11-04. What still stops the rail:
    a pointer on it, a keyboard focus inside it, and prefers-reduced-motion,
    which removes the movement entirely rather than pausing it.
  */

  /**
   * On a touch screen the rail is a plain scroller (the clone is hidden and
   * the animation is off), and a scroller laid out left-to-right opens on its
   * first card at the LEFT. In Arabic the first card belongs at the right, so
   * it starts scrolled to the far end.
   *
   * THE CONDITION IS THE FALLBACK, NOT "IS IT SCROLLABLE". An `overflow:
   * hidden` box is still a scroll container with a `scrollWidth` far past its
   * width, so testing for overflow was true on a desktop too — and scrolling
   * a travelling rail to its end pushed every card out of the frame and left
   * the whole section blank. The rail only has a reading position to fix when
   * the animation is off, which is exactly these two queries.
   */
  /*
    PAUSED WHEN OFF SCREEN. The rail and the lime line running round each
    card are endless CSS animations; left running below the fold they keep
    the compositor busy for the whole visit. `data-visible` is what lets them
    play (see `.marquee` in styles/index.css).
  */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.setAttribute('data-visible', '');
        else el.removeAttribute('data-visible');
      },
      { rootMargin: '150px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || !isRTL) return;
    /*
      REDUCED MOTION ONLY, now that the rail travels on touch screens as
      well. This jump exists for the case where the rail is a STATIC
      scroller: laid out left-to-right, it would open on its first card at
      the left, and in Arabic the first card belongs at the right. A
      travelling rail has no resting position to fix, and sending it to the
      far end would start the reader inside the duplicate copy.
    */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [isRTL]);

  /**
   * Seconds per card, so a rail of five is not slower to read than a rail
   * of two — the cards cross at the same speed whatever the section holds.
   *
   * DOUBLED on 2026-11-04 at Mahmoud's request. Eleven seconds a card was
   * a reading pace and it read as standing still; five and a half is a
   * drift you can see without it becoming a slideshow. It still stops the
   * moment a pointer touches the rail or the stop button is pressed.
   */
  const duration = Math.max(18, items.length * 5.5);

  const copy = (clone: boolean) =>
    items.map((item, i) => (
      <li
        key={`${clone ? 'clone' : 'card'}-${i}`}
        /* The second copy exists only so the loop has somewhere to land — see
           the note in the stylesheet. `inert` is what takes the whole subtree
           out of the tab order and off the accessibility tree; `tabIndex` on
           the <li> would not, because the focusable things are the buttons
           INSIDE it, and a reader meeting every figure and every "view the
           evidence" twice is being shown a longer results section than the
           page has. Spread rather than written out: React 18 does not know
           the attribute, and this passes it straight through to the DOM. */
        {...(clone ? { 'aria-hidden': true as const, ...{ inert: '' } } : {})}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn('marquee-item flex shrink-0', itemClassName)}
      >
        {item}
      </li>
    ));

  return (
    <div className={className}>
      <div
        ref={frameRef}
        dir="ltr"
          className="marquee mx-[calc(var(--gutter)*-1)]"
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
      {/*
        `items-stretch`, and the card has to earn it. These cards carry very
        different amounts — one capture comes with a headline figure and its
        figures, the next with a single line — and both ways of handling
        that have a failure mode. Left to their own heights, the rail is
        still as tall as its tallest card and a phone showing one short card
        at a time shows it above a screen of nothing. Stretched, every card
        is the tall one's height and the short ones are mostly air.
        Stretched is the better of the two: the gap ends up inside a bordered
        card instead of below the rail. The cards are kept close in height at
        the other end, in Sections.tsx, by setting the figures two to a row.
      */}
        <ul aria-label={label} className={cn('marquee-track items-stretch', isRTL && 'reverse')}>
          {copy(false)}
          {copy(true)}
        </ul>
      </div>

    </div>
  );
}
