import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '@/i18n/lang';
import { proofUi, sourceLabel, type EvidenceShot } from '@/content/proof';
import { cn } from '@/lib/cn';

/**
 * THE EVIDENCE VIEWER — the way the extra proof gets onto the page without
 * putting it all on the page.
 *
 * The home page shows a curated few captures. Everything else — 21 of them
 * across five brands and two ad objectives — sits behind a button and opens
 * here. That is the whole point: an agency owner who believes the numbers
 * scrolls past, and one who wants to check them can read every screenshot at
 * full size without the landing page turning into a dashboard.
 *
 * NOTHING IS FETCHED UNTIL IT IS OPENED. The viewer renders no <img> while it
 * is closed, so the hidden library costs a visitor who never opens it exactly
 * nothing — which matters on a page opened from an Instagram bio on mobile
 * data. Only the shot being viewed and its immediate neighbours are mounted.
 *
 * The capture is shown UNTOUCHED: no crop, no zoom, no overlay, no annotation.
 * Its caption sits beneath it, outside the image, because a caption drawn onto
 * evidence is an edit to the evidence.
 */

/**
 * Index 0 is "fit to the screen"; the rest are fractions of the capture's own
 * width. It ends at 1 on purpose — see the note on `zoomLevel` below.
 */
const ZOOM_STEPS = [0, 0.5, 0.75, 1] as const;

export interface ViewerState {
  shots: EvidenceShot[];
  index: number;
}

export function useEvidenceViewer() {
  const [state, setState] = useState<ViewerState | null>(null);
  const open = useCallback((shots: EvidenceShot[], index = 0) => setState({ shots, index }), []);
  const close = useCallback(() => setState(null), []);
  return { state, open, close, setState };
}

