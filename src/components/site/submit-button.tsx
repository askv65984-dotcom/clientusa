"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  label,
  pendingLabel,
  className = "btn btn-accent",
  pending: pendingOverride,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
  /** Pass the action's pending flag when the form is submitted with useSubmitWithoutReset. */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingOverride ?? status.pending;
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
