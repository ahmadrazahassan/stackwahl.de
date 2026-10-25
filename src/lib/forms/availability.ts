import "server-only";
import { serverEnv } from "@/lib/env";
import { isPlaceholder } from "@/lib/placeholders";
import { siteConfig } from "@/site.config";

// A form is shown only when it can really deliver (Section 8: success only after the provider
// accepted the message). Without a mail transport, sender and recipient the form stays hidden.

export function contactRecipient(): string | null {
  const env = serverEnv();
  if (env.CONTACT_TO) return env.CONTACT_TO;
  const email = siteConfig.legal.email;
  return isPlaceholder(email) ? null : email;
}

export function contactFormAvailable(): boolean {
  const env = serverEnv();
  return Boolean(
    siteConfig.features.contactForm && env.MAIL_TRANSPORT && env.MAIL_FROM && contactRecipient(),
  );
}

export function newsletterAvailable(): boolean {
  const env = serverEnv();
  return Boolean(
    siteConfig.features.newsletter && env.MAIL_TRANSPORT && env.MAIL_FROM && env.NEWSLETTER_SECRET,
  );
}

/** Version of the consent text shown at sign-up; changes when the wording changes. */
export const NEWSLETTER_CONSENT_VERSION = "2026-10-24";
