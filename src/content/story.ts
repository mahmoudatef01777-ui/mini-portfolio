import type { Localized } from './content';

/**
 * THE STORY PAGE — every word of it is in this file.
 *
 * SOURCE OF TRUTH for the FIGURES: the main portfolio's `/background` page
 * (`site/src/content/background-page.ts`), which carries Mahmoud's account as
 * he supplied it on 2026-09-14. Every number here is identical to the number
 * there. The PROSE was rewritten by Mahmoud himself on 2026-09-18 and is set
 * down as he sent it — do not "improve" it into cleaner Arabic, shorten it, or
 * reorder it. The English follows it sentence for sentence and is drafted, so
 * it is marked REVIEW.
 *
 * It is a copy rather than an import ON PURPOSE. Site 1 and Site 2 share no
 * code, so this page renders with Site 1 deleted, offline, or never deployed.
 *
 * TWO CAUTIONS, BOTH LOAD-BEARING:
 *
 *  1. EGP 6.5M IS THE COMPANY'S SALES, not his result. It is the business's
 *     figure for a period in which he ran a large part of the operation. The
 *     copy says that in its own sentence and the chip repeats it. Never
 *     shorten it to "he did EGP 6.5M", and never move it into a stat tile on
 *     its own where the qualifier can fall off.
 *
 *  2. THE FACTORY STAGE IS NOT A CLAIM OF EXPERTISE. He went, he watched, he
 *     learned what a delay does downstream. He is not a manufacturer and not
 *     a production specialist, and the copy says so out loud.
 *
 * WITHDRAWN, do not reintroduce: the childhood shop and poultry story, and the
 * figures ~20,000 orders / ~2,000 packed / ~12,000 moderation / ~EGP 2M
 * courier accounts.
 *
 * NO SCREENSHOTS ON THIS PAGE, on Mahmoud's instruction (2026-09-19): the
 * home page's Results section already publishes the evidence, and showing it
 * twice makes the story read as a second results page. This page is the
 * journey; the proof lives where it already lived.
 */

export interface StoryStage {
  id: string;
  name: Localized;
  /** One entry per paragraph. Keep them short; this is a timeline, not an essay. */
  body: Localized<string[]>;
  stats?: Array<{
    value: string;
    label: Localized;
    /** Set the figure smaller and dimmer — for a number that is not his. */
    quiet?: boolean;
  }>;
}

