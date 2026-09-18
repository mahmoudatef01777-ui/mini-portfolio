import type { Lang } from '@/content/content';

/**
 * THE URL IS THE STATE — the only source of truth for language. Language and
 * route both live in the pathname, and this file is the only place that knows
 * how to read or write it:
 *
 *   /            English home
 *   /story       English story
 *   /ar          Arabic  home
 *   /ar/story    Arabic  story
 *
 * ENGLISH IS THE ROOT, since 2026-09-19. It used to be the other way round —
 * "/" served Arabic and "/en" served English — which made the bare link a
 * different page depending on who opened it once a saved preference entered
 * the picture. It does not any more: "/" is English for everyone, always, and
 * nothing stored in the browser can change what a url means. That is what
 * keeps a shared link honest, and what lets the static og tags describe the
 * page a scraper actually fetches.
 *
 * A language toggle keeps the route and a route change keeps the language,
 * which only works because both are parsed and rebuilt together, here.
 *
 * Anything that is not a known route resolves to `home` rather than to a 404:
 * this is a two-page site behind a catch-all rewrite (see vercel.json), and a
 * visitor who mistypes should land on the page, not on an error.
 */

export type Route = 'home' | 'story';

const ROUTES: Record<Exclude<Route, 'home'>, string> = { story: 'story' };

export interface Location {
  lang: Lang;
  route: Route;
}

export function parse(pathname?: string): Location {
  const path = pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const parts = path.toLowerCase().split('/').filter(Boolean);

  const lang: Lang = parts[0] === 'ar' ? 'ar' : 'en';
  const rest = lang === 'ar' ? parts.slice(1) : parts;
  const route: Route = rest[0] === ROUTES.story ? 'story' : 'home';

  return { lang, route };
}

export function build({ lang, route }: Location): string {
  const base = lang === 'ar' ? '/ar' : '';
  if (route === 'story') return `${base}/${ROUTES.story}`;
  return base || '/';
}

/** Absolute url for a location, for canonical and og:url. */
export function absolute(location: Location): string {
  return `${ORIGIN}${build(location)}`;
}

/**
 * The one place the production origin is written down. `index.html` names it
 * too, in tags a scraper reads without running any of this — change both
 * together or a shared card will point at the wrong host.
 *
 * THIS HAS TO BE A HOST THAT ACTUALLY ANSWERS. It said mahmoudelzaqla.com
 * until 2026-09-19, and that domain does not exist yet: the canonical pointed
 * at a url with no DNS record, which tells a search engine not to index the
 * page it is actually reading, and og:image pointed at the same dead host, so
 * a link shared on WhatsApp came up with a blank card — the one thing this
 * site is for. It names the live deployment instead until the domain is real.
 *
 * WHEN THE DOMAIN IS BOUGHT AND POINTED AT THIS PROJECT: put it back here and
 * in index.html, together, and nothing else needs to change.
 */
export const ORIGIN = 'https://mini-portfolio-pied-beta.vercel.app';

/** What `og:locale` should say for each language. */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ar: 'ar_EG' };
