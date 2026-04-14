import type { Metadata } from "next";
import { Fraunces, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import type { NavDropdownData } from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AdminEditLink from "@/components/AdminEditLink";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { isAdminSession } from "@/lib/admin/session";
import {
  getFooterCopy,
  getIndustryPagesForList,
  getProjects,
  getSeoSettings,
  getServiceOfferings,
  getSiteChrome,
  getSiteSettings,
} from "@/lib/cms/queries";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  weight: "variable",
  style: ["normal", "italic"],
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

const SITE_URL = "https://brandmeetscode.com";

export async function generateMetadata(): Promise<Metadata> {
  let seo = {
    siteTitle: "BrandMeetsCode — Premium Web Development Agency",
    titleTemplate: "%s | BrandMeetsCode",
    metaDescription:
      "BrandMeetsCode builds premium websites where brand strategy meets technical execution. Trusted by B2B companies, SaaS founders, and marketing leaders who demand both design and engineering excellence.",
    noIndex: false,
  };
  try {
    const db = await getSeoSettings();
    seo = {
      siteTitle: db.siteTitle || seo.siteTitle,
      titleTemplate: db.titleTemplate || seo.titleTemplate,
      metaDescription: db.metaDescription || seo.metaDescription,
      noIndex: db.noIndex,
    };
  } catch { /* fall back to defaults */ }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate,
    },
    description: seo.metaDescription,
    keywords: [
      "web development agency",
      "brand strategy",
      "premium website design",
      "SaaS website development",
      "B2B web design",
      "Next.js agency",
      "design engineering",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: "BrandMeetsCode",
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: seo.siteTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: ["/og-image.jpg"],
    },
    robots: seo.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: { canonical: SITE_URL },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, footer, chrome, isAdmin, serviceOfferings, industries, allProjects, seo] =
    await Promise.all([
      getSiteSettings(),
      getFooterCopy(),
      getSiteChrome(),
      isAdminSession(),
      getServiceOfferings(),
      getIndustryPagesForList(),
      getProjects(),
      getSeoSettings().catch(() => ({ googleAnalyticsId: "", googleTagManagerId: "" })),
    ]);

  const dropdownData: NavDropdownData = {
    services: serviceOfferings,
    industries,
    recentProjects: allProjects.slice(0, 3),
  };

  const availability = {
    available: settings.availabilityAvailable,
    label: settings.availabilityLabel,
    nextOpen: settings.availabilityNextOpen ?? undefined,
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0C0C0B" />
        <link rel="canonical" href="https://brandmeetscode.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "BrandMeetsCode",
              url: "https://brandmeetscode.com",
              description:
                "Premium web development agency where brand strategy meets technical execution.",
              serviceType: "Web Development",
              areaServed: "Worldwide",
              priceRange: "$$$",
            }),
          }}
        />
      </head>
      <body className="font-body">
        <CustomCursor />
        <Navigation availability={availability} chrome={chrome} dropdownData={dropdownData} />
        <main id="main-content">{children}</main>
        <Footer
          tagline={footer.tagline}
          remoteBlurb={footer.remoteBlurb}
          contactEmail={settings.contactEmail}
          chrome={chrome}
        />
        <AdminEditLink isAdmin={isAdmin} />
        <AnalyticsScripts
          gaId={seo.googleAnalyticsId || undefined}
          gtmId={seo.googleTagManagerId || undefined}
        />
      </body>
    </html>
  );
}
