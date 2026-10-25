"use server";

import { headers } from "next/headers";
import { contactFormAvailable, contactRecipient } from "@/lib/forms/availability";
import { CONTACT_TOPICS, contactSchema, fieldErrors, type FormState } from "@/lib/forms/schemas";
import { getMailer, mailFrom } from "@/lib/mail/mailer";
import { createRateLimiter } from "@/lib/rate-limit";

type ContactField = "name" | "email" | "topic" | "message";

const limit = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

async function clientKey(form: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unbekannt";
  return `${form}:${ip}`;
}

export async function sendContact(
  _previous: FormState<ContactField>,
  formData: FormData,
): Promise<FormState<ContactField>> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  if (!contactFormAvailable()) {
    return { status: "error", message: "Das Kontaktformular ist derzeit nicht verfügbar.", values };
  }

  // Honeypot filled: answer like a success, but send nothing.
  if (String(formData.get("firma") ?? "") !== "") return { status: "ok" };

  const parsed = contactSchema.safeParse({ ...values, firma: "" });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfen Sie die markierten Felder.",
      fieldErrors: fieldErrors<ContactField>(parsed.error),
      values,
    };
  }

  const rate = limit(await clientKey("kontakt"));
  if (!rate.allowed) {
    return {
      status: "error",
      message: `Zu viele Nachrichten in kurzer Zeit. Bitte versuchen Sie es in ${Math.ceil(rate.retryAfterSeconds / 60)} Minuten erneut.`,
      values,
    };
  }

  const mailer = getMailer();
  const to = contactRecipient();
  const from = mailFrom();
  if (!mailer || !to || !from) {
    return { status: "error", message: "Das Kontaktformular ist derzeit nicht verfügbar.", values };
  }

  const { name, email, topic, message } = parsed.data;
  const result = await mailer.send({
    to,
    from,
    replyTo: email,
    subject: `Kontaktformular: ${CONTACT_TOPICS[topic]}`,
    text: `Name: ${name}\nE-Mail: ${email}\nThema: ${CONTACT_TOPICS[topic]}\n\n${message}`,
  });

  // Success only after the provider accepted the message (Section 8).
  if (!result.accepted) {
    return {
      status: "error",
      message: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
      values,
    };
  }
  return {
    status: "ok",
    message: "Danke, Ihre Nachricht ist angekommen. Wir melden uns per E-Mail.",
  };
}
