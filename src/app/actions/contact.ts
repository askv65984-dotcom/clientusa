"use server";

import { z } from "zod";
import { INTEREST_OPTIONS } from "@/lib/contact-options";
import { createPublicClient } from "@/lib/supabase/public";

const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your name.").max(120, "Use 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(254, "Use 254 characters or fewer.")
    .pipe(z.email({ error: "Enter an email address like name@example.com." })),
  phone: z.string().trim().max(40, "Use 40 characters or fewer."),
  organization: z.string().trim().max(160, "Use 160 characters or fewer."),
  interest: z.union([z.enum(INTEREST_OPTIONS), z.literal("")]),
  message: z
    .string()
    .trim()
    .min(10, "Add a few more details so we can prepare (at least 10 characters).")
    .max(5000, "Use 5,000 characters or fewer."),
});

type Field = keyof z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
};

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    interest: String(formData.get("interest") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Hidden field that people never see; bots tend to fill it in.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", message: "Thanks. Your message has been sent." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as Field;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Check the highlighted fields and try again.", fieldErrors, values: raw };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    console.error("[contact] Supabase is not configured.");
    return {
      status: "error",
      message: "The form is not accepting messages right now. Email us instead, or book a call.",
      values: raw,
    };
  }

  const { error } = await supabase.from("leads").insert(parsed.data);
  if (error) {
    console.error("[contact] Could not save lead", error);
    return {
      status: "error",
      message: "Your message was not sent because of a problem on our side. Try again in a few minutes.",
      values: raw,
    };
  }

  return {
    status: "success",
    message: `Thanks, ${parsed.data.full_name.split(" ")[0]}. Your message has been sent and we will reply to ${parsed.data.email}.`,
  };
}
