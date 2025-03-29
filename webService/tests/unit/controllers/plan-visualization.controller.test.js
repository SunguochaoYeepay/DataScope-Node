// 将测试文件使用JavaScript编写，避免类型问题
const { PlanVisualizationController } = require('../../../src/api/controllers/plan-visualization.controller');
const queryService = require('../../../src/services/query.service').default;
const { ApiError } = require('../../../src/utils/error');
const { validationResult } = require('express-validator');

// 模拟query服务
jest.mock('../../../src/services/query.service', () => {
  return {
    __esModule: true,
    default: {
      getQueryPlanById: jest.fn(),
      explainQuery: jest.fn()
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

describe('PlanVisualizationController', () => {
  let planVisualizationController;
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    planVisualizationController = new PlanVisualizationController();
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
  
  describe('getVisualizationDataFromPlan', () => {
    it('应当从现有查询计划生成可视化数据', async () => {
      // 准备测试数据
      const planId = 'plan-id-123';
      const mockPlan = {
        id: planId,
        planData: JSON.stringify({
          queryType: 'SELECT',
          plan: [
            {
              id: 'node1',
              nodeType: 'Seq Scan',
              cost: 100,
              table: 'users'
            }
          ]
        })
      };
      
      // 设置请求参数
      mockReq.params.id = planId;
      
      // 设置服务返回值
      queryService.getQueryPlanById.mockResolvedValue(mockPlan);
      
      // 模拟内部转换方法
      const originalConvert = planVisualizationController.convertPlanToVisualizationData;
      planVisualizationController.convertPlanToVisualizationData = jest.fn().mockReturnValue({
        nodes: [{ id: 'node1', label: 'Seq Scan', table: 'users' }],
        edges: []
      });
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromPlan(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith(planId);
      expect(planVisualizationController.convertPlanToVisualizationData).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          nodes: [{ id: 'node1', label: 'Seq Scan', table: 'users' }],
          edges: []
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
      
      // 恢复原始方法
      planVisualizationController.convertPlanToVisualizationData = originalConvert;
    });
    
    it('应当处理查询计划不存在的情况', async () => {
      // 设置请求参数
      mockReq.params.id = 'non-existent-id';
      
      // 设置服务返回值
      queryService.getQueryPlanById.mockResolvedValue(null);
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromPlan(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith('non-existent-id');
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
    
    it('应当处理查询计划数据格式不正确的情况', async () => {
      // 准备测试数据
      const planId = 'plan-id-123';
      const mockPlan = {
        id: planId,
        planData: 'invalid-json-data'
      };
      
      // 设置请求参数
      mockReq.params.id = planId;
      
      // 设置服务返回值
      queryService.getQueryPlanById.mockResolvedValue(mockPlan);
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromPlan(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith(planId);
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
    });
  });
  
  describe('getVisualizationDataFromSql', () => {
    it('应当从SQL生成可视化数据', async () => {
      // 准备测试数据
      const dataSourceId = 'ds-id-123';
      const sqlQuery = 'SELECT * FROM users';
      const mockPlan = {
        queryType: 'SELECT',
        plan: [
          {
            id: 'node1',
            nodeType: 'Seq Scan',
            cost: 100,
            table: 'users'
          }
        ]
      };
      
      // 设置请求参数
      mockReq.params.dataSourceId = dataSourceId;
      mockReq.body = { sql: sqlQuery };
      
      // 设置服务返回值
      queryService.explainQuery.mockResolvedValue(mockPlan);
      
      // 模拟内部转换方法
      const originalConvert = planVisualizationController.convertPlanToVisualizationData;
      planVisualizationController.convertPlanToVisualizationData = jest.fn().mockReturnValue({
        nodes: [{ id: 'node1', label: 'Seq Scan', table: 'users' }],
        edges: []
      });
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromSql(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(queryService.explainQuery).toHaveBeenCalledWith(dataSourceId, sqlQuery, []);
      expect(planVisualizationController.convertPlanToVisualizationData).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          nodes: [{ id: 'node1', label: 'Seq Scan', table: 'users' }],
          edges: []
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
      
      // 恢复原始方法
      planVisualizationController.convertPlanToVisualizationData = originalConvert;
    });
    
    it('应当处理验证错误', async () => {
      // 设置验证错误
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([
          { param: 'sql', msg: 'SQL查询不能为空' }
        ])
      });
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromSql(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
    });
    
    it('应当处理查询计划获取失败的情况', async () => {
      // 准备测试数据
      const dataSourceId = 'ds-id-123';
      const sqlQuery = 'SELECT * FROM non_existent_table';
      
      // 设置请求参数
      mockReq.params.dataSourceId = dataSourceId;
      mockReq.body = { sql: sqlQuery };
      
      // 设置服务抛出错误
      const mockError = new ApiError('获取查询计划失败', 500);
      queryService.explainQuery.mockRejectedValue(mockError);
      
      // 执行测试
      await planVisualizationController.getVisualizationDataFromSql(mockReq, mockRes, mockNext);
      
      // 验证结果
      expect(queryService.explainQuery).toHaveBeenCalledWith(dataSourceId, sqlQuery, []);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('convertPlanToVisualizationData', () => {
    it('应当正确转换MySQL查询计划为可视化数据', () => {
      // 创建实际的控制器实例
      const controller = new PlanVisualizationController();
      
      // MySQL查询计划示例
      const mysqlPlan = {
        queryType: 'SELECT',
        dbType: 'mysql',
        plan: [
          {
            id: 'node1',
            nodeType: 'SIMPLE',
            table: 'users',
            accessType: 'ALL',
            rows: 1000,
            filtered: 100,
            extra: 'Using where'
          }
        ]
      };
      
      // 执行转换
      const result = controller.convertPlanToVisualizationData(mysqlPlan);
      
      // 验证结果
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toHaveProperty('id', 'node1');
      expect(result.nodes[0]).toHaveProperty('label', 'SIMPLE');
      expect(result.nodes[0]).toHaveProperty('data');
    });
    
    it('应当正确转换PostgreSQL查询计划为可视化数据', () => {
      // 创建实际的控制器实例
      const controller = new PlanVisualizationController();
      
      // PostgreSQL查询计划示例
      const postgreSQLPlan = {
        queryType: 'SELECT',
        dbType: 'postgresql',
        plan: {
          'Node Type': 'Seq Scan',
          'Relation Name': 'users',
          'Startup Cost': 0,
          'Total Cost': 10.5,
          'Plan Rows': 100,
          Plans: [
            {
              'Node Type': 'Index Scan',
              'Relation Name': 'orders',
              'Index Name': 'orders_user_id_idx',
              'Startup Cost': 0,
              'Total Cost': 5.5,
              'Plan Rows': 10
            }
          ]
        }
      };
      
      // 执行转换
      const result = controller.convertPlanToVisualizationData(postgreSQLPlan);
      
      // 验证结果
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.nodes.length).toBeGreaterThan(0);
      expect(result.edges.length).toBeGreaterThan(0);
    });
    
    it('应当处理无效的查询计划结构', () => {
      // 创建实际的控制器实例
      const controller = new PlanVisualizationController();
      
      // 无效的查询计划
      const invalidPlan = {
        queryType: 'SELECT',
        // 缺少plan字段
      };
      
      // 执行转换
      const result = controller.convertPlanToVisualizationData(invalidPlan);
      
      // 验证结果
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.nodes.length).toBe(0);
      expect(result.edges.length).toBe(0);
    });
  });
});