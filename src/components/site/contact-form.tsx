"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { INTEREST_OPTIONS } from "@/lib/contact-options";
import { useSubmitWithoutReset } from "@/lib/use-submit-without-reset";
import { SubmitButton } from "./submit-button";

const initialState: ContactState = { status: "idle" };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const onSubmit = useSubmitWithoutReset(formAction);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  // Controlled so the choice survives React's automatic form reset after a failed submit.
  const [interest, setInterest] = useState("");

  // After a failed submit, take people to the first field that needs fixing.
  useEffect(() => {
    if (state.status !== "error") return;
    const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
    target?.focus();
    target?.scrollIntoView({ block: "center" });
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-gold/10 p-7">
        <h2 className="text-[1.75rem] text-fg">Message sent</h2>
        <p className="mt-2">{state.message}</p>
      </div>
    );
  }

  const describedBy = (field: keyof typeof errors) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="space-y-6">
      {state.status === "error" && state.message ? (
        <p role="alert" tabIndex={-1} className="rounded-xl border border-[#e08a7f]/50 bg-[#e08a7f]/10 px-4 py-3 text-fg">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="field-label">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            autoComplete="name"
            required
            defaultValue={values.full_name}
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={describedBy("full_name")}
            className="field-input"
          />
          <FieldError id="full_name-error" message={errors.full_name} />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className="field-input"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Phone <span className="field-hint">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className="field-input"
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
        <div>
          <label htmlFor="organization" className="field-label">
            Organization <span className="field-hint">(optional)</span>
          </label>
          <input
            id="organization"
            name="organization"
            autoComplete="organization"
            defaultValue={values.organization}
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={describedBy("organization")}
            className="field-input"
          />
          <FieldError id="organization-error" message={errors.organization} />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="field-label">
          What can we help with? <span className="field-hint">(optional)</span>
        </label>
        <select
          id="interest"
          name="interest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="field-input"
        >
          <option value="">Choose an area</option>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <p id="message-hint" className="mb-2 text-[0.9375rem] text-fg-soft">
          Tell us what is happening and what you would like to change. Please leave out any patient information.
        </p>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={["message-hint", describedBy("message")].filter(Boolean).join(" ")}
          className="field-input min-h-40"
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton label="Send message" pendingLabel="Sending…" className="btn btn-gold min-w-44" pending={pending} />
    </form>
  );
}
