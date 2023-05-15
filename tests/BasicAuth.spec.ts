import { test, expect } from "@playwright/test";


// TODO doesnt work
test.describe.skip("Authentication", () => {
    test('adds new "Delete" button', async ({ browser }) => {

      const context = await browser.newContext({
        httpCredentials: {
            username: "admin",
            password: "admin"
        }
      });

      const page = await context.newPage();
      await page.goto('https://the-internet.herokuapp.com/basic_auth');

      const asd = page.getByRole("paragraph", { name: 'Congratulations! You must have the proper credentials.' });

      await expect(asd).toHaveText('Congratulations! You must have the proper credentials.');
    });
  });