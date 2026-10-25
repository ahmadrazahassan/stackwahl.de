"use server";

import { headers } from "next/headers";
import { serverEnv } from "@/lib/env";
import { NEWSLETTER_CONSENT_VERSION, newsletterAvailable } from "@/lib/forms/availability";
import { fieldErrors, newsletterSchema, type FormState } from "@/lib/forms/schemas";
import { getMailer, getNewsletterStore, logConsent, mailFrom } from "@/lib/mail/mailer";
import { consentReference, openToken, sealToken } from "@/lib/newsletter/token";
import { createRateLimiter } from "@/lib/rate-limit";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

const limit = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });
const TOKEN_LIFETIME_MS = 48 * 60 * 60 * 1000;

const unavailable = {
  status: "error" as const,
  message: "Die Anmeldung ist derzeit nicht möglich.",
};

async function linkOrigin() {
  // Production links always point to the canonical domain (no Host-header injection). Only the
  // local outbox used in tests links to the host that served the request.
  if (serverEnv().MAIL_TRANSPORT !== "outbox") return siteConfig.brand.url;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : siteConfig.brand.url;
}

export async function subscribeNewsletter(
  _previous: FormState<"email">,
  formData: FormData,
): Promise<FormState<"email">> {
  const email = String(formData.get("email") ?? "");
  if (!newsletterAvailable()) return { ...unavailable, values: { email } };
  if (String(formData.get("firma") ?? "") !== "") return { status: "ok" };

  const parsed = newsletterSchema.safeParse({ email, firma: "" });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors<"email">(parsed.error), values: { email } };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unbekannt";
  if (!limit(`newsletter:${ip}`).allowed) {
    return {
      status: "error",
      message: "Zu viele Anmeldungen in kurzer Zeit. Bitte versuchen Sie es später erneut.",
      values: { email },
    };
  }

  const store = getNewsletterStore();
  const mailer = getMailer();
  const from = mailFrom();
  const secret = serverEnv().NEWSLETTER_SECRET;
  if (!store || !mailer || !from || !secret) return { ...unavailable, values: { email } };

  // Step 1: the contact is created as pending (not subscribed).
  const id = await store.createPending(parsed.data.email);
  const token = sealToken({ id, exp: Date.now() + TOKEN_LIFETIME_MS }, secret);
  const link = `${await linkOrigin()}${routes.newsletter()}/bestaetigen?token=${encodeURIComponent(token)}`;

  const result = await mailer.send({
    to: parsed.data.email,
    from,
    subject: "Bitte bestätigen Sie Ihre Anmeldung zum Stackwahl-Newsletter",
    text:
      `Guten Tag,\n\nSie haben sich für den Newsletter von Stackwahl angemeldet. Bitte bestätigen Sie die Anmeldung über diesen Link (48 Stunden gültig):\n\n${link}\n\n` +
      "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail. Ohne Bestätigung erhalten Sie keine Newsletter.",
  });
  if (!result.accepted) {
    return {
      status: "error",
      message:
        "Die Bestätigungs-E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
      values: { email },
    };
  }
  return {
    status: "ok",
    message: "Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail.",
  };
}

export async function confirmNewsletter(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!newsletterAvailable()) return unavailable;
  const secret = serverEnv().NEWSLETTER_SECRET;
  const store = getNewsletterStore();
  if (!secret || !store) return unavailable;

  const payload = openToken(String(formData.get("token") ?? ""), secret);
  if (!payload) {
    return {
      status: "error",
      message: "Der Link ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.",
    };
  }
  // Step 2: only an explicit click confirms (link scanners only open the page).
  const confirmed = await store.confirm(payload.id);
  if (!confirmed) {
    return {
      status: "error",
      message: "Diese Anmeldung ist nicht mehr vorhanden. Bitte melden Sie sich erneut an.",
    };
  }
  await logConsent({
    reference: consentReference(payload.id),
    confirmedAt: new Date().toISOString(),
    version: NEWSLETTER_CONSENT_VERSION,
  });
  return { status: "ok", message: "Danke, Ihre Anmeldung ist bestätigt." };
}
