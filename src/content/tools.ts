/**
 * THE WORDS OF THE TOOLS SECTION (components/Tools.tsx), and nothing else.
 *
 * Two free calculators: break-even ROAS with max CPA, and MER with POAS. They
 * were first built for the Tafseel site and are brought here as they are; the
 * arithmetic is in `lib/calc.ts`. No client, no figure and no result of
 * Mahmoud's is claimed here: the numbers a visitor sees are an example, and
 * then their own.
 */
import type { Localized } from './content';

export type Currency = 'EGP' | 'SAR' | 'AED' | 'USD';
export const CURRENCIES: Currency[] = ['EGP', 'SAR', 'AED', 'USD'];

export type Field<K extends string> = {
  key: K;
  /** `money` takes the chosen currency as its unit, `pct` takes a %. */
  unit: 'money' | 'pct';
  label: Localized;
};

export const toolsUi = {
  label: { ar: 'الأدوات', en: 'Tools' } satisfies Localized,
  title: {
    ar: 'حاسبتين تجاوبك قبل ما تصرف على الإعلان.',
    en: 'Two calculators for before you spend on ads.',
  } satisfies Localized,
  intro: {
    ar: 'حاسبتين ببلاش ومن غير تسجيل. اكتب أرقامك والنتيجة بتتحدّث قدامك.',
    en: 'Two free calculators, no signup. Type your numbers and the result updates as you type.',
  } satisfies Localized,
  currency: { ar: 'العملة', en: 'Currency' } satisfies Localized,
  currencies: {
    EGP: { ar: 'جنيه', en: 'EGP' },
    SAR: { ar: 'ريال', en: 'SAR' },
    AED: { ar: 'درهم', en: 'AED' },
    USD: { ar: 'دولار', en: 'USD' },
  } satisfies Record<Currency, Localized>,
  example: {
    ar: 'الأرقام المكتوبة مثال، غيّرها بأرقامك.',
    en: 'The numbers filled in are an example. Replace them with yours.',
  } satisfies Localized,
  result: { ar: 'النتيجة', en: 'Result' } satisfies Localized,
  how: { ar: 'إزاي بتتحسب', en: 'How it is worked out' } satisfies Localized,
};

export const breakevenUi = {
  kicker: { ar: 'ربحية المنتج', en: 'Product profitability' } satisfies Localized,
  title: { ar: 'Break-Even ROAS وأقصى تكلفة للأوردر', en: 'Break-even ROAS and max CPA' } satisfies Localized,
  body: {
    ar: 'اعرف أقل ROAS لازم توصله علشان المنتج ما يخسرش، وأقصى مبلغ تدفعه في الأوردر قبل ما تشغّل الحملة.',
    en: 'The lowest ROAS a product needs to avoid losing money, and the most you can pay per order before you launch a campaign.',
  } satisfies Localized,
  fields: [
    { key: 'price', unit: 'money', label: { ar: 'سعر البيع', en: 'Selling price' } },
    { key: 'cogs', unit: 'money', label: { ar: 'تكلفة المنتج', en: 'Product cost' } },
    { key: 'shipping', unit: 'money', label: { ar: 'الشحن على حسابك للأوردر', en: 'Shipping you pay per order' } },
    { key: 'fee', unit: 'pct', label: { ar: 'رسوم الدفع أو التحصيل (%)', en: 'Payment or COD fee (%)' } },
    { key: 'returns', unit: 'pct', label: { ar: 'نسبة المرتجعات (%)', en: 'Return rate (%)' } },
    {
      key: 'other',
      unit: 'money',
      label: { ar: 'تكاليف تانية للأوردر (تغليف، هدايا...)', en: 'Other costs per order (packaging, gifts...)' },
    },
  ] satisfies Field<'price' | 'cogs' | 'shipping' | 'fee' | 'returns' | 'other'>[],
  out: {
    roas: { ar: 'Break-Even ROAS', en: 'Break-even ROAS' } satisfies Localized,
    cpa: { ar: 'أقصى تكلفة للأوردر (Max CPA)', en: 'Max cost per order (CPA)' } satisfies Localized,
    profit: { ar: 'ربح الأوردر قبل الإعلانات', en: 'Profit per order before ads' } satisfies Localized,
    margin: { ar: 'هامش الربح قبل الإعلانات', en: 'Margin before ads' } satisfies Localized,
    target: { ar: 'الـ ROAS المستهدف لربح 15% صافي', en: 'Target ROAS for 15% net profit' } satisfies Localized,
  },
  loss: {
    ar: 'المنتج ده خسران قبل ما تصرف أي حاجة على الإعلانات. راجع السعر أو التكلفة الأول.',
    en: 'This product loses money before you spend anything on ads. Fix the price or the costs first.',
  } satisfies Localized,
  tip: {
    ar: 'لو الـ ROAS عندك أقل من الـ Break-Even يبقى بتخسر في كل أوردر. لو فوق المستهدف، تقدر تكبّر الميزانية.',
    en: 'Below break-even ROAS you lose money on every order. Above the target, you can scale the budget.',
  } satisfies Localized,
  how: {
    ar: 'الأوردر المرتجع بيتحسب كأنه ما اتباعش: من غير تكلفة منتج ولا رسوم دفع، لكن الشحن بيتدفع. الـ Break-Even ROAS هو سعر البيع ÷ ربح الأوردر. والمستهدف بيسيب 15% من السعر كربح صافي.',
    en: 'A returned order counts as no sale, no product cost and no payment fee; shipping is still paid. Break-even ROAS is the selling price divided by the profit per order. The target leaves 15% of the price as net profit.',
  } satisfies Localized,
};

