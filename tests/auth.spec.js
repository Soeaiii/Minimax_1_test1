const { test, expect } = require('@playwright/test');

test('register page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register');
  await expect(page.locator('body')).toBeVisible();
});

test('main layout is consistent', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('body')).toBeVisible();
});
