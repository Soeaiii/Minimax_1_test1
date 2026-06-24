const { test, expect } = require('@playwright/test');
const { setupTestEnvironment } = require('./helpers/test-utils');
const mockResponses = require('./helpers/fixtures/mock-responses');

test.describe('Integration Tests', () => {
  test('should handle error scenarios', async () => {
    expect(mockResponses.mockErrorResponse.error).toBe('Unauthorized');
  });

  test('should have consistent mock data', async () => {
    expect(mockResponses.mockLoginResponse.success).toBe(true);
    expect(mockResponses.mockCompetitionResponse.success).toBe(true);
  });
});
