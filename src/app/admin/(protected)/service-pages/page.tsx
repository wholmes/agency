import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Service detail pages" };

export default async function AdminServicePagesListPage() {
  const pages = await prisma.serviceDetailPage.findMany({ orderBy: { slug: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Service detail pages</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Long-form pages at <code className="font-mono text-xs">/services/[slug]</code> — hero, audience, inclusions, FAQ.
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/service-pages/${encodeURIComponent(p.slug)}`}
              className="flex items-center justify-between gap-4 px-5 py-4 no-underline transition-colors hover:bg-surface-2"
            >
              <span>
                <span className="font-medium text-text-primary">{p.heroTitle || p.slug}</span>
                <span className="ml-2 text-xs text-text-tertiary">{p.slug}</span>
              </span>
              <span className="text-xs text-text-tertiary">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
