const { test, expect } = require('@playwright/test');

test('homepage loads successfully', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/比赛管理系统/);
  await expect(page.locator('body')).toBeVisible();
});
