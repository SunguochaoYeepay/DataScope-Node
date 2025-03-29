"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("./error");
/**
 * 请求验证中间件
 */
const validate = (validations) => {
    return async (req, res, next) => {
        // 执行所有验证
        await Promise.all(validations.map(validation => validation.run(req)));
        // 检查是否有验证错误
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // 将验证错误格式化为更友好的格式
        const formattedErrors = errors.array().map(error => ({
            param: error.path || error.param,
            value: error.value,
            message: error.msg
        }));
        // 抛出API验证错误
        throw new error_1.ApiError('输入验证失败', 400, { code: 3000, errors: formattedErrors });
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map