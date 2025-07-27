import { expect, test } from "@playwright/test";

test.describe("Notes Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("user@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("should create a new note", async ({ page }) => {
    const uniqueTitle = `Test Note ${Date.now()}`;

    // Click new note button
    await page.getByTestId("new-note-button").click();

    // Fill in note details
    await page.getByPlaceholder("Note title").fill(uniqueTitle);
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("This is a test note content");

    // Add tags
    await page
      .getByPlaceholder("Add tags (comma separated)")
      .fill("test, example");

    // Save note
    await page.getByTestId("save-note-button").click();

    // Should show success message or note in list
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).toBeVisible();
    // Check that the note content is visible in the note list
    await expect(
      page
        .getByTestId("note-title")
        .filter({ hasText: uniqueTitle })
        .locator("xpath=ancestor::div[contains(@class, 'card')]")
        .getByText("This is a test note content")
    ).toBeVisible();

    // Cleanup: Delete the created note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    page.on("dialog", (dialog) => dialog.accept());
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("delete-note-button")
      .click();

    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).not.toBeVisible();
  });

  test("should edit an existing note", async ({ page }) => {
    const uniqueTitle = `Original Title ${Date.now()}`;

    // First create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill(uniqueTitle);
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Original content");
    await page.getByTestId("save-note-button").click();

    // Wait for note to appear in list
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).toBeVisible();

    // Click on the note to select it
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    // Click edit button for the specific note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("edit-note-button")
      .click();

    // Modify the note
    const updatedTitle = `Updated Title ${Date.now()}`;
    await page.getByPlaceholder("Note title").clear();
    await page.getByPlaceholder("Note title").fill(updatedTitle);
    await page.getByPlaceholder("Write your note content here...").clear();
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Updated content");

    // Save changes
    await page.getByTestId("save-note-button").click();

    // Should show updated content
    await expect(
      page.getByTestId("note-title").filter({ hasText: updatedTitle })
    ).toBeVisible();
    // Check that the updated content is visible in the note list
    await expect(
      page
        .getByTestId("note-title")
        .filter({ hasText: updatedTitle })
        .locator("xpath=ancestor::div[contains(@class, 'card')]")
        .getByText("Updated content")
    ).toBeVisible();

    // Cleanup: Delete the updated note
    await page
      .getByTestId("note-title")
      .filter({ hasText: updatedTitle })
      .click();

    page.on("dialog", (dialog) => dialog.accept());
    await page
      .getByTestId("note-title")
      .filter({ hasText: updatedTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("delete-note-button")
      .click();

    await expect(
      page.getByTestId("note-title").filter({ hasText: updatedTitle })
    ).not.toBeVisible();
  });

  test("should delete a note", async ({ page }) => {
    const uniqueTitle = `Note to Delete ${Date.now()}`;

    // First create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill(uniqueTitle);
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("This note will be deleted");
    await page.getByTestId("save-note-button").click();

    // Wait for note to appear
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).toBeVisible();

    // Click on the note to select it
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    // Set up dialog handler before clicking delete
    page.on("dialog", (dialog) => {
      console.log("Dialog appeared:", dialog.message());
      dialog.accept();
    });

    // Click delete button for the specific note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("delete-note-button")
      .click();

    // Wait a moment for the delete operation to complete
    await page.waitForTimeout(1000);

    // Wait for the note to be removed from the list
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).not.toBeVisible();

    // Note: This test already cleans up by deleting the note it created
  });

  test("should handle note validation", async ({ page }) => {
    // Try to create note without title
    await page.getByTestId("new-note-button").click();
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Content without title");
    await page.getByTestId("save-note-button").click();

    // Should show validation error
    await expect(page.getByText("Title is required")).toBeVisible();
  });

  test("should cancel note editing", async ({ page }) => {
    const uniqueTitle = `Original Note ${Date.now()}`;

    // Create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill(uniqueTitle);
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Original content");
    await page.getByTestId("save-note-button").click();

    // Select the note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    // Click edit
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("edit-note-button")
      .click();

    // Modify content
    await page.getByPlaceholder("Note title").clear();
    await page.getByPlaceholder("Note title").fill("Modified Title");

    // Cancel editing
    await page.getByTestId("cancel-note-button").click();

    // Should show original content
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).toBeVisible();
    await expect(page.getByText("Modified Title")).not.toBeVisible();

    // Cleanup: Delete the note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    page.on("dialog", (dialog) => dialog.accept());
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("delete-note-button")
      .click();

    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).not.toBeVisible();
  });

  test("should handle long note content", async ({ page }) => {
    const longContent = "A".repeat(1000); // Very long content
    const uniqueTitle = `Long Note ${Date.now()}`;

    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill(uniqueTitle);
    await page
      .getByPlaceholder("Write your note content here...")
      .fill(longContent);
    await page.getByTestId("save-note-button").click();

    // Should handle long content gracefully
    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).toBeVisible();

    // Cleanup: Delete the note
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .click();

    page.on("dialog", (dialog) => dialog.accept());
    await page
      .getByTestId("note-title")
      .filter({ hasText: uniqueTitle })
      .locator("xpath=ancestor::div[contains(@class, 'card')]")
      .getByTestId("delete-note-button")
      .click();

    await expect(
      page.getByTestId("note-title").filter({ hasText: uniqueTitle })
    ).not.toBeVisible();
  });
});
