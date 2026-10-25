import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// Sealed confirmation tokens for the double opt-in (Section 8): authenticated encryption
// (AES-256-GCM), an expiry, and no e-mail address inside, only the pending subscription id.

export type TokenPayload = { id: string; exp: number };

function key(secret: string): Buffer {
  if (secret.length < 32)
    throw new Error("NEWSLETTER_SECRET muss mindestens 32 Zeichen lang sein.");
  return createHash("sha256").update(secret).digest();
}

export function sealToken(payload: TokenPayload, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

/** Returns the payload, or null when the token is forged, damaged or expired. */
export function openToken(token: string, secret: string, now = Date.now()): TokenPayload | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(secret), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const text = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString(
      "utf8",
    );
    const payload = JSON.parse(text) as TokenPayload;
    if (typeof payload.id !== "string" || typeof payload.exp !== "number") return null;
    return payload.exp > now ? payload : null;
  } catch {
    return null;
  }
}

/** One-way reference for the consent log, so the log holds no personal data. */
export function consentReference(id: string): string {
  return createHash("sha256").update(`stackwahl-consent:${id}`).digest("hex").slice(0, 32);
}
