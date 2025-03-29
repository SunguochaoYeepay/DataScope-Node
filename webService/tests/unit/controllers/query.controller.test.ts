import { QueryController } from '../../../src/api/controllers/query.controller';
import { Request, Response, NextFunction } from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { QueryService } from '../../../src/services/query.service';
import { DataSourceService } from '../../../src/services/datasource.service';
import { PrismaClient } from '@prisma/client';
import { DatabaseConnector } from '../../../src/types/db-interface';

// Mock types
type MockResponse = Partial<Response> & {
  status: jest.Mock;
  json: jest.Mock;
};

type MockRequest = Partial<Request> & {
  user?: {
    id: string;
    email: string;
    role: string;
  };
};

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        query: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn()
        }
      };
    })
  };
});

// Mock QueryService
jest.mock('../../../src/services/query.service', () => {
  return {
    QueryService: jest.fn().mockImplementation(() => {
      return {
        explainQuery: jest.fn(),
        getQueryOptimizationTips: jest.fn(),
        getQueryHistory: jest.fn(),
        saveQuery: jest.fn(),
        getQueries: jest.fn(),
        getQueryById: jest.fn(),
        updateQuery: jest.fn(),
        deleteQuery: jest.fn(),
        cancelQuery: jest.fn()
      };
    })
  };
});

// Mock DataSourceService
jest.mock('../../../src/services/datasource.service', () => {
  return {
    DataSourceService: jest.fn().mockImplementation(() => {
      return {
        getDataSourceById: jest.fn(),
        getConnector: jest.fn()
      };
    })
  };
});

// 生成mock响应
const mockResponse = (): MockResponse => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res)
  } as MockResponse;
  return res;
};

// 创建模拟数据源
const createMockDataSource = (dbType = 'mysql') => {
  return {
    id: 'test-ds-id',
    name: 'Test DB',
    type: dbType,
    host: 'localhost',
    port: 3306,
    username: 'user',
    status: 'active',
    description: 'Test Database',
    nonce: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user-id',
    updatedBy: 'test-user-id',
    active: true,
    databaseName: 'test_db'
  };
};

// 创建模拟数据库连接器
const createMockConnector = (): Partial<DatabaseConnector> => {
  return {
    testConnection: jest.fn().mockResolvedValue(true),
    executeQuery: jest.fn().mockResolvedValue({
      columns: ['id', 'name'],
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1,
      executionTime: 10
    }),
    close: jest.fn().mockResolvedValue(undefined)
  };
};

