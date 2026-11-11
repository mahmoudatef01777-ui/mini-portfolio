import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * The redesign's motion kit. Same rules as lib/reveal.ts:
 *  - every tween is created inside `gsap.matchMedia()` on reduced motion, so a
 *    visitor who asked for less gets no animation object at all;
 *  - `fromTo` with both ends written, never a bare `from`;
 *  - nothing is hidden in CSS, and nothing that carries meaning is faded out
 *    for longer than its own tween.
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION = '(prefers-reduced-motion: no-preference)';

/**
 * THE GIANT NAME, FITTED TO THE WIDTH IT HAS.
 *
 * Two layouts, chosen by CSS and read back here from `flex-direction`:
 *   column  (below lg): the two words stacked, each as wide as the column;
 *   row     (lg up):    one line, the words pushed to the two edges with a
 *                       gap the size of his head between them, so the face
 *                       sits in the gap and never has a letter across it.
 *
 * The CSS carries a vw estimate so the first paint (and the prerendered
 * snapshot) is already close; this only corrects it once the face is known.
 */
export function useFitName<T extends HTMLElement>(portrait: React.RefObject<HTMLElement>) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'));
      if (words.length === 0) return;
      el.style.fontSize = '';
      words.forEach((w) => (w.style.fontStretch = ''));
      const cs = getComputedStyle(el);
      const base = parseFloat(cs.fontSize);
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const row = cs.flexDirection.startsWith('row');
      const widths = words.map((w) => w.getBoundingClientRect().width);
      if (!base || !width || widths.some((w) => !w)) return;

      /*
        THE TWO WORDS ARE MADE THE SAME WIDTH. MAHMOUD is wider than ELZAQLA;
        set in one cut, the row's gap would sit off-centre (the head would
        cover a letter) and the stacked block would have a ragged edge. The
        width axis fixes both: the narrower word is set a little wider
        (font-stretch) until the two match.
      */
      const widest = Math.max(...widths);
      words.forEach((w, i) => {
        w.style.fontStretch = `${Math.min(125, 62 * (widest / widths[i]))}%`;
      });
      const matched = Math.max(...words.map((w) => w.getBoundingClientRect().width));

      if (row) {
        // Both halves either side of a gap the width of his head.
        const pw = portrait.current?.getBoundingClientRect().width ?? width * 0.45;
        const gap = pw * 0.25;
        el.style.fontSize = `${(base * (width - gap)) / 2 / matched}px`;
      } else {
        el.style.fontSize = `${(base * width) / matched}px`;
      }
    };

    /*
      Re-fit whenever the WORDS change size, not only the box: the condensed
      cut of Archivo arrives after first paint, and `document.fonts.ready`
      can resolve before that request has even started. The fit is
      idempotent, so the observer settles after one pass.
    */
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    fit();
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener?.('loadingdone', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    el.querySelectorAll('[data-word]').forEach((w) => ro.observe(w));
    if (portrait.current) ro.observe(portrait.current);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', schedule);
    };
  }, [portrait]);

  return ref;
}

/**
 * The hero's entrance and its parallax.
 *
 *   [data-letter]   each letter of the name, rising out of its own line
 *   [data-portrait] the cut-out — TRANSFORM ONLY. It is the LCP element, and
 *                   an image that fades from zero does not count as painted
 *                   until the fade ends.
 *   [data-intro]    the small type round the edges, after the name
 */
export function useHeroMotion<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(
        q('[data-portrait]'),
        { yPercent: 8, scale: 1.04 },
        { yPercent: 0, scale: 1, duration: 1.6 },
        0,
      )
        .fromTo(
          q('[data-letter]'),
          { yPercent: 105 },
          { yPercent: 0, duration: 1.1, stagger: 0.035 },
          0.1,
        )
        .fromTo(
          q('[data-intro]'),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
          0.45,
        );

      // Leaving the hero: the name drifts down behind him while he rises a
      // touch faster, which is what sells the layers as layers.
      const st = gsap
        .timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
        .fromTo(q('[data-name]'), { yPercent: 0 }, { yPercent: 35, ease: 'none' }, 0)
        .fromTo(q('[data-portrait]'), { y: 0 }, { y: -40, ease: 'none', immediateRender: false }, 0);

      // Rescue: if a tab was hidden at load, rAF never ran the intro.
      const rescue = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3500);

      return () => {
        window.clearTimeout(rescue);
        tl.kill();
        st.scrollTrigger?.kill();
        st.kill();
      };
    });

    return () => mm.revert();
  }, [key]);

  return ref;
}

/**
 * A button that leans toward the pointer. Fine pointers only: on a phone
 * there is no pointer to follow, and the effect would only lag the tap.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => {
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.set(el, { clearProps: 'transform' });
      };
    });

    return () => mm.revert();
  }, [strength]);

  return ref;
}

/**
 * A statement that lights up word by word as it is scrolled through.
 *
 * By WORD, in both scripts: Arabic is cursive and splitting it by letter
 * breaks the joins. The dim state is a real colour at reading contrast
 * (ink at 22% is still a shape on the page), and it is scrubbed, so the
 * reader's own scroll is the clock and stopping leaves it where it is.
 */
export function useScrubWords<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;
        split = new SplitText(ref.current, { type: 'words', wordsClass: 'split-word' });
        tween = gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true },
          },
        );
      });

      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    });

    return () => mm.revert();
  }, [key]);

  return ref;
}

/**
 * An image that is uncovered from its reading edge as it scrolls in, and
 * drifts a little inside its frame while it is on screen.
 */
export function useClipReveal<T extends HTMLElement>(isRTL: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      const from = isRTL ? 'inset(0% 0% 0% 100% round 1.5rem)' : 'inset(0% 100% 0% 0% round 1.5rem)';
      const tween = gsap.fromTo(
        el,
        { clipPath: from },
        {
          clipPath: 'inset(0% 0% 0% 0% round 1.5rem)',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
      // Same safety net as everywhere else: never leave it covered on screen.
      const rescue = window.setTimeout(function check() {
        if (!el.isConnected) return;
        if (el.getBoundingClientRect().top < window.innerHeight && tween.progress() === 0) {
          tween.progress(1);
        } else if (tween.progress() === 0) {
          rescue2 = window.setTimeout(check, 1500);
        }
      }, 2500);
      let rescue2 = 0;
      return () => {
        window.clearTimeout(rescue);
        window.clearTimeout(rescue2);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(el, { clearProps: 'clipPath' });
      };
    });

    return () => mm.revert();
  }, [isRTL]);

  return ref;
}
