import { describe, expect, it } from "vitest";
import { parsePosition, resolveRedirect, type RedirectInput } from "./affiliate.ts";

const base: RedirectInput = {
  slug: "beispiel",
  from: "profil",
  pos: "1",
  enabled: true,
  links: [
    {
      software: "beispiel",
      targetUrl: "https://partner.example.com/go?campaign=x",
      subIdParam: "subid",
      active: true,
    },
  ],
  knownSoftware: new Set(["beispiel", "andere"]),
};

describe("resolveRedirect", () => {
  it("sends active partner links to the target with a non-personal sub id", () => {
    const result = resolveRedirect(base);
    expect(result.kind).toBe("partner");
    expect(result.location).toBe("https://partner.example.com/go?campaign=x&subid=profil-1");
  });

  it("drops values that are not whitelisted", () => {
    const result = resolveRedirect({ ...base, from: "evil<script>", pos: "999" });
    expect(result.location).toContain("subid=unbekannt-0");
  });

  it("falls back to the profile when the link is inactive or the feature is off", () => {
    const inactive = { ...base, links: [{ ...base.links[0], active: false }] };
    expect(resolveRedirect(inactive)).toEqual({ kind: "profile", location: "/software/beispiel" });
    expect(resolveRedirect({ ...base, enabled: false })).toEqual({
      kind: "profile",
      location: "/software/beispiel",
    });
    expect(resolveRedirect({ ...base, slug: "andere" }).kind).toBe("profile");
  });

  it("sends unknown slugs home", () => {
    expect(resolveRedirect({ ...base, slug: "gibt-es-nicht" })).toEqual({
      kind: "home",
      location: "/",
    });
  });
});

describe("parsePosition", () => {
  it("accepts 1 to 50 only", () => {
    expect(parsePosition("3")).toBe(3);
    expect(parsePosition("0")).toBeNull();
    expect(parsePosition("51")).toBeNull();
    expect(parsePosition("2e1")).toBeNull();
  });
});
