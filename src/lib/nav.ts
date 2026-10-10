import { insights } from "@/content/insights";
import { services } from "@/content/services";
import type { NavLink } from "@/components/site/site-header";

// The navigation menus get only the few fields they show, so the full content stays on the server.

export const serviceLinks: NavLink[] = services.map((service) => ({
  href: `/services/${service.slug}`,
  label: service.heading,
  description: service.summary,
}));

export const insightLinks: NavLink[] = insights.slice(0, 3).map((insight) => ({
  href: `/insights/${insight.slug}`,
  label: insight.shortTitle,
  description: `${insight.category}, ${insight.readMinutes} min read`,
}));
