import CreateIndustryForm from "./CreateIndustryForm";

export const metadata = { title: "Admin — New industry" };

export default function AdminNewIndustryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">New industry page</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Creates a row in the database and a public page at <code className="font-mono text-xs">/industries/[slug]</code>.
      </p>
      <CreateIndustryForm />
    </div>
  );
}
