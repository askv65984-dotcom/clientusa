"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { deletePackage, savePackage, type FormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/site/submit-button";
import { slugify } from "@/lib/format";
import type { Billing, Package } from "@/lib/types";
import { useSubmitWithoutReset } from "@/lib/use-submit-without-reset";

const idle: FormState = { status: "idle" };

const billingOptions: { value: Billing; label: string; hint: string }[] = [
  { value: "one_time", label: "One-time fee", hint: "Charged once at checkout." },
  { value: "monthly", label: "Monthly", hint: "Charged every month until canceled." },
  { value: "custom", label: "Custom quote", hint: "No checkout. Visitors are sent to book a call." },
];

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 mb-2 text-[0.875rem] text-slate">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PackageForm({ pkg }: { pkg?: Package }) {
  const [state, action, pending] = useActionState(savePackage, idle);
  const onSubmit = useSubmitWithoutReset(action);
  const errors = state.fieldErrors ?? {};
  const v = state.values;

  const initialBilling = (v?.billing as Billing | undefined) ?? pkg?.billing ?? "one_time";
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [name, setName] = useState(v?.name ?? pkg?.name ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(pkg));
  const [slug, setSlug] = useState(v?.slug ?? pkg?.slug ?? "");

  const describe = (id: string, hasHint = false) =>
    [hasHint ? `${id}-hint` : null, errors[id] ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  const defaultPrice = pkg?.price_cents != null ? (pkg.price_cents / 100).toFixed(pkg.price_cents % 100 === 0 ? 0 : 2) : "";

  return (
    <>
      <form action={action} onSubmit={onSubmit} className="space-y-8">
        {pkg ? <input type="hidden" name="id" value={pkg.id} /> : null}

        {state.status === "error" && (state.message || Object.keys(errors).length > 0) ? (
          <p role="alert" className="border-l-4 border-danger bg-danger-tint px-4 py-3">
            {state.message ?? "Check the highlighted fields."}
          </p>
        ) : null}

        <section className="space-y-6 rounded-[4px] border border-sage bg-white p-6">
          <h2 className="text-[1.5rem] text-ink">Basics</h2>
          <Field id="name" label="Package name" error={errors.name}>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
              className="field-input"
            />
          </Field>
          <Field
            id="slug"
            label="Web address"
            hint="Used in links such as anokaadvisors.com/pricing#operations-diagnostic. Lowercase letters, numbers and hyphens."
            error={errors.slug}
          >
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={describe("slug", true)}
              className="field-input font-mono text-[0.9375rem]"
            />
          </Field>
          <Field id="summary" label="Short description" hint="One or two sentences shown under the name." error={errors.summary}>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              defaultValue={v?.summary ?? pkg?.summary ?? ""}
              aria-invalid={Boolean(errors.summary)}
              aria-describedby={describe("summary", true)}
              className="field-input"
            />
          </Field>
          <Field id="duration_label" label="Length or format" hint="For example: 90-minute session and written summary." error={errors.duration_label}>
            <input
              id="duration_label"
              name="duration_label"
              defaultValue={v?.duration_label ?? pkg?.duration_label ?? ""}
              aria-invalid={Boolean(errors.duration_label)}
              aria-describedby={describe("duration_label", true)}
              className="field-input"
            />
          </Field>
        </section>

        <section className="space-y-6 rounded-[4px] border border-sage bg-white p-6">
          <h2 className="text-[1.5rem] text-ink">Price and checkout</h2>
          <fieldset>
            <legend className="field-label">How it is billed</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {billingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer gap-3 rounded-[3px] border border-sage p-4 has-[:checked]:border-evergreen has-[:checked]:bg-mist"
                >
                  <input
                    type="radio"
                    name="billing"
                    value={option.value}
                    checked={billing === option.value}
                    onChange={() => setBilling(option.value)}
                    className="mt-1 accent-evergreen"
                  />
                  <span>
                    <span className="block font-semibold">{option.label}</span>
                    <span className="block text-[0.875rem] text-slate">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {billing !== "custom" ? (
            <Field id="price" label={billing === "monthly" ? "Price per month (USD)" : "Price (USD)"} error={errors.price}>
              <div className="relative max-w-xs">
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  inputMode="decimal"
                  required
                  defaultValue={v?.price ?? defaultPrice}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={describe("price")}
                  className="field-input pl-7"
                />
              </div>
            </Field>
          ) : null}
          <Field
            id="cta_label"
            label="Button text"
            hint={billing === "custom" ? "Leave blank to use “Book a consultation”." : "Leave blank to use “Buy now” or “Start the retainer”."}
            error={errors.cta_label}
          >
            <input
              id="cta_label"
              name="cta_label"
              defaultValue={v?.cta_label ?? pkg?.cta_label ?? ""}
              aria-invalid={Boolean(errors.cta_label)}
              aria-describedby={describe("cta_label", true)}
              className="field-input max-w-md"
            />
          </Field>
        </section>

        <section className="space-y-6 rounded-[4px] border border-sage bg-white p-6">
          <h2 className="text-[1.5rem] text-ink">What is included</h2>
          <Field id="features" label="Included items" hint="One item per line. Shown as a checklist." error={errors.features}>
            <textarea
              id="features"
              name="features"
              rows={7}
              defaultValue={v?.features ?? pkg?.features.join("\n") ?? ""}
              aria-invalid={Boolean(errors.features)}
              aria-describedby={describe("features", true)}
              className="field-input"
            />
          </Field>
          <Field id="badge" label="Highlight label" hint="Optional short label, such as “Best place to start”." error={errors.badge}>
            <input
              id="badge"
              name="badge"
              defaultValue={v?.badge ?? pkg?.badge ?? ""}
              aria-invalid={Boolean(errors.badge)}
              aria-describedby={describe("badge", true)}
              className="field-input max-w-md"
            />
          </Field>
        </section>

        <section className="space-y-6 rounded-[4px] border border-sage bg-white p-6">
          <h2 className="text-[1.5rem] text-ink">Display</h2>
          <Field id="sort_order" label="Display order" hint="Lower numbers appear first." error={errors.sort_order}>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              max={9999}
              defaultValue={v?.sort_order ?? pkg?.sort_order ?? 10}
              aria-invalid={Boolean(errors.sort_order)}
              aria-describedby={describe("sort_order", true)}
              className="field-input max-w-[8rem]"
            />
          </Field>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={v ? v.is_active === "on" : (pkg?.is_active ?? true)}
              className="mt-1 size-4 accent-evergreen"
            />
            <span>
              <span className="block font-semibold">Show on the website</span>
              <span className="block text-[0.875rem] text-slate">Hidden packages cannot be bought.</span>
            </span>
          </label>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton label={pkg ? "Save changes" : "Add package"} pendingLabel="Saving…" className="btn btn-primary" pending={pending} />
          <Link href="/admin/packages" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>

      {pkg ? (
        <form
          action={deletePackage}
          className="mt-12 border-t border-sage pt-8"
          onSubmit={(event) => {
            if (!window.confirm(`Delete “${pkg.name}”? This cannot be undone. Past orders keep their records.`)) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={pkg.id} />
          <h2 className="text-[1.25rem] text-ink">Delete this package</h2>
          <p className="mt-1 text-[0.9375rem] text-slate">To take it off the website for now, untick “Show on the website” instead.</p>
          <button type="submit" className="btn mt-4 border border-danger text-danger hover:bg-danger-tint">
            Delete package
          </button>
        </form>
      ) : null}
    </>
  );
}
