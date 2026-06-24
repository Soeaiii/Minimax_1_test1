const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Roles Pages', () => {
  test('roles page loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/roles', 'Roles');
  });
});

test.describe('Permission Management Pages', () => {
  test('permission management loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/permissions', 'Permission management');
  });

  test('permission settings loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/permissions/settings', 'Permission settings');
  });

  test('role permissions loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/permissions/roles', 'Role permissions');
  });

  test('user permissions loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/permissions/users', 'User permissions');
  });

  test('data access loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/permissions/data-access', 'Data access');
  });
});

test.describe('Tenant Management Pages', () => {
  test('tenant management loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/tenants', 'Tenant management');
  });
});
