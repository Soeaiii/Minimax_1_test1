const { test, expect } = require('@playwright/test');
const { setupTestEnvironment, validateCompetition } = require('./helpers/test-utils');
const mockResponses = require('./helpers/fixtures/mock-responses');

test.describe('Competitions Management', () => {
  test('should validate competition data', async () => {
    const competition = {
      id: 1,
      name: '算法设计大赛',
      category: '算法',
      date: '2024-03-15'
    };
    expect(validateCompetition(competition)).toBe(true);
  });

  test('should handle unauthorized access', async () => {
    const { mockErrorResponse } = mockResponses;
    expect(mockErrorResponse.error).toBe('Unauthorized');
  });
});
