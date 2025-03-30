// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { QueryPlanController } = require('../../../src/api/controllers/query-plan.controller');
const { ApiError } = require('../../../src/utils/errors/api-error');

// 模拟dependencies
const mockExplainQuery = jest.fn();
const mockGetQueryPlan = jest.fn();
const mockSaveQueryPlanToHistory = jest.fn();
const mockGetQueryPlanHistory = jest.fn();
const mockGetQueryPlanById = jest.fn();
const mockConnector = {
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
};

// 模拟PrismaClient
const mockPrismaClient = {
  queryPlan: {
    create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 'plan-id-123', ...data.data })),
    findUnique: jest.fn().mockImplementation(() => Promise.resolve({ 
      id: 'plan-id-123', 
      dataSourceId: 'test-ds-id',
      sql: 'SELECT * FROM users',
      planData: JSON.stringify({ steps: [{ id: 1, operation: 'TABLE SCAN' }] }),
      query: { id: 'query-123' }
    })),
    update: jest.fn(),
    findMany: jest.fn().mockImplementation(() => Promise.resolve([
      { id: 'plan-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'plan-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ]))
  }
};

// 模拟prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 创建模拟数据源服务
const mockDataSourceService = {
  getDataSourceById: jest.fn().mockResolvedValue({ 
    id: 'test-ds-id', 
    name: 'Test DB',
    type: 'mysql'
  }),
  getConnector: jest.fn().mockResolvedValue(mockConnector)
};

// 创建模拟查询服务
const mockQueryService = {
  explainQuery: mockExplainQuery.mockResolvedValue({
    query: 'SELECT * FROM users',
    explanation: 'Table scan on users table',
    cost: 100
  }),
  saveQueryPlanToHistory: mockSaveQueryPlanToHistory.mockResolvedValue({ id: 'plan-123' }),
  getQueryPlanHistory: mockGetQueryPlanHistory.mockResolvedValue({
    history: [
      { id: 'plan-1', sql: 'SELECT * FROM users', createdAt: new Date() },
      { id: 'plan-2', sql: 'SELECT * FROM orders', createdAt: new Date() }
    ],
    total: 2,
    limit: 10,
    offset: 0
  }),
  getQueryPlanById: mockGetQueryPlanById.mockResolvedValue({
    id: 'plan-123',
    sql: 'SELECT * FROM users',
    planData: JSON.stringify({
      steps: [{ id: 1, operation: 'TABLE SCAN' }],
      costEstimate: 100
    }),
    createdAt: new Date()
  })
};

// 模拟服务
jest.mock('../../../src/services/datasource.service', () => {
  return { 
    DataSourceService: jest.fn().mockImplementation(() => mockDataSourceService)
  };
});

jest.mock('../../../src/services/query.service', () => {
  return { 
    QueryService: jest.fn().mockImplementation(() => mockQueryService)
  };
});

// 模拟查询计划服务
const mockQueryPlanService = {
  getQueryPlan: jest.fn().mockResolvedValue({
    query: 'SELECT * FROM users',
    planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
  }),
  analyzePlan: jest.fn(),
  comparePlans: jest.fn().mockImplementation(() => ({
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
  }))
};

jest.mock('../../../src/services/query-plan.service', () => {
  return { 
    QueryPlanService: jest.fn().mockImplementation(() => mockQueryPlanService)
  };
});

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

describe('QueryPlanController', () => {
  let queryPlanController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 重新初始化控制器
    queryPlanController = new QueryPlanController();
    
    // 重新初始化请求和响应对象
    mockReq = {
      params: {},
      query: {},
      body: {},
      user: { id: 'user-123', email: 'test@example.com', role: 'user' }
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
    
    // 设置mock connector返回值
    mockConnector.getQueryPlan.mockResolvedValue({
      query: 'SELECT * FROM users',
      steps: [{ id: 1, operation: 'TABLE SCAN', details: { table: 'users' } }],
      costEstimate: 100
    });
  });
  
  describe('getQueryPlan', () => {
    it('应当返回查询执行计划', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users' 
      };
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          plan: expect.any(Object)
        })
      }));
    });
    
    it('应当处理数据源不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'non-existent-ds-id',
        sql: 'SELECT * FROM users' 
      };
      
      // 修改dataSourceService的getDataSourceById为返回null
      mockDataSourceService.getDataSourceById.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: '数据源不存在'
      }));
    });
    
    it('应当处理缺少必要参数的情况', async () => {
      // 设置模拟请求参数 - 缺少sql
      mockReq.body = { dataSourceId: 'test-ds-id' };
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: '缺少必要参数'
      }));
    });
    
    it('应当处理服务异常', async () => {
      // 设置模拟请求参数
      mockReq.body = { 
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users' 
      };
      
      // 模拟连接器抛出异常
      mockConnector.getQueryPlan.mockRejectedValueOnce(new Error('数据库连接错误'));
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('错误')
      }));
    });
  });
  
  describe('getOptimizationTips', () => {
    it('应当提供SQL查询优化建议', async () => {
      // 设置模拟请求参数
      mockReq.params = { planId: 'plan-123' };
      
      // 确保prisma返回正确的计划
      mockPrismaClient.queryPlan.findUnique.mockResolvedValueOnce({
        id: 'plan-123',
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users',
        planData: JSON.stringify({
          steps: [{ id: 1, operation: 'TABLE SCAN' }],
          costEstimate: 100
        })
      });
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          suggestions: expect.any(Array),
          optimizedSql: expect.any(String)
        })
      }));
    });
    
    it('应当处理计划不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.params = { planId: 'non-existent-plan' };
      
      // 设置prisma返回null
      mockPrismaClient.queryPlan.findUnique.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: '查询计划不存在'
      }));
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('应当返回查询计划历史记录', async () => {
      // 设置模拟请求参数
      mockReq.query = { dataSourceId: 'test-ds-id', limit: '20', offset: '0' };
      
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
      // 设置模拟请求参数
      mockReq.params = { id: 'plan-123' };
      
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
      // 设置模拟请求参数
      mockReq.params = { id: 'non-existent-plan' };
      
      // 设置服务返回null
      mockQueryService.getQueryPlanById.mockResolvedValueOnce(null);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: '查询计划不存在'
      }));
    });
  });
  
  describe('comparePlans', () => {
    it('应当比较两个查询计划', async () => {
      // 设置模拟请求参数
      mockReq.body = { planAId: 'plan-a', planBId: 'plan-b' };
      
      // 设置mockPlanA和mockPlanB
      const mockPlanA = {
        id: 'plan-a',
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users',
        planData: JSON.stringify({
          steps: [{ id: 1, operation: 'TABLE SCAN' }],
          costEstimate: 100
        })
      };
      
      const mockPlanB = {
        id: 'plan-b',
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users WHERE id = 1',
        planData: JSON.stringify({
          steps: [{ id: 1, operation: 'INDEX SCAN' }],
          costEstimate: 80
        })
      };
      
      // 模拟prisma返回
      mockPrismaClient.queryPlan.findUnique
        .mockResolvedValueOnce(mockPlanA)
        .mockResolvedValueOnce(mockPlanB);
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          summary: expect.any(Object),
          nodeComparison: expect.any(Array)
        })
      }));
    });
  });
});