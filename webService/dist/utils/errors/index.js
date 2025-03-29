"use strict";
/**
 * 错误处理模块导出
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// 错误码定义
__exportStar(require("./error-codes"), exports);
// 基础错误类
__exportStar(require("./app-error"), exports);
// 具体错误类型
__exportStar(require("./types/api-error"), exports);
__exportStar(require("./types/database-error"), exports);
__exportStar(require("./types/datasource-error"), exports);
__exportStar(require("./types/query-error"), exports);
__exportStar(require("./types/validation-error"), exports);
//# sourceMappingURL=index.js.map