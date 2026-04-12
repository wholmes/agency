import type { Metadata } from "next";
import { Fraunces, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://brandmeetscode.com"),
  title: {
    default: "BrandMeetsCode — Premium Web Development Agency",
    template: "%s | BrandMeetsCode",
  },
  description:
    "BrandMeetsCode builds premium websites where brand strategy meets technical execution. Trusted by B2B companies, SaaS founders, and marketing leaders who demand both design and engineering excellence.",
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
    url: "https://brandmeetscode.com",
    siteName: "BrandMeetsCode",
    title: "BrandMeetsCode — Premium Web Development Agency",
    description:
      "Premium websites where brand strategy meets technical execution.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BrandMeetsCode — Premium Web Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandMeetsCode — Premium Web Development Agency",
    description:
      "Premium websites where brand strategy meets technical execution.",
    images: ["/og-image.jpg"],
  },
  robots: {
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
  alternates: {
    canonical: "https://brandmeetscode.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)" }}>
        <CustomCursor />
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
