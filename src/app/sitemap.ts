import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { services } from "@/content/services";
import { CONTENT_UPDATED } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { PhotoKey } from "@/components/site/photo";
import { photoSrc } from "@/lib/photos";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  image?: PhotoKey;
  lastModified?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly", image: "home-hero-1" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly", image: "services-hero" },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
      image: service.images.hero,
    })),
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly", image: "pr-hero" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly", image: "insights-hero" },
    ...insights.map((insight) => ({
      path: `/insights/${insight.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      image: insight.image,
      lastModified: insight.updated,
    })),
    { path: "/book", priority: 0.8, changeFrequency: "monthly", image: "bk-hero" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly", image: "ab-hero" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly", image: "ct-hero" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.2, changeFrequency: "yearly" },
    { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" },
  ];

  return pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.lastModified ?? CONTENT_UPDATED,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...(page.image ? { images: [absoluteUrl(photoSrc(page.image))] } : {}),
  }));
}
