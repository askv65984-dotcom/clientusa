"use server";

import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

export async function subscribe(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  if (String(formData.get("company") ?? "") !== "") return { status: "success", message: "You are on the list." };

  const parsed = emailSchema.safeParse(String(formData.get("email") ?? ""));
  if (!parsed.success) return { status: "error", message: "Enter an email address like name@example.com." };

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: "Sign-up is not available right now. Email us instead." };

  const { error } = await supabase.from("subscribers").insert({ email: parsed.data });
  // 23505 means the address is already subscribed, which is a success from the visitor's point of view.
  if (error && error.code !== "23505") {
    console.error("[newsletter] Could not save subscriber", error);
    return { status: "error", message: "That did not go through. Try again in a few minutes." };
  }
  return { status: "success", message: "You are on the list. Expect a short note when we publish something useful." };
}
