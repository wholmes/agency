import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPostSlugs, getBlogPosts } from "@/lib/cms/queries";
import BlogThemeToggle from "@/components/blog/BlogThemeToggle";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ArticleBody from "@/components/blog/ArticleBody";
import ArticleHeroClient from "./ArticleHeroClient";

const SITE_URL = "https://brandmeetscode.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription || post.excerpt || `Read "${post.title}" on the BrandMeetsCode Journal.`;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts().catch(() => []),
  ]);

  if (!post) notFound();

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)) || true)
    .slice(0, 3);

  const articleUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <>
      <ReadingProgress />

      {/* ── Article header ─────────────────────────────────────────────────── */}
      <ArticleHeroClient post={post} />

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {post.body ? (
              <ArticleBody body={post.body} />
            ) : (
              <p style={{ color: "var(--color-text-tertiary)" }}>
                Content coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Tags ─────────────────────────────────────────────────────────── */}
      {post.tags.length > 0 && (
        <section
          className="py-10"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <div className="container">
            <div className="mx-auto max-w-2xl flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Share + nav ──────────────────────────────────────────────────── */}
      <section
        className="py-10"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl flex items-center justify-between gap-4 flex-wrap">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-overline transition-opacity hover:opacity-70"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              All articles
            </Link>

            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Theme
              </span>
              <BlogThemeToggle />
            </div>
          </div>
        </div>
      </section>

      {/* ── Related articles ─────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section
          className="py-20"
          style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
        >
          <div className="container">
            <p className="text-overline mb-10">More from the Journal</p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                  <article>
                    <div
                      className="overflow-hidden rounded-lg aspect-[3/2] mb-4"
                      style={{ background: "var(--color-surface-2)" }}
                    >
                      {rp.coverImage ? (
                        <img
                          src={rp.coverImage}
                          alt={rp.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span
                            className="font-display text-5xl font-light select-none"
                            style={{ color: "var(--color-border)" }}
                            aria-hidden
                          >
                            {rp.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3
                      className="font-display font-light tracking-tight transition-colors duration-300 group-hover:text-accent"
                      style={{ fontSize: "var(--text-lg)", lineHeight: 1.25, letterSpacing: "-0.02em" }}
                    >
                      {rp.title}
                    </h3>
                    {rp.publishedAt && (
                      <p
                        className="mt-2 font-mono text-[11px]"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {formatDate(rp.publishedAt)}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── JSON-LD ───────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            url: articleUrl,
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt?.toISOString(),
            author: post.author
              ? {
                  "@type": "Person",
                  name: post.author,
                  jobTitle: post.authorTitle || undefined,
                }
              : {
                  "@type": "Organization",
                  name: "BrandMeetsCode",
                  url: SITE_URL,
                },
            publisher: {
              "@type": "Organization",
              name: "BrandMeetsCode",
              url: SITE_URL,
            },
            image: post.coverImage || undefined,
            keywords: post.tags.join(", ") || undefined,
          }),
        }}
      />
    </>
  );
}
