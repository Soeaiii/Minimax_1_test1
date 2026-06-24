// Mock API responses for various scenarios

// Success responses
const mockLoginResponse = {
  success: true,
  data: {
    user: {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
      permissions: ['competitions:read', 'participants:read', 'scores:write', 'judges:manage']
    },
    session: {
      token: 'mock-session-token-abc123'
    }
  }
};

const mockCompetitionResponse = {
  success: true,
  data: {
    competition: {
      id: 1,
      name: '算法设计大赛',
      category: '算法',
      status: 'active',
      date: '2024-03-15',
      participants: [
        { id: 1, name: '张三', score: 95, rank: 1 },
        { id: 2, name: '李四', score: 88, rank: 2 }
      ]
    }
  }
};

// Error responses
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
