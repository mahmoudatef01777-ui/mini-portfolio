import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Scroll motion, on GSAP.
 *
 * This used to be one IntersectionObserver adding a class with CSS doing the
 * rest, and that was the right call while the page only needed eight fades.
 * Mahmoud asked for real motion, so it is GSAP now — ScrollTrigger for the
 * reveals and SplitText for the headline that is worth animating a word at
 * a time.
 *
 * EVERY ANIMATION IS CREATED INSIDE `gsap.matchMedia()`, keyed on reduced
 * motion. A visitor who has asked for less does not get a disabled
 * animation; they get no animation object at all, and the markup as
 * authored.
 *
 * NOTHING IS INVISIBLE BY DEFAULT ANY MORE. The old `.reveal` class set
 * `opacity: 0` in CSS, so a visitor with JavaScript off — or a crawler that
 * runs none — met a blank page, and a missed observer left a block hidden
 * for the rest of the visit. `gsap.from()` sets the start state at runtime
 * instead: the markup ships visible and GSAP hides it only for the length
 * of the tween. That removes the `sweep()` safety net this file used to
 * need, because there is no longer a failure mode to catch.
 */

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * REFRESH ONCE EVERYTHING HAS SETTLED, AND THIS IS NOT OPTIONAL.
 *
 * ScrollTrigger measures where each trigger sits the moment it is created.
 * On this page that happens before Amiri and Libre Bodoni have swapped in
 * and before a dozen lazy dashboard captures have reserved their space, so
 * every start position computed at mount is for a page that is about to get
 * taller. Triggers further down then sit at coordinates the reader scrolls
 * straight past without ever crossing.
 *
 * That is not a cosmetic failure. These are `gsap.from()` tweens, which set
 * their start state immediately — so a trigger that never fires leaves its
 * card at `opacity: 0` for the whole visit. The growth section did exactly
 * that: six cards, invisible, scrolled past. A missed animation is a lost
 * animation; a missed `from` is lost CONTENT.
 *
 * So: recompute when the fonts land, when the window finishes loading, and
 * whenever an image inside the document finishes decoding. The last one is
 * capture-phase because `load` on an <img> does not bubble.
 */
function scheduleRefresh() {
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
  window.addEventListener('load', () => {
    document.addEventListener('load', refresh, { capture: true });
  }, { once: true });
}

if (typeof window !== 'undefined') scheduleRefresh();

/**
 * THE SAFETY NET, kept from the version before this one.
 *
 * `ScrollTrigger.refresh()` fixes the measurement, but nothing can promise
 * that every trigger on every device fires. Since a tween that does not run
 * leaves content invisible, anything still hidden a few seconds in is
 * revealed outright. A reader who never sees the animation has lost
 * nothing; a reader who never sees the text has lost the page.
 */
function failSafe(el: Element) {
  window.setTimeout(() => {
    if (!el.isConnected) return;

    // The element AND anything a timeline may have hidden inside it. The
    // first version only checked the element, which on a card whose own
    // opacity was never touched meant it declared the card fine and left
    // every part of it invisible.
    const parts = el.querySelectorAll<HTMLElement>(
      '[data-rule],[data-num],[data-head],[data-lead],[data-point]',
    );
    const hidden = [el, ...Array.from(parts)].filter((node) => {
      const style = window.getComputedStyle(node);
      // Opacity catches the faded parts; the matrix catches a rule left
      // flat at scaleX 0, which is invisible without being transparent.
      return Number(style.opacity) < 0.95 || style.transform.startsWith('matrix(0,');
    });
    if (hidden.length > 0) gsap.set(hidden, { clearProps: 'opacity,transform' });
  }, 4000);
}


/** Attach to any element that should arrive as it is scrolled to. */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /*
        A fade with a short lift, not a slide. 12px is what the "subtle"
        preset uses and it is the right distance: far enough to read as
        arriving, near enough that a fast scroll does not leave a column of
        half-placed blocks behind it.

        `toggleActions: 'play none none none'` — play once and stay. The
        preset's default reverses on scroll-up, which suits a hero and is
        wrong for a page of evidence: scrolling back to re-read a figure
        should not fade it out.
      */
      // `fromTo` for the reason spelled out in useCardIntro: `from` reads
      // the current value as its destination, and a second run reads the
      // zero the first one left behind.
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        },
      );
      failSafe(el);
    });

    return () => mm.revert();
  }, [delay]);

  return ref;
}

