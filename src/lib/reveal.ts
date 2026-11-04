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
      gsap.from(el, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
      });
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

      gsap.from(items, {
        opacity: 0,
        y,
        duration: 0.5,
        ease: 'power2.out',
        stagger: each,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });

    return () => mm.revert();
  }, [each, y]);

  return ref;
}
