"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const error_1 = require("../utils/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/**
 * 验证用户令牌的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
function authenticate(req, res, next) {
    try {
        // 从请求头获取Authorization字段
        const authHeader = req.headers.authorization;
        // 检查是否提供了Authorization头
        if (!authHeader) {
            throw new error_1.ApiError('未提供认证令牌', 401);
        }
        // 检查令牌格式
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new error_1.ApiError('认证令牌格式无效', 401);
        }
        const token = parts[1];
        // 验证令牌
        try {
            // 使用开发模式令牌
            if (process.env.NODE_ENV === 'development' && token === 'development-token') {
                req.user = {
                    id: 'dev-user',
                    role: 'admin',
                    email: 'dev@example.com'
                };
                return next();
            }
            // 验证JWT令牌
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            // 将解码后的用户信息添加到请求对象
            req.user = decoded;
            next();
        }
        catch (error) {
            throw new error_1.ApiError('认证令牌无效或已过期', 401);
        }
    }
    catch (error) {
        next(error);
    }
}
/**
 * 验证用户是否具有管理员权限的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 下一个中间件
 */
function requireAdmin(req, res, next) {
    try {
        // 确保用户已经通过身份验证
        if (!req.user) {
            throw new error_1.ApiError('未提供认证令牌', 401);
        }
        // 检查用户角色
        if (req.user.role !== 'admin') {
            throw new error_1.ApiError('需要管理员权限', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.js.map