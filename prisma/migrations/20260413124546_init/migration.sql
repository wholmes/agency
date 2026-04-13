-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "contactEmail" TEXT NOT NULL,
    "availabilityAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availabilityLabel" TEXT NOT NULL,
    "availabilityNextOpen" TEXT
);

-- CreateTable
CREATE TABLE "SocialStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SocialClient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "FeaturedTestimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorTitle" TEXT NOT NULL,
    "authorInitials" TEXT NOT NULL,
    "starCount" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "ServiceOffering" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ContinuityBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sortOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LighthouseGuarantee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HomeHero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headlineLine1" TEXT NOT NULL,
    "headlineLine2Italic" TEXT NOT NULL,
    "headlineLine3" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT NOT NULL,
    "secondaryCtaHref" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkPageHero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headlineLine1" TEXT NOT NULL,
    "headlineLine2Italic" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServicesPageHero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServicesHomeSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "footerBeforeLink" TEXT NOT NULL,
    "footerLinkLabel" TEXT NOT NULL,
    "footerLinkHref" TEXT NOT NULL,
    "footerAfterLink" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FooterCopy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "tagline" TEXT NOT NULL,
    "remoteBlurb" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sortOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutStoryParagraph" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sortOrder" INTEGER NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutTeaserBelief" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sortOrder" INTEGER NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutTeaserCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "body" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AboutPageHero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "line3BeforeEm" TEXT NOT NULL,
    "line3Em" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkPreviewSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CtaSectionCopy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingBeforeEm" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT NOT NULL,
    "secondaryCtaHref" TEXT NOT NULL,
    "footnote" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOffering_slug_key" ON "ServiceOffering"("slug");
