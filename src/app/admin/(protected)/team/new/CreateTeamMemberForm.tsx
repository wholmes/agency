"use client";

import { useActionState } from "react";
import { createTeamMember } from "@/lib/admin/mutations-data";
import AdminToggle from "@/components/admin/AdminToggle";
import PhotoUpload from "@/components/admin/PhotoUpload";

export default function CreateTeamMemberForm() {
  const [state, action, pending] = useActionState(createTeamMember, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required className="form-input" placeholder="e.g. Whittfield Holmes" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="role">Role</label>
        <input id="role" name="role" type="text" required className="form-input" placeholder="e.g. Founder & Creative Director" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="philosophy">Philosophy / tagline</label>
        <input id="philosophy" name="philosophy" type="text" className="form-input" placeholder="One sentence that captures their view of the work" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" rows={3} className="form-input" placeholder="2–3 sentences about this person" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="skills">Skills</label>
        <input id="skills" name="skills" type="text" className="form-input" placeholder="Comma-separated e.g. Brand Strategy, Next.js, Motion Design" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="brandCodeBalance">
          Brand / Code balance — <span className="text-accent">Brand %</span>
        </label>
        <input id="brandCodeBalance" name="brandCodeBalance" type="number" min="0" max="100" defaultValue={50} className="form-input w-24" />
        <p className="mt-1 text-xs text-text-tertiary">0 = pure code, 100 = pure brand. 50 = equal split.</p>
      </div>

      <div className="form-field">
        <label className="form-label">Headshot</label>
        <PhotoUpload />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="capabilities">Radar chart capabilities</label>
        <textarea id="capabilities" name="capabilities" rows={4} className="form-input font-mono text-xs" placeholder="Brand Strategy:92, Motion Design:78, React:88, UX Design:85, TypeScript:80" />
        <p className="mt-1 text-xs text-text-tertiary">Comma-separated as Name:Value (0–100). Use 5–8 items for best results.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <AdminToggle id="featured" name="featured" label="Featured" description="Full-width card in team section" />
        <AdminToggle id="published" name="published" label="Published" description="Visible on the site" defaultChecked />
        <AdminToggle id="showPhilosophy" name="showPhilosophy" label="Show tagline" description="Philosophy / quote line" defaultChecked />
        <AdminToggle id="showBio" name="showBio" label="Show bio" description="Full biography paragraph" defaultChecked />
        <AdminToggle id="showTags" name="showTags" label="Show skills" description="Skills pill tags" defaultChecked />
        <AdminToggle id="showBalance" name="showBalance" label="Show balance bar" description="Brand / Code percentage bar" defaultChecked />
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary w-fit">
        {pending ? "Creating…" : "Create member"}
      </button>
    </form>
  );
}
