const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Judge API', () => {
  test('GET /api/judge/competitions returns judge competitions', async ({ authenticatedPage }) => {
    // NOTE: The auth fixture logs in as admin@example.com (SUPER_ADMIN).
    // Judge endpoints enforce ctx.role === 'JUDGE', so admin receives 401.
    // To test 200, a judge user fixture is needed.
    await expectApiOk(authenticatedPage, 'GET', '/api/judge/competitions');
  });
  test('GET /api/judge/profile returns judge profile', async ({ authenticatedPage }) => {
    // Same role constraint applies (JUDGE only).
    await expectApiOk(authenticatedPage, 'GET', '/api/judge/profile');
  });
});
