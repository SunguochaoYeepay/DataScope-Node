import { MetadataService } from '../../../src/services/metadata.service';
import { DatasourceService } from '../../../src/services/datasource.service';
import { PrismaClient } from '@prisma/client';

// 模拟PrismaClient
const mockPrismaClient = {
  tableMetadata: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn()
  },
  columnMetadata: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn()
  },
  relationshipMetadata: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn()
  }
};

// 模拟datasourceService
const mockDataSourceService = {
  getConnector: jest.fn(),
  getDataSourceById: jest.fn()
};

// 模拟数据库连接器
const mockConnector = {
  getSchemas: jest.fn(),
  getTables: jest.fn(),
  getColumns: jest.fn(),
  executeQuery: jest.fn(),
  getPrimaryKeys: jest.fn(),
  getForeignKeys: jest.fn()
};

// 模拟PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 模拟datasourceService
jest.mock('../../../src/services/datasource.service', () => {
  return {
    DatasourceService: jest.fn().mockImplementation(() => mockDataSourceService)
  };
});

describe('MetadataService', () => {
  let metadataService: MetadataService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 设置默认返回值
    mockDataSourceService.getConnector.mockResolvedValue(mockConnector);
    mockDataSourceService.getDataSourceById.mockResolvedValue({ id: 'test-ds-id', name: 'Test DB', type: 'mysql' });
    
    metadataService = new MetadataService();
  });

  describe('基本功能测试', () => {
    it('应该能够实例化', () => {
      expect(metadataService).toBeDefined();
    });
  });
}); 