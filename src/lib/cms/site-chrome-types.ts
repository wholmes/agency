export type NavLink = { href: string; label: string };

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

/** Optional GA4 params for the header primary CTA (stored in SiteChrome JSON). */
export type PrimaryCtaConfig = {
  label: string;
  href: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type SiteChromeConfigParsed = {
  navLinks: NavLink[];
  primaryCta: PrimaryCtaConfig;
  footerColumns: FooterColumn[];
  footerUtilityLinks: NavLink[];
  copyrightBrandName: string;
  rightsReservedLine: string;
};
