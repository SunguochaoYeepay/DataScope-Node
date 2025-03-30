// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { validationResult } = require('express-validator');
const { ERROR_CODES } = require('../../../src/utils/errors/error-codes');

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
  getQueryPlanById: jest.fn().mockImplementation((id) => {
    if (id === 'non-existent-plan') return Promise.resolve(null);
    return Promise.resolve({
      id: id || 'plan-123',
      dataSourceId: 'test-ds-id',
      sql: 'SELECT * FROM users',
      explanation: 'Table scan on users',
      createdAt: new Date()
    });
  }),
  getQueryPlanHistory: jest.fn().mockResolvedValue({
    history: [
      { id: 'query-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'query-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ],
    total: 2,
    limit: 10,
    offset: 0
  }),
  cancelQuery: jest.fn().mockImplementation((queryId) => {
    if (queryId === 'completed-query') {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }),
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

// 模拟queryService模块
jest.mock('../../../src/services/query.service', () => mockQueryService);

// 模拟ApiError
jest.mock('../../../src/utils/errors/types/api-error', () => {
  const MockApiError = jest.fn().mockImplementation((message, errorCode, statusCode) => {
    return {
      message,
      errorCode,
      statusCode: statusCode || 400,
      name: 'ApiError'
    };
  });
  
  MockApiError.notFound = jest.fn().mockImplementation((message) => {
    return new MockApiError(message, ERROR_CODES.RESOURCE_NOT_FOUND, 404);
  });
  
  return { 
    ApiError: MockApiError
  };
});

// 模拟 logger 防止真实日志输出
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// 模拟express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => ({ notEmpty: jest.fn(() => ({ withMessage: jest.fn() })) })),
  param: jest.fn(() => ({ notEmpty: jest.fn(() => ({ withMessage: jest.fn() })) })),
  query: jest.fn(() => ({ isString: jest.fn(() => ({ withMessage: jest.fn() })) })),
  isInt: jest.fn(() => ({ withMessage: jest.fn() })),
  optional: jest.fn(() => ({ isInt: jest.fn(() => ({ withMessage: jest.fn() })) })),
}));

// 导入控制器（在模拟完所有依赖后导入）
const { QueryController } = require('../../../src/api/controllers/query.controller');

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
    
    // 创建控制器实例
    queryController = new QueryController();
    
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
    
    // 设置validationResult默认返回无错误
    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });
  
  describe('explainQuery', () => {
    it('应当返回查询执行计划说明', async () => {
      // 准备测试数据
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
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
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ param: 'sql', msg: 'SQL不能为空' }])
      });
      
      // 执行测试
      await queryController.explainQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      expect(mockQueryService.explainQuery).not.toHaveBeenCalled();
    });
  });
  
  describe('getQueryOptimizationTips', () => {
    it('应当返回查询优化建议', async () => {
      // 准备测试数据
      mockReq.params.id = 'plan-123';
      
      // 模拟planHistory数据
      const mockPlanData = JSON.stringify({
        optimizationTips: [
          { type: 'index', description: '为users表的name列添加索引' }
        ],
        performanceAnalysis: {
          complexity: 'medium'
        }
      });
      
      mockQueryService.getQueryPlanById.mockResolvedValue({
        id: 'plan-123',
        sql: 'SELECT * FROM users',
        planData: mockPlanData
      });
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryPlanById).toHaveBeenCalledWith('plan-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          sql: 'SELECT * FROM users',
          optimizationTips: expect.any(Array)
        })
      }));
    });
    
    it('应当处理查询计划不存在的情况', async () => {
      // 准备测试数据
      mockReq.params.id = 'non-existent-plan';
      
      // 设置service返回null
      mockQueryService.getQueryPlanById.mockResolvedValue(null);
      
      // 使用ApiError模拟
      const mockApiError = new Error('查询计划不存在');
      mockApiError.name = 'ApiError';
      mockApiError.statusCode = 404;
      
      // 配置抛出错误的次数（调用后恢复默认实现）
      mockQueryService.getQueryPlanById.mockImplementationOnce(() => Promise.resolve(null));
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
    });
  });
  
  describe('getQueryHistory', () => {
    it('应当返回查询历史记录', async () => {
      // 准备测试数据
      mockReq.query = {
        dataSourceId: 'test-ds-id',
        limit: '10',
        offset: '0'
      };
      
      // 执行测试
      await queryController.getQueryPlanHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryPlanHistory).toHaveBeenCalledWith(
        'test-ds-id',
        10,
        0
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
  
  describe('cancelQuery', () => {
    it('应当取消正在执行的查询', async () => {
      // 准备测试数据
      mockReq.params.id = 'query-123';
      
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
      // 准备测试数据
      mockReq.params.id = 'completed-query';
      
      // 执行测试
      await queryController.cancelQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.cancelQuery).toHaveBeenCalledWith('completed-query');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });
  });
  
  describe('executeQuery', () => {
    it('应当执行SQL查询并返回结果', async () => {
      // 准备测试数据
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.executeQuery).toHaveBeenCalledWith(
        'test-ds-id', 
        'SELECT * FROM users', 
        undefined, 
        expect.any(Object)
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ param: 'sql', msg: 'SQL不能为空' }])
      });
      
      // 执行测试
      await queryController.executeQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      expect(mockQueryService.executeQuery).not.toHaveBeenCalled();
    });
  });
  
  describe('saveQuery', () => {
    it('应当保存查询', async () => {
      // 准备测试数据
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
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ param: 'name', msg: '名称不能为空' }])
      });
      
      // 执行测试
      await queryController.saveQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      expect(mockQueryService.saveQuery).not.toHaveBeenCalled();
    });
  });
  
  describe('getQueries', () => {
    it('应当返回已保存的查询列表', async () => {
      // 准备测试数据
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
      // 准备测试数据
      mockReq.params.id = 'query-id-123';
      
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
      // 准备测试数据
      mockReq.params.id = 'non-existent-query';
      
      // 模拟抛出错误行为
      mockQueryService.getQueryById.mockRejectedValue(new Error('查询不存在'));
      
      // 执行测试
      await queryController.getQueryById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryById).toHaveBeenCalledWith('non-existent-query');
      expect(mockNext).toHaveBeenCalled();
    });
  });
  
  describe('updateQuery', () => {
    it('应当更新已保存的查询', async () => {
      // 准备测试数据
      mockReq.params.id = 'query-id-123';
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
      // 准备测试数据
      mockReq.params.id = 'query-id-123';
      
      // 执行测试
      await queryController.deleteQuery(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.deleteQuery).toHaveBeenCalledWith('query-id-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: '查询已成功删除'
      }));
    });
  });
});