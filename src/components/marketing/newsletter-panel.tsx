"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Headline } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import type { FormState } from "@/lib/forms/schemas";
import { routes } from "@/lib/routes";

type Action = (state: FormState<"email">, data: FormData) => Promise<FormState<"email">>;

const preview: Action = async () => ({ status: "idle" });

/**
 * Newsletter sign-up, step one of the double opt-in (Section 8). The server action creates a
 * pending contact and sends the confirmation link. Without an action (styleguide) it only shows
 * the form.
 */
export function NewsletterPanel({
  action = preview,
  className,
}: {
  action?: Action;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const error = state.fieldErrors?.email;

  return (
    <div className={cn("grid gap-10 lg:grid-cols-12", className)}>
      <div className="min-w-0 lg:col-span-6">
        <Headline size="h2">Einmal im Monat: neue Profile, Preisänderungen und Fristen.</Headline>
        <p className="mt-6 max-w-[48ch] text-body text-muted">
          Nach der Anmeldung bestätigen Sie per Link, abmelden können Sie sich jederzeit. Ihre
          Adresse geben wir nicht weiter. Details in der{" "}
          <Link
            href={routes.privacy()}
            className="underline decoration-1 underline-offset-4 hover:text-ink"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
      {state.status === "ok" ? (
        <p
          role="status"
          className="self-end rounded-card bg-primary-tint p-6 text-body lg:col-span-5 lg:col-start-8"
        >
          {state.message}
        </p>
      ) : (
        <form
          action={formAction}
          noValidate
          className="flex min-w-0 flex-col gap-4 lg:col-span-5 lg:col-start-8 lg:self-end"
        >
          <div aria-hidden="true" className="hidden">
            <label>
              Firma
              <input type="text" name="firma" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <Field label="E-Mail-Adresse" error={error}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="name@firma.de"
                defaultValue={state.values?.email}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
              />
            )}
          </Field>
          <Button type="submit" variant="dark" disabled={pending} className="self-start">
            {pending ? "Wird gesendet …" : "Anmelden"}
          </Button>
          <p role="status" className="min-h-6 text-small font-medium text-negative">
            {state.status === "error" && state.message ? state.message : ""}
          </p>
        </form>
      )}
    </div>
  );
}
