import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
import BlogBodyImageInsert from "@/components/admin/BlogBodyImageInsert";
import BlogCoverImageField from "@/components/admin/BlogCoverImageField";
import { createBlogPost } from "../mutations";

export const metadata = { title: "Admin — New article" };

export default function AdminNewBlogPostPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">New article</h1>
          <p className="text-xs text-text-tertiary">
            Leave slug blank to auto-generate from title.
          </p>
        </div>
        <Link
          href="/admin/blog"
          className="text-sm text-text-tertiary no-underline hover:text-text-secondary"
        >
          ← All articles
        </Link>
      </div>

      <BlogPostForm action={createBlogPost} />
    </div>
  );
}

function BlogPostForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    coverImage?: string;
    author?: string;
    authorTitle?: string;
    tags?: string;
    metaTitle?: string;
    metaDescription?: string;
    status?: string;
    featured?: boolean;
  };
}) {
  return (
    <AdminSaveForm action={action} className="flex flex-col gap-5">
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
            defaultValue={defaultValues?.title}
            placeholder="Your article title"
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
            defaultValue={defaultValues?.slug}
            placeholder="auto-generated-from-title"
            pattern="[a-z0-9\-]*"
            className="form-input font-mono text-sm"
          />
          <p className="text-xs text-text-tertiary mt-1">
            Lowercase letters, numbers, and hyphens only.
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
            defaultValue={defaultValues?.excerpt}
            placeholder="A short summary shown on the listing page and in meta descriptions…"
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
            rows={20}
            defaultValue={defaultValues?.body}
            placeholder={`# Introduction\n\nYour article content here. Supports **Markdown**.\n\n## Section heading\n\n...`}
            className="form-input font-mono text-sm"
            spellCheck
          />
          <p className="text-xs text-text-tertiary mt-1">
            Supports standard Markdown: headings (#), bold (**), italic (*), links, lists,
            blockquotes (&gt;), code blocks (```).
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
              defaultValue={defaultValues?.author}
              placeholder="Jane Smith"
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
              defaultValue={defaultValues?.authorTitle}
              placeholder="Creative Director"
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

        <BlogCoverImageField defaultValue={defaultValues?.coverImage ?? ""} />

        <div className="form-field">
          <label className="form-label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={defaultValues?.tags}
            placeholder="Design, Strategy, Development"
            className="form-input"
          />
          <p className="text-xs text-text-tertiary mt-1">
            Comma-separated list. E.g.{" "}
            <span className="font-mono">Design, Strategy</span>
          </p>
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
            defaultValue={defaultValues?.metaTitle}
            placeholder="Defaults to article title if blank"
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
            defaultValue={defaultValues?.metaDescription}
            placeholder="Defaults to excerpt if blank. Aim for 150–160 characters."
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
            defaultValue={defaultValues?.status ?? "draft"}
            className="form-input"
          >
            <option value="draft">Draft — not visible on site</option>
            <option value="published">Published — visible on site</option>
          </select>
        </div>

          <AdminToggle id="featured" name="featured" label="Featured" description="Shown prominently at the top of the blog" defaultChecked={defaultValues?.featured ?? false} />
      </fieldset>

      <div className="pt-2">
        <button type="submit" className="btn btn-primary">
          Save article
        </button>
      </div>
    </AdminSaveForm>
  );
}

export { BlogPostForm };
