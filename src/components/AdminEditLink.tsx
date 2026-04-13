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
      className="fixed z-[200] rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-accent shadow-lg no-underline transition-[border-color,background-color,color] hover:border-accent-muted hover:bg-surface-2 hover:text-text-primary"
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.5rem, env(safe-area-inset-right, 0px))",
      }}
      aria-label="Edit this page in the CMS"
    >
      Edit
    </Link>
  );
}
