import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Foundation", () => {
  test("home renders in German and is noindex before launch", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Stackwahl");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("skip link moves focus to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard flow is tested on desktop.");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#inhalt$/);
  });

  test("uses only the brand fonts", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const families = await page.evaluate(() => {
      const elements = [document.body, ...document.querySelectorAll("h1, p, a")];
      return [...new Set(elements.map((el) => getComputedStyle(el).fontFamily))];
    });
    for (const family of families) {
      expect(family).toMatch(/^(googleSansFlex|inter), "?(googleSansFlex|inter) Fallback"?$/);
    }
  });

  test("robots.txt blocks everything before launch", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(await response.text()).toContain("Disallow: /");
  });

  test("has no axe violations (WCAG 2.2 AA)", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
