import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Localized } from '@/content/content';
import { build, parse } from '@/lib/url';

/**
 * Language lives in the path: English at `/`, Arabic under `/ar`.
 *
 * Keeping it in the URL means a link someone shares carries the language they
 * were reading, which a toggle stored only in localStorage would not.
 *
 * The path also carries the route now, so flipping the language must NOT
 * rewrite the whole path — someone reading the story in Arabic who taps EN
 * belongs on the English story, not back on the English home page. `lib/url`
 * parses and rebuilds both together; this file only ever changes the language
 * half of it.
 */

const DIR: Record<Lang, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };

interface Value {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLang: (next: Lang) => void;
  t: <T>(value: Localized<T>) => T;
}

const Ctx = createContext<Value | null>(null);

function fromPath(): Lang {
  if (typeof window === 'undefined') return 'en';
  return parse().lang;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(fromPath);

  // Keeps <html lang dir> in step, which is what drives RTL and the Arabic
  // font swap in fonts.css.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = DIR[lang];
  }, [lang]);

  // Back/forward still change the language, even without a router.
  useEffect(() => {
    const onPop = () => setLangState(fromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setLang = useCallback((next: Lang) => {
    // replaceState, not pushState: flipping the language should not stack up
    // history entries that the back button then has to walk through. The route
    // is carried over, so the toggle stays on the page it was pressed on.
    window.history.replaceState({}, '', build({ lang: next, route: parse().route }));
    setLangState(next);
  }, []);

  const value = useMemo<Value>(
    () => ({
      lang,
      dir: DIR[lang],
      isRTL: lang === 'ar',
      setLang,
      t: <T,>(v: Localized<T>) => v[lang],
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): Value {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
