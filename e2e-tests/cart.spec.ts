import { test, expect } from "@playwright/test";

test.describe("Cart Page", () => {
  test("should add a product to the cart and display it", async ({ page }) => {
    await page.goto("/categories/products/1753537302436");
    await page.getByRole("button", { name: "Add to cart" }).click();

    await page.goto("/cart");
    await expect(page).toHaveURL(/.*cart/);

    await expect(
      page.getByText("Classic Ballpoint Pen - Black (20-Pack)")
    ).toBeVisible();

    await expect(
      page.getByRole("listitem").getByText("1", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("Total Price:")).toBeVisible();

    await page.getByRole("button", { name: "+" }).click();
    await expect(
      page.getByRole("listitem").getByText("2", { exact: true })
    ).toBeVisible();

    await page.getByRole("button", { name: "-" }).click();
    await expect(
      page.getByRole("listitem").getByText("1", { exact: true })
    ).toBeVisible();

    await page.getByRole("button", { name: "Remove" }).click();

    await expect(
      page.getByText("Classic Ballpoint Pen - Black (20-Pack)")
    ).not.toBeVisible();
    await expect(page.getByText("Your bag is empty")).toBeVisible();
  });
});
