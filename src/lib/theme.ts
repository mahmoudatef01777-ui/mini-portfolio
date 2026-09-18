export type Theme = 'light' | 'dark';

const KEY = 'theme';

/**
 * Theme state lives on `<html data-theme>`, which is also what the inline
 * script in index.html sets before first paint — so a reload never flashes the
 * wrong palette. Keep the key and the attribute in sync with that script.
 */
/**
 * DARK IS THE DEFAULT, and a saved choice beats it.
 *
 * It used to follow the operating system, which meant the site Mahmoud shares
 * looked different depending on the phone that opened it. Dark is now the
 * state a first-time visitor sees, every time, and the toggle is what changes
 * it — after which the choice is remembered.
 *
 * Keep this in step with the inline script in index.html: that script is what
 * paints the first frame, and if the two disagree the page flashes.
 */
export function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Blocked storage: fall through to the default.
  }
  return 'dark';
}

export function applyTheme(theme: Theme, animate = false) {
  const root = document.documentElement;

  // The transition class is added only for the length of the switch, so the
  // page is not permanently transitioning every colour it owns.
  if (animate) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 320);
  }

  root.setAttribute('data-theme', theme);

  // Keep the browser chrome (mobile address bar) in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F0F0F' : '#FFFFFF');
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just will not persist.
  }
}
