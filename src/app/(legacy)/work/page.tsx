import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";
import { getProjects, getWorkPageHero } from "@/lib/cms/queries";
import { isAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selected Work — BrandMeetsCode",
  description:
    "A curated selection of web design, development, brand strategy, and analytics projects built by BrandMeetsCode for B2B companies and SaaS founders.",
  alternates: { canonical: "https://brandmeetscode.com/work" },
  openGraph: {
    title: "Selected Work — BrandMeetsCode",
    description:
      "A curated selection of web design, development, brand strategy, and analytics projects built by BrandMeetsCode for B2B companies and SaaS founders.",
    url: "https://brandmeetscode.com/work",
    siteName: "BrandMeetsCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work — BrandMeetsCode",
    description:
      "A curated selection of web design, development, brand strategy, and analytics projects built by BrandMeetsCode for B2B companies and SaaS founders.",
  },
};

export default async function WorkPage() {
  const [projects, workHero, isAdmin] = await Promise.all([
    getProjects(),
    getWorkPageHero(),
    isAdminSession(),
  ]);

  return <WorkPageClient projects={projects} workHero={workHero} isAdmin={isAdmin} />;
}
