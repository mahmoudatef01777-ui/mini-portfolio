import type { Localized } from './content';

/**
 * THE PROOF LIBRARY — every verified result and every evidence capture this
 * site is allowed to publish, in one place.
 *
 * SOURCE OF TRUTH: the main portfolio (Site 1), audited file by file on
 * 2026-09-17 —
 *   site/src/content/results.ts            the result cards and their figures
 *   site/src/content/results-showcase.ts   the dashboard captures
 *   site/src/content/ads-manager.ts        the Ads Manager captures
 *   site/src/content/case-studies.ts       per-brand facts and shot captions
 *   site/src/content/bloomy.ts             Bloomy's figures and the ERP shots
 * Every figure and every caption below is COPIED from one of those files. None
 * of it was rewritten, rounded, recalculated or inferred. If a number here and
 * a number there ever disagree, Site 1 is right and this file is stale.
 *
 * The IMAGES are the same files Site 1 ships, copied into this site's own
 * `public/img` so nothing here depends on Site 1 being built or deployed. They
 * are copies at the byte level: never regenerate, redraw, retouch, crop or
 * annotate one, and never alter a figure inside one. A rebuilt screenshot is
 * not evidence.
 *
 * THE CAPTION IS PART OF THE EVIDENCE. It may state only what is legible on
 * the image — the tool, the view, the period, the figures shown. It may not
 * add a metric, a rate or a conclusion the capture does not itself display.
 *
 * RULES CARRIED OVER, all load-bearing:
 *  - Sales are not profit. Store sales are not ad-attributed sales.
 *  - "Messaging conversations" are conversations, NEVER orders, and a
 *    conversation count is never added to an order count.
 *  - Never add one platform's purchases to another's and set the total against
 *    the store's orders: each platform counts a purchase its own way and one
 *    order can be counted twice.
 *  - An approximate or business-reported figure is marked `soft` and says so
 *    in its own source line. It never sits unmarked beside a dashboard read.
 *  - Meta's "Maximum" preset reports the date the ad ACCOUNT opened (2023 on
 *    these accounts). A capture only carries a date range when that range is
 *    legible on the image itself.
 *
 * WHAT IS DELIBERATELY NOT HERE:
 *  - The WhatsApp order video. Every frame carries customer names, 60+ mobile
 *    numbers and delivery addresses; the PII and the evidence are the same
 *    pixels, so it cannot be redacted into something publishable.
 *  - Any customer-level ERP view, and any frame showing the ERP's admin url.
 *  - Bloomy's "+70% conversion": the prior period was near-empty.
 *  - Cove's "EGP 170K on day one": the Shopify chart shows no such day.
 */

/** Which tool the capture came out of. Drives the small source chip. */
export type ProofSource = 'shopify' | 'erp' | 'meta' | 'tiktok';

export interface EvidenceShot {
  id: string;
  src: string;
  width: number;
  height: number;
  brand: string;
  source: ProofSource;
  /** Only what is legible on the image. */
  caption: Localized;
  alt: Localized;
}

export const sourceLabel: Record<ProofSource, Localized> = {
  shopify: { ar: 'Shopify', en: 'Shopify' },
  erp: { ar: 'Odoo ERP', en: 'Odoo ERP' },
  meta: { ar: 'Meta Ads Manager', en: 'Meta Ads Manager' },
  tiktok: { ar: 'TikTok Ads Manager', en: 'TikTok Ads Manager' },
};

/* ------------------------------------------------------------- evidence */

/**
 * The 21 captures this site publishes, drawn from Site 1. Keyed by id so a section can name the
 * handful it shows without copying the caption a second time.
 */
