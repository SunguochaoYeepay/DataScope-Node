import { MetadataController } from '../../../src/api/controllers/metadata.controller';
import { ApiError } from '../../../src/utils/error';
import { Request, Response, NextFunction } from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import metadataService from '../../../src/services/metadata.service';
import columnAnalyzer from '../../../src/services/metadata/column-analyzer';
import { DataSourceService } from '../../../src/services/datasource.service';
import { validationResult } from 'express-validator';

// 模拟metadataService
jest.mock('../../../src/services/metadata.service', () => {
  return {
    __esModule: true,
    default: {
      syncMetadata: jest.fn(),
      getMetadataStructure: jest.fn(),
      getSyncHistory: jest.fn()
    }
  };
});

// 模拟columnAnalyzer
jest.mock('../../../src/services/metadata/column-analyzer', () => {
  return {
    __esModule: true,
    default: {
      analyzeColumn: jest.fn()
    }
  };
});

// 模拟DataSourceService
jest.mock('../../../src/services/datasource.service', () => {
  const originalModule = jest.requireActual('../../../src/services/datasource.service');
  return {
    __esModule: true,
    DataSourceService: jest.fn().mockImplementation(() => {
      return {
        getDataSourceById: jest.fn(),
        getConnector: jest.fn()
      };
    })
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
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe('MetadataController', () => {
  let metadataController: MetadataController;
  let mockDataSourceService: jest.Mocked<DataSourceService>;
  let mockReq: Partial<Request>;
  let mockRes: Response;
  let mockNext: NextFunction;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSourceService = new DataSourceService() as jest.Mocked<DataSourceService>;
    metadataController = new MetadataController();
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
    
    // 设置validationResult默认返回无错误
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });
  
  describe('getMetadataStructure', () => {
    it('should return metadata structure from database', async () => {
      // 准备测试数据
      const mockStructure = {
        schemas: [
          {
            name: 'public',
            tables: [
              {
                name: 'users',
                columns: [
                  { name: 'id', type: 'int' },
                  { name: 'name', type: 'varchar' }
                ]
              }
            ]
          }
        ]
      };
      
      // 设置模拟
      mockReq.params = { dataSourceId: 'test-ds-id' };
      (metadataService.getMetadataStructure as jest.Mock).mockResolvedValue(mockStructure);
      
      // 执行测试
      await metadataController.getMetadataStructure(mockReq as Request, mockRes, mockNext);
      
      // 验证
      expect(metadataService.getMetadataStructure).toHaveBeenCalledWith('test-ds-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockStructure
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should call next with error if metadata service fails', async () => {
      // 设置模拟
      mockReq.params = { dataSourceId: 'test-ds-id' };
      const mockError = new Error('Service error');
      (metadataService.getMetadataStructure as jest.Mock).mockRejectedValue(mockError);
      
      // 执行测试
      await metadataController.getMetadataStructure(mockReq as Request, mockRes, mockNext);
      
      // 验证
      expect(metadataService.getMetadataStructure).toHaveBeenCalledWith('test-ds-id');
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  
  describe('previewTableData', () => {
    it('should return table data preview from database', async () => {
      // 准备测试数据
      const mockDataSource = {
        id: 'test-ds-id',
        name: 'Test DB',
        type: 'mysql'
      };
      
      const mockConnector = {
        previewTableData: jest.fn().mockResolvedValue({
          rows: [
            { id: 1, name: 'Test User 1' },
            { id: 2, name: 'Test User 2' }
          ],
          fields: [
            { name: 'id' },
            { name: 'name' }
          ],
          rowCount: 2
        })
      };
      
      // 设置模拟
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { schema: 'public', table: 'users', limit: '10' };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
      
      // 执行测试
      await metadataController.previewTableData(mockReq as Request, mockRes, mockNext);
      
      // 验证
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.previewTableData).toHaveBeenCalledWith('public', 'users', 10);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          rows: [
            { id: 1, name: 'Test User 1' },
            { id: 2, name: 'Test User 2' }
          ],
          columns: ['id', 'name'],
          total: 2,
          limit: 10,
          offset: 0
        }
      });
    });
    
    it('should throw error if required parameters are missing', async () => {
      // 设置模拟 - 缺少table参数
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { schema: 'public' };
      
      // 执行测试
      await metadataController.previewTableData(mockReq as Request, mockRes, mockNext);
      
      // 验证error被传递给next
      expect(mockNext).toHaveBeenCalled();
      const nextArg = (mockNext as jest.Mock).mock.calls[0][0];
      expect(nextArg).toBeInstanceOf(ApiError);
      expect(nextArg.statusCode).toBe(400);
      expect(nextArg.message).toBe('缺少必要参数');
    });
    
    it('should throw error if connector does not support previewTableData', async () => {
      // 准备测试数据
      const mockDataSource = {
        id: 'test-ds-id',
        name: 'Test DB',
        type: 'mysql'
      };
      
      const mockConnector = {
        // previewTableData方法不存在
      };
      
      // 设置模拟
      mockReq.params = { dataSourceId: 'test-ds-id' };
      mockReq.query = { schema: 'public', table: 'users', limit: '10' };
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
      
      // 执行测试
      await metadataController.previewTableData(mockReq as Request, mockRes, mockNext);
      
      // 验证error被传递给next
      expect(mockNext).toHaveBeenCalled();
      const nextArg = (mockNext as jest.Mock).mock.calls[0][0];
      expect(nextArg).toBeInstanceOf(ApiError);
      expect(nextArg.statusCode).toBe(400);
      expect(nextArg.message).toBe('数据源连接器不支持表数据预览功能');
    });
  });
  
  describe('getDatabaseStructure', () => {
    it('should return database structure from connector', async () => {
      // 准备测试数据
      const mockDataSource = {
        id: 'test-ds-id',
        name: 'Test DB',
        type: 'mysql'
      };
      
      const mockConnector = {
        getDatabaseStructure: jest.fn().mockResolvedValue({
          databases: ['test_db'],
          schemas: ['public'],
          tables: ['users', 'products']
        })
      };
      
      // 设置模拟
      const req = {
        params: { id: 'test-ds-id' },
        user: { id: 'user-id', email: 'test@example.com', role: 'admin' }
      } as any;
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(mockDataSource);
      mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
      
      // 执行测试
      await metadataController.getDatabaseStructure(req, mockRes);
      
      // 验证
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('test-ds-id');
      expect(mockDataSourceService.getConnector).toHaveBeenCalledWith('test-ds-id');
      expect(mockConnector.getDatabaseStructure).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          databases: ['test_db'],
          schemas: ['public'],
          tables: ['users', 'products']
        }
      });
    });
    
    it('should throw error if datasource id is missing', async () => {
      // 设置模拟
      const req = {
        params: {},
        user: { id: 'user-id', email: 'test@example.com', role: 'admin' }
      } as any;
      
      // 执行测试
      await metadataController.getDatabaseStructure(req, mockRes);
      
      // 验证
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少数据源ID'
      });
    });
    
    it('should throw error if datasource is not found', async () => {
      // 设置模拟
      const req = {
        params: { id: 'non-existent-id' },
        user: { id: 'user-id', email: 'test@example.com', role: 'admin' }
      } as any;
      
      mockDataSourceService.getDataSourceById.mockResolvedValue(null);
      
      // 执行测试
      await metadataController.getDatabaseStructure(req, mockRes);
      
      // 验证
      expect(mockDataSourceService.getDataSourceById).toHaveBeenCalledWith('non-existent-id');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '数据源不存在'
      });
    });
  });
});