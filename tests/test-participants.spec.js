const { test, expect } = require('@playwright/test');
const { setupTestEnvironment, validateParticipant, validateCompetition } = require('./helpers/test-utils');
const { MockAPI } = require('./helpers/mock-api');

test.describe('Participants Management', () => {
  let api;
  let db;

  test.beforeAll(async () => {
    const env = await setupTestEnvironment();
    db = env.db;
    api = new MockAPI();
  });

  test('should validate participant data', async () => {
    const participant = {
      id: 1,
      name: '张三',
      grade: '大一',
      class: '计科1班',
      school: '计算机学院'
    };
    expect(validateParticipant(participant)).toBe(true);
  });

  test('should get all participants from database', async () => {
    const participants = await db.getParticipants();
    expect(participants.length).toBeGreaterThan(0);
    participants.forEach(p => validateParticipant(p));
  });

  test('should add new participant', async () => {
    const newParticipant = {
      id: 999,
      name: '新生',
      grade: '大一',
      class: '计科3班',
      school: '计算机学院'
    };
    const result = await db.addParticipant(newParticipant);
    expect(result.id).toBe(999);
    expect(result.name).toBe('新生');
  });
});