/**
 * The one headline on a page, set a word at a time.
 *
 * WORDS, NOT CHARACTERS, AND THAT IS NOT A STYLE CHOICE. Arabic is
 * cursive: a letter's shape depends on what it joins to, and splitting a
 * word into per-character spans breaks those joins — the browser re-renders
 * each letter in its isolated form and the heading becomes unreadable. The
 * usual char-stagger demo only works because the demo is in English. Words
 * are safe in both scripts, so both get words, and the two languages then
 * animate identically instead of one being a downgrade of the other.
 *
 * Reserved for the hero. Splitting creates a DOM node per word, and the
 * guidance is to keep it to headlines of under about eight words.
 */
export function useSplitHeadline<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let split: SplitText | null = null;
      let cancelled = false;

      /*
        Split only once the fonts are in. SplitText measures the text to
        place its spans, so splitting against the fallback face and then
        having Amiri or Libre Bodoni swap in mid-tween re-wraps the line
        underneath the animation. Waiting costs a few frames and removes
        the whole class of bug.
      */
      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;
        split = new SplitText(ref.current, { type: 'words', wordsClass: 'split-word' });
        gsap.from(split.words, {
          opacity: 0,
          yPercent: 45,
          duration: 0.7,
          stagger: 0.045,
          ease: 'expo.out',
        });
      });

      return () => {
        cancelled = true;
        // Put the original text nodes back. A screen reader handed a
        // headline as per-word spans reads it as a list of words.
        split?.revert();
      };
    });

    return () => mm.revert();
  }, [key]);

  return ref;
}

/**
 * A list that arrives one item at a time.
 *
 * `useReveal` fades a whole block, which is right for a paragraph and wrong
 * for a list: six bullets appearing together is the same event as one
 * paragraph appearing, and the reader is told nothing about the order they
 * are meant to be read in. This tweens the container's direct CHILDREN on a
 * stagger, so the list assembles down the page in reading order.
 *
 * The numbers are the "stagger list" guidance: 20-40ms per item once a list
 * is long, never more than 100ms, or the last bullet arrives after the
 * reader has finished with the first. `each` defaults to 55ms, which suits
 * the three-to-six-item lists this page actually has.
 *
 * DIRECT CHILDREN, read at effect time. That means the container must own
 * its items — do not point this at a wrapper that holds one <ul>, or the
 * single <ul> is the only thing that staggers.
 */
export function useStagger<T extends HTMLElement>(each = 0.055, y = 10) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = Array.from(el.children);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: each,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        },
      );
      items.forEach(failSafe);
    });

    return () => mm.revert();
  }, [each, y]);

  return ref;
}

/**
 * A card that assembles itself, in the order a reader takes it in.
 *
 * `useStagger` fades a list; this builds a short TIMELINE out of the parts
 * of one card, so the rule draws, the number arrives, the heading follows
 * and the bullets come in one at a time underneath it. Six cards each doing
 * that on their own trigger is the difference between a page that fades and
 * a page that presents itself.
 *
 * The parts are found by data attribute rather than by position, so moving
 * the markup around does not silently animate the wrong element:
 *
 *   [data-rule]   the hairline over the card — drawn, not faded
 *   [data-num]    the stage number
 *   [data-head]   the stage name
 *   [data-lead]   the sentence under it
 *   [data-point]  the bullets, staggered
 *
 * ALL MOVEMENT COMES FROM THE READING SIDE. `x` is signed by direction: in
 * Arabic the parts arrive from the right, in English from the left. A fixed
 * negative x would have the Arabic cards sliding in backwards.
 */
