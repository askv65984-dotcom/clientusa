import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/** Cookie-free client for public reads. Safe to call inside "use cache" functions. */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
