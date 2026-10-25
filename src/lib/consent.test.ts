import { describe, expect, it } from "vitest";
import {
  CONSENT_SERVICES,
  CONSENT_VERSION,
  decide,
  isGranted,
  needsDecision,
  parseConsent,
  serializeConsent,
  type ConsentService,
} from "./consent.ts";

const service: ConsentService = {
  id: "analyse",
  name: "Analysedienst",
  provider: "Anbieter",
  purpose: "Reichweitenmessung",
  privacyUrl: "https://example.com/datenschutz",
};

describe("consent", () => {
  it("has no services today, so no banner is shown", () => {
    expect(CONSENT_SERVICES).toEqual([]);
    expect(needsDecision(CONSENT_SERVICES, null)).toBe(false);
  });

  it("asks once a service exists and nothing is stored", () => {
    expect(needsDecision([service], null)).toBe(true);
  });

  it("asks again after a version change", () => {
    expect(needsDecision([service], { version: CONSENT_VERSION - 1, granted: [] })).toBe(true);
    expect(needsDecision([service], { version: CONSENT_VERSION, granted: [] })).toBe(false);
  });

  it("treats refusing like accepting: both are stored decisions", () => {
    const refused = decide([service], []);
    expect(isGranted("analyse", refused)).toBe(false);
    expect(needsDecision([service], refused)).toBe(false);
  });

  it("grants only known services and round-trips through the cookie value", () => {
    const state = decide([service], ["analyse", "unbekannt"]);
    expect(state.granted).toEqual(["analyse"]);
    expect(parseConsent(serializeConsent(state))).toEqual(state);
    expect(parseConsent("kaputt")).toBeNull();
  });
});
