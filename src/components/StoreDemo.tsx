import { useLang } from '@/i18n/lang';
import type { Localized } from '@/content/content';

/**
 * A live store shown as a demo rather than as a flat screenshot.
 *
 * Real captures of the running storefront, dropped into a browser frame with
 * the store's own address in the bar, and its phone screen overlapping the
 * corner. The whole frame is the outbound link, so tapping anywhere on the
 * demo opens the real store.
 *
 * DELIBERATELY NOT AN <iframe>. Shopify answers with `X-Frame-Options: DENY`
 * and `frame-ancestors 'none'`, so every browser refuses to embed these —
 * an iframe here would render an empty box. Which also means a change on a
 * client's store does not show up here by itself; the captures are refreshed
 * from the main portfolio's capture script.
 *
 * EVERY DEMO HERE HAS A LIVE URL. A browser frame with a domain in the bar is
 * a claim that the store is running, so a store that no longer answers does
 * not get this treatment — see the note on `sites` in content/content.ts.
 */
export interface Demo {
  id: string;
  name: string;
  href: string;
  domain: string;
  detail: Localized;
  desktop: { src: string; width: number; height: number };
  phone: { src: string; width: number; height: number };
}

export default function StoreDemo({ demo, visit }: { demo: Demo; visit: Localized }) {
  const { t, isRTL } = useLang();

  return (
    <figure className="max-w-[44rem]">
      <a
        href={demo.href}
        target="_blank"
        rel="noreferrer noopener"
        className="group block rounded-media border border-line bg-soft p-3 transition-colors duration-300 ease-out hover:border-ink/30 md:p-4"
      >
        <div className="relative">
          <div className="overflow-hidden rounded-lg border border-line bg-paper">
            {/* Browser chrome. The address is set LTR whatever the page
                language: a domain is not Arabic text and bidi would reorder
                the dots. */}
            <div className="flex items-center gap-3 border-b border-line bg-soft px-3 py-2">
              <span aria-hidden className="flex shrink-0 gap-1.5">
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
              </span>
              <span
                dir="ltr"
                className="font-latin min-w-0 flex-1 truncate rounded-full bg-cream px-3 py-1 text-center text-[0.6875rem] text-ink-dim"
              >
                {demo.domain}
              </span>
            </div>

            <img
              src={demo.desktop.src}
              alt={`${demo.name} — ${t(demo.detail)}`}
              width={demo.desktop.width}
              height={demo.desktop.height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>

          {/*
            THE PHONE ONLY BECOMES AN OVERLAY WHEN THERE IS ROOM FOR ONE.

            It used to go absolute at `sm` (640px) and hang 1rem BELOW the
            browser frame. On a phone that put its hard dark corner across the
            card's own rounded border, which read as a stray edge rather than
            as a device sitting on top of a screenshot — and it covered a
            quarter of the capture it was supposed to be showing off.

            So the overlay starts at `md` now. Below that the phone sits under
            the frame, pushed to the end side so it reads as part of the demo
            rather than as something left over. The laptop view is unchanged.
          */}
          <div className="ms-auto mt-3 w-[6.5rem] md:absolute md:-bottom-4 md:end-4 md:mt-0 md:w-[9rem]">
            <div className="overflow-hidden rounded-[1.1rem] border-[3px] border-ink bg-ink shadow-[0_10px_30px_-12px_rgba(17,17,17,0.45)]">
              <img
                src={demo.phone.src}
                alt=""
                aria-hidden
                width={demo.phone.width}
                height={demo.phone.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>

        <span className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1 sm:mt-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
            {demo.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors duration-300 group-hover:text-orange-ink">
            {t(visit)}
            <span aria-hidden className={isRTL ? 'rotate-180' : undefined}>
              →
            </span>
          </span>
        </span>
      </a>

      <figcaption className="mt-3 max-w-[52ch] text-[0.8125rem] leading-[1.7] text-ink-dim">
        {t(demo.detail)}
      </figcaption>
    </figure>
  );
}
