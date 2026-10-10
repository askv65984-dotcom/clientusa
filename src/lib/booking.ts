// Shared by the call request form on /book, its server action and the admin leads pages.

export const CALL_FORMATS = ["video", "phone"] as const;
export type CallFormat = (typeof CALL_FORMATS)[number];

export const callFormatLabels: Record<CallFormat, string> = {
  video: "Video call",
  phone: "Phone call",
};

export const TIME_WINDOWS = ["morning", "midday", "afternoon"] as const;
export type TimeWindow = (typeof TIME_WINDOWS)[number];

export const timeWindows: Record<TimeWindow, { name: string; hours: string; start: string }> = {
  morning: { name: "Morning", hours: "9 am to 12 pm", start: "090000" },
  midday: { name: "Midday", hours: "12 to 2 pm", start: "120000" },
  afternoon: { name: "Afternoon", hours: "2 to 5 pm", start: "140000" },
};

export const TIME_ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
] as const;
export type UsTimeZone = (typeof TIME_ZONES)[number];

export const timeZoneLabels: Record<UsTimeZone, string> = {
  "America/New_York": "Eastern time",
  "America/Chicago": "Central time",
  "America/Denver": "Mountain time",
  "America/Phoenix": "Arizona time",
  "America/Los_Angeles": "Pacific time",
  "America/Anchorage": "Alaska time",
  "Pacific/Honolulu": "Hawaii time",
};

export function isUsTimeZone(value: string): value is UsTimeZone {
  return (TIME_ZONES as readonly string[]).includes(value);
}

/** Weekdays offered on the form, starting tomorrow. */
export const DAYS_OFFERED = 10;
/** How far ahead the server accepts a requested day. */
const MAX_DAYS_AHEAD = 60;

/** Today's date as YYYY-MM-DD in a time zone. */
export function todayIn(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isWeekday(iso: string) {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return day !== 0 && day !== 6;
}

/** The next `count` weekdays after `today`, as YYYY-MM-DD strings. */
export function nextWeekdays(today: string, count = DAYS_OFFERED) {
  const days: string[] = [];
  let day = today;
  while (days.length < count) {
    day = addDays(day, 1);
    if (isWeekday(day)) days.push(day);
  }
  return days;
}

/** Returns a message when the requested day cannot be booked, or null when it is fine. */
export function callDateProblem(iso: string, timeZone: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Choose a day for the call.";
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) return "Choose a day for the call.";
  if (!isWeekday(iso)) return "Choose a weekday. Calls run Monday to Friday.";
  const today = todayIn(isUsTimeZone(timeZone) ? timeZone : "America/Chicago", now);
  if (iso <= today) return "Choose a day from tomorrow onward.";
  if (iso > addDays(today, MAX_DAYS_AHEAD)) return "Choose a day within the next two months.";
  return null;
}

/** "Tuesday, October 14" (or "Tue, Oct 14" when short). */
export function formatCallDate(iso: string, short = false) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: short ? "short" : "long",
    month: short ? "short" : "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** Matches the visitor's browser time zone to one of the US zones above, if it shares the same offsets. */
export function detectUsTimeZone(): UsTimeZone | "" {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isUsTimeZone(zone)) return zone;
    const year = new Date().getUTCFullYear();
    const samples = [new Date(Date.UTC(year, 0, 15)), new Date(Date.UTC(year, 6, 15))];
    const offsets = (tz: string) =>
      samples.map((date) => new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" }).format(date).split(" ").pop()).join();
    const mine = offsets(zone);
    return TIME_ZONES.find((tz) => offsets(tz) === mine) ?? "";
  } catch {
    return "";
  }
}

/** Leads that ask for a meeting time, by where they came from. */
export const timeRequestLabels: Record<string, string> = {
  booking_form: "Initial consultation",
  paid_booking: "Paid session",
};

export function isTimeRequest(source: string) {
  return source in timeRequestLabels;
}
