import { expect, test } from "@playwright/test";

// Ratgeber index and article pages against the preview build (draft articles visible).

test.describe("Ratgeber", () => {
  test("index lists every article with thumbnail meta and links to it", async ({ page }) => {
    await page.goto("/ratgeber");
    // One featured article on top, the other nine in the grid.
    await expect(page.getByText(/Min. Lesezeit/)).toHaveCount(10);
    await page.getByRole("link", { name: /Versteckte Kosten bei Buchhaltungssoftware/ }).click();
    await expect(page).toHaveURL(/\/ratgeber\/versteckte-kosten-buchhaltungssoftware$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Versteckte Kosten");
  });

  test("article shows research basis, sources and the programs it names", async ({ page }) => {
    await page.goto("/ratgeber/sevdesk-oder-lexware-office");
    await expect(page.getByText(/ohne eigenen Praxistest/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sevdesk Preise/ }).first()).toHaveAttribute(
      "href",
      "https://sevdesk.de/preise/",
    );
    await expect(page.getByRole("link", { name: "Profil lesen" }).first()).toBeVisible();
    await expect(page.getByText(/Testsieger|im Test/)).toHaveCount(0);
  });

  test("home page shows the latest articles with a link to all", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Ratgeber" });
    await expect(section.getByRole("article")).toHaveCount(3);
    await section.getByRole("link", { name: "Alle Artikel" }).click();
    await expect(page).toHaveURL(/\/ratgeber$/);
  });

  test("unknown article slugs answer 404", async ({ page }) => {
    const response = await page.goto("/ratgeber/gibt-es-nicht");
    expect(response?.status()).toBe(404);
  });
});
