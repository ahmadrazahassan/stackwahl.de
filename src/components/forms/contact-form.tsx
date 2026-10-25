"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { CONTACT_TOPICS, type FormState } from "@/lib/forms/schemas";

type ContactField = "name" | "email" | "topic" | "message";
type Action = (state: FormState<ContactField>, data: FormData) => Promise<FormState<ContactField>>;

/** Contact form on a server action; works without JavaScript (progressive enhancement). */
export function ContactForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const errors = state.fieldErrors ?? {};
  const values = state.status === "ok" ? {} : (state.values ?? {});

  if (state.status === "ok") {
    return (
      <p role="status" className="rounded-card bg-primary-tint p-6 text-body">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} noValidate className="flex max-w-2xl flex-col gap-6">
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Firma
          <input type="text" name="firma" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="name"
              autoComplete="name"
              defaultValue={values.name}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              required
            />
          )}
        </Field>
        <Field label="E-Mail-Adresse" error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              defaultValue={values.email}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              required
            />
          )}
        </Field>
      </div>
      <Field label="Thema" error={errors.topic}>
        {({ id, describedBy, invalid }) => (
          <Select
            id={id}
            name="topic"
            defaultValue={values.topic ?? ""}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            required
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {Object.entries(CONTACT_TOPICS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        label="Nachricht"
        error={errors.message}
        hint="Bei Korrekturen hilft ein Link zur Quelle."
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message"
            rows={6}
            defaultValue={values.message}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            required
          />
        )}
      </Field>
      <p className="text-small text-muted">
        Wir verwenden Ihre Angaben nur, um Ihre Nachricht zu beantworten. Details in der
        Datenschutzerklärung.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Wird gesendet …" : "Nachricht senden"}
        </Button>
        <p role="status" className="text-small font-medium text-negative">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
