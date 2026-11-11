import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLang } from '@/i18n/lang';
import { contact } from '@/content/content';
import { nudge } from '@/content/redesign';

/**
 * THE 30-SECOND NUDGE.
 *
 * Thirty seconds into a visit, a small lime message pops out of the LEFT
 * edge, bottom corner: first a half circle bulges out of the screen edge
 * (with Shopify's new-order chime), then it stretches into a pill carrying
 * his face and the line Mahmoud chose. Tapping it opens WhatsApp on his
 * number with a message already typed; the visitor only presses send.
 *
 * After a while it tucks back into the half circle, which stays as a small
 * tab that reopens it. The × closes it for the rest of the visit.
 *
 * RULES, so it helps rather than nags:
 *  - once per visit (sessionStorage), never if the visitor has already
 *    tapped a WhatsApp link, and never on top of the evidence viewer;
 *  - the sound only plays if the visitor has already interacted with the
 *    page: browsers block audio before that, and the nudge then arrives
 *    silent instead of failing;
 *  - nothing renders until it fires, so the prerendered page and the first
 *    paint are untouched;
 *  - reduced motion gets a plain fade, no bounce.
 */
const DELAY = 30_000;
const TUCK_AFTER = 14_000;
const KEY = 'nudge';
const EDGE = 30; // the half circle: half the pill's height

type State = 'off' | 'open' | 'tab';

function seen(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}
function mark(value: string) {
  try {
    sessionStorage.setItem(KEY, value);
  } catch {
    /* private mode: it simply may show again */
  }
}
function track(name: string) {
  (window as unknown as { clarity?: (...a: unknown[]) => void }).clarity?.('event', name);
}

export default function Nudge() {
  const { t, lang, isRTL } = useLang();
  const [state, setState] = useState<State>('off');
  const cardRef = useRef<HTMLAnchorElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const chime = useRef<HTMLAudioElement | null>(null);
  const tuck = useRef(0);

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fire once, thirty seconds in, unless there is a reason not to.
  useEffect(() => {
    if (seen()) return;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (a && !a.classList.contains('nudge-card')) mark('wa');
    };
    document.addEventListener('click', onClick, true);

    let timer = 0;
    const fire = () => {
      if (seen()) return;
      // Never on top of a full-size capture: try again a little later.
      if (document.querySelector('[role="dialog"]')) {
        timer = window.setTimeout(fire, 5000);
        return;
      }
      mark('shown');
      track('nudge_shown');
      setState('open');
    };
    timer = window.setTimeout(() => {
      // Load the chime only now, so it never competes with the page load.
      chime.current = new Audio('/sounds/notify.mp3');
      chime.current.volume = 0.6;
      chime.current.preload = 'auto';
      fire();
    }, DELAY);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  const open = useCallback(
    (withSound: boolean) => {
      const card = cardRef.current;
      const body = bodyRef.current;
      if (!card || !body) return;
      window.clearTimeout(tuck.current);
      if (withSound) chime.current?.play().catch(() => {});

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
    },
    [],
  );

  // Play the entrance whenever it (re)opens; tuck back into the half circle.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (state === 'open') open(card.dataset.played !== '1');
    if (state === 'open') card.dataset.played = '1';
    if (state === 'tab') {
      gsap.to(card, { width: EDGE, duration: reduce() ? 0 : 0.5, ease: 'power3.inOut' });
    }
  }, [state, open]);

  useEffect(() => () => window.clearTimeout(tuck.current), []);

  if (state === 'off') return null;

  const href = `${contact.whatsapp.href}?text=${encodeURIComponent(t(nudge.prefill))}`;

  const close = () => {
    window.clearTimeout(tuck.current);
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
          track('nudge_click');
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
