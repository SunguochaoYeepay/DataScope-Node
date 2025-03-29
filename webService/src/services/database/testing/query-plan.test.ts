import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { EnhancedMySQLConnector } from '../enhanced-mysql.connector';
import { QueryPlan, QueryPlanNode } from '../../../types/query-plan';
import { QueryPlanError } from '../../../utils/errors';

// Mock数据库模块
jest.mock('mysql2/promise', () => {
  const mockPool = {
    getConnection: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  
  return {
    createPool: jest.fn().mockReturnValue(mockPool),
  };
});

// 禁用控制台输出以保持测试输出干净
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('EnhancedMySQLConnector - 查询计划功能测试', () => {
  let connector: EnhancedMySQLConnector;
  let mockConnection: any;
  let mockPool: any;
  
  // 创建假的查询执行计划结果
  const mockExplainResult = [
    [
      {
        id: 1,
        select_type: 'SIMPLE',
        table: 'users',
        type: 'ALL',
        possible_keys: null,
        key: null,
        key_len: null,
        ref: null,
        rows: 1000,
        filtered: 100,
        Extra: null
      }
    ],
    []
  ];
  
  // 创建假的JSON格式的执行计划结果
  const mockExplainJsonResult = [
    [
      {
        EXPLAIN: JSON.stringify({
          query_block: {
            select_id: 1,
            cost_info: {
              query_cost: '1024.50'
            }
          }
        })
      }
    ],
    []
  ];
  
  beforeEach(() => {
    // 重置所有模拟并创建新实例
    jest.clearAllMocks();
    
    // 设置模拟连接
    mockConnection = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    // 获取模拟池
    mockPool = require('mysql2/promise').createPool();
    mockPool.getConnection.mockResolvedValue(mockConnection);
    
    // 创建连接器实例
    connector = new EnhancedMySQLConnector('test-source-id', {
      host: 'localhost',
      port: 3306,
      user: 'test',
      password: 'test',
      database: 'testdb'
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('应当成功解析查询执行计划', async () => {
    // 设置模拟返回
    mockConnection.query
      .mockResolvedValueOnce(mockExplainResult)       // 模拟传统格式的EXPLAIN结果
      .mockResolvedValueOnce(mockExplainJsonResult);  // 模拟JSON格式的EXPLAIN结果
    
    const sql = 'SELECT * FROM users WHERE active = 1';
    const plan = await connector.explainQuery(sql);
    
    // 验证连接和查询是否正确调用
    expect(mockPool.getConnection).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN ${sql}`, []);
    expect(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN FORMAT=JSON ${sql}`, []);
    expect(mockConnection.release).toHaveBeenCalled();
    
    // 验证结果
    expect(plan).toBeDefined();
    expect(plan.planNodes).toHaveLength(1);
    expect(plan.planNodes[0].id).toBe(1);
    expect(plan.planNodes[0].table).toBe('users');
    expect(plan.planNodes[0].type).toBe('ALL');
    expect(plan.planNodes[0].rows).toBe(1000);
    expect(plan.estimatedCost).toBe(1024.5); // 从JSON格式中提取
  });
  
  it('应当处理JSON解析错误并回退到传统格式', async () => {
    // 设置模拟返回
    mockConnection.query
      .mockResolvedValueOnce(mockExplainResult)  // 模拟传统格式的EXPLAIN结果
      .mockRejectedValueOnce(new Error('JSON解析失败')); // 模拟JSON格式查询失败
    
    const sql = 'SELECT * FROM users WHERE active = 1';
    const plan = await connector.explainQuery(sql);
    
    // 验证连接和查询是否正确调用
    expect(mockPool.getConnection).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN ${sql}`, []);
    expect(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN FORMAT=JSON ${sql}`, []);
    expect(mockConnection.release).toHaveBeenCalled();
    
    // 验证结果 - 应该还是能够从传统格式获取数据
    expect(plan).toBeDefined();
    expect(plan.planNodes).toHaveLength(1);
    expect(plan.planNodes[0].table).toBe('users');
    expect(plan.estimatedCost).toBeUndefined(); // JSON格式失败，成本信息未获取
  });
  
  it('应当拒绝非SELECT查询的执行计划请求', async () => {
    const sql = 'INSERT INTO users (name) VALUES ("test")';
    
    // 验证是否抛出正确的错误
    await expect(connector.explainQuery(sql)).rejects.toThrow();
    
    // 验证连接是否被获取和释放
    expect(mockPool.getConnection).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    
    // 验证查询方法从未被调用（因为非SELECT语句检查失败）
    expect(mockConnection.query).not.toHaveBeenCalled();
  });
  
  it('应当捕获并包装查询执行计划过程中的错误', async () => {
    // 设置模拟连接查询失败
    mockConnection.query.mockRejectedValueOnce(new Error('数据库错误'));
    
    const sql = 'SELECT * FROM users WHERE active = 1';
    
    // 验证是否抛出正确的错误
    await expect(connector.explainQuery(sql)).rejects.toThrow();
    
    // 验证连接是否被获取和释放
    expect(mockPool.getConnection).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
  
  it('应当为执行计划生成优化建议', async () => {
    // 设置模拟返回 - 全表扫描的情况
    const mockFullScanResult = [
      [
        {
          id: 1,
          select_type: 'SIMPLE',
          table: 'users',
          type: 'ALL', // 全表扫描
          possible_keys: null,
          key: null,
          key_len: null,
          ref: null,
          rows: 10000, // 大量行
          filtered: 10, // 低过滤率
          Extra: 'Using filesort' // 使用文件排序
        }
      ],
      []
    ];
    
    mockConnection.query
      .mockResolvedValueOnce(mockFullScanResult)
      .mockResolvedValueOnce([[{ EXPLAIN: '{}' }], []]);
    
    const sql = 'SELECT * FROM users ORDER BY created_at';
    const plan = await connector.explainQuery(sql);
    
    // 验证优化建议
    expect(plan.optimizationTips).toBeDefined();
    expect(plan.optimizationTips.length).toBeGreaterThan(0);
    
    // 应该包含关于全表扫描的建议
    expect(plan.optimizationTips.some(tip => 
      tip.includes('全表扫描') && tip.includes('添加索引')
    )).toBe(true);
    
    // 应该包含关于文件排序的建议
    expect(plan.optimizationTips.some(tip => 
      tip.includes('文件排序')
    )).toBe(true);
  });
});