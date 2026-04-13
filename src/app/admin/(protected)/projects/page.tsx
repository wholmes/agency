import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Case studies" };

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Case studies</h1>
      <p className="mb-8 text-sm text-text-secondary">Edit individual projects. Services are a JSON string array.</p>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium text-text-primary">{p.title}</p>
              <p className="text-xs text-text-tertiary">
                {p.id} · {p.year}
              </p>
            </div>
            <Link
              href={`/admin/projects/${p.id}`}
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-accent no-underline transition-colors hover:border-accent-muted"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
