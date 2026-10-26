import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkContent, utcToday, type ContentSet } from "./guards.ts";
import { softwareSchema, type Software } from "./schemas.ts";

// Every guard from Section 6 is proven here: a valid fixture passes, each broken variant fails
// with the expected code.

const TODAY = "2026-10-24";
const src = (accessed = TODAY) => ({
  url: "https://example.com/quelle",
  title: "Testquelle",
  accessed,
});

function validSoftware(overrides: Partial<Software> = {}): Software {
  const fact = { status: "ja" as const, source: src() };
  return softwareSchema.parse({
    slug: "beispiel",
    name: "Beispiel",
    vendor: "beispiel-gmbh",
    categories: ["buchhaltungssoftware"],
    status: "published",
    verification: "verified",
    lastReviewed: TODAY,
    author: "erika-muster",
    summary: "Ein Beispielprodukt für die Tests der Inhaltsprüfungen, ohne echte Angaben.",
    website: "https://example.com",
    marketAvailability: { status: "verfuegbar", source: src() },
    targetGroups: ["freiberufler"],
    deployment: ["cloud"],
    apps: { web: true, ios: false, android: false },
    freeTrialDays: 14,
    freePlan: false,
    compliance: {
      gobd: fact,
      eRechnungEmpfang: fact,
      eRechnungVersand: fact,
      datevExport: fact,
      elster: fact,
      kleinunternehmer: fact,
      bankanbindung: fact,
      serverstandort: fact,
      avv: fact,
      deutscherSupport: { status: "unbekannt" },
    },
    features: { rechnungen: fact },
    plans: [
      {
        name: "Start",
        monthlyCents: 990,
        yearlyMonthlyCents: 790,
        perUser: false,
        net: true,
        includes: ["Rechnungen"],
        source: src(),
      },
    ],
    pros: ["Erster sachlicher Vorteil", "Zweiter sachlicher Vorteil", "Dritter sachlicher Vorteil"],
    cons: [
      "Erster sachlicher Nachteil",
      "Zweiter sachlicher Nachteil",
      "Dritter sachlicher Nachteil",
    ],
    idealFor: ["Freiberufler"],
    notIdealFor: ["Konzerne"],
    ...overrides,
  });
}

function set(overrides: Partial<ContentSet> = {}): ContentSet {
  return {
    vendors: [
      {
        slug: "beispiel-gmbh",
        name: "Beispiel",
        legalName: "Beispiel GmbH",
        country: "Deutschland",
        city: "Berlin",
        website: "https://example.com",
        sources: [src()],
      },
    ],
    categories: [
      {
        slug: "buchhaltungssoftware",
        name: "Buchhaltungssoftware",
        description: "Kategorie für Tests.",
        intro: "Eine Einleitung, die lang genug für das Schema der Kategorie ist.",
        launchOrder: 1,
        status: "published",
      },
    ],
    software: [validSoftware()],
    authors: [
      {
        slug: "erika-muster",
        name: "Erika Muster",
        role: "Redaktion",
        bio: "Eine Testperson für die Guards, nur in Unit-Tests verwendet.",
        realPerson: true,
        expertise: ["Buchhaltung"],
        links: [],
      },
    ],
    comparisons: [],
    affiliateLinks: [],
    guides: [],
    glossary: [],
    ...overrides,
  };
}

const codes = (content: ContentSet, production = true) =>
  checkContent(content, { today: TODAY, production })
    .filter((i) => i.severity === "error")
    .map((i) => i.code);

