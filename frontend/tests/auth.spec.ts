import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.getByLabel("Email address").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.getByLabel("Email address").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("should show error with empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should show browser validation errors
    await expect(page.getByLabel("Email address")).toHaveAttribute("required");
    await expect(page.getByLabel("Password")).toHaveAttribute("required");
  });

  test("should use demo account button", async ({ page }) => {
    await page.getByRole("button", { name: "Use Demo Account" }).click();

    await expect(page.getByLabel("Email address")).toHaveValue(
      "user@example.com"
    );
    await expect(page.getByLabel("Password")).toHaveValue("password123");
  });

  test("should logout successfully", async ({ page }) => {
    // First login
    await page.getByLabel("Email address").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/dashboard");

    // Then logout
    await page.getByRole("button", { name: /logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to login when accessing dashboard without auth", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });
});
