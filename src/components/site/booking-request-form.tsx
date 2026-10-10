"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { requestCall, type BookingState } from "@/app/actions/booking";
import {
  DAYS_OFFERED,
  TIME_WINDOWS,
  TIME_ZONES,
  detectUsTimeZone,
  formatCallDate,
  nextWeekdays,
  timeWindows,
  timeZoneLabels,
  todayIn,
  type TimeWindow,
} from "@/lib/booking";
import { INTEREST_OPTIONS } from "@/lib/contact-options";
import { useSubmitWithoutReset } from "@/lib/use-submit-without-reset";
import type { Prefill } from "./scheduling-embed";
import { SubmitButton } from "./submit-button";

const initialState: BookingState = { status: "idle" };

// Dates and time zones come from the visitor's browser, so they are read only after hydration.
const subscribe = () => () => {};
let detectedZone: string | undefined;
const getDetectedZone = () => (detectedZone ??= detectUsTimeZone());
const getLocalZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const chip =
  "cursor-pointer rounded-xl border border-line-strong bg-deep text-fg-muted transition-colors hover:border-gold/60 has-checked:border-gold has-checked:bg-gold/12 has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

function Legend({ children }: { children: ReactNode }) {
  return <legend className="font-sans text-base font-semibold text-fg">{children}</legend>;
}

const copy = {
  initial: {
    heading: "Request a meeting",
    intro: "Choose a day and time that suit you. We confirm by email and send the video link with it.",
  },
  paid: {
    heading: "Choose a time for your video session",
    intro: "Pick a day and time that suit you. We confirm by email and send the link for the session with it.",
  },
};

/**
 * Asks for a day and time. Used for the initial consultation request, and after payment for a
 * paid session until a Calendly link is set up.
 */
