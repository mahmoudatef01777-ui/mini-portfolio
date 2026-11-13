/**
 * THE WORDS THE REDESIGN ADDED, and nothing else.
 *
 * Every line here is built from facts the site already states: he builds
 * Shopify stores, runs Meta and TikTok ads, works on conversion rate and
 * order value, and checks the operation before scaling. Google Ads stays
 * "expanding into". No client, no figure and no testimonial is introduced
 * here; figures live in `proof.ts` and `content.ts` and nowhere else.
 */
import type { Localized } from './content';

export const nav = {
  items: [
    { id: 'results', label: { ar: 'النتايج', en: 'Results' } },
    { id: 'about', label: { ar: 'مين أنا', en: 'About' } },
    { id: 'services', label: { ar: 'الخدمات', en: 'Services' } },
    { id: 'work', label: { ar: 'الشغل', en: 'Work' } },
    { id: 'process', label: { ar: 'طريقتي', en: 'Process' } },
  ] as { id: string; label: Localized }[],
  contact: { ar: 'كلّمني', en: 'Contact' } satisfies Localized,
  menu: { ar: 'القايمة', en: 'Menu' } satisfies Localized,
  close: { ar: 'إقفل', en: 'Close' } satisfies Localized,
};

export const heroExtra = {
  /** The giant type. His name as the domain and the tab spell it. */
  name: ['MAHMOUD', 'ELZAQLA'] as const,
  getInTouch: { ar: 'كلّمني', en: 'Get in touch' } satisfies Localized,
  /** Runs round the circular button. Latin in both languages: these are
      the platforms' own names. */
  ring: 'E-COMMERCE GROWTH · SHOPIFY · META ADS · TIKTOK ADS · ',
  scroll: { ar: 'انزل تحت', en: 'Scroll down' } satisfies Localized,
  platforms: 'Shopify · Meta · TikTok',
  portraitAlt: {
    ar: 'محمود عاطف بيضحك، لابس بولو مقلّم.',
    en: 'Mahmoud Atef smiling, in a striped polo.',
  } satisfies Localized,
};

export const services = {
  label: { ar: 'الخدمات', en: 'Services' } satisfies Localized,
  title: {
    /* U+2011, a hyphen that does not break: "e-" alone at a line end reads as a typo. */
    ar: 'بعمل إيه لبراند e‑commerce.',
    en: 'What I do for an e‑commerce brand.',
  } satisfies Localized,
  intro: {
    ar: 'خمس حاجات بيشتغلوا كسيستم واحد: الستور، والإعلانات، والتشغيل اللي وراهم.',
    en: 'Five things that work as one system: the store, the ads, and the operation behind them.',
  } satisfies Localized,
  items: [
    {
      n: '01',
      name: { ar: 'ستورات Shopify', en: 'Shopify stores' },
      body: {
        ar: 'ببني الستور على Shopify وعيني على تجربة الشرا، مش الشكل بس.',
        en: 'I build the store on Shopify with the buying experience in mind, not only the look.',
      },
    },
    {
      n: '02',
      name: { ar: 'إعلانات Meta', en: 'Meta Ads' },
      body: {
        ar: 'حملات فيسبوك وإنستجرام، وبقرا نتيجتها بالأوردرات وربح الأوردر، مش بالـROAS لوحده.',
        en: 'Facebook and Instagram campaigns, read against the orders and what each order earns, not ROAS alone.',
      },
    },
    {
      n: '03',
      name: { ar: 'إعلانات TikTok', en: 'TikTok Ads' },
      body: {
        ar: 'حملات TikTok، والكرياتيف والزاوية والرسالة قبل الصرف.',
        en: 'TikTok campaigns where the creative, the angle and the message come before the spend.',
      },
    },
    {
      n: '04',
      name: { ar: 'التحويل وقيمة الأوردر', en: 'Conversion and order value' },
      body: {
        ar: 'نسبة التحويل، وقيمة الأوردر، والطريق من صفحة المنتج لحد الدفع.',
        en: 'The conversion rate, the order value, and the path from product page to checkout.',
      },
    },
    {
      n: '05',
      name: { ar: 'التشغيل والـScaling', en: 'Operations and scaling' },
      body: {
        ar: 'الستوك والشحن والتسليم والمرتجعات قبل الـScaling، عشان التشغيل يستحمل الطلب.',
        en: 'Stock, shipping, delivery and returns checked before scaling, so the operation can carry the demand.',
      },
    },
  ] as { n: string; name: Localized; body: Localized }[],
  /* docs/CLAUDE.md: Google Ads is something he is expanding into. */
  note: { ar: 'وبوسّع خبرتي في Google Ads.', en: "And I'm expanding into Google Ads." } satisfies Localized,
};

