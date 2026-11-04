import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { proofUi } from '@/content/proof';
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
  const { t, isRTL } = useLang();
  const frameRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  /*
    A STOP BUTTON, because the rail moves on its own.

    Hover and focus-within already pause it, and neither of those is a
    control: a reader on a touch screen has no hover, and a reader who
    simply wants the movement to stop has nothing to press. Anything that
    moves by itself for more than five seconds needs a way to pause it, and
    this loop runs for a minute and more. So there is a real button, and
    the paused state is an attribute the stylesheet reads.
  */
  const [paused, setPaused] = useState(false);

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
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !isRTL) return;
    const swipeable =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (swipeable) el.scrollLeft = el.scrollWidth;
  }, [isRTL]);

  /**
   * About eleven seconds per card, so a rail of five is not slower to read
   * than a rail of two — the cards cross the screen at the same speed
   * whatever the section holds. It is a reading pace: slow enough that a
   * figure can be taken in before it leaves.
   */
  const duration = Math.max(36, items.length * 11);

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
        data-paused={paused}
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

      {/*
        The control sits UNDER the rail, not over it. A button floating on
        top of moving cards is one more thing sliding past the reader, and
        it would cover part of a capture. `aria-pressed` carries the state
        for a screen reader; the label says what pressing it will do.
      */}
      <button
        type="button"
        onClick={() => setPaused((on) => !on)}
        aria-pressed={paused}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition-colors duration-300 ease-out hover:border-ink"
      >
        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden>
          {paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />}
        </svg>
        {t(paused ? proofUi.play : proofUi.pause)}
      </button>
    </div>
  );
}
