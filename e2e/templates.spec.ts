import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Runs against the preview build (pnpm build:preview), which shows the draft profiles.

const PAGES = [
  "/",
  "/kategorien",
  "/kategorien/buchhaltungssoftware",
  "/software/sevdesk",
  "/software/sevdesk/preise",
  "/software/weclapp",
  "/software/papierkram",
  "/software/fastbill",
  "/software/collmex/preise",
  "/kategorien/erp-software",
  "/software/wiso-meinbuero/alternativen",
  "/ratgeber",
  "/ratgeber/erp-kleine-unternehmen-kosten",
  "/ratgeber/sevdesk-oder-lexware-office",
  "/vergleich/sevdesk-vs-papierkram",
  "/vergleich/weclapp-vs-xentral",
  "/software-fuer",
  "/software-fuer/handwerk",
  "/glossar",
  "/glossar/e-rechnung",
  "/methodik",
  "/redaktion",
  "/redaktion/milan-schultheis",
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
    await expect(page.getByText(/Sortiert nach der Recherche-Wertung/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Zum Profil" })).toHaveCount(13);
    await expect(
      page.getByRole("region", { name: "Rechtssicherheit und Preise: Buchhaltungssoftware" }),
    ).toBeVisible();
  });

  test("long review lists its sections and the sources of each section", async ({ page }) => {
    await page.goto("/software/weclapp");
    const detail = page.getByRole("region", { name: "weclapp im Detail" });
    await expect(detail).toBeVisible();
    await expect(detail.getByRole("navigation", { name: "Abschnitte im Detail" })).toBeVisible();
    const prices = detail.getByRole("region", { name: "Preise und Kosten im Detail" });
    await expect(prices.getByText(/3\.096 € netto/)).toBeVisible();
    await expect(
      prices.getByRole("link", { name: /weclapp Preise und Funktionen/ }),
    ).toHaveAttribute("href", "https://www.weclapp.com/de/preise/");
    await expect(page.getByRole("link", { name: "Im Detail" }).first()).toBeVisible();
  });

  test("ERP category lists its profiles", async ({ page }) => {
    await page.goto("/kategorien/erp-software");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("ERP-Software");
    await expect(page.getByRole("link", { name: "Zum Profil" })).toHaveCount(6);
  });

  test("profile is honest about research, prices and sources", async ({ page }) => {
    await page.goto("/software/sevdesk");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("sevdesk im Überblick");
    // Without a test the profile shows the computed Recherche-Wertung and how it was derived.
    await expect(page.getByText("Recherche-Wertung").first()).toBeVisible();
    await expect(page.getByText(/ohne Praxistest/).first()).toBeVisible();
    const wertung = page.getByRole("region", { name: /So entsteht die Wertung für sevdesk/ });
    await expect(wertung.getByText("Erst nach einem Praxistest")).toBeVisible();
    await expect(page.getByText(/noch nicht in einem eigenen Konto ausprobiert/)).toBeVisible();
    await expect(page.getByText("Entwurf, nicht veröffentlicht")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Redaktion Stackwahl" }).first()).toHaveAttribute(
      "href",
      "/redaktion",
    );
    await expect(page.getByRole("link", { name: "Milan Schultheis" }).first()).toHaveAttribute(
      "href",
      "/redaktion/milan-schultheis",
    );
    // sevdesk is a partner: the vendor link leaves through /go and is marked as sponsored.
    const vendor = page.getByRole("link", { name: /Zum Anbieter/ });
    await expect(vendor).toHaveAttribute("rel", "sponsored nofollow noopener");
    await expect(vendor).toHaveAttribute("href", "/go/sevdesk?from=profil&pos=1");
    await expect(page.getByRole("link", { name: /^Affiliate-Link/ }).first()).toBeVisible();
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

  test("Impressum names the operator and a working e-mail; contact lists all addresses", async ({
    page,
  }) => {
    await page.goto("/impressum");
    await expect(page.getByText("Stackwahl UG (haftungsbeschränkt)").first()).toBeVisible();
    await expect(page.getByText("Milan Schultheis (Geschäftsführer)")).toBeVisible();
    await expect(page.getByText("Registernummer: HRB 24686")).toBeVisible();
    await expect(page.getByText("DE342188146")).toBeVisible();
    await expect(page.getByText(/52070 Aachen/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "kontakt@stackwahl.de" })).toHaveAttribute(
      "href",
      "mailto:kontakt@stackwahl.de",
    );
    await expect(page.getByText(/Angabe fehlt/)).toHaveCount(0);
    // No phone number, no tax number, no former founder and no internal review notice.
    await expect(page.getByText(/noch nicht anwaltlich geprüft/)).toHaveCount(0);
    await expect(page.getByText("Telefon")).toHaveCount(0);
    await expect(page.getByText(/Steuernummer/)).toHaveCount(0);
    await expect(page.getByText(/Dietmar Riedel/)).toHaveCount(0);
    await page.goto("/kontakt");
    for (const address of [
      "kontakt@stackwahl.de",
      "redaktion@stackwahl.de",
      "partner@stackwahl.de",
    ]) {
      await expect(page.getByRole("link", { name: address })).toHaveAttribute(
        "href",
        `mailto:${address}`,
      );
    }
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

test.describe("Redaktion and SEO", () => {
  test("editor page lists everything the editor is responsible for", async ({ page }) => {
    await page.goto("/redaktion/milan-schultheis");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Milan Schultheis");
    await expect(page.getByText(/Verantwortet 20 Softwareprofile/)).toBeVisible();
    await expect(page.getByText(/Verantwortet 10 Ratgeber/)).toBeVisible();
  });

  test("profiles carry breadcrumbs, software data and their own social image", async ({
    page,
    request,
  }) => {
    await page.goto("/software/sage-active");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(
      " ",
    );
    expect(ld).toContain('"@type":"BreadcrumbList"');
    expect(ld).toContain('"@type":"SoftwareApplication"');
    // No rating markup: the Recherche-Wertung is not a user or test rating.
    expect(ld).not.toContain("aggregateRating");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    const response = await request.get(new URL(image!).pathname + new URL(image!).search);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
