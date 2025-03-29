/**
 * 日志工具
 * 提供统一的日志记录接口
 */
/**
 * 日志记录工具
 */
declare const logger: {
    /**
     * 错误日志
     * @param message 日志消息
     * @param data 附加数据
     */
    error: (message: string, data?: any) => void;
    /**
     * 警告日志
     * @param message 日志消息
     * @param data 附加数据
     */
    warn: (message: string, data?: any) => void;
    /**
     * 信息日志
     * @param message 日志消息
     * @param data 附加数据
     */
    info: (message: string, data?: any) => void;
    /**
     * 调试日志
     * @param message 日志消息
     * @param data 附加数据
     */
    debug: (message: string, data?: any) => void;
};
export default logger;
