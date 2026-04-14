"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAdminToast } from "./AdminToast";

const MESSAGES: Record<string, string> = {
  "project-created": "Case study created",
  "industry-created": "Industry page created",
};

/**
 * Reads `?toast=…` from the URL once, shows the matching message, then strips the param.
 * Use with server-action redirects: `redirect('/admin/projects/x?toast=project-created')`.
 */
export default function AdminUrlToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useAdminToast();
  const shown = useRef(new Set<string>());

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key) return;

    const sig = `${pathname}:${key}`;
    if (shown.current.has(sig)) return;
    shown.current.add(sig);

    const msg = MESSAGES[key] ?? "Done";
    success(msg);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, success]);

  return null;
}
