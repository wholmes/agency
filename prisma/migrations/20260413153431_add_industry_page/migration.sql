-- CreateTable
CREATE TABLE "IndustryPage" (
    "slug" TEXT NOT NULL PRIMARY KEY,
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
    "ctaHref" TEXT NOT NULL
);
