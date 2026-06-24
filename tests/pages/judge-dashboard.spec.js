const { test, expect } = require('../fixtures/auth');
const { smokeTestPage } = require('../helpers/api');

test.describe('Judge Dashboard Pages', () => {
  test('judge dashboard loads without errors', async ({ authenticatedPage }) => {
    await smokeTestPage(authenticatedPage, '/judge', 'Judge dashboard');
  });
});
