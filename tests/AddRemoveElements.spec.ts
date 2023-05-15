import { test, expect, Page, Locator } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/add_remove_elements/");
});

const CLICK_COUNT = [1, 2, 3, 5, 7, 11, 13, 17, 19, 20, 25, 50, 100, 1000];

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

  for (const clickCount of CLICK_COUNT) {
    test(`adds ${clickCount} "Delete" buttons after clicking "Add Element" ${clickCount} times`, async ({ page }) => {
      // Given
      const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });

      // When
      await addElementButtonLocator.click({ clickCount: clickCount });

      // Then
      const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtonsLocator).toHaveCount(clickCount);
    });
  }
});

test.describe("Remove Element", () => {
  test('removes clicked "Delete" button', async ({ page }) => {
    // Given
    const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });
    await addElementButtonLocator.click();

    const deleteButtonLocator = page.getByRole("button", { name: "Delete" });
    await expect(deleteButtonLocator).toBeVisible();

    // When
    await deleteButtonLocator.click();
    
    // Then
    await expect(deleteButtonLocator).not.toBeVisible();
  });

  for (const clickCount of CLICK_COUNT) {
    test(`does not remove other ${clickCount - 1} "Delete" buttons`, async ({ page }) => {
      // Given
      const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });
      await addElementButtonLocator.click({ clickCount: clickCount });
    
      const deleteButtonLocator = page.getByRole("button", { name: "Delete" });
  
      // When
      await deleteButtonLocator.first().click();
      
      // Then
      await expect(deleteButtonLocator).toHaveCount(clickCount - 1);
    });
  }

  for (const clickCount of CLICK_COUNT) {
    test(`removes all ${clickCount} clicked "Delete" buttons`, async ({ page }) => {
      // Given
      const addElementButtonLocator = page.getByRole("button", { name: "Add Element" });
      await addElementButtonLocator.click({ clickCount: clickCount });
    
      const deleteButtonLocator = page.getByRole("button", { name: "Delete" });
  
      // When
      await deleteButtonLocator.first().click({ clickCount: clickCount });
      
      // Then
      await expect(deleteButtonLocator).toHaveCount(0);
    });
  }
});