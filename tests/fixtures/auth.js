const { test: base, expect } = require('@playwright/test');

/**
 * Extended test fixture that provides automatic admin login.
 * Every test starts with an authenticated context.
 */
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await loginAsAdmin(page);
    await use(page);
  },
});

async function loginAsAdmin(page) {
  await page.goto('/auth/login', { waitUntil: 'load' });
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 10_000 });
  await page.waitForLoadState('networkidle');
}

module.exports = { test, expect, loginAsAdmin };
