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
 * The hero: entrance, the running name, and the parallax out.
 *
 *   [data-portrait] the cut-out. TRANSFORM ONLY: it is the LCP element, and
 *                   an image that fades from zero does not count as painted
 *                   until the fade ends.
 *   [data-rise]     the name rising into its clipped line
 *   [data-track]    the name's loop: four copies, travelling half its width,
 *                   so the seam is invisible. Faster while the page scrolls,
 *                   easing back to cruising speed when it stops.
 *   [data-arc]      the thin circles, drawn on
 *   [data-intro]    the small type round the edges
 *
 * Arabic reads the other way, so the name travels the other way.
 */
export function useHeroMotion<T extends HTMLElement>(key: string, isRTL = false) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(q('[data-portrait]'), { yPercent: 8, scale: 1.04 }, { yPercent: 0, scale: 1, duration: 1.6 }, 0)
        .fromTo(q('[data-rise]'), { yPercent: 110 }, { yPercent: 0, duration: 1.3 }, 0.15)
        .fromTo(q('[data-arc]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, stagger: 0.2, ease: 'power2.inOut' }, 0.2)
        .fromTo(
          q('[data-intro]'),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
          0.45,
        );

      // The loop. `xPercent` on the track, which holds the name four times:
      // -50% is exactly two copies, so the restart lands on an identical frame.
      const loop = gsap.fromTo(
        q('[data-track]'),
        { xPercent: isRTL ? -50 : 0 },
        { xPercent: isRTL ? 0 : -50, duration: 26, ease: 'none', repeat: -1 },
      );

      // Scroll pushes it: the speed follows the scroll's velocity, then
      // settles back to 1 once the reader stops.
      const speed = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        // Off screen, the loop stops: no reason to animate what nobody sees.
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const boost = 1 + Math.min(5, Math.abs(self.getVelocity()) / 300);
          gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, overwrite: false, ease: 'power2.out' });
        },
      });

      // Leaving the hero: the name drifts down behind him while he rises.
      const out = gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 } })
        .fromTo(q('[data-name]'), { yPercent: 0 }, { yPercent: 40, ease: 'none' }, 0)
        .fromTo(q('[data-portrait]'), { y: 0 }, { y: -40, ease: 'none', immediateRender: false }, 0);

      // If the tab was hidden at load, rAF never ran the intro.
      const rescue = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3500);

      return () => {
        window.clearTimeout(rescue);
        tl.kill();
        loop.kill();
        speed.kill();
        out.scrollTrigger?.kill();
        out.kill();
      };
    });

    return () => mm.revert();
  }, [key, isRTL]);

  return ref;
}

/**
 * A heading that lights up as it arrives: from a dim grey to full ink, and
 * up out of its own line. The "/ABOUT" in the reference does exactly this.
 */
export function useGiantTitle<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const inner = el.querySelector('[data-giant]');
      if (!inner) return;
      const tween = gsap.fromTo(
        inner,
        { yPercent: 60, opacity: 0.15 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: 0.5 },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(inner, { clearProps: 'all' });
      };
    });
    return () => mm.revert();
  }, [key]);

  return ref;
}

/**
 * The cover that follows the pointer over the Selected-work list, as in the
 * reference. Fine pointers only; on touch the covers are inline instead.
 */
export function useFollowCursor<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => {
      const card = el.querySelector<HTMLElement>('[data-follow]');
      if (!card) return;
      const x = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x(e.clientX - r.left);
        y(e.clientY - r.top);
      };
      el.addEventListener('pointermove', move);
      return () => el.removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  }, []);

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
