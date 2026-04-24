"use client";

import { motion } from "framer-motion";
import type { BlogPostData } from "@/lib/cms/queries";

interface Props {
  post: BlogPostData;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default function ArticleHeroClient({ post }: Props) {
  return (
    <section className="pt-[calc(var(--nav-height)+3rem)] pb-12">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {/* Tags / category */}
          {post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex flex-wrap gap-3"
            >
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-overline">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-h1"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-body-lg max-w-2xl"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Author + meta row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-8 flex items-center gap-5 flex-wrap"
            style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}
          >
            {post.author && (
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div
                  className="flex size-10 items-center justify-center rounded-full font-display text-lg font-light"
                  style={{
                    background: "var(--color-accent-subtle)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--color-accent-muted)",
                  }}
                >
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {post.author}
                  </p>
                  {post.authorTitle && (
                    <p
                      className="font-mono text-[11px] uppercase tracking-wide"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      {post.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide"
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
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="container mt-12"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg aspect-[16/7]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover object-top"
              priority-loading="true"
            />
          </div>
        </motion.div>
      )}

      {/* Divider before body */}
      <div className="container mt-12">
        <div className="mx-auto max-w-2xl h-px" style={{ background: "var(--color-border)" }} />
      </div>
      <div className="mt-12" />
    </section>
  );
}
