import { test, expect, Page, Browser, HTTPCredentials } from "@playwright/test";
import * as pageUtils from "./utils/PageUtils";

const VALID_CREDENTIALS = {
  httpCredentials: { username: "admin", password: "admin" }
};

const INVALID_CREDENTIALS = [
  { httpCredentials: { username: 'user', password: '123' } }
];

test.describe('Authentication', () => {
  test('allows to log in with correct credentials', async ({ browser }) => {
    const page = await openPage(browser);
    await checkIfBasicAuthPageIsVisible(page);
  });

  test('keeps logged session after refreshing the page', async ({ browser }) => {
    const page = await openPage(browser);
    await pageUtils.reloadPage(page);
    await checkIfBasicAuthPageIsVisible(page);
  });

  test('keeps logged session after after going back and forward', async ({ browser }) => {
    const page = await openPage(browser);
    await pageUtils.goToPreviousPage(page);
    await pageUtils.goToNextPage(page);
    await checkIfBasicAuthPageIsVisible(page);
  });

  test('does not allow to log in with incorrect credentials', async ({ browser }) => {
    const page = await openPage(browser, false);
    await checkIfNotAuthorizedPageIsVisible(page);
  });

  test('allows to log in after "No authorization" at first', async ({ browser }) => {
    let page = await openPage(browser, false);
    await checkIfNotAuthorizedPageIsVisible(page);
    page = await openPage(browser, true);
    await checkIfBasicAuthPageIsVisible(page);
  });

});

async function checkIfNotAuthorizedPageIsVisible(page: Page) {
  const text = page.getByText('Not authorized ')
  await expect(text).toHaveText('Not authorized');
}

async function checkIfBasicAuthPageIsVisible(page: Page) {
  const heading = page.getByRole('heading', { name: 'Basic Auth' });
  await expect(heading).toHaveText('Basic Auth');
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
