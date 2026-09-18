/**
 * EVERY WORD ON THIS SITE IS IN THIS FILE.
 *
 * Site 2 is the landing that sits in Mahmoud's Instagram bio. It is not a
 * second portfolio: there are no projects, no case studies, no project cards
 * and no brand logos beside a figure. Someone who wants more depth reads this
 * site's OWN story page (`content/story.ts`, route `/story`) — this site never
 * sends a visitor to another site to finish reading.
 *
 * ACCURACY RULES, carried over from the main portfolio and not negotiable:
 *  - Never invent, inflate or recalculate a number.
 *  - Every published figure carries its source and its period.
 *  - Sales are sales. They are never called profit, and messaging
 *    conversations are never called orders.
 *  - He is not a developer and not a generic media buyer. Building tools and
 *    building stores are things he does; neither is the positioning.
 *  - Google Ads is something he is EXPANDING INTO, not something he claims as
 *    expertise. The wording below says so, and must keep saying so.
 *
 * Both languages live side by side. Change both, or the English side of the
 * site keeps saying the old thing.
 */

export type Lang = 'ar' | 'en';
export type Localized<T = string> = Record<Lang, T>;

/*
 * THERE IS NO URL TO THE MAIN PORTFOLIO IN THIS FILE, deliberately.
 *
 * "القصة كاملة" used to leave the site. It does not any more: it opens
 * `/story`, which is this site's own page. Re-adding a link out here would
 * hand a visitor to a site that may not be deployed, and would undo the point
 * of Site 2 standing on its own.
 */

export const identity = {
  name: { ar: 'محمود عاطف', en: 'Mahmoud Atef' } satisfies Localized,
  role: {
    ar: 'E-commerce Growth Specialist',
    en: 'E-commerce Growth Specialist',
  } satisfies Localized,
};

export const contact = {
  whatsapp: {
    href: 'https://wa.me/201008726224',
    label: { ar: 'كلمني على واتساب', en: 'Message me on WhatsApp' } satisfies Localized,
  },
  linkedin: {
    href: 'https://linkedin.com/in/mahmoudelzaqla',
    label: { ar: 'لينكدإن', en: 'LinkedIn' } satisfies Localized,
    display: 'linkedin.com/in/mahmoudelzaqla',
  },
  email: {
    href: 'mailto:mahmoudelzaqla@gmail.com',
    display: 'mahmoudelzaqla@gmail.com',
  },
};

/* ------------------------------------------------------------------ hero */

export const hero = {
  eyebrow: identity.role,
  /** The full stop is set in the accent colour by the component. */
  headline: {
    ar: 'أنا مش بشوف الإعلان لوحده.',
    en: "I don't look at the ad on its own.",
  } satisfies Localized,
  subline: {
    ar: 'بشوف المنافسين والـbenchmark، المنتج، السوق، العميل، الـwebsite، الـoperations والأرقام — وبعدها بشوف الإعلان.',
    en: 'I look at the competitors and the benchmark, the product, the market, the customer, the website, the operations and the numbers — and then I look at the ad.',
  } satisfies Localized,
  photo: {
    src: '/img/hero-mobile.webp',
    wide: '/img/hero-desktop.webp',
    width: 1080,
    height: 1350,
    alt: {
      ar: 'محمود عاطف قدام داشبوردات Shopify بتوضّح نتايج المتاجر اللي اشتغل عليها.',
      en: 'Mahmoud Atef in front of Shopify dashboards showing results from the stores he has worked on.',
    } satisfies Localized,
  },
};

/* ----------------------------------------------------------------- about */

