import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/cms/queries";
import BlogThemeToggle from "@/components/blog/BlogThemeToggle";
import BlogListingClient from "./BlogListingClient";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Perspectives on brand strategy, web development, and building digital products that last. Insights from the BrandMeetsCode team.",
  alternates: { canonical: "https://brandmeetscode.com/blog" },
  openGraph: {
    title: "Journal — BrandMeetsCode",
    description:
      "Perspectives on brand strategy, web development, and building digital products that last.",
    url: "https://brandmeetscode.com/blog",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <section
        className="pt-[calc(var(--nav-height)+4rem)] pb-16"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="container">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-overline mb-4">Journal</p>
              <h1 className="text-h1 max-w-lg">
                Perspectives &amp;{" "}
                <em className="italic-display">Insights</em>
              </h1>
              <p
                className="mt-5 max-w-md text-body-lg"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Brand strategy, web development, and the craft of building
                digital products that endure.
              </p>
            </div>
            <div className="shrink-0 pb-1">
              <BlogThemeToggle />
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section">
          <div className="container">
            <p
              className="text-center text-body"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              New articles coming soon.
            </p>
          </div>
        </section>
      ) : (
        <BlogListingClient featured={featured} rest={rest} />
      )}

      {/* ── Bottom rule ────────────────────────────────────────────────────── */}
      <div
        className="py-16 text-center"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <p
          className="mb-3 font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          BrandMeetsCode Journal
        </p>
        <Link href="/" className="text-overline">
          ← Back to main site
        </Link>
      </div>
    </>
  );
}
