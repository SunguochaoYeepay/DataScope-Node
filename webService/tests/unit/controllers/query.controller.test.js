// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { QueryController } = require('../../../src/api/controllers/query.controller');
const { ApiError } = require('../../../src/utils/errors/types/api-error');

// 模拟dependencies
const mockConnector = {
  executeQuery: jest.fn().mockResolvedValue({
    rows: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ],
    columns: ['id', 'name'],
    rowCount: 2,
    executionTime: 15
  }),
  explainQuery: jest.fn().mockResolvedValue({
    explanation: 'This query performs a table scan on the users table',
    cost: 100
  }),
  cancelQuery: jest.fn().mockResolvedValue(true)
};

// 模拟PrismaClient
const mockPrismaClient = {
  query: {
    create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 'query-id-123', ...data.data })),
    findUnique: jest.fn().mockImplementation(() => Promise.resolve({ 
      id: 'query-id-123', 
      dataSourceId: 'test-ds-id',
      sql: 'SELECT * FROM users',
      name: 'Find All Users',
      description: 'Retrieves all users from the database',
      createdAt: new Date()
    })),
    update: jest.fn().mockImplementation((data) => Promise.resolve({ 
      id: data.where.id, 
      ...data.data,
      updatedAt: new Date()
    })),
    delete: jest.fn().mockImplementation(() => Promise.resolve({ id: 'query-id-123' })),
    findMany: jest.fn().mockImplementation(() => Promise.resolve([
      { id: 'query-1', sql: 'SELECT * FROM users', name: 'Find All Users', createdAt: new Date() },
      { id: 'query-2', sql: 'SELECT * FROM orders', name: 'Find All Orders', createdAt: new Date() }
    ]))
  },
  queryHistory: {
    create: jest.fn(),
    findMany: jest.fn().mockImplementation(() => Promise.resolve([
      { id: 'history-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'history-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ])),
    count: jest.fn().mockReturnValue(2)
  }
};

// 模拟prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 创建模拟dataSourceService
const mockDataSourceService = {
  getDataSourceById: jest.fn().mockResolvedValue({ 
    id: 'test-ds-id', 
    name: 'Test DB',
    type: 'mysql'
  }),
  getConnector: jest.fn().mockResolvedValue(mockConnector)
};

// 模拟dataSourceService
jest.mock('../../../src/services/datasource.service', () => {
  return { DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService) };
});

// 创建模拟queryService对象
const mockQueryService = {
  executeQuery: jest.fn().mockResolvedValue({
    rows: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ],
    columns: ['id', 'name'],
    rowCount: 2,
    executionTime: 15
  }),
  explainQuery: jest.fn().mockResolvedValue({
    explanation: 'This query performs a table scan on the users table',
    complexity: 'medium',
    details: {
      tables: ['users'],
      operations: ['scan']
    }
  }),
  getQueryOptimizationTips: jest.fn().mockResolvedValue([
    { type: 'index', description: '为users表的name列添加索引' },
    { type: 'rewrite', description: '使用具体列名替代SELECT *' }
  ]),
  getQueryPlanHistory: jest.fn().mockResolvedValue({
    history: [
      { id: 'query-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'query-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ],
    total: 2,
    limit: 10,
    offset: 0
  }),
  cancelQuery: jest.fn().mockResolvedValue(true),
  saveQuery: jest.fn().mockResolvedValue({
    id: 'query-id-123',
    dataSourceId: 'test-ds-id',
    name: 'Find All Users',
    sql: 'SELECT * FROM users',
    createdAt: new Date()
  }),
  getQueries: jest.fn().mockResolvedValue({
    queries: [
      { id: 'query-1', name: 'Find All Users', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'query-2', name: 'Find All Orders', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ],
    total: 2,
    limit: 10,
    offset: 0
  }),
  getQueryById: jest.fn().mockImplementation((id) => {
    if (id === 'non-existent-query') return Promise.resolve(null);
    return Promise.resolve({
      id: id || 'query-id-123',
      dataSourceId: 'test-ds-id',
      name: 'Find All Users',
      sql: 'SELECT * FROM users',
      createdAt: new Date()
    });
  }),
  updateQuery: jest.fn().mockResolvedValue({
    id: 'query-id-123',
    dataSourceId: 'test-ds-id',
    name: 'Updated Query Name',
    sql: 'SELECT * FROM users WHERE active = true',
    updatedAt: new Date()
  }),
  deleteQuery: jest.fn().mockResolvedValue(true)
};

// 模拟queryService
jest.mock('../../../src/services/query.service', () => {
  return { default: mockQueryService };
});

// 模拟logger
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
}));

