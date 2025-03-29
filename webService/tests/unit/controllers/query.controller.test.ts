import { QueryController } from '../../../src/api/controllers/query.controller';
import { Request, Response, NextFunction } from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { createMockSavedQuery, createMockQueryHistory, createMockOptimizationTips } from '../../mocks/database-mock';
import { ApiError } from '../../../src/utils/error';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockImplementation(() => ({
    isEmpty: jest.fn().mockReturnValue(true),
    array: jest.fn().mockReturnValue([])
  })),
  body: jest.fn(),
  param: jest.fn()
}));

// Mock QueryService
jest.mock('../../../src/services/query.service', () => {
  const mockService = {
    explainQuery: jest.fn(),
    getQueryOptimizationTips: jest.fn(),
    getQueryHistory: jest.fn(),
    getQueryPlanById: jest.fn(),
    saveQuery: jest.fn(),
    getQueries: jest.fn(),
    getQueryById: jest.fn(),
    updateQuery: jest.fn(),
    deleteQuery: jest.fn(),
    cancelQuery: jest.fn(),
    executeQuery: jest.fn(),
    getQueryPlanHistory: jest.fn()
  };
  return mockService;
});

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

// 生成mock响应
const mockResponse = (): MockResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  } as MockResponse;
  return res;
};

// 导入模拟的queryService
import queryService from '../../../src/services/query.service';

