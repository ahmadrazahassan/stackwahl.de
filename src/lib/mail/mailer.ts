import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { serverEnv } from "@/lib/env";

// Mail behind a provider interface (Section 8). The outbox transport writes each message as JSON
// to .outbox/ for development and E2E tests. The real provider ({{MAIL_PROVIDER}}) plugs in here.

export type MailMessage = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export type SendResult = { accepted: true; id: string } | { accepted: false; reason: string };

export interface Mailer {
  send(message: MailMessage): Promise<SendResult>;
}

export const OUTBOX_DIR = join(process.cwd(), ".outbox");

class OutboxMailer implements Mailer {
  async send(message: MailMessage): Promise<SendResult> {
    const id = randomUUID();
    await mkdir(OUTBOX_DIR, { recursive: true });
    await writeFile(
      join(OUTBOX_DIR, `${Date.now()}-${id}.json`),
      JSON.stringify({ id, ...message }, null, 2),
    );
    return { accepted: true, id };
  }
}

/** The configured mailer, or null when none is configured (forms stay hidden then). */
export function getMailer(): Mailer | null {
  return serverEnv().MAIL_TRANSPORT === "outbox" ? new OutboxMailer() : null;
}

export function mailFrom(): string | null {
  return serverEnv().MAIL_FROM ?? null;
}

// ---------------------------------------------------------------------------------------------
// Newsletter store. The real provider will create the contact unsubscribed in its own segment;
// the outbox store keeps the same two-step contract in a local JSON file.

export interface NewsletterStore {
  createPending(email: string): Promise<string>;
  confirm(id: string): Promise<boolean>;
}

type StoreFile = Record<
  string,
  { email: string; status: "pending" | "confirmed"; createdAt: string }
>;

class OutboxNewsletterStore implements NewsletterStore {
  private file = join(OUTBOX_DIR, "newsletter.json");

  private async read(): Promise<StoreFile> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as StoreFile;
    } catch {
      return {};
    }
  }

  private async write(data: StoreFile) {
    await mkdir(OUTBOX_DIR, { recursive: true });
    await writeFile(this.file, JSON.stringify(data, null, 2));
  }

  async createPending(email: string) {
    const data = await this.read();
    const id = randomUUID();
    data[id] = { email, status: "pending", createdAt: new Date().toISOString() };
    await this.write(data);
    return id;
  }

  async confirm(id: string) {
    const data = await this.read();
    const entry = data[id];
    if (!entry) return false;
    entry.status = "confirmed";
    await this.write(data);
    return true;
  }
}

export function getNewsletterStore(): NewsletterStore | null {
  return serverEnv().MAIL_TRANSPORT === "outbox" ? new OutboxNewsletterStore() : null;
}

/** Consent log without personal data: a one-way reference, the time and the text version. */
export async function logConsent(entry: {
  reference: string;
  confirmedAt: string;
  version: string;
}) {
  await mkdir(OUTBOX_DIR, { recursive: true });
  const file = join(OUTBOX_DIR, "consent-log.jsonl");
  let existing = "";
  try {
    existing = await readFile(file, "utf8");
  } catch {}
  await writeFile(file, `${existing}${JSON.stringify(entry)}\n`);
}
