-- CreateTable
CREATE TABLE "ServiceDetailPage" (
    "slug" TEXT NOT NULL PRIMARY KEY,
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
    "inclusions" TEXT NOT NULL,
    "faqOverline" TEXT NOT NULL,
    "faqHeading" TEXT NOT NULL,
    "faqs" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServicesContinuityIntro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ScopeEstimatorConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
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
    "stepTemplate" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutStorySection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "headingBeforeEm" TEXT NOT NULL,
    "headingEm" TEXT NOT NULL,
    "headingAfterEm" TEXT NOT NULL,
    "bmcMonogram" TEXT NOT NULL,
    "bmcTagline" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutValuesSectionHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "heading" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContactPageCopy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
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
    "calendlyUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CaseStudyUiLabels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "backToWorkLabel" TEXT NOT NULL,
    "backToCaseStudiesLabel" TEXT NOT NULL,
    "problemSectionLabel" TEXT NOT NULL,
    "approachSectionLabel" TEXT NOT NULL,
    "outcomeSectionLabel" TEXT NOT NULL,
    "similarProjectCtaLabel" TEXT NOT NULL
);
