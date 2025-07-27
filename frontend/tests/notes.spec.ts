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
    // Click new note button
    await page.getByTestId("new-note-button").click();

    // Fill in note details
    await page.getByPlaceholder("Note title").fill("Test Note");
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
    await expect(page.getByText("Test Note")).toBeVisible();
    await expect(page.getByText("This is a test note content")).toBeVisible();
  });

  test("should edit an existing note", async ({ page }) => {
    // First create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill("Original Title");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Original content");
    await page.getByTestId("save-note-button").click();

    // Wait for note to appear in list
    await expect(page.getByText("Original Title")).toBeVisible();

    // Click on the note to select it
    await page.getByText("Original Title").click();

    // Click edit button for the specific note
    await page
      .getByText("Original Title")
      .locator("..")
      .getByTestId("edit-note-button")
      .click();

    // Modify the note
    await page.getByPlaceholder("Note title").clear();
    await page.getByPlaceholder("Note title").fill("Updated Title");
    await page.getByPlaceholder("Write your note content here...").clear();
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Updated content");

    // Save changes
    await page.getByTestId("save-note-button").click();

    // Should show updated content
    await expect(page.getByText("Updated Title")).toBeVisible();
    await expect(page.getByText("Updated content")).toBeVisible();
  });

  test("should delete a note", async ({ page }) => {
    // First create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill("Note to Delete");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("This note will be deleted");
    await page.getByTestId("save-note-button").click();

    // Wait for note to appear
    await expect(page.getByText("Note to Delete")).toBeVisible();

    // Click on the note to select it
    await page.getByText("Note to Delete").click();

    // Click delete button for the specific note
    await page
      .getByText("Note to Delete")
      .locator("..")
      .getByTestId("delete-note-button")
      .click();

    // Confirm deletion (handle dialog)
    page.on("dialog", (dialog) => dialog.accept());

    // Should remove note from list
    await expect(page.getByText("Note to Delete")).not.toBeVisible();
  });

  // test("should search and filter notes", async ({ page }) => {
  //   // Create multiple notes with different titles
  //   await page.getByRole("button", { name: "New Note" }).click();
  //   await page.getByPlaceholder("Note title").fill("Work Note");
  //   await page
  //     .getByPlaceholder("Write your note content here...")
  //     .fill("Work related content");
  //   await page.getByTestId("save-note-button").click();

  //   await page.getByRole("button", { name: "New Note" }).click();
  //   await page.getByPlaceholder("Note title").fill("Personal Note");
  //   await page
  //     .getByPlaceholder("Write your note content here...")
  //     .fill("Personal content");
  //   await page.getByTestId("save-note-button").click();

  //   // Both notes should be visible
  //   await expect(page.getByText("Work Note")).toBeVisible();
  //   await expect(page.getByText("Personal Note")).toBeVisible();

  //   // Search for "Work"
  //   await page.getByPlaceholder("Search notes...").fill("Work");

  //   // Only work note should be visible
  //   await expect(page.getByText("Work Note")).toBeVisible();
  //   await expect(page.getByText("Personal Note")).not.toBeVisible();
  // });

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
    // Create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill("Original Note");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("Original content");
    await page.getByTestId("save-note-button").click();

    // Select the note
    await page.getByText("Original Note").click();

    // Click edit
    await page
      .getByText("Original Note")
      .locator("..")
      .getByTestId("edit-note-button")
      .click();

    // Modify content
    await page.getByPlaceholder("Note title").clear();
    await page.getByPlaceholder("Note title").fill("Modified Title");

    // Cancel editing
    await page.getByTestId("cancel-note-button").click();

    // Should show original content
    await expect(page.getByText("Original Note")).toBeVisible();
    await expect(page.getByText("Modified Title")).not.toBeVisible();
  });

  test("should pin and unpin notes", async ({ page }) => {
    // Create a note
    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill("Pinnable Note");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill("This note can be pinned");
    await page.getByTestId("save-note-button").click();

    // Select the note
    await page.getByText("Pinnable Note").click();

    // Click edit
    await page
      .getByText("Pinnable Note")
      .locator("..")
      .getByTestId("edit-note-button")
      .click();

    // Toggle pin
    await page.getByTestId("pin-checkbox").check();

    // Save
    await page.getByTestId("save-note-button").click();

    // Should show pinned indicator
    await expect(page.getByText("📌")).toBeVisible();
  });

  test("should handle long note content", async ({ page }) => {
    const longContent = "A".repeat(1000); // Very long content

    await page.getByTestId("new-note-button").click();
    await page.getByPlaceholder("Note title").fill("Long Note");
    await page
      .getByPlaceholder("Write your note content here...")
      .fill(longContent);
    await page.getByTestId("save-note-button").click();

    // Should handle long content gracefully
    await expect(page.getByText("Long Note")).toBeVisible();
  });
});
