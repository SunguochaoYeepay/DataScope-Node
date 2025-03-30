/**
 * 增强型MySQL连接器测试
 * 用于测试查询计划和高级功能
 */

// 测试 EnhancedMySQLConnector
const { EnhancedMySQLConnector } = require('../../../../src/services/database/enhanced-mysql.connector');
// 不再重复导入 jest
// const { jest } = require('@jest/globals');
const { DatabaseError } = require('../../../../src/utils/errors');

// 模拟mysql2/promise模块
jest.mock('mysql2/promise', () => {
  // 创建模拟连接和连接池
  const mockConnection = {
    query: jest.fn(),
    execute: jest.fn(),
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn()
  };
  
  const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    query: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined)
  };
  
  return {
    createPool: jest.fn().mockReturnValue(mockPool)
  };
});

describe('EnhancedMySQLConnector', () => {
  let connector;
  let mockPool;
  let mockConnection;
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'test_user',
    password: 'test_password',
    database: 'test_db'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 获取模拟对象
    const mysql2 = require('mysql2/promise');
    mockPool = mysql2.createPool();
    mockConnection = mockPool.getConnection();
    
    // 创建连接器实例
    connector = new EnhancedMySQLConnector(config);
  });
  
  describe('getQueryPlan', () => {
    it('应当获取JSON格式的查询执行计划', async () => {
      // 模拟EXPLAIN FORMAT=JSON查询结果
      const mockJsonPlan = {
        query_block: {
          select_id: 1,
          cost_info: {
            query_cost: "1.00"
          },
          table: {
            table_name: "users",
            access_type: "ALL",
            rows_examined_per_scan: 100,
            filtered: "100.00"
          }
        }
      };
      
      mockPool.query.mockResolvedValueOnce([[{ EXPLAIN: JSON.stringify(mockJsonPlan) }], []]);
      
      // 执行测试
      const result = await connector.getQueryPlan('SELECT * FROM users');
      
      // 验证
      expect(result).toEqual({
        query: 'SELECT * FROM users',
        planJson: mockJsonPlan,
        planNodes: expect.any(Array)
      });
      expect(mockPool.query).toHaveBeenCalledWith('EXPLAIN FORMAT=JSON SELECT * FROM users', undefined);
    });
    
    it('应当处理不支持JSON格式的MySQL版本', async () => {
      // 模拟JSON格式查询错误
      mockPool.query.mockRejectedValueOnce(new Error('EXPLAIN FORMAT=JSON not supported'));
      
      // 模拟传统EXPLAIN结果
      const mockTraditionalExplain = [
        { id: 1, select_type: 'SIMPLE', table: 'users', type: 'ALL', rows: 100 }
      ];
      
      mockPool.query.mockResolvedValueOnce([[mockTraditionalExplain], []]);
      
      // 执行测试
      const result = await connector.getQueryPlan('SELECT * FROM users');
      
      // 验证
      expect(result).toEqual({
        query: 'SELECT * FROM users',
        planNodes: expect.any(Array)
      });
      expect(mockPool.query).toHaveBeenCalledWith('EXPLAIN SELECT * FROM users', undefined);
    });
    
    it('应当处理非SELECT语句', async () => {
      // 执行测试并验证抛出的错误
      await expect(connector.getQueryPlan('INSERT INTO users VALUES (1, "test")')).rejects.toThrow();
    });
  });
  
  describe('executeTransaction', () => {
    it('应当成功执行事务', async () => {
      // 设置模拟函数返回
      mockConnection.beginTransaction.mockResolvedValueOnce();
      mockConnection.query.mockResolvedValueOnce([[{ affectedRows: 1 }], []]);
      mockConnection.commit.mockResolvedValueOnce();
      
      // 准备事务回调
      const transactionCallback = jest.fn().mockImplementation(async (conn) => {
        await conn.query('INSERT INTO users (name) VALUES ("test")');
        return { success: true };
      });
      
      // 执行测试
      const result = await connector.executeTransaction(transactionCallback);
      
      // 验证
      expect(result).toEqual({ success: true });
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(transactionCallback).toHaveBeenCalled();
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
    
    it('应当在事务失败时回滚', async () => {
      // 设置模拟函数返回
      mockConnection.beginTransaction.mockResolvedValueOnce();
      mockConnection.rollback.mockResolvedValueOnce();
      
      // 准备失败的事务回调
      const transactionCallback = jest.fn().mockRejectedValueOnce(new Error('事务操作失败'));
      
      // 执行测试并验证抛出的错误
      await expect(connector.executeTransaction(transactionCallback)).rejects.toThrow();
      
      // 验证
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(transactionCallback).toHaveBeenCalled();
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
  
  describe('getPrimaryKeys', () => {
    it('应当获取表的主键列表', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { Column_name: 'id' }
      ], []]);
      
      // 执行测试
      const result = await connector.getPrimaryKeys('test_db', 'users');
      
      // 验证
      expect(result).toEqual(['id']);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('information_schema.KEY_COLUMN_USAGE'));
    });
  });
  
  describe('getForeignKeys', () => {
    it('应当获取表的外键信息', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { 
          column_name: 'user_id',
          referenced_table_name: 'users',
          referenced_column_name: 'id',
          constraint_name: 'fk_orders_users'
        }
      ], []]);
      
      // 执行测试
      const result = await connector.getForeignKeys('test_db', 'orders');
      
      // 验证
      expect(result).toEqual([
        {
          column: 'user_id',
          referencedTable: 'users',
          referencedColumn: 'id',
          constraintName: 'fk_orders_users'
        }
      ]);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('information_schema.KEY_COLUMN_USAGE'));
    });
  });
  
  describe('getIndexes', () => {
    it('应当获取表的索引信息', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { 
          Key_name: 'PRIMARY',
          Column_name: 'id',
          Non_unique: 0,
          Seq_in_index: 1
        },
        { 
          Key_name: 'idx_name',
          Column_name: 'name',
          Non_unique: 1,
          Seq_in_index: 1
        }
      ], []]);
      
      // 执行测试
      const result = await connector.getIndexes('test_db', 'users');
      
      // 验证
      expect(result).toEqual([
        {
          name: 'PRIMARY',
          columns: ['id'],
          isUnique: true
        },
        {
          name: 'idx_name',
          columns: ['name'],
          isUnique: false
        }
      ]);
      expect(mockPool.query).toHaveBeenCalledWith('SHOW INDEX FROM `test_db`.`users`');
    });
  });
  
  describe('isJsonExplainSupported', () => {
    it('应当检测MySQL是否支持JSON格式的EXPLAIN', async () => {
      // 模拟查询结果 - 版本8.0.1
      mockPool.query.mockResolvedValueOnce([[{ version: '8.0.1' }], []]);
      
      // 重新创建连接器
      connector = new EnhancedMySQLConnector(config);
      await connector.testConnection();
      
      // 验证
      expect(connector.isJsonExplainSupported).toBe(true);
    });
    
    it('应当检测老版本MySQL不支持JSON格式的EXPLAIN', async () => {
      // 模拟查询结果 - 版本5.6.0
      mockPool.query.mockResolvedValueOnce([[{ version: '5.6.0' }], []]);
      
      // 重新创建连接器
      connector = new EnhancedMySQLConnector(config);
      await connector.testConnection();
      
      // 验证
      expect(connector.isJsonExplainSupported).toBe(false);
    });
  });
  
  describe('cancelQuery', () => {
    it('应当取消正在执行的查询', async () => {
      // 模拟查询ID查询结果
      mockPool.query.mockResolvedValueOnce([[{ id: 123 }], []]);
      
      // 模拟KILL QUERY结果
      mockPool.query.mockResolvedValueOnce([[], []]);
      
      // 执行测试
      const result = await connector.cancelQuery('query-123');
      
      // 验证
      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('KILL QUERY'), [123]);
    });
    
    it('应当处理找不到查询ID的情况', async () => {
      // 模拟空结果
      mockPool.query.mockResolvedValueOnce([[], []]);
      
      // 执行测试
      const result = await connector.cancelQuery('query-123');
      
      // 验证
      expect(result).toBe(false);
    });
  });
}); 