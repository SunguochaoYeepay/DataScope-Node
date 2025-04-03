import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { ApiError } from '../utils/errors/types/api-error';
import logger from '../utils/logger';
import { createPaginatedResponse } from '../utils/api.utils';
import config from '../config';

const prisma = new PrismaClient();

/**
 * 系统服务类
 * 提供系统级别的功能，如日志查询、系统状态等
 */
class SystemService {
  /**
   * 获取系统日志
   * @param options 选项，包括分页参数、日志级别过滤等
   * @returns 标准化的分页日志响应
   */
  async getLogs(options: {
    page?: number;
    size?: number;
    offset?: number;
    limit?: number;
    level?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: any[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      // 处理分页参数
      const limit = options?.limit || options?.size || 50;
      const offset = options?.offset !== undefined ? options.offset : 
                  (options?.page ? (options.page - 1) * limit : 0);
      const page = options?.page || Math.floor(offset / limit) + 1;
      
      logger.debug('获取系统日志', { options });
      
      // 获取日志文件路径
      const logsDir = config.logging?.dir || 'logs';
      const logFile = path.join(process.cwd(), logsDir, 'app.log');
      
      // 检查日志文件是否存在
      if (!fs.existsSync(logFile)) {
        logger.warn(`日志文件不存在: ${logFile}`);
        return createPaginatedResponse([], 0, page, limit);
      }
      
      // 读取并解析日志
      const logs: any[] = [];
      const lineReader = readline.createInterface({
        input: fs.createReadStream(logFile),
        crlfDelay: Infinity
      });
      
      for await (const line of lineReader) {
        if (!line.trim()) continue;
        
        try {
          // 解析日志行
          // 格式示例: [2023-05-15T10:00:00.000Z] [INFO] 日志消息 {"附加数据":"值"}
          const match = line.match(/\[(.*?)\] \[(.*?)\] (.*)/);
          
          if (match) {
            const timestamp = match[1];
            const level = match[2];
            const rest = match[3];
            
            // 提取消息和数据部分
            let message = rest;
            let data = null;
            
            // 尝试提取JSON数据部分
            const jsonStart = rest.indexOf('{');
            if (jsonStart !== -1) {
              try {
                message = rest.substring(0, jsonStart).trim();
                data = JSON.parse(rest.substring(jsonStart));
              } catch (e) {
                // 解析JSON失败，保持原状
              }
            }
            
            // 创建日志条目
            const logEntry = {
              timestamp,
              level,
              message,
              data
            };
            
            // 应用过滤条件
            if (options.level && level.toLowerCase() !== options.level.toLowerCase()) {
              continue;
            }
            
            if (options.search && !message.toLowerCase().includes(options.search.toLowerCase())) {
              continue;
            }
            
            if (options.startDate) {
              const startDate = new Date(options.startDate);
              const logDate = new Date(timestamp);
              if (logDate < startDate) continue;
            }
            
            if (options.endDate) {
              const endDate = new Date(options.endDate);
              const logDate = new Date(timestamp);
              if (logDate > endDate) continue;
            }
            
            logs.push(logEntry);
          }
        } catch (error) {
          logger.error('解析日志行失败', { error, line });
        }
      }
      
      // 反转日志顺序（最新的在前面）
      logs.reverse();
      
      // 获取总日志数
      const total = logs.length;
      
      // 应用分页
      const paginatedLogs = logs.slice(offset, offset + limit);
      
      // 返回标准格式的分页响应
      return createPaginatedResponse(paginatedLogs, total, page, limit);
    } catch (error: any) {
      logger.error('获取系统日志失败', { error });
      throw new ApiError(`获取系统日志失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 获取系统健康状态
   * @returns 系统健康状态信息
   */
  async getHealthStatus(): Promise<any> {
    try {
      const os = require('os');
      
      // 收集系统指标
      const metrics = {
        timestamp: new Date().toISOString(),
        system: {
          platform: process.platform,
          arch: process.arch,
          version: process.version,
          uptime: this.formatUptime(os.uptime()),
        },
        memory: {
          total: this.bytesToGB(os.totalmem()),
          free: this.bytesToGB(os.freemem()),
          usage: (1 - os.freemem() / os.totalmem()) * 100,
        },
        cpu: {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          load: os.loadavg(),
        },
        process: {
          pid: process.pid,
          uptime: this.formatUptime(process.uptime()),
          memory: this.formatProcessMemory(process.memoryUsage()),
        },
        database: {
          status: 'unknown',
          error: ''
        }
      };
      
      // 检查数据库连接
      try {
        await prisma.$queryRaw`SELECT 1 as health`;
        metrics.database.status = 'connected';
      } catch (dbError) {
        metrics.database.status = 'disconnected';
        metrics.database.error = (dbError as Error).message;
      }
      
      return metrics;
    } catch (error: any) {
      logger.error('获取系统健康状态失败', { error });
      throw new ApiError(`获取系统健康状态失败: ${error.message}`, 500);
    }
  }
  
  /**
   * 格式化进程内存使用
   */
  private formatProcessMemory(memoryUsage: NodeJS.MemoryUsage): any {
    return {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    };
  }
  
  /**
   * 将字节转换为GB
   */
  private bytesToGB(bytes: number): string {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
  
  /**
   * 格式化运行时间
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }
}

export default new SystemService(); 