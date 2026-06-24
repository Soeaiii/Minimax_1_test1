// API Mock Helper
const { mockLoginResponse, mockCompetitionResponse, mockErrorResponse } = require('./fixtures/mock-responses');

class MockAPI {
  constructor() {
    this.isLoggedIn = false;
    this.user = null;
  }

  async login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isLoggedIn = true;
        this.user = mockLoginResponse.data.user;
        resolve(mockLoginResponse);
      }, 100);
    });
  }

  async getCompetition(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.isLoggedIn) {
          resolve(mockCompetitionResponse);
        } else {
          resolve(mockErrorResponse);
        }
      }, 100);
    });
  }

  async logout() {
    return new Promise((resolve) => {
      this.isLoggedIn = false;
      this.user = null;
      resolve({ success: true });
    });
  }
}

module.exports = { MockAPI };
