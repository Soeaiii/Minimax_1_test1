const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Programs API', () => {
  test('GET /api/programs returns programs', async ({ authenticatedPage }) => {
    const { data } = await expectApiOk(authenticatedPage, 'GET', '/api/programs');
    expect(data).toHaveProperty('programs');
  });
  test('GET /api/programs?competitionId filters by competition', async ({ authenticatedPage }) => {
    const { data: listData } = await expectApiOk(authenticatedPage, 'GET', '/api/competitions');
    if (!listData.competitions?.length) {
      test.skip('No competitions in DB — seed data required');
      return;
    }
    const competitionId = listData.competitions[0].id;
    const { data } = await expectApiOk(authenticatedPage, 'GET', `/api/programs?competitionId=${competitionId}`);
    expect(data).toHaveProperty('programs');
  });
});
