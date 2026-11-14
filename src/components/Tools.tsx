import { useState, type ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import { cn } from '@/lib/cn';
import { contact, type Localized } from '@/content/content';
import { giant } from '@/content/redesign';
import { blended, breakEven, clamp, fmt, parseNum, type Zone } from '@/lib/calc';
import {
  CURRENCIES,
  breakevenUi,
  merUi,
  toolsSuggest,
  toolsUi,
  type Currency,
  type Field,
} from '@/content/tools';
import { Button, Reveal } from './ui';
import { GiantHead } from './Sections';

/**
 * THE TOOLS SECTION: two free calculators, live, no signup.
 *
 *   break-even ROAS and max CPA    what a product can afford to pay per order
 *   MER and POAS                   whether the whole store is profitable
 *
 * They open filled with an example so the answer is on screen at once, and
 * every field is a plain text input that accepts Arabic digits. The
 * arithmetic is `lib/calc.ts`; the words are `content/tools.ts`. Nothing here
 * is sent anywhere: the numbers never leave the page.
 */

/* ------------------------------------------------------------- the pieces */

type Values<K extends string> = Record<K, string>;

const money = (v: string) => Math.max(0, parseNum(v));
const pct = (v: string) => clamp(parseNum(v), 0, 100);

function useFields<K extends string>(defaults: Values<K>) {
  const [values, setValues] = useState(defaults);
  const set = (key: K, value: string) => setValues((current) => ({ ...current, [key]: value }));
  return [values, set] as const;
}

function Fields<K extends string>({
  id,
  fields,
  values,
  onChange,
  cur,
}: {
  id: string;
  fields: Field<K>[];
  values: Values<K>;
  onChange: (key: K, value: string) => void;
  cur: Currency;
}) {
  const { t } = useLang();
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const inputId = `${id}-${field.key}`;
        return (
          <div key={field.key}>
            <label htmlFor={inputId} className="block text-[0.8125rem] font-medium leading-snug text-ink-dim">
              {t(field.label)}
            </label>
            {/* Always left to right, in both languages: a number field reads
                the same either way, with its unit after it. */}
            <div
              dir="ltr"
              className="mt-1.5 flex items-center gap-2 rounded-xl border border-line bg-cream px-3.5 transition-colors duration-300 focus-within:border-ink"
            >
              <input
                id={inputId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="num w-full min-w-0 bg-transparent py-3 text-base text-ink"
              />
              <span className="shrink-0 text-sm text-ink-dim">
                {field.unit === 'pct' ? '%' : t(toolsUi.currencies[cur])}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({
  kicker,
  title,
  body,
  how,
  children,
}: {
  kicker: Localized;
  title: Localized;
  body: Localized;
  how: Localized;
  children: ReactNode;
}) {
  const { t } = useLang();
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-soft p-5 md:p-8">
      <p className="label eyebrow">{t(kicker)}</p>
      <h3 className="display mt-4 text-[calc(clamp(1.375rem,2.6vw,2rem)*var(--display-scale))] text-ink">{t(title)}</h3>
      <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-dim">{t(body)}</p>
      {children}
      <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-dim">
        <span className="font-semibold text-ink">{t(toolsUi.how)}. </span>
        {t(how)}
      </p>
    </article>
  );
}

/** The answer, announced politely to a screen reader as it changes. */
function Result({ children }: { children: ReactNode }) {
  return (
    <div aria-live="polite" className="mt-6 rounded-xl border border-line bg-cream p-5 md:p-6">
      {children}
    </div>
  );
}

function Big({ label, value }: { label: Localized; value: string }) {
  const { t } = useLang();
  return (
    <div>
      <p className="label">{t(label)}</p>
      <p className="mt-2">
        <bdi dir="ltr" className="display num inline-block text-[clamp(2.75rem,7vw,4.25rem)] leading-none text-orange-ink">
          {value}
        </bdi>
      </p>
    </div>
  );
}

function Rows({ children }: { children: ReactNode }) {
  return <dl className="mt-5 divide-y divide-line border-t border-line">{children}</dl>;
}

function Row({ label, children }: { label: Localized; children: ReactNode }) {
  const { t } = useLang();
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[0.9375rem] text-ink-dim">{t(label)}</dt>
      <dd className="num shrink-0 text-base font-semibold text-ink">{children}</dd>
    </div>
  );
}

function Money({ value, cur }: { value: number; cur: Currency }) {
  const { t } = useLang();
  return (
    <>
      <bdi dir="ltr">{fmt(value)}</bdi> {t(toolsUi.currencies[cur])}
    </>
  );
}

const ratio = (n: number) => (Number.isFinite(n) ? `${fmt(n, 2)}×` : '—');
const percent = (n: number) => (Number.isFinite(n) ? `${fmt(n, 1)}%` : '—');

/* -------------------------------------------------- break-even ROAS, CPA */

const BREAKEVEN_DEFAULTS = { price: '600', cogs: '220', shipping: '50', fee: '2', returns: '15', other: '10' };

function BreakEvenCard({ cur }: { cur: Currency }) {
  const { t } = useLang();
  const [v, set] = useFields<keyof typeof BREAKEVEN_DEFAULTS>(BREAKEVEN_DEFAULTS);
  const r = breakEven({
    price: money(v.price),
    cogs: money(v.cogs),
    shipping: money(v.shipping),
    fee: pct(v.fee),
    returns: pct(v.returns),
    other: money(v.other),
  });
  const out = breakevenUi.out;

  return (
    <Card kicker={breakevenUi.kicker} title={breakevenUi.title} body={breakevenUi.body} how={breakevenUi.how}>
      <Fields id="be" fields={breakevenUi.fields} values={v} onChange={set} cur={cur} />
      <Result>
        {r.loss ? (
          <p role="alert" className="text-[0.9375rem] font-medium leading-relaxed text-ink">
            {t(breakevenUi.loss)}
          </p>
        ) : (
          <>
            <Big label={out.roas} value={ratio(r.roas)} />
            <Rows>
              <Row label={out.cpa}>
                <Money value={r.cpa} cur={cur} />
              </Row>
              <Row label={out.margin}>
                <bdi dir="ltr">{percent(r.margin)}</bdi>
              </Row>
              <Row label={out.target}>
                <bdi dir="ltr">{ratio(r.target)}</bdi>
              </Row>
            </Rows>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-dim">{t(breakevenUi.tip)}</p>
          </>
        )}
      </Result>
    </Card>
  );
}

/* --------------------------------------------------------------- MER, POAS */

const MER_DEFAULTS = { sales: '500000', meta: '60000', tiktok: '25000', google: '10000', snap: '5000', margin: '55' };

/** The platforms' own colours; TikTok's black is the page's ink so it shows on both themes. */
const PLATFORMS = [
  { key: 'meta', name: 'Meta', color: '#0866FF' },
  { key: 'tiktok', name: 'TikTok', color: 'rgb(var(--c-ink))' },
  { key: 'google', name: 'Google', color: '#34A853' },
  { key: 'snap', name: 'Snapchat', color: '#F2C230' },
] as const;

const ZONE_DOT: Record<Zone, string> = {
  scale: 'bg-orange',
  watch: 'bg-[#F2C230]',
  risk: 'bg-[#FF5A4F]',
};

function MerCard({ cur }: { cur: Currency }) {
  const { t } = useLang();
  const [v, set] = useFields<keyof typeof MER_DEFAULTS>(MER_DEFAULTS);
  const spends = { meta: money(v.meta), tiktok: money(v.tiktok), google: money(v.google), snap: money(v.snap) };
  const r = blended({ sales: money(v.sales), ...spends, margin: pct(v.margin) });
  const out = merUi.out;

  return (
    <Card kicker={merUi.kicker} title={merUi.title} body={merUi.body} how={merUi.how}>
      <Fields id="mer" fields={merUi.fields} values={v} onChange={set} cur={cur} />
      <Result>
        <Big label={out.mer} value={ratio(r.mer)} />
        <p className="mt-3 flex items-start gap-2.5 text-[0.9375rem] font-medium leading-relaxed text-ink">
          <span aria-hidden className={cn('mt-[0.5em] h-2.5 w-2.5 shrink-0 rounded-full', ZONE_DOT[r.zone])} />
          {t(merUi.zones[r.zone])}
        </p>
        <Rows>
          <Row label={out.poas}>
            <bdi dir="ltr">{ratio(r.poas)}</bdi>
          </Row>
          <Row label={out.net}>
            <Money value={r.net} cur={cur} />
          </Row>
          <Row label={out.netMargin}>
            <bdi dir="ltr">{percent(r.netMargin)}</bdi>
          </Row>
          <Row label={out.spend}>
            <Money value={r.spend} cur={cur} />
          </Row>
        </Rows>

        {r.spend > 0 && (
          <>
            <div dir="ltr" aria-hidden className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
              {PLATFORMS.map(
                (p) =>
                  spends[p.key] > 0 && (
                    <span key={p.key} style={{ flexGrow: spends[p.key], background: p.color }} className="min-w-[3px]" />
                  ),
              )}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-ink-dim">
              {PLATFORMS.map((p) => (
                <li key={p.key} className="flex items-center gap-2">
                  <i aria-hidden className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}{' '}
                  <bdi dir="ltr" className="num font-semibold text-ink">
                    {fmt((spends[p.key] / r.spend) * 100)}%
                  </bdi>
                </li>
              ))}
            </ul>
          </>
        )}
      </Result>
    </Card>
  );
}

/* ---------------------------------------------------------------- section */

export function Tools() {
  const { t } = useLang();
  const [cur, setCur] = useState<Currency>('EGP');

  return (
    <section id="tools" className="scroll-mt-16 border-t border-line">
      <div className="container-page py-20 md:py-32">
        <GiantHead
          index="05"
          label={toolsUi.label}
          word={giant.tools}
          title={toolsUi.title}
          aside={<p className="lede max-w-[44ch]">{t(toolsUi.intro)}</p>}
        />

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mt-14">
          <p className="text-sm text-ink-dim">{t(toolsUi.example)}</p>
          <div role="group" aria-label={t(toolsUi.currency)} className="flex flex-wrap items-center gap-2">
            <span className="label me-1">{t(toolsUi.currency)}</span>
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cur === c}
                onClick={() => setCur(c)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-300',
                  cur === c ? 'border-ink bg-ink text-cream' : 'border-line text-ink-dim hover:border-ink hover:text-ink',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="h-full">
            <BreakEvenCard cur={cur} />
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <MerCard cur={cur} />
          </Reveal>
        </div>

        <Reveal className="mt-8 flex flex-col gap-5 rounded-card border border-line p-5 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h3 className="display text-[calc(clamp(1.25rem,2.2vw,1.625rem)*var(--display-scale))] text-ink">
              {t(toolsSuggest.title)}
            </h3>
            <p className="mt-2 text-[0.9375rem] text-ink-dim">{t(toolsSuggest.body)}</p>
          </div>
          <Button
            href={`${contact.whatsapp.href}?text=${encodeURIComponent(t(toolsSuggest.prefill))}`}
            tone="whatsapp"
            className="self-start md:self-auto"
          >
            {t(toolsSuggest.cta)}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
