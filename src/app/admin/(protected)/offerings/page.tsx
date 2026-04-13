import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Service offerings" };

export default async function AdminOfferingsListPage() {
  const offerings = await prisma.serviceOffering.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Service offerings</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Cards on the homepage and the services hub. Edit copy, outcomes JSON, and links.
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {offerings.map((o) => (
          <li key={o.id}>
            <Link
              href={`/admin/offerings/${o.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 no-underline transition-colors hover:bg-surface-2"
            >
              <span>
                <span className="font-medium text-text-primary">{o.title}</span>
                <span className="ml-2 text-xs text-text-tertiary">{o.slug}</span>
              </span>
              <span className="text-xs text-text-tertiary">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