export function BookingRequestForm({
  purpose,
  sessionId = "",
  prefill = {},
}: {
  purpose: "initial" | "paid";
  /** The completed Stripe Checkout session, required when purpose is "paid". */
  sessionId?: string;
  prefill?: Prefill;
}) {
  const [state, formAction, pending] = useActionState(requestCall, initialState);
  const onSubmit = useSubmitWithoutReset(formAction);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const detected = useSyncExternalStore(subscribe, getDetectedZone, () => "");

  // Controlled so choices survive a failed submit.
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<TimeWindow | "">("");
  const [zone, setZone] = useState<string | null>(null);
  const [interest, setInterest] = useState("");
  const timeZone = zone ?? detected;

  const days = mounted ? nextWeekdays(todayIn(timeZone || getLocalZone()), DAYS_OFFERED) : null;

  // After a failed submit, take people to the first thing that needs fixing.
  useEffect(() => {
    if (state.status !== "error") return;
    const target = formRef.current?.querySelector<HTMLElement>('[role="alert"]');
    target?.focus();
    target?.scrollIntoView({ block: "center" });
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="card p-6 md:p-8">
        <span className="grid size-12 place-items-center rounded-full border border-gold/60 text-gold">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6">
            <path d="M5.5 10.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 text-[1.75rem] leading-tight text-fg">Request received</h3>
        <p className="mt-2 text-fg-muted">{state.message}</p>
        {state.summary ? (
          <>
            <dl className="mt-6 grid gap-5 rounded-xl border border-line bg-deep p-5 sm:grid-cols-2">
              <div>
                <dt className="text-[0.875rem] text-fg-soft">Day</dt>
                <dd className="mt-1 text-fg">{state.summary.day}</dd>
              </div>
              <div>
                <dt className="text-[0.875rem] text-fg-soft">Time</dt>
                <dd className="mt-1 text-fg">{state.summary.time}</dd>
              </div>
            </dl>
            <p className="mt-6 text-fg-muted">
              We will email <span className="break-all text-fg">{state.summary.email}</span> to confirm the time and send the
              video link.
            </p>
          </>
        ) : null}
      </div>
    );
  }

  const describedBy = (field: keyof typeof errors, hint?: string) =>
    [hint, errors[field] ? `book-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const choice =
    day && slot
      ? `Video meeting on ${formatCallDate(day)}, ${timeWindows[slot].name.toLowerCase()} (${timeWindows[slot].hours}${
          timeZone ? `, ${timeZoneLabels[timeZone as keyof typeof timeZoneLabels]}` : ""
        }).`
      : "Choose a day and a time of day.";

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
      <div className="border-b border-line pb-6">
        <div className="max-w-xl">
          <h3 className="text-[1.75rem] leading-tight text-fg">{copy[purpose].heading}</h3>
          <p className="mt-2 text-fg-muted">{copy[purpose].intro}</p>
        </div>
      </div>
      <input type="hidden" name="purpose" value={purpose} />
      {purpose === "paid" ? <input type="hidden" name="session_id" value={sessionId} /> : null}
      <input type="hidden" name="call_format" value="video" />

      {state.status === "error" && state.message ? (
        <p role="alert" tabIndex={-1} className="mt-6 rounded-xl border border-[#e08a7f]/50 bg-[#e08a7f]/10 px-4 py-3 text-fg">
          {state.message}
        </p>
      ) : null}

      <div className="mt-7 space-y-9">
        <fieldset aria-describedby={describedBy("preferred_date", "book-day-hint")}>
          <Legend>Choose a day</Legend>
          <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {days
              ? days.map((iso) => {
                  const date = new Date(`${iso}T12:00:00Z`);
                  const part = (options: Intl.DateTimeFormatOptions) =>
                    new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(date);
                  return (
                    <label key={iso} className={`${chip} flex h-[5.25rem] flex-col items-center justify-center gap-1`}>
                      <input
                        type="radio"
                        name="preferred_date"
                        value={iso}
                        checked={day === iso}
                        onChange={() => setDay(iso)}
                        aria-label={formatCallDate(iso)}
                        className="sr-only"
                      />
                      <span className="text-[0.8125rem]" aria-hidden="true">
                        {part({ weekday: "short" })}
                      </span>
                      <span className="font-serif text-[1.5rem] leading-none text-fg" aria-hidden="true">
                        {part({ day: "numeric" })}
                      </span>
                      <span className="text-[0.8125rem]" aria-hidden="true">
                        {part({ month: "short" })}
                      </span>
                    </label>
                  );
                })
              : Array.from({ length: DAYS_OFFERED }, (_, index) => (
                  <span key={index} aria-hidden="true" className="h-[5.25rem] rounded-xl border border-line bg-deep/60" />
                ))}
          </div>
          <noscript>
            <label htmlFor="book-date-fallback" className="field-label mt-4">
              Day for the call
            </label>
            <input id="book-date-fallback" type="date" name="preferred_date" defaultValue={values.preferred_date} className="field-input" />
          </noscript>
          <p id="book-day-hint" className="mt-3 text-[0.9375rem] text-fg-soft">
            Weekdays over the next two weeks. Need a later date? Add it under other times below.
          </p>
          <FieldError id="book-preferred_date-error" message={errors.preferred_date} />
        </fieldset>

        <fieldset aria-describedby={describedBy("preferred_window")}>
          <Legend>Choose a time</Legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {TIME_WINDOWS.map((option) => (
              <label key={option} className={`${chip} flex items-center justify-between gap-3 px-4 py-3.5 sm:block`}>
                <input
                  type="radio"
                  name="preferred_window"
                  value={option}
                  checked={slot === option}
                  onChange={() => setSlot(option)}
                  className="sr-only"
                />
                <span className="block font-semibold text-fg">{timeWindows[option].name}</span>
                <span className="block text-[0.9375rem]">{timeWindows[option].hours}</span>
              </label>
            ))}
          </div>
          <FieldError id="book-preferred_window-error" message={errors.preferred_window} />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="book-time_zone" className="field-label">
                Your time zone
              </label>
              <select
                id="book-time_zone"
                name="time_zone"
                value={timeZone}
                onChange={(event) => setZone(event.target.value)}
                aria-invalid={Boolean(errors.time_zone)}
                aria-describedby={describedBy("time_zone")}
                className="field-input"
              >
                <option value="">Choose your time zone</option>
                {TIME_ZONES.map((option) => (
                  <option key={option} value={option}>
                    {timeZoneLabels[option]}
                  </option>
                ))}
              </select>
              <FieldError id="book-time_zone-error" message={errors.time_zone} />
            </div>
            <div>
              <label htmlFor="book-other_times" className="field-label">
                Other times that work <span className="field-hint">(optional)</span>
              </label>
              <input
                id="book-other_times"
                name="other_times"
                placeholder="For example, Thursday after 3 pm"
                defaultValue={values.other_times}
                aria-invalid={Boolean(errors.other_times)}
                aria-describedby={describedBy("other_times")}
                className="field-input"
              />
              <FieldError id="book-other_times-error" message={errors.other_times} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <Legend>Your details</Legend>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="book-full_name" className="field-label">
                Full name
              </label>
              <input
                id="book-full_name"
                name="full_name"
                autoComplete="name"
                required
                defaultValue={values.full_name ?? prefill.name ?? undefined}
                aria-invalid={Boolean(errors.full_name)}
                aria-describedby={describedBy("full_name")}
                className="field-input"
              />
              <FieldError id="book-full_name-error" message={errors.full_name} />
            </div>
            <div>
              <label htmlFor="book-email" className="field-label">
                Work email
              </label>
              <input
                id="book-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={values.email ?? prefill.email ?? undefined}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                className="field-input"
              />
              <FieldError id="book-email-error" message={errors.email} />
            </div>
            <div>
              <label htmlFor="book-phone" className="field-label">
                Phone{" "}
<span className="field-hint">(optional)</span>
              </label>
              <input
                id="book-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={values.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy("phone")}
                className="field-input"
              />
              <FieldError id="book-phone-error" message={errors.phone} />
            </div>
            <div>
              <label htmlFor="book-organization" className="field-label">
                Organization <span className="field-hint">(optional)</span>
              </label>
              <input
                id="book-organization"
                name="organization"
                autoComplete="organization"
                defaultValue={values.organization}
                aria-invalid={Boolean(errors.organization)}
                aria-describedby={describedBy("organization")}
                className="field-input"
              />
              <FieldError id="book-organization-error" message={errors.organization} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="book-interest" className="field-label">
                Area <span className="field-hint">(optional)</span>
              </label>
              <select
                id="book-interest"
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
            <div className="sm:col-span-2">
              <label htmlFor="book-message" className="field-label">
                What would you like to talk about? <span className="field-hint">(optional)</span>
              </label>
              <p id="book-message-hint" className="mb-2 text-[0.9375rem] text-fg-soft">
                A line or two helps us prepare. Please leave out any patient information.
              </p>
              <textarea
                id="book-message"
                name="message"
                rows={3}
                defaultValue={values.message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message", "book-message-hint")}
                className="field-input min-h-28"
              />
              <FieldError id="book-message-error" message={errors.message} />
            </div>
          </div>
        </fieldset>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="book-website">Leave this field empty</label>
        <input id="book-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-9 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-[0.975rem] text-fg-muted">
          {choice}
        </p>
        <SubmitButton label="Request this time" pendingLabel="Sending…" className="btn btn-gold shrink-0" pending={pending} />
      </div>
    </form>
  );
}
