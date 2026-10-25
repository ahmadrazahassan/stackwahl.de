import "server-only";
import { z } from "zod";

// Server environment (Section 5.7: validated at the edges). All values are optional: without
// them the forms stay hidden, so the site never claims to send mail it cannot send.

const envSchema = z.object({
  /** "outbox" writes mails to .outbox/ (development and tests). A real provider comes later. */
  MAIL_TRANSPORT: z.enum(["outbox"]).optional(),
  /** Recipient of the contact form. */
  CONTACT_TO: z.email().optional(),
  /** Sender address for system mails. */
  MAIL_FROM: z.email().optional(),
  /** At least 32 characters; seals newsletter confirmation tokens. */
  NEWSLETTER_SECRET: z.string().min(32).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function serverEnv(): ServerEnv {
  const parsed = envSchema.safeParse({
    MAIL_TRANSPORT: process.env.MAIL_TRANSPORT || undefined,
    CONTACT_TO: process.env.CONTACT_TO || undefined,
    MAIL_FROM: process.env.MAIL_FROM || undefined,
    NEWSLETTER_SECRET: process.env.NEWSLETTER_SECRET || undefined,
  });
  if (!parsed.success) {
    throw new Error(
      `Ungültige Umgebungsvariablen: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    );
  }
  return parsed.data;
}
