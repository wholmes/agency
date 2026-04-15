import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { getAllCapabilitiesForAdmin } from "@/lib/cms/queries";
import { moveCapabilityUp, moveCapabilityDown } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Capabilities" };

export default async function AdminCapabilitiesPage() {
  const caps = await getAllCapabilitiesForAdmin();
  const total = caps.length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-light tracking-tight">Capabilities</h1>
        <Link href="/admin/capabilities/new" className="btn btn-primary">
          + New card
        </Link>
      </div>

      {total === 0 ? (
        <p className="text-sm text-text-tertiary">No capability cards yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {caps.map((cap, i) => {
            const up = moveCapabilityUp.bind(null, cap.id);
            const down = moveCapabilityDown.bind(null, cap.id);

            return (
              <li
                key={cap.id}
                className={`flex items-center gap-3 rounded-lg border bg-surface px-4 py-3 ${
                  cap.published ? "border-border" : "border-dashed border-border opacity-60"
                }`}
              >
                {/* Reorder */}
                <div className="flex shrink-0 flex-col gap-0.5">
                  <AdminSaveForm action={up} className="contents" successMessage="Moved up">
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label={`Move ${cap.title} up`}
                      className="flex size-6 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary disabled:pointer-events-none disabled:opacity-20"
                    >
                      ↑
                    </button>
                  </AdminSaveForm>
                  <AdminSaveForm action={down} className="contents" successMessage="Moved down">
                    <button
                      type="submit"
                      disabled={i === total - 1}
                      aria-label={`Move ${cap.title} down`}
                      className="flex size-6 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary disabled:pointer-events-none disabled:opacity-20"
                    >
                      ↓
                    </button>
                  </AdminSaveForm>
                </div>

                {/* Icon preview */}
                {cap.iconSvg && (
                  <span
                    className="shrink-0 text-accent [&>svg]:h-5 [&>svg]:w-5"
                    dangerouslySetInnerHTML={{ __html: cap.iconSvg }}
                  />
                )}

                {/* Title + status */}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-text-primary">{cap.title}</span>
                  {!cap.published && (
                    <span className="ml-2 rounded border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                      Draft
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/capabilities/${cap.id}`}
                  className="shrink-0 text-xs text-text-tertiary transition-colors hover:text-text-primary"
                >
                  Edit →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