export function useCardIntro<T extends HTMLElement>(isRTL: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el);
      const from = isRTL ? 14 : -14;

      /*
        A PAUSED TIMELINE PLAYED BY AN EXPLICIT TRIGGER, not a timeline with
        a `scrollTrigger` of its own.

        The first version handed the config to `gsap.timeline({scrollTrigger})`
        and the tweens set their start state — scaleX 0, opacity 0 — and then
        never advanced: the trigger did not fire and six cards sat invisible
        on the page. Building the timeline paused and calling `play()` from
        `ScrollTrigger.create({ onEnter })` separates the two concerns, so a
        trigger problem can only cost the animation, never the content.

        `once: true` because this is an entrance. Re-running it when the
        reader scrolls back up would hide a card they are returning to read.
      */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

      /*
        `fromTo`, NOT `from`, AND THAT IS A BUG FIX.

        `gsap.from()` reads the element's CURRENT value and uses it as the
        end of the tween. That is fine once. It is not fine when the effect
        runs twice — which it does under React's StrictMode in development,
        and again on every hot reload: the first pass leaves `scaleX: 0`
        inline, the second reads that 0 as the destination, and the rule
        animates from 0 to 0 and is never seen again. Spelling both ends out
        makes the tween say what it means regardless of what it finds.
      */
      // The rule draws from the reading edge outward. `scaleX` on a 1px line
      // is free; a width tween would relayout every frame.
      tl.fromTo(
        q('[data-rule]'),
        { scaleX: 0, transformOrigin: isRTL ? 'right center' : 'left center' },
        { scaleX: 1, duration: 0.5 },
      )
        .fromTo(
          q('[data-num]'),
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.35 },
          '-=0.25',
        )
        .fromTo(q('[data-head]'), { opacity: 0, x: from }, { opacity: 1, x: 0, duration: 0.4 }, '<0.05')
        .fromTo(q('[data-lead]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
        .fromTo(
          q('[data-point]'),
          { opacity: 0, x: from },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.06 },
          '-=0.2',
        );

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 86%',
        once: true,
        onEnter: () => tl.play(),
      });

      failSafe(el);

      return () => {
        st.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [isRTL]);

  return ref;
}

/**
 * A list the scroll settles on, one stage at a time.
 *
 * Mahmoud asked for a reader who cannot simply scroll past the whole story
 * — each scroll should land them on the next stage. There are two ways to
 * build that and only one of them is defensible.
 *
 * THE WAY THIS DOES NOT WORK: pinning the section and driving the stages
 * from scroll progress. It looks impressive and it takes the scrollbar away
 * from the reader — the page stops responding to the gesture they made, the
 * keyboard stops moving a predictable distance, and on a phone it fights
 * the one interaction the device has. A portfolio that an agency owner
 * cannot skim is a portfolio they close.
 *
 * WHAT IT DOES INSTEAD: the page scrolls normally, and when the reader
 * STOPS, it settles to the nearest stage. Flicking still crosses several,
 * Page Down still works, the scrollbar still means what it says — but a
 * normal scroll gesture comes to rest on a stage rather than between two.
 * Same intent, no hijack.
 *
 * Laptop only, and only without reduced motion: snapping is a pointer
 * affordance, and on a touch screen it would be fighting momentum.
 */
export function useStepSnap<T extends HTMLElement>(itemSelector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      /*
        The snap points are measured, not guessed, and re-measured on every
        refresh: the stages are different heights, so an even 1/n split
        would pull the reader to a point between two of them.
      */
      const points = () => {
        const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
        const total = el.scrollHeight - window.innerHeight;
        if (total <= 0 || items.length === 0) return [0];
        const top = el.getBoundingClientRect().top + window.scrollY;
        return items.map((item) => {
          const y = item.getBoundingClientRect().top + window.scrollY - top;
          return gsap.utils.clamp(0, 1, y / total);
        });
      };

      let snaps = points();

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onRefresh: () => {
          snaps = points();
        },
        snap: {
          snapTo: (progress) => gsap.utils.snap(snaps, progress),
          // Long enough to read as a settle, short enough that it is over
          // before the reader has decided it is stuck.
          duration: { min: 0.15, max: 0.45 },
          // Only after the scroll has actually stopped. Without the delay
          // it grabs the page mid-flick.
          delay: 0.12,
          ease: 'power1.inOut',
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, [itemSelector]);

  return ref;
}
