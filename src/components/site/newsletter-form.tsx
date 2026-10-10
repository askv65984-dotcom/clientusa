"use client";

import { useActionState } from "react";
import { subscribe, type NewsletterState } from "@/app/actions/newsletter";
import { SubmitButton } from "./submit-button";

const idle: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const [state, action] = useActionState(subscribe, idle);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-fg">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@organization.com"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "newsletter-error" : undefined}
          className="min-h-12 flex-1 rounded-full border border-line-strong bg-night/60 px-5 text-fg placeholder:text-fg-soft focus-visible:border-gold"
        />
        <SubmitButton label="Subscribe" pendingLabel="Subscribing…" className="btn btn-gold" />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="newsletter-company">Leave this field empty</label>
        <input id="newsletter-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" ? (
        <p id="newsletter-error" role="alert" className="mt-3 text-sm text-[#f0a59b]">
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-sm text-fg-soft">Occasional notes on healthcare operations. Unsubscribe any time.</p>
      )}
    </form>
  );
}
