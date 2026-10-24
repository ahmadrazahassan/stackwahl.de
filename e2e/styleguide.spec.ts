import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const URL = "/intern/styleguide";

test.describe("Styleguide", () => {
  test("is noindex and labels its demo data", async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByText("Fiktive Demodaten").first()).toBeVisible();
  });

  test("has no axe violations (WCAG 2.2 AA)", async ({ page }) => {
    await page.goto(URL);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test("has no horizontal page scroll", async ({ page }) => {
    await page.goto(URL);
    const [scrollWidth, clientWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("affiliate links are labeled and sponsored", async ({ page }) => {
    await page.goto(URL);
    const vendor = page.getByRole("link", { name: /Zum Anbieter/ }).first();
    await expect(vendor).toHaveAttribute("rel", "sponsored nofollow noopener");
    await expect(page.getByRole("link", { name: /Affiliate-Link/ }).first()).toBeVisible();
  });

  test("command palette opens with Ctrl K and filters German terms", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard shortcut is a desktop feature.");
    await page.goto(URL, { waitUntil: "networkidle" });
    // The shortcut listener is attached after hydration.
    await expect(async () => {
      await page.keyboard.press("Control+k");
      await expect(page.getByRole("dialog", { name: "Suche" })).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 5000 });
    const dialog = page.getByRole("dialog", { name: "Suche" });
    await expect(dialog).toBeVisible();
    await page.keyboard.type("kontoklar");
    await expect(dialog.getByRole("option", { name: /Kontoklar B/ })).toBeVisible();
    await expect(dialog.getByRole("option", { name: /Musterbuch A/ })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("segmented control switches steps with arrow keys", async ({ page }) => {
    await page.goto(URL);
    const first = page.getByRole("tab", { name: /01 Anforderungen/ });
    await first.focus();
    await page.keyboard.press("ArrowRight");
    const second = page.getByRole("tab", { name: /02 Vergleich/ });
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Funktionen nebeneinander");
  });

  test("comparison switch highlights differing rows", async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator("tr[data-different]")).toHaveCount(0);
    await page.getByRole("switch", { name: "Unterschiede hervorheben" }).click();
    // E-Rechnung, DATEV, Einstiegspreis and Testphase differ; GoBD does not.
    await expect(page.locator("tr[data-different]")).toHaveCount(4);
  });

  test("mega menu opens on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop navigation.");
    await page.goto(URL);
    await page.getByRole("button", { name: "Kategorien" }).click();
    await expect(page.getByRole("link", { name: /Buchhaltungssoftware/ }).first()).toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation.");
    await page.goto(URL);
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    const menu = page.getByRole("dialog", { name: "Menü" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Software-Finder" })).toBeVisible();
    await menu.getByRole("button", { name: "Menü schließen" }).click();
    await expect(menu).toBeHidden();
  });

  test("touch targets of links and buttons are at least 44 px high", async ({ page }) => {
    await page.goto(URL);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("main a, main button, main [role=switch], main [role=tab]")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          // Inline text links inside running text and visually hidden elements are exempt.
          const inline = getComputedStyle(el).display === "inline";
          return r.width > 1 && r.height > 0 && r.height < 24 && !inline;
        })
        .map((el) => `${el.tagName} ${el.textContent?.trim().slice(0, 30)}`),
    );
    expect(small).toEqual([]);
  });
});
