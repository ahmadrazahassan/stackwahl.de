"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Headline } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

/**
 * Newsletter sign-up UI. The double opt in flow (Section 8) is wired in Phase 4; until then
 * `onSubmit` is supplied by the caller (the styleguide shows the states only).
 */
export function NewsletterPanel({
  onSubmit,
  className,
}: {
  onSubmit?: (email: string) => Promise<"ok" | "error">;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string>();

  return (
    <div className={cn("grid gap-10 lg:grid-cols-12", className)}>
      <div className="lg:col-span-6">
        <Headline size="h2" tail="Einmal im Monat.">
          Neue Tests, Preisänderungen und Fristen.
        </Headline>
        <p className="mt-6 max-w-[48ch] text-body text-muted">
          Kein Spam, keine Weitergabe Ihrer Adresse. Sie können sich jederzeit abmelden. Details in
          der{" "}
          <a
            href={routes.privacy()}
            className="underline decoration-1 underline-offset-4 hover:text-ink"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>
      <form
        noValidate
        className="flex flex-col gap-4 lg:col-span-5 lg:col-start-8 lg:self-end"
        onSubmit={async (event) => {
          event.preventDefault();
          const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
          }
          setError(undefined);
          if (!onSubmit) return;
          setStatus("sending");
          setStatus(await onSubmit(email));
        }}
      >
        {/* Honeypot: hidden from people, filled by bots. */}
        <input
          type="text"
          name="firma"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Field label="E-Mail-Adresse" error={error}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@firma.de"
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
            />
          )}
        </Field>
        <Button type="submit" variant="dark" disabled={status === "sending"} className="self-start">
          {status === "sending" ? "Wird gesendet …" : "Anmelden"}
        </Button>
        <p role="status" className="min-h-6 text-small">
          {status === "ok"
            ? "Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail."
            : status === "error"
              ? "Das hat nicht geklappt. Bitte versuchen Sie es später erneut."
              : ""}
        </p>
      </form>
    </div>
  );
}
