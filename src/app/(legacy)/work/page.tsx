import WorkPageClient from "./WorkPageClient";
import { getProjects, getWorkPageHero } from "@/lib/cms/queries";
import { isAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [projects, workHero, isAdmin] = await Promise.all([
    getProjects(),
    getWorkPageHero(),
    isAdminSession(),
  ]);

  return <WorkPageClient projects={projects} workHero={workHero} isAdmin={isAdmin} />;
}
