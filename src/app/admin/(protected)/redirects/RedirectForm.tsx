import AdminSaveForm from "@/components/admin/AdminSaveForm";

interface DefaultValues {
  source?: string;
  destination?: string;
  permanent?: boolean;
  enabled?: boolean;
  note?: string;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

export default function RedirectForm({ action, defaultValues, submitLabel = "Save redirect" }: Props) {
  return (
    <AdminSaveForm action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Source */}
        <div className="form-field sm:col-span-2">
          <label className="form-label" htmlFor="source">
            Source path <span className="text-error">*</span>
          </label>
          <input
            id="source"
            name="source"
            type="text"
            required
            defaultValue={defaultValues?.source}
            placeholder="/old-page  or  /old-section/*"
            className="form-input font-mono text-sm"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Must start with <span className="font-mono">/</span>. Append{" "}
            <span className="font-mono">/*</span> to match any path under a prefix.
          </p>
        </div>

        {/* Destination */}
        <div className="form-field sm:col-span-2">
          <label className="form-label" htmlFor="destination">
            Destination <span className="text-error">*</span>
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            required
            defaultValue={defaultValues?.destination}
            placeholder="/new-page  or  https://example.com  or  /new-section/*"
            className="form-input font-mono text-sm"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Relative path or absolute URL. Use{" "}
            <span className="font-mono">*</span> to forward a wildcard suffix captured
            from the source.
          </p>
        </div>

        {/* Type */}
        <div className="form-field">
          <label className="form-label" htmlFor="type-select">
            Redirect type
          </label>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="permanent"
                value="off"
                defaultChecked={!defaultValues?.permanent}
                className="mt-0.5 accent-accent"
              />
              <span>
                <span className="text-sm font-medium text-text-primary">
                  307 Temporary
                </span>
                <span className="mt-0.5 block text-xs text-text-tertiary">
                  Browsers don&apos;t cache. Use while content is still in flux.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="permanent"
                value="on"
                defaultChecked={defaultValues?.permanent === true}
                className="mt-0.5 accent-accent"
              />
              <span>
                <span className="text-sm font-medium text-text-primary">
                  308 Permanent
                </span>
                <span className="mt-0.5 block text-xs text-text-tertiary">
                  Browsers and search engines cache indefinitely. Use when the
                  old URL will never return.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Status */}
        <div className="form-field">
          <label className="form-label">Status</label>
          <div className="flex items-center gap-3 pt-1">
            <input
              id="enabled"
              name="enabled"
              type="checkbox"
              defaultChecked={defaultValues?.enabled ?? true}
              className="size-4 rounded border-border accent-accent"
            />
            <label htmlFor="enabled" className="text-sm text-text-primary cursor-pointer">
              Active — rule is applied on every request
            </label>
          </div>
        </div>

        {/* Note */}
        <div className="form-field sm:col-span-2">
          <label className="form-label" htmlFor="note">
            Internal note <span className="text-text-tertiary font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="note"
            name="note"
            type="text"
            defaultValue={defaultValues?.note}
            placeholder="e.g. Legacy product page — retired Q1 2025"
            className="form-input"
          />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </AdminSaveForm>
  );
}
