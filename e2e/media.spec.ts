import { expect, test } from "@playwright/test";

// Vendor screenshots and click-to-load videos on profiles (Sections 3.6 and 3.8).

test.describe("Profile media", () => {
  test("press screenshots are labeled with their source", async ({ page }) => {
    await page.goto("/software/papierkram");
    const section = page.getByRole("region", { name: "Papierkram in Bildern und Videos" });
    await expect(section.getByText(/Bilder und Videos stammen von/)).toBeVisible();
    await expect(section.getByRole("img")).toHaveCount(3);
    await expect(
      section.getByRole("link", { name: /Quelle: Pressematerial/ }).first(),
    ).toHaveAttribute("href", "https://www.papierkram.de/presse/");
  });

  test("videos contact YouTube only after a click", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      if (/youtube|ytimg|vimeo|googlevideo/.test(new URL(request.url()).hostname)) {
        thirdParty.push(request.url());
      }
    });
    await page.goto("/software/papierkram");
    const section = page.getByRole("region", { name: "Papierkram in Bildern und Videos" });
    await expect(section.locator("iframe")).toHaveCount(0);
    expect(thirdParty).toEqual([]);
    // The placeholder text is never clipped, also at phone width.
    const clipped = await section
      .locator("figure > div")
      .evaluateAll((boxes) => boxes.filter((b) => b.scrollHeight > b.clientHeight + 1).length);
    expect(clipped).toBe(0);
    await expect(section.getByRole("link", { name: /Datenschutz/ })).toHaveAttribute(
      "href",
      "/datenschutz#videos",
    );
    await section.getByRole("button", { name: /Video laden/ }).click();
    await expect(section.locator("iframe")).toHaveAttribute(
      "src",
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/SOkufTeni_8/,
    );
  });

  test("profiles without media have no media section", async ({ page }) => {
    await page.goto("/software/collmex");
    await expect(page.getByRole("region", { name: /in Bildern und Videos/ })).toHaveCount(0);
  });

  test("privacy policy explains the video embeds", async ({ page }) => {
    await page.goto("/datenschutz");
    const section = page.getByRole("region", { name: "Videos der Anbieter" });
    await expect(section.getByText(/youtube-nocookie\.com/)).toBeVisible();
  });
});
