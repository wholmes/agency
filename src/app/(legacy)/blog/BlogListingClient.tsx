"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPostData } from "@/lib/cms/queries";

interface Props {
  featured: BlogPostData | null;
  rest: BlogPostData[];
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function BlogListingClient({ featured, rest }: Props) {
  return (
    <>
      {/* ── Featured post ──────────────────────────────────────────────────── */}
      {featured && (
        <section className="py-16" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <motion.article
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
                className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center"
              >
                {/* Cover image */}
                {featured.coverImage ? (
                  <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div
                    className="relative overflow-hidden rounded-lg aspect-[16/9] flex items-center justify-center"
                    style={{ background: "var(--color-surface-2)" }}
                  >
                    <span
                      className="font-display text-[8rem] leading-none font-light select-none"
                      style={{ color: "var(--color-border)", opacity: 0.6 }}
                      aria-hidden
                    >
                      {featured.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div>
                  {featured.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-overline">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2
                    className="font-display font-light tracking-tight transition-colors duration-300 group-hover:text-accent"
                    style={{ fontSize: "var(--text-4xl)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
                  >
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="mt-5 text-body-lg line-clamp-3">{featured.excerpt}</p>
                  )}

                  <div
                    className="mt-6 flex items-center gap-4 font-mono text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {featured.author && (
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {featured.author}
                      </span>
                    )}
                    {featured.publishedAt && (
                      <>
                        <span>·</span>
                        <time dateTime={new Date(featured.publishedAt).toISOString()}>
                          {formatDate(featured.publishedAt)}
                        </time>
                      </>
                    )}
                    {featured.readingTime > 0 && (
                      <>
                        <span>·</span>
                        <span>{featured.readingTime} min read</span>
                      </>
                    )}
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-overline transition-colors duration-300 group-hover:text-accent">
                    Read article
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      {/* ── Rest of posts grid ─────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="section">
          <div className="container">
            {rest.length >= 3 && (
              <p
                className="mb-12 font-mono text-xs uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                All articles
              </p>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={i}
                  variants={fadeUp}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function PostCard({ post }: { post: BlogPostData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article>
        {/* Cover */}
        <div
          className="overflow-hidden rounded-lg aspect-[3/2] mb-5"
          style={{ background: "var(--color-surface-2)" }}
        >
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span
                className="font-display text-6xl font-light select-none"
                style={{ color: "var(--color-border)" }}
                aria-hidden
              >
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-overline text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className="font-display font-light tracking-tight transition-colors duration-300 group-hover:text-accent"
          style={{ fontSize: "var(--text-xl)", lineHeight: 1.2, letterSpacing: "-0.02em" }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="mt-2 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div
          className="mt-4 flex items-center gap-3 font-mono text-[11px]"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {post.publishedAt && (
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          {post.readingTime > 0 && (
            <>
              {post.publishedAt && <span>·</span>}
              <span>{post.readingTime} min</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
