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
  /** Card / home preview — 4:3 */
  thumbImage: string;
  /** Work index listing — 3:2 */
  coverImage: string;
  /** Case study detail hero — 16:9 full width (~2200px) */
  heroImage: string;
}

export { getProject, getProjects } from "@/lib/cms/queries";
