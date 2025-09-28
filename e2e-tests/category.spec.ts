import { test, expect } from "@playwright/test";

test.describe("Category Pages", () => {
  test("should display products for a specific category", async ({ page }) => {
    await page.goto("/categories/pens");
    await expect(page).toHaveURL(/.*categories\/pens/);

    await expect(
      page
        .getByRole("link")
        .filter({ has: page.getByRole("heading", { level: 3 }) })
    ).not.toHaveCount(0);
  });

  test('should display products for the "Notebooks" category', async ({
    page,
  }) => {
    await page.goto("/categories/notebooks");
    await expect(page).toHaveURL(/.*categories\/notebooks/);

    await expect(
      page
        .getByRole("link")
        .filter({ has: page.getByRole("heading", { level: 3 }) })
    ).not.toHaveCount(0);
  });
});
