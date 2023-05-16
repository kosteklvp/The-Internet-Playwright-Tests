import { test, expect, Page, Browser } from "@playwright/test";
import * as pageUtils from "./utils/PageUtils";

//displayed

test.describe('Authentication', () => {
  test('allows to log in with correct credentials.', async ({ browser }) => {
    const page = await openPage(browser);
    await checkIfBasicAuthPageIsDisplayed(page);
  });

  test('keeps session after refreshing the page.', async ({ browser }) => {
    const page = await openPage(browser);
    await pageUtils.reloadPage(page);
    await checkIfBasicAuthPageIsDisplayed(page);
  });

  test('keeps session after after going back and forward.', async ({ browser }) => {
    const page = await openPage(browser);
    await pageUtils.goToPreviousPage(page);
    await pageUtils.goToNextPage(page);
    await checkIfBasicAuthPageIsDisplayed(page);
  });

  test('does not allow to log in with incorrect credentials.', async ({ browser }) => {
    const page = await openPage(browser, false);
    await checkIfNotAuthorizedPageIsDisplayed(page);
  });

  test('allows to log in after "No authorization" at first.', async ({ browser }) => {
    let page = await openPage(browser, false);
    await checkIfNotAuthorizedPageIsDisplayed(page);
    page = await openPage(browser, true);
    await checkIfBasicAuthPageIsDisplayed(page);
  });

});

async function checkIfNotAuthorizedPageIsDisplayed(page: Page) {
  await test.step(`"Not authorized" page is displayed.`, async () => {
    const text = page.getByText('Not authorized ')
    await expect(text).toHaveText('Not authorized');
  });
}

async function checkIfBasicAuthPageIsDisplayed(page: Page) {
  await test.step(`"Basic Auth" page is displayed.`, async () => {
    const heading = page.getByRole('heading', { name: 'Basic Auth' });
    await expect(heading).toHaveText('Basic Auth');
  });
}

async function openPage(browser: Browser, isAuthentication: boolean = true): Promise<Page> {
  let page;
  await test.step(`Open "Basic Auth" page.`, async () => {
    const VALID_CREDENTIALS = {
      httpCredentials: { username: "admin", password: "admin" }
    };

    const INVALID_CREDENTIALS = {
      httpCredentials: { username: "user", password: "123" }
    };

    const context = await browser.newContext(isAuthentication ? VALID_CREDENTIALS : INVALID_CREDENTIALS);

    page = await context.newPage();
    await page.goto("https://the-internet.herokuapp.com/basic_auth");
  });

  return page;
}
