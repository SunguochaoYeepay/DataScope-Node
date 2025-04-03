import { PrismaClient } from '@prisma/client';
import { DataSourceService } from './datasource.service';
import logger from '../utils/logger';

// 使用环境变量中的数据库URL创建Prisma客户端
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://root:datascope@localhost:3306/datascope"
    }
  }
});
// 检查是否使用模拟数据
const useMockData = process.env.USE_MOCK_DATA === 'true';

/**
 * 数据源监控服务
 * 用于定期检查数据源连接状态，更新数据源状态
 */
export class DataSourceMonitorService {
  private dataSourceService: DataSourceService;
  private monitorInterval: NodeJS.Timeout | null = null;
  private monitorIntervalMinutes: number;

  /**
   * 创建数据源监控服务
   * @param dataSourceService 数据源服务实例
   * @param monitorIntervalMinutes 监控间隔，单位分钟
   */
  constructor(dataSourceService: DataSourceService, monitorIntervalMinutes: number = 60) {
    this.dataSourceService = dataSourceService;
    this.monitorIntervalMinutes = monitorIntervalMinutes;
  }

  /**
   * 启动监控服务
   */
  start(): void {
    if (this.monitorInterval) {
      this.stop();
    }
    
    logger.info(`数据源监控服务启动，检查间隔: ${this.monitorIntervalMinutes} 分钟`);
    
    // 延迟30秒后执行第一次检查，避免与应用启动时的其他操作冲突
    setTimeout(() => {
      this.checkAllDataSources();
      
      // 设置定时检查
      this.monitorInterval = setInterval(() => {
        this.checkAllDataSources();
      }, this.monitorIntervalMinutes * 60 * 1000);
    }, 30000);
  }

  /**
   * 停止监控服务
   */
  stop(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      logger.info('数据源监控服务已停止');
    }
  }

  /**
   * 检查所有活跃的数据源
   */
  async checkAllDataSources(): Promise<void> {
    try {
      logger.info('开始检查所有数据源连接状态...');
      
      // 如果使用模拟数据，则跳过真实数据库连接检查
      if (useMockData) {
        logger.info('使用模拟数据模式，跳过数据源连接检查');
        return;
      }
      
      // 获取所有活跃的数据源
      const dataSources = await prisma.dataSource.findMany({
        where: {
          active: true
        }
      });
      
      logger.info(`发现 ${dataSources.length} 个活跃数据源`);
      
      // 检查每个数据源
      for (const dataSource of dataSources) {
        await this.checkDataSourceStatus(dataSource.id);
      }
      
      logger.info('数据源状态检查完成');
    } catch (error) {
      logger.error('检查数据源状态时出错:', error);
    }
  }

  /**
   * 检查单个数据源状态
   * @param dataSourceId 数据源ID
   */
  async checkDataSourceStatus(dataSourceId: string): Promise<void> {
    try {
      // 如果使用模拟数据，则跳过真实数据库连接检查
      if (useMockData) {
        logger.info(`使用模拟数据模式，跳过数据源[${dataSourceId}]连接检查`);
        return;
      }
      
      // 获取数据源
      const dataSource = await prisma.dataSource.findUnique({
        where: { id: dataSourceId }
      });
      
      if (!dataSource) {
        logger.warn(`数据源不存在，ID: ${dataSourceId}`);
        return;
      }
      
      // 如果数据源处于同步中状态，跳过检查
      if (dataSource.status === 'SYNCING') {
        logger.info(`跳过正在同步的数据源: ${dataSource.name} [${dataSourceId}]`);
        return;
      }

      logger.info(`检查数据源状态: ${dataSource.name} [${dataSourceId}]`);
      
      // 测试连接
      try {
        const isConnected = await this.dataSourceService.testExistingConnection(dataSourceId);
        
        if (isConnected) {
          // 只有当当前状态不是ACTIVE时才更新
          if (dataSource.status !== 'ACTIVE') {
            logger.info(`更新数据源状态为ACTIVE: ${dataSource.name} [${dataSourceId}]`);
            await this.dataSourceService.updateDataSourceStatus(dataSourceId, 'ACTIVE');
          } else {
            logger.debug(`数据源状态已经是ACTIVE，无需更新: ${dataSource.name} [${dataSourceId}]`);
          }
        } else {
          // 连接测试失败但没有抛出异常，通常不会发生
          logger.warn(`数据源连接测试返回false: ${dataSource.name} [${dataSourceId}]`);
          await this.dataSourceService.updateDataSourceStatus(dataSourceId, 'ERROR', '连接测试失败');
        }
      } catch (error: any) {
        // 连接失败
        logger.error(`数据源连接失败: ${dataSource.name} [${dataSourceId}]`, error);
        await this.dataSourceService.updateDataSourceStatus(
          dataSourceId, 
          'ERROR', 
          `连接失败: ${error.message || '未知错误'}`
        );
      }
    } catch (error: any) {
      logger.error(`检查数据源状态时出错 ID: ${dataSourceId}`, error);
    }
  }
} 