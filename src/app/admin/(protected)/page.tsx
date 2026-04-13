import Link from "next/link";

const sections: {
  heading: string;
  cards: { title: string; description: string; href: string }[];
}[] = [
  {
    heading: "Site-wide",
    cards: [
      {
        title: "Site & availability",
        description: "Contact email, availability strip in the nav.",
        href: "/admin/settings",
      },
      {
        title: "Footer",
        description: "Tagline and remote blurb.",
        href: "/admin/footer",
      },
      {
        title: "Nav & footer links",
        description: "JSON for navigation, footer columns, and utility links.",
        href: "/admin/chrome",
      },
    ],
  },
  {
    heading: "Homepage",
    cards: [
      {
        title: "Home hero",
        description: "Homepage hero headlines and CTAs.",
        href: "/admin/home-hero",
      },
      {
        title: "CTA section",
        description: "Global “Ready to start?” block copy.",
        href: "/admin/cta",
      },
      {
        title: "Social proof",
        description: "Featured testimonial, stats, and client strip.",
        href: "/admin/social",
      },
      {
        title: "Home about teaser",
        description: "Homepage “Difference” column, belief chips, and teaser card.",
        href: "/admin/home-teaser",
      },
    ],
  },
  {
    heading: "Work",
    cards: [
      {
        title: "Work page",
        description: "/work hero, preview strip, and case study UI labels.",
        href: "/admin/work",
      },
      {
        title: "Case studies",
        description: "Edit project case study content.",
        href: "/admin/projects",
      },
    ],
  },
  {
    heading: "Services",
    cards: [
      {
        title: "Services hub",
        description: "/services hero, home strip, continuity, estimator.",
        href: "/admin/services",
      },
      {
        title: "Offerings",
        description: "Service cards for home and listing.",
        href: "/admin/offerings",
      },
      {
        title: "Service detail pages",
        description: "Long-form /services/[slug] content.",
        href: "/admin/service-pages",
      },
    ],
  },
  {
    heading: "Company",
    cards: [
      {
        title: "Industries",
        description: "Vertical pages (/industries/[slug]) — list & detail copy.",
        href: "/admin/industries",
      },
      {
        title: "About page",
        description: "Hero, story, and values on /about.",
        href: "/admin/about",
      },
      {
        title: "Contact",
        description: "Hero copy, next steps, Calendly, and form JSON.",
        href: "/admin/contact",
      },
    ],
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display mb-2 text-3xl font-light tracking-tight">Overview</h1>
      <p className="mb-10 max-w-lg text-sm text-text-secondary">
        Changes save to the database and appear on the public site after you submit each form.
      </p>
      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={`section-${section.heading.replace(/\s+/g, "-")}`}>
            <h2
              id={`section-${section.heading.replace(/\s+/g, "-")}`}
              className="mb-4 border-b border-border pb-2 font-display text-sm font-normal uppercase tracking-wider text-text-tertiary"
            >
              {section.heading}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="block h-full rounded-lg border border-border bg-surface p-6 no-underline transition-colors hover:border-accent-muted"
                  >
                    <h3 className="font-display mb-2 text-lg font-normal text-text-primary">{c.title}</h3>
                    <p className="text-sm text-text-secondary">{c.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
