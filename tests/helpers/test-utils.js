// Test utilities
const { generateParticipants, generateCompetitions, generateScores } = require('./generate-test-data');
const { MockDB } = require('./mock-db');

async function setupTestEnvironment() {
  const db = new MockDB();
  
  // Generate test data
  const participants = generateParticipants(10);
  const competitions = generateCompetitions(3);
  const scores = generateScores(competitions, participants);
  
  // Initialize database
  await db.init({
    participants,
    competitions,
    scores
  });
  
  return { db, participants, competitions, scores };
}

function validateParticipant(participant) {
  const requiredFields = ['id', 'name', 'grade', 'class', 'school'];
  for (let field of requiredFields) {
    if (!participant[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return true;
}

function validateCompetition(competition) {
  const requiredFields = ['id', 'name', 'category', 'date'];
  for (let field of requiredFields) {
    if (!competition[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return true;
}

module.exports = {
  setupTestEnvironment,
  validateParticipant,
  validateCompetition
};
