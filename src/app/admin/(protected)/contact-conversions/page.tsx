import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Contact conversions" };

const MS_DAY = 24 * 60 * 60 * 1000;

function formatWhen(d: Date) {
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function snippet(s: string, n: number) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n)}…`;
}

export default async function AdminContactConversionsPage() {
  const now = new Date();
  const start7 = new Date(now.getTime() - 7 * MS_DAY);
  const start30 = new Date(now.getTime() - 30 * MS_DAY);

  const [total, last7, last30, leads] = await Promise.all([
    prisma.contactLead.count(),
    prisma.contactLead.count({ where: { createdAt: { gte: start7 } } }),
    prisma.contactLead.count({ where: { createdAt: { gte: start30 } } }),
    prisma.contactLead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display mb-1 text-2xl font-light tracking-tight text-text-primary">
        Contact conversions
      </h1>
      <p className="mb-8 max-w-xl text-sm text-text-secondary">
        Leads are saved when the notification email sends successfully. GA4 also receives{" "}
        <code className="font-mono text-xs text-text-tertiary">generate_lead</code> — use both for a full
        picture.
      </p>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Last 7 days", value: last7, sub: "submissions" },
          { label: "Last 30 days", value: last30, sub: "submissions" },
          { label: "All time", value: total, sub: "in this database" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-surface-2/80 px-5 py-4 shadow-[0_0_0_1px_rgba(201,165,90,0.06)_inset]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              {card.label}
            </p>
            <p className="mt-1 font-mono text-3xl font-light tabular-nums text-accent">{card.value}</p>
            <p className="mt-0.5 text-xs text-text-tertiary">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Recent leads (up to 100)
          </h2>
        </div>
        {leads.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-text-secondary">
            No submissions yet. They appear here after a successful contact form post.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-4 py-2.5 font-medium">When</th>
                  <th className="px-4 py-2.5 font-medium">Name / email</th>
                  <th className="px-4 py-2.5 font-medium">Project · budget</th>
                  <th className="px-4 py-2.5 font-medium">Page · UTM</th>
                  <th className="px-4 py-2.5 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const utm =
                    [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" · ") ||
                    "—";
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-border/80 align-top last:border-0 hover:bg-surface-2/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-tertiary">
                        {formatWhen(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        <div className="font-medium">{lead.name}</div>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-xs text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                        >
                          {lead.email}
                        </a>
                        {lead.company ? (
                          <div className="mt-0.5 text-xs text-text-secondary">{lead.company}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        {lead.project || "—"}
                        {lead.budget ? (
                          <>
                            <br />
                            <span className="text-text-tertiary">{lead.budget}</span>
                          </>
                        ) : null}
                      </td>
                      <td className="max-w-[220px] px-4 py-3 text-xs text-text-tertiary">
                        {lead.pageUrl ? (
                          <div className="truncate font-mono text-[10px]" title={lead.pageUrl}>
                            {lead.pageUrl}
                          </div>
                        ) : null}
                        <div className="mt-0.5" title={utm}>
                          {utm}
                        </div>
                        {lead.referrer ? (
                          <div className="mt-1 truncate text-[10px]" title={lead.referrer}>
                            ref: {lead.referrer}
                          </div>
                        ) : null}
                      </td>
                      <td className="max-w-[280px] px-4 py-3 text-xs text-text-secondary">
                        {snippet(lead.message, 140)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
