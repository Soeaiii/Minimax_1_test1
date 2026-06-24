const { test, expect } = require('@playwright/test');

test('dashboard page requires login', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  // Should redirect to login or show unauthorized
  await expect(page).toHaveURL(/login|unauthorized/);
});

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');
  await expect(page).toHaveTitle(/比赛管理系统|登录/);
  await expect(page.locator('body')).toBeVisible();
});
