import { useEffect, useState } from 'react';
import { useLang } from '@/i18n/lang';
import type { Lang } from '@/content/content';
import { ui } from '@/content/content';
import { nav } from '@/content/redesign';
import { applyTheme, readTheme, storeTheme, type Theme } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useRoute } from '@/lib/router';
import { build } from '@/lib/url';
import { Monogram } from './ui';

/**
 * The chrome, in three columns with the mark in the middle: the sections in
 * a floating pill on one side (laptop), the contact button and the language
 * and theme switches on the other. On a phone the pill becomes a full-screen
 * menu behind one button, which takes the first column.
 *
 * It is transparent over the hero and takes a surface as soon as the page
 * moves, so the type underneath never shows through the links.
 */
export default function Header() {
  const { lang, setLang, t } = useLang();
  const { route, go } = useRoute();
  const [theme, setTheme] = useState<Theme>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const other: Lang = lang === 'ar' ? 'en' : 'ar';

  // The inline script in index.html has already set the attribute before
  // first paint; this only syncs React's copy of it.
  useEffect(() => setTheme(readTheme()), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    storeTheme(next);
    setTheme(next);
  };

  // On the story page the section anchors live on the home page.
  const href = (id: string) => (route === 'home' ? `#${id}` : `${build({ lang, route: 'home' })}#${id}`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled && !open ? 'border-b border-line/60 bg-cream/80 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      {/* THE MARK IS ON THE PAGE'S CENTRE LINE. The two side columns are equal
          (`minmax(0,1fr)`), so it stays centred whatever is in them. */}
      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 md:h-[4.5rem]">
        {/* THE MARK ALWAYS TAKES YOU TO THE HERO. On the home page it scrolls
            back to the top from wherever you are (and drops any #section
            from the address); on the story page it opens the home page at
            its top. A plain left click only; anything else is a normal link. */}
        <a
          href={build({ lang, route: 'home' })}
          aria-label="Mahmoud Elzaqla"
          onClick={(e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            setOpen(false);
            if (route === 'home') {
              window.history.replaceState({}, '', build({ lang, route: 'home' }));
              // Straight there, not a smooth glide: from the footer a smooth
              // scroll crosses the whole page, and lazy images loading on the
              // way can stop it halfway. `instant` also beats the page's
              // `scroll-behavior: smooth`.
              window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            } else {
              go('home');
            }
          }}
          className="col-start-2 row-start-1 flex items-center text-orange-ink"
        >
          <Monogram className="h-5 md:h-6" />
        </a>

        <nav aria-label="Sections" className="col-start-1 row-start-1 hidden justify-self-start lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-cream/70 p-1.5 backdrop-blur-md">
            {nav.items.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  className="block rounded-full px-4 py-2 text-[0.8125rem] font-medium text-ink-dim transition-colors duration-300 hover:bg-soft hover:text-ink"
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={t(open ? nav.close : nav.menu)}
            className="col-start-1 row-start-1 grid h-9 w-9 justify-self-start place-items-center rounded-full bg-ink text-cream lg:hidden"
          >
            <span aria-hidden className="relative block h-2.5 w-4">
              <span className={cn('absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300', open && 'translate-y-[4.5px] rotate-45')} />
              <span className={cn('absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300', open && '-translate-y-[4.5px] -rotate-45')} />
            </span>
          </button>

        <div className="col-start-3 row-start-1 flex items-center justify-end gap-2">
          <a
            href={href('contact')}
            className="hidden h-9 items-center rounded-full bg-orange px-4 text-[0.8125rem] font-semibold text-on-orange transition-transform duration-300 hover:scale-[1.04] lg:inline-flex"
          >
            {t(nav.contact)}
          </a>

          {/* THE OTHER LANGUAGE IS ANOTHER URL, so this is an anchor: a
              crawler can follow it and a visitor can open it in a new tab.
              Only a plain left click is intercepted. */}
          <a
            href={build({ lang: other, route })}
            hrefLang={other}
            lang={other}
            aria-label={t(ui.toggleLangLabel)}
            onClick={(e) => {
              if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
              }
              e.preventDefault();
              setOpen(false);
              setLang(other);
            }}
            className="grid h-9 min-w-9 place-items-center rounded-full border border-line px-3 text-xs font-semibold text-ink transition-colors duration-300 hover:border-ink"
          >
            {t(ui.toggleLang)}
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t(ui.toggleTheme)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* The phone menu. Rendered only while open, so it is never in the
          tab order or the prerendered page when closed. */}
      {open && (
        <div id="site-menu" className="fixed inset-0 top-16 z-40 flex flex-col bg-cream px-gutter pb-10 pt-6 md:top-[4.5rem] lg:hidden">
          <ul className="flex flex-col">
            {[...nav.items, { id: 'contact', label: nav.contact }].map((item, i) => (
              <li key={item.id} className="border-b border-line">
                <a
                  href={href(item.id)}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className="display text-[calc(2.25rem*var(--display-scale))] text-ink">{t(item.label)}</span>
                  <span className="section-index">{`(0${i + 1})`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
