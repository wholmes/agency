import { PrismaClient } from "@prisma/client";

// Seeds run directly against the database — use the direct URL (not Accelerate)
// so that bulk writes and transactions don't go through the edge proxy.
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL } },
});

async function main() {
  await prisma.$transaction([
    prisma.industriesHub.deleteMany(),
    prisma.industryPage.deleteMany(),
    prisma.siteChrome.deleteMany(),
    prisma.contactFormConfig.deleteMany(),
    prisma.caseStudyUiLabels.deleteMany(),
    prisma.contactPageCopy.deleteMany(),
    prisma.aboutValuesSectionHeader.deleteMany(),
    prisma.aboutStorySection.deleteMany(),
    prisma.scopeEstimatorConfig.deleteMany(),
    prisma.servicesContinuityIntro.deleteMany(),
    prisma.serviceDetailPage.deleteMany(),
    prisma.aboutHomeTeaser.deleteMany(),
    prisma.ctaSectionCopy.deleteMany(),
    prisma.workPreviewSection.deleteMany(),
    prisma.aboutPageHero.deleteMany(),
    prisma.aboutTeaserCard.deleteMany(),
    prisma.aboutTeaserBelief.deleteMany(),
    prisma.aboutStoryParagraph.deleteMany(),
    prisma.aboutValue.deleteMany(),
    prisma.footerCopy.deleteMany(),
    prisma.servicesHomeSection.deleteMany(),
    prisma.servicesPageHero.deleteMany(),
    prisma.workPageHero.deleteMany(),
    prisma.homeHero.deleteMany(),
    prisma.lighthouseGuarantee.deleteMany(),
    prisma.continuityBlock.deleteMany(),
    prisma.serviceOffering.deleteMany(),
    prisma.featuredTestimonial.deleteMany(),
    prisma.socialClient.deleteMany(),
    prisma.socialStat.deleteMany(),
    prisma.seoSettings.deleteMany(),
    prisma.emailSettings.deleteMany(),
    prisma.siteSettings.deleteMany(),
  ]);

  await prisma.seoSettings.create({
    data: {
      id: 1,
      siteTitle: "BrandMeetsCode — Premium Web Development Agency",
      titleTemplate: "%s | BrandMeetsCode",
      metaDescription:
        "Chicago-based web development agency where brand strategy meets technical execution. BrandMeetsCode builds premium websites for B2B companies, SaaS founders, and marketing leaders worldwide.",
      googleAnalyticsId: "",
      googleAnalyticsApiSecret: "",
      googleTagManagerId: "",
      noIndex: false,
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: 1,
      contactEmail: "hello@brandmeetscode.com",
      availabilityAvailable: true,
      availabilityLabel: "1 project slot open for Q3 2026",
      availabilityNextOpen: "September 2026",
    },
  });

  await prisma.emailSettings.create({
    data: {
      id: 1,
      notifyEmail: "hello@brandmeetscode.com",
      fromName: "BrandMeetsCode",
      fromAddress: "onboarding@resend.dev",
      autoReplyEnabled: true,
      autoReplySubject: "Got your message — I'll be in touch shortly",
      autoReplyOpening:
        "Thanks for reaching out — I've received your message and will get back to you within 1–2 business days.",
    },
  });

  // Project: only seed placeholder case studies if no projects exist yet.
  // Real projects entered via the admin panel are never wiped by a reseed.
  const existingProjectCount = await prisma.project.count();
  if (existingProjectCount === 0) await prisma.project.createMany({
    data: [
      {
        id: "meridian",
        title: "Meridian SaaS",
        category: "Web Design & Development",
        proofFit:
          "Enterprise B2B SaaS · VP Marketing buyer · +40% qualified demos in 30 days",
        year: "2025",
        result: "+40% demo requests in 30 days",
        resultDetail: "3.1s avg → 0.8s load time. Lighthouse 96.",
        problem:
          "Meridian's existing site was built during fundraising and optimized for investors, not buyers. Demo conversion rate was 1.2% — well below their market benchmark of 3–4%. The site had seven competing CTAs above the fold, none of which were for demos.",
        approach:
          "Complete information architecture rethink, new messaging hierarchy, and a full rebuild in Next.js with an edge CDN. Added a qualification flow to the demo request form to improve lead quality alongside volume. Removed five of the seven CTAs.",
        outcome:
          "Demo conversion rate moved from 1.2% to 2.8% within 30 days. Load time dropped from 3.1s to 0.8s. The qualification flow reduced unqualified demo requests by 60%, meaning sales was spending time on better-fit leads.",
        color: "#1A2A1A",
        accent: "#4DAF7C",
        services: JSON.stringify(["Web Design", "Web Development", "SEO"]),
        sortOrder: 0,
      },
      {
        id: "arclight",
        title: "Arclight Labs",
        category: "Brand Strategy + Web Design & Development",
        proofFit:
          "Pre-launch enterprise AI · Series A narrative · $8M raised, brand cited in term sheet",
        year: "2025",
        result: "Series A secured 60 days post-launch",
        resultDetail: "Raised $8M. Cited brand clarity as a key differentiator in term sheet.",
        problem:
          "Pre-launch deeptech startup entering a crowded enterprise AI market. Founders were scientists, not marketers — they needed positioning that was honest about the technology without being incomprehensible to non-technical buyers.",
        approach:
          "8-week brand strategy engagement before design began. Developed a 'precision over promise' positioning that acknowledged the technology's current limitations honestly — which became their competitive advantage in a market of overpromising vendors.",
        outcome:
          "Raised an $8M Series A 60 days after launch. The lead investor cited brand clarity specifically in their term sheet. Three enterprise pilots converted to contracts within the first quarter.",
        color: "#1A1A2A",
        accent: "#6B8CE8",
        services: JSON.stringify(["Brand Strategy", "Web Design", "Web Development"]),
        sortOrder: 1,
      },
      {
        id: "sable",
        title: "Sable Studio",
        category: "Analytics Integration",
        proofFit:
          "12-person creative studio · leadership reporting · weekly ops 6hr → 2hr",
        year: "2024",
        result: "3× faster reporting cycle",
        resultDetail: "From 6 hours/week to 2 hours. 100% of KPIs now in one dashboard.",
        problem:
          "Creative studio with 12 team members was spending 6+ hours per week pulling numbers from three different platforms into a spreadsheet. Leadership made pricing decisions based on data that was always 3 weeks old.",
        approach:
          "Consolidated tracking into GA4 + Looker Studio. Built a single dashboard covering project profitability, time tracking efficiency, and client acquisition by channel. Automated a weekly email digest to leadership.",
        outcome:
          "Weekly reporting time dropped from 6 hours to 2 hours. Leadership now reviews a live dashboard instead of a stale spreadsheet. Sable used the profitability data to reprice their retainer packages within 60 days, increasing average retainer value by 22%.",
        color: "#2A1A18",
        accent: "#E88B6B",
        services: JSON.stringify(["Analytics Integration"]),
        sortOrder: 2,
      },
    ],
  });
  // end: existingProjectCount === 0

  const stats = [
    { value: "Senior team only", label: "No juniors on client-facing work. Every project is handled by people who have done this before.", sortOrder: 0 },
    { value: "Performance guaranteed", label: "Lighthouse ≥ 90 on every build, or we fix it at no cost.", sortOrder: 1 },
    { value: "Brand-first approach", label: "Strategy before a single pixel. We understand positioning, not just code.", sortOrder: 2 },
    { value: "Full-stack delivery", label: "Brand strategy, design, engineering, and analytics — one team, one invoice.", sortOrder: 3 },
  ];
  for (const s of stats) {
    await prisma.socialStat.create({ data: s });
  }

  const clients = [
    { name: "Next.js", context: "App Router · React framework", sortOrder: 0 },
    { name: "TypeScript", context: "Type-safe codebase", sortOrder: 1 },
    { name: "Tailwind CSS", context: "Utility-first styling", sortOrder: 2 },
    { name: "Supabase", context: "Postgres · Auth · Storage", sortOrder: 3 },
    { name: "Prisma", context: "Type-safe ORM", sortOrder: 4 },
    { name: "Custom CMS", context: "Bespoke admin — built in-house", sortOrder: 5 },
    { name: "Vercel", context: "Edge deployment · CI/CD", sortOrder: 6 },
    { name: "Google Analytics 4", context: "GMP · event-based measurement", sortOrder: 7 },
    { name: "Google Tag Manager", context: "GMP · tag & trigger management", sortOrder: 8 },
    { name: "Looker Studio", context: "GMP · live reporting dashboards", sortOrder: 9 },
    { name: "Google Ads", context: "GMP · paid search & display", sortOrder: 10 },
    { name: "Figma", context: "Design system · prototyping", sortOrder: 11 },
  ];
  for (const c of clients) {
    await prisma.socialClient.create({ data: c });
  }

  await prisma.featuredTestimonial.create({
    data: {
      id: 1,
      quote:
        "We built BrandMeetsCode because we kept seeing the same problem: beautiful brands shipped on brittle code, and fast code with no soul. The gap between those two things is exactly where we work.",
      authorName: "Whittfield Holmes",
      authorTitle: "Founder, BrandMeetsCode",
      authorInitials: "WH",
      starCount: 5,
    },
  });

  await prisma.serviceOffering.createMany({
    data: [
      {
        slug: "web-design",
        iconKey: "design",
        sortOrder: 0,
        number: "01",
        title: "Web Design",
        subtitle: "Interfaces that convert",
        descriptionHome:
          "Interfaces built with composition principles, not templates. Every decision — spacing, type, color, motion — is intentional.",
        outcomesHome: JSON.stringify([
          "Conversion-optimized layouts",
          "Design system included",
          "Mobile-first approach",
        ]),
        descriptionListing:
          "We design websites with composition first and components second. Every layout, typographic choice, and color decision is deliberate — calibrated to your audience and your objectives.",
        outcomesListing: JSON.stringify([
          "Conversion-optimized information architecture",
          "Full design system with all states and variants",
          "Mobile-first, responsive across all breakpoints",
          "Accessibility-first (WCAG AA minimum)",
        ]),
        href: "/services/web-design",
        showOnHomepage: true,
      },
      {
        slug: "web-development",
        iconKey: "code",
        sortOrder: 1,
        number: "02",
        title: "Web Development",
        subtitle: "Production-grade code, zero shortcuts",
        descriptionHome:
          "Production-grade code. Next.js, TypeScript, and infrastructure that scales without becoming someone else's problem.",
        outcomesHome: JSON.stringify([
          "Lighthouse ≥ 90 guaranteed",
          "Edge-deployed",
          "Handoff with full docs",
        ]),
        descriptionListing:
          "Next.js, TypeScript, and infrastructure choices that hold up at scale. We write code that your future developer won't hate — or we handoff with documentation thorough enough that they won't need to ask.",
        outcomesListing: JSON.stringify([
          "Lighthouse score ≥ 90 across all categories",
          "Edge-deployed for global performance",
          "Full codebase documentation on handoff",
          "Three months of post-launch support included",
        ]),
        href: "/services/web-design",
        showOnHomepage: true,
      },
      {
        slug: "brand-strategy",
        iconKey: "brand",
        sortOrder: 2,
        number: "03",
        title: "Brand Strategy",
        subtitle: "Clarity before aesthetics",
        descriptionHome:
          "Positioning work that clarifies who you are and who you're for. Strategy first — then the visuals make sense.",
        outcomesHome: JSON.stringify([
          "Market positioning audit",
          "Messaging hierarchy",
          "Visual identity direction",
        ]),
        descriptionListing:
          "Positioning work that tells you who you are, who you're for, and how to say it. We do this before we open Figma — because visual decisions made without strategic context are expensive guesses.",
        outcomesListing: JSON.stringify([
          "Competitive landscape and positioning audit",
          "Messaging hierarchy and tone of voice",
          "Visual identity direction (not just a logo)",
          "Brand guidelines document",
        ]),
        href: "/services/brand-strategy",
        showOnHomepage: true,
      },
      {
        slug: "analytics-integration",
        iconKey: "analytics",
        sortOrder: 3,
        number: "04",
        title: "Analytics & Growth",
        subtitle: "Data you'll actually use",
        descriptionHome:
          "Instrumentation that actually answers business questions. No vanity dashboards — just the data that drives decisions.",
        outcomesHome: JSON.stringify([
          "GA4 + Segment setup",
          "Custom event tracking",
          "Monthly reporting included",
        ]),
        descriptionListing:
          "We set up tracking that answers business questions, not just fills dashboards. GA4, Segment, Mixpanel, Looker — configured around what you actually need to know.",
        outcomesListing: JSON.stringify([
          "GA4 and tag manager full setup",
          "Custom event tracking mapped to your funnel",
          "Dashboard built around your KPIs",
          "Monthly analytics review for 90 days",
        ]),
        href: "/services/analytics-integration",
        showOnHomepage: true,
      },
    ],
  });

  await prisma.continuityBlock.createMany({
    data: [
      {
        sortOrder: 0,
        title: "After launch",
        body:
          "A project has a defined end; the product doesn't. We include structured post-launch support on builds (see development scope). When you need ongoing help — CRO experiments, new sections, roadmap work — we set that up as a retainer or phased sprints so you're not left guessing how to stay partnered.",
      },
      {
        sortOrder: 1,
        title: "Content & CMS",
        body:
          "Copy, migration from legacy sites, and editor training are scoped per project — either bundled into the build or called out when you're bringing your own writers. You always know what's in the box before kickoff, so there's no silent gap between \"design\" and \"what the site actually says.\"",
      },
      {
        sortOrder: 2,
        title: "SEO & discoverability",
        body:
          "Technical SEO, semantic structure, and performance foundations are part of how we ship — aligned with the Lighthouse bar we publish. Ongoing content SEO, link building, or paid search are separate engagements; we'll tell you clearly when something is in the build versus a longer marketing program.",
      },
    ],
  });

  await prisma.lighthouseGuarantee.create({
    data: {
      id: 1,
      title: "The Lighthouse Guarantee",
      body:
        "Every website we build ships with a Lighthouse score of 90+ across Performance, Accessibility, Best Practices, and SEO. If it doesn't, we fix it before final delivery — no scope negotiations.",
    },
  });

  await prisma.homeHero.create({
    data: {
      id: 1,
      overline: "Premium Web Development Agency",
      headlineLine1: "Brand",
      headlineLine2Italic: "meets",
      headlineLine3: "Code.",
      body:
        "We build premium websites for B2B companies and SaaS founders who need both design precision and engineering depth. Every pixel earns its place.",
      primaryCtaLabel: "Start a Project",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "See the Work",
      secondaryCtaHref: "/work",
    },
  });

  await prisma.workPageHero.create({
    data: {
      id: 1,
      overline: "Selected Work",
      headlineLine1: "Results, not just",
      headlineLine2Italic: "renderings",
      body:
        "Every case study follows the same format: the problem as the client described it, what we actually did, and what happened as a result.",
    },
  });

  await prisma.servicesPageHero.create({
    data: {
      id: 1,
      overline: "Services",
      title: "Everything a premium website requires",
      body:
        "We offer four integrated services. Most clients engage us for two or three — because the results compound when strategy, design, and code are all speaking the same language.",
    },
  });

  await prisma.servicesHomeSection.create({
    data: {
      id: 1,
      overline: "What We Do",
      headingLine1: "Built for brands that",
      headingEmphasis: "mean business",
      footerBeforeHighlight: "Strategy through launch is the core offer — with clear scope for ",
      footerHighlight: "content, SEO foundations, and post-launch partnership",
      footerAfterHighlightBeforeLink: " spelled out per project. ",
      footerLinkLabel: "See how we frame it on the services page",
      footerLinkHref: "/services",
      footerAfterLink: ".",
    },
  });

  await prisma.footerCopy.create({
    data: {
      id: 1,
      tagline: "Premium web development where brand strategy meets technical execution.",
      remoteBlurb:
        "Remote-first studio. We partner with B2B teams and SaaS founders in the US and Europe — engagements by project, with a small number of active builds at a time.",
    },
  });

  const aboutValues = [
    {
      sortOrder: 0,
      title: "Design is a business discipline",
      body:
        "Good design isn't decoration — it's how your business communicates without you in the room. We treat every visual decision as a business decision.",
    },
    {
      sortOrder: 1,
      title: "Code quality is not optional",
      body:
        "Slow sites, inaccessible interfaces, and unmaintainable code are liabilities. We write code that holds up — for your users, your team, and your future developers.",
    },
    {
      sortOrder: 2,
      title: "Clarity over cleverness",
      body:
        "The best work is often the work that looks obvious in retrospect. We resist novelty for its own sake and design toward understanding.",
    },
    {
      sortOrder: 3,
      title: "The brief is a starting point",
      body:
        "We will ask questions your previous agency didn't. Not to be difficult — but because the best projects start with a clear understanding of the real problem, not just the stated one.",
    },
  ];
  for (const v of aboutValues) {
    await prisma.aboutValue.create({ data: v });
  }

  const story = [
    {
      sortOrder: 0,
      body:
        "We've sat on both sides of the table — as brand strategists who got frustrated with developers who didn't understand why positioning mattered, and as engineers who watched beautiful Figma files turn into sluggish, inaccessible code.",
    },
    {
      sortOrder: 1,
      body:
        "BrandMeetsCode was built to close that gap. Not by being mediocre at both disciplines — but by being genuinely excellent at both, and by understanding how each one makes the other better.",
    },
    {
      sortOrder: 2,
      body:
        "When brand strategy informs design, the visual decisions have reasons behind them. When design informs engineering, the technical choices support — rather than undermine — the user experience. When all three work together, you get something that most clients have never seen before: a website that works as hard as your best salesperson.",
    },
    { sortOrder: 3, body: "That's what we build." },
  ];
  for (const p of story) {
    await prisma.aboutStoryParagraph.create({ data: p });
  }

  const beliefs = [
    { sortOrder: 0, text: "Design that doesn't convert is decoration" },
    { sortOrder: 1, text: "Code quality is a business decision" },
    { sortOrder: 2, text: "The brief is a starting point, not a ceiling" },
    { sortOrder: 3, text: "Every pixel should earn its place" },
  ];
  for (const b of beliefs) {
    await prisma.aboutTeaserBelief.create({ data: b });
  }

  await prisma.aboutTeaserCard.create({
    data: {
      id: 1,
      body:
        "We're a small, senior team. No juniors in client-facing work. Every project is handled by people who have done this many times before.",
      ctaLabel: "Work with us",
      ctaHref: "/contact",
    },
  });

  await prisma.aboutPageHero.create({
    data: {
      id: 1,
      overline: "About",
      line1: "Built at the",
      line2: "intersection of two",
      line3BeforeEm: "disciplines that rarely ",
      line3Em: "meet",
      body:
        "BrandMeetsCode exists because the best websites require both brand clarity and technical precision — and most agencies only do one of those well.",
    },
  });

  await prisma.workPreviewSection.create({
    data: {
      id: 1,
      overline: "Selected Work",
      headingLine1: "Results, not just",
      headingEmphasis: "renderings",
    },
  });

  await prisma.aboutHomeTeaser.create({
    data: {
      id: 1,
      overline: "The Difference",
      headingBeforeEm: "Where brand ",
      headingEmphasis: "strategy",
      headingMid: " meets",
      headingLastLine: "technical execution",
      paragraph1:
        "Most agencies are either great at design or great at code. We built BrandMeetsCode because the best projects need both — and they need them to work together from day one, not be stitched together at the end.",
      paragraph2:
        "We work with companies who have tried generic dev shops and ended up with something technically functional but strategically inert. We fix that — not by redesigning every six months, but by making the right decisions the first time.",
    },
  });

  await prisma.ctaSectionCopy.create({
    data: {
      id: 1,
      overline: "Ready to Start?",
      headingBeforeEm: "Your site should be your ",
      headingEmphasis: "best salesperson",
      body:
        "Tell us about your project. We respond within one business day with a clear sense of fit, timeline, and what working together would look like.",
      primaryCtaLabel: "Start a Project",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "hello@brandmeetscode.com",
      secondaryCtaHref: "mailto:hello@brandmeetscode.com",
      footnote: "No commitment. No sales call unless you want one.",
    },
  });

  await prisma.servicesContinuityIntro.create({
    data: {
      id: 1,
      overline: "Scope & continuity",
      heading: "What engagements include — and how we work after go-live",
      body:
        'The four services above are the core. Here is what buyers often still need spelled out — without turning every line item into a separate "practice area."',
    },
  });

  await prisma.serviceDetailPage.createMany({
    data: [
      {
        slug: "web-design",
        metaTitle: "Web Design & Development Services",
        metaDescription:
          "Premium web design and development for B2B companies and SaaS founders. Conversion-optimized, Lighthouse ≥ 90 guaranteed, mobile-first. Learn what's included.",
        heroHasGradient: true,
        heroOverline: "Service",
        heroTitle: "Web Design & Development",
        heroBody:
          "Interfaces built with composition principles, not templates. We design and build your site as a single, coherent project — no hand-off between design and dev teams.",
        primaryCtaLabel: "Start a Project",
        primaryCtaHref: "/contact",
        backLinkLabel: "← All Services",
        backLinkHref: "/services",
        whoForOverline: "Who It's For",
        whoForHeading: "Right for you if:",
        whoForBullets: JSON.stringify([
          "You've outgrown your current site and it no longer represents where the business is",
          "You're launching something new and want to do it right the first time",
          "You've had a site built before and it looked good in Figma but fell apart in code",
          "You need the site to do real work — not just look good in a portfolio screenshot",
        ]),
        includedOverline: "What's Included",
        includedHeading: "No hidden scope",
        includedSectionBgSurface: true,
        includedItemsUseSurfaceBg: false,
        inclusions: JSON.stringify([
          "Discovery and strategy session",
          "Full mobile-first design system",
          "All major breakpoints designed and built",
          "Motion and microinteraction design",
          "Next.js + TypeScript development",
          "Lighthouse ≥ 90 guaranteed",
          "SEO foundation built in",
          "Accessibility audit and remediation",
          "Staging environment + QA period",
          "90 days post-launch support",
          "Full codebase handoff with documentation",
          "Training session for your team",
        ]),
        faqOverline: "FAQ",
        faqHeading: "Common questions",
        faqs: JSON.stringify([
          {
            question: "How long does a typical web design project take?",
            answer:
              "Most projects run 6–10 weeks from strategy kick-off to launch. Complex sites with custom CMS integrations or multi-page architectures may take 12–16 weeks. We'll give you a precise timeline after our discovery session.",
          },
          {
            question: "Do you work with our existing brand guidelines?",
            answer:
              "Absolutely. If you have an existing brand system, we design within it — or we'll note where it needs extending to work on the web. If you don't have guidelines yet, we can run a brand strategy engagement first.",
          },
          {
            question: "What CMS do you use?",
            answer:
              "We primarily use Contentful, Sanity, and Notion as content backends — all with Next.js frontends. We choose based on your team's technical comfort level and content editing needs. Simpler sites may not need a CMS at all.",
          },
          {
            question: "Will I be able to update the site myself after launch?",
            answer:
              "Yes — that's a requirement for us, not an add-on. Every project includes a training session and documentation. If you want a full CMS where non-technical team members can make updates without touching code, we scope that in from the start.",
          },
          {
            question: "What makes you different from a typical web agency?",
            answer:
              "Most agencies separate design and development into two different teams or phases. We integrate them from day one. The designer understands what's buildable; the developer understands why design decisions were made. The result is faster, cleaner, and more coherent.",
          },
        ]),
      },
      {
        slug: "brand-strategy",
        metaTitle: "Brand Strategy Services — Positioning & Messaging",
        metaDescription:
          "Brand strategy, positioning, and messaging for B2B companies and SaaS founders. Clarity before aesthetics — strategy that makes every visual decision make sense.",
        heroHasGradient: false,
        heroOverline: "Service",
        heroTitle: "Brand Strategy",
        heroBody:
          "Positioning work that clarifies who you are and who you're for. Strategy first — then the visuals make sense.",
        primaryCtaLabel: "Start a Project",
        primaryCtaHref: "/contact",
        backLinkLabel: "← All Services",
        backLinkHref: "/services",
        whoForOverline: "",
        whoForHeading: "",
        whoForBullets: "[]",
        includedOverline: "",
        includedHeading: "What's included",
        includedSectionBgSurface: false,
        includedItemsUseSurfaceBg: true,
        inclusions: JSON.stringify([
          "Market positioning audit",
          "Competitive landscape review",
          "Audience persona definitions",
          "Messaging hierarchy",
          "Tone of voice guidelines",
          "Visual identity direction",
          "Brand guidelines document",
          "Go-to-market messaging map",
        ]),
        faqOverline: "",
        faqHeading: "Common questions",
        faqs: JSON.stringify([
          {
            question: "Do we need brand strategy before a website project?",
            answer:
              "Often, yes — but not always. If you have a strong brand position that your team can articulate clearly and consistently, we can work within it. If there's disagreement internally about who you are and who you're for, strategy first will save you significant rework later.",
          },
          {
            question: "What does a brand strategy engagement produce?",
            answer:
              "A positioning document, messaging hierarchy, tone of voice guidelines, and visual identity direction. Some engagements also include competitive analysis, audience persona definitions, and a go-to-market messaging map.",
          },
          {
            question: "Can you do strategy without building the website?",
            answer:
              "Yes. The strategy deliverable is standalone and portable. Some clients bring it to other agencies or their internal team. Most choose to continue with us for the website — but there's no obligation.",
          },
        ]),
      },
      {
        slug: "analytics-integration",
        metaTitle: "Analytics Integration Services — GA4, Segment, Looker",
        metaDescription:
          "Analytics setup that answers real business questions. GA4, Segment, Mixpanel, custom dashboards — data you'll actually use. No vanity metrics.",
        heroHasGradient: false,
        heroOverline: "Service",
        heroTitle: "Analytics & Growth Integration",
        heroBody:
          "Data you'll actually use. We configure tracking that answers business questions — not just fills dashboards.",
        primaryCtaLabel: "Start a Project",
        primaryCtaHref: "/contact",
        backLinkLabel: "← All Services",
        backLinkHref: "/services",
        whoForOverline: "",
        whoForHeading: "",
        whoForBullets: "[]",
        includedOverline: "",
        includedHeading: "What's included",
        includedSectionBgSurface: false,
        includedItemsUseSurfaceBg: true,
        inclusions: JSON.stringify([
          "GA4 full configuration",
          "Google Tag Manager setup",
          "Custom event taxonomy",
          "Funnel tracking implementation",
          "Custom KPI dashboard",
          "Conversion goal configuration",
          "90-day monthly review",
          "Team training session",
        ]),
        faqOverline: "",
        faqHeading: "Common questions",
        faqs: JSON.stringify([
          {
            question: "What platforms do you work with?",
            answer:
              "GA4, Google Tag Manager, Segment, Mixpanel, Amplitude, Looker, and Looker Studio are our primary tools. We choose the stack based on your team's existing tooling and budget.",
          },
          {
            question: "We already have Google Analytics — why do we need this?",
            answer:
              "Most Google Analytics setups track pageviews and not much else. We build tracking that maps to your actual funnel — so you can answer questions like 'which traffic source generates our best leads?' and 'where are people dropping off in the sign-up flow?'",
          },
          {
            question: "What do we get at the end?",
            answer:
              "A fully configured tracking setup, a custom dashboard built around your KPIs, and 90 days of monthly analytics reviews where we walk you through what the data is saying and what to do about it.",
          },
        ]),
      },
    ],
  });

  await prisma.scopeEstimatorConfig.create({
    data: {
      id: 1,
      sectionOverline: "Ballpark Estimator",
      headingLine1: "Get a rough number",
      headingLine2Italic: "before the call",
      body:
        "No forms, no follow-up emails, no sales call required. Answer four questions and get a realistic ballpark range for your project.",
      projectTypes: JSON.stringify([
        { id: "new-site", label: "New website", base: 12000 },
        { id: "redesign", label: "Site redesign", base: 10000 },
        { id: "brand-web", label: "Brand strategy + web", base: 20000 },
        { id: "analytics", label: "Analytics integration", base: 5000 },
      ]),
      pageCounts: JSON.stringify([
        { id: "1-5", label: "1–5 pages", multiplier: 1.0 },
        { id: "6-15", label: "6–15 pages", multiplier: 1.5 },
        { id: "16+", label: "16+ pages", multiplier: 2.2 },
      ]),
      integrations: JSON.stringify([
        { id: "cms", label: "CMS (Contentful, Sanity)", cost: 2000 },
        { id: "analytics", label: "Analytics setup", cost: 1500 },
        { id: "forms", label: "Lead capture / CRM", cost: 1000 },
        { id: "auth", label: "User auth / dashboard", cost: 3500 },
        { id: "ecomm", label: "E-commerce", cost: 4000 },
        { id: "none", label: "None", cost: 0 },
      ]),
      timelines: JSON.stringify([
        { id: "relaxed", label: "No rush (12+ weeks)", rush: 1.0 },
        { id: "standard", label: "Standard (8–12 weeks)", rush: 1.0 },
        { id: "fast", label: "Fast (4–8 weeks)", rush: 1.25 },
        { id: "urgent", label: "ASAP (<4 weeks)", rush: 1.5 },
      ]),
      weeksByTimelineId: JSON.stringify({
        relaxed: "12–16 weeks",
        standard: "8–12 weeks",
        fast: "5–8 weeks",
        urgent: "3–5 weeks",
      }),
      stepTitles: JSON.stringify({
        type: "What are you building?",
        pages: "How many pages?",
        integrations: "Any integrations needed?",
        integrationsSub: "Select all that apply.",
        timeline: "What's your timeline?",
        continueLabel: "Continue",
        startOver: "Start over",
        ctaStartProject: "Start a Project",
        estimateTagline: "All-in estimate",
      }),
      integrationsHint: "Select all that apply.",
      resultOverline: "Your ballpark estimate",
      resultDisclaimer:
        "This is a rough range based on your inputs — not a quote. Real projects are scoped after a 30-minute discovery call where we can understand your actual goals.",
      stepTemplate: "Step {current} of {total}",
      rangeLowMultiplier: 0.9,
      rangeHighMultiplier: 1.2,
      roundingIncrement: 1000,
    },
  });

  await prisma.aboutStorySection.create({
    data: {
      id: 1,
      headingBeforeEm: "The ",
      headingEm: "real",
      headingAfterEm: " origin story",
      bmcMonogram: "BMC",
      bmcTagline: "Brand Meets Code",
    },
  });

  await prisma.aboutValuesSectionHeader.create({
    data: {
      id: 1,
      overline: "What We Believe",
      heading: "Specific beliefs, not platitudes",
    },
  });

  await prisma.contactPageCopy.create({
    data: {
      id: 1,
      metaTitle: "Contact — Start a Project",
      metaDescription:
        "Tell us about your project. We respond within one business day with a clear sense of fit, timeline, and what working together would look like.",
      overline: "Contact",
      heroLineBeforeEm: "Let's talk about ",
      heroEmphasis: "your project",
      heroLineAfterEm: "",
      introParagraph:
        "Tell us what you're building, what problem you're solving, and what you've tried before. We respond within one business day.",
      whatHappensHeading: "What happens next",
      nextSteps: JSON.stringify([
        { step: "01", text: "We read your message and respond within 1 business day" },
        { step: "02", text: "If it sounds like a good fit, we schedule a 30-min discovery call" },
        { step: "03", text: "We send a clear proposal with scope, timeline, and investment" },
      ]),
      altRoutesHeading: "Prefer a different route?",
      emailCardTitle: "Email directly",
      calendarCardTitle: "Book a call",
      calendarCardSubtitle: "30-minute discovery call, no obligation",
      calendlyUrl: "https://calendly.com/brandmeetscode",
    },
  });

  await prisma.caseStudyUiLabels.create({
    data: {
      id: 1,
      backToWorkLabel: "← All Work",
      backToCaseStudiesLabel: "← All Case Studies",
      problemSectionLabel: "01 — Problem",
      approachSectionLabel: "02 — Approach",
      outcomeSectionLabel: "03 — Result",
      similarProjectCtaLabel: "Start a Similar Project",
    },
  });

  await prisma.industriesHub.create({
    data: {
      id: 1,
      metaTitle: "Industries",
      metaDescription:
        "How BrandMeetsCode partners with teams by vertical — from early-stage startups to regulated industries. Explore focus areas and approach.",
      overline: "Focus areas",
      headline: "Industries we specialize in",
      introBody:
        "Deep pages for how we think about your world — not generic service blurbs. More verticals are added over time.",
      cardCtaLabel: "Read more",
    },
  });

  await prisma.industryPage.create({
    data: {
      slug: "startups",
      sortOrder: 0,
      listTitle: "Startups",
      listBlurb: "Early-stage teams building credibility, narrative, and a site that keeps up with the pitch.",
      metaTitle: "Web Design & Development for Startups — BrandMeetsCode",
      metaDescription:
        "Partner with a studio that understands speed, ambiguity, and zero-to-one launches. Placeholder copy — refine in the CMS.",
      heroOverline: "For founders",
      heroTitle: "A web presence that matches your runway and your ambition",
      heroBody:
        "Replace this with your real positioning: who you serve (e.g. pre-seed B2B SaaS), how you work with small teams, and what outcomes you optimize for. This page is wired to the CMS so you can ship copy on your timeline.",
      introTitle: "Why startups work with us",
      introBody:
        "You’re juggling product, fundraising, and story all at once. We help you clarify the narrative and ship a credible site without the enterprise playbook slowing you down. Edit every field in Admin → Industries.",
      focusTitle: "Where we typically plug in",
      focusBullets: JSON.stringify([
        "Investor- and customer-ready messaging hierarchy",
        "Fast iteration on structure and content before visual polish",
        "Technical foundation you won’t outgrow in six months",
      ]),
      differentiatorTitle: "How we work with lean teams",
      differentiatorBody:
        "Short feedback loops, explicit tradeoffs, and documentation so your next hire or agency can pick up the thread. Swap this section for your real process, timelines, and engagement shape.",
      ctaLabel: "Start a project",
      ctaHref: "/contact",
    },
  });

  await prisma.siteChrome.create({
    data: {
      id: 1,
      configJson: JSON.stringify({
        navLinks: [
          { href: "/services", label: "Services" },
          { href: "/work", label: "Work" },
          { href: "/industries", label: "Industries" },
          { href: "/about", label: "About" },
        ],
        primaryCta: {
          label: "Start a Project",
          href: "/contact",
          utmMedium: "nav",
          utmCampaign: "header_cta",
        },
        footerColumns: [
          {
            title: "Services",
            links: [
              { label: "Web Design", href: "/services/web-design" },
              { label: "Web Development", href: "/services/web-design" },
              { label: "Brand Strategy", href: "/services/brand-strategy" },
              { label: "Analytics Integration", href: "/services/analytics-integration" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "Industries", href: "/industries" },
              { label: "Work", href: "/work" },
              { label: "About", href: "/about" },
              { label: "Journal", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ],
          },
        ],
        footerUtilityLinks: [
          { label: "Contact", href: "/contact" },
          { label: "Work", href: "/work" },
          { label: "Industries", href: "/industries" },
          { label: "About", href: "/about" },
          { label: "Services", href: "/services" },
        ],
        copyrightBrandName: "BrandMeetsCode",
        rightsReservedLine: "All rights reserved.",
      }),
    },
  });

  await prisma.contactFormConfig.create({
    data: {
      id: 1,
      configJson: JSON.stringify({
        heading: "Tell us about your project",
        budgetOptions: [
          "Under $5,000",
          "$5,000 – $15,000",
          "$15,000 – $30,000",
          "$30,000 – $60,000",
          "$60,000+",
          "Not sure yet",
        ],
        projectOptions: [
          "New website",
          "Site redesign",
          "Brand strategy",
          "Analytics setup",
          "Multiple services",
        ],
        labels: {
          name: "Name",
          email: "Email",
          company: "Company",
          projectType: "Project Type",
          budgetRange: "Budget Range",
          message: "Tell us about your project",
        },
        placeholders: {
          name: "Alex Chen",
          email: "alex@company.com",
          company: "Acme Inc.",
          message:
            "What are you building? What problem are you solving? What have you tried before?",
        },
        selectPlaceholder: "Select one",
        validation: {
          nameRequired: "Name is required",
          emailRequired: "Email is required",
          emailInvalid: "Please enter a valid email address",
          messageRequired: "Tell us about your project",
        },
        submit: {
          send: "Send Message",
          sending: "Sending…",
        },
        success: {
          title: "Message sent",
          body:
            "We'll respond within one business day. Check your inbox — we'll reach out from {{email}}.",
        },
        error: {
          generic: "Something went wrong. Please try emailing us directly at {{email}}",
        },
        footerNote: "No commitment. We respond within one business day.",
      }),
    },
  });

  // ── Capabilities ─────────────────────────────────────────────────────────
  await prisma.capability.deleteMany();
  await prisma.capability.createMany({
    data: [
      {
        sortOrder: 1,
        title: "Data & Analytics",
        descriptor: "Pipelines, dashboards, and reporting infrastructure that turn raw events into decisions — not just charts nobody opens.",
        detail: "We instrument product analytics, build ETL pipelines, and design dashboards executives will actually pull up in meetings — every time.",
        tags: "BigQuery, dbt, Looker, PostHog, Segment, Fivetran",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 14v6M10 9v11M14 12v8M18 5v15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 14l4-5 4 3 4-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1.5 2"/></svg>`,
        published: true,
      },
      {
        sortOrder: 2,
        title: "SaaS Applications",
        descriptor: "Full-product SaaS builds — from auth and billing to multi-tenant architecture — designed to scale from launch to Series A and beyond.",
        detail: "We've shipped SaaS products with complex permission models, usage-based billing, real-time features, and white-label delivery.",
        tags: "Next.js, React, Stripe, PostgreSQL, WebSockets, Redis",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 17c0 1.1.9 2 2 2h12a2 2 0 002-2v-1H4v1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 12c0 1.1.9 2 2 2h12a2 2 0 002-2v-1H4v1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 7h12a2 2 0 012 2v1H4V9a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 3v3M10 4l2-2 2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        published: true,
      },
      {
        sortOrder: 3,
        title: "GMP Consulting",
        descriptor: "Strategy, implementation, and governance across the Google Marketing Platform — from tagging architecture to full-funnel attribution.",
        detail: "We configure, audit, and migrate GA4, GTM, DV360, CM360, and SA360 for brands that need measurement they can actually trust.",
        tags: "GA4, GTM, DV360, CM360, SA360, Looker Studio",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3.5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 20.5h6M12 16.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.5 12.5l3-4 3 2.5 3.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
        published: true,
      },
      {
        sortOrder: 4,
        title: "Custom Content Management",
        descriptor: "When off-the-shelf content platforms don't fit the workflow, we design and build tailored editorial systems from scratch.",
        detail: "Admin interfaces your editors will actually enjoy using — clean data models, role-based access, rich text, and media pipelines.",
        tags: "Next.js, Sanity, Strapi, Prisma, PostgreSQL, S3",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="10" width="11" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="10" width="5" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="17" width="7" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="17" width="9" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
        published: true,
      },
      {
        sortOrder: 5,
        title: "WordPress & Drupal",
        descriptor: "Custom themes, bespoke plugins, complex content architectures, and enterprise migrations — on whichever platform your project demands.",
        detail: "Whether that's headless WordPress, WooCommerce, Drupal 10, or a cross-platform migration, plugin and module development is first-class.",
        tags: "PHP, Gutenberg, WooCommerce, Twig, Drush, REST API",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 12l1.5 3.5 2.5-6 2.5 6L12.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4c-1.8 1.8-3 4-3 7a5 5 0 0010 0c0-3-1.2-5.2-3-7 0 0-.5 1-.5 2.5 0 0-1-1.5-1-2.5s-.5 1.5-1 2.5c0 0-1-1.5-1.5-2.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="13" r="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
        published: true,
      },
      {
        sortOrder: 6,
        title: "Ecommerce",
        descriptor: "Custom storefronts, headless commerce builds, and platform migrations that convert — engineered for speed, scale, and checkout.",
        detail: "From Shopify Plus customisation to fully bespoke headless storefronts, we handle the full stack: catalogue, cart, payments, and post-purchase flows.",
        tags: "Shopify, WooCommerce, Next.js, Stripe, Algolia, Headless",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 2l-2 4h16l-2-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6v13a2 2 0 002 2h12a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 11a3 3 0 006 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        published: true,
      },
      {
        sortOrder: 7,
        title: "Gaming & Interactive",
        descriptor: "Web-based games, interactive experiences, and game-adjacent applications where performance is the product — built for real players, not demos.",
        detail: "From WebGL particle systems to physics-driven UI, we bring the same craftsmanship to interactive entertainment as to enterprise software.",
        tags: "WebGL, Three.js, Canvas API, Matter.js, Phaser, GSAP",
        iconSvg: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9c-2.2 0-4 1.6-4 3.8 0 2 1.5 3.6 3.5 3.6L7 15h10l1.5 1.4C20.5 16.4 22 14.8 22 12.8 22 10.6 20.2 9 18 9l-1.5 1.5H7.5L6 9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 12.5h2M9.5 11.5v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="14.5" cy="11.5" r="0.75" fill="currentColor"/><circle cx="16.5" cy="13" r="0.75" fill="currentColor"/></svg>`,
        published: true,
      },
    ],
  });

  // Team Members
  // TeamMember: only seed if the table is completely empty.
  // This preserves any team members added manually via the admin panel.
  const existingTeamCount = await prisma.teamMember.count();
  if (existingTeamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          sortOrder: 1,
          name: "Whittfield Holmes",
          role: "Founder & Creative Director",
          philosophy: "The best digital products don't choose between beautiful and functional — they insist on both.",
          bio: "Whittfield founded BrandMeetsCode at the intersection of brand strategy and technical execution. With a background spanning agency creative direction and full-stack engineering, he leads every engagement from concept through deployment.",
          skills: "Brand Strategy, Next.js, Motion Design, Product Architecture, TypeScript",
          brandCodeBalance: 62,
          featured: true,
          published: true,
          photoUrl: "",
          capabilities: "Creative Direction, Front-End Engineering, Brand Architecture, Motion Design",
        },
        {
          sortOrder: 2,
          name: "Elliot Drummond",
          role: "Creative Director",
          philosophy: "Design without strategy is decoration. Strategy without design is a memo nobody reads.",
          bio: "Elliot brings a decade of brand and identity work across B2B SaaS, fintech, and professional services. He leads visual direction and design systems at BMC — from the first positioning workshop to the final design token. His background in both editorial and product design means he thinks in systems, not screens.",
          skills: "Brand Identity, Design Systems, UI/UX, Figma, Typography, Motion Design, Art Direction",
          brandCodeBalance: 82,
          featured: true,
          published: true,
          photoUrl: "",
          capabilities: "Brand Identity, Visual Design, Design Systems, Art Direction",
        },
        {
          sortOrder: 3,
          name: "Simone Abara",
          role: "Head of Client Services",
          philosophy: "Clarity is the rarest luxury a client can receive. It's also the most valuable thing we deliver.",
          bio: "Simone manages client relationships and internal delivery across every active engagement. Her background spans agency operations, brand consulting, and product management — which means she can translate between what clients mean, what designers see, and what engineers build. She keeps projects on track without losing the nuance.",
          skills: "Client Strategy, Project Management, Brand Consulting, Stakeholder Alignment, Agile, Scoping",
          brandCodeBalance: 68,
          featured: true,
          published: true,
          photoUrl: "",
          capabilities: "Client Management, Project Delivery, Brand Strategy, Ops",
        },
        {
          sortOrder: 4,
          name: "Marcus Oyelaran",
          role: "Senior Full Stack Developer",
          philosophy: "Performance is a feature — and it's the one that affects every other feature.",
          bio: "Marcus leads infrastructure and back-end architecture at BMC. He's built systems for Series A startups and enterprise teams alike, with a focus on performance, reliability, and developer experience. He has a secondary interest in brand systems that carries into how he approaches component architecture.",
          skills: "Next.js, TypeScript, Node.js, PostgreSQL, Prisma, AWS, Docker, CI/CD, Supabase",
          brandCodeBalance: 22,
          featured: true,
          published: true,
          photoUrl: "",
          capabilities: "Back-End Engineering, Infrastructure, Database Architecture, DevOps",
        },
        {
          sortOrder: 5,
          name: "Priya Nair",
          role: "Full Stack Developer",
          philosophy: "The interface is the product. Everything behind it exists to make the interface honest.",
          bio: "Priya specialises in front-end engineering and interaction design implementation. She bridges design and engineering — equally fluent in Figma and TypeScript — and has a particular strength in animation systems and accessibility. Her cross-disciplinary background means she catches design gaps that engineering teams typically miss.",
          skills: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Figma, Accessibility, GSAP",
          brandCodeBalance: 38,
          featured: false,
          published: true,
          photoUrl: "",
          capabilities: "Front-End Engineering, Interaction Design, Animation, Accessibility",
        },
        {
          sortOrder: 6,
          name: "Jordan Calloway",
          role: "Full Stack Developer",
          philosophy: "Readable code and readable interfaces come from the same discipline: respect for the next person.",
          bio: "Jordan handles full-stack feature delivery, CMS architecture, and API integrations. He's the person who builds the admin panels, data pipelines, and third-party integrations that clients never see but always depend on. His methodical approach to documentation has become a BMC standard.",
          skills: "Next.js, TypeScript, GraphQL, Prisma, REST APIs, PostgreSQL, CMS Architecture, Testing",
          brandCodeBalance: 28,
          featured: false,
          published: true,
          photoUrl: "",
          capabilities: "Full-Stack Development, CMS Architecture, API Integration, Testing",
        },
        {
          sortOrder: 7,
          name: "Nina Vasquez",
          role: "Senior Analytics Engineer",
          philosophy: "Data should answer questions, not just track events. The gap between those two is where most analytics fail.",
          bio: "Nina designs and implements measurement systems that actually get used. Her work spans GA4 implementation, GTM architecture, custom reporting in Looker Studio, and data pipeline work in BigQuery. She came up through engineering before moving into analytics, which shows in how she structures tracking — precise, scalable, and documented.",
          skills: "GA4, Google Tag Manager, Looker Studio, BigQuery, SQL, Python, Data Layer Architecture, CRO",
          brandCodeBalance: 42,
          featured: true,
          published: true,
          photoUrl: "",
          capabilities: "Analytics Engineering, Measurement Strategy, Data Infrastructure, Reporting",
        },
        {
          sortOrder: 8,
          name: "Theo Park",
          role: "Analytics & Growth Strategist",
          philosophy: "Attribution is a lie we tell ourselves — but understanding the lie is where the real insight lives.",
          bio: "Theo sits at the intersection of paid media, organic growth, and analytics strategy. He builds the reporting frameworks clients use to make budget decisions, and runs the analytics audits that typically reveal where traffic is leaking. His paid search background means he thinks about measurement with a commercial lens — not just what happened, but what to do next.",
          skills: "Google Ads, GA4, Attribution Modeling, SEO, CRO, Looker Studio, Paid Media Strategy, A/B Testing",
          brandCodeBalance: 52,
          featured: false,
          published: true,
          photoUrl: "",
          capabilities: "Growth Strategy, Paid Media, Analytics Consulting, CRO",
        },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
