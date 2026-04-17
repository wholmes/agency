import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
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
        <AdminToggle
          id="availabilityAvailable"
          name="availabilityAvailable"
          label="Show as available"
          description="Displays the green availability dot in the nav"
          defaultChecked={s.availabilityAvailable}
        />
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
        <div className="border-t border-border pt-5">
          <p className="form-label mb-3 text-text-tertiary">Navigation</p>
          <AdminToggle
            id="navHideOnScroll"
            name="navHideOnScroll"
            label="Hide nav on scroll"
            description="Hides on scroll down, reveals on scroll up"
            defaultChecked={s.navHideOnScroll}
          />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
    </div>
  );
}
