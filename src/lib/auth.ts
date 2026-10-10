import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createServerSupabase } from "./supabase/server";

/**
 * Confirms the visitor is signed in and listed in admin_users.
 * Every admin page and server action calls this; row level security is the second line of defense.
 */
export async function requireAdmin() {
  // Session checks compare token expiry with the current time, so they always run at request time.
  await connection();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) redirect("/admin/login");

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw new Error(`Could not check admin access: ${adminError.message}`);
  if (!isAdmin) redirect("/admin/login?error=not-admin");

  return { supabase, email: typeof claims.email === "string" ? claims.email : "" };
}
