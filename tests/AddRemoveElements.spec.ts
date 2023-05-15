import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/add_remove_elements/");
});

const CLICK_COUNT = [1, 2, 3, 5, 7, 11, 13, 17, 19, 20, 25, 50, 100, 1000];

test.describe('"Add Element" button', () => {
  test('adds new "Delete" button', async ({ page }) => {
    await clickAddElementButton(page);
    await checkVisibilityOfDeleteButton(page);
  });

  test('adds next "Delete" button after previous one', async ({ page }) => {
    await clickAddElementButton(page, 2);
    await checkCountOfDeleteButtons(page, 2);
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

async function checkVisibilityOfDeleteButton(page: Page) {
  await test.step(`"Delete" button is visible`, async () => {
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
  });
}

async function checkCountOfDeleteButtons(page: Page, count: number) {
  await test.step(`There are ${count} visible "Delete" buttons`, async () => {
    const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
    await expect(deleteButtonsLocator).toHaveCount(count);
  });
}

async function clickAddElementButton(page: Page, clickCount: number = 1) {
  if (clickCount === 1) {
    await test.step(`Click "Add Element" button`, async () => {
      await page.getByRole("button", { name: "Add Element" }).click();
    });
  } else {
    await test.step(`Click "Add Element" button ${clickCount} times`, async () => {
      await page.getByRole("button", { name: "Add Element" }).click({ clickCount: clickCount });
    });
  }
}
