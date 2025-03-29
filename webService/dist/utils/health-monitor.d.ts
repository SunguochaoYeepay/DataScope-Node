/**
 * 系统健康监控类
 * 用于定期收集并记录系统性能指标
 */
export declare class HealthMonitor {
    private interval;
    private checkIntervalMs;
    /**
     * 创建健康监控实例
     * @param checkIntervalMinutes 检查间隔，单位为分钟，默认为30分钟
     */
    constructor(checkIntervalMinutes?: number);
    /**
     * 启动健康监控
     */
    start(): void;
    /**
     * 停止健康监控
     */
    stop(): void;
    /**
     * 收集并记录系统指标
     * @private
     */
    private collectAndLogMetrics;
    /**
     * 将字节转换为GB
     * @param bytes 字节数
     * @private
     */
    private bytesToGB;
    /**
     * 计算内存使用百分比
     * @private
     */
    private getMemoryUsagePercentage;
    /**
     * 格式化进程运行时间
     * @param seconds 秒数
     * @private
     */
    private formatUptime;
    /**
     * 格式化进程内存使用
     * @param memoryUsage 内存使用对象
     * @private
     */
    private formatProcessMemory;
}
export declare const healthMonitor: HealthMonitor;
export default healthMonitor;
