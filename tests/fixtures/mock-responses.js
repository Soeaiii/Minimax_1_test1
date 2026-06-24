// Mock API responses for various scenarios

// Success responses
const successResponses = {
  login: {
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
  },
  competition: {
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
  },
  participants: {
    success: true,
    data: {
      participants: [
        { id: 1, name: '张三', grade: '大一', class: '计科1班', school: '计算机学院' },
        { id: 2, name: '李四', grade: '大二', class: '软工2班', school: '软件学院' }
      ],
      total: 2
    }
  }
};

// Error responses
const errorResponses = {
  unauthorized: {
    success: false,
    error: 'Unauthorized',
    message: 'Authentication required'
  },
  notFound: {
    success: false,
    error: 'NotFound',
    message: 'Competition not found'
  },
  validation: {
    success: false,
    error: 'ValidationError',
    message: 'Validation failed',
    details: ['Name is required', 'Score must be between 0-100']
  }
};

module.exports = {
  successResponses,
  errorResponses
};
