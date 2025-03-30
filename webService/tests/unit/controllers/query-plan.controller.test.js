// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { validationResult } = require('express-validator');
const { ERROR_CODES } = require('../../../src/utils/errors/error-codes');

// 创建模拟查询服务
const mockQueryService = {
  explainQuery: jest.fn().mockResolvedValue({
    query: 'SELECT * FROM users',
    explanation: 'Table scan on users table',
    cost: 100
  }),
  saveQueryPlanToHistory: jest.fn().mockResolvedValue({ id: 'plan-123' }),
  getQueryPlanHistory: jest.fn().mockResolvedValue({
    history: [
      { id: 'plan-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'plan-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ],
    total: 2,
    limit: 10,
    offset: 0
  }),
  getQueryPlanById: jest.fn().mockResolvedValue({
    id: 'plan-123',
    sql: 'SELECT * FROM users',
    planData: JSON.stringify({
      steps: [{ id: 1, operation: 'TABLE SCAN' }],
      costEstimate: 100
    }),
    createdAt: new Date()
  })
};

// 创建模拟数据源服务
const mockDataSourceService = {
  getDataSourceById: jest.fn().mockResolvedValue({ 
    id: 'test-ds-id', 
    name: 'Test DB',
    type: 'mysql'
  }),
  getConnector: jest.fn().mockResolvedValue({
    getQueryPlan: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM users',
      steps: [{ id: 1, operation: 'TABLE SCAN', details: { table: 'users' } }],
      costEstimate: 100
    }),
    explainQuery: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM users',
      steps: [{ id: 1, operation: 'TABLE SCAN', details: { table: 'users' } }]
    }),
    isJsonExplainSupported: true
  })
};

// 创建模拟查询计划服务
const mockQueryPlanService = {
  getQueryPlan: jest.fn().mockResolvedValue({
    query: 'SELECT * FROM users',
    planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
  }),
  analyzePlan: jest.fn(),
  comparePlans: jest.fn().mockResolvedValue({
    summary: {
      costDifference: -20,
      rowsDifference: -50,
      plan1BottlenecksCount: 2,
      plan2BottlenecksCount: 1,
      improvement: true
    },
    nodeComparison: [
      {
        table: 'users',
        rows: { plan1: 100, plan2: 50, difference: -50 },
        filtered: { plan1: 100, plan2: 100, difference: 0 },
        accessType: { plan1: 'ALL', plan2: 'index', improved: true }
      }
    ]
  }),
  getOptimizationTips: jest.fn().mockResolvedValue([
    { type: 'index', description: '为users表的name列添加索引' }
  ])
};

// 创建预先初始化的模拟PrismaClient
const mockPrismaClient = {
  queryPlan: {
    findUnique: jest.fn().mockResolvedValue({
      id: 'plan-123',
      sql: 'SELECT * FROM users',
      planData: JSON.stringify({
        steps: [{ id: 1, operation: 'TABLE SCAN' }],
        costEstimate: 100
      }),
      dataSourceId: 'test-ds-id',
      createdAt: new Date()
    }),
    create: jest.fn().mockResolvedValue({ id: 'new-plan-123' }),
    update: jest.fn().mockResolvedValue({ id: 'plan-123' })
  }
};

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
  
  MockApiError.badRequest = jest.fn().mockImplementation((message) => {
    return new MockApiError(message, ERROR_CODES.BAD_REQUEST, 400);
  });
  
  return { 
    ApiError: MockApiError
  };
});

// 模拟PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
}));

// 模拟服务，使用ES6导入语法模拟
jest.mock('../../../src/services/datasource.service', () => ({
  DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService)
}));

jest.mock('../../../src/services/query.service', () => ({
  QueryService: jest.fn().mockImplementation(() => mockQueryService)
}));

jest.mock('../../../src/services/query-plan.service', () => ({
  QueryPlanService: jest.fn().mockImplementation(() => mockQueryPlanService)
}));

// 模拟database-core
jest.mock('../../../src/database-core', () => ({
  getQueryPlanConverter: jest.fn().mockImplementation(() => ({
    convertJsonExplain: jest.fn().mockImplementation((json) => {
      if (typeof json === 'string') {
        return JSON.parse(json);
      }
      return json;
    })
  })),
  getQueryPlanAnalyzer: jest.fn().mockImplementation(() => ({
    analyze: jest.fn().mockImplementation((plan) => ({ ...plan, analyzed: true }))
  })),
  getQueryOptimizer: jest.fn().mockImplementation(() => ({
    analyzeSql: jest.fn().mockImplementation(() => [
      { type: 'index', description: '为users表的name列添加索引' }
    ]),
    generateOptimizedSql: jest.fn().mockImplementation((sql) => `/* 优化后 */ ${sql}`)
  }))
}));

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
const { QueryPlanController } = require('../../../src/api/controllers/query-plan.controller');

