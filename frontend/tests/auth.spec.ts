import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Email address")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    // Fill in login form
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");

    // Submit form
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Should show user name in header
    await expect(page.getByText("Test User")).toBeVisible();

    // Should show notes interface
    await expect(page.getByRole("heading", { name: "My Notes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New Note" })).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    // Fill in login form with invalid credentials
    await page.getByPlaceholder("Email address").fill("invalid@example.com");
    await page.getByPlaceholder("Password").fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should show error message
    await expect(page.getByText("Invalid credentials")).toBeVisible();

    // Should stay on login page
    await expect(page).toHaveURL("/login");
  });

  test("should show error with empty fields", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should show validation errors
    await expect(page.getByPlaceholder("Email address")).toHaveAttribute(
      "required"
    );
    await expect(page.getByPlaceholder("Password")).toHaveAttribute("required");
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByPlaceholder("Password");
    const toggleButton = page.locator('button[type="button"]').last();

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click toggle button
    await toggleButton.click();

    // Password should be visible
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click toggle button again
    await toggleButton.click();

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should use demo account button", async ({ page }) => {
    // Click demo account button
    await page.getByRole("button", { name: "Use demo account" }).click();

    // Should fill in demo credentials
    await expect(page.getByPlaceholder("Email address")).toHaveValue(
      "test@example.com"
    );
    await expect(page.getByPlaceholder("Password")).toHaveValue("password123");
  });

  test("should logout successfully", async ({ page }) => {
    // First login
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Wait for dashboard to load
    await expect(page).toHaveURL("/dashboard");

    // Click logout
    await page.getByRole("button", { name: "Logout" }).click();

    // Should redirect to login page
    await expect(page).toHaveURL("/login");

    // Should show login form
    await expect(
      page.getByRole("heading", { name: "Sign in to your account" })
    ).toBeVisible();
  });

  test("should redirect to login when accessing dashboard without auth", async ({
    page,
  }) => {
    // Go directly to dashboard without logging in
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });
});
