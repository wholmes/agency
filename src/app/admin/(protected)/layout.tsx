import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminSession, isDefaultAdminPassword } from "@/lib/admin/session";
import { logoutAction } from "./actions";

const navGroups: { heading: string; items: { href: string; label: string }[] }[] = [
  {
    heading: "Site-wide",
    items: [
      { href: "/admin/settings", label: "Site & availability" },
      { href: "/admin/seo", label: "SEO & Analytics" },
      { href: "/admin/email", label: "Email settings" },
      { href: "/admin/footer", label: "Footer" },
      { href: "/admin/chrome", label: "Nav & footer links" },
    ],
  },
  {
    heading: "Homepage",
    items: [
      { href: "/admin/home-hero", label: "Hero" },
      { href: "/admin/cta", label: "CTA section" },
      { href: "/admin/social", label: "Social proof" },
      { href: "/admin/home-teaser", label: "About teaser" },
    ],
  },
  {
    heading: "Work",
    items: [
      { href: "/admin/work", label: "Work page" },
      { href: "/admin/projects", label: "Case studies" },
    ],
  },
  {
    heading: "Services",
    items: [
      { href: "/admin/services", label: "Services hub" },
      { href: "/admin/offerings", label: "Offerings" },
      { href: "/admin/service-pages", label: "Service detail pages" },
    ],
  },
  {
    heading: "Company",
    items: [
      { href: "/admin/industries", label: "Industries" },
      { href: "/admin/about", label: "About page" },
      { href: "/admin/contact", label: "Contact" },
    ],
  },
];

function NavLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        href="/admin"
        className="mb-3 block rounded-md px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
      >
        Overview
      </Link>
      {navGroups.map((group) => (
        <div key={group.heading} className="mb-5 last:mb-0">
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">{group.heading}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const weakPassword = isDefaultAdminPassword();

  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col">
      {weakPassword && (
        <div role="alert" className="border-b border-yellow-600/40 bg-yellow-950/60 px-4 py-2.5 text-xs text-yellow-300">
          <strong>Security warning:</strong> You're using a weak or default{" "}
          <code className="font-mono">ADMIN_PASSWORD</code>. Set a strong password (16+ random characters) in your{" "}
          environment variables before going to production.
        </div>
      )}
      <div className="flex flex-1">
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-surface md:block">
        <div className="flex min-h-full flex-col p-6">
          <p className="mb-4 font-display text-sm font-normal tracking-tight text-accent">CMS</p>
          <nav aria-label="Admin sections">
            <NavLinks />
          </nav>
          <div className="mt-auto pt-8">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-left text-sm text-text-tertiary transition-colors hover:border-accent-muted hover:text-text-secondary"
              >
                Sign out
              </button>
            </form>
            <Link
              href="/"
              className="mt-3 block px-3 text-xs text-text-tertiary no-underline hover:text-text-secondary"
            >
              ← View site
            </Link>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="max-h-[min(50dvh,24rem)] overflow-y-auto border-b border-border bg-surface px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-sm text-accent">CMS</span>
            <form action={logoutAction}>
              <button type="submit" className="text-xs text-text-tertiary">
                Sign out
              </button>
            </form>
          </div>
          <nav aria-label="Admin sections">
            <NavLinks />
          </nav>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
      </div>
    </div>
  );
}
