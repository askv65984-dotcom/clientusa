import type { ComponentType } from "react";
import type { PhotoKey } from "@/components/site/photo";
import type { InsightSlug, ServiceSlug } from "../slugs";

export type InsightCategory = "Healthcare operations" | "Telehealth" | "Pharmacy operations";

export type Insight = {
  slug: InsightSlug;
  /** Headline shown on the page (H1). */
  title: string;
  /** Short label for navigation lists such as the footer. */
  shortTitle: string;
  /** Search title, 60 characters or fewer, used without the brand suffix. */
  metaTitle: string;
  /** Meta description, 120 to 160 characters. */
  description: string;
  category: InsightCategory;
  /** The service page this article supports, for internal links and schema. */
  serviceSlug: ServiceSlug;
  image: PhotoKey;
  published: string;
  updated: string;
  readMinutes: number;
  keyTakeaways: string[];
  /** Table of contents. Ids must match the h2 ids in the body. */
  toc: { id: string; title: string }[];
  faqs: { question: string; answer: string }[];
  tags: string[];
  Body: ComponentType;
};
