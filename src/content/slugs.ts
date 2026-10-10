// URL slugs for content pages, kept free of React imports so the proxy can load them cheaply.
// The type checks in services.ts and insights/index.ts make sure these lists match the content.

export const SERVICE_SLUGS = [
  "healthcare-operations-consulting",
  "telehealth-consulting",
  "pharmacy-operations-consulting",
] as const;

export const INSIGHT_SLUGS = [
  "reduce-patient-no-shows",
  "choose-telehealth-platform",
  "pharmacy-workflow-optimization",
  "patient-access-metrics",
  "telehealth-workflow-design",
  "pharmacy-inspection-readiness",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type InsightSlug = (typeof INSIGHT_SLUGS)[number];
