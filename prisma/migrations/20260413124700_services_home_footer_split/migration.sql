/*
  Warnings:

  - You are about to drop the column `footerBeforeLink` on the `ServicesHomeSection` table. All the data in the column will be lost.
  - Added the required column `footerAfterHighlightBeforeLink` to the `ServicesHomeSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footerBeforeHighlight` to the `ServicesHomeSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footerHighlight` to the `ServicesHomeSection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServicesHomeSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "overline" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingEmphasis" TEXT NOT NULL,
    "footerBeforeHighlight" TEXT NOT NULL,
    "footerHighlight" TEXT NOT NULL,
    "footerAfterHighlightBeforeLink" TEXT NOT NULL,
    "footerLinkLabel" TEXT NOT NULL,
    "footerLinkHref" TEXT NOT NULL,
    "footerAfterLink" TEXT NOT NULL
);
INSERT INTO "new_ServicesHomeSection" ("footerAfterLink", "footerLinkHref", "footerLinkLabel", "headingEmphasis", "headingLine1", "id", "overline") SELECT "footerAfterLink", "footerLinkHref", "footerLinkLabel", "headingEmphasis", "headingLine1", "id", "overline" FROM "ServicesHomeSection";
DROP TABLE "ServicesHomeSection";
ALTER TABLE "new_ServicesHomeSection" RENAME TO "ServicesHomeSection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
