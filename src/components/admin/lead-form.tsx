"use client";

import { useActionState, useState } from "react";
import { deleteLead, updateLead, type FormState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/site/submit-button";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";
import { useSubmitWithoutReset } from "@/lib/use-submit-without-reset";
import { leadStatusLabels } from "./ui";

const idle: FormState = { status: "idle" };

export function LeadForm({ lead }: { lead: Pick<Lead, "id" | "status" | "notes" | "full_name"> }) {
  const [state, action, pending] = useActionState(updateLead, idle);
  const onSubmit = useSubmitWithoutReset(action);
  const v = state.values;
  // Controlled so the choice survives React's automatic form reset after saving.
  const [status, setStatus] = useState<LeadStatus>(lead.status);

  return (
    <>
      <form action={action} onSubmit={onSubmit} className="space-y-5">
        <input type="hidden" name="id" value={lead.id} />
        {state.status === "success" ? (
          <p role="status" className="border-l-4 border-success bg-success-tint px-4 py-3">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" ? (
          <p role="alert" className="border-l-4 border-danger bg-danger-tint px-4 py-3">
            {state.message ?? state.fieldErrors?.notes ?? "Changes not saved."}
          </p>
        ) : null}
        <div>
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="field-input"
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {leadStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="field-label">
            Private notes
          </label>
          <textarea id="notes" name="notes" rows={8} defaultValue={v?.notes ?? lead.notes} className="field-input" />
        </div>
        <SubmitButton label="Save changes" pendingLabel="Saving…" className="btn btn-primary" pending={pending} />
      </form>

      <form
        action={deleteLead}
        className="mt-8 border-t border-sage pt-6"
        onSubmit={(event) => {
          if (!window.confirm(`Delete the lead from ${lead.full_name}? This cannot be undone.`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={lead.id} />
        <button type="submit" className="text-[0.9375rem] font-semibold text-danger underline decoration-danger/40 hover:decoration-danger">
          Delete lead
        </button>
      </form>
    </>
  );
}
