const { test, expect } = require('../fixtures/auth');

test.describe('CRUD Operations', () => {
  test('create and verify a competition', async ({ authenticatedPage }) => {
    // Navigate to competitions
    await authenticatedPage.goto('/dashboard/competitions');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Click "New Competition" button
    await authenticatedPage.click('text=新建比赛');

    // Fill form
    const name = `E2E Test ${Date.now()}`;
    await authenticatedPage.fill('input[name="name"]', name);

    // Set dates
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    await authenticatedPage.fill('input[name="startTime"]', tomorrow);
    await authenticatedPage.fill('input[name="endTime"]', nextWeek);

    // Submit
    await authenticatedPage.click('button[type="submit"]');
    await authenticatedPage.waitForTimeout(3000);

    // Navigate back to list
    await authenticatedPage.goto('/dashboard/competitions');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // Verify competition exists
    await expect(authenticatedPage.locator('body')).toContainText(name);
  });

  test('create a participant', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/participants/new');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    const name = `E2E Participant ${Date.now()}`;
    await authenticatedPage.fill('input[name="name"]', name);
    await authenticatedPage.click('button[type="submit"]');
    await authenticatedPage.waitForTimeout(3000);

    await authenticatedPage.goto('/dashboard/participants');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await expect(authenticatedPage.locator('body')).toContainText(name);
  });

  test('create and verify a program', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/programs/new');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    const name = `E2E Program ${Date.now()}`;
    await authenticatedPage.fill('input[name="name"]', name);
    await authenticatedPage.click('button[type="submit"]');
    await authenticatedPage.waitForTimeout(3000);

    await authenticatedPage.goto('/dashboard/programs');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await expect(authenticatedPage.locator('body')).toContainText(name);
  });

  test('create and verify a judge', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/judges/new');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');

    const name = `E2E Judge ${Date.now()}`;
    await authenticatedPage.fill('input[name="name"]', name);
    // Judges typically need an email
    const email = `e2e-judge-${Date.now()}@example.com`;
    await authenticatedPage.fill('input[name="email"]', email);
    await authenticatedPage.click('button[type="submit"]');
    await authenticatedPage.waitForTimeout(3000);

    await authenticatedPage.goto('/dashboard/judges');
    await authenticatedPage.waitForTimeout(3000);
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await expect(authenticatedPage.locator('body')).toContainText(name);
  });
});
