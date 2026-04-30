"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appendUtmToUrl, mergeFooterCtaUtm, pathnameToFooterUtmContent, type UtmParams } from "@/lib/utm";

const CONTACT = "/contact";

type Props = {
  baseUtm: UtmParams;
  className: string;
  children: React.ReactNode;
  /** Optional static label for cursor / a11y */
  "data-cursor-label"?: string;
};

/**
 * Footer primary CTA to /contact. Same UTM source/medium/campaign/term as CMS `footer link` block;
 * `utm_content` is set from the current pathname (e.g. home, work, services-web-design).
 */
export default function FooterStartProjectCta({ baseUtm, className, children, ...rest }: Props) {
  const pathname = usePathname();
  const content = pathnameToFooterUtmContent(pathname);
  const href = appendUtmToUrl(CONTACT, mergeFooterCtaUtm(baseUtm, content));
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
