import Link from "next/link";
import RedirectForm from "../RedirectForm";
import { createRedirect } from "../mutations";

export const metadata = { title: "Admin — New redirect" };

export default function AdminNewRedirectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">
            New redirect
          </h1>
          <p className="text-xs text-text-tertiary">
            Rules are applied at the Edge and cached for ~60 s.
          </p>
        </div>
        <Link
          href="/admin/redirects"
          className="text-sm text-text-tertiary no-underline hover:text-text-secondary"
        >
          ← All redirects
        </Link>
      </div>

      <RedirectForm action={createRedirect} submitLabel="Create redirect" />
    </div>
  );
}
