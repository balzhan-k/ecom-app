import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Home Page", () => {
  test("should display the home page", async ({ page }) => {
    const pageTitle = page.locator("h1");
    await expect(pageTitle).toHaveText("Elevate Your Workspace");
  });
});