describe("checkContent", () => {
  it("accepts a valid content set", () => {
    expect(codes(set())).toEqual([]);
  });

  it("finds duplicate slugs", () => {
    expect(codes(set({ software: [validSoftware(), validSoftware()] }))).toContain(
      "duplicate-slug",
    );
  });

  it("finds unresolved references", () => {
    expect(codes(set({ software: [validSoftware({ vendor: "gibt-es-nicht" })] }))).toContain(
      "unresolved-reference",
    );
    expect(codes(set({ software: [validSoftware({ categories: ["fehlt"] })] }))).toContain(
      "unresolved-reference",
    );
  });

  it("finds future dates in UTC", () => {
    expect(codes(set({ software: [validSoftware({ lastReviewed: "2026-10-25" })] }))).toContain(
      "future-date",
    );
  });

  it("fails stale prices on published pages in production, warns in development", () => {
    const stale = validSoftware();
    stale.plans[0].source.accessed = "2026-07-01"; // 115 days
    expect(codes(set({ software: [stale] }))).toContain("stale-price");
    const dev = checkContent(set({ software: [stale] }), { today: TODAY, production: false });
    expect(dev.find((i) => i.code === "stale-price")?.severity).toBe("warning");
  });

  it("fails stale compliance facts after 180 days", () => {
    const stale = validSoftware();
    stale.compliance.gobd = { status: "ja", source: src("2026-01-01") };
    expect(codes(set({ software: [stale] }))).toContain("stale-fact");
  });

  it("finds banned wording", () => {
    expect(
      codes(
        set({
          software: [
            validSoftware({
              summary: "Die revolutionäre Lösung für alle Buchhaltungsfragen in Deutschland.",
            }),
          ],
        }),
      ),
    ).toContain("copy");
  });

  it("finds Du-form and wrong number formats", () => {
    const s = validSoftware({
      pros: [
        "Du sparst viel Zeit am Monatsende",
        "Kostet nur 9.90 € im Monat",
        "Ein dritter normaler Vorteil",
      ],
    });
    expect(codes(set({ software: [s] })).filter((c) => c === "copy")).toHaveLength(2);
  });

  it("rejects test claims without a documented test", () => {
    expect(
      codes(
        set({
          software: [
            validSoftware({
              verdict: "Wir haben das Programm ausführlich getestet und empfehlen es.",
            }),
          ],
        }),
      ),
    ).toContain("test-claim");
  });

  it("requires verification and a real author for published profiles", () => {
    expect(codes(set({ software: [validSoftware({ verification: "unverified" })] }))).toContain(
      "unverified-published",
    );
    expect(codes(set({ software: [validSoftware({ author: null })] }))).toContain("missing-author");
    // Drafts may be unverified and without author.
    expect(
      codes(
        set({
          software: [validSoftware({ status: "draft", verification: "unverified", author: null })],
        }),
      ),
    ).toEqual([]);
  });

  it("requires an explanation when a product is not fully available in Germany", () => {
    const s = validSoftware({ marketAvailability: { status: "eingeschraenkt", source: src() } });
    expect(codes(set({ software: [s] }))).toContain("unavailable-without-note");
  });

  it("applies copy rules, test claims and source dates to the long review", () => {
    const section = (paragraph: string, accessed = "2026-10-01") => ({
      id: "abschnitt",
      title: "Ein Abschnitt",
      paragraphs: [paragraph],
      sources: [{ ...src(), accessed }],
    });
    const review = (paragraph: string, accessed?: string) => ({
      sections: Array.from({ length: 4 }, () => section(paragraph, accessed)),
    });
    const ok = "Die Software erstellt Rechnungen und überträgt die UStVA an das Finanzamt.";
    expect(codes(set({ software: [validSoftware({ review: review(ok) })] }))).toEqual([]);
    expect(
      codes(set({ software: [validSoftware({ review: review(`${ok} Wir haben es getestet.`) })] })),
    ).toContain("test-claim");
    expect(
      codes(set({ software: [validSoftware({ review: review(`${ok} Das klappt nahtlos.`) })] })),
    ).toContain("copy");
    expect(
      codes(set({ software: [validSoftware({ review: review(ok, "2099-01-01") })] })),
    ).toContain("future-date");
  });

  it("requires every logo file to exist and to be listed in LOGOS.md", () => {
    const logo = {
      file: "/logos/beispiel.svg",
      width: 120,
      height: 30,
      sourceUrl: "https://example.com/presse",
      accessed: "2026-10-01",
    };
    const content = set({ software: [validSoftware({ logo })] });
    const check = (publicFiles: string[], logosDoc: string) =>
      checkContent(content, {
        today: TODAY,
        production: true,
        publicFiles: new Set(publicFiles),
        logosDoc,
      }).filter((i) => i.code === "logo-asset");
    expect(check([logo.file], `| Beispiel | ${logo.file} |`)).toEqual([]);
    expect(check([], `| Beispiel | ${logo.file} |`)).toHaveLength(1);
    expect(check([logo.file], "No logos added yet.")).toHaveLength(1);
  });
});

describe("schemas", () => {
  it("require a source for every fact except 'unbekannt'", () => {
    const result = softwareSchema.safeParse({
      ...validSoftware(),
      compliance: { ...validSoftware().compliance, gobd: { status: "ja" } },
    });
    expect(result.success).toBe(false);
  });

  it("require three to six pros and cons", () => {
    expect(
      softwareSchema.safeParse({ ...validSoftware(), pros: ["Nur ein Vorteil hier"] }).success,
    ).toBe(false);
  });

  it("store money as integer cents", () => {
    const s = validSoftware();
    const broken = { ...s, plans: [{ ...s.plans[0], monthlyCents: 9.9 }] };
    expect(softwareSchema.safeParse(broken).success).toBe(false);
  });

  it("accept only known feature keys", () => {
    const s = validSoftware();
    expect(
      softwareSchema.safeParse({ ...s, features: { teleportation: s.features.rechnungen } })
        .success,
    ).toBe(false);
  });
});

describe("utcToday", () => {
  it("uses the UTC date, not the local date", () => {
    expect(utcToday(new Date("2026-10-24T23:30:00-02:00"))).toBe("2026-10-25");
  });
});

describe("content:validate script", () => {
  it("fails the build when a content file violates the schema", () => {
    const config = join(
      process.cwd(),
      "src",
      "content",
      "__fixtures__",
      "invalid",
      "content-collections.ts",
    );
    let output = "";
    let failed = false;
    try {
      execFileSync(process.execPath, ["scripts/validate-content.ts", "--config", config], {
        encoding: "utf8",
        stdio: "pipe",
      });
    } catch (error) {
      failed = true;
      output = String((error as { stderr?: string }).stderr ?? "");
    }
    expect(failed).toBe(true);
    expect(output).toMatch(/Schemafehler categories\/kaputt/);
  }, 60_000);
});
