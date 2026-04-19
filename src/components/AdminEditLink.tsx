"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminEditHref } from "@/lib/admin/public-edit-path";

export default function AdminEditLink({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  if (!isAdmin || !pathname || pathname.startsWith("/admin")) {
    return null;
  }

  const href = getAdminEditHref(pathname);
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      className="fixed z-[200] inline-flex items-center gap-2 rounded-full border border-accent-muted bg-bg/90 px-4 py-2 text-sm font-medium text-accent shadow-lg shadow-black/30 no-underline backdrop-blur-md transition-colors hover:bg-accent hover:text-bg"
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.5rem, env(safe-area-inset-right, 0px))",
      }}
      aria-label="Edit this page in the CMS"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Edit page
    </Link>
  );
}
