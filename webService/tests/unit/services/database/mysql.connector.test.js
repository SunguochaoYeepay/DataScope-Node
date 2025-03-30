/**
 * MySQL连接器测试
 * 用于测试数据库连接、查询执行和错误处理
 */

const { jest } = require('@jest/globals');
const { MySQLConnector } = require('../../../../src/services/database/mysql.connector');
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

describe('MySQLConnector', () => {
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
    mockConnection = mockPool.getConnection.mockResolvedValue;
    
    // 创建连接器实例
    connector = new MySQLConnector(config);
  });
  
  describe('testConnection', () => {
    it('应当成功测试连接', async () => {
      // 模拟成功连接
      mockPool.query.mockResolvedValueOnce([]);
      
      // 执行测试
      const result = await connector.testConnection();
      
      // 验证
      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalled();
    });
    
    it('应当处理连接错误', async () => {
      // 模拟连接错误
      mockPool.query.mockRejectedValueOnce(new Error('数据库连接失败'));
      
      // 执行测试并验证抛出的错误
      await expect(connector.testConnection()).rejects.toThrow(DatabaseError);
    });
  });
  
  describe('executeQuery', () => {
    it('应当成功执行查询并返回结果', async () => {
      // 模拟查询结果
      const mockColumns = [
        { name: 'id', columnType: 'INT' },
        { name: 'name', columnType: 'VARCHAR' }
      ];
      
      const mockRows = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ];
      
      mockPool.query.mockResolvedValueOnce([[mockRows], [mockColumns]]);
      
      // 执行测试
      const result = await connector.executeQuery('SELECT * FROM users');
      
      // 验证
      expect(result).toEqual({
        columns: ['id', 'name'],
        rows: mockRows,
        rowCount: 2,
        executionTime: expect.any(Number)
      });
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users', undefined);
    });
    
    it('应当支持参数化查询', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { id: 1, name: 'User 1' }
      ], [
        { name: 'id', columnType: 'INT' },
        { name: 'name', columnType: 'VARCHAR' }
      ]]);
      
      // 执行测试
      await connector.executeQuery('SELECT * FROM users WHERE id = ?', [1]);
      
      // 验证
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
    });
    
    it('应当处理查询错误', async () => {
      // 模拟查询错误
      mockPool.query.mockRejectedValueOnce(new Error('查询执行失败'));
      
      // 执行测试并验证抛出的错误
      await expect(connector.executeQuery('SELECT * FROM users')).rejects.toThrow(DatabaseError);
    });
  });
  
  describe('close', () => {
    it('应当关闭数据库连接', async () => {
      // 执行测试
      await connector.close();
      
      // 验证
      expect(mockPool.end).toHaveBeenCalled();
    });
    
    it('应当处理关闭连接时的错误', async () => {
      // 模拟关闭连接错误
      mockPool.end.mockRejectedValueOnce(new Error('关闭连接失败'));
      
      // 执行测试
      await expect(connector.close()).resolves.not.toThrow();
    });
  });
  
  describe('explainQuery', () => {
    it('应当获取查询执行计划', async () => {
      // 模拟EXPLAIN查询结果
      const mockExplainResult = [
        { id: 1, select_type: 'SIMPLE', table: 'users', type: 'ALL', rows: 100 }
      ];
      
      mockPool.query.mockResolvedValueOnce([[mockExplainResult], []]);
      
      // 执行测试
      const result = await connector.explainQuery('SELECT * FROM users');
      
      // 验证
      expect(result).toEqual({
        steps: [
          { id: 1, select_type: 'SIMPLE', table: 'users', type: 'ALL', rows: 100 }
        ]
      });
      expect(mockPool.query).toHaveBeenCalledWith('EXPLAIN SELECT * FROM users', undefined);
    });
    
    it('应当处理非SELECT语句', async () => {
      // 执行测试并验证抛出的错误
      await expect(connector.explainQuery('INSERT INTO users VALUES (1, "test")')).rejects.toThrow();
    });
  });
  
  describe('getSchemas', () => {
    it('应当获取数据库模式列表', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { Database: 'test_db' },
        { Database: 'information_schema' }
      ], []]);
      
      // 执行测试
      const result = await connector.getSchemas();
      
      // 验证
      expect(result).toEqual(['test_db', 'information_schema']);
      expect(mockPool.query).toHaveBeenCalledWith('SHOW DATABASES');
    });
  });
  
  describe('getTables', () => {
    it('应当获取指定数据库中的表列表', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { Table_name: 'users' },
        { Table_name: 'orders' }
      ], []]);
      
      // 执行测试
      const result = await connector.getTables('test_db');
      
      // 验证
      expect(result).toEqual(['users', 'orders']);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT table_name as Table_name FROM information_schema.tables WHERE table_schema = ? AND table_type = "BASE TABLE"',
        ['test_db']
      );
    });
  });
  
  describe('getColumns', () => {
    it('应当获取指定表的列信息', async () => {
      // 模拟查询结果
      mockPool.query.mockResolvedValueOnce([[
        { 
          Field: 'id', 
          Type: 'int(11)', 
          Null: 'NO', 
          Key: 'PRI', 
          Default: null, 
          Extra: 'auto_increment' 
        },
        { 
          Field: 'name', 
          Type: 'varchar(255)', 
          Null: 'YES', 
          Key: '', 
          Default: null, 
          Extra: '' 
        }
      ], []]);
      
      // 执行测试
      const result = await connector.getColumns('test_db', 'users');
      
      // 验证
      expect(result).toEqual([
        { 
          name: 'id', 
          dataType: 'int(11)', 
          nullable: false, 
          defaultValue: null, 
          isPrimary: true, 
          extra: 'auto_increment' 
        },
        { 
          name: 'name', 
          dataType: 'varchar(255)', 
          nullable: true, 
          defaultValue: null, 
          isPrimary: false, 
          extra: '' 
        }
      ]);
      expect(mockPool.query).toHaveBeenCalledWith('SHOW FULL COLUMNS FROM `test_db`.`users`');
    });
  });
}); 