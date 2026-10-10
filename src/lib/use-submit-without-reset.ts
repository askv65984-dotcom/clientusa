"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React resets a form after its `action` runs, which snaps selects and radios back to their
 * first-render values even when the save worked. Submitting through this handler skips that reset.
 * The form keeps its `action` attribute, so it still works before JavaScript loads.
 */
export function useSubmitWithoutReset(formAction: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };
}