export const story = {
  /** Back to THIS site's home page. There is no link out of the site here. */
  back: { ar: 'العودة للبورتفوليو', en: 'Back to the portfolio' } satisfies Localized,

  /* --------------------------------------------------------------- hero */
  label: { ar: 'الحكاية كاملة', en: 'The full background' } satisfies Localized,

  title: {
    ar: 'من المخزن للأوردرات والتشغيل، وبعدين Bloomy',
    en: 'From the warehouse to the orders and the operation — and then Bloomy',
  } satisfies Localized,

  lead: {
    ar: 'بدأت من المخزن، مش من Ads Manager.',
    en: 'I started in the warehouse, not in Ads Manager.',
  } satisfies Localized,

  /**
   * THE ONE LINE THAT SEPARATES THESE NUMBERS FROM THE REST OF THE SITE.
   *
   * Every other figure published anywhere on this site was read off a
   * dashboard and carries the tool and the period beside it. The three on this
   * timeline are not: they are Mahmoud's own count of work he did, from years
   * before any of those dashboards existed. Without this line they sit in the
   * same visual language as the verified ones and borrow their authority.
   *
   * Note for the record: `site/src/content/background-page.ts` calls these
   * COUNTS rather than estimates and deliberately gives them no "approx."
   * qualifier. Mahmoud chose the more cautious wording on 2026-09-19. Erring
   * downward on your own numbers is always allowed; erring upward never is.
   */
  statsNote: {
    ar: 'أرقام تقديرية من فترة شغلي في تشغيل البيزنس',
    en: 'Approximate figures from my time running operations',
  } satisfies Localized,

  /* ----------------------------------------------------------- timeline */
  stages: [
    {
      id: 'operations',
      name: { ar: 'تشغيل الـE-commerce', en: 'E-commerce operations' },
      body: {
        ar: [
          'بدأت من المخزن وتحضير الأوردرات. جهزت أكتر من 5,000 أوردر، واستلمت أكتر من 11,000 قطعة.',
          'هنا بدأت أفهم إن كل أوردر وراه مخزون، تكلفة وتشغيل.',
        ],
        en: [
          'I started in the warehouse and in preparing orders. I prepared more than 5,000 orders and received more than 11,000 pieces.', // REVIEW
          'This is where I started to understand that behind every order there is stock, cost and an operation.', // REVIEW
        ],
      },
      stats: [
        { value: '+5,000', label: { ar: 'أوردر جهّزتها', en: 'orders prepared' } },
        { value: '+11,000', label: { ar: 'قطعة استلمتها في المخزن', en: 'pieces received into the warehouse' } },
      ],
    },
    {
      id: 'customers',
      name: { ar: 'العملاء والأوردرات', en: 'Customers & orders' },
      body: {
        ar: [
          'بعدها بدأت أتعامل بشكل مباشر مع العملاء، وشوفت مشاكل المرتجعات وإعادة الطلبات والشحن.',
          'بدأت أفهم ليه الأوردر بيتقفل، وليه أحيانًا ما بيوصلش.',
        ],
        en: [
          'Then I started dealing with customers directly, and saw the problems of returns, reorders and shipping.', // REVIEW
          'I began to understand why an order closes, and why sometimes it never arrives.', // REVIEW
        ],
      },
      stats: [
        { value: '+4,000', label: { ar: 'أوردر مرتجعات وإعادة طلبات', en: 'orders involving returns and replacements' } },
      ],
    },
    {
      id: 'managing',
      name: { ar: 'إدارة التشغيل', en: 'Managing the operation' },
      body: {
        ar: [
          'بعدها بدأت أدير جزء كبير من التشغيل: فريق الـModeration، المخزون والاستلامات، التنسيق مع المصنع ومتابعة التشغيل اليومي.',
          'خلال حوالي 6 شهور، البيزنس حقق حوالي EGP 6.5M في المبيعات خلال فترة كنت مسؤول فيها عن جزء كبير من التشغيل.',
        ],
        en: [
          'Then I began running a large part of the operation: the moderation team, the stock and what came in, coordinating with the factory and following the daily operation.', // REVIEW
          'Over about six months the business did around EGP 6.5M in sales, in a period when I was responsible for a large part of the operation.', // REVIEW
        ],
      },
      stats: [
        {
          /*
            THE QUALIFIER IS PART OF THE FIGURE. It is the company's sales in
            that period, not a result attributed to him, and this label is the
            only thing on the card that says so. Do not shorten it.

            `quiet` sets the figure smaller and dimmer than the others on
            purpose. It is the largest number on the page and the least his,
            so it must not be the loudest thing in the section — the sentence
            under it is what the reader actually needs.
          */
          quiet: true,
          value: 'EGP 6.5M',
          label: {
            ar: 'مبيعات الشركة في الفترة دي — مش نتيجة منسوبة ليا',
            en: "the company's sales in that period — not a result attributed to me",
          },
        },
      ],
    },
    {
      id: 'production',
      name: { ar: 'التصنيع', en: 'Production' },
      body: {
        ar: [
          'بعدها دخلت أكتر في جانب الإنتاج، ونزلت المصنع وشوفت مراحل التصنيع بنفسي.',
          'مش متخصص تصنيع، لكن التجربة دي فهمتني قد إيه تأخير الإنتاج أو مشكلة في المنتج ممكن تأثر على المخزون، الأوردرات والعميل في الآخر.',
        ],
        en: [
          'Then I went deeper into the production side, went down to the factory and saw the manufacturing stages myself.', // REVIEW
          'I am not a production specialist, but that experience taught me how much a delay in production, or a problem in the product, can reach the stock, the orders and in the end the customer.', // REVIEW
        ],
      },
    },
    {
      id: 'bloomy',
      name: { ar: 'Bloomy', en: 'Bloomy' },
      body: {
        ar: [
          /* NO FAMILY ON THIS SITE. Never "my cousin", never a relative, never
             a name — Mahmoud's standing instruction, 2026-09-19. The role
             ended; whose business it was is not the reader's business. */
          'بعد ما خلصت شغلي في البيزنس ده، بدأت Bloomy من الصفر.',
          'درست المنتج والسوق والمنافسين والتكلفة، واختبرت الطلب بـMessage Ads، وبدأت أبني البيزنس خطوة بخطوة.',
        ],
        en: [
          'After that role ended, I started Bloomy from scratch.',
          'I studied the product, the market, the competitors and the cost, tested demand with Message Ads, and built the business step by step.', // REVIEW
        ],
      },
    },
    {
      id: 'shopify',
      name: { ar: 'Shopify والـPerformance Marketing', en: 'Shopify & performance marketing' },
      body: {
        ar: [
          'مع Bloomy دخلت أعمق في الـShopify والـCRO والـAOV، وبنيت الستور بنفسي.',
          'وبدأت أشغل Meta Ads وأختبر الـCreatives والـAngles، وأربط اللي بشوفه في الـAds Manager باللي بيحصل بعد الأوردر.',
        ],
        en: [
          'With Bloomy I went deeper into Shopify, CRO and AOV, and built the store myself.', // REVIEW
          'I started running Meta Ads, testing creatives and angles, and tying what I saw in Ads Manager to what happened after the order.', // REVIEW
        ],
      },
    },
  ] satisfies StoryStage[],

  /**
   * NOT A STEP, SO NOT A NUMBER. This was 07 on the timeline, which made the
   * conclusion look like one more thing that happened to him in sequence. It
   * is what the sequence added up to, so it closes the section as a pull
   * quote instead.
   */
  closing: {
    ar: 'الإعلان ممكن يجيب الأوردر، لكن البيزنس كله هو اللي بيحدد إذا كان الأوردر ده مربح فعلًا ولا لأ.',
    en: 'The ad can bring the order, but the whole business decides whether that order is actually profitable.',
  } satisfies Localized,

  /**
   * THE ONE DIAGRAM ON THE PAGE. There used to be three — a chain under stage
   * 04, another under 06, and this one — which made the device feel like a
   * decoration rather than a point. Steps 05 and 06 already say in words what
   * the "turning point" block restated, so that block went too.
   */
  flow: [
    { ar: 'المنتج', en: 'Product' },
    { ar: 'السوق', en: 'Market' },
    { ar: 'الكرياتيف', en: 'Creative' },
    { ar: 'الإعلان', en: 'Ads' },
    { ar: 'الموقع', en: 'Website' },
    { ar: 'الأوردرات', en: 'Orders' },
    { ar: 'التشغيل', en: 'Operations' },
    { ar: 'النتيجة', en: 'Results' },
  ] as Localized[],

  /* ------------------------------------------------------------ learned */
  learned: {
    label: { ar: 'الخلاصة', en: 'The takeaway' } satisfies Localized,
    title: { ar: 'اللي خرجت بيه', en: 'What I took from it' } satisfies Localized,
    body: {
      ar: [
        'اتعلمت إن المبيعات مش أرباح، وإن الأوردر اللي اتعمل مش بالضرورة أوردر وصل للعميل.',
        'وعشان كده، لما أشوف مشكلة في الأرقام، مش بفترض إن الحل إعلان جديد.',
        'ممكن المشكلة تكون في المنتج، الموقع، التشغيل، أو اللي بيحصل بعد الأوردر.',
      ],
      en: [
        'I learned that sales are not profit, and that an order taken is not necessarily an order that reached the customer.', // REVIEW
        'So when I see a problem in the numbers, I do not assume the answer is another ad.', // REVIEW
        'It could be the product, the site, the operation, or what happens after the order.', // REVIEW
      ],
    } satisfies Localized<string[]>,
  },

  /* ----------------------------------------------------------- takeaway */
  /** Deliberately the home page's own hero line: the story ends where the
   *  landing began, so the visitor lands back on the positioning. */
  takeaway: {
    lead: { ar: 'أنا مش بشوف الإعلان لوحده.', en: "I don't look at the ad on its own." } satisfies Localized,
    body: {
      ar: 'بشوف المنتج، السوق، العميل، الـwebsite، الـoperations والأرقام — وبعدها بشوف الإعلان.',
      en: 'I look at the product, the market, the customer, the website, the operations and the numbers — and then I look at the ad.',
    } satisfies Localized,
  },

  /* ---------------------------------------------------------------- seo */
  seo: {
    title: { ar: 'الحكاية كاملة — محمود عاطف', en: 'The full background — Mahmoud Atef' } satisfies Localized,
    description: {
      ar: 'من المخزن وتحضير الأوردرات، للتشغيل وإدارته، لـ Bloomy والـ Shopify والإعلانات — الحكاية بالترتيب اللي حصلت بيه.',
      en: 'From the warehouse and preparing orders, to running the operation, to Bloomy, Shopify and the ads — the story in the order it happened.',
    } satisfies Localized,
  },
};
