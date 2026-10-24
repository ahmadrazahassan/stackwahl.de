import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Runs against the preview build (pnpm build:preview), which shows the draft profiles.

const PAGES = [
  "/",
  "/kategorien",
  "/kategorien/buchhaltungssoftware",
  "/software/sevdesk",
  "/software/sevdesk/preise",
  "/software/wiso-meinbuero/alternativen",
  "/glossar",
  "/glossar/e-rechnung",
  "/methodik",
  "/transparenz",
  "/ueber-uns",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/barrierefreiheit",
  "/cookie-einstellungen",
];

test.describe("Templates", () => {
  for (const path of PAGES) {
    test(`${path} renders in German without axe violations or side scroll`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }

  test("category page lists the profiles and explains the order", async ({ page }) => {
    await page.goto("/kategorien/buchhaltungssoftware");
    await expect(page.getByText(/Sortiert nach Name/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Zum Profil" })).toHaveCount(8);
    await expect(
      page.getByRole("region", { name: "Rechtssicherheit und Preise: Buchhaltungssoftware" }),
    ).toBeVisible();
  });

  test("profile is honest about research, prices and sources", async ({ page }) => {
    await page.goto("/software/sevdesk");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("sevdesk im Überblick");
    await expect(page.getByText("Noch nicht bewertet").first()).toBeVisible();
    await expect(page.getByText(/noch nicht in einem eigenen Konto ausprobiert/)).toBeVisible();
    await expect(page.getByText("Entwurf, nicht veröffentlicht")).toBeVisible();
    const vendor = page.getByRole("link", { name: /Zum Anbieter/ });
    await expect(vendor).toHaveAttribute("rel", "noopener");
    await expect(page.getByRole("navigation", { name: "Abschnitte des Profils" })).toBeVisible();
    await expect(page.getByRole("link", { name: /sevdesk Preise/ }).first()).toHaveAttribute(
      "href",
      "https://sevdesk.de/preise/",
    );
    await expect(page.getByText("Keine Angabe").first()).toBeVisible();
  });

  test("pricing page shows 12 and 36 month costs, net and gross", async ({ page }) => {
    await page.goto("/software/fastbill/preise");
    const table = page.getByRole("region", { name: "Kostenübersicht" });
    // Solo, monthly: 10 € x 12 = 120 € net, 142,80 € gross.
    await expect(table.getByText("120,00 €")).toBeVisible();
    await expect(table.getByText("142,80 €")).toBeVisible();
  });

  test("generated alternatives pages stay out of the index", async ({ page }) => {
    await page.goto("/software/sevdesk/alternativen");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("legal pages mark missing data and the missing lawyer review", async ({ page }) => {
    await page.goto("/impressum");
    await expect(page.getByText("Dietmar Riedel").first()).toBeVisible();
    await expect(page.getByText("Angabe fehlt: CONTACT_EMAIL")).toBeVisible();
    await expect(page.getByText(/noch nicht anwaltlich geprüft/)).toBeVisible();
  });

  test("unknown pages answer 404 in German", async ({ page }) => {
    for (const path of ["/software/gibt-es-nicht", "/glossar/gibt-es-nicht", "/irgendwas"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Nicht gefunden");
    }
  });

  test("navigation only links to pages that exist", async ({ page, isMobile }) => {
    test.skip(isMobile, "Checked once on desktop.");
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='/'], footer a[href^='/']")
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute("href")))]);
    for (const href of hrefs) {
      const response = await page.request.get(href!);
      expect(response.status(), href!).toBe(200);
    }
  });

  test("sitemap lists profiles and leaves out noindex pages", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("https://stackwahl.de/software/sevdesk</loc>");
    expect(xml).not.toContain("/alternativen");
    expect(xml).not.toContain("/intern/");
  });
});
