"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { hashPin, PIN_PATTERN, verifyPin } from "@/lib/admin-pin";
import { requireAdmin } from "@/lib/auth";
import { PACKAGES_TAG, SETTINGS_TAG } from "@/lib/data";
import { slugify } from "@/lib/format";
import { isAllowedSchedulingUrl } from "@/lib/scheduling";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { BILLING_TYPES, LEAD_STATUSES } from "@/lib/types";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** What was submitted, so the form can show it again after an error. */
  values?: Record<string, string>;
};

function collectErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function submittedValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION") && !["pin", "current", "confirm"].includes(key)) {
      values[key] = value;
    }
  }
  return values;
}

// ---------------------------------------------------------------------------
// Sign in with a PIN, sign out, change the PIN
// ---------------------------------------------------------------------------

const LOCKOUT_MINUTES = 15;
const MAX_FAILURES_PER_IP = 5;
const MAX_FAILURES_TOTAL = 30;

/**
 * The visitor's IP for the per-device limit. Hosts such as Vercel set x-real-ip themselves. In
 * x-forwarded-for only the right-most entry is added by the nearest proxy; earlier entries come from
 * the client and can be made up. The site-wide limit applies whatever this returns.
 */
async function clientIp() {
  const requestHeaders = await headers();
  const realIp = requestHeaders.get("x-real-ip")?.trim();
  const forwarded = (requestHeaders.get("x-forwarded-for") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return (realIp || forwarded.at(-1) || "unknown").slice(0, 100);
}

export async function signInWithPin(_prev: FormState, formData: FormData): Promise<FormState> {
  const pin = text(formData, "pin");
  if (!PIN_PATTERN.test(pin)) return { status: "error", message: "Enter your PIN using numbers only." };

  const service = createServiceClient();
  const ip = await clientIp();

  // Slow down guessing: limit wrong attempts per device and across the whole site. The database checks
  // both limits and records this attempt in one locked step, so parallel requests cannot slip through.
  const { data: reserved, error: reserveError } = await service.rpc("reserve_admin_login_attempt", {
    p_ip: ip,
    p_window_minutes: LOCKOUT_MINUTES,
    p_max_per_ip: MAX_FAILURES_PER_IP,
    p_max_total: MAX_FAILURES_TOTAL,
  });
  if (reserveError) throw new Error(`Could not check sign-in attempts: ${reserveError.message}`);
  const attempt = (reserved as { attempt_id: number; ip_failures: number }[] | null)?.[0];
  if (!attempt) {
    return { status: "error", message: `Too many incorrect attempts. Wait ${LOCKOUT_MINUTES} minutes and try again.` };
  }

  const { data: secret, error: secretError } = await service.from("admin_secrets").select("pin_hash").eq("id", 1).maybeSingle();
  if (secretError) throw new Error(`Could not check the PIN: ${secretError.message}`);
  const correct = secret ? await verifyPin(pin, secret.pin_hash) : false;

  // The attempt was recorded as a failure; mark it as succeeded only when the PIN matched.
  if (correct) await service.from("admin_login_attempts").update({ succeeded: true }).eq("id", attempt.attempt_id);
  await service.from("admin_login_attempts").delete().lt("created_at", new Date(Date.now() - 7 * 86_400_000).toISOString());

  if (!correct) {
    const left = MAX_FAILURES_PER_IP - attempt.ip_failures;
    return {
      status: "error",
      message: left > 0 ? `That PIN is not correct. ${left} ${left === 1 ? "try" : "tries"} left before a short lockout.` : "That PIN is not correct.",
    };
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("[admin] ADMIN_EMAIL and ADMIN_PASSWORD must be set to start admin sessions.");
    return { status: "error", message: "Admin sign-in is not configured on this server." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("[admin] Could not start the admin session", error.message);
    return { status: "error", message: "The PIN is correct, but the admin session could not start. Check the server settings." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const pinChangeSchema = z
  .object({
    current: z.string().regex(PIN_PATTERN, "Enter your current PIN."),
    pin: z.string().regex(/^\d{6,12}$/, "Use 6 to 12 digits."),
    confirm: z.string(),
  })
  .refine((value) => value.pin === value.confirm, { message: "The PINs do not match.", path: ["confirm"] });

export async function changePin(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = pinChangeSchema.safeParse({
    current: text(formData, "current"),
    pin: text(formData, "pin"),
    confirm: text(formData, "confirm"),
  });
  if (!parsed.success) return { status: "error", fieldErrors: collectErrors(parsed.error) };

  const service = createServiceClient();
  const { data: secret } = await service.from("admin_secrets").select("pin_hash").eq("id", 1).maybeSingle();
  if (!secret || !(await verifyPin(parsed.data.current, secret.pin_hash))) {
    return { status: "error", fieldErrors: { current: "That is not your current PIN." } };
  }

  const { error } = await service.from("admin_secrets").update({ pin_hash: await hashPin(parsed.data.pin) }).eq("id", 1);
  if (error) return { status: "error", message: `PIN not changed: ${error.message}` };
  return { status: "success", message: "PIN changed. Use the new PIN next time you sign in." };
}

// ---------------------------------------------------------------------------
// Packages
// ---------------------------------------------------------------------------

const packageSchema = z
  .object({
    name: z.string().min(2, "Give the package a name.").max(80, "Use 80 characters or fewer."),
    slug: z
      .string()
      .max(60, "Use 60 characters or fewer.")
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only."),
    summary: z.string().max(400, "Use 400 characters or fewer."),
    duration_label: z.string().max(80, "Use 80 characters or fewer."),
    billing: z.enum(BILLING_TYPES),
    price: z.string(),
    features: z.array(z.string().max(200, "Keep each included item under 200 characters.")).max(15, "List up to 15 items."),
    badge: z.string().max(40, "Use 40 characters or fewer."),
    cta_label: z.string().max(40, "Use 40 characters or fewer."),
    sort_order: z.coerce.number().int("Use a whole number.").min(0).max(9999),
    is_active: z.boolean(),
  })
  .transform((value, ctx) => {
    let price_cents: number | null = null;
    if (value.billing !== "custom") {
      const cleaned = value.price.replace(/[$,\s]/g, "");
      const amount = Number(cleaned);
      if (!cleaned || !Number.isFinite(amount) || amount < 0.5 || amount > 999999) {
        ctx.addIssue({ code: "custom", path: ["price"], message: "Enter a price between $0.50 and $999,999." });
        return z.NEVER;
      }
      price_cents = Math.round(amount * 100);
    }
    const { price: _price, ...rest } = value;
    void _price;
    return { ...rest, price_cents };
  });

export async function savePackage(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");

  const parsed = packageSchema.safeParse({
    name,
    slug: text(formData, "slug") || slugify(name),
    summary: text(formData, "summary"),
    duration_label: text(formData, "duration_label"),
    billing: text(formData, "billing"),
    price: text(formData, "price"),
    features: text(formData, "features")
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean),
    badge: text(formData, "badge"),
    cta_label: text(formData, "cta_label"),
    sort_order: text(formData, "sort_order") || "0",
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: collectErrors(parsed.error),
      values: submittedValues(formData),
    };
  }

  const { error } = id
    ? await supabase.from("packages").update(parsed.data).eq("id", id)
    : await supabase.from("packages").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        fieldErrors: { slug: "Another package already uses this web address." },
        values: submittedValues(formData),
      };
    }
    return { status: "error", message: `The package was not saved: ${error.message}`, values: submittedValues(formData) };
  }

  updateTag(PACKAGES_TAG);
  redirect(`/admin/packages?saved=${encodeURIComponent(parsed.data.name)}`);
}

export async function setPackageVisibility(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const visible = formData.get("visible") === "true";
  const { error } = await supabase.from("packages").update({ is_active: visible }).eq("id", id);
  if (error) throw new Error(`Could not update the package: ${error.message}`);
  updateTag(PACKAGES_TAG);
}

export async function deletePackage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the package: ${error.message}`);
  updateTag(PACKAGES_TAG);
  redirect("/admin/packages?deleted=1");
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  notes: z.string().max(10000, "Notes are limited to 10,000 characters."),
});

export async function updateLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const parsed = leadUpdateSchema.safeParse({ status: text(formData, "status"), notes: text(formData, "notes") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: collectErrors(parsed.error), values: submittedValues(formData) };
  }

  const { error } = await supabase.from("leads").update(parsed.data).eq("id", id);
  if (error) return { status: "error", message: `Changes not saved: ${error.message}`, values: submittedValues(formData) };
  refresh();
  return { status: "success", message: "Lead updated." };
}

export async function deleteLead(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(`Could not delete the lead: ${error.message}`);
  redirect("/admin/leads?deleted=1");
}

// ---------------------------------------------------------------------------
// Newsletter subscribers
// ---------------------------------------------------------------------------

export async function deleteSubscriber(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("subscribers").delete().eq("id", text(formData, "id"));
  if (error) throw new Error(`Could not remove the subscriber: ${error.message}`);
  refresh();
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const settingsSchema = z.object({
  consultation_package_id: z.union([z.literal(""), z.uuid("Choose a package from the list.")]),
  scheduling_url: z
    .string()
    .max(500)
    .refine(isAllowedSchedulingUrl, "Paste a full booking link that starts with https://"),
  contact_email: z.union([z.literal(""), z.email("Enter a valid email address.")]),
  contact_phone: z
    .string()
    .max(40)
    .refine((value) => value === "" || value.replace(/\D/g, "").length >= 10, "Enter a 10-digit US phone number."),
  office_hours: z.string().max(120, "Use 120 characters or fewer."),
  linkedin_url: z
    .string()
    .max(300)
    .refine(
      (value) => value === "" || /^https:\/\/(www\.)?linkedin\.com\//.test(value),
      "Paste a full LinkedIn link that starts with https://www.linkedin.com/",
    ),
});

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    consultation_package_id: text(formData, "consultation_package_id"),
    scheduling_url: text(formData, "scheduling_url"),
    contact_email: text(formData, "contact_email"),
    contact_phone: text(formData, "contact_phone"),
    office_hours: text(formData, "office_hours"),
    linkedin_url: text(formData, "linkedin_url"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: collectErrors(parsed.error),
      values: submittedValues(formData),
    };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ ...parsed.data, consultation_package_id: parsed.data.consultation_package_id || null })
    .eq("id", 1);
  if (error) return { status: "error", message: `Settings not saved: ${error.message}`, values: submittedValues(formData) };

  updateTag(SETTINGS_TAG);
  refresh();
  return { status: "success", message: "Settings saved. The website is updated." };
}
