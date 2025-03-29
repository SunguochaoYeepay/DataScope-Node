/**
 * 日志工具类
 * 基于winston实现的分级日志记录器
 */
import { Logger } from 'winston';
interface ExtendedLogger extends Logger {
    getSubLogger: (context: Record<string, any>) => {
        error: (message: string, meta?: Record<string, any>) => void;
        warn: (message: string, meta?: Record<string, any>) => void;
        info: (message: string, meta?: Record<string, any>) => void;
        debug: (message: string, meta?: Record<string, any>) => void;
        verbose: (message: string, meta?: Record<string, any>) => void;
    };
}
declare const _default: ExtendedLogger;
export default _default;
