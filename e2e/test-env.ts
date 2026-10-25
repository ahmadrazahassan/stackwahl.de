import { randomBytes } from "node:crypto";

// Environment for the preview build and the E2E server: the local mail outbox stands in for the
// real provider, so contact form and newsletter can be tested end to end. The newsletter secret
// is random per run and never committed.
export const TEST_MAIL_ENV = {
  MAIL_TRANSPORT: "outbox",
  MAIL_FROM: "system@stackwahl.test",
  CONTACT_TO: "redaktion@stackwahl.test",
  NEWSLETTER_SECRET: process.env.NEWSLETTER_SECRET ?? randomBytes(32).toString("hex"),
};
