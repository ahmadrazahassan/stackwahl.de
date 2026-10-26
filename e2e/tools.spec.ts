import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Phase 4 flows against the preview build with the local mail outbox (e2e/test-env.ts).

const OUTBOX = join(process.cwd(), ".outbox");

type Mail = { to: string; replyTo?: string; subject: string; text: string };

function mailsTo(address: string): Mail[] {
  let files: string[] = [];
  try {
    files = readdirSync(OUTBOX).filter((f) => f.endsWith(".json") && f !== "newsletter.json");
  } catch {}
  return files
    .map((f) => JSON.parse(readFileSync(join(OUTBOX, f), "utf8")) as Mail)
    .filter((m) => m.to === address || m.replyTo === address);
}

async function expectNoAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
}

test.describe("Software-Finder", () => {
  test("guides through six steps to an explained shortlist", async ({ page }) => {
    await page.goto("/software-finder");
    await expectNoAxe(page);
    await page.getByText("Rechnungen und Angebote schreiben").click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByText("Einnahmen-Überschuss-Rechnung (EÜR)").click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await expect(page.getByText("Schritt 4 von 6")).toBeVisible();
    await page.getByText("Ja", { exact: true }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("button", { name: "Weiter" }).click();
    await page.getByRole("link", { name: "Ergebnis anzeigen" }).click();
    await expect(page).toHaveURL(/\/software-finder\/ergebnis\?.*datev=true/);
    await expect(page.getByText("Platz 1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Passt, weil" }).first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectNoAxe(page);
  });
});

test.describe("Comparison tool and calculator", () => {
  test("compares up to three tools from the URL", async ({ page }) => {
    await page.goto("/vergleich?software=sevdesk,fastbill");
    await expect(page.getByRole("region", { name: /Vergleich: sevdesk, FastBill/ })).toBeVisible();
    await page.getByRole("button", { name: "Billomat" }).click();
    await expect(page).toHaveURL(/software=sevdesk(,|%2C)fastbill(,|%2C)billomat/);
    await expect(page.getByRole("button", { name: "easybill" })).toBeDisabled();
    await expectNoAxe(page);
  });

  test("calculates list-price costs net and gross", async ({ page }) => {
    await page.goto("/kostenrechner?software=fastbill&tarif=0&zahlweise=monatlich&monate=12");
    const result = page.getByRole("region", { name: "Ergebnis" });
    await expect(result.getByText("120,00 €")).toBeVisible();
    await expect(result.getByText("142,80 €")).toBeVisible();
    await expectNoAxe(page);
  });
});

test.describe("Filters and search", () => {
  test("category filters count only documented facts", async ({ page }) => {
    await page.goto("/kategorien/buchhaltungssoftware");
    await expect(page.getByText(/^13 von 13 Programmen/)).toBeVisible();
    await page.getByRole("button", { name: "Kostenloser Tarif" }).click();
    await expect(page).toHaveURL(/filter=kostenlos/);
    await expect(page.getByText(/^4 von 13 Programmen/)).toBeVisible();
  });

  test("search page finds software with German normalization", async ({ page }) => {
    await page.goto("/suche?q=meinbuero");
    // The profile comes first; the comparison with Lexware Office is found as well.
    await expect(page.getByRole("link", { name: /^WISO MeinBüro/ })).toHaveAttribute(
      "href",
      "/software/wiso-meinbuero",
    );
    await expect(
      page.getByRole("link", { name: /Lexware Office vs. WISO MeinBüro/ }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectNoAxe(page);
  });
});

test.describe("Contact form", () => {
  test("validates in German and sends only valid messages", async ({ page }, info) => {
    const email = `kontakt-${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/kontakt");
    await expectNoAxe(page);
    await page.getByRole("button", { name: "Nachricht senden" }).click();
    const name = page.getByLabel("Name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Bitte geben Sie Ihren Namen ein.")).toBeVisible();

    await name.fill("Erika Muster");
    await page.getByLabel("E-Mail-Adresse").fill(email);
    await page.getByLabel("Thema").selectOption("korrektur");
    await page
      .getByRole("textbox", { name: "Nachricht" })
      .fill("Der Preis im Tarif Solo hat sich laut Preisseite geändert.");
    await page.getByRole("button", { name: "Nachricht senden" }).click();
    await expect(page.getByText("Danke, Ihre Nachricht ist angekommen.")).toBeVisible();
    const mails = mailsTo(email);
    expect(mails).toHaveLength(1);
    expect(mails[0].subject).toContain("Hinweis auf eine falsche oder veraltete Angabe");
  });
});

test.describe("Newsletter", () => {
  test("double opt-in: the link opens a page, only the click confirms", async ({ page }, info) => {
    const email = `news-${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/newsletter");
    await page.getByLabel("E-Mail-Adresse").fill(email);
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page.getByText(/Bitte bestätigen Sie Ihre Anmeldung/)).toBeVisible();

    const [mail] = mailsTo(email);
    const link = /https?:\/\/[^\s]+\/newsletter\/bestaetigen\?token=[^\s]+/.exec(mail.text)?.[0];
    expect(link).toBeTruthy();
    expect(link).not.toContain(encodeURIComponent(email));

    type Store = Record<string, { email: string; status: string }>;
    const entry = () =>
      Object.values(
        JSON.parse(readFileSync(join(OUTBOX, "newsletter.json"), "utf8")) as Store,
      ).find((e) => e.email === email);
    const url = new URL(link!);
    await page.goto(url.pathname + url.search);
    expect(entry()?.status).toBe("pending");
    await page.getByRole("button", { name: "Anmeldung bestätigen" }).click();
    await expect(page.getByText("Danke, Ihre Anmeldung ist bestätigt.")).toBeVisible();
    expect(entry()?.status).toBe("confirmed");
    expect(readFileSync(join(OUTBOX, "consent-log.jsonl"), "utf8")).not.toContain(email);
  });

  test("rejects a forged token", async ({ page }) => {
    await page.goto("/newsletter/bestaetigen?token=gefaelscht");
    await page.getByRole("button", { name: "Anmeldung bestätigen" }).click();
    await expect(page.getByText(/ungültig oder abgelaufen/)).toBeVisible();
  });
});

test.describe("Affiliate redirect", () => {
  test("falls back to the profile while no partner link is active", async ({ request }) => {
    const response = await request.get("/go/sevdesk?from=profil&pos=1", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location).pathname).toBe("/software/sevdesk");
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    expect(response.headers()["cache-control"]).toBe("no-store");
  });

  test("sends unknown slugs home", async ({ request }) => {
    const response = await request.get("/go/gibt-es-nicht", { maxRedirects: 0 });
    expect(new URL(response.headers().location).pathname).toBe("/");
  });
});

test.describe("Consent", () => {
  test("shows no banner and sets no cookie while no service needs consent", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("dialog", { name: "Ihre Einwilligung" })).toHaveCount(0);
    expect(await page.context().cookies()).toEqual([]);
  });
});
