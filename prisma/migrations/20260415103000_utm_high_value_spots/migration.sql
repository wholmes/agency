-- AlterTable: shared bottom CTA section
ALTER TABLE "CtaSectionCopy"
ADD COLUMN "primaryUtmSource" TEXT,
ADD COLUMN "primaryUtmMedium" TEXT,
ADD COLUMN "primaryUtmCampaign" TEXT,
ADD COLUMN "primaryUtmContent" TEXT,
ADD COLUMN "primaryUtmTerm" TEXT,
ADD COLUMN "secondaryUtmSource" TEXT,
ADD COLUMN "secondaryUtmMedium" TEXT,
ADD COLUMN "secondaryUtmCampaign" TEXT,
ADD COLUMN "secondaryUtmContent" TEXT,
ADD COLUMN "secondaryUtmTerm" TEXT;

-- AlterTable: homepage services strip footer inline link
ALTER TABLE "ServicesHomeSection"
ADD COLUMN "footerLinkUtmSource" TEXT,
ADD COLUMN "footerLinkUtmMedium" TEXT,
ADD COLUMN "footerLinkUtmCampaign" TEXT,
ADD COLUMN "footerLinkUtmContent" TEXT,
ADD COLUMN "footerLinkUtmTerm" TEXT;

-- AlterTable: contact page Calendly card
ALTER TABLE "ContactPageCopy"
ADD COLUMN "calendlyUtmSource" TEXT,
ADD COLUMN "calendlyUtmMedium" TEXT,
ADD COLUMN "calendlyUtmCampaign" TEXT,
ADD COLUMN "calendlyUtmContent" TEXT,
ADD COLUMN "calendlyUtmTerm" TEXT;

-- AlterTable: /services/[slug] hero primary CTA
ALTER TABLE "ServiceDetailPage"
ADD COLUMN "primaryUtmSource" TEXT,
ADD COLUMN "primaryUtmMedium" TEXT,
ADD COLUMN "primaryUtmCampaign" TEXT,
ADD COLUMN "primaryUtmContent" TEXT,
ADD COLUMN "primaryUtmTerm" TEXT;
