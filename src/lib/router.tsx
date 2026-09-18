import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { build, parse, type Route } from '@/lib/url';
import { cn } from '@/lib/cn';

/**
 * Two pages, no router library.
 *
 * This site is opened from an Instagram bio on mobile data, and the whole
 * bundle is smaller than most routers' dependency trees. Two routes need
 * pushState, popstate and a piece of state — that is this file, and it is
 * about forty lines. `react-router` would be a larger import than the story
 * page it would be routing to.
 *
 * `Link` still renders a real <a href>, so the link is a link: it has a
 * destination in the status bar, it opens in a new tab on cmd-click, a crawler
 * can follow it, and only a plain left click is intercepted.
 */

interface Value {
  route: Route;
  go: (route: Route) => void;
}

const Ctx = createContext<Value | null>(null);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parse().route);

  // Back and forward move between the two pages.
  useEffect(() => {
    const onPop = () => setRoute(parse().route);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((next: Route) => {
    // pushState, not replaceState: going to the story and pressing back should
    // return to the home page, which is the flow the back button promises.
    window.history.pushState({}, '', build({ lang: parse().lang, route: next }));
    setRoute(next);
    // A new page starts at its top. Without this the browser keeps the scroll
    // position of the page that was just left.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const value = useMemo<Value>(() => ({ route, go }), [route, go]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRoute(): Value {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRoute must be used inside <RouteProvider>');
  return ctx;
}

/** An internal link. Same-tab, same app — it never leaves this site. */
export function Link({
  to,
  children,
  className,
  ...rest
}: {
  to: Route;
  children: ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>) {
  const { go } = useRoute();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Leave the browser's own behaviour alone for anything but a plain click.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    go(to);
  };

  return (
    <a href={build({ lang: parse().lang, route: to })} onClick={onClick} className={cn(className)} {...rest}>
      {children}
    </a>
  );
}