export const about = {
  label: { ar: 'مين أنا؟', en: 'Who I am' } satisfies Localized,

  /**
   * MAHMOUD'S OWN WORDS, sent 2026-09-17 and set down as he wrote them. This
   * Arabic is not drafted copy and it is not marked REVIEW — do not "improve"
   * it into cleaner Arabic, do not shorten it, and do not reorder it.
   *
   * The English follows it sentence for sentence and IS drafted, so it is
   * marked REVIEW until he reads it.
   *
   * ONE STANDING CAUTION, carried from docs/CLAUDE.md: the factory line is
   * about what he lived through, not expertise he claims. "I watched a factory
   * run late" is a story about operations. It must never drift into calling
   * him a manufacturer or a production specialist.
   */
  lead: {
    ar: 'أنا مش بدأت من Ads Manager. بدأت من المخزن، والأوردرات، والشحن، والستوك، والمصنع.',
    en: "I didn't start in Ads Manager. I started in the warehouse — the orders, the shipping, the stock, the factory.",
  } satisfies Localized,

  body: {
    ar: [
      'حضرت آلاف الأوردرات، اشتغلت على الـERP، وتابعت التشغيل والستوك والإنتاج. ومع الوقت فهمت إن الإعلان جزء من السيستم، مش السيستم كله.',
      /* "متابعة التصنيع", never "التصنيع" on its own: docs/CLAUDE.md is explicit
         that he coordinated production and is not a manufacturer. One word is
         the whole difference. */
      'ومع Bloomy عشت الدورة كاملة بنفسي — من اختيار المنتج والتسعير ومتابعة التصنيع، للإعلان والـwebsite والأوردرات والشحن والمرتجعات.',
      'عشان كده لما ببص على إعلان، مش بسأل جاب كام أوردر — بسأل الأوردر ده حصله إيه بعد كده.',
    ],
    en: [
      'I prepared thousands of orders, worked on the ERP, and followed the operation, the stock and the production. Over time I understood that the ad is one part of the system, not the whole system.',
      'And with Bloomy I lived the full cycle myself — from choosing the product, the pricing and following the production, through to the ads, the website, the orders, the shipping and the returns.',
      "So when I look at an ad, I don't ask how many orders it brought. I ask what happened to that order afterwards.",
    ],
  } satisfies Localized<string[]>,

  portraitAlt: {
    ar: 'محمود عاطف في إطار دائري، ولوجو Shopify بيلف على حافته.',
    en: 'Mahmoud Atef in a circular frame, with the Shopify mark running round its edge.',
  } satisfies Localized,

  chainLead: {
    ar: 'النتيجة مش بتبدأ من الإعلان.',
    en: "The result doesn't start at the ad.",
  } satisfies Localized,

  /**
   * SIX STEPS, NOT ONE SENTENCE WITH ARROWS IN IT.
   *
   * Written inline, the arrow is a neutral character sitting between two runs
   * and the bidi algorithm decides which side it belongs to — in Arabic it
   * ends up pointing back at the step before it, so the chain reads backwards.
   * As a list, the component draws the arrow itself and flips it with the
   * reading direction, which is the only way this stays correct in both.
   */
  chain: [
    { ar: 'المنتج', en: 'Product' },
    { ar: 'الإعلان', en: 'The ad' },
    { ar: 'الأوردر', en: 'The order' },
    { ar: 'التشغيل', en: 'Operations' },
    { ar: 'التسليم', en: 'Delivery' },
    { ar: 'النتيجة النهائية للبيزنس', en: "The business's bottom line" },
  ] as Localized[],
};

/* --------------------------------------------------------------- results */

/**
 * NUMBER -> REAL SCREENSHOT -> CONTEXT.
 *
 * The three figures are the ones the main portfolio publishes, unchanged. The
 * screenshots below them are the SAME FILES the portfolio uses — copied, not
 * regenerated — and their captions are the portfolio's captions word for
 * word, because a caption is what makes a screenshot evidence rather than
 * decoration.
 *
 * NO BRAND LOGOS in this section. Proof here is the figure, the dashboard and
 * the period; a row of client logos would turn it into a brand carousel and
 * that is Site 1's job, not this page's.
 */