export const evidence = {
  /* ---------------------------------------------- Shopify and the ERP */
  'bloomy-shopify': {
    id: 'bloomy-shopify',
    src: '/img/ev-bloomy-shopify.webp',
    width: 869,
    height: 331,
    brand: 'Bloomy',
    source: 'shopify',
    caption: {
      ar: 'Shopify · آخر 47 يوم · 28 أبريل – 14 يونيو 2026',
      en: 'Shopify · last 47 days · Apr 28 – Jun 14, 2026',
    },
    alt: {
      ar: 'داشبورد Shopify لستور البراند بتاعي: 21.9K جلسة، إجمالي مبيعات EGP 1.02M، 1,229 أوردر، ومعدل تحويل 5.44%.',
      en: "The Shopify dashboard for my own brand: 21.9K sessions, EGP 1.02M total sales, 1,229 orders and a 5.44% conversion rate.",
    },
  },
  'cove-shopify': {
    id: 'cove-shopify',
    src: '/img/ev-cove-shopify.webp',
    width: 692,
    height: 395,
    brand: 'Cove',
    source: 'shopify',
    caption: {
      ar: 'Shopify · 9 مايو – 14 يوليو 2026',
      en: 'Shopify · May 9 – Jul 14, 2026',
    },
    alt: {
      ar: 'داشبورد Shopify لستور بنيته وشغّلته: 35.7K جلسة، إجمالي مبيعات EGP 1,013,875، 1,526 أوردر، ومعدل تحويل 4.14%.',
      en: "The Shopify dashboard for a store I built and ran: 35.7K sessions, EGP 1,013,875 total sales, 1,526 orders and a 4.14% conversion rate.",
    },
  },
  'veloura-shopify-17': {
    id: 'veloura-shopify-17',
    src: '/img/ev-veloura-shopify-17.webp',
    width: 1648,
    height: 561,
    brand: 'Veloura',
    source: 'shopify',
    /*
      TWO THINGS WERE REMOVED FROM THIS IMAGE, AND ONLY TWO.

      The browser chrome across the top — search field, icons, the store's
      account name — is not part of the dashboard, and the main portfolio
      crops exactly this on its own captures. And the "+16.5K%" badge beside
      Sessions is covered under the standing rule in docs/CLAUDE.md: it is
      measured against Aug 27-Sep 6, which is before the ads started and the
      store was barely trading, so the percentage means nothing.

      EVERY ABSOLUTE FIGURE IS UNTOUCHED: 28.3K sessions, EGP 1.06M, 1,361
      orders, 4.51%, the EGP 1,061,525.00 total, the chart, the axis and both
      date ranges. The unedited original is kept outside `public/` in
      `_evidence-originals/`.
    */
    caption: {
      ar: 'Shopify · 7–17 سبتمبر 2026 · كل القنوات',
      en: 'Shopify · Sep 7–17, 2026 · all channels',
    },
    alt: {
      ar: 'داشبورد Shopify لستور شغّال دلوقتي: 28.3K جلسة، إجمالي مبيعات EGP 1,061,525، 1,361 أوردر، ومعدل تحويل 4.51%.',
      en: 'The Shopify dashboard for a store running now: 28.3K sessions, EGP 1,061,525 total sales, 1,361 orders and a 4.51% conversion rate.',
    },
  },
  'bloomy-erp-orders': {
    id: 'bloomy-erp-orders',
    src: '/img/ev-bloomy-erp.webp',
    width: 1413,
    height: 410,
    brand: 'Bloomy',
    source: 'erp',
    caption: {
      ar: 'Odoo ERP · إجماليات أوردرات البراند بتاعي · الأسامي وبيانات العملاء متخفية',
      en: "Odoo ERP · my own brand's order totals · names and customer data redacted",
    },
    alt: {
      ar: 'قائمة أوردرات في Odoo ERP بإجماليات صفوف البراند بتاعي، وأسامي الصفحات وبيانات العملاء متخفية.',
      en: "An Odoo ERP order list showing the row totals for my own brand, with the names and the customer data columns redacted.",
    },
  },
  'bloomy-erp-monthly': {
    id: 'bloomy-erp-monthly',
    src: '/img/ev-bloomy-erp-monthly.webp',
    width: 257,
    height: 172,
    brand: 'Bloomy',
    source: 'erp',
    caption: {
      ar: 'Odoo ERP · إجماليات شهرية · فبراير – يونيو 2026',
      en: 'Odoo ERP · monthly totals · Feb – Jun 2026',
    },
    alt: {
      ar: 'إجماليات شهرية من Odoo ERP لشهور فبراير حتى يونيو 2026.',
      en: 'Monthly totals in Odoo ERP for February through June 2026.',
    },
  },
  'bloomy-erp-by-page': {
    id: 'bloomy-erp-by-page',
    src: '/img/ev-bloomy-erp-by-page.webp',
    width: 1600,
    height: 532,
    brand: 'Bloomy',
    source: 'erp',
    /*
      THE ONE CAPTION THAT HAS TO EXPLAIN A MODEL, not just a screen. The
      grand total is EGP 6,785,810 and Bloomy's own rows are EGP 3.17M; the
      rest are pages that sold his products on commission while he ran
      fulfilment. Without that sentence the image reads as a 6.7M claim, which
      it is not. Copied verbatim from site/src/content/bloomy.ts.
    */
    caption: {
      ar: 'Odoo ERP مجمّع بصفحة الفيسبوك اللي جابت الأوردر. أسامي الصفحات كلها متخفية. تلات صفوف منهم للبراند بتاعي وإجماليهم 3.17 مليون، وهو الرقم اللي فوق. الباقي صفحات كانت بتبيع منتجاتي بعمولة وأنا اللي بشغّل الأوردر. الإجمالي 6,785,810 جنيه.',
      en: 'Odoo ERP grouped by the Facebook page an order came from. Every page name is redacted. Three of these rows are my own brand and they total EGP 3.17M, the figure at the top of this page. The rest are pages that sold my products on commission while I ran the order. Total EGP 6,785,810.',
    },
    alt: {
      ar: 'جدول Odoo ERP مجمّع بصفحة الفيسبوك: صفوف البراند بتاعي وصفوف الصفحات الشريكة بإجمالياتها والأسامي متخفية، وإجمالي كلي 6,785,810 جنيه.',
      en: "An Odoo ERP table grouped by Facebook page, with every page name redacted: my own brand's rows and the partner pages' rows with their totals, and a grand total of EGP 6,785,810.",
    },
  },
  'veloura-meta': {
    id: 'veloura-meta',
    src: '/img/ev-veloura-meta.webp',
    width: 1820,
    height: 430,
    brand: 'Veloura',
    source: 'meta',
    caption: {
      ar: 'Meta Ads — حملتين شغالين: 657 عملية شرا من الموقع بتكلفة EGP 20.75 للشرا، وصرف EGP 13,629.83 · 7–14 سبتمبر 2026.',
      en: 'Meta Ads — two live campaigns: 657 website purchases at EGP 20.75 per purchase, on EGP 13,629.83 spent · Sep 7–14, 2026.',
    },
    alt: {
      ar: 'جدول حملات Meta Ads لستور شغّال دلوقتي فيه 657 عملية شرا وصرف 13,629.83 جنيه.',
      en: 'A Meta Ads campaigns table for a store running now, showing 657 purchases on EGP 13,629.83 spent.',
    },
  },
  'veloura-tiktok-period': {
    id: 'veloura-tiktok-period',
    src: '/img/ev-veloura-tiktok.webp',
    width: 835,
    height: 600,
    brand: 'Veloura',
    source: 'tiktok',
    caption: {
      ar: 'TikTok Ads — صرف EGP 4,061.68 · 197,436 ظهور · CTR 2.86% · 287 تحويل · 9–14 سبتمبر 2026.',
      en: 'TikTok Ads — EGP 4,061.68 spent · 197,436 impressions · 2.86% CTR · 287 conversions · Sep 9–14, 2026.',
    },
    alt: {
      ar: 'داشبورد TikTok Ads لستور شغّال دلوقتي من 9 لـ 14 سبتمبر 2026.',
      en: "The TikTok Ads dashboard for a store running now, Sep 9–14, 2026.",
    },
  },
  'dahab-campaign': {
    id: 'dahab-campaign',
    src: '/img/ev-dahab-campaign.webp',
    width: 1841,
    height: 644,
    brand: 'Dahab Decor',
    source: 'meta',
    caption: {
      ar: 'Meta Ads Manager — الحملات والصرف وتكلفة النتيجة على الحساب اللي بنيته. الحساب بقى شغال عند الأونرز.',
      en: 'Meta Ads Manager — the campaigns, spend and cost per result on the account I built. The account is now run by the owners.',
    },
    alt: {
      ar: 'جدول حملات Meta Ads لمنتج high-ticket.',
      en: 'A Meta Ads campaigns table for a high-ticket product.',
    },
  },
  'fakhama-reels': {
    id: 'fakhama-reels',
    src: '/img/ev-fakhama-reels.webp',
    width: 1536,
    height: 326,
    brand: 'Fakhama',
    source: 'tiktok',
    caption: {
      ar: 'أعلى ٦ ريلز على TikTok: 1.5M · 1.2M · 1.2M · 889.1K · 474.3K · 401K مشاهدة',
      en: 'Top six TikTok reels: 1.5M · 1.2M · 1.2M · 889.1K · 474.3K · 401K views',
    },
    alt: {
      ar: 'ستة ريلز من TikTok لبراند ملابس رجالي وتحت كل واحد عدد مشاهداته.',
      en: 'Six TikTok reels for a menswear brand, each showing its view count.',
    },
  },

  /* ------------------------------------ Ads Manager · website purchases */
  'veloura-adsets-three': {
    id: 'veloura-adsets-three',
    src: '/img/ads-veloura-adsets-three.webp',
    width: 1860,
    height: 604,
    brand: 'Veloura',
    source: 'meta',
    caption: { ar: 'Meta · 3 ad sets · 6 – 14 سبتمبر 2026', en: 'Meta · three ad sets · Sep 6 – 14, 2026' },
    alt: {
      ar: 'Meta Ads Manager: ثلاث ad sets بإجمالي 289 website purchase، تكلفة الشراء EGP 16.19، وصرف EGP 4,680.27.',
      en: 'Meta Ads Manager: three ad sets totalling 289 website purchases, EGP 16.19 per purchase and EGP 4,680.27 spent.',
    },
  },
  'veloura-active-all': {
    id: 'veloura-active-all',
    src: '/img/ads-veloura-active-all.webp',
    width: 1867,
    height: 825,
    brand: 'Veloura',
    source: 'meta',
    caption: { ar: 'Meta · الإعلانات الشغّالة', en: 'Meta · active ads' },
    alt: {
      ar: 'Meta Ads Manager: نتايج من 19 إعلان بإجمالي 581 website purchase، تكلفة الشراء EGP 21.92، وصرف EGP 12,738.14.',
      en: 'Meta Ads Manager: results from 19 ads totalling 581 website purchases, EGP 21.92 per purchase and EGP 12,738.14 spent.',
    },
  },
  'bloomy-purchases-roas': {
    id: 'bloomy-purchases-roas',
    src: '/img/ads-bloomy-roas.webp',
    width: 1875,
    height: 540,
    brand: 'Bloomy',
    source: 'meta',
    caption: {
      ar: 'Meta · حملات بأعمدة Purchases و Purchase ROAS',
      en: 'Meta · campaigns with Purchases and Purchase ROAS columns',
    },
    alt: {
      ar: 'Meta Ads Manager لحساب البراند بتاعي: جدول حملات بأعمدة الصرف، Purchases، Website purchases، Purchase ROAS، تكلفة النتيجة، والـ CTR.',
      en: 'Meta Ads Manager for my own brand: a campaign table with columns for amount spent, purchases, website purchases, purchase ROAS, cost per result and CTR.',
    },
  },
  'veloura-tiktok': {
    id: 'veloura-tiktok',
    src: '/img/ads-veloura-tiktok.webp',
    width: 1757,
    height: 779,
    brand: 'Veloura',
    source: 'tiktok',
    caption: { ar: 'TikTok Ads Manager · 9 – 14 سبتمبر 2026', en: 'TikTok Ads Manager · Sep 9 – 14, 2026' },
    alt: {
      ar: 'داشبورد TikTok Ads Manager: صرف EGP 3,672.48، تكلفة التحويل EGP 14.40، CTR 2.89%، و255 تحويل.',
      en: 'The TikTok Ads Manager dashboard: EGP 3,672.48 spent, EGP 14.40 cost per conversion, 2.89% CTR and 255 conversions.',
    },
  },

  /* ------------------------------------------ Ads Manager · messaging */
  'bloomy-messaging': {
    id: 'bloomy-messaging',
    src: '/img/ads-bloomy-messaging.webp',
    width: 1875,
    height: 765,
    brand: 'Bloomy',
    source: 'meta',
    caption: { ar: 'Meta · الحملات', en: 'Meta · campaigns' },
    alt: {
      ar: 'Meta Ads Manager لحساب البراند بتاعي: جدول حملات بنتيجة Messaging conversations، أعلاها 12,385 محادثة بتكلفة EGP 1.83 للمحادثة.',
      en: 'Meta Ads Manager for my own brand: a campaign table reporting messaging conversations, the top row showing 12,385 conversations at EGP 1.83 each.',
    },
  },
  'veloura-campaigns-all': {
    id: 'veloura-campaigns-all',
    src: '/img/ads-veloura-campaigns-all.webp',
    width: 1858,
    height: 842,
    brand: 'Veloura',
    source: 'meta',
    caption: { ar: 'Meta · كل الحملات', en: 'Meta · all campaigns' },
    alt: {
      ar: 'Meta Ads Manager لحساب ستور شغّال دلوقتي: نتايج من 110 حملة، بإجمالي صرف EGP 191,377.52.',
      en: 'Meta Ads Manager for a store running now: results from 110 campaigns with EGP 191,377.52 total spent.',
    },
  },
  'dahab-campaigns': {
    id: 'dahab-campaigns',
    src: '/img/ads-dahab-campaigns.webp',
    width: 1872,
    height: 588,
    brand: 'Dahab Decor',
    source: 'meta',
    caption: { ar: 'Meta · الحملات', en: 'Meta · campaigns' },
    alt: {
      ar: 'Meta Ads Manager لحساب منتج high-ticket: جدول حملات بنتيجة Messaging conversations، أعلاها 3,212 محادثة بتكلفة EGP 2.04 للمحادثة.',
      en: 'Meta Ads Manager for the high-ticket product account: a campaign table reporting messaging conversations, the top row showing 3,212 conversations at EGP 2.04 each.',
    },
  },
  'el-haramein-ads': {
    id: 'el-haramein-ads',
    src: '/img/ads-el-haramein.webp',
    width: 1920,
    height: 788,
    brand: 'El Haramein',
    source: 'meta',
    caption: { ar: 'Meta · كل الإعلانات', en: 'Meta · all ads' },
    alt: {
      ar: 'Meta Ads Manager لحساب شوروم إضاءة: جدول إعلانات بأعمدة النتيجة وتكلفة النتيجة والصرف والمشاهدات والوصول.',
      en: 'Meta Ads Manager for the lighting showroom account: an ad table with columns for results, cost per result, amount spent, impressions and reach.',
    },
  },
  'brilliant-campaigns': {
    id: 'brilliant-campaigns',
    src: '/img/ads-brilliant-campaigns.webp',
    width: 1868,
    height: 691,
    brand: 'Brilliant',
    source: 'meta',
    caption: { ar: 'Meta · الحملات', en: 'Meta · campaigns' },
    alt: {
      ar: 'Meta Ads Manager لحساب تاجر كتب: جدول حملات بنتيجة Messaging conversations، أعلاها 1,142 محادثة بتكلفة EGP 10.56 للمحادثة.',
      en: 'Meta Ads Manager for the book retailer account: a campaign table reporting messaging conversations, the top row showing 1,142 conversations at EGP 10.56 each.',
    },
  },
  'pinky-mobile': {
    id: 'pinky-mobile',
    src: '/img/ads-pinky-mobile.webp',
    width: 453,
    height: 847,
    brand: 'pinky bon.egg',
    source: 'meta',
    caption: { ar: 'Meta · الحملات من الموبايل', en: 'Meta · campaigns, from mobile' },
    alt: {
      ar: 'تطبيق Meta Ads على الموبايل لحساب براند تاني: مبلغ منفق 164,801.61 ج.م، وحملتين نشطتين — واحدة بـ 1,947 محادثة بتكلفة 1.92 ج.م، والتانية بـ 5,516 محادثة بتكلفة 2.06 ج.م.',
      en: 'The Meta Ads mobile app for another account: EGP 164,801.61 spent, and two active campaigns — one with 1,947 messaging conversations at EGP 1.92 each, the other with 5,516 at EGP 2.06 each.',
    },
  },
  'fakhama-adsets': {
    id: 'fakhama-adsets',
    src: '/img/ads-fakhama-adsets.webp',
    width: 1872,
    height: 459,
    brand: 'Fakhama',
    source: 'meta',
    caption: {
      ar: 'Meta Ads Manager — الـ ad sets بتاعة الكامبين: صرف 1,103.54 + 1,528.02 جنيه، و664 + 2,824 محادثة. دي محادثات مش أوردرات؛ الأوردرات كانت بتتجمع يدوي على واتساب.',
      en: 'Meta Ads Manager — the ad sets in this campaign: EGP 1,103.54 + EGP 1,528.02 spent, and 664 + 2,824 messaging conversations. These are conversations, not orders; the orders were collected by hand over WhatsApp.',
    },
    alt: {
      ar: 'جدول ad sets في Meta Ads Manager لبراند ملابس رجالي بنتيجة messaging conversations والمبالغ المنفقة.',
      en: 'A Meta Ads Manager ad-sets table for a menswear brand showing messaging conversations and amounts spent.',
    },
  },
} satisfies Record<string, EvidenceShot>;

