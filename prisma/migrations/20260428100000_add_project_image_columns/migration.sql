-- AlterTable
-- schema.prisma had thumb/cover/hero/mobile image fields without a migration; seed + app expect these columns.
-- IF NOT EXISTS: Neon may already have these from an earlier `db push`.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "thumbImage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "coverImage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "heroImage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "mobileImage" TEXT NOT NULL DEFAULT '';
