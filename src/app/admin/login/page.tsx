import type { Metadata } from "next";
import { AuthShell } from "@/components/admin/auth-shell";
import { LoginForm } from "@/components/admin/auth-forms";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Sign in" };

const messages: Record<string, string> = {
  "not-admin": "Your session does not have admin access. Enter the PIN to sign in again.",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? messages[error] : undefined;

  if (!getSupabaseEnv()) {
    return (
      <AuthShell title="Admin setup needed">
        <p>
          The database is not connected yet. Add the Supabase keys to the environment variables, then reload this
          page.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Admin sign-in">
      {message ? (
        <p role="alert" className="mb-5 border-l-4 border-brass bg-mist px-4 py-3">
          {message}
        </p>
      ) : null}
      <LoginForm />
    </AuthShell>
  );
}
