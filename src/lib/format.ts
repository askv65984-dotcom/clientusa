import { site } from "./site";
import type { Billing } from "./types";

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export const billingLabels: Record<Billing, string> = {
  one_time: "One-time fee",
  monthly: "Billed monthly",
  custom: "Quoted per project",
};

export function priceDisplay(billing: Billing, priceCents: number | null) {
  if (billing === "custom" || priceCents == null) return { amount: "Custom", unit: "Quoted after a call" };
  if (billing === "monthly") return { amount: formatUsd(priceCents), unit: "per month" };
  return { amount: formatUsd(priceCents), unit: "one-time fee" };
}

/** Formats a US phone number for a tel: link. */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: site.timeZone,
  }).format(new Date(iso));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
