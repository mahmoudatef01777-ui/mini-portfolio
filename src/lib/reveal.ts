import { useEffect, useRef } from 'react';

/**
 * Scroll reveal, with ONE observer for the whole page.
 *
 * Every `.reveal` element registers with the same IntersectionObserver, which
 * adds `.is-in` and then stops watching it — a reveal happens once. CSS owns
 * the movement (see styles/index.css).
 *
 * Deliberately not an animation library. The page is opened from a phone, on
 * mobile data, from an Instagram bio; a motion runtime would be larger than
 * everything else here put together, and eight fades do not need one.
 *
 * THE SWEEP IS NOT OPTIONAL. An IntersectionObserver reports what is
 * intersecting when it happens to check, which means an element can be
 * skipped entirely — by a fast flick, by a jump to an anchor, or by the
 * browser restoring a scroll position on reload. A skipped element keeps
 * `opacity: 0` and is invisible for the rest of the visit. So alongside the
 * observer, `sweep()` reveals anything the viewport has already passed. It
 * reads layout, so it runs only on load and inside the observer's own
 * callback — never on a scroll listener.
 */
const watched = new Set<Element>();
let observer: IntersectionObserver | null = null;

function reveal(el: Element) {
  el.classList.add('is-in');
  watched.delete(el);
  observer?.unobserve(el);
}

/** Anything the viewport has already reached is shown, observed or not. */
function sweep() {
  for (const el of [...watched]) {
    if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
  }
}

function get(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
      sweep();
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  window.addEventListener('load', sweep, { once: true });
  return observer;
}

/** Attach to any element that should fade up when it is scrolled to. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser cannot observe, show the content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    const io = get();
    watched.add(el);
    io.observe(el);

    // Whatever is already on screen at mount reveals on the next frame,
    // rather than waiting for a scroll that may never come on a short page.
    const raf = requestAnimationFrame(sweep);

    return () => {
      cancelAnimationFrame(raf);
      watched.delete(el);
      io.unobserve(el);
    };
  }, []);

  return ref;
}
