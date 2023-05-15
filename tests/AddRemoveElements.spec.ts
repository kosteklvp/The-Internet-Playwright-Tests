import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/add_remove_elements/");
});

test.describe("Add Element", () => {
  test('adds new "Delete" button', async ({ page }) => {
    // Given
    const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });

    // When
    await addElementButtonLocator.click();

    // Then
    const deleteButtonLocator = page.getByRole("button", { name: "Delete" });
    await expect(deleteButtonLocator).toBeVisible();
  });

  test('adds next "Delete" button after previous one', async ({ page }) => {
    // Given
    const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });
    await addElementButtonLocator.click();

    // When
    await addElementButtonLocator.click();

    // Then
    const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
    await expect(deleteButtonsLocator).toHaveCount(2);
  });

  const numberOfClicks = [0, 1, 2, 3, 5, 7, 11, 13, 17, 19];
  for (const number of numberOfClicks) {
    test(`adds ${number} "Delete" buttons after clicking "Add Element" ${number} times`, async ({ page }) => {
      // Given
      const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });

      // When
      await addElementButtonLocator.click({ clickCount: number });

      // Then
      const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtonsLocator).toHaveCount(number);
    });
  }
});
