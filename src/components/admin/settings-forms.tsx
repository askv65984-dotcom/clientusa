"use client";

import { useActionState, useState } from "react";
import { changePin, saveSettings, type FormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/site/submit-button";
import { formatUsd } from "@/lib/format";
import type { AdminSettings, Package } from "@/lib/types";
import { useSubmitWithoutReset } from "@/lib/use-submit-without-reset";

const idle: FormState = { status: "idle" };

function Message({ state }: { state: FormState }) {
  if (state.status === "success") {
    return (
      <p role="status" className="border-l-4 border-success bg-success-tint px-4 py-3">
        {state.message}
      </p>
    );
  }
  if (state.status === "error" && state.message) {
    return (
      <p role="alert" className="border-l-4 border-danger bg-danger-tint px-4 py-3">
        {state.message}
      </p>
    );
  }
  return null;
}

type PackageOption = Pick<Package, "id" | "name" | "billing" | "price_cents" | "is_active">;

export function SettingsForm({ settings, packages }: { settings: AdminSettings; packages: PackageOption[] }) {
  const [state, action, pending] = useActionState(saveSettings, idle);
  const onSubmit = useSubmitWithoutReset(action);
  const errors = state.fieldErrors ?? {};
  const v = state.values;
  // Controlled so the choice stays put after saving.
  const [consultationId, setConsultationId] = useState(settings.consultation_package_id ?? "");
  const chosen = packages.find((pkg) => pkg.id === consultationId);

  return (
    <form action={action} onSubmit={onSubmit} className="space-y-6">
      <Message state={state} />
      <div>
        <label htmlFor="consultation_package_id" className="field-label">
          Paid option on the Book a consultation page
        </label>
        <p id="consultation_package_id-hint" className="-mt-1 mb-2 text-[0.875rem] text-slate">
          The page offers an initial consultation (a request form, no payment) and this paid package, which customers
          buy and then schedule on Calendly. Change its price, length and what is included under Packages and prices.
        </p>
        <select
          id="consultation_package_id"
          name="consultation_package_id"
          value={consultationId}
          onChange={(event) => setConsultationId(event.target.value)}
          aria-invalid={Boolean(errors.consultation_package_id)}
          aria-describedby={`consultation_package_id-hint${errors.consultation_package_id ? " consultation_package_id-error" : ""}`}
          className="field-input"
        >
          <option value="">None (only the initial consultation is offered)</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name}
              {pkg.price_cents != null ? `, ${formatUsd(pkg.price_cents)}${pkg.billing === "monthly" ? " per month" : ""}` : ""}
              {pkg.is_active ? "" : " (hidden)"}
            </option>
          ))}
        </select>
        {chosen && !chosen.is_active ? (
          <p className="mt-1.5 text-[0.875rem] text-danger">This package is hidden, so the Book a consultation page cannot sell it. Show it under Packages and prices.</p>
        ) : null}
        {errors.consultation_package_id ? (
          <p id="consultation_package_id-error" className="field-error">
            {errors.consultation_package_id}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="scheduling_url" className="field-label">
          Calendly link
        </label>
        <p id="scheduling_url-hint" className="-mt-1 mb-2 text-[0.875rem] text-slate">
          Paste your Calendly event link (for example https://calendly.com/your-name/consultation). Customers see the
          calendar only after paying, on the payment confirmation page. Until a link is added, they see a short form to
          request a time instead, and requests arrive under Leads. A Google Calendar booking page link also works.
        </p>
        <input
          id="scheduling_url"
          name="scheduling_url"
          type="url"
          inputMode="url"
          placeholder="https://calendly.com/…"
          defaultValue={v?.scheduling_url ?? settings.scheduling_url}
          aria-invalid={Boolean(errors.scheduling_url)}
          aria-describedby={`scheduling_url-hint${errors.scheduling_url ? " scheduling_url-error" : ""}`}
          className="field-input"
        />
        {errors.scheduling_url ? (
          <p id="scheduling_url-error" className="field-error">
            {errors.scheduling_url}
          </p>
        ) : null}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_email" className="field-label">
            Public email address
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={v?.contact_email ?? settings.contact_email}
            aria-invalid={Boolean(errors.contact_email)}
            aria-describedby={errors.contact_email ? "contact_email-error" : undefined}
            className="field-input"
          />
          {errors.contact_email ? (
            <p id="contact_email-error" className="field-error">
              {errors.contact_email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact_phone" className="field-label">
            Public phone number
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            placeholder="(555) 555-0100"
            defaultValue={v?.contact_phone ?? settings.contact_phone}
            aria-invalid={Boolean(errors.contact_phone)}
            aria-describedby={errors.contact_phone ? "contact_phone-error" : undefined}
            className="field-input"
          />
          {errors.contact_phone ? (
            <p id="contact_phone-error" className="field-error">
              {errors.contact_phone}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="office_hours" className="field-label">
            Office hours <span className="field-hint">(optional)</span>
          </label>
          <input
            id="office_hours"
            name="office_hours"
            placeholder="Mon to Fri, 8am to 5pm Central"
            defaultValue={v?.office_hours ?? settings.office_hours}
            aria-invalid={Boolean(errors.office_hours)}
            aria-describedby={errors.office_hours ? "office_hours-error" : undefined}
            className="field-input"
          />
          {errors.office_hours ? (
            <p id="office_hours-error" className="field-error">
              {errors.office_hours}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="linkedin_url" className="field-label">
            LinkedIn page <span className="field-hint">(optional)</span>
          </label>
          <input
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            placeholder="https://www.linkedin.com/company/…"
            defaultValue={v?.linkedin_url ?? settings.linkedin_url}
            aria-invalid={Boolean(errors.linkedin_url)}
            aria-describedby={errors.linkedin_url ? "linkedin_url-error" : undefined}
            className="field-input"
          />
          {errors.linkedin_url ? (
            <p id="linkedin_url-error" className="field-error">
              {errors.linkedin_url}
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-[0.875rem] text-slate">
        Leave any of these blank to hide it from the website. They appear in the footer and on the Contact page.
      </p>
      <SubmitButton label="Save settings" pendingLabel="Saving…" className="btn btn-primary" pending={pending} />
    </form>
  );
}

function PinField({
  id,
  label,
  hint,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  autoComplete: string;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={12}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="field-input font-mono tracking-[0.3em]"
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.875rem] text-slate">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PinForm() {
  const [state, action] = useActionState(changePin, idle);
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-6">
      <Message state={state} />
      <div className="grid gap-6 sm:grid-cols-3">
        <PinField id="current" label="Current PIN" error={errors.current} autoComplete="current-password" />
        <PinField id="pin" label="New PIN" hint="6 to 12 digits." error={errors.pin} autoComplete="new-password" />
        <PinField id="confirm" label="Repeat new PIN" error={errors.confirm} autoComplete="new-password" />
      </div>
      <SubmitButton label="Change PIN" pendingLabel="Saving…" className="btn btn-primary" />
    </form>
  );
}
