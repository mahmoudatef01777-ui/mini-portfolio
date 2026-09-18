import type { Config } from 'tailwindcss';

/**
 * Colors are declared as space-separated RGB channels in CSS variables
 * (see src/styles/tokens.css) so Tailwind opacity modifiers work:
 *   bg-orange/10  text-ink-dim  border-line/60
 */
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

/**
 * Display sizes are multiplied by `--display-scale`, which the font pairing
 * sets per script: Arabic renders visibly smaller than Latin at the same px,
 * so the scale corrects it once, here, instead of in every component.
 */
const display = (min: string, vw: string, max: string) => [
  `calc(clamp(${min}, ${vw}, ${max}) * var(--display-scale))`,
  { lineHeight: 'var(--display-leading)' },
];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: withAlpha('--c-cream'),
        soft: withAlpha('--c-soft'),
        orange: withAlpha('--c-orange'),
        'orange-ink': withAlpha('--c-orange-ink'),
        black: withAlpha('--c-black'),
        blush: withAlpha('--c-blush'),
        line: withAlpha('--c-line'),
        paper: withAlpha('--c-paper'),
        ink: withAlpha('--c-ink'),
        'ink-dim': withAlpha('--c-ink-dim'),
        'on-orange': withAlpha('--c-on-orange'),
        'on-dark': withAlpha('--c-on-dark'),
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      fontSize: {
        'display-xs': display('1.375rem', '3.2vw', '1.875rem') as [string, { lineHeight: string }],
        'display-sm': display('1.75rem', '4.4vw', '2.75rem') as [string, { lineHeight: string }],
        'display-md': display('2.25rem', '6vw', '4rem') as [string, { lineHeight: string }],
        'display-lg': display('2.75rem', '7.6vw', '6rem') as [string, { lineHeight: string }],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        media: 'var(--radius-media)',
      },
      maxWidth: {
        page: '86rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
