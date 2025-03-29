"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("../../utils/logger"));
// 日志流配置
const stream = {
    // 使用winston日志记录器写入日志
    write: (message) => logger_1.default.info(message.trim()),
};
// 跳过记录健康检查的日志
const skip = (req, res) => {
    return req.url === '/health' || req.url === '/api/health';
};
// 格式化请求内容
const requestFormat = (tokens, req, res) => {
    const contentLength = tokens.res(req, res, 'content-length');
    return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res) || '0', 10),
        contentLength: contentLength ? parseInt(contentLength, 10) : 0,
        responseTime: parseFloat(tokens['response-time'](req, res) || '0'),
        remoteAddr: tokens['remote-addr'](req, res),
        userAgent: tokens['user-agent'](req, res),
        referrer: tokens.referrer(req, res),
    });
};
// 导出配置好的morgan中间件
const morganMiddleware = (0, morgan_1.default)(requestFormat, {
    stream,
    skip,
});
exports.default = morganMiddleware;
//# sourceMappingURL=logger.js.map