export const work = {
  label: { ar: 'شغل مختار', en: 'Selected work' } satisfies Localized,
  title: {
    ar: 'تلات ستورات، والأرقام من الداشبوردات بتاعتها.',
    en: 'Three stores, with figures straight from their own dashboards.',
  } satisfies Localized,
  facts: { ar: 'الأرقام', en: 'The figures' } satisfies Localized,
  hint: {
    ar: 'افتح أي رقم تشوف عملت إيه، والأرقام اللي وراه، والداشبورد اللي طالع منه.',
    en: 'Open any figure to see what I did, the numbers behind it, and the dashboard it came from.',
  } satisfies Localized,
  did: { ar: 'عملت إيه', en: 'What I did' } satisfies Localized,
  captures: { ar: 'لقطة', en: 'captures' } satisfies Localized,
};

export const processUi = {
  label: { ar: 'طريقتي', en: 'Process' } satisfies Localized,
};

export const footer = {
  top: { ar: 'لفوق', en: 'Back to top' } satisfies Localized,
};

/**
 * The giant slash headings, after the reference's "/ABOUT". Short on
 * purpose: they are a signpost set huge, not a sentence. The sentence under
 * each one is the section's real heading.
 */
export const giant = {
  about: { ar: 'مين أنا', en: 'About' } satisfies Localized,
  services: { ar: 'الخدمات', en: 'Services' } satisfies Localized,
  work: { ar: 'الشغل', en: 'Work' } satisfies Localized,
  results: { ar: 'النتايج', en: 'Results' } satisfies Localized,
  process: { ar: 'طريقتي', en: 'Process' } satisfies Localized,
};

export const workUi = {
  more: { ar: 'التفاصيل', en: 'Details' } satisfies Localized,
  less: { ar: 'اقفل التفاصيل', en: 'Hide details' } satisfies Localized,
};

export const footerUi = {
  together: { ar: 'يلا نشتغل سوا', en: "Let's work together" } satisfies Localized,
  message: { ar: 'ابعتلي رسالة', en: 'Send me a message' } satisfies Localized,
  rights: { ar: 'كل رقم في الموقع جنبه مصدره.', en: 'Every figure on this site carries its source.' } satisfies Localized,
};

/**
 * The 30-second nudge (components/Nudge.tsx). Mahmoud chose line 1 on
 * 2026-11-11. It is a QUESTION, not a promise: the site's honesty clause says
 * its figures are evidence, not a guarantee, and a "I'll double your sales"
 * would contradict it.
 */
export const nudge = {
  text: {
    ar: 'عايز تضاعف مبيعاتك؟ ابعتلي على واتساب ونشوف فين الفرصة.',
    en: 'Want to double your sales? Message me on WhatsApp and let’s find where the growth is.',
  } satisfies Localized,
  /** What the visitor finds already typed in the chat. */
  prefill: {
    ar: 'أهلًا محمود، شفت البورتفوليو بتاعك. عندي براند e-commerce وعايز أزوّد المبيعات. نقدر نتكلم؟',
    en: 'Hi Mahmoud, I saw your portfolio. I run an e-commerce brand and want to grow my sales. Can we talk?',
  } satisfies Localized,
  open: { ar: 'افتح الرسالة', en: 'Open the message' } satisfies Localized,
  close: { ar: 'اقفل الرسالة', en: 'Close the message' } satisfies Localized,
  from: 'Mahmoud Elzaqla',
};
