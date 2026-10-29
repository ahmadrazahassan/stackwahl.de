import { expect, test } from "@playwright/test";

// Home page sections against the preview build (draft profiles visible).

test.describe("Home page", () => {
  test("labels the logo row as researched, not rated", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Recherchierte Software")).toBeVisible();
    await expect(page.getByText("Bewertete Software")).toHaveCount(0);
  });

  test("Am besten bewertet shows the four highest research scores, the commission note and both actions", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Am besten bewertet" });
    await expect(section.getByText(/Stackwahl kann eine Provision erhalten/)).toBeVisible();
    await expect(section.getByRole("link", { name: "So finanzieren wir uns" })).toHaveAttribute(
      "href",
      "/transparenz",
    );
    const cards = section.getByRole("article");
    await expect(cards).toHaveCount(4);
    const scores = await cards.locator("p.font-display").allInnerTexts();
    const values = scores.map((t) => Number(t.replace(/s.*$/s, "").replace(",", ".")));
    expect([...values].sort((a, b) => b - a)).toEqual(values);
    await expect(cards.first().getByRole("link", { name: /Website besuchen/ })).toHaveAttribute(
      "target",
      "_blank",
    );
    await cards
      .first()
      .getByRole("link", { name: /Profil und Wertung/ })
      .click();
    await expect(page.getByRole("region", { name: /So entsteht die Wertung/ })).toBeVisible();
  });

  test("showcase tabs switch categories and explain the order", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Software nach Kategorie" });
    await expect(section.getByText(/sortiert nach dem günstigsten bezahlten Tarif/)).toBeVisible();
    await section.getByRole("tab", { name: /ERP-Software/ }).click();
    await expect(
      section.getByRole("link", { name: /Alle 6 Programme der Kategorie ERP-Software/ }),
    ).toBeVisible();
    await expect(
      section.getByRole("button", { name: "Vorherige Programme" }).first(),
    ).toBeDisabled();
  });

  test("hero search sends the query to the search page", async ({ page }) => {
    await page.goto("/");
    const search = page.getByRole("search");
    await search.getByLabel("Software, Kategorie oder Begriff suchen").fill("DATEV");
    await search.getByRole("button", { name: "Suchen" }).click();
    await expect(page).toHaveURL(/\/suche\?q=DATEV$/);
    await expect(page.getByText(/Treffer für „DATEV“/)).toBeVisible();
  });

  test("screenshots are real vendor material with a source for every image", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "So sehen die Programme aus" });
    const images = section.getByRole("img");
    await expect(images).toHaveCount(4);
    await expect(section.getByText(/^Pressematerial von /)).toHaveCount(4);
    await expect(section.getByRole("link", { name: /Quelle/ })).toHaveCount(4);
    await section.getByRole("link", { name: "Papierkram", exact: true }).click();
    await expect(page).toHaveURL(/\/software\/papierkram#einblicke$/);
  });

  test("footer explains on every page that Stackwahl may earn commissions", async ({ page }) => {
    for (const path of ["/", "/kategorien", "/impressum"]) {
      await page.goto(path);
      const footer = page.getByRole("contentinfo");
      await expect(footer.getByText(/Stackwahl kann eine Provision erhalten/)).toBeVisible();
    }
  });

  test("partner banner is labeled as an ad and leaves through /go", async ({ page, request }) => {
    await page.goto("/");
    const banner = page.locator('section[aria-labelledby="partner-titel"]');
    await expect(banner.getByText("Anzeige", { exact: true })).toBeVisible();
    await expect(banner.getByRole("link", { name: /^Affiliate-Link/ })).toBeVisible();
    const cta = banner.getByRole("link", { name: /Lexware Office testen/ });
    await expect(cta).toHaveAttribute("href", "/go/lexware-office?from=banner&pos=1");
    await expect(cta).toHaveAttribute("rel", "sponsored nofollow noopener");
    await expect(cta).toHaveAttribute("target", "_blank");
    // The redirect adds only the placement and is never indexed or cached.
    const response = await request.get("/go/lexware-office?from=banner&pos=1", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("office.lexware.de");
    expect(response.headers()["location"]).toContain("utm_content=banner-1");
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");

    // The second partner gets its own slot, also labeled.
    const second = page.locator('section[aria-labelledby="partner-2-titel"]');
    await expect(second.getByText("Anzeige", { exact: true })).toBeVisible();
    await expect(second.getByRole("link", { name: /FastBill testen/ })).toHaveAttribute(
      "href",
      "/go/fastbill?from=banner&pos=2",
    );
    const fastbill = await request.get("/go/fastbill?from=banner&pos=2", { maxRedirects: 0 });
    expect(fastbill.status()).toBe(307);
    expect(fastbill.headers()["location"]).toContain("fastbill.com");
    expect(fastbill.headers()["location"]).toContain("utm_content=banner-2");

    // sevdesk has a partner link but no banner yet; its card links leave through /go too.
    const sevdesk = await request.get("/go/sevdesk?from=fokus&pos=3", { maxRedirects: 0 });
    expect(sevdesk.status()).toBe(307);
    expect(sevdesk.headers()["location"]).toContain("sevdesk.de");
    expect(sevdesk.headers()["location"]).toContain("utm_content=fokus-3");
  });
});
