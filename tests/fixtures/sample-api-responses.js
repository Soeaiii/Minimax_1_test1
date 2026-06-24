// API Response Mock Data

// Mock login response
const mockLoginResponse = {
  success: true,
  data: {
    user: {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
      permissions: ['competitions:read', 'participants:read', 'scores:write']
    },
    session: {
      token: 'mock-session-token-12345'
    }
  }
};

// Mock competition response
const mockCompetitionResponse = {
  success: true,
  data: {
    competition: {
      id: 1,
      name: '算法设计大赛',
      category: '算法',
      status: 'active',
      participants: [
        { id: 1, name: '张三', score: 95 },
        { id: 2, name: '李四', score: 88 }
      ]
    }
  }
};

// Mock error response
const mockErrorResponse = {
  success: false,
  error: 'Unauthorized',
  message: 'Authentication required'
};

module.exports = {
  mockLoginResponse,
  mockCompetitionResponse,
  mockErrorResponse
};
