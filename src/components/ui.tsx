import type { ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { useReveal } from '@/lib/reveal';
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
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
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
  tone?: 'solid' | 'quiet';
  className?: string;
}) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors duration-300 ease-out md:text-base',
        tone === 'solid'
          ? 'bg-ink text-cream hover:bg-orange hover:text-on-orange'
          : 'border border-line text-ink hover:border-ink',
        className,
      )}
    >
      {children}
    </a>
  );
}
