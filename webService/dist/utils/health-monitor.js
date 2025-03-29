"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthMonitor = exports.HealthMonitor = void 0;
const os_1 = __importDefault(require("os"));
const logger_1 = __importDefault(require("./logger"));
/**
 * 系统健康监控类
 * 用于定期收集并记录系统性能指标
 */
class HealthMonitor {
    /**
     * 创建健康监控实例
     * @param checkIntervalMinutes 检查间隔，单位为分钟，默认为30分钟
     */
    constructor(checkIntervalMinutes = 30) {
        this.interval = null;
        this.checkIntervalMs = checkIntervalMinutes * 60 * 1000;
    }
    /**
     * 启动健康监控
     */
    start() {
        if (this.interval) {
            this.stop();
        }
        // 立即执行一次
        this.collectAndLogMetrics();
        // 设置定时任务
        this.interval = setInterval(() => {
            this.collectAndLogMetrics();
        }, this.checkIntervalMs);
        logger_1.default.info(`健康监控已启动，检查间隔: ${this.checkIntervalMs / 60000} 分钟`);
    }
    /**
     * 停止健康监控
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            logger_1.default.info('健康监控已停止');
        }
    }
    /**
     * 收集并记录系统指标
     * @private
     */
    collectAndLogMetrics() {
        try {
            const metrics = {
                timestamp: new Date().toISOString(),
                memory: {
                    total: this.bytesToGB(os_1.default.totalmem()),
                    free: this.bytesToGB(os_1.default.freemem()),
                    usage: this.getMemoryUsagePercentage(),
                },
                cpu: {
                    load: os_1.default.loadavg(),
                    count: os_1.default.cpus().length,
                },
                process: {
                    uptime: this.formatUptime(process.uptime()),
                    memory: this.formatProcessMemory(process.memoryUsage()),
                }
            };
            logger_1.default.info(`系统健康状态: ${JSON.stringify(metrics)}`);
        }
        catch (error) {
            logger_1.default.error('收集系统指标时出错:', error);
        }
    }
    /**
     * 将字节转换为GB
     * @param bytes 字节数
     * @private
     */
    bytesToGB(bytes) {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    /**
     * 计算内存使用百分比
     * @private
     */
    getMemoryUsagePercentage() {
        const totalMem = os_1.default.totalmem();
        const freeMem = os_1.default.freemem();
        const usedMem = totalMem - freeMem;
        const percentage = (usedMem / totalMem) * 100;
        return `${percentage.toFixed(2)}%`;
    }
    /**
     * 格式化进程运行时间
     * @param seconds 秒数
     * @private
     */
    formatUptime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        let result = '';
        if (days > 0)
            result += `${days}天 `;
        if (hours > 0 || days > 0)
            result += `${hours}小时 `;
        result += `${minutes}分钟`;
        return result;
    }
    /**
     * 格式化进程内存使用
     * @param memoryUsage 内存使用对象
     * @private
     */
    formatProcessMemory(memoryUsage) {
        return {
            rss: `${(memoryUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
            external: `${(memoryUsage.external / (1024 * 1024)).toFixed(2)} MB`,
        };
    }
}
exports.HealthMonitor = HealthMonitor;
// 导出单例实例
exports.healthMonitor = new HealthMonitor();
exports.default = exports.healthMonitor;
//# sourceMappingURL=health-monitor.js.map