export type NavLink = { href: string; label: string };

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export type SiteChromeConfigParsed = {
  navLinks: NavLink[];
  primaryCta: { label: string; href: string };
  footerColumns: FooterColumn[];
  footerUtilityLinks: NavLink[];
  copyrightBrandName: string;
  rightsReservedLine: string;
};
