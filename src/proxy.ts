import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { INSIGHT_SLUGS, SERVICE_SLUGS } from "@/content/slugs";
import { getSupabaseEnv } from "@/lib/supabase/env";

const CONTENT_PATH = /^\/(services|insights)\/([^/]+)\/?$/;

/**
 * Two jobs: answer unknown service and article URLs with a real 404 before any page streams,
 * and keep the admin session fresh, sending signed-out visitors to the login page.
 */
export async function proxy(request: NextRequest) {
  const content = request.nextUrl.pathname.match(CONTENT_PATH);
  if (content) {
    const [, section, slug] = content;
    const known: readonly string[] = section === "services" ? SERVICE_SLUGS : INSIGHT_SLUGS;
    return known.includes(slug) ? NextResponse.next() : NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }

  const env = getSupabaseEnv();
  if (!env) {
    // Without a database there is nothing to sign in to; the login page explains what is missing.
    if (request.nextUrl.pathname === "/admin/login") return NextResponse.next({ request });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;
  const isPublicAdminPage = pathname === "/admin/login";

  if (!signedIn && !isPublicAdminPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/services/:slug", "/insights/:slug"],
};
