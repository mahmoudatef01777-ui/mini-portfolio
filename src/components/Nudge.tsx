import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLang } from '@/i18n/lang';
import { contact } from '@/content/content';
import { nudge } from '@/content/redesign';
import { track } from '@/lib/track';

/**
 * THE 15-SECOND NUDGE.
 *
 * Fifteen seconds into a visit, a small lime message pops out of the LEFT
 * edge, bottom corner: first a half circle bulges out of the screen edge
 * (with Shopify's new-order chime), then it stretches into a pill carrying
 * his face and the line Mahmoud chose. Tapping it opens WhatsApp on his
 * number with a message already typed; the visitor only presses send.
 *
 * It then tucks back into the half circle and comes again, chime and all,
 * each wait five seconds longer than the last: 20 seconds after the first,
 * then 25, then 30, and so on. The half circle is also a tab: tapping it
 * reopens the message, quietly.
 *
 * RULES, so it helps rather than nags:
 *  - it stops for the rest of the visit (sessionStorage) once the visitor
 *    presses the cross or goes to WhatsApp, and it never lands on top of the
 *    evidence viewer;
 *  - the sound needs the visitor to have touched the page (a click, a tap or
 *    a key; scrolling does not count): browsers block audio before that, and
 *    until then the nudge arrives silent instead of failing. The first touch
 *    unlocks the chime, so every later arrival is heard;
 *  - nothing renders until it fires, so the prerendered page and the first
 *    paint are untouched;
 *  - reduced motion gets a plain fade, no bounce.
 */
const DELAY = 15_000; // the first one, counted from opening the site
const STEP = 5_000; // every wait after it is this much longer than the one before
const TUCK_AFTER = 8_000; // how long the message stays out before it tucks away
const KEY = 'nudge';
const EDGE = 30; // the half circle: half the pill's height

type State = 'off' | 'open' | 'tab';

/** Over for this visit: the visitor closed it, or went to WhatsApp. */
function stopped(): boolean {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === 'wa' || v === 'closed';
  } catch {
    return false;
  }
}
function mark(value: string) {
  try {
    sessionStorage.setItem(KEY, value);
  } catch {
    /* private mode: it simply may keep coming */
  }
}

/** One shared chime, built the first time it is wanted so it never competes
    with the page load. */
let chime: HTMLAudioElement | null = null;
function getChime(): HTMLAudioElement {
  if (!chime) {
    chime = new Audio('/sounds/notify.mp3');
    chime.volume = 0.6;
    chime.preload = 'auto';
  }
  return chime;
}
function playChime() {
  try {
    const a = getChime();
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* no sound: the message still arrives */
  }
}

export default function Nudge() {
  const { t, lang, isRTL } = useLang();
  const [state, setState] = useState<State>('off');
  // Counts arrivals, so one that lands while the message is still out replays.
  const [shows, setShows] = useState(0);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const tuck = useRef(0);
  const repeat = useRef(0);
  // True when the next opening is the nudge arriving (with its chime), not a
  // visitor tapping the half circle.
  const arriving = useRef(false);

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // First arrival after DELAY, then 20 s, 25 s, 30 s... after each, until it is over.
  useEffect(() => {
    if (stopped()) return;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (a && !a.classList.contains('nudge-card')) mark('wa');
    };
    document.addEventListener('click', onClick, true);

    // The first touch of the page unlocks the chime for every later arrival:
    // a muted play inside a real gesture is what iOS and Chrome both accept.
    const gestures = ['pointerdown', 'touchend', 'keydown'] as const;
    const unlock = () => {
      gestures.forEach((g) => window.removeEventListener(g, unlock));
      const a = getChime();
      if (!a.paused) return;
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {
          a.muted = false;
        });
    };
    gestures.forEach((g) => window.addEventListener(g, unlock, { passive: true }));

    let arrivals = 0;
    const fire = () => {
      if (stopped()) return;
      // Never on top of a full-size capture: try again a little later.
      if (document.querySelector('[role="dialog"]')) {
        repeat.current = window.setTimeout(fire, 5000);
        return;
      }
      arriving.current = true;
      track('nudge_shown');
      setShows((n) => n + 1);
      setState('open');
      arrivals += 1;
      repeat.current = window.setTimeout(fire, DELAY + arrivals * STEP);
    };
    repeat.current = window.setTimeout(fire, DELAY);

    return () => {
      window.clearTimeout(repeat.current);
      document.removeEventListener('click', onClick, true);
      gestures.forEach((g) => window.removeEventListener(g, unlock));
    };
  }, []);

  const open = useCallback((withSound: boolean) => {
    const card = cardRef.current;
    const body = bodyRef.current;
    if (!card || !body) return;
    window.clearTimeout(tuck.current);
    gsap.killTweensOf([card, body]);
    if (withSound) playChime();

    if (reduce()) {
      gsap.set(card, { width: 'auto' });
      gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      gsap
        .timeline()
        // 1. the half circle bulges out of the edge
        .fromTo(card, { width: 0 }, { width: EDGE, duration: 0.75, ease: 'elastic.out(1, 0.5)' })
        // 2. then it stretches into the message
        .to(card, { width: 'auto', duration: 0.65, ease: 'expo.out' }, '+=0.15')
        .fromTo(body, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, '-=0.35');
    }
    tuck.current = window.setTimeout(() => setState('tab'), TUCK_AFTER);
  }, []);

  // Play the entrance whenever it (re)opens; tuck back into the half circle.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (state === 'open') {
      open(arriving.current);
      arriving.current = false;
    }
    if (state === 'tab') {
      gsap.to(card, { width: EDGE, duration: reduce() ? 0 : 0.5, ease: 'power3.inOut' });
    }
  }, [state, shows, open]);

  useEffect(
    () => () => {
      window.clearTimeout(tuck.current);
      window.clearTimeout(repeat.current);
    },
    [],
  );

  if (state === 'off') return null;

  const href = `${contact.whatsapp.href}?text=${encodeURIComponent(t(nudge.prefill))}`;

  const close = () => {
    window.clearTimeout(tuck.current);
    window.clearTimeout(repeat.current);
    mark('closed');
    track('nudge_closed');
    const card = cardRef.current;
    if (!card || reduce()) return setState('off');
    gsap.to(card, { width: 0, duration: 0.45, ease: 'power3.in', onComplete: () => setState('off') });
  };

  return (
    <div className="nudge" data-state={state} dir="ltr">
      <a
        ref={cardRef}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        dir="ltr"
        aria-label={state === 'tab' ? t(nudge.open) : `${nudge.from}: ${t(nudge.text)}`}
        className="nudge-card"
        onClick={(e) => {
          if (state === 'tab') {
            e.preventDefault();
            setState('open');
            return;
          }
          // Off to WhatsApp: that is what it is for, so it leaves them alone now.
          track('nudge_click');
          mark('wa');
          window.clearTimeout(repeat.current);
        }}
      >
        {/* The edge: the half circle, with WhatsApp's mark in it. */}
        <span aria-hidden className="nudge-edge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.2.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.7-.2 1.2z" />
          </svg>
        </span>
        <span ref={bodyRef} className="nudge-body">
          <img src="/img/avatar-nudge.webp" alt="" width={112} height={112} className="nudge-av" />
          <span className="nudge-text" dir={isRTL ? 'rtl' : 'ltr'} lang={lang}>
            <span className="nudge-from">{nudge.from}</span>
            {t(nudge.text)}
          </span>
        </span>
      </a>
      {state === 'open' && (
        <button type="button" onClick={close} aria-label={t(nudge.close)} className="nudge-x">
          ×
        </button>
      )}
    </div>
  );
}