export type EvidenceId = keyof typeof evidence;

/** Resolve a list of ids in the order given. */
export function shots(ids: readonly EvidenceId[]): EvidenceShot[] {
  return ids.map((id) => evidence[id]);
}

/* --------------------------------------------------------- result cards */

export interface ResultFact {
  value: string;
  label: Localized;
  /** Where the figure was read, and over what period. Never omit it. */
  source: Localized;
  /** Approximate, derived or business-reported rather than read off a screen. */
  soft?: boolean;
}

export interface ResultCard {
  id: string;
  /**
   * Still required: it is the card's accessible name, it is what the evidence
   * captions say, and it is how the entry is identified in this file. It is
   * simply not PRINTED on the card any more — see `logo`.
   */
  brand: string;
  /**
   * The brand's real mark, shown in place of the name on Mahmoud's
   * instruction (2026-09-17) so a client's name is not sitting on the page as
   * selectable text for a visitor to copy into a search box.
   *
   * It is a real logo file copied from the main portfolio, never a drawn or
   * generated substitute. A brand whose logo is missing keeps its name — a
   * missing mark is never invented.
   */
  logo?: string;
  /**
   * What the card is called OUT LOUD — in the logo's alt text and anywhere the
   * name would otherwise be printed. It describes the brand without naming it,
   * which is the whole point: `brand` identifies the entry inside this file,
   * `alias` is what the page and a screen reader get.
   */
  alias?: Localized;
  badge?: Localized;
  /** The headline figure, pre-formatted, exactly as Site 1 publishes it. */
  value: string;
  label: Localized;
  /**
   * Whether the engagement is still running. Only set it when the answer is
   * not obvious from the figures: a case whose numbers end months ago reads as
   * ongoing unless the card says otherwise.
   */
  status?: Localized;
  /** What Mahmoud did. */
  did: Localized;
  /** Source and period for the headline. */
  source: Localized;
  soft?: boolean;
  /**
   * The one capture shown on the card itself — OPTIONAL.
   *
   * A card whose figures have moved past every capture in the library shows no
   * capture at all. Borrowing a screenshot that reports different numbers is
   * how evidence stops being evidence; an empty slot is honest and is fixed by
   * adding the new file, not by reaching for an old one.
   */
  cover?: EvidenceId;
  /**
   * Set ONLY when the cover does not show the headline's own window or figure,
   * and then it must say so plainly. A gap between a number and the screenshot
   * under it reads as inflation unless the page names the gap first.
   */
  coverNote?: Localized;
  /** Everything behind "view the evidence", cover first. */
  gallery: readonly EvidenceId[];
  facts: ResultFact[];
}

