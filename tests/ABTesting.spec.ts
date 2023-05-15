import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/abtest');
  
    await expect(page).toHaveTitle('The Internet');
  });