export const merUi = {
  kicker: { ar: 'كل القنوات مع بعض', en: 'All channels together' } satisfies Localized,
  title: { ar: 'MER و Blended ROAS', en: 'MER and blended ROAS' } satisfies Localized,
  body: {
    ar: 'اجمع صرفك على ميتا وتيك توك وجوجل وسناب، واعرف المتجر كله كسبان ولا لأ قبل ما تكبّر الميزانية.',
    en: 'Add up your spend on Meta, TikTok, Google and Snapchat, and see whether the whole store is profitable before you scale.',
  } satisfies Localized,
  fields: [
    { key: 'sales', unit: 'money', label: { ar: 'إجمالي مبيعات المتجر في الفترة', en: 'Total store sales for the period' } },
    { key: 'meta', unit: 'money', label: { ar: 'صرف Meta', en: 'Meta spend' } },
    { key: 'tiktok', unit: 'money', label: { ar: 'صرف TikTok', en: 'TikTok spend' } },
    { key: 'google', unit: 'money', label: { ar: 'صرف Google', en: 'Google spend' } },
    { key: 'snap', unit: 'money', label: { ar: 'صرف Snapchat', en: 'Snapchat spend' } },
    {
      key: 'margin',
      unit: 'pct',
      label: { ar: 'هامش الربح بعد تكلفة المنتج والشحن (%)', en: 'Margin after product cost and shipping (%)' },
    },
  ] satisfies Field<'sales' | 'meta' | 'tiktok' | 'google' | 'snap' | 'margin'>[],
  out: {
    mer: { ar: 'MER (المبيعات ÷ كل الصرف)', en: 'MER (sales ÷ total spend)' } satisfies Localized,
    poas: { ar: 'POAS (الربح ÷ الصرف)', en: 'POAS (profit ÷ spend)' } satisfies Localized,
    net: { ar: 'صافي الربح بعد الإعلانات', en: 'Net profit after ads' } satisfies Localized,
    netMargin: { ar: 'هامش الربح الصافي', en: 'Net margin' } satisfies Localized,
    spend: { ar: 'إجمالي الصرف', en: 'Total spend' } satisfies Localized,
  },
  zones: {
    scale: { ar: 'منطقة التكبير: تقدر تزوّد الميزانية', en: 'Scaling zone: you can raise the budget' },
    watch: { ar: 'منطقة حذر: كبّر بالراحة وراقب الأرقام', en: 'Watch zone: scale slowly and track the numbers' },
    risk: { ar: 'خسارة: الإعلانات بتاكل الربح', en: 'Losing money: ads are eating the profit' },
  } satisfies Record<'scale' | 'watch' | 'risk', Localized>,
  how: {
    ar: 'الـ MER هو المبيعات ÷ كل الصرف على الإعلانات. والـ POAS هو الربح (المبيعات × الهامش) ÷ الصرف. قاعدة تقريبية: فوق 1.3× منطقة تكبير، من 1× لـ 1.3× حذر، وتحت 1× الإعلانات بتكلّف أكتر من الربح اللي بتجيبه.',
    en: 'MER is sales divided by all ad spend. POAS is the profit (sales × margin) divided by spend. A rule of thumb: above 1.3× is the scaling zone, from 1× to 1.3× watch, and below 1× the ads cost more than the profit they bring.',
  } satisfies Localized,
};

export const toolsSuggest = {
  title: { ar: 'عندك حسبة بتعملها كل يوم؟', en: 'A calculation you do every day?' } satisfies Localized,
  body: {
    ar: 'ابعتهالي وأشوف أبنيها كأداة.',
    en: 'Send it to me and I will look at building it as a tool.',
  } satisfies Localized,
  cta: { ar: 'ابعتها على واتساب', en: 'Send it on WhatsApp' } satisfies Localized,
  /** What the visitor finds already typed in the chat. */
  prefill: {
    ar: 'أهلًا محمود، عندي فكرة حاسبة للموقع:',
    en: 'Hi Mahmoud, I have an idea for a calculator for your site:',
  } satisfies Localized,
};

/**
 * The button under a result: the visitor's own numbers, typed into a
 * WhatsApp message for them. Nothing is sent until they press send in
 * WhatsApp. `{name}` slots are filled in by `components/Tools.tsx`.
 */
export const sendNumbers = {
  cta: { ar: 'ابعتلي أرقامك على واتساب', en: 'Send me these numbers on WhatsApp' } satisfies Localized,
  breakeven: {
    ar: 'أهلًا محمود، حسبت منتجي: سعر البيع {price} {cur}، وBreak-Even ROAS {roas}، وأقصى تكلفة للأوردر {cpa} {cur}. تقدر تساعدني أشغّل الإعلانات عليه؟',
    en: 'Hi Mahmoud, I ran my product through your calculator: selling price {price} {cur}, break-even ROAS {roas}, max CPA {cpa} {cur}. Can you help me run ads on it?',
  } satisfies Localized,
  mer: {
    ar: 'أهلًا محمود، حسبت متجري: MER {mer}، وPOAS {poas}، وصافي الربح بعد الإعلانات {net} {cur}. ممكن نتكلم؟',
    en: 'Hi Mahmoud, I ran my store through your calculator: MER {mer}, POAS {poas}, net profit after ads {net} {cur}. Can we talk?',
  } satisfies Localized,
};
