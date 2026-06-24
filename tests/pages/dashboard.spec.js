const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Dashboard Feature Pages', () => {
  test('competition list (/dashboard/competitions) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/competitions', 'Competition List');
  });

  test('new competition form (/dashboard/competitions/new) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/competitions/new', 'New Competition');
  });

  test('program list (/dashboard/programs) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/programs', 'Program List');
  });

  test('new program form (/dashboard/programs/new) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/programs/new', 'New Program');
  });

  test('participant list (/dashboard/participants) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/participants', 'Participant List');
  });

  test('new participant form (/dashboard/participants/new) loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/dashboard/participants/new', 'New Participant');
  });
});
