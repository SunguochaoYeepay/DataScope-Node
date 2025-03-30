import { ColumnAnalyzer } from '../../../../src/services/metadata/column-analyzer';
import { PrismaClient } from '@prisma/client';
import dataSourceService from '../../../../src/services/datasource.service';

// 模拟PrismaClient
const mockPrismaClient = {
  column: {
    findMany: jest.fn(),
    update: jest.fn()
  },
  columnStatistics: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
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

describe('ColumnAnalyzer', () => {
  let columnAnalyzer: ColumnAnalyzer;

  beforeEach(() => {
    jest.clearAllMocks();
    columnAnalyzer = new ColumnAnalyzer();
  });

  it('应该能够实例化', () => {
    expect(columnAnalyzer).toBeDefined();
  });
  
  describe('analyzeColumn', () => {
    it('应该分析数值类型列', async () => {
      // 模拟连接器
      const mockConnector = {
        executeQuery: jest.fn().mockResolvedValue({
          rows: [
            { min: 1, max: 100, avg: 50.5, stddev: 25.2 }
          ]
        })
      };
      
      // 模拟数据列
      const mockColumn = {
        id: 'column-1',
        name: 'age',
        dataType: 'INTEGER',
        tableId: 'table-1'
      };
      
      // 设置模拟返回值
      (dataSourceService.getConnector as jest.Mock).mockResolvedValue(mockConnector);
      (mockPrismaClient.columnStatistics.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.columnStatistics.create as jest.Mock).mockResolvedValue({
        id: 'stats-1',
        columnId: 'column-1',
        minValue: '1',
        maxValue: '100',
        avgValue: '50.5',
        stdDeviation: '25.2'
      });
      
      // 执行测试
      const result = await columnAnalyzer.analyzeColumn('datasource-1', 'schema-1', 'users', mockColumn);
      
      // 验证
      expect(dataSourceService.getConnector).toHaveBeenCalledWith('datasource-1');
      expect(mockConnector.executeQuery).toHaveBeenCalled();
      expect(mockPrismaClient.columnStatistics.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        minValue: '1',
        maxValue: '100'
      }));
    });
    
    it('应该分析字符串类型列', async () => {
      // 模拟连接器
      const mockConnector = {
        executeQuery: jest.fn().mockResolvedValue({
          rows: [
            { 
              distinct_count: 5,
              null_count: 2,
              min_length: 3,
              max_length: 10,
              avg_length: 6.8
            }
          ]
        })
      };
      
      // 模拟数据列
      const mockColumn = {
        id: 'column-1',
        name: 'name',
        dataType: 'VARCHAR',
        tableId: 'table-1'
      };
      
      // 设置模拟返回值
      (dataSourceService.getConnector as jest.Mock).mockResolvedValue(mockConnector);
      (mockPrismaClient.columnStatistics.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.columnStatistics.create as jest.Mock).mockResolvedValue({
        id: 'stats-1',
        columnId: 'column-1',
        distinctCount: 5,
        nullCount: 2,
        minLength: 3,
        maxLength: 10,
        avgLength: 6.8
      });
      
      // 执行测试
      const result = await columnAnalyzer.analyzeColumn('datasource-1', 'schema-1', 'users', mockColumn);
      
      // 验证
      expect(dataSourceService.getConnector).toHaveBeenCalledWith('datasource-1');
      expect(mockConnector.executeQuery).toHaveBeenCalled();
      expect(mockPrismaClient.columnStatistics.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        distinctCount: 5,
        nullCount: 2
      }));
    });
    
    it('应当处理更新已存在的统计信息', async () => {
      // 模拟连接器
      const mockConnector = {
        executeQuery: jest.fn().mockResolvedValue({
          rows: [
            { min: 1, max: 100, avg: 50.5, stddev: 25.2 }
          ]
        })
      };
      
      // 模拟数据列
      const mockColumn = {
        id: 'column-1',
        name: 'age',
        dataType: 'INTEGER',
        tableId: 'table-1'
      };
      
      // 模拟已存在的统计信息
      const existingStats = {
        id: 'stats-1',
        columnId: 'column-1',
        minValue: '0',
        maxValue: '50',
        avgValue: '25.0',
        stdDeviation: '12.5'
      };
      
      // 设置模拟返回值
      (dataSourceService.getConnector as jest.Mock).mockResolvedValue(mockConnector);
      (mockPrismaClient.columnStatistics.findFirst as jest.Mock).mockResolvedValue(existingStats);
      (mockPrismaClient.columnStatistics.update as jest.Mock).mockResolvedValue({
        ...existingStats,
        minValue: '1',
        maxValue: '100',
        avgValue: '50.5',
        stdDeviation: '25.2'
      });
      
      // 执行测试
      const result = await columnAnalyzer.analyzeColumn('datasource-1', 'schema-1', 'users', mockColumn);
      
      // 验证
      expect(dataSourceService.getConnector).toHaveBeenCalledWith('datasource-1');
      expect(mockConnector.executeQuery).toHaveBeenCalled();
      expect(mockPrismaClient.columnStatistics.update).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        minValue: '1',
        maxValue: '100'
      }));
    });
  });
}); 