/**
 * Ordered strongest first, the same order Site 1 uses.
 *
 * NO BRAND LOGOS in this section, on Mahmoud's instruction: a row of marks
 * turns proof into a client carousel. A card is the figure, its context and
 * its evidence.
 */
export const resultCards: ResultCard[] = [
  {
    id: 'bloomy',
    brand: 'Bloomy',
    logo: '/img/logo-bloomy.webp',
    alias: { ar: 'البراند بتاعي', en: 'my own brand' } satisfies Localized,
    badge: { ar: 'البراند بتاعي', en: 'my own brand' },
    /* Ran about three to four months and is stopped now (docs/context.md §5).
       Without this the ERP total reads as a brand still trading. */
    status: { ar: 'وقفته بعد ~4 شهور', en: 'stopped it after ~4 months' },
    value: 'EGP 3.17M',
    label: { ar: 'إجمالي مبيعات البراند المتسجّلة', en: "the brand's total recorded sales" },
    did: {
      ar: 'بنيت الستور وشغّلت الإعلانات والتشغيل',
      en: 'built the store, ran the ads and the operations',
    },
    source: { ar: 'Odoo ERP · كل فترة البراند', en: "Odoo ERP · the brand's whole run" },
    cover: 'bloomy-erp-orders',
    gallery: [
      'bloomy-erp-orders',
      'bloomy-erp-by-page',
      'bloomy-erp-monthly',
      'bloomy-shopify',
      'bloomy-purchases-roas',
      'bloomy-messaging',
    ],
    facts: [
      { value: '4,544', label: { ar: 'أوردر', en: 'orders' }, source: { ar: 'Odoo ERP', en: 'Odoo ERP' } },
      {
        value: 'EGP 145K',
        label: { ar: 'صرف إعلانات', en: 'ad spend' },
        source: { ar: 'Odoo ERP · كل الفترة', en: 'Odoo ERP · whole period' },
      },
      {
        value: '1,229',
        label: { ar: 'أوردر من الستور', en: 'orders through the store' },
        source: { ar: 'Shopify · 47 يوم', en: 'Shopify · 47 days' },
      },
      {
        value: '5.44%',
        label: { ar: 'معدل تحويل الستور', en: 'store conversion rate' },
        source: { ar: 'Shopify · 47 يوم', en: 'Shopify · 47 days' },
      },
    ],
  },
  {
    id: 'cove',
    brand: 'Cove',
    logo: '/img/logo-cove.webp',
    alias: { ar: 'ستور بنيته وشغّلته', en: 'a store I built and ran' } satisfies Localized,
    value: 'EGP 1.01M',
    label: { ar: '1,526 أوردر organic', en: '1,526 organic orders' },
    did: {
      ar: 'بنيت الستور وشغّلت التشغيل والمبيعات',
      en: 'built the store, ran operations and sales',
    },
    source: { ar: 'Shopify · مايو–يوليو 2026 · من غير صرف إعلانات', en: 'Shopify · May–Jul 2026 · no ad spend' },
    cover: 'cove-shopify',
    gallery: ['cove-shopify'],
    facts: [
      {
        value: 'EGP 1,013,875',
        label: { ar: 'مبيعات الستور', en: 'store sales' },
        source: { ar: 'Shopify · 9 مايو – 14 يوليو 2026', en: 'Shopify · May 9 – Jul 14, 2026' },
      },
      {
        value: '1,526',
        label: { ar: 'أوردر', en: 'orders' },
        source: { ar: 'Shopify · نفس الفترة', en: 'Shopify · same period' },
      },
      {
        value: '35.7K',
        label: { ar: 'زيارة', en: 'sessions' },
        source: { ar: 'Shopify · نفس الفترة', en: 'Shopify · same period' },
      },
      {
        value: '4.14%',
        label: { ar: 'معدل تحويل الستور', en: 'store conversion rate' },
        source: { ar: 'Shopify · نفس الفترة', en: 'Shopify · same period' },
      },
    ],
  },
  {
    /*
      MOVED TO THE Sep 7-17 WINDOW on 2026-09-17, from three dashboards Mahmoud
      read off himself: Shopify (all channels), Meta Ads Manager and TikTok Ads
      Manager. It replaces the Sep 7-14 snapshot, which is the shorter window
      inside this one.

      THE SHOPIFY FIGURES KEEP MOVING, because the store is live: 1,290 orders
      at 26.4K sessions, then 1,298 at 26.7K, now 1,361 at 28.3K — all inside
      two days, all the same Sep 7-17 window. Any figure here is a reading at a
      moment, not a final number. Take the newest reading and print the date
      beside it; never average two readings, and never keep an older one just
      because it is the one that has a screenshot.

      THE CAPTURE MATCHES THE HEADLINE AGAIN. The Sep 7-14 shot was removed on
      2026-09-19 — it reported 988 orders under a headline that says 1,361, and
      a screenshot that argues with the number above it is worse than none —
      and the Sep 7-17 capture Mahmoud supplied replaced it the same day. If
      the figures move again, the capture has to move with them.

      THE CAPTURES FOR THIS WINDOW ARE NOT IN THE PROJECT YET. The card's cover
      is still the Sep 7-14 Shopify shot, so `coverNote` says outright that the
      capture is the shorter window and the headline is the longer one — the
      same thing Bloomy's card does where its screen and its headline cover
      different spans. Drop the three new files into the project and this note
      comes out.

      THE TWO SPEND FIGURES ARE ADDITIVE AND THE ORDERS ARE NOT. Meta's spend
      plus TikTok's spend is money out of one pocket, so ~EGP 22K is a sum that
      holds. Meta's purchases plus TikTok's conversions is NOT, and neither can
      be set against Shopify's 1,290: that view says "All channels", so those
      are store orders from every source, not ad-attributed ones.

      The Meta figure is the two campaigns legible in the capture
      (7,333.68 + 9,416.92), not an account total — there is no totals row in
      the shot, so it is not claimed as one.
    */
    id: 'veloura',
    brand: 'Veloura',
    logo: '/img/logo-veloura.webp',
    alias: { ar: 'ستور شغّال دلوقتي', en: 'a store running now' } satisfies Localized,
    badge: { ar: 'شغال دلوقتي', en: 'live' },
    value: '1,361',
    label: {
      /* "أول 10 أيام إعلانات", not "10 أيام": the store did not open on the
         7th — the ads did. Without the word the figure reads as the store's
         whole life, which would be a much smaller claim than it is. */
      ar: 'أوردر · EGP 1.06M مبيعات الستور في أول 10 أيام إعلانات', // REVIEW
      en: 'orders · EGP 1.06M in store sales in the first 10 days of ads',
    },
    /* The Arabic ENDS IN ARABIC on purpose: a Latin run at the end of an
       Arabic line sits next to the full stop, which is a neutral character,
       and bidi then reorders the two. Hence "22 ألف جنيه", not "EGP 22K". */
    did: {
      ar: 'بنيت الستور وبشغّل Meta وTikTok — إجمالي صرف الإعلانات في الفترة دي حوالي 22 ألف جنيه', // REVIEW
      en: 'built the store, running Meta and TikTok — about EGP 22K of ad spend across the period',
    },
    source: {
      ar: 'Shopify · 7–17 سبتمبر 2026 · كل القنوات · نتايج مبكرة',
      en: 'Shopify · Sep 7–17, 2026 · all channels · early results',
    },
    cover: 'veloura-shopify-17',
    gallery: [
      'veloura-shopify-17',
      'veloura-meta',
      'veloura-tiktok-period',
      'veloura-adsets-three',
      'veloura-active-all',
      'veloura-tiktok',
      'veloura-campaigns-all',
    ],
    facts: [
      {
        /* Read off the "Total sales over time" panel, which prints the figure
           in full; the tiles above it round the same number to EGP 1.01M. */
        value: 'EGP 1,061,525',
        label: { ar: 'مبيعات الستور · كل القنوات', en: 'store sales · all channels' },
        source: { ar: 'Shopify · 7–17 سبتمبر 2026', en: 'Shopify · Sep 7–17, 2026' },
      },
      {
        value: '28.3K',
        label: { ar: 'زيارة · معدل تحويل 4.51%', en: 'sessions · 4.51% conversion rate' },
        source: { ar: 'Shopify · نفس الفترة', en: 'Shopify · same period' },
      },
      {
        value: 'EGP 16,750',
        label: { ar: 'صرف Meta · الحملتين في اللقطة', en: 'Meta spend · the two campaigns in the capture' },
        source: { ar: 'Meta Ads · 7–17 سبتمبر 2026', en: 'Meta Ads · Sep 7–17, 2026' },
      },
      {
        value: 'EGP 5,190',
        label: { ar: 'صرف TikTok', en: 'TikTok spend' },
        source: { ar: 'TikTok Ads · 9–17 سبتمبر 2026', en: 'TikTok Ads · Sep 9–17, 2026' },
      },
    ],
  },
  {
    id: 'dahab-decor',
    brand: 'Dahab Decor',
    logo: '/img/logo-dahab-decor.webp',
    alias: { ar: 'منتج high-ticket', en: 'a high-ticket product' } satisfies Localized,
    value: '~EGP 770,000',
    label: {
      ar: 'مبيعات ~70 باب من كامبين صرفه EGP 11,000',
      en: 'sales across ~70 doors from an EGP 11,000 campaign',
    },
    did: {
      ar: 'بنيت هيكل الحملات لمنتج high-ticket ودرّبت الأونرز',
      en: 'built the ad setup for a high-ticket product and trained the owners',
    },
    source: { ar: 'رقم تقديري من البيزنس', en: 'Approximate, reported by the business' },
    soft: true,
    cover: 'dahab-campaign',
    gallery: ['dahab-campaign', 'dahab-campaigns'],
    facts: [
      {
        value: 'EGP 11,000',
        label: { ar: 'صرف إعلانات', en: 'ad spend' },
        source: { ar: 'صرف الكامبين', en: 'Campaign spend' },
      },
      {
        value: '~40',
        label: { ar: 'باب اتباع من الكامبين مباشرة', en: 'doors sold by the campaign directly' },
        source: { ar: 'رقم تقديري', en: 'Approximate' },
        soft: true,
      },
      {
        value: '+~30',
        label: { ar: 'باب زيادة من صفقة جات من الكامبين', en: 'more doors from one deal the campaign brought in' },
        source: { ar: 'رقم تقديري', en: 'Approximate' },
        soft: true,
      },
    ],
  },
  {
    id: 'fakhama',
    brand: 'Fakhama',
    logo: '/img/logo-fakhama.webp',
    alias: { ar: 'براند ملابس رجالي', en: 'a menswear brand' } satisfies Localized,
    value: '~EGP 180,000',
    label: {
      ar: 'مبيعات أول كامبين، في 4 أيام بصرف EGP 2,650',
      en: 'sales from the first campaign, in 4 days on EGP 2,650 of spend',
    },
    did: { ar: 'ظبطت البراند وأدرت الكريتيف والتصوير', en: 'rebuilt the brand, directed creative and shoots' },
    /*
      The only figure on this site that is a multiplication rather than a
      reading, and the source line is where it says so. Do not shorten it.
    */
    source: { ar: 'رقم تقديري — 120 أوردر في متوسط 1,500 جنيه', en: 'Approximate — 120 orders at an average of EGP 1,500' },
    soft: true,
    cover: 'fakhama-adsets',
    gallery: ['fakhama-adsets', 'fakhama-reels'],
    facts: [
      {
        value: '~EGP 2,650',
        label: { ar: 'صرف إعلانات', en: 'ad spend' },
        source: { ar: 'Meta Ads Manager', en: 'Meta Ads Manager' },
      },
      {
        value: '~120',
        label: { ar: 'أوردر', en: 'orders' },
        source: { ar: 'رقم من البيزنس', en: 'Reported by the business' },
        soft: true,
      },
      {
        value: '1.5M',
        label: { ar: 'مشاهدة لأعلى ريل', en: 'views on the top reel' },
        source: { ar: 'TikTok', en: 'TikTok' },
      },
      {
        value: '43.6K',
        label: { ar: 'متابع على TikTok', en: 'TikTok followers' },
        source: { ar: 'TikTok · عام', en: 'TikTok · public' },
      },
    ],
  },
];

