import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./env";

/** Session-aware client for the admin area. Row level security decides what it can touch. */
export async function createServerSupabase() {
  // Read cookies first: it marks the route as request-time even when configuration is missing.
  const cookieStore = await cookies();
  const env = requireSupabaseEnv();

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't write cookies. The proxy refreshes the session instead.
        }
      },
    },
  });
}
