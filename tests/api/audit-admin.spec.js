const { test, expect } = require('../fixtures/auth');
const { expectApiOk } = require('../helpers/api');

test.describe('Audit, Judge, and Admin APIs', () => {
  test('GET /api/audit-logs returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/audit-logs');
  });
  test('GET /api/judges returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/judges');
  });
  test('GET /api/permissions (me) returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/permissions/me');
  });
  test('GET /api/permissions/system-status returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/permissions/system-status');
  });
  test('GET /api/permissions/policies returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/permissions/policies');
  });
  test('GET /api/permissions/security-config returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/permissions/security-config');
  });
  test('GET /api/permissions/audit-config returns 200', async ({ authenticatedPage }) => {
    await expectApiOk(authenticatedPage, 'GET', '/api/permissions/audit-config');
  });
});
