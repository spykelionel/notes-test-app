import { expect, test } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("login page visual snapshot", async ({ page }) => {
    await page.goto("/login");

    // Wait for page to load completely
    await page.waitForLoadState("networkidle");

    // Take screenshot of login page
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("dashboard empty state visual snapshot", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Wait for dashboard to load
    await expect(page).toHaveURL("/dashboard");
    await page.waitForLoadState("networkidle");

    // Take screenshot of empty dashboard
    await expect(page).toHaveScreenshot("dashboard-empty.png");
  });

  test("note editor visual snapshot", async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Open note editor
    await page.getByRole("button", { name: "New Note" }).click();
    await page.waitForLoadState("networkidle");

    // Take screenshot of note editor
    await expect(page).toHaveScreenshot("note-editor.png");
  });

  test("note list with content visual snapshot", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Create a test note
    await page.getByRole("button", { name: "New Note" }).click();
    await page.getByPlaceholder("Note title").fill("Visual Test Note");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("This is a test note for visual regression testing");
    await page.getByRole("button", { name: "Save Note" }).click();

    // Wait for note to appear
    await expect(page.getByText("Visual Test Note")).toBeVisible();
    await page.waitForLoadState("networkidle");

    // Take screenshot of dashboard with note
    await expect(page).toHaveScreenshot("dashboard-with-notes.png");
  });

  test("mobile responsive visual snapshot", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login on mobile
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Take mobile screenshot
    await expect(page).toHaveScreenshot("mobile-dashboard.png");
  });

  test("tablet responsive visual snapshot", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Login on tablet
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Take tablet screenshot
    await expect(page).toHaveScreenshot("tablet-dashboard.png");
  });

  test("error state visual snapshot", async ({ page }) => {
    await page.goto("/login");

    // Try to login with invalid credentials
    await page.getByPlaceholder("Email address").fill("invalid@example.com");
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Wait for error to appear
    await expect(page.getByText("Invalid credentials")).toBeVisible();

    // Take screenshot of error state
    await expect(page).toHaveScreenshot("login-error.png");
  });

  test("loading state visual snapshot", async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Take screenshot during loading (before dashboard fully loads)
    await expect(page).toHaveScreenshot("loading-state.png");
  });
});
