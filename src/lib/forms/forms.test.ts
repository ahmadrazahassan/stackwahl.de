import { describe, expect, it } from "vitest";
import { consentReference, openToken, sealToken } from "../newsletter/token.ts";
import { createRateLimiter } from "../rate-limit.ts";
import { contactSchema, fieldErrors, newsletterSchema } from "./schemas.ts";

const SECRET = "x".repeat(40);

describe("contactSchema", () => {
  const valid = {
    name: "Erika Muster",
    email: "erika@example.com",
    topic: "korrektur",
    message: "Der Preis bei Tarif S hat sich geändert, siehe Preisseite.",
    firma: "",
  };

  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("returns German messages per field", () => {
    const result = contactSchema.safeParse({ ...valid, email: "kaputt", message: "kurz" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toEqual({
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        message: "Bitte schreiben Sie mindestens 20 Zeichen.",
      });
    }
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, firma: "Bot GmbH" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "a@b.de", firma: "x" }).success).toBe(false);
  });
});

describe("rate limiter", () => {
  it("allows the limit per window and then blocks the key", () => {
    let t = 0;
    const limit = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limit("a").allowed).toBe(true);
    expect(limit("a").allowed).toBe(true);
    expect(limit("a")).toEqual({ allowed: false, retryAfterSeconds: 1 });
    expect(limit("b").allowed).toBe(true);
    t = 1001;
    expect(limit("a").allowed).toBe(true);
  });
});

describe("newsletter tokens", () => {
  it("round-trips and contains no e-mail address", () => {
    const token = sealToken({ id: "abc123", exp: 2_000 }, SECRET);
    expect(openToken(token, SECRET, 1_000)).toEqual({ id: "abc123", exp: 2_000 });
    expect(Buffer.from(token, "base64url").toString("latin1")).not.toContain("abc123");
  });

  it("rejects expired, forged and foreign tokens", () => {
    const token = sealToken({ id: "abc123", exp: 2_000 }, SECRET);
    expect(openToken(token, SECRET, 3_000)).toBeNull();
    expect(openToken(token, "y".repeat(40), 1_000)).toBeNull();
    const tampered = token.slice(0, -2) + (token.endsWith("A") ? "BB" : "AA");
    expect(openToken(tampered, SECRET, 1_000)).toBeNull();
    expect(openToken("unsinn", SECRET, 1_000)).toBeNull();
  });

  it("requires a long secret", () => {
    expect(() => sealToken({ id: "a", exp: 1 }, "kurz")).toThrow();
  });

  it("derives a stable consent reference without the id itself", () => {
    expect(consentReference("abc123")).toBe(consentReference("abc123"));
    expect(consentReference("abc123")).not.toContain("abc123");
  });
});
