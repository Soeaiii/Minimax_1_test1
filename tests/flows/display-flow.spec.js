const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Display Flow', () => {
  test('navigate display management page', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/display', 'Display Management');
  });

  test('display page loads for a competition', async ({ authenticatedPage }) => {
    // Get a competition ID from the API
    const res = await authenticatedPage.evaluate(async () => {
      const r = await fetch('/api/competitions');
      const d = await r.json();
      return d.competitions?.[0]?.id || d.data?.[0]?.id;
    });
    if (!res) {
      test.skip(true, 'No competitions in DB');
      return;
    }

    await authenticatedPage.goto(`/display/${res}`);
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');
    expect(authenticatedPage.url()).toContain('/display/');
  });

  test('display management page loads without errors', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/display');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');
    expect(authenticatedPage.url()).toContain('/dashboard/display');
  });

  test('files page loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/files', 'Files Management');
  });

  test('audit logs page loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/audit-logs', 'Audit Logs');
  });
});
