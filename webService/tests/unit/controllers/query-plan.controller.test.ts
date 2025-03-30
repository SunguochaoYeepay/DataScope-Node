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
import { createMockDatabaseConnector, createMockDataSource, createMockQueryPlan, createMockOptimizationTips } from '../../mocks/database-mock';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockImplementation(() => ({
    isEmpty: jest.fn().mockReturnValue(true),
    array: jest.fn().mockReturnValue([])
  }))
}));

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
      const mockConnector = createMockDatabaseConnector();
      const mockSavedPlan = { id: 'plan-123' };
      
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
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
      const mockConnector = createMockDatabaseConnector();
      // 移除getQueryPlan方法以测试fallback
      mockConnector.getQueryPlan = undefined;
      const mockSavedPlan = { id: 'plan-123' };
      
      // 设置模拟
      mockReq.body = { 
        dataSourceId: 'test-ds-id', 
        sql: 'SELECT * FROM test' 
      };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
      (queryPlanController as any).saveQueryPlan = jest.fn().mockResolvedValue(mockSavedPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockConnector.explainQuery).toHaveBeenCalledWith('SELECT * FROM test');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          plan: {
            query: 'SELECT * FROM users',
            planNodes: [{ type: 'scan', table: 'users', rows: 100 }]
          },
          id: 'plan-123'
        }
      });
    });
    
    it('should handle errors and return proper error response', async () => {
      // 设置模拟请求缺少必要参数
      mockReq.body = { dataSourceId: 'test-ds-id' };
      
      // 执行测试
      await queryPlanController.getQueryPlan(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });
  
  describe('getOptimizationTips', () => {
    it('should return optimization tips for a query plan', async () => {
      // 准备测试数据
      const mockPlan = createMockQueryPlan();
      const mockDataSource = createMockDataSource();
      
      // 设置模拟
      mockReq.params = { planId: 'plan-123' };
      
      const mockPrismaQueryPlan = {
        ...mockPlan,
        query: { id: 'query-1' }
      };
      
      (mockPrismaClient.queryPlan.findUnique as jest.Mock).mockResolvedValue(mockPrismaQueryPlan);
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource as any);
      
      // 执行测试
      await queryPlanController.getOptimizationTips(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'plan-123' }
      }));
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith(mockPlan.dataSourceId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          suggestions: expect.any(Array),
          optimizedSql: expect.any(String)
        })
      }));
    });
  });
  
  describe('getQueryPlanHistory', () => {
    it('should return query plan history for a datasource', async () => {
      // 准备测试数据
      const mockHistory = {
        history: [createMockQueryPlan()],
        total: 1,
        limit: 20,
        offset: 0
      };
      
      // 设置模拟
      mockReq.query = { dataSourceId: 'test-ds-id', limit: '20', offset: '0' };
      mockQueryService.getQueryPlanHistory.mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryPlanController.getQueryPlanHistory(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryPlanHistory).toHaveBeenCalledWith('test-ds-id', 20, 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistory
      });
    });
  });
  
  describe('getQueryPlanById', () => {
    it('should return a specific query plan by ID', async () => {
      // 准备测试数据
      const mockPlan = createMockQueryPlan();
      
      // 设置模拟
      mockReq.params = { planId: 'plan-123' };
      mockQueryService.getQueryPlanById.mockResolvedValue(mockPlan);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockQueryService.getQueryPlanById).toHaveBeenCalledWith('plan-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: mockPlan.id,
          sql: mockPlan.sql,
          dataSourceId: mockPlan.dataSourceId
        })
      });
    });
    
    it('should handle not found error for non-existent plan', async () => {
      // 设置模拟
      mockReq.params = { planId: 'non-existent-plan' };
      mockQueryService.getQueryPlanById.mockResolvedValue(null);
      
      // 执行测试
      await queryPlanController.getQueryPlanById(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('不存在')
      }));
    });
  });
  
  describe('comparePlans', () => {
    it('should compare two query plans and return comparison results', async () => {
      // 准备测试数据
      const mockPlanA = createMockQueryPlan();
      const mockPlanB = {
        ...createMockQueryPlan(),
        id: 'plan-456',
        planData: JSON.stringify({
          query: 'SELECT * FROM users',
          planNodes: [{ type: 'index_scan', table: 'users', rows: 50 }],
          estimatedCost: 50,
          estimatedRows: 50
        })
      };
      
      // 设置模拟
      mockReq.body = { planAId: 'plan-123', planBId: 'plan-456' };
      
      (mockPrismaClient.queryPlan.findUnique as jest.Mock)
        .mockImplementation((params) => {
          if (params.where.id === 'plan-123') return mockPlanA;
          if (params.where.id === 'plan-456') return mockPlanB;
          return null;
        });
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(createMockDataSource() as any);
      
      // 执行测试
      await queryPlanController.comparePlans(mockReq as Request, mockRes as unknown as Response);
      
      // 验证
      expect(mockPrismaClient.queryPlan.findUnique).toHaveBeenCalledTimes(2);
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith(mockPlanA.dataSourceId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          costDifference: expect.any(Number),
          costImprovement: expect.any(Number)
        })
      }));
    });
  });
}); 