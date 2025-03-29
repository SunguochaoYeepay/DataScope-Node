// 将测试文件从TypeScript转换为JavaScript，以避免类型问题
const { QueryPlanController } = require('../../../src/api/controllers/query-plan.controller');
const queryService = require('../../../src/services/query.service').default;
const { ApiError } = require('../../../src/utils/error');
const { validationResult } = require('express-validator');

// 模拟query服务
jest.mock('../../../src/services/query.service', () => {
  return {
    __esModule: true,
    default: {
      explainQuery: jest.fn(),
      saveQueryPlanToHistory: jest.fn(),
      getQueryPlanHistory: jest.fn(),
      getQueryPlanById: jest.fn()
    }
  };
});

// 模拟express-validator
jest.mock('express-validator', () => {
  return {
    validationResult: jest.fn(),
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
      const mockPlan = {
        planType: 'EXPLAIN',
        steps: [
          { id: 1, operation: 'TABLE SCAN', details: { table: 'users' } }
        ],
        costEstimate: 100
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { sql: 'SELECT * FROM users' };
      
      // 设置服务返回值
      queryService.explainQuery.mockResolvedValue(mockPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.explainQuery).toHaveBeenCalledWith(
        'test-ds-id',
        'SELECT * FROM users',
        []
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPlan
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证失败
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { msg: '缺少SQL语句', param: 'sql' }
        ])
      });
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理服务抛出的错误', async () => {
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { sql: 'SELECT * FROM users' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('获取查询计划失败', 500);
      queryService.explainQuery.mockRejectedValue(mockError);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.explainQuery).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('saveQueryPlan', () => {
    it('应当保存查询计划', async () => {
      // 准备测试数据
      const mockPlanData = {
        name: 'Test Plan',
        sql: 'SELECT * FROM users',
        planData: {
          steps: [{ id: 1, operation: 'TABLE SCAN' }]
        },
        analysis: { recommendations: ['添加索引'] }
      };
      
      const mockSavedPlan = {
        id: 'plan-id',
        ...mockPlanData,
        createdAt: new Date()
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = mockPlanData;
      
      // 设置服务返回值
      queryService.saveQueryPlanToHistory.mockResolvedValue(mockSavedPlan);
      
      // 执行测试
      await queryPlanController.saveQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.saveQueryPlanToHistory).toHaveBeenCalledWith(
        'test-ds-id',
        mockPlanData
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSavedPlan
      });
    });
    
    it('应当处理保存查询计划时的错误', async () => {
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { name: 'Test Plan', sql: 'SELECT * FROM users' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('保存查询计划失败', 500);
      queryService.saveQueryPlanToHistory.mockRejectedValue(mockError);
      
      // 执行测试
      await queryPlanController.saveQueryPlan(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('应当返回查询计划历史记录', async () => {
      // 准备测试数据
      const mockHistory = {
        history: [
          {
            id: 'plan-1',
            name: 'Plan 1',
            sql: 'SELECT * FROM users',
            createdAt: new Date()
          },
          {
            id: 'plan-2',
            name: 'Plan 2',
            sql: 'SELECT * FROM orders',
            createdAt: new Date()
          }
        ],
        total: 2,
        limit: 10,
        offset: 0
      };
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { limit: '10', offset: '0' };
      
      // 设置服务返回值
      queryService.getQueryPlanHistory.mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryPlanController.getQueryPlanHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.getQueryPlanHistory).toHaveBeenCalledWith(
        'test-ds-id',
        10,
        0
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistory
      });
    });
    
    it('应当处理获取历史记录时的错误', async () => {
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      
      // 设置服务抛出错误
      const mockError = new ApiError('获取查询计划历史记录失败', 500);
      queryService.getQueryPlanHistory.mockRejectedValue(mockError);
      
      // 执行测试
      await queryPlanController.getQueryPlanHistory(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('compareQueryPlans', () => {
    it('应当比较两个查询计划', async () => {
      // 准备测试数据
      const mockPlan1 = {
        id: 'plan-1',
        planContent: JSON.stringify({
          steps: [{ id: 1, operation: 'TABLE SCAN', cost: 100 }]
        })
      };
      
      const mockPlan2 = {
        id: 'plan-2',
        planContent: JSON.stringify({
          steps: [{ id: 1, operation: 'INDEX SCAN', cost: 50 }]
        })
      };
      
      const mockComparison = {
        plan1: JSON.parse(mockPlan1.planContent),
        plan2: JSON.parse(mockPlan2.planContent),
        differences: [
          { type: 'operation', plan1: 'TABLE SCAN', plan2: 'INDEX SCAN' },
          { type: 'cost', plan1: 100, plan2: 50, improvement: 50 }
        ],
        recommendation: '计划2性能更好，使用了索引扫描而不是表扫描'
      };
      
      // 设置模拟请求参数
      mockReq.body = {
        plan1Id: 'plan-1',
        plan2Id: 'plan-2'
      };
      
      // 设置服务返回值
      queryService.getQueryPlanById.mockImplementation((id) => {
        if (id === 'plan-1') return Promise.resolve(mockPlan1);
        if (id === 'plan-2') return Promise.resolve(mockPlan2);
        return Promise.resolve(null);
      });
      
      // 模拟比较逻辑
      const originalCompare = queryPlanController.compareQueryPlansInternal;
      queryPlanController.compareQueryPlansInternal = jest.fn().mockReturnValue(mockComparison);
      
      // 执行测试
      await queryPlanController.compareQueryPlans(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith('plan-1');
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith('plan-2');
      expect(queryPlanController.compareQueryPlansInternal).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockComparison
      });
      
      // 恢复原始方法
      queryPlanController.compareQueryPlansInternal = originalCompare;
    });
    
    it('应当处理查询计划不存在的情况', async () => {
      // 设置模拟请求参数
      mockReq.body = {
        plan1Id: 'plan-1',
        plan2Id: 'non-existent-plan'
      };
      
      // 设置服务返回值
      queryService.getQueryPlanById.mockImplementation((id) => {
        if (id === 'plan-1') return Promise.resolve({ id: 'plan-1' });
        return Promise.resolve(null);
      });
      
      // 执行测试
      await queryPlanController.compareQueryPlans(mockReq, mockRes, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
  });
  
  describe('getOptimizationTips', () => {
    it('应当提供SQL查询优化建议', async () => {
      // 准备测试数据
      const mockPlan = {
        planType: 'EXPLAIN',
        steps: [
          { id: 1, operation: 'TABLE SCAN', details: { table: 'users' } }
        ],
        costEstimate: 100
      };
      
      const mockTips = [
        { type: 'index', description: '为users表的name列添加索引' },
        { type: 'rewrite', description: '使用具体列名替代SELECT *' }
      ];
      
      // 设置模拟请求参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.body = { sql: 'SELECT * FROM users WHERE name = "John"' };
      
      // 设置服务返回值
      queryService.explainQuery.mockResolvedValue(mockPlan);
      
      // 模拟优化建议逻辑
      const originalGetTips = queryPlanController.getOptimizationTipsInternal;
      queryPlanController.getOptimizationTipsInternal = jest.fn().mockReturnValue(mockTips);
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq, mockRes, mockNext);
      
      // 验证
      expect(queryService.explainQuery).toHaveBeenCalledWith(
        'test-ds-id',
        'SELECT * FROM users WHERE name = "John"',
        []
      );
      expect(queryPlanController.getOptimizationTipsInternal).toHaveBeenCalledWith(
        mockPlan,
        'SELECT * FROM users WHERE name = "John"'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          plan: mockPlan,
          tips: mockTips
        }
      });
      
      // 恢复原始方法
      queryPlanController.getOptimizationTipsInternal = originalGetTips;
    });
  });
});