/* ------------------------------------------------------------- sections */

/**
 * The Ads Manager library. `featured` is what the page shows without being
 * asked; `all` is everything, grouped the way Site 1 groups it — purchase
 * campaigns first, messaging campaigns after, because the objective changes
 * what the numbers mean.
 */
export const adsLibrary = {
  featured: ['veloura-active-all', 'bloomy-purchases-roas', 'veloura-tiktok'] as const,
  groups: [
    {
      id: 'web',
      title: { ar: 'حملات شراء من الموقع', en: 'Website purchase campaigns' } satisfies Localized,
      ids: [
        'veloura-adsets-three',
        'veloura-active-all',
        'bloomy-purchases-roas',
        'veloura-tiktok',
      ] as const,
    },
    {
      id: 'messaging',
      title: { ar: 'حملات المسجات', en: 'Messaging campaigns' } satisfies Localized,
      ids: [
        'bloomy-messaging',
        'veloura-campaigns-all',
        'dahab-campaigns',
        'el-haramein-ads',
        'brilliant-campaigns',
        'pinky-mobile',
        'fakhama-adsets',
      ] as const,
    },
  ],
};

/**
 * THE MESSAGING BAND — the two message-campaign captures, on their own.
 *
 * Mahmoud asked for these two pulled out of the Ads Manager list and given
 * their own block, because message commerce is a different motion from a
 * website purchase and the captures were getting lost among the rest.
 *
 * WHAT THE TWO IMAGES ACTUALLY SHOW, and therefore all the copy may say:
 *  - one account: a campaign table whose RESULT column is Messaging
 *    conversations, the top row 12,385 conversations at EGP 1.83 each;
 *  - the other: 110 campaigns with EGP 191,377.52 total spent, and a total
 *    row that reads "Multiple conversions" — so that account's 110 campaigns
 *    are NOT all messaging, and this copy does not say they are.
 *
 * NEITHER IMAGE SHOWS A SALES FIGURE. Not one. So no sales figure goes in
 * this block until one arrives with a source that can carry it — a
 * conversation is not an order, an order is not revenue, and spend on an
 * account is not sales from that account. This is the rule the whole file
 * exists to hold, and it holds hardest here, where the numbers are biggest.
 */
