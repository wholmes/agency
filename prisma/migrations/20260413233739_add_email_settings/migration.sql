-- CreateTable
CREATE TABLE "EmailSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "notifyEmail" TEXT NOT NULL,
    "fromName" TEXT NOT NULL DEFAULT 'BrandMeetsCode',
    "fromAddress" TEXT NOT NULL DEFAULT 'onboarding@resend.dev',
    "autoReplyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoReplySubject" TEXT NOT NULL DEFAULT 'Got your message — I''ll be in touch shortly',
    "autoReplyOpening" TEXT NOT NULL DEFAULT 'Thanks for reaching out — I''ve received your message and will get back to you within 1–2 business days.',

    CONSTRAINT "EmailSettings_pkey" PRIMARY KEY ("id")
);
