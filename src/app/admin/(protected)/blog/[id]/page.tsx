import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
import BlogBodyImageInsert from "@/components/admin/BlogBodyImageInsert";
import BlogCoverImageField from "@/components/admin/BlogCoverImageField";
import { updateBlogPost, deleteBlogPost } from "../mutations";
import DeleteBlogPostButton from "./DeleteBlogPostButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } });
  return { title: post ? `Admin — ${post.title}` : "Admin — Article" };
}

function tagsToDisplay(raw: string): string {
  try {
    const v = JSON.parse(raw) as unknown;
    if (Array.isArray(v)) return v.join(", ");
  } catch { /* fall through */ }
  return raw;
}

export default async function AdminEditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const updateWithId = updateBlogPost.bind(null, id);
  const deleteWithId = deleteBlogPost.bind(null, id);

  const tagsDisplay = tagsToDisplay(post.tags);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs text-text-tertiary">/{post.slug}</p>
            {post.status === "draft" && (
              <span className="rounded-full border border-yellow-700/50 bg-yellow-950/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-yellow-400">
                Draft
              </span>
            )}
            {post.status === "published" && (
              <span className="rounded-full border border-green-700/50 bg-green-950/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
                Published
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-xs text-text-tertiary no-underline hover:text-accent transition-colors"
          >
            {post.status === "published" ? "View ↗" : "Preview ↗"}
          </Link>
          <Link
            href="/admin/blog"
            className="text-sm text-text-tertiary no-underline hover:text-text-secondary"
          >
            ← All articles
          </Link>
        </div>
      </div>

      <AdminSaveForm action={updateWithId} className="flex flex-col gap-5">
        {/* Core content */}
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Content
          </legend>

          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={post.slug}
              pattern="[a-z0-9\-]*"
              className="form-input font-mono text-sm"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Changing the slug will break existing links.
            </p>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="body">
              Body (Markdown)
            </label>
            <textarea
              id="body"
              name="body"
              rows={24}
              defaultValue={post.body}
              className="form-input font-mono text-sm"
              spellCheck
            />
            <p className="text-xs text-text-tertiary mt-1">
              Reading time is auto-calculated on save (~200 wpm).
            </p>
            <div className="mt-3">
              <BlogBodyImageInsert />
            </div>
          </div>
        </fieldset>

        {/* Author */}
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Author
          </legend>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="form-field">
              <label className="form-label" htmlFor="author">
                Name
              </label>
              <input
                id="author"
                name="author"
                type="text"
                defaultValue={post.author}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="authorTitle">
                Title / role
              </label>
              <input
                id="authorTitle"
                name="authorTitle"
                type="text"
                defaultValue={post.authorTitle}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        {/* Media + taxonomy */}
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Media &amp; taxonomy
          </legend>

          <BlogCoverImageField defaultValue={post.coverImage} />

          <div className="form-field">
            <label className="form-label" htmlFor="tags">
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={tagsDisplay}
              placeholder="Design, Strategy, Development"
              className="form-input"
            />
            <p className="text-xs text-text-tertiary mt-1">Comma-separated.</p>
          </div>
        </fieldset>

        {/* SEO */}
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            SEO
          </legend>

          <div className="form-field">
            <label className="form-label" htmlFor="metaTitle">
              Meta title
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              defaultValue={post.metaTitle}
              placeholder="Defaults to article title"
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="metaDescription">
              Meta description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              defaultValue={post.metaDescription}
              placeholder="Defaults to excerpt. Aim for 150–160 characters."
              className="form-input"
            />
          </div>
        </fieldset>

        {/* Status + flags */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Publishing
          </legend>

          <div className="form-field">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={post.status}
              className="form-input"
            >
              <option value="draft">Draft — not visible on site</option>
              <option value="published">Published — visible on site</option>
            </select>
          </div>

          <AdminToggle id="featured" name="featured" label="Featured" description="Shown prominently at the top of the blog" defaultChecked={post.featured} />
        </fieldset>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </AdminSaveForm>

      {/* Danger zone */}
      <div
        className="mt-12 rounded-lg border border-dashed p-6"
        style={{ borderColor: "var(--color-error)", opacity: 0.6 }}
      >
        <h2 className="mb-1 font-mono text-[11px] uppercase tracking-widest text-error">
          Danger zone
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">
          Permanently delete this article. This cannot be undone.
        </p>
        <DeleteBlogPostButton action={deleteWithId} title={post.title} />
      </div>
    </div>
  );
}