export const messaging = {
  label: { ar: 'حملات المسجات', en: 'Messaging campaigns' } satisfies Localized,
  title: {
    ar: 'ودي حملات المسجات، من نفس الحسابات.',
    en: 'And these are the messaging campaigns, from the same accounts.',
  } satisfies Localized,
  intro: {
    ar: 'دي حملات نتيجتها محادثات على ماسنجر وإنستجرام وواتساب، مش أوردرات ومش مبيعات — والأوردر بيتقفل بعد كده في المحادثة نفسها.', // REVIEW
    en: 'These are campaigns whose result is a conversation on Messenger, Instagram or WhatsApp — not an order and not revenue. The order is closed afterwards, inside the conversation.',
  } satisfies Localized,

  /*
    THE FIGURE IS HIS, AND THE CAPTURES ARE NOT ITS SOURCE.

    Mahmoud asked for ~EGP 3M on this block. Neither image under it shows a
    sales figure — one reports messaging conversations and their cost, the
    other reports spend across 110 campaigns — so the figure cannot be
    sourced to them and the source line says so outright.

    It is published the same way Dahab Decor's ~EGP 770,000 and Fakhama's
    ~EGP 180,000 are: marked approximate, attributed to the business, and
    never set beside a dashboard read as though it were one. That is the only
    shape a number like this is allowed to take on this site.

    WHAT IT MUST NEVER BECOME: "the ads made EGP 3M". Ad spend on the Bloomy
    account is around 5% of that brand's recorded sales, organic and the
    moderation team carried the rest, and docs/CLAUDE.md forbids attributing
    sales to paid ads without attribution evidence. And the conversation
    counts in these captures are never to be added to it, or to each other.
  */
  stat: {
    value: '~EGP 3M',
    label: {
      ar: 'مبيعات اتقفلت جوّه المحادثات',
      en: 'in sales closed through the conversations',
    } satisfies Localized,
    source: {
      ar: 'رقم تقديري من البيزنس — اللقطتين تحت بيورّوا المحادثات والصرف، مش المبيعات', // REVIEW
      en: 'Approximate, reported by the business — the captures below show the conversations and the spend, not the sales',
    } satisfies Localized,
  },
  ids: ['bloomy-messaging', 'veloura-campaigns-all'] as const,
  note: {
    ar: 'اللقطتين دول بيورّوا عدد المحادثات وتكلفتها والصرف — ومفيهمش رقم مبيعات. أي رقم مبيعات لحملات المسجات لازم ييجي من الـERP مش من الـAds Manager.', // REVIEW
    en: 'These two captures show conversation counts, their cost and the spend — and no sales figure. Any sales figure for messaging has to come from the ERP, not from Ads Manager.',
  } satisfies Localized,
};

