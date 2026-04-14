export type EstimatorProjectType = { id: string; label: string; base: number };
export type EstimatorPageCount = { id: string; label: string; multiplier: number };
export type EstimatorIntegration = { id: string; label: string; cost: number };
export type EstimatorTimeline = { id: string; label: string; rush: number };
export type EstimatorStepTitles = {
  type: string;
  pages: string;
  integrations: string;
  integrationsSub: string;
  timeline: string;
  continueLabel: string;
  startOver: string;
  ctaStartProject: string;
  estimateTagline: string;
};

export type ScopeEstimatorData = {
  sectionOverline: string;
  headingLine1: string;
  headingLine2Italic: string;
  body: string;
  projectTypes: EstimatorProjectType[];
  pageCounts: EstimatorPageCount[];
  integrations: EstimatorIntegration[];
  timelines: EstimatorTimeline[];
  weeksByTimelineId: Record<string, string>;
  stepTitles: EstimatorStepTitles;
  integrationsHint: string;
  resultOverline: string;
  resultDisclaimer: string;
  stepTemplate: string;
  /** Multiplier on (base + integrations) × page mult × timeline rush — low end */
  rangeLowMultiplier: number;
  /** High end of range */
  rangeHighMultiplier: number;
  /** Round estimates to nearest N dollars (e.g. 1000) */
  roundingIncrement: number;
};
