const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Display, Rankings, and Files APIs', () => {
  test('GET /api/dashboard/stats returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/dashboard/stats');
  });
  test('GET /api/rankings returns 200', async ({ authenticatedPage }) => {
    // Rankings may require a competitionId; try with and without
    const { status, data } = await expectApiOk(authenticatedPage, 'GET', '/api/rankings?competitionId=test');
    expect(status).toBeLessThan(400);
  });
  test('GET /api/rankings without competitionId returns handled', async ({ authenticatedPage }) => {
    const { status } = await expectApiOk(authenticatedPage, 'GET', '/api/rankings');
    expect(status).toBeLessThan(400);
  });
  test('GET /api/files returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/files');
  });
});
