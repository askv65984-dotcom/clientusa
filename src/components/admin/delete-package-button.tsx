"use client";

import { deletePackage } from "@/app/admin/actions";

/** Delete link for the packages list. Asks first, because a deleted package cannot be restored. */
export function DeletePackageButton({ id, name, isBookingOption }: { id: string; name: string; isBookingOption: boolean }) {
  return (
    <form
      action={deletePackage}
      className="ml-4 inline"
      onSubmit={(event) => {
        const warning = isBookingOption
          ? `\n\nThis is the paid option on the Book a consultation page. After deleting it, that page offers only the initial consultation until you choose another package in Settings.`
          : "";
        if (!window.confirm(`Delete “${name}”? This cannot be undone. Past orders keep their records.${warning}`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-[0.9375rem] font-semibold text-danger underline decoration-danger/40 hover:decoration-danger">
        Delete<span className="sr-only"> {name}</span>
      </button>
    </form>
  );
}
