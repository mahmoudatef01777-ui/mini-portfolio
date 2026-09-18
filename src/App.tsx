import { useEffect } from 'react';
import { useLang } from '@/i18n/lang';
import { seo, ui } from '@/content/content';
import { story } from '@/content/story';
import { useRoute } from '@/lib/router';
import { OG_LOCALE, absolute } from '@/lib/url';
import Header from '@/components/Header';
import StoryPage from '@/components/StoryPage';
import { About, Ads, Closing, Contact, FullStory, Growth, Hero, Messaging, Results, Sites } from '@/components/Sections';

/**
 * TWO PAGES, and they are both this site's.
 *
 *   /        the landing itself: hero -> who I am -> the figures and the
 *            dashboards behind them -> the Ads Manager captures -> how I can
 *            help -> websites I built -> the closing line -> the way into the
 *            story -> the dark call, which is the footer.
 *
 *   /story   the full background, told here rather than linked away to.
 *
 * The story page used to be a link OUT, to the main portfolio. It is not any
 * more: this site is complete on its own, works with the main portfolio
 * offline or unbuilt, and never sends a visitor to another domain to finish
 * reading. See `content/story.ts` for where its words come from.
 *
 * Both pages exist in both languages: `/` `/story` in English, `/ar`
 * `/ar/story` in Arabic. The url is the only thing that decides which.
 */
export default function App() {
  const { lang, t } = useLang();
  const { route } = useRoute();

  /**
   * THE HEAD FOLLOWS THE URL, all of it.
   *
   * Four urls' worth of head, done by hand — there is no framework here. The
   * canonical, the og url and the og locale all have to agree with the page
   * the visitor is actually on, or a shared link describes a different page
   * from the one it opens.
   *
   * WHAT THIS CANNOT REACH: WhatsApp, LinkedIn and every other scraper fetch
   * the html and never run this. They see the static tags in index.html, which
   * describe the English root. That is exactly why "/" is English — the tags a
   * scraper reads and the page a person lands on are the same page.
   */
  useEffect(() => {
    const head = route === 'story' ? story.seo : seo;
    const url = absolute({ lang, route });

    document.title = t(head.title);

    const set = (selector: string, attribute: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attribute, value);
    };

    set('meta[name="description"]', 'content', t(head.description));
    set('link[rel="canonical"]', 'href', url);
    set('meta[property="og:url"]', 'content', url);
    set('meta[property="og:title"]', 'content', t(head.title));
    set('meta[property="og:description"]', 'content', t(head.description));
    set('meta[property="og:locale"]', 'content', OG_LOCALE[lang]);
    set('meta[property="og:locale:alternate"]', 'content', OG_LOCALE[lang === 'ar' ? 'en' : 'ar']);

    // hreflang, so a search engine knows the pair are the same page.
    set('link[rel="alternate"][hreflang="en"]', 'href', absolute({ lang: 'en', route }));
    set('link[rel="alternate"][hreflang="ar"]', 'href', absolute({ lang: 'ar', route }));
  }, [lang, route, t]);

  return (
    <>
      {/* First stop for a keyboard user, and the only thing before the mark. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cream"
      >
        {t(ui.skip)}
      </a>

      <Header />

      {route === 'story' ? (
        <StoryPage />
      ) : (
        <main>
          {/* No `id="main"` on this element: on the home page the skip link's
              target is the section AFTER the hero photograph (Sections.tsx),
              so the id lives there. Duplicating it would break both. */}
          <Hero />
          <About />
          <Results />
          <Ads />
          <Messaging />
          <Growth />
          <Sites />
          <Closing />
          <FullStory />
        </main>
      )}

      <Contact />
    </>
  );
}
