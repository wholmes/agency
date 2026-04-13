export interface Project {
  id: string;
  title: string;
  category: string;
  /** One line for homepage cards: industry, buyer, metric, or constraint — proof of fit */
  proofFit: string;
  year: string;
  result: string;
  resultDetail: string;
  problem: string;
  approach: string;
  outcome: string;
  color: string;
  accent: string;
  services: string[];
}

export { getProject, getProjects } from "@/lib/cms/queries";
