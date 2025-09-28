import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
  test("should display login page and handle successful login", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/.*\//);
  });

  test("should handle Google login button click", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/.*login/);

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Enter with Google" }).click(),
    ]);
    expect(popup.url()).toMatch(/firebaseapp\.com.*providerId=google\.com/);
  });

  test("should display registration page and handle new user registration", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/.*register/);
    await expect(
      page.getByRole("heading", { name: "Create Account" })
    ).toBeVisible();

    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password", { exact: true }).fill("123");
    await page.getByLabel("Confirm Password").fill("456");
    await page.getByRole("button", { name: "Sign Up" }).click();
    const uniqueEmail = `newuser-${Date.now()}@example.com`;
    const password = "StrongPassword123";

    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password").fill(password);
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page).toHaveURL(/.*\//);
  });
});
