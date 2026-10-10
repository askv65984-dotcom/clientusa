"use client";

import { useActionState } from "react";
import { signInWithPin, type FormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/site/submit-button";

const idle: FormState = { status: "idle" };

export function LoginForm() {
  const [state, action] = useActionState(signInWithPin, idle);
  return (
    <form action={action} className="space-y-5">
      {state.status === "error" ? (
        <p role="alert" className="border-l-4 border-danger bg-danger-tint px-4 py-3">
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="pin" className="field-label">
          Admin PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={12}
          autoComplete="current-password"
          autoFocus
          required
          className="field-input text-center font-mono text-2xl tracking-[0.5em]"
        />
      </div>
      <SubmitButton label="Sign in" pendingLabel="Checking…" className="btn btn-primary w-full" />
    </form>
  );
}
