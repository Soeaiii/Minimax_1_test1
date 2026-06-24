const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Participants API', () => {
  test('GET /api/participants returns participants', async ({ authenticatedPage }) => {
    const { data } = await expectApiOk(authenticatedPage, 'GET', '/api/participants');
    expect(data).toHaveProperty('participants');
  });
  test('GET /api/participants with pagination', async ({ authenticatedPage }) => {
    const { data } = await expectApiOk(authenticatedPage, 'GET', '/api/participants?page=1&limit=5');
    expect(data).toHaveProperty('participants');
    expect(data.participants.length).toBeLessThanOrEqual(5);
  });
});
