import { chooseTelehealthPlatform } from "./choose-telehealth-platform";
import { patientAccessMetrics } from "./patient-access-metrics";
import { pharmacyInspectionReadiness } from "./pharmacy-inspection-readiness";
import { pharmacyWorkflowOptimization } from "./pharmacy-workflow-optimization";
import { reducePatientNoShows } from "./reduce-patient-no-shows";
import { telehealthWorkflowDesign } from "./telehealth-workflow-design";
import { INSIGHT_SLUGS } from "../slugs";
import type { Insight } from "./types";

export type { Insight, InsightCategory } from "./types";

/** All articles, newest first. */
export const insights: Insight[] = [
  reducePatientNoShows,
  chooseTelehealthPlatform,
  pharmacyWorkflowOptimization,
  patientAccessMetrics,
  telehealthWorkflowDesign,
  pharmacyInspectionReadiness,
];

if (insights.length !== INSIGHT_SLUGS.length || !insights.every((insight) => INSIGHT_SLUGS.includes(insight.slug))) {
  throw new Error("INSIGHT_SLUGS in src/content/slugs.ts does not match the insights list.");
}

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}

export function insightsForService(serviceSlug: string) {
  return insights.filter((insight) => insight.serviceSlug === serviceSlug);
}

/** Articles to suggest after this one: same practice area first, then the rest. */
export function relatedInsights(insight: Insight, count = 3) {
  const same = insights.filter((other) => other.slug !== insight.slug && other.category === insight.category);
  const rest = insights.filter((other) => other.slug !== insight.slug && other.category !== insight.category);
  return [...same, ...rest].slice(0, count);
}

export function formatInsightDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
