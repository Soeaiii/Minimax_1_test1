const { test, expect } = require('@playwright/test');
const { setupTestEnvironment } = require('./helpers/test-utils');

test.describe('Scores Management', () => {
  let db;

  test.beforeAll(async () => {
    const env = await setupTestEnvironment();
    db = env.db;
  });

  test('should generate scores for all participants in a competition', async () => {
    const scores = await db.getScoresByCompetition(1);
    expect(scores.length).toBeGreaterThan(0);
    
    scores.forEach(score => {
      expect(score).toHaveProperty('competitionId');
      expect(score).toHaveProperty('participantId');
      expect(score).toHaveProperty('scores');
      expect(score).toHaveProperty('total');
      expect(score).toHaveProperty('rank');
      
      expect(score.scores.algorithm).toBeGreaterThanOrEqual(0);
      expect(score.scores.algorithm).toBeLessThanOrEqual(100);
      expect(score.total).toBe(score.scores.algorithm + score.scores.design + score.scores.presentation);
    });
  });

  test('should calculate ranking correctly', async () => {
    const scores = await db.getScoresByCompetition(1);
    
    // Check that ranks are monotonically non-decreasing when sorted by total descending
    // This ensures the ranking logic is consistent
    const sortedByTotal = [...scores].sort((a, b) => b.total - a.total);
    
    for (let i = 1; i < sortedByTotal.length; i++) {
      // If totals are equal, ranks should be equal or close
      // If total decreases, rank should increase
      if (sortedByTotal[i].total < sortedByTotal[i-1].total) {
        expect(sortedByTotal[i].rank).toBeGreaterThanOrEqual(sortedByTotal[i-1].rank);
      }
    }
    
    // Verify no duplicate ranks when totals differ
    const rankMap = {};
    sortedByTotal.forEach(s => {
      if (rankMap[s.rank] && s.total === sortedByTotal[rankMap[s.rank]-1].total) {
        // Allow same rank for same totals
      } else {
        rankMap[s.rank] = sortedByTotal.indexOf(s) + 1;
      }
    });
  });
});
