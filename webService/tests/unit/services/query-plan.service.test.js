// 将测试文件使用JavaScript编写，避免类型问题
const { QueryPlanService } = require('../../../src/services/query-plan.service');
const { describe, beforeEach, it, expect } = require('@jest/globals');

// 模拟数据库连接器
const mockConnector = {
  explainQuery: jest.fn(),
  testConnection: jest.fn(),
  getDatabases: jest.fn(),
  getTables: jest.fn(),
  getColumns: jest.fn(),
  getIndexes: jest.fn(),
  getPrimaryKeys: jest.fn(),
  getForeignKeys: jest.fn(),
  executeQuery: jest.fn(),
  closeConnection: jest.fn()
};

describe('QueryPlanService', () => {
  let queryPlanService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    queryPlanService = new QueryPlanService();
  });
  
  describe('getQueryPlan', () => {
    it('应当返回查询计划并添加分析信息', async () => {
      // 模拟返回的基础查询计划
      const mockQueryPlan = {
        query: 'SELECT * FROM users WHERE status = "active"',
        estimatedRows: 1000,
        planNodes: [
          {
            id: 1,
            type: 'ALL',
            table: 'users',
            rows: 5000,
            filtered: 20,
            extra: 'Using where',
            keyLen: null
          }
        ],
        warnings: [],
        optimizationTips: []
      };
      
      // 设置explainQuery的模拟返回值
      mockConnector.explainQuery.mockResolvedValue(mockQueryPlan);
      
      // 执行测试
      const result = await queryPlanService.getQueryPlan(mockConnector, 'SELECT * FROM users WHERE status = "active"');
      
      // 验证explainQuery被调用
      expect(mockConnector.explainQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE status = "active"');
      
      // 验证返回结果包含原始查询计划的内容
      expect(result).toHaveProperty('query', 'SELECT * FROM users WHERE status = "active"');
      expect(result).toHaveProperty('estimatedRows', 1000);
      expect(result.planNodes).toHaveLength(1);
      expect(result.planNodes[0]).toHaveProperty('table', 'users');
      
      // 验证分析信息已添加
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result).toHaveProperty('optimizationTips');
      expect(Array.isArray(result.optimizationTips)).toBe(true);
      
      // 由于全表扫描，应该有相关警告
      expect(result.warnings.some(warning => warning.includes('全表扫描'))).toBe(true);
      
      // 应该有关于添加索引的优化建议
      expect(result.optimizationTips.some(tip => tip.includes('添加索引'))).toBe(true);
    });
    
    it('应当处理获取查询计划失败的情况', async () => {
      // 设置explainQuery抛出错误
      const error = new Error('Failed to get query plan');
      mockConnector.explainQuery.mockRejectedValue(error);
      
      // 执行测试并验证抛出异常
      await expect(queryPlanService.getQueryPlan(mockConnector, 'Invalid SQL')).rejects.toThrow(error);
      expect(mockConnector.explainQuery).toHaveBeenCalledWith('Invalid SQL');
    });
  });
  
  describe('comparePlans', () => {
    it('应当比较两个查询计划并提供差异分析', () => {
      // 准备测试数据 - 优化前的计划
      const plan1 = {
        query: 'SELECT * FROM users WHERE status = "active"',
        estimatedRows: 5000,
        estimatedCost: 1000,
        planNodes: [
          {
            id: 1,
            type: 'ALL',
            table: 'users',
            rows: 5000,
            filtered: 20,
            extra: 'Using where',
            keyLen: null
          }
        ],
        warnings: ['表 users 正在进行全表扫描'],
        optimizationTips: ['考虑为表 users 添加索引']
      };
      
      // 准备测试数据 - 优化后的计划
      const plan2 = {
        query: 'SELECT * FROM users WHERE status = "active"',
        estimatedRows: 1000,
        estimatedCost: 200,
        planNodes: [
          {
            id: 1,
            type: 'ref',
            table: 'users',
            rows: 1000,
            filtered: 100,
            key: 'idx_status',
            extra: 'Using index',
            keyLen: 10
          }
        ],
        warnings: [],
        optimizationTips: []
      };
      
      // 执行比较
      const comparison = queryPlanService.comparePlans(plan1, plan2);
      
      // 验证比较结果
      expect(comparison).toHaveProperty('summary');
      expect(comparison.summary).toHaveProperty('costDifference', -800); // plan2成本更低
      expect(comparison.summary).toHaveProperty('rowsDifference', -4000); // plan2扫描行数更少
      expect(comparison.summary).toHaveProperty('improvement', true); // 有改进
      
      // 验证节点比较
      expect(comparison).toHaveProperty('nodeComparison');
      expect(comparison.nodeComparison).toHaveLength(1);
      expect(comparison.nodeComparison[0]).toHaveProperty('table', 'users');
      expect(comparison.nodeComparison[0].rows).toHaveProperty('plan1', 5000);
      expect(comparison.nodeComparison[0].rows).toHaveProperty('plan2', 1000);
      expect(comparison.nodeComparison[0].rows).toHaveProperty('difference', -4000);
      
      // 验证访问类型变化
      expect(comparison).toHaveProperty('accessTypeChanges');
      expect(comparison.accessTypeChanges).toHaveLength(1);
      expect(comparison.accessTypeChanges[0]).toHaveProperty('table', 'users');
      expect(comparison.accessTypeChanges[0]).toHaveProperty('from', 'ALL');
      expect(comparison.accessTypeChanges[0]).toHaveProperty('to', 'ref');
      expect(comparison.accessTypeChanges[0]).toHaveProperty('improvement', true);
      
      // 验证索引使用变化
      expect(comparison).toHaveProperty('indexUsageChanges');
      expect(comparison.indexUsageChanges).toHaveLength(1);
      expect(comparison.indexUsageChanges[0]).toHaveProperty('table', 'users');
      expect(comparison.indexUsageChanges[0]).toHaveProperty('from', '无索引');
      expect(comparison.indexUsageChanges[0]).toHaveProperty('to', 'idx_status');
    });
    
    it('应当正确处理没有计划节点的情况', () => {
      // 准备测试数据 - 没有节点的计划
      const plan1 = {
        query: 'SELECT 1',
        estimatedRows: 1,
        estimatedCost: 1,
        planNodes: [],
        warnings: [],
        optimizationTips: []
      };
      
      const plan2 = {
        query: 'SELECT 1',
        estimatedRows: 1,
        estimatedCost: 1,
        planNodes: [],
        warnings: [],
        optimizationTips: []
      };
      
      // 执行比较
      const comparison = queryPlanService.comparePlans(plan1, plan2);
      
      // 验证比较结果仍然有基本结构
      expect(comparison).toHaveProperty('summary');
      expect(comparison.summary).toHaveProperty('costDifference', 0);
      expect(comparison.summary).toHaveProperty('rowsDifference', 0);
      
      // 节点比较数组应该为空
      expect(comparison.nodeComparison).toEqual([]);
      expect(comparison.accessTypeChanges).toEqual([]);
      expect(comparison.indexUsageChanges).toEqual([]);
    });
    
    it('应当正确处理节点表名不匹配的情况', () => {
      // 准备测试数据 - 不同表的节点
      const plan1 = {
        query: 'SELECT * FROM users',
        planNodes: [
          {
            id: 1,
            type: 'ALL',
            table: 'users',
            rows: 1000,
            filtered: 100,
            keyLen: null
          }
        ],
        warnings: [],
        optimizationTips: []
      };
      
      const plan2 = {
        query: 'SELECT * FROM customers',
        planNodes: [
          {
            id: 1,
            type: 'ALL',
            table: 'customers',
            rows: 2000,
            filtered: 100,
            keyLen: null
          }
        ],
        warnings: [],
        optimizationTips: []
      };
      
      // 执行比较
      const comparison = queryPlanService.comparePlans(plan1, plan2);
      
      // 节点比较数组应该为空（因为表名不匹配）
      expect(comparison.nodeComparison).toEqual([]);
      expect(comparison.accessTypeChanges).toEqual([]);
      expect(comparison.indexUsageChanges).toEqual([]);
    });
  });
});