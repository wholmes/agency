import WorkPageClient from "./WorkPageClient";
import { getCtaSectionCopy, getProjects, getWorkPageHero } from "@/lib/cms/queries";
import { isAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [projects, workHero, ctaCopy, isAdmin] = await Promise.all([
    getProjects(),
    getWorkPageHero(),
    getCtaSectionCopy(),
    isAdminSession(),
  ]);

  return <WorkPageClient projects={projects} workHero={workHero} ctaCopy={ctaCopy} isAdmin={isAdmin} />;
}
