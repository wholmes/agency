import WorkPageClient from "./WorkPageClient";
import { getCtaSectionCopy, getProjects, getWorkPageHero } from "@/lib/cms/queries";

export default async function WorkPage() {
  const [projects, workHero, ctaCopy] = await Promise.all([
    getProjects(),
    getWorkPageHero(),
    getCtaSectionCopy(),
  ]);

  return <WorkPageClient projects={projects} workHero={workHero} ctaCopy={ctaCopy} />;
}
