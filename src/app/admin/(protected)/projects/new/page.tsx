import CreateProjectForm from "./CreateProjectForm";

export const metadata = { title: "Admin — New case study" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">New case study</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Fill in the basics — you can edit every field in detail after creating.
      </p>
      <CreateProjectForm />
    </div>
  );
}