export function EvidenceViewer({
  state,
  onClose,
  onIndex,
}: {
  state: ViewerState | null;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const { t, isRTL } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = state !== null;
  const count = state?.shots.length ?? 0;

  /**
   * FIT FIRST, THEN STEP UP WITH + AND -.
   *
   * Opening straight into an 1,800px table showed the phone a slice of the
   * middle of it with no way to tell what you were looking at — the picture
   * arrived broken. So a capture opens fitted to the screen, which is the
   * shape of the thing, and the reader steps in when they want to read the
   * numbers.
   *
   * The steps are fractions of the capture's OWN pixels and stop at 100%.
   * There is no step past it: enlarging a screenshot past its own resolution
   * softens the digits, and a blurred figure on a page about real figures
   * reads as a doctored one.
   *
   * Zoom resets on every shot — it is a decision about the image in front of
   * you, not a mode the viewer stays in.
   */
  const [zoomLevel, setZoomLevel] = useState(0);
  const shotId = state?.shots[state.index]?.id;
  useEffect(() => setZoomLevel(0), [shotId]);

  const zoomed = zoomLevel > 0;

  const step = useCallback(
    (delta: number) => {
      if (!state) return;
      onIndex((state.index + delta + count) % count);
    },
    [state, count, onIndex],
  );

  // Escape closes, arrows move. The arrow keys are swapped in RTL so "left"
  // always means the direction the reader considers backwards.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key === 'ArrowRight') return step(isRTL ? -1 : 1);
      if (e.key === 'ArrowLeft') return step(isRTL ? 1 : -1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, step, isRTL]);

  // The page behind must not scroll while the viewer is over it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!state) return null;

  const shot = state.shots[state.index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(shot.caption)}
      className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => {
        // Only a click on the backdrop itself closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* --------------------------------------------------------- chrome */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6">
        {/* THE TOOL, NOT THE CLIENT. This line used to print `shot.brand`,
            which put a client's name at the top of every capture the viewer
            opened. The caption underneath carries the context; the name does
            not appear anywhere the reader can copy it. */}
        <p className="flex min-w-0 items-center gap-2.5 text-xs text-on-dark/70">
          <span className="truncate font-semibold text-on-dark">{t(sourceLabel[shot.source])}</span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {count > 1 && (
            <p className="num text-xs text-on-dark/60">
              {state.index + 1} / {count}
            </p>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t(proofUi.close)}
            className="grid h-9 w-9 place-items-center rounded-full border border-on-dark/25 text-on-dark transition-colors duration-300 hover:border-on-dark"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/*
        Two states, one image, and the file is untouched in both: fitted, it is
        scaled down whole; zoomed, it is at its own pixels and the box pans.
        Neither crops, and neither upscales — a soft upscale makes real numbers
        look doctored, which is the opposite of the point.

        `min-w-max` on the inner wrapper is what makes the pan work: without
        it, an auto margin on an overflowing flex child eats the leading edge
        and the start of the table becomes unreachable.
      */}
      <div className={cn('min-h-0 flex-1', zoomed ? 'overflow-auto' : 'overflow-hidden')}>
        <div className={cn('flex min-h-full items-center justify-center px-4 md:px-6', zoomed && 'min-w-max')}>
          <img
            key={shot.id}
            src={shot.src}
            alt={t(shot.alt)}
            width={shot.width}
            height={shot.height}
            className="block rounded-lg bg-cream"
            style={
              zoomed
                ? { width: `${Math.round(shot.width * ZOOM_STEPS[zoomLevel])}px`, maxWidth: 'none', height: 'auto' }
                : { maxWidth: `min(100%, ${shot.width}px)`, maxHeight: '100%', width: 'auto', height: 'auto' }
            }
          />
        </div>
      </div>

      {/* -------------------------------------------------------- caption */}
      <div className="shrink-0 px-4 py-4 md:px-6 md:py-5">
        <p className="mx-auto max-w-[70ch] text-center text-xs leading-relaxed text-on-dark/80 md:text-sm">
          {t(shot.caption)}
        </p>

        {/* Offered only for a capture with more detail than a screen shows. */}
        {shot.width > 900 && (
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((n) => Math.max(0, n - 1))}
                disabled={zoomLevel === 0}
                aria-label={t(proofUi.zoomOut)}
                className="grid h-9 w-9 place-items-center rounded-full border border-on-dark/25 text-on-dark transition-colors duration-300 hover:border-on-dark disabled:opacity-30 disabled:hover:border-on-dark/25"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M5 12h14" />
                </svg>
              </button>

              {/* The level, so the two buttons are not guesswork. */}
              <p className="num min-w-[4.5rem] text-center text-xs text-on-dark/70">
                {zoomLevel === 0 ? t(proofUi.fitLabel) : `${Math.round(ZOOM_STEPS[zoomLevel] * 100)}%`}
              </p>

              <button
                type="button"
                onClick={() => setZoomLevel((n) => Math.min(ZOOM_STEPS.length - 1, n + 1))}
                disabled={zoomLevel === ZOOM_STEPS.length - 1}
                aria-label={t(proofUi.zoomIn)}
                className="grid h-9 w-9 place-items-center rounded-full border border-on-dark/25 text-on-dark transition-colors duration-300 hover:border-on-dark disabled:opacity-30 disabled:hover:border-on-dark/25"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            {zoomed && <p className="text-[0.6875rem] text-on-dark/50">{t(proofUi.panHint)}</p>}
          </div>
        )}

        {count > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-on-dark/25 px-4 py-2 text-xs font-semibold text-on-dark transition-colors duration-300 hover:border-on-dark"
            >
              <span aria-hidden className={isRTL ? 'rotate-180' : undefined}>←</span>
              {t(proofUi.prev)}
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex items-center gap-2 rounded-full border border-on-dark/25 px-4 py-2 text-xs font-semibold text-on-dark transition-colors duration-300 hover:border-on-dark"
            >
              {t(proofUi.next)}
              <span aria-hidden className={isRTL ? 'rotate-180' : undefined}>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The button that opens the viewer. It carries the count, so the reader knows
 * how much is behind it before deciding to look.
 */
export function EvidenceButton({
  count,
  label,
  onClick,
  tone = 'quiet',
}: {
  count: number;
  label: string;
  onClick: () => void;
  tone?: 'quiet' | 'dark';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === 'dark'
          ? 'inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-colors duration-300 ease-out hover:bg-orange hover:text-on-orange'
          : 'inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-semibold text-ink transition-colors duration-300 ease-out hover:border-ink md:text-sm'
      }
    >
      {label}
      {/* Inherits the button's own colour so it reads on both tones. */}
      <span className="num opacity-60">({count})</span>
    </button>
  );
}
