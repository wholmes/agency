export interface AvailabilityStatus {
  available: boolean;
  label: string;       // e.g. "1 project slot open for Q3 2026"
  nextOpen?: string;   // e.g. "September 2026"
}

/* Edit this to reflect real studio availability — redeploy to update */
export const availability: AvailabilityStatus = {
  available: true,
  label: "1 project slot open for Q3 2026",
  nextOpen: "September 2026",
};
