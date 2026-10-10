export const site = {
  name: "Anoka Advisors",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://anokaadvisors.com").replace(/\/+$/, ""),
  email: "info@anokaadvisors.com",
  description:
    "Anoka Advisors is a US consulting firm for healthcare, telehealth and pharmacy operations. We help practices, virtual care programs and pharmacies fix the workflows behind patient access, prescriptions and compliance.",
  // Used for dates shown in the admin area.
  timeZone: process.env.BUSINESS_TIME_ZONE || "America/Chicago",
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/disclaimer", label: "Professional disclaimer" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
