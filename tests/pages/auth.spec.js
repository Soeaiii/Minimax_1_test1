const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Auth & Public Pages', () => {
  test('home page (/) loads without errors', async ({ page }) => {
    await smokeTestPage(page, '/', 'Home');
  });

  test('login page (/auth/login) loads without errors', async ({ page }) => {
    await smokeTestPage(page, '/auth/login', 'Login');
  });

  test('register page (/auth/register) loads without errors', async ({ page }) => {
    await smokeTestPage(page, '/auth/register', 'Register');
  });
});

test.describe('Authenticated Dashboard Pages', () => {
  test('dashboard (/dashboard) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard', 'Dashboard');
  });

  test('profile page (/dashboard/profile) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/profile', 'Profile');
  });
});
