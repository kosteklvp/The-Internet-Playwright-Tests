import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/add_remove_elements/");
});

const CLICK_COUNT = [1, 2, 3, 5, 7, 11, 13, 17, 19, 20, 25, 50, 100, 1000];

test.describe('"Add Element" button', () => {
  test('adds new "Delete" button', async ({ page }) => {
    await clickAddElementButton(page);
    await checkCountOfDeleteButtons(page);
  });

  test('adds next "Delete" button after previous one', async ({ page }) => {
    await clickAddElementButton(page, 2);
    await checkCountOfDeleteButtons(page, 2);
  });

  for (const clickCount of CLICK_COUNT) {
    test(`adds ${clickCount} "Delete" buttons after clicking "Add Element" ${clickCount} times`, async ({ page }) => {
      await clickAddElementButton(page, clickCount);
      await checkCountOfDeleteButtons(page, clickCount);
    });
  }
});

test.describe('"Delete" button', () => {
  test('removes clicked "Delete" button', async ({ page }) => {
    await clickAddElementButton(page);
    await checkCountOfDeleteButtons(page, 1);

    await clickDeleteButton(page);
    await checkCountOfDeleteButtons(page, 0);
  });

  for (const clickCount of CLICK_COUNT) {
    test(`does not remove other ${clickCount - 1} "Delete" buttons`, async ({ page }) => {
      await clickAddElementButton(page, clickCount);
      await checkCountOfDeleteButtons(page, clickCount);

      await clickDeleteButton(page, 1);
      await checkCountOfDeleteButtons(page, clickCount - 1);
    });
  }

  for (const clickCount of CLICK_COUNT) {
    test(`removes all ${clickCount} clicked "Delete" buttons`, async ({ page }) => {
      await clickAddElementButton(page, clickCount);
      await checkCountOfDeleteButtons(page, clickCount);

      await clickDeleteButton(page, clickCount);
      await checkCountOfDeleteButtons(page, 0);
    });
  }

  test.skip('stays visible after refreshing page', async ({ page }) => {
    await clickAddElementButton(page);
    await checkCountOfDeleteButtons(page, 1);

    await reloadPage(page);
    await checkCountOfDeleteButtons(page, 1);
  });

  test.skip('stays visible after going back and forward', async ({ page }) => {
    await clickAddElementButton(page);
    await checkCountOfDeleteButtons(page, 1);

    await goToPreviousPage(page);
    await goToNextPage(page);
    await checkCountOfDeleteButtons(page, 1);
  });
});

async function reloadPage(page: Page) {
  await test.step(`Reload page.`, async () => {
    await page.reload();
  });
}

async function goToPreviousPage(page: Page) {
  await test.step(`Go to previous page.`, async () => {
    await page.goBack();
  });
}

async function goToNextPage(page: Page) {
  await test.step(`Go to next page.`, async () => {
    await page.goForward();
  });
}

async function checkCountOfDeleteButtons(page: Page, count: number = 1) {
  if (count === 0) {
    await test.step(`"Delete" button is not visible.`, async () => {
      const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtonsLocator).toHaveCount(count);
    });
  } else if (count === 1) {
    await test.step(`"Delete" button is visible.`, async () => {
      const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtonsLocator).toHaveCount(count);
    });
  } else {
    await test.step(`There are ${count} visible "Delete" buttons.`, async () => {
      const deleteButtonsLocator = page.getByRole("button", { name: "Delete" });
      await expect(deleteButtonsLocator).toHaveCount(count);
    });
  }
}

async function clickAddElementButton(page: Page, clickCount: number = 1) {
  if (clickCount === 1) {
    await test.step(`Click "Add Element" button.`, async () => {
      await page.getByRole("button", { name: "Add Element" }).click();
    });
  } else {
    await test.step(`Click "Add Element" button ${clickCount} times.`, async () => {
      await page.getByRole("button", { name: "Add Element" }).click({ clickCount: clickCount });
    });
  }
}

async function clickDeleteButton(page: Page, clickCount: number = 1) {
  if (clickCount === 1) {
    await test.step(`Click "Delete" button.`, async () => {
      await page.getByRole("button", { name: "Delete" }).first().click();
    });
  } else {
    await test.step(`Click "Delete" button ${clickCount} times.`, async () => {
      await page.getByRole("button", { name: "Delete" }).first().click({ clickCount: clickCount });
    });
  }
}
