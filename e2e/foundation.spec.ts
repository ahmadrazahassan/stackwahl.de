import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Foundation", () => {
  test("home renders in German and is indexable with canonical and social image", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/Stackwahl/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://stackwahl.de",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.join(" ")).toContain('"@type":"WebSite"');
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

  test("robots.txt allows the site, blocks redirects and points to the sitemap", async ({
    request,
  }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /go/");
    expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
    expect(robots).toContain("Sitemap: https://stackwahl.de/sitemap.xml");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://stackwahl.de/software/sage-active");
    expect(sitemap).toContain("https://stackwahl.de/redaktion/dietmar-riedel");
    expect(sitemap).not.toContain("/alternativen");
  });

  test("has no axe violations (WCAG 2.2 AA)", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
