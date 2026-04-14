import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "../mutations";

export const metadata = { title: "Admin — Site settings" };

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Site &amp; availability</h1>
      <AdminSaveForm action={updateSiteSettings} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="contactEmail">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={s.contactEmail}
            className="form-input"
          />
        </div>
        <div className="form-field flex items-center gap-3">
          <input
            id="availabilityAvailable"
            name="availabilityAvailable"
            type="checkbox"
            defaultChecked={s.availabilityAvailable}
            className="size-4 rounded border-border accent-accent"
          />
          <label htmlFor="availabilityAvailable" className="text-sm text-text-primary">
            Show as available (green dot)
          </label>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="availabilityLabel">
            Availability label
          </label>
          <input
            id="availabilityLabel"
            name="availabilityLabel"
            type="text"
            required
            defaultValue={s.availabilityLabel}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="availabilityNextOpen">
            Next opening (when not available)
          </label>
          <input
            id="availabilityNextOpen"
            name="availabilityNextOpen"
            type="text"
            defaultValue={s.availabilityNextOpen ?? ""}
            placeholder="e.g. September 2026"
            className="form-input"
          />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
    </div>
  );
}
