-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceDetailPage" (
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
    "includedSectionBgSurface" BOOLEAN NOT NULL DEFAULT false,
    "includedItemsUseSurfaceBg" BOOLEAN NOT NULL DEFAULT true,
    "inclusions" TEXT NOT NULL,
    "faqOverline" TEXT NOT NULL,
    "faqHeading" TEXT NOT NULL,
    "faqs" TEXT NOT NULL
);
INSERT INTO "new_ServiceDetailPage" ("backLinkHref", "backLinkLabel", "faqHeading", "faqOverline", "faqs", "heroBody", "heroHasGradient", "heroOverline", "heroTitle", "includedHeading", "includedOverline", "inclusions", "metaDescription", "metaTitle", "primaryCtaHref", "primaryCtaLabel", "slug", "whoForBullets", "whoForHeading", "whoForOverline") SELECT "backLinkHref", "backLinkLabel", "faqHeading", "faqOverline", "faqs", "heroBody", "heroHasGradient", "heroOverline", "heroTitle", "includedHeading", "includedOverline", "inclusions", "metaDescription", "metaTitle", "primaryCtaHref", "primaryCtaLabel", "slug", "whoForBullets", "whoForHeading", "whoForOverline" FROM "ServiceDetailPage";
DROP TABLE "ServiceDetailPage";
ALTER TABLE "new_ServiceDetailPage" RENAME TO "ServiceDetailPage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
