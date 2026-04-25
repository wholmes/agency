import type { Metadata } from "next";
import { Fraunces, DM_Mono, Yellowtail, Geist } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import type { NavDropdownData } from "@/components/Navigation";
import AdminEditLinkServer from "@/components/AdminEditLinkServer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";
import CustomCursor from "@/components/CustomCursor";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import ScopeEstimatorModalDynamic from "@/components/ScopeEstimatorModalDynamic";
import { getRootLayoutData, getSeoSettings } from "@/lib/cms/queries";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  weight: "variable",
  style: ["normal", "italic"],
  preload: true,
});


const yellowtail = Yellowtail({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-yellowtail",
  weight: "400",
  preload: false,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  preload: false,
});

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  preload: false,
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
      images: [{ url: "/og-image.png", width: 1024, height: 539, alt: seo.siteTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: ["/og-image.png"],
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
  const { settings, chrome, serviceOfferings, industries, navProjects, seo, estimatorData } =
    await getRootLayoutData();

  const dropdownData: NavDropdownData = {
    services: serviceOfferings,
    industries,
    recentProjects: navProjects,
  };

  const availability = {
    available: settings.availabilityAvailable,
    label: settings.availabilityLabel,
    nextOpen: settings.availabilityNextOpen ?? undefined,
  };

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${dmMono.variable} ${yellowtail.variable} overflow-x-hidden`}
    >
      <head>
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
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chicago",
                addressRegion: "IL",
                addressCountry: "US",
              },
              areaServed: ["Chicago", "United States", "Worldwide"],
              priceRange: "$$$",
            }),
          }}
        />
      </head>
      <body className="font-body overflow-x-hidden">
        {/* Clips any wide descendants (nav chrome, transformed motion, etc.) site-wide */}
        <div className="relative min-h-dvh w-full min-w-0 overflow-x-hidden">
          <SmoothScroll />
          <ScrollToTopOnNavigate />
          <CustomCursor />
          <Navigation availability={availability} chrome={chrome} dropdownData={dropdownData} hideOnScroll={settings.navHideOnScroll} />
          <main id="main-content" className="min-w-0">
            {children}
          </main>
          <ScopeEstimatorModalDynamic data={estimatorData} />
          <AdminEditLinkServer />
          <AnalyticsScripts
            gaId={seo.googleAnalyticsId || undefined}
            gtmId={seo.googleTagManagerId || undefined}
          />
        </div>
      </body>
    </html>
  );
}
