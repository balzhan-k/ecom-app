import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Home Page", () => {
  test("should display the home page", async ({ page }) => {
    const pageTitle = page.locator("h1");
    await expect(pageTitle).toHaveText("Elevate Your Workspace");

    const introParagraph = page.locator("p", {
      hasText:
        "Discover our curated collection of beautiful and functional stationery.",
    });
    await expect(introParagraph).toBeVisible();

    const mainBannerImage = page.locator(
      'img[alt="Beautiful workspace with stationery"]'
    );
    await expect(mainBannerImage).toBeVisible();

    const categoriesHeading = page.locator("h2", { hasText: "Categories" });
    await expect(categoriesHeading).toBeVisible();

    const firstCategoryCard = page
      .locator('section:has(h2:text("Categories"))')
      .locator("h3")
      .first();
    await expect(firstCategoryCard).toBeVisible();

    const discountedProducts = page.locator(
      'section:has(h2:text("Featured Products"))'
    );
    await expect(discountedProducts).toBeVisible();
  });
});
