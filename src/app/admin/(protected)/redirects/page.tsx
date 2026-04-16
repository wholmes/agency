import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { getAllRedirectsForAdmin } from "@/lib/cms/queries";
import { toggleRedirectEnabled } from "./mutations";

export const metadata = { title: "Admin — Redirects" };

export default async function AdminRedirectsPage() {
  const redirects = await getAllRedirectsForAdmin();
  const enabled = redirects.filter((r) => r.enabled).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">Redirects</h1>
          <p className="text-sm text-text-secondary">
            {redirects.length} {redirects.length === 1 ? "rule" : "rules"} ·{" "}
            {enabled} active
          </p>
        </div>
        <Link href="/admin/redirects/new" className="btn btn-primary shrink-0">
          + New redirect
        </Link>
      </div>

      {/* How it works callout */}
      <div className="mb-8 rounded-lg border border-border bg-surface p-4 text-xs text-text-tertiary leading-relaxed">
        <p>
          <span className="font-medium text-text-secondary">How it works — </span>
          Redirects are applied at the Edge before any page renders. Active rules are cached
          for ~60 s. <span className="font-mono">307</span> = Temporary (browsers don&apos;t
          cache), <span className="font-mono">308</span> = Permanent (browsers cache). Use{" "}
          <span className="font-mono">/old/*</span> as source to match any path under a prefix,
          and <span className="font-mono">/new/*</span> as destination to forward the suffix.
        </p>
      </div>

      {redirects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="mb-1 text-sm text-text-secondary">No redirect rules yet</p>
          <p className="text-xs text-text-tertiary">
            Create your first rule to start managing URL redirects.
          </p>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div className="mb-2 grid grid-cols-[1fr_1fr_5rem_7rem_6rem] gap-3 px-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            <span>Source</span>
            <span>Destination</span>
            <span>Type</span>
            <span>Status</span>
            <span />
          </div>

          <ul className="flex flex-col gap-1.5">
            {redirects.map((r) => {
              const toggle = toggleRedirectEnabled.bind(null, r.id);

              return (
                <li
                  key={r.id}
                  className={`grid grid-cols-[1fr_1fr_5rem_7rem_6rem] items-center gap-3 rounded-lg border bg-surface px-4 py-3 text-sm ${
                    r.enabled ? "border-border" : "border-dashed border-border opacity-60"
                  }`}
                >
                  {/* Source */}
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-text-primary">{r.source}</p>
                    {r.note && (
                      <p className="mt-0.5 truncate text-[11px] text-text-tertiary">{r.note}</p>
                    )}
                  </div>

                  {/* Destination */}
                  <p className="truncate font-mono text-xs text-text-secondary">
                    {r.destination}
                  </p>

                  {/* Type badge */}
                  <span
                    className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      r.permanent
                        ? "border-accent-muted/50 text-accent"
                        : "border-border text-text-tertiary"
                    }`}
                  >
                    {r.permanent ? "308 Perm" : "307 Temp"}
                  </span>

                  {/* Enabled toggle */}
                  <AdminSaveForm action={toggle} className="contents" successMessage="Updated">
                    <button
                      type="submit"
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                        r.enabled
                          ? "border-green-700/50 text-green-400 hover:opacity-70"
                          : "border-border text-text-tertiary hover:border-green-700/40 hover:text-green-400"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${r.enabled ? "bg-green-400" : "bg-text-tertiary"}`}
                      />
                      {r.enabled ? "Active" : "Disabled"}
                    </button>
                  </AdminSaveForm>

                  {/* Edit */}
                  <Link
                    href={`/admin/redirects/${r.id}`}
                    className="rounded-md border border-border px-3 py-1.5 text-center text-xs text-accent no-underline transition-colors hover:border-accent-muted"
                  >
                    Edit
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