describe('QueryController', () => {
  let queryController: QueryController;
  let mockQueryService: jest.Mocked<QueryService>;
  let mockDataSourceService: jest.Mocked<DataSourceService>;
  let mockPrismaClient: jest.Mocked<PrismaClient>;
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryService = new QueryService() as jest.Mocked<QueryService>;
    mockDataSourceService = new DataSourceService() as jest.Mocked<DataSourceService>;
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    
    queryController = new QueryController();
    
    mockReq = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }
    };
    mockRes = mockResponse();
    mockNext = jest.fn() as unknown as NextFunction;
  });
  
  describe('explainQuery', () => {
    it('should explain query successfully', async () => {
      // 准备测试数据
      const mockExplainResult = {
        query: 'SELECT * FROM users',
        planNodes: [
          { type: 'scan', table: 'users', rows: 100 }
        ]
      };
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      mockQueryService.explainQuery.mockResolvedValue(mockExplainResult);
      
      // 执行测试
      await queryController.explainQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.explainQuery).toHaveBeenCalledWith('test-ds-id', 'SELECT * FROM users');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockExplainResult
      });
    });
    
    it('should throw error if required parameters are missing', async () => {
      // 设置模拟 - 缺少 sql 参数
      mockReq.body = { dataSourceId: 'test-ds-id' };
      
      // 执行测试
      await queryController.explainQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });
  });
  
  describe('getQueryOptimizationTips', () => {
    it('should return query optimization tips', async () => {
      // 准备测试数据
      const mockTips = [
        { type: 'INDEX', description: '为users表的email列添加索引', impact: 'HIGH' }
      ];
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users WHERE email = "test@example.com"'
      };
      
      mockQueryService.getQueryOptimizationTips.mockResolvedValue(mockTips);
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryOptimizationTips).toHaveBeenCalledWith('test-ds-id', 'SELECT * FROM users WHERE email = "test@example.com"');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTips
      });
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('should return query history', async () => {
      // 准备测试数据
      const mockHistory = {
        history: [
          { id: 'query-1', sql: 'SELECT 1', createdAt: new Date() },
          { id: 'query-2', sql: 'SELECT 2', createdAt: new Date() }
        ],
        total: 2,
        limit: 20,
        offset: 0
      };
      
      // 设置模拟
      mockReq.query = {
        dataSourceId: 'test-ds-id',
        limit: '20',
        offset: '0'
      };
      
      mockQueryService.getQueryHistory.mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryController.getQueryHistory(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryHistory).toHaveBeenCalledWith(
        'test-ds-id',
        20,
        0
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistory
      });
    });
  });
  
  describe('cancelQuery', () => {
    it('should cancel query successfully', async () => {
      // 设置模拟
      mockReq.params = { queryId: 'query-123' };
      
      mockQueryService.cancelQuery.mockResolvedValue(true);
      
      // 执行测试
      await queryController.cancelQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.cancelQuery).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String)
      });
    });
    
    it('should throw error if query id is missing', async () => {
      // 设置模拟 - 不提供 queryId
      mockReq.params = {};
      
      // 执行测试
      await queryController.cancelQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });
  });
  
  describe('executeQuery', () => {
    it('should execute query successfully', async () => {
      // 准备测试数据
      const mockDataSource = createMockDataSource();
      const mockConnector = createMockConnector();
      const mockQueryResult = {
        columns: ['id', 'name'],
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
        executionTime: 10
      };
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector as unknown as DatabaseConnector);
      
      // 执行测试
      await queryController.executeQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.executeQuery).toHaveBeenCalledWith('SELECT * FROM users');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueryResult
      });
    });
    
    it('should throw error if data source not found', async () => {
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users'
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(null as any);
      
      // 执行测试
      await queryController.executeQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });
  });
  
  describe('saveQuery', () => {
    it('should save query successfully', async () => {
      // 准备测试数据
      const mockSavedQuery = {
        id: 'query-123',
        name: 'Test Query',
        sql: 'SELECT * FROM users',
        dataSourceId: 'test-ds-id',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        name: 'Test Query',
        sql: 'SELECT * FROM users'
      };
      mockReq.user = { id: 'test-user-id', email: 'test@example.com', role: 'user' };
      
      mockQueryService.saveQuery.mockResolvedValue(mockSavedQuery);
      
      // 执行测试
      await queryController.saveQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.saveQuery).toHaveBeenCalledWith({
        name: 'Test Query',
        sql: 'SELECT * FROM users',
        dataSourceId: 'test-ds-id',
        createdBy: 'test-user-id',
        description: undefined,
        folderId: undefined
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSavedQuery
      });
    });
  });
  
  describe('getQueries', () => {
    it('should return list of queries', async () => {
      // 准备测试数据
      const mockQueries = {
        queries: [
          { id: 'query-1', name: 'Query 1', sql: 'SELECT 1' },
          { id: 'query-2', name: 'Query 2', sql: 'SELECT 2' }
        ],
        total: 2
      };
      
      // 设置模拟
      mockReq.query = {
        dataSourceId: 'test-ds-id',
        limit: '20',
        offset: '0'
      };
      
      mockQueryService.getQueries.mockResolvedValue(mockQueries);
      
      // 执行测试
      await queryController.getQueries(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueries).toHaveBeenCalledWith({
        dataSourceId: 'test-ds-id',
        limit: 20,
        offset: 0,
        userId: 'test-user-id',
        search: undefined,
        folderId: undefined
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueries
      });
    });
  });
  
  describe('getQueryById', () => {
    it('should return query by id', async () => {
      // 准备测试数据
      const mockQuery = {
        id: 'query-123',
        name: 'Test Query',
        sql: 'SELECT * FROM users',
        dataSourceId: 'test-ds-id'
      };
      
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      
      mockQueryService.getQueryById.mockResolvedValue(mockQuery);
      
      // 执行测试
      await queryController.getQueryById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryById).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQuery
      });
    });
    
    it('should throw error if query not found', async () => {
      // 设置模拟
      mockReq.params = { id: 'non-existent-id' };
      
      mockQueryService.getQueryById.mockResolvedValue(null);
      
      // 执行测试
      await queryController.getQueryById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });
  });
  
  describe('updateQuery', () => {
    it('should update query successfully', async () => {
      // 准备测试数据
      const mockUpdatedQuery = {
        id: 'query-123',
        name: 'Updated Query',
        sql: 'SELECT * FROM users',
        dataSourceId: 'test-ds-id',
        updatedAt: new Date()
      };
      
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      mockReq.body = {
        name: 'Updated Query',
        description: 'Updated description'
      };
      mockReq.user = { id: 'test-user-id', email: 'test@example.com', role: 'user' };
      
      mockQueryService.updateQuery.mockResolvedValue(mockUpdatedQuery);
      
      // 执行测试
      await queryController.updateQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.updateQuery).toHaveBeenCalledWith(
        'query-123',
        {
          name: 'Updated Query',
          description: 'Updated description',
          updatedBy: 'test-user-id'
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedQuery
      });
    });
  });
  
  describe('deleteQuery', () => {
    it('should delete query successfully', async () => {
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      
      mockQueryService.deleteQuery.mockResolvedValue(true);
      
      // 执行测试
      await queryController.deleteQuery(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.deleteQuery).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String)
      });
    });
  });
}); 