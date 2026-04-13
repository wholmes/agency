-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "proofFit" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "resultDetail" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "contactEmail" TEXT NOT NULL,
    "availabilityAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availabilityLabel" TEXT NOT NULL,
    "availabilityNextOpen" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialStat" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialClient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedTestimonial" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorTitle" TEXT NOT NULL,
    "authorInitials" TEXT NOT NULL,
    "starCount" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "FeaturedTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOffering" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "number" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "descriptionHome" TEXT NOT NULL,
    "outcomesHome" TEXT NOT NULL,
    "descriptionListing" TEXT NOT NULL,
    "outcomesListing" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContinuityBlock" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "ContinuityBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LighthouseGuarantee" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "LighthouseGuarantee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeHero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headlineLine1" TEXT NOT NULL,
    "headlineLine2Italic" TEXT NOT NULL,
    "headlineLine3" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT NOT NULL,
    "secondaryCtaHref" TEXT NOT NULL,

    CONSTRAINT "HomeHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkPageHero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headlineLine1" TEXT NOT NULL,
    "headlineLine2Italic" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "WorkPageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesPageHero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "ServicesPageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesHomeSection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "footerBeforeHighlight" TEXT NOT NULL,
    "footerHighlight" TEXT NOT NULL,
    "footerAfterHighlightBeforeLink" TEXT NOT NULL,
    "footerLinkLabel" TEXT NOT NULL,
    "footerLinkHref" TEXT NOT NULL,
    "footerAfterLink" TEXT NOT NULL,

    CONSTRAINT "ServicesHomeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterCopy" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "tagline" TEXT NOT NULL,
    "remoteBlurb" TEXT NOT NULL,

    CONSTRAINT "FooterCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "AboutValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutStoryParagraph" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "AboutStoryParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutTeaserBelief" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "AboutTeaserBelief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutTeaserCard" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "body" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,

    CONSTRAINT "AboutTeaserCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageHero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "line3BeforeEm" TEXT NOT NULL,
    "line3Em" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "AboutPageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkPreviewSection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,

    CONSTRAINT "WorkPreviewSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtaSectionCopy" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingBeforeEm" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT NOT NULL,
    "secondaryCtaHref" TEXT NOT NULL,
    "footnote" TEXT NOT NULL,

    CONSTRAINT "CtaSectionCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutHomeTeaser" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingBeforeEm" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "headingMid" TEXT NOT NULL,
    "headingLastLine" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,

    CONSTRAINT "AboutHomeTeaser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDetailPage" (
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "heroHasGradient" BOOLEAN NOT NULL DEFAULT false,
    "heroOverline" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroBody" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "backLinkLabel" TEXT NOT NULL,
    "backLinkHref" TEXT NOT NULL DEFAULT '/services',
    "whoForOverline" TEXT NOT NULL,
    "whoForHeading" TEXT NOT NULL,
    "whoForBullets" TEXT NOT NULL,
    "includedOverline" TEXT NOT NULL,
    "includedHeading" TEXT NOT NULL,
    "includedSectionBgSurface" BOOLEAN NOT NULL DEFAULT false,
    "includedItemsUseSurfaceBg" BOOLEAN NOT NULL DEFAULT true,
    "inclusions" TEXT NOT NULL,
    "faqOverline" TEXT NOT NULL,
    "faqHeading" TEXT NOT NULL,
    "faqs" TEXT NOT NULL,

    CONSTRAINT "ServiceDetailPage_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "ServicesContinuityIntro" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "ServicesContinuityIntro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeEstimatorConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "sectionOverline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingLine2Italic" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "projectTypes" TEXT NOT NULL,
    "pageCounts" TEXT NOT NULL,
    "integrations" TEXT NOT NULL,
    "timelines" TEXT NOT NULL,
    "weeksByTimelineId" TEXT NOT NULL,
    "stepTitles" TEXT NOT NULL,
    "integrationsHint" TEXT NOT NULL,
    "resultOverline" TEXT NOT NULL,
    "resultDisclaimer" TEXT NOT NULL,
    "stepTemplate" TEXT NOT NULL,

    CONSTRAINT "ScopeEstimatorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutStorySection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "headingBeforeEm" TEXT NOT NULL,
    "headingEm" TEXT NOT NULL,
    "headingAfterEm" TEXT NOT NULL,
    "bmcMonogram" TEXT NOT NULL,
    "bmcTagline" TEXT NOT NULL,

    CONSTRAINT "AboutStorySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValuesSectionHeader" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "overline" TEXT NOT NULL,
    "heading" TEXT NOT NULL,

    CONSTRAINT "AboutValuesSectionHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageCopy" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "overline" TEXT NOT NULL,
    "heroLineBeforeEm" TEXT NOT NULL,
    "heroEmphasis" TEXT NOT NULL,
    "heroLineAfterEm" TEXT NOT NULL,
    "introParagraph" TEXT NOT NULL,
    "whatHappensHeading" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "altRoutesHeading" TEXT NOT NULL,
    "emailCardTitle" TEXT NOT NULL,
    "calendarCardTitle" TEXT NOT NULL,
    "calendarCardSubtitle" TEXT NOT NULL,
    "calendlyUrl" TEXT NOT NULL,

    CONSTRAINT "ContactPageCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyUiLabels" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "backToWorkLabel" TEXT NOT NULL,
    "backToCaseStudiesLabel" TEXT NOT NULL,
    "problemSectionLabel" TEXT NOT NULL,
    "approachSectionLabel" TEXT NOT NULL,
    "outcomeSectionLabel" TEXT NOT NULL,
    "similarProjectCtaLabel" TEXT NOT NULL,

    CONSTRAINT "CaseStudyUiLabels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFormConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "configJson" TEXT NOT NULL,

    CONSTRAINT "ContactFormConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustriesHub" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "overline" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "introBody" TEXT NOT NULL,
    "cardCtaLabel" TEXT NOT NULL,

    CONSTRAINT "IndustriesHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryPage" (
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "listTitle" TEXT NOT NULL,
    "listBlurb" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "heroOverline" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroBody" TEXT NOT NULL,
    "introTitle" TEXT NOT NULL,
    "introBody" TEXT NOT NULL,
    "focusTitle" TEXT NOT NULL,
    "focusBullets" TEXT NOT NULL,
    "differentiatorTitle" TEXT NOT NULL,
    "differentiatorBody" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,

    CONSTRAINT "IndustryPage_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SiteChrome" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "configJson" TEXT NOT NULL,

    CONSTRAINT "SiteChrome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOffering_slug_key" ON "ServiceOffering"("slug");
