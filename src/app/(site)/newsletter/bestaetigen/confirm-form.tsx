"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/forms/schemas";

type Action = (state: FormState, data: FormData) => Promise<FormState>;

/** The link only opens this page; the subscription is confirmed by the button click. */
export function ConfirmForm({ action }: { action: Action }) {
  const [token] = useQueryState("token", parseAsString.withDefault(""));
  const [state, formAction, pending] = useActionState(action, { status: "idle" });

  if (state.status === "ok") {
    return (
      <p role="status" className="rounded-card bg-primary-tint p-6 text-body">
        {state.message}
      </p>
    );
  }
  if (!token) {
    return (
      <p className="text-body text-muted">
        Dieser Link ist unvollständig. Bitte nutzen Sie den Link aus der E-Mail.
      </p>
    );
  }
  return (
    <form action={formAction} className="flex flex-col items-start gap-4">
      <input type="hidden" name="token" value={token} />
      <p className="text-body">Bitte bestätigen Sie, dass Sie den Newsletter erhalten möchten.</p>
      <Button type="submit" disabled={pending}>
        {pending ? "Wird bestätigt …" : "Anmeldung bestätigen"}
      </Button>
      <p role="status" className="text-small font-medium text-negative">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
