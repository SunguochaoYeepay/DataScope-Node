import os from 'os';
import logger from './logger';

/**
 * 系统健康监控类
 * 用于定期收集并记录系统性能指标
 */
export class HealthMonitor {
  private interval: NodeJS.Timeout | null = null;
  private checkIntervalMs: number;
  
  /**
   * 创建健康监控实例
   * @param checkIntervalMinutes 检查间隔，单位为分钟，默认为30分钟
   */
  constructor(checkIntervalMinutes: number = 30) {
    this.checkIntervalMs = checkIntervalMinutes * 60 * 1000;
  }
  
  /**
   * 启动健康监控
   */
  start(): void {
    if (this.interval) {
      this.stop();
    }
    
    // 立即执行一次
    this.collectAndLogMetrics();
    
    // 设置定时任务
    this.interval = setInterval(() => {
      this.collectAndLogMetrics();
    }, this.checkIntervalMs);
    
    logger.info(`健康监控已启动，检查间隔: ${this.checkIntervalMs / 60000} 分钟`);
  }
  
  /**
   * 停止健康监控
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      logger.info('健康监控已停止');
    }
  }
  
  /**
   * 收集并记录系统指标
   * @private
   */
  private collectAndLogMetrics(): void {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        memory: {
          total: this.bytesToGB(os.totalmem()),
          free: this.bytesToGB(os.freemem()),
          usage: this.getMemoryUsagePercentage(),
        },
        cpu: {
          load: os.loadavg(),
          count: os.cpus().length,
        },
        process: {
          uptime: this.formatUptime(process.uptime()),
          memory: this.formatProcessMemory(process.memoryUsage()),
        }
      };
      
      logger.info(`系统健康状态: ${JSON.stringify(metrics)}`);
    } catch (error) {
      logger.error('收集系统指标时出错:', error);
    }
  }
  
  /**
   * 将字节转换为GB
   * @param bytes 字节数
   * @private
   */
  private bytesToGB(bytes: number): string {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  
  /**
   * 计算内存使用百分比
   * @private
   */
  private getMemoryUsagePercentage(): string {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const percentage = (usedMem / totalMem) * 100;
    return `${percentage.toFixed(2)}%`;
  }
  
  /**
   * 格式化进程运行时间
   * @param seconds 秒数
   * @private
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let result = '';
    if (days > 0) result += `${days}天 `;
    if (hours > 0 || days > 0) result += `${hours}小时 `;
    result += `${minutes}分钟`;
    
    return result;
  }
  
  /**
   * 格式化进程内存使用
   * @param memoryUsage 内存使用对象
   * @private
   */
  private formatProcessMemory(memoryUsage: NodeJS.MemoryUsage): any {
    return {
      rss: `${(memoryUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
      external: `${(memoryUsage.external / (1024 * 1024)).toFixed(2)} MB`,
    };
  }
}

// 导出单例实例
export const healthMonitor = new HealthMonitor();

export default healthMonitor; 