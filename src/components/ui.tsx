import type { ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { useReveal, useStagger } from '@/lib/reveal';
import type { Localized } from '@/content/content';
import { cn } from '@/lib/cn';

/**
 * The MZ mark, drawn as ONE continuous stroke: the M's right stem runs down
 * to the baseline and keeps going as the Z's lower bar, so the two letters
 * share a line instead of sitting side by side. Same mark as the main
 * portfolio — it is the identity, not a decoration.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className={cn('block h-5 w-auto', className)}
    >
      <path d="M4 20 V4 L12 14 L20 4 V20 H40 M26 4 H40 L26 20" />
    </svg>
  );
}

/** Fades its children up the first time they are scrolled to. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. Used to stagger a short list; keep it under ~0.25. */
  delay?: number;
  as?: 'div' | 'li' | 'section';
}) {
  /* The delay goes to GSAP now rather than to a CSS `transition-delay`.
     Same intent, same numbers at every call site — it is the tween that
     waits instead of the transition. */
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <Tag ref={ref as never} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}

/**
 * A list whose items arrive in sequence. The hook needs a ref and a ref
 * cannot be taken inside a `.map()`, so the list itself is the component.
 */
export function Stagger({
  children,
  className,
  as: Tag = 'ul',
  /** Seconds between items. Keep it under ~0.08 or the tail drags. */
  each,
}: {
  children: ReactNode;
  className?: string;
  as?: 'ul' | 'ol' | 'div';
  each?: number;
}) {
  const ref = useStagger<HTMLUListElement>(each);
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

/** The marker and heading that open every section. */
export function SectionHead({
  label,
  title,
  className,
}: {
  label: Localized;
  title?: Localized;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <Reveal className={className}>
      <p className="label eyebrow">{t(label)}</p>
      {title && (
        <h2 className="display mt-5 max-w-[20ch] text-[calc(clamp(1.5rem,4vw,2.375rem)*var(--display-scale))] text-ink">
          {t(title)}
        </h2>
      )}
    </Reveal>
  );
}

/** The one button shape on the page. */
export function Button({
  href,
  children,
  tone = 'solid',
  className,
}: {
  href: string;
  children: ReactNode;
  /**
   * `whatsapp` is `solid` plus the fill: the pill starts as the ink button
   * every other call to action uses, and hovering pours WhatsApp green into
   * it. Opt-in rather than automatic, because only the WhatsApp link earns
   * another company's colour — see `.btn-water` in styles/index.css.
   */
  tone?: 'solid' | 'quiet' | 'whatsapp';
  className?: string;
}) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors duration-300 ease-out md:text-base',
        tone === 'solid' && 'bg-ink text-cream hover:bg-orange hover:text-on-orange',
        tone === 'quiet' && 'border border-line text-ink hover:border-ink',
        tone === 'whatsapp' &&
          // `isolate` keeps the fill in this pill's own stacking context,
          // `overflow-hidden` clips it to the rounded shape, and the delay on
          // the colour transition lets the water reach the label first.
          // `black` rather than `ink` or `on-orange`. This label lands on
          // WhatsApp's green, which is nobody's token: it needs a colour that
          // is dark in BOTH themes. `ink` is not — it inverts to near-white at
          // night and would put light text on the green. `on-orange` was not
          // either, once the palette changed: it used to be #111111 in both
          // themes and is now the pale lavender on light, which is 1.2:1 on
          // #25D366. `black` is #0F1F17 light and #08110D dark — 8.6:1 and
          // 9.7:1 on the green. If the palette moves again, re-check this one.
          'btn-fill relative isolate overflow-hidden bg-ink text-cream [transition-delay:340ms] hover:text-black',
        className,
      )}
    >
      {tone === 'whatsapp' && <span aria-hidden className="btn-water -z-10" />}
      {children}
    </a>
  );
}
