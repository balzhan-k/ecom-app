import { test, expect } from "@playwright/test";

test.describe("Checkout Page", () => {
  test("should successfully complete a checkout", async ({ page }) => {
    await page.goto("/categories/products/1753537302436");
    await page.getByRole("button", { name: "Add to cart" }).click();

    await page.goto("/cart");
    await expect(page).toHaveURL(/.*cart/);
    await page.getByRole("button", { name: "Checkout" }).click();

    await expect(page).toHaveURL(/checkout\.stripe\.com/, { timeout: 60000 });

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Card number").fill("4242424242424242");
    await page.getByLabel("Expiration").fill("12/25");
    await page.getByLabel("CVC").fill("123");
    await page.getByLabel("Cardholder name").fill("Test User");
    await page
      .getByLabel("Country or region")
      .selectOption({ label: "United States" });
    await page.getByLabel("ZIP").fill("12345");

    await page.getByRole("button", { name: "Pay" }).click();

    await expect(page).toHaveURL(/.*success/, { timeout: 30000 });
    await expect(page.getByText("Payment Successful!")).toBeVisible();
  });
});
