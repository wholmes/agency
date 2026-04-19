import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { IconExternalLink } from "@/components/icons";
import { getAllProjectsForAdmin } from "@/lib/cms/queries";
import { moveProjectUp, moveProjectDown, toggleProjectPublished } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Case studies" };

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();
  const total = projects.length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">Case studies</h1>
          <p className="text-sm text-text-secondary">
            {total} {total === 1 ? "project" : "projects"} ·{" "}
            {projects.filter((p) => !p.published).length} draft
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary shrink-0">
          + New case study
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {projects.map((p, i) => {
          const moveUp = moveProjectUp.bind(null, p.id);
          const moveDown = moveProjectDown.bind(null, p.id);
          const togglePublish = toggleProjectPublished.bind(null, p.id);

          return (
            <li
              key={p.id}
              className={`flex items-center gap-3 rounded-lg border bg-surface px-4 py-3 ${
                p.published ? "border-border" : "border-dashed border-border opacity-70"
              }`}
            >
              {/* Reorder buttons */}
              <div className="flex shrink-0 flex-col gap-0.5">
                <AdminSaveForm action={moveUp} className="contents" successMessage="Moved up">
                  <button
                    type="submit"
                    disabled={i === 0}
                    title="Move up"
                    className="flex size-6 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary disabled:pointer-events-none disabled:opacity-20"
                    aria-label={`Move ${p.title} up`}
                  >
                    ↑
                  </button>
                </AdminSaveForm>
                <AdminSaveForm action={moveDown} className="contents" successMessage="Moved down">
                  <button
                    type="submit"
                    disabled={i === total - 1}
                    title="Move down"
                    className="flex size-6 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary disabled:pointer-events-none disabled:opacity-20"
                    aria-label={`Move ${p.title} down`}
                  >
                    ↓
                  </button>
                </AdminSaveForm>
              </div>

              {/* Title + meta */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-text-primary">{p.title}</p>
                  {!p.published && (
                    <span className="shrink-0 rounded-full border border-yellow-700/50 bg-yellow-950/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-yellow-400">
                      Draft
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-text-tertiary">
                  {p.id} · {p.year} · #{i + 1}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {/* Publish toggle */}
                <AdminSaveForm action={togglePublish} className="contents" successMessage="Updated">
                  <button
                    type="submit"
                    title={p.published ? "Set to draft" : "Publish"}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      p.published
                        ? "border-border text-text-tertiary hover:border-yellow-600/50 hover:text-yellow-400"
                        : "border-green-700/50 text-green-400 hover:bg-green-950/30"
                    }`}
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                </AdminSaveForm>

                <Link
                  href={`/work/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open case study on the public site"
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-secondary no-underline transition-colors hover:border-accent-muted hover:text-accent"
                >
                  <IconExternalLink size={12} />
                  Live
                </Link>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-xs text-accent no-underline transition-colors hover:border-accent-muted"
                >
                  Edit
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
