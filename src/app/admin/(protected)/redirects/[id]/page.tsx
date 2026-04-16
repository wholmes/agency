import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import RedirectForm from "../RedirectForm";
import { updateRedirect, deleteRedirect } from "../mutations";
import DeleteRedirectButton from "./DeleteRedirectButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const r = await prisma.redirect.findUnique({ where: { id: Number(id) } });
  return { title: r ? `Admin — Redirect ${r.source}` : "Admin — Redirect" };
}

export default async function AdminEditRedirectPage({ params }: Props) {
  const { id } = await params;
  const r = await prisma.redirect.findUnique({ where: { id: Number(id) } });
  if (!r) notFound();

  const updateWithId = updateRedirect.bind(null, r.id);
  const deleteWithId = deleteRedirect.bind(null, r.id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight font-mono">
            {r.source}
          </h1>
          <p className="font-mono text-xs text-text-tertiary">→ {r.destination}</p>
        </div>
        <Link
          href="/admin/redirects"
          className="text-sm text-text-tertiary no-underline hover:text-text-secondary"
        >
          ← All redirects
        </Link>
      </div>

      <RedirectForm
        action={updateWithId}
        defaultValues={{
          source: r.source,
          destination: r.destination,
          permanent: r.permanent,
          enabled: r.enabled,
          note: r.note,
        }}
        submitLabel="Save changes"
      />

      {/* Danger zone */}
      <div
        className="mt-12 rounded-lg border border-dashed p-6"
        style={{ borderColor: "var(--color-error)", opacity: 0.7 }}
      >
        <h2 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-error">
          Danger zone
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">
          Permanently remove this redirect rule. Requests to{" "}
          <span className="font-mono">{r.source}</span> will no longer be redirected.
        </p>
        <DeleteRedirectButton action={deleteWithId} source={r.source} />
      </div>
    </div>
  );
}
