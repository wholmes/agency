-- CreateTable
CREATE TABLE "Capability" (
    "id" SERIAL NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "descriptor" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "iconSvg" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);
