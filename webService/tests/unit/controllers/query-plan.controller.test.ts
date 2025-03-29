import { QueryPlanController } from '../../../src/api/controllers/query-plan.controller';
import { Request, Response, NextFunction } from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { DataSourceService } from '../../../src/services/datasource.service';
import { QueryService } from '../../../src/services/query.service';
import { QueryPlanService } from '../../../src/services/query-plan.service';
import { PrismaClient } from '@prisma/client';
import { DatabaseType } from '../../../src/types/database';
import * as databaseCore from '../../../src/database-core';
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
        queryPlan: {
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn()
        }
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

// Mock QueryService
jest.mock('../../../src/services/query.service', () => {
  return {
    QueryService: jest.fn().mockImplementation(() => {
      return {
        getQueryPlanHistory: jest.fn(),
        getQueryPlanById: jest.fn()
      };
    })
  };
});

// Mock QueryPlanService
jest.mock('../../../src/services/query-plan.service', () => {
  return {
    QueryPlanService: jest.fn().mockImplementation(() => {
      return {
        saveQueryPlan: jest.fn()
      };
    })
  };
});

// Mock database-core
jest.mock('../../../src/database-core', () => {
  return {
    getQueryPlanConverter: jest.fn().mockReturnValue({
      convertJsonExplain: jest.fn().mockReturnValue({
        query: 'SELECT * FROM test',
        planNodes: []
      })
    }),
    getQueryPlanAnalyzer: jest.fn().mockReturnValue({
      analyze: jest.fn().mockImplementation(plan => plan)
    }),
    getQueryOptimizer: jest.fn().mockReturnValue({
      analyzeSql: jest.fn().mockReturnValue([
        { type: 'INDEX', description: '添加索引', impact: 'HIGH' }
      ]),
      generateOptimizedSql: jest.fn().mockReturnValue('OPTIMIZED SQL')
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
const createMockConnector = (withGetQueryPlan = true): Partial<DatabaseConnector> => {
  const connector: Partial<DatabaseConnector> = {
    testConnection: jest.fn().mockResolvedValue(true),
    executeQuery: jest.fn().mockResolvedValue({ columns: [], rows: [], rowCount: 0, executionTime: 0 }),
    close: jest.fn().mockResolvedValue(undefined),
    explainQuery: jest.fn().mockResolvedValue({
      query: 'SELECT * FROM test',
      planNodes: []
    })
  };
  
  if (withGetQueryPlan) {
    connector.getQueryPlan = jest.fn().mockResolvedValue({
      query: 'SELECT * FROM test',
      planNodes: []
    });
    connector.isJsonExplainSupported = true;
  }
  
  return connector;
};

describe('QueryPlanController', () => {
  let queryPlanController: QueryPlanController;
  let mockDataSourceService: jest.Mocked<DataSourceService>;
  let mockQueryService: jest.Mocked<QueryService>;
  let mockPrismaClient: jest.Mocked<PrismaClient>;
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSourceService = new DataSourceService() as jest.Mocked<DataSourceService>;
    mockQueryService = new QueryService() as jest.Mocked<QueryService>;
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    
    queryPlanController = new QueryPlanController();
    
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
  
  describe('getQueryPlan', () => {
    it('should get and return query plan successfully', async () => {
      // 准备测试数据
      const mockDataSource = createMockDataSource();
      const mockConnector = createMockConnector(true);
      const mockSavedPlan = { id: 'plan-123' };
      
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector as unknown as DatabaseConnector);
      (queryPlanController as any).saveQueryPlan = jest.fn().mockResolvedValue(mockSavedPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.getQueryPlan).toHaveBeenCalledWith('SELECT * FROM test');
      expect(databaseCore.getQueryPlanConverter).toHaveBeenCalledWith('mysql');
      expect(databaseCore.getQueryPlanAnalyzer).toHaveBeenCalledWith('mysql');
      expect((queryPlanController as any).saveQueryPlan).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          plan: {
            query: 'SELECT * FROM test',
            planNodes: []
          },
          id: 'plan-123'
        }
      });
    });
    
    it('should use fallback explainQuery if getQueryPlan is not available', async () => {
      // 准备测试数据
      const mockDataSource = createMockDataSource();
      const mockConnector = createMockConnector(false);
      const mockSavedPlan = { id: 'plan-123' };
      
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector as unknown as DatabaseConnector);
      (queryPlanController as any).saveQueryPlan = jest.fn().mockResolvedValue(mockSavedPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockConnector.explainQuery).toHaveBeenCalledWith('SELECT * FROM test');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should throw error if required parameters are missing', async () => {
      // 设置模拟 - 缺少 sql 参数
      mockReq.body = { dataSourceId: 'test-ds-id' };
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少必要参数'
      });
    });
    
    it('should throw error if data source not found', async () => {
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(null as any);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '数据源不存在'
      });
    });
    
    it('should throw error if connector does not support query plan features', async () => {
      // 准备测试数据
      const mockDataSource = createMockDataSource();
      const mockConnector = {} as unknown as DatabaseConnector;
      
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '数据库连接器不支持查询计划功能'
      });
    });
  });
  
  describe('getOptimizationTips', () => {
    it('should return optimization tips for a query plan', async () => {
      // 准备测试数据
      const planId = 'plan-123';
      const mockQueryPlan = {
        id: 'plan-123',
        dataSourceId: 'test-ds-id',
        planData: JSON.stringify({
          query: 'SELECT * FROM test',
          planNodes: []
        }),
        sql: 'SELECT * FROM test',
        query: { id: 'query-123' }
      };
      
      const mockDataSource = createMockDataSource();
      
      // 设置模拟
      mockReq.params = { planId };
      
      mockPrismaClient.queryPlan.findUnique.mockResolvedValue(mockQueryPlan as any);
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledWith({
        where: { id: planId },
        include: { query: true }
      });
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(databaseCore.getQueryOptimizer).toHaveBeenCalledWith('mysql');
      expect(mockPrismaClient.queryPlan.update).toHaveBeenCalledWith({
        where: { id: planId },
        data: { optimizationTips: expect.any(String) }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          suggestions: [
            { type: 'INDEX', description: '添加索引', impact: 'HIGH' }
          ],
          optimizedSql: 'OPTIMIZED SQL'
        }
      });
    });
    
    it('should throw error if plan id is missing', async () => {
      // 设置模拟 - 不提供 planId
      mockReq.params = {};
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少查询计划ID'
      });
    });
    
    it('should throw error if query plan not found', async () => {
      // 设置模拟
      mockReq.params = { planId: 'non-existent-id' };
      
      mockPrismaClient.queryPlan.findUnique.mockResolvedValue(null);
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '查询计划不存在'
      });
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('should return query plan history', async () => {
      // 准备测试数据
      const mockHistory = {
        history: [
          { id: 'plan-1', sql: 'SELECT 1', createdAt: new Date() },
          { id: 'plan-2', sql: 'SELECT 2', createdAt: new Date() }
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
      
      mockQueryService.getQueryPlanHistory.mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryPlanController.getQueryPlanHistory(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryPlanHistory).toHaveBeenCalledWith(
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
  
  describe('getQueryPlanById', () => {
    it('should return specific query plan by id', async () => {
      // 准备测试数据
      const planId = 'plan-123';
      const mockPlan = {
        id: planId,
        sql: 'SELECT * FROM test',
        dataSourceId: 'test-ds-id',
        createdAt: new Date(),
        planData: JSON.stringify({
          query: 'SELECT * FROM test',
          planNodes: []
        })
      };
      
      // 设置模拟
      mockReq.params = { planId };
      
      mockQueryService.getQueryPlanById.mockResolvedValue(mockPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryPlanById).toHaveBeenCalledWith(planId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: planId,
          sql: 'SELECT * FROM test',
          dataSourceId: 'test-ds-id',
          createdAt: expect.any(Date),
          plan: {
            query: 'SELECT * FROM test',
            planNodes: []
          }
        }
      });
    });
    
    it('should throw error if plan id is missing', async () => {
      // 设置模拟 - 不提供 planId
      mockReq.params = {};
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少查询计划ID'
      });
    });
    
    it('should throw error if query plan not found', async () => {
      // 设置模拟
      mockReq.params = { planId: 'non-existent-id' };
      
      mockQueryService.getQueryPlanById.mockResolvedValue(null);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '查询计划不存在'
      });
    });
  });
  
  describe('comparePlans', () => {
    it('should compare two query plans', async () => {
      // 准备测试数据
      const mockPlanA = {
        id: 'plan-1',
        dataSourceId: 'test-ds-id',
        planData: JSON.stringify({
          estimatedCost: 100,
          estimatedRows: 1000,
          warnings: ['warning1', 'warning2'],
          planNodes: [
            { type: 'ALL', table: 'users', rows: 1000 }
          ]
        })
      };
      
      const mockPlanB = {
        id: 'plan-2',
        dataSourceId: 'test-ds-id',
        planData: JSON.stringify({
          estimatedCost: 50,
          estimatedRows: 500,
          warnings: ['warning1'],
          planNodes: [
            { type: 'range', table: 'users', rows: 500 }
          ]
        })
      };
      
      const mockDataSource = createMockDataSource();
      
      // 设置模拟
      mockReq.body = {
        planAId: 'plan-1',
        planBId: 'plan-2'
      };
      
      mockPrismaClient.queryPlan.findUnique
        .mockResolvedValueOnce(mockPlanA as any)
        .mockResolvedValueOnce(mockPlanB as any);
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 'plan-1' }
      });
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledWith({
        where: { id: 'plan-2' }
      });
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          costDifference: -50,
          costImprovement: expect.any(Number),
          planAWarnings: 2,
          planBWarnings: 1,
          planANodes: 1,
          planBNodes: 1
        })
      });
    });
    
    it('should throw error if required parameters are missing', async () => {
      // 设置模拟 - 只提供一个计划ID
      mockReq.body = { planAId: 'plan-1' };
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少必要参数'
      });
    });
    
    it('should throw error if one or both plans not found', async () => {
      // 设置模拟
      mockReq.body = {
        planAId: 'plan-1',
        planBId: 'non-existent'
      };
      
      mockPrismaClient.queryPlan.findUnique
        .mockResolvedValueOnce({} as any)
        .mockResolvedValueOnce(null);
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '一个或多个查询计划不存在'
      });
    });
  });
}); 