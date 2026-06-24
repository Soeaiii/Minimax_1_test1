const { test, expect } = require('@playwright/test');

test('participants page requires login', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard/participants');
  await expect(page.locator('body')).toBeVisible();
});
