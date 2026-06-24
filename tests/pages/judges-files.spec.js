const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Judges Pages', () => {
  test('judge list loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/judges', 'Judge list');
  });

  test('new judge form loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/judges/new', 'New judge form');
  });
});

test.describe('Display Pages', () => {
  test('display management loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/display', 'Display management');
  });
});

test.describe('Files Pages', () => {
  test('file management loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/files', 'File management');
  });
});

test.describe('Audit Logs Pages', () => {
  test('audit logs load without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/audit-logs', 'Audit logs');
  });
});