export const results = {
  label: { ar: 'الخبرة', en: 'Experience' } satisfies Localized,
  title: {
    ar: 'اتعلّمت الـ e-commerce من جوّه.',
    en: 'I learned e-commerce from the inside.',
  } satisfies Localized,

  stats: [
    {
      id: 'orders',
      value: '25,000+',
      label: { ar: 'أوردر اتعاملت معاها وأدرتها', en: 'Orders handled and managed' } satisfies Localized,
    },
    {
      id: 'sales',
      value: 'EGP 7M+',
      label: {
        ar: 'مبيعات في بيزنسات e-commerce مختلفة',
        en: 'Sales across e-commerce businesses',
      } satisfies Localized,
    },
    {
      id: 'time',
      /**
       * The figure ALONE, with the word in `unit`. The value renders inside
       * an LTR isolate so bidi cannot reorder it; a unit left inside that
       * isolate gets dragged to the wrong side of the number in Arabic, and
       * "~6 شهور" ends up reading as "شهور 6~".
       */
      value: '~6',
      unit: { ar: 'شهور', en: 'months' } satisfies Localized,
      label: { ar: 'المدة اللي اتحققت فيها المبيعات دي', en: 'The period these sales were recorded in' } satisfies Localized, // REVIEW
    },
  ],

  evidenceLabel: { ar: 'من الداشبوردات نفسها', en: 'From the dashboards themselves' } satisfies Localized,

  /*
   * THE CAPTURES THEMSELVES ARE NOT HERE. Every screenshot this site can
   * publish, with its caption, lives in `content/proof.ts` — one library,
   * one set of captions, so the home page and the story page can never
   * describe the same image two different ways.
   */

  note: {
    ar: 'دي مبيعات وأوردرات متسجلة، مش أرباح — وأرقام شغل عملته بنفسي، مش نتايج منسوبة ليا. كل لقطة مكتوب جنبها مصدرها وفترتها.',
    en: 'These are recorded sales and orders, not profit — and they count work I did myself, not results attributed to me. Every screenshot carries its source and its period.',
  } satisfies Localized,

  cta: { ar: 'القصة كاملة', en: 'Read the full story' } satisfies Localized,
};

/* ------------------------------------------------------------------- ads */

/**
 * A CURATED THREE, not the whole archive: one Meta ad set reporting website
 * purchases, one Meta campaign table carrying the ROAS column, and TikTok.
 * Enough to show the performance work is real; the rest lives on Site 1.
 *
 * Every caption states only what the screenshot itself shows.
 */
export const ads = {
  label: { ar: 'من الـ Ads Manager', en: 'From the Ads Manager' } satisfies Localized,
  title: {
    ar: 'الأرقام دي من الحسابات نفسها.',
    en: 'These come from the accounts themselves.',
  } satisfies Localized,
  /* The captures live in `content/proof.ts`; `adsLibrary` says which of
     them this section shows and which sit behind the viewer. */

  note: {
    ar: 'اللقطة اللي مكتوب جنبها تاريخ، ده التاريخ الظاهر فيها. و«Messaging conversations» لو ظهرت في أي جدول، دي محادثات مش أوردرات.',
    en: 'Where a capture carries a date range, that is the range shown in the image. And where a table reports "messaging conversations", those are conversations, not orders.',
  } satisfies Localized,
};

/* ------------------------------------------------------------- help with */

/* ----------------------------------------------------------------- growth */

/**
 * NOT A SERVICES GRID, AND NOT A LIST OF TACTICS.
 *
 * "Meta Ads / TikTok Ads / Shopify" as four tiles is what every media buyer's
 * page says, and it says nothing about how he works. This section replaced
 * that on 2026-09-19: it is the way he decides where a business can grow, and
 * advertising is one block inside it rather than the whole of it.
 *
 * THE ARGUMENT IT HAS TO CARRY, in order: understand the business before the
 * ad; check the product has room before pushing demand; use marketing to find
 * where the growth is; know that scaling is six levers and not one; know that
 * an operation which cannot absorb demand is a reason to slow down, not a
 * reason to spend more; and know that a large sales number is not by itself a
 * healthy business.
 *
 * TWO RULES THIS SECTION MUST KEEP:
 *  - Google Ads is something he is EXPANDING INTO, never expertise he claims.
 *    Block 03 says so and must keep saying so (docs/CLAUDE.md).
 *  - Block 06's closing line is the portfolio's honesty clause: the figures on
 *    this site are evidence of work that happened, not a promise of the same
 *    result for anyone else. It is not a disclaimer to be trimmed for tone.
 *
 * Copy approved by Mahmoud on 2026-09-19, Arabic and English, exactly as it
 * stands here. Do not rewrite it.
 */
