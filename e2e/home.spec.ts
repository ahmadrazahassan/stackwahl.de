import { expect, test } from "@playwright/test";

// Home page sections against the preview build (draft profiles visible).

test.describe("Home page", () => {
  test("labels the logo row as researched, not rated", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Recherchierte Software")).toBeVisible();
    await expect(page.getByText("Bewertete Software")).toHaveCount(0);
  });

  test("situation shortcuts open the Finder result with the matching answers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Meine Kanzlei arbeitet mit DATEV/ }).click();
    await expect(page).toHaveURL(/\/software-finder\/ergebnis\?.*datev=true/);
    await expect(page.getByText("Platz 1")).toBeVisible();
  });

  test("showcase tabs switch categories and explain the order", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: /Software für Ihr Büro/ });
    await expect(section.getByText(/Provisionen haben keinen Einfluss/)).toBeVisible();
    await section.getByRole("tab", { name: /ERP-Software/ }).click();
    await expect(
      section.getByRole("link", { name: /Alle 6 Programme der Kategorie ERP-Software/ }),
    ).toBeVisible();
    await expect(
      section.getByRole("button", { name: "Vorherige Programme" }).first(),
    ).toBeDisabled();
  });

  test("overview rows show price, status lines and both actions, sorted by entry price", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: /Die Programme im Überblick/ });
    const rows = section.getByRole("tabpanel").getByRole("article");
    await expect(rows).toHaveCount(5);
    const first = rows.first();
    // formatEuro puts a non-breaking space before the euro sign.
    await expect(first.getByText(/ab \d+,\d{2}\s€\s\/\sMonat/)).toBeVisible();
    await expect(first.getByRole("link", { name: /Website besuchen/ })).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(first.getByRole("link", { name: "Profil lesen" })).toBeVisible();
    // No fabricated popularity signals (Section 3.2).
    await expect(section.getByText(/Bewertungen|Reviews|Testsieger/)).toHaveCount(0);
  });

  test("fact board links every listed program to its profile", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: /Drei Fragen vor jeder Entscheidung/ });
    await section.getByRole("link", { name: "Collmex" }).first().click();
    await expect(page).toHaveURL(/\/software\/collmex$/);
  });
});
