// Mock Database for testing
class MockDB {
  constructor() {
    this.participants = [];
    this.competitions = [];
    this.scores = [];
    this.judges = [];
  }

  async init(data) {
    this.participants = data.participants || [];
    this.competitions = data.competitions || [];
    this.scores = data.scores || [];
    this.judges = data.judges || [];
  }

  async getParticipants() {
    return [...this.participants];
  }

  async getCompetition(id) {
    return this.competitions.find(c => c.id === id) || null;
  }

  async getScoresByCompetition(competitionId) {
    return this.scores.filter(s => s.competitionId === competitionId);
  }

  async addParticipant(participant) {
    this.participants.push(participant);
    return participant;
  }

  async addScore(score) {
    this.scores.push(score);
    return score;
  }
}

module.exports = { MockDB };
