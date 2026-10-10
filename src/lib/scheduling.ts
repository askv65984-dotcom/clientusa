export type SchedulingLink =
  | { kind: "calendly"; url: string }
  | { kind: "google-calendar"; url: string }
  | { kind: "google-form"; url: string }
  | { kind: "link"; url: string };

/** Works out how to show the booking link saved in admin settings. */
export function parseSchedulingUrl(raw: string): SchedulingLink | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");
  if (host === "calendly.com") return { kind: "calendly", url: url.toString() };
  if (host === "calendar.app.google" || (host === "calendar.google.com" && url.pathname.includes("/appointments"))) {
    return { kind: "google-calendar", url: url.toString() };
  }
  if (host === "docs.google.com" && url.pathname.startsWith("/forms/")) {
    url.searchParams.set("embedded", "true");
    return { kind: "google-form", url: url.toString() };
  }
  return { kind: "link", url: url.toString() };
}

export function isAllowedSchedulingUrl(raw: string) {
  return raw === "" || parseSchedulingUrl(raw) !== null;
}
