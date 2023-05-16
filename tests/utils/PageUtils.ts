import { test, Page } from "@playwright/test";

export const CLICK_COUNT = [1, 2, 3, 5, 7, 11, 13, 17, 19, 20, 25, 50, 100, 1000];

export async function reloadPage(page: Page) {
  await test.step(`Reload page.`, async () => {
    await page.reload();
  });
}

export async function goToPreviousPage(page: Page) {
  await test.step(`Go to previous page.`, async () => {
    await page.goBack();
  });
}

export async function goToNextPage(page: Page) {
  await test.step(`Go to next page.`, async () => {
    await page.goForward();
  });
}