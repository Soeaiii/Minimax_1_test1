const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Competitions API', () => {
  test('GET /api/competitions returns competitions', async ({ authenticatedPage }) => {
    const { data } = await expectApiOk(authenticatedPage, 'GET', '/api/competitions');
    expect(data).toHaveProperty('competitions');
  });
  test('GET /api/competitions/[id] returns competition by id', async ({ authenticatedPage }) => {
    const { data: listData } = await expectApiOk(authenticatedPage, 'GET', '/api/competitions');
    if (!listData.competitions?.length) {
      test.skip('No competitions in DB — seed data required');
      return;
    }
    const competitionId = listData.competitions[0].id;
    const { data } = await expectApiOk(authenticatedPage, 'GET', `/api/competitions/${competitionId}`);
    expect(data).toHaveProperty('id', competitionId);
  });
  test('GET /api/competitions/[id]/stats returns stats', async ({ authenticatedPage }) => {
    const { data: listData } = await expectApiOk(authenticatedPage, 'GET', '/api/competitions');
    if (!listData.competitions?.length) {
      test.skip('No competitions in DB — seed data required');
      return;
    }
    const competitionId = listData.competitions[0].id;
    await expectApiOk(authenticatedPage, 'GET', `/api/competitions/${competitionId}/stats`);
  });
});