export const growth = {
  label: { ar: 'النمو', en: 'Growth' } satisfies Localized,
  title: {
    ar: 'إزاي بفكر في النمو',
    en: 'How I think about growth',
  } satisfies Localized,
  intro: {
    ar: 'مش كل نمو بيبدأ من الإعلان، ومش كل Scaling معناه Budget أكبر.',
    en: "Not every growth opportunity starts with ads, and scaling doesn't always mean a bigger budget.",
  } satisfies Localized,

  blocks: [
    {
      id: 'business',
      n: '01',
      name: { ar: 'البيزنس والسوق', en: 'The business and the market' } satisfies Localized,
      lead: {
        ar: 'قبل ما أفكر في الإعلان، بفهم إحنا بنحاول نكبّر إيه أصلًا.',
        en: "Before I think about ads, I want to understand what we're actually trying to grow.",
      } satisfies Localized,
      points: [
        { ar: 'المنتج بيتباع ليه؟ ومين اللي بيشتريه؟', en: 'Why the product sells, and who is buying it' },
        { ar: 'السوق والمنافسين شكلهم إيه؟', en: 'What the market and the competition look like' },
        { ar: 'فين الفرصة اللي البراند يدخل منها؟', en: 'Where the opening for this brand is' },
        { ar: 'وهل المشكلة أصلًا محتاجة إعلانات؟', en: 'And whether the problem even needs more ads' },
      ] as Localized[],
    },
    {
      id: 'product',
      n: '02',
      name: { ar: 'المنتج والـOffer', en: 'The product and the offer' } satisfies Localized,
      lead: {
        ar: 'قبل ما أزوّد الطلب، بشوف المنتج نفسه عنده مساحة يكبر ولا لأ.',
        en: 'Before I push for more demand, I look at whether the product has room to grow.',
      } satisfies Localized,
      points: [
        { ar: 'في طلب حقيقي على المنتج؟', en: 'Is there real demand for it?' },
        { ar: 'السعر والـoffer مظبوطين؟', en: 'Are the price and the offer right?' },
        { ar: 'في variations أو features تزوّد قيمته؟', en: 'Are there variations or features that add value?' },
        { ar: 'نقدر نرفع الـAOV؟', en: 'Can we raise the average order value?' },
        {
          ar: 'ولا نوسّع من المنتج الناجح بدل ما ندوّر على منتج جديد؟',
          en: 'Or extend the product that already works, instead of hunting for a new one?',
        },
      ] as Localized[],
    },
    {
      id: 'marketing',
      n: '03',
      name: { ar: 'الـMarketing', en: 'Marketing' } satisfies Localized,
      lead: {
        ar: 'هنا الإعلان بيدخل الصورة — كجزء من السيستم، مش كالسيستم كله.',
        en: 'This is where advertising comes in — as part of the system, not as the system.',
      } satisfies Localized,
      points: [
        { ar: 'الكرياتيف والزوايا والرسالة', en: 'Creative, angles and the message' },
        { ar: 'شرايح وجمهور مكناش بنكلمه', en: "Segments and audiences we weren't reaching" },
        /* Google Ads is EXPANDING INTO, never expertise. docs/CLAUDE.md. */
        {
          ar: 'Meta وTikTok وقنوات تانية لما تستاهل — وبوسّع خبرتي في Google Ads',
          en: "Meta, TikTok and other channels when they earn it — and I'm expanding into Google Ads",
        },
        { ar: 'الستور نفسه: الـCRO وتجربة الشرا', en: 'The store itself: CRO and the buying experience' },
        {
          ar: 'اقتصاديات الأوردر: MAR والـROAS، والـROI لما بيانات البيزنس تسمح',
          en: 'Unit economics: MAR and ROAS — and ROI when the business data allows it',
        },
      ] as Localized[],
    },
    {
      id: 'scaling',
      n: '04',
      name: { ar: 'الـScaling', en: 'Scaling' } satisfies Localized,
      lead: {
        ar: 'Scaling مش معناه إننا نزوّد الـBudget وخلاص.',
        en: "Scaling doesn't just mean raising the budget.",
      } satisfies Localized,
      points: [
        { ar: 'الـBudget — نزوّد الصرف لما الأرقام والتشغيل يستحملوا', en: 'Budget — spend more when the economics and the operation can carry it' },
        { ar: 'شرايح جديدة — نوصل لعميل مكناش بنكلمه', en: "Segments — reach a customer we weren't talking to" },
        { ar: 'أسواق جديدة — محافظة أو بلد فيها فرصة حقيقية', en: 'Markets — a governorate or a country where the opportunity is real' },
        { ar: 'الجملة — نفتح قناة بيع تانية', en: 'Wholesale — open a second sales channel' },
        { ar: 'توسيع المنتج — مقاسات، variations، bundles، استخدامات جديدة', en: 'Product — sizes, variations, bundles, new use cases around what works' },
        { ar: 'الـAOV — نرفع قيمة الأوردر بدل ما نجري ورا أوردرات أكتر', en: 'AOV — raise the value of the order instead of always chasing more orders' },
      ] as Localized[],
      close: {
        ar: 'زيادة الـbudget والكرياتيف أدوات كويسة — بس دول بعض الطرق، مش كل الطرق.',
        en: "More budget and more creatives are useful levers — they're just some of them, not all of them.",
      } satisfies Localized,
    },
    {
      id: 'operations',
      n: '05',
      name: { ar: 'الـOperations', en: 'Operations' } satisfies Localized,
      lead: {
        ar: 'ممكن الإعلانات تكون شغالة كويس جدًا، والبيزنس نفسه مش جاهز يستوعب نمو أكبر.',
        en: "The ads can be working very well while the business isn't ready to absorb more.",
      } satisfies Localized,
      points: [
        { ar: 'المصنع متأخر أو الستوك بيخلص', en: 'The factory is behind, or stock is running out' },
        { ar: 'المخزن مش لاحق على الكمية', en: "The warehouse can't keep up with the volume" },
        { ar: 'فريق الموديريشن مضغوط', en: 'The moderation team is overloaded' },
        { ar: 'الشحن والتسليم فيهم مشاكل', en: 'Shipping and delivery are breaking' },
        { ar: 'المرتجعات بتكبر', en: 'Returns are climbing' },
      ] as Localized[],
      close: {
        ar: 'لو الـOperations مش قادرة تستوعب الطلب، ممكن القرار الصح يكون إننا نهدّي النمو، نصلّح الـbottleneck، وبعدين نرجع نسكيل.',
        en: "If the operation can't handle more demand, the right move may be to slow down, fix the bottleneck, and then scale again.",
      } satisfies Localized,
    },
    {
      id: 'numbers',
      n: '06',
      name: { ar: 'الأرقام مش كل الحكاية', en: "The numbers aren't the whole story" } satisfies Localized,
      lead: {
        ar: 'رقم مبيعات كبير ممكن يبان مبهر والبيزنس لسه عنده مشاكل.',
        en: 'A big sales number can look impressive while the business still has problems.',
      } satisfies Localized,
      points: [
        { ar: 'المبيعات مش أرباح', en: 'Sales are not profit' },
        { ar: 'الأوردر اللي اتعمل مش الأوردر اللي وصل', en: 'An order taken is not an order delivered' },
        { ar: 'الـROAS مش الـROI', en: 'ROAS is not ROI' },
        { ar: 'صرف أكتر مش بالضرورة قيمة أكتر للبيزنس', en: 'More spend is not automatically more value' },
      ] as Localized[],
      /*
        THE HONESTY CLAUSE. Every figure on this site is real and sourced, and
        this is the sentence that stops the set of them reading as a promise.
        It is business context, not a legal disclaimer — keep it in that voice,
        and do not cut it for length.
      */
      close: {
        ar: 'والأرقام اللي في البورتفوليو ده نتايج حقيقية لبيزنسات ومنتجات وأسواق وتشغيل وميزانيات وظروف معيّنة. دي دليل على شغل حصل — مش وعد إن أي بيزنس هيطلّع نفس الأرقام.',
        en: "And the figures in this portfolio are real results from specific businesses, products, markets, operations, budgets and circumstances. They're evidence of work that happened — not a promise that every business will produce the same numbers.",
      } satisfies Localized,
    },
  ],

  /**
   * THE DECISION, DRAWN DOWNWARDS. A vertical arrow needs no direction flip —
   * it means the same thing in Arabic and in English, which a horizontal one
   * does not.
   */
  decision: {
    title: { ar: 'قبل ما أقول «Scale»، بسأل:', en: 'Before I say "scale", I ask:' } satisfies Localized,
    steps: [
      { ar: 'هل المنتج جاهز؟', en: 'Is the product ready?' },
      { ar: 'هل السوق لسه فيه مساحة؟', en: 'Is there still room in the market?' },
      { ar: 'هل الـeconomics صح؟', en: 'Do the economics make sense?' },
      { ar: 'هل الـOperations تستوعب؟', en: 'Can the operation handle more demand?' },
      { ar: 'فين فرصة النمو الجاية؟', en: 'Where is the next growth opportunity?' },
      { ar: 'وبعدين نقرر نسكيل إيه وإزاي.', en: 'Then we decide what to scale and how.' },
    ] as Localized[],
  },

  statement: {
    ar: 'أنا مش بدوّر على طريقة نخلي الإعلانات تصرف أكتر. بدوّر على المكان اللي البيزنس يقدر ينمو منه فعلًا.',
    en: "I'm not looking for a way to make the ads spend more. I'm looking for where the business can actually grow.",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- sites */

/**
 * LIVE STORE DEMOS, not flat screenshots. Each one is a real capture of the
 * running storefront — desktop and phone — inside a browser frame carrying
 * the store's own address, and the whole frame links to it.
 *
 * WHY YOURS SHOES IS NOT HERE. It was, as a screenshot. A browser frame with
 * a domain in the address bar is a claim that the store is running, and that
 * storefront answers 402: the Shopify plan is frozen. Presenting it as a live
 * demo would say something untrue, and linking to it would send a visitor to
 * a dead page. Four working stores make the point better than five where one
 * is broken. The main portfolio still carries the work.
 *
 * The captures come from the main portfolio's capture script, so a change on
 * a client's store does not appear here by itself.
 */
export const sites = {
  label: { ar: 'مواقع بنيتها', en: 'Websites I have built' } satisfies Localized,
  title: {
    ar: 'ستورات شغّالة، مش تصميمات.',
    en: 'Working stores, not mockups.',
  } satisfies Localized,
  intro: {
    ar: 'دي ستورات بنيتها على Shopify — اضغط أي واحد فيهم يفتحلك الستور نفسه.', // REVIEW
    en: 'Shopify stores I built — tap any one of them to open the store itself.',
  } satisfies Localized,

  demos: [
    {
      id: 'cove',
      name: 'Cove',
      href: 'https://covestore.co',
      domain: 'covestore.co',
      detail: {
        /* Was "بنيت الستور وشغّلت العمليات والمبيعات". Scoped back on
           2026-09-17: a caption here must not tie a named brand to ad work or
           to sales. This section is the stores he built; who spent what, and
           what it returned, is the Results section's job and it carries the
           evidence for it. */
        ar: 'بنيت الستور',
        en: 'Built the store',
      } satisfies Localized,
      desktop: { src: '/img/site-cove.webp', width: 2880, height: 1360 },
      phone: { src: '/img/phone-cove.webp', width: 1170, height: 2280 },
    },
    {
      id: 'veloura',
      name: 'Veloura',
      href: 'https://veloura5.com',
      domain: 'veloura5.com',
      detail: {
        /* Same rule as Cove above: the platforms come out of this caption. */
        ar: 'بنيت الستور',
        en: 'Built the store',
      } satisfies Localized,
      desktop: { src: '/img/site-veloura.webp', width: 2880, height: 1360 },
      phone: { src: '/img/phone-veloura.webp', width: 1170, height: 2280 },
    },
    {
      id: 'kayan',
      name: 'KAYAN',
      href: 'https://kayaan.com.co',
      domain: 'kayaan.com.co',
      detail: {
        ar: 'بنيت ستور Shopify لبراند ستريت وير أطفال',
        en: 'Built the Shopify store for a kids streetwear brand',
      } satisfies Localized,
      desktop: { src: '/img/site-kayan.webp', width: 2880, height: 1360 },
      phone: { src: '/img/phone-kayan.webp', width: 1170, height: 2280 },
    },
    {
      id: 'asloaraby',
      name: 'أصله عربي',
      href: 'https://asloaraby.myshopify.com',
      domain: 'asloaraby.myshopify.com',
      detail: {
        ar: 'بنيت ستور Shopify لبراند مستوحى من الإرث العربي',
        en: 'Built the Shopify store for a heritage-led clothing brand',
      } satisfies Localized,
      desktop: { src: '/img/site-asloaraby.webp', width: 2880, height: 1360 },
      phone: { src: '/img/phone-asloaraby.webp', width: 1170, height: 2280 },
    },
    {
      /*
        ADDED 2026-09-17 ON MAHMOUD'S EXPLICIT INSTRUCTION, after he was told
        what it means.

        The url is real and it is the one the main portfolio carries, but the
        storefront answers HTTP 402 — the Shopify plan is frozen — and it was
        still answering 402 when this card was added. So the demo frame around
        it is making a claim the store does not currently meet, which is why
        the section's intro no longer says these are all running.

        The moment the plan is reactivated this comment can go. Until then,
        do not "fix" the 402 by pointing this anywhere else: a substitute url
        would be a fake demo, which is worse than a frozen one.
      */
      id: 'yours-shoes',
      name: 'Yours Shoes',
      href: 'https://yoursshoes-eg.myshopify.com',
      domain: 'yoursshoes-eg.myshopify.com',
      detail: {
        ar: 'بنيت ستور Shopify لبراند أحذية حريمي', // REVIEW
        en: 'Built the Shopify store for a women’s footwear brand',
      } satisfies Localized,
      desktop: { src: '/img/site-yours-shoes.webp', width: 2880, height: 1360 },
      phone: { src: '/img/phone-yours-shoes.webp', width: 1170, height: 2280 },
    },
  ],

  /**
   * WHY THIS PARAGRAPH EXISTS.
   *
   * Five storefronts in a row read as a web developer's portfolio, and that is
   * the one thing Mahmoud must not be taken for (docs/CLAUDE.md). It also
   * invites the wrong question in an interview — "who did your design?" — when
   * the work he wants judged is the commerce underneath.
   *
   * So the paragraph says three things and no more: he is not a developer, he
   * learned the platform because that is where the customer buys, and where a
   * store's interface could have gone further it was the client's timeline or
   * budget that decided it, not the standard he holds. CRO is what he holds to.
   *
   * It does not name which client, and it does not blame one.
   */
  positioning: {
    ar: 'موضوع المواقع واسع، وأنا مش web developer. اتعلّمت Shopify — كورس E-Cart — عشان لازم أفهم المنصة اللي العميل بيشتري من عليها. في ستورات منهم الـ UI/UX كان ممكن يطلع أحسن، وده بيرجع لوقت العميل وباجِته مش لمستوى الشغل، بس اللي بمسك فيه دايمًا هو الـ CRO: إن الستور يبيع. تركيزي الأساسي في الـ e-commerce نفسه.', // REVIEW
    en: 'Website work is a wide field, and I am not a web developer. I learned Shopify — the E-Cart course — because I have to understand the platform the customer actually buys on. On some of these the UI and UX could have gone further; that came down to the client\u2019s timeline and budget rather than the standard. What I hold to every time is CRO: that the store sells. My focus is the e-commerce itself.',
  } satisfies Localized,

  visit: { ar: 'افتح الستور', en: 'Open the store' } satisfies Localized,
  note: {
    ar: 'اللقطات دي حقيقية من الستورات نفسها، مش إطارات مركّبة — بس هي لقطات، فأي تغيير على ستور عند العميل مش هيظهر هنا لوحده.',
    en: 'These are real captures of the stores themselves, not mocked-up frames — but they are captures, so a change on a client’s store does not appear here by itself.',
  } satisfies Localized,
};

/* ----------------------------------------------------------- full story */

/**
 * The way into the story — a SECOND PAGE OF THIS SITE, not an exit from it.
 *
 * The body has to describe what `/story` actually contains, which is the
 * background in the order it happened. It must not go back to promising a page
 * per project: that is the main portfolio's content and it is not here.
 */
export const fullStory = {
  label: { ar: 'الحكاية', en: 'The background' } satisfies Localized, // REVIEW
  title: {
    ar: 'في حاجات كتير مش هتوصل في صفحة واحدة.',
    en: 'A single page cannot carry all of it.',
  } satisfies Localized,
  body: {
    ar: 'الحكاية بالترتيب اللي حصلت بيه: من المخزن وتحضير الأوردرات، لإدارة التشغيل، لـ Bloomy والـ Shopify والإعلانات — وكل رقم جنبه مصدره وفترته.', // REVIEW
    en: 'The story in the order it happened: from the warehouse and preparing orders, to running the operation, to Bloomy, Shopify and the ads — with every figure carrying its source and its period.',
  } satisfies Localized,
  cta: { ar: 'القصة كاملة', en: 'Read the full story' } satisfies Localized,
};

/* -------------------------------------------------------------- closing */

export const closing = {
  lead: { ar: 'مبدأتش بالإعلانات.', en: 'I didn’t start with ads.' } satisfies Localized,
  body: {
    ar: 'بدأت إني أفهم البيزنس — من المنتج لحد التسليم.',
    en: 'I started by understanding the business — from product to delivery.',
  } satisfies Localized,
};

/* -------------------------------------------------------------- contact */

export const cta = {
  label: { ar: 'يلا نتكلم', en: 'Let’s talk' } satisfies Localized,
  title: {
    ar: 'يلا نبني حاجة تكبر بجد.',
    en: 'Let’s build something that actually grows.',
  } satisfies Localized,
  body: {
    ar: 'لو عندك براند e-commerce ومحتاج حد يشوف الصورة كاملة — الستور والإعلانات والتشغيل — ابعتلي وقولي انت فين دلوقتي.',
    en: 'If you have an e-commerce brand and want someone who sees the whole picture — the store, the ads and the operation — message me and tell me where you are right now.',
  } satisfies Localized,
};

/* ------------------------------------------------------------------- ui */

export const ui = {
  toggleLang: { ar: 'EN', en: 'عربي' } satisfies Localized,
  /* The visible label is the other language's own name, which a screen
     reader announces on its own once the anchor carries lang="…". This
     says what pressing it does. */
  toggleLangLabel: { ar: 'Read this page in English', en: 'اقرأ الصفحة بالعربية' } satisfies Localized,
  toggleTheme: { ar: 'غيّر الوضع', en: 'Switch theme' } satisfies Localized,
  skip: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' } satisfies Localized,
};

export const seo = {
  title: {
    ar: 'محمود عاطف — E-commerce Growth Specialist',
    en: 'Mahmoud Atef — E-commerce Growth Specialist',
  } satisfies Localized,
  description: {
    ar: 'ببني ستورات Shopify، وبشغّل إعلانات Meta وTikTok، وبشوف المنتج والسوق والعميل والتشغيل والأرقام — وبعدها بشوف الإعلان.',
    en: 'I build Shopify stores, run Meta and TikTok ads, and read the product, the market, the customer, the operation and the numbers before I read the ad.',
  } satisfies Localized,
};
