import Link from "next/link";
import { getAllBlogPostsForAdmin } from "@/lib/cms/queries";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { toggleBlogPostStatus, toggleBlogPostFeatured, deleteBlogPost } from "./mutations";

export const metadata = { title: "Admin — Blog" };

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsForAdmin();
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">Blog</h1>
          <p className="text-sm text-text-secondary">
            {posts.length} {posts.length === 1 ? "article" : "articles"} ·{" "}
            {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            View blog ↗
          </Link>
          <Link href="/admin/blog/new" className="btn btn-primary shrink-0">
            + New article
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div
          className="rounded-lg border border-dashed border-border py-16 text-center"
        >
          <p className="mb-1 text-sm text-text-secondary">No articles yet</p>
          <p className="text-xs text-text-tertiary">
            Create your first article to get started.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => {
            const toggleStatus = toggleBlogPostStatus.bind(null, post.id);
            const toggleFeatured = toggleBlogPostFeatured.bind(null, post.id);
            const deletePost = deleteBlogPost.bind(null, post.id);

            return (
              <li
                key={post.id}
                className={`flex items-start gap-3 rounded-lg border bg-surface px-4 py-3 ${
                  post.status === "published" ? "border-border" : "border-dashed border-border opacity-70"
                }`}
              >
                {/* Title + meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-text-primary truncate">{post.title}</p>
                    {post.status === "draft" && (
                      <span className="shrink-0 rounded-full border border-yellow-700/50 bg-yellow-950/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-yellow-400">
                        Draft
                      </span>
                    )}
                    {post.featured && (
                      <span className="shrink-0 rounded-full border border-accent-muted bg-accent-subtle px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-text-tertiary">
                    /{post.slug}
                    {post.author && <> · {post.author}</>}
                    {post.publishedAt && (
                      <> · {formatDate(post.publishedAt)}</>
                    )}
                    {post.readingTime > 0 && <> · {post.readingTime} min</>}
                  </p>
                  {post.excerpt && (
                    <p className="mt-1 line-clamp-1 text-xs text-text-tertiary">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 flex-wrap">
                  <AdminSaveForm action={toggleFeatured} className="contents" successMessage="Updated">
                    <button
                      type="submit"
                      title={post.featured ? "Unfeature" : "Feature"}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        post.featured
                          ? "border-accent-muted text-accent hover:opacity-70"
                          : "border-border text-text-tertiary hover:border-accent-muted hover:text-accent"
                      }`}
                    >
                      {post.featured ? "★ Featured" : "☆ Feature"}
                    </button>
                  </AdminSaveForm>

                  <AdminSaveForm action={toggleStatus} className="contents" successMessage="Updated">
                    <button
                      type="submit"
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        post.status === "published"
                          ? "border-border text-text-tertiary hover:border-yellow-600/50 hover:text-yellow-400"
                          : "border-green-700/50 text-green-400 hover:bg-green-950/30"
                      }`}
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </AdminSaveForm>

                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="rounded-md border border-border px-3 py-1.5 text-xs text-accent no-underline transition-colors hover:border-accent-muted"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
