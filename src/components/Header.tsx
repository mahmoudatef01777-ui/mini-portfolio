import { useEffect, useState } from 'react';
import { useLang } from '@/i18n/lang';
import { ui } from '@/content/content';
import { applyTheme, readTheme, storeTheme, type Theme } from '@/lib/theme';
import { Link } from '@/lib/router';
import { Monogram } from './ui';

/**
 * The only chrome on the page: the mark, centred, with the language toggle
 * and the theme toggle at the end.
 *
 * NO NAVIGATION. This is one page; a menu of anchors would be four taps to
 * reach something a thumb reaches faster by scrolling, and it is read almost
 * entirely on a phone.
 */
export default function Header() {
  const { lang, setLang, t } = useLang();
  const [theme, setTheme] = useState<Theme>('light');

  // The inline script in index.html has already set the attribute before
  // first paint; this only syncs React's copy of it.
  useEffect(() => setTheme(readTheme()), []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    /* `storeTheme` existed in lib/theme.ts from the start and was never
       called, so the toggle worked for exactly as long as the tab stayed
       open and every reload threw the choice away. It went unnoticed while
       the default followed the operating system — it usually landed back on
       the same theme by accident. Dark is the default now, so it stopped
       being invisible. */
    storeTheme(next);
    setTheme(next);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-sm">
      <div className="container-page grid h-14 grid-cols-3 items-center gap-3 md:h-16">
        {/* An empty start cell. The mark is centred by the grid, not by a
            margin, so it stays centred whatever the controls beside it weigh. */}
        <div aria-hidden />

        {/* The mark goes home WITHOUT a page load: a hard href would throw
            away the app and reload the whole site to move one route. */}
        <Link to="home" aria-label="Mahmoud Atef" className="justify-self-center text-orange">
          <Monogram className="h-5 md:h-6" />
        </Link>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink transition-colors duration-300 hover:border-ink"
          >
            {t(ui.toggleLang)}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t(ui.toggleTheme)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink"
          >
            {/* Sun and moon, drawn rather than imported: two icons do not
                justify an icon package on a page this size. */}
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
    </header>
  );
}
