export interface Project {
  id: string;
  title: string;
  category: string;
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

export const projects: Project[] = [
  {
    id: "meridian",
    title: "Meridian SaaS",
    category: "Web Design & Development",
    year: "2025",
    result: "+40% demo requests in 30 days",
    resultDetail: "3.1s avg → 0.8s load time. Lighthouse 96.",
    problem:
      "Meridian's existing site was built during fundraising and optimized for investors, not buyers. Demo conversion rate was 1.2% — well below their market benchmark of 3–4%. The site had seven competing CTAs above the fold, none of which were for demos.",
    approach:
      "Complete information architecture rethink, new messaging hierarchy, and a full rebuild in Next.js with an edge CDN. Added a qualification flow to the demo request form to improve lead quality alongside volume. Removed five of the seven CTAs.",
    outcome:
      "Demo conversion rate moved from 1.2% to 2.8% within 30 days. Load time dropped from 3.1s to 0.8s. The qualification flow reduced unqualified demo requests by 60%, meaning sales was spending time on better-fit leads.",
    color: "#1A2A1A",
    accent: "#4DAF7C",
    services: ["Web Design", "Web Development", "SEO"],
  },
  {
    id: "arclight",
    title: "Arclight Labs",
    category: "Brand Strategy + Web Design & Development",
    year: "2025",
    result: "Series A secured 60 days post-launch",
    resultDetail: "Raised $8M. Cited brand clarity as a key differentiator in term sheet.",
    problem:
      "Pre-launch deeptech startup entering a crowded enterprise AI market. Founders were scientists, not marketers — they needed positioning that was honest about the technology without being incomprehensible to non-technical buyers.",
    approach:
      "8-week brand strategy engagement before design began. Developed a 'precision over promise' positioning that acknowledged the technology's current limitations honestly — which became their competitive advantage in a market of overpromising vendors.",
    outcome:
      "Raised an $8M Series A 60 days after launch. The lead investor cited brand clarity specifically in their term sheet. Three enterprise pilots converted to contracts within the first quarter.",
    color: "#1A1A2A",
    accent: "#6B8CE8",
    services: ["Brand Strategy", "Web Design", "Web Development"],
  },
  {
    id: "sable",
    title: "Sable Studio",
    category: "Analytics Integration",
    year: "2024",
    result: "3× faster reporting cycle",
    resultDetail: "From 6 hours/week to 2 hours. 100% of KPIs now in one dashboard.",
    problem:
      "Creative studio with 12 team members was spending 6+ hours per week pulling numbers from three different platforms into a spreadsheet. Leadership made pricing decisions based on data that was always 3 weeks old.",
    approach:
      "Consolidated tracking into GA4 + Looker Studio. Built a single dashboard covering project profitability, time tracking efficiency, and client acquisition by channel. Automated a weekly email digest to leadership.",
    outcome:
      "Weekly reporting time dropped from 6 hours to 2 hours. Leadership now reviews a live dashboard instead of a stale spreadsheet. Sable used the profitability data to reprice their retainer packages within 60 days, increasing average retainer value by 22%.",
    color: "#2A1A18",
    accent: "#E88B6B",
    services: ["Analytics Integration"],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
