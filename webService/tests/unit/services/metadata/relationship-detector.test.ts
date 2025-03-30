import { RelationshipDetector } from '../../../../src/services/metadata/relationship-detector';
import { PrismaClient } from '@prisma/client';
import dataSourceService from '../../../../src/services/datasource.service';

// 模拟PrismaClient
const mockPrismaClient = {
  table: {
    findMany: jest.fn(),
    findFirst: jest.fn()
  },
  column: {
    findMany: jest.fn()
  },
  tableRelationship: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn()
  },
  columnRelationship: {
    create: jest.fn(),
    createMany: jest.fn()
  }
};

// 模拟prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// 模拟数据源服务
jest.mock('../../../../src/services/datasource.service', () => {
  return {
    __esModule: true,
    default: {
      getConnector: jest.fn(),
      getDataSourceById: jest.fn()
    }
  };
});

describe('RelationshipDetector', () => {
  let relationshipDetector: RelationshipDetector;

  beforeEach(() => {
    jest.clearAllMocks();
    relationshipDetector = new RelationshipDetector();
  });

  it('应该能够实例化', () => {
    expect(relationshipDetector).toBeDefined();
  });
  
  describe('detectRelationships', () => {
    it('应该检测数据库表之间的关系', async () => {
      // 模拟数据
      const mockTables = [
        { id: 'table-1', name: 'users', schemaId: 'schema-1' },
        { id: 'table-2', name: 'orders', schemaId: 'schema-1' }
      ];
      
      const mockColumns = [
        { id: 'column-1', name: 'id', tableId: 'table-1', isPrimaryKey: true },
        { id: 'column-2', name: 'name', tableId: 'table-1', isPrimaryKey: false },
        { id: 'column-3', name: 'id', tableId: 'table-2', isPrimaryKey: true },
        { id: 'column-4', name: 'user_id', tableId: 'table-2', isPrimaryKey: false }
      ];
      
      // 设置模拟返回值
      (mockPrismaClient.table.findMany as jest.Mock).mockResolvedValue(mockTables);
      (mockPrismaClient.column.findMany as jest.Mock).mockResolvedValue(mockColumns);
      (mockPrismaClient.tableRelationship.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.tableRelationship.createMany as jest.Mock).mockResolvedValue({ count: 1 });
      
      // 执行测试
      const result = await relationshipDetector.detectRelationships('datasource-1');
      
      // 验证
      expect(mockPrismaClient.table.findMany).toHaveBeenCalled();
      expect(mockPrismaClient.column.findMany).toHaveBeenCalled();
      expect(mockPrismaClient.tableRelationship.createMany).toHaveBeenCalled();
      expect(result).toBeGreaterThan(0);
    });
    
    it('应该处理没有表关系的情况', async () => {
      // 模拟数据 - 没有可能的关系
      const mockTables = [
        { id: 'table-1', name: 'users', schemaId: 'schema-1' },
        { id: 'table-2', name: 'products', schemaId: 'schema-1' }
      ];
      
      const mockColumns = [
        { id: 'column-1', name: 'id', tableId: 'table-1', isPrimaryKey: true },
        { id: 'column-2', name: 'name', tableId: 'table-1', isPrimaryKey: false },
        { id: 'column-3', name: 'id', tableId: 'table-2', isPrimaryKey: true },
        { id: 'column-4', name: 'price', tableId: 'table-2', isPrimaryKey: false }
      ];
      
      // 设置模拟返回值
      (mockPrismaClient.table.findMany as jest.Mock).mockResolvedValue(mockTables);
      (mockPrismaClient.column.findMany as jest.Mock).mockResolvedValue(mockColumns);
      (mockPrismaClient.tableRelationship.findMany as jest.Mock).mockResolvedValue([]);
      
      // 执行测试
      const result = await relationshipDetector.detectRelationships('datasource-1');
      
      // 验证
      expect(mockPrismaClient.table.findMany).toHaveBeenCalled();
      expect(mockPrismaClient.column.findMany).toHaveBeenCalled();
      expect(mockPrismaClient.tableRelationship.createMany).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
}); 