// 模拟express-validator
jest.mock('express-validator', () => {
  return {
    validationResult: jest.fn().mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    }),
    body: jest.fn().mockReturnThis(),
    param: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    isUUID: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis()
  };
});

// 生成mock响应
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('QueryController', () => {
  let queryController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    queryController = new QueryController();
    mockReq = {
      params: {},
      query: {},
      body: {},
      user: { id: 'user-123', email: 'test@example.com', role: 'user' }
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
  });
  
  describe('explainQuery', () => {
    it('应当返回查询执行计划说明', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM users',
        includeAnalysis: true
      };
      
      // 执行测试
      await queryController.explainQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.explainQuery).toHaveBeenCalledWith('test-ds-id', 'SELECT * FROM users', undefined);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理验证错误', async () => {
      // 模拟验证错误
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'sql', msg: 'SQL查询不能为空' }
        ])
      });
      
      // 执行测试
      await queryController.explainQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
  });
  
  describe('getQueryOptimizationTips', () => {
    it('应当返回查询优化建议', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'plan-123' };
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理查询计划不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'non-existent-plan' };
      
      // 设置服务返回null
      mockQueryService.getQueryPlanById.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
  });
  
  describe('getQueryHistory', () => {
    it('应当返回查询历史记录', async () => {
      // 设置模拟请求参数
      mockReq.query = { dataSourceId: 'test-ds-id', limit: '10', offset: '0' };
      
      // 执行测试
      await queryController.getQueryPlanHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
  
  describe('cancelQuery', () => {
    it('应当取消正在执行的查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-123' };
      
      // 执行测试
      await queryController.cancelQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.cancelQuery).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });
    
    it('应当处理取消查询失败的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'completed-query' };
      
      // 设置服务返回false
      mockQueryService.cancelQuery.mockResolvedValueOnce(false);
      
      // 执行测试
      await queryController.cancelQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });
  });
  
  describe('executeQuery', () => {
    it('应当执行SQL查询并返回结果', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM users',
        params: [],
        page: 1,
        pageSize: 10
      };
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.executeQuery).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理验证错误', async () => {
      // 模拟验证错误
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'sql', msg: 'SQL查询不能为空' }
        ])
      });
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
  });
  
  describe('saveQuery', () => {
    it('应当保存查询', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        name: 'Find All Users',
        description: 'Retrieves all users from the database',
        sql: 'SELECT * FROM users',
        tags: ['users', 'findAll'],
        isPublic: true
      };
      
      // 执行测试
      await queryController.saveQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.saveQuery).toHaveBeenCalledWith(expect.objectContaining({
        dataSourceId: 'test-ds-id',
        name: 'Find All Users',
        sql: 'SELECT * FROM users'
      }));
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理验证错误', async () => {
      // 模拟验证错误
      const { validationResult } = require('express-validator');
      validationResult.mockReturnValueOnce({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'name', msg: '查询名称不能为空' }
        ])
      });
      
      // 执行测试
      await queryController.saveQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
  });
  
  describe('getQueries', () => {
    it('应当返回已保存的查询列表', async () => {
      // 设置模拟请求参数
      mockReq.query = { 
        dataSourceId: 'test-ds-id', 
        tag: 'users',
        isPublic: 'true',
        search: 'user'
      };
      
      // 执行测试
      await queryController.getQueries(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueries).toHaveBeenCalledWith(expect.objectContaining({
        dataSourceId: 'test-ds-id',
        tag: 'users'
      }));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
  
  describe('getQueryById', () => {
    it('应当返回指定ID的查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id-123' };
      
      // 执行测试
      await queryController.getQueryById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryById).toHaveBeenCalledWith('query-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理查询不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'non-existent-query' };
      
      // 设置服务返回null
      mockQueryService.getQueryById.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryController.getQueryById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
  });
  
  describe('updateQuery', () => {
    it('应当更新已保存的查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id-123' };
      mockReq.body = { 
        name: 'Updated Query Name',
        description: 'Updated description',
        sql: 'SELECT * FROM users WHERE active = true',
        tags: ['users', 'active'],
        isPublic: false
      };
      
      // 执行测试
      await queryController.updateQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.updateQuery).toHaveBeenCalledWith(
        'query-id-123',
        expect.objectContaining({
          name: 'Updated Query Name',
          sql: 'SELECT * FROM users WHERE active = true'
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
  
  describe('deleteQuery', () => {
    it('应当删除已保存的查询', async () => {
      // 设置模拟请求参数
      mockReq.params = { id: 'query-id-123' };
      
      // 执行测试
      await queryController.deleteQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.deleteQuery).toHaveBeenCalledWith('query-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: expect.stringContaining('删除')
      }));
    });
  });
});