describe('QueryController', () => {
  let queryController: QueryController;
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
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
      
      (queryService.explainQuery as jest.Mock).mockResolvedValue(mockExplainResult);
      
      // 执行测试
      await queryController.explainQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.explainQuery).toHaveBeenCalledWith('test-ds-id', 'SELECT * FROM users', undefined);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockExplainResult
      });
    });
    
    it('should throw error if required parameters are missing', async () => {
      // 设置模拟 - 缺少 sql 参数
      mockReq.body = { dataSourceId: 'test-ds-id' };
      
      // 修改模拟验证结果为失败
      const validationResult = require('express-validator').validationResult;
      validationResult.mockImplementationOnce(() => ({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'SQL is required', param: 'sql' }])
      }));
      
      // 模拟 next 函数处理 ApiError
      mockNext.mockImplementation((error) => {
        // 确保传给mockNext的是ApiError类型错误
        if (error instanceof Error) {
          mockRes.status(400).json({
            success: false,
            message: error.message,
            errors: (error as any).details?.errors || []
          });
        }
      });
      
      // 执行测试
      await queryController.explainQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
        errors: expect.any(Array)
      });
    });
  });
  
  describe('getQueryOptimizationTips', () => {
    it('should return query optimization tips', async () => {
      // 准备测试数据
      const mockTips = createMockOptimizationTips();
      const mockPlan = {
        sql: 'SELECT * FROM users WHERE email = "test@example.com"',
        planData: JSON.stringify({
          optimizationTips: mockTips,
          performanceAnalysis: { score: 75 }
        })
      };
      
      // 设置模拟
      mockReq.params = { id: 'plan-123' };
      (queryService.getQueryPlanById as jest.Mock).mockResolvedValue(mockPlan);
      
      // 执行测试
      await queryController.getQueryOptimizationTips(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.getQueryPlanById).toHaveBeenCalledWith('plan-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          sql: mockPlan.sql,
          optimizationTips: expect.any(Array)
        })
      });
    });
  });
  
  describe('getQueryHistory', () => {
    it('should return query history', async () => {
      // 准备测试数据
      const mockHistory = {
        history: createMockQueryHistory(),
        total: 2,
        limit: 50,
        offset: 0
      };
      
      // 设置模拟
      mockReq.query = { 
        dataSourceId: 'test-ds-id',
        limit: '50',
        offset: '0'
      };
      
      (queryService.getQueryHistory as jest.Mock).mockResolvedValue(mockHistory);
      
      // 执行测试
      await queryController.getQueryHistory(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.getQueryHistory).toHaveBeenCalledWith('test-ds-id', 50, 0);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistory
      });
    });
  });
  
  describe('cancelQuery', () => {
    it('should cancel query execution successfully', async () => {
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      (queryService.cancelQuery as jest.Mock).mockResolvedValue(true);
      
      // 执行测试
      await queryController.cancelQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.cancelQuery).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String)
      });
    });
    
    it('should handle query that cannot be cancelled', async () => {
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      (queryService.cancelQuery as jest.Mock).mockResolvedValue(false);
      
      // 执行测试
      await queryController.cancelQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('无法取消')
      });
    });
  });
  
  describe('executeQuery', () => {
    it('should execute SQL query successfully', async () => {
      // 准备测试数据
      const mockQueryResult = {
        columns: ['id', 'name'],
        rows: [{ id: 1, name: 'User 1' }],
        rowCount: 1,
        executionTime: 15
      };
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        sql: 'SELECT * FROM users',
        params: [],
        page: 1,
        pageSize: 10
      };
      
      (queryService.executeQuery as jest.Mock).mockResolvedValue(mockQueryResult);
      
      // 执行测试
      await queryController.executeQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.executeQuery).toHaveBeenCalledWith(
        'test-ds-id', 
        'SELECT * FROM users', 
        [],
        {
          page: 1,
          pageSize: 10,
          offset: undefined,
          limit: undefined,
          sort: undefined,
          order: undefined
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueryResult
      });
    });
  });
  
  describe('saveQuery', () => {
    it('should save a query successfully', async () => {
      // 准备测试数据
      const savedQuery = createMockSavedQuery();
      
      // 设置模拟
      mockReq.body = {
        dataSourceId: 'test-ds-id',
        name: 'Test Query',
        description: 'Test query description',
        sql: 'SELECT * FROM users',
        isPublic: false,
        tags: ['users', 'test']
      };
      
      (queryService.saveQuery as jest.Mock).mockResolvedValue(savedQuery);
      
      // 执行测试
      await queryController.saveQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.saveQuery).toHaveBeenCalledWith({
        dataSourceId: 'test-ds-id',
        name: 'Test Query',
        description: 'Test query description',
        sql: 'SELECT * FROM users',
        isPublic: false,
        tags: ['users', 'test']
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: savedQuery
      });
    });
  });
  
  describe('getQueries', () => {
    it('should retrieve saved queries with filters', async () => {
      // 准备测试数据
      const mockQueries = [createMockSavedQuery()];
      
      // 设置模拟
      mockReq.query = {
        dataSourceId: 'test-ds-id',
        tag: 'users',
        isPublic: 'true',
        search: 'test'
      };
      
      (queryService.getQueries as jest.Mock).mockResolvedValue(mockQueries);
      
      // 执行测试
      await queryController.getQueries(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.getQueries).toHaveBeenCalledWith({
        dataSourceId: 'test-ds-id',
        tag: 'users',
        isPublic: true,
        search: 'test'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueries
      });
    });
  });
  
  describe('getQueryById', () => {
    it('should retrieve a specific query by ID', async () => {
      // 准备测试数据
      const mockQuery = createMockSavedQuery();
      
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      (queryService.getQueryById as jest.Mock).mockResolvedValue(mockQuery);
      
      // 执行测试
      await queryController.getQueryById(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.getQueryById).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockQuery
      });
    });
  });
  
  describe('updateQuery', () => {
    it('should update a query successfully', async () => {
      // 准备测试数据
      const mockUpdatedQuery = {
        ...createMockSavedQuery(),
        name: 'Updated Query Name',
        description: 'Updated description'
      };
      
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      mockReq.body = {
        name: 'Updated Query Name',
        description: 'Updated description'
      };
      
      (queryService.updateQuery as jest.Mock).mockResolvedValue(mockUpdatedQuery);
      
      // 执行测试
      await queryController.updateQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.updateQuery).toHaveBeenCalledWith('query-123', {
        name: 'Updated Query Name',
        description: 'Updated description'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedQuery
      });
    });
  });
  
  describe('deleteQuery', () => {
    it('should delete a query successfully', async () => {
      // 设置模拟
      mockReq.params = { id: 'query-123' };
      (queryService.deleteQuery as jest.Mock).mockResolvedValue(undefined);
      
      // 执行测试
      await queryController.deleteQuery(mockReq as Request, mockRes as Response, mockNext);
      
      // 验证
      expect(queryService.deleteQuery).toHaveBeenCalledWith('query-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String)
      });
    });
  });
}); 