/** UI copy for the proof section and the evidence viewer. */
export const proofUi = {
  resultsLabel: { ar: 'النتايج', en: 'Results' } satisfies Localized,
  resultsTitle: { ar: 'كل رقم ومصدره.', en: 'Every number, with its source.' } satisfies Localized,
  resultsIntro: {
    ar: 'كل رقم تحته اللقطة اللي طالع منها. اضغط «شوف الدليل» عشان تشوفها كاملة.',
    en: 'Each card carries the capture its figure was read from. Open the evidence to read it in full.',
  } satisfies Localized,

  viewEvidence: { ar: 'شوف الدليل', en: 'View the evidence' } satisfies Localized,
  viewAllAds: { ar: 'شوف كل لقطات الـ Ads Manager', en: 'View every Ads Manager capture' } satisfies Localized,
  close: { ar: 'إقفل', en: 'Close' } satisfies Localized,
  zoomIn: { ar: 'كبّر الصورة', en: 'Zoom in' } satisfies Localized, // REVIEW
  zoomOut: { ar: 'صغّر الصورة', en: 'Zoom out' } satisfies Localized, // REVIEW
  fitLabel: { ar: 'على الشاشة', en: 'Fit' } satisfies Localized,
  panHint: { ar: 'اسحب يمين وشمال عشان تقرا الجدول كله', en: 'Drag sideways to read the whole table' } satisfies Localized,
  prev: { ar: 'السابق', en: 'Previous' } satisfies Localized,
  next: { ar: 'التالي', en: 'Next' } satisfies Localized,

  /** Marks a figure that is approximate or reported rather than read. */
  softLabel: { ar: 'رقم تقديري', en: 'Approximate' } satisfies Localized,

  softNote: {
    ar: 'أي رقم عليه «تقديري» مصدره البيزنس نفسه مش داشبورد — والمصدر مكتوب جنبه.',
    en: 'Figures marked approximate come from the business itself or from a calculation, not from a dashboard — and each one says which.',
  } satisfies Localized,
};
