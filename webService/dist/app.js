"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("express-async-errors");
const env_1 = __importDefault(require("./config/env"));
const request_logger_middleware_1 = require("./middlewares/request-logger.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const index_1 = __importDefault(require("./api/routes/index"));
const swagger_1 = __importDefault(require("./config/swagger"));
const logger_1 = __importDefault(require("./utils/logger"));
const os_1 = __importDefault(require("os"));
const health_monitor_1 = require("./utils/health-monitor");
const errors_1 = require("./utils/errors");
// 创建Express应用
const app = (0, express_1.default)();
// 安全中间件
app.use((0, helmet_1.default)());
// CORS配置
app.use((0, cors_1.default)());
// 解析JSON请求体
app.use(express_1.default.json());
// 解析URL编码的请求体
app.use(express_1.default.urlencoded({ extended: true }));
// 请求日志中间件 - 使用新的中间件
app.use(request_logger_middleware_1.requestLogger);
// API路由 - 修复：使用配置的API前缀
const apiPrefix = env_1.default.service.apiPrefix || '/api';
logger_1.default.info(`挂载API路由，前缀: "${apiPrefix}"`);
app.use(apiPrefix, index_1.default);
// Swagger文档
(0, swagger_1.default)(app);
// 健康检查端点
app.get('/status', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date(),
        api: 'DataScope API',
        version: process.env.npm_package_version || '1.0.0',
        env: process.env.NODE_ENV || 'development'
    });
});
// 为了向后兼容，保留原健康检查端点，但返回简化信息
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});
// 系统信息端点 - 仅在开发环境可用
if (process.env.NODE_ENV === 'development') {
    app.get('/system-info', (req, res) => {
        // 收集系统信息
        const systemInfo = {
            os: {
                platform: os_1.default.platform(),
                release: os_1.default.release(),
                type: os_1.default.type(),
                arch: os_1.default.arch(),
                cpus: os_1.default.cpus().length,
                totalMemory: `${Math.round(os_1.default.totalmem() / (1024 * 1024 * 1024))} GB`,
                freeMemory: `${Math.round(os_1.default.freemem() / (1024 * 1024 * 1024))} GB`,
                uptime: `${Math.round(os_1.default.uptime() / 3600)} hours`
            },
            process: {
                pid: process.pid,
                version: process.version,
                memoryUsage: process.memoryUsage(),
                uptime: `${Math.round(process.uptime() / 60)} minutes`
            },
            env: {
                node_env: process.env.NODE_ENV,
                port: env_1.default.service.port,
                api_prefix: env_1.default.service.apiPrefix,
                use_mock_data: process.env.USE_MOCK_DATA
            }
        };
        res.json(systemInfo);
    });
}
// 404处理中间件
app.use((req, res, next) => {
    next(errors_1.ApiError.notFound(`未找到请求的路径: ${req.originalUrl}`));
});
// 错误处理中间件 - 使用新的中间件
app.use(error_handler_middleware_1.errorHandler);
// 启动服务器
if (process.env.NODE_ENV !== 'test') {
    const PORT = env_1.default.service.port;
    app.listen(PORT, () => {
        logger_1.default.info(`服务已启动，监听端口: ${PORT}`);
        logger_1.default.info(`API文档地址: http://localhost:${PORT}/api-docs`);
        // 启动健康监控系统
        const monitorInterval = process.env.NODE_ENV === 'production' ? 15 : 5; // 生产环境15分钟，开发环境5分钟
        health_monitor_1.healthMonitor.start();
        logger_1.default.info(`健康监控系统已启动，检查间隔: ${monitorInterval}分钟`);
        // 记录所有已注册的路由
        logger_1.default.info('已注册的路由:');
        app._router.stack.forEach((r) => {
            if (r.route && r.route.path) {
                logger_1.default.info(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
            }
        });
    });
}
// 在应用关闭时停止健康监控
process.on('SIGINT', () => {
    logger_1.default.info('应用正在关闭...');
    health_monitor_1.healthMonitor.stop();
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger_1.default.info('应用正在关闭...');
    health_monitor_1.healthMonitor.stop();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=app.js.map