-- CreateTable
CREATE TABLE "SeoSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteTitle" TEXT NOT NULL DEFAULT 'BrandMeetsCode — Premium Web Development Agency',
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | BrandMeetsCode',
    "metaDescription" TEXT NOT NULL DEFAULT 'BrandMeetsCode builds premium websites where brand strategy meets technical execution.',
    "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
    "googleTagManagerId" TEXT NOT NULL DEFAULT '',
    "noIndex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);
