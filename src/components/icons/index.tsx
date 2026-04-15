import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/* All icons: 24x24 grid, 1.5px stroke, rounded caps, consistent weight */

export function IconArrowRight({ size = 20, className = "", strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M4 12h16M14 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrowUpRight({ size = 20, className = "", strokeWidth = 1.5, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H8M17 7v9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMenu({ size = 22, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M3 8h18M3 16h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClose({ size = 22, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCode({ size = 24, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M8 8L4 12l4 4M16 8l4 4-4 4M13 5l-2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBrand({ size = 24, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconAnalytics({ size = 24, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M3 20h18M7 10v10M11 6v14M15 13v7M19 3v17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDesign({ size = 24, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17.5 14l3 3-3 3M14 17.5h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPerformance({ size = 24, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M12 12l-3-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconCheck({ size = 20, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEmail({ size = 20, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 8l10 7 10-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCalendar({ size = 20, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 10h20M8 2v4M16 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconStar({ size = 20, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconQuote({ size = 32, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M4 14c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8H4v-10zM18 14c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8h-8V14z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

/** WordPress: circle ring + W letterform inside */
export function IconWordPress({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 12l2 5 3.5-8 3.5 8 2-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Drupal: teardrop pointing up with inner highlight circle */
export function IconDrupal({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 2C9.5 4.5 7 7 7 11a5 5 0 0010 0c0-4-2.5-6.5-5-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** CMS: layered content blocks — page layout metaphor */
export function IconCMS({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="3" y="3" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="10" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="10" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="17" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="17" width="9" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Chrome Extension: puzzle piece */
export function IconExtension({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M4 4h7v2a1 1 0 002 0V4h7v7h-2a1 1 0 000 2h2v7H4v-7h2a1 1 0 000-2H4V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** SaaS / cloud application: layered stack with upward arrow */
export function IconSaaS({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 17c0 1.1.9 2 2 2h12a2 2 0 002-2v-1H4v1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 12c0 1.1.9 2 2 2h12a2 2 0 002-2v-1H4v1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 7h12a2 2 0 012 2v1H4V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 3v3M10 4l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Data & Analytics: rising bars with a trend line */
export function IconData({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 14v6M10 9v11M14 12v8M18 5v15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 14l4-5 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 2" />
    </svg>
  );
}

/** Ecommerce: shopping bag with a subtle trend tick */
export function IconEcommerce({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 2l-2 4h16l-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6v13a2 2 0 002 2h12a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 11a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** GMP: monitor with trend line — Google Marketing Platform consulting */
export function IconGMP({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="3" y="3.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 20.5h6M12 16.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 12.5l3-4 3 2.5 3.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** Gamepad: controller silhouette with d-pad and buttons */
export function IconGamepad({ size = 24, className = "", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M6 9c-2.2 0-4 1.6-4 3.8 0 2 1.5 3.6 3.5 3.6L7 15h10l1.5 1.4C20.5 16.4 22 14.8 22 12.8 22 10.6 20.2 9 18 9l-1.5 1.5H7.5L6 9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 12.5h2M9.5 11.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14.5" cy="11.5" r="0.75" fill="currentColor" />
      <circle cx="16.5" cy="13" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function IconExternalLink({ size = 16, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
