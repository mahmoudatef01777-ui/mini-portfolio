import { useLang } from '@/i18n/lang';
import { about } from '@/content/content';

/**
 * THE PORTRAIT IN A CIRCLE, WITH ONE SHOPIFY MARK RUNNING ROUND ITS EDGE.
 *
 * "Who I am" is a column of text on a wide screen and the other half sat
 * empty. This fills it with him and a single mark of the platform he builds
 * on, travelling the rim.
 *
 * THE CIRCLE IS DONE IN CSS, NOT IN THE FILE. `object-cover` inside a round
 * box picks a square out of the 3:4 photograph while the file on disk stays
 * whole — so the framing is a number here (`object-position`) that can be
 * nudged in a second, and nothing is ever destroyed to get the shape. An
 * earlier pass cropped the file itself; that is the thing not to repeat.
 *
 * ONE MARK, not a ring of them — six read as a pattern, one reads as a thing
 * going around him. Mahmoud's call.
 *
 * ON THE PHONE TOO, since 2026-11-10. It used to be `hidden lg:block`, on
 * the reasoning that a stacked column would push the words a screen further
 * down on a page opened from an Instagram bio. Mahmoud wants it everywhere,
 * so the cost that reasoning was avoiding is paid down instead of accepted:
 *
 *   - the image is `loading="lazy"` now. It is the second section, below
 *     the fold on every phone, so it is no longer part of what a visitor
 *     downloads before they see anything.
 *   - the circle is capped at 17rem on a phone and only opens up to 30rem
 *     from `lg`. 17 rather than 20 because the travelling mark rides
 *     OUTSIDE the photograph: at 20rem on a 375px screen the chip was
 *     sliced in half by the edge of the window on every lap. The
 *     circle has to leave room for the thing going round it.
 *   - the travelling mark shrinks with it. A 48px chip on a 320px circle
 *     is a badge stuck to a photograph; proportion is what makes it read
 *     as one thing going around him.
 *
 * THE MARK IS THE REAL ONE, in its real colour: the official Shopify glyph
 * (simple-icons, CC0) at #7AB55C, the same path and green the main
 * portfolio's Tools band uses. Not redrawn, not recoloured.
 *
 * MOTION: one lap every 18 seconds, upright the whole way —
 * `offset-rotate: 0deg` is what stops it tumbling, so no counter-rotation is
 * needed. Where `offset-path` is unsupported the mark rests at the top of the
 * circle, which still reads. `prefers-reduced-motion` stops it.
 */

/** Official Shopify glyph, simple-icons (CC0). */
const SHOPIFY_PATH =
  'M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z';

export default function AboutPortrait({ className }: { className?: string }) {
  const { t } = useLang();

  return (
    <div className={className ?? 'relative aspect-square w-full max-w-[17rem] place-self-center sm:max-w-[24rem] lg:max-w-[30rem]'}>
      <picture>
      <source type="image/avif" srcSet="/img/portrait-about-720.avif 720w, /img/portrait-about.webp 960w" sizes="(min-width: 1024px) 24rem, 17rem" />
      <img
        src="/img/portrait-about-720.webp"
        srcSet="/img/portrait-about-720.webp 720w, /img/portrait-about.webp 960w"
        sizes="(min-width: 1024px) 24rem, 17rem"
        alt={t(about.portraitAlt)}
        width={960}
        height={1280}
        /* Lazy, now that it renders on a phone as well: it is below the
           fold everywhere, and the hero above it is the image that has to
           arrive first. */
        loading="lazy"
        decoding="async"
        /* `object-position` holds the framing: 50% across, and high enough up
           the 3:4 frame that his face sits in the upper third of the circle
           rather than dead centre. Nudge the second number, not the file. */
        className="absolute inset-0 h-full w-full rounded-full object-cover [object-position:50%_30%]"
      />
      </picture>

      {/* The mark runs the rim itself — the track is the same circle as the
          photograph, nudged out just enough to sit on the edge rather than
          over it. */}
      <div className="pointer-events-none absolute inset-[-3%]">
        <span className="orbit-travel absolute left-0 top-0 block">
          <span className="grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-cream shadow-[0_6px_18px_-10px_rgba(17,17,17,0.5)] sm:h-11 sm:w-11 lg:h-12 lg:w-12">
            <svg viewBox="0 0 24 24" className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5 lg:h-6 lg:w-6" aria-hidden>
              <path d={SHOPIFY_PATH} fill="#7AB55C" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
}
