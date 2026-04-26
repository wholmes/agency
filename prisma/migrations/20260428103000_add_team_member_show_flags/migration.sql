-- AlterTable
-- TeamMember had showPhilosophy / showBio / showBalance in schema.prisma without migrations.
-- IF NOT EXISTS: safe if a remote DB already had these from db push.
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "showPhilosophy" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "showBio" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "showBalance" BOOLEAN NOT NULL DEFAULT true;
