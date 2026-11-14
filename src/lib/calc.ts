/**
 * THE MATHS BEHIND THE TWO CALCULATORS (components/Tools.tsx).
 *
 * Pure functions: numbers in, numbers out, no React. The words that explain
 * them live in `content/tools.ts`; keep the two in step if a formula changes.
 */

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * What a visitor typed, as a number. Arabic-Indic digits, a comma as the
 * thousands mark and the Arabic decimal mark all work; anything that is not a
 * number counts as 0, so a half-typed field never breaks the page.
 */
export function parseNum(raw: string): number {
  const clean = raw
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/٫/g, '.')
    .replace(/[٬,\s]/g, '');
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n : 0;
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** 1,234.5 in either language (Latin digits, like every figure on the site),
    or a dash when the answer does not exist. */
export function fmt(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return '—';
  // -0.001 would otherwise print as "-0".
  const value = Math.abs(n) < 0.5 * 10 ** -digits ? 0 : n;
  return value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/* ------------------------------------------------------- break-even ROAS */

export type BreakEvenInput = {
  price: number;
  cogs: number;
  shipping: number;
  /** Payment or cash-on-delivery fee, % of the price. */
  fee: number;
  /** Share of orders that come back, %. */
  returns: number;
  /** Packaging, gifts and the like, per order. */
  other: number;
};

/** The share of the price a store wants left over as NET profit once the ads
    are paid for. The "target ROAS" is the ROAS that leaves exactly this. */
export const TARGET_NET_MARGIN = 0.15;

/**
 * A returned order counts as no sale, no product cost and no payment fee, but
 * its shipping is still paid. So per order:
 *
 *   kept     = price x (1 - returns)
 *   costs    = (cogs + price x fee) x (1 - returns) + shipping + other
 *   profit   = kept - costs                      (this is also the max CPA)
 *   roas     = price / profit                    (break-even)
 *   target   = price / (profit - price x 15%)    (15% net profit)
 */
export function breakEven(i: BreakEvenInput) {
  const r = i.returns / 100;
  const kept = i.price * (1 - r);
  const costs = (i.cogs + (i.price * i.fee) / 100) * (1 - r) + i.shipping + i.other;
  const profit = kept - costs;
  const spare = profit - i.price * TARGET_NET_MARGIN;
  return {
    profit,
    cpa: profit,
    roas: profit > 0 ? i.price / profit : NaN,
    margin: i.price > 0 ? (profit / i.price) * 100 : NaN,
    target: spare > 0 ? i.price / spare : NaN,
    loss: profit <= 0,
  };
}

/* ------------------------------------------------------------- MER / POAS */

export type MerInput = {
  sales: number;
  meta: number;
  tiktok: number;
  google: number;
  snap: number;
  /** Margin after product cost and shipping, % of sales. */
  margin: number;
};

export type Zone = 'scale' | 'watch' | 'risk';

/** POAS at or above this is room to scale; between 1 and this, go carefully;
    below 1 the ads cost more than the profit they bring. A rule of thumb. */
export const SCALE_POAS = 1.3;

/**
 *   spend  = meta + tiktok + google + snap
 *   profit = sales x margin                      (before ads)
 *   MER    = sales / spend
 *   POAS   = profit / spend
 *   net    = profit - spend
 */
export function blended(i: MerInput) {
  const spend = i.meta + i.tiktok + i.google + i.snap;
  const profit = (i.sales * i.margin) / 100;
  const net = profit - spend;
  const poas = spend > 0 ? profit / spend : NaN;
  const zone: Zone = Number.isFinite(poas) ? (poas >= SCALE_POAS ? 'scale' : poas >= 1 ? 'watch' : 'risk') : 'watch';
  return {
    spend,
    mer: spend > 0 ? i.sales / spend : NaN,
    poas,
    net,
    netMargin: i.sales > 0 ? (net / i.sales) * 100 : NaN,
    zone,
  };
}
