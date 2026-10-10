"use server";

import { z } from "zod";
import {
  CALL_FORMATS,
  TIME_WINDOWS,
  TIME_ZONES,
  callDateProblem,
  formatCallDate,
  timeWindows,
  timeZoneLabels,
} from "@/lib/booking";
import { INTEREST_OPTIONS } from "@/lib/contact-options";
import { getStripe } from "@/lib/stripe";
import { createPublicClient } from "@/lib/supabase/public";

const bookingSchema = z.object({
  call_format: z.enum(CALL_FORMATS),
  preferred_date: z.string(),
  preferred_window: z.enum(TIME_WINDOWS, { error: "Choose a time of day." }),
  time_zone: z.enum(TIME_ZONES, { error: "Choose your time zone." }),
  other_times: z.string().trim().max(300, "Use 300 characters or fewer."),
  full_name: z.string().trim().min(1, "Enter your name.").max(120, "Use 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(254, "Use 254 characters or fewer.")
    .pipe(z.email({ error: "Enter an email address like name@example.com." })),
  phone: z.string().trim().max(40, "Use 40 characters or fewer."),
  organization: z.string().trim().max(160, "Use 160 characters or fewer."),
  interest: z.union([z.enum(INTEREST_OPTIONS), z.literal("")]),
  message: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
});

type Field = keyof z.infer<typeof bookingSchema>;

export type BookingState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
  /** What was requested, shown back after a successful request. */
  summary?: { day: string; time: string; email: string };
};

const FIELDS: Field[] = [
  "call_format",
  "preferred_date",
  "preferred_window",
  "time_zone",
  "other_times",
  "full_name",
  "email",
  "phone",
  "organization",
  "interest",
  "message",
];

/** A time request for a paid session must come with a completed checkout. */
async function isPaidSession(sessionId: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return session.status === "complete" && session.payment_status !== "unpaid";
  } catch (error) {
    console.error("[booking] Could not check the checkout session", error);
    return false;
  }
}

export async function requestCall(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const raw = Object.fromEntries(FIELDS.map((field) => [field, String(formData.get(field) ?? "")])) as Record<Field, string>;

  // Hidden field that people never see; bots tend to fill it in.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", message: "Thanks. Your request has been sent." };
  }

  const parsed = bookingSchema.safeParse(raw);
  const fieldErrors: BookingState["fieldErrors"] = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as Field;
      fieldErrors[field] ??= issue.message;
    }
  }
  // Checked separately so these show alongside any other mistakes, not only once the rest is fixed.
  const dateProblem = callDateProblem(raw.preferred_date, raw.time_zone);
  if (dateProblem) fieldErrors.preferred_date ??= dateProblem;
  if (raw.call_format === "phone" && raw.phone.trim() === "") {
    fieldErrors.phone ??= "Enter the number we should call.";
  }

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Check the highlighted fields and try again.", fieldErrors, values: raw };
  }

  // "initial" is the initial consultation request; "paid" asks for a time after buying a session.
  const paid = String(formData.get("purpose") ?? "") === "paid";
  if (paid && !(await isPaidSession(String(formData.get("session_id") ?? "")))) {
    return {
      status: "error",
      message: "We could not confirm your payment, so the request was not sent. Contact us and we will arrange a time.",
      values: raw,
    };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    console.error("[booking] Supabase is not configured.");
    return {
      status: "error",
      message: "Call requests are not being accepted right now. Email us instead, or send a message.",
      values: raw,
    };
  }

  const { error } = await supabase.from("leads").insert({ ...parsed.data, source: paid ? "paid_booking" : "booking_form" });
  if (error) {
    console.error("[booking] Could not save call request", error);
    return {
      status: "error",
      message: "Your request was not sent because of a problem on our side. Try again in a few minutes.",
      values: raw,
    };
  }

  const slot = timeWindows[parsed.data.preferred_window];
  return {
    status: "success",
    message: `Thanks, ${parsed.data.full_name.split(" ")[0]}. Your request is in.`,
    summary: {
      day: formatCallDate(parsed.data.preferred_date),
      time: `${slot.name}, ${slot.hours} (${timeZoneLabels[parsed.data.time_zone]})`,
      email: parsed.data.email,
    },
  };
}
