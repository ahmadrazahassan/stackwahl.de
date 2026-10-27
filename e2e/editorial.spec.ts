import { expect, test } from "@playwright/test";

// Editorial comparisons (/vergleich/x-vs-y) and use-case pages (/software-fuer/...).

test.describe("Editorial comparisons", () => {
  test("compares both programs with facts, decision help, actions and sources", async ({
    page,
  }) => {
    await page.goto("/vergleich/sevdesk-vs-papierkram");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("sevdesk vs. Papierkram");
    await expect(page.getByText("Verantwortlich:").first()).toBeVisible();
    // The facts table is computed from the profiles.
    await expect(
      page.getByRole("region", { name: "Vergleich: sevdesk, Papierkram" }),
    ).toBeVisible();
    const decision = page.getByRole("region", { name: "Welches Programm passt zu Ihnen?" });
    await expect(decision.getByRole("article")).toHaveCount(2);
    await expect(
      decision.getByRole("link", { name: /Website besuchen von Papierkram/ }),
    ).toHaveAttribute("target", "_blank");
    await expect(page.getByRole("link", { name: /Papierkram Preise/ }).first()).toHaveAttribute(
      "href",
      "https://www.papierkram.de/preise/",
    );
    await expect(page.getByText(/Testsieger|im Test/)).toHaveCount(0);
  });

  test("the comparison page lists every detailed comparison", async ({ page }) => {
    await page.goto("/vergleich");
    await page.getByRole("link", { name: /weclapp vs\. Xentral/ }).click();
    await expect(page).toHaveURL(/\/vergleich\/weclapp-vs-xentral$/);
  });

  test("profiles link to the comparisons that include them", async ({ page }) => {
    await page.goto("/software/sage-active");
    const section = page.getByRole("region", { name: "Sage Active im Vergleich" });
    await expect(
      section.getByRole("link", { name: /Sage Active vs\. Lexware Office/ }),
    ).toBeVisible();
  });
});

test.describe("Use-case pages", () => {
  test("select programs by a published rule and explain the order", async ({ page }) => {
    await page.goto("/software-fuer/handwerk");
    await expect(
      page.getByText(/deren Anbieter Handwerksbetriebe als Zielgruppe nennt/),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText(/Stackwahl kann eine Provision erhalten/),
    ).toBeVisible();
    const list = page.getByRole("region", { name: /Programme für Handwerksbetriebe/ });
    await expect(list.getByRole("heading", { name: "Sage 50 Handwerk" })).toBeVisible();
    await expect(list.getByRole("heading", { name: "orgaMAX" })).toBeVisible();
    // § 14 UStG is cited with its source.
    await expect(page.getByRole("link", { name: /§ 14 UStG/ }).first()).toHaveAttribute(
      "href",
      "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
    );
  });

  test("the overview lists all use cases and unknown ones answer 404", async ({ page }) => {
    await page.goto("/software-fuer");
    await expect(
      page.getByRole("main").getByRole("link", { name: /Buchhaltungssoftware für GmbH und UG/ }),
    ).toBeVisible();
    const response = await page.goto("/software-fuer/gibt-es-nicht");
    expect(response?.status()).toBe(404);
  });

  test("new pages are in the sitemap", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://stackwahl.de/vergleich/weclapp-vs-xentral");
    expect(sitemap).toContain("https://stackwahl.de/software-fuer/lohnabrechnung");
  });
});