// 生成mock响应
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('QueryPlanController', () => {
  let queryPlanController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 创建控制器实例
    queryPlanController = new QueryPlanController();
    
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
  
  describe('getQueryPlan', () => {
    it('应当返回查询执行计划', async () => {
      // 准备测试数据
      mockReq.params.id = 'test-ds-id';
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      // 准备成功返回值
      mockQueryPlanService.getQueryPlan.mockResolvedValueOnce({
        query: 'SELECT * FROM users',
        planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
      });
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理数据源不存在的情况', async () => {
      // 准备测试数据
      mockReq.params.id = 'non-existent-ds-id';
      mockReq.body = {
        dataSourceId: 'non-existent-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      // 模拟数据源不存在错误
      const notFoundError = new Error('数据源不存在');
      notFoundError.statusCode = 404;
      
      mockDataSourceService.getDataSourceById.mockRejectedValueOnce(notFoundError);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证结果应该是500错误，因为在控制器中catch住了异常
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
    
    it('应当处理缺少必要参数的情况', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ param: 'sql', msg: 'SQL不能为空' }])
      });
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证 - 注意这里控制器内部捕获了异常并返回错误响应
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
    
    it('应当处理服务异常', async () => {
      // 准备测试数据
      mockReq.params.id = 'test-ds-id';
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      // 模拟查询计划服务抛出错误
      const serviceError = new Error('获取查询计划失败');
      mockDataSourceService.getConnector.mockRejectedValueOnce(serviceError);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
  
  describe('getOptimizationTips', () => {
    it('应当提供SQL查询优化建议', async () => {
      // 准备测试数据
      mockReq.body = {
        sql: 'SELECT * FROM users'
      };
      mockReq.params = {
        planId: 'plan-123'
      };
      
      // 确保正确模拟findUnique方法
      mockPrismaClient.queryPlan.findUnique.mockResolvedValueOnce({
        id: 'plan-123',
        sql: 'SELECT * FROM users',
        planData: JSON.stringify({
          steps: [{ id: 1, operation: 'TABLE SCAN' }],
          costEstimate: 100
        }),
        dataSourceId: 'test-ds-id',
        createdAt: new Date()
      });
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'plan-123' }
      }));
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理计划不存在的情况', async () => {
      // 准备测试数据
      mockReq.body = {};
      
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ param: 'sql', msg: 'SQL不能为空' }])
      });
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('应当返回查询计划历史记录', async () => {
      // 准备测试数据
      mockReq.query = {
        dataSourceId: 'test-ds-id',
        limit: '20'
      };
      
      // 确保mock方法正确返回
      mockQueryService.getQueryPlanHistory.mockResolvedValueOnce({
        history: [
          { id: 'plan-1', sql: 'SELECT * FROM users', createdAt: new Date() },
          { id: 'plan-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
        ],
        total: 2,
        limit: 20,
        offset: 0
      });
      
      // 执行测试
      await queryPlanController.getQueryPlanHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryPlanHistory).toHaveBeenCalledWith('test-ds-id', 20, 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
  
  describe('getQueryPlanById', () => {
    it('应当返回指定ID的查询计划', async () => {
      // 准备测试数据
      mockReq.params = {
        planId: 'plan-123'
      };
      
      // 确保mock方法正确返回
      mockQueryService.getQueryPlanById.mockResolvedValueOnce({
        id: 'plan-123',
        sql: 'SELECT * FROM users',
        planData: JSON.stringify({
          steps: [{ id: 1, operation: 'TABLE SCAN' }],
          costEstimate: 100
        }),
        createdAt: new Date()
      });
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryPlanById).toHaveBeenCalledWith('plan-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
    
    it('应当处理计划不存在的情况', async () => {
      // 准备测试数据
      mockReq.params = {
        planId: 'non-existent-plan'
      };
      
      // 设置service返回null
      mockQueryService.getQueryPlanById.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockQueryService.getQueryPlanById).toHaveBeenCalledWith('non-existent-plan');
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
  
  describe('comparePlans', () => {
    it('应当比较两个查询计划', async () => {
      // 准备测试数据
      const mockPlanA = {
        id: 'plan-1',
        sql: 'SELECT * FROM users',
        planData: JSON.stringify({steps: []}),
        dataSourceId: 'ds-1',
        createdAt: new Date()
      };
      
      const mockPlanB = {
        id: 'plan-2',
        sql: 'SELECT * FROM users WHERE id > 100',
        planData: JSON.stringify({steps: []}),
        dataSourceId: 'ds-1',
        createdAt: new Date()
      };
      
      mockReq.body = {
        planAId: 'plan-1',
        planBId: 'plan-2'
      };
      
      // 设置成功的模拟返回
      mockPrismaClient.queryPlan.findUnique
        .mockResolvedValueOnce(mockPlanA)
        .mockResolvedValueOnce(mockPlanB);
      
      mockQueryPlanService.comparePlans.mockResolvedValueOnce({
        summary: { improvement: true },
        nodeComparison: []
      });
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledTimes(2);
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith(mockPlanA.dataSourceId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Object)
      }));
    });
  });
});